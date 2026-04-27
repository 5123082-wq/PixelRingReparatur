'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

import { adminFetch } from '@/lib/admin-fetch';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type CmsPageKey =
  | 'home'
  | 'status'
  | 'global'
  | 'impressum'
  | 'privacy'
  | 'leistungen'
  | 'business'
  | 'probleme-loesungen';
type CmsPageStatus = 'DRAFT' | 'PUBLISHED';
type CmsPageBlock = Record<string, unknown> & {
  type?: string;
  key?: string;
  enabled?: boolean;
  sortOrder?: number;
};

type CmsPage = {
  id: string;
  pageKey: CmsPageKey;
  locale: string;
  status: CmsPageStatus;
  title: string;
  blocks: CmsPageBlock[];
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  publishedAt: string | null;
  lastReviewedAt: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

type PagesResponse = {
  pages?: CmsPage[];
  error?: string;
};

type CmsMedia = {
  id: string;
  usageType: string;
  title: string | null;
  alt: string | null;
  filename: string | null;
  url: string | null;
  mimeType: string | null;
};

/** One unified block: structure is shared, texts per locale. */
type UnifiedBlock = {
  type: string;
  key: string;
  enabled: boolean;
  sortOrder: number;
  /** Non-text fields shared across locales (media, ctaUrl, etc.) */
  shared: Record<string, unknown>;
  /** Per-locale text fields: { de: { title, subtitle }, en: { title, subtitle }, … } */
  texts: Record<string, Record<string, unknown>>;
};

/** Per-locale page metadata. */
type LocalePageMeta = {
  id: string | null; // null → page doesn't exist yet → will POST on save
  title: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  status: CmsPageStatus;
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

/** Unified editor state. */
type UnifiedFormState = {
  pageKey: CmsPageKey;
  blocks: UnifiedBlock[];
  localeMeta: Record<string, LocalePageMeta>;
};

type FilterLocale = 'ALL' | (typeof SUPPORTED_LOCALES)[number];
type FilterStatus = 'ALL' | CmsPageStatus;
type ContentWorkspaceTab = 'EDITOR' | 'RECENT' | 'GAPS';

type PageContentRow = {
  id: string;
  pageKey: CmsPageKey;
  blockKey: string;
  blockType: string;
  field: string;
  itemIndex: number;
  title: string;
  updatedAt: string;
  presentLocales: string[];
  draftLocales: string[];
  missingLocales: string[];
};

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────

const SUPPORTED_LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'] as const;
const PAGE_KEYS: CmsPageKey[] = [
  'home',
  'status',
  'global',
  'impressum',
  'privacy',
  'leistungen',
  'business',
  'probleme-loesungen',
];

/** Fields that are locale-specific text for each known block type.
 *  These MUST match the field names that getHomePageCmsContent / frontend components actually read. */
const BLOCK_TEXT_FIELDS: Record<string, string[]> = {
  hero: ['title', 'description', 'cta', 'titlePrefix', 'titleAccent', 'titleSuffix', 'pretitle', 'intro', 'ctaPrimary', 'ctaSecondary', 'trustBadge', 'responseBadge', 'imageAlt'],
  faqList: ['title', 'items'],
  textSection: ['title', 'description'],
  reviewList: ['title', 'subtitle', 'items'],
  cardList: ['title', 'titleStart', 'titleAccent', 'titleEnd', 'subtitle', 'description', 'copyright', 'items', 'steps', 'stats', 'features'],
  cta: ['servicePill', 'bookLabel', 'accountStatusLabel', 'accountStatusHref', 'requestLabel', 'requestHref', 'badge', 'title', 'intro', 'description', 'primaryLabel', 'secondaryLabel', 'links'],
  footerCta: ['title', 'subtitle', 'connectLabel', 'formTitle', 'formSubtitle'],
  excellence: ['title', 'subtitle', 'items'],
};

/** Structural keys never treated as shared or text — they live at the block root. */
const STRUCTURAL_KEYS = new Set(['type', 'key', 'enabled', 'sortOrder']);

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

function getLocale(value: string | string[] | undefined | null, fallback = 'de'): string {
  if (Array.isArray(value)) return value[0] || fallback;
  return value || fallback;
}

function toNullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isLegalPageKey(pageKey: CmsPageKey): boolean {
  return pageKey === 'impressum' || pageKey === 'privacy';
}

function validateBlocksForSave(
  pageKey: CmsPageKey,
  locale: string,
  blocks: CmsPageBlock[]
): string | null {
  if (pageKey !== 'impressum' && pageKey !== 'privacy') {
    return null;
  }

  if (locale !== 'de') {
    return null;
  }

  const mainContent = blocks.find(
    (block) => block.type === 'textSection' && block.key === 'mainContent'
  );

  if (!mainContent) {
    return 'Legal pages require the mainContent section. Reopen the page before saving.';
  }

  if (mainContent.enabled === false) {
    return 'Legal pages require the mainContent section to stay live.';
  }

  const description =
    typeof mainContent.description === 'string' ? mainContent.description.trim() : '';

  if (!description) {
    return 'Legal pages require description text in the mainContent section.';
  }

  return null;
}

function getTextFieldNames(blockType: string): string[] {
  return BLOCK_TEXT_FIELDS[blockType] || [];
}

async function readApiError(response: Response): Promise<string> {
  const data = (await response.json().catch(() => null)) as { error?: string } | null;
  return data?.error || `Request failed (${response.status})`;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function normalizeMediaResponse(value: unknown): CmsMedia[] {
  const container = value as { media?: unknown; items?: unknown } | null;
  const rows = Array.isArray(value)
    ? value
    : Array.isArray(container?.media)
      ? container.media
      : Array.isArray(container?.items)
        ? container.items
        : [];

  return rows
    .filter((row): row is Record<string, unknown> =>
      Boolean(row && typeof row === 'object' && !Array.isArray(row))
    )
    .map((row) => ({
      id: String(row.id ?? ''),
      usageType: asString(row.usageType) || 'GENERAL',
      title: asString(row.title),
      alt: asString(row.alt) || asString(row.altText),
      filename: asString(row.filename) || asString(row.originalFilename) || asString(row.name),
      url: asString(row.url) || asString(row.publicUrl) || asString(row.storageUrl),
      mimeType: asString(row.mimeType) || asString(row.mime),
    }))
    .filter((item) => item.id);
}

function isMediaField(field: string): boolean {
  return field === 'assetUrl' || field === 'image';
}

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

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown time';

  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function getNestedItemKey(item: unknown, index: number): string {
  if (!item || typeof item !== 'object') return `item-${index + 1}`;

  const record = item as Record<string, unknown>;
  return (
    asString(record.id) ||
    asString(record.key) ||
    asString(record.slug) ||
    `item-${index + 1}`
  );
}

function getNestedItemTitle(
  item: unknown,
  pageKey: CmsPageKey,
  blockKey: string,
  index: number
): string {
  if (blockKey === 'excellenceSection') return `Feed Post #${index + 1}`;
  if (!item || typeof item !== 'object') return `${blockKey} item #${index + 1}`;

  const record = item as Record<string, unknown>;
  return (
    asString(record.title) ||
    asString(record.label) ||
    asString(record.name) ||
    `${pageKey} / ${blockKey} item #${index + 1}`
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

function sortRowsByUpdatedAt(rows: PageContentRow[]): PageContentRow[] {
  return [...rows].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

function buildPageContentRows(pages: CmsPage[]): PageContentRow[] {
  const grouped = new Map<string, PageContentRow>();

  pages.forEach((page) => {
    page.blocks.forEach((block, blockIndex) => {
      const blockKey = asString(block.key) || asString(block.type) || `block-${blockIndex + 1}`;
      const blockType = asString(block.type) || 'block';

      Object.entries(block).forEach(([field, value]) => {
        if (!Array.isArray(value)) return;

        value.forEach((item, itemIndex) => {
          const itemKey = getNestedItemKey(item, itemIndex);
          const rowKey = `${page.pageKey}:${blockKey}:${field}:${itemKey}`;
          const existing = grouped.get(rowKey);
          const hasContent = hasMeaningfulNestedContent(item);
          const presentLocales =
            hasContent && page.status === 'PUBLISHED' ? [page.locale] : [];
          const draftLocales = hasContent && page.status === 'DRAFT' ? [page.locale] : [];
          const itemTitle = getNestedItemTitle(item, page.pageKey, blockKey, itemIndex);
          const next: PageContentRow = existing
            ? {
                ...existing,
                title: page.locale === 'de' ? itemTitle : existing.title,
                updatedAt:
                  new Date(page.updatedAt).getTime() > new Date(existing.updatedAt).getTime()
                    ? page.updatedAt
                    : existing.updatedAt,
                presentLocales: [...existing.presentLocales, ...presentLocales],
                draftLocales: [...existing.draftLocales, ...draftLocales],
              }
            : {
                id: rowKey,
                pageKey: page.pageKey,
                blockKey,
                blockType,
                field,
                itemIndex,
                title: itemTitle,
                updatedAt: page.updatedAt,
                presentLocales,
                draftLocales,
                missingLocales: [],
              };

          grouped.set(rowKey, next);
        });
      });
    });
  });

  return sortRowsByUpdatedAt(
    [...grouped.values()]
      .map((row) => {
        const presentLocales = SUPPORTED_LOCALES.filter((locale) =>
          row.presentLocales.includes(locale)
        );
        const draftLocales = SUPPORTED_LOCALES.filter((locale) =>
          row.draftLocales.includes(locale)
        );
        return {
          ...row,
          presentLocales,
          draftLocales,
          missingLocales: SUPPORTED_LOCALES.filter(
            (locale) => !presentLocales.includes(locale)
          ),
        };
      })
  );
}



// ── Merge / Split ───────────────────────────────────────

function mergeToUnified(allPages: CmsPage[]): {
  blocks: UnifiedBlock[];
  localeMeta: Record<string, LocalePageMeta>;
} {
  const localeMeta: Record<string, LocalePageMeta> = {};
  const blocksByKey: Record<string, Record<string, CmsPageBlock>> = {};

  for (const locale of SUPPORTED_LOCALES) {
    const page = allPages.find((p) => p.locale === locale);
    localeMeta[locale] = page
      ? {
          id: page.id,
          title: page.title,
          seoTitle: page.seoTitle || '',
          seoDescription: page.seoDescription || '',
          canonicalUrl: page.canonicalUrl || '',
          status: page.status,
          publishedAt: page.publishedAt,
          createdAt: page.createdAt,
          updatedAt: page.updatedAt,
        }
      : {
          id: null,
          title: '',
          seoTitle: '',
          seoDescription: '',
          canonicalUrl: '',
          status: 'DRAFT',
          publishedAt: null,
          createdAt: null,
          updatedAt: null,
        };

    if (page) {
      for (const block of page.blocks) {
        const key = block.key || `${block.type}-anon`;
        if (!blocksByKey[key]) blocksByKey[key] = {};
        blocksByKey[key][locale] = block;
      }
    }
  }

  // Master locale = DE preferred, fallback to first available
  const masterPage = allPages.find((p) => p.locale === 'de') || allPages[0];
  const blocks: UnifiedBlock[] = [];

  if (masterPage) {
    for (const block of masterPage.blocks) {
      const key = block.key || `${block.type}-anon`;
      const type = block.type || '';
      const textFields = getTextFieldNames(type);

      const shared: Record<string, unknown> = {};
      for (const [prop, val] of Object.entries(block)) {
        if (STRUCTURAL_KEYS.has(prop)) continue;
        if (textFields.includes(prop)) continue;
        shared[prop] = val;
      }

      const texts: Record<string, Record<string, unknown>> = {};
      for (const locale of SUPPORTED_LOCALES) {
        const lb = blocksByKey[key]?.[locale];
        const localeTexts: Record<string, unknown> = {};
        for (const tf of textFields) {
          localeTexts[tf] = lb ? (lb[tf] ?? '') : '';
          // Ensure items arrays are deep-cloned
          if (tf === 'items' && Array.isArray(localeTexts[tf])) {
            localeTexts[tf] = JSON.parse(JSON.stringify(localeTexts[tf]));
          }
        }
        texts[locale] = localeTexts;
      }

      blocks.push({ type, key, enabled: block.enabled !== false, sortOrder: block.sortOrder ?? blocks.length, shared, texts });
    }
  }

  return { blocks, localeMeta };
}

function splitToLocaleBlocks(blocks: UnifiedBlock[], locale: string): CmsPageBlock[] {
  return blocks.map((block, index) => ({
    type: block.type,
    key: block.key,
    enabled: block.enabled,
    sortOrder: index,
    ...block.shared,
    ...(block.texts[locale] || {}),
  }));
}




// ─────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────

const EMPTY_FORM: UnifiedFormState = {
  pageKey: 'home',
  blocks: [],
  localeMeta: Object.fromEntries(
    SUPPORTED_LOCALES.map((loc) => [
      loc,
      { id: null, title: '', seoTitle: '', seoDescription: '', canonicalUrl: '', status: 'DRAFT' as CmsPageStatus, publishedAt: null, createdAt: null, updatedAt: null },
    ])
  ),
};

export default function PagesPage() {
  const params = useParams();
  const routeLocale = getLocale(params?.locale);

  // ── Data state ──
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [mediaItems, setMediaItems] = useState<CmsMedia[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState('');

  // ── Editor state ──
  const [activePageKey, setActivePageKey] = useState<CmsPageKey | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | 'meta'>('meta');
  const [form, setForm] = useState<UnifiedFormState>(EMPTY_FORM);
  const [activeLocale, setActiveLocale] = useState(routeLocale);
  const [formError, setFormError] = useState('');
  const [formSaving, setFormSaving] = useState(false);
  const [pageFilter, setPageFilter] = useState<'ALL' | CmsPageKey>('ALL');
  const [blockFilter, setBlockFilter] = useState('ALL');
  const [localeFilter, setLocaleFilter] = useState<FilterLocale>('ALL');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [workspaceTab, setWorkspaceTab] = useState<ContentWorkspaceTab>('EDITOR');

  // ── Derived data ──
  const summary = useMemo(() => {
    const published = pages.filter((p) => p.status === 'PUBLISHED').length;
    const drafts = pages.filter((p) => p.status === 'DRAFT').length;
    return { total: pages.length, published, drafts };
  }, [pages]);

  const pageContentRows = useMemo(() => buildPageContentRows(pages), [pages]);

  const blockFilterOptions = useMemo(() => {
    const options = new Set<string>();
    pages.forEach((page) => {
      page.blocks.forEach((block, index) => {
        options.add(asString(block.key) || asString(block.type) || `block-${index + 1}`);
        if (asString(block.type)) options.add(String(block.type));
      });
    });
    return [...options].sort((a, b) => a.localeCompare(b));
  }, [pages]);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const pageMatchesFilters = useCallback(
    (pageKey: CmsPageKey) => {
      if (pageFilter !== 'ALL' && pageFilter !== pageKey) return false;

      const groupPages = pages.filter((page) => page.pageKey === pageKey);
      const { blocks } = mergeToUnified(groupPages);

      if (localeFilter !== 'ALL' && !groupPages.some((page) => page.locale === localeFilter)) {
        return false;
      }

      if (statusFilter !== 'ALL') {
        const statusPages =
          localeFilter === 'ALL'
            ? groupPages
            : groupPages.filter((page) => page.locale === localeFilter);
        if (!statusPages.some((page) => page.status === statusFilter)) return false;
      }

      if (
        blockFilter !== 'ALL' &&
        !blocks.some((block) => block.key === blockFilter || block.type === blockFilter)
      ) {
        return false;
      }

      if (normalizedSearch) {
        const rowMatch = pageContentRows.some(
          (row) =>
            row.pageKey === pageKey &&
            [row.title, row.blockKey, row.blockType, row.field].some((value) =>
              value.toLowerCase().includes(normalizedSearch)
            )
        );
        const blockMatch = blocks.some((block) =>
          [block.key, block.type].some((value) => value.toLowerCase().includes(normalizedSearch))
        );
        const pageMatch = pageKey.toLowerCase().includes(normalizedSearch);
        if (!pageMatch && !blockMatch && !rowMatch) return false;
      }

      return true;
    },
    [blockFilter, localeFilter, normalizedSearch, pageContentRows, pageFilter, pages, statusFilter]
  );

  const filteredPageKeys = useMemo(
    () => PAGE_KEYS.filter(pageMatchesFilters),
    [pageMatchesFilters]
  );

  const blockMatchesFilters = useCallback(
    (block: UnifiedBlock) => {
      if (blockFilter !== 'ALL' && block.key !== blockFilter && block.type !== blockFilter) {
        return false;
      }

      if (normalizedSearch) {
        const rowMatch = pageContentRows.some(
          (row) =>
            row.pageKey === form.pageKey &&
            row.blockKey === block.key &&
            [row.title, row.field].some((value) =>
              value.toLowerCase().includes(normalizedSearch)
            )
        );
        if (
          !block.key.toLowerCase().includes(normalizedSearch) &&
          !block.type.toLowerCase().includes(normalizedSearch) &&
          !rowMatch
        ) {
          return false;
        }
      }

      return true;
    },
    [blockFilter, form.pageKey, normalizedSearch, pageContentRows]
  );

  const visibleFormBlocks = useMemo(
    () =>
      form.blocks
        .map((block, index) => ({ block, index }))
        .filter(({ block }) => blockMatchesFilters(block)),
    [blockMatchesFilters, form.blocks]
  );

  const filteredContentRows = useMemo(() => {
    return pageContentRows
      .filter((row) => {
        if (pageFilter !== 'ALL' && row.pageKey !== pageFilter) return false;
        if (activePageKey && row.pageKey !== activePageKey) return false;
        if (blockFilter !== 'ALL' && row.blockKey !== blockFilter && row.blockType !== blockFilter) {
          return false;
        }
        if (localeFilter !== 'ALL') {
          const localeMatches =
            row.presentLocales.includes(localeFilter) ||
            row.draftLocales.includes(localeFilter) ||
            row.missingLocales.includes(localeFilter);
          if (!localeMatches) return false;
        }
        if (statusFilter === 'PUBLISHED' && row.presentLocales.length === 0) return false;
        if (statusFilter === 'DRAFT' && row.draftLocales.length === 0) return false;
        if (normalizedSearch) {
          const values = [row.title, row.pageKey, row.blockKey, row.blockType, row.field];
          if (!values.some((value) => value.toLowerCase().includes(normalizedSearch))) {
            return false;
          }
        }
        return true;
      })
      .slice(0, 12);
  }, [
    activePageKey,
    blockFilter,
    localeFilter,
    normalizedSearch,
    pageContentRows,
    pageFilter,
    statusFilter,
  ]);

  const filteredGapRows = useMemo(
    () => filteredContentRows.filter((row) => row.missingLocales.length > 0),
    [filteredContentRows]
  );

  const saveableLocales = useMemo(() => {
    const localesToSave = isLegalPageKey(form.pageKey) ? ['de'] : SUPPORTED_LOCALES;

    return localesToSave.filter((locale) => {
      const meta = form.localeMeta[locale];
      return meta && (meta.id !== null || meta.title.trim() !== '');
    });
  }, [form.localeMeta, form.pageKey]);

  const activeMeta = form.localeMeta[activeLocale] || form.localeMeta.de;
  const isEditingLegalPage = isLegalPageKey(form.pageKey);

  // ── Data loading ──
  const loadPages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminFetch('/api/cms/pages', { method: 'GET', cache: 'no-store' });
      const data = (await response.json().catch(() => ({}))) as PagesResponse;
      if (!response.ok) throw new Error(data.error || `Failed to load pages (${response.status}).`);
      setPages(data.pages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pages.');
      setPages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPages();
  }, [loadPages, refreshVersion]);

  const loadMediaItems = useCallback(async () => {
    setMediaLoading(true);
    setMediaError('');

    try {
      const response = await adminFetch('/api/cms/media', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      const data = (await response.json().catch(() => null)) as unknown;
      setMediaItems(normalizeMediaResponse(data));
    } catch (loadError) {
      setMediaItems([]);
      setMediaError(loadError instanceof Error ? loadError.message : 'Failed to load CMS media.');
    } finally {
      setMediaLoading(false);
    }
  }, []);

  const ensureMediaItems = useCallback(() => {
    if (mediaItems.length === 0 && !mediaLoading) {
      void loadMediaItems();
    }
  }, [loadMediaItems, mediaItems.length, mediaLoading]);

  // ── Editor open / close ──
  const selectPage = useCallback(
    (pageKey: CmsPageKey) => {
      const groupPages = pages.filter((p) => p.pageKey === pageKey);
      const { blocks, localeMeta } = mergeToUnified(groupPages);
      setForm({ pageKey, blocks, localeMeta });
      setActivePageKey(pageKey);
      setActiveSectionId('meta');
      setActiveLocale(isLegalPageKey(pageKey) ? 'de' : routeLocale);
      setFormError('');
      setFormSaving(false);
    },
    [pages, routeLocale]
  );

  const openContentRow = useCallback(
    (row: PageContentRow) => {
      selectPage(row.pageKey);
      setActiveSectionId(row.blockKey);
      setActiveLocale(
        isLegalPageKey(row.pageKey)
          ? 'de'
          : ((row.presentLocales[0] || row.draftLocales[0] || routeLocale) as string)
      );
      setWorkspaceTab('EDITOR');
    },
    [routeLocale, selectPage]
  );

  // ── Block operations ──
  const moveBlock = useCallback((index: number, direction: 'up' | 'down') => {
    setForm((curr) => {
      const next = [...curr.blocks];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return curr;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...curr, blocks: next };
    });
  }, []);

  const removeBlock = useCallback((index: number) => {
    if (!window.confirm('Remove this block from ALL locales?')) return;
    setForm((curr) => ({ ...curr, blocks: curr.blocks.filter((_, i) => i !== index) }));
  }, []);

  const addBlock = useCallback((type: string, customKey?: string) => {
    const key = customKey || `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const textFields = getTextFieldNames(type);

    const texts: Record<string, Record<string, unknown>> = {};
    for (const locale of SUPPORTED_LOCALES) {
      const lt: Record<string, unknown> = {};
      for (const tf of textFields) {
        lt[tf] = tf === 'items' ? [] : '';
      }
      if (type === 'cardList' && customKey === 'leistungenHero') {
        lt.items = [
          { id: 'repair', title: '', description: '', image: '/images/leistungen/hero-repair.png', cta: '' },
          { id: 'led', title: '', description: '', image: '/images/leistungen/hero-led-natural.png', cta: '' },
          { id: 'maintenance', title: '', description: '', image: '/images/leistungen/hero-maintenance.png', cta: '' },
          { id: 'branding', title: '', description: '', image: '/images/leistungen/hero-branding.png', cta: '' },
        ];
      }
      texts[locale] = lt;
    }

    const shared: Record<string, unknown> = {};
    if (type === 'hero') shared.assetUrl = '';
    if (type === 'cta' || type === 'footerCta') {
      shared.primaryHref = '';
    }

    setForm((curr) => ({
      ...curr,
      blocks: [...curr.blocks, { type, key, enabled: true, sortOrder: curr.blocks.length, shared, texts }],
    }));
    setActiveSectionId(key);
  }, []);

  const updateBlockStructure = useCallback((index: number, updates: Partial<Pick<UnifiedBlock, 'enabled' | 'key'>>) => {
    setForm((curr) => {
      const next = [...curr.blocks];
      next[index] = { ...next[index], ...updates };
      return { ...curr, blocks: next };
    });
  }, []);

  const updateBlockShared = useCallback((index: number, updates: Record<string, unknown>) => {
    setForm((curr) => {
      const next = [...curr.blocks];
      next[index] = { ...next[index], shared: { ...next[index].shared, ...updates } };
      return { ...curr, blocks: next };
    });
  }, []);

  const updateBlockText = useCallback((index: number, locale: string, updates: Record<string, unknown>) => {
    setForm((curr) => {
      const next = [...curr.blocks];
      const block = { ...next[index], texts: { ...next[index].texts } };

      // Identify if we are updating a field that should be synchronized across locales
      const syncedFields = ['primaryHref', 'href', 'url', 'image', 'icon'];
      const isSyncing = syncedFields.some((f) => f in updates);

      if (isSyncing) {
        for (const loc of SUPPORTED_LOCALES) {
          if (loc === locale) continue;
          const locTexts = { ...(block.texts[loc] || {}) };
          for (const f of syncedFields) {
            if (f in updates) locTexts[f] = updates[f];
          }
          block.texts[loc] = locTexts;
        }
      }

      block.texts[locale] = { ...(block.texts[locale] || {}), ...updates };
      next[index] = block;
      return { ...curr, blocks: next };
    });
  }, []);

  const addListItem = useCallback((blockIndex: number, field: string, defaultItem: Record<string, unknown>) => {
    setForm((curr) => {
      const next = [...curr.blocks];
      const block = { ...next[blockIndex], texts: { ...next[blockIndex].texts } };
      for (const locale of SUPPORTED_LOCALES) {
        const lt = { ...(block.texts[locale] || {}) };
        const items = Array.isArray(lt[field]) ? [...(lt[field] as Record<string, unknown>[])] : [];
        items.push({ ...defaultItem });
        lt[field] = items;
        block.texts[locale] = lt;
      }
      next[blockIndex] = block;
      return { ...curr, blocks: next };
    });
  }, []);

  const removeListItem = useCallback((blockIndex: number, field: string, itemIndex: number) => {
    setForm((curr) => {
      const next = [...curr.blocks];
      const block = { ...next[blockIndex], texts: { ...next[blockIndex].texts } };
      for (const locale of SUPPORTED_LOCALES) {
        const lt = { ...(block.texts[locale] || {}) };
        const items = Array.isArray(lt[field]) ? [...(lt[field] as Record<string, unknown>[])] : [];
        items.splice(itemIndex, 1);
        lt[field] = items;
        block.texts[locale] = lt;
      }
      next[blockIndex] = block;
      return { ...curr, blocks: next };
    });
  }, []);

  const updateListItem = useCallback(
    (blockIndex: number, field: string, itemIndex: number, updates: Record<string, unknown>) => {
      setForm((curr) => {
        const next = [...curr.blocks];
        const block = { ...next[blockIndex], texts: { ...next[blockIndex].texts } };

        // Identify if we are updating a field that should be synchronized across locales
        const syncedFields = ['id', 'href', 'image', 'icon'];
        const isSyncing = syncedFields.some((f) => f in updates);

        if (isSyncing) {
          for (const loc of SUPPORTED_LOCALES) {
            if (loc === activeLocale) continue;
            const locTexts = { ...(block.texts[loc] || {}) };
            const locItems = Array.isArray(locTexts[field]) ? [...(locTexts[field] as Record<string, unknown>[])] : [];
            if (locItems[itemIndex]) {
              locItems[itemIndex] = { ...locItems[itemIndex] };
              for (const f of syncedFields) {
                if (f in updates) locItems[itemIndex][f] = updates[f];
              }
            }
            locTexts[field] = locItems;
            block.texts[loc] = locTexts;
          }
        }

        const lt = { ...(block.texts[activeLocale] || {}) };
        const items = Array.isArray(lt[field]) ? [...(lt[field] as Record<string, unknown>[])] : [];
        items[itemIndex] = { ...items[itemIndex], ...updates };
        lt[field] = items;
        block.texts[activeLocale] = lt;

        next[blockIndex] = block;
        return { ...curr, blocks: next };
      });
    },
    [activeLocale]
  );

  // ── Locale meta updates ──
  const updateLocaleMeta = useCallback((locale: string, updates: Partial<LocalePageMeta>) => {
    setForm((curr) => ({
      ...curr,
      localeMeta: { ...curr.localeMeta, [locale]: { ...curr.localeMeta[locale], ...updates } },
    }));
  }, []);

  // ── Save all locales ──
  const saveAll = useCallback(async () => {
    if (saveableLocales.length === 0) {
      setFormError('No locales have content to save. Enter at least a title for one locale.');
      return;
    }
    setFormSaving(true);
    setFormError('');

    const results: { locale: string; success: boolean; error?: string }[] = [];

    await Promise.all(
      saveableLocales.map(async (locale) => {
        const meta = form.localeMeta[locale];
        const blocks = splitToLocaleBlocks(form.blocks, locale);
        const blockValidationError = validateBlocksForSave(form.pageKey, locale, blocks);

        if (blockValidationError) {
          results.push({ locale, success: false, error: blockValidationError });
          return;
        }

        const payload = {
          pageKey: form.pageKey,
          locale,
          status: meta.status,
          title: meta.title.trim() || `${form.pageKey} (${locale})`,
          blocks,
          seoTitle: toNullable(meta.seoTitle),
          seoDescription: toNullable(meta.seoDescription),
          canonicalUrl: toNullable(meta.canonicalUrl),
        };

        try {
          const response = meta.id
            ? await adminFetch(`/api/cms/pages/${meta.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              })
            : await adminFetch('/api/cms/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });

          if (!response.ok) {
            results.push({ locale, success: false, error: await readApiError(response) });
          } else {
            results.push({ locale, success: true });
          }
        } catch (err) {
          results.push({ locale, success: false, error: err instanceof Error ? err.message : 'Unknown error' });
        }
      })
    );

    const failures = results.filter((r) => !r.success);
    if (failures.length > 0) {
      setFormError(
        `Save failed for: ${failures.map((f) => `${f.locale.toUpperCase()} (${f.error})`).join(', ')}`
      );
    } else {
      setRefreshVersion((v) => v + 1);
    }
    setFormSaving(false);
  }, [form, saveableLocales]);

  // ─────────────────────────────────
  // Render Helpers
  // ─────────────────────────────────

  const MediaPreview = ({ url, alt }: { url: string; alt?: string }) => {
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
      setImgError(false);
    }, [url]);

    if (!url) return null;

    return (
      <div className="mt-3 relative group w-full aspect-video rounded-2xl border border-white/5 bg-black/40 overflow-hidden shadow-2xl">
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={alt || 'Preview'}
            className="w-full h-full object-contain bg-zinc-950/50"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-red-500/[0.03] border border-red-500/10">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-xl text-red-500/40">
              🖼️
            </div>
            <div className="flex flex-col items-center gap-1 text-center px-6">
              <span className="text-[10px] font-black text-red-500/60 uppercase tracking-[0.2em]">Image Load Failed</span>
              <span className="text-[9px] text-zinc-700 font-mono break-all max-w-full opacity-50">{url}</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
           <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-[10px] font-black text-white hover:bg-white/20 transition-all uppercase tracking-widest"
           >
             Open Original ↗
           </a>
        </div>
      </div>
    );
  };

  const MediaFieldEditor = ({ value, onSelect }: { value: string; onSelect: (url: string) => void }) => {
    const [pickerOpen, setPickerOpen] = useState(false);

    return (
      <div className="space-y-3">
        <MediaPreview url={value} />
        <div className="rounded-xl border border-white/[0.05] bg-black/30 p-3">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-400">
                Selected Media
              </div>
              <div className="mt-1 w-full truncate text-[10px] font-mono text-zinc-700" title={value}>
                {value || 'No image selected'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setPickerOpen((open) => !open);
                if (mediaItems.length === 0 && !mediaLoading) {
                  void loadMediaItems();
                }
              }}
              className="h-9 w-full shrink-0 rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 text-[9px] font-black uppercase tracking-widest text-violet-300 hover:bg-violet-500/20 transition-colors xl:w-auto"
            >
              {pickerOpen ? 'Close' : value ? 'Change image' : 'Choose image'}
            </button>
          </div>
          {pickerOpen ? (
            <div className="mt-3 border-t border-white/[0.04] pt-3">
              <MediaPicker
                onSelect={(url) => {
                  onSelect(url);
                  setPickerOpen(false);
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const MediaPicker = ({ onSelect }: { onSelect: (url: string) => void }) => {
    const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

    return (
      <div className="rounded-xl border border-white/[0.05] bg-black/30 p-3 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-400">
            Global Media
          </div>
          <div className="text-[10px] font-semibold text-zinc-700">
            Shared asset URL for every locale.
          </div>
        </div>
        <button
          type="button"
          onClick={() => void loadMediaItems()}
          className="h-8 px-3 rounded-lg border border-white/10 bg-white/[0.03] text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          {mediaLoading ? 'Loading' : 'Refresh'}
        </button>
      </div>

      {mediaError ? (
        <div className="rounded-lg border border-red-500/10 bg-red-500/5 px-3 py-2 text-[10px] font-bold text-red-400">
          {mediaError}
        </div>
      ) : null}

      {mediaItems.length === 0 ? (
        <button
          type="button"
          onClick={ensureMediaItems}
          className="h-9 w-full rounded-lg border border-dashed border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:border-violet-500/30 hover:text-violet-400 transition-colors"
        >
          {mediaLoading ? 'Loading media...' : 'Load media library'}
        </button>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {mediaItems.slice(0, 12).map((media) => (
            <button
              key={media.id}
              type="button"
              onClick={() => media.url && onSelect(media.url)}
              disabled={!media.url}
              title={media.title || media.filename || media.usageType}
              className="aspect-square overflow-hidden rounded-lg border border-white/5 bg-zinc-950 hover:border-violet-500/50 disabled:opacity-30 transition-all relative group"
            >
              {media.url && media.mimeType?.startsWith('image/') && !imgErrors[media.id] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={media.url}
                  alt={media.alt || ''}
                  className="h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  onError={() => setImgErrors(prev => ({ ...prev, [media.id]: true }))}
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center px-1 text-[8px] font-black uppercase text-zinc-700 bg-zinc-900/50">
                  {imgErrors[media.id] ? '! ERR' : media.usageType}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

  const renderActiveEditor = () => {
    if (activeSectionId === 'meta') {
      return (
        <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-[#0a0a0c] border border-white/[0.06] rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-white">
              <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm">⚙️</span>
              General Page Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em]">Page Title</label>
                <input
                  className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-zinc-700"
                  value={activeMeta?.title || ''}
                  onChange={(v) => updateLocaleMeta(activeLocale, { title: v.target.value })}
                  placeholder={`e.g. Home Page (${activeLocale.toUpperCase()})`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em]">Status</label>
                <div className="relative">
                  <select
                    className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500/50 outline-none transition-all appearance-none cursor-pointer"
                    value={activeMeta?.status || 'DRAFT'}
                    onChange={(v) => updateLocaleMeta(activeLocale, { status: v.target.value as CmsPageStatus })}
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-xs">▼</div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em]">SEO Title</label>
                <input
                  className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500/50 outline-none transition-all"
                  value={activeMeta?.seoTitle || ''}
                  onChange={(v) => updateLocaleMeta(activeLocale, { seoTitle: v.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em]">Canonical URL</label>
                <input
                  className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500/50 outline-none transition-all font-mono"
                  value={activeMeta?.canonicalUrl || ''}
                  onChange={(v) => updateLocaleMeta(activeLocale, { canonicalUrl: v.target.value })}
                />
              </div>
            </div>
            <div className="mt-8 space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em]">SEO Description</label>
              <textarea
                className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-white focus:border-cyan-500/50 outline-none transition-all resize-none min-h-[100px]"
                value={activeMeta?.seoDescription || ''}
                onChange={(e) => updateLocaleMeta(activeLocale, { seoDescription: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </div>
      );
    }

    const blockIndex = form.blocks.findIndex(b => b.key === activeSectionId);
    if (blockIndex === -1) return null;
    const block = form.blocks[blockIndex];
    const localeTexts = block.texts[activeLocale] || {};

    return (
      <div className="space-y-8 max-w-4xl pb-32 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="bg-[#0a0a0c] border border-white/[0.06] rounded-2xl p-8 shadow-2xl">
          <header className="flex items-center justify-between mb-10 pb-8 border-b border-white/[0.05]">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.08] flex items-center justify-center text-xl shadow-inner">
                {block.type === 'hero' ? '⚡' : block.type === 'faqList' ? '❓' : block.type === 'cardList' ? '🗂️' : '🧩'}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black text-white">{block.key}</h2>
                  <span className="text-[9px] font-black bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full uppercase tracking-widest border border-cyan-500/20">
                    {block.type}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 font-bold mt-1 uppercase tracking-wider">Editing {activeLocale.toUpperCase()} locale</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Visibility Toggle */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${block.enabled ? 'text-cyan-400' : 'text-zinc-600'}`}>
                  {block.enabled ? 'Live' : 'Hidden'}
                </span>
                <button
                  onClick={() => updateBlockStructure(blockIndex, { enabled: !block.enabled })}
                  className={`relative w-9 h-5 rounded-full transition-all duration-300 outline-none ${block.enabled ? 'bg-cyan-500/20' : 'bg-zinc-800'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full transition-all duration-300 ${block.enabled ? 'left-5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'left-1 bg-zinc-600'}`} />
                </button>
              </div>

              <div className="w-px h-4 bg-white/10 mx-1" />

              <button
                onClick={() => moveBlock(blockIndex, 'up')}
                disabled={blockIndex === 0}
                className="w-9 h-9 flex items-center justify-center bg-white/[0.03] border border-white/[0.05] rounded-xl hover:bg-white/[0.08] disabled:opacity-10 transition-colors"
              >
                <span className="text-xs">▲</span>
              </button>
              <button
                onClick={() => moveBlock(blockIndex, 'down')}
                disabled={blockIndex === form.blocks.length - 1}
                className="w-9 h-9 flex items-center justify-center bg-white/[0.03] border border-white/[0.05] rounded-xl hover:bg-white/[0.08] disabled:opacity-10 transition-colors"
              >
                <span className="text-xs">▼</span>
              </button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button
                onClick={() => removeBlock(blockIndex)}
                className="w-9 h-9 flex items-center justify-center bg-red-500/5 border border-red-500/10 text-red-500/60 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
              >
                <span className="text-sm">🗑️</span>
              </button>
            </div>
          </header>

          {/* 1. Shared (Structural) Fields */}
          {block.shared && Object.keys(block.shared).length > 0 && (
            <div className="mb-12 p-8 bg-violet-600/[0.03] border border-violet-600/10 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <div className="text-4xl font-black select-none">SHARED</div>
              </div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em]">Cross-Language Attributes</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(block.shared).map(([k, v]) => (
                  <div key={k} className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">{k}</label>
                    <input
                      className="w-full h-10 bg-black/40 border border-white/5 rounded-xl px-4 text-sm text-white focus:border-violet-500/50 outline-none transition-all font-mono"
                      value={String(v || '')}
                      onChange={(e) => updateBlockShared(blockIndex, { [k]: e.target.value })}
                    />
                    {isMediaField(k)
                      ? <MediaFieldEditor value={String(v || '')} onSelect={(url) => updateBlockShared(blockIndex, { [k]: url })} />
                      : null}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Locale Text Fields */}
          <div className="space-y-8">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">Localized Content ({activeLocale.toUpperCase()})</span>
             </div>

             {Object.entries(localeTexts).map(([k, v]) => {
                // Handle Lists (Items, FAQ, etc.)
                if (Array.isArray(v)) {
                  return (
                    <div key={k} className="pt-4 space-y-6">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.1em]">{k} ({v.length})</label>
                        <button
                          onClick={() => {
                            let defaultItem: Record<string, unknown> = { title: '', description: '' };
                            if (k === 'links') defaultItem = { label: '', href: '' };
                            else if (k === 'stats') defaultItem = { value: '', label: '', description: '' };
                            else if (k === 'features') defaultItem = { icon: '', label: '' };
                            else if (block.key === 'excellenceSection') defaultItem = { title: '', tag: '', description: '', image: '', imageAlt: '' };
                            else defaultItem = { title: '', description: '', image: '', imageAlt: '', cta: '' };

                            addListItem(blockIndex, k, defaultItem);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 rounded-xl text-[10px] font-black text-cyan-400 hover:from-cyan-500/20 hover:to-violet-500/20 transition-all active:scale-95 flex items-center gap-2"
                        >
                          <span className="text-sm">+</span>
                          {block.key === 'excellenceSection' ? 'ADD NEW POST' : 'ADD NEW ITEM'}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {v.map((item, ii) => {
                          const rawItem = item as Record<string, unknown>;
                          const isExcellence = block.key === 'excellenceSection';
                          // Normalize: if item has 'image' but no 'imageAlt', inject it for editing
                          const castItem = (rawItem.image !== undefined && rawItem.imageAlt === undefined)
                            ? { ...rawItem, imageAlt: '' }
                            : rawItem;

                          return (
                            <div
                              key={ii}
                              className={`
                                relative group/item transition-all duration-500
                                ${isExcellence
                                  ? 'bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] rounded-[2.5rem] p-10 hover:border-cyan-500/30'
                                  : 'p-6 bg-white/[0.02] border border-white/[0.04] rounded-2xl hover:border-white/10'
                                }
                              `}
                            >
                              <button
                                onClick={() => removeListItem(blockIndex, k, ii)}
                                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover/item:opacity-100 transition-all hover:bg-red-500 hover:text-white z-10"
                              >
                                ✕
                              </button>

                              {isExcellence && (
                                <div className="mb-8 flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center text-xs">
                                    📸
                                  </div>
                                  <div>
                                    <div className="text-[11px] font-black text-white uppercase tracking-widest">Feed Post #{ii + 1}</div>
                                    <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Instagram-style Content Card</div>
                                  </div>
                                </div>
                              )}

                              <div className={`grid grid-cols-1 ${isExcellence ? 'md:grid-cols-12 gap-10' : 'md:grid-cols-2 gap-5'}`}>
                                {isExcellence && (
                                  <div className="md:col-span-5 space-y-4">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                      Main Photo
                                    </label>
                                    <MediaFieldEditor
                                      value={String(castItem.image || '')}
                                      onSelect={(url) => updateListItem(blockIndex, k, ii, { image: url })}
                                    />
                                  </div>
                                )}

                                <div className={`${isExcellence ? 'md:col-span-7' : 'md:col-span-2'} grid grid-cols-1 md:grid-cols-2 gap-5`}>
                                  {Object.entries(castItem).map(([ik, iv]) => {
                                    if (isExcellence && ik === 'image') return null; // Already rendered in sidebar

                                    const isFullWidth = ik === 'description' || ik === 'answer' || ik === 'content';

                                    return (
                                      <div key={ik} className={`space-y-2 ${isFullWidth ? 'md:col-span-2' : ''}`}>
                                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{ik}</label>
                                        {isFullWidth ? (
                                          <textarea
                                            className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-xs text-zinc-300 outline-none focus:border-cyan-500/30 transition-all min-h-[100px] resize-none"
                                            value={String(iv || '')}
                                            onChange={(e) => updateListItem(blockIndex, k, ii, { [ik]: e.target.value })}
                                            placeholder={`Enter post ${ik}...`}
                                          />
                                        ) : (
                                          <input
                                            className="w-full h-11 bg-black/40 border border-white/5 rounded-xl px-4 text-xs text-zinc-300 outline-none focus:border-cyan-500/30 transition-all"
                                            value={String(iv || '')}
                                            onChange={(e) => updateListItem(blockIndex, k, ii, { [ik]: e.target.value })}
                                            placeholder={ik === 'tag' ? 'e.g. Design' : `Enter ${ik}...`}
                                          />
                                        )}
                                        {isMediaField(ik) && !isExcellence
                                          ? <MediaFieldEditor value={String(iv || '')} onSelect={(url) => updateListItem(blockIndex, k, ii, { [ik]: url })} />
                                          : null}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                // Handle Simple Text Fields
                return (
                  <div key={k} className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{k}</label>
                    {k === 'description' || k === 'intro' ? (
                      <textarea
                        className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-zinc-200 focus:border-cyan-500/50 outline-none transition-all min-h-[120px] shadow-inner"
                        value={String(v || '')}
                        onChange={(e) => updateBlockText(blockIndex, activeLocale, { [k]: e.target.value })}
                      />
                    ) : (
                      <input
                        className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-sm text-zinc-200 focus:border-cyan-500/50 outline-none transition-all shadow-inner"
                        value={String(v || '')}
                        onChange={(e) => updateBlockText(blockIndex, activeLocale, { [k]: e.target.value })}
                      />
                    )}
                    {isMediaField(k)
                      ? <MediaFieldEditor value={String(v || '')} onSelect={(url) => updateBlockText(blockIndex, activeLocale, { [k]: url })} />
                      : null}
                  </div>
                );
             })}
          </div>
        </div>

        {/* 3. Advanced JSON Mode */}
        <details className="group border border-white/[0.03] rounded-2xl overflow-hidden bg-black/20">
          <summary className="p-4 text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] cursor-pointer hover:text-zinc-500 transition-colors list-none flex items-center justify-between">
            Raw Block Payload ({activeLocale.toUpperCase()})
            <span className="text-[8px] opacity-50 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-4 pt-0">
            <div className="bg-black/50 rounded-xl p-4 border border-white/5 font-mono text-[11px] text-zinc-600 overflow-auto max-h-[300px]">
               {JSON.stringify(splitToLocaleBlocks([block], activeLocale)[0], null, 2)}
            </div>
          </div>
        </details>
      </div>
    );
  };

  // ─────────────────────────────────
  // Render
  // ─────────────────────────────────

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#050505]">
      {/* COLUMN 2: MODULE SIDEBAR */}
      <aside className="w-[280px] bg-[#08080a] border-r border-white/[0.06] flex flex-col shrink-0 overflow-hidden">
        <div className="p-10 border-b border-white/[0.04]">
          <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">Studio</span>
          <h2 className="text-xl font-black text-white mt-1">Page CMS</h2>
          <p className="mt-3 text-[10px] font-bold leading-relaxed text-zinc-600">
            {loading
              ? 'Loading page records...'
              : `${summary.total} records / ${summary.published} published / ${summary.drafts} draft`}
          </p>
          {error ? (
            <p className="mt-2 rounded-lg border border-red-500/10 bg-red-500/5 px-2 py-1.5 text-[10px] font-bold text-red-400">
              {error}
            </p>
          ) : null}
        </div>

        <div className="border-b border-white/[0.04] px-4 py-5 space-y-3">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search page, block, Feed Post #7"
            className="h-10 w-full rounded-xl border border-white/[0.07] bg-black/40 px-3 text-[11px] font-semibold text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-cyan-500/40"
          />
          <div className="grid grid-cols-2 gap-2">
            <FilterSelect
              label="Page"
              value={pageFilter}
              onChange={(value) => setPageFilter(value as 'ALL' | CmsPageKey)}
              options={[
                { value: 'ALL', label: 'All pages' },
                ...PAGE_KEYS.map((pageKey) => ({
                  value: pageKey,
                  label: pageKey.replace('-', ' '),
                })),
              ]}
            />
            <FilterSelect
              label="Block"
              value={blockFilter}
              onChange={setBlockFilter}
              options={[
                { value: 'ALL', label: 'All blocks' },
                ...blockFilterOptions.map((block) => ({ value: block, label: block })),
              ]}
            />
            <FilterSelect
              label="Locale"
              value={localeFilter}
              onChange={(value) => setLocaleFilter(value as FilterLocale)}
              options={[
                { value: 'ALL', label: 'All locales' },
                ...SUPPORTED_LOCALES.map((loc) => ({
                  value: loc,
                  label: loc.toUpperCase(),
                })),
              ]}
            />
            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as FilterStatus)}
              options={[
                { value: 'ALL', label: 'All status' },
                { value: 'PUBLISHED', label: 'Published' },
                { value: 'DRAFT', label: 'Draft' },
              ]}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setPageFilter('ALL');
              setBlockFilter('ALL');
              setLocaleFilter('ALL');
              setStatusFilter('ALL');
              setSearchQuery('');
            }}
            className="h-8 w-full rounded-lg border border-white/[0.06] bg-white/[0.02] text-[9px] font-black uppercase tracking-widest text-zinc-500 transition hover:border-white/10 hover:text-zinc-300"
          >
            Clear filters
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-10 scrollbar-hide">
          {/* Section: Pages */}
          <div className="space-y-4">
            <label className="px-4 text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em]">Active Page</label>
            <div className="space-y-1.5">
              {filteredPageKeys.map((pk) => (
                <div key={pk} className="flex flex-col">
                  <button
                    onClick={() => selectPage(pk)}
                    className={`w-full h-11 px-4 rounded-xl text-left text-sm font-bold transition-all flex items-center justify-between group shrink-0 ${
                      activePageKey === pk
                        ? 'bg-gradient-to-r from-white/[0.08] to-transparent text-white border-l-2 border-cyan-500'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
                    }`}
                  >
                    <span className="capitalize">{pk.replace('-', ' ')}</span>
                    {activePageKey === pk && (
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]" />
                    )}
                  </button>

                  {/* Nested Sections */}
                  {activePageKey === pk && (
                    <div className="mt-2 ml-4 pl-4 border-l border-white/5 space-y-1 py-2 animate-in slide-in-from-top-2 duration-300">
                      <button
                        onClick={() => setActiveSectionId('meta')}
                        className={`w-full h-9 px-3 rounded-lg text-left text-[12px] font-bold transition-all flex items-center gap-2.5 ${
                          activeSectionId === 'meta'
                            ? 'bg-white/5 text-white shadow-sm'
                            : 'text-zinc-600 hover:text-zinc-400'
                        }`}
                      >
                        <span className="text-xs opacity-40">⚙️</span> Settings
                      </button>

                      {visibleFormBlocks.map(({ block: b, index: bIdx }) => (
                        <div key={b.key} className="group/item relative">
                          <button
                            onClick={() => setActiveSectionId(b.key)}
                            className={`w-full h-9 px-3 rounded-lg text-left text-[12px] font-bold transition-all flex items-center gap-2.5 ${
                              activeSectionId === b.key
                                ? 'bg-cyan-500/10 text-cyan-400'
                                : 'text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.01]'
                            } ${!b.enabled ? 'opacity-40' : ''}`}
                          >
                            <span className="text-xs opacity-20 italic">#</span>
                            <span className="truncate pr-12">{b.key}</span>
                            {!b.enabled && <span className="ml-auto text-[8px] font-black text-zinc-500">OFF</span>}
                          </button>

                          {/* Sidebar Reorder Actions */}
                          <div className="absolute right-0 top-0 bottom-0 flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity bg-gradient-to-l from-[#08080a] via-[#08080a] to-transparent pl-8 pr-2 rounded-r-lg">
                            <button
                              onClick={(e) => { e.stopPropagation(); moveBlock(bIdx, 'up'); }}
                              disabled={bIdx === 0}
                              className="w-7 h-7 flex items-center justify-center text-[10px] text-zinc-500 hover:text-white hover:bg-white/5 rounded-md disabled:opacity-0 transition-all"
                            >
                              ▲
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); moveBlock(bIdx, 'down'); }}
                              disabled={bIdx === form.blocks.length - 1}
                              className="w-7 h-7 flex items-center justify-center text-[10px] text-zinc-500 hover:text-white hover:bg-white/5 rounded-md disabled:opacity-0 transition-all"
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                      ))}

                      {visibleFormBlocks.length === 0 ? (
                        <div className="px-3 py-4 text-[11px] font-semibold text-zinc-700">
                          No blocks match the current filters.
                        </div>
                      ) : null}

                      {/* Add Block Button nested */}
                      <div className="pt-2 px-3">
                         <div className="relative group/add">
                            <button className="w-full h-8 rounded-lg border border-dashed border-white/10 flex items-center justify-center gap-2 text-[10px] text-zinc-600 font-bold hover:border-cyan-500/30 hover:text-cyan-400 transition-all">
                              <span>+</span> Add Section
                            </button>
                            <div className="absolute left-0 bottom-10 hidden group-hover/add:block bg-[#111] border border-white/10 rounded-xl p-2 w-44 shadow-2xl z-50 animate-in zoom-in-95 duration-200">
                               {['hero', 'cardList', 'faqList', 'reviewList', 'textSection', 'cta', 'footerCta'].map(t => (
                                 <button
                                  key={t}
                                  onClick={() => addBlock(t)}
                                  className="w-full text-left px-3 py-2 text-[10px] font-bold hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg text-zinc-500 capitalize transition-colors"
                                 >
                                   {t.replace('List', '')}
                                 </button>
                               ))}
                            </div>
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {filteredPageKeys.length === 0 ? (
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-5 text-[11px] font-semibold text-zinc-600">
                  No pages match the current filters.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </aside>

      {/* COLUMN 3: CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#050505] relative overflow-hidden">
        {activePageKey ? (
          <>
            {/* Toolbar Header */}
            <header className="h-[90px] border-b border-white/[0.04] px-10 flex items-center justify-between shrink-0 bg-[#050505]/80 backdrop-blur-3xl z-40">
              <div className="flex items-center gap-10">
                <div className="flex flex-col">
                  <div className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-1">Editing</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white capitalize">{activePageKey}</span>
                    <span className="text-zinc-700 text-xs font-black">/</span>
                    <span className="text-sm font-bold text-zinc-500">{activeSectionId}</span>
                  </div>
                </div>

                {/* Locale Switcher */}
                {isEditingLegalPage ? (
                  <div className="h-10 px-4 rounded-xl border border-amber-400/20 bg-amber-400/10 flex items-center gap-3 shadow-inner">
                    <span className="rounded-lg bg-white px-3 py-1 text-[10px] font-black text-black">
                      DE
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-200">
                      German legal document
                    </span>
                  </div>
                ) : (
                  <div className="h-10 p-1 bg-black border border-white/5 rounded-xl flex gap-1 shadow-inner">
                    {SUPPORTED_LOCALES.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setActiveLocale(loc)}
                        className={`px-4 h-full rounded-lg text-[10px] font-black transition-all ${
                          activeLocale === loc
                            ? 'bg-gradient-to-br from-white to-zinc-300 text-black shadow-lg'
                            : 'text-zinc-600 hover:text-zinc-400 hover:bg-white/5'
                        }`}
                      >
                        {loc.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}

                <div className="h-10 p-1 bg-black border border-white/5 rounded-xl flex gap-1 shadow-inner">
                  {[
                    { id: 'EDITOR', label: 'Editor' },
                    { id: 'RECENT', label: 'Recent' },
                    { id: 'GAPS', label: 'Locale gaps' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setWorkspaceTab(tab.id as ContentWorkspaceTab)}
                      className={`px-4 h-full rounded-lg text-[10px] font-black transition-all ${
                        workspaceTab === tab.id
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                          : 'text-zinc-600 hover:text-zinc-400 hover:bg-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6">
                 {formError && (
                   <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
                     <span className="text-red-500 text-[10px] font-black uppercase">Error</span>
                     <span className="text-red-400/80 text-[11px] font-medium truncate max-w-[200px]">{formError}</span>
                   </div>
                 )}

                 <div className="flex items-center gap-3">
                   <button
                    onClick={() => saveAll()}
                    disabled={formSaving}
                    className="h-11 px-8 bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-[0_8px_24px_rgba(124,58,237,0.3)] hover:shadow-[0_12px_32px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                   >
                     {formSaving
                       ? 'Saving...'
                       : isEditingLegalPage
                         ? 'Save German Legal Page'
                         : 'Save All Locales'}
                   </button>
                 </div>
              </div>
            </header>

            {/* Scrollable Canvas */}
            <div className="flex-1 overflow-y-auto p-12 scrollbar-hide">
              {workspaceTab === 'EDITOR' ? renderActiveEditor() : null}
              {workspaceTab === 'RECENT' ? (
                <RecentContentChangesPanel
                  rows={filteredContentRows}
                  activePageKey={activePageKey}
                  onOpen={openContentRow}
                  mode="recent"
                />
              ) : null}
              {workspaceTab === 'GAPS' ? (
                <RecentContentChangesPanel
                  rows={filteredGapRows}
                  activePageKey={activePageKey}
                  onOpen={openContentRow}
                  mode="gaps"
                />
              ) : null}
            </div>
          </>
        ) : (
          /* Empty State / Dashboard */
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-in fade-in duration-1000">
            <div className="mb-12 w-full max-w-5xl text-left">
              <RecentContentChangesPanel
                rows={filteredContentRows}
                activePageKey={null}
                onOpen={openContentRow}
                mode="recent"
              />
            </div>
            <div className="relative mb-12">
               <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/20 via-violet-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center text-4xl shadow-2xl">
                🎨
              </div>
              <div className="absolute -inset-4 bg-violet-500/10 blur-3xl -z-10 rounded-full" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-4">Content Studio</h1>
            <p className="text-zinc-600 max-w-sm mx-auto text-sm font-medium leading-relaxed">
              Select a page from the sidebar to manage its dynamic sections and multi-language translations.
            </p>
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-12">
              {filteredPageKeys.slice(0, 4).map(pk => (
                <button
                  key={pk}
                  onClick={() => selectPage(pk)}
                  className="p-8 bg-white/[0.02] border border-white/[0.04] rounded-[2rem] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-4xl font-black uppercase select-none">{pk[0]}</span>
                  </div>
                  <div className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-1 group-hover:text-cyan-400 transition-colors">{pk}</div>
                  <div className="text-sm font-bold text-zinc-500 group-hover:text-white transition-colors">Open Editor</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-zinc-700">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full rounded-lg border border-white/[0.07] bg-black px-2 text-[10px] font-bold text-zinc-400 outline-none transition focus:border-cyan-500/40"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function RecentContentChangesPanel({
  rows,
  activePageKey,
  onOpen,
  mode,
}: {
  rows: PageContentRow[];
  activePageKey: CmsPageKey | null;
  onOpen: (row: PageContentRow) => void;
  mode: 'recent' | 'gaps';
}) {
  return (
    <section className="mb-8 rounded-2xl border border-white/[0.06] bg-[#0a0a0c] p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-black text-white">
            {mode === 'gaps' ? 'Locale gaps' : 'Recent page content changes'}
          </h2>
          <p className="mt-1 text-[11px] font-semibold text-zinc-600">
            {mode === 'gaps'
              ? `Published or draft items missing one or more MVP locales inside ${activePageKey || 'selected pages'}.`
              : `Nested cards and list items inside ${activePageKey || 'selected pages'}.`}
          </p>
        </div>
        <span className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-500">
          {rows.length} items
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl bg-white/[0.025] px-4 py-4 text-[12px] font-semibold text-zinc-600">
          {mode === 'gaps'
            ? 'No locale gaps match the current filters.'
            : 'No nested content items match the current filters.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
          {rows.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => onOpen(row)}
              className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-black text-zinc-100">{row.title}</div>
                  <div className="mt-1 truncate text-[11px] font-semibold text-zinc-600">
                    {row.pageKey} / {row.blockKey} / {row.field}
                  </div>
                </div>
                <span className="shrink-0 rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[9px] font-black uppercase tracking-wide text-zinc-500">
                  {row.blockType}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold">
                <span className="text-zinc-600">{formatDateTime(row.updatedAt)}</span>
                {row.presentLocales.length > 0 ? (
                  <span className="text-emerald-300">
                    Live: {row.presentLocales.join(', ').toUpperCase()}
                  </span>
                ) : null}
                {row.draftLocales.length > 0 ? (
                  <span className="text-amber-300">
                    Draft: {row.draftLocales.join(', ').toUpperCase()}
                  </span>
                ) : null}
                {row.missingLocales.length > 0 ? (
                  <span className="text-red-300">
                    Missing: {row.missingLocales.join(', ').toUpperCase()}
                  </span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
