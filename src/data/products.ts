/**
 * Product catalogue — single source of truth.
 *
 * Transcribed from `source/Catalogo_Linkato_10-9.pdf` (Catalogo Prodotti 2026, 32 pages).
 * Names, codes, sizes, descriptions and ingredients are verbatim (line-break hyphenation
 * removed). Anything uncertain is recorded in `notes` and in docs/CONTENT_VERIFICATION.md.
 *
 * Do not add editorial copy here: this file must stay 100 % source-backed.
 */
import type {
  CategorySlug,
  Detail,
  ImageScope,
  L10n,
  ProductFamily,
  ProductImage,
  Variant,
  Verification,
} from './types'
import { slugify } from '../lib/text'

/* ------------------------------------------------------------------ helpers */

const it = (s: string): L10n => ({ it: s })
const d = (label: string, value: string): Detail => ({ label: it(label), value: it(value) })
const v = (code: string, size: string | undefined, page: number, label?: string): Variant => ({
  code,
  size,
  sourcePage: page,
  ...(label ? { label } : {}),
})
const img = (key: string, page: number, alt: string, scope: ImageScope = 'exact'): ProductImage => ({
  key,
  page,
  scope,
  alt: it(alt),
})

type Input = Omit<ProductFamily, 'id' | 'slug' | 'catalogOrder' | 'sourcePages' | 'verification'> & {
  verification?: Verification
  slug?: string
}

const families: Input[] = []
const add = (p: Input) => families.push(p)

/* ====================================================================== PASTA */
// p. 3–4 — formats in 500 g bags (Golosaqualità packaging visible in the photos)
const pastaClassic: [string, string, number, string?][] = [
  ['NQE217', 'SPAGHETTONI', 3],
  ['NQE204', 'MEZZO PACCHERO', 3, 'La confezione fotografata riporta "Mezzi Paccheri"; nome dal testo del catalogo.'],
  ['NQE202', 'LUMACONI', 3],
  ['NQE203', 'MEZZE MANICHE', 3],
  ['NQE205', 'PENNE LISCE O RIGATE', 3, 'La confezione fotografata riporta solo "Penne Lisce".'],
  ['NQE206', 'TUBETTONI LISCI O RIGATI', 3, 'La confezione fotografata riporta solo "Tubettoni".'],
  ['NQE208', 'RIGATONI', 3],
  ['NQE209', 'FUSILLONE', 3, 'La confezione fotografata riporta "Fusilloni".'],
  ['NQE207', 'FETTUCCINE', 4],
  ['NQE216', 'MAFALDE', 4],
  ['NQE210', 'LINGUINE', 4],
  ['NQE213', 'PACCHERI', 4],
  ['NQE212', 'TACCOLE', 4],
  ['NQE215', 'ZITI TAGLIATI', 4],
  ['NQE211', 'PASTA MISTA', 4],
  ['NQE214', 'TUBETTINI', 4],
]
for (const [code, name, page, note] of pastaClassic) {
  add({
    sourceName: name,
    category: 'pasta',
    subcategory: 'Formati classici',
    variants: [v(code, '500 g', page)],
    images: [img(`p${page}-${code.toLowerCase()}`, page, `Confezione ${name.toLowerCase()} 500 g`)],
    ...(note ? { notes: [note], verification: 'partial' as const } : {}),
  })
}

// p. 5 — Campofilone, 250 g boxes
const campofilone: [string, string][] = [
  ['NQBM1201', 'TONNARELLI DI CAMPOFILONE'],
  ['NQBM1202', 'TAGLIATELLE DI CAMPOFILONE'],
  ['NQBM1203', 'PAPPARDELLE DI CAMPOFILONE'],
  ['NQBM1204', 'FETTUCCINE DI CAMPOFILONE'],
  ['NQBM1205', 'SFOGLIA PER LASAGNA DI CAMPOFILONE'],
  ['NQBM1206', 'MACCHERONCINI DI CAMPOFILONE'],
  ['NQBM1207', 'LINGUINE DI CAMPOFILONE'],
  ['NQBM1208', 'FETTUCCINE DI CAMPOFILONE TARTUFO'],
  ['NQBM1209', 'FETTUCCINE DI CAMPOFILONE FUNGHI'],
  ['NQBM1210', 'FETTUCCINE DI CAMPOFILONE PEPERONCINO'],
  ['NQBM1211', 'FETTUCCINE DI CAMPOFILONE ZAFFERANO'],
]
for (const [code, name] of campofilone) {
  add({
    sourceName: name,
    category: 'pasta',
    subcategory: 'Pasta di Campofilone',
    variants: [v(code, '250 g', 5)],
    images: [img(`p5-${code.toLowerCase()}`, 5, `Confezione ${name.toLowerCase()} 250 g`)],
  })
}

// p. 6–7 — semola integrale / farro monococco
const integrale: [string, string, string, number][] = [
  ['NQMVD2101', 'PICI SEMOLA INTEGRALE', '500 g', 6],
  ['NQMVD2102', 'PAPPARDELLE SEMOLA INTEGRALE', '500 g', 6],
  ['NQMVD2103', 'TAGLIATELLE SEMOLA INTEGRALE', '500 g', 6],
  ['NQMVD2105', 'SPAGHETTONI CON CURVA SEMOLA INTEGRALE', '400 g', 6],
  ['NQMVD2106', 'LINGUINE CON CURVA SEMOLA INTEGRALE', '400 g', 6],
  ['NQMVD2104', 'TAGLIOLINI SEMOLA INTEGRALE', '400 g', 6],
  ['NQMVD2107', 'PACCHERI SEMOLA INTEGRALE', '500 g', 6],
  ['NQMVD2108', 'MEZZI PACCHERI SEMOLA INTEGRALE', '500 g', 6],
  ['NQMVD2109', 'PENNE SEMOLA INTEGRALE', '500 g', 6],
  ['NQMVD2110', 'FUSILLONI RIGATI SEMOLA INTEGRALE', '500 g', 7],
  ['NQMVD2111', 'RIGATONI SEMOLA INTEGRALE', '500 g', 7],
  ['NQMVD2112', 'CASARECCE SEMOLA INTEGRALE', '500 g', 7],
  ['NQMVD2113', 'TUBETTI RIGATI SEMOLA INTEGRALE', '500 g', 7],
  ['NQMVD2114', 'TEMPESTINE SEMOLA INTEGRALE', '500 g', 7],
  ['NQMVD2171', 'CONCHIGLIE RIGATE', '160 g', 7],
  ['NQMVD2138', 'FUSILLI FARRO MONOCOCCO', '500 g', 7],
  ['NQMVD2139', 'PENNETTE FARRO MONOCOCCO', '500 g', 7],
  ['NQMVD2140', 'TAGLIATELLE FARRO MONOCOCCO', '500 g', 7],
]
for (const [code, name, size, page] of integrale) {
  add({
    sourceName: name,
    category: 'pasta',
    subcategory: 'Integrale e farro monococco',
    variants: [v(code, size, page)],
    images: [img(`p${page}-${code.toLowerCase()}`, page, `Confezione ${name.toLowerCase()} ${size}`)],
    ...(code === 'NQMVD2171'
      ? { notes: ['Il catalogo non indica la tipologia di sfarinato per questo formato.'] }
      : {}),
  })
}

/* ======================================================================= RISO */
// p. 8
add({
  sourceName: 'RISO CARNAROLI',
  category: 'riso',
  variants: [v('NQRA1101', '1 kg', 8), v('NQRA1105', '500 g', 8)],
  images: [
    img('p8-nqra1101', 8, 'Confezione riso Carnaroli 1 kg'),
    img('p8-nqra1105', 8, 'Confezione riso Carnaroli 500 g'),
  ],
})
add({
  sourceName: 'RISO ARBORIO',
  category: 'riso',
  variants: [v('NQRA1102', '1 kg', 8), v('NQRA1106', '500 g', 8)],
  images: [
    img('p8-nqra1102', 8, 'Confezione riso Arborio 1 kg'),
    img('p8-nqra1106', 8, 'Confezione riso Arborio 500 g'),
  ],
})
const riso: [string, string, string][] = [
  ['NQRA1103', 'RISO BALDO', '1 kg'],
  ['NQRA1104', 'RISO ROMA', '1 kg'],
  ['NQRA1107', 'RISO NERO INTEGRALE MEDIO', '500 g'],
  ['NQRA1108', 'RISO ROSSO INTEGRALE LUNGO', '500 g'],
  ['NQRA1109', 'RISO GRANCAVOUR', '500 g'],
  ['NQRA1110', 'RISO RUBINUM', '500 g'],
  ['NQRA1111', 'RISO EBANO', '500 g'],
]
for (const [code, name, size] of riso) {
  add({
    sourceName: name,
    category: 'riso',
    variants: [v(code, size, 8)],
    images: [img(`p8-${code.toLowerCase()}`, 8, `Confezione ${name.toLowerCase()} ${size}`)],
  })
}

/* ===================================================================== SALUMI */
add({
  sourceName: 'SALAME STROLGHINO',
  category: 'salumi',
  subcategory: 'Salumi',
  variants: [v('NQS401', 'peso variabile da 0,2 a 0,3 kg', 9)],
  description: it(
    'Le rifilature di Culatello unite con una speciale concia di vino, pepe ed aglio vengono insaccate nella budellina di maiale, successivamente messe a stagionare. Forma cilindrica di circa 20 cm. Gusto fresco e dolce, ma di carattere. Senza glutine e allergeni.',
  ),
  images: [img('p9-g0', 9, 'Salame Strolghino affettato su tagliere')],
})
add({
  sourceName: 'SALAME MARIOLA',
  category: 'salumi',
  subcategory: 'Salumi',
  variants: [v('NQS402', 'peso variabile da 0,6 kg', 9)],
  description: it(
    'La carne macinata unita con una speciale concia di vino, pepe ed aglio viene insaccata nell’intestino del maiale (mulette) e posto a stagionare. Forma tondeggiante lunga 10-12 cm. Gusto deciso ma consistenza morbida. Senza glutine e allergeni.',
  ),
  images: [img('p9-g1', 9, 'Salame Mariola affettato')],
})
add({
  sourceName: 'SPALLA COTTO',
  category: 'salumi',
  subcategory: 'Salumi',
  variants: [v('NQS404', 'peso variabile da 7,5 a 8,0 kg', 9)],
  description: it(
    'La carne viene toelettata, salata e lasciata riposare per 4 giorni in cella a temperatura compresa tra 0-4°C. Trascorso questo tempo si procede alla disossatura, insaccatura, legatura e cottura in salamoia a fuoco lento per più di 12 ore. Sapore dolce e delicato. Consistenza tenera Senza glutine e allergeni.',
  ),
  images: [img('p9-g2', 9, 'Spalla cotta affettata su tagliere')],
})
add({
  sourceName: 'CUOR DI PROSCIUTTO',
  category: 'salumi',
  subcategory: 'Salumi',
  variants: [v('NQS405', 'peso variabile da 5,0 kg', 9)],
  description: it(
    'Dopo il taglio e la rifilatura la carne viene sgrassata e insaporita con sale marino e aromi naturali, legata a mano con corda naturale e successivamente arrostita con frutta e spezie. Sapore delicato ma deciso, con note di spezie e frutta matura. Senza glutine e allergeni',
  ),
  images: [img('p9-g3', 9, 'Cuor di prosciutto affettato')],
})
add({
  sourceName: 'GOLA GUANCIALE',
  category: 'salumi',
  subcategory: 'Salumi',
  variants: [v('NQS406', 'peso variabile da 1,0 a 1,5 kg', 10)],
  description: it(
    'Ottenuto dalla lavorazione della gola del maiale. Dopo il taglio e la rifilatura della carne al coltello, viene insaporito con sale marino, pepe e aromi e messo a stagionare. Gusto dolce, leggermente pepato e affumicato. Senza glutine e allergeni',
  ),
  images: [img('p10-g0', 10, 'Guanciale affettato su tagliere')],
})
add({
  sourceName: 'PROSCIUTTO PARMA',
  category: 'salumi',
  subcategory: 'Prosciutti',
  variants: [
    v('NQS407', 'peso variabile da 7,0 a 8,5 kg', 10, '24 mesi con osso'),
    v('NQS408', 'peso variabile da 7,0 a 8,5 kg', 10, '24 mesi senza osso'),
    v('NQS409', 'peso variabile da 7,0 a 8,5 kg', 10, '30 mesi con osso'),
    v('NQS410', 'peso variabile da 7,0 a 8,5 kg', 10, '30 mesi senza osso'),
  ],
  description: it(
    'Le cosce sottoposte a salagione e a pre-stagionatura, vengono fatte asciugare per 6-7 mesi. Una volta sugnati i prosciutti vengono poi trasferiti in cantina per la stagionatura. Naturalmente senza glutine e allergeni.',
  ),
  images: [img('p10-g1', 10, 'Prosciutto di Parma affettato', 'family')],
  notes: [
    'Il catalogo elenca quattro codici sotto un’unica descrizione e un unico peso: il peso indicato è riportato per tutte le varianti.',
  ],
  verification: 'partial',
})
add({
  sourceName: 'MORTADELLA NOSTRANA CON PISTACCHI',
  category: 'salumi',
  subcategory: 'Salumi',
  variants: [v('NQS403', 'peso variabile da 6,0 kg', 10)],
  description: it(
    'Mortadella artigianale preparata con carni selezionate e una lavorazione lenta che esalta gusto e profumo. Arricchita con pistacchi interi, dona un perfetto equilibrio tra dolcezza e sapidità.',
  ),
  images: [img('p10-g2', 10, 'Mortadella con pistacchi affettata')],
})
add({
  sourceName: 'LONZARDO',
  category: 'salumi',
  subcategory: 'Salumi',
  variants: [v('NQS421', 'peso variabile da 1,5 a 3,0 kg', 11)],
  description: it(
    'PRODOTTO ESCLUSIVO, NON IL SOLITO LARDO. Dopo il taglio e la rifilatura della carne al coltello, viene insaporito con sale marino, pepe e piante aromatiche e messo a stagionare. Il Gusto sapido della lonza si unisce alla morbidezza e dolcezza del lardo. Senza glutine e allergeni',
  ),
  images: [img('p11-g0', 11, 'Lonzardo affettato su tagliere')],
  notes: [
    'Codice duplicato: NQS421 è stampato sia per LONZARDO sia per PROSCIUTTO SCELTO PER GOLOSA QUALITÀ CON OSSO (p. 11). Valore conservato come da fonte, da confermare con il cliente.',
  ],
  verification: 'ambiguous',
})
add({
  sourceName: 'LARDO NOSTRANO',
  category: 'salumi',
  subcategory: 'Salumi',
  variants: [v('NQR100', 'peso variabile da 0,4 a 3,0 kg', 11)],
  description: it(
    'Il Lardo è un taglio di carne del maiale, ricavato dal grasso sottocutaneo del collo, del dorso e dei fianchi dell’animale. Viene aromatizzato e posto in apposite vasche, dopo un periodo di salagione e assorbimento delle spezie viene confezionato in sottovuoto. Il lardo e adatto su pane caldo e bruschette. È senza glutine e senza lattosio.',
  ),
  images: [img('p11-g1', 11, 'Trancio di lardo nostrano')],
})
add({
  sourceName: 'PROSCIUTTO SCELTO PER GOLOSA QUALITÀ',
  category: 'salumi',
  subcategory: 'Prosciutti',
  variants: [
    v('NQS421', 'peso variabile da 6,0 a 9,0 kg', 11, 'con osso'),
    v('NQS422', 'peso variabile da 6,0 a 9,0 kg', 11, 'senza osso'),
  ],
  description: it(
    'Ottenuto dalla coscia del suino, sottoposta a salagione e a un lungo periodo di stagionatura naturale. Si caratterizza per il sapore delicato e aromatico, la consistenza morbida e il colore rosato della carne con la tipica parte di grasso bianco.',
  ),
  details: [d('Stagionatura', '16-18 mesi')],
  images: [img('p11-g2', 11, 'Prosciutto intero su base in ardesia', 'family')],
  notes: [
    'Codice duplicato: NQS421 è stampato anche per LONZARDO (p. 11). Da confermare con il cliente.',
  ],
  verification: 'ambiguous',
})
add({
  sourceName: 'PROSCIUTTO SAN DANIELE CON OSSO',
  category: 'salumi',
  subcategory: 'Prosciutti',
  variants: [v('NQP501', 'peso variabile da 6,0 a 9,0 kg', 12)],
  description: it(
    'Il Prosciutto con osso è una scelta da intenditore. Gusta la sua raffinatezza tagliandolo a mano ed assapora il suo gusto pieno. Se è la prima volta che lo acquisti segui i nostri consigli per il taglio.',
  ),
  images: [img('p12-nqp501', 12, 'Prosciutto San Daniele con osso')],
})
add({
  sourceName: 'PROSCIUTTO SAN DANIELE DISOSSATO NON PRESSATO',
  category: 'salumi',
  subcategory: 'Prosciutti',
  variants: [v('NQP502', 'peso variabile da 6,0 a 9,0 kg', 12)],
  description: it(
    'Se hai l’affettatrice e cerchi praticità, il prosciutto intero disossato è la scelta perfetta per te: gusta il tuo Prosciutto Prolongo a fettine sottili! Utilizza l’affettatrice o, se non ce l’hai, puoi anche tagliarlo a mano. In entrambi i casi, dovrai pulirlo man mano dalla cotenna.',
  ),
  producer: 'Prolongo',
  images: [img('p12-nqp502', 12, 'Prosciutto San Daniele disossato non pressato')],
})
add({
  sourceName: 'PROSCIUTTO SAN DANIELE DISOSSATO RISERVATO LEGATO A MANO',
  category: 'salumi',
  subcategory: 'Prosciutti',
  variants: [v('NQP503', 'peso variabile da 6,0 a 9,0 kg', 12)],
  description: it(
    'Il Prosciutto San Daniele Prolongo disossato e confezionato si conserva in frigorifero fino a 6 mesi. Una volta aperto, riponilo in frigorifero (da +4° a +7°), con un panno umido o pellicola sottile sul taglio e consumalo entro un mese.',
  ),
  producer: 'Prolongo',
  images: [img('p12-nqp503', 12, 'Prosciutto San Daniele disossato legato a mano')],
})
add({
  sourceName: 'PROSCIUTTO SAN DANIELE PRONTO FETTA',
  category: 'salumi',
  subcategory: 'Prosciutti',
  variants: [v('NQP504', 'peso variabile da 4,0 a 5,0 kg', 12)],
  description: it(
    'Un trancio grande che contiene il “cuore” del Prosciutto, in un formato pronto per essere affettato. È ottenuto da un disossato intero a cui vengono tagliate le parti iniziali del fiocco e della punta, lasciando intatto il centro del Prosciutto e mantenendo la cotenna per una migliore conservazione.',
  ),
  images: [img('p12-nqp504', 12, 'Prosciutto San Daniele pronto fetta')],
})

/* =================================================================== FORMAGGI */
// p. 13–14 — Caciocavallo
add({
  sourceName: 'CACIOCAVALLO AFFINATO IN GROTTA',
  category: 'formaggi',
  subcategory: 'Caciocavallo',
  variants: [v('NQF903', '1,6 kg', 13), v('NQF910', '5 kg', 13)],
  description: it(
    'Latte crudo, siero innesto, sale, enzima coagulante. Struttura compatta e friabile di colore giallo-pagliarino, ambrato; presenza di occhiatura di dimensioni medie e distribuzione omogenea; sottile unghia. Elementi di discontinuità (piccoli strappi) poco diffusi. Deformabilità e adesività bassa. Struttura tipo grana',
  ),
  details: [d('Stagionatura', '90-120 gg (indicata per il formato 1,6 kg)')],
  images: [img('p13-g0', 13, 'Caciocavallo affinato in grotta', 'family')],
  notes: ['La stagionatura 90-120 gg è stampata accanto al solo codice NQF903 (1,6 kg).'],
  verification: 'partial',
})
add({
  sourceName: 'CACIOCAVALLO AFFINATO IN VINACCIA',
  category: 'formaggi',
  subcategory: 'Caciocavallo',
  variants: [v('NQF905', '1,6 kg', 13)],
  description: it(
    'Latte, siero innesto, sale, caglio. Affinato in vinacce d’uva nera. Forma a pera con testa. Aderenze residue di vinaccia di uve biologiche in superficie. Crosta non edibile. Struttura compatta, elastica e morbida di colore giallo-paglierino, ambrato. Elementi di discontinuità (piccoli strappi) poco diffusi. Gusto intenso, sapore leggermente piccante.',
  ),
  details: [d('Stagionatura', '90-120 gg')],
  // Clean transparent cutout of the p. 13 photo (scripts/cutouts-refine.py); original crop p13-g1 kept on disk.
  images: [img('p13-vinaccia-clean', 13, 'Caciocavallo affinato in vinaccia')],
})
add({
  sourceName: 'CACIOCAVALLO AFFUMICATO',
  category: 'formaggi',
  subcategory: 'Caciocavallo',
  variants: [v('NQF908', '1,4 kg', 13)],
  description: it(
    'Latte, siero innesto, sale, caglio, affumicato con fumi di legno di faggio. Forma a pera con testa. Crosta esterna liscia, omogenea, regolare, pulita di colore giallo paglierino. Struttura compatta, elastica e morbida. Presenza di occhiatura di dimensioni medie. Intenso sapore affumicato, leggero retrogusto di “tostato”',
  ),
  details: [d('Stagionatura', '30 gg')],
  images: [img('p13-g2', 13, 'Caciocavallo affumicato')],
})
add({
  sourceName: 'CACIOCAVALLO AL PEPERONCINO',
  category: 'formaggi',
  subcategory: 'Caciocavallo',
  variants: [v('NQF907', '1,4 kg', 13)],
  description: it(
    'Latte, siero innesto, peperoncino (2%), sale, caglio. Forma sferica senza testa. Crosta esterna liscia, con frammenti di peperoncino. Struttura compatta, elastica e morbida. Aroma: Intenso odore lattico-cotto, sapore piccante e retrogusto di “tostato”',
  ),
  details: [d('Stagionatura', '30 gg')],
  images: [img('p13-g3', 13, 'Caciocavallo al peperoncino')],
})
add({
  sourceName: 'CACIOCAVALLO STRAVECCHIO',
  category: 'formaggi',
  subcategory: 'Caciocavallo',
  variants: [v('NQF904', '1,5 kg', 14)],
  description: it(
    'Latte crudo, siero innesto, sale, enzima coagulante. Struttura compatta e friabile di colore giallo-paglierino, ambrato; presenza di occhiatura di dimensioni medie e distribuzione omogenea; sottile unghia. Elementi di discontinuità (piccoli strappi) poco diffusi. Deformabilità e adesività bassa. Struttura tipo grana',
  ),
  images: [img('p14-g0', 14, 'Caciocavallo stravecchio')],
})
add({
  sourceName: 'CACIOCAVALLO AL TARTUFO',
  category: 'formaggi',
  subcategory: 'Caciocavallo',
  variants: [v('NQF906', '1,3 kg', 14)],
  description: it(
    'Latte vaccino pastorizzato, siero innesto, tartufo (Tuber Aestivum) (tartufo, olio extravergine di oliva, aromi) 3%, sale, caglio Forma a pera con testa. Crosta esterna liscia, omogenea, regolare, pulita di colore giallo paglierino. Presenza di occhiatura di dimensioni medie. Aroma: intenso odore lattico-cotto, tartufo.',
  ),
  details: [d('Stagionatura', '60 gg')],
  images: [img('p14-g1', 14, 'Caciocavallo al tartufo')],
})
add({
  sourceName: 'CACIOCAVALLO FRESCO',
  category: 'formaggi',
  subcategory: 'Caciocavallo',
  variants: [v('NQF902', '1,1 kg', 14)],
  description: it(
    'Latte, siero innesto, sale, caglio. Forma a pera con testa. Crosta esterna liscia, omogenea, regolare, pulita di colore giallo paglierino. Struttura compatta, elastica e morbida. Presenza di occhiatura di dimensioni medie. Aroma: intenso odore lattico-cotto.',
  ),
  details: [d('Stagionatura', '30-45 gg')],
  images: [img('p14-g2', 14, 'Caciocavallo fresco')],
})
add({
  sourceName: 'CACIOCAVALLO OCCHIO DOLCE',
  category: 'formaggi',
  subcategory: 'Caciocavallo',
  variants: [v('NQF911', '5 kg', 14), v('NQF912', '10 kg', 14)],
  description: it(
    'Latte crudo, fermenti lattici selezionati, sale, caglio. Affinato in grotta, crosta leggermente ambrata, con macchie di colore bianco/grigio/nero. Struttura compatta, elastica e morbida, pasta di colore giallo paglierino-ambrato con sottile unghia; presenza di occhiatura propionica di dimensioni medie-grandi con distribuzione omogenea.',
  ),
  images: [img('p14-g3', 14, 'Caciocavallo occhio dolce in rete', 'family')],
})
add({
  sourceName: 'CACIOCAVA AFFINATO IN GROTTA',
  category: 'formaggi',
  subcategory: 'Caciocavallo',
  variants: [v('NQF922', '5 kg', 14)],
  description: it(
    'Latte crudo, siero innesto, sale e caglio. Prodotto stagionato in ambiente con pareti in roccia carsica. Stagionatura 150 gg. Aspetto: Forma tronco conica. Crosta esterna scura, non edibile, color nero-grigio. Struttura compatta, elastica e morbida. Presenza di occhiatura di dimensioni medie e distribuzione omogenea. Sapore piccante.',
  ),
  details: [d('Stagionatura', '150 gg')],
  images: [img('p14-g4', 14, 'Forma affinata in grotta con spicchio')],
  notes: ['Nome stampato "CACIOCAVA": possibile refuso per "CACIOCAVALLO", conservato come da fonte.'],
  verification: 'partial',
})

// p. 15 — pecorini & caciotte
add({
  sourceName: 'CACIOTTA GIOVANE DI CAPRA “BERTU”',
  displayName: 'Caciotta giovane di capra “Bertu”',
  category: 'formaggi',
  subcategory: 'Latte di capra',
  variants: [v('NQF919', '1,8 kg', 15)],
  description: it(
    'formaggio di capra fresco e leggero, maturato per 30 giorni, dalla pasta bianca e morbida, si presta all’alimentazione di tutti. Dal sapore dolce e delicato puo essere usato negli antipasti in abbinamento ai salumi, nella creazione di sandwich o semplicemente come formaggio da tavola; ottimo l’abbinamento con i vini bianchi fruttati.',
  ),
  images: [img('p15-g0', 15, 'Forma di caciotta di capra Bertu')],
})
add({
  sourceName: 'CACIOTTA GIOVANE DI PECORA BIASU',
  displayName: 'Caciotta giovane di pecora Biasu',
  category: 'formaggi',
  subcategory: 'Latte di pecora',
  variants: [v('NQF916', '3 kg', 15)],
  description: it(
    'Latte ovino pastorizzato, sale, caglio, fermenti lattici. Formaggio a pasta molle, crosta di colore paglierino. Pasta morbida, compatta, gialla tendente all’intenso con la maturazione. Crosta giallo chiaro, liscia, con conservanti E203–E235. Crosta non edibile. Sapore: dolce, delicato, gradevole',
  ),
  images: [img('p15-g1', 15, 'Forma di caciotta di pecora Biasu')],
})
add({
  sourceName: 'PECORINO BUSTIANU',
  displayName: 'Pecorino Bustianu',
  category: 'formaggi',
  subcategory: 'Latte di pecora',
  variants: [v('NQF917', '3,5 kg', 15)],
  description: it(
    'Latte ovino pastorizzato, sale, caglio, fermenti lattici. Crosta liscia, dorata/marrone, trattato con E202-E235, E150d-E160b. Crosta non edibile. Tipo di pasta: gialla, compatta. Sapore: gradevole, leggermente piccante',
  ),
  images: [img('p15-g2', 15, 'Forma di pecorino Bustianu')],
})
add({
  sourceName: 'PECORINO MATURO BOBORE',
  displayName: 'Pecorino maturo Bobore',
  category: 'formaggi',
  subcategory: 'Latte di pecora',
  variants: [v('NQF918', '5,2 kg', 15)],
  description: it(
    'Latte ovino pastorizzato, sale, caglio, fermenti lattici Formaggio pecorino della tradizione sarda. Crosta color marrone, rigata, trattata con conservanti E202-E235, coloranti E150d-E160b. Crosta non edibile Tipo di pasta: gialla chiara, compatta. Sapore: deciso, leggermente piccante, fortemente aromatico',
  ),
  origin: it('Tradizione sarda (come indicato nel catalogo)'),
  images: [img('p15-g3', 15, 'Forma di pecorino maturo Bobore')],
})
add({
  sourceName: '“CILENTANO” FORMAGGIO PECORINO SEMISTAGIONATO',
  displayName: '“Cilentano” formaggio pecorino semistagionato',
  category: 'formaggi',
  subcategory: 'Latte di pecora',
  variants: [v('NQF923', '2,5 kg', 15)],
  description: it(
    'Pecorino della tradizione campana, stagionato per circa 45 giorni secondo metodi artigianali. Si distingue per la caratteristica forma a giunco e per la pasta compatta dal colore giallo paglierino. Al palato offre un gusto delicato ed equilibrato, con aromi genuini che richiamano i sapori autentici del territorio cilentano.',
  ),
  origin: it('Tradizione campana, territorio cilentano (come indicato nel catalogo)'),
  images: [img('p15-g4', 15, 'Pecorino Cilentano con spicchio')],
})
add({
  sourceName: '“IN GROTTA”',
  displayName: '“In grotta”',
  category: 'formaggi',
  subcategory: 'Latte di capra',
  variants: [v('NQF924', '3,0 kg', 15)],
  description: it(
    'Formaggio a latte 100% di capra, stagionato per circa quattro mesi in grotte naturali, dove matura lentamente sviluppando un carattere intenso e aromatico. Presenta una struttura compatta e piacevolmente friabile, con un gusto deciso e persistente. Ideale da gustare da solo, nei taglieri o per arricchire i piatti della tradizione.',
  ),
  images: [img('p15-g5', 15, 'Formaggio di capra stagionato in grotta')],
})

// p. 16–22 — NQTR range
type Nqtr = [code: string, name: string, size: string, page: number, imgKey: string, denom: string | null, prodotto: string | null, ingredienti: string, sub: string, extra?: Partial<Input>]
const nqtr: Nqtr[] = [
  ['NQTR1704', 'LA REGINA BIANCA', '1,5 a 2,0 kg', 16, 'p16-g0', 'primo sale da latte ovino.', 'formaggio fresco di pecora a pasta morbida compatta, fragrante al palato, con sapidità del latte, dal tipico sapore di primo sale.', 'LATTE fresco di pecora, sale, caglio naturale.', 'Latte di pecora'],
  ['NQTR1707', 'L’AMBASCIATRICE', '1,5 a 2,0 kg', 16, 'p16-g1', 'caciotta da latte ovino.', 'formaggio fresco di pecora, tipo caciotta, a pasta morbida e compatta di colore bianco e gusto gradevolmente dolce.', 'LATTE fresco di pecora, sale, caglio naturale.', 'Latte di pecora'],
  ['NQTR1709', 'IL CRETO GUSTOSO AL PEPE NERO', '1,5 a 2,8 kg', 16, 'p16-g2', 'caciotta al pepe nero da latte ovino.', 'formaggio semistagionato, a pasta compatta tenera, di colore paglierino senza occhiature, aromatizzato con grani di pepe nero, al palato morbido e delicato.', 'LATTE fresco di pecora, sale, caglio naturale, pepe nero in grani.', 'Latte di pecora'],
  ['NQTR1710', 'IL CRETO GUSTOSO AL PEPE ROSA', '1,1 a 2,5 kg', 16, 'p16-g3', 'caciotta al peperoncino da latte ovino.', 'formaggio di pecora, tipo caciotta, aromatizzato al peperoncino con pasta morbida e compatta.', 'LATTE fresco di pecora, sale, caglio naturale, peperoncino frantumato.', 'Latte di pecora',
    { notes: ['Il nome indica "pepe rosa" ma denominazione e ingredienti riportano il peperoncino; il testo è identico a quello di NQTR1708. Da confermare con il cliente.'], verification: 'ambiguous' }],
  ['NQTR1712', 'IL DON CARMELO', '0,5 a 1,0 kg', 17, 'p17-g0', 'semistagionato da latte ovino.', 'formaggio di pecora a pasta morbida e compatta di colore bianco ambrato.', 'LATTE fresco di pecora, sale, caglio naturale.', 'Latte di pecora'],
  ['NQTR1719', 'GRANDUCATO DI CASTRO RISERVA', '4,0 a 5,0 kg', 17, 'p17-g1', 'stagionato da latte ovino.', 'formaggio di pecora tipo Pecorino Romano a pasta dura e cotta.', 'LATTE fresco di pecora, sale, caglio naturale.', 'Latte di pecora'],
  ['NQTR1717', 'IL RISERVA DUCATO DI CASTRO', '3,0 kg', 17, 'p17-g2', 'stagionato da latte ovino.', 'Pecorino dal sapore dolce e acidulo che con la maturazione acquisisce un sapore più deciso e leggermente piccante. La sua pasta di colore paglierino e leggermente occhiata è tenera ed elastica da giovane e granulosa e solubile nel prodotto maturo.', 'LATTE fresco di pecora, sale, caglio naturale.', 'Latte di pecora'],
  ['NQTR1718', 'L’INNOMINATO DUCATO DI CASTRO', '1,1 a 2,5 kg', 17, 'p17-g3', 'stagionato da latte ovino.', 'Pecorino dal profumo intenso e un sapore dolce acidulo. Dopo la stagionatura diventa piccante e gradevole.', 'LATTE fresco di pecora, sale, caglio naturale.', 'Latte di pecora'],
  ['NQTR1711', 'IL QUALITOSO', '1,5 a 2,8 kg', 18, 'p18-g0', 'semistagionato da latte ovino.', 'formaggio semistagionato dal sapore deciso di pecorino, a pasta semidura e compatta di colore paglierino con occhiatura fine e regolare.', 'LATTE fresco di pecora, sale, caglio naturale.', 'Latte di pecora'],
  ['NQTR1708', 'IL FIORE DI GIGLIO DI CASTRO', '1,1 a 2,5 kg', 18, 'p18-g1', 'caciotta al peperoncino da latte ovino.', 'formaggio di pecora, tipo caciotta, aromatizzato al peperoncino con pasta morbida e compatta.', 'LATTE fresco di pecora, sale, caglio naturale, peperoncino frantumato.', 'Latte di pecora'],
  ['NQTR1725', 'POGGIO CONTE', '0,4 a 3,0 kg', 18, 'p18-g2', 'formaggio da latte caprino.', 'formaggio di capra semistagionato a pasta cremosa tipo stracchino, con retrogusto di erborinato.', 'LATTE fresco di capra, sale, caglio naturale. (Opzioni: affinato CON FRUTTA / affinato CON SPEZIE)', 'Latte di capra',
    { details: [d('Opzioni', 'affinato con frutta / affinato con spezie')], notes: ['Le opzioni di affinamento non hanno codici separati nel catalogo.'] }],
  ['NQTR1729', 'DI CONTE', '0,5 a 1,0 kg', 18, 'p18-g3', 'formaggio da latte caprino.', 'formaggio di capra semistagionato a pasta molle e dal sapore leggermente pungente. Con la stagionatura sviluppa un gusto audace e complesso.', 'LATTE fresco di capra, sale, caglio naturale.', 'Latte di capra'],
  ['NQTR1735', 'LA GRAN GIULIA', '4,0 a 5,0 kg', 19, 'p19-g0', 'formaggio da latte vaccino.', 'formaggio di mucca a latte crudo', 'LATTE fresco di mucca, sale, caglio naturale.', 'Latte vaccino'],
  ['NQTR1748', 'LA ROSETTA DI MUCCA', '1,1 a 2,5 kg', 19, 'p19-g1', 'Toma da latte vaccino.', 'caratteristico formaggio di latte vaccino con pasta cremosa e fondente in bocca dal sapore di latte e dal gusto raffinato.', 'LATTE fresco di mucca, sale, caglio naturale.', 'Latte vaccino'],
  ['NQTR1751', 'PIRADORO', '3,5 a 4,5 kg', 19, 'p19-g2', 'erborinato da latte vaccino.', 'formaggio erborinato di mucca a pasta cruda e tenera.', 'LATTE fresco di mucca pastorizzato, sale, caglio naturale. (Variante: PIRADORO affinato con FRUTTA PASSA)', 'Latte vaccino',
    { details: [d('Variante', 'PIRADORO affinato con FRUTTA PASSA')], notes: ['La variante affinata con frutta passa non ha un codice separato nel catalogo.'] }],
  ['NQTR1749', 'IL PIRA GUSTOSO', '0,5 a 1,0 kg', 19, 'p19-g3', 'stagionato da cagliata lattica ovina.', 'formaggio di pecora dal sapore dolce e delicato ma leggermente piccante.', 'LATTE fresco di pecora, sale, caglio naturale.', 'Latte di pecora'],
  ['NQTR1715', 'IL SUPER TOMATO REALE', '2,8 a 4,0 kg', 20, 'p20-g0', 'semistagionato da latte ovino.', 'formaggio semistagionato di pecora a pasta morbida e areata di colore bianco. Vincitrice del 1º PREMIO ALMA CASEUS 2016 come “Miglior Formaggio di Fattoria”', 'LATTE fresco di pecora, sale, caglio naturale.', 'Latte di pecora',
    { details: [d('Riconoscimento indicato nel catalogo', '1º Premio Alma Caseus 2016 — “Miglior Formaggio di Fattoria”')] }],
  ['NQTR1731', 'BLU DOLCE ERBORINATO', '2,8 a 3,5 kg', 20, 'p20-g1', 'erborinato da latte caprino.', 'formaggio a pasta compatta, asciutta e morbida ma non troppo cremosa di colore bianco con le venature verdi-azzurre. Gusto sapido ma non piccante.', 'LATTE fresco di capra pastorizzato, sale, caglio naturale e penicillium roqueforti.', 'Latte di capra'],
  ['NQTR1706', 'L’OVALE', '1,5 a 2,0 kg', 20, 'p20-g2', 'primo sale da latte ovino con olive e peperoncino.', 'formaggio fresco di pecora a pasta morbida compatta, fragrante al palato, con aggiunta di olive e peperoncino, con sapidità del latte, dal tipico sapore di primo sale.', 'LATTE fresco di pecora, sale, caglio naturale, olive e peperoncino. (Variante Olive)', 'Latte di pecora'],
  ['NQTR1705', 'BIANCA VERDE', '1,5 a 2,0 kg', 20, 'p20-g3', 'primo sale da latte ovino', 'formaggio fresco di pecora a pasta morbida compatta, fragrante al palato.', 'LATTE fresco di pecora, sale, caglio naturale, rucola e pepe rosa.', 'Latte di pecora'],
  ['NQTR1720', 'L’AROMATICO ROSMARINO', '1,2 a 3,0 kg', 21, 'p21-g0', null, null, 'latte fresco di pecora, sale, caglio naturale, rosmarino', 'Latte di pecora'],
  ['NQTR1720F', 'IL FIENILE GUSTOSO', '1,2 a 3,0 kg', 21, 'p21-g1', null, null, 'latte fresco di pecora, sale, caglio naturale, fieno biologico', 'Latte di pecora'],
  ['NQTR1720FM', 'MIELE FARRO', '1,2 a 3,0 kg', 21, 'p21-g2', null, null, 'latte fresco di pecora, sale, caglio naturale, farro e miele.', 'Latte di pecora'],
  ['NQTR1720FN', 'IL NOCINO IN FOGLIE', '1,2 a 3,0 kg', 22, 'p22-g0', null, null, 'latte fresco di pecora, sale, caglio naturale, foglie di noce.', 'Latte di pecora'],
  ['NQTR1720CE', 'AL CERIATOSO', '1,2 a 3,0 kg', 22, 'p22-g1', null, null, 'latte fresco di pecora, sale, caglio naturale, cereali.', 'Latte di pecora'],
  ['NQTR1720PP', 'IL FRUTTATO', '1,2 a 3,0 kg', 22, 'p22-g2', null, null, 'latte fresco di pecora, sale, caglio naturale, prugne e prugnolo.', 'Latte di pecora'],
]
for (const [code, name, size, page, key, denom, prodotto, ingr, sub, extra] of nqtr) {
  add({
    sourceName: name,
    category: 'formaggi',
    subcategory: sub,
    variants: [v(code, size.replace(' a ', '–'), page)],
    ...(prodotto ? { description: it(prodotto.charAt(0).toUpperCase() + prodotto.slice(1)) } : {}),
    ingredients: it(ingr.charAt(0).toUpperCase() + ingr.slice(1)),
    details: [...(denom ? [d('Denominazione', denom.replace(/\.$/, ''))] : []), ...(extra?.details ?? [])],
    images: [img(key, page, `Formaggio ${name.toLowerCase()}`)],
    ...(extra?.notes ? { notes: extra.notes } : {}),
    ...(extra?.verification ? { verification: extra.verification } : {}),
  })
}

// p. 23 — Superlativo
add({
  sourceName: 'CACIOTTA DI PECORA SUPERLATIVO',
  category: 'formaggi',
  subcategory: 'Latte di pecora',
  variants: [v('GLQ009', '1,5–1,8 kg', 23)],
  description: it(
    'Realizzato con latte fresco di pecora e lavorato con cura per preservare tutto il sapore e la qualità delle materie prime. In bocca offre un gusto equilibrato e armonico, con una piacevole nota sapida e una lieve persistenza aromatica che valorizza la dolcezza naturale del latte di pecora.',
  ),
  ingredients: it('Latte ovino pastorizzato, caglio, fermenti lattici, sale'),
  details: [d('Stagionatura', '5 mesi')],
  images: [img('p23-glq009', 23, 'Caciotta di pecora Superlativo confezionata')],
})
add({
  sourceName: 'CACIOTTA DI PECORA “IL MAXI SUPERLATIVO”',
  displayName: 'Caciotta di pecora “Il Maxi Superlativo”',
  category: 'formaggi',
  subcategory: 'Latte di pecora',
  variants: [v('GLQ010', '2,5–3,0 kg', 23)],
  description: it(
    'La prolungata stagionatura di nove mesi ne esalta il carattere, regalando un gusto più intenso e strutturato rispetto alla versione semistagionata. Al palato si distingue per una sapidità più pronunciata e una persistenza aromatica avvolgente, che valorizzano tutta la ricchezza e la complessità del latte di pecora, mantenendo un piacevole equilibrio gustativo.',
  ),
  ingredients: it('Latte ovino pastorizzato, caglio, fermenti lattici, sale'),
  details: [d('Stagionatura', '9 mesi')],
  images: [img('p23-glq010', 23, 'Caciotta di pecora Il Maxi Superlativo confezionata')],
})

/* ====================================================================== MIELE */
const honeyImg = (name: string) =>
  // Clean transparent cutout of the p. 23 range photo (reflection removed); original crop p23-honey kept on disk.
  img('p23-miele-clean', 23, `Vasetti della linea miele (immagine di gamma) — ${name.toLowerCase()}`, 'range')
const honey: [string, [string, string][]][] = [
  ['MIELE DI AILANTO ITALIA', [['NQAF001', '45 g'], ['NQAF002', '500 g'], ['NQAF003', '1000 g']]],
  ['MIELE DI CASTAGNO ITALIA', [['NQAF004', '500 g'], ['NQAF005', '1000 g']]],
  ['MIELE DI ERICA ITALIA', [['NQAF006', '500 g']]],
  ['MIELE MILLEFIORI ITALIA', [['NQAF008', '500 g'], ['NQAF009', '1000 g']]],
  ['MIELE SULLA BIO ITALIA', [['NQAF010', '500 g'], ['NQAF011', '1000 g']]],
  ['MIELE DI MACCHIA ITALIA MEDITERRANEO', [['NQAF007', '1000 g']]],
]
for (const [name, vs] of honey) {
  add({
    sourceName: name,
    displayName: name === 'MIELE SULLA BIO ITALIA' ? 'Miele di Sulla BIO Italia' : undefined,
    category: 'miele',
    variants: vs.map(([c, s]) => v(c, s, 23)),
    origin: it('Italia (indicato nel nome di catalogo)'),
    images: [honeyImg(name)],
    notes: [
      'Il catalogo mostra un’unica fotografia per tutta la linea miele: l’immagine non identifica il singolo vasetto.',
      ...(name === 'MIELE SULLA BIO ITALIA' ? ['Il nome stampato è "MIELE SULLA BIO ITALIA"; la dicitura di visualizzazione aggiunge "di".'] : []),
    ],
  })
}

/* ========================================================= SOTTOLI E CONSERVE */
type Cons = [name: string, variants: [string, string, string?][], page: number, key: string, scope?: ImageScope]
const conserve: Cons[] = [
  ['CARCIOFI ARROSTITI ALL’OLIO', [['NQC1404', '580 g'], ['NQC1405', '1062 g'], ['NQC1406', '3100 g']], 24, 'p24-g0'],
  ['CARCIOFI INTERI ALL’OLIO', [['NQC1401', '500 g'], ['NQC1402', '1062 g'], ['NQC1403', '3100 g']], 24, 'p24-g1'],
  ['FRIARELLI ALL’OLIO', [['NQC1429', '580 g'], ['NQC1430', '1062 g'], ['NQC1431', '3100 g']], 24, 'p24-g2'],
  ['FUNGHI DI MUSCHIO ALL’OLIO', [['NQC1415', '580 g'], ['NQC1416', '1062 g'], ['NQC1417', '3100 g']], 24, 'p24-g3'],
  ['FUNGHI ORECCHIETTE ARROSTITE ALL’OLIO', [['NQC1412', '580 g'], ['NQC1411', '580 g', 'Orcio'], ['NQC1413', '1062 g'], ['NQC1414', '3100 g']], 24, 'p24-g4'],
  ['FUNGHI PIOPPINI AL NATURALE', [['NQC1410', '580 g']], 24, 'p24-g5', 'range'],
  ['FUNGHI PIOPPINI ALL’OLIO', [['NQC1407', '580 g'], ['NQC1408', '1062 g'], ['NQC1409', '3100 g']], 24, 'p24-g5'],
  ['MELANZANE A FETTE ALL’OLIO', [['NQC1421', '580 g'], ['NQC1422', '3100 g']], 24, 'p24-g6'],
  ['MELANZANE A INVOLTINI ALL’OLIO', [['NQC1423', '580 g'], ['NQC1424', '3100 g']], 25, 'p25-g0'],
  ['MELANZANE A FILETTI ALL’OLIO', [['NQC1418', '580 g'], ['NQC1419', '1062 g'], ['NQC1420', '3100 g']], 25, 'p25-g1'],
  ['PEPERONATA ALLA CONTADINA ALL’OLIO', [['NQC1426', '580 g'], ['NQC1427', '1062 g'], ['NQC1428', '3100 g']], 25, 'p25-g2'],
  ['SCAROLE CON OLIVE E CAPPERI', [['NQC1432', '580 g'], ['NQC1433', '1062 g'], ['NQC1434', '3100 g']], 25, 'p25-g3'],
  ['PEPERONI ARROSTITI ORCIO', [['NQC1425', '580 g']], 25, 'p25-g4'],
]
for (const [name, vs, page, key, scope] of conserve) {
  add({
    sourceName: name,
    category: 'conserve',
    subcategory: 'Sottoli',
    variants: vs.map(([c, s, l]) => v(c, s, page, l)),
    images: [img(key, page, `Vasetto ${name.toLowerCase()}`, scope ?? (vs.length > 1 ? 'family' : 'exact'))],
    ...(name === 'FUNGHI PIOPPINI AL NATURALE'
      ? { notes: ['Il catalogo usa la stessa fotografia per i funghi pioppini al naturale e all’olio.'] }
      : {}),
    ...(name === 'PEPERONI ARROSTITI ORCIO'
      ? { notes: ['Testo di catalogo: "PEPERONI ARROSTITI ORCIO DA 580 g".'] }
      : {}),
  })
}
add({
  sourceName: 'PESCHE ALLO SCIROPPO ORCIO',
  category: 'conserve',
  subcategory: 'Frutta sciroppata',
  variants: [v('NQC1435', '580 g', 25)],
  images: [img('p25-g5', 25, 'Orcio di pesche allo sciroppo')],
})
add({
  sourceName: 'POMODORI PELATI SAN MARZANO',
  category: 'conserve',
  subcategory: 'Pomodoro',
  variants: [v('GLQ006', '2,5 kg', 25, 'Scatola 6 x 2,5 kg')],
  images: [img('p25-glq006', 25, 'Latta di pomodori pelati Golosaqualità')],
  notes: ['Codice stampato "GLQ 006" (con spazio), normalizzato in GLQ006.'],
})
add({
  sourceName: 'PASSATA DI POMODORO',
  category: 'conserve',
  subcategory: 'Pomodoro',
  variants: [v('GLQ007', '690 g', 25, 'Scatola 12 bottiglie da 690 g')],
  images: [img('p25-glq007', 25, 'Bottiglia di passata di pomodoro Golosaqualità')],
  notes: ['Codice stampato "GLQ 007" (con spazio), normalizzato in GLQ007.'],
})

/* ============================================================ TONNO E MARE */
add({
  sourceName: 'COLATURA ALICI',
  category: 'tonno',
  subcategory: 'Alici',
  variants: [v('NQG304', '100 ml', 26)],
  description: it(
    'Dalle alici sapientemente lavorate e alternate, in botti di castagno, a strati di sale marino grosso, si giunge alla spillatura di un’essenza unica. Prodotto raro e prezioso, la colatura di alici è un condimento sapido e corposo, noto già in epoca romana e sempre più apprezzato e ricercato oggi sulle nostre tavole.',
  ),
  images: [img('p26-g0', 26, 'Bottiglia di colatura di alici')],
})
add({
  sourceName: 'TOCCHETTI TONNO ROSSO',
  category: 'tonno',
  subcategory: 'Tonno',
  variants: [v('NQG312', '220 g', 26)],
  description: it(
    'Utilizzando solo tonni interi tagliati manualmente in tocchetti per insalate, primi piatti, ed aperitivi originali. I tocchetti di tonno rosso sono tagliati esclusivamente a mano, solo da tonni interi e nel rispetto dei tempi della tradizionale cottura in pentola con acqua e sale marino. Conservati in pregiato olio di oliva sono un prodotto…',
  ),
  images: [img('p26-g1', 26, 'Vasetto di tocchetti di tonno rosso')],
  notes: ['La descrizione nel catalogo è troncata ("…sono un prodotto").'],
  verification: 'partial',
})
add({
  sourceName: 'TONNO ROSSO',
  category: 'tonno',
  subcategory: 'Tonno',
  variants: [v('NQG301', '310 g', 26), v('NQG302', '575 g', 26)],
  description: it(
    'Il Tonno Rosso, la varietà più pregiata tra i pesci pelagici, ha carne tonica e morbida grazie alla sua dieta ricca di pesci azzurri e alla sua abilità di nuotare per lunghi tratti. Ricco di proteine, omega 3 e grassi essenziali, è ideale per contrastare colesterolo, invecchiamento cellulare e anemia. Pescato nel Mar Mediterraneo viene cotto esclusivamente in acqua bollente e sale marino, conservato in pregiato olio di oliva e tagliato artigianalmente in filetti.',
  ),
  origin: it('Pescato nel Mar Mediterraneo (come indicato nel catalogo)'),
  images: [img('p26-g2', 26, 'Vasetti di tonno rosso in due formati', 'family')],
  notes: [
    'La descrizione contiene indicazioni salutistiche ("ideale per contrastare colesterolo…"): riportate come da fonte, da verificare per conformità normativa prima della pubblicazione.',
  ],
  verification: 'partial',
})
add({
  sourceName: 'TONNETTO ALLETTERATO',
  category: 'tonno',
  subcategory: 'Tonno',
  variants: [v('NQG310', '220 g', 26), v('NQG311', '310 g', 26)],
  description: it(
    'Il Tonnetto o Alletterato si distingue dagli altri tonni principalmente per i particolari disegni neri irregolari sul dorso, che sembrano delle scritture fatte da lettere e simboli (da qui il nome alletterato). Dal sapore intenso e selvaggio, con dimensioni che non superano i 15kg, le sue carni sono molto apprezzate dagli intenditori del gusto e ricche di proprietà organolettiche come lipidi semi-essenziali e omega 3',
  ),
  images: [img('p26-g3', 26, 'Vasetti di tonnetto alletterato in due formati', 'family')],
})
add({
  sourceName: 'FILETTI DI TONNO ALALUNGA',
  category: 'tonno',
  subcategory: 'Tonno',
  variants: [v('NQG309', '220 g', 26), v('NQG307', '310 g', 26), v('NQG303', '575 g', 26)],
  description: it(
    'L’alalunga o tonno bianco (per il colore della sua carne) è un pesce pregiato, noto per la delicatezza delle sue carni che, oltre ad essere squisite e sode, sono povere di grassi e in definitiva ottime dal punto di vista nutrizionale. Il tonno bianco viene cotto esclusivamente in acqua e sale marino, vero sinonimo di qualità e tradizione, contrariamente alle industrializzate cotture…',
  ),
  images: [img('p26-g4', 26, 'Vasetti di filetti di tonno alalunga in tre formati', 'family')],
  notes: ['La descrizione nel catalogo è troncata ("…contrariamente alle industrializzate cotture").'],
  verification: 'partial',
})

/* =================================================================== TARTUFI */
add({
  sourceName: 'CREMOSA AL TARTUFO',
  category: 'tartufi',
  subcategory: 'Creme e condimenti',
  variants: [v('NQMT1301', '90 g', 27), v('NQMT1302', '180 g', 27), v('NQMT1303', '500 g', 27)],
  description: it('CONDIMENTO A BASE DI FORMAGGI E TARTUFI'),
  ingredients: it(
    'Besciamella (LATTE intero, PANNA, farina di FRUMENTO, amido di mais, sale), PANNA, mascarpone (crema di LATTE pastorizzato, LATTE pastorizzato, correttore di acidità: E330), Parmigiano Reggiano (LATTE, sale, …',
  ),
  images: [img('p27-g0', 27, 'Vasetto di cremosa al tartufo', 'family')],
  notes: ['L’elenco ingredienti nel catalogo è troncato dopo "Parmigiano Reggiano (LATTE, sale,".'],
  verification: 'partial',
})
add({
  sourceName: 'CREMA REGINA AL TARTUFO BIANCO',
  category: 'tartufi',
  subcategory: 'Creme e condimenti',
  variants: [v('NQMT1310', '90 g', 27), v('NQMT1311', '180 g', 27), v('NQMT1312', '500 g', 27)],
  description: it('CONDIMENTO A BASE DI FORMAGGI E TARTUFO'),
  ingredients: it(
    'Besciamella (LATTE intero, PANNA, farina di FRUMENTO, amido di mais, sale), PANNA, mascarpone (crema di LATTE, LATTE fresco pastorizzato 24%, correttore di acidità: E330), Parmigiano Reggiano (LATTE, sale, …',
  ),
  images: [img('p27-g1', 27, 'Vasetto di crema regina al tartufo bianco', 'family')],
  notes: ['L’elenco ingredienti nel catalogo è troncato dopo "Parmigiano Reggiano (LATTE, sale,".'],
  verification: 'partial',
})
add({
  sourceName: 'CONDIMENTO A BASE DI BURRO E TARTUFO',
  category: 'tartufi',
  subcategory: 'Creme e condimenti',
  variants: [v('NQMT1313', '90 g', 27), v('NQMT1314', '180 g', 27), v('NQMT1316', '500 g', 27)],
  ingredients: it(
    'BURRO 95%, tartufo bianchetto (Tuber borchii Vitt.) 2% (ORIGINE: ITALIA), tartufo estivo (Tuber aestivum Vitt.) 2% (ORIGINE: ITALIA), aroma, sale. Può contenere tracce o spore del genere tuber spp.',
  ),
  origin: it('Tartufo: origine Italia (come indicato negli ingredienti)'),
  images: [img('p27-g2', 27, 'Vasetto di condimento a base di burro e tartufo', 'family')],
})
add({
  sourceName: 'CONDIMENTO A BASE DI BURRO E TARTUFO ESTIVO',
  category: 'tartufi',
  subcategory: 'Creme e condimenti',
  variants: [v('NQMT1315', '500 g', 27)],
  ingredients: it(
    'BURRO 95%, tartufo estivo (Tuber aestivum Vitt.) 4% (ORIGINE: UE), aroma, sale. Può contenere tracce o spore del genere tuber spp.',
  ),
  origin: it('Tartufo: origine UE (come indicato negli ingredienti)'),
  images: [img('p27-g3', 27, 'Vasetto di condimento a base di burro e tartufo estivo')],
})
add({
  sourceName: 'CONDIMENTO AROMATIZZATO AL TARTUFO BIANCO',
  category: 'tartufi',
  subcategory: 'Creme e condimenti',
  variants: [v('NQMT1317', '250 ml', 27), v('NQMT1318', '500 ml', 27), v('NQMT1319', '5000 ml', 27)],
  ingredients: it(
    'OLIO 95%, tartufo bianchetto (Tuber borchii Vitt.) 2% (ORIGINE: ITALIA), tartufo estivo (Tuber aestivum Vitt.) 2% (ORIGINE: ITALIA), aroma, sale.',
  ),
  origin: it('Tartufo: origine Italia (come indicato negli ingredienti)'),
  images: [img('p27-g4', 27, 'Bottiglia di condimento aromatizzato al tartufo bianco', 'family')],
})
add({
  sourceName: 'BRICIOLA AL TARTUFO ESTIVO CONGELATO',
  category: 'tartufi',
  subcategory: 'Tartufo',
  variants: [v('NQMT1324', '70 g', 27)],
  ingredients: it('Tartufo estivo (Tuber Aestivum Vitt.), intero, spezzato, a fette o brisura.'),
  images: [img('p27-g5', 27, 'Tartufo estivo intero e a fette')],
})

/* ============================================================== DOPPIO SENSO */
add({
  sourceName: 'DOPPIO SENSO',
  displayName: 'Doppio Senso',
  category: 'doppio-senso',
  variants: [
    v('GLQ008', '0,1 l', 28, 'Baby'),
    v('GLQ004', '0,7 l', 28, 'Standard'),
    v('GLQ003', '0,7 l', 28, 'Special Edition'),
    v('GLQ005', '1,5 l', 28, 'Slim'),
    v('GLQ002', '1,5 l', 28, 'Bombolo'),
    v('GLQ001', '4,5 l', 28, 'Maxi'),
  ],
  description: it(
    'Doppio senso nasce dalla collaborazione tra Noi, la Qualità e la rinomata Distilleria Morelli, realtà artigianale italiana che produce alcolici dal 1911. L’obbiettivo era quello di creare un prodotto unico nel suo genere che unisca il gusto tradizionale del rum con l’innovazione del caramello salato.',
  ),
  details: [d('Gradazione', '35% vol'), d('In etichetta', 'Liquore a base di rum & caramello salato')],
  producer: 'Distilleria Morelli',
  images: [img('editorial/pdf-doppio-senso', 28, 'Bottiglia Doppio Senso su un tavolo in legno affacciato su un porto ligure', 'range')],
  notes: [
    'Il catalogo mostra le diverse bottiglie solo come sagome grafiche; l’unica fotografia raffigura il formato standard.',
    '"In etichetta" è trascritto dall’etichetta visibile nella fotografia del catalogo.',
  ],
})

/* ================================================================== ALCOLICI */
// p. 31 — printed as a price-list without photos or descriptions.
type Alc = [name: string, sub: string, variants: [string, string | undefined, string?][], note?: string]
const alcolici: Alc[] = [
  ['GRAPPA TOSCANA', 'Grappe', [['NQM002', '0,70'], ['NQM004', '1,50']]],
  ['GRAPPA TOSCANA INVECCHIATA', 'Grappe', [['NQM006', '0,70'], ['NQM008', '1,5']]],
  ['GRAPPA 40% BIANCA', 'Grappe', [['NQM011', '1,00']]],
  ['GRAPPA 98 INVECCHIATA', 'Grappe', [['NQM016', '0,70'], ['NQM018', '1,50', 'Magnum']]],
  ['GRAPPA DI MOSCATO', 'Grappe', [['NQM020', '0,70']]],
  ['GRAPPA MOSCATO RISERVA', 'Grappe', [['NQM021', '0,10']]],
  ['GRAPPA DI MOSCATO RISERVA', 'Grappe', [['NQM047', '4,50']]],
  ['DECANTER GRAPPA MOSCATO RISERVA', 'Grappe', [['NQM138', '0,70']]],
  ['GRAPPA CHIANTI', 'Grappe', [['NQM024', '0,70']]],
  ['GRAPPA CHIANTI RISERVA', 'Grappe', [['NQM026', '0,70']]],
  ['GRAPPA DI CHIANTI RISERVA', 'Grappe', [['NQM139', '4,50']]],
  ['GRAPPA DI BRUNELLO', 'Grappe', [['NQM031', '0,70']]],
  ['GRAPPA DI BRUNELLO RISERVA', 'Grappe', [['NQM056', '4,50']]],
  ['GRAPPA DI MORELLINO', 'Grappe', [['NQM046', '4,50']]],
  ['GRAPPA MIELE', 'Grappe', [['NQM033', '0,70'], ['NQM140', '0,50']]],
  ['GRAPPA 50 E 50 RISERVA', 'Grappe', [['NQM034', '0,70']]],
  ['GRAPPA STRAVECCHIA', 'Grappe', [['NQM035', '1,00']]],
  ['GRAPPA CRU 98', 'Grappe', [['NQM038', '0,70']]],
  ['GRAPPA CENTENARIO VS', 'Grappe', [['NQM041', undefined]], 'Formato non indicato nel catalogo.'],
  ['AMARO ALL’ARANCIA', 'Amari e liquori', [['NQM057', '0,70']]],
  ['AMARETTO DELLA TORRE', 'Amari e liquori', [['NQM059', '0,70']]],
  ['AMARO ETRUSCO', 'Amari e liquori', [['NQM062', '0,70'], ['NQM063', '1,00']]],
  ['AMARO V ERA', 'Amari e liquori', [['NQM064', '0,70']], 'Nome stampato "AMARO V ERA": possibile spaziatura errata, conservato come da fonte.'],
  ['ARANCINO', 'Amari e liquori', [['NQM068', '0,50']]],
  ['LIMONCINO', 'Amari e liquori', [['NQM072', '0,50'], ['NQM073', '1,00']]],
  ['LIQUORE RABARBARO', 'Amari e liquori', [['NQM075', '0,70']]],
  ['LIQUORE PINOLO', 'Amari e liquori', [['NQM092', '0,50']]],
  ['LIQUORE PISTACCHIO', 'Amari e liquori', [['NQM093', '0,50']]],
  ['LIQUORE MELONCINO', 'Amari e liquori', [['NQM142', '0,50']], 'Formato stampato come "50CL".'],
  ['LIQUORE RHUM E MIELE 25%', 'Amari e liquori', [['NQM091', '0,70']]],
  ['SAMBUCA', 'Amari e liquori', [['NQM122', '0,70']]],
  ['SAMBUCA AL CAFFE', 'Amari e liquori', [['NQM125', '0,70']]],
  ['SPIRITO DI CAFFE', 'Spiriti', [['NQM079', '0,70']]],
  ['SPIRITO DI MIRTILLO', 'Spiriti', [['NQM080', '0,70']]],
  ['SPIRITO DI LIQUIRIZIA', 'Spiriti', [['NQM081', '0,70']]],
  ['SPIRITO DI FRAGOLA', 'Spiriti', [['NQM082', '0,70']]],
  ['SPIRITO DI CILIEGIA', 'Spiriti', [['NQM083', '0,70']]],
  ['SPIRITO DI CACAO', 'Spiriti', [['NQM084', '0,70']]],
  ['SPIRITO DI NOCE', 'Spiriti', [['NQM085', '0,70']]],
  ['RHUM INVECCHIATO 40%', 'Rhum e gin', [['NQM089', '0,70']]],
  ['RHUM AL PONCE ALLA TOSCANA 40%', 'Rhum e gin', [['NQM090', '0,70']]],
  ['GIN BOTANICO', 'Rhum e gin', [['NQM094', '0,70']]],
  ['GIN BOTANICO TIMO E CAMOMILLA', 'Rhum e gin', [['NQM143', '0,70']]],
  ['GIN FONDATORE', 'Rhum e gin', [['NQM095', '1,00'], ['NQM096', '1,50']]],
  ['GIN ZAFFERANO', 'Rhum e gin', [['NQM097', '0,70']]],
  ['CREME VARIO GENERE ARANCINO', 'Creme', [['NQM099', '0,50'], ['NQM100', '1,00']]],
  ['CREME VARIO GENERE IRIS', 'Creme', [['NQM102', '0,50'], ['NQM103', '1,00']]],
  ['CREME VARIO GENERE CAFFE', 'Creme', [['NQM105', '0,50'], ['NQM106', '1,00']]],
  ['CREME VARIO GENERE FRAGOLA', 'Creme', [['NQM107', '0,50'], ['NQM108', '1,00']]],
  ['CREME VARIO GENERE FIOR DI LATTE', 'Creme', [['NQM110', '0,50'], ['NQM111', '1,00']]],
  ['CREME VARIO GENERE GIANDUIA', 'Creme', [['NQM113', '0,50'], ['NQM114', '1,00']]],
  ['CREME VARIO GENERE CARAIBI', 'Creme', [['NQM116', '0,50'], ['NQM117', '1,00']]],
  ['CREME VARIO GENERE PISTACCHIO', 'Creme', [['NQM120', '0,50'], ['NQM118', '1,00']]],
  ['CREME VARIO GENERE CIOCCOLATO', 'Creme', [['NQM144', '0,50']]],
  ['CREME VARIO GENERE MELONCELLO', 'Creme', [['NQM145', '0,50'], ['NQM146', '1,00']]],
  ['CREME VARIO GENERE BANANA', 'Creme', [['NQM147', '0,50']]],
  ['CREME VARIO GENERE MENTA', 'Creme', [['NQM148', '0,50']]],
  ['BITTER', 'Aperitivi e bitter', [['NQM127', '1,00'], ['NQM128', '1,50']]],
  ['APERITIVO DI TOSCANA', 'Aperitivi e bitter', [['NQM129', '1,00'], ['NQM130', '1,50']]],
  ['APRICOT', 'Aperitivi e bitter', [['NQM131', '1,00'], ['NQM132', '1,50']]],
  ['TRIPLESEC', 'Aperitivi e bitter', [['NQM133', '1,00']]],
]
for (const [name, sub, vs, note] of alcolici) {
  add({
    sourceName: name,
    category: 'alcolici',
    subcategory: sub,
    variants: vs.map(([c, s, l]) => v(c, s ? `${s} l` : undefined, 31, l)),
    images: [],
    notes: [
      'Il catalogo riporta per gli alcolici solo codice, nome e formato (senza unità di misura: il litro è dedotto dal contesto, p. 31). Nessuna fotografia individuale disponibile.',
      ...(note ? [note] : []),
    ],
    verification: 'partial',
  })
}

/* ================================================================== assemble */

const usedSlugs = new Set<string>()
const usedIds = new Set<string>()
export const products: ProductFamily[] = families.map((f, i) => {
  // Ids derive from the first catalogue code; the PDF prints NQS421 twice, so de-duplicate.
  let id = f.variants[0].code.toLowerCase()
  if (usedIds.has(id)) id = `${id}-${slugify(f.sourceName).split('-')[0]}`
  usedIds.add(id)
  const base = f.slug ?? slugify(f.displayName ?? f.sourceName)
  let slug = base
  for (let n = 2; usedSlugs.has(slug); n++) slug = `${base}-${n}`
  usedSlugs.add(slug)
  const pages = Array.from(new Set([...f.variants.map((x) => x.sourcePage), ...f.images.map((x) => x.page)])).sort(
    (a, b) => a - b,
  )
  return {
    ...f,
    id,
    slug,
    catalogOrder: i + 1,
    sourcePages: pages,
    // Notes alone do not downgrade a record (many are about image scope or code formatting);
    // 'partial' / 'ambiguous' are set explicitly where data is missing or contradictory.
    verification: f.verification ?? 'verified',
  }
})

export const productBySlug = new Map(products.map((p) => [p.slug, p]))
export const productById = new Map(products.map((p) => [p.id, p]))

export const productsByCategory = (slug: CategorySlug) => products.filter((p) => p.category === slug)

/** Total number of catalogue codes (variants) — what the client counts as "articoli". */
export const totalCodes = products.reduce((n, p) => n + p.variants.length, 0)
