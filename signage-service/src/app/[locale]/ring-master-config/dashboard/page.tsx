'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { adminFetch } from '@/lib/admin-fetch';
import { getLocaleSegment, withLocalePath } from '../../admin-route';

type CmsArticleStatus =
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'ARCHIVED';

type CmsArticle = {
  id: string;
  locale: string;
  type: string;
  status: CmsArticleStatus;
  slug: string;
  title: string;
  updatedAt: string;
  publishedAt: string | null;
};

type CmsPageBlock = Record<string, unknown> & {
  type?: string;
  key?: string;
};

type CmsPage = {
  id: string;
  pageKey: string;
  locale: string;
  status: 'DRAFT' | 'PUBLISHED';
  title: string;
  blocks: CmsPageBlock[];
  updatedAt: string;
  publishedAt: string | null;
};

type CmsDashboardItem = {
  id: string;
  kind: 'Article' | 'Page' | 'Page item';
  title: string;
  context: string;
  locale: string;
  status: CmsArticleStatus | 'DRAFT' | 'PUBLISHED';
  updatedAt: string;
  href: string;
  filled?: boolean;
};

type RecentEditedResource = {
  id: string;
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
  events: Array<{
    id: string;
    action: string;
    changedFields: string[];
    editedAt: string;
    editedBy: {
      name: string;
      email: string | null;
      role: string | null;
    };
  }>;
};

type LocaleGap = {
  id: string;
  kind: 'Article' | 'Page' | 'Page item';
  title: string;
  context: string;
  presentLocales: string[];
  missingLocales: string[];
  href: string;
};

const SUPPORTED_LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'] as const;
const GERMAN_ONLY_LEGAL_PAGE_KEYS = new Set(['impressum', 'privacy']);
const EDITING_STATUSES = new Set<CmsArticleStatus | 'DRAFT' | 'PUBLISHED'>([
  'DRAFT',
  'IN_REVIEW',
  'APPROVED',
]);
const NON_CONTENT_ITEM_FIELDS = new Set([
  'id',
  'key',
  'slug',
  'image',
  'assetUrl',
  'icon',
  'href',
  'url',
  'ctaHref',
  'ctaUrl',
]);

function readApiError(value: unknown): string {
  if (value && typeof value === 'object' && 'error' in value) {
    const error = (value as { error?: unknown }).error;
    if (typeof error === 'string' && error.trim()) return error;
  }

  return 'Failed to load CMS dashboard data.';
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown time';

  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatDateParts(value: string): { date: string; time: string } {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { date: 'Unknown date', time: 'Unknown time' };
  }

  return {
    date: new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date),
    time: new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date),
  };
}

function sortByUpdatedAt<T extends { updatedAt: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

function isIntentionalGermanLegalDraft(item: CmsDashboardItem): boolean {
  return (
    item.kind === 'Page' &&
    item.status === 'DRAFT' &&
    item.locale !== 'de' &&
    GERMAN_ONLY_LEGAL_PAGE_KEYS.has(item.context)
  );
}

function uniqueLocales(locales: string[]): string[] {
  return SUPPORTED_LOCALES.filter((locale) => locales.includes(locale));
}

function asNonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function getBlockLabel(block: CmsPageBlock): string {
  return asNonEmptyString(block.key) ?? asNonEmptyString(block.type) ?? 'content block';
}

function getNestedItemKey(item: unknown, index: number): string | null {
  if (!item || typeof item !== 'object') return null;

  const record = item as Record<string, unknown>;
  return (
    asNonEmptyString(record.id) ??
    asNonEmptyString(record.key) ??
    asNonEmptyString(record.slug) ??
    asNonEmptyString(record.title) ??
    asNonEmptyString(record.label) ??
    `item-${index + 1}`
  );
}

function getNestedItemTitle(item: unknown, blockKey: string, index: number, fallback: string): string {
  if (blockKey === 'excellenceSection') return `Feed Post #${index + 1}`;
  if (!item || typeof item !== 'object') return fallback;

  const record = item as Record<string, unknown>;
  return (
    asNonEmptyString(record.title) ??
    asNonEmptyString(record.label) ??
    asNonEmptyString(record.name) ??
    fallback
  );
}

function hasMeaningfulNestedContent(item: unknown): boolean {
  if (typeof item === 'string') return item.trim().length > 0;
  if (!item || typeof item !== 'object') return false;

  return Object.entries(item as Record<string, unknown>).some(([key, value]) => {
    if (NON_CONTENT_ITEM_FIELDS.has(key)) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.some(hasMeaningfulNestedContent);
    return false;
  });
}

function extractPageContentUnits(page: CmsPage): CmsDashboardItem[] {
  return page.blocks.flatMap((block, blockIndex) => {
    const blockKey = asNonEmptyString(block.key) ?? asNonEmptyString(block.type) ?? `block-${blockIndex + 1}`;
    const blockLabel = getBlockLabel(block);
    const units: CmsDashboardItem[] = [];

    Object.entries(block).forEach(([field, value]) => {
      if (!Array.isArray(value)) return;

      value.forEach((item, index) => {
        const nestedKey = getNestedItemKey(item, index);
        if (!nestedKey) return;

        units.push({
          id: `page-item:${page.pageKey}:${blockKey}:${field}:${nestedKey}:${page.locale}`,
          kind: 'Page item',
          title: getNestedItemTitle(item, blockKey, index, `${blockLabel} ${index + 1}`),
          context: `${page.pageKey} / ${blockLabel} / ${field}`,
          locale: page.locale,
          status: page.status,
          updatedAt: page.updatedAt,
          href: '/ring-master-config/dashboard/pages',
          filled: hasMeaningfulNestedContent(item),
        });
      });
    });

    return units;
  });
}

function buildLocaleGaps(
  items: CmsDashboardItem[],
  getGroupKey: (item: CmsDashboardItem) => string
): LocaleGap[] {
  const grouped = new Map<string, CmsDashboardItem[]>();

  items.forEach((item) => {
    const key = getGroupKey(item);
    grouped.set(key, [...(grouped.get(key) ?? []), item]);
  });

  const gaps: LocaleGap[] = [];

  [...grouped.values()].forEach((group) => {
    const published = group.filter(
      (item) => item.status === 'PUBLISHED' && item.filled !== false
    );
    if (published.length === 0) return;

    const presentLocales = uniqueLocales(published.map((item) => item.locale));
    const missingLocales = SUPPORTED_LOCALES.filter(
      (locale) => !presentLocales.includes(locale)
    ).map((locale) => String(locale));
    if (missingLocales.length === 0) return;

    const newest = sortByUpdatedAt(published)[0];
    gaps.push({
      id: `${newest.kind}:${newest.context}:${newest.title}`,
      kind: newest.kind,
      title: newest.title,
      context: newest.context,
      presentLocales,
      missingLocales,
      href: newest.href,
    });
  });

  return gaps;
}

export default function CmsDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = getLocaleSegment(params?.locale);
  const [articles, setArticles] = useState<CmsArticle[]>([]);
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [recentEditedResources, setRecentEditedResources] = useState<RecentEditedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const articleRequests = SUPPORTED_LOCALES.map(async (cmsLocale) => {
        const params = new URLSearchParams({
          locale: cmsLocale,
          page: '1',
          pageSize: '100',
        });
        const response = await adminFetch(`/api/cms/articles?${params.toString()}`, {
          method: 'GET',
          cache: 'no-store',
        });
        const data = (await response.json().catch(() => ({}))) as {
          articles?: CmsArticle[];
          error?: string;
        };

        if (!response.ok) throw new Error(readApiError(data));
        return data.articles ?? [];
      });

      const pagesResponse = await adminFetch('/api/cms/pages', {
        method: 'GET',
        cache: 'no-store',
      });
      const recentResponse = await adminFetch('/api/cms/dashboard/recent', {
        method: 'GET',
        cache: 'no-store',
      });
      const pagesData = (await pagesResponse.json().catch(() => ({}))) as {
        pages?: CmsPage[];
        error?: string;
      };
      const recentData = (await recentResponse.json().catch(() => ({}))) as {
        resources?: RecentEditedResource[];
        error?: string;
      };

      if (!pagesResponse.ok) throw new Error(readApiError(pagesData));
      if (!recentResponse.ok) throw new Error(readApiError(recentData));

      const articleGroups = await Promise.all(articleRequests);
      setArticles(articleGroups.flat());
      setPages(pagesData.pages ?? []);
      setRecentEditedResources(recentData.resources ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load CMS dashboard data.');
      setArticles([]);
      setPages([]);
      setRecentEditedResources([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  const articleItems = useMemo<CmsDashboardItem[]>(
    () =>
      articles.map((article) => ({
        id: article.id,
        kind: 'Article',
        title: article.title,
        context: `${article.type} / ${article.slug}`,
        locale: article.locale,
        status: article.status,
        updatedAt: article.updatedAt,
        href: '/ring-master-config/dashboard/articles',
      })),
    [articles]
  );

  const pageItems = useMemo<CmsDashboardItem[]>(
    () =>
      pages.map((page) => ({
        id: page.id,
        kind: 'Page',
        title: page.title || page.pageKey,
        context: page.pageKey,
        locale: page.locale,
        status: page.status,
        updatedAt: page.updatedAt,
        href: '/ring-master-config/dashboard/pages',
      })),
    [pages]
  );

  const pageContentUnits = useMemo<CmsDashboardItem[]>(
    () => pages.flatMap(extractPageContentUnits),
    [pages]
  );

  const editingItems = useMemo(
    () =>
      sortByUpdatedAt(
        [...articleItems, ...pageItems].filter(
          (item) => EDITING_STATUSES.has(item.status) && !isIntentionalGermanLegalDraft(item)
        )
      ).slice(0, 8),
    [articleItems, pageItems]
  );

  const localeGaps = useMemo(() => {
    const articleGaps = buildLocaleGaps(articleItems, (item) => `article:${item.context}`);
    const pageGaps = buildLocaleGaps(pageItems, (item) => `page:${item.context}`);
    const pageItemGaps = buildLocaleGaps(pageContentUnits, (item) => `page-item:${item.context}:${item.title}`);

    return [...pageItemGaps, ...pageGaps, ...articleGaps].slice(0, 20);
  }, [articleItems, pageContentUnits, pageItems]);

  const summary = useMemo(() => {
    const allContent = [...articleItems, ...pageItems];
    return {
      total: allContent.length,
      published: allContent.filter((item) => item.status === 'PUBLISHED').length,
      editing: allContent.filter(
        (item) => EDITING_STATUSES.has(item.status) && !isIntentionalGermanLegalDraft(item)
      ).length,
      localeGaps: localeGaps.length,
    };
  }, [articleItems, localeGaps.length, pageItems]);

  const goTo = useCallback(
    (href: string) => {
      router.push(withLocalePath(locale, href));
    },
    [locale, router]
  );

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-y-auto p-5 font-sans">
      <div className="flex flex-col gap-1">
        <h1 className="bg-gradient-to-r from-zinc-100 to-zinc-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
          CMS Dashboard
        </h1>
        <p className="max-w-3xl text-xs font-medium text-zinc-500">
          Live editorial overview for website pages, content articles, locale coverage, and CMS work in progress.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
          {error}
        </div>
      ) : null}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Total CMS records" value={loading ? '...' : String(summary.total)} />
        <MetricCard label="Published" value={loading ? '...' : String(summary.published)} tone="green" />
        <MetricCard label="Editing now" value={loading ? '...' : String(summary.editing)} tone="amber" />
        <MetricCard label="Locale gaps" value={loading ? '...' : String(summary.localeGaps)} tone="blue" />
      </section>

      <RecentEditedResourcesTable
        items={recentEditedResources}
        loading={loading}
        onOpen={(href) => goTo(href)}
      />

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <DashboardPanel
          title="In editing"
          description="Drafts and review states that are not published yet."
          emptyText={loading ? 'Loading workflow...' : 'Nothing is currently in editing.'}
        >
          {editingItems.map((item) => (
            <ContentRow key={`${item.kind}:${item.id}`} item={item} onOpen={() => goTo(item.href)} />
          ))}
        </DashboardPanel>

        <DashboardPanel
          title="Published with missing languages"
          description="Published content without coverage for all MVP locales."
          emptyText={loading ? 'Checking locale coverage...' : 'All published CMS content covers every MVP locale.'}
        >
          {localeGaps.slice(0, 8).map((gap) => (
            <button
              key={gap.id}
              type="button"
              onClick={() => goTo(gap.href)}
              className="grid w-full grid-cols-1 gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]"
            >
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <StatusPill>{gap.kind}</StatusPill>
                  <span className="truncate text-sm font-bold text-zinc-100">{gap.title}</span>
                </div>
                <p className="truncate text-xs font-medium text-zinc-500">{gap.context}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <LocaleList label="Live" locales={gap.presentLocales} tone="green" />
                <LocaleList label="Missing" locales={gap.missingLocales} tone="amber" />
              </div>
            </button>
          ))}
        </DashboardPanel>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <QuickLinkCard
          title="Content & Wiki"
          detail="Articles, FAQ, and AI-ready knowledge."
          action="Open articles"
          onClick={() => goTo('/ring-master-config/dashboard/articles')}
        />
        <QuickLinkCard
          title="Page CMS"
          detail="Structured page blocks and homepage cards."
          action="Open pages"
          onClick={() => goTo('/ring-master-config/dashboard/pages')}
        />
        <QuickLinkCard
          title="Media Library"
          detail="Public CMS assets only."
          action="Open media"
          onClick={() => goTo('/ring-master-config/dashboard/media')}
        />
        <QuickLinkCard
          title="AI Knowledge"
          detail="Prompt and published knowledge context."
          action="Open AI"
          onClick={() => goTo('/ring-master-config/dashboard/ai')}
        />
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone = 'zinc',
}: {
  label: string;
  value: string;
  tone?: 'zinc' | 'green' | 'amber' | 'blue';
}) {
  const toneClass = {
    zinc: 'text-zinc-100',
    green: 'text-emerald-300',
    amber: 'text-amber-300',
    blue: 'text-cyan-300',
  }[tone];

  return (
    <div className="rounded-lg border border-white/[0.07] bg-zinc-950/50 p-3">
      <div className={`text-xl font-extrabold tracking-tight ${toneClass}`}>{value}</div>
      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{label}</div>
    </div>
  );
}

function RecentEditedResourcesTable({
  items,
  loading,
  onOpen,
}: {
  items: RecentEditedResource[];
  loading: boolean;
  onOpen: (href: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="rounded-xl border border-white/[0.07] bg-zinc-950/35 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-zinc-100">Recently edited resources</h2>
        </div>
        <div className="shrink-0 text-[11px] font-semibold text-zinc-500">
          {loading ? 'Loading history...' : `${items.length} recent resources`}
        </div>
      </div>

      {items.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-white/[0.07]">
          <div className="grid min-w-[900px] grid-cols-[minmax(260px,1.5fr)_104px_160px_150px_110px_54px] gap-0 border-b border-white/[0.07] bg-white/[0.035] px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
            <div>Resource</div>
            <div>Date</div>
            <div>User</div>
            <div>Locales</div>
            <div>Status</div>
            <div className="text-right">Open</div>
          </div>

          <div className="max-h-[280px] divide-y divide-white/[0.06] overflow-y-auto">
            {items.map((item) => {
              const editedAt = formatDateParts(item.editedAt);
              const isExpanded = expandedId === item.id;

              return (
                <div key={item.id} className="bg-white/[0.018]">
                  <div className="grid min-w-[900px] grid-cols-[minmax(260px,1.5fr)_104px_160px_150px_110px_54px] items-center gap-0 px-2 py-1 transition hover:bg-white/[0.025]">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="min-w-0 text-left"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <StatusPill>{item.resourceKind}</StatusPill>
                        <span className="truncate text-xs font-bold text-zinc-100">{item.title}</span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-zinc-500">
                        {item.context} / {item.action}
                        {item.changedFields.length > 0 ? ` / ${item.changedFields.slice(0, 2).join(', ')}` : ''}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="min-w-0 text-left"
                    >
                      <div className="text-xs font-bold text-zinc-100">{editedAt.date}</div>
                      <div className="text-[11px] font-medium text-zinc-500">{editedAt.time}</div>
                    </button>

                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-[10px] font-extrabold text-zinc-200">
                        {getActorInitials(item.editedBy.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-bold text-zinc-100">{item.editedBy.name}</div>
                        <div className="truncate text-[11px] font-medium text-zinc-500">
                          {item.editedBy.role ?? 'Admin'}
                        </div>
                      </div>
                    </div>

                    <LocaleChips locales={item.locales} />

                    <div className="flex min-w-0 items-center gap-1.5">
                      {item.status ? (
                        <StatusPill tone={item.status === 'PUBLISHED' ? 'green' : 'amber'}>
                          {item.status}
                        </StatusPill>
                      ) : (
                        <span className="text-xs font-semibold text-zinc-600">-</span>
                      )}
                      {item.eventCount > 1 ? (
                        <span className="truncate text-[10px] font-bold text-zinc-500">
                          {item.eventCount}e
                        </span>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpen(item.href)}
                      className="h-7 rounded-md border border-cyan-300/15 bg-cyan-300/10 px-2 text-[11px] font-bold text-cyan-200 transition hover:border-cyan-300/35 hover:bg-cyan-300/15"
                    >
                      Open
                    </button>
                  </div>

                  {isExpanded ? (
                    <div className="border-t border-white/[0.06] bg-black/10 px-2 py-2">
                      <div className="grid gap-1.5">
                        {item.events.map((event) => {
                          const eventDate = formatDateParts(event.editedAt);

                          return (
                            <div
                              key={event.id}
                            className="grid min-w-[860px] grid-cols-[120px_1fr_160px] gap-2 rounded-md bg-white/[0.025] px-2 py-1.5 text-[11px]"
                            >
                              <div className="font-semibold text-zinc-400">
                                {eventDate.date} {eventDate.time}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-zinc-200">{event.action}</span>
                                {event.changedFields.length > 0 ? (
                                  <span className="text-zinc-500"> / {event.changedFields.join(', ')}</span>
                                ) : null}
                              </div>
                              <div className="truncate font-semibold text-zinc-400">
                                {event.editedBy.name}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-white/[0.025] p-4 text-sm text-zinc-500">
          {loading ? 'Loading recent resource history...' : 'No recent CMS edit history found.'}
        </div>
      )}
    </section>
  );
}

function DashboardPanel({
  title,
  description,
  emptyText,
  children,
}: {
  title: string;
  description: string;
  emptyText: string;
  children: React.ReactNode;
}) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-zinc-950/35 p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-zinc-100">{title}</h2>
        <p className="mt-1 text-xs font-medium text-zinc-500">{description}</p>
      </div>
      <div className="flex flex-col gap-2">
        {hasChildren ? children : <div className="rounded-xl bg-white/[0.025] p-4 text-sm text-zinc-500">{emptyText}</div>}
      </div>
    </section>
  );
}

function getActorInitials(name: string): string {
  const parts = name
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return 'A';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function LocaleChips({ locales }: { locales: string[] }) {
  if (locales.length === 0) {
    return <span className="text-xs font-semibold text-zinc-600">Global</span>;
  }

  const visibleLocales = locales.slice(0, 4);
  const hiddenCount = locales.length - visibleLocales.length;

  return (
    <div className="flex flex-nowrap items-center gap-1 overflow-hidden">
      {visibleLocales.map((locale) => (
        <span
          key={locale}
          className="shrink-0 rounded border border-white/[0.08] bg-white/[0.035] px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-zinc-300"
        >
          {locale}
        </span>
      ))}
      {hiddenCount > 0 ? (
        <span className="shrink-0 rounded border border-cyan-300/15 bg-cyan-300/10 px-1.5 py-0.5 text-[10px] font-extrabold text-cyan-200">
          +{hiddenCount}
        </span>
      ) : null}
    </div>
  );
}

function ContentRow({ item, onOpen }: { item: CmsDashboardItem; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="grid w-full grid-cols-[1fr_auto] gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 text-left transition hover:border-violet-400/30 hover:bg-violet-400/[0.04]"
    >
      <div className="min-w-0">
        <div className="mb-1 flex min-w-0 items-center gap-2">
          <StatusPill>{item.kind}</StatusPill>
          <span className="truncate text-sm font-bold text-zinc-100">{item.title}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
          <span>{item.context}</span>
          <span className="text-zinc-700">/</span>
          <span className="uppercase text-zinc-400">{item.locale}</span>
          <span className="text-zinc-700">/</span>
          <span>{formatDateTime(item.updatedAt)}</span>
        </div>
      </div>
      <StatusPill tone={item.status === 'PUBLISHED' ? 'green' : 'amber'}>{item.status}</StatusPill>
    </button>
  );
}

function StatusPill({
  children,
  tone = 'zinc',
}: {
  children: React.ReactNode;
  tone?: 'zinc' | 'green' | 'amber';
}) {
  const toneClass = {
    zinc: 'border-white/[0.08] bg-white/[0.04] text-zinc-400',
    green: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    amber: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
  }[tone];

  return (
    <span className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${toneClass}`}>
      {children}
    </span>
  );
}

function LocaleList({
  label,
  locales,
  tone,
}: {
  label: string;
  locales: string[];
  tone: 'green' | 'amber';
}) {
  const toneClass = tone === 'green' ? 'text-emerald-300' : 'text-amber-300';

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold">
      <span className="text-zinc-600">{label}</span>
      <span className={toneClass}>{locales.join(', ').toUpperCase()}</span>
    </div>
  );
}

function QuickLinkCard({
  title,
  detail,
  action,
  onClick,
}: {
  title: string;
  detail: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-white/[0.07] bg-zinc-950/35 p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]"
    >
      <h3 className="text-sm font-bold text-zinc-100">{title}</h3>
      <p className="mt-1 min-h-[32px] text-xs font-medium leading-relaxed text-zinc-500">{detail}</p>
      <div className="mt-4 text-xs font-bold uppercase tracking-wide text-cyan-300">{action}</div>
    </button>
  );
}
