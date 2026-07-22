import { CMS_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import {
  createAdminAuditLog,
  requireAdminPermissionActor,
  type AdminRequestActor,
} from '@/lib/admin-audit';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import { hasAdminPermissions } from '@/lib/admin-permissions';
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
  validateCmsPageBlocksForPage,
  type CmsPageBlock,
  type CmsPageStatus,
} from '@/lib/cms/pages';
import { validateReferenzenBlocksForPublish } from '@/lib/cms/referenzen-schema';
import { createPageRevisionSnapshot } from '@/lib/cms/revisions';
import { prisma } from '@/lib/prisma';
import { isUuidLike } from '@/lib/route-params';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const MAX_BATCH_PAGES = 6;

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

type NormalizedBatchPage = {
  id: string | null;
  locale: string;
  status: CmsPageStatus;
  title: string;
  blocks: CmsPageBlock[];
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  expectedUpdatedAt: string | null;
};

class BatchConflictError extends Error {}
class BatchPermissionError extends Error {}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function isPrismaConflict(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      ['P2002', 'P2034'].includes(String((error as { code?: string }).code ?? ''))
  );
}

function normalizeOptionalText(
  value: unknown,
  normalize: (value: unknown) => string | null
): { ok: true; value: string | null } | { ok: false } {
  if (value === undefined || value === null) {
    return { ok: true, value: null };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { ok: true, value: null };
  }

  const normalized = normalize(value);
  return normalized === null ? { ok: false } : { ok: true, value: normalized };
}

function normalizeOptionalLink(
  value: unknown
): { ok: true; value: string | null } | { ok: false } {
  if (value === undefined || value === null) {
    return { ok: true, value: null };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { ok: true, value: null };
  }

  const normalized = normalizeCmsPageLink(value);
  return normalized === null ? { ok: false } : { ok: true, value: normalized };
}

function normalizeExpectedUpdatedAt(
  value: unknown
): { ok: true; value: string | null } | { ok: false } {
  if (value === undefined || value === null || value === '') {
    return { ok: true, value: null };
  }

  if (typeof value !== 'string') {
    return { ok: false };
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? { ok: false }
    : { ok: true, value: parsed.toISOString() };
}

function normalizeBatchPage(value: unknown): NormalizedBatchPage | null {
  if (!isObject(value)) {
    return null;
  }

  const idValue = value.id;
  const id =
    idValue === undefined || idValue === null || idValue === ''
      ? null
      : typeof idValue === 'string' && isUuidLike(idValue)
        ? idValue
        : undefined;
  const locale = normalizeCmsPageLocale(value.locale);
  const status = normalizeCmsPageStatus(value.status);
  const title = normalizeCmsPageTitle(value.title);
  const blocks = normalizeCmsPageBlocks(value.blocks);
  const seoTitle = normalizeOptionalText(value.seoTitle, normalizeCmsPageOptionalTitle);
  const seoDescription = normalizeOptionalText(
    value.seoDescription,
    normalizeCmsPageSeoDescription
  );
  const canonicalUrl = normalizeOptionalLink(value.canonicalUrl);
  const expectedUpdatedAt = normalizeExpectedUpdatedAt(value.expectedUpdatedAt);

  if (
    id === undefined ||
    locale === null ||
    status === null ||
    title === null ||
    blocks === null ||
    !Array.isArray(value.blocks) ||
    blocks.length !== value.blocks.length ||
    !seoTitle.ok ||
    !seoDescription.ok ||
    !canonicalUrl.ok ||
    !expectedUpdatedAt.ok
  ) {
    return null;
  }

  return {
    id,
    locale,
    status,
    title,
    blocks,
    seoTitle: seoTitle.value,
    seoDescription: seoDescription.value,
    canonicalUrl: canonicalUrl.value,
    expectedUpdatedAt: expectedUpdatedAt.value,
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

function buildPageRevisionSnapshot(page: Parameters<typeof serializeCmsPage>[0]) {
  return {
    schemaVersion: 1,
    entity: 'CMS_PAGE',
    data: serializeCmsPage(page),
  };
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

export async function POST(request: NextRequest) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requirePageWriteActor(request);
  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const body = (await request.json().catch(() => null)) as unknown;
    if (!isObject(body)) {
      return NextResponse.json({ error: 'Invalid batch page payload' }, { status: 400 });
    }

    const pageKey = normalizeCmsPageKey(body.pageKey);
    const rawPages = body.pages;

    if (
      pageKey === null ||
      !Array.isArray(rawPages) ||
      rawPages.length === 0 ||
      rawPages.length > MAX_BATCH_PAGES
    ) {
      return NextResponse.json({ error: 'Invalid batch page payload' }, { status: 400 });
    }

    const pages = rawPages.map(normalizeBatchPage);
    if (pages.some((page) => page === null)) {
      return NextResponse.json({ error: 'Invalid batch page payload' }, { status: 400 });
    }

    const normalizedPages = pages as NormalizedBatchPage[];
    const locales = new Set(normalizedPages.map((page) => page.locale));
    if (locales.size !== normalizedPages.length) {
      return NextResponse.json(
        { error: 'Each locale can only appear once in a batch' },
        { status: 400 }
      );
    }

    for (const page of normalizedPages) {
      const pageValidationError = validateCmsPageBlocksForPage(
        pageKey,
        page.locale,
        page.blocks,
        [page.seoTitle, page.seoDescription, page.canonicalUrl],
        page.status
      );

      if (pageValidationError) {
        return NextResponse.json(
          { error: `${page.locale.toUpperCase()}: ${pageValidationError}` },
          { status: 400 }
        );
      }

      if (pageKey === 'referenzen' && page.status === 'PUBLISHED') {
        const referenzenError = validateReferenzenBlocksForPublish(
          page.blocks,
          page.locale
        );
        if (referenzenError) {
          return NextResponse.json(
            { error: `${page.locale.toUpperCase()}: ${referenzenError}` },
            { status: 400 }
          );
        }
      }
    }

    const savedPages = await prisma.$transaction(
      async (tx) => {
        const currentPages = await tx.cmsPage.findMany({
          where: {
            pageKey,
            locale: { in: normalizedPages.map((page) => page.locale) },
          },
          select: CMS_PAGE_SELECT,
        });
        const currentByLocale = new Map(
          currentPages.map((page) => [page.locale, page])
        );
        const results: Parameters<typeof serializeCmsPage>[0][] = [];

        for (const input of normalizedPages) {
          const current = currentByLocale.get(input.locale);

          if (!current) {
            if (input.id) {
              throw new BatchConflictError(
                `${input.locale.toUpperCase()} no longer matches the loaded page.`
              );
            }

            if (
              input.status === 'PUBLISHED' &&
              !hasAdminPermissions(actor.role, ['CMS_PAGE_PUBLISH'])
            ) {
              throw new BatchPermissionError();
            }

            const now = new Date();
            const created = await tx.cmsPage.create({
              data: {
                pageKey,
                locale: input.locale,
                status: input.status,
                title: input.title,
                blocks: input.blocks as unknown as Prisma.InputJsonValue,
                seoTitle: input.seoTitle,
                seoDescription: input.seoDescription,
                canonicalUrl: input.canonicalUrl,
                publishedAt: input.status === 'PUBLISHED' ? now : null,
                deletedAt: null,
              },
              select: CMS_PAGE_SELECT,
            });

            await createAdminAuditLog(tx, {
              actorSessionId: actor.sessionId,
              actorAdminUserId: actor.adminUserId,
              actorRole: actor.role,
              action: 'CMS_PAGE_CREATED',
              resourceType: 'CMS_PAGE',
              resourceId: created.id,
              details: {
                pageKey,
                locale: created.locale,
                status: created.status,
                blockCount: Array.isArray(created.blocks) ? created.blocks.length : 0,
                batch: true,
                revisionSnapshot: buildPageRevisionSnapshot(created),
              },
              ipAddress: actor.ipAddress,
              userAgent: actor.userAgent,
            });

            await createPageRevisionSnapshot(tx, created, {
              sourceAction: 'CREATE',
              actor: {
                adminUserId: actor.adminUserId,
                sessionId: actor.sessionId,
                role: actor.role,
              },
            });

            results.push(created);
            continue;
          }

          if (input.id && input.id !== current.id) {
            throw new BatchConflictError(
              `${input.locale.toUpperCase()} no longer matches the loaded page.`
            );
          }

          const currentIsActive = current.deletedAt === null;
          if (
            currentIsActive &&
            (!input.expectedUpdatedAt ||
              input.expectedUpdatedAt !== current.updatedAt.toISOString())
          ) {
            throw new BatchConflictError(
              `${input.locale.toUpperCase()} was changed by another editor. Reload before saving.`
            );
          }

          if (
            !currentIsActive &&
            input.expectedUpdatedAt &&
            input.expectedUpdatedAt !== current.updatedAt.toISOString()
          ) {
            throw new BatchConflictError(
              `${input.locale.toUpperCase()} was changed after deletion. Reload before saving.`
            );
          }

          const nextPublishedAt =
            input.status === 'PUBLISHED' ? current.publishedAt ?? new Date() : null;
          const changedFields = [
            ['status', current.status, input.status],
            ['title', current.title, input.title],
            ['blocks', current.blocks, input.blocks],
            ['seoTitle', current.seoTitle, input.seoTitle],
            ['seoDescription', current.seoDescription, input.seoDescription],
            ['canonicalUrl', current.canonicalUrl, input.canonicalUrl],
            ['publishedAt', current.publishedAt, nextPublishedAt],
            ['deletedAt', current.deletedAt, null],
          ]
            .filter(([, previous, next]) => !valuesEqual(previous, next))
            .map(([field]) => String(field));

          if (changedFields.length === 0) {
            results.push(current);
            continue;
          }

          const statusChanged = current.status !== input.status;
          const restoresDeletedPage = current.deletedAt !== null;
          if (
            restoresDeletedPage &&
            !hasAdminPermissions(actor.role, ['CMS_PAGE_RESTORE'])
          ) {
            throw new BatchPermissionError();
          }
          if (
            (input.status === 'PUBLISHED' || statusChanged) &&
            !hasAdminPermissions(actor.role, ['CMS_PAGE_PUBLISH'])
          ) {
            throw new BatchPermissionError();
          }

          const updated = await tx.cmsPage.update({
            where: { id: current.id },
            data: {
              status: input.status,
              title: input.title,
              blocks: input.blocks as unknown as Prisma.InputJsonValue,
              seoTitle: input.seoTitle,
              seoDescription: input.seoDescription,
              canonicalUrl: input.canonicalUrl,
              publishedAt: nextPublishedAt,
              deletedAt: null,
            },
            select: CMS_PAGE_SELECT,
          });

          const auditAction =
            current.status === 'DRAFT' && input.status === 'PUBLISHED'
              ? 'CMS_PAGE_PUBLISHED'
              : current.status === 'PUBLISHED' && input.status === 'DRAFT'
                ? 'CMS_PAGE_UNPUBLISHED'
                : 'CMS_PAGE_UPDATED';
          const revisionSourceAction =
            current.status === 'DRAFT' && input.status === 'PUBLISHED'
              ? 'PUBLISH'
              : current.status === 'PUBLISHED' && input.status === 'DRAFT'
                ? 'UNPUBLISH'
                : 'UPDATE';

          await createAdminAuditLog(tx, {
            actorSessionId: actor.sessionId,
            actorAdminUserId: actor.adminUserId,
            actorRole: actor.role,
            action: auditAction,
            resourceType: 'CMS_PAGE',
            resourceId: updated.id,
            details: {
              pageKey,
              locale: updated.locale,
              changedFields,
              previousStatus: current.status,
              nextStatus: updated.status,
              restoredSoftDeletedRecord: restoresDeletedPage,
              blockCount: Array.isArray(updated.blocks) ? updated.blocks.length : 0,
              batch: true,
              revisionSnapshot: buildPageRevisionSnapshot(updated),
            },
            ipAddress: actor.ipAddress,
            userAgent: actor.userAgent,
          });

          await createPageRevisionSnapshot(tx, updated, {
            sourceAction: revisionSourceAction,
            actor: {
              adminUserId: actor.adminUserId,
              sessionId: actor.sessionId,
              role: actor.role,
            },
          });

          results.push(updated);
        }

        return results;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    return NextResponse.json({
      success: true,
      pages: savedPages.map(serializeCmsPage),
    });
  } catch (error) {
    if (error instanceof BatchPermissionError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (error instanceof BatchConflictError || isPrismaConflict(error)) {
      return NextResponse.json(
        {
          error:
            error instanceof BatchConflictError
              ? error.message
              : 'Pages changed while the batch was being saved. Reload and try again.',
        },
        { status: 409 }
      );
    }

    console.error('API Error /api/cms/pages/batch (POST):', error);
    return NextResponse.json({ error: 'Failed to save page locales' }, { status: 500 });
  }
}
