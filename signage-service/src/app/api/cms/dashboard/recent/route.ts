import { CMS_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { requireAdminPermissionActor } from '@/lib/admin-audit';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_RESOURCE_TYPES = [
  'CMS_PAGE',
  'CMS_ARTICLE',
  'CMS_MEDIA',
  'CMS_SEO_CONFIG',
  'AI_CONFIG',
] as const;

const MAX_RECENT_AUDIT_ROWS = 300;
const MAX_RECENT_RESOURCE_ROWS = 24;
const MAX_RECENT_RESOURCE_EVENTS = 5;

type ResourceType = (typeof SUPPORTED_RESOURCE_TYPES)[number];

type RecentResourceEvent = {
  id: string;
  action: string;
  changedFields: string[];
  editedAt: string;
  editedBy: {
    name: string;
    email: string | null;
    role: string | null;
  };
};

type RecentResourceRow = {
  id: string;
  resourceType: ResourceType;
  resourceKind: string;
  title: string;
  context: string;
  locales: string[];
  status: string | null;
  editedAt: string;
  editedBy: {
    name: string;
    email: string | null;
    role: string | null;
  };
  action: string;
  changedFields: string[];
  eventCount: number;
  href: string;
  events: RecentResourceEvent[];
};

type AuditDetails = Record<string, unknown>;

function isSupportedResourceType(value: string): value is ResourceType {
  return (SUPPORTED_RESOURCE_TYPES as readonly string[]).includes(value);
}

function asRecord(value: unknown): AuditDetails {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as AuditDetails)
    : {};
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .map((item) => asString(item))
        .filter((item): item is string => Boolean(item))
    : [];
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function formatAction(action: string): string {
  return action
    .replace(/^CMS_/, '')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatFieldName(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .toLowerCase();
}

function getChangedFields(details: AuditDetails): string[] {
  const fields = [
    ...asStringArray(details.changedFields),
    ...asStringArray(details.changedKeys),
    ...asStringArray(details.submittedKeys),
  ];

  return unique(fields).map(formatFieldName).slice(0, 6);
}

function getActorName(log: {
  actorAdminUser: { displayName: string | null; email: string } | null;
  actorRole: string | null;
}): RecentResourceEvent['editedBy'] {
  return {
    name: log.actorAdminUser?.displayName || log.actorAdminUser?.email || 'System',
    email: log.actorAdminUser?.email ?? null,
    role: log.actorRole,
  };
}

function getResourceKind(resourceType: ResourceType): string {
  switch (resourceType) {
    case 'CMS_PAGE':
      return 'Page';
    case 'CMS_ARTICLE':
      return 'Article';
    case 'CMS_MEDIA':
      return 'Media';
    case 'CMS_SEO_CONFIG':
      return 'SEO';
    case 'AI_CONFIG':
      return 'AI';
    default:
      return 'Resource';
  }
}

function getHref(resourceType: ResourceType): string {
  switch (resourceType) {
    case 'CMS_PAGE':
      return '/ring-master-config/dashboard/pages';
    case 'CMS_ARTICLE':
      return '/ring-master-config/dashboard/articles';
    case 'CMS_MEDIA':
      return '/ring-master-config/dashboard/media';
    case 'CMS_SEO_CONFIG':
      return '/ring-master-config/dashboard/seo';
    case 'AI_CONFIG':
      return '/ring-master-config/dashboard/ai';
    default:
      return '/ring-master-config/dashboard';
  }
}

export async function GET(request: NextRequest) {
  if (
    !(await requireAdminPermissionActor(prisma, request, CMS_SESSION_COOKIE_NAME, [
      'CMS_PAGE_READ',
      'CMS_ARTICLE_READ',
      'CMS_MEDIA_READ',
    ]))
  ) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const logs = await prisma.adminAuditLog.findMany({
      where: {
        outcome: 'SUCCESS',
        resourceType: { in: [...SUPPORTED_RESOURCE_TYPES] },
      },
      orderBy: [{ createdAt: 'desc' }],
      take: MAX_RECENT_AUDIT_ROWS,
      select: {
        id: true,
        action: true,
        resourceType: true,
        resourceId: true,
        actorRole: true,
        details: true,
        createdAt: true,
        actorAdminUser: {
          select: {
            displayName: true,
            email: true,
          },
        },
      },
    });

    const pageIds = unique(
      logs
        .filter((log) => log.resourceType === 'CMS_PAGE' && log.resourceId)
        .map((log) => String(log.resourceId))
    );
    const articleIds = unique(
      logs
        .filter((log) => log.resourceType === 'CMS_ARTICLE' && log.resourceId)
        .map((log) => String(log.resourceId))
    );
    const mediaIds = unique(
      logs
        .filter((log) => log.resourceType === 'CMS_MEDIA' && log.resourceId)
        .map((log) => String(log.resourceId))
    );

    const [pages, articles, media] = await Promise.all([
      pageIds.length
        ? prisma.cmsPage.findMany({
            where: { id: { in: pageIds } },
            select: { id: true, pageKey: true, locale: true, title: true, status: true },
          })
        : [],
      articleIds.length
        ? prisma.cmsArticle.findMany({
            where: { id: { in: articleIds } },
            select: { id: true, locale: true, type: true, slug: true, title: true, status: true },
          })
        : [],
      mediaIds.length
        ? prisma.cmsMedia.findMany({
            where: { id: { in: mediaIds } },
            select: { id: true, locale: true, usageType: true, title: true, originalFilename: true },
          })
        : [],
    ]);

    const pageById = new Map(pages.map((page) => [page.id, page]));
    const articleById = new Map(articles.map((article) => [article.id, article]));
    const mediaById = new Map(media.map((item) => [item.id, item]));
    const grouped = new Map<string, RecentResourceRow>();

    for (const log of logs) {
      if (!isSupportedResourceType(log.resourceType)) continue;

      const details = asRecord(log.details);
      const resourceId = log.resourceId ?? log.resourceType;
      let groupKey: string = `${log.resourceType}:${resourceId}`;
      let title: string = getResourceKind(log.resourceType);
      let context: string = log.resourceType;
      let status: string | null = null;
      let locale = asString(details.locale);

      if (log.resourceType === 'CMS_PAGE') {
        const page = log.resourceId ? pageById.get(log.resourceId) : undefined;
        const pageKey = page?.pageKey ?? asString(details.pageKey) ?? resourceId;
        locale = page?.locale ?? locale;
        groupKey = `${log.resourceType}:${pageKey}`;
        title = page?.title || pageKey;
        context = pageKey;
        status = page?.status ?? asString(details.nextStatus) ?? asString(details.status);
      } else if (log.resourceType === 'CMS_ARTICLE') {
        const article = log.resourceId ? articleById.get(log.resourceId) : undefined;
        const type = article?.type ?? asString(details.type) ?? 'ARTICLE';
        const slug = article?.slug ?? asString(details.slug) ?? resourceId;
        locale = article?.locale ?? locale;
        groupKey = `${log.resourceType}:${type}:${slug}`;
        title = article?.title || slug;
        context = `${type} / ${slug}`;
        status = article?.status ?? asString(details.nextStatus) ?? asString(details.status);
      } else if (log.resourceType === 'CMS_MEDIA') {
        const item = log.resourceId ? mediaById.get(log.resourceId) : undefined;
        locale = item?.locale ?? locale;
        title = item?.title || item?.originalFilename || asString(details.filename) || 'Media asset';
        context = item?.usageType ?? asString(details.mimeType) ?? 'media';
        status = null;
      } else if (log.resourceType === 'CMS_SEO_CONFIG') {
        title = 'SEO settings';
        context = String(resourceId);
      } else if (log.resourceType === 'AI_CONFIG') {
        title = 'AI Knowledge settings';
        context = 'global';
      }

      const event: RecentResourceEvent = {
        id: log.id,
        action: formatAction(log.action),
        changedFields: getChangedFields(details),
        editedAt: log.createdAt.toISOString(),
        editedBy: getActorName(log),
      };

      const existing = grouped.get(groupKey);

      if (!existing) {
        grouped.set(groupKey, {
          id: groupKey,
          resourceType: log.resourceType,
          resourceKind: getResourceKind(log.resourceType),
          title,
          context,
          locales: locale ? [locale] : [],
          status,
          editedAt: event.editedAt,
          editedBy: event.editedBy,
          action: event.action,
          changedFields: event.changedFields,
          eventCount: 1,
          href: getHref(log.resourceType),
          events: [event],
        });
        continue;
      }

      if (locale && !existing.locales.includes(locale)) {
        existing.locales.push(locale);
      }

      existing.eventCount += 1;
      if (existing.events.length < MAX_RECENT_RESOURCE_EVENTS) {
        existing.events.push(event);
      }

      existing.changedFields = unique([
        ...existing.changedFields,
        ...event.changedFields,
      ]).slice(0, 6);
    }

    const resources = [...grouped.values()]
      .sort((a, b) => new Date(b.editedAt).getTime() - new Date(a.editedAt).getTime())
      .slice(0, MAX_RECENT_RESOURCE_ROWS)
      .map((item) => ({
        ...item,
        locales: unique(item.locales).sort(),
      }));

    return NextResponse.json({ resources });
  } catch (error) {
    console.error('API Error /api/cms/dashboard/recent (GET):', error);
    return NextResponse.json({ error: 'Failed to fetch recent CMS resources' }, { status: 500 });
  }
}
