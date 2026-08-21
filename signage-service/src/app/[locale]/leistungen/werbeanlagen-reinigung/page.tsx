import type { Metadata } from 'next';

import { Link } from '@/i18n/routing';
import SectionEyebrow from '@/components/common/SectionEyebrow';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import LeistungenCleaningProofStrip from '@/components/leistungen/LeistungenCleaningProofStrip';
import LeistungenCleaningWorkflow from '@/components/leistungen/LeistungenCleaningWorkflow';
import LeistungenRepairHeroSlider from '@/components/leistungen/LeistungenRepairHeroSlider';
import FAQSection from '@/components/sections/FAQSection';
import LeistungenFooterCTA from '@/components/sections/LeistungenFooterCTA';
import { getGlobalPageCmsContent } from '@/lib/cms/pages';
import { SITE_CONFIG } from '@/lib/site-config';
import { SITE_BASE_URL, buildLanguageAlternates, buildLocaleUrl, buildSiteUrl } from '@/lib/seo';

export const revalidate = 3600;

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';
type JsonLdObject = Record<string, unknown>;

type InfoCard = {
  title: string;
  text: string;
};

type CleaningCase = {
  id: string;
  tag: string;
  title: string;
  cardText: string;
  reassuringText: string;
  prefillMessage: string;
};

type LinkCard = InfoCard & {
  href: string;
  tag: string;
};

type CleaningPageContent = {
  serviceName: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubline: string;
  heroImageAlt: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroSecondaryHref?: string;
  recognitionEyebrow?: string;
  recognitionTitle?: string;
  recognitionIntro?: string;
  recognitionCards?: CleaningCase[];
  scopeEyebrow: string;
  scopeTitle: string;
  scopeIntro: string;
  scopeCards: InfoCard[];
  photoEyebrow?: string;
  photoTitle?: string;
  photoIntro?: string;
  photoItems?: string[];
  materialEyebrow: string;
  materialTitle: string;
  materialIntro: string;
  materialCards: InfoCard[];
  boundaryTitle: string;
  boundaryItems: string[];
  routingEyebrow: string;
  routingTitle: string;
  routingIntro: string;
  routingLinks: LinkCard[];
  faqTitle: string;
  faqs: Array<{ question: string; answer: string }>;
  offerCatalog: string[];
  finalHeadline: string;
  finalText: string;
  finalRequestTitle: string;
  finalRequestCta: string;
  requestPrefillMessage?: string;
  issueLinksEyebrow?: string;
  issueLinksTitle?: string;
  issueLinksIntro?: string;
  issueLinks?: LinkCard[];
};

const CLEANING_PAGE_PATH = '/leistungen/werbeanlagen-reinigung';
const CLEANING_HERO_IMAGE =
  '/images/leistungen/werbeanlagen-reinigung/werbeanlagen-reinigung-markise-service.webp';
const CLEANING_OG_IMAGE = buildSiteUrl(CLEANING_HERO_IMAGE);
const ORGANIZATION_SCHEMA_ID = `${SITE_BASE_URL}/#organization`;

const OPEN_GRAPH_LOCALE_BY_LOCALE: Record<Locale, string> = {
  de: 'de_DE',
  en: 'en_US',
  ru: 'ru_RU',
  tr: 'tr_TR',
  pl: 'pl_PL',
  ar: 'ar_AR',
};

const LANGUAGE_TAG_BY_LOCALE: Record<Locale, string> = {
  de: 'de-DE',
  en: 'en',
  ru: 'ru',
  tr: 'tr',
  pl: 'pl',
  ar: 'ar',
};

const BREADCRUMB_LABELS_BY_LOCALE: Record<Locale, { home: string; services: string }> = {
  de: { home: 'Home', services: 'Leistungen' },
  en: { home: 'Home', services: 'Services' },
  ru: { home: 'Главная', services: 'Услуги' },
  tr: { home: 'Ana sayfa', services: 'Hizmetler' },
  pl: { home: 'Strona główna', services: 'Usługi' },
  ar: { home: 'الرئيسية', services: 'الخدمات' },
};

const CLEANING_CASES_BY_LOCALE: Record<Locale, CleaningCase[]> = {
  de: [
    {
      id: 'awning',
      tag: 'Markise',
      title: 'Markise verschmutzt',
      cardText:
        'Flecken, Regenspuren oder Grünbelag lassen die Markise abgenutzt wirken.',
      reassuringText:
        'Ob sich Ihre Markise schonend reinigen lässt, hängt von Stoff, Druck und Zustand ab. Schicken Sie uns Fotos — wir prüfen, was realistisch machbar ist.',
      prefillMessage:
        'Meine Markise ist verschmutzt oder fleckig. Ich möchte wissen, ob eine Reinigung möglich ist.',
    },
    {
      id: 'lightbox',
      tag: 'Leuchtkasten',
      title: 'Leuchtkasten verschmutzt',
      cardText:
        'Staub, Belag und Laufspuren lassen Front und Rahmen stumpf wirken.',
      reassuringText:
        'Bei Leuchtkästen prüfen wir zuerst Front, Material und sichtbaren Zustand. Danach sagen wir, ob Reinigung ausreicht oder ob Reparatur geprüft werden sollte.',
      prefillMessage:
        'Mein Leuchtkasten sieht matt oder vergraut aus. Ich möchte wissen, ob eine Reinigung möglich ist.',
    },
    {
      id: 'letters',
      tag: 'Buchstaben',
      title: 'Profilbuchstaben verschmutzt',
      cardText:
        'Staub, Belag und Spuren von Vögeln sammeln sich auf Fronten, Kanten und Befestigungen.',
      reassuringText:
        'Bei Profilbuchstaben zählen nicht nur die sichtbaren Flächen, sondern auch Kanten, Befestigung und Licht. Wir prüfen per Foto, ob eine Außenreinigung reicht.',
      prefillMessage:
        'Meine Profilbuchstaben sind von außen verschmutzt. Ich möchte wissen, ob eine Reinigung möglich ist.',
    },
    {
      id: 'inside',
      tag: 'Innen',
      title: 'Schmutz innen im Leuchtkasten',
      cardText:
        'Dunkle Flecken, Insekten oder Wasserreste hinter der Front — das ist keine einfache Außenreinigung.',
      reassuringText:
        'Wenn Schmutz hinter der Front sichtbar ist, reicht einfaches Putzen meist nicht. Wir klären per Foto, ob geöffnet werden muss und welcher sichere nächste Schritt passt.',
      prefillMessage:
        'In meinem Leuchtkasten oder in den Buchstaben ist innen Schmutz sichtbar. Ich möchte wissen, was nötig ist.',
    },

    {
      id: 'custom',
      tag: 'Foto',
      title: 'Nicht sicher? Fotos senden',
      cardText:
        'Sie müssen den Reinigungsfall nicht technisch benennen. Sichere Fotos und wenige Worte reichen für die erste Einordnung.',
      reassuringText:
        'Beschreiben Sie einfach, was sichtbar stört. PixelRing prüft Fotos, Standort, Material und Zugang und schlägt den passenden nächsten Schritt vor.',
      prefillMessage:
        'Ich bin nicht sicher, welcher Fall passt. Hier sind Fotos und eine kurze Beschreibung.',
    },
  ],
  en: [
    {
      id: 'awning',
      tag: 'Awning',
      title: 'Awning is dirty',
      cardText:
        'Stains, rain streaks or green growth make the awning look worn.',
      reassuringText:
        'Whether your awning can be cleaned gently depends on fabric, print and condition. Send photos and we will check what is realistically possible.',
      prefillMessage:
        'My awning is dirty or stained. I want to know whether cleaning is possible.',
    },
    {
      id: 'lightbox',
      tag: 'Lightbox',
      title: 'Lightbox is dirty',
      cardText:
        'Dust, deposits and run marks make the face and frame look dull.',
      reassuringText:
        'For lightboxes, we first check the face, material and visible condition. Then we tell you whether cleaning is enough or repair should be checked.',
      prefillMessage:
        'My lightbox looks dull or grey. I want to know whether cleaning is possible.',
    },
    {
      id: 'letters',
      tag: 'Letters',
      title: 'Channel letters are dirty',
      cardText:
        'Dust, deposits and bird traces collect on faces, edges and mountings.',
      reassuringText:
        'For channel letters, not only visible faces matter, but also edges, mounting and lighting. We check by photo whether outside cleaning is enough.',
      prefillMessage:
        'My channel letters are dirty on the outside. I want to know whether cleaning is possible.',
    },
    {
      id: 'inside',
      tag: 'Inside',
      title: 'Dirt is inside the lightbox',
      cardText:
        'Dark spots, insects or water marks behind the face — this is not ordinary outside cleaning.',
      reassuringText:
        'When dirt is visible behind the face, simple wiping is usually not enough. We clarify by photo whether it needs to be opened and which safe next step fits.',
      prefillMessage:
        'There is visible dirt inside my lightbox or letters. I want to know what is needed.',
    },

    {
      id: 'custom',
      tag: 'Photo',
      title: 'Not sure? Send photos',
      cardText:
        'You do not need the technical term. Clear photos and a short description are enough for a first assessment.',
      reassuringText:
        'Simply describe what looks wrong. PixelRing checks photos, location, material and access, then suggests the right next step.',
      prefillMessage:
        'I am not sure which case fits. Here are photos and a short description.',
    },
  ],
  ru: [
    {
      id: 'awning',
      tag: 'Маркиза',
      title: 'Маркиза загрязнена',
      cardText:
        'Пятна, потёки или зелёный налёт делают маркизу неопрятной.',
      reassuringText:
        'Можно ли бережно очистить вашу маркизу, зависит от ткани, печати и состояния. Отправьте фото — мы проверим, что реально возможно.',
      prefillMessage:
        'Моя маркиза загрязнена или в пятнах. Я хочу узнать, возможна ли очистка.',
    },
    {
      id: 'lightbox',
      tag: 'Лайтбокс',
      title: 'Световой короб загрязнен',
      cardText:
        'Пыль, налёт и потёки делают фронт и рамку тусклыми.',
      reassuringText:
        'У световых коробов мы сначала проверяем фронт, материал и видимое состояние. Затем говорим, достаточно ли очистки или стоит проверить ремонт.',
      prefillMessage:
        'Мой световой короб выглядит матовым или посеревшим. Я хочу узнать, возможна ли очистка.',
    },
    {
      id: 'letters',
      tag: 'Буквы',
      title: 'Объемные буквы загрязнены',
      cardText:
        'Пыль, налёт и следы птиц скапливаются на лицевой части, кромках и креплениях.',
      reassuringText:
        'У объемных букв важны не только видимые поверхности, но и края, крепления и свет. Мы по фото проверим, достаточно ли внешней очистки.',
      prefillMessage:
        'Мои объемные буквы загрязнены снаружи. Я хочу узнать, возможна ли очистка.',
    },
    {
      id: 'inside',
      tag: 'Внутри',
      title: 'Грязь внутри светового короба',
      cardText:
        'Тёмные пятна, насекомые или следы воды за панелью — это не обычная наружная мойка.',
      reassuringText:
        'Если грязь видна за фронтальной частью, простой мойки обычно недостаточно. Мы по фото уточним, нужно ли открывать конструкцию и какой безопасный следующий шаг подходит.',
      prefillMessage:
        'В моем световом коробе или буквах видна внутренняя грязь. Я хочу узнать, что нужно сделать.',
    },

    {
      id: 'custom',
      tag: 'Фото',
      title: 'Не уверены? Отправьте фото',
      cardText:
        'Не нужно знать техническое название. Четких фото и короткого описания достаточно для первой оценки.',
      reassuringText:
        'Просто опишите, что визуально мешает. PixelRing проверит фото, адрес, материал и доступ, затем предложит следующий шаг.',
      prefillMessage:
        'Я не уверен, какой случай подходит. Вот фото и краткое описание.',
    },
  ],
  tr: [
    {
      id: 'awning',
      tag: 'Tente',
      title: 'Tente kirli',
      cardText:
        'Lekeler, yağmur izleri veya yeşil birikinti tenteyi yıpranmış gösterir.',
      reassuringText:
        'Tentenizin nazikçe temizlenip temizlenemeyeceği kumaşa, baskıya ve durumuna bağlıdır. Fotoğraf gönderin; neyin gerçekçi olduğunu kontrol ederiz.',
      prefillMessage:
        'Tentem kirli veya lekeli. Temizliğin mümkün olup olmadığını öğrenmek istiyorum.',
    },
    {
      id: 'lightbox',
      tag: 'Isikli kutu',
      title: 'Işıklı kutu kirli',
      cardText:
        'Toz, birikinti ve akıntı izleri ön yüzü ve çerçeveyi donuk gösterir.',
      reassuringText:
        'Işıklı kutularda önce ön yüzü, malzemeyi ve görünen durumu kontrol ederiz. Sonra temizliğin yeterli olup olmadığını veya onarım kontrolü gerekip gerekmediğini söyleriz.',
      prefillMessage:
        'Işıklı kutum mat veya gri görünüyor. Temizliğin mümkün olup olmadığını öğrenmek istiyorum.',
    },
    {
      id: 'letters',
      tag: 'Harfler',
      title: 'Kutu harfler kirli',
      cardText:
        'Toz, birikinti ve kuş izleri ön yüzlerde, kenarlarda ve bağlantılarda toplanır.',
      reassuringText:
        'Kutu harflerde sadece görünen yüzeyler değil, kenarlar, montaj ve aydınlatma da önemlidir. Fotoğrafa bakarak dış temizliğin yeterli olup olmadığını kontrol ederiz.',
      prefillMessage:
        'Kutu harflerim dışarıdan kirli. Temizliğin mümkün olup olmadığını öğrenmek istiyorum.',
    },
    {
      id: 'inside',
      tag: 'Ic kisim',
      title: 'Kir isikli kutunun icinde',
      cardText:
        'Ön panelin arkasında koyu lekeler, böcekler veya su izleri — bu sıradan dış temizlik değildir.',
      reassuringText:
        'Ön yüzün arkasında kir görünüyorsa basit silme çoğu zaman yeterli olmaz. Fotoğrafla açmak gerekip gerekmediğini ve güvenli sonraki adımı netleştiririz.',
      prefillMessage:
        'Işıklı kutumun veya harflerin içinde kir görünüyor. Ne yapılması gerektiğini öğrenmek istiyorum.',
    },

    {
      id: 'custom',
      tag: 'Foto',
      title: 'Emin degil misiniz? Foto gonderin',
      cardText:
        'Teknik adi bilmeniz gerekmez. Net fotograflar ve kisa bir aciklama ilk degerlendirme icin yeterlidir.',
      reassuringText:
        'Sadece gorunumde neyin rahatsiz ettigini anlatin. PixelRing fotograflari, konumu, malzemeyi ve erisimi kontrol eder, sonra dogru sonraki adimi onerir.',
      prefillMessage:
        'Hangi durumun uygun olduğundan emin değilim. İşte fotoğraflar ve kısa bir açıklama.',
    },
  ],
  pl: [
    {
      id: 'awning',
      tag: 'Markiza',
      title: 'Markiza zabrudzona',
      cardText:
        'Plamy, zacieki lub zielony nalot sprawiają, że markiza wygląda na zużytą.',
      reassuringText:
        'To, czy markizę da się delikatnie wyczyścić, zależy od tkaniny, nadruku i stanu. Wyślij zdjęcia, a sprawdzimy, co jest realnie możliwe.',
      prefillMessage:
        'Moja markiza jest zabrudzona lub poplamiona. Chcę wiedzieć, czy czyszczenie jest możliwe.',
    },
    {
      id: 'lightbox',
      tag: 'Kaseton',
      title: 'Kaseton zabrudzony',
      cardText:
        'Kurz, osad i zacieki sprawiają, że lico i rama wyglądają matowo.',
      reassuringText:
        'Przy kasetonach najpierw sprawdzamy lico, materiał i widoczny stan. Potem mówimy, czy czyszczenie wystarczy, czy warto sprawdzić naprawę.',
      prefillMessage:
        'Mój kaseton wygląda matowo lub szaro. Chcę wiedzieć, czy czyszczenie jest możliwe.',
    },
    {
      id: 'letters',
      tag: 'Litery',
      title: 'Litery przestrzenne zabrudzone',
      cardText:
        'Kurz, osad i ślady ptaków zbierają się na licach, krawędziach i mocowaniach.',
      reassuringText:
        'Przy literach przestrzennych liczą się nie tylko widoczne powierzchnie, ale też krawędzie, mocowanie i światło. Ze zdjęć sprawdzimy, czy wystarczy czyszczenie zewnętrzne.',
      prefillMessage:
        'Moje litery przestrzenne są zabrudzone z zewnątrz. Chcę wiedzieć, czy czyszczenie jest możliwe.',
    },
    {
      id: 'inside',
      tag: 'Wewnątrz',
      title: 'Brud jest wewnątrz kasetonu',
      cardText:
        'Ciemne plamy, owady lub ślady wody za panelem — to nie jest zwykłe czyszczenie zewnętrzne.',
      reassuringText:
        'Jeśli brud widać za panelem, zwykłe mycie najczęściej nie wystarczy. Ze zdjęć ustalimy, czy trzeba otwierać konstrukcję i jaki bezpieczny następny krok pasuje.',
      prefillMessage:
        'W moim kasetonie lub literach widać brud wewnątrz. Chcę wiedzieć, co będzie potrzebne.',
    },

    {
      id: 'custom',
      tag: 'Foto',
      title: 'Nie wiesz? Wyślij zdjęcia',
      cardText:
        'Nie musisz znać technicznej nazwy. Wyraźne zdjęcia i krótki opis wystarczą do pierwszej oceny.',
      reassuringText:
        'Po prostu opisz, co wizualnie przeszkadza. PixelRing sprawdzi zdjęcia, lokalizację, materiał i dostęp, a potem zaproponuje właściwy następny krok.',
      prefillMessage:
        'Nie wiem, który przypadek pasuje. Oto zdjęcia i krótki opis.',
    },
  ],
  ar: [
    {
      id: 'awning',
      tag: 'مظلة',
      title: 'المظلة متسخة',
      cardText:
        'البقع وآثار المطر والطحالب تجعل المظلة تبدو بالية.',
      reassuringText:
        'إمكانية تنظيف المظلة بلطف تعتمد على القماش والطباعة والحالة. أرسل الصور، وسنراجع ما هو ممكن بشكل واقعي.',
      prefillMessage:
        'مظلتي متسخة أو عليها بقع. أريد معرفة ما إذا كان التنظيف ممكنا.',
    },
    {
      id: 'lightbox',
      tag: 'صندوق مضيء',
      title: 'الصندوق المضيء متسخ',
      cardText:
        'الغبار والترسبات وآثار السيلان تجعل الواجهة والإطار يبدوان باهتين.',
      reassuringText:
        'في الصناديق المضيئة نراجع أولا الواجهة والمادة والحالة الظاهرة. بعدها نوضح هل يكفي التنظيف أم يجب فحص الإصلاح.',
      prefillMessage:
        'الصندوق المضيء لدي يبدو باهتا أو رماديا. أريد معرفة ما إذا كان التنظيف ممكنا.',
    },
    {
      id: 'letters',
      tag: 'حروف',
      title: 'الحروف البارزة متسخة',
      cardText:
        'يتجمع الغبار والترسبات وآثار الطيور على الواجهات والحواف والتثبيتات.',
      reassuringText:
        'في الحروف البارزة لا تهم الأسطح المرئية فقط، بل الحواف والتثبيت والإضاءة أيضا. نراجع الصور لمعرفة هل يكفي التنظيف الخارجي.',
      prefillMessage:
        'الحروف البارزة لدي متسخة من الخارج. أريد معرفة ما إذا كان التنظيف ممكنا.',
    },
    {
      id: 'inside',
      tag: 'داخلي',
      title: 'الأوساخ داخل الصندوق المضيء',
      cardText:
        'بقع داكنة أو حشرات أو آثار مياه خلف الواجهة — هذا ليس تنظيفا خارجيا عاديا.',
      reassuringText:
        'إذا ظهرت الأوساخ خلف الواجهة، فالمسح البسيط غالبا لا يكفي. نوضح من الصور هل يجب فتح التركيب وما الخطوة الآمنة التالية.',
      prefillMessage:
        'تظهر أوساخ داخل الصندوق المضيء أو الحروف لدي. أريد معرفة ما المطلوب.',
    },

    {
      id: 'custom',
      tag: 'صور',
      title: 'لست متأكدا؟ أرسل الصور',
      cardText:
        'لا تحتاج إلى معرفة الاسم التقني. تكفي الصور الواضحة ووصف قصير للتقييم الأول.',
      reassuringText:
        'صف فقط ما يزعجك بصريا. تراجع PixelRing الصور والموقع والمادة والوصول، ثم تقترح الخطوة التالية المناسبة.',
      prefillMessage:
        'لست متأكدا أي حالة تناسب. هذه صور ووصف قصير.',
    },
  ],
};

const ISSUE_LINKS_BY_LOCALE: Record<Locale, LinkCard[]> = {
  de: [
    { title: 'Folie löst sich', text: 'Wenn Schmutz alte Folienkanten, Blasen oder UV-Schäden sichtbar macht.', href: '/probleme-loesungen/folie-loest-sich', tag: 'Folie' },
    { title: 'Nach Regen schaltet die Anlage ab', text: 'Wenn Feuchtigkeit oder Reinigung zeigt, dass die Leuchtwerbung technisch geprüft werden muss.', href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab', tag: 'Feuchtigkeit' },
    { title: 'Buchstabe leuchtet nicht', text: 'Wenn bei der Sichtprüfung einzelne Buchstaben dunkel bleiben oder ungleichmäßig wirken.', href: '/probleme-loesungen/buchstabe-leuchtet-nicht', tag: 'Licht' },
    { title: 'Werbeanlage flackert', text: 'Wenn die Anlage nicht nur verschmutzt ist, sondern Lichttechnik oder Netzteil auffällig reagieren.', href: '/probleme-loesungen/werbeanlage-flackert', tag: 'Diagnose' },
  ],
  en: [
    { title: 'Film is peeling', text: 'When cleaning reveals aged film edges, bubbles or UV damage.', href: '/probleme-loesungen/folie-loest-sich', tag: 'Film' },
    { title: 'Sign fails after rain', text: 'When moisture or cleaning shows that illuminated signage needs technical checks.', href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab', tag: 'Moisture' },
    { title: 'One letter is dark', text: 'When individual letters remain dark or uneven during visual inspection.', href: '/probleme-loesungen/buchstabe-leuchtet-nicht', tag: 'Light' },
    { title: 'Signage flickers', text: 'When the issue is not only dirt, but lighting technology or a power supply reacts irregularly.', href: '/probleme-loesungen/werbeanlage-flackert', tag: 'Diagnosis' },
  ],
  ru: [
    { title: 'Пленка отклеивается', text: 'Если после очистки видны старые края пленки, пузыри или выгорание.', href: '/probleme-loesungen/folie-loest-sich', tag: 'Пленка' },
    { title: 'После дождя вывеска отключается', text: 'Если влага или очистка показывает, что световую рекламу нужно проверить технически.', href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab', tag: 'Влага' },
    { title: 'Буква не светится', text: 'Если при визуальной проверке отдельные буквы остаются темными или светят неравномерно.', href: '/probleme-loesungen/buchstabe-leuchtet-nicht', tag: 'Свет' },
    { title: 'Вывеска мигает', text: 'Если проблема не только в грязи, а в подсветке или блоке питания.', href: '/probleme-loesungen/werbeanlage-flackert', tag: 'Диагностика' },
  ],
  tr: [
    { title: 'Folyo ayriliyor', text: 'Temizlik sirasinda eski folyo kenarlari, kabarciklar veya UV hasari gorunur hale gelirse.', href: '/probleme-loesungen/folie-loest-sich', tag: 'Folyo' },
    { title: 'Tabela yagmurdan sonra kapanir', text: 'Nem veya temizlik, isikli reklam icin teknik kontrol gerektigini gosterirse.', href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab', tag: 'Nem' },
    { title: 'Bir harf yanmiyor', text: 'Gorsel kontrolde bazi harfler karanlik kalir veya duzensiz gorunurse.', href: '/probleme-loesungen/buchstabe-leuchtet-nicht', tag: 'Isik' },
    { title: 'Tabela titriyor', text: 'Sorun sadece kir degil, aydinlatma teknolojisi veya guc kaynagi tepkisi ise.', href: '/probleme-loesungen', tag: 'Kontrol' },
  ],
  pl: [
    { title: 'Folia odchodzi', text: 'Gdy czyszczenie ujawnia stare krawędzie folii, pęcherze albo uszkodzenia UV.', href: '/probleme-loesungen/folie-loest-sich', tag: 'Folia' },
    { title: 'Reklama wyłącza się po deszczu', text: 'Gdy wilgoć lub czyszczenie pokazuje, że reklama świetlna wymaga kontroli technicznej.', href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab', tag: 'Wilgoć' },
    { title: 'Litera nie świeci', text: 'Gdy podczas kontroli pojedyncze litery pozostają ciemne albo świecą nierówno.', href: '/probleme-loesungen/buchstabe-leuchtet-nicht', tag: 'Światło' },
    { title: 'Reklama miga', text: 'Gdy problemem nie jest tylko brud, ale oświetlenie lub zasilacz reaguje nieregularnie.', href: '/probleme-loesungen', tag: 'Diagnoza' },
  ],
  ar: [
    { title: 'الفيلم يتقشر', text: 'عندما يكشف التنظيف حواف فيلم قديمة أو فقاعات أو تلفا من الشمس.', href: '/probleme-loesungen/folie-loest-sich', tag: 'فيلم' },
    { title: 'اللوحة تتوقف بعد المطر', text: 'عندما تشير الرطوبة أو التنظيف إلى أن الإعلان المضيء يحتاج فحصا تقنيا.', href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab', tag: 'رطوبة' },
    { title: 'حرف لا يضيء', text: 'عندما تبقى بعض الحروف مظلمة أو غير متساوية أثناء الفحص البصري.', href: '/probleme-loesungen/buchstabe-leuchtet-nicht', tag: 'إضاءة' },
    { title: 'اللوحة تومض', text: 'عندما لا تكون المشكلة مجرد أوساخ بل في الإضاءة أو مزود الطاقة.', href: '/probleme-loesungen', tag: 'تشخيص' },
  ],
};

const RECOGNITION_COPY_BY_LOCALE: Record<Locale, { title: string; intro: string }> = {
  de: {
    title: 'Welcher Reinigungsfall passt zu Ihrem Standort?',
    intro:
      'Ob Laden, Praxis, Gastronomie, Filiale oder Gewerbestandort: Meist ist zuerst sichtbar, was stört. Wählen Sie den Fall, der Ihrer Werbeanlage am nächsten kommt, und senden Sie Fotos für die erste Einschätzung.',
  },
  en: {
    title: 'Which cleaning case fits your site?',
    intro:
      'Whether it is a shop, practice, restaurant, branch or commercial site: the first thing is usually what looks wrong. Choose the case closest to your signage and send photos for the first assessment.',
  },
  ru: {
    title: 'Какой случай очистки подходит вашему объекту?',
    intro:
      'Магазин, практика, ресторан, филиал или коммерческий объект: чаще всего сначала видно, что именно мешает. Выберите ближайший случай и отправьте фото для первой оценки.',
  },
  tr: {
    title: 'Hangi temizlik durumu konumunuza uygun?',
    intro:
      'Magaza, muayenehane, restoran, sube veya ticari alan: genellikle once gorunumde neyin rahatsiz ettigi fark edilir. Tabelaniza en yakin durumu secin ve ilk degerlendirme icin fotograflari gonderin.',
  },
  pl: {
    title: 'Który przypadek czyszczenia pasuje do Twojej lokalizacji?',
    intro:
      'Sklep, gabinet, gastronomia, oddział lub obiekt firmowy: najczęściej najpierw widać, co przeszkadza. Wybierz przypadek najbliższy Twojej reklamie i wyślij zdjęcia do pierwszej oceny.',
  },
  ar: {
    title: 'أي حالة تنظيف تناسب موقعك؟',
    intro:
      'سواء كان متجرا أو عيادة أو مطعما أو فرعا أو موقعا تجاريا: غالبا ما يظهر أولا ما يزعج بصريا. اختر الحالة الأقرب لإعلانك وأرسل الصور للتقييم الأول.',
  },
};

const ISSUE_LINKS_COPY_BY_LOCALE: Record<Locale, { eyebrow: string; title: string; intro: string }> = {
  de: {
    eyebrow: 'Nach der Sichtprüfung',
    title: 'Was hinter Verschmutzung sichtbar werden kann',
    intro:
      'Reinigung zeigt manchmal, dass nicht nur Schmutz stört. Diese Problemseiten helfen, sichtbare Folien-, Feuchtigkeits- oder Lichtthemen richtig einzuordnen.',
  },
  en: {
    eyebrow: 'After visual inspection',
    title: 'What can become visible behind dirt',
    intro:
      'Cleaning sometimes shows that dirt is not the only issue. These problem pages help classify visible film, moisture or lighting topics correctly.',
  },
  ru: {
    eyebrow: 'После визуальной проверки',
    title: 'Что может стать видно за загрязнением',
    intro:
      'Иногда очистка показывает, что мешает не только грязь. Эти страницы помогают правильно отнести проблемы пленки, влаги или подсветки.',
  },
  tr: {
    eyebrow: 'Gorsel kontrolden sonra',
    title: 'Kir arkasinda ne gorunur hale gelebilir',
    intro:
      'Temizlik bazen sorunun sadece kir olmadigini gosterir. Bu problem sayfalari folyo, nem veya aydinlatma konularini dogru siniflandirmaya yardim eder.',
  },
  pl: {
    eyebrow: 'Po kontroli wizualnej',
    title: 'Co może stać się widoczne pod zabrudzeniem',
    intro:
      'Czyszczenie czasem pokazuje, że problemem nie jest tylko brud. Te strony pomagają właściwie ocenić folię, wilgoć albo oświetlenie.',
  },
  ar: {
    eyebrow: 'بعد الفحص البصري',
    title: 'ما الذي قد يظهر خلف الأوساخ',
    intro:
      'قد يوضح التنظيف أحيانا أن الأوساخ ليست المشكلة الوحيدة. تساعد هذه الصفحات على تصنيف مشاكل الفيلم أو الرطوبة أو الإضاءة بشكل صحيح.',
  },
};

const REQUEST_PREFILL_BY_LOCALE: Record<Locale, string> = {
  de:
    'Reinigungsanfrage: Bitte prüfen Sie Fotos und Standort für Werbeanlagen- oder Markisenreinigung in Berlin und Brandenburg. Objekt, Material, Zugang und sichtbare Schäden sollen eingeordnet werden.',
  en:
    'Cleaning request: please review photos and location for signage or awning cleaning in Berlin and Brandenburg. Object, material, access and visible damage should be assessed.',
  ru:
    'Заявка на очистку: пожалуйста, оцените фото и адрес для очистки вывески или маркизы в Берлине и Бранденбурге. Нужно определить объект, материал, доступ и видимые повреждения.',
  tr:
    'Temizlik talebi: Berlin ve Brandenburg icin tabela veya tente temizligi fotograflari ve konumu degerlendirilmeli. Nesne, malzeme, erisim ve gorunur hasar siniflandirilmali.',
  pl:
    'Zapytanie o czyszczenie: proszę ocenić zdjęcia i lokalizację dla czyszczenia reklamy lub markizy w Berlinie i Brandenburgii. Należy określić obiekt, materiał, dostęp i widoczne uszkodzenia.',
  ar:
    'طلب تنظيف: يرجى مراجعة الصور والموقع لتنظيف لافتة أو مظلة في برلين وبراندنبورغ. يجب تقييم العنصر والمادة وإمكانية الوصول والأضرار المرئية.',
};

const PHOTO_ASSESSMENT_COPY_BY_LOCALE: Record<
  Locale,
  { eyebrow: string; title: string; intro: string; items: string[] }
> = {
  de: {
    eyebrow: 'Foto-Check',
    title: 'Fotos reichen oft für die erste Einschätzung',
    intro:
      'Für den ersten Schritt ist in vielen Fällen noch kein Vor-Ort-Termin nötig. Gute Fotos helfen, Reinigungsumfang, Materialrisiken und Zugang realistisch einzuordnen.',
    items: [
      'Gesamtansicht der Geschäftsfront',
      'Nahaufnahme der verschmutzten Fläche',
      'Foto von Markise, Schild, Leuchtkasten oder Buchstaben',
      'Standort in Berlin oder Brandenburg',
      'Ungefähre Breite, Höhe oder Etagenlage',
      'Hinweis, ob Leiter, Bühne oder Zugangstechnik nötig sein könnte',
      'Kurze Info zu gewünschtem Zeitraum oder Öffnungszeiten',
    ],
  },
  en: {
    eyebrow: 'Photo check',
    title: 'Photos are often enough for the first assessment',
    intro:
      'In many cases, the first step does not require an on-site appointment. Good photos help classify cleaning scope, material risks and access realistically.',
    items: [
      'Full view of the storefront',
      'Close-up of the dirty surface',
      'Photo of awning, sign, lightbox or letters',
      'Location in Berlin or Brandenburg',
      'Approximate width, height or floor level',
      'Note whether ladder, lift or access equipment may be needed',
      'Short note about preferred timing or opening hours',
    ],
  },
  ru: {
    eyebrow: 'Проверка по фото',
    title: 'Для первой оценки часто достаточно фото',
    intro:
      'Во многих случаях для первого шага не нужен выезд. Хорошие фото помогают оценить объем очистки, риски материала и доступ.',
    items: [
      'Общий вид фасада',
      'Крупный план загрязненной поверхности',
      'Фото маркизы, вывески, светового короба или букв',
      'Адрес в Берлине или Бранденбурге',
      'Примерная ширина, высота или этаж',
      'Информация, может ли понадобиться лестница, подъемник или доступная техника',
      'Короткая информация о желаемом сроке или часах работы',
    ],
  },
  tr: {
    eyebrow: 'Foto kontrolü',
    title: 'İlk değerlendirme için fotoğraflar çoğu zaman yeterlidir',
    intro:
      'Birçok durumda ilk adım için yerinde randevu gerekmez. İyi fotoğraflar temizlik kapsamını, malzeme risklerini ve erişimi gerçekçi sınıflandırmaya yardımcı olur.',
    items: [
      'İş yeri cephesinin genel görünümü',
      'Kirli yüzeyin yakın çekimi',
      'Tente, tabela, ışıklı kutu veya harf fotoğrafı',
      'Berlin veya Brandenburg konumu',
      'Yaklaşık genişlik, yükseklik veya kat seviyesi',
      'Merdiven, platform veya erişim ekipmanı gerekip gerekmediği',
      'İstenen zaman aralığı veya çalışma saatleri hakkında kısa bilgi',
    ],
  },
  pl: {
    eyebrow: 'Ocena ze zdjęć',
    title: 'Zdjęcia często wystarczą do pierwszej oceny',
    intro:
      'W wielu przypadkach na pierwszym etapie nie jest potrzebna wizyta na miejscu. Dobre zdjęcia pomagają realnie ocenić zakres czyszczenia, ryzyka materiału i dostęp.',
    items: [
      'Ogólny widok frontu lokalu',
      'Zbliżenie zabrudzonej powierzchni',
      'Zdjęcie markizy, szyldu, kasetonu lub liter',
      'Lokalizacja w Berlinie lub Brandenburgii',
      'Przybliżona szerokość, wysokość lub piętro',
      'Informacja, czy może być potrzebna drabina, podnośnik lub technika dostępu',
      'Krótka informacja o preferowanym terminie lub godzinach otwarcia',
    ],
  },
  ar: {
    eyebrow: 'فحص بالصور',
    title: 'غالبا تكفي الصور للتقييم الأول',
    intro:
      'في كثير من الحالات لا تكون زيارة الموقع ضرورية في الخطوة الأولى. تساعد الصور الجيدة على تقدير نطاق التنظيف ومخاطر المادة وإمكانية الوصول بشكل واقعي.',
    items: [
      'صورة عامة لواجهة النشاط التجاري',
      'صورة قريبة للسطح المتسخ',
      'صورة للمظلة أو اللافتة أو الصندوق المضيء أو الحروف',
      'الموقع في برلين أو براندنبورغ',
      'العرض أو الارتفاع أو الطابق التقريبي',
      'ملاحظة إذا كانت هناك حاجة إلى سلم أو منصة أو معدات وصول',
      'معلومة قصيرة عن الوقت المطلوب أو ساعات العمل',
    ],
  },
};

const CONTENT: Record<Locale, CleaningPageContent> = {
  de: {
    serviceName: 'Werbeanlagen-Reinigung',
    metaTitle: 'Werbeanlagen-Reinigung Berlin-Brandenburg | PixelRing',
    metaDescription:
      'Werbeanlagenreinigung und Markisenreinigung in Berlin-Brandenburg: PixelRing reinigt Schilder, Leuchtkästen, Profilbuchstaben und Außenwerbung nach Foto-Check.',
    heroTitle: 'Werbeanlagen reinigen lassen',
    heroSubline:
      'PixelRing reinigt Schilder, Leuchtkästen und Außenwerbung an Geschäftsfronten in Berlin & Brandenburg. Wir prüfen vorab Fotos, Material und Zugang für eine materialschonende Reinigung oder die passende Reparatur-Empfehlung.',
    heroImageAlt:
      'Beispielhafte Darstellung eines PixelRing Teams bei der Reinigung einer blauen Markise an einer Geschäftsfront',
    heroPrimaryCta: 'Reinigung anfragen',
    heroSecondaryCta: 'Welche Fotos helfen?',
    heroSecondaryHref: '#cleaning-photos',
    recognitionEyebrow: 'Reinigungsfall erkennen',
    recognitionTitle: 'Welcher Reinigungsfall passt zu Ihrem Standort?',
    recognitionIntro:
      'Ob Laden, Praxis, Gastronomie, Filiale oder Gewerbestandort: Meist ist zuerst sichtbar, was stört. Wählen Sie den Fall, der Ihrer Werbeanlage am nächsten kommt, und senden Sie Fotos für die erste Einschätzung.',
    recognitionCards: [
      {
        id: 'awning',
        tag: 'Markise',
        title: 'Markise verschmutzt',
        cardText:
          'Flecken, Regenspuren oder Grünbelag lassen die Markise abgenutzt wirken.',
        reassuringText:
          'Ob sich Ihre Markise schonend reinigen lässt, hängt von Stoff, Druck und Zustand ab. Schicken Sie uns Fotos — wir prüfen, was realistisch machbar ist.',
        prefillMessage:
          'Meine Markise ist verschmutzt oder fleckig. Ich möchte wissen, ob eine Reinigung möglich ist.',
      },
      {
        id: 'lightbox',
        tag: 'Leuchtkasten',
        title: 'Leuchtkasten verschmutzt',
        cardText:
          'Staub, Belag und Laufspuren lassen Front und Rahmen stumpf wirken.',
        reassuringText:
          'Bei Leuchtkästen prüfen wir zuerst Front, Material und sichtbaren Zustand. Danach sagen wir, ob Reinigung ausreicht oder ob Reparatur geprüft werden sollte.',
        prefillMessage:
          'Mein Leuchtkasten sieht matt oder vergraut aus. Ich möchte wissen, ob eine Reinigung möglich ist.',
      },
      {
        id: 'letters',
        tag: 'Buchstaben',
        title: 'Profilbuchstaben verschmutzt',
        cardText:
          'Staub, Belag und Spuren von Vögeln sammeln sich auf Fronten, Kanten und Befestigungen.',
        reassuringText:
          'Bei Profilbuchstaben zählen nicht nur die sichtbaren Flächen, sondern auch Kanten, Befestigung und Licht. Wir prüfen per Foto, ob eine Außenreinigung reicht.',
        prefillMessage:
          'Meine Profilbuchstaben sind von außen verschmutzt. Ich möchte wissen, ob eine Reinigung möglich ist.',
      },
      {
        id: 'inside',
        tag: 'Innen',
        title: 'Schmutz innen im Leuchtkasten',
        cardText:
          'Dunkle Flecken, Insekten oder Wasserreste hinter der Front — das ist keine einfache Außenreinigung.',
        reassuringText:
          'Wenn Schmutz hinter der Front sichtbar ist, reicht einfaches Putzen meist nicht. Wir klären per Foto, ob geöffnet werden muss und welcher sichere nächste Schritt passt.',
        prefillMessage:
          'In meinem Leuchtkasten oder in den Buchstaben ist innen Schmutz sichtbar. Ich möchte wissen, was nötig ist.',
      },

      {
        id: 'custom',
        tag: 'Foto',
        title: 'Nicht sicher? Fotos senden',
        cardText:
          'Sie müssen den Reinigungsfall nicht technisch benennen. Sichere Fotos und wenige Worte reichen für die erste Einordnung.',
        reassuringText:
          'Beschreiben Sie einfach, was sichtbar stört. PixelRing prüft Fotos, Standort, Material und Zugang und schlägt den passenden nächsten Schritt vor.',
        prefillMessage:
          'Ich bin nicht sicher, welcher Fall passt. Hier sind Fotos und eine kurze Beschreibung.',
      },
    ],
    scopeEyebrow: 'Reinigung & Pflege',
    scopeTitle: 'Was PixelRing reinigen und prüfen kann',
    scopeIntro:
      'PixelRing kann Reinigung und Pflege rund um gewerbliche Außenwerbung in Berlin & Brandenburg einordnen: Leuchtkästen, Schilder, Profilbuchstaben, Folienflächen, Glasbeschriftung, Markisen und angrenzende sichtbare Bereiche. Dabei geht es nicht nur um Sauberkeit, sondern auch um Material, Alterung, Befestigung, Zugang und mögliche Folgeschäden.',
    scopeCards: [
      {
        title: 'Leuchtkästen und Schilder',
        text: 'Außenflächen, Fronten, Rahmen und sichtbare Kanten werden materialschonend gereinigt, damit Beschriftung und Lichtwirkung wieder gepflegter erscheinen.',
      },
      {
        title: 'Folien, Beschriftung und Glasflächen',
        text: 'Verschmutzte Schaufensterbeschriftung, Folienflächen und Glasbereiche werden vorsichtig behandelt, ohne lockere oder gealterte Folie als repariert darzustellen.',
      },
      {
        title: 'Markisen und textile Außenwerbung',
        text: 'Staub, Belag und sichtbare Umweltrückstände können bewertet und gereinigt werden, soweit Material, Zugang und Zustand dafür geeignet sind.',
      },
      {
        title: 'Regelmäßige Pflege von Standorten',
        text: 'Für Filialen, Praxen, Gastronomie oder Ladenflächen kann Reinigung als wiederkehrender Servicepunkt mit Sichtkontrolle kombiniert werden.',
      },
    ],
    photoEyebrow: 'Foto-Check',
    photoTitle: 'Fotos reichen oft für die erste Einschätzung',
    photoIntro:
      'Für den ersten Schritt ist in vielen Fällen noch kein Vor-Ort-Termin nötig. Gute Fotos helfen, Reinigungsumfang, Materialrisiken und Zugang realistisch einzuordnen.',
    photoItems: [
      'Gesamtansicht der Geschäftsfront',
      'Nahaufnahme der verschmutzten Fläche',
      'Foto von Markise, Schild, Leuchtkasten oder Buchstaben',
      'Standort in Berlin oder Brandenburg',
      'Ungefähre Breite, Höhe oder Etagenlage',
      'Hinweis, ob Leiter, Bühne oder Zugangstechnik nötig sein könnte',
      'Kurze Info zu gewünschtem Zeitraum oder Öffnungszeiten',
    ],
    materialEyebrow: 'Methode & Grenzen',
    materialTitle: 'Was Reinigung leisten kann - und was nicht',
    materialIntro:
      'Reinigung kann Schmutz, Beläge und sichtbare Rückstände reduzieren und die Werbeanlage gepflegter erscheinen lassen. Sie ersetzt aber keine Reparatur, keine neue Folie, keine elektrische Instandsetzung und keine Garantie gegen Ausbleichen, Risse, gelöste Kanten oder Materialalterung.',
    materialCards: [
      {
        title: 'Acryl, Aluverbund und lackierte Flächen',
        text: 'Oberflächen werden nicht aggressiv behandelt. Vergilbung, tiefe Kratzer oder Materialbrüche verschwinden durch Reinigung nicht automatisch.',
      },
      {
        title: 'Folien und Digitaldrucke',
        text: 'Bei aufgeplatzten Kanten, Blasen, spröder Folie oder starker UV-Alterung wird die Fläche als möglicher Folien- oder Branding-Fall eingeordnet.',
      },
      {
        title: 'Elektrische Werbeanlagen',
        text: 'Leuchtwerbung wird beim Reinigen nicht als elektrisch instand gesetzt. Ausfälle, Flackern oder Feuchtigkeitsspuren werden in die Reparaturprüfung geleitet.',
      },
    ],
    boundaryTitle: 'Was diese Seite bewusst nicht verspricht',
    boundaryItems: [
      'Keine Preis- oder Pauschalzusage ohne Fotos, Maße, Zugang und Materialzustand.',
      'Keine Behauptung, dass Reinigung Defekte, Ausbleichen, Risse oder gelöste Folie beseitigt.',
      'Keine Offenlegung interner CRM-Schritte oder Kundendaten über eine öffentliche Seite.',
    ],
    routingEyebrow: 'Nach der Reinigung',
    routingTitle: 'Wenn Reinigung nicht reicht',
    routingIntro:
      'Reinigung kann zeigen, ob die Anlage nur verschmutzt ist oder ob Folie, Lichttechnik, Befestigung oder Montage zusätzlich geprüft werden sollten.',
    routingLinks: [
      {
        title: 'Werbeanlagen-Reparatur',
        text: 'Für Ausfälle, Flackern, Feuchtigkeit, gebrochene Fronten oder unsichere Befestigung.',
        href: '/leistungen/werbeanlagen-reparatur',
        tag: 'Defekt',
      },
      {
        title: 'Druckprodukte & Branding',
        text: 'Für gealterte Folien, neue Beschriftung, Druckflächen oder sichtbare Markenauffrischung.',
        href: '/leistungen/druckprodukte-branding-werbematerialien',
        tag: 'Oberfläche',
      },
      {
        title: 'Lichtwerbung & LED-Modernisierung',
        text: 'Für ungleichmäßige Ausleuchtung, alte Lichttechnik oder den Wunsch nach modernerer Leuchtwirkung.',
        href: '/leistungen/lichtwerbung-led-modernisierung',
        tag: 'Licht',
      },
      {
        title: 'Montage & Demontage',
        text: 'Für schwer erreichbare Anlagen, Austausch, sichere Befestigung oder geplante Demontage.',
        href: '/leistungen/montage-demontage-werbeanlagen',
        tag: 'Zugang',
      },
    ],
    faqTitle: 'Häufige Fragen zur Werbeanlagen-Reinigung',
    faqs: [
      {
        question: 'Reinigt PixelRing auch Markisen in Berlin und Brandenburg?',
        answer:
          'Ja, wenn es um beschriftete Markisen, Geschäftsfronten oder sichtbare Außenwerbung an gewerblichen Standorten geht. Fotos, Standort, Material und Zugang helfen bei der ersten Einschätzung.',
      },
      {
        question: 'Geht es auch um Markisen ohne Werbung?',
        answer:
          'Im Mittelpunkt stehen Geschäftsstandorte und sichtbare Außenwerbung. Eine Markise ohne Beschriftung kann passen, wenn sie Teil der Ladenfront, Gastronomiefläche oder des öffentlichen Erscheinungsbilds ist.',
      },
      {
        question: 'Bietet PixelRing Imprägnierung für Markisen an?',
        answer:
          'Imprägnierung wird nicht pauschal als Standardleistung versprochen. Nach Foto- oder Vor-Ort-Prüfung kann PixelRing einschätzen, ob zusätzliche Pflegeschritte für Material, Zustand und Nutzung sinnvoll sind.',
      },
      {
        question: 'Kann eine verschmutzte Markise wieder wie neu aussehen?',
        answer:
          'Das hängt von Stoff, Alter, UV-Belastung, Flecken und Materialzustand ab. Reinigung kann sichtbare Verschmutzung reduzieren, ersetzt aber keine Erneuerung und garantiert keinen Neuzustand.',
      },
      {
        question: 'Was ist bei Schimmel, Algen oder alten Flecken möglich?',
        answer:
          'Solche Rückstände müssen vorsichtig bewertet werden. PixelRing verspricht keine garantierte Entfernung, sondern prüft anhand von Fotos, Material und Standort, welche Reinigung sinnvoll und materialschonend möglich ist.',
      },
      {
        question: 'Reinigt PixelRing auch Leuchtwerbung?',
        answer:
          'Ja, soweit Zugang, Oberfläche und Zustand es zulassen. Elektrische Ausfälle oder Feuchtigkeit in der Anlage werden jedoch als Reparatur- oder Diagnosefall behandelt.',
      },
      {
        question: 'Kann eine Leuchtreklame einfach mit Wasser gereinigt werden?',
        answer:
          'Nein, nicht pauschal. Bei Leuchtwerbung zählen elektrische Sicherheit, Gehäuse, Dichtungen, Zugang und möglicher Feuchtigkeitseintrag. Bei Bedarf wird die Aufgabe technisch geprüft.',
      },
      {
        question: 'Was passiert, wenn Schmutz innen im Leuchtkasten oder in Profilbuchstaben sitzt?',
        answer:
          'Dann kann Öffnen, Demontage oder eine technische Prüfung nötig werden. Solche Fälle werden nicht als einfache Außenreinigung behandelt, sondern als Serviceaufgabe mit Zugang und Sicherheitsprüfung.',
      },
      {
        question: 'Welche Fotos helfen für die erste Einschätzung?',
        answer:
          'Hilfreich sind eine Gesamtansicht der Geschäftsfront, Nahaufnahmen der verschmutzten Fläche, Fotos von Zugang und Höhe sowie Angaben zu Standort, Material und gewünschtem Zeitraum.',
      },
      {
        question: 'Arbeitet PixelRing nur in Berlin oder auch in Brandenburg?',
        answer:
          'PixelRing richtet die Seite auf Berlin und Brandenburg aus. Ob ein Termin sinnvoll planbar ist, hängt von Standort, Umfang, Zugang und Aufgabe ab.',
      },
    ],
    offerCatalog: [
      'Markisenreinigung für Geschäftsfronten',
      'Leuchtkasten-Reinigung',
      'Schild- und Fassadenwerbung reinigen',
      'Folien- und Glasbeschriftung pflegen',
      'Profilbuchstaben außen reinigen',
      'Sichtkontrolle nach der Reinigung',
    ],
    finalHeadline: 'Soll Ihre Außenwerbung wieder gepflegt wirken?',
    finalText:
      'Senden Sie Fotos der Anlage, Standort und eine kurze Beschreibung. PixelRing prüft, ob Reinigung sinnvoll ist oder ob Reparatur, Folie, Montage oder Modernisierung besser passt.',
    finalRequestTitle: 'Reinigung mit Foto anfragen',
    finalRequestCta: 'Reinigung anfragen',
  },
  en: {
    serviceName: 'Signage Cleaning',
    metaTitle: 'Signage Cleaning in Berlin & Brandenburg | PixelRing',
    metaDescription:
      'Cleaning and care for signs, lightboxes, films, awnings and outdoor advertising in Berlin and Brandenburg.',
    heroTitle: 'Professional Signage Cleaning',
    heroSubline:
      'PixelRing cleans signs, lightboxes and storefront advertising in Berlin & Brandenburg. We check photos beforehand to assess material and access for gentle cleaning or the right repair route.',
    heroImageAlt:
      'Illustrative visual of a PixelRing team cleaning a blue awning on a business facade',
    heroPrimaryCta: 'Request cleaning',
    heroSecondaryCta: 'Which photos help?',
    heroSecondaryHref: '#cleaning-photos',
    scopeEyebrow: 'Cleaning & care',
    scopeTitle: 'What the cleaning service can cover',
    scopeIntro:
      'This page gives a first orientation: which surfaces can be cleaned, which conditions are typical cleaning cases and when another service should follow.',
    scopeCards: [
      {
        title: 'Lightboxes and signs',
        text: 'Visible faces, frames and edges can be cleaned carefully so lettering and light effect look more presentable again.',
      },
      {
        title: 'Films, lettering and glass',
        text: 'Window lettering, film surfaces and glass areas are handled carefully without presenting loose or aged film as repaired.',
      },
      {
        title: 'Awnings and textile advertising',
        text: 'Dust, deposits and visible weather residue can be assessed and cleaned where material, access and condition allow it.',
      },
      {
        title: 'Recurring site care',
        text: 'For stores, practices, restaurants or branches, cleaning can be combined with a visual condition check.',
      },
    ],
    materialEyebrow: 'Materials & limits',
    materialTitle: 'Cleaning is not a repair',
    materialIntro:
      'The visible state matters first: material, ageing, adhesion, access and electrical safety decide whether cleaning is sensible or another step is needed.',
    materialCards: [
      {
        title: 'Acrylic, composite and painted faces',
        text: 'Surfaces are treated gently. Yellowing, deep scratches or broken material do not disappear through cleaning.',
      },
      {
        title: 'Films and printed graphics',
        text: 'Lifted edges, bubbles, brittle film or heavy UV ageing are routed as possible film or branding work.',
      },
      {
        title: 'Electrical signage',
        text: 'Illuminated signage is not electrically repaired during cleaning. Outages, flicker or moisture traces are routed to repair checks.',
      },
    ],
    boundaryTitle: 'What this page does not promise',
    boundaryItems: [
      'No price promise without photos, size, access and material condition.',
      'No claim that cleaning fixes defects, fading, cracks or lifted film.',
      'No exposure of internal CRM steps or private customer data on a public page.',
    ],
    routingEyebrow: 'After cleaning',
    routingTitle: 'When cleaning reveals the next issue',
    routingIntro:
      'Cleaning can show whether a sign is only dirty or whether film, lighting, mounting or installation should be checked next.',
    routingLinks: [
      {
        title: 'Signage repair',
        text: 'For outages, flicker, moisture, cracked faces or unsafe mounting.',
        href: '/leistungen/werbeanlagen-reparatur',
        tag: 'Defect',
      },
      {
        title: 'Print products & branding',
        text: 'For aged films, new lettering, printed surfaces or a visible brand refresh.',
        href: '/leistungen/druckprodukte-branding-werbematerialien',
        tag: 'Surface',
      },
      {
        title: 'Illuminated signage & LED modernization',
        text: 'For uneven light, older lighting technology or a more modern light effect.',
        href: '/leistungen/lichtwerbung-led-modernisierung',
        tag: 'Light',
      },
      {
        title: 'Installation & dismantling',
        text: 'For hard-to-reach signs, replacement, safe fixing or planned dismantling.',
        href: '/leistungen/montage-demontage-werbeanlagen',
        tag: 'Access',
      },
    ],
    faqTitle: 'Questions about signage cleaning',
    faqs: [
      {
        question: 'Can PixelRing estimate whether cleaning is enough?',
        answer:
          'Yes. Photos, location, approximate dimensions and material notes help with the first assessment. If damage is visible, the right next service is suggested.',
      },
      {
        question: 'Does PixelRing clean illuminated signage?',
        answer:
          'Yes, where access, surface and condition allow it. Electrical outages or moisture inside the sign are handled as repair or diagnostics cases.',
      },
      {
        question: 'Are awnings and films treated the same way?',
        answer:
          'No. Textile surfaces, film, acrylic, metal and glass react differently. The method depends on the material condition.',
      },
    ],
    offerCatalog: [
      'Lightbox cleaning',
      'Sign and facade advertising cleaning',
      'Film and glass lettering care',
      'Awnings and textile outdoor advertising cleaning',
      'Visual condition check after cleaning',
    ],
    finalHeadline: 'Should your outdoor advertising look cared for again?',
    finalText:
      'Send photos, the location and a short description. PixelRing checks whether cleaning is sensible or repair, film work, installation or modernization fits better.',
    finalRequestTitle: 'Request cleaning with photos',
    finalRequestCta: 'Request cleaning',
  },
  ru: {
    serviceName: 'Мойка вывесок',
    metaTitle: 'Мойка вывесок в Берлине и Бранденбурге | PixelRing',
    metaDescription:
      'Очистка и уход за вывесками, световыми коробами, пленками, маркизами и наружной рекламой в Берлине и Бранденбурге.',
    heroTitle: 'Профессиональная мойка вывесок',
    heroSubline:
      'PixelRing моет вывески, световые короба и наружную рекламу в Берлине и Бранденбурге. Мы заранее оцениваем фото, материал и доступ для бережной очистки или подбора нужного ремонта.',
    heroImageAlt:
      'Иллюстративное изображение команды PixelRing при очистке синей маркизы на фасаде магазина',
    heroPrimaryCta: 'Запросить очистку',
    heroSecondaryCta: 'Какие фото помогут?',
    heroSecondaryHref: '#cleaning-photos',
    scopeEyebrow: 'Очистка и уход',
    scopeTitle: 'Что может входить в очистку',
    scopeIntro:
      'Эта страница помогает понять, какие поверхности можно чистить, какие случаи типичны для ухода и когда после очистки нужен другой сервис.',
    scopeCards: [
      {
        title: 'Световые короба и вывески',
        text: 'Внешние панели, рамки и видимые кромки очищаются бережно, чтобы надпись и подсветка выглядели аккуратнее.',
      },
      {
        title: 'Пленки, надписи и стекло',
        text: 'Витринные надписи, пленочные поверхности и стекло обрабатываются осторожно; старая или отклеенная пленка не выдается за отремонтированную.',
      },
      {
        title: 'Маркизы и текстильная реклама',
        text: 'Пыль, налет и следы погоды можно оценить и очистить, если материал, доступ и состояние это позволяют.',
      },
      {
        title: 'Регулярный уход за объектами',
        text: 'Для магазинов, практик, кафе и филиалов очистку можно сочетать с визуальной проверкой состояния.',
      },
    ],
    materialEyebrow: 'Материалы и границы',
    materialTitle: 'Очистка не заменяет ремонт',
    materialIntro:
      'Сначала оценивается видимое состояние: материал, возраст, сцепление пленки, доступ и электрическая безопасность показывают, достаточно ли очистки.',
    materialCards: [
      {
        title: 'Акрил, композит и окрашенные поверхности',
        text: 'Поверхности не обрабатываются агрессивно. Пожелтение, глубокие царапины и трещины не исчезают от очистки.',
      },
      {
        title: 'Пленки и печатная графика',
        text: 'Отклеенные края, пузыри, хрупкая пленка и сильное выгорание направляются в блок пленки и брендинга.',
      },
      {
        title: 'Электрические вывески',
        text: 'Во время очистки вывеска не ремонтируется как электрика. Не горит, мигает или есть следы влаги - это маршрут в ремонтную проверку.',
      },
    ],
    boundaryTitle: 'Чего эта страница не обещает',
    boundaryItems: [
      'Нет цены без фото, размеров, доступа и состояния материала.',
      'Нет обещания, что очистка устранит дефекты, выгорание, трещины или отклеенную пленку.',
      'Нет показа внутренних CRM-шагов или приватных данных клиента на публичной странице.',
    ],
    routingEyebrow: 'После очистки',
    routingTitle: 'Если после очистки видна другая задача',
    routingIntro:
      'Очистка может показать, была ли конструкция просто грязной или нужна проверка пленки, света, креплений или монтажа.',
    routingLinks: [
      {
        title: 'Ремонт рекламных конструкций',
        text: 'Если вывеска не горит, мигает, есть влага, трещины или слабое крепление.',
        href: '/leistungen/werbeanlagen-reparatur',
        tag: 'Дефект',
      },
      {
        title: 'Печать и брендинг',
        text: 'Для старой пленки, новой надписи, печатных поверхностей или обновления внешнего вида.',
        href: '/leistungen/druckprodukte-branding-werbematerialien',
        tag: 'Поверхность',
      },
      {
        title: 'Световая реклама и LED',
        text: 'Для неравномерной подсветки, старой светотехники или более современного светового эффекта.',
        href: '/leistungen/lichtwerbung-led-modernisierung',
        tag: 'Свет',
      },
      {
        title: 'Монтаж и демонтаж',
        text: 'Для сложного доступа, замены, безопасного крепления или планового демонтажа.',
        href: '/leistungen/montage-demontage-werbeanlagen',
        tag: 'Доступ',
      },
    ],
    faqTitle: 'Вопросы об очистке вывесок',
    faqs: [
      {
        question: 'Можно заранее понять, достаточно ли очистки?',
        answer:
          'Да. Фото, адрес, примерные размеры и информация о материале помогают сделать первую оценку. Если видны повреждения, PixelRing предложит подходящий следующий сервис.',
      },
      {
        question: 'PixelRing чистит световые вывески?',
        answer:
          'Да, если доступ, поверхность и состояние позволяют. Но электрические неисправности и влага внутри конструкции относятся к ремонту или диагностике.',
      },
      {
        question: 'Маркизы и пленки чистятся одинаково?',
        answer:
          'Нет. Текстиль, пленка, акрил, металл и стекло реагируют по-разному. Метод зависит от состояния материала.',
      },
    ],
    offerCatalog: [
      'Очистка световых коробов',
      'Очистка фасадной рекламы и вывесок',
      'Уход за пленкой и надписями на стекле',
      'Очистка маркиз и текстильной наружной рекламы',
      'Визуальная проверка после очистки',
    ],
    finalHeadline: 'Нужно вернуть наружной рекламе аккуратный вид?',
    finalText:
      'Отправьте фото, адрес и короткое описание. PixelRing проверит, подходит ли очистка или лучше выбрать ремонт, пленку, монтаж или модернизацию.',
    finalRequestTitle: 'Запросить очистку по фото',
    finalRequestCta: 'Запросить очистку',
  },
  tr: {
    serviceName: 'Tabela Temizliği',
    metaTitle: 'Tabela Temizliği Berlin ve Brandenburg | PixelRing',
    metaDescription:
      'Berlin ve Brandenburg genelinde tabelalar, ışıklı kutular, folyolar, tenteler ve dış mekan reklamları için temizlik ve bakım.',
    heroTitle: 'Profesyonel Tabela Temizliği',
    heroSubline:
      "PixelRing, Berlin ve Brandenburg'daki tabelaları, ışıklı kutuları ve dış mekan reklamlarını temizler. Hassas temizlik veya doğru onarım çözümü için malzeme ve erişim durumunu fotoğraflarla önceden kontrol ederiz.",
    heroImageAlt:
      'Bir iş yeri cephesinde mavi tenteyi temizleyen PixelRing ekibinin örnek görseli',
    heroPrimaryCta: 'Temizlik talep et',
    heroSecondaryCta: 'Hangi fotoğraflar yardımcı olur?',
    heroSecondaryHref: '#cleaning-photos',
    scopeEyebrow: 'Temizlik ve bakım',
    scopeTitle: 'Temizlik hangi işleri kapsayabilir?',
    scopeIntro:
      'Bu sayfa ilk yönlendirme içindir: hangi yüzeyler temizlenebilir, hangi durumlar temizlik işidir ve ne zaman başka bir hizmet gerekir?',
    scopeCards: [
      {
        title: 'Işıklı kutular ve tabelalar',
        text: 'Dış yüzeyler, ön paneller, çerçeveler ve kenarlar dikkatli temizlenir; yazı ve ışık etkisi daha düzenli görünür.',
      },
      {
        title: 'Folyolar, yazılar ve cam',
        text: 'Vitrin yazıları, folyo yüzeyleri ve cam alanlar dikkatli işlenir; kalkmış veya yaşlanmış folyo onarılmış gibi sunulmaz.',
      },
      {
        title: 'Tenteler ve tekstil reklam',
        text: 'Toz, birikinti ve hava etkileri; malzeme, erişim ve durum uygunsa değerlendirilip temizlenebilir.',
      },
      {
        title: 'Düzenli lokasyon bakımı',
        text: 'Mağaza, muayenehane, restoran veya şubelerde temizlik görsel durum kontrolüyle birleştirilebilir.',
      },
    ],
    materialEyebrow: 'Malzeme ve sınırlar',
    materialTitle: 'Temizlik onarım değildir',
    materialIntro:
      'Önce görünen durum önemlidir: malzeme, yaşlanma, yapışma, erişim ve elektrik güvenliği temizliğin yeterli olup olmadığını belirler.',
    materialCards: [
      {
        title: 'Akrilik, kompozit ve boyalı yüzeyler',
        text: 'Yüzeylere agresif işlem uygulanmaz. Sararma, derin çizik veya kırıklar temizlikle kaybolmaz.',
      },
      {
        title: 'Folyolar ve baskılı grafikler',
        text: 'Kalkan kenarlar, kabarcıklar, kırılgan folyo veya UV yaşlanması folyo ve branding işi olarak yönlendirilir.',
      },
      {
        title: 'Elektrikli reklamlar',
        text: 'Işıklı reklam temizlik sırasında elektriksel olarak onarılmaz. Arıza, titreme veya nem izleri onarım kontrolüne gider.',
      },
    ],
    boundaryTitle: 'Bu sayfa neleri vaat etmez?',
    boundaryItems: [
      'Fotoğraf, ölçü, erişim ve malzeme durumu olmadan fiyat vaadi yoktur.',
      'Temizliğin arıza, solma, çatlak veya kalkmış folyoyu çözeceği iddia edilmez.',
      'Herkese açık sayfada dahili CRM adımları veya özel müşteri verileri gösterilmez.',
    ],
    routingEyebrow: 'Temizlikten sonra',
    routingTitle: 'Temizlik başka bir ihtiyacı gösterirse',
    routingIntro:
      'Temizlik, tabelanın sadece kirli mi olduğunu yoksa folyo, ışık, bağlantı veya montaj kontrolü gerektirip gerektirmediğini gösterebilir.',
    routingLinks: [
      {
        title: 'Reklam sistemi onarımı',
        text: 'Sönme, titreme, nem, çatlak yüzeyler veya güvenli olmayan bağlantılar için.',
        href: '/leistungen/werbeanlagen-reparatur',
        tag: 'Arıza',
      },
      {
        title: 'Baskı ürünleri ve markalama',
        text: 'Yaşlanmış folyo, yeni yazı, baskılı yüzey veya görünür marka yenilemesi için.',
        href: '/leistungen/druckprodukte-branding-werbematerialien',
        tag: 'Yüzey',
      },
      {
        title: 'Işıklı reklam ve LED',
        text: 'Düzensiz aydınlatma, eski ışık teknolojisi veya daha modern ışık etkisi için.',
        href: '/leistungen/lichtwerbung-led-modernisierung',
        tag: 'Işık',
      },
      {
        title: 'Montaj ve demontaj',
        text: 'Zor erişim, değişim, güvenli bağlantı veya planlı söküm için.',
        href: '/leistungen/montage-demontage-werbeanlagen',
        tag: 'Erişim',
      },
    ],
    faqTitle: 'Tabela temizliği hakkında sorular',
    faqs: [
      {
        question: 'Temizliğin yeterli olup olmadığı önceden anlaşılır mı?',
        answer:
          'Evet. Fotoğraflar, konum, yaklaşık ölçüler ve malzeme bilgisi ilk değerlendirmeye yardımcı olur. Görünür hasar varsa uygun sonraki hizmet önerilir.',
      },
      {
        question: 'PixelRing ışıklı reklamları da temizler mi?',
        answer:
          'Evet, erişim, yüzey ve durum uygunsa. Elektrik arızaları veya içeride nem ise onarım ya da teşhis işi olarak ele alınır.',
      },
      {
        question: 'Tente ve folyo aynı şekilde mi temizlenir?',
        answer:
          'Hayır. Tekstil, folyo, akrilik, metal ve cam farklı tepki verir. Yöntem malzemenin durumuna göre seçilir.',
      },
    ],
    offerCatalog: [
      'Işıklı kutu temizliği',
      'Tabela ve cephe reklamı temizliği',
      'Folyo ve cam yazı bakımı',
      'Tente ve tekstil dış reklam temizliği',
      'Temizlik sonrası görsel kontrol',
    ],
    finalHeadline: 'Dış reklamınız tekrar bakımlı görünsün mü?',
    finalText:
      'Fotoğrafları, konumu ve kısa açıklamayı gönderin. PixelRing temizliğin uygun olup olmadığını veya onarım, folyo, montaj ya da modernizasyonun daha doğru olup olmadığını kontrol eder.',
    finalRequestTitle: 'Fotoğrafla temizlik talebi',
    finalRequestCta: 'Temizlik talep et',
  },
  pl: {
    serviceName: 'Czyszczenie reklam',
    metaTitle: 'Czyszczenie reklam w Berlinie i Brandenburgii | PixelRing',
    metaDescription:
      'Czyszczenie i pielęgnacja szyldów, kasetonów, folii, markiz i reklamy zewnętrznej w Berlinie i Brandenburgii.',
    heroTitle: 'Profesjonalne czyszczenie reklam',
    heroSubline:
      'PixelRing czyści szyldy, kasetony i reklamę zewnętrzną w Berlinie i Brandenburgii. Oceniamy zdjęcia pod kątem materiału i dostępu, aby zapewnić bezpieczne czyszczenie lub zalecić naprawę.',
    heroImageAlt:
      'Przykładowa wizualizacja zespołu PixelRing czyszczącego niebieską markizę na fasadzie lokalu',
    heroPrimaryCta: 'Zapytaj o czyszczenie',
    heroSecondaryCta: 'Jakie zdjęcia pomogą?',
    heroSecondaryHref: '#cleaning-photos',
    scopeEyebrow: 'Czyszczenie i pielęgnacja',
    scopeTitle: 'Co może obejmować czyszczenie',
    scopeIntro:
      'Ta strona daje pierwszą orientację: jakie powierzchnie można czyścić, które przypadki są typowe i kiedy potrzebna jest kolejna usługa.',
    scopeCards: [
      {
        title: 'Kasetony i szyldy',
        text: 'Fronty, ramy i widoczne krawędzie są czyszczone ostrożnie, aby napis i światło wyglądały schludniej.',
      },
      {
        title: 'Folie, napisy i szkło',
        text: 'Napisy witrynowe, powierzchnie foliowe i szkło są traktowane delikatnie; odklejona lub stara folia nie jest przedstawiana jako naprawiona.',
      },
      {
        title: 'Markizy i reklama tekstylna',
        text: 'Kurz, osady i ślady pogody można ocenić i oczyścić, jeśli materiał, dostęp i stan na to pozwalają.',
      },
      {
        title: 'Regularna pielęgnacja lokalizacji',
        text: 'Dla sklepów, praktyk, gastronomii i oddziałów czyszczenie można połączyć z kontrolą wizualną.',
      },
    ],
    materialEyebrow: 'Materiały i granice',
    materialTitle: 'Czyszczenie nie zastępuje naprawy',
    materialIntro:
      'Najpierw liczy się widoczny stan: materiał, wiek, przyczepność, dostęp i bezpieczeństwo elektryczne określają, czy czyszczenie ma sens.',
    materialCards: [
      {
        title: 'Akryl, kompozyt i powierzchnie lakierowane',
        text: 'Powierzchnie nie są traktowane agresywnie. Żółknięcie, głębokie rysy i pęknięcia nie znikają po czyszczeniu.',
      },
      {
        title: 'Folie i grafiki drukowane',
        text: 'Odklejone krawędzie, pęcherze, krucha folia lub mocne wyblaknięcie trafiają do oceny folii i brandingu.',
      },
      {
        title: 'Reklamy elektryczne',
        text: 'Podczas czyszczenia reklama świetlna nie jest naprawiana elektrycznie. Awarie, migotanie lub ślady wilgoci kierujemy do naprawy.',
      },
    ],
    boundaryTitle: 'Czego ta strona nie obiecuje',
    boundaryItems: [
      'Brak obietnicy ceny bez zdjęć, wymiarów, dostępu i stanu materiału.',
      'Brak twierdzenia, że czyszczenie usuwa usterki, wyblaknięcie, pęknięcia lub odklejoną folię.',
      'Brak pokazywania wewnętrznych kroków CRM lub prywatnych danych klienta na publicznej stronie.',
    ],
    routingEyebrow: 'Po czyszczeniu',
    routingTitle: 'Gdy czyszczenie ujawni kolejny temat',
    routingIntro:
      'Czyszczenie może pokazać, czy reklama była tylko zabrudzona, czy folia, światło, mocowanie albo montaż wymagają kontroli.',
    routingLinks: [
      {
        title: 'Naprawa reklam',
        text: 'Dla awarii, migotania, wilgoci, pękniętych frontów lub niepewnego mocowania.',
        href: '/leistungen/werbeanlagen-reparatur',
        tag: 'Usterka',
      },
      {
        title: 'Druk i branding',
        text: 'Dla starej folii, nowych napisów, powierzchni drukowanych lub odświeżenia marki.',
        href: '/leistungen/druckprodukte-branding-werbematerialien',
        tag: 'Powierzchnia',
      },
      {
        title: 'Reklama świetlna i LED',
        text: 'Dla nierównego światła, starszej techniki lub bardziej nowoczesnego efektu świetlnego.',
        href: '/leistungen/lichtwerbung-led-modernisierung',
        tag: 'Światło',
      },
      {
        title: 'Montaż i demontaż',
        text: 'Dla trudnego dostępu, wymiany, bezpiecznego mocowania lub planowanego demontażu.',
        href: '/leistungen/montage-demontage-werbeanlagen',
        tag: 'Dostęp',
      },
    ],
    faqTitle: 'Pytania o czyszczenie reklam',
    faqs: [
      {
        question: 'Czy PixelRing może ocenić, czy czyszczenie wystarczy?',
        answer:
          'Tak. Zdjęcia, lokalizacja, przybliżone wymiary i informacje o materiale pomagają w pierwszej ocenie. Jeśli widać uszkodzenia, proponujemy właściwą kolejną usługę.',
      },
      {
        question: 'Czy PixelRing czyści reklamy świetlne?',
        answer:
          'Tak, jeśli dostęp, powierzchnia i stan na to pozwalają. Awarie elektryczne lub wilgoć w środku są traktowane jako naprawa albo diagnostyka.',
      },
      {
        question: 'Czy markizy i folie czyści się tak samo?',
        answer:
          'Nie. Tekstylia, folia, akryl, metal i szkło reagują inaczej. Metoda zależy od stanu materiału.',
      },
    ],
    offerCatalog: [
      'Czyszczenie kasetonów',
      'Czyszczenie szyldów i reklamy fasadowej',
      'Pielęgnacja folii i napisów na szkle',
      'Czyszczenie markiz i tekstylnej reklamy zewnętrznej',
      'Kontrola wizualna po czyszczeniu',
    ],
    finalHeadline: 'Czy reklama zewnętrzna ma znów wyglądać schludnie?',
    finalText:
      'Wyślij zdjęcia, lokalizację i krótki opis. PixelRing sprawdzi, czy wystarczy czyszczenie, czy lepsza będzie naprawa, folia, montaż albo modernizacja.',
    finalRequestTitle: 'Zapytaj o czyszczenie ze zdjęciem',
    finalRequestCta: 'Zapytaj o czyszczenie',
  },
  ar: {
    serviceName: 'تنظيف اللوحات الإعلانية',
    metaTitle: 'تنظيف اللوحات الإعلانية في برلين وبراندنبورغ | PixelRing',
    metaDescription:
      'تنظيف وصيانة اللوحات، الصناديق المضيئة، الفويل، المظلات والإعلانات الخارجية في برلين وبراندنبورغ.',
    heroTitle: 'تنظيف اللوحات الإعلانية الاحترافي',
    heroSubline:
      'تقوم PixelRing بتنظيف اللوحات، الصناديق المضيئة والإعلانات الخارجية في برلين وبراندنبورغ. نراجع الصور مسبقاً لتقييم المادة والوصول لضمان تنظيف آمن أو اقتراح مسار الإصلاح المناسب.',
    heroImageAlt:
      'تصور توضيحي لفريق PixelRing أثناء تنظيف مظلة زرقاء على واجهة متجر',
    heroPrimaryCta: 'طلب التنظيف',
    heroSecondaryCta: 'ما الصور المفيدة؟',
    heroSecondaryHref: '#cleaning-photos',
    scopeEyebrow: 'تنظيف وصيانة',
    scopeTitle: 'ما الذي يمكن أن يشمله التنظيف',
    scopeIntro:
      'توضح هذه الصفحة بشكل أولي أي أسطح يمكن تنظيفها، وما الحالات المعتادة للتنظيف، ومتى يلزم الانتقال إلى خدمة أخرى.',
    scopeCards: [
      {
        title: 'الصناديق المضيئة واللوحات',
        text: 'يمكن تنظيف الواجهات والإطارات والحواف المرئية بعناية حتى تبدو الكتابة وتأثير الإضاءة أكثر انتظاما.',
      },
      {
        title: 'الفويل والكتابات والزجاج',
        text: 'تتم معالجة كتابات الواجهات والأسطح المغطاة بالفويل والزجاج بحذر، دون اعتبار الفويل القديم أو المنفصل بأنه تم إصلاحه.',
      },
      {
        title: 'المظلات والإعلانات النسيجية',
        text: 'يمكن تقييم الغبار والترسبات وآثار الطقس وتنظيفها إذا كانت المادة والوصول والحالة تسمح بذلك.',
      },
      {
        title: 'عناية دورية بالمواقع',
        text: 'للمتاجر والعيادات والمطاعم والفروع، يمكن دمج التنظيف مع فحص بصري للحالة.',
      },
    ],
    materialEyebrow: 'المواد والحدود',
    materialTitle: 'التنظيف لا يحل محل الإصلاح',
    materialIntro:
      'الحالة المرئية تأتي أولا: نوع المادة، العمر، الالتصاق، إمكانية الوصول والسلامة الكهربائية تحدد هل التنظيف مناسب أم أن خطوة أخرى مطلوبة.',
    materialCards: [
      {
        title: 'الأكريليك والكمبوزيت والأسطح المطلية',
        text: 'لا تعالج الأسطح بطريقة قاسية. الاصفرار والخدوش العميقة والكسور لا تختفي بمجرد التنظيف.',
      },
      {
        title: 'الفويل والرسومات المطبوعة',
        text: 'الحواف المنفصلة، الفقاعات، الفويل الهش أو البهتان القوي يتم توجيهها كعمل فويل أو هوية بصرية.',
      },
      {
        title: 'الإعلانات الكهربائية',
        text: 'لا يتم إصلاح اللوحات المضيئة كهربائيا أثناء التنظيف. الانقطاع أو الوميض أو آثار الرطوبة تذهب إلى فحص الإصلاح.',
      },
    ],
    boundaryTitle: 'ما لا تعد به هذه الصفحة',
    boundaryItems: [
      'لا يوجد وعد بسعر قبل الصور والمقاسات والوصول وحالة المادة.',
      'لا يوجد ادعاء بأن التنظيف يصلح الأعطال أو البهتان أو الشقوق أو الفويل المنفصل.',
      'لا يتم عرض خطوات CRM الداخلية أو بيانات العملاء الخاصة في صفحة عامة.',
    ],
    routingEyebrow: 'بعد التنظيف',
    routingTitle: 'عندما يظهر التنظيف حاجة أخرى',
    routingIntro:
      'قد يوضح التنظيف هل كانت اللوحة متسخة فقط أم أن الفويل أو الإضاءة أو التثبيت أو التركيب يحتاج إلى فحص.',
    routingLinks: [
      {
        title: 'إصلاح اللوحات الإعلانية',
        text: 'للأعطال أو الوميض أو الرطوبة أو الواجهات المتشققة أو التثبيت غير الآمن.',
        href: '/leistungen/werbeanlagen-reparatur',
        tag: 'عطل',
      },
      {
        title: 'الطباعة والهوية',
        text: 'للفويل القديم أو الكتابات الجديدة أو الأسطح المطبوعة أو تحديث المظهر.',
        href: '/leistungen/druckprodukte-branding-werbematerialien',
        tag: 'سطح',
      },
      {
        title: 'الإعلانات المضيئة و LED',
        text: 'للإضاءة غير المنتظمة أو التقنية القديمة أو تأثير إضاءة أكثر حداثة.',
        href: '/leistungen/lichtwerbung-led-modernisierung',
        tag: 'إضاءة',
      },
      {
        title: 'التركيب والفك',
        text: 'للوحات صعبة الوصول أو الاستبدال أو التثبيت الآمن أو الفك المخطط.',
        href: '/leistungen/montage-demontage-werbeanlagen',
        tag: 'وصول',
      },
    ],
    faqTitle: 'أسئلة حول تنظيف اللوحات',
    faqs: [
      {
        question: 'هل يمكن تقدير ما إذا كان التنظيف كافيا؟',
        answer:
          'نعم. الصور والموقع والمقاسات التقريبية ومعلومات المادة تساعد في التقييم الأول. إذا ظهرت أضرار، تقترح PixelRing الخدمة التالية المناسبة.',
      },
      {
        question: 'هل تنظف PixelRing اللوحات المضيئة؟',
        answer:
          'نعم، إذا سمح الوصول والسطح والحالة بذلك. أما الأعطال الكهربائية أو الرطوبة داخل اللوحة فتعامل كإصلاح أو تشخيص.',
      },
      {
        question: 'هل تنظف المظلات والفويل بنفس الطريقة؟',
        answer:
          'لا. النسيج والفويل والأكريليك والمعدن والزجاج تتفاعل بطرق مختلفة. الطريقة تعتمد على حالة المادة.',
      },
    ],
    offerCatalog: [
      'تنظيف الصناديق المضيئة',
      'تنظيف اللوحات وإعلانات الواجهات',
      'العناية بالفويل وكتابات الزجاج',
      'تنظيف المظلات والإعلانات النسيجية الخارجية',
      'فحص بصري بعد التنظيف',
    ],
    finalHeadline: 'هل يجب أن تبدو إعلاناتك الخارجية أكثر عناية؟',
    finalText:
      'أرسل الصور والموقع ووصفا قصيرا. تتحقق PixelRing مما إذا كان التنظيف مناسبا أو أن الإصلاح أو الفويل أو التركيب أو التحديث أفضل.',
    finalRequestTitle: 'طلب تنظيف مع صور',
    finalRequestCta: 'طلب التنظيف',
  },
};

function getLocale(locale: string): Locale {
  return (locale in CONTENT ? locale : 'de') as Locale;
}

function getContent(locale: string): CleaningPageContent {
  return CONTENT[getLocale(locale)];
}

function getCleaningBreadcrumbs(locale: Locale, currentLabel: string) {
  const labels = BREADCRUMB_LABELS_BY_LOCALE[locale];

  return [
    {
      label: labels.home,
      href: '/',
    },
    {
      label: labels.services,
      href: '/leistungen',
    },
    {
      label: currentLabel,
    },
  ];
}

function withoutJsonLdContext(item: JsonLdObject): JsonLdObject {
  const nextItem = { ...item };
  delete nextItem['@context'];

  return nextItem;
}

function buildCleaningPageJsonLd(locale: Locale, content: CleaningPageContent) {
  const canonicalUrl = buildLocaleUrl(locale, CLEANING_PAGE_PATH);
  const breadcrumbLabels = BREADCRUMB_LABELS_BY_LOCALE[locale];
  const provider = {
    '@type': 'Organization',
    '@id': ORGANIZATION_SCHEMA_ID,
    name: 'PixelRing',
  };
  const [postalCode = '', addressLocality = 'Berlin'] = SITE_CONFIG.company.address.city.split(' ');
  const jsonLd: JsonLdObject[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${canonicalUrl}#service`,
      name: content.serviceName,
      serviceType: content.serviceName,
      description: content.metaDescription,
      provider,
      mainEntityOfPage: canonicalUrl,
      inLanguage: LANGUAGE_TAG_BY_LOCALE[locale],
      areaServed: [
        {
          '@type': 'AdministrativeArea',
          name: 'Berlin',
        },
        {
          '@type': 'AdministrativeArea',
          name: 'Brandenburg',
        },
      ],
      url: canonicalUrl,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${content.serviceName} - Leistungen`,
        itemListElement: content.offerCatalog.map((name, index) => ({
          '@type': 'Offer',
          position: index + 1,
          itemOffered: {
            '@type': 'Service',
            name,
          },
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'ProfessionalService'],
      '@id': ORGANIZATION_SCHEMA_ID,
      name: 'PixelRing',
      legalName: SITE_CONFIG.company.legalName,
      alternateName: ['PixelRing Service'],
      url: SITE_BASE_URL,
      logo: buildSiteUrl('/icon.png'),
      image: CLEANING_OG_IMAGE,
      email: SITE_CONFIG.company.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE_CONFIG.company.address.street,
        postalCode,
        addressLocality,
        addressRegion: 'Berlin',
        addressCountry: 'DE',
      },
      openingHours: 'Mo-Fr 09:00-18:00',
      areaServed: [
        {
          '@type': 'AdministrativeArea',
          name: 'Berlin',
        },
        {
          '@type': 'AdministrativeArea',
          name: 'Brandenburg',
        },
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: SITE_CONFIG.company.email,
        availableLanguage: ['de', 'en', 'ru', 'tr', 'pl', 'ar'],
      },
      knowsAbout: [
        'Werbeanlagen-Reinigung',
        'Leuchtkasten-Pflege',
        'Außenwerbung',
        'Schilder',
        'Werbefolien',
        'Markisen',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: breadcrumbLabels.home,
          item: buildLocaleUrl(locale),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: breadcrumbLabels.services,
          item: buildLocaleUrl(locale, '/leistungen'),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: content.serviceName,
          item: canonicalUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': jsonLd.map(withoutJsonLdContext),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = getLocale(locale);
  const content = getContent(safeLocale);
  const canonicalUrl = buildLocaleUrl(safeLocale, CLEANING_PAGE_PATH);
  const alternateLocales = (Object.entries(OPEN_GRAPH_LOCALE_BY_LOCALE) as Array<[Locale, string]>)
    .filter(([entryLocale]) => entryLocale !== safeLocale)
    .map(([, openGraphLocale]) => openGraphLocale);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(CLEANING_PAGE_PATH),
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: canonicalUrl,
      siteName: 'PixelRing',
      type: 'website',
      locale: OPEN_GRAPH_LOCALE_BY_LOCALE[safeLocale],
      alternateLocale: alternateLocales,
      images: [
        {
          url: CLEANING_OG_IMAGE,
          width: 1672,
          height: 941,
          alt: content.heroImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
      images: [CLEANING_OG_IMAGE],
    },
  };
}

function ScopeCardsSection({ content }: { content: CleaningPageContent }) {
  return (
    <section id="cleaning-scope" className="border-t border-[#E7DDD3] bg-[#F7F1E8] py-14 sm:py-20">
      <div className="pr-site-container">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-end">
          <div className="text-start">
            <SectionEyebrow className="mb-3">{content.scopeEyebrow}</SectionEyebrow>
            <h2 className="max-w-4xl text-3xl font-extrabold leading-[1.1] tracking-[0] text-[#0E1A2B] sm:text-5xl">
              {content.scopeTitle}
            </h2>
          </div>
          <p className="max-w-2xl text-start text-[16px] font-semibold leading-8 text-[#526174]">
            {content.scopeIntro}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.scopeCards.map((card) => (
            <article
              key={card.title}
              className="min-h-[212px] rounded-[22px] border border-[#E0D2C4] bg-[#FFFDF9] p-5 text-start shadow-sm"
            >
              <h3 className="break-words text-[19px] font-black leading-tight text-[#0E1A2B]">
                {card.title}
              </h3>
              <p className="mt-4 text-[14px] font-semibold leading-6 text-[#526174]">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhotoAssessmentSection({
  content,
  locale,
}: {
  content: CleaningPageContent;
  locale: Locale;
}) {
  const copy = PHOTO_ASSESSMENT_COPY_BY_LOCALE[locale];
  const items = content.photoItems ?? copy.items;
  const title = content.photoTitle ?? copy.title;

  if (!title || items.length === 0) {
    return null;
  }

  return (
    <section id="cleaning-photos" className="bg-[#0E1A2B] py-14 text-white sm:py-20">
      <div className="pr-site-container grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-start">
        <div className="text-start">
          <SectionEyebrow className="mb-3 text-[#F2C6A3]">{content.photoEyebrow ?? copy.eyebrow}</SectionEyebrow>
          <h2 className="text-[32px] font-black leading-[1.1] tracking-[0] sm:text-[44px]">
            {title}
          </h2>
          <p className="mt-5 text-[17px] leading-8 text-white/75">{content.photoIntro ?? copy.intro}</p>
        </div>

        <div className="rounded-[24px] border border-white/12 bg-white/[0.06] p-5 text-start shadow-[0_24px_60px_rgba(0,0,0,0.2)] sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item}
                className="rounded-[18px] border border-white/10 bg-white/[0.08] px-4 py-3 text-[14px] font-bold leading-6 text-white/88"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CleaningIssueLinksSection({
  content,
  locale,
}: {
  content: CleaningPageContent;
  locale: Locale;
}) {
  const copy = ISSUE_LINKS_COPY_BY_LOCALE[locale];
  const links = content.issueLinks ?? ISSUE_LINKS_BY_LOCALE[locale];

  if (links.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-[#E7DDD3] bg-[#FFFDF9] py-10 sm:py-12">
      <div className="pr-site-container">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
          <div className="text-start">
            <SectionEyebrow className="mb-3">{content.issueLinksEyebrow ?? copy.eyebrow}</SectionEyebrow>
            <h2 className="max-w-4xl text-3xl font-extrabold leading-[1.08] tracking-[0] text-[#0E1A2B] sm:text-5xl">
              {content.issueLinksTitle ?? copy.title}
            </h2>
          </div>
          <p className="max-w-2xl text-start text-[16px] font-semibold leading-8 text-[#526174]">
            {content.issueLinksIntro ?? copy.intro}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex min-h-[178px] flex-col justify-between rounded-[20px] border border-[#E7DDD3] bg-[#F7F1E8] p-5 text-start transition duration-300 hover:-translate-y-0.5 hover:border-[#B8643E]/50 hover:bg-white hover:shadow-lg hover:shadow-[#0E1A2B]/[0.06]"
            >
              <div>
                <span className="mb-4 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#8F4C2F]">
                  {link.tag}
                </span>
                <h3 className="break-words text-[18px] font-black leading-snug text-[#0E1A2B] transition-colors group-hover:text-[#8F4C2F]">
                  {link.title}
                </h3>
              </div>
              <p className="mt-4 text-[13.5px] font-semibold leading-6 text-[#526174]">
                {link.text}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function MaterialBoundarySection({ content }: { content: CleaningPageContent }) {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="pr-site-container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-start">
          <div className="text-start">
            <SectionEyebrow className="mb-3">{content.materialEyebrow}</SectionEyebrow>
            <h2 className="text-[32px] font-black leading-[1.1] tracking-[0] text-[#0E1A2B] sm:text-[44px]">
              {content.materialTitle}
            </h2>
            <p className="mt-5 text-[17px] leading-8 text-[#4A5568]">{content.materialIntro}</p>
          </div>
          <div className="grid gap-4">
            {content.materialCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] p-5 text-start"
              >
                <h3 className="break-words text-[18px] font-black leading-tight text-[#0E1A2B]">
                  {card.title}
                </h3>
                <p className="mt-3 text-[15px] font-semibold leading-7 text-[#536170]">{card.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)]">
          <div className="rounded-[24px] border border-[#D9C7BA] bg-[#F7F1E8] p-6 text-start">
            <h3 className="text-[26px] font-black leading-tight text-[#0E1A2B]">{content.boundaryTitle}</h3>
          </div>
          <div className="grid gap-3">
            {content.boundaryItems.map((item) => (
              <p
                key={item}
                className="rounded-[18px] border border-[#E2E8F0] bg-white px-5 py-4 text-[15px] font-semibold leading-7 text-[#1F2F3D]"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RoutingLinksSection({ content }: { content: CleaningPageContent }) {
  return (
    <section className="border-y border-[#E7DDD3] bg-[#FFFDF9] py-14 sm:py-20">
      <div className="pr-site-container">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
          <div className="text-start">
            <SectionEyebrow className="mb-3">{content.routingEyebrow}</SectionEyebrow>
            <h2 className="max-w-4xl text-3xl font-extrabold leading-[1.1] tracking-[0] text-[#0E1A2B] sm:text-5xl">
              {content.routingTitle}
            </h2>
          </div>
          <p className="max-w-2xl text-start text-[16px] font-semibold leading-8 text-[#526174]">
            {content.routingIntro}
          </p>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.routingLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex min-h-[190px] flex-col justify-between rounded-[20px] border border-[#E7DDD3] bg-[#F7F1E8] p-5 text-start transition duration-300 hover:-translate-y-0.5 hover:border-[#B8643E]/50 hover:bg-white hover:shadow-lg hover:shadow-[#0E1A2B]/[0.06]"
            >
              <div>
                <div className="mb-4 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#8F4C2F]">
                  {link.tag}
                </div>
                <h3 className="break-words text-[18px] font-black leading-snug text-[#0E1A2B] transition-colors group-hover:text-[#8F4C2F]">
                  {link.title}
                </h3>
              </div>
              <p className="mt-4 text-[13.5px] font-semibold leading-6 text-[#526174]">{link.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function WerbeanlagenReinigungPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = getLocale(locale);
  const content = getContent(safeLocale);
  const globalCms = await getGlobalPageCmsContent(safeLocale);
  const headerContent = globalCms?.header ? { ...globalCms.header, links: undefined } : null;
  const jsonLd = buildCleaningPageJsonLd(safeLocale, content);
  const recognitionCopy = RECOGNITION_COPY_BY_LOCALE[safeLocale];
  const requestPrefillMessage = content.requestPrefillMessage ?? REQUEST_PREFILL_BY_LOCALE[safeLocale];

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F7F1E8] text-[#15202A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Header content={headerContent} />
      <main>
        <LeistungenRepairHeroSlider
          title={content.heroTitle}
          subline={content.heroSubline}
          slides={[{ src: CLEANING_HERO_IMAGE, alt: content.heroImageAlt, objectPosition: 'center 15%' }]}
          breadcrumbs={getCleaningBreadcrumbs(safeLocale, content.serviceName)}
        />

        <LeistungenCleaningWorkflow
          cases={content.recognitionCards ?? CLEANING_CASES_BY_LOCALE[safeLocale]}
          title={content.recognitionTitle ?? recognitionCopy.title}
          intro={content.recognitionIntro ?? recognitionCopy.intro}
          locale={safeLocale}
          formTitle={content.finalRequestTitle}
        />

        <CleaningIssueLinksSection content={content} locale={safeLocale} />

        <LeistungenCleaningProofStrip locale={safeLocale} />

        <ScopeCardsSection content={content} />

        <PhotoAssessmentSection content={content} locale={safeLocale} />

        <MaterialBoundarySection content={content} />

        <RoutingLinksSection content={content} />

        <FAQSection
          content={{ title: content.faqTitle, items: content.faqs }}
          titleClassName="text-3xl font-extrabold leading-[1.08] tracking-[0] text-[#0E1A2B] sm:text-5xl"
        />

        <LeistungenFooterCTA
          locale={safeLocale}
          finalHeadline={content.finalHeadline}
          finalText={content.finalText}
          requestTitle={content.finalRequestTitle}
          requestText={content.finalText}
          requestCta={content.finalRequestCta}
          serviceIntent="cleaning-final-request"
          initialIssueType="Cleaning"
          initialMessage={requestPrefillMessage}
          imageSrc={CLEANING_HERO_IMAGE}
          imageAlt={content.heroImageAlt}
        />
      </main>
      <Footer content={globalCms?.footer} />
    </div>
  );
}
