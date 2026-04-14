'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const Footer = () => {
  const t = useTranslations('Footer');

  const serviceLinks = [
    { name: t('services_sign_repair'), href: '/services/sign-repair' },
    { name: t('services_installation'), href: '/services/installation' },
    { name: t('services_lighting'), href: '/services/light-advertising' },
    { name: t('services_branding'), href: '/services/branding' },
    { name: t('services_maintenance'), href: '/services/maintenance' },
  ];

  const supportLinks = [
    { name: t('how_it_works'), href: '/#how-it-works' },
    { name: t('status_check'), href: '/status' },
    { name: t('help_center'), href: '/support' },
    { name: t('contact'), href: '/contact' },
  ];

  const socialLinks = [
    { name: 'YouTube', href: 'https://youtube.com', icon: 'YT' },
    { name: 'Telegram', href: 'https://t.me', icon: 'TG' },
    { name: 'WhatsApp', href: 'https://wa.me', icon: 'WA' },
  ];

  const legalLinks = [
    { name: t('impressum'), href: '/impressum' },
    { name: t('privacy'), href: '/privacy' },
    { name: t('terms'), href: '/terms' },
    { name: t('cancellation'), href: '/cancellation' },
    { name: t('cookies'), href: '/cookies' },
  ];

  return (
    <footer className="w-full bg-[#F7F1E8] pt-0 pb-10 px-6 sm:px-10 border-t border-[#E7DDD3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="h-12 md:h-16" aria-hidden />

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
          {/* Column 1: Services */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[14px] font-bold text-black uppercase tracking-widest">{t('services')}</h4>
            <div className="flex flex-col gap-4">
              {serviceLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-[15px] text-[#72665D] hover:text-black transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Support */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[14px] font-bold text-black uppercase tracking-widest">{t('support_title')}</h4>
            <div className="flex flex-col gap-4">
              {supportLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-[15px] text-[#72665D] hover:text-black transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Social */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[14px] font-bold text-black uppercase tracking-widest">{t('social')}</h4>
            <div className="flex flex-col gap-4">
              {socialLinks.map((link) => (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="text-[15px] text-[#72665D] hover:text-black transition-colors flex items-center gap-2">
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Contact/Info */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[14px] font-bold text-black uppercase tracking-widest">{t('company')}</h4>
            <div className="text-[15px] text-[#72665D] leading-relaxed">
              <p>PixelRing Technical Atelier</p>
              <p>Berlin, Deutschland</p>
              <p className="mt-4">Mo — Fr: 09:00 - 18:00</p>
              <p className="mt-2 font-medium text-black">service@pixelring.de</p>
            </div>
          </div>
        </div>

        {/* Large Brand Background Text - Inspired by L1GROUP */}
        <div className="absolute right-0 bottom-12 select-none pointer-events-none opacity-[0.03] overflow-hidden whitespace-nowrap">
          <span className="text-[180px] lg:text-[280px] font-bold tracking-tighter text-black leading-none">
            PIXELRING
          </span>
        </div>

        {/* Bottom Section: Legal & Copyright */}
        <div className="border-t border-[#E7DDD3] pt-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4">
            {legalLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-[13px] text-[#72665D] hover:text-black transition-colors font-medium">
                {link.name}
              </Link>
            ))}
          </div>
          <p className="text-[13px] text-[#72665D]/60 whitespace-nowrap">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
