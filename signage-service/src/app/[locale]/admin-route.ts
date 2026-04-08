export const SUPPORTED_LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'] as const;

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

function hasLocalePrefix(path: string): boolean {
  return SUPPORTED_LOCALES.some(
    (locale) => path === `/${locale}` || path.startsWith(`/${locale}/`)
  );
}

export function getLocaleSegment(
  value: string | string[] | undefined | null,
  fallback = 'de'
): string {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

export function withLocalePath(locale: string, path: string): string {
  const normalizedPath = normalizePath(path);

  if (hasLocalePrefix(normalizedPath)) {
    return normalizedPath;
  }

  return `/${locale}${normalizedPath}`;
}

export function isLocalizedRouteActive(
  pathname: string,
  locale: string,
  route: string
): boolean {
  const localizedRoute = withLocalePath(locale, route);

  return pathname === localizedRoute || pathname.startsWith(`${localizedRoute}/`);
}

export function resolveLocalizedRedirect(
  locale: string,
  redirectTo: string | null | undefined,
  fallbackPath: string
): string {
  const target =
    typeof redirectTo === 'string' && redirectTo.trim().length > 0
      ? redirectTo.trim()
      : fallbackPath;

  return withLocalePath(locale, target);
}
