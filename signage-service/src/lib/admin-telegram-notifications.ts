import { SITE_BASE_URL } from '@/lib/seo';
import { sendTelegramMessage } from '@/lib/telegram';

const DEFAULT_ADMIN_LOCALE = 'de';
const MESSAGE_PREVIEW_LENGTH = 700;

type AdminTelegramNotificationInput = {
  kind: 'website_request_created' | 'telegram_customer_message_created';
  caseId: string;
  publicRequestNumber?: string | null;
  customerName?: string | null;
  contactLabel?: string | null;
  originLabel: string;
  messagePreview?: string | null;
  isNewCase?: boolean;
};

function getAdminTelegramChatId(): string | null {
  return (
    process.env.TELEGRAM_ADMIN_CHAT_ID?.trim() ||
    process.env.TELEGRAM_CHAT_ID?.trim() ||
    null
  );
}

function escapeTelegramHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function normalizeSingleLine(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function truncate(value: string, maxLength: number): string {
  const clean = value.trim();

  return clean.length <= maxLength
    ? clean
    : `${clean.slice(0, maxLength - 3)}...`;
}

function buildCrmCaseUrl(caseId: string): string {
  return `${SITE_BASE_URL}/${DEFAULT_ADMIN_LOCALE}/ring-manager-crm/dashboard/${caseId}`;
}

function buildCaseLabel(publicRequestNumber?: string | null): string {
  return publicRequestNumber || 'Draft Telegram case';
}

function buildTitle(input: AdminTelegramNotificationInput): string {
  if (input.kind === 'website_request_created') {
    return 'New PixelRing request';
  }

  return input.isNewCase
    ? 'New Telegram case'
    : 'New Telegram customer message';
}

function buildAdminTelegramText(input: AdminTelegramNotificationInput): string {
  const lines = [
    `<b>${escapeTelegramHtml(buildTitle(input))}</b>`,
    '',
    `<b>Case:</b> ${escapeTelegramHtml(buildCaseLabel(input.publicRequestNumber))}`,
    `<b>Channel:</b> ${escapeTelegramHtml(input.originLabel)}`,
  ];

  if (input.customerName) {
    lines.push(`<b>Customer:</b> ${escapeTelegramHtml(normalizeSingleLine(input.customerName))}`);
  }

  if (input.contactLabel) {
    lines.push(`<b>Contact:</b> ${escapeTelegramHtml(normalizeSingleLine(input.contactLabel))}`);
  }

  if (input.messagePreview) {
    lines.push(
      '',
      '<b>Message:</b>',
      escapeTelegramHtml(truncate(input.messagePreview, MESSAGE_PREVIEW_LENGTH))
    );
  }

  lines.push('', `<a href="${escapeTelegramHtml(buildCrmCaseUrl(input.caseId))}">Open in CRM</a>`);

  return lines.join('\n');
}

export async function sendAdminTelegramNotification(
  input: AdminTelegramNotificationInput
): Promise<void> {
  const chatId = getAdminTelegramChatId();

  if (!chatId || chatId === 'PLACEHOLDER_CHAT_ID') {
    return;
  }

  const crmUrl = buildCrmCaseUrl(input.caseId);

  await sendTelegramMessage({
    chatId,
    text: buildAdminTelegramText(input),
    parseMode: 'HTML',
    replyMarkup: {
      inline_keyboard: [[
        {
          text: 'Open in CRM',
          url: crmUrl,
        },
      ]],
    },
  });
}
