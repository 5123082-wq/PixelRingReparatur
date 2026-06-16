import { CaseOriginChannel, MessageAuthorRole, PrismaClient } from '@prisma/client';
import { SessionScope } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { CASE_SESSION_COOKIE_NAME } from '@/lib/case-session';
import {
  CHAT_MESSAGE_LIMIT,
  checkRateLimit,
  getClientIP,
} from '@/lib/rate-limit';

import {
  classifyIntakeTurn,
  generateChatReply,
  stripReservedActionMarkers,
} from '@/lib/ai/chat-engine';
import {
  isAcceptingIntakeDecision,
  type IntakeTurnDecision,
} from '@/lib/ai/intake-intent-core';
import { resolveChatSession } from '@/lib/ai/chat-session';
import {
  buildPiiPresenceContext,
  redactPiiForAi,
  redactPiiFromText,
} from '@/lib/ai/pii-redaction';
import {
  getSessionIntakeDraft,
  mergeDraftPii,
  upsertSessionIntakeDraft,
} from '@/lib/ai/intake-draft';
import {
  AttachmentValidationError,
  deleteAttachment,
  storeAttachment,
  type StoredAttachmentInput,
} from '@/lib/attachments';

type ChatMessageResponse = {
  id: string;
  authorRole: MessageAuthorRole;
  channel: CaseOriginChannel;
  body: string;
  isCustomerVisible: boolean;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
  attachments?: { id: string; storageKey: string; originalFilename: string | null; mimeType?: string | null }[];
  requestRegistration?: {
    publicRequestNumber: string;
    portalClaimUrl?: string;
    portalClaimExpiresAt?: string;
  };
};

type ChatIntakePrefill = {
  issueType?: string;
  contact?: string;
  contactMode?: 'phone' | 'email';
  name?: string;
  location?: string;
  summary?: string;
  hasSessionAttachments?: boolean;
  needsPhoto?: boolean;
  hasKnownSessionContact?: boolean;
};

type ChatIntakeDraft = {
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  serviceLocation: string | null;
  issueType: string | null;
  summary: string | null;
  locale: string | null;
} | null;

type ChatIntakeMode = 'full_form' | 'confirm_existing_contact';

const MAX_CHAT_MESSAGE_LENGTH = 4000;
const PORTAL_CLAIM_LINK_TTL_MS = 24 * 60 * 60 * 1000;
const EMAIL_IN_TEXT_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_IN_TEXT_RE = /(?:\+?\d[\d\s().-]{6,}\d)/;
const LOW_SIGNAL_NEW_PROBLEM_RE =
  /^(?:у\s+меня\s+)?(?:новая|новый|новое)\s+проблем[аы]?\.?$|^(?:i\s+have\s+)?(?:a\s+)?new\s+(?:problem|issue)\.?$|^(?:ich\s+habe\s+)?(?:ein\s+)?neues?\s+problem\.?$/i;
const FILE_ONLY_MESSAGE_RE =
  /^(?:foto|photo|bild|image|фото|фотография|картинка|видео)(?:\s+(?:нет|no|none|keins?|ohne))?[.!?\s]*$/i;
const FORM_OPEN_FOLLOWUP_RE =
  /как\s+открыть|откр(?:ой|ыть|ывай|ываем)|где\s+форм|форма\s+не|ссылк.*форм|open.*form|where.*form|form.*link/i;
const ISSUE_KEYWORDS: Array<{ issueType: string; patterns: RegExp[] }> = [
  { issueType: 'Reparatur', patterns: [/repar/i, /ремонт/i, /kaputt/i, /broken/i, /defekt/i, /сломал/i, /сломалась/i, /не\s+работ/i, /почин/i, /упал/i, /упала/i, /разбил/i, /опасн/i, /fallen/i, /heruntergefallen/i] },
  { issueType: 'Montage', patterns: [/montage/i, /install/i, /установ/i, /монтаж/i] },
  { issueType: 'Neue Beschilderung', patterns: [/neue beschilderung/i, /new sign/i, /нов(?:ая|ую|ой|ые|ый)?\s+(?:вывес|таблич|реклам)/i] },
  { issueType: 'Branding', patterns: [/branding/i, /бренд/i] },
  { issueType: 'Lichterwerbung', patterns: [/lichterwerbung/i, /light/i, /led/i, /вывес/i, /букв/i, /свет/i, /подсвет/i, /мерца/i, /flicker/i, /flacker/i] },
  { issueType: 'Wartung', patterns: [/wartung/i, /maintenance/i, /обслуж/i] },
];

function buildInitialGreeting(locale?: string): string {
  switch (locale) {
    case 'en':
      return 'Hello. I am the PixelRing virtual assistant. Tell me what happened with your sign, illuminated advertising, storefront, or service object.';
    case 'ru':
      return 'Здравствуйте. Я виртуальный ассистент PixelRing. Напишите, что произошло с вывеской, световой рекламой, витриной или другим сервисным объектом.';
    case 'tr':
      return 'Merhaba. Ben PixelRing sanal asistanıyım. Tabela, ışıklı reklam, vitrin veya servis nesnesinde ne olduğunu kısaca yazın.';
    case 'pl':
      return 'Dzień dobry. Jestem wirtualnym asystentem PixelRing. Napisz, co stało się z szyldem, reklamą świetlną, witryną albo innym obiektem serwisowym.';
    case 'ar':
      return 'مرحباً. أنا المساعد الافتراضي لـ PixelRing. أخبرني ما الذي حدث للافتة أو الإعلان المضيء أو الواجهة أو عنصر الخدمة.';
    case 'de':
    default:
      return 'Hallo. Ich bin der virtuelle Assistent von PixelRing. Schreiben Sie kurz, was mit Ihrer Werbeanlage, Beschilderung, Leuchtreklame oder dem Serviceobjekt passiert ist.';
  }
}

function serializeMessage(message: {
  id: string;
  authorRole: MessageAuthorRole;
  channel: CaseOriginChannel;
  body: string;
  isCustomerVisible: boolean;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  attachments: { id: string; storageKey: string; originalFilename: string | null; mimeType?: string | null }[];
  requestRegistration?: {
    publicRequestNumber: string;
    portalClaimUrl?: string;
    portalClaimExpiresAt?: string;
  };
}): ChatMessageResponse {
  return {
    id: message.id,
    authorRole: message.authorRole,
    channel: message.channel,
    body: message.body,
    isCustomerVisible: message.isCustomerVisible,
    sentAt: message.sentAt ? message.sentAt.toISOString() : null,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
    attachments: message.attachments,
    requestRegistration: message.requestRegistration,
  };
}

function parseRegisteredRequestNumber(value: string): string | null {
  return value.match(/Anfrage erfolgreich registriert\. Nummer:\s*([A-Z]{2,8}-[A-Z0-9]{4}-[A-Z0-9]{4})/i)?.[1]?.toUpperCase() ?? null;
}

function parsePortalClaimUrl(value: string): string | null {
  const rawUrl = value.match(/(?:Kundenportal-Link:\s*)?(https?:\/\/[^\s)]*\/portal\/claim\?token=[^\s)]+)/i)?.[1];

  return rawUrl ? rawUrl.replace(/[.,;]+$/, '') : null;
}

function isLikelyContactOnly(value: string): boolean {
  const trimmed = value.trim();
  return EMAIL_IN_TEXT_RE.test(trimmed) || PHONE_IN_TEXT_RE.test(trimmed);
}

function isLowSignalIntakeSummary(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  const hasProblemSignal = Boolean(inferIssueTypeFromText(trimmed));

  return (
    trimmed.length < 6 ||
    LOW_SIGNAL_NEW_PROBLEM_RE.test(trimmed) ||
    isAffirmativeIntakeConsent(trimmed) ||
    isFormOpeningFollowup(trimmed) ||
    isLikelyContactOnly(trimmed) ||
    (/заяв|статус|request|status|anfrag/i.test(trimmed) && !hasProblemSignal) ||
    /^(привет|здравств|hello|hi|hey|hallo|guten tag|добрый день)([!,.?\s]|$)/i.test(trimmed) ||
    FILE_ONLY_MESSAGE_RE.test(trimmed)
  );
}

function isExplicitRequestCreationIntent(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  return [
    /созда(?:й|йте|ть).*заяв/i,
    /оформ(?:и|ите|ить).*заяв/i,
    /отправ(?:ь|ьте|ить).*заяв/i,
    /подготов(?:ь|ьте|ить).*форм/i,
    /давайте.*заяв/i,
    /можно.*заяв/i,
    /готов.*(?:заяв|форм)/i,
    /create.*request/i,
    /submit.*request/i,
    /start.*service/i,
    /prepare.*form/i,
    /anfrage.*(?:erstellen|senden|starten|vorbereiten)/i,
    /service.*starten/i,
  ].some((pattern) => pattern.test(normalized));
}

function isFormOpeningFollowup(value: string): boolean {
  return FORM_OPEN_FOLLOWUP_RE.test(value.trim().toLowerCase());
}

function isAffirmativeIntakeConsent(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  return /^(да|давай|давайте|да\s+давай(?:те)?|готов|готова|ок|okay|ok|yes|yep|ja|bitte|gerne|go ahead)[!.\s]*$/i.test(normalized);
}

function latestAssistantOfferedIntake(
  messages: Awaited<ReturnType<typeof loadSessionMessages>>
): boolean {
  const latestAssistantMessage = getLatestAssistantMessageBeforeLatestCustomer(messages)
    ?.toLowerCase();

  if (!latestAssistantMessage) {
    return false;
  }

  return [
    /могу.*создать.*заяв/i,
    /могу.*подготовить.*форм/i,
    /помочь.*создать.*заяв/i,
    /хотите.*создать.*заяв/i,
    /создать.*заяв.*\?/i,
    /хотите.*продолж/i,
    /готовы.*открыть.*форм/i,
    /собрать.*контакт.*дан/i,
    /защищ.*форм/i,
    /открыть.*форм/i,
    /откройте.*форм/i,
    /ссылк.*форм/i,
    /\[открыть\s+форму\]\(#\)/i,
    /подготов.*форм/i,
    /откр.*форм/i,
    /can.*(?:create|prepare).*request/i,
    /can.*help.*(?:request|form)/i,
    /prepare.*form/i,
    /open.*form/i,
    /ich kann.*anfrage/i,
    /ich kann.*formular/i,
    /formular.*(?:oeffnen|öffnen|vorbereiten)/i,
  ].some((pattern) => pattern.test(latestAssistantMessage));
}

function getLatestAssistantMessageBeforeLatestCustomer(
  messages: Awaited<ReturnType<typeof loadSessionMessages>>
): string | null {
  const latestCustomerIndex = messages.findLastIndex(
    (message) => message.authorRole === MessageAuthorRole.CUSTOMER
  );
  const messagesBeforeLatestCustomer =
    latestCustomerIndex >= 0 ? messages.slice(0, latestCustomerIndex) : messages;

  return [...messagesBeforeLatestCustomer]
    .reverse()
    .find((message) => message.authorRole === MessageAuthorRole.SYSTEM)
    ?.body ?? null;
}

function isInternalPortalAccessMessage(value: string): boolean {
  return /Kundenportal-Link:|\/portal\/claim\?token=|\[Открыть форму\]\(#\)|Вот ссылка на форму/i.test(value);
}

function sanitizeAiHistoryBody(value: string): string {
  return stripReservedActionMarkers(
    redactPiiForAi(
      value
        .replace(/<<SHOW_LANGUAGE_SELECTOR>>/g, '')
        .replace(/https?:\/\/[^\s)]*\/portal\/claim\?token=[^\s)]*/gi, '[PORTAL_LINK_REMOVED]')
        .trim()
    )
  );
}

function buildSecureFormOpeningReply(locale?: string): string {
  switch (locale) {
    case 'en':
      return 'Done. I am opening the secure form in this chat. Please add the missing contact details there.';
    case 'ru':
      return 'Отлично. Открываю защищённую форму прямо в этом чате. Недостающие контактные данные можно указать в ней.';
    case 'tr':
      return 'Tamam. Guvenli formu bu sohbetin icinde aciyorum. Eksik iletisim bilgilerini oraya girebilirsiniz.';
    case 'pl':
      return 'Dobrze. Otwieram bezpieczny formularz bezposrednio w tym czacie. Brakujace dane kontaktowe mozna wpisac w formularzu.';
    case 'ar':
      return 'حسناً. سأفتح النموذج الآمن داخل هذه الدردشة. يمكن إدخال بيانات التواصل الناقصة هناك.';
    case 'de':
    default:
      return 'Alles klar. Ich oeffne das sichere Formular direkt in diesem Chat. Fehlende Kontaktdaten koennen Sie dort eintragen.';
  }
}

function latestAssistantOpenedSecureForm(
  messages: Awaited<ReturnType<typeof loadSessionMessages>>
): boolean {
  const latestMessage = [...messages]
    .reverse()
    .find((message) => !message.body.startsWith('[SILENT]'));

  return Boolean(
    latestMessage?.authorRole === MessageAuthorRole.SYSTEM &&
      /открываю\s+защищ|opening the secure form|oeffne das sichere Formular|öffne das sichere Formular|guvenli formu|bezpieczny formularz|النموذج الآمن/i.test(latestMessage.body)
  );
}

function inferIssueTypeFromText(value: string): string | undefined {
  for (const item of ISSUE_KEYWORDS) {
    if (item.patterns.some((pattern) => pattern.test(value))) {
      return item.issueType;
    }
  }

  return undefined;
}

function getCurrentIntakeWindow(
  messages: Awaited<ReturnType<typeof loadSessionMessages>>
): Awaited<ReturnType<typeof loadSessionMessages>> {
  const lastRegistrationIndex = messages.findLastIndex(
    (message) =>
      message.authorRole === MessageAuthorRole.SYSTEM &&
      /Anfrage erfolgreich registriert\. Nummer:/i.test(message.body)
  );

  return lastRegistrationIndex >= 0
    ? messages.slice(lastRegistrationIndex + 1)
    : messages;
}

function isStatusOrAccountQuestion(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  return [
    /сколько.*заяв/i,
    /какие.*заяв/i,
    /статус/i,
    /номер.*заяв/i,
    /мои.*заяв/i,
    /how many.*requests?/i,
    /my requests?/i,
    /request status/i,
    /status/i,
    /wie viele.*anfrag/i,
    /meine.*anfrag/i,
    /status/i,
  ].some((pattern) => pattern.test(normalized));
}

function buildIntakePrefill(
  messages: Awaited<ReturnType<typeof loadSessionMessages>>,
  markerPrefill?: ChatIntakePrefill | null,
  sessionContact?: {
    contactMethod: string | null;
    contactValue: string | null;
  },
  draft?: ChatIntakeDraft
): ChatIntakePrefill {
  const currentMessages = getCurrentIntakeWindow(messages);
  const customerMessages = currentMessages.filter(
    (message) => message.authorRole === MessageAuthorRole.CUSTOMER
  );
  const customerText = customerMessages.map((message) => message.body).join('\n');
  const sessionContactMode =
    sessionContact?.contactMethod === 'EMAIL'
      ? 'email'
      : sessionContact?.contactMethod === 'PHONE'
        ? 'phone'
        : undefined;
  const hasSessionAttachments = currentMessages.some(
    (message) => message.attachments.length > 0
  );
  const summarySource = [...customerMessages]
    .reverse()
    .find((message) => !isLowSignalIntakeSummary(message.body))
    ?.body
    .trim();

  return {
    ...markerPrefill,
    issueType:
      draft?.issueType ||
      markerPrefill?.issueType ||
      inferIssueTypeFromText(customerText) ||
      undefined,
    contact:
      draft?.customerEmail ||
      draft?.customerPhone ||
      sessionContact?.contactValue ||
      undefined,
    contactMode:
      draft?.customerEmail
        ? 'email'
        : draft?.customerPhone
          ? 'phone'
          : sessionContactMode,
    name: draft?.customerName || undefined,
    location: draft?.serviceLocation || undefined,
    summary: draft?.summary || markerPrefill?.summary || summarySource || undefined,
    hasSessionAttachments,
    needsPhoto: !hasSessionAttachments,
    hasKnownSessionContact: Boolean(
      draft?.customerEmail ||
        draft?.customerPhone ||
        sessionContact?.contactValue
    ),
  };
}

function shouldSuggestIntake(
  prefill: ChatIntakePrefill,
  latestCustomerMessage: string | null | undefined,
  messages: Awaited<ReturnType<typeof loadSessionMessages>>,
  markerSuggested: boolean,
  intakeTurnDecision?: IntakeTurnDecision | null
): boolean {
  if (latestCustomerMessage && isStatusOrAccountQuestion(latestCustomerMessage)) {
    return false;
  }

  const hasConsent =
    isAcceptingIntakeDecision(intakeTurnDecision) ||
    (latestCustomerMessage &&
      (isExplicitRequestCreationIntent(latestCustomerMessage) ||
        (isFormOpeningFollowup(latestCustomerMessage) && latestAssistantOfferedIntake(messages)) ||
        (isAffirmativeIntakeConsent(latestCustomerMessage) && latestAssistantOfferedIntake(messages))));

  if (
    latestCustomerMessage &&
    isLowSignalIntakeSummary(latestCustomerMessage) &&
    !hasConsent
  ) {
    return false;
  }

  return Boolean(prefill.summary && (markerSuggested || hasConsent));
}

function getIntakeMode(prefill: ChatIntakePrefill): ChatIntakeMode {
  return prefill.hasKnownSessionContact && prefill.summary && prefill.issueType
    ? 'confirm_existing_contact'
    : 'full_form';
}

async function loadSessionMessages(
  db: PrismaClient,
  sessionId: string,
  caseId: string | null
) {
  const caseIds = new Set<string>();
  if (caseId) caseIds.add(caseId);

  const sessionRelatedCases = await db.message.findMany({
    where: { sessionId, isCustomerVisible: true },
    select: { caseId: true },
    distinct: ['caseId'],
  });
  sessionRelatedCases.forEach(r => { if (r.caseId) caseIds.add(r.caseId); });

  const where = {
    isCustomerVisible: true,
    OR: [
      { sessionId },
      { caseId: { in: Array.from(caseIds) } },
    ],
  };

  const messages = await db.message.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      authorRole: true,
      channel: true,
      body: true,
      isCustomerVisible: true,
      sentAt: true,
      createdAt: true,
      updatedAt: true,
      caseId: true,
      sessionId: true,
      attachments: {
        select: {
          id: true,
          storageKey: true,
          originalFilename: true,
          mimeType: true,
        }
      }
    },
  });

  const now = Date.now();
  const portalClaimByCaseId = new Map<string, { portalClaimUrl: string; portalClaimExpiresAt: string }>();

  for (const message of messages) {
    if (!message.caseId || message.authorRole !== MessageAuthorRole.SYSTEM) continue;

    const portalClaimUrl = parsePortalClaimUrl(message.body);
    if (!portalClaimUrl) continue;

    const issuedAt = message.sentAt ?? message.createdAt;
    const expiresAt = new Date(issuedAt.getTime() + PORTAL_CLAIM_LINK_TTL_MS);
    if (expiresAt.getTime() <= now) continue;

    portalClaimByCaseId.set(message.caseId, {
      portalClaimUrl,
      portalClaimExpiresAt: expiresAt.toISOString(),
    });
  }

  return messages
    .filter(
      (message) =>
        message.authorRole !== MessageAuthorRole.SYSTEM ||
        !isInternalPortalAccessMessage(message.body)
    )
    .map((message) => {
      const publicRequestNumber =
        message.authorRole === MessageAuthorRole.SYSTEM
          ? parseRegisteredRequestNumber(message.body)
          : null;
      const portalClaim =
        publicRequestNumber && message.caseId
          ? portalClaimByCaseId.get(message.caseId)
          : undefined;

      return {
        ...message,
        requestRegistration: publicRequestNumber
          ? {
              publicRequestNumber,
              ...portalClaim,
            }
          : undefined,
      };
    });
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(CASE_SESSION_COOKIE_NAME)?.value ?? null;
    const locale = request.nextUrl.searchParams.get('locale')?.trim() || undefined;
    const resolved = await resolveChatSession(prisma, token, {
      createIfMissing: true,
      userAgent: request.headers.get('user-agent'),
      ipAddress: getClientIP(request),
    });

    if (!resolved) {
      return NextResponse.json({
        success: true,
        operatorTakeover: false,
        messages: [],
      });
    }

    const session = resolved.session;
    let messages = await loadSessionMessages(prisma, session.id, session.caseId);

    if (messages.length === 0) {
      const now = new Date();
      // First message: Locale greeting
      await prisma.message.create({
        data: {
          caseId: session.caseId,
          sessionId: session.id,
          channel: CaseOriginChannel.WEBSITE_CHAT,
          authorRole: MessageAuthorRole.SYSTEM,
          body: buildInitialGreeting(locale),
          isCustomerVisible: true,
          sentAt: now,
        },
      });

      // Second message: Language selection
      await prisma.message.create({
        data: {
          caseId: session.caseId,
          sessionId: session.id,
          channel: CaseOriginChannel.WEBSITE_CHAT,
          authorRole: MessageAuthorRole.SYSTEM,
          body: 'Please choose your preferred language:',
          isCustomerVisible: true,
          sentAt: new Date(now.getTime() + 1000),
        },
      });

      messages = await loadSessionMessages(prisma, session.id, session.caseId);
    }

    const draft = await getSessionIntakeDraft(prisma, session.id);
    const intakePrefill = buildIntakePrefill(messages, null, session, draft);
    const response = NextResponse.json({
      success: true,
      operatorTakeover: session.operatorTakeover,
      messages: messages.map(serializeMessage),
      intakePrefill,
      intakeMode: getIntakeMode(intakePrefill),
      suggestIntake: !session.operatorTakeover && latestAssistantOpenedSecureForm(messages),
    });

    if (resolved.cookieToken) {
      response.cookies.set({
        name: CASE_SESSION_COOKIE_NAME,
        value: resolved.cookieToken,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 180,
      });
    }

    return response;
  } catch (error) {
    console.error('Chat history error:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to load chat history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const limit = checkRateLimit(ip, CHAT_MESSAGE_LIMIT);
  let storedAttachments: StoredAttachmentInput[] = [];

  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.resetMs / 1000)) } }
    );
  }

  try {
    let message = '';
    let locale = '';
    let silent = false;
    let files: File[] = [];

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      message = String(formData.get('message') ?? '').trim();
      locale = String(formData.get('locale') ?? '').trim();
      silent = formData.get('silent') === 'true';
      files = formData.getAll('files').filter((entry): entry is File => entry instanceof File && entry.size > 0);
    } else {
      const body = (await request.json().catch(() => null)) as
        | { message?: string; locale?: string; silent?: boolean; }
        | null;
      message = body?.message?.trim() ?? '';
      locale = body?.locale?.trim() ?? '';
      silent = !!body?.silent;
    }

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    if (message.length > MAX_CHAT_MESSAGE_LENGTH) {
      return NextResponse.json(
        { success: false, error: 'Message is too long' },
        { status: 400 }
      );
    }

    const token = request.cookies.get(CASE_SESSION_COOKIE_NAME)?.value ?? null;
    const resolved = await resolveChatSession(prisma, token, {
      createIfMissing: true,
      userAgent: request.headers.get('user-agent'),
      ipAddress: getClientIP(request),
    });

    if (!resolved) {
      return NextResponse.json(
        { success: false, error: 'Unable to create chat session' },
        { status: 500 }
      );
    }

    const { session, cookieToken } = resolved;
    if (files.length > 0) {
      storedAttachments = await Promise.all(
        files.map((file) => storeAttachment(file))
      );
    }

    const redactedMessage = redactPiiFromText(message);
    const messageForStorage = redactedMessage.redactedText || message;
    const summaryForDraft = !isLowSignalIntakeSummary(messageForStorage)
      ? messageForStorage
      : undefined;
    const issueTypeForDraft = inferIssueTypeFromText(messageForStorage);
    const now = new Date();

    await prisma.$transaction(async (tx) => {
      const dbMessage = await tx.message.create({
        data: {
          caseId: session.caseId,
          sessionId: session.id,
          channel: CaseOriginChannel.WEBSITE_CHAT,
          authorRole: MessageAuthorRole.CUSTOMER,
          body: silent ? `[SILENT] ${messageForStorage}` : messageForStorage,
          isCustomerVisible: true,
          sentAt: now,
        },
      });

      if (storedAttachments.length > 0) {
        await tx.attachment.createMany({
          data: storedAttachments.map(att => ({
            ...att,
            messageId: dbMessage.id,
            caseId: session.caseId,
            uploadedBySessionId: session.id,
            isCustomerVisible: true,
          })),
        });
      }

      await tx.session.update({
        where: { id: session.id },
        data: {
          lastSeenAt: now,
          scope: session.caseId ? SessionScope.CASE_ACCESS : SessionScope.ANONYMOUS_DRAFT,
        },
      });

      await upsertSessionIntakeDraft(tx, session.id, {
        ...redactedMessage.extracted,
        issueType: issueTypeForDraft,
        summary: summaryForDraft,
        locale,
      });
    });

    let reply: import('@/lib/ai/chat-engine').GenerateChatReplyResult | null = null;
    let intakeTurnDecision: IntakeTurnDecision | null = null;

    if (!session.operatorTakeover) {
      const messages = await loadSessionMessages(prisma, session.id, session.caseId);
      const history = messages
        .slice(0, -1)
        .filter((entry) => !isInternalPortalAccessMessage(entry.body))
        .map((entry) => ({
          role:
            entry.authorRole === MessageAuthorRole.CUSTOMER
               ? ('user' as const)
               : ('assistant' as const),
          body: sanitizeAiHistoryBody(entry.body),
        }));

      const aiMessage = files.length > 0
        ? `${messageForStorage}\n\n[System-Notiz: Der Benutzer hat ${files.length} Foto(s)/Datei(en) an diese Nachricht angehängt. Bestätige kurz, dass du die Fotos erhalten hast, auch wenn du sie noch nicht sehen kannst.]`
        : messageForStorage;

      // Fetch public request number for AI context
      let publicRequestNumber: string | null = null;
      if (session.caseId) {
        const c = await prisma.case.findUnique({
          where: { id: session.caseId },
          select: { publicRequestNumber: true }
        });
        publicRequestNumber = c?.publicRequestNumber || null;
      }

      // ONLY generate AI reply if the last message was from the customer.
      // This prevents the AI from responding to initial system greetings.
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.authorRole === MessageAuthorRole.CUSTOMER) {
        const draft = await getSessionIntakeDraft(prisma, session.id);
        const deterministicPrefill = buildIntakePrefill(messages, null, session, draft);
        const assistantOfferedIntake = latestAssistantOfferedIntake(messages);

        intakeTurnDecision = await classifyIntakeTurn({
          locale,
          latestCustomerMessage: messageForStorage,
          latestAssistantMessage: getLatestAssistantMessageBeforeLatestCustomer(messages),
          problemSummary: deterministicPrefill.summary,
          assistantOfferedIntake,
        });

        if (
          shouldSuggestIntake(
            deterministicPrefill,
            messageForStorage,
            messages,
            false,
            intakeTurnDecision
          )
        ) {
          reply = {
            text: buildSecureFormOpeningReply(locale),
            intent: 'request',
            provider: 'fallback',
            suggestIntake: true,
            intakePrefill: {
              issueType: deterministicPrefill.issueType,
              summary: deterministicPrefill.summary,
            },
          };
        } else {
          const piiContext = buildPiiPresenceContext(
            mergeDraftPii(draft, redactedMessage.extracted)
          );

          reply = await generateChatReply({
            locale,
            message: aiMessage,
            history,
            privacyContext: piiContext,
            operatorTakeover: session.operatorTakeover,
            publicRequestNumber,
          });
        }

        if (reply.text.trim().length > 0) {
          await prisma.message.create({
            data: {
              caseId: session.caseId,
              sessionId: session.id,
              channel: CaseOriginChannel.WEBSITE_CHAT,
              authorRole: MessageAuthorRole.SYSTEM,
              body: reply.text,
              isCustomerVisible: true,
              sentAt: new Date(),
            },
          });
        }
      }
    }

    const persistedMessages = await loadSessionMessages(prisma, session.id, session.caseId);
    const latestCustomerMessage = [...persistedMessages]
      .reverse()
      .find((message) => message.authorRole === MessageAuthorRole.CUSTOMER)
      ?.body;
    const intakePrefill = buildIntakePrefill(
      persistedMessages,
      reply?.intakePrefill ?? null,
      session,
      await getSessionIntakeDraft(prisma, session.id)
    );

    const response = NextResponse.json({
      success: true,
      operatorTakeover: session.operatorTakeover,
      messages: persistedMessages.map(serializeMessage),
      intakeMode: getIntakeMode(intakePrefill),
      suggestIntake:
        !session.operatorTakeover &&
        !isStatusOrAccountQuestion(latestCustomerMessage ?? '') &&
        shouldSuggestIntake(
          intakePrefill,
          latestCustomerMessage,
          persistedMessages,
          reply?.suggestIntake ?? false,
          intakeTurnDecision
        ),
      intakePrefill: !session.operatorTakeover ? intakePrefill : null,
    });

    if (cookieToken) {
      response.cookies.set({
        name: CASE_SESSION_COOKIE_NAME,
        value: cookieToken,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 180,
      });
    }

    return response;
  } catch (error) {
    await Promise.allSettled(
      storedAttachments.map((attachment) =>
        deleteAttachment(attachment)
      )
    );

    console.error('Chat message error:', error);

    if (error instanceof AttachmentValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to save chat message' },
      { status: 500 }
    );
  }
}
