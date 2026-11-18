# Setup — getting PawfectCare running

> Related: [AUDIT.md](AUDIT.md) (why it's broken) · [RULES.md](RULES.md) · [INDEX.md](INDEX.md)
> Verified on this machine 2026-11-17.

## What's already confirmed on your machine

I checked, so you don't have to:

| Tool | Status |
|---|---|
| Node | ✅ v24.18.0 |
| npm | ✅ 11.16.0 |
| Frontend deps | ✅ installed (966 pkgs), **builds clean** |
| Backend deps | ✅ installed (176 pkgs) |
| `mongosh` | ✅ 2.3.8 |
| `stripe` CLI | ✅ 1.25.1, logged in |
| `gh` CLI | ✅ 2.104.0, logged in as `BuiltWith-Jaydeep` (`repo` scope) |
| `mongod` (local server) | ❌ not installed — **not needed**, we're using Atlas |
| Docker | ❌ not installed — not needed |
| `git filter-repo` | ❌ not installed — needed for the history purge |

So the only genuinely missing piece is **the database**.

---

## 🔒 What only you can do

Claude cannot create accounts, click consent screens, or read values out of a web dashboard.
These three are yours. Everything else I do.

### 1. Create a new MongoDB Atlas cluster — **required, blocks everything**

The old cluster `animal-hospital-cluster.lfiac.mongodb.net` is **deleted** (verified: no DNS
record). Per your decision, one cluster serves both local dev and production.

1. Sign in at <https://cloud.mongodb.com> (Google login works).
2. **Create** → **M0 / Free** → any provider → region nearest you (Mumbai `ap-south-1` if in India).
3. Name it `pawfectcare-cluster`.
4. **Database Access** → **Add New Database User**
   - Auth method: Password
   - Username: `pawfectcare`
   - Password: **Autogenerate** → click **Copy** (do this now; it's shown once)
   - Role: `Read and write to any database`
5. **Network Access** → **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`).
   Required so a deployed host can reach it too.
6. **Clusters** → **Connect** → **Drivers** → **Node.js** → copy the string. It looks like:
   ```
   mongodb+srv://pawfectcare:<db_password>@pawfectcare-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

**Then paste that string to me in chat.** Replace `<db_password>` with the real password, or
paste both separately and I'll assemble it. I'll add the `/pawfectcare` database name, write
`backend/.env`, and verify the connection immediately.

> ⚠️ You chose to paste keys in chat — that's fine and fastest, but it does mean the value lands
> in this conversation's history. It never leaves this machine via me: I only write it to
> `backend/.env`, which is already gitignored and untracked.

### 2. Rotate your Gmail password — **required**

`README.md` **is committed to git** and contains `user@example.com` with its password in
plain text, plus credentials for an unrelated "hotelsuite" project. Anyone who has ever seen the
repo has them.

→ <https://myaccount.google.com/security> → Password. Also check **"Your devices"** and
**"Third-party apps with account access"** for anything unfamiliar.

I will remove the text and purge it from history (see below), but **I cannot change your
password** — rotation is the only thing that actually revokes exposure.

### 3. Decide about the Stripe account mismatch — **needs your answer**

I found a discrepancy you should know about. Your Stripe **CLI** is logged into one account, but
the **project** uses a different one:

| | Account |
|---|---|
| `stripe` CLI (`stripe config --list`) | `acct_1R0fgUCQeJjWgk2F` |
| `backend/.env` secret key | `sk_test_...CKarIwe4Rc...` |

Different accounts. So the three subscription price IDs hardcoded in
`backend/controllers/subscriptionController.js` (`price_1R7Uhr...`, `price_1R7UkZ...`,
`price_1R7UmV...`) **almost certainly do not exist** in whichever account you end up using —
subscriptions will fail with "No such price".

Also: **your CLI config contains a live-mode key** (`rk_live_...`, `pk_live_51R0fgU...`).
Nothing in this project should ever touch live mode. I have not used it and will not.

I'll ask you which account to standardise on — see my questions at the end of this doc.

---

## ✅ What I do (no action from you)

Once I have the Atlas URI:

1. **Write `backend/.env` and `.env`** with the real values, and commit `.env.example`
   templates with placeholders only.
2. **Generate a fresh `JWT_SECRET`** — I can do this locally with `crypto.randomBytes(32)`,
   no service needed. The current one is burned (it was in a file alongside exposed creds).
3. **Verify the DB connection** with `mongosh` and by booting the server.
4. **Purge secrets from git history** — I'll install `git filter-repo` via pip, push a
   `backup-pre-cleanup` branch first, rewrite history to remove the README credentials and drop
   `backend/node_modules`, then force-push. `gh` is already authenticated, so I can do all of it.
5. **Add `role` to the `User` model**, write `requireAdmin` middleware, guard every admin route,
   and gate `/admin` in React.
6. **Re-enable the five ownership checks** (S2).
7. **Add a `Product` model + seed script** — moves the 60 hardcoded products into the DB and
   creates your admin account.
8. **Collapse the 37 hardcoded URLs** onto one API base so it can actually deploy.
9. **Fix** C1 (double AuthProvider), C2 (stripeCustomerId), C3 (plural URL 404), C4 (webhook
   orders), C5/C6 (cart), C7 (real dashboard numbers).

---

## Running it (once the URI is in)

Two terminals:

```powershell
# Terminal 1 — API on :5000
cd d:\PROJECTS\zzPawfectCare\pawfectcare\backend
npm start

# Terminal 2 — React on :3000
cd d:\PROJECTS\zzPawfectCare\pawfectcare
npm start
```

A healthy backend prints:
```
STRIPE_SECRET_KEY loaded successfully
Server running on port 5000
Connected to MongoDB          ← this line is currently missing
```

Then open <http://localhost:3000>.

**Stripe webhooks** (third terminal, only when testing payments):
```powershell
stripe listen --forward-to http://localhost:5000/api/webhook
```
That prints a `whsec_...` — it must match `STRIPE_WEBHOOK_SECRET` in `backend/.env`. It changes
every time you restart `stripe listen`, so re-paste it when it does.

---

## Env variables

### `backend/.env`
| Key | Where it comes from |
|---|---|
| `PORT` | `5000` |
| `MONGODB_URI` | 🔒 **you** — Atlas, step 1 |
| `JWT_SECRET` | I generate |
| `STRIPE_SECRET_KEY` | 🔒 **you** — Stripe dashboard, test mode |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen` output |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | you choose; used once by the seed script |

### `.env` (frontend — `REACT_APP_` prefix is mandatory)
| Key | Notes |
|---|---|
| `REACT_APP_API_URL` | `http://localhost:5000` |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` — publishable, safe in the bundle |

⚠️ Anything in `.env` is **compiled into the public JS bundle**. Never put a secret key there —
only the `pk_test_` publishable one. CRA also only reads `.env` at **startup**: restart after edits.

---

## ❓ Open questions for you

1. **Which Stripe account?** The CLI one (`acct_1R0fgU...`) or the one in `backend/.env`?
   Whichever you pick, you'll need to create 3 subscription products in it and send me the new
   `price_...` IDs — or tell me to read them from the API and rewire
   `subscriptionController.js` to look them up by name instead of hardcoding.
2. **Backup branch:** confirm it's fine that I push `backup-pre-cleanup` to GitHub before the
   force-push. It'll be publicly visible on the repo (and still contains the old secrets, which
   is why rotating in step 2 matters). Or I can keep it local-only — safer, but then the backup
   lives only on this machine.
3. **Seed admin credentials:** what email and password do you want for the admin account? (Not
   `REDACTED_ADMIN_PASSWORD` — it's in the exposed README.)


---

## Admin access (added 17 Nov 2026)

### Seeding the admin
`backend/.env` needs:
```
SEED_ADMIN_EMAIL=you@example.com
SEED_ADMIN_PASSWORD=<strong password>
```
Then:
```bash
cd backend
npm run seed:admin                      # promotes an existing account; password untouched
npm run seed:admin -- --reset-password   # also overwrites the password
```
Idempotent. It prints which accounts are admins and never prints a password.

### Logging in as admin
1. Go to `/login`
2. Hover the hidden area to reveal the admin box (the easter egg is kept)
3. Enter the admin **email and password** — both are now required and are verified by the API

Non-admins are redirected to `/`; the API independently returns **403**.

### Promoting someone manually
```js
db.users.updateOne({ email: 'x@y.com' }, { $set: { role: 'admin' } })
```
`role` cannot be set through any API request body, by design.
