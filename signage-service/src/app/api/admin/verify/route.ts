import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import {
  verifyAdminSession,
  CRM_SESSION_COOKIE_NAME,
} from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(CRM_SESSION_COOKIE_NAME)?.value;
    const role = await verifyAdminSession(prisma, token);

    if (role !== 'MANAGER') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
