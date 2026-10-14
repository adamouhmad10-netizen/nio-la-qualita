import { useEffect, useRef, useState } from 'react'
import { Maximize2, X, ZoomIn, ZoomOut } from 'lucide-react'
import type { ProductFamily } from '../../data/types'
import { productSrc } from '../../lib/images'
import { ProductVisual } from '../ui/ProductVisual'
import { tr, ui } from '../../i18n'

/**
 * Product gallery. Shows only the images the catalogue actually provides — no invented
 * extra angles. Lightbox uses the native <dialog> (focus containment, Esc to close).
 */
export function Gallery({ product }: { product: ProductFamily }) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const dialog = useRef<HTMLDialogElement>(null)
  const images = product.images
  const current = images[index]

  useEffect(() => setIndex(0), [product.id])

  const open = () => {
    setZoom(false)
    dialog.current?.showModal()
  }

  if (!current) {
    return (
      <div className="gallery">
        <div className="gallery__main gallery__main--fallback">
          <ProductVisual product={product} />
        </div>
        <p className="gallery__note">{ui.product.noImage}.</p>
      </div>
    )
  }

  const isPhoto = current.key.startsWith('editorial/')

  return (
    <div className="gallery">
      <div className={`gallery__main${isPhoto ? ' gallery__main--photo' : ''}`}>
        <ProductVisual product={product} index={index} priority sizes="(max-width: 900px) 100vw, 50vw" showScope />
        <button type="button" className="gallery__zoom" onClick={open} aria-label="Ingrandisci immagine">
          <Maximize2 aria-hidden="true" />
        </button>
      </div>

      {images.length > 1 && (
        <ul className="gallery__thumbs" role="list" aria-label="Immagini del prodotto">
          {images.map((im, i) => (
            <li key={im.key}>
              <button type="button" aria-pressed={i === index} onClick={() => setIndex(i)} aria-label={`Immagine ${i + 1}: ${tr(im.alt)}`}>
                <img src={productSrc(im.key, 'sm')} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="gallery__note">
        Immagine tratta dal Catalogo prodotti 2026, p. {current.page}
        {current.scope === 'range' && ' — fotografia di gamma, non identifica il singolo formato'}
        {current.scope === 'family' && ' — unica fotografia per tutti i formati'}.
      </p>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={tr(current.alt)}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close()
        }}
        onClose={() => setZoom(false)}
      >
        <div className="lightbox__bar">
          <button type="button" className="icon-btn" onClick={() => setZoom((z) => !z)} aria-pressed={zoom} aria-label={zoom ? 'Riduci' : 'Ingrandisci'}>
            {zoom ? <ZoomOut /> : <ZoomIn />}
          </button>
          <button type="button" className="icon-btn" onClick={() => dialog.current?.close()} aria-label="Chiudi">
            <X />
          </button>
        </div>
        <div
          className={`lightbox__stage${zoom ? ' is-zoomed' : ''}`}
          onClick={(e) => {
            const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
            setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
            setZoom((z) => !z)
          }}
          onMouseMove={(e) => {
            if (!zoom) return
            const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
            setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
          }}
        >
          <img src={productSrc(current.key, 'lg')} alt={tr(current.alt)} style={{ transformOrigin: origin }} />
        </div>
        <p className="lightbox__caption">{tr(current.alt)}</p>
      </dialog>
    </div>
  )
}
