import { useCallback, useEffect, useRef, useState } from 'react'
import { useHydratedSearchParams } from '../lib/hydration'
import { ArrowLeft, ArrowRight, Download, ExternalLink, Maximize2, X } from 'lucide-react'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { CATALOG_PAGES, CATALOG_PDF, CATALOG_PDF_SIZE, catalogPageSrc, catalogPageSrcSet } from '../lib/images'
import { useMediaQuery, useReducedMotion } from '../lib/motion'
import { categories } from '../data/categories'
import { tr } from '../i18n'
import { useDocumentMeta } from '../lib/seo'
import '../styles/pages.css'

/** Spreads like the printed book: cover alone, then 2–3, 4–5 … */
const spreadOf = (page: number) => (page <= 1 ? [1] : page % 2 === 0 ? [page, page + 1] : [page - 1, page]).filter((p) => p <= CATALOG_PAGES)

/**
 * Digital viewer for the original catalogue. Pages are pre-rendered from the client PDF
 * (no PDF.js / page-flip library: lighter, more reliable on mobile). The original PDF
 * remains available for download.
 */
export default function Catalogo() {
  useDocumentMeta({
    title: 'Catalogo prodotti 2026',
    description: 'Sfoglia online il Catalogo prodotti 2026 di Noi, la qualità o scarica il PDF originale.',
    path: '/catalogo',
    image: catalogPageSrc(1, 'full'),
  })
  const [params, setParams] = useHydratedSearchParams()
  const wide = useMediaQuery('(min-width: 900px)')
  const reduced = useReducedMotion()
  const requested = Math.min(CATALOG_PAGES, Math.max(1, Number(params.get('pagina')) || 1))
  const [page, setPage] = useState(requested)
  const [turn, setTurn] = useState<'next' | 'prev' | null>(null)
  const [zoom, setZoom] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const thumbs = useRef<HTMLOListElement>(null)

  useEffect(() => setPage(requested), [requested])

  const visible = wide ? spreadOf(page) : [page]
  const first = visible[0]
  const last = visible[visible.length - 1]

  const go = useCallback(
    (target: number, dir: 'next' | 'prev') => {
      const p = Math.min(CATALOG_PAGES, Math.max(1, target))
      if (p === page) return
      setTurn(reduced ? null : dir)
      setPage(p)
      setParams(p === 1 ? {} : { pagina: String(p) }, { replace: true, preventScrollReset: true })
    },
    [page, reduced, setParams],
  )
  const next = () => go(wide ? last + 1 : page + 1, 'next')
  const prev = () => go(wide ? first - 1 : page - 1, 'prev')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (dialog.current?.open) return
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, select')) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Keep the active thumbnail visible.
  useEffect(() => {
    const el = thumbs.current?.querySelector<HTMLElement>(`[data-page="${first}"]`)
    const list = thumbs.current
    if (el && list) list.scrollTo({ left: el.offsetLeft - list.clientWidth / 2 + el.clientWidth, behavior: reduced ? 'auto' : 'smooth' })
  }, [first, reduced])

  // Preload the following spread.
  useEffect(() => {
    for (let p = last + 1; p <= Math.min(CATALOG_PAGES, last + 2); p++) {
      const img = new Image()
      img.sizes = wide ? '40vw' : '92vw'
      img.srcset = catalogPageSrcSet(p)
    }
  }, [last])

  const openZoom = (p: number) => {
    setZoom(p)
    dialog.current?.showModal()
  }

  // Swipe on touch devices.
  const start = useRef<number | null>(null)

  return (
    <div className="page viewer-page">
      <header className="container viewer-head">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Catalogo' }]} />
        <div className="viewer-head__grid">
          <div>
            <p className="eyebrow">Catalogo prodotti 2026</p>
            <h1>
              Un viaggio <em>nel gusto italiano.</em>
            </h1>
          </div>
          <div className="viewer-head__actions">
            <a href={CATALOG_PDF} className="btn" download>
              <Download aria-hidden="true" /> Scarica il PDF <small>({CATALOG_PDF_SIZE})</small>
            </a>
            <a href={CATALOG_PDF} className="btn btn--ghost" target="_blank" rel="noopener">
              <ExternalLink aria-hidden="true" /> Apri il PDF originale
            </a>
          </div>
        </div>
      </header>

      <section className="viewer" aria-roledescription="sfogliatore" aria-label="Catalogo sfogliabile">
        <div className="container viewer__stage-wrap">
          <button type="button" className="viewer__nav viewer__nav--prev icon-btn" onClick={prev} disabled={first <= 1} aria-label="Pagina precedente">
            <ArrowLeft />
          </button>

          <div
            className={`viewer__stage${visible.length === 2 ? ' is-spread' : ''}`}
            onPointerDown={(e) => (start.current = e.pointerType === 'mouse' ? null : e.clientX)}
            onPointerUp={(e) => {
              if (start.current === null) return
              const dx = e.clientX - start.current
              start.current = null
              if (dx < -50) next()
              else if (dx > 50) prev()
            }}
          >
            <div key={first} className={`viewer__spread${turn ? ` turn-${turn}` : ''}`}>
              {visible.map((p) => (
                <figure key={p} className="viewer__page">
                  <img
                    src={catalogPageSrc(p)}
                    srcSet={catalogPageSrcSet(p)}
                    sizes="(max-width: 899px) 92vw, 40vw"
                    alt={`Catalogo prodotti 2026 — pagina ${p} di ${CATALOG_PAGES}`}
                    width={1400}
                    height={1980}
                    loading={p <= 3 ? 'eager' : 'lazy'}
                    {...(p === first ? { fetchpriority: 'high' } : {})}
                  />
                  <button type="button" className="viewer__zoom" onClick={() => openZoom(p)} aria-label={`Ingrandisci pagina ${p}`}>
                    <Maximize2 aria-hidden="true" />
                  </button>
                </figure>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="viewer__nav viewer__nav--next icon-btn"
            onClick={next}
            disabled={last >= CATALOG_PAGES}
            aria-label="Pagina successiva"
          >
            <ArrowRight />
          </button>
        </div>

        <p className="viewer__status" aria-live="polite">
          {visible.length === 2 ? `Pagine ${first}–${last}` : `Pagina ${first}`} di {CATALOG_PAGES}
        </p>

        <div className="container viewer__jump">
          <span>Vai a:</span>
          {categories.map((c) => (
            <button key={c.slug} type="button" className="chip chip--sub" onClick={() => go(c.sourcePages[0], c.sourcePages[0] > first ? 'next' : 'prev')}>
              {tr(c.name)}
            </button>
          ))}
        </div>

        <ol ref={thumbs} className="viewer__thumbs" role="list" aria-label="Miniature delle pagine">
          {Array.from({ length: CATALOG_PAGES }, (_, i) => i + 1).map((p) => (
            <li key={p} data-page={p}>
              <button
                type="button"
                aria-current={visible.includes(p) ? 'page' : undefined}
                onClick={() => go(p, p > first ? 'next' : 'prev')}
                aria-label={`Pagina ${p}`}
              >
                <img src={catalogPageSrc(p, 'thumb')} alt="" loading="lazy" width={360} height={509} />
                <span>{p}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <dialog ref={dialog} className="lightbox viewer-zoom" aria-label={`Pagina ${zoom ?? ''} ingrandita`} onClose={() => setZoom(null)}>
        <div className="lightbox__bar">
          <button type="button" className="icon-btn" onClick={() => dialog.current?.close()} aria-label="Chiudi">
            <X />
          </button>
        </div>
        <div className="viewer-zoom__scroll">{zoom && <img src={catalogPageSrc(zoom)} alt={`Pagina ${zoom} del catalogo`} />}</div>
      </dialog>
    </div>
  )
}
