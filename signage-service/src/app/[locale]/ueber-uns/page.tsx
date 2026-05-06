import type { Metadata } from 'next';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';
import { getGlobalPageCmsContent } from '@/lib/cms/pages';
import CmsImage from '@/components/common/CmsImage';
import React from 'react';

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

type AboutContent = {
  metaTitle: string;
  metaDescription: string;
  hero: {
    badge: string;
    title: string;
    intro: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  stats: { value: string; label: string }[];
  services: { id: string; title: string; description: string }[];
  about: {
    title: string;
    cta: string;
    accordions: { title: string; content: string }[];
  };
  quality: {
    title: string;
    description: string;
    features: string[];
    cta: string;
  };
  deepDive: {
    id: string;
    title: string;
    description: string;
    specs: { label: string; value: string }[];
    cta: string;
  }[];
  final: {
    title: string;
    description: string;
    button: string;
  };
};

const CONTENT: Record<Locale, AboutContent> = {
  de: {
    metaTitle: 'Über uns – Servicepartner für Werbeanlagen | PixelRing',
    metaDescription: 'PixelRing ist ein verantwortlicher Servicepartner für Reparatur, Wartung, Modernisierung und Audit von Werbeanlagen.',
    hero: {
      badge: 'Service für Werbeanlagen • Seit 2023',
      title: 'Ein verantwortlicher Servicepartner für Werbeanlagen',
      intro: 'PixelRing koordiniert Reparatur, Wartung, Montage und Audit aus einer Hand. Kein Marktplatz, keine anonyme Vermittlung: eine Anfrage, klare Verantwortung, Ausführung durch Fachleute.',
      ctaPrimary: 'Anfrage starten',
      ctaSecondary: 'Rückruf anfordern'
    },
    stats: [
      { value: '2023', label: 'Service für Werbeanlagen' },
      { value: '100+', label: 'Abgeschlossene Servicefälle' },
      { value: '50+', label: 'Betreute Anlagen' },
      { value: '1', label: 'Verantwortlicher Ansprechpartner' }
    ],
    services: [
      { id: 's1', title: 'Schilder-Reparatur', description: 'Schnelle Instandsetzung von Gehäusen und Fronten.' },
      { id: 's2', title: 'Lichttechnik', description: 'Umrüstung auf hocheffiziente LED-Systeme.' },
      { id: 's3', title: 'Wartungsservice', description: 'Präventive Pflege für lange Lebensdauer.' },
      { id: 's4', title: 'Objektaudit', description: 'Strukturelle Prüfung und Dokumentation.' }
    ],
    about: {
      title: 'So arbeitet PixelRing',
      cta: 'Mehr erfahren',
      accordions: [
        { title: 'Unsere Mission', content: 'Wir glauben, dass Qualität aus direktem Kontakt entsteht. Kein Vermittler, kein Subunternehmer. Sie sprechen mit den Ingenieuren, die Ihre Anlage reparieren.' },
        { title: 'Unsere Vision', content: 'Ein verlässlicher Servicepartner für transparente und technologisch unterstützte Instandhaltung von Werbesystemen zu sein.' },
        { title: 'Meister-Standard', content: 'Jede Arbeit folgt unseren strengen Qualitätsrichtlinien: millimetergenaue Ausführung und dokumentierte Prozesse.' }
      ]
    },
    quality: {
      title: 'Qualität, die für sich spricht',
      description: 'Qualität zeigt sich bei uns in präziser Diagnose, sauberer Ausführung, verständlicher Dokumentation und einem stabilen Ergebnis am Objekt.',
      features: ['Präzise Diagnose', 'Saubere Ausführung', 'Praktische Reparaturlösungen', 'Nachvollziehbare Dokumentation'],
      cta: 'Referenzen ansehen'
    },
    deepDive: [
      {
        id: 'dd1',
        title: 'Reparatur & Wartung von Außenwerbung',
        description: 'Professionelle Instandsetzung von Werbeanlagen, Leuchtwerbung und Außenwerbung. Wir verlängern die Lebensdauer Ihrer Anlagen durch gezielte Eingriffe.',
        specs: [{ label: 'Reaktionszeit', value: 'Unter 24h' }, { label: 'Material', value: 'Zertifiziert' }, { label: 'Personal', value: 'Eigene Techniker' }],
        cta: 'Details ansehen'
      },
      {
        id: 'dd2',
        title: 'Modernisierung von Lichtwerbung & LED-Systemen',
        description: 'Umrüstung alter Leuchtschriften auf moderne LED-Technik. Sparen Sie bis zu 70% Energiekosten bei gleicher Leuchtkraft.',
        specs: [{ label: 'Ersparnis', value: 'Bis 70%' }, { label: 'Garantie', value: '24 Monate' }, { label: 'Technik', value: 'Top-Tier LED' }],
        cta: 'Jetzt umrüsten'
      },
      {
        id: 'dd3',
        title: 'Inspektion & Audit von Werbeanlagen',
        description: 'Prüfung von Standsicherheit, Befestigungen und elektrischer Sicherheit Ihrer Werbeanlagen inklusive digitalem Prüfprotokoll.',
        specs: [{ label: 'Reichweite', value: 'Deutschlandweit' }, { label: 'Protokoll', value: 'PR-Digital' }, { label: 'Prüfung', value: 'Nach VDE/DIN' }],
        cta: 'Audit buchen'
      }
    ],
    final: {
      title: 'Beschreiben Sie Ihre Aufgabe rund um die Werbeanlage',
      description: 'Beschreiben Sie Ihr Anliegen. Wir prüfen die Angaben, klären offene Punkte und führen Sie zum nächsten sinnvollen Schritt.',
      button: 'Jetzt anfragen'
    }
  },
  en: {
    metaTitle: 'About Us – Service Partner for Signage Systems | PixelRing',
    metaDescription: 'PixelRing is one accountable service partner for signage repair, maintenance, modernization, and audits.',
    hero: {
      badge: 'Signage service • Since 2023',
      title: 'One Accountable Service Partner for Signage Systems',
      intro: 'PixelRing coordinates repair, maintenance, installation, and audits from one place. No marketplace, no anonymous broker: one request, clear responsibility, specialist execution.',
      ctaPrimary: 'Submit a Request',
      ctaSecondary: 'Request Callback'
    },
    stats: [
      { value: '2023', label: 'Signage service' },
      { value: '100+', label: 'Completed service cases' },
      { value: '50+', label: 'Supported systems' },
      { value: '1', label: 'Accountable contact' }
    ],
    services: [
      { id: 's1', title: 'Sign Repair', description: 'Fast repair of enclosures and fronts.' },
      { id: 's2', title: 'Lighting Tech', description: 'Retrofitting to high-efficiency LED.' },
      { id: 's3', title: 'Maintenance', description: 'Preventive care for long life.' },
      { id: 's4', title: 'Site Audit', description: 'Structural testing and documentation.' }
    ],
    about: {
      title: 'How PixelRing Works',
      cta: 'Learn More',
      accordions: [
        { title: 'Our Mission', content: 'We believe quality comes from direct contact. No broker, no subcontractor. You speak with the engineers who repair your installation.' },
        { title: 'Our Vision', content: 'To be a reliable service partner for transparent, technology-supported maintenance of signage systems.' },
        { title: 'Meister-Standard', content: 'Every job follows our strict quality guidelines: millimetre-accurate execution and documented processes.' }
      ]
    },
    quality: {
      title: 'Quality That Speaks for Itself',
      description: 'For us, quality means precise diagnosis, clean execution, clear documentation, and a stable result on site.',
      features: ['Precise Diagnosis', 'Clean Execution', 'Practical Repair Solutions', 'Clear Documentation'],
      cta: 'View References'
    },
    deepDive: [
      {
        id: 'dd1',
        title: 'Outdoor Advertising Repair & Maintenance',
        description: 'Professional repair of signage systems, illuminated advertising, and outdoor advertising. We extend the life of your systems through targeted interventions.',
        specs: [{ label: 'Response', value: 'Under 24h' }, { label: 'Material', value: 'Certified' }, { label: 'Staff', value: 'In-house' }],
        cta: 'View Details'
      },
      {
        id: 'dd2',
        title: 'Modernization of Illuminated Signs & LED Systems',
        description: 'Retrofitting old illuminated signs to modern LED technology. Save up to 70% in energy costs.',
        specs: [{ label: 'Savings', value: 'Up to 70%' }, { label: 'Warranty', value: '24 Months' }, { label: 'Tech', value: 'Top-Tier LED' }],
        cta: 'Retrofit Now'
      },
      {
        id: 'dd3',
        title: 'Inspection & Audit of Signage Systems',
        description: 'Inspection of structural stability, fixings, and electrical safety of your signage, including digital inspection protocol.',
        specs: [{ label: 'Coverage', value: 'Nationwide' }, { label: 'Protocol', value: 'PR-Digital' }, { label: 'Standards', value: 'VDE/DIN' }],
        cta: 'Book Audit'
      }
    ],
    final: {
      title: 'Describe the Task Around Your Signage System',
      description: 'Describe your issue. We review the details, clarify open points, and guide you toward the next practical step.',
      button: 'Inquire Now'
    }
  },
  ru: {
    metaTitle: 'О нас – сервисный партнёр для рекламных систем | PixelRing',
    metaDescription: 'PixelRing — один ответственный сервисный партнёр для ремонта, обслуживания, модернизации и аудита рекламных систем.',
    hero: {
      badge: 'Сервис вывесок • С 2023 года',
      title: 'Один ответственный сервисный партнёр для рекламных систем',
      intro: 'PixelRing координирует ремонт, обслуживание, монтаж и аудит из одной точки. Не маркетплейс и не анонимный посредник: одна заявка, понятная ответственность, работа специалистов.',
      ctaPrimary: 'Оставить заявку',
      ctaSecondary: 'Заказать звонок'
    },
    stats: [
      { value: '2023', label: 'Сервис рекламных систем' },
      { value: '100+', label: 'Закрытых сервисных случаев' },
      { value: '50+', label: 'Обслуживаемых установок' },
      { value: '1', label: 'Ответственный контакт' }
    ],
    services: [
      { id: 's1', title: 'Ремонт вывесок', description: 'Быстрое восстановление корпусов и фасадов.' },
      { id: 's2', title: 'Светотехника', description: 'Модернизация и установка LED-систем.' },
      { id: 's3', title: 'Обслуживание', description: 'Профилактика для долгого срока службы.' },
      { id: 's4', title: 'Аудит объектов', description: 'Проверка конструкций и документация.' }
    ],
    about: {
      title: 'Как работает PixelRing',
      cta: 'Узнать больше',
      accordions: [
        { title: 'Наша миссия', content: 'Мы убеждены: качество рождается из прямого контакта. Никаких посредников и субподрядчиков. Вы общаетесь с инженерами напрямую.' },
        { title: 'Наше видение', content: 'Быть надёжным сервисным партнёром для прозрачного и технологически поддержанного обслуживания рекламных систем.' },
        { title: 'Стандарт Meister', content: 'Каждая работа следует строгим правилам качества: точность до миллиметра и задокументированные процессы.' }
      ]
    },
    quality: {
      title: 'Качество, которое говорит само за себя',
      description: 'О качестве нашей работы говорят точная диагностика, чистое выполнение, понятная документация и стабильный результат на объекте.',
      features: ['Точная диагностика', 'Чистое выполнение', 'Практичные решения', 'Понятная документация'],
      cta: 'Смотреть примеры работ'
    },
    deepDive: [
      {
        id: 'dd1',
        title: 'Ремонт и обслуживание наружной рекламы',
        description: 'Профессиональное восстановление вывесок, световой рекламы и наружных рекламных конструкций. Мы продлеваем срок службы ваших систем.',
        specs: [{ label: 'Реакция', value: 'Менее 24 ч' }, { label: 'Материалы', value: 'Сертифицированные' }, { label: 'Команда', value: 'Собственные техники' }],
        cta: 'Подробнее'
      },
      {
        id: 'dd2',
        title: 'Модернизация световой рекламы и LED-систем',
        description: 'Модернизация старых вывесок под современные LED-системы. Это снижает энергопотребление и упрощает обслуживание.',
        specs: [{ label: 'Экономия', value: 'До 70%' }, { label: 'Гарантия', value: '24 месяца' }, { label: 'Компоненты', value: 'LED высокого класса' }],
        cta: 'Заказать модернизацию'
      },
      {
        id: 'dd3',
        title: 'Инспекция и аудит рекламных установок',
        description: 'Проверяем устойчивость, крепления и электробезопасность рекламных установок. По итогам готовим цифровой протокол PixelRing.',
        specs: [{ label: 'Охват', value: 'Вся Германия' }, { label: 'Протокол', value: 'PixelRing Digital' }, { label: 'Нормы', value: 'VDE/DIN' }],
        cta: 'Заказать аудит'
      }
    ],
    final: {
      title: 'Опишите задачу по вашей рекламной установке',
      description: 'Опишите проблему с вывеской или рекламной системой. Мы проверим детали, уточним открытые вопросы и подскажем следующий практичный шаг.',
      button: 'Запросить сейчас'
    }
  },
  tr: {
    metaTitle: 'Hakkımızda – Reklam Sistemleri Teknik Atölyesi | PixelRing',
    metaDescription: 'PixelRing, tabela onarımı, bakımı ve profesyonel denetim için teknik bir atölyedir. Kendi mühendislerimiz, Meister-Standart.',
    hero: {
      badge: 'Tabela servisi • 2023\'ten beri',
      title: 'Reklam Sistemleri İçin Tek Sorumlu Servis Ortağı',
      intro: 'PixelRing onarım, bakım, montaj ve denetimi tek noktadan koordine eder. Pazar yeri veya anonim aracı değil: tek talep, net sorumluluk, uzman uygulama.',
      ctaPrimary: 'Talep Oluştur',
      ctaSecondary: 'Beni Ara'
    },
    stats: [
      { value: '2023', label: 'Tabela servisi' },
      { value: '100+', label: 'Tamamlanan servis vakası' },
      { value: '50+', label: 'Desteklenen sistem' },
      { value: '1', label: 'Sorumlu iletişim' }
    ],
    services: [
      { id: 's1', title: 'Tabela Onarımı', description: 'Gövde ve cephelerin hızlı onarımı.' },
      { id: 's2', title: 'Aydınlatma', description: 'Yüksek verimli LED sistemlerine dönüşüm.' },
      { id: 's3', title: 'Bakım Servisi', description: 'Uzun ömür için önleyici bakım.' },
      { id: 's4', title: 'Saha Denetimi', description: 'Yapısal test ve dökümantasyon.' }
    ],
    about: {
      title: 'PixelRing Nasıl Çalışır',
      cta: 'Daha Fazla Bilgi',
      accordions: [
        { title: 'Misyonumuz', content: 'Kalitenin doğrudan temastan doğduğuna inanıyoruz. Aracı yok, taşeron yok. Tesisatınızı onaran mühendislerle konuşursunuz.' },
        { title: 'Vizyonumuz', content: 'Tabela sistemlerinin şeffaf ve teknoloji destekli bakımı için güvenilir bir servis ortağı olmak.' },
        { title: 'Meister-Standart', content: 'Her iş, katı kalite yönergelerimizi takip eder: milimetre düzeyinde hassasiyet ve belgelenmiş süreçler.' }
      ]
    },
    quality: {
      title: 'Kendini Kanıtlayan Kalite',
      description: 'Bizim için kalite; doğru teşhis, temiz uygulama, anlaşılır dokümantasyon ve sahada istikrarlı sonuç demektir.',
      features: ['Doğru teşhis', 'Temiz uygulama', 'Pratik onarım çözümleri', 'Anlaşılır dokümantasyon'],
      cta: 'Referansları Gör'
    },
    deepDive: [
      {
        id: 'dd1',
        title: 'Dış Mekan Reklamlarının Onarımı ve Bakımı',
        description: 'Tabela, ışıklı reklam ve dış mekan reklam sistemlerinin profesyonel onarımı. Hedefli müdahalelerle sistemlerinizin ömrünü uzatıyoruz.',
        specs: [{ label: 'Yanıt', value: '24 saat altı' }, { label: 'Malzeme', value: 'Sertifikalı' }, { label: 'Personel', value: 'Öz Tekniker' }],
        cta: 'Detayları Gör'
      },
      {
        id: 'dd2',
        title: 'Işıklı Reklam ve LED Sistemlerinin Modernizasyonu',
        description: 'Eski tabelaların modern LED teknolojisine dönüştürülmesi. Enerjiden %70 tasarruf edin.',
        specs: [{ label: 'Tasarruf', value: '%70\'e kadar' }, { label: 'Garanti', value: '24 Ay' }, { label: 'Teknoloji', value: 'Top-Tier LED' }],
        cta: 'Dönüşümü Başlat'
      },
      {
        id: 'dd3',
        title: 'Reklam Sistemleri İçin İnceleme ve Denetim',
        description: 'Tabela ve reklam sistemlerinizin taşıyıcılık, bağlantı ve elektrik güvenliğini dijital raporla kontrol ederiz.',
        specs: [{ label: 'Kapsam', value: 'Tüm Almanya' }, { label: 'Protokol', value: 'PR-Dijital' }, { label: 'Standart', value: 'VDE/DIN' }],
        cta: 'Denetim Randevusu'
      }
    ],
    final: {
      title: 'Reklam Sisteminizle İlgili Görevi Açıklayın',
      description: 'Sorununuzu açıklayın. Bilgileri kontrol eder, açık noktaları netleştirir ve sizi bir sonraki pratik adıma yönlendiririz.',
      button: 'Şimdi Sorun'
    }
  },
  pl: {
    metaTitle: 'O nas – Atelier techniczne systemów reklamowych | PixelRing',
    metaDescription: 'PixelRing to techniczne atelier napraw, konserwacji i profesjonalnego audytu systemów reklamowych. Własni inżynierowie, standard Meister.',
    hero: {
      badge: 'Serwis reklam • Od 2023',
      title: 'Jeden odpowiedzialny partner serwisowy dla systemów reklamowych',
      intro: 'PixelRing koordynuje naprawy, konserwację, montaż i audyty z jednego miejsca. Nie marketplace i nie anonimowy pośrednik: jedno zgłoszenie, jasna odpowiedzialność, wykonanie przez specjalistów.',
      ctaPrimary: 'Złóż zapytanie',
      ctaSecondary: 'Zamów oddzwonienie'
    },
    stats: [
      { value: '2023', label: 'Serwis systemów reklamowych' },
      { value: '100+', label: 'Zamkniętych spraw serwisowych' },
      { value: '50+', label: 'Obsługiwanych instalacji' },
      { value: '1', label: 'Odpowiedzialny kontakt' }
    ],
    services: [
      { id: 's1', title: 'Naprawa szyldów', description: 'Szybka naprawa obudów i frontów.' },
      { id: 's2', title: 'Technika świetlna', description: 'Modernizacja na systemy LED.' },
      { id: 's3', title: 'Serwis konserwacyjny', description: 'Profilaktyka dla długiej żywotności.' },
      { id: 's4', title: 'Audyt obiektów', description: 'Testy strukturalne i dokumentacja.' }
    ],
    about: {
      title: 'Jak Pracuje PixelRing',
      cta: 'Dowiedz się więcej',
      accordions: [
        { title: 'Nasza misja', content: 'Wierzymy, że jakość rodzi się z bezpośredniego kontaktu. Bez pośredników. Rozmawiasz z inżynierami, którzy naprawiają Twoją instalację.' },
        { title: 'Nasza wizja', content: 'Być wiarygodnym partnerem serwisowym dla przejrzystej, wspieranej technologią konserwacji systemów reklamowych.' },
        { title: 'Standard Meister', content: 'Każda praca podąża za surowymi wytycznymi: milimetrowa precyzja i udokumentowane procesy.' }
      ]
    },
    quality: {
      title: 'Jakość, która mówi sama za siebie',
      description: 'Jakość oznacza dla nas dokładną diagnozę, czyste wykonanie, zrozumiałą dokumentację i stabilny rezultat na obiekcie.',
      features: ['Dokładna diagnoza', 'Czyste wykonanie', 'Praktyczne rozwiązania', 'Zrozumiała dokumentacja'],
      cta: 'Zobacz referencje'
    },
    deepDive: [
      {
        id: 'dd1',
        title: 'Naprawa i konserwacja reklamy zewnętrznej',
        description: 'Profesjonalna naprawa szyldów, reklamy świetlnej i systemów reklamy zewnętrznej. Przedłużamy życie Twoich instalacji.',
        specs: [{ label: 'Reakcja', value: 'Poniżej 24h' }, { label: 'Materiały', value: 'Certyfikowane' }, { label: 'Personel', value: 'Własni technicy' }],
        cta: 'Zobacz szczegóły'
      },
      {
        id: 'dd2',
        title: 'Modernizacja reklamy świetlnej i systemów LED',
        description: 'Modernizacja starych neonów na technologię LED. Oszczędność do 70% energii.',
        specs: [{ label: 'Oszczędność', value: 'Do 70%' }, { label: 'Gwarancja', value: '24 miesiące' }, { label: 'Technika', value: 'Top-Tier LED' }],
        cta: 'Zmodernizuj teraz'
      },
      {
        id: 'dd3',
        title: 'Inspekcja i audyt systemów reklamowych',
        description: 'Sprawdzamy stabilność, mocowania i bezpieczeństwo elektryczne systemów reklamowych wraz z protokołem cyfrowym.',
        specs: [{ label: 'Zasięg', value: 'Całe Niemcy' }, { label: 'Protokół', value: 'PR-Digital' }, { label: 'Normy', value: 'VDE/DIN' }],
        cta: 'Zamów audyt'
      }
    ],
    final: {
      title: 'Opisz zadanie dotyczące Twojej reklamy',
      description: 'Opisz problem. Sprawdzimy informacje, wyjaśnimy otwarte punkty i wskażemy kolejny praktyczny krok.',
      button: 'Zapytaj teraz'
    }
  },
  ar: {
    metaTitle: 'من نحن – ورشة تقنية لأنظمة الإعلانات | بكسل رينج',
    metaDescription: 'بكسل رينج هي ورشة تقنية متخصصة في إصلاح وصيانة وتدقيق أنظمة الإعلانات الخارجية. مهندسون متخصصون، معيار مايستر.',
    hero: {
      badge: 'خدمة اللوحات الإعلانية • منذ 2023',
      title: 'شريك خدمة واحد مسؤول عن أنظمة الإعلانات',
      intro: 'ينسق بكسل رينج الإصلاح والصيانة والتركيب والتدقيق من نقطة واحدة. لسنا سوقاً ولا وسيطاً مجهولاً: طلب واحد، مسؤولية واضحة، وتنفيذ بواسطة مختصين.',
      ctaPrimary: 'أرسل طلبك',
      ctaSecondary: 'اطلب اتصالاً'
    },
    stats: [
      { value: '2023', label: 'خدمة أنظمة الإعلانات' },
      { value: '100+', label: 'حالة خدمة مكتملة' },
      { value: '50+', label: 'منشأة مدعومة' },
      { value: '1', label: 'جهة اتصال مسؤولة' }
    ],
    services: [
      { id: 's1', title: 'إصلاح اللوحات', description: 'إصلاح سريع للهياكل والواجهات.' },
      { id: 's2', title: 'تقنيات الإضاءة', description: 'التحويل إلى أنظمة LED عالية الكفاءة.' },
      { id: 's3', title: 'خدمة الصيانة', description: 'عناية وقائية لعمر أطول.' },
      { id: 's4', title: 'تدقيق المواقع', description: 'اختبارات هيكلية وتوثيق.' }
    ],
    about: {
      title: 'كيف يعمل بكسل رينج',
      cta: 'لمعرفة المزيد',
      accordions: [
        { title: 'مهمتنا', content: 'نؤمن بأن الجودة تنبع من التواصل المباشر. لا وسيط ولا مقاول. أنت تتحدث مع المهندسين الذين يصلحون منشأتك.' },
        { title: 'رؤيتنا', content: 'أن نكون شريك خدمة موثوقاً للصيانة الشفافة والمدعومة تقنياً لأنظمة الإعلانات.' },
        { title: 'معيار مايستر', content: 'يتبع كل عمل معاييرنا الصارمة للجودة: دقة بالمليمتر وعمليات موثقة.' }
      ]
    },
    quality: {
      title: 'جودة تتحدث عن نفسها',
      description: 'تعني الجودة لدينا تشخيصاً دقيقاً وتنفيذاً نظيفاً وتوثيقاً واضحاً ونتيجة مستقرة في الموقع.',
      features: ['تشخيص دقيق', 'تنفيذ نظيف', 'حلول إصلاح عملية', 'توثيق واضح'],
      cta: 'مشاهدة المراجع'
    },
    deepDive: [
      {
        id: 'dd1',
        title: 'إصلاح وصيانة الإعلانات الخارجية',
        description: 'إصلاح احترافي للوحات والإعلانات المضيئة وأنظمة الإعلانات الخارجية. نطيل عمر أنظمتك بتدخلات محددة.',
        specs: [{ label: 'الاستجابة', value: 'خلال 24 ساعة' }, { label: 'المواد', value: 'معتمدة' }, { label: 'الطاقم', value: 'فنيونا الخاصون' }],
        cta: 'مشاهدة التفاصيل'
      },
      {
        id: 'dd2',
        title: 'تحديث الإعلانات المضيئة وأنظمة LED',
        description: 'تحويل اللوحات القديمة إلى تقنية LED الحديثة. وفر حتى 70% من تكاليف الطاقة.',
        specs: [{ label: 'التوفير', value: 'حتى 70%' }, { label: 'الضمان', value: '24 شهراً' }, { label: 'التقنية', value: 'Top-Tier LED' }],
        cta: 'حول الآن'
      },
      {
        id: 'dd3',
        title: 'فحص وتدقيق أنظمة الإعلانات',
        description: 'نفحص الثبات والتثبيت والسلامة الكهربائية لأنظمة الإعلانات مع بروتوكول رقمي.',
        specs: [{ label: 'التغطية', value: 'أنحاء ألمانيا' }, { label: 'البروتوكول', value: 'PR-Digital' }, { label: 'المعايير', value: 'VDE/DIN' }],
        cta: 'احجز تدقيقاً'
      }
    ],
    final: {
      title: 'صِف المهمة المتعلقة بنظامك الإعلاني',
      description: 'صِف المشكلة. نراجع التفاصيل ونوضح النقاط المفتوحة ونرشدك إلى الخطوة العملية التالية.',
      button: 'اطلب الآن'
    }
  }
};

const PAGE_LABELS: Record<Locale, {
  teamLabel: string;
  expertAlt: string;
  trustPills: string[];
  quickServicesTitle: string;
  serviceCardCta: string;
  materialTitle: string;
  materialDescription: string;
  materialBrands: string[];
  deepDiveTitle: string;
  deepDiveDescription: string;
  allServices: string;
  testimonialsTitle: string;
  testimonialsDescription: string;
  testimonials: { name: string; role: string; text: string }[];
  emailPlaceholder: string;
}> = {
  de: {
    teamLabel: 'Service-Team',
    expertAlt: 'PixelRing Service-Team',
    trustPills: ['Keine Vermittlung', 'Eine Anfrage', 'Ausführung durch Fachleute'],
    quickServicesTitle: 'Dienstleistungen für Sie',
    serviceCardCta: 'Mehr erfahren',
    materialTitle: 'Materialien und Systeme, mit denen wir arbeiten',
    materialDescription: 'Wir setzen je nach Aufgabe auf bewährte Folien, LED-Komponenten, Netzteile, PMMA und Aluminiumverbundplatten etablierter Hersteller.',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    deepDiveTitle: 'Servicebereiche für Werbeanlagen',
    deepDiveDescription: 'Unsere spezialisierten Reparatur- und Wartungsleistungen erhalten den Wert und die Sicherheit Ihrer Werbeanlagen.',
    allServices: 'Alle Services',
    testimonialsTitle: 'Rückmeldungen aus Servicefällen',
    testimonialsDescription: 'Anonymisierte Stimmen aus Reparatur-, Wartungs- und Audit-Anfragen.',
    testimonials: [
      { name: 'Filialbetrieb', role: 'Standortnetz Berlin', text: 'PixelRing hat die defekte Leuchtwerbung strukturiert aufgenommen, die Reparatur sauber dokumentiert und den Betrieb schnell wiederhergestellt.' },
      { name: 'Gastronomiegruppe', role: 'Mehrere Standorte', text: 'Für uns zählt Verlässlichkeit. Die Kommunikation war klar, der Termin realistisch und das Ergebnis passte zum Markenauftritt.' },
      { name: 'Medizinisches Zentrum', role: 'Facility Management', text: 'Der Auditbericht war verständlich und half uns, Prioritäten für Wartung und Sicherheit zu setzen.' }
    ],
    emailPlaceholder: 'E-Mail-Adresse'
  },
  en: {
    teamLabel: 'Service Team',
    expertAlt: 'PixelRing service team',
    trustPills: ['No brokerage', 'One request', 'Specialist execution'],
    quickServicesTitle: 'Services for Your Signage Systems',
    serviceCardCta: 'Learn more',
    materialTitle: 'Materials and Systems We Work With',
    materialDescription: 'Depending on the task, we use proven films, LED components, power supplies, PMMA, and aluminium composite panels from established manufacturers.',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    deepDiveTitle: 'Service Areas for Signage Systems',
    deepDiveDescription: 'Explore repair and maintenance categories designed to preserve the value and safety of your signage systems.',
    allServices: 'All Services',
    testimonialsTitle: 'Feedback From Service Cases',
    testimonialsDescription: 'Anonymized feedback from repair, maintenance, and audit requests.',
    testimonials: [
      { name: 'Retail operator', role: 'Berlin location network', text: 'PixelRing documented the issue clearly, repaired the illuminated sign, and helped us restore the storefront quickly.' },
      { name: 'Hospitality group', role: 'Multiple locations', text: 'The team communicated clearly, kept the service window realistic, and delivered a result that matched our brand standards.' },
      { name: 'Medical center', role: 'Facility management', text: 'The audit report was practical and helped us prioritize maintenance and safety work across the site.' }
    ],
    emailPlaceholder: 'Email address'
  },
  ru: {
    teamLabel: 'Service-Team',
    expertAlt: 'Сервисная команда PixelRing',
    trustPills: ['Не посредник', 'Одна заявка', 'Работа специалистов'],
    quickServicesTitle: 'Услуги для ваших рекламных систем',
    serviceCardCta: 'Подробнее',
    materialTitle: 'Материалы и системы, с которыми мы работаем',
    materialDescription: 'В зависимости от задачи мы используем проверенные плёнки, LED-компоненты, блоки питания, PMMA и алюминиевые композитные панели известных производителей.',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    deepDiveTitle: 'Сервисные направления PixelRing',
    deepDiveDescription: 'Ремонт, модернизация и аудит рекламных систем, которые помогают сохранить внешний вид, безопасность и ценность объекта.',
    allServices: 'Все услуги',
    testimonialsTitle: 'Отзывы из сервисных случаев',
    testimonialsDescription: 'Анонимизированные отзывы по заявкам на ремонт, обслуживание и аудит.',
    testimonials: [
      { name: 'Филиальный бизнес', role: 'Розничная сеть, Берлин', text: 'PixelRing быстро разобрался с неисправной световой вывеской, понятно зафиксировал проблему и вернул фасад в рабочее состояние.' },
      { name: 'Гастрономическая группа', role: 'Несколько локаций', text: 'Для нас важны сроки и единый стандарт бренда. Команда заранее согласовала окно работ и аккуратно закрыла задачу без лишней переписки.' },
      { name: 'Медицинский центр', role: 'Facility management', text: 'После аудита мы получили понятный список рисков и приоритетов по обслуживанию вывесок и навигации на объекте.' }
    ],
    emailPlaceholder: 'Ваш e-mail'
  },
  tr: {
    teamLabel: 'Service-Team',
    expertAlt: 'PixelRing servis ekibi',
    trustPills: ['Aracı yok', 'Tek talep', 'Uzman uygulama'],
    quickServicesTitle: 'Reklam Sistemleriniz İçin Hizmetler',
    serviceCardCta: 'Daha fazla bilgi',
    materialTitle: 'Çalıştığımız Malzemeler ve Sistemler',
    materialDescription: 'Göreve bağlı olarak köklü üreticilerin folyo, LED bileşenleri, güç kaynakları, PMMA ve alüminyum kompozit panellerini kullanırız.',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    deepDiveTitle: 'Reklam Sistemleri İçin Servis Alanları',
    deepDiveDescription: 'Tabela sistemlerinizin değerini ve güvenliğini korumaya yönelik onarım ve bakım kategorileri.',
    allServices: 'Tüm Hizmetler',
    testimonialsTitle: 'Servis Vakalarından Geri Bildirimler',
    testimonialsDescription: 'Onarım, bakım ve denetim taleplerinden anonimleştirilmiş geri bildirimler.',
    testimonials: [
      { name: 'Şube işletmesi', role: 'Berlin lokasyon ağı', text: 'PixelRing arızayı net belgeledi, ışıklı tabelayı onardı ve mağaza cephesini hızlıca çalışır hale getirdi.' },
      { name: 'Gastronomi grubu', role: 'Birden fazla lokasyon', text: 'Ekip net iletişim kurdu, servis zamanını gerçekçi planladı ve marka standardımıza uygun sonuç teslim etti.' },
      { name: 'Tıp merkezi', role: 'Tesis yönetimi', text: 'Denetim raporu pratikti ve bakım ile güvenlik önceliklerimizi belirlememize yardımcı oldu.' }
    ],
    emailPlaceholder: 'E-posta adresi'
  },
  pl: {
    teamLabel: 'Service-Team',
    expertAlt: 'Zespół serwisowy PixelRing',
    trustPills: ['Bez pośrednictwa', 'Jedno zgłoszenie', 'Realizacja przez specjalistów'],
    quickServicesTitle: 'Usługi dla Twoich systemów reklamowych',
    serviceCardCta: 'Dowiedz się więcej',
    materialTitle: 'Materiały i systemy, z którymi pracujemy',
    materialDescription: 'W zależności od zadania stosujemy sprawdzone folie, komponenty LED, zasilacze, PMMA i płyty kompozytowe aluminiowe uznanych producentów.',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    deepDiveTitle: 'Obszary serwisowe dla systemów reklamowych',
    deepDiveDescription: 'Kategorie napraw i konserwacji, które pomagają zachować wartość i bezpieczeństwo systemów reklamowych.',
    allServices: 'Wszystkie usługi',
    testimonialsTitle: 'Opinie ze spraw serwisowych',
    testimonialsDescription: 'Anonimowe głosy z napraw, konserwacji i audytów.',
    testimonials: [
      { name: 'Operator oddziału', role: 'Sieć lokalizacji w Berlinie', text: 'PixelRing jasno udokumentował problem, naprawił podświetlany szyld i szybko przywrócił estetykę fasady.' },
      { name: 'Grupa gastronomiczna', role: 'Kilka lokalizacji', text: 'Zespół komunikował się jasno, realistycznie zaplanował termin i dostarczył wynik zgodny ze standardem marki.' },
      { name: 'Centrum medyczne', role: 'Facility management', text: 'Raport z audytu był praktyczny i pomógł ustalić priorytety konserwacji oraz bezpieczeństwa.' }
    ],
    emailPlaceholder: 'Adres e-mail'
  },
  ar: {
    teamLabel: 'فريق الخدمة',
    expertAlt: 'فريق خدمة بكسل رينج',
    trustPills: ['بدون وسيط', 'طلب واحد', 'تنفيذ متخصص'],
    quickServicesTitle: 'خدمات لأنظمة الإعلانات لديك',
    serviceCardCta: 'اعرف المزيد',
    materialTitle: 'المواد والأنظمة التي نعمل معها',
    materialDescription: 'نستخدم حسب المهمة أفلاماً ومكونات LED ومزودات طاقة ومواد PMMA وألواح ألمنيوم مركبة من جهات تصنيع معروفة.',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    deepDiveTitle: 'مجالات الخدمة لأنظمة الإعلانات',
    deepDiveDescription: 'خدمات إصلاح وصيانة تساعد في الحفاظ على قيمة أنظمة الإعلانات وسلامتها.',
    allServices: 'كل الخدمات',
    testimonialsTitle: 'ملاحظات من حالات الخدمة',
    testimonialsDescription: 'آراء مجهولة من طلبات الإصلاح والصيانة والتدقيق.',
    testimonials: [
      { name: 'مشغل فرع', role: 'شبكة مواقع في برلين', text: 'وثق فريق بكسل رينج المشكلة بوضوح، وأصلح اللوحة المضيئة، وساعدنا على إعادة الواجهة إلى حالتها التشغيلية بسرعة.' },
      { name: 'مجموعة ضيافة', role: 'عدة مواقع', text: 'كان التواصل واضحاً، ونافذة الخدمة واقعية، والنتيجة متوافقة مع معايير علامتنا التجارية.' },
      { name: 'مركز طبي', role: 'إدارة المرافق', text: 'كان تقرير التدقيق عملياً وساعدنا على تحديد أولويات الصيانة والسلامة في الموقع.' }
    ],
    emailPlaceholder: 'عنوان البريد الإلكتروني'
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'de') as Locale;
  const tContent = CONTENT[locale] || CONTENT.de;
  return {
    title: tContent.metaTitle,
    description: tContent.metaDescription,
    alternates: {
      canonical: `/${locale}/ueber-uns`,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'de') as Locale;
  const tContent = CONTENT[locale] || CONTENT.de;
  const pageLabels = PAGE_LABELS[locale] || PAGE_LABELS.de;
  const isRtl = locale === 'ar';
  const localePath = `/${locale}`;

  const globalCms = await getGlobalPageCmsContent(locale);

  return (
    <div className={`flex min-h-screen flex-col bg-[#F7F1E8] ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <Header content={globalCms?.header} />

      <main className="flex-grow pt-0">
        {/* HERO SECTION - Strictly Proportioned to Reference Screenshot */}
        <section className="px-6 pt-8 md:pt-12 pb-0">
          <div className="mx-auto max-w-7xl">
            {/* Row 1: Large Title */}
            <div className="mb-8 md:mb-12">
              <h1 className="text-[42px] md:text-[56px] lg:text-[68px] font-black leading-[1.05] text-[#0E1A2B] tracking-tight max-w-4xl">
                {tContent.hero.title}
              </h1>
            </div>

            {/* Row 2: Large Image & Balanced Content Stack */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
              {/* Left: Prominent Image */}
              <div className="lg:col-span-7 relative">
                <div className="relative h-[300px] md:h-[400px] lg:h-[420px] rounded-[48px] overflow-hidden shadow-2xl">
                  <CmsImage
                    src="/images/about/hero_signage_workshop.png"
                    alt={tContent.hero.title}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Authentic Embossed Watermark Stamp */}
                <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 z-10 w-32 h-32 md:w-40 md:h-40 pointer-events-none opacity-95">
                   <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(1px 1px 0px rgba(255,255,255,1)) drop-shadow(-1px -1px 0px rgba(0,0,0,0.45))' }}>
                      {/* Outer Ring */}
                      <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(14,26,43,0.25)" strokeWidth="1.2" />
                      <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(14,26,43,0.25)" strokeWidth="0.8" />
                      
                      {/* Inner Ring */}
                      <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(14,26,43,0.25)" strokeWidth="1.2" />

                      {/* Text */}
                      <path id="embossedTextPath" d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" fill="none" />
                      <text className="text-[8.5px] font-black uppercase" fill="rgba(14,26,43,0.35)">
                        <textPath xlinkHref="#embossedTextPath" startOffset="0%" textLength="210" lengthAdjust="spacing">• PRÜFUNG • REPARATUR • SERVICE </textPath>
                      </text>

                      {/* Center Icon */}
                      <g transform="translate(36, 36) scale(1.15)">
                         <path stroke="rgba(14,26,43,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </g>
                   </svg>
                </div>
              </div>

              {/* Right: Content Stack (Spanning Image Height) */}
              <div className="lg:col-span-5 flex flex-col justify-between py-2">
                <p className="text-[18px] md:text-[20px] text-[#4A5568] leading-relaxed max-w-md">
                  {tContent.hero.intro}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {pageLabels.trustPills.map((pill) => (
                    <span key={pill} className="rounded-full border border-[#B8643E]/20 bg-white/70 px-4 py-2 text-[13px] font-bold text-[#0E1A2B] shadow-sm">
                      {pill}
                    </span>
                  ))}
                </div>
                
                <div className="space-y-8">
                  {/* Avatar Stack */}
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="relative w-12 h-12 rounded-full border-4 border-[#F7F1E8] overflow-hidden bg-gray-200 shadow-sm">
                           <CmsImage
                             src={`/images/about/team/service-team-${i}.png`}
                             alt={pageLabels.expertAlt}
                             fill
                             sizes="48px"
                             className="object-cover"
                           />
                        </div>
                      ))}
                      <div className="w-12 h-12 rounded-full border-4 border-[#F7F1E8] bg-[#0E1A2B] flex items-center justify-center text-white shadow-sm">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                         </svg>
                      </div>
                    </div>
                    <div className="text-[14px] font-bold text-[#0E1A2B]/40 uppercase tracking-widest">
                       {pageLabels.teamLabel}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <LeistungenRequestButton 
                      label={tContent.hero.ctaPrimary} 
                      serviceIntent="about-page"
                      className="bg-[#B8643E] hover:bg-[#A65835] text-white px-7 py-4 text-[16px] font-semibold rounded-full shadow-lg shadow-[#B8643E]/30 transition-all duration-200 active:scale-95" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Directly following the Hero but clearly separated */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 py-12 border-t border-[#0E1A2B]/5">
               {tContent.stats.map((stat, i) => (
                 <div key={i} className="flex flex-col">
                    <div className="text-[48px] lg:text-[64px] font-black text-[#0E1A2B] leading-none mb-2">{stat.value}</div>
                    <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#B8643E]">{stat.label}</div>
                 </div>
               ))}
            </div>
          </div>
        </section>


        {/* QUICK SERVICES SECTION */}
        <section className="px-6 py-24 bg-white">
           <div className="mx-auto max-w-7xl">
              <div className="mb-16">
                 <h2 className="text-[42px] font-black text-[#0E1A2B] mb-4">{pageLabels.quickServicesTitle}</h2>
                 <div className="h-1 w-24 bg-[#B8643E]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {tContent.services.map((service, i) => (
                   <div key={service.id} className={`p-8 rounded-[32px] border transition-all duration-300 hover:shadow-xl ${i === 0 ? 'bg-[#0E1A2B] text-white border-[#0E1A2B]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0E1A2B]'}`}>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 ${i === 0 ? 'bg-[#B8643E]' : 'bg-[#0E1A2B]/5'}`}>
                         <svg className={`w-6 h-6 ${i === 0 ? 'text-white' : 'text-[#B8643E]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                         </svg>
                      </div>
                      <h3 className="text-[20px] font-bold mb-4">{service.title}</h3>
                      <p className={`text-[15px] leading-relaxed mb-6 ${i === 0 ? 'text-white/70' : 'text-[#4A5568]'}`}>{service.description}</p>
                      <a href={`${localePath}/leistungen`} className={`text-[14px] font-bold uppercase tracking-wider underline decoration-2 underline-offset-8 transition-colors ${i === 0 ? 'hover:text-[#B8643E]' : 'hover:text-[#B8643E]'}`}>{pageLabels.serviceCardCta}</a>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* ABOUT SECTION WITH COLLAGE & ACCORDIONS */}
        <section className="px-6 py-24 overflow-hidden">
           <div className="mx-auto max-w-7xl">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                 {/* Collage */}
                 <div className="relative">
                    <div className="relative h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl">
                       <CmsImage src="/images/about/about_collage_1.png" alt="Collage 1" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                    </div>
                    <div className="absolute -bottom-10 -right-10 hidden md:block h-[300px] w-[300px] rounded-[40px] border-[12px] border-[#F7F1E8] overflow-hidden shadow-2xl">
                       <CmsImage src="/images/about/about_collage_2.png" alt="Collage 2" fill sizes="300px" className="object-cover" />
                    </div>
                 </div>
                 
                 {/* Text Content */}
                 <div>
                    <div className="mb-12">
                       <h2 className="text-[42px] font-black text-[#0E1A2B]">{tContent.about.title}</h2>
                    </div>
                    
                    <div className="space-y-2">
                       {tContent.about.accordions.map((item, i) => (
                         <div key={i} className="border-b border-[#0E1A2B]/10 py-6">
                            <details className="group">
                               <summary className="flex cursor-pointer list-none items-center justify-between text-[20px] font-bold text-[#0E1A2B] group-open:text-[#B8643E]">
                                  {item.title}
                                  <span className="transition-transform duration-300 group-open:rotate-180">
                                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                     </svg>
                                  </span>
                               </summary>
                               <div className="mt-6 text-[#4A5568] leading-relaxed">
                                  {item.content}
                               </div>
                            </details>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* LOGO CLOUD - Support Our Company */}
        <section className="px-6 py-24 bg-white border-b border-[#0E1A2B]/5">
           <div className="mx-auto max-w-7xl">
              <div className="text-center mb-16">
                 <h2 className="text-[32px] font-black text-[#0E1A2B]">{pageLabels.materialTitle}</h2>
                 <p className="mx-auto mt-4 max-w-3xl text-[16px] leading-relaxed text-[#4A5568]">{pageLabels.materialDescription}</p>
              </div>
              <div className="relative overflow-hidden border-y border-[#0E1A2B]/5 py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
                 <style>{`
                   @keyframes about-brand-marquee {
                     from { transform: translateX(0); }
                     to { transform: translateX(-50%); }
                   }
                 `}</style>
                 <div className="flex w-max items-center gap-12 whitespace-nowrap motion-safe:animate-[about-brand-marquee_32s_linear_infinite] hover:[animation-play-state:paused]">
                   {[...pageLabels.materialBrands, ...pageLabels.materialBrands].map((brand, i) => (
                     <span
                       key={`${brand}-${i}`}
                       aria-label={brand}
                       className="text-[24px] font-black uppercase tracking-tight text-[#0E1A2B]/35 grayscale transition-colors hover:text-[#0E1A2B]/60"
                     >
                       {brand}
                     </span>
                   ))}
                 </div>
              </div>
           </div>
        </section>

        {/* QUALITY SECTION */}
        <section className="px-6 py-24 bg-white">
           <div className="mx-auto max-w-7xl">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                 <div className="relative group cursor-pointer">
                    <div className="relative h-[450px] w-full rounded-[40px] overflow-hidden shadow-2xl">
                       <CmsImage src="/images/about/quality_video.png" alt="Video preview" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                       <div className="absolute inset-0 bg-[#0E1A2B]/20 transition-colors group-hover:bg-[#0E1A2B]/10" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-[#B8643E] flex items-center justify-center text-white shadow-2xl transform transition-transform group-hover:scale-110">
                             <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                             </svg>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div>
                    <h2 className="text-[42px] font-black text-[#0E1A2B] leading-tight mb-8">
                       {tContent.quality.title}
                    </h2>
                    <p className="text-[18px] text-[#4A5568] leading-relaxed mb-10">
                       {tContent.quality.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 mb-12">
                       {tContent.quality.features.map((feature, i) => (
                         <div key={i} className="flex items-center gap-4">
                            <div className="shrink-0 w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center">
                               <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                               </svg>
                            </div>
                            <span className="font-bold text-[#0E1A2B] text-[15px]">{feature}</span>
                         </div>
                       ))}
                    </div>
                    <a href={`${localePath}/referenzen`} className="inline-flex rounded-full bg-[#FFB347] px-10 py-4 text-[#0E1A2B] font-bold hover:bg-[#FFA327] transition-colors">
                       {tContent.quality.cta}
                    </a>
                 </div>
              </div>
           </div>
        </section>

        {/* FEATURED SERVICES SECTION (Style matched to Construction Projects) */}
        <section className="px-6 py-24 bg-[#F8FAFC]">
           <div className="mx-auto max-w-7xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                 <div>
                    <h2 className="text-[42px] font-black text-[#0E1A2B] mb-4">{pageLabels.deepDiveTitle}</h2>
                    <p className="text-[#4A5568] max-w-2xl">{pageLabels.deepDiveDescription}</p>
                 </div>
                 <a href={`${localePath}/leistungen`} className="rounded-full bg-[#FFB347] px-8 py-3 text-[#0E1A2B] font-bold text-[14px]">
                    {pageLabels.allServices}
                 </a>
              </div>

              <div className="space-y-16">
                 {tContent.deepDive.map((item, i) => (
                   <div key={item.id} className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-[#E2E8F0] overflow-hidden">
                      <div className={`flex flex-col lg:flex-row gap-12 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                         {/* Text Content Side */}
                         <div className="lg:w-1/2">
                            <h3 className="text-[32px] font-black text-[#0E1A2B] mb-4">{item.title}</h3>
                            <p className="text-[16px] text-[#4A5568] leading-relaxed mb-10">{item.description}</p>
                            
                            <div className="space-y-4 mb-10">
                               {item.specs.map((spec, j) => (
                                 <div key={j} className="flex border-b border-gray-100 pb-3 last:border-0">
                                    <span className="w-1/3 text-[14px] font-bold text-[#4A5568]">{spec.label}:</span>
                                    <span className="w-2/3 text-[14px] text-[#0E1A2B] font-medium">{spec.value}</span>
                                 </div>
                               ))}
                            </div>
                            
                            <a href={`${localePath}/leistungen`} className="inline-flex rounded-full bg-[#48BB78] px-8 py-3 text-white font-bold text-[14px] hover:bg-[#38A169] transition-colors">
                               {item.cta}
                            </a>
                         </div>

                         {/* Image Side */}
                         <div className="lg:w-1/2 w-full">
                            <div className="relative h-[350px] md:h-[450px] rounded-[32px] overflow-hidden shadow-xl">
                               <CmsImage src={`/images/about/service_deep_${i+1}.png`} alt={item.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* TESTIMONIALS SECTION (Why Say Our Customers) */}
        <section className="px-6 py-24 bg-white">
           <div className="mx-auto max-w-7xl">
              <div className="text-center mb-20">
                 <h2 className="text-[42px] font-black text-[#0E1A2B] mb-4">{pageLabels.testimonialsTitle}</h2>
                 <p className="text-[#4A5568] max-w-2xl mx-auto">{pageLabels.testimonialsDescription}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {pageLabels.testimonials.map((testimonial, i) => (
                   <div key={i} className="bg-[#F8FAFC] rounded-[32px] p-8 border border-[#E2E8F0]">
                      <div className="flex items-center gap-4 mb-6">
                         <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                            <div className="flex h-full w-full items-center justify-center bg-[#0E1A2B] text-[13px] font-black uppercase text-white">
                              {testimonial.name.slice(0, 2)}
                            </div>
                         </div>
                         <div>
                            <div className="font-bold text-[#0E1A2B]">{testimonial.name}</div>
                            <div className="text-[12px] text-[#4A5568]">{testimonial.role}</div>
                         </div>
                         <div className="ml-auto flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <svg key={star} className="w-3 h-3 text-[#FFB347]" fill="currentColor" viewBox="0 0 20 20">
                                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                         </div>
                      </div>
                      <p className="text-[15px] text-[#4A5568] leading-relaxed italic">&ldquo;{testimonial.text}&rdquo;</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 py-24 sm:py-32">
           <div className="mx-auto max-w-7xl">
              <div className="relative bg-[#0E1A2B] rounded-[60px] p-12 md:p-24 overflow-hidden text-center">
                 {/* Decorative elements */}
                 <div className="absolute top-0 right-0 h-64 w-64 bg-[#B8643E]/10 blur-[100px]" />
                 <div className="absolute bottom-0 left-0 h-64 w-64 bg-blue-500/10 blur-[100px]" />
                 
                 <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-[42px] md:text-[56px] font-black text-white leading-[1.1] mb-8">
                       {tContent.final.title}
                    </h2>
                    <p className="text-[18px] md:text-[20px] text-white/70 leading-relaxed mb-12">
                       {tContent.final.description}
                    </p>
                    
                    <div className="flex justify-center">
                       <LeistungenRequestButton
                         label={tContent.final.button}
                         serviceIntent="about-page-final"
                         className="min-h-16 bg-[#B8643E] px-10 py-4 text-[16px] font-bold text-white hover:bg-[#9E5332]"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer content={globalCms?.footer} />
    </div>
  );
}
