# 🐾 PawfectCare

A full-stack pet-care platform: book veterinary consultations, grooming, boarding/daycare,
vaccinations and adoptions, shop for supplies, and manage subscriptions — with a customer
account area and an admin panel.

**Stack:** React 18 (CRA) · Express 4 · MongoDB (Mongoose) · Stripe · Framer Motion

---

## Features

- **Accounts** — JWT auth, profile + pet details, protected account area
- **5 service bookings** — consultation, grooming, boarding/daycare, vaccination, adoption; each with a qualifying form, date + time-slot picker and price estimate
- **Shop** — 60 products, category/price filters, search, cart, Stripe Checkout
- **Subscriptions** — 3 tiers (Basic / Premium / Ultimate), recorded via Stripe webhook
- **Account area** — orders, bookings, subscription + billing, manage pets
- **Admin panel** — users, orders, and all 5 service queues
- **Content** — about, team, blog, care guides, FAQs, testimonials

## Quick start

**Prerequisites:** Node ≥ 20, a MongoDB Atlas cluster (free M0 is fine), a Stripe test account.

```bash
git clone https://github.com/BuiltWith-Jaydeep/PawfectCare.git
cd PawfectCare/pawfectcare

# install
npm install
cd backend && npm install && cd ..

# configure — copy the templates and fill in your own values
cp .env.example .env
cp backend/.env.example backend/.env
```

Then run two terminals:

```bash
# Terminal 1 — API on :5000
cd backend && npm start

# Terminal 2 — React on :3000
npm start
```

Open <http://localhost:3000>. A healthy backend prints `Connected to MongoDB`.

For Stripe payment testing, a third terminal:
```bash
stripe listen --forward-to http://localhost:5000/api/webhook
```
Copy the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`.

### Configuration

All config is environment-driven — see [`.env.example`](.env.example) and
[`backend/.env.example`](backend/.env.example), which document every variable and where to get
it. Detailed walkthrough in **[docs/SETUP.md](docs/SETUP.md)**.

> ⚠️ Never commit `.env` files. Anything prefixed `REACT_APP_` is compiled into the public
> browser bundle — publishable keys only.

## Documentation

Full docs live in **[`docs/`](docs/)** — start at **[docs/INDEX.md](docs/INDEX.md)**.

| Doc | Contents |
|---|---|
| [AUDIT.md](docs/AUDIT.md) | Known issues with file:line references |
| [SETUP.md](docs/SETUP.md) | Getting it running, env variables |
| [PRD.md](docs/PRD.md) | Product requirements, personas, user journeys |
| [TRD.md](docs/TRD.md) | Stack, data model, API contract, deliverables |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, trust boundaries |
| [DATA-FLOW.md](docs/DATA-FLOW.md) | End-to-end request traces |
| [PAGES.md](docs/PAGES.md) | Every route, component and data source |
| [DESIGN.md](docs/DESIGN.md) | Colour, type, motion, components |
| [RULES.md](docs/RULES.md) | Engineering constraints |
| [MEMORY.md](docs/MEMORY.md) | Decisions and verified facts |

## Project status

🚧 **Under active repair.** The app builds and boots, but the database connection must be
reconfigured and several auth/authorization defects are being fixed. See
[docs/AUDIT.md](docs/AUDIT.md) for the full list and [docs/TRD.md](docs/TRD.md) for the fix
order.

## Structure

```
pawfectcare/
├── src/
│   ├── pages/          route-level screens
│   ├── components/     UI, booking forms, account tabs, checkout
│   ├── AdminPanel/     admin SPA (dashboard, users, orders, services)
│   ├── context/        AuthContext
│   └── assets/styles/  SCSS variables and animations
├── backend/
│   ├── models/         8 Mongoose schemas
│   ├── controllers/    request handlers
│   ├── routes/         Express routers
│   ├── middleware/     JWT auth
│   └── server.js       entry point
├── public/
└── docs/
```

## Scripts

| Command | Does |
|---|---|
| `npm start` | React dev server (:3000) |
| `npm run build` | Production build → `build/` |
| `npm test` | CRA test runner |
| `cd backend && npm start` | API server (:5000) |

## License

ISC
