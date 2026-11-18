# PawfectCare — Engineering Rules

> Related: [AUDIT.md](AUDIT.md) · [TRD.md](TRD.md) · [MEMORY.md](MEMORY.md) · [INDEX.md](INDEX.md)
> Loaded automatically each session via [`../CLAUDE.md`](../CLAUDE.md).

These are **constraints, not suggestions.** Each exists because the codebase already broke this
way once — the audit ID after each rule is the proof. Don't relax one without saying so out loud.

---

## Security & authorization

### R1 — Never trust a client-supplied identifier for authorization
Derive the actor from the **verified token**, never from a URL param, query string or body.

```js
// ❌ this exact pattern caused S2 — five times
const { userId } = req.params;
const docs = await Model.find({ userId });

// ✅
const docs = await Model.find({ userId: req.user._id });
```
If a route must accept `:userId`, assert ownership before querying — and admins pass only via
`requireAdmin`. *(S2, B3)*

### R2 — Every route declares its access level explicitly, default-deny
No route ships without `authMiddleware`, `requireAdmin`, or an intentional `// PUBLIC:` comment
stating why. **"No auth for now" is banned** — that comment shipped on 18 live endpoints. *(B3)*

### R3 — Never comment out a security check
Not temporarily, not to debug, not to make data appear. If a check blocks you, the check is
right and the query is wrong. Five `// TEMPORARY:` comments became permanent and are the most
serious defect in this repo. *(S2)*

### R4 — No secret in the repo, ever
Secrets live only in `.env` / `backend/.env` (both gitignored). Commit `.env.example` with empty
placeholders. **Never** in README, comments, docs, or as a code fallback:
```js
// ❌ server.js:44 shipped a real password this way
const uri = process.env.MONGODB_URI || 'mongodb+srv://user:realpassword@...';
// ✅
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
```
*(S1)*

### R5 — Nothing secret in the frontend bundle
Everything `REACT_APP_*` is **public** — it's compiled into JS anyone can read. Publishable
Stripe keys (`pk_`) only. A secret key (`sk_`) in `.env` is a leak the moment you build.

### R6 — Don't log secrets or tokens
`middleware/auth.js` currently logs every verification with the user id, and `authController`
`console.log`s the full JWT and the whole response object on every login. Strip before deploy.

### R7 — Money is server-authoritative
Order and subscription records are written by the **Stripe webhook**, never by a browser
callback. Verify the signature, keep the raw body, make writes idempotent. The browser may *show*
success; it may never *record* it. *(C4)*

---

## Data & correctness

### R8 — Don't reorder the webhook middleware
`express.raw()` for `/api/webhook` **must** stay registered before `express.json()`
(`server.js:33`). Reordering silently breaks signature verification. This is correct today —
leave it.

### R9 — `userId` is `ObjectId` with `ref: 'User'`, always
`Vaccination` uses `String` and breaks `populate()`. Dates are `Date`, never `String`. *(C8)*

### R10 — Validate at the schema, not only in the controller
Mongoose schemas here are the strongest asset — enums, regex, `min`. Keep new fields that way so
every write path is protected, not just the one you remembered.

### R11 — Hash passwords on every write path
Hashing lives in controllers, not a `pre('save')` hook, so **each** create/update must call
`bcrypt.hash(pw, 10)`. Never return `password` — always `.select('-password')`.

### R12 — Data the server needs doesn't live in `localStorage`
Only the JWT, the cached user blob, and the cart belong there. `ManagePet.js` stores real pets in
`localStorage.localPets` — invisible to the server and the admin panel. Don't add more.

---

## Configuration & deployability

### R13 — Zero hardcoded hosts
No `http://localhost:5000` in source. All frontend HTTP goes through `src/api/client.js` using
`REACT_APP_API_URL`; backend reads CORS origin from env. 37 hardcoded URLs are why this can't
deploy. *(C9)*

### R14 — Fail fast and loudly on missing config
Throw with a clear message naming the variable. Never substitute a silent default — and never a
default containing credentials. *(R4)*

---

## Frontend

### R15 — One `AuthProvider`, mounted once
It's currently mounted in both `index.js` and `App.js`, creating two independent auth states.
One provider, at the top, only. *(C1)*

### R16 — Handle 401 in exactly one place
The axios response interceptor: clear storage, `logout()`, redirect to `/login`. Tokens expire in
1h with no refresh, so without this, expiry looks like random blank pages. *(C11)*

### R17 — Cart math must respect quantity
Adding an existing item **increments `quantity`**; it never appends a duplicate row. Totals are
`Σ(price × quantity)`. The UI total and the Stripe line items must agree — they currently can
diverge. *(C5)*

### R18 — Don't fabricate data in the UI
No placeholder arrays posing as real metrics. The admin dashboard's `[5,20,7,8,6,9,5]` is the
thing most likely to be caught in an interview. Fetch it or show an empty state. *(C7)*

---

## Process

### R19 — Don't restructure what already works
The flow, routing shape, component organisation, Mongoose schemas, Stripe Checkout approach and
the nested admin SPA are **keepers**. Fix defects in place. No framework migrations (CRA stays),
no state-library additions, no renaming for taste. Explicit user instruction: *keep the flow as
it is.*

### R20 — Verify, don't assume
Every claim in these docs was reproduced — build run, server booted, DNS queried, line numbers
read. Before reporting something fixed, run it. If it fails, say so with the output. Never state
a cluster/key/endpoint works without a command that proves it.

### R21 — Ask before destructive or outward-facing actions
Force-push, history rewrite, DB drop, deleting files, anything hitting a live Stripe account:
confirm first. One shared Atlas cluster serves dev **and** prod, so a careless local script
writes production data.

### R22 — Keep these docs true
Changing behaviour means updating the affected doc in the same change. Stale docs are worse than
none. Audit IDs (B1, S2, C7…) are stable — reference, don't renumber. Mark items done rather
than deleting them, so the history of what was wrong stays legible.

---

## Pre-commit checklist

- [ ] No secret added (`git diff` scanned for keys/passwords/URIs)
- [ ] Every new route states its access level; none default-open
- [ ] No security check commented out
- [ ] `userId` from token, not from params
- [ ] No hardcoded `localhost`
- [ ] `npm run build` exits 0
- [ ] Backend boots and prints `Connected to MongoDB`
- [ ] Auth probes return 401/403:
      `curl localhost:5000/api/users` → **401**
      `curl -H "Authorization: Bearer <A>" .../user/<B_id>` → **403**
- [ ] Affected docs updated


## R23 — Authorization is enforced on the server, never only in React
A React guard such as `AdminRoute` stops the wrong UI rendering; it stops nothing else.
Anyone can call the API directly with `curl`. Every privileged route must apply
`authMiddleware` then `requireAdmin` server-side. *(Added after D2: `/admin` had a
client-side password check and the API had no guard at all.)*

## R24 — `role` never comes from a request body
Not on signup, not on update, not via `{ ...req.body }`. It is set only by
`npm run seed:admin` or directly in the database. Allowlist fields on every write that
touches a user document. *(Added after D2: `patchUser` spread the whole body.)*
