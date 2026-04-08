'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import {
  getLocaleSegment,
  resolveLocalizedRedirect,
} from '../admin-route';
import { adminFetch } from '@/lib/admin-fetch';

export default function CrmLoginPage() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = getLocaleSegment(params?.locale);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await adminFetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ masterKey: key.trim() }),
      });

      if (!res.ok) {
        setError('Access denied');
        setKey('');
        setLoading(false);
        return;
      }

      const data = await res.json();
      router.push(
        resolveLocalizedRedirect(locale, data.redirectTo, '/ring-manager-crm/dashboard')
      );
    } catch {
      setError('Connection error');
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.logo}>📦</div>
        <h1 style={styles.title}>PixelRing CRM</h1>
        <p style={styles.subtitle}>Manager & Operator Access</p>

        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Access Key"
          autoFocus
          required
          disabled={loading}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={loading || !key} style={styles.button}>
          {loading ? 'Verifying...' : 'Authorize'}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0a',
    fontFamily: "'Inter', sans-serif",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '48px 40px',
    background: '#141414',
    borderRadius: '12px',
    border: '1px solid #222',
    minWidth: '340px',
  },
  logo: { fontSize: '36px' },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    color: '#fff',
  },
  subtitle: {
    margin: '-10px 0 0',
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    background: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  },
  error: { margin: 0, fontSize: '13px', color: '#ef4444' },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    fontWeight: 600,
    background: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};
