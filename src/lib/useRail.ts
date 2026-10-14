import { useCallback, useEffect, useRef, useState } from 'react'

/** Prev/next controls for a native scroll-snap rail. Keeps native swipe & keyboard scroll. */
export function useRail<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [canPrev, setPrev] = useState(false)
  const [canNext, setNext] = useState(true)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    setPrev(el.scrollLeft > 4)
    setNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // No synchronous measurement on mount: reading scroll geometry here would force a
    // layout of the whole page during hydration. ResizeObserver's first callback arrives
    // after the browser's own layout pass, at no extra cost.
    let raf = 0
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          update()
        })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', onScroll)
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [update])

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const item = el.firstElementChild as HTMLElement | null
    const step = item ? item.getBoundingClientRect().width + 20 : el.clientWidth * 0.8
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * step * Math.max(1, Math.floor(el.clientWidth / step) - 1), behavior: reduce ? 'auto' : 'smooth' })
  }

  return { ref, canPrev, canNext, prev: () => scrollBy(-1), next: () => scrollBy(1) }
}
