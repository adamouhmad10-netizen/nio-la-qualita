import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { ui } from '../../i18n'
import { onScrollFrame } from '../../lib/motion'
import { company, primaryEmail } from '../../content/company'
import { categories } from '../../data/categories'
import { tr } from '../../i18n'

export const NAV = [
  { to: '/', label: ui.nav.home, end: true },
  { to: '/azienda', label: ui.nav.azienda },
  { to: '/prodotti', label: ui.nav.prodotti },
  { to: '/territori', label: ui.nav.territori },
  { to: '/qualita', label: ui.nav.qualita },
  { to: '/catalogo', label: ui.nav.catalogo },
  { to: '/contatti', label: ui.nav.contatti },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return onScrollFrame((y) => setScrolled(y > 24))
  }, [])

  // Close the menu on navigation.
  useEffect(() => setOpen(false), [location.pathname, location.search])

  // Mobile menu: scroll lock, Escape to close, focus trap, focus restore.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    const panel = panelRef.current
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])
    focusables()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const f = [toggleRef.current!, ...focusables()]
      const i = f.indexOf(document.activeElement as HTMLElement)
      if (e.shiftKey && i <= 0) {
        e.preventDefault()
        f[f.length - 1].focus()
      } else if (!e.shiftKey && i === f.length - 1) {
        e.preventDefault()
        f[0].focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      root.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      toggleRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
        <div className="topbar" aria-hidden={scrolled}>
          <div className="container topbar__inner">
            <a href={company.phones[0].href} tabIndex={scrolled ? -1 : 0}>
              <Phone aria-hidden="true" /> {company.phones[0].display}
            </a>
            <a href={`mailto:${primaryEmail}`} tabIndex={scrolled ? -1 : 0}>
              <Mail aria-hidden="true" /> {primaryEmail}
            </a>
            <span className="topbar__addr">
              <MapPin aria-hidden="true" /> {company.address.street}, {company.address.city}
            </span>
            <span className="topbar__note">Spedizioni in Italia ed estero</span>
          </div>
        </div>
        <div className="container site-header__bar">
          <Link to="/" className="site-header__logo" aria-label="Noi, la qualità — Home">
            <Logo className="logo logo--color" />
            <Logo variant="white" className="logo logo--white" />
          </Link>
          <nav className="site-nav" aria-label="Principale">
            <ul role="list">
              {NAV.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} end={n.end} className="site-nav__link">
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <Link to="/contatti?richiesta=catalogo" className="btn btn--small site-header__cta">
            {ui.nav.cta}
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="visually-hidden">{open ? ui.nav.close : ui.nav.menu}</span>
            <span className="menu-toggle__lines" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={panelRef}
        className={`mobile-menu${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu di navigazione"
        data-surface="dark"
      >
        <div className="mobile-menu__inner">
          <nav aria-label="Principale (mobile)">
            <ol role="list" className="mobile-menu__list">
              {NAV.map((n, i) => (
                <li key={n.to} style={{ '--i': i } as React.CSSProperties}>
                  <NavLink to={n.to} end={n.end}>
                    <span className="mobile-menu__num">{String(i + 1).padStart(2, '0')}</span>
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ol>
          </nav>
          <div className="mobile-menu__cats">
            <p className="eyebrow">Categorie</p>
            <ul role="list">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link to={`/prodotti/${c.slug}`}>{tr(c.name)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <Link to="/contatti?richiesta=catalogo" className="btn btn--gold mobile-menu__cta">
            {ui.nav.cta} <ArrowRight className="arrow" aria-hidden="true" />
          </Link>
          <p className="mobile-menu__contact">
            <a href={company.phones[0].href}>{company.phones[0].display}</a>
            <a href={`mailto:${primaryEmail}`}>{primaryEmail}</a>
          </p>
        </div>
      </div>
    </>
  )
}
