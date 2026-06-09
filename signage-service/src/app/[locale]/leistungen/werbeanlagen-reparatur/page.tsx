import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionEyebrow from '@/components/common/SectionEyebrow';
import { getGlobalPageCmsContent } from '@/lib/cms/pages';
import LeistungenRepairHeroSlider from '@/components/leistungen/LeistungenRepairHeroSlider';
import LeistungenReparaturWorkflow from '@/components/leistungen/LeistungenReparaturWorkflow';
import LeistungenDiagnosticPrototype from '@/components/leistungen/LeistungenDiagnosticPrototype';
import LeistungenRepairProofStrip from '@/components/leistungen/LeistungenRepairProofStrip';
import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';
import FAQSection from '@/components/sections/FAQSection';
import { SITE_CONFIG } from '@/lib/site-config';
import { SITE_BASE_URL, buildLanguageAlternates, buildLocaleUrl, buildSiteUrl } from '@/lib/seo';

export const revalidate = 3600;

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';
type JsonLdObject = Record<string, unknown>;

type Symptom = {
  id: string;
  title: string;
  cardText: string;
  reassuringText: string;
  prefillMessage: string;
};

type RepairFaqItem = {
  question: string;
  answer: string;
};

type LandingPageContent = {
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubline: string;
  heroImage: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  symptomsTitle: string;
  closeLabel: string;
  formTitle: string;
  finalHeadline: string;
  finalText: string;
  symptoms: Symptom[];
};

type RepairFaqContent = {
  eyebrow: string;
  title: string;
  items: RepairFaqItem[];
};

type RepairScopeCard = {
  title: string;
  text: string;
};

type RepairLinkCard = {
  title: string;
  text: string;
  href: string;
  tag: string;
};

type RepairScopeContent = {
  coverageEyebrow: string;
  coverageTitle: string;
  coverageIntro: string;
  coverageCards: RepairScopeCard[];
  digitalEyebrow: string;
  digitalTitle: string;
  digitalText: string;
  digitalCards: RepairScopeCard[];
  serviceEyebrow: string;
  serviceTitle: string;
  serviceIntro: string;
  serviceCards: RepairScopeCard[];
  checklistTitle: string;
  checklistText: string;
  checklistItems: string[];
  ctaLabel: string;
};

type RepairProblemLinksContent = {
  eyebrow: string;
  title: string;
  intro: string;
  links: RepairLinkCard[];
};

type RepairNextStepContent = {
  eyebrow: string;
  title: string;
  intro: string;
  requestTitle: string;
  requestText: string;
  requestCta: string;
  servicesTitle: string;
  servicesText: string;
  links: RepairLinkCard[];
};

const CONTENT: Record<Locale, LandingPageContent> = {
  de: {
    metaTitle: 'Werbeanlagen-Reparatur Berlin & Brandenburg | PixelRing',
    metaDescription: 'Werbeanlagen-Reparatur in Berlin & Brandenburg: PixelRing prüft Leuchtkästen, LED-Module, Buchstaben, Folien und Befestigungen per Foto oder vor Ort.',
    heroTitle: 'Werbeanlagen-Reparatur in Berlin & Brandenburg',
    heroSubline: 'Wenn eine Werbeanlage dunkel bleibt, flackert, Folie sich löst oder eine Befestigung unsicher wirkt, senden Sie einfach ein Foto. PixelRing ordnet den sichtbaren Defekt, Zugang und den sicheren nächsten Schritt ein.',
    heroImage: '/images/leistungen/hero-repair.png',
    heroPrimaryCta: 'Foto der Werbeanlage senden',
    heroSecondaryCta: 'Ähnliche Fälle ansehen',
    symptomsTitle: 'Was ist von außen sichtbar?',
    closeLabel: 'Schließen',
    formTitle: 'Reparatur anfragen',
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
        title: 'Nicht sicher? Einfach Foto senden',
        cardText: 'Sie müssen den Defekt nicht benennen. Ein Foto und ein kurzer Satz reichen für die erste Einordnung.',
        reassuringText: 'Beschreiben Sie den sichtbaren Zustand in Ihren eigenen Worten. PixelRing prüft die Fotos und schlägt den nächsten sinnvollen Schritt vor.',
        prefillMessage: '',
      },
    ],
  },
  ru: {
    metaTitle: 'Ремонт вывесок в Берлине и Бранденбурге | PixelRing',
    metaDescription: 'Ремонт вывесок в Берлине и Бранденбурге: PixelRing проверяет световые короба, LED, буквы, пленки и крепления по фото или на месте.',
    heroTitle: 'Ремонт вывесок в Берлине и Бранденбурге',
    heroSubline: 'Если вывеска не горит, мерцает, отклеилась пленка или ослабло крепление, просто отправьте фото. PixelRing оценит видимый дефект, доступ и безопасный следующий шаг.',
    heroImage: '/images/leistungen/hero-repair.png',
    heroPrimaryCta: 'Отправить фото вывески',
    heroSecondaryCta: 'Посмотреть похожие случаи',
    symptomsTitle: 'Что видно снаружи?',
    closeLabel: 'Закрыть',
    formTitle: 'Запросить ремонт',
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
        title: 'Не знаю, просто отправлю фото',
        cardText: 'Не нужно точно называть дефект. Фото и одно короткое описание уже достаточно для первичной ориентации.',
        reassuringText: 'Опишите, что видно снаружи, своими словами. PixelRing посмотрит фото и предложит следующий разумный шаг.',
        prefillMessage: '',
      },
    ],
  },
  en: {
    metaTitle: 'Signage Repair & Maintenance in Berlin & Brandenburg | PixelRing',
    metaDescription: 'Signage repair in Berlin & Brandenburg: PixelRing checks lightboxes, LED modules, channel letters, films and fixings from photos or on site.',
    heroTitle: 'Signage repair in Berlin & Brandenburg',
    heroSubline: 'If a sign stays dark, flickers, film is peeling or a fixing looks unsafe, just send a photo. PixelRing classifies the visible defect, access and the safe next step.',
    heroImage: '/images/leistungen/hero-repair.png',
    heroPrimaryCta: 'Send a photo of the sign',
    heroSecondaryCta: 'View similar cases',
    symptomsTitle: 'What is visible from outside?',
    closeLabel: 'Close',
    formTitle: 'Request repair',
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
        title: 'Not sure? Just send a photo',
        cardText: 'You do not need the technical name. A photo and one short sentence are enough for the first classification.',
        reassuringText: 'Describe what is visible from the outside in your own words. PixelRing reviews the photo and suggests the next sensible step.',
        prefillMessage: '',
      },
    ],
  },
  tr: {
    metaTitle: 'Tabela onarımı Berlin & Brandenburg | PixelRing',
    metaDescription: 'Berlin & Brandenburg tabela onarımı: PixelRing ışıklı kutu, LED, harf, folyo ve bağlantıları fotoğrafla veya yerinde kontrol eder.',
    heroTitle: 'Berlin & Brandenburg’da tabela onarımı',
    heroSubline: 'Tabela karanlık kalıyor, titriyor, folyo kalkıyor veya bağlantı güvenli görünmüyorsa fotoğraf göndermeniz yeterlidir. PixelRing görünen arızayı, erişimi ve güvenli sonraki adımı sınıflandırır.',
    heroImage: '/images/leistungen/hero-repair.png',
    heroPrimaryCta: 'Tabela fotoğrafı gönder',
    heroSecondaryCta: 'Benzer durumları gör',
    symptomsTitle: 'Dışarıdan ne görünüyor?',
    closeLabel: 'Kapat',
    formTitle: 'Onarım talep et',
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
        title: 'Emin değil misiniz? Fotoğraf gönderin',
        cardText: 'Teknik adı bilmeniz gerekmez. İlk sınıflandırma için fotoğraf ve kısa bir cümle yeterlidir.',
        reassuringText: 'Dışarıdan görünen durumu kendi kelimelerinizle anlatın. PixelRing fotoğrafı inceler ve mantıklı sonraki adımı önerir.',
        prefillMessage: '',
      },
    ],
  },
  pl: {
    metaTitle: 'Naprawa reklam Berlin & Brandenburg | PixelRing',
    metaDescription: 'Naprawa reklam w Berlinie i Brandenburgii: PixelRing sprawdza kasetony, LED, litery, folie i mocowania ze zdjęć lub na miejscu.',
    heroTitle: 'Naprawa reklam w Berlinie i Brandenburgii',
    heroSubline: 'Jeśli szyld nie świeci, miga, folia odchodzi albo mocowanie wygląda niepewnie, wystarczy zdjęcie. PixelRing oceni widoczny defekt, dostęp i bezpieczny następny krok.',
    heroImage: '/images/leistungen/hero-repair.png',
    heroPrimaryCta: 'Wyślij zdjęcie szyldu',
    heroSecondaryCta: 'Zobacz podobne przypadki',
    symptomsTitle: 'Co widać z zewnątrz?',
    closeLabel: 'Zamknij',
    formTitle: 'Zgłoś naprawę',
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
        title: 'Nie wiem, wyślę zdjęcie',
        cardText: 'Nie musisz znać technicznej nazwy usterki. Zdjęcie i jedno krótkie zdanie wystarczą do pierwszej klasyfikacji.',
        reassuringText: 'Opisz własnymi słowami, co widać z zewnątrz. PixelRing sprawdzi zdjęcie i zaproponuje rozsądny kolejny krok.',
        prefillMessage: '',
      },
    ],
  },
  ar: {
    metaTitle: 'إصلاح وصيانة اللوحات الإعلانية في برلين وبراندنبورغ | PixelRing',
    metaDescription: 'إصلاح اللوحات في برلين وبراندنبورغ: تفحص PixelRing الصناديق المضيئة وLED والحروف والأفلام والتثبيت من الصور أو في الموقع.',
    heroTitle: 'إصلاح اللوحات الإعلانية في برلين وبراندنبورغ',
    heroSubline: 'إذا كانت اللوحة مظلمة أو تومض أو يتقشر الفيلم أو يبدو التثبيت غير آمن، أرسل صورة فقط. تصنف PixelRing العطل الظاهر والوصول والخطوة الآمنة التالية.',
    heroImage: '/images/leistungen/hero-repair.png',
    heroPrimaryCta: 'إرسال صورة اللوحة',
    heroSecondaryCta: 'عرض حالات مشابهة',
    symptomsTitle: 'ما الذي يظهر من الخارج؟',
    closeLabel: 'إغلاق',
    formTitle: 'طلب إصلاح',
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
        title: 'لست متأكداً؟ أرسل صورة فقط',
        cardText: 'لا تحتاج إلى الاسم التقني للعطل. تكفي صورة وجملة قصيرة للتصنيف الأول.',
        reassuringText: 'صف ما يظهر من الخارج بكلماتك. تراجع PixelRing الصورة وتقترح الخطوة العملية التالية.',
        prefillMessage: '',
      },
    ],
  },
};

const HERO_SLIDE_SOURCES = [
  '/images/leistungen/repair-hero/hero-sign-repair-01.jpg',
  '/images/leistungen/werbeanlagen-reparatur-led-module-pruefung.png',
  '/images/leistungen/repair-hero/hero-channel-letter-03.jpg',
  '/images/leistungen/repair-hero/hero-rain-damage-04.jpg',
] as const;

const HERO_SLIDE_ALTS_BY_LOCALE: Record<Locale, string[]> = {
  de: [
    'Techniker repariert einen geöffneten Lichtkasten an einer Ladenfassade',
    'LED-Module in einem geöffneten Leuchtkasten werden mit einem Multimeter geprüft',
    'Techniker repariert beleuchtete Profilbuchstaben an einer Fassade',
    'Techniker prüft Feuchtigkeitsschaden an einer Werbeanlage nach Regen',
  ],
  en: [
    'Technician repairing an open illuminated lightbox on a storefront facade',
    'LED modules in an open illuminated sign are checked with a multimeter',
    'Technician repairing illuminated channel letters on a building facade',
    'Technician checking moisture damage on an outdoor sign after rain',
  ],
  ru: [
    'Специалист ремонтирует открытый световой короб на фасаде магазина',
    'Проверка LED-модулей в открытом световом коробе мультиметром',
    'Ремонт световых объемных букв на фасаде здания',
    'Проверка повреждения вывески после влаги и дождя',
  ],
  tr: [
    'Bir teknisyen mağaza cephesindeki açık ışıklı kutuyu onarıyor',
    'Açık bir ışıklı tabeladaki LED modülleri multimetre ile kontrol ediliyor',
    'Bir teknisyen cephedeki ışıklı harfleri onarıyor',
    'Yağmurdan sonra dış mekan tabelasında nem hasarı kontrol ediliyor',
  ],
  pl: [
    'Technik naprawia otwarty kaseton świetlny na fasadzie sklepu',
    'Moduły LED w otwartym kasetonie świetlnym sprawdzane multimetrem',
    'Technik naprawia podświetlane litery przestrzenne na fasadzie',
    'Technik sprawdza uszkodzenie reklamy zewnętrznej po wilgoci i deszczu',
  ],
  ar: [
    'فني يصلح صندوقًا ضوئيًا مفتوحًا على واجهة متجر',
    'فحص وحدات LED داخل صندوق إضاءة مفتوح باستخدام مقياس متعدد',
    'فني يصلح حروفًا مضيئة على واجهة مبنى',
    'فحص ضرر الرطوبة في لوحة خارجية بعد المطر',
  ],
};

const REPAIR_PAGE_PATH = '/leistungen/werbeanlagen-reparatur';

const REPAIR_FAQ_BY_LOCALE: Record<Locale, RepairFaqContent> = {
  de: {
    eyebrow: 'Häufige Fragen',
    title: 'Was vor der Anfrage wichtig ist',
    items: [
      { question: 'Welche Werbeanlagen repariert PixelRing?', answer: 'PixelRing nimmt Anfragen zu Leuchtkästen, LED-Beleuchtung, Profilbuchstaben, Folien, Fassadenschildern, Paneelen und Befestigungen an. Zuerst klären wir Konstruktion, sichtbaren Defekt, Zugang und Standort, danach schlagen wir den nächsten Schritt vor.' },
      { question: 'Kann eine Reparatur anhand von Fotos eingeschätzt werden?', answer: 'Ja, Fotos oder ein kurzes Video helfen oft, Symptome wie dunkle Buchstaben, flackernde LED, gelöste Folie, Feuchtigkeit oder lockere Befestigung einzuordnen. Es bleibt eine erste Einschätzung; die finale Entscheidung hängt von Zugang, Material und Prüfung vor Ort ab.' },
      { question: 'Prüft PixelRing auch Outdoor-Displays und digitale Werbeanlagen?', answer: 'Ja, PixelRing nimmt auch Anfragen zu digitalen Außenflächen, LED-Displays und Media-Player-/Controller-Störungen an. Wichtig sind Fotos vom Bildschirm, Gehäuse, Zugang, Fehlermeldung und der Hinweis, ob die Störung dauerhaft oder nur zeitweise auftritt.' },
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
      { question: 'Does PixelRing also check outdoor displays and digital signage?', answer: 'Yes, PixelRing also accepts requests for digital outdoor surfaces, LED displays and media-player or controller faults. Helpful details include photos of the screen, housing, access, error message and whether the issue is permanent or intermittent.' },
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
      { question: 'PixelRing проверяет outdoor displays (наружные цифровые экраны) и digital signage (цифровую рекламу)?', answer: 'Да, PixelRing принимает заявки по цифровым наружным поверхностям, LED-экранам, media player (медиаплееру) и controller (блоку управления). Для оценки помогают фото экрана, корпуса, доступа, сообщения об ошибке и описание: проблема постоянная или появляется периодически.' },
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
      { question: 'PixelRing outdoor display ve dijital reklam sistemlerini de kontrol eder mi?', answer: 'Evet, PixelRing dijital dış mekan yüzeyleri, LED ekranlar, medya oynatıcı ve kontrolcü arızaları için de talepleri kabul eder. Ekran, kasa, erişim, hata mesajı fotoğrafları ve sorunun sürekli mi aralıklı mı olduğu bilgisi yardımcı olur.' },
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
      { question: 'Czy PixelRing sprawdza też outdoor display i reklamę cyfrową?', answer: 'Tak, PixelRing przyjmuje również zgłoszenia dotyczące cyfrowych powierzchni zewnętrznych, ekranów LED oraz usterek media playera lub kontrolera. Pomagają zdjęcia ekranu, obudowy, dostępu, komunikatu błędu i informacja, czy problem jest stały czy okresowy.' },
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
      { question: 'هل تفحص PixelRing الشاشات الخارجية والإعلانات الرقمية أيضًا؟', answer: 'نعم، تستقبل PixelRing طلبات الأسطح الرقمية الخارجية وشاشات LED وأعطال مشغل الوسائط أو وحدة التحكم. تساعد صور الشاشة والهيكل وطريقة الوصول ورسالة الخطأ، مع توضيح هل المشكلة دائمة أم متقطعة.' },
      { question: 'ماذا أفعل إذا كانت اللوحة تصدر شررًا أو رائحة احتراق أو تضررت بعد المطر؟', answer: 'إذا كان ذلك ممكنًا بأمان، افصل الكهرباء. لا تقترب من الأسلاك المكشوفة أو الهياكل الرطبة أو الأجزاء المتحركة. أرسل الصور والوصف إلى مختصي PixelRing لتحديد الخطوة الآمنة التالية أولًا.' },
      { question: 'هل تنفذ PixelRing الإصلاح بنفسها أم تحول الطلب إلى فنيين آخرين؟', answer: 'تعمل PixelRing كشركة خدمة واحدة مسؤولة. يذهب الطلب مباشرة إلى PixelRing، وليس إلى سوق أو دليل فنيين. يساعد النموذج والذكاء الاصطناعي في جمع البيانات، بينما ينسق مختصو PixelRing العمل وينفذونه.' },
      { question: 'هل توجد ضمانات على إصلاح اللوحة؟', answer: 'نعم، يمكن أن يصل الضمان إلى 24 شهرًا حسب العمل المنفذ والمواد وظروف التشغيل. يتم توضيح النطاق المحدد بعد تقييم العطل والاتفاق على الأعمال.' },
      { question: 'هل يجب أن أفك اللوحة قبل إرسال الطلب؟', answer: 'لا. لا تفتح الهيكل، ولا تلمس الأجزاء الكهربائية، ولا تصعد إلى ارتفاع. تكفي للمرحلة الأولى صور آمنة من مسافة، ووصف العرض، والعنوان أو المنطقة، والارتفاع التقريبي للتركيب.' },
    ],
  },
};

const REPAIR_SCOPE_BY_LOCALE: Record<Locale, RepairScopeContent> = {
  de: {
    coverageEyebrow: 'Serviceumfang',
    coverageTitle: 'Womit wir arbeiten',
    coverageIntro:
      'Nicht jede Störung sieht technisch gleich aus. PixelRing ordnet zuerst Konstruktion, Material, Zugang und sichtbaren Defekt ein, bevor ein Reparaturweg empfohlen wird.',
    coverageCards: [
      { title: 'Leuchtkästen', text: 'Acrylfronten, LED-Flächen, Innenverkabelung, Netzteile, Dichtungen und gealterte Gehäuse.' },
      { title: 'Profilbuchstaben & LED-Module', text: 'Einzelbuchstaben, Logo-Elemente, LED-Ketten, Treiber, Farb- und Helligkeitsabweichungen.' },
      { title: 'Fassadenschilder, Paneele & Stelen', text: 'Schilder am Objekt, freistehende Elemente, Pylone, Rahmen, Untergründe und sichtbare Schäden.' },
      { title: 'Folien & Beschriftungen', text: 'Ablösungen, Blasen, UV-Schäden, Klebereste, Teilersatz und Neuverklebung nach Materialprüfung.' },
      { title: 'Neon & ältere Lichttechnik', text: 'Klassische Röhren, Trafos, Glasbruch, Mischtechnik und mögliche Umrüstung auf passende LED-Lösungen.' },
      { title: 'Befestigung & Wetterschäden', text: 'Lockere Halterungen, Korrosion, Sturmfolgen, Fassadenanschlüsse und Sicherung loser Teile.' },
    ],
    digitalEyebrow: 'Digitale Werbeanlagen',
    digitalTitle: 'Outdoor-Displays und digitale LED-Flächen richtig einordnen',
    digitalText:
      'Bei digitalen Außenflächen geht es nicht nur um den Bildschirm. Wir prüfen Display, Stromversorgung, Controller, Media-Player, Gehäuse, Glas und Zugang als zusammenhängendes System.',
    digitalCards: [
      { title: 'Schwarzer Bildschirm', text: 'Mögliche Ursachen sind Stromversorgung, Controller, Media-Player, Signalweg oder Schutzabschaltung.' },
      { title: 'Pixel, Panel oder Helligkeit', text: 'Defekte LED-Zonen, ungleichmäßige Helligkeit, Überhitzung oder Feuchtigkeit müssen getrennt bewertet werden.' },
      { title: 'Gehäuse, Glas & Wetter', text: 'IP-Schutz, Dichtungen, Vandalismusschäden, Kondenswasser und Montagezugang bestimmen den nächsten Schritt.' },
    ],
    serviceEyebrow: 'Was wir übernehmen',
    serviceTitle: 'Was der Spezialist macht',
    serviceIntro:
      'Der genaue Umfang hängt von Fotos, Standort, Zugang, Material und Sicherheitslage ab. Die erste Einschätzung bleibt unverbindlich, hilft aber, den passenden Einsatz vorzubereiten.',
    serviceCards: [
      { title: 'Foto- und Symptombewertung', text: 'Einordnung von Defekt, Konstruktion, Größe, Montagehöhe und möglicher Sicherheitslage.' },
      { title: 'Vor-Ort-Prüfung', text: 'Kontrolle von Zugang, Gehäuse, Befestigung, Stromversorgung und sichtbaren Materialschäden.' },
      { title: 'Elektrik & LED-Komponenten', text: 'Prüfung und Austausch von Netzteilen, Treibern, LED-Modulen, Leitungen, Klemmen oder Steuerung.' },
      { title: 'Abdichtung & Wetterschutz', text: 'Prüfung von Fugen, Kabeldurchführungen, Dichtungen, Korrosion und Feuchtigkeitsschäden.' },
      { title: 'Folie, Fronten & Oberfläche', text: 'Reinigung, Folienkorrektur, Teilersatz, Acrylfronten, Blenden und sichtbare Wiederherstellung.' },
      { title: 'Sicherung & Nachkontrolle', text: 'Sicherung loser Teile, Funktionsprüfung nach Reparatur und klare Empfehlung für weitere Schritte.' },
    ],
    checklistTitle: 'Welche Angaben helfen bei der Anfrage?',
    checklistText: 'Für eine schnelle Ersteinschätzung reichen sichere Fotos und wenige Eckdaten.',
    checklistItems: [
      'Gesamtansicht der Werbeanlage aus sicherem Abstand',
      'Nahaufnahme des Defekts, der Folie, LED-Zone oder Befestigung',
      'Adresse oder Ortsteil sowie ungefähre Montagehöhe',
      'Beschreibung: seit wann, nach Regen, dauerhaft oder nur zeitweise',
      'Bei Displays: Bildschirmfoto, Fehlermeldung, Controller/Media-Player und Gehäuseansicht',
    ],
    ctaLabel: 'Reparaturumfang klären',
  },
  en: {
    coverageEyebrow: 'Service scope',
    coverageTitle: 'What we work with',
    coverageIntro:
      'Not every failure has the same technical cause. PixelRing first clarifies the construction, material, access and visible damage before recommending a repair path.',
    coverageCards: [
      { title: 'Lightboxes', text: 'Acrylic faces, LED surfaces, internal wiring, power supplies, seals and aged housings.' },
      { title: 'Channel letters & LED modules', text: 'Single letters, logo elements, LED strings, drivers, colour and brightness differences.' },
      { title: 'Facade signs, panels & pylons', text: 'Object-mounted signs, freestanding elements, pylons, frames, substrates and visible damage.' },
      { title: 'Films & lettering', text: 'Peeling, bubbles, UV damage, adhesive residue, partial replacement and re-application after material checks.' },
      { title: 'Neon & older lighting', text: 'Classic tubes, transformers, broken glass, mixed systems and possible conversion to suitable LED solutions.' },
      { title: 'Fixings & weather damage', text: 'Loose brackets, corrosion, storm damage, facade connections and securing loose parts.' },
    ],
    digitalEyebrow: 'Digital signage',
    digitalTitle: 'Outdoor displays and digital LED surfaces need a system view',
    digitalText:
      'With digital outdoor surfaces, the screen is only one part. We review display, power, controller, media player, housing, glass and access together.',
    digitalCards: [
      { title: 'Black screen', text: 'Possible causes include power supply, controller, media player, signal path or protective shutdown.' },
      { title: 'Pixels, panels or brightness', text: 'Faulty LED zones, uneven brightness, overheating or moisture must be assessed separately.' },
      { title: 'Housing, glass & weather', text: 'IP protection, seals, vandal damage, condensation and access define the next step.' },
    ],
    serviceEyebrow: 'What we handle',
    serviceTitle: 'What the specialist does',
    serviceIntro:
      'The exact scope depends on photos, location, access, material and safety conditions. The first assessment is non-binding, but it helps prepare the right visit.',
    serviceCards: [
      { title: 'Photo and symptom review', text: 'Classification of defect, construction, size, mounting height and possible safety situation.' },
      { title: 'On-site check', text: 'Review of access, housing, fixings, power supply and visible material damage.' },
      { title: 'Electrical and LED components', text: 'Checking and replacing power supplies, drivers, LED modules, cables, terminals or controllers.' },
      { title: 'Sealing and weather protection', text: 'Review of joints, cable entries, seals, corrosion and moisture damage.' },
      { title: 'Film, faces and surfaces', text: 'Cleaning, film correction, partial replacement, acrylic faces, covers and visible restoration.' },
      { title: 'Securing and final check', text: 'Securing loose parts, functional test after repair and a clear recommendation for next steps.' },
    ],
    checklistTitle: 'Which details help with the request?',
    checklistText: 'Safe photos and a few basic details are enough for a quick first assessment.',
    checklistItems: [
      'Full view of the sign from a safe distance',
      'Close-up of the defect, film, LED zone or fixing point',
      'Address or district and approximate mounting height',
      'Description: since when, after rain, permanent or intermittent',
      'For displays: screen photo, error message, controller/media player and housing view',
    ],
    ctaLabel: 'Clarify repair scope',
  },
  ru: {
    coverageEyebrow: 'Объем сервиса',
    coverageTitle: 'С чем работаем',
    coverageIntro:
      'Одинаковый внешний симптом не всегда означает одну и ту же поломку. PixelRing сначала уточняет тип конструкции, материал, доступ и видимый дефект, а затем предлагает ремонтный сценарий.',
    coverageCards: [
      { title: 'Световые короба', text: 'Акриловые панели, LED-поле, внутренняя проводка, блоки питания, уплотнения и стареющие корпуса.' },
      { title: 'Объемные буквы и LED-модули', text: 'Отдельные буквы, элементы логотипа, LED-цепи, драйверы, различия цвета и яркости.' },
      { title: 'Фасадные таблички, панели и стелы', text: 'Вывески на объекте, отдельностоящие элементы, пилоны, рамы, основания и видимые повреждения.' },
      { title: 'Пленки и надписи', text: 'Отслоения, пузыри, УФ-выцветание, остатки клея, частичная замена и новая оклейка после проверки материала.' },
      { title: 'Неон и старая светотехника', text: 'Классические трубки, трансформаторы, стеклобой, смешанные системы и возможный переход на подходящее LED-решение.' },
      { title: 'Крепления и погодные повреждения', text: 'Ослабшие кронштейны, коррозия, последствия шторма, узлы фасада и фиксация опасных элементов.' },
    ],
    digitalEyebrow: 'Цифровая реклама',
    digitalTitle: 'Outdoor displays и цифровые LED-поверхности нужно оценивать как систему',
    digitalText:
      'В цифровых наружных экранах важен не только сам экран. Мы смотрим дисплей, питание, controller (блок управления), media player (медиаплеер), корпус, стекло и доступ вместе.',
    digitalCards: [
      { title: 'Черный экран', text: 'Возможны проблемы с питанием, controller (блоком управления), media player (медиаплеером), сигналом или защитным отключением.' },
      { title: 'Пиксели, панели или яркость', text: 'Неисправные LED-зоны, неравномерная яркость, перегрев или влага требуют отдельной проверки.' },
      { title: 'Корпус, стекло и погода', text: 'IP-защита (защита от влаги и пыли), уплотнения, вандальные повреждения, конденсат и доступ определяют следующий шаг.' },
    ],
    serviceEyebrow: 'Что мы берем на себя',
    serviceTitle: 'Что сделает специалист',
    serviceIntro:
      'Точный объем зависит от фото, адреса, доступа, материала и безопасности. Первая оценка не является обязательным предложением, но помогает подготовить правильный выезд.',
    serviceCards: [
      { title: 'Оценка фото и симптомов', text: 'Определение дефекта, типа конструкции, размера, высоты монтажа и возможных рисков.' },
      { title: 'Проверка на месте', text: 'Осмотр доступа, корпуса, креплений, питания и видимых повреждений материала.' },
      { title: 'Электрика и LED-компоненты', text: 'Проверка и замена блоков питания, драйверов, LED-модулей, кабелей, клемм или управления.' },
      { title: 'Герметизация и защита от погоды', text: 'Проверка швов, кабельных вводов, уплотнений, коррозии и следов влаги.' },
      { title: 'Пленка, панели и поверхность', text: 'Очистка, корректировка пленки, частичная замена, акриловые панели, крышки и визуальное восстановление.' },
      { title: 'Фиксация и контроль', text: 'Закрепление опасных частей, проверка работы после ремонта и понятная рекомендация по следующим шагам.' },
    ],
    checklistTitle: 'Какие данные помогут при заявке?',
    checklistText: 'Для быстрой первичной оценки достаточно безопасных фото и нескольких данных.',
    checklistItems: [
      'Общий вид вывески с безопасного расстояния',
      'Крупный план дефекта, пленки, LED-зоны или крепления',
      'Адрес или район и примерная высота монтажа',
      'Описание: когда началось, после дождя, постоянно или периодически',
      'Для экранов: фото экрана, ошибка, controller/media player (блок управления/медиаплеер) и вид корпуса',
    ],
    ctaLabel: 'Уточнить объем ремонта',
  },
  tr: {
    coverageEyebrow: 'Hizmet kapsamı',
    coverageTitle: 'Nelerle çalışıyoruz?',
    coverageIntro:
      'Her belirti aynı teknik arıza anlamına gelmez. PixelRing önce yapı tipini, malzemeyi, erişimi ve görünen arızayı netleştirir, sonra onarım yolunu önerir.',
    coverageCards: [
      { title: 'Işıklı kutular', text: 'Akrilik yüzeyler, LED alanlar, iç kablolama, güç kaynakları, contalar ve eskiyen kasalar.' },
      { title: 'Kutu harfler ve LED modüller', text: 'Tek harfler, logo parçaları, LED zincirleri, sürücüler, renk ve parlaklık farkları.' },
      { title: 'Cephe tabelaları, paneller ve totemler', text: 'Objeye monte tabelalar, bağımsız elemanlar, pylonlar, çerçeveler, zeminler ve görünür hasarlar.' },
      { title: 'Folyolar ve yazılar', text: 'Sökülme, kabarcık, UV solması, yapışkan kalıntısı, kısmi değişim ve malzeme kontrolünden sonra yeniden uygulama.' },
      { title: 'Neon ve eski ışık sistemleri', text: 'Klasik tüpler, trafolar, cam kırıkları, karma sistemler ve uygun LED çözümüne geçiş olasılığı.' },
      { title: 'Bağlantılar ve hava hasarı', text: 'Gevşek braketler, korozyon, fırtına hasarı, cephe bağlantıları ve gevşek parçaların güvene alınması.' },
    ],
    digitalEyebrow: 'Dijital reklam sistemleri',
    digitalTitle: 'Outdoor display ve dijital LED yüzeyler sistem olarak değerlendirilir',
    digitalText:
      'Dijital dış mekan ekranlarında yalnızca panel önemli değildir. Ekran, elektrik, kontrolcü, medya oynatıcı, kasa, cam ve erişim birlikte değerlendirilir.',
    digitalCards: [
      { title: 'Siyah ekran', text: 'Güç kaynağı, kontrolcü, medya oynatıcı, sinyal hattı veya koruma kapanması neden olabilir.' },
      { title: 'Piksel, panel veya parlaklık', text: 'Arızalı LED bölgeleri, düzensiz parlaklık, aşırı ısınma veya nem ayrı ayrı kontrol edilmelidir.' },
      { title: 'Kasa, cam ve hava koşulları', text: 'IP koruması, contalar, vandalizm hasarı, yoğuşma ve erişim sonraki adımı belirler.' },
    ],
    serviceEyebrow: 'Neleri üstleniyoruz?',
    serviceTitle: 'Uzman ne yapar?',
    serviceIntro:
      'Kesin kapsam fotoğraflara, konuma, erişime, malzemeye ve güvenlik durumuna bağlıdır. İlk değerlendirme bağlayıcı değildir, ancak doğru ziyareti hazırlamaya yardımcı olur.',
    serviceCards: [
      { title: 'Fotoğraf ve belirti değerlendirmesi', text: 'Arıza, yapı, boyut, montaj yüksekliği ve olası güvenlik durumunun sınıflandırılması.' },
      { title: 'Yerinde kontrol', text: 'Erişim, kasa, bağlantılar, güç kaynağı ve görünür malzeme hasarının kontrolü.' },
      { title: 'Elektrik ve LED bileşenleri', text: 'Güç kaynakları, sürücüler, LED modülleri, kablolar, klemensler veya kontrol ünitelerinin kontrolü ve değişimi.' },
      { title: 'Sızdırmazlık ve hava koruması', text: 'Ek yerleri, kablo girişleri, contalar, korozyon ve nem hasarlarının kontrolü.' },
      { title: 'Folyo, yüzey ve kapaklar', text: 'Temizlik, folyo düzeltme, kısmi değişim, akrilik yüzeyler, kapaklar ve görünür yenileme.' },
      { title: 'Güvence ve son kontrol', text: 'Gevşek parçaların güvene alınması, onarım sonrası fonksiyon testi ve net sonraki adım önerisi.' },
    ],
    checklistTitle: 'Talep için hangi bilgiler yardımcı olur?',
    checklistText: 'Hızlı ilk değerlendirme için güvenli fotoğraflar ve birkaç temel bilgi yeterlidir.',
    checklistItems: [
      'Tabelanın güvenli mesafeden genel görünümü',
      'Arıza, folyo, LED bölgesi veya bağlantı noktasının yakın fotoğrafı',
      'Adres veya semt ve yaklaşık montaj yüksekliği',
      'Açıklama: ne zamandır var, yağmurdan sonra mı, sürekli mi aralıklı mı',
      'Ekranlarda: ekran fotoğrafı, hata mesajı, kontrolcü/medya oynatıcı ve kasa görünümü',
    ],
    ctaLabel: 'Onarım kapsamını netleştir',
  },
  pl: {
    coverageEyebrow: 'Zakres usługi',
    coverageTitle: 'Z czym pracujemy',
    coverageIntro:
      'Ten sam widoczny objaw nie zawsze oznacza tę samą usterkę. PixelRing najpierw ustala konstrukcję, materiał, dostęp i widoczne uszkodzenie, a dopiero potem proponuje ścieżkę naprawy.',
    coverageCards: [
      { title: 'Kasetony świetlne', text: 'Fronty akrylowe, powierzchnie LED, okablowanie wewnętrzne, zasilacze, uszczelki i starzejące się obudowy.' },
      { title: 'Litery przestrzenne i moduły LED', text: 'Pojedyncze litery, elementy logo, łańcuchy LED, sterowniki, różnice koloru i jasności.' },
      { title: 'Szyldy fasadowe, panele i pylony', text: 'Szyldy na obiekcie, elementy wolnostojące, pylony, ramy, podłoża i widoczne uszkodzenia.' },
      { title: 'Folie i napisy', text: 'Odklejanie, pęcherze, blaknięcie UV, resztki kleju, częściowa wymiana i ponowna aplikacja po kontroli materiału.' },
      { title: 'Neon i starsza technika świetlna', text: 'Klasyczne rurki, transformatory, pęknięte szkło, systemy mieszane i możliwa zmiana na odpowiednie LED.' },
      { title: 'Mocowania i szkody pogodowe', text: 'Luźne uchwyty, korozja, szkody po wichurze, połączenia z fasadą i zabezpieczenie luźnych części.' },
    ],
    digitalEyebrow: 'Reklama cyfrowa',
    digitalTitle: 'Outdoor display i cyfrowe powierzchnie LED wymagają oceny całego systemu',
    digitalText:
      'W cyfrowych ekranach zewnętrznych sam ekran to tylko część problemu. Sprawdzamy wyświetlacz, zasilanie, kontroler, media player, obudowę, szkło i dostęp łącznie.',
    digitalCards: [
      { title: 'Czarny ekran', text: 'Możliwą przyczyną jest zasilanie, kontroler, media player, tor sygnału albo wyłączenie ochronne.' },
      { title: 'Piksele, panel lub jasność', text: 'Uszkodzone strefy LED, nierówna jasność, przegrzewanie albo wilgoć trzeba ocenić osobno.' },
      { title: 'Obudowa, szkło i pogoda', text: 'Ochrona IP, uszczelki, szkody wandalizmu, kondensacja i dostęp określają kolejny krok.' },
    ],
    serviceEyebrow: 'Co obejmujemy',
    serviceTitle: 'Co zrobi specjalista',
    serviceIntro:
      'Dokładny zakres zależy od zdjęć, lokalizacji, dostępu, materiału i bezpieczeństwa. Pierwsza ocena jest niewiążąca, ale pomaga przygotować właściwą wizytę.',
    serviceCards: [
      { title: 'Ocena zdjęć i objawów', text: 'Klasyfikacja usterki, konstrukcji, rozmiaru, wysokości montażu i możliwej sytuacji bezpieczeństwa.' },
      { title: 'Kontrola na miejscu', text: 'Sprawdzenie dostępu, obudowy, mocowań, zasilania i widocznych uszkodzeń materiału.' },
      { title: 'Elektryka i elementy LED', text: 'Kontrola i wymiana zasilaczy, driverów, modułów LED, kabli, zacisków albo sterowania.' },
      { title: 'Uszczelnienie i ochrona pogodowa', text: 'Sprawdzenie fug, przepustów kablowych, uszczelek, korozji i szkód od wilgoci.' },
      { title: 'Folia, fronty i powierzchnie', text: 'Czyszczenie, korekta folii, częściowa wymiana, fronty akrylowe, osłony i wizualne przywrócenie wyglądu.' },
      { title: 'Zabezpieczenie i kontrola końcowa', text: 'Zabezpieczenie luźnych części, test działania po naprawie i jasna rekomendacja dalszych kroków.' },
    ],
    checklistTitle: 'Jakie dane pomagają przy zgłoszeniu?',
    checklistText: 'Do szybkiej pierwszej oceny wystarczą bezpieczne zdjęcia i kilka podstawowych informacji.',
    checklistItems: [
      'Widok całej reklamy z bezpiecznej odległości',
      'Zbliżenie usterki, folii, strefy LED albo punktu mocowania',
      'Adres lub dzielnica oraz przybliżona wysokość montażu',
      'Opis: od kiedy, po deszczu, stale czy tylko okresowo',
      'Przy ekranach: zdjęcie ekranu, komunikat błędu, kontroler/media player i widok obudowy',
    ],
    ctaLabel: 'Ustalić zakres naprawy',
  },
  ar: {
    coverageEyebrow: 'نطاق الخدمة',
    coverageTitle: 'ما الذي نعمل عليه',
    coverageIntro:
      'ليس كل عرض ظاهر يعني العطل نفسه. تحدد PixelRing أولًا نوع التركيب، والمادة، وطريقة الوصول، والضرر الظاهر، ثم تقترح مسار الإصلاح.',
    coverageCards: [
      { title: 'الصناديق المضيئة', text: 'واجهات الأكريليك، أسطح LED، الأسلاك الداخلية، مزودات الطاقة، الأختام والهياكل القديمة.' },
      { title: 'الحروف البارزة ووحدات LED', text: 'حروف منفردة، عناصر الشعار، سلاسل LED، المشغلات، واختلاف اللون أو السطوع.' },
      { title: 'لوحات الواجهات والألواح والأعمدة', text: 'لوحات مثبتة على المبنى، عناصر قائمة بذاتها، أعمدة إعلانية، إطارات، أسطح تثبيت وأضرار ظاهرة.' },
      { title: 'الأفلام اللاصقة والكتابات', text: 'تقشر، فقاعات، بهتان بسبب الشمس، بقايا لاصق، استبدال جزئي أو إعادة لصق بعد فحص المادة.' },
      { title: 'النيون وتقنيات الإضاءة القديمة', text: 'أنابيب كلاسيكية، محولات، كسر زجاج، أنظمة مختلطة وإمكانية التحويل إلى حل LED مناسب.' },
      { title: 'التثبيت وأضرار الطقس', text: 'حوامل مرتخية، تآكل، أضرار عواصف، نقاط اتصال بالواجهة وتأمين الأجزاء المتحركة.' },
    ],
    digitalEyebrow: 'الإعلانات الرقمية',
    digitalTitle: 'الشاشات الخارجية وأسطح LED الرقمية تحتاج إلى تقييم كامل للنظام',
    digitalText:
      'في الشاشات الخارجية الرقمية لا يكون العطل في الشاشة وحدها دائمًا. نراجع الشاشة، والطاقة، ووحدة التحكم، ومشغل الوسائط، والهيكل، والزجاج، وطريقة الوصول معًا.',
    digitalCards: [
      { title: 'شاشة سوداء', text: 'قد يكون السبب في مزود الطاقة أو وحدة التحكم أو مشغل الوسائط أو مسار الإشارة أو إيقاف الحماية.' },
      { title: 'بكسلات أو لوحة أو سطوع', text: 'مناطق LED تالفة، سطوع غير متساو، سخونة زائدة أو رطوبة يجب تقييمها كل على حدة.' },
      { title: 'الهيكل والزجاج والطقس', text: 'حماية IP، الأختام، أضرار التخريب، التكثف وطريقة الوصول تحدد الخطوة التالية.' },
    ],
    serviceEyebrow: 'ما الذي نتولاه',
    serviceTitle: 'ماذا يفعل المختص',
    serviceIntro:
      'يعتمد النطاق الدقيق على الصور، والموقع، وطريقة الوصول، والمادة، وحالة السلامة. التقييم الأولي غير ملزم، لكنه يساعد في تحضير الزيارة المناسبة.',
    serviceCards: [
      { title: 'تقييم الصور والأعراض', text: 'تصنيف العطل، ونوع التركيب، والحجم، وارتفاع التثبيت، ومخاطر السلامة المحتملة.' },
      { title: 'فحص في الموقع', text: 'مراجعة الوصول، والهيكل، والتثبيت، ومصدر الطاقة، والأضرار الظاهرة في المواد.' },
      { title: 'الكهرباء ومكونات LED', text: 'فحص واستبدال مزودات الطاقة، والمشغلات، ووحدات LED، والكابلات، والوصلات أو التحكم.' },
      { title: 'الإغلاق والحماية من الطقس', text: 'فحص الفواصل، ومداخل الكابلات، والأختام، والتآكل وأضرار الرطوبة.' },
      { title: 'الأفلام والواجهات والأسطح', text: 'تنظيف، تصحيح الفيلم، استبدال جزئي، واجهات أكريليك، أغطية واستعادة الشكل الظاهر.' },
      { title: 'التأمين والفحص النهائي', text: 'تأمين الأجزاء المرتخية، اختبار العمل بعد الإصلاح وتوصية واضحة للخطوات التالية.' },
    ],
    checklistTitle: 'ما المعلومات التي تساعد في الطلب؟',
    checklistText: 'تكفي صور آمنة وبعض البيانات الأساسية لتقييم أولي سريع.',
    checklistItems: [
      'صورة عامة للوحة من مسافة آمنة',
      'صورة قريبة للعطل أو الفيلم أو منطقة LED أو نقطة التثبيت',
      'العنوان أو المنطقة والارتفاع التقريبي للتركيب',
      'وصف: منذ متى، هل بعد المطر، دائم أم متقطع',
      'للشاشات: صورة الشاشة، رسالة الخطأ، وحدة التحكم/مشغل الوسائط وصورة الهيكل',
    ],
    ctaLabel: 'توضيح نطاق الإصلاح',
  },
};

const REPAIR_PROBLEM_LINKS_BY_LOCALE: Record<Locale, RepairProblemLinksContent> = {
  de: {
    eyebrow: 'Mehr dazu',
    title: 'Den Defekt genauer verstehen',
    intro:
      'Wenn Sie erst lesen möchten, was hinter einem Symptom stecken kann, führen diese kurzen Problemseiten tiefer.',
    links: [
      {
        title: 'Werbeanlage flackert',
        text: 'Ursachen für flackernde LED, instabile Beleuchtung und zeitweise Ausfälle.',
        href: '/probleme-loesungen/werbeanlage-flackert',
        tag: 'Licht',
      },
      {
        title: 'Buchstabe leuchtet nicht',
        text: 'Was hinter dunklen Profilbuchstaben, LED-Zonen oder unterbrochenen Ketten stecken kann.',
        href: '/probleme-loesungen/buchstabe-leuchtet-nicht',
        tag: 'Buchstaben',
      },
      {
        title: 'Folie löst sich',
        text: 'Warum Folien Blasen werfen, sich ablösen oder durch UV und Wetter sichtbar altern.',
        href: '/probleme-loesungen/folie-loest-sich',
        tag: 'Folie',
      },
      {
        title: 'Werbeanlage schaltet nach Regen ab',
        text: 'Hinweise zu Feuchtigkeit, Sicherungsausfall, Gehäuse, Kabelwegen und sicheren nächsten Schritten.',
        href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab',
        tag: 'Regen',
      },
    ],
  },
  en: {
    eyebrow: 'Read more',
    title: 'Understand the defect more precisely',
    intro:
      'If you want to read first, these short problem pages explain what may be behind a visible symptom.',
    links: [
      {
        title: 'Signage is flickering',
        text: 'Typical causes of flickering LED, unstable lighting and intermittent outages.',
        href: '/probleme-loesungen/werbeanlage-flackert',
        tag: 'Light',
      },
      {
        title: 'Letter does not light',
        text: 'What can cause dark channel letters, failed LED zones or interrupted chains.',
        href: '/probleme-loesungen/buchstabe-leuchtet-nicht',
        tag: 'Letters',
      },
      {
        title: 'Film is peeling',
        text: 'Why films bubble, peel or visibly age from UV, weather and surface conditions.',
        href: '/probleme-loesungen/folie-loest-sich',
        tag: 'Film',
      },
      {
        title: 'Sign switches off after rain',
        text: 'Signals around moisture, breaker trips, housings, cable paths and safe next steps.',
        href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab',
        tag: 'Rain',
      },
    ],
  },
  ru: {
    eyebrow: 'Разобраться подробнее',
    title: 'Если хотите понять причину до заявки',
    intro:
      'Эти короткие страницы объясняют, что может стоять за видимым симптомом и какие фото помогут для первой оценки.',
    links: [
      {
        title: 'Вывеска мерцает',
        text: 'Причины мерцания LED, нестабильного света и периодических отказов.',
        href: '/probleme-loesungen/werbeanlage-flackert',
        tag: 'Свет',
      },
      {
        title: 'Буква не светится',
        text: 'Что может стоять за темной буквой, отказом LED-зоны или разрывом цепи.',
        href: '/probleme-loesungen/buchstabe-leuchtet-nicht',
        tag: 'Буквы',
      },
      {
        title: 'Пленка отклеивается',
        text: 'Почему пленка пузырится, отходит или стареет из-за солнца, погоды и поверхности.',
        href: '/probleme-loesungen/folie-loest-sich',
        tag: 'Пленка',
      },
      {
        title: 'Вывеска отключается после дождя',
        text: 'Признаки влаги, срабатывания автомата, проблем корпуса, кабелей и безопасных следующих шагов.',
        href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab',
        tag: 'Дождь',
      },
    ],
  },
  tr: {
    eyebrow: 'Daha fazla oku',
    title: 'Arızayı daha net anlamak',
    intro:
      'Önce okumak isterseniz, bu kısa problem sayfaları görünen belirtinin arkasında ne olabileceğini açıklar.',
    links: [
      {
        title: 'Tabela titriyor',
        text: 'Titreyen LED, dengesiz isik ve aralikli kesintilerin tipik nedenleri.',
        href: '/probleme-loesungen/werbeanlage-flackert',
        tag: 'Isik',
      },
      {
        title: 'Harf yanmiyor',
        text: 'Karanlik harfler, LED bolgeleri veya kesilen LED zincirleri arkasindaki olasi nedenler.',
        href: '/probleme-loesungen/buchstabe-leuchtet-nicht',
        tag: 'Harf',
      },
      {
        title: 'Folyo kalkiyor',
        text: 'Folyolarin kabarmasi, kalkmasi veya UV ve hava nedeniyle eskimesi.',
        href: '/probleme-loesungen/folie-loest-sich',
        tag: 'Folyo',
      },
      {
        title: 'Tabela yagmurdan sonra kapaniyor',
        text: 'Nem, sigorta atmasi, kasa, kablo gecisleri ve guvenli sonraki adimlar.',
        href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab',
        tag: 'Yagmur',
      },
    ],
  },
  pl: {
    eyebrow: 'Dowiedz się więcej',
    title: 'Zrozumieć usterkę dokładniej',
    intro:
      'Jeśli chcesz najpierw poczytać, te krótkie strony wyjaśniają, co może stać za widocznym objawem.',
    links: [
      {
        title: 'Reklama miga',
        text: 'Typowe przyczyny migotania LED, niestabilnego swiatla i okresowych awarii.',
        href: '/probleme-loesungen/werbeanlage-flackert',
        tag: 'Swiatlo',
      },
      {
        title: 'Litera nie swieci',
        text: 'Co moze stac za ciemna litera, strefa LED albo przerwanym lancuchem.',
        href: '/probleme-loesungen/buchstabe-leuchtet-nicht',
        tag: 'Litery',
      },
      {
        title: 'Folia odchodzi',
        text: 'Dlaczego folia robi pecherze, odkleja sie albo starzeje od UV i pogody.',
        href: '/probleme-loesungen/folie-loest-sich',
        tag: 'Folia',
      },
      {
        title: 'Reklama wylacza sie po deszczu',
        text: 'Objawy wilgoci, wybicia zabezpieczenia, problemow obudowy i kabli.',
        href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab',
        tag: 'Deszcz',
      },
    ],
  },
  ar: {
    eyebrow: 'مزيد من الفهم',
    title: 'فهم العطل بشكل أدق',
    intro:
      'إذا أردت القراءة أولاً، تشرح هذه الصفحات القصيرة ما قد يكون خلف العرض الظاهر.',
    links: [
      {
        title: 'اللوحة تومض',
        text: 'اسباب وميض LED وعدم استقرار الاضاءة والانقطاعات المؤقتة.',
        href: '/probleme-loesungen/werbeanlage-flackert',
        tag: 'اضاءة',
      },
      {
        title: 'حرف لا يضيء',
        text: 'ما قد يسبب ظلام الحروف او مناطق LED او انقطاع السلسلة.',
        href: '/probleme-loesungen/buchstabe-leuchtet-nicht',
        tag: 'حروف',
      },
      {
        title: 'الفيلم يتقشر',
        text: 'لماذا تظهر الفقاعات او يتقشر الفيلم بسبب الشمس والطقس والسطح.',
        href: '/probleme-loesungen/folie-loest-sich',
        tag: 'فيلم',
      },
      {
        title: 'اللوحة تنطفئ بعد المطر',
        text: 'اشارات الرطوبة وفصل الكهرباء ومشاكل الهيكل ومسارات الكابلات.',
        href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab',
        tag: 'مطر',
      },
    ],
  },
};

const REPAIR_NEXT_STEP_BY_LOCALE: Record<Locale, RepairNextStepContent> = {
  de: {
    eyebrow: 'NEXT STEP',
    title: 'Zeigen Sie uns Ihre Werbeanlage',
    intro:
      'Sie müssen den Defekt nicht technisch benennen. Ein Foto, Standort oder Bezirk und eine kurze Beschreibung reichen für den Start.',
    requestTitle: 'Starten Sie mit Foto oder Beschreibung',
    requestText:
      'PixelRing prüft den sichtbaren Zustand, Zugang und Sicherheitslage und meldet sich mit dem nächsten sinnvollen Schritt.',
    requestCta: 'Foto und Reparaturfall senden',
    servicesTitle: 'Vielleicht ist es ein Nachbarservice',
    servicesText: 'Diese Servicebereiche passen, wenn Modernisierung, Diagnose, Montage oder Branding Teil der Aufgabe wird.',
    links: [
      { title: 'LED-Modernisierung', text: 'Wenn Beleuchtung, Module, Netzteile oder Neon technisch aktualisiert werden sollen.', href: '/leistungen/lichtwerbung-led-modernisierung', tag: 'Licht' },
      { title: 'Audit & Diagnose', text: 'Wenn Zustand, Prioritaet oder mehrere Standorte zuerst strukturiert geprueft werden sollen.', href: '/leistungen/werbeanlagen-audit-diagnose', tag: 'Check' },
      { title: 'Montage & Demontage', text: 'Wenn Zugang, Rueckbau, Versetzung oder neue Befestigung zur Aufgabe gehoeren.', href: '/leistungen/montage-demontage-werbeanlagen', tag: 'Montage' },
      { title: 'Druck & Branding', text: 'Wenn Folien, Beschriftungen, Druckdaten oder Werbematerial erneuert werden muessen.', href: '/leistungen/druckprodukte-branding-werbematerialien', tag: 'Branding' },
    ],
  },
  en: {
    eyebrow: 'NEXT STEP',
    title: 'Show us your sign',
    intro:
      'You do not need the technical name of the defect. A photo, location or district and a short description are enough to start.',
    requestTitle: 'Start with a photo or description',
    requestText:
      'PixelRing checks the visible condition, access and safety situation, then replies with the next practical step.',
    requestCta: 'Send photo and repair case',
    servicesTitle: 'Maybe it is a neighboring service',
    servicesText: 'These service areas fit when modernization, diagnostics, installation or branding becomes part of the task.',
    links: [
      { title: 'LED modernization', text: 'When lighting, modules, power supplies or neon should be technically updated.', href: '/leistungen/lichtwerbung-led-modernisierung', tag: 'Light' },
      { title: 'Audit & diagnostics', text: 'When condition, priority or several locations should be checked first.', href: '/leistungen/werbeanlagen-audit-diagnose', tag: 'Check' },
      { title: 'Installation & dismantling', text: 'When access, removal, relocation or new fixings are part of the task.', href: '/leistungen/montage-demontage-werbeanlagen', tag: 'Install' },
      { title: 'Print & branding', text: 'When films, lettering, print data or advertising materials need renewal.', href: '/leistungen/druckprodukte-branding-werbematerialien', tag: 'Branding' },
    ],
  },
  ru: {
    eyebrow: 'СЛЕДУЮЩИЙ ШАГ',
    title: 'Покажите нам вывеску',
    intro:
      'Не нужно знать точное название поломки. Для старта достаточно фото, адреса или района и короткого описания.',
    requestTitle: 'Начните с фото или описания',
    requestText:
      'PixelRing проверит видимое состояние, доступ и безопасность, а затем предложит следующий разумный шаг.',
    requestCta: 'Отправить фото и задачу',
    servicesTitle: 'Возможно, нужна соседняя услуга',
    servicesText: 'Эти услуги подходят, если нужна модернизация, диагностика, монтаж или восстановление брендинга.',
    links: [
      { title: 'LED-модернизация', text: 'Если нужно обновить подсветку, модули, блоки питания или неон.', href: '/leistungen/lichtwerbung-led-modernisierung', tag: 'Свет' },
      { title: 'Аудит и диагностика', text: 'Если сначала нужно оценить состояние, приоритет или несколько объектов.', href: '/leistungen/werbeanlagen-audit-diagnose', tag: 'Проверка' },
      { title: 'Монтаж и демонтаж', text: 'Если задача связана с доступом, снятием, переносом или креплением.', href: '/leistungen/montage-demontage-werbeanlagen', tag: 'Монтаж' },
      { title: 'Печать и брендинг', text: 'Если нужно обновить пленки, надписи, макеты или рекламные материалы.', href: '/leistungen/druckprodukte-branding-werbematerialien', tag: 'Брендинг' },
    ],
  },
  tr: {
    eyebrow: 'SONRAKI ADIM',
    title: 'Tabelanızı bize gösterin',
    intro:
      'Arızanın teknik adını bilmeniz gerekmez. Başlamak için fotoğraf, adres veya bölge ve kısa açıklama yeterlidir.',
    requestTitle: 'Fotoğraf veya açıklama ile başlayın',
    requestText:
      'PixelRing görünen durumu, erişimi ve güvenliği kontrol eder, sonra mantıklı sonraki adımı önerir.',
    requestCta: 'Fotoğraf ve onarım talebi gönder',
    servicesTitle: 'Belki komşu bir hizmet gerekir',
    servicesText: 'Modernizasyon, teshis, montaj veya markalama da gerekiyorsa bu hizmetler uygundur.',
    links: [
      { title: 'LED modernizasyonu', text: 'Aydinlatma, modul, guc kaynagi veya neon teknik olarak yenilenecekse.', href: '/leistungen/lichtwerbung-led-modernisierung', tag: 'Isik' },
      { title: 'Audit ve teshis', text: 'Durum, oncelik veya birden fazla lokasyon once kontrol edilecekse.', href: '/leistungen/werbeanlagen-audit-diagnose', tag: 'Kontrol' },
      { title: 'Montaj ve demontaj', text: 'Erisim, sokum, tasima veya yeni sabitleme isin parcasiysa.', href: '/leistungen/montage-demontage-werbeanlagen', tag: 'Montaj' },
      { title: 'Baski ve markalama', text: 'Folyo, yazi, baski verisi veya reklam malzemesi yenilenecekse.', href: '/leistungen/druckprodukte-branding-werbematerialien', tag: 'Marka' },
    ],
  },
  pl: {
    eyebrow: 'NASTEPNY KROK',
    title: 'Pokaż nam swój szyld',
    intro:
      'Nie musisz znać technicznej nazwy usterki. Na start wystarczy zdjęcie, adres lub dzielnica i krótki opis.',
    requestTitle: 'Zacznij od zdjęcia albo opisu',
    requestText:
      'PixelRing sprawdzi widoczny stan, dostęp i bezpieczeństwo, a następnie zaproponuje rozsądny kolejny krok.',
    requestCta: 'Wyślij zdjęcie i sprawę',
    servicesTitle: 'Może potrzebna jest usługa pokrewna',
    servicesText: 'Te uslugi pasuja, gdy potrzebna jest modernizacja, diagnostyka, montaz albo branding.',
    links: [
      { title: 'Modernizacja LED', text: 'Gdy oswietlenie, moduly, zasilacze albo neon wymagaja aktualizacji.', href: '/leistungen/lichtwerbung-led-modernisierung', tag: 'Swiatlo' },
      { title: 'Audyt i diagnostyka', text: 'Gdy najpierw trzeba sprawdzic stan, priorytet albo kilka lokalizacji.', href: '/leistungen/werbeanlagen-audit-diagnose', tag: 'Kontrola' },
      { title: 'Montaz i demontaz', text: 'Gdy zadanie obejmuje dostep, demontaz, przeniesienie albo mocowania.', href: '/leistungen/montage-demontage-werbeanlagen', tag: 'Montaz' },
      { title: 'Druk i branding', text: 'Gdy trzeba odnowic folie, napisy, dane do druku albo materialy reklamowe.', href: '/leistungen/druckprodukte-branding-werbematerialien', tag: 'Branding' },
    ],
  },
  ar: {
    eyebrow: 'الخطوة التالية',
    title: 'أرنا لوحتك',
    intro:
      'لا تحتاج إلى معرفة الاسم التقني للعطل. تكفي صورة، والعنوان أو المنطقة، ووصف قصير للبدء.',
    requestTitle: 'ابدأ بصورة أو وصف',
    requestText:
      'تفحص PixelRing الحالة الظاهرة والوصول والسلامة، ثم تقترح الخطوة العملية التالية.',
    requestCta: 'إرسال الصورة وحالة الإصلاح',
    servicesTitle: 'قد تكون خدمة قريبة مناسبة',
    servicesText: 'هذه الخدمات مناسبة اذا كانت المهمة تشمل التحديث او التشخيص او التركيب او الهوية.',
    links: [
      { title: 'تحديث LED', text: 'عندما تحتاج الاضاءة او الوحدات او مزودات الطاقة او النيون الى تحديث.', href: '/leistungen/lichtwerbung-led-modernisierung', tag: 'اضاءة' },
      { title: 'فحص وتشخيص', text: 'عندما يجب اولا فحص الحالة او الاولوية او عدة مواقع.', href: '/leistungen/werbeanlagen-audit-diagnose', tag: 'فحص' },
      { title: 'تركيب وفك', text: 'عندما يكون الوصول او الفك او النقل او التثبيت جزءا من المهمة.', href: '/leistungen/montage-demontage-werbeanlagen', tag: 'تركيب' },
      { title: 'طباعة وهوية', text: 'عندما يجب تجديد الافلام او الكتابات او ملفات الطباعة او مواد الاعلان.', href: '/leistungen/druckprodukte-branding-werbematerialien', tag: 'هوية' },
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

const ORGANIZATION_SCHEMA_ID = `${SITE_BASE_URL}/#organization`;
const REPAIR_OG_IMAGE = buildSiteUrl('/images/leistungen/repair-hero/hero-sign-repair-01.jpg');

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

function getRepairBreadcrumbs(locale: Locale) {
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
      label: labels.repair,
    },
  ];
}

function withoutJsonLdContext(item: JsonLdObject): JsonLdObject {
  const nextItem = { ...item };
  delete nextItem['@context'];

  return nextItem;
}

function buildRepairPageJsonLd(locale: string, content: LandingPageContent) {
  const safeLocale = getLocale(locale);
  const canonicalUrl = buildLocaleUrl(safeLocale, REPAIR_PAGE_PATH);
  const breadcrumbLabels = BREADCRUMB_LABELS_BY_LOCALE[safeLocale];
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
      name: SERVICE_NAME_BY_LOCALE[safeLocale],
      serviceType: SERVICE_NAME_BY_LOCALE[safeLocale],
      description: content.metaDescription,
      provider,
      mainEntityOfPage: canonicalUrl,
      inLanguage: LANGUAGE_TAG_BY_LOCALE[safeLocale],
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
        name: SERVICE_NAME_BY_LOCALE[safeLocale],
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Leuchtkasten-Reparatur',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'LED-Modul-Pruefung und Austausch',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Profilbuchstaben-Reparatur',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Folien- und Beschriftungsreparatur',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Befestigung und Wetterschutz',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Digital Signage Pruefung',
            },
          },
        ],
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
      image: REPAIR_OG_IMAGE,
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
        'Werbeanlagen-Reparatur',
        'Lichtwerbung',
        'LED-Systeme',
        'Leuchtkästen',
        'Profilbuchstaben',
        'Werbefolien',
        'Digital Signage',
        'Outdoor-Displays',
        'Media-Player und Controller',
        'Montage und Befestigung',
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
  const canonicalUrl = buildLocaleUrl(safeLocale, REPAIR_PAGE_PATH);
  const alternateLocales = (Object.entries(OPEN_GRAPH_LOCALE_BY_LOCALE) as Array<[Locale, string]>)
    .filter(([entryLocale]) => entryLocale !== safeLocale)
    .map(([, openGraphLocale]) => openGraphLocale);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(REPAIR_PAGE_PATH),
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
          url: REPAIR_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: content.heroTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
      images: [REPAIR_OG_IMAGE],
    },
  };
}

function RepairProblemLinksSection({ content }: { content: RepairProblemLinksContent }) {
  return (
    <section className="border-t border-[#E7DDD3] bg-[#F7F1E8] px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-end">
          <div className="text-start">
            <SectionEyebrow className="mb-3">{content.eyebrow}</SectionEyebrow>
            <h2 className="max-w-4xl text-3xl font-extrabold leading-[1.08] tracking-[0] text-[#0E1A2B] sm:text-5xl">
              {content.title}
            </h2>
          </div>
          <p className="max-w-2xl text-start text-[15px] font-semibold leading-7 text-[#526174]">
            {content.intro}
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {content.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex min-h-[118px] flex-col justify-between rounded-[16px] border border-[#E7DDD3] bg-[#FFFDF9] p-4 text-start transition duration-300 hover:-translate-y-0.5 hover:border-[#B8643E]/50 hover:bg-white hover:shadow-lg hover:shadow-[#0E1A2B]/[0.06]"
            >
              <div>
                <div className="mb-3 inline-flex rounded-full bg-[#F7F1E8] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#8F4C2F]">
                  {link.tag}
                </div>
                <h3 className="text-[16px] font-extrabold leading-snug tracking-[0] text-[#0E1A2B] transition-colors group-hover:text-[#8F4C2F]">
                  {link.title}
                </h3>
              </div>
              <p className="mt-3 text-[13px] font-semibold leading-5 text-[#526174]">
                {link.text}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function RepairCoverageSection({ content }: { content: RepairScopeContent }) {
  const visibleCoverageCards = content.coverageCards.filter((_, index) => index !== 4);

  return (
    <section className="border-t border-[#E7DDD3] bg-[#FFFDF9] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:items-end">
          <div className="max-w-4xl text-start">
            <SectionEyebrow className="mb-3">{content.coverageEyebrow}</SectionEyebrow>
            <h2 className="text-3xl font-extrabold leading-[1.08] tracking-[0] text-[#0E1A2B] sm:text-5xl">
              {content.coverageTitle}
            </h2>
          </div>
          <p className="max-w-2xl text-start text-[15px] font-semibold leading-7 text-[#526174]">
            {content.coverageIntro}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {visibleCoverageCards.map((card) => (
            <article
              key={card.title}
              className="min-h-[160px] rounded-[20px] border border-[#E7DDD3] bg-[#F7F1E8] p-5 text-start shadow-sm"
            >
              <h3 className="text-[16px] font-extrabold leading-snug tracking-[0] text-[#0E1A2B]">
                {card.title}
              </h3>
              <p className="mt-3 text-[13px] font-semibold leading-6 text-[#526174]">
                {card.text}
              </p>
            </article>
          ))}
        </div>

        <details className="mt-6 overflow-hidden rounded-[22px] border border-[#1B2D42]/10 bg-[#0E1A2B] text-white shadow-[0_18px_45px_rgba(13,27,42,0.12)]">
          <summary className="cursor-pointer list-none p-5 text-start marker:hidden sm:p-6">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#E2A07C]">
              {content.digitalEyebrow}
            </p>
            <h3 className="mt-2 text-[22px] font-extrabold leading-tight tracking-[0] sm:text-[28px]">
              {content.digitalTitle}
            </h3>
            <p className="mt-3 max-w-4xl text-[14px] font-semibold leading-7 text-white/76">
              {content.digitalText}
            </p>
          </summary>
          <div className="grid gap-px bg-white/10 sm:grid-cols-3">
            {content.digitalCards.map((card) => (
              <article key={card.title} className="bg-[#14283D] p-5 text-start">
                <h4 className="text-[16px] font-extrabold leading-snug tracking-[0] text-white">
                  {card.title}
                </h4>
                <p className="mt-3 text-[13px] font-semibold leading-6 text-white/72">
                  {card.text}
                </p>
              </article>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}

function RepairServiceScopeSection({ content }: { content: RepairScopeContent }) {
  const visibleServiceCards = content.serviceCards.slice(0, 4);

  return (
    <section className="border-t border-[#E7DDD3] bg-[#F7F1E8] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:items-start">
        <div>
          <div className="max-w-4xl text-start">
            <SectionEyebrow className="mb-3">{content.serviceEyebrow}</SectionEyebrow>
            <h2 className="text-3xl font-extrabold leading-[1.08] tracking-[0] text-[#0E1A2B] sm:text-5xl">
              {content.serviceTitle}
            </h2>
            <p className="mt-5 text-[15px] font-semibold leading-7 text-[#526174]">
              {content.serviceIntro}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {visibleServiceCards.map((card, index) => (
              <article
                key={card.title}
                className="min-h-[150px] rounded-[20px] border border-[#E7DDD3] bg-[#FFFDF9] p-5 text-start shadow-sm"
              >
                <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F1E8] text-[13px] font-extrabold text-[#8F4C2F]">
                  {index + 1}
                </div>
                <h3 className="text-[17px] font-extrabold leading-snug tracking-[0] text-[#0E1A2B]">{card.title}</h3>
                <p className="mt-3 text-[13.5px] font-semibold leading-6 text-[#526174]">
                  {card.text}
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-[28px] border border-[#D9C7BA] bg-[#FFFDF9] p-6 text-start shadow-[0_22px_60px_rgba(13,27,42,0.1)] lg:sticky lg:top-28">
          <h3 className="text-2xl font-extrabold leading-tight tracking-[0] text-[#0E1A2B]">
            {content.checklistTitle}
          </h3>
          <p className="mt-3 text-[14.5px] font-semibold leading-7 text-[#526174]">
            {content.checklistText}
          </p>
          <ul className="mt-6 grid gap-3">
            {content.checklistItems.map((item) => (
              <li key={item} className="flex gap-3 text-[14px] font-bold leading-6 text-[#0E1A2B]">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#B8643E]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <LeistungenRequestButton
            label={content.ctaLabel}
            serviceIntent="repair-scope-request"
            className="mt-7"
          />
        </aside>
      </div>
    </section>
  );
}

function RepairNextStepSection({ content }: { content: RepairNextStepContent }) {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-4xl text-3xl font-extrabold leading-[1.08] tracking-[0] text-[#0E1A2B] sm:text-5xl">
          {content.title}
        </h2>

        <div className="mt-10 overflow-hidden rounded-[30px] bg-[#101112] shadow-[0_24px_70px_rgba(8,24,39,0.18)] sm:rounded-[36px]">
          <div className="grid min-h-[560px] lg:grid-cols-[0.45fr_0.55fr]">
            <div className="relative z-10 flex min-w-0 flex-col justify-center px-6 py-10 text-start text-white sm:px-10 lg:px-16 lg:py-16">
              <h3 className="max-w-xl text-[30px] font-extrabold leading-[1.08] tracking-[0] sm:text-[44px]">
                {content.requestTitle}
              </h3>
              <p className="mt-5 max-w-md text-[16px] font-semibold leading-8 text-white/72">
                {content.requestText}
              </p>
              <div className="mt-8">
                <LeistungenRequestButton
                  label={content.requestCta}
                  serviceIntent="repair-final-next-step"
                />
              </div>
            </div>

            <div className="relative min-h-[320px] overflow-hidden lg:min-h-full">
              <Image
                src="/images/leistungen/repair-hero/hero-sign-repair-01.jpg"
                alt={content.requestTitle}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-[58%_50%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101112] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#101112] lg:via-[#101112]/20 lg:to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
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
  const faqContent = REPAIR_FAQ_BY_LOCALE[safeLocale];
  const scopeContent = REPAIR_SCOPE_BY_LOCALE[safeLocale];
  const problemLinksContent = REPAIR_PROBLEM_LINKS_BY_LOCALE[safeLocale];
  const nextStepContent = REPAIR_NEXT_STEP_BY_LOCALE[safeLocale];
  const headerContent = globalCms?.header ? { ...globalCms.header, links: undefined } : null;
  const repairPageJsonLd = buildRepairPageJsonLd(locale, content);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F7F1E8] text-[#15202A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(repairPageJsonLd) }}
      />
      <Header content={headerContent} />
      <main>
        <LeistungenRepairHeroSlider
          title={content.heroTitle}
          subline={content.heroSubline}
          slides={getHeroSlides(locale)}
          breadcrumbs={getRepairBreadcrumbs(safeLocale)}
          primaryCta={content.heroPrimaryCta}
          secondaryCta={content.heroSecondaryCta}
        />

        {/* Symptoms Grid & Interactive workflow (Client Component) */}
        <LeistungenReparaturWorkflow
          symptoms={content.symptoms}
          title={content.symptomsTitle}
          locale={locale}
          closeLabel={content.closeLabel}
          formTitle={content.formTitle}
        />

        <LeistungenRepairProofStrip locale={safeLocale} />

        <RepairProblemLinksSection content={problemLinksContent} />

        <LeistungenDiagnosticPrototype locale={safeLocale} />

        <RepairCoverageSection content={scopeContent} />

        <RepairServiceScopeSection content={scopeContent} />

        <FAQSection
          content={{ title: faqContent.title, items: faqContent.items }}
          titleClassName="text-3xl font-extrabold leading-[1.08] tracking-[0] text-[#0E1A2B] sm:text-5xl"
        />

        <RepairNextStepSection content={nextStepContent} />
      </main>
      <Footer content={globalCms?.footer} />
    </div>
  );
}
