import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { CategorySlug, ProductFamily } from '../../data/types'
import { products } from '../../data/products'
import { categories, categoryBySlug, isCategorySlug } from '../../data/categories'
import { normalizeQuery, productDisplayName } from '../../lib/text'
import { ProductCard } from '../ui/ProductCard'
import { EmptyState } from '../ui/EmptyState'
import { tr, ui } from '../../i18n'
import { useHydratedSearchParams } from '../../lib/hydration'

type Sort = 'catalogo' | 'az' | 'za'
const PAGE = 36

/** Pre-computed search haystack per product (name, codes, category, subcategory, sizes). */
const haystack = new Map<string, string>(
  products.map((p) => [
    p.id,
    normalizeQuery(
      [
        p.sourceName,
        productDisplayName(p.sourceName, p.displayName),
        p.subcategory ?? '',
        tr(categoryBySlug.get(p.category)!.name),
        ...p.variants.flatMap((v) => [v.code, v.size ?? '', v.label ?? '']),
      ].join(' '),
    ),
  ]),
)

interface Props {
  /** Lock the browser to one category (category pages). */
  fixedCategory?: CategorySlug
}

export function ProductBrowser({ fixedCategory }: Props) {
  const [params, setParams] = useHydratedSearchParams()
  const searchId = useId()
  const sortId = useId()
  const q = params.get('q') ?? ''
  const catParam = params.get('categoria') ?? undefined
  const category: CategorySlug | undefined = fixedCategory ?? (isCategorySlug(catParam) ? catParam : undefined)
  const sub = params.get('tipo') ?? ''
  const sort = (['catalogo', 'az', 'za'].includes(params.get('ordine') ?? '') ? params.get('ordine') : 'catalogo') as Sort
  const [query, setQuery] = useState(q)
  const [visible, setVisible] = useState(PAGE)
  const resultsRef = useRef<HTMLDivElement>(null)
  const focusFrom = useRef<number | null>(null)

  // After "show more", move focus to the first newly revealed card (keyboard users).
  useEffect(() => {
    if (focusFrom.current === null) return
    const li = resultsRef.current?.querySelectorAll('.product-grid > li')[focusFrom.current]
    li?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true })
    focusFrom.current = null
  }, [visible])

  // Keep the input in sync with history navigation.
  useEffect(() => setQuery(q), [q])

  // Debounced write of the search term to the URL (replace: typing should not flood history).
  useEffect(() => {
    if (query === q) return
    const t = setTimeout(() => update({ q: query || null }, true), 150)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => setVisible(PAGE), [q, category, sub, sort])

  function update(next: Record<string, string | null>, replace = false) {
    const p = new URLSearchParams(params)
    for (const [k, v] of Object.entries(next)) {
      if (v === null || v === '') p.delete(k)
      else p.set(k, v)
    }
    setParams(p, { replace, preventScrollReset: true })
  }

  const scoped = useMemo(() => (category ? products.filter((p) => p.category === category) : products), [category])

  const subcategories = useMemo(() => {
    if (!category) return []
    return Array.from(new Set(scoped.map((p) => p.subcategory).filter(Boolean))) as string[]
  }, [scoped, category])

  const results = useMemo(() => {
    const nq = normalizeQuery(q)
    const terms = nq.split(' ').filter(Boolean)
    let list: ProductFamily[] = scoped
    if (sub) list = list.filter((p) => p.subcategory === sub)
    if (terms.length) list = list.filter((p) => terms.every((t) => haystack.get(p.id)!.includes(t)))
    const name = (p: ProductFamily) => productDisplayName(p.sourceName, p.displayName)
    if (sort === 'az') list = [...list].sort((a, b) => name(a).localeCompare(name(b), 'it'))
    else if (sort === 'za') list = [...list].sort((a, b) => name(b).localeCompare(name(a), 'it'))
    return list
  }, [scoped, sub, q, sort])

  const codeCount = results.reduce((n, p) => n + p.variants.length, 0)
  const filtersActive = !!(q || sub || (!fixedCategory && category) || sort !== 'catalogo')

  const reset = () => {
    setQuery('')
    const p = new URLSearchParams()
    setParams(p, { preventScrollReset: true })
  }

  return (
    <div className="browser">
      <div className="browser__bar">
        <div className="browser__search">
          <label htmlFor={searchId} className="visually-hidden">
            {ui.catalog.search}
          </label>
          <Search aria-hidden="true" />
          <input
            id={searchId}
            type="search"
            value={query}
            placeholder={ui.catalog.search}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
          />
          {query && (
            <button type="button" className="browser__clear" onClick={() => setQuery('')} aria-label="Cancella ricerca">
              <X />
            </button>
          )}
        </div>
        <div className="browser__sort">
          <label htmlFor={sortId}>{ui.catalog.sort}</label>
          <select id={sortId} value={sort} onChange={(e) => update({ ordine: e.target.value === 'catalogo' ? null : e.target.value })}>
            <option value="catalogo">{ui.catalog.sortCatalog}</option>
            <option value="az">{ui.catalog.sortAz}</option>
            <option value="za">{ui.catalog.sortZa}</option>
          </select>
        </div>
      </div>

      {!fixedCategory && (
        <div className="chips" role="group" aria-label="Categoria">
          <button type="button" className="chip" aria-pressed={!category} onClick={() => update({ categoria: null, tipo: null })}>
            {ui.catalog.all}
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              className="chip"
              aria-pressed={category === c.slug}
              onClick={() => update({ categoria: category === c.slug ? null : c.slug, tipo: null })}
            >
              {tr(c.name)}
            </button>
          ))}
        </div>
      )}

      {subcategories.length > 1 && (
        <div className="chips chips--sub" role="group" aria-label="Tipologia">
          <button type="button" className="chip chip--sub" aria-pressed={!sub} onClick={() => update({ tipo: null })}>
            {ui.catalog.allSub}
          </button>
          {subcategories.map((s) => (
            <button key={s} type="button" className="chip chip--sub" aria-pressed={sub === s} onClick={() => update({ tipo: sub === s ? null : s })}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="browser__status">
        <p aria-live="polite" aria-atomic="true">
          <strong>{ui.catalog.results(results.length)}</strong>
          <span className="muted"> · {ui.catalog.codes(codeCount)}</span>
          {q && (
            <span className="muted">
              {' '}
              per “<mark>{q}</mark>”
            </span>
          )}
        </p>
        {filtersActive && (
          <button type="button" className="link-arrow" onClick={reset}>
            <X aria-hidden="true" /> {ui.catalog.reset}
          </button>
        )}
      </div>

      <div ref={resultsRef}>
        {results.length === 0 ? (
          <EmptyState
            title={ui.catalog.empty}
            text={ui.catalog.emptyHint}
            action={
              <button type="button" className="btn btn--small" onClick={reset}>
                {ui.catalog.reset}
              </button>
            }
          />
        ) : (
          <>
            <h2 className="visually-hidden">Elenco dei prodotti</h2>
            <ul className="product-grid" role="list">
              {results.slice(0, visible).map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} showCategory={!category} sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw" />
                </li>
              ))}
            </ul>
            {visible < results.length && (
              <div className="browser__more">
                <p className="muted">
                  {Math.min(visible, results.length)} di {results.length}
                </p>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    focusFrom.current = visible
                    setVisible((v) => v + PAGE)
                  }}
                >
                  {ui.catalog.showMore}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
