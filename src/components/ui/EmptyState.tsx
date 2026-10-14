import type { ReactNode } from 'react'

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state__mark" aria-hidden="true" />
      <p className="empty-state__title">{title}</p>
      {text && <p className="empty-state__text">{text}</p>}
      {action}
    </div>
  )
}
