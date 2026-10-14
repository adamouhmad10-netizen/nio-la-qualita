import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { PageLoader } from './components/ui/PageLoader'
import Home from './pages/Home'

/** React Router v7 behaviour, opted into now (also silences the v6 deprecation warnings). */
export const ROUTER_FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true } as const

// Home is eager (it is the LCP route); every other route is code-split. Their chunks are
// prefetched at idle priority by <link rel="prefetch"> tags written in scripts/prerender.mjs.
const loaders = {
  products: () => import('./pages/Products'),
  category: () => import('./pages/CategoryPage'),
  product: () => import('./pages/ProductPage'),
  azienda: () => import('./pages/Azienda'),
  territori: () => import('./pages/Territori'),
  qualita: () => import('./pages/Qualita'),
  catalogo: () => import('./pages/Catalogo'),
  contatti: () => import('./pages/Contatti'),
}
const Products = lazy(loaders.products)
const CategoryPage = lazy(loaders.category)
const ProductPage = lazy(loaders.product)
const Azienda = lazy(loaders.azienda)
const Territori = lazy(loaders.territori)
const Qualita = lazy(loaders.qualita)
const Catalogo = lazy(loaders.catalogo)
const Contatti = lazy(loaders.contatti)
const Privacy = lazy(() => import('./pages/Privacy'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="prodotti" element={<Suspense fallback={<PageLoader />}><Products /></Suspense>} />
        <Route path="prodotti/:category" element={<Suspense fallback={<PageLoader />}><CategoryPage /></Suspense>} />
        <Route path="prodotto/:slug" element={<Suspense fallback={<PageLoader />}><ProductPage /></Suspense>} />
        <Route path="azienda" element={<Suspense fallback={<PageLoader />}><Azienda /></Suspense>} />
        <Route path="territori" element={<Suspense fallback={<PageLoader />}><Territori /></Suspense>} />
        <Route path="qualita" element={<Suspense fallback={<PageLoader />}><Qualita /></Suspense>} />
        <Route path="catalogo" element={<Suspense fallback={<PageLoader />}><Catalogo /></Suspense>} />
        <Route path="contatti" element={<Suspense fallback={<PageLoader />}><Contatti /></Suspense>} />
        <Route path="privacy" element={<Suspense fallback={<PageLoader />}><Privacy /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
      </Route>
    </Routes>
  )
}
