import 'server-only';

import { prisma } from '@/lib/prisma';

export const CMS_PAGE_KEYS = ['home', 'support', 'status', 'global'] as const;
export const CMS_PAGE_STATUSES = ['DRAFT', 'PUBLISHED'] as const;
export const SUPPORTED_CMS_LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'] as const;
export const CMS_PAGE_BLOCK_TYPES = [
  'hero',
  'cta',
  'textSection',
  'cardList',
  'faqList',
  'reviewList',
  'footerCta',
] as const;

const DEFAULT_LOCALE = 'de';
const MAX_BLOCKS = 80;
const MAX_BLOCK_DEPTH = 8;
const MAX_BLOCK_ITEMS = 200;
const MAX_BLOCK_KEY_LENGTH = 120;
const MAX_BLOCK_STRING_LENGTH = 8_000;
const MAX_BLOCKS_JSON_LENGTH = 120_000;
const MAX_TEXT_LENGTH = 50_000;
const MAX_TITLE_LENGTH = 180;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_URL_LENGTH = 2_048;

const DANGEROUS_JSON_KEYS = new Set([
  '__proto__',
  'constructor',
  'prototype',
  'dangerouslySetInnerHTML',
  'innerHTML',
  'outerHTML',
  '__html',
  'script',
]);

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type CmsPageKey = (typeof CMS_PAGE_KEYS)[number];
export type CmsPageStatus = (typeof CMS_PAGE_STATUSES)[number];
export type CmsPageBlockType = (typeof CMS_PAGE_BLOCK_TYPES)[number];

export type CmsPageBlock = {
  type: CmsPageBlockType;
  key: string;
  enabled?: boolean;
  sortOrder?: number;
  [key: string]: JsonValue | undefined;
};

export type CmsPageResponse = {
  id: string;
  pageKey: CmsPageKey;
  locale: string;
  status: CmsPageStatus;
  title: string;
  blocks: CmsPageBlock[];
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  publishedAt: string | null;
  lastReviewedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CmsPagePublicContent = {
  pageKey: CmsPageKey;
  locale: string;
  title: string;
  blocks: CmsPageBlock[];
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
};

export type StatusPageCmsContent = {
  badge?: string;
  title?: string;
  intro?: string;
  safeHints?: string[];
  restoreHint?: string;
};

type CmsPageRecord = {
  id: unknown;
  pageKey: unknown;
  locale: unknown;
  status: unknown;
  title: unknown;
  blocks: unknown;
  seoTitle: unknown;
  seoDescription: unknown;
  canonicalUrl: unknown;
  publishedAt: unknown;
  lastReviewedAt: unknown;
  deletedAt: unknown;
  createdAt: unknown;
  updatedAt: unknown;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(
    value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.getPrototypeOf(value) === Object.prototype
  );
}

function isUnsafeJsonKey(key: string): boolean {
  return DANGEROUS_JSON_KEYS.has(key) || /^on[A-Z]/.test(key);
}

function containsUnsafeMarkup(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value) || /javascript\s*:/i.test(value);
}

function normalizeJsonValue(value: unknown, depth = 0): JsonValue | undefined {
  if (depth > MAX_BLOCK_DEPTH) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'string') {
    if (value.length > MAX_BLOCK_STRING_LENGTH || containsUnsafeMarkup(value)) {
      return undefined;
    }

    return value;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (Array.isArray(value)) {
    if (value.length > MAX_BLOCK_ITEMS) {
      return undefined;
    }

    const normalizedItems: JsonValue[] = [];

    for (const item of value) {
      const normalized = normalizeJsonValue(item, depth + 1);
      if (normalized === undefined) {
        return undefined;
      }
      normalizedItems.push(normalized);
    }

    return normalizedItems;
  }

  if (isPlainObject(value)) {
    const normalizedObject: { [key: string]: JsonValue } = {};

    for (const [key, item] of Object.entries(value)) {
      if (!key || key.length > MAX_BLOCK_KEY_LENGTH || isUnsafeJsonKey(key)) {
        return undefined;
      }

      const normalized = normalizeJsonValue(item, depth + 1);
      if (normalized === undefined) {
        return undefined;
      }
      normalizedObject[key] = normalized;
    }

    return normalizedObject;
  }

  return undefined;
}

function hasKnownBlockType(value: unknown): value is CmsPageBlockType {
  return typeof value === 'string' && CMS_PAGE_BLOCK_TYPES.includes(value as CmsPageBlockType);
}

function hasValidBlockKey(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.trim().length <= MAX_BLOCK_KEY_LENGTH &&
    /^[a-zA-Z0-9._:-]+$/.test(value.trim())
  );
}

function normalizeBlock(value: unknown): CmsPageBlock | null {
  const normalizedValue = normalizeJsonValue(value);

  if (!isPlainObject(normalizedValue)) {
    return null;
  }

  const type = normalizedValue.type;
  const key = normalizedValue.key;

  if (!hasKnownBlockType(type) || !hasValidBlockKey(key)) {
    return null;
  }

  if (
    normalizedValue.enabled !== undefined &&
    typeof normalizedValue.enabled !== 'boolean'
  ) {
    return null;
  }

  if (normalizedValue.sortOrder !== undefined) {
    if (
      typeof normalizedValue.sortOrder !== 'number' ||
      !Number.isInteger(normalizedValue.sortOrder)
    ) {
      return null;
    }
  }

  return {
    ...normalizedValue,
    type,
    key: key.trim(),
  } as CmsPageBlock;
}

export function normalizeCmsPageBlocks(value: unknown): CmsPageBlock[] | null {
  if (!Array.isArray(value) || value.length > MAX_BLOCKS) {
    return null;
  }

  try {
    if (JSON.stringify(value).length > MAX_BLOCKS_JSON_LENGTH) {
      return null;
    }
  } catch {
    return null;
  }

  const blocks = value.map(normalizeBlock);

  if (blocks.some((block) => block === null)) {
    return null;
  }

  return blocks as CmsPageBlock[];
}

export function normalizeCmsPageKey(value: unknown): CmsPageKey | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  return CMS_PAGE_KEYS.includes(normalized as CmsPageKey)
    ? (normalized as CmsPageKey)
    : null;
}

export function normalizeCmsPageStatus(
  value: unknown,
  fallback: CmsPageStatus = 'DRAFT'
): CmsPageStatus | null {
  if (value === undefined || value === '') {
    return fallback;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toUpperCase();

  return CMS_PAGE_STATUSES.includes(normalized as CmsPageStatus)
    ? (normalized as CmsPageStatus)
    : null;
}

export function normalizeCmsPageLocale(
  value: unknown,
  fallback = DEFAULT_LOCALE
): string | null {
  if (value === undefined || value === '') {
    return fallback;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  return SUPPORTED_CMS_LOCALES.includes(normalized as (typeof SUPPORTED_CMS_LOCALES)[number])
    ? normalized
    : null;
}

export function normalizeCmsPageText(
  value: unknown,
  options: { fallback?: string | null; maxLength?: number; allowEmpty?: boolean } = {}
): string | null {
  const fallback = options.fallback ?? null;

  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return options.allowEmpty ? '' : fallback;
  }

  if (normalized.length > (options.maxLength ?? MAX_TEXT_LENGTH)) {
    return null;
  }

  return normalized;
}

export function normalizeCmsPageTitle(value: unknown): string | null {
  return normalizeCmsPageText(value, { maxLength: MAX_TITLE_LENGTH });
}

export function normalizeCmsPageSeoDescription(value: unknown): string | null {
  return normalizeCmsPageText(value, { maxLength: MAX_DESCRIPTION_LENGTH });
}

export function normalizeCmsPageOptionalTitle(value: unknown): string | null {
  return normalizeCmsPageText(value, { maxLength: MAX_TITLE_LENGTH, fallback: null });
}

export function normalizeCmsPageLink(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const href = value.trim();

  if (!href || href.length > MAX_URL_LENGTH || href.startsWith('//')) {
    return null;
  }

  if (href.startsWith('/')) {
    return href;
  }

  try {
    const parsed = new URL(href);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }

    parsed.hash = '';
    return parsed.toString();
  } catch {
    return null;
  }
}

export function serializeCmsPage(page: CmsPageRecord): CmsPageResponse {
  const toIso = (value: unknown): string | null =>
    value instanceof Date
      ? value.toISOString()
      : typeof value === 'string'
        ? value
        : null;

  return {
    id: String(page.id),
    pageKey: normalizeCmsPageKey(page.pageKey) ?? 'home',
    locale: String(page.locale ?? DEFAULT_LOCALE),
    status: normalizeCmsPageStatus(page.status) ?? 'DRAFT',
    title: String(page.title ?? ''),
    blocks: normalizeCmsPageBlocks(page.blocks) ?? [],
    seoTitle: typeof page.seoTitle === 'string' ? page.seoTitle : null,
    seoDescription:
      typeof page.seoDescription === 'string' ? page.seoDescription : null,
    canonicalUrl: typeof page.canonicalUrl === 'string' ? page.canonicalUrl : null,
    publishedAt: toIso(page.publishedAt),
    lastReviewedAt: toIso(page.lastReviewedAt),
    deletedAt: toIso(page.deletedAt),
    createdAt: toIso(page.createdAt) ?? new Date(0).toISOString(),
    updatedAt: toIso(page.updatedAt) ?? new Date(0).toISOString(),
  };
}

export async function getPublishedCmsPage(
  pageKey: CmsPageKey,
  locale: string
): Promise<CmsPagePublicContent | null> {
  const normalizedLocale = normalizeCmsPageLocale(locale);

  if (!normalizedLocale) {
    return null;
  }

  try {
    const page = await prisma.cmsPage.findFirst({
      where: {
        pageKey,
        locale: normalizedLocale,
        status: 'PUBLISHED',
        deletedAt: null,
      },
      select: {
        pageKey: true,
        locale: true,
        title: true,
        blocks: true,
        seoTitle: true,
        seoDescription: true,
        canonicalUrl: true,
      },
    });

    const blocks = normalizeCmsPageBlocks(page?.blocks);

    if (!page || !blocks || blocks.length === 0) {
      return null;
    }

    return {
      pageKey,
      locale: page.locale,
      title: page.title,
      blocks,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      canonicalUrl: page.canonicalUrl,
    };
  } catch (error) {
    console.error(`CMS page fallback for ${pageKey}/${locale}:`, error);
    return null;
  }
}

function getBlockText(block: CmsPageBlock, field: string): string | undefined {
  const value = block[field];

  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function getBlockTextList(block: CmsPageBlock, field: string): string[] | undefined {
  const value = block[field];

  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .slice(0, 6);

  return items.length > 0 ? items : undefined;
}

export async function getStatusPageCmsContent(
  locale: string
): Promise<StatusPageCmsContent | null> {
  const page = await getPublishedCmsPage('status', locale);
  const hero = page?.blocks.find(
    (block) =>
      block.enabled !== false &&
      block.type === 'hero' &&
      (block.key === 'statusHero' || block.key === 'hero')
  );

  if (!hero) {
    return null;
  }

  const content: StatusPageCmsContent = {
    badge: getBlockText(hero, 'badge'),
    title: getBlockText(hero, 'title'),
    intro: getBlockText(hero, 'intro') ?? getBlockText(hero, 'subtitle'),
    safeHints: getBlockTextList(hero, 'safeHints'),
    restoreHint: getBlockText(hero, 'restoreHint'),
  };

  return Object.values(content).some(Boolean) ? content : null;
}
