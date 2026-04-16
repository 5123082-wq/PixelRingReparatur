import type { NextRequest } from 'next/server';

const UUID_LIKE_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ParamsLike =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>;

export function isUuidLike(value: string): boolean {
  return UUID_LIKE_PATTERN.test(value);
}

export async function resolveUuidRouteParam(
  request: NextRequest,
  params: ParamsLike,
  key = 'id'
): Promise<string | null> {
  const resolved = await Promise.resolve(params);
  const candidate = resolved?.[key];
  const directValue = Array.isArray(candidate) ? candidate[0] : candidate;

  if (typeof directValue === 'string' && isUuidLike(directValue)) {
    return directValue;
  }

  const pathnameSegments = request.nextUrl.pathname
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);

  for (let index = pathnameSegments.length - 1; index >= 0; index -= 1) {
    const segment = pathnameSegments[index];
    if (isUuidLike(segment)) {
      return segment;
    }
  }

  return null;
}
