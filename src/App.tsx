/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VideoPreview } from './components/VideoPreview';
import { DownloadOptions } from './components/DownloadOptions';
import { DownloadHistory } from './components/DownloadHistory';
import { FeaturesSection } from './components/FeaturesSection';
import { FormatComparison } from './components/FormatComparison';
import { FaqSection } from './components/FaqSection';
import { AboutCreator } from './components/AboutCreator';
import { Footer } from './components/Footer';
import { SupabaseModal } from './components/SupabaseModal';
import { LegalModals, LegalModalType } from './components/LegalModals';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { BuyCreditsModal } from './components/BuyCreditsModal';
import { AdminApprovalModal } from './components/AdminApprovalModal';
import { VideoMetadata, DownloadHistoryItem, SupabaseSettings } from './types';
import { fetchVideoMetadata, SAMPLE_VIDEOS } from './utils/youtube';
import {
  getDownloadHistory,
  addDownloadHistory,
  clearDownloadHistory,
  getSupabaseConfig,
} from './utils/supabase';
import {
  AppUser,
  getCurrentUser,
  getAllRechargeRequests,
  getAllUsers,
} from './utils/credits';

export default function App() {
  // Theme state: default to dark for the signature YouTube/video studio feel
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ythuz_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return true;
    }
  });

  // User and credits state
  const [currentUser, setCurrentUser] = useState<AppUser>(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [pendingRechargesCount, setPendingRechargesCount] = useState<number>(() => {
    return getAllRechargeRequests().filter((r) => r.status === 'pending').length;
  });

  // URL and analysis state
  const [urlInput, setUrlInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<VideoMetadata | null>(null);

  // History state
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);

  // Supabase state
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseSettings>(getSupabaseConfig());
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Legal & Contact modals
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null);

  // Toast notification state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshUserData = () => {
    const updated = getCurrentUser();
    setCurrentUser(updated);
    setPendingRechargesCount(
      getAllRechargeRequests().filter((r) => r.status === 'pending').length
    );
  };

  // Sync theme with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('ythuz_theme', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('ythuz_theme', 'light');
      } catch {}
    }
  }, [darkMode]);

  // Load history on mount
  useEffect(() => {
    getDownloadHistory().then((items) => {
      setHistory(items);
    });

    // Check query params for autostart or initial video url (useful for automated tests)
    const params = new URLSearchParams(window.location.search);
    const autostart = params.get('autostart');
    const videoParam = params.get('v') || params.get('url');

    if (videoParam) {
      setUrlInput(videoParam);
      handleAnalyze(videoParam);
    } else if (autostart === '1') {
      const defaultSample = SAMPLE_VIDEOS[0];
      setUrlInput(defaultSample.url);
      handleAnalyze(defaultSample.url);
    }
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAnalyze = async (rawUrl?: string) => {
    const targetUrl = rawUrl || urlInput;
    if (!targetUrl.trim()) {
      setErrorMessage('Please enter a YouTube video URL to analyze.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await fetchVideoMetadata(targetUrl);
      setCurrentVideo(data);
      showToast(`Loaded metadata for "${data.title.slice(0, 35)}..."`, 'success');

      // Scroll smoothly down to preview
      setTimeout(() => {
        const previewEl = document.getElementById('video-preview-section');
        previewEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          'Could not analyze this URL. Please verify it is a valid YouTube link (e.g., https://www.youtube.com/watch?v=...).'
      );
      showToast('Invalid YouTube video link', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadLogged = async (item: DownloadHistoryItem) => {
    await addDownloadHistory(item);
    const updated = await getDownloadHistory();
    setHistory(updated);
  };

  const handleCreditsDeducted = (newBalance: number) => {
    setCurrentUser((prev) => ({ ...prev, credits: newBalance }));
  };

  const handleClearHistory = async () => {
    await clearDownloadHistory();
    setHistory([]);
    showToast('Download history cleared', 'info');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-red-500 selection:text-white transition-colors duration-200">
      {/* Navigation Bar with Credit Wallet, Auth & Admin */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        historyCount={history.length}
        onOpenHistory={() => {
          const el = document.getElementById('history');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        isSupabaseConnected={supabaseConfig.enabled}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenBuyCredits={() => setIsBuyCreditsModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        pendingRechargesCount={pendingRechargesCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with URL Input */}
        <Hero
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onClearError={() => setErrorMessage(null)}
        />

        {/* Video Preview & Download Configuration */}
        {currentVideo && (
          <section id="video-preview-section" className="scroll-mt-24">
            <VideoPreview metadata={currentVideo} onToast={showToast} />
            <DownloadOptions
              metadata={currentVideo}
              currentUser={currentUser}
              onCreditsDeducted={handleCreditsDeducted}
              onOpenBuyCredits={() => setIsBuyCreditsModalOpen(true)}
              onDownloadLogged={handleDownloadLogged}
              onToast={showToast}
            />
          </section>
        )}

        {/* Download History Section */}
        <DownloadHistory
          history={history}
          onClearHistory={handleClearHistory}
          onToast={showToast}
        />

        {/* Features Showcase */}
        <FeaturesSection />

        {/* Format Comparison & Technical Guide */}
        <FormatComparison />

        {/* FAQ Accordion */}
        <FaqSection />

        {/* Creator Spotlight: Huzaifa */}
        <AboutCreator onOpenContact={() => setActiveLegalModal('contact')} />
      </main>

      {/* Global Footer */}
      <Footer onOpenModal={(type) => setActiveLegalModal(type)} />

      {/* Authentication Modal (Login / 20 Free Credits Bonus) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChanged={(user) => {
          setCurrentUser(user);
          refreshUserData();
        }}
        onToast={showToast}
        onOpenBuyCredits={() => setIsBuyCreditsModalOpen(true)}
      />

      {/* Buy Credits Modal (UPI 6201927841@ybl & UTR Verification) */}
      <BuyCreditsModal
        isOpen={isBuyCreditsModalOpen}
        onClose={() => {
          setIsBuyCreditsModalOpen(false);
          refreshUserData();
        }}
        currentUser={currentUser}
        onToast={showToast}
      />

      {/* Admin Approval Modal (Review & Approve UPI Recharges) */}
      <AdminApprovalModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          refreshUserData();
        }}
        currentUser={currentUser}
        onUserRefreshed={refreshUserData}
        onToast={showToast}
      />

      {/* Supabase Settings Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onSaved={(cfg) => setSupabaseConfig(cfg)}
        onToast={showToast}
      />

      {/* Legal & Contact Modals */}
      <LegalModals
        activeModal={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
        onToast={showToast}
      />

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
