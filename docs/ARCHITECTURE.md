# PawfectCare — Architecture

> Related: [TRD.md](TRD.md) · [DATA-FLOW.md](DATA-FLOW.md) · [AUDIT.md](AUDIT.md) · [INDEX.md](INDEX.md)
> Reflects the code at commit `2efa4db`. Target state marked **→**.

## 1. Shape

Classic two-tier MERN split, two independently-run processes, no SSR, no BFF:

```
┌─────────────────────┐        ┌──────────────────────┐        ┌───────────────┐
│  React 18 SPA       │  JSON  │  Express 4 API       │ driver │ MongoDB Atlas │
│  CRA · :3000        │───────▶│  :5000               │───────▶│ (cloud)       │
│  localStorage: JWT  │ Bearer │  JWT · Mongoose      │        │ 8 collections │
└─────────┬───────────┘        └──────────┬───────────┘        └───────────────┘
          │                               │
          │ redirect to Checkout          │ webhook (signed, raw body)
          ▼                               ▼
     ┌──────────────────────────────────────────┐
     │ Stripe — Checkout, subscriptions, events │
     └──────────────────────────────────────────┘
```

**Why this shape:** the SPA is static-hostable, the API is stateless (JWT, no sessions), so both
scale horizontally and deploy independently. The cost is that **every authorization decision
lives in the API** — the browser is untrusted. That's exactly the assumption the current code
violates ([AUDIT.md](AUDIT.md) B3, S2).

## 2. Frontend layers

```
src/
├─ index.js              entry · BrowserRouter · AuthProvider  ⚠️ duplicate (C1)
├─ App.js                routes · AuthProvider again (C1) · intro gate
├─ context/
│  └─ AuthContext.js     {isAuthenticated, user, login, logout} ← localStorage
├─ pages/                route-level screens (see PAGES.md)
│  ├─ HomePage/ ShopPage/ ContactPage/ Solutions/ TnC/
├─ components/
│  ├─ Account/           account tabs (Orders, Services, Subscription, ManagePet…)
│  ├─ Auth/ Header/ Footer/ IntroAnimation/
│  ├─ ReviewOrder/       checkout: OrderSummary, ShippingBilling, CallToAction
│  ├─ ServiceComponents/ reusable Hero/Pricing/Form/Services sections
│  └─ *Form.jsx          the 5 booking forms
├─ AdminPanel/           self-contained admin SPA-within-SPA  ⚠️ unguarded (B2)
│  ├─ AdminPanel.js      nested <Routes>
│  ├─ components/        Sidebar, UserManagement, AdminIntroAnimation
│  └─ pages/             Dashboard, Users, Orders, Services → 5 service pages
└─ assets/styles/        _variables.scss, _animations.scss, App.scss
```

**State strategy:** deliberately minimal — React Context for auth only, component `useState`
for everything else, no Redux/Zustand/React Query. Reasonable at this size, but it produces two
real problems: cart state is component-local so it dies on refresh (C6), and there's no shared
cache so sibling components refetch the same user independently.

**→ Target:** add `src/api/client.js` as the single HTTP boundary (D5). One axios instance,
`baseURL` from env, a request interceptor attaching the token and a response interceptor turning
401 into logout+redirect. Today **37 call sites each hardcode the host and re-read localStorage**,
which is why nothing can be deployed and why token expiry (C11) surfaces as mysteriously empty
pages.

## 3. Backend layers

```
backend/
├─ server.js             bootstrap · middleware order · inline payment routes (⚠️ see below)
├─ middleware/auth.js    JWT verify → req.user = {id}   ⚠️ id only (C2)
├─ models/               8 Mongoose schemas — the strongest part of the codebase
├─ controllers/          9 controllers, thin and consistent
└─ routes/               10 routers, one per resource
```

**Routing → controller → model** is followed consistently, with two exceptions worth knowing:
`server.js` defines two payment routes **inline** (`/api/payment/create-checkout-session`,
`/api/payments/user/:userId`) instead of in a router, and `routes/user.js`
and `routes/subscription.js` contain inline handlers rather than delegating.
**→ Target:** move these into `routes/payment.js` + `controllers/paymentController.js`.

### Middleware order matters here
`server.js:33-40` gets a subtle thing right:

```js
app.use('/api/webhook', express.raw({type:'application/json'}), webhookRoutes); // 1st
app.use(express.json());                                                        // 2nd
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
```

Stripe signature verification needs the **unparsed** body, so the raw-body webhook route must be
registered *before* `express.json()`. This is correct and easy to break — don't reorder it.

Two gaps: `helmet` is installed but never applied (S4), and the CORS origin is hardcoded
(**→** read from env).

## 4. Trust boundaries — the core architectural defect

```
                    ╎ ← trust boundary: everything left is attacker-controlled
  Browser / curl    ╎   Express API                      MongoDB
 ─────────────────  ╎  ────────────────────────────────  ──────────
  JWT (localStorage)╎→ authMiddleware: is the token valid?  ✅ enforced
  :userId in URL    ╎→ is this token's owner that user?     ❌ COMMENTED OUT (S2)
  /admin navigation ╎→ is this an admin?                    ❌ DOESN'T EXIST (B2/B3)
```

The design has exactly the right single choke point — `middleware/auth.js` — but it only answers
**authentication** (*who are you?*) and never **authorization** (*may you?*).

Concretely:
- `req.user = { id: decoded.id }` — no role, no DB lookup, so no route *can* check privilege.
- Admin routes carry the comment *"no auth for now"* and are mounted bare.
- `/admin/*` in React has no guard, though `/my-account` next to it does.

**→ Target:**
```
authMiddleware   → verifies JWT, loads the User, attaches the full document
requireOwner     → asserts req.user._id === the resource's userId
requireAdmin     → asserts req.user.role === 'admin'
```
Every route then declares its level explicitly, default-deny. See [TRD.md](TRD.md) D2/D3 and
rules R1–R3 in [RULES.md](RULES.md).

## 5. Payments

Stripe-hosted Checkout — **no card data ever reaches our server or browser**, which is the right
call and keeps PCI scope minimal.

```
Subscriptions (correct):
  client → POST /subscription/create-checkout-session → Stripe → redirect
  Stripe → POST /api/webhook (signed) → saveSubscription() → Mongo   ✅ server-authoritative

One-time orders:
  client → POST /payment/create-checkout-session → Stripe → redirect
  Stripe → POST /api/webhook (signed) → saveOrder() → Mongo          ✅ server-authoritative (D6)
```

The subscription path is architecturally correct: Stripe is the source of truth and the webhook
writes the record. The order path makes **the browser responsible for recording a payment** — if
the tab closes on redirect, the money is taken and no order exists (C4). The fix is to use the
webhook that already exists and works.

Plan→price mapping is a hardcoded `switch` on three `price_...` IDs in
`subscriptionController.js`, which throws `'Unknown priceId'` for anything else — brittle, and
those IDs likely belong to a different Stripe account ([SETUP.md](SETUP.md)).

## 6. Configuration

| | Reads from | Reality |
|---|---|---|
| Frontend | `REACT_APP_*`, baked in at build | 8 call sites use it, **37 hardcode localhost** (C9) |
| Backend | `process.env` via dotenv | ⚠️ `server.js:44` hardcodes a **fallback Mongo URI with credentials** |

`server.js:44`:
```js
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<user>:<REDACTED>@...';
```
**→ Fail fast on a missing required var instead of falling back to an embedded secret.**

## 7. Decisions worth keeping

| Decision | Verdict |
|---|---|
| Mongoose schema-level validation (enums, regex, hooks) | **Keep** — genuinely well done |
| Stripe-hosted Checkout | **Keep** — minimal PCI scope |
| Raw-body webhook before `express.json()` | **Keep** — subtle and correct |
| JWT stateless auth | **Keep** at this scale |
| Context-only state | **Keep**, but persist the cart (D7) |
| Admin as nested SPA | **Keep** the structure, **add the guard** (D2) |
| CRA / react-scripts 5 | **Keep** — migrating to Vite is unnecessary churn; it builds fine |
| `req.user = {id}` only | **Change** — blocks all authorization (D2) |
| Browser-confirmed orders | **Change** — move to webhook (D6) |
| 37 hardcoded hosts | **Change** — blocks deployment (D5) |

## 8. Deployment target

```
Frontend → Vercel/Netlify   (static build; REACT_APP_API_URL → API origin)
Backend  → Render/Railway   (Node; env vars set in dashboard)
Database → MongoDB Atlas    (one cluster, local + prod per your decision)
Webhook  → Stripe dashboard endpoint → https://<api>/api/webhook
```

Blocked on D5 (hardcoded hosts) and the env-driven CORS origin. Note that one shared cluster for
dev and prod means local work writes production data — acceptable for a portfolio project, but
use separate **database names** within the cluster if that ever stops being true.
