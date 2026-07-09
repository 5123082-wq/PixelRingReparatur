import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TextSection from '@/components/sections/TextSection';
import { getGlobalPageCmsContent, getPublishedCmsPage } from '@/lib/cms/pages';
import {
  CODE_OWNED_LEGAL_CONTENT,
  LEGAL_NOTICE_BY_LOCALE,
  containsStaleLegalContent,
} from '@/lib/legal-content';
import { buildLocaleUrl } from '@/lib/seo';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Footer' });
  return {
    title: `${t('impressum')} | PixelRing`,
    alternates: {
      canonical: buildLocaleUrl(locale, '/impressum'),
    },
  };
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const legalNotice = LEGAL_NOTICE_BY_LOCALE[locale] ?? LEGAL_NOTICE_BY_LOCALE.en;
  
  const [globalCms, legalCms] = await Promise.all([
    getGlobalPageCmsContent(locale),
    // Fetch only German content for legal documents
    getPublishedCmsPage('impressum', 'de'),
  ]);
  const cmsText = legalCms?.blocks
    ?.map((block) => `${String(block.title ?? '')}\n${String(block.description ?? '')}`)
    .join('\n') ?? '';
  const legalBlocks = legalCms?.blocks ?? [];
  const useCmsLegalContent = legalBlocks.length > 0 && !containsStaleLegalContent('impressum', cmsText);
  const fallbackContent = CODE_OWNED_LEGAL_CONTENT.impressum;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E8]">
      <Header content={globalCms?.header} />
      <main className="flex-1">
        <div className="pt-24 pb-12 px-6 sm:px-10 max-w-7xl mx-auto">
           <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm mb-8">
             {legalNotice}
           </div>
        </div>
        
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
      </main>
      <Footer content={globalCms?.footer} />
    </div>
  );
}
