import { Link } from '@/i18n/routing';

export default async function PortalLoginVerifyPage() {
  return (
    <main className="min-h-screen bg-[#F4EEE5] px-4 py-6 text-[#121826] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-2xl items-center justify-center">
        <section className="w-full rounded-[28px] border border-[#E4D8CA] bg-white p-8 text-center shadow-2xl shadow-[#3E2715]/10">
          <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#B8643E]">
            Kundenportal
          </p>
          <h1 className="mt-4 text-[30px] font-black text-[#121826]">
            Login-Link nicht mehr aktiv
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-6 text-[#667085]">
            Das Kundenportal nutzt jetzt E-Mail-Code und Passwort. Bitte starten Sie den Login erneut.
          </p>
          <Link
            href="/portal"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-[#B8643E] px-5 text-[15px] font-black text-white"
          >
            Zum Kundenportal
          </Link>
        </section>
      </div>
    </main>
  );
}
