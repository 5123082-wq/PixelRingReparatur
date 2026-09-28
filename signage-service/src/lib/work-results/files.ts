import 'server-only';
import sharp from 'sharp';
import { get } from '@vercel/blob';
import type { Attachment } from '@prisma/client';
import { readLocalAttachment } from '@/lib/attachments';
import { WorkResultError } from './types';

export const WORK_RESULT_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export function workResultMaxBytes() {
  const value = Number(process.env.ATTACHMENT_MAX_UPLOAD_BYTES);
  return Number.isFinite(value) && value > 0 ? value : 20 * 1024 * 1024;
}
export async function validateWorkResultImage(buffer: Buffer, mimeType: string) {
  if (!buffer.length || buffer.length > workResultMaxBytes()) throw new WorkResultError('file_size');
  if (!WORK_RESULT_MIME_TYPES.includes(mimeType)) throw new WorkResultError('file_type');
  try {
    const image = sharp(buffer, { limitInputPixels: 40_000_000, failOn: 'warning' });
    const metadata = await image.metadata();
    const expected = { 'image/jpeg': 'jpeg', 'image/png': 'png', 'image/webp': 'webp' }[mimeType];
    if (metadata.format !== expected || (metadata.pages ?? 1) !== 1) throw new Error('format');
    // Decode the pixels, not just the declared MIME type or file extension.
    await image.stats();
  } catch { throw new WorkResultError('file_type'); }
}
export async function readWorkResultFile(attachment: Pick<Attachment, 'storageProvider' | 'storageKey' | 'byteSize'>) {
  if (attachment.byteSize <= 0 || attachment.byteSize > workResultMaxBytes()) throw new WorkResultError('file_size');
  if (attachment.storageProvider === 'LOCAL') return readLocalAttachment(attachment.storageKey);
  if (attachment.storageProvider !== 'VERCEL_BLOB') throw new WorkResultError('file_missing', 404);
  const result = await get(attachment.storageKey, { access: 'private' });
  if (!result || result.statusCode !== 200) throw new WorkResultError('file_missing', 404);
  const reader = result.stream.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      length += chunk.value.byteLength;
      if (length > workResultMaxBytes()) throw new WorkResultError('file_size');
      chunks.push(chunk.value);
    }
  } finally { await reader.cancel().catch(() => undefined); }
  return Buffer.concat(chunks);
}
