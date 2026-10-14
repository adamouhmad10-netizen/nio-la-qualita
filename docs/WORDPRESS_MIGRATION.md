# WordPress migration readiness (phase two)

The prototype is a standalone Vite + React app, but it was built so the content model, URLs, metadata and components move to WordPress without redesign. This document maps each part to its WordPress counterpart and lists the recommended path.

## Recommended architecture

**Option A — Headless (recommended for keeping this exact front end).**
WordPress becomes the content back office; this React app keeps rendering. Product data comes from the WP REST API (or WPGraphQL) at build time — the existing pre-render step (`scripts/prerender.mjs`) already produces static HTML for every route, so the site stays fast and SEO-complete. Editors publish → a webhook triggers a rebuild.

**Option B — Classic theme.**
Port the components to PHP templates/blocks. The CSS (`src/styles/*`) and design tokens move almost unchanged; the interactive pieces (showcase slider, pasta journey, catalogue browser, viewer) become small JS islands. More work, but no Node build on the server.

Either way, the data model below applies.

## Content model mapping

| Prototype (`src/data/types.ts`) | WordPress |
|---|---|
| `ProductFamily` | Custom post type **`nlq_product`** (slug `prodotto`, so URLs stay `/prodotto/{slug}`) |
| `ProductFamily.id` | Post meta `nlq_id` (stable, derived from first code — never changes) |
| `slug` | Post slug |
| `sourceName` / `displayName` | Post meta `nlq_source_name`; post title = display name |
| `variants[]` (`code`, `size`, `label`, `sourcePage`) | ACF **Repeater** `nlq_variants` (or a JSON meta field) — one row per catalogue code |
| `category` | Taxonomy **`nlq_category`** (hierarchical) with the 10 terms below; rewrite base `prodotti` |
| `subcategory` | Child term of `nlq_category` (e.g. *Formaggi › Caciocavallo*) |
| `description`, `ingredients` | Post content / ACF WYSIWYG `nlq_ingredients` |
| `details[]` | ACF Repeater `nlq_details` (label, value) |
| `origin`, `producer` | ACF text fields (fill only from documented sources) |
| `images[]` (`key`, `scope`, `page`, `alt`) | Featured image + ACF Gallery; `scope` as attachment meta (`exact` / `family` / `range`); `alt` → attachment alt text |
| `sourcePages`, `verification`, `notes` | ACF fields in a "Fonte" metabox — editorial/QA only |
| `catalogOrder` | `menu_order` |
| `Category.art` (tone, ink, accent, hero image) | Term meta on `nlq_category` (colour pickers + image) |
| `Category.tagline / intro / sourceNote` | Term description + term meta |
| `SourceMention` (`regions.ts`) | Taxonomy **`nlq_place`** with term meta `quote`, `page`; assign to products |
| `Territory` | CPT `nlq_territory` or a page with ACF flexible content |
| `company.ts` | ACF Options page "Dati aziendali" |
| `content/site.ts` (editorial copy) | Front-page ACF flexible content or block patterns |
| `L10n { it, en }` | WPML / Polylang — Italian primary, English translations per field |

Category terms and their slugs (must not change — they are in URLs and the sitemap):
`pasta`, `riso`, `salumi`, `formaggi`, `miele`, `conserve`, `tonno`, `tartufi`, `doppio-senso`, `alcolici`.

## Importing the catalogue

`docs/assets/catalog.json` (regenerate with `node scripts/report-data.mjs`) contains every record in the shape above. A WP-CLI import script can read it directly:

```php
// wp eval-file import-catalog.php   (sketch)
$data = json_decode(file_get_contents('catalog.json'), true);
foreach ($data['products'] as $p) {
  $id = wp_insert_post([
    'post_type' => 'nlq_product', 'post_status' => 'publish',
    'post_title' => $p['displayName'], 'post_name' => $p['slug'],
    'post_content' => $p['description']['it'] ?? '', 'menu_order' => $p['catalogOrder'],
  ]);
  update_post_meta($id, 'nlq_id', $p['id']);
  update_post_meta($id, 'nlq_source_name', $p['sourceName']);
  update_field('nlq_variants', array_map(fn($v) => [
    'code' => $v['code'], 'size' => $v['size'] ?? '', 'label' => $v['label'] ?? '', 'page' => $v['sourcePage'],
  ], $p['variants']), $id);
  wp_set_object_terms($id, [$p['category'], $p['subcategory'] ?? null], 'nlq_category');
  // images: media_sideload_image() from /public/images/products/{key}-960.webp
}
```

## Swapping the data source (headless option)

Only three modules read data; components never import raw content:

| Module | Today | Phase two |
|---|---|---|
| `src/data/products.ts` | typed array | `fetch('/wp-json/wp/v2/nlq_product?per_page=100&_embed')` at build time, mapped to `ProductFamily` |
| `src/data/categories.ts` | typed array | `/wp-json/wp/v2/nlq_category` + term meta |
| `src/lib/images.ts` | local `/images/...` paths | attachment URLs / `srcset` from the media endpoint |

Because pre-rendering already runs in Node at build time, the fetch happens once per build — the browser never waits for WordPress.

## URLs, SEO and metadata

| Concern | Prototype | WordPress |
|---|---|---|
| Routes | `/`, `/azienda`, `/prodotti`, `/prodotti/{categoria}`, `/prodotto/{slug}`, `/territori`, `/qualita`, `/catalogo`, `/contatti`, `/privacy` | Same permalinks (CPT + taxonomy rewrites, pages) |
| Title / description / canonical / OG | `useDocumentMeta` in each page; written into static HTML at build | Yoast / Rank Math fields; same patterns (`{name} — {codes} · Noi, la qualità`) |
| Structured data | `Organization` (home), `BreadcrumbList` (all), informational `Product` (no offers/prices) | Same JSON-LD via the SEO plugin or a small filter; **do not** enable WooCommerce schema |
| Sitemap | generated from data at build (`dist/sitemap.xml`, 224 URLs) | SEO plugin sitemap (CPT + taxonomy) |
| Query-string filters (`?q=`, `?categoria=`, `?tipo=`, `?ordine=`) | client-side, shareable | keep client-side; mark as `noindex` variations via canonical (already canonical to the base URL) |

## Forms

The contact form currently validates and opens a pre-filled e-mail (no data leaves the browser). In WordPress connect it to Contact Form 7 / Gravity Forms / a REST endpoint with server-side validation, spam protection and the privacy consent stored. The product context (`?prodotto={slug}`) should be preserved as a hidden field.

## Assets

- Product images: `public/images/products/{key}-{480,960}.webp` — import as attachments; keep `alt` and `scope`.
- Editorial photos: `public/images/editorial/{key}-{640,1280,2000}.webp`; licences in `docs/ASSETS.md`.
- Catalogue viewer pages: `public/images/catalog/page-NN-{360,1400}.webp`, PDF in `public/catalogo/`.
- Logos: `public/brand/*.svg` (vector, extracted from the PDF).

## What is intentionally *not* in scope for phase one

No WordPress theme, plugins, PHP, database, WooCommerce, cart, checkout or payments. No prices exist in the source.
