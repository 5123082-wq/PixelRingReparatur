'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { getIntakeVerificationCopy } from '@/lib/intake-verification-copy';

type State = { required: boolean; verified: boolean; email: string; previousRequestNumber?: string };

export function useRequestEmailVerification(email: string, locale: string, isFromChat = false) {
  const normalizedEmail = email.trim().toLowerCase();
  const copy = getIntakeVerificationCopy(locale);
  const [state, setState] = useState<State>({ required: false, verified: false, email: '' });
  const [error, setError] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const revision = useRef(0);
  const latestEmail = useRef(normalizedEmail);
  useEffect(() => { latestEmail.current = normalizedEmail; }, [normalizedEmail]);

  const check = useCallback(async (signal?: AbortSignal) => {
    const startedAtRevision = revision.current;
    const response = await fetch('/api/contact/verification', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal,
      body: JSON.stringify({ action: 'state', email: normalizedEmail, isFromChat }),
    });
    if (!response.ok) throw new Error(copy.checkError);
    const result = await response.json() as Omit<State, 'email'>;
    if (latestEmail.current === normalizedEmail && revision.current === startedAtRevision) {
      setState({ ...result, email: normalizedEmail });
    }
    return !result.required || result.verified;
  }, [normalizedEmail, isFromChat, copy.checkError]);

  useEffect(() => {
    const abort = new AbortController();
    // Early check on opening the form, then debounce while the address is edited.
    const timer = setTimeout(() => { void check(abort.signal).catch(() => undefined); }, 250);
    const onFocus = () => { void check(abort.signal).catch(() => undefined); };
    window.addEventListener('focus', onFocus);
    return () => { clearTimeout(timer); abort.abort(); window.removeEventListener('focus', onFocus); };
  }, [check]);

  const verified = state.verified && state.email === normalizedEmail;
  function requireVerification() {
    revision.current += 1;
    setState((previous) => ({ ...previous, required: true, verified: false }));
    panelRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  async function ensureAllowed() {
    setError('');
    try {
      const allowed = await check();
      if (!allowed) panelRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      return allowed;
    } catch {
      setError(copy.checkError);
      return false;
    }
  }
  return {
    state, verified, blocked: state.required && !verified, copy, error, panelRef,
    ensureAllowed, requireVerification,
    markVerified: (address: string) => {
      revision.current += 1;
      setState((previous) => ({ ...previous, verified: true, email: address }));
    },
  };
}

type Props = {
  verification: ReturnType<typeof useRequestEmailVerification>;
  email: string;
  onEmailChange: (email: string) => void;
  locale: string;
};

export default function RequestEmailVerification({ verification: v, email, onEmailChange, locale }: Props) {
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const busyRef = useRef(false);
  const codeRef = useRef<HTMLInputElement>(null);
  const emailValue = email.trim().toLowerCase();
  const sent = sentTo === emailValue && Boolean(sentTo);
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((remaining) => remaining - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);
  useEffect(() => { if (sent) codeRef.current?.focus(); }, [sent]);

  async function act(action: 'start' | 'verify') {
    if (busyRef.current) return;
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) { setError(v.copy.invalidEmail); return; }
    busyRef.current = true;
    setBusy(true);
    try {
      const response = await fetch('/api/contact/verification', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, email: emailValue, code, locale }),
      });
      if (!response.ok) {
        if (response.status === 429) {
          const retry = Number(response.headers.get('Retry-After')) || 60;
          setSeconds(retry);
          throw new Error(v.copy.retry.replace('{seconds}', String(retry)));
        }
        throw new Error(action === 'start' ? v.copy.deliveryError : response.status === 400 ? v.copy.invalidCode : v.copy.checkError);
      }
      if (action === 'start') { setSentTo(emailValue); setCode(''); setSeconds(60); }
      else { v.markVerified(emailValue); }
    } catch (err) {
      setError(err instanceof Error ? err.message : v.copy.checkError);
    } finally { setBusy(false); busyRef.current = false; }
  }

  const button = 'rounded-xl bg-[#0E1A2B] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50';
  if (!v.state.required && !v.error) return <div ref={v.panelRef} />;
  return (
    <div ref={v.panelRef} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="space-y-3 rounded-2xl border border-[#B8643E]/25 bg-[#FDF7F0] p-4 text-start text-sm text-[#0E1A2B]">
      {v.state.required && (v.verified ? <p role="status">{v.copy.verified}</p> : <>
        <p className="font-bold">{v.copy.title}</p>
        <p>{v.copy.previous}</p>
        <div className="flex flex-wrap gap-2">
          <a href={`/${locale}/status${v.state.previousRequestNumber ? `?request=${encodeURIComponent(v.state.previousRequestNumber)}` : ''}`} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-[#E7DDD3] bg-white px-4 py-2.5 font-semibold" aria-describedby={`${id}-previous-help`}>{v.copy.openPrevious} ↗</a>
          <button type="button" className={button} aria-expanded={expanded} aria-controls={`${id}-new`} onClick={() => setExpanded(true)}>{v.copy.newRequest}</button>
        </div>
        <p id={`${id}-previous-help`} className="text-xs text-[#72665D]">{v.copy.previousHelp}</p>
        {expanded && <div id={`${id}-new`} className="space-y-3 border-t border-[#E7DDD3] pt-3" aria-busy={busy}>
          <p>{v.copy.intro}</p>
          <label htmlFor={`${id}-email`} className="block font-semibold">{v.copy.email}</label>
          <input id={`${id}-email`} type="email" autoComplete="email" dir="ltr" value={email} onChange={(e) => onEmailChange(e.target.value)} className="w-full rounded-xl border border-[#E7DDD3] bg-white px-3 py-2.5 outline-offset-2" />
          {sent && <>
            <p role="status">{v.copy.sent.split('{email}')[0]}<bdi className="break-all">{sentTo}</bdi>{v.copy.sent.split('{email}')[1]}</p>
            <label htmlFor={`${id}-code`} className="block font-semibold">{v.copy.code}</label>
            <input ref={codeRef} id={`${id}-code`} dir="ltr" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (code.length === 6) void act('verify'); } }} className="w-full rounded-xl border border-[#E7DDD3] bg-white px-3 py-2.5 text-lg tracking-widest outline-offset-2" />
            <button type="button" disabled={busy || code.length !== 6} className={button} onClick={() => void act('verify')}>{v.copy.verify}</button>
            <p className="text-xs text-[#72665D]">{v.copy.spam}</p>
          </>}
          <button type="button" disabled={busy || seconds > 0} onClick={() => void act('start')} className={sent ? 'block font-semibold underline underline-offset-4 disabled:opacity-50' : button}>{sent ? v.copy.resend : v.copy.send}{seconds > 0 ? ` (${seconds})` : ''}</button>
          {error && <p role="alert" className="text-red-700">{error}</p>}
        </div>}
      </>)}
      {v.error && <p role="alert" className="text-red-700">{v.error}</p>}
    </div>
  );
}
