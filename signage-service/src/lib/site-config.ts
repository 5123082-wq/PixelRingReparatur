/**
 * Central site configuration.
 *
 * All public-facing contact data and messenger URLs live here.
 * Update once → reflects across every component automatically.
 *
 * NEXT_PUBLIC_* variables are inlined at build time by Next.js and are
 * safe to use in both Server and Client components.
 */

export const SITE_CONFIG = {
  company: {
    name: 'PixelRing Technical Service',
    legalName: 'NVKV Werbeagentur Inh. Ivan Novikov',
    legalEmail: 'info@nvkv.de',
    email: 'info@pixel-ring.com',
    phone: ['01605911284', '03043202390'],
    vatId: 'DE367887602',
    hours: 'Mo–Fr 09:00–18:00',
    address: {
      street: 'Dannenwalder Weg 110',
      city: '13439 Berlin',
      country: 'Deutschland',
    },
  },
  messengers: {
    /** Public WhatsApp link. Override via NEXT_PUBLIC_WHATSAPP_URL in .env */
    whatsapp:
      process.env.NEXT_PUBLIC_WHATSAPP_URL ?? 'https://wa.me/message/27UOBFWB7UYCN1',
    /** Public Telegram bot/channel link. Override via NEXT_PUBLIC_TELEGRAM_URL in .env */
    telegram:
      process.env.NEXT_PUBLIC_TELEGRAM_URL ?? 'https://t.me/PixelRing_bot',
  },
} as const;
