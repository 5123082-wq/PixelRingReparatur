'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

type FooterLink = {
  label: string;
  href: string;
  key?: string;
};

type FooterContent = {
  servicesTitle?: string | null;
  supportTitle?: string | null;
  socialTitle?: string | null;
  companyTitle?: string | null;
  copyright?: string | null;
  serviceLinks?: FooterLink[];
  supportLinks?: FooterLink[];
  socialLinks?: FooterLink[];
  legalLinks?: FooterLink[];
  companyLines?: string[];
  hours?: string | null;
  email?: string | null;
};

const Footer = ({ content }: { content?: FooterContent | null }) => {
  const t = useTranslations('Footer');

  const serviceLinks = (content?.serviceLinks?.length
    ? content.serviceLinks
    : [
        { label: t('services_sign_repair'), href: '/services/sign-repair' },
        { label: t('services_installation'), href: '/services/installation' },
        { label: t('services_lighting'), href: '/services/light-advertising' },
        { label: t('services_branding'), href: '/services/branding' },
        { label: t('services_maintenance'), href: '/services/maintenance' },
      ]).map((link) => ({ name: link.label, href: link.href }));

  const supportLinks = (content?.supportLinks?.length
    ? content.supportLinks
    : [
        { label: t('how_it_works'), href: '/#how-it-works' },
        { label: t('status_check'), href: '/status' },
        { label: t('help_center'), href: '/support' },
        { label: t('contact'), href: '/contact' },
      ]).map((link) => ({ name: link.label, href: link.href }));

  const socialLinks = (content?.socialLinks?.length
    ? content.socialLinks
    : [
        { label: 'YouTube', href: 'https://youtube.com' },
        { label: 'Telegram', href: 'https://t.me' },
        { label: 'WhatsApp', href: 'https://wa.me' },
      ]).map((link) => ({ name: link.label, href: link.href }));

  const legalLinks = (content?.legalLinks?.length
    ? content.legalLinks
    : [
        { label: t('impressum'), href: '/impressum', key: 'impressum' },
        { label: t('privacy'), href: '/privacy', key: 'privacy' },
        { label: t('terms'), href: '/terms', key: 'terms' },
        { label: t('cancellation'), href: '/cancellation', key: 'cancellation' },
        { label: t('cookies'), href: '/cookies', key: 'cookies' },
      ])
    .filter(link => {
      // If we have an explicit key (from fallback), use it
      if (link.key) return ['impressum', 'privacy'].includes(link.key);
      // Otherwise fallback to checking the href path
      const path = link.href.replace(/^\//, '').split('/').pop();
      return ['impressum', 'privacy'].includes(path || '');
    })
    .map((link) => ({ name: link.label, href: link.href }));

  const companyLines = content?.companyLines?.length
    ? content.companyLines
    : ['PixelRing Technical Atelier', 'Berlin, Deutschland'];
  const companyHours = content?.hours ?? 'Mo — Fr: 09:00 - 18:00';
  const companyEmail = content?.email ?? 'service@pixelring.de';

  return (
    <footer className="w-full bg-[#F7F1E8] pt-0 pb-10 px-6 sm:px-10 border-t border-[#E7DDD3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="h-12 md:h-16" aria-hidden />

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
          {/* Column 1: Services */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[14px] font-bold text-black uppercase tracking-widest">
              {content?.servicesTitle ?? t('services')}
            </h4>
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
            <h4 className="text-[14px] font-bold text-black uppercase tracking-widest">
              {content?.supportTitle ?? t('support_title')}
            </h4>
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
            <h4 className="text-[14px] font-bold text-black uppercase tracking-widest">
              {content?.socialTitle ?? t('social')}
            </h4>
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
            <h4 className="text-[14px] font-bold text-black uppercase tracking-widest">
              {content?.companyTitle ?? t('company')}
            </h4>
            <div className="text-[15px] text-[#72665D] leading-relaxed">
              {companyLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p className="mt-4">{companyHours}</p>
              <p className="mt-2 font-medium text-black">{companyEmail}</p>
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
            {content?.copyright ?? t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
