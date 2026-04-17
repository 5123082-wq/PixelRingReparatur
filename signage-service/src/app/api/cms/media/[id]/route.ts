import { CMS_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { createAdminAuditLog, requireAdminPermissionActor, type AdminRequestActor } from '@/lib/admin-audit';
import type { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { validateAdminCsrf } from '@/lib/admin-csrf';
import {
  findCmsMediaUsage,
  normalizeCmsMediaAltText,
  normalizeCmsMediaDimensions,
  normalizeCmsMediaLocale,
  normalizeCmsMediaMetadata,
  normalizeCmsMediaTitle,
  normalizeCmsMediaUsageType,
  serializeCmsMedia,
} from '@/lib/cms/media';
import { prisma } from '@/lib/prisma';

const CMS_MEDIA_SELECT = {
  id: true,
  locale: true,
  usageType: true,
  storageProvider: true,
  storageKey: true,
  publicUrl: true,
  originalFilename: true,
  title: true,
  altText: true,
  mimeType: true,
  byteSize: true,
  checksumSha256: true,
  width: true,
  height: true,
  meta: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

type RouteParams = {
  params: Promise<{ id: string }>;
};

function isUuidLike(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function notFoundResponse() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

async function requireMediaReadActor(
  request: NextRequest
): Promise<AdminRequestActor | null> {
  return requireAdminPermissionActor(prisma, request, CMS_SESSION_COOKIE_NAME, ['CMS_MEDIA_READ']);
}

async function requireMediaWriteActor(
  request: NextRequest
): Promise<AdminRequestActor | null> {
  return requireAdminPermissionActor(prisma, request, CMS_SESSION_COOKIE_NAME, ['CMS_MEDIA_WRITE']);
}

type ParsedPatchPayload = {
  usageType?: string;
  locale?: string;
  title?: string | null;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
  meta?: Prisma.InputJsonValue | null;
};

function parsePatchPayload(body: Record<string, unknown>): ParsedPatchPayload | null {
  const payload: ParsedPatchPayload = {};

  if (body.usageType !== undefined) {
    const usageType = normalizeCmsMediaUsageType(body.usageType);

    if (!usageType) {
      return null;
    }

    payload.usageType = usageType;
  }

  if (body.locale !== undefined) {
    const locale = normalizeCmsMediaLocale(body.locale);

    if (!locale) {
      return null;
    }

    payload.locale = locale;
  }

  if (body.title !== undefined) {
    if (body.title === null || (typeof body.title === 'string' && body.title.trim() === '')) {
      payload.title = null;
    } else {
      const title = normalizeCmsMediaTitle(body.title);

      if (title === null) {
        return null;
      }

      payload.title = title;
    }
  }

  const altSource = body.altText === undefined ? body.alt : body.altText;

  if (altSource !== undefined) {
    if (altSource === null || (typeof altSource === 'string' && altSource.trim() === '')) {
      payload.altText = null;
    } else {
      const altText = normalizeCmsMediaAltText(altSource);

      if (altText === null) {
        return null;
      }

      payload.altText = altText;
    }
  }

  const metadataSource = body.meta === undefined ? body.metadata : body.meta;

  if (metadataSource !== undefined) {
    if (metadataSource === null || metadataSource === '') {
      payload.meta = null;
    } else {
      const meta = normalizeCmsMediaMetadata(metadataSource);

      if (meta === null) {
        return null;
      }

      payload.meta = meta;
    }
  }

  if (body.width !== undefined || body.height !== undefined) {
    const dimensions = normalizeCmsMediaDimensions(body.width, body.height);

    if (!dimensions) {
      return null;
    }

    payload.width = dimensions.width;
    payload.height = dimensions.height;
  }

  return payload;
}

function valuesEqual(left: unknown, right: unknown): boolean {
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

function changedFields(
  current: Record<string, unknown>,
  updates: Record<string, unknown>
): string[] {
  return Object.keys(updates).filter((key) => !valuesEqual(current[key], updates[key]));
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!(await requireMediaReadActor(request))) {
    return notFoundResponse();
  }

  try {
    const { id } = await params;

    if (!isUuidLike(id)) {
      return notFoundResponse();
    }

    const media = await prisma.cmsMedia.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: CMS_MEDIA_SELECT,
    });

    if (!media) {
      return notFoundResponse();
    }

    return NextResponse.json({ media: serializeCmsMedia(media) });
  } catch (error) {
    console.error('API Error /api/cms/media/[id] (GET):', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requireMediaWriteActor(request);

  if (!actor) {
    return notFoundResponse();
  }

  try {
    const { id } = await params;

    if (!isUuidLike(id)) {
      return notFoundResponse();
    }

    const current = await prisma.cmsMedia.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: CMS_MEDIA_SELECT,
    });

    if (!current) {
      return notFoundResponse();
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

    if (!body) {
      return NextResponse.json({ error: 'Invalid media payload' }, { status: 400 });
    }

    const parsed = parsePatchPayload(body);

    if (!parsed) {
      return NextResponse.json({ error: 'Invalid media payload' }, { status: 400 });
    }

    const updates = Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => value !== undefined)
    ) as Prisma.CmsMediaUpdateInput;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid media fields provided' }, { status: 400 });
    }

    const changed = changedFields(current as unknown as Record<string, unknown>, updates as unknown as Record<string, unknown>);

    const updated = await prisma.$transaction(async (tx) => {
      const media = await tx.cmsMedia.update({
        where: { id },
        data: updates,
        select: CMS_MEDIA_SELECT,
      });

      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId,
        actorAdminUserId: actor.adminUserId,
        actorRole: actor.role,
        action: 'CMS_MEDIA_UPDATED',
        resourceType: 'CMS_MEDIA',
        resourceId: id,
        details: {
          changedFields: changed,
          usageType: media.usageType,
          locale: media.locale,
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      });

      return media;
    });

    return NextResponse.json({ success: true, media: serializeCmsMedia(updated) });
  } catch (error) {
    console.error('API Error /api/cms/media/[id] (PATCH):', error);
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requireMediaWriteActor(request);

  if (!actor) {
    return notFoundResponse();
  }

  try {
    const { id } = await params;

    if (!isUuidLike(id)) {
      return notFoundResponse();
    }

    const current = await prisma.cmsMedia.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        locale: true,
        usageType: true,
        storageKey: true,
        publicUrl: true,
      },
    });

    if (!current) {
      return notFoundResponse();
    }

    const whereUsed = await findCmsMediaUsage(prisma, current);

    if (whereUsed.length > 0) {
      await createAdminAuditLog(prisma, {
        actorSessionId: actor.sessionId,
        actorAdminUserId: actor.adminUserId,
        actorRole: actor.role,
        action: 'CMS_MEDIA_DELETE_BLOCKED_WHERE_USED',
        resourceType: 'CMS_MEDIA',
        resourceId: id,
        outcome: 'BLOCKED',
        reason: 'Media is still referenced by CMS content where-used check',
        details: {
          whereUsedCount: whereUsed.length,
          whereUsed: whereUsed.slice(0, 25),
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      });

      return NextResponse.json(
        {
          error: 'Media is still used in CMS content',
          whereUsed,
        },
        { status: 409 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.cmsMedia.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId,
        actorAdminUserId: actor.adminUserId,
        actorRole: actor.role,
        action: 'CMS_MEDIA_DELETED',
        resourceType: 'CMS_MEDIA',
        resourceId: id,
        details: {
          usageType: current.usageType,
          locale: current.locale,
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error /api/cms/media/[id] (DELETE):', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
