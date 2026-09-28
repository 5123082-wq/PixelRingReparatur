import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPortalSessionContext, PORTAL_SESSION_COOKIE_NAME } from '@/lib/portal/auth';
import { getPublicWorkResult } from '@/lib/work-results/service';
import { readWorkResultFile } from '@/lib/work-results/files';
export async function GET(request: NextRequest, { params }: { params: Promise<{ publicRequestNumber: string; photoId: string }> }) {
  const missing = () => NextResponse.json({ error: 'Not found' }, { status: 404, headers: { 'Cache-Control': 'private, no-store' } });
  const { publicRequestNumber, photoId } = await params;
  const session = await getPortalSessionContext(prisma, request.cookies.get(PORTAL_SESSION_COOKIE_NAME)?.value);
  if (!session) return missing();
  const result = await getPublicWorkResult(session.portalUserId, publicRequestNumber);
  if (!result?.photos.some((photo) => photo.id === photoId)) return missing();
  const photo = await prisma.workResultPhoto.findUnique({ where: { id: photoId }, include: { attachment: true } });
  if (!photo || photo.revisionId !== result.id) return missing();
  try {
    const buffer = await readWorkResultFile(photo.attachment);
    return new NextResponse(new Uint8Array(buffer), { headers: {
      'Content-Type': photo.attachment.mimeType,
      'Content-Length': String(buffer.length),
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    } });
  } catch { return missing(); }
}
