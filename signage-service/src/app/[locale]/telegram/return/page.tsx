import type { Metadata } from 'next';

import TelegramReturnClient from '@/components/telegram/TelegramReturnClient';
import { prisma } from '@/lib/prisma';
import { getTelegramReturnTarget } from '@/lib/telegram-intake';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Zurueck zu Telegram',
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ r?: string | string[] }>;
};

const COPY = {
  de: {
    title: 'Zurueck zu Telegram',
    text: 'Wir oeffnen den Telegram-Dialog. Falls nichts passiert, nutzen Sie bitte die Schaltflaeche.',
    button: 'Telegram oeffnen',
    unavailable: 'Der Telegram-Ruecksprung ist nicht mehr verfuegbar. Bitte oeffnen Sie den Chat manuell.',
  },
  en: {
    title: 'Back to Telegram',
    text: 'We are opening the Telegram conversation. If nothing happens, use the button.',
    button: 'Open Telegram',
    unavailable: 'The Telegram return link is no longer available. Please open the chat manually.',
  },
  ru: {
    title: 'Возврат в Telegram',
    text: 'Открываем Telegram-диалог. Если ничего не произошло, нажмите кнопку.',
    button: 'Открыть Telegram',
    unavailable: 'Возврат в Telegram больше недоступен. Откройте чат вручную.',
  },
  tr: {
    title: 'Telegrama geri don',
    text: 'Telegram gorusmesini aciyoruz. Bir sey olmazsa dugmeyi kullanin.',
    button: 'Telegrami ac',
    unavailable: 'Telegrama donus baglantisi artik kullanilamiyor. Lutfen sohbeti manuel acin.',
  },
  pl: {
    title: 'Powrot do Telegrama',
    text: 'Otwieramy rozmowe w Telegramie. Jesli nic sie nie stanie, uzyj przycisku.',
    button: 'Otworz Telegram',
    unavailable: 'Link powrotu do Telegrama nie jest juz dostepny. Otworz czat recznie.',
  },
  ar: {
    title: 'العودة إلى Telegram',
    text: 'نفتح محادثة Telegram. إذا لم يحدث شيء، استخدم الزر.',
    button: 'فتح Telegram',
    unavailable: 'رابط العودة إلى Telegram لم يعد متاحا. يرجى فتح المحادثة يدويا.',
  },
};

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function getCopy(locale: string) {
  return COPY[locale as keyof typeof COPY] ?? COPY.de;
}

export default async function TelegramReturnPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = await searchParams;
  const returnNonce = firstParam(query.r);
  const target = await getTelegramReturnTarget(prisma, returnNonce);

  return (
    <main className="min-h-[100svh] bg-[#F7F1E8] text-[#0E1A2B]">
      <TelegramReturnClient telegramUrl={target.telegramReturnUrl} copy={getCopy(locale)} />
    </main>
  );
}
