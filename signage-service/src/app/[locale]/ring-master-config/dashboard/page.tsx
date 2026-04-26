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

function sortByUpdatedAt<T extends { updatedAt: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
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
      const pagesData = (await pagesResponse.json().catch(() => ({}))) as {
        pages?: CmsPage[];
        error?: string;
      };

      if (!pagesResponse.ok) throw new Error(readApiError(pagesData));

      const articleGroups = await Promise.all(articleRequests);
      setArticles(articleGroups.flat());
      setPages(pagesData.pages ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load CMS dashboard data.');
      setArticles([]);
      setPages([]);
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

  const recentChanges = useMemo(
    () => sortByUpdatedAt([...pageContentUnits, ...articleItems, ...pageItems]).slice(0, 80),
    [articleItems, pageContentUnits, pageItems]
  );

  const editingItems = useMemo(
    () =>
      sortByUpdatedAt([...articleItems, ...pageItems].filter((item) => EDITING_STATUSES.has(item.status))).slice(
        0,
        8
      ),
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
      editing: allContent.filter((item) => EDITING_STATUSES.has(item.status)).length,
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
    <div className="flex h-full w-full flex-col gap-6 overflow-y-auto p-8 font-sans">
      <div className="flex flex-col gap-3">
        <h1 className="bg-gradient-to-r from-zinc-100 to-zinc-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          CMS Dashboard
        </h1>
        <p className="max-w-3xl text-sm font-medium text-zinc-400">
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

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <DashboardPanel
          title="Latest changes"
          description="Newest article and page updates across all CMS locales."
          emptyText={loading ? 'Loading changes...' : 'No CMS changes found.'}
        >
          {recentChanges.map((item) => (
            <ContentRow key={`${item.kind}:${item.id}`} item={item} onOpen={() => goTo(item.href)} />
          ))}
        </DashboardPanel>

        <DashboardPanel
          title="In editing"
          description="Drafts and review states that are not published yet."
          emptyText={loading ? 'Loading workflow...' : 'Nothing is currently in editing.'}
        >
          {editingItems.map((item) => (
            <ContentRow key={`${item.kind}:${item.id}`} item={item} onOpen={() => goTo(item.href)} />
          ))}
        </DashboardPanel>
      </section>

      <DashboardPanel
        title="Published with missing languages"
        description="Published content that does not yet have published coverage for all MVP locales."
        emptyText={loading ? 'Checking locale coverage...' : 'All published CMS content covers every MVP locale.'}
      >
        {localeGaps.map((gap) => (
          <button
            key={gap.id}
            type="button"
            onClick={() => goTo(gap.href)}
            className="grid w-full grid-cols-1 gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] md:grid-cols-[1fr_auto]"
          >
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <StatusPill>{gap.kind}</StatusPill>
                <span className="truncate text-sm font-bold text-zinc-100">{gap.title}</span>
              </div>
              <p className="truncate text-xs font-medium text-zinc-500">{gap.context}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <LocaleList label="Live" locales={gap.presentLocales} tone="green" />
              <LocaleList label="Missing" locales={gap.missingLocales} tone="amber" />
            </div>
          </button>
        ))}
      </DashboardPanel>

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
    <div className="rounded-xl border border-white/[0.07] bg-zinc-950/50 p-4">
      <div className={`text-2xl font-extrabold tracking-tight ${toneClass}`}>{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</div>
    </div>
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
