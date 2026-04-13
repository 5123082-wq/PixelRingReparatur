import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StatusLookup from '@/components/status/StatusLookup';
import { getStatusPageCmsContent } from '@/lib/cms/pages';

export default async function StatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: { request?: string } | Promise<{ request?: string }>;
}) {
  const { locale } = await params;
  const query = await Promise.resolve(searchParams ?? {});
  const cmsContent = await getStatusPageCmsContent(locale);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E8]">
      <Header />
      <main className="flex-1">
        <StatusLookup initialRequestNumber={query?.request ?? ''} cmsContent={cmsContent} />
      </main>
      <Footer />
    </div>
  );
}
