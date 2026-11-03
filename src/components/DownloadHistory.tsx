import React, { useState } from 'react';
import {
  History,
  Trash2,
  Download,
  ExternalLink,
  Copy,
  Clock,
  Video,
  Music,
  FileText,
  Search,
  Check,
} from 'lucide-react';
import { DownloadHistoryItem } from '../types';
import { generateAuthorizedMediaBlob, saveBlobAsFile, copyToClipboard } from '../utils/download';

interface DownloadHistoryProps {
  history: DownloadHistoryItem[];
  onClearHistory: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const DownloadHistory: React.FC<DownloadHistoryProps> = ({
  history,
  onClearHistory,
  onToast,
  isOpen = false,
  onClose,
}) => {
  const [filter, setFilter] = useState<'all' | 'video' | 'audio'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = history.filter((item) => {
    const matchesType = filter === 'all' || item.type === filter;
    const matchesQuery =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  const handleReDownload = (item: DownloadHistoryItem) => {
    try {
      const { blob, filename } = generateAuthorizedMediaBlob(
        item.title,
        item.format,
        item.type
      );
      saveBlobAsFile(blob, filename);
      onToast(`Re-downloaded ${filename}`, 'success');
    } catch {
      onToast('Failed to generate media file', 'error');
    }
  };

  const handleCopyUrl = async (item: DownloadHistoryItem) => {
    const ok = await copyToClipboard(item.sourceUrl);
    if (ok) {
      setCopiedId(item.id);
      onToast('Source URL copied to clipboard!', 'info');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleExportJson = () => {
    if (history.length === 0) {
      onToast('No history records to export', 'info');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `YTHuz_History_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    onToast('History exported as JSON', 'success');
  };

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <section id="history" className="mb-16">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xl shadow-red-950/5 dark:shadow-black/40 overflow-hidden">
        {/* Header Bar */}
        <div className="p-6 sm:p-8 border-b border-neutral-200/80 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                <History className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Download History & Processed Files
              </h2>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Your recently analyzed and downloaded video and audio files (synced locally & Supabase ready)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              disabled={history.length === 0}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={onClearHistory}
              disabled={history.length === 0}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 transition-colors flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Controls */}
        <div className="p-4 sm:px-8 bg-neutral-50 dark:bg-neutral-950/60 border-b border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              All ({history.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('video')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                filter === 'video'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Video className="w-3 h-3" />
              <span>Video</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('audio')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                filter === 'audio'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Music className="w-3 h-3" />
              <span>Audio</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search processed files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* History Item List */}
        <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800">
          {filteredItems.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <History className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                No processed files match your criteria
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Analyze any YouTube video above and download media to start populating your history.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-16 h-10 sm:w-20 sm:h-12 rounded-lg overflow-hidden bg-neutral-950 shrink-0 border border-neutral-200 dark:border-neutral-800">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 p-0.5 rounded bg-black/70 text-white">
                      {item.type === 'video' ? (
                        <Video className="w-2.5 h-2.5 text-red-400" />
                      ) : (
                        <Music className="w-2.5 h-2.5 text-rose-400" />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{item.author}</span>
                      <span>•</span>
                      <span className="font-mono font-semibold uppercase text-red-500">{item.format}</span>
                      <span>•</span>
                      <span className="font-mono">{item.quality}</span>
                      <span>•</span>
                      <span>~{item.fileSizeMB} MB</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Item Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item)}
                    className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
                    title="Copy Video URL"
                    aria-label="Copy Video URL"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
                    title="Open on YouTube"
                    aria-label="Open on YouTube"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleReDownload(item)}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
