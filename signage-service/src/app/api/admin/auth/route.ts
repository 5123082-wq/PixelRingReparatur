import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIP, ADMIN_AUTH_LIMIT } from '@/lib/rate-limit';
import {
  authenticateAdminLogin,
  createAdminSession,
  CRM_SESSION_COOKIE_NAME,
  getAdminSessionTtlSeconds,
  markAdminLoginSuccess,
  parseAdminLoginInput,
  revokeAdminSession,
  verifyAdminSession,
} from '@/lib/admin-auth';
import { createAdminAuditLog } from '@/lib/admin-audit';
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
        actorRole: 'MANAGER',
        action: 'ADMIN_LOGIN_FAILED',
        resourceType: 'ADMIN_AUTH',
        outcome: 'DENIED',
        details: {
          zone: 'CRM',
          reason: 'INVALID_PAYLOAD',
        },
        ipAddress,
        userAgent,
      });

      return notFoundResponse();
    }

    const authResult = await authenticateAdminLogin(prisma, 'MANAGER', loginInput);

    if (!authResult) {
      await createAdminAuditLog(prisma, {
        actorRole: 'MANAGER',
        action: 'ADMIN_LOGIN_FAILED',
        resourceType: 'ADMIN_AUTH',
        outcome: 'DENIED',
        details: {
          zone: 'CRM',
          method: loginInput.mode,
          email: loginInput.mode === 'password' ? loginInput.email : null,
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
        label: authResult.method === 'master-key' ? 'CRM Bootstrap Fallback' : 'CRM Password Login',
      });

      await createAdminAuditLog(tx, {
        actorAdminUserId: authResult.user.id,
        actorRole: authResult.user.role,
        action: 'ADMIN_LOGIN_SUCCEEDED',
        resourceType: 'ADMIN_AUTH',
        resourceId: authResult.user.id,
        details: {
          zone: 'CRM',
          method: authResult.method,
          email: authResult.user.email,
        },
        ipAddress,
        userAgent,
      });

      return token;
    });

    const response = NextResponse.json({
      success: true,
      redirectTo: '/ring-manager-crm/dashboard',
    });

    response.cookies.set({
      name: CRM_SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: getAdminSessionTtlSeconds(),
    });

    return response;
  } catch (error) {
    console.error('CRM auth error:', error);
    return notFoundResponse();
  }
}

export async function DELETE(request: NextRequest) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  try {
    const token = request.cookies.get(CRM_SESSION_COOKIE_NAME)?.value;
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
          zone: 'CRM',
          email: actor.email,
        },
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
        userAgent: request.headers.get('user-agent'),
      });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: CRM_SESSION_COOKIE_NAME,
      value: '',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('CRM logout error:', error);
    return notFoundResponse();
  }
}
