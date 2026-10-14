import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { EditorialImg } from '../components/ui/Img'
import { sourceMentions, territories } from '../data/regions'
import { productById } from '../data/products'
import { productDisplayName } from '../lib/text'
import { useReveal } from '../lib/useReveal'
import { useDocumentMeta } from '../lib/seo'
import { tr } from '../i18n'
import { useHeaderOnDark } from '../components/layout/headerTheme'
import '../styles/pages.css'

export default function Territori() {
  useDocumentMeta({
    title: 'Territori',
    description: 'L’Italia, una terra di eccellenze: paesaggi e luoghi citati nel Catalogo prodotti 2026 di Noi, la qualità.',
    path: '/territori',
  })
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)
  useHeaderOnDark(true)

  return (
    <div ref={root} className="page terr-page">
      <header className="terr-hero on-dark" data-surface="dark">
        <EditorialImg name="hero-positano" alt="" priority sizes="100vw" />
        <div className="container terr-hero__copy">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Territori' }]} />
          <p className="eyebrow">Territori</p>
          <h1>
            L’Italia, <em>una terra di eccellenze.</em>
          </h1>
          <p className="lead">
            Colline, coste, montagne e isole: paesaggi diversi che hanno dato forma a una cucina unica. Qui raccontiamo l’Italia in
            generale — e indichiamo, citandoli parola per parola, i luoghi che il catalogo associa ai prodotti.
          </p>
        </div>
      </header>

      <section className="container section terr-grid" aria-label="Paesaggi">
        {territories.map((t, i) => (
          <article key={t.id} className={`terr-card terr-card--${i % 3}`} data-reveal>
            <div className="terr-card__media">
              <EditorialImg name={t.image} alt={tr(t.imageAlt)} sizes="(max-width: 700px) 100vw, 33vw" />
            </div>
            <h2>{tr(t.name)}</h2>
            <p>{tr(t.text)}</p>
          </article>
        ))}
      </section>

      <section className="terr-mentions" aria-labelledby="mentions-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Fonte: Catalogo prodotti 2026</p>
            <h2 id="mentions-title">
              Luoghi citati <em>nel catalogo</em>
            </h2>
            <p className="lead">
              Associamo un prodotto a un luogo solo quando il catalogo lo indica nel nome o nella descrizione. Per tutti gli altri
              prodotti l’origine non è specificata e non viene dichiarata.
            </p>
          </div>
          <ol className="mentions" role="list">
            {sourceMentions.map((m) => (
              <li key={m.id} id={m.id} className="mention" data-reveal>
                <div className="mention__head">
                  <h3>{m.name}</h3>
                  {m.area && <span>{m.area}</span>}
                </div>
                <blockquote>
                  <p>{tr(m.quote)}</p>
                  <cite>
                    <Link to={`/catalogo?pagina=${m.page}`}>
                      <BookOpen aria-hidden="true" /> p. {m.page}
                    </Link>
                  </cite>
                </blockquote>
                <ul role="list" className="mention__products">
                  {m.productIds.map((id) => {
                    const p = productById.get(id)
                    return p ? (
                      <li key={id}>
                        <Link to={`/prodotto/${p.slug}`}>{productDisplayName(p.sourceName, p.displayName)}</Link>
                      </li>
                    ) : null
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}
