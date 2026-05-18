import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
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
  let storedAttachments: StoredAttachmentInput[] = [];

  try {
    const contentType = request.headers.get('content-type') || '';
    let messageBody: unknown;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      messageBody = formData.get('message') ?? formData.get('body');
      const files = formData
        .getAll('files')
        .filter((value): value is File => value instanceof File && value.size > 0);

      storedAttachments = await Promise.all(files.map((file) => storeAttachment(file)));
    } else {
      const body = (await request.json().catch(() => null)) as { body?: unknown } | null;
      messageBody = body?.body;
    }

    const result = await createPortalMessageForRequest(prisma, {
      portalUserId: session.portalUserId,
      portalSessionId: session.sessionId,
      publicRequestNumber,
      body: messageBody,
      attachments: storedAttachments,
    });

    if (!result.ok) {
      await Promise.allSettled(storedAttachments.map((attachment) => deleteAttachment(attachment)));
      const message = result.reason === 'invalid_body'
        ? 'Bitte schreiben Sie eine Nachricht.'
        : 'Die Anfrage ist nicht verfuegbar.';

      return NextResponse.json(
        { success: false, message },
        { status: result.reason === 'invalid_body' ? 400 : 404 }
      );
    }

    await publishCaseRealtimeEvent({
      caseId: result.caseId,
      reason: 'message.created',
    }).catch((error) => {
      console.error('Portal message realtime publish failed:', error);
    });

    let assistantMessage: ReturnType<typeof serializePortalAssistantMessage> | null = null;

    if (result.aiEnabled) {
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
          }).catch((error) => {
            console.error('Portal assistant realtime publish failed:', error);
          });
        }
      } catch (error) {
        console.error('Portal assistant reply failed:', error);
      }
    }

    return NextResponse.json({
      success: true,
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
      assistantMessage,
    });
  } catch (error) {
    await Promise.allSettled(storedAttachments.map((attachment) => deleteAttachment(attachment)));

    const message = error instanceof AttachmentValidationError
      ? error.message
      : 'Die Nachricht konnte nicht gesendet werden.';

    if (!(error instanceof AttachmentValidationError)) {
      console.error('Portal message creation failed:', error);
    }

    return NextResponse.json(
      { success: false, message },
      { status: error instanceof AttachmentValidationError ? 400 : 500 }
    );
  }
}
