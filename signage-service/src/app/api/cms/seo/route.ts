import { CMS_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { createAdminAuditLog, requireAdminPermissionActor, type AdminRequestActor } from '@/lib/admin-audit';
import { NextRequest, NextResponse } from 'next/server';

import { validateAdminCsrf } from '@/lib/admin-csrf';
import { prisma } from '@/lib/prisma';
import {
  buildSeoAudit,
  buildSeoConfigMap,
  isSeoConfigKey,
  normalizeSeoConfigValue,
  type SeoConfigKey,
  SEO_CONFIG_DEFAULTS,
} from '@/lib/cms/seo';

const SEO_CONFIG_KEYS = Object.keys(SEO_CONFIG_DEFAULTS) as SeoConfigKey[];

type SeoConfigPayload = Record<string, unknown>;

function hasOwnProperty(value: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function extractConfigPayload(body: unknown): SeoConfigPayload | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return null;
  }

  const record = body as Record<string, unknown>;
  const nestedConfig = record.config;

  if (nestedConfig && typeof nestedConfig === 'object' && !Array.isArray(nestedConfig)) {
    return nestedConfig as SeoConfigPayload;
  }

  return record;
}

async function requireOwnerActor(
  request: NextRequest
): Promise<AdminRequestActor | null> {
  return requireAdminPermissionActor(
    prisma,
    request,
    CMS_SESSION_COOKIE_NAME,
    ['CMS_SEO_READ']
  );
}

async function requireOwnerWriteActor(
  request: NextRequest
): Promise<AdminRequestActor | null> {
  return requireAdminPermissionActor(
    prisma,
    request,
    CMS_SESSION_COOKIE_NAME,
    ['CMS_SEO_WRITE']
  );
}

export async function GET(request: NextRequest) {
  if (!(await requireOwnerActor(request))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const [configRows, articles] = await Promise.all([
      prisma.cmsSeoConfig.findMany({
        select: { key: true, value: true },
        orderBy: { key: 'asc' },
      }),
      prisma.cmsArticle.findMany({
        where: {
          status: 'PUBLISHED',
          deletedAt: null,
        },
        select: {
          id: true,
          locale: true,
          slug: true,
          title: true,
          seoTitle: true,
          seoDescription: true,
          shortAnswer: true,
          canonicalUrl: true,
        },
        orderBy: [{ slug: 'asc' }, { locale: 'asc' }],
      }),
    ]);

    const config = buildSeoConfigMap(configRows);
    const audit = buildSeoAudit(articles);

    return NextResponse.json({ config, audit });
  } catch (error) {
    console.error('API Error /api/cms/seo (GET):', error);
    return NextResponse.json({ error: 'Failed to fetch SEO configuration' }, { status: 500 });
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
    const body = (await request.json().catch(() => null)) as unknown;
    const payload = extractConfigPayload(body);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid SEO configuration payload' }, { status: 400 });
    }

    const unknownKeys = Object.keys(payload).filter(
      (key) => !isSeoConfigKey(key)
    );

    if (unknownKeys.length > 0) {
      return NextResponse.json({ error: 'Invalid SEO configuration payload' }, { status: 400 });
    }

    const currentConfigRows = await prisma.cmsSeoConfig.findMany({
      where: { key: { in: SEO_CONFIG_KEYS } },
      select: { key: true, value: true },
    });
    const currentConfig = buildSeoConfigMap(currentConfigRows);
    const submittedKeys = SEO_CONFIG_KEYS.filter((key) => hasOwnProperty(payload, key));
    const updates = SEO_CONFIG_KEYS.flatMap((key) => {
      if (!hasOwnProperty(payload, key)) {
        return [];
      }

      const normalized = normalizeSeoConfigValue(key, payload[key]);

      if (normalized === null) {
        throw new Error(`Invalid value for ${key}`);
      }

      return [{ key, value: normalized }];
    });
    const changedKeys = updates
      .filter((update) => currentConfig[update.key] !== update.value)
      .map((update) => update.key);

    await prisma.$transaction(async (tx) => {
      for (const update of updates) {
        await tx.cmsSeoConfig.upsert({
          where: { key: update.key },
          update: { value: update.value },
          create: { key: update.key, value: update.value },
        });
      }

      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId,
        actorAdminUserId: actor.adminUserId,
        actorRole: actor.role,
        action: 'CMS_SEO_CONFIG_UPDATED',
        resourceType: 'CMS_SEO_CONFIG',
        resourceId: 'support-seo',
        details: {
          changedKeys,
          submittedKeys,
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Invalid value for ')) {
      return NextResponse.json({ error: 'Invalid SEO configuration payload' }, { status: 400 });
    }

    console.error('API Error /api/cms/seo (POST):', error);
    return NextResponse.json({ error: 'Failed to save SEO configuration' }, { status: 500 });
  }
}
