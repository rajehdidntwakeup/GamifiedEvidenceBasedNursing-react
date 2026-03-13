import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Shield, Lock, Users, Brain, ChevronRight, User, LogOut } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import { MISSIONS } from "./landing-page.data";
import { MissionGrid } from "./components/MissionGrid";
import { MissionCard } from "./components/MissionCard";
import { PasswordGate } from "./components/PasswordGate";
import { AuthModal } from "./components/AuthModal";
import { RoomRouter } from "./components/RoomRouter";
import { useMissionState } from "./hooks/useMissionState";
import { useAuth } from "@/services/auth-context";
import type { LandingMission } from "./landing-page.data";

export function LandingPage() {
  const [state, actions] = useMissionState();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    // Redirect to admin dashboard after successful login/register
    navigate("/admin");
  };

  // Show active mission room
  if (state.activeMission) {
    return (
      <RoomRouter
        currentRoom={state.currentRoom}
        showAdmin={state.showAdmin}
      />
    );
  }

  // Show mission grid
  if (state.showMissions) {
    return (
      <MissionGrid
        onBack={() => actions.setShowMissions(false)}
        onSelectMission={actions.handleMissionSelect}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#0f2a2e] relative overflow-hidden font-[Inter,sans-serif]">
        {/* Background */}
        <Background />

        {/* Navigation */}
        <Navigation 
          onLoginClick={() => {
            setAuthMode("login");
            setShowAuth(true);
          }}
          onRegisterClick={() => {
            setAuthMode("register");
            setShowAuth(true);
          }}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={logout}
        />

        {/* Hero Section */}
        <HeroSection onBeginMission={() => actions.setShowMissions(true)} />
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />

      <PasswordGate
        isOpen={!!state.pendingMission}
        onClose={() => {
          actions.setPendingMission(null);
          actions.setMissionPassword("");
          actions.setPasswordError(false);
        }}
        password={state.missionPassword}
        onPasswordChange={actions.setMissionPassword}
        onSubmit={actions.handlePasswordSubmit}
        error={state.passwordError}
      />
    </>
  );
}

// Sub-components
function Background() {
  return (
    <>
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1686916058141-a04d7f501ba8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGNvcnJpZG9yJTIwZGFyayUyMG1vb2R5fGVufDF8fHx8MTc3MjQ2MjUzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Hospital corridor"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }}
      />
    </>
  );
}

function Navigation({ 
  onLoginClick, 
  onRegisterClick,
  isAuthenticated,
  user,
  onLogout
}: { 
  onLoginClick: () => void;
  onRegisterClick: () => void;
  isAuthenticated: boolean;
  user: { username: string; role: string } | null;
  onLogout: () => void;
}) {
  return (
    <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <span className="text-white text-xl tracking-tight font-[Inter,sans-serif]">
          EBNA <span className="text-teal-400">Escape Room</span>
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
              <User className="w-4 h-4 text-teal-400" />
              <span className="text-sm text-gray-300">{user?.username}</span>
              <span className="text-xs text-teal-400 bg-teal-500/20 px-2 py-0.5 rounded">{user?.role}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onLoginClick}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onRegisterClick}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-lg transition-colors"
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

function HeroSection({ onBeginMission }: { onBeginMission: () => void }) {
  const features = [
    { icon: Brain, title: "Clinical Puzzles", desc: "Solve PICO-based challenges and interpret research studies to unlock clues", color: "text-teal-400" },
    { icon: Users, title: "Team Collaboration", desc: "Work with peers in real-time to analyze evidence and make clinical decisions", color: "text-orange-400" },
    { icon: Shield, title: "Earn Badges", desc: "Collect Evidence Hunter, Critical Thinker, and Team Player achievements", color: "text-green-400" },
  ];

  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 pb-24 md:pt-24 md:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 mb-8">
          <Lock className="w-4 h-4" />
          <span className="font-[JetBrains_Mono,monospace] text-sm">CLASSIFIED // MISSION BRIEFING</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl text-white mb-6 tracking-tight">
          Crack the Case.<br />
          <span className="text-teal-400">Master the Evidence.</span>
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Enter immersive clinical escape rooms where evidence-based nursing practice meets puzzle-solving.
          Analyze research, decode patient mysteries, and prove your critical thinking skills.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <button
            onClick={onBeginMission}
            className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-xl flex items-center gap-2 transition-all hover:scale-105"
          >
            Begin Your Mission
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full"
      >
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: {
  icon: typeof Brain;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-teal-500/40 transition-colors">
      <Icon className={`w-8 h-8 ${color} mb-4`} />
      <h3 className="text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}
