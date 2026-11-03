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
} from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenSupabaseModal: () => void;
  isSupabaseConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  historyCount,
  onOpenHistory,
  onOpenSupabaseModal,
  isSupabaseConnected,
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
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
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
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => scrollToSection('hero')}
              className="px-3 py-1.5 rounded-lg text-sm font-medium hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="px-3 py-1.5 rounded-lg text-sm font-medium hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('formats')}
              className="px-3 py-1.5 rounded-lg text-sm font-medium hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              Formats
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="px-3 py-1.5 rounded-lg text-sm font-medium hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="px-3 py-1.5 rounded-lg text-sm font-medium hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              About Creator
            </button>
          </div>

          {/* Right Action Icons & Toggles */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Supabase status / settings button */}
            <button
              onClick={onOpenSupabaseModal}
              title={isSupabaseConnected ? 'Supabase Database Connected' : 'Connect Supabase'}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                isSupabaseConnected
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 dark:bg-emerald-950/30'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-800 hover:border-neutral-400'
              }`}
              aria-label="Database Configuration"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isSupabaseConnected ? 'Cloud Synced' : 'Supabase'}
              </span>
            </button>

            {/* History drawer button */}
            <button
              onClick={onOpenHistory}
              className="relative p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              title="Download History"
              aria-label="View Download History"
            >
              <History className="w-5 h-5" />
              {historyCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-red-600 rounded-full">
                  {historyCount > 9 ? '9+' : historyCount}
                </span>
              )}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors focus:outline-none"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 text-neutral-700 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
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
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
            <span>Created by Huzaifa</span>
            <span className="flex items-center text-red-500 gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Authorized Media
            </span>
          </div>
        </div>
      )}
    </nav>
  );
};
