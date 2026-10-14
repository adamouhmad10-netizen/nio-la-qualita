# Noi, la qualità — digital catalogue (phase one prototype)

A pre-rendered, responsive React site presenting the **Catalogo Prodotti 2026** of Gruppo Noi, la qualità srl and its own brand Golosaqualità: 10 categories, 206 product pages, 276 catalogue codes, all transcribed from the client PDF.

This is the **client-approval prototype**. No WordPress, e-commerce, cart, prices or payments — see [docs/WORDPRESS_MIGRATION.md](docs/WORDPRESS_MIGRATION.md) for phase two.

## Quick start

Requires Node.js ≥ 20 (developed on 22.20 LTS).

```bash
npm install
npm run dev            # http://localhost:5173  (client-rendered dev server, hot reload)

npm run build          # type-check → client build → SSR build → pre-render 224 pages + 404.html into dist/
npm run preview        # serve dist/ like production hosting (dir index, real 404, gzip/brotli) on :4173
```

Quality checks (run against a running server):

```bash
npm run check:data                      # catalogue integrity: ids, slugs, codes, image files
npm run test -- http://localhost:4173   # 27 Playwright interaction tests
npm run qa -- http://localhost:4173     # screenshots at 9 viewports + overflow/console/404-link checks
node scripts/lighthouse.mjs http://localhost:4173 3   # needs: npm i --no-save lighthouse; CHROME_PATH
node scripts/profile.mjs http://localhost:4173 label   # runtime profile: scrolling, slider, navigation, memory
```

Playwright needs a browser once: `npx playwright install chromium`.

## What's inside

| Path | Contents |
|---|---|
| `src/data/` | **Single source of truth.** `products.ts` (206 families, typed variants, verbatim text, source pages, verification status), `categories.ts`, `regions.ts`, `types.ts`, `credits.ts` |
| `src/content/` | `company.ts` (verified contact data from the PDF), `site.ts` (editorial copy), `showcase.ts` |
| `src/pages/` | Home, Products, CategoryPage, ProductPage, Azienda, Territori, Qualita, Catalogo, Contatti, Privacy, NotFound |
| `src/components/` | `layout/` header, footer · `home/` section components · `catalog/ProductBrowser` · `product/Gallery` · `ui/` cards, images, breadcrumbs… |
| `src/styles/` | `tokens.css` (design tokens, fonts) · `base.css` · `layout.css` · `components.css` · route CSS (`home`, `catalog`, `pages`) |
| `src/lib/` | text casing/slugs, image URLs, SEO head, motion helpers, reveal observer, hydration helpers |
| `src/entry-server.tsx`, `scripts/prerender.mjs` | Build-time pre-rendering of every route |
| `public/` | Logos (vector, from the PDF), product crops, editorial photos, catalogue page renders, the original PDF |
| `source/` | Client inputs: PDF, logo, reference screenshot, two motion videos |
| `docs/` | Reports (see below) and `screenshots/` |

## Routes

`/` · `/azienda` · `/prodotti` (`?q=`, `?categoria=`, `?tipo=`, `?ordine=`) · `/prodotti/{pasta|riso|salumi|formaggi|miele|conserve|tonno|tartufi|doppio-senso|alcolici}` · `/prodotto/{slug}` · `/territori` · `/qualita` · `/catalogo` (`?pagina=`) · `/contatti` (`?prodotto=`, `?richiesta=catalogo`) · `/privacy` · anything else → 404.

## Design system in brief

- **Colours** sampled from the vector logo: navy `#25416d`, teal `#66c6b5`, gold `#fdb732`, sphere blues; catalogue red `#a42629`; Golosaqualità red `#be1e2d`. Each category adds its own environmental palette (`category.art`) — wheat for pasta, limestone for cheese, terracotta for salumi, amber for honey, olive for preserves, sea blue for tuna, earth for truffles.
- **Type**: Cormorant Garamond (editorial display) + Manrope (interface), self-hosted, with metric-matched fallbacks to avoid layout shift.
- **Two modes**: expressive editorial chapters on the homepage; calm, dense product browsing on catalogue pages.
- **Motion**: no animation library. CSS transitions + one IntersectionObserver for reveals; the slider uses the Web Animations API (compositor-only transform/opacity); the desktop pasta sequence uses CSS `position: sticky` with one rAF-throttled scroll handler. Everything honours `prefers-reduced-motion`, and a lite mode (≤ 2 cores / ≤ 2 GB RAM / Data Saver) drops continuous decoration. No scroll hijacking.

## Deployment notes

`dist/` is a static site. Any static host works if it serves `path/index.html` for `/path` and `404.html` for unknown paths (Netlify, Vercel, Cloudflare Pages, S3+CloudFront, Apache, nginx `try_files $uri $uri/index.html =404`). Enable gzip/brotli. Set `VITE_SITE_URL` (canonical/OG/JSON-LD) and `SITE_URL` (sitemap) to the production origin at build time; both default to `https://www.noilaqualita.it`.

## Documentation

- [docs/CATALOG_EXTRACTION_REPORT.md](docs/CATALOG_EXTRACTION_REPORT.md) — method, totals, every record, all ambiguities
- [docs/CONTENT_VERIFICATION.md](docs/CONTENT_VERIFICATION.md) — source-backed vs editorial copy, items for client confirmation
- [docs/QA_REPORT.md](docs/QA_REPORT.md) — what was tested and results
- [docs/PERFORMANCE_REPORT.md](docs/PERFORMANCE_REPORT.md) — performance audit: profiling method, before/after, A/B results
- [docs/FIXES.md](docs/FIXES.md) — every problem found in the audit, root cause and fix
- [docs/PERFORMANCE.md](docs/PERFORMANCE.md) — initial-build Lighthouse notes (superseded)
- [docs/WORDPRESS_MIGRATION.md](docs/WORDPRESS_MIGRATION.md) — CPT/taxonomy mapping and migration path
- [docs/ASSETS.md](docs/ASSETS.md) — origin and licence of every image and font
