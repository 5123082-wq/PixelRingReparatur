'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Logo from '../common/Logo';
import LanguageSwitcher from '../common/LanguageSwitcher';
import MessengerButtons from '../common/MessengerButtons';
import ContactModal from '../common/ContactModal';
import ChatModal from '../common/ChatModal';

const Header = () => {
  const t = useTranslations('Nav');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: t('services'), href: '#services' },
    { name: t('warranty'), href: '#warranty' },
    { name: t('status'), href: '#status' },
    { name: t('support'), href: '#support' },
  ];

  // Prevent scrolling when menu is open
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

  // Close menu on screen resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#EEF3FBA3] backdrop-blur-[10.5px] border-b border-[#E7DDD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand/Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/">
              <Logo className="scale-[0.85] sm:scale-100 rtl:origin-right ltr:origin-left" />
            </Link>
            <div className="hidden sm:flex md:flex px-3 py-1 bg-[#EEF3FB] border border-[#E7DDD3] rounded-full">
              <span className="text-[12px] font-bold text-[#B8643E] tracking-[1.4px]">
                {t('service_pill')}
              </span>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[16px] text-[#72665D] hover:text-[#B8643E] transition-colors relative group"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <MessengerButtons compact />
            <LanguageSwitcher />
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden md:block px-6 py-2.5 bg-[#B8643E] hover:bg-[#A65835] text-[#FFFDF9] text-[16px] font-medium rounded-full shadow-lg shadow-[#B8643E33] transition-all"
            >
              {t('book')}
            </button>

            {/* Hamburger Button */}
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

      </header>

      {/* Mobile Menu Overlay */}
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
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full px-6 py-5 bg-[#B8643E] text-[#FFFDF9] text-[18px] font-bold rounded-2xl shadow-xl shadow-[#B8643E33] transition-all active:scale-[0.98]"
              >
                {t('book')}
              </button>

              <div className="pt-8 border-t border-[#E7DDD3]">
                <p className="text-[14px] text-[#72665D]/60 mb-6 font-bold uppercase tracking-wider">
                  WhatsApp / Telegram
                </p>
                <MessengerButtons />
              </div>
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
