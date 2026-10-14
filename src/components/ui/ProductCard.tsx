import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { ProductFamily } from '../../data/types'
import { productDisplayName } from '../../lib/text'
import { ProductVisual } from './ProductVisual'
import { categoryBySlug } from '../../data/categories'
import { tr } from '../../i18n'

interface Props {
  product: ProductFamily
  showCategory?: boolean
  sizes?: string
  variant?: 'default' | 'compact'
}

export function sizeSummary(p: ProductFamily) {
  const sizes = Array.from(new Set(p.variants.map((v) => v.label ?? v.size).filter(Boolean)))
  return sizes.join(' · ')
}

export function codeSummary(p: ProductFamily) {
  if (p.variants.length === 1) return p.variants[0].code
  if (p.variants.length <= 3) return p.variants.map((v) => v.code).join(' · ')
  return `${p.variants[0].code} +${p.variants.length - 1}`
}

export function ProductCard({ product, showCategory, sizes, variant = 'default' }: Props) {
  const name = productDisplayName(product.sourceName, product.displayName)
  const cat = categoryBySlug.get(product.category)!
  const desc = tr(product.description)
  return (
    <article className={`pcard pcard--${variant}`}>
      <div className="pcard__media">
        <ProductVisual product={product} sizes={sizes} />
      </div>
      <div className="pcard__body">
        <p className="pcard__meta">
          {showCategory ? tr(cat.name) : (product.subcategory ?? tr(cat.name))}
        </p>
        <h3 className="pcard__title">
          <Link to={`/prodotto/${product.slug}`} className="pcard__link">
            {name}
          </Link>
        </h3>
        <p className="pcard__codes">
          <span className="code">{codeSummary(product)}</span>
          {sizeSummary(product) && <span className="pcard__sizes">{sizeSummary(product)}</span>}
        </p>
        {variant === 'default' && desc && <p className="pcard__desc">{desc}</p>}
      </div>
      <span className="pcard__arrow" aria-hidden="true">
        <ArrowUpRight />
      </span>
    </article>
  )
}
