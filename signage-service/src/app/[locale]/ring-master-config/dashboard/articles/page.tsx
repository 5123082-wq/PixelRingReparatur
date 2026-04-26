'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useParams } from 'next/navigation';

import { adminFetch } from '@/lib/admin-fetch';

type CmsArticleType = 'SYMPTOM' | 'FAQ' | 'PAGE' | 'SERVICE' | 'CASE';
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
  statusReason: string;
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
const STATUS_OPTIONS: CmsArticleStatus[] = [
  'DRAFT',
  'IN_REVIEW',
  'APPROVED',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
];
const PAGE_SIZE_OPTIONS = [10, 25, 50];
type ArticleListView = 'ALL' | 'REVIEW_QUEUE';

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
    statusReason: '',
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
    statusReason: '',
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
    statusReason: toNullable(form.statusReason),
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
  const [listView, setListView] = useState<ArticleListView>('ALL');
  const [draftSavedNotice, setDraftSavedNotice] = useState('');

  // ── Editor state ──
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>('content');
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
    const inWorkflow = articles.filter(
      (article) =>
        article.status === 'IN_REVIEW' ||
        article.status === 'APPROVED' ||
        article.status === 'SCHEDULED' ||
        article.status === 'ARCHIVED'
    ).length;

    return { total, published, drafts, inWorkflow };
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
    if (activeArticleId) {
      void loadMediaItems();
    }
  }, [activeArticleId, loadMediaItems]);

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
    setActiveArticleId('new');
    setActiveSectionId('content');
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
      setActiveArticleId(article.id);
      setActiveSectionId('content');
      
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
    setActiveArticleId(null);
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
    if (!activeArticleId || !editingArticle) {
      return;
    }

    void loadArticleRevisions(editingArticle.id);
  }, [activeArticleId, editingArticle, loadArticleRevisions]);

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

  const showDrafts = useCallback(() => {
    setListView('ALL');
    setStatusFilter('DRAFT');
    setPage(1);
  }, []);

  const showReviewQueue = useCallback(() => {
    setListView('REVIEW_QUEUE');
    setStatusFilter('');
    setPage(1);
  }, []);

  const clearListView = useCallback(() => {
    setListView('ALL');
    setStatusFilter('');
    setPage(1);
  }, []);

  const visibleArticles = useMemo(() => {
    if (listView !== 'REVIEW_QUEUE') {
      return articles;
    }

    return articles.filter(
      (article) => article.status === 'IN_REVIEW' || article.status === 'APPROVED'
    );
  }, [articles, listView]);

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
      const normalizedFormLocale = form.locale.trim() || 'de';
      const sourceArticle = editingArticle;
      const isEdit = sourceArticle !== null;
      const isTranslationCreate =
        sourceArticle !== null && normalizedFormLocale !== sourceArticle.locale;
      const useCreatePath = !isEdit || isTranslationCreate;
      const url = useCreatePath
        ? '/api/cms/articles'
        : `/api/cms/articles/${sourceArticle?.id}`;
      const method = useCreatePath ? 'POST' : 'PATCH';

      try {
        const response = await adminFetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(await readApiError(response));
        }

        setActiveArticleId(null);
        setEditingArticle(null);
        setForm(createEmptyForm(localeFilter || routeLocale));
        if (isTranslationCreate) {
          setDraftSavedNotice(
            `New ${normalizedFormLocale.toUpperCase()} locale article created from source locale ${sourceArticle?.locale.toUpperCase()}. Original article was kept unchanged.`
          );
        } else if (nextStatus === 'DRAFT') {
          const slug = normalizeSlug(form.slug);
          const title = form.title.trim();
          setDraftSavedNotice(
            title
              ? `Draft saved: "${title}". Use "Show drafts" to find it quickly.`
              : `Draft saved: "${slug}". Use "Show drafts" to find it quickly.`
          );
        } else {
          setDraftSavedNotice('');
        }
        setRefreshVersion((value) => value + 1);
      } catch (saveError) {
        setFormError(saveError instanceof Error ? saveError.message : 'Failed to save article.');
      } finally {
        setFormSaving('');
      }
    },
    [editingArticle, form, localeFilter, routeLocale]
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

  const renderArticleEditor = () => {
    if (!activeArticleId) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl">
            📖
          </div>
          <div>
            <h3 className="text-white font-medium text-lg">No Article Selected</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              Select an article from the sidebar to edit or create a new one.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Create New Article
          </button>
        </div>
      );
    }

    return (
      <div className="w-full mx-auto space-y-8 pb-24 px-4">
        {/* Editor Header */}
        <div className="flex items-center justify-between sticky top-0 z-10 bg-black/80 backdrop-blur-md py-4 border-b border-white/5 -mt-8 mb-8 px-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">
              {activeArticleId === 'new' ? 'New Article' : 'Edit Article'}
            </h2>
            {activeArticleId !== 'new' && (
              <button
                onClick={() => setIsSplitMode(!isSplitMode)}
                className={`px-3 py-1 rounded text-[11px] font-bold border transition-colors ${
                  isSplitMode 
                    ? 'border-violet-500/50 bg-violet-500/10 text-violet-400' 
                    : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {isSplitMode ? 'Hide Reference' : 'Parallel View (DE/EN)'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
             <button
              onClick={closeEditor}
              className="px-4 py-2 bg-white/5 text-zinc-400 text-sm font-bold rounded-lg border border-white/10 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => void saveArticle('DRAFT')}
              disabled={Boolean(formSaving)}
              className="px-4 py-2 bg-zinc-800 text-white text-sm font-bold rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              {formSaving === 'DRAFT' ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => void saveArticle(form.status)}
              disabled={Boolean(formSaving)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors disabled:opacity-50 ${
                form.status === 'PUBLISHED' 
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-violet-500/20' 
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              {formSaving === form.status 
                ? 'Saving...' 
                : form.status === 'PUBLISHED' ? 'Publish' : `Save as ${form.status}`}
            </button>
          </div>
        </div>

        {formError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {formError}
          </div>
        )}

        <div className={`grid gap-8 ${isSplitMode ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {/* Main Form Pane */}
          <div className="space-y-8">
            {/* Meta Section */}
            <section className="bg-[#050505] border border-white/5 rounded-2xl p-6 space-y-6">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                Basic Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Locale</label>
                  <select
                    value={form.locale}
                    onChange={(e) => setForm(f => ({ ...f, locale: e.target.value }))}
                    className="w-full bg-[#000] border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-violet-500/50"
                  >
                    {SUPPORTED_LOCALES.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm(f => ({ ...f, type: e.target.value as CmsArticleType }))}
                    className="w-full bg-[#000] border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-violet-500/50"
                  >
                    {ARTICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase flex justify-between items-center">
                  Slug
                  {isSplitMode && (activeRefLocale === 'de' ? referenceDe : referenceEn) && (
                    <button onClick={() => handleCopyField('slug')} className="text-violet-400 hover:text-violet-300">Copy Ref</button>
                  )}
                </label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="sign-not-lighting"
                  className="w-full bg-[#000] border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-violet-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase flex justify-between items-center">
                  Title
                  {isSplitMode && (activeRefLocale === 'de' ? referenceDe : referenceEn) && (
                    <div className="flex gap-2">
                      <button onClick={() => handleCopyField('title')} className="text-violet-400 hover:text-violet-300">Copy</button>
                      <button onClick={() => handleAiTranslateField('title')} className="text-cyan-400 hover:text-cyan-300">AI</button>
                    </div>
                  )}
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Article Title"
                  className="w-full bg-[#000] border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-violet-500/50 font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase flex justify-between items-center">
                  Short Answer
                  {isSplitMode && (activeRefLocale === 'de' ? referenceDe : referenceEn) && (
                    <div className="flex gap-2">
                      <button onClick={() => handleCopyField('shortAnswer')} className="text-violet-400 hover:text-violet-300">Copy</button>
                      <button onClick={() => handleAiTranslateField('shortAnswer')} className="text-cyan-400 hover:text-cyan-300">AI</button>
                    </div>
                  )}
                </label>
                <textarea
                  value={form.shortAnswer}
                  onChange={(e) => setForm(f => ({ ...f, shortAnswer: e.target.value }))}
                  rows={3}
                  placeholder="Concise answer for previews"
                  className="w-full bg-[#000] border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-violet-500/50 resize-none"
                />
              </div>
            </section>

            {/* Content Section */}
            <section className="bg-[#050505] border border-white/5 rounded-2xl p-6 space-y-6">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                Main Content
              </h3>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase flex justify-between items-center">
                  Markdown Body
                  {isSplitMode && (activeRefLocale === 'de' ? referenceDe : referenceEn) && (
                    <div className="flex gap-2">
                      <button onClick={() => handleCopyField('content')} className="text-violet-400 hover:text-violet-300">Copy</button>
                      <button onClick={() => handleAiTranslateField('content')} className="text-cyan-400 hover:text-cyan-300">AI</button>
                    </div>
                  )}
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={15}
                  placeholder="Markdown content..."
                  className="w-full bg-[#000] border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-violet-500/50 font-mono"
                />
              </div>

              {/* Media Picker Mini */}
              <div className="p-4 bg-black border border-white/5 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase">Media Picker</h4>
                  <button onClick={() => void loadMediaItems()} className="text-[10px] text-violet-400 font-bold uppercase hover:text-violet-300">Refresh</button>
                </div>
                <div className="grid grid-cols-4 gap-2 overflow-x-auto pb-2">
                  {mediaItems.slice(0, 8).map(media => (
                    <button
                      key={media.id}
                      onClick={() => insertMediaReference(media)}
                      className="aspect-square bg-zinc-900 rounded border border-white/5 overflow-hidden hover:border-violet-500/50 transition-colors group"
                    >
                      {media.url ? (
                        <img src={media.url} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600">No URL</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Diagnostics Section */}
            <section className="bg-[#050505] border border-white/5 rounded-2xl p-6 space-y-6">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                Diagnosis & Process
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Causes', key: 'causes' as const },
                  { label: 'Safe Checks', key: 'safeChecks' as const },
                  { label: 'Urgent Warnings', key: 'urgentWarnings' as const },
                  { label: 'Service Process', key: 'serviceProcess' as const },
                  { label: 'Work Scope', key: 'workScopeFactors' as const },
                  { label: 'Related Slugs', key: 'relatedSlugs' as const }
                ].map(field => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase flex justify-between items-center">
                      {field.label}
                      {isSplitMode && (activeRefLocale === 'de' ? referenceDe : referenceEn) && (
                        <div className="flex gap-2">
                          <button onClick={() => handleCopyField(field.key)} className="text-violet-400 text-[9px]">Copy</button>
                          <button onClick={() => handleAiTranslateField(field.key)} className="text-cyan-400 text-[9px]">AI</button>
                        </div>
                      )}
                    </label>
                    <textarea
                      value={form[field.key]}
                      onChange={(e) => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      rows={4}
                      placeholder="One item per line"
                      className="w-full bg-[#000] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-violet-500/50 resize-none"
                    />
                  </div>
                ))}
              </div>
            </section>

             {/* SEO & Status Section */}
             <section className="bg-[#050505] border border-white/5 rounded-2xl p-6 space-y-6">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                SEO & Status
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm(f => ({ ...f, status: e.target.value as CmsArticleStatus }))}
                    className="w-full bg-[#000] border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-violet-500/50"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm(f => ({ ...f, sortOrder: e.target.value }))}
                    className="w-full bg-[#000] border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase flex justify-between items-center">
                  SEO Title
                  {isSplitMode && (activeRefLocale === 'de' ? referenceDe : referenceEn) && (
                    <button onClick={() => handleAiTranslateField('seoTitle')} className="text-cyan-400 text-[9px]">AI</button>
                  )}
                </label>
                <input
                  value={form.seoTitle}
                  onChange={(e) => setForm(f => ({ ...f, seoTitle: e.target.value }))}
                  placeholder="Browser title"
                  className="w-full bg-[#000] border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-violet-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase flex justify-between items-center">
                  SEO Description
                  {isSplitMode && (activeRefLocale === 'de' ? referenceDe : referenceEn) && (
                    <button onClick={() => handleAiTranslateField('seoDescription')} className="text-cyan-400 text-[9px]">AI</button>
                  )}
                </label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => setForm(f => ({ ...f, seoDescription: e.target.value }))}
                  rows={3}
                  placeholder="Meta description"
                  className="w-full bg-[#000] border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-violet-500/50 resize-none"
                />
              </div>
            </section>

            {/* Advanced Section */}
            {activeArticleId !== 'new' && (
              <section className="bg-[#050505] border border-white/5 rounded-2xl p-6 space-y-6">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  Advanced
                </h3>
                
                <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-xl space-y-4">
                   <p className="text-zinc-500 text-xs italic">
                    Delete this article permanently. This action cannot be undone.
                  </p>
                  <button
                    onClick={() => void deleteFromEditor()}
                    disabled={formSaving === 'DELETE'}
                    className="w-full px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    {formSaving === 'DELETE' ? 'Deleting...' : 'Delete Permanently'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase">Revisions</h4>
                    <button 
                      onClick={() => void loadArticleRevisions(activeArticleId)} 
                      className="text-[10px] text-violet-400 font-bold uppercase"
                      disabled={revisionsLoading}
                    >
                      {revisionsLoading ? '...' : 'Refresh'}
                    </button>
                  </div>
                  {revisions.length > 0 ? (
                    <div className="space-y-2">
                      {revisions.slice(0, 5).map(rev => (
                        <div key={rev.id} className="p-3 bg-black border border-white/5 rounded-lg flex items-center justify-between gap-4">
                          <div className="min-width-0">
                            <p className="text-[10px] text-zinc-500">{renderDate(rev.createdAt)}</p>
                            <p className="text-xs text-white truncate">{rev.actorDisplayName || rev.actorEmail}</p>
                          </div>
                          <button 
                            onClick={() => void restoreArticleRevision(rev)}
                            disabled={!restoreReason.trim() || restoringRevisionId === rev.id}
                            className="px-2 py-1 bg-white/5 border border-white/10 text-[9px] font-bold text-zinc-400 hover:text-white rounded disabled:opacity-30"
                          >
                            Restore
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-zinc-600 italic text-center py-4">No revisions found.</p>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Reference Pane (Split Mode) */}
          {isSplitMode && (
             <div className="space-y-8">
               <section className="bg-[#080808] border border-violet-500/20 rounded-2xl p-6 space-y-6 sticky top-[100px]">
                 <div className="flex items-center justify-between border-b border-white/5 pb-4">
                   <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest">
                     Reference Master
                   </h3>
                   <div className="flex bg-black rounded-lg p-1 border border-white/5">
                     {(['de', 'en'] as const).map(loc => (
                       <button
                         key={loc}
                         onClick={() => setActiveRefLocale(loc)}
                         className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                           activeRefLocale === loc ? 'bg-violet-600 text-white' : 'text-zinc-500 hover:text-zinc-300'
                         }`}
                       >
                         {loc}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                   {(() => {
                     const ref = activeRefLocale === 'de' ? referenceDe : referenceEn;
                     if (!ref) {
                       return <div className="text-zinc-600 text-xs italic py-12 text-center">No {activeRefLocale.toUpperCase()} reference found.</div>;
                     }

                     return (
                       <div className="space-y-6">
                         {[
                           { label: 'Title', value: ref.title },
                           { label: 'Short Answer', value: ref.shortAnswer },
                           { label: 'Content', value: ref.content, mono: true },
                           { label: 'SEO Title', value: ref.seoTitle },
                           { label: 'SEO Description', value: ref.seoDescription }
                         ].map(item => (
                           <div key={item.label} className="space-y-2">
                             <label className="text-[10px] font-bold text-zinc-600 uppercase">{item.label}</label>
                             <div className={`p-3 bg-black border border-white/5 rounded-lg text-xs text-zinc-300 leading-relaxed ${item.mono ? 'font-mono whitespace-pre-wrap' : ''}`}>
                               {item.value || '—'}
                             </div>
                           </div>
                         ))}
                       </div>
                     );
                   })()}
                 </div>
               </section>
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-[#050505] overflow-hidden">
      {/* 2nd Column: Sidebar List */}
      <aside className="w-[280px] border-r border-white/5 flex flex-col bg-[#050505] shrink-0">
        {/* Search & Header */}
        <div className="p-4 border-b border-white/5 space-y-4 bg-black/20">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-sm tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
              Articles & Wiki
            </h2>
            <button
              onClick={openCreate}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white border border-white/10 transition-colors"
              title="Create New"
            >
              <span className="text-lg leading-none">+</span>
            </button>
          </div>
          
          <div className="relative group">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearch()}
              placeholder="Search slug, title..."
              className="w-full bg-[#111] border border-white/5 rounded-xl py-2 pl-3 pr-10 text-xs text-white outline-none focus:border-violet-500/50 transition-colors"
            />
            <button 
              onClick={applySearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-zinc-300 transition-colors"
            >
              ⏎
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={localeFilter}
              onChange={(e) => { setLocaleFilter(e.target.value); setPage(1); }}
              className="bg-zinc-900 border border-white/5 rounded-lg p-1.5 text-[10px] text-zinc-400 outline-none"
            >
              {SUPPORTED_LOCALES.map(loc => <option key={loc} value={loc}>{loc.toUpperCase()}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-zinc-900 border border-white/5 rounded-lg p-1.5 text-[10px] text-zinc-400 outline-none"
            >
              <option value="">Status: All</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Article List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="p-8 text-center text-zinc-600 text-xs italic">
              No articles found.
            </div>
          ) : (
            articles.map(article => (
              <button
                key={article.id}
                onClick={() => openEdit(article)}
                className={`w-full text-left p-3 rounded-xl border transition-all group ${
                  activeArticleId === article.id
                    ? 'bg-violet-600/10 border-violet-500/30 ring-1 ring-violet-500/30'
                    : 'bg-transparent border-transparent hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    article.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {article.status}
                  </span>
                  <span className="text-[10px] text-zinc-600 font-mono">#{article.sortOrder}</span>
                </div>
                <h3 className={`text-xs font-bold leading-tight mb-1 truncate ${
                  activeArticleId === article.id ? 'text-white' : 'text-zinc-300 group-hover:text-white'
                }`}>
                  {article.title}
                </h3>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] text-zinc-500 bg-black/40 px-1 rounded uppercase">{article.locale}</span>
                   <p className="text-[10px] text-zinc-500 truncate">{article.slug}</p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Pagination Mini */}
        <div className="p-3 border-t border-white/5 flex items-center justify-between bg-black/20">
          <button 
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="p-1 text-zinc-500 hover:text-white disabled:opacity-20"
          >
            ←
          </button>
          <span className="text-[10px] text-zinc-500 font-medium">
            {page} / {pagination.totalPages || 1}
          </span>
          <button 
             disabled={page >= pagination.totalPages}
             onClick={() => setPage(p => p + 1)}
             className="p-1 text-zinc-500 hover:text-white disabled:opacity-20"
          >
            →
          </button>
        </div>
      </aside>

      {/* 3rd Column: Editor Area */}
      <main className="flex-1 overflow-y-auto bg-black p-8 custom-scrollbar">
        {renderArticleEditor()}
      </main>
    </div>
  );
}


