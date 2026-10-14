import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { EditorialImg } from '../components/ui/Img'
import { pillars } from '../content/site'
import { products } from '../data/products'
import { useReveal } from '../lib/useReveal'
import { useDocumentMeta } from '../lib/seo'
import '../styles/pages.css'

const verified = products.filter((p) => p.verification === 'verified').length
const award = products.find((p) => p.id === 'nqtr1715')!

export default function Qualita() {
  useDocumentMeta({
    title: 'Qualità',
    description: 'Selezione, tradizione, territorio e identità: la filosofia di Noi, la qualità e il modo in cui presentiamo i prodotti.',
    path: '/qualita',
  })
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)
  return (
    <div ref={root} className="page quality-page">
      <header className="container page-hero">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Qualità' }]} />
        <p className="eyebrow" style={{ marginTop: '1.5rem' }}>
          La nostra filosofia
        </p>
        <h1>
          La qualità è <em>una scelta quotidiana.</em>
        </h1>
      </header>

      <section className="container quality-intro">
        <div className="quality-intro__media" data-reveal="image">
          <EditorialImg name="brand-deli" alt="Banco di una bottega italiana con prosciutti e formaggi" sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
        <ol className="quality-pillars" role="list">
          {pillars.map((p, i) => (
            <li key={p.id} data-reveal>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h2>{p.title}</h2>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="quality-transparency">
        <div className="container quality-transparency__grid">
          <div data-reveal>
            <p className="eyebrow">Trasparenza</p>
            <h2>
              Quello che c’è scritto, <em>e nient’altro.</em>
            </h2>
          </div>
          <div className="quality-transparency__copy" data-reveal>
            <p>
              Ogni scheda prodotto riporta i dati così come compaiono nel Catalogo prodotti 2026: codice articolo, formato, descrizione,
              ingredienti e pagina di riferimento. Quando un’informazione nel catalogo è incompleta o ambigua lo segnaliamo nella scheda,
              invece di completarla con supposizioni.
            </p>
            <ul role="list">
              <li>
                <strong>{verified}</strong> prodotti con dati completi e verificati sul catalogo
              </li>
              <li>
                <strong>{products.length - verified}</strong> prodotti con note sulla fonte (dati parziali o da confermare)
              </li>
              <li>Nessuna certificazione, premio o origine viene indicata se non è riportata nel catalogo.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container quality-award" data-reveal>
        <p className="eyebrow">Riconoscimenti citati nel catalogo</p>
        <p className="quality-award__text">
          “Vincitrice del 1º Premio Alma Caseus 2016 come ‘Miglior Formaggio di Fattoria’” — dalla scheda de{' '}
          <Link to={`/prodotto/${award.slug}`}>Il Super Tomato Reale</Link> (p. 20).
        </p>
        <Link to="/prodotti" className="btn">
          Esplora il catalogo <ArrowRight className="arrow" aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}
