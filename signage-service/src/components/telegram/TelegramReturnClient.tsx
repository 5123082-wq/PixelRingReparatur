'use client';

import { useEffect } from 'react';

type TelegramReturnClientProps = {
  telegramUrl: string | null;
  copy: {
    title: string;
    text: string;
    button: string;
    unavailable: string;
  };
};

export default function TelegramReturnClient({ telegramUrl, copy }: TelegramReturnClientProps) {
  useEffect(() => {
    if (!telegramUrl) return;

    const timer = window.setTimeout(() => {
      window.location.href = telegramUrl;
    }, 500);

    return () => window.clearTimeout(timer);
  }, [telegramUrl]);

  return (
    <div className="mx-auto flex min-h-[calc(100svh-104px)] w-full max-w-xl items-center justify-center py-10">
      <div className="w-full rounded-[28px] border border-[#E7DDD3] bg-white p-8 text-center shadow-[0_24px_70px_rgba(14,26,43,0.12)]">
        <div className="mx-auto mb-5 h-12 w-12 rounded-full border-4 border-[#B8643E]/20 border-t-[#B8643E] animate-spin" />
        <h1 className="text-2xl font-black text-[#0E1A2B]">{copy.title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#72665D]">
          {telegramUrl ? copy.text : copy.unavailable}
        </p>
        {telegramUrl && (
          <a
            href={telegramUrl}
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#0E1A2B] px-6 text-sm font-black text-white transition hover:bg-[#1A2E47]"
          >
            {copy.button}
          </a>
        )}
      </div>
    </div>
  );
}
