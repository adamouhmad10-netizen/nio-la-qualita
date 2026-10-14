/**
 * Minimal static server for the production build that behaves like typical hosting:
 * /path → dist/path(.html | /index.html) → otherwise dist/404.html with HTTP 404.
 *   node scripts/serve.mjs [port]
 */
import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { createBrotliCompress, createGzip, constants } from 'node:zlib'

// DIST env var lets two builds be served side by side for A/B measurements.
const dist = resolve(process.env.DIST ?? resolve(import.meta.dirname, '../dist'))
const port = Number(process.argv[2] ?? 4173)
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.pdf': 'application/pdf',
  '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json',
}

function find(urlPath) {
  const p = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '')
  for (const c of [p, `${p}.html`, join(p, 'index.html')]) {
    const f = join(dist, c)
    if (f.startsWith(dist) && existsSync(f) && statSync(f).isFile()) return f
  }
  return null
}

createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  const file = find(url.pathname)
  const target = file ?? join(dist, '404.html')
  const type = TYPES[extname(target)] ?? 'application/octet-stream'
  const immutable = target.includes(`${dist}/assets/`)
  // Compress text assets like any production host/CDN would (images/fonts are already compressed).
  const compressible = /^(text\/|application\/(json|xml)|image\/svg)/.test(type)
  const accept = String(req.headers['accept-encoding'] ?? '')
  const enc = compressible ? (accept.includes('br') ? 'br' : accept.includes('gzip') ? 'gzip' : null) : null
  res.writeHead(file ? 200 : 404, {
    'Content-Type': type,
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate',
    ...(enc ? { 'Content-Encoding': enc, Vary: 'Accept-Encoding' } : {}),
  })
  const stream = createReadStream(target)
  if (enc === 'br') stream.pipe(createBrotliCompress({ params: { [constants.BROTLI_PARAM_QUALITY]: 5 } })).pipe(res)
  else if (enc === 'gzip') stream.pipe(createGzip()).pipe(res)
  else stream.pipe(res)
}).listen(port, () => console.log(`serving dist on http://localhost:${port}`))
