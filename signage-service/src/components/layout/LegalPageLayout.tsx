import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from './Header';
import Footer from './Footer';
import { getGlobalPageCmsContent } from '@/lib/cms/pages';
import { SITE_LOCALES, type SiteLocale } from '@/lib/seo';

export default async function LegalPageLayout({ children }: { children: ReactNode }) {
  const savedLocale = (await cookies()).get('pixelring_legal_navigation_locale')?.value;
  const locale = SITE_LOCALES.includes(savedLocale as SiteLocale)
    ? savedLocale as SiteLocale
    : 'de';
  const [messages, globalCms] = await Promise.all([
    getMessages({ locale }),
    getGlobalPageCmsContent(locale),
  ]);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen flex flex-col bg-[#F7F1E8]">
        <div lang={locale} dir={dir}>
          <Header content={globalCms?.header} />
        </div>
        <main lang="de" dir="ltr" className="flex-1">{children}</main>
        <div lang={locale} dir={dir}>
          <Footer content={globalCms?.footer} />
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
