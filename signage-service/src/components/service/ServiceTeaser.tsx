'use client';

import { Link } from '@/i18n/routing';

type FeatureItem = {
  title: string;
  desc: string;
};

type TeaserContent = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  cardTitle: string;
  features: FeatureItem[];
  cta: string;
  ctaHref: string;
};

const TEASER_TRANSLATIONS: Record<string, TeaserContent> = {
  de: {
    eyebrow: 'PixelRing Standort-Abo',
    title: 'Tarife in Vorbereitung',
    titleAccent: 'Demnächst verfügbar',
    description: 'Wir entwickeln strukturierte Tarife für die kontinuierliche Prüfung, Wartung und Pflege Ihrer Markenstandorte. Bald können Sie Ihr passendes Paket direkt hier wählen.',
    cardTitle: 'Was Sie im Standort-Abo erwartet:',
    features: [
      { title: 'Regelmäßige Audits', desc: 'Systematische Vor-Ort-Checks und Fotoberichte aller visuellen Elemente.' },
      { title: 'Planbare Betreuung', desc: 'Feste Wartungsintervalle zur Vermeidung teurer Notfall-Reparaturen.' },
      { title: 'Zentraler Service', desc: 'Ein Ansprechpartner für Werbetechnik, Montage, Reinigung und Print.' },
      { title: 'Kundenportal', desc: 'Live-Übersicht des Zustands aller Standorte mit Brand Health Score.' }
    ],
    cta: 'Jetzt Audit anfragen',
    ctaHref: '/#kontakt'
  },
  en: {
    eyebrow: 'PixelRing Location Subscription',
    title: 'Rates in Preparation',
    titleAccent: 'Coming Soon',
    description: 'We are developing structured rates for the continuous inspection, maintenance, and care of your brand locations. Soon you will be able to choose your package right here.',
    cardTitle: 'What to expect in the Location Subscription:',
    features: [
      { title: 'Regular Audits', desc: 'Systematic on-site checks and photo reports of all visual elements.' },
      { title: 'Planned Care', desc: 'Fixed maintenance intervals to avoid expensive emergency repairs.' },
      { title: 'Central Service', desc: 'One point of contact for signage, installation, cleaning, and print.' },
      { title: 'Customer Portal', desc: 'Live overview of the status of all locations with a Brand Health Score.' }
    ],
    cta: 'Request Audit Now',
    ctaHref: '/#kontakt'
  },
  ru: {
    eyebrow: 'PixelRing Standort-Abo',
    title: 'Тарифы в подготовке',
    titleAccent: 'Скоро запуск',
    description: 'Мы разрабатываем структурированные тарифы для регулярной проверки, обслуживания и ухода за вашими рекламными конструкциями. Скоро вы сможете выбрать подходящий пакет прямо здесь.',
    cardTitle: 'Что входит в подписку на локацию (Standort-Abo):',
    features: [
      { title: 'Регулярные аудиты', desc: 'Систематические выездные проверки и фотоотчеты всех визуальных элементов.' },
      { title: 'Плановый уход', desc: 'Фиксированные интервалы обслуживания во избежание дорогостоящих аварийных ремонтов.' },
      { title: 'Единый сервис', desc: 'Один контакт для рекламных технологий, монтажа, чистки и печати.' },
      { title: 'Портал клиента', desc: 'Онлайн-обзор состояния всех локаций с индексом здоровья бренда (Brand Health Score).' }
    ],
    cta: 'Запросить аудит',
    ctaHref: '/#kontakt'
  },
  tr: {
    eyebrow: 'PixelRing Lokasyon Aboneliği',
    title: 'Tarifeler Hazırlanıyor',
    titleAccent: 'Yakında Aktif',
    description: 'Marka lokasyonlarınızın sürekli denetimi, bakımı ve özeni için yapılandırılmış tarifeler geliştiriyoruz. Yakında paketinizi doğrudan buradan seçebileceksiniz.',
    cardTitle: 'Lokasyon Aboneliğinde sizi neler bekliyor:',
    features: [
      { title: 'Düzenli Denetimler', desc: 'Tüm görsel öğelerin sistematik yerinde kontrolleri ve fotoğraf raporları.' },
      { title: 'Planlı Bakım', desc: 'Pahalı acil onarımlardan kaçınmak için sabit bakım aralıkları.' },
      { title: 'Merkezi Hizmet', desc: 'Tabela, montaj, temizlik ve baskı için tek bir iletişim noktası.' },
      { title: 'Müşteri Portali', desc: 'Marka Sağlık Skoru ile tüm lokasyonların durumuna canlı genel bakış.' }
    ],
    cta: 'Şimdi Audit Talep Et',
    ctaHref: '/#kontakt'
  },
  pl: {
    eyebrow: 'Abonament Lokalizacyjny PixelRing',
    title: 'Taryfy w Przygotowaniu',
    titleAccent: 'Wkrótce Dostępne',
    description: 'Opracowujemy ustrukturyzowane taryfy na ciągłą kontrolę, konserwację i pielęgnację lokalizacji Twojej marki. Wkrótce będzie można wybrać odpowiedni pakiet bezpośrednio tutaj.',
    cardTitle: 'Czego można się spodziewać w Abonamencie Lokalizacyjnym:',
    features: [
      { title: 'Regularne Audyty', desc: 'Systematyczne kontrole na miejscu i raporty fotograficzne wszystkich elementów wizualnych.' },
      { title: 'Planowana Opieka', desc: 'Stałe okresy konserwacji pozwalające uniknąć kosztownych napraw awaryjnych.' },
      { title: 'Centralny Serwis', desc: 'Jeden punkt kontaktowy w zakresie reklamy świetlnej, montażu, czyszczenia i druku.' },
      { title: 'Portal Klienta', desc: 'Przegląd na żywo stanu wszystkich lokalizacji wraz z wskaźnikiem Brand Health Score.' }
    ],
    cta: 'Zamów Audit Teraz',
    ctaHref: '/#kontakt'
  },
  ar: {
    eyebrow: 'اشتراك موقع PixelRing',
    title: 'التعرفات قيد الإعداد',
    titleAccent: 'قريباً',
    description: 'نحن نعمل على تطوير تعرفات منظمة للفحص المستمر والصيانة والرعاية لمواقع علامتك التجارية. قريباً ستتمكن من اختيار باقتك مباشرة من هنا.',
    cardTitle: 'ماذا تتوقع في اشتراك الموقع:',
    features: [
      { title: 'عمليات تدقيق منتظمة', desc: 'عمليات فحص دورية في الموقع وتقارير مصورة لجميع العناصر البصرية.' },
      { title: 'رعاية مخططة', desc: 'فترات صيانة محددة لتجنب الإصلاحات الطارئة المكلفة.' },
      { title: 'خدمة مركزية', desc: 'نقطة اتصال واحدة للافتات، والتركيب، والتنظيف، والطباعة.' },
      { title: 'بوابة العملاء', desc: 'نظرة عامة مباشرة على حالة جميع المواقع مع نقاط صحة العلامة التجارية.' }
    ],
    cta: 'طلب تدقيق الآن',
    ctaHref: '/#kontakt'
  }
};

export default function ServiceTeaser({ locale }: { locale: string }) {
  const trans = TEASER_TRANSLATIONS[locale] || TEASER_TRANSLATIONS.de;

  return (
    <main className="flex-1 bg-[#F7F1E8] px-6 py-20 lg:py-28 text-[#0D1B2A] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient Glowing Sphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B8643E]/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Eyebrow Label */}
        <p className="text-xs font-black uppercase tracking-[1.7px] text-[#B8643E] flex items-center justify-center gap-2.5">
          <span className="h-[1px] w-[34px] bg-[#B8643E]/80 shrink-0" />
          {trans.eyebrow}
          <span className="h-[1px] w-[34px] bg-[#B8643E]/80 shrink-0" />
        </p>

        {/* Heading */}
        <h1 className="mt-5 font-outfit text-4xl font-extrabold leading-[1.08] text-[#0D1B2A] sm:text-5xl lg:text-6xl">
          {trans.title}
          <span className="block text-[#B8643E] mt-1">{trans.titleAccent}</span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#566273] max-w-xl mx-auto">
          {trans.description}
        </p>
      </div>

      {/* Feature Preview Card */}
      <div className="relative z-10 w-full max-w-xl mt-10 rounded-[28px] border border-[#E7DDD3] bg-[#FFFDF9] p-7 sm:p-9 shadow-[0_18px_48px_rgba(13,27,42,0.08)] overflow-hidden">
        <h3 className="font-outfit text-sm font-black uppercase tracking-wider text-[#0D1B2A] border-b border-[#E7DDD3] pb-4 mb-6">
          {trans.cardTitle}
        </h3>

        <div className="grid gap-5 sm:grid-cols-2">
          {trans.features.map((feat, idx) => (
            <div key={idx} className="flex gap-3 text-start">
              <span className="h-6 w-6 rounded-lg bg-[#F4E6DC] text-xs font-black text-[#B8643E] flex items-center justify-center shrink-0 mt-0.5 select-none">
                {idx + 1}
              </span>
              <div>
                <h4 className="font-outfit text-sm font-extrabold text-[#0D1B2A]">{feat.title}</h4>
                <p className="mt-1 text-xs leading-normal text-[#5A6574]">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-[#E7DDD3] flex justify-center">
          <Link
            href={trans.ctaHref}
            className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-br from-[#B8643E] to-[#D17B50] px-8 text-sm font-black text-white shadow-[0_14px_30px_rgba(184,100,62,0.24)] transition hover:-translate-y-0.5 hover:from-[#9F5131] hover:to-[#B8643E]"
          >
            {trans.cta}
          </Link>
        </div>
      </div>
    </main>
  );
}
