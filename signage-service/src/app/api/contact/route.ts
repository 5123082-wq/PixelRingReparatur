import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { createWebsiteRequest } from '@/lib/request-intake';
import { CASE_SESSION_COOKIE_NAME } from '@/lib/case-session';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = String(formData.get('name') ?? '').trim();
    const contact = String(formData.get('contact') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();
    const photo = formData.get('photo') as File | null;

    if (!contact || !message) {
      return NextResponse.json(
        {
          error: 'Please provide a valid email address or phone number and a message.',
        },
        { status: 400 }
      );
    }

    const result = await createWebsiteRequest(prisma, {
      name,
      contact,
      message,
      userAgent: request.headers.get('user-agent'),
      ipAddress:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
      hasPhoto: Boolean(photo && photo.size > 0),
    });

    const text = [
      `🔧 *New PixelRing request*`,
      ``,
      `👤 *Имя:* ${name || '—'}`,
      `📞 *Контакт:* ${contact}`,
      `🆔 *PR:* ${result.publicRequestNumber}`,
      ``,
      `📝 *Сообщение:*`,
      message,
    ].join('\n');

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId && chatId !== 'PLACEHOLDER_CHAT_ID') {
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'Markdown',
          }),
        });
      } catch (telegramError) {
        console.error('Telegram notification failed:', telegramError);
      }
    } else {
      console.log('New contact form submission');
      console.log({
        name,
        contact,
        message,
        publicRequestNumber: result.publicRequestNumber,
        hasPhoto: result.photoReceived,
      });
    }

    const response = NextResponse.json({
      success: true,
      publicRequestNumber: result.publicRequestNumber,
      photoReceived: result.photoReceived,
    });

    response.cookies.set({
      name: CASE_SESSION_COOKIE_NAME,
      value: result.sessionToken,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 180,
    });

    return response;
  } catch (error) {
    console.error('Contact form error:', error);

    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Internal server error';
    const status = message.startsWith('Please provide a valid') ? 400 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
