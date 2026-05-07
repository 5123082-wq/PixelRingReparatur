import { CRM_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { createAdminAuditLog, requireAdminPermissionActor } from '@/lib/admin-audit';
import { NextRequest, NextResponse } from 'next/server';
import { CaseOriginChannel, CaseStatus, MessageAuthorRole } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import { syncCaseCustomerProfile } from '@/lib/customer-profiles';
import { findAvailablePublicRequestNumber } from '@/lib/request-number';

const VALID_STATUSES = Object.values(CaseStatus);
const VALID_CHANNELS = Object.values(CaseOriginChannel);
const DEFAULT_PAGE_SIZE = 25;
const MAX_CASE_CREATE_ATTEMPTS = 25;
const LAST_MESSAGE_PREVIEW_LENGTH = 140;

function isPublicRequestNumberUniqueConflict(error: unknown): boolean {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('code' in error) ||
    (error as { code?: string }).code !== 'P2002'
  ) {
    return false;
  }

  const target = (error as { meta?: { target?: unknown } }).meta?.target;

  if (Array.isArray(target)) {
    return target.some(
      (item) =>
        typeof item === 'string' &&
        item.toLowerCase().includes('publicrequestnumber')
    );
  }

  return typeof target === 'string' && target.toLowerCase().includes('publicrequestnumber');
}

async function requireCaseReadActor(request: NextRequest) {
  return requireAdminPermissionActor(
    prisma,
    request,
    CRM_SESSION_COOKIE_NAME,
    ['CRM_CASE_READ']
  );
}

async function requireCaseCreateActor(request: NextRequest) {
  return requireAdminPermissionActor(
    prisma,
    request,
    CRM_SESSION_COOKIE_NAME,
    ['CRM_CASE_CREATE']
  );
}

function buildLastMessagePreview(value: string): string {
  const clean = value.trim().replace(/\s+/g, ' ');

  return clean.length <= LAST_MESSAGE_PREVIEW_LENGTH
    ? clean
    : `${clean.slice(0, LAST_MESSAGE_PREVIEW_LENGTH - 3)}...`;
}

export async function GET(request: NextRequest) {
  const actor = await requireCaseReadActor(request);

  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE));
  const statusFilter = searchParams.get('status');
  const statusFilters = searchParams
    .get('statuses')
    ?.split(',')
    .map((value) => value.trim())
    .filter((value): value is CaseStatus => VALID_STATUSES.includes(value as CaseStatus));
  const channelFilter = searchParams.get('channel');
  const search = searchParams.get('search')?.trim().toUpperCase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (statusFilters) {
    where.status = { in: statusFilters };
  } else if (statusFilter && VALID_STATUSES.includes(statusFilter as CaseStatus)) {
    where.status = statusFilter;
  }

  if (channelFilter && VALID_CHANNELS.includes(channelFilter as CaseOriginChannel)) {
    where.originChannel = channelFilter;
  }

  if (search) {
    where.OR = [
      { publicRequestNumber: { contains: search } },
      { customerName: { contains: search, mode: 'insensitive' } },
      { customerEmail: { contains: search, mode: 'insensitive' } },
      { customerPhone: { contains: search } },
    ];
  }

  if (actor.role === 'MANAGER') {
    const validAssignees = [actor.adminUserId, actor.email];
    if (actor.displayName) validAssignees.push(actor.displayName);

    where.AND = [
      {
        OR: [
          { assignedOperator: null },
          ...validAssignees.map(val => ({ assignedOperator: val }))
        ]
      }
    ];
  }

  try {
    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        select: {
          id: true,
          publicRequestNumber: true,
          status: true,
          originChannel: true,
          customerName: true,
          customerEmail: true,
          customerPhone: true,
          assignedOperator: true,
          primaryContactMethod: true,
          summary: true,
          createdAt: true,
          updatedAt: true,
          statusUpdatedAt: true,
          messages: {
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              authorRole: true,
              authorName: true,
              body: true,
              channel: true,
              createdAt: true,
            },
            take: 1,
          },
          readStates: {
            where: { adminUserId: actor.adminUserId },
            select: {
              lastReadAt: true,
            },
            take: 1,
          },
          _count: {
            select: {
              messages: true,
              attachments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.case.count({ where }),
    ]);

    const unreadCounts = await Promise.all(
      cases.map(async (caseRecord) => {
        const lastReadAt = caseRecord.readStates[0]?.lastReadAt ?? new Date(0);
        const count = await prisma.message.count({
          where: {
            caseId: caseRecord.id,
            authorRole: MessageAuthorRole.CUSTOMER,
            isCustomerVisible: true,
            createdAt: { gt: lastReadAt },
          },
        });

        return [caseRecord.id, count] as const;
      })
    );
    const unreadCountByCaseId = new Map(unreadCounts);

    const serializedCases = cases.map((caseRecord) => {
      const lastMessage = caseRecord.messages[0] ?? null;

      return {
        ...caseRecord,
        messages: undefined,
        readStates: undefined,
        unreadCustomerMessages: unreadCountByCaseId.get(caseRecord.id) ?? 0,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              authorRole: lastMessage.authorRole,
              authorName: lastMessage.authorName,
              channel: lastMessage.channel,
              preview: buildLastMessagePreview(lastMessage.body),
              createdAt: lastMessage.createdAt,
            }
          : null,
        lastActivityAt: lastMessage?.createdAt ?? caseRecord.updatedAt,
      };
    });

    return NextResponse.json({
      cases: serializedCases,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Admin cases list error:', error);

    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requireCaseCreateActor(request);

  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const body = (await request.json()) as {
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      assignedOperator?: string;
      originChannel?: string;
      summary?: string;
      description?: string;
    };

    const originChannel =
      body.originChannel && VALID_CHANNELS.includes(body.originChannel as CaseOriginChannel)
        ? (body.originChannel as CaseOriginChannel)
        : CaseOriginChannel.MANUAL;
    const customerEmail = body.customerEmail?.trim().toLowerCase() || null;
    const customerPhone = body.customerPhone?.trim() || null;
    const primaryContactMethod = customerEmail ? 'EMAIL' : customerPhone ? 'PHONE' : null;
    const primaryContactValue = customerEmail || customerPhone || null;

    const now = new Date();

    let createdCase: {
      id: string;
      publicRequestNumber: string | null;
      status: CaseStatus;
      originChannel: CaseOriginChannel;
      customerName: string | null;
      createdAt: Date;
    } | null = null;

    for (let attempt = 0; attempt < MAX_CASE_CREATE_ATTEMPTS; attempt += 1) {
      const publicRequestNumber = await findAvailablePublicRequestNumber(prisma);

      try {
        createdCase = await prisma.$transaction(async (tx) => {
          const caseRecord = await tx.case.create({
            data: {
              status: CaseStatus.NUMBER_ISSUED,
              originChannel,
              customerName: body.customerName?.trim() || null,
              customerEmail,
              customerPhone,
              assignedOperator: body.assignedOperator?.trim() || null,
              primaryContactMethod,
              primaryContactValue,
              summary: body.summary?.trim() || null,
              description: body.description?.trim() || null,
              publicRequestNumber,
              numberIssuedAt: now,
              formalizedAt: now,
              statusUpdatedAt: now,
            },
            select: {
              id: true,
              publicRequestNumber: true,
              status: true,
              originChannel: true,
              customerName: true,
              createdAt: true,
            },
          });

          await tx.caseStatusEvent.create({
            data: {
              caseId: caseRecord.id,
              actorSessionId: actor.sessionId,
              actorRole: actor.role,
              fromStatus: null,
              toStatus: CaseStatus.NUMBER_ISSUED,
              reason: 'Manual CRM case creation',
              metadata: {
                originChannel,
              },
            },
          });

          const customerProfileId = await syncCaseCustomerProfile(tx, {
            caseId: caseRecord.id,
            customerName: body.customerName?.trim() || null,
            customerEmail,
            customerPhone,
            preferredLanguage: null,
            preferredContactMethod: primaryContactMethod,
          });

          await createAdminAuditLog(tx, {
            actorSessionId: actor.sessionId,
            actorAdminUserId: actor.adminUserId,
            actorRole: actor.role,
            action: 'CASE_CREATED',
            resourceType: 'CASE',
            resourceId: caseRecord.id,
            caseId: caseRecord.id,
            reason: null,
            details: {
              status: CaseStatus.NUMBER_ISSUED,
              originChannel,
              customerProfileId,
            },
            ipAddress: actor.ipAddress,
            userAgent: actor.userAgent,
          });

          return caseRecord;
        });

        break;
      } catch (error) {
        if (isPublicRequestNumberUniqueConflict(error)) {
          continue;
        }

        throw error;
      }
    }

    if (!createdCase) {
      throw new Error(
        `Unable to create case with a unique public request number after ${MAX_CASE_CREATE_ATTEMPTS} attempts.`
      );
    }

    return NextResponse.json({ success: true, case: createdCase }, { status: 201 });
  } catch (error) {
    console.error('Admin case creation error:', error);

    return NextResponse.json(
      { error: 'Failed to create case' },
      { status: 500 }
    );
  }
}
