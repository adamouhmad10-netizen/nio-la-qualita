import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Pre-rendered HTML is generated without a query string. To keep the first client render
 * identical to the server markup (a requirement for hydration), state derived from
 * `location.search` is applied right after hydration. Client-side navigations — which
 * happen after hydration — read the URL immediately.
 */
let hydrated = typeof window === 'undefined' ? false : !document.getElementById('root')?.hasAttribute('data-ssr')

export function markHydrated() {
  hydrated = true
}

export function useHydrated() {
  const [h, setH] = useState(hydrated)
  useEffect(() => {
    if (!h) setH(true)
  }, [h])
  return h
}

const EMPTY = new URLSearchParams()

/** useSearchParams that reports empty params until hydration completes. */
export function useHydratedSearchParams() {
  const [params, setParams] = useSearchParams()
  const h = useHydrated()
  return [h ? params : EMPTY, setParams] as const
}
