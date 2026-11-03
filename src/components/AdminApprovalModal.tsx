import React, { useState } from 'react';
import {
  X,
  Shield,
  Check,
  AlertCircle,
  Copy,
  Clock,
  User,
  PlusCircle,
  Coins,
  ArrowUpRight,
  Filter,
  CheckCheck,
} from 'lucide-react';
import {
  AppUser,
  RechargeRequest,
  getAllRechargeRequests,
  approveRechargeRequest,
  rejectRechargeRequest,
  adminAdjustCredits,
  getAllUsers,
} from '../utils/credits';
import { copyToClipboard } from '../utils/download';

interface AdminApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser;
  onUserRefreshed: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminApprovalModal: React.FC<AdminApprovalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserRefreshed,
  onToast,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [requests, setRequests] = useState<RechargeRequest[]>(() => getAllRechargeRequests());
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  // Manual grant state
  const [manualEmail, setManualEmail] = useState('');
  const [manualAmount, setManualAmount] = useState('50');
  const [showManualGrant, setShowManualGrant] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setRequests(getAllRechargeRequests());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const reloadRequests = () => {
    setRequests(getAllRechargeRequests());
    onUserRefreshed();
  };

  const handleApprove = (reqId: string) => {
    const res = approveRechargeRequest(reqId, `${currentUser.name} (Admin)`);
    if (res.success) {
      onToast(res.message, 'success');
      reloadRequests();
    } else {
      onToast(res.message, 'error');
    }
  };

  const handleReject = (reqId: string) => {
    const reason = prompt('Enter rejection reason (e.g., UTR not found or incorrect amount):', 'Payment could not be verified on UPI statement');
    if (reason !== null) {
      const res = rejectRechargeRequest(reqId, reason, `${currentUser.name} (Admin)`);
      if (res.success) {
        onToast('Request rejected', 'info');
        reloadRequests();
      }
    }
  };

  const handleCopyUtr = async (utr: string) => {
    const ok = await copyToClipboard(utr);
    if (ok) {
      setCopiedUtr(utr);
      onToast(`Copied UTR: ${utr}`, 'info');
      setTimeout(() => setCopiedUtr(null), 2000);
    }
  };

  const handleManualGrant = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getAllUsers();
    const target = users.find((u) => u.email.toLowerCase() === manualEmail.trim().toLowerCase());
    if (!target) {
      onToast(`User with email "${manualEmail}" not found`, 'error');
      return;
    }

    const credits = parseInt(manualAmount, 10);
    if (isNaN(credits) || credits <= 0) {
      onToast('Enter a valid positive number of credits', 'error');
      return;
    }

    adminAdjustCredits(target.id, credits, `Manual Grant by Admin`);
    onToast(`Granted +${credits} credits to ${target.name} (${target.email})`, 'success');
    setManualEmail('');
    setShowManualGrant(false);
    onUserRefreshed();
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const filteredRequests = requests.filter((r) => filter === 'all' || r.status === filter);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Admin Approval Dashboard
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Huzaifa Panel
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Review & approve UPI 6201927841@ybl credit recharge requests
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowManualGrant(!showManualGrant)}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-purple-500" />
            <span>Manual Grant</span>
          </button>
        </div>

        {/* Manual Grant Tool Popup */}
        {showManualGrant && (
          <form
            onSubmit={handleManualGrant}
            className="mb-6 p-4 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 space-y-3 animate-fadeIn"
          >
            <h4 className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
              Direct Credit Grant (Admin Only)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="email"
                  required
                  placeholder="User email (e.g. user@gmail.com)"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Credits"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="w-24 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shrink-0"
                >
                  Grant
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              filter === 'pending'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ({pendingCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              filter === 'approved'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Approved</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            All Requests ({requests.length})
          </button>
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <CheckCheck className="w-10 h-10 mx-auto mb-2 text-neutral-300 dark:text-neutral-700" />
              <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                No {filter !== 'all' ? filter : ''} recharge requests found
              </p>
              <p className="mt-1">
                When users send payments to <strong>6201927841@ybl</strong> and submit their UTR, they will appear here for one-click approval.
              </p>
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white">
                      +{req.creditsRequested} Credits
                    </span>
                    <span className="text-xs font-bold text-red-500 font-mono">
                      (₹{req.amountINR})
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {req.packageName}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-600 dark:text-neutral-300 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-neutral-900 dark:text-white">{req.userName}</span>
                    <span className="font-mono text-neutral-400">({req.userEmail})</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="text-neutral-400">UTR / Ref:</span>
                    <code className="font-mono font-bold text-neutral-900 dark:text-white bg-white dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700">
                      {req.utrNumber}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyUtr(req.utrNumber)}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                      title="Copy UTR"
                    >
                      {copiedUtr === req.utrNumber ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="text-[10px] text-neutral-400 ml-2">
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {req.rejectionReason && (
                    <p className="text-[11px] text-red-500">Reason: {req.rejectionReason}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {req.status === 'pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApprove(req.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve & Credit (+{req.creditsRequested})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(req.id)}
                        className="px-3 py-2 rounded-xl bg-neutral-200 hover:bg-red-50 dark:bg-neutral-800 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  ) : req.status === 'approved' ? (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Approved ({req.reviewedBy})</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25">
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
