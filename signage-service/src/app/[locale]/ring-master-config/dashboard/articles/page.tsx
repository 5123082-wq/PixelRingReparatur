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

type CmsMedia = {
  id: string;
  locale: string | null;
  usageType: string;
  title: string | null;
  alt: string | null;
  url: string | null;
  mimeType: string | null;
  filename: string | null;
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

type CmsArticleRevision = {
  id: string;
  createdAt: string;
  reason: string | null;
  sourceAction: string | null;
  actorDisplayName: string | null;
  actorEmail: string | null;
  restoredAt: string | null;
  restoredByDisplayName: string | null;
  restoredByEmail: string | null;
  sourceStatus: string | null;
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

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function asObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
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
    }))
    .filter((item) => item.id);
}

function normalizeArticleRevisionsResponse(value: unknown): CmsArticleRevision[] {
  const container = value as { revisions?: unknown; items?: unknown } | null;
  const rows = Array.isArray(value)
    ? value
    : Array.isArray(container?.revisions)
      ? container.revisions
      : Array.isArray(container?.items)
        ? container.items
        : [];

  return rows
    .filter((row): row is Record<string, unknown> =>
      Boolean(row && typeof row === 'object' && !Array.isArray(row))
    )
    .map((row) => {
      const snapshotSummary = asObject(row.snapshotSummary);
      const actorAdminUserId = asString(row.actorAdminUserId);
      const actorSessionId = asString(row.actorSessionId);

      return {
        id: String(row.id ?? row.revisionId ?? ''),
        createdAt: asString(row.createdAt) || '',
        reason: asString(row.reason) || asString(row.restoreReason),
        sourceAction: asString(row.sourceAction),
        actorDisplayName: asString(row.actorDisplayName) || asString(row.actorName),
        actorEmail: asString(row.actorEmail) || actorAdminUserId || actorSessionId,
        restoredAt: asString(row.restoredAt),
        restoredByDisplayName: asString(row.restoredByDisplayName) || asString(row.restoredByName),
        restoredByEmail: asString(row.restoredByEmail),
        sourceStatus:
          asString(row.sourceStatus) ||
          asString(row.status) ||
          asString(snapshotSummary?.status),
      };
    })
    .filter((revision) => revision.id)
    .sort((left, right) => {
      const leftDate = Date.parse(left.createdAt || '');
      const rightDate = Date.parse(right.createdAt || '');
      const leftValue = Number.isNaN(leftDate) ? 0 : leftDate;
      const rightValue = Number.isNaN(rightDate) ? 0 : rightDate;
      return rightValue - leftValue;
    });
}

function createMarkdownMediaReference(media: CmsMedia): string {
  const alt = (media.alt || media.title || media.filename || 'CMS media').replace(/[\r\n\]]/g, ' ');
  const url = media.url || '';
  const title = media.title ? ` "${media.title.replace(/"/g, '\\"')}"` : '';

  return `\n\n![${alt}](${url}${title})\n<!-- cms-media:${media.id} -->\n`;
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
  onCopy,
  onTranslate,
  isTranslating,
  hasReference,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  onCopy?: () => void;
  onTranslate?: () => void;
  isTranslating?: boolean;
  hasReference?: boolean;
}) {
  return (
    <div style={styles.field}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <span style={styles.fieldLabel}>{label}</span>
        {hasReference && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              type="button"
              onClick={onCopy}
              title="Copy from Reference"
              style={styles.fieldActionButton}
            >
              Copy
            </button>
            <button
              type="button"
              onClick={onTranslate}
              disabled={isTranslating}
              title="Translate from Reference via AI"
              style={{
                ...styles.fieldActionButton,
                color: isTranslating ? '#666' : '#8b5cf6',
                borderColor: isTranslating ? '#333' : '#4c1d95',
              }}
            >
              {isTranslating ? '...' : 'AI'}
            </button>
          </div>
        )}
      </div>
      {children}
      {hint ? <span style={styles.fieldHint}>{hint}</span> : null}
    </div>
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
  
  const [referenceDe, setReferenceDe] = useState<CmsArticle | null>(null);
  const [referenceEn, setReferenceEn] = useState<CmsArticle | null>(null);
  const [activeRefLocale, setActiveRefLocale] = useState<'de' | 'en'>('de');
  const [isSplitMode, setIsSplitMode] = useState(false);
  const [isTranslating, setIsTranslating] = useState<string | null>(null);

  const [mediaItems, setMediaItems] = useState<CmsMedia[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState('');
  const [revisions, setRevisions] = useState<CmsArticleRevision[]>([]);
  const [revisionsLoading, setRevisionsLoading] = useState(false);
  const [revisionsError, setRevisionsError] = useState('');
  const [restoreReason, setRestoreReason] = useState('');
  const [restoringRevisionId, setRestoringRevisionId] = useState('');

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

  const loadReferenceArticles = useCallback(async (slug: string) => {
    try {
      const [deRes, enRes] = await Promise.all([
        fetch(`/api/cms/articles?slug=${slug}&locale=de`),
        fetch(`/api/cms/articles?slug=${slug}&locale=en`)
      ]);
      
      if (deRes.ok) {
        const data = await deRes.json();
        setReferenceDe(data.articles?.[0] || null);
      }
      
      if (enRes.ok) {
        const data = await enRes.json();
        setReferenceEn(data.articles?.[0] || null);
      }
    } catch (error) {
      console.error('Failed to load reference articles', error);
    }
  }, []);

  const openCreate = useCallback(() => {
    setEditingArticle(null);
    setForm(createEmptyForm(localeFilter || routeLocale));
    setFormError('');
    setFormSaving('');
    setRevisions([]);
    setRevisionsError('');
    setRestoreReason('');
    setRestoringRevisionId('');
    setEditorOpen(true);
  }, [localeFilter, routeLocale]);

  const openEdit = useCallback(
    (article: CmsArticle) => {
      setEditingArticle(article);
      setForm(articleToForm(article, localeFilter || routeLocale));
      setFormError('');
      setFormSaving('');
      setRevisions([]);
      setRevisionsError('');
      setRestoreReason('');
      setRestoringRevisionId('');
      setEditorOpen(true);
      
      // Load DE and EN references for parallel editing
      void loadReferenceArticles(article.slug);
      
      // Auto-enable split view for non-master locales or if explicitly desired
      if (article.locale !== 'de' && article.locale !== 'en') {
        setIsSplitMode(true);
      } else {
        setIsSplitMode(false);
      }
    },
    [loadReferenceArticles, localeFilter, routeLocale]
  );

  const closeEditor = useCallback(() => {
    setEditorOpen(false);
    setEditingArticle(null);
    setFormError('');
    setFormSaving('');
    setReferenceDe(null);
    setReferenceEn(null);
    setRevisions([]);
    setRevisionsError('');
    setRestoreReason('');
    setRestoringRevisionId('');
  }, []);

  const handleCopyField = useCallback((fieldName: keyof ArticleFormState) => {
    const activeRef = activeRefLocale === 'de' ? referenceDe : referenceEn;
    if (!activeRef) return;

    let value = '';
    // Manual mapping for fields that are arrays in DB but strings in Form
    if (fieldName === 'causes') value = joinLines(activeRef.causes);
    else if (fieldName === 'safeChecks') value = joinLines(activeRef.safeChecks);
    else if (fieldName === 'urgentWarnings') value = joinLines(activeRef.urgentWarnings);
    else if (fieldName === 'serviceProcess') value = joinLines(activeRef.serviceProcess);
    else if (fieldName === 'workScopeFactors') value = joinLines(activeRef.workScopeFactors);
    else if (fieldName === 'relatedSlugs') value = joinLines(activeRef.relatedSlugs);
    else {
      // Direct string mapping
      const refVal = activeRef[fieldName as keyof CmsArticle];
      value = typeof refVal === 'string' ? refVal : String(refVal ?? '');
    }

    setForm((prev) => ({ ...prev, [fieldName]: value }));
  }, [activeRefLocale, referenceDe, referenceEn]);

  const handleAiTranslateField = useCallback(async (fieldName: keyof ArticleFormState) => {
    const activeRef = activeRefLocale === 'de' ? referenceDe : referenceEn;
    if (!activeRef) return;

    const sourceText = activeRef[fieldName as keyof CmsArticle];
    if (!sourceText || (Array.isArray(sourceText) && sourceText.length === 0)) return;

    setIsTranslating(fieldName);
    
    try {
      // This uses a generic AI completion endpoint to translate the specific field
      const response = await adminFetch('/api/cms/articles/translate-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: Array.isArray(sourceText) ? joinLines(sourceText) : sourceText,
          targetLocale: form.locale,
          sourceLocale: activeRef.locale,
          fieldName
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setForm(prev => ({ ...prev, [fieldName]: data.translatedText }));
      }
    } catch (error) {
      console.error('Translation failed', error);
    } finally {
      setIsTranslating(null);
    }
  }, [activeRefLocale, referenceDe, referenceEn, form.locale]);

  const loadArticleRevisions = useCallback(async (articleId: string) => {
    setRevisionsLoading(true);
    setRevisionsError('');

    try {
      const response = await fetch(`/api/cms/articles/${articleId}/revisions`, {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      const data = (await response.json().catch(() => null)) as unknown;
      setRevisions(normalizeArticleRevisionsResponse(data));
    } catch (error) {
      setRevisions([]);
      setRevisionsError(error instanceof Error ? error.message : 'Failed to load article revisions.');
    } finally {
      setRevisionsLoading(false);
    }
  }, []);

  const refreshEditingArticle = useCallback(
    async (articleId: string) => {
      const response = await fetch(`/api/cms/articles/${articleId}`, {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      const data = (await response.json().catch(() => null)) as { article?: CmsArticle } | null;

      if (!data?.article) {
        throw new Error('Failed to refresh article after restore.');
      }

      setEditingArticle(data.article);
      setForm(articleToForm(data.article, localeFilter || routeLocale));
    },
    [localeFilter, routeLocale]
  );

  const insertMediaReference = useCallback((media: CmsMedia) => {
    if (!media.url) {
      setMediaError('Selected media is missing a public URL.');
      return;
    }

    setMediaError('');
    setForm((current) => ({
      ...current,
      content: `${current.content.trimEnd()}${createMarkdownMediaReference(media)}`,
    }));
  }, []);

  useEffect(() => {
    if (!editorOpen || !editingArticle) {
      return;
    }

    void loadArticleRevisions(editingArticle.id);
  }, [editorOpen, editingArticle, loadArticleRevisions]);

  const restoreArticleRevision = useCallback(
    async (revision: CmsArticleRevision) => {
      if (!editingArticle) {
        return;
      }

      const reason = restoreReason.trim();
      if (!reason) {
        setRevisionsError('Restore reason is required.');
        return;
      }

      const confirmed = window.confirm(
        `Restore article "${editingArticle.title}" from revision ${renderDate(revision.createdAt)}?`
      );

      if (!confirmed) {
        return;
      }

      setRestoringRevisionId(revision.id);
      setRevisionsError('');

      try {
        const response = await adminFetch(`/api/cms/articles/${editingArticle.id}/restore`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            revisionId: revision.id,
            reason,
          }),
        });

        if (!response.ok) {
          throw new Error(await readApiError(response));
        }

        await Promise.all([
          loadArticleRevisions(editingArticle.id),
          refreshEditingArticle(editingArticle.id),
        ]);
        setRestoreReason('');
        setRefreshVersion((value) => value + 1);
      } catch (error) {
        setRevisionsError(error instanceof Error ? error.message : 'Failed to restore article revision.');
      } finally {
        setRestoringRevisionId('');
      }
    },
    [editingArticle, loadArticleRevisions, refreshEditingArticle, restoreReason]
  );

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
          <div
            style={{
              ...styles.modal,
              width: isSplitMode ? 'min(1440px, 100%)' : 'min(1120px, 100%)',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>
                  {editingArticle ? 'Edit article' : 'New article'}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <p style={{ ...styles.modalSubtitle, margin: 0 }}>
                    Save a draft, publish it, or keep the content ready for the support flow.
                  </p>
                  {editingArticle && (
                    <button
                      type="button"
                      onClick={() => setIsSplitMode(!isSplitMode)}
                      style={{
                        ...styles.secondaryButton,
                        borderColor: isSplitMode ? '#8b5cf6' : '#333',
                        color: isSplitMode ? '#8b5cf6' : '#fff',
                        padding: '4px 10px',
                        fontSize: '11px',
                      }}
                    >
                      {isSplitMode ? 'Hide Parallel View' : 'Show Parallel View'}
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={closeEditor} style={styles.closeButton}>
                  Close
                </button>
              </div>
            </div>

            {formError ? <div style={styles.errorBanner}>{formError}</div> : null}

              <div style={isSplitMode ? styles.splitWorkspace : {}}>
                {isSplitMode && (
                  <div style={styles.referencePane}>
                    <div style={styles.referenceHeader}>
                      <div style={styles.referenceTabs}>
                        {(['de', 'en'] as const).map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => setActiveRefLocale(loc)}
                            style={{
                              ...styles.referenceTab,
                              background: activeRefLocale === loc ? '#8b5cf6' : 'transparent',
                              color: activeRefLocale === loc ? '#fff' : '#888',
                            }}
                          >
                            {loc.toUpperCase()} {loc === 'de' ? 'MASTER' : 'AI MASTER'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={styles.referenceContent}>
                      {activeRefLocale === 'de' && !referenceDe && (
                        <div style={styles.referenceEmpty}>No German version found for this slug.</div>
                      )}
                      {activeRefLocale === 'en' && !referenceEn && (
                        <div style={styles.referenceEmpty}>No English version found for this slug.</div>
                      )}
                      
                      {((activeRefLocale === 'de' && referenceDe) || (activeRefLocale === 'en' && referenceEn)) ? (
                        (() => {
                          const ref = activeRefLocale === 'de' ? referenceDe : referenceEn;
                          if (!ref) return null;
                          
                          return (
                            <>
                              <div style={styles.cardField}>
                                <span style={styles.cardFieldLabel}>Title</span>
                                <div style={styles.cardFieldValue}>{ref.title}</div>
                              </div>
                              <div style={styles.cardField}>
                                <span style={styles.cardFieldLabel}>Short Answer</span>
                                <div style={styles.cardFieldValue}>{ref.shortAnswer}</div>
                              </div>
                              <div style={styles.cardField}>
                                <span style={styles.cardFieldLabel}>Main Content</span>
                                <div style={{ ...styles.cardFieldValue, whiteSpace: 'pre-wrap', maxHeight: '300px', overflow: 'auto', background: '#000', padding: '10px', borderRadius: '4px' }}>
                                  {ref.content}
                                </div>
                              </div>
                              {/* SEO Items */}
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div style={styles.cardField}>
                                  <span style={styles.cardFieldLabel}>SEO Title</span>
                                  <div style={styles.cardFieldValue}>{ref.seoTitle}</div>
                                </div>
                                <div style={styles.cardField}>
                                  <span style={styles.cardFieldLabel}>CTA Link</span>
                                  <div style={styles.cardFieldValue}>{ref.ctaHref}</div>
                                </div>
                              </div>
                            </>
                          );
                        })()
                      ) : null}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={styles.formSection}>

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

                <EditorField label="Sort order"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('sortOrder')}
                >
                  <TextInput
                    type="number"
                    value={form.sortOrder}
                    onChange={(value) => setForm((current) => ({ ...current, sortOrder: value }))}
                    placeholder="0"
                  />
                </EditorField>

                <EditorField label="Slug" hint="Lowercase letters, numbers, hyphens only"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('slug')}
                >
                  <TextInput
                    value={form.slug}
                    onChange={(value) => setForm((current) => ({ ...current, slug: value }))}
                    placeholder="sign-not-lighting"
                  />
                </EditorField>

                <EditorField label="Title"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('title')}
                  onTranslate={() => handleAiTranslateField('title')}
                  isTranslating={isTranslating === 'title'}
                >
                  <TextInput
                    value={form.title}
                    onChange={(value) => setForm((current) => ({ ...current, title: value }))}
                    placeholder="Why the sign does not light up"
                  />
                </EditorField>

                <EditorField label="Symptom label"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('symptomLabel')}
                  onTranslate={() => handleAiTranslateField('symptomLabel')}
                  isTranslating={isTranslating === 'symptomLabel'}
                >
                  <TextInput
                    value={form.symptomLabel}
                    onChange={(value) => setForm((current) => ({ ...current, symptomLabel: value }))}
                    placeholder="Optional internal label"
                  />
                </EditorField>

                <EditorField label="Short answer"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('shortAnswer')}
                  onTranslate={() => handleAiTranslateField('shortAnswer')}
                  isTranslating={isTranslating === 'shortAnswer'}
                >
                  <TextArea
                    value={form.shortAnswer}
                    onChange={(value) => setForm((current) => ({ ...current, shortAnswer: value }))}
                    placeholder="1-3 sentence answer for list cards and detail intro"
                    rows={4}
                  />
                </EditorField>

                <EditorField label="Canonical URL"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('canonicalUrl')}
                >
                  <TextInput
                    value={form.canonicalUrl}
                    onChange={(value) => setForm((current) => ({ ...current, canonicalUrl: value }))}
                    placeholder="/de/support/sign-not-lighting"
                  />
                </EditorField>

                <EditorField label="SEO title"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('seoTitle')}
                  onTranslate={() => handleAiTranslateField('seoTitle')}
                  isTranslating={isTranslating === 'seoTitle'}
                >
                  <TextInput
                    value={form.seoTitle}
                    onChange={(value) => setForm((current) => ({ ...current, seoTitle: value }))}
                    placeholder="SEO title"
                  />
                </EditorField>

                <EditorField label="SEO description"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('seoDescription')}
                  onTranslate={() => handleAiTranslateField('seoDescription')}
                  isTranslating={isTranslating === 'seoDescription'}
                >
                  <TextArea
                    value={form.seoDescription}
                    onChange={(value) => setForm((current) => ({ ...current, seoDescription: value }))}
                    placeholder="Meta description"
                    rows={4}
                  />
                </EditorField>

                <EditorField label="CTA label"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('ctaLabel')}
                  onTranslate={() => handleAiTranslateField('ctaLabel')}
                  isTranslating={isTranslating === 'ctaLabel'}
                >
                  <TextInput
                    value={form.ctaLabel}
                    onChange={(value) => setForm((current) => ({ ...current, ctaLabel: value }))}
                    placeholder="Send photo"
                  />
                </EditorField>

                <EditorField label="CTA href"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('ctaHref')}
                >
                  <TextInput
                    value={form.ctaHref}
                    onChange={(value) => setForm((current) => ({ ...current, ctaHref: value }))}
                    placeholder="/de/contact"
                  />
                </EditorField>
              </div>

              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Content</h3>
                <EditorField label="Markdown body" hint="Required"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('content')}
                  onTranslate={() => handleAiTranslateField('content')}
                  isTranslating={isTranslating === 'content'}
                >
                  <TextArea
                    value={form.content}
                    onChange={(value) => setForm((current) => ({ ...current, content: value }))}
                    placeholder="Markdown content"
                    rows={14}
                  />
                </EditorField>

              <div style={styles.mediaPickerPanel}>
                <div style={styles.mediaPickerHeader}>
                  <div>
                    <h4 style={styles.mediaPickerTitle}>Media picker</h4>
                    <p style={styles.mediaPickerText}>
                      Inserts a public CMS media Markdown reference into the article body.
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
                        onClick={() => insertMediaReference(media)}
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
            </div>

            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Arrays</h3>
              <div style={styles.arrayGrid}>
                <EditorField label="Related slugs" hint="One slug per line"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('relatedSlugs')}
                >
                  <TextArea
                    value={form.relatedSlugs}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, relatedSlugs: value }))
                    }
                    rows={5}
                  />
                </EditorField>

                <EditorField label="Causes" hint="One line per item"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('causes')}
                  onTranslate={() => handleAiTranslateField('causes')}
                  isTranslating={isTranslating === 'causes'}
                >
                  <TextArea
                    value={form.causes}
                    onChange={(value) => setForm((current) => ({ ...current, causes: value }))}
                    rows={5}
                  />
                </EditorField>

                <EditorField label="Safe checks" hint="One line per item"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('safeChecks')}
                  onTranslate={() => handleAiTranslateField('safeChecks')}
                  isTranslating={isTranslating === 'safeChecks'}
                >
                  <TextArea
                    value={form.safeChecks}
                    onChange={(value) => setForm((current) => ({ ...current, safeChecks: value }))}
                    rows={5}
                  />
                </EditorField>

                <EditorField label="Urgent warnings" hint="One line per item"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('urgentWarnings')}
                  onTranslate={() => handleAiTranslateField('urgentWarnings')}
                  isTranslating={isTranslating === 'urgentWarnings'}
                >
                  <TextArea
                    value={form.urgentWarnings}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, urgentWarnings: value }))
                    }
                    rows={5}
                  />
                </EditorField>

                <EditorField label="Service process" hint="One line per item"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('serviceProcess')}
                  onTranslate={() => handleAiTranslateField('serviceProcess')}
                  isTranslating={isTranslating === 'serviceProcess'}
                >
                  <TextArea
                    value={form.serviceProcess}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, serviceProcess: value }))
                    }
                    rows={5}
                  />
                </EditorField>

                <EditorField label="Work scope factors" hint="One line per item"
                  hasReference={isSplitMode && !!(activeRefLocale === 'de' ? referenceDe : referenceEn)}
                  onCopy={() => handleCopyField('workScopeFactors')}
                  onTranslate={() => handleAiTranslateField('workScopeFactors')}
                  isTranslating={isTranslating === 'workScopeFactors'}
                >
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

            {editingArticle ? (
              <div style={styles.revisionsPanel}>
                <div style={styles.revisionsHeader}>
                  <div>
                    <h3 style={styles.sectionTitle}>Revisions</h3>
                    <p style={styles.revisionsSubtitle}>
                      History is sorted newest first. Restore keeps the content in draft-safe flow.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void loadArticleRevisions(editingArticle.id)}
                    disabled={revisionsLoading}
                    style={styles.secondaryButton}
                  >
                    {revisionsLoading ? 'Loading...' : 'Refresh revisions'}
                  </button>
                </div>

                <EditorField
                  label="Restore reason"
                  hint="Required before restore. Stored in audit logs."
                >
                  <TextInput
                    value={restoreReason}
                    onChange={setRestoreReason}
                    placeholder="Explain why this revision is being restored"
                  />
                </EditorField>

                {revisionsError ? <div style={styles.errorBanner}>{revisionsError}</div> : null}

                {revisionsLoading ? (
                  <div style={styles.emptyState}>Loading revisions...</div>
                ) : revisions.length === 0 ? (
                  <div style={styles.emptyState}>No revisions found for this article yet.</div>
                ) : (
                  <div style={styles.revisionList}>
                    {revisions.map((revision) => (
                      <div key={revision.id} style={styles.revisionItem}>
                        <div style={styles.revisionMeta}>
                          <span style={styles.revisionDate}>{renderDate(revision.createdAt)}</span>
                          <span style={styles.revisionActor}>
                            {revision.actorDisplayName || revision.actorEmail || 'Unknown actor'}
                          </span>
                          {revision.sourceAction ? (
                            <span style={styles.revisionStatusChip}>{revision.sourceAction}</span>
                          ) : null}
                          {revision.sourceStatus ? (
                            <span style={styles.revisionStatusChip}>{revision.sourceStatus}</span>
                          ) : null}
                        </div>
                        {revision.reason ? (
                          <div style={styles.revisionReason}>Reason: {revision.reason}</div>
                        ) : null}
                        {revision.restoredAt ? (
                          <div style={styles.revisionRestoreMeta}>
                            Restored on {renderDate(revision.restoredAt)} by{' '}
                            {revision.restoredByDisplayName ||
                              revision.restoredByEmail ||
                              'unknown user'}
                          </div>
                        ) : null}
                        <div style={styles.revisionActions}>
                          <button
                            type="button"
                            onClick={() => void restoreArticleRevision(revision)}
                            disabled={!restoreReason.trim() || restoringRevisionId === revision.id}
                            style={styles.warningButton}
                          >
                            {restoringRevisionId === revision.id ? 'Restoring...' : 'Restore revision'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

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
    transition: 'width 0.3s ease-in-out',
  },
  splitWorkspace: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    alignItems: 'stretch',
  },
  referencePane: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '8px',
    overflow: 'hidden',
    height: 'fit-content',
    position: 'sticky' as const,
    top: 0,
  },
  referenceHeader: {
    padding: '8px 12px',
    background: '#141414',
    borderBottom: '1px solid #222',
  },
  referenceTabs: {
    display: 'flex',
    gap: '2px',
    padding: '2px',
    background: '#000',
    borderRadius: '6px',
  },
  referenceTab: {
    flex: 1,
    padding: '6px',
    fontSize: '11px',
    fontWeight: 700,
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  referenceContent: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxHeight: '600px',
    overflowY: 'auto' as const,
  },
  referenceEmpty: {
    padding: '32px 16px',
    textAlign: 'center' as const,
    color: '#666',
    fontSize: '13px',
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
  revisionsPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '12px',
    border: '1px solid #222',
    borderRadius: '8px',
    background: '#0b0b0b',
  },
  revisionsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  revisionsSubtitle: {
    margin: '4px 0 0',
    color: '#8b8b8b',
    fontSize: '12px',
    lineHeight: 1.5,
  },
  revisionList: {
    display: 'grid',
    gap: '10px',
  },
  revisionItem: {
    border: '1px solid #252525',
    borderRadius: '8px',
    background: '#111',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  revisionMeta: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  revisionDate: {
    color: '#fff',
    fontSize: '12px',
    fontWeight: 700,
  },
  revisionActor: {
    color: '#8b8b8b',
    fontSize: '12px',
    lineHeight: 1.4,
  },
  revisionStatusChip: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '22px',
    padding: '2px 8px',
    borderRadius: '999px',
    border: '1px solid #333',
    background: '#161616',
    color: '#d4d4d8',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  revisionReason: {
    color: '#d4d4d8',
    fontSize: '12px',
    lineHeight: 1.5,
  },
  revisionRestoreMeta: {
    color: '#8b8b8b',
    fontSize: '12px',
    lineHeight: 1.5,
  },
  revisionActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    flexWrap: 'wrap',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    flexWrap: 'wrap',
  },
};
