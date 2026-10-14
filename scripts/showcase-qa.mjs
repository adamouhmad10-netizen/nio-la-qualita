/**
 * Showcase (La selezione) visual QA: every slide × breakpoint, captured after the slide
 * transition settles, plus geometric checks:
 *  - text collision: product name/line/codes/CTA vs the giant decorative word, product image, floaters
 *  - clipping: product image or info outside the section, ribbon/header covering the section label
 *  - horizontal overflow of the page
 *   node scripts/showcase-qa.mjs <label> [baseUrl] [--shots]
 */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const label = process.argv[2] ?? 'run'
const base = (process.argv[3]?.startsWith('http') ? process.argv[3] : 'http://localhost:4173').replace(/\/$/, '')
const shots = process.argv.includes('--shots')
const out = resolve(import.meta.dirname, '../docs/screenshots/showcase')
mkdirSync(out, { recursive: true })
const VPS = [[320, 640], [360, 740], [375, 812], [390, 844], [430, 932], [768, 1024], [1024, 768], [1280, 800], [1440, 900], [1920, 1080]]

const b = await chromium.launch()
const report = []
for (const [w, h] of VPS) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w < 800 ? 2 : 1, isMobile: w < 800, hasTouch: w < 800 })
  const p = await ctx.newPage()
  await p.goto(base + '/', { waitUntil: 'networkidle' })
  // Element captures of a section taller than the viewport would show fixed chrome
  // (skip link, header) mid-image; hide only for screenshots.
  if (shots) await p.addStyleTag({ content: '.skip-link, .site-header, .ribbon { display: none !important }' })
  await p.waitForTimeout(400)
  // Scroll to the section as a user would (header + ribbon in their scrolled state).
  // Arrive as a user would: through the chapter ribbon (jump) — then check the label is clear.
  await p.evaluate(() => window.scrollTo({ top: innerHeight * 1.2, behavior: 'instant' }))
  await p.waitForTimeout(300)
  await p.evaluate(() => document.querySelector('.ribbon a[href="#selezione"]').click())
  await p.waitForTimeout(700)
  await p.evaluate(() => (window.__checkLabel = true))
  for (let i = 0; i < 8; i++) {
    if (i > 0) await p.evaluate(() => document.querySelector('#selezione [aria-label="Prodotto successivo"]').click()) // no auto-scroll
    await p.waitForTimeout(1900) // > longest transition (1.15 s + 0.18 s delay)
    const r = await p.evaluate(() => {
      const R = (el) => (el ? el.getBoundingClientRect() : null)
      const inter = (a, b) => (a && b ? Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)) : 0)
      const sec = document.getElementById('selezione')
      const s = R(sec)
      const txt = sec.querySelector('.showcase__text.is-active')
      const parts = ['.showcase__name', '.showcase__line', '.showcase__codes', '.showcase__cta', '.showcase__cat'].map((q) => [q, R(txt.querySelector(q))])
      // giant word: measure the actual ink box via a Range on its text node
      const word = sec.querySelector('.showcase__word.is-active')
      const rg = document.createRange(); rg.selectNodeContents(word); const wr = rg.getBoundingClientRect()
      // painted content box of the product (object-fit: contain, bottom-aligned)
      const imgEl = sec.querySelector('.showcase__slide.is-active .showcase__product')
      let img = R(imgEl)
      if (imgEl && imgEl.naturalWidth) {
        const sc = Math.min(img.width / imgEl.naturalWidth, img.height / imgEl.naturalHeight)
        const w = imgEl.naturalWidth * sc, h = imgEl.naturalHeight * sc
        const left = img.left + (img.width - w) / 2
        img = { left, right: left + w, top: img.bottom - h, bottom: img.bottom, width: w, height: h }
      }
      const floats = [...sec.querySelectorAll('.showcase__slide.is-active .showcase__float')].filter((f) => getComputedStyle(f).display !== 'none').map(R)
      const head = R(sec.querySelector('.showcase__head'))
      const ribbon = document.querySelector('.ribbon.is-visible ol'); const rb = ribbon ? R(ribbon) : null
      const hdr = R(document.querySelector('.site-header'))
      const issues = []
      for (const [q, t] of parts) {
        if (!t || !t.width) continue
        const a = inter(t, wr); if (a > 40) issues.push(`${q}∩word ${Math.round(a)}px²`)
        const ai = inter(t, img); if (ai > 40) issues.push(`${q}∩image ${Math.round(ai)}px²`)
        floats.forEach((f, k) => { const af = inter(t, f); if (af > 20) issues.push(`${q}∩floater${k} ${Math.round(af)}px²`) })
        if (t.right > innerWidth + 1 || t.left < -1) issues.push(`${q} clipped horizontally`)
      }
      floats.forEach((f, k) => { const af = inter(img, f); if (af > 400) issues.push(`floater${k}∩image ${Math.round(af)}px²`) })
      if (img && (img.top < s.top - 1 || img.bottom > s.bottom + 1)) issues.push('image clipped by section')
      if (img && img.width < 20) issues.push('image not visible')
      const occl = Math.max(hdr ? hdr.bottom : 0, rb ? rb.bottom : 0)
      if (head && head.top < occl && window.__checkLabel) issues.push(`section label under sticky chrome by ${Math.round(occl - head.top)}px`)
      const gap = img && parts[0][1] ? Math.round(parts[0][1].top - img.bottom) : null
      const vis = R(sec.querySelector('.showcase__visual') ?? sec)
      if (wr.bottom > vis.bottom + 2) issues.push(`word overflows visual by ${Math.round(wr.bottom - vis.bottom)}px`)
      if (wr.right > innerWidth || wr.left < 0) issues.push('word clipped horizontally')
      return { issues, gapImgToName: gap, sectionH: Math.round(s.height), overflow: document.documentElement.scrollWidth - innerWidth }
    })
    await p.evaluate(() => (window.__checkLabel = false))
    const word = await p.evaluate(() => document.querySelector('#selezione .showcase__word.is-active').textContent)
    if (r.overflow > 0) r.issues.push(`page overflow ${r.overflow}px`)
    report.push({ vp: `${w}x${h}`, slide: i + 1, word, ...r })
    if (shots) {
      // screenshot the section itself (full height), as the user sees it
      await p.locator('#selezione').screenshot({ path: resolve(out, `${label}-${w}-${i + 1}-${word.toLowerCase()}.png`) })
    }
  }
  await ctx.close()
}
await b.close()
writeFileSync(resolve(out, `report-${label}.json`), JSON.stringify(report, null, 2))
const bad = report.filter((r) => r.issues.length)
for (const r of bad) console.log(r.vp.padEnd(10), String(r.slide), r.word.padEnd(9), r.issues.join(' | '))
const gaps = {}; for (const r of report) (gaps[r.vp] ??= []).push(r.gapImgToName)
console.log('\nimage→name gap (px) per viewport:'); for (const [k, v] of Object.entries(gaps)) console.log(k.padEnd(10), v.join(', '), '| section h', report.find((r) => r.vp === k).sectionH)
console.log(`\n${bad.length} of ${report.length} slide/viewport combinations with issues`)
