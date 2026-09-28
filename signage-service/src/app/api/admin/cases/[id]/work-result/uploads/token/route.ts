import { validateAdminCsrf } from '@/lib/admin-csrf';
import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { prisma } from '@/lib/prisma';
import { workResultActor, workResultFailure, limitWorkResultMutation } from '@/lib/work-results/access';
import { workResultMaxBytes } from '@/lib/work-results/files';
import { WorkResultError } from '@/lib/work-results/types';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = validateAdminCsrf(request); if (guard) return guard;
  try {
    const { id } = await params;
    const actor = await workResultActor(request, id, true);
    limitWorkResultMutation(actor.adminUserId);
    if (!process.env.BLOB_READ_WRITE_TOKEN) throw new WorkResultError('storage_unavailable', 503);
    const body = await request.json() as HandleUploadBody;
    // Finalization is performed by the authenticated upload endpoint, not a callback.
    if (body.type !== 'blob.generate-client-token') throw new WorkResultError('invalid_input');
    const result = await handleUpload({
      request, body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!clientPayload || !/^[0-9a-f-]{36}$/i.test(clientPayload)) throw new WorkResultError('invalid_input');
        const upload = await prisma.workResultUpload.findFirst({ where: {
          id: clientPayload, caseId: id, adminUserId: actor.adminUserId, pathname,
          attachmentId: null, expiresAt: { gt: new Date() },
        } });
        if (!upload) throw new WorkResultError('not_found', 404);
        return { allowedContentTypes: [upload.mimeType], maximumSizeInBytes: workResultMaxBytes(),
          validUntil: upload.expiresAt.getTime(), addRandomSuffix: false, allowOverwrite: false };
      },
    });
    return NextResponse.json(result);
  } catch (error) { return workResultFailure(error); }
}
