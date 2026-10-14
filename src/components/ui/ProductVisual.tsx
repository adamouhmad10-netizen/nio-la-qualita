import type { ProductFamily } from '../../data/types'
import { productSrc, productSrcSet } from '../../lib/images'
import { categoryBySlug } from '../../data/categories'
import { productDisplayName } from '../../lib/text'
import { tr, ui } from '../../i18n'

interface Props {
  product: ProductFamily
  sizes?: string
  priority?: boolean
  /** Index into product.images. */
  index?: number
  showScope?: boolean
}

/**
 * The product's catalogue image, or — when the PDF has no photograph (e.g. the spirits
 * price list) — a typographic label in the category palette. Never a substitute photo.
 */
export function ProductVisual({ product, sizes = '(max-width: 640px) 50vw, 25vw', priority, index = 0, showScope }: Props) {
  const image = product.images[index]
  const cat = categoryBySlug.get(product.category)!
  if (!image) {
    return (
      <div
        className="pv-fallback"
        style={{ '--pv-tone': cat.art.tone, '--pv-ink': cat.art.ink, '--pv-accent': cat.art.accent } as React.CSSProperties}
        role="img"
        aria-label={`${productDisplayName(product.sourceName, product.displayName)} — ${ui.product.noImage}`}
      >
        <span className="pv-fallback__cat">{tr(cat.name)}</span>
        <span className="pv-fallback__name">{productDisplayName(product.sourceName, product.displayName)}</span>
        <span className="pv-fallback__rule" />
        <span className="pv-fallback__code">{product.variants.map((v) => v.code).join(' · ')}</span>
      </div>
    )
  }
  return (
    <>
      <img
        className={`pv-img pv-img--${image.key.startsWith('editorial/') ? 'photo' : 'cut'}`}
        src={productSrc(image.key, 'sm')}
        srcSet={productSrcSet(image.key)}
        sizes={sizes}
        alt={tr(image.alt)}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
      {showScope && image.scope !== 'exact' && (
        <span className="pv-scope">{image.scope === 'range' ? ui.product.rangeImage : ui.product.familyImage}</span>
      )}
    </>
  )
}
