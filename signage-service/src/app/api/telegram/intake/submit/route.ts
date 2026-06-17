import { NextRequest, NextResponse } from 'next/server';

import { sendAdminTelegramNotification } from '@/lib/admin-telegram-notifications';
import {
  AttachmentValidationError,
  deleteAttachment,
  storeAttachment,
  type StoredAttachmentInput,
} from '@/lib/attachments';
import { redactPiiForAi } from '@/lib/ai/pii-redaction';
import { parseOptionalContactDetails } from '@/lib/contact-policy';
import { sendPortalActivationInviteEmail } from '@/lib/email/portal-claim-email';
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
  email: 160,
  phone: 160,
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
  hasPortalClaim: boolean;
  activationInviteSent: boolean;
}): string {
  const portalLine = input.hasPortalClaim
    ? input.activationInviteSent
      ? {
          ru: 'Письмо для активации личного кабинета отправлено. Кабинет также можно открыть кнопкой ниже.',
          en: 'The customer portal activation email has been sent. You can also open the portal with the button below.',
          tr: 'Musteri portali aktivasyon e-postasi gonderildi. Portali asagidaki dugmeyle de acabilirsiniz.',
          pl: 'E-mail aktywacyjny do panelu klienta zostal wyslany. Panel mozna tez otworzyc przyciskiem ponizej.',
          ar: 'تم إرسال بريد تفعيل بوابة العميل. يمكنك أيضاً فتح البوابة من الزر أدناه.',
          de: 'Die E-Mail zur Aktivierung des Kundenportals wurde gesendet. Das Portal koennen Sie auch ueber die Taste unten oeffnen.',
        }
      : {
          ru: 'Для долгосрочного доступа активируйте личный кабинет кнопкой ниже.',
          en: 'For long-term access, activate the customer portal with the button below.',
          tr: 'Uzun sureli erisim icin musteri portalini asagidaki dugmeyle etkinlestirin.',
          pl: 'Aby zachowac dlugoterminowy dostep, aktywuj panel klienta przyciskiem ponizej.',
          ar: 'للوصول طويل الأمد، فعّل بوابة العميل من الزر أدناه.',
          de: 'Fuer dauerhaften Zugriff aktivieren Sie das Kundenportal ueber die Taste unten.',
        }
    : null;

  switch (input.locale) {
    case 'ru':
      return [
        'Спасибо, ваша заявка получена.',
        '',
        `Номер: ${input.publicRequestNumber}`,
        'Статус можно проверить по ссылке ниже. Диалог можно продолжить здесь, в Telegram.',
        portalLine?.ru,
      ].join('\n');
    case 'en':
      return [
        'Thank you, your request has been received.',
        '',
        `Number: ${input.publicRequestNumber}`,
        'Status can be checked by the link below. The conversation can continue here in Telegram.',
        portalLine?.en,
      ].join('\n');
    case 'tr':
      return [
        'Tesekkurler, talebiniz alindi.',
        '',
        `Numara: ${input.publicRequestNumber}`,
        'Durum asagidaki baglantidan kontrol edilebilir. Gorusme burada, Telegram icinde devam edebilir.',
        portalLine?.tr,
      ].join('\n');
    case 'pl':
      return [
        'Dziekujemy, zgloszenie zostalo przyjete.',
        '',
        `Numer: ${input.publicRequestNumber}`,
        'Status mozna sprawdzic przez ponizszy link. Rozmowe mozna kontynuowac tutaj, w Telegramie.',
        portalLine?.pl,
      ].join('\n');
    case 'ar':
      return [
        'تم استلام طلبك.',
        '',
        `الرقم: ${input.publicRequestNumber}`,
        'يمكن التحقق من الحالة عبر الرابط أدناه. ويمكن متابعة المحادثة هنا في Telegram.',
        portalLine?.ar,
      ].join('\n');
    case 'de':
    default:
      return [
        'Danke, Ihre Anfrage ist angekommen.',
        '',
        `Nummer: ${input.publicRequestNumber}`,
        'Den Status koennen Sie ueber den Link unten pruefen. Der Dialog kann hier in Telegram weitergehen.',
        portalLine?.de,
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

function getPortalButtonLabel(locale: string, hasEmail: boolean): string {
  switch (locale) {
    case 'ru':
      return hasEmail ? 'Открыть кабинет' : 'Активировать кабинет';
    case 'en':
      return hasEmail ? 'Open portal' : 'Activate portal';
    case 'tr':
      return hasEmail ? 'Portali ac' : 'Portali etkinlestir';
    case 'pl':
      return hasEmail ? 'Otworz panel' : 'Aktywuj panel';
    case 'ar':
      return hasEmail ? 'فتح البوابة' : 'تفعيل البوابة';
    case 'de':
    default:
      return hasEmail ? 'Portal oeffnen' : 'Kundenportal aktivieren';
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
    const email = readText(formData, 'email', FIELD_LIMITS.email);
    const phone = readText(formData, 'phone', FIELD_LIMITS.phone);
    const serviceLocation = readText(formData, 'location', FIELD_LIMITS.location);
    const serviceLocationSource = readLocationSource(
      readText(formData, 'locationSource', FIELD_LIMITS.locationSource)
    );
    const issueType = readText(formData, 'issueType', FIELD_LIMITS.issueType);
    const message = readText(formData, 'message', FIELD_LIMITS.message);
    const serviceLatitude = readCoordinate(formData.get('locationLatitude'), -90, 90);
    const serviceLongitude = readCoordinate(formData.get('locationLongitude'), -180, 180);

    if (!token || !message) {
      return NextResponse.json(
        { error: 'Please provide a valid form link and message.' },
        { status: 400 }
      );
    }

    const submittedContact = parseOptionalContactDetails({ contact, email, phone });

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
      email,
      phone,
      serviceLocation,
      serviceLatitude,
      serviceLongitude,
      serviceLocationSource,
      issueType,
      message,
      attachments: storedAttachments,
      origin: request.headers.get('origin') || request.nextUrl.origin,
    });

    let activationInviteSent = false;
    if (submittedContact.customerEmail && result.portalClaimUrl && result.portalClaimExpiresAt) {
      try {
        const delivery = await sendPortalActivationInviteEmail({
          to: submittedContact.customerEmail,
          claimUrl: result.portalClaimUrl,
          expiresAt: new Date(result.portalClaimExpiresAt),
          publicRequestNumber: result.publicRequestNumber,
          locale: result.locale,
        });
        activationInviteSent = delivery.sent;
      } catch {
        console.error('Telegram portal activation invite email failed:', {
          caseId: result.caseId,
          publicRequestNumber: result.publicRequestNumber,
        });
      }
    }

    const keyboard = [
      [{ text: getStatusButtonLabel(result.locale), url: result.statusUrl }],
      ...(result.portalClaimUrl
        ? [[{ text: getPortalButtonLabel(result.locale, Boolean(submittedContact.customerEmail)), url: result.portalClaimUrl }]]
        : []),
      ...(result.telegramReturnUrl
        ? [[{ text: getContinueButtonLabel(result.locale), url: result.telegramReturnUrl }]]
        : []),
    ];

    await sendTelegramMessage({
      chatId: result.telegramChatId,
      text: buildConfirmationText({
        locale: result.locale,
        publicRequestNumber: result.publicRequestNumber,
        hasPortalClaim: Boolean(result.portalClaimUrl),
        activationInviteSent,
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
      contactLabel: submittedContact.customerEmail || submittedContact.customerPhone
        ? 'Contact provided'
        : 'Telegram chat',
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
      portalClaimUrl: result.portalClaimUrl,
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
