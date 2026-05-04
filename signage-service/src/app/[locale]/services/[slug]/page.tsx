import { redirect } from 'next/navigation';

const serviceTargets: Record<string, string> = {
  'sign-repair': '/leistungen',
  installation: '/leistungen',
  'light-advertising': '/leistungen',
  branding: '/leistungen',
  maintenance: '/leistungen',
};

export default async function LegacyServiceRedirectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  redirect(`/${locale}${serviceTargets[slug] ?? '/leistungen'}`);
}
