import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useHydratedSearchParams } from '../lib/hydration'
import { AlertCircle, Check, Copy, Info, Mail, MapPin, Phone, Truck, X } from 'lucide-react'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { ProductVisual } from '../components/ui/ProductVisual'
import { company, primaryEmail } from '../content/company'
import { productBySlug } from '../data/products'
import { categoryBySlug } from '../data/categories'
import { productDisplayName } from '../lib/text'
import { tr } from '../i18n'
import { useDocumentMeta } from '../lib/seo'
import '../styles/pages.css'

const TOPICS = [
  { value: 'prodotto', label: 'Informazioni su un prodotto' },
  { value: 'catalogo', label: 'Richiesta del catalogo' },
  { value: 'distribuzione', label: 'Distribuzione e partnership' },
  { value: 'spedizioni', label: 'Spedizioni e consegne' },
  { value: 'altro', label: 'Altro' },
]

type Field = 'name' | 'email' | 'phone' | 'message' | 'consent'
type Errors = Partial<Record<Field, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function Contatti() {
  useDocumentMeta({
    title: 'Contatti',
    description: `Contatta ${company.legalName}: ${company.address.printed}. Telefono ${company.phones[0].display}, e-mail ${primaryEmail}.`,
    path: '/contatti',
  })
  const [params] = useHydratedSearchParams()
  const product = productBySlug.get(params.get('prodotto') ?? '')
  const initialTopic = product ? 'prodotto' : params.get('richiesta') === 'catalogo' ? 'catalogo' : 'prodotto'
  const productName = product ? productDisplayName(product.sourceName, product.displayName) : ''

  const initialMessage = useMemo(() => {
    if (product)
      return `Buongiorno,\nvorrei ricevere informazioni su ${productName} (${product.variants.map((v) => `${v.code}${v.size ? ` – ${v.size}` : ''}`).join('; ')}).\n\nGrazie.`
    if (initialTopic === 'catalogo') return 'Buongiorno,\nvorrei ricevere il Catalogo prodotti 2026 e informazioni sulle condizioni di fornitura.\n\nGrazie.'
    return ''
  }, [product, productName, initialTopic])

  const [values, setValues] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    topic: initialTopic,
    message: initialMessage,
    consent: false,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [composed, setComposed] = useState<{ subject: string; body: string; href: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const uid = useId()
  const id = (f: string) => `${uid}-${f}`

  useEffect(() => {
    setValues((v) => ({ ...v, topic: initialTopic, message: initialMessage }))
  }, [initialTopic, initialMessage])

  const validate = (v = values): Errors => {
    const e: Errors = {}
    if (v.name.trim().length < 2) e.name = 'Inserisci nome e cognome.'
    if (!EMAIL_RE.test(v.email.trim())) e.email = 'Inserisci un indirizzo e-mail valido, ad esempio nome@azienda.it.'
    if (v.phone && !/^[+\d][\d\s./-]{5,}$/.test(v.phone.trim())) e.phone = 'Il numero contiene caratteri non validi.'
    if (v.message.trim().length < 10) e.message = 'Scrivi un messaggio di almeno 10 caratteri.'
    if (!v.consent) e.consent = 'Per procedere è necessario il consenso al trattamento dei dati.'
    return e
  }

  const set = <K extends keyof typeof values>(k: K, val: (typeof values)[K]) => {
    const nv = { ...values, [k]: val }
    setValues(nv)
    if (errors[k as Field]) setErrors(validate(nv))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    const firstError = (Object.keys(errs) as Field[])[0]
    if (firstError) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(firstError))}`)?.focus()
      return
    }
    const topic = TOPICS.find((t) => t.value === values.topic)?.label ?? ''
    const subject = `[Sito web] ${topic}${product ? ` – ${productName}` : ''}`
    const body = [
      values.message.trim(),
      '',
      '—',
      `Nome: ${values.name.trim()}`,
      values.company && `Azienda: ${values.company.trim()}`,
      `E-mail: ${values.email.trim()}`,
      values.phone && `Telefono: ${values.phone.trim()}`,
      product && `Prodotto: ${productName} – ${location.origin}/prodotto/${product.slug}`,
    ]
      .filter(Boolean)
      .join('\n')
    const href = `mailto:${primaryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setComposed({ subject, body, href })
    window.location.href = href
    requestAnimationFrame(() => resultRef.current?.focus())
  }

  const describe = (f: Field, hint?: string) => [errors[f] ? id(`${f}-err`) : '', hint ? id(`${f}-hint`) : ''].filter(Boolean).join(' ') || undefined

  return (
    <div className="page contact-page">
      <header className="container page-hero contact-hero">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contatti' }]} />
        <p className="eyebrow" style={{ marginTop: '1.5rem' }}>
          Contatti
        </p>
        <h1>
          Parliamo di <em>qualità.</em>
        </h1>
        <p className="lead">
          Distributori, ristoratori, botteghe e privati: scrivici per informazioni su prodotti, formati, catalogo e spedizioni.
        </p>
      </header>

      <div className="container contact-grid">
        <aside className="contact-info" aria-label="Recapiti">
          <div className="contact-card">
            <h2>{company.legalName}</h2>
            <ul role="list">
              <li>
                <MapPin aria-hidden="true" />
                <span>
                  {company.address.street}
                  <br />
                  {company.address.postalCode} {company.address.city} — {company.address.country}
                </span>
              </li>
              {company.phones.map((p) => (
                <li key={p.href}>
                  <Phone aria-hidden="true" />
                  <a href={p.href}>{p.display}</a>
                </li>
              ))}
              {company.emails.map((m) => (
                <li key={m.address}>
                  <Mail aria-hidden="true" />
                  <a href={`mailto:${m.address}`}>{m.address}</a>
                </li>
              ))}
            </ul>
            <p className="contact-card__fine">* Recapito riportato nel catalogo con asterisco: il significato non è specificato.</p>
          </div>
          <div className="contact-card contact-card--soft">
            <h2>
              <Truck aria-hidden="true" /> Spedizioni
            </h2>
            <ul role="list" className="contact-card__list">
              {company.shipping.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="contact-card__fine">{company.shippingDisclaimer}</p>
          </div>
        </aside>

        <section className="contact-form-wrap" aria-labelledby="form-title">
          <h2 id="form-title">Invia una richiesta</h2>
          <p className="form-note">
            <Info aria-hidden="true" />
            <span>
              Il modulo non invia dati a un server: alla conferma si apre il tuo programma di posta con il messaggio già compilato,
              indirizzato a <a href={`mailto:${primaryEmail}`}>{primaryEmail}</a>. Il collegamento a un servizio di invio sarà
              attivato nella versione definitiva del sito.
            </span>
          </p>

          {product && (
            <div className="form-product">
              <span className="form-product__media">
                <ProductVisual product={product} sizes="96px" />
              </span>
              <span>
                <small>Richiesta relativa a · {tr(categoryBySlug.get(product.category)!.name)}</small>
                <strong>{productName}</strong>
                <span className="code">{product.variants.map((v) => v.code).join(' · ')}</span>
              </span>
              <Link to="/contatti" className="form-product__remove" aria-label="Rimuovi il prodotto dalla richiesta">
                <X />
              </Link>
            </div>
          )}

          <form ref={formRef} className="form" noValidate onSubmit={onSubmit}>
            <div className="form__row">
              <div className={`field${errors.name ? ' has-error' : ''}`}>
                <label htmlFor={id('name')}>
                  Nome e cognome <span aria-hidden="true">*</span>
                </label>
                <input
                  id={id('name')}
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => set('name', e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-required="true"
                  aria-describedby={describe('name')}
                />
                {errors.name && (
                  <p id={id('name-err')} className="field__error">
                    <AlertCircle aria-hidden="true" /> {errors.name}
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor={id('company')}>
                  Azienda <span className="muted">(facoltativo)</span>
                </label>
                <input id={id('company')} name="organization" autoComplete="organization" value={values.company} onChange={(e) => set('company', e.target.value)} />
              </div>
            </div>
            <div className="form__row">
              <div className={`field${errors.email ? ' has-error' : ''}`}>
                <label htmlFor={id('email')}>
                  E-mail <span aria-hidden="true">*</span>
                </label>
                <input
                  id={id('email')}
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  value={values.email}
                  onChange={(e) => set('email', e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-required="true"
                  aria-describedby={describe('email')}
                />
                {errors.email && (
                  <p id={id('email-err')} className="field__error">
                    <AlertCircle aria-hidden="true" /> {errors.email}
                  </p>
                )}
              </div>
              <div className={`field${errors.phone ? ' has-error' : ''}`}>
                <label htmlFor={id('phone')}>
                  Telefono <span className="muted">(facoltativo)</span>
                </label>
                <input
                  id={id('phone')}
                  type="tel"
                  name="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={values.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  aria-invalid={!!errors.phone}
                  aria-describedby={describe('phone')}
                />
                {errors.phone && (
                  <p id={id('phone-err')} className="field__error">
                    <AlertCircle aria-hidden="true" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>
            <div className="field">
              <label htmlFor={id('topic')}>Argomento</label>
              <select id={id('topic')} value={values.topic} onChange={(e) => set('topic', e.target.value)}>
                {TOPICS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={`field${errors.message ? ' has-error' : ''}`}>
              <label htmlFor={id('message')}>
                Messaggio <span aria-hidden="true">*</span>
              </label>
              <textarea
                id={id('message')}
                rows={7}
                value={values.message}
                onChange={(e) => set('message', e.target.value)}
                aria-invalid={!!errors.message}
                aria-required="true"
                aria-describedby={describe('message')}
              />
              {errors.message && (
                <p id={id('message-err')} className="field__error">
                  <AlertCircle aria-hidden="true" /> {errors.message}
                </p>
              )}
            </div>
            <div className={`field field--check${errors.consent ? ' has-error' : ''}`}>
              <input
                id={id('consent')}
                type="checkbox"
                checked={values.consent}
                onChange={(e) => set('consent', e.target.checked)}
                aria-invalid={!!errors.consent}
                aria-required="true"
                aria-describedby={describe('consent')}
              />
              <label htmlFor={id('consent')}>
                Ho letto l’<Link to="/privacy">informativa privacy</Link> e acconsento al trattamento dei dati per ricevere una risposta.{' '}
                <span aria-hidden="true">*</span>
              </label>
              {errors.consent && (
                <p id={id('consent-err')} className="field__error">
                  <AlertCircle aria-hidden="true" /> {errors.consent}
                </p>
              )}
            </div>
            <p className="form__required">* campi obbligatori</p>
            <button type="submit" className="btn btn--gold">
              <Mail aria-hidden="true" /> Prepara l’e-mail
            </button>
          </form>

          {composed && (
            <div ref={resultRef} tabIndex={-1} className="form-result" role="status">
              <p className="form-result__title">
                <Check aria-hidden="true" /> Messaggio pronto nel tuo programma di posta
              </p>
              <p>
                Se il programma di posta non si è aperto, <a href={composed.href}>riprova</a> oppure copia il testo e invialo a{' '}
                <a href={`mailto:${primaryEmail}`}>{primaryEmail}</a>. L’invio avviene solo quando premi “Invia” nella tua e-mail.
              </p>
              <button
                type="button"
                className="btn btn--small btn--ghost"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(`${composed.subject}\n\n${composed.body}`)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2500)
                  } catch {
                    setCopied(false)
                  }
                }}
              >
                <Copy aria-hidden="true" /> {copied ? 'Testo copiato' : 'Copia il testo'}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
