/**
 * Build-time pre-rendering: writes dist/<route>/index.html for every route (224 pages),
 * plus dist/404.html. Each page gets its own <head> metadata, links to its route CSS and
 * JS chunks, and a data-ssr marker used by main.tsx to decide whether to hydrate.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const template = readFileSync(resolve(dist, 'index.html'), 'utf8')
const manifest = JSON.parse(readFileSync(resolve(dist, '.vite/manifest.json'), 'utf8'))
const { render, routes, pageModule } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href)

/** CSS + JS needed by a page module (static imports only, recursively). */
function assetsFor(key, seen = new Set()) {
  const out = { css: new Set(), js: new Set() }
  const visit = (k) => {
    if (seen.has(k) || !manifest[k]) return
    seen.add(k)
    const m = manifest[k]
    if (!m.isEntry) out.js.add(m.file)
    m.css?.forEach((c) => out.css.add(c))
    m.imports?.forEach(visit)
  }
  visit(key)
  return out
}
// Fonts used above the fold on every page: preload so they arrive with the CSS.
const fontPreloads = readdirSync(resolve(dist, 'assets'))
  .filter((f) => /^(cormorant-garamond-latin-500-normal|manrope-latin-wght-normal)-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin />`)
const entryCss = new Set(Object.values(manifest).filter((m) => m.isEntry).flatMap((m) => m.css ?? []))

// Other routes' JS/CSS, fetched into the HTTP cache at idle priority (not executed), so
// the first navigation to any page does not wait for the network.
const routeModules = ['Products', 'CategoryPage', 'ProductPage', 'Catalogo', 'Contatti', 'Azienda', 'Territori', 'Qualita'].map(
  (n) => `src/pages/${n}.tsx`,
)
function prefetchFor(url, own) {
  const files = new Set()
  for (const m of routeModules) {
    if (m === pageModule(url)) continue
    const a = assetsFor(m)
    a.js.forEach((f) => files.add(f))
    a.css.forEach((f) => files.add(f))
    if (manifest[m]) files.add(manifest[m].file)
  }
  return [...files]
    .filter((f) => !own.has(f) && !entryCss.has(f))
    .map((f) => `<link rel="prefetch" href="/${f}"${f.endsWith('.css') ? ' as="style"' : ' as="script"'} />`)
}

async function page(url, file, marker = url) {
  const { html, head } = await render(url)
  const assets = assetsFor(pageModule(url))
  const own = new Set([...assets.css, ...assets.js, manifest[pageModule(url)]?.file].filter(Boolean))
  const links = [
    ...fontPreloads,
    ...[...assets.css].filter((c) => !entryCss.has(c)).map((c) => `<link rel="stylesheet" href="/${c}" />`),
    ...[...assets.js].map((j) => `<link rel="modulepreload" href="/${j}" />`),
    ...prefetchFor(url, own),
  ].join('\n    ')
  let out = template
    .replace(/<!--ssr-title-->[\s\S]*?<!--\/ssr-title-->/, head)
    .replace('<!--ssr-head-->', '')
    // Route CSS after the entry stylesheet, matching the cascade order of client navigation.
    .replace('</head>', `  ${links}\n  </head>`)
    .replace('<div id="root"><!--ssr-outlet--></div>', `<div id="root" data-ssr="${marker}">${html}</div>`)
  // Only the home page should preload the home hero image.
  if (url !== '/') out = out.replace(/\s*<link rel="preload" as="image"[^>]*hero-table[^>]*>/, '')
  const target = resolve(dist, file)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, out)
}

let n = 0
for (const url of routes) {
  await page(url, url === '/' ? 'index.html' : `${url.slice(1)}/index.html`)
  n++
}
await page('/404', '404.html', '/404')
rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`prerendered ${n} routes + 404.html`)
