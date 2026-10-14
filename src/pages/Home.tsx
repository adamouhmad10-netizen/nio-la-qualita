import { Suspense, type ReactNode } from 'react'
import { Hero } from '../components/home/Hero'
import { Ribbon } from '../components/home/Ribbon'
import { CategoryRail } from '../components/home/CategoryRail'
import { Showcase } from '../components/home/Showcase'
import { PastaJourney } from '../components/home/PastaJourney'
import { Feature } from '../components/home/Feature'
import { CategoryChapter } from '../components/home/CategoryChapter'
import { TerritorySection } from '../components/home/TerritorySection'
import { BrandStory } from '../components/home/BrandStory'
import { CatalogShowcase } from '../components/home/CatalogShowcase'
import { Pillars } from '../components/home/Pillars'
import { FinalCta } from '../components/home/FinalCta'
import { CursorLabel } from '../components/ui/CursorLabel'
import { cheese, salumi } from '../content/site'
import { company } from '../content/company'
import { SITE_NAME, SITE_URL, useDocumentMeta } from '../lib/seo'
import '../styles/home.css'

const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.legalName,
  brand: [{ '@type': 'Brand', name: company.brand }, { '@type': 'Brand', name: company.ownBrand }],
  url: SITE_URL,
  logo: `${SITE_URL}/brand/favicon-512.png`,
  email: company.emails[0].address,
  telephone: company.phones[0].display,
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.address.street,
    postalCode: company.address.postalCode,
    addressLocality: company.address.city,
    addressCountry: 'IT',
  },
}

/**
 * Each below-the-fold section is its own Suspense boundary. Nothing suspends: the
 * boundaries enable React 18 selective hydration, which hydrates the pre-rendered page in
 * separate, yielding tasks instead of one long main-thread task.
 */
const Island = ({ children }: { children: ReactNode }) => <Suspense fallback={null}>{children}</Suspense>

export default function Home() {
  useDocumentMeta({
    title: SITE_NAME,
    description:
      'Noi, la qualità seleziona eccellenze gastronomiche italiane: pasta, riso, salumi, formaggi, miele, conserve, specialità di mare, tartufi e liquori. Sfoglia il catalogo prodotti 2026.',
    path: '/',
    jsonLd: [orgLd],
  })

  return (
    <div className="home">
      <Hero />
      <Ribbon />
      <CategoryRail />
      <Island>
        <Showcase />
      </Island>
      <Island>
        <PastaJourney />
      </Island>
      <Island>
        <Feature
          slug="formaggi"
          theme="stone"
          copy={cheese}
          featuredId="nqf903"
          railIds={['nqf905', 'nqf908', 'nqf907', 'nqf904', 'nqf906', 'nqf902', 'nqf911', 'nqf918', 'nqf923', 'nqf924', 'glq009', 'nqtr1704', 'nqtr1715', 'nqtr1720f', 'nqtr1731']}
          image="cheese-cellar"
          imageAlt="Forme di formaggio a stagionare su assi di legno"
          secondImage="cheese-stack"
          secondAlt="Forme di formaggio impilate"
        />
      </Island>
      <Island>
        <Feature
          slug="salumi"
          theme="terracotta"
          copy={salumi}
          featuredId="nqs403"
          railIds={['nqs401', 'nqs402', 'nqs404', 'nqs405', 'nqs406', 'nqs407', 'nqs421', 'nqr100', 'nqs421-prosciutto', 'nqp501', 'nqp502', 'nqp503', 'nqp504']}
          image="salumi-hanging"
          imageAlt="Prosciutti appesi a stagionare"
          secondImage="salumi-board"
          secondAlt="Salumi affettati su tagliere"
        />
      </Island>
      <Island>
        <CategoryChapter slug="riso" mark="Sprout" pick={['nqra1101', 'nqra1102', 'nqra1109', 'nqra1111']} />
      </Island>
      <Island>
        <CategoryChapter
          slug="miele"
          mark="Hexagon"
          flip
          layout="index"
          indexImage={{ src: '/images/products/p23-miele-clean-480.webp', alt: 'Vasetti della linea miele (fotografia di gamma dal catalogo, p. 23)' }}
        />
      </Island>
      <Island>
        <CategoryChapter slug="conserve" mark="Leaf" pick={['nqc1404', 'nqc1429', 'nqc1426', 'glq006']} />
      </Island>
      <Island>
        <CategoryChapter slug="tonno" mark="Fish" flip pick={['nqg301', 'nqg310', 'nqg309', 'nqg304']} />
      </Island>
      <Island>
        <CategoryChapter slug="tartufi" mark="TreeDeciduous" pick={['nqmt1301', 'nqmt1310', 'nqmt1317', 'nqmt1324']} />
      </Island>
      <Island>
        <TerritorySection />
      </Island>
      <Island>
        <BrandStory />
      </Island>
      <Island>
        <CatalogShowcase />
      </Island>
      <Island>
        <Pillars />
      </Island>
      <Island>
        <FinalCta />
      </Island>
      <CursorLabel />
    </div>
  )
}
