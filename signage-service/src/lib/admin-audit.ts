import type { NextRequest } from 'next/server';
import type { AdminRole, Prisma, PrismaClient } from '@prisma/client';

import { hashAdminToken, verifyAdminSession } from '@/lib/admin-auth';

export type AdminRequestActor = {
  role: AdminRole;
  sessionId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
};

type AuditClient = PrismaClient | Prisma.TransactionClient;

type CreateAdminAuditLogInput = {
  actorSessionId?: string | null;
  actorRole?: AdminRole | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  caseId?: string | null;
  outcome?: string;
  reason?: string | null;
  details?: Prisma.InputJsonValue;
  ipAddress?: string | null;
  userAgent?: string | null;
};

function getRequestIpAddress(request: NextRequest): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();

  return forwardedFor || realIp || null;
}

function getRequestUserAgent(request: NextRequest): string | null {
  return request.headers.get('user-agent')?.trim() || null;
}

export async function requireAdminActor(
  prisma: PrismaClient,
  request: NextRequest,
  cookieName: string,
  allowedRoles: AdminRole[]
): Promise<AdminRequestActor | null> {
  const token = request.cookies.get(cookieName)?.value;
  const role = await verifyAdminSession(prisma, token);

  if (!role || !allowedRoles.includes(role)) {
    return null;
  }

  let sessionId: string | null = null;

  if (token) {
    const tokenHash = hashAdminToken(token);
    const session = await prisma.adminSession.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        expiresAt: true,
        role: true,
      },
    });

    if (session && session.expiresAt > new Date() && session.role === role) {
      sessionId = session.id;
    }
  }

  return {
    role,
    sessionId,
    ipAddress: getRequestIpAddress(request),
    userAgent: getRequestUserAgent(request),
  };
}

export async function createAdminAuditLog(
  client: AuditClient,
  input: CreateAdminAuditLogInput
): Promise<void> {
  const reason = input.reason?.trim() || null;

  await client.adminAuditLog.create({
    data: {
      actorSessionId: input.actorSessionId ?? null,
      actorRole: input.actorRole ?? null,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId ?? null,
      caseId: input.caseId ?? null,
      outcome: input.outcome ?? 'SUCCESS',
      reason,
      details: input.details,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    },
  });
}
