import { Info } from 'lucide-react'

/** Informational notice for alcoholic beverages. No purchase flow exists on the site. */
export function AdultNotice({ compact }: { compact?: boolean }) {
  return (
    <aside className={`adult-notice${compact ? ' adult-notice--compact' : ''}`} aria-label="Avviso bevande alcoliche">
      <Info aria-hidden="true" />
      <p>
        Contenuti dedicati a un pubblico maggiorenne. Le schede hanno finalità informativa per operatori e clienti: il
        sito non prevede la vendita online. Bevi responsabilmente.
      </p>
    </aside>
  )
}
