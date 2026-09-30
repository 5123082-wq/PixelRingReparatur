'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { adminFetch } from '@/lib/admin-fetch';

const HEARTBEAT_MS = 15_000;
const IDLE_MS = 120_000;

export default function useCaseAttention(input: {
  caseId: string; open: boolean; canReply: boolean;
  lastMessageId: string | null; lastPortalMessageId: string | null;
  scrollRef: RefObject<HTMLDivElement | null>; endRef: RefObject<HTMLDivElement | null>;
}) {
  const latest = useRef(input);
  const refresh = useRef<(() => void) | null>(null);
  useEffect(() => {
    latest.current = input;
    const frame = requestAnimationFrame(() => refresh.current?.());
    return () => cancelAnimationFrame(frame);
  }, [input]);

  useEffect(() => {
    const tabId = crypto.randomUUID();
    let sequence = 0;
    let lastActivity = Date.now();
    let lastPresenceAt = 0;
    let wasPresent = false;
    let lastReadKey = '';
    let disposed = false;
    let queue = Promise.resolve();
    const path = `/api/admin/cases/${input.caseId}`;

    function endVisible() {
      const { scrollRef, endRef } = latest.current;
      const end = endRef.current?.getBoundingClientRect();
      const area = scrollRef.current?.getBoundingClientRect();
      return Boolean(end && area && end.bottom <= Math.min(area.bottom, window.innerHeight) + 2 &&
        end.top >= Math.max(area.top, 0) && end.right > 0 && end.left < window.innerWidth);
    }

    function pulse(active: boolean, keepalive = false) {
      const body = JSON.stringify({ tabId, sequence: ++sequence, active });
      lastPresenceAt = Date.now();
      wasPresent = active;
      return adminFetch(`${path}/presence`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive,
      });
    }

    function tick() {
      const state = latest.current;
      const viewing = state.open && document.visibilityState === 'visible' && document.hasFocus() &&
        Date.now() - lastActivity < IDLE_MS && endVisible();
      const present = viewing && state.canReply;
      const shouldPulse = present !== wasPresent || (present && Date.now() - lastPresenceAt >= HEARTBEAT_MS);
      const readKey = `${state.lastMessageId}:${state.lastPortalMessageId}`;
      const shouldRead = viewing && state.lastMessageId && readKey !== lastReadKey;
      if (!shouldPulse && !shouldRead) return;
      // Capture only what was actually rendered at the time of this observation.
      const lastMessageId = state.lastMessageId;
      const lastPortalMessageId = state.lastPortalMessageId;
      if (shouldRead) lastReadKey = readKey;
      if (shouldPulse) { wasPresent = present; lastPresenceAt = Date.now(); }
      queue = queue.then(async () => {
        if (disposed) return;
        if (shouldPulse) {
          const response = await pulse(present);
          if (!response.ok) { wasPresent = false; lastPresenceAt = 0; }
        }
        if (shouldRead) {
          const response = await adminFetch(`${path}/read`, { method: 'POST',
            headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lastMessageId, lastPortalMessageId }) });
          if (!response.ok) lastReadKey = '';
        }
      }).catch(() => { lastReadKey = ''; lastPresenceAt = 0; wasPresent = false; });
    }
    function activity(event: Event) {
      if (event.isTrusted && document.hasFocus() && document.visibilityState === 'visible') lastActivity = Date.now();
      tick();
    }
    function visibility() { tick(); }
    function leave() { void pulse(false, true).catch(() => {}); }
    refresh.current = tick;
    const timer = window.setInterval(tick, 1_000);
    window.addEventListener('pointerdown', activity);
    window.addEventListener('keydown', activity);
    window.addEventListener('wheel', activity, { passive: true });
    window.addEventListener('touchmove', activity, { passive: true });
    window.addEventListener('scroll', visibility, true);
    window.addEventListener('focus', activity);
    window.addEventListener('blur', visibility);
    window.addEventListener('pagehide', leave);
    document.addEventListener('visibilitychange', visibility);
    tick();
    return () => {
      disposed = true;
      refresh.current = null;
      clearInterval(timer);
      window.removeEventListener('pointerdown', activity);
      window.removeEventListener('keydown', activity);
      window.removeEventListener('wheel', activity);
      window.removeEventListener('touchmove', activity);
      window.removeEventListener('scroll', visibility, true);
      window.removeEventListener('focus', activity);
      window.removeEventListener('blur', visibility);
      window.removeEventListener('pagehide', leave);
      document.removeEventListener('visibilitychange', visibility);
      leave();
    };
  }, [input.caseId, input.open]);
}
