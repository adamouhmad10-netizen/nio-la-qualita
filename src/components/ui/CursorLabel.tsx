import { useEffect, useRef, useState } from 'react'

/**
 * Desktop-only hover label ("Esplora", "Sfoglia") that follows the pointer over elements
 * with [data-cursor]. Purely decorative: the native cursor stays visible and the target
 * remains a normal link.
 */
export function CursorLabel() {
  const ref = useRef<HTMLSpanElement>(null)
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduce.matches) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]')
      setLabel(t ? t.dataset.cursor ?? null : null)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (ref.current) ref.current.style.translate = `${e.clientX}px ${e.clientY}px`
      })
    }
    const onLeave = () => setLabel(null)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <span ref={ref} className={`cursor-label${label ? ' is-visible' : ''}`} aria-hidden="true">
      {label}
    </span>
  )
}
