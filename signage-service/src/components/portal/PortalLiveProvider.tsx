'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { useLocale } from 'next-intl';
import Link, { clearPortalPrefetch } from './PortalLink';
import { getAttentionCopy } from '@/lib/portal-attention/copy';
import type { AttentionItem } from '@/lib/portal-attention/types';
import * as Ably from 'ably';
import { PortalSync, type ResourceState } from '@/lib/portal/sync';
export type AttentionSeed = { items: AttentionItem[]; unreadCount: number; openCount: number };
const SeedContext = createContext<AttentionSeed | undefined>(undefined);
export function useAttentionSeed() { return useContext(SeedContext); }
const Context = createContext<{ accountKey: string; sync: PortalSync; invalidate: () => void } | null>(null);
export function invalidatePortal() { window.dispatchEvent(new Event('portal-data-updated')); }
export function clearPortalData() { window.dispatchEvent(new Event('portal-auth-cleared')); }
export default function PortalLiveProvider({ accountKey, attentionSeed, children }: { accountKey?: string; attentionSeed?: AttentionSeed; children: ReactNode }) {
  const locale = useLocale();
  const [invalid, setInvalid] = useState(false);
  const [sync] = useState(() => new PortalSync());
  const invalidate = useCallback(() => invalidatePortal(), []);
  useEffect(() => {
    if (!accountKey) return;
    clearPortalPrefetch();
    let closed = false, everConnected = false, tokenPending = false, lastTokenAttempt = 0;
    let batch: ReturnType<typeof setTimeout> | undefined;
    let lastForeground = 0;
    let realtime: Ably.Realtime | undefined;
    const refresh = () => { if (!closed && document.visibilityState === 'visible') void sync.refreshActive(true); };
    const invalidation = () => { if (!batch) batch = setTimeout(() => { batch = undefined; refresh(); }, 250); };
    const foreground = () => { if (document.visibilityState === 'visible' && Date.now() - lastForeground > 500) { lastForeground = Date.now(); refresh(); } };
    const clear = () => { closed = true; realtime?.close(); clearPortalPrefetch(); setInvalid(true); sync.clear(); };
    const signedToken = async () => {
      const response = await fetch('/api/portal/realtime-token', { method: 'POST', cache: 'no-store' });
      if (response.status === 401 || response.status === 403) clearPortalData();
      if (!response.ok) throw new Error('realtime_unavailable');
      const data = await response.json();
      if (closed || data.portalUserId !== accountKey) throw new Error('account_changed');
      return data as { tokenRequest: Ably.TokenRequest; channel: string; portalUserId: string };
    };
    const connect = async () => {
      if (tokenPending || realtime || closed) return;
      tokenPending = true; lastTokenAttempt = Date.now();
      try {
        const first = await signedToken(); if (closed) return;
        let initialToken: Ably.TokenRequest | undefined = first.tokenRequest;
        realtime = new Ably.Realtime({ autoConnect: false, authCallback: async (_params, done) => {
          try {
            if (initialToken) { const token = initialToken; initialToken = undefined; done(null, token); return; }
            const next = await signedToken(); if (next.channel !== first.channel) { clearPortalData(); throw new Error('account_changed'); }
            done(null, next.tokenRequest);
          } catch { done('realtime_unavailable', null); }
        } });
        realtime.connection.on('connected', () => { sync.connected = true; if (everConnected) invalidation(); everConnected = true; });
        for (const state of ['disconnected', 'suspended', 'failed', 'closed'] as const) realtime.connection.on(state, () => { sync.connected = false; });
        void realtime.channels.get(first.channel).subscribe('invalidate', invalidation).catch(() => undefined);
        realtime.connect();
      } catch { /* The common scheduler supplies the fallback. */ }
      finally { tokenPending = false; }
    };
    const timer = setInterval(() => {
      if (!closed && document.visibilityState === 'visible') {
        void sync.refreshActive();
        if (!realtime && Date.now() - lastTokenAttempt >= 120_000) void connect();
      }
    }, 10_000);
    window.addEventListener('portal-data-updated', invalidation);
    window.addEventListener('portal-attention-updated', invalidation);
    window.addEventListener('portal-auth-cleared', clear);
    window.addEventListener('focus', foreground);
    document.addEventListener('visibilitychange', foreground);
    void connect();
    return () => { closed = true; clearInterval(timer); clearTimeout(batch); realtime?.close();
      window.removeEventListener('portal-data-updated', invalidation); window.removeEventListener('portal-attention-updated', invalidation); window.removeEventListener('portal-auth-cleared', clear);
      window.removeEventListener('focus', foreground); document.removeEventListener('visibilitychange', foreground); };
  }, [accountKey, sync]);
  const value = useMemo(() => accountKey ? { accountKey, sync, invalidate } : null, [accountKey, sync, invalidate]);
  if (invalid) return <main className="min-h-screen bg-[#EEF2F6] p-8" dir={locale === 'ar' ? 'rtl' : undefined}><p role="status">{getAttentionCopy(locale).error}</p><Link href="/portal" onClick={() => window.location.reload()} className="mt-4 inline-block underline">{getAttentionCopy(locale).retry}</Link></main>;
  return <SeedContext.Provider value={attentionSeed}><Context.Provider value={value}>{children}</Context.Provider></SeedContext.Provider>;
}
export function usePortalResource<T>(key: string, seed: T, loader: () => Promise<T>, chat = false) {
  const context = useContext(Context);
  const [fallback] = useState<ResourceState<T>>(() => ({ data: seed, error: false }));
  if (context) context.sync.resource(key, seed, loader, chat);
  const subscribe = useCallback((listener: () => void) => context ? context.sync.subscribe(key, listener) : () => undefined, [context, key]);
  const snapshot = useCallback(() => context ? context.sync.snapshot<T>(key) : fallback, [context, key, fallback]);
  const state = useSyncExternalStore(subscribe, snapshot, () => fallback);
  const reload = useCallback(() => context?.sync.refresh(key) ?? Promise.resolve(), [context, key]);
  return { ...state, reload };
}
export async function portalFetch<T>(url: string, accountKey?: string): Promise<T> {
  const response = await fetch(url, { cache: 'no-store' });
  if (response.status === 401 || response.status === 403 || (response.status === 404 && url.startsWith('/api/portal/requests/'))) clearPortalData();
  if (!response.ok) throw new Error('portal_unavailable');
  const data = await response.json();
  if (accountKey && data.portalUserId !== accountKey) { clearPortalData(); throw new Error('account_changed'); }
  return data as T;
}

export async function portalMutationFetch(url: string, options: RequestInit) {
  const response = await fetch(url, options);
  if (response.status === 401 || response.status === 403) clearPortalData();
  return response;
}
