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
};

export type IntakePrefill = {
  issueType?: string;
  contact?: string;
  contactMode?: 'phone' | 'email';
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
  intakePrefill?: IntakePrefill;
};

const INTAKE_MARKER_RE = /\n?<<SHOW_INTAKE:(\{[^>]*\})>>/;

function parseIntakeMarker(text: string): {
  cleanText: string;
  suggestIntake: boolean;
  intakePrefill?: IntakePrefill;
} {
  const match = INTAKE_MARKER_RE.exec(text);

  if (!match) {
    return { cleanText: text, suggestIntake: false };
  }

  const cleanText = text.replace(INTAKE_MARKER_RE, '').trim();

  try {
    const rawPrefill = JSON.parse(match[1]) as IntakePrefill;
    const prefill: IntakePrefill = {};

    if (typeof rawPrefill.issueType === 'string') {
      prefill.issueType = rawPrefill.issueType;
    }

    if (typeof rawPrefill.summary === 'string') {
      prefill.summary = redactAssistantVisiblePii(rawPrefill.summary);
    }

    return { cleanText, suggestIntake: true, intakePrefill: prefill };
  } catch {
    return { cleanText, suggestIntake: true };
  }
}

const DEFAULT_MODEL = 'gpt-4o-mini';

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
  history: ChatHistoryItem[]
): Promise<string | null> {
  if (!config.apiKeyConfigured || !config.apiKey || !config.supportedProvider) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  const payload = {
    model: config.model,
    temperature: config.temperature,
    max_tokens: config.maxOutputTokens,
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

export async function generateChatReply(
  input: GenerateChatReplyInput
): Promise<GenerateChatReplyResult> {
  const incomingVerdict = guardChatText(
    input.message,
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
    });
    const privacyContext = input.privacyContext?.trim();
    const aiText = await callOpenAI(
      config,
      systemPrompt,
      privacyContext ? `${input.message}\n\n[Privacy context: ${privacyContext}]` : input.message,
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
        const { cleanText, suggestIntake, intakePrefill } = parseIntakeMarker(redactedAiText);
        return {
          text: cleanText,
          intent: incomingVerdict.intent,
          provider: 'openai',
          model: config.model || DEFAULT_MODEL,
          suggestIntake,
          intakePrefill,
        };
      }
    }
  } catch (error) {
    console.error('AI chat generation failed:', error);
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
