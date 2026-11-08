'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { useLocale } from 'next-intl';
import { getCancellationCopy } from '@/lib/portal/cancellation-copy';
import { isTerminalRequest } from '@/lib/portal/request-filters';
import type { PortalRequest } from '@/lib/portal/types';
import { invalidatePortal, portalMutationFetch } from './PortalLiveProvider';

export default function PortalCancellation({ request }: { request: PortalRequest }) {
  const locale = useLocale();
  const copy = getCancellationCopy(locale);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const sending = useRef(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true; setBusy(true); setError('');
    try {
      const response = await portalMutationFetch('/api/portal/requests/' + encodeURIComponent(request.publicRequestNumber) + '/cancellation', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason, locale }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        if (response.status === 409) { invalidatePortal(); throw new Error(copy.closedError); }
        throw new Error(copy.error);
      }
      setSubmitted(true); dialog.current?.close(); invalidatePortal();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : copy.error);
    } finally { sending.current = false; setBusy(false); }
  }

  if (isTerminalRequest(request.status)) return null;
  if (request.cancellationRequestedAt || submitted) return (
    <div role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
      <p className="font-semibold">{copy.pending}</p>
      <p className="mt-1 leading-6">{copy.pendingExplanation}</p>
    </div>
  );
  return (
    <div className="mt-4 border-t border-[#E5EAF0] pt-3">
      <button ref={trigger} type="button" onClick={() => { setError(''); dialog.current?.showModal(); }} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-[#A45531] underline underline-offset-4">{copy.request}</button>
      <dialog ref={dialog} aria-labelledby={id + '-title'} aria-describedby={id + '-description'} dir={locale === 'ar' ? 'rtl' : 'ltr'}
        onCancel={event => { if (sending.current) event.preventDefault(); }}
        onClose={() => trigger.current?.focus()}
        className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-[#DCE3EA] bg-white p-5 text-[#172033] shadow-xl backdrop:bg-black/40">
        <form onSubmit={submit} aria-busy={busy}>
          <h2 id={id + '-title'} className="text-lg font-bold">{copy.title}</h2>
          <p id={id + '-description'} className="mt-3 text-sm leading-6 text-[#667085]">{copy.explanation}</p>
          <label htmlFor={id + '-reason'} className="mt-4 block text-sm font-semibold">{copy.reason}</label>
          <textarea id={id + '-reason'} autoFocus disabled={busy} maxLength={1000} value={reason} onChange={event => setReason(event.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-[#DCE3EA] p-3 text-base" />
          {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <button type="button" disabled={busy} onClick={() => dialog.current?.close()} className="min-h-11 rounded-xl border border-[#DCE3EA] px-4 text-sm font-semibold disabled:opacity-50">{copy.back}</button>
            <button type="submit" disabled={busy} className="min-h-11 rounded-xl bg-[#B8643E] px-4 text-sm font-semibold text-white disabled:opacity-50">{busy ? copy.sending : copy.submit}</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
