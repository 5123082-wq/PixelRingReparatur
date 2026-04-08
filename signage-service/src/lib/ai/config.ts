import 'server-only';

import { prisma } from '@/lib/prisma';

const DEFAULT_PROVIDER = 'openai';
const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_TEMPERATURE = 0.2;
const DEFAULT_MAX_CONTEXT_MESSAGES = 20;
const DEFAULT_MAX_OUTPUT_TOKENS = 600;
const DEFAULT_TIMEOUT_MS = 20_000;
const OPENAI_CHAT_COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions';
const STORED_AI_CONFIG_KEYS = [
  'ai_model',
  'ai_temperature',
  'ai_system_prompt',
] as const;

export type AiProvider = 'openai';
export type AiApiKeySource = 'OPENAI_API_KEY' | null;

export type StoredAiConfig = Partial<
  Record<(typeof STORED_AI_CONFIG_KEYS)[number], string>
>;

export type AiRuntimeConfig = {
  provider: AiProvider;
  rawProvider: string;
  supportedProvider: boolean;
  apiKey: string | null;
  apiKeyConfigured: boolean;
  apiKeySource: AiApiKeySource;
  model: string;
  temperature: number;
  maxContextMessages: number;
  maxOutputTokens: number;
  timeoutMs: number;
  endpoint: string;
  cmsSystemPrompt: string | null;
  issues: string[];
};

export type PublicAiRuntimeStatus = Omit<AiRuntimeConfig, 'apiKey'>;

function normalizeProvider(value: string | undefined): {
  provider: AiProvider;
  rawProvider: string;
  supportedProvider: boolean;
} {
  const rawProvider = (value || DEFAULT_PROVIDER).trim().toLowerCase();

  if (rawProvider === DEFAULT_PROVIDER) {
    return {
      provider: DEFAULT_PROVIDER,
      rawProvider,
      supportedProvider: true,
    };
  }

  return {
    provider: DEFAULT_PROVIDER,
    rawProvider,
    supportedProvider: false,
  };
}

function getApiKey(): { apiKey: string | null; apiKeySource: AiApiKeySource } {
  const openAiApiKey = process.env.OPENAI_API_KEY?.trim();

  if (openAiApiKey) {
    return { apiKey: openAiApiKey, apiKeySource: 'OPENAI_API_KEY' };
  }

  return { apiKey: null, apiKeySource: null };
}

function parseInteger(
  value: string | undefined,
  fallback: number,
  options: { min: number; max: number }
): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(options.max, Math.max(options.min, Math.floor(parsed)));
}

function parseFloatInRange(
  value: string | undefined,
  fallback: number,
  options: { min: number; max: number }
): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(options.max, Math.max(options.min, parsed));
}

function firstNonEmpty(...values: Array<string | null | undefined>): string | null {
  for (const value of values) {
    const trimmed = value?.trim();

    if (trimmed) {
      return trimmed;
    }
  }

  return null;
}

export async function getStoredAiConfig(): Promise<StoredAiConfig> {
  try {
    const rows = await prisma.aiConfig.findMany({
      where: {
        key: {
          in: [...STORED_AI_CONFIG_KEYS],
        },
      },
      select: {
        key: true,
        value: true,
      },
    });

    return rows.reduce<StoredAiConfig>((acc, row) => {
      if (STORED_AI_CONFIG_KEYS.includes(row.key as (typeof STORED_AI_CONFIG_KEYS)[number])) {
        acc[row.key as (typeof STORED_AI_CONFIG_KEYS)[number]] = row.value;
      }

      return acc;
    }, {});
  } catch (error) {
    console.error('Failed to read stored AI config:', error);

    return {};
  }
}

export async function getAiRuntimeConfig(): Promise<AiRuntimeConfig> {
  const storedConfig = await getStoredAiConfig();
  const providerConfig = normalizeProvider(process.env.AI_PROVIDER);
  const { apiKey, apiKeySource } = getApiKey();
  const envTemperature = parseFloatInRange(
    process.env.AI_TEMPERATURE,
    DEFAULT_TEMPERATURE,
    { min: 0, max: 2 }
  );
  const temperature = parseFloatInRange(
    storedConfig.ai_temperature,
    envTemperature,
    { min: 0, max: 2 }
  );
  const model = firstNonEmpty(storedConfig.ai_model, process.env.AI_MODEL) ?? DEFAULT_MODEL;
  const cmsSystemPrompt = firstNonEmpty(storedConfig.ai_system_prompt);
  const issues: string[] = [];

  if (!providerConfig.supportedProvider) {
    issues.push(
      `Unsupported AI_PROVIDER "${providerConfig.rawProvider}". Only "openai" is currently implemented.`
    );
  }

  if (!apiKey) {
    issues.push('Missing OPENAI_API_KEY.');
  }

  return {
    ...providerConfig,
    apiKey: providerConfig.supportedProvider ? apiKey : null,
    apiKeyConfigured: Boolean(apiKey && providerConfig.supportedProvider),
    apiKeySource: providerConfig.supportedProvider ? apiKeySource : null,
    model,
    temperature,
    maxContextMessages: parseInteger(
      process.env.AI_MAX_CONTEXT_MESSAGES,
      DEFAULT_MAX_CONTEXT_MESSAGES,
      { min: 1, max: 100 }
    ),
    maxOutputTokens: parseInteger(
      process.env.AI_MAX_OUTPUT_TOKENS,
      DEFAULT_MAX_OUTPUT_TOKENS,
      { min: 64, max: 4000 }
    ),
    timeoutMs: parseInteger(process.env.AI_TIMEOUT_MS, DEFAULT_TIMEOUT_MS, {
      min: 1000,
      max: 120_000,
    }),
    endpoint: OPENAI_CHAT_COMPLETIONS_URL,
    cmsSystemPrompt,
    issues,
  };
}

export async function getAiPublicRuntimeStatus(): Promise<PublicAiRuntimeStatus> {
  const config = await getAiRuntimeConfig();

  return {
    provider: config.provider,
    rawProvider: config.rawProvider,
    supportedProvider: config.supportedProvider,
    apiKeyConfigured: config.apiKeyConfigured,
    apiKeySource: config.apiKeySource,
    model: config.model,
    temperature: config.temperature,
    maxContextMessages: config.maxContextMessages,
    maxOutputTokens: config.maxOutputTokens,
    timeoutMs: config.timeoutMs,
    endpoint: config.endpoint,
    cmsSystemPrompt: config.cmsSystemPrompt,
    issues: config.issues,
  };
}
