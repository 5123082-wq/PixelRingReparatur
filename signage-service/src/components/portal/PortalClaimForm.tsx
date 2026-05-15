'use client';

import { useState, type FormEvent } from 'react';

type PortalClaimFormProps = {
  token: string;
  publicRequestNumber: string;
  prefillEmail: string | null;
  expiresAt: string;
};

type StartResponse = {
  success: boolean;
  email?: string;
  devVerificationUrl?: string;
  message?: string;
};

export default function PortalClaimForm({
  token,
  publicRequestNumber,
  prefillEmail,
  expiresAt,
}: PortalClaimFormProps) {
  const [email, setEmail] = useState(prefillEmail ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sentEmail, setSentEmail] = useState('');
  const [devVerificationUrl, setDevVerificationUrl] = useState('');

  async function startVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSentEmail('');
    setDevVerificationUrl('');

    try {
      const response = await fetch('/api/portal/claim/start-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email }),
      });
      const data = (await response.json()) as StartResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Die Bestaetigung konnte nicht gestartet werden.');
      }

      setSentEmail(data.email ?? email);
      setDevVerificationUrl(data.devVerificationUrl ?? '');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Die Bestaetigung konnte nicht gestartet werden.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F4EEE5] px-4 py-6 text-[#121826] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-4xl items-center justify-center">
        <section className="w-full overflow-hidden rounded-[28px] border border-[#E4D8CA] bg-white shadow-2xl shadow-[#3E2715]/10">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-[#0A111F] p-7 text-white sm:p-10">
              <div className="mb-8 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/65">
                Kundenportal
              </div>
              <h1 className="max-w-xl text-[34px] font-black leading-[1.02] sm:text-[44px]">
                Zugang zur Anfrage vorbereiten
              </h1>
              <p className="mt-5 max-w-lg text-[15px] leading-7 text-white/68">
                Diese Seite verbindet Ihre Anfrage mit einer bestaetigten E-Mail-Adresse. Erst danach oeffnet sich Ihr Kundenportal.
              </p>
              <div className="mt-10 grid gap-3 text-[13px] text-white/78">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  Anfrage: <span className="font-black text-white">{publicRequestNumber}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  Link gueltig bis: {new Date(expiresAt).toLocaleString('de-DE')}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10">
              {sentEmail ? (
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#B8643E]">
                    E-Mail gesendet
                  </p>
                  <h2 className="mt-3 text-[26px] font-black text-[#121826]">
                    Bitte Postfach pruefen
                  </h2>
                  <p className="mt-3 text-[14px] leading-6 text-[#667085]">
                    Wir haben eine Bestaetigungs-E-Mail an <span className="font-bold text-[#121826]">{sentEmail}</span> gesendet. Nach dem Klick auf die Bestaetigung oeffnet sich Ihr Kundenportal.
                  </p>
                  {devVerificationUrl && (
                    <a
                      href={devVerificationUrl}
                      className="mt-6 inline-flex rounded-2xl bg-[#121826] px-5 py-3 text-[14px] font-black text-white"
                    >
                      Dev-Bestaetigungslink oeffnen
                    </a>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-7">
                    <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#B8643E]">
                      E-Mail bestaetigen
                    </p>
                    <h2 className="mt-3 text-[26px] font-black text-[#121826]">
                      Portal-Zugang aktivieren
                    </h2>
                    <p className="mt-3 text-[14px] leading-6 text-[#667085]">
                      Geben Sie die E-Mail-Adresse ein, die fuer den Kundenportal-Zugang verwendet werden soll.
                    </p>
                  </div>

                  <form onSubmit={startVerification} className="flex flex-col gap-3">
                    <label className="text-[13px] font-bold text-[#344054]" htmlFor="portal-claim-email">
                      E-Mail-Adresse
                    </label>
                    <input
                      id="portal-claim-email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={isSubmitting}
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="name@example.com"
                      className="h-13 rounded-2xl border border-[#D9C7BA] bg-[#FFFDF9] px-4 text-[15px] text-[#121826] outline-none transition focus:border-[#B8643E] disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !email.trim()}
                      className="mt-2 h-13 rounded-2xl bg-[#B8643E] px-5 text-[15px] font-black text-white shadow-lg shadow-[#B8643E]/20 transition hover:bg-[#A65835] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? 'Wird gesendet ...' : 'Bestaetigungs-E-Mail senden'}
                    </button>
                  </form>

                  {error && (
                    <p className="mt-4 rounded-2xl border border-[#F2C5BB] bg-[#FFF1EF] px-4 py-3 text-[13px] font-semibold text-[#A94732]">
                      {error}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
