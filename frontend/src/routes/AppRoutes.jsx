import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { HomePage } from '../features/home/HomePage.jsx'
import { AuthPage } from '../features/auth/AuthPage.jsx'
import { DashboardPage } from '../features/auth/DashboardPage.jsx'
import { PostsPage } from '../features/posts/PostsPage.jsx'
import { useAuth } from '../features/auth/useAuth.js'

function GuestRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : children
}

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  return user
    ? children
    : <Navigate to="/login" replace state={{ from: location }} />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={(
          <GuestRoute>
            <AuthPage mode="login" />
          </GuestRoute>
        )}
      />
      <Route
        path="/register"
        element={(
          <GuestRoute>
            <AuthPage mode="register" />
          </GuestRoute>
        )}
      />
      <Route
        path="/dashboard"
        element={(
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/posts"
        element={<PostsPage />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
