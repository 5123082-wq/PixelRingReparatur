import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { portalDocumentCase, documentView, documentFailure } from '@/lib/case-documents/service';
export async function GET(request: NextRequest, { params }: { params: Promise<{ publicRequestNumber: string }> }) {
  try {
    const { publicRequestNumber } = await params;
    const caseId = await portalDocumentCase(request, publicRequestNumber);
    const rows = await prisma.caseDocument.findMany({ where: { caseId, publishedAt: { not: null } }, include: { attachment: true }, orderBy: { publishedAt: 'desc' } });
    return NextResponse.json(rows.map(documentView), { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return documentFailure(error); }
}
