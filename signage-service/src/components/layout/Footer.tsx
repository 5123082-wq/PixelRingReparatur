'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const Footer = () => {
  const t = useTranslations('Footer');

  const links = [
    { name: t('privacy'), href: '/privacy' },
    { name: t('terms'), href: '/terms' },
    { name: t('compliance'), href: '/compliance' },
    { name: t('locations'), href: '/locations' },
  ];

  return (
    <footer className="w-full bg-[#F7F1E8] py-12 px-10 border-t border-[#E7DDD3]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-start">
        {/* Paragraph section */}
        <div className="flex flex-col gap-4 max-w-sm">
          <span className="text-[20px] font-medium text-[#2B2621] leading-[1.4]">
            PixelRing
          </span>
          <p className="text-[14px] text-[#72665D] leading-[1.42857]">
            {t('copyright')}
          </p>
        </div>

        {/* Links section */}
        <div className="flex flex-wrap justify-center gap-6">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[14px] text-[#72665D] hover:text-[#B8643E] transition-colors leading-[1.42857]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action/Social section */}
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 bg-[#EED8C8] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#E7DDD3] transition-all">
            {/* Social Icon placeholder or SVG */}
            <svg
              className="w-5 h-5 text-[#B8643E]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.151-1.11-1.458-1.11-1.458-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.099 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.137 20.164 22 16.417 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
