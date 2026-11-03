import React, { useState } from 'react';
import { X, Sparkles, User, Mail, Shield, LogIn, UserPlus, LogOut, CheckCircle2 } from 'lucide-react';
import { AppUser, registerOrLoginUser, getAllUsers } from '../utils/credits';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser;
  onUserChanged: (user: AppUser) => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onOpenBuyCredits: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
  onToast,
  onOpenBuyCredits,
}) => {
  const [tab, setTab] = useState<'profile' | 'login' | 'register'>('profile');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleRegisterOrLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      onToast('Please enter a valid email address', 'error');
      return;
    }

    const { user, isNew } = registerOrLoginUser(email, name);
    onUserChanged(user);
    if (isNew) {
      onToast(`Welcome ${user.name}! 20 Free Credits added to your account!`, 'success');
    } else {
      onToast(`Welcome back, ${user.name}!`, 'info');
    }
    onClose();
  };

  const handleQuickDemoUser = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      const { user } = registerOrLoginUser('admin@ythuz.app', 'Admin Huzaifa');
      onUserChanged(user);
      onToast('Logged in as Admin (Full Approval Access)', 'success');
    } else {
      const randomNum = Math.floor(100 + Math.random() * 900);
      const { user } = registerOrLoginUser(`creator${randomNum}@gmail.com`, `Video Creator #${randomNum}`);
      onUserChanged(user);
      onToast(`Registered new user with 20 Free Credits!`, 'success');
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-md shadow-red-500/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              {tab === 'profile' ? 'Account Profile' : tab === 'register' ? 'Create Account' : 'Sign In'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Manage your YTHuz wallet, downloads & credits
            </p>
          </div>
        </div>

        {/* Welcome Bonus Callout Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 via-rose-500/10 to-amber-500/10 border border-red-500/20 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-600 text-white shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-extrabold text-neutral-900 dark:text-white text-sm">
              🎁 20 Free Credits on Login / Signup
            </p>
            <p className="text-neutral-600 dark:text-neutral-300 mt-0.5">
              Enjoy 6+ free downloads (3 credits per download) on registration!
            </p>
          </div>
        </div>

        {/* Current User Profile View */}
        {tab === 'profile' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400">Active Account</p>
                  <p className="text-base font-bold text-neutral-900 dark:text-white">{currentUser.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">{currentUser.email}</p>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    currentUser.role === 'admin'
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {currentUser.role === 'admin' ? 'Admin Access' : 'Verified Creator'}
                </span>
              </div>

              {/* Balance Card */}
              <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">Available Credits</span>
                  <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                    {currentUser.credits} <span className="text-sm font-semibold text-neutral-500">Credits</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBuyCredits();
                  }}
                  className="px-3 py-1.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/20 transition-all cursor-pointer"
                >
                  + Buy Credits
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTab('register')}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Switch / New User</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoUser('admin')}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Switch to Admin</span>
              </button>
            </div>
          </div>
        )}

        {/* Login / Register Form */}
        {(tab === 'login' || tab === 'register') && (
          <form onSubmit={handleRegisterOrLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Huzaifa Khan"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{tab === 'register' ? 'Register & Claim 20 Free Credits' : 'Sign In'}</span>
            </button>

            {/* Quick Demo Switchers */}
            <div className="pt-2 text-center space-y-2">
              <span className="text-[11px] text-neutral-400 block">Or test with 1-click accounts:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoUser('user')}
                  className="flex-1 py-1.5 px-2 text-[11px] font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300"
                >
                  New User (+20 Free Credits)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoUser('admin')}
                  className="flex-1 py-1.5 px-2 text-[11px] font-medium rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                >
                  Admin Huzaifa
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 text-center">
              <button
                type="button"
                onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
                className="text-xs text-red-500 hover:underline font-semibold"
              >
                {tab === 'login' ? 'Need an account? Claim 20 Free Credits' : 'Already have an account? Sign In'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
