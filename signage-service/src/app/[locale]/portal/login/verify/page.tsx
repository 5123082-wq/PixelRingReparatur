import { Link } from '@/i18n/routing';
import CustomerStandaloneNav from '@/components/common/CustomerStandaloneNav';
import { getPortalStandaloneCopy } from '@/components/portal/portal-standalone-copy';

export default async function PortalLoginVerifyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = getPortalStandaloneCopy(locale);

  return (
    <main className="min-h-screen bg-[#F4EEE5] px-4 py-4 text-[#121826] sm:px-6 lg:px-8">
      <CustomerStandaloneNav />
      <div className="mx-auto flex min-h-[calc(100vh-104px)] max-w-2xl items-center justify-center py-6">
        <section className="w-full rounded-[28px] border border-[#E4D8CA] bg-white p-8 text-center shadow-2xl shadow-[#3E2715]/10">
          <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#B8643E]">
            {copy.common.portal}
          </p>
          <h1 className="mt-4 text-[30px] font-black text-[#121826]">
            {copy.loginVerify.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-6 text-[#667085]">
            {copy.loginVerify.body}
          </p>
          <Link
            href="/portal"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-[#B8643E] px-5 text-[15px] font-black text-white"
          >
            {copy.loginVerify.button}
          </Link>
        </section>
      </div>
    </main>
  );
}
