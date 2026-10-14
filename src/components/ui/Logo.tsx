interface Props {
  variant?: 'color' | 'white'
  className?: string
}

/** Original vector logo extracted from the client PDF (p. 2). Proportions untouched. */
export function Logo({ variant = 'color', className }: Props) {
  return (
    <img
      src={variant === 'white' ? '/brand/noi-la-qualita-white.svg' : '/brand/noi-la-qualita.svg'}
      alt="Noi, la qualità"
      width={155}
      height={81}
      className={className}
      decoding="async"
    />
  )
}

export function GolosaLogo({ variant = 'color', className }: Props) {
  return (
    <img
      src={variant === 'white' ? '/brand/golosaqualita-white.svg' : '/brand/golosaqualita.svg'}
      alt="Golosaqualità — High Quality Food, il nostro brand"
      width={160}
      height={70}
      className={className}
      loading="lazy"
      decoding="async"
    />
  )
}
