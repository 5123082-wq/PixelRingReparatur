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

export type CmsLinkItem = {
  label: string;
  href: string;
};

export type GlobalHeaderCmsContent = {
  servicePill?: string;
  bookLabel?: string;
  links?: CmsLinkItem[];
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
  steps?: { title?: string; description?: string }[];
};

export type TrustCmsContent = {
  titleStart?: string;
  titleAccent?: string;
  titleEnd?: string;
  description?: string;
  stats?: { value?: string; label?: string; description?: string }[];
  features?: { icon?: string; label?: string }[];
};

export type CoverageMapCmsContent = {
  title?: string;
  description?: string;
};

export type ExcellenceCmsContent = {
  title?: string;
  subtitle?: string;
  items?: { title?: string; tag?: string; description?: string; image?: string }[];
};

export type ReviewCmsContent = {
  title?: string;
  subtitle?: string;
  items?: { content?: string; name?: string; role?: string }[];
};

export type RoadmapCmsContent = {
  title?: string;
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

export type SupportHeroCmsContent = {
  title?: string;
  intro?: string;
};

export type SupportUrgentCmsContent = {
  badge?: string;
  title?: string;
  intro?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
};

export type ProblemCategoryCmsContent = {
  title?: string;
};

export type SymptomCmsContent = {
  title?: string;
  description?: string;
  allArticlesLabel?: string;
  internalLinksTitle?: string;
};

export type SupportPageCmsContent = {
  hero?: SupportHeroCmsContent;
  urgent?: SupportUrgentCmsContent;
  categories?: ProblemCategoryCmsContent;
  symptoms?: SymptomCmsContent;
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

function getBlockObjectList(
  block: CmsPageBlock,
  field: string
): Record<string, unknown>[] | undefined {
  const value = block[field];

  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value.reduce<Record<string, unknown>[]>((acc, item) => {
    if (isPlainObject(item)) {
      acc.push(item);
    }

    return acc;
  }, []);
  return items.length > 0 ? items : undefined;
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

function getEnabledBlock(
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
        block.enabled !== false &&
        block.type === type &&
        keys.includes(block.key)
    ) ?? null
  );
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
          links: getLinkItems(navigation, 'links'),
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
            supportLinks: footerSupport ? getLinkItems(footerSupport, 'items') : undefined,
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
  const coverage = getEnabledBlock(page, 'textSection', ['coverageSection']);
  const excellence = getEnabledBlock(page, 'cardList', ['excellenceSection']);
  const reviews = getEnabledBlock(page, 'reviewList', ['reviewsSection']);
  const roadmap = getEnabledBlock(page, 'cardList', ['roadmapSection']);
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
          })),
        }
      : undefined,
    trust: trust
      ? {
          titleStart: getBlockText(trust, 'titleStart'),
          titleAccent: getBlockText(trust, 'titleAccent'),
          titleEnd: getBlockText(trust, 'titleEnd'),
          description: getBlockText(trust, 'description'),
          stats: getBlockObjectList(trust, 'stats')?.map(s => ({
            value: typeof s.value === 'string' ? s.value : undefined,
            label: typeof s.label === 'string' ? s.label : undefined,
            description: typeof s.description === 'string' ? s.description : undefined,
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
    roadmap: roadmap
      ? {
          title: getBlockText(roadmap, 'title'),
          steps: getBlockObjectList(roadmap, 'steps')?.map(s => ({
            title: typeof s.title === 'string' ? s.title : undefined,
            description: typeof s.description === 'string' ? s.description : undefined,
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

  const hasHeroContent = Object.values(content.hero ?? {}).some(Boolean);
  const hasIntakeContent =
    Boolean(content.intake?.title) ||
    Boolean(content.intake?.description) ||
    Boolean(content.intake?.methods?.length);
  const hasBento = Boolean(content.bento?.title);
  const hasTrust = Boolean(content.trust?.titleStart);
  const hasCoverage = Boolean(content.coverage?.title);
  const hasExcellence = Boolean(content.excellence?.title);
  const hasReviews = Boolean(content.reviews?.title);
  const hasRoadmap = Boolean(content.roadmap?.title);
  const hasFaq = Boolean(content.faq?.title);

  return hasHeroContent || hasIntakeContent || hasBento || hasTrust || hasCoverage || hasExcellence || hasReviews || hasRoadmap || hasFaq ? content : null;
}

export async function getSupportPageCmsContent(
  locale: string
): Promise<SupportPageCmsContent | null> {
  const page = await getPublishedCmsPage('support', locale);
  const hero = getEnabledBlock(page, 'hero', ['hero']);
  const urgent = getEnabledBlock(page, 'cta', ['urgentCases']);
  const categories = getEnabledBlock(page, 'cardList', ['categoriesSection']);
  const symptoms = getEnabledBlock(page, 'textSection', ['symptomsSection', 'symptomsIntro']);

  const content: SupportPageCmsContent = {
    hero: hero
      ? {
          title: getBlockText(hero, 'title'),
          intro: getBlockText(hero, 'intro') ?? getBlockText(hero, 'subtitle'),
        }
      : undefined,
    urgent: urgent
      ? {
          badge: getBlockText(urgent, 'badge'),
          title: getBlockText(urgent, 'title'),
          intro: getBlockText(urgent, 'intro') ?? getBlockText(urgent, 'description'),
          primaryLabel: getBlockText(urgent, 'primaryLabel'),
          primaryHref: getBlockText(urgent, 'primaryHref'),
          secondaryLabel: getBlockText(urgent, 'secondaryLabel'),
        }
      : undefined,
    categories: categories
      ? {
          title: getBlockText(categories, 'title'),
        }
      : undefined,
    symptoms: symptoms
      ? {
          title: getBlockText(symptoms, 'title'),
          description: getBlockText(symptoms, 'description') ?? getBlockText(symptoms, 'desc'),
          allArticlesLabel: getBlockText(symptoms, 'allArticlesLabel'),
          internalLinksTitle: getBlockText(symptoms, 'internalLinksTitle'),
        }
      : undefined,
  };

  return Object.values(content).some(Boolean) ? content : null;
}
