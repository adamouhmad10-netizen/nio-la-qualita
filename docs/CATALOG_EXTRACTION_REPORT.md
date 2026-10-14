# Catalogue extraction report

Source: `source/Catalogo_Linkato_10-9.pdf` — *Catalogo Prodotti 2026*, 32 A4 pages, Adobe InDesign CC export (10 Sep 2026).
Generated from `src/data/products.ts` by `scripts/report-data.mjs`; figures below are computed, not typed by hand.

## Method

1. **Inventory** — every page rendered to PNG and its text layer dumped (PyMuPDF 1.26). All product text is real, selectable text; no OCR was needed.
2. **Code harvest** — every catalogue code matched with `NQ…`/`GLQ…` patterns together with its position on the page (276 occurrences, 275 unique codes).
3. **Record building** — each page compared visually against its text layer (the text order in the PDF does not follow the visual layout), then transcribed into `src/data/products.ts` as product families with explicit variants.
4. **Cross-check** — an automated diff confirms every code printed in the PDF is present in the data and the data contains no code absent from the PDF (`missing: 0`, `extra: 0`).
5. **Images** — product photos cropped from the page renders at 300 dpi using the code/text positions; pages 5, 8 and 12 use the embedded originals (with their transparency masks). Every crop-to-code assignment was checked on contact sheets. A small set of soft-matted cut-outs was produced for the home showcase.
6. **Integrity** — `npm run check:data` verifies unique ids/slugs, code format, category references and that every referenced image file exists.

## Totals

| | Count |
|---|---|
| Product families (pages on the site) | **206** |
| Catalogue codes (variants) | **276** (275 unique — NQS421 printed twice) |
| Families with a catalogue photo | 145 |
| Families without a photo in the PDF | 61 (all in *Alcolici*, printed as a list) |
| Verified | 130 |
| Partial (truncated, inferred or inconsistent data in source) | 73 |
| Ambiguous (contradictory data, needs client confirmation) | 3 |

## By category

| # | Category | PDF heading | Pages | Families | Codes | With photo | Verified / partial / ambiguous |
|---|---|---|---|---|---|---|---|
| 1 | Pasta | VARIETÀ DI PASTA | 3–7 | 45 | 45 | 45 | 41 / 4 / 0 |
| 2 | Riso | VARIETÀ DI RISO | 8 | 9 | 11 | 9 | 9 / 0 / 0 |
| 3 | Salumi | VARIETÀ DI SALUMI | 9–12 | 14 | 18 | 14 | 11 / 1 / 2 |
| 4 | Formaggi | VARIETÀ DI FORMAGGI | 13–23 | 43 | 45 | 43 | 40 / 2 / 1 |
| 5 | Miele | MIELE | 23 | 6 | 11 | 6 | 6 / 0 / 0 |
| 6 | Sottoli e conserve | SOTTOLI | 24–25 | 16 | 37 | 16 | 16 / 0 / 0 |
| 7 | Tonno e specialità di mare | TONNO | 26 | 5 | 9 | 5 | 2 / 3 / 0 |
| 8 | Tartufi e condimenti | TARTUFI | 27 | 6 | 14 | 6 | 4 / 2 / 0 |
| 9 | Doppio Senso | DOPPIO SENSO | 28 | 1 | 6 | 1 | 1 / 0 / 0 |
| 10 | Alcolici | ALCOLICI | 30–31 | 61 | 80 | 0 | 0 / 61 / 0 |

## What each record contains

| Attribute | Source | Coverage |
|---|---|---|
| Code(s) + size per variant | printed next to each product | 206/206 |
| Verbatim description | Salumi, Formaggi, Tonno, Doppio Senso, NQTR cheeses | 59/206 |
| Ingredients | NQTR cheeses, Superlativo, Tartufi | 34/206 |
| Extra details (stagionatura, denominazione, gradazione…) | as printed | 31/206 |
| Origin | **only** where the catalogue states it | 12/206 |
| Producer | only where named (Prolongo, Distilleria Morelli) | 3/206 |
| Source page(s) | every record | 206/206 |

Pasta, riso, sottoli, miele and the spirits list carry **no descriptions in the PDF**; the site shows name, code and size only — nothing was written in their place.

A record with notes is not automatically downgraded: notes about image scope or code formatting leave it *verified*; *partial* marks missing/inferred/truncated data, *ambiguous* marks contradictions.

## Image fidelity

Each image is tagged with how precisely it represents the product (shown to visitors on the product page):

- **exact** (117) — the catalogue photo of that product.
- **family** (22) — one photo printed for several sizes of the same product (e.g. Prosciutto Parma, three tuna jar sizes).
- **range** (8) — one photo printed for a whole line (the six honeys share one picture; Doppio Senso's single bottle photo).
- **none** — the spirits page is a text list: these products get a typographic label in the category palette, never a stand-in photo.

Limitations: the PDF photos are small (typically 400–1100 px on the long side after cropping). They are served at ≤ 960 px and never stretched beyond their native size in layout; the Salumi photos are lifestyle shots on boards rather than packshots, exactly as printed.

## Ambiguities and corrections recorded (not silently fixed)

- **Mezzo pacchero** (NQE204, p. 3) — La confezione fotografata riporta "Mezzi Paccheri"; nome dal testo del catalogo.
- **Penne lisce o rigate** (NQE205, p. 3) — La confezione fotografata riporta solo "Penne Lisce".
- **Tubettoni lisci o rigati** (NQE206, p. 3) — La confezione fotografata riporta solo "Tubettoni".
- **Fusillone** (NQE209, p. 3) — La confezione fotografata riporta "Fusilloni".
- **Conchiglie rigate** (NQMVD2171, p. 7) — Il catalogo non indica la tipologia di sfarinato per questo formato.
- **Prosciutto Parma** (NQS407, NQS408, NQS409, NQS410, p. 10) — Il catalogo elenca quattro codici sotto un’unica descrizione e un unico peso: il peso indicato è riportato per tutte le varianti.
- **Lonzardo** (NQS421, p. 11) — Codice duplicato: NQS421 è stampato sia per LONZARDO sia per PROSCIUTTO SCELTO PER GOLOSA QUALITÀ CON OSSO (p. 11). Valore conservato come da fonte, da confermare con il cliente.
- **Prosciutto scelto per Golosa Qualità** (NQS421, NQS422, p. 11) — Codice duplicato: NQS421 è stampato anche per LONZARDO (p. 11). Da confermare con il cliente.
- **Caciocavallo affinato in grotta** (NQF903, NQF910, p. 13) — La stagionatura 90-120 gg è stampata accanto al solo codice NQF903 (1,6 kg).
- **Caciocava affinato in grotta** (NQF922, p. 14) — Nome stampato "CACIOCAVA": possibile refuso per "CACIOCAVALLO", conservato come da fonte.
- **Il Creto Gustoso al pepe rosa** (NQTR1710, p. 16) — Il nome indica "pepe rosa" ma denominazione e ingredienti riportano il peperoncino; il testo è identico a quello di NQTR1708. Da confermare con il cliente.
- **Poggio Conte** (NQTR1725, p. 18) — Le opzioni di affinamento non hanno codici separati nel catalogo.
- **Piradoro** (NQTR1751, p. 19) — La variante affinata con frutta passa non ha un codice separato nel catalogo.
- **Miele di ailanto Italia** (NQAF001, NQAF002, NQAF003, p. 23) — Il catalogo mostra un’unica fotografia per tutta la linea miele: l’immagine non identifica il singolo vasetto.
- **Miele di castagno Italia** (NQAF004, NQAF005, p. 23) — Il catalogo mostra un’unica fotografia per tutta la linea miele: l’immagine non identifica il singolo vasetto.
- **Miele di erica Italia** (NQAF006, p. 23) — Il catalogo mostra un’unica fotografia per tutta la linea miele: l’immagine non identifica il singolo vasetto.
- **Miele millefiori Italia** (NQAF008, NQAF009, p. 23) — Il catalogo mostra un’unica fotografia per tutta la linea miele: l’immagine non identifica il singolo vasetto.
- **Miele di Sulla BIO Italia** (NQAF010, NQAF011, p. 23) — Il catalogo mostra un’unica fotografia per tutta la linea miele: l’immagine non identifica il singolo vasetto.
- **Miele di Sulla BIO Italia** (NQAF010, NQAF011, p. 23) — Il nome stampato è "MIELE SULLA BIO ITALIA"; la dicitura di visualizzazione aggiunge "di".
- **Miele di macchia Italia Mediterraneo** (NQAF007, p. 23) — Il catalogo mostra un’unica fotografia per tutta la linea miele: l’immagine non identifica il singolo vasetto.
- **Funghi pioppini al naturale** (NQC1410, p. 24) — Il catalogo usa la stessa fotografia per i funghi pioppini al naturale e all’olio.
- **Peperoni arrostiti orcio** (NQC1425, p. 25) — Testo di catalogo: "PEPERONI ARROSTITI ORCIO DA 580 g".
- **Pomodori pelati San Marzano** (GLQ006, p. 25) — Codice stampato "GLQ 006" (con spazio), normalizzato in GLQ006.
- **Passata di pomodoro** (GLQ007, p. 25) — Codice stampato "GLQ 007" (con spazio), normalizzato in GLQ007.
- **Tocchetti tonno rosso** (NQG312, p. 26) — La descrizione nel catalogo è troncata ("…sono un prodotto").
- **Tonno rosso** (NQG301, NQG302, p. 26) — La descrizione contiene indicazioni salutistiche ("ideale per contrastare colesterolo…"): riportate come da fonte, da verificare per conformità normativa prima della pubblicazione.
- **Filetti di tonno alalunga** (NQG309, NQG307, NQG303, p. 26) — La descrizione nel catalogo è troncata ("…contrariamente alle industrializzate cotture").
- **Cremosa al tartufo** (NQMT1301, NQMT1302, NQMT1303, p. 27) — L’elenco ingredienti nel catalogo è troncato dopo "Parmigiano Reggiano (LATTE, sale,".
- **Crema Regina al tartufo bianco** (NQMT1310, NQMT1311, NQMT1312, p. 27) — L’elenco ingredienti nel catalogo è troncato dopo "Parmigiano Reggiano (LATTE, sale,".
- **Doppio Senso** (GLQ008, GLQ004, GLQ003, GLQ005, GLQ002, GLQ001, p. 28) — Il catalogo mostra le diverse bottiglie solo come sagome grafiche; l’unica fotografia raffigura il formato standard.
- **Doppio Senso** (GLQ008, GLQ004, GLQ003, GLQ005, GLQ002, GLQ001, p. 28) — "In etichetta" è trascritto dall’etichetta visibile nella fotografia del catalogo.
- **Alcolici (p. 31)** — 61 products/80 codes printed as a price-list without units; the litre unit is inferred from context and flagged on every record. `NQM041 GRAPPA CENTENARIO VS` has no size. `AMARO V ERA` kept as printed.

## Not extracted

- **Prices** — none appear in the PDF; none are shown.
- **Page 29** (full-page logo-on-road image) and **page 30** (Morelli display photos) have no product records; their photos are used editorially and labelled as catalogue images.
- **Page 2 links** — the index page contains 10 internal PDF links; they are reproduced by the site's category navigation.

## Full record list

### Pasta

| Code(s) | Name on site | Name in PDF | Size(s) | p. | Status |
|---|---|---|---|---|---|
| NQE217 | Spaghettoni | SPAGHETTONI | 500 g | 3 | verified |
| NQE204 | Mezzo pacchero | MEZZO PACCHERO | 500 g | 3 | partial |
| NQE202 | Lumaconi | LUMACONI | 500 g | 3 | verified |
| NQE203 | Mezze maniche | MEZZE MANICHE | 500 g | 3 | verified |
| NQE205 | Penne lisce o rigate | PENNE LISCE O RIGATE | 500 g | 3 | partial |
| NQE206 | Tubettoni lisci o rigati | TUBETTONI LISCI O RIGATI | 500 g | 3 | partial |
| NQE208 | Rigatoni | RIGATONI | 500 g | 3 | verified |
| NQE209 | Fusillone | FUSILLONE | 500 g | 3 | partial |
| NQE207 | Fettuccine | FETTUCCINE | 500 g | 4 | verified |
| NQE216 | Mafalde | MAFALDE | 500 g | 4 | verified |
| NQE210 | Linguine | LINGUINE | 500 g | 4 | verified |
| NQE213 | Paccheri | PACCHERI | 500 g | 4 | verified |
| NQE212 | Taccole | TACCOLE | 500 g | 4 | verified |
| NQE215 | Ziti tagliati | ZITI TAGLIATI | 500 g | 4 | verified |
| NQE211 | Pasta mista | PASTA MISTA | 500 g | 4 | verified |
| NQE214 | Tubettini | TUBETTINI | 500 g | 4 | verified |
| NQBM1201 | Tonnarelli di Campofilone | TONNARELLI DI CAMPOFILONE | 250 g | 5 | verified |
| NQBM1202 | Tagliatelle di Campofilone | TAGLIATELLE DI CAMPOFILONE | 250 g | 5 | verified |
| NQBM1203 | Pappardelle di Campofilone | PAPPARDELLE DI CAMPOFILONE | 250 g | 5 | verified |
| NQBM1204 | Fettuccine di Campofilone | FETTUCCINE DI CAMPOFILONE | 250 g | 5 | verified |
| NQBM1205 | Sfoglia per lasagna di Campofilone | SFOGLIA PER LASAGNA DI CAMPOFILONE | 250 g | 5 | verified |
| NQBM1206 | Maccheroncini di Campofilone | MACCHERONCINI DI CAMPOFILONE | 250 g | 5 | verified |
| NQBM1207 | Linguine di Campofilone | LINGUINE DI CAMPOFILONE | 250 g | 5 | verified |
| NQBM1208 | Fettuccine di Campofilone tartufo | FETTUCCINE DI CAMPOFILONE TARTUFO | 250 g | 5 | verified |
| NQBM1209 | Fettuccine di Campofilone funghi | FETTUCCINE DI CAMPOFILONE FUNGHI | 250 g | 5 | verified |
| NQBM1210 | Fettuccine di Campofilone peperoncino | FETTUCCINE DI CAMPOFILONE PEPERONCINO | 250 g | 5 | verified |
| NQBM1211 | Fettuccine di Campofilone zafferano | FETTUCCINE DI CAMPOFILONE ZAFFERANO | 250 g | 5 | verified |
| NQMVD2101 | Pici semola integrale | PICI SEMOLA INTEGRALE | 500 g | 6 | verified |
| NQMVD2102 | Pappardelle semola integrale | PAPPARDELLE SEMOLA INTEGRALE | 500 g | 6 | verified |
| NQMVD2103 | Tagliatelle semola integrale | TAGLIATELLE SEMOLA INTEGRALE | 500 g | 6 | verified |
| NQMVD2105 | Spaghettoni con curva semola integrale | SPAGHETTONI CON CURVA SEMOLA INTEGRALE | 400 g | 6 | verified |
| NQMVD2106 | Linguine con curva semola integrale | LINGUINE CON CURVA SEMOLA INTEGRALE | 400 g | 6 | verified |
| NQMVD2104 | Tagliolini semola integrale | TAGLIOLINI SEMOLA INTEGRALE | 400 g | 6 | verified |
| NQMVD2107 | Paccheri semola integrale | PACCHERI SEMOLA INTEGRALE | 500 g | 6 | verified |
| NQMVD2108 | Mezzi paccheri semola integrale | MEZZI PACCHERI SEMOLA INTEGRALE | 500 g | 6 | verified |
| NQMVD2109 | Penne semola integrale | PENNE SEMOLA INTEGRALE | 500 g | 6 | verified |
| NQMVD2110 | Fusilloni rigati semola integrale | FUSILLONI RIGATI SEMOLA INTEGRALE | 500 g | 7 | verified |
| NQMVD2111 | Rigatoni semola integrale | RIGATONI SEMOLA INTEGRALE | 500 g | 7 | verified |
| NQMVD2112 | Casarecce semola integrale | CASARECCE SEMOLA INTEGRALE | 500 g | 7 | verified |
| NQMVD2113 | Tubetti rigati semola integrale | TUBETTI RIGATI SEMOLA INTEGRALE | 500 g | 7 | verified |
| NQMVD2114 | Tempestine semola integrale | TEMPESTINE SEMOLA INTEGRALE | 500 g | 7 | verified |
| NQMVD2171 | Conchiglie rigate | CONCHIGLIE RIGATE | 160 g | 7 | verified |
| NQMVD2138 | Fusilli farro monococco | FUSILLI FARRO MONOCOCCO | 500 g | 7 | verified |
| NQMVD2139 | Pennette farro monococco | PENNETTE FARRO MONOCOCCO | 500 g | 7 | verified |
| NQMVD2140 | Tagliatelle farro monococco | TAGLIATELLE FARRO MONOCOCCO | 500 g | 7 | verified |

### Riso

| Code(s) | Name on site | Name in PDF | Size(s) | p. | Status |
|---|---|---|---|---|---|
| NQRA1101 · NQRA1105 | Riso Carnaroli | RISO CARNAROLI | 1 kg · 500 g | 8 | verified |
| NQRA1102 · NQRA1106 | Riso Arborio | RISO ARBORIO | 1 kg · 500 g | 8 | verified |
| NQRA1103 | Riso Baldo | RISO BALDO | 1 kg | 8 | verified |
| NQRA1104 | Riso Roma | RISO ROMA | 1 kg | 8 | verified |
| NQRA1107 | Riso nero integrale medio | RISO NERO INTEGRALE MEDIO | 500 g | 8 | verified |
| NQRA1108 | Riso rosso integrale lungo | RISO ROSSO INTEGRALE LUNGO | 500 g | 8 | verified |
| NQRA1109 | Riso Grancavour | RISO GRANCAVOUR | 500 g | 8 | verified |
| NQRA1110 | Riso Rubinum | RISO RUBINUM | 500 g | 8 | verified |
| NQRA1111 | Riso Ebano | RISO EBANO | 500 g | 8 | verified |

### Salumi

| Code(s) | Name on site | Name in PDF | Size(s) | p. | Status |
|---|---|---|---|---|---|
| NQS401 | Salame Strolghino | SALAME STROLGHINO | peso variabile da 0,2 a 0,3 kg | 9 | verified |
| NQS402 | Salame Mariola | SALAME MARIOLA | peso variabile da 0,6 kg | 9 | verified |
| NQS404 | Spalla cotto | SPALLA COTTO | peso variabile da 7,5 a 8,0 kg | 9 | verified |
| NQS405 | Cuor di prosciutto | CUOR DI PROSCIUTTO | peso variabile da 5,0 kg | 9 | verified |
| NQS406 | Gola guanciale | GOLA GUANCIALE | peso variabile da 1,0 a 1,5 kg | 10 | verified |
| NQS407 · NQS408 · NQS409 · NQS410 | Prosciutto Parma | PROSCIUTTO PARMA | 24 mesi con osso: peso variabile da 7,0 a 8,5 kg · 24 mesi senza osso: peso variabile da 7,0 a 8,5 kg · 30 mesi con osso: peso variabile da 7,0 a 8,5 kg · 30 mesi senza osso: peso variabile da 7,0 a 8,5 kg | 10 | partial |
| NQS403 | Mortadella nostrana con pistacchi | MORTADELLA NOSTRANA CON PISTACCHI | peso variabile da 6,0 kg | 10 | verified |
| NQS421 | Lonzardo | LONZARDO | peso variabile da 1,5 a 3,0 kg | 11 | ambiguous |
| NQR100 | Lardo nostrano | LARDO NOSTRANO | peso variabile da 0,4 a 3,0 kg | 11 | verified |
| NQS421 · NQS422 | Prosciutto scelto per Golosa Qualità | PROSCIUTTO SCELTO PER GOLOSA QUALITÀ | con osso: peso variabile da 6,0 a 9,0 kg · senza osso: peso variabile da 6,0 a 9,0 kg | 11 | ambiguous |
| NQP501 | Prosciutto San Daniele con osso | PROSCIUTTO SAN DANIELE CON OSSO | peso variabile da 6,0 a 9,0 kg | 12 | verified |
| NQP502 | Prosciutto San Daniele disossato non pressato | PROSCIUTTO SAN DANIELE DISOSSATO NON PRESSATO | peso variabile da 6,0 a 9,0 kg | 12 | verified |
| NQP503 | Prosciutto San Daniele disossato riservato legato a mano | PROSCIUTTO SAN DANIELE DISOSSATO RISERVATO LEGATO A MANO | peso variabile da 6,0 a 9,0 kg | 12 | verified |
| NQP504 | Prosciutto San Daniele pronto fetta | PROSCIUTTO SAN DANIELE PRONTO FETTA | peso variabile da 4,0 a 5,0 kg | 12 | verified |

### Formaggi

| Code(s) | Name on site | Name in PDF | Size(s) | p. | Status |
|---|---|---|---|---|---|
| NQF903 · NQF910 | Caciocavallo affinato in grotta | CACIOCAVALLO AFFINATO IN GROTTA | 1,6 kg · 5 kg | 13 | partial |
| NQF905 | Caciocavallo affinato in vinaccia | CACIOCAVALLO AFFINATO IN VINACCIA | 1,6 kg | 13 | verified |
| NQF908 | Caciocavallo affumicato | CACIOCAVALLO AFFUMICATO | 1,4 kg | 13 | verified |
| NQF907 | Caciocavallo al peperoncino | CACIOCAVALLO AL PEPERONCINO | 1,4 kg | 13 | verified |
| NQF904 | Caciocavallo stravecchio | CACIOCAVALLO STRAVECCHIO | 1,5 kg | 14 | verified |
| NQF906 | Caciocavallo al tartufo | CACIOCAVALLO AL TARTUFO | 1,3 kg | 14 | verified |
| NQF902 | Caciocavallo fresco | CACIOCAVALLO FRESCO | 1,1 kg | 14 | verified |
| NQF911 · NQF912 | Caciocavallo occhio dolce | CACIOCAVALLO OCCHIO DOLCE | 5 kg · 10 kg | 14 | verified |
| NQF922 | Caciocava affinato in grotta | CACIOCAVA AFFINATO IN GROTTA | 5 kg | 14 | partial |
| NQF919 | Caciotta giovane di capra “Bertu” | CACIOTTA GIOVANE DI CAPRA “BERTU” | 1,8 kg | 15 | verified |
| NQF916 | Caciotta giovane di pecora Biasu | CACIOTTA GIOVANE DI PECORA BIASU | 3 kg | 15 | verified |
| NQF917 | Pecorino Bustianu | PECORINO BUSTIANU | 3,5 kg | 15 | verified |
| NQF918 | Pecorino maturo Bobore | PECORINO MATURO BOBORE | 5,2 kg | 15 | verified |
| NQF923 | “Cilentano” formaggio pecorino semistagionato | “CILENTANO” FORMAGGIO PECORINO SEMISTAGIONATO | 2,5 kg | 15 | verified |
| NQF924 | “In grotta” | “IN GROTTA” | 3,0 kg | 15 | verified |
| NQTR1704 | La Regina Bianca | LA REGINA BIANCA | 1,5–2,0 kg | 16 | verified |
| NQTR1707 | L’Ambasciatrice | L’AMBASCIATRICE | 1,5–2,0 kg | 16 | verified |
| NQTR1709 | Il Creto Gustoso al pepe nero | IL CRETO GUSTOSO AL PEPE NERO | 1,5–2,8 kg | 16 | verified |
| NQTR1710 | Il Creto Gustoso al pepe rosa | IL CRETO GUSTOSO AL PEPE ROSA | 1,1–2,5 kg | 16 | ambiguous |
| NQTR1712 | Il Don Carmelo | IL DON CARMELO | 0,5–1,0 kg | 17 | verified |
| NQTR1719 | Granducato di Castro Riserva | GRANDUCATO DI CASTRO RISERVA | 4,0–5,0 kg | 17 | verified |
| NQTR1717 | Il Riserva Ducato di Castro | IL RISERVA DUCATO DI CASTRO | 3,0 kg | 17 | verified |
| NQTR1718 | L’Innominato Ducato di Castro | L’INNOMINATO DUCATO DI CASTRO | 1,1–2,5 kg | 17 | verified |
| NQTR1711 | Il Qualitoso | IL QUALITOSO | 1,5–2,8 kg | 18 | verified |
| NQTR1708 | Il Fiore di Giglio di Castro | IL FIORE DI GIGLIO DI CASTRO | 1,1–2,5 kg | 18 | verified |
| NQTR1725 | Poggio Conte | POGGIO CONTE | 0,4–3,0 kg | 18 | verified |
| NQTR1729 | Di Conte | DI CONTE | 0,5–1,0 kg | 18 | verified |
| NQTR1735 | La Gran Giulia | LA GRAN GIULIA | 4,0–5,0 kg | 19 | verified |
| NQTR1748 | La Rosetta di mucca | LA ROSETTA DI MUCCA | 1,1–2,5 kg | 19 | verified |
| NQTR1751 | Piradoro | PIRADORO | 3,5–4,5 kg | 19 | verified |
| NQTR1749 | Il Pira Gustoso | IL PIRA GUSTOSO | 0,5–1,0 kg | 19 | verified |
| NQTR1715 | Il Super Tomato Reale | IL SUPER TOMATO REALE | 2,8–4,0 kg | 20 | verified |
| NQTR1731 | Blu Dolce erborinato | BLU DOLCE ERBORINATO | 2,8–3,5 kg | 20 | verified |
| NQTR1706 | L’Ovale | L’OVALE | 1,5–2,0 kg | 20 | verified |
| NQTR1705 | Bianca Verde | BIANCA VERDE | 1,5–2,0 kg | 20 | verified |
| NQTR1720 | L’Aromatico rosmarino | L’AROMATICO ROSMARINO | 1,2–3,0 kg | 21 | verified |
| NQTR1720F | Il Fienile Gustoso | IL FIENILE GUSTOSO | 1,2–3,0 kg | 21 | verified |
| NQTR1720FM | Miele Farro | MIELE FARRO | 1,2–3,0 kg | 21 | verified |
| NQTR1720FN | Il Nocino in foglie | IL NOCINO IN FOGLIE | 1,2–3,0 kg | 22 | verified |
| NQTR1720CE | Al Ceriatoso | AL CERIATOSO | 1,2–3,0 kg | 22 | verified |
| NQTR1720PP | Il Fruttato | IL FRUTTATO | 1,2–3,0 kg | 22 | verified |
| GLQ009 | Caciotta di pecora Superlativo | CACIOTTA DI PECORA SUPERLATIVO | 1,5–1,8 kg | 23 | verified |
| GLQ010 | Caciotta di pecora “Il Maxi Superlativo” | CACIOTTA DI PECORA “IL MAXI SUPERLATIVO” | 2,5–3,0 kg | 23 | verified |

### Miele

| Code(s) | Name on site | Name in PDF | Size(s) | p. | Status |
|---|---|---|---|---|---|
| NQAF001 · NQAF002 · NQAF003 | Miele di ailanto Italia | MIELE DI AILANTO ITALIA | 45 g · 500 g · 1000 g | 23 | verified |
| NQAF004 · NQAF005 | Miele di castagno Italia | MIELE DI CASTAGNO ITALIA | 500 g · 1000 g | 23 | verified |
| NQAF006 | Miele di erica Italia | MIELE DI ERICA ITALIA | 500 g | 23 | verified |
| NQAF008 · NQAF009 | Miele millefiori Italia | MIELE MILLEFIORI ITALIA | 500 g · 1000 g | 23 | verified |
| NQAF010 · NQAF011 | Miele di Sulla BIO Italia | MIELE SULLA BIO ITALIA | 500 g · 1000 g | 23 | verified |
| NQAF007 | Miele di macchia Italia Mediterraneo | MIELE DI MACCHIA ITALIA MEDITERRANEO | 1000 g | 23 | verified |

### Sottoli e conserve

| Code(s) | Name on site | Name in PDF | Size(s) | p. | Status |
|---|---|---|---|---|---|
| NQC1404 · NQC1405 · NQC1406 | Carciofi arrostiti all’olio | CARCIOFI ARROSTITI ALL’OLIO | 580 g · 1062 g · 3100 g | 24 | verified |
| NQC1401 · NQC1402 · NQC1403 | Carciofi interi all’olio | CARCIOFI INTERI ALL’OLIO | 500 g · 1062 g · 3100 g | 24 | verified |
| NQC1429 · NQC1430 · NQC1431 | Friarelli all’olio | FRIARELLI ALL’OLIO | 580 g · 1062 g · 3100 g | 24 | verified |
| NQC1415 · NQC1416 · NQC1417 | Funghi di muschio all’olio | FUNGHI DI MUSCHIO ALL’OLIO | 580 g · 1062 g · 3100 g | 24 | verified |
| NQC1412 · NQC1411 · NQC1413 · NQC1414 | Funghi orecchiette arrostite all’olio | FUNGHI ORECCHIETTE ARROSTITE ALL’OLIO | 580 g · Orcio: 580 g · 1062 g · 3100 g | 24 | verified |
| NQC1410 | Funghi pioppini al naturale | FUNGHI PIOPPINI AL NATURALE | 580 g | 24 | verified |
| NQC1407 · NQC1408 · NQC1409 | Funghi pioppini all’olio | FUNGHI PIOPPINI ALL’OLIO | 580 g · 1062 g · 3100 g | 24 | verified |
| NQC1421 · NQC1422 | Melanzane a fette all’olio | MELANZANE A FETTE ALL’OLIO | 580 g · 3100 g | 24 | verified |
| NQC1423 · NQC1424 | Melanzane a involtini all’olio | MELANZANE A INVOLTINI ALL’OLIO | 580 g · 3100 g | 25 | verified |
| NQC1418 · NQC1419 · NQC1420 | Melanzane a filetti all’olio | MELANZANE A FILETTI ALL’OLIO | 580 g · 1062 g · 3100 g | 25 | verified |
| NQC1426 · NQC1427 · NQC1428 | Peperonata alla contadina all’olio | PEPERONATA ALLA CONTADINA ALL’OLIO | 580 g · 1062 g · 3100 g | 25 | verified |
| NQC1432 · NQC1433 · NQC1434 | Scarole con olive e capperi | SCAROLE CON OLIVE E CAPPERI | 580 g · 1062 g · 3100 g | 25 | verified |
| NQC1425 | Peperoni arrostiti orcio | PEPERONI ARROSTITI ORCIO | 580 g | 25 | verified |
| NQC1435 | Pesche allo sciroppo orcio | PESCHE ALLO SCIROPPO ORCIO | 580 g | 25 | verified |
| GLQ006 | Pomodori pelati San Marzano | POMODORI PELATI SAN MARZANO | Scatola 6 x 2,5 kg: 2,5 kg | 25 | verified |
| GLQ007 | Passata di pomodoro | PASSATA DI POMODORO | Scatola 12 bottiglie da 690 g: 690 g | 25 | verified |

### Tonno e specialità di mare

| Code(s) | Name on site | Name in PDF | Size(s) | p. | Status |
|---|---|---|---|---|---|
| NQG304 | Colatura alici | COLATURA ALICI | 100 ml | 26 | verified |
| NQG312 | Tocchetti tonno rosso | TOCCHETTI TONNO ROSSO | 220 g | 26 | partial |
| NQG301 · NQG302 | Tonno rosso | TONNO ROSSO | 310 g · 575 g | 26 | partial |
| NQG310 · NQG311 | Tonnetto alletterato | TONNETTO ALLETTERATO | 220 g · 310 g | 26 | verified |
| NQG309 · NQG307 · NQG303 | Filetti di tonno alalunga | FILETTI DI TONNO ALALUNGA | 220 g · 310 g · 575 g | 26 | partial |

### Tartufi e condimenti

| Code(s) | Name on site | Name in PDF | Size(s) | p. | Status |
|---|---|---|---|---|---|
| NQMT1301 · NQMT1302 · NQMT1303 | Cremosa al tartufo | CREMOSA AL TARTUFO | 90 g · 180 g · 500 g | 27 | partial |
| NQMT1310 · NQMT1311 · NQMT1312 | Crema Regina al tartufo bianco | CREMA REGINA AL TARTUFO BIANCO | 90 g · 180 g · 500 g | 27 | partial |
| NQMT1313 · NQMT1314 · NQMT1316 | Condimento a base di burro e tartufo | CONDIMENTO A BASE DI BURRO E TARTUFO | 90 g · 180 g · 500 g | 27 | verified |
| NQMT1315 | Condimento a base di burro e tartufo estivo | CONDIMENTO A BASE DI BURRO E TARTUFO ESTIVO | 500 g | 27 | verified |
| NQMT1317 · NQMT1318 · NQMT1319 | Condimento aromatizzato al tartufo bianco | CONDIMENTO AROMATIZZATO AL TARTUFO BIANCO | 250 ml · 500 ml · 5000 ml | 27 | verified |
| NQMT1324 | Briciola al tartufo estivo congelato | BRICIOLA AL TARTUFO ESTIVO CONGELATO | 70 g | 27 | verified |

### Doppio Senso

| Code(s) | Name on site | Name in PDF | Size(s) | p. | Status |
|---|---|---|---|---|---|
| GLQ008 · GLQ004 · GLQ003 · GLQ005 · GLQ002 · GLQ001 | Doppio Senso | DOPPIO SENSO | Baby: 0,1 l · Standard: 0,7 l · Special Edition: 0,7 l · Slim: 1,5 l · Bombolo: 1,5 l · Maxi: 4,5 l | 28 | verified |

### Alcolici

| Code(s) | Name on site | Name in PDF | Size(s) | p. | Status |
|---|---|---|---|---|---|
| NQM002 · NQM004 | Grappa Toscana | GRAPPA TOSCANA | 0,70 l · 1,50 l | 31 | partial |
| NQM006 · NQM008 | Grappa Toscana invecchiata | GRAPPA TOSCANA INVECCHIATA | 0,70 l · 1,5 l | 31 | partial |
| NQM011 | Grappa 40% bianca | GRAPPA 40% BIANCA | 1,00 l | 31 | partial |
| NQM016 · NQM018 | Grappa 98 invecchiata | GRAPPA 98 INVECCHIATA | 0,70 l · Magnum: 1,50 l | 31 | partial |
| NQM020 | Grappa di Moscato | GRAPPA DI MOSCATO | 0,70 l | 31 | partial |
| NQM021 | Grappa Moscato Riserva | GRAPPA MOSCATO RISERVA | 0,10 l | 31 | partial |
| NQM047 | Grappa di Moscato Riserva | GRAPPA DI MOSCATO RISERVA | 4,50 l | 31 | partial |
| NQM138 | Decanter grappa Moscato Riserva | DECANTER GRAPPA MOSCATO RISERVA | 0,70 l | 31 | partial |
| NQM024 | Grappa Chianti | GRAPPA CHIANTI | 0,70 l | 31 | partial |
| NQM026 | Grappa Chianti Riserva | GRAPPA CHIANTI RISERVA | 0,70 l | 31 | partial |
| NQM139 | Grappa di Chianti Riserva | GRAPPA DI CHIANTI RISERVA | 4,50 l | 31 | partial |
| NQM031 | Grappa di Brunello | GRAPPA DI BRUNELLO | 0,70 l | 31 | partial |
| NQM056 | Grappa di Brunello Riserva | GRAPPA DI BRUNELLO RISERVA | 4,50 l | 31 | partial |
| NQM046 | Grappa di Morellino | GRAPPA DI MORELLINO | 4,50 l | 31 | partial |
| NQM033 · NQM140 | Grappa miele | GRAPPA MIELE | 0,70 l · 0,50 l | 31 | partial |
| NQM034 | Grappa 50 e 50 Riserva | GRAPPA 50 E 50 RISERVA | 0,70 l | 31 | partial |
| NQM035 | Grappa stravecchia | GRAPPA STRAVECCHIA | 1,00 l | 31 | partial |
| NQM038 | Grappa CRU 98 | GRAPPA CRU 98 | 0,70 l | 31 | partial |
| NQM041 | Grappa Centenario VS | GRAPPA CENTENARIO VS | — | 31 | partial |
| NQM057 | Amaro all’arancia | AMARO ALL’ARANCIA | 0,70 l | 31 | partial |
| NQM059 | Amaretto della Torre | AMARETTO DELLA TORRE | 0,70 l | 31 | partial |
| NQM062 · NQM063 | Amaro Etrusco | AMARO ETRUSCO | 0,70 l · 1,00 l | 31 | partial |
| NQM064 | Amaro V era | AMARO V ERA | 0,70 l | 31 | partial |
| NQM068 | Arancino | ARANCINO | 0,50 l | 31 | partial |
| NQM072 · NQM073 | Limoncino | LIMONCINO | 0,50 l · 1,00 l | 31 | partial |
| NQM075 | Liquore rabarbaro | LIQUORE RABARBARO | 0,70 l | 31 | partial |
| NQM092 | Liquore pinolo | LIQUORE PINOLO | 0,50 l | 31 | partial |
| NQM093 | Liquore pistacchio | LIQUORE PISTACCHIO | 0,50 l | 31 | partial |
| NQM142 | Liquore meloncino | LIQUORE MELONCINO | 0,50 l | 31 | partial |
| NQM091 | Liquore rhum e miele 25% | LIQUORE RHUM E MIELE 25% | 0,70 l | 31 | partial |
| NQM122 | Sambuca | SAMBUCA | 0,70 l | 31 | partial |
| NQM125 | Sambuca al caffe | SAMBUCA AL CAFFE | 0,70 l | 31 | partial |
| NQM079 | Spirito di caffe | SPIRITO DI CAFFE | 0,70 l | 31 | partial |
| NQM080 | Spirito di mirtillo | SPIRITO DI MIRTILLO | 0,70 l | 31 | partial |
| NQM081 | Spirito di liquirizia | SPIRITO DI LIQUIRIZIA | 0,70 l | 31 | partial |
| NQM082 | Spirito di fragola | SPIRITO DI FRAGOLA | 0,70 l | 31 | partial |
| NQM083 | Spirito di ciliegia | SPIRITO DI CILIEGIA | 0,70 l | 31 | partial |
| NQM084 | Spirito di cacao | SPIRITO DI CACAO | 0,70 l | 31 | partial |
| NQM085 | Spirito di noce | SPIRITO DI NOCE | 0,70 l | 31 | partial |
| NQM089 | Rhum invecchiato 40% | RHUM INVECCHIATO 40% | 0,70 l | 31 | partial |
| NQM090 | Rhum al ponce alla Toscana 40% | RHUM AL PONCE ALLA TOSCANA 40% | 0,70 l | 31 | partial |
| NQM094 | Gin botanico | GIN BOTANICO | 0,70 l | 31 | partial |
| NQM143 | Gin botanico timo e camomilla | GIN BOTANICO TIMO E CAMOMILLA | 0,70 l | 31 | partial |
| NQM095 · NQM096 | Gin Fondatore | GIN FONDATORE | 1,00 l · 1,50 l | 31 | partial |
| NQM097 | Gin zafferano | GIN ZAFFERANO | 0,70 l | 31 | partial |
| NQM099 · NQM100 | Creme Vario Genere arancino | CREME VARIO GENERE ARANCINO | 0,50 l · 1,00 l | 31 | partial |
| NQM102 · NQM103 | Creme Vario Genere Iris | CREME VARIO GENERE IRIS | 0,50 l · 1,00 l | 31 | partial |
| NQM105 · NQM106 | Creme Vario Genere caffe | CREME VARIO GENERE CAFFE | 0,50 l · 1,00 l | 31 | partial |
| NQM107 · NQM108 | Creme Vario Genere fragola | CREME VARIO GENERE FRAGOLA | 0,50 l · 1,00 l | 31 | partial |
| NQM110 · NQM111 | Creme Vario Genere fior di latte | CREME VARIO GENERE FIOR DI LATTE | 0,50 l · 1,00 l | 31 | partial |
| NQM113 · NQM114 | Creme Vario Genere gianduia | CREME VARIO GENERE GIANDUIA | 0,50 l · 1,00 l | 31 | partial |
| NQM116 · NQM117 | Creme Vario Genere Caraibi | CREME VARIO GENERE CARAIBI | 0,50 l · 1,00 l | 31 | partial |
| NQM120 · NQM118 | Creme Vario Genere pistacchio | CREME VARIO GENERE PISTACCHIO | 0,50 l · 1,00 l | 31 | partial |
| NQM144 | Creme Vario Genere cioccolato | CREME VARIO GENERE CIOCCOLATO | 0,50 l | 31 | partial |
| NQM145 · NQM146 | Creme Vario Genere meloncello | CREME VARIO GENERE MELONCELLO | 0,50 l · 1,00 l | 31 | partial |
| NQM147 | Creme Vario Genere banana | CREME VARIO GENERE BANANA | 0,50 l | 31 | partial |
| NQM148 | Creme Vario Genere menta | CREME VARIO GENERE MENTA | 0,50 l | 31 | partial |
| NQM127 · NQM128 | Bitter | BITTER | 1,00 l · 1,50 l | 31 | partial |
| NQM129 · NQM130 | Aperitivo di Toscana | APERITIVO DI TOSCANA | 1,00 l · 1,50 l | 31 | partial |
| NQM131 · NQM132 | Apricot | APRICOT | 1,00 l · 1,50 l | 31 | partial |
| NQM133 | Triplesec | TRIPLESEC | 1,00 l | 31 | partial |
