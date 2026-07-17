export type IlluminatedValancePageCopy = {
  metadata: {
    title: string;
    description: string;
    socialTitle: string;
    socialDescription: string;
    openGraphLocale: string;
  };
  hero: {
    title: string;
    subline: string;
    breadcrumbs: Array<{ label: string; href?: string }>;
    primaryCta: string;
    primaryPrefill: string;
    secondaryCta: string;
    secondaryPrefill: string;
    dayViewLabel: string;
    nightViewLabel: string;
  };
  brand: {
    eyebrow: string;
    title: string;
    intro: string;
    visuals: Array<{
      label: string;
      title: string;
      text: string;
      image: string;
      alt: string;
      layout: string;
      sizes: string;
    }>;
  };
  exchange: {
    eyebrow: string;
    titleLines: [string, string];
    intro: string;
    steps: Array<{ number: string; title: string; text: string }>;
    animationLabel: string;
    awningAlt: string;
    sliderLabel: string;
    stateLabels: [string, string, string];
    stateText: [string, string, string];
  };
  compatibility: {
    eyebrow: string;
    title: string;
    intro: string;
    cta: string;
    microcopy: string;
    helpfulTitle: string;
    helpfulItems: string[];
    notRequiredTitle: string;
    notRequiredItems: string[];
  };
  calculator: {
    eyebrow: string;
    title: string;
    intro: string;
    dimensionsTitle: string;
    designTitle: string;
    valanceLengthLabel: string;
    valanceHeightLabel: string;
    textLabel: string;
    textPlaceholder: string;
    fontLabel: string;
    letterHeightLabel: string;
    logoLabel: string;
    logoOptions: Record<'none' | 'left' | 'right' | 'both', string>;
    quantityLabel: string;
    previewTitle: string;
    previewAriaLabel: string;
    logoMark: string;
    totalLengthLabel: string;
    textLengthLabel: string;
    occupiedLengthLabel: string;
    freeLengthLabel: string;
    measuringText: string;
    layoutReadyText: string;
    pricingTitle: string;
    priceDisclaimer: string;
    excludedCostsNote: string;
    individualReviewTitle: string;
    individualReviewText: string;
    requestCta: string;
    requestInitialMessage: string;
    drawerTitle: string;
    drawerServiceInfoLabel: string;
    drawerSummaryLabel: string;
    drawerFormTitle: string;
    drawerFormIntro: string;
    drawerCloseLabel: string;
    drawerPricedSummary: string;
    drawerReviewSummary: string;
    schematicNote: string;
    errors: {
      positiveNumber: string;
      wholeQuantity: string;
      emptyComposition: string;
      unsupportedCharacters: string;
      fontLoad: string;
      lettersTooTall: string;
      compositionTooWide: string;
      zoneTooLong: string;
    };
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  finalCta: {
    eyebrow: string;
    title: string;
    intro: string;
    cardTitle: string;
    cardText: string;
    button: string;
  };
};

const DE_COPY: IlluminatedValancePageCopy = {
  metadata: {
    title: 'Beleuchtete Markisen-Volants für bestehende Markisen | PixelRing',
    description:
      'Individuell gefertigte Leuchtvolants für bestehende Markisen: Machbarkeit per Foto prüfen, deutschlandweit liefern und Montage in Berlin & Brandenburg anfragen.',
    socialTitle: 'Beleuchtete Markisen-Volants für bestehende Markisen',
    socialDescription:
      'Prüfen Sie mit PixelRing, ob Ihre bestehende Markise einen individuell gefertigten Leuchtvolant erhalten kann.',
    openGraphLocale: 'de_DE',
  },
  hero: {
    title: 'Beleuchtete Markisen-Volants',
    subline:
      'Wir prüfen, ob der vordere Volant Ihrer bestehenden Markise als beleuchtete Markenfläche nachgerüstet werden kann.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Leistungen', href: '/leistungen' },
      { label: 'Beleuchtete Markisen-Volants' },
    ],
    primaryCta: 'Fotos senden & Machbarkeit prüfen',
    primaryPrefill:
      'Ich möchte prüfen lassen, ob meine bestehende Markise mit einem beleuchteten Volant nachgerüstet werden kann.',
    secondaryCta: 'Produkt & Montage anfragen',
    secondaryPrefill:
      'Ich interessiere mich für einen beleuchteten Markisen-Volant und möchte Produkt und Montage anfragen.',
    dayViewLabel: 'Tagansicht aktiv: Beleuchtung einschalten',
    nightViewLabel: 'Nachtansicht aktiv: Beleuchtung ausschalten',
  },
  brand: {
    eyebrow: 'Ihre sichtbare Markenfläche',
    title: 'So kann Ihre Marke an der Markise wirken',
    intro:
      'Drei Beispiele zeigen, wie der Leuchtvolant tagsüber und am Abend wirken kann.',
    visuals: [
      {
        label: 'Café & Gastronomie',
        title: 'Am Abend dort sichtbar, wo Gäste entscheiden, ob sie eintreten.',
        text: 'Ein beleuchteter Volant kann Eingang, Terrasse und Markenauftritt zu einem ruhigen Gesamtbild verbinden.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-cafe-evening.webp',
        alt: 'Visualisierung eines Cafés mit beleuchtetem Markisen-Volant am Abend',
        layout: 'sm:col-span-2 lg:col-span-6 lg:row-span-2',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 100vw',
      },
      {
        label: 'Ladenlokal & Studio',
        title: 'Tagsüber ein stimmiger Teil der Fassade.',
        text: 'Farbe, Proportion und Material lassen sich auf den bestehenden Auftritt und die Markise abstimmen.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-studio-day.webp',
        alt: 'Visualisierung eines Ladenlokals mit dunkelblauem Markisen-Volant bei Tag',
        layout: 'lg:col-span-6',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw',
      },
      {
        label: 'Licht & Detail',
        title: 'Motiv und Lichtzone als eine Einheit.',
        text: 'Schriftzug, Logo und Beleuchtung werden so angelegt, dass die Fläche auch aus der üblichen Entfernung gut lesbar bleibt.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-valance-detail.webp',
        alt: 'Detailvisualisierung eines gleichmäßig beleuchteten Markisen-Volants',
        layout: 'lg:col-span-6',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw',
      },
    ],
  },
  exchange: {
    eyebrow: 'Volantwechsel',
    titleLines: ['Die Markise bleibt', 'Der Volant wechselt'],
    intro:
      'Sie senden Fotos. Wir prüfen Volant, Befestigung und Machbarkeit. Nach der Freigabe wird der neue Volant gefertigt. Wenn Sie auch die Montage anfragen, stimmen wir den Austausch separat ab.',
    steps: [
      { number: '01', title: 'Bestehenden Volant lösen', text: 'Die vorhandene Markise bleibt bestehen.' },
      {
        number: '02',
        title: 'Neuen Volant einziehen',
        text: 'Passend zur zuvor geprüften Befestigung.',
      },
    ],
    animationLabel:
      'Animation des Austauschs eines alten Markisenvolants gegen einen beleuchteten PixelRing-Volant',
    awningAlt: 'Markise von vorne mit altem Volant',
    sliderLabel: 'Volant-Wechsel Schritt für Schritt',
    stateLabels: ['Alter Volant', 'Einziehen', 'Licht an'],
    stateText: ['Alter Volant', 'Volant einziehen', 'Licht an'],
  },
  compatibility: {
    eyebrow: 'Passt das zu meiner Markise?',
    title: 'Für die erste Prüfung reichen ein paar Fotos',
    intro:
      'Fotografieren Sie die Markise von vorn und von der Seite sowie Volant und Befestigung aus der Nähe. Wir prüfen, ob die Konstruktion passt. Sie müssen nichts lösen oder öffnen.',
    cta: 'Fotos senden & Machbarkeit prüfen',
    microcopy:
      'Wenn einzelne Fotos fehlen, senden Sie einfach, was Sie haben. Wir sagen Ihnen, was noch hilfreich ist.',
    helpfulTitle: 'Was Sie senden',
    helpfulItems: [
      'Gesamtansicht der Markise',
      'Volant und Befestigung aus der Nähe',
      'Seitenansicht der Markise',
    ],
    notRequiredTitle: 'Was zunächst nicht nötig ist',
    notRequiredItems: [
      'exakte technische Maße',
      'fertige Logodatei',
      'geklärte Stromführung',
    ],
  },
  calculator: {
    eyebrow: 'Online-Rechner',
    title: 'So kann Ihr neuer Volant aussehen',
    intro:
      'Passen Sie Maße und Gestaltung an – die Vorschau und der vorläufige Preis aktualisieren sich sofort.',
    dimensionsTitle: 'Volantmaße',
    designTitle: 'Leuchtmotiv',
    valanceLengthLabel: 'Volantlänge',
    valanceHeightLabel: 'Volanthöhe',
    textLabel: 'Gewünschter Text',
    textPlaceholder: 'z. B. CAFÉ PIXELRING',
    fontLabel: 'Schrift',
    letterHeightLabel: 'Buchstabenhöhe',
    logoLabel: 'Logo-Platzierung',
    logoOptions: {
      none: 'Ohne Logo',
      left: 'Links',
      right: 'Rechts',
      both: 'Links und rechts',
    },
    quantityLabel: 'Anzahl gleicher Volants',
    previewTitle: 'Visualisierung & Kalkulation',
    previewAriaLabel: 'Schematische Frontansicht des konfigurierten Markisen-Volants',
    logoMark: 'LOGO',
    totalLengthLabel: 'Volant',
    textLengthLabel: 'Schriftzug',
    occupiedLengthLabel: 'Insgesamt belegt',
    freeLengthLabel: 'Insgesamt frei',
    measuringText: 'Schrift wird geladen und vermessen …',
    layoutReadyText: 'Maße und Anordnung sind berechnet.',
    pricingTitle: 'Vorläufiger Preis',
    priceDisclaimer:
      'Nur für Unternehmer im Sinne des § 14 BGB. Unverbindliche Kostenschätzung, kein verbindliches Angebot. Alle Preise netto zzgl. 19 % MwSt.',
    excludedCostsNote:
      'Montage, Lieferung, Elektroarbeiten und Genehmigungen sind nicht enthalten und werden separat geprüft.',
    individualReviewTitle: 'Individuelle Prüfung erforderlich',
    individualReviewText:
      'Für diese Konfiguration zeigen wir keine automatische Summe. Wir prüfen Maße und Lichtzonen individuell.',
    requestCta: 'Berechnung senden & Anfrage starten',
    requestInitialMessage:
      'Ich möchte die konfigurierte Ausführung eines beleuchteten Markisen-Volants prüfen lassen.',
    drawerTitle: 'Leuchtvolant anfragen',
    drawerServiceInfoLabel: 'PixelRing Service-Info',
    drawerSummaryLabel: 'Berechnung & nächster Schritt',
    drawerFormTitle: 'Konfiguration prüfen lassen',
    drawerFormIntro:
      'Geben Sie Ihre Kontaktdaten an. Die aktuelle Konfiguration wird zusammen mit Ihrer Anfrage übermittelt.',
    drawerCloseLabel: 'Anfrage schließen',
    drawerPricedSummary:
      'Vorläufiger Preis: {price} netto. Wir prüfen Maße, Gestaltung und Preis vor einem verbindlichen Angebot erneut.',
    drawerReviewSummary:
      'Für diese Konfiguration gibt es keine automatische Preissumme. Wir prüfen Maße und Lichtzonen individuell.',
    schematicNote:
      'Die Vorschau dient der Orientierung und ist kein produktionsfertiger Entwurf. Das echte Logo und die finale Datei werden separat geprüft.',
    errors: {
      positiveNumber: 'Bitte geben Sie eine Zahl größer als 0 ein.',
      wholeQuantity: 'Bitte geben Sie eine ganze Anzahl ab 1 ein.',
      emptyComposition: 'Geben Sie einen Text ein oder wählen Sie mindestens ein Logo.',
      unsupportedCharacters:
        'Der Text enthält Zeichen, die in dieser Vorschau noch nicht zuverlässig gemessen werden können.',
      fontLoad: 'Die gewählte Schrift konnte nicht exakt geladen werden. Bitte wählen Sie eine andere Schrift.',
      lettersTooTall:
        'Die Buchstaben sind höher als die verfügbare Fläche des Volants. Bitte reduzieren Sie die Buchstabenhöhe.',
      compositionTooWide:
        'Schriftzug und Logo passen nicht in die Volantlänge. Reduzieren Sie die Buchstabenhöhe, kürzen Sie den Text oder entfernen Sie ein Logo.',
      zoneTooLong:
        'Mindestens eine Lichtzone ist länger als 2.400 mm. Dafür ist eine individuelle Berechnung erforderlich.',
    },
  },
  faq: {
    title: 'Häufige Fragen zu Leuchtvolants',
    items: [
      {
        question: 'Kann jede bestehende Markise einen Leuchtvolant erhalten?',
        answer:
          'Nein, das prüfen wir vorab. Entscheidend sind unter anderem der vorhandene Volant, die Befestigung, die Bewegung der Markise, das gewünschte Motiv und die Möglichkeit eines sicheren elektrischen Anschlusses.',
      },
      {
        question: 'Was passiert, nachdem ich Fotos gesendet habe?',
        answer:
          'Wir prüfen die Fotos und sagen Ihnen, was als Nächstes nötig ist: weitere Fotos, eine technische Klärung oder die Abstimmung von Maßen und Gestaltung.',
      },
      {
        question: 'Kann ich nur den fertigen Leuchtvolant bestellen?',
        answer:
          'Ja, Sie können Produkt und Montage getrennt anfragen. Vor der Ausführung klären wir, welche Angaben wir von Ihnen benötigen und welche Facharbeiten Sie selbst organisieren müssen.',
      },
      {
        question: 'Liefert PixelRing auch außerhalb von Berlin und Brandenburg und montiert dort?',
        answer:
          'Die Lieferung des fertigen Leuchtvolants ist deutschlandweit möglich. Unsere reguläre Montagezone ist Berlin und Brandenburg; Montagen in anderen Regionen prüfen wir individuell.',
      },
      {
        question: 'Wovon hängt die individuelle Einschätzung ab?',
        answer:
          'Entscheidend sind unter anderem Größe, Motiv, Befestigung, Zustand der vorhandenen Markise sowie Lieferung oder Montage. Deshalb nennen wir erst nach der ersten Prüfung eine belastbare Einschätzung.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Nächster Schritt',
    title: 'Fotos senden und den nächsten Schritt klären',
    intro:
      'Senden Sie uns ein paar Fotos Ihrer bestehenden Markise – auch wenn noch nicht alle Maße oder Unterlagen vorliegen. Wir prüfen die Ausgangslage und sagen Ihnen, welche Angaben wir für die Machbarkeitsprüfung noch benötigen.',
    cardTitle: 'Sie müssen noch nicht alles wissen.',
    cardText:
      'Senden Sie uns Fotos der aktuellen Situation. Wir sagen Ihnen, welche Angaben wir für die Machbarkeitsprüfung noch benötigen.',
    button: 'Fotos senden & Machbarkeit prüfen',
  },
};

const RU_COPY: IlluminatedValancePageCopy = {
  metadata: {
    title: 'Воланы с подсветкой для существующих маркиз | PixelRing',
    description:
      'Индивидуальные воланы с подсветкой для существующих маркиз: проверка возможности установки по фото, доставка по Германии и монтаж в Берлине и Бранденбурге.',
    socialTitle: 'Воланы с подсветкой для существующих маркиз',
    socialDescription:
      'Узнайте вместе с PixelRing, можно ли установить на вашу существующую маркизу индивидуальный волан с подсветкой.',
    openGraphLocale: 'ru_RU',
  },
  hero: {
    title: 'Воланы с подсветкой для маркиз',
    subline:
      'Проверим, можно ли установить на вашу существующую маркизу новый передний волан с подсветкой и фирменным оформлением.',
    breadcrumbs: [
      { label: 'Главная', href: '/' },
      { label: 'Услуги', href: '/leistungen' },
      { label: 'Воланы с подсветкой для маркиз' },
    ],
    primaryCta: 'Отправить фото на проверку',
    primaryPrefill:
      'Хочу узнать, можно ли установить на мою существующую маркизу волан с подсветкой.',
    secondaryCta: 'Запросить изготовление и монтаж',
    secondaryPrefill:
      'Меня интересует волан с подсветкой для маркизы. Хочу уточнить изготовление и монтаж.',
    dayViewLabel: 'Сейчас дневной вид. Включить подсветку',
    nightViewLabel: 'Сейчас вечерний вид. Выключить подсветку',
  },
  brand: {
    eyebrow: 'Заметное место для вашего бренда',
    title: 'Так может выглядеть ваш бренд на маркизе',
    intro:
      'Три визуализации показывают разные варианты — от дневного оформления до волана с подсветкой в вечернее время.',
    visuals: [
      {
        label: 'Кафе и гастрономия',
        title: 'Ваш бренд заметен вечером — там, где гости решают, зайти ли внутрь.',
        text: 'Волан с подсветкой объединяет вход, террасу и фирменное оформление в цельную композицию.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-cafe-evening.webp',
        alt: 'Визуализация кафе с воланом маркизы с подсветкой в вечернее время',
        layout: 'sm:col-span-2 lg:col-span-6 lg:row-span-2',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 100vw',
      },
      {
        label: 'Магазин и студия',
        title: 'Днём — органичная часть фасада.',
        text: 'Цвет, пропорции и материал можно подобрать к существующему оформлению фасада и самой маркизе.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-studio-day.webp',
        alt: 'Визуализация магазина с тёмно-синим воланом маркизы в дневное время',
        layout: 'lg:col-span-6',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw',
      },
      {
        label: 'Свет и детали',
        title: 'Дизайн и свет работают как одно целое.',
        text: 'Надпись, логотип и зону подсветки можно спроектировать так, чтобы оформление хорошо читалось с обычного расстояния.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-valance-detail.webp',
        alt: 'Детальная визуализация равномерно подсвеченного волана маркизы',
        layout: 'lg:col-span-6',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw',
      },
    ],
  },
  exchange: {
    eyebrow: 'Замена волана',
    titleLines: ['Маркиза остаётся', 'Меняется только волан'],
    intro:
      'Вы отправляете фотографии. Мы проверяем волан, крепление и возможность замены. После согласования изготовим новый волан. Если вам нужен монтаж, отдельно согласуем замену на объекте.',
    steps: [
      { number: '01', title: 'Снять существующий волан', text: 'Сама маркиза остаётся на месте.' },
      {
        number: '02',
        title: 'Установить новый волан',
        text: 'С учётом проверенного способа крепления.',
      },
    ],
    animationLabel:
      'Анимация замены старого волана маркизы на волан PixelRing с подсветкой',
    awningAlt: 'Маркиза спереди со старым воланом',
    sliderLabel: 'Замена волана шаг за шагом',
    stateLabels: ['Старый волан', 'Замена', 'Подсветка'],
    stateText: ['Старый волан', 'Установка нового волана', 'Подсветка включена'],
  },
  compatibility: {
    eyebrow: 'Подойдёт ли это к моей маркизе?',
    title: 'Для первой проверки достаточно нескольких фотографий',
    intro:
      'Снимите маркизу спереди и сбоку, а волан и крепление — крупным планом. Мы проверим, подходит ли конструкция. Ничего снимать или разбирать не нужно.',
    cta: 'Отправить фото на проверку',
    microcopy:
      'Если каких-то фотографий нет, отправьте то, что есть. Мы подскажем, что добавить.',
    helpfulTitle: 'Что прислать',
    helpfulItems: [
      'общий вид маркизы',
      'волан и крепление крупным планом',
      'вид маркизы сбоку',
    ],
    notRequiredTitle: 'Что пока не нужно',
    notRequiredItems: [
      'точные технические размеры',
      'готовый макет логотипа',
      'схема подключения',
    ],
  },
  calculator: {
    eyebrow: 'Онлайн-калькулятор',
    title: 'Посмотрите, как будет выглядеть ваш новый волан',
    intro:
      'Настройте размеры и оформление — результат и предварительная стоимость появятся сразу.',
    dimensionsTitle: 'Размеры волана',
    designTitle: 'Световая композиция',
    valanceLengthLabel: 'Длина волана',
    valanceHeightLabel: 'Высота волана',
    textLabel: 'Желаемый текст',
    textPlaceholder: 'Например: PIXELRING КАФЕ',
    fontLabel: 'Шрифт',
    letterHeightLabel: 'Высота букв',
    logoLabel: 'Расположение логотипа',
    logoOptions: {
      none: 'Без логотипа',
      left: 'Слева',
      right: 'Справа',
      both: 'Слева и справа',
    },
    quantityLabel: 'Количество одинаковых воланов',
    previewTitle: 'Визуализация и расчёт',
    previewAriaLabel: 'Схематичный вид спереди настроенного волана маркизы',
    logoMark: 'ЛОГО',
    totalLengthLabel: 'Волан',
    textLengthLabel: 'Надпись',
    occupiedLengthLabel: 'Всего занято',
    freeLengthLabel: 'Всего свободно',
    measuringText: 'Загружаем и измеряем шрифт…',
    layoutReadyText: 'Размеры и расположение рассчитаны.',
    pricingTitle: 'Предварительная стоимость',
    priceDisclaimer:
      'Только для бизнес-клиентов. Расчёт носит предварительный характер и не является офертой. Все цены указаны без НДС; НДС 19 % начисляется дополнительно.',
    excludedCostsNote:
      'Монтаж, доставка, электромонтажные работы и разрешения не включены в расчёт и уточняются отдельно.',
    individualReviewTitle: 'Нужен индивидуальный расчёт',
    individualReviewText:
      'Для этой конфигурации автоматическая сумма не показывается. Мы отдельно проверим размеры и световые зоны.',
    requestCta: 'Отправить расчёт и оставить заявку',
    requestInitialMessage:
      'Хочу проверить рассчитанный вариант волана с подсветкой для маркизы.',
    drawerTitle: 'Запросить волан с подсветкой',
    drawerServiceInfoLabel: 'Информация PixelRing',
    drawerSummaryLabel: 'Расчёт и следующий шаг',
    drawerFormTitle: 'Отправить конфигурацию на проверку',
    drawerFormIntro:
      'Укажите контактные данные. Текущая конфигурация будет отправлена вместе с заявкой.',
    drawerCloseLabel: 'Закрыть заявку',
    drawerPricedSummary:
      'Предварительная стоимость: {price} без НДС. Перед подготовкой предложения мы ещё раз проверим размеры, оформление и цену.',
    drawerReviewSummary:
      'Для этой конфигурации нет автоматической цены. Мы индивидуально проверим размеры и световые зоны.',
    schematicNote:
      'Схема предназначена для предварительной оценки и не является производственным макетом. Файл логотипа и итоговый макет мы проверим отдельно.',
    errors: {
      positiveNumber: 'Введите число больше 0.',
      wholeQuantity: 'Введите целое количество от 1.',
      emptyComposition: 'Введите текст или выберите хотя бы один логотип.',
      unsupportedCharacters:
        'В тексте есть символы, которые пока нельзя надёжно измерить в этой визуализации.',
      fontLoad: 'Не удалось точно загрузить выбранный шрифт. Выберите другой шрифт.',
      lettersTooTall: 'Высота букв больше доступной высоты волана. Уменьшите высоту букв.',
      compositionTooWide:
        'Надпись и логотип не помещаются по длине волана. Уменьшите высоту букв, сократите текст или уберите один логотип.',
      zoneTooLong:
        'Длина хотя бы одной световой зоны превышает 2400 мм. Для неё нужен индивидуальный расчёт.',
    },
  },
  faq: {
    title: 'Частые вопросы о воланах с подсветкой',
    items: [
      {
        question: 'Можно ли установить волан с подсветкой на любую существующую маркизу?',
        answer:
          'Не всегда — это нужно проверить заранее. Важны конструкция существующего волана, крепление, работа механизма маркизы, выбранное оформление и возможность безопасного подключения.',
      },
      {
        question: 'Что произойдёт после того, как я отправлю фотографии?',
        answer:
          'Мы проверим фотографии и сообщим, что понадобится дальше: дополнительные снимки, техническое уточнение или согласование размеров и дизайна.',
      },
      {
        question: 'Можно ли заказать только готовый волан с подсветкой?',
        answer:
          'Да. Изготовление волана и монтаж можно запросить отдельно. Перед началом мы уточним, какие данные потребуются от вас и какие работы нужно будет организовать самостоятельно.',
      },
      {
        question:
          'Доставляет ли PixelRing за пределы Берлина и Бранденбурга и выполняет ли там монтаж?',
        answer:
          'Доставка изготовленного изделия возможна по всей Германии. Наша основная зона монтажа — Берлин и Бранденбург. Возможность монтажа в других регионах рассматриваем индивидуально.',
      },
      {
        question: 'От чего зависит индивидуальная оценка?',
        answer:
          'На неё влияют размеры, дизайн, крепление, состояние существующей маркизы, а также доставка и место монтажа. Поэтому реалистичную оценку мы даём после первой проверки.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Следующий шаг',
    title: 'Отправьте фотографии — мы подскажем, что делать дальше',
    intro:
      'Отправьте несколько фотографий существующей маркизы, даже если у вас пока нет точных размеров или всех документов. Мы оценим исходную ситуацию и подскажем, какие данные ещё понадобятся для проверки возможности установки.',
    cardTitle: 'Необязательно знать всё заранее.',
    cardText:
      'Пришлите фотографии текущего состояния. Мы сообщим, чего ещё не хватает, чтобы оценить возможность установки.',
    button: 'Отправить фото на проверку',
  },
};

const EN_COPY: IlluminatedValancePageCopy = {
  metadata: {
    title: 'Illuminated Valances for Existing Awnings | PixelRing',
    description:
      'Custom illuminated valances for existing awnings: send photos for a feasibility review, request delivery across Germany and ask about installation in Berlin or Brandenburg.',
    socialTitle: 'Illuminated Valances for Existing Awnings',
    socialDescription:
      'Ask PixelRing to check whether your existing awning can be fitted with a custom illuminated valance.',
    openGraphLocale: 'en_US',
  },
  hero: {
    title: 'Illuminated Valances for Awnings',
    subline:
      'We check whether the front valance on your existing awning can be replaced with a custom illuminated valance for your brand.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/leistungen' },
      { label: 'Illuminated Awning Valances' },
    ],
    primaryCta: 'Send photos for a feasibility check',
    primaryPrefill:
      'I would like to know whether my existing awning can be fitted with an illuminated valance.',
    secondaryCta: 'Ask about the product and installation',
    secondaryPrefill:
      'I am interested in an illuminated awning valance and would like to ask about the product and installation.',
    dayViewLabel: 'Day view active: switch the lighting on',
    nightViewLabel: 'Night view active: switch the lighting off',
  },
  brand: {
    eyebrow: 'A visible place for your brand',
    title: 'See how your brand could look on the awning',
    intro:
      'These three visualizations show how an illuminated valance can look during the day and in the evening.',
    visuals: [
      {
        label: 'Cafés & hospitality',
        title: 'Visible in the evening, where guests decide whether to come in.',
        text: 'An illuminated valance can bring the entrance, terrace and brand presentation together in one coherent look.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-cafe-evening.webp',
        alt: 'Visualization of a café with an illuminated awning valance in the evening',
        layout: 'sm:col-span-2 lg:col-span-6 lg:row-span-2',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 100vw',
      },
      {
        label: 'Shopfronts & studios',
        title: 'Designed to fit the facade during the day.',
        text: 'Color, proportions and material can be coordinated with the existing storefront and awning.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-studio-day.webp',
        alt: 'Visualization of a shopfront with a dark blue awning valance during the day',
        layout: 'lg:col-span-6',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw',
      },
      {
        label: 'Lighting & detail',
        title: 'Lettering and light designed as one composition.',
        text: 'Lettering, logo and illuminated areas are laid out to remain clear from a typical viewing distance.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-valance-detail.webp',
        alt: 'Detailed visualization of an evenly illuminated awning valance',
        layout: 'lg:col-span-6',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw',
      },
    ],
  },
  exchange: {
    eyebrow: 'Valance replacement',
    titleLines: ['Keep the awning', 'Replace the valance'],
    intro:
      'You send us photos. We check the valance, its fixing and whether the replacement is feasible. Once approved, the new valance is made. If you also request installation, we will arrange the replacement separately.',
    steps: [
      {
        number: '01',
        title: 'Remove the existing valance',
        text: 'The existing awning stays in place.',
      },
      {
        number: '02',
        title: 'Fit the new valance',
        text: 'Sized to fit the verified guide rail or mounting method.',
      },
    ],
    animationLabel:
      'Animation showing an old awning valance being replaced with an illuminated PixelRing valance',
    awningAlt: 'Front view of an awning with its old valance',
    sliderLabel: 'Valance replacement step by step',
    stateLabels: ['Old valance', 'Fitting', 'Lights on'],
    stateText: ['Old valance', 'Fit the new valance', 'Lighting switched on'],
  },
  compatibility: {
    eyebrow: 'Will it work with my awning?',
    title: 'A few photos are enough for the first check',
    intro:
      'Photograph the awning from the front and side, then take close-ups of the valance and its fixing. We will check whether the construction is suitable. There is no need to remove or open anything.',
    cta: 'Send photos for a feasibility check',
    microcopy:
      'If you do not have every photo, send what you have. We will tell you which additional view would help.',
    helpfulTitle: 'What to send',
    helpfulItems: [
      'Full view of the awning',
      'Close-up of the valance and its fixing',
      'Side view of the awning',
    ],
    notRequiredTitle: 'What you do not need yet',
    notRequiredItems: [
      'Exact technical measurements',
      'A finished logo file',
      'A confirmed electrical route',
    ],
  },
  calculator: {
    eyebrow: 'Online calculator',
    title: 'See how your new valance could look',
    intro:
      'Adjust the dimensions and design — the preview and preliminary price update instantly.',
    dimensionsTitle: 'Valance dimensions',
    designTitle: 'Illuminated design',
    valanceLengthLabel: 'Valance length',
    valanceHeightLabel: 'Valance height',
    textLabel: 'Text to display',
    textPlaceholder: 'e.g. PIXELRING CAFÉ',
    fontLabel: 'Font',
    letterHeightLabel: 'Letter height',
    logoLabel: 'Logo position',
    logoOptions: {
      none: 'No logo',
      left: 'Left',
      right: 'Right',
      both: 'Left and right',
    },
    quantityLabel: 'Number of identical valances',
    previewTitle: 'Preview & estimate',
    previewAriaLabel: 'Diagram showing the configured awning valance from the front',
    logoMark: 'LOGO',
    totalLengthLabel: 'Valance',
    textLengthLabel: 'Lettering',
    occupiedLengthLabel: 'Total space used',
    freeLengthLabel: 'Total space free',
    measuringText: 'Loading and measuring the font…',
    layoutReadyText: 'Dimensions and layout have been calculated.',
    pricingTitle: 'Preliminary price',
    priceDisclaimer:
      'For business customers only within the meaning of Section 14 BGB (German Civil Code). This is a non-binding cost estimate, not a binding quotation. All prices are net, plus 19% VAT.',
    excludedCostsNote:
      'Installation, delivery, electrical work and permits are not included and will be assessed separately.',
    individualReviewTitle: 'Individual review required',
    individualReviewText:
      'No automatic total is shown for this configuration. A specialist will review the dimensions and illuminated areas individually.',
    requestCta: 'Send calculation and start an inquiry',
    requestInitialMessage:
      'I would like PixelRing to review the configured illuminated awning valance.',
    drawerTitle: 'Inquire about an illuminated valance',
    drawerServiceInfoLabel: 'PixelRing service information',
    drawerSummaryLabel: 'Calculation & next step',
    drawerFormTitle: 'Send the configuration for review',
    drawerFormIntro:
      'Enter your contact details. The current configuration will be sent with your inquiry.',
    drawerCloseLabel: 'Close inquiry',
    drawerPricedSummary:
      'Preliminary price: {price} net. We will check the dimensions, design and price again before issuing a binding quotation.',
    drawerReviewSummary:
      'There is no automatic total for this configuration. We will review the dimensions and illuminated areas individually.',
    schematicNote:
      'The diagram is for initial guidance and is not production-ready artwork. The original logo and final artwork will be checked separately.',
    errors: {
      positiveNumber: 'Enter a number greater than 0.',
      wholeQuantity: 'Enter a whole number of 1 or more.',
      emptyComposition: 'Enter some text or select at least one logo.',
      unsupportedCharacters:
        'The text contains characters that cannot yet be measured reliably with this set of fonts.',
      fontLoad: 'The selected font could not be loaded correctly. Please choose another font.',
      lettersTooTall: 'The letters are taller than the valance. Reduce the letter height.',
      compositionTooWide:
        'The lettering and logo do not fit within the valance length. Reduce the letter height, shorten the text or remove one logo.',
      zoneTooLong:
        'At least one illuminated area is longer than 2,400 mm. This requires an individual calculation.',
    },
  },
  faq: {
    title: 'Frequently asked questions about illuminated valances',
    items: [
      {
        question: 'Can an illuminated valance be fitted to any existing awning?',
        answer:
          'Not necessarily. We check first. Important factors include the existing valance, its fixing, the movement of the awning, the proposed design and whether a safe electrical connection can be arranged.',
      },
      {
        question: 'What happens after I send the photos?',
        answer:
          'We review the photos and tell you what is needed next: additional photos, a technical clarification, or confirmation of the dimensions and design.',
      },
      {
        question: 'Can I order the finished illuminated valance without installation?',
        answer:
          'Yes. You can inquire about the product and installation separately. Before production, we will clarify which information and specialist work you need to arrange.',
      },
      {
        question: 'Does PixelRing deliver and install outside Berlin and Brandenburg?',
        answer:
          'Delivery of the finished valance is available across Germany. Berlin and Brandenburg are our regular installation area; installation in other regions is reviewed individually.',
      },
      {
        question: 'What affects the individual assessment?',
        answer:
          'Key factors include size, design, fixing, the condition of the existing awning, delivery and the installation location. We can therefore provide a reliable assessment only after the initial review.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Next step',
    title: 'Send photos and find out what comes next',
    intro:
      'Send us a few photos of the existing awning, even if you do not yet have all the measurements or documents. We will review the starting point and tell you what information is needed next to assess feasibility.',
    cardTitle: 'You do not need to have every detail yet.',
    cardText:
      'Send photos of the current awning. We will tell you what else is needed for the feasibility check.',
    button: 'Send photos for a feasibility check',
  },
};

const PL_COPY: IlluminatedValancePageCopy = {
  metadata: {
    title: 'Podświetlane falbany do istniejących markiz | PixelRing',
    description:
      'Podświetlane falbany markizowe wykonywane na zamówienie: wstępna ocena na podstawie zdjęć, dostawa na terenie Niemiec oraz możliwość zapytania o montaż w Berlinie i Brandenburgii.',
    socialTitle: 'Podświetlane falbany do istniejących markiz',
    socialDescription:
      'Zapytaj PixelRing, czy istniejącą markizę można wyposażyć w podświetlaną falbanę wykonaną na zamówienie.',
    openGraphLocale: 'pl_PL',
  },
  hero: {
    title: 'Podświetlane falbany markizowe',
    subline:
      'Sprawdzimy, czy przednią falbanę (lambrekin) istniejącej markizy można zastąpić podświetlanym elementem z logo lub napisem.',
    breadcrumbs: [
      { label: 'Strona główna', href: '/' },
      { label: 'Usługi', href: '/leistungen' },
      { label: 'Podświetlane falbany markizowe' },
    ],
    primaryCta: 'Wyślij zdjęcia do wstępnej oceny',
    primaryPrefill:
      'Chcę sprawdzić, czy moją istniejącą markizę można wyposażyć w podświetlaną falbanę.',
    secondaryCta: 'Zapytaj o produkt i montaż',
    secondaryPrefill:
      'Interesuje mnie podświetlana falbana markizy. Chcę zapytać o produkt i montaż.',
    dayViewLabel: 'Widok dzienny: włącz podświetlenie',
    nightViewLabel: 'Widok nocny: wyłącz podświetlenie',
  },
  brand: {
    eyebrow: 'Widoczne miejsce dla Twojej marki',
    title: 'Tak Twoja marka może prezentować się na markizie',
    intro:
      'Trzy wizualizacje pokazują możliwy efekt — od wyglądu w dzień po podświetloną ekspozycję marki wieczorem.',
    visuals: [
      {
        label: 'Kawiarnie i gastronomia',
        title: 'Widoczna wieczorem — tam, gdzie goście decydują, czy wejść.',
        text: 'Podświetlana falbana może połączyć wejście, taras i oznakowanie marki w jedną spójną całość.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-cafe-evening.webp',
        alt: 'Wizualizacja kawiarni z podświetlaną falbaną markizy wieczorem',
        layout: 'sm:col-span-2 lg:col-span-6 lg:row-span-2',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 100vw',
      },
      {
        label: 'Sklepy i studia',
        title: 'W dzień — spójna część fasady.',
        text: 'Kolor, proporcje i materiał można dopasować do istniejącej fasady i markizy.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-studio-day.webp',
        alt: 'Wizualizacja sklepu z ciemnoniebieską falbaną markizy w dzień',
        layout: 'lg:col-span-6',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw',
      },
      {
        label: 'Światło i detal',
        title: 'Napis, logo i światło jako jedna kompozycja.',
        text: 'Napis, logo i strefy świetlne rozmieszczamy tak, aby całość była czytelna z typowej odległości.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-valance-detail.webp',
        alt: 'Szczegółowa wizualizacja równomiernie podświetlonej falbany markizy',
        layout: 'lg:col-span-6',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw',
      },
    ],
  },
  exchange: {
    eyebrow: 'Wymiana falbany',
    titleLines: ['Markiza zostaje', 'Wymieniamy falbanę'],
    intro:
      'Wysyłasz zdjęcia. Sprawdzamy falbanę, jej mocowanie oraz możliwość wymiany. Po akceptacji wykonujemy nową falbanę. Jeśli zapytanie obejmuje montaż, osobno uzgadniamy termin wymiany.',
    steps: [
      {
        number: '01',
        title: 'Zdjąć dotychczasową falbanę',
        text: 'Istniejąca markiza pozostaje na miejscu.',
      },
      {
        number: '02',
        title: 'Założyć nową falbanę',
        text: 'Dopasowaną do sprawdzonej prowadnicy lub mocowania.',
      },
    ],
    animationLabel:
      'Animacja wymiany starej falbany markizy na podświetlaną falbanę PixelRing',
    awningAlt: 'Markiza widziana od frontu ze starą falbaną',
    sliderLabel: 'Wymiana falbany krok po kroku',
    stateLabels: ['Stara falbana', 'Wymiana', 'Światło włączone'],
    stateText: ['Stara falbana', 'Montaż nowej falbany', 'Podświetlenie włączone'],
  },
  compatibility: {
    eyebrow: 'Czy to rozwiązanie pasuje do mojej markizy?',
    title: 'Do pierwszej oceny wystarczy kilka zdjęć',
    intro:
      'Zrób zdjęcia markizy od przodu i z boku, a także zbliżenia falbany i jej mocowania. Sprawdzimy, czy konstrukcja jest odpowiednia. Nie musisz niczego zdejmować ani otwierać.',
    cta: 'Wyślij zdjęcia do wstępnej oceny',
    microcopy:
      'Jeśli nie masz wszystkich ujęć, wyślij to, co masz. Podpowiemy, jakie dodatkowe zdjęcie będzie pomocne.',
    helpfulTitle: 'Co warto wysłać',
    helpfulItems: [
      'Zdjęcie całej markizy',
      'Zbliżenie falbany i jej mocowania',
      'Widok markizy z boku',
    ],
    notRequiredTitle: 'Czego na razie nie potrzebujesz',
    notRequiredItems: [
      'Dokładnych wymiarów technicznych',
      'Gotowego pliku z logo',
      'Ustalonego sposobu doprowadzenia zasilania',
    ],
  },
  calculator: {
    eyebrow: 'Kalkulator online',
    title: 'Zobacz, jak może wyglądać Twoja nowa falbana',
    intro:
      'Dopasuj wymiary i wygląd — podgląd i wstępna cena zaktualizują się od razu.',
    dimensionsTitle: 'Wymiary falbany',
    designTitle: 'Podświetlany motyw',
    valanceLengthLabel: 'Długość falbany',
    valanceHeightLabel: 'Wysokość falbany',
    textLabel: 'Treść napisu',
    textPlaceholder: 'np. KAWIARNIA PIXELRING',
    fontLabel: 'Krój pisma',
    letterHeightLabel: 'Wysokość liter',
    logoLabel: 'Położenie logo',
    logoOptions: {
      none: 'Bez logo',
      left: 'Po lewej',
      right: 'Po prawej',
      both: 'Po lewej i prawej',
    },
    quantityLabel: 'Liczba jednakowych falban',
    previewTitle: 'Podgląd i wycena',
    previewAriaLabel: 'Schemat skonfigurowanej falbany markizy widzianej od frontu',
    logoMark: 'LOGO',
    totalLengthLabel: 'Falbana',
    textLengthLabel: 'Napis',
    occupiedLengthLabel: 'Łącznie zajęte',
    freeLengthLabel: 'Łącznie wolne',
    measuringText: 'Wczytujemy i mierzymy krój pisma…',
    layoutReadyText: 'Wymiary i układ zostały obliczone.',
    pricingTitle: 'Wstępna cena',
    priceDisclaimer:
      'Wyłącznie dla klientów biznesowych — przedsiębiorców w rozumieniu § 14 niemieckiego kodeksu cywilnego (BGB). Kalkulacja ma charakter orientacyjny i nie jest wiążącą ofertą. Wszystkie ceny są cenami netto; należy do nich doliczyć 19% VAT.',
    excludedCostsNote:
      'Montaż, dostawa, prace elektryczne i wymagane zgody nie są uwzględnione; oceniamy je osobno.',
    individualReviewTitle: 'Potrzebna jest indywidualna wycena',
    individualReviewText:
      'Dla tej konfiguracji kalkulator nie pokazuje automatycznej kwoty. Specjalista sprawdzi wymiary i strefy świetlne indywidualnie.',
    requestCta: 'Wyślij kalkulację i zapytaj o realizację',
    requestInitialMessage:
      'Proszę o sprawdzenie skonfigurowanej podświetlanej falbany markizy.',
    drawerTitle: 'Zapytaj o podświetlaną falbanę',
    drawerServiceInfoLabel: 'Informacje serwisowe PixelRing',
    drawerSummaryLabel: 'Kalkulacja i kolejny krok',
    drawerFormTitle: 'Wyślij konfigurację do sprawdzenia',
    drawerFormIntro:
      'Podaj dane kontaktowe. Aktualna konfiguracja zostanie przekazana wraz z zapytaniem.',
    drawerCloseLabel: 'Zamknij zapytanie',
    drawerPricedSummary:
      'Wstępna cena: {price} netto. Przed przedstawieniem wiążącej oferty ponownie sprawdzimy wymiary, projekt i cenę.',
    drawerReviewSummary:
      'Dla tej konfiguracji nie ma automatycznej ceny. Wymiary i strefy świetlne sprawdzimy indywidualnie.',
    schematicNote:
      'Schemat służy wyłącznie do wstępnej orientacji i nie jest projektem produkcyjnym. Oryginalne logo i plik końcowy sprawdzamy osobno.',
    errors: {
      positiveNumber: 'Wpisz liczbę większą od 0.',
      wholeQuantity: 'Wpisz liczbę całkowitą nie mniejszą niż 1.',
      emptyComposition: 'Wpisz tekst lub wybierz co najmniej jedno logo.',
      unsupportedCharacters:
        'Tekst zawiera znaki, których nie można jeszcze wiarygodnie zmierzyć przy użyciu tego zestawu krojów pisma.',
      fontLoad: 'Nie udało się dokładnie wczytać wybranego kroju pisma. Wybierz inny.',
      lettersTooTall: 'Litery są wyższe niż falbana. Zmniejsz wysokość liter.',
      compositionTooWide:
        'Napis i logo nie mieszczą się na długości falbany. Zmniejsz wysokość liter, skróć napis lub usuń jedno logo.',
      zoneTooLong:
        'Co najmniej jedna strefa świetlna ma ponad 2400 mm długości. Ta konfiguracja wymaga indywidualnej wyceny.',
    },
  },
  faq: {
    title: 'Najczęstsze pytania o podświetlane falbany markizowe',
    items: [
      {
        question: 'Czy podświetlaną falbanę można zamontować na każdej istniejącej markizie?',
        answer:
          'Nie zawsze — trzeba to wcześniej sprawdzić. Znaczenie mają między innymi istniejąca falbana, sposób mocowania, ruch markizy, wybrany projekt oraz możliwość bezpiecznego podłączenia zasilania.',
      },
      {
        question: 'Co dzieje się po wysłaniu zdjęć?',
        answer:
          'Sprawdzamy zdjęcia i informujemy, czego potrzebujemy dalej: dodatkowych zdjęć, wyjaśnienia technicznego albo uzgodnienia wymiarów i projektu.',
      },
      {
        question: 'Czy mogę zamówić samą gotową podświetlaną falbanę?',
        answer:
          'Tak. O produkt i montaż można zapytać osobno. Przed realizacją ustalimy, jakie informacje i specjalistyczne prace trzeba zorganizować po Twojej stronie.',
      },
      {
        question: 'Czy PixelRing dostarcza i montuje poza Berlinem i Brandenburgią?',
        answer:
          'Dostawa gotowej falbany jest możliwa na terenie całych Niemiec. Berlin i Brandenburgia to nasz standardowy obszar montażu; zlecenia w innych regionach rozpatrujemy indywidualnie.',
      },
      {
        question: 'Od czego zależy indywidualna wycena?',
        answer:
          'Wpływają na nią między innymi wymiary, projekt, mocowanie, stan istniejącej markizy, dostawa i miejsce montażu. Dlatego wiarygodną ocenę możemy przedstawić dopiero po pierwszej weryfikacji.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Kolejny krok',
    title: 'Wyślij zdjęcia i sprawdź, co będzie potrzebne dalej',
    intro:
      'Wyślij kilka zdjęć istniejącej markizy, nawet jeśli nie masz jeszcze dokładnych wymiarów ani wszystkich dokumentów. Ocenimy sytuację i wskażemy, jakich informacji potrzeba do sprawdzenia możliwości wykonania.',
    cardTitle: 'Nie musisz znać wszystkich szczegółów.',
    cardText:
      'Wyślij zdjęcia obecnej markizy. Powiemy, czego jeszcze potrzebujemy do wstępnej oceny.',
    button: 'Wyślij zdjęcia do wstępnej oceny',
  },
};

const TR_COPY: IlluminatedValancePageCopy = {
  metadata: {
    title: 'Mevcut Tenteler İçin Işıklı Tente Etekleri | PixelRing',
    description:
      'Mevcut tentelere özel üretilen ışıklı tente etekleri: Fotoğraflarla uygulanabilirlik kontrolü, Almanya geneline teslimat ve Berlin ile Brandenburg için montaj talebi.',
    socialTitle: 'Mevcut Tenteler İçin Işıklı Tente Etekleri',
    socialDescription:
      'PixelRing ile mevcut tentenize özel üretim ışıklı bir ön etek uygulanıp uygulanamayacağını kontrol edin.',
    openGraphLocale: 'tr_TR',
  },
  hero: {
    title: 'Işıklı Tente Etekleri',
    subline:
      'Mevcut tentenizin ön eteğini, markanızı taşıyan ışıklı bir yüzeye dönüştürmenin mümkün olup olmadığını inceliyoruz.',
    breadcrumbs: [
      { label: 'Ana sayfa', href: '/' },
      { label: 'Hizmetler', href: '/leistungen' },
      { label: 'Işıklı tente etekleri' },
    ],
    primaryCta: 'Fotoğraf gönderin, uygunluğu inceleyelim',
    primaryPrefill:
      'Mevcut tenteme ışıklı bir ön etek uygulanıp uygulanamayacağını kontrol ettirmek istiyorum.',
    secondaryCta: 'Ürün ve montaj için bilgi alın',
    secondaryPrefill:
      'Işıklı tente eteğiyle ilgileniyorum; ürün ve montaj seçenekleri hakkında bilgi almak istiyorum.',
    dayViewLabel: 'Gündüz görünümü açık: Aydınlatmayı aç',
    nightViewLabel: 'Gece görünümü açık: Aydınlatmayı kapat',
  },
  brand: {
    eyebrow: 'Markanızın görünür olduğu alan',
    title: 'Markanız tentenizde böyle görünebilir',
    intro:
      'Üç görselleştirme, gündüz görünümünden akşam aydınlatmasına kadar farklı kullanım biçimlerini gösteriyor.',
    visuals: [
      {
        label: 'Kafe ve restoranlar',
        title: 'Markanız akşam saatlerinde de girişte görünür kalır.',
        text: 'Işıklı tente eteği, giriş ve terasla uyumlu, bütünlüklü bir marka görünümü oluşturabilir.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-cafe-evening.webp',
        alt: 'Akşam saatlerinde ışıklı tente eteği bulunan bir kafenin görselleştirmesi',
        layout: 'sm:col-span-2 lg:col-span-6 lg:row-span-2',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 100vw',
      },
      {
        label: 'Mağaza ve stüdyo',
        title: 'Gündüzleri cephenin doğal bir parçası.',
        text: 'Renk, oran ve malzeme; mevcut cephe tasarımına ve tenteye uyacak şekilde belirlenebilir.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-studio-day.webp',
        alt: 'Gündüz saatlerinde koyu mavi tente eteği bulunan bir mağazanın görselleştirmesi',
        layout: 'lg:col-span-6',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw',
      },
      {
        label: 'Işık ve detay',
        title: 'Yazı, logo ve aydınlatma birlikte planlanır.',
        text: 'Tüm öğeler, cepheye normal bakış mesafesinden net algılanacak şekilde düzenlenir.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-valance-detail.webp',
        alt: 'Eşit biçimde aydınlatılmış bir tente eteğinin detay görselleştirmesi',
        layout: 'lg:col-span-6',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw',
      },
    ],
  },
  exchange: {
    eyebrow: 'Tente eteğinin değişimi',
    titleLines: ['Tente yerinde kalır', 'Yalnızca ön etek değişir'],
    intro:
      'Siz fotoğrafları gönderirsiniz. Biz mevcut eteği, bağlantı biçimini ve uygulanabilirliği inceleriz. Onaydan sonra yeni etek üretilir. Montaj da talep ederseniz değişim işlemini ayrıca planlarız.',
    steps: [
      { number: '01', title: 'Mevcut eteğin çıkarılması', text: 'Tentenin kendisi yerinde kalır.' },
      { number: '02', title: 'Yeni eteğin takılması', text: 'Daha önce kontrol edilen bağlantı sistemine uygun şekilde.' },
    ],
    animationLabel:
      'Eski tente eteğinin ışıklı PixelRing eteğiyle değiştirilmesini gösteren animasyon',
    awningAlt: 'Önden görünen, eski eteği takılı bir tente',
    sliderLabel: 'Tente eteği değişimini adım adım görün',
    stateLabels: ['Eski etek', 'Yeni eteğin takılması', 'Aydınlatma açık'],
    stateText: ['Eski etek', 'Yeni etek takılıyor', 'Aydınlatma açık'],
  },
  compatibility: {
    eyebrow: 'Benim tenteme uygun mu?',
    title: 'İlk inceleme için birkaç fotoğraf yeterli',
    intro:
      'Tenteyi önden ve yandan, ön eteği ve bağlantı bölümünü ise yakından fotoğraflayın. Yapının uygun olup olmadığını biz kontrol ederiz. Herhangi bir parçayı sökmeniz veya açmanız gerekmez.',
    cta: 'Fotoğraf gönderin, uygunluğu inceleyelim',
    microcopy:
      'Bazı fotoğraflar eksikse elinizdekileri göndermeniz yeterli. Hangi ek fotoğraflara ihtiyaç duyduğumuzu size bildiririz.',
    helpfulTitle: 'Göndermeniz faydalı olur',
    helpfulItems: [
      'tentenin tamamını gösteren bir fotoğraf',
      'ön etek ve bağlantı bölümünün yakın çekimi',
      'tentenin yandan görünümü',
    ],
    notRequiredTitle: 'İlk aşamada gerekmez',
    notRequiredItems: [
      'kesin teknik ölçüler',
      'hazır logo dosyası',
      'tamamlanmış elektrik planı',
    ],
  },
  calculator: {
    eyebrow: 'Online hesaplayıcı',
    title: 'Yeni tente eteğinizin nasıl görüneceğine göz atın',
    intro:
      'Ölçüleri ve tasarımı ayarlayın — önizleme ve tahmini fiyat anında güncellenir.',
    dimensionsTitle: 'Tente eteği ölçüleri',
    designTitle: 'Işıklı tasarım',
    valanceLengthLabel: 'Tente eteği uzunluğu',
    valanceHeightLabel: 'Tente eteği yüksekliği',
    textLabel: 'İstenen metin',
    textPlaceholder: 'Örn. PIXELRING KAFE',
    fontLabel: 'Yazı tipi',
    letterHeightLabel: 'Harf yüksekliği',
    logoLabel: 'Logo konumu',
    logoOptions: {
      none: 'Logosuz',
      left: 'Sol tarafta',
      right: 'Sağ tarafta',
      both: 'Sol ve sağ tarafta',
    },
    quantityLabel: 'Aynı özellikteki tente eteği adedi',
    previewTitle: 'Görselleştirme ve hesaplama',
    previewAriaLabel: 'Yapılandırılmış tente eteğinin şematik önden görünümü',
    logoMark: 'LOGO',
    totalLengthLabel: 'Tente eteği',
    textLengthLabel: 'Yazı',
    occupiedLengthLabel: 'Kullanılan uzunluk',
    freeLengthLabel: 'Kalan uzunluk',
    measuringText: 'Yazı tipi yükleniyor ve ölçülüyor…',
    layoutReadyText: 'Ölçüler ve yerleşim hesaplandı.',
    pricingTitle: 'Tahmini fiyat',
    priceDisclaimer:
      'Yalnızca Alman Medeni Kanunu’nun (BGB) 14. maddesi kapsamındaki ticari müşteriler içindir. Bu hesaplama tahmini niteliktedir ve bağlayıcı bir fiyat teklifi değildir. Fiyatlara KDV dahil değildir; %19 KDV ayrıca eklenir.',
    excludedCostsNote:
      'Montaj, teslimat, elektrik işleri ve gerekli izinler dahil değildir; bunlar ayrıca değerlendirilir.',
    individualReviewTitle: 'Bireysel değerlendirme gerekli',
    individualReviewText:
      'Bu yapılandırma için otomatik fiyat gösterilmez. Ölçüleri ve ışıklı alanları ayrıca inceleriz.',
    requestCta: 'Hesaplamayı gönderin ve talep oluşturun',
    requestInitialMessage:
      'Yapılandırdığım ışıklı tente eteğinin uygulanabilirliğini kontrol ettirmek istiyorum.',
    drawerTitle: 'Işıklı tente eteği için talep gönderin',
    drawerServiceInfoLabel: 'PixelRing servis bilgisi',
    drawerSummaryLabel: 'Hesaplama ve sonraki adım',
    drawerFormTitle: 'Yapılandırmayı incelemeye gönderin',
    drawerFormIntro:
      'İletişim bilgilerinizi girin. Mevcut yapılandırma talebinizle birlikte iletilir.',
    drawerCloseLabel: 'Talep panelini kapat',
    drawerPricedSummary:
      'Tahmini fiyat: KDV hariç {price}. Bağlayıcı teklif hazırlanmadan önce ölçüleri, tasarımı ve fiyatı yeniden kontrol ederiz.',
    drawerReviewSummary:
      'Bu yapılandırma için otomatik fiyat hesaplanmıyor. Ölçüleri ve ışıklı alanları ayrı ayrı inceliyoruz.',
    schematicNote:
      'Bu önizleme yalnızca fikir vermek içindir; üretime hazır bir tasarım değildir. Gerçek logo ve nihai dosya ayrıca kontrol edilir.',
    errors: {
      positiveNumber: 'Lütfen 0’dan büyük bir sayı girin.',
      wholeQuantity: 'Lütfen 1 veya daha büyük bir tam sayı girin.',
      emptyComposition: 'Bir metin girin veya en az bir logo seçin.',
      unsupportedCharacters:
        'Metinde, mevcut önizleme yazı tipleriyle henüz güvenilir biçimde ölçülemeyen karakterler bulunuyor.',
      fontLoad: 'Seçilen yazı tipi tam olarak yüklenemedi. Lütfen başka bir yazı tipi seçin.',
      lettersTooTall: 'Harfler tente eteğinden daha yüksek. Lütfen harf yüksekliğini azaltın.',
      compositionTooWide:
        'Yazı ve logo, tente eteğinin uzunluğuna sığmıyor. Tasarımı küçültün veya metni kısaltın.',
      zoneTooLong:
        'Işıklı alanlardan en az biri 2.400 mm’den uzun. Bu ölçü için bireysel hesaplama gerekir.',
    },
  },
  faq: {
    title: 'Işıklı tente etekleri hakkında sık sorulan sorular',
    items: [
      {
        question: 'Her mevcut tenteye ışıklı bir ön etek uygulanabilir mi?',
        answer:
          'Hayır, önce kontrol edilmesi gerekir. Mevcut etek ve bağlantı biçimi, tentenin hareketi, istenen tasarım ve güvenli bir elektrik bağlantısının sağlanıp sağlanamayacağı değerlendirmede rol oynar.',
      },
      {
        question: 'Fotoğrafları gönderdikten sonra ne olur?',
        answer:
          'Fotoğrafları inceler ve devam etmek için neye ihtiyaç duyduğumuzu bildiririz: ek fotoğraflar, teknik bir açıklama ya da ölçü ve tasarımın birlikte netleştirilmesi.',
      },
      {
        question: 'Yalnızca üretilmiş ışıklı tente eteğini sipariş edebilir miyim?',
        answer:
          'Evet. Ürünü ve montajı ayrı ayrı talep edebilirsiniz. Uygulama öncesinde sizden hangi bilgileri beklediğimizi ve hangi uzmanlık işlerini ayrıca organize etmeniz gerektiğini netleştiririz.',
      },
      {
        question: 'PixelRing Berlin ve Brandenburg dışına teslimat ve montaj yapıyor mu?',
        answer:
          'Özel üretim tente eteği Almanya genelinde teslim edilebilir. Düzenli montaj bölgemiz Berlin ve Brandenburg’dur; diğer bölgelerdeki montaj taleplerini projeye göre değerlendiririz.',
      },
      {
        question: 'Bireysel değerlendirme hangi bilgilere bağlıdır?',
        answer:
          'Ölçüler, tasarım, bağlantı biçimi, mevcut tentenin durumu ile teslimat veya montaj kapsamı değerlendirmeyi etkiler. Bu nedenle güvenilir bir tahmin ancak ilk kontrolden sonra yapılır.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Sonraki adım',
    title: 'Fotoğrafları gönderin, sonraki adımı birlikte netleştirelim',
    intro:
      'Henüz tüm ölçüler veya belgeler elinizde olmasa da mevcut tentenizin birkaç fotoğrafını gönderin. Mevcut durumu inceler ve uygulanabilirlik kontrolü için hangi ek bilgilere ihtiyaç duyduğumuzu bildiririz.',
    cardTitle: 'Her şeyi önceden bilmeniz gerekmiyor.',
    cardText:
      'İlk değerlendirmeyi elinizdeki fotoğraflarla başlatabiliriz; gerekirse sizden ek bilgi isteriz.',
    button: 'Fotoğraf gönderin, uygunluğu inceleyelim',
  },
};

const AR_COPY: IlluminatedValancePageCopy = {
  metadata: {
    title: 'حواف أمامية مضيئة للمظلات القائمة | PixelRing',
    description:
      'حواف أمامية مضيئة تُصنع حسب الطلب للمظلات القائمة: فحص إمكانية التنفيذ بالصور، والتسليم إلى جميع أنحاء ألمانيا، وطلب التركيب في برلين وبراندنبورغ.',
    socialTitle: 'حواف أمامية مضيئة للمظلات القائمة',
    socialDescription:
      'نساعدك في التحقق من إمكانية تزويد مظلتك القائمة بحافة أمامية مضيئة مصممة خصيصاً لها.',
    openGraphLocale: 'ar_AR',
  },
  hero: {
    title: 'حواف أمامية مضيئة للمظلات',
    subline:
      'نفحص إمكانية استبدال الجزء الأمامي المتدلّي من مظلتك القائمة بحافة مضيئة تحمل اسم علامتك أو شعارها.',
    breadcrumbs: [
      { label: 'الرئيسية', href: '/' },
      { label: 'الخدمات', href: '/leistungen' },
      { label: 'حواف أمامية مضيئة للمظلات' },
    ],
    primaryCta: 'أرسل الصور لفحص إمكانية التنفيذ',
    primaryPrefill:
      'أرغب في معرفة ما إذا كان من الممكن تزويد مظلتي القائمة بحافة أمامية مضيئة.',
    secondaryCta: 'استفسر عن المنتج والتركيب',
    secondaryPrefill:
      'أهتم بحافة أمامية مضيئة للمظلة، وأرغب في الاستفسار عن المنتج والتركيب.',
    dayViewLabel: 'العرض النهاري مفعّل: تشغيل الإضاءة',
    nightViewLabel: 'العرض الليلي مفعّل: إيقاف الإضاءة',
  },
  brand: {
    eyebrow: 'مساحة واضحة لعلامتك',
    title: 'هكذا يمكن أن تظهر علامتك على المظلة',
    intro:
      'توضح ثلاثة تصورات أشكالاً ممكنة للاستخدام، من المظهر النهاري إلى ظهور العلامة مضيئة في المساء.',
    visuals: [
      {
        label: 'المقاهي والمطاعم',
        title: 'تبقى علامتك واضحة عند المدخل حتى في المساء.',
        text: 'يمكن للحافة المضيئة أن تربط المدخل والتراس بهوية المكان ضمن واجهة متناسقة.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-cafe-evening.webp',
        alt: 'تصور لمقهى ذي حافة مظلة أمامية مضيئة في المساء',
        layout: 'sm:col-span-2 lg:col-span-6 lg:row-span-2',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 100vw',
      },
      {
        label: 'المتاجر والاستوديوهات',
        title: 'جزء منسجم من الواجهة خلال النهار.',
        text: 'يمكن تنسيق اللون والنسب والخامة مع المظهر القائم للواجهة والمظلة.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-studio-day.webp',
        alt: 'تصور نهاري لمتجر ذي حافة مظلة أمامية باللون الأزرق الداكن',
        layout: 'lg:col-span-6',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw',
      },
      {
        label: 'الإضاءة والتفاصيل',
        title: 'نخطط للتصميم والمنطقة المضيئة معاً.',
        text: 'يُرتب النص والشعار والإضاءة بحيث تبقى العناصر واضحة من مسافة المشاهدة المعتادة أمام الواجهة.',
        image: '/images/leistungen/beleuchtete-markisenvolants/visual-valance-detail.webp',
        alt: 'تصور تفصيلي لحافة مظلة أمامية مضاءة بصورة متجانسة',
        layout: 'lg:col-span-6',
        sizes: '(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw',
      },
    ],
  },
  exchange: {
    eyebrow: 'استبدال الحافة الأمامية',
    titleLines: ['تبقى المظلة كما هي', 'وتتغير الحافة الأمامية فقط'],
    intro:
      'ترسل إلينا الصور، فنفحص الحافة الحالية وطريقة تثبيتها وإمكانية التنفيذ. بعد الموافقة تُصنع الحافة الجديدة. وإذا طلبت التركيب أيضاً، ننسق موعد الاستبدال في الموقع على حدة.',
    steps: [
      { number: '01', title: 'إزالة الحافة الحالية', text: 'تبقى المظلة نفسها في مكانها.' },
      { number: '02', title: 'تركيب الحافة الجديدة', text: 'وفقاً لنظام التثبيت الذي تم فحصه.' },
    ],
    animationLabel:
      'رسم متحرك يوضح استبدال حافة مظلة قديمة بحافة PixelRing مضيئة',
    awningAlt: 'مظلة من الأمام بحافتها القديمة',
    sliderLabel: 'استبدال حافة المظلة خطوة بخطوة',
    stateLabels: ['الحافة القديمة', 'تركيب الجديدة', 'تشغيل الإضاءة'],
    stateText: ['الحافة القديمة', 'تركيب الحافة الجديدة', 'الإضاءة مفعّلة'],
  },
  compatibility: {
    eyebrow: 'هل يناسب ذلك مظلتي؟',
    title: 'تكفي بضع صور لإجراء الفحص الأولي',
    intro:
      'صوّر المظلة من الأمام ومن الجانب، ثم صوّر الحافة وطريقة تثبيتها عن قرب. نفحص ما إذا كانت البنية مناسبة، ولا تحتاج إلى فك أي جزء أو فتحه.',
    cta: 'أرسل الصور لفحص إمكانية التنفيذ',
    microcopy:
      'إذا لم تتوفر كل الصور، أرسل ما لديك. سنوضح لك الصور الإضافية التي قد تساعد في الفحص.',
    helpfulTitle: 'ما يفيد إرساله',
    helpfulItems: [
      'صورة كاملة للمظلة',
      'صورة قريبة للحافة وطريقة تثبيتها',
      'صورة جانبية للمظلة',
    ],
    notRequiredTitle: 'ما لا نحتاجه في البداية',
    notRequiredItems: [
      'مقاسات فنية دقيقة',
      'ملف نهائي للشعار',
      'مخطط جاهز للتوصيلات الكهربائية',
    ],
  },
  calculator: {
    eyebrow: 'حاسبة عبر الإنترنت',
    title: 'شاهد كيف يمكن أن تبدو الحافة الأمامية الجديدة لمظلتك',
    intro:
      'اضبط المقاسات والتصميم، وسيتم تحديث المعاينة والسعر التقديري فوراً.',
    dimensionsTitle: 'مقاسات حافة المظلة',
    designTitle: 'التصميم المضيء',
    valanceLengthLabel: 'طول حافة المظلة',
    valanceHeightLabel: 'ارتفاع حافة المظلة',
    textLabel: 'النص المطلوب',
    textPlaceholder: 'مثال: PIXELRING CAFÉ',
    fontLabel: 'الخط',
    letterHeightLabel: 'ارتفاع الحروف',
    logoLabel: 'موضع الشعار',
    logoOptions: {
      none: 'من دون شعار',
      left: 'على الطرف الأيسر',
      right: 'على الطرف الأيمن',
      both: 'على الطرفين الأيسر والأيمن',
    },
    quantityLabel: 'عدد الحواف المتطابقة',
    previewTitle: 'المعاينة والحساب',
    previewAriaLabel: 'منظر أمامي تخطيطي لحافة المظلة بعد ضبط إعداداتها',
    logoMark: 'شعار',
    totalLengthLabel: 'حافة المظلة',
    textLengthLabel: 'النص',
    occupiedLengthLabel: 'الطول المستخدم إجمالاً',
    freeLengthLabel: 'الطول المتبقي إجمالاً',
    measuringText: 'جارٍ تحميل الخط وقياس النص…',
    layoutReadyText: 'تم حساب المقاسات والتوزيع.',
    pricingTitle: 'السعر التقديري',
    priceDisclaimer:
      'للعملاء التجاريين فقط وفقاً للمادة 14 من القانون المدني الألماني (BGB). هذا الحساب تقديري وغير ملزم، ولا يُعد عرض سعر ملزماً. الأسعار لا تشمل ضريبة القيمة المضافة؛ وتُضاف إليها ضريبة بنسبة 19%.',
    excludedCostsNote:
      'لا يشمل السعر التركيب أو التسليم أو الأعمال الكهربائية أو التصاريح؛ وتُراجع هذه البنود بصورة منفصلة.',
    individualReviewTitle: 'يلزم تقييم فردي',
    individualReviewText:
      'لا يظهر سعر تلقائي لهذه الإعدادات. نراجع المقاسات والمناطق المضيئة لكل حالة على حدة.',
    requestCta: 'أرسل نتيجة الحساب وابدأ الطلب',
    requestInitialMessage:
      'أرغب في التحقق من إمكانية تنفيذ إعداد الحافة الأمامية المضيئة الذي اخترته للمظلة.',
    drawerTitle: 'طلب حافة أمامية مضيئة',
    drawerServiceInfoLabel: 'معلومات خدمة PixelRing',
    drawerSummaryLabel: 'نتيجة الحساب والخطوة التالية',
    drawerFormTitle: 'أرسل الإعدادات للمراجعة',
    drawerFormIntro:
      'أدخل بيانات التواصل. ستُرسل الإعدادات الحالية مع طلبك.',
    drawerCloseLabel: 'إغلاق الطلب',
    drawerPricedSummary:
      'السعر التقديري قبل ضريبة القيمة المضافة: {price}. نراجع المقاسات والتصميم والسعر مرة أخرى قبل إعداد عرض ملزم.',
    drawerReviewSummary:
      'لا يتوفر سعر تلقائي لهذه الإعدادات. نراجع المقاسات والمناطق المضيئة لكل حالة على حدة.',
    schematicNote:
      'هذه المعاينة إرشادية وليست تصميماً جاهزاً للإنتاج. يُراجع الشعار الفعلي والملف النهائي بصورة منفصلة.',
    errors: {
      positiveNumber: 'أدخل رقماً أكبر من 0.',
      wholeQuantity: 'أدخل عدداً صحيحاً لا يقل عن 1.',
      emptyComposition: 'أدخل نصاً أو اختر شعاراً واحداً على الأقل.',
      unsupportedCharacters:
        'خطوط المعاينة الحالية لا تدعم النص العربي، لذلك لا يمكن حساب طوله تلقائياً. استخدم أحرفاً لاتينية في هذه المعاينة، أو أرسل لنا طلباً منفصلاً لمراجعة النص العربي.',
      fontLoad: 'تعذر تحميل الخط المختار بصورة صحيحة. يرجى اختيار خط آخر.',
      lettersTooTall: 'ارتفاع الحروف أكبر من ارتفاع حافة المظلة. يرجى تقليل ارتفاع الحروف.',
      compositionTooWide:
        'النص والشعار أطول من المساحة المتاحة على حافة المظلة. قلّل ارتفاع الحروف أو اختصر النص أو قلّل عدد الشعارات.',
      zoneTooLong:
        'يتجاوز طول منطقة مضيئة واحدة على الأقل 2400 مم. يلزم حساب فردي لهذه الحالة.',
    },
  },
  faq: {
    title: 'أسئلة شائعة عن الحواف الأمامية المضيئة للمظلات',
    items: [
      {
        question: 'هل يمكن تركيب حافة مضيئة على أي مظلة قائمة؟',
        answer:
          'ليس دائماً، ولذلك نفحصها أولاً. تؤثر الحافة القائمة وطريقة تثبيتها وحركة المظلة والتصميم المطلوب وإمكانية توفير توصيل كهربائي آمن في القرار.',
      },
      {
        question: 'ماذا يحدث بعد إرسال الصور؟',
        answer:
          'نراجع الصور ونوضح ما نحتاجه للمتابعة: صوراً إضافية، أو توضيحاً فنياً، أو تأكيد المقاسات والتصميم.',
      },
      {
        question: 'هل يمكنني طلب الحافة المضيئة الجاهزة فقط؟',
        answer:
          'نعم، يمكنك طلب المنتج والتركيب بصورة منفصلة. قبل التنفيذ نوضح المعلومات التي نحتاجها منك والأعمال الفنية التي يتعين عليك ترتيبها.',
      },
      {
        question: 'هل توفر PixelRing التسليم والتركيب خارج برلين وبراندنبورغ؟',
        answer:
          'يمكن تسليم الحافة المصنّعة حسب الطلب في جميع أنحاء ألمانيا. منطقة التركيب المعتادة لدينا هي برلين وبراندنبورغ؛ أما التركيب في المناطق الأخرى فنراجعه لكل مشروع على حدة.',
      },
      {
        question: 'ما الذي يؤثر في التقييم الفردي؟',
        answer:
          'تؤثر المقاسات والتصميم وطريقة التثبيت وحالة المظلة القائمة، وكذلك متطلبات التسليم أو التركيب. لذلك تظل أي تكلفة قبل الفحص الأولي تقديرية وغير ملزمة.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'الخطوة التالية',
    title: 'أرسل الصور لنحدد الخطوة التالية',
    intro:
      'أرسل بضع صور لمظلتك القائمة، حتى إن لم تتوفر لديك كل المقاسات أو المستندات بعد. نفحص الوضع الحالي ونوضح ما نحتاجه لإكمال فحص إمكانية التنفيذ.',
    cardTitle: 'لا تحتاج إلى معرفة كل التفاصيل مسبقاً.',
    cardText:
      'يمكننا بدء الفحص بالصور المتاحة، ثم نطلب أي معلومات إضافية عند الحاجة.',
    button: 'أرسل الصور لفحص إمكانية التنفيذ',
  },
};

const COPY_BY_LOCALE: Record<string, IlluminatedValancePageCopy> = {
  de: DE_COPY,
  en: EN_COPY,
  ru: RU_COPY,
  tr: TR_COPY,
  pl: PL_COPY,
  ar: AR_COPY,
};

export function getIlluminatedValanceCopy(locale: string): IlluminatedValancePageCopy {
  return COPY_BY_LOCALE[locale] ?? DE_COPY;
}
