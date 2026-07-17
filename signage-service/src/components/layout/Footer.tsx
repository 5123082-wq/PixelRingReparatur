'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { SITE_CONFIG } from '@/lib/site-config';

// ─── CMS Types ────────────────────────────────────────────────────────────────

type FooterLink = {
  label: string;
  href: string;
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

// ─── Fallback Data ────────────────────────────────────────────────────────────

/** Navigation links shown when CMS doesn't provide data. */
const FALLBACK_NAV = {
  col1Title: 'Unternehmen',
  col1Links: [
    { name: 'Leistungen', href: '/leistungen' },
    { name: 'Über uns', href: '/ueber-uns' },
    { name: 'Referenzen', href: '/referenzen' },
    { name: 'Für Unternehmen', href: '/business' },
  ],
  col2Title: 'Service & Hilfe',
  col2Links: [
    { name: 'Status prüfen', href: '/status' },
    { name: 'Probleme & Lösungen', href: '/probleme-loesungen' },
    { name: 'Kundenportal', href: '/portal' },
  ],
  col3Title: 'Kontakt',
  col4Title: 'Adresse',
  copyright: `© ${new Date().getFullYear()} PixelRing Technical Atelier. Alle Rechte vorbehalten.`,
};

/**
 * Legal links shown in the bottom bar.
 * Impressum and Datenschutzerklärung are permanent — never removed.
 */
const LEGAL_LINKS = [
  { name: 'Impressum', href: '/impressum' },
  { name: 'Datenschutzerklärung', href: '/privacy' },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconWhatsApp = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const IconTelegram = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const IconMail = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const IconChat = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

// ─── Column heading component ─────────────────────────────────────────────────

const ColHeading = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[12px] font-bold text-black uppercase tracking-[2px] mb-5">
    {children}
  </p>
);

// ─── Link styles ──────────────────────────────────────────────────────────────

const linkCls =
  'flex items-center gap-2 text-[15px] text-[#72665D] hover:text-black transition-colors leading-snug';

// ─── Main Component ───────────────────────────────────────────────────────────

const Footer = ({ content }: { content?: FooterContent | null }) => {
  const tNav = useTranslations('Nav');
  const tFooter = useTranslations('Footer');

  // Column 1 — Unternehmen (Overriding CMS to match agreed structure)
  const col1Title = tFooter('company') || 'Unternehmen';
  const col1Links = [
    { name: tNav('services'), href: '/leistungen' },
    { name: tNav('about'), href: '/ueber-uns' },
    { name: tNav('references'), href: '/referenzen' },
    { name: tNav('for_business'), href: '/business' },
  ];

  // Column 2 — Service & Hilfe (Overriding CMS to match agreed structure)
  const col2Title = tFooter('support_title') || 'Service & Hilfe';
  const col2Links = [
    { name: tFooter('status_check') || 'Status prüfen', href: '/status' },
    { name: tNav('solutions'), href: '/probleme-loesungen' },
    { name: 'Kundenportal', href: '/portal' },
  ];

  // Column 3 — Kontakt: always from site-config (messengers + email)
  const col3Title = content?.socialTitle || FALLBACK_NAV.col3Title;

  // Column 4 — Adresse: prefer CMS, fallback to site-config
  const col4Title = content?.companyTitle || FALLBACK_NAV.col4Title;
  const addressLines =
    content?.companyLines && content.companyLines.length > 0
      ? content.companyLines
      : [
          SITE_CONFIG.company.address.street,
          SITE_CONFIG.company.address.city,
          SITE_CONFIG.company.address.country,
        ];
  const hours = content?.hours || SITE_CONFIG.company.hours;
  const email = SITE_CONFIG.company.email;

  // Bottom bar
  const copyright = content?.copyright || FALLBACK_NAV.copyright;

  return (
    <footer className="w-full bg-[#F7F1E8] pt-0 pb-10 border-t border-[#E7DDD3] relative overflow-hidden">
      <div className="pr-site-container relative z-10">
        {/* Top spacing */}
        <div className="h-12 md:h-16" aria-hidden />

        {/* ── Grid: 4 columns ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">

          {/* Column 1 — Unternehmen */}
          <div className="flex flex-col">
            <ColHeading>{col1Title}</ColHeading>
            <nav className="flex flex-col gap-3" aria-label="Unternehmen">
              {col1Links.map((link) => (
                <Link key={link.href} href={link.href} className={linkCls}>
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 2 — Service & Hilfe */}
          <div className="flex flex-col">
            <ColHeading>{col2Title}</ColHeading>
            <nav className="flex flex-col gap-3" aria-label="Service">
              {/* The primary service CTA fires the site-wide chat event */}
              <button
                onClick={() => window.dispatchEvent(new Event('openChat'))}
                className={`${linkCls} text-left cursor-pointer`}
              >
                <IconChat />
                <span>{tNav('submit_request')}</span>
              </button>

              {col2Links.map((link) => (
                <Link key={link.href} href={link.href} className={linkCls}>
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 — Kontakt (always from site-config) */}
          <div className="flex flex-col">
            <ColHeading>{col3Title}</ColHeading>
            <div className="flex flex-col gap-3">
              <a
                href={SITE_CONFIG.messengers.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
              >
                <IconWhatsApp />
                <span className="text-[#25D366] font-medium">WhatsApp</span>
              </a>
              <a
                href={SITE_CONFIG.messengers.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
              >
                <IconTelegram />
                <span className="text-[#0088cc] font-medium">Telegram</span>
              </a>
              <a
                href={`mailto:${email}`}
                className={linkCls}
              >
                <IconMail />
                <span>{email}</span>
              </a>
            </div>
          </div>

          {/* Column 4 — Adresse */}
          <div className="flex flex-col">
            <ColHeading>{col4Title}</ColHeading>
            <address className="not-italic text-[15px] text-[#72665D] leading-relaxed flex flex-col gap-1">
              {addressLines.map((line, i) => (
                <span key={i}>{line}</span>
              ))}
              {hours && (
                <span className="mt-3 text-[13px] text-[#72665D]/70">{hours}</span>
              )}
            </address>
          </div>
        </div>

        {/* ── Large watermark "PIXELRING" ──────────────────────────────────── */}
        <div
          className="absolute right-0 bottom-12 select-none pointer-events-none opacity-[0.035] overflow-hidden whitespace-nowrap"
          aria-hidden
        >
          <span className="text-[180px] lg:text-[280px] font-bold tracking-tighter text-black leading-none">
            PIXELRING
          </span>
        </div>

        {/* ── Bottom bar: Legal + Copyright ────────────────────────────────── */}
        <div className="border-t border-[#E7DDD3] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-[#72665D] hover:text-black transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <p className="text-[13px] text-[#72665D]/60 whitespace-nowrap">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
