'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { adminFetch } from '@/lib/admin-fetch';

type CmsMediaUsageType =
  | 'GENERAL'
  | 'HERO'
  | 'ARTICLE'
  | 'SERVICE'
  | 'CASE'
  | 'PAGE'
  | 'CARD'
  | 'SEO'
  | 'ICON';

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
  publicUrl: string | null;
  fallbackUrl: string | null;
  storageProvider: string | null;
  storageKey: string | null;
  meta: unknown;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt?: string | null;
};

type RawMedia = Record<string, unknown>;

type MediaFormState = {
  usageType: CmsMediaUsageType;
  title: string;
  alt: string;
  width: string;
  height: string;
  metaJson: string;
};

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(objectUrl);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    
    img.src = objectUrl;
  });
}

type EditFormState = MediaFormState;

const USAGE_TYPES: CmsMediaUsageType[] = [
  'GENERAL',
  'HERO',
  'ARTICLE',
  'SERVICE',
  'CASE',
  'PAGE',
  'CARD',
  'SEO',
  'ICON',
];
const EMPTY_META_JSON = '{}';

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
    publicUrl: asString(raw.publicUrl) || asString(raw.url) || asString(raw.storageUrl),
    fallbackUrl: asString(raw.fallbackUrl),
    storageProvider: asString(raw.storageProvider),
    storageKey: asString(raw.storageKey),
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

function createEmptyForm(): MediaFormState {
  return {
    usageType: 'GENERAL',
    title: '',
    alt: '',
    width: '',
    height: '',
    metaJson: EMPTY_META_JSON,
  };
}

function mediaToEditForm(media: CmsMedia): EditFormState {
  return {
    usageType: USAGE_TYPES.includes(media.usageType as CmsMediaUsageType)
      ? (media.usageType as CmsMediaUsageType)
      : 'GENERAL',
    title: media.title || '',
    alt: media.alt || '',
    width: media.width === null ? '' : String(media.width),
    height: media.height === null ? '' : String(media.height),
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
    usageType: form.usageType,
    title: form.title.trim() || null,
    alt: form.alt.trim() || null,
    width: parseOptionalInteger(form.width) ?? null,
    height: parseOptionalInteger(form.height) ?? null,
    metadata: meta.ok ? meta.meta : {},
  };
}

function buildUploadPayload(form: MediaFormState, file: File): FormData {
  const meta = parseMetaJson(form.metaJson);
  const payload = new FormData();

  payload.set('file', file);
  payload.set('usageType', form.usageType);
  payload.set('title', form.title.trim());
  payload.set('alt', form.alt.trim());
  payload.set('width', String(parseOptionalInteger(form.width) ?? ''));
  payload.set('height', String(parseOptionalInteger(form.height) ?? ''));
  payload.set('metadata', JSON.stringify(meta.ok ? meta.meta : {}));

  return payload;
}

async function readApiError(response: Response): Promise<string> {
  const data = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
  return data?.error || data?.message || `Request failed (${response.status})`;
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

function getStorageBadge(item: CmsMedia): { label: string; className: string } {
  if (item.storageProvider === 'VERCEL_BLOB') {
    return {
      label: item.fallbackUrl ? 'Blob + local fallback' : 'Blob',
      className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    };
  }

  if (item.fallbackUrl) {
    return {
      label: 'Local fallback',
      className: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    };
  }

  return {
    label: 'Local only',
    className: 'border-zinc-500/20 bg-zinc-500/10 text-zinc-300',
  };
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<CmsMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [refreshVersion, setRefreshVersion] = useState(0);

  const [uploadForm, setUploadForm] = useState<MediaFormState>(() => createEmptyForm());
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [editingMedia, setEditingMedia] = useState<CmsMedia | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>(() => createEmptyForm());
  const [editError, setEditError] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const summary = useMemo(() => {
    const images = media.filter((item) => item.mimeType?.startsWith('image/')).length;
    const totalBytes = media.reduce((sum, item) => sum + (item.byteSize || 0), 0);
    const usageTypes = new Set(media.map((item) => item.usageType).filter(Boolean)).size;

    return { total: media.length, images, usageTypes, totalBytes };
  }, [media]);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await adminFetch('/api/cms/media', {
        method: 'GET',
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

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setUploadFile(file);
    if (file && file.type.startsWith('image/')) {
      try {
        const { width, height } = await getImageDimensions(file);
        setUploadForm((prev) => ({
          ...prev,
          width: String(width),
          height: String(height),
          title: prev.title || file.name.split('.')[0] || '',
        }));
      } catch (err) {
        console.error('Failed to get dimensions:', err);
      }
    }
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(text);
      setNotice('URL copied to clipboard!');
      setTimeout(() => setNotice(''), 3000);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setNotice('URL copied!');
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textarea);
      setTimeout(() => setNotice(''), 3000);
    }
  }, []);

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
        const data = await response.json();
        const debugId = data.debugId ? ` (ID: ${data.debugId})` : '';
        setUploadError(data.error || t('failedToUploadMedia') + debugId);
        console.error('Upload error:', data);
      } else {
        setUploadForm(createEmptyForm());
        setUploadFile(null);
        setNotice('Media uploaded to the global CMS library.');
        setShowUploadModal(false);
        setRefreshVersion((value) => value + 1);
      }
    } catch (err) {
      setUploadError(t('failedToUploadMedia'));
      console.error('Upload request failed:', err);
    } finally {
      setUploading(false);
    }
  }, [uploadFile, uploadForm]);

  const openEdit = useCallback((item: CmsMedia) => {
    setEditingMedia(item);
    setEditForm(mediaToEditForm(item));
    setEditError('');
  }, []);

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
      `⚠️ Delete public CMS media "${item.title || item.filename || item.id}"?\n\n` +
      `Usage: ${item.usageType}\n` +
      `This action cannot be undone. The API will block deletion if the asset is still in use.`
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setNotice('');
    setDeletingId(item.id);

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
    } finally {
      setDeletingId(null);
    }
  }, []);

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-white tracking-tight">Media Library</h1>
          <p className="text-sm text-zinc-500 font-medium">
            Shared assets for Page CMS, content, and branding.
          </p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-cyan-500/20 flex items-center gap-3"
        >
          <span className="text-xl">+</span>
          Upload New Asset
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Files', value: summary.total },
          { label: 'Images', value: summary.images },
          { label: 'Usage Types', value: summary.usageTypes },
          { label: 'Storage', value: formatBytes(summary.totalBytes) },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 shadow-inner">
            <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest">{s.label}</span>
            <span className="block text-2xl font-black text-white mt-1">{s.value}</span>
          </div>
        ))}
      </div>

      {notice && (
        <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-6 py-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300">
          ✨ {notice}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-sm font-bold">
          🚫 {error}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80 animate-in fade-in duration-300">
          <div className="bg-[#0a0a0c] border border-white/10 rounded-[40px] w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h2 className="text-2xl font-black text-white">Upload Media</h2>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Add asset to global CMS pool</p>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-10 overflow-y-auto space-y-10">
              {uploadError && (
                <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs font-bold text-red-500">
                  🚫 {uploadError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Source File</label>
                  <div className="relative group h-64 rounded-[2.5rem] border-2 border-dashed border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/[0.02] transition-all flex flex-col items-center justify-center gap-4 overflow-hidden bg-black/40">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    {uploadFile ? (
                      <div className="text-center p-6">
                        <div className="text-4xl mb-3">🖼️</div>
                        <div className="text-xs font-black text-white truncate max-w-[200px]">{uploadFile.name}</div>
                        <div className="text-[10px] text-zinc-500 mt-2 font-bold uppercase">{(uploadFile.size / 1024).toFixed(0)} KB</div>
                        <button className="mt-4 text-[9px] font-black text-cyan-400 uppercase tracking-widest hover:text-white underline decoration-cyan-500/30">Change File</button>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-cyan-400 transition-all group-hover:scale-110">
                          <span className="text-2xl">＋</span>
                        </div>
                        <div className="text-center">
                          <div className="text-[11px] font-black text-white uppercase tracking-widest">Drop Image Here</div>
                          <div className="text-[9px] text-zinc-600 mt-1 font-bold uppercase">PNG, JPG, WEBP, SVG</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Usage Category</label>
                    <select 
                      value={uploadForm.usageType}
                      onChange={(e) => setUploadForm(p => ({ ...p, usageType: e.target.value as CmsMediaUsageType }))}
                      className="w-full h-14 bg-black border border-white/10 rounded-2xl px-5 text-sm text-zinc-200 focus:border-cyan-500/50 outline-none transition-all appearance-none"
                    >
                      {USAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">SEO Title</label>
                    <input
                      placeholder="e.g. Neon Repair Process"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm(p => ({ ...p, title: e.target.value }))}
                      className="w-full h-14 bg-black border border-white/10 rounded-2xl px-5 text-sm text-zinc-200 focus:border-cyan-500/50 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Alt Text</label>
                    <input
                      placeholder="e.g. Master fixing a neon tube"
                      value={uploadForm.alt}
                      onChange={(e) => setUploadForm(p => ({ ...p, alt: e.target.value }))}
                      className="w-full h-14 bg-black border border-white/10 rounded-2xl px-5 text-sm text-zinc-200 focus:border-cyan-500/50 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Resolution</span>
                  <span className="text-xs font-bold text-zinc-400 mt-1">{uploadForm.width && uploadForm.height ? `${uploadForm.width} × ${uploadForm.height}` : 'Automatic'}</span>
                </div>
              </div>
              <button 
                onClick={() => void uploadMedia()} 
                disabled={uploading || !uploadFile}
                className="h-14 px-12 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-20 disabled:hover:bg-cyan-500 text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-cyan-500/20"
              >
                {uploading ? 'Processing...' : 'Start Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIBRARY GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white">Asset Gallery</h2>
            <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider mt-1">Available for Page CMS and article content</p>
          </div>
          <button 
            onClick={() => void loadMedia()} 
            className="w-10 h-10 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center hover:bg-white/5 transition-all"
          >
            🔄
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square rounded-3xl bg-white/[0.02] animate-pulse" />)}
          </div>
        ) : media.length === 0 ? (
          <div className="py-20 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-3xl">
             <div className="text-4xl mb-4 opacity-20">🖼️</div>
             <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest">Your library is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {media.map((item) => {
              const storageBadge = getStorageBadge(item);

              return (
              <div key={item.id} className="group relative bg-[#08080a] border border-white/[0.06] rounded-3xl overflow-hidden hover:border-white/20 transition-all">
                <div className="aspect-[4/3] bg-black flex items-center justify-center relative overflow-hidden">
                  {item.url ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.url} 
                        alt={item.alt || ''} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            const span = document.createElement('span');
                            span.className = 'flex h-full w-full items-center justify-center px-1 text-[8px] font-black uppercase text-red-500/40 bg-red-500/5';
                            span.innerText = 'Broken Link';
                            parent.appendChild(span);
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                          onClick={() => copyToClipboard(item.url || '')}
                          className="w-10 h-10 rounded-xl bg-white text-black text-sm flex items-center justify-center hover:scale-110 transition-all shadow-xl"
                          title="Copy Link"
                        >
                          🔗
                        </button>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md text-white text-sm flex items-center justify-center hover:scale-110 transition-all"
                          title="View Original"
                        >
                          ↗
                        </a>
                      </div>
                    </>
                  ) : (
                    <span className="text-[10px] font-black text-zinc-800 uppercase">Invalid URL</span>
                  )}
                  {/* Badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                     <span className="text-[8px] font-black text-white uppercase tracking-widest">{item.usageType}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-[11px] font-black text-white truncate uppercase tracking-wider">{item.title || item.filename}</h3>
                  <div className={`mt-2 inline-flex rounded-full border px-2 py-1 text-[8px] font-black uppercase tracking-widest ${storageBadge.className}`}>
                    {storageBadge.label}
                  </div>
                  <div className="mt-3 space-y-2">
                    <div>
                      <div className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Primary URL</div>
                      <div className="mt-1 truncate text-[10px] font-mono text-zinc-500" title={item.publicUrl || item.url || ''}>
                        {item.publicUrl || item.url || '-'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Fallback URL</div>
                      <div className="mt-1 truncate text-[10px] font-mono text-zinc-500" title={item.fallbackUrl || ''}>
                        {item.fallbackUrl || '-'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[9px] font-bold text-zinc-600 uppercase">
                    <span>{item.width && item.height ? `${item.width}x${item.height}` : 'Dimensions -'}</span>
                    <span>{formatBytes(item.byteSize)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-white/[0.04]">
                    <button
                      onClick={() => openEdit(item)}
                      className="text-[10px] text-zinc-500 hover:text-cyan-400 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => item.url && copyToClipboard(item.url)}
                      disabled={!item.url}
                      className="text-[10px] text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
                    >
                      Copy URL
                    </button>
                    {item.fallbackUrl ? (
                      <button
                        onClick={() => item.fallbackUrl && copyToClipboard(item.fallbackUrl)}
                        className="text-[10px] text-zinc-500 hover:text-amber-300 transition-colors"
                      >
                        Copy fallback
                      </button>
                    ) : null}
                    <button 
                      onClick={() => void deleteMedia(item)}
                      disabled={deletingId === item.id}
                      className="text-[10px] text-zinc-700 hover:text-red-500 disabled:opacity-30 transition-colors"
                    >
                      {deletingId === item.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </section>

      {/* EDIT MODAL - Simplified */}
      {editingMedia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/60 animate-in fade-in duration-300">
          <div className="bg-[#0a0a0c] border border-white/10 rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <div>
                 <h2 className="text-xl font-black text-white">Edit Asset Info</h2>
                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">ID: {editingMedia.id}</p>
               </div>
               <button onClick={closeEdit} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">✕</button>
            </div>

            <div className="p-8 space-y-6">
              {editError ? (
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-xs font-bold text-red-500">
                  {editError}
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Usage</label>
                <select
                  value={editForm.usageType}
                  onChange={(e) => setEditForm(p => ({ ...p, usageType: e.target.value as CmsMediaUsageType }))}
                  className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-sm text-zinc-200 focus:border-violet-500/50 outline-none transition-all appearance-none"
                >
                  {USAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Title</label>
                <input 
                  value={editForm.title}
                  onChange={(e) => setEditForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-sm text-zinc-200 focus:border-violet-500/50 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Alt Text</label>
                <input 
                  value={editForm.alt}
                  onChange={(e) => setEditForm(p => ({ ...p, alt: e.target.value }))}
                  className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-sm text-zinc-200 focus:border-violet-500/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Meta JSON</label>
                <textarea
                  value={editForm.metaJson}
                  onChange={(e) => setEditForm(p => ({ ...p, metaJson: e.target.value }))}
                  rows={4}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:border-violet-500/50 outline-none font-mono transition-all"
                />
                {editForm.metaJson !== EMPTY_META_JSON && (
                  <p className="text-[9px] text-amber-400/60 px-1">⚠️ Custom meta detected — edit with care</p>
                )}
              </div>
            </div>

            <div className="p-8 bg-white/[0.01] border-t border-white/5 flex gap-3">
               <button onClick={closeEdit} className="h-12 flex-1 border border-white/10 hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all">Cancel</button>
               <button 
                 onClick={() => void saveEdit()}
                 disabled={editSaving}
                 className="h-12 flex-1 bg-violet-600 hover:bg-violet-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all"
               >
                 {editSaving ? 'Saving...' : 'Update Metadata'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
