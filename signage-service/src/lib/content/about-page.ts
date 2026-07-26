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
        { title: 'Ein Ansprechpartner mit klarer Begleitung', content: 'PixelRing SERVICE bündelt Anfrage, Abstimmung und nächste Schritte an einer Stelle. Wir sammeln die wichtigen Informationen und halten die Kommunikation für den Kunden übersichtlich.' },
        { title: 'Ein fester Serviceablauf', content: 'Jeder Fall wird nachvollziehbar bearbeitet: Was wurde gemeldet, was ist geprüft, welche Maßnahme ist sinnvoll und was sollte als Nächstes passieren. So bleibt das Ergebnis auch später verständlich.' },
        { title: 'Wenn es mehrere Standorte gibt', content: 'Bei mehreren Standorten hilft ein einheitlicher Ablauf. Die Informationen werden ähnlich aufgenommen, die Dokumentation bleibt vergleichbar und dringende Themen lassen sich besser einordnen.' },
        { title: 'Die passenden Fachleute koordiniert', content: 'Werbeanlagen verbinden Lichttechnik, Konstruktion, Folien, Druck und Montage. PixelRing SERVICE koordiniert je nach Aufgabe die passenden Fachleute, damit der Kunde nicht alles parallel steuern muss.' }
      ]
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
        { title: 'One contact with clear guidance', content: 'PixelRing SERVICE keeps the request, coordination, and next steps in one place. We collect the important details and keep communication clear for the client.' },
        { title: 'A fixed service flow', content: 'Each case follows a clear path: what was reported, what was checked, what action makes sense, and what should happen next. That keeps the result understandable later.' },
        { title: 'When there is more than one location', content: 'For companies with several locations, a consistent process helps. Information is collected in a similar way, documentation stays comparable, and urgent topics are easier to prioritize.' },
        { title: 'The right specialists coordinated', content: 'Signs combine lighting, structures, films, print, and installation. PixelRing SERVICE coordinates the right people for the task so the client does not have to manage several contacts at once.' }
      ]
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
        { title: 'Один контакт — понятное сопровождение', content: 'PixelRing SERVICE собирает заявку, согласование и следующие шаги в одной точке. Мы уточняем задачу, собираем важные детали, проверяем ситуацию на объекте или по материалам и держим коммуникацию понятной для клиента.' },
        { title: 'Внутренний сервисный стандарт', content: 'Каждый случай ведётся по понятному алгоритму: что было заявлено, что проверено, какая мера выглядит разумной и какой следующий шаг рекомендуется. Так появляется документация, полезная для ремонта, модернизации или дальнейшего обслуживания.' },
        { title: 'Когда объектов больше одного', content: 'Для бизнеса с несколькими точками помогает единый порядок: одинаковый сбор информации, сопоставимая документация и понятная приоритизация. В зависимости от задачи PixelRing SERVICE может фиксировать историю по отдельным локациям и упрощать будущие решения.' },
        { title: 'Координация подходящих специалистов', content: 'Рекламные конструкции объединяют светотехнику, конструкции, плёнки, печать и монтаж. PixelRing SERVICE координирует подходящих специалистов под конкретную задачу, чтобы клиенту не приходилось параллельно управлять несколькими контактами.' }
      ]
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

type AboutStructureLabels = {
  heroMicrocopy: string;
  heroProcessSteps: string[];
  heroProcessDetails: { title: string; description: string }[];
  whoEyebrow: string;
  whoTitle: string;
  whoParagraphs: string[];
  scopeEyebrow: string;
  scopeTitle: string;
  scopeIntro: string;
  scopeItems: string[];
  processEyebrow: string;
  processTitle: string;
  processLead: string;
  processSteps: { title: string; description: string }[];
  repairEyebrow: string;
  repairTitle: string;
  repairText: string;
  repairItems: string[];
  audienceEyebrow: string;
  materialsEyebrow: string;
  finalEyebrow: string;
  finalLead: string;
};

export const ABOUT_STRUCTURE_LABELS: Record<Locale, AboutStructureLabels> = {
  de: {
    heroMicrocopy: 'Kurze Beschreibung, Foto oder Video reichen für den ersten Schritt.',
    heroProcessSteps: ['Prüfung', 'Reparatur', 'Service'],
    heroProcessDetails: [
      { title: 'Anfrage und Zustand prüfen', description: 'Wir ordnen Beschreibung, Fotos und sichtbaren Zustand ein und klären, was tatsächlich nötig ist.' },
      { title: 'Passende Maßnahme umsetzen', description: 'Wir reparieren, modernisieren oder ersetzen nur das, was nach der Prüfung wirklich erforderlich ist.' },
      { title: 'Ergebnis dokumentieren und weiter betreuen', description: 'Abstimmung, Ausführung und wichtige Anlagendaten bleiben für den nächsten Servicefall nachvollziehbar.' },
    ],
    whoEyebrow: 'Wer wir sind',
    whoTitle: 'Serviceunternehmen für Werbeanlagen und sichtbare Markenflächen',
    whoParagraphs: [
      'PixelRing betreut Unternehmen bei Reparatur, Wartung und Modernisierung von Werbeanlagen, Lichtwerbung, LED-Schildern, Leuchtkästen, Folien und Fassadenbranding.',
      'Wir nehmen die Anfrage auf, prüfen Fotos, Videos und Objektinformationen und schlagen einen klaren nächsten Schritt vor: Reparatur, Service, Teilmodernisierung oder Ersatz, wenn er wirklich gebraucht wird.',
    ],
    scopeEyebrow: 'Was wir betreuen',
    scopeTitle: 'Sichtbare Marken- und Standortinfrastruktur',
    scopeIntro: 'Wir arbeiten mit den Anlagen, die Kunden, Gäste und Mitarbeitende vor Ort tatsächlich sehen und nutzen.',
    scopeItems: ['Leuchtreklame und LED-Schilder', 'Leuchtkästen und Einzelbuchstaben', 'Neon-Elemente und Lichttechnik', 'Folien, Fassadenwerbung und Orientierungssysteme', 'Montierte Werbeanlagen nach Umbau oder Standortwechsel', 'Schäden durch Wetter, Alterung, Zugang oder Befestigung'],
    processEyebrow: 'So läuft eine Anfrage ab',
    processTitle: 'Von der ersten Meldung zum klaren Arbeitsplan',
    processLead: 'Am Anfang reichen eine kurze Beschreibung und, wenn möglich, Fotos oder ein Video. Danach ordnen wir den Fall ein, stellen die nötigen Rückfragen und schlagen den nächsten Schritt vor.',
    processSteps: [
      { title: 'Anfrage mit Foto oder Video senden', description: 'Sie beschreiben kurz, was sichtbar ist, und senden nach Möglichkeit Fotos oder ein kurzes Video der Anlage.' },
      { title: 'Erste Einschätzung der Situation', description: 'Wir sehen uns Beschreibung, Fotos oder Video an, stellen Rückfragen und prüfen, was als Nächstes gebraucht wird.' },
      { title: 'Arbeitsumfang, Zugang und Termin abstimmen', description: 'Wir stimmen ab, wie die Anlage erreichbar ist, welche Materialien oder Ersatzteile infrage kommen und wann die Arbeit eingeplant werden kann.' },
      { title: 'Ausführung und Dokumentation', description: 'Nach Abstimmung wird die Arbeit vorbereitet, ausgeführt und für spätere Wartung oder Reparatur nachvollziehbar dokumentiert.' },
    ],
    repairEyebrow: 'Reparatur statt Reflex-Austausch',
    repairTitle: 'Erst prüfen, dann reparieren, modernisieren oder ersetzen',
    repairText: 'Eine defekte Werbeanlage muss nicht automatisch komplett ersetzt werden. Oft entscheidet die technische Prüfung, ob eine Reparatur, ein LED-Retrofit, ein Materialtausch oder eine neue Lösung sinnvoller ist.',
    repairItems: ['Budget und Ausfallzeit bleiben besser einschätzbar.', 'Bestehende Konstruktionen können weiter genutzt werden, wenn Zustand und Sicherheit passen.', 'Modernisierung wird erst nach Befund geplant, nicht als Standardlösung verkauft.'],
    audienceEyebrow: 'Für wen',
    materialsEyebrow: 'Materialien & Komponenten',
    finalEyebrow: 'NEXT STEP',
    finalLead: 'Senden Sie uns eine kurze Beschreibung und nach Möglichkeit ein Foto oder Video der Anlage. PixelRing prüft die Informationen und klärt den nächsten sinnvollen Schritt.',
  },
  en: {
    heroMicrocopy: 'A short description, photo, or video is enough for the first step.',
    heroProcessSteps: ['Check', 'Repair', 'Service'],
    heroProcessDetails: [
      { title: 'Review the request and condition', description: 'We assess the description, photos, and visible condition to clarify what is actually needed.' },
      { title: 'Carry out the right measure', description: 'We repair, modernize, or replace only what the assessment shows is truly necessary.' },
      { title: 'Document and keep supporting', description: 'Coordination, execution, and key system details remain traceable for future service.' },
    ],
    whoEyebrow: 'Who we are',
    whoTitle: 'A service company for signage and visible brand surfaces',
    whoParagraphs: [
      'PixelRing supports companies with repair, maintenance, and modernization of signage, illuminated advertising, LED signs, light boxes, films, and facade branding.',
      'We take the request, review photos, videos, and object information, then suggest a clear next step: repair, service, partial modernization, or replacement when it is truly needed.',
    ],
    scopeEyebrow: 'What we service',
    scopeTitle: 'Visible brand and location infrastructure',
    scopeIntro: 'We work with the systems that customers, guests, and employees actually see on site.',
    scopeItems: ['Illuminated advertising and LED signs', 'Light boxes and individual letters', 'Neon elements and lighting components', 'Films, facade branding, and wayfinding systems', 'Mounted signage after renovations or relocation', 'Damage caused by weather, age, access, or fixings'],
    processEyebrow: 'How a request works',
    processTitle: 'From first report to a clear work plan',
    processLead: 'A short description and, if possible, photos or a video are enough to start. Then we review the situation, ask the right follow-up questions, and suggest the next step.',
    processSteps: [
      { title: 'Send a request with photo or video', description: 'You briefly describe what is visible and, if possible, send photos or a short video of the sign.' },
      { title: 'First situation review', description: 'We look at the description, photos or video, ask follow-up questions, and see what needs to happen next.' },
      { title: 'Scope, access, and timing', description: 'We agree how the sign can be reached, which materials or spare parts may be needed, and when the work can be scheduled.' },
      { title: 'Execution and documentation', description: 'After coordination, the work is prepared, carried out, and documented for future maintenance or repairs.' },
    ],
    repairEyebrow: 'Repair before reflex replacement',
    repairTitle: 'Check first, then repair, modernize, or replace',
    repairText: 'A defective sign does not automatically need full replacement. Technical assessment often decides whether repair, LED retrofit, material replacement, or a new solution is the better path.',
    repairItems: ['Budget and downtime become easier to estimate.', 'Existing structures can stay in use when condition and safety allow it.', 'Modernization is planned after findings, not sold as a default answer.'],
    audienceEyebrow: 'For whom',
    materialsEyebrow: 'Materials & components',
    finalEyebrow: 'NEXT STEP',
    finalLead: 'Send a short description and, if possible, a photo or video of the sign. PixelRing reviews the information and clarifies the next sensible step.',
  },
  ru: {
    heroMicrocopy: 'Короткого описания, фото или видео достаточно для первого шага.',
    heroProcessSteps: ['Проверка', 'Ремонт', 'Сервис'],
    heroProcessDetails: [
      { title: 'Проверить заявку и состояние', description: 'Разбираем описание, фотографии и видимое состояние, чтобы понять, что действительно требуется.' },
      { title: 'Выполнить подходящее решение', description: 'Ремонтируем, модернизируем или заменяем только то, необходимость чего подтвердила проверка.' },
      { title: 'Задокументировать и сопровождать', description: 'Согласование, выполненные работы и важные данные об объекте сохраняются для дальнейшего обслуживания.' },
    ],
    whoEyebrow: 'Кто мы',
    whoTitle: 'Сервисная компания для рекламных систем и вывесок',
    whoParagraphs: [
      'PixelRing помогает бизнесу с ремонтом, обслуживанием и модернизацией рекламных систем: вывесок, световой рекламы, LED-элементов, лайтбоксов, плёнок и фасадного брендинга.',
      'Мы принимаем заявку, разбираем фото, видео и информацию по объекту, а затем предлагаем понятный следующий шаг: ремонт, сервис, частичную модернизацию или замену, когда она действительно нужна.',
    ],
    scopeEyebrow: 'Что мы обслуживаем',
    scopeTitle: 'Видимая инфраструктура бренда и локации',
    scopeIntro: 'Мы работаем с теми системами, которые клиенты, гости и сотрудники действительно видят на объекте.',
    scopeItems: ['Световая реклама и LED-вывески', 'Лайтбоксы и отдельные буквы', 'Неоновые элементы и светотехника', 'Плёнки, фасадный брендинг и навигация', 'Смонтированные рекламные конструкции после ремонта или переезда', 'Повреждения из-за погоды, старения, доступа или креплений'],
    processEyebrow: 'Как проходит заявка',
    processTitle: 'От первого сообщения до понятного плана работ',
    processLead: 'Для начала достаточно коротко описать проблему и показать её на фото или видео. Дальше мы разбираем ситуацию, задаём нужные вопросы и предлагаем следующий шаг.',
    processSteps: [
      { title: 'Отправить заявку с фото или видео', description: 'Вы коротко описываете, что видно, и по возможности отправляете фотографии или короткое видео конструкции.' },
      { title: 'Первичная оценка ситуации', description: 'Смотрим описание, фото или видео, задаём уточняющие вопросы и понимаем, что нужно проверить дальше.' },
      { title: 'План работ, доступ и сроки', description: 'Согласуем, как подойти к конструкции, какие материалы или запчасти могут понадобиться и когда удобно выполнить работу.' },
      { title: 'Выполнение и документация', description: 'После согласования работа подготавливается, выполняется, а важные детали сохраняются для будущего обслуживания.' },
    ],
    repairEyebrow: 'Ремонт вместо автоматической замены',
    repairTitle: 'Сначала проверка, затем ремонт, модернизация или замена',
    repairText: 'Неисправную рекламную систему не всегда нужно менять полностью. Часто именно техническая проверка показывает, что лучше: ремонт, LED-модернизация, замена материала или новая конструкция.',
    repairItems: ['Бюджет и время простоя становятся понятнее.', 'Существующие конструкции можно использовать дальше, если состояние и безопасность это позволяют.', 'Модернизация планируется после проверки, а не продаётся как стандартный ответ.'],
    audienceEyebrow: 'Для кого',
    materialsEyebrow: 'Материалы и компоненты',
    finalEyebrow: 'СЛЕДУЮЩИЙ ШАГ',
    finalLead: 'Отправьте короткое описание и по возможности фото или видео конструкции. PixelRing проверит информацию и уточнит следующий разумный шаг.',
  },
  tr: {
    heroMicrocopy: 'İlk adım için kısa açıklama, fotoğraf veya video yeterlidir.',
    heroProcessSteps: ['Kontrol', 'Onarım', 'Servis'],
    heroProcessDetails: [
      { title: 'Talebi ve durumu kontrol etmek', description: 'Açıklamayı, fotoğrafları ve görünen durumu değerlendirerek gerçekten ne gerektiğini netleştiririz.' },
      { title: 'Uygun işlemi gerçekleştirmek', description: 'Kontrolün gerekli gösterdiği parçaları onarır, modernize eder veya yalnızca gerektiğinde değiştiririz.' },
      { title: 'Sonucu belgelemek ve takip etmek', description: 'Koordinasyon, uygulama ve önemli sistem bilgileri sonraki servis işleri için izlenebilir kalır.' },
    ],
    whoEyebrow: 'Biz kimiz',
    whoTitle: 'Tabela ve görünür marka yüzeyleri için servis şirketi',
    whoParagraphs: [
      'PixelRing şirketlere tabela, ışıklı reklam, LED tabelalar, ışıklı kutular, folyolar ve cephe markalama alanlarında onarım, bakım ve modernizasyon desteği verir.',
      'Talebi alır, fotoğraf, video ve obje bilgilerini inceler, ardından net bir sonraki adımı öneririz: onarım, servis, kısmi modernizasyon veya gerçekten gerekiyorsa değişim.',
    ],
    scopeEyebrow: 'Neleri ele alıyoruz',
    scopeTitle: 'Görünür marka ve konum altyapısı',
    scopeIntro: 'Müşterilerin, misafirlerin ve çalışanların sahada gerçekten gördüğü sistemlerle çalışıyoruz.',
    scopeItems: ['Işıklı reklam ve LED tabelalar', 'Işıklı kutular ve tekil harfler', 'Neon öğeler ve ışık tekniği', 'Folyolar, cephe reklamı ve yönlendirme sistemleri', 'Tadilat veya taşınma sonrası monte reklam sistemleri', 'Hava, yaşlanma, erişim veya bağlantı kaynaklı hasarlar'],
    processEyebrow: 'Talep nasıl ilerler',
    processTitle: 'İlk mesajdan net çalışma planına',
    processLead: 'Başlamak için kısa bir açıklama ve mümkünse fotoğraf ya da video yeterlidir. Sonra durumu inceler, gerekli soruları sorar ve sonraki adımı öneririz.',
    processSteps: [
      { title: 'Fotoğraf veya video ile talep gönderin', description: 'Görünen sorunu kısaca anlatır, mümkünse tabelanın fotoğraflarını veya kısa videosunu gönderirsiniz.' },
      { title: 'Durumun ilk değerlendirmesi', description: 'Açıklamayı, fotoğrafları veya videoyu inceler, ek sorular sorar ve bir sonraki adım için ne gerektiğini belirleriz.' },
      { title: 'Çalışma planı, erişim ve tarih', description: 'Tabelaya nasıl erişileceğini, hangi malzeme veya parçaların gerekebileceğini ve işin ne zaman yapılabileceğini koordine ederiz.' },
      { title: 'Uygulama ve dokümantasyon', description: 'Koordinasyondan sonra iş hazırlanır, uygulanır ve ilerideki bakım veya onarımlar için belgelenir.' },
    ],
    repairEyebrow: 'Otomatik değişim yerine onarım',
    repairTitle: 'Önce kontrol, sonra onarım, modernizasyon veya değişim',
    repairText: 'Arızalı bir tabela her zaman tamamen değiştirilmek zorunda değildir. Teknik değerlendirme çoğu zaman onarım, LED retrofit, malzeme değişimi veya yeni çözümden hangisinin daha uygun olduğunu gösterir.',
    repairItems: ['Bütçe ve kesinti süresi daha iyi tahmin edilir.', 'Durum ve güvenlik uygunsa mevcut konstrüksiyonlar kullanılmaya devam edebilir.', 'Modernizasyon standart cevap olarak değil, bulguya göre planlanır.'],
    audienceEyebrow: 'Kimler için',
    materialsEyebrow: 'Malzemeler ve bileşenler',
    finalEyebrow: 'SONRAKI ADIM',
    finalLead: 'Kısa bir açıklama ve mümkünse tabelanın fotoğrafını veya videosunu gönderin. PixelRing bilgileri inceler ve mantıklı sonraki adımı netleştirir.',
  },
  pl: {
    heroMicrocopy: 'Krótki opis, zdjęcie lub wideo wystarczą do pierwszego kroku.',
    heroProcessSteps: ['Kontrola', 'Naprawa', 'Serwis'],
    heroProcessDetails: [
      { title: 'Sprawdzić zgłoszenie i stan', description: 'Oceniamy opis, zdjęcia i widoczny stan, aby ustalić, co jest rzeczywiście potrzebne.' },
      { title: 'Wykonać właściwe działanie', description: 'Naprawiamy, modernizujemy lub wymieniamy tylko to, czego konieczność potwierdziła kontrola.' },
      { title: 'Udokumentować i dalej obsługiwać', description: 'Ustalenia, wykonanie i ważne dane instalacji pozostają dostępne przy kolejnych pracach serwisowych.' },
    ],
    whoEyebrow: 'Kim jesteśmy',
    whoTitle: 'Firma serwisowa dla systemów reklamowych i widocznych powierzchni marki',
    whoParagraphs: [
      'PixelRing pomaga firmom w naprawie, konserwacji i modernizacji systemów reklamowych: szyldów, reklamy świetlnej, znaków LED, kasetonów, folii i brandingu fasad.',
      'Przyjmujemy zgłoszenie, analizujemy zdjęcia, wideo i informacje o obiekcie, a następnie proponujemy jasny kolejny krok: naprawę, serwis, częściową modernizację albo wymianę, gdy jest naprawdę potrzebna.',
    ],
    scopeEyebrow: 'Co obsługujemy',
    scopeTitle: 'Widoczna infrastruktura marki i lokalizacji',
    scopeIntro: 'Pracujemy z systemami, które klienci, goście i pracownicy faktycznie widzą na miejscu.',
    scopeItems: ['Reklama świetlna i szyldy LED', 'Kasetony i litery przestrzenne', 'Elementy neonowe i technika świetlna', 'Folie, branding fasad i systemy orientacyjne', 'Zamontowane systemy reklamowe po remoncie lub zmianie lokalizacji', 'Uszkodzenia przez pogodę, starzenie, dostęp lub mocowania'],
    processEyebrow: 'Jak przebiega zgłoszenie',
    processTitle: 'Od pierwszej wiadomości do jasnego planu prac',
    processLead: 'Na początek wystarczy krótki opis oraz, jeśli to możliwe, zdjęcia lub wideo. Potem analizujemy sytuację, zadajemy potrzebne pytania i proponujemy następny krok.',
    processSteps: [
      { title: 'Wyślij zgłoszenie ze zdjęciem lub wideo', description: 'Krótko opisujesz widoczny problem i, jeśli to możliwe, wysyłasz zdjęcia albo krótkie wideo systemu.' },
      { title: 'Pierwsza ocena sytuacji', description: 'Sprawdzamy opis, zdjęcia lub wideo, zadajemy pytania uzupełniające i ustalamy, co trzeba sprawdzić dalej.' },
      { title: 'Plan prac, dostęp i termin', description: 'Uzgadniamy, jak dostać się do systemu, jakie materiały lub części mogą być potrzebne i kiedy można wykonać pracę.' },
      { title: 'Wykonanie i dokumentacja', description: 'Po uzgodnieniu praca jest przygotowana, wykonana i udokumentowana na potrzeby przyszłej konserwacji lub napraw.' },
    ],
    repairEyebrow: 'Naprawa zamiast automatycznej wymiany',
    repairTitle: 'Najpierw sprawdzenie, potem naprawa, modernizacja albo wymiana',
    repairText: 'Uszkodzony szyld nie zawsze wymaga pełnej wymiany. Ocena techniczna często pokazuje, czy lepsza będzie naprawa, retrofit LED, wymiana materiału czy nowe rozwiązanie.',
    repairItems: ['Budżet i przestój można lepiej oszacować.', 'Istniejące konstrukcje mogą zostać w użyciu, jeśli pozwala na to stan i bezpieczeństwo.', 'Modernizacja jest planowana po ocenie, a nie sprzedawana jako standardowa odpowiedź.'],
    audienceEyebrow: 'Dla kogo',
    materialsEyebrow: 'Materiały i komponenty',
    finalEyebrow: 'NASTEPNY KROK',
    finalLead: 'Wyślij krótki opis oraz, jeśli to możliwe, zdjęcie lub wideo systemu. PixelRing sprawdzi informacje i wyjaśni kolejny sensowny krok.',
  },
  ar: {
    heroMicrocopy: 'يكفي وصف قصير أو صورة أو فيديو للخطوة الأولى.',
    heroProcessSteps: ['الفحص', 'الإصلاح', 'الخدمة'],
    heroProcessDetails: [
      { title: 'مراجعة الطلب وحالة اللوحة', description: 'نراجع الوصف والصور والحالة الظاهرة لتحديد ما هو مطلوب فعلاً.' },
      { title: 'تنفيذ الإجراء المناسب', description: 'نصلح أو نحدّث أو نستبدل فقط ما يثبت الفحص أنه ضروري.' },
      { title: 'توثيق النتيجة ومتابعة الخدمة', description: 'تبقى أعمال التنسيق والتنفيذ وبيانات اللوحة المهمة واضحة لأعمال الخدمة اللاحقة.' },
    ],
    whoEyebrow: 'من نحن',
    whoTitle: 'شركة خدمة للأنظمة الإعلانية وواجهات العلامة المرئية',
    whoParagraphs: [
      'تساعد بكسل رينج الشركات في إصلاح وصيانة وتحديث أنظمة الإعلان: اللوحات، الإعلانات المضيئة، عناصر LED، الصناديق المضيئة، الأفلام الإعلانية وواجهات العلامة.',
      'نستقبل الطلب، نراجع الصور والفيديو ومعلومات الموقع، ثم نقترح الخطوة التالية بوضوح: إصلاح، خدمة، تحديث جزئي أو استبدال عندما يكون ضرورياً فعلاً.',
    ],
    scopeEyebrow: 'ما الذي نخدمه',
    scopeTitle: 'البنية المرئية للعلامة التجارية والموقع',
    scopeIntro: 'نعمل مع الأنظمة التي يراها العملاء والضيوف والموظفون فعلياً في الموقع.',
    scopeItems: ['الإعلانات المضيئة ولوحات LED', 'الصناديق المضيئة والحروف المنفصلة', 'عناصر النيون وتقنية الإضاءة', 'الأفلام الإعلانية وواجهات العلامة وأنظمة التوجيه', 'أنظمة إعلانية مركبة بعد التجديد أو تغيير الموقع', 'أضرار الطقس أو التقادم أو الوصول أو التثبيت'],
    processEyebrow: 'كيف يسير الطلب',
    processTitle: 'من الرسالة الأولى إلى خطة عمل واضحة',
    processLead: 'للبداية يكفي وصف قصير، ومعه صور أو فيديو إن أمكن. بعد ذلك نراجع الحالة، نطرح الأسئلة اللازمة، ونقترح الخطوة التالية.',
    processSteps: [
      { title: 'إرسال طلب مع صورة أو فيديو', description: 'تصفون بإيجاز ما يظهر، وترسلون إن أمكن صوراً أو فيديو قصيراً للوحة.' },
      { title: 'تقييم أولي للحالة', description: 'نراجع الوصف والصور أو الفيديو، نطرح أسئلة متابعة، ونفهم ما الذي يجب فحصه بعد ذلك.' },
      { title: 'خطة العمل والوصول والموعد', description: 'ننسق طريقة الوصول إلى اللوحة، والمواد أو القطع التي قد تكون مطلوبة، والوقت المناسب لتنفيذ العمل.' },
      { title: 'التنفيذ والتوثيق', description: 'بعد التنسيق، يتم تحضير العمل وتنفيذه وتوثيق التفاصيل المهمة للصيانة أو الإصلاحات المستقبلية.' },
    ],
    repairEyebrow: 'الإصلاح قبل الاستبدال التلقائي',
    repairTitle: 'الفحص أولاً، ثم الإصلاح أو التحديث أو الاستبدال',
    repairText: 'اللوحة المعطلة لا تحتاج دائماً إلى استبدال كامل. غالباً ما يوضح الفحص الفني ما إذا كان الإصلاح أو تحديث LED أو تغيير المادة أو حل جديد هو الخيار الأفضل.',
    repairItems: ['تصبح الميزانية ووقت التوقف أسهل في التقدير.', 'يمكن استمرار استخدام الهياكل القائمة إذا سمحت الحالة والسلامة بذلك.', 'يتم تخطيط التحديث بعد الفحص، وليس بيعه كإجابة جاهزة.'],
    audienceEyebrow: 'لمن',
    materialsEyebrow: 'المواد والمكونات',
    finalEyebrow: 'الخطوة التالية',
    finalLead: 'أرسلوا وصفاً قصيراً، وإذا أمكن صورة أو فيديو للوحة. تراجع بكسل رينج المعلومات وتوضح الخطوة التالية المناسبة.',
  },
};

export const ABOUT_PAGE_LABELS: Record<Locale, {
  teamLabel: string;
  expertAlt: string;
  serviceVehicleAlt: string;
  quickServicesTitle: string;
  serviceCardCta: string;
  materialTitle: string;
  materialBrands: string[];
  emailPlaceholder: string;
}> = {
  de: {
    teamLabel: 'Servis ekibi',
    expertAlt: 'PixelRing Serviceteam mit Fahrzeug für Werbeanlagen-Reparatur in Berlin',
    serviceVehicleAlt: 'PixelRing Servicefahrzeug für Werbeanlagen-Reparatur, Wartung und Diagnose',
    quickServicesTitle: 'Für wen ist PixelRing?',
    serviceCardCta: 'Branche ansehen',
    materialTitle: 'Wir setzen auf ausgewählte Premium-Materialien.',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    emailPlaceholder: 'E-Mail-Adresse'
  },
  en: {
    teamLabel: 'Service Team',
    expertAlt: 'PixelRing service team with vehicle for signage repair in Berlin',
    serviceVehicleAlt: 'PixelRing service van for signage repair, maintenance, and diagnostics',
    quickServicesTitle: 'Who is PixelRing for?',
    serviceCardCta: 'View sector',
    materialTitle: 'We use selected premium materials.',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    emailPlaceholder: 'Email address'
  },
  ru: {
    teamLabel: 'Servis ekibi',
    expertAlt: 'Сервисная команда PixelRing с автомобилем для ремонта вывесок в Берлине',
    serviceVehicleAlt: 'Сервисный автомобиль PixelRing для ремонта, обслуживания и диагностики вывесок',
    quickServicesTitle: 'Для кого PixelRing?',
    serviceCardCta: 'Смотреть отрасль',
    materialTitle: 'Используем отборные премиальные материалы.',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    emailPlaceholder: 'Ваш e-mail'
  },
  tr: {
    teamLabel: 'Service-Team',
    expertAlt: 'Berlin tabela onarımı için araçlı PixelRing servis ekibi',
    serviceVehicleAlt: 'Tabela onarımı, bakımı ve teşhisi için PixelRing servis aracı',
    quickServicesTitle: 'PixelRing kimler için?',
    serviceCardCta: 'Sektörü incele',
    materialTitle: 'Seçilmiş premium malzemeler kullanıyoruz.',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    emailPlaceholder: 'E-posta adresi'
  },
  pl: {
    teamLabel: 'Zespół serwisowy',
    expertAlt: 'Zespół serwisowy PixelRing z samochodem do naprawy szyldów w Berlinie',
    serviceVehicleAlt: 'Samochód serwisowy PixelRing do naprawy, konserwacji i diagnostyki szyldów',
    quickServicesTitle: 'Dla kogo jest PixelRing?',
    serviceCardCta: 'Zobacz branżę',
    materialTitle: 'Stosujemy wyselekcjonowane materiały premium.',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    emailPlaceholder: 'Adres e-mail'
  },
  ar: {
    teamLabel: 'فريق الخدمة',
    expertAlt: 'فريق خدمة بكسل رينج مع سيارة لإصلاح اللوحات الإعلانية في برلين',
    serviceVehicleAlt: 'سيارة خدمة بكسل رينج لإصلاح وصيانة وتشخيص اللوحات الإعلانية',
    quickServicesTitle: 'من هم عملاء بكسل رينج؟',
    serviceCardCta: 'عرض القطاع',
    materialTitle: 'نستخدم مواد متميزة مختارة بعناية.',
    materialBrands: ['3M', 'ORAFOL', 'Samsung LED', 'Tridonic', 'Mean Well', 'PLEXIGLAS®', 'DIBOND®', 'Avery Dennison'],
    emailPlaceholder: 'عنوان البريد الإلكتروني'
  }
};
