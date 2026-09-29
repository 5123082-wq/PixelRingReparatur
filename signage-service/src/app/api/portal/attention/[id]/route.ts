import { NextRequest } from 'next/server';
import { mutateAttention, attentionJson } from '@/lib/portal-attention/service';
import { documentFailure } from '@/lib/case-documents/service';
import { validatePortalMutationRequest } from '@/lib/portal/mutation-guard';
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = validatePortalMutationRequest(request); if (guard) return guard;
  try { return attentionJson(await mutateAttention(request, (await params).id, await request.json().catch(() => null))); }
  catch (error) { return documentFailure(error); }
}
