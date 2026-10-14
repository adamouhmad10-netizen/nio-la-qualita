# Fixes — performance & QA audit (13–14 October 2026)

Scope: audit and repair of the existing site. No redesign: brand colours, typography, page structure, content and routes are unchanged. Every fix below was reproduced first, then verified after the change. Measurements are in [PERFORMANCE_REPORT.md](PERFORMANCE_REPORT.md); test coverage in [QA_REPORT.md](QA_REPORT.md).

## Performance

| # | Problem (how it was found) | Root cause | Fix |
|---|---|---|---|
| P1 | Desktop **CLS 10.66** while scrolling the homepage (runtime profiler: layout-shift observer during a wheel scroll) | GSAP ScrollTrigger `pin` on the pasta chapter switches the block between `position: fixed` and static; Chrome records each switch as a full-viewport shift (value 1.0) | Pin re-implemented with CSS `position: sticky` + one rAF-throttled scroll handler writing a `translate3d` (`PastaJourney.tsx`). Scroll CLS on desktop now ≈ 0.004 |
| P2 | ~760 forced layouts during one slow scroll; layout work every frame even when idle (CDP `LayoutCount`, `document.getAnimations()`) | 24 infinite `drift` keyframe animations on `margin-top` (a layout property) — including on the 7 hidden slides | Drift now animates `transform` (compositor), and only for the visible slide while the slider is on screen (`data-inview` via IntersectionObserver). Layouts per slow scroll: 762 → 83 (mobile) |
| P3 | Slider: ~3.5 s of style recalculation over 6 slide changes, up to 283 ms frames (CDP `RecalcStyleDuration`) | (a) `.showcase` transitioned `color` for 1 s — inherited, so every descendant restyled every frame; (b) pointer parallax wrote CSS variables on the section root on every mouse move, restyling the whole subtree; (c) GSAP tweened transforms from JavaScript each frame | (a) only `background-color` transitions; (b) parallax writes `translate` directly on the 3 visible floaters, rAF-throttled, rect cached; (c) choreography ported to the **Web Animations API** with the same timings and easing (cubic-bézier equivalents of expo/power curves) — runs on the compositor. Slider style time −64 %/−73 %, frames > 50 ms 37 → 9 (mobile), 26 → 5 (desktop) |
| P4 | Slider: `mix-blend-mode: multiply` on the giant word | Blend modes force the whole section to be re-composited on every animated frame | Removed; same colour via the slide accent at fixed opacity. `will-change` only on the active/leaving product and word |
| P5 | 280 ms "JavaScript" during homepage hydration (CDP CPU profile, mapped to `useRail`) | Rail prev/next helper read `scrollLeft/scrollWidth` on mount → forced synchronous layout of the whole page mid-hydration (×3 rails); pasta `measure()` wrote a style then read layout | Initial measurement via ResizeObserver (delivered after the browser's own layout); rail scroll handler rAF-throttled; pasta measure does reads before writes |
| P6 | Homepage load: one long hydration task (360–470 ms unthrottled) | The whole pre-rendered home tree hydrated in a single task | Each below-the-fold section is a Suspense boundary → React 18 selective hydration in yielding chunks. 15-run medians: 658 → 382 ms (repeat: 282 ms) of blocking time |
| P7 | Header and ribbon `backdrop-filter: blur()` | A blurred backdrop is recomputed every scroll frame — costly on integrated GPUs | Replaced by a 95–96 % opaque fill (visually equivalent on these backgrounds). Same for the hero product chip |
| P8 | Image reveals animated `clip-path` | `clip-path` cannot be animated on the compositor → full repaint of each revealing photo for 1.2 s | Reveal is now opacity + image `scale` (compositor-only), same rhythm |
| P9 | Catalogue viewer page-turn: `filter: drop-shadow` on the whole spread | Filter re-rasterised during the turn animation | Rectangular `box-shadow` on each page |
| P10 | GSAP + ScrollTrigger in the bundle (≈ 46 KB gzip) | No longer needed after P1/P3 | **Dependency removed** (`npm uninstall gsap`) |
| P11 | First visit to a route took up to 950 ms (chunk download + parse); typical client navigation 65–144 ms | Route chunks fetched on demand | Build-time `<link rel="prefetch">` for other routes' JS/CSS (fetched at idle priority, not executed). Client navigation median 144 → 26 ms (mobile), max 950 → 350 ms |
| P12 | Header/ribbon scroll handlers ran on every scroll event | — | Shared `onScrollFrame()` helper: at most once per animation frame |
| P13 | Catalogue filter click took 435 ms to paint (mobile, 4× CPU) | Re-render of the grid blocked the click's paint | React Router `v7_startTransition` (renders in a transition); search debounce 220 → 150 ms. Filter input→paint 435 → 18 ms |
| P15 | Mobile home: hero image loaded in ~70 ms but painted 600–800 ms later (Lighthouse LCP breakdown: element render delay) | Hydration started immediately and held the main thread before the hero frame could paint | `main.tsx` waits for the high-priority image to decode (capped at 1.5 s) plus one frame before `hydrateRoot`. Pre-rendered HTML stays fully readable and its links work meanwhile |
| P16 | All 8 slider product images downloaded on page load (Lighthouse network list: 5 hidden-slide images before LCP) | Hidden slides count as "near the viewport" for `loading="lazy"` | Only the current slide and its neighbours mount their image (kept once loaded). Home transfer before LCP 829 → 661 KB; LCP 4.8–5.0 → 4.4–4.5 s (A/B) |
| P17 | Every slide change re-rendered all 8 slide visuals and texts | Not memoised | `memo` on `SlideVisual` / `SlideText` (no measurable latency change; kept) |
| P14 | Low-end devices | — | **Lite mode** (≤ 2 CPU cores, ≤ 2 GB RAM or Data Saver): removes drift, pointer parallax and decorative zooms; keeps all transitions. Reduced-motion users already get a fully static mode |

### Investigated and kept / rejected (measured, not assumed)

- **`content-visibility: auto`** on home chapters — suspected of causing fast-scroll jank. A/B (3 runs each, 4× CPU mobile): turning it *off* nearly doubled frames > 50 ms (≈ 40 → ≈ 73) and added ≈ 0.6 s of load blocking. **Kept.**
- **ResizeObserver feedback loop** in the new pasta code — only 3 callbacks during load. Not a cause.
- **Prefetch links / router `startTransition` as cause of slow load** — differences were inside run-to-run noise once measured with 15 runs on a quiet machine. Kept.
- **Idle `import()` prefetch** (first attempt at P11) — injected route CSS mid-scroll and caused whole-document restyles. Replaced with `<link rel="prefetch">`.
- **Stacked slide texts (F5) as cause of the higher mobile LCP** — A/B against a single-text build: no difference (4.3–4.4 vs 4.5 s). Kept.
- **Measurement pitfall found:** headless Chromium reports 2 CPU cores in this sandbox, which activates lite mode. One intermediate profile ("after") therefore measured lite mode; the profiler now forces the full-motion experience by default (`profile.mjs … lite` measures lite mode explicitly).

## Functional and visual defects

| # | Problem | Root cause | Fix |
|---|---|---|---|
| F1 | **Pasta chapter controls (progress bar, arrows, "Esplora tutta la pasta") invisible** on desktop | The 20-card track's max-content width (~4,000 px) sized `.pasta__content`'s implicit grid column, pushing the controls off-screen | `grid-template-columns: minmax(0, 1fr)` |
| F2 | Pinned pasta chapter taller than the viewport on laptops (controls cut 6–90 px at 1440×900 / 1280×720 / 1024×768) | Fixed-size sticky panel with content sized for large screens | Type, gaps and card size scale with `vh`; lead sentence hidden in pinned mode below 820 px height; pin only when the window is ≥ 700 px tall (rail below) |
| F3 | Travelling pasta cards slid over the photograph | No clipping on the left edge | `clip-path` inset on the content column (still bleeds right) |
| F4 | Discovery ribbon covered section eyebrows after a chapter jump and the top of the pinned pasta panel | Offsets accounted for the header only | Jump offset and pinned padding include the ribbon |
| F5 | Slider product/floaters jumped 10–40 px vertically between slides (CLS 0.058 over 7 slides) | Info block height changed per slide (1–2-line names, longer quotes) | All slide texts share one grid cell (inactive hidden) → constant height. CLS 0.000 |
| F6 | Outgoing slide's word/illustrations switched to the incoming slide's colour mid-transition | Shared `--accent` on the section | Per-slide accent on each word and slide |
| F7 | React Router deprecation warnings in the production console | v6 future flags not set | `v7_startTransition`, `v7_relativeSplatPath` on `BrowserRouter` and `StaticRouter`. Console clean |
| F9 | Philosophy numerals "01–04" (home and Qualità page) at 1.66:1 contrast — the last accessibility failure | Brand gold `#fdb732` used for small text on ivory | New `--c-gold-text` ochre `#8f6200` (5.1:1) for small text on light backgrounds; bright gold kept for decoration and on dark navy. Lighthouse accessibility 97 → 100 on home |
| F8 | Tests reading the UI between URL change and render commit | Router updates now render in transitions | Tests wait for the rendered state (`waitCount`) instead of the URL |

## Changed files

`src/components/home/PastaJourney.tsx`, `src/components/home/Showcase.tsx`, `src/components/home/Ribbon.tsx`, `src/components/layout/Header.tsx`, `src/lib/useRail.ts`, `src/lib/motion.ts`, `src/App.tsx`, `src/main.tsx`, `src/entry-server.tsx`, `src/pages/Home.tsx`, `src/components/catalog/ProductBrowser.tsx`, `src/styles/{base,layout,home,pages}.css`, `index.html`, `vite.config.ts`, `package.json` (gsap removed), `scripts/prerender.mjs` (prefetch), `scripts/qa.mjs` (375 px, display-none filter, hidden-content check), `scripts/functional.mjs` (transition-safe waits, 27 tests), `scripts/serve.mjs` (`DIST` for A/B), new `scripts/profile.mjs`.

---

## Icons and two product images (14 October 2026)

### Icon system — Lucide (single library)

Lucide (ISC licence, `lucide-react`, tree-shaken) was already the interface icon set; it was kept as the **only** library so every icon shares one grid (24 px), stroke style and rounded joins. No new dependency was added.

| Where | Before | After |
|---|---|---|
| Slider floaters (8 slides) | Hand-drawn SVG approximations (wheat, wedge, pepper dots, hexagon cluster, drop, waves, truffle) | Lucide `Wheat`, `Sprout`, `Milk`, `Grape`, `Leaf`, `Ham`, `Droplets`, `Hexagon`, `Droplet`, `Flower2`, `Fish`, `Waves`, `Shell`, `TreeDeciduous` — each tied to something the catalogue mentions (e.g. *vinacce d'uva* → Grape, *latte* → Milk) |
| Category chapter marks (Riso, Miele, Conserve, Mare, Tartufi) | Hand-drawn grain / hexes / leaf / waves / truffle | Lucide `Sprout`, `Hexagon`, `Leaf`, `Fish`, `TreeDeciduous` |
| Philosophy pillars (home) | Hand-drawn magnifier, sprig, hills, crown | Lucide `SearchCheck`, `Wheat`, `MapPinned`, `Stamp` |
| Sort select chevron (catalogue) | Hand-written CSS data-URI chevron | Lucide `chevron-down` geometry |
| Stroke consistency | Mixed widths (1.4–2 px, scaled with size) | Global rule: `vector-effect: non-scaling-stroke`, 1.6 px for UI icons, 1.25 px for large decorative motifs |

Kept unchanged: the brand logos and the teal/gold `BrandStrokes` (brand artwork derived from the logo, not icons).

### Product images — Caciocavallo affinato in vinaccia (p. 13) and Linea miele (p. 23)

- **Source:** original embedded images extracted from the PDF (689×520 and 1792×2390 JPEG). Their PDF soft masks were checked and are 100 % opaque (no usable cutout in the source).
- **Segmentation:** `rembg` 2.0.59 with the `isnet-general-use` model (also compared with `u2net`, with and without alpha matting; isnet gave the cleanest base mask).
- **Refinement** (`scripts/cutouts-refine.py`, original pixels only — nothing regenerated):
  - *Cheese:* edge opacity by unmixing each pixel against the nearest dark vinaccia/rind colour (removes white halos around crumbs); cheese body from the filled AI mask minus the grey reflective surface; the photo's contact shadow re-expressed as black at the opacity of its darkening, so it darkens any background instead of showing as a pale patch; colour decontamination against white; single-pixel noise removed.
  - *Honey:* the mirror reflection under the jars is cut at each stack's last row of real honey colour (per column, smoothed), thin glass/reflection slivers at jar corners removed with a banded morphological opening, small detached specks dropped, 1 px choke on near-white outer-edge pixels, colour decontamination.
- **Verification:** transparent borders (alpha 0 on all edges), checked on white, ivory, navy and checkerboard (`docs/screenshots/icons-and-images/transparency-check.png`); outer-edge near-white pixels: cheese 118 of 4,858 edge px (pale rind), honey 615 of 13,242 (label/lid-sticker edges, dimmed).
- **Limitations (honest):** the cheese source is only 689×520 px, so the cutout is 543×435 — fine for cards and the slider (displayed ≤ ~460 px) but not for large zoom; the outer contour shows slight JPEG softness on dark backgrounds at 2× zoom. The honey jars' glass bottoms were partly indistinguishable from their reflection in the photo, so the cut follows the honey line (a few px of clear glass base may be trimmed).

---

## Product showcase ("La selezione") — responsive layout (14 October 2026)

Measured with the new `npm run qa:showcase -- <label> [url] [--shots]` (all 8 slides × 10 viewports, 320–1920 px, captured after transitions settle; checks text ∩ decorative word, text ∩ product image, floater ∩ image, word clipping, label under sticky chrome, page overflow). Screenshots: `docs/screenshots/showcase/` (`before-*`, `after-*`, `compare-*`, `*-viewport-*` = arrival view with header and ribbon).

**Result: 49 of 80 slide/viewport combinations had collisions → 0.**

| # | Problem | Root cause | Fix |
|---|---|---|---|
| S1 | Giant word overlapped the product name (Salumi, Tartufi, Formaggi, Mare, Conserve) on mobile and on desktop with two-line names | The word layer was centred on the whole section (`inset: 0`), so it landed wherever the info text happened to be | Word and product now share one bounded box, `.showcase__visual` (a CSS size container). The word is bottom-aligned inside it and sized `min(21cqi, 28cqh)`, so it fits the box width (longest words: Formaggi, Conserve) and can never leave the box. The info is a separate grid row below |
| S2 | Product composition: product floated above the word with a variable gap; Riso Carnaroli left a large empty band | Product sat in a flexible `1fr` stage of a section with `min-height: min(100svh, 980px)` | Product stands on the word: bottom-aligned with `object-fit: contain`, base overlapping only the word's upper third (`padding-bottom: 19cqh`), width capped at 60 % of the box (original aspect ratio kept, no clipping). Box height: phones `clamp(250px, 64vw + 40px, 420px)`, tablets `clamp(340px, 46vh, 500px)`, wide `clamp(380px, 50vh, 580px)`. Section `min-height` removed |
| S3 | Desktop: image → heading distance varied 36–211 px between slides | Text cells of all slides share one grid cell (prevents layout shift) and were bottom-aligned, so short slides got empty space *above* the heading | Text aligned to the top: the heading always sits right under the word. Image → heading is now constant per viewport (93 px at 320 → 157 px at 1920, mostly the word itself); spare height falls below the CTA. Desktop text column widened to 720 px so the longest name ("Prosciutto San Daniele disossato riservato legato a mano") wraps to 2 lines; name size `clamp(1.75rem, 1.2rem + 2.4vw, 3.25rem)` with balanced wrapping |
| S4 | Mobile slide tabs clipped mid-word with no cue; active tab could be off-screen | Equal-flex tabs in a scroll row | Tabs don't shrink (`flex: 0 0 auto`, `white-space: nowrap`, ≥ 44 px tall, 1.1 rem gap), scroll-snap, a fade mask on the right edge hinting at more, and the active tab is scrolled into the centre of the row on every change (row only — the page never scrolls) |
| S5 | Chapter ribbon (sticky, below the header) crowded on phones | No overflow cue | Fade mask at the right edge, tighter item padding, 36 px chips; existing active-chip centring kept |
| S6 | Section label and counter too close to / hidden by the sticky chrome | No offset for the sticky header + ribbon; counter at 85 % opacity | `scroll-margin-top` covering header + ribbon, top padding with `env(safe-area-inset-top)`, counter at full contrast; verified clear at every viewport on arrival via the ribbon |
| S7 | Decorative icons overlapped the product on phones and crowded the composition | Floaters positioned at 8–80 % of the width, i.e. inside the product column | Floaters moved to the outer bands (5 %, 84–86 %) and upper area, clear of the centred 60 % product column and the word; only one shown below 600 px |

Not changed: product data, names and codes, images, logo, palette, routes, slide transitions (same Web Animations choreography and timings). No new dependencies; no new JavaScript animation — the layout is pure CSS (grid + container units); the only JS added is the tab-row `scrollTo` on slide change.

**Notes and limits**
- On short slides (e.g. Riso), the spare height appears between the CTA and the arrows on phones: this is the cost of keeping the arrows and tabs fixed in place across slides (no layout jump). 
- By design the product covers the middle of the word on wide screens (editorial layering); the word stays recognisable because only its upper third is covered.
- The skip link appeared in tall element screenshots: that is a capture artefact of fixed-position elements (it is off-screen until focused); left unchanged, since hiding it with `visibility` would make it unfocusable.
