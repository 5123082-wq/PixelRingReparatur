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

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

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
  const [verifiedVia, setVerifiedVia] = useState<'session' | 'contact' | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [helperMessage, setHelperMessage] = useState('');
  const safeHints = cmsContent?.safeHints?.length ? cmsContent.safeHints : [
    t('safe_hint_1'),
    t('safe_hint_2'),
    t('safe_hint_3'),
  ];

  const translatedStatusLabel = result
    ? t.has(`status_values.${result.status}.label`)
      ? t(`status_values.${result.status}.label`)
      : result.statusLabel
    : '';
  const translatedStatusDescription = result
    ? t.has(`status_values.${result.status}.description`)
      ? t(`status_values.${result.status}.description`)
      : result.statusDescription
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
        setVerifiedVia(null);
        if (!options?.silent) {
          const failure = data as Extract<StatusLookupResponse, { verified: false }>;
          setErrorMessage(failure.message);
        }
        return;
      }

      setResult(data.case);
      setVerifiedVia(data.verifiedVia);
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
      setIsLoading(false);
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

  const handleReset = () => {
    setResult(null);
    setVerifiedVia(null);
    setErrorMessage('');
    setHelperMessage('');
    setContact('');
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-8 items-start">
        <div className="relative overflow-hidden rounded-[32px] bg-[#0D1B2A] text-white border border-white/10 p-8 sm:p-10">
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.8),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(184,100,62,0.6),_transparent_30%)]" />
          <div className="relative z-10 flex flex-col gap-6">
            <div className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.24em] text-white/80">
              {cmsContent?.badge ?? t('badge')}
            </div>
            <div className="flex flex-col gap-4 max-w-2xl">
              <h1 className="text-[34px] sm:text-[46px] font-black tracking-tight leading-[1.05]">
                {cmsContent?.title ?? t('title')}
              </h1>
              <p className="text-white/70 text-[16px] sm:text-[18px] leading-relaxed max-w-xl">
                {cmsContent?.intro ?? t('intro')}
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {safeHints.map((hint) => (
                <div
                  key={hint}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-[13px] leading-relaxed text-white/80"
                >
                  {hint}
                </div>
              ))}
            </div>

            <div className="rounded-[24px] border border-[#B8643E]/20 bg-[#B8643E]/10 px-5 py-4 text-[14px] text-white/85">
              {cmsContent?.restoreHint ?? t('restore_hint')}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-[#E7DDD3] bg-white p-6 sm:p-8 shadow-[0_24px_80px_-32px_rgba(13,27,42,0.35)]">
          {result ? (
            <div className="flex flex-col gap-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="inline-flex w-fit items-center rounded-full bg-[#F7F1E8] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#72665D]">
                    {t('verified_via', {
                      method:
                        verifiedVia === 'session'
                          ? t('verified_via_session')
                          : t('verified_via_contact'),
                    })}
                  </div>
                  <h2 className="text-[26px] font-black text-[#0E1A2B] leading-tight">
                    {translatedStatusLabel}
                  </h2>
                  {helperMessage ? (
                    <p className="text-[14px] leading-relaxed text-[#72665D]">
                      {helperMessage}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full border border-[#E7DDD3] px-4 py-2 text-[13px] font-semibold text-[#72665D] transition-colors hover:border-[#B8643E] hover:text-[#B8643E]"
                >
                  {t('lookup_another')}
                </button>
              </div>

              <div className="rounded-[24px] border border-[#E7DDD3] bg-[#F7F1E8]/70 p-5">
                <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#72665D]">
                  {t('request_number_label')}
                </div>
                <div className="mt-2 text-[30px] font-black tracking-[0.18em] text-[#0E1A2B]">
                  {result.publicRequestNumber}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-[#E7DDD3] p-5">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#72665D]">
                    {t('current_stage_label')}
                  </div>
                  <div className="mt-2 text-[18px] font-bold text-[#0E1A2B]">
                    {translatedStatusLabel}
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#72665D]">
                    {translatedStatusDescription}
                  </p>
                </div>

                <div className="rounded-[24px] border border-[#E7DDD3] p-5">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#72665D]">
                    {t('activity_label')}
                  </div>
                  <div className="mt-2 text-[14px] leading-relaxed text-[#0E1A2B]">
                    {t('created_at', { date: formatDate(result.createdAt) })}
                  </div>
                  <div className="mt-2 text-[14px] leading-relaxed text-[#0E1A2B]">
                    {t('updated_at', { date: formatDate(result.updatedAt) })}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#B8643E]/20 bg-[#B8643E]/8 px-5 py-4 text-[14px] text-[#0E1A2B]">
                {t('privacy_notice')}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <h2 className="text-[24px] sm:text-[28px] font-black text-[#0E1A2B] leading-tight">
                  {t('form_title')}
                </h2>
                <p className="text-[14px] leading-relaxed text-[#72665D]">
                  {t('form_description')}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#72665D]">
                    {t('request_number_field')}
                  </span>
                  <input
                    value={requestNumber}
                    onChange={(event) =>
                      setRequestNumber(event.target.value.toUpperCase())
                    }
                    autoComplete="off"
                    inputMode="text"
                    placeholder={t('request_placeholder')}
                    className="w-full rounded-2xl border border-[#E7DDD3] bg-[#F7F1E8]/70 px-4 py-3 text-[15px] text-[#0E1A2B] outline-none transition-colors placeholder:text-[#72665D]/35 focus:border-[#B8643E] focus:bg-white"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#72665D]">
                    {t('contact_field')}
                  </span>
                  <input
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    autoComplete="off"
                    placeholder={t('contact_placeholder')}
                    className="w-full rounded-2xl border border-[#E7DDD3] bg-[#F7F1E8]/70 px-4 py-3 text-[15px] text-[#0E1A2B] outline-none transition-colors placeholder:text-[#72665D]/35 focus:border-[#B8643E] focus:bg-white"
                  />
                </label>
              </div>

              <div className="rounded-[24px] border border-dashed border-[#E7DDD3] bg-[#FCF9F4] px-4 py-4 text-[13px] leading-relaxed text-[#72665D]">
                {t('cookie_restore_hint')}
              </div>

              {helperMessage ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[14px] text-emerald-900">
                  {helperMessage}
                </div>
              ) : null}

              {errorMessage ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[14px] text-amber-950">
                  {errorMessage}
                </div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="inline-flex items-center justify-center rounded-full bg-[#B8643E] px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#A65835] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? t('submit_loading') : t('submit')}
                </button>
                {requestNumber ? (
                  <Link
                    href={`/status?request=${encodeURIComponent(requestNumber)}`}
                    className="inline-flex items-center justify-center rounded-full border border-[#E7DDD3] px-6 py-3.5 text-[15px] font-semibold text-[#72665D] transition-colors hover:border-[#B8643E] hover:text-[#B8643E]"
                  >
                    {t('use_request_number')}
                  </Link>
                ) : null}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
