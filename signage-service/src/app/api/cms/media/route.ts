import { CMS_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { createAdminAuditLog, requireAdminPermissionActor, type AdminRequestActor } from '@/lib/admin-audit';
import type { CmsMediaStorageProvider } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { validateAdminCsrf } from '@/lib/admin-csrf';
import {
  cleanupLocalCmsMediaUpload,
  normalizeCmsMediaAltText,
  normalizeCmsMediaDimensions,
  normalizeCmsMediaLocale,
  normalizeCmsMediaMetadata,
  normalizeCmsMediaSearch,
  normalizeCmsMediaTitle,
  normalizeCmsMediaUsageType,
  saveCmsMediaWithFallback,
  serializeCmsMedia,
  validateCmsMediaUploadFile,
} from '@/lib/cms/media';
import { prisma } from '@/lib/prisma';

const CMS_MEDIA_SELECT = {
  id: true,
  locale: true,
  usageType: true,
  storageProvider: true,
  storageKey: true,
  publicUrl: true,
  fallbackUrl: true,
  fallbackStorageKey: true,
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

function isPrismaUniqueError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002'
  );
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

function parseBoolean(value: string | null): boolean {
  if (!value) {
    return false;
  }

  const normalized = value.trim().toLowerCase();

  return ['1', 'true', 'yes', 'on'].includes(normalized);
}

function buildWhere(searchParams: URLSearchParams) {
  const where: Record<string, unknown> = {
    deletedAt: null,
  };

  if (parseBoolean(searchParams.get('includeDeleted'))) {
    delete where.deletedAt;
  }

  if (searchParams.has('usageType') && searchParams.get('usageType')?.trim()) {
    const usageType = normalizeCmsMediaUsageType(searchParams.get('usageType'));

    if (!usageType) {
      return { error: 'Invalid media query parameters' } as const;
    }

    where.usageType = usageType;
  }

  if (searchParams.has('locale') && searchParams.get('locale')?.trim()) {
    const locale = normalizeCmsMediaLocale(searchParams.get('locale'));

    if (!locale) {
      return { error: 'Invalid media query parameters' } as const;
    }

    where.locale = locale;
  }

  if (searchParams.has('search') && searchParams.get('search')?.trim()) {
    const search = normalizeCmsMediaSearch(searchParams.get('search'));

    if (!search) {
      return { error: 'Invalid media query parameters' } as const;
    }

    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { altText: { contains: search, mode: 'insensitive' } },
      { originalFilename: { contains: search, mode: 'insensitive' } },
      { storageKey: { contains: search, mode: 'insensitive' } },
      { publicUrl: { contains: search, mode: 'insensitive' } },
      { fallbackUrl: { contains: search, mode: 'insensitive' } },
      { fallbackStorageKey: { contains: search, mode: 'insensitive' } },
    ];
  }

  return { where } as const;
}

export async function GET(request: NextRequest) {
  if (!(await requireMediaReadActor(request))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const whereResult = buildWhere(request.nextUrl.searchParams);

    if ('error' in whereResult) {
      return NextResponse.json({ error: whereResult.error }, { status: 400 });
    }

    const media = await prisma.cmsMedia.findMany({
      where: whereResult.where,
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      select: CMS_MEDIA_SELECT,
    });

    return NextResponse.json({ media: media.map(serializeCmsMedia) });
  } catch (error) {
    console.error('API Error /api/cms/media (GET):', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requireMediaWriteActor(request);

  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let storedMedia: {
    storageProvider: CmsMediaStorageProvider;
    storageKey: string;
    publicUrl: string;
    fallbackStorageKey: string | null;
    fallbackUrl: string | null;
  } | null = null;

  try {
    const formData = await request.formData();

    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Media file is required' }, { status: 400 });
    }

    const usageType = normalizeCmsMediaUsageType(formData.get('usageType'));
    const locale = normalizeCmsMediaLocale(formData.get('locale')) ?? 'de';
    const title = normalizeCmsMediaTitle(formData.get('title'));
    const altRaw = formData.get('altText') ?? formData.get('alt');
    const metaRaw = formData.get('metadata') ?? formData.get('meta');
    const altText = normalizeCmsMediaAltText(altRaw);
    const meta = normalizeCmsMediaMetadata(metaRaw);
    const checksumSha256 =
      typeof formData.get('checksumSha256') === 'string'
        ? (formData.get('checksumSha256') as string)
        : null;
    const dimensions = normalizeCmsMediaDimensions(formData.get('width'), formData.get('height'));

    if (!usageType || !locale || !dimensions) {
      return NextResponse.json({ error: 'Invalid media payload' }, { status: 400 });
    }

    const validated = await validateCmsMediaUploadFile({
      file,
      checksumSha256,
    });

    storedMedia = await saveCmsMediaWithFallback({
      buffer: validated.buffer,
      filename: validated.originalFilename,
      extension: validated.extension,
      mimeType: validated.mimeType,
    });
    const persistedMedia = storedMedia;

    const created = await prisma.$transaction(async (tx) => {
      const mediaRecord = await tx.cmsMedia.create({
        data: {
          locale,
          usageType,
          storageProvider: persistedMedia.storageProvider,
          storageKey: persistedMedia.storageKey,
          publicUrl: persistedMedia.publicUrl,
          fallbackUrl: persistedMedia.fallbackUrl,
          fallbackStorageKey: persistedMedia.fallbackStorageKey,
          originalFilename: validated.originalFilename,
          title,
          altText,
          mimeType: validated.mimeType,
          byteSize: validated.byteSize,
          checksumSha256: validated.checksumSha256,
          width: dimensions?.width ?? validated.width,
          height: dimensions?.height ?? validated.height,
          meta: meta ?? undefined,
          deletedAt: null,
        },
      });

      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId,
        actorAdminUserId: actor.adminUserId,
        actorRole: actor.role,
        action: 'CMS_MEDIA_UPLOAD',
        resourceType: 'CMS_MEDIA',
        resourceId: mediaRecord.id,
        outcome: 'SUCCESS',
        details: {
          filename: validated.originalFilename,
          mimeType: validated.mimeType,
          byteSize: validated.byteSize,
          storageProvider: persistedMedia.storageProvider,
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      });

      return mediaRecord;
    });

    return NextResponse.json({
      message: 'Media uploaded successfully',
      media: serializeCmsMedia(created),
    }, { status: 201 });

  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[${errorId}] API Error /api/cms/media (POST):`, error);

    // Try to log failure to audit log (outside of main transaction if that failed)
    if (actor) {
      try {
        await createAdminAuditLog(prisma, {
          actorSessionId: actor.sessionId,
          actorAdminUserId: actor.adminUserId,
          actorRole: actor.role,
          action: 'CMS_MEDIA_UPLOAD',
          resourceType: 'CMS_MEDIA',
          outcome: 'FAILURE',
          reason: error instanceof Error ? error.message : 'Unknown error',
          details: { errorId },
          ipAddress: actor.ipAddress,
          userAgent: actor.userAgent,
        });
      } catch (auditError) {
        console.error(`[${errorId}] Failed to log audit failure:`, auditError);
      }
    }

    if (isPrismaUniqueError(error)) {
      if (storedMedia) {
        await cleanupLocalCmsMediaUpload(
          storedMedia.fallbackStorageKey ?? storedMedia.storageKey
        ).catch((cleanupError) => {
          console.error('Failed to clean up duplicate CMS media upload:', cleanupError);
        });
      }

      return NextResponse.json({ error: 'Media already exists' }, { status: 409 });
    }

    if (error instanceof Error) {
      const message = error.message;
      const badRequestErrors = new Set([
        'Invalid media payload',
        'Invalid checksum format',
        'Checksum mismatch',
        'Media dimensions exceed allowed limit',
      ]);

      if (badRequestErrors.has(message)) {
        return NextResponse.json({ error: message }, { status: 400 });
      }

      if (message.startsWith('Media size exceeds allowed limit')) {
        return NextResponse.json({ error: message }, { status: 413 });
      }

      if (
        message.startsWith('Unsupported media MIME type') ||
        message === 'MIME does not match file signature'
      ) {
        return NextResponse.json({ error: message }, { status: 415 });
      }
    }

    if (storedMedia) {
      await cleanupLocalCmsMediaUpload(
        storedMedia.fallbackStorageKey ?? storedMedia.storageKey
      ).catch((cleanupError) => {
        console.error('Failed to clean up orphaned CMS media upload:', cleanupError);
      });
    }

    return NextResponse.json({ 
      error: 'Failed to upload media',
      debugId: errorId
    }, { status: 500 });
  }
}
