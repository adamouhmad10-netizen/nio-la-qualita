import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { brandStory } from '../../content/site'
import { EditorialImg } from '../ui/Img'
import { GolosaLogo } from '../ui/Logo'
import { useReveal } from '../../lib/useReveal'
import { BrandStrokes } from './Illustrations'

export function BrandStory() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  return (
    <section ref={root} className="section story" aria-labelledby="story-title">
      <div className="container story__grid">
        <figure className="story__media" data-reveal="image">
          <EditorialImg
            name="pdf-cover-photo"
            alt="Cantina a volta con salumi, formaggi, conserve e confezioni di pasta Golosaqualità (fotografia della copertina del catalogo)"
            sizes="(max-width: 900px) 100vw, 55vw"
          />
          <figcaption>Dalla copertina del Catalogo prodotti 2026</figcaption>
        </figure>
        <div className="story__copy">
          <BrandStrokes className="story__strokes" />
          <p className="eyebrow" data-reveal>
            {brandStory.eyebrow}
          </p>
          <h2 id="story-title" data-reveal="lines">
            <span className="reveal-line">
              <span>La qualità è</span>
            </span>
            <span className="reveal-line">
              <span>
                <em>una scelta quotidiana.</em>
              </span>
            </span>
          </h2>
          {brandStory.paragraphs.map((p, i) => (
            <p key={i} className="lead" data-reveal>
              {p}
            </p>
          ))}
          <div className="story__brand" data-reveal>
            <GolosaLogo />
          </div>
          <Link to="/azienda" className="btn" data-reveal>
            {brandStory.cta} <ArrowRight className="arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
