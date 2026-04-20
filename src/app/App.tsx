import { BrowserRouter, Routes, Route, Navigate } from 'react-router'

import { SessionProvider, useSession } from '@/entities/session'
import { AdminDashboard } from '@/pages/admin-dashboard/admin-dashboard'
import { LandingPage } from '@/pages/landing-page/landing-page'

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSession()
  return isAuthenticated ? <>{children}</> : <Navigate to='/' replace />
}

function AppRoutes() {
  const { logout } = useSession()

  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route
        path='/admin'
        element={
          <ProtectedRoute>
            <AdminDashboard onBack={logout} />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </SessionProvider>
  )
}
