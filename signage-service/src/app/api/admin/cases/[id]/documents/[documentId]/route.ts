import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { documentActor, documentAudit, documentFile, documentFailure } from '@/lib/case-documents/service';
import { DocumentError, DOCUMENT_ID } from '@/lib/case-documents/types';
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; documentId: string }> }) {
  try {
    const { id, documentId } = await params;
    const actor = await documentActor(request, id);
    if (!DOCUMENT_ID.test(documentId)) throw new DocumentError('not_found', 404);
    const row = await prisma.caseDocument.findFirst({ where: { id: documentId, caseId: id }, include: { attachment: true } });
    if (!row) throw new DocumentError('not_found', 404);
    const response = await documentFile(row.attachment, request.nextUrl.searchParams.get('download') === '1');
    await documentAudit(prisma, actor, 'CASE_DOCUMENT_DOWNLOADED', id, row.id);
    return response;
  } catch (error) { return documentFailure(error); }
}
