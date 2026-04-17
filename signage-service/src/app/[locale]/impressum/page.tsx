import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TextSection from '@/components/sections/TextSection';
import { getGlobalPageCmsContent, getPublishedCmsPage } from '@/lib/cms/pages';
import { getTranslations } from 'next-intl/server';

const LEGAL_NOTICE_BY_LOCALE: Record<string, string> = {
  de: 'Dieses Dokument ist rechtlich bindend in seiner deutschen Fassung.',
  en: 'This document is legally binding in its German version. The original German text is shown below.',
  ru: 'Этот документ имеет юридическую силу только в немецкой версии. Ниже показан оригинальный немецкий текст.',
  tr: 'Bu belge yalnizca Almanca surumunde hukuken baglayicidir. Asagida orijinal Almanca metin gosterilmektedir.',
  pl: 'Ten dokument jest prawnie wiazacy wylacznie w wersji niemieckiej. Ponizej pokazano oryginalny tekst niemiecki.',
  ar: 'هذا المستند ملزم قانونيا فقط بنسخته الالمانية. يعرض ادناه النص الالماني الاصلي.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Footer' });
  return {
    title: `${t('impressum')} | PixelRing`,
  };
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Footer' });
  const legalNotice = LEGAL_NOTICE_BY_LOCALE[locale] ?? LEGAL_NOTICE_BY_LOCALE.en;
  
  const [globalCms, legalCms] = await Promise.all([
    getGlobalPageCmsContent(locale),
    // Fetch only German content for legal documents
    getPublishedCmsPage('impressum', 'de'),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E8]">
      <Header content={globalCms?.header} />
      <main className="flex-1">
        <div className="pt-24 pb-12 px-6 sm:px-10 max-w-7xl mx-auto">
           <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm mb-8">
             {legalNotice}
           </div>
        </div>
        
        {legalCms?.blocks && legalCms.blocks.length > 0 ? (
          legalCms.blocks.map((block) => {
            if (block.type === 'textSection') {
              return <TextSection key={block.key} content={{ 
                title: block.title as string, 
                description: block.description as string 
              }} />;
            }
            return null;
          })
        ) : (
          <section className="py-24 px-6 sm:px-10 bg-white">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">{t('impressum')}</h1>
              <p className="text-gray-500">Inhalt wird im CMS gepflegt.</p>
            </div>
          </section>
        )}
      </main>
      <Footer content={globalCms?.footer} />
    </div>
  );
}
