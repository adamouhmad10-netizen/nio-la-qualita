# QA report

## Audit of 13–14 October 2026 (performance & QA pass)

Tested on the **production build** (`npm run build` → `npm run preview`: pre-rendered pages, real 404, compression) in Chromium 130 via Playwright 1.48, on a 2015 dual-core i5 MacBook (4 threads, 4 GB RAM, macOS 12). Fixes are listed in [FIXES.md](FIXES.md); measurements in [PERFORMANCE_REPORT.md](PERFORMANCE_REPORT.md).

### What was tested

| Area | How | Result |
|---|---|---|
| Interaction suite | `npm run test` — 27 Playwright tests (search, filters, sort, back/forward, progressive rendering, product pages, lightbox + Escape, inquiry prefill, form validation, catalogue viewer keys/swipe/deep links, slider buttons/keys incl. mid-transition input, pasta sequence, ribbon jumps, 404, alcohol notice, mobile menu focus trap/Escape/navigation, reduced motion, no content stuck hidden) | ✅ 27/27 on the final build (26/26 three consecutive runs before the last test was added) |
| Visual + structural | `npm run qa` — 12 routes; home/catalogue/product at 320, 360, **375**, 390, 430, 768, 1024, 1280, 1440, 1920 px; other routes at 320, 375, 390, 768, 1024, 1440, 1920 | ✅ 93 captures: 0 horizontal overflow, 0 broken images, 0 console errors, 0 failed requests, 1 `<h1>` per page, 188 internal links resolve, no reveal content left invisible |
| Catalogue data | `npm run check:data` + PDF code diff | ✅ 206 families, 276 codes, all images present |
| Scrolling | `scripts/profile.mjs`: slow wheel scroll of the whole homepage, fast up/down ×2, returning to visited sections, scrolling the catalogue, under 4× (mobile) and 2× (laptop) CPU throttling | See performance report; no blank frames observed in screenshots taken mid-scroll |
| Slider | 6 slide changes per session, click→paint latency, frames; rapid clicking (5 clicks in 600 ms) | ✅ ends on the correct slide in a clean state; no layout shift between slides |
| Repeated navigation | 21 client-side navigations across 7 routes, heap/listeners/DOM nodes after GC | ✅ stable (no growth); console clean |
| Idle | 10 s idle at top, slider, pasta, footer, catalogue, viewer | ✅ 1–3 ms main-thread work per 10 s (49 ms right after landing on pasta, as reveals finish) |
| Hydration | 15-run medians, desktop | ✅ no hydration mismatch logged on any route |
| Older hardware | 4× CPU throttle + slow 4G (Lighthouse); lite mode verified to activate with ≤ 2 cores | ✅ lite mode removes continuous decoration; all content and interactions remain |
| Reduced motion | `prefers-reduced-motion: reduce` context | ✅ no pinning, no animations, all content visible |
| Accessibility / best practices / SEO | Lighthouse on 8 pages (home, catalogue, category, product, viewer, contact, alcolici, territori) | ✅ 100 / 100 / 100 on every page |

### Defects found and fixed in this pass

See [FIXES.md](FIXES.md) — notably: pasta chapter controls were off-screen on desktop (F1), pinned chapter taller than laptop viewports (F2), cards sliding over the photo (F3), ribbon covering headings (F4), slider jumping 10–40 px per slide (F5), wrong accent colour on outgoing slide (F6), React Router warnings in production (F7).

### Screenshots

`docs/screenshots/` — `{page}--{viewport}.png` (tall pages split into `.partN.png`). Reduced-motion homepage captures (`home--desktop--reduced.*`, `home--mobile--reduced.*`) show the page without the sticky pasta spacer that appears as an empty band in single full-page captures of the desktop motion version.

### Limitations of this testing

- Chromium only (no Safari/Firefox in this environment); no physical phones.
- Headless Chromium renders with a software GPU (SwiftShader) on the same two CPU cores, which inflates the cost of compositor animations compared with real hardware; frame-time measurements are noisy (see performance report).
- Screen readers not run; accessibility checked structurally and with Lighthouse.

---

## Previous QA (initial build)


Tested on the **production build** (`npm run build` → `npm run preview`, which serves `dist/` like real hosting: per-route pre-rendered HTML, real HTTP 404, gzip/brotli). Browser: Chromium 130 via Playwright 1.48 on macOS 12 (x86_64). Date: 13 October 2026.

### Automated checks

| Suite | Command | Result |
|---|---|---|
| Type check | `tsc -b` | ✅ 0 errors |
| Catalogue integrity | `npm run check:data` | ✅ 0 errors — 206 families, 276 codes, every referenced image exists; 1 expected warning (NQS421 duplicated in the source PDF) |
| PDF ↔ data code diff | extraction script | ✅ 0 codes missing, 0 extra |
| Interaction tests | `npm run test -- http://localhost:4173` | ✅ **26 / 26 passed** (3 consecutive runs) |
| Visual/structural QA | `npm run qa -- http://localhost:4173` | ✅ 12 routes × up to 9 viewports (63 captures): no horizontal overflow, no scroll-reveal content left invisible, no broken images, no failed requests, no console errors, exactly one `<h1>` per page; 188 distinct internal links checked, 0 broken |
| Hydration | production console during QA | ✅ no hydration mismatches on any route (mismatches are logged as errors by design) |
| Build | `npm run build` | ✅ no warnings; 224 routes + 404.html pre-rendered |

The only non-200 response in QA is the intentional `404` on `/pagina-inesistente`.

#### Interaction tests (scripts/functional.mjs)

1. Deep link `?categoria=miele` applies after hydration (6 results)
2. Catalogue shows 206 families on load
3. Search by code `NQE217` → 1 result, URL updated with `?q=`
4. Accent/case-insensitive search ("golosa qualita" → *Prosciutto scelto per Golosa Qualità*)
5. Empty state appears and "Azzera filtri" resets everything
6. Category chip → Formaggi 43; subcategory → Caciocavallo 9
7. Browser **back** restores previous filter states step by step
8. Sort Z–A
9. Progressive rendering: 36 cards, "Mostra altri prodotti" → 72; focus moves to the first new card
10. Product card navigates to its detail page
11. Lightbox opens; **Escape** closes it (native `<dialog>`)
12. Prosciutto Parma shows all 4 codes in its variants table
13. "Richiedi informazioni" pre-fills the contact message with product name and all codes
14. Contact form: empty submit shows errors and focuses the first invalid field
15. Contact form: valid submit builds a `mailto:info@noilaqualita.it` message and shows an honest status (no fake "sent")
16. Catalogue viewer: next button, **ArrowRight** key, deep link `?pagina=13` → spread 12–13
17. Showcase slider: next button and **arrow keys** change slide; tab state follows
18. Pasta journey pins on desktop; "Formato successivo" advances
19. Discovery ribbon links land exactly on their chapter (with `content-visibility` re-alignment)
20. Unknown product slug → 404 page
21. Alcohol category shows the adult-audience notice
22. Mobile: menu opens, locks scroll, **traps focus**, Escape closes and **returns focus** to the toggle
23. Mobile: menu link navigates and closes the menu
24. Mobile: swipe on the catalogue viewer turns the page
25. Reduced motion: no pinning, no hidden-until-animated content
26. Every scroll-reveal element on the homepage is visible after scrolling through the page

### Manual / visual review

Screenshots in [`docs/screenshots/`](screenshots/) (`{page}--{viewport}.png`, full page). Reviewed at 320, 360, 390, 430, 768, 1024, 1280, 1440 and 1920 px.

- **Full-page homepage:** `FULLPAGE-home--desktop--reduced.webp` (1440 px, scaled 50 %) and `FULLPAGE-home--mobile--reduced.jpg` (390 px).
- Pages taller than ~15,000 px are saved as `.part1/2/3.png` (Chromium cannot capture taller images in one piece).
- Desktop home captures with motion enabled show a tall empty band where the pasta sequence is pinned: that is the scroll distance the pin consumes, visible only in a single full-page capture. The `--reduced` captures show the same page without pinning.

Issues found during review and fixed:

| Issue | Fix |
|---|---|
| Scroll reveals left sections blank (triggers measured before the pinned section existed) | Replaced ~150 ScrollTriggers with one IntersectionObserver + CSS transitions |
| Rails had no left gutter (`ul[role=list]` reset outranked `.rail`) | Reset wrapped in `:where()` |
| Circular inset photos overlapped Formaggi/Salumi headlines | Insets anchored to the lead image corner |
| Territory collage left an empty cell; "Isole" tile showed an alpine lake | Grid span fixed; replaced with a coastal Sicilian town |
| Cormorant old-style figures made "10" read as "IO" | Lining numerals for all figures |
| Honey chapter repeated the same range photo four times | Index layout: one photo + list of the six honeys with codes/sizes |
| Oversaturated rice-field photo | Replaced with a risotto photograph |
| Decorative strokes crossed footer headings and the mobile CTA headline | Removed / repositioned on small screens |
| White boxes around PDF crops on tinted cards | White card media; multiply blend only on tinted surfaces |
| Font swap shifted layout (CLS 0.13 on /prodotti) | Font preload + metric-matched fallback faces → CLS 0 |
| Footer jumped when route chunks loaded (CLS 0.3) | Pre-rendered HTML + full-height route loader |
| Low-contrast small labels (accent colours, muted grey 4.36:1) | Labels use section ink; muted grey `#596070` (≥ 5.1:1); accents kept decorative |
| Heading level skip on catalogue grid | Visually hidden `h2` before product cards |
| Stray CSS brace from an edit dropped later rules | Removed; build now warning-free |
| After moving reveals to CSS, the "visible" rule had lower specificity than the "hidden" rule, leaving fade-in content invisible site-wide | Selectors matched; QA and a test now fail if any reveal content stays hidden |
| Showcase dropped a click/key press made during a transition | The running transition jumps to its end and the new one starts |
| Background word in the showcase changed opacity after the first transition | Single shared value |
| Azienda logo row overflowed by 16 px at 320 px | Row wraps, logos scale |

### Accessibility notes

- Skip link, visible focus rings (blue on light, gold on dark), semantic landmarks, breadcrumbs with `aria-current`.
- Carousels: real buttons with labels, keyboard arrows, `aria-roledescription`, live region announcing the slide; **no autoplay**.
- Mobile menu: `role="dialog"`, `aria-modal`, focus trap, Escape, focus return, scroll lock.
- Lightboxes use native `<dialog>` (focus containment and Escape for free).
- Forms: labels, `aria-invalid`, `aria-describedby` errors, first-error focus, required marked.
- `prefers-reduced-motion`: all entrances, pinning, parallax, drifting illustrations and page-turn effects are disabled; content is always visible.
- Pre-rendered HTML means every page is readable with JavaScript disabled (verified on home and product pages).
- Lighthouse accessibility scores: see [PERFORMANCE.md](PERFORMANCE.md).

### Not tested / limitations

- Only Chromium was automated. Safari/Firefox were not available in this environment; the CSS uses widely supported features (`:has()` only for progressive enhancements: card focus ring and media padding).
- No real devices; mobile was emulated (viewport, touch, DPR).
- Screen readers were not run; checks were structural (roles, names, focus order).
- The `mailto:` hand-off depends on the visitor having a mail client; the copy-text fallback covers the rest.
