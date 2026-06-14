import Image from 'next/image';

import { Link } from '@/i18n/routing';
import SectionEyebrow from '@/components/common/SectionEyebrow';

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

type ProofCase = {
  tag: string;
  title: string;
  before: string;
  result: string;
  image: string;
  alt: string;
};

type ProofContent = {
  eyebrow: string;
  title: string;
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  cases: ProofCase[];
};

const PROOF_CONTENT: Record<Locale, ProofContent> = {
  de: {
    eyebrow: 'Nach der Wiederherstellung',
    title: 'Ihre Werbung wird wieder sichtbar',
    intro:
      'Nach Prüfung und Reparatur sind Licht, Oberfläche und einzelne Elemente wieder klar sichtbar, funktionsfähig und sauber.',
    primaryCta: 'Reparatur anfragen',
    secondaryCta: 'Weitere Referenzen ansehen',
    cases: [
      {
        tag: 'Leuchtkasten',
        title: 'Der Leuchtkasten leuchtet wieder gleichmäßig',
        before: 'Vorher: ungleiches Licht und gealterter Kasten.',
        result: 'Danach: Lichtfeld, Netzteil und LED-Zonen sind geprüft und sauber abgestimmt.',
        image: '/images/references/lightbox-lift.webp',
        alt: 'Beispiel eines wieder gleichmäßig leuchtenden Leuchtkastens',
      },
      {
        tag: 'LED',
        title: 'LED-Buchstaben ergeben wieder ein klares Lichtbild',
        before: 'Vorher: einzelne Zonen fehlen im Lichtbild.',
        result: 'Danach: Defekte Module sind erkannt und gezielt instand gesetzt.',
        image: '/images/references/led-detail.webp',
        alt: 'Nahaufnahme instand gesetzter LED-Module einer Werbeanlage',
      },
      {
        tag: 'Folie',
        title: 'Folie und Oberfläche wirken wieder sauber',
        before: 'Vorher: Kanten, Blasen oder UV-Schäden sind sichtbar.',
        result: 'Danach: Oberfläche, Material und Teilersatz sind geprüft und ordentlich erneuert.',
        image: '/images/references/window-film-install.webp',
        alt: 'Beispiel einer sauber erneuerten Folie an einer Schaufensterfläche',
      },
    ],
  },
  en: {
    eyebrow: 'After restoration',
    title: 'Your advertising gets noticed again',
    intro:
      'After inspection and repair, the lighting, surfaces and individual elements look clean, functional and ready for customers again.',
    primaryCta: 'Request a repair',
    secondaryCta: 'View more completed work',
    cases: [
      {
        tag: 'Lightbox',
        title: 'The lightbox is evenly lit again',
        before: 'Before: uneven light and a tired housing.',
        result: 'After: The light field, power supply and LED zones are checked and balanced.',
        image: '/images/references/lightbox-lift.webp',
        alt: 'Example of a lightbox lit evenly again after repair',
      },
      {
        tag: 'LED',
        title: 'LED letters form a clear light image again',
        before: 'Before: individual zones are missing from the light image.',
        result: 'After: Faulty modules are identified and repaired in place.',
        image: '/images/references/led-detail.webp',
        alt: 'Close-up of repaired LED modules in outdoor advertising',
      },
      {
        tag: 'Film',
        title: 'Film and surfaces look clean again',
        before: 'Before: edges, bubbles or UV damage are visible.',
        result: 'After: The surface, material and replacement areas are checked and renewed cleanly.',
        image: '/images/references/window-film-install.webp',
        alt: 'Example of cleanly renewed film on a storefront surface',
      },
    ],
  },
  ru: {
    eyebrow: 'После восстановления',
    title: 'Ваша реклама снова станет заметной',
    intro:
      'После проверки и ремонта свет, поверхность и отдельные элементы снова приводятся в рабочий и аккуратный вид.',
    primaryCta: 'Оставить заявку на ремонт',
    secondaryCta: 'Смотреть больше выполненных работ',
    cases: [
      {
        tag: 'Световой короб',
        title: 'Световой короб снова светится ровно',
        before: 'До: неравномерный свет и уставший корпус.',
        result: 'После: Световое поле, питание и LED-зоны проверены и настроены для ровной подсветки.',
        image: '/images/references/lightbox-lift.webp',
        alt: 'Пример светового короба с ровной подсветкой после ремонта',
      },
      {
        tag: 'LED',
        title: 'LED-буквы снова дают цельную световую картину',
        before: 'До: отдельные зоны выпадают из световой картинки.',
        result: 'После: Неисправные модули найдены и восстановлены локально.',
        image: '/images/references/led-detail.webp',
        alt: 'Крупный план восстановленных LED-модулей наружной рекламы',
      },
      {
        tag: 'Пленка',
        title: 'Пленка и поверхность снова выглядят чисто',
        before: 'До: видны края, пузыри или выцветание.',
        result: 'После: Поверхность, материал и участки замены проверены и аккуратно обновлены.',
        image: '/images/references/window-film-install.webp',
        alt: 'Пример аккуратно обновленной пленки на витрине',
      },
    ],
  },
  tr: {
    eyebrow: 'Onarımdan sonra',
    title: 'Reklamınız yeniden görünür olur',
    intro:
      'Kontrol ve onarımdan sonra ışık, yüzey ve tek tek parçalar yeniden çalışır, temiz ve düzenli görünür.',
    primaryCta: 'Onarım talebi gönder',
    secondaryCta: 'Tamamlanan işleri gör',
    cases: [
      {
        tag: 'Işıklı kutu',
        title: 'Işıklı kutu yeniden eşit aydınlanır',
        before: 'Önce: düzensiz ışık ve yıpranmış kasa.',
        result: 'Sonra: Işık alanı, güç kaynağı ve LED bölgeleri kontrol edilir ve ayarlanır.',
        image: '/images/references/lightbox-lift.webp',
        alt: 'Onarımdan sonra eşit aydınlanan ışıklı kutu örneği',
      },
      {
        tag: 'LED',
        title: 'LED harfler yeniden bütün bir ışık görüntüsü verir',
        before: 'Önce: ışık görüntüsünde bazı bölgeler eksik.',
        result: 'Sonra: Arızalı modüller bulunur ve yerinde onarılır.',
        image: '/images/references/led-detail.webp',
        alt: 'Onarılan LED modüllerinin yakın görünümü',
      },
      {
        tag: 'Folyo',
        title: 'Folyo ve yüzey yeniden temiz görünür',
        before: 'Önce: kenarlar, kabarcıklar veya UV hasarı görünür.',
        result: 'Sonra: Yüzey, malzeme ve değiştirilen bölümler kontrol edilip düzgünce yenilenir.',
        image: '/images/references/window-film-install.webp',
        alt: 'Vitrinde düzgünce yenilenmiş folyo örneği',
      },
    ],
  },
  pl: {
    eyebrow: 'Po przywróceniu',
    title: 'Twoja reklama znów będzie widoczna',
    intro:
      'Po sprawdzeniu i naprawie światło, powierzchnia i poszczególne elementy znów wyglądają sprawnie, czysto i profesjonalnie.',
    primaryCta: 'Zgłoś naprawę',
    secondaryCta: 'Zobacz więcej wykonanych prac',
    cases: [
      {
        tag: 'Kaseton',
        title: 'Kaseton znów świeci równomiernie',
        before: 'Przed: nierówne światło i zużyta obudowa.',
        result: 'Po: Pole świetlne, zasilanie i strefy LED są sprawdzone i ustawione na równą pracę.',
        image: '/images/references/lightbox-lift.webp',
        alt: 'Przykład kasetonu świecącego równomiernie po naprawie',
      },
      {
        tag: 'LED',
        title: 'Litery LED znów tworzą spójny obraz światła',
        before: 'Przed: pojedyncze strefy znikają z obrazu światła.',
        result: 'Po: Uszkodzone moduły są namierzone i naprawione punktowo.',
        image: '/images/references/led-detail.webp',
        alt: 'Zbliżenie naprawionych modułów LED w reklamie zewnętrznej',
      },
      {
        tag: 'Folia',
        title: 'Folia i powierzchnia znów wyglądają czysto',
        before: 'Przed: widoczne krawędzie, pęcherze lub wyblaknięcie.',
        result: 'Po: Powierzchnia, materiał i wymieniane fragmenty są sprawdzone i starannie odnowione.',
        image: '/images/references/window-film-install.webp',
        alt: 'Przykład starannie odnowionej folii na witrynie',
      },
    ],
  },
  ar: {
    eyebrow: 'بعد الإصلاح',
    title: 'تعود إعلاناتك واضحة من جديد',
    intro:
      'بعد الفحص والإصلاح، يعود الضوء والسطح والعناصر الفردية إلى مظهر عملي ونظيف.',
    primaryCta: 'طلب إصلاح',
    secondaryCta: 'عرض المزيد من الأعمال المنجزة',
    cases: [
      {
        tag: 'صندوق مضيء',
        title: 'يضيء الصندوق المضيء بتوازن من جديد',
        before: 'قبل: ضوء غير متساو وهيكل متعب.',
        result: 'بعد: يتم فحص مساحة الإضاءة ومصدر الطاقة ومناطق LED وضبطها.',
        image: '/images/references/lightbox-lift.webp',
        alt: 'مثال لصندوق مضيء يضيء بتوازن بعد الإصلاح',
      },
      {
        tag: 'LED',
        title: 'تعود حروف LED إلى صورة ضوئية متناسقة',
        before: 'قبل: مناطق منفردة غائبة من صورة الضوء.',
        result: 'بعد: تُحدَّد الوحدات المعطلة وتُصلح في موضعها.',
        image: '/images/references/led-detail.webp',
        alt: 'لقطة قريبة لوحدات LED بعد إصلاحها',
      },
      {
        tag: 'فيلم',
        title: 'يعود الفيلم والسطح إلى مظهر نظيف',
        before: 'قبل: حواف أو فقاعات أو بهتان ظاهر.',
        result: 'بعد: يتم فحص السطح والمادة ومواضع الاستبدال وتجديدها بعناية.',
        image: '/images/references/window-film-install.webp',
        alt: 'مثال لفيلم لاصق مجدد بعناية على واجهة',
      },
    ],
  },
};

function getLocale(locale: string): Locale {
  return (locale in PROOF_CONTENT ? locale : 'de') as Locale;
}

function getCompactSentence(text: string) {
  const [sentence] = text.split(/(?<=[.!?؟])\s+/);
  return sentence || text;
}

export default function LeistungenRepairProofStrip({ locale }: { locale: string }) {
  const content = PROOF_CONTENT[getLocale(locale)];

  return (
    <section id="repair-proof" className="border-y border-[#E7DDD3] bg-[#FFFDF9] px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 text-start lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SectionEyebrow className="mb-3">{content.eyebrow}</SectionEyebrow>
            <h2 className="text-3xl font-extrabold leading-[1.08] tracking-[0] text-[#0E1A2B] sm:text-5xl">
              {content.title}
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] font-semibold leading-7 text-[#526174]">
              {getCompactSentence(content.intro)}
            </p>
          </div>
          <Link
            href="/referenzen"
            className="inline-flex min-h-11 w-fit items-center justify-center rounded-full border border-[#D9C7BA] bg-white px-4 py-2.5 text-[14px] font-bold text-[#4E5A5A] transition-colors hover:border-[#B8643E]/50 hover:text-[#8F4C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
          >
            {content.secondaryCta}
          </Link>
        </div>

        <div className="-mx-4 mt-6 overflow-x-auto px-4 pb-3 [scrollbar-width:thin] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
          {content.cases.map((item) => (
            <article
              key={item.title}
              className="group mb-3 inline-block w-[78vw] overflow-hidden rounded-[18px] border border-[#E7DDD3] bg-white align-top shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(13,27,42,0.09)] sm:w-[340px] lg:mb-0 lg:w-auto"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0E1A2B]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/72">
                    {item.tag}
                  </p>
                  <h3 className="mt-1 text-[20px] font-extrabold leading-tight tracking-[0]">
                    {item.title}
                  </h3>
                </div>
              </div>
              <div className="p-4 text-start">
                <p className="line-clamp-2 text-[14px] font-semibold leading-6 text-[#24594D]">
                  {item.result.replace(/^Danach: /, '').replace(/^After: /, '').replace(/^После: /, '').replace(/^Sonra: /, '').replace(/^Po: /, '').replace(/^بعد: /, '')}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
