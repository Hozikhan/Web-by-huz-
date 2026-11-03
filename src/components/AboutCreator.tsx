import React from 'react';
import { User, Code2, Heart, Sparkles, ShieldCheck, Github, Globe, Mail } from 'lucide-react';

interface AboutCreatorProps {
  onOpenContact: () => void;
}

export const AboutCreator: React.FC<AboutCreatorProps> = ({ onOpenContact }) => {
  return (
    <section id="about" className="py-16 md:py-24 border-t border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white via-neutral-50 to-neutral-100 dark:from-neutral-900 dark:via-neutral-900/90 dark:to-neutral-950 border border-neutral-200/90 dark:border-neutral-800 shadow-xl overflow-hidden">
          {/* Ambient red accent light */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 dark:bg-red-500/15 blur-3xl rounded-full pointer-events-none -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Creator Avatar & Visual Badge */}
            <div className="md:col-span-4 text-center">
              <div className="relative inline-block">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 p-1 shadow-xl shadow-red-500/20 mx-auto">
                  <div className="w-full h-full rounded-[22px] bg-neutral-900 flex items-center justify-center text-white">
                    <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-red-400 to-rose-200 bg-clip-text text-transparent">
                      H
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-md">
                  <Sparkles className="w-4 h-4 text-red-500" />
                </div>
              </div>

              <h3 className="mt-4 text-xl font-extrabold text-neutral-900 dark:text-white">
                Huzaifa
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                Creator & Software Architect
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                YTHuz Video Media Suite
              </p>
            </div>

            {/* Creator Story & Philosophy */}
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20">
                <Code2 className="w-3.5 h-3.5" />
                <span>Crafted with Purpose</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                About YTHuz & Creator Huzaifa
              </h2>

              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                Hello! I’m <strong className="font-bold text-neutral-900 dark:text-white">Huzaifa</strong>,
                the creator and developer behind <strong className="text-red-500">YTHuz</strong>.
                I engineered YTHuz to solve a real problem: most video downloaders on the web are cluttered with
                intrusive pop-ups, malware, and fake download buttons.
              </p>

              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                YTHuz is designed with a modern SaaS aesthetic, zero adware, and strict adherence to content authorization.
                Whether you need high-resolution thumbnails for graphic design, clean video titles for video metadata, or
                offline audio streams for editing, YTHuz gives you a streamlined, reliable workspace.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-red-600/20 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Get in Touch with Huzaifa</span>
                </button>

                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 pl-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>React 19 • Tailwind CSS • Supabase</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
