import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, roles }) => {
  const { loading, user } = useAuth()

  if (loading) return <div className="p-8 text-center">Loading session...</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/" replace />

  return children
}

export default ProtectedRoute
