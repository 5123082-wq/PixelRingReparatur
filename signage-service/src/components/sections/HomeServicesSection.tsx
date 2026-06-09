import { Link } from '@/i18n/routing';
import SectionEyebrow from '../common/SectionEyebrow';

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

type HomeServiceCard = {
  title: string;
  text: string;
  href: string;
  tag: string;
};

type HomeServicesCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  overviewLabel: string;
  cards: HomeServiceCard[];
};

const HOME_SERVICES_COPY: Record<Locale, HomeServicesCopy> = {
  de: {
    eyebrow: 'Leistungen',
    title: 'Direkter Einstieg in die passenden Servicebereiche',
    intro:
      'Wenn die Aufgabe schon klar ist, führen diese Einstiege direkt zu Reparatur, Diagnose, Montage oder Branding-Service.',
    overviewLabel: 'Alle Leistungen ansehen',
    cards: [
      {
        title: 'Werbeanlagen-Reparatur',
        text: 'Defekte Schilder, Leuchtkästen, Buchstaben, Folien und sichtbare Schäden strukturiert klären.',
        href: '/leistungen/werbeanlagen-reparatur',
        tag: 'Reparatur',
      },
      {
        title: 'LED-Modernisierung',
        text: 'Lichtwerbung, LED-Module, Netzteile, Controller und Neon sinnvoll prüfen und aktualisieren.',
        href: '/leistungen/lichtwerbung-led-modernisierung',
        tag: 'Licht',
      },
      {
        title: 'Audit & Diagnose',
        text: 'Zustand, Ursache, Umfang und Priorität einer Werbeanlage nachvollziehbar erfassen.',
        href: '/leistungen/werbeanlagen-audit-diagnose',
        tag: 'Prüfung',
      },
      {
        title: 'Montage & Demontage',
        text: 'Montage, Rückbau oder Standortwechsel von Werbeanlagen koordiniert vorbereiten.',
        href: '/leistungen/montage-demontage-werbeanlagen',
        tag: 'Montage',
      },
      {
        title: 'Druck & Branding',
        text: 'Druckprodukte, Folien, Beschriftungen und Werbematerialien für Geschäftsstandorte.',
        href: '/leistungen/druckprodukte-branding-werbematerialien',
        tag: 'Branding',
      },
      {
        title: 'Wartung & Standort-Service',
        text: 'Regelmäßige Kontrolle sichtbarer Anlagen, Materialien und Prioritäten pro Standort.',
        href: '/leistungen',
        tag: 'Service',
      },
    ],
  },
  en: {
    eyebrow: 'Services',
    title: 'A direct path into the right service area',
    intro:
      'When the task is already clear, these entries lead directly to repair, diagnostics, installation or branding service.',
    overviewLabel: 'View all services',
    cards: [
      {
        title: 'Signage repair',
        text: 'Clarify damaged signs, lightboxes, letters, vinyl and visible defects in a structured way.',
        href: '/leistungen/werbeanlagen-reparatur',
        tag: 'Repair',
      },
      {
        title: 'LED modernization',
        text: 'Review and update illuminated signage, LED modules, power supplies, controllers and neon.',
        href: '/leistungen/lichtwerbung-led-modernisierung',
        tag: 'Light',
      },
      {
        title: 'Audit & diagnostics',
        text: 'Record condition, cause, scope and priority of a signage asset in a traceable way.',
        href: '/leistungen/werbeanlagen-audit-diagnose',
        tag: 'Check',
      },
      {
        title: 'Installation & dismantling',
        text: 'Prepare installation, removal or relocation of signage with clear coordination.',
        href: '/leistungen/montage-demontage-werbeanlagen',
        tag: 'Install',
      },
      {
        title: 'Print & branding',
        text: 'Print products, vinyl, lettering and advertising materials for business locations.',
        href: '/leistungen/druckprodukte-branding-werbematerialien',
        tag: 'Branding',
      },
      {
        title: 'Maintenance & site service',
        text: 'Regular checks of visible assets, materials and priorities for each location.',
        href: '/leistungen',
        tag: 'Service',
      },
    ],
  },
  ru: {
    eyebrow: 'Услуги',
    title: 'Быстрый вход в нужное сервисное направление',
    intro:
      'Если задача уже понятна, эти ссылки ведут прямо к ремонту, диагностике, монтажу или брендингу.',
    overviewLabel: 'Все услуги',
    cards: [
      {
        title: 'Ремонт вывесок',
        text: 'Структурно разобрать дефект вывески, светового короба, букв, пленок и видимых повреждений.',
        href: '/leistungen/werbeanlagen-reparatur',
        tag: 'Ремонт',
      },
      {
        title: 'LED-модернизация',
        text: 'Проверить и обновить световую рекламу, LED-модули, блоки питания, контроллеры и неон.',
        href: '/leistungen/lichtwerbung-led-modernisierung',
        tag: 'Свет',
      },
      {
        title: 'Аудит и диагностика',
        text: 'Понятно зафиксировать состояние, причину, объем и приоритет по рекламной установке.',
        href: '/leistungen/werbeanlagen-audit-diagnose',
        tag: 'Проверка',
      },
      {
        title: 'Монтаж и демонтаж',
        text: 'Подготовить монтаж, демонтаж или перенос рекламной конструкции с координацией работ.',
        href: '/leistungen/montage-demontage-werbeanlagen',
        tag: 'Монтаж',
      },
      {
        title: 'Печать и брендинг',
        text: 'Печатная продукция, пленки, надписи и рекламные материалы для бизнес-локаций.',
        href: '/leistungen/druckprodukte-branding-werbematerialien',
        tag: 'Брендинг',
      },
      {
        title: 'Обслуживание локаций',
        text: 'Регулярная проверка видимых объектов, материалов и приоритетов по каждой точке.',
        href: '/leistungen',
        tag: 'Сервис',
      },
    ],
  },
  tr: {
    eyebrow: 'Hizmetler',
    title: 'Dogru hizmet alanina hizli giris',
    intro:
      'Talep netse bu girisler onarim, teshis, montaj veya marka hizmetine dogrudan yonlendirir.',
    overviewLabel: 'Tum hizmetleri gor',
    cards: [
      {
        title: 'Tabela onarimi',
        text: 'Tabela, isikli kutu, harf, folyo ve gorunur hasarlari duzenli sekilde netlestirme.',
        href: '/leistungen/werbeanlagen-reparatur',
        tag: 'Onarim',
      },
      {
        title: 'LED modernizasyonu',
        text: 'Isikli reklam, LED modul, guc kaynagi, kontrol cihazlari ve neon sistemlerini kontrol etme.',
        href: '/leistungen/lichtwerbung-led-modernisierung',
        tag: 'Isik',
      },
      {
        title: 'Audit ve teshis',
        text: 'Reklam sisteminin durumunu, nedenini, kapsamini ve onceligini izlenebilir sekilde kaydetme.',
        href: '/leistungen/werbeanlagen-audit-diagnose',
        tag: 'Kontrol',
      },
      {
        title: 'Montaj ve demontaj',
        text: 'Reklam sistemlerinin montaj, sokum veya yer degisikligini koordineli hazirlama.',
        href: '/leistungen/montage-demontage-werbeanlagen',
        tag: 'Montaj',
      },
      {
        title: 'Baski ve markalama',
        text: 'Is yerleri icin baski urunleri, folyolar, yazilar ve reklam malzemeleri.',
        href: '/leistungen/druckprodukte-branding-werbematerialien',
        tag: 'Marka',
      },
      {
        title: 'Bakim ve lokasyon servisi',
        text: 'Her lokasyonda gorunur varliklar, malzemeler ve oncelikler icin duzenli kontrol.',
        href: '/leistungen',
        tag: 'Servis',
      },
    ],
  },
  pl: {
    eyebrow: 'Uslugi',
    title: 'Szybkie przejscie do wlasciwego obszaru serwisu',
    intro:
      'Gdy zadanie jest jasne, te wejscia prowadza do naprawy, diagnostyki, montazu albo brandingu.',
    overviewLabel: 'Zobacz wszystkie uslugi',
    cards: [
      {
        title: 'Naprawa szyldow',
        text: 'Uporzadkowac usterki szyldow, kasetonow, liter, folii i widocznych uszkodzen.',
        href: '/leistungen/werbeanlagen-reparatur',
        tag: 'Naprawa',
      },
      {
        title: 'Modernizacja LED',
        text: 'Sprawdzic i aktualizowac reklame swietlna, moduly LED, zasilacze, sterowniki i neon.',
        href: '/leistungen/lichtwerbung-led-modernisierung',
        tag: 'Swiatlo',
      },
      {
        title: 'Audyt i diagnostyka',
        text: 'Zapisac stan, przyczyne, zakres i priorytet instalacji reklamowej w przejrzysty sposob.',
        href: '/leistungen/werbeanlagen-audit-diagnose',
        tag: 'Kontrola',
      },
      {
        title: 'Montaz i demontaz',
        text: 'Przygotowac montaz, demontaz lub przeniesienie reklamy z jasna koordynacja.',
        href: '/leistungen/montage-demontage-werbeanlagen',
        tag: 'Montaz',
      },
      {
        title: 'Druk i branding',
        text: 'Produkty drukowane, folie, oznakowanie i materialy reklamowe dla lokalizacji biznesowych.',
        href: '/leistungen/druckprodukte-branding-werbematerialien',
        tag: 'Branding',
      },
      {
        title: 'Serwis lokalizacji',
        text: 'Regularna kontrola widocznych elementow, materialow i priorytetow dla kazdej lokalizacji.',
        href: '/leistungen',
        tag: 'Serwis',
      },
    ],
  },
  ar: {
    eyebrow: 'الخدمات',
    title: 'مدخل مباشر الى مجال الخدمة المناسب',
    intro:
      'عندما تكون المهمة واضحة، تقود هذه الروابط مباشرة الى الاصلاح او التشخيص او التركيب او خدمة العلامة.',
    overviewLabel: 'عرض كل الخدمات',
    cards: [
      {
        title: 'اصلاح اللوحات',
        text: 'توضيح اعطال اللوحات والصناديق المضيئة والحروف والافلام والاضرار الظاهرة بشكل منظم.',
        href: '/leistungen/werbeanlagen-reparatur',
        tag: 'اصلاح',
      },
      {
        title: 'تحديث LED',
        text: 'فحص وتحديث الاعلانات المضيئة ووحدات LED ومزودات الطاقة ووحدات التحكم والنيون.',
        href: '/leistungen/lichtwerbung-led-modernisierung',
        tag: 'اضاءة',
      },
      {
        title: 'فحص وتشخيص',
        text: 'تسجيل الحالة والسبب والنطاق والاولوية الخاصة باللوحة بطريقة قابلة للتتبع.',
        href: '/leistungen/werbeanlagen-audit-diagnose',
        tag: 'فحص',
      },
      {
        title: 'تركيب وفك',
        text: 'تحضير تركيب او فك او نقل اللوحات الاعلانية مع تنسيق واضح للخطوات.',
        href: '/leistungen/montage-demontage-werbeanlagen',
        tag: 'تركيب',
      },
      {
        title: 'طباعة وهوية',
        text: 'مواد مطبوعة وافلام وكتابات ومواد اعلانية لمواقع الاعمال.',
        href: '/leistungen/druckprodukte-branding-werbematerialien',
        tag: 'هوية',
      },
      {
        title: 'صيانة المواقع',
        text: 'فحص منتظم للعناصر المرئية والمواد والاولوية في كل موقع.',
        href: '/leistungen',
        tag: 'خدمة',
      },
    ],
  },
};

function getCopy(locale: string): HomeServicesCopy {
  return HOME_SERVICES_COPY[(locale in HOME_SERVICES_COPY ? locale : 'de') as Locale];
}

export default function HomeServicesSection({ locale }: { locale: string }) {
  const copy = getCopy(locale);

  return (
    <section className="w-full bg-[#F7F1E8] px-6 py-16 md:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-9">
        <div className="flex flex-col gap-5 md:max-w-3xl">
          <SectionEyebrow>{copy.eyebrow}</SectionEyebrow>
          <div className="flex flex-col gap-4">
            <h2 className="text-[34px] font-black leading-[1.08] tracking-[0] text-[#0E1A2B] md:text-[42px]">
              {copy.title}
            </h2>
            <p className="max-w-2xl text-[16px] leading-[1.6] text-[#72665D] md:text-[17px]">
              {copy.intro}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {copy.cards.map((card) => (
            <Link
              key={card.href + card.title}
              href={card.href}
              className="group flex min-h-[168px] flex-col justify-between gap-5 rounded-lg border border-[#E7DDD3] bg-white px-5 py-5 text-[#0E1A2B] shadow-sm shadow-[#0E1A2B]/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-[#B8643E]/45 hover:shadow-xl hover:shadow-[#0E1A2B]/[0.07]"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[20px] font-black leading-tight tracking-[0]">
                  {card.title}
                </h3>
                <span className="shrink-0 rounded-full bg-[#F7F1E8] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#8F4C2F]">
                  {card.tag}
                </span>
              </div>
              <div className="flex items-end justify-between gap-5">
                <p className="text-[14px] leading-[1.5] text-[#72665D]">
                  {card.text}
                </p>
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E7DDD3] text-[20px] leading-none text-[#B8643E] transition group-hover:border-[#B8643E] group-hover:bg-[#B8643E] group-hover:text-white"
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/leistungen"
          className="inline-flex w-fit items-center gap-3 rounded-full border border-[#D8CBBE] px-5 py-3 text-[14px] font-extrabold text-[#0E1A2B] transition hover:border-[#B8643E] hover:text-[#8F4C2F]"
        >
          {copy.overviewLabel}
          <span aria-hidden="true" className="text-[#B8643E]">→</span>
        </Link>
      </div>
    </section>
  );
}
