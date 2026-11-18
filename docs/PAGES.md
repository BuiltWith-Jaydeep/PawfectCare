# PawfectCare — Pages & Routes

> Related: [DATA-FLOW.md](DATA-FLOW.md) · [DESIGN.md](DESIGN.md) · [PRD.md](PRD.md) · [INDEX.md](INDEX.md)
> Every route below was read from `src/App.js` at commit `2efa4db`. 🔓 public · 🔑 login required · 👑 admin.

## Public routes

| Path | Component | Access | Data source | Notes |
|---|---|---|---|---|
| `/` | `pages/HomePage/HomePage.js` | 🔓 | static | Hero carousel, services, testimonials |
| `/login` | `pages/Login.jsx` → `LoginForm.jsx` | 🔓 | `POST /api/auth/login` | axios; hardcoded host |
| `/signup` | `pages/Signup.jsx` → `SignupForm.jsx` | 🔓 | `POST /api/auth/signup` | 8 fields incl. pet |
| `/shop` | `pages/ShopPage/ShopPage.jsx` | 🔓 | ❌ **60 hardcoded objects** | C5, C6, C10 |
| `/checkout` | `pages/ReviewOrder.jsx` | 🔓 ⚠️ | router `state` + `GET /users/me` | ❌ empty on refresh (C6); should be 🔑 |
| `/services`, `/service` | `pages/ServicePage.js` | 🔓 | static + `POST /subscription/...` | Two paths, same component |
| `/payment-success` | `components/PaymentSuccess.jsx` | 🔓 | `GET /payment/confirm` | ❌ writes the order (C4) |
| `/success` | `components/Success.jsx` | 🔓 | — | Subscription landing |
| `/contact` | `pages/ContactPage/ContactPage.js` | 🔓 | static | ⚠️ form doesn't submit anywhere |
| `/terms-and-conditions` | `pages/TnC/TermsAndConditions.jsx` | 🔓 | static | |

### Solution / content pages (all 🔓 static)
| Path | Component |
|---|---|
| `/pet-health` | `Solutions/PetHealthManagement.js` |
| `/grooming` | `Solutions/GroomingCare.js` |
| `/boarding` | `Solutions/BoardingDaycare.js` |
| `/adoption` | `Solutions/AdoptionAssistance.js` |
| `/vaccination` | `Solutions/VaccinationPrograms.js` |
| `/blog` | `pages/PetCareBlog.js` |
| `/guides` | `pages/CareGuides.js` |
| `/faqs` | `pages/FAQs.js` |
| `/about` | `pages/AboutPawfectCare.js` |
| `/team` | `pages/MeetTheTeam.js` |
| `/testimonials` | `pages/CustomerStories.js` |

> Each Solutions page has 3 `<a href="#">` placeholders — the source of the build's
> `jsx-a11y/anchor-is-valid` warnings. Harmless, but they're dead links a recruiter may click.

## Protected route

| Path | Component | Access | Guard |
|---|---|---|---|
| `/my-account` | `pages/MyAccountPage.js` | 🔑 | `ProtectedRoute` → `/login` ✅ |

### Account area — 4 tabs (local `useState`, not nested routes)

| Tab | Component | Data |
|---|---|---|
| `dashboard` | `Account/Dashboard.js` | contains 2 sub-tabs ↓ |
| `orders` | `Account/Orders.js` | `GET /api/orders/me` ✅ |
| `services` | `Account/Services.js` | 5 parallel `GET /{service}/user/:userId` ❌ **S2 IDOR** |
| `subscription` | `Account/Subscription.js` | ❌ `/api/subscriptions/...` 404 (C3) + billing broken (C2) |

**Dashboard sub-tabs:** `account` → `ManageAccount.js` (`GET`/`PUT /users/me` ✅) ·
`pet` → `ManagePet.js` (⚠️ extra pets in `localStorage.localPets`, server never sees them).

> Tab state is component-local, so **tabs aren't linkable or refresh-safe** — reloading
> `/my-account` always returns to `dashboard`. Consider nested routes.

Detail components `AdoptionDetails`, `ConsultationDetails`, `DayCareDetails`,
`GroomingDetails`, `VaccinationDetails` (`.jsx`) render rows inside the services tab.

## Admin routes ❌ **completely unguarded (B2)**

`App.js:71` — `<Route path="/admin/*" element={<AdminPanel />} />`, **no `ProtectedRoute`**,
no login, no role check. Compare `/my-account` directly above it, which *is* guarded.

| Path | Component | API | State |
|---|---|---|---|
| `/admin` | `AdminPanel/pages/Dashboard.js` | **none** | ❌ hardcoded `[5,20,7,8,6,9,5]` (C7) |
| `/admin/users` | `pages/Users.js` | `GET/POST/PUT/DELETE /api/users` | ❌ unauth'd API (B3) |
| `/admin/orders` | `pages/Orders.js` | `GET /orders`, `PUT /orders/update/:id` | ❌ unauth'd |
| `/admin/services/consultation` | `pages/Consultation.js` | `/api/consultations` | ❌ unauth'd |
| `/admin/services/grooming` | `pages/Grooming.js` | `/api/grooming` | ❌ unauth'd |
| `/admin/services/adoption` | `pages/Adoption.js` | `/api/adoption` | ❌ unauth'd |
| `/admin/services/daycare` | `pages/Daycare.js` | `/api/daycare` | ❌ unauth'd |
| `/admin/services/vaccination` | `pages/Vaccination.js` | `/api/vaccinations` | ❌ unauth'd |

Nested routing (`AdminPanel.js` → `Services.js` → 5 pages) is **correctly wired** — the
structure is fine, only the guard is missing.

**→ Target (D2):** add `/admin/login`, wrap `/admin/*` in an `AdminRoute` that checks
`user.role === 'admin'`, and put `requireAdmin` on every API above.

## Booking forms

Not routed directly — mounted inside service pages, usually in a modal.

| Form | Posts to | `userId` source |
|---|---|---|
| `BookingForm.jsx` (consultation) | `POST /api/consultations` | token ✅ |
| `GroomingForm.jsx` | `POST /api/grooming` | token ✅ |
| `DayCare.jsx` | `POST /api/daycare` | token ✅ |
| `VaccinationForm.jsx` | `POST /api/vaccinations` | token ✅ |
| `AdoptionForm.jsx` | `POST /api/adoption` | token ✅ |

All five read `localStorage.getItem('token')` directly and hardcode the host (C9).
**Write paths are correct** — `userId` always comes from the verified token (see
[DATA-FLOW.md](DATA-FLOW.md) F3). It's the *read* paths that leak (F4).

## Checkout sub-components

`components/ReviewOrder/` — `Header`, `OrderReview`, `OrderSummary`,
`ShippingBilling` (`GET /users/me` to prefill), `CallToAction`
(`POST /payment/create-checkout-session` → Stripe), `Footer`.

## Shared chrome

| Component | Used by |
|---|---|
| `Header/Header.js`, `Footer/Footer.js` | public pages |
| `IntroAnimation/` | gates `/` on first load (`App.js`) |
| `ParticlesBackground.jsx` | global background |
| `BackToTop.js` | global |
| `Common/TopNav.js`, `Common/Sidebar.js` | account area only |
| `AdminPanel/components/Sidebar.js`, `AdminIntroAnimation.js` | admin only |
| `ServiceComponents/` — `HeroSection`, `ServicesSection`, `PricingSection`, `FormSection`, `SFooter` | service pages |

## Dead code — verified unreferenced

| File | Why |
|---|---|
| `pages/AboutPage.js` | nothing imports it; `/about` uses `AboutPawfectCare.js` |
| `pages/ContactPage.js` | superseded by `ContactPage/ContactPage.js` |
| `components/InteractiveMascot.jsx` | imported nowhere |
| `AdminPanel/components/UserManagement.js` | imported nowhere; `pages/Users.js` is used |
| `components/BookingF.css`, `BookingForms.css` | duplicates of `BookingForm.css` |
| `public/images/*` | duplicates `public/assets/images/*` |
| `structure.txt` | 281 kB stale committed tree dump |

Safe to delete under D9.

## Route gaps

| Missing | Impact |
|---|---|
| No `*` / 404 route | unknown URLs render a blank page |
| `/admin/login` | no way to authenticate as admin (D2) |
| `/checkout` not protected | anonymous users reach checkout and fail at payment |
| No `/products/:id` | shop has no product detail view |
| No password reset | users who forget are locked out permanently |
