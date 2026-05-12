# Theme Changelog

Tracks every audit-driven patch landed on this theme so that the next Shopify
auto-update doesn't silently reintroduce a regression.

**Source of truth for per-file detail:** [`CHANGELOG.csv`](CHANGELOG.csv) at the
repo root. This file is the human-readable summary keyed by audit ID.

> Before merging a Shopify-pushed update commit, re-grep for any task ID below
> in the changed files. If a fix here is reverted by the update, re-apply it
> and add a note in the row.

| Audit ID | Date | File(s) | Reason | Status |
|---|---|---|---|---|
| CODE-007 | 2026-05-12 | `assets/swiper-bundle.min.*` → 9 tree-shaken ESM files; `layout/theme.*.liquid` | Audit found 86% of Swiper bundle unused. Switched to Core + Navigation + Pagination only. **Note:** see CODE-007 row in CHANGELOG.csv re: per-module module-script overhead and post-merge swiper-create-element fix. | Done |
| CODE-002 | 2026-05-12 | `layout/theme.liquid`, `assets/base.css` | Removed deprecated `.seo-only` hidden H1 (cloaking-adjacent). Restored H1 with WCAG-standard `.visually-hidden` class. | Done |
| SEO-001 | 2026-05-12 | `sections/main-product.liquid` | Removed duplicate Product JSON-LD on PDP. Shopify `structured_data` filter is now the single source. **Follow-up:** re-introduce aggregateRating via metafield enrichment or standalone AggregateRating object. | Done |
| PERF-010 | 2026-05-12 | `snippets/product-thumbnail.liquid`, `layout/theme.liquid` | PDP LCP image: `loading=eager` + `fetchpriority=high` when first in gallery; conditional `<link rel="preload">` in `<head>` for product templates. | Done |
| PERF-012 | 2026-05-12 | `sections/multicolumn-promotional-grid.liquid`, `sections/promotional-grid-slider.liquid` | Mobile banner `loading=eager` gated on `section.index == 1` so only the first section is treated as the LCP candidate. | Done |
| PERF-013 | 2026-05-12 | `snippets/card-product*.liquid`, `sections/footer.liquid` | Added `width`/`height` (intrinsic dimensions) to high-frequency icons in product cards (view/verify) and footer trust badges to lock in CLS. | Done (partial — banner sections still pending) |
| PERF-014 | 2026-05-12 | `snippets/card-product.liquid` | Added `format: 'webp'` to product card image_url calls. ~40-60% byte savings on each card image for evergreen browsers. Other image-emitting files left for follow-up after QA. | Done (partial) |
| PERF-005 | 2026-05-12 | — | N/A: theme already uses jQuery 3.6.x; no 1.10.2 to remove. | N/A |
| PERF-009 | 2026-05-12 | — | N/A: product card snippets already emit width/height on the main product image. | N/A |
| PERF-015 | 2026-05-12 | — | N/A in theme code: Firework script in `templates/page.live-page.json` is already `async`. App-embed Firework blocks are managed in Shopify Admin, not theme code. | Deferred to app-level work |
| SEO-002 | 2026-05-12 | — | N/A: `sections/Breadcrumb.liquid:385-415` already renders BreadcrumbList JSON-LD on all non-home/cart/404 templates. | Already implemented |

## Hand-off notes for next theme update

When Shopify's GitHub integration auto-pushes a new theme update commit:

1. **Diff the changed files against the rows above.** If any of the files in
   "File(s)" column changed, manually inspect the diff.
2. **Re-test these specific things after merge:**
   - PDP LCP image still has `fetchpriority="high"` (PERF-010)
   - Homepage has no `<h1 class="seo-only">` and exactly one `<h1 class="visually-hidden">…DeoDap</h1>` (CODE-002)
   - PDP source has only ONE `<script type="application/ld+json">` containing `@type: Product` (SEO-001)
   - Product card images load as `.webp` via Network panel (PERF-014)
   - First product-card-coll/one quick-add icon has `width=40 height=40` (PERF-013)
3. **If any fix is reverted:** restore from the commit referenced in `CHANGELOG.csv` and add a "Re-applied YYYY-MM-DD" note in that row's Status.

## Audit scope reference

Full backlog is in the master Google Sheet
(`DeoDap Master Audit & Implementation Tracker`). 95 tasks across 9 categories;
this changelog only covers theme-code edits that have actually landed.
