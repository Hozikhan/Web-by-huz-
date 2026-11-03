import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DownloadHistoryItem, SupabaseSettings } from '../types';

const STORAGE_KEY_HISTORY = 'ythuz_download_history_v1';
const STORAGE_KEY_SUPABASE = 'ythuz_supabase_config_v1';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseConfig(): SupabaseSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SUPABASE);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }

  // Check Vite environment variables
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  return {
    url: envUrl,
    anonKey: envKey,
    enabled: Boolean(envUrl && envKey),
  };
}

export function saveSupabaseConfig(config: SupabaseSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SUPABASE, JSON.stringify(config));
    cachedClient = null; // reset cached client
  } catch (err) {
    console.error('Failed to save Supabase config', err);
  }
}

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const config = getSupabaseConfig();
  if (config.enabled && config.url && config.anonKey) {
    try {
      cachedClient = createClient(config.url, config.anonKey);
      return cachedClient;
    } catch (e) {
      console.warn('Could not initialize Supabase client:', e);
    }
  }
  return null;
}

export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; error?: string }> {
  try {
    const client = createClient(url, key);
    const { error } = await client.from('downloads').select('id').limit(1);
    if (error && error.code !== 'PGRST116' && !error.message.includes('relation "downloads" does not exist')) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Connection failed' };
  }
}

/**
 * Loads download history from Supabase if configured, falling back to LocalStorage
 */
export async function getDownloadHistory(): Promise<DownloadHistoryItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('downloads')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        return data as DownloadHistoryItem[];
      }
    } catch {
      // fallback to local
    }
  }

  // LocalStorage fallback
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed reading local history:', err);
  }

  // Default initial friendly items to showcase the history feature immediately
  return [
    {
      id: 'hist-demo-1',
      videoId: 'aqz-KE-bpKQ',
      title: 'Big Buck Bunny 4K 60FPS (Creative Commons CC-BY 3.0)',
      author: 'Blender Foundation',
      thumbnail: 'https://img.youtube.com/vi/aqz-KE-bpKQ/mqdefault.jpg',
      type: 'video',
      format: 'mp4',
      quality: '1080p',
      fileSizeMB: 182.4,
      timestamp: Date.now() - 3600000 * 4,
      sourceUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    },
    {
      id: 'hist-demo-2',
      videoId: 'L_LUpnjgPso',
      title: 'Ultra HD Earth Orbit Timelapse from ISS (Public Domain NASA Footage)',
      author: 'NASA Goddard',
      thumbnail: 'https://img.youtube.com/vi/L_LUpnjgPso/mqdefault.jpg',
      type: 'audio',
      format: 'mp3',
      quality: '320k',
      fileSizeMB: 8.2,
      timestamp: Date.now() - 3600000 * 18,
      sourceUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    },
  ];
}

/**
 * Saves a new history record
 */
export async function addDownloadHistory(item: DownloadHistoryItem): Promise<void> {
  // Always persist to local storage first for instant reliability
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    const list: DownloadHistoryItem[] = raw ? JSON.parse(raw) : [];
    // Prepend and cap at 100 items
    const updated = [item, ...list.filter((x) => x.id !== item.id)].slice(0, 100);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Local storage write failed:', e);
  }

  // Also sync to Supabase if connected
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('downloads').insert([
        {
          id: item.id,
          video_id: item.videoId,
          title: item.title,
          author: item.author,
          thumbnail: item.thumbnail,
          type: item.type,
          format: item.format,
          quality: item.quality,
          file_size_mb: item.fileSizeMB,
          timestamp: item.timestamp,
          source_url: item.sourceUrl,
        },
      ]);
    } catch (e) {
      console.warn('Supabase sync skipped:', e);
    }
  }
}

/**
 * Clears history
 */
export async function clearDownloadHistory(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch {
    // ignore
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('downloads').delete().neq('id', '');
    } catch {
      // ignore
    }
  }
}
