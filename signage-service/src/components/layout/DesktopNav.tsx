'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import type { HeaderLocale, NavLink, NavMenuLink } from './Header.types';
import { isExactNavPath } from './headerNavUtils';

const NAV_EASE = [0.22, 1, 0.36, 1] as const;

const ALL_SERVICES_LABELS: Record<string, string> = {
  de: 'Alle Leistungen ansehen',
  en: 'View all services',
  ru: 'Все услуги',
  tr: 'Tüm hizmetleri gör',
  pl: 'Wszystkie usługi',
  ar: 'عرض كل الخدمات',
};

const NAVIGATION_LABELS: Record<string, string> = {
  de: 'Navigation',
  en: 'Navigation',
  ru: 'Навигация',
  tr: 'Gezinme',
  pl: 'Nawigacja',
  ar: 'التنقل',
};

function getAllServicesLabel(locale: HeaderLocale) {
  return ALL_SERVICES_LABELS[locale] ?? ALL_SERVICES_LABELS.de;
}

function getNavigationLabel(locale: HeaderLocale) {
  return NAVIGATION_LABELS[locale] ?? NAVIGATION_LABELS.de;
}

export default function DesktopNav({
  isVisible,
  locale,
  navLinks,
  activeNavHref,
  pathname,
  servicesMenuLinks,
}: {
  isVisible: boolean;
  locale: HeaderLocale;
  navLinks: NavLink[];
  activeNavHref: string | null;
  pathname: string;
  servicesMenuLinks: NavMenuLink[];
}) {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const navigationLabel = getNavigationLabel(locale);
  const allServicesLabel = getAllServicesLabel(locale);

  const clearServicesCloseTimeout = useCallback(() => {
    if (servicesCloseTimeoutRef.current) {
      clearTimeout(servicesCloseTimeoutRef.current);
      servicesCloseTimeoutRef.current = null;
    }
  }, []);

  const openServices = useCallback(() => {
    clearServicesCloseTimeout();
    setIsServicesOpen(true);
  }, [clearServicesCloseTimeout]);

  const closeServices = useCallback(() => {
    clearServicesCloseTimeout();
    setIsServicesOpen(false);
  }, [clearServicesCloseTimeout]);

  const scheduleServicesClose = useCallback(() => {
    clearServicesCloseTimeout();
    servicesCloseTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
      servicesCloseTimeoutRef.current = null;
    }, 180);
  }, [clearServicesCloseTimeout]);

  useEffect(() => {
    return clearServicesCloseTimeout;
  }, [clearServicesCloseTimeout]);

  useEffect(() => {
    if (!isServicesOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeServices();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeServices, isServicesOpen]);

  const secondaryTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: NAV_EASE };
  const servicesTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: NAV_EASE };

  return (
    <div
      className="relative hidden lg:block"
      onPointerEnter={clearServicesCloseTimeout}
      onPointerLeave={scheduleServicesClose}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          scheduleServicesClose();
        }
      }}
    >
      <AnimatePresence initial={false} onExitComplete={closeServices}>
        {isVisible && (
          <motion.div
            key="desktop-secondary-navigation"
            initial={shouldReduceMotion ? false : { height: 0, y: -48 }}
            animate={{ height: 'auto', y: 0 }}
            exit={shouldReduceMotion ? { height: 0 } : { height: 0, y: -48 }}
            transition={secondaryTransition}
            className="overflow-hidden"
          >
            <nav aria-label={navigationLabel} className="pr-header-separator border-t">
              <ul className="flex h-12 items-center justify-center gap-x-2 xl:gap-x-5">
                {navLinks.map((link) => {
                  const isActive = activeNavHref === link.href;
                  const isServices = link.href === '/leistungen';
                  const itemStateClassName = isActive
                    ? 'pr-header-nav-item-active font-semibold'
                    : isServices && isServicesOpen
                      ? 'pr-header-nav-item-open font-semibold'
                      : 'font-medium';
                  const itemClassName = `pr-header-nav-item relative inline-flex min-h-9 min-w-0 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-center text-[14px] leading-tight transition-colors duration-200 xl:px-3.5 xl:text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8643E]/45 ${itemStateClassName}`;

                  return (
                    <li key={link.href} className="flex min-w-0">
                      {isServices ? (
                        <button
                          type="button"
                          aria-expanded={isServicesOpen}
                          aria-controls="desktop-services-navigation"
                          onPointerEnter={openServices}
                          onFocus={openServices}
                          onClick={openServices}
                          className={itemClassName}
                        >
                          <span className="min-w-0">{link.name}</span>
                          <svg
                            className={`h-3.5 w-3.5 shrink-0 text-[#8C7A6E] transition-transform duration-200 ${
                              isServicesOpen ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.3"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                      ) : (
                        <Link
                          href={link.href}
                          aria-current={isActive ? 'page' : undefined}
                          onPointerEnter={closeServices}
                          onFocus={closeServices}
                          className={itemClassName}
                        >
                          <span className="min-w-0">{link.name}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <AnimatePresence initial={false}>
              {isServicesOpen && (
                <motion.nav
                  id="desktop-services-navigation"
                  key="desktop-services-navigation"
                  aria-label={navLinks.find((link) => link.href === '/leistungen')?.name ?? 'Leistungen'}
                  initial={shouldReduceMotion ? false : { height: 0, y: -12 }}
                  animate={{ height: 'auto', y: 0 }}
                  exit={shouldReduceMotion ? { height: 0 } : { height: 0, y: -12 }}
                  transition={servicesTransition}
                  className="pr-header-separator overflow-hidden border-t"
                >
                  <ul className="mx-auto grid max-w-[1040px] grid-cols-2 gap-2 px-4 pb-4 pt-3 xl:grid-cols-3">
                    {servicesMenuLinks.map((item) => {
                      const isMenuItemActive = isExactNavPath(pathname, item.href);

                      return (
                        <li key={item.href} className="min-w-0">
                          <Link
                            href={item.href}
                            aria-current={isMenuItemActive ? 'page' : undefined}
                            onClick={closeServices}
                            className={`pr-header-glass-item flex min-h-12 items-center justify-between gap-3 rounded-[12px] border px-3.5 py-2.5 text-[14px] font-semibold leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8643E]/40 ${
                              isMenuItemActive
                                ? 'pr-header-glass-item-active'
                                : ''
                            }`}
                          >
                            <span className="min-w-0 flex-1">{item.label}</span>
                            <svg
                              className="h-3.5 w-3.5 shrink-0 text-[#B8643E] rtl:rotate-180"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </li>
                      );
                    })}
                    <li className="col-span-1 xl:col-span-2">
                      <Link
                        href="/leistungen"
                        onClick={closeServices}
                        aria-current={isExactNavPath(pathname, '/leistungen') ? 'page' : undefined}
                        className={`pr-header-nav-item flex min-h-12 items-center justify-center gap-2 rounded-[12px] px-3.5 py-2.5 text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8643E]/40 ${
                          isExactNavPath(pathname, '/leistungen')
                            ? 'pr-header-nav-item-active'
                            : ''
                        }`}
                      >
                        <span>{allServicesLabel}</span>
                        <svg
                          className="h-3.5 w-3.5 shrink-0 rtl:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  </ul>
                </motion.nav>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
