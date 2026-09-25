import LegalPageLayout from '@/components/layout/LegalPageLayout';
import CookieConsentSettings from '@/components/analytics/CookieConsentSettings';
import TextSection from '@/components/sections/TextSection';
import { getPublishedCmsPage } from '@/lib/cms/pages';
import {
  CODE_OWNED_LEGAL_CONTENT,
  containsStaleLegalContent,
} from '@/lib/legal-content';
import { buildLocaleUrl } from '@/lib/seo';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Footer' });
  return {
    title: `${t('privacy')} | PixelRing`,
    alternates: {
      canonical: buildLocaleUrl(locale, '/privacy'),
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const legalCms = await getPublishedCmsPage('privacy', 'de');
  const cmsText = legalCms?.blocks
    ?.map((block) => `${String(block.title ?? '')}\n${String(block.description ?? '')}`)
    .join('\n') ?? '';
  const legalBlocks = legalCms?.blocks ?? [];
  const useCmsLegalContent = legalBlocks.length > 0 && !containsStaleLegalContent('privacy', cmsText);
  const fallbackContent = CODE_OWNED_LEGAL_CONTENT.privacy;

  return (
    <LegalPageLayout>
      {useCmsLegalContent ? (
        legalBlocks.map((block) => {
          if (block.type === 'textSection') {
            return <TextSection key={block.key} content={{
              title: block.title as string,
              description: block.description as string
            }} />;
          }
          return null;
        })
      ) : (
        <TextSection content={fallbackContent} />
      )}
      <CookieConsentSettings locale={locale} />
    </LegalPageLayout>
  );
}
