/**
 * Territory content.
 *
 * `sourceMentions` — places that the PDF itself names, with the verbatim quote and page.
 *   These are the ONLY product-to-place links shown on the site.
 * `territories` — editorial landscape storytelling. It deliberately does not link any
 *   product to a region: the catalogue does not provide that information.
 */
import type { SourceMention, Territory } from './types'

const it = (s: string) => ({ it: s })

export const sourceMentions: SourceMention[] = [
  {
    id: 'campofilone',
    name: 'Campofilone',
    quote: it('TAGLIATELLE DI CAMPOFILONE — NQBM1202 - 250g'),
    page: 5,
    productIds: [
      'nqbm1201', 'nqbm1202', 'nqbm1203', 'nqbm1204', 'nqbm1205', 'nqbm1206',
      'nqbm1207', 'nqbm1208', 'nqbm1209', 'nqbm1210', 'nqbm1211',
    ],
  },
  {
    id: 'parma',
    name: 'Parma',
    quote: it('NQS407 PROSCIUTTO PARMA 24 MESI CON OSSO'),
    page: 10,
    productIds: ['nqs407'],
  },
  {
    id: 'san-daniele',
    name: 'San Daniele',
    quote: it('NQP501 PROSCIUTTO SAN DANIELE CON OSSO'),
    page: 12,
    productIds: ['nqp501', 'nqp502', 'nqp503', 'nqp504'],
  },
  {
    id: 'cilento',
    name: 'Cilento',
    area: 'Campania',
    quote: it('Pecorino della tradizione campana […] i sapori autentici del territorio cilentano.'),
    page: 15,
    productIds: ['nqf923'],
  },
  {
    id: 'sardegna',
    name: 'Sardegna',
    quote: it('Formaggio pecorino della tradizione sarda.'),
    page: 15,
    productIds: ['nqf918'],
  },
  {
    id: 'san-marzano',
    name: 'San Marzano',
    quote: it('GLQ 006 POMODORI PELATI SAN MARZANO SCATOLA 6X DA 2,5kg'),
    page: 25,
    productIds: ['glq006'],
  },
  {
    id: 'mediterraneo',
    name: 'Mar Mediterraneo',
    quote: it('Pescato nel Mar Mediterraneo viene cotto esclusivamente in acqua bollente e sale marino…'),
    page: 26,
    productIds: ['nqg301'],
  },
  {
    id: 'toscana',
    name: 'Toscana — Valdera',
    area: 'Toscana',
    quote: it('Fondata nel 1911 nel cuore della Valdera dal Cavalier Leonello Morelli […] Radicata nella tradizione toscana…'),
    page: 31,
    productIds: ['nqm002', 'nqm006', 'nqm090', 'nqm129'],
  },
]

export const territories: Territory[] = [
  {
    id: 'colline',
    name: it('Colline'),
    text: it('Filari di cipressi, campi che cambiano colore con le stagioni, borghi in pietra: il paesaggio agricolo che ha dato forma alla cucina italiana.'),
    image: 'terr-toscana',
    imageAlt: it('Colline con cipressi e un casolare in campagna'),
  },
  {
    id: 'montagna',
    name: it('Montagna'),
    text: it('Pascoli d’alta quota, malghe e tempi lenti: dove il latte diventa formaggio e la stagionatura segue il ritmo dell’aria.'),
    image: 'terr-dolomiti',
    imageAlt: it('Prati verdi ai piedi di vette dolomitiche'),
  },
  {
    id: 'costa',
    name: it('Costa'),
    text: it('Porti, barche da pesca e paesi affacciati sul mare: la cultura del Mediterraneo vive anche in dispensa.'),
    image: 'terr-liguria',
    imageAlt: it('Case colorate a picco sul mare in un borgo costiero'),
  },
  {
    id: 'isole',
    name: it('Isole'),
    text: it('Luce piena, muretti a secco e una tradizione gastronomica fatta di sapori decisi.'),
    image: 'terr-sicilia',
    imageAlt: it('Paese costiero con case addossate alla scogliera sul mare'),
  },
  {
    id: 'ulivi',
    name: it('Uliveti'),
    text: it('Tronchi secolari e chiome argentate: un paesaggio che accompagna la tavola italiana da sempre.'),
    image: 'terr-ulivi',
    imageAlt: it('Ulivi secolari in un campo assolato'),
  },
  {
    id: 'vigne',
    name: it('Vigne'),
    text: it('Filari ordinati sulle colline e il lavoro paziente della vendemmia.'),
    image: 'terr-vigneti',
    imageAlt: it('Vigneti in collina al tramonto'),
  },
]
