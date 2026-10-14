import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { finalCta } from '../../content/site'
import { useReveal } from '../../lib/useReveal'
import { BrandStrokes } from './Illustrations'

export function FinalCta() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  return (
    <section ref={root} className="final-cta on-dark" data-surface="dark" aria-labelledby="final-title">
      <BrandStrokes className="final-cta__strokes" />
      <span className="final-cta__sphere" aria-hidden="true" />
      <div className="container final-cta__inner">
        <p className="eyebrow" data-reveal>
          {finalCta.eyebrow}
        </p>
        <h2 id="final-title" data-reveal="lines">
          <span className="reveal-line">
            <span>Portiamo l’eccellenza italiana</span>
          </span>
          <span className="reveal-line">
            <span>
              <em>più lontano.</em>
            </span>
          </span>
        </h2>
        <p className="lead" data-reveal>
          {finalCta.text}
        </p>
        <div className="final-cta__actions" data-reveal>
          <Link to="/contatti" className="btn btn--gold">
            {finalCta.primary} <ArrowRight className="arrow" aria-hidden="true" />
          </Link>
          <Link to="/contatti?richiesta=catalogo" className="btn btn--ghost">
            {finalCta.secondary}
          </Link>
        </div>
      </div>
    </section>
  )
}
