import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { prisma } from '@/lib/prisma';

export type SupportSymptomCard = {
  slug: string;
  title: string;
  shortAnswer: string | null;
  symptomLabel: string | null;
  sortOrder: number;
  source: 'cms' | 'static';
};

export type SupportArticleDetail = {
  slug: string;
  locale: string;
  title: string;
  symptomLabel: string | null;
  shortAnswer: string | null;
  content: string;
  causes: string[];
  safeChecks: string[];
  urgentWarnings: string[];
  serviceProcess: string[];
  workScopeFactors: string[];
  ctaLabel: string | null;
  ctaHref: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  relatedSlugs: string[];
  lastReviewedAt: string | null;
  source: 'cms' | 'static';
};

export type SupportSeoConfig = {
  indexTitle: string | null;
  indexDescription: string | null;
  indexCanonicalUrl: string | null;
  articleTitleTemplate: string | null;
  articleDescriptionFallback: string | null;
  articleCanonicalBaseUrl: string | null;
};

type SupportMessagesShape = {
  Support?: {
    hero_description?: string;
    symptoms_desc?: string;
    cta_primary?: string;
    symptoms?: Array<{
      id?: string;
      title?: string;
    }>;
  };
};

const DEFAULT_LOCALE = 'de';

const FALLBACK_SYMPTOM_SLUGS = [
  'no-light',
  'flicking',
  'uneven-light',
  'letter-out',
  'rain-fail',
  'peeling-film',
  'faded-film',
  'shaky-sign',
  'urgent-repair',
] as const;

const SUPPORT_SEO_CONFIG_KEYS = {
  indexTitle: ['support_index_title'],
  indexDescription: ['support_index_description'],
  indexCanonicalUrl: ['support_index_canonical_url'],
  articleTitleTemplate: ['support_article_title_template'],
  articleDescriptionFallback: ['support_article_description_fallback'],
  articleCanonicalBaseUrl: ['support_article_canonical_base_url'],
} as const;

function normalizeLocale(locale: string | null | undefined): string {
  const value = locale?.trim().toLowerCase();
  return value || DEFAULT_LOCALE;
}

function normalizeStringList(values: unknown): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
}

export function normalizeSupportSeoText(value: string | null | undefined): string | null {
  const normalized = typeof value === 'string' ? value.trim() : '';
  return normalized.length > 0 ? normalized : null;
}

export function normalizeSupportCanonicalUrl(
  value: string | null | undefined
): string | null {
  const normalized = typeof value === 'string' ? value.trim() : '';

  if (!normalized || normalized.startsWith('//')) {
    return null;
  }

  if (normalized.startsWith('/')) {
    return normalized;
  }

  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    try {
      const parsed = new URL(normalized);

      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return null;
      }

      parsed.hash = '';
      return parsed.toString();
    } catch {
      return null;
    }
  }

  return null;
}

export function resolveSupportCanonicalUrl(
  candidates: Array<string | null | undefined>,
  fallbackPath: string
): string {
  for (const candidate of candidates) {
    const normalized = normalizeSupportCanonicalUrl(candidate);

    if (normalized) {
      return normalized;
    }
  }

  return fallbackPath;
}

export function resolveSupportSeoText(
  candidates: Array<string | null | undefined>,
  fallback: string | null
): string | null {
  for (const candidate of candidates) {
    const normalized = normalizeSupportSeoText(candidate);

    if (normalized) {
      return normalized;
    }
  }

  return fallback;
}

export function resolveSupportArticleTitle(
  titleTemplate: string | null | undefined,
  articleTitle: string
): string {
  const normalizedTemplate = normalizeSupportSeoText(titleTemplate);

  if (!normalizedTemplate) {
    return articleTitle;
  }

  if (normalizedTemplate.includes('{title}')) {
    const resolved = normalizedTemplate.replace(/\{title\}/g, articleTitle).trim();
    return resolved || articleTitle;
  }

  return `${normalizedTemplate} | ${articleTitle}`;
}

export function resolveSupportArticleCanonicalPath(
  baseUrl: string | null | undefined,
  locale: string,
  slug: string,
  fallbackPath: string
): string {
  const normalizedBase = normalizeSupportCanonicalUrl(baseUrl);

  if (!normalizedBase) {
    return fallbackPath;
  }

  const suffix = `/${locale}/support/${slug}`;

  if (normalizedBase.startsWith('http://') || normalizedBase.startsWith('https://')) {
    try {
      const parsed = new URL(normalizedBase);
      const basePath = parsed.pathname.replace(/\/+$/, '');
      parsed.pathname = `${basePath}${suffix}`.replace(/\/{2,}/g, '/');
      parsed.hash = '';
      return parsed.toString();
    } catch {
      return fallbackPath;
    }
  }

  const basePath = normalizedBase.replace(/\/+$/, '');
  return `${basePath}${suffix}`.replace(/\/{2,}/g, '/');
}

function buildMessagesPath(locale: string): string {
  return path.join(process.cwd(), 'messages', `${locale}.json`);
}

async function readSupportMessages(locale: string): Promise<SupportMessagesShape> {
  const normalized = normalizeLocale(locale);

  try {
    const localizedRaw = await readFile(buildMessagesPath(normalized), 'utf8');
    return JSON.parse(localizedRaw) as SupportMessagesShape;
  } catch {
    const fallbackRaw = await readFile(buildMessagesPath(DEFAULT_LOCALE), 'utf8');
    return JSON.parse(fallbackRaw) as SupportMessagesShape;
  }
}

export async function getSupportSeoConfig(): Promise<SupportSeoConfig> {
  const keys = Array.from(
    new Set(Object.values(SUPPORT_SEO_CONFIG_KEYS).flat())
  );
  const rows = await prisma.cmsSeoConfig.findMany({
    where: { key: { in: keys } },
    select: { key: true, value: true },
  });

  const values = new Map<string, string>();

  for (const row of rows) {
    if (typeof row.key !== 'string' || typeof row.value !== 'string') {
      continue;
    }

    const normalized = row.value.trim();
    if (normalized.length > 0) {
      values.set(row.key, normalized);
    }
  }

  return {
    indexTitle: resolveSupportSeoText(
      SUPPORT_SEO_CONFIG_KEYS.indexTitle.map((key) => values.get(key)),
      null
    ),
    indexDescription: resolveSupportSeoText(
      SUPPORT_SEO_CONFIG_KEYS.indexDescription.map((key) => values.get(key)),
      null
    ),
    indexCanonicalUrl: normalizeSupportCanonicalUrl(
      values.get(SUPPORT_SEO_CONFIG_KEYS.indexCanonicalUrl[0]) ?? null
    ),
    articleTitleTemplate: resolveSupportSeoText(
      SUPPORT_SEO_CONFIG_KEYS.articleTitleTemplate.map((key) => values.get(key)),
      null
    ),
    articleDescriptionFallback: resolveSupportSeoText(
      SUPPORT_SEO_CONFIG_KEYS.articleDescriptionFallback.map((key) => values.get(key)),
      null
    ),
    articleCanonicalBaseUrl: normalizeSupportCanonicalUrl(
      values.get(SUPPORT_SEO_CONFIG_KEYS.articleCanonicalBaseUrl[0]) ?? null
    ),
  };
}

function buildStaticCardsFromMessages(
  messages: SupportMessagesShape
): SupportSymptomCard[] {
  const symptomItems = messages.Support?.symptoms ?? [];

  return FALLBACK_SYMPTOM_SLUGS.map((slug, index) => {
    const indexed = symptomItems[index];
    const matched = symptomItems.find((item) => item.id === slug);
    const source = matched ?? indexed;
    const title = source?.title?.trim() || slug;

    return {
      slug,
      title,
      shortAnswer: null,
      symptomLabel: null,
      sortOrder: index,
      source: 'static',
    };
  });
}

async function getPublishedSymptomCards(locale: string): Promise<SupportSymptomCard[]> {
  const normalized = normalizeLocale(locale);

  const rows = await prisma.cmsArticle.findMany({
    where: {
      locale: normalized,
      type: 'SYMPTOM',
      status: 'PUBLISHED',
      deletedAt: null,
    },
    select: {
      slug: true,
      title: true,
      shortAnswer: true,
      symptomLabel: true,
      sortOrder: true,
      updatedAt: true,
    },
    orderBy: [
      { sortOrder: 'asc' },
      { updatedAt: 'desc' },
    ],
  });

  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    shortAnswer: row.shortAnswer,
    symptomLabel: row.symptomLabel,
    sortOrder: row.sortOrder,
    source: 'cms' as const,
  }));
}

export async function getMergedSupportSymptomCards(
  locale: string
): Promise<SupportSymptomCard[]> {
  const normalized = normalizeLocale(locale);
  const [messages, cmsCards] = await Promise.all([
    readSupportMessages(normalized),
    getPublishedSymptomCards(normalized),
  ]);

  const staticCards = buildStaticCardsFromMessages(messages);
  const cmsBySlug = new Map(cmsCards.map((card) => [card.slug, card]));

  const merged = staticCards.map((staticCard) => {
    const cmsCard = cmsBySlug.get(staticCard.slug);
    return cmsCard ?? staticCard;
  });

  const extraCmsCards = cmsCards.filter(
    (card) => !FALLBACK_SYMPTOM_SLUGS.includes(card.slug as (typeof FALLBACK_SYMPTOM_SLUGS)[number])
  );

  return [...merged, ...extraCmsCards];
}

function buildStaticDetail(
  locale: string,
  slug: string,
  messages: SupportMessagesShape
): SupportArticleDetail | null {
  const symptomItems = messages.Support?.symptoms ?? [];
  const fallbackIndex = FALLBACK_SYMPTOM_SLUGS.findIndex((item) => item === slug);

  if (fallbackIndex < 0) {
    return null;
  }

  const matchedById = symptomItems.find((item) => item.id === slug);
  const indexed = symptomItems[fallbackIndex];
  const source = matchedById ?? indexed;
  const title = source?.title?.trim() || slug;
  const shortAnswer =
    messages.Support?.symptoms_desc?.trim() ||
    messages.Support?.hero_description?.trim() ||
    null;

  return {
    slug,
    locale: normalizeLocale(locale),
    title,
    symptomLabel: title,
    shortAnswer,
    content: shortAnswer || title,
    causes: [],
    safeChecks: [],
    urgentWarnings: [],
    serviceProcess: [],
    workScopeFactors: [],
    ctaLabel: messages.Support?.cta_primary?.trim() || null,
    ctaHref: '/#contact',
    seoTitle: normalizeSupportSeoText(title),
    seoDescription: normalizeSupportSeoText(shortAnswer),
    canonicalUrl: null,
    relatedSlugs: [],
    lastReviewedAt: null,
    source: 'static',
  };
}

export async function getSupportArticleDetail(
  locale: string,
  slug: string
): Promise<SupportArticleDetail | null> {
  const normalizedLocale = normalizeLocale(locale);
  const normalizedSlug = slug.trim().toLowerCase();

  const cmsArticle = await prisma.cmsArticle.findFirst({
    where: {
      locale: normalizedLocale,
      slug: normalizedSlug,
      type: 'SYMPTOM',
      status: 'PUBLISHED',
      deletedAt: null,
    },
    select: {
      slug: true,
      locale: true,
      title: true,
      symptomLabel: true,
      shortAnswer: true,
      content: true,
      causes: true,
      safeChecks: true,
      urgentWarnings: true,
      serviceProcess: true,
      workScopeFactors: true,
      ctaLabel: true,
      ctaHref: true,
      seoTitle: true,
      seoDescription: true,
      canonicalUrl: true,
      relatedSlugs: true,
      lastReviewedAt: true,
    },
  });

  if (cmsArticle) {
    return {
      slug: cmsArticle.slug,
      locale: cmsArticle.locale,
      title: cmsArticle.title,
      symptomLabel: cmsArticle.symptomLabel,
      shortAnswer: cmsArticle.shortAnswer,
      content: cmsArticle.content,
      causes: normalizeStringList(cmsArticle.causes),
      safeChecks: normalizeStringList(cmsArticle.safeChecks),
      urgentWarnings: normalizeStringList(cmsArticle.urgentWarnings),
      serviceProcess: normalizeStringList(cmsArticle.serviceProcess),
      workScopeFactors: normalizeStringList(cmsArticle.workScopeFactors),
      ctaLabel: cmsArticle.ctaLabel,
      ctaHref: cmsArticle.ctaHref,
      seoTitle: normalizeSupportSeoText(cmsArticle.seoTitle),
      seoDescription: normalizeSupportSeoText(cmsArticle.seoDescription),
      canonicalUrl: normalizeSupportCanonicalUrl(cmsArticle.canonicalUrl),
      relatedSlugs: normalizeStringList(cmsArticle.relatedSlugs),
      lastReviewedAt: cmsArticle.lastReviewedAt
        ? cmsArticle.lastReviewedAt.toISOString()
        : null,
      source: 'cms',
    };
  }

  const messages = await readSupportMessages(normalizedLocale);
  return buildStaticDetail(normalizedLocale, normalizedSlug, messages);
}
