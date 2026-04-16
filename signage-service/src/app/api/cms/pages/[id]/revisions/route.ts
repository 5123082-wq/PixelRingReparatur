import { NextRequest, NextResponse } from 'next/server';

import { CMS_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { createAdminAuditLog, requireAdminPermissionActor } from '@/lib/admin-audit';
import { listPageRevisions } from '@/lib/cms/revisions';
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
    pageKey: asString(snapshot.pageKey),
    locale: asString(snapshot.locale),
    status: asString(snapshot.status),
    title: asString(snapshot.title),
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const actor = await requireAdminPermissionActor(
    prisma,
    request,
    CMS_SESSION_COOKIE_NAME,
    ['CMS_PAGE_REVISIONS_READ']
  );

  if (!actor) {
    return notFoundResponse();
  }

  try {
    const id = await resolveUuidRouteParam(request, params);

    if (!id) {
      return notFoundResponse();
    }

    const page = await prisma.cmsPage.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });

    if (!page) {
      return notFoundResponse();
    }

    const revisions = await listPageRevisions(prisma, id, 50);

    await createAdminAuditLog(prisma, {
      actorSessionId: actor.sessionId,
      actorAdminUserId: actor.adminUserId,
      actorRole: actor.role,
      action: 'CMS_PAGE_REVISION_VIEWED',
      resourceType: 'CMS_PAGE',
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
    console.error('API Error /api/cms/pages/[id]/revisions (GET):', error);
    return NextResponse.json(
      { error: 'Failed to fetch page revisions' },
      { status: 500 }
    );
  }
}
