/**
 * Server entry used only at build time (scripts/prerender.mjs) to generate static HTML
 * for every route. Waits for lazy route chunks (onAllReady) so the HTML is complete.
 */
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Writable } from 'node:stream'
import App, { ROUTER_FUTURE } from './App'
import { headTags, takeSsrMeta } from './lib/seo'
import { products } from './data/products'
import { categories } from './data/categories'

export const routes = [
  '/', '/azienda', '/prodotti', '/territori', '/qualita', '/catalogo', '/contatti', '/privacy',
  ...categories.map((c) => `/prodotti/${c.slug}`),
  ...products.map((p) => `/prodotto/${p.slug}`),
]

/** Source module of the page component for a route (used to link its CSS chunk). */
export function pageModule(url: string) {
  if (url === '/') return 'src/pages/Home.tsx'
  if (url === '/prodotti') return 'src/pages/Products.tsx'
  if (url.startsWith('/prodotti/')) return 'src/pages/CategoryPage.tsx'
  if (url.startsWith('/prodotto/')) return 'src/pages/ProductPage.tsx'
  const map: Record<string, string> = {
    '/azienda': 'Azienda', '/territori': 'Territori', '/qualita': 'Qualita', '/catalogo': 'Catalogo',
    '/contatti': 'Contatti', '/privacy': 'Privacy',
  }
  return `src/pages/${map[url] ?? 'NotFound'}.tsx`
}

export function render(url: string): Promise<{ html: string; head: string }> {
  return new Promise((resolve, reject) => {
    let html = ''
    const sink = new Writable({
      write(chunk, _enc, cb) {
        html += chunk.toString()
        cb()
      },
    })
    sink.on('finish', () => {
      const meta = takeSsrMeta()
      resolve({ html, head: meta ? headTags(meta) : '' })
    })
    const stream = renderToPipeableStream(
      <StaticRouter location={url} future={ROUTER_FUTURE}>
        <App />
      </StaticRouter>,
      {
        onAllReady() {
          stream.pipe(sink)
        },
        onShellError: reject,
        onError(err) {
          reject(err)
        },
      },
    )
  })
}
