'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/routing';

export type PortalSessionState = {
  status: 'checking' | 'authenticated' | 'anonymous' | 'error';
  email: string | null;
  isProduction: boolean;
};

const INITIAL_STATE: PortalSessionState = {
  status: 'checking',
  email: null,
  isProduction: false,
};

let state = INITIAL_STATE;
let pendingRefresh: Promise<PortalSessionState> | null = null;
const listeners = new Set<() => void>();

function publish(nextState: PortalSessionState) {
  state = nextState;
  listeners.forEach((listener) => listener());
  return state;
}

function refreshPortalSession(): Promise<PortalSessionState> {
  if (pendingRefresh) return pendingRefresh;

  pendingRefresh = (async () => {
    try {
      const response = await fetch('/api/portal/session-state', {
        cache: 'no-store',
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Session state unavailable');

      const payload = (await response.json()) as {
        authenticated?: unknown;
        mode?: unknown;
        email?: unknown;
      };
      const isProduction = payload.authenticated === true && payload.mode === 'production';
      const isDemo = payload.authenticated === true && payload.mode === 'demo';

      return publish({
        status: isProduction || isDemo ? 'authenticated' : 'anonymous',
        email: isProduction && typeof payload.email === 'string' ? payload.email : null,
        isProduction,
      });
    } catch {
      return publish({ status: 'error', email: null, isProduction: false });
    } finally {
      pendingRefresh = null;
    }
  })();

  return pendingRefresh;
}

function refreshWhenVisible() {
  if (document.visibilityState === 'visible') void refreshPortalSession();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener('focus', refreshWhenVisible);
    window.addEventListener('pageshow', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener('focus', refreshWhenVisible);
      window.removeEventListener('pageshow', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    }
  };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return INITIAL_STATE;
}

export function usePortalSession() {
  const pathname = usePathname();
  const locale = useLocale();
  const session = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    void refreshPortalSession();
  }, [pathname, locale]);

  return { ...session, refresh: refreshPortalSession };
}
