'use client';

import React, { useState } from 'react';

type ContactMode = 'phone' | 'email';

const ISSUE_TYPES = [
  'Reparatur',
  'Montage',
  'Neue Beschilderung',
  'Branding',
  'Lichterwerbung',
  'Wartung',
  'Sonstiges',
] as const;

export type IntakePrefill = {
  issueType?: string;
  contact?: string;
  contactMode?: ContactMode;
  summary?: string;
  hasSessionAttachments?: boolean;
  needsPhoto?: boolean;
  hasKnownSessionContact?: boolean;
};

type Props = {
  prefill?: IntakePrefill;
  onSuccess?: (requestNumber: string) => void;
};

export default function ChatIntakeCard({ prefill, onSuccess }: Props) {
  const [contactMode, setContactMode] = useState<ContactMode>(prefill?.contactMode ?? 'phone');
  const [contact, setContact] = useState(prefill?.contact ?? '');
  const [name, setName] = useState('');
  const [issueType, setIssueType] = useState(prefill?.issueType ?? '');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [requestNumber, setRequestNumber] = useState('');
  const fileRef = React.useRef<HTMLInputElement>(null);

  if (done) {
    return (
      <div className="rounded-[20px] border border-[#B8643E]/30 bg-[#FDF7F0] p-4 shadow-sm animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#B8643E]/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#B8643E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-[13px] font-bold text-[#0E1A2B]">Anfrage erfolgreich registriert</p>
        </div>
        <div className="rounded-[12px] bg-white border border-[#E7DDD3] px-4 py-3 mb-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#72665D] mb-1">Ihre Anfragenummer</p>
          <p className="text-xl font-black tracking-widest text-[#0E1A2B]">{requestNumber}</p>
        </div>
        <p className="text-[12px] text-[#72665D] leading-relaxed">
          Speichern Sie diese Nummer. Ein Spezialist wird sich in Kürze bei Ihnen melden.
        </p>
        <a
          href={`/de/status?request=${encodeURIComponent(requestNumber)}`}
          className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#B8643E] hover:underline"
        >
          Status verfolgen →
        </a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) { setError('Bitte geben Sie eine Kontaktinformation an.'); return; }
    setSubmitting(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('contact', contact);
      fd.append(
        'message',
        prefill?.summary
          ? `Chat-Anfrage. Typ: ${issueType || 'Nicht angegeben'}\n\n${prefill.summary}`
          : `Chat-Anfrage. Typ: ${issueType || 'Nicht angegeben'}`
      );
      fd.append('issueType', issueType);
      fd.append('isFromChat', 'true');
      files.forEach(f => fd.append('files', f));

      const res = await fetch('/api/contact', { method: 'POST', body: fd });
      const data = await res.json() as { publicRequestNumber?: string; error?: string };

      if (!res.ok || !data.publicRequestNumber) {
        throw new Error(data.error ?? 'Fehler beim Senden.');
      }

      setRequestNumber(data.publicRequestNumber);
      setDone(true);
      onSuccess?.(data.publicRequestNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Senden.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[20px] border border-[#B8643E]/20 bg-[#FDF7F0] p-3.5 shadow-sm space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-400"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#B8643E]/10 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-[#B8643E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-[13px] font-bold text-[#0E1A2B]">Anfrage erstellen</p>
      </div>

      {prefill?.hasSessionAttachments && (
        <p className="rounded-[10px] bg-white/70 px-3 py-2 text-[12px] text-[#72665D]">
          Bereits im Chat gesendete Dateien werden mit dieser Anfrage verbunden.
        </p>
      )}

      {prefill?.needsPhoto && (
        <p className="rounded-[10px] bg-white/70 px-3 py-2 text-[12px] text-[#72665D]">
          Ein Foto oder kurzes Video ist optional, hilft aber bei der Diagnose.
        </p>
      )}

      {/* Issue type */}
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wide text-[#72665D] mb-1 block">Art der Anfrage</label>
        <select
          value={issueType}
          onChange={e => setIssueType(e.target.value)}
          className="w-full px-3 py-2 text-[13px] rounded-[12px] border border-[#E7DDD3] bg-white text-[#0E1A2B] focus:outline-none focus:border-[#B8643E] appearance-none"
        >
          <option value="">Bitte wählen …</option>
          {ISSUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Contact toggle */}
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wide text-[#72665D] mb-1 block">Kontakt *</label>
        <div className="flex gap-2 mb-2">
          {(['phone', 'email'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setContactMode(m)}
              className={`flex-1 py-1.5 rounded-[10px] text-[12px] font-semibold border transition-all ${
                contactMode === m
                  ? 'bg-[#0E1A2B] text-white border-[#0E1A2B]'
                  : 'bg-white text-[#72665D] border-[#E7DDD3] hover:border-[#B8643E]'
              }`}
            >
              {m === 'phone' ? '📱 Telefon' : '✉️ E-Mail'}
            </button>
          ))}
        </div>
        <input
          type={contactMode === 'email' ? 'email' : 'tel'}
          value={contact}
          onChange={e => setContact(e.target.value)}
          placeholder={contactMode === 'phone' ? '+49 …' : 'name@example.com'}
          className="w-full px-3 py-2 text-[13px] rounded-[12px] border border-[#E7DDD3] bg-white text-[#0E1A2B] focus:outline-none focus:border-[#B8643E] placeholder-[#72665D]/40"
        />
      </div>

      {/* Name optional */}
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Ihr Name (optional)"
        className="w-full px-3 py-2 text-[13px] rounded-[12px] border border-[#E7DDD3] bg-white text-[#0E1A2B] focus:outline-none focus:border-[#B8643E] placeholder-[#72665D]/40"
      />

      {/* File attach */}
      <div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 text-[12px] text-[#72665D] hover:text-[#B8643E] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          Foto/Video anhängen
        </button>
        <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden"
          onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files ?? [])])} />
        {files.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {files.map((f, i) => (
              <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/5 text-[11px] text-[#72665D]">
                {f.name.slice(0, 20)}
                <button type="button" onClick={() => setFiles(p => p.filter((_, j) => j !== i))} className="text-black/40 hover:text-black/70">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-[12px] text-red-600 rounded-[10px] bg-red-50 px-3 py-2">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 rounded-[14px] bg-[#0E1A2B] hover:bg-[#1a2e47] text-white text-[13px] font-bold transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting
          ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          : 'Anfrage senden →'}
      </button>
    </form>
  );
}
