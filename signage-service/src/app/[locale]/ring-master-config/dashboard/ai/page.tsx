'use client';

import { useState, useEffect } from 'react';

import { adminFetch } from '@/lib/admin-fetch';

type AiRuntimeStatus = {
  rawProvider: string;
  supportedProvider: boolean;
  apiKeyConfigured: boolean;
  apiKeySource: string | null;
  model: string;
  temperature: number;
  maxContextMessages: number;
  maxOutputTokens: number;
  timeoutMs: number;
  cmsSystemPrompt: string | null;
  issues: string[];
};

type KnowledgeBaseDocument = {
  filename: string;
  title: string;
  content: string;
  characterCount: number;
};

export default function AiConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [temperature, setTemperature] = useState(0.2);
  const [runtime, setRuntime] = useState<AiRuntimeStatus | null>(null);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeBaseDocument[]>([]);
  const [selectedKnowledgeFilename, setSelectedKnowledgeFilename] = useState<string | null>(null);
  const [knowledgeError, setKnowledgeError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [res, knowledgeRes] = await Promise.all([
          fetch('/api/cms/ai'),
          fetch('/api/cms/knowledge-base'),
        ]);

        if (res.ok) {
          const data = await res.json();
          setSystemPrompt(data.systemPrompt || '');
          setModel(data.model || 'gpt-4o-mini');
          setTemperature(data.temperature ?? 0.2);
          setRuntime(data.runtime ?? null);
        }

        if (knowledgeRes.ok) {
          const data = await knowledgeRes.json();
          const documents = Array.isArray(data.documents)
            ? data.documents as KnowledgeBaseDocument[]
            : [];
          setKnowledgeDocs(documents);
          setSelectedKnowledgeFilename(documents[0]?.filename ?? null);
        } else {
          setKnowledgeError('Knowledge base files could not be loaded.');
        }
      } catch (error) {
        console.error('Failed to load AI config', error);
        setKnowledgeError('Knowledge base files could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await adminFetch('/api/cms/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt, model, temperature }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'AI Configuration saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save configuration.' });
      }
    } catch (error) {
      console.error('Failed to save AI config', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  }

  const selectedKnowledgeDoc =
    knowledgeDocs.find((doc) => doc.filename === selectedKnowledgeFilename) ??
    knowledgeDocs[0] ??
    null;

  if (loading) {
    return <div style={{ color: '#888' }}>Loading AI Intelligence context...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>AI Brain Configuration</h1>
        <p style={styles.subtitle}>Fine-tune the assistant behavior and verify the server-side API connection.</p>
      </div>

      <div style={styles.form}>
        <div style={styles.statusGrid}>
          <div style={styles.statusCard}>
            <span style={styles.statusLabel}>API key</span>
            <strong style={{
              ...styles.statusValue,
              color: runtime?.apiKeyConfigured ? '#6ee7b7' : '#fca5a5',
            }}>
              {runtime?.apiKeyConfigured ? 'Configured' : 'Missing'}
            </strong>
            <span style={styles.statusHint}>
              {runtime?.apiKeyConfigured
                ? `Loaded from ${runtime.apiKeySource}`
                : 'Set OPENAI_API_KEY in server env'}
            </span>
          </div>

          <div style={styles.statusCard}>
            <span style={styles.statusLabel}>Provider</span>
            <strong style={styles.statusValue}>
              {runtime?.rawProvider || 'openai'}
            </strong>
            <span style={styles.statusHint}>
              {runtime?.supportedProvider ? 'Ready' : 'Unsupported provider'}
            </span>
          </div>

          <div style={styles.statusCard}>
            <span style={styles.statusLabel}>Runtime limits</span>
            <strong style={styles.statusValue}>
              {runtime?.maxOutputTokens ?? 600} tokens
            </strong>
            <span style={styles.statusHint}>
              timeout {runtime?.timeoutMs ?? 20000}ms, context {runtime?.maxContextMessages ?? 20}
            </span>
          </div>
        </div>

        {runtime?.issues?.length ? (
          <div style={styles.warning}>
            {runtime.issues.map((issue) => (
              <div key={issue}>{issue}</div>
            ))}
          </div>
        ) : null}

        <div style={styles.section}>
          <label style={styles.label}>Server Knowledge Base</label>
          <p style={styles.hint}>
            Read-only markdown files currently injected into the assistant system prompt.
          </p>

          {knowledgeError ? (
            <div style={styles.warning}>{knowledgeError}</div>
          ) : null}

          <div style={styles.knowledgeGrid}>
            <div style={styles.knowledgeList}>
              {knowledgeDocs.map((doc) => {
                const active = selectedKnowledgeDoc?.filename === doc.filename;

                return (
                  <button
                    key={doc.filename}
                    type="button"
                    onClick={() => setSelectedKnowledgeFilename(doc.filename)}
                    style={{
                      ...styles.knowledgeButton,
                      ...(active ? styles.knowledgeButtonActive : {}),
                    }}
                  >
                    <span style={styles.knowledgeButtonTitle}>{doc.title}</span>
                    <span style={styles.knowledgeButtonMeta}>
                      {doc.filename} · {doc.characterCount.toLocaleString()} chars
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={styles.knowledgeViewer}>
              {selectedKnowledgeDoc ? (
                <>
                  <div style={styles.knowledgeViewerHeader}>
                    <strong>{selectedKnowledgeDoc.filename}</strong>
                    <span>{selectedKnowledgeDoc.characterCount.toLocaleString()} chars</span>
                  </div>
                  <pre style={styles.knowledgeContent}>{selectedKnowledgeDoc.content}</pre>
                </>
              ) : (
                <div style={styles.emptyState}>No knowledge base files found.</div>
              )}
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>System Prompt</label>
          <p style={styles.hint}>
            Additional CMS instructions. The assistant still receives the server-side markdown knowledge base and safety boundaries.
          </p>
          <textarea
            style={styles.textarea}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="You are a helpful assistant for PixelRing Reparatur..."
            rows={12}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.section}>
            <label style={styles.label}>Model Selection</label>
            <select 
              style={styles.select}
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="gpt-4o-mini">GPT-4o mini (Recommended, Fast)</option>
              <option value="gpt-4o">GPT-4o (Reasoning, Complex)</option>
              <option value="o1-mini">o1-mini (Preview, Fast Reasoning)</option>
            </select>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Temperature ({temperature})</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              style={styles.range}
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
            />
          </div>
        </div>

        {message && (
          <div style={{
            ...styles.alert,
            background: message.type === 'success' ? '#064e3b' : '#7f1d1d',
            color: message.type === 'success' ? '#6ee7b7' : '#fca5a5',
          }}>
            {message.text}
          </div>
        )}

        <button
          style={{
            ...styles.saveBtn,
            opacity: saving ? 0.7 : 1,
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? 'Saving...' : 'Update Production Brain'}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '900px',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
    color: '#fff',
  },
  subtitle: {
    margin: '8px 0 0',
    fontSize: '14px',
    color: '#888',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    backgroundColor: '#141414',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#222',
    borderRadius: '16px',
    padding: '32px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  row: {
    display: 'flex',
    gap: '24px',
    width: '100%',
  },
  knowledgeGrid: {
    display: 'grid',
    gridTemplateColumns: '260px minmax(0, 1fr)',
    gap: '16px',
  },
  knowledgeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  knowledgeButton: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '12px',
    backgroundColor: '#0a0a0a',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#222',
    borderRadius: '8px',
    color: '#aaa',
    cursor: 'pointer',
    textAlign: 'left' as const,
  },
  knowledgeButtonActive: {
    borderColor: '#8b5cf6',
    backgroundColor: '#151022',
    color: '#fff',
  },
  knowledgeButtonTitle: {
    fontSize: '13px',
    fontWeight: 600,
  },
  knowledgeButtonMeta: {
    fontSize: '11px',
    color: '#777',
    lineHeight: 1.4,
  },
  knowledgeViewer: {
    minHeight: '360px',
    backgroundColor: '#0a0a0a',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#222',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  knowledgeViewerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '12px 14px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#222',
    color: '#ddd',
    fontSize: '12px',
  },
  knowledgeContent: {
    margin: 0,
    maxHeight: '420px',
    overflow: 'auto',
    padding: '16px',
    color: '#ddd',
    fontSize: '13px',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  emptyState: {
    padding: '16px',
    color: '#777',
    fontSize: '13px',
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '12px',
  },
  statusCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '14px',
    backgroundColor: '#0a0a0a',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#222',
    borderRadius: '10px',
  },
  statusLabel: {
    fontSize: '11px',
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  statusValue: {
    fontSize: '15px',
    color: '#fff',
  },
  statusHint: {
    fontSize: '12px',
    color: '#777',
  },
  warning: {
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: '#451a03',
    color: '#fdba74',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#ddd',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  hint: {
    margin: 0,
    fontSize: '12px',
    color: '#666',
  },
  textarea: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#0a0a0a',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#333',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    outline: 'none',
  },
  select: {
    padding: '12px',
    backgroundColor: '#0a0a0a',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#333',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  range: {
    accentColor: '#8b5cf6',
  },
  saveBtn: {
    marginTop: '12px',
    padding: '14px 24px',
    backgroundColor: '#8b5cf6',
    color: '#fff',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s',
  },
  alert: {
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
  }
};
