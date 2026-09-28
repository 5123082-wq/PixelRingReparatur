import { redirect } from 'next/navigation';

export default async function ReportPage({ params }: {
  params: Promise<{ locale: string; publicRequestNumber: string }>;
}) {
  const { locale, publicRequestNumber } = await params;
  // Previously sent report links now open the full request workspace.
  redirect('/' + locale + '/portal/requests/' + encodeURIComponent(publicRequestNumber));
}
