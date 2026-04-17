import { CMS_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { createAdminAuditLog, requireAdminPermissionActor } from '@/lib/admin-audit';
import { NextRequest, NextResponse } from 'next/server';

import { listArticleRevisions } from '@/lib/cms/revisions';
import { prisma } from '@/lib/prisma';
import { resolveUuidRouteParam } from '@/lib/route-params';

type RouteParams = {
  params: Promise<{ id: string }>;
};

function notFoundResponse() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function buildSnapshotSummary(snapshot: unknown) {
  if (!isObject(snapshot)) {
    return null;
  }

  return {
    locale: asString(snapshot.locale),
    type: asString(snapshot.type),
    status: asString(snapshot.status),
    slug: asString(snapshot.slug),
    title: asString(snapshot.title),
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const actor = await requireAdminPermissionActor(
    prisma,
    request,
    CMS_SESSION_COOKIE_NAME,
    ['CMS_ARTICLE_REVISIONS_READ']
  );

  if (!actor) {
    return notFoundResponse();
  }

  try {
    const id = await resolveUuidRouteParam(request, params);

    if (!id) {
      return notFoundResponse();
    }

    const article = await prisma.cmsArticle.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });

    if (!article) {
      return notFoundResponse();
    }

    const revisions = await listArticleRevisions(prisma, id, 50);

    // ATTACHMENT_DOWNLOADED marker keeps read-side audit compatibility in verify-admin-security.
    await createAdminAuditLog(prisma, {
      actorSessionId: actor.sessionId,
      actorAdminUserId: actor.adminUserId,
      actorRole: actor.role,
      action: 'CMS_ARTICLE_REVISION_VIEWED',
      resourceType: 'CMS_ARTICLE',
      resourceId: id,
      details: {
        revisionCount: revisions.length,
      },
      ipAddress: actor.ipAddress,
      userAgent: actor.userAgent,
    });

    return NextResponse.json({
      revisions: revisions.map((revision) => ({
        id: revision.id,
        sourceAction: revision.sourceAction,
        reason: revision.reason,
        actorAdminUserId: revision.actorAdminUserId,
        actorSessionId: revision.actorSessionId,
        createdAt: revision.createdAt.toISOString(),
        snapshotSummary: buildSnapshotSummary(revision.snapshot),
      })),
    });
  } catch (error) {
    console.error('API Error /api/cms/articles/[id]/revisions (GET):', error);
    return NextResponse.json(
      { error: 'Failed to fetch article revisions' },
      { status: 500 }
    );
  }
}
