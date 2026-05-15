import PortalClaimVerifyForm from '@/components/portal/PortalClaimVerifyForm';

function InvalidVerification() {
  return (
    <main className="min-h-screen bg-[#F4EEE5] px-4 py-6 text-[#121826] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-3xl items-center justify-center">
        <section className="w-full rounded-[28px] border border-[#E4D8CA] bg-white p-8 text-center shadow-2xl shadow-[#3E2715]/10 sm:p-10">
          <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#B8643E]">
            Kundenportal
          </p>
          <h1 className="mt-4 text-[30px] font-black text-[#121826]">
            Bestaetigungslink pruefen
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-6 text-[#667085]">
            Der Link fehlt oder ist nicht vollstaendig. Bitte oeffnen Sie den Link direkt aus der E-Mail.
          </p>
        </section>
      </div>
    </main>
  );
}

export default async function PortalClaimVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <InvalidVerification />;
  }

  return (
    <main className="min-h-screen bg-[#F4EEE5] px-4 py-6 text-[#121826] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-3xl items-center justify-center">
        <section className="w-full rounded-[28px] border border-[#E4D8CA] bg-white p-8 shadow-2xl shadow-[#3E2715]/10 sm:p-10">
          <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#B8643E]">
            Kundenportal
          </p>
          <h1 className="mt-4 text-[30px] font-black text-[#121826]">
            E-Mail-Adresse bestaetigen
          </h1>
          <p className="mt-4 max-w-xl text-[14px] leading-6 text-[#667085]">
            Klicken Sie auf die Bestaetigung, um Ihr Kundenportal zu oeffnen.
          </p>
          <div className="mt-8">
            <PortalClaimVerifyForm token={token} />
          </div>
        </section>
      </div>
    </main>
  );
}
