import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const contact = formData.get('contact') as string;
    const message = formData.get('message') as string;
    const photo = formData.get('photo') as File | null;

    // Validate required fields
    if (!name || !contact || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Build the message text
    const text = [
      `🔧 *Новая заявка с сайта PixelRing*`,
      ``,
      `👤 *Имя:* ${name}`,
      `📞 *Контакт:* ${contact}`,
      ``,
      `📝 *Сообщение:*`,
      message,
    ].join('\n');

    // Send to Telegram if configured
    if (botToken && chatId && chatId !== 'PLACEHOLDER_CHAT_ID') {
      if (photo && photo.size > 0) {
        // Send photo with caption
        const telegramForm = new FormData();
        telegramForm.append('chat_id', chatId);
        telegramForm.append('caption', text);
        telegramForm.append('parse_mode', 'Markdown');
        telegramForm.append('photo', photo);

        await fetch(
          `https://api.telegram.org/bot${botToken}/sendPhoto`,
          { method: 'POST', body: telegramForm }
        );
      } else {
        // Send text message
        await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text,
              parse_mode: 'Markdown',
            }),
          }
        );
      }
    } else {
      // Log to console when Telegram is not fully configured
      console.log('📩 New contact form submission (Telegram not configured):');
      console.log({ name, contact, message, hasPhoto: !!photo });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
