export const SITE_BASE_URL = normalizeSiteBaseUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'https://www.pixel-ring.com'
);

export const SITE_LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'] as const;

export type SiteLocale = (typeof SITE_LOCALES)[number];

export const DEFAULT_SITE_LOCALE: SiteLocale = 'de';

export const PUBLIC_SITEMAP_PATHS = [
  '',
  '/leistungen',
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
  return {
    ...Object.fromEntries(
    SITE_LOCALES.map((locale) => [locale, buildLocaleUrl(locale, path)])
    ),
    'x-default': buildLocaleUrl(DEFAULT_SITE_LOCALE, path),
  };
}
