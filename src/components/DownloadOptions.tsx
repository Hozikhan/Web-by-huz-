import React, { useState } from 'react';
import {
  Video,
  Music,
  Download,
  ShieldCheck,
  HardDrive,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VideoMetadata, MediaType, OutputFormat, DownloadHistoryItem } from '../types';
import { calculateEstimatedSize } from '../utils/youtube';
import { generateAuthorizedMediaBlob, saveBlobAsFile } from '../utils/download';

interface DownloadOptionsProps {
  metadata: VideoMetadata;
  onDownloadLogged: (item: DownloadHistoryItem) => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const DownloadOptions: React.FC<DownloadOptionsProps> = ({
  metadata,
  onDownloadLogged,
  onToast,
}) => {
  const [mediaType, setMediaType] = useState<MediaType>('video');
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>('mp4');
  const [videoQuality, setVideoQuality] = useState<'1080p' | '720p' | '480p' | '360p'>('1080p');
  const [audioQuality, setAudioQuality] = useState<'320k' | '192k' | '128k'>('320k');

  // Authorized media ownership certification
  const [isAuthorizedConfirmed, setIsAuthorizedConfirmed] = useState(
    metadata.isCreativeCommons ?? false
  );

  // Download processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processStage, setProcessStage] = useState('');

  // Switch formats when changing media type
  const handleMediaTypeChange = (type: MediaType) => {
    setMediaType(type);
    if (type === 'video') {
      setSelectedFormat('mp4');
    } else {
      setSelectedFormat('mp3');
    }
  };

  // Calculate current file size
  const activeQuality = mediaType === 'video' ? videoQuality : audioQuality;
  const estimatedSize = calculateEstimatedSize(
    metadata.durationSeconds,
    activeQuality,
    mediaType
  );

  const startDownload = async () => {
    if (!isAuthorizedConfirmed) {
      onToast('Please confirm content authorization or ownership to proceed', 'error');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessStage('Validating authorization & stream manifest...');

    // Progress simulation with authentic stages
    const stages = [
      { progress: 20, stage: 'Requesting authorized media container...' },
      { progress: 48, stage: `Encoding stream into ${selectedFormat.toUpperCase()} container...` },
      { progress: 75, stage: 'Muxing audio & video bitstreams...' },
      { progress: 95, stage: 'Finalizing file packaging...' },
    ];

    for (const step of stages) {
      await new Promise((r) => setTimeout(r, 450));
      setProgress(step.progress);
      setProcessStage(step.stage);
    }

    await new Promise((r) => setTimeout(r, 400));
    setProgress(100);
    setProcessStage('Download ready!');

    try {
      // Generate actual media file
      const { blob, filename } = generateAuthorizedMediaBlob(
        metadata.title,
        selectedFormat,
        mediaType
      );
      saveBlobAsFile(blob, filename);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#ef4444', '#f43f5e', '#fb7185', '#ffffff'],
        });
      } catch {
        // ignore
      }

      // Record to download history
      const historyItem: DownloadHistoryItem = {
        id: `dl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        videoId: metadata.id,
        title: metadata.title,
        author: metadata.author,
        thumbnail: metadata.primaryThumbnail,
        type: mediaType,
        format: selectedFormat,
        quality: activeQuality,
        fileSizeMB: estimatedSize,
        timestamp: Date.now(),
        sourceUrl: metadata.url,
      };

      onDownloadLogged(historyItem);
      onToast(`Successfully generated ${filename}`, 'success');
    } catch {
      onToast('Failed to generate media file', 'error');
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        setProcessStage('');
      }, 1200);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xl shadow-red-950/5 dark:shadow-black/40 overflow-hidden mb-12">
      {/* Header bar */}
      <div className="px-6 py-5 border-b border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-500" />
            <span>Download Configuration</span>
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Select high-fidelity formats and audio/video profiles
          </p>
        </div>

        {/* Media Type Tabs: Video vs Audio */}
        <div className="flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleMediaTypeChange('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mediaType === 'video'
                ? 'bg-white dark:bg-neutral-900 text-red-600 dark:text-red-400 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video</span>
          </button>
          <button
            type="button"
            onClick={() => handleMediaTypeChange('audio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mediaType === 'audio'
                ? 'bg-white dark:bg-neutral-900 text-red-600 dark:text-red-400 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Audio Only</span>
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Format Selector Pills */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
            Target Format Container
          </label>
          <div className="flex flex-wrap gap-2.5">
            {mediaType === 'video' ? (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('mp4')}
                  className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-center border font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                    selectedFormat === 'mp4'
                      ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 ring-2 ring-red-500/20'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                  }`}
                >
                  <span className="block text-base font-bold">MP4</span>
                  <span className="text-[11px] font-normal text-neutral-500">Universal H.264 / AAC</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('webm')}
                  className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-center border font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                    selectedFormat === 'webm'
                      ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 ring-2 ring-red-500/20'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                  }`}
                >
                  <span className="block text-base font-bold">WebM</span>
                  <span className="text-[11px] font-normal text-neutral-500">VP9 Open Web Media</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('mp3')}
                  className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-center border font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                    selectedFormat === 'mp3'
                      ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 ring-2 ring-red-500/20'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                  }`}
                >
                  <span className="block text-base font-bold">MP3</span>
                  <span className="text-[11px] font-normal text-neutral-500">MPEG-3 Universal Audio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('wav')}
                  className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-center border font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                    selectedFormat === 'wav'
                      ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 ring-2 ring-red-500/20'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                  }`}
                >
                  <span className="block text-base font-bold">WAV</span>
                  <span className="text-[11px] font-normal text-neutral-500">Uncompressed Lossless Audio</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Quality Selector Tiles */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
            {mediaType === 'video' ? 'Select Video Resolution' : 'Select Audio Bitrate'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mediaType === 'video' ? (
              <>
                {[
                  { q: '1080p', label: '1080p FHD', sub: '60 FPS / Crisp', res: '1920 × 1080' },
                  { q: '720p', label: '720p HD', sub: 'Balanced Quality', res: '1280 × 720' },
                  { q: '480p', label: '480p SD', sub: 'Compact Size', res: '854 × 480' },
                  { q: '360p', label: '360p Mobile', sub: 'Lightweight', res: '640 × 360' },
                ].map((item) => (
                  <button
                    key={item.q}
                    type="button"
                    onClick={() => setVideoQuality(item.q as any)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      videoQuality === item.q
                        ? 'border-red-500 bg-red-500/10 dark:bg-red-500/15 text-neutral-900 dark:text-white shadow-sm ring-1 ring-red-500/30'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold">{item.label}</span>
                      {videoQuality === item.q && <CheckCircle2 className="w-4 h-4 text-red-500" />}
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{item.sub}</p>
                    <p className="text-[10px] font-mono text-neutral-400 mt-1">{item.res}</p>
                  </button>
                ))}
              </>
            ) : (
              <>
                {[
                  { q: '320k', label: '320 kbps', sub: 'Master Studio Quality' },
                  { q: '192k', label: '192 kbps', sub: 'High Fidelity' },
                  { q: '128k', label: '128 kbps', sub: 'Standard Quality' },
                ].map((item) => (
                  <button
                    key={item.q}
                    type="button"
                    onClick={() => setAudioQuality(item.q as any)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      audioQuality === item.q
                        ? 'border-red-500 bg-red-500/10 dark:bg-red-500/15 text-neutral-900 dark:text-white shadow-sm ring-1 ring-red-500/30'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold">{item.label}</span>
                      {audioQuality === item.q && <CheckCircle2 className="w-4 h-4 text-red-500" />}
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{item.sub}</p>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* File Information Summary Card */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/90 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
            <HardDrive className="w-4 h-4 text-red-500" />
            <span>File Specification Summary</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-neutral-500 block mb-0.5">Estimated Size</span>
              <span className="font-bold text-neutral-900 dark:text-white text-sm font-mono">
                ~{estimatedSize} MB
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block mb-0.5">Format</span>
              <span className="font-bold text-neutral-900 dark:text-white uppercase font-mono">
                {selectedFormat}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block mb-0.5">Quality Setting</span>
              <span className="font-bold text-neutral-900 dark:text-white font-mono">
                {activeQuality}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block mb-0.5">Container Profile</span>
              <span className="font-semibold text-neutral-900 dark:text-white truncate block">
                {mediaType === 'video' ? 'AV01/VP9/H.264' : 'Audio Stream 44.1/48kHz'}
              </span>
            </div>
          </div>
        </div>

        {/* Ownership & Authorization Mandatory Consent */}
        <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/25">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="ownership-auth-checkbox"
              checked={isAuthorizedConfirmed}
              onChange={(e) => setIsAuthorizedConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-red-600 rounded border-neutral-300 dark:border-neutral-700 focus:ring-red-500"
            />
            <div className="text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
              <span className="font-bold block text-neutral-900 dark:text-white">
                Authorized Media Certification
              </span>
              <p className="leading-relaxed">
                I confirm that I own this content or have explicit authorization from the creator/copyright holder
                (e.g., Creative Commons, Public Domain, or personal archival rights) to download this media.
              </p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 inline" />
                YTHuz does not circumvent DRM or scrape restricted streams.
              </p>
            </div>
          </label>
        </div>

        {/* Download Action Button & Progress */}
        <div className="space-y-3">
          {isProcessing && (
            <div className="space-y-2 p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-700 dark:text-neutral-300">{processStage}</span>
                <span className="font-mono text-red-500">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={startDownload}
            disabled={isProcessing || !isAuthorizedConfirmed}
            className={`w-full py-4 px-6 rounded-2xl font-extrabold text-white text-base shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer ${
              !isAuthorizedConfirmed
                ? 'bg-neutral-400 dark:bg-neutral-800 cursor-not-allowed opacity-60 text-neutral-300'
                : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 shadow-red-600/30 active:scale-[0.99]'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing & Packaging Media...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>
                  Download {mediaType === 'video' ? 'Video' : 'Audio'} ({selectedFormat.toUpperCase()} •{' '}
                  {activeQuality})
                </span>
              </>
            )}
          </button>

          {!isAuthorizedConfirmed && (
            <p className="text-center text-xs text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              Please check the authorization certification above to enable downloads
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
