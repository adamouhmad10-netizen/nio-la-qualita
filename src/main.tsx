import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App, { ROUTER_FUTURE } from './App'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'

import { markHydrated } from './lib/hydration'

// `motion-ok` is set by an inline script in index.html before first paint.

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter future={ROUTER_FUTURE}>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Hydrate only when the pre-rendered HTML belongs to this URL. Hosts that fall back to
// another document (SPA rewrite to /index.html for an unknown path) get a clean render.
const ssrRoute = root.dataset.ssr
const here = location.pathname.replace(/\/+$/, '') || '/'
/**
 * Let the browser paint the pre-rendered page (and its LCP image) before hydration takes
 * the main thread: wait for the high-priority image to decode — capped, so a slow image
 * never delays interactivity for long — then for the next frame. The pre-rendered HTML is
 * already fully readable and its links are real <a> elements in the meantime.
 */
async function afterFirstPaint() {
  const hero = document.querySelector<HTMLImageElement>('img[fetchpriority="high"]')
  if (hero) await Promise.race([hero.decode().catch(() => {}), new Promise((r) => setTimeout(r, 1500))])
  await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)))
}

if (ssrRoute && ssrRoute === here) {
  void afterFirstPaint().then(() => {
    hydrateRoot(root, app, {
      // A mismatch makes React re-render on the client: still correct, but slower — surface it.
      onRecoverableError(err) {
        console.error('[hydration]', err)
      },
    })
    requestAnimationFrame(markHydrated)
  })
} else {
  root.textContent = ''
  delete root.dataset.ssr
  markHydrated()
  createRoot(root).render(app)
}
