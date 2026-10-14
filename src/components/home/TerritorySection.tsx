import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { territory } from '../../content/site'
import { sourceMentions, territories } from '../../data/regions'
import { EditorialImg } from '../ui/Img'
import { useReveal } from '../../lib/useReveal'
import { tr } from '../../i18n'

export function TerritorySection() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  const shown = territories.slice(0, 5)
  return (
    <section ref={root} id="territori" className="section territory" aria-labelledby="terr-title">
      <div className="container territory__head">
        <p className="eyebrow" data-reveal>
          {territory.eyebrow}
        </p>
        <h2 id="terr-title" data-reveal="lines">
          <span className="reveal-line">
            <span>L’Italia,</span>
          </span>
          <span className="reveal-line">
            <span>
              <em>una terra di eccellenze.</em>
            </span>
          </span>
        </h2>
        <p className="lead" data-reveal>
          {territory.text}
        </p>
      </div>

      <div className="container territory__collage">
        {shown.map((t, i) => (
          <figure key={t.id} className={`territory__tile territory__tile--${i + 1}`} data-reveal="image">
            <EditorialImg name={t.image} alt={tr(t.imageAlt)} sizes="(max-width: 700px) 90vw, 40vw" />
            <figcaption>
              <span>{tr(t.name)}</span>
              {tr(t.text)}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="container territory__mentions" data-reveal>
        <p className="territory__mentions-title">Luoghi citati nel catalogo</p>
        <ul role="list">
          {sourceMentions.map((m) => (
            <li key={m.id}>
              <Link to={`/territori#${m.id}`}>{m.name}</Link>
            </li>
          ))}
        </ul>
        <Link to="/territori" className="link-arrow">
          Scopri i territori <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
