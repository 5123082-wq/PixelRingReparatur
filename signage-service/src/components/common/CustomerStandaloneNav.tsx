'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';

import { Link } from '@/i18n/routing';
import Logo from '@/components/common/Logo';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

type CustomerStandaloneNavProps = {
  appearance?: 'default' | 'portal-entry';
  showPortal?: boolean;
  showStatus?: boolean;
  className?: string;
};

const COPY = {
  de: {
    aria: 'Navigation für externe Einstiegsseiten',
    site: 'Zur Website',
    status: 'Status prüfen',
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
  appearance = 'default',
  showPortal = true,
  showStatus = true,
  className = '',
}: CustomerStandaloneNavProps) {
  const copy = getCopy(useLocale());

  if (appearance === 'portal-entry') {
    const linkClass = 'inline-flex min-h-11 items-center justify-center rounded-lg px-1 text-center text-[12px] font-semibold text-[#414B59] transition hover:text-[#B8643E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E] sm:px-2 sm:text-[14px]';

    return (
      <nav aria-label={copy.aria} className={`flex min-h-[64px] w-full items-center justify-between gap-2 border-b border-[#E2D6C8] py-3 ${className}`}>
        <Link href="/" aria-label={copy.logo} className="min-w-0 shrink rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E]">
          <Image src="/brand/logo-full-light.svg" alt="PixelRing Technical Service" width={794} height={132} priority className="hidden h-10 w-auto sm:block" />
          <Image src="/brand/logo-compact-light.svg" alt="PixelRing Technical Service" width={520} height={132} priority className="h-auto w-[104px] max-w-full sm:hidden" />
        </Link>
        <div className="flex shrink-0 items-center gap-1 sm:gap-4">
          <Link href="/" className={linkClass}>{copy.site}</Link>
          {showStatus && <Link href="/status" className={`${linkClass} max-w-[76px] sm:max-w-none`}>{copy.status}</Link>}
          <LanguageSwitcher />
        </div>
      </nav>
    );
  }

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
