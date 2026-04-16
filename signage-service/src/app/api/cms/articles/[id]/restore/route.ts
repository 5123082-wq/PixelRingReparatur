import { NextRequest, NextResponse } from 'next/server';

import { CMS_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import { createAdminAuditLog, requireAdminPermissionActor } from '@/lib/admin-audit';
import {
  buildArticleRestoreDataFromSnapshot,
  createArticleRevisionSnapshot,
} from '@/lib/cms/revisions';
import { prisma } from '@/lib/prisma';
import { isUuidLike, resolveUuidRouteParam } from '@/lib/route-params';

type RouteParams = {
  params: Promise<{ id: string }>;
};

type ArticleQueryRecord = Record<string, unknown>;

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

function notFoundResponse() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

function normalizeReason(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const reason = value.trim();
  if (!reason) {
    return null;
  }

  return reason.slice(0, 1_000);
}

function serializeArticle(article: ArticleQueryRecord) {
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

  return {
    id: String(article.id),
    locale: String(article.locale ?? 'de'),
    type: String(article.type ?? 'SYMPTOM'),
    status: String(article.status ?? 'DRAFT'),
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

export async function POST(request: NextRequest, { params }: RouteParams) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requireAdminPermissionActor(
    prisma,
    request,
    CMS_SESSION_COOKIE_NAME,
    ['CMS_ARTICLE_RESTORE']
  );

  if (!actor) {
    return notFoundResponse();
  }

  try {
    const id = await resolveUuidRouteParam(request, params);

    if (!id) {
      return notFoundResponse();
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

    if (!body || !isUuidLike(String(body.revisionId ?? ''))) {
      return NextResponse.json({ error: 'Invalid restore payload' }, { status: 400 });
    }

    const revisionId = String(body.revisionId);
    const reason = normalizeReason(body.reason);

    if (!reason) {
      return NextResponse.json({ error: 'Restore reason is required' }, { status: 400 });
    }

    const restored = await prisma.$transaction(async (tx) => {
      const current = await tx.cmsArticle.findFirst({
        where: { id, deletedAt: null },
        select: ARTICLE_SELECT,
      });

      if (!current) {
        return null;
      }

      const revision = await tx.cmsArticleRevision.findFirst({
        where: { id: revisionId, articleId: id },
        select: { id: true, snapshot: true },
      });

      if (!revision) {
        return null;
      }

      const restoreData = buildArticleRestoreDataFromSnapshot(revision.snapshot);
      if (!restoreData) {
        throw new Error('INVALID_ARTICLE_REVISION_SNAPSHOT');
      }

      await createArticleRevisionSnapshot(tx, current, {
        sourceAction: 'RESTORE',
        reason,
        actor: {
          adminUserId: actor.adminUserId,
          sessionId: actor.sessionId,
          role: actor.role,
        },
      });

      const updatedArticle = await tx.cmsArticle.update({
        where: { id },
        data: restoreData,
        select: ARTICLE_SELECT,
      });

      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId,
        actorAdminUserId: actor.adminUserId,
        actorRole: actor.role,
        action: 'CMS_ARTICLE_RESTORED',
        resourceType: 'CMS_ARTICLE',
        resourceId: id,
        reason,
        details: {
          revisionId,
          previousStatus: current.status,
          nextStatus: updatedArticle.status,
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      });

      return updatedArticle;
    });

    if (!restored) {
      return notFoundResponse();
    }

    return NextResponse.json({
      success: true,
      article: serializeArticle(restored),
      restoredFromRevisionId: revisionId,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'INVALID_ARTICLE_REVISION_SNAPSHOT'
    ) {
      return NextResponse.json({ error: 'Revision snapshot is invalid' }, { status: 400 });
    }

    console.error('API Error /api/cms/articles/[id]/restore (POST):', error);
    return NextResponse.json({ error: 'Failed to restore article revision' }, { status: 500 });
  }
}
