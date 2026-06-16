import { NextRequest, NextResponse } from 'next/server';

import { sendAdminTelegramNotification } from '@/lib/admin-telegram-notifications';
import {
  AttachmentValidationError,
  deleteAttachment,
  storeAttachment,
  type StoredAttachmentInput,
} from '@/lib/attachments';
import { redactPiiForAi } from '@/lib/ai/pii-redaction';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIP, type RateLimitConfig } from '@/lib/rate-limit';
import { publishCaseRealtimeEvent } from '@/lib/realtime';
import { buildLocalePath } from '@/lib/seo';
import { TelegramIntakeError, getTelegramIntakeLinkState, submitTelegramIntake } from '@/lib/telegram-intake';
import { sendTelegramMessage } from '@/lib/telegram';

const TELEGRAM_INTAKE_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 10 * 60 * 1000,
  prefix: 'telegram-intake',
};

const FIELD_LIMITS = {
  token: 256,
  name: 160,
  contact: 160,
  location: 500,
  locationSource: 40,
  issueType: 120,
  message: 5000,
};

function readText(formData: FormData, key: string, maxLength: number): string {
  const value = String(formData.get(key) ?? '').trim();

  if (value.length > maxLength) {
    throw new TelegramIntakeError(
      'field_too_long',
      `${key} is too long.`,
      400
    );
  }

  return value;
}

function readCoordinate(value: FormDataEntryValue | null, min: number, max: number): number | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

function readLocationSource(value: string): string | null {
  return value === 'photon' ? 'photon' : null;
}

function buildConfirmationText(input: {
  locale: string;
  publicRequestNumber: string;
}): string {
  switch (input.locale) {
    case 'ru':
      return [
        'Спасибо, ваша заявка получена.',
        '',
        `Номер: ${input.publicRequestNumber}`,
        'Менеджер продолжит общение здесь, в Telegram.',
      ].join('\n');
    case 'en':
      return [
        'Thank you, your request has been received.',
        '',
        `Number: ${input.publicRequestNumber}`,
        'A manager can continue the conversation here in Telegram.',
      ].join('\n');
    case 'tr':
      return [
        'Tesekkurler, talebiniz alindi.',
        '',
        `Numara: ${input.publicRequestNumber}`,
        'Yonetici gorusmeye burada, Telegram icinde devam edebilir.',
      ].join('\n');
    case 'pl':
      return [
        'Dziekujemy, zgloszenie zostalo przyjete.',
        '',
        `Numer: ${input.publicRequestNumber}`,
        'Menedzer moze kontynuowac rozmowe tutaj, w Telegramie.',
      ].join('\n');
    case 'ar':
      return [
        'تم استلام طلبك.',
        '',
        `الرقم: ${input.publicRequestNumber}`,
        'يمكن للمدير متابعة المحادثة هنا في Telegram.',
      ].join('\n');
    case 'de':
    default:
      return [
        'Danke, Ihre Anfrage ist angekommen.',
        '',
        `Nummer: ${input.publicRequestNumber}`,
        'Ein Manager kann hier im Telegram-Chat weiter antworten.',
      ].join('\n');
  }
}

function getStatusButtonLabel(locale: string): string {
  switch (locale) {
    case 'ru':
      return 'Открыть статус';
    case 'en':
      return 'Open status';
    case 'tr':
      return 'Durumu ac';
    case 'pl':
      return 'Otworz status';
    case 'ar':
      return 'فتح الحالة';
    case 'de':
    default:
      return 'Status oeffnen';
  }
}

function getContinueButtonLabel(locale: string): string {
  switch (locale) {
    case 'ru':
      return 'Продолжить в чате';
    case 'en':
      return 'Continue in chat';
    case 'tr':
      return 'Sohbete don';
    case 'pl':
      return 'Wroc do czatu';
    case 'ar':
      return 'العودة إلى الدردشة';
    case 'de':
    default:
      return 'Im Chat fortfahren';
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const limit = checkRateLimit(ip, TELEGRAM_INTAKE_LIMIT);
  let storedAttachments: StoredAttachmentInput[] = [];

  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.resetMs / 1000)) } }
    );
  }

  try {
    const formData = await request.formData();
    const token = readText(formData, 'token', FIELD_LIMITS.token);
    const name = readText(formData, 'name', FIELD_LIMITS.name);
    const contact = readText(formData, 'contact', FIELD_LIMITS.contact);
    const serviceLocation = readText(formData, 'location', FIELD_LIMITS.location);
    const serviceLocationSource = readLocationSource(
      readText(formData, 'locationSource', FIELD_LIMITS.locationSource)
    );
    const issueType = readText(formData, 'issueType', FIELD_LIMITS.issueType);
    const message = readText(formData, 'message', FIELD_LIMITS.message);
    const serviceLatitude = readCoordinate(formData.get('locationLatitude'), -90, 90);
    const serviceLongitude = readCoordinate(formData.get('locationLongitude'), -180, 180);

    if (!token || !contact || !message) {
      return NextResponse.json(
        { error: 'Please provide a valid form link, contact and message.' },
        { status: 400 }
      );
    }

    const linkState = await getTelegramIntakeLinkState(prisma, token);
    if (linkState.status !== 'valid') {
      const status = linkState.status === 'submitted' ? 409 : linkState.status === 'expired' ? 410 : 404;
      return NextResponse.json(
        { error: 'This Telegram intake link is no longer valid.', code: `link_${linkState.status}` },
        { status }
      );
    }

    const fileEntries = formData
      .getAll('files')
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (fileEntries.length > 0) {
      storedAttachments = await Promise.all(fileEntries.map((file) => storeAttachment(file)));
    }

    const result = await submitTelegramIntake(prisma, {
      token,
      name,
      contact,
      serviceLocation,
      serviceLatitude,
      serviceLongitude,
      serviceLocationSource,
      issueType,
      message,
      attachments: storedAttachments,
    });

    const keyboard = [
      [{ text: getStatusButtonLabel(result.locale), url: result.statusUrl }],
      ...(result.telegramReturnUrl
        ? [[{ text: getContinueButtonLabel(result.locale), url: result.telegramReturnUrl }]]
        : []),
    ];

    await sendTelegramMessage({
      chatId: result.telegramChatId,
      text: buildConfirmationText({
        locale: result.locale,
        publicRequestNumber: result.publicRequestNumber,
      }),
      replyMarkup: { inline_keyboard: keyboard },
    }).catch((error) => {
      console.error('Telegram intake confirmation delivery failed:', error);
    });

    await publishCaseRealtimeEvent({
      caseId: result.caseId,
      reason: 'message.created',
    }).catch((error) => {
      console.error('Telegram intake realtime publish failed:', error);
    });

    await sendAdminTelegramNotification({
      kind: 'website_request_created',
      caseId: result.caseId,
      publicRequestNumber: result.publicRequestNumber,
      customerName: null,
      contactLabel: 'Contact provided',
      originLabel: 'Telegram secure form',
      messagePreview: [
        redactPiiForAi(message),
        serviceLocation ? 'Location provided' : null,
        result.photoReceived ? 'Photo/video provided' : null,
      ].filter(Boolean).join('\n'),
      isNewCase: false,
    }).catch((telegramError) => {
      console.error('Admin Telegram intake notification failed:', telegramError);
    });

    return NextResponse.json({
      success: true,
      publicRequestNumber: result.publicRequestNumber,
      returnPath: buildLocalePath(result.locale, `/telegram/return?r=${encodeURIComponent(result.returnNonce)}`),
      telegramReturnUrl: result.telegramReturnUrl,
    });
  } catch (error) {
    await Promise.allSettled(storedAttachments.map((attachment) => deleteAttachment(attachment)));

    if (error instanceof TelegramIntakeError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }

    if (
      error instanceof Error &&
      error.message.startsWith('Please provide a valid email address or phone number')
    ) {
      return NextResponse.json(
        { error: 'Please provide a valid email address or phone number.' },
        { status: 400 }
      );
    }

    console.error('Telegram intake submit error:', error);

    const isBadRequest = error instanceof AttachmentValidationError;
    return NextResponse.json(
      {
        error: isBadRequest
          ? error.message
          : 'Internal server error',
      },
      { status: isBadRequest ? 400 : 500 }
    );
  }
}
