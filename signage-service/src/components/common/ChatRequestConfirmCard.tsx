'use client';

import React, { useState } from 'react';
import type { IntakePrefill } from './ChatIntakeCard';

type Props = {
  prefill?: IntakePrefill;
  onSuccess?: (requestNumber: string) => void;
  onEditContact?: () => void;
};

export default function ChatRequestConfirmCard({
  prefill,
  onSuccess,
  onEditContact,
}: Props) {
  const [contact, setContact] = useState(prefill?.contact ?? '');
  const [name, setName] = useState(prefill?.name ?? '');
  const [location, setLocation] = useState(prefill?.location ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [requestNumber, setRequestNumber] = useState('');
  const [portalClaimUrl, setPortalClaimUrl] = useState('');

  const hasContact = contact.trim().length > 0;
  const hasName = name.trim().length > 0;
  const hasLocation = location.trim().length > 0;
  const hasSummary = Boolean(prefill?.summary?.trim());
  const shouldShowContactInput = !prefill?.contact?.trim();
  const shouldShowNameInput = !prefill?.name?.trim();
  const shouldShowLocationInput = !prefill?.location?.trim();

  const saveDraft = async () => {
    const fd = new FormData();
    fd.append('name', name);
    fd.append('contact', contact);
    fd.append('location', location);
    fd.append('issueType', prefill?.issueType ?? '');
    fd.append('summary', prefill?.summary ?? '');

    await fetch('/api/chat/intake-draft', {
      method: 'POST',
      body: fd,
    }).catch(() => undefined);
  };

  const handleConfirm = async () => {
    if (!hasContact) {
      setError('Bitte geben Sie eine Kontaktinformation an.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('contact', contact);
      fd.append('location', location);
      fd.append(
        'message',
        prefill?.summary
          ? `Chat-Anfrage. Typ: ${prefill.issueType || 'Nicht angegeben'}\n\n${prefill.summary}`
          : `Chat-Anfrage. Typ: ${prefill?.issueType || 'Nicht angegeben'}`
      );
      fd.append('issueType', prefill?.issueType ?? '');
      fd.append('isFromChat', 'true');

      const res = await fetch('/api/contact', { method: 'POST', body: fd });
      const data = await res.json() as { publicRequestNumber?: string; portalClaimUrl?: string; error?: string };

      if (!res.ok || !data.publicRequestNumber) {
        throw new Error(data.error ?? 'Fehler beim Senden.');
      }

      setRequestNumber(data.publicRequestNumber);
      setPortalClaimUrl(data.portalClaimUrl ?? '');
      setDone(true);
      onSuccess?.(data.publicRequestNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Senden.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-[20px] border border-[#B8643E]/30 bg-[#FDF7F0] p-4 shadow-sm animate-in fade-in duration-500">
        <p className="text-[13px] font-bold text-[#0E1A2B]">Neue Anfrage registriert</p>
        <div className="mt-3 rounded-[12px] border border-[#E7DDD3] bg-white px-4 py-3 text-center">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#72665D]">Anfragenummer</p>
          <p className="text-xl font-black tracking-widest text-[#0E1A2B]">{requestNumber}</p>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-[#72665D]">
          Sie koennen den Status verfolgen oder den Zugang zum Kundenportal ueber die Portal-Verknuepfung vorbereiten.
        </p>
        {portalClaimUrl && (
          <a
            href={portalClaimUrl}
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0E1A2B] hover:underline"
          >
            Kundenportal vorbereiten →
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-[20px] border border-[#B8643E]/20 bg-[#FDF7F0] p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#B8643E]/10">
          <svg className="h-3.5 w-3.5 text-[#B8643E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-[13px] font-bold text-[#0E1A2B]">Neue Anfrage bestaetigen</p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-[12px] bg-white/75 px-3 py-3 text-[12px] text-[#72665D]">
        <p>
          Kontakt: <span className="font-semibold text-[#0E1A2B]">{hasContact ? 'vorhanden' : 'fehlt'}</span>
        </p>
        <p>
          Name: <span className="font-semibold text-[#0E1A2B]">{hasName ? 'vorhanden' : 'optional'}</span>
        </p>
        <p>
          Standort: <span className="font-semibold text-[#0E1A2B]">{hasLocation ? 'vorhanden' : 'optional'}</span>
        </p>
        <p>
          Anliegen: <span className="font-semibold text-[#0E1A2B]">{hasSummary ? 'erfasst' : 'kurz beschreiben'}</span>
        </p>
        {prefill?.hasSessionAttachments && (
          <p className="col-span-2">Chat-Dateien werden mit dieser Anfrage verbunden.</p>
        )}
      </div>

      {shouldShowContactInput && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-[#72665D]">
            Kontakt *
          </label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            onBlur={() => void saveDraft()}
            placeholder="+49 ... oder name@example.com"
            className="w-full rounded-[12px] border border-[#E7DDD3] bg-white px-3 py-2 text-[13px] text-[#0E1A2B] placeholder-[#72665D]/40 focus:border-[#B8643E] focus:outline-none"
          />
        </div>
      )}

      {(shouldShowNameInput || shouldShowLocationInput) && (
        <div className="grid gap-2 sm:grid-cols-2">
          {shouldShowNameInput && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => void saveDraft()}
              placeholder="Ihr Name (optional)"
              className="w-full rounded-[12px] border border-[#E7DDD3] bg-white px-3 py-2 text-[13px] text-[#0E1A2B] placeholder-[#72665D]/40 focus:border-[#B8643E] focus:outline-none"
            />
          )}
          {shouldShowLocationInput && (
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={() => void saveDraft()}
              placeholder="Adresse / Standort (optional)"
              className="w-full rounded-[12px] border border-[#E7DDD3] bg-white px-3 py-2 text-[13px] text-[#0E1A2B] placeholder-[#72665D]/40 focus:border-[#B8643E] focus:outline-none"
            />
          )}
        </div>
      )}

      <p className="rounded-[10px] bg-white/70 px-3 py-2 text-[12px] leading-relaxed text-[#72665D]">
        Fuer wiederkehrende Kunden ist ein persoenliches Konto geplant, damit alle Anfragen und Nachrichten an einem Ort sichtbar sind.
      </p>

      {error && <p className="rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-600">{error}</p>}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => void handleConfirm()}
          disabled={submitting}
          className="flex-1 rounded-[14px] bg-[#0E1A2B] py-2.5 text-[13px] font-bold text-white transition-all hover:bg-[#1a2e47] active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? 'Wird gesendet ...' : 'Anfrage senden'}
        </button>
        <button
          type="button"
          onClick={onEditContact}
          className="rounded-[14px] border border-[#E7DDD3] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#72665D] transition-colors hover:border-[#B8643E]"
        >
          Details bearbeiten
        </button>
      </div>
    </div>
  );
}
