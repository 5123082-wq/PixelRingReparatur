import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { portalDocumentCase, documentFile, documentFailure } from '@/lib/case-documents/service';
import { DocumentError, DOCUMENT_ID } from '@/lib/case-documents/types';
export async function GET(request: NextRequest, { params }: { params: Promise<{ publicRequestNumber: string; documentId: string }> }) {
  try {
    const { publicRequestNumber, documentId } = await params;
    if (!DOCUMENT_ID.test(documentId)) throw new DocumentError('not_found', 404);
    const caseId = await portalDocumentCase(request, publicRequestNumber);
    const row = await prisma.caseDocument.findFirst({ where: { id: documentId, caseId, publishedAt: { not: null } }, include: { attachment: true } });
    if (!row) throw new DocumentError('not_found', 404);
    return await documentFile(row.attachment, request.nextUrl.searchParams.get('download') === '1');
  } catch (error) { return documentFailure(error); }
}
