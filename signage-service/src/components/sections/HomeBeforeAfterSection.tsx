'use client';

import Image from 'next/image';
import { useRef } from 'react';
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
  previousLabel: string;
  nextLabel: string;
  cases: BeforeAfterCase[];
  closing: BeforeAfterCase;
};

const COPY: Record<Locale, BeforeAfterCopy> = {
  de: {
    eyebrow: 'Service / Beispiele',
    title: 'Servicebereiche von PixelRing',
    titleMuted: 'Typische Fälle',
    intro:
      'Typische Fälle: Der Leuchtkasten bleibt dunkel, LED flackern, Buchstaben sind beschädigt, Folie löst sich oder eine alte Anlage muss demontiert werden.',
    beforeLabel: 'Vorher',
    afterLabel: 'Nachher',
    featuredTag: 'Leuchtkasten',
    featuredTitle: 'Leuchtkasten wieder gleichmäßig beleuchtet',
    featuredProblem: 'Vorher: ungleichmäßige Beleuchtung und dunkle Bereiche.',
    featuredResult: 'Nachher: Netzteil, LED-Module und Funktion geprüft; das sichtbare Ergebnis wurde dokumentiert.',
    featuredBeforeAlt: 'Ungleichmäßig beleuchteter Leuchtkasten vor der Reparatur',
    featuredAfterAlt: 'Gleichmäßig beleuchteter Leuchtkasten nach der Reparatur',
    previousLabel: 'Zurück scrollen',
    nextLabel: 'Weiter scrollen',
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
    eyebrow: 'Service / Examples',
    title: 'PixelRing service areas',
    titleMuted: 'Typical cases',
    intro:
      'Typical cases: a lightbox stays dark, LEDs flicker, letters are damaged, film is peeling, or an old sign needs to be removed.',
    beforeLabel: 'Before',
    afterLabel: 'After',
    featuredTag: 'Lightbox',
    featuredTitle: 'Lightbox lighting restored',
    featuredProblem: 'Before: uneven lighting and dark sections.',
    featuredResult: 'After: power supply, LED sections and function tested; the visible result was documented.',
    featuredBeforeAlt: 'Unevenly lit lightbox before repair',
    featuredAfterAlt: 'Evenly lit lightbox after repair',
    previousLabel: 'Scroll back',
    nextLabel: 'Scroll forward',
    cases: [
      {
        tag: 'LED service',
        title: 'Flickering LEDs',
        text: 'LED modules and power supply were checked; faulty components were replaced.',
        image: '/generated/referenzen/local-main/led-module-repair.png',
        imageAlt: 'LED module being repaired in an illuminated sign',
      },
      {
        tag: 'Film',
        title: 'Peeling window film',
        text: 'The surface was cleaned and prepared, then the film was reapplied cleanly.',
        image: '/generated/referenzen/local-main/schaufensterfolie-neu-verarbeitet-service.webp',
        imageAlt: 'Window film being reapplied cleanly',
      },
      {
        tag: 'Letters',
        title: 'Damaged sign letters',
        text: 'Letter elements were inspected, repaired where needed, and realigned.',
        image: '/generated/referenzen/local-main/leuchtbuchstaben-beschaedigt-reparatur.webp',
        imageAlt: 'Damaged illuminated letters being repaired',
      },
      {
        tag: 'Dismantling',
        title: 'Old sign removed',
        text: 'Removal, access and preparation for the next site step were coordinated.',
        image: '/generated/referenzen/local-main/alte-werbeanlage-demontage-fassade.webp',
        imageAlt: 'Old advertising sign being dismantled safely',
      },
      {
        tag: 'Diagnostics',
        title: 'Power supply checked',
        text: 'Power unit, wiring and visible fault sources were inspected.',
        image: '/generated/referenzen/local-main/stromversorgung-werbeanlage-diagnose.webp',
        imageAlt: 'Power supply of an advertising sign being checked',
      },
      {
        tag: 'Facade',
        title: 'Access prepared',
        text: 'Mounting point, height and work access were clarified before the service visit.',
        image: '/generated/referenzen/local-main/facade-mounting-check.png',
        imageAlt: 'Facade access and mounting point being checked',
      },
    ],
    closing: {
      tag: 'Service case',
      title: 'Multiple tasks at one site',
      text: 'Repairs, film work, installation or removal can be combined in one clear service plan.',
      image: '/generated/referenzen/agent-facade/wide-hero-service-result.png',
      imageAlt: 'Completed service work on a business facade',
    },
  },
  ru: {
    eyebrow: 'Сервис / примеры',
    title: 'Направления сервиса PixelRing',
    titleMuted: 'Типовые случаи',
    intro:
      'Типовые ситуации: не горит световой короб, мигает LED, повреждены буквы, отклеилась плёнка или нужен демонтаж.',
    beforeLabel: 'До',
    afterLabel: 'После',
    featuredTag: 'Световой короб',
    featuredTitle: 'Восстановили подсветку светового короба',
    featuredProblem: 'До: тёмные зоны и неровное свечение.',
    featuredResult: 'После: проверили питание и LED-модули, заменили неисправные элементы, сделали тест подсветки.',
    featuredBeforeAlt: 'Световой короб с неравномерной подсветкой до ремонта',
    featuredAfterAlt: 'Световой короб с ровной подсветкой после ремонта',
    previousLabel: 'Прокрутить назад',
    nextLabel: 'Прокрутить вперед',
    cases: [
      {
        tag: 'LED',
        title: 'Мигает LED-подсветка',
        text: 'Проверили модули и блок питания, заменили неисправные элементы.',
        image: '/generated/referenzen/local-main/led-module-repair.png',
        imageAlt: 'Ремонт LED-модуля в световой рекламе',
      },
      {
        tag: 'Плёнка',
        title: 'Отклеилась плёнка',
        text: 'Подготовили поверхность и заново нанесли плёнку.',
        image: '/generated/referenzen/local-main/schaufensterfolie-neu-verarbeitet-service.webp',
        imageAlt: 'Плёнку на витрине аккуратно наносят заново',
      },
      {
        tag: 'Буквы',
        title: 'Повреждены световые буквы',
        text: 'Проверили видимые элементы и восстановили аккуратный вид.',
        image: '/generated/referenzen/local-main/leuchtbuchstaben-beschaedigt-reparatur.webp',
        imageAlt: 'Ремонт повреждённых световых букв',
      },
      {
        tag: 'Демонтаж',
        title: 'Нужно снять старую вывеску',
        text: 'Подготовили доступ, сняли конструкцию и освободили фасад.',
        image: '/generated/referenzen/local-main/alte-werbeanlage-demontage-fassade.webp',
        imageAlt: 'Безопасный демонтаж старой рекламной конструкции',
      },
      {
        tag: 'Диагностика',
        title: 'Проверка питания',
        text: 'Проверили блок питания, проводку и видимые причины сбоя.',
        image: '/generated/referenzen/local-main/stromversorgung-werbeanlage-diagnose.webp',
        imageAlt: 'Проверка питания рекламной конструкции',
      },
      {
        tag: 'Фасад',
        title: 'Подготовка доступа',
        text: 'Оценили высоту, точку монтажа и доступ для работы на объекте.',
        image: '/generated/referenzen/local-main/facade-mounting-check.png',
        imageAlt: 'Проверка доступа и точки монтажа на фасаде',
      },
    ],
    closing: {
      tag: 'Комплексный сервис',
      title: 'Несколько задач на одном объекте',
      text: 'Ремонт, плёнку, монтаж или демонтаж можно собрать в один понятный сервисный план.',
      image: '/generated/referenzen/agent-facade/wide-hero-service-result.png',
      imageAlt: 'Завершённая сервисная работа на фасаде магазина',
    },
  },
  tr: {
    eyebrow: 'Servis / örnekler',
    title: 'PixelRing servis alanları',
    titleMuted: 'Tipik durumlar',
    intro:
      'Tipik durumlar: ışıklı kutu yanmıyor, LED titriyor, harfler hasarlı, folyo ayrılıyor veya eski bir tabela sökülmeli.',
    beforeLabel: 'Önce',
    afterLabel: 'Sonra',
    featuredTag: 'Işıklı kutu',
    featuredTitle: 'Işıklı kutunun aydınlatması yenilendi',
    featuredProblem: 'Önce: dengesiz aydınlatma ve karanlık bölgeler.',
    featuredResult: 'Sonra: güç kaynağı, LED alanları ve çalışma durumu kontrol edildi.',
    featuredBeforeAlt: 'Onarım öncesinde düzensiz aydınlatılmış ışıklı kutu',
    featuredAfterAlt: 'Onarım sonrasında eşit aydınlatılmış ışıklı kutu',
    previousLabel: 'Geri kaydır',
    nextLabel: 'İleri kaydır',
    cases: [
      {
        tag: 'LED servis',
        title: 'LED titriyor',
        text: 'Modüller ve güç kaynağı kontrol edildi, arızalı parçalar değiştirildi.',
        image: '/generated/referenzen/local-main/led-module-repair.png',
        imageAlt: 'Işıklı reklamda LED modülü onarılıyor',
      },
      {
        tag: 'Folyo',
        title: 'Folyo ayrılıyor',
        text: 'Yüzey temizlendi, folyo yeniden hazırlandı ve temiz şekilde uygulandı.',
        image: '/generated/referenzen/local-main/schaufensterfolie-neu-verarbeitet-service.webp',
        imageAlt: 'Vitrin folyosu temiz şekilde yeniden uygulanıyor',
      },
      {
        tag: 'Harfler',
        title: 'Harfler hasarlı',
        text: 'Görünen elemanlar kontrol edildi, yenilendi ve hizalandı.',
        image: '/generated/referenzen/local-main/leuchtbuchstaben-beschaedigt-reparatur.webp',
        imageAlt: 'Hasarlı ışıklı harfler onarılıyor',
      },
      {
        tag: 'Söküm',
        title: 'Eski tabela kaldırıldı',
        text: 'Söküm, erişim ve lokasyondaki sonraki adım için hazırlık yapıldı.',
        image: '/generated/referenzen/local-main/alte-werbeanlage-demontage-fassade.webp',
        imageAlt: 'Eski reklam tabelası güvenli şekilde sökülüyor',
      },
      {
        tag: 'Teşhis',
        title: 'Güç kaynağı kontrolü',
        text: 'Güç ünitesi, kablolar ve görünen arıza kaynakları incelendi.',
        image: '/generated/referenzen/local-main/stromversorgung-werbeanlage-diagnose.webp',
        imageAlt: 'Reklam tabelasının güç kaynağı kontrol ediliyor',
      },
      {
        tag: 'Cephe',
        title: 'Erişim hazırlandı',
        text: 'Montaj noktası, yükseklik ve çalışma erişimi netleştirildi.',
        image: '/generated/referenzen/local-main/facade-mounting-check.png',
        imageAlt: 'Cephede erişim ve montaj noktası kontrol ediliyor',
      },
    ],
    closing: {
      tag: 'Servis işi',
      title: 'Tek lokasyonda birden fazla iş',
      text: 'Onarım, folyo, montaj veya söküm tek bir net servis akışı içinde toplanabilir.',
      image: '/generated/referenzen/agent-facade/wide-hero-service-result.png',
      imageAlt: 'Bir işletme cephesinde tamamlanmış servis çalışması',
    },
  },
  pl: {
    eyebrow: 'Serwis / przykłady',
    title: 'Obszary serwisu PixelRing',
    titleMuted: 'Typowe przypadki',
    intro:
      'Typowe sytuacje: kaseton nie świeci, LED migocze, litery są uszkodzone, folia odchodzi albo trzeba zdemontować starą reklamę.',
    beforeLabel: 'Przed',
    afterLabel: 'Po',
    featuredTag: 'Kaseton',
    featuredTitle: 'Przywrócone podświetlenie kasetonu',
    featuredProblem: 'Przed: nierówne podświetlenie i ciemne obszary.',
    featuredResult: 'Po: zasilanie, obszary LED i działanie zostały sprawdzone.',
    featuredBeforeAlt: 'Kaseton z nierównym podświetleniem przed naprawą',
    featuredAfterAlt: 'Kaseton z równym podświetleniem po naprawie',
    previousLabel: 'Przewiń wstecz',
    nextLabel: 'Przewiń dalej',
    cases: [
      {
        tag: 'LED serwis',
        title: 'LED migocze',
        text: 'Moduły i zasilanie zostały sprawdzone, uszkodzone elementy wymienione.',
        image: '/generated/referenzen/local-main/led-module-repair.png',
        imageAlt: 'Naprawa modułu LED w reklamie świetlnej',
      },
      {
        tag: 'Folia',
        title: 'Folia odchodzi',
        text: 'Powierzchnia została oczyszczona, folia przygotowana i nałożona ponownie.',
        image: '/generated/referenzen/local-main/schaufensterfolie-neu-verarbeitet-service.webp',
        imageAlt: 'Folia witrynowa jest nakładana ponownie',
      },
      {
        tag: 'Litery',
        title: 'Litery uszkodzone',
        text: 'Widoczne elementy sprawdzone, odnowione i ponownie ustawione.',
        image: '/generated/referenzen/local-main/leuchtbuchstaben-beschaedigt-reparatur.webp',
        imageAlt: 'Naprawa uszkodzonych liter świetlnych',
      },
      {
        tag: 'Demontaż',
        title: 'Stara reklama zdjęta',
        text: 'Demontaż, dostęp i przygotowanie do kolejnego kroku dla obiektu.',
        image: '/generated/referenzen/local-main/alte-werbeanlage-demontage-fassade.webp',
        imageAlt: 'Bezpieczny demontaż starej reklamy',
      },
      {
        tag: 'Diagnostyka',
        title: 'Sprawdzenie zasilania',
        text: 'Zasilacz, przewody i widoczne źródła usterki zostały ocenione.',
        image: '/generated/referenzen/local-main/stromversorgung-werbeanlage-diagnose.webp',
        imageAlt: 'Sprawdzenie zasilania reklamy',
      },
      {
        tag: 'Fasada',
        title: 'Dostęp przygotowany',
        text: 'Punkt montażu, wysokość i dostęp do pracy zostały wyjaśnione.',
        image: '/generated/referenzen/local-main/facade-mounting-check.png',
        imageAlt: 'Sprawdzenie dostępu i punktu montażu na fasadzie',
      },
    ],
    closing: {
      tag: 'Serwis',
      title: 'Kilka zadań w jednej lokalizacji',
      text: 'Naprawę, folię, montaż lub demontaż można połączyć w jeden przejrzysty proces.',
      image: '/generated/referenzen/agent-facade/wide-hero-service-result.png',
      imageAlt: 'Zakończona praca serwisowa na fasadzie lokalu',
    },
  },
  ar: {
    eyebrow: 'الخدمة / أمثلة',
    title: 'مجالات خدمة PixelRing',
    titleMuted: 'حالات نموذجية',
    intro:
      'حالات نموذجية: صندوق مضيء لا يعمل، LED يومض، حروف متضررة، فيلم ينفصل أو لوحة قديمة تحتاج إلى تفكيك.',
    beforeLabel: 'قبل',
    afterLabel: 'بعد',
    featuredTag: 'صندوق مضيء',
    featuredTitle: 'استعادة إضاءة الصندوق المضيء',
    featuredProblem: 'قبل: إضاءة غير منتظمة ومناطق داكنة.',
    featuredResult: 'بعد: فحص مصدر الطاقة ومناطق LED واختبار التشغيل.',
    featuredBeforeAlt: 'صندوق مضيء بإضاءة غير منتظمة قبل الإصلاح',
    featuredAfterAlt: 'صندوق مضيء بإضاءة منتظمة بعد الإصلاح',
    previousLabel: 'التمرير للخلف',
    nextLabel: 'التمرير للأمام',
    cases: [
      {
        tag: 'خدمة LED',
        title: 'LED يومض',
        text: 'تم فحص الوحدات ومصدر الطاقة واستبدال المكونات التالفة.',
        image: '/generated/referenzen/local-main/led-module-repair.png',
        imageAlt: 'إصلاح وحدة LED في إعلان مضيء',
      },
      {
        tag: 'فيلم',
        title: 'الفيلم ينفصل',
        text: 'تم تنظيف السطح وتجهيز الفيلم وتطبيقه من جديد بشكل نظيف.',
        image: '/generated/referenzen/local-main/schaufensterfolie-neu-verarbeitet-service.webp',
        imageAlt: 'إعادة تطبيق فيلم الواجهة بشكل نظيف',
      },
      {
        tag: 'حروف',
        title: 'حروف متضررة',
        text: 'تم فحص العناصر الظاهرة وتجديدها وإعادة ضبطها.',
        image: '/generated/referenzen/local-main/leuchtbuchstaben-beschaedigt-reparatur.webp',
        imageAlt: 'إصلاح حروف مضيئة متضررة',
      },
      {
        tag: 'تفكيك',
        title: 'إزالة لوحة قديمة',
        text: 'تفكيك وتجهيز الوصول والخطوة التالية في الموقع.',
        image: '/generated/referenzen/local-main/alte-werbeanlage-demontage-fassade.webp',
        imageAlt: 'تفكيك لوحة إعلانية قديمة بشكل آمن',
      },
      {
        tag: 'تشخيص',
        title: 'فحص مصدر الطاقة',
        text: 'تم فحص وحدة الطاقة والأسلاك ومصادر الخلل الظاهرة.',
        image: '/generated/referenzen/local-main/stromversorgung-werbeanlage-diagnose.webp',
        imageAlt: 'فحص مصدر الطاقة للوحة إعلانية',
      },
      {
        tag: 'واجهة',
        title: 'تحضير الوصول',
        text: 'تم توضيح نقطة التركيب والارتفاع والوصول للعمل.',
        image: '/generated/referenzen/local-main/facade-mounting-check.png',
        imageAlt: 'فحص الوصول ونقطة التركيب على الواجهة',
      },
    ],
    closing: {
      tag: 'حالة خدمة',
      title: 'عدة مهام في موقع واحد',
      text: 'يمكن جمع الإصلاح والفيلم والتركيب أو التفكيك في مسار خدمة واضح واحد.',
      image: '/generated/referenzen/agent-facade/wide-hero-service-result.png',
      imageAlt: 'عمل خدمة مكتمل على واجهة محل',
    },
  },
};

function getCopy(locale: string): BeforeAfterCopy {
  return COPY[locale as Locale] ?? COPY.de;
}

export default function HomeBeforeAfterSection({ locale }: { locale: string }) {
  const copy = getCopy(locale);
  const railRef = useRef<HTMLDivElement>(null);
  const caseColumns = [
    copy.cases.slice(0, 2),
    copy.cases.slice(2, 4),
    copy.cases.slice(4, 6),
  ];
  const scrollDirection = locale === 'ar' ? -1 : 1;

  const scrollRail = (direction: -1 | 1) => {
    railRef.current?.scrollBy({
      left: direction * scrollDirection * Math.min(window.innerWidth * 0.82, 760),
      behavior: 'smooth',
    });
  };

  return (
    <section className="w-full overflow-hidden bg-[#F5F5F7] py-16 md:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-3xl flex-col gap-4 text-start">
          <SectionEyebrow>{copy.eyebrow}</SectionEyebrow>
          <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[0] text-[#0E1A2B] md:text-[42px]">
            {copy.title}{' '}
            <span className="block text-[#0E1A2B] sm:inline">{copy.titleMuted}</span>
          </h2>
          <p className="max-w-2xl text-[15px] leading-[1.55] text-[#6E6E73] md:text-[16px]">
            {copy.intro}
          </p>
        </div>
        <div className="hidden items-center gap-2 self-start md:flex md:self-end" aria-label={copy.eyebrow}>
          <button
            type="button"
            aria-label={copy.previousLabel}
            title={copy.previousLabel}
            onClick={() => scrollRail(-1)}
            className="group inline-flex size-14 items-center justify-center rounded-full border border-[#B8643E] bg-white/92 text-[#B8643E] shadow-[0_12px_30px_rgba(184,100,62,0.14)] transition-all duration-300 hover:scale-105 hover:bg-[#B8643E] hover:text-white hover:shadow-[0_16px_36px_rgba(184,100,62,0.28)] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
          >
            <svg
              className="size-6 transition-transform duration-300 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={copy.nextLabel}
            title={copy.nextLabel}
            onClick={() => scrollRail(1)}
            className="group inline-flex size-14 items-center justify-center rounded-full border border-[#B8643E] bg-white/92 text-[#B8643E] shadow-[0_12px_30px_rgba(184,100,62,0.14)] transition-all duration-300 hover:scale-105 hover:bg-[#B8643E] hover:text-white hover:shadow-[0_16px_36px_rgba(184,100,62,0.28)] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
          >
            <svg
              className="size-6 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

        <div
          ref={railRef}
          className="mt-9 w-screen overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            paddingInlineEnd: '1.5rem',
            paddingInlineStart: 'max(1.5rem, calc((100vw - 80rem) / 2 + 1.5rem))',
          }}
        >
          <div className="flex w-max snap-x snap-mandatory gap-4 md:gap-5">
            <article className="relative h-[584px] w-[320px] shrink-0 snap-start overflow-hidden rounded-[28px] border border-white/35 bg-[#101827] shadow-[0_10px_26px_rgba(0,0,0,0.055)] sm:h-[620px] sm:w-[430px] lg:h-[660px] lg:w-[560px]">
              <div className="absolute inset-x-0 top-0 h-[91%] overflow-hidden">
                <div className="absolute inset-0 [clip-path:inset(0_50%_0_0)]">
                  <Image
                    src="/generated/referenzen/local-main/leuchtkasten-vorher-ungleichmaessige-beleuchtung.webp"
                    alt={copy.featuredBeforeAlt}
                    fill
                    sizes="(min-width: 1024px) 560px, (min-width: 640px) 430px, 320px"
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
                    sizes="(min-width: 1024px) 560px, (min-width: 640px) 430px, 320px"
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

            <article className="relative h-[584px] w-[320px] shrink-0 snap-start overflow-hidden rounded-[28px] border border-white/35 bg-[#101827] shadow-[0_10px_26px_rgba(0,0,0,0.055)] sm:h-[620px] sm:w-[430px] lg:h-[660px] lg:w-[560px]">
              <div className="absolute inset-x-0 top-0 h-[91%] overflow-hidden">
                <Image
                  src={copy.closing.image}
                  alt={copy.closing.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 560px, (min-width: 640px) 430px, 320px"
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
