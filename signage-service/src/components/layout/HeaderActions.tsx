'use client';

import { Link } from '@/i18n/routing';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ServiceActionButton from '../common/ServiceActionButton';

export default function HeaderActions({
  accountStatusHref,
  accountStatusLabel,
  requestHref,
  requestLabel,
  isMenuOpen,
  activeNavHref,
  onOpenContact,
  onOpenChat,
  onToggleMenu,
}: {
  accountStatusHref: string;
  accountStatusLabel: string;
  requestHref: string;
  requestLabel: string;
  isMenuOpen: boolean;
  activeNavHref: string | null;
  onOpenContact: () => void;
  onOpenChat: () => void;
  onToggleMenu: (openServices: boolean) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <LanguageSwitcher />

      <Link
        href={accountStatusHref}
        className="hidden shrink-0 lg:inline-flex whitespace-nowrap px-4 py-2.5 border border-[#D9C7BA] text-[#6C5B50] hover:text-[#B8643E] hover:border-[#B8643E] text-[15px] font-medium rounded-full transition-colors"
      >
        {accountStatusLabel}
      </Link>

      {requestHref ? (
        <Link
          href={requestHref}
          className="hidden shrink-0 lg:inline-flex whitespace-nowrap px-6 py-2.5 bg-[#B8643E] hover:bg-[#A65835] text-[#FFFDF9] text-[16px] font-medium rounded-full shadow-lg shadow-[#B8643E33] transition-all"
        >
          {requestLabel}
        </Link>
      ) : (
        <ServiceActionButton
          label={requestLabel}
          onOpenContact={onOpenContact}
          onOpenChat={onOpenChat}
        />
      )}

      <button
        onClick={() => {
          const nextIsMenuOpen = !isMenuOpen;
          onToggleMenu(nextIsMenuOpen && activeNavHref === '/leistungen');
        }}
        className="lg:hidden p-2 text-[#72665D] hover:text-[#C86E4A] transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          )}
        </svg>
      </button>
    </div>
  );
}
