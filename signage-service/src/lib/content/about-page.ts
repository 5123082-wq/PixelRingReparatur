export type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

export type AboutContent = {
  metaTitle: string;
  metaDescription: string;
  hero: {
    badge: string;
    titlePrefix: string;
    titleAccent: string;
    intro: string[];
    benefits: { title: string; description: string }[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
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
    mediaLabel: string;
    playLabel: string;
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
    button: string;
  };
};

export const ABOUT_CONTENT: Record<Locale, AboutContent> = {
  de: {
    metaTitle: 'Über uns | Servicepartner für Werbeanlagen | PixelRing',
    metaDescription: 'PixelRing begleitet Reparatur, Wartung, Modernisierung und Prüfung von Werbeanlagen mit einem klaren Ansprechpartner.',
    hero: {
      badge: 'Über PixelRing SERVICE',
      titlePrefix: 'PixelRing: Service für Werbeanlagen, die sichtbar bleiben sollen',
      titleAccent: '',
      intro: [
        'Wir helfen Unternehmen dabei, Werbeanlagen, Leuchtreklamen und sichtbare Markenelemente zuverlässig in Betrieb zu halten.',
        'Wenn eine Anlage ausfällt, beschädigt ist oder nicht mehr zum Markenauftritt passt, klären wir zuerst, was sinnvoll ist: reparieren, modernisieren oder ersetzen.'
      ],
      benefits: [
        { title: 'Ein Ansprechpartner', description: 'Ihre Anfrage, die Abstimmung und die nächsten Schritte laufen an einer Stelle zusammen.' },
        { title: 'Erst prüfen, dann handeln', description: 'Wir schauen, was wirklich nötig ist, bevor Teile ersetzt oder größere Arbeiten geplant werden.' },
        { title: 'Nachvollziehbarer Verlauf', description: 'Wichtige Informationen zum Standort und zur Anlage bleiben für spätere Servicefälle greifbar.' }
      ],
      ctaPrimary: 'Werbeanlage prüfen lassen',
      ctaSecondary: 'Rückruf anfordern'
    },
    services: [
      { id: 'restaurants', title: 'Gastronomie und Hotels', description: 'Für Cafés, Restaurants, Bars und Hotels. Wir kümmern uns um Leuchtwerbung, Menükästen und Eingangsbereiche, wenn etwas nicht mehr passt.' },
      { id: 'retail', title: 'Einzelhandel und Salons', description: 'Für Läden, Filialen, Supermärkte und Salons. Sichtbare Fassaden, lesbare Schilder und funktionierende Beleuchtung bleiben im Blick.' },
      { id: 'clinics', title: 'Praxen und Apotheken', description: 'Für Arztpraxen, medizinische Zentren und Apotheken. Beschilderung und Licht müssen zuverlässig, klar und gepflegt wirken.' },
      { id: 'offices', title: 'Büros und Autohäuser', description: 'Für Kanzleien, Büros, Showrooms und Autohäuser. Wir betreuen Außenauftritt, Orientierung und Servicearbeiten am Objekt.' }
    ],
    about: {
      title: 'So arbeitet PixelRing',
      cta: 'Mehr erfahren',
      accordions: [
        { title: 'Warum PixelRing SERVICE entstanden ist', content: 'Wenn eine Werbeanlage ausfällt, ist oft unklar, wer zuständig ist: Werbetechnik, Elektrik, Montage, Druckerei oder Hersteller. PixelRing SERVICE nimmt diese Anfrage auf und bringt Ordnung in die nächsten Schritte.' },
        { title: 'Ein Ansprechpartner mit klarer Begleitung', content: 'PixelRing SERVICE ist keine anonyme Vermittlungsplattform. Wir klären die Aufgabe, sammeln die wichtigen Informationen und halten die Kommunikation an einer Stelle zusammen.' },
        { title: 'Ein fester Serviceablauf', content: 'Jeder Fall wird nachvollziehbar bearbeitet: Was wurde gemeldet, was ist geprüft, welche Maßnahme ist sinnvoll und was sollte als Nächstes passieren. So bleibt das Ergebnis auch später verständlich.' },
        { title: 'Wenn es mehrere Standorte gibt', content: 'Bei mehreren Standorten hilft ein einheitlicher Ablauf. Die Informationen werden ähnlich aufgenommen, die Dokumentation bleibt vergleichbar und dringende Themen lassen sich besser einordnen.' },
        { title: 'Die passenden Fachleute koordiniert', content: 'Werbeanlagen verbinden Lichttechnik, Konstruktion, Folien, Druck und Montage. PixelRing SERVICE koordiniert je nach Aufgabe die passenden Fachleute, damit der Kunde nicht alles parallel steuern muss.' }
      ]
    },
    quality: {
      title: 'PixelRing in Arbeit',
      description: 'Diagnose, Licht, Befestigung, Montage. Ausschnitte aus dem Servicealltag.',
      features: ['Diagnose', 'Licht', 'Montage'],
      mediaLabel: 'Video',
      playLabel: 'Video starten',
      cta: 'Referenzen ansehen'
    },
    deepDive: [
      {
        id: 'dd1',
        title: 'Reparatur & Wartung von Außenwerbung',
        description: 'Reparatur und Wartung von Werbeanlagen, Leuchtwerbung und Außenwerbung. Ziel ist eine passende Maßnahme statt unnötigem Austausch.',
        specs: [{ label: 'Ablauf', value: 'Prüfung zuerst' }, { label: 'Material', value: 'Passend zum Objekt' }, { label: 'Service', value: 'Koordiniert' }],
        cta: 'Details ansehen'
      },
      {
        id: 'dd2',
        title: 'Modernisierung von Lichtwerbung & LED-Systemen',
        description: 'Modernisierung alter Leuchtschriften und LED-Systeme, wenn Reparatur allein nicht mehr sinnvoll ist.',
        specs: [{ label: 'Ziel', value: 'Weniger Ausfälle' }, { label: 'Planung', value: 'Nach Befund' }, { label: 'Technik', value: 'Objektbezogen' }],
        cta: 'Jetzt umrüsten'
      },
      {
        id: 'dd3',
        title: 'Inspektion & Audit von Werbeanlagen',
        description: 'Sichtprüfung, technische Einschätzung und Dokumentation von Zustand, Befestigung und elektrischen Auffälligkeiten.',
        specs: [{ label: 'Ergebnis', value: 'Dokumentiert' }, { label: 'Priorität', value: 'Nach Risiko' }, { label: 'Nächster Schritt', value: 'Klar benannt' }],
        cta: 'Audit buchen'
      }
    ],
    final: {
      title: 'Werbeanlage reparieren oder prüfen lassen?',
      button: 'Service starten'
    }
  },
  en: {
    metaTitle: 'About us | Signage service partner | PixelRing',
    metaDescription: 'PixelRing helps companies handle signage repair, maintenance, modernization, and checks through one clear service contact.',
    hero: {
      badge: 'About PixelRing SERVICE',
      titlePrefix: 'PixelRing: service for signs that need to stay visible',
      titleAccent: '',
      intro: [
        'We help businesses keep signs, illuminated advertising, and visible brand elements working and looking right.',
        'When a sign stops lighting, gets damaged, or no longer fits the brand, we first clarify what makes sense: repair, modernization, or replacement.'
      ],
      benefits: [
        { title: 'One service contact', description: 'Your request, coordination, and next steps stay in one place.' },
        { title: 'Check first', description: 'We look at what is actually needed before planning replacement or larger work.' },
        { title: 'Useful history', description: 'Important details about the location and system stay available for future service.' }
      ],
      ctaPrimary: 'Have your sign checked',
      ctaSecondary: 'Request a callback'
    },
    services: [
      { id: 'restaurants', title: 'Restaurants and hotels', description: 'For cafés, restaurants, bars, and hotels. We help with illuminated signs, menu displays, and entrance areas when something stops working or looks worn.' },
      { id: 'retail', title: 'Retail and salons', description: 'For stores, supermarkets, chains, and salons. Storefront signs, window lighting, and visible brand elements need to stay clear and reliable.' },
      { id: 'clinics', title: 'Practices and pharmacies', description: 'For medical practices, clinics, and pharmacies. Clear signage and dependable lighting help visitors find the right place.' },
      { id: 'offices', title: 'Offices and dealerships', description: 'For offices, law firms, showrooms, and car dealerships. We support exterior branding, wayfinding, and on-site service work.' }
    ],
    about: {
      title: 'How PixelRing works',
      cta: 'Learn more',
      accordions: [
        { title: 'Why PixelRing SERVICE exists', content: 'When a sign fails, it is not always clear who should handle it: signage company, electrician, installer, printer, or manufacturer. PixelRing SERVICE takes the request and turns it into a clear next step.' },
        { title: 'One contact with clear guidance', content: 'PixelRing SERVICE is not an anonymous marketplace. We clarify the task, collect the important details, and keep communication in one place.' },
        { title: 'A fixed service flow', content: 'Each case follows a clear path: what was reported, what was checked, what action makes sense, and what should happen next. That keeps the result understandable later.' },
        { title: 'When there is more than one location', content: 'For companies with several locations, a consistent process helps. Information is collected in a similar way, documentation stays comparable, and urgent topics are easier to prioritize.' },
        { title: 'The right specialists coordinated', content: 'Signs combine lighting, structures, films, print, and installation. PixelRing SERVICE coordinates the right people for the task so the client does not have to manage several contacts at once.' }
      ]
    },
    quality: {
      title: 'PixelRing at work',
      description: 'Diagnostics, light, fixing points, installation. Short moments from the service process.',
      features: ['Diagnostics', 'Light', 'Installation'],
      mediaLabel: 'Video',
      playLabel: 'Play video',
      cta: 'View references'
    },
    deepDive: [
      {
        id: 'dd1',
        title: 'Outdoor Advertising Repair & Maintenance',
        description: 'Repair and maintenance for signage, illuminated advertising, and outdoor brand elements. The goal is the right measure, not unnecessary replacement.',
        specs: [{ label: 'Flow', value: 'Check first' }, { label: 'Material', value: 'Site-specific' }, { label: 'Service', value: 'Coordinated' }],
        cta: 'View Details'
      },
      {
        id: 'dd2',
        title: 'Modernization of Illuminated Signs & LED Systems',
        description: 'Modernization of older illuminated signs and LED systems when simple repair is no longer the best option.',
        specs: [{ label: 'Goal', value: 'Fewer failures' }, { label: 'Planning', value: 'Based on findings' }, { label: 'Tech', value: 'Project-specific' }],
        cta: 'Retrofit Now'
      },
      {
        id: 'dd3',
        title: 'Inspection & Audit of Signage Systems',
        description: 'Visual checks, technical assessment, and documentation of condition, fixings, and visible electrical issues.',
        specs: [{ label: 'Result', value: 'Documented' }, { label: 'Priority', value: 'Risk-based' }, { label: 'Next step', value: 'Clearly named' }],
        cta: 'Book Audit'
      }
    ],
    final: {
      title: 'Need signage repair or inspection?',
      button: 'Start service'
    }
  },
  ru: {
    metaTitle: 'О нас – сервисный партнёр для рекламных систем | PixelRing',
    metaDescription: 'PixelRing — один ответственный сервисный партнёр для ремонта, обслуживания, модернизации и аудита рекламных систем.',
    hero: {
      badge: 'О PixelRing SERVICE',
      titlePrefix: 'PixelRing: сервис, который продлевает жизнь вашему бренду',
      titleAccent: '',
      intro: [
        'Мы помогаем компаниям поддерживать рекламные конструкции, вывески и элементы визуального оформления в идеальном и рабочем состоянии.',
        'Если оборудование перестало светиться, получило повреждения или больше не соответствует высоким стандартам вашего бренда, мы подберем оптимальное решение: от точечного ремонта и модернизации до полной замены конструкции.'
      ],
      benefits: [
        { title: 'Один подрядчик', description: 'Берем на себя всю координацию: от вашей первой заявки до финального монтажа.' },
        { title: 'Понятный процесс', description: 'Мы чиним то, что можно починить, и меняем только то, что нужно заменить.' },
        { title: 'Сервис и история', description: 'Сохраняем историю обслуживания каждой локации, чтобы управлять брендингом было легко.' }
      ],
      ctaPrimary: 'Проверить рекламную установку',
      ctaSecondary: 'Заказать звонок'
    },
    services: [
      { id: 'restaurants', title: 'Гастрономия и Отели', description: 'Для кафе, ресторанов, баров и отелей. Поддерживаем в идеальном состоянии световые меню, вывески и входные группы.' },
      { id: 'retail', title: 'Ритейл и Салоны красоты', description: 'Для магазинов, супермаркетов, торговых сетей и салонов красоты. Яркие витрины и исправное освещение для привлечения покупателей.' },
      { id: 'clinics', title: 'Клиники и Аптеки', description: 'Для медицинских центров, стоматологий и аптек. Четкая навигация и надежное дежурное освещение для пациентов.' },
      { id: 'offices', title: 'Офисы и Автосалоны', description: 'Для бизнес-центров, офисов компаний, адвокатских бюро и автодилеров. Представительский брендинг и точное обслуживание на объекте.' }
    ],
    about: {
      title: 'Как работает PixelRing',
      cta: 'Узнать больше',
      accordions: [
        { title: 'Почему появился PixelRing SERVICE', content: 'PixelRing появился в 2023 году из конкретного наблюдения: найти надёжного исполнителя для ремонта вывески или световой рекламы в Германии сложнее, чем кажется. Одни берутся только за монтаж, другие занимаются только электрикой, третьи не выезжают в другой район. Мы решили закрыть эту нишу: один сервисный партнёр, который берёт задачу целиком, от диагностики до монтажа.' },
        { title: 'Один контакт — понятное сопровождение', content: 'PixelRing SERVICE — не анонимная платформа и не биржа мастеров. Мы уточняем задачу, собираем важные детали, проверяем ситуацию на объекте или по материалам и держим коммуникацию в одной точке.' },
        { title: 'Внутренний сервисный стандарт', content: 'Каждый случай ведётся по понятному алгоритму: что было заявлено, что проверено, какая мера выглядит разумной и какой следующий шаг рекомендуется. Так появляется документация, полезная для ремонта, модернизации или дальнейшего обслуживания.' },
        { title: 'Когда объектов больше одного', content: 'Для бизнеса с несколькими точками помогает единый порядок: одинаковый сбор информации, сопоставимая документация и понятная приоритизация. В зависимости от задачи PixelRing SERVICE может фиксировать историю по отдельным локациям и упрощать будущие решения.' },
        { title: 'Координация подходящих специалистов', content: 'Рекламные конструкции объединяют светотехнику, конструкции, плёнки, печать и монтаж. PixelRing SERVICE координирует подходящих специалистов под конкретную задачу, чтобы клиенту не приходилось параллельно управлять несколькими контактами.' }
      ]
    },
    quality: {
      title: 'PixelRing в работе',
      description: 'Диагностика, свет, крепления, монтаж. То, что обычно остаётся за кадром.',
      features: ['Диагностика', 'Свет', 'Монтаж'],
      mediaLabel: 'Видео',
      playLabel: 'Запустить видео',
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
      title: 'Нужен ремонт или диагностика?',
      button: 'Запустить сервис'
    }
  },
  tr: {
    metaTitle: 'Hakkımızda | Tabela ve reklam sistemleri servisi | PixelRing',
    metaDescription: 'PixelRing, tabela ve reklam sistemlerinin onarım, bakım, modernizasyon ve kontrol süreçlerini tek bir iletişim noktasıyla yönetir.',
    hero: {
      badge: 'PixelRing SERVICE hakkında',
      titlePrefix: 'PixelRing: tabelalarınız görünür kalınca marka da görünür kalır',
      titleAccent: '',
      intro: [
        'İşletmelerin tabelalarını, ışıklı reklamlarını ve görünür marka öğelerini çalışır ve düzenli durumda tutmasına yardımcı oluyoruz.',
        'Bir tabela yanmadığında, hasar gördüğünde veya artık markaya yakışmadığında önce neyin mantıklı olduğunu netleştiririz: onarım, modernizasyon veya değişim.'
      ],
      benefits: [
        { title: 'Tek muhatap', description: 'Talebiniz, koordinasyon ve sonraki adımlar tek noktadan ilerler.' },
        { title: 'Önce kontrol', description: 'Değişim veya büyük iş planlamadan önce gerçekten ne gerektiğine bakarız.' },
        { title: 'Takip edilebilir geçmiş', description: 'Konum ve sistemle ilgili önemli bilgiler sonraki servis işleri için elde kalır.' }
      ],
      ctaPrimary: 'Tabelanızı kontrol ettirin',
      ctaSecondary: 'Geri arama iste'
    },
    services: [
      { id: 'restaurants', title: 'Restoranlar ve oteller', description: 'Kafe, restoran, bar ve oteller için. Işıklı tabela, menü panosu ve giriş alanlarında sorun olduğunda süreci toparlarız.' },
      { id: 'retail', title: 'Mağazalar ve salonlar', description: 'Mağazalar, marketler, zincir işletmeler ve güzellik salonları için. Vitrin, tabela ve aydınlatmanın net görünmesi gerekir.' },
      { id: 'clinics', title: 'Muayenehaneler ve eczaneler', description: 'Tıp merkezleri, muayenehaneler ve eczaneler için. Yönlendirme ve ışık müşterinin yeri kolay bulmasına yardım eder.' },
      { id: 'offices', title: 'Ofisler ve galeriler', description: 'Ofisler, hukuk büroları, showroomlar ve otomobil galerileri için. Dış görünüm, yönlendirme ve yerinde servis işlerini destekleriz.' }
    ],
    about: {
      title: 'PixelRing nasıl çalışır?',
      cta: 'Daha fazla bilgi',
      accordions: [
        { title: 'PixelRing SERVICE neden var?', content: 'Bir tabela arızalandığında kimin bakacağı her zaman belli değildir: reklamcı, elektrikçi, montaj ekibi, matbaa veya üretici. PixelRing SERVICE talebi alır ve sonraki adımı anlaşılır hale getirir.' },
        { title: 'Tek muhatap, net takip', content: 'PixelRing SERVICE anonim bir pazar yeri değildir. İşi netleştirir, önemli bilgileri toplar ve iletişimi tek noktada tutar.' },
        { title: 'Sabit bir servis akışı', content: 'Her işte aynı temel sorular cevaplanır: Ne bildirildi, ne kontrol edildi, hangi işlem mantıklı ve sonraki adım ne olmalı. Böylece sonuç daha sonra da anlaşılır kalır.' },
        { title: 'Birden fazla konum varsa', content: 'Birden fazla şubesi olan işletmeler için tutarlı süreç önemlidir. Bilgiler benzer şekilde alınır, dokümantasyon karşılaştırılabilir olur ve acil konular daha kolay sıralanır.' },
        { title: 'Doğru uzmanların koordinasyonu', content: 'Tabelalar ışık, konstrüksiyon, folyo, baskı ve montaj işlerini bir araya getirir. PixelRing SERVICE, göreve uygun kişileri koordine eder; müşteri aynı anda birkaç tarafı yönetmek zorunda kalmaz.' }
      ]
    },
    quality: {
      title: 'PixelRing iş başında',
      description: 'Teşhis, ışık, bağlantılar, montaj. Servis sürecinden kısa anlar.',
      features: ['Teşhis', 'Işık', 'Montaj'],
      mediaLabel: 'Video',
      playLabel: 'Videoyu başlat',
      cta: 'Referansları gör'
    },
    deepDive: [
      {
        id: 'dd1',
        title: 'Dış Mekan Reklamlarının Onarımı ve Bakımı',
        description: 'Tabela, ışıklı reklam ve dış mekan reklam öğeleri için onarım ve bakım. Gereksiz değişim yerine doğru müdahaleyi hedefleriz.',
        specs: [{ label: 'Akış', value: 'Önce kontrol' }, { label: 'Malzeme', value: 'İşe uygun' }, { label: 'Servis', value: 'Koordineli' }],
        cta: 'Detayları gör'
      },
      {
        id: 'dd2',
        title: 'Işıklı Reklam ve LED Sistemlerinin Modernizasyonu',
        description: 'Basit onarım yeterli olmadığında eski ışıklı tabelalar ve LED sistemleri için modernizasyon planlarız.',
        specs: [{ label: 'Hedef', value: 'Daha az arıza' }, { label: 'Planlama', value: 'Tespitten sonra' }, { label: 'Teknoloji', value: 'Projeye göre' }],
        cta: 'Modernizasyon iste'
      },
      {
        id: 'dd3',
        title: 'Reklam Sistemleri İçin İnceleme ve Denetim',
        description: 'Sistemin durumu, bağlantıları ve görünür elektriksel sorunları için kontrol ve anlaşılır dokümantasyon.',
        specs: [{ label: 'Sonuç', value: 'Belgelenir' }, { label: 'Öncelik', value: 'Riske göre' }, { label: 'Sonraki adım', value: 'Netleşir' }],
        cta: 'Kontrol iste'
      }
    ],
    final: {
      title: 'Tabela onarımı veya kontrolü mü gerekiyor?',
      button: 'Servisi başlat'
    }
  },
  pl: {
    metaTitle: 'O nas | Serwis szyldów i systemów reklamowych | PixelRing',
    metaDescription: 'PixelRing pomaga firmom prowadzić naprawy, konserwację, modernizację i kontrolę szyldów przez jeden jasny punkt kontaktu.',
    hero: {
      badge: 'O PixelRing SERVICE',
      titlePrefix: 'PixelRing: serwis dla szyldów, które mają pozostać widoczne',
      titleAccent: '',
      intro: [
        'Pomagamy firmom utrzymać szyldy, reklamy świetlne i widoczne elementy marki w dobrym stanie technicznym i wizualnym.',
        'Gdy szyld przestaje świecić, zostaje uszkodzony albo nie pasuje już do wizerunku marki, najpierw ustalamy, co ma sens: naprawa, modernizacja czy wymiana.'
      ],
      benefits: [
        { title: 'Jeden kontakt', description: 'Zgłoszenie, koordynacja i kolejne kroki pozostają w jednym miejscu.' },
        { title: 'Najpierw sprawdzenie', description: 'Zanim planujemy wymianę lub większe prace, ustalamy, co naprawdę jest potrzebne.' },
        { title: 'Czytelna historia', description: 'Ważne informacje o lokalizacji i instalacji zostają dostępne przy kolejnych pracach serwisowych.' }
      ],
      ctaPrimary: 'Zleć sprawdzenie reklamy',
      ctaSecondary: 'Poproś o telefon'
    },
    services: [
      { id: 'restaurants', title: 'Restauracje i hotele', description: 'Dla kawiarni, restauracji, barów i hoteli. Pomagamy przy szyldach świetlnych, tablicach menu i strefach wejściowych, gdy coś nie działa albo wygląda słabo.' },
      { id: 'retail', title: 'Sklepy i salony', description: 'Dla sklepów, supermarketów, sieci handlowych i salonów. Szyld, witryna i światło powinny być czytelne i zadbane.' },
      { id: 'clinics', title: 'Gabinety i apteki', description: 'Dla gabinetów, centrów medycznych i aptek. Oznakowanie i światło pomagają klientom szybko znaleźć właściwe miejsce.' },
      { id: 'offices', title: 'Biura i salony samochodowe', description: 'Dla biur, kancelarii, showroomów i salonów samochodowych. Wspieramy wygląd zewnętrzny, oznakowanie i prace serwisowe na miejscu.' }
    ],
    about: {
      title: 'Jak pracuje PixelRing',
      cta: 'Dowiedz się więcej',
      accordions: [
        { title: 'Po co powstał PixelRing SERVICE', content: 'Gdy szyld przestaje działać, nie zawsze wiadomo, do kogo się zwrócić: firmy reklamowej, elektryka, montażysty, drukarni czy producenta. PixelRing SERVICE przyjmuje zgłoszenie i porządkuje następny krok.' },
        { title: 'Jeden kontakt i jasne prowadzenie', content: 'PixelRing SERVICE nie jest anonimową platformą ani giełdą zleceń. Wyjaśniamy zadanie, zbieramy ważne informacje i utrzymujemy komunikację w jednym miejscu.' },
        { title: 'Stały przebieg serwisu', content: 'W każdej sprawie trzeba odpowiedzieć na proste pytania: co zgłoszono, co sprawdzono, jakie działanie ma sens i co powinno wydarzyć się dalej. Dzięki temu wynik pozostaje zrozumiały także później.' },
        { title: 'Gdy jest więcej niż jedna lokalizacja', content: 'Przy kilku lokalizacjach pomaga spójny proces. Informacje zbiera się podobnie, dokumentację łatwiej porównać, a pilne tematy można szybciej ustawić w kolejności.' },
        { title: 'Koordynacja właściwych specjalistów', content: 'Szyldy łączą światło, konstrukcję, folie, druk i montaż. PixelRing SERVICE koordynuje właściwe osoby do danego zadania, aby klient nie musiał prowadzić kilku rozmów naraz.' }
      ]
    },
    quality: {
      title: 'PixelRing w pracy',
      description: 'Diagnostyka, światło, mocowania, montaż. Krótkie momenty z procesu serwisowego.',
      features: ['Diagnostyka', 'Światło', 'Montaż'],
      mediaLabel: 'Wideo',
      playLabel: 'Odtwórz wideo',
      cta: 'Zobacz referencje'
    },
    deepDive: [
      {
        id: 'dd1',
        title: 'Naprawa i konserwacja reklamy zewnętrznej',
        description: 'Naprawa i konserwacja szyldów, reklamy świetlnej i zewnętrznych elementów marki. Chodzi o właściwe działanie, nie o niepotrzebną wymianę.',
        specs: [{ label: 'Przebieg', value: 'Najpierw kontrola' }, { label: 'Materiały', value: 'Dobór do obiektu' }, { label: 'Serwis', value: 'Koordynowany' }],
        cta: 'Zobacz szczegóły'
      },
      {
        id: 'dd2',
        title: 'Modernizacja reklamy świetlnej i systemów LED',
        description: 'Modernizacja starszych szyldów świetlnych i systemów LED, gdy sama naprawa nie jest już najlepszym rozwiązaniem.',
        specs: [{ label: 'Cel', value: 'Mniej awarii' }, { label: 'Plan', value: 'Po ocenie' }, { label: 'Technika', value: 'Dobór do projektu' }],
        cta: 'Zapytaj o modernizację'
      },
      {
        id: 'dd3',
        title: 'Inspekcja i audyt systemów reklamowych',
        description: 'Kontrola stanu instalacji, mocowań i widocznych problemów elektrycznych wraz z czytelną dokumentacją.',
        specs: [{ label: 'Wynik', value: 'Udokumentowany' }, { label: 'Priorytet', value: 'Według ryzyka' }, { label: 'Następny krok', value: 'Jasno opisany' }],
        cta: 'Poproś o kontrolę'
      }
    ],
    final: {
      title: 'Potrzebna naprawa albo kontrola reklamy?',
      button: 'Rozpocznij serwis'
    }
  },
  ar: {
    metaTitle: 'من نحن | خدمة اللوحات وأنظمة الإعلانات | بكسل رينج',
    metaDescription: 'تساعد بكسل رينج الشركات في إصلاح وصيانة وتحديث وفحص اللوحات الإعلانية من خلال نقطة تواصل واضحة.',
    hero: {
      badge: 'حول PixelRing SERVICE',
      titlePrefix: 'بكسل رينج: خدمة تساعد لوحاتكم على البقاء واضحة ومرئية',
      titleAccent: '',
      intro: [
        'نساعد الشركات في الحفاظ على اللوحات المضيئة واللافتات والعناصر البصرية للعلامة التجارية بحالة جيدة وواضحة.',
        'عندما تتوقف لوحة عن الإضاءة، أو تتعرض للتلف، أو لا تعود مناسبة لصورة العلامة، نحدد أولاً ما هو الأنسب: إصلاح، تحديث، أو استبدال.'
      ],
      benefits: [
        { title: 'جهة تواصل واحدة', description: 'يبقى الطلب والتنسيق والخطوات التالية في مكان واحد.' },
        { title: 'الفحص أولاً', description: 'نراجع ما هو مطلوب فعلاً قبل التخطيط للاستبدال أو الأعمال الأكبر.' },
        { title: 'سجل واضح', description: 'تبقى المعلومات المهمة عن الموقع واللوحة متاحة لأعمال الخدمة اللاحقة.' }
      ],
      ctaPrimary: 'اطلب فحص اللافتة',
      ctaSecondary: 'اطلب معاودة الاتصال'
    },
    services: [
      { id: 'restaurants', title: 'المطاعم والفنادق', description: 'للمقاهي والمطاعم والفنادق. نساعد عند تعطل اللوحات المضيئة أو لوحات القوائم أو عندما تبدو منطقة الدخول بحاجة إلى عناية.' },
      { id: 'retail', title: 'المتاجر والصالونات', description: 'للمتاجر والسوبرماركت والسلاسل التجارية وصالونات التجميل. الواجهة واللوحة والإضاءة يجب أن تبقى واضحة ومرتبة.' },
      { id: 'clinics', title: 'العيادات والصيدليات', description: 'للعيادات والمراكز الطبية والصيدليات. تساعد اللوحات الواضحة والإضاءة الجيدة الزوار على الوصول بسهولة.' },
      { id: 'offices', title: 'المكاتب ومعارض السيارات', description: 'للمكاتب وشركات الخدمات والمعارض. ندعم الواجهة الخارجية والإرشاد وأعمال الخدمة في الموقع.' }
    ],
    about: {
      title: 'كيف يعمل بكسل رينج',
      cta: 'اعرف المزيد',
      accordions: [
        { title: 'لماذا توجد PixelRing SERVICE؟', content: 'عندما تتعطل لوحة إعلانية، لا يكون من الواضح دائماً من يجب أن يتولى الأمر: شركة لوحات، كهربائي، فريق تركيب، مطبعة أو الشركة المصنعة. تأخذ PixelRing SERVICE الطلب وتحوّله إلى خطوة تالية واضحة.' },
        { title: 'جهة تواصل واحدة ومتابعة واضحة', content: 'PixelRing SERVICE ليست منصة مجهولة ولا سوقاً للحرفيين. نوضح المهمة، نجمع المعلومات المهمة، ونحافظ على التواصل في مكان واحد.' },
        { title: 'مسار خدمة ثابت', content: 'في كل حالة نجيب عن الأسئلة الأساسية: ما الذي تم الإبلاغ عنه، ما الذي تم فحصه، ما الإجراء المناسب، وما الخطوة التالية. بهذه الطريقة يبقى القرار مفهوماً لاحقاً.' },
        { title: 'عندما يكون لديكم أكثر من موقع', content: 'للشركات التي لديها عدة مواقع، يساعد وجود مسار موحد. يتم جمع المعلومات بطريقة متقاربة، وتبقى الوثائق قابلة للمقارنة، ويمكن ترتيب الأولويات بوضوح.' },
        { title: 'تنسيق المختصين المناسبين', content: 'تجمع اللوحات الإعلانية بين الإضاءة، والهياكل، والأفلام، والطباعة، والتركيب. تنسق PixelRing SERVICE الأشخاص المناسبين حسب المهمة، حتى لا يضطر العميل إلى إدارة عدة جهات في الوقت نفسه.' }
      ]
    },
    quality: {
      title: 'PixelRing أثناء العمل',
      description: 'تشخيص، إضاءة، تثبيت، تركيب. لقطات قصيرة من مسار الخدمة.',
      features: ['تشخيص', 'إضاءة', 'تركيب'],
      mediaLabel: 'فيديو',
      playLabel: 'تشغيل الفيديو',
      cta: 'مشاهدة المراجع'
    },
    deepDive: [
      {
        id: 'dd1',
        title: 'إصلاح وصيانة الإعلانات الخارجية',
        description: 'إصلاح وصيانة اللوحات والإعلانات المضيئة والعناصر الخارجية للعلامة. الهدف هو الإجراء المناسب، وليس الاستبدال غير الضروري.',
        specs: [{ label: 'المسار', value: 'الفحص أولاً' }, { label: 'المواد', value: 'حسب الموقع' }, { label: 'الخدمة', value: 'منسقة' }],
        cta: 'مشاهدة التفاصيل'
      },
      {
        id: 'dd2',
        title: 'تحديث الإعلانات المضيئة وأنظمة LED',
        description: 'تحديث اللوحات المضيئة القديمة وأنظمة LED عندما لا يكون الإصلاح البسيط هو الخيار الأفضل.',
        specs: [{ label: 'الهدف', value: 'أعطال أقل' }, { label: 'التخطيط', value: 'بعد التقييم' }, { label: 'التقنية', value: 'حسب المشروع' }],
        cta: 'اطلب التحديث'
      },
      {
        id: 'dd3',
        title: 'فحص وتدقيق أنظمة الإعلانات',
        description: 'فحص حالة اللوحة والتثبيت والمشكلات الكهربائية الظاهرة مع توثيق واضح.',
        specs: [{ label: 'النتيجة', value: 'موثقة' }, { label: 'الأولوية', value: 'حسب المخاطر' }, { label: 'الخطوة التالية', value: 'واضحة' }],
        cta: 'اطلب فحصاً'
      }
    ],
    final: {
      title: 'هل تحتاج إلى إصلاح أو فحص اللافتة؟',
      button: 'ابدأ الخدمة'
    }
  }
};

export const ABOUT_PAGE_LABELS: Record<Locale, {
  teamLabel: string;
  expertAlt: string;
  quickServicesTitle: string;
  serviceCardCta: string;
  materialTitle: string;
  materialBrands: string[];
  testimonialsTitle: string;
  testimonials: { name: string; role: string; text: string }[];
  emailPlaceholder: string;
}> = {
  de: {
    teamLabel: 'Servis ekibi',
    expertAlt: 'PixelRing Service-Team',
    quickServicesTitle: 'Für wen ist PixelRing?',
    serviceCardCta: 'Branche ansehen',
    materialTitle: 'Materialien und Lieferpartner',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    testimonialsTitle: 'Rückmeldungen aus Servicefällen',
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
    quickServicesTitle: 'Who is PixelRing for?',
    serviceCardCta: 'View sector',
    materialTitle: 'Materials and supply partners',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    testimonialsTitle: 'Feedback from service cases',
    testimonials: [
      { name: 'Retail operator', role: 'Berlin location network', text: 'PixelRing documented the issue clearly, repaired the illuminated sign, and helped us restore the storefront quickly.' },
      { name: 'Hospitality group', role: 'Multiple locations', text: 'The team communicated clearly, kept the service window realistic, and delivered a result that matched our brand standards.' },
      { name: 'Medical center', role: 'Facility management', text: 'The audit report was practical and helped us prioritize maintenance and safety work across the site.' }
    ],
    emailPlaceholder: 'Email address'
  },
  ru: {
    teamLabel: 'Servis ekibi',
    expertAlt: 'Сервисная команда PixelRing',
    quickServicesTitle: 'Для кого PixelRing?',
    serviceCardCta: 'Смотреть отрасль',
    materialTitle: 'Премиальные материалы и поставщики',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    testimonialsTitle: 'Отзывы из сервисных случаев',
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
    quickServicesTitle: 'PixelRing kimler için?',
    serviceCardCta: 'Sektörü incele',
    materialTitle: 'Malzemeler ve tedarik ortakları',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    testimonialsTitle: 'Servis işlerinden geri bildirimler',
    testimonials: [
      { name: 'Şube işletmesi', role: 'Berlin lokasyon ağı', text: 'PixelRing arızayı anlaşılır şekilde kayda aldı, ışıklı tabelayı onardı ve mağaza cephesini kısa sürede tekrar çalışır hale getirdi.' },
      { name: 'Restoran grubu', role: 'Birden fazla konum', text: 'İletişim netti, servis zamanı gerçekçi planlandı ve sonuç marka görünümümüze uydu.' },
      { name: 'Tıp merkezi', role: 'Tesis yönetimi', text: 'Kontrol raporu pratikti. Bakım ve güvenlik konularında neye önce bakmamız gerektiğini netleştirdi.' }
    ],
    emailPlaceholder: 'E-posta adresi'
  },
  pl: {
    teamLabel: 'Zespół serwisowy',
    expertAlt: 'Zespół serwisowy PixelRing',
    quickServicesTitle: 'Dla kogo jest PixelRing?',
    serviceCardCta: 'Zobacz branżę',
    materialTitle: 'Materiały i partnerzy dostaw',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    testimonialsTitle: 'Opinie ze spraw serwisowych',
    testimonials: [
      { name: 'Operator oddziału', role: 'Sieć lokalizacji w Berlinie', text: 'PixelRing jasno opisał problem, naprawił podświetlany szyld i szybko przywrócił fasadę do porządku.' },
      { name: 'Grupa restauracyjna', role: 'Kilka lokalizacji', text: 'Komunikacja była prosta, termin realny, a efekt pasował do naszego standardu wizualnego.' },
      { name: 'Centrum medyczne', role: 'Zarządzanie obiektem', text: 'Raport z kontroli był praktyczny i pomógł ustalić, które prace serwisowe są najważniejsze.' }
    ],
    emailPlaceholder: 'Adres e-mail'
  },
  ar: {
    teamLabel: 'فريق الخدمة',
    expertAlt: 'فريق خدمة بكسل رينج',
    quickServicesTitle: 'من هم عملاء بكسل رينج؟',
    serviceCardCta: 'عرض القطاع',
    materialTitle: 'المواد وشركاء التوريد',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    testimonialsTitle: 'آراء من أعمال الخدمة',
    testimonials: [
      { name: 'مشغل فرع', role: 'شبكة مواقع في برلين', text: 'سجل فريق بكسل رينج المشكلة بوضوح، وأصلح اللوحة المضيئة، وساعدنا على إعادة الواجهة إلى وضعها العملي.' },
      { name: 'مجموعة مطاعم', role: 'عدة مواقع', text: 'كان التواصل واضحاً، والموعد واقعياً، والنتيجة مناسبة لشكل علامتنا التجارية.' },
      { name: 'مركز طبي', role: 'إدارة المرافق', text: 'كان تقرير الفحص عملياً وساعدنا على تحديد أعمال الصيانة الأكثر أهمية.' }
    ],
    emailPlaceholder: 'عنوان البريد الإلكتروني'
  }
};
