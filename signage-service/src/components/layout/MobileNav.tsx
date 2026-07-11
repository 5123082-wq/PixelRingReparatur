'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import type { NavLink, NavMenuLink } from './Header.types';
import { isExactNavPath } from './headerNavUtils';

export default function MobileNav({
  isOpen,
  isMobileServicesOpen,
  navLinks,
  activeNavHref,
  pathname,
  servicesMenuLinks,
  accountStatusHref,
  accountStatusLabel,
  requestHref,
  requestLabel,
  onClose,
  onToggleServices,
  onOpenContact,
}: {
  isOpen: boolean;
  isMobileServicesOpen: boolean;
  navLinks: NavLink[];
  activeNavHref: string | null;
  pathname: string;
  servicesMenuLinks: NavMenuLink[];
  accountStatusHref: string;
  accountStatusLabel: string;
  requestHref: string;
  requestLabel: string;
  onClose: () => void;
  onToggleServices: () => void;
  onOpenContact: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 top-[80px] z-[9999] flex flex-col overflow-y-auto bg-[#F8F6F2] lg:hidden">
      <nav className="flex min-h-full flex-col gap-8 bg-[#F8F6F2] p-8">
        <div className="flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = activeNavHref === link.href;
            const isServices = link.href === '/leistungen';

            if (isServices) {
              return (
                <div key={link.name} className="rounded-2xl">
                  <div
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left text-[24px] font-bold transition-colors ${
                      isActive
                        ? 'border-[#E7DDD3] bg-[#F7F1E8] text-[#0E1A2B] shadow-[0_10px_26px_rgba(14,26,43,0.07)]'
                        : 'border-transparent text-[#72665D] hover:bg-[#F7F1E8]/45 hover:text-[#B8643E]'
                    }`}
                  >
                    <Link
                      href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={onClose}
                      className="min-w-0 flex-1"
                    >
                      {link.name}
                    </Link>
                    <button
                      type="button"
                      aria-label={`${link.name} Untermenü`}
                      aria-expanded={isMobileServicesOpen}
                      onClick={onToggleServices}
                      className="-mr-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#B8643E] transition-colors hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8643E]/40"
                    >
                      <svg
                        className={`h-5 w-5 transition-transform duration-200 ${
                          isMobileServicesOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {isMobileServicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pr-nav-panel-surface mt-2 grid gap-1 rounded-2xl border p-2">
                          {servicesMenuLinks.map((item) => {
                            const isMenuItemActive = isExactNavPath(pathname, item.href);

                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                aria-current={isMenuItemActive ? 'page' : undefined}
                                onClick={onClose}
                                className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-[16px] font-semibold transition-colors ${
                                  isMenuItemActive
                                    ? 'text-[#0E1A2B]'
                                    : 'text-[#6F625A] hover:text-[#B8643E]'
                                }`}
                              >
                                <span>{item.label}</span>
                                <svg className="h-4 w-4 text-[#B8643E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={onClose}
                className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-[24px] font-bold transition-colors ${
                  isActive
                    ? 'border-[#E7DDD3] bg-[#F7F1E8] text-[#0E1A2B] shadow-[0_10px_26px_rgba(14,26,43,0.07)]'
                    : 'border-transparent text-[#72665D] hover:bg-[#F7F1E8]/45 hover:text-[#B8643E]'
                }`}
              >
                <span>{link.name}</span>
                <svg className="w-5 h-5 text-[#B8643E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 mb-12 space-y-8">
          <Link
            href={accountStatusHref}
            onClick={onClose}
            className="w-full inline-flex justify-center px-6 py-4 border border-[#D9C7BA] text-[#6C5B50] text-[18px] font-bold rounded-2xl transition-colors"
          >
            {accountStatusLabel}
          </Link>

          {requestHref ? (
            <Link
              href={requestHref}
              onClick={onClose}
              className="w-full inline-flex justify-center px-6 py-5 bg-[#B8643E] text-[#FFFDF9] text-[18px] font-bold rounded-2xl shadow-xl shadow-[#B8643E33] transition-all active:scale-[0.98]"
            >
              {requestLabel}
            </Link>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenContact();
              }}
              className="w-full px-6 py-5 bg-[#B8643E] text-[#FFFDF9] text-[18px] font-bold rounded-2xl shadow-xl shadow-[#B8643E33] transition-all active:scale-[0.98]"
            >
              {requestLabel}
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
