import { CaseOriginChannel, CaseStatus, MessageAuthorRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { runAssistantTurn } from '@/lib/ai/assistant-orchestrator';
import { shouldAttachStatusAction } from '@/lib/ai/chat-engine';
import { sendAdminTelegramNotification } from '@/lib/admin-telegram-notifications';
import { storeAttachmentBuffer } from '@/lib/attachments';
import { prisma } from '@/lib/prisma';
import { publishCaseRealtimeEvent } from '@/lib/realtime';
import { createCaseStatusAccessLink } from '@/lib/status-access-link';
import { ensurePublicRequestNumberForCase } from '@/lib/request-number';
import { createTelegramIntakeLink } from '@/lib/telegram-intake';
import {
  answerTelegramCallbackQuery,
  downloadTelegramFile,
  extractTelegramMessageBody,
  getTelegramDisplayName,
  getLargestTelegramPhoto,
  isTelegramWebhookSecretValid,
  sendTelegramMessage,
  type TelegramMessage,
  type TelegramUpdate,
} from '@/lib/telegram';

const TELEGRAM_SECRET_HEADER = 'x-telegram-bot-api-secret-token';
const MAX_TELEGRAM_MESSAGE_LENGTH = 4000;
const OPERATOR_MESSAGE_AI_PAUSE_MS = 2 * 60 * 60 * 1000;
const SUPPORTED_LOCALES = new Set(['de', 'en', 'ru', 'tr', 'pl', 'ar']);
const CONFIRM_NEW_REQUEST_CALLBACK = 'pr_new_request_confirm';
const KNOWN_TELEGRAM_REQUEST_SUMMARY = 'Neue Telegram-Anfrage aus bekanntem Kontakt';
const KNOWN_REQUEST_CALLBACK_DEDUP_MS = 10 * 60 * 1000;

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

function getIntakeButtonLabel(locale?: string | null): string {
  switch (locale) {
    case 'ru':
      return 'Открыть защищённую форму';
    case 'en':
      return 'Open secure form';
    case 'tr':
      return 'Guvenli formu ac';
    case 'pl':
      return 'Otworz bezpieczny formularz';
    case 'ar':
      return 'فتح النموذج الآمن';
    case 'de':
    default:
      return 'Geschuetztes Formular oeffnen';
  }
}

function getConfirmNewRequestButtonLabel(locale?: string | null): string {
  switch (locale) {
    case 'ru':
      return 'Создать новую заявку';
    case 'en':
      return 'Create new request';
    case 'tr':
      return 'Yeni talep olustur';
    case 'pl':
      return 'Utworz nowe zgloszenie';
    case 'ar':
      return 'إنشاء طلب جديد';
    case 'de':
    default:
      return 'Neue Anfrage erstellen';
  }
}

function buildIntakeOfferText(locale?: string | null): string {
  switch (locale) {
    case 'ru':
      return [
        'Откройте защищённую форму PixelRing.',
        'Данные будут отправлены на сайт PixelRing, а общение продолжится здесь, в Telegram.',
      ].join('\n');
    case 'en':
      return [
        'Open the secure PixelRing form.',
        'The details go to the PixelRing site, and the conversation continues here in Telegram.',
      ].join('\n');
    case 'tr':
      return [
        'Guvenli PixelRing formunu acin.',
        'Bilgiler PixelRing sitesine gider, gorusme burada Telegramda devam eder.',
      ].join('\n');
    case 'pl':
      return [
        'Otworz bezpieczny formularz PixelRing.',
        'Dane trafia na strone PixelRing, a rozmowa bedzie kontynuowana tutaj w Telegramie.',
      ].join('\n');
    case 'ar':
      return [
        'افتح نموذج PixelRing الآمن.',
        'سيتم إرسال البيانات إلى موقع PixelRing، وستستمر المحادثة هنا في Telegram.',
      ].join('\n');
    case 'de':
    default:
      return [
        'Oeffnen Sie das geschuetzte PixelRing Formular.',
        'Die Daten gehen an die PixelRing Website, der Dialog geht hier in Telegram weiter.',
      ].join('\n');
  }
}

function buildKnownContactNewRequestCreatedText(input: {
  locale?: string | null;
  publicRequestNumber: string;
}): string {
  switch (input.locale) {
    case 'ru':
      return [
        `Новая заявка создана: ${input.publicRequestNumber}.`,
        'Опишите, пожалуйста, что именно нужно сделать, и пришлите фото, если удобно.',
      ].join('\n');
    case 'en':
      return [
        `New request created: ${input.publicRequestNumber}.`,
        'Please describe what needs to be done and send a photo if convenient.',
      ].join('\n');
    case 'tr':
      return [
        `Yeni talep olusturuldu: ${input.publicRequestNumber}.`,
        'Lutfen ne yapilmasi gerektigini yazin ve uygunsa bir fotograf gonderin.',
      ].join('\n');
    case 'pl':
      return [
        `Nowe zgloszenie utworzone: ${input.publicRequestNumber}.`,
        'Opisz prosze, co trzeba zrobic, i wyslij zdjecie, jesli to wygodne.',
      ].join('\n');
    case 'ar':
      return [
        `تم إنشاء طلب جديد: ${input.publicRequestNumber}.`,
        'يرجى وصف المطلوب وإرسال صورة إذا كان ذلك مناسبا.',
      ].join('\n');
    case 'de':
    default:
      return [
        `Neue Anfrage erstellt: ${input.publicRequestNumber}.`,
        'Beschreiben Sie bitte kurz, was gemacht werden soll, und senden Sie gern ein Foto.',
      ].join('\n');
  }
}

function buildKnownContactFallbackText(locale?: string | null): string {
  switch (locale) {
    case 'ru':
      return 'Для новой заявки сначала нужна защищённая контактная привязка. Откройте форму, чтобы один раз сохранить контакт.';
    case 'en':
      return 'A protected contact link is needed before creating a new request. Open the form once to save the contact.';
    case 'tr':
      return 'Yeni talep icin once guvenli iletisim baglantisi gerekir. Iletisimi bir kez kaydetmek icin formu acin.';
    case 'pl':
      return 'Przed utworzeniem nowego zgloszenia potrzebne jest bezpieczne powiazanie kontaktu. Otworz formularz, aby raz zapisac kontakt.';
    case 'ar':
      return 'قبل إنشاء طلب جديد، نحتاج إلى ربط آمن لبيانات الاتصال. افتح النموذج مرة واحدة لحفظ بيانات الاتصال.';
    case 'de':
    default:
      return 'Fuer eine neue Anfrage brauchen wir zuerst eine geschuetzte Kontaktzuordnung. Oeffnen Sie das Formular einmal, um den Kontakt zu speichern.';
  }
}

function shouldOfferTelegramIntakeForm(body: string): boolean {
  const normalized = body.trim().toLowerCase();

  return normalized === '/request' || normalized.startsWith('/request@');
}

function normalizeTelegramLocale(languageCode?: string | null): string {
  const normalized = languageCode?.trim().toLowerCase().split(/[-_]/)[0] ?? '';

  return SUPPORTED_LOCALES.has(normalized) ? normalized : 'de';
}

type TelegramMessageMeta = ReturnType<typeof buildMessageMetadata>;

function hasStoredContact(caseRecord: {
  customerEmail?: string | null;
  customerPhone?: string | null;
  primaryContactMethod?: string | null;
  primaryContactValue?: string | null;
  customerProfile?: {
    email?: string | null;
    phone?: string | null;
    emailNormalized?: string | null;
    phoneNormalized?: string | null;
  } | null;
}): boolean {
  return Boolean(
    caseRecord.customerEmail ||
    caseRecord.customerPhone ||
    caseRecord.customerProfile?.email ||
    caseRecord.customerProfile?.phone ||
    caseRecord.customerProfile?.emailNormalized ||
    caseRecord.customerProfile?.phoneNormalized ||
    (
      caseRecord.primaryContactMethod &&
      caseRecord.primaryContactMethod !== 'TELEGRAM' &&
      caseRecord.primaryContactValue
    )
  );
}

function getStoredContact(caseRecord: {
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  primaryContactMethod?: string | null;
  primaryContactValue?: string | null;
  customerProfile?: {
    displayName?: string | null;
    email?: string | null;
    phone?: string | null;
    emailNormalized?: string | null;
    phoneNormalized?: string | null;
  } | null;
}): {
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  primaryContactMethod: 'EMAIL' | 'PHONE' | null;
  primaryContactValue: string | null;
} {
  const customerEmail =
    caseRecord.customerEmail ??
    caseRecord.customerProfile?.email ??
    caseRecord.customerProfile?.emailNormalized ??
    (
      caseRecord.primaryContactMethod === 'EMAIL'
        ? caseRecord.primaryContactValue
        : null
    ) ??
    null;
  const customerPhone =
    caseRecord.customerPhone ??
    caseRecord.customerProfile?.phone ??
    caseRecord.customerProfile?.phoneNormalized ??
    (
      caseRecord.primaryContactMethod === 'PHONE'
        ? caseRecord.primaryContactValue
        : null
    ) ??
    null;
  const primaryContactMethod = customerEmail ? 'EMAIL' : customerPhone ? 'PHONE' : null;

  return {
    customerName:
      caseRecord.customerName ??
      caseRecord.customerProfile?.displayName ??
      null,
    customerEmail,
    customerPhone,
    primaryContactMethod,
    primaryContactValue:
      primaryContactMethod === 'EMAIL'
        ? customerEmail
        : primaryContactMethod === 'PHONE'
          ? customerPhone
          : null,
  };
}

async function createKnownTelegramRequest(input: {
  chatId: string;
  meta: TelegramMessageMeta;
  now: Date;
}): Promise<{
  caseId: string;
  publicRequestNumber: string;
  statusUrl: string;
  locale: string | null;
  customerName: string | null;
  contactLabel: string;
} | null> {
  return prisma.$transaction(async (tx) => {
    const conversation = await tx.externalConversation.findUnique({
      where: {
        channel_externalChatId: {
          channel: CaseOriginChannel.TELEGRAM,
          externalChatId: input.chatId,
        },
      },
      select: {
        id: true,
        case: {
          select: {
            id: true,
            publicRequestNumber: true,
            summary: true,
            numberIssuedAt: true,
            customerName: true,
            customerEmail: true,
            customerPhone: true,
            customerProfileId: true,
            primaryContactMethod: true,
            primaryContactValue: true,
            locale: true,
            customerProfile: {
              select: {
                displayName: true,
                email: true,
                phone: true,
                emailNormalized: true,
                phoneNormalized: true,
              },
            },
          },
        },
      },
    });

    if (!conversation || !hasStoredContact(conversation.case)) {
      return null;
    }

    const storedContact = getStoredContact(conversation.case);
    const locale = conversation.case.locale ?? input.meta.locale;
    const isRecentConfirmedRequest =
      conversation.case.summary === KNOWN_TELEGRAM_REQUEST_SUMMARY &&
      conversation.case.publicRequestNumber &&
      conversation.case.numberIssuedAt &&
      input.now.getTime() - conversation.case.numberIssuedAt.getTime() <= KNOWN_REQUEST_CALLBACK_DEDUP_MS;

    if (isRecentConfirmedRequest) {
      const statusUrl = await createCaseStatusAccessLink(tx, {
        caseId: conversation.case.id,
        publicRequestNumber: conversation.case.publicRequestNumber!,
        locale,
        now: input.now,
      });

      return {
        caseId: conversation.case.id,
        publicRequestNumber: conversation.case.publicRequestNumber!,
        statusUrl,
        locale,
        customerName: storedContact.customerName ?? input.meta.displayName,
        contactLabel: input.meta.username ? `@${input.meta.username}` : `Telegram chat ${input.chatId}`,
      };
    }

    const createdCase = await tx.case.create({
      data: {
        status: CaseStatus.NUMBER_ISSUED,
        originChannel: CaseOriginChannel.TELEGRAM,
        customerName: storedContact.customerName ?? input.meta.displayName,
        customerEmail: storedContact.customerEmail,
        customerPhone: storedContact.customerPhone,
        customerProfileId: conversation.case.customerProfileId,
        primaryContactMethod: storedContact.primaryContactMethod,
        primaryContactValue: storedContact.primaryContactValue,
        locale,
        summary: KNOWN_TELEGRAM_REQUEST_SUMMARY,
        description: 'Neue Telegram-Anfrage wurde im bestehenden Telegram-Chat bestaetigt.',
        formalizedAt: input.now,
        numberIssuedAt: input.now,
        statusUpdatedAt: input.now,
      },
      select: { id: true },
    });
    const publicRequestNumber = await ensurePublicRequestNumberForCase(tx, createdCase.id);
    const statusUrl = await createCaseStatusAccessLink(tx, {
      caseId: createdCase.id,
      publicRequestNumber,
      locale,
      now: input.now,
    });

    await tx.externalConversation.update({
      where: { id: conversation.id },
      data: {
        caseId: createdCase.id,
        externalUserId: input.meta.externalUserId,
        username: input.meta.username,
        firstName: input.meta.firstName,
        lastName: input.meta.lastName,
        lastMessageAt: input.now,
      },
    });

    await tx.message.create({
      data: {
        caseId: createdCase.id,
        channel: CaseOriginChannel.TELEGRAM,
        authorRole: MessageAuthorRole.SYSTEM,
        authorName: 'Telegram Assistant',
        body: buildKnownContactNewRequestCreatedText({ locale, publicRequestNumber }),
        isCustomerVisible: true,
        sentAt: input.now,
      },
    });

    await tx.caseStatusEvent.create({
      data: {
        caseId: createdCase.id,
        fromStatus: CaseStatus.DRAFT,
        toStatus: CaseStatus.NUMBER_ISSUED,
        reason: 'Telegram known contact confirmed new request',
        metadata: {
          publicRequestNumber,
          channel: CaseOriginChannel.TELEGRAM,
        },
      },
    });

    return {
      caseId: createdCase.id,
      publicRequestNumber,
      statusUrl,
      locale,
      customerName: storedContact.customerName ?? input.meta.displayName,
      contactLabel: input.meta.username ? `@${input.meta.username}` : `Telegram chat ${input.chatId}`,
    };
  });
}

function isChatIdCommand(message: TelegramMessage): boolean {
  const text = message.text?.trim().toLowerCase() ?? '';

  return text === '/chatid' || text.startsWith('/chatid@');
}

function isReturnCommand(message: TelegramMessage): boolean {
  const text = message.text?.trim() ?? '';

  return /^\/start(?:@\w+)?\s+return_[A-Za-z0-9_-]+$/i.test(text);
}

function buildReturnCommandText(locale?: string | null): string {
  switch (locale) {
    case 'ru':
      return 'Вы вернулись в Telegram. Общение по заявке можно продолжить здесь.';
    case 'en':
      return 'You are back in Telegram. The request conversation can continue here.';
    case 'tr':
      return 'Telegrama geri dondunuz. Talep gorusmesi burada devam edebilir.';
    case 'pl':
      return 'Wrociles do Telegrama. Rozmowe o zgloszeniu mozna kontynuowac tutaj.';
    case 'ar':
      return 'عدت إلى Telegram. يمكن متابعة محادثة الطلب هنا.';
    case 'de':
    default:
      return 'Sie sind zurueck in Telegram. Der Dialog zur Anfrage kann hier weitergehen.';
  }
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

function buildCallbackMetadata(query: NonNullable<TelegramUpdate['callback_query']>): TelegramMessageMeta | null {
  const chat = query.message?.chat;

  if (!chat) {
    return null;
  }

  const user = query.from;
  const firstName = user.first_name || chat.first_name || null;
  const lastName = user.last_name || chat.last_name || null;
  const username = user.username || chat.username || null;

  return {
    chatId: String(chat.id),
    externalUserId: String(user.id),
    firstName,
    lastName,
    username,
    displayName: getTelegramDisplayName({ firstName, lastName, username }),
    locale: normalizeTelegramLocale(user.language_code),
  };
}

export async function POST(request: NextRequest) {
  const secretHeader = request.headers.get(TELEGRAM_SECRET_HEADER);

  if (!isTelegramWebhookSecretValid(secretHeader)) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const update = (await request.json().catch(() => null)) as TelegramUpdate | null;
  const callbackQuery = update?.callback_query;

  if (callbackQuery) {
    if (
      callbackQuery.data !== CONFIRM_NEW_REQUEST_CALLBACK ||
      callbackQuery.message?.chat.type !== 'private'
    ) {
      return NextResponse.json({ ok: true, ignored: 'unsupported-callback' });
    }

    const meta = buildCallbackMetadata(callbackQuery);

    if (!meta) {
      return NextResponse.json({ ok: true, ignored: 'missing-callback-message' });
    }

    const now = new Date();
    const created = await createKnownTelegramRequest({
      chatId: meta.chatId,
      meta,
      now,
    }).catch((error) => {
      console.error('Known Telegram request creation failed:', error);
      return null;
    });

    await answerTelegramCallbackQuery({
      callbackQueryId: callbackQuery.id,
      text: created
        ? getConfirmNewRequestButtonLabel(created.locale)
        : buildKnownContactFallbackText(meta.locale),
      showAlert: !created,
    }).catch((error) => {
      console.error('Telegram callback answer failed:', error);
    });

    if (!created) {
      await sendTelegramMessage({
        chatId: meta.chatId,
        text: buildKnownContactFallbackText(meta.locale),
      }).catch((error) => {
        console.error('Telegram known-contact fallback reply failed:', error);
      });

      return NextResponse.json({ ok: true, callback: true, created: false });
    }

    await sendTelegramMessage({
      chatId: meta.chatId,
      text: buildKnownContactNewRequestCreatedText({
        locale: created.locale,
        publicRequestNumber: created.publicRequestNumber,
      }),
      replyMarkup: {
        inline_keyboard: [[
          {
            text: getStatusButtonLabel(created.locale),
            url: created.statusUrl,
          },
        ]],
      },
    }).catch((error) => {
      console.error('Telegram known-contact request confirmation failed:', error);
    });

    await publishCaseRealtimeEvent({
      caseId: created.caseId,
      reason: 'public_request_number.issued',
    }).catch((error) => {
      console.error('Telegram known-contact realtime publish failed:', error);
    });

    await sendAdminTelegramNotification({
      kind: 'telegram_customer_message_created',
      caseId: created.caseId,
      publicRequestNumber: created.publicRequestNumber,
      customerName: created.customerName,
      contactLabel: created.contactLabel,
      originLabel: 'Telegram',
      messagePreview: 'New Telegram request created from saved contact.',
      isNewCase: true,
    }).catch((error) => {
      console.error('Admin Telegram known-contact notification failed:', error);
    });

    return NextResponse.json({ ok: true, callback: true, caseId: created.caseId });
  }

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

  if (isReturnCommand(telegramMessage)) {
    await sendTelegramMessage({
      chatId: meta.chatId,
      text: buildReturnCommandText(meta.locale),
    }).catch((error) => {
      console.error('Telegram return command reply failed:', error);
    });

    return NextResponse.json({ ok: true, returnCommand: true });
  }

  const externalMessageId = String(telegramMessage.message_id);
  const body = normalizeBody(extractTelegramMessageBody(telegramMessage));
  const canRunAssistant = hasTextContent(telegramMessage);
  const telegramPhoto = getLargestTelegramPhoto(telegramMessage);
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
          externalUserId: true,
          case: {
            select: {
              customerEmail: true,
              customerPhone: true,
              primaryContactMethod: true,
              primaryContactValue: true,
              customerProfile: {
                select: {
                  email: true,
                  phone: true,
                  emailNormalized: true,
                  phoneNormalized: true,
                },
              },
            },
          },
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
            externalUserId: true,
            case: {
              select: {
                customerEmail: true,
                customerPhone: true,
                primaryContactMethod: true,
                primaryContactValue: true,
                customerProfile: {
                  select: {
                    email: true,
                    phone: true,
                    emailNormalized: true,
                    phoneNormalized: true,
                  },
                },
              },
            },
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
        externalConversationId: conversation.id,
        externalUserId: meta.externalUserId,
        createdNewConversation,
        hasStoredTelegramContact: hasStoredContact(conversation.case),
      };
    });

    if (telegramPhoto) {
      try {
        const downloadedFile = await downloadTelegramFile(telegramPhoto.file_id);
        const storedAttachment = await storeAttachmentBuffer({
          buffer: downloadedFile.buffer,
          mimeType: downloadedFile.mimeType,
          originalFilename: downloadedFile.originalFilename,
          source: 'telegram',
        });

        await prisma.attachment.create({
          data: {
            caseId: result.caseId,
            messageId: result.customerMessageId,
            ...storedAttachment,
            width: telegramPhoto.width,
            height: telegramPhoto.height,
            isCustomerVisible: true,
          },
        });
      } catch (error) {
        console.error('Telegram photo attachment storage failed:', error);
      }
    }

    let assistantReplyText: string | null = null;
    const shouldSendIntakeForm =
      canRunAssistant &&
      !result.hasStoredTelegramContact &&
      shouldOfferTelegramIntakeForm(body);
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

    if (!assistantReplyText && shouldSendIntakeForm) {
      const intakeLink = await createTelegramIntakeLink(prisma, {
        caseId: result.caseId,
        externalConversationId: result.externalConversationId,
        telegramChatId: meta.chatId,
        telegramUserId: result.externalUserId,
        locale: result.locale,
        origin: request.nextUrl.origin,
        now,
      }).catch((error) => {
        console.error('Telegram intake link creation failed:', error);
        return null;
      });

      if (intakeLink) {
        assistantReplyText = buildIntakeOfferText(result.locale);
        await sendTelegramMessage({
          chatId: meta.chatId,
          text: assistantReplyText,
          replyMarkup: {
            inline_keyboard: [[
              {
                text: getIntakeButtonLabel(result.locale),
                url: intakeLink.url,
              },
            ]],
          },
        }).catch((error) => {
          console.error('Telegram intake link delivery failed:', error);
        });
      }
    }

    if (!assistantReplyText && canRunAssistant && canAnswerWithAssistant) {
      const assistantReply = await runAssistantTurn(prisma, {
        caseId: result.caseId,
        channel: CaseOriginChannel.TELEGRAM,
        locale: result.locale,
        latestMessageId: result.customerMessageId,
        latestCustomerMessage: body,
        publicRequestNumber: result.hasStoredTelegramContact
          ? result.publicRequestNumber
          : shouldAttachStatusAction(body)
            ? result.publicRequestNumber
            : null,
        messengerKnownContact: result.hasStoredTelegramContact,
        capabilities: ['inline_buttons'],
      }).catch((error) => {
        console.error('Telegram AI assistant turn failed:', error);
        return null;
      });

      if (assistantReply?.text) {
        assistantReplyText = assistantReply.text;
        const shouldShowCreateRequestButton =
          result.hasStoredTelegramContact &&
          assistantReply.actions.some((action) => action.type === 'show_intake');
        const shouldShowAssistantStatusButton =
          assistantReply.actions.some((action) => action.type === 'show_status');
        const shouldShowStatusButton =
          !shouldShowCreateRequestButton &&
          Boolean(result.publicRequestNumber) &&
          (shouldShowAssistantStatusButton || shouldAttachStatusAction(body));
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
          replyMarkup: shouldShowCreateRequestButton
            ? {
                inline_keyboard: [[
                  {
                    text: getConfirmNewRequestButtonLabel(result.locale),
                    callback_data: CONFIRM_NEW_REQUEST_CALLBACK,
                  },
                ]],
              }
            : statusUrl
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
