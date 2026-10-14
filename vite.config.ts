import { defineConfig, createServer, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Generates dist/sitemap.xml from the same data modules the app uses, so the sitemap
 * can never drift from the catalogue. SITE_URL is the production origin (set at deploy).
 */
function sitemap(): Plugin {
  return {
    name: 'nlq-sitemap',
    apply: 'build',
    async closeBundle() {
      if (this.environment?.config?.build?.ssr || process.env.NLQ_SSR_BUILD) return
      const site = (process.env.SITE_URL ?? 'https://www.noilaqualita.it').replace(/\/$/, '')
      const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
      try {
        const { products } = await server.ssrLoadModule('/src/data/products.ts')
        const { categories } = await server.ssrLoadModule('/src/data/categories.ts')
        const paths = [
          '/', '/azienda', '/prodotti', '/territori', '/qualita', '/catalogo', '/contatti', '/privacy',
          ...categories.map((c: { slug: string }) => `/prodotti/${c.slug}`),
          ...products.map((p: { slug: string }) => `/prodotto/${p.slug}`),
        ]
        const xml =
          '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          paths.map((p) => `  <url><loc>${site}${p}</loc></url>`).join('\n') +
          '\n</urlset>\n'
        writeFileSync(resolve(__dirname, 'dist/sitemap.xml'), xml)
        writeFileSync(resolve(__dirname, 'dist/robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`)
      } finally {
        await server.close()
      }
    },
  }
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), sitemap()],
  build: {
    target: 'es2020',
    manifest: true,
    cssCodeSplit: true,
    // Vendor chunking applies to the browser build only (SSR externalises node_modules).
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              react: ['react', 'react-dom', 'react-router-dom'],
            },
          },
        },
  },
}))
