'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

import { adminFetch } from '@/lib/admin-fetch';

type SeoConfigKey =
  | 'support_index_title'
  | 'support_index_description'
  | 'support_index_canonical_url'
  | 'support_article_title_template'
  | 'support_article_description_fallback'
  | 'support_article_canonical_base_url';

type SeoConfig = Record<SeoConfigKey, string>;

type SeoAuditItem = {
  id: string;
  locale: string;
  slug: string;
  title: string;
  missing: string[];
  duplicateSlug: boolean;
  canonicalIssue: string | null;
};

type SeoAudit = {
  summary: {
    totalPublished: number;
    seoReady: number;
    withIssues: number;
  };
  items: SeoAuditItem[];
};

type SeoResponse = {
  config?: Partial<SeoConfig>;
  audit?: SeoAudit;
};

type FieldMeta = {
  key: SeoConfigKey;
  label: string;
  description: string;
  placeholder: string;
  multiline?: boolean;
};

const CONFIG_FIELDS: FieldMeta[] = [
  {
    key: 'support_index_title',
    label: 'Support index title',
    description: 'Used as the SEO title for the support landing page.',
    placeholder: 'Repair support center',
  },
  {
    key: 'support_index_description',
    label: 'Support index description',
    description: 'Used as the meta description for the support landing page.',
    placeholder: 'Find help articles and practical repair guidance.',
    multiline: true,
  },
  {
    key: 'support_index_canonical_url',
    label: 'Support index canonical URL',
    description: 'Absolute or locale-relative canonical URL for the support landing page.',
    placeholder: 'https://example.com/de/support',
  },
  {
    key: 'support_article_title_template',
    label: 'Support article title template',
    description: 'Template applied to article SEO titles when the article is missing its own title.',
    placeholder: '{title} | Repair support',
  },
  {
    key: 'support_article_description_fallback',
    label: 'Support article description fallback',
    description: 'Fallback description used when article SEO description is empty.',
    placeholder: 'Short support summary for search engines and previews.',
    multiline: true,
  },
  {
    key: 'support_article_canonical_base_url',
    label: 'Support article canonical base URL',
    description: 'Base URL used to build canonical article URLs when an article canonical is missing.',
    placeholder: 'https://example.com',
  },
];

const EMPTY_CONFIG: SeoConfig = CONFIG_FIELDS.reduce((acc, field) => {
  acc[field.key] = '';
  return acc;
}, {} as SeoConfig);

function normalizeConfig(config?: Partial<SeoConfig>): SeoConfig {
  return CONFIG_FIELDS.reduce((acc, field) => {
    const value = config?.[field.key];
    acc[field.key] = typeof value === 'string' ? value : '';
    return acc;
  }, { ...EMPTY_CONFIG });
}

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

function truncate(value: string, maxLength = 110): string {
  const text = value.trim().replace(/\s+/g, ' ');
  if (!text) {
    return '—';
  }

  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

function joinIssues(values: string[]): string {
  if (values.length === 0) {
    return '—';
  }

  return values.join(', ');
}

function SeoField({
  field,
  value,
  onChange,
}: {
  field: FieldMeta;
  value: string;
  onChange: (value: string) => void;
}) {
  const commonInputStyle: CSSProperties = {
    width: '100%',
    borderRadius: '12px',
    border: '1px solid #2a2a2a',
    background: '#0f0f0f',
    color: '#fff',
    padding: '12px 14px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <label style={styles.fieldCard}>
      <div style={styles.fieldHeader}>
        <div>
          <div style={styles.fieldLabel}>{field.label}</div>
          <div style={styles.fieldDescription}>{field.description}</div>
        </div>
        <div style={styles.fieldKey}>{field.key}</div>
      </div>

      {field.multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          rows={4}
          style={{ ...commonInputStyle, resize: 'vertical', minHeight: '108px' }}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          style={commonInputStyle}
        />
      )}
    </label>
  );
}

export default function SeoPage() {
  const [config, setConfig] = useState<SeoConfig>(EMPTY_CONFIG);
  const [audit, setAudit] = useState<SeoAudit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const auditItems = audit?.items ?? [];
  const hasAuditItems = auditItems.length > 0;

  const summaryCards = useMemo(
    () => [
      {
        label: 'Published articles',
        value: audit ? formatCount(audit.summary.totalPublished) : '—',
        tone: 'neutral' as const,
      },
      {
        label: 'SEO ready',
        value: audit ? formatCount(audit.summary.seoReady) : '—',
        tone: 'good' as const,
      },
      {
        label: 'With issues',
        value: audit ? formatCount(audit.summary.withIssues) : '—',
        tone: 'warn' as const,
      },
    ],
    [audit]
  );

  const loadSeoState = useCallback(async (options?: { preserveSaveState?: boolean }) => {
    setIsLoading(true);
    setLoadError(null);
    if (!options?.preserveSaveState) {
      setSaveState(null);
    }

    try {
      const response = await fetch('/api/cms/seo', {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
      });

      const data = (await response.json().catch(() => ({}))) as SeoResponse & { error?: string };

      if (!response.ok) {
        const message =
          response.status === 404
            ? 'SEO config is unavailable or access is restricted.'
            : data.error || `Failed to load SEO config (${response.status}).`;
        throw new Error(message);
      }

      setConfig(normalizeConfig(data.config));
      setAudit(data.audit ?? null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load SEO config.';
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSeoState();
  }, [loadSeoState]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveState(null);

    try {
      const payload = CONFIG_FIELDS.reduce((acc, field) => {
        acc[field.key] = config[field.key].trim();
        return acc;
      }, {} as SeoConfig);

      const response = await adminFetch('/api/cms/seo', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as { success?: boolean; error?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to save SEO config (${response.status}).`);
      }

      setSaveState({ type: 'success', message: 'SEO config saved successfully.' });
      await loadSeoState({ preserveSaveState: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save SEO config.';
      setSaveState({ type: 'error', message });
    } finally {
      setIsSaving(false);
    }
  }, [config, loadSeoState]);

  return (
    <div>
      <div style={styles.header}>
        <div style={styles.headerTopRow}>
          <div>
            <div style={styles.kicker}>SEO / GEO</div>
            <h1 style={styles.title}>SEO & GEO Strategy</h1>
            <p style={styles.subtitle}>
              Configure the support SEO defaults and review article-level audit issues before publishing.
            </p>
          </div>

          <div style={styles.headerStatusCard}>
            <div style={styles.headerStatusLabel}>Endpoint</div>
            <div style={styles.headerStatusValue}>/api/cms/seo</div>
            <div style={styles.headerStatusHint}>GET loads config and audit, POST persists whitelist keys.</div>
          </div>
        </div>
      </div>

      {loadError ? (
        <div style={styles.alertError} role="alert">
          <div style={styles.alertTitle}>Load error</div>
          <div style={styles.alertBody}>{loadError}</div>
          <button type="button" onClick={() => loadSeoState()} style={styles.secondaryButton}>
            Retry loading
          </button>
        </div>
      ) : null}

      {saveState ? (
        <div
          style={saveState.type === 'success' ? styles.alertSuccess : styles.alertError}
          role="status"
          aria-live="polite"
        >
          <div style={styles.alertTitle}>{saveState.type === 'success' ? 'Saved' : 'Save error'}</div>
          <div style={styles.alertBody}>{saveState.message}</div>
        </div>
      ) : null}

      <div style={styles.summaryGrid}>
        {summaryCards.map((card) => (
          <div
            key={card.label}
            style={{
              ...styles.summaryCard,
              ...(card.tone === 'good'
                ? styles.summaryCardGood
                : card.tone === 'warn'
                  ? styles.summaryCardWarn
                  : styles.summaryCardNeutral),
            }}
          >
            <div style={styles.summaryLabel}>{card.label}</div>
            <div style={styles.summaryValue}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={styles.grid}>
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>SEO config</h2>
              <p style={styles.panelSubtitle}>Edit the support SEO defaults returned by the API.</p>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading || isSaving}
              style={{
                ...styles.primaryButton,
                ...(isLoading || isSaving ? styles.primaryButtonDisabled : {}),
              }}
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
          </div>

          <div style={styles.fieldsGrid}>
            {CONFIG_FIELDS.map((field) => (
              <SeoField
                key={field.key}
                field={field}
                value={config[field.key]}
                onChange={(value) => setConfig((current) => ({ ...current, [field.key]: value }))}
              />
            ))}
          </div>

          <div style={styles.footerNote}>
            Only the six whitelisted support SEO keys are submitted back to the server.
          </div>
        </section>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>SEO audit</h2>
              <p style={styles.panelSubtitle}>
                Problematic published articles are listed with missing fields and canonical issues.
              </p>
            </div>
            <button
              type="button"
              onClick={() => loadSeoState()}
              disabled={isLoading}
              style={{
                ...styles.secondaryButton,
                ...(isLoading ? styles.secondaryButtonDisabled : {}),
              }}
            >
              {isLoading ? 'Loading...' : 'Refresh audit'}
            </button>
          </div>

          {isLoading ? (
            <div style={styles.loadingState}>Loading SEO dashboard...</div>
          ) : hasAuditItems ? (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Article</th>
                    <th style={styles.th}>Missing</th>
                    <th style={styles.th}>Duplicate</th>
                    <th style={styles.th}>Canonical issue</th>
                  </tr>
                </thead>
                <tbody>
                  {auditItems.map((item) => (
                    <tr key={item.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.articleTitle}>{item.title}</div>
                        <div style={styles.articleMeta}>
                          {item.locale} / {item.slug}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.issuePill}>{joinIssues(item.missing)}</span>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusPill,
                            ...(item.duplicateSlug ? styles.statusPillWarn : styles.statusPillGood),
                          }}
                        >
                          {item.duplicateSlug ? 'Duplicate slug' : 'No'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.canonicalIssue}>
                          {item.canonicalIssue ? truncate(item.canonicalIssue, 140) : '—'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateTitle}>No SEO audit issues</div>
              <div style={styles.emptyStateBody}>
                Published articles are currently SEO ready, and no canonical or duplicate-slug issues were detected.
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  header: {
    marginBottom: '28px',
  },
  headerTopRow: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  kicker: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    marginBottom: '12px',
    borderRadius: '999px',
    border: '1px solid #2c2c2c',
    background: '#111',
    color: '#c7c7c7',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  title: {
    margin: 0,
    fontSize: '32px',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.03em',
  },
  subtitle: {
    margin: '8px 0 0',
    fontSize: '15px',
    color: '#8c8c8c',
    lineHeight: 1.6,
    maxWidth: '820px',
  },
  headerStatusCard: {
    minWidth: '280px',
    borderRadius: '16px',
    border: '1px solid #242424',
    background: 'linear-gradient(180deg, #141414 0%, #101010 100%)',
    padding: '16px 18px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
  },
  headerStatusLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#7d7d7d',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  headerStatusValue: {
    marginTop: '8px',
    fontSize: '18px',
    fontWeight: 700,
    color: '#fff',
  },
  headerStatusHint: {
    marginTop: '8px',
    fontSize: '13px',
    color: '#9a9a9a',
    lineHeight: 1.55,
  },
  alertError: {
    border: '1px solid rgba(239, 68, 68, 0.35)',
    background: 'rgba(127, 29, 29, 0.24)',
    color: '#ffd4d4',
    borderRadius: '16px',
    padding: '16px 18px',
    marginBottom: '18px',
  },
  alertSuccess: {
    border: '1px solid rgba(34, 197, 94, 0.28)',
    background: 'rgba(6, 78, 59, 0.28)',
    color: '#d6ffe7',
    borderRadius: '16px',
    padding: '16px 18px',
    marginBottom: '18px',
  },
  alertTitle: {
    fontSize: '14px',
    fontWeight: 700,
    marginBottom: '4px',
  },
  alertBody: {
    fontSize: '13px',
    lineHeight: 1.55,
    color: 'inherit',
    marginBottom: '12px',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
    marginBottom: '18px',
  },
  summaryCard: {
    borderRadius: '16px',
    padding: '18px',
    border: '1px solid #242424',
    background: '#141414',
  },
  summaryCardNeutral: {
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
  },
  summaryCardGood: {
    borderColor: 'rgba(34, 197, 94, 0.25)',
    background: 'linear-gradient(180deg, rgba(22, 33, 24, 0.9), #141414)',
  },
  summaryCardWarn: {
    borderColor: 'rgba(245, 158, 11, 0.28)',
    background: 'linear-gradient(180deg, rgba(40, 29, 14, 0.95), #141414)',
  },
  summaryLabel: {
    fontSize: '12px',
    color: '#9b9b9b',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '10px',
  },
  summaryValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.03em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
    gap: '18px',
    alignItems: 'start',
  },
  panel: {
    borderRadius: '20px',
    border: '1px solid #232323',
    background: 'linear-gradient(180deg, #141414 0%, #111 100%)',
    padding: '20px',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '18px',
    flexWrap: 'wrap',
  },
  panelTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 700,
    color: '#fff',
  },
  panelSubtitle: {
    margin: '6px 0 0',
    fontSize: '13px',
    color: '#8c8c8c',
    lineHeight: 1.55,
  },
  fieldsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '14px',
  },
  fieldCard: {
    display: 'grid',
    gap: '10px',
    padding: '14px',
    borderRadius: '16px',
    border: '1px solid #242424',
    background: '#101010',
  },
  fieldHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
  },
  fieldLabel: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 700,
    marginBottom: '4px',
  },
  fieldDescription: {
    color: '#919191',
    fontSize: '12px',
    lineHeight: 1.5,
  },
  fieldKey: {
    padding: '4px 8px',
    borderRadius: '999px',
    background: '#181818',
    border: '1px solid #262626',
    color: '#a9a9a9',
    fontSize: '11px',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    whiteSpace: 'nowrap',
  },
  footerNote: {
    marginTop: '14px',
    fontSize: '12px',
    color: '#808080',
    lineHeight: 1.55,
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #3d3d3d',
    background: 'linear-gradient(180deg, #f4f4f4 0%, #d9d9d9 100%)',
    color: '#111',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #2d2d2d',
    background: '#161616',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  secondaryButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  loadingState: {
    minHeight: '160px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    border: '1px dashed #2a2a2a',
    color: '#9a9a9a',
    background: '#0f0f0f',
    fontSize: '14px',
  },
  tableWrap: {
    overflowX: 'auto',
    borderRadius: '16px',
    border: '1px solid #232323',
    background: '#0f0f0f',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '620px',
  },
  th: {
    textAlign: 'left',
    fontSize: '12px',
    color: '#9a9a9a',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    padding: '14px 16px',
    borderBottom: '1px solid #232323',
    background: '#111',
  },
  tr: {
    borderBottom: '1px solid #1f1f1f',
  },
  td: {
    verticalAlign: 'top',
    padding: '14px 16px',
    fontSize: '13px',
    color: '#d1d1d1',
  },
  articleTitle: {
    color: '#fff',
    fontWeight: 700,
    marginBottom: '4px',
  },
  articleMeta: {
    color: '#8d8d8d',
    fontSize: '12px',
  },
  issuePill: {
    display: 'inline-flex',
    alignItems: 'center',
    maxWidth: '100%',
    padding: '6px 10px',
    borderRadius: '999px',
    border: '1px solid rgba(245, 158, 11, 0.26)',
    background: 'rgba(120, 53, 15, 0.28)',
    color: '#ffd6a0',
    fontSize: '12px',
    lineHeight: 1.4,
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
  },
  statusPillGood: {
    border: '1px solid rgba(34, 197, 94, 0.24)',
    background: 'rgba(22, 101, 52, 0.28)',
    color: '#b9f7cd',
  },
  statusPillWarn: {
    border: '1px solid rgba(245, 158, 11, 0.24)',
    background: 'rgba(120, 53, 15, 0.28)',
    color: '#ffd6a0',
  },
  canonicalIssue: {
    color: '#d0d0d0',
    lineHeight: 1.55,
  },
  emptyState: {
    padding: '28px 18px',
    borderRadius: '16px',
    border: '1px dashed #2a2a2a',
    background: '#0f0f0f',
  },
  emptyStateTitle: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '6px',
  },
  emptyStateBody: {
    color: '#9b9b9b',
    fontSize: '13px',
    lineHeight: 1.6,
  },
};
