/** Text helpers shared by data and UI. Pure functions, no React. */

export const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’'“”"]/g, ' ')
    .replace(/%/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const SMALL = new Set(['di', 'del', 'della', 'dei', 'e', 'a', 'al', 'alla', 'allo', 'ai', 'in', 'con', 'per', 'da', 'o'])
const KEEP_UPPER = new Set(['BIO', 'VS', 'CRU', 'UE', 'V'])
const ELISION_SMALL = new Set(['all', 'dell', 'nell', 'sull'])

const cap = (w: string) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w)

/**
 * Turns an upper-case catalogue name into readable Italian title case:
 * "CARCIOFI ARROSTITI ALL’OLIO" -> "Carciofi arrostiti all’olio".
 * Italian convention: only the first word (and proper names, which we cannot detect
 * reliably) is capitalised, so we use sentence case with a few safe exceptions.
 */
export function displayCase(source: string): string {
  const words = source.trim().split(/\s+/)
  return words
    .map((raw, i) => {
      if (KEEP_UPPER.has(raw)) return raw
      const lower = raw.toLocaleLowerCase('it-IT')
      // Elided prefixes: L’AMBASCIATRICE -> L’Ambasciatrice, ALL’OLIO -> all’olio
      const m = lower.match(/^([“"]?)([a-zà-ù]+)([’'])(.+)$/)
      if (m) {
        const [, q, pre, apos, rest] = m
        if (i === 0) return `${q}${cap(pre)}${apos}${cap(rest)}`
        return ELISION_SMALL.has(pre) ? `${q}${pre}${apos}${rest}` : `${q}${pre}${apos}${cap(rest)}`
      }
      if (i === 0) return lower.replace(/^([“"]?)(\p{L})/u, (_, q, c) => q + c.toUpperCase())
      if (SMALL.has(lower)) return lower
      return lower
    })
    .join(' ')
}

/** Proper nouns that sentence case would otherwise flatten. */
const PROPER = [
  'Campofilone', 'Carnaroli', 'Arborio', 'Baldo', 'Roma', 'Grancavour', 'Rubinum', 'Ebano',
  'Strolghino', 'Mariola', 'Parma', 'San Daniele', 'Golosa Qualità', 'Castro', 'Giglio', 'Don Carmelo',
  'Ducato', 'Granducato', 'Giulia', 'Rosetta', 'Piradoro', 'Pira', 'Poggio Conte', 'Conte', 'Super Tomato Reale',
  'Ovale', 'Bianca Verde', 'Regina Bianca', 'Creto', 'Qualitoso', 'Innominato', 'Fiore', 'Aromatico', 'Fienile',
  'Nocino', 'Ceriatoso', 'Fruttato', 'Superlativo', 'Maxi', 'Italia', 'Mediterraneo', 'Sulla',
  'San Marzano', 'Toscana', 'Chianti', 'Brunello', 'Morellino', 'Moscato', 'Etrusco', 'Torre', 'Fondatore',
  'Centenario', 'Vario Genere', 'Caraibi', 'Iris', 'Blu Dolce', 'Miele Farro', 'Riserva', 'Doppio Senso', 'Gustoso',
  'Gran', 'Regina',
]

// Compiled once: one alternation for all proper nouns (longest first so "San Daniele" wins over "Daniele").
const PROPER_RE = new RegExp(
  `(^|[\\s’“"])(${[...PROPER]
    .sort((a, b) => b.length - a.length)
    .map((p) => p.toLocaleLowerCase('it-IT').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')})(?=$|[\\s,”"])`,
  'giu',
)
const PROPER_BY_LOWER = new Map(PROPER.map((p) => [p.toLocaleLowerCase('it-IT'), p]))
const displayCache = new Map<string, string>()

export function productDisplayName(sourceName: string, override?: string) {
  if (override) return override
  const cached = displayCache.get(sourceName)
  if (cached) return cached
  let s = displayCase(sourceName)
  // Repeat once so adjacent proper nouns sharing a separator are both matched.
  for (let i = 0; i < 2; i++) s = s.replace(PROPER_RE, (_, pre, word) => pre + (PROPER_BY_LOWER.get(word.toLocaleLowerCase('it-IT')) ?? word))
  const out = s.charAt(0).toUpperCase() + s.slice(1)
  displayCache.set(sourceName, out)
  return out
}

export const normalizeQuery = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’'“”"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const pluralize = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`
