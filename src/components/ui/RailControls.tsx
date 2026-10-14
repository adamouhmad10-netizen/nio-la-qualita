import { ArrowLeft, ArrowRight } from 'lucide-react'

export function RailControls({
  canPrev,
  canNext,
  prev,
  next,
  label,
}: {
  canPrev: boolean
  canNext: boolean
  prev: () => void
  next: () => void
  label: string
}) {
  return (
    <div className="rail-controls" role="group" aria-label={`Scorri ${label}`}>
      <button type="button" className="icon-btn" onClick={prev} disabled={!canPrev} aria-label="Indietro">
        <ArrowLeft />
      </button>
      <button type="button" className="icon-btn" onClick={next} disabled={!canNext} aria-label="Avanti">
        <ArrowRight />
      </button>
    </div>
  )
}
