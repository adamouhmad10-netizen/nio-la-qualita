/** Dumps catalogue data as JSON for documentation generation. */
import { createServer } from 'vite'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
const root = resolve(import.meta.dirname, '..')
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { products } = await server.ssrLoadModule('/src/data/products.ts')
const { categories } = await server.ssrLoadModule('/src/data/categories.ts')
const { productDisplayName } = await server.ssrLoadModule('/src/lib/text.ts')
await server.close()
writeFileSync(resolve(root, 'docs/assets/catalog.json'), JSON.stringify({
  categories: categories.map((c) => ({ slug: c.slug, name: c.name.it, heading: c.sourceHeading, pages: c.sourcePages })),
  products: products.map((p) => ({ ...p, displayName: productDisplayName(p.sourceName, p.displayName) })),
}, null, 1))
