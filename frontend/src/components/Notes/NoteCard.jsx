import { useState } from 'react'

const ACCENT_COLORS = [
  '#6366f1',
  '#ec4899',
  '#14b8a6',
  '#f59e0b',
  '#8b5cf6',
  '#22c55e',
  '#f97316',
  '#06b6d4',
  '#e11d48',
  '#0ea5e9',
]

function formatDate(createdAt) {
  if (!createdAt) return ''

  let date
  if (createdAt instanceof Date) {
    date = createdAt
  } else if (createdAt._seconds !== undefined) {
    date = new Date(createdAt._seconds * 1000)
  } else if (createdAt.seconds !== undefined) {
    date = new Date(createdAt.seconds * 1000)
  } else {
    date = new Date(createdAt)
  }

  if (isNaN(date.getTime())) return ''

  const now = new Date()
  const diff = now - date

  if (diff < 60_000) return 'Just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

export default function NoteCard({ note, colorIndex, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const accent = ACCENT_COLORS[colorIndex % ACCENT_COLORS.length]

  const handleDeleteClick = () => setConfirming(true)
  const handleCancelDelete = () => setConfirming(false)

  const handleConfirmDelete = async () => {
    setDeleting(true)
    try {
      await onDelete()
    } catch {
      setDeleting(false)
      setConfirming(false)
    }
  }

  return (
    <article
      className={`note-card${deleting ? ' note-card--fading' : ''}`}
      style={{ '--accent': accent }}
    >
      <div className="note-accent-bar" />

      <div className="note-body">
        <h3 className="note-title">{note.title || 'Untitled'}</h3>
        {note.content && <p className="note-content">{note.content}</p>}
      </div>

      <footer className="note-footer">
        <span className="note-date">{formatDate(note.createdAt)}</span>

        {confirming ? (
          <div className="note-confirm">
            <span className="confirm-label">Delete?</span>
            <button
              className="confirm-yes"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? '…' : 'Yes'}
            </button>
            <button className="confirm-no" onClick={handleCancelDelete}>
              No
            </button>
          </div>
        ) : (
          <div className="note-actions">
            <button className="note-btn note-btn--edit" onClick={onEdit} title="Edit">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              className="note-btn note-btn--delete"
              onClick={handleDeleteClick}
              title="Delete"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>
        )}
      </footer>
    </article>
  )
}
