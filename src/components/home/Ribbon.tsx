import { useEffect, useState } from 'react'
import { onScrollFrame } from '../../lib/motion'

export const CHAPTERS = [
  { id: 'categorie', label: 'Categorie' },
  { id: 'selezione', label: 'Selezione' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'formaggi', label: 'Formaggi' },
  { id: 'salumi', label: 'Salumi' },
  { id: 'riso', label: 'Riso' },
  { id: 'miele', label: 'Miele' },
  { id: 'conserve', label: 'Conserve' },
  { id: 'tonno', label: 'Mare' },
  { id: 'tartufi', label: 'Tartufi' },
  { id: 'territori', label: 'Territori' },
  { id: 'catalogo', label: 'Catalogo' },
]

/**
 * Below-the-fold chapters use `content-visibility: auto`, so sections render (and change
 * height) as a jump approaches them. Re-align until the target position is stable.
 */
function jumpTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
  let tries = 0
  const settle = () => {
    // Clear the fixed header and the ribbon itself (≈ 56 px) so the chapter eyebrow stays visible.
    const top = el.getBoundingClientRect().top - (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) - 48
    if (Math.abs(top) > 2 && tries++ < 6) {
      window.scrollBy({ top, behavior: 'instant' as ScrollBehavior })
      requestAnimationFrame(() => requestAnimationFrame(settle))
    }
  }
  requestAnimationFrame(() => requestAnimationFrame(settle))
  history.replaceState(null, '', `#${id}`)
  // Move keyboard focus to the chapter heading for screen-reader and keyboard users.
  const heading = el.querySelector<HTMLElement>('h2')
  if (heading) {
    heading.tabIndex = -1
    heading.focus({ preventScroll: true })
  }
}

/**
 * "Italian Discovery Ribbon": a thin chapter index that appears once the hero has
 * scrolled away and highlights the chapter in view. Plain anchor links — keyboard
 * and screen-reader friendly, no scroll hijacking.
 */
export function Ribbon() {
  const [active, setActive] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stopScroll = onScrollFrame((y) => setVisible(y > window.innerHeight * 0.85))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    CHAPTERS.forEach((c) => {
      const el = document.getElementById(c.id)
      if (el) io.observe(el)
    })
    return () => {
      stopScroll()
      io.disconnect()
    }
  }, [])

  // Keep the active chip in view on narrow screens.
  useEffect(() => {
    if (!active) return
    const chip = document.querySelector<HTMLElement>(`.ribbon a[href="#${active}"]`)
    const list = chip?.closest('ol')
    if (chip && list) list.scrollTo({ left: chip.offsetLeft - list.clientWidth / 2 + chip.clientWidth / 2, behavior: 'smooth' })
  }, [active])

  return (
    <nav className={`ribbon${visible ? ' is-visible' : ''}`} aria-label="Capitoli della pagina">
      <ol role="list">
        {CHAPTERS.map((c, i) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              aria-current={active === c.id ? 'location' : undefined}
              tabIndex={visible ? 0 : -1}
              onClick={(e) => {
                e.preventDefault()
                jumpTo(c.id)
              }}
            >
              <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              {c.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
