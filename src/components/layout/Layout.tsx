import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { ui } from '../../i18n'

/**
 * App shell: skip link, header, routed content, footer.
 * Restores scroll to top on PUSH navigations and moves focus to <main> so screen-reader
 * users land on the new page; back/forward keeps the browser's own scroll restoration.
 */
export function Layout() {
  const { pathname, hash } = useLocation()
  const navType = useNavigationType()
  const mainRef = useRef<HTMLElement>(null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    if (navType !== 'POP') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      mainRef.current?.focus({ preventScroll: true })
    }
  }, [pathname, hash, navType])

  return (
    <>
      <a className="skip-link" href="#main">
        {ui.nav.skip}
      </a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
