'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';

type VerifyResponse = {
  success: boolean;
  redirectTo?: string;
  message?: string;
};

export default function PortalClaimVerifyForm({ token }: { token: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function verify() {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/portal/claim/consume-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = (await response.json()) as VerifyResponse;

      if (!response.ok || !data.success || !data.redirectTo) {
        throw new Error(data.message || 'Die Bestaetigung konnte nicht abgeschlossen werden.');
      }

      router.push(data.redirectTo);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Die Bestaetigung konnte nicht abgeschlossen werden.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => void verify()}
        disabled={isSubmitting}
        className="h-13 rounded-2xl bg-[#B8643E] px-5 text-[15px] font-black text-white shadow-lg shadow-[#B8643E]/20 transition hover:bg-[#A65835] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Wird bestaetigt ...' : 'E-Mail bestaetigen und Portal oeffnen'}
      </button>

      {error && (
        <p className="rounded-2xl border border-[#F2C5BB] bg-[#FFF1EF] px-4 py-3 text-[13px] font-semibold text-[#A94732]">
          {error}
        </p>
      )}
    </div>
  );
}
