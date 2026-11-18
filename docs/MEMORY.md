# PawfectCare — Project Memory

> Related: [RULES.md](RULES.md) · [AUDIT.md](AUDIT.md) · [SETUP.md](SETUP.md) · [INDEX.md](INDEX.md)
> **Purpose:** decisions already made and facts already established, so they don't get
> re-litigated or re-discovered. If something here is wrong, correct it here.
> Started 2026-11-17.

---

## Decisions — settled, don't reopen

| # | Decision | Rationale | Date |
|---|---|---|---|
| **M1** | **One Atlas cluster for both local dev and production** | User's call: the whole project is on their side, all reads/writes allowed. Simpler than dual config. ⚠️ Local work therefore writes production data — see R21. | 2026-11-17 |
| **M2** | **Role-based admin auth**: `role` field on `User` + protected routes | Chosen over a separate `Admin` collection — less code, one login, reuses the existing JWT flow. | 2026-11-17 |
| **M3** | **Classification: portfolio project** | Shown to recruiters, possibly deployed publicly ⇒ real security, no leaked secrets, must be deployable. Not a throwaway demo. | 2026-11-17 |
| **M4** | **Purge secrets from git history**, backup branch first, then force-push | README with live credentials is committed. Backup pushed before the rewrite makes it reversible. | 2026-11-17 |
| **M5** | **`Product` model + seed script** | 60 products hardcoded in a component. Moving them to the DB makes shop + admin share one source of truth. | 2026-11-17 |
| **M6** | **Keys handed over in chat**; Claude writes `.env` | User's choice for speed. Values land in conversation history but only ever written to gitignored `.env` files. | 2026-11-17 |
| **M7** | **Docs in `/docs` + `CLAUDE.md` at root** | Version-controlled with the code, visible to recruiters, auto-loaded by Claude Code each session. | 2026-11-17 |
| **M8** | **Keep the existing flow and structure** | Explicit instruction: *"don't change the flow, keep as it is."* Fix defects in place; no CRA→Vite migration, no state library, no renaming. → R19 | 2026-11-17 |

---

## Established facts — verified, don't re-investigate

| # | Fact | How it was verified |
|---|---|---|
| **F1** | **The Atlas cluster `animal-hospital-cluster.lfiac.mongodb.net` is deleted** | `nslookup -type=SRV` → *Non-existent domain*, while `google.com` resolves from the same shell. Server logs `querySrv ECONNREFUSED` then `exit(1)`. |
| **F2** | **The frontend builds clean** | `npx react-scripts build` → **exit 0**, 400.82 kB gzip JS + 40.51 kB CSS. Warnings only (`jsx-a11y/anchor-is-valid`). |
| **F3** | **The backend boots fine** — only the DB fails | Logs `STRIPE_SECRET_KEY loaded successfully` + `Server running on port 5000` before the Mongo error. |
| **F4** | **`.env` and `backend/.env` are NOT tracked by git** | `git ls-files --error-unmatch backend/.env` → *did not match any file(s)*. Only `README.md` leaks secrets. |
| **F5** | **`backend/node_modules` IS tracked** (~176 pkgs) | Appears throughout `git ls-files`. |
| **F6** | **Ownership checks are disabled in all 5 service controllers** | `grep -rn "TEMPORARY"` → adoption:56, consultation:60, dayCare:58, grooming:58, vaccination:50. |
| **F7** | **18 admin endpoints have no middleware at all** | Read directly in `routes/*.js`, each labelled *"no auth for now"*. |
| **F8** | **`/admin/*` has no React guard** | `App.js:71` — bare element, unlike `/my-account` on line 68. |
| **F9** | **The admin dashboard has no `fetch` and no `useEffect`** | `Dashboard.js:19` is a literal `[5,20,7,8,6,9,5]`. |
| **F10** | **37 hardcoded `localhost:5000`** vs 8 using `REACT_APP_API_URL` | `grep -rn` counts. |
| **F11** | **`req.user` is only `{id}`** | `middleware/auth.js:33`. So `server.js:160`'s `req.user.stripeCustomerId` is always `undefined`, and no route *can* check a role. |
| **F12** | **Frontend calls `/api/subscriptions` (plural); server mounts `/api/subscription`** | `Account/Subscription.js:31` vs `server.js:66` → permanent 404. |
| **F13** | **`routes/subscription.js:43` has the ownership check done correctly** | It's the working template for fixing F6. |
| **F14** | **Three display fonts are referenced, none is loaded** | Poppins/Fredoka One/Quicksand in CSS; no `@font-face` and no Google Fonts `<link>` in `public/index.html`. App renders in Arial. |
| **F15** | **Stripe CLI is logged into a *different* account than the project** | CLI `acct_1R0fgUCQeJjWgk2F` vs `.env` key `sk_test_...CKarIwe4Rc...`. The 3 hardcoded `price_` IDs likely don't exist in either. **CLI config also holds a live-mode key** — never to be used here. |
| **F16** | **Tooling present**: Node 24.18.0, npm 11.16.0, mongosh 2.3.8, stripe CLI 1.25.1, gh 2.104.0 (authed as `BuiltWith-Jaydeep`, `repo` scope), Python 3.14 + pip | Version checks. No `mongod`, no Docker (neither needed); `git filter-repo` not installed but pip-installable. |

---

## Open — blocked on the user

| # | Needed | Blocks |
|---|---|---|
| **O1** | **New Atlas connection string** | Everything. [SETUP.md](SETUP.md) step 1 |
| **O2** | **Gmail password rotation** | Closes the S1 exposure (Claude cannot do this) |
| **O3** | **Which Stripe account to standardise on**, and the 3 new `price_` IDs | Subscriptions (F15) |
| **O4** | **Confirm pushing `backup-pre-cleanup` to GitHub** — it will be publicly visible and still contains the old secrets. Local-only is the alternative. | The history purge (M4) |
| **O5** | **Admin seed email + password** (not `REDACTED_ADMIN_PASSWORD` — it's in the exposed README) | Seed script (M5) |

---

## Rejected alternatives — and why

| Considered | Rejected because |
|---|---|
| Local MongoDB for dev | User wants one cluster for both (M1); `mongod` isn't installed anyway |
| Separate `Admin` collection | More code, second login flow; role field reuses existing auth (M2) |
| Leaving admin unprotected | Incompatible with a public portfolio deploy (M3) |
| Squashing to one clean commit | User chose backup-then-purge to preserve history (M4) |
| Migrating CRA → Vite | Churn with no benefit; the build already works (M8, R19) |
| Adding Redux / React Query | Context is adequate at this size (M8) |
| Claude Docs instead of repo files | Not version-controlled, invisible to recruiters (M7) |

---

## Things that are genuinely good — don't "fix" these

Stated so no future pass mistakes them for problems:

- **Mongoose schemas** — real validation, regex, enums, `pre('save')` hooks. The best part of the codebase.
- **bcrypt usage** — cost 10, never returned, `.select('-password')` applied consistently.
- **Stripe webhook signature verification** — correct, including `express.raw()` before
  `express.json()`. Most tutorials get this wrong. → R8
- **`express-validator` on signup/login** — thorough.
- **Component/SCSS organisation and the Framer Motion layer** — tidy and consistent.
- **Nested admin routing** (`AdminPanel` → `Services` → 5 pages) — correctly wired; only the
  guard is missing.


## Added 17 Nov 2026 (D1 + D2)

### M9 — Admin authorization model
`User.role` is an enum `['user','admin']`, default `'user'`, indexed. Server-side
`requireAdmin` (in `backend/middleware/auth.js`) is the enforcement point; the React
`AdminRoute` in `src/App.js` is UX only. **Decision: default-deny** — a missing or
unrecognised role is refused.

### M10 — authMiddleware re-reads the user
`authMiddleware` now loads the user from MongoDB on every request instead of trusting
the JWT payload, so a role change or account deletion takes effect immediately rather
than at token expiry. Cost: one indexed `findById` per authenticated request. This also
fixed `req.user.stripeCustomerId` being permanently `undefined`.

### M11 — Admin easter egg kept, made real
The hover-reveal admin door in `LoginForm.jsx` was kept (user's choice) but the
hardcoded `=== 'PaWfEcTcArE'` comparison was replaced with a real
`POST /api/auth/login` + `role === 'admin'` check.

### M12 — Single AuthProvider
`AuthProvider` was mounted in BOTH `index.js` and `App.js`, creating two independent
auth states that could disagree. The `App.js` one was removed; `index.js` is the single
source of truth. This was a prerequisite for `AdminRoute` to read a reliable `user.role`.

### M13 — Git history purged
`git filter-repo` rewrote all 5 commits: 4 credentials + 2 email addresses redacted,
`backend/node_modules` (4,547 files) removed. Force-pushed to `main`
(`2efa4db` -> `04d589d`). **Caveat: GitHub still serves the pre-rewrite commits by SHA
until GitHub Support garbage-collects them.** Rotation, already done, was the real fix.

### F17 — Admin seed is promote-not-overwrite
`npm run seed:admin` promotes an existing account and leaves its password alone;
`-- --reset-password` is required to overwrite it. The admin account
(`cppraja5722@gmail.com`) predates this work (created 2025-04-12).
