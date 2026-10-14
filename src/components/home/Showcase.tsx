import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { slides } from '../../content/showcase'
import { productById } from '../../data/products'
import { categoryBySlug } from '../../data/categories'
import { productDisplayName } from '../../lib/text'
import { useReducedMotion } from '../../lib/motion'
import { tr } from '../../i18n'
import { ILLUSTRATIONS } from './Illustrations'

/** GSAP-equivalent easing curves. */
const EASE = {
  expoInOut: 'cubic-bezier(0.87, 0, 0.13, 1)',
  expoOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  power2In: 'cubic-bezier(0.5, 0, 0.75, 0)',
  power3Out: 'cubic-bezier(0.33, 1, 0.68, 1)',
}

/** Resting opacity of the giant background word (matches .showcase__word.is-active). */
const WORD_OPACITY = 0.85

/**
 * Floater positions, as % of the visual box. The product occupies the centred 60 % column
 * (20–80 %), so floaters live in the outer bands and the upper area, clear of the product
 * and of the decorative word at the bottom. Below 600 px only the first one is shown.
 */
const FLOAT_POS = [
  { left: '5%', top: '6%', w: 'clamp(34px, 4.5vw, 72px)', r: -14, depth: 1.4 },
  { left: '86%', top: '8%', w: 'clamp(30px, 3.8vw, 62px)', r: 18, depth: 0.8 },
  { left: '84%', top: '46%', w: 'clamp(28px, 3.4vw, 56px)', r: -6, depth: 1.8 },
]

/**
 * "La selezione" — an Italian reinterpretation of the supplied motion references:
 * full-bleed colour change, oversized word behind the hero product, floating line
 * illustrations, previous/next + swipe + arrow keys. No autoplay.
 */
export function Showcase() {
  const [index, setIndex] = useState(0)
  // Slides whose product image may load: the current one, its neighbours, and any slide
  // already shown. Hidden slides would otherwise download on page load (they count as
  // "near the viewport" for lazy loading) and compete with the hero image.
  const [primed, setPrimed] = useState(() => new Set([0, 1, slides.length - 1]))
  const prevIndex = useRef(0)
  const dir = useRef(1)
  // Running transition; a new request jumps it to its end instead of being ignored.
  const running = useRef<{ cleanup: () => void; finishNow: () => void } | null>(null)
  const root = useRef<HTMLElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const total = slides.length

  const go = useCallback(
    (next: number, direction?: number) => {
      const n = (next + total) % total
      if (n === index) return
      dir.current = direction ?? (n > index ? 1 : -1)
      prevIndex.current = index
      setPrimed((prev) => {
        const want = [n, (n + 1) % total, (n - 1 + total) % total]
        if (want.every((k) => prev.has(k))) return prev
        const next = new Set(prev)
        want.forEach((k) => next.add(k))
        return next
      })
      setIndex(n)
    },
    [index, total],
  )

  // Choreography: product swap, giant word slide, floaters, info text.
  // Web Animations API with transform/opacity only, so every frame runs on the compositor
  // (smooth even while the main thread is busy) — previously GSAP tweened these from JS.
  useEffect(() => {
    const el = root.current
    if (!el || prevIndex.current === index || reduced) return
    const from = prevIndex.current
    const d = dir.current
    // A new request while a transition runs: jump the old one to its end first.
    running.current?.finishNow()

    const q = (sel: string) => el.querySelectorAll<HTMLElement>(sel)
    const outSlide = q('.showcase__slide')[from]
    const inSlide = q('.showcase__slide')[index]
    const outWord = q('.showcase__word')[from]
    const inWord = q('.showcase__word')[index]
    outSlide.classList.add('is-leaving')
    outWord.classList.add('is-leaving')

    const anims: Animation[] = []
    const run = (target: Element | null, frames: Keyframe[], opts: KeyframeAnimationOptions) => {
      if (target) anims.push(target.animate(frames, { fill: 'both', ...opts }))
    }
    const outProduct = outSlide.querySelector('.showcase__product')
    const inProduct = inSlide.querySelector('.showcase__product')

    // Out
    run(outProduct, [{ transform: 'none', opacity: 1 }, { transform: `translateX(${-95 * d}%) rotate(${-14 * d}deg) scale(0.86)`, opacity: 0 }], {
      duration: 950,
      easing: EASE.expoInOut,
    })
    outSlide.querySelectorAll('.showcase__float > svg').forEach((f, k) =>
      run(f, [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-60px)', opacity: 0 }], { duration: 600, delay: k * 40, easing: EASE.power2In }),
    )
    run(outWord, [{ transform: 'translateY(-6%)', opacity: WORD_OPACITY }, { transform: `translateX(${-28 * d}%) translateY(-6%)`, opacity: 0 }], {
      duration: 950,
      easing: EASE.expoInOut,
    })
    // In
    run(inWord, [{ transform: `translateX(${32 * d}%) translateY(-6%)`, opacity: 0 }, { transform: 'translateY(-6%)', opacity: WORD_OPACITY }], {
      duration: 1150,
      delay: 120,
      easing: EASE.expoInOut,
    })
    run(inProduct, [{ transform: `translateX(${95 * d}%) rotate(${16 * d}deg) scale(0.84)`, opacity: 0 }, { transform: 'none', opacity: 1 }], {
      duration: 1150,
      delay: 180,
      easing: EASE.expoInOut,
    })
    inSlide.querySelectorAll('.showcase__float > svg').forEach((f, k) =>
      run(f, [{ transform: 'translateY(70px) rotate(-25deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], {
        duration: 1000,
        delay: 550 + k * 80,
        easing: EASE.expoOut,
      }),
    )
    el.querySelectorAll('.showcase__text.is-active [data-anim]').forEach((t, k) =>
      run(t, [{ transform: 'translateY(22px)', opacity: 0 }, { transform: 'none', opacity: 1 }], {
        duration: 700,
        delay: 500 + k * 60,
        easing: EASE.power3Out,
      }),
    )

    let done = false
    const cleanup = () => {
      if (done) return
      done = true
      outSlide.classList.remove('is-leaving')
      outWord.classList.remove('is-leaving')
      // Drop the filled end states so CSS (active/inactive rules) is the single source of truth.
      anims.forEach((a) => a.cancel())
      if (running.current?.cleanup === cleanup) running.current = null
    }
    running.current = {
      cleanup,
      finishNow: () => {
        anims.forEach((a) => a.finish())
        cleanup()
      },
    }
    Promise.all(anims.map((a) => a.finished)).then(cleanup, () => {})
  }, [index, reduced])

  useEffect(() => () => running.current?.finishNow(), [])

  // Keep the active tab visible in the (horizontally scrolling) tab row on narrow screens.
  // Scrolls the row only — never the page.
  useEffect(() => {
    const row = tabsRef.current
    const tab = row?.children[index] as HTMLElement | undefined
    if (!row || !tab || row.scrollWidth <= row.clientWidth) return
    const left = tab.offsetLeft - row.clientWidth / 2 + tab.offsetWidth / 2
    row.scrollTo({ left: Math.max(0, left), behavior: reduced ? 'auto' : 'smooth' })
  }, [index, reduced])

  // Run decorative loops only while the slider is on screen.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => (el.dataset.inview = e.isIntersecting ? '1' : '0'))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Pointer parallax for the 3 visible floaters (desktop, motion allowed). Writes their
  // `translate` directly instead of CSS variables on the section, which would restyle the
  // whole slider subtree on every pointer move.
  useEffect(() => {
    const el = root.current
    if (!el || reduced || document.documentElement.classList.contains('lite') || !window.matchMedia('(pointer: fine)').matches) return
    let raf = 0
    let rect: DOMRect | null = null
    const onEnter = () => (rect = el.getBoundingClientRect())
    const onScroll = () => (rect = null) // re-measured lazily on the next pointer move
    const onMove = (e: PointerEvent) => {
      if (raf) return
      const { clientX, clientY } = e
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = rect ?? (rect = el.getBoundingClientRect())
        const mx = (clientX - r.left) / r.width - 0.5
        const my = (clientY - r.top) / r.height - 0.5
        el.querySelectorAll<HTMLElement>('.showcase__slide.is-active .showcase__float').forEach((f) => {
          const d = Number(f.dataset.depth)
          f.style.translate = `${(-mx * d * 38).toFixed(1)}px ${(-my * d * 28).toFixed(1)}px`
        })
      })
    }
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointermove', onMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  // Swipe.
  const start = useRef<{ x: number; y: number } | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return
    start.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const s = start.current
    start.current = null
    if (!s) return
    const dx = e.clientX - s.x
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y)) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(index + 1, 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(index - 1, -1)
    }
  }

  const s = slides[index]
  const name = slideInfo(s).name

  return (
    <section
      ref={root}
      id="selezione"
      className="showcase"
      aria-roledescription="carosello"
      aria-label="La nostra selezione"
      style={{ '--tone': s.tone, '--ink': s.ink, '--accent': s.accent } as React.CSSProperties}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div className="showcase__head container">
        <p className="eyebrow">La selezione</p>
        <p className="showcase__count" aria-hidden="true">
          <span>{String(index + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
        </p>
      </div>

      {/* Product + decorative word share one bounded box (a size container): the word is
          sized and positioned relative to it, so it can never reach the text below. */}
      <div className="showcase__visual">
        <div className="showcase__words" aria-hidden="true">
          {slides.map((sl, i) => (
            // Each word/slide carries its own accent so outgoing elements keep their colour.
            <span key={sl.word} className={`showcase__word${i === index ? ' is-active' : ''}`} style={{ color: sl.accent }}>
              {sl.word}
            </span>
          ))}
        </div>

        <div className="showcase__stage">
          {slides.map((sl, i) => (
            <SlideVisual key={sl.productId} slide={sl} position={i} total={total} active={i === index} load={primed.has(i)} />
          ))}
        </div>
      </div>

      <div className="showcase__info container">
        {/* Every slide's text sits in the same grid cell: the block always has the height of
            the tallest slide, so changing slide never shifts the product above it. */}
        <div className="showcase__texts">
          {slides.map((sl, k) => (
            <SlideText key={sl.productId} slide={sl} active={k === index} />
          ))}
        </div>

        <div className="showcase__controls">
          <button type="button" className="icon-btn" onClick={() => go(index - 1, -1)} aria-label="Prodotto precedente">
            <ArrowLeft />
          </button>
          <button type="button" className="icon-btn" onClick={() => go(index + 1, 1)} aria-label="Prodotto successivo">
            <ArrowRight />
          </button>
        </div>
      </div>

      <div ref={tabsRef} className="showcase__tabs container" role="tablist" aria-label="Scegli la famiglia">
        {slides.map((sl, i) => (
          <button
            key={sl.word}
            type="button"
            role="tab"
            aria-selected={i === index}
            className="showcase__tab"
            onClick={() => go(i)}
          >
            <span className="showcase__tab-bar" />
            {sl.word}
          </button>
        ))}
      </div>

      <p className="visually-hidden" aria-live="polite">
        {`${index + 1} di ${total}: ${s.word} — ${name}`}
      </p>
    </section>
  )
}

function slideInfo(s: (typeof slides)[number]) {
  const product = productById.get(s.productId)!
  const cat = categoryBySlug.get(product.category)!
  const isRange = product.images[0]?.scope === 'range'
  return {
    product,
    cat,
    isRange,
    href: isRange ? `/prodotti/${product.category}` : `/prodotto/${product.slug}`,
    name: isRange ? `Linea ${tr(cat.name).toLowerCase()}` : productDisplayName(product.sourceName, product.displayName),
  }
}

/** Product visual + floating illustrations of one slide. Memoised: a slide change only
 * re-renders the two slides whose `active` state changes. */
const SlideVisual = memo(function SlideVisual({
  slide: sl,
  position,
  total,
  active,
  load,
}: {
  slide: (typeof slides)[number]
  position: number
  total: number
  active: boolean
  load: boolean
}) {
  const p = productById.get(sl.productId)!
  return (
    <div
      className={`showcase__slide${active ? ' is-active' : ''}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`${position + 1} di ${total}`}
      aria-hidden={!active}
      style={{ '--accent': sl.accent } as React.CSSProperties}
    >
      {sl.floaters.map((f, k) => {
        const Ill = ILLUSTRATIONS[f]
        const pos = FLOAT_POS[k]
        return (
          <span
            key={k}
            className="showcase__float"
            data-depth={pos.depth}
            style={{ left: pos.left, top: pos.top, width: pos.w, '--r': `${pos.r}deg` } as React.CSSProperties}
          >
            <Ill className="motif" aria-hidden="true" />
          </span>
        )
      })}
      {load && (
        <img
          className="showcase__product"
          src={`/images/products/${sl.cutout}-960.webp`}
          srcSet={`/images/products/${sl.cutout}-480.webp 480w, /images/products/${sl.cutout}-960.webp 960w`}
          sizes="(max-width: 700px) 70vw, 34vw"
          alt={tr(p.images[0]?.alt) || productDisplayName(p.sourceName)}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  )
})

/** Text block of one slide. Memoised for the same reason as SlideVisual. */
const SlideText = memo(function SlideText({ slide: s, active }: { slide: (typeof slides)[number]; active: boolean }) {
  const { product, cat, isRange, href, name } = slideInfo(s)
  return (
    <div className={`showcase__text${active ? ' is-active' : ''}`} aria-hidden={!active}>
      <p className="showcase__cat" data-anim>
        {tr(cat.name)}
      </p>
      <h3 className="showcase__name" data-anim>
        {name}
      </h3>
      <p className="showcase__line" data-anim>
        {s.quoted ? <q>{s.line}</q> : s.line}
        {s.quoted && <span className="showcase__src"> — Catalogo 2026, p. {product.sourcePages[0]}</span>}
      </p>
      <p className="showcase__codes" data-anim>
        {isRange ? (
          <span className="code">{product.category === 'miele' ? '11 codici · NQAF001–NQAF011' : ''}</span>
        ) : (
          product.variants.slice(0, 3).map((v) => (
            <span key={v.code} className="showcase__chip">
              <span className="code">{v.code}</span> {v.label ?? v.size}
            </span>
          ))
        )}
      </p>
      <Link to={href} className="btn showcase__cta" data-anim tabIndex={active ? 0 : -1}>
        {isRange ? `Scopri ${tr(cat.name).toLowerCase()}` : 'Vedi il prodotto'} <ArrowRight className="arrow" aria-hidden="true" />
      </Link>
    </div>
  )
})
