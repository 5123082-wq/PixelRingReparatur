'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

const LANGUAGES = [
  { code: 'de', name: 'DE', accessibleName: 'Deutsch' },
  { code: 'en', name: 'EN', accessibleName: 'English' },
  { code: 'ru', name: 'RU', accessibleName: 'Русский' },
  { code: 'tr', name: 'TR', accessibleName: 'Türkçe' },
  { code: 'pl', name: 'PL', accessibleName: 'Polski' },
  { code: 'ar', name: 'AR', accessibleName: 'العربية' },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]['code'];

const SWITCHER_LABELS: Record<LanguageCode, string> = {
  de: 'Sprache wechseln. Aktuell: Deutsch',
  en: 'Change language. Current: English',
  ru: 'Сменить язык. Сейчас: русский',
  tr: 'Dili değiştir. Mevcut dil: Türkçe',
  pl: 'Zmień język. Obecnie: polski',
  ar: 'تغيير اللغة. اللغة الحالية: العربية',
};

const LanguageSwitcher = ({
  availableLocales,
}: {
  availableLocales?: readonly LanguageCode[];
}) => {
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const visibleLanguages = availableLocales
    ? LANGUAGES.filter((language) => availableLocales.includes(language.code))
    : LANGUAGES;
  const currentLocale = LANGUAGES.some((language) => language.code === locale)
    ? (locale as LanguageCode)
    : 'en';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`pr-header-control flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[14px] font-bold text-[#414B59] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8643E]/35 ${
          isOpen ? 'pr-header-control-open' : ''
        }`}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={SWITCHER_LABELS[currentLocale]}
      >
        <span className="uppercase">{locale}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <nav
        id={menuId}
        hidden={!isOpen}
        aria-label={SWITCHER_LABELS[currentLocale]}
        className="pr-nav-panel-surface absolute z-[60] mt-2 w-24 rounded-2xl border p-2 ltr:right-0 rtl:left-0 animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <div className="flex flex-col">
          {visibleLanguages.map((lang) => (
            <Link
              key={lang.code}
              href={pathname}
              locale={lang.code}
              hrefLang={lang.code}
              prefetch={false}
              onClick={() => setIsOpen(false)}
              aria-current={locale === lang.code ? 'page' : undefined}
              aria-label={lang.accessibleName}
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
      </nav>
    </div>
  );
};

export default LanguageSwitcher;
