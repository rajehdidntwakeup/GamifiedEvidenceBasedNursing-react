import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { LandingPage } from "@/pages/landing-page/landing-page";
import { AuthProvider, useAuth } from "@/services/auth-context";

// Lazy load admin dashboard
const AdminDashboard = () => {
  // Simple admin dashboard component
  return (
    <div className="min-h-screen bg-[#0f2a2e] p-8">
      <h1 className="text-3xl text-white mb-4">Admin Dashboard</h1>
      <p className="text-gray-400">Welcome to the admin panel!</p>
      <!-- Add actual admin dashboard content here -->
    </div>
  );
};

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
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
