import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import {
  getPortalSessionContext,
  PORTAL_SESSION_COOKIE_NAME,
} from '@/lib/portal/auth';
import { validatePortalMutationRequest } from '@/lib/portal/mutation-guard';
import { updatePortalRequestDetailsForUser } from '@/lib/portal/requests';
import { publishCaseRealtimeEvent } from '@/lib/realtime';
import {
  checkRateLimit,
  getClientIP,
  PORTAL_REQUEST_UPDATE_LIMIT,
} from '@/lib/rate-limit';

type RouteParams = {
  params: Promise<{ publicRequestNumber: string }>;
};

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const mutationError = validatePortalMutationRequest(request);

  if (mutationError) {
    return mutationError;
  }

  const ip = getClientIP(request);
  const limit = checkRateLimit(ip, PORTAL_REQUEST_UPDATE_LIMIT);

  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, message: 'Bitte versuchen Sie es spaeter erneut.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.resetMs / 1000)) } }
    );
  }

  const session = await getPortalSessionContext(
    prisma,
    request.cookies.get(PORTAL_SESSION_COOKIE_NAME)?.value
  );

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Bitte melden Sie sich zuerst im Kundenportal an.' },
      { status: 401 }
    );
  }

  const { publicRequestNumber } = await params;

  try {
    const body = (await request.json().catch(() => null)) as {
      customerName?: unknown;
      customerEmail?: unknown;
      customerPhone?: unknown;
      serviceLocation?: unknown;
    } | null;

    const result = await updatePortalRequestDetailsForUser(prisma, {
      portalUserId: session.portalUserId,
      portalSessionId: session.sessionId,
      publicRequestNumber,
      details: body ?? {},
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ip,
      userAgent: request.headers.get('user-agent'),
    });

    if (!result.ok) {
      const message = result.reason === 'invalid_input'
        ? result.message || 'Die Eingaben sind ungueltig.'
        : result.reason === 'no_fields'
          ? 'Bitte senden Sie mindestens ein bearbeitbares Feld.'
          : 'Die Anfrage ist nicht verfuegbar.';

      return NextResponse.json(
        { success: false, message },
        { status: result.reason === 'not_found' ? 404 : 400 }
      );
    }

    if (result.changed) {
      await publishCaseRealtimeEvent({
        caseId: result.caseId,
        reason: 'case.updated',
      }).catch((error) => {
        console.error('Portal request detail realtime publish failed:', error);
      });
    }

    return NextResponse.json({
      success: true,
      changed: result.changed,
      publicRequestNumber: result.publicRequestNumber,
      notificationBody: result.notificationBody,
    });
  } catch (error) {
    console.error('Portal request detail update failed:', error);

    return NextResponse.json(
      { success: false, message: 'Die Anfrage konnte nicht aktualisiert werden.' },
      { status: 500 }
    );
  }
}
