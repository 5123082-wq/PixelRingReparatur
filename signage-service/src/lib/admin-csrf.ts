import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  ADMIN_CSRF_HEADER_NAME,
  ADMIN_CSRF_HEADER_VALUE,
} from '@/lib/admin-csrf-constants';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const TRUSTED_FETCH_SITES = new Set(['same-origin', 'none']);

function firstHeaderValue(value: string | null): string | null {
  return value?.split(',')[0]?.trim() || null;
}

function getExpectedOrigins(request: NextRequest): Set<string> {
  const origins = new Set<string>([request.nextUrl.origin]);
  const forwardedHost = firstHeaderValue(request.headers.get('x-forwarded-host'));
  const host = forwardedHost || firstHeaderValue(request.headers.get('host'));
  const forwardedProto = firstHeaderValue(request.headers.get('x-forwarded-proto'));
  const protocol = forwardedProto || request.nextUrl.protocol.replace(':', '');

  if (host && protocol) {
    origins.add(`${protocol}://${host}`);
  }

  return origins;
}

function isExpectedOrigin(request: NextRequest, value: string): boolean {
  try {
    const origin = new URL(value).origin;
    return getExpectedOrigins(request).has(origin);
  } catch {
    return false;
  }
}

function rejectAdminCsrf() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export function validateAdminCsrf(request: NextRequest): NextResponse | null {
  if (SAFE_METHODS.has(request.method.toUpperCase())) {
    return null;
  }

  if (request.headers.get(ADMIN_CSRF_HEADER_NAME) !== ADMIN_CSRF_HEADER_VALUE) {
    return rejectAdminCsrf();
  }

  const fetchSite = request.headers.get('sec-fetch-site')?.trim().toLowerCase();

  if (fetchSite && !TRUSTED_FETCH_SITES.has(fetchSite)) {
    return rejectAdminCsrf();
  }

  const origin = request.headers.get('origin');

  if (origin && !isExpectedOrigin(request, origin)) {
    return rejectAdminCsrf();
  }

  const referer = request.headers.get('referer');

  if (!origin && referer && !isExpectedOrigin(request, referer)) {
    return rejectAdminCsrf();
  }

  return null;
}
