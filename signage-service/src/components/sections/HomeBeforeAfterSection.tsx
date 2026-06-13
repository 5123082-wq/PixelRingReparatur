import Image from 'next/image';
import SectionEyebrow from '../common/SectionEyebrow';

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

type BeforeAfterCase = {
  tag: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
};

type BeforeAfterCopy = {
  eyebrow: string;
  title: string;
  titleMuted: string;
  intro: string;
  beforeLabel: string;
  afterLabel: string;
  featuredTag: string;
  featuredTitle: string;
  featuredProblem: string;
  featuredResult: string;
  featuredBeforeAlt: string;
  featuredAfterAlt: string;
  cases: BeforeAfterCase[];
  closing: BeforeAfterCase;
};

const COPY: Record<Locale, BeforeAfterCopy> = {
  de: {
    eyebrow: 'Vorher / Nachher',
    title: 'Echte Servicefälle.',
    titleMuted: 'Schnell erkennbar.',
    intro:
      'Typische Schäden und Ergebnisse bei Lichtwerbung, Folien, Buchstaben und Demontage - kompakt sichtbar, bevor Sie eine Anfrage starten.',
    beforeLabel: 'Vorher',
    afterLabel: 'Nachher',
    featuredTag: 'Leuchtkasten',
    featuredTitle: 'Leuchtkasten wieder gleichmäßig beleuchtet',
    featuredProblem: 'Vorher: ungleichmäßige Beleuchtung und dunkle Bereiche.',
    featuredResult: 'Nachher: Netzteil, LED-Module und Funktion geprüft; das sichtbare Ergebnis wurde dokumentiert.',
    featuredBeforeAlt: 'Ungleichmäßig beleuchteter Leuchtkasten vor der Reparatur',
    featuredAfterAlt: 'Gleichmäßig beleuchteter Leuchtkasten nach der Reparatur',
    cases: [
      {
        tag: 'LED-Service',
        title: 'LED flackert',
        text: 'Module und Stromversorgung geprüft, defekte Komponenten ersetzt.',
        image: '/generated/referenzen/local-main/led-module-repair.png',
        imageAlt: 'LED-Modul wird bei einer Lichtwerbung repariert',
      },
      {
        tag: 'Folie',
        title: 'Folie löst sich',
        text: 'Fläche gereinigt, Folie neu vorbereitet und sauber neu verklebt.',
        image: '/generated/referenzen/local-main/schaufensterfolie-neu-verarbeitet-service.webp',
        imageAlt: 'Schaufensterfolie wird sauber neu verarbeitet',
      },
      {
        tag: 'Buchstaben',
        title: 'Buchstaben beschädigt',
        text: 'Sichtbare Buchstaben geprüft, bei Bedarf erneuert und wieder ausgerichtet.',
        image: '/generated/referenzen/local-main/leuchtbuchstaben-beschaedigt-reparatur.webp',
        imageAlt: 'Beschädigte leuchtende Buchstaben werden repariert',
      },
      {
        tag: 'Demontage',
        title: 'Alte Anlage entfernt',
        text: 'Rückbau, Zugang und Vorbereitung für den nächsten Schritt am Standort abgestimmt.',
        image: '/generated/referenzen/local-main/alte-werbeanlage-demontage-fassade.webp',
        imageAlt: 'Alte Werbeanlage wird sicher demontiert',
      },
      {
        tag: 'Diagnose',
        title: 'Stromversorgung geprüft',
        text: 'Netzteil, Zuleitung und sichtbare Fehlerquellen geprüft und bewertet.',
        image: '/generated/referenzen/local-main/stromversorgung-werbeanlage-diagnose.webp',
        imageAlt: 'Stromversorgung einer Werbeanlage wird geprüft',
      },
      {
        tag: 'Fassade',
        title: 'Zugang vorbereitet',
        text: 'Montagepunkt, Höhe und Arbeitszugang für den Einsatz geklärt.',
        image: '/generated/referenzen/local-main/facade-mounting-check.png',
        imageAlt: 'Prüfung von Zugang und Montagepunkt an einer Fassade',
      },
    ],
    closing: {
      tag: 'Servicefall',
      title: 'Mehrere Aufgaben an einem Standort',
      text: 'Reparatur, Folie, Montage oder Rückbau können in einem klaren Serviceablauf zusammengeführt werden.',
      image: '/generated/referenzen/agent-facade/wide-hero-service-result.png',
      imageAlt: 'Abgeschlossener Serviceeinsatz an einer Geschäftsfassade',
    },
  },
  en: {
    eyebrow: 'Before / After',
    title: 'Real service cases.',
    titleMuted: 'Easy to scan.',
    intro:
      'Typical defects and outcomes for illuminated signs, window film, sign letters and dismantling - visible before you start a request.',
    beforeLabel: 'Before',
    afterLabel: 'After',
    featuredTag: 'Lightbox',
    featuredTitle: 'Lightbox lighting restored',
    featuredProblem: 'Before: uneven lighting and dark sections.',
    featuredResult: 'After: power supply, LED sections and function tested; the visible result was documented.',
    featuredBeforeAlt: 'Ungleichmäßig beleuchteter Leuchtkasten vor der Reparatur',
    featuredAfterAlt: 'Gleichmäßig beleuchteter Leuchtkasten nach der Reparatur',
    cases: [
      {
        tag: 'LED service',
        title: 'Flickering LEDs',
        text: 'LED modules and power supply were checked; faulty components were replaced.',
        image: '/generated/referenzen/local-main/led-module-repair.png',
        imageAlt: 'LED-Modul wird bei einer Lichtwerbung repariert',
      },
      {
        tag: 'Film',
        title: 'Peeling window film',
        text: 'The surface was cleaned and prepared, then the film was reapplied cleanly.',
        image: '/generated/referenzen/local-main/schaufensterfolie-neu-verarbeitet-service.webp',
        imageAlt: 'Schaufensterfolie wird sauber neu verarbeitet',
      },
      {
        tag: 'Letters',
        title: 'Damaged sign letters',
        text: 'Letter elements were inspected, repaired where needed, and realigned.',
        image: '/generated/referenzen/local-main/leuchtbuchstaben-beschaedigt-reparatur.webp',
        imageAlt: 'Beschädigte leuchtende Buchstaben werden repariert',
      },
      {
        tag: 'Dismantling',
        title: 'Old sign removed',
        text: 'Removal, access and preparation for the next site step were coordinated.',
        image: '/generated/referenzen/local-main/alte-werbeanlage-demontage-fassade.webp',
        imageAlt: 'Alte Werbeanlage wird sicher demontiert',
      },
      {
        tag: 'Diagnostics',
        title: 'Power supply checked',
        text: 'Power unit, wiring and visible fault sources were inspected.',
        image: '/generated/referenzen/local-main/stromversorgung-werbeanlage-diagnose.webp',
        imageAlt: 'Stromversorgung einer Werbeanlage wird geprüft',
      },
      {
        tag: 'Facade',
        title: 'Access prepared',
        text: 'Mounting point, height and work access were clarified before the service visit.',
        image: '/generated/referenzen/local-main/facade-mounting-check.png',
        imageAlt: 'Prüfung von Zugang und Montagepunkt an einer Fassade',
      },
    ],
    closing: {
      tag: 'Service case',
      title: 'Multiple tasks at one site',
      text: 'Repairs, film work, installation or removal can be combined in one clear service plan.',
      image: '/generated/referenzen/agent-facade/wide-hero-service-result.png',
      imageAlt: 'Abgeschlossener Serviceeinsatz an einer Geschäftsfassade',
    },
  },
  ru: {
    eyebrow: 'До / после',
    title: 'Примеры работ.',
    titleMuted: 'До и после.',
    intro:
      'Типовые ситуации: не горит световой короб, мигает LED, повреждены буквы, отклеилась пленка или нужен демонтаж.',
    beforeLabel: 'До',
    afterLabel: 'После',
    featuredTag: 'Световой короб',
    featuredTitle: 'Восстановили подсветку светового короба',
    featuredProblem: 'До: темные зоны и неровное свечение.',
    featuredResult: 'После: проверили питание и LED-модули, заменили неисправные элементы, сделали тест подсветки.',
    featuredBeforeAlt: 'Ungleichmäßig beleuchteter Leuchtkasten vor der Reparatur',
    featuredAfterAlt: 'Gleichmäßig beleuchteter Leuchtkasten nach der Reparatur',
    cases: [
      {
        tag: 'LED',
        title: 'Мигает LED-подсветка',
        text: 'Проверили модули и блок питания, заменили неисправные элементы.',
        image: '/generated/referenzen/local-main/led-module-repair.png',
        imageAlt: 'LED-Modul wird bei einer Lichtwerbung repariert',
      },
      {
        tag: 'Пленка',
        title: 'Отклеилась пленка',
        text: 'Подготовили поверхность и заново нанесли пленку.',
        image: '/generated/referenzen/local-main/schaufensterfolie-neu-verarbeitet-service.webp',
        imageAlt: 'Schaufensterfolie wird sauber neu verarbeitet',
      },
      {
        tag: 'Буквы',
        title: 'Повреждены световые буквы',
        text: 'Проверили видимые элементы и восстановили аккуратный вид.',
        image: '/generated/referenzen/local-main/leuchtbuchstaben-beschaedigt-reparatur.webp',
        imageAlt: 'Beschädigte leuchtende Buchstaben werden repariert',
      },
      {
        tag: 'Демонтаж',
        title: 'Нужно снять старую вывеску',
        text: 'Подготовили доступ, сняли конструкцию и освободили фасад.',
        image: '/generated/referenzen/local-main/alte-werbeanlage-demontage-fassade.webp',
        imageAlt: 'Alte Werbeanlage wird sicher demontiert',
      },
      {
        tag: 'Диагностика',
        title: 'Проверка питания',
        text: 'Проверили блок питания, проводку и видимые причины сбоя.',
        image: '/generated/referenzen/local-main/stromversorgung-werbeanlage-diagnose.webp',
        imageAlt: 'Stromversorgung einer Werbeanlage wird geprüft',
      },
      {
        tag: 'Фасад',
        title: 'Подготовка доступа',
        text: 'Оценили высоту, точку монтажа и доступ для работы на объекте.',
        image: '/generated/referenzen/local-main/facade-mounting-check.png',
        imageAlt: 'Prüfung von Zugang und Montagepunkt an einer Fassade',
      },
    ],
    closing: {
      tag: 'Комплексный сервис',
      title: 'Несколько задач на одном объекте',
      text: 'Ремонт, пленку, монтаж или демонтаж можно собрать в один понятный сервисный план.',
      image: '/generated/referenzen/agent-facade/wide-hero-service-result.png',
      imageAlt: 'Abgeschlossener Serviceeinsatz an einer Geschäftsfassade',
    },
  },
  tr: {
    eyebrow: 'Once / Sonra',
    title: 'Gercek servis ornekleri.',
    titleMuted: 'Hizli anlasilir.',
    intro:
      'Isikli reklam, folyo, harfler ve sokum islerinde tipik hasarlar ve sonuclar - talep baslatmadan once gorunur.',
    beforeLabel: 'Once',
    afterLabel: 'Sonra',
    featuredTag: 'Isikli kutu',
    featuredTitle: 'Isikli kutu yeniden aydinlatildi',
    featuredProblem: 'Once: dengesiz aydinlatma ve karanlik bolgeler.',
    featuredResult: 'Sonra: guc kaynagi, LED alanlari ve fonksiyon kontrol edildi.',
    featuredBeforeAlt: 'Ungleichmäßig beleuchteter Leuchtkasten vor der Reparatur',
    featuredAfterAlt: 'Gleichmäßig beleuchteter Leuchtkasten nach der Reparatur',
    cases: [
      {
        tag: 'LED servis',
        title: 'LED titriyor',
        text: 'Moduller ve guc kaynagi kontrol edildi, arizali parcalar degisti.',
        image: '/generated/referenzen/local-main/led-module-repair.png',
        imageAlt: 'LED-Modul wird bei einer Lichtwerbung repariert',
      },
      {
        tag: 'Folyo',
        title: 'Folyo ayriliyor',
        text: 'Yuzey temizlendi, folyo yeniden hazirlandi ve temiz uygulandi.',
        image: '/generated/referenzen/local-main/schaufensterfolie-neu-verarbeitet-service.webp',
        imageAlt: 'Schaufensterfolie wird sauber neu verarbeitet',
      },
      {
        tag: 'Harfler',
        title: 'Harfler hasarli',
        text: 'Gorunur elemanlar kontrol edildi, yenilendi ve hizalandi.',
        image: '/generated/referenzen/local-main/leuchtbuchstaben-beschaedigt-reparatur.webp',
        imageAlt: 'Beschädigte leuchtende Buchstaben werden repariert',
      },
      {
        tag: 'Sokum',
        title: 'Eski tabela kaldirildi',
        text: 'Sokum, erisim ve lokasyondaki sonraki adim icin hazirlik.',
        image: '/generated/referenzen/local-main/alte-werbeanlage-demontage-fassade.webp',
        imageAlt: 'Alte Werbeanlage wird sicher demontiert',
      },
      {
        tag: 'Teshis',
        title: 'Guc kaynagi kontrolu',
        text: 'Guc unitesi, kablo ve gorunur ariza kaynaklari incelendi.',
        image: '/generated/referenzen/local-main/stromversorgung-werbeanlage-diagnose.webp',
        imageAlt: 'Stromversorgung einer Werbeanlage wird geprüft',
      },
      {
        tag: 'Cephe',
        title: 'Erisim hazirlandi',
        text: 'Montaj noktasi, yukseklik ve calisma erisimi netlestirildi.',
        image: '/generated/referenzen/local-main/facade-mounting-check.png',
        imageAlt: 'Prüfung von Zugang und Montagepunkt an einer Fassade',
      },
    ],
    closing: {
      tag: 'Servis isi',
      title: 'Tek lokasyonda birden fazla is',
      text: 'Onarim, folyo, montaj veya sokum tek bir net servis akisi icinde toplanabilir.',
      image: '/generated/referenzen/agent-facade/wide-hero-service-result.png',
      imageAlt: 'Abgeschlossener Serviceeinsatz an einer Geschäftsfassade',
    },
  },
  pl: {
    eyebrow: 'Przed / po',
    title: 'Realne przypadki serwisowe.',
    titleMuted: 'Szybko widac rezultat.',
    intro:
      'Typowe usterki i efekty przy reklamie swietlnej, foliach, literach i demontazu - widoczne przed rozpoczeciem zgloszenia.',
    beforeLabel: 'Przed',
    afterLabel: 'Po',
    featuredTag: 'Kaseton',
    featuredTitle: 'Przywrocone podswietlenie kasetonu',
    featuredProblem: 'Przed: nierowne podswietlenie i ciemne obszary.',
    featuredResult: 'Po: zasilanie, obszary LED i dzialanie sprawdzone.',
    featuredBeforeAlt: 'Ungleichmäßig beleuchteter Leuchtkasten vor der Reparatur',
    featuredAfterAlt: 'Gleichmäßig beleuchteter Leuchtkasten nach der Reparatur',
    cases: [
      {
        tag: 'LED serwis',
        title: 'LED migocze',
        text: 'Moduly i zasilanie sprawdzone, uszkodzone elementy wymienione.',
        image: '/generated/referenzen/local-main/led-module-repair.png',
        imageAlt: 'LED-Modul wird bei einer Lichtwerbung repariert',
      },
      {
        tag: 'Folia',
        title: 'Folia odchodzi',
        text: 'Powierzchnia oczyszczona, folia przygotowana i nalozona ponownie.',
        image: '/generated/referenzen/local-main/schaufensterfolie-neu-verarbeitet-service.webp',
        imageAlt: 'Schaufensterfolie wird sauber neu verarbeitet',
      },
      {
        tag: 'Litery',
        title: 'Litery uszkodzone',
        text: 'Widoczne elementy sprawdzone, odnowione i ponownie ustawione.',
        image: '/generated/referenzen/local-main/leuchtbuchstaben-beschaedigt-reparatur.webp',
        imageAlt: 'Beschädigte leuchtende Buchstaben werden repariert',
      },
      {
        tag: 'Demontaz',
        title: 'Stara reklama zdjeta',
        text: 'Demontaz, dostep i przygotowanie do kolejnego kroku dla obiektu.',
        image: '/generated/referenzen/local-main/alte-werbeanlage-demontage-fassade.webp',
        imageAlt: 'Alte Werbeanlage wird sicher demontiert',
      },
      {
        tag: 'Diagnostyka',
        title: 'Sprawdzenie zasilania',
        text: 'Zasilacz, przewody i widoczne zrodla usterki zostaly ocenione.',
        image: '/generated/referenzen/local-main/stromversorgung-werbeanlage-diagnose.webp',
        imageAlt: 'Stromversorgung einer Werbeanlage wird geprüft',
      },
      {
        tag: 'Fasada',
        title: 'Dostep przygotowany',
        text: 'Punkt montazu, wysokosc i dostep do pracy zostaly wyjasnione.',
        image: '/generated/referenzen/local-main/facade-mounting-check.png',
        imageAlt: 'Prüfung von Zugang und Montagepunkt an einer Fassade',
      },
    ],
    closing: {
      tag: 'Serwis',
      title: 'Kilka zadan w jednej lokalizacji',
      text: 'Naprawe, folie, montaz lub demontaz mozna polaczyc w jeden przejrzysty proces.',
      image: '/generated/referenzen/agent-facade/wide-hero-service-result.png',
      imageAlt: 'Abgeschlossener Serviceeinsatz an einer Geschäftsfassade',
    },
  },
  ar: {
    eyebrow: 'قبل / بعد',
    title: 'حالات خدمة حقيقية.',
    titleMuted: 'النتيجة واضحة بسرعة.',
    intro:
      'اعطال ونتائج نموذجية في الاعلانات المضيئة والافلام والحروف والتفكيك، بشكل بصري مختصر قبل بدء الطلب.',
    beforeLabel: 'قبل',
    afterLabel: 'بعد',
    featuredTag: 'صندوق مضيء',
    featuredTitle: 'استعادة اضاءة الصندوق المضيء',
    featuredProblem: 'قبل: اضاءة غير منتظمة ومناطق داكنة.',
    featuredResult: 'بعد: فحص مصدر الطاقة ومناطق LED واختبار التشغيل.',
    featuredBeforeAlt: 'Ungleichmäßig beleuchteter Leuchtkasten vor der Reparatur',
    featuredAfterAlt: 'Gleichmäßig beleuchteter Leuchtkasten nach der Reparatur',
    cases: [
      {
        tag: 'خدمة LED',
        title: 'LED يومض',
        text: 'تم فحص الوحدات ومصدر الطاقة واستبدال المكونات التالفة.',
        image: '/generated/referenzen/local-main/led-module-repair.png',
        imageAlt: 'LED-Modul wird bei einer Lichtwerbung repariert',
      },
      {
        tag: 'فيلم',
        title: 'الفيلم ينفصل',
        text: 'تم تنظيف السطح وتجهيز الفيلم وتطبيقه من جديد بشكل نظيف.',
        image: '/generated/referenzen/local-main/schaufensterfolie-neu-verarbeitet-service.webp',
        imageAlt: 'Schaufensterfolie wird sauber neu verarbeitet',
      },
      {
        tag: 'حروف',
        title: 'حروف متضررة',
        text: 'تم فحص العناصر الظاهرة وتجديدها واعادة ضبطها.',
        image: '/generated/referenzen/local-main/leuchtbuchstaben-beschaedigt-reparatur.webp',
        imageAlt: 'Beschädigte leuchtende Buchstaben werden repariert',
      },
      {
        tag: 'تفكيك',
        title: 'ازالة لوحة قديمة',
        text: 'تفكيك وتجهيز الوصول والخطوة التالية في الموقع.',
        image: '/generated/referenzen/local-main/alte-werbeanlage-demontage-fassade.webp',
        imageAlt: 'Alte Werbeanlage wird sicher demontiert',
      },
      {
        tag: 'تشخيص',
        title: 'فحص مصدر الطاقة',
        text: 'تم فحص وحدة الطاقة والاسلاك ومصادر الخلل الظاهرة.',
        image: '/generated/referenzen/local-main/stromversorgung-werbeanlage-diagnose.webp',
        imageAlt: 'Stromversorgung einer Werbeanlage wird geprüft',
      },
      {
        tag: 'واجهة',
        title: 'تحضير الوصول',
        text: 'تم توضيح نقطة التركيب والارتفاع والوصول للعمل.',
        image: '/generated/referenzen/local-main/facade-mounting-check.png',
        imageAlt: 'Prüfung von Zugang und Montagepunkt an einer Fassade',
      },
    ],
    closing: {
      tag: 'حالة خدمة',
      title: 'عدة مهام في موقع واحد',
      text: 'يمكن جمع الاصلاح والفيلم والتركيب او التفكيك في مسار خدمة واضح واحد.',
      image: '/generated/referenzen/agent-facade/wide-hero-service-result.png',
      imageAlt: 'Abgeschlossener Serviceeinsatz an einer Geschäftsfassade',
    },
  },
};

function getCopy(locale: string): BeforeAfterCopy {
  return COPY[locale as Locale] ?? COPY.de;
}

export default function HomeBeforeAfterSection({ locale }: { locale: string }) {
  const copy = getCopy(locale);
  const caseColumns = [
    copy.cases.slice(0, 2),
    copy.cases.slice(2, 4),
    copy.cases.slice(4, 6),
  ];

  return (
    <section className="w-full overflow-hidden bg-[#F5F5F7] py-16 md:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-6">
        <div className="flex max-w-3xl flex-col gap-4 text-start">
          <SectionEyebrow>{copy.eyebrow}</SectionEyebrow>
          <h2 className="text-[32px] font-black leading-[1.08] tracking-[0] text-[#0E1A2B] md:text-[42px]">
            {copy.title}{' '}
            <span className="block text-[#7D8794] sm:inline">{copy.titleMuted}</span>
          </h2>
          <p className="max-w-2xl text-[15px] leading-[1.55] text-[#6E6E73] md:text-[16px]">
            {copy.intro}
          </p>
        </div>
      </div>

        <div
          className="mt-9 w-screen overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            paddingInlineEnd: '1.5rem',
            paddingInlineStart: 'max(1.5rem, calc((100vw - 80rem) / 2 + 1.5rem))',
          }}
        >
          <div className="flex w-max snap-x snap-mandatory gap-4 md:gap-5">
            <article className="relative h-[584px] w-[340px] shrink-0 snap-start overflow-hidden rounded-[28px] border border-white/35 bg-[#101827] shadow-[0_10px_26px_rgba(0,0,0,0.055)] sm:h-[620px] sm:w-[430px] lg:h-[660px] lg:w-[560px]">
              <div className="absolute inset-x-0 top-0 h-[91%] overflow-hidden">
                <div className="absolute inset-0 [clip-path:inset(0_50%_0_0)]">
                  <Image
                    src="/generated/referenzen/local-main/leuchtkasten-vorher-ungleichmaessige-beleuchtung.webp"
                    alt={copy.featuredBeforeAlt}
                    fill
                    sizes="(min-width: 1024px) 560px, (min-width: 640px) 430px, 340px"
                    className="object-cover [transform:translateY(-4%)_scale(1.04)]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#0E1A2B] shadow-sm rtl:left-auto rtl:right-4">
                    {copy.beforeLabel}
                  </span>
                </div>
                <div className="absolute inset-0 [clip-path:inset(0_0_0_50%)]">
                  <Image
                    src="/generated/referenzen/local-main/leuchtkasten-nachher-gleichmaessige-beleuchtung.webp"
                    alt={copy.featuredAfterAlt}
                    fill
                    sizes="(min-width: 1024px) 560px, (min-width: 640px) 430px, 340px"
                    className="object-cover [transform:translateY(5%)_scale(1.04)]"
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-[#B8643E] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-sm rtl:left-4 rtl:right-auto">
                    {copy.afterLabel}
                  </span>
                </div>
                <div className="absolute inset-y-0 left-1/2 w-9 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/38 to-transparent backdrop-blur-[1px]" />
                <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/45" />
              </div>
              <div className="absolute -inset-x-px -bottom-px flex flex-col justify-end px-5 pb-5 pt-14 sm:px-6 sm:pb-6 sm:pt-16 lg:px-7 lg:pb-7 lg:pt-20">
                <div className="absolute inset-0 bg-gradient-to-t from-white/76 via-white/48 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_top,#000_0%,#000_58%,rgba(0,0,0,0)_100%)]" />
                <div className="relative z-10 flex flex-col gap-3">
                  <span className="w-fit rounded-full bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#8F4C2F] shadow-sm">
                    {copy.featuredTag}
                  </span>
                  <h3 className="text-[23px] font-black leading-[1.08] tracking-[0] text-[#0E1A2B] md:text-[28px]">
                    {copy.featuredTitle}
                  </h3>
                  <p className="text-[13px] font-semibold leading-[1.42] text-[#536072] md:text-[14px]">
                    {copy.featuredProblem}
                  </p>
                  <p className="border-t border-[#0E1A2B]/12 pt-2 text-[13px] font-black leading-[1.38] text-[#0E1A2B] md:text-[14px]">
                    {copy.featuredResult}
                  </p>
                </div>
              </div>
            </article>

            {caseColumns.map((column, columnIndex) => (
              <div
                key={`case-column-${columnIndex}`}
                className="grid h-[584px] w-[286px] shrink-0 snap-start grid-rows-2 gap-4 sm:h-[620px] sm:w-[330px] lg:h-[660px] lg:w-[360px] lg:gap-5"
              >
                {column.map((item) => (
                  <article
                    key={`${item.tag}-${item.title}`}
                    className="relative min-h-0 overflow-hidden rounded-[28px] border border-white/35 bg-[#101827] shadow-[0_10px_26px_rgba(0,0,0,0.055)]"
                  >
                    <div className="absolute inset-x-0 top-0 h-[90%] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 360px, (min-width: 640px) 330px, 286px"
                        className="object-cover"
                      />
                    </div>
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#8F4C2F] shadow-sm rtl:left-auto rtl:right-4">
                      {item.tag}
                    </span>
                    <div className="absolute -inset-x-px -bottom-px flex flex-col gap-1.5 px-5 pb-5 pt-9">
                      <div className="absolute inset-0 bg-gradient-to-t from-white/82 via-white/54 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_top,#000_0%,#000_68%,rgba(0,0,0,0)_100%)]" />
                      <div className="relative z-10 flex flex-col gap-1.5">
                      <h3 className="text-[20px] font-black leading-[1.08] tracking-[0] text-[#0E1A2B]">
                        {item.title}
                      </h3>
                      <p className="text-[13px] font-semibold leading-[1.35] text-[#536072]">
                        {item.text}
                      </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ))}

            <article className="relative h-[584px] w-[340px] shrink-0 snap-start overflow-hidden rounded-[28px] border border-white/35 bg-[#101827] shadow-[0_10px_26px_rgba(0,0,0,0.055)] sm:h-[620px] sm:w-[430px] lg:h-[660px] lg:w-[560px]">
              <div className="absolute inset-x-0 top-0 h-[91%] overflow-hidden">
                <Image
                  src={copy.closing.image}
                  alt={copy.closing.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 560px, (min-width: 640px) 430px, 340px"
                  className="object-cover"
                />
              </div>
              <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#8F4C2F] shadow-sm rtl:left-auto rtl:right-5">
                {copy.closing.tag}
              </span>
              <div className="absolute -inset-x-px -bottom-px flex flex-col gap-2 px-5 pb-5 pt-14 sm:px-6 sm:pb-6 sm:pt-16 lg:px-7 lg:pb-7 lg:pt-20">
                <div className="absolute inset-0 bg-gradient-to-t from-white/76 via-white/48 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_top,#000_0%,#000_58%,rgba(0,0,0,0)_100%)]" />
                <div className="relative z-10 flex flex-col gap-2">
                  <h3 className="text-[23px] font-black leading-[1.08] tracking-[0] text-[#0E1A2B] md:text-[28px]">
                    {copy.closing.title}
                  </h3>
                  <p className="text-[13px] font-semibold leading-[1.42] text-[#536072] md:text-[14px]">
                    {copy.closing.text}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
    </section>
  );
}
