'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Logo from '../common/Logo';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ContactModal from '../common/ContactModal';
import ChatModal from '../common/ChatModal';

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

const Header = ({ content }: { content?: HeaderContent | null }) => {
  const t = useTranslations('Nav');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktopNavOpen, setIsDesktopNavOpen] = useState(false);

  const fallbackNavLinks = [
    { name: t('services'), href: '/leistungen' },
    { name: t('solutions'), href: '/support#symptoms' },
    { name: t('for_business'), href: '/' },
    { name: t('references'), href: '/' },
    { name: t('about'), href: '/' },
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

  const navLinks = (hasValidCmsNavLinks ? cmsNavLinks : fallbackNavLinks).map((link, index) =>
    index === 0 ? { ...link, href: '/leistungen' } : link
  );
  const servicePill = content?.servicePill || '';
  const accountStatusLabel =
    content?.accountStatusLabel && !content.accountStatusLabel.startsWith('Nav.')
      ? content.accountStatusLabel
      : t('account_status');
  const accountStatusHref = content?.accountStatusHref || '/status';
  const requestLabel =
    content?.requestLabel && !content.requestLabel.startsWith('Nav.')
      ? content.requestLabel
      : t('submit_request');
  const requestHref = content?.requestHref || '';

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
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
        setIsDesktopNavOpen(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#EEF3FBA3] backdrop-blur-[10.5px] border-b border-[#E7DDD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex min-h-[72px] items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Link href="/" className="shrink-0">
                <Logo className="scale-[0.85] sm:scale-100 rtl:origin-right ltr:origin-left" />
              </Link>
              <div className="hidden shrink-0 sm:flex px-3 py-1 bg-[#EEF3FB] border border-[#E7DDD3] rounded-full">
                <span className="text-[12px] font-bold text-[#B8643E] tracking-[1.4px] whitespace-nowrap">
                  {servicePill}
                </span>
              </div>
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
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="hidden shrink-0 lg:block whitespace-nowrap px-6 py-2.5 bg-[#B8643E] hover:bg-[#A65835] text-[#FFFDF9] text-[16px] font-medium rounded-full shadow-lg shadow-[#B8643E33] transition-all"
                >
                  {requestLabel}
                </button>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                height: isScrolled ? 0 : 40,
                opacity: isScrolled ? 0 : 1
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <nav className="flex items-center justify-center gap-8 border-t border-[#E7DDD3]/70 py-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="whitespace-nowrap text-[15px] font-medium text-[#72665D] hover:text-[#B8643E] transition-colors relative group"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </motion.div>

            {/* 2. Floating Notch anchored to the bottom of the logo row */}
            <AnimatePresence>
              {isScrolled && (
                <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none">
                  <motion.div
                    key="scrolled-notch"
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    onMouseEnter={() => setIsDesktopNavOpen(true)}
                    onMouseLeave={() => setIsDesktopNavOpen(false)}
                    className="pointer-events-auto"
                  >
                    <motion.div
                      initial={false}
                      animate={{
                        width: isDesktopNavOpen ? 760 : 160,
                        height: isDesktopNavOpen ? 56 : 36,
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      className="relative flex items-center justify-center overflow-hidden border border-t-0 border-[#D9C7BA] bg-[#FFFDF9]/98 shadow-xl backdrop-blur-md rounded-b-[20px] outline-none"
                    >
                      {!isDesktopNavOpen && (
                        <motion.div
                          key="chevron"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-2"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#72665D]/60">Menu</span>
                          <svg className="h-4 w-4 text-[#72665D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      )}

                      <AnimatePresence mode="wait">
                        {isDesktopNavOpen && (
                          <motion.nav
                            key="expanded-links"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15, delay: 0.1 }}
                            className="flex items-center justify-center gap-8 px-8"
                          >
                            {navLinks.map((link) => (
                              <Link
                                key={link.name}
                                href={link.href}
                                className="whitespace-nowrap text-[15px] font-medium text-[#72665D] hover:text-[#B8643E] transition-colors"
                              >
                                {link.name}
                              </Link>
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
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[24px] font-bold text-[#72665D] hover:text-[#B8643E] transition-colors py-4 border-b border-[#E7DDD3] flex items-center justify-between group"
                >
                  <span>{link.name}</span>
                  <svg className="w-5 h-5 text-[#B8643E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
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
