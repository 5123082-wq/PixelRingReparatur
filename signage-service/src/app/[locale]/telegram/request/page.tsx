import type { Metadata } from 'next';

import TelegramRequestForm from '@/components/telegram/TelegramRequestForm';
import { prisma } from '@/lib/prisma';
import { getTelegramIntakeLinkState } from '@/lib/telegram-intake';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'PixelRing Telegram Anfrage',
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ t?: string | string[] }>;
};

const COPY = {
  de: {
    title: 'Geschuetzte PixelRing Anfrage',
    text: 'Fuellen Sie die Angaben aus. Danach geht es direkt zurueck in den Telegram-Dialog.',
    invalid: 'Dieser Formularlink ist nicht mehr gueltig. Bitte gehen Sie zurueck zu Telegram und fordern Sie einen neuen Link an.',
  },
  en: {
    title: 'Secure PixelRing request',
    text: 'Fill in the details. After submission, you will return to the Telegram conversation.',
    invalid: 'This form link is no longer valid. Please return to Telegram and request a new link.',
  },
  ru: {
    title: 'Защищённая заявка PixelRing',
    text: 'Заполните данные. После отправки вы вернётесь в Telegram-диалог.',
    invalid: 'Эта ссылка на форму больше не действует. Вернитесь в Telegram и запросите новую ссылку.',
  },
  tr: {
    title: 'Guvenli PixelRing talebi',
    text: 'Bilgileri doldurun. Gonderdikten sonra Telegram gorusmesine geri doneceksiniz.',
    invalid: 'Bu form baglantisi artik gecerli degil. Telegrama donup yeni bir baglanti isteyin.',
  },
  pl: {
    title: 'Bezpieczne zgloszenie PixelRing',
    text: 'Uzupelnij dane. Po wyslaniu wrocisz do rozmowy w Telegramie.',
    invalid: 'Ten link do formularza nie jest juz wazny. Wroc do Telegrama i popros o nowy link.',
  },
  ar: {
    title: 'طلب PixelRing الآمن',
    text: 'املأ البيانات. بعد الإرسال ستعود إلى محادثة Telegram.',
    invalid: 'رابط النموذج هذا لم يعد صالحا. يرجى العودة إلى Telegram وطلب رابط جديد.',
  },
};

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function getCopy(locale: string) {
  return COPY[locale as keyof typeof COPY] ?? COPY.de;
}

export default async function TelegramRequestPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = await searchParams;
  const token = firstParam(query.t).trim();
  const state = await getTelegramIntakeLinkState(prisma, token, { markOpened: true });
  const copy = getCopy(locale);

  return (
    <main className="min-h-[100svh] bg-[#F7F1E8] px-4 py-8 text-[#0E1A2B] sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B8643E]">PixelRing Telegram</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{copy.title}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#72665D]">{copy.text}</p>
        </div>

        {state.status === 'valid' ? (
          <TelegramRequestForm token={token} locale={state.locale} />
        ) : (
          <div className="rounded-[28px] border border-[#E7DDD3] bg-white p-6 text-sm leading-6 text-[#72665D] shadow-[0_24px_70px_rgba(14,26,43,0.12)]">
            {copy.invalid}
          </div>
        )}
      </div>
    </main>
  );
}
