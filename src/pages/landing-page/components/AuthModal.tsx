import { X, UserPlus, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { useAuth } from "@/services/auth-context";

type AuthMode = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
  canRegister?: boolean;
  onAuthSuccess?: () => void;
}

function getFriendlyLoginError(errorMessage: string) {
  const normalizedError = errorMessage.toLowerCase();
  const invalidCredentialPatterns = [
    "bad credentials",
    "invalid credential",
    "invalid username",
    "invalid password",
    "username or password",
    "wrong password",
    "unauthorized",
    "401",
  ];

  if (invalidCredentialPatterns.some((pattern) => normalizedError.includes(pattern))) {
    return "Incorrect username or password. Please try again.";
  }

  if (normalizedError.includes("failed to fetch") || normalizedError.includes("networkerror")) {
    return "Unable to reach the server. Please check your connection and try again.";
  }

  return "Unable to sign in right now. Please try again.";
}

export function AuthModal({
  isOpen,
  onClose,
  defaultMode = "login",
  canRegister = true,
  onAuthSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(canRegister ? defaultMode : "login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  
  const { login, register, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setMode(canRegister ? defaultMode : "login");
    setLocalError(null);
    clearError();
  }, [isOpen, canRegister, defaultMode, clearError]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // Validation
    if (!username.trim() || !password.trim()) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (mode === "register") {
      if (!canRegister) {
        setLocalError("Registration is currently unavailable.");
        return;
      }
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        setLocalError("Password must be at least 6 characters");
        return;
      }
    }

    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        await register(username, password);
      }
      onClose();
      // Reset form
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      // Call success callback to redirect
      onAuthSuccess?.();
    } catch (err) {
      if (mode === "login") {
        const fallbackError = "Unable to sign in right now. Please try again.";
        const rawError = err instanceof Error ? err.message : fallbackError;
        setLocalError(getFriendlyLoginError(rawError));
      }
      // Other errors are handled by auth context
    }
  };

  const toggleMode = () => {
    if (!canRegister) {
      return;
    }

    setMode(mode === "login" ? "register" : "login");
    setLocalError(null);
    clearError();
  };

  const displayError = localError || error;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0f2a2e] border border-teal-500/30 rounded-2xl p-8 max-w-md w-full relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center mx-auto mb-4">
            {mode === "login" ? (
              <LogIn className="w-8 h-8 text-teal-400" />
            ) : (
              <UserPlus className="w-8 h-8 text-teal-400" />
            )}
          </div>
          <h3 className="text-2xl text-white mb-2">
            {mode === "login" ? "Admin Login" : "Create Account"}
          </h3>
          <p className="text-gray-400 text-sm">
            {mode === "login"
              ? "Enter your credentials to access the admin dashboard."
              : "Create a new admin account to manage games."}
          </p>
        </div>

        {/* Error message */}
        {displayError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-sm">
            {displayError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="auth-username" className="block text-sm text-gray-400 mb-2">Username</label>
              <input
                id="auth-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="auth-password" className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors disabled:opacity-50"
              />
            </div>
            
            {mode === "register" && (
              <div>
                <label htmlFor="auth-confirm-password" className="block text-sm text-gray-400 mb-2">Confirm Password</label>
                <input
                  id="auth-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password..."
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors disabled:opacity-50"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-teal-500 hover:bg-teal-400 disabled:bg-gray-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{mode === "login" ? "Signing in..." : "Creating account..."}</span>
              </>
            ) : (
              <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
            )}
          </button>
        </form>

        {/* Toggle mode */}
        {canRegister && (
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={toggleMode}
                disabled={isLoading}
                className="text-teal-400 hover:text-teal-300 font-medium disabled:opacity-50"
              >
                {mode === "login" ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
