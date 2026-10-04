'use client';

import { Link, usePathname } from '@/i18n/routing';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ServiceActionButton from '../common/ServiceActionButton';
import type { HeaderLocale } from './Header.types';
import { useLocale } from 'next-intl';

export default function HeaderActions({
  accountStatusBaseLabel,
  accountStatusHref,
  accountStatusLabel,
  accountStatusAccessibleLabel,
  hasPortalAccess,
  isProductionPortalSession,
  requestHref,
  requestLabel,
  isMenuOpen,
  activeNavHref,
  availableLocales,
  onOpenContact,
  onOpenChat,
  onToggleMenu,
}: {
  accountStatusBaseLabel: string;
  accountStatusHref: string;
  accountStatusLabel: string;
  accountStatusAccessibleLabel: string;
  hasPortalAccess: boolean;
  isProductionPortalSession: boolean;
  requestHref: string;
  requestLabel: string;
  isMenuOpen: boolean;
  activeNavHref: string | null;
  availableLocales?: readonly HeaderLocale[];
  onOpenContact: () => void;
  onOpenChat: () => void;
  onToggleMenu: (openServices: boolean) => void;
}) {
  const pathname = usePathname();
  const locale = useLocale();
  const isAccountStatusActive =
    pathname === accountStatusHref || pathname.startsWith(`${accountStatusHref}/`);

  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <LanguageSwitcher availableLocales={availableLocales} />

      <Link
        href={accountStatusHref}
        aria-label={accountStatusAccessibleLabel}
        title={hasPortalAccess ? accountStatusAccessibleLabel : undefined}
        aria-current={isAccountStatusActive ? 'page' : undefined}
        data-account-authenticated={hasPortalAccess && isProductionPortalSession}
        className={`pr-header-control shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border text-[15px] font-medium text-[#414B59] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8643E]/35 lg:inline-flex lg:px-4 lg:py-2.5 ${
          hasPortalAccess ? 'inline-flex size-11 lg:h-auto lg:w-auto' : 'hidden px-4 py-2.5'
        } ${
          isAccountStatusActive || (hasPortalAccess && isProductionPortalSession) ? 'pr-header-control-active' : ''
        }`}
      >
        {hasPortalAccess && (
          <span className="relative inline-flex size-5 shrink-0" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="size-5">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2" strokeLinecap="round" />
            </svg>
            {isProductionPortalSession && (
              <span className="absolute -bottom-1 -end-1.5 flex size-3.5 items-center justify-center rounded-full bg-[#27644A] text-white ring-2 ring-[#F1E1D7]">
                <svg viewBox="0 0 12 12" fill="none" className="size-2.5">
                  <path d="m2.5 6 2.25 2.25L9.5 3.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </span>
        )}
        <span className={hasPortalAccess ? 'hidden lg:grid' : 'grid'} aria-live="polite">
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
        aria-label={locale === 'de' ? (isMenuOpen ? 'Menü schließen' : 'Menü öffnen') : 'Toggle menu'}
        aria-expanded={isMenuOpen}
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
