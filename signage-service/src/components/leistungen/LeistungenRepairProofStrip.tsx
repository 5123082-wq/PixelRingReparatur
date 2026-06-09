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
    eyebrow: 'Ähnliche Fälle',
    title: 'So sehen typische Reparaturfälle aus',
    intro:
      'Kurze visuelle Beispiele helfen oft schneller als technische Begriffe. Die Bilder sind sichere Beispielmotive und zeigen typische Situationen aus Reparatur, Diagnose und Service.',
    primaryCta: 'Foto der Werbeanlage senden',
    secondaryCta: 'Mehr Beispiele ansehen',
    cases: [
      {
        tag: 'Leuchtkasten',
        title: 'Ein Teil der Fläche bleibt dunkel',
        before: 'Vorher: ungleiches Licht und gealterter Kasten.',
        result: 'Danach: Lichtfeld, Netzteil und LED-Zonen sind geprüft.',
        image: '/images/references/lightbox-lift.webp',
        alt: 'Servicebeispiel für die Reparatur eines Leuchtkastens',
      },
      {
        tag: 'LED',
        title: 'Buchstaben oder Module fallen aus',
        before: 'Vorher: einzelne Zonen fehlen im Lichtbild.',
        result: 'Danach: defekte Module werden lokal eingeordnet.',
        image: '/images/references/led-detail.webp',
        alt: 'Nahaufnahme von LED-Modulen bei einer Werbeanlagen-Reparatur',
      },
      {
        tag: 'Folie',
        title: 'Folie löst sich oder wirkt alt',
        before: 'Vorher: Kanten, Blasen oder UV-Schäden sind sichtbar.',
        result: 'Danach: Oberfläche, Material und Teilersatz werden geprüft.',
        image: '/images/references/window-film-install.webp',
        alt: 'Beispiel für Folienarbeit an einer Schaufensterfläche',
      },
    ],
  },
  en: {
    eyebrow: 'Similar cases',
    title: 'What typical repair cases look like',
    intro:
      'Visual examples are often easier than technical terms. These are safe illustrative assets showing common repair, diagnostic and service situations.',
    primaryCta: 'Send a photo of the sign',
    secondaryCta: 'View more examples',
    cases: [
      {
        tag: 'Lightbox',
        title: 'Part of the light field stays dark',
        before: 'Before: uneven light and a tired housing.',
        result: 'After: light field, power supply and LED zones are checked.',
        image: '/images/references/lightbox-lift.webp',
        alt: 'Service example for a lightbox repair',
      },
      {
        tag: 'LED',
        title: 'Letters or modules fail',
        before: 'Before: individual zones are missing from the light image.',
        result: 'After: failed modules are classified locally.',
        image: '/images/references/led-detail.webp',
        alt: 'Close-up of LED modules during signage repair',
      },
      {
        tag: 'Film',
        title: 'Film peels or looks aged',
        before: 'Before: edges, bubbles or UV damage are visible.',
        result: 'After: surface, material and partial replacement are checked.',
        image: '/images/references/window-film-install.webp',
        alt: 'Example of film work on a storefront surface',
      },
    ],
  },
  ru: {
    eyebrow: 'Похожие случаи',
    title: 'Как выглядят типовые заявки на ремонт',
    intro:
      'По фото часто проще понять проблему, чем по техническому названию. Это безопасные примерные изображения: они показывают типичные ситуации ремонта, диагностики и сервиса.',
    primaryCta: 'Отправить фото вывески',
    secondaryCta: 'Смотреть больше примеров',
    cases: [
      {
        tag: 'Световой короб',
        title: 'Часть светового поля темная',
        before: 'До: неравномерный свет и уставший корпус.',
        result: 'После: проверяются световое поле, питание и LED-зоны.',
        image: '/images/references/lightbox-lift.webp',
        alt: 'Пример ремонта светового короба',
      },
      {
        tag: 'LED',
        title: 'Не горят буквы или модули',
        before: 'До: отдельные зоны выпадают из световой картинки.',
        result: 'После: дефектные модули можно оценить точечно.',
        image: '/images/references/led-detail.webp',
        alt: 'Крупный план LED-модулей при ремонте вывески',
      },
      {
        tag: 'Пленка',
        title: 'Пленка отклеилась или состарилась',
        before: 'До: видны края, пузыри или выцветание.',
        result: 'После: проверяется поверхность, материал и частичная замена.',
        image: '/images/references/window-film-install.webp',
        alt: 'Пример работы с пленкой на витрине',
      },
    ],
  },
  tr: {
    eyebrow: 'Benzer durumlar',
    title: 'Tipik onarım talepleri nasıl görünür?',
    intro:
      'Görsel örnekler teknik terimlerden daha hızlı anlaşılır. Bunlar onarım, teşhis ve servis için güvenli örnek görsellerdir.',
    primaryCta: 'Tabela fotoğrafı gönder',
    secondaryCta: 'Daha fazla örnek gör',
    cases: [
      {
        tag: 'Işıklı kutu',
        title: 'Işık alanının bir kısmı karanlık',
        before: 'Önce: düzensiz ışık ve yıpranmış kasa.',
        result: 'Sonra: ışık alanı, güç kaynağı ve LED bölgeleri kontrol edilir.',
        image: '/images/references/lightbox-lift.webp',
        alt: 'Işıklı kutu onarımı için servis örneği',
      },
      {
        tag: 'LED',
        title: 'Harfler veya modüller çalışmıyor',
        before: 'Önce: ışık görüntüsünde bazı bölgeler eksik.',
        result: 'Sonra: arızalı modüller yerinde sınıflandırılır.',
        image: '/images/references/led-detail.webp',
        alt: 'Tabela onarımında LED modüllerinin yakın görünümü',
      },
      {
        tag: 'Folyo',
        title: 'Folyo kalkıyor veya eski görünüyor',
        before: 'Önce: kenarlar, kabarcıklar veya UV hasarı görünür.',
        result: 'Sonra: yüzey, malzeme ve kısmi değişim kontrol edilir.',
        image: '/images/references/window-film-install.webp',
        alt: 'Vitrin yüzeyinde folyo çalışması örneği',
      },
    ],
  },
  pl: {
    eyebrow: 'Podobne przypadki',
    title: 'Jak wyglądają typowe naprawy',
    intro:
      'Przykłady wizualne są często prostsze niż nazwy techniczne. To bezpieczne obrazy poglądowe pokazujące typowe sytuacje naprawy, diagnostyki i serwisu.',
    primaryCta: 'Wyślij zdjęcie szyldu',
    secondaryCta: 'Zobacz więcej przykładów',
    cases: [
      {
        tag: 'Kaseton',
        title: 'Część pola świetlnego jest ciemna',
        before: 'Przed: nierówne światło i zużyta obudowa.',
        result: 'Po: sprawdzane są pole świetlne, zasilanie i strefy LED.',
        image: '/images/references/lightbox-lift.webp',
        alt: 'Przykład serwisowy naprawy kasetonu świetlnego',
      },
      {
        tag: 'LED',
        title: 'Litery albo moduły nie świecą',
        before: 'Przed: pojedyncze strefy znikają z obrazu światła.',
        result: 'Po: uszkodzone moduły są oceniane punktowo.',
        image: '/images/references/led-detail.webp',
        alt: 'Zbliżenie modułów LED podczas naprawy reklamy',
      },
      {
        tag: 'Folia',
        title: 'Folia odchodzi albo wygląda staro',
        before: 'Przed: widoczne krawędzie, pęcherze lub wyblaknięcie.',
        result: 'Po: sprawdzana jest powierzchnia, materiał i częściowa wymiana.',
        image: '/images/references/window-film-install.webp',
        alt: 'Przykład pracy z folią na witrynie',
      },
    ],
  },
  ar: {
    eyebrow: 'حالات مشابهة',
    title: 'كيف تبدو طلبات الإصلاح المعتادة',
    intro:
      'الأمثلة المرئية أسهل غالباً من المصطلحات التقنية. هذه صور توضيحية آمنة لحالات إصلاح وتشخيص وخدمة شائعة.',
    primaryCta: 'إرسال صورة اللوحة',
    secondaryCta: 'عرض أمثلة أكثر',
    cases: [
      {
        tag: 'صندوق مضيء',
        title: 'جزء من مساحة الإضاءة مظلم',
        before: 'قبل: ضوء غير متساو وهيكل متعب.',
        result: 'بعد: يتم فحص مجال الضوء والطاقة ومناطق LED.',
        image: '/images/references/lightbox-lift.webp',
        alt: 'مثال خدمة لإصلاح صندوق مضيء',
      },
      {
        tag: 'LED',
        title: 'حروف أو وحدات لا تعمل',
        before: 'قبل: مناطق منفردة غائبة من صورة الضوء.',
        result: 'بعد: يتم تقييم الوحدات المعطلة في موضعها.',
        image: '/images/references/led-detail.webp',
        alt: 'لقطة قريبة لوحدات LED أثناء إصلاح لوحة',
      },
      {
        tag: 'فيلم',
        title: 'الفيلم يتقشر أو يبدو قديماً',
        before: 'قبل: حواف أو فقاعات أو بهتان ظاهر.',
        result: 'بعد: يتم فحص السطح والمادة والاستبدال الجزئي.',
        image: '/images/references/window-film-install.webp',
        alt: 'مثال على عمل فيلم لاصق على واجهة',
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
