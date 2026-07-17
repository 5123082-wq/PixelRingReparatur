import Image from 'next/image';

import { Link } from '@/i18n/routing';
import SectionEyebrow from '../common/SectionEyebrow';

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

type HomeServiceId =
  | 'repair'
  | 'cleaning'
  | 'led'
  | 'audit'
  | 'installation'
  | 'branding'
  | 'illuminatedValance';

type HomeServiceCard = {
  id: HomeServiceId;
  title: string;
};

type HomeServicesCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  overviewEyebrow: string;
  overviewTitle: string;
  overviewMeta: string;
  overviewLabel: string;
  cards: HomeServiceCard[];
};

const HOME_SERVICE_CONFIG: Record<
  HomeServiceId,
  { href: string; image: string; imageClassName: string }
> = {
  repair: {
    href: '/leistungen/werbeanlagen-reparatur',
    image: '/images/leistungen/werbeanlagen-reparatur-led-module-pruefung.png',
    imageClassName: 'object-[42%_50%]',
  },
  cleaning: {
    href: '/leistungen/werbeanlagen-reinigung',
    image: '/images/leistungen/werbeanlagen-reinigung/werbeanlagen-reinigung-markise-service.webp',
    imageClassName: 'object-[45%_50%]',
  },
  led: {
    href: '/leistungen/lichtwerbung-led-modernisierung',
    image: '/images/leistungen/lichtwerbung-led-modernisierung-lichtkasten-led-module.webp',
    imageClassName: 'object-[20%_50%]',
  },
  audit: {
    href: '/leistungen/werbeanlagen-audit-diagnose',
    image: '/images/leistungen/werbeanlagen-audit-diagnose-ladenfassade-vor-ort-pruefung.webp',
    imageClassName: 'object-[52%_50%]',
  },
  installation: {
    href: '/leistungen/montage-demontage-werbeanlagen',
    image: '/images/leistungen/werbeanlagen-montage-demontage-sportzentrum-fassade.webp',
    imageClassName: 'object-[56%_50%]',
  },
  branding: {
    href: '/leistungen/druckprodukte-branding-werbematerialien',
    image: '/images/leistungen/hero-branding.png',
    imageClassName: 'object-[66%_50%]',
  },
  illuminatedValance: {
    href: '/leistungen/beleuchtete-markisenvolants',
    image: '/images/leistungen/beleuchtete-markisenvolants/hero-cafe-day.png',
    imageClassName: 'object-[50%_54%]',
  },
};

const HOME_SERVICES_COPY: Record<Locale, HomeServicesCopy> = {
  de: {
    eyebrow: 'Leistungen',
    title: 'Direkter Einstieg in die passenden Servicebereiche',
    intro:
      'Reparatur, Reinigung, LED-Service, Diagnose, Montage, Branding und Leuchtvolants – direkt zum passenden Bereich.',
    overviewEyebrow: 'PixelRing Leistungen',
    overviewTitle: 'Alles aus einer verantwortlichen Hand.',
    overviewMeta: '7 Servicebereiche im Überblick',
    overviewLabel: 'Alle Leistungen ansehen',
    cards: [
      {
        id: 'repair',
        title: 'Werbeanlagen-Reparatur',
      },
      {
        id: 'cleaning',
        title: 'Werbeanlagen-Reinigung',
      },
      {
        id: 'led',
        title: 'LED-Modernisierung',
      },
      {
        id: 'audit',
        title: 'Audit & Diagnose',
      },
      {
        id: 'installation',
        title: 'Montage & Demontage',
      },
      {
        id: 'branding',
        title: 'Druck & Branding',
      },
      {
        id: 'illuminatedValance',
        title: 'Leuchtvolants für Markisen',
      },
    ],
  },
  en: {
    eyebrow: 'Services',
    title: 'A direct path into the right service area',
    intro:
      'Repair, cleaning, LED service, diagnostics, installation, branding and illuminated awning valances — straight to the right service area.',
    overviewEyebrow: 'PixelRing services',
    overviewTitle: 'Everything from one accountable service team.',
    overviewMeta: '7 service areas at a glance',
    overviewLabel: 'View all services',
    cards: [
      {
        id: 'repair',
        title: 'Signage repair',
      },
      {
        id: 'cleaning',
        title: 'Signage Cleaning',
      },
      {
        id: 'led',
        title: 'LED modernization',
      },
      {
        id: 'audit',
        title: 'Audit & diagnostics',
      },
      {
        id: 'installation',
        title: 'Installation & dismantling',
      },
      {
        id: 'branding',
        title: 'Print & branding',
      },
      {
        id: 'illuminatedValance',
        title: 'Illuminated awning valances',
      },
    ],
  },
  ru: {
    eyebrow: 'Услуги',
    title: 'Быстрый вход в нужное сервисное направление',
    intro:
      'Ремонт, очистка, LED-сервис, диагностика, монтаж, брендинг и световые ламбрекены — сразу к нужному направлению.',
    overviewEyebrow: 'Услуги PixelRing',
    overviewTitle: 'Всё — в одних ответственных руках.',
    overviewMeta: '7 направлений услуг',
    overviewLabel: 'Все услуги',
    cards: [
      {
        id: 'repair',
        title: 'Ремонт вывесок',
      },
      {
        id: 'cleaning',
        title: 'Мойка вывесок',
      },
      {
        id: 'led',
        title: 'LED-модернизация',
      },
      {
        id: 'audit',
        title: 'Аудит и диагностика',
      },
      {
        id: 'installation',
        title: 'Монтаж и демонтаж',
      },
      {
        id: 'branding',
        title: 'Печать и брендинг',
      },
      {
        id: 'illuminatedValance',
        title: 'Световые ламбрекены для маркиз',
      },
    ],
  },
  tr: {
    eyebrow: 'Hizmetler',
    title: 'Doğru hizmet alanına hızlı giriş',
    intro:
      'Onarım, temizlik, LED servisi, teşhis, montaj, markalama ve ışıklı tente volanları — doğrudan ilgili hizmet alanına.',
    overviewEyebrow: 'PixelRing hizmetleri',
    overviewTitle: 'Her şey tek bir sorumlu elden.',
    overviewMeta: '7 hizmet alanına genel bakış',
    overviewLabel: 'Tüm hizmetleri gör',
    cards: [
      {
        id: 'repair',
        title: 'Tabela onarımı',
      },
      {
        id: 'cleaning',
        title: 'Tabela temizliği',
      },
      {
        id: 'led',
        title: 'LED modernizasyonu',
      },
      {
        id: 'audit',
        title: 'Audit ve teşhis',
      },
      {
        id: 'installation',
        title: 'Montaj ve demontaj',
      },
      {
        id: 'branding',
        title: 'Baskı ve markalama',
      },
      {
        id: 'illuminatedValance',
        title: 'Işıklı tente volanları',
      },
    ],
  },
  pl: {
    eyebrow: 'Usługi',
    title: 'Szybkie przejście do właściwego obszaru serwisu',
    intro:
      'Naprawa, czyszczenie, serwis LED, diagnostyka, montaż, branding i podświetlane lambrekiny markiz — prosto do właściwej usługi.',
    overviewEyebrow: 'Usługi PixelRing',
    overviewTitle: 'Wszystko u jednego odpowiedzialnego partnera.',
    overviewMeta: '7 obszarów usług w skrócie',
    overviewLabel: 'Zobacz wszystkie usługi',
    cards: [
      {
        id: 'repair',
        title: 'Naprawa szyldów',
      },
      {
        id: 'cleaning',
        title: 'Czyszczenie reklam',
      },
      {
        id: 'led',
        title: 'Modernizacja LED',
      },
      {
        id: 'audit',
        title: 'Audyt i diagnostyka',
      },
      {
        id: 'installation',
        title: 'Montaż i demontaż',
      },
      {
        id: 'branding',
        title: 'Druk i branding',
      },
      {
        id: 'illuminatedValance',
        title: 'Podświetlane lambrekiny markiz',
      },
    ],
  },
  ar: {
    eyebrow: 'الخدمات',
    title: 'مدخل مباشر إلى مجال الخدمة المناسب',
    intro:
      'الإصلاح والتنظيف وخدمة LED والتشخيص والتركيب والهوية البصرية والحواف المضيئة للمظلات — مباشرة إلى مجال الخدمة المناسب.',
    overviewEyebrow: 'خدمات PixelRing',
    overviewTitle: 'كل شيء عبر جهة واحدة مسؤولة.',
    overviewMeta: 'نظرة عامة على 7 مجالات خدمة',
    overviewLabel: 'عرض كل الخدمات',
    cards: [
      {
        id: 'repair',
        title: 'إصلاح اللوحات',
      },
      {
        id: 'cleaning',
        title: 'تنظيف اللوحات الإعلانية',
      },
      {
        id: 'led',
        title: 'تحديث LED',
      },
      {
        id: 'audit',
        title: 'فحص وتشخيص',
      },
      {
        id: 'installation',
        title: 'تركيب وفك',
      },
      {
        id: 'branding',
        title: 'طباعة وهوية',
      },
      {
        id: 'illuminatedValance',
        title: 'حواف مضيئة للمظلات',
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
    <section className="w-full bg-[#F7F1E8] py-16">
      <div className="pr-site-container flex flex-col gap-[42px]">
        <div className="flex max-w-[1000px] flex-col">
          <SectionEyebrow>{copy.eyebrow}</SectionEyebrow>
          <h2 className="mt-6 max-w-[820px] text-[32px] font-extrabold leading-[1.1] tracking-[0] text-[#0E1A2B] md:text-[42px] xl:text-[48px] xl:leading-[1.06] xl:tracking-[-0.03em]">
            {copy.title}
          </h2>
          <p className="mt-5 max-w-[1000px] text-[16px] leading-[1.6] text-[#72665D] md:text-[17px] xl:text-[18px] xl:leading-[1.55]">
            {copy.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-[18px] gap-y-[30px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Link
            href="/leistungen"
            className="group flex min-w-0 flex-col rounded-[14px] text-start text-[#0E1A2B] outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#B8643E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F1E8] motion-reduce:transform-none motion-reduce:transition-none"
          >
            <div className="flex aspect-[319.5/202] flex-col justify-between overflow-hidden rounded-[14px] border border-[#0E1A2B] bg-[#0E1A2B] p-[23px] text-white shadow-[0_8px_24px_rgba(14,26,43,0.05)] transition-[border-color,box-shadow] duration-300 group-hover:border-[#B8643E] group-hover:shadow-[0_14px_30px_rgba(14,26,43,0.12)] group-focus-visible:border-[#B8643E] motion-reduce:transition-none">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.145em] text-[#E6B295]">
                {copy.overviewEyebrow}
              </span>
              <p className="max-w-[245px] text-[24px] font-black leading-[1.08] tracking-[-0.02em] sm:text-[26px]">
                {copy.overviewTitle}
              </p>
              <span className="text-[13px] leading-normal text-[#C8D0DC]">
                {copy.overviewMeta}
              </span>
            </div>
            <h3 className="min-h-[68px] px-[3px] pt-[18px] text-[20px] font-black leading-[1.18] tracking-[-0.01em]">
              {copy.overviewLabel}
            </h3>
          </Link>

          {copy.cards.map((card) => {
            const service = HOME_SERVICE_CONFIG[card.id];

            return (
              <Link
                key={card.id}
                href={service.href}
                className="group flex min-w-0 flex-col rounded-[14px] text-start text-[#0E1A2B] outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#B8643E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F1E8] motion-reduce:transform-none motion-reduce:transition-none"
              >
                <div className="relative aspect-[319.5/202] overflow-hidden rounded-[14px] border border-[#E2D7CC] bg-white shadow-[0_8px_24px_rgba(14,26,43,0.05)] transition-[border-color,box-shadow] duration-300 group-hover:border-[#B8643E]/60 group-hover:shadow-[0_14px_30px_rgba(14,26,43,0.10)] group-focus-visible:border-[#B8643E] motion-reduce:transition-none">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="(min-width: 1440px) 320px, (min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className={`object-cover ${service.imageClassName} transition-transform duration-500 group-hover:scale-[1.04] group-focus-visible:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none`}
                  />
                </div>
                <h3 className="min-h-[68px] px-[3px] pt-[18px] text-[20px] font-black leading-[1.18] tracking-[-0.01em]">
                  {card.title}
                </h3>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
