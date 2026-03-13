import { motion } from "motion/react";
import { KeyRound, X } from "lucide-react";

interface PasswordGateProps {
  isOpen: boolean;
  onClose: () => void;
  password: string;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: boolean;
}

export function PasswordGate({
  isOpen,
  onClose,
  password,
  onPasswordChange,
  onSubmit,
  error,
}: PasswordGateProps) {
  if (!isOpen) return null;

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
            <KeyRound className="w-8 h-8 text-teal-400" />
          </div>
          <h3 className="text-2xl text-white mb-2">Mission Locked</h3>
          <p className="text-gray-400 text-sm">
            Enter the mission password provided by your instructor to unlock this challenge.
          </p>
        </div>

        {/* Password form */}
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Enter mission password..."
              className={`w-full px-4 py-3 bg-white/5 border ${
                error ? "border-red-500/50" : "border-white/10"
              } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors`}
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors"
          >
            Unlock Mission
          </button>
        </form>
      </motion.div>
    </div>
  );
}
