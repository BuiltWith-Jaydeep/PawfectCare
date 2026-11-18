# PawfectCare — Documentation Index

> **Single entry point.** Every other document links back here.
> Last verified: 2026-11-17 · repo: `BuiltWith-Jaydeep/PawfectCare` · branch `main`

PawfectCare is a full-stack pet-care platform: a React 18 SPA and an Express/MongoDB API
covering veterinary consultations, grooming, boarding/daycare, vaccinations, adoption,
a 60-product shop, Stripe subscriptions, a customer account area and an admin panel.

**Classification: portfolio project.** Will be shown to recruiters and may be deployed
publicly, so real authentication, no leaked secrets and a deployable configuration are
treated as requirements, not nice-to-haves.

---

## Read in this order

| # | Doc | What it answers | Read it when |
|---|---|---|---|
| 1 | **[AUDIT.md](AUDIT.md)** | What is broken right now, with file:line proof | **Start here.** Explains why the app looked fine but wasn't |
| 2 | **[SETUP.md](SETUP.md)** | How to get it running; what Claude needs from you | You want it running today |
| 3 | **[PRD.md](PRD.md)** | Who it's for, what it does, scope | Defining or defending the product |
| 4 | **[TRD.md](TRD.md)** | Stack, API contract, data model, deliverables | Implementing anything |
| 5 | **[ARCHITECTURE.md](ARCHITECTURE.md)** | How the pieces fit; current vs target | Making a structural decision |
| 6 | **[DATA-FLOW.md](DATA-FLOW.md)** | How a request travels end to end | Debugging "why is this empty?" |
| 7 | **[PAGES.md](PAGES.md)** | Every route, its component, its data source | Touching any screen |
| 8 | **[DESIGN.md](DESIGN.md)** | Colours, type, motion, component patterns | Building UI |
| 9 | **[RULES.md](RULES.md)** | Non-negotiable engineering constraints | Before every commit |
| 10 | **[MEMORY.md](MEMORY.md)** | Decisions already made, and why | Before re-litigating anything |

[`../CLAUDE.md`](../CLAUDE.md) at the repo root points Claude Code at [RULES.md](RULES.md)
automatically each session.

---

## The 60-second version

**What works:** the React app builds clean (exit 0), Express boots, Mongoose schemas are well
validated, bcrypt is correct, and the Stripe webhook signature check is done properly.

**What doesn't:** the MongoDB Atlas cluster in `backend/.env` **has been deleted**, so there is
no database. `/admin` has **no login**. Every admin API is **unauthenticated**. All five service
controllers have their **per-user ownership check commented out**. The admin dashboard shows
**hardcoded numbers**.

That combination is precisely why it "worked on the outside": nothing that fails is visible until
you ask for real data.

→ Full detail with line numbers in [AUDIT.md](AUDIT.md).

---

## Status board

| Area | State | Blocker | Tracked in |
|---|---|---|---|
| React build | ✅ Compiles | — | — |
| Express boot | ✅ Starts :5000 | — | — |
| Database | ❌ Cluster deleted | **Needs your Atlas URI** | [SETUP.md](SETUP.md) |
| Admin auth | ❌ None | Needs `role` field first | [TRD.md](TRD.md) D2 |
| Data isolation | ❌ Disabled ×5 | — | [TRD.md](TRD.md) D3 |
| Secrets | ⚠️ In tracked README + history | — | [TRD.md](TRD.md) D1 |
| Deployability | ❌ 37 hardcoded localhost URLs | — | [TRD.md](TRD.md) D5 |
| Products | ⚠️ Hardcoded, no model | — | [TRD.md](TRD.md) D7 |

---

## Conventions used across these docs

- **B1, S2, C7…** — stable IDs from [AUDIT.md](AUDIT.md) (**B**locker, **S**ecurity,
  **C**orrectness). Referenced everywhere; don't renumber them.
- **D1, D2…** — deliverables in [TRD.md](TRD.md), each resolving one or more audit IDs.
- **R1, R2…** — rules in [RULES.md](RULES.md).
- `file.js:42` — verified location in the source at the audited commit.
- ✅ done · ⚠️ works but wrong · ❌ broken · 🔒 needs something from you
