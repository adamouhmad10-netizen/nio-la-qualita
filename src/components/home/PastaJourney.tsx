import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { pastaJourney } from '../../content/site'
import { productById, productsByCategory } from '../../data/products'
import { productDisplayName } from '../../lib/text'
import { EditorialImg } from '../ui/Img'
import { ProductVisual } from '../ui/ProductVisual'
import { useMediaQuery, useReducedMotion } from '../../lib/motion'
import { useReveal } from '../../lib/useReveal'

const EXTRA = ['nqbm1202', 'nqbm1208', 'nqmvd2101', 'nqmvd2138']
const items = [
  ...productsByCategory('pasta').filter((p) => p.subcategory === 'Formati classici'),
  ...EXTRA.map((id) => productById.get(id)!),
]

/**
 * Signature scroll sequence. On large screens with motion allowed the chapter holds in
 * place (CSS `position: sticky`) for a bounded distance while the pasta formats travel
 * horizontally and the active format is highlighted; elsewhere it is a native swipe rail.
 *
 * Sticky + one rAF-throttled scroll handler replaces a GSAP ScrollTrigger pin: no pin
 * spacer re-parenting, no layout shifts, compositor-only transforms per frame.
 */
export function PastaJourney() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLOListElement>(null)
  const giant = useRef<HTMLSpanElement>(null)
  const geo = useRef({ top: 0, travel: 1, distance: 0 })
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const wide = useMediaQuery('(min-width: 1024px) and (min-height: 700px)')
  const pinned = wide && !reduced
  useReveal(root)

  const setActiveIfChanged = (i: number) => {
    if (i !== activeRef.current) {
      activeRef.current = i
      setActive(i)
    }
  }

  useEffect(() => {
    const el = root.current
    const tr = track.current
    if (!pinned || !el || !tr) return
    let raf = 0
    const measure = () => {
      // Horizontal distance the formats travel; the section is made tall enough to scroll it.
      // All reads first, then writes (no read-after-write layout thrash). Neither the
      // track's transform nor the section's own height affects these measurements.
      const distance = Math.max(0, tr.scrollWidth - tr.clientWidth)
      const top = el.getBoundingClientRect().top + window.scrollY
      const travel = Math.round(distance * 0.9 + 200)
      geo.current = { top, travel, distance }
      el.style.setProperty('--pasta-travel', `${travel}px`)
      update()
    }
    const update = () => {
      raf = 0
      const { top, travel, distance } = geo.current
      const p = Math.min(1, Math.max(0, (window.scrollY - top) / travel))
      tr.style.transform = `translate3d(${-p * distance}px, 0, 0)`
      if (giant.current) {
        const r = Math.min(1, Math.max(0, (window.scrollY - top + window.innerHeight) / (travel + 2 * window.innerHeight)))
        giant.current.style.transform = `rotate(180deg) translate3d(0, ${(r - 0.5) * 18}%, 0)`
      }
      setActiveIfChanged(Math.round(p * (items.length - 1)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    // First measurement comes from ResizeObserver (after layout) rather than a forced
    // synchronous layout during hydration.
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      ro.disconnect()
      cancelAnimationFrame(raf)
      el.style.removeProperty('--pasta-travel')
      tr.style.transform = ''
      if (giant.current) giant.current.style.transform = ''
    }
  }, [pinned])

  // Non-pinned: derive active card from horizontal scroll (rAF-throttled).
  useEffect(() => {
    if (pinned) return
    const tr = track.current
    if (!tr) return
    let raf = 0
    const on = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const w = (tr.firstElementChild as HTMLElement | null)?.offsetWidth ?? 1
        setActiveIfChanged(Math.min(items.length - 1, Math.round(tr.scrollLeft / (w + 16))))
      })
    }
    tr.addEventListener('scroll', on, { passive: true })
    return () => {
      tr.removeEventListener('scroll', on)
      cancelAnimationFrame(raf)
    }
  }, [pinned])

  const goTo = (i: number) => {
    const n = Math.max(0, Math.min(items.length - 1, i))
    if (pinned) {
      const { top, travel } = geo.current
      window.scrollTo({ top: top + (n / (items.length - 1)) * travel, behavior: 'smooth' })
    } else {
      const tr = track.current
      const card = tr?.children[n] as HTMLElement | undefined
      if (tr && card) tr.scrollTo({ left: card.offsetLeft - tr.offsetLeft, behavior: reduced ? 'auto' : 'smooth' })
    }
  }

  const current = items[active]

  return (
    <section ref={root} id="pasta" className={`pasta${pinned ? ' is-pinned' : ''}`} aria-labelledby="pasta-title">
      <div className="pasta__pin">
        <div className="container pasta__grid">
          <div className="pasta__media" data-reveal="image">
            <EditorialImg name="pasta-nests" alt="Nidi di pasta all’uovo su un piano infarinato" sizes="(max-width: 1023px) 100vw, 34vw" />
            <span ref={giant} className="pasta__giant" aria-hidden="true">
              Pasta
            </span>
          </div>

          <div className="pasta__content">
            <div className="pasta__head">
              <p className="eyebrow" data-reveal>
                {pastaJourney.eyebrow}
              </p>
              <h2 id="pasta-title" data-reveal="lines">
                <span className="reveal-line">
                  <span>Ogni formato</span>
                </span>
                <span className="reveal-line">
                  <span>
                    <em>racconta una storia.</em>
                  </span>
                </span>
              </h2>
              <p className="lead" data-reveal>
                {pastaJourney.text}
              </p>
            </div>

            <div className="pasta__now">
              <span className="pasta__index">
                {String(active + 1).padStart(2, '0')}
                <small> / {String(items.length).padStart(2, '0')}</small>
              </span>
              <span className="pasta__now-name">
                {productDisplayName(current.sourceName, current.displayName)}
                <small className="code">
                  {current.variants[0].code} · {current.variants[0].size}
                </small>
              </span>
            </div>

            <ol ref={track} className="pasta__track" role="list" aria-label="Formati di pasta">
              {items.map((p, i) => (
                <li key={p.id} className={`pasta__item${i === active ? ' is-active' : ''}`}>
                  <Link to={`/prodotto/${p.slug}`} className="pasta__card">
                    <span className="pasta__card-media">
                      <ProductVisual product={p} sizes="200px" />
                    </span>
                    <span className="pasta__card-name">{productDisplayName(p.sourceName, p.displayName)}</span>
                    <span className="code">{p.variants[0].code}</span>
                  </Link>
                </li>
              ))}
            </ol>

            <div className="pasta__foot">
              <div className="pasta__progress" aria-hidden="true">
                <span style={{ transform: `scaleX(${(active + 1) / items.length})` }} />
              </div>
              <div className="rail-controls">
                <button type="button" className="icon-btn" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Formato precedente">
                  <ArrowLeft />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => goTo(active + 1)}
                  disabled={active === items.length - 1}
                  aria-label="Formato successivo"
                >
                  <ArrowRight />
                </button>
              </div>
              <Link to="/prodotti/pasta" className="btn">
                {pastaJourney.cta} <ArrowRight className="arrow" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
