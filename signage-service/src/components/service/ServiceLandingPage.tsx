import CmsImage from '@/components/common/CmsImage';
import type {
  CmsListItemContent,
  ServiceMetricCmsContent,
  ServicePageCmsContent,
  ServicePackageCmsContent,
} from '@/lib/cms/pages';

import ServiceCalculator from './ServiceCalculator';

type ServiceLandingPageProps = {
  content: ServicePageCmsContent;
  locale: string;
  preview?: boolean;
};

const FALLBACK_METRICS: ServiceMetricCmsContent[] = [
  { value: '01', label: 'Asset-Register für alle Standorte' },
  { value: '24h', label: 'Priorisierung kritischer Fälle' },
  { value: '1x', label: 'Zentraler Ansprechpartner' },
];

function hasEnabledSection(section: { enabled?: boolean } | undefined): boolean {
  return Boolean(section && section.enabled !== false);
}

function itemTitle(item: CmsListItemContent, fallback = ''): string {
  return item.title ?? item.label ?? item.name ?? fallback;
}

function itemText(item: CmsListItemContent): string {
  return item.description ?? item.summary ?? item.details ?? item.text ?? item.content ?? '';
}

function itemBadge(item: CmsListItemContent, fallback = ''): string {
  const record = item as Record<string, unknown>;
  return (
    item.value ??
    (typeof record.badge === 'string' ? record.badge : undefined) ??
    (typeof record.tag === 'string' ? record.tag : undefined) ??
    item.icon ??
    fallback
  );
}

function normalizeHref(href: string | undefined, locale: string, fallback: string): string {
  const value = href?.trim() || fallback;

  if (value.startsWith('/')) {
    return `/${locale}${value}`;
  }

  return value;
}

function SectionHeading({
  kicker,
  title,
  description,
  centered = false,
}: {
  kicker: string;
  title?: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-4xl'}>
      <p className="text-xs font-black uppercase tracking-[1.7px] text-[#B8643E] flex items-center gap-2.5 justify-center lg:justify-start">
        {centered ? null : <span className="h-[1px] w-[34px] bg-[#B8643E]/80 shrink-0" />}
        {kicker}
        {centered ? <span className="h-[1px] w-[34px] bg-[#B8643E]/80 shrink-0" /> : null}
      </p>
      {title ? (
        <h2 className="mt-4 font-outfit text-3xl font-extrabold leading-[1.08] text-[#0D1B2A] sm:text-5xl">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="mt-5 font-sans text-base leading-8 text-[#566273] sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

function MapPin({ className }: { className: string }) {
  return (
    <div className={`absolute h-3 w-3 rounded-full border-2 border-white bg-[#B8643E] shadow-[0_0_0_6px_rgba(184,100,62,0.12)] ${className}`}>
      <span className="absolute -inset-1 block animate-ping rounded-full bg-[#B8643E]/40" />
    </div>
  );
}

function ServiceVisual({ content, locale }: { content: ServicePageCmsContent; locale: string }) {
  const hero = content.hero;

  const imageSrc = hero?.image || '/uploads/cms-media/1778015697577-d5a238a08cc1-wide-hero-service-result.png';
  const imageFallback = hero?.fallbackSrc || '/uploads/cms-media/1778015697577-d5a238a08cc1-wide-hero-service-result.png';

  const mapBackgroundStyle = {
    backgroundImage: `
      linear-gradient(90deg, rgba(184, 100, 62, 0.07) 1px, transparent 1px),
      linear-gradient(rgba(184, 100, 62, 0.07) 1px, transparent 1px)
    `,
    backgroundSize: '26px 26px',
  };

  const mapLabels: Record<string, string> = {
    de: 'Live-Übersicht: Audit, Wartung, Reparatur, Print-Update',
    en: 'Live Map: Audit, Maintenance, Repair, Print Update',
    ru: 'Карта в реальном времени: аудит, обслуживание, ремонт, печать',
    tr: 'Canlı Harita: Denetim, Bakım, Onarım, Baskı Güncellemesi',
    pl: 'Mapa na żywo: audyt, konserwacja, naprawa, aktualizacja druku',
    ar: 'خريطة مباشرة: التدقيق، الصيانة، الإصلاح، تحديث المطبوعات',
  };

  const mapLabel = mapLabels[locale] || mapLabels.de;

  const terminalTitle = locale === 'ru' ? 'Диагностический терминал PixelRing' :
                        locale === 'tr' ? 'PixelRing Teşhis Terminali' :
                        locale === 'pl' ? 'Terminal diagnostyczny PixelRing' :
                        locale === 'ar' ? 'محطة تشخيص PixelRing' : 'PixelRing Diagnose-Terminal';

  const terminalLines = locale === 'ru' ? [
    'Сеть филиалов загружена: 18 объектов',
    'Night-Light-Check: обнаружено 3 отклонения',
    'Соответствие бренду: 86% / проверка печатных материалов',
    'Заявка создана: светодиодный модуль Берлин Центр',
  ] : locale === 'tr' ? [
    'Şube ağı yüklendi: 18 nesne',
    'Night-Light-Check: 3 sapma tespit edildi',
    'Marka Uyumluluğu: %86 / baskı malzemelerini kontrol edin',
    'Destek talebi oluşturuldu: LED modülü Berlin Mitte',
  ] : locale === 'pl' ? [
    'Sieć lokalizacji załadowana: 18 obiektów',
    'Night-Light-Check: wykryto 3 odchylenia',
    'Spójność marki: 86% / sprawdź materiały drukowane',
    'Zgłoszenie utworzone: moduł LED Berlin Mitte',
  ] : locale === 'ar' ? [
    'تم تحميل شبكة المواقع: 18 كائنًا',
    'فحص الإضاءة الليلية: تم اكتشاف 3 انحرافات',
    'اتساق العلامة التجارية: 86٪ / فحص المطبوعات',
    'تم إنشاء تذكرة: وحدة LED برلين الوسطى',
  ] : [
    'Standortnetz geladen: 18 Objekte',
    'Night-Light-Check: 3 Abweichungen erkannt',
    'Brand-Consistency: 86% / Printmaterialien prüfen',
    'Ticket erstellt: LED-Modul Berlin Mitte',
  ];

  return (
    <aside className="relative w-full min-h-0 md:min-h-[620px] lg:min-h-[510px] select-none" aria-label="PixelRing Service Dashboard Visualisierung">
      {/* Tilted Photo Container */}
      <div className="relative w-full aspect-[4/3.12] md:absolute md:top-0 md:left-0 lg:left-auto lg:right-0 md:w-full md:max-w-[560px] overflow-hidden rounded-[28px] shadow-[0_28px_70px_rgba(13,27,42,0.16)] md:rotate-[2.4deg] bg-[#D8E2EC]">
        <CmsImage
          src={imageSrc}
          fallbackSrc={imageFallback}
          alt={hero?.imageAlt ?? 'PixelRing Service'}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 560px, 100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d1b2a]/18" />
      </div>

      {/* Absolute-positioned Diagnostic Terminal */}
      <div className="relative w-full mt-4 md:mt-0 md:absolute md:w-[86%] md:max-w-[440px] md:left-0 md:bottom-[42px] lg:bottom-9 rounded-[24px] border border-[#E7DDD3]/90 bg-[#FFFDF9]/90 backdrop-blur-md shadow-[0_18px_48px_rgba(13,27,42,0.09)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E7DDD3] px-4 py-3 text-xs font-black uppercase text-[#7D7168]">
          <div className="flex gap-1.5">
            <span className="h-[9px] w-[9px] rounded-full bg-[#B8643E]" />
            <span className="h-[9px] w-[9px] rounded-full bg-[#E7DDD3]" />
            <span className="h-[9px] w-[9px] rounded-full bg-[#E7DDD3]" />
          </div>
          <span>{terminalTitle}</span>
        </div>
        <div className="grid gap-2.5 p-4.5 font-sans">
          {terminalLines.map((line, idx) => (
            <div key={idx} className="flex gap-2 text-sm font-semibold text-[#4D596A] leading-relaxed">
              <b className="text-[#B8643E]">&gt;</b>
              <span>{line}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Counter-rotated Status Cards */}
      <div className="relative w-full mt-4 md:mt-0 md:absolute md:w-[230px] md:right-0 lg:right-[22px] md:bottom-[142px] lg:bottom-[86px] grid gap-4 p-[18px] rounded-[22px] border border-[#E7DDD3]/90 bg-[#FFFDF9]/90 backdrop-blur-md shadow-[0_18px_48px_rgba(13,27,42,0.09)] md:rotate-[-3deg]">
        <div>
          <small className="block text-[11px] font-bold uppercase tracking-wider text-[#6F7A8A]">Visibility Score</small>
          <strong className="block mt-1 text-2xl font-black text-[#0D1B2A] leading-none">86%</strong>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#ECDFD4]">
            <span className="block h-full w-[86%] rounded-full bg-gradient-to-r from-[#B8643E] to-[#DC9A72]" />
          </div>
        </div>
        <div>
          <small className="block text-[11px] font-bold uppercase tracking-wider text-[#6F7A8A]">Safety Status</small>
          <strong className="block mt-1 text-2xl font-black text-[#0D1B2A] leading-none">OK</strong>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#ECDFD4]">
            <span className="block h-full w-[74%] rounded-full bg-gradient-to-r from-[#B8643E] to-[#DC9A72]" />
          </div>
        </div>
      </div>

      {/* Map with Pulsing Pins */}
      <div className="relative w-full h-[120px] mt-4 md:mt-0 md:absolute md:right-0 md:bottom-0 lg:top-[310px] lg:bottom-auto md:w-[300px] md:h-[118px] rounded-3xl border border-[#E7DDD3]/90 bg-[#FFFDF9]/90 backdrop-blur-md shadow-[0_18px_48px_rgba(13,27,42,0.09)]" style={mapBackgroundStyle}>
        <MapPin className="left-[42px] top-[34px]" />
        <MapPin className="left-[116px] top-[62px]" />
        <MapPin className="left-[205px] top-[28px]" />
        <MapPin className="left-[246px] top-[76px]" />
        <div className="absolute bottom-3.5 left-[18px] right-[18px] text-[11px] font-extrabold text-[#5B6471] leading-none">
          {mapLabel}
        </div>
      </div>
    </aside>
  );
}

function PackageCard({ item, locale }: { item: ServicePackageCmsContent; locale: string }) {
  const isRecommended = Boolean(item.recommended);
  const badgeText = item.badge || (isRecommended ? (locale === 'de' ? 'Empfohlen' :
                                                     locale === 'ru' ? 'Рекомендуем' :
                                                     locale === 'tr' ? 'Önerilen' :
                                                     locale === 'pl' ? 'Polecane' :
                                                     locale === 'ar' ? 'موصى به' : 'Recommended') : null);

  const priceNoteText = item.priceNote || (locale === 'de' ? '/ Standort / Monat' :
                                           locale === 'ru' ? '/ филиал / месяц' :
                                           locale === 'tr' ? '/ konum / ay' :
                                           locale === 'pl' ? '/ lokalizacja / miesiąc' :
                                           locale === 'ar' ? '/ موقع / شهر' : '/ Location / Month');

  const ctaText = item.cta || (locale === 'de' ? 'Anfragen' : 'Inquire');

  return (
    <article
      className={`relative flex min-h-[640px] flex-col rounded-[26px] border p-7 shadow-sm transition-all duration-300 ${
        isRecommended
          ? 'border-[#B8643E]/44 bg-[#FFFDF9] text-[#0D1B2A] shadow-[0_24px_70px_rgba(184,100,62,0.14)] lg:-translate-y-2.5'
          : 'border-[#E7DDD3] bg-[#FFFDF9] text-[#0D1B2A] hover:-translate-y-1 hover:shadow-md'
      }`}
    >
      {badgeText ? (
        <span className="absolute right-5 top-[18px] rounded-full bg-[#B8643E] px-[11px] py-[7px] text-[11px] font-black uppercase tracking-[0.6px] text-white leading-none">
          {badgeText}
        </span>
      ) : null}
      <h3 className="font-outfit text-2xl font-extrabold text-[#0D1B2A]">{item.title}</h3>
      {item.description ? (
        <p className="mt-3 text-sm leading-relaxed text-[#536072]">
          {item.description}
        </p>
      ) : null}
      {item.price ? (
        <div className="my-6 border-y border-[#E7DDD3] py-5 text-[34px] font-extrabold leading-none text-[#0D1B2A]">
          {item.price}
          {priceNoteText ? (
            <small className="block mt-1.5 text-sm font-semibold text-[#6F7A8A]">
              {priceNoteText}
            </small>
          ) : null}
        </div>
      ) : null}
      {item.items?.length ? (
        <ul className="mb-7 space-y-3 font-sans text-sm text-[#536072]">
          {item.items.map((listItem) => (
            <li key={listItem} className="relative pl-6 leading-relaxed">
              <span className="absolute left-0 top-[0.55em] h-2.5 w-2.5 shrink-0 rounded-full bg-[#B8643E]" />
              <span>{listItem}</span>
            </li>
          ))}
        </ul>
      ) : null}
      
      {isRecommended ? (
        <a
          href="#kontakt"
          className="mt-auto inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-br from-[#B8643E] to-[#D17B50] px-5 text-sm font-black text-[#FFFDF9] shadow-[0_14px_30px_rgba(184,100,62,0.24)] transition hover:-translate-y-0.5 hover:from-[#9F5131] hover:to-[#B8643E] hover:text-white"
        >
          {ctaText}
        </a>
      ) : (
        <a
          href="#kontakt"
          className="mt-auto inline-flex h-12 items-center justify-center rounded-full border border-[#D9C7BA] bg-[#FFFDF9]/74 px-5 text-sm font-black text-[#6C5B50] shadow-[0_8px_22px_rgba(13,27,42,0.04)] transition hover:-translate-y-0.5 hover:border-[#B8643E]/42 hover:bg-white hover:text-[#B8643E] hover:shadow-[0_10px_28px_rgba(13,27,42,0.07)]"
        >
          {ctaText}
        </a>
      )}
    </article>
  );
}

const REPORT_TRANSLATIONS: Record<string, {
  title: string;
  items: [string, string, string][]; // [label, status, tagType]
}> = {
  de: {
    title: 'Beispiel: Monatsreport',
    items: [
      ['Berlin Mitte · LED-Buchstabe', 'Planen', 'orange'],
      ['Potsdam · Schaufensterfolie', 'OK', 'green'],
      ['Charlottenburg · Poster veraltet', 'Update', 'orange'],
      ['Spandau · Schild wackelt', 'Dringend', 'red'],
    ],
  },
  en: {
    title: 'Example: Monthly Report',
    items: [
      ['Berlin Mitte · LED Letter', 'Plan', 'orange'],
      ['Potsdam · Storefront Foil', 'OK', 'green'],
      ['Charlottenburg · Poster outdated', 'Update', 'orange'],
      ['Spandau · Sign loose', 'Urgent', 'red'],
    ],
  },
  ru: {
    title: 'Пример: Месячный отчет',
    items: [
      ['Берлин Митте · Светодиодная буква', 'В плане', 'orange'],
      ['Потсдам · Витринная пленка', 'ОК', 'green'],
      ['Шарлоттенбург · Устаревший плакат', 'Обновить', 'orange'],
      ['Шпандау · Вывеска шатается', 'Срочно', 'red'],
    ],
  },
  tr: {
    title: 'Örnek: Aylık Rapor',
    items: [
      ['Berlin Mitte · LED Harfi', 'Planla', 'orange'],
      ['Potsdam · Vitrin Folyosu', 'Tamam', 'green'],
      ['Charlottenburg · Afiş güncelliğini yitirmiş', 'Güncelle', 'orange'],
      ['Spandau · Tabela sallanıyor', 'Acil', 'red'],
    ],
  },
  pl: {
    title: 'Przykład: Raport miesięczny',
    items: [
      ['Berlin Mitte · Litera LED', 'Planowanie', 'orange'],
      ['Poczdam · Folia witrynowa', 'OK', 'green'],
      ['Charlottenburg · Plakat przestarzały', 'Aktualizacja', 'orange'],
      ['Spandau · Szyld się chwieje', 'Pilne', 'red'],
    ],
  },
  ar: {
    title: 'مثال: التقرير الشهري',
    items: [
      ['برلين ميتة · حرف LED', 'تخطيط', 'orange'],
      ['بوتسدام · رقاقة نافذة العرض', 'موافق', 'green'],
      ['شارلوتنبورغ · ملصق قديم', 'تحديث', 'orange'],
      ['سبانداو · لافتة تهتز', 'عاجل', 'red'],
    ],
  },
};

const OUT_OF_100: Record<string, string> = {
  de: 'von 100',
  en: 'out of 100',
  ru: 'из 100',
  tr: '/ 100',
  pl: 'na 100',
  ar: 'من 100',
};

function getScoreTagClass(scoreStr: string) {
  const num = parseInt(scoreStr, 10);
  if (isNaN(num)) return 'text-[#7B4717] bg-[#F8DEC2]'; // fallback orange
  if (num >= 90) return 'text-[#1F6A4A] bg-[#D9F0E5]';
  if (num >= 70) return 'text-[#7B4717] bg-[#F8DEC2]';
  return 'text-[#8E2F29] bg-[#F4D1CE]';
}

export default function ServiceLandingPage({ content, locale, preview = false }: ServiceLandingPageProps) {
  const hero = content.hero;
  const metrics = content.metrics?.length ? content.metrics : FALLBACK_METRICS;
  const primaryHref = normalizeHref(content.finalCta?.primaryHref, locale, 'mailto:info@pixel-ring.com?subject=Anfrage%20PixelRing%20Standort-Abo');
  const secondaryHref = normalizeHref(content.finalCta?.secondaryHref, locale, '/business');
  const tertiaryHref = normalizeHref(content.finalCta?.tertiaryHref, locale, '/leistungen');

  const reportCardBgStyle = {
    background: `
      radial-gradient(circle at 92% 0%, rgba(184, 100, 62, 0.36), transparent 34%),
      linear-gradient(135deg, #102033, #0D1B2A)
    `,
  };

  const reportTranslations = REPORT_TRANSLATIONS[locale] || REPORT_TRANSLATIONS.de;
  const outOf100Label = OUT_OF_100[locale] || OUT_OF_100.de;

  const scoreRingStyle = {
    background: `conic-gradient(#B8643E 0% 74%, #E9DDD2 74% 100%)`,
  };

  const defaultIcons = ['↯', '◎', '⌁'];

  return (
    <main id="top" className="bg-[#F7F1E8] text-[#0D1B2A] font-sans antialiased overflow-x-hidden">
      {preview ? (
        <div className="border-b border-amber-400/30 bg-amber-100 px-6 py-3 text-center text-sm font-black text-amber-900">
          Internal CMS preview. This page is hidden from ordinary public visitors.
        </div>
      ) : null}

      <section className="bg-[#EEF3FB] border-b border-[#E7DDD3]/86 px-6 py-14 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,0.98fr)] lg:items-center">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[1.7px] text-[#B8643E] flex items-center gap-2.5">
              <span className="h-[1px] w-[34px] bg-[#B8643E]/80 shrink-0" />
              {hero?.badge ?? 'Subscription Model für Standorte'}
            </p>
            <h1 className="mt-5 font-outfit text-4xl font-extrabold leading-[1.02] text-[#0D1B2A] sm:text-6xl lg:text-[76px]">
              {hero?.title ?? 'Ihre sichtbare Marke.'}
              {hero?.titleAccent ? (
                <span className="block text-[#B8643E]">{hero.titleAccent}</span>
              ) : null}
            </h1>
            <p className="mt-6 max-w-[640px] text-lg leading-relaxed text-[#344154]">
              {hero?.description ??
                'Regelmäßiger Audit, Wartung und Kontrolle Ihrer Werbeanlagen, Leuchtreklamen, Schaufensterfolien und Printmedien - bevor defekte Schilder, alte Poster oder beschädigte Folien Ihren Kunden auffallen.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#pakete"
                className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-br from-[#B8643E] to-[#D17B50] px-6 text-sm font-black text-white shadow-[0_14px_30px_rgba(184,100,62,0.24)] transition hover:-translate-y-0.5 hover:from-[#9F5131] hover:to-[#B8643E]"
              >
                {hero?.ctaPrimary ?? 'Abo-Pakete ansehen'}
              </a>
              <a
                href="#rechner"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#D9C7BA] bg-[#FFFDF9]/70 px-6 text-sm font-black text-[#6C5B50] shadow-[0_8px_22px_rgba(13,27,42,0.04)] transition hover:-translate-y-0.5 hover:border-[#B8643E]/42 hover:bg-white hover:text-[#B8643E]"
              >
                {hero?.ctaSecondary ?? 'Abo grob kalkulieren'}
              </a>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3 max-w-[690px]">
              {metrics.map((metric) => (
                <div key={`${metric.value}-${metric.label}`} className="min-h-[116px] p-4.5 border border-[#D9C7BA]/72 bg-[#FFFDF9]/62 rounded-[20px]">
                  <strong className="block text-[26px] font-extrabold text-[#B8643E] leading-none mb-3">{metric.value}</strong>
                  <span className="block text-sm font-bold leading-normal text-[#5F6978]">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ServiceVisual content={content} locale={locale} />
        </div>
      </section>

      {hasEnabledSection(content.problems) ? (
        <section id="problem" className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              kicker="Das eigentliche Problem"
              title={content.problems?.title}
              description={content.problems?.description}
            />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {content.problems?.items?.map((item, index) => (
                <article
                  key={`${itemTitle(item)}-${index}`}
                  className="relative min-h-[260px] p-[26px] border border-[#E7DDD3] bg-[#FFFDF9]/78 rounded-[20px] shadow-[0_10px_28px_rgba(13,27,42,0.07)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="absolute right-5 top-[14px] text-[70px] font-black leading-none text-[#B8643E]/12 select-none pointer-events-none">
                    {itemBadge(item, `0${index + 1}`)}
                  </div>
                  <div className="mb-[22px] flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#F4E6DC] text-xl text-[#B8643E]">
                    {item.icon || defaultIcons[index % defaultIcons.length]}
                  </div>
                  <h3 className="font-outfit text-xl font-extrabold text-[#0D1B2A]">{itemTitle(item)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5A6574]">{itemText(item)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hasEnabledSection(content.model) ? (
        <section id="abo" className="bg-transparent px-6 py-10 sm:py-16">
          <div className="mx-auto max-w-7xl rounded-[30px] border border-[#E7DDD3] bg-gradient-to-br from-[#FFFDF9] to-[#F3EEE7] p-6 sm:p-8 md:p-10 shadow-[0_18px_48px_rgba(13,27,42,0.09)] lg:grid lg:grid-cols-[minmax(0,1.12fr)_minmax(330px,0.88fr)] gap-8 items-stretch">
            <div className="flex flex-col justify-between">
              <div>
                <SectionHeading
                  kicker="PixelRing Standort-Abo"
                  title={content.model?.title}
                  description={content.model?.description}
                />
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {content.model?.items?.map((item) => (
                    <div
                      key={itemTitle(item)}
                      className="relative rounded-2xl border border-[#D9C7BA]/72 bg-white p-4 pl-11 text-sm leading-relaxed text-[#5A6574]"
                    >
                      <span className="absolute left-[17px] top-5 h-3.5 w-3.5 rounded-full bg-[#B8643E] shadow-[0_0_0_5px_rgba(184,100,62,0.1)]" />
                      <b className="block text-[#0D1B2A] mb-1">{itemTitle(item)}</b>
                      <span>{itemText(item)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Report Card */}
            <div className="flex flex-col justify-between gap-6 rounded-[24px] p-6 text-white shadow-[0_26px_52px_rgba(13,27,42,0.18)]" style={reportCardBgStyle}>
              <div>
                <h3 className="font-outfit text-xl font-extrabold text-white">{reportTranslations.title}</h3>
                <div className="mt-4 space-y-1 font-sans">
                  {reportTranslations.items.map(([label, status, tagType]) => {
                    let tagClasses = 'text-[#7B4717] bg-[#F8DEC2]'; // orange
                    if (tagType === 'green') tagClasses = 'text-[#1F6A4A] bg-[#D9F0E5]';
                    if (tagType === 'red') tagClasses = 'text-[#8E2F29] bg-[#F4D1CE]';
                    return (
                      <div key={label} className="flex items-center justify-between gap-3 border-b border-white/12 py-3.5 text-sm text-white/82">
                        <span>{label}</span>
                        <span className={`inline-flex min-w-[76px] justify-center rounded-full px-2.5 py-1 text-xs font-black uppercase tracking-wider ${tagClasses}`}>
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <a
                href="#kontakt"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-br from-[#B8643E] to-[#D17B50] px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(184,100,62,0.24)] transition hover:from-[#9F5131] hover:to-[#B8643E]"
              >
                {content.model?.cta ?? (locale === 'de' ? 'Audit-Termin starten' : 'Start Audit')}
              </a>
            </div>
          </div>
        </section>
      ) : null}

      {hasEnabledSection(content.packages) ? (
        <section id="pakete" className="bg-[#FFFDF9] border-y border-[#E7DDD3] px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              kicker="Pakete"
              title={content.packages?.title}
              description={content.packages?.description}
              centered
            />
            <div className="mt-10 grid gap-5 lg:grid-cols-3 items-stretch">
              {content.packages?.items?.map((item) => (
                <PackageCard key={item.id ?? item.title} item={item} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hasEnabledSection(content.process) ? (
        <section className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading kicker="Ablauf" title={content.process?.title} />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {content.process?.items?.map((item, index) => (
                <article key={itemTitle(item)} className="rounded-[22px] border border-[#E7DDD3] bg-[#FFFDF9]/78 p-6 shadow-sm">
                  <div className="text-xs font-black uppercase tracking-[1.4px] text-[#B8643E]">
                    {itemBadge(item, `STEP 0${index + 1}`)}
                  </div>
                  <h3 className="mt-8 font-outfit text-lg font-extrabold text-[#0D1B2A]">{itemTitle(item)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5A6574]">{itemText(item)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {content.calculator?.enabled !== false ? (
        <ServiceCalculator
          title={content.calculator?.title}
          description={content.calculator?.description}
          note={content.calculator?.note}
          defaultLocations={content.calculator?.defaultLocations}
          options={content.calculator?.options}
          footnote={content.calculator?.footnote}
          locale={locale}
        />
      ) : null}

      {hasEnabledSection(content.portalPreview) ? (
        <section id="portal" className="bg-[#EEF3FB] border-y border-[#E7DDD3] px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              kicker="Kundenportal"
              title={content.portalPreview?.title}
              description={content.portalPreview?.description}
              centered
            />
            <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_0.75fr] items-stretch">
              {/* Dashboard list card */}
              <div className="rounded-[20px] border border-[#E7DDD3] bg-[#FFFDF9]/82 p-6 shadow-[0_10px_28px_rgba(13,27,42,0.07)]">
                <h3 className="font-outfit text-xl font-extrabold text-[#0D1B2A]">
                  {locale === 'de' ? 'Standort-Übersicht' :
                   locale === 'ru' ? 'Обзор филиалов' :
                   locale === 'tr' ? 'Şube Özeti' :
                   locale === 'pl' ? 'Podsumowanie lokalizacji' :
                   locale === 'ar' ? 'نظرة عامة على المواقع' : 'Locations Overview'}
                </h3>
                <div className="mt-5 space-y-1 font-sans">
                  {content.portalPreview?.items?.map((item) => (
                    <div key={itemTitle(item)} className="flex items-center justify-between gap-4 border-b border-[#E7DDD3] py-3.5 last:border-0">
                      <div>
                        <b className="block text-[#0D1B2A]">{itemTitle(item)}</b>
                        <span className="mt-1 block text-sm text-[#6F7A8A]">{itemText(item)}</span>
                      </div>
                      <span className={`inline-flex min-w-[50px] justify-center rounded-full px-2.5 py-1 text-xs font-black tracking-wider ${getScoreTagClass(itemBadge(item))}`}>
                        {itemBadge(item)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Health Score ring card */}
              <div className="flex flex-col justify-between rounded-[20px] border border-[#E7DDD3] bg-[#FFFDF9]/82 p-6 text-center shadow-[0_10px_28px_rgba(13,27,42,0.07)]">
                <h3 className="font-outfit text-xl font-extrabold text-[#0D1B2A]">Brand Health Score</h3>
                <div className="mx-auto my-5 grid h-[210px] w-[210px] place-items-center rounded-full shadow-sm" style={scoreRingStyle}>
                  <div className="grid h-[148px] w-[148px] place-content-center place-items-center rounded-full bg-[#FFFDF9] shadow-[inset_0_0_0_1px_#E7DDD3]">
                    <strong className="block text-5xl font-black text-[#0D1B2A] leading-none">74</strong>
                    <small className="mt-1 font-bold text-[#6F7A8A] text-xs uppercase tracking-wider">{outOf100Label}</small>
                  </div>
                </div>
                <p className="font-sans text-sm leading-relaxed text-[#6F7A8A]">
                  Kombiniert Sichtbarkeit, Lichtfunktion, Aktualität der Printmedien, Sauberkeit, Branding und technische Risiken.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {hasEnabledSection(content.industries) ? (
        <section className="bg-[#FFFDF9] px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading kicker="Für wen?" title={content.industries?.title} />
            <div className="mt-8 flex flex-wrap gap-3">
              {content.industries?.items?.map((item) => (
                <span key={item} className="inline-flex min-h-[46px] items-center rounded-full border border-[#D9C7BA] bg-[#FFFDF9]/82 px-[18px] text-sm font-black text-[#665c54] shadow-[0_8px_22px_rgba(13,27,42,0.04)]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hasEnabledSection(content.faq) ? (
        <section id="faq" className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <SectionHeading kicker="FAQ" title={content.faq?.title} centered />
            <div className="mt-10 space-y-3">
              {content.faq?.items?.map((item, index) => (
                <details key={item.question} open={index === 0} className="group rounded-2xl border border-[#E7DDD3] bg-[#FFFDF9]/78 p-5 transition shadow-sm">
                  <summary className="cursor-pointer font-outfit text-lg font-extrabold text-[#0D1B2A] list-none flex justify-between items-center outline-none select-none">
                    <span>{item.question}</span>
                    <span className="ml-2 font-light text-xl text-[#B8643E] transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 font-sans text-sm leading-relaxed text-[#5B6574] border-t border-[#E7DDD3]/50 pt-4">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hasEnabledSection(content.finalCta) ? (
        <section id="kontakt" className="bg-[#0D1B2A] px-6 py-20 text-white sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-[30px] border border-white/10 bg-gradient-to-br from-[#102033] to-[#0D1B2A] p-6 sm:p-8 md:p-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center shadow-2xl relative overflow-hidden">
            {/* Ambient Glowing Sphere */}
            <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-[#B8643E]/12 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-[1.7px] text-[#D17B50] flex items-center gap-2.5">
                <span className="h-[1px] w-[34px] bg-[#D17B50]/80 shrink-0" />
                {content.finalCta?.badge ?? 'Starten mit einem Audit'}
              </p>
              <h2 className="mt-4 max-w-4xl font-outfit text-3xl font-extrabold leading-[1.08] sm:text-5xl">
                {content.finalCta?.title}
              </h2>
              <p className="mt-5 max-w-3xl font-sans text-base leading-relaxed text-white/72">
                {content.finalCta?.description}
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
              <a href={primaryHref} className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-br from-[#B8643E] to-[#D17B50] px-6 text-sm font-black text-white shadow-[0_14px_30px_rgba(184,100,62,0.24)] transition hover:-translate-y-0.5 hover:from-[#9F5131] hover:to-[#B8643E]">
                {content.finalCta?.primaryLabel ?? 'E-Mail senden'}
              </a>
              <a href={secondaryHref} className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-black text-white/82 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/40 hover:text-white">
                {content.finalCta?.secondaryLabel ?? 'Zur Business-Seite'}
              </a>
              <a href={tertiaryHref} className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-black text-white/82 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/40 hover:text-white">
                {content.finalCta?.tertiaryLabel ?? 'Leistungen ansehen'}
              </a>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
