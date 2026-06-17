export type TelegramConversationState =
  | 'new_chat'
  | 'intake_pending'
  | 'form_link_sent'
  | 'request_active'
  | 'known_contact_no_active_request'
  | 'completed_or_cancelled';

export type TelegramTurnDecision =
  | 'let_ai_answer'
  | 'request_intake_form'
  | 'intake_form_reminder'
  | 'active_request_status'
  | 'active_request_continue'
  | 'separate_new_request';

type LatestIntakeLinkState = {
  submittedAt?: Date | null;
  revokedAt?: Date | null;
  expiresAt?: Date | null;
};

const TERMINAL_CASE_STATUSES = new Set(['COMPLETED', 'CANCELLED']);

export function isCustomerVisibleActiveRequest(input: {
  publicRequestNumber?: string | null;
  status?: string | null;
}): boolean {
  return Boolean(
    input.publicRequestNumber &&
    input.status &&
    !TERMINAL_CASE_STATUSES.has(input.status)
  );
}

function isLiveIntakeLink(link: LatestIntakeLinkState | null | undefined, now: Date): boolean {
  return Boolean(
    link &&
    !link.submittedAt &&
    !link.revokedAt &&
    link.expiresAt &&
    link.expiresAt > now
  );
}

export function resolveTelegramConversationState(input: {
  hasConversation: boolean;
  publicRequestNumber?: string | null;
  status?: string | null;
  hasStoredContact?: boolean;
  latestIntakeLink?: LatestIntakeLinkState | null;
  now?: Date;
}): TelegramConversationState {
  if (!input.hasConversation) {
    return 'new_chat';
  }

  if (isCustomerVisibleActiveRequest(input)) {
    return 'request_active';
  }

  if (
    input.publicRequestNumber &&
    input.status &&
    TERMINAL_CASE_STATUSES.has(input.status)
  ) {
    return 'completed_or_cancelled';
  }

  if (isLiveIntakeLink(input.latestIntakeLink, input.now ?? new Date())) {
    return 'form_link_sent';
  }

  if (input.hasStoredContact) {
    return 'known_contact_no_active_request';
  }

  return 'intake_pending';
}

function normalizeText(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

function isRequestCommand(text: string): boolean {
  const normalized = normalizeText(text);

  return normalized === '/request' || normalized.startsWith('/request@');
}

function isExplicitSeparateNewRequest(text: string): boolean {
  const normalized = normalizeText(text);

  return [
    /(?:нов(?:ая|ую|ой|ое)|друг(?:ая|ую|ой|ое)|отдельн\w*)\s+.{0,40}(?:заявк|проблем|вывес|объект)/u,
    /(?:созда|оформ)\w*\s+.{0,30}(?:нов(?:ую|ая)|друг(?:ую|ая)|отдельн\w*)\s+.{0,30}(?:заявк|обращ)/u,
    /(?:это|тут)\s+.{0,20}(?:другая|новая|отдельная)\s+.{0,30}(?:проблем|вывес|заявк)/u,
    /(?:new|another|separate|different)\s+.{0,40}(?:request|issue|problem|sign|case)/,
    /(?:create|open|start)\s+.{0,40}(?:new|another|separate)\s+.{0,20}(?:request|case)/,
    /(?:neue|andere|separate)\s+.{0,40}(?:anfrage|problem|werbeanlage|schild)/,
    /(?:nowe|inne|osobne)\s+.{0,40}(?:zgloszenie|problem)/,
    /(?:yeni|baska|ayri)\s+.{0,40}(?:talep|sorun)/,
  ].some((pattern) => pattern.test(normalized));
}

function isActiveStatusQuestion(text: string): boolean {
  const normalized = normalizeText(text);

  return [
    /\bstatus\b/,
    /\btrack(?:ing)?\b/,
    /\brequest\s+number\b/,
    /\bmy\s+(?:request|case)\b/,
    /\bwhat(?:'s| is)?\s+(?:happening|going on)\s+with\s+my\s+(?:request|case)\b/,
    /\bPR[-\s]?[A-Z0-9-]+\b/i,
    /статус/u,
    /что\s+с\s+(?:моей\s+)?заявк/u,
    /как\s+(?:там\s+)?(?:моя\s+)?заявк/u,
    /как\s+дел[ао]\s+с\s+(?:моей\s+)?заявк/u,
    /(?:есть|будет|появилась?)\s+.{0,25}информац/u,
    /(?:у\s+меня\s+)?нет\s+заявк/u,
    /моя\s+заявк/u,
    /моей\s+заявк/u,
    /по\s+заявк/u,
    /номер\s+(?:заяв|обращ|pr)/u,
    /(?:заяв|обращ).*номер/u,
    /\bmeine\s+anfrage\b/,
    /\banfragenummer\b/,
    /\bstatus\s+meiner\s+anfrage\b/,
    /\bmoje\s+zgloszenie\b/,
    /\bnumer\s+zgloszenia\b/,
    /\btalebim\b/,
  ].some((pattern) => pattern.test(normalized));
}

function isShortActiveFollowup(text: string): boolean {
  const normalized = normalizeText(text);

  return [
    /^(?:ok|okay|ок|окей|хорошо|понял|понятно|спасибо|да|ага)[.!?]*$/u,
    /^(?:что\s+дальше|дальше\s+что|и\s+дальше|теперь\s+что)[?!.]*$/u,
    /^(?:what(?:'s| is)?\s+next|next|now\s+what)[?!.]*$/,
    /^(?:was\s+jetzt|wie\s+weiter|und\s+jetzt)[?!.]*$/,
    /^(?:co\s+dalej|i\s+co\s+dalej)[?!.]*$/,
    /^(?:simdi\s+ne|sonra\s+ne)[?!.]*$/,
    /(?:что\s+дальше|есть\s+информац|какие\s+дальше\s+шаги)/u,
  ].some((pattern) => pattern.test(normalized));
}

function isFormReminderTurn(text: string): boolean {
  const normalized = normalizeText(text);

  return [
    /^(?:да|давай|готов|готово|ок|окей)[.!?]*$/u,
    /(?:где|открой|пришли|дай|форма|ссылк)/u,
    /(?:where|open|send|form|link)/,
    /(?:formular|link|oeffnen|öffnen)/,
  ].some((pattern) => pattern.test(normalized));
}

export function classifyTelegramTurn(input: {
  state: TelegramConversationState;
  text: string;
  hasPhoto?: boolean;
}): TelegramTurnDecision {
  if (input.state === 'request_active') {
    if (isExplicitSeparateNewRequest(input.text) || isRequestCommand(input.text)) {
      return 'separate_new_request';
    }

    if (isActiveStatusQuestion(input.text)) {
      return 'active_request_status';
    }

    if (input.hasPhoto || isShortActiveFollowup(input.text)) {
      return 'active_request_continue';
    }

    return 'let_ai_answer';
  }

  if (input.state === 'form_link_sent' && isFormReminderTurn(input.text)) {
    return 'intake_form_reminder';
  }

  if (isRequestCommand(input.text)) {
    return 'request_intake_form';
  }

  return 'let_ai_answer';
}
