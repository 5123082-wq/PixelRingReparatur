import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { attentionSession, attentionJson, listAttention } from '@/lib/portal-attention/service';
import { ATTENTION_LOCALES } from '@/lib/portal-attention/types';
import { documentFailure } from '@/lib/case-documents/service';
import { DocumentError } from '@/lib/case-documents/types';
import { validatePortalMutationRequest } from '@/lib/portal/mutation-guard';
export async function GET(request: NextRequest) {
  try { const session = await attentionSession(request);
    return attentionJson({ ...(await listAttention(session.portalUserId, request.nextUrl.searchParams.get('locale') || 'de', request.nextUrl.searchParams.get('publicRequestNumber'))), portalUserId: session.portalUserId });
  } catch (error) { return documentFailure(error); }
}
export async function POST(request: NextRequest) {
  const guard = validatePortalMutationRequest(request); if (guard) return guard;
  try { const session = await attentionSession(request, true); const body = await request.json().catch(() => null);
    if (!body || !ATTENTION_LOCALES.includes(body.locale)) throw new DocumentError('invalid_input');
    await prisma.portalUser.update({ where: { id: session.portalUserId }, data: { preferredLocale: body.locale } });
    return attentionJson({ success: true });
  } catch (error) { return documentFailure(error); }
}
