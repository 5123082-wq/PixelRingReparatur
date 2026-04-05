import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StatusLookup from '@/components/status/StatusLookup';

export default async function StatusPage({
  searchParams,
}: {
  searchParams?: { request?: string } | Promise<{ request?: string }>;
}) {
  const params = await Promise.resolve(searchParams ?? {});

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E8]">
      <Header />
      <main className="flex-1">
        <StatusLookup initialRequestNumber={params?.request ?? ''} />
      </main>
      <Footer />
    </div>
  );
}
