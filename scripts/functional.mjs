/**
 * Functional interaction tests (Playwright). `node scripts/functional.mjs [baseUrl]`
 * Prints PASS/FAIL per check and exits non-zero on failure.
 */
import { chromium } from 'playwright'

const base = (process.argv[2] ?? 'http://localhost:5173').replace(/\/$/, '')
const results = []
const check = async (name, fn) => {
  try {
    await fn()
    results.push(['PASS', name])
  } catch (e) {
    results.push(['FAIL', name, String(e.message ?? e).split('\n')[0]])
  }
}
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg)
}

const browser = await chromium.launch()
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
const reduced = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })
const page = await desktop.newPage()
const count = async (p = page) => Number((await p.locator('.browser__status strong').innerText()).split(' ')[0])
/** Waits until the result counter shows `n` (renders are transitions: URL updates first). */
const waitCount = (n, p = page) =>
  p.waitForFunction((n) => document.querySelector('.browser__status strong')?.textContent.startsWith(`${n} `), n, { timeout: 5000 })

await check('Deep link with query (?categoria=miele) applies after hydration', async () => {
  await page.goto(`${base}/prodotti?categoria=miele`)
  await page.waitForFunction(() => document.querySelector('.browser__status strong')?.textContent.startsWith('6 '), null, { timeout: 5000 })
})

await check('Catalogue: initial count 206 families', async () => {
  await page.goto(`${base}/prodotti`)
  assert((await count()) === 206, `got ${await count()}`)
})

await check('Search by code NQE217 → 1 result, URL ?q=', async () => {
  await page.fill('input[type=search]', 'NQE217')
  await page.waitForURL(/q=NQE217/)
  await waitCount(1)
  assert((await page.locator('.pcard__title').first().innerText()).includes('Spaghettoni'), 'wrong product')
})

await check('Search accent/case-insensitive "qualita" finds Golosa prosciutto', async () => {
  await page.fill('input[type=search]', 'golosa qualita')
  await page.waitForURL(/q=golosa/)
  await waitCount(1)
})

await check('Empty state + reset', async () => {
  await page.fill('input[type=search]', 'zzzzzz')
  await page.waitForSelector('.empty-state', { timeout: 5000 })
  await page.click('.empty-state button')
  await waitCount(206)
})

await check('Category chip filter → Formaggi 43, subfilter Caciocavallo 9', async () => {
  await page.click('.chips >> text=Formaggi')
  await page.waitForURL(/categoria=formaggi/)
  await waitCount(43)
  await page.click('.chips--sub >> text=Caciocavallo')
  await page.waitForURL(/tipo=Caciocavallo/)
  await waitCount(9)
})

await check('Browser back restores previous filter', async () => {
  await page.goBack()
  await waitCount(43)
  await page.goBack()
  await waitCount(206)
})

await check('Sort Z–A puts a Z-name first', async () => {
  await page.selectOption('select', 'za')
  await page.waitForURL(/ordine=za/)
  await page.waitForFunction(() => /^Z/i.test(document.querySelector('.pcard__title')?.textContent ?? ''), null, { timeout: 5000 })
  const first = await page.locator('.pcard__title').first().innerText()
  assert(/^Z/i.test(first), `first is ${first}`)
})

await check('Progressive rendering: 36 then "show more" adds more', async () => {
  await page.goto(`${base}/prodotti`)
  await page.waitForSelector('.product-grid > li')
  assert((await page.locator('.product-grid > li').count()) === 36, 'initial page size')
  await page.click('.browser__more button')
  assert((await page.locator('.product-grid > li').count()) === 72, 'after show more')
})

await check('Product card navigates to detail page', async () => {
  await page.goto(`${base}/prodotti/riso`)
  await page.click('.pcard__link >> nth=0')
  await page.waitForURL(/\/prodotto\//)
  assert((await page.locator('h1').innerText()).length > 2, 'no title')
})

await check('Product: lightbox opens and closes with Escape', async () => {
  await page.goto(`${base}/prodotto/caciocavallo-affinato-in-vinaccia`)
  await page.click('.gallery__zoom')
  assert(await page.locator('dialog.lightbox[open]').isVisible(), 'not open')
  await page.keyboard.press('Escape')
  assert(!(await page.locator('dialog.lightbox[open]').count()), 'still open')
})

await check('Product: variants table lists every code (Parma = 4)', async () => {
  await page.goto(`${base}/prodotto/prosciutto-parma`)
  await page.waitForSelector('.product__variants tbody tr')
  assert((await page.locator('.product__variants tbody tr').count()) === 4, 'rows')
})

await check('Product: inquiry CTA pre-fills contact form', async () => {
  await page.click('text=Richiedi informazioni')
  await page.waitForURL(/contatti\?prodotto=prosciutto-parma/)
  const msg = await page.locator('textarea').inputValue()
  assert(msg.includes('NQS407') && msg.includes('NQS410'), 'codes not prefilled')
})

await check('Contact: validation blocks empty submit and focuses first error', async () => {
  await page.goto(`${base}/contatti`)
  await page.click('button[type=submit]')
  assert((await page.locator('.field__error').count()) >= 3, 'errors not shown')
  const focused = await page.evaluate(() => document.activeElement?.getAttribute('autocomplete'))
  assert(focused === 'name', `focus on ${focused}`)
})

await check('Contact: valid submit builds mailto and shows honest status', async () => {
  await page.fill('input[autocomplete=name]', 'Mario Rossi')
  await page.fill('input[type=email]', 'mario@example.com')
  await page.fill('textarea', 'Vorrei informazioni sul catalogo, grazie.')
  await page.check('input[type=checkbox]')
  await page.evaluate(() => {
    // Intercept navigation to mailto: in the test browser.
    window.__mailto = null
    const desc = Object.getOwnPropertyDescriptor(Location.prototype, 'href')
    void desc
  })
  await page.click('button[type=submit]').catch(() => {})
  await page.waitForSelector('.form-result', { timeout: 4000 })
  const href = await page.locator('.form-result a').first().getAttribute('href')
  assert(href.startsWith('mailto:info@noilaqualita.it?subject='), href)
})

await check('Catalogue viewer: next/prev, keyboard and deep link', async () => {
  await page.goto(`${base}/catalogo`)
  await page.click('.viewer__nav--next')
  await page.waitForURL(/pagina=2/)
  assert((await page.locator('.viewer__status').innerText()).includes('2–3'), 'spread')
  await page.keyboard.press('ArrowRight')
  await page.waitForURL(/pagina=4/)
  await page.goto(`${base}/catalogo?pagina=13`)
  await page.waitForFunction(() => document.querySelector('.viewer__status')?.textContent.includes('12–13'), null, { timeout: 5000 })
})

await check('Showcase: next button + keyboard arrows change slide', async () => {
  await page.goto(`${base}/`)
  const s = page.locator('#selezione')
  await s.scrollIntoViewIfNeeded()
  await page.click('#selezione [aria-label="Prodotto successivo"]')
  await page.waitForTimeout(300)
  assert((await page.locator('.showcase__count span').innerText()) === '02', 'button')
  // A second press mid-transition must not be dropped.
  await page.focus('#selezione [aria-label="Prodotto successivo"]')
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(1800)
  assert((await page.locator('.showcase__count span').innerText()) === '03', 'keyboard')
  assert((await page.locator('.showcase__tab[aria-selected=true]').innerText()) === 'Salumi', 'tab state')
})

await check('Showcase: tab jump to a distant slide loads and shows its product image', async () => {
  await page.goto(`${base}/`)
  await page.evaluate(() => window.scrollTo({ top: document.getElementById('selezione').offsetTop, behavior: 'instant' }))
  await page.waitForTimeout(500)
  const before = await page.evaluate(() => document.querySelectorAll('.showcase__product').length)
  assert(before <= 3, `${before} slide images mounted at load (expected ≤ 3)`)
  await page.click('.showcase__tab >> text=Mare')
  await page.waitForFunction(() => {
    const img = document.querySelector('.showcase__slide.is-active .showcase__product')
    return img && img.complete && img.naturalWidth > 0 && getComputedStyle(img).opacity === '1'
  }, null, { timeout: 5000 })
})

await check('Pasta journey: pinned on desktop, next button advances', async () => {
  await page.goto(`${base}/`)
  await page.waitForTimeout(800)
  await page.evaluate(() => document.getElementById('pasta').scrollIntoView({ behavior: 'instant' }))
  await page.waitForTimeout(600)
  assert(await page.locator('.pasta.is-pinned').count(), 'not pinned')
  await page.click('[aria-label="Formato successivo"]')
  await page.waitForTimeout(1500)
  const idx = await page.locator('.pasta__index').innerText()
  assert(!idx.startsWith('01'), `index ${idx}`)
})

await check('Ribbon chapter links jump to sections', async () => {
  await page.goto(`${base}/`)
  await page.waitForTimeout(800)
  await page.evaluate(() => window.scrollTo({ top: innerHeight * 1.5, behavior: 'instant' }))
  await page.waitForSelector('.ribbon.is-visible', { state: 'attached' })
  await page.click('.ribbon a[href="#tartufi"]')
  await page.waitForTimeout(1500)
  const top = await page.evaluate(() => document.getElementById('tartufi').getBoundingClientRect().top)
  assert(Math.abs(top) < 200, `top ${top}`)
})

await check('All scroll-reveal content becomes visible', async () => {
  await page.goto(`${base}/`)
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 60))
    }
  })
  await page.waitForTimeout(1500)
  const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length)
  assert(hidden === 0, `${hidden} elements still hidden`)
})

await check('Unknown product slug → 404 content', async () => {
  await page.goto(`${base}/prodotto/non-esiste`)
  await page.waitForSelector('main h1')
  assert(await page.locator('.not-found').count(), 'no 404')
})

await check('Alcohol category shows adult notice', async () => {
  await page.goto(`${base}/prodotti/alcolici`)
  await page.waitForSelector('main h1')
  assert(await page.locator('.adult-notice').count(), 'missing')
})

// ---- mobile
const m = await mobile.newPage()
await check('Mobile: menu opens, traps focus, Escape closes and restores focus', async () => {
  await m.goto(`${base}/`)
  await m.click('.menu-toggle')
  await m.waitForSelector('.mobile-menu.is-open')
  assert((await m.evaluate(() => document.documentElement.style.overflow)) === 'hidden', 'scroll not locked')
  for (let i = 0; i < 30; i++) await m.keyboard.press('Tab')
  const inside = await m.evaluate(() => !!document.activeElement?.closest('.mobile-menu, .menu-toggle'))
  assert(inside, 'focus escaped')
  await m.keyboard.press('Escape')
  await m.waitForSelector('.mobile-menu:not(.is-open)')
  assert(await m.evaluate(() => document.activeElement?.classList.contains('menu-toggle')), 'focus not restored')
})

await check('Mobile: menu link navigates and closes menu', async () => {
  await m.click('.menu-toggle')
  await m.click('.mobile-menu__list >> text=Prodotti')
  await m.waitForURL(/\/prodotti$/)
  await m.waitForSelector('.mobile-menu:not(.is-open)', { state: 'attached', timeout: 5000 })
})

await check('Mobile: catalogue swipe changes page', async () => {
  await m.goto(`${base}/catalogo`)
  const box = await m.locator('.viewer__stage').boundingBox()
  await m.dispatchEvent('.viewer__stage', 'pointerdown', { pointerType: 'touch', clientX: box.x + box.width * 0.8, clientY: box.y + 100 })
  await m.dispatchEvent('.viewer__stage', 'pointerup', { pointerType: 'touch', clientX: box.x + box.width * 0.2, clientY: box.y + 100 })
  await m.waitForURL(/pagina=2/)
})

// ---- reduced motion
const r = await reduced.newPage()
await check('Reduced motion: no pin, content visible without animation', async () => {
  await r.goto(`${base}/`)
  assert(!(await r.locator('.pasta.is-pinned').count()), 'pinned under reduced motion')
  assert(!(await r.evaluate(() => document.documentElement.classList.contains('motion-ok'))), 'motion-ok set')
  const op = await r.evaluate(() => getComputedStyle(document.querySelector('#final-title')).opacity)
  assert(op === '1', `opacity ${op}`)
})

await browser.close()
for (const r of results) console.log(r.join('  '))
const failed = results.filter((r) => r[0] === 'FAIL').length
console.log(`\n${results.length - failed}/${results.length} passed`)
process.exit(failed ? 1 : 0)
