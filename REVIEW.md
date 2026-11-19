---
status: issues_found
reviewed_at: 2026-11-11
scope: uncommitted working-tree changes (index.html, script.js, styles.css) vs HEAD 40c6791
depth: standard
files_reviewed: 3
findings:
  critical: 4
  warning: 9
  info: 7
  total: 20
---

# Code Review — Hotel Anantashram website (uncommitted changes)

**Scope:** the 700-line `index.html`, 367-line `script.js` and 356-line `styles.css` in the working
tree, diffed against `HEAD` (`40c6791`). 90 hunks, +718 / −1333 lines.

**Method:** full read of all three files, `git diff` against `HEAD`, and targeted checks for duplicate
IDs, landmark/selector coverage, `MENU_DATA` ↔ filter-key consistency, dead CSS, and computed
contrast ratios. Every finding below was re-read in the current source, not inferred from the diff.

**Not in scope:** `sw.js`, `vercel.json`, `manifest.json`, `tailwind.config.js` (unmodified).

---

## Critical

### CR-01 — Mobile navigation drawer cannot open

**Files:** `index.html:151` (drawer markup, `<div id="mobile-menu">`), `script.js:70–73` (`openDrawer`, `drawer.hidden = false`)

`#mobile-menu` ships with the Tailwind `hidden` class **and** `aria-hidden="true"`:

```
<div id="mobile-menu" class="hidden lg:hidden fixed inset-0 z-40 bg-surface/90 backdrop-blur-sm" aria-hidden="true">
```

`openDrawer()` only toggles the **`hidden` property** (`drawer.hidden = false`) and adds
`drawer-open` to `<body>`. The `hidden` **class** (`display: none`) is never removed, so the panel
stays invisible at every viewport below `lg`. Below 1024px the desktop nav is also hidden, which
leaves **no navigation at all on phones and tablets**; only the floating WhatsApp button works.

Compounding defects in the same control flow:

- `aria-hidden="true"` is never cleared, so the drawer would remain invisible to assistive tech even if shown.
- `openDrawer`/`closeDrawer` animate `#mobile-menu-panel` and `.drawer-backdrop`, neither of which exists in the new markup — both are `null`, so the intended slide/fade does not run.
- Drawer links (`[data-drawer-link]`) never call `closeDrawer`, so following a link would leave the drawer open with `body.drawer-open` still pinning `overflow: hidden`.

**Fix:** drop the `hidden` class and control visibility with the markup's own state (`hidden` attribute
only, or an `is-open` class), clear `aria-hidden` on open, restore it on close, add the panel/backdrop
nodes the script expects (or simplify the script to match), and close on link activation.

### CR-02 — Four of eight menu category tabs are dead

**Files:** `index.html:446–470` (the two filter rails), `script.js` (`MENU_DATA`, `renderMenuItems`)

Filter keys in the markup and category keys in `MENU_DATA` disagree, and several categories have no
dishes at all. Measured against `MENU_DATA` (21 dishes):

| Filter button | data-category | Dishes shown |
|---|---|---|
| All | `all` | 21 |
| Fish Thalis & Curries | `thalis` | 5 |
| Seafood Starters | `starters` | 6 |
| Biryani | `biryani` | **0 — empty state** |
| Chicken & Mutton | `chicken-mutton` | 1 |
| Vegetarian | `veg` | **0 — empty state** |
| Indian Breads | `breads` | **0 — empty state** |
| Chinese | `chinese` | **0 — empty state** |
| Desserts & Beverages | `desserts` | 2 |

The data key is `biryanis` (plural) while the button is `biryani`, so all six biryanis disappear behind
that tab. The one `curries` dish (`Prawn Curry Bowl`, ₹280) has no matching button and is reachable only
via "All". "Vegetarian", "Indian Breads" and "Chinese" have no dishes defined anywhere, so tapping them
always renders "No dishes found" — that reads as a broken site, not an empty menu.

**Fix:** rename the data key to `biryani` (or the button to `biryanis`), add the `curries` tab or fold
those dishes into `thalis`, and either add the missing `veg`/`breads`/`chinese` dishes or remove those
four buttons until the data exists.

### CR-03 — No `<main>` landmark; skip link and scroll-spy are both dead

**Files:** `index.html:125`, `index.html:429`, `script.js:334` (scroll-spy target list)

Three defects share one root cause — the document has no `<main>` element at all:

1. `index.html:429` has **two `id` attributes on one element**:
   `<section id="menu" id="main-content" class="...">`. HTML forbids this; browsers keep the first and
   discard the second, so `#main-content` does not exist.
2. The skip link at `index.html:125` (`<a href="#main-content" class="skip-link">Skip to content</a>`)
   therefore targets nothing — keyboard users get a no-op instead of jumping past the fixed header and nav.
3. `script.js` builds its scroll-spy target list with `document.querySelectorAll('main section[id]')`.
   With no `<main>`, that returns `[]` and the `[data-nav-link]` active/`is-active` state never updates,
   so the nav never highlights the section in view.

**Fix:** wrap the sections in `<main id="main-content">`, remove the duplicate `id` from the `#menu`
section, and move the skip-link target to the `<main>` element.

### CR-04 — Body copy is effectively invisible: 1.23:1 contrast

**Files:** `index.html` — 24 occurrences of `text-surface-variant`, `styles.css` (tokens), `tailwind.config.js` (token values)

`surface-variant` is a **surface** token (`#e5e2dc`), but it is used as a **text** colour throughout, on
`bg-surface` (`#fcf9f3`). Computed contrast: **1.23:1** (WCAG AA needs 4.5:1; even large text needs 3:1).

Affected paragraphs include the hero subhead (`:189`), the signature intro (`:240`), the King Fish Thali
body copy (`:350–351`), Heritage (`:362`), all three heritage cards (`:370/377/384`), Coastal Catch
(`:395`), Menu intro (`:434`), Reviews intro (`:497`), Reservations (`:590`), Visit Us (`:622`) and
Stay Connected (`:627`) — plus every card description via `text-surface-variant/80` (e.g. `:319`, `:413`).

This is the site's primary descriptive copy, so in practice the page renders as headings floating over
blank space.

The same token misuse works in the opposite direction in the hero: the `<h1>` (`:188`) uses
`text-on-surface` (`#1c1c18`) over a photo whose overlay is `to-transparent` at the top — dark text over
whatever the photograph happens to be, with no guaranteed contrast either.

**Fix:** replace `text-surface-variant` with `text-on-surface-variant` (`#56423d`, 8.1:1 on surface)
for body copy, keep `surface-*` tokens for backgrounds only, and give the hero heading an explicit
light colour over a scrim that stays opaque behind the text.

---

## Warning

### WR-01 — Opening hours contradict themselves; JSON-LD links to a missing anchor

**File:** `index.html:86–103` (JSON-LD) vs `:614–615` and `:676–677` (visible copy)

- Visible copy (both the contact block and the footer): **Mon–Sat 12:00 PM – 11:00 PM, Sun 12:00 PM – 10:30 PM**.
- `openingHoursSpecification`: **11:30–15:30 and 19:00–23:30, every day**.

Structured data is what Google surfaces in search and Maps, so a diner can be shown hours the page
itself contradicts. Also in the same block: `hasMenu` points at `#menu-explorer`, but no such id exists
(the section is `#menu`, `:429`) — a third dead anchor; and `addressLocality`/`geo` describe the Goa
state centroid (`15.2993, 74.1240`) while the visible address says Vasco da Gama (`15.3982, 73.8113`).

**Fix:** pick one source of truth for hours, reuse it in both places, point `hasMenu` at `#menu`, and
align `addressLocality`/`geo` with the real Vasco da Gama location.

### WR-02 — Placeholder and dead links on primary CTAs

**File:** `index.html` — `:578` (`https://g.co/kgs/`), social + privacy `href="#"` links at `:629–631`, `:649–650` and `:670`

"Leave a Review" points at `https://g.co/kgs/` — the shortener's root, not the restaurant's listing — so
the reviews section's main CTA lands users on a generic Google page. Facebook, Instagram and "Privacy
Policy" are all `href="#"`, which scrolls to the top of the page instead of going anywhere.

**Fix:** put the real Google Business Profile short link in the reviews CTA, and either wire the social
URLs to real profiles or remove the icons until they exist.

### WR-03 — Prices disagree between the signature cards and the menu data

**Files:** `index.html:244–322` (signature cards) vs `script.js` (`MENU_DATA`)

Same dishes, two prices:

| Dish | Signature card | `MENU_DATA` |
|---|---|---|
| King Fish Thali | ₹550 (`:252`) | ₹380 |
| Special Fish Thali | ₹450 | ₹350 |
| Chonak Thali | ₹420 | ₹380 |
| Prawns Thali | ₹550 | ₹380 |
| Xinane Rawa Fry | ₹420 | ₹500 (`Kingfish Rawa Fry`) |

Customers see one price in the highlighted grid and a different one in the full menu.

**Fix:** derive both surfaces from `MENU_DATA` (render the signature cards from the same source) so a
price change happens in one place.

### WR-04 — Every dish and catch card reuses `hero-thali.jpg` with dish-specific alt text

**Files:** `index.html` (hero `:179`, feature `:337`, five signature cards `:244–322`, three catch cards `:398–423`), `script.js` (`renderMenuItems` sets `img.src = 'hero-thali.jpg'` for all 21 items)

The same photograph is used 10 times in markup and once per rendered menu item, with `alt` text claiming
each is a different dish ("Chonak Thali", "Prawns - jumbo coastal prawns", "Xinane Rawa Fry"). That is
misleading alt text (screen-reader users are told five different dishes are the thali photo) and the
page reads as one repeated image.

The repository already contains the correct photographs as untracked assets — `king-fish-thali.jpg`,
`prawns-thali.jpg`, `chonak-thali.jpg`, `xinane-rawa-fry.jpg`, `coastal-catch.jpg`, `fish-curry.jpg`,
`sol-kadi.jpg` and others in `images/` — none of which the page references.

**Fix:** point each card at its own asset, add a `image` field to `MENU_DATA` and use it in
`renderMenuItems`, and give the repeated decorative cases `alt=""`.

### WR-05 — `bg-olive/90 text-on-olive` badge renders unstyled

**File:** `index.html:315`; `styles.css` (`.bg-olive`, `.text-olive`)

`styles.css` defines `.bg-olive` and `.text-olive` as plain hand-written classes. Tailwind's `/90`
opacity modifier cannot apply to a class it did not generate, so `bg-olive/90` matches nothing — and
`text-on-olive` is not defined anywhere (only `.text-olive`). The "Starter" badge on the Xinane card
therefore has no background and inherits its text colour, unlike the five sibling badges.

**Fix:** use `bg-olive` (no modifier) plus a defined foreground, or add `olive`/`on-olive` to the
Tailwind theme in `tailwind.config.js` so the opacity syntax works like the other tokens.

### WR-06 — The 5-column signature grid is nested inside the narrow intro wrapper

**File:** `index.html:237–328`

`<div class="text-center max-w-3xl mx-auto mb-16">` opens at `:237` around the section label, `<h2>` and
lead paragraph — and does not close until `:328`. The five-card grid (`:242`) and the "View Full Menu"
CTA (`:325`) therefore live inside a 48rem-wide, centre-aligned container, so (a) the grid can never use
the 7xl width the section intends, and (b) all card text inherits `text-center`.

**Fix:** close the intro wrapper after the lead paragraph at `:240` and move the grid + CTA to the
section container.

### WR-07 — Mobile rail scroll shadows can never activate

**File:** `script.js:110` (category-pill scroll shadows block)

`rail` resolves to `scrollRail.querySelector('.inline-flex, …')`, i.e. `#mobile-category-rail` — a
`min-w-max` child. The element that actually scrolls is the parent (`overflow-x-auto`), so
`rail.scrollLeft` is always `0` and `rail.clientWidth`/`scrollWidth` measure the non-scrolling child.
`can-scroll-start`/`can-scroll-end` are never toggled and the `.scroll-rail::before/::after` gradients
never appear.

**Fix:** attach the listener to `scrollRail` itself (or the element carrying `overflow-x-auto`) and
measure that node.

### WR-08 — Drawer breakpoint (1200px) disagrees with the CSS breakpoint (1024px)

**Files:** `script.js:67` (`matchMedia('(min-width: 1200px)')`) vs `index.html` (`lg:` = 1024px)

The desktop nav appears at `lg` (1024px) and the drawer is `lg:hidden`, but the script only force-closes
the drawer at 1200px. Resizing or rotating a tablet from portrait into the 1024–1199px band leaves an
open drawer competing with the visible desktop nav, with `body.drawer-open` still holding
`overflow: hidden`.

**Fix:** use `(min-width: 1024px)` so the script and the utilities agree.

### WR-09 — Dead CSS layer: ~10 class definitions with no consumers

**File:** `styles.css` (modified in this change, +31 lines)

Verified by usage scan across `index.html` + `script.js`:

| Class | Uses |
|---|---|
| `.perspective-stage` | 0 |
| `.tilt-card` (+`:hover`) | 0 |
| `.hero-stagger` (+ keyframes) | 0 |
| `.menu-swap` (+ keyframes) | 0 |
| `.shimmer-badge` (+ keyframes) | 0 |
| `.animate-float-slow` (+ keyframes) | 0 |
| `.modal-shell`, `.modal-card` | 0 |
| `.glow-hover` | 0 |
| `.drawer-panel`, `.drawer-backdrop` | 0 in markup (script queries the backdrop, finds nothing) |

The file's own header still advertises "motion FX, navigation + drawer, menu rail, badges, **modal** and
a11y" — but the rewrite left the markup without any of it. `reveal-3d` survives only as a selector in
`script.js` that matches nothing.

**Fix:** delete the unused layer (and the header's claim) in the same commit that rewrote the markup, or
re-introduce the classes that are actually wanted.

---

## Info

### IN-01 — Footer base colour equals its background

`index.html:639` sets `text-on-surface` (`#1c1c18`) on `bg-[#1c1c18]` — a 1:1 ratio. Every visible child
happens to override with `text-white`/`text-gray-400`, so nothing is broken today, but any text added
without an explicit colour will be invisible. Prefer a light base colour on the footer.

### IN-02 — LCP hero image lost `fetchpriority="high"`

`index.html:179` has `loading="eager"` but no `fetchpriority="high"`. The previous revision had it;
adding it back lets the browser start the largest hero image ahead of the Tailwind CDN scripts.

### IN-03 — Two nav items point at the same section

"Our Story" and "Our Heritage" both target `#heritage` (desktop nav, drawer, and footer). Two links share
one destination, and the scroll-spy marks both active at once. Either split a real "Our Story" target or
drop one entry.

### IN-04 — `MediaQueryList.addListener` is deprecated

`script.js` uses `desktopQuery.addListener(...)`. It still works but is deprecated in favour of
`addEventListener('change', ...)`; harmless to switch while touching WR-08.

### IN-05 — The hero reveal animation never animates

`script.js` adds `hero-reveal-active` to every `.animate-hero-reveal` item immediately on load. That class
sets `opacity: 1` at two-class specificity, overriding the `opacity-0` utilities, so the hero is fully
visible from the first paint and the `IntersectionObserver` that then writes inline `opacity`/`transform`
has nothing left to reveal. Either let the observer add the class when the item intersects, or drop the
observer.

### IN-06 — `innerHTML` for constant price strings

`renderMenuItems` does `priceSpan.innerHTML = data.price` where the value is a hardcoded
`'&#8377;380.00'`. No user input reaches it, so there is no XSS today, but a `₹` in the string with
`textContent` removes the sink entirely and makes that invariant explicit.

### IN-07 — `<title>` and meta description dropped the locality

`index.html:5–6` reverted to the shorter `Hotel Anantashram | Authentic Goan Seafood & Heritage Cuisine`
and the generic description; `HEAD` carried "…| Vasco da Gama, Goa" and a longer, locality-rich
description. For a single-location restaurant the city in the title is the main local-SEO signal being
given up.

---

## Summary

| Severity | Count |
|---|---|
| Critical | 4 |
| Warning | 9 |
| Info | 7 |
| **Total** | **20** |

The three critical behavioural defects (CR-01, CR-02, CR-03) are all wiring mismatches between the
rewritten markup and JavaScript that was carried over unchanged: the script addresses ids, classes and
selectors (`#mobile-menu-panel`, `.drawer-backdrop`, `main section[id]`, `biryani`) that no longer exist
in the new HTML. Fixing markup and script together in one pass is cheaper than patching them separately.

CR-04 is independent of the rewrite's logic and is the single highest-impact visual issue: at 1.23:1 the
body copy does not render as text.
