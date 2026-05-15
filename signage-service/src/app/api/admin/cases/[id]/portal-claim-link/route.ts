import { NextRequest, NextResponse } from 'next/server';

import { CRM_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { createAdminAuditLog, requireAdminPermissionActor } from '@/lib/admin-audit';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import { prisma } from '@/lib/prisma';
import {
  buildPortalClaimMessage,
  createPortalClaimLink,
} from '@/lib/portal/claim';

function isUuidLike(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function notFoundResponse() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requireAdminPermissionActor(
    prisma,
    request,
    CRM_SESSION_COOKIE_NAME,
    ['CRM_CASE_UPDATE']
  );

  if (!actor) {
    return notFoundResponse();
  }

  const { id } = await params;

  if (!isUuidLike(id)) {
    return notFoundResponse();
  }

  try {
    const caseRecord = await prisma.case.findUnique({
      where: { id },
      select: {
        id: true,
        assignedOperator: true,
        publicRequestNumber: true,
        locale: true,
      },
    });

    if (!caseRecord?.publicRequestNumber) {
      return NextResponse.json(
        { error: 'Public request number is required before creating a portal link.' },
        { status: 400 }
      );
    }

    if (
      actor.role === 'MANAGER' &&
      caseRecord.assignedOperator !== null &&
      caseRecord.assignedOperator !== actor.adminUserId &&
      caseRecord.assignedOperator !== actor.email &&
      caseRecord.assignedOperator !== actor.displayName
    ) {
      return notFoundResponse();
    }

    const result = await prisma.$transaction(async (tx) => {
      const portalClaim = await createPortalClaimLink(tx, {
        caseId: id,
        locale: caseRecord.locale,
        origin: request.nextUrl.origin,
        createdByAdminSessionId: actor.sessionId,
      });

      await tx.message.create({
        data: {
          caseId: id,
          channel: 'CRM',
          authorRole: 'SYSTEM',
          authorName: 'Portal Access',
          body: buildPortalClaimMessage({
            publicRequestNumber: portalClaim.publicRequestNumber,
            claimUrl: portalClaim.url,
            expiresAt: portalClaim.expiresAt,
          }),
          isCustomerVisible: true,
          sentAt: new Date(),
        },
      });

      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId,
        actorAdminUserId: actor.adminUserId,
        actorRole: actor.role,
        action: 'CASE_PORTAL_CLAIM_LINK_CREATED',
        resourceType: 'CASE',
        resourceId: id,
        caseId: id,
        details: {
          expiresAt: portalClaim.expiresAt.toISOString(),
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      });

      return portalClaim;
    });

    return NextResponse.json({
      success: true,
      portalClaimUrl: result.url,
      portalClaimExpiresAt: result.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Admin portal claim link creation failed:', error);

    return NextResponse.json(
      { error: 'Failed to create portal link' },
      { status: 500 }
    );
  }
}
