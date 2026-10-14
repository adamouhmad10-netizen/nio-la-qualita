import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Category } from '../../data/types'
import { EditorialImg } from './Img'
import { tr } from '../../i18n'
import { productsByCategory } from '../../data/products'

export function CategoryCard({ category, index }: { category: Category; index?: number }) {
  const count = productsByCategory(category.slug).reduce((n, p) => n + p.variants.length, 0)
  return (
    <Link
      to={`/prodotti/${category.slug}`}
      className="ccard"
      data-cursor="Esplora"
      style={{ '--cc-tone': category.art.tone, '--cc-accent': category.art.accent } as React.CSSProperties}
    >
      <div className="ccard__media">
        <EditorialImg name={category.art.heroImage} alt="" sizes="(max-width: 640px) 75vw, 22vw" />
      </div>
      <div className="ccard__body">
        {index !== undefined && <span className="ccard__num">{String(index + 1).padStart(2, '0')}</span>}
        <h3 className="ccard__title">{tr(category.name)}</h3>
        <p className="ccard__count">{count} codici</p>
        <span className="ccard__arrow" aria-hidden="true">
          <ArrowRight />
        </span>
      </div>
    </Link>
  )
}
