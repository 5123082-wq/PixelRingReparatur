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
      'Typische Schäden und Ergebnisse aus Lichtwerbung, Folie, Buchstaben und Demontage - kompakt sichtbar, bevor Sie eine Anfrage starten.',
    beforeLabel: 'Vorher',
    afterLabel: 'Nachher',
    featuredTag: 'Leuchtkasten',
    featuredTitle: 'Leuchtkasten wieder gleichmäßig beleuchtet',
    featuredProblem: 'Vorher: ungleichmäßige Beleuchtung und dunkle Bereiche.',
    featuredResult: 'Nachher: Netzteil, LED-Bereiche und Funktion geprüft, sichtbares Ergebnis dokumentiert.',
    featuredBeforeAlt: 'Ungleichmäßig beleuchteter Leuchtkasten vor der Reparatur',
    featuredAfterAlt: 'Wieder sichtbar beleuchteter Leuchtkasten nach der Reparatur',
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
        text: 'Fläche gereinigt, Folie neu vorbereitet und sauber verarbeitet.',
        image: '/generated/referenzen/local-main/window-film-after.png',
        imageAlt: 'Neu verarbeitete Fensterfolie an einem Geschäftsstandort',
      },
      {
        tag: 'Buchstaben',
        title: 'Buchstaben beschädigt',
        text: 'Sichtbare Elemente geprüft, erneuert und wieder ausgerichtet.',
        image: '/generated/referenzen/agent-facade/led-letters-after-result.png',
        imageAlt: 'Erneuerte leuchtende Buchstaben an einer Fassade',
      },
      {
        tag: 'Demontage',
        title: 'Alte Anlage entfernt',
        text: 'Rückbau, Zugang und Vorbereitung für den nächsten Standortschritt.',
        image: '/generated/referenzen/agent-facade/facade-mounting-lift.png',
        imageAlt: 'Arbeitsbühne bei Montage oder Demontage einer Fassadenwerbung',
      },
      {
        tag: 'Diagnose',
        title: 'Stromversorgung geprüft',
        text: 'Netzteil, Zuleitung und sichtbare Fehlerquellen eingeordnet.',
        image: '/generated/referenzen/local-main/power-diagnostics.png',
        imageAlt: 'Prüfung der Stromversorgung einer Werbeanlage',
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
      'Typical defects and results across illuminated signage, films, letters and dismantling - visible before you start a request.',
    beforeLabel: 'Before',
    afterLabel: 'After',
    featuredTag: 'Lightbox',
    featuredTitle: 'Lightbox lighting restored',
    featuredProblem: 'Before: uneven lighting and dark sections.',
    featuredResult: 'After: power supply, LED areas and function checked, visible result documented.',
    featuredBeforeAlt: 'Unevenly illuminated lightbox before repair',
    featuredAfterAlt: 'Restored illuminated lightbox after repair',
    cases: [
      {
        tag: 'LED service',
        title: 'LED flickering',
        text: 'Modules and power supply checked, defective components replaced.',
        image: '/generated/referenzen/local-main/led-module-repair.png',
        imageAlt: 'LED module being repaired in illuminated signage',
      },
      {
        tag: 'Film',
        title: 'Film peeling',
        text: 'Surface cleaned, film prepared again and applied cleanly.',
        image: '/generated/referenzen/local-main/window-film-after.png',
        imageAlt: 'Freshly applied window film at a business location',
      },
      {
        tag: 'Letters',
        title: 'Damaged letters',
        text: 'Visible elements checked, renewed and aligned again.',
        image: '/generated/referenzen/agent-facade/led-letters-after-result.png',
        imageAlt: 'Renewed illuminated letters on a facade',
      },
      {
        tag: 'Dismantling',
        title: 'Old sign removed',
        text: 'Removal, access planning and preparation for the next site step.',
        image: '/generated/referenzen/agent-facade/facade-mounting-lift.png',
        imageAlt: 'Work platform during installation or dismantling of facade signage',
      },
      {
        tag: 'Diagnostics',
        title: 'Power supply checked',
        text: 'Power unit, wiring and visible fault sources reviewed.',
        image: '/generated/referenzen/local-main/power-diagnostics.png',
        imageAlt: 'Power supply diagnostics for signage',
      },
      {
        tag: 'Facade',
        title: 'Access prepared',
        text: 'Mounting point, height and work access clarified before service.',
        image: '/generated/referenzen/local-main/facade-mounting-check.png',
        imageAlt: 'Facade access and mounting point check',
      },
    ],
    closing: {
      tag: 'Service case',
      title: 'Several tasks at one location',
      text: 'Repair, film, installation or removal can be bundled into one clear service flow.',
      image: '/generated/referenzen/agent-facade/wide-hero-service-result.png',
      imageAlt: 'Completed service case at a business facade',
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
    featuredBeforeAlt: 'Световой короб с неровной подсветкой до ремонта',
    featuredAfterAlt: 'Световой короб после восстановления подсветки',
    cases: [
      {
        tag: 'LED',
        title: 'Мигает LED-подсветка',
        text: 'Проверили модули и блок питания, заменили неисправные элементы.',
        image: '/generated/referenzen/local-main/led-module-repair.png',
        imageAlt: 'Ремонт LED-модуля в световой рекламе',
      },
      {
        tag: 'Пленка',
        title: 'Отклеилась пленка',
        text: 'Подготовили поверхность и заново нанесли пленку.',
        image: '/generated/referenzen/local-main/window-film-after.png',
        imageAlt: 'Новая оконная пленка на коммерческом объекте',
      },
      {
        tag: 'Буквы',
        title: 'Повреждены световые буквы',
        text: 'Проверили видимые элементы и восстановили аккуратный вид.',
        image: '/generated/referenzen/agent-facade/led-letters-after-result.png',
        imageAlt: 'Обновленные световые буквы на фасаде',
      },
      {
        tag: 'Демонтаж',
        title: 'Нужно снять старую вывеску',
        text: 'Подготовили доступ, сняли конструкцию и освободили фасад.',
        image: '/generated/referenzen/agent-facade/facade-mounting-lift.png',
        imageAlt: 'Подъемник при монтаже или демонтаже фасадной рекламы',
      },
      {
        tag: 'Диагностика',
        title: 'Проверка питания',
        text: 'Проверили блок питания, проводку и видимые причины сбоя.',
        image: '/generated/referenzen/local-main/power-diagnostics.png',
        imageAlt: 'Диагностика питания рекламной конструкции',
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
      text: 'Ремонт, пленку, монтаж или демонтаж можно собрать в один понятный сервисный план.',
      image: '/generated/referenzen/agent-facade/wide-hero-service-result.png',
      imageAlt: 'Завершенный сервисный выезд на коммерческом фасаде',
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
    featuredBeforeAlt: 'Onarimdan once dengesiz aydinlatilan isikli kutu',
    featuredAfterAlt: 'Onarimdan sonra tekrar aydinlatilan isikli kutu',
    cases: [
      {
        tag: 'LED servis',
        title: 'LED titriyor',
        text: 'Moduller ve guc kaynagi kontrol edildi, arizali parcalar degisti.',
        image: '/generated/referenzen/local-main/led-module-repair.png',
        imageAlt: 'Isikli reklamda LED modul onarimi',
      },
      {
        tag: 'Folyo',
        title: 'Folyo ayriliyor',
        text: 'Yuzey temizlendi, folyo yeniden hazirlandi ve temiz uygulandi.',
        image: '/generated/referenzen/local-main/window-film-after.png',
        imageAlt: 'Isletme konumunda yeni uygulanmis vitrin folyosu',
      },
      {
        tag: 'Harfler',
        title: 'Harfler hasarli',
        text: 'Gorunur elemanlar kontrol edildi, yenilendi ve hizalandi.',
        image: '/generated/referenzen/agent-facade/led-letters-after-result.png',
        imageAlt: 'Cephede yenilenen isikli harfler',
      },
      {
        tag: 'Sokum',
        title: 'Eski tabela kaldirildi',
        text: 'Sokum, erisim ve lokasyondaki sonraki adim icin hazirlik.',
        image: '/generated/referenzen/agent-facade/facade-mounting-lift.png',
        imageAlt: 'Cephe reklaminda montaj veya sokum icin calisma platformu',
      },
      {
        tag: 'Teshis',
        title: 'Guc kaynagi kontrolu',
        text: 'Guc unitesi, kablo ve gorunur ariza kaynaklari incelendi.',
        image: '/generated/referenzen/local-main/power-diagnostics.png',
        imageAlt: 'Tabela icin guc kaynagi teshisi',
      },
      {
        tag: 'Cephe',
        title: 'Erisim hazirlandi',
        text: 'Montaj noktasi, yukseklik ve calisma erisimi netlestirildi.',
        image: '/generated/referenzen/local-main/facade-mounting-check.png',
        imageAlt: 'Cephede erisim ve montaj noktasi kontrolu',
      },
    ],
    closing: {
      tag: 'Servis isi',
      title: 'Tek lokasyonda birden fazla is',
      text: 'Onarim, folyo, montaj veya sokum tek bir net servis akisi icinde toplanabilir.',
      image: '/generated/referenzen/agent-facade/wide-hero-service-result.png',
      imageAlt: 'Isletme cephesinde tamamlanmis servis isi',
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
    featuredBeforeAlt: 'Nierowno podswietlony kaseton przed naprawa',
    featuredAfterAlt: 'Ponownie widoczny podswietlony kaseton po naprawie',
    cases: [
      {
        tag: 'LED serwis',
        title: 'LED migocze',
        text: 'Moduly i zasilanie sprawdzone, uszkodzone elementy wymienione.',
        image: '/generated/referenzen/local-main/led-module-repair.png',
        imageAlt: 'Naprawa modulu LED w reklamie swietlnej',
      },
      {
        tag: 'Folia',
        title: 'Folia odchodzi',
        text: 'Powierzchnia oczyszczona, folia przygotowana i nalozona ponownie.',
        image: '/generated/referenzen/local-main/window-film-after.png',
        imageAlt: 'Nowo nalozona folia okienna w lokalizacji biznesowej',
      },
      {
        tag: 'Litery',
        title: 'Litery uszkodzone',
        text: 'Widoczne elementy sprawdzone, odnowione i ponownie ustawione.',
        image: '/generated/referenzen/agent-facade/led-letters-after-result.png',
        imageAlt: 'Odnowione podswietlane litery na fasadzie',
      },
      {
        tag: 'Demontaz',
        title: 'Stara reklama zdjeta',
        text: 'Demontaz, dostep i przygotowanie do kolejnego kroku dla obiektu.',
        image: '/generated/referenzen/agent-facade/facade-mounting-lift.png',
        imageAlt: 'Platforma robocza przy montazu lub demontazu reklamy fasadowej',
      },
      {
        tag: 'Diagnostyka',
        title: 'Sprawdzenie zasilania',
        text: 'Zasilacz, przewody i widoczne zrodla usterki zostaly ocenione.',
        image: '/generated/referenzen/local-main/power-diagnostics.png',
        imageAlt: 'Diagnostyka zasilania reklamy',
      },
      {
        tag: 'Fasada',
        title: 'Dostep przygotowany',
        text: 'Punkt montazu, wysokosc i dostep do pracy zostaly wyjasnione.',
        image: '/generated/referenzen/local-main/facade-mounting-check.png',
        imageAlt: 'Kontrola dostepu i punktu montazu na fasadzie',
      },
    ],
    closing: {
      tag: 'Serwis',
      title: 'Kilka zadan w jednej lokalizacji',
      text: 'Naprawe, folie, montaz lub demontaz mozna polaczyc w jeden przejrzysty proces.',
      image: '/generated/referenzen/agent-facade/wide-hero-service-result.png',
      imageAlt: 'Zakonczony serwis na fasadzie lokalu',
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
    featuredBeforeAlt: 'صندوق مضيء باضاءة غير منتظمة قبل الاصلاح',
    featuredAfterAlt: 'صندوق مضيء بعد استعادة الاضاءة',
    cases: [
      {
        tag: 'خدمة LED',
        title: 'LED يومض',
        text: 'تم فحص الوحدات ومصدر الطاقة واستبدال المكونات التالفة.',
        image: '/generated/referenzen/local-main/led-module-repair.png',
        imageAlt: 'اصلاح وحدة LED في اعلان مضيء',
      },
      {
        tag: 'فيلم',
        title: 'الفيلم ينفصل',
        text: 'تم تنظيف السطح وتجهيز الفيلم وتطبيقه من جديد بشكل نظيف.',
        image: '/generated/referenzen/local-main/window-film-after.png',
        imageAlt: 'فيلم نافذة جديد في موقع تجاري',
      },
      {
        tag: 'حروف',
        title: 'حروف متضررة',
        text: 'تم فحص العناصر الظاهرة وتجديدها واعادة ضبطها.',
        image: '/generated/referenzen/agent-facade/led-letters-after-result.png',
        imageAlt: 'حروف مضيئة مجددة على واجهة',
      },
      {
        tag: 'تفكيك',
        title: 'ازالة لوحة قديمة',
        text: 'تفكيك وتجهيز الوصول والخطوة التالية في الموقع.',
        image: '/generated/referenzen/agent-facade/facade-mounting-lift.png',
        imageAlt: 'منصة عمل اثناء تركيب او تفكيك اعلان واجهة',
      },
      {
        tag: 'تشخيص',
        title: 'فحص مصدر الطاقة',
        text: 'تم فحص وحدة الطاقة والاسلاك ومصادر الخلل الظاهرة.',
        image: '/generated/referenzen/local-main/power-diagnostics.png',
        imageAlt: 'تشخيص مصدر الطاقة للوحة اعلانية',
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
      text: 'يمكن جمع الاصلاح والفيلم والتركيب او التفكيك في مسار خدمة واضح واحد.',
      image: '/generated/referenzen/agent-facade/wide-hero-service-result.png',
      imageAlt: 'حالة خدمة مكتملة على واجهة تجارية',
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
            <article className="flex h-[584px] w-[340px] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_10px_26px_rgba(0,0,0,0.055)] sm:h-[620px] sm:w-[430px] lg:h-[660px] lg:w-[560px]">
              <div className="grid h-[300px] grid-cols-2 overflow-hidden sm:h-[340px] lg:h-[390px]">
                <div className="relative min-w-0">
                  <Image
                    src="/generated/referenzen/local-main/lightbox-before.png"
                    alt={copy.featuredBeforeAlt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 43vw"
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#0E1A2B] shadow-sm rtl:left-auto rtl:right-4">
                    {copy.beforeLabel}
                  </span>
                </div>
                <div className="relative min-w-0 border-s border-white/40">
                  <Image
                    src="/generated/referenzen/local-main/lightbox-after.png"
                    alt={copy.featuredAfterAlt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 43vw"
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[#B8643E] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-sm rtl:left-auto rtl:right-4">
                    {copy.afterLabel}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
                <span className="w-fit rounded-full bg-[#F0E2D8] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#8F4C2F]">
                  {copy.featuredTag}
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className="text-[24px] font-black leading-[1.1] tracking-[0] text-[#0E1A2B] md:text-[30px]">
                    {copy.featuredTitle}
                  </h3>
                  <p className="text-[14px] font-semibold leading-[1.5] text-[#6E6E73]">
                    {copy.featuredProblem}
                  </p>
                  <p className="border-t border-[#E4E7EC] pt-3 text-[14px] font-black leading-[1.45] text-[#0E1A2B]">
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
                    className="flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_10px_26px_rgba(0,0,0,0.055)]"
                  >
                    <div className="relative h-[145px] shrink-0 overflow-hidden sm:h-[162px] lg:h-[176px]">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 360px, (min-width: 640px) 330px, 286px"
                        className="object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/34 to-transparent" />
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#8F4C2F] shadow-sm rtl:left-auto rtl:right-4">
                        {item.tag}
                      </span>
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col gap-2 p-5">
                      <h3 className="text-[21px] font-black leading-[1.12] tracking-[0] text-[#0E1A2B]">
                        {item.title}
                      </h3>
                      <p className="text-[14px] font-semibold leading-[1.45] text-[#6E6E73]">
                        {item.text}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ))}

            <article className="flex h-[584px] w-[340px] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_10px_26px_rgba(0,0,0,0.055)] sm:h-[620px] sm:w-[430px] lg:h-[660px] lg:w-[560px]">
              <div className="relative h-[350px] shrink-0 overflow-hidden sm:h-[385px] lg:h-[430px]">
                <Image
                  src={copy.closing.image}
                  alt={copy.closing.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 560px, (min-width: 640px) 430px, 340px"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/38 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#8F4C2F] shadow-sm rtl:left-auto rtl:right-5">
                  {copy.closing.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
                <h3 className="text-[24px] font-black leading-[1.1] tracking-[0] text-[#0E1A2B] md:text-[30px]">
                  {copy.closing.title}
                </h3>
                <p className="text-[14px] font-semibold leading-[1.5] text-[#6E6E73]">
                  {copy.closing.text}
                </p>
              </div>
            </article>
          </div>
        </div>
    </section>
  );
}
