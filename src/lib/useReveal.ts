import { useEffect, type RefObject } from 'react'

/**
 * Scroll-triggered entrances for descendants of `scope`, using one IntersectionObserver
 * and CSS transitions (base.css) instead of a ScrollTrigger per element — far cheaper on
 * the main thread, and nothing to clean up beyond `disconnect()`.
 *   [data-reveal]            fade + rise
 *   [data-reveal="lines"]    each .reveal-line > span slides up from its mask
 *   [data-reveal="image"]    clip-path mask opening with a slow image settle
 *   [data-reveal-delay="0.12"] optional delay in seconds
 * Hidden initial states apply only under `.motion-ok`, so reduced-motion users and
 * pre-rendered HTML always show content.
 */
export function useReveal(scope: RefObject<HTMLElement>, deps: unknown[] = []) {
  useEffect(() => {
    const root = scope.current
    if (!root || !document.documentElement.classList.contains('motion-ok')) return
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'))
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting && e.boundingClientRect.top > 0) continue
          const el = e.target as HTMLElement
          const delay = el.dataset.revealDelay
          if (delay) el.style.transitionDelay = `${delay}s`
          el.classList.add('is-in')
          io.unobserve(el)
        }
      },
      // Elements already above the viewport (deep links, back navigation) reveal at once.
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
