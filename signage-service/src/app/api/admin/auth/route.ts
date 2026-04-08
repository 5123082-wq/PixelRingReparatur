import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIP, ADMIN_AUTH_LIMIT } from '@/lib/rate-limit';
import {
  validateAdminMasterKey,
  createAdminSession,
  revokeAdminSession,
  CRM_SESSION_COOKIE_NAME,
} from '@/lib/admin-auth';
import { validateAdminCsrf } from '@/lib/admin-csrf';

export async function POST(request: NextRequest) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const ip = getClientIP(request);
  const limit = checkRateLimit(ip, ADMIN_AUTH_LIMIT);

  if (!limit.allowed) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const body = (await request.json().catch(() => null)) as {
      masterKey?: string;
    } | null;

    if (!body?.masterKey) {
      return NextResponse.json({ error: 'Key required' }, { status: 404 });
    }

    if (!validateAdminMasterKey(body.masterKey, 'MANAGER')) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const sessionToken = await createAdminSession(prisma, {
      role: 'MANAGER',
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    });

    const ttlHours = Number(process.env.ADMIN_SESSION_TTL_HOURS) || 12;

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
      maxAge: ttlHours * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('CRM auth error:', error);
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function DELETE(request: NextRequest) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  try {
    const token = request.cookies.get(CRM_SESSION_COOKIE_NAME)?.value;
    if (token) await revokeAdminSession(prisma, token);

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
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
