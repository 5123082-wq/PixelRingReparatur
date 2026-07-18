'use client';

import { Link, usePathname } from '@/i18n/routing';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ServiceActionButton from '../common/ServiceActionButton';

export default function HeaderActions({
  accountStatusBaseLabel,
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
  accountStatusBaseLabel: string;
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
  const pathname = usePathname();
  const isAccountStatusActive =
    pathname === accountStatusHref || pathname.startsWith(`${accountStatusHref}/`);

  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <LanguageSwitcher />

      <Link
        href={accountStatusHref}
        aria-current={isAccountStatusActive ? 'page' : undefined}
        className={`pr-header-control hidden shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-[15px] font-medium text-[#414B59] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8643E]/35 lg:inline-flex ${
          isAccountStatusActive ? 'pr-header-control-active' : ''
        }`}
      >
        <span className="grid" aria-live="polite">
          <span className="invisible col-start-1 row-start-1" aria-hidden="true">
            {accountStatusBaseLabel}
          </span>
          <span className="col-start-1 row-start-1 text-center">
            {accountStatusLabel}
          </span>
        </span>
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
