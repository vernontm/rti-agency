import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import type { UserRole } from '../../types/database.types'
import { Loader2 } from 'lucide-react'
import PendingApprovalPage from '../../pages/PendingApprovalPage'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  allowPending?: boolean
}

const ProtectedRoute = ({ children, allowedRoles, allowPending = false }: ProtectedRouteProps) => {
  const { user, profile, initialized } = useAuthStore()
  const location = useLocation()

  // Wait for auth to be initialized
  if (!initialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Wait for profile to load
  if (!profile) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  // Block pending users unless explicitly allowed
  if (profile && profile.status === 'pending' && !allowPending) {
    return <PendingApprovalPage />
  }

  // Block rejected users
  if (profile && profile.status === 'rejected') {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
