import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ServiceLandingPage from '@/components/service/ServiceLandingPage';
import { CMS_SESSION_COOKIE_NAME, requireAdminSession } from '@/lib/admin-auth';
import { getGlobalPageCmsContent, getServicePageCmsContent } from '@/lib/cms/pages';
import { prisma } from '@/lib/prisma';

type ServicePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cmsPreview?: string | string[] }>;
};

const SERVICE_PAGE_PUBLIC_ENABLED = process.env.SERVICE_PAGE_PUBLIC_ENABLED === 'true';
const SERVICE_PAGE_CMS_PREVIEW_ENABLED = process.env.SERVICE_PAGE_CMS_PREVIEW_ENABLED !== 'false';

function isCmsPreview(value: string | string[] | undefined): boolean {
  if (!value) return false;
  const values = Array.isArray(value) ? value : [value];
  return values.includes('1') || values.includes('2026');
}

async function hasOwnerCmsSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CMS_SESSION_COOKIE_NAME)?.value;
  const actor = await requireAdminSession(prisma, token, ['OWNER']);

  return Boolean(actor);
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { locale } = await params;
  const content = SERVICE_PAGE_PUBLIC_ENABLED
    ? await getServicePageCmsContent(locale)
    : null;

  return {
    title: content?.metaTitle ?? 'PixelRing Service | Standort-Abo, Audit & Wartung',
    description:
      content?.metaDescription ??
      'PixelRing Service-Draft für Standort-Abo, Audit, Wartung, Reports und planbare Betreuung sichtbarer Markenflächen.',
    alternates: {
      canonical: `/${locale}/service`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ServicePage({ params, searchParams }: ServicePageProps) {
  const { locale } = await params;
  const query = await searchParams;
  const previewRequested = isCmsPreview(query.cmsPreview);
  const publicEnabled = SERVICE_PAGE_PUBLIC_ENABLED;
  const hasSecretAccess = Array.isArray(query.cmsPreview)
    ? query.cmsPreview.includes('2026')
    : query.cmsPreview === '2026';
  const previewAllowed =
    SERVICE_PAGE_CMS_PREVIEW_ENABLED &&
    previewRequested &&
    (hasSecretAccess || (await hasOwnerCmsSession()));

  if (!publicEnabled && !previewAllowed) {
    notFound();
  }

  const content = await getServicePageCmsContent(locale, { includeDraft: previewAllowed });

  if (!content) {
    if (previewAllowed) {
      const globalCms = await getGlobalPageCmsContent(locale);

      return (
        <div className="min-h-screen bg-[#F7F1E8] text-[#0D1B2A]">
          <Header content={globalCms?.header} />
          <main className="px-6 py-24">
            <section className="mx-auto max-w-3xl rounded-[28px] border border-[#E7DDD3] bg-[#FFFDF9] p-8 shadow-sm">
              <p className="text-sm font-black uppercase text-[#B8643E]">Internal CMS preview</p>
              <h1 className="mt-4 text-3xl font-black leading-tight">
                Service draft content is missing for {locale.toUpperCase()}.
              </h1>
              <p className="mt-4 leading-7 text-[#4A5568]">
                Create or seed the Page CMS record with page key <b>service</b>, keep it as DRAFT,
                then reopen this hidden preview.
              </p>
            </section>
          </main>
          <Footer content={globalCms?.footer} />
        </div>
      );
    }

    notFound();
  }

  const globalCms = await getGlobalPageCmsContent(locale);

  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#0D1B2A]">
      <Header content={globalCms?.header} />
      <ServiceLandingPage content={content} locale={locale} preview={previewAllowed} />
      <Footer content={globalCms?.footer} />
    </div>
  );
}
