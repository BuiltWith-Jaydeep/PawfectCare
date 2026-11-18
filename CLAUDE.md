# CLAUDE.md — PawfectCare

Instructions for Claude Code working in this repo. Read this first, every session.

## Read before you act

| Doc | When |
|---|---|
| **[docs/HANDOVER.md](docs/HANDOVER.md)** | **First, every session.** Current status, phase order, known traps |
| **[docs/RULES.md](docs/RULES.md)** | **Always.** 24 hard constraints; each exists because this code broke that way |
| [docs/MEMORY.md](docs/MEMORY.md) | Before proposing anything — settled decisions and verified facts live here |
| [docs/AUDIT.md](docs/AUDIT.md) | Before "fixing" anything — it's probably already catalogued |
| [docs/INDEX.md](docs/INDEX.md) | Hub for PRD, TRD, architecture, data flow, pages, design |

## What this is

React 18 (CRA) SPA + Express 4 / MongoDB API. Pet-care platform: 5 service bookings
(consultation, grooming, daycare, vaccination, adoption), a 60-product shop, Stripe
subscriptions, customer account area, admin panel. **Portfolio project** — recruiters may read
this repo and it may be deployed publicly.

```
pawfectcare/
├── src/              React app (pages/, components/, AdminPanel/, context/)
├── backend/          Express API (models/, controllers/, routes/, middleware/)
├── docs/             ← all documentation
└── CLAUDE.md
```

Run it: `cd backend && npm start` (:5000) and `npm start` in root (:3000).

## Current state — read this before debugging anything

Last updated 18 Nov 2026 (commit `2f916f9`). **Goal: get this site live.**

Fixed and verified:
- ✅ **Database works** — Atlas cluster running; data is in the `test` database
- ✅ **D1** — secrets purged from git history, `node_modules` dropped
- ✅ **D2** — `role` field, `requireAdmin`, `AdminRoute`, real admin login.
  All 18 admin endpoints verified: 401 without a token, 403 for a non-admin, 200 for admin

Still broken:
- 🔴 **D3 — ownership checks commented out in all 5 service controllers** → any logged-in
  user can read any other user's records. **Worst open bug; fix first.**
- 🟠 **D5 — 38 hardcoded `localhost:5000` URLs in 22 files** + CORS hardcoded in
  `server.js:39`. **Blocks deploy.**
- 🟠 **D6** — orders written by a browser callback instead of the Stripe webhook
- 🟡 **D7/D8/D9** — hardcoded products and cart bugs; fabricated dashboard numbers; dead code

Phase order, traps and deploy steps: **[docs/HANDOVER.md](docs/HANDOVER.md)**.
Full detail with file:line in [docs/AUDIT.md](docs/AUDIT.md).

## The rules that matter most here

1. **Never trust a client-supplied id for authorization.** Use `req.user._id`, not `req.params.userId`. *(This bug shipped 5 times.)*
2. **Never comment out a security check.** Five `// TEMPORARY:` comments became permanent.
3. **Every route declares its access level.** Default-deny. "No auth for now" is banned.
4. **No secret in the repo** — not in README, not as a code fallback. `.env` only; commit `.env.example`.
5. **Anything `REACT_APP_*` is public** — it's compiled into the bundle. Publishable Stripe keys only.
6. **Money is server-authoritative** — orders/subscriptions are written by the Stripe webhook, never a browser callback.
7. **Don't reorder `express.raw()` before `express.json()`** in `server.js` — it breaks webhook signatures.
8. **No hardcoded hosts.** Frontend HTTP goes through one axios client using `REACT_APP_API_URL`.
9. **Don't fabricate data in the UI.** Fetch it or show an empty state.
10. **Verify before reporting done.** Run the build, boot the server, curl the endpoint. If it fails, say so with the output.

## Don't restructure what works

Explicit user instruction: **keep the existing flow as it is.** Fix defects in place.

Do **not**: migrate CRA→Vite, add Redux/React Query, rename things for taste, or reorganise
directories. Do **not** "fix" these — they're correct: the Mongoose schemas, bcrypt handling,
the Stripe webhook signature check, `express-validator` on auth, the nested admin routing.

## Confirm before

Force-push or history rewrite · dropping/seeding the database · deleting files · anything
touching a live Stripe account.

⚠️ **One Atlas cluster serves dev and prod** (user's decision), so a careless local script writes
production data.

## Conventions

- Audit IDs (`B1`, `S2`, `C7`) and deliverable IDs (`D1`–`D9`) are **stable** — reference them, never renumber.
- Changing behaviour means updating the affected doc in the same change.
- Prices are INR (₹); Stripe charges in `inr`. Time slots are exactly `9 to 12`, `1 to 4`, `4 to 7`.
