'use client';

import { useLayoutEffect, type RefObject } from 'react';

/** The mobile case owns the visible viewport; desktop retains its existing layout. */
export function useCrmMobileViewport(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useLayoutEffect(() => {
    const frame = ref.current;
    if (!frame || !enabled) return;
    const mobile = window.matchMedia('(max-width: 767px)');
    const viewport = window.visualViewport;
    let restore: (() => void) | undefined;
    const update = () => {
      if (mobile.matches) {
        if (!viewport || viewport.scale === 1) {
          frame.style.setProperty('--crm-height', `${viewport?.height ?? window.innerHeight}px`);
          frame.style.setProperty('--crm-top', `${viewport?.offsetTop ?? 0}px`);
        }
        if (!restore) {
          const body = document.body;
          const root = document.documentElement;
          const x = window.scrollX, y = window.scrollY;
          const previous = { position: body.style.position, top: body.style.top, left: body.style.left, width: body.style.width };
          const overflow = root.style.overflow;
          // Dialogs manage body overflow independently; fixing the body and locking
          // the root avoids restoring a stale dialog lock when leaving a case.
          Object.assign(body.style, { position: 'fixed', top: `${-y}px`, left: `${-x}px`, width: '100%' });
          root.style.overflow = 'hidden';
          restore = () => {
            Object.assign(body.style, previous);
            root.style.overflow = overflow;
            window.scrollTo({ left: x, top: y, behavior: 'instant' });
          };
        }
      } else {
        restore?.();
        restore = undefined;
      }
    };
    update();
    mobile.addEventListener('change', update);
    window.addEventListener('resize', update);
    viewport?.addEventListener('resize', update);
    viewport?.addEventListener('scroll', update);
    return () => {
      mobile.removeEventListener('change', update);
      window.removeEventListener('resize', update);
      viewport?.removeEventListener('resize', update);
      viewport?.removeEventListener('scroll', update);
      restore?.();
    };
  }, [ref, enabled]);
}
