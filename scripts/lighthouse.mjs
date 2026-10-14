/**
 * Lighthouse runner: median of N runs per page, mobile (simulated slow 4G, 4x CPU) and
 * desktop. Requires `npm i --no-save lighthouse` and CHROME_PATH. Writes
 * docs/assets/lighthouse/summary.json.  node scripts/lighthouse.mjs [baseUrl] [runs]
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const base = process.argv[2] ?? 'http://localhost:4173'
const runs = Number(process.argv[3] ?? 3)
const out = resolve(import.meta.dirname, '../docs/assets/lighthouse')
mkdirSync(out, { recursive: true })
const pages = [
  ['home', '/'],
  ['prodotti', '/prodotti'],
  ['categoria', '/prodotti/formaggi'],
  ['prodotto', '/prodotto/caciocavallo-affinato-in-vinaccia'],
  ['catalogo', '/catalogo'],
  ['contatti', '/contatti'],
]
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)]
const summary = {}
const presets = (process.argv[4] ?? 'mobile,desktop').split(',')
for (const preset of presets) {
  for (const [name, path] of pages) {
    const res = []
    for (let i = 0; i < runs; i++) {
      const file = resolve(out, `${name}-${preset}-${i}.json`)
      execFileSync('npx', ['lighthouse', base + path, '--quiet', '--chrome-flags=--headless=new', '--output=json', `--output-path=${file}`,
        ...(preset === 'desktop'
          ? ['--preset=desktop']
          : preset === 'mobile-devtools'
            ? ['--form-factor=mobile', '--throttling-method=devtools'] // real applied throttling (observed, not simulated)
            : ['--form-factor=mobile', '--throttling-method=simulate'])], { stdio: 'ignore' })
      const r = JSON.parse(readFileSync(file, 'utf8'))
      const a = r.audits
      res.push({
        perf: r.categories.performance.score * 100, a11y: r.categories.accessibility.score * 100,
        bp: r.categories['best-practices'].score * 100, seo: r.categories.seo.score * 100,
        fcp: a['first-contentful-paint'].numericValue, lcp: a['largest-contentful-paint'].numericValue,
        tbt: a['total-blocking-time'].numericValue, cls: a['cumulative-layout-shift'].numericValue,
        si: a['speed-index'].numericValue,
      })
    }
    const m = Object.fromEntries(Object.keys(res[0]).map((k) => [k, median(res.map((r) => r[k]))]))
    summary[`${name}/${preset}`] = m
    console.log(preset.padEnd(8), name.padEnd(10), `perf ${m.perf} a11y ${m.a11y} bp ${m.bp} seo ${m.seo} | FCP ${(m.fcp / 1000).toFixed(1)}s LCP ${(m.lcp / 1000).toFixed(1)}s TBT ${Math.round(m.tbt)}ms CLS ${m.cls.toFixed(3)} SI ${(m.si / 1000).toFixed(1)}s`)
  }
}
writeFileSync(resolve(out, `summary-${presets.join('+')}.json`), JSON.stringify({ base, runs, date: new Date().toISOString(), summary }, null, 2))
