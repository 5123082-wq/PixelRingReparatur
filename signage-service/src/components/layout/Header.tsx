'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import ChatModal from '../common/ChatModal';
import ContactModal from '../common/ContactModal';
import DesktopNav from './DesktopNav';
import HeaderActions from './HeaderActions';
import MobileNav from './MobileNav';
import type { HeaderContent, HeaderLocale, NavLink, NavMenuLink, PortalAccess } from './Header.types';
import { isActiveNavPath } from './headerNavUtils';

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
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
      ? content.accountStatusLabel ?? t('account_status')
      : t('account_status');
  const accountStatusHref = portalAccess?.isActive
    ? portalAccess.href || '/portal'
    : content?.accountStatusHref || '/status';
  const requestLabel =
    content?.requestLabel && !content.requestLabel.startsWith('Nav.')
      ? content.requestLabel ?? t('submit_request')
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
    const handleScroll = () => setIsScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
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

            <HeaderActions
              accountStatusHref={accountStatusHref}
              accountStatusLabel={accountStatusLabel}
              requestHref={requestHref}
              requestLabel={requestLabel}
              isMenuOpen={isMenuOpen}
              activeNavHref={activeNavHref}
              onOpenContact={() => setIsModalOpen(true)}
              onOpenChat={() => setIsChatOpen(true)}
              onToggleMenu={(openServices) => {
                setIsMenuOpen((isOpen) => !isOpen);
                setIsMobileServicesOpen(openServices);
              }}
            />
          </div>

          <DesktopNav
            isScrolled={isScrolled}
            navLinks={navLinks}
            activeNavHref={activeNavHref}
            pathname={pathname}
            servicesMenuLinks={servicesMenuLinks}
          />
        </div>
      </header>

      <MobileNav
        isOpen={isMenuOpen}
        isMobileServicesOpen={isMobileServicesOpen}
        navLinks={navLinks}
        activeNavHref={activeNavHref}
        pathname={pathname}
        servicesMenuLinks={servicesMenuLinks}
        accountStatusHref={accountStatusHref}
        accountStatusLabel={accountStatusLabel}
        requestHref={requestHref}
        requestLabel={requestLabel}
        onClose={() => setIsMenuOpen(false)}
        onToggleServices={() => setIsMobileServicesOpen((isOpen) => !isOpen)}
        onOpenContact={() => setIsModalOpen(true)}
      />

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
