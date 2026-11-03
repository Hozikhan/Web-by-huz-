import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Image,
  Eye,
  ThumbsUp,
  Clock,
  Calendar,
  ExternalLink,
  Sparkles,
  Maximize2,
  FileCheck2,
  Layers,
  Film,
} from 'lucide-react';
import { VideoMetadata, ThumbnailOption } from '../types';
import { copyToClipboard, downloadThumbnail } from '../utils/download';
import { AppUser, deductDownloadCredits, DOWNLOAD_CREDIT_COST } from '../utils/credits';

interface VideoPreviewProps {
  metadata: VideoMetadata;
  currentUser: AppUser | null;
  onCreditsDeducted: (newBalance: number) => void;
  onOpenBuyCredits: () => void;
  onOpenAuth: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  metadata,
  currentUser,
  onCreditsDeducted,
  onOpenBuyCredits,
  onOpenAuth,
  onToast,
}) => {
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState<ThumbnailOption>(
    metadata.thumbnails[0] || {
      quality: 'maxres',
      label: 'Ultra HD (1080p)',
      resolution: '1920 × 1080',
      url: metadata.primaryThumbnail,
      width: 1920,
      height: 1080,
    }
  );
  const [isDownloadingThumb, setIsDownloadingThumb] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const handleCopyTitle = async () => {
    const success = await copyToClipboard(metadata.title);
    if (success) {
      setCopiedTitle(true);
      onToast('Video title copied to clipboard!', 'success');
      setTimeout(() => setCopiedTitle(false), 2200);
    } else {
      onToast('Unable to copy title to clipboard', 'error');
    }
  };

  const handleDownloadThumbnail = async () => {
    if (!currentUser) {
      onToast('Please sign in or create an account to download thumbnails.', 'error');
      onOpenAuth();
      return;
    }

    if (currentUser.credits < DOWNLOAD_CREDIT_COST) {
      onToast(
        `Insufficient credits! Thumbnail download requires ${DOWNLOAD_CREDIT_COST} credits. You have ${currentUser.credits} credits.`,
        'error'
      );
      onOpenBuyCredits();
      return;
    }

    setIsDownloadingThumb(true);
    try {
      // Deduct 3 credits for thumbnail download
      const result = deductDownloadCredits(
        currentUser.id,
        `Thumbnail: ${metadata.title} (${selectedThumb.label})`
      );

      if (!result.success) {
        onToast(result.error || 'Failed to deduct credits', 'error');
        setIsDownloadingThumb(false);
        return;
      }

      onCreditsDeducted(result.newBalance);

      const filename = `YTHuz_${metadata.id}_thumbnail_${selectedThumb.quality}.jpg`;
      await downloadThumbnail(selectedThumb.url, filename);
      onToast(
        `Thumbnail downloaded! -${DOWNLOAD_CREDIT_COST} credits deducted (Balance: ${result.newBalance} 🪙)`,
        'success'
      );
    } catch {
      onToast('Failed to download thumbnail', 'error');
    } finally {
      setIsDownloadingThumb(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xl shadow-red-950/5 dark:shadow-black/40 overflow-hidden mb-10 transition-all">
      {/* Top Banner Indicator */}
      <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-950/70 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">Media Stream Analyzed</span>
          <span className="text-neutral-400">• ID: {metadata.id}</span>
        </div>
        <div className="flex items-center gap-2 font-medium">
          {metadata.isCreativeCommons ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
              Creative Commons
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Verified Source
            </span>
          )}
          <a
            href={metadata.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-red-500 transition-colors"
            title="Open on YouTube"
          >
            <span>Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Thumbnail Box with Actions */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative group rounded-2xl overflow-hidden bg-neutral-950 aspect-video shadow-md border border-neutral-200 dark:border-neutral-800">
              <img
                src={selectedThumb.url}
                alt={metadata.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback to HQ thumbnail if MaxRes is 404
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${metadata.id}/hqdefault.jpg`;
                }}
              />

              {/* Duration badge */}
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded-md text-white text-xs font-mono font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-red-400" />
                <span>{metadata.durationFormatted}</span>
              </div>

              {/* Quality overlay tag */}
              <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/75 backdrop-blur-md rounded-md text-white text-[11px] font-semibold flex items-center gap-1">
                <Film className="w-3 h-3 text-red-500" />
                <span>{selectedThumb.label}</span>
              </div>

              {/* Lightbox zoom trigger */}
              <button
                type="button"
                onClick={() => setShowLightbox(true)}
                className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="View Fullsize"
                aria-label="View Fullsize Image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Downloader Panel */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  <Image className="w-4 h-4 text-red-500" />
                  <span>Download Thumbnail</span>
                </div>
                <span className="text-[11px] text-neutral-500">{selectedThumb.resolution}</span>
              </div>

              {/* Thumbnail Resolution Selector */}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {metadata.thumbnails.slice(0, 3).map((thumb) => (
                  <button
                    key={thumb.quality}
                    type="button"
                    onClick={() => setSelectedThumb(thumb)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center transition-all cursor-pointer ${
                      selectedThumb.quality === thumb.quality
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 font-bold'
                        : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                    }`}
                  >
                    {thumb.quality === 'maxres' ? '1080p Ultra' : thumb.quality === 'hq' ? '720p HD' : '480p MQ'}
                  </button>
                ))}
              </div>

              {/* Direct Download Thumbnail Button with 3 Credits Cost */}
              <button
                type="button"
                onClick={handleDownloadThumbnail}
                disabled={isDownloadingThumb}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 transition-all shadow-sm flex items-center justify-between gap-2 cursor-pointer group"
              >
                {isDownloadingThumb ? (
                  <div className="flex items-center justify-center w-full gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Processing Thumbnail...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                      <span>Download {selectedThumb.label}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-700 dark:group-hover:text-red-600 text-[11px] font-black border border-red-500/30">
                      3 🪙
                    </span>
                  </>
                )}
              </button>

              <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500 px-1">
                <span>Deducts 3 credits per save</span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Wallet: {currentUser?.credits ?? 0} 🪙
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Metadata & Channel Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Title & Copy Title Feature */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white leading-snug">
                  {metadata.title}
                </h2>
              </div>

              {/* Prominent Copy Title Button */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyTitle}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border shadow-sm cursor-pointer ${
                    copiedTitle
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-white dark:bg-neutral-800/80 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:border-red-400 hover:text-red-500'
                  }`}
                  aria-label="Copy video title"
                >
                  {copiedTitle ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold">Title Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-red-500" />
                      <span>Copy Title</span>
                    </>
                  )}
                </button>

                <span className="text-xs text-neutral-400 dark:text-neutral-500">
                  Ready for metadata tagging & clean exports
                </span>
              </div>
            </div>

            {/* Channel Profile Row */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                {metadata.author.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                    {metadata.author}
                  </span>
                  <span title="Verified Creator">
                    <FileCheck2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  Category: {metadata.category}
                </p>
              </div>
              <a
                href={metadata.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:text-red-500 transition-colors shrink-0"
              >
                Channel
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                  <Eye className="w-3.5 h-3.5 text-red-500" />
                  <span>Views</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                  {metadata.viewsFormatted}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                  <ThumbsUp className="w-3.5 h-3.5 text-rose-500" />
                  <span>Likes</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                  {metadata.likesFormatted}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Duration</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white font-mono">
                  {metadata.durationFormatted}
                </p>
              </div>
            </div>

            {/* Available Media Specs Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400">
                <Layers className="w-3.5 h-3.5" />
                <span>Media Stream Profile</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono">
                  Codec: H.264 / VP9 / AV1
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono">
                  Audio: AAC / Opus 48kHz
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono">
                  Framerate: {metadata.fps || 60} FPS
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 font-semibold border border-red-500/20">
                  {metadata.license}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Fullsize Thumbnail */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowLightbox(false)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedThumb.url}
              alt="High Resolution Thumbnail"
              className="w-full h-auto rounded-2xl shadow-2xl border border-neutral-700 max-h-[85vh] object-contain mx-auto"
            />
            <div className="mt-4 flex items-center justify-between text-white">
              <div>
                <p className="font-bold text-sm">{metadata.title}</p>
                <p className="text-xs text-neutral-400">{selectedThumb.resolution}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadThumbnail}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button
                  type="button"
                  onClick={() => setShowLightbox(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
