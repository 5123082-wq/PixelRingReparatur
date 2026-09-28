import { validateAdminCsrf } from '@/lib/admin-csrf';
import { NextRequest, NextResponse } from 'next/server';
import { workResultActor, workResultFailure, limitWorkResultMutation } from '@/lib/work-results/access';
import { getAdminWorkResult, saveWorkResult, publishWorkResult } from '@/lib/work-results/service';
import { deliverWorkResultNotifications } from '@/lib/work-results/notifications';
import { WorkResultError } from '@/lib/work-results/types';
import { publishCaseRealtimeEvent } from '@/lib/realtime';

type Context = { params: Promise<{ id: string }> };
export async function GET(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const actor = await workResultActor(request, id);
    return NextResponse.json({ ...(await getAdminWorkResult(id)), role: actor.role }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return workResultFailure(error); }
}
export async function PATCH(request: NextRequest, { params }: Context) {
  const guard = validateAdminCsrf(request); if (guard) return guard;
  try {
    const { id } = await params;
    const actor = await workResultActor(request, id, true);
    limitWorkResultMutation(actor.adminUserId);
    const body = await request.json();
    return NextResponse.json(await saveWorkResult(id, actor, body?.version, body?.draft));
  } catch (error) { return workResultFailure(error); }
}
export async function POST(request: NextRequest, { params }: Context) {
  const guard = validateAdminCsrf(request); if (guard) return guard;
  try {
    const { id } = await params;
    const actor = await workResultActor(request, id, true);
    limitWorkResultMutation(actor.adminUserId);
    const body = await request.json();
    if (body?.action === 'publish') {
      await publishWorkResult(id, actor, body.version);
      await publishCaseRealtimeEvent({ caseId: id, reason: 'case.updated' }).catch(() => undefined);
    } else if (body?.action !== 'retry-notification') throw new WorkResultError('invalid_input');
    // Delivery is outside the publication transaction; failure cannot undo the report.
    await deliverWorkResultNotifications(id, body.action === 'retry-notification').catch(() => undefined);
    return NextResponse.json(await getAdminWorkResult(id));
  } catch (error) { return workResultFailure(error); }
}
