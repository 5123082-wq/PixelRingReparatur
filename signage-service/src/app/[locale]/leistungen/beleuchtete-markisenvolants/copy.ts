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
    previewDescription: string;
    previewAriaLabel: string;
    logoMark: string;
    totalLengthLabel: string;
    textLengthLabel: string;
    occupiedLengthLabel: string;
    freeLengthLabel: string;
    measuringText: string;
    layoutReadyText: string;
    priceReadyText: string;
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
      'Drei Visualisierungen zeigen mögliche Einsatzbilder – von der Tageswirkung bis zur beleuchteten Markenfläche am Abend.',
    visuals: [
      {
        label: 'Café & Gastronomie',
        title: 'Am Abend dort sichtbar, wo Gäste entscheiden.',
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
        text: 'Schriftzug, Logo und Beleuchtung werden so angelegt, dass die Fläche auch aus typischer Distanz klar wirkt.',
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
      'Sie senden Fotos. Wir prüfen Volant, Befestigung und Machbarkeit. Nach der Freigabe wird der neue Volant gefertigt und ausgetauscht.',
    steps: [
      { number: '01', title: 'Bestehenden Volant lösen', text: 'Die vorhandene Markise bleibt bestehen.' },
      { number: '02', title: 'Neuen Volant einziehen', text: 'Passend zur geprüften Führung.' },
      { number: '03', title: 'Termin nach Prüfung', text: 'Ablauf nach technischer Freigabe.' },
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
    eyebrow: 'Maße & Gestaltung',
    title: 'So viel Platz braucht Ihr Leuchtmotiv',
    intro:
      'Tragen Sie Volantmaße, Wunschtext und Buchstabenhöhe ein. Die Vorschau misst den Text im gewählten Schriftfile und zeigt sofort, ob die Komposition auf die Fläche passt.',
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
    previewTitle: 'Frontansicht',
    previewDescription: 'Die Darstellung passt sich Ihren Eingaben direkt an.',
    previewAriaLabel: 'Schematische Frontansicht des konfigurierten Markisen-Volants',
    logoMark: 'LOGO',
    totalLengthLabel: 'Volant',
    textLengthLabel: 'Schriftzug',
    occupiedLengthLabel: 'Belegt gesamt',
    freeLengthLabel: 'Frei gesamt',
    measuringText: 'Schrift wird geladen und vermessen …',
    layoutReadyText: 'Maße und Anordnung sind berechnet.',
    priceReadyText: 'Der vorläufige Gesamtpreis ist berechnet.',
    pricingTitle: 'Vorläufiger Gesamtpreis',
    priceDisclaimer:
      'Nur für Unternehmer im Sinne des § 14 BGB. Unverbindliche Kostenschätzung, kein verbindliches Angebot. Alle Preise netto zzgl. 19 % MwSt.',
    excludedCostsNote:
      'Montage, Lieferung, Elektroarbeiten und Genehmigungen sind nicht enthalten und werden separat geprüft.',
    individualReviewTitle: 'Individuelle Prüfung erforderlich',
    individualReviewText:
      'Für diese Konfiguration zeigen wir keine automatische Summe. Ein Spezialist prüft Maße und Lichtzonen individuell.',
    requestCta: 'Berechnung senden & Anfrage starten',
    requestInitialMessage:
      'Ich möchte die konfigurierte Ausführung eines beleuchteten Markisen-Volants prüfen lassen.',
    drawerTitle: 'Leuchtvolant anfragen',
    drawerServiceInfoLabel: 'PixelRing Service-Info',
    drawerSummaryLabel: 'Berechnung & nächster Schritt',
    drawerFormTitle: 'Konfiguration prüfen lassen',
    drawerFormIntro:
      'Geben Sie Ihre Kontaktdaten an. Die aktuelle Konfiguration wird sicher mit Ihrer Anfrage übermittelt.',
    drawerCloseLabel: 'Anfrage schließen',
    drawerPricedSummary:
      'Vorläufiger Gesamtpreis: {price} netto. Wir prüfen Maße, Gestaltung und Preis vor einem verbindlichen Angebot erneut.',
    drawerReviewSummary:
      'Für diese Konfiguration gibt es keine automatische Preissumme. Wir prüfen Maße und Lichtzonen individuell.',
    schematicNote:
      'Die Vorschau dient der Orientierung und ist kein produktionsfertiger Entwurf. Das echte Logo und die finale Datei werden separat geprüft.',
    errors: {
      positiveNumber: 'Bitte geben Sie eine Zahl größer als 0 ein.',
      wholeQuantity: 'Bitte geben Sie eine ganze Anzahl ab 1 ein.',
      emptyComposition: 'Geben Sie einen Text ein oder wählen Sie mindestens ein Logo.',
      unsupportedCharacters:
        'Der Text enthält Zeichen, die mit diesem Vorschau-Satz noch nicht sicher vermessen werden können.',
      fontLoad: 'Die gewählte Schrift konnte nicht exakt geladen werden. Bitte wählen Sie eine andere Schrift.',
      lettersTooTall: 'Die Buchstaben sind höher als der Volant. Bitte reduzieren Sie die Buchstabenhöhe.',
      compositionTooWide:
        'Schriftzug und Logo passen nicht in die Volantlänge. Bitte verkleinern oder kürzen Sie die Komposition.',
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
          'Nein, das prüfen wir vorab. Entscheidend sind unter anderem der vorhandene Volant, die Befestigung, die Bewegung der Markise, das gewünschte Motiv und ein sicher klärbarer Anschluss.',
      },
      {
        question: 'Was passiert nach meiner Foto-Anfrage?',
        answer:
          'Wir prüfen die sichtbaren Angaben und schlagen den nächsten sinnvollen Schritt vor: weitere Fotos, eine technische Klärung oder die Abstimmung von Maßen und Gestaltung.',
      },
      {
        question: 'Kann ich nur den fertigen Leuchtvolant bestellen?',
        answer:
          'Ja, Sie können Produkt und Montage getrennt anfragen. Für die Ausführung klären wir, welche Angaben und Fachleistungen auf Ihrer Seite organisiert werden müssen.',
      },
      {
        question: 'Liefert PixelRing auch außerhalb von Berlin und Brandenburg und montiert dort?',
        answer:
          'Die Lieferung des geplanten Produkts ist deutschlandweit möglich. Unsere reguläre Montagezone ist Berlin und Brandenburg; Montagen in anderen Regionen prüfen wir individuell.',
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
      'Senden Sie uns ein paar Fotos Ihrer bestehenden Markise – auch wenn noch nicht alle Maße oder Unterlagen vorliegen. Wir prüfen die Ausgangslage und sagen Ihnen, welche Information für die Machbarkeit als Nächstes wichtig ist.',
    cardTitle: 'Sie müssen noch nicht alles wissen.',
    cardText:
      'Senden Sie die sichtbare Ausgangslage. Wir sagen Ihnen, welche Information für die Machbarkeit als Nächstes wichtig ist.',
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
    title: 'Воланы для маркиз с подсветкой',
    subline:
      'Проверим, можно ли установить на вашу существующую маркизу новый передний волан с подсветкой и фирменным оформлением.',
    breadcrumbs: [
      { label: 'Главная', href: '/' },
      { label: 'Услуги', href: '/leistungen' },
      { label: 'Воланы для маркиз с подсветкой' },
    ],
    primaryCta: 'Отправить фото на проверку',
    primaryPrefill:
      'Хочу узнать, можно ли установить на мою существующую маркизу волан с подсветкой.',
    secondaryCta: 'Запросить изготовление и монтаж',
    secondaryPrefill:
      'Меня интересует волан для маркизы с подсветкой. Хочу уточнить изготовление и монтаж.',
    dayViewLabel: 'Сейчас дневной вид. Включить подсветку',
    nightViewLabel: 'Сейчас вечерний вид. Выключить подсветку',
  },
  brand: {
    eyebrow: 'Бренд-зона, которую видно',
    title: 'Так может выглядеть ваш бренд на маркизе',
    intro:
      'Три визуализации показывают разные варианты — от дневного оформления до волана с подсветкой в вечернее время.',
    visuals: [
      {
        label: 'Кафе и гастрономия',
        title: 'Заметен вечером — там, где гости решают, зайти ли внутрь.',
        text: 'Волан с подсветкой помогает объединить вход, террасу и фирменное оформление в единый, цельный образ.',
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
        text: 'Надпись, логотип и зону подсветки можно спроектировать так, чтобы оформление хорошо читалось с расстояния, с которого обычно смотрят на фасад.',
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
      'Вы отправляете фотографии. Мы проверяем волан, крепление и возможность замены. После согласования изготовим новый волан и заменим существующий.',
    steps: [
      { number: '01', title: 'Снять существующий волан', text: 'Сама маркиза остаётся на месте.' },
      {
        number: '02',
        title: 'Установить новый волан',
        text: 'В проверенную и подходящую направляющую.',
      },
      { number: '03', title: 'Согласовать дату работ', text: 'После технического подтверждения.' },
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
    eyebrow: 'Размеры и оформление',
    title: 'Проверьте, сколько места займёт световая композиция',
    intro:
      'Укажите размеры волана, желаемый текст и высоту букв. Калькулятор измерит надпись по точному файлу выбранного шрифта и сразу покажет, помещается ли композиция.',
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
    previewTitle: 'Вид спереди',
    previewDescription: 'Схема обновляется сразу после изменения параметров.',
    previewAriaLabel: 'Схематичный вид спереди настроенного волана маркизы',
    logoMark: 'ЛОГО',
    totalLengthLabel: 'Волан',
    textLengthLabel: 'Надпись',
    occupiedLengthLabel: 'Суммарно занято',
    freeLengthLabel: 'Суммарно свободно',
    measuringText: 'Загружаем и измеряем шрифт…',
    layoutReadyText: 'Размеры и расположение рассчитаны.',
    priceReadyText: 'Предварительная итоговая стоимость рассчитана.',
    pricingTitle: 'Предварительная итоговая стоимость',
    priceDisclaimer:
      'Только для бизнес-клиентов. Предварительный расчёт не является обязательным предложением. Все цены указаны без НДС; НДС 19% начисляется дополнительно.',
    excludedCostsNote:
      'Монтаж, доставка, электромонтажные работы и разрешения не включены и рассчитываются отдельно.',
    individualReviewTitle: 'Нужен индивидуальный расчёт',
    individualReviewText:
      'Для этой конфигурации автоматическая сумма не показывается. Специалист отдельно проверит размеры и световые зоны.',
    requestCta: 'Отправить расчёт и оставить заявку',
    requestInitialMessage:
      'Прошу проверить настроенный вариант волана для маркизы с подсветкой.',
    drawerTitle: 'Запросить волан с подсветкой',
    drawerServiceInfoLabel: 'Информация PixelRing',
    drawerSummaryLabel: 'Расчёт и следующий шаг',
    drawerFormTitle: 'Отправить конфигурацию на проверку',
    drawerFormIntro:
      'Укажите контактные данные. Текущая конфигурация будет безопасно передана вместе с заявкой.',
    drawerCloseLabel: 'Закрыть заявку',
    drawerPricedSummary:
      'Предварительная итоговая стоимость: {price} без НДС. Перед обязательным предложением мы повторно проверим размеры, оформление и цену.',
    drawerReviewSummary:
      'Для этой конфигурации нет автоматической цены. Мы индивидуально проверим размеры и световые зоны.',
    schematicNote:
      'Схема предназначена для предварительной оценки и не является производственным макетом. Настоящий логотип и итоговый файл проверяются отдельно.',
    errors: {
      positiveNumber: 'Введите число больше 0.',
      wholeQuantity: 'Введите целое количество от 1.',
      emptyComposition: 'Введите текст или выберите хотя бы один логотип.',
      unsupportedCharacters:
        'В тексте есть символы, которые пока нельзя надёжно измерить с этим набором шрифтов.',
      fontLoad: 'Не удалось точно загрузить выбранный шрифт. Выберите другой шрифт.',
      lettersTooTall: 'Высота букв больше высоты волана. Уменьшите высоту букв.',
      compositionTooWide:
        'Надпись и логотип не помещаются по длине волана. Уменьшите или сократите композицию.',
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
          'Не всегда — это нужно проверить заранее. Важны конструкция существующего волана, крепление, движение маркизы, выбранное оформление и возможность безопасного подключения.',
      },
      {
        question: 'Что произойдёт после того, как я отправлю фотографии?',
        answer:
          'Мы изучим видимую информацию и предложим следующий разумный шаг: дополнительные фотографии, техническое уточнение или согласование размеров и дизайна.',
      },
      {
        question: 'Можно ли заказать только готовый волан с подсветкой?',
        answer:
          'Да. Изготовление волана и монтаж можно запросить отдельно. Перед началом мы уточним, какие данные и специализированные работы нужно будет организовать с вашей стороны.',
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
      'Отправьте несколько фотографий существующей маркизы, даже если у вас пока нет точных размеров или всех документов. Мы оценим исходную ситуацию и подскажем, какая информация ещё понадобится для проверки возможности установки.',
    cardTitle: 'Необязательно знать всё заранее.',
    cardText:
      'Пришлите то, что видно на объекте. Мы сообщим, чего ещё не хватает, чтобы оценить возможность установки.',
    button: 'Отправить фото на проверку',
  },
};

export function getIlluminatedValanceCopy(locale: string): IlluminatedValancePageCopy {
  return locale === 'ru' ? RU_COPY : DE_COPY;
}
