import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionEyebrow from '@/components/common/SectionEyebrow';
import { getGlobalPageCmsContent } from '@/lib/cms/pages';
import LeistungenRepairHeroSlider from '@/components/leistungen/LeistungenRepairHeroSlider';
import LeistungenReparaturWorkflow from '@/components/leistungen/LeistungenReparaturWorkflow';
import LeistungenDigitalDiagnosis from '@/components/leistungen/LeistungenDigitalDiagnosis';
import LeistungenDiagnosticPrototype from '@/components/leistungen/LeistungenDiagnosticPrototype';
import LeistungenFooterCTA from '@/components/sections/LeistungenFooterCTA';
import { SITE_BASE_URL, buildLanguageAlternates, buildLocaleUrl } from '@/lib/seo';

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';
type JsonLdObject = Record<string, unknown>;

type Symptom = {
  id: string;
  title: string;
  cardText: string;
  reassuringText: string;
  prefillMessage: string;
};

type RepairInfoStep = {
  title: string;
  text: string;
};

type RepairFaqItem = {
  question: string;
  answer: string;
};

type RepairRelatedLink = {
  label: string;
  href: string;
};

type LandingPageContent = {
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubline: string;
  heroImage: string;
  symptomsTitle: string;
  closeLabel: string;
  formTitle: string;
  trustTitle: string;
  trustPoints: string[];
  finalHeadline: string;
  finalText: string;
  symptoms: Symptom[];
};

type RepairProcessContent = {
  eyebrow: string;
  title: string;
  steps: RepairInfoStep[];
};

type RepairFaqContent = {
  eyebrow: string;
  title: string;
  items: RepairFaqItem[];
};

type RepairRelatedContent = {
  eyebrow: string;
  title: string;
  links: RepairRelatedLink[];
};

const CONTENT: Record<Locale, LandingPageContent> = {
  de: {
    metaTitle: 'Werbeanlagen-Reparatur & Instandsetzung in Berlin & Brandenburg | PixelRing',
    metaDescription: 'Reparatur von Werbeanlagen, Lichtwerbung, LED-Systemen und Leuchtkästen in Berlin & Brandenburg. Einschätzung nach Foto oder Beschreibung, direkter PixelRing Service.',
    heroTitle: 'Werbeanlagen-Reparatur und Lichtwerbung-Service in Berlin & Brandenburg',
    heroSubline: 'Direkter PixelRing Service für Leuchtkästen, LED-Beleuchtung, Profilbuchstaben, Folien und Befestigungen. Senden Sie ein Foto oder eine Beschreibung — wir prüfen die Situation und schlagen den nächsten Schritt vor.',
    heroImage: '/images/leistungen/hero-repair.png',
    symptomsTitle: 'Typische Defekte & Symptome',
    closeLabel: 'Schließen',
    formTitle: 'Reparatur anfragen',
    trustTitle: 'Zuverlässiger Rahmen für Ihren Auftrag',
    trustPoints: [
      'Direktkontakt: Keine Vermittlungsplattform — Ihre Anfrage geht direkt an PixelRing.',
      'Region: Berlin & Brandenburg sind das Kerngebiet für Diagnose und Reparatur vor Ort.',
      'Erste Einschätzung: Fotos, kurze Videos oder eine Beschreibung helfen, Konstruktion, Zugang und Defekt einzuordnen.',
      'Sicherheit: Bei Feuchtigkeit, Funken, offenen Leitungen oder lockerer Befestigung klären wir zuerst den sicheren nächsten Schritt.',
      'Gewährleistung: Bis zu 24 Monate, abhängig von ausgeführter Arbeit, Material und Einsatzbedingungen.',
      'Umsetzung: Formular und AI helfen bei der Vorbereitung, die Arbeiten werden durch PixelRing Spezialisten ausgeführt.',
    ],
    finalHeadline: 'Unsicher, ob Ihre Störung behoben werden kann?',
    finalText: 'Senden Sie uns einfach ein Foto oder eine kurze Beschreibung. PixelRing prüft die Informationen und schlägt den nächsten sinnvollen Schritt vor.',
    symptoms: [
      {
        id: 'flackern',
        title: 'Flackern & Lichtausfall',
        cardText: 'LED-Module blinken, flackern oder leuchten unregelmäßig. Meist liegt der Fehler an defekten Netzteilen oder eindringender Feuchtigkeit.',
        reassuringText: 'Keine Sorge, das ist ein typisches Problem. In 90% der Fälle liegt es am Netzteil (Konverter) oder an feuchten Kabeln. Wir tauschen das defekte Bauteil direkt vor Ort aus.',
        prefillMessage: 'Defekt: Flackern & Lichtausfall bei der Werbeanlage.',
      },
      {
        id: 'led-letters',
        title: 'Ausfall einzelner Buchstaben',
        cardText: 'Ein Buchstabe oder ein Teil des Schriftzugs leuchtet nicht mehr. Häufig ist eine unterbrochene Reihenschaltung der LED-Ketten oder ein defekter Trafo die Ursache.',
        reassuringText: 'Das ist oft schnell behoben. Wir prüfen die Kabelverbindungen und LED-Ketten des betroffenen Buchstabens und erneuern die Beleuchtung punktuell.',
        prefillMessage: 'Defekt: Einzelne Buchstaben leuchten nicht mehr.',
      },
      {
        id: 'rain-short',
        title: 'Kurzschluss & Wasserschaden',
        cardText: 'Die Sicherung fliegt bei Regen oder feuchtem Wetter raus. Wasser dringt in Gehäuse oder Verkabelung ein.',
        reassuringText: 'Sicherheit steht an erster Stelle. Feuchtigkeit kann die gesamte Elektronik beschädigen. Wir trocknen die Anlage, dichten die Gehäuse ab und erneuern beschädigte Leitungen.',
        prefillMessage: 'Defekt: Kurzschluss nach Regen / Feuchtigkeit.',
      },
      {
        id: 'trafo',
        title: 'Defekter Trafo & Netzteil-Tausch',
        cardText: 'Die Anlage bleibt komplett dunkel. Oft ist ein Ausfall des Netzteils (Konverters) durch Verschleiß die Ursache.',
        reassuringText: 'Netzteile sind Verschleißteile. Unsere Techniker haben gängige 12V- und 24V-Konverter direkt im Servicefahrzeug und tauschen diese sofort aus.',
        prefillMessage: 'Defekt: Defekter Trafo / Netzteil-Tausch.',
      },
      {
        id: 'structure',
        title: 'Mechanischer Schaden & Sturm',
        cardText: 'Risse in Acrylfronten, beschädigte Rahmen, lose Halterungen oder Schäden durch Sturm und Vandalismus gefährden die Standfestigkeit.',
        reassuringText: 'Sicherheit steht an erster Stelle. Wir sichern lose Teile und erneuern die beschädigten Acryl- oder Metallkomponenten fachgerecht vor Ort.',
        prefillMessage: 'Defekt: Mechanischer Schaden an der Werbeanlage.',
      },
      {
        id: 'film',
        title: 'Foliendefekte & Ablösungen',
        cardText: 'Werbefolien lösen sich von Schaufenstern oder Leuchtkästen, schlagen Blasen oder sind durch UV-Strahlung stark ausgeblichen.',
        reassuringText: 'Wir entfernen alte Folienrückstände rückstandslos und bringen hochwertige, UV-beständige Spezialfolien neu auf Ihre Werbeflächen auf.',
        prefillMessage: 'Defekt: Foliendefekte oder abgelöste Beschriftung.',
      },
      {
        id: 'neon',
        title: 'Neon-Reparatur & Gasentladung',
        cardText: 'Klassische Leuchtröhren flackern, glimmen nur rötlich oder sind gebrochen. Glasbruch oder Trafoschaden.',
        reassuringText: 'Echtes Neon ist Handarbeit. Wir reparieren die Glassegmente in unserer Werkstatt oder tauschen die Hochspannungstransformatoren fachgerecht aus.',
        prefillMessage: 'Defekt: Reparatur klassische Neon-Werbung.',
      },
      {
        id: 'mounting',
        title: 'Lockere Montage & Befestigung',
        cardText: 'Halterungen sind verrostet, Schrauben lose oder die Anlage wackelt bei Wind. Es besteht akute Absturzgefahr.',
        reassuringText: 'Ein loses Schild ist ein Haftungsrisiko. Wir sichern die Anlage umgehend vor Ort, tauschen Befestigungsteile aus und prüfen die Statik.',
        prefillMessage: 'Defekt: Lockere Befestigung / Montageprüfung.',
      },
      {
        id: 'custom-issue',
        title: 'Andere Störung / Nicht dabei?',
        cardText: 'Haben Sie ein anderes Problem? Beschreiben Sie es kurz, und wir erstellen Ihnen ein individuelles Angebot.',
        reassuringText: 'Beschreiben Sie den Defekt einfach in Ihren eigenen Worten. Wir reparieren alle Werbeanlagen und finden schnell eine Lösung.',
        prefillMessage: '',
      },
    ],
  },
  ru: {
    metaTitle: 'Ремонт и обслуживание наружной рекламы в Берлине и Бранденбурге | PixelRing',
    metaDescription: 'Ремонт световой рекламы, вывесок, LED-систем и коробов в Берлине и Бранденбурге. Оценка после фото или описания, прямой сервис PixelRing.',
    heroTitle: 'Ремонт вывесок и световой рекламы в Берлине и Бранденбурге',
    heroSubline: 'Прямой сервис PixelRing для световых коробов, LED-подсветки, букв, пленок и креплений. Пришлите фото или описание — специалисты оценят ситуацию и предложат следующий шаг.',
    heroImage: '/images/leistungen/hero-repair.png',
    symptomsTitle: 'Выберите вашу неисправность',
    closeLabel: 'Закрыть',
    formTitle: 'Запросить ремонт',
    trustTitle: 'Надежные условия выполнения заказа',
    trustPoints: [
      'Прямой контакт: Никаких бирж и посредников — вы работаете напрямую с PixelRing.',
      'Регион: Берлин и Бранденбург — основной район обслуживания для диагностики и ремонта на месте.',
      'Первичная оценка: Фото, короткое видео или описание помогают заранее понять тип вывески, доступ и возможный дефект.',
      'Безопасность: При влаге, искрении, открытых проводах или слабом креплении сначала уточняем риск и безопасный следующий шаг.',
      'Гарантия: До 24 месяцев в зависимости от выполненной работы, материала и условий эксплуатации.',
      'Исполнение: Форма и AI помогают подготовить заявку, а работы выполняют специалисты PixelRing.',
    ],
    finalHeadline: 'Не уверены, подлежит ли вывеска ремонту?',
    finalText: 'Просто пришлите фото или описание проблемы. Специалисты PixelRing проверят фото или описание и предложат следующий шаг.',
    symptoms: [
      {
        id: 'flackern',
        title: 'Мерцание и гаснет свет',
        cardText: 'Светодиодные модули мигают, мерцают или светятся неравномерно. Обычно виноват блок питания (трансформатор) или попадание влаги.',
        reassuringText: 'Не беспокойтесь, это типичная поломка. В 90% случаев дело в блоке питания (трансформаторе) или окислении контактов из-за влаги. Мы заменим неисправный элемент прямо на месте.',
        prefillMessage: 'Проблема: Мерцание или пропал свет у вывески.',
      },
      {
        id: 'led-letters',
        title: 'Не горит часть букв',
        cardText: 'Одна буква или часть надписи погасла. Часто причиной является разрыв цепи светодиодов или отдельный трансформатор буквы.',
        reassuringText: 'Это обычно быстро решается. Мы проверим цепь проводки и светодиодные модули конкретной буквы и точечно заменим элементы подсветки.',
        prefillMessage: 'Проблема: Не горят отдельные буквы вывески.',
      },
      {
        id: 'rain-short',
        title: 'Короткое замыкание и влага',
        cardText: 'Выбивает автомат во время дождя или влажной погоды. Вода проникает внутрь корпуса или кабельных соединений.',
        reassuringText: 'Безопасность превыше всего. Вода внутри корпуса может повредить всю светотехнику. Мы осушим конструкцию, найдем место протечки, восстановим герметичность и заменим поврежденные участки кабеля.',
        prefillMessage: 'Проблема: Короткое замыкание после дождя.',
      },
      {
        id: 'trafo',
        title: 'Замена блока питания',
        cardText: 'Вывеска полностью не включается. Часто причиной является естественный износ или перегорание трансформатора.',
        reassuringText: 'Блок питания — это расходный материал с ограниченным ресурсом. У наших мастеров с собой всегда есть ходовые модели блоков на 12V и 24V. Мы заменим его за один рабочий выезд.',
        prefillMessage: 'Проблема: Не работает блок питания / требуется замена.',
      },
      {
        id: 'structure',
        title: 'Механические повреждения',
        cardText: 'Трещины на акриле, сломанные рамы, расшатанные крепления после шторма или вандализма представляют опасность.',
        reassuringText: 'Безопасность превыше всего. Мы закрепим опасные элементы и профессионально заменим поврежденные акриловые или металлические детали.',
        prefillMessage: 'Проблема: Механическое повреждение рекламной конструкции.',
      },
      {
        id: 'film',
        title: 'Отслоение и выцветание пленок',
        cardText: 'Пленки отходят от витрин или коробов, вздуваются пузырями или сильно выцвели под солнцем.',
        reassuringText: 'Мы аккуратно удалим остатки старого клея и нанесем качественную УФ-стойкую специализированную пленку заново.',
        prefillMessage: 'Проблема: Отслоение или выцветание пленки.',
      },
      {
        id: 'neon',
        title: 'Ремонт классического неона',
        cardText: 'Неоновые трубки тускло светятся красным, мигают или разбиты. Требуется ремонт стекла или замена высоковольтного трансформатора.',
        reassuringText: 'Классический неон — это ручная работа из стекла. Мы аккуратно снимем поврежденные элементы, изготовим новые трубки в нашей стеклодувной мастерской или заменим ВВ-трансформатор.',
        prefillMessage: 'Проблема: Ремонт классического неона.',
      },
      {
        id: 'mounting',
        title: 'Проблемы с крепежом и монтажом',
        cardText: 'Кронштейны заржавели, болты ослабли или вывеска качается при ветре. Существует реальный риск падения конструкции.',
        reassuringText: 'Риск падения — это юридическая ответственность. Мы оперативно закрепим конструкцию, заменим изношенные анкеры и проверим надежность всех узлов крепления.',
        prefillMessage: 'Проблема: Проблемы с крепежом или монтажной прочностью.',
      },
      {
        id: 'custom-issue',
        title: 'Другая неисправность',
        cardText: 'Не нашли вашу проблему в списке? Опишите ее своими словами, и мы подготовим индивидуальное решение.',
        reassuringText: 'Опишите неисправность в свободной форме. Мы работаем со всеми типами наружной рекламы и решим вашу задачу в кратчайшие сроки.',
        prefillMessage: '',
      },
    ],
  },
  en: {
    metaTitle: 'Signage Repair & Maintenance in Berlin & Brandenburg | PixelRing',
    metaDescription: 'Repair for signs, illuminated advertising, LED systems and lightboxes in Berlin & Brandenburg. Photo-based first assessment and direct PixelRing service.',
    heroTitle: 'Signage and illuminated advertising repair in Berlin & Brandenburg',
    heroSubline: 'Direct PixelRing service for lightboxes, LED lighting, channel letters, films and fixings. Send a photo or short description — specialists review the situation and suggest the next step.',
    heroImage: '/images/leistungen/hero-repair.png',
    symptomsTitle: 'Select your issue for a quick assessment',
    closeLabel: 'Close',
    formTitle: 'Request repair',
    trustTitle: 'A reliable framework for your order',
    trustPoints: [
      'Direct contact: No middleman or listing platform — your request goes directly to PixelRing.',
      'Region: Berlin & Brandenburg are the core service area for on-site diagnosis and repair.',
      'First assessment: Photos, short videos or a description help clarify the sign type, access and likely defect.',
      'Safety first: If there is moisture, sparking, exposed wiring or loose mounting, we clarify the safe next step first.',
      'Warranty: Up to 24 months depending on the completed work, material and operating conditions.',
      'Execution: The form and AI help prepare the request; PixelRing specialists coordinate and perform the work.',
    ],
    finalHeadline: 'Unsure if your defect can be repaired?',
    finalText: 'Simply send a photo or short description. PixelRing reviews the information and suggests the next practical step.',
    symptoms: [
      {
        id: 'flackern',
        title: 'Flickering & Light Failure',
        cardText: 'LED modules blinking, flickering, or glowing unevenly. Usually caused by faulty power supplies or water ingress.',
        reassuringText: "Don't worry, this is a typical problem. In 90% of cases, it's the power supply (converter) or wet cables. We replace the faulty component directly on-site.",
        prefillMessage: 'Defect: Flickering & Light Failure of the sign.',
      },
      {
        id: 'led-letters',
        title: 'Failure of Single Letters',
        cardText: 'One letter or part of the lettering no longer lights up. Often due to a broken series connection of the LED strings or a faulty transformer.',
        reassuringText: 'This is often quickly resolved. We check the cable connections and LED strings of the affected letter and renew the illumination selectively.',
        prefillMessage: 'Defect: Single letters no longer light up.',
      },
      {
        id: 'rain-short',
        title: 'Short Circuit & Water Damage',
        cardText: 'The fuse blows when it rains or during damp weather. Water enters the casing or electrical wiring.',
        reassuringText: 'Safety is our top priority. Moisture can damage the entire electronics. We dry the system, seal the housing, and renew damaged lines.',
        prefillMessage: 'Defect: Short circuit after rain / moisture.',
      },
      {
        id: 'trafo',
        title: 'Defective Transformer / PSU',
        cardText: 'The system remains completely dark. Often caused by converter failure due to wear and tear.',
        reassuringText: 'Power supplies are wear items. Our technicians have common 12V and 24V converters right in the service vehicle and replace them immediately.',
        prefillMessage: 'Defect: Faulty transformer / PSU replacement.',
      },
      {
        id: 'structure',
        title: 'Mechanical & Storm Damage',
        cardText: 'Cracks in acrylic faces, damaged frames, loose mountings, or damage from storm and vandalism compromise stability.',
        reassuringText: 'Safety comes first. We secure loose parts and renew the damaged acrylic or metal components professionally on-site.',
        prefillMessage: 'Defect: Mechanical damage to the sign.',
      },
      {
        id: 'film',
        title: 'Vinyl Defects & Peeling',
        cardText: 'Advertising films peeling from windows or lightboxes, bubbling, or heavily faded due to UV exposure.',
        reassuringText: 'We clean off old adhesive residues completely and apply high-quality, UV-resistant special films fresh on your advertising surfaces.',
        prefillMessage: 'Defect: Vinyl defects or peeling lettering.',
      },
      {
        id: 'neon',
        title: 'Neon Repair & Gas Discharge',
        cardText: 'Classic neon tubes flicker, glow dimly red, or are broken. Glass breakage or transformer damage.',
        reassuringText: 'Genuine neon is handcraft. We repair the glass segments in our workshop or replace the high-voltage transformers professionally.',
        prefillMessage: 'Defect: Repair of classic neon signage.',
      },
      {
        id: 'mounting',
        title: 'Loose Mounting & Fixing',
        cardText: 'Brackets are rusted, bolts loose, or the system wobbles in the wind. Acute danger of falling.',
        reassuringText: 'A loose sign is a liability risk. We secure the sign immediately, replace fixing hardware, and check static integrity.',
        prefillMessage: 'Defect: Loose mounting / structural check.',
      },
      {
        id: 'custom-issue',
        title: 'Other Issue / Not Listed?',
        cardText: 'Do you have another problem? Describe it briefly, and we will prepare a custom proposal.',
        reassuringText: 'Simply describe the defect in your own words. We repair all types of outdoor signs and find a quick solution.',
        prefillMessage: '',
      },
    ],
  },
  tr: {
    metaTitle: 'Tabela Onarım & Bakım Hizmetleri Berlin & Brandenburg | PixelRing',
    metaDescription: 'Berlin & Brandenburg’da tabela, ışıklı reklam, LED sistemleri ve ışıklı kutu onarımı. Fotoğraf veya açıklamaya göre ön değerlendirme, doğrudan PixelRing servisi.',
    heroTitle: 'Berlin & Brandenburg’da tabela ve ışıklı reklam onarımı',
    heroSubline: 'Işıklı kutular, LED aydınlatma, harf tabelalar, folyolar ve bağlantı elemanları için doğrudan PixelRing servisi. Fotoğraf veya kısa açıklama gönderin — uzmanlar durumu inceler ve sonraki adımı önerir.',
    heroImage: '/images/leistungen/hero-repair.png',
    symptomsTitle: 'Hızlı bir değerlendirme için sorununuzu seçin',
    closeLabel: 'Kapat',
    formTitle: 'Onarım talep et',
    trustTitle: 'Siparişiniz için güvenilir bir çerçeve',
    trustPoints: [
      "Doğrudan iletişim: Aracı veya ilan platformu yok — talebiniz doğrudan PixelRing'e iletilir.",
      'Bölge: Berlin & Brandenburg yerinde teşhis ve onarım için ana hizmet bölgemizdir.',
      'Ön değerlendirme: Fotoğraf, kısa video veya açıklama; tabela türünü, erişimi ve olası arızayı anlamaya yardımcı olur.',
      'Güvenlik: Nem, kıvılcım, açık kablo veya gevşek bağlantı varsa önce güvenli sonraki adımı netleştiririz.',
      'Garanti: Yapılan işe, malzemeye ve kullanım koşullarına bağlı olarak 24 aya kadar.',
      'Uygulama: Form ve AI talebi hazırlamaya yardımcı olur; işi PixelRing uzmanları koordine eder ve yürütür.',
    ],
    finalHeadline: 'Arızanızın giderilip giderilemeyeceğinden emin değil misiniz?',
    finalText: 'Bize bir fotoğraf veya kısa açıklama gönderin. PixelRing bilgileri kontrol eder ve uygun sonraki adımı önerir.',
    symptoms: [
      {
        id: 'flackern',
        title: 'Titreme & Işık Kesintisi',
        cardText: 'LED modüllerinin yanıp sönmesi, titremesi veya düzensiz ışık vermesi. Genellikle arızalı güç kaynaklarından veya nemden kaynaklanır.',
        reassuringText: "Endişelenmeyin, bu çok tipik bir sorundur. Vakaların %90'ında sorun güç kaynağından (konvertör) veya nemli kablolardan kaynaklanır. Arızalı parçayı doğrudan yerinde değiştiririz.",
        prefillMessage: 'Arıza: Tabelada titreme ve ışık kesintisi.',
      },
      {
        id: 'led-letters',
        title: 'Tekli Harf Arızası',
        cardText: 'Bir harfin veya logonun bir kısmının artık yanmaması. Genellikle LED serisi bağlantısındaki kopukluk veya arızalı trafo nedeniyledir.',
        reassuringText: 'Bu genellikle hızlı bir şekilde çözülür. Etkilenen harfin kablo bağlantılarını ve LED serilerini kontrol edip aydınlatmayı lokal olarak yenileriz.',
        prefillMessage: 'Arıza: Bazı harfler artık yanmıyor.',
      },
      {
        id: 'rain-short',
        title: 'Kısa Devre & Su Teması',
        cardText: 'Yağmurda veya nemli havalarda sigorta atıyor. Su, kasaya veya elektrik kablolarına sızıyor.',
        reassuringText: 'Güvenlik her şeyden önce gelir. Nem, tüm elektroniğe zarar verebilir. Sistemi kurutur, kasayı sızdırmaz hale getirir ve hasarlı kabloları yenileriz.',
        prefillMessage: 'Arıza: Yağmur / nem sonrası kısa devre.',
      },
      {
        id: 'trafo',
        title: 'Arızalı Trafo / Güç Kaynağı',
        cardText: 'Sistem tamamen karanlık kalıyor. Çoğunlukla aşınma nedeniyle konvertör arızasından kaynaklanır.',
        reassuringText: 'Güç kaynakları sarf malzemeleridir. Teknisyenlerimizin servis aracında yaygın 12V ve 24V konvertörler mevcuttur ve hemen değiştirirler.',
        prefillMessage: 'Arıza: Güç kaynağı / trafo değişimi.',
      },
      {
        id: 'structure',
        title: 'Mekanik Hasar & Fırtına',
        cardText: 'Akrilik ön yüzeylerde çatlaklar, hasarlı çerçeveler, gevşek montaj aparatları veya fırtına ve vandalizm hasarları dayanıklılığı tehlikeye atar.',
        reassuringText: 'Güvenlik her şeyden önce gelir. Gevşek parçaları sabitler ve hasarlı akrilik veya metal bileşenleri yerinde profesyonelce yenileriz.',
        prefillMessage: 'Arıza: Tabelada mekanik hasar.',
      },
      {
        id: 'film',
        title: 'Folyo Hataları & Sökülmeler',
        cardText: 'Vitrinlerden veya ışıklı kutulardan sökülen, kabaran veya UV ışınları nedeniyle rengi solmuş reklam folyoları.',
        reassuringText: 'Eski folyo kalıntılarını yüzeye zarar vermeden tamamen temizler ve reklam alanlarınıza yüksek kaliteli, UV ışınlarına dayanıklı özel folyoları yeniden uygularız.',
        prefillMessage: 'Arıza: Folyo hatası veya sökülen yazı.',
      },
      {
        id: 'neon',
        title: 'Neon Onarımı & Deşarj',
        cardText: 'Klasik neon tüpleri titriyor, sadece kırmızımsı parlıyor veya kırılmış. Cam kırılması veya trafo hasarı.',
        reassuringText: 'Gerçek neon el işçiliğidir. Cam segmentlerini atölyemizde onarır veya yüksek gerilim trafolarını profesyonelce değiştiririz.',
        prefillMessage: 'Arıza: Klasik neon tabela onarımı.',
      },
      {
        id: 'mounting',
        title: 'Gevşek Montaj & Sabitleme',
        cardText: 'Braketler paslanmış, cıvatalar gevşemiş veya tabela rüzgarda sallanıyor. Düşme riski var.',
        reassuringText: 'Gevşek bir tabela sorumluluk riski taşır. Tabelayı derhal güvenli hale getirir, sabitleme aparatlarını değiştirir ve statik dayanımı kontrol ederiz.',
        prefillMessage: 'Arıza: Gevşek montaj / sabitleme kontrolü.',
      },
      {
        id: 'custom-issue',
        title: 'Diğer Sorun / Listede Yok?',
        cardText: 'Başka bir sorununuz mu var? Kısaca açıklayın, size özel bir teklif hazırlayalım.',
        reassuringText: 'Arızayı kendi kelimelerinizle açıklamanız yeterlidir. Tüm dış mekan tabelalarını onarır ve hızlıca bir çözüm buluruz.',
        prefillMessage: '',
      },
    ],
  },
  pl: {
    metaTitle: 'Naprawa & Konserwacja Reklam Berlin & Brandenburg | PixelRing',
    metaDescription: 'Naprawa szyldów, reklam świetlnych, systemów LED i kasetonów w Berlinie i Brandenburgii. Wstępna ocena po zdjęciu lub opisie, bezpośredni serwis PixelRing.',
    heroTitle: 'Naprawa szyldów i reklam świetlnych w Berlinie i Brandenburgii',
    heroSubline: 'Bezpośredni serwis PixelRing dla kasetonów, LED, liter przestrzennych, folii i mocowań. Wyślij zdjęcie lub krótki opis — specjaliści ocenią sytuację i zaproponują następny krok.',
    heroImage: '/images/leistungen/hero-repair.png',
    symptomsTitle: 'Wybierz swój problem w celu szybkiej oceny',
    closeLabel: 'Zamknij',
    formTitle: 'Zgłoś naprawę',
    trustTitle: 'Niezawodne ramy dla Twojego zlecenia',
    trustPoints: [
      'Bezpośredni kontakt: To nie portal ani giełda zleceń — Twoje zgłoszenie trafia bezpośrednio do PixelRing.',
      'Region: Berlin i Brandenburgia to główny obszar diagnostyki i napraw na miejscu.',
      'Wstępna ocena: Zdjęcia, krótkie wideo lub opis pomagają określić typ reklamy, dostęp i możliwą usterkę.',
      'Bezpieczeństwo: Przy wilgoci, iskrzeniu, odsłoniętych przewodach lub luźnym mocowaniu najpierw ustalamy bezpieczny kolejny krok.',
      'Gwarancja: Do 24 miesięcy w zależności od wykonanej pracy, materiału i warunków użytkowania.',
      'Realizacja: Formularz i AI pomagają przygotować zgłoszenie, a prace koordynują i wykonują specjaliści PixelRing.',
    ],
    finalHeadline: 'Nie masz pewności, czy usterka może zostać naprawiona?',
    finalText: 'Wyślij zdjęcie lub krótki opis. PixelRing sprawdzi informacje i zaproponuje kolejny rozsądny krok.',
    symptoms: [
      {
        id: 'flackern',
        title: 'Migotanie & Brak Światła',
        cardText: 'Moduły LED migają, migoczą lub świecą nierównomiernie. Najczęściej przyczyną są uszkodzone zasilacze lub wilgoć.',
        reassuringText: 'Bez obaw, to typowy problem. W 90% przypadków wina leży po stronie zasilacza (konwertera) lub zawilgoconych kabli. Uszkodzony element wymieniamy bezpośrednio na miejscu.',
        prefillMessage: 'Usterka: Migotanie lub brak światła w reklamie.',
      },
      {
        id: 'led-letters',
        title: 'Awaria Pojedynczych Liter',
        cardText: 'Jedna litera lub część napisu już nie świeci. Często przyczyną jest przerwanie szeregowego połączenia LED lub uszkodzony transformator litery.',
        reassuringText: 'To często da się szybko naprawić. Sprawdzamy połączenia kablowe i łańcuchy LED danej litery i punktowo wymieniamy oświetlenie.',
        prefillMessage: 'Usterka: Pojedyncze litery nie świecą.',
      },
      {
        id: 'rain-short',
        title: 'Zwarcie & Zamoczenie',
        cardText: 'Bezpiecznik wyskakuje podczas deszczu lub wilgotnej pogody. Woda wnika do obudowy lub przewodów.',
        reassuringText: 'Bezpieczeństwo przede wszystkim. Wilgoć może uszkodzić całą elektronikę. Osuszamy instalację, uszczelniamy obudowę i wymieniamy uszkodzone kable.',
        prefillMessage: 'Usterka: Zwarcie po deszczu / wilgoć.',
      },
      {
        id: 'trafo',
        title: 'Uszkodzony Transformator / Zasilacz',
        cardText: 'Reklama pozostaje całkowicie ciemna. Często spowodowane zużyciem zasilacza (konwertera).',
        reassuringText: 'Zasilacze są elementami zużywalnymi. Nasi technicy posiadają popularne konwertery 12V i 24V bezpośrednio w samochodzie serwisowym i wymieniają je od ręki.',
        prefillMessage: 'Usterka: Uszkodzony transformator / wymiana zasilacza.',
      },
      {
        id: 'structure',
        title: 'Uszkodzenia Mechaniczne & Wichura',
        cardText: 'Pęknięcia frontów akrylowych, uszkodzone ramy, poluzowane mocowania lub uszkodzenia spowodowane wichurą i wandalizmem zagrażają stabilności.',
        reassuringText: 'Bezpieczeństwo jest najważniejsze. Zabezpieczamy luźne elementy i fachowo wymieniamy uszkodzone części akrylowe lub metalowe na miejscu.',
        prefillMessage: 'Usterka: Uszkodzenie mechaniczne reklamy.',
      },
      {
        id: 'film',
        title: 'Uszkodzenia Folii & Odklejanie',
        cardText: 'Folie reklamowe odklejające się od witryn lub kasetonów, pęcherze lub mocno wyblakłe od promieniowania UV.',
        reassuringText: 'Usuwamy całkowicie resztki starego kleju i nakładamy nowe, wysokiej jakości folie specjalne odporne na promieniowanie UV.',
        prefillMessage: 'Usterka: Uszkodzenie folii lub odklejający się napis.',
      },
      {
        id: 'neon',
        title: 'Naprawa Neonu & Wyładowanie',
        cardText: 'Klasyczne szklane rury migoczą, świecą tylko na czerwono lub są pęknięte. Uszkodzenie szkła lub transformatora.',
        reassuringText: 'Prawdziwy neon to rękodzieło. Naprawiamy szklane elementy w naszym warsztacie lub profesjonalnie wymieniamy transformatory wysokiego napięcia.',
        prefillMessage: 'Usterka: Naprawa klasycznej reklamy neonowej.',
      },
      {
        id: 'mounting',
        title: 'Poluzowany Montaż & Mocowanie',
        cardText: 'Uchwyty są zardzewiałe, śruby luźne lub reklama chwieje się na wietrze. Ostre zagrożenie odpadnięciem.',
        reassuringText: 'Poluzowana reklama to ryzyko odpowiedzialności prawnej. Natychmiast zabezpieczamy instalację na miejscu, wymieniamy elementy mocujące i sprawdzamy statykę.',
        prefillMessage: 'Usterka: Poluzowane mocowanie / kontrola statyczna.',
      },
      {
        id: 'custom-issue',
        title: 'Inna Usterka / Brak na Liście?',
        cardText: 'Masz inny problem? Opisz go krótko, a my przygotujemy dla Ciebie indywidualną ofertę.',
        reassuringText: 'Po prostu opisz usterkę własnymi słowami. Naprawiamy wszystkie rodzaje reklam i szybko znajdziemy rozwiązanie.',
        prefillMessage: '',
      },
    ],
  },
  ar: {
    metaTitle: 'إصلاح وصيانة اللوحات الإعلانية في برلين وبراندنبورغ | PixelRing',
    metaDescription: 'إصلاح اللوحات الإعلانية والإعلانات المضيئة وأنظمة LED والصناديق المضيئة في برلين وبراندنبورغ. تقييم أولي بعد صورة أو وصف وخدمة مباشرة من PixelRing.',
    heroTitle: 'إصلاح اللوحات والإعلانات المضيئة في برلين وبراندنبورغ',
    heroSubline: 'خدمة PixelRing مباشرة للصناديق المضيئة، وإضاءة LED، والحروف المضيئة، والأفلام اللاصقة، والتثبيت. أرسل صورة أو وصفًا قصيرًا — يراجع المختصون الحالة ويقترحون الخطوة التالية.',
    heroImage: '/images/leistungen/hero-repair.png',
    symptomsTitle: 'اختر مشكلتك للحصول على تقييم سريع',
    closeLabel: 'إغلاق',
    formTitle: 'طلب إصلاح',
    trustTitle: 'إطار موثوق لطلبك',
    trustPoints: [
      'اتصال مباشر: لا توجد منصة وساطة — يذهب طلبك مباشرة إلى PixelRing.',
      'المنطقة: برلين وبراندنبورغ هما نطاق الخدمة الأساسي للتشخيص والإصلاح في الموقع.',
      'تقييم أولي: تساعد الصور أو الفيديو القصير أو الوصف في فهم نوع اللوحة والوصول والخلل المحتمل.',
      'السلامة أولاً: عند وجود رطوبة أو شرر أو أسلاك مكشوفة أو تثبيت ضعيف نوضح أولاً الخطوة الآمنة التالية.',
      'الضمان: حتى 24 شهرًا حسب العمل المنفذ والمواد وظروف التشغيل.',
      'التنفيذ: يساعد النموذج والذكاء الاصطناعي في تجهيز الطلب، بينما ينسق مختصو PixelRing العمل وينفذونه.',
    ],
    finalHeadline: 'هل أنت غير متأكد مما إذا كان من الممكن إصلاح العطل؟',
    finalText: 'أرسل صورة أو وصفًا قصيرًا. تراجع PixelRing المعلومات وتقترح الخطوة العملية التالية.',
    symptoms: [
      {
        id: 'flackern',
        title: 'الوميض وانقطاع الضوء',
        cardText: 'تومض وحدات LED أو تضيء بشكل غير منتظم. عادةً ما يكون السبب هو تلف مزودات الطاقة أو تسرب الرطوبة.',
        reassuringText: 'لا تقلق، هذه مشكلة شائعة. في 90% من الحالات يكون السبب هو مزود الطاقة (المحول) أو الكابلات الرطبة. نقوم باستبدال المكون التالف مباشرة في الموقع.',
        prefillMessage: 'عطل: ومض أو انقطاع الضوء في اللوحة الإعلانية.',
      },
      {
        id: 'led-letters',
        title: 'عطل في أحرف فردية',
        cardText: 'لم يعد هناك ضوء في حرف واحد أو جزء من اللوحة. غالبًا ما يكون ذلك بسبب انقطاع التوصيل المتسلسل لسلاسل LED أو تلف محول الحرف.',
        reassuringText: 'غالبًا ما يتم حل هذا بسرعة. نقوم بفحص توصيلات الكابلات وسلاسل LED للحرف المتأثر وتجديد الإضاءة بشكل محدد.',
        prefillMessage: 'عطل: لم تعد الأحرف الفردية تضيء.',
      },
      {
        id: 'rain-short',
        title: 'ماس كهربائي وتلف المياه',
        cardText: 'ينقطع المفتاح الكهربائي عند هطول الأمطار أو الطقس الرطب. تدخل المياه إلى الهيكل أو الأسلاك.',
        reassuringText: 'السلامة هي الأولوية القصوى. الرطوبة يمكن أن تتلف النظام بأكمله. نقوم بتجفيف النظام، إحكام إغلاق الهيكل وتجديد الخطوط التالفة.',
        prefillMessage: 'عطل: ماس كهربائي بعد المطر / الرطوبة.',
      },
      {
        id: 'trafo',
        title: 'تلف المحول / مزود الطاقة',
        cardText: 'يظل النظام مظلماً تماماً. غالباً بسبب عطل المحول الناتج عن الاستهلاك المفرط.',
        reassuringText: 'مزودات الطاقة هي عناصر مستهلكة. يمتلك فنيونا محولات شائعة بقوة 12 فولت و24 فولت في مركبة الخدمة ويستبدلونها على الفور.',
        prefillMessage: 'عطل: تلف المحول / استبدال مزود الطاقة.',
      },
      {
        id: 'structure',
        title: 'الأضرار الميكانيكية والعواصف',
        cardText: 'التشققات في الواجهات الأكريليكية، الإطارات التالفة، الحوامل المرتخية، أو الأضرار الناجمة عن العواصف والتخريب تهدد الاستقرار.',
        reassuringText: 'السلامة تأتي أولاً. نقوم بتأمين الأجزاء المرتخية وتجديد المكونات الأكريليكية أو المعدنية التالفة باحترافية في الموقع.',
        prefillMessage: 'عطل: ضرر ميكانيكي في اللوحة الإعلانية.',
      },
      {
        id: 'film',
        title: 'عيوب وتقشير الفينيل',
        cardText: 'تقشير ملصقات الإعلانات من واجهات المحلات أو الصناديق المضيئة، أو وجود فقاعات، أو بهتان شديد بسبب الأشعة فوق البنفسجية.',
        reassuringText: 'نقوم بإزالة بقايا الغراء القديم تمامًا ونضع ملصقات فينيل خاصة جديدة وعالية الجودة ومقاومة للأشعة فوق البنفسجية على الأسطح الإعلانية الخاصة بك.',
        prefillMessage: 'عطل: عيب في الفينيل أو تقشر الكتابة.',
      },
      {
        id: 'neon',
        title: 'إصلاح النيون الكلاسيكي',
        cardText: 'تومض أنابيب النيون الكلاسيكية، أو تتوهج باللون الأحمر الخافت، أو تنكسر. كسر في الزجاج أو تلف المحول.',
        reassuringText: 'النيون الحقيقي هو عمل يدوي. نقوم بإصلاح المقاطع الزجاجية في ورشتنا أو استبدال محولات الجهد العالي بشكل احترافي.',
        prefillMessage: 'عطل: إصلاح لافتات النيون الكلاسيكية.',
      },
      {
        id: 'mounting',
        title: 'ارتخاء التثبيت والتركيب',
        cardText: 'الحوامل متآكلة، أو البراغي مرتخية، أو اللوحة تتأرجح في مهب الريح. هناك خطر حاد من سقوطها.',
        reassuringText: 'اللافتات المرتخية تمثل خطراً قانونياً. نقوم بتأمين اللوحة فوراً في الموقع، ونستبدل أجزاء التثبيت ونفحص الثبات الإنشائي.',
        prefillMessage: 'عطل: ارتخاء التثبيت / فحص الثبات.',
      },
      {
        id: 'custom-issue',
        title: 'مشكلة أخرى / غير مدرجة؟',
        cardText: 'هل لديك مشكلة أخرى؟ صفها بإيجاز، وسنعد لك عرضاً مخصصاً.',
        reassuringText: 'ببساطة صف العطل بكلماتك الخاصة. نحن نصلح جميع أنواع اللافتات الخارجية ونجد حلاً سريعاً.',
        prefillMessage: '',
      },
    ],
  },
};

const HERO_SLIDE_SOURCES = [
  '/images/leistungen/repair-hero/hero-sign-repair-01.jpg',
  '/images/leistungen/repair-hero/hero-led-diagnostics-02.jpg',
  '/images/leistungen/repair-hero/hero-channel-letter-03.jpg',
  '/images/leistungen/repair-hero/hero-rain-damage-04.jpg',
] as const;

const HERO_SLIDE_ALTS_BY_LOCALE: Record<Locale, string[]> = {
  de: [
    'Techniker repariert einen geöffneten Lichtkasten an einer Ladenfassade',
    'LED-Module und Verkabelung werden mit einem Messgerät geprüft',
    'Techniker repariert beleuchtete Profilbuchstaben an einer Fassade',
    'Techniker prüft Feuchtigkeitsschaden an einer Werbeanlage nach Regen',
  ],
  en: [
    'Technician repairing an open illuminated lightbox on a storefront facade',
    'LED modules and wiring checked with a measuring device',
    'Technician repairing illuminated channel letters on a building facade',
    'Technician checking moisture damage on an outdoor sign after rain',
  ],
  ru: [
    'Специалист ремонтирует открытый световой короб на фасаде магазина',
    'Проверка LED-модулей и проводки измерительным прибором',
    'Ремонт световых объемных букв на фасаде здания',
    'Проверка повреждения вывески после влаги и дождя',
  ],
  tr: [
    'Bir teknisyen mağaza cephesindeki açık ışıklı kutuyu onarıyor',
    'LED modülleri ve kablolar ölçüm cihazıyla kontrol ediliyor',
    'Bir teknisyen cephedeki ışıklı harfleri onarıyor',
    'Yağmurdan sonra dış mekan tabelasında nem hasarı kontrol ediliyor',
  ],
  pl: [
    'Technik naprawia otwarty kaseton świetlny na fasadzie sklepu',
    'Moduły LED i okablowanie sprawdzane miernikiem',
    'Technik naprawia podświetlane litery przestrzenne na fasadzie',
    'Technik sprawdza uszkodzenie reklamy zewnętrznej po wilgoci i deszczu',
  ],
  ar: [
    'فني يصلح صندوقًا ضوئيًا مفتوحًا على واجهة متجر',
    'فحص وحدات LED والأسلاك بجهاز قياس',
    'فني يصلح حروفًا مضيئة على واجهة مبنى',
    'فحص ضرر الرطوبة في لوحة خارجية بعد المطر',
  ],
};

const REPAIR_PAGE_PATH = '/leistungen/werbeanlagen-reparatur';

const REPAIR_PROCESS_BY_LOCALE: Record<Locale, RepairProcessContent> = {
  de: {
    eyebrow: 'Nach der Diagnose',
    title: 'So läuft die Anfrage ab',
    steps: [
      { title: 'Foto oder Beschreibung', text: 'Sie senden Gesamtansicht, Detailbild und eine kurze Beschreibung des Symptoms.' },
      { title: 'Erste Prüfung', text: 'PixelRing ordnet Konstruktion, sichtbaren Defekt und mögliche Risiken ein.' },
      { title: 'Zugang und Adresse', text: 'Wir klären Höhe, Zugang, Stadt oder PLZ, um den Einsatzrahmen zu verstehen.' },
      { title: 'Einsatz oder Abstimmung', text: 'Je nach Datenlage folgt ein Vor-Ort-Termin oder eine gezielte Rückfrage.' },
      { title: 'Reparatur und Status', text: 'Nach der Prüfung werden abgestimmte Arbeiten ausgeführt und der nächste Status kommuniziert.' },
    ],
  },
  en: {
    eyebrow: 'After diagnosis',
    title: 'How the request works',
    steps: [
      { title: 'Photo or description', text: 'Send an overview, a detail photo and a short description of the symptom.' },
      { title: 'Initial review', text: 'PixelRing classifies the sign type, visible defect and possible risks.' },
      { title: 'Access and address', text: 'We clarify height, access, city or postal code to understand the visit conditions.' },
      { title: 'Visit or coordination', text: 'Depending on the information, the next step is an on-site diagnosis or a focused follow-up.' },
      { title: 'Repair and status', text: 'After review, agreed work is carried out and the next status is communicated.' },
    ],
  },
  ru: {
    eyebrow: 'После диагностики',
    title: 'Как проходит заявка',
    steps: [
      { title: 'Фото или описание', text: 'Вы отправляете общий вид вывески, проблемное место и короткое описание симптома.' },
      { title: 'Первичная проверка', text: 'PixelRing уточняет тип конструкции, видимый дефект и возможные риски.' },
      { title: 'Уточнение доступа и адреса', text: 'Проверяем высоту, доступ, город или PLZ, чтобы понять условия выезда.' },
      { title: 'Выезд или согласование', text: 'Если данных достаточно, согласуется следующий шаг: диагностика на месте или подготовка ремонта.' },
      { title: 'Ремонт и следующий статус', text: 'После проверки специалисты выполняют согласованные работы и сообщают дальнейший статус.' },
    ],
  },
  tr: {
    eyebrow: 'Teşhisten sonra',
    title: 'Talep süreci nasıl ilerler',
    steps: [
      { title: 'Fotoğraf veya açıklama', text: 'Tabelanın genel görünümünü, sorunlu noktayı ve kısa belirti açıklamasını gönderirsiniz.' },
      { title: 'İlk kontrol', text: 'PixelRing yapı tipini, görünen arızayı ve olası riskleri sınıflandırır.' },
      { title: 'Erişim ve adres', text: 'Yükseklik, erişim, şehir veya posta kodu netleştirilir.' },
      { title: 'Ziyaret veya netleştirme', text: 'Bilgi durumuna göre yerinde teşhis veya hedefli bir geri soru planlanır.' },
      { title: 'Onarım ve durum', text: 'Kontrolden sonra onaylanan işler yapılır ve sonraki durum paylaşılır.' },
    ],
  },
  pl: {
    eyebrow: 'Po diagnostyce',
    title: 'Jak przebiega zgłoszenie',
    steps: [
      { title: 'Zdjęcie lub opis', text: 'Wysyłasz widok ogólny reklamy, problematyczne miejsce i krótki opis objawu.' },
      { title: 'Wstępna ocena', text: 'PixelRing określa typ konstrukcji, widoczny defekt i możliwe ryzyka.' },
      { title: 'Dostęp i adres', text: 'Ustalamy wysokość, dostęp, miasto lub kod pocztowy, aby ocenić warunki dojazdu.' },
      { title: 'Wizyta lub ustalenia', text: 'W zależności od danych następuje diagnostyka na miejscu albo doprecyzowanie informacji.' },
      { title: 'Naprawa i status', text: 'Po sprawdzeniu wykonywane są uzgodnione prace i przekazywany jest kolejny status.' },
    ],
  },
  ar: {
    eyebrow: 'بعد التشخيص',
    title: 'كيف يسير الطلب',
    steps: [
      { title: 'صورة أو وصف', text: 'ترسل منظرًا عامًا للوحة، ومكان المشكلة، ووصفًا قصيرًا للعرض.' },
      { title: 'مراجعة أولية', text: 'تحدد PixelRing نوع اللوحة والخلل الظاهر والمخاطر المحتملة.' },
      { title: 'الوصول والعنوان', text: 'نوضح الارتفاع وطريقة الوصول والمدينة أو الرمز البريدي لفهم شروط الزيارة.' },
      { title: 'زيارة أو تنسيق', text: 'حسب المعلومات المتاحة، تكون الخطوة التالية تشخيصًا في الموقع أو توضيحًا إضافيًا.' },
      { title: 'إصلاح وحالة الطلب', text: 'بعد الفحص تنفذ الأعمال المتفق عليها ويتم توضيح الحالة التالية.' },
    ],
  },
};

const REPAIR_FAQ_BY_LOCALE: Record<Locale, RepairFaqContent> = {
  de: {
    eyebrow: 'Häufige Fragen',
    title: 'Was vor der Anfrage wichtig ist',
    items: [
      { question: 'Welche Werbeanlagen repariert PixelRing?', answer: 'PixelRing nimmt Anfragen zu Leuchtkästen, LED-Beleuchtung, Profilbuchstaben, Folien, Fassadenschildern, Paneelen und Befestigungen an. Zuerst klären wir Konstruktion, sichtbaren Defekt, Zugang und Standort, danach schlagen wir den nächsten Schritt vor.' },
      { question: 'Kann eine Reparatur anhand von Fotos eingeschätzt werden?', answer: 'Ja, Fotos oder ein kurzes Video helfen oft, Symptome wie dunkle Buchstaben, flackernde LED, gelöste Folie, Feuchtigkeit oder lockere Befestigung einzuordnen. Es bleibt eine erste Einschätzung; die finale Entscheidung hängt von Zugang, Material und Prüfung vor Ort ab.' },
      { question: 'Was tun bei Funken, Brandgeruch, Feuchtigkeit oder lockeren Teilen?', answer: 'Wenn es gefahrlos möglich ist, schalten Sie die Anlage spannungsfrei. Halten Sie Abstand zu offenen Leitungen, feuchten Gehäusen und losen Teilen. Senden Sie Fotos und Beschreibung, damit PixelRing zuerst den sicheren nächsten Schritt einordnet.' },
      { question: 'Führt PixelRing selbst aus oder vermittelt PixelRing nur?', answer: 'PixelRing arbeitet als eine verantwortliche Servicefirma. Die Anfrage geht direkt an PixelRing, nicht an eine Börse oder ein Verzeichnis von Handwerkern. Formular und AI helfen beim Sammeln der Daten, die Arbeit wird durch PixelRing Spezialisten koordiniert und ausgeführt.' },
      { question: 'Gibt es Garantie auf die Reparatur?', answer: 'Ja, die Gewährleistung kann bis zu 24 Monate betragen, abhängig von ausgeführter Arbeit, Material und Einsatzbedingungen. Der konkrete Umfang wird nach Bewertung des Defekts und Abstimmung der Arbeiten geklärt.' },
      { question: 'Muss ich die Werbeanlage vorab öffnen?', answer: 'Nein. Öffnen Sie kein Gehäuse, berühren Sie keine elektrischen Teile und steigen Sie nicht in die Höhe. Für die erste Einschätzung reichen sichere Fotos aus Abstand, Symptombeschreibung, Standort und ungefähre Montagehöhe.' },
    ],
  },
  en: {
    eyebrow: 'FAQ',
    title: 'What to know before sending a request',
    items: [
      { question: 'Which signs and illuminated advertising can PixelRing repair?', answer: 'PixelRing handles requests for lightboxes, LED lighting, channel letters, films, facade signs, panels and fixings. We first clarify the sign type, visible defect, access and location, then suggest the next step.' },
      { question: 'Can the repair be assessed from photos?', answer: 'Yes, photos or a short video often help identify symptoms such as a dark letter, flickering LED, peeling film, moisture or loose mounting. This is a first assessment; the final decision depends on access, materials and on-site checks.' },
      { question: 'What should I do if the sign sparks, smells burnt, is wet or loose?', answer: 'If it can be done safely, switch off the power. Keep away from exposed wiring, wet housings and loose parts. Send photos and a description so PixelRing can first define the safe next step.' },
      { question: 'Does PixelRing perform the repair or pass it to contractors?', answer: 'PixelRing works as one accountable service company. Your request goes directly to PixelRing, not to a marketplace or contractor directory. The form and AI help collect details, while PixelRing specialists coordinate and perform the work.' },
      { question: 'Is there a warranty for the repair?', answer: 'Yes, warranty can be up to 24 months depending on the completed work, material and operating conditions. The exact scope is clarified after the defect is assessed and the work is agreed.' },
      { question: 'Do I need to open the sign before sending a request?', answer: 'No. Do not open the housing, touch electrical parts or climb to reach the sign. Safe photos from a distance, symptom description, location and approximate mounting height are enough for the first assessment.' },
    ],
  },
  ru: {
    eyebrow: 'Частые вопросы',
    title: 'Что важно знать перед заявкой',
    items: [
      { question: 'Какие вывески и световую рекламу ремонтирует PixelRing?', answer: 'PixelRing принимает заявки по световым коробам, LED-подсветке, объемным буквам, пленкам, фасадным вывескам, панелям и креплениям. Сначала мы уточняем тип конструкции, видимый дефект, доступ и адрес, затем предлагаем следующий шаг.' },
      { question: 'Можно ли оценить ремонт по фото?', answer: 'Да, фото или короткое видео часто помогают понять симптом: не горит буква, мерцает LED, отошла пленка, попала влага или ослабло крепление. Это предварительная оценка, финальное решение зависит от доступа, материалов и проверки на месте.' },
      { question: 'Что делать, если вывеска искрит, пахнет гарью или повреждена после дождя?', answer: 'Если это можно сделать безопасно, отключите питание. Не подходите к открытым проводам, влажным корпусам и болтающимся частям. Передайте фото и описание специалистам PixelRing, чтобы сначала определить безопасный следующий шаг.' },
      { question: 'PixelRing сам выполняет ремонт или передает заявку мастерам?', answer: 'PixelRing работает как одна ответственная сервисная компания: заявка идет напрямую в PixelRing, а не в биржу или каталог мастеров. Форма и AI помогают собрать данные, но работу координируют и выполняют специалисты PixelRing.' },
      { question: 'Есть ли гарантия на ремонт вывески?', answer: 'Да, гарантия может составлять до 24 месяцев в зависимости от выполненной работы, материала и условий эксплуатации. Конкретный объем гарантии уточняется после оценки дефекта и согласования работ.' },
      { question: 'Нужно ли самому разбирать вывеску перед заявкой?', answer: 'Нет. Не вскрывайте корпус, не прикасайтесь к электрическим элементам и не поднимайтесь на высоту. Для первой оценки достаточно безопасных фото с расстояния, описания симптома, адреса или района и примерной высоты установки.' },
    ],
  },
  tr: {
    eyebrow: 'Sık sorulan sorular',
    title: 'Talep göndermeden önce bilinmesi gerekenler',
    items: [
      { question: 'PixelRing hangi tabela ve ışıklı reklamları onarır?', answer: 'PixelRing ışıklı kutular, LED aydınlatma, harf tabelalar, folyolar, cephe tabelaları, paneller ve bağlantı elemanları için talepleri kabul eder. Önce yapı tipi, görünen arıza, erişim ve adres netleştirilir, ardından sonraki adım önerilir.' },
      { question: 'Onarım fotoğrafa göre değerlendirilebilir mi?', answer: 'Evet, fotoğraf veya kısa video; yanmayan harf, titreyen LED, sökülen folyo, nem veya gevşek bağlantı gibi belirtileri anlamaya yardımcı olur. Bu ön değerlendirmedir; son karar erişime, malzemeye ve yerinde kontrole bağlıdır.' },
      { question: 'Tabela kıvılcım çıkarıyor, yanık kokuyor, ıslandı veya gevşediyse ne yapmalıyım?', answer: 'Güvenli şekilde yapılabiliyorsa elektriği kapatın. Açık kablolara, ıslak kasalara ve sallanan parçalara yaklaşmayın. Fotoğraf ve açıklama gönderin; PixelRing önce güvenli sonraki adımı belirler.' },
      { question: 'PixelRing işi kendi mi yapar yoksa ustalara mı aktarır?', answer: 'PixelRing tek sorumlu servis şirketi olarak çalışır. Talep doğrudan PixelRing’e gider; bir aracı platform veya usta kataloğu değildir. Form ve AI bilgileri toplamaya yardımcı olur, işi PixelRing uzmanları koordine eder ve yürütür.' },
      { question: 'Tabela onarımında garanti var mı?', answer: 'Evet, garanti yapılan işe, malzemeye ve kullanım koşullarına bağlı olarak 24 aya kadar olabilir. Kesin kapsam arızanın değerlendirilmesi ve işlerin onaylanmasından sonra netleşir.' },
      { question: 'Talep göndermeden önce tabelayı sökmem gerekir mi?', answer: 'Hayır. Kasayı açmayın, elektrikli parçalara dokunmayın ve yüksekliğe çıkmayın. İlk değerlendirme için güvenli mesafeden fotoğraf, belirti açıklaması, adres veya bölge ve yaklaşık montaj yüksekliği yeterlidir.' },
    ],
  },
  pl: {
    eyebrow: 'Częste pytania',
    title: 'Co warto wiedzieć przed zgłoszeniem',
    items: [
      { question: 'Jakie szyldy i reklamy świetlne naprawia PixelRing?', answer: 'PixelRing przyjmuje zgłoszenia dotyczące kasetonów świetlnych, LED, liter przestrzennych, folii, szyldów fasadowych, paneli i mocowań. Najpierw ustalamy typ konstrukcji, widoczny defekt, dostęp i adres, a następnie proponujemy kolejny krok.' },
      { question: 'Czy można ocenić naprawę na podstawie zdjęć?', answer: 'Tak, zdjęcia lub krótkie wideo często pomagają rozpoznać objaw: nie świeci litera, LED miga, folia się odkleja, pojawiła się wilgoć albo poluzowało się mocowanie. To ocena wstępna; decyzja końcowa zależy od dostępu, materiałów i kontroli na miejscu.' },
      { question: 'Co zrobić, jeśli reklama iskrzy, pachnie spalenizną, zamokła albo się rusza?', answer: 'Jeśli można to zrobić bezpiecznie, odłącz zasilanie. Nie podchodź do odsłoniętych przewodów, mokrych obudów ani luźnych elementów. Przekaż zdjęcia i opis specjalistom PixelRing, aby najpierw ustalić bezpieczny kolejny krok.' },
      { question: 'Czy PixelRing wykonuje naprawę samodzielnie czy przekazuje zlecenie dalej?', answer: 'PixelRing działa jako jedna odpowiedzialna firma serwisowa. Zgłoszenie trafia bezpośrednio do PixelRing, a nie na giełdę ani do katalogu wykonawców. Formularz i AI pomagają zebrać dane, a prace koordynują i wykonują specjaliści PixelRing.' },
      { question: 'Czy naprawa szyldu ma gwarancję?', answer: 'Tak, gwarancja może wynosić do 24 miesięcy w zależności od wykonanej pracy, materiału i warunków użytkowania. Konkretny zakres jest ustalany po ocenie usterki i uzgodnieniu prac.' },
      { question: 'Czy przed zgłoszeniem trzeba rozebrać reklamę?', answer: 'Nie. Nie otwieraj obudowy, nie dotykaj elementów elektrycznych i nie wchodź na wysokość. Do pierwszej oceny wystarczą bezpieczne zdjęcia z dystansu, opis objawu, adres lub dzielnica i przybliżona wysokość montażu.' },
    ],
  },
  ar: {
    eyebrow: 'أسئلة شائعة',
    title: 'ما المهم قبل إرسال الطلب',
    items: [
      { question: 'ما أنواع اللوحات والإعلانات المضيئة التي تصلحها PixelRing؟', answer: 'تستقبل PixelRing طلبات الصناديق المضيئة، وإضاءة LED، والحروف المضيئة، والأفلام اللاصقة، ولوحات الواجهات، والألواح، والتثبيت. نوضح أولًا نوع اللوحة والخلل الظاهر وطريقة الوصول والعنوان، ثم نقترح الخطوة التالية.' },
      { question: 'هل يمكن تقييم الإصلاح من خلال الصور؟', answer: 'نعم، تساعد الصور أو الفيديو القصير غالبًا في فهم العرض مثل حرف لا يضيء، أو LED يومض، أو فيلم لاصق يتقشر، أو رطوبة، أو تثبيت ضعيف. هذا تقييم أولي، أما القرار النهائي فيعتمد على الوصول والمواد والفحص في الموقع.' },
      { question: 'ماذا أفعل إذا كانت اللوحة تصدر شررًا أو رائحة احتراق أو تضررت بعد المطر؟', answer: 'إذا كان ذلك ممكنًا بأمان، افصل الكهرباء. لا تقترب من الأسلاك المكشوفة أو الهياكل الرطبة أو الأجزاء المتحركة. أرسل الصور والوصف إلى مختصي PixelRing لتحديد الخطوة الآمنة التالية أولًا.' },
      { question: 'هل تنفذ PixelRing الإصلاح بنفسها أم تحول الطلب إلى فنيين آخرين؟', answer: 'تعمل PixelRing كشركة خدمة واحدة مسؤولة. يذهب الطلب مباشرة إلى PixelRing، وليس إلى سوق أو دليل فنيين. يساعد النموذج والذكاء الاصطناعي في جمع البيانات، بينما ينسق مختصو PixelRing العمل وينفذونه.' },
      { question: 'هل توجد ضمانات على إصلاح اللوحة؟', answer: 'نعم، يمكن أن يصل الضمان إلى 24 شهرًا حسب العمل المنفذ والمواد وظروف التشغيل. يتم توضيح النطاق المحدد بعد تقييم العطل والاتفاق على الأعمال.' },
      { question: 'هل يجب أن أفك اللوحة قبل إرسال الطلب؟', answer: 'لا. لا تفتح الهيكل، ولا تلمس الأجزاء الكهربائية، ولا تصعد إلى ارتفاع. تكفي للمرحلة الأولى صور آمنة من مسافة، ووصف العرض، والعنوان أو المنطقة، والارتفاع التقريبي للتركيب.' },
    ],
  },
};

const REPAIR_RELATED_BY_LOCALE: Record<Locale, RepairRelatedContent> = {
  de: {
    eyebrow: 'Symptome',
    title: 'Mehr zu typischen Störungen',
    links: [
      { label: 'Werbeanlage leuchtet nicht', href: '/de/probleme-loesungen/werbeanlage-leuchtet-nicht' },
      { label: 'Werbeanlage flackert', href: '/de/probleme-loesungen/werbeanlage-flackert' },
      { label: 'Buchstabe leuchtet nicht', href: '/de/probleme-loesungen/buchstabe-leuchtet-nicht' },
      { label: 'nach Regen fällt die Sicherung', href: '/de/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab' },
      { label: 'Folie löst sich', href: '/de/probleme-loesungen/folie-loest-sich' },
      { label: 'LED leuchtet ungleichmäßig', href: '/de/probleme-loesungen/led-leuchtet-ungleichmaessig' },
    ],
  },
  en: {
    eyebrow: 'Symptoms',
    title: 'More on common sign defects',
    links: [
      { label: 'sign does not light up', href: '/en/probleme-loesungen/werbeanlage-leuchtet-nicht' },
      { label: 'sign flickers', href: '/en/probleme-loesungen/werbeanlage-flackert' },
      { label: 'letter does not light up', href: '/en/probleme-loesungen/buchstabe-leuchtet-nicht' },
      { label: 'breaker trips after rain', href: '/en/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab' },
      { label: 'film is peeling', href: '/en/probleme-loesungen/folie-loest-sich' },
      { label: 'LED lights unevenly', href: '/en/probleme-loesungen/led-leuchtet-ungleichmaessig' },
    ],
  },
  ru: {
    eyebrow: 'Симптомы',
    title: 'Подробнее по типичным неисправностям',
    links: [
      { label: 'вывеска не светится', href: '/ru/probleme-loesungen/werbeanlage-leuchtet-nicht' },
      { label: 'вывеска мерцает', href: '/ru/probleme-loesungen/werbeanlage-flackert' },
      { label: 'не горит буква', href: '/ru/probleme-loesungen/buchstabe-leuchtet-nicht' },
      { label: 'выбивает автомат после дождя', href: '/ru/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab' },
      { label: 'пленка отклеивается', href: '/ru/probleme-loesungen/folie-loest-sich' },
      { label: 'LED светит неравномерно', href: '/ru/probleme-loesungen/led-leuchtet-ungleichmaessig' },
    ],
  },
  tr: {
    eyebrow: 'Belirtiler',
    title: 'Tipik arızalar hakkında daha fazla bilgi',
    links: [
      { label: 'tabela yanmıyor', href: '/tr/probleme-loesungen/werbeanlage-leuchtet-nicht' },
      { label: 'harf yanmıyor', href: '/tr/probleme-loesungen/buchstabe-leuchtet-nicht' },
      { label: 'yağmurdan sonra sigorta atıyor', href: '/tr/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab' },
      { label: 'folyo sökülüyor', href: '/tr/probleme-loesungen/folie-loest-sich' },
      { label: 'LED düzensiz yanıyor', href: '/tr/probleme-loesungen/led-leuchtet-ungleichmaessig' },
    ],
  },
  pl: {
    eyebrow: 'Objawy',
    title: 'Więcej o typowych usterkach',
    links: [
      { label: 'reklama nie świeci', href: '/pl/probleme-loesungen/werbeanlage-leuchtet-nicht' },
      { label: 'nie świeci litera', href: '/pl/probleme-loesungen/buchstabe-leuchtet-nicht' },
      { label: 'po deszczu wybija bezpiecznik', href: '/pl/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab' },
      { label: 'folia się odkleja', href: '/pl/probleme-loesungen/folie-loest-sich' },
      { label: 'LED świeci nierównomiernie', href: '/pl/probleme-loesungen/led-leuchtet-ungleichmaessig' },
    ],
  },
  ar: {
    eyebrow: 'الأعراض',
    title: 'المزيد عن الأعطال الشائعة',
    links: [
      { label: 'اللوحة لا تضيء', href: '/ar/probleme-loesungen/werbeanlage-leuchtet-nicht' },
      { label: 'حرف لا يضيء', href: '/ar/probleme-loesungen/buchstabe-leuchtet-nicht' },
      { label: 'ينقطع القاطع بعد المطر', href: '/ar/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab' },
      { label: 'الفيلم اللاصق يتقشر', href: '/ar/probleme-loesungen/folie-loest-sich' },
      { label: 'إضاءة LED غير متساوية', href: '/ar/probleme-loesungen/led-leuchtet-ungleichmaessig' },
    ],
  },
};

const SERVICE_NAME_BY_LOCALE: Record<Locale, string> = {
  de: 'Werbeanlagen-Reparatur',
  en: 'Signage repair',
  ru: 'Ремонт вывесок и наружной рекламы',
  tr: 'Tabela onarımı',
  pl: 'Naprawa reklam i szyldów',
  ar: 'إصلاح اللوحات الإعلانية',
};

const BREADCRUMB_LABELS_BY_LOCALE: Record<
  Locale,
  { home: string; services: string; repair: string }
> = {
  de: {
    home: 'Home',
    services: 'Leistungen',
    repair: 'Werbeanlagen-Reparatur',
  },
  en: {
    home: 'Home',
    services: 'Services',
    repair: 'Signage repair',
  },
  ru: {
    home: 'Главная',
    services: 'Услуги',
    repair: 'Ремонт вывесок',
  },
  tr: {
    home: 'Ana sayfa',
    services: 'Hizmetler',
    repair: 'Tabela onarımı',
  },
  pl: {
    home: 'Strona główna',
    services: 'Usługi',
    repair: 'Naprawa reklam',
  },
  ar: {
    home: 'الرئيسية',
    services: 'الخدمات',
    repair: 'إصلاح اللوحات الإعلانية',
  },
};

const TRUST_EYEBROW_BY_LOCALE: Record<Locale, string> = {
  de: 'Unsere Standards',
  en: 'PixelRing standards',
  ru: 'Стандарты PixelRing',
  tr: 'PixelRing standartları',
  pl: 'Standardy PixelRing',
  ar: 'معايير PixelRing',
};

function getContent(locale: string): LandingPageContent {
  return CONTENT[locale as Locale] ?? CONTENT.de;
}

function getLocale(locale: string): Locale {
  return (locale in CONTENT ? locale : 'de') as Locale;
}

function getHeroSlides(locale: string) {
  const safeLocale = getLocale(locale);
  const alts = HERO_SLIDE_ALTS_BY_LOCALE[safeLocale];

  return HERO_SLIDE_SOURCES.map((src, index) => ({
    src,
    alt: alts[index] ?? alts[0] ?? '',
  }));
}

function buildRepairPageJsonLd(locale: string, content: LandingPageContent) {
  const safeLocale = getLocale(locale);
  const canonicalUrl = buildLocaleUrl(safeLocale, REPAIR_PAGE_PATH);
  const breadcrumbLabels = BREADCRUMB_LABELS_BY_LOCALE[safeLocale];
  const provider = {
    '@type': 'Organization',
    name: 'PixelRing',
    url: SITE_BASE_URL,
  };
  const jsonLd: JsonLdObject[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: SERVICE_NAME_BY_LOCALE[safeLocale],
      serviceType: SERVICE_NAME_BY_LOCALE[safeLocale],
      description: content.metaDescription,
      provider,
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
    },
    {
      '@context': 'https://schema.org',
      ...provider,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: breadcrumbLabels.home,
          item: buildLocaleUrl(safeLocale),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: breadcrumbLabels.services,
          item: buildLocaleUrl(safeLocale, '/leistungen'),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: breadcrumbLabels.repair,
          item: canonicalUrl,
        },
      ],
    },
  ];

  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: REPAIR_FAQ_BY_LOCALE[safeLocale].items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  });

  return jsonLd;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = getContent(locale);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `/${locale}/leistungen/werbeanlagen-reparatur`,
      languages: buildLanguageAlternates(REPAIR_PAGE_PATH),
    },
  };
}

export default async function WerbeanlagenReparaturPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = getContent(locale);
  const globalCms = await getGlobalPageCmsContent(locale);
  const safeLocale = getLocale(locale);
  const processContent = REPAIR_PROCESS_BY_LOCALE[safeLocale];
  const faqContent = REPAIR_FAQ_BY_LOCALE[safeLocale];
  const relatedContent = REPAIR_RELATED_BY_LOCALE[safeLocale];
  const hasLocalizedDiagnosis = safeLocale === 'de' || safeLocale === 'ru';
  const repairPageJsonLd = buildRepairPageJsonLd(locale, content);

  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#15202A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(repairPageJsonLd) }}
      />
      <Header content={globalCms?.header} />
      <main>
        <LeistungenRepairHeroSlider
          title={content.heroTitle}
          subline={content.heroSubline}
          slides={getHeroSlides(locale)}
        />

        {/* Symptoms Grid & Interactive workflow (Client Component) */}
        <LeistungenReparaturWorkflow
          symptoms={content.symptoms}
          title={content.symptomsTitle}
          locale={locale}
          closeLabel={content.closeLabel}
          formTitle={content.formTitle}
        />

        {hasLocalizedDiagnosis && <LeistungenDigitalDiagnosis locale={safeLocale} />}

        {hasLocalizedDiagnosis && <LeistungenDiagnosticPrototype locale={safeLocale} />}

        <section className="border-t border-[#E7DDD3] bg-[#FFFDF9] px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <div className="text-start">
                <SectionEyebrow className="mb-3">{processContent.eyebrow}</SectionEyebrow>
                <h2 className="text-3xl font-extrabold leading-[1.1] text-[#0E1A2B] sm:text-5xl">
                  {processContent.title}
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {processContent.steps.map((step, index) => (
                  <article
                    key={step.title}
                    className="rounded-[18px] border border-[#E7DDD3] bg-[#FFFDF9] p-4 shadow-sm"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B8643E] text-[13px] font-black text-white">
                      {index + 1}
                    </span>
                    <h3 className="mt-4 text-[16px] font-black leading-snug text-[#0E1A2B]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[13px] font-semibold leading-6 text-[#526174]">
                      {step.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[#E7DDD3] bg-[#F7F1E8] px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <div className="text-start">
                <SectionEyebrow className="mb-3">{faqContent.eyebrow}</SectionEyebrow>
                <h2 className="text-3xl font-extrabold leading-[1.1] text-[#0E1A2B] sm:text-5xl">
                  {faqContent.title}
                </h2>
              </div>
              <div className="grid gap-3">
                {faqContent.items.map((item) => (
                  <article
                    key={item.question}
                    className="rounded-[18px] border border-[#E7DDD3] bg-[#FFFDF9] p-5 shadow-sm"
                  >
                    <h3 className="text-[17px] font-black leading-snug text-[#0E1A2B]">
                      {item.question}
                    </h3>
                    <p className="mt-3 text-[14px] font-semibold leading-7 text-[#526174]">
                      {item.answer}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[#E7DDD3] bg-[#FFFDF9] px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-start">
                <SectionEyebrow className="mb-3">{relatedContent.eyebrow}</SectionEyebrow>
                <h2 className="text-2xl font-extrabold leading-[1.12] text-[#0E1A2B] sm:text-3xl">
                  {relatedContent.title}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2 lg:max-w-3xl lg:justify-end">
                {relatedContent.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-[#D9C7BA] bg-white px-4 py-2 text-[13px] font-black text-[#0E1A2B] transition hover:border-[#B8643E] hover:text-[#B8643E]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Points Section */}
        <section id="vertrauen" className="bg-[#FFFDF9] border-t border-[#E7DDD3] border-b py-16 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="ltr:text-left rtl:text-right">
              <SectionEyebrow className="mb-3">
                {TRUST_EYEBROW_BY_LOCALE[safeLocale]}
              </SectionEyebrow>
              <h2 className="mt-2 text-3xl font-extrabold leading-[1.1] text-[#0E1A2B] sm:text-5xl">
                {content.trustTitle}
              </h2>
            </div>
            <div className="grid gap-4">
              {content.trustPoints.map((point) => (
                <p
                  key={point}
                  className="rounded-[22px] border border-[#E7DDD3] bg-[#FFFDF9] px-6 py-5 text-[15px] font-semibold leading-relaxed text-[#3E4A48] shadow-sm ltr:text-left rtl:text-right"
                >
                  {point}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA form */}
        <LeistungenFooterCTA
          locale={locale}
          finalHeadline={content.finalHeadline}
          finalText={content.finalText}
        />
      </main>
      <Footer content={globalCms?.footer} />
    </div>
  );
}
