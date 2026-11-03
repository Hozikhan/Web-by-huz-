import React from 'react';
import {
  Image,
  Copy,
  Layers,
  ShieldCheck,
  Zap,
  Database,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Image className="w-6 h-6 text-red-500" />,
      title: 'Ultra HD Thumbnail Downloader',
      description:
        'Instantly grab official high-resolution thumbnails in 1080p MaxRes, 720p HQ, and 480p MQ with one click, perfect for graphic designers and content creators.',
      tag: 'New Feature',
    },
    {
      icon: <Copy className="w-6 h-6 text-rose-500" />,
      title: 'Instant Clean Title Copier',
      description:
        'Copy sanitized, formatted video titles directly to your clipboard with instant visual confirmation for video documentation and archiving workflows.',
      tag: 'One-Click',
    },
    {
      icon: <Layers className="w-6 h-6 text-amber-500" />,
      title: 'Multi-Format Video & Audio',
      description:
        'Export into standard MP4 and VP9 WebM for video, or extract crystal-clear 320 kbps MP3 and uncompressed 16-bit PCM WAV for audio production.',
      tag: 'MP4 / WebM / MP3 / WAV',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: 'Authorized Media & Fair Use',
      description:
        'Built strictly for content creators, open source projects, Creative Commons media, and authorized personal archiving without violating terms or DRM.',
      tag: 'Creator Compliant',
    },
    {
      icon: <Database className="w-6 h-6 text-blue-500" />,
      title: 'Supabase & Local Cloud Sync',
      description:
        'Seamlessly keep track of downloaded media and analysis history across devices with integrated Supabase database storage and local offline fallback.',
      tag: 'Cloud Ready',
    },
    {
      icon: <Zap className="w-6 h-6 text-purple-500" />,
      title: 'Zero Ads, Blazing Fast UI',
      description:
        'Enjoy a clean, distraction-free SaaS experience designed and built with modern React 19, TypeScript, and responsive Tailwind CSS by Huzaifa.',
      tag: 'Crafted by Huzaifa',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 border-t border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Designed for Creators, Editors & Archivists
          </h2>
          <p className="mt-3 text-base text-neutral-600 dark:text-neutral-400">
            Everything you need to extract media assets, thumbnails, and clean metadata without the bloat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-md hover:shadow-xl hover:border-red-500/40 dark:hover:border-red-500/30 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 group-hover:bg-red-500/10 transition-colors">
                    {feature.icon}
                  </div>
                  <span className="text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-red-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center gap-1.5 text-xs font-semibold text-red-500">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Fully Optimized</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
