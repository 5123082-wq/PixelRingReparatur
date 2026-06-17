import 'server-only';

import {
  buildFallbackReply,
  detectSafetyIntent,
  guardChatReply,
  guardChatText,
  type SafetyIntent,
} from './safety-filter';
import type { AiRuntimeConfig } from './config';
import { getAiRuntimeConfig } from './config';
import {
  normalizeIntakeTurnDecision,
  type IntakeTurnDecision,
} from './intake-intent-core';
import { redactAssistantVisiblePii } from './pii-redaction';
import { buildSystemPrompt } from './system-prompt';

type ChatRole = 'user' | 'assistant';

export type ChatHistoryItem = {
  role: ChatRole;
  body: string;
};

export type GenerateChatReplyInput = {
  locale?: string;
  message: string;
  history: ChatHistoryItem[];
  privacyContext?: string | null;
  operatorTakeover?: boolean;
  publicRequestNumber?: string | null;
  requestBoundPortal?: boolean;
  newRequestUrl?: string | null;
  messengerKnownContact?: boolean;
  activeMessengerRequest?: boolean;
};

export type ClassifyIntakeTurnInput = {
  locale?: string;
  latestCustomerMessage: string;
  latestAssistantMessage?: string | null;
  problemSummary?: string | null;
  assistantOfferedIntake: boolean;
};

export type IntakePrefill = {
  issueType?: string;
  contact?: string;
  contactMode?: 'phone' | 'email';
  email?: string;
  phone?: string;
  name?: string;
  location?: string;
  summary?: string;
  hasSessionAttachments?: boolean;
  needsPhoto?: boolean;
  hasKnownSessionContact?: boolean;
};

export type GenerateChatReplyResult = {
  text: string;
  intent: SafetyIntent;
  provider: 'openai' | 'fallback';
  model?: string;
  refused?: boolean;
  suggestIntake?: boolean;
  suggestStatus?: boolean;
  intakePrefill?: IntakePrefill;
};

const INTAKE_MARKER_RE = /\n?<<SHOW_INTAKE:(\{[^>\n]*\})>>\s*$/;
const STATUS_MARKER_RE = /\n?<<SHOW_STATUS>>\s*$/;
const RESERVED_ACTION_MARKER_RE = /<<SHOW_STATUS>>|<<SHOW_INTAKE:\{[^>\n]*\}>>/g;
const ALLOWED_INTAKE_ISSUE_TYPES = new Set([
  'Reparatur',
  'Montage',
  'Neue Beschilderung',
  'Branding',
  'Lichterwerbung',
  'Wartung',
  'Sonstiges',
]);
const MAX_MARKER_SUMMARY_LENGTH = 500;

export function stripReservedActionMarkers(value: string): string {
  return value.replace(RESERVED_ACTION_MARKER_RE, '').trim();
}

function parseActionMarkers(text: string): {
  cleanText: string;
  suggestIntake: boolean;
  suggestStatus: boolean;
  intakePrefill?: IntakePrefill;
} {
  const normalizedText = text.trim();
  const statusMatch = STATUS_MARKER_RE.test(normalizedText);
  const textWithoutStatus = normalizedText.replace(STATUS_MARKER_RE, '').trim();
  const match = INTAKE_MARKER_RE.exec(textWithoutStatus);

  if (!match) {
    return {
      cleanText: textWithoutStatus,
      suggestIntake: false,
      suggestStatus: statusMatch,
    };
  }

  const cleanText = textWithoutStatus.replace(INTAKE_MARKER_RE, '').trim();

  try {
    const rawPrefill = JSON.parse(match[1]) as IntakePrefill;
    const prefill: IntakePrefill = {};

    if (
      rawPrefill.issueType !== undefined &&
      (
        typeof rawPrefill.issueType !== 'string' ||
        !ALLOWED_INTAKE_ISSUE_TYPES.has(rawPrefill.issueType)
      )
    ) {
      return { cleanText, suggestIntake: false, suggestStatus: statusMatch };
    }

    if (typeof rawPrefill.issueType === 'string') {
      prefill.issueType = rawPrefill.issueType;
    }

    if (typeof rawPrefill.summary === 'string') {
      prefill.summary = redactAssistantVisiblePii(rawPrefill.summary)
        .slice(0, MAX_MARKER_SUMMARY_LENGTH)
        .trim();
    }

    return {
      cleanText,
      suggestIntake: true,
      suggestStatus: statusMatch,
      intakePrefill: prefill,
    };
  } catch {
    return { cleanText, suggestIntake: false, suggestStatus: statusMatch };
  }
}

const DEFAULT_MODEL = 'gpt-4o-mini';

function buildPortalNewRequestRedirect(locale?: string, newRequestUrl = '/portal'): string {
  if (locale === 'ru') {
    return `Я не могу оформить новую заявку внутри чата текущей заявки, чтобы не смешать обращения. Откройте новую заявку в кабинете: ${newRequestUrl}`;
  }

  if (locale === 'en') {
    return `I cannot create a new request inside the chat for this current request because the two issues must stay separate. Open a new request in the portal: ${newRequestUrl}`;
  }

  return `Ich kann eine neue Anfrage nicht im Chat der aktuellen Anfrage anlegen, damit die Vorgaenge getrennt bleiben. Oeffnen Sie die neue Anfrage im Portal: ${newRequestUrl}`;
}

function normalizeHistory(
  history: ChatHistoryItem[],
  maxContextMessages: number
): ChatHistoryItem[] {
  const limitedHistory = history.slice(-maxContextMessages);

  return limitedHistory.filter((item) => item.body.trim().length > 0);
}

async function callOpenAI(
  config: AiRuntimeConfig,
  systemPrompt: string,
  message: string,
  history: ChatHistoryItem[],
  options: {
    temperature?: number;
    maxTokens?: number;
    responseFormat?: { type: 'json_object' };
  } = {}
): Promise<string | null> {
  if (!config.apiKeyConfigured || !config.apiKey || !config.supportedProvider) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  const payload = {
    model: config.model,
    temperature: options.temperature ?? config.temperature,
    max_tokens: options.maxTokens ?? config.maxOutputTokens,
    ...(options.responseFormat ? { response_format: options.responseFormat } : {}),
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...history.map((item) => ({
        role: item.role,
        content: item.body,
      })),
      {
        role: 'user',
        content: message,
      },
    ],
  };

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn('OpenAI chat completion returned non-OK status:', response.status);

      return null;
    }

    const data = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string | null;
        };
      }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim() ?? '';

    return content.length > 0 ? content : null;
  } finally {
    clearTimeout(timeout);
  }
}

function buildIntakeTurnClassifierPrompt(locale?: string): string {
  return [
    'You classify one customer message in the PixelRing signage-service chat.',
    'Return JSON only with this shape: {"intent":"accept_intake|reject_intake|ask_question|status_or_existing_request|unclear","confidence":0.0}',
    '',
    'Definitions:',
    '- accept_intake: the customer agrees to open/create/submit/prepare the service request or form, asks the assistant to do it, or says the form did not open after agreeing. This can be phrased naturally in any supported language and does not need exact words.',
    '- reject_intake: the customer clearly declines, postpones, or says they do not want a request/form.',
    '- ask_question: the customer asks a normal service or process question before deciding.',
    '- status_or_existing_request: the customer asks about an existing request, request number, status, portal, or account history.',
    '- unclear: short ambiguous replies or text that does not clearly fit another intent.',
    '',
    'Important rules:',
    '- Do not classify as accept_intake unless a problem summary is already present in the input.',
    '- If the assistant did not offer intake yet, accept_intake is still valid when the customer directly asks to create/open/submit a request for the described problem.',
    '- Prefer status_or_existing_request over accept_intake for existing-request/status/account questions.',
    `The UI locale is "${locale?.trim() || 'de'}", but classify by meaning, not by exact language.`,
  ].join('\n');
}

export async function classifyIntakeTurn(
  input: ClassifyIntakeTurnInput
): Promise<IntakeTurnDecision> {
  if (!input.latestCustomerMessage.trim() || !input.problemSummary?.trim()) {
    return {
      intent: 'unclear',
      confidence: 0,
      provider: 'fallback',
    };
  }

  try {
    const config = await getAiRuntimeConfig();
    const content = await callOpenAI(
      config,
      buildIntakeTurnClassifierPrompt(input.locale),
      JSON.stringify({
        latestCustomerMessage: input.latestCustomerMessage,
        latestAssistantMessage: input.latestAssistantMessage ?? '',
        problemSummary: input.problemSummary,
        assistantOfferedIntake: input.assistantOfferedIntake,
      }),
      [],
      {
        temperature: 0,
        maxTokens: 80,
        responseFormat: { type: 'json_object' },
      }
    );

    if (!content) {
      return {
        intent: 'unclear',
        confidence: 0,
        provider: 'fallback',
      };
    }

    const decision = normalizeIntakeTurnDecision(JSON.parse(content));

    return {
      ...decision,
      provider: 'openai',
    };
  } catch (error) {
    console.error('AI intake intent classification failed:', error);

    return {
      intent: 'unclear',
      confidence: 0,
      provider: 'fallback',
    };
  }
}

export async function generateChatReply(
  input: GenerateChatReplyInput
): Promise<GenerateChatReplyResult> {
  const sanitizedMessage = stripReservedActionMarkers(input.message);
  const incomingVerdict = guardChatText(
    sanitizedMessage,
    input.locale,
    input.publicRequestNumber
  );

  if (!incomingVerdict.allowed) {
    return {
      text: incomingVerdict.refusalText,
      intent: 'refusal',
      provider: 'fallback',
      refused: true,
    };
  }

  if (input.operatorTakeover) {
    return {
      text: buildFallbackReply('human', input.locale),
      intent: 'human',
      provider: 'fallback',
      refused: true,
    };
  }

  try {
    const config = await getAiRuntimeConfig();
    const history = normalizeHistory(input.history, config.maxContextMessages);
    const shouldExposeRequestNumber =
      input.publicRequestNumber && incomingVerdict.intent === 'status';
    const systemPrompt = await buildSystemPrompt({
      locale: input.locale,
      operatorTakeover: input.operatorTakeover,
      extraSystemPrompt: config.cmsSystemPrompt,
      publicRequestNumber: shouldExposeRequestNumber
        ? input.publicRequestNumber
        : null,
      requestBoundPortal: input.requestBoundPortal,
      newRequestUrl: input.newRequestUrl,
      messengerKnownContact: input.messengerKnownContact,
      activeMessengerRequest: input.activeMessengerRequest,
      knowledgeQuery: sanitizedMessage,
    });
    const privacyContext = input.privacyContext?.trim();
    const aiText = await callOpenAI(
      config,
      systemPrompt,
      privacyContext ? `${sanitizedMessage}\n\n[Privacy context: ${privacyContext}]` : sanitizedMessage,
      history
    );

    if (aiText) {
      const outputVerdict = guardChatReply(
        aiText,
        input.locale,
        input.publicRequestNumber
      );

      if (outputVerdict.allowed) {
        const redactedAiText = redactAssistantVisiblePii(aiText);
        const { cleanText, suggestIntake, suggestStatus, intakePrefill } = parseActionMarkers(redactedAiText);

        if (input.requestBoundPortal && suggestIntake) {
          return {
            text: buildPortalNewRequestRedirect(input.locale, input.newRequestUrl || '/portal'),
            intent: 'request',
            provider: 'openai',
            model: config.model || DEFAULT_MODEL,
            suggestIntake: false,
          };
        }

        return {
          text: cleanText,
          intent: incomingVerdict.intent,
          provider: 'openai',
          model: config.model || DEFAULT_MODEL,
          suggestIntake,
          suggestStatus,
          intakePrefill,
        };
      }
    }
  } catch (error) {
    console.error('AI chat generation failed:', error);
  }

  if (input.requestBoundPortal && incomingVerdict.intent === 'request') {
    return {
      text: buildPortalNewRequestRedirect(input.locale, input.newRequestUrl || '/portal'),
      intent: incomingVerdict.intent,
      provider: 'fallback',
      suggestIntake: false,
    };
  }

  return {
    text: buildFallbackReply(incomingVerdict.intent, input.locale),
    intent: incomingVerdict.intent,
    provider: 'fallback',
    refused: incomingVerdict.intent === 'refusal',
  };
}

export function shouldAttachStatusAction(message: string): boolean {
  return detectSafetyIntent(message) === 'status';
}
