/**
 * Home "Selezione" showcase — editorial curation of one product per family.
 * Product facts come from data/products.ts via `productId`. `line` is either a verbatim
 * quote from the catalogue (`quoted: true`) or a sentence derived from catalogue data.
 */
import type { IllustrationName } from '../components/home/Illustrations'

export interface Slide {
  productId: string
  /** Cut-out image key in /public/images/products (soft-matted from the PDF crop). */
  cutout: string
  word: string
  tone: string
  ink: string
  accent: string
  line: string
  quoted?: boolean
  floaters: IllustrationName[]
}

export const slides: Slide[] = [
  {
    productId: 'nqe213', cutout: 'cut-p4-nqe213', word: 'Pasta',
    tone: '#EFD9A7', ink: '#2F220B', accent: '#9C6B12',
    line: 'Paccheri in confezione da 500 g, tra i sedici formati classici del catalogo.',
    floaters: ['Wheat', 'Sprout', 'Wheat'],
  },
  {
    productId: 'nqf905', cutout: 'p13-vinaccia-clean', word: 'Formaggi',
    tone: '#E6DCC7', ink: '#2E2618', accent: '#7D2F45',
    line: 'Latte, siero innesto, sale, caglio. Affinato in vinacce d’uva nera.', quoted: true,
    floaters: ['Milk', 'Grape', 'Leaf'],
  },
  {
    productId: 'nqp503', cutout: 'cut-p12-nqp503', word: 'Salumi',
    tone: '#E7B9A0', ink: '#3A140C', accent: '#8E2F1F',
    line: 'Il Prosciutto San Daniele Prolongo disossato e confezionato si conserva in frigorifero fino a 6 mesi.', quoted: true,
    floaters: ['Ham', 'Leaf', 'Sprout'],
  },
  {
    productId: 'nqra1101', cutout: 'cut-p8-nqra1101', word: 'Riso',
    tone: '#DCE3CF', ink: '#1F2A18', accent: '#5D7140',
    line: 'Riso Carnaroli nei formati da 1 kg e da 500 g.',
    floaters: ['Sprout', 'Droplets', 'Wheat'],
  },
  {
    productId: 'nqaf001', cutout: 'p23-miele-clean', word: 'Miele',
    tone: '#F2C15B', ink: '#2E1B02', accent: '#8A4E05',
    line: 'Sei mieli italiani — ailanto, castagno, erica, millefiori, sulla e macchia mediterranea — da 45 g a 1000 g.',
    floaters: ['Hexagon', 'Droplet', 'Flower2'],
  },
  {
    productId: 'nqc1404', cutout: 'cut-p24-g0', word: 'Conserve',
    tone: '#D7DDB7', ink: '#232A10', accent: '#B8452A',
    line: 'Carciofi arrostiti all’olio in vasetto da 580 g, 1062 g e 3100 g.',
    floaters: ['Leaf', 'Sprout', 'Droplet'],
  },
  {
    productId: 'nqg301', cutout: 'cut-p26-g2', word: 'Mare',
    tone: '#BFDCE2', ink: '#0B2B3D', accent: '#0E5E7E',
    line: 'Pescato nel Mar Mediterraneo […] conservato in pregiato olio di oliva e tagliato artigianalmente in filetti.', quoted: true,
    floaters: ['Fish', 'Waves', 'Shell'],
  },
  {
    productId: 'nqmt1317', cutout: 'cut-p27-g4', word: 'Tartufi',
    tone: '#E4DACB', ink: '#221A12', accent: '#6E5532',
    line: 'Olio 95%, tartufo bianchetto e tartufo estivo, origine Italia — dagli ingredienti indicati nel catalogo.',
    floaters: ['TreeDeciduous', 'Leaf', 'Sprout'],
  },
]
