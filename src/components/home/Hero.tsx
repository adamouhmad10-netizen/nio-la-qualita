import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import { hero } from '../../content/site'
import { EditorialImg } from '../ui/Img'
import { BrandStrokes } from './Illustrations'
import { productById, products, totalCodes } from '../../data/products'
import { categories } from '../../data/categories'
import { productDisplayName } from '../../lib/text'

const featured = productById.get('nqe213')!

export function Hero() {
  const root = useRef<HTMLElement>(null)

  return (
    <section ref={root} className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow" data-hero-fade>
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="reveal-line">
              <span>{hero.title[0]}</span>
            </span>
            <span className="reveal-line">
              <span>
                <em>{hero.title[1]}</em>
              </span>
            </span>
          </h1>
          <p className="hero__text" data-hero-fade>
            {hero.text}
          </p>
          <div className="hero__actions" data-hero-fade>
            <a href="#categorie" className="btn btn--gold">
              {hero.cta} <ArrowRight className="arrow" aria-hidden="true" />
            </a>
            <Link to="/catalogo" className="btn btn--ghost">
              <BookOpen aria-hidden="true" /> {hero.secondary}
            </Link>
          </div>
          <dl className="hero__facts" data-hero-fade>
            <div>
              <dt>Categorie</dt>
              <dd>{categories.length}</dd>
            </div>
            <div>
              <dt>Prodotti</dt>
              <dd>{products.length}</dd>
            </div>
            <div>
              <dt>Codici articolo</dt>
              <dd>{totalCodes}</dd>
            </div>
          </dl>
        </div>

        <div className="hero__visual">
          <BrandStrokes className="hero__strokes" />
          <div className="hero__frame">
            <EditorialImg
              name="hero-table"
              alt="Tavola apparecchiata con piatti della cucina mediterranea su una terrazza affacciata sul mare"
              sizes="(max-width: 900px) 100vw, 46vw"
              widths={[640, 960, 1280, 2000]}
              priority
            />
          </div>
          <div className="hero__inset">
            <EditorialImg name="hero-positano" alt="Il borgo di Positano sulla Costiera Amalfitana" sizes="(max-width: 900px) 40vw, 18vw" />
          </div>
          <Link to={`/prodotto/${featured.slug}`} className="hero__product">
            <img src="/images/products/cut-p4-nqe213-480.webp" alt="" width={60} height={96} loading="eager" />
            <span>
              <small>{featured.variants[0].code} · 500 g</small>
              <strong>{productDisplayName(featured.sourceName)}</strong>
              <span className="hero__product-link">
                Vedi il prodotto <ArrowRight aria-hidden="true" />
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
