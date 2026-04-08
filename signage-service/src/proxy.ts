import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const CRM_PATH = 'ring-manager-crm';
const CMS_PATH = 'ring-master-config';
const OLD_ADMIN_PATH = 'ring-master-admin';
const CRM_SESSION_COOKIE_NAME = 'pixelring_crm_session';
const CMS_SESSION_COOKIE_NAME = 'pixelring_cms_session';

function stripLocale(pathname: string) {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return { locale, stripped: pathname.slice(locale.length + 1) || '/' };
    }
  }

  return { locale: null, stripped: pathname };
}

function buildLocalePath(locale: string, path: string) {
  return `/${locale}${path}`;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locale, stripped } = stripLocale(pathname);

  if (stripped === `/${OLD_ADMIN_PATH}` || stripped.startsWith(`/${OLD_ADMIN_PATH}/`)) {
    const newStripped = stripped.replace(`/${OLD_ADMIN_PATH}`, `/${CRM_PATH}`);
    const redirectPath = locale ? buildLocalePath(locale, newStripped) : newStripped;

    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (stripped === `/${CRM_PATH}` || stripped.startsWith(`/${CRM_PATH}/`)) {
    if (!locale) {
      return NextResponse.redirect(new URL(`/de${stripped}`, request.url));
    }

    if (stripped === `/${CRM_PATH}`) {
      return NextResponse.next();
    }

    const adminCookie = request.cookies.get(CRM_SESSION_COOKIE_NAME)?.value;
    if (!adminCookie) {
      return NextResponse.redirect(new URL(buildLocalePath(locale, `/${CRM_PATH}`), request.url));
    }

    return NextResponse.next();
  }

  if (stripped === `/${CMS_PATH}` || stripped.startsWith(`/${CMS_PATH}/`)) {
    if (!locale) {
      return NextResponse.redirect(new URL(`/de${stripped}`, request.url));
    }

    if (stripped === `/${CMS_PATH}`) {
      return NextResponse.next();
    }

    const adminCookie = request.cookies.get(CMS_SESSION_COOKIE_NAME)?.value;
    if (!adminCookie) {
      return NextResponse.redirect(new URL(buildLocalePath(locale, `/${CMS_PATH}`), request.url));
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/(de|en|ru|tr|pl|ar)/:path*',
    '/admin/:path*',
    '/ring-master-admin/:path*',
    '/ring-manager-crm/:path*',
    '/ring-master-config/:path*',
  ],
};
