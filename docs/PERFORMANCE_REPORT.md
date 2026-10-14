# Performance report — audit of 13–14 October 2026

## Summary

The site felt heavy mainly because of **continuous and avoidable rendering work**, not big downloads:

- Animations on layout properties ran forever, including on hidden slides.
- The slider restyled its whole subtree on every frame and mouse move.
- A scroll-pinned section produced huge layout shifts (CLS 10.66 while scrolling).
- Blurred backdrops were recomputed on every scroll frame.
- Synchronous layout reads ran during hydration.
- All slider images downloaded on page load.

These are fixed. **GSAP has been removed** (−46 KB gzip). Every signature interaction (slider choreography, pinned pasta sequence, reveals, page turns) is preserved, now on compositor-friendly implementations. Full list with root causes: [FIXES.md](FIXES.md).

**Honest caveat on numbers.** All measurements were made on this machine: a 2015 dual-core i5 (4 threads, 4 GB RAM). Headless Chromium here reports 2 cores and renders with a *software* GPU (SwiftShader) on those same cores. Background load varied a lot during the session (load average 3–20). In this environment:

- **Counters** (layouts, style recalcs, CLS, request bytes, listeners) are **reliable** and are the primary evidence below.
- **Timings** (frame times, Lighthouse TBT/LCP) vary by 2–5× between identical runs. I compared variants with **interleaved A/B runs** (alternating builds under identical conditions, 3–15 repetitions) and report medians or ranges, never a single best run.
- Compositor animations cost much more here than on real hardware with a GPU, so absolute frame-time results understate real-world smoothness.

## Method

| Tool | What it measures |
|---|---|
| `scripts/profile.mjs` (Playwright + CDP) | rAF frame intervals, CDP Performance counters (script/style/layout time, layout & style-recalc counts), long tasks, layout shifts, input→paint latency, heap/listeners/DOM after 21 client navigations. Scenarios: load, slow wheel scroll of the whole homepage, fast up/down ×2, 6 slider changes, pasta sequence, catalogue filter/search/scroll. Mobile = 390×844 @2x, 4× CPU; laptop = 1440×900, 2× CPU. Reports to `docs/assets/profile-*.json` |
| Lighthouse 12.2.1 (`scripts/lighthouse.mjs`) | Mobile simulated slow 4G + 4× CPU (median of 3), desktop preset |
| CDP CPU profiler, Chrome traces, LayerTree | Attribution of hot spots (function-level, task breakdown, compositing reasons) |
| Interleaved A/B (two builds served side by side) | Isolating the effect of one change under identical machine load |

## Before → after: rendering work (counters, reliable)

| Measure | Mobile (4× CPU) | Laptop (2× CPU) |
|---|---|---|
| Forced layouts during one slow scroll of the homepage | **762 → 83–94** | **918 → 122–143** |
| Layouts during 6 slide changes | **361 → 12** | **357 → 13–14** |
| Style recalculation time during 6 slide changes | **3,440 → 1,237–1,782 ms** | **3,722 → 1,019–1,583 ms** |
| Layouts while scrolling the pasta sequence | **123 → 3–4** | **124 → 21–22** |
| Layout shift while scrolling the homepage (session CLS) | 0.054 → 0–0.036 | **10.66 → 0.004–0.015** |
| Layout shift across 7 slide changes | 0.058 → **0.000** | |
| Infinite animations running on a layout property | 24 (margin) → **0** (3 transform-only, visible slide only, paused off-screen) | same |
| Idle main-thread work (10 s, any page/position) | — → 1–3 ms (≤ 49 ms just after landing on pasta) | same |
| Catalogue filter click → next paint | **435 → 18–54 ms** | **205 → 9–25 ms** |
| Client-side navigation, median / worst | **144 / 950 → 26–44 / 284–746 ms** | **65 / 675 → 26–35 / 132–692 ms** |
| Event listeners / DOM nodes after 21 navigations | 328 / 3,600 → 240–331 / ~3,000–3,700 | **1,320 / 10,703 → 244–322 / ~3,000–3,600** (growth gone) |
| Console warnings/errors in production | 6 → **0** | 6 → **0** |

## Before → after: interleaved A/B results (timings, repeated)

| Change | Measure | A | B |
|---|---|---|---|
| Selective hydration (Suspense boundaries per home section) | Load blocking time, desktop, 15 runs: median (p25–p75) | 658 ms (405–820) | **382 ms (291–468)**; repeat **282 ms (226–315)** |
| `content-visibility: auto` on home chapters (kept) | Frames > 50 ms during fast scroll, mobile 4×, 3 runs each | ON: 45 / 37 / 39 | OFF: 76 / 78 / 66 (worse) |
| Slide-image windowing + paint-before-hydrate | Lighthouse mobile home, 3 alternating runs: LCP / TBT / bytes | 4.8–5.0 s / 240–1,070 ms / 829 KB | **4.4–4.5 s / 40–320 ms / 661 KB** |
| Memoised slide components | Slider click→paint, mobile 4×, 24 clicks each | median 196 ms | median 193 ms (no measurable change; kept, harmless) |
| Prefetch links | Lighthouse mobile home LCP, 3 alternating runs | with: 5.0 / 5.1 / 5.0 s | without: 4.4 / 5.0 / 5.0 s (no consistent effect; kept for navigation speed) |

## Lighthouse — final build

Clean batch, 13 Oct 23:27–23:38 (load average 3–4). Mobile: simulated slow 4G + 4× CPU, median of 3. Desktop: 1 run. Accessibility, best practices and SEO were re-audited on the final build (14 Oct, 8 pages): **100 / 100 / 100 on every page**.

| Page | Mobile perf | FCP | LCP | TBT | CLS | Desktop perf | Desktop LCP | Desktop TBT |
|---|---|---|---|---|---|---|---|---|
| Home `/` | 62 | 1.9 s | 4.9 s | 814 ms | 0.000 | 96 | 1.0 s | 143 ms |
| Catalogue `/prodotti` | 91 | 1.8 s | 3.2 s | 140 ms | 0.000 | 93 | 0.9 s | 210 ms |
| Category `/prodotti/formaggi` | 92 | 1.9 s | 3.0 s | 70 ms | 0.000 | 100 | 0.7 s | 30 ms |
| Product page | 94 | 1.8 s | 2.8 s | 136 ms | 0.000 | 100 | 0.8 s | 17 ms |
| Catalogue viewer `/catalogo` | 85 | 1.8 s | 4.2 s | 72 ms | 0.000 | 99 | 1.0 s | 0 ms |
| Contact `/contatti` | 94 | 1.8 s | 2.8 s | 113 ms | 0.000 | 100 | 0.7 s | 0 ms |

The homepage row predates the last two homepage fixes (P15 paint-before-hydrate, P16 slide-image windowing). Measured by alternating A/B against the previous build, they give: **mobile home perf 77–83, LCP 4.4–4.5 s, TBT 40–320 ms, 661 KB** (instead of 58–75, 4.8–5.0 s, 240–1,070 ms, 829 KB). A full final Lighthouse batch couldn't be run cleanly afterwards: the machine went to sleep during the run, and after waking, another application kept one CPU core at 100 %.

### Comparison with the end of the previous session

Previous-session numbers (from `docs/PERFORMANCE.md`, different day/load, single batch): mobile home LCP 3.2 s, TBT 875 ms, perf ~70; desktop home perf 98.

This audit made desktop and mobile **TBT** lower, and **CLS** stays 0. Mobile home **LCP** measures higher than that earlier figure (4.3–4.5 s simulated). I investigated it rather than accepting it:

- Observed (unthrottled) first paint and LCP happen together, right after HTML parsing finishes (~650–800 ms). The hero image itself arrives in ~70 ms.
- Ruled out by A/B: prefetch links, stacked slide texts, the hydration timing.
- Fixed: 5 of 8 slider images were downloading before LCP (−168 KB), and hydration now starts only after the hero has painted. Together these bring LCP from 4.8–5.0 to 4.4–4.5 s.
- Not attributable: the remaining gap to the earlier 3.2 s. That measurement can't be repeated (no copy of that build) and was taken under different machine load.

**The 3-second 4G target is therefore not demonstrated for the homepage's simulated LCP.** It is met for first paint on every page (1.6–2.0 s) and for LCP on the product and contact pages (2.8 s), with the category page at 3.0 s (see table).

## Scrolling and interaction smoothness

- **Slider:** compositor-driven transitions; janky frames during 6 slide changes fell from 26 → 5–6 (laptop, best and typical runs). On the 4× mobile emulation, results ranged 9–53 depending on background load, against a baseline of 37. Click-to-next-paint is 43–162 ms on the laptop profile.
- **Pasta sequence:** the sticky implementation runs at a median of 16.7 ms per frame (60 fps), against 33.3 ms (30 fps) for the old GSAP pin on the laptop profile. It no longer shifts layout.
- **Page scrolling:** main-thread work during a full slow scroll dropped about 40–50 % in comparable runs (task time 9.6–11.0 s → 5.2–6.6 s). Frame-jank counts were inconsistent between runs in this environment, so I don't claim a percentage improvement in smoothness.
- **Fast scrolling** on 4× throttled mobile (≈ 37,000 px/s wheel bursts) still shows dropped frames as sections render in. `content-visibility` measurably reduces this (see A/B), and I found no further cause that could be attributed.

## Older hardware

- **Lite mode** turns on automatically for ≤ 2 cores or ≤ 2 GB RAM, or with Data Saver. It removes continuous decoration (drift, pointer parallax, zoom effects) and keeps every transition and interaction. `prefers-reduced-motion` gives a fully static experience.
- No WebGL, canvas, video or `backdrop-filter` is used for standard browsing.
- Bundle: initial JS ≈ 54 KB (React) + ≈ 39 KB (app) gzip. Each route chunk is 1–15 KB and prefetched at idle priority.

## Remaining limitations

1. Mobile home simulated LCP ≈ 4.4 s (see above). The next levers are fewer DOM nodes in the first screenful (the home page pre-renders ~2,000 nodes) and real hosting with a CDN. Measure again on production hosting and a real mid-range phone before promising a number.
2. Measurements come from one older laptop with a software GPU in headless mode. Real-device testing (iPhone, mid-range Android, integrated-GPU laptop) is still needed.
3. Lighthouse `simulate` mode extrapolates from an observed trace, which on this machine is sensitive to background load. Treat single runs with caution.
