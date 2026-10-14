/**
 * Image URL helpers. All imagery is stored locally under /public/images:
 *   products/<key>-{480,960}.webp      cropped from the client PDF
 *   editorial/<key>-{640,1280,2000}.webp  licensed photography + PDF lifestyle shots
 *   catalog/page-NN-{360,1400}.webp     rendered PDF pages for the viewer
 * In WordPress these become attachment URLs; only this file needs to change.
 */
const BASE = '/images'

export const editorialSrc = (key: string, w: 640 | 1280 | 2000 = 1280) => `${BASE}/editorial/${key}-${w}.webp`
export const editorialSrcSet = (key: string, widths: number[] = [640, 1280, 2000]) =>
  widths.map((w) => `${BASE}/editorial/${key}-${w}.webp ${w}w`).join(', ')

/** Product image keys may point to the editorial folder with an `editorial/` prefix. */
export function productSrc(key: string, size: 'sm' | 'lg' = 'sm') {
  if (key.startsWith('editorial/')) return editorialSrc(key.slice(10), size === 'sm' ? 640 : 1280)
  return `${BASE}/products/${key}-${size === 'sm' ? 480 : 960}.webp`
}
export function productSrcSet(key: string) {
  if (key.startsWith('editorial/')) {
    const k = key.slice(10)
    return `${editorialSrc(k, 640)} 640w, ${editorialSrc(k, 1280)} 1280w`
  }
  return `${BASE}/products/${key}-480.webp 480w, ${BASE}/products/${key}-960.webp 960w`
}

export const catalogPageSrc = (page: number, size: 'thumb' | 'mid' | 'full' = 'full') =>
  `${BASE}/catalog/page-${String(page).padStart(2, '0')}-${size === 'thumb' ? 360 : size === 'mid' ? 800 : 1400}.webp`
export const catalogPageSrcSet = (page: number) => `${catalogPageSrc(page, 'mid')} 800w, ${catalogPageSrc(page, 'full')} 1400w`

export const CATALOG_PAGES = 32
export const CATALOG_PDF = '/catalogo/Catalogo-Noi-la-qualita-2026.pdf'
export const CATALOG_PDF_SIZE = '63 MB'
