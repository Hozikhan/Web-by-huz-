import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldAlert, Sparkles, Smartphone, Lock } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: 'Permissions & Legal',
      question: 'When am I permitted to download videos or audio?',
      answer:
        'You may download media if you are the original copyright holder/creator, if the media has an explicit Creative Commons (CC-BY, CC-0) or Public Domain license, or if you have obtained explicit written authorization from the creator. YTHuz does not circumvent DRM, bypass platform stream restrictions, or facilitate copyright infringement. Our mission is providing authorized creators, archivists, and video editors with clean tools for their authorized media.',
    },
    {
      category: 'Features',
      question: 'How does the Thumbnail Downloader and Copy Title work?',
      answer:
        'When you analyze any YouTube video URL, YTHuz extracts the official image resolutions directly from the public content delivery network (1080p Ultra HD MaxRes, 720p HQ, 480p MQ, and 120p). You can download the image file directly to your device with one click or view it in the fullscreen lightbox. The "Copy Title" button sanitizes the title and copies it directly to your clipboard for instant video documentation and project labeling.',
    },
    {
      category: 'Formats & Quality',
      question: 'What video and audio formats and quality levels are supported?',
      answer:
        'For video, we provide standard MP4 (H.264/AAC) and modern WebM (VP9/Opus) containers across 1080p Full HD (60fps), 720p HD, 480p SD, and 360p Mobile resolutions. For audio-only extraction, we support high-bitrate 320 kbps Studio MP3, 192 kbps, 128 kbps, and lossless 16-bit uncompressed WAV for music producers.',
    },
    {
      category: 'Privacy',
      question: 'Does YTHuz log, store, or track my downloaded files?',
      answer:
        'No. YTHuz operates primarily client-side in your web browser. We do not maintain server-side video files or profile your viewing history. Your download history is stored securely inside your local browser storage (LocalStorage), or optionally synced to your private Supabase database if configured.',
    },
    {
      category: 'Devices',
      question: 'Which devices and browsers are supported?',
      answer:
        'YTHuz is designed with a mobile-first responsive layout and works across all modern browsers: Chrome, Safari, Firefox, Edge, and Brave on iOS, Android, macOS, Windows, and Linux. No plugins or extensions are required.',
    },
    {
      category: 'Cloud Sync',
      question: 'How do I configure Supabase cloud synchronization?',
      answer:
        'Click the "Supabase" button in the navigation bar. You can enter your Supabase Project URL and Public Anon Key. YTHuz will verify the connection and automatically sync your download records and favorites to your own private Supabase instance.',
    },
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 md:py-24 border-t border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Learn about authorized downloading, supported codecs, device compatibility, and privacy standards.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                      {faq.category}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-red-500' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/80 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
