'use client';

import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import type { FormEvent } from 'react';
import { useState } from 'react';

export default function PortalDemoGate({
  demoEnabled,
  demoEmail,
}: {
  demoEnabled: boolean;
  demoEmail: string;
}) {
  const t = useTranslations('Portal');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/portal/demo-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        setMessage(t('gate.error'));
        return;
      }

      router.refresh();
    } catch {
      setMessage(t('gate.error'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F4EEE5] px-4 py-6 text-[#121826] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[28px] border border-[#E4D8CA] bg-white shadow-2xl shadow-[#3E2715]/10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-[#0A111F] p-7 text-white sm:p-10">
            <div className="mb-8 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/65">
              {t('gate.badge')}
            </div>
            <h1 className="max-w-xl text-[34px] font-black leading-[1.02] sm:text-[46px]">
              {t('gate.title')}
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-7 text-white/68">
              {t('gate.description')}
            </p>
            <div className="mt-10 grid gap-3 text-[13px] text-white/78">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                {t('gate.safeData')}
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                {t('gate.demoNotice')}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10">
            <div className="mb-7">
              <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#B8643E]">
                {t('gate.formEyebrow')}
              </p>
              <h2 className="mt-3 text-[26px] font-black text-[#121826]">
                {t('gate.formTitle')}
              </h2>
              <p className="mt-3 text-[14px] leading-6 text-[#667085]">
                {demoEnabled
                  ? t('gate.formHint', { email: demoEmail })
                  : t('gate.disabled')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label className="text-[13px] font-bold text-[#344054]" htmlFor="portal-email">
                {t('gate.emailLabel')}
              </label>
              <input
                id="portal-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={!demoEnabled || isSubmitting}
                autoComplete="email"
                inputMode="email"
                placeholder={demoEmail}
                className="h-13 rounded-2xl border border-[#D9C7BA] bg-[#FFFDF9] px-4 text-[15px] text-[#121826] outline-none transition focus:border-[#B8643E] disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!demoEnabled || isSubmitting}
                className="mt-2 h-13 rounded-2xl bg-[#B8643E] px-5 text-[15px] font-black text-white shadow-lg shadow-[#B8643E]/20 transition hover:bg-[#A65835] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? t('gate.loading') : t('gate.submit')}
              </button>
            </form>

            {message && (
              <p className="mt-4 rounded-2xl border border-[#F2C5BB] bg-[#FFF1EF] px-4 py-3 text-[13px] font-semibold text-[#A94732]">
                {message}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
