import { savedMessageStream } from '@/lib/portal/message-stream';
import { getPortalMessagesForUser } from '@/lib/portal/production-data';
import { portalReadTiming } from '@/lib/portal/performance';
import { ATTENTION_IMAGE_MIME_TYPES } from '@/lib/portal-attention/types';
import { DOCUMENT_ID } from '@/lib/case-documents/types';
import { attentionAccess } from '@/lib/portal-attention/service';
import { after, NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { requireOperatorForMessage, type OperatorReason } from '@/lib/portal-operator/state';
import { notifyPortalOperator } from '@/lib/portal-operator/notify';
import { runAssistantTurn } from '@/lib/ai/assistant-orchestrator';
import {
  getPortalSessionContext,
  PORTAL_SESSION_COOKIE_NAME,
} from '@/lib/portal/auth';
import { validatePortalMutationRequest } from '@/lib/portal/mutation-guard';
import { createPortalMessageForRequest } from '@/lib/portal/requests';
import { publishCaseRealtimeEvent } from '@/lib/realtime';
import {
  AttachmentValidationError,
  deleteAttachment,
  storeAttachment,
  type StoredAttachmentInput,
} from '@/lib/attachments';
import {
  checkRateLimit,
  getClientIP,
  PORTAL_MESSAGE_LIMIT,
} from '@/lib/rate-limit';

export const maxDuration = 180;

type RouteParams = {
  params: Promise<{ publicRequestNumber: string }>;
};

function serializePortalAssistantMessage(message: {
  id: string;
  authorRole: 'SYSTEM';
  channel: 'WEBSITE_CHAT';
  body: string;
  isCustomerVisible: true;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: message.id,
    authorRole: message.authorRole,
    channel: message.channel,
    body: message.body,
    isCustomerVisible: message.isCustomerVisible,
    sentAt: message.sentAt?.toISOString() ?? null,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
    attachments: [],
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const mutationError = validatePortalMutationRequest(request);

  if (mutationError) {
    return mutationError;
  }

  const ip = getClientIP(request);
  const limit = checkRateLimit(ip, PORTAL_MESSAGE_LIMIT);

  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, message: 'Bitte versuchen Sie es spaeter erneut.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.resetMs / 1000)) } }
    );
  }

  const session = await getPortalSessionContext(
    prisma,
    request.cookies.get(PORTAL_SESSION_COOKIE_NAME)?.value
  );

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Bitte melden Sie sich zuerst im Kundenportal an.' },
      { status: 401 }
    );
  }

  const { publicRequestNumber } = await params;
  const storedAttachments: StoredAttachmentInput[] = [];
  let persisted = false;
  let messageId: string | undefined;
  const replay = async () => {
    if (!messageId) return null;
    const message = await prisma.message.findFirst({ where: { id: messageId, authorRole: 'CUSTOMER', channel: 'WEBSITE_CHAT', isCustomerVisible: true,
      session: { portalUserId: session.portalUserId }, case: { publicRequestNumber, portalCaseAccesses: { some: { portalUserId: session.portalUserId, revokedAt: null, portalUser: { status: 'ACTIVE' } } } } },
      select: { id: true, authorRole: true, channel: true, body: true, isCustomerVisible: true, sentAt: true, createdAt: true, updatedAt: true,
        attachments: { where: { isCustomerVisible: true }, select: { id: true, storageKey: true, originalFilename: true, mimeType: true } } } });
    if (!message) return null;
    const saved = { success: true as const, publicRequestNumber, message: { ...message, sentAt: message.sentAt?.toISOString() ?? null, createdAt: message.createdAt.toISOString(), updatedAt: message.updatedAt.toISOString() }, assistantMessage: null, assistantPending: false };
    return request.headers.get('accept')?.includes('application/x-ndjson')
      ? new Response(savedMessageStream(saved, async () => saved), { headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'private, no-store' } })
      : NextResponse.json(saved, { headers: { 'Cache-Control': 'private, no-store' } });
  };

  try {
    const contentType = request.headers.get('content-type') || '';
    let messageBody: unknown;
    let attentionId: unknown;
    let suppliedMessageId: unknown;
    let retry = false;
    let files: File[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      messageBody = formData.get('message') ?? formData.get('body');
      attentionId = formData.get('attentionId');
      suppliedMessageId = formData.get('messageId');
      retry = formData.get('retry') === '1';
      files = formData
        .getAll('files')
        .filter((value): value is File => value instanceof File && value.size > 0);


    } else {
      const body = (await request.json().catch(() => null)) as { body?: unknown; attentionId?: unknown; messageId?: unknown; retry?: unknown } | null;
      messageBody = body?.body;
      attentionId = body?.attentionId;
      suppliedMessageId = body?.messageId;
      retry = body?.retry === true;
    }

    if (suppliedMessageId !== undefined && suppliedMessageId !== null) {
      if (typeof suppliedMessageId !== 'string' || !DOCUMENT_ID.test(suppliedMessageId)) return NextResponse.json({ success: false, saved: false, error: 'invalid_message_id' }, { status: 400 });
      messageId = suppliedMessageId;
      if (retry) { const prior = await replay(); if (prior) return prior; }
    }

    if (attentionId !== undefined && attentionId !== null) {
      const action = typeof attentionId === 'string' && DOCUMENT_ID.test(attentionId)
        ? await prisma.portalAttention.findFirst({ where: { id: attentionId, ...attentionAccess(session.portalUserId),
          state: 'OPEN', mode: { in: ['REPLY', 'UPLOAD'] }, case: { publicRequestNumber, portalCaseAccesses: { some: { portalUserId: session.portalUserId, revokedAt: null } } } } })
        : null;
      if (!action || (action.mode === 'UPLOAD' && !files.some(file => ATTENTION_IMAGE_MIME_TYPES.includes(file.type)))) return NextResponse.json({ success: false, error: 'invalid_attention' }, { status: 409 });
    }
    // Validate the explicit task before writing any file. Sequential storage allows full cleanup on failure.
    for (const file of files) storedAttachments.push(await storeAttachment(file));

    const result = await createPortalMessageForRequest(prisma, {
      portalUserId: session.portalUserId,
      portalSessionId: session.sessionId,
      publicRequestNumber,
      body: messageBody,
      messageId,
      attachments: storedAttachments,
      attentionId: typeof attentionId === 'string' ? attentionId : undefined,
    });

    if (!result.ok) {
      await Promise.allSettled(storedAttachments.map((attachment) => deleteAttachment(attachment)));
      const message = result.reason === 'invalid_body'
        ? 'Bitte schreiben Sie eine Nachricht.'
        : 'Die Anfrage ist nicht verfuegbar.';

      return NextResponse.json(
        { success: false, message },
        { status: result.reason === 'invalid_attention' ? 409 : result.reason === 'invalid_body' ? 400 : 404 }
      );
    }

    persisted = true;
    const saved = {
      success: true as const,
      publicRequestNumber: result.publicRequestNumber,
      message: {
        id: result.message.id,
        authorRole: result.message.authorRole,
        channel: result.message.channel,
        body: result.message.body,
        isCustomerVisible: result.message.isCustomerVisible,
        sentAt: result.message.sentAt?.toISOString() ?? null,
        createdAt: result.message.createdAt.toISOString(),
        updatedAt: result.message.updatedAt.toISOString(),
        attachments: result.message.attachments,
      },
      assistantMessage: null,
      assistantPending: result.aiEnabled && !attentionId,
    };
    const complete = async () => {
      await publishCaseRealtimeEvent({
        caseId: result.caseId,
        reason: 'message.created',
      }).catch(() => {
        console.error('Portal message realtime publish failed');
      });

      let operatorReason: OperatorReason | null = attentionId ? 'human_requested' : result.aiEnabled ? null : 'ai_disabled';
      let assistantFailed = false;
      let assistantMessage: ReturnType<typeof serializePortalAssistantMessage> | null = null;

      if (result.aiEnabled && !attentionId) {
        const latestCustomerMessage = storedAttachments.length > 0
          ? `${result.message.body}\n\n[System-Notiz: Der Kunde hat ${storedAttachments.length} Foto(s)/Datei(en) an diese Nachricht angehaengt. Bestaetige kurz, dass die Datei angekommen ist, auch wenn du sie noch nicht sehen kannst.]`
          : result.message.body;

        try {
          const assistant = await runAssistantTurn(prisma, {
            caseId: result.caseId,
            channel: result.message.channel,
            locale: result.locale,
            latestMessageId: result.message.id,
            latestCustomerMessage,
            publicRequestNumber: result.publicRequestNumber,
            requestBoundPortal: true,
            newRequestUrl: '/portal#new-request',
            capabilities: ['attachments'],
          });

          operatorReason = !assistant || assistant.outcome === 'failed' ? 'ai_failed'
            : assistant.outcome === 'handoff' ? 'human_requested'
            : assistant.outcome === 'suppressed' ? 'ai_disabled' : null;
          assistantFailed = operatorReason === 'ai_failed';

          if (assistant?.messageId) {
            const createdAssistantMessage = await prisma.message.findUnique({
              where: { id: assistant.messageId },
              select: {
                id: true,
                authorRole: true,
                channel: true,
                body: true,
                isCustomerVisible: true,
                sentAt: true,
                createdAt: true,
                updatedAt: true,
              },
            });

            if (
              createdAssistantMessage &&
              createdAssistantMessage.authorRole === 'SYSTEM' &&
              createdAssistantMessage.channel === 'WEBSITE_CHAT' &&
              createdAssistantMessage.isCustomerVisible
            ) {
              assistantMessage = serializePortalAssistantMessage({
                ...createdAssistantMessage,
                authorRole: 'SYSTEM',
                channel: 'WEBSITE_CHAT',
                isCustomerVisible: true,
              });
            }

            await publishCaseRealtimeEvent({
              caseId: result.caseId,
              reason: 'message.created',
            }).catch(() => {
              console.error('Portal assistant realtime publish failed');
            });
          }
        } catch {
          operatorReason = 'ai_failed';
          assistantFailed = true;
          console.error('Portal assistant reply failed');
        }
      }

      try {
        if (operatorReason) await requireOperatorForMessage(prisma, result.caseId, result.message.id, operatorReason);
        await notifyPortalOperator(result.caseId);
      } catch {
        console.error('Portal operator attention update failed');
      }

      return { ...saved, assistantPending: false, assistantMessage, assistantFailed };
    };
    if (request.headers.get('accept')?.includes('application/x-ndjson')) {
      let work: ReturnType<typeof complete> | undefined;
      const completeOnce = () => work ??= complete();
      // Keep the same operation alive after a client disconnect; no second AI turn or queue.
      after(async () => { await completeOnce(); });
      return new Response(savedMessageStream(saved, completeOnce), { headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'private, no-store', 'X-Accel-Buffering': 'no',
      } });
    }
    return NextResponse.json(await complete(), { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    if (!persisted) await Promise.allSettled(storedAttachments.map((attachment) => deleteAttachment(attachment)));

    if (messageId && error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      const prior = await replay();
      if (prior) return prior;
      return NextResponse.json({ success: false, saved: false, error: 'message_id_conflict' }, { status: 409 });
    }

    const message = error instanceof AttachmentValidationError
      ? error.message
      : 'Die Nachricht konnte nicht gesendet werden.';

    if (!(error instanceof AttachmentValidationError)) {
      console.error('Portal message creation failed');
    }

    return NextResponse.json(
      { success: false, saved: persisted, message },
      { status: error instanceof AttachmentValidationError ? 400 : 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const timing = portalReadTiming('messages');
  const session = await getPortalSessionContext(prisma, request.cookies.get(PORTAL_SESSION_COOKIE_NAME)?.value);
  timing.authenticated();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers: timing.headers() });
  const { publicRequestNumber } = await params;
  const before = request.nextUrl.searchParams.get('before');
  if (before && !DOCUMENT_ID.test(before)) return NextResponse.json({ error: 'invalid_cursor' }, { status: 400, headers: timing.headers() });
  try { const result = await getPortalMessagesForUser(prisma, session.portalUserId, publicRequestNumber, before);
    return NextResponse.json(result ? { ...result, portalUserId: session.portalUserId } : { error: 'not_found' }, { status: result ? 200 : 404, headers: timing.headers() });
  } catch { return NextResponse.json({ error: 'unavailable' }, { status: 503, headers: timing.headers() }); }
}
