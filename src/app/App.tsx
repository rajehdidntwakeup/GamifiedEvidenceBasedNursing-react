import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { LandingPage } from "@/pages/landing-page/landing-page";
import { AdminDashboard } from "@/pages/admin-dashboard/admin-dashboard";
import { AuthProvider, useAuth } from "@/services/auth-context";

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function AppRoutes() {
  const { logout } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard onBack={logout} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
