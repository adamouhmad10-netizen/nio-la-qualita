/**
 * Content model for the Noi, la qualità catalogue.
 *
 * Every product record originates from the client PDF `Catalogo_Linkato_10-9.pdf`
 * (Catalogo Prodotti 2026). The model is intentionally close to what WordPress will
 * expose in phase two (see docs/WORDPRESS_MIGRATION.md):
 *   ProductFamily  -> custom post type `nlq_product`
 *   Variant        -> repeater field `variants` (code, size, label)
 *   Category       -> taxonomy `nlq_category`
 *   subcategory    -> child term of `nlq_category`
 */

export type Locale = 'it' | 'en'

/** Localised text. Italian is the source language; English is filled in a later phase. */
export type L10n = { it: string; en?: string }

export type CategorySlug =
  | 'pasta'
  | 'riso'
  | 'salumi'
  | 'formaggi'
  | 'miele'
  | 'conserve'
  | 'tonno'
  | 'tartufi'
  | 'doppio-senso'
  | 'alcolici'

/**
 * How faithfully an image represents the product.
 * - exact:  the catalogue shows this image specifically for this product
 * - family: one catalogue image shared by every size of the same product
 * - range:  one catalogue image shared by several different products (e.g. the honey line)
 */
export type ImageScope = 'exact' | 'family' | 'range'

export interface ProductImage {
  /** Key of the generated asset in /public/images/products, without size suffix. */
  key: string
  scope: ImageScope
  /** Source PDF page the image was cropped from. */
  page: number
  alt: L10n
}

export interface Variant {
  /** Catalogue code exactly as printed (whitespace normalised, e.g. "GLQ 006" -> "GLQ006"). */
  code: string
  /** Pack size / weight exactly as printed, normalised for display only. */
  size?: string
  /** Distinguishing label when variants differ by more than size (e.g. "24 mesi con osso"). */
  label?: string
  sourcePage: number
}

export interface Detail {
  label: L10n
  value: L10n
}

export type Verification = 'verified' | 'partial' | 'ambiguous'

export interface ProductFamily {
  /** Stable identifier, derived from the first catalogue code. Never changes. */
  id: string
  slug: string
  /** Name exactly as printed in the PDF (usually upper case). */
  sourceName: string
  /** Optional display override when automatic casing would be wrong. */
  displayName?: string
  category: CategorySlug
  subcategory?: string
  variants: Variant[]
  /** Verbatim catalogue description. */
  description?: L10n
  /** Verbatim ingredients line, when the catalogue states one. */
  ingredients?: L10n
  /** Additional source-backed attributes (stagionatura, denominazione, gradazione…). */
  details?: Detail[]
  /** Origin only when the catalogue explicitly states it. */
  origin?: L10n
  /** Producer only when named in catalogue text. */
  producer?: string
  images: ProductImage[]
  sourcePages: number[]
  /** Position in the printed catalogue (used for "Ordine catalogo" sorting). */
  catalogOrder: number
  verification: Verification
  /** Ambiguities, truncations or discrepancies found in the source. */
  notes?: string[]
}

export interface CategoryArt {
  /** Background / environment tone of the category chapter. */
  tone: string
  /** Foreground / ink colour used on top of `tone`. */
  ink: string
  /** Accent used for small details (rules, labels). */
  accent: string
  /** Editorial photograph key in /public/images/editorial (without size suffix). */
  heroImage: string
  heroAlt: L10n
  /** Secondary editorial images. */
  gallery: { key: string; alt: L10n }[]
}

export interface Category {
  slug: CategorySlug
  order: number
  name: L10n
  /** Heading as printed in the catalogue index (p. 2). */
  sourceHeading: string
  /** Short editorial line — creative copy, not a product claim. */
  tagline: L10n
  /** Longer editorial introduction — creative copy, kept free of factual claims. */
  intro: L10n
  /** Source-backed note, quoted from the PDF, when one exists. */
  sourceNote?: L10n
  sourcePages: number[]
  art: CategoryArt
  /** True for alcoholic beverages: triggers the adult-audience notice. */
  adultsOnly?: boolean
}

export interface SourceMention {
  id: string
  /** Place name as it appears in the catalogue. */
  name: string
  /** Broader area, only when the catalogue text itself states it. */
  area?: string
  /** Verbatim quote proving the mention. */
  quote: L10n
  page: number
  /** Families whose source text or name contains the mention. */
  productIds: string[]
}

export interface Territory {
  id: string
  name: L10n
  /** Editorial, non-product copy about the landscape. */
  text: L10n
  image: string
  imageAlt: L10n
}
