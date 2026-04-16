'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useParams } from 'next/navigation';

import { adminFetch } from '@/lib/admin-fetch';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type CmsPageKey = 'home' | 'support' | 'status' | 'global';
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

type PageGroup = {
  pageKey: CmsPageKey;
  pages: Record<string, CmsPage>;
};

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────

const SUPPORTED_LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'] as const;
const PAGE_KEYS: CmsPageKey[] = ['home', 'support', 'status', 'global'];

/** Fields that are locale-specific text for each known block type.
 *  These MUST match the field names that getHomePageCmsContent / frontend components actually read. */
const BLOCK_TEXT_FIELDS: Record<string, string[]> = {
  hero: ['titlePrefix', 'titleAccent', 'titleSuffix', 'pretitle', 'intro', 'ctaPrimary', 'ctaSecondary', 'trustBadge', 'responseBadge'],
  faqList: ['title', 'items'],
  textSection: ['title', 'description'],
  reviewList: ['title', 'subtitle', 'items'],
  cardList: ['title', 'titleStart', 'titleAccent', 'titleEnd', 'subtitle', 'description', 'copyright', 'items', 'steps', 'stats', 'features'],
  cta: ['servicePill', 'bookLabel', 'badge', 'title', 'intro', 'description', 'primaryLabel', 'secondaryLabel', 'links'],
  footerCta: ['title', 'subtitle', 'connectLabel', 'formTitle', 'formSubtitle'],
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

function renderDate(value: string | null | undefined): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function getTextFieldNames(blockType: string): string[] {
  return BLOCK_TEXT_FIELDS[blockType] || [];
}

async function readApiError(response: Response): Promise<string> {
  const data = (await response.json().catch(() => null)) as { error?: string } | null;
  return data?.error || `Request failed (${response.status})`;
}

function parseBlocksJson(value: string): { ok: true; blocks: CmsPageBlock[] } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return { ok: false, error: 'Blocks JSON must be an array.' };
    if (parsed.some((b) => !b || typeof b !== 'object' || Array.isArray(b))) {
      return { ok: false, error: 'Each block must be a JSON object.' };
    }
    return { ok: true, blocks: parsed as CmsPageBlock[] };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Invalid JSON.' };
  }
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

function getLocaleStatus(group: PageGroup, locale: string): 'published' | 'draft' | 'missing' {
  const page = group.pages[locale];
  if (!page) return 'missing';
  return page.status === 'PUBLISHED' ? 'published' : 'draft';
}

function latestUpdate(group: PageGroup): string | null {
  let latest: string | null = null;
  for (const page of Object.values(group.pages)) {
    if (!latest || page.updatedAt > latest) latest = page.updatedAt;
  }
  return latest;
}

function blockCount(group: PageGroup): number {
  const first = Object.values(group.pages)[0];
  return first ? first.blocks.length : 0;
}

// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────

function EditorField({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label style={styles.field}>
      <span style={styles.fieldLabel}>{label}</span>
      {children}
      {hint ? <span style={styles.fieldHint}>{hint}</span> : null}
    </label>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={styles.input} />;
}

function SelectInput({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: ReactNode }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.input}>
      {children}
    </select>
  );
}

function ListEditor({
  label,
  items,
  onAdd,
  onRemove,
  renderItem,
}: {
  label: string;
  items: Record<string, unknown>[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: Record<string, unknown>, index: number) => ReactNode;
}) {
  return (
    <div style={styles.faqItemsContainer}>
      <div style={styles.faqItemsHeader}>
        <span style={styles.faqItemsLabel}>{label} ({items.length})</span>
        <button type="button" style={styles.addBlockBtn} onClick={onAdd}>
          + Add Item
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} style={styles.faqItemCard}>
          <div style={styles.faqItemHeader}>
            <span style={styles.faqItemIndex}>#{i + 1}</span>
            <button type="button" style={styles.iconBtnDanger} onClick={() => onRemove(i)}>🗑️</button>
          </div>
          {renderItem(item, i)}
        </div>
      ))}
      {items.length === 0 ? (
        <div style={styles.emptyBlocks}>No items. Click &quot;+ Add Item&quot; — items are added to ALL locales.</div>
      ) : null}
    </div>
  );
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

  // ── Editor state ──
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState<UnifiedFormState>(EMPTY_FORM);
  const [activeLocale, setActiveLocale] = useState(routeLocale);
  const [formError, setFormError] = useState('');
  const [formSaving, setFormSaving] = useState(false);

  // ── Derived data ──
  const pageGroups = useMemo((): PageGroup[] => {
    return PAGE_KEYS.map((pk) => ({
      pageKey: pk,
      pages: Object.fromEntries(pages.filter((p) => p.pageKey === pk).map((p) => [p.locale, p])),
    }));
  }, [pages]);

  const summary = useMemo(() => {
    const published = pages.filter((p) => p.status === 'PUBLISHED').length;
    const drafts = pages.filter((p) => p.status === 'DRAFT').length;
    return { total: pages.length, published, drafts };
  }, [pages]);

  const saveableLocales = useMemo(() => {
    return SUPPORTED_LOCALES.filter((locale) => {
      const meta = form.localeMeta[locale];
      return meta && (meta.id !== null || meta.title.trim() !== '');
    });
  }, [form.localeMeta]);

  const activeMeta = form.localeMeta[activeLocale] || form.localeMeta.de;

  // ── Data loading ──
  const loadPages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/cms/pages', { method: 'GET', credentials: 'same-origin', cache: 'no-store' });
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

  // ── Editor open / close ──
  const openEditor = useCallback(
    (pageKey: CmsPageKey) => {
      const groupPages = pages.filter((p) => p.pageKey === pageKey);
      const { blocks, localeMeta } = mergeToUnified(groupPages);
      setForm({ pageKey, blocks, localeMeta });
      setActiveLocale(routeLocale);
      setFormError('');
      setFormSaving(false);
      setEditorOpen(true);
    },
    [pages, routeLocale]
  );

  const closeEditor = useCallback(() => {
    setEditorOpen(false);
    setFormError('');
    setFormSaving(false);
  }, []);

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

  const addBlock = useCallback((type: string) => {
    const key = `${type}-${Math.random().toString(36).slice(2, 7)}`;
    const textFields = getTextFieldNames(type);

    const texts: Record<string, Record<string, unknown>> = {};
    for (const locale of SUPPORTED_LOCALES) {
      const lt: Record<string, unknown> = {};
      for (const tf of textFields) {
        lt[tf] = tf === 'items' ? [] : '';
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
  }, []);

  const updateBlockStructure = useCallback((index: number, updates: Partial<Pick<UnifiedBlock, 'enabled'>>) => {
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
        const syncedFields = ['href', 'image', 'icon'];
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

  /** Add a FAQ item to ALL locales (structure is shared). */
  const addFaqItem = useCallback((blockIndex: number) => {
    addListItem(blockIndex, 'items', { question: '', answer: '' });
  }, [addListItem]);

  /** Remove a FAQ item from ALL locales (structure is shared). */
  const removeFaqItem = useCallback((blockIndex: number, itemIndex: number) => {
    removeListItem(blockIndex, 'items', itemIndex);
  }, [removeListItem]);

  /** Update a single FAQ item's text for the ACTIVE locale only. */
  const updateFaqItem = useCallback(
    (blockIndex: number, itemIndex: number, updates: Record<string, string>) => {
      updateListItem(blockIndex, 'items', itemIndex, updates);
    },
    [updateListItem]
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
      setEditorOpen(false);
      setRefreshVersion((v) => v + 1);
    }
    setFormSaving(false);
  }, [form, saveableLocales]);

  // ── Advanced mode: raw JSON for active locale ──
  const activeLocaleBlocks = useMemo(() => {
    return JSON.stringify(splitToLocaleBlocks(form.blocks, activeLocale), null, 2);
  }, [form.blocks, activeLocale]);

  // ─────────────────────────────────
  // Render
  // ─────────────────────────────────

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Page Content</h1>
          <p style={styles.subtitle}>
            Unified multi-locale editor. Click <strong>Edit</strong> to open all locales for a page section at once.
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={styles.statRow}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Records</span>
          <span style={styles.statValue}>{summary.total}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Published</span>
          <span style={styles.statValue}>{summary.published}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Drafts</span>
          <span style={styles.statValue}>{summary.drafts}</span>
        </div>
      </div>

      {error ? <div style={styles.errorBanner}>{error}</div> : null}

      {/* ── Table grouped by pageKey ── */}
      {loading ? (
        <div style={styles.emptyState}>Loading pages...</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Page Section</th>
                <th style={styles.th}>Locales</th>
                <th style={styles.th}>Blocks</th>
                <th style={styles.th}>Updated</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageGroups.map((group) => (
                <tr key={group.pageKey} style={styles.tr}>
                  <td style={styles.td}>
                    <strong style={styles.monoValue}>{group.pageKey}</strong>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.localeDotsRow}>
                      {SUPPORTED_LOCALES.map((loc) => {
                        const st = getLocaleStatus(group, loc);
                        return (
                          <span key={loc} style={styles.localeDotWrap} title={`${loc.toUpperCase()}: ${st}`}>
                            <span
                              style={{
                                ...styles.localeDot,
                                background:
                                  st === 'published' ? '#86efac' : st === 'draft' ? '#fbbf24' : '#3f3f46',
                                boxShadow:
                                  st === 'published'
                                    ? '0 0 6px rgba(134,239,172,0.4)'
                                    : st === 'draft'
                                      ? '0 0 6px rgba(251,191,36,0.3)'
                                      : 'none',
                              }}
                            />
                            <span style={styles.localeDotLabel}>{loc.toUpperCase()}</span>
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td style={styles.td}>{blockCount(group)}</td>
                  <td style={styles.td}>{renderDate(latestUpdate(group))}</td>
                  <td style={styles.td}>
                    <button type="button" onClick={() => openEditor(group.pageKey)} style={styles.primaryButton}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Unified Editor Modal ── */}
      {editorOpen && (
        <div style={styles.modalOverlay} onClick={closeEditor}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* ── Editor Header ── */}
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>
                  Unified Editor: <span style={styles.monoValue}>{form.pageKey}</span>
                </h2>
                <p style={styles.modalSubtitle}>
                  Edit all locales at once. Blocks structure is shared. Switch locale tabs to edit texts.
                </p>
              </div>
              <button type="button" onClick={closeEditor} style={styles.closeButton}>
                Close
              </button>
            </div>

            {/* ── Global Locale Tabs ── */}
            <div style={styles.localeTabRow}>
              {SUPPORTED_LOCALES.map((loc) => {
                const meta = form.localeMeta[loc];
                const isActive = activeLocale === loc;
                const isNew = meta?.id === null;
                const hasContent = (meta?.title?.trim() || '') !== '';
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setActiveLocale(loc)}
                    style={isActive ? styles.localeTabActive : styles.localeTab}
                  >
                    <span
                      style={{
                        ...styles.localeTabDot,
                        background: isNew
                          ? hasContent
                            ? '#7c3aed'
                            : '#3f3f46'
                          : meta.status === 'PUBLISHED'
                            ? '#86efac'
                            : '#fbbf24',
                      }}
                    />
                    {loc.toUpperCase()}
                    {isNew && <span style={styles.newBadge}>NEW</span>}
                  </button>
                );
              })}
            </div>

            {formError ? <div style={styles.errorBanner}>{formError}</div> : null}

            {/* ── Page Meta for active locale ── */}
            <div style={styles.sectionBox}>
              <h3 style={styles.sectionTitle}>
                Page Meta — {activeLocale.toUpperCase()}
                {activeMeta?.id === null && <span style={styles.newBadge}>NEW</span>}
              </h3>
              <div style={styles.formGrid}>
                <EditorField label="Title">
                  <TextInput
                    value={activeMeta?.title || ''}
                    onChange={(v) => updateLocaleMeta(activeLocale, { title: v })}
                    placeholder={`Page title (${activeLocale.toUpperCase()})`}
                  />
                </EditorField>
                <EditorField label="Status">
                  <SelectInput
                    value={activeMeta?.status || 'DRAFT'}
                    onChange={(v) => updateLocaleMeta(activeLocale, { status: v as CmsPageStatus })}
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                  </SelectInput>
                </EditorField>
                <EditorField label="SEO Title">
                  <TextInput
                    value={activeMeta?.seoTitle || ''}
                    onChange={(v) => updateLocaleMeta(activeLocale, { seoTitle: v })}
                    placeholder="Optional SEO title"
                  />
                </EditorField>
                <EditorField label="Canonical URL">
                  <TextInput
                    value={activeMeta?.canonicalUrl || ''}
                    onChange={(v) => updateLocaleMeta(activeLocale, { canonicalUrl: v })}
                    placeholder={`/${activeLocale}/${form.pageKey}`}
                  />
                </EditorField>
              </div>
              <EditorField label="SEO Description">
                <textarea
                  value={activeMeta?.seoDescription || ''}
                  onChange={(e) => updateLocaleMeta(activeLocale, { seoDescription: e.target.value })}
                  rows={2}
                  style={styles.textarea}
                  placeholder="Optional meta description"
                />
              </EditorField>
              {activeMeta?.updatedAt && (
                <span style={styles.fieldHint}>Last updated: {renderDate(activeMeta.updatedAt)}</span>
              )}
            </div>

            {/* ── Blocks Constructor ── */}
            <div style={styles.blockManager}>
              <div style={styles.blockManagerHeader}>
                <h3 style={styles.sectionTitle}>Blocks Constructor</h3>
                <div style={styles.addBlockRow}>
                  <button type="button" onClick={() => addBlock('hero')} style={styles.addBlockBtn}>+ Hero</button>
                  <button type="button" onClick={() => addBlock('faqList')} style={styles.addBlockBtn}>+ FAQ</button>
                  <button type="button" onClick={() => addBlock('reviewList')} style={styles.addBlockBtn}>+ Reviews</button>
                  <button type="button" onClick={() => addBlock('textSection')} style={styles.addBlockBtn}>+ Text</button>
                  <button type="button" onClick={() => addBlock('cardList')} style={styles.addBlockBtn}>+ Card List</button>
                  <button type="button" onClick={() => addBlock('cta')} style={styles.addBlockBtn}>+ CTA</button>
                  <button type="button" onClick={() => addBlock('footerCta')} style={styles.addBlockBtn}>+ Footer CTA</button>
                </div>
              </div>

              {form.blocks.length === 0 ? (
                <div style={styles.emptyBlocks}>No blocks. Use the buttons above to add blocks — they apply to all locales.</div>
              ) : (
                <div style={styles.blocksList}>
                  {form.blocks.map((block, index) => {
                    const localeTexts = block.texts[activeLocale] || {};
                    const faqItems = Array.isArray(localeTexts.items) ? (localeTexts.items as Record<string, unknown>[]) : [];

                    return (
                      <div key={block.key} style={styles.blockCard}>
                        {/* ── Block header ── */}
                        <div style={styles.blockCardHeader}>
                          <div style={styles.blockCardTitle}>
                            <span style={styles.blockTypeBadge}>{block.type}</span>
                            <span style={styles.blockKeyLabel}>{block.key}</span>
                          </div>
                          <div style={styles.blockCardActions}>
                            <label style={styles.nodeLabel}>
                              <input
                                type="checkbox"
                                checked={block.enabled}
                                onChange={(e) => updateBlockStructure(index, { enabled: e.target.checked })}
                              />
                              On
                            </label>
                            <button type="button" onClick={() => moveBlock(index, 'up')} disabled={index === 0} style={styles.iconBtn}>▲</button>
                            <button type="button" onClick={() => moveBlock(index, 'down')} disabled={index === form.blocks.length - 1} style={styles.iconBtn}>▼</button>
                            <button type="button" onClick={() => removeBlock(index)} style={styles.iconBtnDanger}>🗑️</button>
                          </div>
                        </div>

                        <div style={styles.blockCardBody}>
                          {/* ── Shared fields ── */}
                          {block.type === 'hero' ? (
                            <div style={styles.sharedFieldsBox}>
                              <span style={styles.sharedLabel}>Shared (all locales)</span>
                              <EditorField label="Hero Image URL 🔗" hint="Path or URL to the hero image. Leave empty for default.">
                                <TextInput
                                  value={String(block.shared.assetUrl || '')}
                                  onChange={(v) => updateBlockShared(index, { assetUrl: v })}
                                  placeholder="/images/hero-neon.jpg"
                                />
                              </EditorField>
                            </div>
                          ) : null}

                          {(block.type === 'cta' || block.type === 'footerCta') ? (
                            <div style={styles.sharedFieldsBox}>
                              <span style={styles.sharedLabel}>Shared (all locales)</span>
                              <EditorField label="Primary Href 🔗" hint="Path or URL for the primary button. Shared across all locales.">
                                <TextInput
                                  value={String(block.shared.primaryHref || '')}
                                  onChange={(v) => updateBlockShared(index, { primaryHref: v })}
                                  placeholder="/de/kontakt"
                                />
                              </EditorField>
                            </div>
                          ) : null}

                          {block.type === 'textSection' && block.shared.media && typeof block.shared.media === 'object' ? (
                            <div style={styles.sharedFieldsBox}>
                              <span style={styles.sharedLabel}>Shared media</span>
                              <span style={styles.fieldHint}>
                                {String((block.shared.media as Record<string, unknown>).title || (block.shared.media as Record<string, unknown>).url || 'Media attached')}
                              </span>
                            </div>
                          ) : null}

                          {/* ── Locale-specific text fields ── */}
                          <div style={styles.localeTextSection}>
                            <span style={styles.localeTextLabel}>{activeLocale.toUpperCase()} texts</span>

                            {/* Hero */}
                            {block.type === 'hero' ? (
                              <>
                                <EditorField label="Pretitle" hint="Small text above the headline (optional).">
                                  <TextInput value={String(localeTexts.pretitle || '')} onChange={(v) => updateBlockText(index, activeLocale, { pretitle: v })} placeholder="e.g. Ihr Partner" />
                                </EditorField>
                                <div style={styles.formGrid}>
                                  <EditorField label="Title — Prefix" hint="Black text before the accent.">
                                    <TextInput value={String(localeTexts.titlePrefix || '')} onChange={(v) => updateBlockText(index, activeLocale, { titlePrefix: v })} placeholder="e.g. PixelRing:" />
                                  </EditorField>
                                  <EditorField label="Title — Accent" hint="Highlighted (brown) middle part.">
                                    <TextInput value={String(localeTexts.titleAccent || '')} onChange={(v) => updateBlockText(index, activeLocale, { titleAccent: v })} placeholder="e.g. Ремонт вывесок" />
                                  </EditorField>
                                  <EditorField label="Title — Suffix" hint="Black text after the accent.">
                                    <TextInput value={String(localeTexts.titleSuffix || '')} onChange={(v) => updateBlockText(index, activeLocale, { titleSuffix: v })} placeholder="e.g. и сервис, профессионально, быстро." />
                                  </EditorField>
                                </div>
                                <EditorField label="Intro Text" hint="Description paragraph below the headline.">
                                  <textarea
                                    value={String(localeTexts.intro || '')}
                                    onChange={(e) => updateBlockText(index, activeLocale, { intro: e.target.value })}
                                    rows={3}
                                    style={styles.textarea}
                                    placeholder="Intro / description text..."
                                  />
                                </EditorField>
                                <div style={styles.formGrid}>
                                  <EditorField label="CTA Primary" hint="Main call-to-action button text.">
                                    <TextInput value={String(localeTexts.ctaPrimary || '')} onChange={(v) => updateBlockText(index, activeLocale, { ctaPrimary: v })} placeholder="e.g. Jetzt anfragen" />
                                  </EditorField>
                                  <EditorField label="CTA Secondary" hint="Secondary button text (optional).">
                                    <TextInput value={String(localeTexts.ctaSecondary || '')} onChange={(v) => updateBlockText(index, activeLocale, { ctaSecondary: v })} placeholder="e.g. Mehr erfahren" />
                                  </EditorField>
                                </div>
                                <div style={styles.formGrid}>
                                  <EditorField label="Trust Badge" hint="Italic micro-label below CTA.">
                                    <TextInput value={String(localeTexts.trustBadge || '')} onChange={(v) => updateBlockText(index, activeLocale, { trustBadge: v })} placeholder="e.g. ISO 9001 zertifiziert" />
                                  </EditorField>
                                  <EditorField label="Response Badge" hint="Text inside the '24h' badge card.">
                                    <TextInput value={String(localeTexts.responseBadge || '')} onChange={(v) => updateBlockText(index, activeLocale, { responseBadge: v })} placeholder="e.g. Reaktionszeit" />
                                  </EditorField>
                                </div>
                              </>
                            ) : null}

                            {/* FAQ List */}
                            {block.type === 'faqList' ? (
                              <>
                                <EditorField label="Section Title">
                                  <TextInput value={String(localeTexts.title || '')} onChange={(v) => updateBlockText(index, activeLocale, { title: v })} />
                                </EditorField>
                                <ListEditor
                                  label="Q&A Items"
                                  items={faqItems}
                                  onAdd={() => addFaqItem(index)}
                                  onRemove={(fi) => removeFaqItem(index, fi)}
                                  renderItem={(item, fi) => (
                                    <>
                                      <EditorField label="Question">
                                        <TextInput
                                          value={String(item.question || '')}
                                          onChange={(v) => updateFaqItem(index, fi, { question: v })}
                                          placeholder="Question..."
                                        />
                                      </EditorField>
                                      <EditorField label="Answer">
                                        <textarea
                                          value={String(item.answer || '')}
                                          onChange={(e) => updateFaqItem(index, fi, { answer: e.target.value })}
                                          rows={3}
                                          style={styles.textarea}
                                          placeholder="Answer..."
                                        />
                                      </EditorField>
                                    </>
                                  )}
                                />
                              </>
                            ) : null}

                            {/* Text Section */}
                            {block.type === 'textSection' ? (
                              <>
                                <EditorField label="Section Title">
                                  <TextInput value={String(localeTexts.title || '')} onChange={(v) => updateBlockText(index, activeLocale, { title: v })} />
                                </EditorField>
                                <EditorField label="Description" hint="Section description text.">
                                  <textarea
                                    value={String(localeTexts.description || '')}
                                    onChange={(e) => updateBlockText(index, activeLocale, { description: e.target.value })}
                                    rows={5}
                                    style={styles.textarea}
                                    placeholder="Section description..."
                                  />
                                </EditorField>
                              </>
                            ) : null}

                            {/* Review List */}
                            {block.type === 'reviewList' ? (
                              <>
                                <EditorField label="Section Title">
                                  <TextInput value={String(localeTexts.title || '')} onChange={(v) => updateBlockText(index, activeLocale, { title: v })} />
                                </EditorField>
                                <EditorField label="Subtitle" hint="Subheading below the section title.">
                                  <TextInput
                                    value={String(localeTexts.subtitle || '')}
                                    onChange={(v) => updateBlockText(index, activeLocale, { subtitle: v })}
                                    placeholder="e.g. Was unsere Kunden sagen"
                                  />
                                </EditorField>
                                <ListEditor
                                  label="Reviews"
                                  items={Array.isArray(localeTexts.items) ? (localeTexts.items as Record<string, unknown>[]) : []}
                                  onAdd={() => addListItem(index, 'items', { content: '', name: '', role: '' })}
                                  onRemove={(fi) => removeListItem(index, 'items', fi)}
                                  renderItem={(item, fi) => (
                                    <>
                                      <EditorField label="Content">
                                        <textarea
                                          value={String(item.content || '')}
                                          onChange={(e) => updateListItem(index, 'items', fi, { content: e.target.value })}
                                          rows={3}
                                          style={styles.textarea}
                                          placeholder="Review text..."
                                        />
                                      </EditorField>
                                      <div style={styles.formGrid}>
                                        <EditorField label="Author Name">
                                          <TextInput value={String(item.name || '')} onChange={(v) => updateListItem(index, 'items', fi, { name: v })} />
                                        </EditorField>
                                        <EditorField label="Author Role">
                                          <TextInput value={String(item.role || '')} onChange={(v) => updateListItem(index, 'items', fi, { role: v })} />
                                        </EditorField>
                                      </div>
                                    </>
                                  )}
                                />
                              </>
                            ) : null}

                            {/* Card List — Trust, Bento, Excellence, Roadmap, Footer sections */}
                            {block.type === 'cardList' ? (
                              <>
                                <EditorField label="Section Title" hint="Main section heading.">
                                  <TextInput value={String(localeTexts.title || '')} onChange={(v) => updateBlockText(index, activeLocale, { title: v })} />
                                </EditorField>
                                {/* Three-part colored title (Trust section style) */}
                                {(localeTexts.titleStart !== undefined || localeTexts.titleAccent !== undefined || localeTexts.titleEnd !== undefined || block.key === 'trustSection') ? (
                                  <div style={styles.formGrid}>
                                    <EditorField label="Title — Start" hint="White/dark text before accent.">
                                      <TextInput value={String(localeTexts.titleStart || '')} onChange={(v) => updateBlockText(index, activeLocale, { titleStart: v })} placeholder="e.g. Warum" />
                                    </EditorField>
                                    <EditorField label="Title — Accent" hint="Highlighted (brown) part.">
                                      <TextInput value={String(localeTexts.titleAccent || '')} onChange={(v) => updateBlockText(index, activeLocale, { titleAccent: v })} placeholder="e.g. PixelRing" />
                                    </EditorField>
                                    <EditorField label="Title — End" hint="Text after accent.">
                                      <TextInput value={String(localeTexts.titleEnd || '')} onChange={(v) => updateBlockText(index, activeLocale, { titleEnd: v })} placeholder="e.g. wählen?" />
                                    </EditorField>
                                  </div>
                                ) : null}
                                <EditorField label="Subtitle" hint="Optional subheading.">
                                  <TextInput value={String(localeTexts.subtitle || '')} onChange={(v) => updateBlockText(index, activeLocale, { subtitle: v })} />
                                </EditorField>
                                <EditorField label="Description" hint="Section description text.">
                                  <textarea
                                    value={String(localeTexts.description || '')}
                                    onChange={(e) => updateBlockText(index, activeLocale, { description: e.target.value })}
                                    rows={3}
                                    style={styles.textarea}
                                    placeholder="Section description..."
                                  />
                                </EditorField>

                                {/* Generic items editor (Excellence/Portfolio) */}
                                {(block.key === 'excellenceSection' || localeTexts.items) && (
                                  <ListEditor
                                    label="Carousel Items"
                                    items={Array.isArray(localeTexts.items) ? (localeTexts.items as Record<string, unknown>[]) : []}
                                    onAdd={() => addListItem(index, 'items', { title: '', tag: '', description: '', image: '' })}
                                    onRemove={(fi) => removeListItem(index, 'items', fi)}
                                    renderItem={(item, fi) => (
                                      <>
                                        <div style={styles.formGrid}>
                                          <EditorField label="Title">
                                            <TextInput value={String(item.title || '')} onChange={(v) => updateListItem(index, 'items', fi, { title: v })} />
                                          </EditorField>
                                          <EditorField label="Tag/Label">
                                            <TextInput value={String(item.tag || '')} onChange={(v) => updateListItem(index, 'items', fi, { tag: v })} />
                                          </EditorField>
                                        </div>
                                        <EditorField label="Description">
                                          <TextInput value={String(item.description || '')} onChange={(v) => updateListItem(index, 'items', fi, { description: v })} />
                                        </EditorField>
                                        <EditorField label="Image Path/URL 🔗">
                                          <TextInput value={String(item.image || '')} onChange={(v) => updateListItem(index, 'items', fi, { image: v })} />
                                        </EditorField>
                                      </>
                                    )}
                                  />
                                )}

                                {/* Stats editor (Trust section) */}
                                {(block.key === 'trustSection' || localeTexts.stats) && (
                                  <ListEditor
                                    label="Stats"
                                    items={Array.isArray(localeTexts.stats) ? (localeTexts.stats as Record<string, unknown>[]) : []}
                                    onAdd={() => addListItem(index, 'stats', { value: '', label: '', description: '' })}
                                    onRemove={(fi) => removeListItem(index, 'stats', fi)}
                                    renderItem={(item, fi) => (
                                      <>
                                        <div style={styles.formGrid}>
                                          <EditorField label="Value">
                                            <TextInput value={String(item.value || '')} onChange={(v) => updateListItem(index, 'stats', fi, { value: v })} placeholder="e.g. 500+" />
                                          </EditorField>
                                          <EditorField label="Label">
                                            <TextInput value={String(item.label || '')} onChange={(v) => updateListItem(index, 'stats', fi, { label: v })} placeholder="e.g. Projekte" />
                                          </EditorField>
                                        </div>
                                        <EditorField label="Description">
                                          <TextInput value={String(item.description || '')} onChange={(v) => updateListItem(index, 'stats', fi, { description: v })} />
                                        </EditorField>
                                      </>
                                    )}
                                  />
                                )}

                                {/* Features editor (Trust section) */}
                                {(block.key === 'trustSection' || localeTexts.features) && (
                                  <ListEditor
                                    label="Features"
                                    items={Array.isArray(localeTexts.features) ? (localeTexts.features as Record<string, unknown>[]) : []}
                                    onAdd={() => addListItem(index, 'features', { icon: '', label: '' })}
                                    onRemove={(fi) => removeListItem(index, 'features', fi)}
                                    renderItem={(item, fi) => (
                                      <div style={styles.formGrid}>
                                        <EditorField label="Icon (SVG/Path) 🔗">
                                          <TextInput value={String(item.icon || '')} onChange={(v) => updateListItem(index, 'features', fi, { icon: v })} />
                                        </EditorField>
                                        <EditorField label="Label">
                                          <TextInput value={String(item.label || '')} onChange={(v) => updateListItem(index, 'features', fi, { label: v })} />
                                        </EditorField>
                                      </div>
                                    )}
                                  />
                                )}

                                {/* Steps editor (Roadmap/Bento) */}
                                {(block.key === 'roadmapSection' || block.key === 'bentoSection' || localeTexts.steps) && (
                                  <ListEditor
                                    label="Process Steps"
                                    items={Array.isArray(localeTexts.steps) ? (localeTexts.steps as Record<string, unknown>[]) : []}
                                    onAdd={() => addListItem(index, 'steps', { title: '', description: '' })}
                                    onRemove={(fi) => removeListItem(index, 'steps', fi)}
                                    renderItem={(item, fi) => (
                                      <>
                                        <EditorField label="Step Title">
                                          <TextInput value={String(item.title || '')} onChange={(v) => updateListItem(index, 'steps', fi, { title: v })} />
                                        </EditorField>
                                        <EditorField label="Step Description">
                                          <textarea
                                            value={String(item.description || '')}
                                            onChange={(e) => updateListItem(index, 'steps', fi, { description: e.target.value })}
                                            rows={2}
                                            style={styles.textarea}
                                          />
                                        </EditorField>
                                      </>
                                    )}
                                  />
                                )}
                              </>
                            ) : null}

                            {/* CTA — Navigation, Urgent Cases */}
                            {block.type === 'cta' ? (
                              <>
                                <EditorField label="Title">
                                  <TextInput value={String(localeTexts.title || '')} onChange={(v) => updateBlockText(index, activeLocale, { title: v })} />
                                </EditorField>
                                <div style={styles.formGrid}>
                                  <EditorField label="Badge" hint="Small badge text (optional).">
                                    <TextInput value={String(localeTexts.badge || '')} onChange={(v) => updateBlockText(index, activeLocale, { badge: v })} placeholder="e.g. Dringend" />
                                  </EditorField>
                                  <EditorField label="Service Pill" hint="Navigation pill text (optional).">
                                    <TextInput value={String(localeTexts.servicePill || '')} onChange={(v) => updateBlockText(index, activeLocale, { servicePill: v })} />
                                  </EditorField>
                                </div>
                                <EditorField label="Intro / Description" hint="Description or intro paragraph.">
                                  <textarea
                                    value={String(localeTexts.intro || localeTexts.description || '')}
                                    onChange={(e) => updateBlockText(index, activeLocale, { intro: e.target.value })}
                                    rows={3}
                                    style={styles.textarea}
                                    placeholder="Intro text..."
                                  />
                                </EditorField>
                                <div style={styles.formGrid}>
                                  <EditorField label="Primary Button Label" hint="Primary CTA button label.">
                                    <TextInput value={String(localeTexts.primaryLabel || '')} onChange={(v) => updateBlockText(index, activeLocale, { primaryLabel: v })} placeholder="e.g. Jetzt kontaktieren" />
                                  </EditorField>
                                  <EditorField label="Secondary Button Label" hint="Secondary button label (optional).">
                                    <TextInput value={String(localeTexts.secondaryLabel || '')} onChange={(v) => updateBlockText(index, activeLocale, { secondaryLabel: v })} />
                                  </EditorField>
                                  <EditorField label="Book Label" hint="Booking label (navigation, optional).">
                                    <TextInput value={String(localeTexts.bookLabel || '')} onChange={(v) => updateBlockText(index, activeLocale, { bookLabel: v })} />
                                  </EditorField>
                                </div>

                                <ListEditor
                                  label="Navigation Links"
                                  items={Array.isArray(localeTexts.links) ? (localeTexts.links as Record<string, unknown>[]) : []}
                                  onAdd={() => addListItem(index, 'links', { label: '', href: '' })}
                                  onRemove={(fi) => removeListItem(index, 'links', fi)}
                                  renderItem={(item, fi) => (
                                    <div style={styles.formGrid}>
                                      <EditorField label="Link Label">
                                        <TextInput value={String(item.label || '')} onChange={(v) => updateListItem(index, 'links', fi, { label: v })} />
                                      </EditorField>
                                      <EditorField label="Link URL 🔗">
                                        <TextInput
                                          value={String(item.href || '')}
                                          onChange={(v) => updateListItem(index, 'links', fi, { href: v })}
                                        />
                                      </EditorField>
                                    </div>
                                  )}
                                />
                              </>
                            ) : null}

                            {/* Footer CTA */}
                            {block.type === 'footerCta' ? (
                              <>
                                <EditorField label="Title" hint="Main footer CTA heading.">
                                  <TextInput value={String(localeTexts.title || '')} onChange={(v) => updateBlockText(index, activeLocale, { title: v })} />
                                </EditorField>
                                <EditorField label="Subtitle" hint="Subheading below the title.">
                                  <TextInput value={String(localeTexts.subtitle || '')} onChange={(v) => updateBlockText(index, activeLocale, { subtitle: v })} />
                                </EditorField>
                                <EditorField label="Connect Label" hint="Text on the connect/contact button.">
                                  <TextInput value={String(localeTexts.connectLabel || '')} onChange={(v) => updateBlockText(index, activeLocale, { connectLabel: v })} placeholder="e.g. Verbinden" />
                                </EditorField>
                                <div style={styles.formGrid}>
                                  <EditorField label="Form Title" hint="Title inside the contact form modal.">
                                    <TextInput value={String(localeTexts.formTitle || '')} onChange={(v) => updateBlockText(index, activeLocale, { formTitle: v })} />
                                  </EditorField>
                                  <EditorField label="Form Subtitle" hint="Subtitle inside the contact form modal.">
                                    <TextInput value={String(localeTexts.formSubtitle || '')} onChange={(v) => updateBlockText(index, activeLocale, { formSubtitle: v })} />
                                  </EditorField>
                                </div>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Advanced Mode ── */}
            <details style={styles.advancedBlocks}>
              <summary style={styles.advancedSummary}>
                Advanced Mode — Raw JSON ({activeLocale.toUpperCase()})
              </summary>
              <div style={{ marginTop: '12px', padding: '0 12px 12px' }}>
                <EditorField label={`Blocks JSON for ${activeLocale.toUpperCase()}`} hint="Warning: direct edits may break the visual constructor.">
                  <textarea
                    value={activeLocaleBlocks}
                    onChange={(e) => {
                      const res = parseBlocksJson(e.target.value);
                      if (res.ok) {
                        // Rebuild unified blocks from this locale's raw edit
                        setForm((curr) => {
                          const newBlocks = curr.blocks.map((ub, i) => {
                            const raw = res.blocks[i];
                            if (!raw) return ub;
                            const textFields = getTextFieldNames(ub.type);
                            const lt: Record<string, unknown> = {};
                            for (const tf of textFields) {
                              lt[tf] = raw[tf] ?? '';
                            }
                            const shared: Record<string, unknown> = {};
                            for (const [k, v] of Object.entries(raw)) {
                              if (STRUCTURAL_KEYS.has(k) || textFields.includes(k)) continue;
                              shared[k] = v;
                            }
                            return {
                              ...ub,
                              enabled: raw.enabled !== false,
                              shared,
                              texts: { ...ub.texts, [activeLocale]: lt },
                            };
                          });
                          return { ...curr, blocks: newBlocks };
                        });
                      }
                    }}
                    rows={14}
                    spellCheck={false}
                    style={{ ...styles.textarea, ...styles.codeTextarea }}
                  />
                </EditorField>
              </div>
            </details>

            {/* ── Footer ── */}
            <div style={styles.modalFooter}>
              <button type="button" onClick={closeEditor} style={styles.secondaryButton}>
                Cancel
              </button>
              <button type="button" onClick={() => void saveAll()} disabled={formSaving || saveableLocales.length === 0} style={styles.primaryButton}>
                {formSaving ? 'Saving...' : `Save All (${saveableLocales.length} locales)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    flexWrap: 'wrap',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 700,
    color: '#fff',
  },
  subtitle: {
    margin: '8px 0 0',
    fontSize: '14px',
    color: '#8b8b8b',
    lineHeight: 1.6,
    maxWidth: '760px',
  },
  primaryButton: {
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: 700,
    background: '#fff',
    color: '#111',
    border: '1px solid #fff',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  statRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
  },
  statCard: {
    border: '1px solid #222',
    borderRadius: '8px',
    background: '#111',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statLabel: {
    color: '#8b8b8b',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  statValue: {
    color: '#fff',
    fontSize: '20px',
    fontWeight: 700,
  },
  errorBanner: {
    padding: '12px 14px',
    border: '1px solid #5b1f1f',
    borderRadius: '8px',
    background: '#2a1111',
    color: '#fca5a5',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  emptyState: {
    padding: '28px 16px',
    border: '1px dashed #303030',
    borderRadius: '8px',
    color: '#8b8b8b',
    background: '#111',
    fontSize: '14px',
  },
  tableWrap: {
    overflowX: 'auto',
    border: '1px solid #222',
    borderRadius: '8px',
    background: '#111',
  },
  table: {
    width: '100%',
    minWidth: '700px',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 14px',
    borderBottom: '1px solid #222',
    color: '#8b8b8b',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    background: '#0b0b0b',
  },
  tr: {
    borderBottom: '1px solid #1f1f1f',
  },
  td: {
    padding: '14px',
    color: '#d4d4d8',
    fontSize: '13px',
    verticalAlign: 'middle',
  },
  monoValue: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  localeDotsRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  localeDotWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
  },
  localeDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'block',
  },
  localeDotLabel: {
    fontSize: '9px',
    fontWeight: 700,
    color: '#71717a',
    letterSpacing: '0.04em',
  },
  // ── Modal ──
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.72)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '16px',
  },
  modal: {
    width: 'min(1120px, 100%)',
    maxHeight: '94vh',
    overflow: 'auto',
    borderRadius: '10px',
    border: '1px solid #222',
    background: '#111',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  modalTitle: {
    margin: 0,
    color: '#fff',
    fontSize: '20px',
    fontWeight: 700,
  },
  modalSubtitle: {
    margin: '6px 0 0',
    color: '#8b8b8b',
    fontSize: '13px',
    lineHeight: 1.6,
    maxWidth: '760px',
  },
  closeButton: {
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#171717',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 700,
  },
  // ── Locale tabs ──
  localeTabRow: {
    display: 'flex',
    gap: '6px',
    padding: '4px',
    background: '#0b0b0b',
    borderRadius: '10px',
    border: '1px solid #222',
    flexWrap: 'wrap',
  },
  localeTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    fontSize: '12px',
    fontWeight: 700,
    background: 'transparent',
    color: '#8b8b8b',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  localeTabActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    fontSize: '12px',
    fontWeight: 700,
    background: '#7c3aed',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
  },
  localeTabDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  newBadge: {
    display: 'inline-block',
    padding: '1px 5px',
    fontSize: '9px',
    fontWeight: 700,
    background: '#7c3aed',
    color: '#fff',
    borderRadius: '4px',
    marginLeft: '4px',
    verticalAlign: 'middle',
    letterSpacing: '0.04em',
  },
  // ── Section box ──
  sectionBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    border: '1px solid #222',
    borderRadius: '10px',
    background: '#0b0b0b',
  },
  sectionTitle: {
    margin: 0,
    color: '#fff',
    fontSize: '14px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '12px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  fieldLabel: {
    color: '#d4d4d8',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  fieldHint: {
    color: '#8b8b8b',
    fontSize: '12px',
    lineHeight: 1.5,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#0b0b0b',
    color: '#fff',
    outline: 'none',
    fontSize: '13px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    minHeight: '80px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#0b0b0b',
    color: '#fff',
    outline: 'none',
    fontSize: '13px',
    lineHeight: 1.6,
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  codeTextarea: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    minHeight: '300px',
  },
  secondaryButton: {
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#171717',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 700,
  },
  // ── Block Manager ──
  blockManager: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    border: '1px solid #222',
    borderRadius: '12px',
    background: '#0b0b0b',
  },
  blockManagerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  addBlockRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  addBlockBtn: {
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: 700,
    background: '#1a1a1a',
    color: '#a1a1aa',
    border: '1px solid #27272a',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  emptyBlocks: {
    padding: '40px 20px',
    textAlign: 'center',
    color: '#71717a',
    fontSize: '13px',
    border: '1px dashed #27272a',
    borderRadius: '8px',
  },
  blocksList: {
    display: 'grid',
    gap: '12px',
  },
  blockCard: {
    background: '#111',
    border: '1px solid #27272a',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  blockCardHeader: {
    padding: '10px 12px',
    background: '#18181b',
    borderBottom: '1px solid #27272a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blockCardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  blockTypeBadge: {
    padding: '2px 6px',
    background: '#3f3f46',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  blockKeyLabel: {
    color: '#71717a',
    fontSize: '11px',
    fontFamily: 'monospace',
  },
  blockCardActions: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  nodeLabel: {
    fontSize: '11px',
    color: '#a1a1aa',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    marginRight: '8px',
  },
  iconBtn: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#27272a',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    color: '#a1a1aa',
  },
  iconBtnDanger: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#450a0a',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  blockCardBody: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  // ── Shared / Locale sections within block ──
  sharedFieldsBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '10px',
    border: '1px solid #27272a',
    borderRadius: '6px',
    background: '#18181b',
  },
  sharedLabel: {
    fontSize: '10px',
    fontWeight: 700,
    color: '#7c3aed',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  localeTextSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  localeTextLabel: {
    fontSize: '10px',
    fontWeight: 700,
    color: '#86efac',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  // ── FAQ items ──
  faqItemsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '12px',
    border: '1px solid #27272a',
    borderRadius: '8px',
    background: '#18181b',
  },
  faqItemsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqItemsLabel: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  faqItemCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '10px',
    border: '1px solid #27272a',
    borderRadius: '6px',
    background: '#111',
  },
  faqItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqItemIndex: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#71717a',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  // ── Advanced mode ──
  advancedBlocks: {
    border: '1px solid #222',
    borderRadius: '8px',
    background: '#0b0b0b',
  },
  advancedSummary: {
    padding: '10px 12px',
    fontSize: '12px',
    fontWeight: 700,
    color: '#71717a',
    cursor: 'pointer',
    userSelect: 'none',
  },
  // ── Footer ──
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    flexWrap: 'wrap',
    paddingTop: '4px',
    borderTop: '1px solid #222',
  },
};
