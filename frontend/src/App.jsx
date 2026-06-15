import { useAuth } from './context/AuthContext'
import AuthPage from './components/Auth/AuthPage'
import Dashboard from './components/Notes/Dashboard'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
      </div>
    )
  }

  return user ? <Dashboard /> : <AuthPage />
}
