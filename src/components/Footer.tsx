import React from 'react';
import { Youtube, ShieldCheck, Heart, Sparkles, Mail } from 'lucide-react';
import { LegalModalType } from './LegalModals';

interface FooterProps {
  onOpenModal: (type: LegalModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModal }) => {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand & Creator Bio */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollTo('hero')}>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 shadow-md shadow-red-500/20 text-white font-extrabold">
                <Youtube className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 via-rose-600 to-red-500 bg-clip-text text-transparent">
                  YTHuz
                </span>
                <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                  Media Suite crafted by <span className="font-semibold text-neutral-800 dark:text-neutral-200">Huzaifa</span>
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed">
              A modern, ad-free video management experience built for YouTube content creators, digital editors,
              and archivists. Download thumbnails, copy titles, and handle authorized media effortlessly.
            </p>

            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Dedicated to Authorized & Creative Commons Media</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('hero')}
                  className="hover:text-red-500 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('features')}
                  className="hover:text-red-500 transition-colors cursor-pointer"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('formats')}
                  className="hover:text-red-500 transition-colors cursor-pointer"
                >
                  Formats
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('faq')}
                  className="hover:text-red-500 transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Toolbox
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <li>Thumbnail Extractor</li>
              <li>Clean Title Copier</li>
              <li>MP4 & WebM Video</li>
              <li>MP3 & WAV Audio</li>
              <li>Download History</li>
            </ul>
          </div>

          {/* Legal & About */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Trust & Creator
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('about')}
                  className="hover:text-red-500 transition-colors cursor-pointer text-left font-medium text-neutral-800 dark:text-neutral-200"
                >
                  About Creator (Huzaifa)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('privacy')}
                  className="hover:text-red-500 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('terms')}
                  className="hover:text-red-500 transition-colors cursor-pointer"
                >
                  Terms of Service & Compliance
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('contact')}
                  className="hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-red-500" />
                  <span>Contact Huzaifa</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & attribution bar */}
        <div className="pt-8 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {currentYear} <strong className="text-neutral-700 dark:text-neutral-300">YTHuz</strong>.
            All rights reserved. Designed & built with care by <strong className="text-neutral-900 dark:text-white">Huzaifa</strong>.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Respect creator copyrights</span>
            <span>•</span>
            <span>No DRM circumvention</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
