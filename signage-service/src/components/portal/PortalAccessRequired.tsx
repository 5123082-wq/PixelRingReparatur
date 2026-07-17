import { Link } from '@/i18n/routing';
import CustomerStandaloneNav from '@/components/common/CustomerStandaloneNav';
import { getPortalStandaloneCopy } from './portal-standalone-copy';

export default function PortalAccessRequired({ locale }: { locale?: string | null }) {
  const copy = getPortalStandaloneCopy(locale);

  return (
    <main className="min-h-screen bg-[#F4EEE5] text-[#121826]">
      <div className="pr-site-container py-4">
      <CustomerStandaloneNav />
      <div className="mx-auto flex min-h-[calc(100vh-104px)] max-w-3xl items-center justify-center py-6">
        <section className="w-full rounded-[28px] border border-[#E4D8CA] bg-white p-8 text-center shadow-2xl shadow-[#3E2715]/10 sm:p-10">
          <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#B8643E]">
            {copy.common.portal}
          </p>
          <h1 className="mt-4 text-[30px] font-black text-[#121826]">
            {copy.accessRequired.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-6 text-[#667085]">
            {copy.accessRequired.body}
          </p>
          <Link
            href="/status"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-[#B8643E] px-5 text-[14px] font-black text-white transition hover:bg-[#A65835]"
          >
            {copy.accessRequired.button}
          </Link>
        </section>
      </div>
      </div>
    </main>
  );
}
