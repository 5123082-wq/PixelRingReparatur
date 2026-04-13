import type { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { CMS_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import {
  createAdminAuditLog,
  requireAdminActor,
  type AdminRequestActor,
} from '@/lib/admin-audit';
import {
  normalizeCmsPageBlocks,
  normalizeCmsPageKey,
  normalizeCmsPageLink,
  normalizeCmsPageLocale,
  normalizeCmsPageOptionalTitle,
  normalizeCmsPageSeoDescription,
  normalizeCmsPageStatus,
  normalizeCmsPageTitle,
  serializeCmsPage,
} from '@/lib/cms/pages';
import { prisma } from '@/lib/prisma';

const MAX_SEARCH_LENGTH = 200;

const CMS_PAGE_SELECT = {
  id: true,
  pageKey: true,
  locale: true,
  status: true,
  title: true,
  blocks: true,
  seoTitle: true,
  seoDescription: true,
  canonicalUrl: true,
  publishedAt: true,
  lastReviewedAt: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

function isPrismaUniqueError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002'
  );
}

async function requireOwnerActor(
  request: NextRequest
): Promise<AdminRequestActor | null> {
  return requireAdminActor(prisma, request, CMS_SESSION_COOKIE_NAME, ['OWNER']);
}

function normalizeOptionalText(
  value: unknown,
  normalize: (value: unknown) => string | null
): { ok: true; value: string | null } | { ok: false } {
  if (value === undefined || value === null) {
    return { ok: true, value: null };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { ok: true, value: null };
  }

  const normalized = normalize(value);
  return normalized === null ? { ok: false } : { ok: true, value: normalized };
}

function normalizeOptionalLink(
  value: unknown
): { ok: true; value: string | null } | { ok: false } {
  if (value === undefined || value === null) {
    return { ok: true, value: null };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { ok: true, value: null };
  }

  const normalized = normalizeCmsPageLink(value);
  return normalized === null ? { ok: false } : { ok: true, value: normalized };
}

function normalizeSearch(value: unknown): string | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 && normalized.length <= MAX_SEARCH_LENGTH ? normalized : null;
}

function buildPageWhere(searchParams: URLSearchParams) {
  const where: Record<string, unknown> = { deletedAt: null };

  if (searchParams.has('locale') && searchParams.get('locale')?.trim()) {
    const locale = normalizeCmsPageLocale(searchParams.get('locale'));
    if (!locale) return { error: 'Invalid page query parameters' } as const;
    where.locale = locale;
  }

  if (searchParams.has('pageKey') && searchParams.get('pageKey')?.trim()) {
    const pageKey = normalizeCmsPageKey(searchParams.get('pageKey'));
    if (!pageKey) return { error: 'Invalid page query parameters' } as const;
    where.pageKey = pageKey;
  }

  if (searchParams.has('status') && searchParams.get('status')?.trim()) {
    const status = normalizeCmsPageStatus(searchParams.get('status'));
    if (!status) return { error: 'Invalid page query parameters' } as const;
    where.status = status;
  }

  if (searchParams.has('search') && searchParams.get('search')?.trim()) {
    const search = normalizeSearch(searchParams.get('search'));
    if (!search) return { error: 'Invalid page query parameters' } as const;
    where.OR = [
      { pageKey: { contains: search, mode: 'insensitive' } },
      { title: { contains: search, mode: 'insensitive' } },
      { seoTitle: { contains: search, mode: 'insensitive' } },
      { seoDescription: { contains: search, mode: 'insensitive' } },
    ];
  }

  return { where } as const;
}

export async function GET(request: NextRequest) {
  if (!(await requireOwnerActor(request))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const whereResult = buildPageWhere(request.nextUrl.searchParams);

    if ('error' in whereResult) {
      return NextResponse.json({ error: whereResult.error }, { status: 400 });
    }

    const pages = await prisma.cmsPage.findMany({
      where: whereResult.where,
      orderBy: [{ pageKey: 'asc' }, { locale: 'asc' }, { updatedAt: 'desc' }],
      select: CMS_PAGE_SELECT,
    });

    return NextResponse.json({ pages: pages.map(serializeCmsPage) });
  } catch (error) {
    console.error('API Error /api/cms/pages (GET):', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requireOwnerActor(request);

  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

    if (!body) {
      return NextResponse.json({ error: 'Invalid page payload' }, { status: 400 });
    }

    const pageKey = normalizeCmsPageKey(body.pageKey);
    const locale = normalizeCmsPageLocale(body.locale);
    const status = normalizeCmsPageStatus(body.status);
    const title = normalizeCmsPageTitle(body.title);
    const blocks = normalizeCmsPageBlocks(body.blocks);
    const seoTitle = normalizeOptionalText(body.seoTitle, normalizeCmsPageOptionalTitle);
    const seoDescription = normalizeOptionalText(
      body.seoDescription,
      normalizeCmsPageSeoDescription
    );
    const canonicalUrl = normalizeOptionalLink(body.canonicalUrl);

    if (
      pageKey === null ||
      locale === null ||
      status === null ||
      title === null ||
      blocks === null ||
      !seoTitle.ok ||
      !seoDescription.ok ||
      !canonicalUrl.ok
    ) {
      return NextResponse.json({ error: 'Invalid page payload' }, { status: 400 });
    }

    const now = new Date();
    const publishedAt = status === 'PUBLISHED' ? now : null;

    const page = await prisma.$transaction(async (tx) => {
      const existing = await tx.cmsPage.findFirst({
        where: { pageKey, locale },
        select: { id: true },
      });

      if (existing) {
        return null;
      }

      const createdPage = await tx.cmsPage.create({
        data: {
          pageKey,
          locale,
          status,
          title,
          blocks: blocks as unknown as Prisma.InputJsonValue,
          seoTitle: seoTitle.value,
          seoDescription: seoDescription.value,
          canonicalUrl: canonicalUrl.value,
          publishedAt,
          deletedAt: null,
        },
        select: CMS_PAGE_SELECT,
      });

      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId,
        actorRole: actor.role,
        action: 'CMS_PAGE_CREATED',
        resourceType: 'CMS_PAGE',
        resourceId: createdPage.id,
        details: {
          pageKey: createdPage.pageKey,
          locale: createdPage.locale,
          status: createdPage.status,
          blockCount: Array.isArray(createdPage.blocks) ? createdPage.blocks.length : 0,
          publishedAtPresent: Boolean(createdPage.publishedAt),
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      });

      return createdPage;
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page already exists for page key and locale' },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, page: serializeCmsPage(page) }, { status: 201 });
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return NextResponse.json(
        { error: 'Page already exists for page key and locale' },
        { status: 409 }
      );
    }

    if (
      error instanceof Error &&
      error.message.includes(`Invalid enum value for argument`)
    ) {
      return NextResponse.json({ error: 'Invalid page payload' }, { status: 400 });
    }

    console.error('API Error /api/cms/pages (POST):', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
