'use client';

import React from 'react';
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

const LEGAL_LABELS_DE: Record<string, string> = {
  '/impressum': 'Impressum',
  '/privacy': 'Datenschutzerklärung',
};

const ACTIVE_LEGAL_HREFS = new Set(Object.keys(LEGAL_LABELS_DE));

const Footer = ({ content }: { content?: FooterContent | null }) => {
  const serviceLinks = (content?.serviceLinks || []).map((link) => ({
    name: link.label,
    href: link.href,
  }));

  const supportLinks = (content?.supportLinks || []).map((link) => ({
    name: link.label,
    href: link.href,
  }));

  const socialLinks = (content?.socialLinks || []).map((link) => ({
    name: link.label,
    href: link.href,
  }));

  const legalLinks = (content?.legalLinks || [])
    .filter((link) => ACTIVE_LEGAL_HREFS.has(link.href))
    .map((link) => ({
      name: LEGAL_LABELS_DE[link.href] ?? link.label,
      href: link.href,
    }));

  const companyLines = content?.companyLines || [];
  const companyHours = content?.hours || '';
  const companyEmail = content?.email || '';

  return (
    <footer className="w-full bg-[#F7F1E8] pt-0 pb-10 px-6 sm:px-10 border-t border-[#E7DDD3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="h-12 md:h-16" aria-hidden />

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
          {/* Column 1: Services */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[14px] font-bold text-black uppercase tracking-widest">
              {content?.servicesTitle || ''}
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
              {content?.supportTitle || ''}
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
              {content?.socialTitle || ''}
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
              {content?.companyTitle || ''}
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
            {content?.copyright || ''}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
