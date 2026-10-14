/**
 * Catalogue integrity check — run with `npm run check:data`.
 * Loads the real TS data modules through Vite and verifies references and assets.
 */
import { createServer } from 'vite'
import { existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const load = (p) => server.ssrLoadModule(p)
const { products, totalCodes } = await load('/src/data/products.ts')
const { categories } = await load('/src/data/categories.ts')
const { sourceMentions, territories } = await load('/src/data/regions.ts')
const { slides } = await load('/src/content/showcase.ts')
await server.close()

const errors = []
const warn = []
const ids = new Set(), slugs = new Set(), codes = new Map()
const asset = (p) => existsSync(resolve(root, 'public', p.replace(/^\//, '')))

for (const p of products) {
  if (ids.has(p.id)) errors.push(`duplicate id ${p.id}`)
  if (slugs.has(p.slug)) errors.push(`duplicate slug ${p.slug}`)
  ids.add(p.id); slugs.add(p.slug)
  if (!categories.find((c) => c.slug === p.category)) errors.push(`${p.id}: unknown category ${p.category}`)
  for (const v of p.variants) {
    if (!/^(NQ[A-Z]*\d{3,4}[A-Z]{0,2}|GLQ\d{3})$/.test(v.code)) errors.push(`${p.id}: odd code ${v.code}`)
    codes.set(v.code, [...(codes.get(v.code) ?? []), p.sourceName])
  }
  for (const im of p.images) {
    const files = im.key.startsWith('editorial/')
      ? [`/images/editorial/${im.key.slice(10)}-640.webp`, `/images/editorial/${im.key.slice(10)}-1280.webp`]
      : [`/images/products/${im.key}-480.webp`, `/images/products/${im.key}-960.webp`]
    for (const f of files) if (!asset(f)) errors.push(`${p.id}: missing image ${f}`)
  }
  if (!p.images.length) warn.push(`${p.id}: no catalogue image (${p.sourceName})`)
}
for (const [code, names] of codes) if (names.length > 1) warn.push(`code ${code} used by: ${names.join(' | ')}`)
for (const c of categories) {
  for (const k of [c.art.heroImage, ...c.art.gallery.map((g) => g.key)])
    for (const w of [640, 1280, 2000]) if (!asset(`/images/editorial/${k}-${w}.webp`)) errors.push(`category ${c.slug}: missing ${k}-${w}`)
}
for (const m of sourceMentions) for (const id of m.productIds) if (!ids.has(id)) errors.push(`mention ${m.id}: unknown product ${id}`)
for (const t of territories) if (!asset(`/images/editorial/${t.image}-1280.webp`)) errors.push(`territory ${t.id}: missing image`)
for (const s of slides) {
  if (!ids.has(s.productId)) errors.push(`slide ${s.word}: unknown product ${s.productId}`)
  if (!asset(`/images/products/${s.cutout}-960.webp`)) errors.push(`slide ${s.word}: missing cutout`)
}

const byCat = Object.fromEntries(categories.map((c) => [c.slug, { families: 0, codes: 0 }]))
for (const p of products) { byCat[p.category].families++; byCat[p.category].codes += p.variants.length }
const byStatus = products.reduce((a, p) => ((a[p.verification] = (a[p.verification] ?? 0) + 1), a), {})

const summary = { families: products.length, codes: totalCodes, uniqueCodes: codes.size, byCategory: byCat, byStatus, withoutImage: products.filter((p) => !p.images.length).length }
console.log(JSON.stringify(summary, null, 2))
warn.forEach((w) => console.log('WARN', w))
errors.forEach((e) => console.log('ERROR', e))
writeFileSync(resolve(root, 'docs/assets/catalog-summary.json'), JSON.stringify({ summary, warnings: warn, errors }, null, 2))
process.exit(errors.length ? 1 : 0)
