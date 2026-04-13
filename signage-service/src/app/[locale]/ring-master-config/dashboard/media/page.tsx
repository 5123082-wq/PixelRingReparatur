'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';

import { adminFetch } from '@/lib/admin-fetch';

type CmsMediaUsageType = 'HERO' | 'ARTICLE' | 'SERVICE' | 'CASE' | 'GENERAL';

type CmsMedia = {
  id: string;
  locale: string | null;
  usageType: string;
  title: string | null;
  alt: string | null;
  filename: string | null;
  mimeType: string | null;
  byteSize: number | null;
  checksumSha256: string | null;
  width: number | null;
  height: number | null;
  url: string | null;
  meta: unknown;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt?: string | null;
};

type RawMedia = Record<string, unknown>;

type MediaFormState = {
  locale: string;
  usageType: CmsMediaUsageType;
  title: string;
  alt: string;
  width: string;
  height: string;
  metaJson: string;
};

type EditFormState = MediaFormState & {
  readonlyUrl: string;
};

const SUPPORTED_LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'] as const;
const USAGE_TYPES: CmsMediaUsageType[] = ['HERO', 'ARTICLE', 'SERVICE', 'CASE', 'GENERAL'];
const EMPTY_META_JSON = '{}';

function getLocale(value: string | string[] | undefined | null, fallback = 'de'): string {
  if (Array.isArray(value)) {
    return value[0] || fallback;
  }

  return value || fallback;
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

function normalizeMediaItem(raw: RawMedia): CmsMedia {
  return {
    id: String(raw.id ?? ''),
    locale: asString(raw.locale),
    usageType: asString(raw.usageType) || asString(raw.usage) || 'GENERAL',
    title: asString(raw.title),
    alt: asString(raw.alt) || asString(raw.altText),
    filename: asString(raw.filename) || asString(raw.originalFilename) || asString(raw.name),
    mimeType: asString(raw.mimeType) || asString(raw.mime),
    byteSize: asNumber(raw.byteSize ?? raw.bytes ?? raw.size),
    checksumSha256: asString(raw.checksumSha256) || asString(raw.checksum),
    width: asNumber(raw.width),
    height: asNumber(raw.height),
    url: asString(raw.url) || asString(raw.publicUrl) || asString(raw.storageUrl),
    meta: raw.metadata ?? raw.meta ?? null,
    createdAt: asString(raw.createdAt),
    updatedAt: asString(raw.updatedAt),
    deletedAt: asString(raw.deletedAt),
  };
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
    .filter((row): row is RawMedia => Boolean(row && typeof row === 'object' && !Array.isArray(row)))
    .map(normalizeMediaItem)
    .filter((item) => item.id);
}

function createEmptyForm(locale: string): MediaFormState {
  return {
    locale,
    usageType: 'GENERAL',
    title: '',
    alt: '',
    width: '',
    height: '',
    metaJson: EMPTY_META_JSON,
  };
}

function mediaToEditForm(media: CmsMedia, fallbackLocale: string): EditFormState {
  return {
    locale: media.locale || fallbackLocale,
    usageType: USAGE_TYPES.includes(media.usageType as CmsMediaUsageType)
      ? (media.usageType as CmsMediaUsageType)
      : 'GENERAL',
    title: media.title || '',
    alt: media.alt || '',
    width: media.width === null ? '' : String(media.width),
    height: media.height === null ? '' : String(media.height),
    readonlyUrl: media.url || '',
    metaJson: JSON.stringify(media.meta && typeof media.meta === 'object' ? media.meta : {}, null, 2),
  };
}

function parseOptionalInteger(value: string): number | null | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
}

function parseMetaJson(value: string): { ok: true; meta: unknown } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(value || EMPTY_META_JSON) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { ok: false, error: 'Meta must be a JSON object.' };
    }

    return { ok: true, meta: parsed };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Meta JSON is invalid.' };
  }
}

function validateForm(form: MediaFormState, file?: File | null): string | null {
  if (!SUPPORTED_LOCALES.includes(form.locale as (typeof SUPPORTED_LOCALES)[number])) {
    return 'Locale is invalid.';
  }

  if (!USAGE_TYPES.includes(form.usageType)) {
    return 'Usage type is invalid.';
  }

  if (file !== undefined && !file) {
    return 'Choose a public CMS media file.';
  }

  if (file && !file.type.startsWith('image/')) {
    return 'MVP media upload accepts public image files only.';
  }

  const width = parseOptionalInteger(form.width);
  const height = parseOptionalInteger(form.height);
  if (width === undefined || height === undefined) {
    return 'Dimensions must be whole numbers when provided.';
  }

  const meta = parseMetaJson(form.metaJson);
  if (!meta.ok) {
    return meta.error;
  }

  return null;
}

function buildJsonPayload(form: EditFormState): Record<string, unknown> {
  const meta = parseMetaJson(form.metaJson);

  return {
    locale: form.locale,
    usageType: form.usageType,
    title: form.title.trim() || null,
    alt: form.alt.trim() || null,
    altText: form.alt.trim() || null,
    width: parseOptionalInteger(form.width) ?? null,
    height: parseOptionalInteger(form.height) ?? null,
    metadata: meta.ok ? meta.meta : {},
  };
}

function buildUploadPayload(form: MediaFormState, file: File): FormData {
  const meta = parseMetaJson(form.metaJson);
  const payload = new FormData();

  payload.set('file', file);
  payload.set('locale', form.locale);
  payload.set('usageType', form.usageType);
  payload.set('title', form.title.trim());
  payload.set('alt', form.alt.trim());
  payload.set('altText', form.alt.trim());
  payload.set('width', String(parseOptionalInteger(form.width) ?? ''));
  payload.set('height', String(parseOptionalInteger(form.height) ?? ''));
  payload.set('metadata', JSON.stringify(meta.ok ? meta.meta : {}));

  return payload;
}

async function readApiError(response: Response): Promise<string> {
  const data = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
  return data?.error || data?.message || `Request failed (${response.status})`;
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

function formatBytes(value: number | null): string {
  if (!value) {
    return '-';
  }

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function shortText(value: string | null | undefined, maxLength = 72): string {
  const text = (value || '').trim().replace(/\s+/g, ' ');
  if (!text) {
    return '-';
  }

  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
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

export default function MediaLibraryPage() {
  const params = useParams();
  const routeLocale = getLocale(params?.locale);

  const [media, setMedia] = useState<CmsMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [refreshVersion, setRefreshVersion] = useState(0);

  const [uploadForm, setUploadForm] = useState<MediaFormState>(() => createEmptyForm(routeLocale));
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);

  const [editingMedia, setEditingMedia] = useState<CmsMedia | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>(() => ({
    ...createEmptyForm(routeLocale),
    readonlyUrl: '',
  }));
  const [editError, setEditError] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  const summary = useMemo(() => {
    const images = media.filter((item) => item.mimeType?.startsWith('image/')).length;
    const localized = media.filter((item) => item.locale).length;
    const totalBytes = media.reduce((sum, item) => sum + (item.byteSize || 0), 0);

    return { total: media.length, images, localized, totalBytes };
  }, [media]);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError('');

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

      setMedia(normalizeMediaResponse(data));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load CMS media.');
      setMedia([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia, refreshVersion]);

  const uploadMedia = useCallback(async () => {
    const validationError = validateForm(uploadForm, uploadFile);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    if (!uploadFile) {
      setUploadError('Choose a public CMS media file.');
      return;
    }

    setUploadError('');
    setNotice('');
    setUploading(true);

    try {
      const response = await adminFetch('/api/cms/media', {
        method: 'POST',
        body: buildUploadPayload(uploadForm, uploadFile),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      setUploadForm(createEmptyForm(routeLocale));
      setUploadFile(null);
      setNotice('Media uploaded to the public CMS library.');
      setRefreshVersion((value) => value + 1);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload media.');
    } finally {
      setUploading(false);
    }
  }, [routeLocale, uploadFile, uploadForm]);

  const openEdit = useCallback((item: CmsMedia) => {
    setEditingMedia(item);
    setEditForm(mediaToEditForm(item, routeLocale));
    setEditError('');
  }, [routeLocale]);

  const closeEdit = useCallback(() => {
    setEditingMedia(null);
    setEditError('');
    setEditSaving(false);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingMedia) {
      return;
    }

    const validationError = validateForm(editForm);
    if (validationError) {
      setEditError(validationError);
      return;
    }

    setEditError('');
    setEditSaving(true);
    setNotice('');

    try {
      const response = await adminFetch(`/api/cms/media/${editingMedia.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildJsonPayload(editForm)),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      closeEdit();
      setNotice('Media metadata updated.');
      setRefreshVersion((value) => value + 1);
    } catch (error) {
      setEditError(error instanceof Error ? error.message : 'Failed to update media.');
    } finally {
      setEditSaving(false);
    }
  }, [closeEdit, editForm, editingMedia]);

  const deleteMedia = useCallback(async (item: CmsMedia) => {
    const confirmed = window.confirm(
      `Delete public CMS media "${item.title || item.filename || item.id}"? The API must block this if the item is still used by CMS content.`
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setNotice('');

    try {
      const response = await adminFetch(`/api/cms/media/${item.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      setNotice('Media deleted from CMS library.');
      setRefreshVersion((value) => value + 1);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete media.');
    }
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Media Library</h1>
          <p style={styles.subtitle}>
            Manage public CMS media for pages and articles. Private customer request attachments stay in the CRM attachment flow.
          </p>
        </div>
      </div>

      <div style={styles.statRow}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Public media</span>
          <span style={styles.statValue}>{summary.total}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Images</span>
          <span style={styles.statValue}>{summary.images}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Localized</span>
          <span style={styles.statValue}>{summary.localized}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Storage</span>
          <span style={styles.statValue}>{formatBytes(summary.totalBytes)}</span>
        </div>
      </div>

      {notice ? <div style={styles.noticeBanner}>{notice}</div> : null}
      {error ? <div style={styles.errorBanner}>{error}</div> : null}

      <section style={styles.panel}>
        <div>
          <h2 style={styles.sectionTitle}>Upload public media</h2>
          <p style={styles.sectionText}>
            The backend validates MIME, size, and checksum. This form only sends CMS media metadata and never touches customer attachments.
          </p>
        </div>

        {uploadError ? <div style={styles.errorBanner}>{uploadError}</div> : null}

        <div style={styles.formGrid}>
          <EditorField label="File" hint="Image file for the public CMS library">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
              style={styles.input}
            />
          </EditorField>
          <EditorField label="Locale">
            <SelectInput
              value={uploadForm.locale}
              onChange={(value) => setUploadForm((current) => ({ ...current, locale: value }))}
            >
              {SUPPORTED_LOCALES.map((locale) => (
                <option key={locale} value={locale}>{locale}</option>
              ))}
            </SelectInput>
          </EditorField>
          <EditorField label="Usage type">
            <SelectInput
              value={uploadForm.usageType}
              onChange={(value) => setUploadForm((current) => ({ ...current, usageType: value as CmsMediaUsageType }))}
            >
              {USAGE_TYPES.map((usageType) => (
                <option key={usageType} value={usageType}>{usageType}</option>
              ))}
            </SelectInput>
          </EditorField>
          <EditorField label="Title">
            <TextInput
              value={uploadForm.title}
              onChange={(value) => setUploadForm((current) => ({ ...current, title: value }))}
              placeholder="Repair photo card"
            />
          </EditorField>
          <EditorField label="Alt text">
            <TextInput
              value={uploadForm.alt}
              onChange={(value) => setUploadForm((current) => ({ ...current, alt: value }))}
              placeholder="Technician repairing illuminated signage"
            />
          </EditorField>
          <EditorField label="Width">
            <TextInput
              type="number"
              value={uploadForm.width}
              onChange={(value) => setUploadForm((current) => ({ ...current, width: value }))}
              placeholder="1200"
            />
          </EditorField>
          <EditorField label="Height">
            <TextInput
              type="number"
              value={uploadForm.height}
              onChange={(value) => setUploadForm((current) => ({ ...current, height: value }))}
              placeholder="800"
            />
          </EditorField>
        </div>

        <EditorField label="Meta JSON">
          <textarea
            value={uploadForm.metaJson}
            onChange={(event) => setUploadForm((current) => ({ ...current, metaJson: event.target.value }))}
            rows={4}
            spellCheck={false}
            style={{ ...styles.textarea, ...styles.codeTextarea }}
          />
        </EditorField>

        <div style={styles.actionRow}>
          <button type="button" onClick={() => void uploadMedia()} disabled={uploading} style={styles.primaryButton}>
            {uploading ? 'Uploading...' : 'Upload media'}
          </button>
        </div>
      </section>

      <section style={styles.panel}>
        <div>
          <h2 style={styles.sectionTitle}>Library</h2>
          <p style={styles.sectionText}>Use these records from article and page editors via the media picker.</p>
        </div>

        {loading ? (
          <div style={styles.emptyState}>Loading media...</div>
        ) : media.length === 0 ? (
          <div style={styles.emptyState}>No public CMS media records found.</div>
        ) : (
          <div style={styles.mediaGrid}>
            {media.map((item) => (
              <article key={item.id} style={styles.mediaCard}>
                <div style={styles.previewBox}>
                  {item.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.alt || item.title || ''} style={styles.previewImage} />
                  ) : (
                    <span style={styles.previewFallback}>No URL</span>
                  )}
                </div>
                <div style={styles.mediaBody}>
                  <div>
                    <h3 style={styles.mediaTitle}>{item.title || item.filename || 'Untitled media'}</h3>
                    <p style={styles.mediaMeta}>{shortText(item.alt, 110)}</p>
                  </div>
                  <div style={styles.chipRow}>
                    <span style={styles.chip}>{item.locale || '-'}</span>
                    <span style={styles.chip}>{item.usageType}</span>
                    <span style={styles.chip}>{item.mimeType || '-'}</span>
                  </div>
                  <div style={styles.detailGrid}>
                    <span>Size: {formatBytes(item.byteSize)}</span>
                    <span>Dimensions: {item.width && item.height ? `${item.width}x${item.height}` : '-'}</span>
                    <span>Updated: {renderDate(item.updatedAt)}</span>
                    <span>Checksum: {shortText(item.checksumSha256, 18)}</span>
                  </div>
                  <div style={styles.actionRow}>
                    <button type="button" onClick={() => openEdit(item)} style={styles.secondaryButton}>Edit</button>
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noreferrer" style={styles.linkButton}>Open</a>
                    ) : null}
                    <button type="button" onClick={() => void deleteMedia(item)} style={styles.dangerButton}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {editingMedia ? (
        <div style={styles.modalOverlay} onClick={closeEdit}>
          <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Edit media metadata</h2>
                <p style={styles.modalSubtitle}>Update public CMS media fields. Delete stays blocked by backend where-used checks.</p>
              </div>
              <button type="button" onClick={closeEdit} style={styles.closeButton}>Close</button>
            </div>

            {editError ? <div style={styles.errorBanner}>{editError}</div> : null}

            <div style={styles.formGrid}>
              <EditorField label="Locale">
                <SelectInput value={editForm.locale} onChange={(value) => setEditForm((current) => ({ ...current, locale: value }))}>
                  {SUPPORTED_LOCALES.map((locale) => (
                    <option key={locale} value={locale}>{locale}</option>
                  ))}
                </SelectInput>
              </EditorField>
              <EditorField label="Usage type">
                <SelectInput value={editForm.usageType} onChange={(value) => setEditForm((current) => ({ ...current, usageType: value as CmsMediaUsageType }))}>
                  {USAGE_TYPES.map((usageType) => (
                    <option key={usageType} value={usageType}>{usageType}</option>
                  ))}
                </SelectInput>
              </EditorField>
              <EditorField label="Title">
                <TextInput value={editForm.title} onChange={(value) => setEditForm((current) => ({ ...current, title: value }))} />
              </EditorField>
              <EditorField label="Alt text">
                <TextInput value={editForm.alt} onChange={(value) => setEditForm((current) => ({ ...current, alt: value }))} />
              </EditorField>
              <EditorField label="Public URL">
                <input value={editForm.readonlyUrl} readOnly style={styles.inputReadOnly} />
              </EditorField>
              <EditorField label="Width">
                <TextInput type="number" value={editForm.width} onChange={(value) => setEditForm((current) => ({ ...current, width: value }))} />
              </EditorField>
              <EditorField label="Height">
                <TextInput type="number" value={editForm.height} onChange={(value) => setEditForm((current) => ({ ...current, height: value }))} />
              </EditorField>
            </div>

            <EditorField label="Meta JSON">
              <textarea
                value={editForm.metaJson}
                onChange={(event) => setEditForm((current) => ({ ...current, metaJson: event.target.value }))}
                rows={5}
                spellCheck={false}
                style={{ ...styles.textarea, ...styles.codeTextarea }}
              />
            </EditorField>

            <div style={styles.modalFooter}>
              <button type="button" onClick={closeEdit} style={styles.secondaryButton}>Cancel</button>
              <button type="button" onClick={() => void saveEdit()} disabled={editSaving} style={styles.primaryButton}>
                {editSaving ? 'Saving...' : 'Save metadata'}
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
    maxWidth: '780px',
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
  panel: {
    border: '1px solid #222',
    borderRadius: '12px',
    background: '#111',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionTitle: {
    margin: 0,
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
  },
  sectionText: {
    margin: '6px 0 0',
    color: '#8b8b8b',
    fontSize: '13px',
    lineHeight: 1.6,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
  inputReadOnly: {
    width: '100%',
    background: '#0c0c0c',
    border: '1px solid #2b2b2b',
    color: '#9ca3af',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '13px',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
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
  },
  mediaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '12px',
  },
  mediaCard: {
    border: '1px solid #242424',
    borderRadius: '10px',
    background: '#0b0b0b',
    overflow: 'hidden',
  },
  previewBox: {
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #111 0%, #1f2937 100%)',
    borderBottom: '1px solid #222',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  previewFallback: {
    color: '#8b8b8b',
    fontSize: '13px',
  },
  mediaBody: {
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mediaTitle: {
    margin: 0,
    color: '#fff',
    fontSize: '15px',
    fontWeight: 700,
    lineHeight: 1.4,
  },
  mediaMeta: {
    margin: '4px 0 0',
    color: '#8b8b8b',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  chipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '22px',
    padding: '2px 8px',
    borderRadius: '999px',
    border: '1px solid #333',
    color: '#d4d4d8',
    background: '#161616',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.02em',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '6px 12px',
    color: '#a3a3a3',
    fontSize: '12px',
    lineHeight: 1.5,
  },
  actionRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
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
  linkButton: {
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#171717',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 700,
    textDecoration: 'none',
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
  errorBanner: {
    padding: '12px 14px',
    border: '1px solid #5b1f1f',
    borderRadius: '8px',
    background: '#2a1111',
    color: '#fca5a5',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  noticeBanner: {
    padding: '12px 14px',
    border: '1px solid #14532d',
    borderRadius: '8px',
    background: '#0f241b',
    color: '#86efac',
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
    width: 'min(920px, 100%)',
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
    maxWidth: '720px',
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
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    flexWrap: 'wrap',
  },
};
