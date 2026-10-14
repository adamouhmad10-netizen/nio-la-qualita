> **Superseded** by [PERFORMANCE_REPORT.md](PERFORMANCE_REPORT.md) (audit of 13–14 October 2026). Kept for history; GSAP and ScrollTrigger mentioned below have since been removed.

# Performance

## Bottom line

- **Desktop:** Lighthouse performance **98–100** on every measured page; LCP 0.6–1.0 s; CLS 0.
- **Mobile, simulated slow 4G (Lighthouse default: 150 ms RTT, 1.6 Mbps, 4× CPU slowdown):** catalogue, category, product and contact pages score **88–95**, LCP **2.3–2.7 s**. The homepage scores **~70**: **first paint 1.9 s, LCP 3.2 s, CLS 0**, but Total Blocking Time is still ~0.9 s.
- **"Under 3 seconds on 4G":** met for first paint on every page, and for the largest paint on every page except the homepage (3.2 s simulated, **2.8 s** with real applied throttling) and the catalogue viewer (3.6 s; its LCP is a full A4 page scan). This was measured on a local server, not a live host. **It has not been confirmed on production hosting or real phones**, so it should not be promised to the client yet.

## Measurements

Production build (`npm run build`) served by `scripts/serve.mjs` (same behaviour as static hosting: pre-rendered HTML per route, brotli/gzip, immutable caching for hashed assets). Lighthouse 12.2.1, headless Chromium 130, macOS 12 on an x86 laptop. Mobile simulated = median of 3 runs; others 1 run. Raw reports: `docs/assets/lighthouse/`.

| Page | Mobile perf | FCP | LCP | TBT | CLS | Mobile a11y | Desktop perf | Desktop LCP |
|---|---|---|---|---|---|---|---|---|
| Home `/` | 70 | 1.9 s | 3.2 s | 875 ms | 0 | 100 | 98 | 0.6 s |
| Catalogue `/prodotti` | 89 | 1.8 s | 2.7 s | 303 ms | 0 | 100 | 100 | 0.7 s |
| Category `/prodotti/formaggi` | 95 | 2.0 s | 2.7 s | 113 ms | 0 | 100 | 100 | 0.6 s |
| Product `/prodotto/…` | 95 | 1.8 s | 2.6 s | 97 ms | 0 | 100 | 100 | 0.6 s |
| Catalogue viewer `/catalogo` | 88 | 1.8 s | 3.6 s | 112 ms | 0 | 100 | 99 | 1.0 s |
| Contact `/contatti` | 95 | 1.8 s | 2.3 s | 110 ms | 0 | 100 | 100 | 0.6 s |

Best practices and SEO: 100 on every page measured.

With real applied throttling (`--throttling-method=devtools`, single run) the homepage measured FCP 2.5 s / **LCP 2.8 s** / TBT 724 ms; observed timings from Playwright with slow-4G + 4× CPU throttling gave FCP 1.9 s / LCP 3.0 s.

## What was done

| Change | Effect (home, mobile) |
|---|---|
| Build-time **pre-rendering** of all 224 routes (`scripts/prerender.mjs`) + hydration | Content and LCP image in the first HTML response; works without JS |
| Replaced ~150 GSAP ScrollTriggers with one IntersectionObserver + CSS transitions | TBT 7.4 s → ~1.4 s |
| Hero entrance in pure CSS; GSAP only for the desktop pinned sequence and on first slider interaction | GSAP (≈45 KB gz) no longer on the critical path |
| `content-visibility: auto` on below-the-fold chapters | Large drop in style/layout cost |
| Compression (brotli) | Home HTML 146 KB → 17.5 KB |
| Font preload + **metric-matched fallback faces** | CLS 0.13–0.3 → 0 on all pages |
| Hero image cropped to its displayed aspect ratio, 960w variant added, high fetch priority + preload | Mobile hero 200 KB → 111 KB |
| 800 px catalogue page renditions with `srcset` | Viewer first page 180 KB → 80 KB on phones |
| Route-level code splitting (each page and its CSS load separately) | Initial JS: React ≈ 54 KB gz + app ≈ 38 KB gz |
| Lazy loading for every below-the-fold image; responsive `srcset`s (WebP) everywhere | ≈ 840 KB → transferred only as needed |

Tried and dropped: wrapping each home section in its own Suspense boundary to split hydration did not reduce blocking time in measurements (median TBT 1.23 s vs 0.80 s without), so it was removed.

## Remaining homepage cost and next steps

The homepage is long (≈ 1,900 DOM nodes: 16 editorial chapters, 60+ product cards) and React hydrates all of it at load, which is the remaining blocking time. Options, roughly by effort:

1. **Partial hydration**: pre-rendered sections that are static (territories, pillars, footer, product rails) don't need React on the client. In a WordPress theme (option B in the migration doc) this happens naturally, because PHP renders the HTML and only the interactive parts (slider, pasta sequence, menu) ship JS.
2. Render fewer cards on the homepage (e.g. 6 per rail instead of 13–15) and link to the category pages.
3. Measure on the real host with a CDN, and on real mid-range Android devices, before committing to a number with the client.

## How to reproduce

```bash
npm run build && npm run preview
npm i --no-save lighthouse@12
CHROME_PATH=$(node -e "console.log(require('playwright').chromium.executablePath())") \
  node scripts/lighthouse.mjs http://localhost:4173 3 mobile,mobile-devtools,desktop
```
