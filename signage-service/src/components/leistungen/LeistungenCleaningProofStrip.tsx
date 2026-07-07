import Image from 'next/image';

import SectionEyebrow from '@/components/common/SectionEyebrow';
import { Link } from '@/i18n/routing';

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

type CleaningProofCase = {
  tag: string;
  title: string;
  text: string;
  imagePosition: string;
};

type CleaningProofContent = {
  eyebrow: string;
  title: string;
  intro: string;
  secondaryCta: string;
  cases: CleaningProofCase[];
};

const CLEANING_IMAGE =
  '/images/leistungen/werbeanlagen-reinigung/werbeanlagen-reinigung-markise-service.webp';

const CONTENT: Record<Locale, CleaningProofContent> = {
  de: {
    eyebrow: 'Fertige Servicebilder',
    title: 'Beispiele für gepflegte Außenwerbung',
    intro:
      'Die Fotos zeigen typische fertige Servicebilder rund um Markisen, Leuchtkästen und Geschäftsfronten. Für konkrete Projektbeispiele öffnen Sie die Referenzen.',
    secondaryCta: 'Weitere Beispiele ansehen',
    cases: [
      {
        tag: 'Markise',
        title: 'Markisen & Geschäftsfronten',
        text: 'Gepflegte Markisen, saubere Ladenfronten und ein ordentlicher erster Eindruck am Standort.',
        imagePosition: 'object-[72%_42%]',
      },
      {
        tag: 'Leuchtkasten',
        title: 'Leuchtkästen & Lichtflächen',
        text: 'Sichtbare Fronten, Rahmen und Lichtflächen wirken ruhiger, klarer und besser lesbar.',
        imagePosition: 'object-[88%_46%]',
      },
      {
        tag: 'Fassade',
        title: 'Fassaden & Beschriftung',
        text: 'Wenn Werbung, Glas, Schildfläche und angrenzende Bereiche zusammenpassen, wirkt der Standort stimmiger.',
        imagePosition: 'object-[28%_56%]',
      },
    ],
  },
  en: {
    eyebrow: 'Finished service views',
    title: 'Examples of cared-for outdoor advertising',
    intro:
      'The photos show typical finished service views around awnings, lightboxes and storefronts. Open the references for concrete project examples.',
    secondaryCta: 'View more examples',
    cases: [
      {
        tag: 'Awning',
        title: 'Awnings & storefronts',
        text: 'Cared-for awnings, clean storefronts and a more orderly first impression at the site.',
        imagePosition: 'object-[72%_42%]',
      },
      {
        tag: 'Lightbox',
        title: 'Lightboxes & illuminated surfaces',
        text: 'Visible fronts, frames and illuminated surfaces look calmer, clearer and easier to read.',
        imagePosition: 'object-[88%_46%]',
      },
      {
        tag: 'Facade',
        title: 'Facades & lettering',
        text: 'When advertising, glass, sign surfaces and adjacent areas work together, the site looks more coherent.',
        imagePosition: 'object-[28%_56%]',
      },
    ],
  },
  ru: {
    eyebrow: 'Готовые сервисные виды',
    title: 'Примеры ухоженной наружной рекламы',
    intro:
      'Фотографии показывают типичные готовые сервисные виды: маркизы, световые короба и фасады магазинов. Конкретные примеры проектов смотрите в референсах.',
    secondaryCta: 'Смотреть больше примеров',
    cases: [
      {
        tag: 'Маркиза',
        title: 'Маркизы и фасады магазинов',
        text: 'Ухоженные маркизы, чистая витрина и более аккуратное первое впечатление от точки.',
        imagePosition: 'object-[72%_42%]',
      },
      {
        tag: 'Световой короб',
        title: 'Световые короба и поверхности',
        text: 'Фронты, рамки и световые поверхности выглядят спокойнее, чище и лучше читаются.',
        imagePosition: 'object-[88%_46%]',
      },
      {
        tag: 'Фасад',
        title: 'Фасады и надписи',
        text: 'Когда реклама, стекло, вывеска и соседние зоны сочетаются, объект выглядит цельнее.',
        imagePosition: 'object-[28%_56%]',
      },
    ],
  },
  tr: {
    eyebrow: 'Tamamlanmış servis görünümleri',
    title: 'Bakımlı dış reklam örnekleri',
    intro:
      'Fotoğraflar tente, ışıklı kutu ve mağaza cephesi için tipik tamamlanmış servis görünümlerini gösterir. Somut proje örnekleri için referansları açın.',
    secondaryCta: 'Daha fazla örnek gör',
    cases: [
      {
        tag: 'Tente',
        title: 'Tenteler ve mağaza cepheleri',
        text: 'Bakımlı tenteler, temiz mağaza cephesi ve konumda daha düzenli bir ilk izlenim.',
        imagePosition: 'object-[72%_42%]',
      },
      {
        tag: 'Işıklı kutu',
        title: 'Işıklı kutular ve yüzeyler',
        text: 'Görünen ön yüzler, çerçeveler ve ışıklı alanlar daha sakin, daha net ve daha okunur görünür.',
        imagePosition: 'object-[88%_46%]',
      },
      {
        tag: 'Cephe',
        title: 'Cepheler ve yazılar',
        text: 'Reklam, cam, tabela yüzeyi ve çevredeki alanlar birlikte çalıştığında konum daha uyumlu görünür.',
        imagePosition: 'object-[28%_56%]',
      },
    ],
  },
  pl: {
    eyebrow: 'Gotowe widoki serwisowe',
    title: 'Przykłady zadbanej reklamy zewnętrznej',
    intro:
      'Zdjęcia pokazują typowe gotowe widoki serwisowe przy markizach, kasetonach i frontach lokali. Konkretne przykłady projektów znajdziesz w referencjach.',
    secondaryCta: 'Zobacz więcej przykładów',
    cases: [
      {
        tag: 'Markiza',
        title: 'Markizy i fronty lokali',
        text: 'Zadbane markizy, czysty front i bardziej uporządkowane pierwsze wrażenie na miejscu.',
        imagePosition: 'object-[72%_42%]',
      },
      {
        tag: 'Kaseton',
        title: 'Kasetony i powierzchnie świetlne',
        text: 'Widoczne fronty, ramy i powierzchnie świetlne wyglądają spokojniej, czytelniej i bardziej przejrzyście.',
        imagePosition: 'object-[88%_46%]',
      },
      {
        tag: 'Fasada',
        title: 'Fasady i oznakowanie',
        text: 'Gdy reklama, szkło, powierzchnia szyldu i sąsiednie strefy pasują do siebie, lokal wygląda spójniej.',
        imagePosition: 'object-[28%_56%]',
      },
    ],
  },
  ar: {
    eyebrow: 'مشاهد خدمة مكتملة',
    title: 'أمثلة لإعلانات خارجية تبدو معتنى بها',
    intro:
      'تعرض الصور مشاهد خدمة مكتملة نموذجية للمظلات والصناديق المضيئة وواجهات المتاجر. افتح المراجع للاطلاع على أمثلة مشاريع محددة.',
    secondaryCta: 'عرض المزيد من الأمثلة',
    cases: [
      {
        tag: 'مظلة',
        title: 'مظلات وواجهات متاجر',
        text: 'مظلات معتنى بها وواجهة متجر نظيفة وانطباع أول أكثر ترتيبا في الموقع.',
        imagePosition: 'object-[72%_42%]',
      },
      {
        tag: 'صندوق مضيء',
        title: 'صناديق مضيئة وأسطح إضاءة',
        text: 'تبدو الواجهات والإطارات والأسطح المضيئة أوضح وأكثر هدوءا وأسهل قراءة.',
        imagePosition: 'object-[88%_46%]',
      },
      {
        tag: 'واجهة',
        title: 'واجهات وكتابات',
        text: 'عندما تعمل الإعلانات والزجاج وسطح اللوحة والمناطق المجاورة معا، يبدو الموقع أكثر انسجاما.',
        imagePosition: 'object-[28%_56%]',
      },
    ],
  },
};

function getLocale(locale: string): Locale {
  return (locale in CONTENT ? locale : 'de') as Locale;
}

export default function LeistungenCleaningProofStrip({ locale }: { locale: string }) {
  const content = CONTENT[getLocale(locale)];

  if (content.cases.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-[#E7DDD3] bg-[#FFFDF9] px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 text-start lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SectionEyebrow className="mb-3">{content.eyebrow}</SectionEyebrow>
            <h2 className="text-3xl font-extrabold leading-[1.08] tracking-[0] text-[#0E1A2B] sm:text-5xl">
              {content.title}
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] font-semibold leading-8 text-[#526174]">
              {content.intro}
            </p>
          </div>
          <Link
            href="/referenzen#gallery"
            className="inline-flex min-h-11 w-fit items-center justify-center rounded-full border border-[#D9C7BA] bg-white px-4 py-2.5 text-[14px] font-bold text-[#4E5A5A] transition-colors hover:border-[#B8643E]/50 hover:text-[#8F4C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
          >
            {content.secondaryCta}
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {content.cases.map((item) => (
            <Link
              key={item.title}
              href="/referenzen#gallery"
              className="group relative min-h-[320px] overflow-hidden rounded-[20px] bg-[#111827] text-white shadow-[0_14px_32px_rgba(14,26,43,0.08)] outline-none transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(14,26,43,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E]"
            >
              <Image
                src={CLEANING_IMAGE}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className={`object-cover opacity-84 transition duration-500 group-hover:scale-[1.04] ${item.imagePosition}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2B]/92 via-[#0E1A2B]/24 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-start">
                <span className="inline-flex rounded-full bg-white/88 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#8F4C2F]">
                  {item.tag}
                </span>
                <h3 className="mt-4 break-words text-[24px] font-black leading-[1.05] tracking-[0]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[14px] font-semibold leading-6 text-white/78">
                  {item.text}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
