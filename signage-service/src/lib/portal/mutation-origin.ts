const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const TRUSTED_FETCH_SITES = new Set(['same-origin', 'none']);

export type PortalMutationOriginRequest = {
  method: string;
  headers: {
    get(name: string): string | null;
  };
  nextUrl: {
    origin: string;
    protocol: string;
  };
};

function firstHeaderValue(value: string | null): string | null {
  return value?.split(',')[0]?.trim() || null;
}

function expectedOrigins(request: PortalMutationOriginRequest): Set<string> {
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

function hasExpectedOrigin(request: PortalMutationOriginRequest, value: string): boolean {
  try {
    return expectedOrigins(request).has(new URL(value).origin);
  } catch {
    return false;
  }
}

export function isAllowedPortalMutationRequest(request: PortalMutationOriginRequest): boolean {
  if (SAFE_METHODS.has(request.method.toUpperCase())) {
    return true;
  }

  const fetchSite = request.headers.get('sec-fetch-site')?.trim().toLowerCase();

  if (fetchSite && !TRUSTED_FETCH_SITES.has(fetchSite)) {
    return false;
  }

  const origin = request.headers.get('origin');

  if (origin && !hasExpectedOrigin(request, origin)) {
    return false;
  }

  const referer = request.headers.get('referer');

  if (!origin && referer && !hasExpectedOrigin(request, referer)) {
    return false;
  }

  return true;
}
