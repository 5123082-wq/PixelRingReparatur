import { redirect } from 'next/navigation';

export default async function ContactRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  redirect(`/${locale}/#kontakt`);
}
