import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

type RedactionResult =
  | string
  | {
      text?: string;
      redactedText?: string;
      body?: string;
    };

type RedactionFunction = (value: string) => RedactionResult | Promise<RedactionResult>;

type LoadedRedactor = {
  label: string;
  redact: (value: string) => Promise<string>;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HELPER_CANDIDATES: Array<{ modulePath: string; exportNames: string[] }> = [
  {
    modulePath: '../src/lib/ai/pii-redaction.ts',
    exportNames: [
      'redactPiiFromText',
      'redactPiiForAi',
      'redactAssistantVisiblePii',
      'redactChatIntakePii',
      'redactPii',
      'redactSensitiveText',
    ],
  },
  {
    modulePath: '../src/lib/ai/privacy-redaction.ts',
    exportNames: [
      'redactPiiFromText',
      'redactPiiForAi',
      'redactAssistantVisiblePii',
      'redactChatIntakePii',
      'redactPii',
      'redactSensitiveText',
    ],
  },
  {
    modulePath: '../src/lib/privacy/pii-redaction.ts',
    exportNames: [
      'redactPiiFromText',
      'redactPiiForAi',
      'redactAssistantVisiblePii',
      'redactChatIntakePii',
      'redactPii',
      'redactSensitiveText',
    ],
  },
];

async function loadRedactor(): Promise<LoadedRedactor | null> {
  for (const candidate of HELPER_CANDIDATES) {
    const moduleExports = await loadModuleExports(candidate.modulePath);

    if (!moduleExports) {
      continue;
    }

    for (const exportName of candidate.exportNames) {
      const maybeRedactor = moduleExports[exportName];

      if (typeof maybeRedactor !== 'function') {
        continue;
      }

      const redact = maybeRedactor as RedactionFunction;

      return {
        label: `${candidate.modulePath}#${exportName}`,
        redact: async (value: string) => normalizeRedactionResult(await redact(value)),
      };
    }
  }

  return null;
}

async function loadModuleExports(modulePath: string): Promise<Record<string, unknown> | null> {
  try {
    return (await import(modulePath)) as Record<string, unknown>;
  } catch {
    return loadTypeScriptModuleForNodeTest(modulePath);
  }
}

function loadTypeScriptModuleForNodeTest(modulePath: string): Record<string, unknown> | null {
  const absoluteModulePath = path.resolve(__dirname, modulePath);

  try {
    const source = readFileSync(absoluteModulePath, 'utf8').replace(
      /^import ['"]server-only['"];\s*/m,
      ''
    );
    const compiled = ts.transpileModule(source, {
      compilerOptions: {
        esModuleInterop: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    const localModule = { exports: {} as Record<string, unknown> };
    const localRequire = createRequire(import.meta.url);
    const execute = new Function(
      'exports',
      'require',
      'module',
      '__filename',
      '__dirname',
      compiled
    );

    execute(
      localModule.exports,
      localRequire,
      localModule,
      absoluteModulePath,
      path.dirname(absoluteModulePath)
    );

    return localModule.exports;
  } catch {
    return null;
  }
}

function normalizeRedactionResult(result: RedactionResult): string {
  if (typeof result === 'string') {
    return result;
  }

  if (typeof result.text === 'string') {
    return result.text;
  }

  if (typeof result.redactedText === 'string') {
    return result.redactedText;
  }

  if (typeof result.body === 'string') {
    return result.body;
  }

  throw new TypeError('PII redaction helper must return a string-like redacted text result.');
}

async function getRedactorOrSkip(t: Parameters<Parameters<typeof test>[1]>[0]) {
  const redactor = await loadRedactor();

  if (!redactor) {
    t.skip(
      'PII redaction helper is not present yet; this proposed test activates when the helper/export is added.'
    );
    return null;
  }

  return redactor;
}

test('chat intake PII redaction removes direct contact values but keeps service context', async (t) => {
  const redactor = await getRedactorOrSkip(t);
  if (!redactor) return;

  const output = await redactor.redact(
    'Bitte kontaktieren Sie mich unter anna.schmidt@example.com oder +49 170 1234567. Die LED-Leuchtreklame flackert seit gestern.'
  );

  assert.doesNotMatch(output, /anna\.schmidt@example\.com/i, redactor.label);
  assert.doesNotMatch(output, /\+49\s*170\s*1234567/i, redactor.label);
  assert.match(output, /LED|Leuchtreklame|flackert/i, redactor.label);
});

test('chat intake PII redaction removes name and address details from prefill text', async (t) => {
  const redactor = await getRedactorOrSkip(t);
  if (!redactor) return;

  const output = await redactor.redact(
    'Mein Name ist Anna Schmidt. Adresse: Musterstrasse 12, 10115 Berlin. Das Schild ist heruntergefallen.'
  );

  assert.doesNotMatch(output, /Anna\s+Schmidt/i, redactor.label);
  assert.doesNotMatch(output, /Musterstrasse\s+12/i, redactor.label);
  assert.doesNotMatch(output, /10115\s+Berlin/i, redactor.label);
  assert.match(output, /Schild|heruntergefallen/i, redactor.label);
});

test('chat intake PII redaction leaves non-PII problem descriptions usable', async (t) => {
  const redactor = await getRedactorOrSkip(t);
  if (!redactor) return;

  const input = 'Die Lichtwerbung am Eingang flackert und ein Buchstabe ist dunkel.';
  const output = await redactor.redact(input);

  assert.equal(output.trim(), input);
});
