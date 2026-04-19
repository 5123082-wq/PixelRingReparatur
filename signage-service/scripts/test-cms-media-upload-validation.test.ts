import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  CMS_MEDIA_MAX_UPLOAD_BYTES,
  CmsMediaValidationError,
  validateCmsMediaUploadFile,
} from '../src/lib/cms/media.ts';

const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+XgncAAAAASUVORK5CYII=',
  'base64'
);

function createPngWithDimensions(width: number, height: number): Buffer {
  const buffer = Buffer.alloc(24);
  buffer.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  buffer.writeUInt32BE(13, 8);
  buffer.write('IHDR', 12, 'ascii');
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  return buffer;
}

test('validateCmsMediaUploadFile accepts valid PNG payload', async () => {
  const file = new File([ONE_PIXEL_PNG], 'pixel.png', { type: 'image/png' });

  const validated = await validateCmsMediaUploadFile({ file });

  assert.equal(validated.mimeType, 'image/png');
  assert.equal(validated.byteSize, ONE_PIXEL_PNG.byteLength);
  assert.equal(validated.originalFilename, 'pixel.png');
});

test('validateCmsMediaUploadFile rejects oversized payload', async () => {
  const oversized = Buffer.alloc(CMS_MEDIA_MAX_UPLOAD_BYTES + 1, 0);
  const file = new File([oversized], 'too-large.png', { type: 'image/png' });

  await assert.rejects(
    validateCmsMediaUploadFile({ file }),
    (error: unknown) =>
      error instanceof CmsMediaValidationError &&
      error.message.startsWith('Media size exceeds allowed limit')
  );
});

test('validateCmsMediaUploadFile rejects unsupported MIME type', async () => {
  const file = new File([ONE_PIXEL_PNG], 'pixel.txt', { type: 'text/plain' });

  await assert.rejects(
    validateCmsMediaUploadFile({ file }),
    (error: unknown) =>
      error instanceof CmsMediaValidationError &&
      error.message.startsWith('Unsupported media MIME type')
  );
});

test('validateCmsMediaUploadFile rejects invalid checksum format', async () => {
  const file = new File([ONE_PIXEL_PNG], 'pixel.png', { type: 'image/png' });

  await assert.rejects(
    validateCmsMediaUploadFile({ file, checksumSha256: 'not-a-checksum' }),
    (error: unknown) =>
      error instanceof CmsMediaValidationError && error.message === 'Invalid checksum format'
  );
});

test('validateCmsMediaUploadFile rejects extreme image dimensions', async () => {
  const hugePng = createPngWithDimensions(20_000, 20_000);
  const file = new File([hugePng], 'huge.png', { type: 'image/png' });

  await assert.rejects(
    validateCmsMediaUploadFile({ file }),
    (error: unknown) =>
      error instanceof CmsMediaValidationError &&
      error.message === 'Media dimensions exceed allowed limit'
  );
});
