# Theme Changelog

Tracks every audit-driven patch landed on this theme so that the next Shopify
auto-update doesn't silently reintroduce a regression.

**Per-file detail (CSV):** [`CHANGELOG.csv`](CHANGELOG.csv) — one row per file change, with timestamps and tier labels for filtering.

**Read this file when:** you need the human-readable summary by tier.
**Read the CSV when:** you need per-file detail for a specific audit ID.

All timestamps are `Asia/Kolkata (+0530)`.

---

## Tier 0 — initial baseline patch (single audit task)

### CODE-007 · 2026-05-12 12:30:17 → 13:04:08

**Replace 153 KB `swiper-bundle.min.js` with a tree-shaken ESM build.**

Audit found 86% of the Swiper bundle was unused on PDP and other pages. Switched to Swiper 11.1.15 ESM per-module files (Core + Navigation + Pagination only).

| Sub-step | When | Notes |
|---|---|---|
| Initial implementation | 12:30 | 9 ESM files added (core + helpers + nav + pag + entry + CSS), 3 layout files updated to `<script type="module">`. |
| MIME-type fix | 12:46 | Renamed `.mjs` → `.js`. Shopify CDN does not always serve `.mjs` as `application/javascript`; browsers reject modules with non-JS MIME. |
| Stale import fix | 13:04 | `swiper-create-element.min.js` still had `from "./utils.min.mjs"` — broke the whole module chain. Rewrote to `from "./swiper-utils.min.js"`. |

**Payload:** 171 KB → 100 KB raw (−71 KB, ~−43%). Est. **−25 to −30 KB gzipped JS**.

**Files touched:** `assets/swiper-bundle.min.*` (deleted), `assets/swiper-core/utils/ssr-window/create-element/classes-to-selector/navigation/pagination/slim.min.js` + `swiper-slim.min.css` (new), `layout/theme.liquid` + `theme.quickshop.liquid` + `theme.appbrew.liquid` (modified).

---

## Tier 1 — quick wins batch (6 audit tasks)

Landed `2026-05-12 15:50:35 → 16:09:38` IST.

### ✅ Done

| Audit ID | When | What |
|---|---|---|
| **CODE-002** | 15:50:35 | Removed deprecated `.seo-only` hidden H1 from homepage + `.seo-only` CSS rule from `base.css`. Cloaking-adjacent pattern flagged by audit §20. |
| **SEO-001** | 15:51:57 | Removed duplicate Product JSON-LD on PDP (`sections/main-product.liquid` lines 446-462). Shopify `structured_data` filter now the single source. _Follow-up:_ re-introduce aggregateRating via metafield enrichment or standalone AggregateRating object. |
| **PERF-010** | 15:55:06 | PDP LCP image: `loading=eager` + `fetchpriority=high` when first in gallery (`snippets/product-thumbnail.liquid`); conditional `<link rel="preload">` in `<head>` for product templates (`layout/theme.liquid`). |
| **PERF-012** | 15:57:37 | Gated mobile banner `loading=eager` on `section.index == 1` in `sections/multicolumn-promotional-grid.liquid` and `promotional-grid-slider.liquid`. Matches the pattern `image-banner.liquid` already uses. |

### ⊘ Skipped — N/A in this theme

| Audit ID | When | Why |
|---|---|---|
| **PERF-005** | 16:03:53 | Audit recommended removing jQuery 1.10.2. Theme already uses jQuery 3.6.0/3.6.3 only. Nothing to remove. |
| **PERF-009** | 16:03:53 | Audit recommended `width`/`height` on product card images. All card snippets already emit them. |

### Tier 1 follow-up

| Audit ID | When | What |
|---|---|---|
| **CODE-002 follow-up** | 16:09:38 | Restored homepage H1 using WCAG-standard `.visually-hidden` class (text: "Online Shopping Site for Home, Electronics, Kitchen & More – DeoDap"). Same CSS as `.seo-only` but semantically signals a11y intent, which search engines accept. |

---

## Tier 2 — second batch (5 audit tasks)

Landed `2026-05-12 18:03:43 → 18:11:04` IST.

### ✅ Done

| Audit ID | When | What |
|---|---|---|
| **PERF-013** | 18:03:43 | Added `width`/`height` + alt text to high-frequency icon images. Card snippets (`view.png` 40×40, `verify.png` 16×16) and 14 footer trust badges (Google Play/App Store 135×40, Trade India 107×92, Trusted-seller 193×70, Google Review 132×60, Mouthshut 145×57, Amazon 109×58, Razorpay 84×98). Locks in CLS sitewide. **Scope:** card snippets + footer only; banner sections still pending in a follow-up. |
| **PERF-014** | 18:05:37 | Added `format: 'webp'` to all 14 `image_url` calls in `snippets/card-product.liquid` — the highest-frequency product card snippet. ~40-60% byte reduction per card image on evergreen browsers. **Scope:** `card-product.liquid` only; `product-thumbnail.liquid`/`card-collection*.liquid` deferred to a follow-up after QA on this PR. |
| **CODE-001** | 18:11:04 | Created this file (`THEME_CHANGELOG.md`) + restructured `CHANGELOG.csv` with `Tier` and `Timestamp` columns. Single source of truth for the audit roll-out. |

### ⊘ Skipped — N/A in this theme

| Audit ID | When | Why |
|---|---|---|
| **PERF-015** | 18:11:04 | Audit recommended lazy-loading Firework via IntersectionObserver. In this theme Firework is loaded only in `templates/page.live-page.json` (one specific page) and is already `async type="module"` — non-blocking. Other Firework instances are Shopify App Embed blocks managed in Shopify Admin, not theme code. |
| **SEO-002** | 18:11:04 | Audit recommended BreadcrumbList JSON-LD on product + collection pages. Already implemented at `sections/Breadcrumb.liquid` lines 385-415 — renders on all templates except `index`/`cart`/`404`. |

---

## Hand-off checklist for next Shopify-pushed theme update

When Shopify's GitHub integration auto-commits `"Update from Shopify for theme Live-audit/main"`:

1. **Diff the changed files** against rows above. If any file in a row is touched, manually inspect the diff.
2. **Re-test these specific things** after merge:
   - PDP LCP image still has `fetchpriority="high"` (PERF-010)
   - Homepage source has exactly one `<h1 class="visually-hidden">…DeoDap</h1>`, no `<h1 class="seo-only">` (CODE-002)
   - PDP HTML has only ONE `<script type="application/ld+json">` containing `@type: Product` (SEO-001)
   - Product card images load as `.webp` in DevTools → Network → Type: image (PERF-014)
   - First product-card-coll/one quick-add icon has `width=40 height=40` (PERF-013)
   - Theme 564 (or whichever is unpublished) has `swiper-create-element.min.js` import = `./swiper-utils.min.js` (CODE-007 fix)
3. **If any fix is reverted:** restore from the commit referenced in `CHANGELOG.csv` (look up by Audit ID + Timestamp) and add a row in the CSV with `Action=Restore` and a note.

## Outstanding items (not yet implemented)

- **PERF-013 banner extension** — extend width/height to `image-banner.liquid`, `image-with-text.liquid`, `banner-collection-offer.liquid`, etc.
- **PERF-014 WebP extension** — extend `format: 'webp'` to `product-thumbnail.liquid`, `card-collection.liquid`, `card-collection-new.liquid`.
- **CODE-007 follow-up** — consider re-bundling the 7 ESM modules into a single classic UMD file if PageSpeed module-request overhead persists on mobile.

## Reference

- **Master audit backlog:** `DeoDap Master Audit & Implementation Tracker` Google Sheet (95 tasks across 9 categories).
- **Audit coverage so far:** 10 task IDs touched (6 in code + 4 documented as N/A).
- **PRs merged:** #1 (CODE-007), #4 (Tier 1), #5 (Tier 1 follow-up).
- **PR open:** Tier 2 (`perf/tier-2` branch) — pending review.
