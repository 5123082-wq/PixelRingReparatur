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
const MAX_TEXT_LENGTH = 50_000;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isUuidLike(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i.test(
    value
  );
}

function notFoundResponse() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

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

function parseInteger(value: unknown): number | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.trunc(parsed);
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

const ARTICLE_AUDIT_FIELDS = [
  'locale',
  'type',
  'status',
  'slug',
  'title',
  'symptomLabel',
  'shortAnswer',
  'content',
  'seoTitle',
  'seoDescription',
  'canonicalUrl',
  'relatedSlugs',
  'causes',
  'safeChecks',
  'urgentWarnings',
  'serviceProcess',
  'workScopeFactors',
  'ctaLabel',
  'ctaHref',
  'sortOrder',
  'publishedAt',
] as const;

function valuesEqual(left: unknown, right: unknown): boolean {
  if (left instanceof Date || right instanceof Date) {
    const leftTime = left instanceof Date ? left.getTime() : null;
    const rightTime = right instanceof Date ? right.getTime() : null;
    return leftTime === rightTime;
  }

  if (Array.isArray(left) || Array.isArray(right)) {
    return JSON.stringify(left ?? []) === JSON.stringify(right ?? []);
  }

  return Object.is(left, right);
}

function getChangedArticleFields(
  current: ArticleQueryRecord,
  nextValues: Record<string, unknown>
): string[] {
  return ARTICLE_AUDIT_FIELDS.filter(
    (field) => field in nextValues && !valuesEqual(current[field], nextValues[field])
  );
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

function parsePayload(body: Record<string, unknown>) {
  const locale = body.locale === undefined ? undefined : normalizeLocale(body.locale);
  const type = body.type === undefined ? undefined : normalizeEnumValue(body.type, ARTICLE_TYPES, 'SYMPTOM');
  const status = body.status === undefined
    ? undefined
    : normalizeEnumValue(body.status, ARTICLE_STATUSES, 'DRAFT');
  const slug = body.slug === undefined ? undefined : normalizeSlug(body.slug);
  const title = body.title === undefined ? undefined : normalizeText(body.title, { maxLength: 180 });
  const symptomLabel =
    body.symptomLabel === undefined ? undefined : normalizeText(body.symptomLabel, { maxLength: 180 });
  const shortAnswer =
    body.shortAnswer === undefined
      ? undefined
      : normalizeText(body.shortAnswer, { maxLength: 4000 });
  const content =
    body.content === undefined ? undefined : normalizeText(body.content, { maxLength: MAX_TEXT_LENGTH });
  const seoTitle =
    body.seoTitle === undefined ? undefined : normalizeText(body.seoTitle, { maxLength: 180 });
  const seoDescription =
    body.seoDescription === undefined
      ? undefined
      : normalizeText(body.seoDescription, { maxLength: 500 });
  const canonicalUrl =
    body.canonicalUrl === undefined ? undefined : normalizeLink(body.canonicalUrl);
  const relatedSlugs =
    body.relatedSlugs === undefined ? undefined : normalizeTextArray(body.relatedSlugs);
  const causes = body.causes === undefined ? undefined : normalizeTextArray(body.causes);
  const safeChecks = body.safeChecks === undefined ? undefined : normalizeTextArray(body.safeChecks);
  const urgentWarnings =
    body.urgentWarnings === undefined ? undefined : normalizeTextArray(body.urgentWarnings);
  const serviceProcess =
    body.serviceProcess === undefined ? undefined : normalizeTextArray(body.serviceProcess);
  const workScopeFactors =
    body.workScopeFactors === undefined ? undefined : normalizeTextArray(body.workScopeFactors);
  const ctaLabel = body.ctaLabel === undefined ? undefined : normalizeText(body.ctaLabel, { maxLength: 120 });
  const ctaHref = body.ctaHref === undefined ? undefined : normalizeLink(body.ctaHref);
  const sortOrder = body.sortOrder === undefined ? undefined : parseInteger(body.sortOrder);

  return {
    locale,
    type,
    status,
    slug,
    title,
    symptomLabel,
    shortAnswer,
    content,
    seoTitle,
    seoDescription,
    canonicalUrl,
    relatedSlugs,
    causes,
    safeChecks,
    urgentWarnings,
    serviceProcess,
    workScopeFactors,
    ctaLabel,
    ctaHref,
    sortOrder,
  };
}

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!(await requireOwnerActor(request))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { id } = await params;

    if (!isUuidLike(id)) {
      return notFoundResponse();
    }

    const article = await prisma.cmsArticle.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: ARTICLE_SELECT,
    });

    if (!article) {
      return notFoundResponse();
    }

    return NextResponse.json({ article: serializeArticle(article) });
  } catch (error) {
    console.error('API Error /api/cms/articles/[id] (GET):', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requireOwnerActor(request);

  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { id } = await params;

    if (!isUuidLike(id)) {
      return notFoundResponse();
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

    if (!body) {
      return NextResponse.json({ error: 'Invalid article payload' }, { status: 400 });
    }

    const current = await prisma.cmsArticle.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: ARTICLE_SELECT,
    });

    if (!current) {
      return notFoundResponse();
    }

    const parsed = parsePayload(body);
    const updates: Record<string, unknown> = {};
    let hasValidField = false;
    const strictFields = new Set(['locale', 'type', 'status', 'slug', 'title', 'content', 'sortOrder']);
    const arrayFields = new Set([
      'relatedSlugs',
      'causes',
      'safeChecks',
      'urgentWarnings',
      'serviceProcess',
      'workScopeFactors',
    ]);

    for (const [key, value] of Object.entries(parsed)) {
      if (value === undefined) {
        continue;
      }

      if (
        key === 'locale' ||
        key === 'type' ||
        key === 'status' ||
        key === 'slug' ||
        key === 'title' ||
        key === 'symptomLabel' ||
        key === 'shortAnswer' ||
        key === 'content' ||
        key === 'seoTitle' ||
        key === 'seoDescription' ||
        key === 'canonicalUrl' ||
        key === 'relatedSlugs' ||
        key === 'causes' ||
        key === 'safeChecks' ||
        key === 'urgentWarnings' ||
        key === 'serviceProcess' ||
        key === 'workScopeFactors' ||
        key === 'ctaLabel' ||
        key === 'ctaHref' ||
        key === 'sortOrder'
      ) {
        if (value === null && strictFields.has(key)) {
          return NextResponse.json({ error: 'Invalid article payload' }, { status: 400 });
        }

        if (value === null && arrayFields.has(key)) {
          updates[key] = [];
        } else {
          updates[key] = value;
        }
        hasValidField = true;
      }
    }

    if (!hasValidField) {
      return NextResponse.json({ error: 'No valid article fields provided' }, { status: 400 });
    }

    const nextLocale = typeof updates.locale === 'string' ? updates.locale : String(current.locale ?? 'de');
    const nextSlug = typeof updates.slug === 'string' ? updates.slug : String(current.slug);

    if (updates.locale !== undefined || updates.slug !== undefined) {
      const conflict = await prisma.cmsArticle.findFirst({
        where: {
          id: { not: id },
          locale: nextLocale,
          slug: nextSlug,
        },
        select: { id: true },
      });

      if (conflict) {
        return NextResponse.json(
          { error: 'Article slug already exists for locale' },
          { status: 409 }
        );
      }
    }

    const nextStatus = (typeof updates.status === 'string' ? updates.status : current.status) as ArticleStatus;
    const nextValues: Record<string, unknown> = { ...updates };

    if (nextStatus === 'PUBLISHED' && current.publishedAt === null) {
      nextValues.publishedAt = new Date();
      updates.publishedAt = nextValues.publishedAt;
    }

    const changedFields = getChangedArticleFields(current, nextValues);
    const previousStatus = current.status as ArticleStatus;
    const auditAction =
      previousStatus === 'DRAFT' && nextStatus === 'PUBLISHED'
        ? 'CMS_ARTICLE_PUBLISHED'
        : previousStatus === 'PUBLISHED' && nextStatus === 'DRAFT'
          ? 'CMS_ARTICLE_UNPUBLISHED'
          : 'CMS_ARTICLE_UPDATED';

    const article = await prisma.$transaction(async (tx) => {
      const updatedArticle = await tx.cmsArticle.update({
        where: { id },
        data: updates,
        select: ARTICLE_SELECT,
      });

      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId,
        actorRole: actor.role,
        action: auditAction,
        resourceType: 'CMS_ARTICLE',
        resourceId: updatedArticle.id,
        details: {
          locale: updatedArticle.locale,
          slug: updatedArticle.slug,
          type: updatedArticle.type,
          changedFields,
          previousStatus,
          nextStatus: updatedArticle.status,
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      });

      return updatedArticle;
    });

    return NextResponse.json({ success: true, article: serializeArticle(article) });
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return NextResponse.json(
        { error: 'Article slug already exists for locale' },
        { status: 409 }
      );
    }

    console.error('API Error /api/cms/articles/[id] (PATCH):', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requireOwnerActor(request);

  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { id } = await params;

    if (!isUuidLike(id)) {
      return notFoundResponse();
    }

    const current = await prisma.cmsArticle.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        locale: true,
        slug: true,
        status: true,
      },
    });

    if (!current) {
      return notFoundResponse();
    }

    await prisma.$transaction(async (tx) => {
      await tx.cmsArticle.update({
        where: { id },
        data: { deletedAt: new Date() },
        select: { id: true },
      });

      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId,
        actorRole: actor.role,
        action: 'CMS_ARTICLE_DELETED',
        resourceType: 'CMS_ARTICLE',
        resourceId: id,
        details: {
          locale: current.locale,
          slug: current.slug,
          status: current.status,
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error /api/cms/articles/[id] (DELETE):', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
