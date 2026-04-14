import { NextRequest, NextResponse } from 'next/server';
import { CaseOriginChannel, CaseStatus, MessageAuthorRole, Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import {
  CRM_SESSION_COOKIE_NAME,
} from '@/lib/admin-auth';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import { createAdminAuditLog, requireAdminActor } from '@/lib/admin-audit';
import {
  canTransitionCaseStatus,
  normalizeTransitionReason,
  requiresTransitionReason,
} from '@/lib/case-status-machine';
import { syncCaseCustomerProfile } from '@/lib/customer-profiles';

const VALID_STATUSES = Object.values(CaseStatus);
const MAX_OPERATOR_MESSAGE_LENGTH = 4000;
const MAX_INTERNAL_NOTE_LENGTH = 2000;

function isUuidLike(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i.test(
    value
  );
}

function notFoundResponse() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

async function requireAdmin(request: NextRequest) {
  return requireAdminActor(
    prisma,
    request,
    CRM_SESSION_COOKIE_NAME,
    ['MANAGER']
  );
}

type RouteParams = {
  params: Promise<{ id: string }>;
};

function resolveCaseDetailReadError(error: unknown): {
  status: number;
  message: string;
  details?: string;
} {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2021' || error.code === 'P2022') {
      return {
        status: 503,
        message:
          'CRM detail is unavailable because database schema is outdated. Run npm run db:deploy, then restart the dev server.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      };
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      status: 503,
      message:
        'CRM detail is unavailable because Prisma Client is out of sync. Run npm run db:generate and restart the dev server.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    };
  }

  return {
    status: 500,
    message: 'Internal error',
    details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined,
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const actor = await requireAdmin(request);

  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
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
        publicRequestNumber: true,
        status: true,
        originChannel: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        assignedOperator: true,
        customerProfile: {
          select: {
            id: true,
            displayName: true,
            email: true,
            phone: true,
            preferredLanguage: true,
            preferredContactMethod: true,
            _count: {
              select: { cases: true },
            },
          },
        },
        primaryContactMethod: true,
        primaryContactValue: true,
        summary: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        statusUpdatedAt: true,
        numberIssuedAt: true,
        formalizedAt: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            channel: true,
            authorRole: true,
            authorName: true,
            body: true,
            isCustomerVisible: true,
            sentAt: true,
            createdAt: true,
          },
        },
        attachments: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            kind: true,
            originalFilename: true,
            mimeType: true,
            byteSize: true,
            storageProvider: true,
            createdAt: true,
          },
        },
        sessions: {
          orderBy: { lastSeenAt: 'desc' },
          select: {
            id: true,
            operatorTakeover: true,
            lastSeenAt: true,
            createdAt: true,
          },
        },
        statusEvents: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            actorRole: true,
            fromStatus: true,
            toStatus: true,
            reason: true,
            createdAt: true,
          },
          take: 50,
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            action: true,
            outcome: true,
            reason: true,
            createdAt: true,
          },
          where: {
            action: {
              in: [
                'CASE_STATUS_CHANGED',
                'CASE_OPERATOR_MESSAGE_SENT',
                'CASE_OPERATOR_TAKEOVER_CHANGED',
                'CASE_INTERNAL_NOTE_CREATED',
                'CASE_ASSIGNMENT_CHANGED',
                'CASE_CUSTOMER_PROFILE_SYNCED',
              ],
            },
          },
          take: 50,
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    if (!caseRecord) {
      return notFoundResponse();
    }

    const relatedCases =
      caseRecord.customerProfile?.id
        ? await prisma.case.findMany({
            where: {
              customerProfileId: caseRecord.customerProfile.id,
              id: { not: caseRecord.id },
            },
            select: {
              id: true,
              publicRequestNumber: true,
              status: true,
              updatedAt: true,
              summary: true,
            },
            orderBy: { updatedAt: 'desc' },
            take: 10,
          })
        : [];

    return NextResponse.json({ case: caseRecord, relatedCases });
  } catch (error) {
    console.error('Admin case detail error:', error);

    const resolvedError = resolveCaseDetailReadError(error);

    return NextResponse.json(
      {
        error: resolvedError.message,
        ...(resolvedError.details ? { details: resolvedError.details } : {}),
      },
      { status: resolvedError.status }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requireAdmin(request);

  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { id } = await params;

  if (!isUuidLike(id)) {
    return notFoundResponse();
  }

  try {
    const body = (await request.json().catch(() => null)) as
      | {
          message?: string;
          internalNote?: string;
          operatorTakeover?: boolean;
        }
      | null;
    const message = body?.message?.trim() ?? '';
    const internalNote = body?.internalNote?.trim() ?? '';
    const hasMessage = message.length > 0;
    const hasInternalNote = internalNote.length > 0;
    const hasTakeoverUpdate = typeof body?.operatorTakeover === 'boolean';

    if (!hasMessage && !hasInternalNote && !hasTakeoverUpdate) {
      return NextResponse.json(
        { error: 'Message, internalNote, or operatorTakeover is required' },
        { status: 400 }
      );
    }

    if (message.length > MAX_OPERATOR_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: 'Message is too long' },
        { status: 400 }
      );
    }

    if (internalNote.length > MAX_INTERNAL_NOTE_LENGTH) {
      return NextResponse.json(
        { error: 'Internal note is too long' },
        { status: 400 }
      );
    }

    const [caseRecord, activeSessionCount, takeoverEnabledCount] = await Promise.all([
      prisma.case.findUnique({
        where: { id },
        select: { id: true },
      }),
      prisma.session.count({
        where: {
          caseId: id,
          revokedAt: null,
        },
      }),
      prisma.session.count({
        where: {
          caseId: id,
          revokedAt: null,
          operatorTakeover: true,
        },
      }),
    ]);

    if (!caseRecord) {
      return notFoundResponse();
    }

    const now = new Date();
    const currentOperatorTakeover = takeoverEnabledCount > 0;
    const nextOperatorTakeover = hasMessage
      ? true
      : hasTakeoverUpdate
        ? body?.operatorTakeover ?? currentOperatorTakeover
        : currentOperatorTakeover;
    const takeoverChanged =
      activeSessionCount > 0 && currentOperatorTakeover !== nextOperatorTakeover;

    await prisma.$transaction(async (tx) => {
      if (hasMessage) {
        await tx.message.create({
          data: {
            caseId: id,
            channel: CaseOriginChannel.CRM,
            authorRole: MessageAuthorRole.OPERATOR,
            authorName: 'CRM Operator',
            body: message,
            isCustomerVisible: true,
            sentAt: now,
          },
        });

        await createAdminAuditLog(tx, {
          actorSessionId: actor.sessionId,
          actorAdminUserId: actor.adminUserId,
          actorRole: actor.role,
          action: 'CASE_OPERATOR_MESSAGE_SENT',
          resourceType: 'CASE',
          resourceId: id,
          caseId: id,
          details: {
            messageLength: message.length,
          },
          ipAddress: actor.ipAddress,
          userAgent: actor.userAgent,
        });
      }

      if (hasInternalNote) {
        await tx.message.create({
          data: {
            caseId: id,
            channel: CaseOriginChannel.CRM,
            authorRole: MessageAuthorRole.OPERATOR,
            authorName: 'Internal Note',
            body: internalNote,
            isCustomerVisible: false,
            sentAt: now,
          },
        });

        await createAdminAuditLog(tx, {
          actorSessionId: actor.sessionId,
          actorAdminUserId: actor.adminUserId,
          actorRole: actor.role,
          action: 'CASE_INTERNAL_NOTE_CREATED',
          resourceType: 'CASE',
          resourceId: id,
          caseId: id,
          details: {
            noteLength: internalNote.length,
          },
          ipAddress: actor.ipAddress,
          userAgent: actor.userAgent,
        });
      }

      if (takeoverChanged) {
        await tx.session.updateMany({
          where: {
            caseId: id,
            revokedAt: null,
          },
          data: {
            operatorTakeover: nextOperatorTakeover,
          },
        });

        await createAdminAuditLog(tx, {
          actorSessionId: actor.sessionId,
          actorAdminUserId: actor.adminUserId,
          actorRole: actor.role,
          action: 'CASE_OPERATOR_TAKEOVER_CHANGED',
          resourceType: 'CASE',
          resourceId: id,
          caseId: id,
          reason: hasMessage
            ? 'Operator message sent'
            : hasTakeoverUpdate
              ? 'Manual takeover toggle'
              : null,
          details: {
            from: currentOperatorTakeover,
            to: nextOperatorTakeover,
            via: hasMessage ? 'message' : 'toggle',
          },
          ipAddress: actor.ipAddress,
          userAgent: actor.userAgent,
        });
      }
    });

    return NextResponse.json({
      success: true,
      operatorTakeover: nextOperatorTakeover,
    });
  } catch (error) {
    console.error('Admin case message error:', error);

    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requireAdmin(request);

  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { id } = await params;

  if (!isUuidLike(id)) {
    return notFoundResponse();
  }

  try {
    const body = (await request.json()) as {
      status?: string;
      statusReason?: string;
      assignedOperator?: string;
      summary?: string;
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
    };

    const hasPatchFields = [
      body?.status,
      body?.assignedOperator,
      body?.summary,
      body?.customerName,
      body?.customerEmail,
      body?.customerPhone,
    ].some((value) => value !== undefined);

    if (!hasPatchFields) {
      return NextResponse.json(
        { error: 'At least one updatable field is required' },
        { status: 400 }
      );
    }

    const currentCase = await prisma.case.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        assignedOperator: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        primaryContactMethod: true,
        locale: true,
      },
    });

    if (!currentCase) {
      return notFoundResponse();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      updatedAt: new Date(),
    };

    let statusChanged = false;
    let nextStatus: CaseStatus | null = null;
    let transitionReason: string | null = null;

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status as CaseStatus)) {
        return NextResponse.json(
          { error: 'Invalid case status' },
          { status: 400 }
        );
      }

      nextStatus = body.status as CaseStatus;
      statusChanged = nextStatus !== currentCase.status;

      if (statusChanged && !canTransitionCaseStatus(currentCase.status, nextStatus)) {
        return NextResponse.json(
          {
            error: `Invalid status transition: ${currentCase.status} -> ${nextStatus}`,
          },
          { status: 400 }
        );
      }

      if (statusChanged) {
        transitionReason = normalizeTransitionReason(body.statusReason);

        if (requiresTransitionReason(nextStatus) && !transitionReason) {
          return NextResponse.json(
            { error: 'Reason is required for this status transition' },
            { status: 400 }
          );
        }

        if (body.statusReason !== undefined && transitionReason === null) {
          return NextResponse.json(
            { error: 'Invalid status reason' },
            { status: 400 }
          );
        }

        updateData.status = nextStatus;
        updateData.statusUpdatedAt = new Date();
      }
    }

    if (body.summary !== undefined) {
      updateData.summary = body.summary.trim() || null;
    }

    if (body.assignedOperator !== undefined) {
      updateData.assignedOperator = body.assignedOperator.trim() || null;
    }

    if (body.customerName !== undefined) {
      updateData.customerName = body.customerName.trim() || null;
    }

    if (body.customerEmail !== undefined) {
      updateData.customerEmail = body.customerEmail.trim().toLowerCase() || null;
    }

    if (body.customerPhone !== undefined) {
      updateData.customerPhone = body.customerPhone.trim() || null;
    }

    if (body.customerEmail !== undefined || body.customerPhone !== undefined) {
      const nextEmail =
        body.customerEmail !== undefined
          ? body.customerEmail.trim().toLowerCase() || null
          : currentCase.customerEmail;
      const nextPhone =
        body.customerPhone !== undefined
          ? body.customerPhone.trim() || null
          : currentCase.customerPhone;

      updateData.primaryContactMethod = nextEmail ? 'EMAIL' : nextPhone ? 'PHONE' : null;
      updateData.primaryContactValue = nextEmail || nextPhone || null;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const caseRecord = await tx.case.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          publicRequestNumber: true,
          status: true,
          statusUpdatedAt: true,
          updatedAt: true,
        },
      });

      if (statusChanged && nextStatus) {
        await tx.caseStatusEvent.create({
          data: {
            caseId: id,
            actorSessionId: actor.sessionId,
            actorRole: actor.role,
            fromStatus: currentCase.status,
            toStatus: nextStatus,
            reason: transitionReason,
          },
        });

        await createAdminAuditLog(tx, {
          actorSessionId: actor.sessionId,
          actorAdminUserId: actor.adminUserId,
          actorRole: actor.role,
          action: 'CASE_STATUS_CHANGED',
          resourceType: 'CASE',
          resourceId: id,
          caseId: id,
          reason: transitionReason,
          details: {
            fromStatus: currentCase.status,
            toStatus: nextStatus,
          },
          ipAddress: actor.ipAddress,
          userAgent: actor.userAgent,
        });
      }

      const nextAssignedOperator =
        updateData.assignedOperator !== undefined
          ? (updateData.assignedOperator as string | null)
          : currentCase.assignedOperator;

      if (nextAssignedOperator !== currentCase.assignedOperator) {
        await createAdminAuditLog(tx, {
          actorSessionId: actor.sessionId,
          actorAdminUserId: actor.adminUserId,
          actorRole: actor.role,
          action: 'CASE_ASSIGNMENT_CHANGED',
          resourceType: 'CASE',
          resourceId: id,
          caseId: id,
          details: {
            from: currentCase.assignedOperator,
            to: nextAssignedOperator,
          },
          ipAddress: actor.ipAddress,
          userAgent: actor.userAgent,
        });
      }

      const nextCustomerName =
        updateData.customerName !== undefined
          ? (updateData.customerName as string | null)
          : currentCase.customerName;
      const nextCustomerEmail =
        updateData.customerEmail !== undefined
          ? (updateData.customerEmail as string | null)
          : currentCase.customerEmail;
      const nextCustomerPhone =
        updateData.customerPhone !== undefined
          ? (updateData.customerPhone as string | null)
          : currentCase.customerPhone;
      const nextPreferredContactMethod =
        updateData.primaryContactMethod !== undefined
          ? (updateData.primaryContactMethod as typeof currentCase.primaryContactMethod)
          : currentCase.primaryContactMethod;

      const customerProfileId = await syncCaseCustomerProfile(tx, {
        caseId: id,
        customerName: nextCustomerName,
        customerEmail: nextCustomerEmail,
        customerPhone: nextCustomerPhone,
        preferredLanguage: currentCase.locale || null,
        preferredContactMethod: nextPreferredContactMethod,
      });

      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId,
        actorAdminUserId: actor.adminUserId,
        actorRole: actor.role,
        action: 'CASE_CUSTOMER_PROFILE_SYNCED',
        resourceType: 'CASE',
        resourceId: id,
        caseId: id,
        details: {
          customerProfileId,
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      });

      return caseRecord;
    });

    return NextResponse.json({ success: true, case: updated });
  } catch (error) {
    console.error('Admin case update error:', error);

    return NextResponse.json(
      { error: 'Failed to update case' },
      { status: 500 }
    );
  }
}
