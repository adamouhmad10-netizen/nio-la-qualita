import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck } from 'lucide-react'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { EditorialImg } from '../components/ui/Img'
import { GolosaLogo, Logo } from '../components/ui/Logo'
import { company } from '../content/company'
import { categories } from '../data/categories'
import { products, totalCodes } from '../data/products'
import { credits } from '../data/credits'
import { useReveal } from '../lib/useReveal'
import { useDocumentMeta } from '../lib/seo'
import { tr } from '../i18n'
import '../styles/pages.css'

export default function Azienda() {
  useDocumentMeta({
    title: 'Azienda',
    description: `${company.legalName}, Roma: eccellenze gastronomiche italiane e il brand Golosaqualità. Spedizioni in Italia ed estero.`,
    path: '/azienda',
  })
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)

  return (
    <div ref={root} className="page about-page">
      <header className="container page-hero about-hero">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Azienda' }]} />
        <div className="about-hero__grid">
          <div>
            <p className="eyebrow">L’azienda</p>
            <h1>
              Noi, <em>la qualità.</em>
            </h1>
          </div>
          <p className="lead">
            Un nome che è già una dichiarazione d’intenti. Da Roma selezioniamo prodotti della tradizione gastronomica italiana e li
            raccogliamo in un catalogo pensato per chi lavora con il cibo e per chi lo ama.
          </p>
        </div>
      </header>

      <section className="container about-split">
        <figure className="about-split__media" data-reveal="image">
          <EditorialImg name="pdf-road" alt="Strada nel bosco autunnale con il logo Noi, la qualità sull’asfalto (immagine del catalogo)" sizes="(max-width: 900px) 100vw, 45vw" />
          <figcaption>Immagine dal Catalogo prodotti 2026, p. 29</figcaption>
        </figure>
        <div className="about-split__copy">
          <h2 data-reveal>Chi siamo</h2>
          <p data-reveal>
            {company.legalName} ha sede a Roma, in {company.address.street}. Il catalogo 2026 riunisce {categories.length} famiglie di
            prodotti — {categories.map((c) => tr(c.name).toLowerCase()).join(', ')} — per un totale di {products.length} prodotti e{' '}
            {totalCodes} codici articolo.
          </p>
          <p data-reveal>
            Spediamo in Italia e all’estero, con modalità definite al momento dell’ordine in base alle esigenze del cliente. Le consegne su
            Roma entro il GRA sono gratuite.
          </p>
          <div className="about-logos" data-reveal>
            <Logo />
            <GolosaLogo />
          </div>
        </div>
      </section>

      <section className="about-brand">
        <div className="container about-brand__grid">
          <div data-reveal>
            <p className="eyebrow">Il nostro brand</p>
            <h2>
              Golosaqualità, <em>high quality food.</em>
            </h2>
          </div>
          <div className="about-brand__copy" data-reveal>
            <p>
              Golosaqualità è il marchio che accompagna Noi, la qualità: nel catalogo compare su ogni pagina con la dicitura “High
              Quality Food — Il nostro brand” e firma confezioni di pasta, sottoli, pomodori pelati e passata.
            </p>
            <Link to="/prodotti/pasta" className="link-arrow">
              Vedi la pasta Golosaqualità <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container about-collab">
        <div className="about-collab__media" data-reveal="image">
          <EditorialImg name="pdf-doppio-senso" alt="Bottiglia di Doppio Senso su un tavolo affacciato sul mare (immagine del catalogo)" sizes="(max-width: 900px) 100vw, 40vw" />
        </div>
        <div className="about-collab__copy">
          <p className="eyebrow" data-reveal>
            Collaborazioni
          </p>
          <h2 data-reveal>
            Doppio Senso <em>× Distilleria Morelli</em>
          </h2>
          <blockquote data-reveal>
            <p>
              “Doppio senso nasce dalla collaborazione tra Noi, la Qualità e la rinomata Distilleria Morelli, realtà artigianale
              italiana che produce alcolici dal 1911.”
            </p>
            <cite>Catalogo prodotti 2026, p. 28</cite>
          </blockquote>
          <Link to="/prodotti/doppio-senso" className="btn" data-reveal>
            Scopri Doppio Senso <ArrowRight className="arrow" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="container about-ship" data-reveal>
        <Truck aria-hidden="true" />
        <div>
          <h2>Spedizioni</h2>
          <ul role="list">
            {company.shipping.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container about-pending" aria-labelledby="pending-title">
        <h2 id="pending-title">Contenuti da completare con l’azienda</h2>
        <p>
          Il catalogo non riporta storia, anno di fondazione, team o certificazioni: queste informazioni non sono state inventate e
          verranno aggiunte dopo la conferma del cliente. Da fornire: {company.pendingConfirmation.join(', ').toLowerCase()}, storia
          aziendale, fotografie della sede.
        </p>
      </section>

      <section id="crediti" className="container credits" aria-labelledby="credits-title">
        <h2 id="credits-title">Crediti fotografici</h2>
        <p>
          Le immagini dei prodotti, la copertina e le fotografie indicate come “immagine del catalogo” provengono dal Catalogo prodotti
          2026 di {company.brand}. Le fotografie d’ambientazione sono pubblicate con licenza Unsplash; ringraziamo gli autori:
        </p>
        <ul role="list">
          {Array.from(new Map(credits.map((c) => [c.author, c])).values()).map((c) => (
            <li key={c.author}>
              <a href={c.authorUrl} target="_blank" rel="noopener noreferrer">
                {c.author}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
