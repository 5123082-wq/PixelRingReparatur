type HomeProcessLocale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

type HomeProcessContent = {
  title: string;
  intro: string;
  steps: { title: string; description: string }[];
  principles: { title: string; description: string }[];
};

const HOME_PROCESS_CONTENT: Record<HomeProcessLocale, HomeProcessContent> = {
  de: {
    title: 'So läuft Ihr Auftrag ab',
    intro: 'Von der ersten Beschreibung bis zur Ausführung bleiben die nächsten Schritte klar.',
    steps: [
      {
        title: 'Aufgabe beschreiben',
        description: 'Schildern Sie, was zu tun ist und wo sich die Anlage befindet. Fotos helfen uns bei der ersten Einschätzung.',
      },
      {
        title: 'Arbeiten abstimmen',
        description: 'Wir klären die offenen Fragen und stimmen Umfang, Zugang und Bedingungen mit Ihnen ab.',
      },
      {
        title: 'Auftrag ausführen',
        description: 'Unsere Fachleute führen die vereinbarten Arbeiten aus. Ergebnis und offene Punkte werden festgehalten.',
      },
    ],
    principles: [
      { title: 'Ein Ansprechpartner', description: 'PixelRing begleitet Ihre Anfrage und koordiniert die Arbeiten.' },
      { title: 'Abstimmung vor Beginn', description: 'Sie wissen, welche Arbeiten vereinbart sind.' },
      { title: 'Nachvollziehbares Ergebnis', description: 'Ausgeführte Arbeiten und offene Punkte bleiben nachvollziehbar.' },
    ],
  },
  en: {
    title: 'How your job moves forward',
    intro: 'From your first description to the work itself, each next step is clear.',
    steps: [
      {
        title: 'Describe the task',
        description: 'Tell us what needs doing and where the sign is located. Photos help us make an initial assessment.',
      },
      {
        title: 'Agree on the work',
        description: 'We clarify any questions and agree on the scope, access and conditions with you.',
      },
      {
        title: 'Carry out the job',
        description: 'Our specialists carry out the agreed work. We record the result and any outstanding issues.',
      },
    ],
    principles: [
      { title: 'One point of contact', description: 'PixelRing handles your request and coordinates the work.' },
      { title: 'Agreement before work begins', description: 'You know which work has been agreed.' },
      { title: 'A clear record of the result', description: 'Completed work and outstanding issues remain documented.' },
    ],
  },
  ru: {
    title: 'Как проходит работа',
    intro: 'От первого обращения до выполнения — на каждом этапе понятен следующий шаг.',
    steps: [
      {
        title: 'Опишите задачу',
        description: 'Расскажите, что нужно сделать и где находится вывеска. Фотографии помогут нам предварительно оценить задачу.',
      },
      {
        title: 'Согласуем работы',
        description: 'Уточним детали и согласуем с вами объём работ, доступ к объекту и условия.',
      },
      {
        title: 'Выполним заказ',
        description: 'Наши специалисты выполнят согласованные работы. Зафиксируем результат и оставшиеся вопросы.',
      },
    ],
    principles: [
      { title: 'Один контакт', description: 'PixelRing ведёт вашу заявку и координирует работы.' },
      { title: 'Согласование до начала', description: 'Вы знаете, какие работы согласованы.' },
      { title: 'Зафиксированный результат', description: 'Сохраняем сведения о выполненных работах и открытых вопросах.' },
    ],
  },
  tr: {
    title: 'İşiniz nasıl ilerler?',
    intro: 'İlk açıklamanızdan işin tamamlanmasına kadar bir sonraki adım bellidir.',
    steps: [
      {
        title: 'İhtiyacınızı anlatın',
        description: 'Ne yapılması gerektiğini ve tabelanın nerede olduğunu belirtin. Fotoğraflar ilk değerlendirmemize yardımcı olur.',
      },
      {
        title: 'Çalışmayı netleştirelim',
        description: 'Soruları açıklığa kavuşturur, işin kapsamını, erişimi ve koşulları sizinle birlikte kararlaştırırız.',
      },
      {
        title: 'İşi gerçekleştirelim',
        description: 'Uzmanlarımız kararlaştırılan işleri yapar. Sonucu ve açık kalan konuları kaydederiz.',
      },
    ],
    principles: [
      { title: 'Tek muhatap', description: 'PixelRing talebinizi takip eder ve çalışmaları koordine eder.' },
      { title: 'Başlamadan önce mutabakat', description: 'Hangi işlerin kararlaştırıldığını bilirsiniz.' },
      { title: 'Kayıt altına alınan sonuç', description: 'Yapılan işler ve açık kalan konular kayıtlı kalır.' },
    ],
  },
  pl: {
    title: 'Jak przebiega realizacja',
    intro: 'Od pierwszego opisu po wykonanie prac — każdy kolejny krok jest jasny.',
    steps: [
      {
        title: 'Opisz zadanie',
        description: 'Powiedz, co trzeba zrobić i gdzie znajduje się reklama. Zdjęcia pomogą nam we wstępnej ocenie.',
      },
      {
        title: 'Ustalimy zakres prac',
        description: 'Wyjaśnimy wątpliwości i uzgodnimy z Tobą zakres, dostęp do obiektu oraz warunki.',
      },
      {
        title: 'Wykonamy zlecenie',
        description: 'Nasi specjaliści wykonają uzgodnione prace. Odnotujemy rezultat oraz otwarte kwestie.',
      },
    ],
    principles: [
      { title: 'Jeden kontakt', description: 'PixelRing prowadzi Twoje zgłoszenie i koordynuje prace.' },
      { title: 'Uzgodnienia przed rozpoczęciem', description: 'Wiesz, jakie prace zostały ustalone.' },
      { title: 'Udokumentowany rezultat', description: 'Zachowujemy informacje o wykonanych pracach i otwartych kwestiach.' },
    ],
  },
  ar: {
    title: 'كيف ننجز طلبك',
    intro: 'من وصف المهمة حتى تنفيذ العمل، تبقى الخطوة التالية واضحة.',
    steps: [
      {
        title: 'صف المهمة',
        description: 'أخبرنا بما تحتاج إلى إنجازه ومكان اللوحة. تساعدنا الصور في التقييم الأولي.',
      },
      {
        title: 'نتفق على العمل',
        description: 'نوضح التفاصيل ونتفق معك على نطاق العمل وإمكانية الوصول إلى الموقع والشروط.',
      },
      {
        title: 'ننفذ الطلب',
        description: 'ينفذ متخصصونا الأعمال المتفق عليها. نسجل النتيجة وأي مسائل لم تُحسم بعد.',
      },
    ],
    principles: [
      { title: 'جهة اتصال واحدة', description: 'تتابع PixelRing طلبك وتنسق الأعمال.' },
      { title: 'الاتفاق قبل البدء', description: 'تكون الأعمال المتفق عليها واضحة لك.' },
      { title: 'نتيجة موثقة', description: 'نحتفظ بسجل للأعمال المنفذة والمسائل التي ما زالت مفتوحة.' },
    ],
  },
};

export function getHomeProcessContent(locale: string): HomeProcessContent {
  return HOME_PROCESS_CONTENT[locale as HomeProcessLocale] ?? HOME_PROCESS_CONTENT.de;
}
