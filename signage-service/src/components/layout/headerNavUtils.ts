const LOCALE_PREFIX_REGEX = /^\/(de|en|ru|tr|pl|ar)(?=\/|$)/;

function normalizeNavPath(path: string): string {
  const pathWithoutQuery = path.split(/[?#]/)[0] || '/';
  const pathWithoutLocale = pathWithoutQuery.replace(LOCALE_PREFIX_REGEX, '') || '/';

  return pathWithoutLocale !== '/' && pathWithoutLocale.endsWith('/')
    ? pathWithoutLocale.slice(0, -1)
    : pathWithoutLocale;
}

export function isActiveNavPath(pathname: string, href: string): boolean {
  if (!href.startsWith('/')) {
    return false;
  }

  const currentPath = normalizeNavPath(pathname);
  const targetPath = normalizeNavPath(href);

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}

export function isExactNavPath(pathname: string, href: string): boolean {
  if (!href.startsWith('/')) {
    return false;
  }

  return normalizeNavPath(pathname) === normalizeNavPath(href);
}
