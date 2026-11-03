import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Shield,
  ArrowRight,
  CheckCircle2,
  Send,
  Eye,
  EyeOff,
  Coins,
  Film,
  Zap,
} from 'lucide-react';
import {
  AppUser,
  registerOrLoginUser,
  ADMIN_EMAIL,
  INITIAL_FREE_CREDITS,
} from '../utils/credits';

interface LoginPageProps {
  onSuccess: (user: AppUser) => void;
  onSkip?: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onSkip,
  onToast,
  darkMode,
  onToggleDarkMode,
}) => {
  const [isRegister, setIsRegister] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      onToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const { user, isNew, notification } = registerOrLoginUser(email, name);
      onToast(
        `Details forwarded to ${ADMIN_EMAIL}. ${
          isNew
            ? `Welcome! ${INITIAL_FREE_CREDITS} Free Credits added to your account.`
            : `Welcome back, ${user.name}!`
        }`,
        'success'
      );
      setTimeout(() => {
        onSuccess(user);
      }, 400);
    } catch {
      onToast('Authentication error. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      const { user } = registerOrLoginUser(ADMIN_EMAIL, 'Huzaifa (Admin)');
      onToast(`Logged in as verified Administrator (${ADMIN_EMAIL})!`, 'success');
      onSuccess(user);
    } else {
      const rand = Math.floor(100 + Math.random() * 900);
      const { user } = registerOrLoginUser(`creator${rand}@gmail.com`, `Video Creator #${rand}`);
      onToast(`Logged in! 20 Free Credits awarded. Details sent to ${ADMIN_EMAIL}`, 'success');
      onSuccess(user);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-red-500 selection:text-white relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[450px] h-[250px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-red-500 to-rose-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-600/30">
            Y
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">YTHuz</span>
              <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold">
                by Huzaifa
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">Next-Gen Video Downloader & Media Suite</p>
          </div>
        </div>

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-xs font-semibold text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer"
          >
            Explore as Guest →
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="max-w-md w-full bg-neutral-900/90 backdrop-blur-xl rounded-3xl border border-neutral-800/90 shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Welcome Bonus Highlight */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600/15 via-rose-500/15 to-amber-500/15 border border-red-500/30 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-600 text-white shrink-0 shadow-md shadow-red-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <span>🎁 20 Free Credits on Signup</span>
              </p>
              <p className="text-xs text-neutral-300 mt-0.5">
                Every download (video, audio, or thumbnail) uses <strong>3 Credits</strong>.
              </p>
            </div>
          </div>

          {/* Tab Switcher: Sign In vs Create Account */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-neutral-950 border border-neutral-800">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                !isRegister
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                isRegister
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Create Account (+20 🪙)
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Huzaifa Khan"
                    required={isRegister}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs sm:text-sm placeholder-neutral-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs sm:text-sm placeholder-neutral-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Password / Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs sm:text-sm placeholder-neutral-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Email Dispatch Notice */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-start gap-2.5 text-[11px] text-neutral-400">
              <Send className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              <span>
                All registration & login activity is securely logged and dispatched to administrator <strong className="text-neutral-200 font-mono">{ADMIN_EMAIL}</strong>.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-extrabold text-sm bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Forwarding details to {ADMIN_EMAIL}...</span>
                </>
              ) : isRegister ? (
                <>
                  <span>Create Account & Claim 20 Free Credits</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Sign In to YTHuz</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Access for Testing / Demo */}
          <div className="pt-2 border-t border-neutral-800 space-y-2">
            <p className="text-[11px] text-neutral-500 text-center font-medium">
              Quick 1-Click Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:text-purple-300">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Session</span>
                </div>
                <p className="text-[10px] text-neutral-400 truncate mt-0.5 font-mono">
                  {ADMIN_EMAIL}
                </p>
                <span className="text-[9px] text-emerald-400">Exclusive approval rights</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('user')}
                className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 group-hover:text-red-300">
                  <User className="w-3.5 h-3.5" />
                  <span>New Creator</span>
                </div>
                <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                  Regular User
                </p>
                <span className="text-[9px] text-amber-400">+20 Free Credits</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-6 text-center text-xs text-neutral-500 relative z-10">
        <p>
          YTHuz created by <strong className="text-white">Huzaifa</strong> • Authorized Admin: <strong className="text-red-400 font-mono">{ADMIN_EMAIL}</strong>
        </p>
        <p className="text-[11px] text-neutral-600 mt-1">
          Each media download costs 3 Credits • UPI Payee: 6201927841@ybl
        </p>
      </footer>
    </div>
  );
};
