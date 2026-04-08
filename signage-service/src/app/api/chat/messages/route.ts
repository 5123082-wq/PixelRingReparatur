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

type ChatMessageResponse = {
  id: string;
  authorRole: MessageAuthorRole;
  channel: CaseOriginChannel;
  body: string;
  isCustomerVisible: boolean;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
  caseId: string | null;
  sessionId: string | null;
};

const MAX_CHAT_MESSAGE_LENGTH = 4000;

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
  id: string;
  authorRole: MessageAuthorRole;
  channel: CaseOriginChannel;
  body: string;
  isCustomerVisible: boolean;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  caseId: string | null;
  sessionId: string | null;
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
    caseId: message.caseId,
    sessionId: message.sessionId,
  };
}

async function loadSessionMessages(
  db: PrismaClient,
  sessionId: string,
  caseId: string | null
) {
  const where = caseId
    ? {
        OR: [{ sessionId }, { caseId }],
      }
    : {
        sessionId,
      };

  return db.message.findMany({
    where,
    distinct: ['id'],
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
        sessionId: null,
        caseId: null,
        operatorTakeover: false,
        messages: [],
      });
    }

    const session = resolved.session;
    let messages = await loadSessionMessages(prisma, session.id, session.caseId);

    if (messages.length === 0) {
      await prisma.message.create({
        data: {
          caseId: session.caseId,
          sessionId: session.id,
          channel: CaseOriginChannel.WEBSITE_CHAT,
          authorRole: MessageAuthorRole.SYSTEM,
          body: buildInitialGreeting(locale),
          isCustomerVisible: true,
          sentAt: new Date(),
        },
      });

      messages = await loadSessionMessages(prisma, session.id, session.caseId);
    }

    const response = NextResponse.json({
      success: true,
      sessionId: session.id,
      caseId: session.caseId,
      operatorTakeover: session.operatorTakeover,
      messages: messages.map(serializeMessage),
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
    const body = (await request.json().catch(() => null)) as
      | {
          message?: string;
          locale?: string;
        }
      | null;

    const message = body?.message?.trim() ?? '';
    const locale = body?.locale?.trim();

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
    const now = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.message.create({
        data: {
          caseId: session.caseId,
          sessionId: session.id,
          channel: CaseOriginChannel.WEBSITE_CHAT,
          authorRole: MessageAuthorRole.CUSTOMER,
          body: message,
          isCustomerVisible: true,
          sentAt: now,
        },
      });

      await tx.session.update({
        where: { id: session.id },
        data: {
          lastSeenAt: now,
          scope: session.caseId ? SessionScope.CASE_ACCESS : SessionScope.ANONYMOUS_DRAFT,
        },
      });
    });

    if (!session.operatorTakeover) {
      const messages = await loadSessionMessages(prisma, session.id, session.caseId);
      const history = messages
        .slice(0, -1)
        .map((entry) => ({
          role:
            entry.authorRole === MessageAuthorRole.CUSTOMER
              ? ('user' as const)
              : ('assistant' as const),
          body: entry.body,
        }));

      const reply = await generateChatReply({
        locale,
        message,
        history,
        operatorTakeover: session.operatorTakeover,
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

    const persistedMessages = await loadSessionMessages(prisma, session.id, session.caseId);

    const response = NextResponse.json({
      success: true,
      sessionId: session.id,
      caseId: session.caseId,
      operatorTakeover: session.operatorTakeover,
      messages: persistedMessages.map(serializeMessage),
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

    return NextResponse.json(
      { success: false, error: 'Failed to save chat message' },
      { status: 500 }
    );
  }
}
