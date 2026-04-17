import { authenticateAdminLogin, CMS_SESSION_COOKIE_NAME, createAdminSession, getAdminSessionTtlSeconds, markAdminLoginSuccess, parseAdminLoginInput, revokeAdminSession, verifyAdminSession } from '@/lib/admin-auth';
import { createAdminAuditLog } from '@/lib/admin-audit';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIP, ADMIN_AUTH_LIMIT } from '@/lib/rate-limit';
import { validateAdminCsrf } from '@/lib/admin-csrf';

function getRequestIpAddress(request: NextRequest): string | null {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
}

function notFoundResponse() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(request: NextRequest) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const ip = getClientIP(request);
  const limit = checkRateLimit(ip, ADMIN_AUTH_LIMIT);

  if (!limit.allowed) {
    return notFoundResponse();
  }

  const userAgent = request.headers.get('user-agent');
  const ipAddress = getRequestIpAddress(request);

  try {
    const body = await request.json().catch(() => null);
    const loginInput = parseAdminLoginInput(body);

    if (!loginInput) {
      await createAdminAuditLog(prisma, {
        actorRole: 'OWNER',
        action: 'ADMIN_LOGIN_FAILED',
        resourceType: 'ADMIN_AUTH',
        outcome: 'DENIED',
        details: {
          zone: 'CMS',
          reason: 'INVALID_PAYLOAD',
        },
        ipAddress,
        userAgent,
      });

      return notFoundResponse();
    }

    const authResult = await authenticateAdminLogin(prisma, 'OWNER', loginInput);

    if (!authResult) {
      await createAdminAuditLog(prisma, {
        actorRole: 'OWNER',
        action: 'ADMIN_LOGIN_FAILED',
        resourceType: 'ADMIN_AUTH',
        outcome: 'DENIED',
        details: {
          zone: 'CMS',
          email: loginInput.email,
        },
        ipAddress,
        userAgent,
      });

      return notFoundResponse();
    }

    const sessionToken = await prisma.$transaction(async (tx) => {
      await markAdminLoginSuccess(tx, authResult.user.id);

      const token = await createAdminSession(tx, {
        adminUserId: authResult.user.id,
        role: authResult.user.role,
        userAgent,
        ipAddress,
        label: 'CMS Password Login',
      });

      await createAdminAuditLog(tx, {
        actorAdminUserId: authResult.user.id,
        actorRole: authResult.user.role,
        action: 'ADMIN_LOGIN_SUCCEEDED',
        resourceType: 'ADMIN_AUTH',
        resourceId: authResult.user.id,
        details: {
          zone: 'CMS',
          email: authResult.user.email,
        },
        ipAddress,
        userAgent,
      });

      return token;
    });

    const response = NextResponse.json({
      success: true,
      redirectTo: '/ring-master-config/dashboard',
    });

    response.cookies.set({
      name: CMS_SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: getAdminSessionTtlSeconds(),
    });

    return response;
  } catch (error) {
    console.error('CMS auth error:', error);
    return notFoundResponse();
  }
}

export async function DELETE(request: NextRequest) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  try {
    const token = request.cookies.get(CMS_SESSION_COOKIE_NAME)?.value;
    const actor = await verifyAdminSession(prisma, token);

    if (token) {
      await revokeAdminSession(prisma, token);
    }

    if (actor) {
      await createAdminAuditLog(prisma, {
        actorSessionId: actor.sessionId,
        actorAdminUserId: actor.adminUserId,
        actorRole: actor.role,
        action: 'ADMIN_LOGOUT',
        resourceType: 'ADMIN_AUTH',
        resourceId: actor.adminUserId,
        details: {
          zone: 'CMS',
          email: actor.email,
        },
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
        userAgent: request.headers.get('user-agent'),
      });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: CMS_SESSION_COOKIE_NAME,
      value: '',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('CMS logout error:', error);
    return notFoundResponse();
  }
}
