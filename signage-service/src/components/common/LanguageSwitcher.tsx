'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

const LanguageSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'de', name: 'DE' },
    { code: 'en', name: 'EN' },
    { code: 'ru', name: 'RU' },
    { code: 'tr', name: 'TR' },
    { code: 'pl', name: 'PL' },
    { code: 'ar', name: 'AR' },
  ] as const;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pr-header-control flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[14px] font-bold text-[#414B59] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8643E]/35 ${
          isOpen ? 'pr-header-control-open' : ''
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="uppercase">{locale}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="pr-nav-panel-surface absolute z-[60] mt-2 w-24 rounded-2xl border p-2 ltr:right-0 rtl:left-0 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col">
            {languages.map((lang) => (
              <Link
                key={lang.code}
                href={pathname}
                locale={lang.code}
                hrefLang={lang.code}
                onClick={() => setIsOpen(false)}
                aria-current={locale === lang.code ? 'true' : undefined}
                className={`pr-header-dropdown-item rounded-lg px-3 py-2 text-start text-[14px] font-medium transition-colors focus-visible:outline-none ${
                  locale === lang.code
                    ? 'pr-header-dropdown-item-active font-semibold'
                    : ''
                }`}
              >
                {lang.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
