export type TelegramUser = {
  id: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
};

export type TelegramChat = {
  id: number;
  type: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  title?: string;
};

export type TelegramMessage = {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  caption?: string;
  photo?: unknown[];
  document?: unknown;
  video?: unknown;
  voice?: unknown;
  audio?: unknown;
};

export type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
};

type TelegramApiResponse<T> = {
  ok: boolean;
  result?: T;
  description?: string;
};

export type TelegramSendMessageResult = {
  message_id: number;
};

export function getTelegramBotToken(): string | null {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || null;
}

export function getTelegramWebhookSecret(): string | null {
  return process.env.TELEGRAM_WEBHOOK_SECRET?.trim() || null;
}

export function getTelegramBotUsername(): string | null {
  return process.env.TELEGRAM_BOT_USERNAME?.trim().replace(/^@/, '') || null;
}

export function isTelegramWebhookSecretValid(value: string | null): boolean {
  const expected = getTelegramWebhookSecret();

  if (!expected) {
    return false;
  }

  return value === expected;
}

function getTelegramApiUrl(method: string): string {
  const token = getTelegramBotToken();

  if (!token) {
    throw new Error('Missing TELEGRAM_BOT_TOKEN.');
  }

  return `https://api.telegram.org/bot${token}/${method}`;
}

export async function sendTelegramMessage(input: {
  chatId: string;
  text: string;
}): Promise<TelegramSendMessageResult> {
  const response = await fetch(getTelegramApiUrl('sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: input.chatId,
      text: input.text,
      disable_web_page_preview: true,
    }),
  });

  const data = (await response.json().catch(() => null)) as
    | TelegramApiResponse<TelegramSendMessageResult>
    | null;

  if (!response.ok || !data?.ok || !data.result) {
    throw new Error(data?.description || `Telegram sendMessage failed (${response.status}).`);
  }

  return data.result;
}

export function getTelegramDisplayName(input: {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
}): string | null {
  const fullName = [input.firstName, input.lastName]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(' ');

  if (fullName) {
    return fullName;
  }

  return input.username ? `@${input.username}` : null;
}

export function extractTelegramMessageBody(message: TelegramMessage): string {
  const text = message.text?.trim() || message.caption?.trim();

  if (text) {
    return text;
  }

  if (message.photo?.length) {
    return '[Telegram photo message received. File download is not enabled in CRM yet.]';
  }

  if (message.document) {
    return '[Telegram document message received. File download is not enabled in CRM yet.]';
  }

  if (message.video) {
    return '[Telegram video message received. File download is not enabled in CRM yet.]';
  }

  if (message.voice || message.audio) {
    return '[Telegram audio message received. File download is not enabled in CRM yet.]';
  }

  return '[Unsupported Telegram message received.]';
}
