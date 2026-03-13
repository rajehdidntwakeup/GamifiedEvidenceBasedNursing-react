import { LandingPage } from "@/pages/landing-page/landing-page";
import { AuthProvider } from "@/services/auth-context";

export default function App() {
  return (
    <AuthProvider>
      <LandingPage />
    </AuthProvider>
  );
}
