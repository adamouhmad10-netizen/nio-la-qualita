import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Download } from 'lucide-react'
import { catalogShowcase } from '../../content/site'
import { CATALOG_PDF, CATALOG_PDF_SIZE, catalogPageSrc } from '../../lib/images'
import { useReveal } from '../../lib/useReveal'

export function CatalogShowcase() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  return (
    <section ref={root} id="catalogo" className="section catalog-promo" aria-labelledby="catalog-title">
      <div className="container catalog-promo__grid">
        <div className="catalog-promo__copy">
          <p className="eyebrow" data-reveal>
            {catalogShowcase.eyebrow}
          </p>
          <h2 id="catalog-title" data-reveal="lines">
            <span className="reveal-line">
              <span>Un viaggio</span>
            </span>
            <span className="reveal-line">
              <span>
                <em>nel gusto italiano.</em>
              </span>
            </span>
          </h2>
          <p className="lead" data-reveal>
            {catalogShowcase.text}
          </p>
          <div className="catalog-promo__actions" data-reveal>
            <Link to="/catalogo" className="btn">
              <BookOpen aria-hidden="true" /> {catalogShowcase.cta}
            </Link>
            <a href={CATALOG_PDF} className="btn btn--ghost" download>
              <Download aria-hidden="true" /> {catalogShowcase.download} <small>({CATALOG_PDF_SIZE})</small>
            </a>
          </div>
        </div>
        <Link to="/catalogo" className="catalog-promo__book" aria-label="Apri il catalogo sfogliabile" data-cursor="Sfoglia">
          <span className="catalog-promo__spread" aria-hidden="true">
            <img src={catalogPageSrc(9, 'thumb')} alt="" loading="lazy" width={360} height={509} />
            <img src={catalogPageSrc(13, 'thumb')} alt="" loading="lazy" width={360} height={509} />
          </span>
          <span className="catalog-promo__cover">
            <img
              src={catalogPageSrc(1, 'mid')}
              alt="Copertina del Catalogo prodotti 2026 di Noi, la qualità"
              loading="lazy"
              width={1400}
              height={1980}
            />
          </span>
        </Link>
      </div>
    </section>
  )
}
