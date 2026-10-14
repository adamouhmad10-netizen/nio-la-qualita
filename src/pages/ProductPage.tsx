import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, FileText, Mail } from 'lucide-react'
import { productBySlug, productsByCategory } from '../data/products'
import { categoryBySlug } from '../data/categories'
import { productDisplayName } from '../lib/text'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Gallery } from '../components/product/Gallery'
import { ProductCard } from '../components/ui/ProductCard'
import { AdultNotice } from '../components/ui/AdultNotice'
import { breadcrumbLd, SITE_URL, useDocumentMeta } from '../lib/seo'
import { productSrc } from '../lib/images'
import { tr, ui } from '../i18n'
import NotFound from './NotFound'
import '../styles/catalog.css'

const STATUS: Record<string, string> = {
  verified: 'Dati verificati sul catalogo',
  partial: 'Dati parziali nel catalogo',
  ambiguous: 'Dato da confermare',
}

export default function ProductPage() {
  const { slug = '' } = useParams()
  const product = productBySlug.get(slug)
  const cat = product ? categoryBySlug.get(product.category)! : undefined
  const name = product ? productDisplayName(product.sourceName, product.displayName) : ''

  useDocumentMeta({
    title: product ? `${name} — ${product.variants.map((v) => v.code).join(', ')}` : 'Prodotto non trovato',
    description: product
      ? `${name} (${tr(cat!.name)}). ${product.variants.map((v) => `${v.code}${v.size ? ` ${v.size}` : ''}`).join(' · ')}. ${tr(product.description).slice(0, 120)}`
      : 'Prodotto non trovato.',
    path: product ? `/prodotto/${product.slug}` : '/404',
    image: product?.images[0] ? productSrc(product.images[0].key, 'lg') : undefined,
    type: 'product',
    noindex: !product,
    jsonLd: product
      ? [
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Prodotti', path: '/prodotti' },
            { name: tr(cat!.name), path: `/prodotti/${cat!.slug}` },
            { name, path: `/prodotto/${product.slug}` },
          ]),
          // Informational Product markup: no offers, prices, ratings or availability (none exist).
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name,
            sku: product.variants[0].code,
            category: tr(cat!.name),
            ...(product.description ? { description: tr(product.description) } : {}),
            ...(product.images[0] ? { image: SITE_URL + productSrc(product.images[0].key, 'lg') } : {}),
            url: `${SITE_URL}/prodotto/${product.slug}`,
          },
        ]
      : [],
  })

  if (!product || !cat) return <NotFound />

  const siblings = productsByCategory(product.category)
  const i = siblings.findIndex((p) => p.id === product.id)
  const prev = siblings[(i - 1 + siblings.length) % siblings.length]
  const next = siblings[(i + 1) % siblings.length]
  const related = [
    ...siblings.filter((p) => p.id !== product.id && p.subcategory === product.subcategory),
    ...siblings.filter((p) => p.id !== product.id && p.subcategory !== product.subcategory),
  ].slice(0, 4)
  const hasLabels = product.variants.some((v) => v.label)
  const inquiry = `/contatti?prodotto=${encodeURIComponent(product.slug)}`

  return (
    <div className="page product-page">
      <div className="container product-page__top">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Prodotti', to: '/prodotti' },
            { label: tr(cat.name), to: `/prodotti/${cat.slug}` },
            { label: name },
          ]}
        />
      </div>

      <article className="container product" style={{ '--accent': cat.art.accent, '--tone': cat.art.tone } as React.CSSProperties}>
        <div className="product__gallery">
          <Gallery product={product} />
        </div>

        <div className="product__info">
          <p className="product__cat">
            <Link to={`/prodotti/${cat.slug}`}>{tr(cat.name)}</Link>
            {product.subcategory && <span> · {product.subcategory}</span>}
          </p>
          <h1 className="product__name">{name}</h1>

          <div className="product__variants">
            <h2 className="product__label">{product.variants.length > 1 ? ui.product.variants : `${ui.product.code} e ${ui.product.size.toLowerCase()}`}</h2>
            <table>
              <thead>
                <tr>
                  <th scope="col">{ui.product.code}</th>
                  {hasLabels && <th scope="col">Variante</th>}
                  <th scope="col">{ui.product.size}</th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((v) => (
                  <tr key={v.code + (v.label ?? '')}>
                    <td>
                      <span className="code">{v.code}</span>
                    </td>
                    {hasLabels && <td>{v.label ?? '—'}</td>}
                    <td>{v.size ?? 'Non indicato'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {product.description && (
            <div className="product__block">
              <h2 className="product__label">{ui.product.description}</h2>
              <p className="product__desc">{tr(product.description)}</p>
            </div>
          )}

          {product.ingredients && (
            <div className="product__block">
              <h2 className="product__label">{ui.product.ingredients}</h2>
              <p>{tr(product.ingredients)}</p>
            </div>
          )}

          {(product.details?.length || product.origin || product.producer) && (
            <dl className="product__details">
              {product.details?.map((d) => (
                <div key={tr(d.label)}>
                  <dt>{tr(d.label)}</dt>
                  <dd>{tr(d.value)}</dd>
                </div>
              ))}
              {product.origin && (
                <div>
                  <dt>{ui.product.origin}</dt>
                  <dd>{tr(product.origin)}</dd>
                </div>
              )}
              {product.producer && (
                <div>
                  <dt>{ui.product.producer}</dt>
                  <dd>{product.producer}</dd>
                </div>
              )}
            </dl>
          )}

          {cat.adultsOnly && <AdultNotice compact />}

          <div className="product__actions">
            <Link to={inquiry} className="btn btn--gold">
              <Mail aria-hidden="true" /> {ui.product.request}
            </Link>
            <Link to={`/prodotti/${cat.slug}`} className="btn btn--ghost">
              <ArrowLeft aria-hidden="true" /> {ui.product.backTo} {tr(cat.name).toLowerCase()}
            </Link>
          </div>

          <aside className="product__source" aria-label={ui.product.source}>
            <p className="product__source-head">
              <FileText aria-hidden="true" />
              <span>
                {ui.product.sourcePage} {product.sourcePages.join(', ')}
              </span>
              <span className={`status status--${product.verification}`}>{STATUS[product.verification]}</span>
            </p>
            <p className="product__source-name">
              Nome in catalogo: <q>{product.sourceName}</q>
            </p>
            {product.notes && product.notes.length > 0 && (
              <ul role="list" className="product__notes">
                {product.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
            <Link to={`/catalogo?pagina=${product.sourcePages[0]}`} className="link-arrow">
              <BookOpen aria-hidden="true" /> Apri la pagina nel catalogo
            </Link>
          </aside>
        </div>
      </article>

      <nav className="container product-nav" aria-label="Altri prodotti della categoria">
        <Link to={`/prodotto/${prev.slug}`} className="product-nav__link" rel="prev">
          <ArrowLeft aria-hidden="true" />
          <span>
            <small>{ui.product.prev}</small>
            {productDisplayName(prev.sourceName, prev.displayName)}
          </span>
        </Link>
        <Link to={`/prodotto/${next.slug}`} className="product-nav__link product-nav__link--next" rel="next">
          <span>
            <small>{ui.product.next}</small>
            {productDisplayName(next.sourceName, next.displayName)}
          </span>
          <ArrowRight aria-hidden="true" />
        </Link>
      </nav>

      {related.length > 0 && (
        <section className="container related" aria-labelledby="related-products">
          <div className="related__head">
            <h2 id="related-products">{ui.product.related}</h2>
            <Link to={`/prodotti/${cat.slug}`} className="link-arrow">
              Tutti i prodotti · {tr(cat.name)} <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <ul className="product-grid" role="list">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} sizes="(max-width: 640px) 50vw, 25vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
