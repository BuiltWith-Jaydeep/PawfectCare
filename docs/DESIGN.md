# PawfectCare — Design System

> Related: [PAGES.md](PAGES.md) · [RULES.md](RULES.md) · [INDEX.md](INDEX.md)
> **Extracted from the actual stylesheets**, not invented. Counts are real occurrences
> across `src/**/*.{css,scss}` at commit `2efa4db`.

## 1. Honest assessment first

The visual layer is the most polished part of this project — glassmorphism, Framer Motion
throughout, a particle background, custom intro animations. It genuinely looks good.

But there is **no single source of truth**. `_variables.scss` defines only 5 tokens, while the
stylesheets contain **hundreds of hardcoded hex values**. The same coral appears as `#ff6b6b`
(39×), `#ff4a3d` (10×) and `#ff6f61` (9×) — three different "brand" colours. Two parallel
palettes exist (warm coral on public pages, cyan-on-dark in admin) with nothing connecting them.

So: keep the look, extract the tokens.

## 2. Colour — as actually used

### Brand / accent (public)
| Swatch | Hex | Uses | Role |
|---|---|---|---|
| ● | `#ff6b6b` | **39** | Primary coral — CTAs, highlights |
| ● | `#ff4a3d` | 10 | Hover/pressed coral |
| ● | `#ff6f61` | 9 | Third coral variant ⚠️ **collapse into the above** |
| ● | `#4caf50` | 28 | Success / confirm |
| ● | `#45a049` | 6 | Success hover |
| ● | `#007bff` | 15 | Link / info blue |
| ● | `#14B8A6` | token | `$accent-teal` (declared, barely used) |
| ● | `#ef4444` | token | `$error-red` |

### Neutrals
| Hex | Uses | Role |
|---|---|---|
| `#fff` | **77** | Surfaces, text on dark |
| `#333` | 39 | Body text |
| `#666` | 25 | Secondary text |
| `#999` | 5 | Muted / placeholder |
| `#ccc` / `#ddd` | 10 / 9 | Borders, dividers |
| `#1f2937` | 6 | Dark text / dark surface |

### Admin panel — separate dark palette
| Hex | Uses | Role |
|---|---|---|
| `#00b4d8` | 8 | Admin primary (cyan) |
| `#1a1a1a` / `#2a2a2a` / `#2d2d2d` | 2/1/1 | Dark surfaces |
| `#28a745` | 1 | Success |
| `#ff4d4d` | 1 | Destructive |

### Gradient & glass (the signature look)
```scss
$primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  // indigo → purple
$glass-background: rgba(255, 255, 255, 0.15);
// paired with: backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);
```
Note the gradient's indigo/purple belongs to **neither** palette above — a third colour story.

**→ Target:** one `_tokens.scss` with semantic names (`$color-primary`, `$color-primary-hover`,
`$color-success`, `$surface-glass`, `$text-body`…), consumed everywhere. Keep the two themes but
express admin as a theme of the same tokens.

## 3. Typography

| Family | Where | Status |
|---|---|---|
| **Poppins** | `index.css:3` global, fallback Arial | ⚠️ **never loaded** — no `@font-face`, no Google Fonts link in `public/index.html` |
| **Fredoka One** | `$font-heading`, 33 uses | ⚠️ not loaded; also **misspelled** — the real font is `Fredoka` / `Fredoka One` |
| **Quicksand** | 1 use | not loaded |
| Arial | 10 uses | the actual rendered font in practice |

**This is a live bug:** three display fonts are referenced and **none is loaded**, so the app
currently renders in Arial everywhere. Add to `public/index.html`:
```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Fredoka:wght@600&display=swap" rel="stylesheet">
```

`$font-heading` / `$font-body` are **redefined identically in all 5 `Solutions/*.scss` files**
rather than imported from `_variables.scss` — move them to the shared file.

### Scale (observed, needs normalising)
Headings run `2.5rem` / `2rem` / `1.5rem`; body `1rem`; small `0.875rem`. No defined scale —
sizes are picked per component.

## 4. Motion

Framer Motion is used consistently and is the app's strongest design signature.

| Pattern | Values |
|---|---|
| Page enter | `opacity 0→1`, `duration: 0.5` |
| Staggered lists | `staggerChildren: 0.2–0.3`, `delayChildren: 0.5` |
| Slide-in | `x: -200→0` / `y: -20→0`, `ease: 'easeOut'` |
| Hover | `whileHover={{ scale: 1.05 }}` (1.1 on admin nav) |
| Intro gate | `IntroAnimation` blocks `/` until complete; admin has its own |

⚠️ **Accessibility:** no `prefers-reduced-motion` handling anywhere. Particle background +
staggered motion on every page is a genuine problem for motion-sensitive users. Add:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
```

⚠️ Two sequential intro animations (site, then admin) before anything is usable — consider
showing each only once per session (`sessionStorage`).

## 5. Styling approach — currently four at once

| Approach | Where |
|---|---|
| Plain CSS, global | `App.css`, `index.css`, `components/**/*.css` |
| SCSS | `assets/styles/`, `Solutions/`, `Auth/` |
| CSS Modules | `AdminPanel.module.css`, `ShopPage.module.scss`, `ReviewOrder.module.css`, `ContactPage.module.scss` |
| Bootstrap 5.3 | partially, utilities/grid |
| Inline `style={{}}` | `Common/Sidebar.js` and others |

Plus Font Awesome **and** react-icons both installed for icons.

**→ Target:** CSS Modules + SCSS for anything new (already the newer pattern here); stop adding
global CSS; pick one icon library. Not worth a big-bang refactor — convert opportunistically.

## 6. Components

| Pattern | Spec |
|---|---|
| **Glass card** | `$glass-background` + `blur(10px)` + `1px solid rgba(255,255,255,0.2)`, radius `12–16px` |
| **Primary button** | coral `#ff6b6b` → `#ff4a3d` hover, white text, radius `8px`, `scale 1.05` |
| **Success button** | `#4caf50` → `#45a049` |
| **Form field** | floating label (`Auth/FloatingLabel.scss`), `1px solid #ccc`, error `#ef4444` |
| **Admin table** | dark surface, cyan header, inline Edit/Delete per row |
| **Toast** | `react-hot-toast`, top-right |
| **Modal** | `react-modal`, `#root` as app element |

## 7. Accessibility — needs work

| Issue | Detail |
|---|---|
| ❌ Dead links | 15 `<a href="#">` across the 5 Solutions pages — every build warns `jsx-a11y/anchor-is-valid` |
| ❌ Reduced motion | not handled at all |
| ⚠️ Contrast | white text on `$glass-background` over a particle field is likely **below WCAG AA**; untested |
| ⚠️ Focus states | relies on browser defaults; glass surfaces make them hard to see |
| ✅ Some `aria-label`s | present on sidebar/hamburger toggles |
| ⚠️ Forms | labels present, but errors aren't linked via `aria-describedby` |

## 8. Responsive

Breakpoints are ad-hoc per file — commonly `768px`, sometimes `480px` / `1024px`, with no shared
map. The admin panel's fixed sidebar is the weakest point on small screens.

**→ Target:** shared breakpoint map in `_tokens.scss`; verify the admin tables at 390 px.

## 9. Design debt summary

| # | Item | Effort |
|---|---|---|
| 1 | **Load the fonts** — 3 referenced, 0 loaded | 5 min, high impact |
| 2 | Collapse 3 corals into 1 token set | small |
| 3 | Extract hardcoded hex → `_tokens.scss` | medium |
| 4 | Fix 15 `href="#"` dead links | small |
| 5 | Add `prefers-reduced-motion` | small |
| 6 | Move `$font-*` out of 5 duplicate declarations | small |
| 7 | Check contrast on glass surfaces | small |
| 8 | Unify breakpoints | medium |
| 9 | One icon library | small |

Items 1, 4, 5 are the ones a reviewer would notice first — all quick.
