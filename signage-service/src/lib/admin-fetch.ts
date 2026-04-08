import {
  ADMIN_CSRF_HEADER_NAME,
  ADMIN_CSRF_HEADER_VALUE,
} from '@/lib/admin-csrf-constants';

export function withAdminCsrfHeaders(headers?: HeadersInit): Headers {
  const nextHeaders = new Headers(headers);
  nextHeaders.set(ADMIN_CSRF_HEADER_NAME, ADMIN_CSRF_HEADER_VALUE);

  return nextHeaders;
}

export function adminFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  return fetch(input, {
    ...init,
    headers: withAdminCsrfHeaders(init.headers),
  });
}
