import { CRM_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { requireAdminPermissionActor } from '@/lib/admin-audit';
import { NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/blob';

import { prisma } from '@/lib/prisma';
import { AttachmentStorageProvider } from '@prisma/client';
import { readLocalAttachment as readSafeLocalAttachment } from '@/lib/attachments';

const UUID_LIKE_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type PrivateAttachmentHeaderInput = {
  mimeType: string | null;
  originalFilename: string | null;
};

function isUuidLike(value: string): boolean {
  return UUID_LIKE_PATTERN.test(value);
}

function notFoundResponse() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

function isActorAssignedToCase(
  actor: { adminUserId: string; email: string; displayName: string | null },
  assignedOperator: string | null
): boolean {
  if (assignedOperator === null) {
    return true;
  }

  return (
    assignedOperator === actor.adminUserId ||
    assignedOperator === actor.email ||
    assignedOperator === actor.displayName
  );
}

/**
 * GET /api/admin/attachments/[id]
 * 
 * Secure proxy for media attachments. 
 * Authenticates the admin, logs the download audit, and streams the file.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isUuidLike(id)) {
    return notFoundResponse();
  }

  // 1. Authenticate Admin (Case visibility implies attachment access)
  const actor = await requireAdminPermissionActor(
    prisma,
    request,
    CRM_SESSION_COOKIE_NAME,
    ['CRM_ATTACHMENT_READ']
  );
  if (!actor) {
    return await auditBlockedAttachmentDownload({
      attachmentId: id,
      caseId: null,
      reason: 'Unauthorized attachment access',
    });
  }

  // 2. Fetch Attachment Metadata
  const attachment = await prisma.attachment.findUnique({
    where: { id },
    select: {
      id: true,
      caseId: true,
      kind: true,
      storageProvider: true,
      storageKey: true,
      originalFilename: true,
      mimeType: true,
      byteSize: true,
      checksumSha256: true,
      width: true,
      height: true,
      durationSeconds: true,
      isCustomerVisible: true,
      case: {
        select: {
          assignedOperator: true,
        },
      },
    },
  });

  if (!attachment) {
    return await auditBlockedAttachmentDownload({
      attachmentId: id,
      caseId: null,
      reason: 'Attachment metadata not found',
      actor,
    });
  }

  if (actor.role === 'MANAGER' && !isActorAssignedToCase(actor, attachment.case?.assignedOperator ?? null)) {
    return await auditBlockedAttachmentDownload({
      attachmentId: id,
      caseId: attachment.caseId,
      reason: 'Case is not assigned to the current manager',
      actor,
    });
  }

  // 3. Secure Proxy Logic
  try {
    if (attachment.storageProvider === AttachmentStorageProvider.VERCEL_BLOB) {
      try {
        // Fetch from Vercel Blob with explicit access configuration
        const blobRes = await get(attachment.storageKey, {
          access: 'private',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        if (!blobRes || blobRes.statusCode !== 200) {
          throw new Error(blobRes ? `Unexpected blob status: ${blobRes.statusCode}` : 'Blob not found in storage');
        }

        const { stream, blob } = blobRes;

        // Audit the download
        await prisma.adminAuditLog.create({
          data: {
            actorSessionId: actor.sessionId,
            actorAdminUserId: actor.adminUserId,
            actorRole: actor.role,
            action: 'ATTACHMENT_DOWNLOADED',
            resourceType: 'ATTACHMENT',
            resourceId: attachment.id,
            caseId: attachment.caseId,
            details: {
              storageProvider: attachment.storageProvider,
              mimeType: attachment.mimeType || blob.contentType,
              byteSize: attachment.byteSize || Number(blob.size),
              isCustomerVisible: attachment.isCustomerVisible,
            },
            ipAddress: actor.ipAddress,
            userAgent: actor.userAgent,
          },
        });

        return new NextResponse(stream, {
          headers: createPrivateAttachmentHeaders(attachment, attachment.byteSize || Number(blob.size)),
        });
      } catch (error) {
        console.error('Vercel Blob proxy error:', error);
        return NextResponse.json({ error: 'Failed to load attachment' }, { status: 500 });
      }
    }

    // Local file fallback
    const file = await readSafeLocalAttachment(attachment.storageKey);
    
    // Audit the download
    await prisma.adminAuditLog.create({
      data: {
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
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      },
    });

    return new NextResponse(new Uint8Array(file), {
      headers: createPrivateAttachmentHeaders(attachment, file.byteLength),
    });
  } catch (error) {
    console.error('Admin attachment download error:', error);
    return NextResponse.json({ error: 'Failed to load attachment' }, { status: 500 });
  }
}

/**
 * Internal helper to create secure headers
 */
function createPrivateAttachmentHeaders(attachment: PrivateAttachmentHeaderInput, size: number) {
  const headers = new Headers();
  headers.set('Content-Type', attachment.mimeType || 'application/octet-stream');
  headers.set('Content-Length', size.toString());
  headers.set('Cache-Control', 'private, max-age=3600');
  
  // Set filename for downloads
  if (attachment.originalFilename) {
    headers.set('Content-Disposition', `inline; filename="${encodeURIComponent(attachment.originalFilename)}"`);
  }

  return headers;
}

/**
 * Audit failure if file missing
 */
async function auditBlockedAttachmentDownload(input: {
  attachmentId: string;
  caseId: string | null;
  reason: string;
  actor?: {
    sessionId: string;
    adminUserId: string;
    role: 'MANAGER' | 'OWNER';
    ipAddress: string | null;
    userAgent: string | null;
  };
}) {
  await prisma.adminAuditLog.create({
    data: {
      actorSessionId: input.actor?.sessionId ?? null,
      actorAdminUserId: input.actor?.adminUserId ?? null,
      actorRole: input.actor?.role ?? null,
      action: 'ATTACHMENT_DOWNLOAD_BLOCKED',
      resourceType: 'ATTACHMENT',
      resourceId: input.attachmentId,
      caseId: input.caseId,
      outcome: 'DENIED',
      reason: input.reason,
      ipAddress: input.actor?.ipAddress ?? null,
      userAgent: input.actor?.userAgent ?? null,
    },
  });

  return notFoundResponse();
}
