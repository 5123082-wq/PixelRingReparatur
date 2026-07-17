'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import CustomerStandaloneNav from '@/components/common/CustomerStandaloneNav';
import { getPortalStandaloneCopy } from './portal-standalone-copy';

type AuthMode = 'login' | 'register' | 'reset';
type CodeStep = 'email' | 'code' | 'password';

type ApiResponse = {
  success: boolean;
  sent?: boolean;
  devCode?: string;
  verificationToken?: string;
  redirectTo?: string;
  message?: string;
};

export default function PortalEntry({
  demoEnabled = false,
  demoEmail = '',
}: {
  demoEnabled?: boolean;
  demoEmail?: string;
}) {
  const router = useRouter();
  const copy = getPortalStandaloneCopy(useLocale());
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [code, setCode] = useState('');
  const [codeStep, setCodeStep] = useState<CodeStep>('email');
  const [verificationToken, setVerificationToken] = useState('');
  const [demoInput, setDemoInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState('');

  function resetFlow(nextMode: AuthMode) {
    setMode(nextMode);
    setPassword('');
    setPasswordRepeat('');
    setCode('');
    setCodeStep('email');
    setVerificationToken('');
    setMessage('');
    setError('');
    setDevCode('');
  }

  async function readApiResponse(response: Response, fallback: string): Promise<ApiResponse> {
    const data = (await response.json().catch(() => null)) as ApiResponse | null;

    if (!response.ok || !data?.success) {
      throw new Error(fallback);
    }

    return data;
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/portal/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await readApiResponse(response, copy.entry.loginError);

      router.push(data.redirectTo || '/portal');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : copy.entry.loginError);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function startCodeFlow(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');
    setDevCode('');

    const endpoint =
      mode === 'reset'
        ? '/api/portal/auth/password-reset/start'
        : '/api/portal/auth/register/start';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await readApiResponse(response, copy.entry.codeSendError);

      setCodeStep('code');
      setMessage(copy.entry.codeSent);
      setDevCode(data.devCode || '');
    } catch (error) {
      setError(error instanceof Error ? error.message : copy.entry.codeSendError);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    const endpoint =
      mode === 'reset'
        ? '/api/portal/auth/password-reset/verify-code'
        : '/api/portal/auth/register/verify-code';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await readApiResponse(response, copy.entry.invalidCode);

      setVerificationToken(data.verificationToken || '');
      setCodeStep('password');
      setMessage(copy.entry.emailConfirmed);
    } catch (error) {
      setError(error instanceof Error ? error.message : copy.entry.invalidCode);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function setAccountPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    const endpoint =
      mode === 'reset'
        ? '/api/portal/auth/password-reset/set-password'
        : '/api/portal/auth/register/set-password';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationToken, password, passwordRepeat }),
      });
      const data = await readApiResponse(response, copy.entry.passwordError);

      router.push(data.redirectTo || '/portal');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : copy.entry.passwordError);
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
        throw new Error(copy.entry.demoError);
      }

      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : copy.entry.demoError);
    } finally {
      setIsDemoSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F4EEE5] text-[#121826]">
      <div className="pr-site-container py-4">
      <CustomerStandaloneNav showPortal={false} />
      <section className="mx-auto grid min-h-[calc(100vh-104px)] w-full max-w-6xl content-center gap-6 py-6">
        <div className="rounded-[28px] border border-[#E4D8CA] bg-white p-6 shadow-2xl shadow-[#3E2715]/10 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#B8643E]">
                {copy.common.portal}
              </p>
              <h1 className="mt-4 max-w-3xl text-[34px] font-black leading-tight text-[#121826] sm:text-[44px]">
                {copy.entry.title}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#667085]">
                {copy.entry.body}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {copy.entry.steps.map((step) => (
                  <EntryStep key={step.title} title={step.title} text={step.text} />
                ))}
              </div>
            </div>

            <section className="rounded-3xl border border-[#E9DED2] bg-[#FBF8F3] p-5 sm:p-6">
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-1">
                <ModeButton active={mode === 'login'} onClick={() => resetFlow('login')}>
                  {copy.entry.login}
                </ModeButton>
                <ModeButton active={mode === 'register'} onClick={() => resetFlow('register')}>
                  {copy.entry.register}
                </ModeButton>
              </div>

              {mode === 'login' && (
                <form onSubmit={login} className="mt-5 grid gap-3">
                  <EmailInput label={copy.common.email} email={email} setEmail={setEmail} disabled={isSubmitting} />
                  <PasswordInput
                    id="portal-login-password"
                    label={copy.common.password}
                    value={password}
                    onChange={setPassword}
                    disabled={isSubmitting}
                    autoComplete="current-password"
                    showLabel={copy.common.showPassword}
                    hideLabel={copy.common.hidePassword}
                    showAriaLabel={copy.common.showPasswordAria}
                    hideAriaLabel={copy.common.hidePasswordAria}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 h-12 w-full rounded-2xl bg-[#B8643E] px-5 text-[15px] font-black text-white shadow-lg shadow-[#B8643E]/20 transition hover:bg-[#A65835] disabled:opacity-60"
                  >
                    {isSubmitting ? copy.entry.loginLoading : copy.entry.login}
                  </button>
                  <button
                    type="button"
                    onClick={() => resetFlow('reset')}
                    className="text-start text-[13px] font-black text-[#B8643E] underline"
                  >
                    {copy.entry.forgotPassword}
                  </button>
                </form>
              )}

              {(mode === 'register' || mode === 'reset') && (
                <div className="mt-5">
                  <p className="text-[13px] font-black text-[#344054]">
                    {mode === 'reset' ? copy.entry.resetTitle : copy.entry.registerTitle}
                  </p>
                  {codeStep === 'email' && (
                    <form onSubmit={startCodeFlow} className="mt-3 grid gap-3">
                      <EmailInput label={copy.common.email} email={email} setEmail={setEmail} disabled={isSubmitting} />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 h-12 w-full rounded-2xl bg-[#B8643E] px-5 text-[15px] font-black text-white shadow-lg shadow-[#B8643E]/20 transition hover:bg-[#A65835] disabled:opacity-60"
                      >
                        {isSubmitting ? copy.entry.sendCodeLoading : copy.entry.sendCode}
                      </button>
                    </form>
                  )}

                  {codeStep === 'code' && (
                    <form onSubmit={verifyCode} className="mt-3 grid gap-3">
                      <label className="block text-[13px] font-black text-[#344054]" htmlFor="portal-code">
                        {copy.common.codeFromEmail}
                      </label>
                      <input
                        id="portal-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        disabled={isSubmitting}
                        required
                        className="h-12 w-full rounded-2xl border border-[#D9CCBD] bg-white px-4 text-[18px] font-black tracking-[0.22em] text-[#121826] outline-none transition focus:border-[#B8643E] focus:ring-4 focus:ring-[#B8643E]/10 disabled:opacity-60"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 h-12 w-full rounded-2xl bg-[#B8643E] px-5 text-[15px] font-black text-white shadow-lg shadow-[#B8643E]/20 transition hover:bg-[#A65835] disabled:opacity-60"
                      >
                        {isSubmitting ? copy.entry.verifyCodeLoading : copy.entry.verifyCode}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCodeStep('email')}
                        className="text-start text-[13px] font-black text-[#B8643E] underline"
                      >
                        {copy.entry.resendCode}
                      </button>
                    </form>
                  )}

                  {codeStep === 'password' && (
                    <form onSubmit={setAccountPassword} className="mt-3 grid gap-3">
                      <PasswordInput
                        id="portal-new-password"
                        label={mode === 'reset' ? copy.common.newPassword : copy.common.password}
                        value={password}
                        onChange={setPassword}
                        disabled={isSubmitting}
                        autoComplete="new-password"
                        showLabel={copy.common.showPassword}
                        hideLabel={copy.common.hidePassword}
                        showAriaLabel={copy.common.showPasswordAria}
                        hideAriaLabel={copy.common.hidePasswordAria}
                      />
                      <PasswordInput
                        id="portal-new-password-repeat"
                        label={copy.common.passwordRepeat}
                        value={passwordRepeat}
                        onChange={setPasswordRepeat}
                        disabled={isSubmitting}
                        autoComplete="new-password"
                        showLabel={copy.common.showPassword}
                        hideLabel={copy.common.hidePassword}
                        showAriaLabel={copy.common.showPasswordAria}
                        hideAriaLabel={copy.common.hidePasswordAria}
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 h-12 w-full rounded-2xl bg-[#B8643E] px-5 text-[15px] font-black text-white shadow-lg shadow-[#B8643E]/20 transition hover:bg-[#A65835] disabled:opacity-60"
                      >
                        {isSubmitting ? copy.entry.saveLoading : mode === 'reset' ? copy.entry.savePassword : copy.entry.createAccount}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {message && (
                <p className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-semibold text-emerald-800">
                  {message}
                </p>
              )}
              {devCode && (
                <p className="mt-3 rounded-2xl border border-[#E9DED2] bg-white px-4 py-3 text-[13px] font-black text-[#121826]">
                  {copy.common.localCode} <span className="tracking-[0.16em]">{devCode}</span>
                </p>
              )}
              {error && (
                <p className="mt-3 rounded-2xl border border-[#F2C5BB] bg-[#FFF1EF] px-4 py-3 text-[13px] font-semibold text-[#A94732]">
                  {error}
                </p>
              )}
            </section>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ActionCard
            title={copy.entry.existingTitle}
            text={copy.entry.existingText}
            href="/status"
            label={copy.entry.existingLabel}
          />
          <ActionCard
            title={copy.entry.newTitle}
            text={copy.entry.newText}
            href="/#kontakt"
            label={copy.entry.newLabel}
          />
        </div>

        {demoEnabled && (
          <form onSubmit={openDemo} className="rounded-3xl border border-dashed border-[#D8C7B7] bg-white/70 p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_260px_auto] md:items-end">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#B8643E]">{copy.entry.demoEyebrow}</p>
                <p className="mt-1 text-[13px] text-[#667085]">{copy.entry.demoHint.replace('{email}', demoEmail)}</p>
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
                {copy.entry.demoSubmit}
              </button>
            </div>
          </form>
        )}
      </section>
      </div>
    </main>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-xl text-[13px] font-black transition ${
        active ? 'bg-[#121826] text-white' : 'text-[#667085] hover:bg-[#F4EEE5] hover:text-[#121826]'
      }`}
    >
      {children}
    </button>
  );
}

function EmailInput({
  label,
  email,
  setEmail,
  disabled,
}: {
  label: string;
  email: string;
  setEmail: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <>
      <label className="block text-[13px] font-black text-[#344054]" htmlFor="portal-login-email">
        {label}
      </label>
      <input
        id="portal-login-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
        disabled={disabled}
        placeholder="name@example.com"
        className="h-12 w-full rounded-2xl border border-[#D9CCBD] bg-white px-4 text-[15px] font-semibold text-[#121826] outline-none transition focus:border-[#B8643E] focus:ring-4 focus:ring-[#B8643E]/10 disabled:opacity-60"
      />
    </>
  );
}

function PasswordInput({
  id,
  label,
  value,
  onChange,
  disabled,
  autoComplete,
  showLabel,
  hideLabel,
  showAriaLabel,
  hideAriaLabel,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  autoComplete: string;
  showLabel: string;
  hideLabel: string;
  showAriaLabel: string;
  hideAriaLabel: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <label className="block text-[13px] font-black text-[#344054]" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          required
          disabled={disabled}
          minLength={10}
          className="h-12 w-full rounded-2xl border border-[#D9CCBD] bg-white px-4 pe-28 text-[15px] font-semibold text-[#121826] outline-none transition focus:border-[#B8643E] focus:ring-4 focus:ring-[#B8643E]/10 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          disabled={disabled}
          aria-label={isVisible ? hideAriaLabel : showAriaLabel}
          className="absolute end-2 top-1/2 h-8 -translate-y-1/2 rounded-xl px-3 text-[12px] font-black text-[#B8643E] transition hover:bg-[#F4EEE5] disabled:opacity-60"
        >
          {isVisible ? hideLabel : showLabel}
        </button>
      </div>
    </>
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
