import { motion } from "motion/react";
import { Lock, X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginModal({
  isOpen,
  onClose,
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: LoginModalProps) {
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
            <Lock className="w-8 h-8 text-teal-400" />
          </div>
          <h3 className="text-2xl text-white mb-2">Admin Access</h3>
          <p className="text-gray-400 text-sm">
            Enter your credentials to access the admin dashboard.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={onSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                placeholder="Enter username..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors"
          >
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
}
