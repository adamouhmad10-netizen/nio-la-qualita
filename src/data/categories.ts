/**
 * Catalogue categories, in the order of the printed index (PDF p. 2).
 *
 * `name`, `sourceHeading` and `sourceNote` are source-backed.
 * `tagline` and `intro` are editorial copy written for the website: they describe
 * the category in general terms and make no claims about specific products.
 */
import type { Category, CategorySlug } from './types'

const it = (s: string) => ({ it: s })

export const categories: Category[] = [
  {
    slug: 'pasta',
    order: 1,
    name: it('Pasta'),
    sourceHeading: 'VARIETÀ DI PASTA',
    tagline: it('Ogni formato racconta una storia.'),
    intro: it(
      'Dai formati classici alle sfoglie di Campofilone, fino alle linee integrali e al farro monococco: una collezione pensata per la tavola di ogni giorno e per le occasioni speciali.',
    ),
    sourcePages: [3, 4, 5, 6, 7],
    art: {
      tone: '#F2E5C6',
      ink: '#33260F',
      accent: '#B9862A',
      heroImage: 'pasta-nests',
      heroAlt: it('Nidi di pasta all’uovo fresca su un piano infarinato'),
      gallery: [
        { key: 'pdf-pasta-strands', alt: it('Pasta lunga stesa ad asciugare (fotografia del catalogo)') },
        { key: 'pasta-rigatoni', alt: it('Rigatoni secchi in primo piano') },
        { key: 'pasta-hands', alt: it('Mani che sollevano pasta fresca') },
      ],
    },
  },
  {
    slug: 'riso',
    order: 2,
    name: it('Riso'),
    sourceHeading: 'VARIETÀ DI RISO',
    tagline: it('Chicchi scelti per il risotto e oltre.'),
    intro: it(
      'Varietà classiche come Carnaroli, Arborio, Baldo e Roma accanto a risi integrali e colorati: undici referenze nei formati da 1 kg e 500 g.',
    ),
    sourcePages: [8],
    art: {
      tone: '#ECE7DB',
      ink: '#26301F',
      accent: '#7E8C55',
      heroImage: 'riso-risotto',
      heroAlt: it('Risotto ai funghi servito in un piatto a righe'),
      gallery: [{ key: 'riso-grains', alt: it('Chicchi di riso crudo in primo piano') }],
    },
  },
  {
    slug: 'salumi',
    order: 3,
    name: it('Salumi'),
    sourceHeading: 'VARIETÀ DI SALUMI',
    tagline: it('Il tempo, il sale, la mano dell’uomo.'),
    intro: it(
      'Salami, cotti, lardo e una selezione di prosciutti: dalla Mortadella con pistacchi ai prosciutti di Parma e San Daniele, ogni scheda riporta lavorazione e pezzatura indicate nel catalogo.',
    ),
    sourcePages: [9, 10, 11, 12],
    art: {
      tone: '#7E3324',
      ink: '#FBEDE3',
      accent: '#E9B48C',
      heroImage: 'salumi-hanging',
      heroAlt: it('Prosciutti appesi a stagionare in una bottega'),
      gallery: [
        { key: 'salumi-board', alt: it('Salumi affettati su un tagliere di legno') },
        { key: 'salumi-slicing', alt: it('Taglio a mano di un prosciutto') },
      ],
    },
  },
  {
    slug: 'formaggi',
    order: 4,
    name: it('Formaggi'),
    sourceHeading: 'VARIETÀ DI FORMAGGI',
    tagline: it('L’arte del formaggio italiano.'),
    intro: it(
      'Caciocavalli, pecorini, caciotte, erborinati e formaggi affinati: latte di pecora, di capra e vaccino in una selezione ampia, con ingredienti e stagionature riportati per ogni forma.',
    ),
    sourcePages: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    art: {
      tone: '#ECE4D2',
      ink: '#352D1E',
      accent: '#A88A47',
      heroImage: 'cheese-cellar',
      heroAlt: it('Forme di formaggio a stagionare su assi di legno'),
      gallery: [
        { key: 'cheese-stack', alt: it('Forme di formaggio impilate su un fondo in legno') },
        { key: 'cheese-aging', alt: it('Scaffali di stagionatura con forme di formaggio') },
      ],
    },
  },
  {
    slug: 'miele',
    order: 5,
    name: it('Miele'),
    sourceHeading: 'MIELE',
    tagline: it('Il colore dei fiori, in un vasetto.'),
    intro: it(
      'Ailanto, castagno, erica, millefiori, sulla e macchia mediterranea: sei mieli italiani in più formati, dal piccolo assaggio da 45 g al vasetto da 1000 g.',
    ),
    sourcePages: [23],
    art: {
      tone: '#E3A02E',
      ink: '#2E1B02',
      accent: '#FFF0C4',
      heroImage: 'miele-jar',
      heroAlt: it('Vasetto di miele dorato controluce'),
      gallery: [
        { key: 'miele-comb', alt: it('Favo di miele in primo piano') },
        { key: 'miele-dark', alt: it('Vasetto di miele su fondo scuro') },
      ],
    },
  },
  {
    slug: 'conserve',
    order: 6,
    name: it('Sottoli e conserve'),
    sourceHeading: 'SOTTOLI',
    tagline: it('La dispensa mediterranea.'),
    intro: it(
      'Carciofi, funghi, melanzane, friarelli, peperonata e scarole in vasetti da 580 g fino ai formati da 3100 g, insieme a pomodori pelati San Marzano, passata e pesche allo sciroppo.',
    ),
    sourcePages: [24, 25],
    art: {
      tone: '#55613A',
      ink: '#F6F2E3',
      accent: '#E0613A',
      heroImage: 'conserve-jars',
      heroAlt: it('Vasetti di verdure conservate su un piano di lavoro'),
      gallery: [
        { key: 'conserve-artichokes', alt: it('Carciofi freschi su un tavolo di legno chiaro') },
        { key: 'conserve-tomatoes', alt: it('Pomodori maturi a grappolo') },
      ],
    },
  },
  {
    slug: 'tonno',
    order: 7,
    name: it('Tonno e specialità di mare'),
    sourceHeading: 'TONNO',
    tagline: it('Il Mediterraneo, conservato con cura.'),
    intro: it(
      'Tonno rosso, tonnetto alletterato, filetti di alalunga e colatura di alici: specialità di mare in vasetto, presentate con le descrizioni del catalogo.',
    ),
    sourcePages: [26],
    art: {
      tone: '#0E4766',
      ink: '#EAF4F7',
      accent: '#66C6B5',
      heroImage: 'mare-boats',
      heroAlt: it('Barche da pesca colorate ormeggiate in un porto'),
      gallery: [
        { key: 'mare-anchovies', alt: it('Alici fresche disposte in file') },
        { key: 'mare-sea', alt: it('Mare mediterraneo visto dalla costa') },
      ],
    },
  },
  {
    slug: 'tartufi',
    order: 8,
    name: it('Tartufi e condimenti'),
    sourceHeading: 'TARTUFI',
    tagline: it('Un profumo che cambia il piatto.'),
    intro: it(
      'Creme al tartufo, condimenti a base di burro e olio e briciola di tartufo estivo: referenze in più formati, con ingredienti e origine del tartufo come indicati nel catalogo.',
    ),
    sourcePages: [27],
    art: {
      tone: '#27211B',
      ink: '#EFE8DB',
      accent: '#BFA273',
      heroImage: 'tartufi-black',
      heroAlt: it('Tartufi neri interi su fondo chiaro'),
      gallery: [
        { key: 'tartufi-pasta', alt: it('Tagliatelle con lamelle di tartufo') },
        { key: 'tartufi-forest', alt: it('Bosco autunnale') },
      ],
    },
  },
  {
    slug: 'doppio-senso',
    order: 9,
    name: it('Doppio Senso'),
    sourceHeading: 'DOPPIO SENSO',
    tagline: it('Rum e caramello salato, in sei formati.'),
    intro: it('Il liquore nato dalla collaborazione tra Noi, la qualità e la Distilleria Morelli.'),
    sourceNote: it(
      'Doppio senso nasce dalla collaborazione tra Noi, la Qualità e la rinomata Distilleria Morelli, realtà artigianale italiana che produce alcolici dal 1911.',
    ),
    sourcePages: [28],
    adultsOnly: true,
    art: {
      tone: '#17130F',
      ink: '#FFF6D8',
      accent: '#F3E21C',
      heroImage: 'pdf-doppio-senso',
      heroAlt: it('Bottiglia di Doppio Senso su un tavolo affacciato su un porto (fotografia del catalogo)'),
      gallery: [],
    },
  },
  {
    slug: 'alcolici',
    order: 10,
    name: it('Alcolici'),
    sourceHeading: 'ALCOLICI',
    tagline: it('Grappe, liquori e creme della tradizione toscana.'),
    intro: it(
      'Grappe, amari, liquori, spiriti, gin, rhum, creme e aperitivi della Distilleria Morelli, nei formati indicati nel listino del catalogo.',
    ),
    sourceNote: it(
      'Fondata nel 1911 nel cuore della Valdera dal Cavalier Leonello Morelli, l’azienda nasce come laboratorio artigianale di liquori. Radicata nella tradizione toscana, ha saputo evolversi nel tempo, ampliando la gamma e affermandosi anche a livello internazionale.',
    ),
    sourcePages: [30, 31],
    adultsOnly: true,
    art: {
      tone: '#35201A',
      ink: '#F6EADB',
      accent: '#C99A4A',
      heroImage: 'pdf-morelli-display',
      heroAlt: it('Espositore in legno con bottiglie Morelli (fotografia del catalogo)'),
      gallery: [
        { key: 'pdf-morelli-cru', alt: it('Bottiglia di Grappa del Centenario CRU (fotografia del catalogo)') },
        { key: 'pdf-morelli-box', alt: it('Cassetta in legno con quattro grappe (fotografia del catalogo)') },
        { key: 'alcol-grappa', alt: it('Bicchieri da degustazione su un bancone') },
      ],
    },
  },
]

export const categoryBySlug = new Map<CategorySlug, Category>(categories.map((c) => [c.slug, c]))
export const isCategorySlug = (s: string | undefined): s is CategorySlug =>
  !!s && categoryBySlug.has(s as CategorySlug)
