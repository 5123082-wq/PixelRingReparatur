import 'server-only';

import { containsStaleLegalContent } from '@/lib/legal-content';
import { prisma } from '@/lib/prisma';

export const CMS_PAGE_KEYS = [
  'home',
  'status',
  'global',
  'impressum',
  'privacy',
  'leistungen',
  'business',
  'probleme-loesungen',
  'about',
  'referenzen',
] as const;
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
  'trustSection',
  'excellence',
  'labels',
] as const;

const DEFAULT_LOCALE = 'de';
const MAX_BLOCKS = 80;
const MAX_BLOCK_DEPTH = 8;
const MAX_BLOCK_ITEMS = 200;
const MAX_BLOCK_KEY_LENGTH = 120;
const MAX_BLOCK_STRING_LENGTH = 50_000;
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

export type CmsLinkItem = {
  label: string;
  href: string;
};

export type GlobalHeaderCmsContent = {
  servicePill?: string;
  bookLabel?: string;
  links?: CmsLinkItem[];
  accountStatusLabel?: string;
  accountStatusHref?: string;
  requestLabel?: string;
  requestHref?: string;
};

export type GlobalFooterCmsContent = {
  servicesTitle?: string;
  supportTitle?: string;
  socialTitle?: string;
  companyTitle?: string;
  copyright?: string;
  serviceLinks?: CmsLinkItem[];
  supportLinks?: CmsLinkItem[];
  socialLinks?: CmsLinkItem[];
  legalLinks?: CmsLinkItem[];
  companyLines?: string[];
  hours?: string;
  email?: string;
};

export type FooterCtaCmsContent = {
  title?: string;
  subtitle?: string;
  connectLabel?: string;
  formTitle?: string;
  formSubtitle?: string;
};

export type GlobalPageCmsContent = {
  header?: GlobalHeaderCmsContent;
  footer?: GlobalFooterCmsContent;
  footerCta?: FooterCtaCmsContent;
};

export type HomeHeroCmsContent = {
  pretitle?: string;
  title?: string;
  titlePrefix?: string;
  titleAccent?: string;
  titleSuffix?: string;
  intro?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  trustBadge?: string;
  responseBadge?: string;
  assetUrl?: string;
  imageAlt?: string;
  fallbackSrc?: string;
};

export type HomeIntakeMethodId = 'text' | 'photo' | 'voice' | 'messenger';

export type HomeIntakeMethodCmsContent = {
  id: HomeIntakeMethodId;
  title?: string;
  label?: string;
};

export type HomeIntakeCmsContent = {
  title?: string;
  description?: string;
  methods?: HomeIntakeMethodCmsContent[];
};

export type BentoGridCmsContent = {
  title?: string;
  steps?: { title?: string; description?: string; highlight?: string }[];
};

export type TrustCmsContent = {
  pretitle?: string;
  titleStart?: string;
  titleAccent?: string;
  titleEnd?: string;
  description?: string;
  cta_label?: string;
  cta_subtext?: string;
  stats?: { value?: string; label?: string; description?: string; highlight?: string }[];
  features?: { icon?: string; label?: string }[];
};

export type CoverageMapCmsContent = {
  title?: string;
  description?: string;
};

export type ExcellenceCmsContent = {
  title?: string;
  subtitle?: string;
  items?: { title?: string; tag?: string; description?: string; image?: string; imageAlt?: string }[];
};

export type ReviewCmsContent = {
  title?: string;
  subtitle?: string;
  items?: { content?: string; name?: string; role?: string }[];
};

export type RoadmapCmsContent = {
  title?: string;
  subtitle?: string;
  description?: string;
  steps?: { title?: string; description?: string }[];
};

export type FaqCmsContent = {
  title?: string;
  items?: { question?: string; answer?: string }[];
};

export type HomePageCmsContent = {
  hero?: HomeHeroCmsContent;
  intake?: HomeIntakeCmsContent;
  bento?: BentoGridCmsContent;
  trust?: TrustCmsContent;
  coverage?: CoverageMapCmsContent;
  excellence?: ExcellenceCmsContent;
  reviews?: ReviewCmsContent;
  roadmap?: RoadmapCmsContent;
  faq?: FaqCmsContent;
};



export type LeistungenHeroSlideCmsContent = {
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  fallbackSrc?: string;
  cta?: string;
};

export type CmsListItemContent = {
  id?: string;
  title?: string;
  description?: string;
  summary?: string;
  details?: string;
  text?: string;
  image?: string;
  imageAlt?: string;
  cta?: string;
  href?: string;
  icon?: string;
  value?: string;
  label?: string;
  question?: string;
  answer?: string;
};

export type LeistungenPageCmsContent = {
  heroSlides?: (LeistungenHeroSlideCmsContent & { enabled?: boolean })[];
  repair?: { title?: string; description?: string; items?: CmsListItemContent[]; focus?: string; enabled?: boolean };
  branding?: { title?: string; description?: string; items?: CmsListItemContent[]; enabled?: boolean };
  maintenance?: { title?: string; description?: string; items?: string[]; discount?: string; cta?: string; auditCta?: string; enabled?: boolean };
  process?: { title?: string; items?: CmsListItemContent[]; enabled?: boolean };
  trust?: { title?: string; items?: string[]; finalHeadline?: string; finalText?: string; enabled?: boolean };
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

  const blocks = value.map(normalizeBlock).filter((block): block is CmsPageBlock => block !== null);

  return blocks;
}

export function validateCmsPageBlocksForPage(
  pageKey: CmsPageKey,
  locale: string,
  blocks: CmsPageBlock[],
  metadataText: Array<string | null | undefined> = []
): string | null {
  if (pageKey !== 'impressum' && pageKey !== 'privacy') {
    return null;
  }

  if (locale !== DEFAULT_LOCALE) {
    return null;
  }

  const mainContent = blocks.find(
    (block) => block.type === 'textSection' && block.key === 'mainContent'
  );

  if (!mainContent) {
    return 'Legal pages require a mainContent textSection block.';
  }

  if (mainContent.enabled === false) {
    return 'Legal pages require the mainContent block to be visible.';
  }

  const description =
    typeof mainContent.description === 'string' ? mainContent.description.trim() : '';

  if (!description) {
    return 'Legal pages require mainContent description text.';
  }

  const legalText = [
    ...metadataText,
    ...blocks.map((block) =>
      [
        typeof block.title === 'string' ? block.title : '',
        typeof block.description === 'string' ? block.description : '',
      ].join('\n')
    ),
  ].join('\n');

  if (containsStaleLegalContent(pageKey, legalText)) {
    return 'Legal page contains stale legal content.';
  }

  return null;
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

function isCmsDatabaseUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const code = 'code' in error ? error.code : undefined;
  if (typeof code === 'string' && ['P1000', 'P1001', 'P1002'].includes(code)) {
    return true;
  }

  const message = 'message' in error ? error.message : undefined;
  return (
    typeof message === 'string' &&
    /can't reach database server|connection terminated|connection refused|timeout/i.test(message)
  );
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
    if (isCmsDatabaseUnavailableError(error)) {
      console.warn(
        `CMS unavailable for ${pageKey}/${locale}; using local fallback content.`
      );
      return null;
    }

    console.error(`CMS page fallback for ${pageKey}/${locale}:`, error);
    return null;
  }
}

export function getBlockText(block: CmsPageBlock, field: string): string | undefined {
  const value = block[field];

  if (typeof value !== 'string' || !value.trim()) {
    return undefined;
  }

  if (/href|url|asset/i.test(field) || /^image$/i.test(field)) {
    return value.trim();
  }

  return sanitizePublicText(value.trim());
}

function sanitizePublicText(value: string): string {
  let text = value
    .replace(/Describe your task, and we'll get back to you within 15 minutes\./g, 'Beschreiben Sie Ihre Aufgabe. Wir melden uns in der Regel innerhalb von 15 Minuten.')
    .replace(/\bTest Alt Text Hero\b/g, 'PixelRing Schilder-Reparatur und Service')
    .replace(/Beschreiben Sie die Aufgabe и загрузите фото\./g, 'Beschreiben Sie die Aufgabe und laden Sie bei Bedarf ein Foto hoch.')
    .replace(/Reparatur, Wartung, Ersatz или Neubau\./g, 'Reparatur, Wartung, Ersatz oder Neubau.')
    .replace(/\bHalterungen, Rahmen, Unterkonstruktionen and Befestigungspunkte\b/g, 'Halterungen, Rahmen, Unterkonstruktionen und Befestigungspunkte')
    .replace(/\bAudit Complete\b/g, 'Audit abgeschlossen')
    .replace(/\bAll print materials and signage verified\b/g, 'Alle Printmaterialien und Werbeanlagen geprüft')
    .replace(/\bBEFORE:/g, 'Vorher:')
    .replace(/([a-zäöüß])\.([A-ZÄÖÜ])/g, '$1. $2');

  const replacements: Array<[RegExp, string]> = [
    [/\bfuer\b/g, 'für'],
    [/\bFuer\b/g, 'Für'],
    [/\bLoesungen\b/g, 'Lösungen'],
    [/\bloesen\b/g, 'lösen'],
    [/\bloest\b/g, 'löst'],
    [/\bgeloest\b/g, 'gelöst'],
    [/\bPruefung\b/g, 'Prüfung'],
    [/\bpruefen\b/g, 'prüfen'],
    [/\bprueft\b/g, 'prüft'],
    [/\bgeprueft\b/g, 'geprüft'],
    [/\bSichtpruefung\b/g, 'Sichtprüfung'],
    [/\bGeschaeftsstandort\b/g, 'Geschäftsstandort'],
    [/\bGeschaeftsstandorte\b/g, 'Geschäftsstandorte'],
    [/\bGeschaeftskunden\b/g, 'Geschäftskunden'],
    [/\bGeschaeftskunden-Anfrage\b/g, 'Geschäftskunden-Anfrage'],
    [/\bGeschaeft\b/g, 'Geschäft'],
    [/\bSchaeden\b/g, 'Schäden'],
    [/\bbeschaedigte\b/g, 'beschädigte'],
    [/\bbeschaedigt\b/g, 'beschädigt'],
    [/\bbeschaeftigt\b/g, 'beschäftigt'],
    [/\bFlaechen\b/g, 'Flächen'],
    [/\bFlaeche\b/g, 'Fläche'],
    [/\bregelmaessige\b/g, 'regelmäßige'],
    [/\bRegelmaessige\b/g, 'Regelmäßige'],
    [/\bgleichmaessig\b/g, 'gleichmäßig'],
    [/\bUngleichmaessiges\b/g, 'Ungleichmäßiges'],
    [/\bungleichmaessig\b/g, 'ungleichmäßig'],
    [/\bunzuverlaessig\b/g, 'unzuverlässig'],
    [/\bverstaendlich\b/g, 'verständlich'],
    [/\bverstaendlichen\b/g, 'verständlichen'],
    [/\bvollstaendig\b/g, 'vollständig'],
    [/\bnaechsten\b/g, 'nächsten'],
    [/\bnaechste\b/g, 'nächste'],
    [/\bnaechster\b/g, 'nächster'],
    [/\bEinschaetzung\b/g, 'Einschätzung'],
    [/\bEinschaetzungen\b/g, 'Einschätzungen'],
    [/\bFerneinschaetzung\b/g, 'Ferneinschätzung'],
    [/\bRueckfragen\b/g, 'Rückfragen'],
    [/\bRueckbau\b/g, 'Rückbau'],
    [/\bLeuchtkaesten\b/g, 'Leuchtkästen'],
    [/\bGelaende\b/g, 'Gelände'],
    [/\bAutohaeuser\b/g, 'Autohäuser'],
    [/\bLuecken\b/g, 'Lücken'],
    [/\bgroessen\b/g, 'größen'],
    [/\bgroesste\b/g, 'größte'],
    [/\bgrossen\b/g, 'großen'],
    [/\bHaende\b/g, 'Hände'],
    [/\bUeberblick\b/g, 'Überblick'],
    [/\bunterstuetzt\b/g, 'unterstützt'],
    [/\bServicevertraege\b/g, 'Serviceverträge'],
    [/\bTagesgeschaeft\b/g, 'Tagesgeschäft'],
    [/\blauft\b/g, 'läuft'],
    [/\blaeuft\b/g, 'läuft'],
    [/\bAufwaermen\b/g, 'Aufwärmen'],
    [/\bNeonroehren\b/g, 'Neonröhren'],
  ];

  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }

  const midpoint = Math.floor(text.length / 2);
  if (text.length > 40 && text.length % 2 === 0 && text.slice(0, midpoint) === text.slice(midpoint)) {
    text = text.slice(0, midpoint);
  }

  return text.replace(/\s+/g, ' ').trim();
}

export function getBlockTextList(block: CmsPageBlock, field: string): string[] | undefined {
  const value = block[field];

  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value
    .map((item) => (typeof item === 'string' ? sanitizePublicText(item.trim()) : ''))
    .filter(Boolean)
    .slice(0, 6);

  return items.length > 0 ? items : undefined;
}

export function getBlockObjectList(
  block: CmsPageBlock,
  field: string
): Record<string, unknown>[] | undefined {
  const value = block[field];

  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value.reduce<Record<string, unknown>[]>((acc, item) => {
    if (isPlainObject(item)) {
      acc.push(sanitizePublicObject(item));
    }

    return acc;
  }, []);
  return items.length > 0 ? items : undefined;
}

function sanitizePublicObject(item: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(item).map(([key, value]) => {
      if (typeof value === 'string' && !/href|url|image|asset/i.test(key)) {
        return [key, sanitizePublicText(value)];
      }

      return [key, value];
    })
  );
}

async function getCmsMediaFallbacks(urls: Array<string | undefined | null>): Promise<Map<string, string>> {
  const publicUrls = Array.from(
    new Set(urls.filter((url): url is string => typeof url === 'string' && url.trim().length > 0))
  );

  if (publicUrls.length === 0) {
    return new Map();
  }

  const records = await prisma.cmsMedia.findMany({
    where: {
      publicUrl: { in: publicUrls },
      deletedAt: null,
      fallbackUrl: { not: null },
    },
    select: {
      publicUrl: true,
      fallbackUrl: true,
    },
  });

    return new Map(
      records
        .filter((record): record is { publicUrl: string; fallbackUrl: string } => Boolean(record.publicUrl && record.fallbackUrl))
        .map((record) => [record.publicUrl, record.fallbackUrl])
    );
}

function getLinkItems(block: CmsPageBlock, field: string): CmsLinkItem[] | undefined {
  const items = getBlockObjectList(block, field);

  if (!items) {
    return undefined;
  }

  const links = items
    .map((item) => {
      const label = typeof item.label === 'string' ? item.label.trim() : '';
      const href = typeof item.href === 'string' ? item.href.trim() : '';

      return label && href ? { label, href } : null;
    })
    .filter((item): item is CmsLinkItem => Boolean(item));

  return links.length > 0 ? links : undefined;
}

function normalizeGlobalNavigationLinks(links: CmsLinkItem[] | undefined): CmsLinkItem[] | undefined {
  if (!links) {
    return undefined;
  }

  return links.map((link, index) => {
    if (index === 1 || link.href === '/support#symptoms') {
      return {
        label: link.label,
        href: '/probleme-loesungen',
      };
    }

    if (index === 3) {
      return {
        label: link.label,
        href: '/referenzen',
      };
    }

    return link;
  });
}

function getLeistungenHeroSlides(block: CmsPageBlock): LeistungenHeroSlideCmsContent[] | undefined {
  const items = getBlockObjectList(block, 'items');

  if (!items) {
    return undefined;
  }

  const slides = items
    .map<LeistungenHeroSlideCmsContent | null>((item) => {
      const id = typeof item.id === 'string' && item.id.trim() ? item.id.trim() : undefined;
      const title = typeof item.title === 'string' && item.title.trim() ? item.title.trim() : undefined;
      const description =
        typeof item.description === 'string' && item.description.trim()
          ? item.description.trim()
          : undefined;
      const image = typeof item.image === 'string' && item.image.trim() ? item.image.trim() : undefined;
      const imageAlt = typeof item.imageAlt === 'string' && item.imageAlt.trim() ? item.imageAlt.trim() : undefined;
      const cta = typeof item.cta === 'string' && item.cta.trim() ? item.cta.trim() : undefined;

      return id || title || description || image || imageAlt || cta
        ? { id, title, description, image, imageAlt, cta }
        : null;
    })
    .filter((item): item is LeistungenHeroSlideCmsContent => Boolean(item))
    .slice(0, 6);

  return slides.length > 0 ? slides : undefined;
}

function isHomeIntakeMethodId(value: unknown): value is HomeIntakeMethodId {
  return (
    typeof value === 'string' &&
    ['text', 'photo', 'voice', 'messenger'].includes(value)
  );
}

function getHomeIntakeMethods(
  block: CmsPageBlock,
  field: string
): HomeIntakeMethodCmsContent[] | undefined {
  const items = getBlockObjectList(block, field);

  if (!items) {
    return undefined;
  }

  const methods = items
    .map<HomeIntakeMethodCmsContent | null>((item) => {
      const id = item.id;

      if (!isHomeIntakeMethodId(id)) {
        return null;
      }

      const title =
        typeof item.title === 'string' && item.title.trim() ? item.title.trim() : undefined;
      const label =
        typeof item.label === 'string' && item.label.trim() ? item.label.trim() : undefined;

      return title || label ? { id, title, label } : null;
    })
    .filter((item): item is HomeIntakeMethodCmsContent => Boolean(item))
    .slice(0, 4);

  return methods.length > 0 ? methods : undefined;
}

export function getBlock(
  page: CmsPagePublicContent | null,
  type: CmsPageBlockType,
  keys: string[]
): CmsPageBlock | null {
  if (!page) {
    return null;
  }

  return (
    page.blocks.find(
      (block) =>
        block.type === type &&
        keys.includes(block.key)
    ) ?? null
  );
}

function getEnabledBlock(
  page: CmsPagePublicContent | null,
  type: CmsPageBlockType,
  keys: string[]
): CmsPageBlock | null {
  const block = getBlock(page, type, keys);
  return block?.enabled !== false ? block : null;
}

export async function getStatusPageCmsContent(
  locale: string
): Promise<StatusPageCmsContent | null> {
  const page = await getPublishedCmsPage('status', locale);
  const hero = getEnabledBlock(page, 'hero', ['statusHero', 'hero']);

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

export async function getGlobalPageCmsContent(
  locale: string
): Promise<GlobalPageCmsContent | null> {
  const page = await getPublishedCmsPage('global', locale);

  if (!page) {
    return null;
  }

  const navigation = getEnabledBlock(page, 'cta', ['globalNavigation', 'navigation', 'nav']);
  const footerServices = getEnabledBlock(page, 'cardList', ['footerServices']);
  const footerSupport = getEnabledBlock(page, 'cardList', ['footerSupport']);
  const footerSocial = getEnabledBlock(page, 'cardList', ['footerSocial']);
  const footerCompany = getEnabledBlock(page, 'textSection', ['footerCompany']);
  const footerLegal = getEnabledBlock(page, 'cardList', ['footerLegal']);
  const footerCta = getEnabledBlock(page, 'footerCta', ['globalFooterCta', 'footerCta']);

  const content: GlobalPageCmsContent = {
    header: navigation
      ? {
          servicePill: getBlockText(navigation, 'servicePill'),
          bookLabel: getBlockText(navigation, 'bookLabel'),
          links: normalizeGlobalNavigationLinks(getLinkItems(navigation, 'links')),
          accountStatusLabel: getBlockText(navigation, 'accountStatusLabel'),
          accountStatusHref: getBlockText(navigation, 'accountStatusHref'),
          requestLabel: getBlockText(navigation, 'requestLabel'),
          requestHref: getBlockText(navigation, 'requestHref'),
        }
      : undefined,
    footer:
      footerServices || footerSupport || footerSocial || footerCompany || footerLegal
        ? {
            servicesTitle: footerServices ? getBlockText(footerServices, 'title') : undefined,
            supportTitle: footerSupport ? getBlockText(footerSupport, 'title') : undefined,
            socialTitle: footerSocial ? getBlockText(footerSocial, 'title') : undefined,
            companyTitle: footerCompany ? getBlockText(footerCompany, 'title') : undefined,
            copyright: footerLegal ? getBlockText(footerLegal, 'copyright') : undefined,
            serviceLinks: footerServices ? getLinkItems(footerServices, 'items') : undefined,
            supportLinks: footerSupport ? getLinkItems(footerSupport, 'items')?.map(l => l.href === '/support' || l.href === '/support#symptoms' ? { ...l, href: '/probleme-loesungen' } : l) : undefined,
            socialLinks: footerSocial ? getLinkItems(footerSocial, 'items') : undefined,
            legalLinks: footerLegal ? getLinkItems(footerLegal, 'items') : undefined,
            companyLines: footerCompany ? getBlockTextList(footerCompany, 'lines') : undefined,
            hours: footerCompany ? getBlockText(footerCompany, 'hours') : undefined,
            email: footerCompany ? getBlockText(footerCompany, 'email') : undefined,
          }
        : undefined,
    footerCta: footerCta
      ? {
          title: getBlockText(footerCta, 'title'),
          subtitle: getBlockText(footerCta, 'subtitle'),
          connectLabel: getBlockText(footerCta, 'connectLabel'),
          formTitle: getBlockText(footerCta, 'formTitle'),
          formSubtitle: getBlockText(footerCta, 'formSubtitle'),
        }
      : undefined,
  };

  return Object.values(content).some(Boolean) ? content : null;
}

export async function getHomePageCmsContent(
  locale: string
): Promise<HomePageCmsContent | null> {
  const page = await getPublishedCmsPage('home', locale);
  const hero = getEnabledBlock(page, 'hero', ['hero']);
  const intake = getEnabledBlock(page, 'textSection', ['intakeSection']);
  const bento = getEnabledBlock(page, 'cardList', ['bentoSection']);
  const trust = getEnabledBlock(page, 'cardList', ['trustSection']);
  const coverage = getEnabledBlock(page, 'cardList', ['coverageSection']);
  const excellence = getEnabledBlock(page, 'cardList', ['excellenceSection']);
  const reviews = getEnabledBlock(page, 'reviewList', ['reviewsSection']);
  const faq = getEnabledBlock(page, 'faqList', ['faqSection']);

  const content: HomePageCmsContent = {
    hero: hero
      ? {
          pretitle: getBlockText(hero, 'pretitle'),
          title: getBlockText(hero, 'title'),
          titlePrefix: getBlockText(hero, 'titlePrefix'),
          titleAccent: getBlockText(hero, 'titleAccent'),
          titleSuffix: getBlockText(hero, 'titleSuffix'),
          intro: getBlockText(hero, 'intro') ?? getBlockText(hero, 'description'),
          ctaPrimary: getBlockText(hero, 'ctaPrimary'),
          ctaSecondary: getBlockText(hero, 'ctaSecondary'),
          trustBadge: getBlockText(hero, 'trustBadge'),
          responseBadge: getBlockText(hero, 'responseBadge'),
          assetUrl: getBlockText(hero, 'assetUrl'),
          imageAlt: getBlockText(hero, 'imageAlt'),
        }
      : undefined,
    intake: intake
      ? {
          title: getBlockText(intake, 'title'),
          description: getBlockText(intake, 'description'),
          methods: getHomeIntakeMethods(intake, 'methods'),
        }
      : undefined,
    bento: bento
      ? {
          title: getBlockText(bento, 'title'),
          steps: getBlockObjectList(bento, 'steps')?.map(s => ({
            title: typeof s.title === 'string' ? s.title : undefined,
            description: typeof s.description === 'string' ? s.description : undefined,
            highlight: typeof s.highlight === 'string' ? s.highlight : undefined,
          })),
        }
      : undefined,
    trust: trust
      ? {
          pretitle: getBlockText(trust, 'pretitle'),
          titleStart: getBlockText(trust, 'titleStart'),
          titleAccent: getBlockText(trust, 'titleAccent'),
          titleEnd: getBlockText(trust, 'titleEnd'),
          description: getBlockText(trust, 'description'),
          cta_label: getBlockText(trust, 'cta_label'),
          cta_subtext: getBlockText(trust, 'cta_subtext'),
          stats: getBlockObjectList(trust, 'stats')?.map(s => ({
            value: typeof s.value === 'string' ? s.value : undefined,
            label: typeof s.label === 'string' ? s.label : undefined,
            description: typeof s.description === 'string' ? s.description : undefined,
            highlight: typeof s.highlight === 'string' ? s.highlight : undefined,
          })),
          features: getBlockObjectList(trust, 'features')?.map(f => ({
            icon: typeof f.icon === 'string' ? f.icon : undefined,
            label: typeof f.label === 'string' ? f.label : undefined,
          })),
        }
      : undefined,
    coverage: coverage
      ? {
          title: getBlockText(coverage, 'title'),
          description: getBlockText(coverage, 'description'),
        }
      : undefined,
    excellence: excellence
      ? {
          title: getBlockText(excellence, 'title'),
          subtitle: getBlockText(excellence, 'subtitle'),
          items: getBlockObjectList(excellence, 'items')?.map(i => ({
            title: typeof i.title === 'string' ? i.title : undefined,
            tag: typeof i.tag === 'string' ? i.tag : undefined,
            description: typeof i.description === 'string' ? i.description : undefined,
            image: typeof i.image === 'string' ? i.image : undefined,
            imageAlt: typeof i.imageAlt === 'string' ? i.imageAlt : undefined,
          })),
        }
      : undefined,
    reviews: reviews
      ? {
          title: getBlockText(reviews, 'title'),
          subtitle: getBlockText(reviews, 'subtitle'),
          items: getBlockObjectList(reviews, 'items')?.map(i => ({
            content: typeof i.content === 'string' ? i.content : undefined,
            name: typeof i.name === 'string' ? i.name : undefined,
            role: typeof i.role === 'string' ? i.role : undefined,
          })),
        }
      : undefined,
    faq: faq
      ? {
          title: getBlockText(faq, 'title'),
          items: getBlockObjectList(faq, 'items')?.map(i => ({
            question: typeof i.question === 'string' ? i.question : typeof i.q === 'string' ? i.q : undefined,
            answer: typeof i.answer === 'string' ? i.answer : typeof i.a === 'string' ? i.a : undefined,
          })),
        }
      : undefined,
  };

  const hasHero = !!hero;
  const hasIntake = !!intake;
  const hasBento = !!bento;
  const hasTrust = !!trust;
  const hasCoverage = !!coverage;
  const hasExcellence = !!excellence;
  const hasReviews = !!reviews;
  const hasFaq = !!faq;

  if (content.hero?.assetUrl) {
    content.hero.fallbackSrc = (await getCmsMediaFallbacks([content.hero.assetUrl])).get(
      content.hero.assetUrl
    );
  }

  return hasHero || hasIntake || hasBento || hasTrust || hasCoverage || hasExcellence || hasReviews || hasFaq ? content : null;
}



export async function getLeistungenPageCmsContent(
  locale: string
): Promise<LeistungenPageCmsContent | null> {
  const page = await getPublishedCmsPage('leistungen', locale);
  if (!page) return null;

  const hero = getBlock(page, 'cardList', ['leistungenHero', 'heroSlides']);
  const repair = getBlock(page, 'cardList', ['repair']);
  const branding = getBlock(page, 'cardList', ['branding']);
  const maintenance = getBlock(page, 'cardList', ['maintenance']);
  const process = getBlock(page, 'cardList', ['process']);
  const trust = getBlock(page, 'cardList', ['trust']);

  const content: LeistungenPageCmsContent = {
    heroSlides: hero ? getLeistungenHeroSlides(hero) : undefined,
    repair: repair ? {
      enabled: repair.enabled !== false,
      title: getBlockText(repair, 'title'),
      description: getBlockText(repair, 'description') ?? getBlockText(repair, 'intro'),
      items: getBlockObjectList(repair, 'items'),
      focus: getBlockText(repair, 'focus'),
    } : undefined,
    branding: branding ? {
      enabled: branding.enabled !== false,
      title: getBlockText(branding, 'title'),
      description: getBlockText(branding, 'description') ?? getBlockText(branding, 'intro'),
      items: getBlockObjectList(branding, 'items'),
    } : undefined,
    maintenance: maintenance ? {
      enabled: maintenance.enabled !== false,
      title: getBlockText(maintenance, 'title'),
      description: getBlockText(maintenance, 'description') ?? getBlockText(maintenance, 'subline'),
      items: getBlockTextList(maintenance, 'items'),
      discount: getBlockText(maintenance, 'discount'),
      cta: getBlockText(maintenance, 'cta') ?? getBlockText(maintenance, 'serviceContractCta'),
      auditCta: getBlockText(maintenance, 'auditCta'),
    } : undefined,
    process: process ? {
      enabled: process.enabled !== false,
      title: getBlockText(process, 'title'),
      items: getBlockObjectList(process, 'items'),
    } : undefined,
    trust: trust ? {
      enabled: trust.enabled !== false,
      title: getBlockText(trust, 'title') ?? getBlockText(trust, 'frameTitle'),
      items: getBlockTextList(trust, 'items') ?? getBlockTextList(trust, 'trustPoints'),
      finalHeadline: getBlockText(trust, 'finalHeadline'),
      finalText: getBlockText(trust, 'finalText'),
    } : undefined,
  };

  if (content.heroSlides?.length) {
    const fallbackMap = await getCmsMediaFallbacks(content.heroSlides.map((slide) => slide.image));
    content.heroSlides = content.heroSlides.map((slide) => ({
      ...slide,
      fallbackSrc: slide.image ? fallbackMap.get(slide.image) : undefined,
    }));
  }

  return content;
}
export type BusinessHeroCmsContent = {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  fallbackSrc?: string;
  cta?: string;
};

export type BusinessPageCmsContent = {
  hero?: BusinessHeroCmsContent & { enabled?: boolean };
  target?: { title?: string; description?: string; items?: CmsListItemContent[]; enabled?: boolean };
  audit?: { title?: string; description?: string; items?: CmsListItemContent[]; enabled?: boolean };
  platform?: { title?: string; description?: string; items?: CmsListItemContent[]; enabled?: boolean };
  trust?: { title?: string; description?: string; enabled?: boolean };
  final?: { title?: string; description?: string; primaryLabel?: string; enabled?: boolean };
};

export async function getBusinessPageCmsContent(
  locale: string
): Promise<BusinessPageCmsContent | null> {
  const page = await getPublishedCmsPage('business', locale);
  if (!page) return null;

  const hero = getBlock(page, 'hero', ['businessHero', 'hero']);
  const target = getBlock(page, 'cardList', ['target']);
  const audit = getBlock(page, 'cardList', ['audit']);
  const platform = getBlock(page, 'cardList', ['platform']);
  const trust = getBlock(page, 'textSection', ['trust']);
  const final = getBlock(page, 'cta', ['final']);

  const content: BusinessPageCmsContent = {
    hero: hero ? {
      enabled: hero.enabled !== false,
      title: getBlockText(hero, 'title'),
      description: getBlockText(hero, 'description') ?? getBlockText(hero, 'intro'),
      image: getBlockText(hero, 'image') ?? getBlockText(hero, 'assetUrl'),
      imageAlt: getBlockText(hero, 'imageAlt'),
      cta: getBlockText(hero, 'cta') ?? getBlockText(hero, 'ctaPrimary'),
    } : undefined,
    target: target ? {
      enabled: target.enabled !== false,
      title: getBlockText(target, 'title'),
      description: getBlockText(target, 'description') ?? getBlockText(target, 'intro'),
      items: getBlockObjectList(target, 'items'),
    } : undefined,
    audit: audit ? {
      enabled: audit.enabled !== false,
      title: getBlockText(audit, 'title'),
      description: getBlockText(audit, 'description') ?? getBlockText(audit, 'intro'),
      items: getBlockObjectList(audit, 'items'),
    } : undefined,
    platform: platform ? {
      enabled: platform.enabled !== false,
      title: getBlockText(platform, 'title'),
      description: getBlockText(platform, 'description') ?? getBlockText(platform, 'intro'),
      items: getBlockObjectList(platform, 'items'),
    } : undefined,
    trust: trust ? {
      enabled: trust.enabled !== false,
      title: getBlockText(trust, 'title'),
      description: getBlockText(trust, 'description') ?? getBlockText(trust, 'intro'),
    } : undefined,
    final: final ? {
      enabled: final.enabled !== false,
      title: getBlockText(final, 'title') ?? getBlockText(final, 'finalHeadline'),
      description: getBlockText(final, 'description') ?? getBlockText(final, 'finalText'),
      primaryLabel: getBlockText(final, 'primaryLabel') ?? getBlockText(final, 'finalCta'),
    } : undefined,
  };

  if (content.hero?.image) {
    content.hero.fallbackSrc = (await getCmsMediaFallbacks([content.hero.image])).get(
      content.hero.image
    );
  }

  return content;
}

export type ProblemeLoesungenHeroCmsContent = {
  title?: string;
  description?: string;
  cta?: string;
};

export type ProblemeLoesungenPageCmsContent = {
  hero?: ProblemeLoesungenHeroCmsContent & { secondaryCta?: string; badge?: string; trust?: string; enabled?: boolean };
  problems?: { title?: string; description?: string; items?: CmsListItemContent[]; cta?: string; enabled?: boolean };
  impact?: { title?: string; description?: string; items?: CmsListItemContent[]; enabled?: boolean };
  urgent?: { title?: string; description?: string; items?: string[]; cta?: string; enabled?: boolean };
  faq?: { title?: string; items?: CmsListItemContent[]; enabled?: boolean };
  final?: { title?: string; description?: string; primaryLabel?: string; enabled?: boolean };
};

export async function getProblemeLoesungenPageCmsContent(
  locale: string
): Promise<ProblemeLoesungenPageCmsContent | null> {
  const page = await getPublishedCmsPage('probleme-loesungen', locale);
  if (!page) return null;

  const hero = getBlock(page, 'hero', ['problemeLoesungenHero', 'hero']);
  const problems = getBlock(page, 'cardList', ['problems']);
  const impact = getBlock(page, 'cardList', ['impact']);
  const urgent = getBlock(page, 'textSection', ['urgent']);
  const faq = getBlock(page, 'faqList', ['faq']);
  const final = getBlock(page, 'cta', ['final']);

  const content: ProblemeLoesungenPageCmsContent = {
    hero: hero ? {
      enabled: hero.enabled !== false,
      title: getBlockText(hero, 'title') ?? getBlockText(hero, 'heroTitle'),
      description: getBlockText(hero, 'description') ?? getBlockText(hero, 'heroIntro'),
      cta: getBlockText(hero, 'cta') ?? getBlockText(hero, 'primaryCta'),
      secondaryCta: getBlockText(hero, 'secondaryCta'),
      badge: getBlockText(hero, 'badge'),
      trust: getBlockText(hero, 'trust') ?? getBlockText(hero, 'heroTrust'),
    } : undefined,
    problems: problems ? {
      enabled: problems.enabled !== false,
      title: getBlockText(problems, 'title') ?? getBlockText(problems, 'problemTitle'),
      description: getBlockText(problems, 'description') ?? getBlockText(problems, 'problemIntro'),
      items: getBlockObjectList(problems, 'items') ?? getBlockObjectList(problems, 'problems'),
      cta: getBlockText(problems, 'cta') ?? getBlockText(problems, 'problemCta'),
    } : undefined,
    impact: impact ? {
      enabled: impact.enabled !== false,
      title: getBlockText(impact, 'title') ?? getBlockText(impact, 'impactTitle'),
      description: getBlockText(impact, 'description') ?? getBlockText(impact, 'impactIntro'),
      items: getBlockObjectList(impact, 'items') ?? getBlockObjectList(impact, 'metrics'),
    } : undefined,
    urgent: urgent ? {
      enabled: urgent.enabled !== false,
      title: getBlockText(urgent, 'title') ?? getBlockText(urgent, 'urgentTitle'),
      description: getBlockText(urgent, 'description') ?? getBlockText(urgent, 'urgentText'),
      items: getBlockTextList(urgent, 'items') ?? getBlockTextList(urgent, 'urgentPoints'),
      cta: getBlockText(urgent, 'cta') ?? getBlockText(urgent, 'urgentCta'),
    } : undefined,
    faq: faq ? {
      enabled: faq.enabled !== false,
      title: getBlockText(faq, 'title') ?? getBlockText(faq, 'faqTitle'),
      items: getBlockObjectList(faq, 'items') ?? getBlockObjectList(faq, 'faqs'),
    } : undefined,
    final: final ? {
      enabled: final.enabled !== false,
      title: getBlockText(final, 'title') ?? getBlockText(final, 'finalTitle'),
      description: getBlockText(final, 'description') ?? getBlockText(final, 'finalText'),
      primaryLabel: getBlockText(final, 'primaryLabel') ?? getBlockText(final, 'primaryCta'),
    } : undefined,
  };

  return content;
}

export type AboutPageCmsContent = {
  hero?: {
    enabled?: boolean;
    title?: string;
    intro?: string;
    cta?: string;
    image?: string;
    imageAlt?: string;
    fallbackSrc?: string;
  };
  mission?: {
    enabled?: boolean;
    title?: string;
    description?: string;
    items?: CmsListItemContent[];
  };
  story?: {
    enabled?: boolean;
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
  quality?: {
    enabled?: boolean;
    title?: string;
    description?: string;
    features?: CmsListItemContent[];
  };
  stats?: {
    enabled?: boolean;
    items?: CmsListItemContent[];
  };
  final?: {
    enabled?: boolean;
    title?: string;
    description?: string;
    button?: string;
  };
};

export async function getAboutPageCmsContent(
  locale: string
): Promise<AboutPageCmsContent | null> {
  const page = await getPublishedCmsPage('about', locale);
  if (!page) return null;

  const hero = getBlock(page, 'hero', ['hero']);
  const mission = getBlock(page, 'cardList', ['mission']);
  const story = getBlock(page, 'textSection', ['story']);
  const quality = getBlock(page, 'cardList', ['quality']);
  const stats = getBlock(page, 'cardList', ['stats']);
  const final = getBlock(page, 'cta', ['final']);

  const content: AboutPageCmsContent = {
    hero: hero ? {
      enabled: hero.enabled !== false,
      title: getBlockText(hero, 'title'),
      intro: getBlockText(hero, 'intro') ?? getBlockText(hero, 'description'),
      cta: getBlockText(hero, 'cta'),
      image: getBlockText(hero, 'image') ?? getBlockText(hero, 'assetUrl'),
      imageAlt: getBlockText(hero, 'imageAlt'),
    } : undefined,
    mission: mission ? {
      enabled: mission.enabled !== false,
      title: getBlockText(mission, 'title'),
      description: getBlockText(mission, 'description'),
      items: getBlockObjectList(mission, 'items'),
    } : undefined,
    story: story ? {
      enabled: story.enabled !== false,
      title: getBlockText(story, 'title'),
      description: getBlockText(story, 'description'),
      image: getBlockText(story, 'image'),
      imageAlt: getBlockText(story, 'imageAlt'),
    } : undefined,
    quality: quality ? {
      enabled: quality.enabled !== false,
      title: getBlockText(quality, 'title'),
      description: getBlockText(quality, 'description'),
      features: getBlockObjectList(quality, 'features') ?? getBlockObjectList(quality, 'items'),
    } : undefined,
    stats: stats ? {
      enabled: stats.enabled !== false,
      items: getBlockObjectList(stats, 'items'),
    } : undefined,
    final: final ? {
      enabled: final.enabled !== false,
      title: getBlockText(final, 'title'),
      description: getBlockText(final, 'description'),
      button: getBlockText(final, 'button') ?? getBlockText(final, 'primaryLabel'),
    } : undefined,
  };

  if (content.hero?.image) {
    const fallbacks = await getCmsMediaFallbacks([content.hero.image]);
    content.hero.fallbackSrc = fallbacks.get(content.hero.image);
  }

  return content;
}
