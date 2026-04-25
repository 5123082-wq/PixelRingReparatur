/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';

import {
  createAdminSession,
  requireAdminSession,
  verifyAdminSession,
} from '../src/lib/admin-auth.ts';
import { hashAdminPassword } from '../src/lib/admin-password.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(projectRoot, '.env.local'), quiet: true });
dotenv.config({ path: path.join(projectRoot, '.env'), quiet: true });

let prisma: any = null;
let ownerUserId: string | null = null;
let ownerSessionToken: string | null = null;
const createdArticleIds = new Set<string>();
const createdMediaIds = new Set<string>();

type CmsArticleRevisionRecord = {
  id: string;
  sourceAction: 'CREATE' | 'UPDATE' | 'PUBLISH' | 'UNPUBLISH';
  snapshot: unknown;
};

function buildArticleSnapshot(article: {
  locale: string;
  type: string;
  status: string;
  slug: string;
  title: string;
  symptomLabel: string | null;
  shortAnswer: string | null;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  relatedSlugs: string[];
  causes: string[];
  safeChecks: string[];
  urgentWarnings: string[];
  serviceProcess: string[];
  workScopeFactors: string[];
  ctaLabel: string | null;
  ctaHref: string | null;
  sortOrder: number;
  publishedAt: Date | null;
  lastReviewedAt: Date | null;
}) {
  return {
    locale: article.locale,
    type: article.type,
    status: article.status,
    slug: article.slug,
    title: article.title,
    symptomLabel: article.symptomLabel,
    shortAnswer: article.shortAnswer,
    content: article.content,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    canonicalUrl: article.canonicalUrl,
    relatedSlugs: article.relatedSlugs,
    causes: article.causes,
    safeChecks: article.safeChecks,
    urgentWarnings: article.urgentWarnings,
    serviceProcess: article.serviceProcess,
    workScopeFactors: article.workScopeFactors,
    ctaLabel: article.ctaLabel,
    ctaHref: article.ctaHref,
    sortOrder: article.sortOrder,
    publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
    lastReviewedAt: article.lastReviewedAt ? article.lastReviewedAt.toISOString() : null,
  };
}

async function createArticleRevision(
  articleId: string,
  sourceAction: 'CREATE' | 'UPDATE' | 'PUBLISH' | 'UNPUBLISH',
  article: any,
  actor: { adminUserId?: string; sessionId?: string; role?: string }
): Promise<void> {
  await prisma.cmsArticleRevision.create({
    data: {
      articleId,
      sourceAction,
      actorAdminUserId: actor.adminUserId ?? null,
      actorSessionId: actor.sessionId ?? null,
      actorRole: (actor.role as any) ?? null,
      snapshot: buildArticleSnapshot(article),
    },
  });
}

function buildRestoreDataFromSnapshot(snapshot: any) {
  return {
    locale: snapshot.locale,
    type: snapshot.type,
    status: 'DRAFT',
    slug: snapshot.slug,
    title: snapshot.title,
    symptomLabel: snapshot.symptomLabel ?? null,
    shortAnswer: snapshot.shortAnswer ?? null,
    content: snapshot.content,
    seoTitle: snapshot.seoTitle ?? null,
    seoDescription: snapshot.seoDescription ?? null,
    canonicalUrl: snapshot.canonicalUrl ?? null,
    relatedSlugs: Array.isArray(snapshot.relatedSlugs) ? snapshot.relatedSlugs : [],
    causes: Array.isArray(snapshot.causes) ? snapshot.causes : [],
    safeChecks: Array.isArray(snapshot.safeChecks) ? snapshot.safeChecks : [],
    urgentWarnings: Array.isArray(snapshot.urgentWarnings) ? snapshot.urgentWarnings : [],
    serviceProcess: Array.isArray(snapshot.serviceProcess) ? snapshot.serviceProcess : [],
    workScopeFactors: Array.isArray(snapshot.workScopeFactors) ? snapshot.workScopeFactors : [],
    ctaLabel: snapshot.ctaLabel ?? null,
    ctaHref: snapshot.ctaHref ?? null,
    sortOrder: Number.isFinite(snapshot.sortOrder) ? Math.trunc(snapshot.sortOrder) : 0,
    publishedAt: null,
    lastReviewedAt: snapshot.lastReviewedAt ? new Date(snapshot.lastReviewedAt) : null,
    deletedAt: null,
  };
}

function hasNeedle(value: unknown, needles: string[]): boolean {
  if (!value) return false;
  const source = typeof value === 'string' ? value : JSON.stringify(value);
  return needles.some((needle) => source.includes(needle));
}

async function findMediaUsageInCms(media: {
  id: string;
  storageKey: string;
  publicUrl: string;
}): Promise<Array<{ resourceType: 'CMS_ARTICLE' | 'CMS_PAGE'; resourceId: string; field: string }>> {
  const needles = [media.id, media.storageKey, media.publicUrl].filter(Boolean);
  if (needles.length === 0) return [];

  const [pages, articles] = await Promise.all([
    prisma.cmsPage.findMany({
      where: { deletedAt: null },
      select: { id: true, blocks: true },
    }),
    prisma.cmsArticle.findMany({
      where: { deletedAt: null },
      select: { id: true, content: true, shortAnswer: true },
    }),
  ]);

  const usage: Array<{ resourceType: 'CMS_ARTICLE' | 'CMS_PAGE'; resourceId: string; field: string }> = [];

  for (const page of pages) {
    if (hasNeedle(page.blocks, needles)) {
      usage.push({ resourceType: 'CMS_PAGE', resourceId: page.id, field: 'blocks' });
    }
  }

  for (const article of articles) {
    if (hasNeedle(article.content, needles)) {
      usage.push({ resourceType: 'CMS_ARTICLE', resourceId: article.id, field: 'content' });
      continue;
    }
    if (hasNeedle(article.shortAnswer, needles)) {
      usage.push({ resourceType: 'CMS_ARTICLE', resourceId: article.id, field: 'shortAnswer' });
    }
  }

  return usage;
}

async function cleanupCreatedData(): Promise<void> {
  if (!prisma) return;

  for (const articleId of createdArticleIds) {
    await prisma.cmsArticle
      .updateMany({
        where: { id: articleId },
        data: { deletedAt: new Date() },
      })
      .catch(() => {});
  }

  for (const mediaId of createdMediaIds) {
    await prisma.cmsMedia
      .updateMany({
        where: { id: mediaId },
        data: { deletedAt: new Date() },
      })
      .catch(() => {});
  }

  if (ownerUserId) {
    await prisma.adminUser
      .delete({
        where: { id: ownerUserId },
      })
      .catch(() => {});
  }
}

before(async () => {
  const prismaModule = await import('../src/lib/prisma.ts');
  prisma = prismaModule.prisma;

  const email = `stage2-runtime-owner-${Date.now()}@pixelring.test`;
  const passwordHash = await hashAdminPassword('Stage2RuntimePass123!');

  const owner = await prisma.adminUser.create({
    data: {
      email,
      displayName: 'Stage2 Runtime Owner',
      passwordHash,
      role: 'OWNER',
      status: 'ACTIVE',
    },
    select: { id: true },
  });

  ownerUserId = owner.id;
  ownerSessionToken = await createAdminSession(prisma, {
    adminUserId: owner.id,
    role: 'OWNER',
    label: 'Stage2 runtime test',
    ipAddress: '127.0.0.1',
    userAgent: 'stage2-runtime-test',
  });
});

after(async () => {
  await cleanupCreatedData();
  if (prisma) {
    await prisma.$disconnect().catch(() => {});
  }
});

test('runtime integration: auth verify, article lifecycle, revisions restore, media where-used', async () => {
  assert.ok(ownerSessionToken, 'Missing owner session token');

  const verified = await verifyAdminSession(prisma, ownerSessionToken);
  assert.ok(verified, 'verifyAdminSession should return active owner session');
  assert.equal(verified?.role, 'OWNER');

  const required = await requireAdminSession(prisma, ownerSessionToken, ['OWNER']);
  assert.ok(required, 'requireAdminSession should pass for OWNER role');
  assert.equal(required?.adminUserId, ownerUserId);

  const articleId = randomUUID();
  const articleSlug = `stage2-runtime-${Date.now()}-${randomUUID().slice(0, 8)}`;

  const createdArticle = await prisma.cmsArticle.create({
    data: {
      id: articleId,
      locale: 'de',
      type: 'SYMPTOM',
      status: 'DRAFT',
      slug: articleSlug,
      title: 'Stage2 Runtime Article',
      symptomLabel: 'Stage2 Runtime Symptom',
      shortAnswer: 'Draft short answer',
      content: 'Initial draft content',
      sortOrder: 0,
    },
  });
  createdArticleIds.add(articleId);

  await createArticleRevision(articleId, 'CREATE', createdArticle, required ?? {});

  const editedDraft = await prisma.cmsArticle.update({
    where: { id: articleId },
    data: {
      title: 'Stage2 Runtime Article (edited draft)',
      content: 'Updated draft content before publish',
      status: 'DRAFT',
    },
  });
  await createArticleRevision(articleId, 'UPDATE', editedDraft, required ?? {});

  const published = await prisma.cmsArticle.update({
    where: { id: articleId },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });
  await createArticleRevision(articleId, 'PUBLISH', published, required ?? {});

  const unpublished = await prisma.cmsArticle.update({
    where: { id: articleId },
    data: {
      status: 'DRAFT',
      publishedAt: null,
    },
  });
  await createArticleRevision(articleId, 'UNPUBLISH', unpublished, required ?? {});

  const revisions = (await prisma.cmsArticleRevision.findMany({
    where: { articleId },
    orderBy: [{ createdAt: 'desc' }],
    take: 20,
    select: {
      id: true,
      sourceAction: true,
      snapshot: true,
    },
  })) as CmsArticleRevisionRecord[];
  assert.ok(revisions.length >= 4, 'Expected CREATE/UPDATE/PUBLISH/UNPUBLISH revisions');
  assert.ok(
    revisions.some((item) => item.sourceAction === 'PUBLISH'),
    'Missing publish revision entry'
  );
  assert.ok(
    revisions.some((item) => item.sourceAction === 'UNPUBLISH'),
    'Missing unpublish revision entry'
  );

  const publishRevision = revisions.find((item) => item.sourceAction === 'PUBLISH');
  assert.ok(publishRevision, 'Publish revision is required for restore check');

  const restoreData = buildRestoreDataFromSnapshot(publishRevision?.snapshot);
  assert.ok(restoreData, 'Publish revision snapshot should be restorable');

  await prisma.cmsArticle.update({
    where: { id: articleId },
    data: restoreData,
  });

  const restored = await prisma.cmsArticle.findUnique({
    where: { id: articleId },
    select: { status: true, deletedAt: true },
  });
  assert.equal(restored?.status, 'DRAFT');
  assert.equal(restored?.deletedAt, null);

  const mediaId = randomUUID();
  const mediaUrl = `https://media.pixelring.test/${mediaId}.jpg`;
  const mediaStorageKey = `stage2-runtime/${mediaId}.jpg`;
  const checksumSha256 = randomUUID().replaceAll('-', '') + randomUUID().replaceAll('-', '');

  await prisma.cmsMedia.create({
    data: {
      id: mediaId,
      locale: 'de',
      usageType: 'ARTICLE',
      storageProvider: 'EXTERNAL',
      storageKey: mediaStorageKey,
      publicUrl: mediaUrl,
      originalFilename: 'stage2-runtime.jpg',
      title: 'Stage2 Runtime Media',
      altText: 'Stage2 Runtime Media',
      mimeType: 'image/jpeg',
      byteSize: 1024,
      checksumSha256,
      width: 1200,
      height: 800,
      meta: { test: true },
    },
  });
  createdMediaIds.add(mediaId);

  const mediaArticleId = randomUUID();
  await prisma.cmsArticle.create({
    data: {
      id: mediaArticleId,
      locale: 'de',
      type: 'SYMPTOM',
      status: 'DRAFT',
      slug: `stage2-runtime-media-ref-${Date.now()}-${randomUUID().slice(0, 6)}`,
      title: 'Stage2 media usage article',
      content: `Media reference in content: ${mediaUrl}`,
      sortOrder: 0,
    },
  });
  createdArticleIds.add(mediaArticleId);

  const usage = await findMediaUsageInCms({
    id: mediaId,
    storageKey: mediaStorageKey,
    publicUrl: mediaUrl,
  });

  assert.ok(usage.length > 0, 'Media where-used must detect article reference');
  assert.ok(
    usage.some((item) => item.resourceType === 'CMS_ARTICLE' && item.resourceId === mediaArticleId),
    'Media usage should include the referencing article'
  );
});
