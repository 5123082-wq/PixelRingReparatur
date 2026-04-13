'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useParams } from 'next/navigation';

import { adminFetch } from '@/lib/admin-fetch';

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

type CmsMedia = {
  id: string;
  locale: string | null;
  usageType: string;
  title: string | null;
  alt: string | null;
  url: string | null;
  mimeType: string | null;
  filename: string | null;
  width: number | null;
  height: number | null;
};

type PageFormState = {
  pageKey: CmsPageKey;
  locale: string;
  status: CmsPageStatus;
  title: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  blocksJson: string;
};

const SUPPORTED_LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'] as const;
const PAGE_KEYS: CmsPageKey[] = ['home', 'support', 'status', 'global'];
const STATUS_OPTIONS: CmsPageStatus[] = ['DRAFT', 'PUBLISHED'];

const DEFAULT_BLOCKS_JSON = JSON.stringify(
  [
    {
      type: 'hero',
      key: 'hero',
      enabled: true,
      title: '',
      subtitle: '',
      sortOrder: 0,
    },
  ],
  null,
  2
);

function getLocale(value: string | string[] | undefined | null, fallback = 'de'): string {
  if (Array.isArray(value)) {
    return value[0] || fallback;
  }

  return value || fallback;
}

function toNullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
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
      locale: asString(row.locale),
      usageType: asString(row.usageType) || 'GENERAL',
      title: asString(row.title),
      alt: asString(row.alt) || asString(row.altText),
      url: asString(row.url) || asString(row.publicUrl) || asString(row.storageUrl),
      mimeType: asString(row.mimeType) || asString(row.mime),
      filename: asString(row.filename) || asString(row.originalFilename) || asString(row.name),
      width: asNumber(row.width),
      height: asNumber(row.height),
    }))
    .filter((item) => item.id);
}

function createPageMediaBlock(media: CmsMedia, index: number): CmsPageBlock {
  return {
    type: 'textSection',
    key: `media-${media.id.slice(0, 8)}-${index}`,
    enabled: true,
    sortOrder: index,
    title: media.title || media.filename || 'CMS media',
    body: '',
    media: {
      id: media.id,
      url: media.url || '',
      title: media.title || '',
      alt: media.alt || '',
      width: media.width,
      height: media.height,
      usageType: media.usageType,
    },
  };
}

function renderDate(value: string | null | undefined): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function createEmptyForm(locale: string): PageFormState {
  return {
    pageKey: 'home',
    locale,
    status: 'DRAFT',
    title: '',
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    blocksJson: DEFAULT_BLOCKS_JSON,
  };
}

function pageToForm(page: CmsPage, fallbackLocale: string): PageFormState {
  return {
    pageKey: page.pageKey,
    locale: page.locale || fallbackLocale,
    status: page.status,
    title: page.title,
    seoTitle: page.seoTitle || '',
    seoDescription: page.seoDescription || '',
    canonicalUrl: page.canonicalUrl || '',
    blocksJson: JSON.stringify(page.blocks || [], null, 2),
  };
}

async function readApiError(response: Response): Promise<string> {
  const data = (await response.json().catch(() => null)) as { error?: string } | null;
  return data?.error || `Request failed (${response.status})`;
}

function parseBlocksJson(value: string): { ok: true; blocks: CmsPageBlock[] } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return { ok: false, error: 'Blocks JSON must be an array.' };
    }

    if (
      parsed.some(
        (block) => !block || typeof block !== 'object' || Array.isArray(block)
      )
    ) {
      return { ok: false, error: 'Each block must be a JSON object.' };
    }

    return { ok: true, blocks: parsed as CmsPageBlock[] };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Blocks JSON is invalid.',
    };
  }
}

function validateForm(form: PageFormState): string | null {
  if (!PAGE_KEYS.includes(form.pageKey)) {
    return 'Page key is invalid.';
  }

  if (!SUPPORTED_LOCALES.includes(form.locale as (typeof SUPPORTED_LOCALES)[number])) {
    return 'Locale is invalid.';
  }

  if (!form.title.trim()) {
    return 'Title is required.';
  }

  const parsedBlocks = parseBlocksJson(form.blocksJson);
  if (!parsedBlocks.ok) {
    return parsedBlocks.error;
  }

  return null;
}

function normalizePagePayload(form: PageFormState): Record<string, unknown> {
  const parsedBlocks = parseBlocksJson(form.blocksJson);

  return {
    pageKey: form.pageKey,
    locale: form.locale,
    status: form.status,
    title: form.title.trim(),
    blocks: parsedBlocks.ok ? parsedBlocks.blocks : [],
    seoTitle: toNullable(form.seoTitle),
    seoDescription: toNullable(form.seoDescription),
    canonicalUrl: toNullable(form.canonicalUrl),
  };
}

function shortText(value: string | null | undefined, maxLength = 150): string {
  const text = (value || '').trim().replace(/\s+/g, ' ');

  if (!text) {
    return '-';
  }

  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
}

function chipStyle(status: CmsPageStatus) {
  if (status === 'PUBLISHED') {
    return { ...styles.chip, background: '#0f241b', color: '#86efac', borderColor: '#14532d' };
  }

  return { ...styles.chip, background: '#241b0f', color: '#fbbf24', borderColor: '#6a4a16' };
}

function EditorField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label style={styles.field}>
      <span style={styles.fieldLabel}>{label}</span>
      {children}
      {hint ? <span style={styles.fieldHint}>{hint}</span> : null}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      style={styles.input}
    />
  );
}

function SelectInput({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} style={styles.input}>
      {children}
    </select>
  );
}

export default function PagesPage() {
  const params = useParams();
  const routeLocale = getLocale(params?.locale);

  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshVersion, setRefreshVersion] = useState(0);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CmsPage | null>(null);
  const [form, setForm] = useState<PageFormState>(() => createEmptyForm(routeLocale));
  const [formError, setFormError] = useState('');
  const [formSaving, setFormSaving] = useState<'SAVE' | 'DELETE' | 'STATUS' | ''>('');
  const [mediaItems, setMediaItems] = useState<CmsMedia[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState('');

  const parsedBlocksPreview = useMemo(() => {
    const parsed = parseBlocksJson(form.blocksJson);
    return parsed.ok ? parsed.blocks : [];
  }, [form.blocksJson]);

  const summary = useMemo(() => {
    const published = pages.filter((page) => page.status === 'PUBLISHED').length;
    const drafts = pages.filter((page) => page.status === 'DRAFT').length;
    return { total: pages.length, published, drafts };
  }, [pages]);

  const loadPages = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/cms/pages', {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
      });
      const data = (await response.json().catch(() => ({}))) as PagesResponse;

      if (!response.ok) {
        throw new Error(data.error || `Failed to load pages (${response.status}).`);
      }

      setPages(data.pages || []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load pages.');
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
      const response = await fetch('/api/cms/media', {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
      });
      const data = (await response.json().catch(() => null)) as unknown;

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      setMediaItems(normalizeMediaResponse(data));
    } catch (error) {
      setMediaError(error instanceof Error ? error.message : 'Failed to load CMS media.');
      setMediaItems([]);
    } finally {
      setMediaLoading(false);
    }
  }, []);

  useEffect(() => {
    if (editorOpen) {
      void loadMediaItems();
    }
  }, [editorOpen, loadMediaItems]);

  const openCreate = useCallback(() => {
    setEditingPage(null);
    setForm(createEmptyForm(routeLocale));
    setFormError('');
    setFormSaving('');
    setEditorOpen(true);
  }, [routeLocale]);

  const openEdit = useCallback(
    (page: CmsPage) => {
      setEditingPage(page);
      setForm(pageToForm(page, routeLocale));
      setFormError('');
      setFormSaving('');
      setEditorOpen(true);
    },
    [routeLocale]
  );

  const closeEditor = useCallback(() => {
    setEditorOpen(false);
    setEditingPage(null);
    setFormError('');
    setFormSaving('');
  }, []);

  const insertMediaBlock = useCallback((media: CmsMedia) => {
    if (!media.url) {
      setMediaError('Selected media is missing a public URL.');
      return;
    }

    const parsed = parseBlocksJson(form.blocksJson);
    if (!parsed.ok) {
      setMediaError(`Fix Blocks JSON before inserting media: ${parsed.error}`);
      return;
    }

    const nextBlocks = [
      ...parsed.blocks,
      createPageMediaBlock(media, parsed.blocks.length),
    ];

    setMediaError('');
    setForm((current) => ({
      ...current,
      blocksJson: JSON.stringify(nextBlocks, null, 2),
    }));
  }, [form.blocksJson]);

  const savePage = useCallback(async () => {
    const validationError = validateForm(form);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormSaving('SAVE');
    setFormError('');

    const isEdit = Boolean(editingPage);
    const url = isEdit ? `/api/cms/pages/${editingPage?.id}` : '/api/cms/pages';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const response = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizePagePayload(form)),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      setEditorOpen(false);
      setEditingPage(null);
      setForm(createEmptyForm(routeLocale));
      setRefreshVersion((value) => value + 1);
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : 'Failed to save page.');
    } finally {
      setFormSaving('');
    }
  }, [editingPage, form, routeLocale]);

  const togglePublished = useCallback(async (page: CmsPage) => {
    const nextStatus: CmsPageStatus = page.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    setFormSaving('STATUS');
    setError('');

    try {
      const response = await adminFetch(`/api/cms/pages/${page.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      setRefreshVersion((value) => value + 1);
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Failed to update status.');
    } finally {
      setFormSaving('');
    }
  }, []);

  const deletePage = useCallback(async (page: CmsPage) => {
    const confirmed = window.confirm(
      `Soft delete "${page.pageKey}" (${page.locale})? This keeps the row in the database but removes it from CMS lists.`
    );

    if (!confirmed) {
      return false;
    }

    setFormSaving('DELETE');
    setError('');

    try {
      const response = await adminFetch(`/api/cms/pages/${page.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      setRefreshVersion((value) => value + 1);
      return true;
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete page.');
      return false;
    } finally {
      setFormSaving('');
    }
  }, []);

  const deleteFromEditor = useCallback(async () => {
    if (!editingPage) {
      return;
    }

    const deleted = await deletePage(editingPage);
    if (deleted) {
      closeEditor();
    }
  }, [closeEditor, deletePage, editingPage]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Page Content</h1>
          <p style={styles.subtitle}>
            Manage structured JSON blocks for home, support, status, and global copy.
          </p>
        </div>

        <button type="button" onClick={openCreate} style={styles.primaryButton}>
          + New page
        </button>
      </div>

      <div style={styles.statRow}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Records</span>
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

      {loading ? (
        <div style={styles.emptyState}>Loading pages...</div>
      ) : pages.length === 0 ? (
        <div style={styles.emptyState}>No page records found.</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Page key</th>
                <th style={styles.th}>Locale</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Blocks</th>
                <th style={styles.th}>Updated</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} style={styles.tr}>
                  <td style={styles.td}>
                    <strong style={styles.monoValue}>{page.pageKey}</strong>
                  </td>
                  <td style={styles.td}>{page.locale}</td>
                  <td style={styles.td}>
                    <span style={chipStyle(page.status)}>{page.status}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.tableTitle}>{page.title}</div>
                    <div style={styles.tableSubtitle}>
                      SEO: {shortText(page.seoTitle || page.seoDescription, 80)}
                    </div>
                  </td>
                  <td style={styles.td}>{page.blocks.length}</td>
                  <td style={styles.td}>{renderDate(page.updatedAt)}</td>
                  <td style={styles.td}>
                    <div style={styles.actionRow}>
                      <button type="button" onClick={() => openEdit(page)} style={styles.secondaryButton}>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void togglePublished(page)}
                        disabled={Boolean(formSaving)}
                        style={page.status === 'PUBLISHED' ? styles.warningButton : styles.successButton}
                      >
                        {page.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        onClick={() => void deletePage(page)}
                        disabled={Boolean(formSaving)}
                        style={styles.dangerButton}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editorOpen ? (
        <div style={styles.modalOverlay} onClick={closeEditor}>
          <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>
                  {editingPage ? 'Edit page content' : 'New page content'}
                </h2>
                <p style={styles.modalSubtitle}>
                  Store structured JSON only. Unknown types, unsafe keys, or markup are rejected by the API.
                </p>
              </div>

              <button type="button" onClick={closeEditor} style={styles.closeButton}>
                Close
              </button>
            </div>

            {formError ? <div style={styles.errorBanner}>{formError}</div> : null}

            <div style={styles.formGrid}>
              <EditorField label="Page key">
                <SelectInput
                  value={form.pageKey}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, pageKey: value as CmsPageKey }))
                  }
                >
                  {PAGE_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </SelectInput>
              </EditorField>

              <EditorField label="Locale">
                <SelectInput
                  value={form.locale}
                  onChange={(value) => setForm((current) => ({ ...current, locale: value }))}
                >
                  {SUPPORTED_LOCALES.map((locale) => (
                    <option key={locale} value={locale}>
                      {locale}
                    </option>
                  ))}
                </SelectInput>
              </EditorField>

              <EditorField label="Status">
                <SelectInput
                  value={form.status}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      status: value as CmsPageStatus,
                    }))
                  }
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </SelectInput>
              </EditorField>

              <EditorField label="Title">
                <TextInput
                  value={form.title}
                  onChange={(value) => setForm((current) => ({ ...current, title: value }))}
                  placeholder="Internal page title"
                />
              </EditorField>

              <EditorField label="SEO title">
                <TextInput
                  value={form.seoTitle}
                  onChange={(value) => setForm((current) => ({ ...current, seoTitle: value }))}
                  placeholder="Optional SEO title"
                />
              </EditorField>

              <EditorField label="Canonical URL">
                <TextInput
                  value={form.canonicalUrl}
                  onChange={(value) => setForm((current) => ({ ...current, canonicalUrl: value }))}
                  placeholder="/de/status"
                />
              </EditorField>
            </div>

            <EditorField label="SEO description">
              <textarea
                value={form.seoDescription}
                onChange={(event) =>
                  setForm((current) => ({ ...current, seoDescription: event.target.value }))
                }
                rows={3}
                style={styles.textarea}
                placeholder="Optional meta description"
              />
            </EditorField>

            <EditorField
              label="Blocks JSON"
              hint='Allowed block types: hero, cta, textSection, cardList, faqList, reviewList, footerCta. Use "statusHero" hero block for status-page copy.'
            >
              <textarea
                value={form.blocksJson}
                onChange={(event) =>
                  setForm((current) => ({ ...current, blocksJson: event.target.value }))
                }
                rows={18}
                spellCheck={false}
                style={{ ...styles.textarea, ...styles.codeTextarea }}
              />
            </EditorField>

            <div style={styles.mediaPickerPanel}>
              <div style={styles.mediaPickerHeader}>
                <div>
                  <h4 style={styles.mediaPickerTitle}>Media picker</h4>
                  <p style={styles.mediaPickerText}>
                    Adds a safe `textSection` block containing a public CMS media reference.
                  </p>
                </div>
                <button type="button" onClick={() => void loadMediaItems()} style={styles.secondaryButton}>
                  Refresh media
                </button>
              </div>

              {mediaError ? <div style={styles.errorBanner}>{mediaError}</div> : null}
              {mediaLoading ? (
                <div style={styles.emptyState}>Loading CMS media...</div>
              ) : mediaItems.length === 0 ? (
                <div style={styles.emptyState}>No public CMS media available yet.</div>
              ) : (
                <div style={styles.mediaPickerGrid}>
                  {mediaItems.map((media) => (
                    <button
                      key={media.id}
                      type="button"
                      onClick={() => insertMediaBlock(media)}
                      disabled={!media.url}
                      style={styles.mediaPickerCard}
                    >
                      <span style={styles.mediaPickerThumb}>
                        {media.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={media.url}
                            alt={media.alt || media.title || ''}
                            style={styles.mediaPickerImage}
                          />
                        ) : (
                          <span style={styles.mediaPickerNoImage}>No URL</span>
                        )}
                      </span>
                      <span style={styles.mediaPickerName}>
                        {media.title || media.filename || media.id}
                      </span>
                      <span style={styles.mediaPickerMeta}>
                        {media.locale || '-'} · {media.usageType}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.previewPanel}>
              <div style={styles.previewTitle}>Parsed block summary</div>
              {parsedBlocksPreview.length === 0 ? (
                <div style={styles.previewEmpty}>No valid blocks parsed yet.</div>
              ) : (
                <div style={styles.previewList}>
                  {parsedBlocksPreview.map((block, index) => (
                    <div key={`${block.key ?? 'block'}-${index}`} style={styles.previewItem}>
                      <span style={styles.monoValue}>{String(block.type ?? 'unknown')}</span>
                      <span>{String(block.key ?? 'missing-key')}</span>
                      <span>{block.enabled === false ? 'disabled' : 'enabled'}</span>
                      <span>order {Number(block.sortOrder ?? index)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.metadataPanel}>
              <div style={styles.metadataItem}>
                <span style={styles.cardFieldLabel}>Created</span>
                <span style={styles.cardFieldValue}>
                  {editingPage ? renderDate(editingPage.createdAt) : '-'}
                </span>
              </div>
              <div style={styles.metadataItem}>
                <span style={styles.cardFieldLabel}>Updated</span>
                <span style={styles.cardFieldValue}>
                  {editingPage ? renderDate(editingPage.updatedAt) : '-'}
                </span>
              </div>
              <div style={styles.metadataItem}>
                <span style={styles.cardFieldLabel}>Published</span>
                <span style={styles.cardFieldValue}>
                  {editingPage ? renderDate(editingPage.publishedAt) : '-'}
                </span>
              </div>
              <div style={styles.metadataItem}>
                <span style={styles.cardFieldLabel}>Reviewed</span>
                <span style={styles.cardFieldValue}>
                  {editingPage ? renderDate(editingPage.lastReviewedAt) : '-'}
                </span>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button type="button" onClick={closeEditor} style={styles.secondaryButton}>
                Cancel
              </button>
              {editingPage ? (
                <button
                  type="button"
                  onClick={() => void deleteFromEditor()}
                  disabled={Boolean(formSaving)}
                  style={styles.dangerButton}
                >
                  Delete
                </button>
              ) : null}
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({ ...current, status: 'DRAFT' }))
                }
                disabled={Boolean(formSaving)}
                style={styles.warningButton}
              >
                Mark draft
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({ ...current, status: 'PUBLISHED' }))
                }
                disabled={Boolean(formSaving)}
                style={styles.successButton}
              >
                Mark published
              </button>
              <button
                type="button"
                onClick={() => void savePage()}
                disabled={Boolean(formSaving)}
                style={styles.primaryButton}
              >
                {formSaving === 'SAVE' ? 'Saving...' : 'Save page'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

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
    minWidth: '900px',
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
    verticalAlign: 'top',
  },
  tableTitle: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 700,
    marginBottom: '5px',
  },
  tableSubtitle: {
    color: '#8b8b8b',
    fontSize: '12px',
    lineHeight: 1.5,
  },
  monoValue: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '999px',
    border: '1px solid #333',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.02em',
  },
  actionRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
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
  successButton: {
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #14532d',
    background: '#0f241b',
    color: '#86efac',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 700,
  },
  warningButton: {
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #6a4a16',
    background: '#241b0f',
    color: '#fbbf24',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 700,
  },
  dangerButton: {
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #7f1d1d',
    background: '#2a1111',
    color: '#fca5a5',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 700,
  },
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
    maxHeight: '92vh',
    overflow: 'auto',
    borderRadius: '8px',
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
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '12px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fieldLabel: {
    color: '#d4d4d8',
    fontSize: '12px',
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
    minHeight: '110px',
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
    minHeight: '360px',
  },
  mediaPickerPanel: {
    border: '1px solid #222',
    borderRadius: '8px',
    background: '#0b0b0b',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mediaPickerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  mediaPickerTitle: {
    margin: 0,
    color: '#fff',
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  mediaPickerText: {
    margin: '4px 0 0',
    color: '#8b8b8b',
    fontSize: '12px',
    lineHeight: 1.5,
  },
  mediaPickerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '10px',
  },
  mediaPickerCard: {
    border: '1px solid #252525',
    borderRadius: '8px',
    background: '#111',
    color: '#d4d4d8',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
    textAlign: 'left',
  },
  mediaPickerThumb: {
    height: '86px',
    borderRadius: '6px',
    background: '#171717',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaPickerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  mediaPickerNoImage: {
    color: '#8b8b8b',
    fontSize: '12px',
  },
  mediaPickerName: {
    color: '#fff',
    fontSize: '12px',
    fontWeight: 700,
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },
  mediaPickerMeta: {
    color: '#8b8b8b',
    fontSize: '11px',
    lineHeight: 1.4,
  },
  previewPanel: {
    padding: '12px',
    border: '1px solid #222',
    borderRadius: '8px',
    background: '#0b0b0b',
  },
  previewTitle: {
    color: '#fff',
    fontSize: '13px',
    fontWeight: 700,
    marginBottom: '10px',
  },
  previewEmpty: {
    color: '#8b8b8b',
    fontSize: '13px',
  },
  previewList: {
    display: 'grid',
    gap: '8px',
  },
  previewItem: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '8px',
    color: '#d4d4d8',
    fontSize: '12px',
  },
  metadataPanel: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
    padding: '12px',
    border: '1px solid #222',
    borderRadius: '8px',
    background: '#0b0b0b',
  },
  metadataItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  cardFieldLabel: {
    color: '#8b8b8b',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  cardFieldValue: {
    color: '#fff',
    fontSize: '13px',
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    flexWrap: 'wrap',
  },
};
