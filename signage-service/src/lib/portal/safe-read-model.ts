import type { CaseStatus, MessageAuthorRole } from '@prisma/client';

const INTERNAL_PORTAL_ACCESS_MESSAGE_RE = /Kundenportal-Link:|\/portal\/claim\?token=/i;
const MAX_PORTAL_TITLE_LENGTH = 96;
const MAX_PORTAL_SUMMARY_LENGTH = 600;

type CustomerVisibleMessageSource = {
  authorRole: MessageAuthorRole;
  body: string;
};

function normalizePortalSnippet(value: string, maxLength: number): string {
  const clean = value.trim().replace(/\s+/g, ' ');

  if (clean.length <= maxLength) {
    return clean;
  }

  return `${clean.slice(0, maxLength - 3)}...`;
}

export function customerSafePortalMessageBody(value: string): string {
  const lines = value.replace(/\r\n/g, '\n').split('\n');
  const metadataPrefixes = ['typ:', 'standort:'];
  const firstContentIndex = lines.findIndex((line) => {
    const trimmed = line.trim();

    return trimmed.length > 0 && !metadataPrefixes.some((prefix) => trimmed.toLowerCase().startsWith(prefix));
  });

  if (firstContentIndex === -1) {
    return value.trim();
  }

  return lines.slice(firstContentIndex).join('\n').trim();
}

export function isInternalPortalAccessMessage(value: string): boolean {
  return INTERNAL_PORTAL_ACCESS_MESSAGE_RE.test(value);
}

export function firstCustomerPortalMessageBody(
  messages: CustomerVisibleMessageSource[],
  maxLength: number
): string | null {
  const customerMessage = messages.find((message) =>
    message.authorRole === 'CUSTOMER' &&
    !isInternalPortalAccessMessage(message.body) &&
    message.body.trim().length > 0
  );

  return customerMessage
    ? normalizePortalSnippet(customerSafePortalMessageBody(customerMessage.body), maxLength)
    : null;
}

export function customerSafePortalCaseTitle(input: {
  publicRequestNumber: string | null;
  messages: CustomerVisibleMessageSource[];
}): string {
  return firstCustomerPortalMessageBody(input.messages, MAX_PORTAL_TITLE_LENGTH)
    || `Anfrage ${input.publicRequestNumber || 'PR'}`;
}

export function customerSafePortalCaseSummary(messages: CustomerVisibleMessageSource[]): string {
  return firstCustomerPortalMessageBody(messages, MAX_PORTAL_SUMMARY_LENGTH)
    || 'Die Anfrage wurde im PixelRing System registriert. Kundensichere Details erscheinen in der Korrespondenz.';
}

export function customerSafeTimelineDescriptionForStatus(status: CaseStatus, locale?: string | null): string {
  if (locale === 'ru') {
    switch (status) {
      case 'WAITING_FOR_CUSTOMER':
        return 'PixelRing ожидает ваш ответ или дополнительные данные.';
      case 'IN_PROGRESS':
        return 'PixelRing обрабатывает заявку и координирует следующие шаги.';
      case 'ON_HOLD':
        return 'Заявка временно на паузе. PixelRing сообщит следующий безопасный шаг.';
      case 'READY_FOR_PICKUP':
        return 'Следующий рабочий шаг подготовлен.';
      case 'COMPLETED':
        return 'Заявка завершена.';
      case 'CANCELLED':
        return 'Заявка закрыта.';
      case 'DRAFT':
      case 'FORMALIZED':
      case 'NUMBER_ISSUED':
      case 'UNDER_REVIEW':
        return 'Статус заявки обновлен в клиентском виде.';
    }
  }

  switch (status) {
    case 'WAITING_FOR_CUSTOMER':
      return 'PixelRing benoetigt eine Rueckmeldung oder zusaetzliche Informationen von Ihnen.';
    case 'IN_PROGRESS':
      return 'PixelRing bearbeitet die Anfrage und koordiniert die naechsten operativen Schritte.';
    case 'ON_HOLD':
      return 'Die Anfrage ist pausiert. PixelRing meldet sich mit dem naechsten sicheren Schritt.';
    case 'READY_FOR_PICKUP':
      return 'Der naechste operative Schritt ist vorbereitet.';
    case 'COMPLETED':
      return 'Die Anfrage wurde abgeschlossen.';
    case 'CANCELLED':
      return 'Die Anfrage wurde geschlossen.';
    case 'DRAFT':
    case 'FORMALIZED':
    case 'NUMBER_ISSUED':
    case 'UNDER_REVIEW':
      return 'Der Status wurde im PixelRing System kundenfaehig aktualisiert.';
  }
}
