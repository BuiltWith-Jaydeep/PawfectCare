# PawfectCare — Product Requirements Document

> Related: [TRD.md](TRD.md) (how) · [PAGES.md](PAGES.md) (screens) · [INDEX.md](INDEX.md)
> Status: describes the product **as built**, with scope decisions marked.
> Last updated 2026-11-17.

## 1. What it is

PawfectCare is a single platform where a pet owner books every routine pet-care need —
vet consultation, grooming, boarding, vaccination, adoption — buys supplies, and keeps their
pet's history in one account. Service businesses manage all of it from one admin panel.

**The problem:** pet owners juggle separate phone numbers and walk-ins for each service, with no
record of what happened when. Small clinics run on paper diaries and WhatsApp.

**The wedge:** five services that normally live in five different places, under one login, with
one booking flow and one history.

## 2. Who it's for

| Persona | Wants | Current pain |
|---|---|---|
| **Pet owner** (primary) — urban, 22–45, 1–2 pets, phone-first | Book without phone calls; see pet history; one bill | Calls five places; no records; forgets vaccine dates |
| **Clinic / service operator** (admin) | One queue of today's bookings; edit/cancel; see customers | Paper diary; double-bookings |
| **Subscriber** | Predictable monthly cost, priority access | Pays full price per visit |

**Explicitly out of scope:** veterinarians as platform users (no vet-facing login, no clinical
charting, no prescriptions). Vets are staff the operator schedules, not users of this system.

## 3. Scope

### Shipped (built, works once the DB is restored)
- **Accounts** — signup/login, JWT, profile + pet details, protected account area
- **5 service bookings** — consultation, grooming, boarding/daycare, vaccination, adoption; each
  with its own qualifying form, date + time-slot picker, and price estimate
- **Shop** — 60 products, category + price-range filter, search, cart, Stripe Checkout
- **Subscriptions** — 3 tiers (Basic / Premium / Ultimate) via Stripe, webhook-recorded
- **Account area** — orders, bookings per service, subscription + billing, manage pets
- **Admin panel** — users CRUD, orders, and all 5 service queues
- **Content** — about, team, blog, care guides, FAQs, testimonials, T&C, contact

### Known-incomplete (see [AUDIT.md](AUDIT.md))
| Gap | Audit ID |
|---|---|
| Admin panel has no login | B2, B3, B4 |
| Users can read each other's records | S2 |
| Admin dashboard shows fabricated numbers | C7 |
| Products aren't in the database | C10 |
| Paid orders lost if browser closes | C4 |
| Cart doesn't survive refresh | C6 |

### Deliberately not building
Not now, and the docs shouldn't imply otherwise: real-time chat/video consults, mobile apps,
multi-clinic tenancy, insurance claims, prescription/pharmacy, delivery tracking, reviews &
ratings, loyalty points, multi-language, vet-facing clinical records.

## 4. Core user journeys

### J1 — Book a service (the primary flow)
1. Land on home → pick a service
2. Read the service page (what's included, pricing)
3. Hit **Book** → **must be logged in** (redirect to `/login`, return after)
4. Fill the service form — pet details, needs, date, time slot
5. See the price estimate → submit
6. Confirmation; booking appears in **My Account → Services**
7. Operator sees it in **Admin → Services → <type>**

*Currently:* steps 1–6 work, but step 6's list leaks other users' bookings (S2).

### J2 — Buy supplies
Shop → filter/search → add to cart → review (shipping prefilled from profile) → Stripe Checkout
→ success → order in **My Account → Orders**.
*Currently:* order only saved if the browser returns to the success page (C4); cart dies on
refresh (C6); duplicate rows per click (C5).

### J3 — Subscribe
Services → compare 3 plans → Checkout (subscription mode) → webhook records plan →
**My Account → Subscription**.
*Currently:* webhook side is correct; the account page requests the wrong URL and shows "no
plan" (C3), and billing history can't work (C2). Plan price IDs likely belong to a dead account
(see [SETUP.md](SETUP.md)).

### J4 — Operator manages the day
`/admin` → dashboard → Services → pick type → view/edit/cancel; Users; Orders.
*Currently:* **no login required at all** (B2) and the dashboard numbers are fake (C7).

## 5. Rules the product must obey

| # | Rule | Enforced where |
|---|---|---|
| P1 | Booking requires a logged-in account | `ProtectedRoute` + `authMiddleware` |
| P2 | A user sees **only** their own bookings, orders, pets | ❌ **currently violated** — S2 |
| P3 | Admin functions require an admin account | ❌ **currently violated** — B2/B3 |
| P4 | Time slots are fixed: `9 to 12`, `1 to 4`, `4 to 7` | schema enums |
| P5 | Pet type is `Dog` or `Cat` for services | schema enums (User allows bird/other — inconsistent) |
| P6 | Phone numbers are exactly 10 digits | schema regex + express-validator |
| P7 | Price shown at booking is an **estimate**, not a charge | copy on each form |
| P8 | Renters must confirm landlord approval before adoption | `adoptionController` |
| P9 | Money is only ever charged through Stripe; no card data touches our server | Stripe Checkout redirect |
| P10 | Passwords are bcrypt-hashed, never returned | ✅ correct today |

## 6. Success criteria

**Must be true to call this done:**
1. `npm start` in both folders → working app against a live DB
2. A user can complete J1 and J2 end to end
3. `/admin` is unreachable without an admin account
4. No user can read another user's data
5. No secret in the repo or its history
6. Deployable without editing source (env-driven)
7. Admin dashboard reflects real counts

**Portfolio-specific:** a recruiter reading the repo should find a clear README, these docs, and
no hardcoded `localhost`, no fake dashboard, no commented-out auth.

## 7. Currency & locale

All prices **INR (₹)**; Stripe charges in `inr`. Single locale (en-IN), `Asia/Kolkata`.
Dates display `dd/MM/yyyy`.

---

**Next:** [TRD.md](TRD.md) for how this is implemented and what gets built next.
