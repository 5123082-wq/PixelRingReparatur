import { CaseOriginChannel, CaseStatus, MessageAuthorRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { publishCaseRealtimeEvent } from '@/lib/realtime';
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

function buildWelcomeText(): string {
  return [
    'Danke, Ihre Nachricht ist bei PixelRing angekommen.',
    'Ein Manager antwortet hier im Telegram-Chat.',
    'Nach der Klärung der Details erhalten Sie eine PR-Nummer für die weitere Verfolgung.',
  ].join('\n');
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

  const meta = buildMessageMetadata(telegramMessage);
  const externalMessageId = String(telegramMessage.message_id);
  const body = normalizeBody(extractTelegramMessageBody(telegramMessage));
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

      await tx.message.create({
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
      });

      await tx.case.update({
        where: { id: conversation.caseId },
        data: {
          updatedAt: now,
          summary: buildCaseSummary(body),
        },
      });

      return {
        caseId: conversation.caseId,
        createdNewConversation,
      };
    });

    if (result.createdNewConversation) {
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

    return NextResponse.json({ ok: true, caseId: result.caseId });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    console.error('Telegram webhook error:', error);

    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
