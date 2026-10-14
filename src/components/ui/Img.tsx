import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react'
import { editorialSrc, editorialSrcSet } from '../../lib/images'

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /** Editorial image key (see lib/images.ts). */
  name: string
  alt: string
  sizes?: string
  priority?: boolean
  /** Available widths for this image (default 640/1280/2000). */
  widths?: number[]
}

/** Responsive editorial photograph with lazy loading and a soft fade-in. */
export function EditorialImg({ name, alt, sizes = '100vw', priority, widths, className, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLImageElement>(null)
  // Pre-rendered images may finish loading before React attaches onLoad.
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth) setLoaded(true)
  }, [])
  return (
    <img
      ref={ref}
      src={editorialSrc(name, 1280)}
      srcSet={editorialSrcSet(name, widths)}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      // React 18 does not know fetchPriority yet; pass lowercase attribute.
      {...(priority ? { fetchpriority: 'high' } : {})}
      onLoad={() => setLoaded(true)}
      className={`ed-img${loaded || priority ? ' is-loaded' : ''}${className ? ` ${className}` : ''}`}
      {...rest}
    />
  )
}
