import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import {
  CMS_SESSION_COOKIE_NAME,
} from '@/lib/admin-auth';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import {
  createAdminAuditLog,
  requireAdminActor,
  type AdminRequestActor,
} from '@/lib/admin-audit';

const SUPPORTED_LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'] as const;
const ARTICLE_TYPES = ['SYMPTOM', 'FAQ', 'PAGE', 'SERVICE', 'CASE'] as const;
const ARTICLE_STATUSES = ['DRAFT', 'PUBLISHED'] as const;
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;
const MAX_SEARCH_LENGTH = 200;
const MAX_TEXT_LENGTH = 50_000;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type ArticleType = (typeof ARTICLE_TYPES)[number];
type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

type ArticleQueryRecord = Record<string, unknown>;

type ArticleResponse = {
  id: string;
  locale: string;
  type: ArticleType;
  status: ArticleStatus;
  slug: string;
  title: string;
  symptomLabel: string | null;
  shortAnswer: string | null;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  relatedSlugs: string[];
  causes: string[];
  safeChecks: string[];
  urgentWarnings: string[];
  serviceProcess: string[];
  workScopeFactors: string[];
  ctaLabel: string | null;
  ctaHref: string | null;
  sortOrder: number;
  publishedAt: string | null;
  lastReviewedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const ARTICLE_SELECT = {
  id: true,
  locale: true,
  type: true,
  status: true,
  slug: true,
  title: true,
  symptomLabel: true,
  shortAnswer: true,
  content: true,
  seoTitle: true,
  seoDescription: true,
  canonicalUrl: true,
  relatedSlugs: true,
  causes: true,
  safeChecks: true,
  urgentWarnings: true,
  serviceProcess: true,
  workScopeFactors: true,
  ctaLabel: true,
  ctaHref: true,
  sortOrder: true,
  publishedAt: true,
  lastReviewedAt: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

function isSupportedLocale(value: string): value is (typeof SUPPORTED_LOCALES)[number] {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

function normalizeLocale(value: unknown): string | null {
  if (value === undefined) {
    return 'de';
  }

  if (value === null || typeof value !== 'string') {
    return null;
  }

  const locale = value.trim();
  if (!locale) {
    return null;
  }

  return isSupportedLocale(locale) ? locale : null;
}

function normalizeSlug(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const slug = value.trim().toLowerCase();
  if (!slug || !SLUG_REGEX.test(slug)) {
    return null;
  }

  return slug;
}

function normalizeEnumValue<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T
): T | null {
  if (value === undefined) {
    return fallback;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'string') {
    const normalized = value.trim();

    if (allowed.includes(normalized as T)) {
      return normalized as T;
    }
  }

  if (value === '') {
    return fallback;
  }

  return null;
}

function normalizeText(
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

  const text = value.trim();

  if (!text) {
    return options.allowEmpty ? '' : fallback;
  }

  if (options.maxLength && text.length > options.maxLength) {
    return null;
  }

  return text;
}

function normalizeTextArray(value: unknown): string[] | null {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const items = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0)
    .map((item) => item.slice(0, 200));

  return items.slice(0, 50);
}

function parseInteger(value: unknown, fallback: number): number | null {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.trunc(parsed);
}

function parseBoolean(value: unknown): boolean | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }

  return null;
}

function normalizeLink(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const href = value.trim();
  if (!href) {
    return null;
  }

  if (href.startsWith('//')) {
    return null;
  }

  if (href.startsWith('/')) {
    return href;
  }

  try {
    const url = new URL(href);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return href;
  } catch {
    return null;
  }
}

function isPrismaUniqueError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002'
  );
}

async function requireOwnerActor(
  request: NextRequest
): Promise<AdminRequestActor | null> {
  return requireAdminActor(prisma, request, CMS_SESSION_COOKIE_NAME, ['OWNER']);
}

function serializeArticle(article: ArticleQueryRecord): ArticleResponse {
  const toIso = (value: unknown): string | null =>
    value instanceof Date
      ? value.toISOString()
      : typeof value === 'string'
        ? value
        : null;

  const getStringArray = (value: unknown): string[] =>
    Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string')
      : [];

  const type = normalizeEnumValue(article.type, ARTICLE_TYPES, 'SYMPTOM') ?? 'SYMPTOM';
  const status = normalizeEnumValue(article.status, ARTICLE_STATUSES, 'DRAFT') ?? 'DRAFT';

  return {
    id: String(article.id),
    locale: String(article.locale ?? 'de'),
    type,
    status,
    slug: String(article.slug),
    title: String(article.title),
    symptomLabel: typeof article.symptomLabel === 'string' ? article.symptomLabel : null,
    shortAnswer: typeof article.shortAnswer === 'string' ? article.shortAnswer : null,
    content: String(article.content ?? ''),
    seoTitle: typeof article.seoTitle === 'string' ? article.seoTitle : null,
    seoDescription: typeof article.seoDescription === 'string' ? article.seoDescription : null,
    canonicalUrl: typeof article.canonicalUrl === 'string' ? article.canonicalUrl : null,
    relatedSlugs: getStringArray(article.relatedSlugs),
    causes: getStringArray(article.causes),
    safeChecks: getStringArray(article.safeChecks),
    urgentWarnings: getStringArray(article.urgentWarnings),
    serviceProcess: getStringArray(article.serviceProcess),
    workScopeFactors: getStringArray(article.workScopeFactors),
    ctaLabel: typeof article.ctaLabel === 'string' ? article.ctaLabel : null,
    ctaHref: typeof article.ctaHref === 'string' ? article.ctaHref : null,
    sortOrder:
      typeof article.sortOrder === 'number'
        ? article.sortOrder
        : Number(article.sortOrder ?? 0) || 0,
    publishedAt: toIso(article.publishedAt),
    lastReviewedAt: toIso(article.lastReviewedAt),
    deletedAt: toIso(article.deletedAt),
    createdAt: toIso(article.createdAt) ?? new Date(0).toISOString(),
    updatedAt: toIso(article.updatedAt) ?? new Date(0).toISOString(),
  };
}

function buildArticleWhere(searchParams: URLSearchParams) {
  const locale = normalizeLocale(searchParams.get('locale')) ?? 'de';
  const type = normalizeEnumValue(searchParams.get('type'), ARTICLE_TYPES, 'SYMPTOM');
  const status = normalizeEnumValue(searchParams.get('status'), ARTICLE_STATUSES, 'DRAFT');
  const slug = normalizeSlug(searchParams.get('slug'));
  const search = normalizeText(searchParams.get('search'), {
    maxLength: MAX_SEARCH_LENGTH,
  });
  const publicOnly = parseBoolean(searchParams.get('publicOnly'));

  if (searchParams.has('slug') && searchParams.get('slug')?.trim() && slug === null) {
    return { error: 'Invalid article query parameters' } as const;
  }

  const where: Record<string, unknown> = {
    deletedAt: null,
    locale,
  };

  if (searchParams.has('type') && searchParams.get('type')?.trim()) {
    where.type = type;
  }

  if (searchParams.has('status') && searchParams.get('status')?.trim()) {
    where.status = status;
  } else if (publicOnly) {
    where.status = 'PUBLISHED';
  }

  if (slug) {
    where.slug = slug;
  }

  if (search) {
    where.OR = [
      { slug: { contains: search, mode: 'insensitive' } },
      { title: { contains: search, mode: 'insensitive' } },
      { symptomLabel: { contains: search, mode: 'insensitive' } },
      { shortAnswer: { contains: search, mode: 'insensitive' } },
    ];
  }

  return { where, locale, type: type ?? 'SYMPTOM', status: status ?? 'DRAFT' } as const;
}

export async function GET(request: NextRequest) {
  if (!(await requireOwnerActor(request))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const whereResult = buildArticleWhere(searchParams);

    if ('error' in whereResult) {
      return NextResponse.json({ error: whereResult.error }, { status: 400 });
    }

    const page = Math.max(1, parseInteger(searchParams.get('page'), 1) ?? 1);
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInteger(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE) ?? DEFAULT_PAGE_SIZE)
    );

    const [articles, total] = await Promise.all([
      prisma.cmsArticle.findMany({
        where: whereResult.where,
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: ARTICLE_SELECT,
      }),
      prisma.cmsArticle.count({ where: whereResult.where }),
    ]);

    return NextResponse.json({
      articles: articles.map(serializeArticle),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('API Error /api/cms/articles (GET):', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requireOwnerActor(request);

  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

    if (!body) {
      return NextResponse.json({ error: 'Invalid article payload' }, { status: 400 });
    }

    const locale = normalizeLocale(body.locale);
    const type = normalizeEnumValue(body.type, ARTICLE_TYPES, 'SYMPTOM');
    const status = normalizeEnumValue(body.status, ARTICLE_STATUSES, 'DRAFT');
    const slug = normalizeSlug(body.slug);
    const title = normalizeText(body.title, { maxLength: 180 });
    const symptomLabel = normalizeText(body.symptomLabel, { maxLength: 180 });
    const shortAnswer = normalizeText(body.shortAnswer, {
      maxLength: 4000,
      fallback: null,
    });
    const content = normalizeText(body.content, {
      maxLength: MAX_TEXT_LENGTH,
    });
    const seoTitle = normalizeText(body.seoTitle, { maxLength: 180 });
    const seoDescription = normalizeText(body.seoDescription, {
      maxLength: 500,
    });
    const canonicalUrl = body.canonicalUrl === undefined ? null : normalizeLink(body.canonicalUrl);
    const relatedSlugs = normalizeTextArray(body.relatedSlugs);
    const causes = normalizeTextArray(body.causes);
    const safeChecks = normalizeTextArray(body.safeChecks);
    const urgentWarnings = normalizeTextArray(body.urgentWarnings);
    const serviceProcess = normalizeTextArray(body.serviceProcess);
    const workScopeFactors = normalizeTextArray(body.workScopeFactors);
    const ctaLabel = normalizeText(body.ctaLabel, { maxLength: 120 });
    const ctaHref = body.ctaHref === undefined ? null : normalizeLink(body.ctaHref);
    const sortOrder = parseInteger(body.sortOrder, 0);

    const arrayValues = {
      relatedSlugs,
      causes,
      safeChecks,
      urgentWarnings,
      serviceProcess,
      workScopeFactors,
    };

    if (
      locale === null ||
      type === null ||
      status === null ||
      slug === null ||
      title === null ||
      content === null ||
      sortOrder === null ||
      (body.canonicalUrl !== undefined && canonicalUrl === null) ||
      (body.ctaHref !== undefined && ctaHref === null) ||
      Object.values(arrayValues).some((value) => value === null)
    ) {
      return NextResponse.json({ error: 'Invalid article payload' }, { status: 400 });
    }

    const now = new Date();
    const publishedAt = status === 'PUBLISHED' ? now : null;

    const article = await prisma.$transaction(async (tx) => {
      const articleModel = tx.cmsArticle;
      const existing = await articleModel.findFirst({
        where: {
          locale,
          slug,
        },
        select: { id: true },
      });

      if (existing) {
        return null;
      }

      const createdArticle = await articleModel.create({
        data: {
          locale,
          type,
          status,
          slug,
          title,
          symptomLabel: symptomLabel ?? title,
          shortAnswer,
          content,
          seoTitle,
          seoDescription,
          canonicalUrl,
          relatedSlugs: relatedSlugs ?? undefined,
          causes: causes ?? undefined,
          safeChecks: safeChecks ?? undefined,
          urgentWarnings: urgentWarnings ?? undefined,
          serviceProcess: serviceProcess ?? undefined,
          workScopeFactors: workScopeFactors ?? undefined,
          ctaLabel,
          ctaHref,
          sortOrder,
          publishedAt,
          deletedAt: null,
        },
        select: ARTICLE_SELECT,
      });

      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId,
        actorAdminUserId: actor.adminUserId,
        actorRole: actor.role,
        action: 'CMS_ARTICLE_CREATED',
        resourceType: 'CMS_ARTICLE',
        resourceId: createdArticle.id,
        details: {
          locale: createdArticle.locale,
          slug: createdArticle.slug,
          type: createdArticle.type,
          status: createdArticle.status,
          publishedAtPresent: Boolean(createdArticle.publishedAt),
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      });

      return createdArticle;
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article slug already exists for locale' },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, article: serializeArticle(article) }, { status: 201 });
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return NextResponse.json(
        { error: 'Article slug already exists for locale' },
        { status: 409 }
      );
    }

    console.error('API Error /api/cms/articles (POST):', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
