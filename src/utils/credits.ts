export const INITIAL_FREE_CREDITS = 20;
export const DOWNLOAD_CREDIT_COST = 3;
export const UPI_ID = '6201927841@ybl';
export const ADMIN_EMAIL = 'hozikhan00@gmail.com';

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  amountINR: number;
  popular?: boolean;
  savings?: string;
  badge?: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'pack_starter',
    name: 'Starter Pack',
    credits: 50,
    amountINR: 49,
    savings: '16+ Downloads',
    badge: 'Popular for Beginners',
  },
  {
    id: 'pack_creator',
    name: 'Creator Pro',
    credits: 150,
    amountINR: 99,
    popular: true,
    savings: '50+ Downloads • Save 35%',
    badge: 'Best Value',
  },
  {
    id: 'pack_studio',
    name: 'Studio Master',
    credits: 500,
    amountINR: 249,
    savings: '166+ Downloads • Save 60%',
    badge: 'Heavy Archivist',
  },
];

export interface AppUser {
  id: string;
  email: string;
  name: string;
  credits: number;
  role: 'user' | 'admin';
  createdAt: number;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'welcome_bonus' | 'download_deduction' | 'recharge_approved' | 'admin_grant' | 'admin_deduct';
  amount: number; // positive or negative
  balanceAfter: number;
  description: string;
  timestamp: number;
}

export interface RechargeRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  packageId: string;
  packageName: string;
  creditsRequested: number;
  amountINR: number;
  upiId: string;
  utrNumber: string; // 12-digit UPI transaction reference
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
  rejectionReason?: string;
}

const STORAGE_USERS = 'ythuz_users_v2';
const STORAGE_CURRENT_USER = 'ythuz_current_user_id_v2';
const STORAGE_TRANSACTIONS = 'ythuz_credit_txs_v2';
const STORAGE_RECHARGES = 'ythuz_recharge_requests_v2';

export function getAllUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveAllUsers(users: AppUser[]): void {
  try {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  } catch {}
}

export function getAllTransactions(): CreditTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_TRANSACTIONS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveAllTransactions(txs: CreditTransaction[]): void {
  try {
    localStorage.setItem(STORAGE_TRANSACTIONS, JSON.stringify(txs));
  } catch {}
}

export function getAllRechargeRequests(): RechargeRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_RECHARGES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveAllRechargeRequests(reqs: RechargeRequest[]): void {
  try {
    localStorage.setItem(STORAGE_RECHARGES, JSON.stringify(reqs));
  } catch {}
}

/**
 * Creates or logs in a user. If new user, awards 20 free credits.
 */
export function registerOrLoginUser(email: string, name: string): { user: AppUser; isNew: boolean } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || cleanEmail.split('@')[0];
  const users = getAllUsers();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (existing) {
    // Check if admin email
    if (cleanEmail === ADMIN_EMAIL && existing.role !== 'admin') {
      existing.role = 'admin';
      saveAllUsers(users);
    }
    localStorage.setItem(STORAGE_CURRENT_USER, existing.id);
    return { user: existing, isNew: false };
  }

  // New user gets 20 free credits
  const isAdmin = cleanEmail === ADMIN_EMAIL || cleanEmail.startsWith('admin@') || cleanName.toLowerCase() === 'huzaifa';
  const newUser: AppUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    email: cleanEmail,
    name: cleanName,
    credits: INITIAL_FREE_CREDITS,
    role: isAdmin ? 'admin' : 'user',
    createdAt: Date.now(),
  };

  users.push(newUser);
  saveAllUsers(users);
  localStorage.setItem(STORAGE_CURRENT_USER, newUser.id);

  // Record Welcome Bonus transaction
  const tx: CreditTransaction = {
    id: `tx_${Date.now()}_welcome`,
    userId: newUser.id,
    type: 'welcome_bonus',
    amount: INITIAL_FREE_CREDITS,
    balanceAfter: INITIAL_FREE_CREDITS,
    description: `Welcome Bonus: ${INITIAL_FREE_CREDITS} Free Credits on Registration`,
    timestamp: Date.now(),
  };

  const txs = getAllTransactions();
  txs.unshift(tx);
  saveAllTransactions(txs);

  return { user: newUser, isNew: true };
}

/**
 * Gets currently logged in user or creates default demo session
 */
export function getCurrentUser(): AppUser {
  const currentId = localStorage.getItem(STORAGE_CURRENT_USER);
  const users = getAllUsers();
  if (currentId) {
    const user = users.find((u) => u.id === currentId);
    if (user) return user;
  }

  // If no user exists, create default creator/demo user with 20 free credits
  const demoResult = registerOrLoginUser('creator@ythuz.app', 'Huzaifa (Creator)');
  return demoResult.user;
}

/**
 * Deducts 3 credits for a download
 */
export function deductDownloadCredits(userId: string, videoTitle: string): {
  success: boolean;
  newBalance: number;
  error?: string;
} {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return { success: false, newBalance: 0, error: 'User not found. Please log in.' };
  }

  if (user.credits < DOWNLOAD_CREDIT_COST) {
    return {
      success: false,
      newBalance: user.credits,
      error: `Insufficient credits! You have ${user.credits} credits, but this download requires ${DOWNLOAD_CREDIT_COST} credits. Please recharge your wallet.`,
    };
  }

  user.credits -= DOWNLOAD_CREDIT_COST;
  saveAllUsers(users);

  // Record transaction
  const tx: CreditTransaction = {
    id: `tx_${Date.now()}_dl`,
    userId: user.id,
    type: 'download_deduction',
    amount: -DOWNLOAD_CREDIT_COST,
    balanceAfter: user.credits,
    description: `Download Media: "${videoTitle.slice(0, 30)}..." (-${DOWNLOAD_CREDIT_COST} credits)`,
    timestamp: Date.now(),
  };

  const txs = getAllTransactions();
  txs.unshift(tx);
  saveAllTransactions(txs);

  return { success: true, newBalance: user.credits };
}

/**
 * Submits a new recharge payment request with UPI reference (UTR)
 */
export function submitRechargeRequest(
  user: AppUser,
  pkg: CreditPackage,
  utrNumber: string
): RechargeRequest {
  const req: RechargeRequest = {
    id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    packageId: pkg.id,
    packageName: pkg.name,
    creditsRequested: pkg.credits,
    amountINR: pkg.amountINR,
    upiId: UPI_ID,
    utrNumber: utrNumber.trim(),
    status: 'pending',
    createdAt: Date.now(),
  };

  const reqs = getAllRechargeRequests();
  reqs.unshift(req);
  saveAllRechargeRequests(reqs);

  return req;
}

/**
 * Admin approves a recharge request and credits the user's account
 */
export function approveRechargeRequest(
  requestId: string,
  adminName = 'Admin (Huzaifa)'
): { success: boolean; message: string; user?: AppUser } {
  const reqs = getAllRechargeRequests();
  const req = reqs.find((r) => r.id === requestId);
  if (!req) return { success: false, message: 'Request not found' };
  if (req.status !== 'pending') return { success: false, message: `Request is already ${req.status}` };

  const users = getAllUsers();
  const user = users.find((u) => u.id === req.userId);
  if (!user) return { success: false, message: 'User account not found' };

  req.status = 'approved';
  req.reviewedAt = Date.now();
  req.reviewedBy = adminName;
  saveAllRechargeRequests(reqs);

  user.credits += req.creditsRequested;
  saveAllUsers(users);

  // Record transaction
  const tx: CreditTransaction = {
    id: `tx_${Date.now()}_recharge`,
    userId: user.id,
    type: 'recharge_approved',
    amount: req.creditsRequested,
    balanceAfter: user.credits,
    description: `Recharge Approved: ${req.packageName} (+${req.creditsRequested} credits via UPI ${req.utrNumber})`,
    timestamp: Date.now(),
  };

  const txs = getAllTransactions();
  txs.unshift(tx);
  saveAllTransactions(txs);

  return {
    success: true,
    message: `Successfully approved! ${req.creditsRequested} credits added to ${user.name} (${user.email}).`,
    user,
  };
}

/**
 * Admin rejects a recharge request
 */
export function rejectRechargeRequest(
  requestId: string,
  reason = 'Invalid UPI reference / payment unverified',
  adminName = 'Admin (Huzaifa)'
): { success: boolean; message: string } {
  const reqs = getAllRechargeRequests();
  const req = reqs.find((r) => r.id === requestId);
  if (!req) return { success: false, message: 'Request not found' };

  req.status = 'rejected';
  req.reviewedAt = Date.now();
  req.reviewedBy = adminName;
  req.rejectionReason = reason;
  saveAllRechargeRequests(reqs);

  return { success: true, message: 'Recharge request rejected.' };
}

/**
 * Admin manually modifies user credits
 */
export function adminAdjustCredits(
  userId: string,
  amount: number,
  reason = 'Admin Adjustment'
): { success: boolean; user?: AppUser } {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return { success: false };

  user.credits = Math.max(0, user.credits + amount);
  saveAllUsers(users);

  const tx: CreditTransaction = {
    id: `tx_${Date.now()}_adj`,
    userId: user.id,
    type: amount >= 0 ? 'admin_grant' : 'admin_deduct',
    amount,
    balanceAfter: user.credits,
    description: `${reason} (${amount >= 0 ? '+' : ''}${amount} credits)`,
    timestamp: Date.now(),
  };

  const txs = getAllTransactions();
  txs.unshift(tx);
  saveAllTransactions(txs);

  return { success: true, user };
}

/**
 * Generate official UPI Deep Link for mobile UPI apps
 */
export function generateUpiUrl(amountINR: number, note = 'YTHuz Credits Recharge'): string {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: 'YTHuz Huzaifa',
    am: amountINR.toFixed(2),
    cu: 'INR',
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}

/**
 * Generates QR Code image URL via Google Chart API
 */
export function generateQrCodeUrl(upiUrl: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;
}
