import { Link } from 'react-router-dom'
import { Download } from 'lucide-react'
import { GolosaLogo, Logo } from '../ui/Logo'
import { NAV } from './Header'
import { categories } from '../../data/categories'
import { tr } from '../../i18n'
import { company } from '../../content/company'
import { CATALOG_PDF } from '../../lib/images'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer on-dark" data-surface="dark">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo variant="white" className="site-footer__logo" />
          <p>
            Eccellenze gastronomiche italiane selezionate e raccolte in un unico catalogo: dalla pasta ai formaggi,
            dai salumi ai liquori.
          </p>
          <div className="site-footer__golosa">
            <GolosaLogo variant="white" />
          </div>
        </div>

        <nav className="site-footer__col" aria-label="Sito">
          <h2>Navigazione</h2>
          <ul role="list">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="site-footer__col" aria-label="Categorie prodotti">
          <h2>Prodotti</h2>
          <ul role="list">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/prodotti/${c.slug}`}>{tr(c.name)}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__col">
          <h2>Contatti</h2>
          <address>
            <strong>{company.legalName}</strong>
            <br />
            {company.address.street}
            <br />
            {company.address.postalCode} {company.address.city} — {company.address.country}
          </address>
          <ul role="list" className="site-footer__contacts">
            {company.phones.map((p) => (
              <li key={p.href}>
                <a href={p.href}>{p.display}</a>
              </li>
            ))}
            {company.emails.map((e) => (
              <li key={e.address}>
                <a href={`mailto:${e.address}`}>{e.address}</a>
              </li>
            ))}
          </ul>
          <a className="site-footer__pdf" href={CATALOG_PDF} download>
            <Download aria-hidden="true" /> Catalogo 2026 (PDF)
          </a>
        </div>
      </div>
      <div className="container site-footer__base">
        <p>
          © {year} {company.legalName}. Tutti i diritti riservati.
        </p>
        <p className="site-footer__legal">
          <Link to="/privacy">Privacy e cookie</Link>
          <span aria-hidden="true">·</span>
          <span>P. IVA: da confermare</span>
          <span aria-hidden="true">·</span>
          <Link to="/azienda#crediti">Crediti fotografici</Link>
        </p>
      </div>
    </footer>
  )
}
