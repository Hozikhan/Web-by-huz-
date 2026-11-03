import React, { useState } from 'react';
import { Database, X, Check, AlertCircle, Save, ExternalLink, RefreshCw } from 'lucide-react';
import { SupabaseSettings } from '../types';
import { getSupabaseConfig, saveSupabaseConfig, testSupabaseConnection } from '../utils/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (cfg: SupabaseSettings) => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  onToast,
}) => {
  const [config, setConfig] = useState<SupabaseSettings>(getSupabaseConfig());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!config.url || !config.anonKey) {
      setTestResult({
        success: false,
        message: 'Please enter both Supabase Project URL and Anon API Key.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const res = await testSupabaseConnection(config.url, config.anonKey);
    setIsTesting(false);

    if (res.success) {
      setTestResult({
        success: true,
        message: 'Successfully reached Supabase database!',
      });
      onToast('Supabase connection verified!', 'success');
    } else {
      setTestResult({
        success: false,
        message: res.error || 'Could not connect. Please check URL and API Key.',
      });
    }
  };

  const handleSave = () => {
    saveSupabaseConfig({
      ...config,
      enabled: Boolean(config.url && config.anonKey),
    });
    onSaved(config);
    onToast('Supabase settings saved', 'success');
    onClose();
  };

  const handleUseLocalOnly = () => {
    const localCfg: SupabaseSettings = {
      url: '',
      anonKey: '',
      enabled: false,
    };
    setConfig(localCfg);
    saveSupabaseConfig(localCfg);
    onSaved(localCfg);
    onToast('Local browser storage active (Offline-first)', 'info');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              Supabase Backend Sync
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Cloud persistence for history and authorized media logs
            </p>
          </div>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
          YTHuz supports optional Supabase integration for synchronizing download history across devices.
          By default, all data is safely preserved in browser local storage.
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value.trim() })}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              Supabase Anon Public API Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={config.anonKey}
              onChange={(e) => setConfig({ ...config, anonKey: e.target.value.trim() })}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-red-500 font-mono"
            />
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-3 rounded-xl text-xs mb-4 flex items-center gap-2 ${
              testResult.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-500/30'
            }`}
          >
            {testResult.success ? (
              <Check className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>Test Connection</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-red-600/25 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
          <button
            type="button"
            onClick={handleUseLocalOnly}
            className="hover:underline hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            Reset to Local Storage Only
          </button>
          <span>Offline First</span>
        </div>
      </div>
    </div>
  );
};
