'use client';

import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
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

const chatGateFallbackCopy = {
  de: {
    title: 'Chat im Kundenportal öffnen',
    body: 'Damit Korrespondenz, Dokumente und nächste Schritte sicher sichtbar werden, müssen Sie sich registrieren und den Zugriff verifizieren. Danach bleiben Chat und Serviceverlauf an einem Ort.',
    primary: 'Zum Portal',
    secondary: 'Später',
  },
  en: {
    title: 'Open chat in your portal',
    body: 'To show messages, documents, and next steps safely, you need to register and verify access. After login, the chat and service history stay in one place.',
    primary: 'Go to portal',
    secondary: 'Later',
  },
  ru: {
    title: 'Откройте чат в личном кабинете',
    body: 'Чтобы безопасно показать переписку, документы и следующие шаги по заявке, нужно зарегистрироваться и подтвердить доступ. После входа чат и история сервиса будут в одном месте.',
    primary: 'Перейти в кабинет',
    secondary: 'Позже',
  },
  tr: {
    title: 'Sohbeti müşteri portalında açın',
    body: 'Mesajları, belgeleri ve sonraki adımları güvenli şekilde gösterebilmek için kayıt olmanız ve erişimi doğrulamanız gerekir. Girişten sonra sohbet ve servis geçmişi tek yerde kalır.',
    primary: 'Portala git',
    secondary: 'Daha sonra',
  },
  pl: {
    title: 'Otwórz chat w panelu klienta',
    body: 'Aby bezpiecznie pokazać wiadomości, dokumenty i kolejne kroki zgłoszenia, musisz się zarejestrować i potwierdzić dostęp. Po zalogowaniu chat i historia serwisu będą w jednym miejscu.',
    primary: 'Przejdź do panelu',
    secondary: 'Później',
  },
  ar: {
    title: 'افتح الدردشة داخل بوابة العميل',
    body: 'لعرض المراسلات والمستندات والخطوات التالية بأمان، يجب التسجيل وتأكيد الوصول. بعد تسجيل الدخول ستبقى الدردشة وسجل الخدمة في مكان واحد.',
    primary: 'الانتقال إلى البوابة',
    secondary: 'لاحقاً',
  },
} as const;

const progressWidthByStatus: Record<string, string> = {
  READY_FOR_PICKUP: '100%',
  COMPLETED: '100%',
  CANCELLED: '100%',
  IN_PROGRESS: '60%',
  UNDER_REVIEW: '30%',
};

export default function StatusLookup({
  initialRequestNumber = '',
  initialAccessToken = '',
  cmsContent,
}: {
  initialRequestNumber?: string;
  initialAccessToken?: string;
  cmsContent?: StatusCmsContent | null;
}) {
  const t = useTranslations('StatusPage');
  const locale = useLocale();
  const chatGateFallback =
    chatGateFallbackCopy[locale as keyof typeof chatGateFallbackCopy] ?? chatGateFallbackCopy.de;
  const [requestNumber, setRequestNumber] = useState(initialRequestNumber);
  const [contact, setContact] = useState('');
  const [result, setResult] = useState<PublicStatusCase | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [helperMessage, setHelperMessage] = useState('');
  const [isChatPromptOpen, setIsChatPromptOpen] = useState(false);

  const translatedStatusLabel = result
    ? t.has(`status_values.${result.status}.label`)
      ? t(`status_values.${result.status}.label`)
      : result.statusLabel
    : '';
  const chatGateTitle = t.has('chat_gate_title')
    ? t('chat_gate_title')
    : chatGateFallback.title;
  const chatGateBody = t.has('chat_gate_body')
    ? t('chat_gate_body')
    : chatGateFallback.body;
  const chatGatePrimary = t.has('chat_gate_primary')
    ? t('chat_gate_primary')
    : chatGateFallback.primary;
  const chatGateSecondary = t.has('chat_gate_secondary')
    ? t('chat_gate_secondary')
    : chatGateFallback.secondary;
  const chatSessionHint = t.has('chat_session_hint')
    ? t('chat_session_hint')
    : t('chat_auth_hint');
  const isCancelled = result?.status === 'CANCELLED';
  const progressWidth = result
    ? progressWidthByStatus[result.status] ?? '10%'
    : '10%';
  const badgeToneClass = isCancelled
    ? 'bg-red-50 border-red-200 text-red-800'
    : 'bg-[#F7F1E8] border-[#E5D8C9] text-[#8A6048]';
  const statusDotClass = isCancelled
    ? 'bg-red-500 shadow-[0_0_8px_#EF4444]'
    : 'bg-[#10B981] shadow-[0_0_8px_#10B981]';
  const progressBarClass = isCancelled
    ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.55)]'
    : 'bg-[#C26E45] shadow-[0_0_12px_rgba(194,110,69,0.6)]';
  const diagnosticsActive = !!result && ['UNDER_REVIEW', 'IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED'].includes(result.status);
  const repairingActive = !!result && ['IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED'].includes(result.status);
  const deliveryActive = !!result && ['READY_FOR_PICKUP', 'COMPLETED'].includes(result.status);

  async function lookupStatus(payload?: {
    requestNumber?: string;
    contact?: string;
    access?: string;
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
          access: payload?.access ?? '',
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
      access: initialAccessToken,
    }, { silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRequestNumber, initialAccessToken]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await lookupStatus({
      requestNumber,
      contact,
    });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-2 lg:h-[calc(100vh-160px)] flex items-center min-h-[550px]">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] bg-white rounded-[32px] overflow-hidden shadow-2xl border border-black/5 h-full w-full">
        {/* --- LEFT COLUMN: Portal CTA --- */}
        <div className="bg-[#0A111F] text-white p-6 sm:p-8 flex flex-col relative overflow-hidden h-full">
          {/* Background Ambient Glow */}
          <div className="absolute top-[-20%] left-[-10%] w-full h-full bg-[radial-gradient(circle,rgba(194,110,69,0.12)_0%,transparent_70%)] pointer-events-none" />

          {/* Marketing Cabinet Block */}
          <div className="relative z-10 flex-1 bg-white/[0.035] border border-white/10 rounded-[24px] p-5 sm:p-6 flex flex-col shadow-2xl shadow-black/10">
            <div className="mb-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#F6C7A7] mb-4">
                <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                {t('cabinet_title')}
              </div>
              <h1 className="font-sans text-[30px] sm:text-[38px] lg:text-[44px] font-black leading-[1.02] mb-4">
                {t('cabinet_title')}
              </h1>
              <p className="text-[14px] sm:text-[15px] text-white/62 leading-relaxed">{t('cabinet_description')}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                t('cabinet_items.documents'),
                t('cabinet_items.payment'),
                t('cabinet_items.history'),
                t('cabinet_items.chat')
              ].map((item) => (
                <div key={item} className="bg-white/[0.055] border border-white/10 rounded-xl p-3 min-h-[86px] flex flex-col gap-2 hover:bg-white/[0.09] transition-all group">
                  <div className="w-7 h-7 rounded-lg bg-[#C26E45]/12 text-[#C26E45] flex items-center justify-center group-hover:bg-[#C26E45]/20 transition-colors">
                    <div className="w-3.5 h-3.5 border-[1.5px] border-current rounded-sm opacity-70" />
                  </div>
                  <span className="text-[11px] sm:text-[13px] font-bold leading-tight">{item}</span>
                </div>
              ))}
            </div>

            <Link href="/portal" className="mt-auto w-full bg-[#C26E45] hover:bg-[#A65835] text-white font-bold py-3 text-[14px] rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#C26E45]/10">
              {t('cabinet_link')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Status & Chat Preview --- */}
        <div className="bg-[#FAF9F6] p-6 sm:p-8 flex flex-col gap-5 relative min-h-[620px] lg:h-full">
          <div className="rounded-[24px] border border-[#E5D8C9] bg-white p-4 sm:p-5 shadow-sm">
            <div className={`inline-flex w-fit items-center gap-2 border px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${badgeToneClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusDotClass}`} />
              {result ? translatedStatusLabel : (cmsContent?.badge ?? t('badge'))}
            </div>

            <h2 className="font-sans text-[22px] sm:text-[28px] font-black leading-tight text-[#0A111F] mb-3">
              {cmsContent?.title ?? t('title')}
            </h2>

            {result ? (
              <div className="bg-gradient-to-br from-[#162135] to-[#0D1424] border border-black/5 rounded-[18px] p-4 shadow-xl relative overflow-hidden">
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div className="flex min-w-0 flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                      {t('request_number_label')}
                    </label>
                    <div className="font-sans text-[18px] sm:text-[22px] font-black tracking-widest text-white truncate">
                      {result.publicRequestNumber}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden relative">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${progressBarClass}`}
                      style={{ width: progressWidth }}
                    />
                  </div>
                  <div className="flex justify-between text-[8px] sm:text-[9px] font-bold uppercase tracking-tighter text-white/30">
                    <span className={result.status !== 'DRAFT' && !isCancelled ? 'text-white' : ''}>{t('progress_steps.accepted')}</span>
                    <span className={diagnosticsActive ? 'text-white' : ''}>{t('progress_steps.diagnostics')}</span>
                    <span className={repairingActive ? 'text-white' : ''}>{t('progress_steps.repairing')}</span>
                    <span className={deliveryActive ? 'text-white' : ''}>{t('progress_steps.delivery')}</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  id="status-request-number"
                  name="requestNumber"
                  value={requestNumber}
                  onChange={(e) => setRequestNumber(e.target.value.toUpperCase())}
                  aria-label={t('request_number_field')}
                  placeholder={t('request_placeholder')}
                  className="w-full bg-[#FAF9F6] border border-[#E5D8C9] rounded-xl px-5 py-3.5 text-[15px] text-[#0A111F] outline-none focus:border-[#C26E45] transition-all"
                />
                <input
                  id="status-contact"
                  name="contact"
                  type="text"
                  autoCapitalize="none"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  aria-label={t('contact_field')}
                  placeholder={t.has('contact_placeholder') ? t('contact_placeholder') : 'E-Mail oder Telefon'}
                  className="w-full bg-[#FAF9F6] border border-[#E5D8C9] rounded-xl px-5 py-3.5 text-[15px] text-[#0A111F] outline-none focus:border-[#C26E45] transition-all"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C26E45] hover:bg-[#A65835] text-white font-bold px-7 py-3.5 text-[15px] rounded-xl transition-all shadow-lg disabled:opacity-60"
                >
                  {isSubmitting ? t('submit_loading') : t('submit')}
                </button>
              </form>
            )}

            {errorMessage && (
              <p className="mt-2 text-red-600 text-[12px] font-medium leading-tight animate-shake">{errorMessage}</p>
            )}
            {helperMessage && (
              <p className="mt-2 text-emerald-700 text-[12px] font-medium leading-tight">{helperMessage}</p>
            )}
          </div>

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
              <button
                type="button"
                onClick={() => {
                  if (result) {
                    window.dispatchEvent(new Event('openChat'));
                    return;
                  }

                  setIsChatPromptOpen(true);
                }}
                className="bg-white border border-black/10 px-8 py-4 rounded-full font-bold text-[14px] shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform active:scale-95"
              >
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
            {result ? chatSessionHint : t('chat_auth_hint')}
          </p>
        </div>
      </div>

      {isChatPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A111F]/60 px-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-[24px] bg-white p-6 text-[#0A111F] shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7F1E8] text-[#C26E45]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h3 className="mb-2 font-sans text-[24px] font-black leading-tight">{chatGateTitle}</h3>
            <p className="mb-5 text-[14px] leading-relaxed text-[#64748B]">{chatGateBody}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/portal" className="flex-1 rounded-xl bg-[#C26E45] px-5 py-3 text-center text-[14px] font-bold text-white transition-colors hover:bg-[#A65835]">
                {chatGatePrimary}
              </Link>
              <button
                type="button"
                onClick={() => setIsChatPromptOpen(false)}
                className="flex-1 rounded-xl border border-black/10 px-5 py-3 text-[14px] font-bold text-[#0A111F] transition-colors hover:bg-black/[0.03]"
              >
                {chatGateSecondary}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
