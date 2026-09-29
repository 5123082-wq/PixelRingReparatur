'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { adminFetch } from '@/lib/admin-fetch';
import type { AdminAttentionItem, AttentionMode } from '@/lib/portal-attention/types';

const field = 'mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-indigo-400 outline-none';
const button = 'min-h-11 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-400 disabled:opacity-40';
const states: Record<string, string> = { OPEN: 'Ожидает клиента', SUBMITTED: 'Ответ получен · проверьте', COMPLETED: 'Выполнено', CANCELLED: 'Отменено' };
const mailStates: Record<string, string> = { PENDING: 'Письмо в очереди', SENDING: 'Письмо отправляется', SENT: 'Письмо передано почтовому серверу', FAILED: 'Ошибка отправки письма', SKIPPED: 'Письмо не отправлялось' };
export default function CaseAttention({ caseId, documentId }: { caseId: string; documentId?: string }) {
  const [items, setItems] = useState<AdminAttentionItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mode, setMode] = useState<AttentionMode>('REPLY');
  const [due, setDue] = useState('');
  const requestId = useRef('');
  const endpoint = '/api/admin/cases/' + caseId + '/attention?locale=ru';
  const load = useCallback(async () => {
    try {
      const response = await fetch(endpoint, { cache: 'no-store' });
      if (!response.ok) throw new Error();
      const data = await response.json(); setItems(data.items); setLoaded(true); setError('');
    } catch { setError('Не удалось обновить действия клиента. Повторите попытку.'); }
  }, [endpoint]);
  useEffect(() => {
    void load();
    const refresh = () => { if (!document.hidden) void load(); };
    const timer = window.setInterval(refresh, 30_000); window.addEventListener('focus', refresh);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, [load]);
  async function mutate(payload: Record<string, unknown>) {
    setBusy(true); setError('');
    try {
      const response = await adminFetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error === 'portal_required' ? 'Сначала подключите кабинет клиента к заявке.' : 'Не удалось сохранить действие. Проверьте данные и повторите.');
      if (payload.action === 'create') { setTitle(''); setBody(''); setDue(''); requestId.current = ''; }
      await load();
    } catch (failure) { setError((failure as Error).message); }
    finally { setBusy(false); }
  }
  const visible = documentId ? items.filter((item) => item.kind === 'DOCUMENT' && item.sourceId === documentId) : items;
  return <section className={documentId ? 'space-y-3' : 'mx-auto w-full max-w-3xl space-y-5 p-4 sm:p-7'}>
    {!documentId && <header><h2 className="text-xl font-bold text-white">Действия клиента</h2><p className="mt-2 text-sm leading-6 text-zinc-400">Документы, подтверждения и запросы по этой заявке. Просмотр уведомления и выполнение действия учитываются отдельно.</p></header>}
    {error && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
    {!documentId && <form className="space-y-3 rounded-xl border border-zinc-700 p-4" onSubmit={(event) => { event.preventDefault(); if (!requestId.current) requestId.current = crypto.randomUUID(); void mutate({ action: 'create', id: requestId.current, title, body, mode, dueAt: due ? new Date(due).toISOString() : null }); }}>
      <fieldset disabled={busy} className="space-y-3">
        <legend className="mb-2 font-semibold text-white">Новый запрос клиенту</legend>
        <label className="block text-sm text-zinc-300">Что нужно сделать<input required maxLength={160} value={title} onChange={(e) => setTitle(e.target.value)} className={field} placeholder="Например: уточните адрес объекта" /></label>
        <label className="block text-sm text-zinc-300">Пояснение<textarea maxLength={2000} rows={3} value={body} onChange={(e) => setBody(e.target.value)} className={field} /></label>
        <label className="block text-sm text-zinc-300">Ожидаемое действие<select value={mode} onChange={(e) => setMode(e.target.value as AttentionMode)} className={field}><option value="REPLY">Ответить</option><option value="UPLOAD">Добавить фото</option><option value="ACKNOWLEDGE">Подтвердить ознакомление</option><option value="NONE">Только уведомить</option></select></label>
        <label className="block text-sm text-zinc-300">Срок · необязательно<input type="datetime-local" value={due} onChange={(e) => setDue(e.target.value)} className={field} /></label>
        <button type="submit" disabled={!title.trim() || busy} className={button + ' bg-indigo-600'}>Отправить запрос клиенту</button>
      </fieldset>
    </form>}
    <button type="button" disabled={busy} onClick={load} className={button}>Обновить</button>
    {loaded && !visible.length && <p className="text-sm text-zinc-400">Действий пока нет.</p>}
    {visible.map((item) => <article key={item.id} className="space-y-2 rounded-xl border border-zinc-700 p-4 text-sm">
      <h3 className="break-words font-semibold text-white">{item.title}</h3>
      <p className="break-words text-zinc-400">{item.recipient.displayName || item.recipient.email}</p>
      {item.body && <p className="whitespace-pre-wrap break-words text-zinc-300">{item.body}</p>}
      <p className="text-indigo-200">{item.mode === 'NONE' ? 'Информационное уведомление' : states[item.state]}</p>
      <p className="text-zinc-400">{item.readAt ? 'Уведомление просмотрено' : 'Уведомление ещё не просмотрено'}{item.completedAt ? ' · Подтверждено ' + new Date(item.completedAt).toLocaleString('ru') : ''}</p>
      {item.dueAt && <p className="text-zinc-400">Срок: {new Date(item.dueAt).toLocaleString('ru')}</p>}
      {item.email && <p className="text-zinc-400">{mailStates[item.email.state] || item.email.state}{item.email.sentAt ? ' · ' + new Date(item.email.sentAt).toLocaleString('ru') : ''}</p>}
      {item.evidence && <div className="space-y-2 rounded-lg bg-zinc-900 p-3">
        <p className="font-semibold text-white">Материал клиента для этого действия</p>
        <p className="text-xs text-zinc-400">{new Date(item.evidence.createdAt).toLocaleString('ru')}</p>
        {item.evidence.kind === 'REPLY' ? <p className="whitespace-pre-wrap break-words text-zinc-200">{item.evidence.body}</p> :
          <a href={item.evidence.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center break-all text-indigo-200 underline">Открыть фото: {item.evidence.filename || 'Фотография клиента'}</a>}
      </div>}
      {item.state === 'SUBMITTED' && !item.evidence && <p className="text-amber-200">Материал ответа недоступен. Подтверждение невозможно; отмените запрос и запросите ответ снова.</p>}
      <div className="flex flex-wrap gap-2">
        {item.state === 'SUBMITTED' && <button disabled={busy || !item.evidence} type="button" className={button} onClick={() => void mutate({ action: 'complete', id: item.id, evidenceId: item.evidence?.id })}>Подтвердить выполнение</button>}
        {item.mode !== 'NONE' && ['OPEN', 'SUBMITTED'].includes(item.state) && <button disabled={busy} type="button" className={button} onClick={() => void mutate({ action: 'cancel', id: item.id })}>Отменить запрос</button>}
        {item.email?.state === 'FAILED' && <button disabled={busy} type="button" className={button} onClick={() => void mutate({ action: 'retry-email', id: item.id })}>Повторить письмо</button>}
      </div>
    </article>)}
  </section>;
}
