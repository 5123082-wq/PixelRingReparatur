'use client';

import { useEffect, useId, useState } from 'react';

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

type ReportDemoCopy = {
  title: string;
  eyebrow: string;
  locationLabel: string;
  statusLabel: string;
  priority: string;
  sections: { title: string; items: string[] }[];
  primaryCta: string;
  secondaryCta: string;
  closeLabel: string;
};

const REPORT_DEMO_COPY: Record<Locale, ReportDemoCopy> = {
  de: {
    eyebrow: 'Demo Audit-Report',
    title: 'Beispiel: Standort Köln Süd',
    locationLabel: 'Objekt',
    statusLabel: 'Priorität',
    priority: 'Dringend',
    sections: [
      { title: 'Geprüft', items: ['LED-Zonen und Netzteile', 'Fensterfolien und Poster', 'Befestigung und Sichtbarkeit'] },
      { title: 'Gefunden', items: ['Lose Befestigung am rechten Rahmen', 'Poster veraltet, Austausch empfohlen'] },
      { title: 'Empfehlung', items: ['Technikertermin planen', 'Print-Update im nächsten Servicefenster'] },
    ],
    primaryCta: 'Service-Audit anfragen',
    secondaryCta: 'Präsentation herunterladen',
    closeLabel: 'Schließen',
  },
  en: {
    eyebrow: 'Demo audit report',
    title: 'Example: Köln Süd location',
    locationLabel: 'Location',
    statusLabel: 'Priority',
    priority: 'Urgent',
    sections: [
      { title: 'Checked', items: ['LED zones and power supplies', 'Window films and posters', 'Mounting and visibility'] },
      { title: 'Found', items: ['Loose mounting on the right frame', 'Poster outdated, replacement recommended'] },
      { title: 'Recommendation', items: ['Schedule technician visit', 'Print update in the next service window'] },
    ],
    primaryCta: 'Request service audit',
    secondaryCta: 'Download presentation',
    closeLabel: 'Close',
  },
  ru: {
    eyebrow: 'Демо аудит-отчета',
    title: 'Пример: объект Köln Süd',
    locationLabel: 'Объект',
    statusLabel: 'Приоритет',
    priority: 'Срочно',
    sections: [
      { title: 'Проверено', items: ['LED-зоны и блоки питания', 'Оконные пленки и постеры', 'Крепление и видимость'] },
      { title: 'Найдено', items: ['Ослаблено крепление на правой стороне', 'Постер устарел, нужна замена'] },
      { title: 'Рекомендация', items: ['Запланировать выезд техника', 'Обновить печатные материалы в ближайшее сервисное окно'] },
    ],
    primaryCta: 'Запросить аудит',
    secondaryCta: 'Скачать презентацию',
    closeLabel: 'Закрыть',
  },
  tr: {
    eyebrow: 'Demo denetim raporu',
    title: 'Örnek: Köln Süd lokasyonu',
    locationLabel: 'Lokasyon',
    statusLabel: 'Öncelik',
    priority: 'Acil',
    sections: [
      { title: 'Kontrol edildi', items: ['LED bölgeleri ve güç kaynakları', 'Cam folyoları ve posterler', 'Bağlantı ve görünürlük'] },
      { title: 'Bulundu', items: ['Sağ çerçevede gevşek bağlantı', 'Poster eski, değişim önerilir'] },
      { title: 'Öneri', items: ['Teknisyen ziyareti planla', 'Bir sonraki servis aralığında baskı güncellemesi'] },
    ],
    primaryCta: 'Servis denetimi talep et',
    secondaryCta: 'Sunumu indir',
    closeLabel: 'Kapat',
  },
  pl: {
    eyebrow: 'Demo raportu audytu',
    title: 'Przykład: lokalizacja Köln Süd',
    locationLabel: 'Lokalizacja',
    statusLabel: 'Priorytet',
    priority: 'Pilne',
    sections: [
      { title: 'Sprawdzono', items: ['Strefy LED i zasilacze', 'Folie okienne i plakaty', 'Mocowanie i widoczność'] },
      { title: 'Wykryto', items: ['Luźne mocowanie po prawej stronie', 'Plakat nieaktualny, zalecana wymiana'] },
      { title: 'Rekomendacja', items: ['Zaplanować wizytę technika', 'Zaktualizować materiały drukowane w kolejnym oknie serwisowym'] },
    ],
    primaryCta: 'Zapytaj o audyt',
    secondaryCta: 'Pobierz prezentację',
    closeLabel: 'Zamknij',
  },
  ar: {
    eyebrow: 'تقرير تدقيق تجريبي',
    title: 'مثال: موقع Köln Süd',
    locationLabel: 'الموقع',
    statusLabel: 'الأولوية',
    priority: 'عاجل',
    sections: [
      { title: 'تم الفحص', items: ['مناطق LED ومزودات الطاقة', 'ملصقات النوافذ والبوسترات', 'التثبيت والظهور'] },
      { title: 'الملاحظات', items: ['تثبيت مرتخ في الجهة اليمنى', 'بوستر قديم ويوصى باستبداله'] },
      { title: 'التوصية', items: ['تخطيط زيارة فني', 'تحديث المواد المطبوعة في أقرب نافذة خدمة'] },
    ],
    primaryCta: 'طلب تدقيق الخدمة',
    secondaryCta: 'تنزيل العرض التقديمي',
    closeLabel: 'إغلاق',
  },
};

type BusinessReportDemoButtonProps = {
  locale: Locale;
  label: string;
  presentationHref: string;
};

export default function BusinessReportDemoButton({
  locale,
  label,
  presentationHref,
}: BusinessReportDemoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const copy = REPORT_DEMO_COPY[locale] || REPORT_DEMO_COPY.de;

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-full bg-[#081827] px-3 py-1 text-[10px] font-black text-white transition-colors hover:bg-[#B8643E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
      >
        {label}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#081827]/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div className="flex max-h-[calc(100dvh-32px)] w-full max-w-[620px] flex-col overflow-hidden rounded-[24px] bg-white text-[#081827] shadow-[0_28px_90px_rgba(8,24,39,0.28)]">
            <div className="overflow-y-auto px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#B8643E]">
                  {copy.eyebrow}
                </p>
                <h3 id={titleId} className="mt-1 text-[24px] font-black leading-tight sm:text-[28px]">
                  {copy.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={copy.closeLabel}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#dce7f1] bg-white text-[21px] leading-none text-[#526174] transition-colors hover:border-[#B8643E] hover:text-[#081827]"
              >
                ×
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#dce7f1] bg-[#f8fbff] p-3">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#526174]">{copy.locationLabel}</p>
                <p className="mt-1 text-[17px] font-black">Köln Süd</p>
              </div>
              <div className="rounded-2xl border border-[#f1d7d7] bg-[#fff7f7] p-3">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#526174]">{copy.statusLabel}</p>
                <p className="mt-1 text-[17px] font-black text-[#d65f5f]">{copy.priority}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-2.5">
              {copy.sections.map((section) => (
                <section key={section.title} className="rounded-2xl border border-[#e7eef6] p-3">
                  <h4 className="text-[15px] font-black">{section.title}</h4>
                  <ul className="mt-2 grid gap-1.5">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-2 text-[14px] leading-5 text-[#526174]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#35b47a]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3 border-t border-[#e7eef6] bg-white/95 px-5 py-4 sm:px-6">
              <a
                href="mailto:info@pixel-ring.com?subject=Service-Audit%20anfragen"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#081827] px-5 text-[14px] font-black text-white transition-colors hover:bg-[#B8643E]"
              >
                {copy.primaryCta}
              </a>
              <a
                href={presentationHref}
                download
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#dce7f1] bg-white px-5 text-[14px] font-black text-[#081827] transition-colors hover:border-[#B8643E]"
              >
                {copy.secondaryCta}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
