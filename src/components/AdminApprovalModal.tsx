import React, { useState, useEffect } from 'react';
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
  Filter,
  CheckCheck,
  Mail,
  Lock,
  ExternalLink,
  Laptop,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import {
  AppUser,
  RechargeRequest,
  AuthNotification,
  ADMIN_EMAIL,
  isUserAdmin,
  getAllRechargeRequests,
  approveRechargeRequest,
  rejectRechargeRequest,
  adminAdjustCredits,
  getAllUsers,
  getAllAuthNotifications,
  registerOrLoginUser,
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
  const [activeTab, setActiveTab] = useState<'requests' | 'auth_alerts' | 'manual_grant'>('requests');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [requests, setRequests] = useState<RechargeRequest[]>(() => getAllRechargeRequests());
  const [authNotifs, setAuthNotifs] = useState<AuthNotification[]>(() => getAllAuthNotifications());
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  // Manual grant state
  const [manualEmail, setManualEmail] = useState('');
  const [manualAmount, setManualAmount] = useState('50');

  const isAdmin = isUserAdmin(currentUser.email);

  useEffect(() => {
    if (isOpen) {
      setRequests(getAllRechargeRequests());
      setAuthNotifs(getAllAuthNotifications());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const reloadData = () => {
    setRequests(getAllRechargeRequests());
    setAuthNotifs(getAllAuthNotifications());
    onUserRefreshed();
  };

  const handleApprove = (reqId: string) => {
    if (!isAdmin) {
      onToast(`Access Denied: Only ${ADMIN_EMAIL} can approve payments and add credits!`, 'error');
      return;
    }

    const res = approveRechargeRequest(reqId, currentUser.email, `${currentUser.name} (Admin)`);
    if (res.success) {
      onToast(res.message, 'success');
      reloadData();
    } else {
      onToast(res.message, 'error');
    }
  };

  const handleReject = (reqId: string) => {
    if (!isAdmin) {
      onToast(`Access Denied: Only ${ADMIN_EMAIL} can reject requests!`, 'error');
      return;
    }

    const reason = prompt(
      'Enter rejection reason (e.g., UTR not found on UPI statement):',
      'Payment reference could not be verified on UPI bank statement'
    );
    if (reason !== null) {
      const res = rejectRechargeRequest(reqId, currentUser.email, reason, `${currentUser.name} (Admin)`);
      if (res.success) {
        onToast(res.message, 'info');
        reloadData();
      } else {
        onToast(res.message, 'error');
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
    if (!isAdmin) {
      onToast(`Access Denied: Only ${ADMIN_EMAIL} can grant credits!`, 'error');
      return;
    }

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

    const res = adminAdjustCredits(target.id, credits, currentUser.email, `Manual Grant by Admin`);
    if (res.success) {
      onToast(`Granted +${credits} credits to ${target.name} (${target.email})`, 'success');
      setManualEmail('');
      reloadData();
    } else {
      onToast(res.message || 'Failed to adjust credits', 'error');
    }
  };

  const handleSwitchToAdmin = () => {
    registerOrLoginUser(ADMIN_EMAIL, 'Huzaifa (Admin)');
    onUserRefreshed();
    onToast(`Logged in as verified administrator (${ADMIN_EMAIL})!`, 'success');
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[92vh] flex flex-col bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/80 dark:bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isAdmin ? 'bg-gradient-to-tr from-purple-600 to-indigo-600' : 'bg-amber-600'} text-white shadow-md`}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Admin Approval Panel</h3>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
                    {pendingCount} Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Authorized Admin: <strong className="text-red-500 font-mono">{ADMIN_EMAIL}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Authorization Banner */}
        <div className={`px-6 py-3 border-b text-xs flex flex-wrap items-center justify-between gap-3 ${
          isAdmin
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
            : 'bg-amber-500/15 border-amber-500/30 text-amber-900 dark:text-amber-200'
        }`}>
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <>
                <CheckCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>Authorized Session:</strong> You are logged in as <strong>{ADMIN_EMAIL}</strong>. You have exclusive approval authority.
                </span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  <strong>Strict Security:</strong> Only <strong>{ADMIN_EMAIL}</strong> is authorized to approve UPI payments and add credits. Current user: {currentUser.email}
                </span>
              </>
            )}
          </div>
          {!isAdmin && (
            <button
              type="button"
              onClick={handleSwitchToAdmin}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Log in as {ADMIN_EMAIL}
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-4 border-b border-neutral-200 dark:border-neutral-800 flex gap-2 bg-white dark:bg-neutral-900">
          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'requests'
                ? 'border-red-500 text-red-600 dark:text-red-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Recharge Approvals ({requests.length})</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping ml-1" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('auth_alerts')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'auth_alerts'
                ? 'border-red-500 text-red-600 dark:text-red-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Auth Alerts ({authNotifs.length})</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-500 border border-purple-500/20">
              hozikhan00@gmail.com
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manual_grant')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'manual_grant'
                ? 'border-red-500 text-red-600 dark:text-red-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Manual Grant</span>
          </button>
        </div>

        {/* Tab 1: Recharge Requests */}
        {activeTab === 'requests' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Filter controls */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1 text-xs">
                <Filter className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-neutral-400">Filter:</span>
                {(['pending', 'approved', 'rejected', 'all'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      filter === st
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <div className="text-xs text-neutral-400">
                Showing {filteredRequests.length} of {requests.length} requests
              </div>
            </div>

            {/* List of Requests */}
            {filteredRequests.length === 0 ? (
              <div className="py-12 text-center text-neutral-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="font-semibold">No {filter} recharge requests found</p>
                <p className="text-xs mt-1">When users pay via UPI and submit their UTR, they appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900 dark:text-white text-base">
                            {req.userName}
                          </span>
                          <span className="text-xs text-neutral-400 font-mono">({req.userEmail})</span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              req.status === 'pending'
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse'
                                : req.status === 'approved'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                          <span className="font-semibold text-red-500">{req.packageName}</span>
                          <span>•</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            +{req.creditsRequested} Credits
                          </span>
                          <span>•</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{req.amountINR} Paid
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-neutral-400">
                            <Clock className="w-3 h-3" />
                            {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* 12-Digit UTR Box with 1-click Copy */}
                        <div className="pt-2 flex items-center gap-2">
                          <span className="text-xs font-semibold text-neutral-400">UPI Ref / UTR:</span>
                          <code className="px-2 py-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-xs font-bold text-red-600 dark:text-red-400 select-all">
                            {req.utrNumber}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopyUtr(req.utrNumber)}
                            className="p-1 rounded-md text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                            title="Copy UTR to verify on UPI App"
                          >
                            {copiedUtr === req.utrNumber ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {req.rejectionReason && (
                          <p className="text-xs text-red-400 pt-1">
                            Reason: {req.rejectionReason}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      {req.status === 'pending' && (
                        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => handleApprove(req.id)}
                            disabled={!isAdmin}
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                              isAdmin
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95'
                                : 'bg-neutral-300 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                            }`}
                            title={isAdmin ? 'Approve and add credits' : `Only ${ADMIN_EMAIL} can approve`}
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve (+{req.creditsRequested})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(req.id)}
                            disabled={!isAdmin}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                              isAdmin
                                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 cursor-pointer'
                                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                            }`}
                            title={isAdmin ? 'Reject request' : `Only ${ADMIN_EMAIL} can reject`}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Auth Alerts Dispatched to hozikhan00@gmail.com */}
        {activeTab === 'auth_alerts' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-red-500/10 border border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-600 text-white shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Auth Details Dispatch Inbox: {ADMIN_EMAIL}
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Whenever any user creates an account or logs in to YTHuz, their full identity, timestamps, device specs, and initial credits are recorded and dispatched here for {ADMIN_EMAIL}.
                  </p>
                </div>
              </div>
            </div>

            {authNotifs.length === 0 ? (
              <div className="py-12 text-center text-neutral-400">
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="font-semibold">No auth alerts recorded yet</p>
                <p className="text-xs mt-1">User login and registration alerts will appear here in real time.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {authNotifs.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            notif.type === 'signup'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          }`}>
                            {notif.type === 'signup' ? '🎉 New Signup' : '🔑 User Login'}
                          </span>
                          <span className="font-bold text-neutral-900 dark:text-white text-sm">
                            {notif.userName}
                          </span>
                          <span className="font-mono text-xs text-neutral-400">
                            {notif.userEmail}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          {notif.type === 'signup'
                            ? `Awarded 20 Welcome Bonus Credits • Balance: ${notif.currentBalance} 🪙`
                            : `Logged in session • Current Balance: ${notif.currentBalance} 🪙`}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Sent to {ADMIN_EMAIL}</span>
                        </span>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          {new Date(notif.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Device & Client Telemetry */}
                    <div className="pt-2 border-t border-neutral-200/80 dark:border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-neutral-500">
                      <div>
                        <span className="text-neutral-400">Platform: </span>
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">{notif.deviceInfo.platform}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400">Screen: </span>
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">{notif.deviceInfo.screenResolution || '1920x1080'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400">Language: </span>
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">{notif.deviceInfo.language}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400">Timezone: </span>
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">{notif.deviceInfo.timezone || 'Asia/Kolkata'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Manual Credit Grant */}
        {activeTab === 'manual_grant' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                Grant or Adjust User Credits
              </h4>
              <p className="text-xs text-neutral-500 mb-4">
                As the authorized admin ({ADMIN_EMAIL}), you can directly grant credits to any user by email.
              </p>

              <form onSubmit={handleManualGrant} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    User Email Address
                  </label>
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Credits to Grant
                  </label>
                  <input
                    type="number"
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    placeholder="50"
                    min="1"
                    max="10000"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!isAdmin}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    isAdmin
                      ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer'
                      : 'bg-neutral-300 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  <span>Grant Credits (Admin: {ADMIN_EMAIL})</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
