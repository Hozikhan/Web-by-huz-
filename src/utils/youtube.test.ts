import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractYouTubeId,
  isValidYouTubeUrl,
  formatDuration,
  formatNumber,
  calculateEstimatedSize,
  getThumbnailOptions,
} from './youtube';

test('extractYouTubeId extracts IDs from various YouTube URL formats', () => {
  // Standard watch URL
  assert.equal(
    extractYouTubeId('https://www.youtube.com/watch?v=aqz-KE-bpKQ'),
    'aqz-KE-bpKQ'
  );

  // Shortened URL
  assert.equal(
    extractYouTubeId('https://youtu.be/aqz-KE-bpKQ'),
    'aqz-KE-bpKQ'
  );

  // Embed URL
  assert.equal(
    extractYouTubeId('https://www.youtube.com/embed/aqz-KE-bpKQ'),
    'aqz-KE-bpKQ'
  );

  // Shorts URL
  assert.equal(
    extractYouTubeId('https://www.youtube.com/shorts/aqz-KE-bpKQ'),
    'aqz-KE-bpKQ'
  );

  // URL with extra query parameters
  assert.equal(
    extractYouTubeId('https://www.youtube.com/watch?v=aqz-KE-bpKQ&t=42s&feature=share'),
    'aqz-KE-bpKQ'
  );

  // Raw 11-char ID
  assert.equal(
    extractYouTubeId('aqz-KE-bpKQ'),
    'aqz-KE-bpKQ'
  );

  // Invalid strings
  assert.equal(extractYouTubeId('https://vimeo.com/1234567'), null);
  assert.equal(extractYouTubeId('not-a-valid-url'), null);
  assert.equal(extractYouTubeId(''), null);
});

test('isValidYouTubeUrl validates properly', () => {
  assert.equal(isValidYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), true);
  assert.equal(isValidYouTubeUrl('https://youtu.be/dQw4w9WgXcQ'), true);
  assert.equal(isValidYouTubeUrl('invalid_string'), false);
});

test('formatDuration formats seconds into readable time', () => {
  assert.equal(formatDuration(0), '0:00');
  assert.equal(formatDuration(45), '0:45');
  assert.equal(formatDuration(65), '1:05');
  assert.equal(formatDuration(596), '9:56');
  assert.equal(formatDuration(3665), '1:01:05');
});

test('formatNumber formats counts into scannable metrics', () => {
  assert.equal(formatNumber(500), '500');
  assert.equal(formatNumber(1500), '1.5K');
  assert.equal(formatNumber(2400000), '2.4M');
  assert.equal(formatNumber(1200000000), '1.2B');
});

test('calculateEstimatedSize calculates realistic file sizes', () => {
  // 60 seconds audio
  const audio128 = calculateEstimatedSize(60, '128k', 'audio');
  const audio320 = calculateEstimatedSize(60, '320k', 'audio');
  assert.ok(audio320 > audio128, 'Higher bitrate audio should be larger');

  // 60 seconds video
  const video360 = calculateEstimatedSize(60, '360p', 'video');
  const video1080 = calculateEstimatedSize(60, '1080p', 'video');
  assert.ok(video1080 > video360, '1080p should be larger than 360p');
  assert.ok(video1080 > audio320, '1080p video should be larger than audio');
});

test('getThumbnailOptions provides valid options', () => {
  const options = getThumbnailOptions('aqz-KE-bpKQ');
  assert.equal(options.length, 5);
  assert.equal(options[0].quality, 'maxres');
  assert.equal(options[0].url, 'https://img.youtube.com/vi/aqz-KE-bpKQ/maxresdefault.jpg');
});
