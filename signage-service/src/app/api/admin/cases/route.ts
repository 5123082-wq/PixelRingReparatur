import { NextRequest, NextResponse } from 'next/server';
import { CaseOriginChannel, CaseStatus } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import {
  CRM_SESSION_COOKIE_NAME,
} from '@/lib/admin-auth';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import { createAdminAuditLog, requireAdminActor } from '@/lib/admin-audit';
import { syncCaseCustomerProfile } from '@/lib/customer-profiles';
import { findAvailablePublicRequestNumber } from '@/lib/request-number';

const VALID_STATUSES = Object.values(CaseStatus);
const VALID_CHANNELS = Object.values(CaseOriginChannel);
const DEFAULT_PAGE_SIZE = 25;

async function requireAdmin(request: NextRequest) {
  return requireAdminActor(
    prisma,
    request,
    CRM_SESSION_COOKIE_NAME,
    ['MANAGER']
  );
}

export async function GET(request: NextRequest) {
  const actor = await requireAdmin(request);

  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE));
  const statusFilter = searchParams.get('status');
  const channelFilter = searchParams.get('channel');
  const search = searchParams.get('search')?.trim().toUpperCase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (statusFilter && VALID_STATUSES.includes(statusFilter as CaseStatus)) {
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

    return NextResponse.json({
      cases,
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

  const actor = await requireAdmin(request);

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

    const publicRequestNumber = await findAvailablePublicRequestNumber(prisma);

    const createdCase = await prisma.$transaction(async (tx) => {
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

    return NextResponse.json({ success: true, case: createdCase }, { status: 201 });
  } catch (error) {
    console.error('Admin case creation error:', error);

    return NextResponse.json(
      { error: 'Failed to create case' },
      { status: 500 }
    );
  }
}
