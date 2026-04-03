'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Logo from '../common/Logo';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { usePathname } from 'next/navigation';

const Header = () => {
  const t = useTranslations('Nav');
  const pathname = usePathname();

  const navLinks = [
    { name: t('services'), href: '#services' },
    { name: t('warranty'), href: '#warranty' },
    { name: t('status'), href: '#status' },
    { name: t('support'), href: '#support' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F6F0E9A3] backdrop-blur-[10.5px] border-b border-[#E7DDD3]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand/Logo */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <Logo className="scale-75 origin-left" />
          </Link>
          <div className="hidden sm:flex px-3 py-1 bg-[#F3E2D5] border border-[#E7DDD3] rounded-full">
            <span className="text-[12px] font-bold text-[#C86E4A] tracking-[1.4px]">
              {t('service_pill')}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[16px] text-[#72665D] hover:text-[#C86E4A] transition-colors relative group"
            >
              {link.name}
              {/* Optional underline for active state could be added here */}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button className="hidden sm:block p-2 text-[#72665D] hover:text-[#C86E4A] transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
          <Link
            href="#book"
            className="hidden md:block px-6 py-2.5 bg-[#C86E4A] hover:bg-[#B05B3A] text-[#FFFDF9] text-[16px] font-medium rounded-full shadow-lg shadow-[#0040a133] transition-all"
          >
            {t('book')}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
