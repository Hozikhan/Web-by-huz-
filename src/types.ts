export type MediaType = 'video' | 'audio';

export type VideoFormat = 'mp4' | 'webm';
export type AudioFormat = 'mp3' | 'wav';
export type OutputFormat = VideoFormat | AudioFormat;

export type VideoQuality = '2160p' | '1080p' | '720p' | '480p' | '360p';
export type AudioQuality = '320k' | '192k' | '128k';

export interface ThumbnailOption {
  quality: 'maxres' | 'hq' | 'mq' | 'sd' | 'default';
  label: string;
  resolution: string;
  url: string;
  width: number;
  height: number;
}

export interface VideoMetadata {
  id: string;
  url: string;
  title: string;
  author: string;
  authorUrl: string;
  authorAvatar?: string;
  durationSeconds: number;
  durationFormatted: string;
  views: number;
  viewsFormatted: string;
  likes: number;
  likesFormatted: string;
  uploadDate: string;
  description: string;
  category: string;
  thumbnails: ThumbnailOption[];
  primaryThumbnail: string;
  isCreativeCommons?: boolean;
  license?: string;
  fps?: number;
  tags: string[];
}

export interface StreamOption {
  type: MediaType;
  format: OutputFormat;
  quality: string;
  label: string;
  resolution?: string;
  bitrate?: string;
  codec: string;
  estimatedSizeMB: number;
  fps?: number;
}

export interface DownloadHistoryItem {
  id: string;
  videoId: string;
  title: string;
  author: string;
  thumbnail: string;
  type: MediaType;
  format: OutputFormat;
  quality: string;
  fileSizeMB: number;
  timestamp: number;
  sourceUrl: string;
}

export interface SupabaseSettings {
  url: string;
  anonKey: string;
  enabled: boolean;
}
