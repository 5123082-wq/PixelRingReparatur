import { NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/blob';
import path from 'path';
import fs from 'fs/promises';

import { prisma } from '@/lib/prisma';
import { CRM_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { requireAdminPermissionActor } from '@/lib/admin-audit';
import { AttachmentStorageProvider } from '@prisma/client';

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

  // 1. Authenticate Admin (Case visibility implies attachment access)
  const actor = await requireAdminPermissionActor(
    prisma,
    request,
    CRM_SESSION_COOKIE_NAME,
    ['CRM_ATTACHMENT_READ']
  );
  if (!actor) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Fetch Attachment Metadata
  const attachment = await prisma.attachment.findUnique({
    where: { id },
  });

  if (!attachment) {
    return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
  }

  // 3. Secure Proxy Logic
  try {
    if (attachment.storageProvider === AttachmentStorageProvider.VERCEL_BLOB) {
      try {
        // Fetch from Vercel Blob with explicit access configuration
        const { stream, blob } = await get(attachment.storageKey, {
          access: 'private',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });

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

        return new NextResponse(stream as any, {
          headers: createPrivateAttachmentHeaders(attachment, attachment.byteSize || Number(blob.size)),
        });
      } catch (error) {
        console.error('Vercel Blob proxy error:', error);
        return NextResponse.json(
          { 
            error: 'Failed to stream from cloud storage',
            details: error instanceof Error ? error.message : 'Unknown error',
            key: attachment.storageKey
          },
          { status: 502 }
        );
      }
    }

    // Local file fallback
    const file = await readLocalAttachment(attachment.storageKey);
    
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
function createPrivateAttachmentHeaders(attachment: any, size: number) {
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
 * Local storage reading helper
 */
async function readLocalAttachment(storageKey: string): Promise<Buffer> {
  const absolutePath = path.isAbsolute(storageKey) 
    ? storageKey 
    : path.resolve(process.cwd(), storageKey);
    
  return await fs.readFile(absolutePath);
}

/**
 * Audit failure if file missing
 */
async function auditBlockedAttachmentDownload(attachmentId: string, caseId: string | null, reason: string) {
  return NextResponse.json({ error: reason }, { status: 404 });
}
