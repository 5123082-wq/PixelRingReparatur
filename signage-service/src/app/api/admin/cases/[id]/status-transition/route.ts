export const maxDuration = 60;
import { after } from 'next/server';
import { deliverAttentionEmails } from '@/lib/portal-attention/delivery';
import { NextRequest, NextResponse } from 'next/server';
import { CRM_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { requireAdminPermissionActor } from '@/lib/admin-audit';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import { prisma } from '@/lib/prisma';
import { advanceCaseStatus } from '@/lib/case-status-transition';
import { limitWorkResultMutation, workResultFailure } from '@/lib/work-results/access';
import { deliverWorkResultNotifications } from '@/lib/work-results/notifications';
import { publishCaseRealtimeEvent } from '@/lib/realtime';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = validateAdminCsrf(request); if (guard) return guard;
  try {
    const actor = await requireAdminPermissionActor(prisma, request, CRM_SESSION_COOKIE_NAME, ['CRM_CASE_UPDATE']);
    const { id } = await params;
    if (!actor || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    limitWorkResultMutation(actor.adminUserId);
    const result = await advanceCaseStatus(id, actor, await request.json());
    if (result.outcome !== 'requires_input') {
      after(() => deliverAttentionEmails({ caseId: id }).then(() => undefined));
      await publishCaseRealtimeEvent({ caseId: id, reason: 'status.changed' }).catch(() => undefined);
      if (result.state.status === 'WORK_COMPLETED') await deliverWorkResultNotifications(id).catch(() => undefined);
    }
    return NextResponse.json(result, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return workResultFailure(error); }
}
