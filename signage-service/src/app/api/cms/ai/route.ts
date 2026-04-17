import { CMS_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { createAdminAuditLog, requireAdminPermissionActor, type AdminRequestActor } from '@/lib/admin-audit';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import { getAiPublicRuntimeStatus } from '@/lib/ai/config';

const ALLOWED_MODELS = ['gpt-4o-mini', 'gpt-4o', 'o1-mini'] as const;

type AiConfigValue = {
  key: string;
  value: string;
};

function isAllowedModel(model: unknown): model is (typeof ALLOWED_MODELS)[number] {
  return typeof model === 'string' && ALLOWED_MODELS.includes(model as (typeof ALLOWED_MODELS)[number]);
}

function parseTemperature(value: unknown): number | null {
  const numericValue = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 2) {
    return null;
  }

  return numericValue;
}

async function requireOwnerActor(
  request: NextRequest
): Promise<AdminRequestActor | null> {
  return requireAdminPermissionActor(
    prisma,
    request,
    CMS_SESSION_COOKIE_NAME,
    ['CMS_AI_CONFIG_READ']
  );
}

async function requireOwnerWriteActor(
  request: NextRequest
): Promise<AdminRequestActor | null> {
  return requireAdminPermissionActor(
    prisma,
    request,
    CMS_SESSION_COOKIE_NAME,
    ['CMS_AI_CONFIG_WRITE']
  );
}

export async function GET(request: NextRequest) {
  if (!(await requireOwnerActor(request))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const configs = await prisma.aiConfig.findMany({
      select: { key: true, value: true },
    });
    const runtime = await getAiPublicRuntimeStatus();

    const configMap = configs.reduce<Record<string, string>>((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    const temperature = parseTemperature(configMap.ai_temperature);

    return NextResponse.json({
      systemPrompt: configMap.ai_system_prompt || '',
      model: isAllowedModel(configMap.ai_model) ? configMap.ai_model : runtime.model,
      temperature: temperature ?? runtime.temperature,
      runtime,
    });
  } catch (error) {
    console.error('API Error /api/cms/ai (GET):', error);
    return NextResponse.json({ error: 'Failed to fetch AI configuration' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requireOwnerWriteActor(request);

  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const body = (await request.json().catch(() => null)) as
      | {
          systemPrompt?: unknown;
          model?: unknown;
          temperature?: unknown;
        }
      | null;

    const systemPrompt = typeof body?.systemPrompt === 'string' ? body.systemPrompt : null;
    const model = isAllowedModel(body?.model) ? body.model : null;
    const temperature = parseTemperature(body?.temperature);

    if (systemPrompt === null || model === null || temperature === null) {
      return NextResponse.json({ error: 'Invalid AI configuration payload' }, { status: 400 });
    }

    const updates: AiConfigValue[] = [
      { key: 'ai_system_prompt', value: systemPrompt },
      { key: 'ai_model', value: model },
      { key: 'ai_temperature', value: temperature.toString() },
    ];
    const currentConfigs = await prisma.aiConfig.findMany({
      where: {
        key: {
          in: updates.map((update) => update.key),
        },
      },
      select: { key: true, value: true },
    });
    const currentConfigMap = currentConfigs.reduce<Record<string, string>>((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    const changedKeys = updates
      .filter((update) => currentConfigMap[update.key] !== update.value)
      .map((update) => update.key);

    await prisma.$transaction(async (tx) => {
      for (const update of updates) {
        await tx.aiConfig.upsert({
          where: { key: update.key },
          update: { value: update.value },
          create: { key: update.key, value: update.value },
        });
      }

      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId,
        actorAdminUserId: actor.adminUserId,
        actorRole: actor.role,
        action: 'CMS_AI_CONFIG_UPDATED',
        resourceType: 'AI_CONFIG',
        resourceId: 'global',
        details: {
          changedKeys,
          model,
          temperature,
          systemPromptLength: systemPrompt.length,
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error /api/cms/ai (POST):', error);
    return NextResponse.json({ error: 'Failed to save AI configuration' }, { status: 500 });
  }
}
