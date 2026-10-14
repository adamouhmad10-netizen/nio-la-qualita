import { useRef } from 'react'
import { MapPinned, SearchCheck, Stamp, Wheat, type LucideIcon } from 'lucide-react'
import { pillars } from '../../content/site'
import { useReveal } from '../../lib/useReveal'

/** Lucide marks for the four pillars (same library and stroke system as all site icons). */
const MARKS: Record<string, LucideIcon> = {
  selezione: SearchCheck, // ogni referenza verificata sul catalogo
  tradizione: Wheat, // formati e ricette della tradizione
  territorio: MapPinned, // luoghi citati nel catalogo
  identita: Stamp, // il marchio Golosaqualità
}

export function Pillars() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  return (
    <section ref={root} className="section pillars" aria-labelledby="pillars-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow" data-reveal>
            La nostra filosofia
          </p>
          <h2 id="pillars-title" data-reveal>
            Quattro parole, <em>un solo impegno.</em>
          </h2>
        </div>
        <ol className="pillars__list" role="list">
          {pillars.map((p, i) => {
            const Mark = MARKS[p.id]
            return (
              <li key={p.id} className="pillars__item" data-reveal data-reveal-delay={i * 0.08}>
                <span className="pillars__mark">
                  <Mark aria-hidden="true" />
                </span>
                <span className="pillars__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
