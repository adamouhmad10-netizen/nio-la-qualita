import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { categories } from '../data/categories'
import { tr } from '../i18n'
import { useDocumentMeta } from '../lib/seo'
import '../styles/pages.css'

export default function NotFound() {
  useDocumentMeta({ title: 'Pagina non trovata', description: 'La pagina richiesta non esiste.', path: '/404', noindex: true })
  return (
    <div className="page not-found">
      <div className="container not-found__inner">
        <p className="not-found__code" aria-hidden="true">
          404
        </p>
        <h1>
          Questa pagina <em>non è in catalogo.</em>
        </h1>
        <p className="lead">Il link potrebbe essere cambiato. Puoi ripartire dalla home, cercare un prodotto o scegliere una categoria.</p>
        <div className="not-found__actions">
          <Link to="/" className="btn">
            Torna alla home
          </Link>
          <Link to="/prodotti" className="btn btn--ghost">
            Cerca un prodotto <ArrowRight className="arrow" aria-hidden="true" />
          </Link>
        </div>
        <ul role="list" className="not-found__cats">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to={`/prodotti/${c.slug}`}>{tr(c.name)}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
