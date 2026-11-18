# PawfectCare — Technical Requirements Document

> Related: [ARCHITECTURE.md](ARCHITECTURE.md) · [DATA-FLOW.md](DATA-FLOW.md) · [AUDIT.md](AUDIT.md) · [RULES.md](RULES.md) · [INDEX.md](INDEX.md)
> Verified against commit `2efa4db`, 2026-11-17.

## 1. Stack (as installed — versions are real, not aspirational)

### Frontend
| Package | Version | Role |
|---|---|---|
| react / react-dom | 18.3.1 | UI |
| react-scripts | 5.0.1 | CRA build (no Vite, no eject) |
| react-router-dom | 6.30.0 | Routing |
| framer-motion | 12.4.4 | Animation |
| axios | 1.7.9 | HTTP (mixed with `fetch` — see C9) |
| @stripe/stripe-js | 5.10.0 | Checkout redirect |
| chart.js + react-chartjs-2 | 4.4.8 / 5.3.0 | Admin charts |
| sass | 1.85.1 | SCSS |
| bootstrap | 5.3.3 | Partial grid/utilities |
| react-hot-toast, react-modal, fuse.js, date-fns, react-icons, tsparticles | | UX bits |

> `package.json` also lists `express`, `mongoose`, `mongodb`, `cors`, `nodemon` as **frontend**
> dependencies. They're unused by the browser bundle — leftovers to remove (D9).

### Backend
| Package | Version | Role |
|---|---|---|
| express | 4.21.2 | HTTP |
| mongoose | 8.12.1 | ODM |
| jsonwebtoken | 9.0.2 | JWT (HS256, 1h) |
| bcrypt | 5.1.1 | Password hashing, cost 10 |
| stripe | 17.7.0 | Payments |
| express-validator | 7.2.1 | Input validation |
| express-rate-limit | 7.5.0 | Auth throttling (auth routes only) |
| helmet | 8.0.0 | ⚠️ **installed but never imported** (S4) |
| dotenv | 16.4.7 | Env |

Runtime: Node **v24.18.0**, npm 11.16.0. No TypeScript, no test framework wired
(`App.test.js` is the CRA stub).

## 2. Data model

Eight collections. `userId` is `ObjectId → User` everywhere **except `Vaccination`** (C8).

```
User ──┬── Consultation   (estimatedPrice, appointmentDate: Date)
       ├── Grooming       (coatType, groomingPreference enums)
       ├── DayCare        (boardingStart/EndDate, socialization enum)
       ├── Vaccination    ⚠️ userId: String, appointmentDate: String
       ├── Adoption       (housingType, landlordApproval, homeVisitAgreement)
       ├── Order          (orderId unique, paymentIntentId, products[])
       └── Subscription   (paymentId, plan, planDetails{6 fields})
```

**Shared booking shape** — the four consistent services all carry: `userId`, `name`, `phone`
(`/^\d{10}$/`), `address`, pet fields, `appointmentDate: Date`,
`appointmentTime ∈ {9 to 12, 1 to 4, 4 to 7}`, `estimatedPrice`, `createdAt`/`updatedAt` with a
`pre('save')` hook.

### Required schema changes
| Change | Reason |
|---|---|
| `User.role: 'user'\|'admin'`, default `'user'` | D2 — no way to express admin today (B4) |
| `User.stripeCustomerId: String` | D6 — billing history reads a field that doesn't exist (C2) |
| New `Product` model | D7 — 60 products hardcoded in a component (C10) |
| `Vaccination.userId` → ObjectId, `appointmentDate` → Date | D8 — consistency (C8) |
| `Order.status` add `'refunded'`; index `userId` | D7 |

## 3. API contract

Base `/api`. Auth: `Authorization: Bearer <JWT>`.
**Legend:** 🔓 public · 🔑 any logged-in user · 👑 admin only · ❌ *currently unprotected but must not be*

### Auth
| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/auth/signup` | 🔓 | validated; 100 req/15min/IP |
| POST | `/auth/login` | 🔓 | returns `{token, user}` |

### Users
| Method | Path | Access | Now |
|---|---|---|---|
| GET | `/users/me` | 🔑 | ✅ |
| PUT | `/users/me` | 🔑 | ✅ |
| GET | `/users` | 👑 | ❌ **wide open** |
| POST | `/users` | 👑 | 🔑 only |
| PUT | `/users/:id` | 👑 | ❌ **wide open** |
| DELETE | `/users/:id` | 👑 | 🔑 only |

### Services — identical shape for `consultations`, `grooming`, `daycare`, `adoption`, `vaccinations`
| Method | Path | Access | Now |
|---|---|---|---|
| POST | `/{service}` | 🔑 | ✅ |
| GET | `/{service}/user/:userId` | 🔑 **owner only** | ❌ **ownership check commented out** (S2) |
| GET | `/{service}` | 👑 | ❌ **wide open** |
| PUT | `/{service}/:id` | 👑 | ❌ **wide open** |
| DELETE | `/{service}/:id` | 👑 | ❌ **wide open** |

### Orders, payments, subscriptions
| Method | Path | Access | Notes |
|---|---|---|---|
| GET | `/orders/me` | 🔑 | ✅ |
| GET | `/orders` | 👑 | ❌ wide open |
| PUT | `/orders/update/:id` | 👑 | ❌ wide open |
| POST | `/payment/create-checkout-session` | 🔑 | ✅ |
| GET | `/payments/user/:userId` | 🔑 owner | ⚠️ broken — C2 |
| POST | `/subscription/create-checkout-session` | 🔑 | ✅ |
| GET | `/subscription/user/:userId` | 🔑 owner | ✅ **correct — the template for S2** |
| POST | `/webhook` | 🔓 + signature | ✅ raw body, verified |

**Contract note:** frontend calls `/api/subscriptions/...` (plural); server mounts
`/api/subscription` (singular) → permanent 404 (C3). Singular wins; fix the client.

## 4. Deliverables

Each resolves specific audit IDs. Ordered by dependency.

### D1 — Secrets & history 🔒
Strip credentials from `README.md`; add `.env.example` ×2 with placeholders; generate a fresh
`JWT_SECRET` (`crypto.randomBytes(32).toString('hex')`); push `backup-pre-cleanup`; purge
`README.md` secrets + `backend/node_modules` from all history with `git filter-repo`;
force-push; add `backend/node_modules` to `.gitignore`.
*Resolves S1, S3. Needs: your confirmation on the backup branch + Gmail rotation.*

### D2 — Roles & admin auth
`User.role` enum; `requireAdmin` middleware (verify JWT → load user → assert role); apply to
every 👑 route; `authMiddleware` attaches the **full user**, not just `{id}`; React
`AdminRoute` guard + admin login; seed one admin.
*Resolves B2, B3, B4.*

### D3 — Restore data isolation
Uncomment and correct the five ownership checks; prefer deriving `userId` from the token over
trusting the URL param. Admins bypass via `requireAdmin`.
*Resolves S2.*

### D4 — Database restore 🔒
Write real `MONGODB_URI`; append `/pawfectcare` db name; verify with `mongosh`; make Mongoose
retry/log rather than `process.exit(1)` on first failure.
*Resolves B1. Needs: your Atlas connection string.*

### D5 — One API base
Create `src/api/client.js` (axios instance, `baseURL` from `REACT_APP_API_URL`, token
interceptor, 401 → logout+redirect); replace all **37** hardcoded `http://localhost:5000`
occurrences; delete `setupProxy.js` or align it.
*Resolves C9, C11 (partially).*

### D6 — Payment correctness
Move one-time order creation into `webhook.js` on `checkout.session.completed`; make it
idempotent on `orderId`; store `stripeCustomerId` on User at first checkout; fix billing history;
fix the plural/singular URL.
*Resolves C2, C3, C4.*

### D7 — Products & seed
`Product` model; `GET /api/products` (+ admin CRUD); migrate the 60 objects out of
`ShopPage.jsx`; `npm run seed` → products + admin user; fix cart quantity math + persist cart to
`localStorage`.
*Resolves C5, C6, C10 (products).*

### D8 — Real admin dashboard + schema cleanup
`GET /api/admin/stats` returning real `countDocuments` per collection; wire the chart to it;
normalise `Vaccination`; add indexes.
*Resolves C7, C8.*

### D9 — Hygiene
Remove the double `AuthProvider` (C1); import `helmet`; broaden rate limiting; drop unused
backend deps from frontend `package.json`; delete duplicate pages/images, `structure.txt`,
`userController.loginUser`; rewrite `README.md`.
*Resolves C1, S4, C10.*

## 5. Non-functional requirements

| Area | Requirement |
|---|---|
| Security | No secret in repo/history/bundle; bcrypt ≥10; JWT ≥32-byte secret; `helmet` on; rate-limit auth; CORS allowlist from env (currently hardcoded `localhost:3000`) |
| Authorization | Default-deny: every route states its access level; ownership asserted server-side from the token |
| Payments | Stripe Checkout only — **no card data on our servers**; webhook signature always verified; order writes idempotent |
| Performance | Bundle ≤ 500 kB gzip (currently **400 kB** ✅); index every `userId` and `Order.orderId` |
| Config | Zero hardcoded hosts; all env-driven |
| Errors | No stack traces to clients; no secrets or tokens in logs (auth middleware currently logs every token verification) |
| Compatibility | Node ≥ 20 (dev: 24.18.0); last 2 versions of evergreen browsers |

## 6. Testing

None exists today. Minimum bar before calling D1–D9 done:
- `npm run build` exits 0 ✅ *(already true)*
- Backend boots and prints `Connected to MongoDB`
- Manual pass of J1–J4 from [PRD.md](PRD.md)
- **Authorization probes** (the bugs that hid here before):
  ```bash
  curl localhost:5000/api/users                       # expect 401
  curl -H "Authorization: Bearer <userA>" \
       localhost:5000/api/vaccinations/user/<userB_id> # expect 403
  ```


---

## Deliverable status (17 Nov 2026)

| ID | Status |
|---|---|
| D1 Purge secrets + drop node_modules | **Done** — verified; GitHub GC still pending |
| D2 role + requireAdmin + AdminRoute + admin login | **Done** — verified live |
| D3 Re-enable 5 ownership checks | **Done** — verified live (403 / 200 / admin 200) |
| D4 Wire + verify database | **Done** (Step 1) |
| D5-D9 | Not started |

### D2 API contract change
`POST /api/auth/login` and `POST /api/auth/signup` now return `user.role`.
All admin routes return **401** without a token and **403** for `role !== 'admin'`.
`User` gains `role: 'user' | 'admin'` (default `'user'`, indexed).
