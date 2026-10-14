import { useEffect } from 'react'

export const SITE_NAME = 'Noi, la qualità'
export const SITE_URL = ((import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://www.noilaqualita.it').replace(/\/$/, '')

export interface Meta {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article' | 'product'
  /** JSON-LD objects to inject for this page. */
  jsonLd?: object[]
  noindex?: boolean
}

interface Resolved {
  title: string
  description: string
  canonical: string
  image: string
  ogType: string
  robots: string
  jsonLd: object[]
}

function resolve(m: Meta): Resolved {
  return {
    title: m.title === SITE_NAME ? `${SITE_NAME} — Autentici sapori d’Italia` : `${m.title} · ${SITE_NAME}`,
    description: m.description,
    canonical: SITE_URL + m.path,
    image: SITE_URL + (m.image ?? '/images/editorial/hero-table-1280.webp'),
    ogType: m.type === 'article' ? 'article' : 'website',
    robots: m.noindex ? 'noindex, follow' : 'index, follow',
    jsonLd: m.jsonLd ?? [],
  }
}

/* ------------------------------------------------------------ server side */

let ssrMeta: Meta | null = null
/** Pre-render helper: returns the meta registered by the page rendered last. */
export function takeSsrMeta() {
  const m = ssrMeta
  ssrMeta = null
  return m
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Serialises page metadata into <head> tags for pre-rendered HTML. */
export function headTags(m: Meta) {
  const r = resolve(m)
  return [
    `<title>${esc(r.title)}</title>`,
    `<meta name="description" content="${esc(r.description)}" />`,
    `<meta name="robots" content="${r.robots}" />`,
    `<link rel="canonical" href="${esc(r.canonical)}" />`,
    `<meta property="og:title" content="${esc(r.title)}" />`,
    `<meta property="og:description" content="${esc(r.description)}" />`,
    `<meta property="og:type" content="${r.ogType}" />`,
    `<meta property="og:url" content="${esc(r.canonical)}" />`,
    `<meta property="og:image" content="${esc(r.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    ...r.jsonLd.map((o) => `<script type="application/ld+json" data-jsonld>${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`),
  ].join('\n    ')
}

/* ------------------------------------------------------------ client side */

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = value
}

/**
 * Per-route document metadata. During pre-rendering it is captured for the static HTML;
 * in the browser it updates <head> on navigation. In WordPress the same values map onto
 * the SEO plugin fields (title, meta description, canonical, Open Graph, schema).
 */
export function useDocumentMeta(meta: Meta) {
  if (typeof document === 'undefined') ssrMeta = meta
  const { title, description, path, image, type, jsonLd, noindex } = meta
  useEffect(() => {
    const r = resolve({ title, description, path, image, type, jsonLd, noindex })
    document.title = r.title
    setMeta('name', 'description', r.description)
    setMeta('name', 'robots', r.robots)
    setMeta('property', 'og:title', r.title)
    setMeta('property', 'og:description', r.description)
    setMeta('property', 'og:type', r.ogType)
    setMeta('property', 'og:url', r.canonical)
    setMeta('property', 'og:image', r.image)
    setMeta('name', 'twitter:card', 'summary_large_image')

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = r.canonical

    document.head.querySelectorAll('script[data-jsonld]').forEach((n) => n.remove())
    for (const obj of r.jsonLd) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.dataset.jsonld = ''
      s.textContent = JSON.stringify(obj)
      document.head.appendChild(s)
    }
    // jsonLd objects are rebuilt each render; compare by content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image, type, noindex, JSON.stringify(jsonLd ?? [])])
}

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: SITE_URL + it.path,
  })),
})
