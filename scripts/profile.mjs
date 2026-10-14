/**
 * Runtime performance profiler (Playwright + CDP). Measures what Lighthouse does not:
 * scrolling smoothness, interaction latency, main-thread work during scroll, and memory
 * growth across repeated navigation.
 *
 *   node scripts/profile.mjs [baseUrl] [label]
 * Writes docs/assets/profile-<label>.json and prints a summary.
 *
 * Method
 * - Each scenario runs with CPU throttling (4x on "mobile", 2x on "laptop") to approximate
 *   older hardware; frame times are sampled with requestAnimationFrame.
 * - "jank" = frames longer than 50 ms (visible stutter); "dropped" = frames > 1.5x the
 *   median frame interval (the display's refresh period in headless Chromium).
 * - CDP Performance.getMetrics deltas give script / style / layout time per scenario.
 */
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const base = (process.argv[2] ?? 'http://localhost:4173').replace(/\/$/, '')
const label = process.argv[3] ?? 'run'
// Headless Chromium reports 2 CPU cores in this sandbox, which switches the site to lite mode.
// By default the profiler reports 4 cores so the full-motion experience is measured;
// pass "lite" as the 4th argument to measure lite mode instead.
const lite = process.argv[4] === 'lite'
const out = resolve(import.meta.dirname, '../docs/assets')
mkdirSync(out, { recursive: true })

const PROFILES = {
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, cpu: 4 },
  laptop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, cpu: 2 },
}

const browser = await chromium.launch({ args: ['--enable-gpu-rasterization'] })
const results = {}

async function session(name) {
  const p = PROFILES[name]
  const ctx = await browser.newContext({ viewport: p.viewport, deviceScaleFactor: p.deviceScaleFactor, isMobile: p.isMobile, hasTouch: p.hasTouch })
  const page = await ctx.newPage()
  const cdp = await ctx.newCDPSession(page)
  await cdp.send('Performance.enable')
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: p.cpu })
  if (!lite) await page.addInitScript(() => Object.defineProperty(Navigator.prototype, 'hardwareConcurrency', { get: () => 4 }))
  await page.addInitScript(() => {
    window.__long = []
    try {
      new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__long.push(e.duration))).observe({ type: 'longtask', buffered: true })
    } catch {}
    window.__cls = 0
    try {
      new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value })).observe({ type: 'layout-shift', buffered: true })
    } catch {}
  })
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && errors.push(m.text().slice(0, 200)))
  return { ctx, page, cdp, errors }
}

const metrics = async (cdp) => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]))
const delta = (a, b) => ({
  scriptMs: Math.round((b.ScriptDuration - a.ScriptDuration) * 1000),
  styleMs: Math.round((b.RecalcStyleDuration - a.RecalcStyleDuration) * 1000),
  layoutMs: Math.round((b.LayoutDuration - a.LayoutDuration) * 1000),
  taskMs: Math.round((b.TaskDuration - a.TaskDuration) * 1000),
  layouts: b.LayoutCount - a.LayoutCount,
  styleRecalcs: b.RecalcStyleCount - a.RecalcStyleCount,
})

/** Records rAF frame intervals while `fn` runs. */
async function frames(page, fn) {
  await page.evaluate(() => {
    window.__frames = []
    let last = performance.now()
    window.__rafOn = true
    const tick = (t) => {
      window.__frames.push(t - last)
      last = t
      if (window.__rafOn) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
  await fn()
  const f = await page.evaluate(() => {
    window.__rafOn = false
    return window.__frames.slice(1)
  })
  const sorted = [...f].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)] || 16.7
  const pct = (q) => Math.round(sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))] || 0)
  return {
    frames: f.length,
    medianMs: Math.round(median * 10) / 10,
    p95Ms: pct(0.95),
    maxMs: Math.round(sorted[sorted.length - 1] || 0),
    jank50: f.filter((x) => x > 50).length,
    droppedPct: Math.round((f.filter((x) => x > median * 1.5).length / Math.max(1, f.length)) * 1000) / 10,
  }
}

async function wheelScroll(page, { distance, step, pause }) {
  const n = Math.ceil(Math.abs(distance) / step)
  for (let i = 0; i < n; i++) {
    await page.mouse.wheel(0, Math.sign(distance) * step)
    await page.waitForTimeout(pause)
  }
}

for (const prof of ['mobile', 'laptop']) {
  const { ctx, page, cdp, errors } = await session(prof)
  const r = (results[prof] = { errors })
  r.mode = lite ? 'lite' : 'full'

  // 1. Load
  const t0 = Date.now()
  await page.goto(`${base}/`, { waitUntil: 'load' })
  r.loadMs = Date.now() - t0
  r.liteActive = await page.evaluate(() => document.documentElement.classList.contains('lite'))
  await page.waitForTimeout(1500)
  const vp = PROFILES[prof].viewport
  await page.mouse.move(vp.width / 2, vp.height / 2)
  r.loadLongTasks = await page.evaluate(() => ({ count: window.__long.length, totalMs: Math.round(window.__long.reduce((a, b) => a + b, 0)), maxMs: Math.round(Math.max(0, ...window.__long)) }))

  // 2. Slow scroll down the whole homepage
  let m0 = await metrics(cdp)
  await page.evaluate(() => (window.__long = []))
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  r.slowScroll = await frames(page, () => wheelScroll(page, { distance: height, step: 120, pause: 60 }))
  r.slowScroll.work = delta(m0, await metrics(cdp))
  r.slowScroll.longTasks = await page.evaluate(() => window.__long.length)

  // 3. Fast scroll up and down twice (returning to visited sections)
  m0 = await metrics(cdp)
  r.fastScroll = await frames(page, async () => {
    for (let k = 0; k < 2; k++) {
      await wheelScroll(page, { distance: -height, step: 600, pause: 16 })
      await wheelScroll(page, { distance: height, step: 600, pause: 16 })
    }
  })
  r.fastScroll.work = delta(m0, await metrics(cdp))

  // 4. Showcase slider: click "next" 6 times, measure frames and input→paint latency
  await page.evaluate(() => document.getElementById('selezione').scrollIntoView({ behavior: 'instant' }))
  await page.waitForTimeout(600)
  m0 = await metrics(cdp)
  const lat = []
  r.slider = await frames(page, async () => {
    for (let i = 0; i < 6; i++) {
      const t = await page.evaluate(
        () =>
          new Promise((res) => {
            const s = performance.now()
            document.querySelector('#selezione [aria-label="Prodotto successivo"]').click()
            requestAnimationFrame(() => requestAnimationFrame(() => res(performance.now() - s)))
          }),
      )
      lat.push(Math.round(t))
      await page.waitForTimeout(1300)
    }
  })
  r.slider.inputToPaintMs = lat
  r.slider.work = delta(m0, await metrics(cdp))

  // 5. Pasta journey (pinned on laptop / rail on mobile)
  await page.evaluate(() => window.scrollTo({ top: document.getElementById('pasta').offsetTop - 200, behavior: 'instant' }))
  await page.waitForTimeout(400)
  m0 = await metrics(cdp)
  r.pasta = await frames(page, () => wheelScroll(page, { distance: 3200, step: 100, pause: 40 }))
  r.pasta.work = delta(m0, await metrics(cdp))

  // 6. CLS during the whole session
  r.cls = await page.evaluate(() => Math.round(window.__cls * 1000) / 1000)

  // 7. Catalogue: filter + search latency
  await page.goto(`${base}/prodotti`, { waitUntil: 'load' })
  await page.waitForTimeout(800)
  const filterMs = await page.evaluate(
    () =>
      new Promise((res) => {
        const s = performance.now()
        ;[...document.querySelectorAll('.chips .chip')].find((b) => b.textContent === 'Formaggi').click()
        requestAnimationFrame(() => requestAnimationFrame(() => res(Math.round(performance.now() - s))))
      }),
  )
  await page.waitForTimeout(400)
  const t1 = Date.now()
  await page.fill('input[type=search]', 'caciocavallo')
  await page.waitForFunction(() => document.querySelector('.browser__status strong')?.textContent.startsWith('9 '))
  r.catalog = { filterInputToPaintMs: filterMs, searchSettledMs: Date.now() - t1 }
  m0 = await metrics(cdp)
  await page.fill('input[type=search]', '')
  await page.waitForTimeout(500)
  r.catalog.scroll = await frames(page, () => wheelScroll(page, { distance: 6000, step: 150, pause: 50 }))
  r.catalog.scroll.work = delta(m0, await metrics(cdp))

  // 8. Repeated client-side navigation: route latency + heap growth
  const routes = ['/', '/prodotti/formaggi', '/prodotto/prosciutto-parma', '/catalogo', '/prodotti', '/contatti', '/territori']
  await page.goto(`${base}/`, { waitUntil: 'load' })
  await page.waitForTimeout(800)
  await cdp.send('HeapProfiler.collectGarbage')
  const heap0 = (await metrics(cdp)).JSHeapUsedSize
  const navMs = []
  for (let round = 0; round < 3; round++) {
    for (const path of routes) {
      const t = await page.evaluate(async (path) => {
        // Client-side navigation as React Router performs it.
        const s = performance.now()
        history.pushState({ idx: history.length }, '', path)
        dispatchEvent(new PopStateEvent('popstate', { state: history.state }))
        await new Promise((res) => {
          const check = () => (location.pathname === path && document.querySelector('main h1') ? res() : requestAnimationFrame(check))
          check()
        })
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
        return Math.round(performance.now() - s)
      }, path)
      navMs.push(t)
      await page.waitForTimeout(250)
    }
  }
  await cdp.send('HeapProfiler.collectGarbage')
  const m = await metrics(cdp)
  r.navigation = {
    clientNavMs: { median: navMs.sort((a, b) => a - b)[Math.floor(navMs.length / 2)], max: navMs[navMs.length - 1] },
    heapStartMB: Math.round(heap0 / 1e5) / 10,
    heapEndMB: Math.round(m.JSHeapUsedSize / 1e5) / 10,
    domNodes: m.Nodes,
    listeners: m.JSEventListeners,
  }
  await ctx.close()
}
await browser.close()

writeFileSync(resolve(out, `profile-${label}.json`), JSON.stringify({ base, label, date: new Date().toISOString(), results }, null, 2))
for (const [prof, r] of Object.entries(results)) {
  console.log(`\n=== ${prof} (${label}) mode=${r.mode} liteActive=${r.liteActive}`)
  console.log('load', r.loadMs, 'ms | load long tasks', JSON.stringify(r.loadLongTasks), '| CLS', r.cls)
  for (const k of ['slowScroll', 'fastScroll', 'slider', 'pasta']) {
    const s = r[k]
    console.log(k.padEnd(10), `median ${s.medianMs} p95 ${s.p95Ms} max ${s.maxMs} jank>50 ${s.jank50} dropped ${s.droppedPct}%`, '| work', JSON.stringify(s.work), s.inputToPaintMs ? `| input→paint ${s.inputToPaintMs}` : '')
  }
  const c = r.catalog
  console.log('catalog   ', `filter ${c.filterInputToPaintMs}ms search ${c.searchSettledMs}ms | scroll median ${c.scroll.medianMs} p95 ${c.scroll.p95Ms} jank ${c.scroll.jank50} dropped ${c.scroll.droppedPct}%`, JSON.stringify(c.scroll.work))
  console.log('nav       ', JSON.stringify(r.navigation))
  console.log('console   ', r.errors.length ? r.errors.slice(0, 5) : 'clean')
}
