import 'server-only';

import { CaseOriginChannel, MessageAuthorRole, type PrismaClient } from '@prisma/client';

import {
  generateChatReply,
  stripReservedActionMarkers,
  type ChatHistoryItem,
  type IntakePrefill,
} from './chat-engine';
import { buildPiiPresenceContext, redactPiiForAi, redactPiiFromText } from './pii-redaction';

export type AssistantChannelCapability =
  | 'rich_intake_card'
  | 'language_selector'
  | 'attachments'
  | 'inline_buttons';

export type AssistantAction =
  | { type: 'show_intake'; prefill?: IntakePrefill }
  | { type: 'show_status' }
  | { type: 'handoff_requested' }
  | { type: 'language_selector' };

export type RunAssistantTurnInput = {
  caseId: string;
  channel: CaseOriginChannel;
  locale?: string | null;
  latestMessageId?: string | null;
  latestCustomerMessage: string;
  publicRequestNumber?: string | null;
  capabilities?: AssistantChannelCapability[];
  requestBoundPortal?: boolean;
  newRequestUrl?: string | null;
  messengerKnownContact?: boolean;
  activeMessengerRequest?: boolean;
};

export type RunAssistantTurnResult = {
  text: string;
  actions: AssistantAction[];
  provider: 'openai' | 'fallback';
  model?: string;
  messageId: string | null;
};

function mapHistoryRole(authorRole: MessageAuthorRole): ChatHistoryItem['role'] {
  return authorRole === MessageAuthorRole.CUSTOMER ? 'user' : 'assistant';
}

function sanitizeHistoryBody(value: string): string {
  return stripReservedActionMarkers(
    redactPiiForAi(
      value
        .replace(/<<SHOW_LANGUAGE_SELECTOR>>/g, '')
        .replace(/https?:\/\/[^\s)]*\/portal\/claim\?token=[^\s)]*/gi, '[PORTAL_LINK_REMOVED]')
        .replace(/Kundenportal-Link:\s*/gi, '')
        .trim()
    )
  );
}

function buildActions(input: {
  suggestIntake?: boolean;
  suggestStatus?: boolean;
  intakePrefill?: IntakePrefill;
  intent: string;
  capabilities: AssistantChannelCapability[];
}): AssistantAction[] {
  const actions: AssistantAction[] = [];

  if (
    input.suggestIntake &&
    (
      input.capabilities.includes('rich_intake_card') ||
      input.capabilities.includes('inline_buttons')
    )
  ) {
    actions.push({
      type: 'show_intake',
      prefill: input.intakePrefill,
    });
  }

  if (input.suggestStatus && input.capabilities.includes('inline_buttons')) {
    actions.push({ type: 'show_status' });
  }

  if (input.intent === 'human') {
    actions.push({ type: 'handoff_requested' });
  }

  if (input.capabilities.includes('language_selector')) {
    actions.push({ type: 'language_selector' });
  }

  return actions;
}

export async function runAssistantTurn(
  db: PrismaClient,
  input: RunAssistantTurnInput
): Promise<RunAssistantTurnResult | null> {
  const messages = await db.message.findMany({
    where: {
      caseId: input.caseId,
      isCustomerVisible: true,
    },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      authorRole: true,
      body: true,
    },
  });
  const history = messages
    .filter((message) => message.id !== input.latestMessageId)
    .map((message): ChatHistoryItem => ({
      role: mapHistoryRole(message.authorRole),
      body: sanitizeHistoryBody(message.body),
    }))
    .filter((message) => message.body.length > 0);

  const redactedLatest = redactPiiFromText(input.latestCustomerMessage);
  const reply = await generateChatReply({
    locale: input.locale ?? undefined,
    message: redactedLatest.redactedText,
    history,
    privacyContext: buildPiiPresenceContext(redactedLatest.extracted),
    publicRequestNumber: input.publicRequestNumber ?? null,
    requestBoundPortal: input.requestBoundPortal,
    newRequestUrl: input.newRequestUrl,
    messengerKnownContact: input.messengerKnownContact,
    activeMessengerRequest: input.activeMessengerRequest,
  });
  const text = reply.text.trim();

  if (!text) {
    return null;
  }

  const assistantMessage = await db.message.create({
    data: {
      caseId: input.caseId,
      channel: input.channel,
      authorRole: MessageAuthorRole.SYSTEM,
      authorName: 'AI Assistant',
      body: text,
      isCustomerVisible: true,
      sentAt: new Date(),
    },
    select: {
      id: true,
    },
  });

  return {
    text,
    actions: buildActions({
      suggestIntake: reply.suggestIntake,
      suggestStatus: reply.suggestStatus,
      intakePrefill: reply.intakePrefill,
      intent: reply.intent,
      capabilities: input.capabilities ?? [],
    }),
    provider: reply.provider,
    model: reply.model,
    messageId: assistantMessage.id,
  };
}
