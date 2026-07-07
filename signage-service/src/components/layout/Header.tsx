'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ContactModal from '../common/ContactModal';
import ChatModal from '../common/ChatModal';
import ServiceActionButton from '../common/ServiceActionButton';

type HeaderLink = {
  label: string;
  href: string;
};

type HeaderContent = {
  servicePill?: string | null;
  bookLabel?: string | null;
  links?: HeaderLink[];
  accountStatusLabel?: string | null;
  accountStatusHref?: string | null;
  requestLabel?: string | null;
  requestHref?: string | null;
};

type PortalAccess = {
  isActive: boolean;
  label: string;
  href?: string;
};

type NavLink = {
  name: string;
  href: string;
};

type NavMenuLink = {
  label: string;
  href: string;
};

type HeaderLocale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

const LOCALE_PREFIX_REGEX = /^\/(de|en|ru|tr|pl|ar)(?=\/|$)/;
const SERVICES_MENU_LABELS: Record<HeaderLocale, Record<string, string>> = {
  de: {
    services_repair: 'Werbeanlagen-Reparatur',
    services_cleaning: 'Werbeanlagen-Reinigung',
    services_led: 'Lichtwerbung & LED-Modernisierung',
    services_audit: 'Audit & Diagnose',
    services_installation: 'Montage & Demontage',
    services_branding: 'Druckprodukte & Branding',
  },
  en: {
    services_repair: 'Signage repair',
    services_cleaning: 'Signage Cleaning',
    services_led: 'Illuminated signage & LED modernization',
    services_audit: 'Audit & diagnostics',
    services_installation: 'Installation & dismantling',
    services_branding: 'Print products & branding',
  },
  ru: {
    services_repair: 'Ремонт рекламных конструкций',
    services_cleaning: 'Мойка вывесок',
    services_led: 'Световая реклама и LED-модернизация',
    services_audit: 'Аудит и диагностика',
    services_installation: 'Монтаж и демонтаж',
    services_branding: 'Печать и брендинг',
  },
  tr: {
    services_repair: 'Reklam sistemi onarımı',
    services_cleaning: 'Tabela Temizliği',
    services_led: 'Işıklı reklam ve LED modernizasyonu',
    services_audit: 'Denetim ve teşhis',
    services_installation: 'Montaj ve demontaj',
    services_branding: 'Baskı ürünleri ve markalama',
  },
  pl: {
    services_repair: 'Naprawa reklam',
    services_cleaning: 'Czyszczenie reklam',
    services_led: 'Reklama świetlna i modernizacja LED',
    services_audit: 'Audyt i diagnostyka',
    services_installation: 'Montaż i demontaż',
    services_branding: 'Druk i branding',
  },
  ar: {
    services_repair: 'إصلاح اللوحات الإعلانية',
    services_cleaning: 'تنظيف اللوحات الإعلانية',
    services_led: 'الإعلانات المضيئة وتحديث LED',
    services_audit: 'التدقيق والتشخيص',
    services_installation: 'التركيب والفك',
    services_branding: 'الطباعة والهوية',
  },
};

function normalizeNavPath(path: string): string {
  const pathWithoutQuery = path.split(/[?#]/)[0] || '/';
  const pathWithoutLocale = pathWithoutQuery.replace(LOCALE_PREFIX_REGEX, '') || '/';

  return pathWithoutLocale !== '/' && pathWithoutLocale.endsWith('/')
    ? pathWithoutLocale.slice(0, -1)
    : pathWithoutLocale;
}

function isActiveNavPath(pathname: string, href: string): boolean {
  if (!href.startsWith('/')) {
    return false;
  }

  const currentPath = normalizeNavPath(pathname);
  const targetPath = normalizeNavPath(href);

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}

function isExactNavPath(pathname: string, href: string): boolean {
  if (!href.startsWith('/')) {
    return false;
  }

  return normalizeNavPath(pathname) === normalizeNavPath(href);
}

function DesktopNavLink({
  link,
  isActive,
  pathname,
  menuLinks,
}: {
  link: NavLink;
  isActive: boolean;
  pathname: string;
  menuLinks?: NavMenuLink[];
}) {
  const hasMenu = Boolean(menuLinks?.length);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearCloseMenuTimeout = () => {
    if (closeMenuTimeoutRef.current) {
      clearTimeout(closeMenuTimeoutRef.current);
      closeMenuTimeoutRef.current = null;
    }
  };
  const openMenu = () => {
    clearCloseMenuTimeout();
    setIsMenuOpen(true);
  };
  const closeMenu = () => {
    clearCloseMenuTimeout();
    setIsMenuOpen(false);
  };
  const scheduleCloseMenu = () => {
    clearCloseMenuTimeout();
    closeMenuTimeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false);
      closeMenuTimeoutRef.current = null;
    }, 140);
  };

  useEffect(() => clearCloseMenuTimeout, []);

  const triggerClassName = `relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[15px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8643E]/40 ${
    isActive
      ? 'font-semibold text-[#0E1A2B]'
      : 'font-medium text-[#72665D] hover:bg-white/24 hover:text-[#B8643E] focus-visible:bg-white/24'
  }`;
  const triggerContent = (
    <>
      {isActive && (
        <motion.span
          className="pr-nav-glass-accent absolute inset-0 rounded-full border"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative z-10">{link.name}</span>
      {hasMenu && (
        <svg
          className={`relative z-10 h-3.5 w-3.5 text-[#8C7A6E] transition-transform duration-200 ${
            isMenuOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      )}
    </>
  );

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement)) {
          scheduleCloseMenu();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          closeMenu();
        }
      }}
    >
      {hasMenu ? (
        <Link
          href={link.href}
          aria-current={isActive ? 'page' : undefined}
          aria-haspopup="menu"
          onFocus={openMenu}
          className={triggerClassName}
        >
          {triggerContent}
        </Link>
      ) : (
        <Link
          href={link.href}
          aria-current={isActive ? 'page' : undefined}
          className={triggerClassName}
        >
          {triggerContent}
        </Link>
      )}

      {hasMenu && (
        <div
          role="menu"
          aria-label={link.name}
          className={`pr-nav-glass pr-nav-glass-floating absolute left-1/2 top-full z-[70] mt-3 w-[330px] -translate-x-1/2 rounded-[18px] border p-2 transition-all duration-200 ${
            isMenuOpen
              ? 'visible translate-y-0 opacity-100'
              : 'invisible translate-y-2 opacity-0 pointer-events-none'
          }`}
        >
          <div className="absolute -top-3 left-0 h-3 w-full" />
          {menuLinks!.map((item) => {
            const isMenuItemActive = isExactNavPath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                aria-current={isMenuItemActive ? 'page' : undefined}
                className={`flex items-center justify-between gap-3 rounded-[12px] px-3.5 py-3 text-[14px] font-semibold transition-colors ${
                  isMenuItemActive
                    ? 'text-[#0E1A2B]'
                    : 'text-[#6F625A] hover:text-[#B8643E] focus-visible:text-[#B8643E] focus-visible:outline-none'
                }`}
              >
                <span>{item.label}</span>
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-[#B8643E]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

const Header = ({
  content,
  portalAccess,
}: {
  content?: HeaderContent | null;
  portalAccess?: PortalAccess;
}) => {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktopNavOpen, setIsDesktopNavOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const desktopNavHoverAreaRef = useRef<HTMLDivElement>(null);
  const desktopNavCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDesktopNavCloseTimeout = () => {
    if (desktopNavCloseTimeoutRef.current) {
      clearTimeout(desktopNavCloseTimeoutRef.current);
      desktopNavCloseTimeoutRef.current = null;
    }
  };
  const openDesktopNav = () => {
    clearDesktopNavCloseTimeout();
    setIsDesktopNavOpen(true);
  };
  const fallbackNavLinks = [
    { name: t('services'), href: '/leistungen' },
    { name: t('solutions'), href: '/probleme-loesungen' },
    { name: t('for_business'), href: '/business' },
    { name: t('references'), href: '/referenzen' },
    { name: t('about'), href: '/ueber-uns' },
  ];
  const cmsNavLinks = (content?.links || []).map((link) => ({
    name: link.label,
    href: link.href,
  }));

  const hasValidCmsNavLinks =
    cmsNavLinks.length === 5 &&
    cmsNavLinks.every(
      (link) =>
        typeof link.name === 'string' &&
        link.name.trim().length > 0 &&
        !link.name.startsWith('Nav.')
    );

  const navLinks: NavLink[] = (hasValidCmsNavLinks ? cmsNavLinks : fallbackNavLinks).map((link, index) => {
    if (index === 0) {
      return { ...link, href: '/leistungen' };
    }

    if (index === 1) {
      return { ...link, name: t('solutions'), href: '/probleme-loesungen' };
    }

    if (index === 3) {
      return { ...link, name: t('references'), href: '/referenzen' };
    }

    if (index === 4) {
      return { ...link, name: t('about'), href: '/ueber-uns' };
    }

    return link;
  });
  const activeNavHref = navLinks.find((link) => isActiveNavPath(pathname, link.href))?.href ?? null;
  const fallbackServiceMenuLabels =
    SERVICES_MENU_LABELS[locale as HeaderLocale] ?? SERVICES_MENU_LABELS.de;
  const getNavLabel = (key: string) => (t.has(key) ? t(key) : fallbackServiceMenuLabels[key]);
  const servicesMenuLinks: NavMenuLink[] = [
    { label: getNavLabel('services_repair'), href: '/leistungen/werbeanlagen-reparatur' },
    { label: getNavLabel('services_cleaning'), href: '/leistungen/werbeanlagen-reinigung' },
    { label: getNavLabel('services_led'), href: '/leistungen/lichtwerbung-led-modernisierung' },
    { label: getNavLabel('services_audit'), href: '/leistungen/werbeanlagen-audit-diagnose' },
    { label: getNavLabel('services_installation'), href: '/leistungen/montage-demontage-werbeanlagen' },
    { label: getNavLabel('services_branding'), href: '/leistungen/druckprodukte-branding-werbematerialien' },
  ];
  const hasCmsAccountStatusLabel =
    content?.accountStatusLabel && !content.accountStatusLabel.startsWith('Nav.');
  const accountStatusLabel = portalAccess?.isActive
    ? portalAccess.label
    : hasCmsAccountStatusLabel
      ? content.accountStatusLabel
      : t('account_status');
  const accountStatusHref = portalAccess?.isActive
    ? portalAccess.href || '/portal'
    : content?.accountStatusHref || '/status';
  const requestLabel =
    content?.requestLabel && !content.requestLabel.startsWith('Nav.')
      ? content.requestLabel
      : t('submit_request');
  const requestHref = content?.requestHref || '';

  useEffect(() => {
    if (isMenuOpen || isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isModalOpen]);

  useEffect(() => {
    return () => {
      clearDesktopNavCloseTimeout();
    };
  }, []);

  useEffect(() => {
    if (!isDesktopNavOpen) {
      return;
    }

    const containsPoint = (rect: DOMRect, x: number, y: number) =>
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    const clearCloseTimeout = () => {
      if (desktopNavCloseTimeoutRef.current) {
        clearTimeout(desktopNavCloseTimeoutRef.current);
        desktopNavCloseTimeoutRef.current = null;
      }
    };
    const scheduleClose = () => {
      clearCloseTimeout();
      desktopNavCloseTimeoutRef.current = setTimeout(() => {
        setIsDesktopNavOpen(false);
        desktopNavCloseTimeoutRef.current = null;
      }, 160);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const hoverArea = desktopNavHoverAreaRef.current;
      const isInsideHoverArea = hoverArea
        ? containsPoint(hoverArea.getBoundingClientRect(), event.clientX, event.clientY)
        : false;
      const isInsideVisibleMenu = Array.from(document.querySelectorAll('header [role="menu"]')).some(
        (menu) => {
          const menuStyles = window.getComputedStyle(menu);

          return (
            menuStyles.visibility !== 'hidden' &&
            menuStyles.opacity !== '0' &&
            containsPoint(menu.getBoundingClientRect(), event.clientX, event.clientY)
          );
        }
      );

      if (isInsideHoverArea || isInsideVisibleMenu) {
        clearCloseTimeout();
        return;
      }

      scheduleClose();
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [isDesktopNavOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
        setIsMobileServicesOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleOpenChat = () => setIsChatOpen(true);
    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const shouldCollapse = window.scrollY > 24;
      setIsScrolled(shouldCollapse);
      if (!shouldCollapse) {
        clearDesktopNavCloseTimeout();
        setIsDesktopNavOpen(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Placeholder to prevent layout shift when header becomes fixed */}
      <div className="h-[72px] lg:h-[120px] w-full shrink-0" />
      <header className="pr-nav-glass fixed top-0 z-50 w-full border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex min-h-[72px] items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Link href="/" className="flex min-w-0 shrink items-center">
                <Image
                  src="/brand/logo-full-light.svg"
                  alt="PixelRing Technical Service"
                  width={794}
                  height={132}
                  priority
                  className="hidden w-auto sm:block sm:h-[52px]"
                />
                <Image
                  src="/brand/logo-compact-light.svg"
                  alt="PixelRing Technical Service"
                  width={520}
                  height={132}
                  priority
                  className="block h-[48px] w-auto [@media(min-width:390px)]:h-[52px] sm:hidden"
                />
              </Link>
            </div>

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
                  onOpenContact={() => setIsModalOpen(true)}
                  onOpenChat={() => setIsChatOpen(true)}
                />
              )}

              <button
                onClick={() => {
                  const nextIsMenuOpen = !isMenuOpen;
                  setIsMenuOpen(nextIsMenuOpen);
                  if (nextIsMenuOpen) {
                    setIsMobileServicesOpen(activeNavHref === '/leistungen');
                  }
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
          </div>
          {/* Navigation - Desktop Container with Animated Height */}
          <div className="hidden lg:block relative">
            {/* 1. Static Nav row that shrinks and disappears */}
            <motion.div
              initial={false}
              animate={{ 
                height: isScrolled ? 0 : 48,
                opacity: isScrolled ? 0 : 1
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`relative z-30 ${isScrolled ? 'pointer-events-none overflow-hidden' : 'overflow-visible'}`}
            >
              <nav className="flex items-center justify-center gap-5 border-t border-[#E7DDD3]/70 py-1.5">
                {navLinks.map((link) => (
                  <DesktopNavLink
                    key={link.name}
                    link={link}
                    isActive={activeNavHref === link.href}
                    pathname={pathname}
                    menuLinks={link.href === '/leistungen' ? servicesMenuLinks : undefined}
                  />
                ))}
              </nav>
            </motion.div>

            {/* 2. Floating Notch anchored to the bottom of the logo row */}
            <AnimatePresence>
              {isScrolled && (
                <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none">
                  <motion.div
                    ref={desktopNavHoverAreaRef}
                    key="scrolled-notch"
                    onMouseMove={isDesktopNavOpen ? openDesktopNav : undefined}
                    className={`pointer-events-auto ${isDesktopNavOpen ? 'w-[920px]' : 'w-[192px]'} flex h-[86px] justify-center`}
                  >
                    <motion.div
                      onMouseEnter={openDesktopNav}
                      onMouseMove={openDesktopNav}
                      initial={{ y: -40, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        width: isDesktopNavOpen ? 880 : 192,
                        height: isDesktopNavOpen ? 56 : 24,
                      }}
                      exit={{ y: -40, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      className={`pr-nav-glass relative flex items-center justify-center border border-t-0 rounded-b-[20px] outline-none transition-[background-color,border-color,box-shadow] duration-200 group ${
                        isDesktopNavOpen
                          ? 'overflow-visible pr-nav-glass-floating'
                          : 'overflow-hidden'
                      }`}
                    >
                      {!isDesktopNavOpen && (
                        <motion.div
                          key="chevron"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <svg
                            className="h-4 w-4 text-[#72665D] transition-transform duration-300 group-hover:translate-y-0.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </motion.div>
                      )}

                      <AnimatePresence mode="wait">
                        {isDesktopNavOpen && (
                          <motion.nav
                            key="expanded-links"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: 0.15, delay: 0.1 } }}
                            exit={{ opacity: 0, transition: { duration: 0.06 } }}
                            className="flex items-center justify-center gap-5 px-8"
                          >
                            {navLinks.map((link) => (
                              <DesktopNavLink
                                key={link.name}
                                link={link}
                                isActive={activeNavHref === link.href}
                                pathname={pathname}
                                menuLinks={link.href === '/leistungen' ? servicesMenuLinks : undefined}
                              />
                            ))}
                          </motion.nav>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 top-[80px] bg-white z-[9999] overflow-y-auto flex flex-col">
          <nav className="flex flex-col p-8 gap-8 min-h-full bg-white">
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
                          onClick={() => setIsMenuOpen(false)}
                          className="min-w-0 flex-1"
                        >
                          {link.name}
                        </Link>
                        <button
                          type="button"
                          aria-label={`${link.name} Untermenü`}
                          aria-expanded={isMobileServicesOpen}
                          onClick={() => setIsMobileServicesOpen((isOpen) => !isOpen)}
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
                            <div className="pr-nav-glass pr-nav-glass-floating mt-2 grid gap-1 rounded-2xl border p-2">
                              {servicesMenuLinks.map((item) => {
                                const isMenuItemActive = isExactNavPath(pathname, item.href);

                                return (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={isMenuItemActive ? 'page' : undefined}
                                    onClick={() => setIsMenuOpen(false)}
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
                    onClick={() => setIsMenuOpen(false)}
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
                onClick={() => setIsMenuOpen(false)}
                className="w-full inline-flex justify-center px-6 py-4 border border-[#D9C7BA] text-[#6C5B50] text-[18px] font-bold rounded-2xl transition-colors"
              >
                {accountStatusLabel}
              </Link>

              {requestHref ? (
                <Link
                  href={requestHref}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full inline-flex justify-center px-6 py-5 bg-[#B8643E] text-[#FFFDF9] text-[18px] font-bold rounded-2xl shadow-xl shadow-[#B8643E33] transition-all active:scale-[0.98]"
                >
                  {requestLabel}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="w-full px-6 py-5 bg-[#B8643E] text-[#FFFDF9] text-[18px] font-bold rounded-2xl shadow-xl shadow-[#B8643E33] transition-all active:scale-[0.98]"
                >
                  {requestLabel}
                </button>
              )}
            </div>
          </nav>
        </div>
      )}

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOpenChat={() => setIsChatOpen(true)}
      />
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};

export default Header;
