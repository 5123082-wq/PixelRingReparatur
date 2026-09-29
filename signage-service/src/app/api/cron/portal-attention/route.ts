import { deliverAttentionEmails } from '@/lib/portal-attention/delivery';
import { validCronAuthorization } from '@/lib/portal-attention/delivery-policy';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export async function GET(request: Request) {
  if (!validCronAuthorization(request.headers.get('authorization'), process.env.CRON_SECRET)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return Response.json(await deliverAttentionEmails(), { headers: { 'Cache-Control': 'private, no-store' } });
}
