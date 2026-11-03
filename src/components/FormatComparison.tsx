import React from 'react';
import { Video, Music, Check, Layers, Cpu, Smartphone, Monitor } from 'lucide-react';

export const FormatComparison: React.FC = () => {
  const formats = [
    {
      format: 'MP4',
      type: 'Video',
      icon: <Video className="w-5 h-5 text-red-500" />,
      codec: 'H.264 (AVC) + AAC Audio',
      bestFor: 'Universal compatibility across iOS, Android, Mac, Windows & TV',
      pros: ['Supported by 99.9% of devices', 'Hardware accelerated decoding', 'Standard for YouTube & Premiere'],
      badge: 'Most Popular',
      badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    },
    {
      format: 'WebM',
      type: 'Video',
      icon: <Video className="w-5 h-5 text-rose-500" />,
      codec: 'VP9 / AV01 + Opus Audio',
      bestFor: 'Modern web browsers, high compression efficiency & open standards',
      pros: ['15-20% smaller file size than MP4', 'Superior color preservation', 'Royalty-free open media format'],
      badge: 'High Efficiency',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
    {
      format: 'MP3',
      type: 'Audio',
      icon: <Music className="w-5 h-5 text-amber-500" />,
      codec: 'MPEG-1 Audio Layer III (up to 320 kbps)',
      bestFor: 'Podcasts, car stereos, voice memos, offline listening playlists',
      pros: ['Small footprint (~2.4MB per min)', 'Universal audio player support', 'Full ID3 metadata support'],
      badge: 'Audio Standard',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
    {
      format: 'WAV',
      type: 'Audio',
      icon: <Music className="w-5 h-5 text-emerald-500" />,
      codec: 'Linear PCM 16-bit / 44.1kHz (Uncompressed)',
      bestFor: 'Music producers, DAWs (FL Studio, Logic, Ableton), audio editing',
      pros: ['Zero quality loss', 'Bit-for-bit studio precision', 'Instant waveform analysis'],
      badge: 'Studio Lossless',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
  ];

  return (
    <section id="formats" className="py-16 border-t border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Format Intelligence</span>
          </div>
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Supported Media Formats & Specifications
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Compare encoding codecs, bitrates, and device compatibility to select the ideal container for your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {formats.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">{item.format}</h3>
                  <span className="text-xs text-neutral-400 uppercase font-mono font-semibold">({item.type})</span>
                </div>

                <p className="text-xs font-mono text-red-500 mb-3">{item.codec}</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                  {item.bestFor}
                </p>

                <div className="space-y-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  {item.pros.map((pro, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Output Quality:</span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-200">
                  {item.type === 'Video' ? '360p – 1080p 60fps' : '128k – 320k / PCM'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
