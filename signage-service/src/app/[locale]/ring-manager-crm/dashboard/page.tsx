'use client';

import * as Ably from 'ably';
import type { RealtimeChannel, TokenParams, TokenRequest } from 'ably';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { adminFetch } from '@/lib/admin-fetch';
import { getLocaleSegment, withLocalePath } from '../../admin-route';

import { Button } from '@/components/admin/ui/Button';
import { Input, Select, Textarea } from '@/components/admin/ui/Input';
import { Badge } from '@/components/admin/ui/Badge';

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
  updatedAt: string;
  statusUpdatedAt: string | null;
  unreadCustomerMessages: number;
  lastActivityAt: string;
  lastMessage: {
    id: string;
    authorRole: string;
    authorName: string | null;
    channel: string;
    preview: string;
    createdAt: string;
  } | null;
  _count: { messages: number; attachments: number };
};

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const STATUS_LABELS: Record<string, { label: string; variant: string }> = {
  DRAFT: { label: 'Черновик', variant: 'default' },
  FORMALIZED: { label: 'Оформлена', variant: 'default' },
  NUMBER_ISSUED: { label: 'Принято', variant: 'info' },
  UNDER_REVIEW: { label: 'В диагностике', variant: 'purple' },
  IN_PROGRESS: { label: 'Ремонт', variant: 'warning' },
  ON_HOLD: { label: 'Отложено', variant: 'default' },
  WAITING_FOR_CUSTOMER: { label: 'Ожидает клиента', variant: 'pink' },
  READY_FOR_PICKUP: { label: 'Готов', variant: 'success' },
  COMPLETED: { label: 'Выдан / Гарантия', variant: 'success' },
  CANCELLED: { label: 'Отказ', variant: 'error' },
};

const STATUS_KEYS = Object.keys(STATUS_LABELS);
const DEFAULT_VISIBLE_STATUS_KEYS = STATUS_KEYS.filter((key) => key !== 'CANCELLED');

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
const CRM_CASES_REALTIME_CHANNEL = 'private:crm:cases';
const REALTIME_EVENT_NAME = 'case.updated';

function formatActivityTime(value: string) {
  return new Date(value).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = getLocaleSegment(params?.locale);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilters, setStatusFilters] = useState<string[]>(DEFAULT_VISIBLE_STATUS_KEYS);
  const [channelFilter, setChannelFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [lastLiveUpdateAt, setLastLiveUpdateAt] = useState<string | null>(null);

  const fetchCases = useCallback(async (page = 1, options: { silent?: boolean } = {}) => {
    if (!options.silent) {
      setLoading(true);
    }
    const params = new URLSearchParams();

    params.set('page', String(page));

    params.set('statuses', statusFilters.join(','));
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
      if (!options.silent) {
        setLoading(false);
      }
    }
  }, [statusFilters, channelFilter, search, router, locale]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  useEffect(() => {
    let realtime: Ably.Realtime | null = null;
    let channel: RealtimeChannel | null = null;
    let isDisposed = false;

    async function connectRealtime() {
      const nextRealtime = new Ably.Realtime({
        authCallback: async (_tokenParams: TokenParams, callback) => {
          try {
            const res = await adminFetch('/api/admin/realtime/ably-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ scope: 'crm-cases' }),
            });

            if (!res.ok) {
              throw new Error(`Realtime token request failed (${res.status})`);
            }

            callback(null, (await res.json()) as TokenRequest);
          } catch (error) {
            callback(error instanceof Error ? error.message : 'Realtime auth failed', null);
          }
        },
      });

      realtime = nextRealtime;
      channel = nextRealtime.channels.get(CRM_CASES_REALTIME_CHANNEL);
      await channel.subscribe(REALTIME_EVENT_NAME, () => {
        if (!isDisposed) {
          setLastLiveUpdateAt(new Date().toISOString());
          void fetchCases(1, { silent: true });
        }
      });
    }

    void connectRealtime().catch((error) => {
      console.error('CRM list realtime connection failed:', error);
    });

    return () => {
      isDisposed = true;
      void channel?.unsubscribe(REALTIME_EVENT_NAME);
      realtime?.close();
    };
  }, [fetchCases]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Заявки</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Управление заявками и коммуникация CRM
            {lastLiveUpdateAt && (
              <span className="ml-3 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                Live updated {new Date(lastLiveUpdateAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          + Новая заявка
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-xl">
        <div className="flex-1 min-w-[240px]">
          <Input
            placeholder="Поиск по PR, имени, email, телефону..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCases()}
          />
        </div>

        <div className="w-64">
          <StatusChecklistFilter
            selectedStatuses={statusFilters}
            onChange={setStatusFilters}
          />
        </div>

        <div className="w-48">
          <Select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
          >
            <option value="">Все каналы</option>
            {Object.entries(CHANNEL_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </Select>
        </div>

        <Button onClick={() => fetchCases()} variant="secondary" className="px-5">
          Найти
        </Button>
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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-zinc-500 font-medium">Загрузка...</p>
          </div>
        ) : cases.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 gap-3">
            <div className="text-4xl">📭</div>
            <p className="text-zinc-500 font-medium">Заявок не найдено</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-950/50 text-xs text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">PR-номер</th>
                  <th className="px-6 py-4 font-medium">Клиент</th>
                  <th className="px-6 py-4 font-medium">Статус</th>
                  <th className="px-6 py-4 font-medium">Канал</th>
                  <th className="px-6 py-4 font-medium">Описание</th>
                  <th className="px-6 py-4 font-medium">Назначен</th>
                  <th className="px-6 py-4 font-medium">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                {cases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => router.push(withLocalePath(locale, `/ring-manager-crm/dashboard/${c.id}`))}
                    className={`hover:bg-zinc-800/50 cursor-pointer transition-colors ${c.unreadCustomerMessages > 0 ? 'bg-blue-500/[0.08]' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`font-mono font-semibold ${c.unreadCustomerMessages > 0 ? 'text-blue-300' : 'text-blue-400'}`}>{c.publicRequestNumber || '—'}</span>
                        {c.unreadCustomerMessages > 0 && (
                          <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-[0_0_15px_-5px_#3b82f6]">
                            {c.unreadCustomerMessages} new
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-medium ${c.unreadCustomerMessages > 0 ? 'text-white' : 'text-zinc-100'}`}>{c.customerName || 'Без имени'}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {c.customerEmail || c.customerPhone || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={STATUS_LABELS[c.status]?.variant || 'default'}>
                        {STATUS_LABELS[c.status]?.label || c.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {CHANNEL_LABELS[c.originChannel] || c.originChannel}
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate text-xs text-zinc-400">
                      <div className={`${c.unreadCustomerMessages > 0 ? 'font-semibold text-zinc-200' : 'text-zinc-400'} truncate`}>
                        {c.lastMessage?.preview || c.summary || '—'}
                      </div>
                      {c.lastMessage && (
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                          {c.lastMessage.authorRole === 'CUSTOMER' ? 'Client' : c.lastMessage.authorRole === 'OPERATOR' ? 'Operator' : 'System'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-zinc-300">{c.assignedOperator || '—'}</td>
                    <td className="px-6 py-4 text-xs text-zinc-500">
                      {formatActivityTime(c.lastActivityAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-8">
          <Button
            variant="secondary"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchCases(pagination.page - 1)}
          >
            ← Назад
          </Button>
          <span className="text-sm font-medium text-zinc-400">
            {pagination.page} / {pagination.totalPages} <span className="text-zinc-600">({pagination.total} всего)</span>
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchCases(pagination.page + 1)}
          >
            Далее →
          </Button>
        </div>
      )}
    </div>
  );
}

function StatusChecklistFilter({
  selectedStatuses,
  onChange,
}: {
  selectedStatuses: string[];
  onChange: (statuses: string[]) => void;
}) {
  const selectedSet = new Set(selectedStatuses);
  const allSelected = selectedStatuses.length === STATUS_KEYS.length;
  const activeLabel =
    allSelected
      ? 'Все статусы'
      : selectedStatuses.length === 0
        ? 'Нет статусов'
        : `${selectedStatuses.length} статусов`;

  function toggleStatus(status: string) {
    onChange(
      selectedSet.has(status)
        ? selectedStatuses.filter((item) => item !== status)
        : [...selectedStatuses, status]
    );
  }

  function toggleAll() {
    onChange(allSelected ? [] : STATUS_KEYS);
  }

  return (
    <details className="group relative">
      <summary className="flex h-10 cursor-pointer list-none items-center justify-between rounded-lg border border-zinc-700 bg-zinc-950 px-4 text-sm font-medium text-zinc-200 outline-none transition-colors hover:border-zinc-600">
        <span>{activeLabel}</span>
        <span className="text-xs text-zinc-500 transition-transform group-open:rotate-180">▾</span>
      </summary>

      <div className="absolute left-0 top-12 z-50 w-full overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl">
        <label className="flex cursor-pointer items-center gap-3 border-b border-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-100 hover:bg-zinc-900">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="h-4 w-4 accent-blue-500"
          />
          Все статусы
        </label>
        <div className="max-h-80 overflow-y-auto py-1">
          {STATUS_KEYS.map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              <input
                type="checkbox"
                checked={selectedSet.has(key)}
                onChange={() => toggleStatus(key)}
                className="h-4 w-4 accent-blue-500"
              />
              <span>{STATUS_LABELS[key].label}</span>
            </label>
          ))}
        </div>
      </div>
    </details>
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-6">Новая заявка</h2>

        {result ? (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Заявка успешно создана</h3>
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg py-4 mb-4">
              <p className="font-mono text-3xl font-bold text-blue-400 tracking-wider">
                {result.publicRequestNumber}
              </p>
            </div>
            <p className="text-sm text-zinc-400 mb-8">Скопируйте PR-номер и отправьте его клиенту для отслеживания статуса.</p>
            
            <Button onClick={onCreated} className="w-full">
              Понятно, закрыть
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Имя клиента"
              placeholder="Иван Иванов"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email"
                placeholder="ivan@example.com"
                value={form.customerEmail}
                onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
              />
              <Input
                label="Телефон"
                placeholder="+49 151 12345678"
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Канал обращения"
                value={form.originChannel}
                onChange={(e) => setForm({ ...form, originChannel: e.target.value })}
              >
                <option value="MANUAL">✋ Вручную</option>
                <option value="WHATSAPP">📱 WhatsApp</option>
                <option value="TELEGRAM">✈️ Telegram</option>
                <option value="PHONE">📞 Телефон</option>
                <option value="EMAIL">📧 Email</option>
              </Select>
              
              <Input
                label="Назначен оператор"
                placeholder="Логин или Имя"
                value={form.assignedOperator}
                onChange={(e) => setForm({ ...form, assignedOperator: e.target.value })}
              />
            </div>
            
            <Input
              label="Краткое описание"
              placeholder="Например: Ремонт светового короба"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
            
            <Textarea
              label="Подробности (необязательно)"
              placeholder="Дополнительная информация о клиенте или задаче..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />

            <div className="flex gap-3 justify-end mt-4">
              <Button type="button" variant="ghost" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Создание...' : 'Создать заявку'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
