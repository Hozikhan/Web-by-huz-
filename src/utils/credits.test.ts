import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_FREE_CREDITS,
  DOWNLOAD_CREDIT_COST,
  UPI_ID,
  ADMIN_EMAIL,
  CREDIT_PACKAGES,
  generateUpiUrl,
  generateQrCodeUrl,
  isUserAdmin,
  approveRechargeRequest,
  rejectRechargeRequest,
  adminAdjustCredits,
  dispatchAuthDetailsToAdmin,
} from './credits';

test('constants match exact user requirements', () => {
  assert.equal(INITIAL_FREE_CREDITS, 20, 'New users must receive 20 free credits on registration');
  assert.equal(DOWNLOAD_CREDIT_COST, 3, 'Each download (video/audio/thumbnail) must cost exactly 3 credits');
  assert.equal(UPI_ID, '6201927841@ybl', 'UPI payee must be 6201927841@ybl');
  assert.equal(ADMIN_EMAIL, 'hozikhan00@gmail.com', 'Admin email must be hozikhan00@gmail.com');
});

test('admin authorization is strictly restricted to hozikhan00@gmail.com', () => {
  assert.equal(isUserAdmin('hozikhan00@gmail.com'), true);
  assert.equal(isUserAdmin('HOZIKHAN00@GMAIL.COM'), true, 'Case insensitive check');
  assert.equal(isUserAdmin('admin@ythuz.app'), false, 'Other admin aliases must be denied');
  assert.equal(isUserAdmin('user@example.com'), false);
  assert.equal(isUserAdmin(''), false);
});

test('credit packages are correctly configured', () => {
  assert.ok(CREDIT_PACKAGES.length >= 3, 'At least 3 packages should be offered');
  const starter = CREDIT_PACKAGES.find((p) => p.id === 'pack_starter');
  assert.ok(starter, 'Starter pack exists');
  assert.equal(starter?.credits, 50);
  assert.equal(starter?.amountINR, 49);

  const creator = CREDIT_PACKAGES.find((p) => p.id === 'pack_creator');
  assert.ok(creator, 'Creator pack exists');
  assert.equal(creator?.credits, 150);
  assert.equal(creator?.amountINR, 99);
});

test('generateUpiUrl generates correct UPI payment link', () => {
  const url = generateUpiUrl(99, 'Recharge 150 credits');
  assert.ok(url.startsWith('upi://pay?'), 'Must start with upi://pay?');
  assert.ok(url.includes('pa=6201927841%40ybl') || url.includes('pa=6201927841@ybl'), 'Must include correct UPI ID');
  assert.ok(url.includes('am=99.00'), 'Must include amount in INR');
  assert.ok(url.includes('cu=INR'), 'Must have INR currency');
});

test('generateQrCodeUrl returns QR code API URL', () => {
  const upi = generateUpiUrl(49);
  const qr = generateQrCodeUrl(upi);
  assert.ok(qr.includes('api.qrserver.com'), 'Uses standard QR generator');
  assert.ok(qr.includes(encodeURIComponent(upi)), 'Contains encoded UPI payload');
});

test('credit math: 20 free credits allows 6 downloads (video, audio or thumbnail) of 3 credits each', () => {
  let credits = INITIAL_FREE_CREDITS;
  let successfulDownloads = 0;

  while (credits >= DOWNLOAD_CREDIT_COST) {
    credits -= DOWNLOAD_CREDIT_COST;
    successfulDownloads++;
  }

  assert.equal(successfulDownloads, 6, '20 credits allows 6 full downloads (18 credits spent, 2 remaining)');
  assert.equal(credits, 2, '2 credits remaining after 6 downloads');
  assert.ok(credits < DOWNLOAD_CREDIT_COST, 'Cannot download again without recharge');
});

test('non-admin user cannot approve recharge requests', () => {
  const result = approveRechargeRequest('dummy_req', 'attacker@fake.com');
  assert.equal(result.success, false);
  assert.ok(result.message.includes('Security Access Denied'));
  assert.ok(result.message.includes(ADMIN_EMAIL));
});

test('non-admin user cannot reject recharge requests', () => {
  const result = rejectRechargeRequest('dummy_req', 'attacker@fake.com', 'reason');
  assert.equal(result.success, false);
  assert.ok(result.message.includes('Security Access Denied'));
});

test('non-admin user cannot adjust credits', () => {
  const result = adminAdjustCredits('dummy_user', 50, 'attacker@fake.com');
  assert.equal(result.success, false);
  assert.ok(result.message?.includes('Security Access Denied'));
});

test('auth notifications are properly dispatched with recipient hozikhan00@gmail.com', () => {
  const testUser = {
    id: 'user_test_123',
    email: 'newuser@example.com',
    name: 'New User Test',
    credits: 20,
    role: 'user' as const,
    createdAt: Date.now(),
  };

  const notif = dispatchAuthDetailsToAdmin(testUser, 'signup', 20);
  assert.equal(notif.recipientEmail, 'hozikhan00@gmail.com');
  assert.equal(notif.userEmail, 'newuser@example.com');
  assert.equal(notif.userName, 'New User Test');
  assert.equal(notif.creditsGranted, 20);
  assert.equal(notif.status, 'forwarded_to_admin');
  assert.ok(notif.deviceInfo.platform, 'Includes device info');
});
