/**
 * Visual + functional QA with Playwright.
 *   node scripts/qa.mjs [baseUrl] [--quick] [--only=/path]
 * Writes screenshots to docs/screenshots/ and a JSON report to docs/assets/qa-report.json.
 * Checks: console errors, failed requests, horizontal overflow, broken images, 404 links.
 */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const args = process.argv.slice(2)
const base = (args.find((a) => a.startsWith('http')) ?? 'http://localhost:5173').replace(/\/$/, '')
const quick = args.includes('--quick')
const reduced = args.includes('--reduced')
const only = args.find((a) => a.startsWith('--only='))?.slice(7)
const root = resolve(import.meta.dirname, '..')
const shots = resolve(root, 'docs/screenshots')
mkdirSync(shots, { recursive: true })

const ROUTES = [
  ['home', '/'],
  ['prodotti', '/prodotti'],
  ['categoria-formaggi', '/prodotti/formaggi'],
  ['categoria-alcolici', '/prodotti/alcolici'],
  ['prodotto-caciocavallo', '/prodotto/caciocavallo-affinato-in-vinaccia'],
  ['prodotto-parma', '/prodotto/prosciutto-parma'],
  ['catalogo', '/catalogo'],
  ['contatti', '/contatti'],
  ['azienda', '/azienda'],
  ['territori', '/territori'],
  ['qualita', '/qualita'],
  ['404', '/pagina-inesistente'],
]
const VIEWPORTS = quick
  ? [['desktop', 1440, 900], ['mobile', 390, 844]]
  : [['w320', 320, 640], ['w360', 360, 740], ['w375', 375, 812], ['mobile', 390, 844], ['w430', 430, 932], ['tablet', 768, 1024], ['w1024', 1024, 768], ['w1280', 1280, 800], ['desktop', 1440, 900], ['w1920', 1920, 1080]]

const report = { base, pages: [] }
const browser = await chromium.launch()

async function settle(page) {
  // Scroll through the page so lazy images and scroll-triggered reveals run.
  await page.evaluate(async () => {
    const step = Math.max(300, innerHeight * 0.7)
    // behavior:'instant' — the site sets scroll-behavior:smooth, which would make each step animate.
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 120))
    }
    await new Promise((r) => setTimeout(r, 1400))
    window.scrollTo({ top: 0, behavior: 'instant' })
  })
  await page.waitForTimeout(700)
}

for (const [vpName, width, height] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: reduced ? 'reduce' : 'no-preference' })
  for (const [name, path] of ROUTES) {
    if (only && path !== only) continue
    if (quick === false && !['home', 'prodotti', 'prodotto-caciocavallo'].includes(name) && !['mobile', 'desktop', 'w320', 'w375', 'tablet', 'w1024', 'w1920'].includes(vpName)) continue
    const page = await ctx.newPage()
    const consoleErrors = []
    const failed = []
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
    page.on('pageerror', (e) => consoleErrors.push(String(e)))
    page.on('requestfailed', (r) => failed.push(r.url()))
    page.on('response', (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`))
    await page.goto(base + path, { waitUntil: 'networkidle' })
    await settle(page)
    const metrics = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth
      const wide = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const r = el.getBoundingClientRect()
          const cs = getComputedStyle(el)
          if (cs.position === 'fixed' || r.width === 0) return false
          let p = el.parentElement
          while (p) {
            const s = getComputedStyle(p)
            if (/(auto|scroll|hidden|clip)/.test(s.overflowX)) return false
            p = p.parentElement
          }
          return r.right > innerWidth + 1
        })
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`)
      // Content that should have been revealed after scrolling but is still invisible.
      const hidden = [...document.querySelectorAll('[data-reveal]')]
        .filter((el) => el.getClientRects().length > 0 && parseFloat(getComputedStyle(el).opacity) < 0.5) // ignore display:none
        .map((el) => (el.className || el.tagName).toString().slice(0, 40))
      const brokenImgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.src).map((i) => i.src)
      const links = [...new Set([...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')))]
      return { overflow, wide, hidden, brokenImgs, links, title: document.title, h1: document.querySelectorAll('h1').length }
    })
    // Full-page captures paint the whole document at once; sections using
    // content-visibility:auto would be skipped (they render normally while scrolling).
    await page.addStyleTag({ content: '* { content-visibility: visible !important; }' })
    await page.waitForTimeout(400)
    const file = `${name}--${vpName}${reduced ? '--reduced' : ''}.png`
    // Chromium cannot rasterise more than ~16k px in one capture: split tall pages into parts.
    const fullH = await page.evaluate(() => document.documentElement.scrollHeight)
    const PART = 8000
    if (fullH <= 15000) await page.screenshot({ path: resolve(shots, file), fullPage: true })
    else
      for (let y = 0, i = 1; y < fullH; y += PART, i++)
        await page.screenshot({
          path: resolve(shots, file.replace('.png', `.part${i}.png`)),
          fullPage: true,
          clip: { x: 0, y, width, height: Math.min(PART, fullH - y) },
        })
    report.pages.push({ name, path, viewport: vpName, ...metrics, links: metrics.links.length, consoleErrors, failed, file })
    if (vpName === 'desktop') report[`links:${path}`] = metrics.links
    await page.close()
  }
  await ctx.close()
}

// Internal link check: every distinct internal link found on desktop must not render the 404 page.
const allLinks = new Set(Object.entries(report).filter(([k]) => k.startsWith('links:')).flatMap(([, v]) => v))
const ctx = await browser.newContext()
const page = await ctx.newPage()
report.brokenLinks = []
for (const href of allLinks) {
  if (href.endsWith('.pdf')) continue
  await page.goto(base + href, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('main h1', { timeout: 8000 }).catch(() => {})
  const is404 = await page.evaluate(() => !!document.querySelector('.not-found'))
  if (is404 && !href.includes('inesistente')) report.brokenLinks.push(href)
}
await browser.close()

for (const k of Object.keys(report)) if (k.startsWith('links:')) delete report[k]
writeFileSync(resolve(root, 'docs/assets/qa-report.json'), JSON.stringify(report, null, 2))
const issues = report.pages.filter((p) => p.overflow > 0 || p.wide.length || p.hidden.length || p.brokenImgs.length || p.consoleErrors.length || p.failed.length || p.h1 !== 1)
console.log(`pages checked: ${report.pages.length}, internal links checked: ${allLinks.size}, broken links: ${report.brokenLinks.length}`)
for (const p of issues) console.log(JSON.stringify({ page: p.name, vp: p.viewport, overflow: p.overflow, wide: p.wide, hidden: p.hidden.slice(0, 5), broken: p.brokenImgs, errors: p.consoleErrors.slice(0, 3), failed: p.failed.slice(0, 3), h1: p.h1 }))
if (report.brokenLinks.length) console.log('BROKEN LINKS', report.brokenLinks)
