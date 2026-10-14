/**
 * Decorative food motifs (slider floaters, chapter corner marks) and the logo-derived
 * brand strokes.
 *
 * Motifs are Lucide icons (ISC licence, tree-shaken) — the same library as every UI icon
 * on the site — rendered with a fine, non-scaling stroke (see `.motif` in base.css) so
 * they read as delicate line illustrations at any size. Each maps to something the
 * catalogue itself mentions for that product family.
 */
import {
  Droplet,
  Droplets,
  Fish,
  Flower2,
  Grape,
  Ham,
  Hexagon,
  Leaf,
  Milk,
  Shell,
  Sprout,
  TreeDeciduous,
  Waves,
  Wheat,
  type LucideIcon,
} from 'lucide-react'

export const ILLUSTRATIONS = {
  Wheat, // pasta di semola, riso
  Sprout, // risaia, verdure, tartufaia
  Leaf, // foglie, erbe, sottoli
  Droplet, // miele, olio
  Droplets, // acqua della risaia
  Grape, // vinacce d’uva nera
  Milk, // latte (formaggi)
  Ham, // salumi
  Hexagon, // favo (miele)
  Flower2, // millefiori
  Waves, // mare
  Fish, // tonno
  Shell, // specialità di mare
  TreeDeciduous, // bosco (tartufi)
} satisfies Record<string, LucideIcon>

export type IllustrationName = keyof typeof ILLUSTRATIONS

/** Brand accent: two flowing strokes, after the logo's teal and gold bands (brand artwork, not an icon). */
export function BrandStrokes({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 160" className={className} aria-hidden="true">
      <path d="M8 70 C90 74 140 60 200 26 C240 4 280 6 330 6" fill="none" stroke="var(--c-teal)" strokeWidth="16" strokeLinecap="round" />
      <path d="M8 106 C80 106 120 98 170 72" fill="none" stroke="var(--c-teal)" strokeWidth="16" strokeLinecap="round" />
      <path d="M250 112 C300 86 340 74 412 72" fill="none" stroke="var(--c-gold)" strokeWidth="16" strokeLinecap="round" />
      <path d="M210 152 C280 150 320 134 360 110 C384 98 400 98 412 98" fill="none" stroke="var(--c-gold)" strokeWidth="16" strokeLinecap="round" />
    </svg>
  )
}
