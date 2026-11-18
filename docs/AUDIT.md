# PawfectCare — Codebase Audit

> **Status:** Verified 2026-11-17 against commit `2efa4db`.
> Every item below was **reproduced or read directly in the source** — nothing here is a guess.
> Related: [RULES.md](RULES.md) · [TRD.md](TRD.md) · [DATA-FLOW.md](DATA-FLOW.md) · [INDEX.md](INDEX.md)

## 0. The headline

The app **builds clean** (`npx react-scripts build` → exit 0, warnings only) and the backend
**boots clean**. That is exactly why this felt "working on the outside": the UI renders, routes
resolve, animations play. The breakage is entirely in the **data and trust layers**, which are
invisible until you click something that needs real data.

| Layer | State |
|---|---|
| React build | ✅ Compiles (400 kB gzip) |
| Express boot | ✅ Starts on :5000 |
| MongoDB | ❌ **Cluster does not exist** |
| Admin auth | ❌ **None at all** |
| Per-user data isolation | ❌ **Disabled in all 5 services** |
| Order durability | ❌ Depends on browser staying open |
| Admin dashboard | ❌ Hardcoded fake numbers |

---

## 1. Blockers — nothing works until these are fixed

### B1. The database is gone
`backend/.env` points at `animal-hospital-cluster.lfiac.mongodb.net`. That hostname **has no DNS
record** — the Atlas cluster was deleted.

```
$ nslookup -type=SRV _mongodb._tcp.animal-hospital-cluster.lfiac.mongodb.net
*** can't find ...: Non-existent domain

$ node server.js
STRIPE_SECRET_KEY loaded successfully
Server running on port 5000
MongoDB connection error: querySrv ECONNREFUSED    ← then exit(1)
```

Confirmed it is **not** a local network issue: `nslookup google.com` resolves fine from the same shell.

**Consequence:** signup, login, every booking, every order, every admin list — all fail. The
server also `process.exit(1)`s on connect failure, so the API dies seconds after boot.

**Fix:** new Atlas cluster → new `MONGODB_URI`. See [SETUP.md](SETUP.md).

### B2. `/admin` has no authentication of any kind
`src/App.js:71` mounts the admin panel wide open:

```jsx
<Route path="/admin/*" element={<AdminPanel />} />   // ← no ProtectedRoute
```

Compare the customer route one line above, which *is* guarded:
```jsx
<Route path="/my-account" element={<ProtectedRoute element={<MyAccountPage/>} />} />
```

`AdminPanel.js` renders an intro animation then the dashboard — there is **no password prompt
anywhere in the component tree**. The `admin password REDACTED_ADMIN_PASSWORD` in the old README is not
referenced by a single line of code.

**Consequence:** anyone who types `/admin` is an admin.

### B3. Every admin API endpoint is unauthenticated
The route files say so out loud. `backend/routes/user.js:57-60`:

```js
router.get('/',       userController.getAllUsers);   // Fetch all users (no auth required)
router.put('/:id',    userController.updateUser);    // Update a user by ID (no auth required)
```

and identically in `adoption.js`, `consultation.js`, `dayCare.js`, `grooming.js`,
`vaccination.js`, `order.js` — each carrying the comment
*"Admin routes (no auth for now, add admin auth in production)"*.

**Consequence:** with the server running, an unauthenticated `curl` can dump every customer's
name, phone, address and pet records, and `DELETE` any of them. For a public portfolio deploy
this is the single most serious issue in the repo.

### B4. The `User` model has no `role` field
`backend/models/User.js` defines username, email, password, phone, address, petName, petType,
breed — and nothing else. So even if routes were guarded, **there is no way to express that
someone is an admin**. B2/B3 cannot be fixed without first adding this field.

---

## 2. Security

### S1. Live credentials committed in `README.md`
`README.md` **is tracked by git** and contains, in plain text:
- Gmail address + password for the Atlas account
- `admin password REDACTED_ADMIN_PASSWORD`
- a second unrelated project's Gmail + admin credentials ("hotelsuite")

`.env` and `backend/.env` are correctly **untracked** (verified: `git ls-files --error-unmatch
backend/.env` → not known to git), but they hold a live Stripe test secret key, a JWT secret and
the old Mongo password.

**Action:** strip from README, purge from git history, rotate the Gmail password. The Mongo
password dies with the deleted cluster; Stripe keys are test-mode but should still be rolled.

### S2. Per-user data isolation is disabled in all five services
Each service's "get my bookings" handler takes `userId` **from the URL** and the ownership check
is commented out. `backend/controllers/vaccinationController.js:48-55`:

```js
const { userId } = req.params;
// TEMPORARY: Auth check disabled to allow data fetching
// if (req.user.id !== userId) {
//   return res.status(403).json({ error: 'Unauthorized access' });
// }
const vaccinations = await Vaccination.find({ userId });
```

Present identically in `adoptionController.js:56`, `consultationController.js:60`,
`dayCareController.js:58`, `groomingController.js:58`.

**Consequence (IDOR):** any logged-in user can read any other user's medical history, phone
number and home address by changing the id in the URL. The token is checked for *validity* but
never for *ownership*. Note `subscription.js:43` does this correctly — it's the one place the
pattern was done right, and it shows the intended shape of the fix.

### S3. `backend/node_modules` is committed to git
~176 packages are tracked. Bloats the repo, and means dependency code ships in history.

### S4. No `helmet` / no rate limiting outside auth
`helmet` and `express-rate-limit` are both **installed** in `backend/package.json` but `helmet`
is never imported in `server.js`, and the rate limiter is applied only inside `routes/auth.js`.

---

## 3. Correctness bugs

### C1. `AuthProvider` is mounted twice
`src/index.js:13` wraps `<App/>` in `AuthProvider`, and `src/App.js:44` wraps the whole tree in
`AuthProvider` **again**. Two independent `useState` auth states exist. The inner provider is the
one `useAuth()` resolves to, so the outer is dead weight that re-reads localStorage on mount.
Harmless today, but it will cause genuinely baffling bugs the moment anything reads auth above
`<Routes>`.

### C2. Billing history can never work
`server.js:160` reads `req.user.stripeCustomerId`:
```js
customer: req.user.stripeCustomerId,
```
But `middleware/auth.js:33` sets **only** the id:
```js
req.user = { id: decoded.id };
```
So `stripeCustomerId` is always `undefined`. There is also no `stripeCustomerId` field on the
`User` model to hold it. `GET /api/payments/user/:userId` therefore always errors or returns junk.

### C3. Subscription fetch hits a URL that doesn't exist
`src/components/Account/Subscription.js:31` requests `/api/subscriptions/user/...` (**plural**).
`server.js:66` mounts `/api/subscription` (**singular**). Guaranteed 404 — and the component
treats 404 as "no subscription", so a paying customer silently sees *no plan*.

### C4. Paid orders are lost if the browser closes — ✅ FIXED (D6)
> `/api/payment/confirm` removed; `routes/webhook.js` `saveOrder()` writes the order on `checkout.session.completed` (idempotent upsert on `orderId`; returns 500 on failure so Stripe retries). The text below is the original finding.

Order rows are written by `GET /api/payment/confirm`, which is called **from the browser** in
`PaymentSuccess.jsx:15`. If the customer closes the tab on Stripe's redirect, money is taken and
**no order is ever recorded**. The endpoint is also unauthenticated and idempotency rests only on
a `unique` index on `orderId`. A `webhook.js` already exists and handles subscriptions correctly —
one-time orders should move there too.

### C5. Cart math ignores quantity, and duplicates instead of incrementing
`ShopPage.jsx:88` pushes a new line every click:
```js
setCart(prevCart => [...prevCart, { ...product, quantity: 1 }]);
```
and the totals never multiply by quantity (`ShopPage.jsx:96-97`):
```js
const totalDiscountPrice = cart.reduce((sum, item) => sum + item.discountPrice, 0);
```
Adding the same item twice shows two rows. Because `quantity` is always 1 the displayed total
happens to be right — but the Stripe line items use `item.quantity`, so **the price shown and the
price charged diverge** the moment quantity is ever editable.

### C6. The cart is lost on refresh
Cart lives in `ShopPage` component state and is handed to checkout via router state
(`navigate('/checkout', { state: { cart, user } })`). Refreshing `/checkout` — or deep-linking to
it — empties the cart.

### C7. The admin dashboard shows fabricated numbers
`AdminPanel/pages/Dashboard.js:19` — the chart is a literal array, with no `fetch` and no
`useEffect` in the file:
```js
data: [5, 20, 7, 8, 6, 9, 5],
```
Those seven numbers never change regardless of real data. For a portfolio piece this is the
detail most likely to be noticed and asked about in an interview.

### C8. `Vaccination.userId` is a `String`, every other model uses `ObjectId`
`models/Vaccination.js:4` → `userId: { type: String }`, vs `ref: 'User'` ObjectId everywhere else.
Breaks `populate()` and makes joins inconsistent. `Vaccination` also stores
`appointmentDate` as a **String** while the other four use `Date`, and it has no `updatedAt`
hook.

### C9. Two parallel API-base conventions
~37 call sites hardcode `http://localhost:5000` while 8 use `process.env.REACT_APP_API_URL`.
A `setupProxy.js` also exists but is bypassed by the absolute URLs. **The app cannot be deployed
anywhere** until these collapse into one base.

### C10. Dead / duplicated code
- `userController.loginUser` duplicates `authController.loginUser`; only the latter is routed.
- Duplicate page components: `pages/AboutPage.js` + `pages/AboutPawfectCare.js`,
  `pages/ContactPage.js` + `pages/ContactPage/ContactPage.js` (only the folder one is routed).
- `public/images/` duplicates `public/assets/images/`.
- `structure.txt` is a 281 kB committed directory dump, now stale.
- Products exist as 60 hardcoded objects in `ShopPage.jsx` with **no `Product` model**, so the
  shop and the admin "Orders" view have no shared source of truth.

### C11. JWT expires in 1h with no refresh
`expiresIn: '1h'` and no refresh flow, so users are silently logged out mid-session; the frontend
has no 401 interceptor, so this surfaces as random blank data rather than a redirect to login.

---

## 4. What is actually well built

Worth stating plainly — this is not a bad codebase, and the docs shouldn't imply it is:

- **Mongoose schemas are genuinely good** — real validation, regex on phone/email, sensible
  enums, `pre('save')` timestamp hooks. Four of five services are consistent.
- **Password handling is correct**: `bcrypt` with cost 10, never returned to the client,
  `.select('-password')` applied consistently.
- **`express-validator` on signup/login** is thorough and correct.
- **Stripe webhook signature verification is done right** (`webhook.js:11`), including the
  subtle part: `express.raw()` mounted *before* `express.json()` in `server.js:33`. That is a
  detail most tutorials get wrong.
- **`subscription.js:43` implements the ownership check correctly** — the template for fixing S2.
- Component structure, SCSS organisation and the animation layer are tidy and consistent.

---

## 5. Fix order

| # | Item | Why first |
|---|---|---|
| 1 | B1 database | Nothing is testable without it |
| 2 | S1 secrets + history purge | Do before any new push |
| 3 | B4 → B2 → B3 role + admin guards | B4 unblocks the other two |
| 4 | S2 ownership checks | Same shape as #3, one line each |
| 5 | C9 single API base | Unblocks deployment |
| 6 | C1, C2, C3 wiring bugs | Small, isolated |
| 7 | C4 webhook orders | Correctness of money |
| 8 | C5, C6 cart | User-visible |
| 9 | C7 real dashboard, C8 schema, C10 cleanup | Polish |

Tracked as deliverables in [TRD.md](TRD.md); the standing constraints these imply are in
[RULES.md](RULES.md).


---

# Resolved 17 Nov 2026

## D1 — Secrets purged from git history  [S1]
`git filter-repo` across all 5 commits. Verified 0 hits for the admin password, Gmail
password, hotelsuite password, Atlas DB password and both email addresses. Force-pushed.
`backend/node_modules` (4,547 files) removed from history.
**Residual risk:** GitHub serves pre-rewrite commits by SHA until Support runs GC.
0 forks. Passwords were rotated, which is the actual mitigation.

## D2 — Admin authentication and authorization  [S2, S3, C9]
| Was | Now |
|---|---|
| `User` had no `role` field | `role` enum `['user','admin']`, default `'user'`, indexed |
| `req.user = { id }` only | `authMiddleware` re-reads the user: `{ id, _id, role, email, username, stripeCustomerId }` |
| 18 admin endpoints with no auth | all 18 behind `authMiddleware` + `requireAdmin` |
| `/admin` rendered for anyone | `AdminRoute` requires `role === 'admin'` |
| `adminPassword === 'PaWfEcTcArE'` in `LoginForm.jsx` | real `POST /api/auth/login` + role check |
| `AuthProvider` mounted twice | mounted once, in `index.js` |
| JWTs written to server logs | removed |
| `patchUser` spread `req.body` wholesale | `role`/`_id`/`__v` stripped |

### Verified (live, against the real database)
- no token -> **401** on all 18 (`GET /api/users` previously returned **200**)
- valid non-admin token -> **403** on all 18
- admin token -> **200** with real data
- malformed token / missing `Bearer` -> **401**
- signup with `"role":"admin"` in the body -> stored as `user` (**blocked**)
- normal user routes (`/api/users/me`) still **200**
- `npx react-scripts build` -> **exit 0**

### Still open after D2
- `requireAdmin` guards the admin *list/update/delete* routes. The per-user ownership
  checks in the 5 service controllers (**D3**) are now restored: a non-admin requesting
  another user's `/user/:userId` gets 403, and the query uses the token's id. *(Done)*
