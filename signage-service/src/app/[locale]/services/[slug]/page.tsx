import { redirect } from 'next/navigation';

const serviceTargets: Record<string, string> = {
  'sign-repair': '/leistungen/werbeanlagen-reparatur',
  installation: '/leistungen/montage-demontage-werbeanlagen',
  'light-advertising': '/leistungen/lichtwerbung-led-modernisierung',
  branding: '/leistungen/druckprodukte-branding-werbematerialien',
  maintenance: '/service',
};

export default async function LegacyServiceRedirectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  redirect(`/${locale}${serviceTargets[slug] ?? '/leistungen'}`);
}
