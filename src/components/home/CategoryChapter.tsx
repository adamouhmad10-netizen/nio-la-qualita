import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { CategorySlug } from '../../data/types'
import { categoryBySlug } from '../../data/categories'
import { productsByCategory } from '../../data/products'
import { EditorialImg } from '../ui/Img'
import { ProductCard, sizeSummary } from '../ui/ProductCard'
import { productDisplayName } from '../../lib/text'
import { useReveal } from '../../lib/useReveal'
import { tr } from '../../i18n'
import { ILLUSTRATIONS, type IllustrationName } from './Illustrations'

interface Props {
  slug: CategorySlug
  /** Mirror the layout so consecutive chapters alternate. */
  flip?: boolean
  limit?: number
  mark: IllustrationName
  /** Optional explicit product order for the preview. */
  pick?: string[]
  /**
   * 'cards' (default) previews product cards; 'index' lists every family as a compact row —
   * used when the catalogue has one shared photo for the whole range (Miele).
   */
  layout?: 'cards' | 'index'
  /** Cut-out shown beside the index list. */
  indexImage?: { src: string; alt: string }
}

/**
 * Compact, data-driven category chapter used for Riso, Miele, Sottoli, Mare and Tartufi.
 * Each gets its own environmental tone (category.art) without a bespoke implementation.
 */
export function CategoryChapter({ slug, flip, limit = 4, mark, pick, layout = 'cards', indexImage }: Props) {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  const cat = categoryBySlug.get(slug)!
  const all = productsByCategory(slug)
  const list = pick ? pick.map((id) => all.find((p) => p.id === id)!).filter(Boolean) : all.slice(0, limit)
  const codes = all.reduce((n, p) => n + p.variants.length, 0)
  const Mark = ILLUSTRATIONS[mark]
  const dark = ['tonno', 'tartufi', 'conserve'].includes(slug)

  return (
    <section
      ref={root}
      id={slug}
      className={`chapter${flip ? ' chapter--flip' : ''}${dark ? ' on-dark' : ''}`}
      data-surface={dark ? 'dark' : undefined}
      style={{ '--tone': cat.art.tone, '--ink': cat.art.ink, '--accent': cat.art.accent } as React.CSSProperties}
      aria-labelledby={`${slug}-title`}
    >
      <div className="container chapter__grid">
        <div className="chapter__visual">
          <div className="chapter__media" data-reveal="image">
            <EditorialImg name={cat.art.heroImage} alt={tr(cat.art.heroAlt)} sizes="(max-width: 900px) 100vw, 42vw" />
          </div>
          <Mark className="chapter__mark motif" aria-hidden="true" />
        </div>
        <div className="chapter__body">
          <p className="chapter__num" data-reveal>
            {String(cat.order).padStart(2, '0')} — {cat.sourceHeading}
          </p>
          <h2 id={`${slug}-title`} data-reveal>
            {tr(cat.name)}
          </h2>
          <p className="chapter__tagline" data-reveal>
            {tr(cat.tagline)}
          </p>
          <p className="chapter__intro" data-reveal>
            {tr(cat.intro)}
          </p>
          {layout === 'index' ? (
            <div className="chapter__index">
              {indexImage && <img className="chapter__index-img" src={indexImage.src} alt={indexImage.alt} loading="lazy" data-reveal />}
              <ul role="list">
                {all.map((p, i) => (
                  <li key={p.id} data-reveal data-reveal-delay={i * 0.05}>
                    <Link to={`/prodotto/${p.slug}`}>
                      <span className="chapter__index-name">{productDisplayName(p.sourceName, p.displayName)}</span>
                      <span className="chapter__index-meta">
                        <span className="code">{p.variants.map((v) => v.code).join(' · ')}</span>
                        <span>{sizeSummary(p)}</span>
                      </span>
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ul className="chapter__products" role="list">
              {list.map((p, i) => (
                <li key={p.id} data-reveal data-reveal-delay={i * 0.06}>
                  <ProductCard product={p} variant="compact" sizes="(max-width: 640px) 45vw, 200px" />
                </li>
              ))}
            </ul>
          )}
          <Link to={`/prodotti/${slug}`} className="link-arrow chapter__link" data-reveal>
            Tutti i {codes} codici · {tr(cat.name)} <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
