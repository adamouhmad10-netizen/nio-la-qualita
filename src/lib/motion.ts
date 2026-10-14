import { useEffect, useLayoutEffect, useState } from 'react'

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useMediaQuery(query: string) {
  // Starts false on server and client alike (hydration-safe); the effect applies the real value.
  const [match, setMatch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/**
 * Calls `fn(scrollY)` at most once per animation frame while the page scrolls.
 * Returns the cleanup function.
 */
export function onScrollFrame(fn: (y: number) => void) {
  let raf = 0
  const handler = () => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      fn(window.scrollY)
    })
  }
  fn(window.scrollY)
  window.addEventListener('scroll', handler, { passive: true })
  return () => {
    window.removeEventListener('scroll', handler)
    cancelAnimationFrame(raf)
  }
}
