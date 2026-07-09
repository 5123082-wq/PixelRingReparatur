import type { Metadata } from 'next';

export const SITE_BASE_URL = normalizeSiteBaseUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'https://www.pixel-ring.com'
);

export const SITE_LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'] as const;

export type SiteLocale = (typeof SITE_LOCALES)[number];

export const DEFAULT_SITE_LOCALE: SiteLocale = 'de';

export const OPEN_GRAPH_LOCALE_BY_LOCALE: Record<SiteLocale, string> = {
  de: 'de_DE',
  en: 'en_US',
  ru: 'ru_RU',
  tr: 'tr_TR',
  pl: 'pl_PL',
  ar: 'ar_AR',
};

export const PUBLIC_SITEMAP_PATHS = [
  '',
  '/leistungen',
  '/leistungen/werbeanlagen-reparatur',
  '/leistungen/werbeanlagen-reinigung',
  '/leistungen/lichtwerbung-led-modernisierung',
  '/leistungen/werbeanlagen-audit-diagnose',
  '/leistungen/montage-demontage-werbeanlagen',
  '/leistungen/druckprodukte-branding-werbematerialien',
  '/probleme-loesungen',
  '/business',
  '/referenzen',
  '/ueber-uns',
  '/impressum',
  '/privacy',
] as const;

export const PROBLEM_ARTICLE_PUBLIC_SLUGS = [
  'werbeanlage-leuchtet-nicht',
  'werbeanlage-flackert',
  'led-leuchtet-ungleichmaessig',
  'buchstabe-leuchtet-nicht',
  'werbeanlage-schaltet-nach-regen-ab',
  'folie-loest-sich',
  'folie-ist-ausgeblichen',
  'werbeanlage-wackelt',
  'dringende-reparatur-werbeanlage',
] as const;

function normalizeSiteBaseUrl(value: string): string {
  try {
    const url = new URL(value);
    url.pathname = '';
    url.search = '';
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return 'https://www.pixel-ring.com';
  }
}

export function buildSiteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_BASE_URL}${normalizedPath}`;
}

export function buildLocalePath(locale: string, path = ''): string {
  const normalizedPath = path === '' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${normalizedPath}`;
}

export function buildLocaleUrl(locale: string, path = ''): string {
  return buildSiteUrl(buildLocalePath(locale, path));
}

export function buildLanguageAlternates(path = ''): Record<string, string> {
  return buildLanguageAlternatesForLocales(SITE_LOCALES, path);
}

export function getSiteLocale(locale: string): SiteLocale {
  return SITE_LOCALES.includes(locale as SiteLocale) ? (locale as SiteLocale) : DEFAULT_SITE_LOCALE;
}

export function buildOpenGraphAlternateLocales(locale: string): string[] {
  const safeLocale = getSiteLocale(locale);

  return SITE_LOCALES
    .filter((entryLocale) => entryLocale !== safeLocale)
    .map((entryLocale) => OPEN_GRAPH_LOCALE_BY_LOCALE[entryLocale]);
}

export function buildLanguageAlternatesForLocales(
  locales: readonly SiteLocale[],
  path = '',
  defaultLocale: SiteLocale = DEFAULT_SITE_LOCALE
): Record<string, string> {
  const defaultLocaleForPath = locales.includes(defaultLocale) ? defaultLocale : locales[0];

  return {
    ...Object.fromEntries(
      locales.map((locale) => [locale, buildLocaleUrl(locale, path)])
    ),
    ...(defaultLocaleForPath ? { 'x-default': buildLocaleUrl(defaultLocaleForPath, path) } : {}),
  };
}

export function buildPublicPageMetadata({
  locale,
  path = '',
  title,
  description,
  image,
  imageAlt,
  siteName = 'PixelRing',
  includeLanguageAlternates = true,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  siteName?: string;
  includeLanguageAlternates?: boolean;
}): Metadata {
  const safeLocale = getSiteLocale(locale);
  const canonicalUrl = buildLocaleUrl(safeLocale, path);
  const imageUrl = image ? buildSiteUrl(image) : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      ...(includeLanguageAlternates ? { languages: buildLanguageAlternates(path) } : {}),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      type: 'website',
      locale: OPEN_GRAPH_LOCALE_BY_LOCALE[safeLocale],
      alternateLocale: buildOpenGraphAlternateLocales(safeLocale),
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: imageAlt ?? title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}
