import { CaseOriginChannel, CaseStatus, MessageAuthorRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { runAssistantTurn } from '@/lib/ai/assistant-orchestrator';
import { shouldAttachStatusAction } from '@/lib/ai/chat-engine';
import { sendAdminTelegramNotification } from '@/lib/admin-telegram-notifications';
import { prisma } from '@/lib/prisma';
import { publishCaseRealtimeEvent } from '@/lib/realtime';
import { createCaseStatusAccessLink } from '@/lib/status-access-link';
import {
  extractTelegramMessageBody,
  getTelegramDisplayName,
  isTelegramWebhookSecretValid,
  sendTelegramMessage,
  type TelegramMessage,
  type TelegramUpdate,
} from '@/lib/telegram';

const TELEGRAM_SECRET_HEADER = 'x-telegram-bot-api-secret-token';
const MAX_TELEGRAM_MESSAGE_LENGTH = 4000;
const OPERATOR_MESSAGE_AI_PAUSE_MS = 2 * 60 * 60 * 1000;
const SUPPORTED_LOCALES = new Set(['de', 'en', 'ru', 'tr', 'pl', 'ar']);

function buildCaseSummary(body: string): string {
  const clean = body.trim().replace(/\s+/g, ' ');

  return clean.length <= 180 ? clean : `${clean.slice(0, 177)}...`;
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2002'
  );
}

function normalizeBody(body: string): string {
  const normalized = body.trim();

  if (normalized.length <= MAX_TELEGRAM_MESSAGE_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, MAX_TELEGRAM_MESSAGE_LENGTH - 80)}\n\n[Message truncated by CRM length limit.]`;
}

function hasTextContent(message: TelegramMessage): boolean {
  return Boolean(message.text?.trim() || message.caption?.trim());
}

function isAutoResumableAiPause(input: {
  aiEnabled: boolean;
  aiPausedAt: Date | null;
  aiPausedReason: string | null;
  now: Date;
}): boolean {
  return (
    !input.aiEnabled &&
    (
      input.aiPausedReason === 'public_request_number_issued' ||
      (
        input.aiPausedReason === 'operator_message' &&
        input.aiPausedAt !== null &&
        input.now.getTime() - input.aiPausedAt.getTime() >= OPERATOR_MESSAGE_AI_PAUSE_MS
      )
    )
  );
}

function buildWelcomeText(): string {
  return [
    'Danke, Ihre Nachricht ist bei PixelRing angekommen.',
    'Ein Manager antwortet hier im Telegram-Chat.',
    'Nach der Klärung der Details erhalten Sie eine PR-Nummer für die weitere Verfolgung.',
  ].join('\n');
}

function getStatusButtonLabel(locale?: string | null): string {
  switch (locale) {
    case 'ru':
      return 'Открыть статус';
    case 'en':
      return 'Open status';
    case 'tr':
      return 'Durumu aç';
    case 'pl':
      return 'Otwórz status';
    case 'ar':
      return 'فتح الحالة';
    case 'de':
    default:
      return 'Status öffnen';
  }
}

function normalizeTelegramLocale(languageCode?: string | null): string {
  const normalized = languageCode?.trim().toLowerCase().split(/[-_]/)[0] ?? '';

  return SUPPORTED_LOCALES.has(normalized) ? normalized : 'de';
}

function isChatIdCommand(message: TelegramMessage): boolean {
  const text = message.text?.trim().toLowerCase() ?? '';

  return text === '/chatid' || text.startsWith('/chatid@');
}

function buildMessageMetadata(message: TelegramMessage) {
  const chatId = String(message.chat.id);
  const user = message.from;
  const firstName = user?.first_name || message.chat.first_name || null;
  const lastName = user?.last_name || message.chat.last_name || null;
  const username = user?.username || message.chat.username || null;

  return {
    chatId,
    externalUserId: user?.id ? String(user.id) : null,
    firstName,
    lastName,
    username,
    displayName: getTelegramDisplayName({ firstName, lastName, username }),
    locale: normalizeTelegramLocale(user?.language_code),
  };
}

export async function POST(request: NextRequest) {
  const secretHeader = request.headers.get(TELEGRAM_SECRET_HEADER);

  if (!isTelegramWebhookSecretValid(secretHeader)) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const update = (await request.json().catch(() => null)) as TelegramUpdate | null;
  const telegramMessage = update?.message;

  if (!telegramMessage) {
    return NextResponse.json({ ok: true });
  }

  if (telegramMessage.chat.type !== 'private') {
    if (isChatIdCommand(telegramMessage)) {
      await sendTelegramMessage({
        chatId: String(telegramMessage.chat.id),
        text: [
          'Telegram chat ID:',
          String(telegramMessage.chat.id),
          '',
          'Use this value as TELEGRAM_ADMIN_CHAT_ID.',
        ].join('\n'),
      }).catch((error) => {
        console.error('Telegram chat id command failed:', error);
      });
    }

    return NextResponse.json({ ok: true, ignored: 'non-private-chat' });
  }

  const meta = buildMessageMetadata(telegramMessage);
  const externalMessageId = String(telegramMessage.message_id);
  const body = normalizeBody(extractTelegramMessageBody(telegramMessage));
  const canRunAssistant = hasTextContent(telegramMessage);
  const sentAt = new Date(telegramMessage.date * 1000);
  const now = new Date();

  try {
    const existingMessage = await prisma.message.findFirst({
      where: {
        channel: CaseOriginChannel.TELEGRAM,
        externalChatId: meta.chatId,
        externalMessageId,
      },
      select: { id: true },
    });

    if (existingMessage) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    const result = await prisma.$transaction(async (tx) => {
      let conversation = await tx.externalConversation.findUnique({
        where: {
          channel_externalChatId: {
            channel: CaseOriginChannel.TELEGRAM,
            externalChatId: meta.chatId,
          },
        },
        select: {
          id: true,
          caseId: true,
        },
      });

      let createdNewConversation = false;

      if (!conversation) {
        const caseRecord = await tx.case.create({
          data: {
            status: CaseStatus.DRAFT,
            originChannel: CaseOriginChannel.TELEGRAM,
            customerName: meta.displayName,
            primaryContactMethod: 'TELEGRAM',
            primaryContactValue: meta.chatId,
            summary: buildCaseSummary(body),
            description: body,
            locale: meta.locale,
            statusUpdatedAt: now,
          },
          select: { id: true },
        });

        conversation = await tx.externalConversation.create({
          data: {
            caseId: caseRecord.id,
            channel: CaseOriginChannel.TELEGRAM,
            externalChatId: meta.chatId,
            externalUserId: meta.externalUserId,
            username: meta.username,
            firstName: meta.firstName,
            lastName: meta.lastName,
            lastMessageAt: sentAt,
          },
          select: {
            id: true,
            caseId: true,
          },
        });

        createdNewConversation = true;
      } else {
        await tx.externalConversation.update({
          where: { id: conversation.id },
          data: {
            externalUserId: meta.externalUserId,
            username: meta.username,
            firstName: meta.firstName,
            lastName: meta.lastName,
            lastMessageAt: sentAt,
          },
        });
      }

      const customerMessage = await tx.message.create({
        data: {
          caseId: conversation.caseId,
          channel: CaseOriginChannel.TELEGRAM,
          authorRole: MessageAuthorRole.CUSTOMER,
          authorName: meta.displayName,
          body,
          externalChatId: meta.chatId,
          externalMessageId,
          isCustomerVisible: true,
          sentAt,
        },
        select: {
          id: true,
        },
      });

      const caseRecord = await tx.case.update({
        where: { id: conversation.caseId },
        data: {
          updatedAt: now,
          summary: buildCaseSummary(body),
          locale: meta.locale,
        },
        select: {
          id: true,
          aiEnabled: true,
          aiPausedAt: true,
          aiPausedReason: true,
          locale: true,
          publicRequestNumber: true,
        },
      });

      return {
        caseId: caseRecord.id,
        aiEnabled: caseRecord.aiEnabled,
        aiPausedAt: caseRecord.aiPausedAt,
        aiPausedReason: caseRecord.aiPausedReason,
        locale: caseRecord.locale,
        publicRequestNumber: caseRecord.publicRequestNumber,
        customerMessageId: customerMessage.id,
        createdNewConversation,
      };
    });

    let assistantReplyText: string | null = null;
    const aiPauseExpired = isAutoResumableAiPause({
      aiEnabled: result.aiEnabled,
      aiPausedAt: result.aiPausedAt,
      aiPausedReason: result.aiPausedReason,
      now,
    });
    const canAnswerWithAssistant = result.aiEnabled || aiPauseExpired;

    if (aiPauseExpired) {
      await prisma.case.update({
        where: { id: result.caseId },
        data: {
          aiEnabled: true,
          aiPausedAt: null,
          aiPausedReason: null,
        },
      }).catch((error) => {
        console.error('Telegram AI auto-resume failed:', error);
      });
    }

    if (canRunAssistant && canAnswerWithAssistant) {
      const assistantReply = await runAssistantTurn(prisma, {
        caseId: result.caseId,
        channel: CaseOriginChannel.TELEGRAM,
        locale: result.locale,
        latestMessageId: result.customerMessageId,
        latestCustomerMessage: body,
        publicRequestNumber: result.publicRequestNumber,
        capabilities: [],
      }).catch((error) => {
        console.error('Telegram AI assistant turn failed:', error);
        return null;
      });

      if (assistantReply?.text) {
        assistantReplyText = assistantReply.text;
        const shouldShowStatusButton =
          Boolean(result.publicRequestNumber) && shouldAttachStatusAction(body);
        const statusUrl = shouldShowStatusButton
          ? await createCaseStatusAccessLink(prisma, {
              caseId: result.caseId,
              publicRequestNumber: result.publicRequestNumber!,
              locale: result.locale,
              now,
            }).catch((error) => {
              console.error('Telegram status link creation failed:', error);
              return null;
            })
          : null;

        await sendTelegramMessage({
          chatId: meta.chatId,
          text: assistantReply.text,
          replyMarkup: statusUrl
            ? {
                inline_keyboard: [[
                  {
                    text: getStatusButtonLabel(result.locale),
                    url: statusUrl,
                  },
                ]],
              }
            : undefined,
        }).catch((error) => {
          console.error('Telegram AI reply delivery failed:', error);
        });
      }
    }

    if (result.createdNewConversation && !assistantReplyText) {
      await sendTelegramMessage({
        chatId: meta.chatId,
        text: buildWelcomeText(),
      }).catch((error) => {
        console.error('Telegram welcome reply failed:', error);
      });
    }

    await publishCaseRealtimeEvent({
      caseId: result.caseId,
      reason: 'message.created',
    }).catch((error) => {
      console.error('Telegram realtime publish failed:', error);
    });

    await sendAdminTelegramNotification({
      kind: 'telegram_customer_message_created',
      caseId: result.caseId,
      publicRequestNumber: result.publicRequestNumber,
      customerName: meta.displayName,
      contactLabel: meta.username ? `@${meta.username}` : `Telegram chat ${meta.chatId}`,
      originLabel: 'Telegram',
      messagePreview: body,
      isNewCase: result.createdNewConversation,
    }).catch((error) => {
      console.error('Admin Telegram customer-message notification failed:', error);
    });

    return NextResponse.json({ ok: true, caseId: result.caseId });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    console.error('Telegram webhook error:', error);

    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
