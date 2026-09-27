type HomeWorkLocale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

type HomeWorkContent = {
  heading: string;
  title: string;
  description: string;
  beforeLabel: string;
  resultLabel: string;
  beforeAlt: string;
  resultAlt: string;
  linkLabel: string;
};

// Owner-provided case and photographs already published on the references page.
const HOME_WORK_CONTENT: Record<HomeWorkLocale, HomeWorkContent> = {
  de: {
    heading: 'Ein Beispiel aus unserer Arbeit',
    title: 'Fassadenbeschriftung für Restaurant Pasternak',
    description: 'Die bestehende Beschriftung der Restaurantfassade wurde im vertrauten Erscheinungsbild erneuert. Die neue Schrift wurde mit einer passgenauen Schablone vorbereitet und direkt auf die Fassade lackiert.',
    beforeLabel: 'Vorher',
    resultLabel: 'Ergebnis',
    beforeAlt: 'Fassadenbeschriftung von Restaurant Pasternak vor der Erneuerung',
    resultAlt: 'Fertig lackierte Fassadenbeschriftung von Restaurant Pasternak',
    linkLabel: 'Weitere Arbeiten ansehen',
  },
  en: {
    heading: 'An example of our work',
    title: 'Facade lettering for Restaurant Pasternak',
    description: 'The restaurant’s existing facade lettering was renewed while preserving its familiar appearance. The new lettering was prepared with a precise stencil and painted directly onto the facade.',
    beforeLabel: 'Before',
    resultLabel: 'Result',
    beforeAlt: 'Restaurant Pasternak facade lettering before renewal',
    resultAlt: 'Finished painted facade lettering at Restaurant Pasternak',
    linkLabel: 'View more work',
  },
  ru: {
    heading: 'Пример нашей работы',
    title: 'Фасадная надпись для ресторана Pasternak',
    description: 'Надпись на фасаде ресторана обновили, сохранив её привычный облик. Новую надпись подготовили с точным трафаретом, а затем нанесли краской непосредственно на фасад.',
    beforeLabel: 'До',
    resultLabel: 'Результат',
    beforeAlt: 'Фасадная надпись ресторана Pasternak до обновления',
    resultAlt: 'Готовая окрашенная фасадная надпись ресторана Pasternak',
    linkLabel: 'Посмотреть другие работы',
  },
  tr: {
    heading: 'Çalışmalarımızdan bir örnek',
    title: 'Restaurant Pasternak için cephe yazısı',
    description: 'Restoran cephesindeki mevcut yazı, alışılmış görünümü korunarak yenilendi. Yeni yazı hassas bir şablonla hazırlandı ve doğrudan cepheye boyandı.',
    beforeLabel: 'Önce',
    resultLabel: 'Sonuç',
    beforeAlt: 'Restaurant Pasternak cephe yazısı yenileme öncesinde',
    resultAlt: 'Restaurant Pasternak için tamamlanmış boyalı cephe yazısı',
    linkLabel: 'Diğer çalışmaları inceleyin',
  },
  pl: {
    heading: 'Przykład naszej pracy',
    title: 'Napis na fasadzie restauracji Pasternak',
    description: 'Istniejący napis na fasadzie restauracji odnowiono, zachowując jego dotychczasowy wygląd. Nowy napis przygotowano przy użyciu precyzyjnego szablonu i pomalowano bezpośrednio na fasadzie.',
    beforeLabel: 'Przed',
    resultLabel: 'Efekt',
    beforeAlt: 'Napis na fasadzie restauracji Pasternak przed odnowieniem',
    resultAlt: 'Gotowy malowany napis na fasadzie restauracji Pasternak',
    linkLabel: 'Zobacz inne realizacje',
  },
  ar: {
    heading: 'مثال من أعمالنا',
    title: 'كتابة الواجهة لمطعم Pasternak',
    description: 'جُددت الكتابة القائمة على واجهة المطعم مع الحفاظ على طابعها البصري المعتاد. جُهزت الكتابة الجديدة بقالب دقيق ثم طُليت مباشرة على الواجهة.',
    beforeLabel: 'قبل',
    resultLabel: 'النتيجة',
    beforeAlt: 'كتابة واجهة مطعم Pasternak قبل التجديد',
    resultAlt: 'كتابة واجهة مطعم Pasternak النهائية بعد الطلاء',
    linkLabel: 'شاهد المزيد من الأعمال',
  },
};

export function getHomeWorkContent(locale: string): HomeWorkContent {
  return HOME_WORK_CONTENT[locale as HomeWorkLocale] ?? HOME_WORK_CONTENT.de;
}
