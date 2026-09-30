import { NextRequest, NextResponse } from 'next/server';
import { CRM_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { requireAdminPermissionActor } from '@/lib/admin-audit';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import { prisma } from '@/lib/prisma';
import { updatePresence } from '@/lib/portal-operator/state';
import { notifyPortalOperator } from '@/lib/portal-operator/notify';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;
  const actor = await requireAdminPermissionActor(prisma, request, CRM_SESSION_COOKIE_NAME, ['CRM_CASE_READ']);
  if (!actor) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { id } = await params;
  const body = await request.json().catch(() => null) as { tabId?: unknown; sequence?: unknown; active?: unknown } | null;
  if (!uuid.test(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (typeof body?.tabId !== 'string' || !uuid.test(body.tabId) || typeof body.sequence !== 'number' ||
    !Number.isInteger(body.sequence) || body.sequence < 1 || body.sequence > 2147483647 || typeof body.active !== 'boolean') {
    return NextResponse.json({ error: 'Invalid presence' }, { status: 400 });
  }
  const ok = await updatePresence(prisma, { caseId: id, actor, tabId: body.tabId, sequence: body.sequence, active: body.active });
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await notifyPortalOperator(id);
  return NextResponse.json({ success: true });
}
