import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../../firebase'
import './AuthPage.css'

const ERROR_MESSAGES = {
  'auth/invalid-email': 'Invalid email address.',
  'auth/user-not-found': 'No account with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
}

function getErrorMessage(code) {
  return ERROR_MESSAGES[code] || 'Something went wrong. Please try again.'
}

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, form.email, form.password)
      } else {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password,
        )
        if (form.name.trim()) {
          await updateProfile(user, { displayName: form.name.trim() })
        }
      }
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'))
    setForm({ name: '', email: '', password: '' })
    setError('')
  }

  return (
    <div className="auth-root">
      {/* Left brand panel */}
      <div className="auth-brand">
        <div className="auth-brand-content">
          <div className="auth-logo">
            <span className="auth-logo-icon">✦</span>
            <span className="auth-logo-name">NoteFlow</span>
          </div>
          <p className="auth-tagline">Your thoughts, perfectly organized.</p>
          <ul className="auth-features">
            <li>
              <span className="feature-check">✓</span>
              Create and edit notes instantly
            </li>
            <li>
              <span className="feature-check">✓</span>
              Secure &amp; private — only you can see
            </li>
            <li>
              <span className="feature-check">✓</span>
              Always in sync across devices
            </li>
          </ul>
          <div className="auth-cards-preview">
            <div className="preview-card">
              <div className="preview-accent" style={{ background: '#6366f1' }} />
              <div className="preview-lines">
                <div className="preview-title" />
                <div className="preview-line" style={{ width: '90%' }} />
                <div className="preview-line" style={{ width: '65%' }} />
              </div>
            </div>
            <div className="preview-card offset">
              <div className="preview-accent" style={{ background: '#ec4899' }} />
              <div className="preview-lines">
                <div className="preview-title" />
                <div className="preview-line" style={{ width: '80%' }} />
                <div className="preview-line" style={{ width: '55%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-form-header">
            <h1>{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
            <p>
              {mode === 'login'
                ? 'Sign in to your notes'
                : 'Start your note-taking journey'}
            </p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div className="form-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <span className="btn-spinner" />
            ) : mode === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>

          <p className="auth-switch">
            {mode === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}{' '}
            <button type="button" className="auth-switch-btn" onClick={switchMode}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
