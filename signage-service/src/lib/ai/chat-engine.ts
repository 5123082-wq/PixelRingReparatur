import 'server-only';

import {
  buildFallbackReply,
  guardChatReply,
  guardChatText,
  type SafetyIntent,
} from './safety-filter';
import type { AiRuntimeConfig } from './config';
import { getAiRuntimeConfig } from './config';
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
  operatorTakeover?: boolean;
};

export type GenerateChatReplyResult = {
  text: string;
  intent: SafetyIntent;
  provider: 'openai' | 'fallback';
  model?: string;
  refused?: boolean;
};

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
  const config = await getAiRuntimeConfig();
  const history = normalizeHistory(input.history, config.maxContextMessages);
  const systemPrompt = await buildSystemPrompt({
    locale: input.locale,
    operatorTakeover: input.operatorTakeover,
    extraSystemPrompt: config.cmsSystemPrompt,
  });
  const incomingVerdict = guardChatText(input.message, input.locale);

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
    const aiText = await callOpenAI(config, systemPrompt, input.message, history);

    if (aiText) {
      const outputVerdict = guardChatReply(aiText, input.locale);

      if (outputVerdict.allowed) {
        return {
          text: aiText,
          intent: incomingVerdict.intent,
          provider: 'openai',
          model: config.model || DEFAULT_MODEL,
        };
      }
    }
  } catch (error) {
    console.error('OpenAI chat generation failed:', error);
  }

  return {
    text: buildFallbackReply(incomingVerdict.intent, input.locale),
    intent: incomingVerdict.intent,
    provider: 'fallback',
    refused: incomingVerdict.intent === 'refusal',
  };
}
