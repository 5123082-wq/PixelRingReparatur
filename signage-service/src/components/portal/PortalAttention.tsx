'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { getPerformanceCopy } from '@/lib/portal/performance-copy';
import { clearPortalData, portalMutationFetch, portalFetch, useAttentionSeed, usePortalResource } from './PortalLiveProvider';
import Link from './PortalLink';
import { getAttentionCopy } from '@/lib/portal-attention/copy';
import { getDocumentCopy } from '@/lib/case-documents/copy';
import type { AttentionItem, AttentionFilter, AttentionSnapshot } from '@/lib/portal-attention/types';

type Snapshot = Omit<AttentionSnapshot, 'items'> & { items: AttentionItem[] | null };
const initial: Snapshot = { items: null, unreadCount: 0, openCount: 0, nextCursor: null, selectedItem: null };
export function usePortalAttention(accountKey: string, filter: AttentionFilter = 'actions', publicRequestNumber?: string, selected?: string | null, before?: string | null) {
  const locale = useLocale();
  const seed = useAttentionSeed();
  const query = new URLSearchParams({ locale, filter });
  if (publicRequestNumber) query.set('publicRequestNumber', publicRequestNumber);
  if (selected) query.set('selected', selected);
  if (before) query.set('before', before);
  const url = '/api/portal/attention?' + query;
  const load = useCallback(() => portalFetch<Snapshot>(url, accountKey), [url, accountKey]);
  const seeded = filter === 'actions' && !publicRequestNumber && !selected && !before;
  const resource = usePortalResource('attention:' + query, (seeded && seed) || initial, load);
  // Lazy pages have no server seed; the shared registry still deduplicates consumers.
  const loadedItems = resource.data?.items, reload = resource.reload;
  useEffect(() => { if (!loadedItems) void reload(); }, [loadedItems, reload]);
  return { ...(resource.data || initial), error: resource.error, reload: resource.reload };
}
export function clearPortalAttention() { clearPortalData(); }
const savedLocales = new Map<string, string>();
export function PortalLocalePreference({ accountKey }: { accountKey: string }) {
  const locale = useLocale();
  useEffect(() => {
    if (savedLocales.get(accountKey) === locale) return;
    savedLocales.set(accountKey, locale);
    void portalMutationFetch('/api/portal/attention', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale }) }).then(response => { if (!response.ok) savedLocales.delete(accountKey); }).catch(() => savedLocales.delete(accountKey));
  }, [locale, accountKey]);
  return null;
}
const buttonClass = 'inline-flex min-h-11 items-center justify-center rounded-xl border border-[#D0D5DD] bg-white px-3 py-2 text-sm font-semibold text-[#172033] hover:border-[#B8643E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E] disabled:opacity-50';
export default function PortalAttention({ accountKey, publicRequestNumber, showOverview = false, activeRequests = 0, onShowActiveRequests }: { accountKey: string; publicRequestNumber?: string; showOverview?: boolean; activeRequests?: number; onShowActiveRequests?: () => void }) {
  const locale = useLocale();
  const copy = getAttentionCopy(locale);
  const documentCopy = getDocumentCopy(locale);
  const [filter, setFilter] = useState<Exclude<AttentionFilter, 'all'>>('actions');
  const [cursors, setCursors] = useState<(string | null)[]>([null]);
  const selected = useSearchParams().get('attention');
  const data = usePortalAttention(accountKey, filter, publicRequestNumber, showOverview ? null : selected, cursors.at(-1));
  const performanceCopy = getPerformanceCopy(locale);
  function selectFilter(next: Exclude<AttentionFilter, 'all'>) { setFilter(next); setCursors([null]); }
  const [pending, setPending] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState(false);
  const focusedAttention = useRef<string | null>(null);
  const selectedItem = data.selectedItem;
  const selectedFilter = selectedItem ? (selectedItem.state === 'COMPLETED' || selectedItem.state === 'CANCELLED') && selectedItem.mode !== 'NONE' ? 'history'
    : selectedItem.mode !== 'NONE' && ['OPEN', 'SUBMITTED'].includes(selectedItem.state) ? 'actions'
    : selectedItem.kind === 'DOCUMENT' || selectedItem.kind === 'REPORT' ? 'materials' : 'notifications' : null;
  const visible = [...(data.items || [])];
  if (selectedItem && selectedFilter === filter && !visible.some(row => row.id === selectedItem.id)) visible.unshift(selectedItem);
  const empty = { actions: copy.emptyActions, notifications: copy.emptyNotifications, history: copy.emptyHistory, materials: copy.emptyMaterials }[filter];
  useEffect(() => {
    if (!data.items) return;
    if (showOverview) return;
    if (!selected || focusedAttention.current === selected) return;
    const item = data.selectedItem || data.items.find((row) => row.id === selected);
    if (!item || (publicRequestNumber && item.publicRequestNumber !== publicRequestNumber)) return;
    if (selectedFilter && filter !== selectedFilter) { setFilter(selectedFilter); setCursors([null]); return; }
    focusedAttention.current = selected;
    if (!window.location.hash || window.location.hash.startsWith('#attention-')) requestAnimationFrame(() => document.getElementById('attention-' + selected)?.scrollIntoView({ block: 'nearest' }));
  }, [data.items, data.selectedItem, publicRequestNumber, showOverview, selected, selectedFilter, filter]);
  async function mutate(item: AttentionItem, action: 'read' | 'acknowledge') {
    setPending(item.id); setMutationError(false);
    try {
      const response = await portalMutationFetch('/api/portal/attention/' + encodeURIComponent(item.id), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) });
      if (!response.ok) throw new Error();
      await data.reload();

    } catch { setMutationError(true); }
    finally { setPending(null); }
  }
  function linkFor(item: AttentionItem) {
    if (item.mode === 'REPLY' || item.mode === 'UPLOAD') return '/portal/requests/' + encodeURIComponent(item.publicRequestNumber) + '?attention=' + encodeURIComponent(item.id) + '#request-chat';
    return item.href;
  }
  return <section id={publicRequestNumber ? 'request-actions' : 'portal-attention'} dir={locale === 'ar' ? 'rtl' : undefined} className="min-w-0 space-y-4">
    {showOverview && <div className="grid gap-3 sm:grid-cols-3">
      {([{ key: 'actions', count: data.items ? data.openCount : '—', label: copy.actions }, { key: 'notifications', count: data.items ? data.unreadCount : '—', label: copy.notifications }] as const).map((metric) => <button key={metric.key} onClick={() => selectFilter(metric.key)} className="rounded-2xl border border-[#DCE3EA] bg-white p-5 text-start shadow-sm hover:border-[#B8643E]"><strong className="block text-3xl text-[#172033]">{metric.count}</strong><span className="mt-2 block text-sm font-semibold text-[#667085]">{metric.label}</span></button>)}
      <button type="button" onClick={onShowActiveRequests} className="rounded-2xl border border-[#DCE3EA] bg-white p-5 text-start shadow-sm hover:border-[#B8643E]"><strong className="block text-3xl text-[#172033]">{activeRequests}</strong><span className="mt-2 block text-sm font-semibold text-[#667085]">{copy.activeRequests}</span></button>
    </div>}
    <div className="min-w-0 rounded-2xl border border-[#DCE3EA] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label={copy.actions}>
        {(['actions', 'notifications', 'materials', 'history'] as const).map((key) => <button type="button" key={key} aria-pressed={filter === key} onClick={() => selectFilter(key)} className={'min-h-11 rounded-xl px-3 py-2 text-sm font-semibold ' + (filter === key ? 'bg-[#172033] text-white' : 'bg-[#F3F6FA] text-[#475467] hover:bg-[#E8EDF2]')}>{copy[key]}{key === 'actions' || key === 'notifications' ? ` · ${data.items ? (key === 'actions' ? data.openCount : data.unreadCount) : '—'}` : ''}</button>)}
      </div>
      <h2 className="mt-5 text-lg font-bold text-[#172033]">{copy[filter]}</h2>
      {(data.error || mutationError) && <div role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-800">{copy.error}<button type="button" className="ms-2 underline" onClick={() => { setMutationError(false); void data.reload(); }}>{copy.retry}</button></div>}
      {!data.items && !data.error && <p role="status" className="mt-4 text-sm text-[#667085]">{copy.loading}</p>}
      {data.items && visible.length === 0 && <p className="mt-4 text-sm text-[#667085]">{empty}</p>}
      <div className="mt-4 space-y-3">{visible.map((item) => <article id={(showOverview ? 'overview-attention-' : 'attention-') + item.id} key={item.id} className="scroll-mt-5 rounded-xl border border-[#E5EAF0] p-4 target:border-[#B8643E] target:bg-orange-50/50">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#667085]"><span>{item.kind === 'DOCUMENT' && item.documentType && item.documentType in documentCopy.types ? documentCopy.types[item.documentType as keyof typeof documentCopy.types] : copy[item.kind]} · <Link href={'/portal/requests/' + item.publicRequestNumber} className="font-mono underline">{item.publicRequestNumber}</Link></span><time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleDateString(locale)}</time></div>
        <h3 className="mt-2 break-words text-base font-semibold text-[#172033]">{item.title || copy[item.kind]}</h3>
        {item.body && <p className="mt-1 whitespace-pre-wrap break-words text-sm text-[#667085]">{item.body}</p>}
        {item.dueAt && <p className="mt-2 text-sm font-medium text-[#B8643E]">{copy.due}: {new Date(item.dueAt).toLocaleDateString(locale)}</p>}
        {item.state === 'SUBMITTED' && <p className="mt-2 text-sm text-blue-800">{copy.submitted}</p>}
        {item.completedAt && item.state === 'COMPLETED' && <p className="mt-2 text-sm text-emerald-800">{copy.completed} · {new Date(item.completedAt).toLocaleDateString(locale)}</p>}
        {item.state === 'CANCELLED' && <p className="mt-2 text-sm text-[#667085]">{copy.cancelled}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={linkFor(item)} className={buttonClass} onClick={() => { if (!item.readAt) void mutate(item, 'read'); if (item.state === 'OPEN' && (item.mode === 'REPLY' || item.mode === 'UPLOAD')) window.dispatchEvent(new CustomEvent('portal-attention-select', { detail: item })); }}>{item.state === 'SUBMITTED' && (item.mode === 'REPLY' || item.mode === 'UPLOAD') ? copy.viewResponse : item.mode === 'REPLY' ? copy.reply : item.mode === 'UPLOAD' ? copy.upload : copy.open}</Link>
          {item.mode === 'ACKNOWLEDGE' && item.state === 'OPEN' && <button type="button" disabled={pending === item.id} onClick={() => void mutate(item, 'acknowledge')} className={buttonClass + ' !bg-[#B8643E] !text-white'}>{copy.acknowledge}</button>}
          {!item.readAt && filter === 'notifications' && <button type="button" disabled={pending === item.id} onClick={() => void mutate(item, 'read')} className={buttonClass}>{copy.markRead}</button>}
        </div>
        {item.mode === 'ACKNOWLEDGE' && item.state === 'OPEN' && <p className="mt-2 text-xs leading-5 text-[#667085]">{copy.acknowledgeHint}</p>}
      </article>)}</div>
      {(cursors.length > 1 || data.nextCursor) && <nav aria-label={copy[filter]} className="mt-4 flex flex-wrap gap-2">
        <button type="button" className={buttonClass} disabled={cursors.length === 1} onClick={() => setCursors(current => current.slice(0, -1))}>{performanceCopy.previous}</button>
        <button type="button" className={buttonClass} disabled={!data.nextCursor} onClick={() => { if (data.nextCursor) setCursors(current => [...current, data.nextCursor]); }}>{performanceCopy.next}</button>
      </nav>}
    </div>
  </section>;
}
