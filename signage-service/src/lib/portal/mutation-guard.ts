import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { isAllowedPortalMutationRequest } from './mutation-origin';

export function validatePortalMutationRequest(request: NextRequest): NextResponse | null {
  if (isAllowedPortalMutationRequest(request)) {
    return null;
  }

  return NextResponse.json(
    { success: false, message: 'Die Anfrage konnte nicht verifiziert werden.' },
    { status: 403 }
  );
}
