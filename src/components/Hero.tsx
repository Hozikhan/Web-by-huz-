import React, { useState } from 'react';
import {
  Search,
  Clipboard,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
  PlayCircle,
} from 'lucide-react';
import { SAMPLE_VIDEOS, SampleVideo } from '../utils/youtube';

interface HeroProps {
  urlInput: string;
  setUrlInput: (val: string) => void;
  onAnalyze: (urlToAnalyze?: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
  onClearError: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  urlInput,
  setUrlInput,
  onAnalyze,
  isLoading,
  errorMessage,
  onClearError,
}) => {
  const [copiedPasteFeedback, setCopiedPasteFeedback] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text.trim());
        setCopiedPasteFeedback(true);
        setTimeout(() => setCopiedPasteFeedback(false), 1500);
        onClearError();
      }
    } catch {
      // If clipboard permission blocked, focus input
      const input = document.getElementById('youtube-url-input');
      input?.focus();
    }
  };

  const handleClear = () => {
    setUrlInput('');
    onClearError();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onAnalyze(urlInput.trim());
    }
  };

  const handleSelectSample = (sample: SampleVideo) => {
    setUrlInput(sample.url);
    onClearError();
    onAnalyze(sample.url);
  };

  return (
    <section id="hero" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background ambient red glow gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-red-600/15 via-rose-500/10 to-amber-500/5 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Creator & Trust Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-red-500" />
          <span>Created with precision by Huzaifa</span>
          <span className="w-1 h-1 rounded-full bg-red-400" />
          <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-1 font-normal">
            <ShieldCheck className="w-3 h-3 text-emerald-500 inline" /> Official & Authorized Media
          </span>
        </div>

        {/* Hero Headings */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.15] mb-5">
          Download Your Videos,{' '}
          <span className="bg-gradient-to-r from-red-600 via-rose-600 to-red-500 bg-clip-text text-transparent">
            Your Way
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
          A simple and convenient video management experience. Extract high-res thumbnails, copy clean titles, and process authorized media with modern speed.
        </p>

        {/* Large YouTube URL Input Box */}
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto mb-6">
          <div className="relative flex flex-col sm:flex-row items-stretch p-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl shadow-red-950/5 dark:shadow-red-950/20 border-2 border-neutral-200/80 dark:border-neutral-800 focus-within:border-red-500 dark:focus-within:border-red-500 transition-all duration-200">
            <div className="relative flex-1 flex items-center px-3 py-2 sm:py-0">
              <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
              <input
                id="youtube-url-input"
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (errorMessage) onClearError();
                }}
                placeholder="Paste YouTube video or Shorts link here (e.g., https://youtube.com/watch?v=...)"
                className="w-full bg-transparent text-sm sm:text-base text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none"
                aria-label="YouTube video URL"
              />

              {/* Clear button inside input */}
              {urlInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors mr-1"
                  aria-label="Clear URL"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Paste URL Button */}
              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 transition-all shrink-0 ml-1"
                title="Paste from clipboard"
                aria-label="Paste URL from clipboard"
              >
                {copiedPasteFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Pasted!</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Paste URL</span>
                  </>
                )}
              </button>
            </div>

            {/* Analyze Button */}
            <button
              type="submit"
              disabled={isLoading || !urlInput.trim()}
              className="mt-2 sm:mt-0 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-red-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm sm:text-base shrink-0"
              aria-label="Analyze YouTube video"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mt-3 flex items-center gap-2 p-3 text-xs sm:text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl animate-fadeIn text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="flex-1">{errorMessage}</span>
              <button
                type="button"
                onClick={onClearError}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </form>

        {/* Quick Sample Video Chips for 1-click preview */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="font-medium flex items-center gap-1">
            <PlayCircle className="w-3.5 h-3.5 text-red-500" /> Or try authorized sample videos:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {SAMPLE_VIDEOS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-red-50 dark:bg-neutral-800/80 dark:hover:bg-neutral-800 hover:text-red-600 dark:hover:text-red-400 border border-neutral-200 dark:border-neutral-700/60 transition-colors cursor-pointer text-[11px] font-medium"
              >
                {sample.channel} • {sample.badge}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
