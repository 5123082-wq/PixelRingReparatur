import { deliverAttentionEmails } from '@/lib/portal-attention/delivery';
import { validCronAuthorization } from '@/lib/portal-attention/delivery-policy';
import { deliverPendingPortalOperatorAlerts } from '@/lib/portal-operator/notify';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export async function GET(request: Request) {
  if (!validCronAuthorization(request.headers.get('authorization'), process.env.CRON_SECRET)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const [emails, alerts] = await Promise.allSettled([deliverAttentionEmails(), deliverPendingPortalOperatorAlerts()]);
  if (alerts.status === 'rejected') console.error('Scheduled operator alerts failed');
  else if (alerts.value.remaining) console.warn('Scheduled operator alerts remain pending', alerts.value);
  if (emails.status === 'rejected') throw emails.reason;
  return Response.json({ ...emails.value, operatorAlerts: alerts.status === 'fulfilled' ? alerts.value : { checked: 0, failed: 1 } },
    { headers: { 'Cache-Control': 'private, no-store' } });
}
