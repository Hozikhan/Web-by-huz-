import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import {
  AppUser,
  CREDIT_PACKAGES,
  CreditPackage,
  UPI_ID,
  generateUpiUrl,
  generateQrCodeUrl,
  submitRechargeRequest,
  getAllRechargeRequests,
  RechargeRequest,
} from '../utils/credits';
import { copyToClipboard } from '../utils/download';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onOpenAuth?: () => void;
}

export const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onToast,
  onOpenAuth,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage>(CREDIT_PACKAGES[1]); // Default 150 credits (₹99)
  const [step, setStep] = useState<'select' | 'pay' | 'my_requests'>('select');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const upiUrl = generateUpiUrl(
    selectedPackage.amountINR,
    `YTHuz ${selectedPackage.credits} Credits for ${currentUser?.email ?? 'User'}`
  );
  const qrCodeUrl = generateQrCodeUrl(upiUrl);

  const handleCopyUpi = async () => {
    const ok = await copyToClipboard(UPI_ID);
    if (ok) {
      setCopiedUpi(true);
      onToast('UPI ID copied to clipboard: 6201927841@ybl', 'success');
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onToast('Please sign in first to submit a recharge request', 'error');
      if (onOpenAuth) onOpenAuth();
      return;
    }

    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      onToast('Please enter a valid 12-digit UPI UTR / Transaction Reference Number', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitRechargeRequest(currentUser, selectedPackage, utrNumber);
      setIsSubmitting(false);
      setUtrNumber('');
      onToast('Recharge request submitted! Waiting for Admin (hozikhan00@gmail.com) approval.', 'success');
      setStep('my_requests');
    }, 500);
  };

  // User's own requests
  const myRequests = currentUser
    ? getAllRechargeRequests().filter((r) => r.userId === currentUser.id)
    : [];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-md shadow-red-500/20">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Recharge Credits
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                1 Download = 3 Credits • Approved by <strong className="text-red-500">hozikhan00@gmail.com</strong>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-neutral-400 block">Your Balance</span>
            <span className="text-lg font-black text-red-500 font-mono">
              {currentUser ? currentUser.credits : 0} <span className="text-xs font-semibold">Credits</span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 mb-6">
          <button
            type="button"
            onClick={() => setStep('select')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              step === 'select' || step === 'pay'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Buy Credit Packages
          </button>
          <button
            type="button"
            onClick={() => setStep('my_requests')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all relative ${
              step === 'my_requests'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            My Recharge Status ({myRequests.length})
          </button>
        </div>

        {/* STEP 1: Select Package */}
        {step === 'select' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CREDIT_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    selectedPackage.id === pkg.id
                      ? 'border-red-500 bg-red-500/10 dark:bg-red-500/15 ring-2 ring-red-500/30'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 hover:border-neutral-300'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-sm">
                      Best Value
                    </span>
                  )}
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white text-sm">{pkg.name}</h4>
                    <p className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                      {pkg.credits} <span className="text-xs font-semibold text-neutral-500">Credits</span>
                    </p>
                    <p className="text-xs text-red-500 font-semibold mt-0.5">{pkg.savings}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-neutral-900 dark:text-white">
                      ₹{pkg.amountINR}
                    </span>
                    <span className="text-[10px] text-neutral-400">One-time</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep('pay')}
              className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>Continue to Pay ₹{selectedPackage.amountINR} via UPI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Pay with UPI & Submit UTR */}
        {step === 'pay' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Package Summary Bar */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400">Selected Package:</span>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">
                  {selectedPackage.name} ({selectedPackage.credits} Credits)
                </p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-red-500">₹{selectedPackage.amountINR}</span>
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="block text-[11px] text-neutral-400 hover:text-red-500 underline"
                >
                  Change
                </button>
              </div>
            </div>

            {/* UPI Payment Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* QR Code */}
                <div className="p-2 rounded-2xl bg-white shadow-md border border-neutral-200 shrink-0 text-center">
                  <img
                    src={qrCodeUrl}
                    alt="UPI Payment QR Code"
                    className="w-28 h-28 object-contain mx-auto"
                  />
                  <span className="text-[10px] text-neutral-600 font-semibold block mt-1">
                    Scan with any UPI App
                  </span>
                </div>

                {/* UPI Details */}
                <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Official Verified Payee</span>
                  </div>

                  <div>
                    <span className="text-xs text-neutral-400 block">Payee UPI ID:</span>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <code className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-white font-mono bg-white dark:bg-neutral-800 px-2 py-0.5 rounded-lg border border-neutral-300 dark:border-neutral-700">
                        {UPI_ID}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="p-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Payee Name: <strong className="text-neutral-700 dark:text-neutral-200">Huzaifa (YTHuz)</strong>
                  </p>

                  <a
                    href={upiUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:underline pt-1"
                  >
                    <span>Click here to open UPI App on Mobile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Submission Form: UTR / Reference Number */}
            <form onSubmit={handleSubmitRequest} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Enter 12-digit UPI Transaction / UTR Ref Number
                </label>
                <input
                  type="text"
                  required
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value.trim())}
                  placeholder="e.g. 431289567123"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-red-500 font-mono tracking-wider"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  You can find the 12-digit UTR in your Google Pay, PhonePe, Paytm, or banking app receipt.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <span>
                  <strong>Admin Approval Required:</strong> Once you submit, Admin (Huzaifa) will verify the UPI payment
                  and credit <strong>+{selectedPackage.credits} credits</strong> to your account!
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>Submit Payment for Admin Approval</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: My Recharge Status List */}
        {step === 'my_requests' && (
          <div className="space-y-3 animate-fadeIn">
            {myRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                <Clock className="w-8 h-8 mx-auto mb-2 text-neutral-300 dark:text-neutral-700" />
                <p className="font-semibold text-neutral-700 dark:text-neutral-300">No recharge requests yet</p>
                <p className="mt-1">Select a package and pay via UPI to recharge your wallet.</p>
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="mt-3 px-3.5 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs"
                >
                  Buy Package
                </button>
              </div>
            ) : (
              myRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-900 dark:text-white">
                        +{req.creditsRequested} Credits
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">₹{req.amountINR}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                      UTR: {req.utrNumber}
                    </p>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(req.createdAt).toLocaleDateString()} at{' '}
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-right">
                    {req.status === 'pending' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" />
                        <span>Pending Approval</span>
                      </span>
                    )}
                    {req.status === 'approved' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Approved & Credited</span>
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Rejected</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}

            <button
              type="button"
              onClick={() => setStep('select')}
              className="w-full mt-2 py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              + Create Another Recharge Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
