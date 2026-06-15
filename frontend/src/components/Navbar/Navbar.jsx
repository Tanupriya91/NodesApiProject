import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

export default function Navbar({ noteCount }) {
  const { user } = useAuth()

  const initials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0] ?? '?').toUpperCase()

  const displayName = user?.displayName || user?.email || ''

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="navbar-logo-icon">✦</span>
          <span className="navbar-logo-text">NoteFlow</span>
          {noteCount > 0 && (
            <span className="navbar-badge">{noteCount}</span>
          )}
        </div>

        <div className="navbar-right">
          <div className="navbar-user">
            <div className="user-avatar">{initials}</div>
            <span className="user-name">{displayName}</span>
          </div>
          <button
            className="navbar-logout"
            onClick={() => signOut(auth)}
            title="Sign out"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
