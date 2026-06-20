'use client';

import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useState, type FormEvent } from 'react';

import { getPortalRequestDetailCopy } from './portal-request-detail-copy';

export default function PortalRequestMessageForm({
  publicRequestNumber,
  variant = 'card',
}: {
  publicRequestNumber: string;
  variant?: 'card' | 'chat';
}) {
  const router = useRouter();
  const locale = useLocale();
  const copy = getPortalRequestDetailCopy(locale).messageForm;
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback('');
    setError('');

    try {
      const response = await fetch(`/api/portal/requests/${encodeURIComponent(publicRequestNumber)}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (!response.ok || !data?.success) {
        throw new Error(copy.error);
      }

      setBody('');
      setFeedback(copy.saved);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : copy.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isChat = variant === 'chat';

  return (
    <form
      onSubmit={sendMessage}
      className={isChat ? 'grid gap-3' : 'mt-4 rounded-3xl border border-[#E5D1C2] bg-[#FFF8F2] p-4'}
    >
      <label className="block">
        <span className={isChat ? 'sr-only' : 'text-[13px] font-black text-[#B8643E]'}>{copy.label}</span>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          disabled={isSubmitting}
          required
          maxLength={4000}
          placeholder={copy.placeholder}
          className={
            isChat
              ? 'min-h-[72px] w-full resize-none rounded-[22px] border border-[#D9E0EA] bg-white px-4 py-3 text-[14px] font-semibold leading-6 text-[#121826] outline-none transition focus:border-[#B8643E] focus:ring-4 focus:ring-[#B8643E]/10 disabled:opacity-60'
              : 'mt-2 min-h-[120px] w-full rounded-2xl border border-[#D9C7BA] bg-white px-4 py-3 text-[14px] font-semibold leading-6 text-[#121826] outline-none transition focus:border-[#B8643E] disabled:opacity-60'
          }
        />
      </label>
      <div className={isChat ? 'flex flex-wrap items-center justify-between gap-3' : 'mt-3 flex flex-wrap items-center gap-3'}>
        <span className="text-[12px] font-semibold text-[#8A7467]">{copy.attachmentNote}</span>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-2xl bg-[#B8643E] px-5 text-[14px] font-black text-white transition hover:bg-[#A65835] disabled:opacity-60"
        >
          {isSubmitting ? copy.sending : copy.send}
        </button>
      </div>
      {feedback && <p className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-bold text-emerald-800">{feedback}</p>}
      {error && <p className="mt-3 rounded-2xl border border-[#F2C5BB] bg-[#FFF1EF] px-4 py-3 text-[13px] font-bold text-[#A94732]">{error}</p>}
    </form>
  );
}
