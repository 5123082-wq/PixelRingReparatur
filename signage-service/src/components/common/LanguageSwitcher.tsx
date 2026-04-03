'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname, routing } from '@/i18n/routing';

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
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
  ];

  const handleLocaleChange = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
    setIsOpen(false);
  };

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
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 border border-[#E7DDD3] rounded-full text-[14px] font-bold text-[#72665D] hover:border-[#C86E4A] hover:text-[#C86E4A] transition-all"
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
        <div className="absolute right-0 mt-2 w-24 bg-white border border-[#E7DDD3] rounded-2xl shadow-xl shadow-[#0E1A2B10] py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLocaleChange(lang.code)}
                className={`px-4 py-2 text-left text-[14px] font-medium transition-colors ${
                  locale === lang.code
                    ? 'text-[#C86E4A] bg-[#F6F0E9]'
                    : 'text-[#72665D] hover:bg-[#F6F0E950] hover:text-[#C86E4A]'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
