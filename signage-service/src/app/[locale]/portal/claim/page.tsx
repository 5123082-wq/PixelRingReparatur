import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import CustomerStandaloneNav from '@/components/common/CustomerStandaloneNav';
import PortalClaimForm from '@/components/portal/PortalClaimForm';
import { getPortalStandaloneCopy } from '@/components/portal/portal-standalone-copy';
import { prisma } from '@/lib/prisma';
import { getPortalSessionContext, PORTAL_SESSION_COOKIE_NAME } from '@/lib/portal/auth';
import { getPortalClaimContext } from '@/lib/portal/claim';

function InvalidClaim({ locale }: { locale: string }) {
  const copy = getPortalStandaloneCopy(locale);

  return (
    <main className="min-h-screen bg-[#F4EEE5] px-4 py-4 text-[#121826] sm:px-6 lg:px-8">
      <CustomerStandaloneNav />
      <div className="mx-auto flex min-h-[calc(100vh-104px)] max-w-3xl items-center justify-center py-6">
        <section className="w-full rounded-[28px] border border-[#E4D8CA] bg-white p-8 text-center shadow-2xl shadow-[#3E2715]/10 sm:p-10">
          <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#B8643E]">
            {copy.common.portal}
          </p>
          <h1 className="mt-4 text-[30px] font-black text-[#121826]">
            {copy.invalidClaim.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-6 text-[#667085]">
            {copy.invalidClaim.body}
          </p>
        </section>
      </div>
    </main>
  );
}

export default async function PortalClaimPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;

  if (!locale) {
    notFound();
  }

  const { token } = await searchParams;
  const claim = await getPortalClaimContext(prisma, token);
  const cookieStore = await cookies();
  const portalSession = await getPortalSessionContext(
    prisma,
    cookieStore.get(PORTAL_SESSION_COOKIE_NAME)?.value
  );

  if (!claim.ok) {
    return <InvalidClaim locale={locale} />;
  }

  return (
    <PortalClaimForm
      token={claim.token}
      publicRequestNumber={claim.publicRequestNumber}
      prefillEmail={claim.prefillEmail}
      expiresAt={claim.expiresAt}
      isAuthenticated={Boolean(portalSession)}
    />
  );
}
