import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { CategorySlug, ProductFamily } from '../../data/types'
import { categoryBySlug } from '../../data/categories'
import { productById } from '../../data/products'
import { EditorialImg } from '../ui/Img'
import { ProductCard } from '../ui/ProductCard'
import { ProductVisual } from '../ui/ProductVisual'
import { RailControls } from '../ui/RailControls'
import { useRail } from '../../lib/useRail'
import { useReveal } from '../../lib/useReveal'
import { productDisplayName } from '../../lib/text'
import { tr } from '../../i18n'

interface Props {
  slug: CategorySlug
  copy: { eyebrow: string; title: string; text: string; cta: string }
  featuredId: string
  railIds: string[]
  image: string
  imageAlt: string
  secondImage?: string
  secondAlt?: string
  theme: 'stone' | 'terracotta'
}

/**
 * Large editorial chapter (Formaggi, Salumi): art-directed lead block, one featured
 * product spotlight, then a horizontally scrollable product collection.
 */
export function Feature({ slug, copy, featuredId, railIds, image, imageAlt, secondImage, secondAlt, theme }: Props) {
  const root = useRef<HTMLElement>(null)
  const { ref: railRef, ...rail } = useRail<HTMLUListElement>()
  useReveal(root)
  const cat = categoryBySlug.get(slug)!
  const featured = productById.get(featuredId)!
  const list = railIds.map((id) => productById.get(id)).filter(Boolean) as ProductFamily[]
  const [first, second = ''] = copy.title.split('|')

  return (
    <section
      ref={root}
      id={slug}
      className={`feature feature--${theme} section${theme === 'terracotta' ? ' on-dark' : ''}`}
      data-surface={theme === 'terracotta' ? 'dark' : undefined}
      aria-labelledby={`${slug}-title`}
    >
      <div className="container feature__lead">
        <div className="feature__visual">
          <div className="feature__media" data-reveal="image">
            <EditorialImg name={image} alt={imageAlt} sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          {secondImage && (
            <div className="feature__inset" data-reveal>
              <EditorialImg name={secondImage} alt={secondAlt ?? ''} sizes="(max-width: 900px) 40vw, 18vw" />
            </div>
          )}
        </div>
        <div className="feature__copy">
          <p className="eyebrow" data-reveal>
            {copy.eyebrow}
          </p>
          <h2 id={`${slug}-title`} data-reveal="lines">
            <span className="reveal-line">
              <span>{first}</span>
            </span>
            <span className="reveal-line">
              <span>
                <em>{second}</em>
              </span>
            </span>
          </h2>
          <p className="lead" data-reveal>
            {copy.text}
          </p>

          <Link to={`/prodotto/${featured.slug}`} className="spotlight" data-reveal>
            <span className="spotlight__media">
              <ProductVisual product={featured} sizes="160px" />
            </span>
            <span className="spotlight__body">
              <span className="spotlight__label">In evidenza</span>
              <span className="spotlight__name">{productDisplayName(featured.sourceName, featured.displayName)}</span>
              <span className="spotlight__codes">
                {featured.variants.map((v) => (
                  <span key={v.code}>
                    <span className="code">{v.code}</span> {v.size}
                  </span>
                ))}
              </span>
              {featured.description && <span className="spotlight__desc">{tr(featured.description)}</span>}
            </span>
          </Link>
        </div>
      </div>

      <div className="container feature__rail-head">
        <p className="feature__rail-title" data-reveal>
          {tr(cat.name)} · selezione dal catalogo
        </p>
        <div className="feature__rail-actions" data-reveal>
          <RailControls {...rail} label={tr(cat.name)} />
          <Link to={`/prodotti/${slug}`} className="btn btn--small">
            {copy.cta} <ArrowRight className="arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <ul ref={railRef} className="rail feature__rail" role="list">
        {list.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} sizes="(max-width: 640px) 70vw, 260px" />
          </li>
        ))}
      </ul>
    </section>
  )
}
