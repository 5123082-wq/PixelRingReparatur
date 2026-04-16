import 'server-only';

import type {
  AdminRole,
  CmsArticleStatus,
  CmsArticleType,
  CmsRevisionSourceAction,
  Prisma,
  PrismaClient,
} from '@prisma/client';

type RevisionClient = PrismaClient | Prisma.TransactionClient;

const MAX_REASON_LENGTH = 1_000;
const DEFAULT_LIST_LIMIT = 30;
const MAX_LIST_LIMIT = 100;

const CMS_ARTICLE_TYPES: readonly CmsArticleType[] = [
  'SYMPTOM',
  'FAQ',
  'PAGE',
  'SERVICE',
  'CASE',
];

export type RevisionActor = {
  adminUserId?: string | null;
  sessionId?: string | null;
  role?: AdminRole | null;
};

export type CmsArticleSnapshotInput = {
  id: string;
  locale: string;
  type: CmsArticleType;
  status: CmsArticleStatus;
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
  publishedAt: Date | null;
  lastReviewedAt: Date | null;
};

export type CmsPageSnapshotInput = {
  id: string;
  pageKey: string;
  locale: string;
  status: CmsArticleStatus;
  title: string;
  blocks: Prisma.JsonValue;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  publishedAt: Date | null;
  lastReviewedAt: Date | null;
};

export type CmsArticleRevisionSnapshot = Omit<
  CmsArticleSnapshotInput,
  'id' | 'publishedAt' | 'lastReviewedAt'
> & {
  publishedAt: string | null;
  lastReviewedAt: string | null;
};

export type CmsPageRevisionSnapshot = Omit<
  CmsPageSnapshotInput,
  'id' | 'publishedAt' | 'lastReviewedAt'
> & {
  publishedAt: string | null;
  lastReviewedAt: string | null;
};

export type CmsArticleRevisionListItem = {
  id: string;
  sourceAction: CmsRevisionSourceAction;
  reason: string | null;
  actorAdminUserId: string | null;
  actorSessionId: string | null;
  actorRole: AdminRole | null;
  snapshot: Prisma.JsonValue;
  createdAt: Date;
};

export type CmsPageRevisionListItem = {
  id: string;
  sourceAction: CmsRevisionSourceAction;
  reason: string | null;
  actorAdminUserId: string | null;
  actorSessionId: string | null;
  actorRole: AdminRole | null;
  snapshot: Prisma.JsonValue;
  createdAt: Date;
};

function toIso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function normalizeReason(reason?: string | null): string | null {
  if (typeof reason !== 'string') {
    return null;
  }

  const trimmed = reason.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, MAX_REASON_LENGTH);
}

function normalizeTake(take: number | undefined): number {
  if (typeof take !== 'number' || !Number.isFinite(take)) {
    return DEFAULT_LIST_LIMIT;
  }

  return Math.min(Math.max(Math.trunc(take), 1), MAX_LIST_LIMIT);
}

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function asNullableString(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return typeof value === 'string' ? value : null;
}

function asDate(value: unknown): Date | null {
  if (typeof value !== 'string') {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    return null;
  }

  return value;
}

function asArticleType(value: unknown): CmsArticleType | null {
  if (typeof value !== 'string') {
    return null;
  }

  return CMS_ARTICLE_TYPES.includes(value as CmsArticleType)
    ? (value as CmsArticleType)
    : null;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(
    value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.getPrototypeOf(value) === Object.prototype
  );
}

function toInputJsonValue(value: unknown): Prisma.InputJsonValue | null {
  if (value === null) {
    return null;
  }

  if (typeof value === 'string' || typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (Array.isArray(value)) {
    const normalizedArray: Prisma.InputJsonValue[] = [];

    for (const item of value) {
      const normalized = toInputJsonValue(item);
      if (normalized === null) {
        return null;
      }
      normalizedArray.push(normalized);
    }

    return normalizedArray as Prisma.InputJsonArray;
  }

  if (isPlainObject(value)) {
    const normalizedObject: Record<string, Prisma.InputJsonValue> = {};

    for (const [key, item] of Object.entries(value)) {
      const normalized = toInputJsonValue(item);
      if (normalized === null) {
        return null;
      }
      normalizedObject[key] = normalized;
    }

    return normalizedObject as Prisma.InputJsonObject;
  }

  return null;
}

function normalizeActor(actor?: RevisionActor | null): RevisionActor {
  return {
    adminUserId: actor?.adminUserId ?? null,
    sessionId: actor?.sessionId ?? null,
    role: actor?.role ?? null,
  };
}

export function buildArticleRevisionSnapshotPayload(
  article: CmsArticleSnapshotInput
): CmsArticleRevisionSnapshot {
  return {
    locale: article.locale,
    type: article.type,
    status: article.status,
    slug: article.slug,
    title: article.title,
    symptomLabel: article.symptomLabel,
    shortAnswer: article.shortAnswer,
    content: article.content,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    canonicalUrl: article.canonicalUrl,
    relatedSlugs: article.relatedSlugs,
    causes: article.causes,
    safeChecks: article.safeChecks,
    urgentWarnings: article.urgentWarnings,
    serviceProcess: article.serviceProcess,
    workScopeFactors: article.workScopeFactors,
    ctaLabel: article.ctaLabel,
    ctaHref: article.ctaHref,
    sortOrder: article.sortOrder,
    publishedAt: toIso(article.publishedAt),
    lastReviewedAt: toIso(article.lastReviewedAt),
  };
}

export function buildPageRevisionSnapshotPayload(
  page: CmsPageSnapshotInput
): CmsPageRevisionSnapshot {
  return {
    pageKey: page.pageKey,
    locale: page.locale,
    status: page.status,
    title: page.title,
    blocks: page.blocks,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    canonicalUrl: page.canonicalUrl,
    publishedAt: toIso(page.publishedAt),
    lastReviewedAt: toIso(page.lastReviewedAt),
  };
}

export async function createArticleRevisionSnapshot(
  client: RevisionClient,
  article: CmsArticleSnapshotInput,
  options: {
    sourceAction: CmsRevisionSourceAction;
    actor?: RevisionActor | null;
    reason?: string | null;
  }
): Promise<void> {
  const actor = normalizeActor(options.actor);

  await client.cmsArticleRevision.create({
    data: {
      articleId: article.id,
      sourceAction: options.sourceAction,
      reason: normalizeReason(options.reason),
      actorAdminUserId: actor.adminUserId ?? null,
      actorSessionId: actor.sessionId ?? null,
      actorRole: actor.role ?? null,
      snapshot: buildArticleRevisionSnapshotPayload(article) as Prisma.InputJsonValue,
    },
  });
}

export async function createPageRevisionSnapshot(
  client: RevisionClient,
  page: CmsPageSnapshotInput,
  options: {
    sourceAction: CmsRevisionSourceAction;
    actor?: RevisionActor | null;
    reason?: string | null;
  }
): Promise<void> {
  const actor = normalizeActor(options.actor);

  await client.cmsPageRevision.create({
    data: {
      pageId: page.id,
      sourceAction: options.sourceAction,
      reason: normalizeReason(options.reason),
      actorAdminUserId: actor.adminUserId ?? null,
      actorSessionId: actor.sessionId ?? null,
      actorRole: actor.role ?? null,
      snapshot: buildPageRevisionSnapshotPayload(page) as Prisma.InputJsonValue,
    },
  });
}

export async function listArticleRevisions(
  client: RevisionClient,
  articleId: string,
  take?: number
): Promise<CmsArticleRevisionListItem[]> {
  return client.cmsArticleRevision.findMany({
    where: { articleId },
    orderBy: [{ createdAt: 'desc' }],
    take: normalizeTake(take),
    select: {
      id: true,
      sourceAction: true,
      reason: true,
      actorAdminUserId: true,
      actorSessionId: true,
      actorRole: true,
      snapshot: true,
      createdAt: true,
    },
  });
}

export async function listPageRevisions(
  client: RevisionClient,
  pageId: string,
  take?: number
): Promise<CmsPageRevisionListItem[]> {
  return client.cmsPageRevision.findMany({
    where: { pageId },
    orderBy: [{ createdAt: 'desc' }],
    take: normalizeTake(take),
    select: {
      id: true,
      sourceAction: true,
      reason: true,
      actorAdminUserId: true,
      actorSessionId: true,
      actorRole: true,
      snapshot: true,
      createdAt: true,
    },
  });
}

export function buildArticleRestoreDataFromSnapshot(
  snapshot: unknown
): Prisma.CmsArticleUpdateInput | null {
  if (!isPlainObject(snapshot)) {
    return null;
  }

  const locale = asString(snapshot.locale);
  const type = asArticleType(snapshot.type);
  const slug = asString(snapshot.slug);
  const title = asString(snapshot.title);
  const content = asString(snapshot.content);
  const sortOrder =
    typeof snapshot.sortOrder === 'number' && Number.isFinite(snapshot.sortOrder)
      ? Math.trunc(snapshot.sortOrder)
      : null;
  const relatedSlugs = asStringArray(snapshot.relatedSlugs);
  const causes = asStringArray(snapshot.causes);
  const safeChecks = asStringArray(snapshot.safeChecks);
  const urgentWarnings = asStringArray(snapshot.urgentWarnings);
  const serviceProcess = asStringArray(snapshot.serviceProcess);
  const workScopeFactors = asStringArray(snapshot.workScopeFactors);

  if (
    !locale ||
    !type ||
    !slug ||
    !title ||
    !content ||
    sortOrder === null ||
    !relatedSlugs ||
    !causes ||
    !safeChecks ||
    !urgentWarnings ||
    !serviceProcess ||
    !workScopeFactors
  ) {
    return null;
  }

  return {
    locale,
    type,
    status: 'DRAFT',
    slug,
    title,
    symptomLabel: asNullableString(snapshot.symptomLabel),
    shortAnswer: asNullableString(snapshot.shortAnswer),
    content,
    seoTitle: asNullableString(snapshot.seoTitle),
    seoDescription: asNullableString(snapshot.seoDescription),
    canonicalUrl: asNullableString(snapshot.canonicalUrl),
    relatedSlugs,
    causes,
    safeChecks,
    urgentWarnings,
    serviceProcess,
    workScopeFactors,
    ctaLabel: asNullableString(snapshot.ctaLabel),
    ctaHref: asNullableString(snapshot.ctaHref),
    sortOrder,
    publishedAt: null,
    lastReviewedAt: asDate(snapshot.lastReviewedAt),
    deletedAt: null,
  };
}

export function buildPageRestoreDataFromSnapshot(
  snapshot: unknown
): Prisma.CmsPageUpdateInput | null {
  if (!isPlainObject(snapshot)) {
    return null;
  }

  const pageKey = asString(snapshot.pageKey);
  const locale = asString(snapshot.locale);
  const title = asString(snapshot.title);
  const blocks = toInputJsonValue(snapshot.blocks);

  if (!pageKey || !locale || !title || blocks === null) {
    return null;
  }

  return {
    pageKey,
    locale,
    status: 'DRAFT',
    title,
    blocks,
    seoTitle: asNullableString(snapshot.seoTitle),
    seoDescription: asNullableString(snapshot.seoDescription),
    canonicalUrl: asNullableString(snapshot.canonicalUrl),
    publishedAt: null,
    lastReviewedAt: asDate(snapshot.lastReviewedAt),
    deletedAt: null,
  };
}
