import PortalRequestModalShell from '@/components/portal/PortalRequestModalShell';
import { getLocale } from 'next-intl/server';
import { getAttentionCopy } from '@/lib/portal-attention/copy';
export default async function Loading() {
  const locale = await getLocale();
  return <PortalRequestModalShell><section role="status" dir={locale === 'ar' ? 'rtl' : undefined} className="h-[88vh] w-[92vw] rounded-[28px] border bg-white p-6 text-sm text-slate-600">{getAttentionCopy(locale).loading}<div aria-hidden="true" className="mt-4 h-20 animate-pulse rounded-xl bg-slate-100" /></section></PortalRequestModalShell>;
}
