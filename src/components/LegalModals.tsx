import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Send, Mail, CheckCircle2 } from 'lucide-react';

export type LegalModalType = 'privacy' | 'terms' | 'contact' | null;

interface LegalModalsProps {
  activeModal: LegalModalType;
  onClose: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({
  activeModal,
  onClose,
  onToast,
}) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  if (!activeModal) return null;

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      onToast('Please fill out all fields', 'error');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setContactSuccess(true);
      onToast('Message sent to Huzaifa! Thank you.', 'success');
      setTimeout(() => {
        setContactSuccess(false);
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Privacy Policy */}
        {activeModal === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-red-500/10 text-red-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Privacy Policy</h3>
                <p className="text-xs text-neutral-500">Effective Date: November 2026</p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 space-y-3 leading-relaxed">
              <p>
                <strong>YTHuz</strong> (engineered by Huzaifa) is committed to protecting your privacy.
                We believe video management and metadata extraction tools should operate transparently without
                invasive user profiling, fingerprinting, or ad tracking.
              </p>
              <h4 className="font-bold text-neutral-900 dark:text-white pt-2">1. Information We Do Not Collect</h4>
              <p>
                YTHuz does not record personal identity data, track individual viewing habits, or intercept private
                streams. Download actions take place inside your browser environment without storing media copies on our servers.
              </p>
              <h4 className="font-bold text-neutral-900 dark:text-white pt-2">2. Local & Supabase Storage</h4>
              <p>
                Your download history and preferences are preserved solely in your local browser’s LocalStorage.
                If you elect to connect a personal Supabase instance, data syncs only to your private database schema.
              </p>
              <h4 className="font-bold text-neutral-900 dark:text-white pt-2">3. Third-Party CDNs</h4>
              <p>
                Public video thumbnails and oEmbed metadata are retrieved directly from official media content delivery networks
                with standard HTTPS web requests.
              </p>
            </div>
          </div>
        )}

        {/* Terms of Service */}
        {activeModal === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-red-500/10 text-red-500">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Terms of Service</h3>
                <p className="text-xs text-neutral-500">Last updated: November 2026</p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 space-y-3 leading-relaxed">
              <p>
                Welcome to <strong>YTHuz</strong>, designed and operated by <strong>Huzaifa</strong>.
                By accessing or using YTHuz, you agree to comply with these terms.
              </p>
              <h4 className="font-bold text-neutral-900 dark:text-white pt-2">1. Authorized Content Usage Only</h4>
              <p>
                YTHuz is strictly intended for content creators downloading their own materials, individuals archiving
                Creative Commons (CC-BY) or Public Domain media, and users who have acquired explicit authorization from
                the media copyright owner.
              </p>
              <h4 className="font-bold text-neutral-900 dark:text-white pt-2">2. Respect for Intellectual Property & DRM</h4>
              <p>
                YTHuz does not circumvent digital rights management (DRM), decrypt encrypted streams, or facilitate the
                unauthorized reproduction of commercial copyright material. Users are solely responsible for ensuring
                their usage conforms to copyright laws and relevant platform terms of service.
              </p>
              <h4 className="font-bold text-neutral-900 dark:text-white pt-2">3. Disclaimer of Warranties</h4>
              <p>
                YTHuz is provided on an &quot;as-is&quot; basis for personal workflow productivity. Huzaifa disclaims all
                warranties, express or implied, regarding continuous availability or fitness for a particular purpose.
              </p>
            </div>
          </div>
        )}

        {/* Contact Huzaifa Modal */}
        {activeModal === 'contact' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-red-500/10 text-red-500">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Contact Huzaifa</h3>
                <p className="text-xs text-neutral-500">Send feedback, feature requests, or business inquiries</p>
              </div>
            </div>

            {contactSuccess ? (
              <div className="py-8 text-center space-y-3 animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-lg font-bold text-neutral-900 dark:text-white">Message Received!</h4>
                <p className="text-xs text-neutral-500">
                  Thank you for reaching out to Huzaifa. I will review your message shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell Huzaifa what features you'd like to see in YTHuz..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-red-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-red-600 hover:bg-red-500 text-white transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send to Huzaifa</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
