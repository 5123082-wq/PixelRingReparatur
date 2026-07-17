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
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

function isProblemArticlePath(path: string) {
  return /^\/probleme-loesungen\/[^/]+\/?$/.test(path);
}

function isRetiredGonePath(path: string) {
  return (
    path === '/contact' ||
    path === '/hilfe' ||
    path === '/support' ||
    path.startsWith('/services/')
  );
}

function isRetiredPublicPath(path: string) {
  return path === '/service' || isRetiredGonePath(path);
}

function isPrepublicationServicePath(path: string) {
  return /^\/leistungen\/beleuchtete-markisenvolants\/?$/.test(path);
}

function normalizeXDefaultLinkHeader(response: NextResponse, request: NextRequest, locale: string | null, stripped: string) {
  if (!locale) {
    return;
  }

  const linkHeader = response.headers.get('Link');
  if (!linkHeader || !linkHeader.includes('hreflang="x-default"')) {
    return;
  }

  const xDefaultUrl = new URL(buildLocalePath(routing.defaultLocale, stripped), request.url).toString();
  const normalizedHeader = linkHeader.replace(
    /<[^>]+>(;\s*rel="alternate";\s*hreflang="x-default")/,
    `<${xDefaultUrl}>$1`
  );

  response.headers.set('Link', normalizedHeader);
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locale, stripped } = stripLocale(pathname);
  const isServicePreview = request.nextUrl.searchParams.get('cmsPreview') === '1';

  if (isRetiredGonePath(stripped) || (!locale && stripped === '/service' && !isServicePreview)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

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

  const response = intlMiddleware(request);

  if (isProblemArticlePath(stripped) || isRetiredPublicPath(stripped) || isPrepublicationServicePath(stripped)) {
    response.headers.delete('Link');
  }

  normalizeXDefaultLinkHeader(response, request, locale, stripped);

  return response;
}

export const config = {
  matcher: [
    // Standard internationalized routes
    '/',
    '/(de|en|ru|tr|pl|ar)/:path*',
    
    // Admin & Dashboard routes
    '/admin/:path*',
    '/ring-master-admin/:path*',
    '/ring-manager-crm/:path*',
    '/ring-master-config/:path*',

    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - images/uploads (public media files)
    // - favicon.ico, sitemap.xml, robots.txt (static files)
    // - any direct file request with an extension
    '/((?!api|_next/static|_next/image|images|uploads|favicon.ico|icon.png|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
