import { CMS_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { createAdminAuditLog, requireAdminPermissionActor, type AdminRequestActor } from '@/lib/admin-audit';
import type { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { hasAdminPermissions } from '@/lib/admin-permissions';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import {
  normalizeCmsPageBlocks,
  normalizeCmsPageKey,
  normalizeCmsPageLink,
  normalizeCmsPageLocale,
  normalizeCmsPageOptionalTitle,
  normalizeCmsPageSeoDescription,
  normalizeCmsPageStatus,
  normalizeCmsPageTitle,
  serializeCmsPage,
  type CmsPageStatus,
} from '@/lib/cms/pages';
import { createPageRevisionSnapshot } from '@/lib/cms/revisions';
import { prisma } from '@/lib/prisma';
import { resolveUuidRouteParam } from '@/lib/route-params';

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

const CMS_PAGE_AUDIT_FIELDS = [
  'pageKey',
  'locale',
  'status',
  'title',
  'blocks',
  'seoTitle',
  'seoDescription',
  'canonicalUrl',
  'publishedAt',
  'lastReviewedAt',
] as const;

type RouteParams = {
  params: Promise<{ id: string }>;
};

function notFoundResponse() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
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
  return requireAdminPermissionActor(
    prisma,
    request,
    CMS_SESSION_COOKIE_NAME,
    ['CMS_PAGE_READ']
  );
}

async function requirePageWriteActor(
  request: NextRequest
): Promise<AdminRequestActor | null> {
  return requireAdminPermissionActor(
    prisma,
    request,
    CMS_SESSION_COOKIE_NAME,
    ['CMS_PAGE_WRITE']
  );
}

async function requirePageDeleteActor(
  request: NextRequest
): Promise<AdminRequestActor | null> {
  return requireAdminPermissionActor(
    prisma,
    request,
    CMS_SESSION_COOKIE_NAME,
    ['CMS_PAGE_DELETE']
  );
}

function normalizeOptionalText(
  value: unknown,
  normalize: (value: unknown) => string | null
): { ok: true; value: string | null | undefined } | { ok: false } {
  if (value === undefined) {
    return { ok: true, value: undefined };
  }

  if (value === null || (typeof value === 'string' && value.trim() === '')) {
    return { ok: true, value: null };
  }

  const normalized = normalize(value);
  return normalized === null ? { ok: false } : { ok: true, value: normalized };
}

function normalizeOptionalLink(
  value: unknown
): { ok: true; value: string | null | undefined } | { ok: false } {
  if (value === undefined) {
    return { ok: true, value: undefined };
  }

  if (value === null || (typeof value === 'string' && value.trim() === '')) {
    return { ok: true, value: null };
  }

  const normalized = normalizeCmsPageLink(value);
  return normalized === null ? { ok: false } : { ok: true, value: normalized };
}

function normalizeOptionalDate(
  value: unknown
): { ok: true; value: Date | null | undefined } | { ok: false } {
  if (value === undefined) {
    return { ok: true, value: undefined };
  }

  if (value === null || (typeof value === 'string' && value.trim() === '')) {
    return { ok: true, value: null };
  }

  if (typeof value !== 'string') {
    return { ok: false };
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime())
    ? { ok: false }
    : { ok: true, value: parsed };
}

function parsePayload(body: Record<string, unknown>) {
  const pageKey = body.pageKey === undefined ? undefined : normalizeCmsPageKey(body.pageKey);
  const locale = body.locale === undefined ? undefined : normalizeCmsPageLocale(body.locale);
  const status =
    body.status === undefined ? undefined : normalizeCmsPageStatus(body.status);
  const title = body.title === undefined ? undefined : normalizeCmsPageTitle(body.title);
  const blocks = body.blocks === undefined ? undefined : normalizeCmsPageBlocks(body.blocks);
  const seoTitle = normalizeOptionalText(body.seoTitle, normalizeCmsPageOptionalTitle);
  const seoDescription = normalizeOptionalText(
    body.seoDescription,
    normalizeCmsPageSeoDescription
  );
  const canonicalUrl = normalizeOptionalLink(body.canonicalUrl);
  const lastReviewedAt = normalizeOptionalDate(body.lastReviewedAt);

  if (!seoTitle.ok || !seoDescription.ok || !canonicalUrl.ok || !lastReviewedAt.ok) {
    return null;
  }

  return {
    pageKey,
    locale,
    status,
    title,
    blocks,
    seoTitle: seoTitle.value,
    seoDescription: seoDescription.value,
    canonicalUrl: canonicalUrl.value,
    lastReviewedAt: lastReviewedAt.value,
  };
}

function valuesEqual(left: unknown, right: unknown): boolean {
  if (left instanceof Date || right instanceof Date) {
    const leftTime = left instanceof Date ? left.getTime() : null;
    const rightTime = right instanceof Date ? right.getTime() : null;
    return leftTime === rightTime;
  }

  if (
    Array.isArray(left) ||
    Array.isArray(right) ||
    (left && typeof left === 'object') ||
    (right && typeof right === 'object')
  ) {
    return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
  }

  return Object.is(left, right);
}

function getChangedPageFields(
  current: Parameters<typeof serializeCmsPage>[0],
  nextValues: Record<string, unknown>
): string[] {
  return CMS_PAGE_AUDIT_FIELDS.filter(
    (field) => field in nextValues && !valuesEqual(current[field], nextValues[field])
  );
}

function buildPageRevisionSnapshot(page: Parameters<typeof serializeCmsPage>[0]) {
  return {
    schemaVersion: 1,
    entity: 'CMS_PAGE',
    data: serializeCmsPage(page),
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!(await requireOwnerActor(request))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const id = await resolveUuidRouteParam(request, params);

    if (!id) {
      return notFoundResponse();
    }

    const page = await prisma.cmsPage.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: CMS_PAGE_SELECT,
    });

    if (!page) {
      return notFoundResponse();
    }

    return NextResponse.json({ page: serializeCmsPage(page) });
  } catch (error) {
    console.error('API Error /api/cms/pages/[id] (GET):', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requirePageWriteActor(request);

  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const id = await resolveUuidRouteParam(request, params);

    if (!id) {
      return notFoundResponse();
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

    if (!body) {
      return NextResponse.json({ error: 'Invalid page payload' }, { status: 400 });
    }

    const current = await prisma.cmsPage.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: CMS_PAGE_SELECT,
    });

    if (!current) {
      return notFoundResponse();
    }

    const parsed = parsePayload(body);

    if (!parsed) {
      return NextResponse.json({ error: 'Invalid page payload' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    const strictFields = new Set(['pageKey', 'locale', 'status', 'title', 'blocks']);

    for (const [key, value] of Object.entries(parsed)) {
      if (value === undefined) {
        continue;
      }

      if (value === null && strictFields.has(key)) {
        return NextResponse.json({ error: 'Invalid page payload' }, { status: 400 });
      }

      updates[key] =
        key === 'blocks'
          ? (value as unknown as Prisma.InputJsonValue)
          : value;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid page fields provided' }, { status: 400 });
    }

    const nextPageKey =
      typeof updates.pageKey === 'string' ? updates.pageKey : current.pageKey;
    const nextLocale =
      typeof updates.locale === 'string' ? updates.locale : current.locale;

    if (updates.pageKey !== undefined || updates.locale !== undefined) {
      const conflict = await prisma.cmsPage.findFirst({
        where: {
          id: { not: id },
          pageKey: nextPageKey,
          locale: nextLocale,
        },
        select: { id: true },
      });

      if (conflict) {
        return NextResponse.json(
          { error: 'Page already exists for page key and locale' },
          { status: 409 }
        );
      }
    }

    const nextStatus = (
      typeof updates.status === 'string' ? updates.status : current.status
    ) as CmsPageStatus;
    const previousStatus = current.status as CmsPageStatus;
    const nextValues: Record<string, unknown> = { ...updates };
    const requiresPublishPermission =
      (previousStatus === 'DRAFT' && nextStatus === 'PUBLISHED') ||
      (previousStatus === 'PUBLISHED' && nextStatus === 'DRAFT');

    if (requiresPublishPermission && !hasAdminPermissions(actor.role, ['CMS_PAGE_PUBLISH'])) {
      return notFoundResponse();
    }

    if (nextStatus === 'PUBLISHED' && current.publishedAt === null) {
      nextValues.publishedAt = new Date();
      updates.publishedAt = nextValues.publishedAt;
    }

    const changedFields = getChangedPageFields(current, nextValues);
    const auditAction =
      previousStatus === 'DRAFT' && nextStatus === 'PUBLISHED'
        ? 'CMS_PAGE_PUBLISHED'
        : previousStatus === 'PUBLISHED' && nextStatus === 'DRAFT'
          ? 'CMS_PAGE_UNPUBLISHED'
          : 'CMS_PAGE_UPDATED';
    const revisionSourceAction =
      previousStatus === 'DRAFT' && nextStatus === 'PUBLISHED'
        ? 'PUBLISH'
        : previousStatus === 'PUBLISHED' && nextStatus === 'DRAFT'
          ? 'UNPUBLISH'
          : 'UPDATE';

    const page = await prisma.$transaction(async (tx) => {
      const updatedPage = await tx.cmsPage.update({
        where: { id },
        data: updates as Prisma.CmsPageUpdateInput,
        select: CMS_PAGE_SELECT,
      });

      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId,
        actorAdminUserId: actor.adminUserId,
        actorRole: actor.role,
        action: auditAction,
        resourceType: 'CMS_PAGE',
        resourceId: updatedPage.id,
        details: {
          pageKey: updatedPage.pageKey,
          locale: updatedPage.locale,
          changedFields,
          previousStatus,
          nextStatus: updatedPage.status,
          blockCount: Array.isArray(updatedPage.blocks) ? updatedPage.blocks.length : 0,
          revisionSnapshot: buildPageRevisionSnapshot(updatedPage),
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      });

      await createPageRevisionSnapshot(tx, updatedPage, {
        sourceAction: revisionSourceAction,
        actor: {
          adminUserId: actor.adminUserId,
          sessionId: actor.sessionId,
          role: actor.role,
        },
      });

      return updatedPage;
    });

    return NextResponse.json({ success: true, page: serializeCmsPage(page) });
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return NextResponse.json(
        { error: 'Page already exists for page key and locale' },
        { status: 409 }
      );
    }

    console.error('API Error /api/cms/pages/[id] (PATCH):', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requirePageDeleteActor(request);

  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const id = await resolveUuidRouteParam(request, params);

    if (!id) {
      return notFoundResponse();
    }

    const current = await prisma.cmsPage.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        pageKey: true,
        locale: true,
        status: true,
      },
    });

    if (!current) {
      return notFoundResponse();
    }

    await prisma.$transaction(async (tx) => {
      await tx.cmsPage.update({
        where: { id },
        data: { deletedAt: new Date() },
        select: { id: true },
      });

      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId,
        actorAdminUserId: actor.adminUserId,
        actorRole: actor.role,
        action: 'CMS_PAGE_DELETED',
        resourceType: 'CMS_PAGE',
        resourceId: id,
        details: {
          pageKey: current.pageKey,
          locale: current.locale,
          status: current.status,
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error /api/cms/pages/[id] (DELETE):', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
