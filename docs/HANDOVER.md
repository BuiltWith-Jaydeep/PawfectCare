# HANDOVER — PawfectCare

**For: the next Claude Code session (and Jaydeep).**
Written 18 Nov 2026. Read this first, then [RULES.md](RULES.md) and [AUDIT.md](AUDIT.md).

**Goal: get this site live.** Security work comes before deploy — the user's decision.

---

## 1. Where things stand

| | |
|---|---|
| Repo | `github.com/BuiltWith-Jaydeep/PawfectCare` (**public**) |
| Branch | `main` — local and remote both at `2f916f9`, working tree clean |
| Local path | `d:\PROJECTS\zzPawfectCare\pawfectcare` |
| Database | MongoDB Atlas, cluster `animal-hospital-cluster`, **running**. Data is in the `test` database |
| Stripe | Test mode, account `acct_1R0fghCKarIwe4Rc`. 3 subscription prices verified active |
| Frontend build | `npx react-scripts build` → **exit 0** |
| Backend boot | prints `Connected to MongoDB` |
| Deployment | **Nothing deployed yet.** No `render.yaml`, no CI |

### Done and verified

| ID | What | Evidence |
|---|---|---|
| **Step 1** | Atlas cluster resumed, connection verified | server prints `Connected to MongoDB` |
| **Step 2** | Stripe test account confirmed; 3 price IDs active | checked in dashboard, read-only |
| **Step 3** | Admin account seeded | `cppraja5722@gmail.com`, `role: admin` |
| **Step 5** | Gmail passwords rotated by user | user confirmed |
| **D1** | Secrets purged from git history + `node_modules` dropped | `git filter-repo`, 0 hits for 6 patterns, force-pushed |
| **D2** | Admin auth + authorization | 401 / 403 / 200 verified live on all 18 endpoints |
| **D4** | Database wired and verified | real data returned through the API |
| **D3** | Ownership checks restored in 5 controllers | A→B 403, A→A 200, admin→B 200 on all 5 endpoints |
| **D6** | Orders written by the webhook (`saveOrder`), browser route deleted | signed-event test: bad sig 400, good 200, redelivery → 1 order (₹246, cleaned up). ⚠️ not tested with a *Stripe-originated* event |
| **D5** | One axios client (`src/api/client.js`); CORS + Stripe return URLs from `CLIENT_URL` | build exit 0; 0 hardcoded hosts in `src/` except the env-driven fallback; CORS preflight echoes `CLIENT_URL`; `/api/subscription/user/:id` → 200 for owner |

### Not started

| ID | What | Why it matters |
|---|---|---|
| **D7** 🟡 | 60 products hardcoded in the component; no `Product` model | Cart bugs: duplicates, quantity ignored, lost on refresh |
| **D8** 🟡 | Admin dashboard chart is `[5,20,7,8,6,9,5]` | Fabricated numbers |
| **D9** 🟡 | `helmet` imported but unused, dead code | Hygiene |

---

## 2. Phases — do them in this order

### Phase 1 — D3, the ownership checks ✅ *done — kept for reference*

Five controllers accept a **client-supplied `userId` from the URL** and return that
user's records without checking it belongs to the caller.

```
backend/controllers/adoptionController.js:56
backend/controllers/consultationController.js:60
backend/controllers/dayCareController.js:58
backend/controllers/groomingController.js:58
backend/controllers/vaccinationController.js:50
```

Each looks like this:

```js
const { userId } = req.params;
// TEMPORARY: Auth check disabled to allow data fetching
// if (req.user.id !== userId) {
//   return res.status(403).json({ error: 'Unauthorized access' });
// }
const vaccinations = await Vaccination.find({ userId }).sort({ createdAt: -1 });
```

**The correct pattern already exists** in `backend/routes/subscription.js:43` — copy it.

Preferred fix: **ignore `req.params.userId` entirely** and query by `req.user.id`, which
`authMiddleware` sets from the verified token. That satisfies RULES R1 and cannot be
bypassed. If the route shape must stay, compare and return 403 on mismatch — but the
query must still use `req.user.id`.

Allow an admin through: `req.user.role === 'admin'`.

**Verify like this** (D2 was verified the same way):
- user A's token requesting user B's `/user/:userId` → **403**
- user A requesting their own → **200**
- admin requesting anyone's → **200**
- then `npx react-scripts build` → exit 0

### Phase 2 — D5, one API client ✅ *done — kept for reference*

38 occurrences of `http://localhost:5000` across 22 files in `src/`. A deployed frontend
would try to reach the visitor's own machine.

Per RULES R8, create **one** axios client and route all HTTP through it:

```js
// src/api/client.js
import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear the session and send the user to /login
client.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

export default client;
```

Then replace every hardcoded URL. Find them with:
```bash
grep -rn "localhost:5000" src --include=*.js --include=*.jsx
```

Also fix, in the same pass — a **permanent 404** that predates this work:
`src/components/Account/Subscription.js:31` calls `/api/subscriptions/user/...` (plural)
but `server.js:74` mounts `/api/subscription` (singular).

**Also server-side:** `backend/server.js:39` hardcodes `origin: 'http://localhost:3000'`.
It must read `process.env.CLIENT_URL` or the deployed frontend is blocked by CORS.

### Phase 3 — D6, money must be server-authoritative ✅ *code done; real-Stripe test outstanding*

`src/components/PaymentSuccess.jsx:15` calls `/api/payment/confirm` **from the browser**
to save the order. Close the tab and a paid order is never recorded.

Per RULES R6, the order must be written by the **Stripe webhook**
(`backend/routes/webhook.js`), which already verifies signatures correctly.

⚠️ **Do not reorder `express.raw()` before `express.json()`** in `server.js` (RULES R7) —
it breaks webhook signature verification. That ordering is currently correct.

Testing needs the Stripe CLI:
```bash
stripe listen --forward-to http://localhost:5000/api/webhook
```
Copy the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`. It changes every restart.
**`STRIPE_WEBHOOK_SECRET` has never been verified** — this is the first real test of it.

### Phase 4 — Deploy to Render

Only start once **Phases 1–3 are done**. Phase 2 is a hard prerequisite.

**Backend — Render Web Service**
- Root directory `backend`, build `npm install`, start `npm start`
- Environment variables (set in the Render dashboard, never in the repo):
  `MONGODB_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
  `CLIENT_URL` (the deployed frontend URL), `PORT` (Render provides it)
- Do **not** set `SEED_ADMIN_PASSWORD` in production beyond the single seed run

**Frontend — Render Static Site**
- Build `npm install && npm run build`, publish directory `build`
- Environment: `REACT_APP_API_URL` = the deployed backend URL,
  `REACT_APP_STRIPE_PUBLISHABLE_KEY` = the `pk_test_` key
- ⚠️ CRA inlines `REACT_APP_*` at **build** time — changing one needs a rebuild, not a restart
- Add a rewrite rule `/* → /index.html` or React Router deep links 404

**Then**
- Atlas Network Access already allows `0.0.0.0/0`, so Render can connect
- Point a Stripe webhook endpoint at `https://<backend>/api/webhook` and use **that**
  signing secret in production
- Re-run `npm run seed:admin` against production once

> A Render connector is available in this session's tooling, so a future session may be
> able to help directly — it needs the user to authorize it first.

### Phase 5 — D7, D8, D9 (polish)

Lower risk, do after it is live. D8 (`src/AdminPanel/pages/Dashboard.js:24`) is worth
doing before showing recruiters — fabricated numbers violate RULES R9.

---

## 3. Things that will bite you

1. **Files are CRLF.** Python/sed edits with `\n`-only anchors silently fail to match.
   Read bytes, normalise to `\n`, edit, write back with CRLF. This cost time already.
2. **`cd backend` before any `node -e`** that requires a dependency, or module resolution
   fails.
3. **One Atlas cluster serves dev and prod.** A careless local script writes production
   data. Clean up test users you create.
4. **`backend/node_modules` is not in git** (removed in D1). After a fresh clone, run
   `npm install` in both the root and `backend/`.
5. **A backend may still be listening on :5000** from an earlier session. `EADDRINUSE`
   means it is already running, not that something is broken.
6. **Do not restructure.** No CRA→Vite, no Redux, no renaming, no directory moves. Explicit
   user instruction. Fix defects in place.
7. **These are correct — do not "fix" them:** the Mongoose schemas, bcrypt handling, the
   Stripe webhook signature check, `express-validator` on auth, the nested admin routing.

---

## 4. Credentials and access

| Item | Where |
|---|---|
| Admin login | `cppraja5722@gmail.com` — password is in `backend/.env` as `SEED_ADMIN_PASSWORD` |
| All secrets | `backend/.env` and `.env` — **gitignored, verified** |
| Templates | `backend/.env.example`, `.env.example` — committed, no real values |

Promote an admin: `cd backend && npm run seed:admin`
(add `-- --reset-password` to also overwrite the password).

**Never** put a real secret in the repo, a doc, or a README (RULES R4). The `REACT_APP_*`
values are compiled into the public bundle — publishable keys only (RULES R5).

---

## 5. Open item for the user, not for Claude

🔴 **GitHub still serves the pre-rewrite commits by SHA.** Force-pushing moved the branch
pointer; it did not delete the old objects. This URL still returns the old passwords:

`github.com/BuiltWith-Jaydeep/PawfectCare/blob/2279709483bcca171523dfb793f5efb7cf044c56/README.md`

Fix: ask GitHub Support to garbage-collect unreachable objects
(https://support.github.com/request). The repo has **0 forks**. The passwords were already
rotated, so this is cleanup rather than damage control.

A full copy of the original `.git` is at
`C:\Users\cppra\AppData\Local\Temp\claude\gitbackup\git-backup` (86 MB).
⚠️ It is in a temp folder that routine cleanup can clear — move it somewhere durable to keep it.
⚠️ The `backup-before-cleanup` branch was itself rewritten by `filter-repo`, so it is **not**
a backup of the original history.

---

## 6. First moves for the next session

```bash
cd d:\PROJECTS\zzPawfectCare\pawfectcare
git log --oneline -3     # expect 1bc0b71 (D3) at the top
git status --short       # expect clean
git push origin main     # D3 is committed but NOT yet pushed
grep -rno "localhost:5000" src --include=*.js --include=*.jsx | wc -l   # expect 38
```

**Phases 1–3 (D3, D5, D6) are done in code.** Open: a real Stripe-originated webhook test (CLI key expired — needs `stripe login`, or register the endpoint in the Dashboard at deploy and use *Send test webhook*). Next: **Phase 4 (Render)**.
Verify with curl before reporting anything done (RULES R10).
