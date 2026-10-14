import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { categories } from '../../data/categories'
import { CategoryCard } from '../ui/CategoryCard'
import { RailControls } from '../ui/RailControls'
import { useRail } from '../../lib/useRail'
import { useReveal } from '../../lib/useReveal'

export function CategoryRail() {
  const { ref: railRef, ...rail } = useRail<HTMLUListElement>()
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  return (
    <section ref={root} id="categorie" className="section cat-rail" aria-labelledby="cat-title">
      <div className="container section-head section-head--split">
        <div>
          <p className="eyebrow" data-reveal>
            Dieci famiglie di prodotti
          </p>
          <h2 id="cat-title" data-reveal="lines">
            <span className="reveal-line">
              <span>Le nostre</span>
            </span>
            <span className="reveal-line">
              <span>
                <em>categorie</em>
              </span>
            </span>
          </h2>
        </div>
        <div className="cat-rail__aside" data-reveal>
          <RailControls {...rail} label="le categorie" />
          <Link to="/prodotti" className="link-arrow">
            Tutti i prodotti <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
      <ul ref={railRef} className="rail cat-rail__list" role="list">
        {categories.map((c, i) => (
          <li key={c.slug}>
            <CategoryCard category={c} index={i} />
          </li>
        ))}
      </ul>
    </section>
  )
}
