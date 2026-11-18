# PawfectCare — Data Flow

> Related: [ARCHITECTURE.md](ARCHITECTURE.md) · [PAGES.md](PAGES.md) · [AUDIT.md](AUDIT.md) · [INDEX.md](INDEX.md)
> Traced through the real source at commit `2efa4db`. ❌ marks where a flow breaks today.

## How to use this doc

When something shows up empty or wrong, find the flow below and walk it. Each one names the
actual file and line that handles each hop, so you can put a breakpoint in the right place
instead of guessing.

---

## F1 — Signup

```
SignupForm.jsx:98  axios.post /api/auth/signup
   │ {username,email,password,phone,address,petName,petType,breed}
   ▼
routes/auth.js     rate limit (100/15min/IP) → express-validator
   │               400 {errors:[...]} on failure
   ▼
authController.signupUser
   │ 1. User.findOne({$or:[{email},{username}]})  → 400 if taken
   │ 2. bcrypt.hash(password, 10)
   │ 3. new User(...).save()                      → schema validation fires here
   │ 4. jwt.sign({id}, JWT_SECRET, {expiresIn:'1h'})
   ▼
201 {message, token, user{id,username,email,phone,address,petName,petType,breed}}
   ▼
AuthContext.login(token, userData)
   └─ localStorage: 'token', 'user' → setIsAuthenticated(true)
```

**Note:** the password is hashed in the controller, **not** in a Mongoose `pre('save')` hook.
So `userController.createUser`/`updateUser`/`patchUser` must each hash too — they do, but any
new write path must remember. A hook would be safer (D9).

## F2 — Login & session restore

```
LoginForm.jsx:47 → POST /api/auth/login → authController.loginUser
   │ User.findOne({email}) → bcrypt.compare → jwt.sign
   ▼ {token, user}  → AuthContext.login → localStorage

On page reload:
AuthContext.js:10 useEffect
   └─ reads localStorage 'token' + 'user' → setIsAuthenticated(true)
      ⚠️ trusts the stored blob; never validates the token against the server.
      An expired token still renders a "logged in" UI until a request 401s (C11).
```

❌ **C1:** `AuthProvider` wraps the tree **twice** (`index.js:13` and `App.js:44`), so two
independent auth states exist. `useAuth()` resolves to the inner one.

## F3 — Book a service (all 5 are identical)

```
Service page → "Book" → ProtectedRoute? ──not logged in──▶ /login
   │ logged in
   ▼
<ServiceForm>.jsx   token = localStorage.getItem('token')
   │ POST /api/{service}   Authorization: Bearer <token>
   ▼
middleware/auth.js   jwt.verify → req.user = {id}          ⚠️ id only (C2)
   ▼
{service}Controller.create{Service}
   │ manual required-field check → 400
   │ new Model({ userId: req.user.id, ...req.body })        ✅ userId from TOKEN — correct
   │ .save() → schema validation (phone regex, enums, min)
   ▼
201 {message, <service>}  → toast → user lands in My Account
```

This write path is **correct**: `userId` comes from the verified token, never from the request
body, so a user can't create a booking owned by someone else.

## F4 — "My bookings" ❌ **BROKEN — this is the IDOR**

```
MyAccountPage → Account/Services.js:48-96
   │ 5 parallel fetches:
   │   `${REACT_APP_API_URL}/api/consultations/user/${userId}`
   │   ...grooming, adoption, daycare, vaccinations
   ▼
middleware/auth.js   ✅ token is valid?
   ▼
{service}Controller.getUser{Service}
   │ const { userId } = req.params;        ← ⚠️ FROM THE URL
   │ // TEMPORARY: auth check disabled
   │ // if (req.user.id !== userId) return 403     ← ❌ COMMENTED OUT
   │ Model.find({ userId })
   ▼
200 [...]  — of WHOEVER'S ID WAS IN THE URL
```

Disabled in all five: `adoptionController.js:56`, `consultationController.js:60`,
`dayCareController.js:58`, `groomingController.js:58`, `vaccinationController.js:50`.

**Any logged-in user can read any other user's phone, address and medical history** by editing
the id in the URL. The token proves *who you are* but nothing checks *whose data you asked for*.

✅ **The correct version already exists** — `routes/subscription.js:43`:
```js
if (req.user.id !== userId) {
  return res.status(403).json({ error: 'Unauthorized access to subscription data' });
}
```
Copy that shape (D3). Better still: ignore the URL param and query `{ userId: req.user.id }`.

## F5 — Shop → cart → checkout

```
ShopPage.jsx:23  useEffect → 60 hardcoded product objects   ❌ no DB, no Product model (C10)
   ▼ setProducts()
filters (category, price range, search) applied client-side
   ▼
addToCart (line 88):  setCart([...prevCart, {...product, quantity:1}])
   ❌ C5 — pushes a DUPLICATE ROW instead of incrementing quantity
   ❌ C5 — totals (line 96-97) sum price and never multiply by quantity
   ▼
navigate('/checkout', { state: { cart, user } })
   ❌ C6 — cart lives in router state + component state; refresh or deep-link = empty cart
   ▼
ReviewOrder → ShippingBilling.jsx:20 GET /api/users/me   (prefill address)
   ▼
CallToAction.jsx:38 POST /api/payment/create-checkout-session  🔑
   ▼
server.js:68  builds Stripe line_items
   │ unit_amount: item.discountPrice * 100   (INR → paise)
   │ quantity:    item.quantity              ← uses quantity, but the UI total didn't (C5)
   │ metadata: { userId, cart: JSON.stringify(cart) }   ⚠️ 500-char Stripe limit; big carts truncate
   ▼
{sessionId} → stripe.redirectToCheckout → Stripe-hosted page
```

## F6 — Order recording ❌ **BROKEN — money can be taken with no order**

```
Stripe → redirects browser → /payment-success?session_id=...
   ▼
PaymentSuccess.jsx      (display only — the order is written by the webhook, D6)
   ▼
server.js:110
   │ stripe.checkout.sessions.retrieve(session_id, {expand:['line_items']})
   │ if (payment_status === 'paid'):
   │    cart = JSON.parse(session.metadata.cart)
   │    new Order({userId: metadata.userId, orderId: session.id, ...}).save()
   ▼
Order row                               ← ONLY IF THE BROWSER MADE THIS CALL
```

❌ **C4:** the **browser** is responsible for recording the payment. Close the tab during
redirect → paid, no order, no record. Idempotency rests solely on the `unique` index on
`orderId`. `PaymentSuccess.jsx` also redirects home after 5s regardless of whether the call
succeeded, and only `console.log`s the result.

**Fix (D6):** record the order in `webhook.js` on `checkout.session.completed` — the webhook is
already wired, signature-verified, and does exactly this correctly for subscriptions.

## F7 — Subscription ✅ server-authoritative

```
PricingSection.js:24 POST /api/subscription/create-checkout-session {priceId}  🔑
   ▼ mode:'subscription', metadata:{userId} → {url} → redirect
Stripe → POST /api/webhook  (raw body + stripe-signature)
   ▼
webhook.js:11  stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET)
   │ ✅ verified — invalid signature → 400, and raw body is preserved because
   │    express.raw() is mounted BEFORE express.json() (server.js:33). Don't reorder.
   ▼ event 'checkout.session.completed'
subscriptionController.saveSubscription(userId, subscriptionId, session)
   │ stripe.subscriptions.retrieve → priceId
   │ switch(priceId) → plan name + 6 planDetails fields
   │   ⚠️ hardcoded price_1R7Uhr/1R7UkZ/1R7UmV → throws 'Unknown priceId' otherwise
   │   ⚠️ those IDs likely belong to a different Stripe account (see SETUP.md)
   ▼ new Subscription(...).save()
```

## F8 — Viewing your subscription ❌ **404s silently**

```
Account/Subscription.js:31
   GET `${REACT_APP_API_URL}/api/subscriptions/user/${user.id}`   ← PLURAL
                                      ▼
server.js:66  app.use('/api/subscription', ...)                   ← SINGULAR
                                      ▼
                            404 — route doesn't exist
                                      ▼
Subscription.js:43  `if (status === 404) setSubscription(null)`
   → component shows "no plan" to a PAYING customer (C3)

Then line 63: GET /api/payments/user/:userId
   ▼ server.js:160  customer: req.user.stripeCustomerId
                              └─ ❌ auth.js:33 only sets {id}; field doesn't exist
                                 on the User model either → always undefined (C2)
```

Two independent bugs stacked: wrong URL, and a field that was never implemented.

## F9 — Admin ❌ **no authentication anywhere in this flow**

```
Anyone types /admin
   ▼
App.js:71  <Route path="/admin/*" element={<AdminPanel/>} />   ❌ no ProtectedRoute (B2)
   ▼
AdminPanel.js → intro animation → Sidebar + nested <Routes>
   ▼
pages/Users.js:35   fetch http://localhost:5000/api/users
   ▼
routes/user.js:57   router.get('/', userController.getAllUsers)   ❌ NO MIDDLEWARE (B3)
   ▼
200 [every user: username, email, phone, address, pet details]
```

Same for all 5 service pages and Orders: `GET /`, `PUT /:id`, `DELETE /:id` — **all bare**.
A plain `curl` with no token can dump or delete every record.

**Admin Dashboard** (`AdminPanel/pages/Dashboard.js:19`) contains **no `fetch` and no
`useEffect` at all** — the chart is a literal:
```js
data: [5, 20, 7, 8, 6, 9, 5],
```
Those numbers never change (C7).

## F10 — Token lifecycle

```
login/signup → jwt.sign({id}, secret, {expiresIn:'1h'}) → localStorage
every request → Authorization: Bearer <token> (read fresh from localStorage at each of 37 sites)
after 1h     → jwt.verify throws TokenExpiredError → 401 {error:'Token has expired...'}
                 ▼
          ❌ no interceptor, no refresh token, no auto-logout.
          AuthContext still says isAuthenticated=true, so the UI looks logged in
          while every request fails. Surfaces as random blank sections (C11).
```

**Fix (D5):** one axios instance whose response interceptor calls `logout()` and redirects on
401. Also note `middleware/auth.js:30` logs every successful verification **including the user
id**, and `authController` `console.log`s the full JWT on login — remove before any deploy.

---

## Where data actually lives

| Data | Today | Target |
|---|---|---|
| JWT | `localStorage.token` | unchanged (document the XSS trade-off) |
| User profile | `localStorage.user` + `GET /users/me` | server is source of truth |
| Cart | component state + router state ❌ | `localStorage`, rehydrated (D7) |
| Products | hardcoded in `ShopPage.jsx` ❌ | `Product` collection (D7) |
| Pets | `User.petName/petType/breed` + `localStorage.localPets` ⚠️ | proper `Pet` collection (future) |
| Bookings/Orders/Subs | MongoDB ✅ | unchanged |
| Admin stats | hardcoded array ❌ | `GET /api/admin/stats` (D8) |

> `Account/ManagePet.js:25` keeps extra pets in `localStorage.localPets` — invisible to the
> server, lost on cache clear, and never seen by the admin panel.
