'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useParams } from 'next/navigation';

import { adminFetch } from '@/lib/admin-fetch';

type CmsArticleType = 'SYMPTOM' | 'FAQ' | 'PAGE' | 'SERVICE' | 'CASE';
type CmsArticleStatus = 'DRAFT' | 'PUBLISHED';

type CmsArticle = {
  id: string;
  locale: string;
  type: CmsArticleType;
  status: CmsArticleStatus;
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
  publishedAt: string | null;
  lastReviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type ArticleListResponse = {
  articles: CmsArticle[];
  pagination: Pagination;
};

type ArticleFormState = {
  locale: string;
  type: CmsArticleType;
  status: CmsArticleStatus;
  slug: string;
  title: string;
  symptomLabel: string;
  shortAnswer: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  relatedSlugs: string;
  causes: string;
  safeChecks: string;
  urgentWarnings: string;
  serviceProcess: string;
  workScopeFactors: string;
  ctaLabel: string;
  ctaHref: string;
  sortOrder: string;
};

const SUPPORTED_LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'] as const;
const ARTICLE_TYPES: CmsArticleType[] = ['SYMPTOM', 'FAQ', 'PAGE', 'SERVICE', 'CASE'];
const STATUS_OPTIONS: CmsArticleStatus[] = ['DRAFT', 'PUBLISHED'];
const PAGE_SIZE_OPTIONS = [10, 25, 50];

function getLocale(value: string | string[] | undefined | null, fallback = 'de'): string {
  if (Array.isArray(value)) {
    return value[0] || fallback;
  }

  return value || fallback;
}

function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function joinLines(values: string[] | null | undefined): string {
  return (values || []).join('\n');
}

function toNullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function renderDate(value: string | null | undefined): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function shortText(value: string | null | undefined, maxLength = 160): string {
  const text = (value || '').trim().replace(/\s+/g, ' ');
  if (!text) {
    return '—';
  }

  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
}

function createEmptyForm(locale: string): ArticleFormState {
  return {
    locale,
    type: 'SYMPTOM',
    status: 'DRAFT',
    slug: '',
    title: '',
    symptomLabel: '',
    shortAnswer: '',
    content: '',
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    relatedSlugs: '',
    causes: '',
    safeChecks: '',
    urgentWarnings: '',
    serviceProcess: '',
    workScopeFactors: '',
    ctaLabel: '',
    ctaHref: '',
    sortOrder: '0',
  };
}

function articleToForm(article: CmsArticle, fallbackLocale: string): ArticleFormState {
  return {
    locale: article.locale || fallbackLocale,
    type: article.type,
    status: article.status,
    slug: article.slug,
    title: article.title,
    symptomLabel: article.symptomLabel || '',
    shortAnswer: article.shortAnswer || '',
    content: article.content || '',
    seoTitle: article.seoTitle || '',
    seoDescription: article.seoDescription || '',
    canonicalUrl: article.canonicalUrl || '',
    relatedSlugs: joinLines(article.relatedSlugs),
    causes: joinLines(article.causes),
    safeChecks: joinLines(article.safeChecks),
    urgentWarnings: joinLines(article.urgentWarnings),
    serviceProcess: joinLines(article.serviceProcess),
    workScopeFactors: joinLines(article.workScopeFactors),
    ctaLabel: article.ctaLabel || '',
    ctaHref: article.ctaHref || '',
    sortOrder: String(article.sortOrder ?? 0),
  };
}

function validateForm(form: ArticleFormState): string | null {
  const slug = normalizeSlug(form.slug);

  if (!SUPPORTED_LOCALES.includes(form.locale as (typeof SUPPORTED_LOCALES)[number])) {
    return 'Locale is invalid.';
  }

  if (!slug) {
    return 'Slug is required.';
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return 'Slug must contain only lowercase letters, numbers, and hyphens.';
  }

  if (!form.title.trim()) {
    return 'Title is required.';
  }

  if (!form.content.trim()) {
    return 'Content is required.';
  }

  const parsedSortOrder = Number(form.sortOrder);
  if (!Number.isInteger(parsedSortOrder)) {
    return 'Sort order must be an integer.';
  }

  return null;
}

function normalizeArticlePayload(
  form: ArticleFormState,
  nextStatus: CmsArticleStatus
): Record<string, unknown> {
  return {
    locale: form.locale.trim() || 'de',
    type: form.type,
    status: nextStatus,
    slug: normalizeSlug(form.slug),
    title: form.title.trim(),
    symptomLabel: toNullable(form.symptomLabel),
    shortAnswer: toNullable(form.shortAnswer),
    content: form.content.trim(),
    seoTitle: toNullable(form.seoTitle),
    seoDescription: toNullable(form.seoDescription),
    canonicalUrl: toNullable(form.canonicalUrl),
    relatedSlugs: splitLines(form.relatedSlugs),
    causes: splitLines(form.causes),
    safeChecks: splitLines(form.safeChecks),
    urgentWarnings: splitLines(form.urgentWarnings),
    serviceProcess: splitLines(form.serviceProcess),
    workScopeFactors: splitLines(form.workScopeFactors),
    ctaLabel: toNullable(form.ctaLabel),
    ctaHref: toNullable(form.ctaHref),
    sortOrder: Number(form.sortOrder) || 0,
  };
}

async function readApiError(response: Response): Promise<string> {
  const data = (await response.json().catch(() => null)) as { error?: string } | null;
  return data?.error || `Request failed (${response.status})`;
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
  type = 'text',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number';
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      style={styles.input}
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={styles.textarea}
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

function chipStyle(kind: 'draft' | 'published' | 'type' | 'locale') {
  if (kind === 'published') {
    return { ...styles.chip, background: '#0f241b', color: '#6ee7b7', borderColor: '#1f5c45' };
  }

  if (kind === 'draft') {
    return { ...styles.chip, background: '#241b0f', color: '#fbbf24', borderColor: '#6a4a16' };
  }

  if (kind === 'locale') {
    return { ...styles.chip, background: '#112033', color: '#93c5fd', borderColor: '#1f3a5b' };
  }

  return { ...styles.chip, background: '#181818', color: '#d4d4d8', borderColor: '#333' };
}

export default function ArticlesPage() {
  const params = useParams();
  const routeLocale = getLocale(params?.locale);

  const [articles, setArticles] = useState<CmsArticle[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshVersion, setRefreshVersion] = useState(0);

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [localeFilter, setLocaleFilter] = useState(routeLocale);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<CmsArticle | null>(null);
  const [form, setForm] = useState<ArticleFormState>(() => createEmptyForm(routeLocale));
  const [formError, setFormError] = useState('');
  const [formSaving, setFormSaving] = useState<CmsArticleStatus | 'DELETE' | ''>('');

  const summary = useMemo(() => {
    const total = pagination.total;
    const published = articles.filter((article) => article.status === 'PUBLISHED').length;
    const drafts = articles.filter((article) => article.status === 'DRAFT').length;

    return { total, published, drafts };
  }, [articles, pagination.total]);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    params.set('locale', localeFilter || routeLocale);

    if (statusFilter) {
      params.set('status', statusFilter);
    }

    if (typeFilter) {
      params.set('type', typeFilter);
    }

    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }

    try {
      const response = await fetch(`/api/cms/articles?${params.toString()}`);

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      const data = (await response.json()) as ArticleListResponse;
      setArticles(data.articles || []);
      setPagination(data.pagination || { page: 1, pageSize, total: 0, totalPages: 0 });
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load articles.');
      setArticles([]);
      setPagination({ page, pageSize, total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, [localeFilter, page, pageSize, routeLocale, searchQuery, statusFilter, typeFilter]);

  useEffect(() => {
    void loadArticles();
  }, [loadArticles, refreshVersion]);

  const openCreate = useCallback(() => {
    setEditingArticle(null);
    setForm(createEmptyForm(localeFilter || routeLocale));
    setFormError('');
    setFormSaving('');
    setEditorOpen(true);
  }, [localeFilter, routeLocale]);

  const openEdit = useCallback(
    (article: CmsArticle) => {
      setEditingArticle(article);
      setForm(articleToForm(article, localeFilter || routeLocale));
      setFormError('');
      setFormSaving('');
      setEditorOpen(true);
    },
    [localeFilter, routeLocale]
  );

  const closeEditor = useCallback(() => {
    setEditorOpen(false);
    setEditingArticle(null);
    setFormError('');
    setFormSaving('');
  }, []);

  const applySearch = useCallback(() => {
    setPage(1);
    setSearchQuery(searchInput);
  }, [searchInput]);

  const saveArticle = useCallback(
    async (nextStatus: CmsArticleStatus) => {
      const validationError = validateForm(form);

      if (validationError) {
        setFormError(validationError);
        return;
      }

      setFormError('');
      setFormSaving(nextStatus);

      const payload = normalizeArticlePayload(form, nextStatus);
      const isEdit = Boolean(editingArticle);
      const url = isEdit ? `/api/cms/articles/${editingArticle?.id}` : '/api/cms/articles';
      const method = isEdit ? 'PATCH' : 'POST';

      try {
        const response = await adminFetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(await readApiError(response));
        }

        setEditorOpen(false);
        setEditingArticle(null);
        setForm(createEmptyForm(localeFilter || routeLocale));
        setRefreshVersion((value) => value + 1);
      } catch (saveError) {
        setFormError(saveError instanceof Error ? saveError.message : 'Failed to save article.');
      } finally {
        setFormSaving('');
      }
    },
    [editingArticle, form, localeFilter, routeLocale]
  );

  const togglePublished = useCallback(
    async (article: CmsArticle) => {
      const nextStatus: CmsArticleStatus = article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      setFormSaving(nextStatus);

      try {
        const response = await adminFetch(`/api/cms/articles/${article.id}`, {
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
    },
    []
  );

  const deleteArticle = useCallback(async (article: CmsArticle) => {
    const confirmed = window.confirm(
      `Soft delete "${article.title}"? You can keep the record in the database, but it will disappear from the list.`
    );

    if (!confirmed) {
      return false;
    }

    setFormSaving('DELETE');
    setError('');

    try {
      const response = await adminFetch(`/api/cms/articles/${article.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      setRefreshVersion((value) => value + 1);
      return true;
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete article.');
      return false;
    } finally {
      setFormSaving('');
    }
  }, []);

  const deleteFromEditor = useCallback(async () => {
    if (!editingArticle) {
      return;
    }

    const deleted = await deleteArticle(editingArticle);
    if (deleted) {
      closeEditor();
    }
  }, [closeEditor, deleteArticle, editingArticle]);

  const articleCards = useMemo(
    () =>
      articles.map((article) => {
        const isPublished = article.status === 'PUBLISHED';
        const statusChip = isPublished ? chipStyle('published') : chipStyle('draft');
        const typeChip = chipStyle('type');
        const localeChip = chipStyle('locale');

        return (
          <article key={article.id} style={styles.articleCard}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitleBlock}>
                <h3 style={styles.cardTitle}>{article.title}</h3>
                <div style={styles.cardMetaLine}>
                  <span style={localeChip}>{article.locale}</span>
                  <span style={typeChip}>{article.type}</span>
                  <span style={statusChip}>{article.status}</span>
                </div>
              </div>

              <div style={styles.sortBadge}>#{article.sortOrder}</div>
            </div>

            <div style={styles.cardBodyGrid}>
              <div style={styles.cardField}>
                <span style={styles.cardFieldLabel}>Slug</span>
                <span style={styles.cardFieldValue}>{article.slug}</span>
              </div>
              <div style={styles.cardField}>
                <span style={styles.cardFieldLabel}>Symptom label</span>
                <span style={styles.cardFieldValue}>{article.symptomLabel || '—'}</span>
              </div>
              <div style={styles.cardField}>
                <span style={styles.cardFieldLabel}>Updated</span>
                <span style={styles.cardFieldValue}>{renderDate(article.updatedAt)}</span>
              </div>
              <div style={styles.cardField}>
                <span style={styles.cardFieldLabel}>Published</span>
                <span style={styles.cardFieldValue}>{renderDate(article.publishedAt)}</span>
              </div>
            </div>

            <p style={styles.cardSummary}>{shortText(article.shortAnswer || article.content)}</p>

            <div style={styles.actionRow}>
              <button type="button" onClick={() => openEdit(article)} style={styles.secondaryButton}>
                Edit
              </button>
              <button
                type="button"
                onClick={() => void togglePublished(article)}
                disabled={formSaving === 'PUBLISHED' || formSaving === 'DRAFT'}
                style={isPublished ? styles.warningButton : styles.successButton}
              >
                {isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button
                type="button"
                onClick={() => void deleteArticle(article)}
                disabled={formSaving === 'DELETE'}
                style={styles.dangerButton}
              >
                Delete
              </button>
            </div>
          </article>
        );
      }),
    [articles, deleteArticle, formSaving, openEdit, togglePublished]
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Content & Wiki</h1>
          <p style={styles.subtitle}>
            Manage symptom articles, FAQ pages, and service content for the website and AI prompt.
          </p>
        </div>

        <button type="button" onClick={openCreate} style={styles.primaryButton}>
          + New article
        </button>
      </div>

      <div style={styles.statRow}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Matching</span>
          <span style={styles.statValue}>{summary.total}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>On page published</span>
          <span style={styles.statValue}>{summary.published}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>On page drafts</span>
          <span style={styles.statValue}>{summary.drafts}</span>
        </div>
      </div>

      <div style={styles.filters}>
        <label style={styles.filterField}>
          <span style={styles.filterLabel}>Search</span>
          <div style={styles.searchGroup}>
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  applySearch();
                }
              }}
              placeholder="Slug, title, symptom label, short answer"
              style={styles.searchInput}
            />
            <button type="button" onClick={applySearch} style={styles.filterButton}>
              Apply
            </button>
          </div>
        </label>

        <label style={styles.filterField}>
          <span style={styles.filterLabel}>Locale</span>
          <SelectInput
            value={localeFilter}
            onChange={(value) => {
              setLocaleFilter(value);
              setPage(1);
            }}
          >
            {SUPPORTED_LOCALES.map((locale) => (
              <option key={locale} value={locale}>
                {locale}
              </option>
            ))}
          </SelectInput>
        </label>

        <label style={styles.filterField}>
          <span style={styles.filterLabel}>Status</span>
          <SelectInput
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </SelectInput>
        </label>

        <label style={styles.filterField}>
          <span style={styles.filterLabel}>Type</span>
          <SelectInput
            value={typeFilter}
            onChange={(value) => {
              setTypeFilter(value);
              setPage(1);
            }}
          >
            <option value="">All</option>
            {ARTICLE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </SelectInput>
        </label>

        <label style={styles.filterField}>
          <span style={styles.filterLabel}>Page size</span>
          <SelectInput
            value={String(pageSize)}
            onChange={(value) => {
              setPageSize(Number(value));
              setPage(1);
            }}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </SelectInput>
        </label>
      </div>

      {error ? <div style={styles.errorBanner}>{error}</div> : null}

      {loading ? (
        <div style={styles.emptyState}>Loading articles...</div>
      ) : articles.length === 0 ? (
        <div style={styles.emptyState}>
          No articles found for the current filters.
        </div>
      ) : (
        <div style={styles.articleGrid}>{articleCards}</div>
      )}

      <div style={styles.pagination}>
        <button
          type="button"
          onClick={() => setPage((value) => Math.max(1, value - 1))}
          disabled={page <= 1}
          style={styles.paginationButton}
        >
          Previous
        </button>
        <div style={styles.paginationMeta}>
          Page {pagination.page} of {pagination.totalPages || 1} · {pagination.total} total
        </div>
        <button
          type="button"
          onClick={() => setPage((value) => value + 1)}
          disabled={pagination.totalPages > 0 ? page >= pagination.totalPages : true}
          style={styles.paginationButton}
        >
          Next
        </button>
      </div>

      {editorOpen ? (
        <div style={styles.modalOverlay} onClick={closeEditor}>
          <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>
                  {editingArticle ? 'Edit article' : 'New article'}
                </h2>
                <p style={styles.modalSubtitle}>
                  Save a draft, publish it, or keep the content ready for the support flow.
                </p>
              </div>

              <button type="button" onClick={closeEditor} style={styles.closeButton}>
                Close
              </button>
            </div>

            {formError ? <div style={styles.errorBanner}>{formError}</div> : null}

            <div style={styles.formGrid}>
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

              <EditorField label="Type">
                <SelectInput
                  value={form.type}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, type: value as CmsArticleType }))
                  }
                >
                  {ARTICLE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
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
                      status: value as CmsArticleStatus,
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

              <EditorField label="Sort order">
                <TextInput
                  type="number"
                  value={form.sortOrder}
                  onChange={(value) => setForm((current) => ({ ...current, sortOrder: value }))}
                  placeholder="0"
                />
              </EditorField>

              <EditorField label="Slug" hint="Lowercase letters, numbers, hyphens only">
                <TextInput
                  value={form.slug}
                  onChange={(value) => setForm((current) => ({ ...current, slug: value }))}
                  placeholder="sign-not-lighting"
                />
              </EditorField>

              <EditorField label="Title">
                <TextInput
                  value={form.title}
                  onChange={(value) => setForm((current) => ({ ...current, title: value }))}
                  placeholder="Why the sign does not light up"
                />
              </EditorField>

              <EditorField label="Symptom label">
                <TextInput
                  value={form.symptomLabel}
                  onChange={(value) => setForm((current) => ({ ...current, symptomLabel: value }))}
                  placeholder="Optional internal label"
                />
              </EditorField>

              <EditorField label="Short answer">
                <TextArea
                  value={form.shortAnswer}
                  onChange={(value) => setForm((current) => ({ ...current, shortAnswer: value }))}
                  placeholder="1-3 sentence answer for list cards and detail intro"
                  rows={4}
                />
              </EditorField>

              <EditorField label="Canonical URL">
                <TextInput
                  value={form.canonicalUrl}
                  onChange={(value) => setForm((current) => ({ ...current, canonicalUrl: value }))}
                  placeholder="/de/support/sign-not-lighting"
                />
              </EditorField>

              <EditorField label="SEO title">
                <TextInput
                  value={form.seoTitle}
                  onChange={(value) => setForm((current) => ({ ...current, seoTitle: value }))}
                  placeholder="SEO title"
                />
              </EditorField>

              <EditorField label="SEO description">
                <TextArea
                  value={form.seoDescription}
                  onChange={(value) => setForm((current) => ({ ...current, seoDescription: value }))}
                  placeholder="Meta description"
                  rows={4}
                />
              </EditorField>

              <EditorField label="CTA label">
                <TextInput
                  value={form.ctaLabel}
                  onChange={(value) => setForm((current) => ({ ...current, ctaLabel: value }))}
                  placeholder="Send photo"
                />
              </EditorField>

              <EditorField label="CTA href">
                <TextInput
                  value={form.ctaHref}
                  onChange={(value) => setForm((current) => ({ ...current, ctaHref: value }))}
                  placeholder="/de/contact"
                />
              </EditorField>
            </div>

            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Content</h3>
              <EditorField label="Markdown body" hint="Required">
                <TextArea
                  value={form.content}
                  onChange={(value) => setForm((current) => ({ ...current, content: value }))}
                  placeholder="Markdown content"
                  rows={14}
                />
              </EditorField>
            </div>

            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Arrays</h3>
              <div style={styles.arrayGrid}>
                <EditorField label="Related slugs" hint="One slug per line">
                  <TextArea
                    value={form.relatedSlugs}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, relatedSlugs: value }))
                    }
                    rows={5}
                  />
                </EditorField>

                <EditorField label="Causes" hint="One line per item">
                  <TextArea
                    value={form.causes}
                    onChange={(value) => setForm((current) => ({ ...current, causes: value }))}
                    rows={5}
                  />
                </EditorField>

                <EditorField label="Safe checks" hint="One line per item">
                  <TextArea
                    value={form.safeChecks}
                    onChange={(value) => setForm((current) => ({ ...current, safeChecks: value }))}
                    rows={5}
                  />
                </EditorField>

                <EditorField label="Urgent warnings" hint="One line per item">
                  <TextArea
                    value={form.urgentWarnings}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, urgentWarnings: value }))
                    }
                    rows={5}
                  />
                </EditorField>

                <EditorField label="Service process" hint="One line per item">
                  <TextArea
                    value={form.serviceProcess}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, serviceProcess: value }))
                    }
                    rows={5}
                  />
                </EditorField>

                <EditorField label="Work scope factors" hint="One line per item">
                  <TextArea
                    value={form.workScopeFactors}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, workScopeFactors: value }))
                    }
                    rows={5}
                  />
                </EditorField>
              </div>
            </div>

            <div style={styles.metadataPanel}>
              <div style={styles.metadataItem}>
                <span style={styles.cardFieldLabel}>Created</span>
                <span style={styles.cardFieldValue}>{editingArticle ? renderDate(editingArticle.createdAt) : '—'}</span>
              </div>
              <div style={styles.metadataItem}>
                <span style={styles.cardFieldLabel}>Updated</span>
                <span style={styles.cardFieldValue}>{editingArticle ? renderDate(editingArticle.updatedAt) : '—'}</span>
              </div>
              <div style={styles.metadataItem}>
                <span style={styles.cardFieldLabel}>Published</span>
                <span style={styles.cardFieldValue}>{editingArticle ? renderDate(editingArticle.publishedAt) : '—'}</span>
              </div>
              <div style={styles.metadataItem}>
                <span style={styles.cardFieldLabel}>Reviewed</span>
                <span style={styles.cardFieldValue}>
                  {editingArticle ? renderDate(editingArticle.lastReviewedAt) : '—'}
                </span>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button type="button" onClick={closeEditor} style={styles.secondaryButton}>
                Cancel
              </button>
              {editingArticle ? (
                <button
                  type="button"
                  onClick={() => void deleteFromEditor()}
                  disabled={formSaving === 'DELETE'}
                  style={styles.dangerButton}
                >
                  Delete
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => void saveArticle('DRAFT')}
                disabled={Boolean(formSaving)}
                style={styles.warningButton}
              >
                {formSaving === 'DRAFT' ? 'Saving...' : 'Save draft'}
              </button>
              <button
                type="button"
                onClick={() => void saveArticle('PUBLISHED')}
                disabled={Boolean(formSaving)}
                style={styles.successButton}
              >
                {formSaving === 'PUBLISHED' ? 'Publishing...' : 'Publish'}
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
  filters: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
  },
  filterField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  filterLabel: {
    color: '#8b8b8b',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  searchGroup: {
    display: 'flex',
    gap: '8px',
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#0b0b0b',
    color: '#fff',
    outline: 'none',
    fontSize: '13px',
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
  filterButton: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#171717',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
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
  articleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '12px',
  },
  articleCard: {
    border: '1px solid #222',
    borderRadius: '8px',
    background: '#111',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'flex-start',
  },
  cardTitleBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: 0,
  },
  cardTitle: {
    margin: 0,
    fontSize: '16px',
    lineHeight: 1.4,
    color: '#fff',
    fontWeight: 700,
    wordBreak: 'break-word',
  },
  cardMetaLine: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '24px',
    padding: '3px 8px',
    borderRadius: '999px',
    border: '1px solid #333',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  sortBadge: {
    flexShrink: 0,
    padding: '6px 10px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#0b0b0b',
    color: '#d4d4d8',
    fontSize: '12px',
    fontWeight: 700,
  },
  cardBodyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '10px',
  },
  cardField: {
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
  cardSummary: {
    margin: 0,
    color: '#c7c7c7',
    fontSize: '13px',
    lineHeight: 1.6,
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
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    paddingTop: '4px',
  },
  paginationButton: {
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#171717',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 700,
  },
  paginationMeta: {
    color: '#8b8b8b',
    fontSize: '13px',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
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
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    margin: 0,
    color: '#fff',
    fontSize: '14px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  arrayGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '12px',
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
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    flexWrap: 'wrap',
  },
};
