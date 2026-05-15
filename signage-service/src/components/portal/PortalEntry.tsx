'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';

type StartEmailResponse = {
  success: boolean;
  sent?: boolean;
  verificationUrl?: string;
  message?: string;
};

export default function PortalEntry({
  demoEnabled = false,
  demoEmail = '',
}: {
  demoEnabled?: boolean;
  demoEmail?: string;
}) {
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [demoInput, setDemoInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [devVerificationUrl, setDevVerificationUrl] = useState('');

  async function startEmailLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');
    setDevVerificationUrl('');

    try {
      const response = await fetch('/api/portal/auth/start-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });
      const data = (await response.json()) as StartEmailResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Die E-Mail konnte nicht bestaetigt werden.');
      }

      setMessage('Wir haben Ihnen einen Bestaetigungslink per E-Mail gesendet.');
      setDevVerificationUrl(data.verificationUrl || '');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Die E-Mail konnte nicht bestaetigt werden.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function openDemo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsDemoSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/portal/demo-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoInput }),
      });

      if (!response.ok) {
        throw new Error('Demo-Zugang konnte nicht geoeffnet werden.');
      }

      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Demo-Zugang konnte nicht geoeffnet werden.');
    } finally {
      setIsDemoSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F4EEE5] px-4 py-6 text-[#121826] sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-48px)] w-full max-w-6xl content-center gap-6">
        <div className="rounded-[28px] border border-[#E4D8CA] bg-white p-6 shadow-2xl shadow-[#3E2715]/10 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#B8643E]">
                Kundenportal
              </p>
              <h1 className="mt-4 max-w-3xl text-[34px] font-black leading-tight text-[#121826] sm:text-[44px]">
                Einloggen oder Kundenkonto erstellen
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#667085]">
                Melden Sie sich mit Ihrer E-Mail-Adresse an. Wenn noch keine Anfrage im Konto liegt, starten Sie danach eine neue Anfrage oder pruefen eine bestehende PR-Nummer.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <EntryStep title="E-Mail bestaetigen" text="Passwortloser Zugang ueber einen sicheren Link." />
                <EntryStep title="Anfragen behalten" text="Bestehende Anfragen bleiben nur nach Kontaktpruefung sichtbar." />
                <EntryStep title="Neu starten" text="Eine neue Anfrage ist auch ohne vorheriges Konto moeglich." />
              </div>
            </div>

            <form onSubmit={startEmailLogin} className="rounded-3xl border border-[#E9DED2] bg-[#FBF8F3] p-5 sm:p-6">
              <label className="block text-[13px] font-black text-[#344054]" htmlFor="portal-login-email">
                E-Mail-Adresse
              </label>
              <input
                id="portal-login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                placeholder="name@example.com"
                className="mt-2 h-12 w-full rounded-2xl border border-[#D9CCBD] bg-white px-4 text-[15px] font-semibold text-[#121826] outline-none transition focus:border-[#B8643E] focus:ring-4 focus:ring-[#B8643E]/10"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 h-12 w-full rounded-2xl bg-[#B8643E] px-5 text-[15px] font-black text-white shadow-lg shadow-[#B8643E]/20 transition hover:bg-[#A65835] disabled:opacity-60"
              >
                {isSubmitting ? 'Link wird gesendet ...' : 'Einloggen / registrieren'}
              </button>
              {message && (
                <p className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-semibold text-emerald-800">
                  {message}
                </p>
              )}
              {devVerificationUrl && (
                <a
                  href={devVerificationUrl}
                  className="mt-3 block break-all rounded-2xl border border-[#E9DED2] bg-white px-4 py-3 text-[12px] font-bold text-[#B8643E] underline"
                >
                  Lokaler Fallback-Link
                </a>
              )}
              {error && (
                <p className="mt-3 rounded-2xl border border-[#F2C5BB] bg-[#FFF1EF] px-4 py-3 text-[13px] font-semibold text-[#A94732]">
                  {error}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ActionCard
            title="Bestehende Anfrage pruefen"
            text="Wenn Sie schon eine PR-Nummer haben, pruefen Sie den Status mit der Telefonnummer oder E-Mail aus der Anfrage."
            href="/status"
            label="Anfrage-Status pruefen"
          />
          <ActionCard
            title="Neue Anfrage starten"
            text="Sie koennen den Service direkt starten. Die Anfrage bekommt erst nach Kontaktangabe eine PR-Nummer."
            href="/#kontakt"
            label="Service starten"
          />
        </div>

        {demoEnabled && (
          <form onSubmit={openDemo} className="rounded-3xl border border-dashed border-[#D8C7B7] bg-white/70 p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_260px_auto] md:items-end">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#B8643E]">Lokaler Demo-Zugang</p>
                <p className="mt-1 text-[13px] text-[#667085]">Nur fuer lokale Tests. Demo-E-Mail: {demoEmail}</p>
              </div>
              <input
                type="email"
                value={demoInput}
                onChange={(event) => setDemoInput(event.target.value)}
                placeholder={demoEmail}
                className="h-11 rounded-2xl border border-[#D9CCBD] bg-white px-4 text-[14px] font-semibold outline-none focus:border-[#B8643E]"
              />
              <button
                type="submit"
                disabled={isDemoSubmitting}
                className="h-11 rounded-2xl border border-[#D9CCBD] bg-white px-4 text-[13px] font-black text-[#121826] transition hover:border-[#B8643E] disabled:opacity-60"
              >
                Demo oeffnen
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

function EntryStep({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#EFE6DC] bg-[#FFFDFC] p-4">
      <strong className="block text-[14px] font-black text-[#121826]">{title}</strong>
      <span className="mt-2 block text-[13px] leading-5 text-[#667085]">{text}</span>
    </div>
  );
}

function ActionCard({
  title,
  text,
  href,
  label,
}: {
  title: string;
  text: string;
  href: string;
  label: string;
}) {
  return (
    <article className="rounded-[24px] border border-[#E4D8CA] bg-white p-6 shadow-lg shadow-[#3E2715]/5">
      <h2 className="text-[22px] font-black text-[#121826]">{title}</h2>
      <p className="mt-2 min-h-[52px] text-[14px] leading-6 text-[#667085]">{text}</p>
      <Link
        href={href}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-[#121826] px-5 text-[14px] font-black text-white transition hover:bg-[#263247]"
      >
        {label}
      </Link>
    </article>
  );
}
