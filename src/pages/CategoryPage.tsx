import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Quote } from 'lucide-react'
import { categories, categoryBySlug, isCategorySlug } from '../data/categories'
import { productsByCategory } from '../data/products'
import { ProductBrowser } from '../components/catalog/ProductBrowser'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { EditorialImg } from '../components/ui/Img'
import { AdultNotice } from '../components/ui/AdultNotice'
import { useHeaderOnDark } from '../components/layout/headerTheme'
import { breadcrumbLd, useDocumentMeta } from '../lib/seo'
import { editorialSrc } from '../lib/images'
import { tr } from '../i18n'
import NotFound from './NotFound'
import '../styles/catalog.css'

const DARK = new Set(['salumi', 'conserve', 'tonno', 'tartufi', 'doppio-senso', 'alcolici'])

export default function CategoryPage() {
  const { category } = useParams()
  const valid = isCategorySlug(category)
  const cat = valid ? categoryBySlug.get(category)! : undefined
  useHeaderOnDark(!!cat && DARK.has(cat.slug))

  const list = cat ? productsByCategory(cat.slug) : []
  const codes = list.reduce((n, p) => n + p.variants.length, 0)
  useDocumentMeta({
    title: cat ? tr(cat.name) : 'Pagina non trovata',
    description: cat
      ? `${tr(cat.name)}: ${list.length} prodotti e ${codes} codici dal catalogo Noi, la qualità 2026. ${tr(cat.intro)}`
      : 'Categoria non trovata.',
    path: cat ? `/prodotti/${cat.slug}` : '/404',
    image: cat ? editorialSrc(cat.art.heroImage, 1280) : undefined,
    noindex: !cat,
    jsonLd: cat
      ? [
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Prodotti', path: '/prodotti' },
            { name: tr(cat.name), path: `/prodotti/${cat.slug}` },
          ]),
        ]
      : [],
  })
  if (!cat) return <NotFound />

  const idx = categories.findIndex((c) => c.slug === cat.slug)
  const related = [categories[(idx + 1) % categories.length], categories[(idx + 2) % categories.length], categories[(idx + categories.length - 1) % categories.length]]
  const dark = DARK.has(cat.slug)

  return (
    <div className="page category-page">
      <header
        className={`cat-hero${dark ? ' on-dark' : ''}`}
        data-surface={dark ? 'dark' : undefined}
        style={{ '--tone': cat.art.tone, '--ink': cat.art.ink, '--accent': cat.art.accent } as React.CSSProperties}
      >
        <div className="container cat-hero__grid">
          <div className="cat-hero__copy">
            <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Prodotti', to: '/prodotti' }, { label: tr(cat.name) }]} />
            <p className="cat-hero__num">
              {String(cat.order).padStart(2, '0')} / {String(categories.length).padStart(2, '0')} — {cat.sourceHeading}
            </p>
            <h1>{tr(cat.name)}</h1>
            <p className="cat-hero__tagline">{tr(cat.tagline)}</p>
            <p className="cat-hero__intro">{tr(cat.intro)}</p>
            <dl className="cat-hero__facts">
              <div>
                <dt>Prodotti</dt>
                <dd>{list.length}</dd>
              </div>
              <div>
                <dt>Codici</dt>
                <dd>{codes}</dd>
              </div>
              <div>
                <dt>Pagine catalogo</dt>
                <dd>{cat.sourcePages.length > 1 ? `${cat.sourcePages[0]}–${cat.sourcePages[cat.sourcePages.length - 1]}` : cat.sourcePages[0]}</dd>
              </div>
            </dl>
          </div>
          <div className="cat-hero__media">
            <EditorialImg name={cat.art.heroImage} alt={tr(cat.art.heroAlt)} sizes="(max-width: 900px) 100vw, 46vw" priority />
          </div>
        </div>
        {cat.sourceNote && (
          <div className="container">
            <blockquote className="cat-hero__quote">
              <Quote aria-hidden="true" />
              <p>{tr(cat.sourceNote)}</p>
              <cite>Catalogo prodotti 2026, p. {cat.sourcePages[0] === 30 ? 31 : cat.sourcePages[0]}</cite>
            </blockquote>
          </div>
        )}
      </header>

      <section className="container catalog-body" aria-label={`Prodotti — ${tr(cat.name)}`}>
        {cat.adultsOnly && <AdultNotice />}
        <ProductBrowser key={cat.slug} fixedCategory={cat.slug} />
      </section>

      {cat.art.gallery.length > 0 && (
        <section className="container cat-gallery" aria-label="Immagini">
          {cat.art.gallery.map((g) => (
            <figure key={g.key}>
              <EditorialImg name={g.key} alt={tr(g.alt)} sizes="(max-width: 700px) 100vw, 33vw" />
            </figure>
          ))}
        </section>
      )}

      <section className="container related-cats" aria-labelledby="related-title">
        <h2 id="related-title">Continua a esplorare</h2>
        <ul role="list">
          {related.map((r) => (
            <li key={r.slug}>
              <Link to={`/prodotti/${r.slug}`} style={{ '--tone': r.art.tone, '--ink': r.art.ink } as React.CSSProperties}>
                <span className="related-cats__num">{String(r.order).padStart(2, '0')}</span>
                <span className="related-cats__name">{tr(r.name)}</span>
                <span className="related-cats__tag">{tr(r.tagline)}</span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
