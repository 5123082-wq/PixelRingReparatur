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

import { generateChatReply } from '@/lib/ai/chat-engine';
import { resolveChatSession } from '@/lib/ai/chat-session';
import {
  AttachmentValidationError,
  storeAttachment,
  type StoredAttachmentInput,
} from '@/lib/attachments';

type ChatMessageResponse = {
  authorRole: MessageAuthorRole;
  channel: CaseOriginChannel;
  body: string;
  isCustomerVisible: boolean;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
  attachments?: { id: string; storageKey: string; originalFilename: string | null }[];
};

type ChatIntakePrefill = {
  issueType?: string;
  contact?: string;
  contactMode?: 'phone' | 'email';
  summary?: string;
  hasSessionAttachments?: boolean;
  needsPhoto?: boolean;
  hasKnownSessionContact?: boolean;
};

type ChatIntakeMode = 'full_form' | 'confirm_existing_contact';

const MAX_CHAT_MESSAGE_LENGTH = 4000;
const EMAIL_IN_TEXT_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_IN_TEXT_RE = /(?:\+?\d[\d\s().-]{6,}\d)/;
const ISSUE_KEYWORDS: Array<{ issueType: string; patterns: RegExp[] }> = [
  { issueType: 'Reparatur', patterns: [/repar/i, /ремонт/i, /kaputt/i, /broken/i, /defekt/i, /сломал/i, /сломалась/i, /не\s+работ/i, /почин/i] },
  { issueType: 'Montage', patterns: [/montage/i, /install/i, /установ/i, /монтаж/i] },
  { issueType: 'Neue Beschilderung', patterns: [/neue beschilderung/i, /new sign/i, /нов(?:ая|ую|ой|ые|ый)?\s+(?:вывес|таблич|реклам)/i] },
  { issueType: 'Branding', patterns: [/branding/i, /бренд/i] },
  { issueType: 'Lichterwerbung', patterns: [/lichterwerbung/i, /light/i, /led/i, /вывес/i, /букв/i, /свет/i, /подсвет/i, /мерца/i, /flicker/i, /flacker/i] },
  { issueType: 'Wartung', patterns: [/wartung/i, /maintenance/i, /обслуж/i] },
];

function buildInitialGreeting(locale?: string): string {
  switch (locale) {
    case 'en':
      return 'Hello. I am the PixelRing virtual assistant. Tell me which device needs repair and what is happening with it.';
    case 'ru':
      return 'Здравствуйте. Я виртуальный ассистент PixelRing. Напишите, какое устройство нужно отремонтировать и что с ним произошло.';
    case 'tr':
      return 'Merhaba. Ben PixelRing sanal asistanıyım. Hangi cihazın onarılması gerektiğini ve sorunu kısaca yazın.';
    case 'pl':
      return 'Dzień dobry. Jestem wirtualnym asystentem PixelRing. Napisz, jakie urządzenie wymaga naprawy i co się z nim dzieje.';
    case 'ar':
      return 'مرحباً. أنا المساعد الافتراضي لـ PixelRing. أخبرني ما الجهاز الذي يحتاج إلى إصلاح وما المشكلة.';
    case 'de':
    default:
      return 'Hallo. Ich bin der virtuelle Assistent von PixelRing. Schreiben Sie kurz, welches Gerät repariert werden soll und was passiert ist.';
  }
}

function serializeMessage(message: {
  authorRole: MessageAuthorRole;
  channel: CaseOriginChannel;
  body: string;
  isCustomerVisible: boolean;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  attachments: { id: string; storageKey: string; originalFilename: string | null }[];
}): ChatMessageResponse {
  return {
    authorRole: message.authorRole,
    channel: message.channel,
    body: message.body,
    isCustomerVisible: message.isCustomerVisible,
    sentAt: message.sentAt ? message.sentAt.toISOString() : null,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
    attachments: message.attachments,
  };
}

function isLikelyContactOnly(value: string): boolean {
  const trimmed = value.trim();
  return EMAIL_IN_TEXT_RE.test(trimmed) || PHONE_IN_TEXT_RE.test(trimmed);
}

function isLowSignalIntakeSummary(value: string): boolean {
  const trimmed = value.trim().toLowerCase();

  return (
    trimmed.length < 6 ||
    isLikelyContactOnly(trimmed) ||
    /заяв|статус|request|status|anfrag/i.test(trimmed) ||
    /^(привет|здравств|hello|hi|hey|hallo|guten tag|добрый день)([!,.?\s]|$)/i.test(trimmed) ||
    ['foto', 'photo', 'bild', 'image', 'фото', 'фотография', 'картинка', 'видео']
      .some((prefix) => trimmed.startsWith(prefix))
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
  }
): ChatIntakePrefill {
  const currentMessages = getCurrentIntakeWindow(messages);
  const customerMessages = currentMessages.filter(
    (message) => message.authorRole === MessageAuthorRole.CUSTOMER
  );
  const customerText = customerMessages.map((message) => message.body).join('\n');
  const email = customerText.match(EMAIL_IN_TEXT_RE)?.[0];
  const phone = customerText.match(PHONE_IN_TEXT_RE)?.[0]?.trim();
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
      markerPrefill?.issueType ||
      inferIssueTypeFromText(customerText) ||
      undefined,
    contact: markerPrefill?.contact || email || phone || sessionContact?.contactValue || undefined,
    contactMode:
      markerPrefill?.contactMode ||
      (email ? 'email' : phone ? 'phone' : sessionContactMode),
    summary: markerPrefill?.summary || summarySource || undefined,
    hasSessionAttachments,
    needsPhoto: !hasSessionAttachments,
    hasKnownSessionContact: Boolean(sessionContact?.contactValue),
  };
}

function shouldSuggestIntake(
  prefill: ChatIntakePrefill,
  latestCustomerMessage?: string | null
): boolean {
  if (latestCustomerMessage && isStatusOrAccountQuestion(latestCustomerMessage)) {
    return false;
  }

  return Boolean(prefill.contact && prefill.summary && prefill.issueType);
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

  return db.message.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    select: {
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
        }
      }
    },
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

    const intakePrefill = buildIntakePrefill(messages, null, session);
    const response = NextResponse.json({
      success: true,
      operatorTakeover: session.operatorTakeover,
      messages: messages.map(serializeMessage),
      intakePrefill,
      intakeMode: getIntakeMode(intakePrefill),
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
    let storedAttachments: StoredAttachmentInput[] = [];
    if (files.length > 0) {
      storedAttachments = await Promise.all(
        files.map((file) => storeAttachment(file))
      );
    }

    const now = new Date();

    await prisma.$transaction(async (tx) => {
      const dbMessage = await tx.message.create({
        data: {
          caseId: session.caseId,
          sessionId: session.id,
          channel: CaseOriginChannel.WEBSITE_CHAT,
          authorRole: MessageAuthorRole.CUSTOMER,
          body: silent ? `[SILENT] ${message}` : message,
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
    });

    let reply: import('@/lib/ai/chat-engine').GenerateChatReplyResult | null = null;

    if (!session.operatorTakeover) {
      const messages = await loadSessionMessages(prisma, session.id, session.caseId);
      const history = messages
        .slice(0, -1)
        .map((entry) => ({
          role:
            entry.authorRole === MessageAuthorRole.CUSTOMER
               ? ('user' as const)
               : ('assistant' as const),
          body: entry.body.replace(/<<SHOW_LANGUAGE_SELECTOR>>/g, '').trim(),
        }));

      const aiMessage = files.length > 0
        ? `${message}\n\n[System-Notiz: Der Benutzer hat ${files.length} Foto(s)/Datei(en) an diese Nachricht angehängt. Bestätige kurz, dass du die Fotos erhalten hast, auch wenn du sie noch nicht sehen kannst.]`
        : message;

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
        reply = await generateChatReply({
          locale,
          message: aiMessage,
          history,
          operatorTakeover: session.operatorTakeover,
          publicRequestNumber,
        });

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
      session
    );

    const response = NextResponse.json({
      success: true,
      operatorTakeover: session.operatorTakeover,
      messages: persistedMessages.map(serializeMessage),
      intakeMode: getIntakeMode(intakePrefill),
      suggestIntake:
        !session.operatorTakeover &&
        !isStatusOrAccountQuestion(latestCustomerMessage ?? '') &&
        ((reply?.suggestIntake ?? false) ||
          shouldSuggestIntake(intakePrefill, latestCustomerMessage)),
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
