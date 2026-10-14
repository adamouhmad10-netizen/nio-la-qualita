import { useEffect } from 'react'

/**
 * Pages whose first screen is dark tell the header to start in light-on-dark mode.
 * Implemented as a data attribute on <html> so CSS can react without re-rendering.
 */
export function useHeaderOnDark(onDark: boolean) {
  useEffect(() => {
    const el = document.documentElement
    if (onDark) el.dataset.headerOnDark = ''
    else delete el.dataset.headerOnDark
    return () => {
      delete el.dataset.headerOnDark
    }
  }, [onDark])
}
