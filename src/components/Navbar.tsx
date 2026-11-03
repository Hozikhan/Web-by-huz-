import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Menu,
  X,
  History,
  Database,
  Sparkles,
  Youtube,
  ShieldCheck,
  Coins,
  Plus,
  User,
  ShieldAlert,
} from 'lucide-react';
import { AppUser } from '../utils/credits';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenSupabaseModal: () => void;
  isSupabaseConnected: boolean;
  currentUser: AppUser | null;
  onOpenAuth: () => void;
  onOpenBuyCredits: () => void;
  onOpenAdmin: () => void;
  pendingRechargesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  historyCount,
  onOpenHistory,
  onOpenSupabaseModal,
  isSupabaseConnected,
  currentUser,
  onOpenAuth,
  onOpenBuyCredits,
  onOpenAdmin,
  pendingRechargesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 ${
        darkMode
          ? 'bg-neutral-950/85 border-neutral-800 text-neutral-100'
          : 'bg-white/90 border-neutral-200 text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => scrollToSection('hero')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 shadow-md shadow-red-500/20 text-white font-extrabold">
              <Youtube className="w-5 h-5 fill-current" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 via-rose-600 to-red-500 bg-clip-text text-transparent">
                  YTHuz
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                  Media Suite
                </span>
              </div>
              <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 -mt-0.5">
                by <span className="font-semibold text-neutral-800 dark:text-neutral-200">Huzaifa</span>
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => scrollToSection('hero')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('formats')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              Formats
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              Creator
            </button>
          </div>

          {/* Right Action Icons, Wallet & Auth */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {currentUser ? (
              <>
                {/* Credit Wallet Badge */}
                <div className="flex items-center rounded-xl bg-amber-500/10 border border-amber-500/30 p-0.5 text-xs font-bold text-amber-700 dark:text-amber-400 shadow-sm">
                  <button
                    type="button"
                    onClick={onOpenBuyCredits}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-amber-500/20 transition-colors cursor-pointer"
                    title="Click to Recharge Credits"
                  >
                    <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-500/30 animate-pulse" />
                    <span className="font-extrabold">{currentUser.credits}</span>
                    <span className="text-[10px] hidden sm:inline uppercase tracking-wide">Credits</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenBuyCredits}
                    className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-extrabold text-[11px] transition-colors flex items-center gap-0.5 shadow-sm"
                    title="Recharge Credits via UPI"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Buy</span>
                  </button>
                </div>

                {/* Admin Panel Trigger */}
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className={`relative px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    currentUser.role === 'admin'
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 border border-purple-500/20'
                  }`}
                  title="Admin Approval Panel"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                  {pendingRechargesCount > 0 && (
                    <span className="flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-black text-white bg-amber-500 rounded-full animate-bounce">
                      {pendingRechargesCount}
                    </span>
                  )}
                </button>

                {/* User Account / Profile Button */}
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer"
                  title="Account & Profile"
                >
                  <User className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="max-w-[70px] truncate hidden md:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In (+20 🪙)</span>
              </button>
            )}

            {/* History drawer button */}
            <button
              onClick={onOpenHistory}
              className="relative p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              title="Download History"
              aria-label="View Download History"
            >
              <History className="w-4 h-4" />
              {historyCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-red-600 rounded-full">
                  {historyCount > 9 ? '9+' : historyCount}
                </span>
              )}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors focus:outline-none"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-700" />
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
          {currentUser ? (
            <div className="p-3 mb-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  Wallet: {currentUser.credits} Credits
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBuyCredits();
                }}
                className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-red-600 text-white"
              >
                Buy Credits
              </button>
            </div>
          ) : (
            <div className="p-3 mb-2 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                Claim 20 Free Credits
              </span>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-red-600 text-white"
              >
                Sign In
              </button>
            </div>
          )}

          <button
            onClick={() => scrollToSection('hero')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('formats')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            Formats
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            FAQ
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            About Creator (Huzaifa)
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 flex items-center justify-between"
          >
            <span>Admin Approval Panel</span>
            {pendingRechargesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white">
                {pendingRechargesCount} Pending
              </span>
            )}
          </button>
        </div>
      )}
    </nav>
  );
};
