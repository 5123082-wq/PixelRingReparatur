'use client';

import { useState, type FormEvent } from 'react';
import { Link, useRouter } from '@/i18n/routing';

type PortalClaimFormProps = {
  token: string;
  publicRequestNumber: string;
  prefillEmail: string | null;
  expiresAt: string;
  isAuthenticated: boolean;
};

type StartResponse = {
  success: boolean;
  email?: string;
  sent?: boolean;
  devCode?: string;
  verificationToken?: string;
  redirectTo?: string;
  message?: string;
};

type ClaimStep = 'email' | 'code' | 'password';

export default function PortalClaimForm({
  token,
  publicRequestNumber,
  prefillEmail,
  expiresAt,
  isAuthenticated,
}: PortalClaimFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(prefillEmail ?? '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [step, setStep] = useState<ClaimStep>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [devCode, setDevCode] = useState('');

  async function readApiResponse(response: Response): Promise<StartResponse> {
    const data = (await response.json().catch(() => null)) as StartResponse | null;

    if (!response.ok || !data?.success) {
      throw new Error(data?.message || 'Die Bestaetigung konnte nicht abgeschlossen werden.');
    }

    return data;
  }

  async function grantToCurrentSession() {
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/portal/claim/grant-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await readApiResponse(response);

      router.push(data.redirectTo || '/portal');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Die Anfrage konnte nicht verbunden werden.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function startVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');
    setDevCode('');

    try {
      const response = await fetch('/api/portal/claim/start-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email }),
      });
      const data = await readApiResponse(response);

      setEmail(data.email ?? email);
      setDevCode(data.devCode ?? '');
      setMessage('Wir haben einen Code an Ihre E-Mail-Adresse gesendet.');
      setStep('code');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Die Bestaetigung konnte nicht gestartet werden.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/portal/claim/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await readApiResponse(response);

      setVerificationToken(data.verificationToken ?? '');
      setMessage('E-Mail bestaetigt. Legen Sie jetzt Ihr Portal-Passwort fest.');
      setStep('password');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Der Code ist ungueltig oder abgelaufen.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function setAccountPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/portal/claim/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationToken, password, passwordRepeat }),
      });
      const data = await readApiResponse(response);

      router.push(data.redirectTo || '/portal');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Das Passwort konnte nicht gespeichert werden.');
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
                Anfrage sicher verbinden
              </h1>
              <p className="mt-5 max-w-lg text-[15px] leading-7 text-white/68">
                Diese Seite verbindet genau diese Anfrage mit einer bestaetigten Portal-Identitaet. Die PR-Nummer allein oeffnet keine privaten Daten.
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
              {isAuthenticated ? (
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#B8643E]">
                    Angemeldet
                  </p>
                  <h2 className="mt-3 text-[26px] font-black text-[#121826]">
                    Anfrage mit Ihrem Konto verbinden
                  </h2>
                  <p className="mt-3 text-[14px] leading-6 text-[#667085]">
                    Sie sind bereits im Kundenportal angemeldet. Nach der Bestaetigung wird nur diese Anfrage fuer Ihr Konto freigegeben.
                  </p>
                  <button
                    type="button"
                    onClick={() => void grantToCurrentSession()}
                    disabled={isSubmitting}
                    className="mt-6 h-13 w-full rounded-2xl bg-[#B8643E] px-5 text-[15px] font-black text-white shadow-lg shadow-[#B8643E]/20 transition hover:bg-[#A65835] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Wird verbunden ...' : 'Anfrage verbinden'}
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-7">
                    <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#B8643E]">
                      E-Mail-Code
                    </p>
                    <h2 className="mt-3 text-[26px] font-black text-[#121826]">
                      Portal-Zugang aktivieren
                    </h2>
                    <p className="mt-3 text-[14px] leading-6 text-[#667085]">
                      Geben Sie Ihre E-Mail ein, bestaetigen Sie den Code und legen Sie ein Passwort fest.
                    </p>
                    <Link href="/portal" className="mt-3 inline-flex text-[13px] font-black text-[#B8643E] underline">
                      Schon ein Konto? Erst einloggen und diesen Link erneut oeffnen.
                    </Link>
                  </div>

                  {step === 'email' && (
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
                        required
                        placeholder="name@example.com"
                        className="h-13 rounded-2xl border border-[#D9C7BA] bg-[#FFFDF9] px-4 text-[15px] text-[#121826] outline-none transition focus:border-[#B8643E] disabled:cursor-not-allowed disabled:opacity-60"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting || !email.trim()}
                        className="mt-2 h-13 rounded-2xl bg-[#B8643E] px-5 text-[15px] font-black text-white shadow-lg shadow-[#B8643E]/20 transition hover:bg-[#A65835] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? 'Code wird gesendet ...' : 'Code senden'}
                      </button>
                    </form>
                  )}

                  {step === 'code' && (
                    <form onSubmit={verifyCode} className="flex flex-col gap-3">
                      <label className="text-[13px] font-bold text-[#344054]" htmlFor="portal-claim-code">
                        Code aus der E-Mail
                      </label>
                      <input
                        id="portal-claim-code"
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        disabled={isSubmitting}
                        type="text"
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        required
                        className="h-13 rounded-2xl border border-[#D9C7BA] bg-[#FFFDF9] px-4 text-[18px] font-black tracking-[0.22em] text-[#121826] outline-none transition focus:border-[#B8643E] disabled:cursor-not-allowed disabled:opacity-60"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting || !code.trim()}
                        className="mt-2 h-13 rounded-2xl bg-[#B8643E] px-5 text-[15px] font-black text-white shadow-lg shadow-[#B8643E]/20 transition hover:bg-[#A65835] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? 'Code wird geprueft ...' : 'Code bestaetigen'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep('email')}
                        className="text-left text-[13px] font-black text-[#B8643E] underline"
                      >
                        Code erneut senden
                      </button>
                    </form>
                  )}

                  {step === 'password' && (
                    <form onSubmit={setAccountPassword} className="flex flex-col gap-3">
                      <PasswordField
                        id="portal-claim-password"
                        label="Passwort"
                        value={password}
                        onChange={setPassword}
                        disabled={isSubmitting}
                        autoComplete="new-password"
                      />
                      <PasswordField
                        id="portal-claim-password-repeat"
                        label="Passwort wiederholen"
                        value={passwordRepeat}
                        onChange={setPasswordRepeat}
                        disabled={isSubmitting}
                        autoComplete="new-password"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 h-13 rounded-2xl bg-[#B8643E] px-5 text-[15px] font-black text-white shadow-lg shadow-[#B8643E]/20 transition hover:bg-[#A65835] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? 'Wird gespeichert ...' : 'Konto erstellen und Anfrage verbinden'}
                      </button>
                    </form>
                  )}
                </>
              )}

              {message && (
                <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-semibold text-emerald-800">
                  {message}
                </p>
              )}
              {devCode && (
                <p className="mt-4 rounded-2xl border border-[#E9DED2] bg-white px-4 py-3 text-[13px] font-black text-[#121826]">
                  Lokaler Code: <span className="tracking-[0.16em]">{devCode}</span>
                </p>
              )}
              {error && (
                <p className="mt-4 rounded-2xl border border-[#F2C5BB] bg-[#FFF1EF] px-4 py-3 text-[13px] font-semibold text-[#A94732]">
                  {error}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  disabled,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  autoComplete: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <label className="text-[13px] font-bold text-[#344054]" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          type={isVisible ? 'text' : 'password'}
          autoComplete={autoComplete}
          minLength={10}
          required
          className="h-13 w-full rounded-2xl border border-[#D9C7BA] bg-[#FFFDF9] px-4 pr-28 text-[15px] text-[#121826] outline-none transition focus:border-[#B8643E] disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          disabled={disabled}
          aria-label={isVisible ? 'Passwort ausblenden' : 'Passwort anzeigen'}
          className="absolute right-2 top-1/2 h-8 -translate-y-1/2 rounded-xl px-3 text-[12px] font-black text-[#B8643E] transition hover:bg-[#F4EEE5] disabled:opacity-60"
        >
          {isVisible ? 'Ausblenden' : 'Anzeigen'}
        </button>
      </div>
    </>
  );
}
