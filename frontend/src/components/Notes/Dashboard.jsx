import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { notesApi } from '../../api/notesApi'
import Navbar from '../Navbar/Navbar'
import NoteCard from './NoteCard'
import NoteModal from './NoteModal'
import './Notes.css'

function getTimestamp(createdAt) {
  if (!createdAt) return 0
  if (createdAt instanceof Date) return createdAt.getTime()
  if (createdAt._seconds !== undefined) return createdAt._seconds * 1000
  if (createdAt.seconds !== undefined) return createdAt.seconds * 1000
  return new Date(createdAt).getTime()
}

export default function Dashboard() {
  const { token } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState({ open: false, note: null })

  useEffect(() => {
    if (token) fetchNotes()
  }, [token])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await notesApi.getAll(token)
      setNotes(data)
    } catch {
      setError('Failed to load notes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredNotes = useMemo(() => {
    let result = [...notes]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.content?.toLowerCase().includes(q),
      )
    }
    return result.sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt))
  }, [notes, search])

  const handleSave = async (data) => {
    if (modal.note) {
      await notesApi.update(modal.note.id, data, token)
      setNotes((prev) =>
        prev.map((n) => (n.id === modal.note.id ? { ...n, ...data } : n)),
      )
    } else {
      const { noteId } = await notesApi.create(data, token)
      setNotes((prev) => [{ id: noteId, ...data, createdAt: new Date() }, ...prev])
    }
    setModal({ open: false, note: null })
  }

  const handleDelete = async (id) => {
    await notesApi.delete(id, token)
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  const openCreate = () => setModal({ open: true, note: null })
  const openEdit = (note) => setModal({ open: true, note })
  const closeModal = () => setModal({ open: false, note: null })

  return (
    <div className="dashboard">
      <Navbar noteCount={notes.length} />

      <main className="dashboard-main">
        <div className="dashboard-toolbar">
          <div className="search-wrap">
            <svg
              className="search-icon"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="search-input"
              type="search"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-new-note" onClick={openCreate}>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Note
          </button>
        </div>

        {loading ? (
          <div className="state-center">
            <div className="spinner" />
            <p>Loading your notes…</p>
          </div>
        ) : error ? (
          <div className="state-center">
            <div className="state-icon error-icon">!</div>
            <p className="state-error-text">{error}</p>
            <button className="btn-retry" onClick={fetchNotes}>
              Try again
            </button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="state-center">
            {search ? (
              <>
                <div className="state-icon">🔍</div>
                <h3>No notes match &ldquo;{search}&rdquo;</h3>
                <p>Try a different search term</p>
              </>
            ) : (
              <>
                <div className="state-icon">✦</div>
                <h3>No notes yet</h3>
                <p>Create your first note to get started</p>
                <button className="btn-new-note empty-btn" onClick={openCreate}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create Note
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note, i) => (
              <NoteCard
                key={note.id}
                note={note}
                colorIndex={i}
                onEdit={() => openEdit(note)}
                onDelete={() => handleDelete(note.id)}
              />
            ))}
          </div>
        )}
      </main>

      {modal.open && (
        <NoteModal note={modal.note} onSave={handleSave} onClose={closeModal} />
      )}
    </div>
  )
}
