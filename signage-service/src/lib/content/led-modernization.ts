export type LedLocale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';
export type LedVisualCopy = {
  title: string; intro: string;
  photoAlt: string;
  demoEyebrow: string; demoTitle: string; demoIntro: string; demoHint: string; demoNote: string;
  stages: [string, string, string];
  stageTitles: [string, string, string]; stageTexts: [string, string, string];
  layers: [string, string, string]; sign: string;
  servicesEyebrow: string; servicesTitle: string;
  services: [ {title: string; text: string; alt: string}, {title: string; text: string; alt: string}, {title: string; text: string; alt: string} ];
  decisionTitle: string; processTitle: string; requestHint: string; faqIntro: string;
};

const COPY: Record<LedLocale, LedVisualCopy> = {
  de: {
    demoHint: 'Wählen Sie einen Schritt und entdecken Sie, was sich verändert.',
    title: 'LED-Modernisierung für Lichtwerbung',
    intro: 'Wir erneuern die Beleuchtung von Leuchtkästen und Profilbuchstaben. Dabei prüfen wir, welche Teile bleiben können und was ersetzt werden muss.',
    photoAlt: 'Geöffneter Lichtkasten mit LED-Modulen an einer Fassade bei Abendlicht',
    demoEyebrow: 'Ein Gehäuse. Neue Möglichkeiten.', demoTitle: 'Was sich innen ändert, sieht man außen.',
    demoIntro: 'Entdecken Sie am Beispiel eines Leuchtkastens, wie aus vorhandener Substanz eine neue Lichtwirkung entstehen kann.',
    demoNote: 'Schematische Darstellung. Lichtwirkung und Aufbau hängen von der jeweiligen Anlage ab.',
    stages: ['Bestand', 'LED-Technik', 'Lichtbild'],
    stageTitles: ['Erst verstehen. Dann verändern.', 'Das Zusammenspiel macht den Unterschied.', 'Ein stimmiger Auftritt. Auch am Abend.'],
    stageTexts: ['Wir prüfen Gehäuse, Front und Befestigung. Was weiter nutzbar ist, kann bleiben. Ältere Röhrentechnik wird als Teil des gesamten Systems bewertet.', 'Modulabstände, Netzteil und Verkabelung werden auf Tiefe, Format und Front abgestimmt. Einfach mehr LEDs einzubauen ist nicht immer die Lösung.', 'Zum Abschluss zählen gleichmäßige Ausleuchtung, passende Lichtfarbe und gute Lesbarkeit. Das Ergebnis wird an der Anlage geprüft.'],
    layers: ['Gehäuse & Befestigung', 'Module & Stromversorgung', 'Front & Lichtwirkung'], sign: 'IHRE MARKE',
    servicesEyebrow: 'Ihre Aufgabe', servicesTitle: 'Lichtwerbung gezielt modernisieren',
    services: [
      {title: 'Alte Leuchtmittel durch LED ersetzen', text: 'Wir prüfen, ob sich die vorhandene Röhrentechnik auf LED umrüsten lässt. Bei Neon vergleichen wir Erhalt, Reparatur und eine LED-Alternative.', alt: 'Geöffneter Leuchtkasten mit eingebauten LED-Modulen'},
      {title: 'Beleuchtung erneuern, Gehäuse behalten', text: 'Wenn Gehäuse und Front weiter nutzbar sind, stimmen wir Module, Netzteile und Verkabelung auf die vorhandene Konstruktion ab.', alt: 'Arbeit an der Verkabelung einer beleuchteten Werbeanlage'},
      {title: 'Flecken und ungleichmäßiges Licht beheben', text: 'Dunkle Stellen, sichtbare Lichtpunkte oder unterschiedliche Lichtfarben: Wir prüfen die Ursache und die passende Anpassung.', alt: 'Leuchtende Profilbuchstaben an einer Gebäudefassade am Abend'},
    ],
    decisionTitle: 'Reparatur, Modernisierung oder Austausch', processTitle: 'Vom ersten Foto zum passenden Licht.',
    requestHint: 'Für den Anfang: ein Gesamtfoto, ein Detailfoto und der Standort. Montagehöhe und Ihr gewünschtes Ergebnis helfen uns weiter.',
    faqIntro: 'Die wichtigsten Fragen, bevor aus einer Idee ein Umbau wird.',
  },
  en: {
    demoHint: 'Select a stage to see what changes.',
    title: 'LED upgrades for illuminated signs',
    intro: 'We upgrade the lighting in lightboxes and illuminated letters. We check which parts can stay and which need replacing.',
    photoAlt: 'Open lightbox with LED modules on a facade at dusk',
    demoEyebrow: 'One housing. New possibilities.', demoTitle: 'The change inside shows on the outside.',
    demoIntro: 'Explore a lightbox example to see how existing components can form the basis of a new lighting effect.',
    demoNote: 'Schematic illustration. Lighting and construction depend on the individual sign.',
    stages: ['Existing sign', 'LED technology', 'Light effect'],
    stageTitles: ['Understand first. Then change.', 'The parts need to work together.', 'A consistent presence. Even after dark.'],
    stageTexts: ['We check the housing, face and fixings. Usable parts can stay. Older tube lighting is assessed as part of the whole system.', 'Module spacing, power supply and wiring are matched to the depth, size and face. Adding more LEDs is not always the answer.', 'Even illumination, suitable colour temperature and legibility matter. The finished result is checked on the sign.'],
    layers: ['Housing & fixings', 'Modules & power', 'Face & light effect'], sign: 'YOUR BRAND',
    servicesEyebrow: 'Your project', servicesTitle: 'Ways to upgrade your sign lighting',
    services: [
      {title: 'Replace old lighting with LEDs', text: 'We check whether existing tube lighting can be converted to LED. For neon, we compare preservation, repair and an LED alternative.', alt: 'Open lightbox with installed LED modules'},
      {title: 'Upgrade the lighting, keep the housing', text: 'If the housing and face are still usable, we match modules, power supplies and wiring to the existing structure.', alt: 'Wiring work on an illuminated sign'},
      {title: 'Fix dark patches and uneven lighting', text: 'Dark areas, visible light points or inconsistent colour: we check the cause and work out the right adjustment.', alt: 'Illuminated letters on a building facade in the evening'},
    ],
    decisionTitle: 'Repair, modernisation or replacement', processTitle: 'From the first photo to the right light.',
    requestHint: 'Start with an overall photo, a close-up and the location. Mounting height and your desired result also help.',
    faqIntro: 'The key questions before an idea becomes an upgrade.',
  },
  ru: {
    demoHint: 'Переключайте этапы, чтобы увидеть, что меняется.',
    title: 'LED-модернизация световой рекламы',
    intro: 'Обновляем подсветку световых коробов и объёмных букв. Проверяем, какие элементы можно сохранить и что потребуется заменить.',
    photoAlt: 'Открытый световой короб с LED-модулями на фасаде в вечернем свете',
    demoEyebrow: 'Прежний корпус. Новые возможности.', demoTitle: 'Меняем внутри. Разницу видно снаружи.',
    demoIntro: 'На примере светового короба показываем, как существующая конструкция может получить новую подсветку.',
    demoNote: 'Схематическая иллюстрация. Конструкция и световой эффект зависят от конкретной вывески.',
    stages: ['До обновления', 'LED-модули', 'Световой эффект'],
    stageTitles: ['Сначала разобраться. Потом менять.', 'Важны не только диоды, но и вся система.', 'Цельный образ. Даже после заката.'],
    stageTexts: ['Проверяем корпус, лицевую панель и крепления. Исправные части можно сохранить. Старую ламповую подсветку оцениваем вместе со всей конструкцией.', 'Расстояние между модулями, блок питания и проводку подбирают под глубину, размеры и лицевую панель. Просто добавить диодов — не всегда решение.', 'Проверяем равномерность подсветки, оттенок света и читаемость. Итоговый результат оцениваем на самой вывеске.'],
    layers: ['Корпус и крепления', 'Модули и питание', 'Панель и свет'], sign: 'ВАШ БРЕНД',
    servicesEyebrow: 'Ваша задача', servicesTitle: 'Варианты обновления подсветки',
    services: [
      {title: 'Заменить старые лампы на LED', text: 'Проверяем возможность перехода с ламповой подсветки на LED. Для неона отдельно сравниваем сохранение, ремонт и LED-альтернативу.', alt: 'Открытый световой короб с установленными LED-модулями'},
      {title: 'Обновить подсветку, сохранить корпус', text: 'Если корпус и лицевая панель пригодны для дальнейшего использования, подбираем модули, питание и проводку под существующую конструкцию.', alt: 'Работа с проводкой световой вывески'},
      {title: 'Убрать пятна и неравномерный свет', text: 'Тёмные участки, заметные световые точки или разница оттенков: проверяем причину и определяем, что нужно изменить.', alt: 'Светящиеся объёмные буквы на фасаде здания вечером'},
    ],
    decisionTitle: 'Ремонт, модернизация или замена', processTitle: 'От первого фото до подходящего света.',
    requestHint: 'Для начала: общий вид, крупный план и адрес. Высота установки и желаемый результат помогут нам разобраться точнее.',
    faqIntro: 'Главное, что стоит знать перед обновлением подсветки.',
  },
  tr: {
    demoHint: 'Nelerin değiştiğini görmek için bir aşama seçin.',
    title: 'Işıklı tabelalar için LED dönüşümü',
    intro: 'Işıklı kutuların ve kutu harflerin aydınlatmasını yeniliyoruz. Hangi parçaların korunabileceğini ve hangilerinin değiştirilmesi gerektiğini inceliyoruz.',
    photoAlt: 'Akşam ışığında cephede LED modüllü açık ışıklı kutu',
    demoEyebrow: 'Aynı gövde. Yeni olanaklar.', demoTitle: 'İçerideki değişim dışarıdan görünür.',
    demoIntro: 'Mevcut bir ışıklı kutunun yeni bir aydınlatmaya nasıl kavuşabileceğini keşfedin.',
    demoNote: 'Şematik gösterim. Işık etkisi ve yapı, tabelaya göre değişir.',
    stages: ['Mevcut durum', 'LED teknolojisi', 'Işık etkisi'],
    stageTitles: ['Önce anlayın. Sonra değiştirin.', 'Bileşenlerin uyumu fark yaratır.', 'Akşam da tutarlı bir görünüm.'],
    stageTexts: ['Gövde, ön yüz ve bağlantıları inceliyoruz. Kullanılabilir parçalar kalabilir. Eski tüplü aydınlatma bütün sistemle birlikte değerlendirilir.', 'Modül aralıkları, güç kaynağı ve kablolar derinliğe, boyuta ve ön yüze göre seçilir. Daha fazla LED her zaman çözüm değildir.', 'Homojen aydınlatma, uygun ışık rengi ve okunabilirlik önemlidir. Sonuç tabelanın üzerinde kontrol edilir.'],
    layers: ['Gövde ve bağlantılar', 'Modüller ve güç', 'Ön yüz ve ışık'], sign: 'MARKANIZ',
    servicesEyebrow: 'İhtiyacınız', servicesTitle: 'Tabela aydınlatmasını yenileme seçenekleri',
    services: [
      {title: 'Eski lambaları LED ile değiştirmek', text: 'Mevcut tüplü aydınlatmanın LED’e dönüştürülüp dönüştürülemeyeceğini inceliyoruz. Neon için koruma, onarım ve LED alternatifini karşılaştırıyoruz.', alt: 'LED modülleri takılmış açık ışıklı kutu'},
      {title: 'Gövdeyi koruyarak aydınlatmayı yenilemek', text: 'Gövde ve ön yüz kullanılabilir durumdaysa modülleri, güç kaynaklarını ve kabloları mevcut yapıya uygun seçiyoruz.', alt: 'Işıklı tabelada kablolama çalışması'},
      {title: 'Karanlık bölgeleri ve ışık farklarını gidermek', text: 'Karanlık alanlar, görünür ışık noktaları veya renk farkları: nedeni inceliyor ve uygun düzenlemeyi belirliyoruz.', alt: 'Akşam bina cephesindeki ışıklı harfler'},
    ],
    decisionTitle: 'Onarım, modernizasyon veya değişim', processTitle: 'İlk fotoğraftan doğru ışığa.', requestHint: 'Başlangıç için genel fotoğraf, yakın çekim ve konum yeterli. Montaj yüksekliği ve istediğiniz sonuç da yardımcı olur.', faqIntro: 'Fikir uygulamaya geçmeden önce önemli sorular.',
  },
  pl: {
    demoHint: 'Wybierz etap, aby zobaczyć, co się zmienia.',
    title: 'Modernizacja LED reklam świetlnych',
    intro: 'Odnawiamy oświetlenie kasetonów i liter przestrzennych. Sprawdzamy, które elementy można zachować, a które wymagają wymiany.',
    photoAlt: 'Otwarty kaseton z modułami LED na elewacji o zmierzchu',
    demoEyebrow: 'Ta sama obudowa. Nowe możliwości.', demoTitle: 'Zmianę wewnątrz widać na zewnątrz.',
    demoIntro: 'Zobacz na przykładzie kasetonu, jak istniejąca konstrukcja może zyskać nowe oświetlenie.',
    demoNote: 'Ilustracja schematyczna. Efekt świetlny i konstrukcja zależą od konkretnego szyldu.',
    stages: ['Stan obecny', 'Technologia LED', 'Efekt świetlny'],
    stageTitles: ['Najpierw poznać. Potem zmieniać.', 'Liczy się współpraca elementów.', 'Spójny wygląd. Także wieczorem.'],
    stageTexts: ['Sprawdzamy obudowę, lico i mocowania. Sprawne części mogą pozostać. Starsze świetlówki oceniamy jako część całego układu.', 'Rozstaw modułów, zasilacz i okablowanie dobieramy do głębokości, formatu i lica. Więcej diod nie zawsze oznacza lepszy efekt.', 'Liczą się równomierne światło, właściwa barwa i czytelność. Gotowy efekt sprawdzamy na szyldzie.'],
    layers: ['Obudowa i mocowania', 'Moduły i zasilanie', 'Lico i efekt świetlny'], sign: 'TWOJA MARKA',
    servicesEyebrow: 'Twoje potrzeby', servicesTitle: 'Możliwości modernizacji oświetlenia',
    services: [
      {title: 'Wymienić stare źródła światła na LED', text: 'Sprawdzamy, czy dotychczasowe świetlówki można zastąpić modułami LED. W przypadku neonu porównujemy zachowanie, naprawę i alternatywę LED.', alt: 'Otwarty kaseton z zamontowanymi modułami LED'},
      {title: 'Odnowić oświetlenie, zachować obudowę', text: 'Jeśli obudowa i lico nadają się do dalszego użytku, dobieramy moduły, zasilacze i okablowanie do istniejącej konstrukcji.', alt: 'Praca przy okablowaniu reklamy świetlnej'},
      {title: 'Usunąć plamy i nierówne oświetlenie', text: 'Ciemne obszary, widoczne punkty świetlne lub różnice barwy: sprawdzamy przyczynę i dobieramy odpowiednie rozwiązanie.', alt: 'Świecące litery na elewacji budynku wieczorem'},
    ],
    decisionTitle: 'Naprawa, modernizacja lub wymiana', processTitle: 'Od pierwszego zdjęcia do odpowiedniego światła.', requestHint: 'Na początek: zdjęcie całości, zbliżenie i lokalizacja. Pomogą też wysokość montażu i opis oczekiwanego efektu.', faqIntro: 'Najważniejsze pytania przed modernizacją.',
  },
  ar: {
    demoHint: 'اختر مرحلة لترى ما الذي يتغير.',
    title: 'تحديث إضاءة اللوحات الإعلانية بتقنية LED',
    intro: 'نجدد إضاءة الصناديق والحروف البارزة المضيئة. نفحص الأجزاء التي يمكن الاحتفاظ بها وتلك التي تحتاج إلى استبدال.',
    photoAlt: 'صندوق إضاءة مفتوح بوحدات LED على واجهة عند الغروب',
    demoEyebrow: 'الهيكل نفسه. إمكانات جديدة.', demoTitle: 'التغيير في الداخل يظهر في الخارج.',
    demoIntro: 'اكتشف من خلال مثال صندوق مضيء كيف يمكن للهيكل الحالي أن يحصل على إضاءة جديدة.',
    demoNote: 'رسم توضيحي مبسط. يختلف تركيب اللوحة وتأثير الإضاءة حسب كل حالة.',
    stages: ['الحالة الحالية', 'تقنية LED', 'المظهر الضوئي'],
    stageTitles: ['نفهم أولاً. ثم نغيّر.', 'التوافق بين المكونات يصنع الفرق.', 'مظهر متناسق حتى بعد الغروب.'],
    stageTexts: ['نفحص الهيكل والواجهة والتثبيت. يمكن الاحتفاظ بالأجزاء الصالحة. نقيّم إضاءة الأنابيب القديمة ضمن النظام بالكامل.', 'نختار تباعد الوحدات ومزود الطاقة والأسلاك بما يلائم العمق والمقاس والواجهة. زيادة عدد وحدات LED ليست دائماً الحل.', 'نهتم بتوزيع الضوء ولونه ووضوح القراءة. نتحقق من النتيجة على اللوحة نفسها.'],
    layers: ['الهيكل والتثبيت', 'الوحدات والطاقة', 'الواجهة والإضاءة'], sign: 'علامتك التجارية',
    servicesEyebrow: 'ما تحتاجه', servicesTitle: 'خيارات تحديث إضاءة اللوحات',
    services: [
      {title: 'استبدال الإضاءة القديمة بتقنية LED', text: 'نفحص إمكانية تحويل إضاءة الأنابيب الحالية إلى LED. وبالنسبة إلى النيون، نقارن بين الإبقاء عليه وإصلاحه واستخدام بديل LED.', alt: 'صندوق إضاءة مفتوح بوحدات LED مركبة'},
      {title: 'تجديد الإضاءة مع الاحتفاظ بالهيكل', text: 'إذا كان الهيكل والواجهة صالحين للاستخدام، نختار الوحدات ومزودات الطاقة والأسلاك بما يناسب التركيب الحالي.', alt: 'عمل على أسلاك لوحة إعلانية مضيئة'},
      {title: 'معالجة البقع وتفاوت الإضاءة', text: 'مناطق داكنة أو نقاط ضوئية ظاهرة أو اختلاف في اللون: نفحص السبب ونحدد التعديل المناسب.', alt: 'حروف مضيئة على واجهة مبنى مساءً'},
    ],
    decisionTitle: 'الإصلاح أو التحديث أو الاستبدال', processTitle: 'من أول صورة إلى الإضاءة المناسبة.', requestHint: 'للبداية: صورة كاملة وصورة قريبة والموقع. يساعدنا أيضاً ارتفاع التركيب والنتيجة التي تريدها.', faqIntro: 'أهم الأسئلة قبل بدء التحديث.',
  },
};
export function getLedVisualCopy(locale: LedLocale) { return COPY[locale]; }
