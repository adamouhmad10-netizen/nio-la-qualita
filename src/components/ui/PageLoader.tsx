/** Shown only while a code-split route chunk downloads — never an artificial delay. */
export function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="page-loader__dot" aria-hidden="true" />
      <span className="visually-hidden">Caricamento…</span>
    </div>
  )
}
