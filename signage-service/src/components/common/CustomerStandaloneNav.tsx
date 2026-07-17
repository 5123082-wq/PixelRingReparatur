'use client';

import { useLocale } from 'next-intl';

import { Link } from '@/i18n/routing';
import Logo from '@/components/common/Logo';

type CustomerStandaloneNavProps = {
  showPortal?: boolean;
  showStatus?: boolean;
  className?: string;
};

const COPY = {
  de: {
    aria: 'Navigation fuer externe Einstiegsseiten',
    site: 'Zur Website',
    status: 'Status pruefen',
    portal: 'Kundenportal',
    logo: 'PixelRing Website',
  },
  en: {
    aria: 'Navigation for external entry pages',
    site: 'Website',
    status: 'Check status',
    portal: 'Customer portal',
    logo: 'PixelRing website',
  },
  ru: {
    aria: 'Навигация для внешних входных страниц',
    site: 'На сайт',
    status: 'Проверить статус',
    portal: 'Кабинет',
    logo: 'Сайт PixelRing',
  },
  tr: {
    aria: 'Harici giris sayfalari icin gezinme',
    site: 'Web sitesi',
    status: 'Durumu kontrol et',
    portal: 'Portal',
    logo: 'PixelRing web sitesi',
  },
  pl: {
    aria: 'Nawigacja dla zewnetrznych stron wejscia',
    site: 'Na strone',
    status: 'Sprawdz status',
    portal: 'Panel klienta',
    logo: 'Strona PixelRing',
  },
  ar: {
    aria: 'التنقل لصفحات الدخول الخارجية',
    site: 'الموقع',
    status: 'التحقق من الحالة',
    portal: 'بوابة العميل',
    logo: 'موقع PixelRing',
  },
} as const;

function getCopy(locale: string) {
  return COPY[locale as keyof typeof COPY] ?? COPY.de;
}

export default function CustomerStandaloneNav({
  showPortal = true,
  showStatus = true,
  className = '',
}: CustomerStandaloneNavProps) {
  const copy = getCopy(useLocale());

  return (
    <nav
      aria-label={copy.aria}
      className={`flex w-full flex-col gap-3 border-b border-[#E2D6C8] pb-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <Link
        href="/"
        aria-label={copy.logo}
        className="inline-flex w-fit rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E]"
      >
        <Logo compact />
      </Link>

      <div className="flex flex-wrap gap-2 sm:justify-end">
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-[#D9C7BA] bg-white px-3 text-[13px] font-black text-[#121826] shadow-sm transition hover:border-[#B8643E] hover:text-[#B8643E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
        >
          {copy.site}
        </Link>
        {showStatus ? (
          <Link
            href="/status"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#D9C7BA] bg-white px-3 text-[13px] font-black text-[#667085] shadow-sm transition hover:border-[#B8643E] hover:text-[#B8643E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
          >
            {copy.status}
          </Link>
        ) : null}
        {showPortal ? (
          <Link
            href="/portal"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#121826] px-3 text-[13px] font-black text-white shadow-sm transition hover:bg-[#263247] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
          >
            {copy.portal}
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
