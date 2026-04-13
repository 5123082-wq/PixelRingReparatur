import 'server-only';

import crypto from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type {
  CmsMediaStorageProvider,
  CmsMediaUsageType,
  Prisma,
  PrismaClient,
} from '@prisma/client';

export const CMS_MEDIA_USAGE_TYPES = [
  'GENERAL',
  'HERO',
  'ARTICLE',
  'SERVICE',
  'CASE',
  'PAGE',
  'CARD',
  'SEO',
  'ICON',
] as const;

export const SUPPORTED_CMS_MEDIA_LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'] as const;

export const ALLOWED_CMS_MEDIA_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
] as const;

export const CMS_MEDIA_MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const CMS_MEDIA_PUBLIC_DIRECTORY = path.join(process.cwd(), 'public', 'uploads', 'cms-media');
const CMS_MEDIA_PUBLIC_URL_PREFIX = '/uploads/cms-media';

const MAX_OPTIONAL_TEXT_LENGTH = 300;
const MAX_METADATA_JSON_LENGTH = 8_000;

const FILE_EXTENSION_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

type DbClient = PrismaClient | Prisma.TransactionClient;

type CmsMediaRecord = {
  id: string;
  locale: string;
  usageType: CmsMediaUsageType;
  storageProvider: CmsMediaStorageProvider;
  storageKey: string;
  publicUrl: string;
  originalFilename: string | null;
  title: string | null;
  altText: string | null;
  mimeType: string;
  byteSize: number;
  checksumSha256: string;
  width: number | null;
  height: number | null;
  meta: Prisma.JsonValue | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export class CmsMediaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CmsMediaValidationError';
  }
}

export type CmsMediaUsageReference = {
  resourceType: 'CMS_PAGE' | 'CMS_ARTICLE';
  resourceId: string;
  label: string;
  field: string;
};

export type CmsMediaResponse = {
  id: string;
  locale: string;
  usageType: CmsMediaUsageType;
  storageProvider: CmsMediaStorageProvider;
  storageKey: string;
  publicUrl: string;
  originalFilename: string | null;
  title: string | null;
  altText: string | null;
  mimeType: string;
  byteSize: number;
  checksumSha256: string;
  width: number | null;
  height: number | null;
  meta: Prisma.JsonValue | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function normalizeOptionalText(value: unknown, maxLength = MAX_OPTIONAL_TEXT_LENGTH): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  if (normalized.length > maxLength) {
    return null;
  }

  return normalized;
}

export function normalizeCmsMediaUsageType(
  value: unknown,
  fallback: CmsMediaUsageType = 'GENERAL'
): CmsMediaUsageType | null {
  if (value === undefined || value === '') {
    return fallback;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toUpperCase();

  return CMS_MEDIA_USAGE_TYPES.includes(normalized as (typeof CMS_MEDIA_USAGE_TYPES)[number])
    ? (normalized as CmsMediaUsageType)
    : null;
}

export function normalizeCmsMediaLocale(value: unknown, fallback = 'de'): string | null {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  return SUPPORTED_CMS_MEDIA_LOCALES.includes(
    normalized as (typeof SUPPORTED_CMS_MEDIA_LOCALES)[number]
  )
    ? normalized
    : null;
}

export function normalizeCmsMediaTitle(value: unknown): string | null {
  return normalizeOptionalText(value);
}

export function normalizeCmsMediaAltText(value: unknown): string | null {
  return normalizeOptionalText(value);
}

export function normalizeCmsMediaDimensions(
  width: unknown,
  height: unknown
): { width: number | null; height: number | null } | null {
  const normalizeInteger = (raw: unknown): number | null => {
    if (raw === undefined || raw === null || raw === '') {
      return null;
    }

    const parsed = typeof raw === 'number' ? raw : Number(raw);

    if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 20_000) {
      return null;
    }

    return parsed;
  };

  const normalizedWidth = normalizeInteger(width);
  const normalizedHeight = normalizeInteger(height);

  if (
    (width !== undefined && width !== null && width !== '' && normalizedWidth === null) ||
    (height !== undefined && height !== null && height !== '' && normalizedHeight === null)
  ) {
    return null;
  }

  return {
    width: normalizedWidth,
    height: normalizedHeight,
  };
}

export function normalizeCmsMediaMetadata(value: unknown): Prisma.InputJsonValue | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  let parsed: unknown = value;

  if (typeof value === 'string') {
    if (value.length > MAX_METADATA_JSON_LENGTH) {
      return null;
    }

    try {
      parsed = JSON.parse(value);
    } catch {
      return null;
    }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return null;
  }

  try {
    const serialized = JSON.stringify(parsed);
    if (serialized.length > MAX_METADATA_JSON_LENGTH) {
      return null;
    }
  } catch {
    return null;
  }

  return parsed as Prisma.InputJsonValue;
}

export function normalizeCmsMediaMeta(value: unknown): Prisma.InputJsonValue | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  return normalizeCmsMediaMetadata(value);
}

export function normalizeCmsMediaText(
  value: unknown,
  options: { maxLength?: number; fallback?: string | null } = {}
): string | null {
  if (value === undefined || value === null || value === '') {
    return options.fallback ?? null;
  }

  return normalizeOptionalText(value, options.maxLength);
}

export function normalizeCmsMediaMimeType(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  return ALLOWED_CMS_MEDIA_MIME_TYPES.includes(
    normalized as (typeof ALLOWED_CMS_MEDIA_MIME_TYPES)[number]
  )
    ? normalized
    : null;
}

export function normalizeCmsMediaStorageProvider(
  value: unknown,
  fallback: CmsMediaStorageProvider = 'EXTERNAL'
): CmsMediaStorageProvider | null {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toUpperCase();

  return ['LOCAL', 'VERCEL_BLOB', 'S3', 'EXTERNAL'].includes(normalized)
    ? (normalized as CmsMediaStorageProvider)
    : null;
}

export function normalizeCmsMediaChecksum(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  return /^[a-f0-9]{64}$/.test(normalized) ? normalized : null;
}

export function normalizeCmsMediaUrl(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();

  if (!normalized || normalized.length > 2_048 || normalized.startsWith('//')) {
    return null;
  }

  if (normalized.startsWith('/')) {
    return normalized.includes('\0') || normalized.includes('..') ? null : normalized;
  }

  try {
    const url = new URL(normalized);
    return url.protocol === 'https:' || url.protocol === 'http:' ? normalized : null;
  } catch {
    return null;
  }
}

export function parseCmsMediaPositiveInteger(
  value: unknown,
  options: { required?: boolean; max?: number } = {}
): number | null | undefined {
  if (value === undefined || value === null || value === '') {
    return options.required ? null : undefined;
  }

  const parsed = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  const integer = Math.trunc(parsed);

  if (integer < 0 || (options.max !== undefined && integer > options.max)) {
    return null;
  }

  return integer;
}

export function normalizeCmsMediaSearch(value: unknown): string | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();

  if (!normalized || normalized.length > 200) {
    return null;
  }

  return normalized;
}

export function sanitizeCmsMediaFilename(value: string): string {
  const filename = path.basename(value || 'file').replace(/\s+/g, '-');
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '');

  return sanitized || 'file';
}

function startsWithBytes(buffer: Buffer, bytes: number[]): boolean {
  if (buffer.length < bytes.length) {
    return false;
  }

  return bytes.every((value, index) => buffer[index] === value);
}

function detectImageMimeBySignature(buffer: Buffer): string | null {
  if (startsWithBytes(buffer, [0x89, 0x50, 0x4e, 0x47])) {
    return 'image/png';
  }

  if (startsWithBytes(buffer, [0xff, 0xd8, 0xff])) {
    return 'image/jpeg';
  }

  if (startsWithBytes(buffer, [0x47, 0x49, 0x46, 0x38])) {
    return 'image/gif';
  }

  if (
    startsWithBytes(buffer, [0x52, 0x49, 0x46, 0x46]) &&
    buffer.length >= 12 &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp';
  }

  return null;
}

function detectImageDimensions(
  buffer: Buffer,
  mimeType: string
): { width: number; height: number } | null {
  if (mimeType === 'image/png' && buffer.length >= 24) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  if (mimeType === 'image/gif' && buffer.length >= 10) {
    return {
      width: buffer.readUInt16LE(6),
      height: buffer.readUInt16LE(8),
    };
  }

  if (mimeType === 'image/jpeg') {
    let offset = 2;

    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }

      const marker = buffer[offset + 1];
      const hasSegmentLength = marker !== 0xd8 && marker !== 0xd9;

      if (!hasSegmentLength) {
        offset += 2;
        continue;
      }

      const length = buffer.readUInt16BE(offset + 2);
      if (length < 2 || offset + 2 + length > buffer.length) {
        break;
      }

      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
      }

      offset += 2 + length;
    }
  }

  if (mimeType === 'image/webp' && buffer.length >= 30) {
    const chunkType = buffer.subarray(12, 16).toString('ascii');

    if (chunkType === 'VP8X') {
      const widthMinusOne = buffer.readUIntLE(24, 3);
      const heightMinusOne = buffer.readUIntLE(27, 3);

      return {
        width: widthMinusOne + 1,
        height: heightMinusOne + 1,
      };
    }
  }

  if (mimeType === 'image/svg+xml') {
    const source = buffer.subarray(0, Math.min(buffer.length, 4_096)).toString('utf8');

    if (!source.toLowerCase().includes('<svg')) {
      return null;
    }

    const widthMatch = source.match(/\bwidth=["']\s*(\d+(?:\.\d+)?)\s*(?:px)?\s*["']/i);
    const heightMatch = source.match(/\bheight=["']\s*(\d+(?:\.\d+)?)\s*(?:px)?\s*["']/i);

    if (!widthMatch || !heightMatch) {
      return null;
    }

    const width = Math.round(Number(widthMatch[1]));
    const height = Math.round(Number(heightMatch[1]));

    if (Number.isInteger(width) && Number.isInteger(height) && width > 0 && height > 0) {
      return { width, height };
    }
  }

  return null;
}

export async function validateCmsMediaUploadFile(input: {
  file: File;
  checksumSha256?: string | null;
}): Promise<{
  buffer: Buffer;
  mimeType: string;
  byteSize: number;
  checksumSha256: string;
  width: number | null;
  height: number | null;
  extension: string;
  originalFilename: string;
}> {
  const { file } = input;

  if (!(file instanceof File)) {
    throw new CmsMediaValidationError('Invalid media payload');
  }

  if (file.size <= 0 || file.size > CMS_MEDIA_MAX_UPLOAD_BYTES) {
    throw new CmsMediaValidationError('Media size exceeds allowed limit');
  }

  const mimeType = file.type?.trim().toLowerCase();

  if (
    !mimeType ||
    !ALLOWED_CMS_MEDIA_MIME_TYPES.includes(
      mimeType as (typeof ALLOWED_CMS_MEDIA_MIME_TYPES)[number]
    )
  ) {
    throw new CmsMediaValidationError('Unsupported media MIME type');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const detectedMime = detectImageMimeBySignature(buffer);

  if (!detectedMime || detectedMime !== mimeType) {
    throw new CmsMediaValidationError('MIME does not match file signature');
  }

  const checksumSha256 = crypto.createHash('sha256').update(buffer).digest('hex');
  const providedChecksum = input.checksumSha256?.trim().toLowerCase() || null;

  if (providedChecksum && providedChecksum !== checksumSha256) {
    throw new CmsMediaValidationError('Checksum mismatch');
  }

  const dimensions = detectImageDimensions(buffer, mimeType);
  const extension = FILE_EXTENSION_BY_MIME[mimeType] ?? 'bin';

  return {
    buffer,
    mimeType,
    byteSize: buffer.byteLength,
    checksumSha256,
    width: dimensions?.width ?? null,
    height: dimensions?.height ?? null,
    extension,
    originalFilename: sanitizeCmsMediaFilename(file.name),
  };
}

async function ensureCmsMediaDirectory(): Promise<void> {
  await mkdir(CMS_MEDIA_PUBLIC_DIRECTORY, { recursive: true });
}

function baseNameWithoutExtension(filename: string): string {
  const ext = path.extname(filename);
  const raw = ext.length > 0 ? filename.slice(0, -ext.length) : filename;
  const sanitized = raw.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);

  return sanitized || 'media';
}

export async function saveCmsMediaToPublicStorage(input: {
  buffer: Buffer;
  filename: string;
  extension: string;
}): Promise<{ storageKey: string; publicUrl: string }> {
  await ensureCmsMediaDirectory();

  const baseName = baseNameWithoutExtension(input.filename);

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const suffix = crypto.randomBytes(6).toString('hex');
    const storageKey = `${Date.now()}-${suffix}-${baseName}.${input.extension}`;
    const filePath = path.join(CMS_MEDIA_PUBLIC_DIRECTORY, storageKey);

    try {
      await writeFile(filePath, input.buffer, { flag: 'wx' });

      return {
        storageKey,
        publicUrl: `${CMS_MEDIA_PUBLIC_URL_PREFIX}/${storageKey}`,
      };
    } catch {
      // retry with a new random suffix
    }
  }

  throw new CmsMediaValidationError('Failed to persist media file');
}

export async function storeLocalCmsMediaUpload(
  file: File,
  options: { checksumSha256?: string | null } = {}
): Promise<{
  storageProvider: CmsMediaStorageProvider;
  storageKey: string;
  publicUrl: string;
  originalFilename: string | null;
  mimeType: string;
  byteSize: number;
  checksumSha256: string;
  width: number | null;
  height: number | null;
}> {
  const validated = await validateCmsMediaUploadFile({
    file,
    checksumSha256: options.checksumSha256,
  });
  const stored = await saveCmsMediaToPublicStorage({
    buffer: validated.buffer,
    filename: validated.originalFilename,
    extension: validated.extension,
  });

  return {
    storageProvider: 'LOCAL',
    storageKey: stored.storageKey,
    publicUrl: stored.publicUrl,
    originalFilename: validated.originalFilename,
    mimeType: validated.mimeType,
    byteSize: validated.byteSize,
    checksumSha256: validated.checksumSha256,
    width: validated.width,
    height: validated.height,
  };
}

export async function cleanupLocalCmsMediaUpload(storageKey: string): Promise<void> {
  try {
    await unlink(path.join(CMS_MEDIA_PUBLIC_DIRECTORY, path.basename(storageKey)));
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return;
    }

    throw error;
  }
}

export function serializeCmsMedia(record: CmsMediaRecord): CmsMediaResponse {
  return {
    id: record.id,
    locale: record.locale,
    usageType: record.usageType,
    storageProvider: record.storageProvider,
    storageKey: record.storageKey,
    publicUrl: record.publicUrl,
    originalFilename: record.originalFilename,
    title: record.title,
    altText: record.altText,
    mimeType: record.mimeType,
    byteSize: record.byteSize,
    checksumSha256: record.checksumSha256,
    width: record.width,
    height: record.height,
    meta: record.meta,
    deletedAt: record.deletedAt ? record.deletedAt.toISOString() : null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function hasAnyNeedle(value: unknown, needles: string[]): boolean {
  if (!value) {
    return false;
  }

  const source = typeof value === 'string' ? value : JSON.stringify(value);

  return needles.some((needle) => source.includes(needle));
}

export async function findCmsMediaUsage(
  client: DbClient,
  media: { id: string; storageKey: string; publicUrl: string }
): Promise<CmsMediaUsageReference[]> {
  const needles = [media.id, media.storageKey, media.publicUrl].filter(Boolean);

  if (needles.length === 0) {
    return [];
  }

  const [pages, articles] = await Promise.all([
    client.cmsPage.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        pageKey: true,
        locale: true,
        blocks: true,
      },
    }),
    client.cmsArticle.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        locale: true,
        slug: true,
        content: true,
        shortAnswer: true,
      },
    }),
  ]);

  const usage: CmsMediaUsageReference[] = [];

  for (const page of pages) {
    if (hasAnyNeedle(page.blocks, needles)) {
      usage.push({
        resourceType: 'CMS_PAGE',
        resourceId: page.id,
        label: `${page.pageKey}:${page.locale}`,
        field: 'blocks',
      });
    }
  }

  for (const article of articles) {
    if (hasAnyNeedle(article.content, needles)) {
      usage.push({
        resourceType: 'CMS_ARTICLE',
        resourceId: article.id,
        label: `${article.locale}:${article.slug}`,
        field: 'content',
      });
      continue;
    }

    if (hasAnyNeedle(article.shortAnswer, needles)) {
      usage.push({
        resourceType: 'CMS_ARTICLE',
        resourceId: article.id,
        label: `${article.locale}:${article.slug}`,
        field: 'shortAnswer',
      });
    }
  }

  return usage;
}

export const findCmsMediaUsageReferences = findCmsMediaUsage;
