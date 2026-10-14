/**
 * Company facts — every value below is printed in the client PDF (p. 32, plus p. 1–2, 28).
 * Anything not in the PDF is deliberately absent. See docs/CONTENT_VERIFICATION.md.
 */
export const company = {
  legalName: 'Gruppo Noi, la qualità srl',
  brand: 'Noi, la qualità',
  ownBrand: 'Golosaqualità',
  ownBrandClaim: 'HIGH QUALITY FOOD — IL NOSTRO BRAND',
  address: {
    street: 'Viale C. Sabatini, 161',
    postalCode: '00144',
    city: 'Roma',
    country: 'Italia',
    /** As printed: "Viale C. Sabatini, 161 - 00144 Rome - Italy" */
    printed: 'Viale C. Sabatini, 161 - 00144 Rome - Italy',
  },
  phones: [
    { label: 'Telefono', display: '+39 06 66995093', href: 'tel:+390666995093' },
    { label: 'Mobile', display: '+39 379 141 3514', href: 'tel:+393791413514' },
    // Printed as "06 66993421*" — the meaning of the asterisk is not explained in the PDF.
    { label: 'Telefono*', display: '06 66993421', href: 'tel:+390666993421' },
  ],
  emails: [
    { label: 'Noi, la qualità', address: 'info@noilaqualita.it' },
    { label: 'Golosaqualità', address: 'info@golosaqualita.it' },
  ],
  /** Printed as "www.noilaqualit.it" — probably a typo; not linked until confirmed. */
  websitePrinted: 'www.noilaqualit.it',
  shipping: [
    'Spedizioni in Italia ed estero: da definire al momento dell’ordine, in base alle esigenze del cliente.',
    'Consegne su Roma entro il GRA gratuite.',
    'Lazio ed altre regioni: si applica un costo variabile.',
  ],
  shippingDisclaimer: 'La Società non risponde di eventuali disagi di trasporto.',
  catalogTitle: 'Catalogo Prodotti 2026',
  /** VAT number, privacy controller details etc. are NOT in the source. */
  pendingConfirmation: ['Partita IVA', 'Titolare del trattamento dati', 'Orari', 'Profili social'],
} as const

export const primaryEmail = company.emails[0].address
