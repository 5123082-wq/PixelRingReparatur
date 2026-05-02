'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

type PublicStatusCase = {
  publicRequestNumber: string;
  status: string;
  statusLabel: string;
  statusDescription: string;
  createdAt: string;
  updatedAt: string;
  verifiedVia: 'session' | 'contact';
};

type StatusLookupResponse =
  | {
      verified: true;
      verifiedVia: 'session' | 'contact';
      case: PublicStatusCase;
    }
  | {
      verified: false;
      verificationRequired: true;
      message: string;
    };

type StatusCmsContent = {
  badge?: string;
  title?: string;
  intro?: string;
  safeHints?: string[];
  restoreHint?: string;
};

export default function StatusLookup({
  initialRequestNumber = '',
  cmsContent,
}: {
  initialRequestNumber?: string;
  cmsContent?: StatusCmsContent | null;
}) {
  const t = useTranslations('StatusPage');
  const [requestNumber, setRequestNumber] = useState(initialRequestNumber);
  const [contact, setContact] = useState('');
  const [result, setResult] = useState<PublicStatusCase | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [helperMessage, setHelperMessage] = useState('');

  const translatedStatusLabel = result
    ? t.has(`status_values.${result.status}.label`)
      ? t(`status_values.${result.status}.label`)
      : result.statusLabel
    : '';

  async function lookupStatus(payload?: {
    requestNumber?: string;
    contact?: string;
  }, options?: { silent?: boolean }) {
    setIsSubmitting(true);
    setErrorMessage('');
    setHelperMessage('');

    try {
      const response = await fetch('/api/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestNumber: payload?.requestNumber ?? requestNumber,
          contact: payload?.contact ?? contact,
        }),
      });

      const data = (await response.json()) as StatusLookupResponse;

      if (!response.ok || !data.verified) {
        setResult(null);
        if (!options?.silent) {
          const failure = data as Extract<StatusLookupResponse, { verified: false }>;
          setErrorMessage(failure.message);
        }
        return;
      }

      setResult(data.case);
      setHelperMessage(
        data.verifiedVia === 'session'
          ? t('access_restored')
          : t('contact_verified')
      );
      setContact('');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t('lookup_error')
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    void lookupStatus({
      requestNumber: initialRequestNumber,
      contact: '',
    }, { silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRequestNumber]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await lookupStatus({
      requestNumber,
      contact,
    });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-2 lg:h-[calc(100vh-160px)] flex items-center min-h-[550px]">
      <div className="grid lg:grid-cols-[1fr_0.8fr] bg-white rounded-[32px] overflow-hidden shadow-2xl border border-black/5 h-full w-full">
        {/* --- LEFT COLUMN: Status & Marketing --- */}
        <div className="bg-[#0A111F] text-white p-6 sm:p-8 flex flex-col relative overflow-hidden h-full">
          {/* Background Ambient Glow */}
          <div className="absolute top-[-20%] left-[-10%] w-full h-full bg-[radial-gradient(circle,rgba(194,110,69,0.12)_0%,transparent_70%)] pointer-events-none" />

          {/* Status Section (The "Red Square" Area) */}
          <div className="relative z-10 mb-3 h-[224px] p-3 rounded-[20px] border border-red-500/35 bg-red-500/[0.02] flex flex-col">
            <div className="inline-flex w-fit items-center gap-2 bg-white/5 border border-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full shadow-[0_0_8px_#10B981] animate-pulse" />
              {result ? translatedStatusLabel : (cmsContent?.badge ?? t('badge'))}
            </div>

            <h1 className="font-sans text-[18px] sm:text-[20px] font-extrabold leading-tight mb-2">
              {cmsContent?.title ?? t('title')}
            </h1>

            {result ? (
              <div className="bg-gradient-to-br from-[#162135] to-[#0D1424] border border-white/10 rounded-[18px] p-3 shadow-xl relative overflow-hidden">
                <div className="flex items-end justify-between gap-4 mb-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                      {t('request_number_label')}
                    </label>
                    <div className="font-sans text-[18px] sm:text-[22px] font-black tracking-widest text-white truncate">
                      {result.publicRequestNumber}
                    </div>
                  </div>
                </div>

                {/* Compact Progress Bar */}
                <div className="flex flex-col gap-2">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-[#C26E45] rounded-full shadow-[0_0_12px_rgba(194,110,69,0.6)] transition-all duration-1000"
                      style={{
                        width: (result.status === 'READY_FOR_PICKUP' || result.status === 'COMPLETED') ? '100%' :
                               result.status === 'IN_PROGRESS' ? '60%' :
                               result.status === 'UNDER_REVIEW' ? '30%' : '10%'
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[8px] sm:text-[9px] font-bold uppercase tracking-tighter text-white/30">
                    <span className={result.status !== 'DRAFT' ? 'text-white' : ''}>{t('progress_steps.accepted')}</span>
                    <span className={['UNDER_REVIEW', 'IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED'].includes(result.status) ? 'text-white' : ''}>{t('progress_steps.diagnostics')}</span>
                    <span className={['IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED'].includes(result.status) ? 'text-white' : ''}>{t('progress_steps.repairing')}</span>
                    <span className={['READY_FOR_PICKUP', 'COMPLETED'].includes(result.status) ? 'text-white' : ''}>{t('progress_steps.delivery')}</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-end gap-3">
                <input
                  value={requestNumber}
                  onChange={(e) => setRequestNumber(e.target.value.toUpperCase())}
                  placeholder={t('request_placeholder')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-[15px] text-white outline-none focus:border-[#C26E45] transition-all"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C26E45] hover:bg-[#A65835] text-white font-bold py-3.5 text-[15px] rounded-xl transition-all shadow-lg"
                >
                  {isSubmitting ? t('submit_loading') : t('submit')}
                </button>
              </form>
            )}

            {errorMessage && (
              <p className="mt-1.5 text-red-400 text-[12px] font-medium leading-tight animate-shake">{errorMessage}</p>
            )}
            {helperMessage && (
              <p className="mt-1.5 text-emerald-400 text-[12px] font-medium leading-tight">{helperMessage}</p>
            )}
          </div>

          {/* Marketing Cabinet Block */}
          <div className="relative z-10 flex-1 bg-white/[0.035] border border-white/10 rounded-[24px] p-4 flex flex-col shadow-2xl shadow-black/10">
            <div className="mb-4">
              <h3 className="font-sans text-[20px] sm:text-[24px] font-extrabold flex items-center gap-3 mb-1">
                <svg className="text-[#C26E45] shrink-0" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                {t('cabinet_title')}
              </h3>
              <p className="text-[12px] sm:text-[13px] text-white/55 leading-relaxed">{t('cabinet_description')}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: 'document', label: t('cabinet_items.documents') },
                { icon: 'payment', label: t('cabinet_items.payment') },
                { icon: 'history', label: t('cabinet_items.history') },
                { icon: 'chat', label: t('cabinet_items.chat') }
              ].map((item) => (
                <div key={item.label} className="bg-white/[0.055] border border-white/10 rounded-xl p-3 min-h-[72px] flex flex-col gap-2 hover:bg-white/[0.09] transition-all group">
                  <div className="w-7 h-7 rounded-lg bg-[#C26E45]/12 text-[#C26E45] flex items-center justify-center group-hover:bg-[#C26E45]/20 transition-colors">
                    <div className="w-3.5 h-3.5 border-[1.5px] border-current rounded-sm opacity-70" />
                  </div>
                  <span className="text-[11px] sm:text-[12px] font-bold leading-tight">{item.label}</span>
                </div>
              ))}
            </div>

            <Link href="/portal" className="mt-auto w-full bg-[#C26E45] hover:bg-[#A65835] text-white font-bold py-3 text-[14px] rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#C26E45]/10">
              {t('cabinet_link')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Chat Preview --- */}
        <div className="bg-[#FAF9F6] p-6 sm:p-8 flex flex-col relative min-h-[500px] lg:h-full">
          <header className="flex items-center justify-between mb-4">
            <h3 className="font-sans text-[20px] font-extrabold text-[#0A111F]">{t('chat_header')}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-[#10B981] uppercase tracking-widest">{t('chat_online')}</span>
              <span className="w-2 h-2 bg-[#10B981] rounded-full shadow-[0_0_8px_#10B981] animate-pulse" />
            </div>
          </header>

          <div className="flex-1 flex flex-col gap-4 relative overflow-hidden">
            {/* Blurred Messages */}
            <div className="flex flex-col gap-4 filter blur-[6px] opacity-40 select-none pointer-events-none">
              <div className="bg-white border border-black/5 p-4 rounded-[18px] rounded-bl-sm self-start max-w-[85%] shadow-sm text-[14px] leading-relaxed">
                <span className="text-[9px] font-extrabold text-[#C26E45] uppercase tracking-wider mb-2 block">{t('chat_manager')}</span>
                {t('chat_messages.welcome')}
              </div>
              <div className="bg-[#0A111F] text-white p-4 rounded-[18px] rounded-br-sm self-end max-w-[85%] shadow-sm text-[14px] leading-relaxed">
                <span className="text-[9px] font-extrabold text-white/40 uppercase tracking-wider mb-2 block">{t('chat_you')}</span>
                {t('chat_messages.question')}
              </div>
              <div className="bg-white border border-black/5 p-4 rounded-[18px] rounded-bl-sm self-start max-w-[85%] shadow-sm text-[14px] leading-relaxed">
                <span className="text-[9px] font-extrabold text-[#C26E45] uppercase tracking-wider mb-2 block">{t('chat_manager')}</span>
                {t('chat_messages.answer')}
              </div>
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <button className="bg-white border border-black/10 px-8 py-4 rounded-full font-bold text-[14px] shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform active:scale-95">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                {t('chat_open_button')}
              </button>
            </div>
          </div>

          <div className="mt-3 bg-white border border-black/5 rounded-full px-6 py-2.5 flex items-center justify-between text-[#64748B] text-[13px] opacity-50 shadow-inner">
            {t('chat_placeholder')}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </div>
          <p className="text-center text-[10px] text-[#64748B]/60 mt-2 font-medium italic">
            {t('chat_auth_hint')}
          </p>
        </div>
      </div>
    </section>
  );
}
