import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionEyebrow from '@/components/common/SectionEyebrow';
import { getGlobalPageCmsContent } from '@/lib/cms/pages';
import LeistungenRepairHeroSlider from '@/components/leistungen/LeistungenRepairHeroSlider';
import LeistungenReparaturWorkflow from '@/components/leistungen/LeistungenReparaturWorkflow';
import LeistungenDigitalDiagnosis from '@/components/leistungen/LeistungenDigitalDiagnosis';
import LeistungenRepairCostEstimator from '@/components/leistungen/LeistungenRepairCostEstimator';
import LeistungenFooterCTA from '@/components/sections/LeistungenFooterCTA';

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

type Symptom = {
  id: string;
  title: string;
  cardText: string;
  reassuringText: string;
  prefillMessage: string;
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

const CONTENT: Record<Locale, LandingPageContent> = {
  de: {
    metaTitle: 'Werbeanlagen-Reparatur & Instandsetzung in Berlin & Brandenburg | PixelRing',
    metaDescription: 'Professioneller Service für Lichtwerbung, LED-Systeme und Außenwerbung. Herstellerunabhängig, schnelle Hilfe vor Ort & bis zu 24 Monate Garantie.',
    heroTitle: 'Werbeanlagen-Reparatur & Instandsetzung',
    heroSubline: 'Professioneller Service für Lichtwerbung, LED-Systeme und Außenwerbung in Berlin & Brandenburg. Schnell, herstellerunabhängig und mit Garantie.',
    heroImage: '/images/leistungen/hero-repair.png',
    symptomsTitle: 'Typische Defekte & Symptome',
    closeLabel: 'Schließen',
    formTitle: 'Reparatur anfragen',
    trustTitle: 'Zuverlässiger Rahmen für Ihren Auftrag',
    trustPoints: [
      'Direktkontakt: Keine Vermittlungsplattform — Ihre Anfrage geht direkt an PixelRing.',
      'Kerngebiet: Berlin & Brandenburg für schnelle Reaktionszeiten vor Ort.',
      'Gewährleistung: Bis zu 24 Monate Garantie auf alle ausgeführten Arbeiten und Ersatzteile.',
      'Fachteam: Umsetzung durch zertifizierte Techniker unter zentraler Koordination.',
    ],
    finalHeadline: 'Unsicher, ob Ihre Störung behoben werden kann?',
    finalText: 'Senden Sie uns einfach ein Foto oder eine kurze Beschreibung. PixelRing prüft den Defekt und meldet sich innerhalb von 15 Minuten bei Ihnen.',
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
    metaDescription: 'Профессиональный ремонт световой рекламы, вывесок, LED-систем и коробов. Быстрый выезд, гарантия до 24 месяцев, работаем напрямую.',
    heroTitle: 'Ремонт и обслуживание наружной рекламы',
    heroSubline: 'Профессиональный сервис для световой рекламы, светодиодных (LED) систем и наружных конструкций в Берлине и Бранденбурге. Быстро, надежно и с гарантией.',
    heroImage: '/images/leistungen/hero-repair.png',
    symptomsTitle: 'Выберите вашу неисправность',
    closeLabel: 'Закрыть',
    formTitle: 'Запросить ремонт',
    trustTitle: 'Надежные условия выполнения заказа',
    trustPoints: [
      'Прямой контакт: Никаких бирж и посредников — вы работаете напрямую с PixelRing.',
      'Регион обслуживания: Быстрый выезд по Берлину и всей земле Бранденбург.',
      'Гарантия: До 24 месяцев гарантии на выполненные ремонтные работы и запчасти.',
      'Специалисты: Работы выполняются сертифицированными электриками и монтажниками.',
    ],
    finalHeadline: 'Не уверены, подлежит ли вывеска ремонту?',
    finalText: 'Просто пришлите фото или описание проблемы. Специалисты PixelRing изучат задачу и свяжутся с вами в течение 15 минут.',
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
    metaDescription: 'Professional repair service for illuminated signage, LED systems, and outdoor advertising. Manufacturer independent, rapid on-site assistance & up to 24-month warranty.',
    heroTitle: 'Signage Repair & Maintenance',
    heroSubline: 'Professional service for illuminated signs, LED systems, and outdoor advertising in Berlin & Brandenburg. Fast, manufacturer-independent, and with warranty.',
    heroImage: '/images/leistungen/hero-repair.png',
    symptomsTitle: 'Select your issue for a quick assessment',
    closeLabel: 'Close',
    formTitle: 'Request repair',
    trustTitle: 'A reliable framework for your order',
    trustPoints: [
      'Direct contact: No middleman or listing platform — your request goes directly to PixelRing.',
      'Service region: Berlin & Brandenburg for rapid on-site response times.',
      'Warranty: Up to 24 months warranty on all executed works and spare parts.',
      'Specialist team: Implemented by certified technicians under central coordination.',
    ],
    finalHeadline: 'Unsure if your defect can be repaired?',
    finalText: 'Simply send us a photo or a short description. PixelRing checks the issue and gets back to you within 15 minutes.',
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
    metaDescription: 'Işıklı tabela, LED sistemleri ve dış mekan reklamları için profesyonel onarım hizmeti. Üreticiden bağımsız, hızlı yerinde destek ve 24 aya varan garanti.',
    heroTitle: 'Tabela Onarım & Bakım Hizmetleri',
    heroSubline: "Berlin & Brandenburg'da ışıklı tabelalar, LED sistemleri ve dış mekan reklamları için profesyonel servis. Hızlı, üreticiden bağımsız ve garantili.",
    heroImage: '/images/leistungen/hero-repair.png',
    symptomsTitle: 'Hızlı bir değerlendirme için sorununuzu seçin',
    closeLabel: 'Kapat',
    formTitle: 'Onarım talep et',
    trustTitle: 'Siparişiniz için güvenilir bir çerçeve',
    trustPoints: [
      "Doğrudan iletişim: Aracı veya ilan platformu yok — talebiniz doğrudan PixelRing'e iletilir.",
      'Hizmet bölgesi: Hızlı yerinde müdahale süreleri için Berlin & Brandenburg.',
      'Garanti: Yapılan tüm işler ve yedek parçalar için 24 aya kadar garanti.',
      'Uzman ekip: Merkezi koordinasyon altında sertifikalı teknisyenler tarafından uygulama.',
    ],
    finalHeadline: 'Arızanızın giderilip giderilemeyeceğinden emin değil misiniz?',
    finalText: 'Bize bir fotoğraf veya kısa bir açıklama gönderin. PixelRing arızayı kontrol eder ve 15 dakika içinde size geri döner.',
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
    metaDescription: 'Profesjonalny serwis naprawczy reklam świetlnych, systemów LED i reklam zewnętrznych. Niezależny od producenta, szybka pomoc na miejscu i do 24 miesięcy gwarancji.',
    heroTitle: 'Naprawa & Konserwacja Reklam',
    heroSubline: 'Profesjonalny serwis reklam świetlnych, systemów LED i reklamy zewnętrznej w Berlinie i Brandenburgii. Szybko, niezależnie od producenta i z gwarancją.',
    heroImage: '/images/leistungen/hero-repair.png',
    symptomsTitle: 'Wybierz swój problem w celu szybkiej oceny',
    closeLabel: 'Zamknij',
    formTitle: 'Zgłoś naprawę',
    trustTitle: 'Niezawodne ramy dla Twojego zlecenia',
    trustPoints: [
      'Bezpośredni kontakt: To nie portal ani giełda zleceń — Twoje zgłoszenie trafia bezpośrednio do PixelRing.',
      'Obszar usług: Berlin i Brandenburgia w celu zapewnienia szybkiego dojazdu na miejsce.',
      'Gwarancja: Do 24 miesięcy gwarancji na wszystkie wykonane prace i części zamienne.',
      'Zespół specjalistów: Realizacja przez certyfikowanych techników pod centralną koordynacją.',
    ],
    finalHeadline: 'Nie masz pewności, czy usterka może zostać naprawiona?',
    finalText: 'Po prostu wyślij nam zdjęcie lub krótki opis. PixelRing oceni usterkę i skontaktuje się z Tobą w ciągu 15 minut.',
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
    metaDescription: 'خدمة احترافية لإصلاح الإعلانات المضيئة، وأنظمة LED، والإعلانات الخارجية. مستقل عن الشركة المصنعة، مساعدة سريعة في الموقع وضمان يصل إلى 24 شهرًا.',
    heroTitle: 'إصلاح وصيانة اللوحات الإعلانية',
    heroSubline: 'خدمة احترافية للافتات المضيئة وأنظمة LED والإعلانات الخارجية في برلين وبراندنبورغ. سريع، مستقل عن الشركة المصنعة، ومع ضمان.',
    heroImage: '/images/leistungen/hero-repair.png',
    symptomsTitle: 'اختر مشكلتك للحصول على تقييم سريع',
    closeLabel: 'إغلاق',
    formTitle: 'طلب إصلاح',
    trustTitle: 'إطار موثوق لطلبك',
    trustPoints: [
      'اتصال مباشر: لا توجد منصة وساطة — يذهب طلبك مباشرة إلى PixelRing.',
      'نطاق الخدمة: برلين وبراندنبورغ لأوقات استجابة سريعة في الموقع.',
      'الضمان: ضمان يصل إلى 24 شهرًا على جميع الأعمال المنفذة وقطع الغيار.',
      'فريق متخصص: التنفيذ من قبل فنيين معتمدين تحت تنسيق مركزي.',
    ],
    finalHeadline: 'هل أنت غير متأكد مما إذا كان من الممكن إصلاح العطل؟',
    finalText: 'بساطة أرسل لنا صورة أو وصفًا قصيرًا. تقوم PixelRing بفحص العطل والرد عليك في غضون 15 دقيقة.',
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

const HERO_SLIDES = [
  {
    src: '/images/leistungen/repair-hero/hero-sign-repair-01.jpg',
    alt: 'Techniker repariert einen geöffneten Lichtkasten an einer Ladenfassade',
  },
  {
    src: '/images/leistungen/repair-hero/hero-led-diagnostics-02.jpg',
    alt: 'LED-Module und Verkabelung werden mit einem Messgerät geprüft',
  },
  {
    src: '/images/leistungen/repair-hero/hero-channel-letter-03.jpg',
    alt: 'Techniker repariert beleuchtete Profilbuchstaben an einer Fassade',
  },
  {
    src: '/images/leistungen/repair-hero/hero-rain-damage-04.jpg',
    alt: 'Techniker prüft Feuchtigkeitsschaden an einer Werbeanlage nach Regen',
  },
];

function getContent(locale: string): LandingPageContent {
  return CONTENT[locale as Locale] ?? CONTENT.de;
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

  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#15202A]">
      <Header content={globalCms?.header} />
      <main>
        <LeistungenRepairHeroSlider
          title={content.heroTitle}
          subline={content.heroSubline}
          slides={HERO_SLIDES}
        />

        {/* Symptoms Grid & Interactive workflow (Client Component) */}
        <LeistungenReparaturWorkflow
          symptoms={content.symptoms}
          title={content.symptomsTitle}
          locale={locale}
          closeLabel={content.closeLabel}
          formTitle={content.formTitle}
        />

        <LeistungenDigitalDiagnosis locale={locale} />

        {/* Trust Points Section */}
        <section id="vertrauen" className="bg-[#FFFDF9] border-t border-[#E7DDD3] border-b py-16 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="ltr:text-left rtl:text-right">
              <SectionEyebrow className="mb-3">
                {locale === 'ru' ? 'Стандарты PixelRing' : locale === 'de' ? 'Unsere Standards' : 'Our Standards'}
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

        <LeistungenRepairCostEstimator locale={locale} />

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
