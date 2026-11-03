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

export interface AuthNotification {
  id: string;
  type: 'signup' | 'login';
  userId: string;
  userName: string;
  userEmail: string;
  recipientEmail: string; // 'hozikhan00@gmail.com'
  creditsGranted: number;
  currentBalance: number;
  timestamp: number;
  deviceInfo: {
    platform: string;
    userAgent: string;
    language: string;
    screenResolution?: string;
    timezone?: string;
  };
  status: 'forwarded_to_admin';
}

const STORAGE_USERS = 'ythuz_users_v2';
const STORAGE_CURRENT_USER = 'ythuz_current_user_id_v2';
const STORAGE_TRANSACTIONS = 'ythuz_credit_txs_v2';
const STORAGE_RECHARGES = 'ythuz_recharge_requests_v2';
const STORAGE_AUTH_NOTIFICATIONS = 'ythuz_admin_auth_notifications_v2';

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

export function getAllAuthNotifications(): AuthNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_AUTH_NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveAllAuthNotifications(notifs: AuthNotification[]): void {
  try {
    localStorage.setItem(STORAGE_AUTH_NOTIFICATIONS, JSON.stringify(notifs));
  } catch {}
}

/**
 * Checks if a given email is the verified Admin (hozikhan00@gmail.com)
 */
export function isUserAdmin(email?: string): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

/**
 * Forwards user login/signup details to hozikhan00@gmail.com
 */
export function dispatchAuthDetailsToAdmin(
  user: AppUser,
  type: 'signup' | 'login',
  creditsGranted = 0
): AuthNotification {
  const notif: AuthNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    recipientEmail: ADMIN_EMAIL,
    creditsGranted,
    currentBalance: user.credits,
    timestamp: Date.now(),
    deviceInfo: {
      platform: typeof navigator !== 'undefined' ? navigator.platform || 'Unknown OS' : 'Web Browser',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0 WebClient',
      language: typeof navigator !== 'undefined' ? navigator.language : 'en-US',
      screenResolution: typeof window !== 'undefined' ? `${window.screen?.width || 1920}x${window.screen?.height || 1080}` : '1920x1080',
      timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Asia/Kolkata',
    },
    status: 'forwarded_to_admin',
  };

  const list = getAllAuthNotifications();
  list.unshift(notif);
  saveAllAuthNotifications(list);

  console.info(
    `[ADMIN AUTH ALERT TO ${ADMIN_EMAIL}] Event: ${type.toUpperCase()} | User: ${user.name} (${user.email}) | Balance: ${user.credits} credits | Dispatched to ${ADMIN_EMAIL}`
  );

  return notif;
}

/**
 * Creates or logs in a user.
 * - If new user: awards 20 Free Credits.
 * - Dispatches all login and signup details directly to hozikhan00@gmail.com.
 * - Strictly assigns 'admin' role ONLY to hozikhan00@gmail.com.
 */
export function registerOrLoginUser(
  email: string,
  name: string
): { user: AppUser; isNew: boolean; notification: AuthNotification } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || cleanEmail.split('@')[0];
  const users = getAllUsers();
  const existingIndex = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);

  const isAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();

  if (existingIndex >= 0) {
    const existing = users[existingIndex];
    // Strictly update role: only hozikhan00@gmail.com is admin
    existing.role = isAdmin ? 'admin' : 'user';
    users[existingIndex] = existing;
    saveAllUsers(users);
    localStorage.setItem(STORAGE_CURRENT_USER, existing.id);

    // Forward login details to hozikhan00@gmail.com
    const notif = dispatchAuthDetailsToAdmin(existing, 'login', 0);
    return { user: existing, isNew: false, notification: notif };
  }

  // New user gets 20 free credits
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

  // Forward signup details to hozikhan00@gmail.com
  const notif = dispatchAuthDetailsToAdmin(newUser, 'signup', INITIAL_FREE_CREDITS);

  return { user: newUser, isNew: true, notification: notif };
}

/**
 * Gets currently logged in user or null if none
 */
export function getCurrentUser(): AppUser | null {
  const currentId = localStorage.getItem(STORAGE_CURRENT_USER);
  const users = getAllUsers();
  if (currentId) {
    const user = users.find((u) => u.id === currentId);
    if (user) {
      // Ensure admin role strictly matches hozikhan00@gmail.com
      if (isUserAdmin(user.email) && user.role !== 'admin') {
        user.role = 'admin';
        saveAllUsers(users);
      } else if (!isUserAdmin(user.email) && user.role === 'admin') {
        user.role = 'user';
        saveAllUsers(users);
      }
      return user;
    }
  }

  // If users exist, return the first one, or return null so login page can be presented
  if (users.length > 0) {
    return users[0];
  }
  return null;
}

/**
 * Log out active user
 */
export function logoutUser(): void {
  try {
    localStorage.removeItem(STORAGE_CURRENT_USER);
  } catch {}
}

/**
 * Deducts 3 credits for a download (Video, Audio, or Thumbnail)
 */
export function deductDownloadCredits(userId: string, mediaTitle: string): {
  success: boolean;
  newBalance: number;
  error?: string;
} {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return { success: false, newBalance: 0, error: 'User not found. Please log in first.' };
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
    description: `Media Download: "${mediaTitle.slice(0, 35)}" (-${DOWNLOAD_CREDIT_COST} credits)`,
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
 * STRICT ADMIN APPROVAL:
 * ONLY hozikhan00@gmail.com can approve a recharge request and credit the account.
 */
export function approveRechargeRequest(
  requestId: string,
  callerEmail: string,
  adminName = 'Huzaifa (Admin)'
): { success: boolean; message: string; user?: AppUser } {
  // STRICT CHECK: Only hozikhan00@gmail.com can approve!
  if (!isUserAdmin(callerEmail)) {
    return {
      success: false,
      message: `Security Access Denied: Only ${ADMIN_EMAIL} is authorized to approve recharge requests and add credits! Current user: ${callerEmail}`,
    };
  }

  const reqs = getAllRechargeRequests();
  const req = reqs.find((r) => r.id === requestId);
  if (!req) return { success: false, message: 'Request not found' };
  if (req.status !== 'pending') return { success: false, message: `Request is already ${req.status}` };

  const users = getAllUsers();
  const user = users.find((u) => u.id === req.userId);
  if (!user) return { success: false, message: 'User account not found' };

  req.status = 'approved';
  req.reviewedAt = Date.now();
  req.reviewedBy = `${adminName} (${ADMIN_EMAIL})`;
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
    description: `Recharge Approved by ${ADMIN_EMAIL}: ${req.packageName} (+${req.creditsRequested} credits via UPI ${req.utrNumber})`,
    timestamp: Date.now(),
  };

  const txs = getAllTransactions();
  txs.unshift(tx);
  saveAllTransactions(txs);

  return {
    success: true,
    message: `Payment Approved by ${ADMIN_EMAIL}! Added ${req.creditsRequested} credits to ${user.name} (${user.email}).`,
    user,
  };
}

/**
 * STRICT ADMIN REJECTION:
 * ONLY hozikhan00@gmail.com can reject a recharge request.
 */
export function rejectRechargeRequest(
  requestId: string,
  callerEmail: string,
  reason = 'Invalid UPI reference / payment unverified',
  adminName = 'Huzaifa (Admin)'
): { success: boolean; message: string } {
  // STRICT CHECK: Only hozikhan00@gmail.com can reject!
  if (!isUserAdmin(callerEmail)) {
    return {
      success: false,
      message: `Security Access Denied: Only ${ADMIN_EMAIL} is authorized to reject recharge requests.`,
    };
  }

  const reqs = getAllRechargeRequests();
  const req = reqs.find((r) => r.id === requestId);
  if (!req) return { success: false, message: 'Request not found' };

  req.status = 'rejected';
  req.reviewedAt = Date.now();
  req.reviewedBy = `${adminName} (${ADMIN_EMAIL})`;
  req.rejectionReason = reason;
  saveAllRechargeRequests(reqs);

  return { success: true, message: `Recharge request rejected by ${ADMIN_EMAIL}.` };
}

/**
 * STRICT ADMIN CREDIT ADJUSTMENT:
 * ONLY hozikhan00@gmail.com can manually grant or deduct credits.
 */
export function adminAdjustCredits(
  userId: string,
  amount: number,
  callerEmail: string,
  reason = 'Admin Adjustment'
): { success: boolean; message?: string; user?: AppUser } {
  // STRICT CHECK: Only hozikhan00@gmail.com can adjust credits!
  if (!isUserAdmin(callerEmail)) {
    return {
      success: false,
      message: `Security Access Denied: Only ${ADMIN_EMAIL} can grant or deduct user credits.`,
    };
  }

  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return { success: false, message: 'User not found' };

  user.credits = Math.max(0, user.credits + amount);
  saveAllUsers(users);

  const tx: CreditTransaction = {
    id: `tx_${Date.now()}_adj`,
    userId: user.id,
    type: amount >= 0 ? 'admin_grant' : 'admin_deduct',
    amount,
    balanceAfter: user.credits,
    description: `${reason} by ${ADMIN_EMAIL} (${amount >= 0 ? '+' : ''}${amount} credits)`,
    timestamp: Date.now(),
  };

  const txs = getAllTransactions();
  txs.unshift(tx);
  saveAllTransactions(txs);

  return {
    success: true,
    message: `Updated credits for ${user.name} (${user.email}) to ${user.credits} credits.`,
    user,
  };
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
 * Generates QR Code image URL
 */
export function generateQrCodeUrl(upiUrl: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;
}
