import type { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { CMS_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import { createAdminAuditLog, requireAdminPermissionActor } from '@/lib/admin-audit';
import { serializeCmsPage } from '@/lib/cms/pages';
import {
  buildPageRestoreDataFromSnapshot,
  createPageRevisionSnapshot,
} from '@/lib/cms/revisions';
import { prisma } from '@/lib/prisma';
import { isUuidLike, resolveUuidRouteParam } from '@/lib/route-params';

type RouteParams = {
  params: Promise<{ id: string }>;
};

const CMS_PAGE_SELECT = {
  id: true,
  pageKey: true,
  locale: true,
  status: true,
  title: true,
  blocks: true,
  seoTitle: true,
  seoDescription: true,
  canonicalUrl: true,
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

export async function POST(request: NextRequest, { params }: RouteParams) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requireAdminPermissionActor(
    prisma,
    request,
    CMS_SESSION_COOKIE_NAME,
    ['CMS_PAGE_RESTORE']
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
      const current = await tx.cmsPage.findFirst({
        where: { id, deletedAt: null },
        select: CMS_PAGE_SELECT,
      });

      if (!current) {
        return null;
      }

      const revision = await tx.cmsPageRevision.findFirst({
        where: { id: revisionId, pageId: id },
        select: { id: true, snapshot: true },
      });

      if (!revision) {
        return null;
      }

      const restoreData = buildPageRestoreDataFromSnapshot(revision.snapshot);
      if (!restoreData) {
        throw new Error('INVALID_PAGE_REVISION_SNAPSHOT');
      }

      await createPageRevisionSnapshot(tx, current, {
        sourceAction: 'RESTORE',
        reason,
        actor: {
          adminUserId: actor.adminUserId,
          sessionId: actor.sessionId,
          role: actor.role,
        },
      });

      const updatedPage = await tx.cmsPage.update({
        where: { id },
        data: restoreData as Prisma.CmsPageUpdateInput,
        select: CMS_PAGE_SELECT,
      });

      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId,
        actorAdminUserId: actor.adminUserId,
        actorRole: actor.role,
        action: 'CMS_PAGE_RESTORED',
        resourceType: 'CMS_PAGE',
        resourceId: id,
        reason,
        details: {
          revisionId,
          previousStatus: current.status,
          nextStatus: updatedPage.status,
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      });

      return updatedPage;
    });

    if (!restored) {
      return notFoundResponse();
    }

    return NextResponse.json({
      success: true,
      page: serializeCmsPage(restored),
      restoredFromRevisionId: revisionId,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'INVALID_PAGE_REVISION_SNAPSHOT'
    ) {
      return NextResponse.json({ error: 'Revision snapshot is invalid' }, { status: 400 });
    }

    console.error('API Error /api/cms/pages/[id]/restore (POST):', error);
    return NextResponse.json({ error: 'Failed to restore page revision' }, { status: 500 });
  }
}
