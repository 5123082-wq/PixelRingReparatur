'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** The dialog and its children stay mounted when returning to the inline tab. */
export default function StageWindow({ open, title, onClose, children, inline = false }: {
  open: boolean; title: string; onClose: () => void; children: ReactNode; inline?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      requestAnimationFrame(() => {
        const previousIsUsable = previousFocus?.isConnected && previousFocus !== document.body &&
          !previousFocus.hasAttribute('disabled') && previousFocus.getClientRects().length > 0;
        const target = previousIsUsable ? previousFocus : document.querySelector<HTMLElement>('[data-status-transition-trigger]');
        target?.focus();
      });
    };
  }, [open]);
  return <dialog ref={ref} aria-label={title} role={open ? 'dialog' : 'region'}
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    style={!open && inline ? { display: 'block', position: 'static', maxWidth: 'none', maxHeight: 'none', width: '100%', margin: 0 } : undefined}
    className="m-auto max-h-[92dvh] w-[min(56rem,calc(100%-1rem))] overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-950 p-0 text-white shadow-2xl backdrop:bg-black/70">
    {open && <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
      <h2 className="text-sm font-bold">{title}</h2>
      <button type="button" onClick={onClose} className="shrink-0 rounded-lg border border-zinc-700 px-3 py-2 text-sm">Остановить переход</button>
    </header>}
    {children}
  </dialog>;
}
