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

export type TelegramPhotoSize = {
  file_id: string;
  file_unique_id?: string;
  width: number;
  height: number;
  file_size?: number;
};

export type TelegramMessage = {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  caption?: string;
  photo?: TelegramPhotoSize[];
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

type TelegramFileResult = {
  file_id: string;
  file_unique_id?: string;
  file_size?: number;
  file_path?: string;
};

export type TelegramSendMessageResult = {
  message_id: number;
};

export type TelegramDownloadedFile = {
  buffer: Buffer;
  mimeType: string;
  originalFilename: string;
  fileSize?: number;
};

export type TelegramInlineKeyboardMarkup = {
  inline_keyboard: Array<Array<{
    text: string;
    url: string;
  }>>;
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

function getTelegramFileUrl(filePath: string): string {
  const token = getTelegramBotToken();

  if (!token) {
    throw new Error('Missing TELEGRAM_BOT_TOKEN.');
  }

  return `https://api.telegram.org/file/bot${token}/${filePath}`;
}

function getFilenameFromTelegramPath(filePath: string): string {
  const filename = filePath.split('/').pop()?.trim();

  return filename || 'telegram-file';
}

function getMimeTypeFromResponse(response: Response): string {
  return response.headers.get('content-type')?.split(';')[0]?.trim() || 'application/octet-stream';
}

function getMimeTypeFromTelegramPath(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}

export async function sendTelegramMessage(input: {
  chatId: string;
  text: string;
  parseMode?: 'HTML';
  replyMarkup?: TelegramInlineKeyboardMarkup;
}): Promise<TelegramSendMessageResult> {
  const response = await fetch(getTelegramApiUrl('sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: input.chatId,
      text: input.text,
      parse_mode: input.parseMode,
      reply_markup: input.replyMarkup,
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

export function getLargestTelegramPhoto(message: TelegramMessage): TelegramPhotoSize | null {
  const photos = message.photo ?? [];

  if (photos.length === 0) {
    return null;
  }

  return photos.reduce((largest, photo) => {
    const largestScore = largest.width * largest.height;
    const photoScore = photo.width * photo.height;

    return photoScore > largestScore ? photo : largest;
  }, photos[0]);
}

export async function getTelegramFile(fileId: string): Promise<TelegramFileResult> {
  const response = await fetch(getTelegramApiUrl('getFile'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_id: fileId }),
  });

  const data = (await response.json().catch(() => null)) as
    | TelegramApiResponse<TelegramFileResult>
    | null;

  if (!response.ok || !data?.ok || !data.result) {
    throw new Error(data?.description || `Telegram getFile failed (${response.status}).`);
  }

  if (!data.result.file_path) {
    throw new Error('Telegram getFile response did not include file_path.');
  }

  return data.result;
}

export async function downloadTelegramFile(fileId: string): Promise<TelegramDownloadedFile> {
  const telegramFile = await getTelegramFile(fileId);
  const filePath = telegramFile.file_path;

  if (!filePath) {
    throw new Error('Telegram file_path is missing.');
  }

  const response = await fetch(getTelegramFileUrl(filePath));

  if (!response.ok) {
    throw new Error(`Telegram file download failed (${response.status}).`);
  }

  return {
    buffer: Buffer.from(await response.arrayBuffer()),
    mimeType: getMimeTypeFromResponse(response) === 'application/octet-stream'
      ? getMimeTypeFromTelegramPath(filePath)
      : getMimeTypeFromResponse(response),
    originalFilename: getFilenameFromTelegramPath(filePath),
    fileSize: telegramFile.file_size,
  };
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
