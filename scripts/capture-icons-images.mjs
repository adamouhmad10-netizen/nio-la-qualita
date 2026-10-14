/**
 * Before/after captures for the icon replacement and the two product-image fixes.
 *   node scripts/capture-icons-images.mjs <before|after> [baseUrl]
 * Writes docs/screenshots/icons-and-images/<phase>-*.png
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const phase = process.argv[2] ?? 'after'
const base = (process.argv[3] ?? 'http://localhost:4173').replace(/\/$/, '')
const out = resolve(import.meta.dirname, '../docs/screenshots/icons-and-images')
mkdirSync(out, { recursive: true })
const shot = (name) => resolve(out, `${phase}-${name}.png`)

const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
// full-motion styles but no animations mid-capture: reducedMotion keeps captures deterministic
const p = await ctx.newPage()
const goto = async (path) => {
  await p.goto(base + path, { waitUntil: 'networkidle' })
  // Hide fixed chrome (header, chapter ribbon, skip link) so it never overlaps element captures.
  await p.addStyleTag({ content: '* { content-visibility: visible !important } .site-header, .ribbon, .skip-link { display: none !important }' })
  await p.waitForTimeout(400)
}
const el = async (sel, name) => {
  const loc = p.locator(sel).first()
  await loc.scrollIntoViewIfNeeded()
  await p.waitForTimeout(500)
  await loc.screenshot({ path: shot(name) })
}

await goto('/')
await el('#selezione', 'showcase-pasta')
await p.click('#selezione .showcase__tab >> text=Formaggi'); await p.waitForTimeout(600)
await el('#selezione', 'showcase-formaggi-vinaccia')
await p.click('#selezione .showcase__tab >> text=Miele'); await p.waitForTimeout(600)
await el('#selezione', 'showcase-miele')
for (const id of ['riso', 'miele', 'tonno', 'tartufi']) await el(`#${id} .chapter__visual`, `chapter-mark-${id}`)
await el('#miele .chapter__index', 'miele-index')
await el('.pillars', 'pillars')
await goto('/prodotti')
await el('.browser__bar', 'catalog-search-sort')
await goto('/prodotti/formaggi')
await el('.product-grid > li:nth-child(2)', 'card-vinaccia-on-white')
await goto('/prodotto/caciocavallo-affinato-in-vinaccia')
await el('.gallery__main', 'product-vinaccia')
await goto('/prodotti/miele')
await el('.product-grid > li:first-child', 'card-miele-on-white')
await goto('/prodotto/miele-di-ailanto-italia')
await el('.gallery__main', 'product-miele')
await goto('/contatti')
await el('.contact-info', 'contact-icons')
await b.close()
console.log('captured', phase)
