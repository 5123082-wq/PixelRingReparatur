'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { getIntakeVerificationCopy } from '@/lib/intake-verification-copy';
import { refreshPortalSessionAfterLogin } from './usePortalSession';

type State = { required: boolean; verified: boolean; email: string };
type Challenge = { email: string; sent: boolean; code: string; seconds: number; generation: number };
const emptyChallenge: Challenge = { email: '', sent: false, code: '', seconds: 0, generation: 0 };

export function useRequestEmailVerification(email: string, locale: string, isFromChat = false) {
  const normalizedEmail = email.trim().toLowerCase();
  const copy = getIntakeVerificationCopy(locale);
  const [state, setState] = useState<State>({ required: false, verified: false, email: '' });
  const [challenge, setChallenge] = useState<Challenge>(emptyChallenge);
  const [failure, setFailure] = useState({ email: '', message: '' });
  const [busy, setBusy] = useState<'check' | 'start' | 'verify' | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const revision = useRef(0);
  const latestEmail = useRef(normalizedEmail);
  const busyRef = useRef(false);
  const automaticSendAttempt = useRef('');

  useEffect(() => {
    if (latestEmail.current !== normalizedEmail) {
      latestEmail.current = normalizedEmail;
      revision.current += 1;
    }
  }, [normalizedEmail]);
  useEffect(() => () => { revision.current += 1; }, []);
  useEffect(() => {
    if (challenge.seconds <= 0) return;
    const timer = setTimeout(() => setChallenge((previous) => ({ ...previous, seconds: Math.max(0, previous.seconds - 1) })), 1000);
    return () => clearTimeout(timer);
  }, [challenge.seconds]);

  const verified = state.verified && state.email === normalizedEmail;
  const sent = challenge.sent && challenge.email === normalizedEmail;
  const code = challenge.email === normalizedEmail ? challenge.code : '';
  const seconds = challenge.email === normalizedEmail ? challenge.seconds : 0;
  const error = failure.email === normalizedEmail ? failure.message : '';

  function isCurrent(address: string, startedAtRevision: number) {
    return latestEmail.current === address && revision.current === startedAtRevision;
  }
  function showError(message: string, address = normalizedEmail) {
    setFailure({ email: address, message });
  }
  function reveal() {
    // Wait for the conditional panel to mount before bringing it into view.
    requestAnimationFrame(() => panelRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
  }

  async function performAction(action: 'start' | 'verify', startedAtRevision: number) {
    const address = normalizedEmail;
    if (address.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      showError(copy.invalidEmail);
      return;
    }
    setBusy(action);
    showError('');
    let actionError = action === 'start' ? copy.deliveryError : copy.checkError;
    try {
      const response = await fetch('/api/contact/verification', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, email: address, code, locale }),
      });
      if (!response.ok) {
        if (!isCurrent(address, startedAtRevision)) return;
        if (response.status === 429) {
          const retry = Math.max(1, Number(response.headers.get('Retry-After')) || 60);
          setChallenge((previous) => ({
            ...(previous.email === address ? previous : emptyChallenge), email: address, seconds: retry,
          }));
          actionError = copy.retry.replace('{seconds}', String(retry));
          throw new Error(actionError);
        }
        if (action === 'verify' && response.status === 400) actionError = copy.invalidCode;
        throw new Error(actionError);
      }
      const result = await response.json() as { sent?: boolean; verified?: boolean; authenticated?: boolean; retryAfter?: number };
      if (action === 'verify' && result.verified && result.authenticated) {
        // The cookie affects the whole browser, even if the address was edited
        // while the verification response was on its way.
        const session = await refreshPortalSessionAfterLogin();
        if (session.status === 'error') throw new Error(copy.checkError);
      }
      if (!isCurrent(address, startedAtRevision)) return;
      if (action === 'start') {
        if (result.sent !== true) throw new Error(copy.deliveryError);
        setChallenge((previous) => ({ email: address, sent: true, code: '', seconds: result.retryAfter || 60, generation: previous.generation + 1 }));
      } else {
        if (result.verified !== true) { actionError = copy.invalidCode; throw new Error(actionError); }
        setState({ required: true, verified: true, email: address });
        setChallenge((previous) => ({ ...previous, code: '' }));
      }
    } catch {
      if (isCurrent(address, startedAtRevision)) showError(actionError, address);
    }
  }

  async function act(action: 'start' | 'verify') {
    if (busyRef.current || (action === 'start' && seconds > 0) || (action === 'verify' && (!sent || code.length !== 6))) return;
    busyRef.current = true;
    try { await performAction(action, revision.current); }
    finally { busyRef.current = false; setBusy(null); }
  }

  async function ensureAllowed() {
    if (busyRef.current) return false;
    busyRef.current = true;
    setBusy('check');
    showError('');
    const startedAtRevision = revision.current;
    try {
      // Check only after a valid form submission, never on opening, typing or focus.
      const response = await fetch('/api/contact/verification', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'state', email: normalizedEmail, isFromChat }),
      });
      if (!response.ok) throw new Error(copy.checkError);
      const result = await response.json() as Omit<State, 'email'>;
      if (typeof result.required !== 'boolean' || typeof result.verified !== 'boolean') throw new Error(copy.checkError);
      if (!isCurrent(normalizedEmail, startedAtRevision)) return false;
      setState({ required: result.required, verified: result.verified, email: normalizedEmail });
      if (!result.required || result.verified) return true;
      reveal();
      // Resending is always explicit, including after an unsuccessful delivery.
      if (automaticSendAttempt.current !== normalizedEmail && !sent) {
        automaticSendAttempt.current = normalizedEmail;
        await performAction('start', startedAtRevision);
      }
      return false;
    } catch {
      if (isCurrent(normalizedEmail, startedAtRevision)) { showError(copy.checkError); reveal(); }
      return false;
    } finally { busyRef.current = false; setBusy(null); }
  }

  function requireVerification() {
    // The contact route can require verification even after the preflight check.
    if (latestEmail.current !== normalizedEmail) return;
    revision.current += 1;
    setState({ required: true, verified: false, email: normalizedEmail });
    setChallenge(emptyChallenge);
    showError('');
    automaticSendAttempt.current = normalizedEmail;
    reveal();
    void act('start');
  }
  function reset() {
    revision.current += 1;
    setState({ required: false, verified: false, email: '' });
    setChallenge(emptyChallenge);
    showError('');
    automaticSendAttempt.current = '';
  }

  return {
    state, verified, blocked: state.required && !verified, copy, error, panelRef,
    busy, sent, code, seconds, sentTo: sent ? challenge.email : '', generation: challenge.generation,
    ensureAllowed, requireVerification, reset,
    sendCode: () => act('start'), verifyCode: () => act('verify'),
    setCode: (value: string) => setChallenge((previous) => ({ ...previous, code: value.replace(/\D/g, '').slice(0, 6) })),
  };
}

type Props = {
  verification: ReturnType<typeof useRequestEmailVerification>;
  locale: string;
};

export default function RequestEmailVerification({ verification, locale }: Props) {
  const { panelRef, ...v } = verification;
  const id = useId();
  const codeRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (v.sent && !v.verified) codeRef.current?.focus(); }, [v.sent, v.generation, v.verified]);

  const button = 'min-h-11 rounded-xl bg-[#0E1A2B] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50';
  if (!v.state.required && !v.error) return null;
  return (
    <div ref={panelRef} dir={locale === 'ar' ? 'rtl' : 'ltr'} aria-busy={Boolean(v.busy)} className="space-y-3 rounded-2xl bg-[#F4F5F6] p-4 text-start text-sm text-[#0E1A2B]">
      {v.state.required && (v.verified ? <p role="status">{v.copy.verified}</p> : <>
        <p className="font-semibold">{v.copy.title}</p>
        <p>{v.copy.intro}</p>
        {v.busy === 'start' && <p role="status">{v.copy.sending}</p>}
        {v.sent && <>
          <p role="status">{v.copy.sent.split('{email}')[0]}<bdi className="break-all">{v.sentTo}</bdi>{v.copy.sent.split('{email}')[1]}</p>
          <label htmlFor={`${id}-code`} className="block font-semibold">{v.copy.code}</label>
          <input ref={codeRef} id={`${id}-code`} dir="ltr" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={v.code} disabled={Boolean(v.busy)} onChange={(e) => v.setCode(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); if (v.code.length === 6) void v.verifyCode(); } }} aria-invalid={v.error ? true : undefined} aria-describedby={v.error ? `${id}-error` : undefined} className="w-full rounded-xl border border-[#D8DADF] bg-white px-3 py-2.5 text-lg tracking-widest outline-offset-2 disabled:opacity-50" />
          <button type="button" disabled={Boolean(v.busy) || v.code.length !== 6} className={button} onClick={() => void v.verifyCode()}>{v.busy === 'verify' ? v.copy.verifying : v.copy.verify}</button>
          <p className="text-xs text-[#596273]">{v.copy.spam}</p>
        </>}
        <button type="button" disabled={Boolean(v.busy) || v.seconds > 0} onClick={() => void v.sendCode()} className={v.sent ? 'block min-h-11 font-semibold underline underline-offset-4 disabled:opacity-50' : button}>{v.sent ? v.copy.resend : v.copy.send}{v.seconds > 0 ? ` (${v.seconds})` : ''}</button>
      </>)}
      {v.error && <p id={`${id}-error`} role="alert" className="text-red-700">{v.error}</p>}
    </div>
  );
}
