import { useState, useEffect, useRef } from 'react'

export default function NoteModal({ note, onSave, onClose }) {
  const [form, setForm] = useState({ title: '', content: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const titleRef = useRef(null)

  useEffect(() => {
    if (note) {
      setForm({ title: note.title ?? '', content: note.content ?? '' })
    }
    setTimeout(() => titleRef.current?.focus(), 50)
  }, [note])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() && !form.content.trim()) {
      setError('Please add a title or some content.')
      return
    }
    setSaving(true)
    try {
      await onSave(form)
    } catch (err) {
      setError(err.message || 'Failed to save. Please try again.')
      setSaving(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>{note ? 'Edit Note' : 'New Note'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && <div className="modal-error">{error}</div>}

          <div className="modal-field modal-field--title">
            <input
              ref={titleRef}
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Note title…"
              className="modal-title-input"
              maxLength={200}
            />
          </div>

          <div className="modal-field modal-field--content">
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your note here…"
              className="modal-content-input"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-save" disabled={saving}>
              {saving ? (
                <>
                  <span className="btn-spinner" />
                  Saving…
                </>
              ) : note ? (
                'Save Changes'
              ) : (
                'Create Note'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
