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
  hoverImage?: string;
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
        image: '/images/leistungen/repair-proof/leuchtkasten-kosmetikstudio-fassade-nachher.webp',
        alt: 'Gleichmäßig beleuchteter Leuchtkasten eines Kosmetikstudios an einer Fassade',
      },
      {
        tag: 'LED',
        title: 'LED-Buchstaben ergeben wieder ein klares Lichtbild',
        before: 'Vorher: einzelne Zonen fehlen im Lichtbild.',
        result: 'Danach: Defekte Module sind erkannt und gezielt instand gesetzt.',
        image: '/images/leistungen/repair-proof/led-leuchtbuchstaben-bildungszentrum-berlin-fassade-nachher.webp',
        alt: 'LED-Leuchtbuchstaben an der Fassade eines Bildungszentrums in Berlin',
      },
      {
        tag: 'Folie',
        title: 'Folie und Oberfläche wirken wieder sauber',
        before: 'Vorher: Kanten, Blasen oder UV-Schäden sind sichtbar.',
        result: 'Danach: Oberfläche, Material und Teilersatz sind geprüft und ordentlich erneuert.',
        image: '/images/leistungen/repair-proof/folienarbeit-apotheke-fassade-service.webp',
        alt: 'Arbeit an einer Apothekenfassade mit Lichtkreuz und erneuerter Beschriftungsfläche',
        hoverImage: '/images/leistungen/repair-proof/folienarbeit-apotheke-fassade-nachher.webp',
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
        image: '/images/leistungen/repair-proof/leuchtkasten-kosmetikstudio-fassade-nachher.webp',
        alt: 'Evenly illuminated lightbox sign for a cosmetics studio on a facade',
      },
      {
        tag: 'LED',
        title: 'LED letters form a clear light image again',
        before: 'Before: individual zones are missing from the light image.',
        result: 'After: Faulty modules are identified and repaired in place.',
        image: '/images/leistungen/repair-proof/led-leuchtbuchstaben-bildungszentrum-berlin-fassade-nachher.webp',
        alt: 'LED illuminated letters on the facade of an education center in Berlin',
      },
      {
        tag: 'Film',
        title: 'Film and surfaces look clean again',
        before: 'Before: edges, bubbles or UV damage are visible.',
        result: 'After: The surface, material and replacement areas are checked and renewed cleanly.',
        image: '/images/leistungen/repair-proof/folienarbeit-apotheke-fassade-service.webp',
        alt: 'Work on a pharmacy facade with an illuminated cross and renewed lettering surface',
        hoverImage: '/images/leistungen/repair-proof/folienarbeit-apotheke-fassade-nachher.webp',
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
        image: '/images/leistungen/repair-proof/leuchtkasten-kosmetikstudio-fassade-nachher.webp',
        alt: 'Ровно подсвеченный световой короб косметологической студии на фасаде',
      },
      {
        tag: 'LED',
        title: 'LED-буквы снова дают цельную световую картину',
        before: 'До: отдельные зоны выпадают из световой картинки.',
        result: 'После: Неисправные модули найдены и восстановлены локально.',
        image: '/images/leistungen/repair-proof/led-leuchtbuchstaben-bildungszentrum-berlin-fassade-nachher.webp',
        alt: 'Световые LED-буквы на фасаде образовательного центра в Берлине',
      },
      {
        tag: 'Пленка',
        title: 'Пленка и поверхность снова выглядят чисто',
        before: 'До: видны края, пузыри или выцветание.',
        result: 'После: Поверхность, материал и участки замены проверены и аккуратно обновлены.',
        image: '/images/leistungen/repair-proof/folienarbeit-apotheke-fassade-service.webp',
        alt: 'Работа на фасаде аптеки со световым крестом и обновленной поверхностью вывески',
        hoverImage: '/images/leistungen/repair-proof/folienarbeit-apotheke-fassade-nachher.webp',
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
        image: '/images/leistungen/repair-proof/leuchtkasten-kosmetikstudio-fassade-nachher.webp',
        alt: 'Cephede eşit aydınlanan kozmetik stüdyosu ışıklı kutu tabelası',
      },
      {
        tag: 'LED',
        title: 'LED harfler yeniden bütün bir ışık görüntüsü verir',
        before: 'Önce: ışık görüntüsünde bazı bölgeler eksik.',
        result: 'Sonra: Arızalı modüller bulunur ve yerinde onarılır.',
        image: '/images/leistungen/repair-proof/led-leuchtbuchstaben-bildungszentrum-berlin-fassade-nachher.webp',
        alt: 'Berlin’de bir eğitim merkezinin cephesinde LED ışıklı harfler',
      },
      {
        tag: 'Folyo',
        title: 'Folyo ve yüzey yeniden temiz görünür',
        before: 'Önce: kenarlar, kabarcıklar veya UV hasarı görünür.',
        result: 'Sonra: Yüzey, malzeme ve değiştirilen bölümler kontrol edilip düzgünce yenilenir.',
        image: '/images/leistungen/repair-proof/folienarbeit-apotheke-fassade-service.webp',
        alt: 'Işıklı haç ve yenilenen yazı yüzeyiyle eczane cephesinde çalışma',
        hoverImage: '/images/leistungen/repair-proof/folienarbeit-apotheke-fassade-nachher.webp',
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
        image: '/images/leistungen/repair-proof/leuchtkasten-kosmetikstudio-fassade-nachher.webp',
        alt: 'Równomiernie podświetlany kaseton studia kosmetycznego na fasadzie',
      },
      {
        tag: 'LED',
        title: 'Litery LED znów tworzą spójny obraz światła',
        before: 'Przed: pojedyncze strefy znikają z obrazu światła.',
        result: 'Po: Uszkodzone moduły są namierzone i naprawione punktowo.',
        image: '/images/leistungen/repair-proof/led-leuchtbuchstaben-bildungszentrum-berlin-fassade-nachher.webp',
        alt: 'Podświetlane litery LED na fasadzie centrum edukacyjnego w Berlinie',
      },
      {
        tag: 'Folia',
        title: 'Folia i powierzchnia znów wyglądają czysto',
        before: 'Przed: widoczne krawędzie, pęcherze lub wyblaknięcie.',
        result: 'Po: Powierzchnia, materiał i wymieniane fragmenty są sprawdzone i starannie odnowione.',
        image: '/images/leistungen/repair-proof/folienarbeit-apotheke-fassade-service.webp',
        alt: 'Praca przy fasadzie apteki z podświetlanym krzyżem i odnowioną powierzchnią oznakowania',
        hoverImage: '/images/leistungen/repair-proof/folienarbeit-apotheke-fassade-nachher.webp',
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
        image: '/images/leistungen/repair-proof/leuchtkasten-kosmetikstudio-fassade-nachher.webp',
        alt: 'صندوق إعلاني مضيء بتوازن لاستوديو تجميل على واجهة',
      },
      {
        tag: 'LED',
        title: 'تعود حروف LED إلى صورة ضوئية متناسقة',
        before: 'قبل: مناطق منفردة غائبة من صورة الضوء.',
        result: 'بعد: تُحدَّد الوحدات المعطلة وتُصلح في موضعها.',
        image: '/images/leistungen/repair-proof/led-leuchtbuchstaben-bildungszentrum-berlin-fassade-nachher.webp',
        alt: 'حروف LED مضيئة على واجهة مركز تعليمي في برلين',
      },
      {
        tag: 'فيلم',
        title: 'يعود الفيلم والسطح إلى مظهر نظيف',
        before: 'قبل: حواف أو فقاعات أو بهتان ظاهر.',
        result: 'بعد: يتم فحص السطح والمادة ومواضع الاستبدال وتجديدها بعناية.',
        image: '/images/leistungen/repair-proof/folienarbeit-apotheke-fassade-service.webp',
        alt: 'عمل على واجهة صيدلية مع صليب مضيء وسطح كتابة مجدد',
        hoverImage: '/images/leistungen/repair-proof/folienarbeit-apotheke-fassade-nachher.webp',
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
    <section id="repair-proof" className="border-y border-[#E7DDD3] bg-[#FFFDF9] py-10 sm:py-12">
      <div className="pr-site-container">
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
              className="group mb-3 inline-block w-[78vw] overflow-hidden rounded-[18px] border border-[#D9C7BA] bg-[#0E1A2B] align-top shadow-[0_16px_36px_rgba(13,27,42,0.10)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(13,27,42,0.16)] sm:w-[340px] lg:mb-0 lg:w-auto"
            >
              <div className="relative h-[360px] overflow-hidden bg-[#0E1A2B] sm:h-[360px] lg:h-[340px]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {item.hoverImage ? (
                  <Image
                    src={item.hoverImage}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover opacity-0 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/14 to-black/78" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/72 sm:text-[11px]">
                    {item.tag}
                  </p>
                  <h3 className="mt-1 text-[21px] font-extrabold leading-[1.08] tracking-[0] sm:text-[23px]">
                    {item.title}
                  </h3>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
