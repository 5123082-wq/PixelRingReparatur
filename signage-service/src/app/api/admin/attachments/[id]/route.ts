import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { AttachmentStorageProvider } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { readLocalAttachment } from '@/lib/attachments';
import {
  CRM_SESSION_COOKIE_NAME,
} from '@/lib/admin-auth';
import { createAdminAuditLog, requireAdminActor } from '@/lib/admin-audit';

export const runtime = 'nodejs';

async function requireAdmin(request: NextRequest) {
  return requireAdminActor(
    prisma,
    request,
    CRM_SESSION_COOKIE_NAME,
    ['MANAGER']
  );
}

function toSafeDownloadName(filename: string | null): string {
  return (filename || 'attachment')
    .replace(/[\r\n"]/g, '')
    .replace(/[^\w.-]+/g, '-')
    .slice(0, 120) || 'attachment';
}

function isUuidLike(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function createPrivateAttachmentHeaders(
  attachment: {
    originalFilename: string | null;
    mimeType: string;
  },
  byteLength: number
): Headers {
  return new Headers({
    'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
    'Content-Disposition': `inline; filename="${toSafeDownloadName(
      attachment.originalFilename
    )}"`,
    'Content-Length': String(byteLength),
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; sandbox",
    'Content-Type': attachment.mimeType || 'application/octet-stream',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Expires': '0',
    'Permissions-Policy': 'camera=(), geolocation=(), microphone=(), payment=()',
    'Pragma': 'no-cache',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  });
}

async function auditBlockedAttachmentDownload(
  actor: NonNullable<Awaited<ReturnType<typeof requireAdmin>>>,
  attachmentId: string,
  details: Record<string, unknown>,
  reason: string,
  action: string,
  status: number,
  errorMessage: string
) {
  await createAdminAuditLog(prisma, {
    actorSessionId: actor.sessionId,
    actorAdminUserId: actor.adminUserId,
    actorRole: actor.role,
    action,
    resourceType: 'ATTACHMENT',
    resourceId: attachmentId,
    caseId: typeof details.caseId === 'string' ? details.caseId : null,
    outcome: 'BLOCKED',
    reason,
    details: {
      attachmentId,
      ...details,
    },
    ipAddress: actor.ipAddress,
    userAgent: actor.userAgent,
  });

  return NextResponse.json({ error: errorMessage }, { status });
}

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const actor = await requireAdmin(request);

  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { id } = await params;

  try {
    if (!isUuidLike(id)) {
      return await auditBlockedAttachmentDownload(
        actor,
        id,
        { inputType: 'path-param' },
        'Attachment identifier is not a valid UUID',
        'ATTACHMENT_DOWNLOAD_BLOCKED_INVALID_ID',
        400,
        'Invalid attachment identifier'
      );
    }

    const attachment = await prisma.attachment.findUnique({
      where: { id },
      select: {
        id: true,
        caseId: true,
        isCustomerVisible: true,
        storageProvider: true,
        storageKey: true,
        originalFilename: true,
        mimeType: true,
        byteSize: true,
        checksumSha256: true,
      },
    });

    if (!attachment) {
      return await auditBlockedAttachmentDownload(
        actor,
        id,
        { lookupResult: 'not-found' },
        'Attachment record was not found',
        'ATTACHMENT_DOWNLOAD_BLOCKED_NOT_FOUND',
        404,
        'Attachment not found'
      );
    }

    if (!attachment.caseId) {
      return await auditBlockedAttachmentDownload(
        actor,
        attachment.id,
        { storageProvider: attachment.storageProvider, caseId: null },
        'Attachment is not linked to a case',
        'ATTACHMENT_DOWNLOAD_BLOCKED_ORPHANED_RECORD',
        409,
        'Attachment is not available for download'
      );
    }

    if (!attachment.storageKey?.trim()) {
      return await auditBlockedAttachmentDownload(
        actor,
        attachment.id,
        {
          caseId: attachment.caseId,
          storageProvider: attachment.storageProvider,
          storageKeyPresent: Boolean(attachment.storageKey),
        },
        'Attachment storage key is missing or empty',
        'ATTACHMENT_DOWNLOAD_BLOCKED_MISSING_STORAGE_KEY',
        409,
        'Attachment is not available for download'
      );
    }

    if (attachment.storageProvider !== AttachmentStorageProvider.LOCAL) {
      return await auditBlockedAttachmentDownload(
        actor,
        attachment.id,
        {
          caseId: attachment.caseId,
          storageProvider: attachment.storageProvider,
        },
        'Attachment storage provider is not supported by this route',
        'ATTACHMENT_DOWNLOAD_BLOCKED_UNSUPPORTED_STORAGE',
        409,
        'Attachment is not available for download'
      );
    }

    let file: Buffer;

    try {
      file = await readLocalAttachment(attachment.storageKey);
    } catch (error) {
      const code = error instanceof Error && 'code' in error ? String((error as { code?: unknown }).code) : null;

      if (code === 'ENOENT' || code === 'ENOTDIR' || code === 'EISDIR') {
        return await auditBlockedAttachmentDownload(
          actor,
          attachment.id,
          {
            caseId: attachment.caseId,
            storageProvider: attachment.storageProvider,
            storageKey: attachment.storageKey,
            storageErrorCode: code,
          },
          'Attachment file is missing or inaccessible on disk',
          'ATTACHMENT_DOWNLOAD_BLOCKED_STORAGE_MISSING',
          409,
          'Attachment is not available for download'
        );
      }

      throw error;
    }

    if (attachment.checksumSha256) {
      const checksum = crypto.createHash('sha256').update(file).digest('hex');

      if (checksum !== attachment.checksumSha256) {
        await createAdminAuditLog(prisma, {
          actorSessionId: actor.sessionId,
          actorAdminUserId: actor.adminUserId,
          actorRole: actor.role,
          action: 'ATTACHMENT_DOWNLOAD_BLOCKED_CHECKSUM',
          resourceType: 'ATTACHMENT',
          resourceId: attachment.id,
          caseId: attachment.caseId,
          outcome: 'BLOCKED',
          details: {
            storageProvider: attachment.storageProvider,
            expectedChecksum: attachment.checksumSha256,
            actualChecksum: checksum,
            byteSize: attachment.byteSize,
          },
          ipAddress: actor.ipAddress,
          userAgent: actor.userAgent,
        });

        return NextResponse.json(
          { error: 'Attachment integrity check failed' },
          { status: 409 }
        );
      }
    }

    await createAdminAuditLog(prisma, {
      actorSessionId: actor.sessionId,
      actorAdminUserId: actor.adminUserId,
      actorRole: actor.role,
      action: 'ATTACHMENT_DOWNLOADED',
      resourceType: 'ATTACHMENT',
      resourceId: attachment.id,
      caseId: attachment.caseId,
      details: {
        storageProvider: attachment.storageProvider,
        mimeType: attachment.mimeType,
        byteSize: attachment.byteSize,
        isCustomerVisible: attachment.isCustomerVisible,
        checksumVerified: Boolean(attachment.checksumSha256),
      },
      ipAddress: actor.ipAddress,
      userAgent: actor.userAgent,
    });

    return new NextResponse(new Uint8Array(file), {
      headers: createPrivateAttachmentHeaders(attachment, file.byteLength),
    });
  } catch (error) {
    console.error('Admin attachment download error:', error);

    return NextResponse.json(
      { error: 'Failed to load attachment' },
      { status: 500 }
    );
  }
}
