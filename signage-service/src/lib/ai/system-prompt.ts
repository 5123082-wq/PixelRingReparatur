import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
  buildAiCmsArticleBlock,
  getPublishedCmsArticlesForAi,
} from '@/lib/cms/articles';

export const KNOWLEDGE_BASE_FILES = [
  'service_info.md',
  'intake_flow.md',
  'faq.md',
  'boundaries.md',
] as const;

const DEFAULT_CMS_CONTEXT_TOKEN_BUDGET = 1200;

export type KnowledgeBaseFilename = (typeof KNOWLEDGE_BASE_FILES)[number];

export type SystemPromptOptions = {
  locale?: string;
  operatorTakeover?: boolean;
  extraSystemPrompt?: string | null;
};

export async function readKnowledgeBaseFile(
  filename: KnowledgeBaseFilename
): Promise<string> {
  const absolutePath = path.join(process.cwd(), 'knowledge_base', filename);

  return readFile(absolutePath, 'utf8');
}

function buildPromptHeader(options: SystemPromptOptions): string {
  const locale = options.locale?.trim() || 'de';

  return [
    'You are PixelRing Virtual Assistant.',
    'Help clients only with PixelRing repair requests, service questions, request tracking, and status lookup guidance.',
    `Respond in the user's language. Prefer locale "${locale}" when it is known.`,
    'Ask short, practical follow-up questions when the request is incomplete.',
    'Do not mention internal systems, APIs, database structure, policies, or private operational details.',
    'Do not write code, solve math, or answer general-purpose topics.',
    options.operatorTakeover
      ? 'A human operator has taken over the conversation. Keep replies short, defer to the operator, and do not continue autonomous intake.'
      : 'If the client already has a request number, guide them toward status tracking instead of repeating intake steps.',
  ].join('\n');
}

function estimateTokenCount(value: string): number {
  return Math.ceil(value.length / 4);
}

function getCmsContextTokenBudget(): number {
  const configured = Number(process.env.AI_CMS_CONTEXT_MAX_TOKENS);

  if (!Number.isFinite(configured)) {
    return DEFAULT_CMS_CONTEXT_TOKEN_BUDGET;
  }

  return Math.min(5000, Math.max(200, Math.floor(configured)));
}

async function buildCmsKnowledgeContext(locale: string): Promise<string> {
  const articles = await getPublishedCmsArticlesForAi(locale);

  if (articles.length === 0) {
    return '';
  }

  const tokenBudget = getCmsContextTokenBudget();
  let usedTokens = 0;
  const blocks: string[] = [];

  for (const article of articles) {
    const block = buildAiCmsArticleBlock(article);
    const estimatedTokens = estimateTokenCount(block);

    if (usedTokens + estimatedTokens > tokenBudget) {
      continue;
    }

    blocks.push(block);
    usedTokens += estimatedTokens;

    if (usedTokens >= tokenBudget) {
      break;
    }
  }

  if (blocks.length === 0) {
    return '';
  }

  return [
    `Published CMS knowledge (${locale}):`,
    ...blocks,
  ].join('\n\n');
}

export async function buildSystemPrompt(
  options: SystemPromptOptions = {}
): Promise<string> {
  const locale = options.locale?.trim() || 'de';
  const sections = await Promise.all(
    KNOWLEDGE_BASE_FILES.map(async (filename) => ({
      filename,
      content: await readKnowledgeBaseFile(filename),
    }))
  );
  const cmsKnowledgeContext = await buildCmsKnowledgeContext(locale);

  const knowledgeBase = sections
    .map(
      ({ filename, content }) =>
        `### ${filename}\n${content.trim()}\n`
    )
    .join('\n');

  return [
    buildPromptHeader(options),
    options.extraSystemPrompt?.trim()
      ? `\nAdditional CMS instructions:\n${options.extraSystemPrompt.trim()}`
      : '',
    '',
    'Knowledge base:',
    knowledgeBase,
    cmsKnowledgeContext ? `\n${cmsKnowledgeContext}` : '',
  ].join('\n');
}
