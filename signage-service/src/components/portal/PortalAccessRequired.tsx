import { Link } from '@/i18n/routing';

export default function PortalAccessRequired() {
  return (
    <main className="min-h-screen bg-[#F4EEE5] px-4 py-6 text-[#121826] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-3xl items-center justify-center">
        <section className="w-full rounded-[28px] border border-[#E4D8CA] bg-white p-8 text-center shadow-2xl shadow-[#3E2715]/10 sm:p-10">
          <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#B8643E]">
            Kundenportal
          </p>
          <h1 className="mt-4 text-[30px] font-black text-[#121826]">
            E-Mail-Bestaetigung erforderlich
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-6 text-[#667085]">
            Der Zugang zum Kundenportal wird ueber den Portal-Link aus Ihrer Anfrage und eine bestaetigte E-Mail-Adresse aktiviert.
          </p>
          <Link
            href="/status"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-[#B8643E] px-5 text-[14px] font-black text-white transition hover:bg-[#A65835]"
          >
            Anfrage-Status pruefen
          </Link>
        </section>
      </div>
    </main>
  );
}
