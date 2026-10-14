import { Link } from 'react-router-dom'
import { ProductBrowser } from '../components/catalog/ProductBrowser'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { products, totalCodes } from '../data/products'
import { categories } from '../data/categories'
import { tr, ui } from '../i18n'
import { breadcrumbLd, useDocumentMeta } from '../lib/seo'
import '../styles/catalog.css'

export default function Products() {
  useDocumentMeta({
    title: ui.catalog.title,
    description: `Sfoglia ${products.length} prodotti e ${totalCodes} codici articolo del catalogo 2026: pasta, riso, salumi, formaggi, miele, conserve, tonno, tartufi, Doppio Senso e alcolici.`,
    path: '/prodotti',
    jsonLd: [breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Prodotti', path: '/prodotti' }])],
  })

  return (
    <div className="page catalog-page">
      <header className="page-hero catalog-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Prodotti' }]} />
          <div className="catalog-hero__grid">
            <div>
              <p className="eyebrow">Catalogo prodotti 2026</p>
              <h1>
                I nostri <em>prodotti</em>
              </h1>
            </div>
            <p className="lead">
              {products.length} prodotti e {totalCodes} codici articolo, organizzati come nel catalogo stampato. Cerca per nome o
              per codice, filtra per categoria e apri la scheda di ogni prodotto.
            </p>
          </div>
          <nav className="catalog-index" aria-label="Indice rapido delle categorie">
            <ol role="list">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link to={`/prodotti/${c.slug}`}>
                    <span>{String(c.order).padStart(2, '0')}</span>
                    {tr(c.name)}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </header>
      <section className="container catalog-body" aria-label="Elenco prodotti">
        <ProductBrowser />
      </section>
    </div>
  )
}
