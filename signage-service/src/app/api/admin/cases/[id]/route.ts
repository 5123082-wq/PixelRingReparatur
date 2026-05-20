import { CRM_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { createAdminAuditLog, requireAdminPermissionActor } from '@/lib/admin-audit';
import { NextRequest, NextResponse } from 'next/server';
import { CaseOriginChannel, CaseStatus, MessageAuthorRole } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import type { AdminPermission } from '@/lib/admin-permissions';
import {
  canTransitionCaseStatus,
  normalizeTransitionReason,
  requiresTransitionReason,
} from '@/lib/case-status-machine';
import { syncCaseCustomerProfile } from '@/lib/customer-profiles';
import {
  publishCaseRealtimeEvent,
  type CaseRealtimeReason,
} from '@/lib/realtime';
import { ensurePublicRequestNumberForCase } from '@/lib/request-number';
import { createCaseStatusAccessLink } from '@/lib/status-access-link';
import { sendTelegramMessage } from '@/lib/telegram';

const VALID_STATUSES = Object.values(CaseStatus);
const MAX_OPERATOR_MESSAGE_LENGTH = 4000;
const MAX_INTERNAL_NOTE_LENGTH = 2000;

function escapeTelegramHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildPrIssuedTelegramMessage(publicRequestNumber: string, statusUrl?: string | null): string {
  return [
    'Ihre Anfrage wurde registriert.',
    `Nummer: ${publicRequestNumber}`,
    statusUrl ? `Status: ${statusUrl}` : '',
    '',
    'Bitte bewahren Sie diese Nummer auf. Sie hilft uns, die Anfrage eindeutig zuzuordnen.',
  ].filter((line, index, lines) => line !== '' || lines[index - 1] !== '').join('\n');
}

function buildPrIssuedTelegramHtmlMessage(input: {
  publicRequestNumber: string;
  statusUrl: string;
}): string {
  const requestNumber = escapeTelegramHtml(input.publicRequestNumber);
  const statusUrl = escapeTelegramHtml(input.statusUrl);

  return [
    'Ihre Anfrage wurde registriert.',
    `Nummer: <a href="${statusUrl}">${requestNumber}</a>`,
    '',
    'Tippen Sie auf die Nummer, um den Status zu verfolgen.',
    'Bitte bewahren Sie diese Nummer auf. Sie hilft uns, die Anfrage eindeutig zuzuordnen.',
  ].join('\n');
}

function isUuidLike(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function notFoundResponse() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

async function requireCaseReadActor(request: NextRequest) {
  return requireAdminPermissionActor(
    prisma,
    request,
    CRM_SESSION_COOKIE_NAME,
    ['CRM_CASE_READ']
  );
}

async function requireCaseUpdateActor(request: NextRequest) {
  return requireAdminPermissionActor(
    prisma,
    request,
    CRM_SESSION_COOKIE_NAME,
    ['CRM_CASE_UPDATE']
  );
}

async function requireCaseConversationActor(
  request: NextRequest,
  requiredPermissions: readonly AdminPermission[]
) {
  return requireAdminPermissionActor(
    prisma,
    request,
    CRM_SESSION_COOKIE_NAME,
    requiredPermissions
  );
}

type RouteParams = {
  params: Promise<{ id: string }>;
};

function resolveCaseDetailReadError(): {
  status: number;
  message: string;
} {
  return {
    status: 500,
    message: 'Internal error',
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const actor = await requireCaseReadActor(request);

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
        aiEnabled: true,
        aiPausedAt: true,
        aiPausedReason: true,
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
        serviceLocation: true,
        serviceLatitude: true,
        serviceLongitude: true,
        serviceLocationSource: true,
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
        externalConversations: {
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            channel: true,
            externalChatId: true,
            username: true,
            firstName: true,
            lastName: true,
            lastMessageAt: true,
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
                'CASE_AI_CONTROL_CHANGED',
                'CASE_INTERNAL_NOTE_CREATED',
                'CASE_ASSIGNMENT_CHANGED',
                'CASE_CUSTOMER_PROFILE_SYNCED',
                'CASE_PORTAL_CLAIM_LINK_CREATED',
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

    if (
      actor.role === 'MANAGER' &&
      caseRecord.assignedOperator !== null &&
      caseRecord.assignedOperator !== actor.adminUserId &&
      caseRecord.assignedOperator !== actor.email &&
      caseRecord.assignedOperator !== actor.displayName
    ) {
      return notFoundResponse();
    }

    const relatedCases =
      caseRecord.customerProfile?.id
        ? await prisma.case.findMany({
            where: {
              customerProfileId: caseRecord.customerProfile.id,
              id: { not: caseRecord.id },
              ...(actor.role === 'MANAGER'
                ? {
                    AND: [
                      {
                        OR: [
                          { assignedOperator: null },
                          { assignedOperator: actor.adminUserId },
                          { assignedOperator: actor.email },
                          ...(actor.displayName ? [{ assignedOperator: actor.displayName }] : []),
                        ],
                      },
                    ],
                  }
                : {}),
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

    const resolvedError = resolveCaseDetailReadError();

    return NextResponse.json(
      {
        error: resolvedError.message,
      },
      { status: resolvedError.status }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

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
          aiEnabled?: boolean;
          issuePublicRequestNumber?: boolean;
        }
      | null;
    const message = body?.message?.trim() ?? '';
    const internalNote = body?.internalNote?.trim() ?? '';
    const hasMessage = message.length > 0;
    const hasInternalNote = internalNote.length > 0;
    const hasTakeoverUpdate = typeof body?.operatorTakeover === 'boolean';
    const hasAiEnabledUpdate = typeof body?.aiEnabled === 'boolean';
    const hasPublicRequestNumberIssue = body?.issuePublicRequestNumber === true;

    if (!hasMessage && !hasInternalNote && !hasTakeoverUpdate && !hasAiEnabledUpdate && !hasPublicRequestNumberIssue) {
      return NextResponse.json(
        { error: 'Message, internalNote, operatorTakeover, aiEnabled, or issuePublicRequestNumber is required' },
        { status: 400 }
      );
    }

    const requiredPermissions: AdminPermission[] = [];

    if (hasMessage || hasInternalNote) {
      requiredPermissions.push('CRM_CASE_MESSAGE_WRITE');
    }

    if ((hasTakeoverUpdate || hasAiEnabledUpdate) && !hasMessage) {
      requiredPermissions.push('CRM_CASE_TAKEOVER_WRITE');
    }

    if (hasPublicRequestNumberIssue) {
      requiredPermissions.push('CRM_CASE_UPDATE');
    }

    const actor = await requireCaseConversationActor(request, requiredPermissions);

    if (!actor) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
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
        select: {
          id: true,
          assignedOperator: true,
          publicRequestNumber: true,
          status: true,
          aiEnabled: true,
          locale: true,
          externalConversations: {
            where: { channel: CaseOriginChannel.TELEGRAM },
            select: {
              externalChatId: true,
            },
            take: 1,
          },
        },
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

    if (hasPublicRequestNumberIssue && caseRecord.publicRequestNumber) {
      return NextResponse.json(
        { error: 'Public request number already exists for this case' },
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

    const now = new Date();
    const currentOperatorTakeover = takeoverEnabledCount > 0;
    const nextOperatorTakeover = hasMessage
      ? true
      : hasTakeoverUpdate
        ? body?.operatorTakeover ?? currentOperatorTakeover
        : currentOperatorTakeover;
    const takeoverChanged =
      activeSessionCount > 0 && currentOperatorTakeover !== nextOperatorTakeover;
    const nextCaseAiEnabled =
      hasMessage
        ? false
        : hasAiEnabledUpdate
          ? body?.aiEnabled ?? caseRecord.aiEnabled
          : caseRecord.aiEnabled;
    const caseAiChanged = caseRecord.aiEnabled !== nextCaseAiEnabled;
    let telegramReplyChatId: string | null = null;
    let telegramPrChatId: string | null = null;
    let issuedPublicRequestNumber: string | null = null;
    let issuedPublicRequestStatusUrl: string | null = null;
    const realtimeReasons = new Set<CaseRealtimeReason>();

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

        telegramReplyChatId =
          caseRecord.externalConversations[0]?.externalChatId ?? null;
        realtimeReasons.add('message.created');
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
        realtimeReasons.add('internal_note.created');
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
        realtimeReasons.add('takeover.changed');
      }

      if (caseAiChanged) {
        const aiPausedReason = nextCaseAiEnabled
          ? null
          : hasMessage
            ? 'operator_message'
            : 'manual_toggle';

        await tx.case.update({
          where: { id },
          data: {
            aiEnabled: nextCaseAiEnabled,
            aiPausedAt: nextCaseAiEnabled ? null : now,
            aiPausedReason,
          },
        });

        await createAdminAuditLog(tx, {
          actorSessionId: actor.sessionId,
          actorAdminUserId: actor.adminUserId,
          actorRole: actor.role,
          action: 'CASE_AI_CONTROL_CHANGED',
          resourceType: 'CASE',
          resourceId: id,
          caseId: id,
          reason: hasMessage
            ? 'Operator message sent'
            : 'Manual AI toggle',
          details: {
            from: caseRecord.aiEnabled,
            to: nextCaseAiEnabled,
            pausedReason: aiPausedReason,
          },
          ipAddress: actor.ipAddress,
          userAgent: actor.userAgent,
        });
        realtimeReasons.add('ai_control.changed');
      }

      if (hasPublicRequestNumberIssue) {
        const publicRequestNumber = await ensurePublicRequestNumberForCase(tx, id);
        const statusUrl = await createCaseStatusAccessLink(tx, {
          caseId: id,
          locale: caseRecord.locale,
          publicRequestNumber,
          now,
        });
        issuedPublicRequestNumber = publicRequestNumber;
        issuedPublicRequestStatusUrl = statusUrl;

        const shouldUpdateStatus = caseRecord.status !== CaseStatus.NUMBER_ISSUED;

        if (shouldUpdateStatus) {
          await tx.case.update({
            where: { id },
            data: {
              status: CaseStatus.NUMBER_ISSUED,
              numberIssuedAt: now,
              statusUpdatedAt: now,
            },
          });

          await tx.caseStatusEvent.create({
            data: {
              caseId: id,
              actorSessionId: actor.sessionId,
              actorRole: actor.role,
              fromStatus: caseRecord.status,
              toStatus: CaseStatus.NUMBER_ISSUED,
              reason: 'Manual PR issue from CRM',
              metadata: {
                publicRequestNumber,
                channel: CaseOriginChannel.TELEGRAM,
              },
            },
          });
        }

        await tx.message.create({
          data: {
            caseId: id,
            channel: CaseOriginChannel.CRM,
            authorRole: MessageAuthorRole.SYSTEM,
            authorName: 'CRM System',
            body: buildPrIssuedTelegramMessage(publicRequestNumber, statusUrl),
            isCustomerVisible: true,
            sentAt: now,
          },
        });

        await createAdminAuditLog(tx, {
          actorSessionId: actor.sessionId,
          actorAdminUserId: actor.adminUserId,
          actorRole: actor.role,
          action: 'CASE_PUBLIC_REQUEST_NUMBER_ISSUED',
          resourceType: 'CASE',
          resourceId: id,
          caseId: id,
          details: {
            publicRequestNumber,
            statusChanged: shouldUpdateStatus,
            statusLinkIssued: true,
          },
          ipAddress: actor.ipAddress,
          userAgent: actor.userAgent,
        });

        telegramPrChatId =
          caseRecord.externalConversations[0]?.externalChatId ?? null;
        realtimeReasons.add('public_request_number.issued');
      }
    });

    let telegramDeliveryError: string | null = null;

    if (hasMessage && telegramReplyChatId) {
      try {
        await sendTelegramMessage({
          chatId: telegramReplyChatId,
          text: message,
        });
      } catch (error) {
        telegramDeliveryError =
          error instanceof Error ? error.message : 'Telegram delivery failed';
        console.error('CRM Telegram reply delivery failed:', error);
      }
    }

    if (issuedPublicRequestNumber && telegramPrChatId) {
      try {
        const statusUrl = issuedPublicRequestStatusUrl;

        await sendTelegramMessage({
          chatId: telegramPrChatId,
          text: statusUrl
            ? buildPrIssuedTelegramHtmlMessage({
                publicRequestNumber: issuedPublicRequestNumber,
                statusUrl,
              })
            : buildPrIssuedTelegramMessage(issuedPublicRequestNumber),
          parseMode: statusUrl ? 'HTML' : undefined,
          replyMarkup: statusUrl
            ? {
                inline_keyboard: [[
                  {
                    text: 'Status öffnen',
                    url: statusUrl,
                  },
                ]],
              }
            : undefined,
        });
      } catch (error) {
        telegramDeliveryError =
          error instanceof Error ? error.message : 'Telegram PR delivery failed';
        console.error('CRM Telegram PR delivery failed:', error);
      }
    }

    await Promise.all(
      Array.from(realtimeReasons).map((reason) =>
        publishCaseRealtimeEvent({ caseId: id, reason }).catch((error) => {
          console.error('CRM realtime publish failed:', error);
        })
      )
    );

    return NextResponse.json({
      success: true,
      operatorTakeover: nextOperatorTakeover,
      aiEnabled: nextCaseAiEnabled,
      publicRequestNumber: issuedPublicRequestNumber,
      telegramDeliveryError,
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

  const actor = await requireCaseUpdateActor(request);

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

    if (
      actor.role === 'MANAGER' &&
      currentCase.assignedOperator !== null &&
      currentCase.assignedOperator !== actor.adminUserId &&
      currentCase.assignedOperator !== actor.email &&
      currentCase.assignedOperator !== actor.displayName
    ) {
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

    await publishCaseRealtimeEvent({
      caseId: id,
      reason: statusChanged
        ? 'status.changed'
        : body.assignedOperator !== undefined
          ? 'assignment.changed'
          : 'case.updated',
    }).catch((error) => {
      console.error('CRM realtime patch publish failed:', error);
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
