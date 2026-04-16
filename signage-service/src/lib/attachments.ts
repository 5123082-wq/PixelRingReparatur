import 'server-only';

import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { put, del } from '@vercel/blob';

import { AttachmentKind, AttachmentStorageProvider } from '@prisma/client';

export type StoredAttachmentInput = {
  kind: AttachmentKind;
  storageProvider: AttachmentStorageProvider;
  storageKey: string;
  originalFilename: string | null;
  mimeType: string;
  byteSize: number;
  checksumSha256: string;
};

export class AttachmentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AttachmentValidationError';
  }
}

const DEFAULT_MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // 20 MB
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
]);
const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/quicktime',
  'video/webm',
]);
const ALLOWED_TYPES = new Set([...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]);

function getMaxUploadBytes(): number {
  const configured = Number(process.env.ATTACHMENT_MAX_UPLOAD_BYTES);

  return Number.isFinite(configured) && configured > 0
    ? configured
    : DEFAULT_MAX_UPLOAD_BYTES;
}

function getStorageRoot(): string {
  return process.env.ATTACHMENT_STORAGE_DIR
    ? path.resolve(process.env.ATTACHMENT_STORAGE_DIR)
    : path.join(process.cwd(), '.data', 'uploads');
}

function sanitizeFilename(filename: string): string {
  const sanitized = filename
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);

  return sanitized || 'upload';
}

function getAttachmentKind(mimeType: string): AttachmentKind {
  if (mimeType.startsWith('image/')) return AttachmentKind.IMAGE;
  if (mimeType.startsWith('video/')) return AttachmentKind.VIDEO;
  if (mimeType.startsWith('audio/')) return AttachmentKind.AUDIO;
  if (mimeType === 'application/pdf') return AttachmentKind.DOCUMENT;

  return AttachmentKind.OTHER;
}

function assertSafeStorageKey(storageKey: string): string[] {
  const parts = storageKey.split('/').filter(Boolean);

  if (
    parts.length === 0 ||
    storageKey.includes('\0') ||
    storageKey.startsWith('/') ||
    parts.some((part) => part === '.' || part === '..')
  ) {
    throw new Error('Invalid attachment storage key.');
  }

  return parts;
}

export function getLocalAttachmentPath(storageKey: string): string {
  const root = path.resolve(getStorageRoot());
  const parts = assertSafeStorageKey(storageKey);
  const absolutePath = path.resolve(root, ...parts);

  if (absolutePath !== root && !absolutePath.startsWith(`${root}${path.sep}`)) {
    throw new Error('Invalid attachment storage path.');
  }

  return absolutePath;
}

export async function storeAttachment(file: File): Promise<StoredAttachmentInput> {
  if (file.size <= 0) {
    throw new AttachmentValidationError('Attachment file is empty.');
  }

  const maxUploadBytes = getMaxUploadBytes();

  if (file.size > maxUploadBytes) {
    throw new AttachmentValidationError(
      `Attachment is too large. Maximum size is ${Math.floor(maxUploadBytes / 1024 / 1024)} MB.`
    );
  }

  const mimeType = file.type || 'application/octet-stream';

  if (!ALLOWED_TYPES.has(mimeType)) {
    throw new AttachmentValidationError('Please upload an image or video file.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const checksumSha256 = crypto.createHash('sha256').update(buffer).digest('hex');
  const originalFilename = file.name ? sanitizeFilename(file.name) : null;
  const storageKey = path.posix.join(
    'attachments',
    'website-form',
    new Date().toISOString().slice(0, 10),
    `${crypto.randomUUID()}-${originalFilename ?? 'upload'}`
  );
  const absolutePath = getLocalAttachmentPath(storageKey);
  const kind = getAttachmentKind(mimeType);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { url } = await put(storageKey, buffer, {
      access: 'private',
      contentType: mimeType,
    });
    
    return {
      kind,
      storageProvider: AttachmentStorageProvider.VERCEL_BLOB,
      storageKey: url, // Store the public URL directly
      originalFilename,
      mimeType,
      byteSize: buffer.byteLength,
      checksumSha256,
    };
  }

  // Fallback to local storage
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, buffer, { flag: 'wx' });

  return {
    kind,
    storageProvider: AttachmentStorageProvider.LOCAL,
    storageKey,
    originalFilename,
    mimeType,
    byteSize: buffer.byteLength,
    checksumSha256,
  };
}

export async function readLocalAttachment(storageKey: string): Promise<Buffer> {
  return fs.readFile(getLocalAttachmentPath(storageKey));
}

export async function deleteAttachment(attachment: StoredAttachmentInput): Promise<void> {
  if (attachment.storageProvider === AttachmentStorageProvider.VERCEL_BLOB) {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      await del(attachment.storageKey);
    }
    return;
  }
  
  await deleteLocalAttachment(attachment.storageKey);
}

export async function deleteLocalAttachment(storageKey: string): Promise<void> {
  try {
    await fs.unlink(getLocalAttachmentPath(storageKey));
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return;
    }

    throw error;
  }
}
