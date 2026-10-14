import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { company, primaryEmail } from '../content/company'
import { useDocumentMeta } from '../lib/seo'
import '../styles/pages.css'

export default function Privacy() {
  useDocumentMeta({ title: 'Privacy e cookie', description: 'Informativa privacy e cookie (bozza in attesa di validazione).', path: '/privacy', noindex: true })
  return (
    <div className="page">
      <header className="container page-hero">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Privacy e cookie' }]} />
        <h1 style={{ marginTop: '1.5rem' }}>
          Privacy <em>e cookie</em>
        </h1>
      </header>
      <div className="container" style={{ paddingBottom: 'var(--section-y)' }}>
        <div className="prose">
          <p className="pending-box">
            Bozza per la presentazione del prototipo. Il testo definitivo dell’informativa (titolare del trattamento, base giuridica,
            tempi di conservazione, diritti dell’interessato) deve essere fornito o validato dal consulente legale di {company.legalName}.
          </p>
          <h2>Dati raccolti da questo sito</h2>
          <p>
            Questa versione del sito non raccoglie né memorizza dati personali su server: il modulo di contatto prepara un’e-mail nel
            programma di posta dell’utente, che decide se inviarla a {primaryEmail}.
          </p>
          <h2>Cookie</h2>
          <p>
            Il sito non utilizza cookie di profilazione né strumenti di analisi statistica. Eventuali strumenti futuri verranno indicati
            qui e, ove richiesto, attivati solo previo consenso.
          </p>
          <h2>Contatti</h2>
          <p>
            {company.legalName} — {company.address.printed} — <a href={`mailto:${primaryEmail}`}>{primaryEmail}</a>
          </p>
        </div>
      </div>
    </div>
  )
}
