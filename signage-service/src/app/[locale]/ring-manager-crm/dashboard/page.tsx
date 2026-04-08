'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { adminFetch } from '@/lib/admin-fetch';

import { getLocaleSegment, withLocalePath } from '../../admin-route';

type CaseItem = {
  id: string;
  publicRequestNumber: string | null;
  status: string;
  originChannel: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  assignedOperator: string | null;
  summary: string | null;
  createdAt: string;
  statusUpdatedAt: string | null;
  _count: { messages: number; attachments: number };
};

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Черновик', color: '#555' },
  FORMALIZED: { label: 'Оформлена', color: '#666' },
  NUMBER_ISSUED: { label: 'Принято', color: '#3b82f6' },
  UNDER_REVIEW: { label: 'В диагностике', color: '#a855f7' },
  IN_PROGRESS: { label: 'Ремонт', color: '#f59e0b' },
  ON_HOLD: { label: 'Отложено', color: '#6b7280' },
  WAITING_FOR_CUSTOMER: { label: 'Ожидает клиента', color: '#ec4899' },
  READY_FOR_PICKUP: { label: 'Готов', color: '#22c55e' },
  COMPLETED: { label: 'Выдан / Гарантия', color: '#10b981' },
  CANCELLED: { label: 'Отказ', color: '#ef4444' },
};

const CHANNEL_LABELS: Record<string, string> = {
  WEBSITE_CHAT: '💬 Чат',
  WEBSITE_FORM: '📝 Форма',
  TELEGRAM: '✈️ Telegram',
  WHATSAPP: '📱 WhatsApp',
  PHONE: '📞 Телефон',
  EMAIL: '📧 Email',
  CRM: '🏢 CRM',
  MANUAL: '✋ Вручную',
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = getLocaleSegment(params?.locale);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchCases = useCallback(async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams();

    params.set('page', String(page));

    if (statusFilter) params.set('status', statusFilter);
    if (channelFilter) params.set('channel', channelFilter);
    if (search.trim()) params.set('search', search.trim());

    try {
      const res = await fetch(`/api/admin/cases?${params}`);

      if (!res.ok) {
        if (res.status === 404) {
          router.push(withLocalePath(locale, '/ring-manager-crm'));
        }
        return;
      }

      const data = await res.json();

      setCases(data.cases);
      setPagination(data.pagination);
    } catch {
      console.error('Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, channelFilter, search, router, locale]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Заявки</h1>
        <button onClick={() => setShowCreateForm(true)} style={styles.addBtn}>
          + Новая заявка
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Поиск по PR, имени, email, телефону..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchCases()}
          style={styles.searchInput}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">Все статусы</option>
          {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">Все каналы</option>
          {Object.entries(CHANNEL_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <button onClick={() => fetchCases()} style={styles.filterBtn}>
          🔍
        </button>
      </div>

      {/* Create form modal */}
      {showCreateForm && (
        <CreateCaseForm
          onClose={() => setShowCreateForm(false)}
          onCreated={() => {
            setShowCreateForm(false);
            fetchCases();
          }}
        />
      )}

      {/* Table */}
      {loading ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>Загрузка...</p>
      ) : cases.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>Заявок не найдено</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>PR-номер</th>
                <th style={styles.th}>Клиент</th>
                <th style={styles.th}>Статус</th>
                <th style={styles.th}>Канал</th>
                <th style={styles.th}>Описание</th>
                <th style={styles.th}>Назначен</th>
                <th style={styles.th}>Дата</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() =>
                    router.push(withLocalePath(locale, `/ring-manager-crm/dashboard/${c.id}`))
                  }
                  style={styles.tr}
                >
                  <td style={styles.td}>
                    <span style={styles.prNumber}>{c.publicRequestNumber || '—'}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ fontWeight: 500 }}>{c.customerName || 'Без имени'}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      {c.customerEmail || c.customerPhone || '—'}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        background: STATUS_LABELS[c.status]?.color || '#555',
                      }}
                    >
                      {STATUS_LABELS[c.status]?.label || c.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontSize: '13px' }}>
                      {CHANNEL_LABELS[c.originChannel] || c.originChannel}
                    </span>
                  </td>
                  <td style={{ ...styles.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.summary || '—'}
                  </td>
                  <td style={styles.td}>{c.assignedOperator || '—'}</td>
                  <td style={{ ...styles.td, fontSize: '12px', color: '#666' }}>
                    {new Date(c.createdAt).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            disabled={pagination.page <= 1}
            onClick={() => fetchCases(pagination.page - 1)}
            style={styles.pageBtn}
          >
            ← Назад
          </button>
          <span style={{ color: '#666', fontSize: '13px' }}>
            {pagination.page} / {pagination.totalPages} ({pagination.total} всего)
          </span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchCases(pagination.page + 1)}
            style={styles.pageBtn}
          >
            Далее →
          </button>
        </div>
      )}
    </div>
  );
}

/* ========== Create Case Form ========== */

function CreateCaseForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    assignedOperator: '',
    originChannel: 'MANUAL',
    summary: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ publicRequestNumber: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await adminFetch('/api/admin/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();

        setResult(data.case);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ margin: '0 0 20px', color: '#fff', fontSize: '18px' }}>
          Новая заявка
        </h2>

        {result ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#22c55e', fontSize: '16px', margin: '0 0 8px' }}>
              ✅ Заявка создана
            </p>
            <p style={styles.prResult}>{result.publicRequestNumber}</p>
            <p style={{ color: '#666', fontSize: '13px' }}>
              Отправьте этот номер клиенту
            </p>
            <button onClick={onCreated} style={{ ...styles.addBtn, marginTop: '16px' }}>
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              placeholder="Имя клиента"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              style={styles.formInput}
            />
            <input
              placeholder="Email"
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
              style={styles.formInput}
            />
            <input
              placeholder="Телефон"
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              style={styles.formInput}
            />
            <select
              value={form.originChannel}
              onChange={(e) => setForm({ ...form, originChannel: e.target.value })}
              style={styles.formInput}
            >
              <option value="MANUAL">✋ Вручную</option>
              <option value="WHATSAPP">📱 WhatsApp</option>
              <option value="TELEGRAM">✈️ Telegram</option>
              <option value="PHONE">📞 Телефон</option>
              <option value="EMAIL">📧 Email</option>
            </select>
            <input
              placeholder="Назначен оператор (имя/логин)"
              value={form.assignedOperator}
              onChange={(e) => setForm({ ...form, assignedOperator: e.target.value })}
              style={styles.formInput}
            />
            <input
              placeholder="Краткое описание проблемы"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              style={styles.formInput}
            />
            <textarea
              placeholder="Подробности (необязательно)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              style={{ ...styles.formInput, resize: 'vertical' as const }}
            />

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={onClose} style={styles.cancelBtn}>
                Отмена
              </button>
              <button type="submit" disabled={loading} style={styles.addBtn}>
                {loading ? 'Создание...' : 'Создать и получить PR'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 700,
    color: '#fff',
  },
  addBtn: {
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 600,
    background: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  filters: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const,
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    padding: '10px 14px',
    fontSize: '13px',
    background: '#141414',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#fff',
    outline: 'none',
  },
  select: {
    padding: '10px 12px',
    fontSize: '13px',
    background: '#141414',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#ccc',
    outline: 'none',
  },
  filterBtn: {
    padding: '10px 14px',
    background: '#222',
    border: '1px solid #333',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  tableWrapper: {
    borderRadius: '12px',
    border: '1px solid #222',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '13px',
  },
  th: {
    textAlign: 'left' as const,
    padding: '12px 16px',
    background: '#141414',
    color: '#666',
    fontWeight: 500,
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    borderBottom: '1px solid #222',
  },
  tr: {
    cursor: 'pointer',
    borderBottom: '1px solid #1a1a1a',
    transition: 'background 0.15s',
  },
  td: {
    padding: '14px 16px',
    verticalAlign: 'middle' as const,
  },
  prNumber: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    color: '#3b82f6',
    fontWeight: 600,
  },
  badge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#fff',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '20px',
    padding: '16px',
  },
  pageBtn: {
    padding: '8px 16px',
    fontSize: '13px',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#ccc',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modal: {
    background: '#141414',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '32px',
    width: '460px',
    maxWidth: '90vw',
  },
  formInput: {
    padding: '10px 14px',
    fontSize: '13px',
    background: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#fff',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  cancelBtn: {
    padding: '10px 20px',
    fontSize: '13px',
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#999',
    cursor: 'pointer',
  },
  prResult: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '28px',
    fontWeight: 700,
    color: '#fff',
    margin: '12px 0',
    letterSpacing: '0.05em',
  },
};
