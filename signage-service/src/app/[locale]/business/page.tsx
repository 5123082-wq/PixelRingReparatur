import type { Metadata } from 'next';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';
import { getGlobalPageCmsContent, getBusinessPageCmsContent } from '@/lib/cms/pages';
import Image from 'next/image';
import CmsImage from '@/components/common/CmsImage';
import SectionEyebrow from '@/components/common/SectionEyebrow';
import BusinessShowcase from '@/components/sections/BusinessShowcase';
import BusinessReportDemoButton from '@/components/business/BusinessReportDemoButton';

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';
const BUSINESS_PRESENTATION_HREF = '/downloads/pixelring-business-presentation.pdf';
const BUSINESS_SECTION_TITLE_CLASS =
  'text-[36px] font-extrabold leading-[42px] tracking-[0] text-[#081827] sm:text-[40px] sm:leading-[46px] lg:text-[44px] lg:leading-[50px]';
const BUSINESS_SECTION_INTRO_CLASS =
  'mt-6 max-w-[580px] text-[18px] font-normal leading-[1.6] tracking-[0] text-[#526174]';
const BUSINESS_SECTION_INTRO_ACCENT_CLASS =
  `${BUSINESS_SECTION_INTRO_CLASS} border-l-2 border-[#B8643E] pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4`;
const BUSINESS_CARD_TITLE_CLASS =
  'text-[18px] font-black leading-[23px] tracking-[0] text-[#081827] sm:text-[20px] sm:leading-[25px]';
const BUSINESS_CARD_BODY_CLASS =
  'mt-2 text-[15px] font-normal leading-[1.55] tracking-[0] text-[#526174]';

type TargetGroup = {
  id: string;
  title: string;
  description: string;
};

type Benefit = {
  id: string;
  title: string;
  description: string;
};

type BusinessContent = {
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroIntro: string;
  heroCta: string;
  heroImage: string;
  heroImageAlt?: string;
  heroFallbackSrc?: string;
  targetTitle: string;
  targetIntro: string;
  targetGroups: TargetGroup[];
  auditTitle: string;
  auditIntro: string;
  auditBenefits: Benefit[];
  auditCta: string;
  platformTitle: string;
  platformIntro: string;
  platformBenefits: Benefit[];
  platformNoteLead: string;
  platformNoteText: string;
  portalCta: string;
  portalDemoCta: string;
  trustTitle: string;
  trustIntro: string;
  finalHeadline: string;
  finalText: string;
  finalCta: string;
  heroEnabled?: boolean;
  targetEnabled?: boolean;
  auditEnabled?: boolean;
  platformEnabled?: boolean;
  trustEnabled?: boolean;
  finalEnabled?: boolean;
};

type BusinessMockupContent = {
  targetEyebrow: string;
  auditEyebrow: string;
  platformEyebrow: string;
  finalEyebrow: string;
  auditImageAlt: string;
  auditOverviewLabel: string;
  auditChecksLabel: string;
  auditStatuses: { ok: string; planned: string; urgent: string };
  auditCompleteLabel: string;
  auditStats: { assets: string; print: string; risks: string };
  portalLiveLabel: string;
  portalKpis: { label: string; value: string; sub: string; color: string }[];
  portalRows: { pin: string; city: string; desc: string; status: string; statusColor: string }[];
  reportReadyTitle: string;
  reportReadyText: string;
  reportButton: string;
};

const CONTENT: Record<Locale, BusinessContent> = {
  de: {
    metaTitle: 'B2B Service & Wartung für Werbeanlagen | PixelRing',
    metaDescription: 'Komplexer Service und Wartung für Geschäftskunden. Restaurants, Einzelhandel und Netzwerke. Alles aus einer Hand mit eigenem Kundenportal.',
    heroTitle: 'Komplexer Service für Ihre Standorte',
    heroIntro: 'Professionelle Betreuung Ihrer Werbeanlagen, Leuchtreklamen und Printmedien. Wir lösen die Probleme an Ihren Verkaufsstellen, bevor sie Ihren Kunden auffallen.',
    heroCta: 'Service anfragen',
    heroImage: '/images/business/hero.png',
    targetTitle: 'Für jede Unternehmensgröße',
    targetIntro: 'Egal ob einzelner Standort oder Filialnetzwerk: Wir schließen Ihre Lücken im Rahmen eines umfassenden Servicevertrags.',
    targetGroups: [
      { id: 'restaurants', title: 'Gastronomie & Restaurants', description: 'Reparatur von Neon, Leuchtkästen, Austausch von zerrissenen oder schmutzigen Speisekarten und Postern.' },
      { id: 'salons', title: 'Beauty & Salons', description: 'Pflege und Wartung von Schaufensterbeschriftungen und eleganten Leuchtschildern.' },
      { id: 'dealers', title: 'Autohäuser', description: 'Wartung von großen Pylonen, Fassadenschildern und Signaletik auf dem Gelände.' },
      { id: 'retail', title: 'Filialisten & Retail', description: 'Standardisierte Prozesse und SLAs für ein konsistentes Markenbild an allen Standorten.' }
    ],
    auditTitle: 'Audit & Betreuung',
    auditIntro: 'Im Rahmen des Servicevertrags erhalten Sie vollständige Betreuung und Kontrolle über Ihre Verkaufsstandorte.',
    auditBenefits: [
      { id: 'a1', title: 'Regelmäßige Inspektion', description: 'Wir prüfen proaktiv den Zustand der Lichtwerbung und Printmaterialien vor Ort.' },
      { id: 'a2', title: 'Markenkonsistenz', description: 'Zerrissene Poster, veraltete Speisekarten oder schmutzige Aufkleber werden erkannt und erneuert.' },
      { id: 'a3', title: 'Planbare Kosten', description: 'Feste Service-Raten (Abo-Modell) statt unberechenbarer Einzelreparaturen.' }
    ],
    auditCta: 'Service-Audit anfragen',
    platformTitle: 'Volle Kontrolle in Ihrem Kundenportal',
    platformIntro: 'Wir bieten nicht nur Ausführung, sondern auch Transparenz. Mit einem Klick haben Sie den kompletten Überblick über alle Standorte, Audits und Reparaturstatus.',
    platformBenefits: [
      { id: 'p1', title: 'Echtzeit-Tracking', description: 'Verfolgen Sie jeden Auftrag von der Meldung bis zur Fertigstellung auf allen Etappen.' },
      { id: 'p2', title: 'Umfassender Audit-Report', description: 'Detaillierte Berichte über den Zustand jedes Standortes inkl. Foto-Dokumentation.' },
      { id: 'p3', title: 'Ein zentraler Ansprechpartner', description: 'Koordination aus einer Quelle. Keine Suche nach verschiedenen Dienstleistern.' }
    ],
    platformNoteLead: 'Ideal für Filialnetze:',
    platformNoteText: 'eine Übersicht statt verstreuter E-Mails, Fotos und Einzelaufträge.',
    portalCta: 'Kundenportal ansehen',
    portalDemoCta: 'Präsentation herunterladen',
    trustTitle: 'Verantwortung & Koordination',
    trustIntro: 'Geben Sie die Verantwortung für Ihre sichtbare Marke in die Hände von Spezialisten.',
    finalHeadline: 'Bereit für einen reibungslosen Betriebsablauf?',
    finalText: 'Kontaktieren Sie uns für ein individuelles Service-Audit Ihrer Standorte.',
    finalCta: 'Service anfragen'
  },
  en: {
    metaTitle: 'B2B Service & Maintenance for Signage | PixelRing',
    metaDescription: 'Complex service and maintenance for business clients. Restaurants, retail, and networks. Everything from a single source with your own customer portal.',
    heroTitle: 'Comprehensive Service for Your Locations',
    heroIntro: 'Professional care for your signage, illuminated advertising, and print media. We solve problems at your points of sale before your customers notice.',
    heroCta: 'Request service',
    heroImage: '/images/business/hero.png',
    targetTitle: 'For Every Business Size',
    targetIntro: 'Whether a single location or a branch network: We cover your gaps within a comprehensive service contract.',
    targetGroups: [
      { id: 'restaurants', title: 'Gastronomy & Restaurants', description: 'Repairing neon, light boxes, replacing torn or dirty menus and posters.' },
      { id: 'salons', title: 'Beauty & Salons', description: 'Care and maintenance of window lettering and elegant illuminated signs.' },
      { id: 'dealers', title: 'Car Dealerships', description: 'Maintenance of large pylons, facade signs, and site signage.' },
      { id: 'retail', title: 'Chains & Retail', description: 'Standardized processes and SLAs for a consistent brand image across all locations.' }
    ],
    auditTitle: 'Audit & Maintenance',
    auditIntro: 'Under the service contract, you receive full support and oversight for your retail locations.',
    auditBenefits: [
      { id: 'a1', title: 'Regular Inspection', description: 'We proactively check the condition of illuminated advertising and print materials on site.' },
      { id: 'a2', title: 'Brand Consistency', description: 'Torn posters, outdated menus, or dirty stickers are identified and renewed.' },
      { id: 'a3', title: 'Predictable Costs', description: 'Fixed service rates (subscription model) instead of unpredictable individual repairs.' }
    ],
    auditCta: 'Request service audit',
    platformTitle: 'Full Control in Your Customer Portal',
    platformIntro: 'We offer not only execution but also transparency. With one click, you have a complete overview of all locations, audits, and repair statuses.',
    platformBenefits: [
      { id: 'p1', title: 'Real-time Tracking', description: 'Track every order from report to completion at all stages.' },
      { id: 'p2', title: 'Comprehensive Audit Report', description: 'Detailed reports on the condition of each location including photo documentation.' },
      { id: 'p3', title: 'One Central Contact', description: 'Coordination from a single source. No need to search for different service providers.' }
    ],
    platformNoteLead: 'Ideal for branch networks:',
    platformNoteText: 'one overview instead of scattered emails, photos, and individual requests.',
    portalCta: 'View Customer Portal',
    portalDemoCta: 'Download presentation',
    trustTitle: 'Responsibility & Coordination',
    trustIntro: 'Place the responsibility for your visible brand in the hands of specialists.',
    finalHeadline: 'Ready for smooth operations?',
    finalText: 'Contact us for an individual service audit of your locations.',
    finalCta: 'Request service'
  },
  ru: {
    metaTitle: 'B2B Сервис и обслуживание вывесок | PixelRing',
    metaDescription: 'Комплексный сервис и обслуживание для бизнеса. Рестораны, ритейл и сети. Все из одного источника с личным кабинетом.',
    heroTitle: 'Комплексный подход к обслуживанию объектов',
    heroIntro: 'Профессиональное обслуживание вывесок, световой рекламы и печатной продукции. Мы закрываем боли владельцев бизнеса, обеспечивая идеальный вид точек продаж.',
    heroCta: 'Запросить сервис',
    heroImage: '/images/business/hero.png',
    targetTitle: 'Для бизнеса любого масштаба',
    targetIntro: 'Будь то ресторан, автосалон или сеть магазинов — мы решаем проблемные места комплексно в рамках договора обслуживания.',
    targetGroups: [
      { id: 'restaurants', title: 'Рестораны и Кафе', description: 'Ремонт неона, замена порванных или грязных меню, постеров и внутренней навигации.' },
      { id: 'salons', title: 'Салоны красоты', description: 'Уход за оконной пленкой, интерьерными вывесками и световыми логотипами.' },
      { id: 'dealers', title: 'Автосалоны', description: 'Обслуживание крупных стел, фасадных вывесок и указателей на территории.' },
      { id: 'retail', title: 'Сетевой ритейл', description: 'Единые стандарты SLA для поддержания бренда во всех точках сети.' }
    ],
    auditTitle: 'Аудит и обслуживание',
    auditIntro: 'В рамках договора обслуживания Вы получаете полное сопровождение и контроль своих торговых точек.',
    auditBenefits: [
      { id: 'a1', title: 'Регулярная инспекция', description: 'Проактивный аудит состояния вывесок и рекламных материалов на объекте.' },
      { id: 'a2', title: 'Контроль бренда', description: 'Своевременная замена испорченных меню, порванных плакатов и выцветших пленок.' },
      { id: 'a3', title: 'Подписочная модель', description: 'Прогнозируемые расходы вместо внезапных трат на срочные ремонты.' }
    ],
    auditCta: 'Запросить аудит',
    platformTitle: 'Личный кабинет и прозрачность',
    platformIntro: 'Полный доступ к своему личному кабинету на платформе. Вы видите все статусы, заявки и историю ремонтов.',
    platformBenefits: [
      { id: 'p1', title: 'Отслеживание на всех этапах', description: 'Контролируйте статус каждой заявки от создания до приемки работ.' },
      { id: 'p2', title: 'Полный аудит точек', description: 'Предоставляем заказчику отчет о том, что происходит на его точках продаж.' },
      { id: 'p3', title: 'Один общий источник', description: 'Ответственность, гарантии и координация всех подрядчиков на нашей стороне.' }
    ],
    platformNoteLead: 'Особенно удобно для сетей:',
    platformNoteText: 'единый обзор вместо разрозненных писем, фотографий и отдельных заявок.',
    portalCta: 'Личный кабинет',
    portalDemoCta: 'Скачать презентацию',
    trustTitle: 'Ответственность и Гарантии',
    trustIntro: 'Делегируйте технические и визуальные проблемы специалистам.',
    finalHeadline: 'Готовы к безупречной работе ваших объектов?',
    finalText: 'Свяжитесь с нами для первичного аудита.',
    finalCta: 'Запросить сервис'
  },
  tr: {
    metaTitle: 'B2B Servis ve Tabela Bakımı | PixelRing',
    metaDescription: 'İşletmeler için kapsamlı servis. Restoranlar, perakende ve ağlar. Kendi müşteri portalınızla tek elden çözüm.',
    heroTitle: 'Lokasyonlarınız için Kapsamlı Hizmet',
    heroIntro: 'Tabelalarınız ve baskı malzemeleriniz için profesyonel bakım. Sorunları müşterileriniz fark etmeden çözüyoruz.',
    heroCta: 'Servis talep et',
    heroImage: '/images/business/hero.png',
    targetTitle: 'Her İşletme Büyüklüğü İçin',
    targetIntro: 'Tek şube veya zincir mağaza fark etmeksizin tüm eksiklerinizi servis sözleşmemizle kapatıyoruz.',
    targetGroups: [
      { id: 'restaurants', title: 'Restoran & Kafe', description: 'Neon tamiri, yırtık menü ve posterlerin yenilenmesi.' },
      { id: 'salons', title: 'Güzellik Salonları', description: 'Vitrin yazıları ve şık ışıklı tabelaların bakımı.' },
      { id: 'dealers', title: 'Oto Galerileri', description: 'Büyük pilonların ve cephe tabelalarının bakımı.' },
      { id: 'retail', title: 'Zincir Mağazalar', description: 'Tüm lokasyonlarda tutarlı bir marka imajı için standart süreçler.' }
    ],
    auditTitle: 'Denetim ve bakım',
    auditIntro: 'Servis sözleşmesi kapsamında satış noktalarınız için tam destek ve kontrol elde edersiniz.',
    auditBenefits: [
      { id: 'a1', title: 'Düzenli İnceleme', description: 'Tabela ve basılı materyallerin durumunu proaktif olarak denetliyoruz.' },
      { id: 'a2', title: 'Marka Tutarlılığı', description: 'Yırtık posterler ve eski menüler anında yenilenir.' },
      { id: 'a3', title: 'Öngörülebilir Maliyet', description: 'Beklenmedik onarım masrafları yerine sabit hizmet paketleri.' }
    ],
    auditCta: 'Servis denetimi talep et',
    platformTitle: 'Müşteri Portalınızda Tam Kontrol',
    platformIntro: 'Platformdaki kişisel hesabınıza tam erişim ile tüm talepleri ve onarım geçmişinizi takip edebilirsiniz.',
    platformBenefits: [
      { id: 'p1', title: 'Gerçek Zamanlı Takip', description: 'Siparişten teslimata kadar her aşamayı izleyin.' },
      { id: 'p2', title: 'Kapsamlı Denetim Raporu', description: 'Her lokasyonun güncel durumu hakkında fotoğraflı detaylı raporlar.' },
      { id: 'p3', title: 'Tek Sorumlu', description: 'Tüm süreçlerin koordinasyonu ve garantisi bizim sorumluluğumuzda.' }
    ],
    platformNoteLead: 'Şube ağları için ideal:',
    platformNoteText: 'dağınık e-postalar, fotoğraflar ve tekil talepler yerine tek bir genel bakış.',
    portalCta: 'Müşteri Portalı',
    portalDemoCta: 'Sunumu indir',
    trustTitle: 'Sorumluluk ve Koordinasyon',
    trustIntro: 'Görünür markanızın sorumluluğunu uzmanlara bırakın.',
    finalHeadline: 'Sorunsuz bir operasyona hazır mısınız?',
    finalText: 'Şubeleriniz için bir ön denetim ayarlamak üzere bizimle iletişime geçin.',
    finalCta: 'Servis talep et'
  },
  pl: {
    metaTitle: 'B2B Serwis i Konserwacja Szyldów | PixelRing',
    metaDescription: 'Kompleksowy serwis i konserwacja dla biznesu. Restauracje, sieci handlowe. Wszystko z jednego źródła z portalem klienta.',
    heroTitle: 'Kompleksowa Obsługa Twoich Lokalizacji',
    heroIntro: 'Profesjonalna opieka nad szyldami i materiałami drukowanymi. Rozwiązujemy problemy, zanim zauważą je Twoi klienci.',
    heroCta: 'Zapytaj o serwis',
    heroImage: '/images/business/hero.png',
    targetTitle: 'Dla Firm Każdej Wielkości',
    targetIntro: 'Niezależnie od tego, czy masz jeden lokal, czy sieć: w ramach umowy serwisowej zajmiemy się wszystkim.',
    targetGroups: [
      { id: 'restaurants', title: 'Restauracje i Gastronomia', description: 'Naprawa neonów, wymiana zniszczonych menu i plakatów.' },
      { id: 'salons', title: 'Salony Urody', description: 'Konserwacja witryn i eleganckich szyldów świetlnych.' },
      { id: 'dealers', title: 'Salony Samochodowe', description: 'Obsługa dużych pylonów i szyldów elewacyjnych.' },
      { id: 'retail', title: 'Sieci Handlowe', description: 'Standardowe procesy i SLA dla spójnego wizerunku we wszystkich lokalizacjach.' }
    ],
    auditTitle: 'Audyt i obsługa',
    auditIntro: 'W ramach umowy serwisowej otrzymujesz pełne wsparcie i kontrolę nad swoimi punktami sprzedaży.',
    auditBenefits: [
      { id: 'a1', title: 'Regularne Inspekcje', description: 'Proaktywnie audytujemy stan reklam i materiałów POS.' },
      { id: 'a2', title: 'Spójność Marki', description: 'Szybka wymiana zniszczonych plakatów i wyblakłych naklejek.' },
      { id: 'a3', title: 'Przewidywalne Koszty', description: 'Stałe stawki serwisowe zamiast niespodziewanych napraw.' }
    ],
    auditCta: 'Zapytaj o audyt',
    platformTitle: 'Pełna Kontrola w Portalu Klienta',
    platformIntro: 'Zyskujesz pełny dostęp do osobistego panelu na naszej platformie. Śledź wszystkie zlecenia i historię obsługi Twojego biznesu.',
    platformBenefits: [
      { id: 'p1', title: 'Śledzenie w Czasie Rzeczywistym', description: 'Monitoruj status każdej naprawy na każdym etapie.' },
      { id: 'p2', title: 'Raporty z Audytów', description: 'Dostarczamy szczegółowy przegląd tego, co dzieje się w każdym punkcie.' },
      { id: 'p3', title: 'Jedno Źródło Kontaktu', description: 'Gwarancja i koordynacja wszystkich prac leży po naszej stronie.' }
    ],
    platformNoteLead: 'Idealne dla sieci placówek:',
    platformNoteText: 'jeden widok zamiast rozproszonych e-maili, zdjęć i pojedynczych zgłoszeń.',
    portalCta: 'Portal klienta',
    portalDemoCta: 'Pobierz prezentację',
    trustTitle: 'Odpowiedzialność i Gwarancje',
    trustIntro: 'Przekaż opiekę nad wizualnym aspektem marki profesjonalistom.',
    finalHeadline: 'Gotowy na bezproblemowe działanie?',
    finalText: 'Skontaktuj się z nami w celu przeprowadzenia audytu.',
    finalCta: 'Zapytaj o serwis'
  },
  ar: {
    metaTitle: 'خدمات وصيانة الشركات | بكسل رينج',
    metaDescription: 'خدمات شاملة وصيانة للشركات، المطاعم، شبكات التجزئة. كل شيء من مصدر واحد مع بوابة خاصة للعميل.',
    heroTitle: 'خدمة شاملة لمواقعك التجارية',
    heroIntro: 'رعاية احترافية للوحات الإعلانية والمواد المطبوعة. نحن نحل المشاكل في نقاط البيع الخاصة بك قبل أن يلاحظها عملاؤك.',
    heroCta: 'اطلب الخدمة',
    heroImage: '/images/business/hero.png',
    targetTitle: 'لجميع أحجام الشركات',
    targetIntro: 'سواء كان موقعاً واحداً أو شبكة فروع: نحن نغطي احتياجاتك من خلال عقد خدمة شامل.',
    targetGroups: [
      { id: 'restaurants', title: 'المطاعم والمقاهي', description: 'إصلاح النيون، وتغيير القوائم والملصقات الممزقة أو المتسخة.' },
      { id: 'salons', title: 'صالونات التجميل', description: 'العناية بواجهات النوافذ واللوحات المضيئة الأنيقة.' },
      { id: 'dealers', title: 'معارض السيارات', description: 'صيانة اللوحات الإعلانية الكبيرة ولوحات الواجهات.' },
      { id: 'retail', title: 'شبكات التجزئة', description: 'عمليات موحدة لضمان صورة متسقة للعلامة التجارية في جميع المواقع.' }
    ],
    auditTitle: 'التدقيق والصيانة',
    auditIntro: 'ضمن عقد الخدمة، تحصل على متابعة كاملة ورقابة على نقاط البيع الخاصة بك.',
    auditBenefits: [
      { id: 'a1', title: 'فحص دوري', description: 'نقوم بالتدقيق الاستباقي لحالة الإعلانات والمواد المطبوعة.' },
      { id: 'a2', title: 'تناسق العلامة التجارية', description: 'الاستبدال الفوري للملصقات الممزقة والقوائم القديمة.' },
      { id: 'a3', title: 'تكاليف يمكن التنبؤ بها', description: 'أسعار خدمات ثابتة بدلاً من الإصلاحات المفاجئة.' }
    ],
    auditCta: 'طلب تدقيق الخدمة',
    platformTitle: 'تحكم كامل في بوابة العميل الخاصة بك',
    platformIntro: 'نمنحك وصولاً كاملاً إلى لوحتك الخاصة على منصتنا. يمكنك متابعة جميع الطلبات وتاريخ الصيانة لأعمالك.',
    platformBenefits: [
      { id: 'p1', title: 'تتبع مباشر', description: 'تتبع حالة كل إصلاح في جميع مراحله.' },
      { id: 'p2', title: 'تقارير تدقيق مفصلة', description: 'نقدم تفاصيل كاملة عما يحدث في كل موقع مع الصور.' },
      { id: 'p3', title: 'مصدر واحد للتواصل', description: 'جميع الضمانات والتنسيق بين المقاولين تقع على عاتقنا.' }
    ],
    platformNoteLead: 'مثالي لشبكات الفروع:',
    platformNoteText: 'نظرة عامة واحدة بدلاً من رسائل وصور وطلبات منفصلة ومتفرقة.',
    portalCta: 'عرض بوابة العميل',
    portalDemoCta: 'تنزيل العرض التقديمي',
    trustTitle: 'المسؤولية والضمانات',
    trustIntro: 'اترك مسؤولية صورتك التجارية للمتخصصين.',
    finalHeadline: 'هل أنت مستعد لعمليات خالية من المشاكل؟',
    finalText: 'اتصل بنا لإجراء تدقيق لمواقعك.',
    finalCta: 'اطلب الخدمة'
  }
};

const MOCKUP_CONTENT: Record<Locale, BusinessMockupContent> = {
  de: {
    targetEyebrow: 'SECTORS',
    auditEyebrow: 'Service-Abo',
    platformEyebrow: 'Kundenportal & Reports',
    finalEyebrow: 'NEXT STEP',
    auditImageAlt: 'Audit & Standort-Wartung',
    auditOverviewLabel: 'Standortübersicht',
    auditChecksLabel: 'Checks',
    auditStatuses: { ok: 'OK', planned: 'Planen', urgent: 'Dringend' },
    auditCompleteLabel: 'Audit abgeschlossen',
    auditStats: { assets: 'Anlagen geprüft', print: 'Print-Updates', risks: 'Risiken markiert' },
    portalLiveLabel: 'Live Übersicht',
    portalKpis: [
      { label: 'Brand Health', value: '86%', sub: '+12% seit Audit', color: 'text-[#35b47a]' },
      { label: 'Offene Tasks', value: '7', sub: '3 priorisiert', color: 'text-[#d99a35]' },
      { label: 'Standorte', value: '24', sub: 'alle dokumentiert', color: 'text-[#526174]' },
    ],
    portalRows: [
      { pin: 'B', city: 'Berlin Mitte', desc: 'Leuchtreklame und Fensterfolien geprüft', status: 'OK', statusColor: 'bg-[#35b47a]/15 text-[#35b47a]' },
      { pin: 'H', city: 'Hamburg Store', desc: 'Posterwechsel und LED-Service geplant', status: 'Planen', statusColor: 'bg-[#d99a35]/15 text-[#d99a35]' },
      { pin: 'K', city: 'Köln Süd', desc: 'Befestigung prüfen, Fotoreport liegt vor', status: 'Dringend', statusColor: 'bg-[#d65f5f]/15 text-[#d65f5f]' },
    ],
    reportReadyTitle: 'Audit-Report bereit',
    reportReadyText: 'Fotos, Zustände, Prioritäten pro Standort.',
    reportButton: 'Report ansehen',
  },
  en: {
    targetEyebrow: 'SECTORS',
    auditEyebrow: 'Service plan',
    platformEyebrow: 'Customer portal & reports',
    finalEyebrow: 'NEXT STEP',
    auditImageAlt: 'Audit and location maintenance',
    auditOverviewLabel: 'Location overview',
    auditChecksLabel: 'Checks',
    auditStatuses: { ok: 'OK', planned: 'Planned', urgent: 'Urgent' },
    auditCompleteLabel: 'Audit completed',
    auditStats: { assets: 'assets checked', print: 'print updates', risks: 'risks marked' },
    portalLiveLabel: 'Live overview',
    portalKpis: [
      { label: 'Brand health', value: '86%', sub: '+12% since audit', color: 'text-[#35b47a]' },
      { label: 'Open tasks', value: '7', sub: '3 prioritized', color: 'text-[#d99a35]' },
      { label: 'Locations', value: '24', sub: 'all documented', color: 'text-[#526174]' },
    ],
    portalRows: [
      { pin: 'B', city: 'Berlin Mitte', desc: 'Light sign and window films checked', status: 'OK', statusColor: 'bg-[#35b47a]/15 text-[#35b47a]' },
      { pin: 'H', city: 'Hamburg Store', desc: 'Poster change and LED service planned', status: 'Planned', statusColor: 'bg-[#d99a35]/15 text-[#d99a35]' },
      { pin: 'K', city: 'Köln Süd', desc: 'Mounting check, photo report available', status: 'Urgent', statusColor: 'bg-[#d65f5f]/15 text-[#d65f5f]' },
    ],
    reportReadyTitle: 'Audit report ready',
    reportReadyText: 'Photos, condition, priorities per location.',
    reportButton: 'View report',
  },
  ru: {
    targetEyebrow: 'СЕГМЕНТЫ',
    auditEyebrow: 'Сервисное сопровождение',
    platformEyebrow: 'Кабинет и отчеты',
    finalEyebrow: 'СЛЕДУЮЩИЙ ШАГ',
    auditImageAlt: 'Аудит и обслуживание объектов',
    auditOverviewLabel: 'Обзор объектов',
    auditChecksLabel: 'проверок',
    auditStatuses: { ok: 'OK', planned: 'План', urgent: 'Срочно' },
    auditCompleteLabel: 'Аудит завершен',
    auditStats: { assets: 'объектов проверено', print: 'обновлений печати', risks: 'риска отмечено' },
    portalLiveLabel: 'Живой обзор',
    portalKpis: [
      { label: 'Состояние бренда', value: '86%', sub: '+12% после аудита', color: 'text-[#35b47a]' },
      { label: 'Открытые задачи', value: '7', sub: '3 в приоритете', color: 'text-[#d99a35]' },
      { label: 'Объекты', value: '24', sub: 'все задокументированы', color: 'text-[#526174]' },
    ],
    portalRows: [
      { pin: 'B', city: 'Berlin Mitte', desc: 'Проверены световая реклама и оконные пленки', status: 'OK', statusColor: 'bg-[#35b47a]/15 text-[#35b47a]' },
      { pin: 'H', city: 'Hamburg Store', desc: 'Запланированы замена постеров и LED-сервис', status: 'План', statusColor: 'bg-[#d99a35]/15 text-[#d99a35]' },
      { pin: 'K', city: 'Köln Süd', desc: 'Проверить крепление, фотоотчет готов', status: 'Срочно', statusColor: 'bg-[#d65f5f]/15 text-[#d65f5f]' },
    ],
    reportReadyTitle: 'Аудит-отчет готов',
    reportReadyText: 'Фото, состояния и приоритеты по каждому объекту.',
    reportButton: 'Открыть отчет',
  },
  tr: {
    targetEyebrow: 'SEKTÖRLER',
    auditEyebrow: 'Servis paketi',
    platformEyebrow: 'Müşteri portalı ve raporlar',
    finalEyebrow: 'SONRAKI ADIM',
    auditImageAlt: 'Denetim ve lokasyon bakımı',
    auditOverviewLabel: 'Lokasyon özeti',
    auditChecksLabel: 'kontrol',
    auditStatuses: { ok: 'OK', planned: 'Planlı', urgent: 'Acil' },
    auditCompleteLabel: 'Denetim tamamlandı',
    auditStats: { assets: 'alan kontrol edildi', print: 'baskı güncellemesi', risks: 'risk işaretlendi' },
    portalLiveLabel: 'Canlı özet',
    portalKpis: [
      { label: 'Marka sağlığı', value: '86%', sub: '+12% denetimden beri', color: 'text-[#35b47a]' },
      { label: 'Açık görevler', value: '7', sub: '3 öncelikli', color: 'text-[#d99a35]' },
      { label: 'Lokasyonlar', value: '24', sub: 'tümü belgeli', color: 'text-[#526174]' },
    ],
    portalRows: [
      { pin: 'B', city: 'Berlin Mitte', desc: 'Işıklı tabela ve cam folyoları kontrol edildi', status: 'OK', statusColor: 'bg-[#35b47a]/15 text-[#35b47a]' },
      { pin: 'H', city: 'Hamburg Store', desc: 'Poster değişimi ve LED servisi planlandı', status: 'Planlı', statusColor: 'bg-[#d99a35]/15 text-[#d99a35]' },
      { pin: 'K', city: 'Köln Süd', desc: 'Bağlantı kontrolü, foto raporu hazır', status: 'Acil', statusColor: 'bg-[#d65f5f]/15 text-[#d65f5f]' },
    ],
    reportReadyTitle: 'Denetim raporu hazır',
    reportReadyText: 'Her lokasyon için fotoğraflar, durumlar ve öncelikler.',
    reportButton: 'Raporu aç',
  },
  pl: {
    targetEyebrow: 'SEKTORY',
    auditEyebrow: 'Pakiet serwisowy',
    platformEyebrow: 'Portal klienta i raporty',
    finalEyebrow: 'NASTEPNY KROK',
    auditImageAlt: 'Audyt i obsługa lokalizacji',
    auditOverviewLabel: 'Przegląd lokalizacji',
    auditChecksLabel: 'kontroli',
    auditStatuses: { ok: 'OK', planned: 'Plan', urgent: 'Pilne' },
    auditCompleteLabel: 'Audyt zakończony',
    auditStats: { assets: 'lokali sprawdzono', print: 'aktualizacji druku', risks: 'ryzyka oznaczono' },
    portalLiveLabel: 'Podgląd live',
    portalKpis: [
      { label: 'Kondycja marki', value: '86%', sub: '+12% po audycie', color: 'text-[#35b47a]' },
      { label: 'Otwarte zadania', value: '7', sub: '3 priorytetowe', color: 'text-[#d99a35]' },
      { label: 'Lokalizacje', value: '24', sub: 'wszystkie opisane', color: 'text-[#526174]' },
    ],
    portalRows: [
      { pin: 'B', city: 'Berlin Mitte', desc: 'Sprawdzono reklamę świetlną i folie okienne', status: 'OK', statusColor: 'bg-[#35b47a]/15 text-[#35b47a]' },
      { pin: 'H', city: 'Hamburg Store', desc: 'Zaplanowano wymianę plakatów i serwis LED', status: 'Plan', statusColor: 'bg-[#d99a35]/15 text-[#d99a35]' },
      { pin: 'K', city: 'Köln Süd', desc: 'Sprawdzić mocowanie, raport foto gotowy', status: 'Pilne', statusColor: 'bg-[#d65f5f]/15 text-[#d65f5f]' },
    ],
    reportReadyTitle: 'Raport audytu gotowy',
    reportReadyText: 'Zdjęcia, stany i priorytety dla każdej lokalizacji.',
    reportButton: 'Zobacz raport',
  },
  ar: {
    targetEyebrow: 'القطاعات',
    auditEyebrow: 'باقة الخدمة',
    platformEyebrow: 'بوابة العميل والتقارير',
    finalEyebrow: 'الخطوة التالية',
    auditImageAlt: 'تدقيق وصيانة المواقع',
    auditOverviewLabel: 'نظرة عامة على المواقع',
    auditChecksLabel: 'فحص',
    auditStatuses: { ok: 'OK', planned: 'مخطط', urgent: 'عاجل' },
    auditCompleteLabel: 'اكتمل التدقيق',
    auditStats: { assets: 'موقعاً تم فحصه', print: 'تحديثات طباعة', risks: 'مخاطر محددة' },
    portalLiveLabel: 'نظرة مباشرة',
    portalKpis: [
      { label: 'صحة العلامة', value: '86%', sub: '+12% بعد التدقيق', color: 'text-[#35b47a]' },
      { label: 'مهام مفتوحة', value: '7', sub: '3 ذات أولوية', color: 'text-[#d99a35]' },
      { label: 'المواقع', value: '24', sub: 'موثقة بالكامل', color: 'text-[#526174]' },
    ],
    portalRows: [
      { pin: 'B', city: 'Berlin Mitte', desc: 'تم فحص اللوحة المضيئة وملصقات النوافذ', status: 'OK', statusColor: 'bg-[#35b47a]/15 text-[#35b47a]' },
      { pin: 'H', city: 'Hamburg Store', desc: 'تم تخطيط تغيير الملصقات وخدمة LED', status: 'مخطط', statusColor: 'bg-[#d99a35]/15 text-[#d99a35]' },
      { pin: 'K', city: 'Köln Süd', desc: 'فحص التثبيت، تقرير الصور جاهز', status: 'عاجل', statusColor: 'bg-[#d65f5f]/15 text-[#d65f5f]' },
    ],
    reportReadyTitle: 'تقرير التدقيق جاهز',
    reportReadyText: 'صور وحالات وأولويات لكل موقع.',
    reportButton: 'عرض التقرير',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'de') as Locale;
  const tContent = CONTENT[locale] || CONTENT.de;

  const cms = await getBusinessPageCmsContent(locale);
  
  return {
    title: cms?.hero?.title || tContent.metaTitle,
    description: cms?.hero?.description || tContent.metaDescription,
    alternates: {
      canonical: `/${locale}/business`,
    },
  };
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'de') as Locale;
  const tContent = CONTENT[locale] || CONTENT.de;
  const mockup = MOCKUP_CONTENT[locale] || MOCKUP_CONTENT.de;
  const isRtl = locale === 'ar';

  const globalCms = await getGlobalPageCmsContent(locale);
  const businessCms = await getBusinessPageCmsContent(locale);

  // Merge CMS data if available
  const content = {
    ...tContent,
    heroTitle: businessCms?.hero?.title || tContent.heroTitle,
    heroIntro: businessCms?.hero?.description || tContent.heroIntro,
    heroCta: businessCms?.hero?.cta || tContent.heroCta,
    heroImage: businessCms?.hero?.image || tContent.heroImage,
    heroImageAlt: businessCms?.hero?.imageAlt || businessCms?.hero?.title || tContent.heroTitle,
    heroFallbackSrc: businessCms?.hero?.fallbackSrc,
    targetTitle: businessCms?.target?.title || tContent.targetTitle,
    targetIntro: businessCms?.target?.description || tContent.targetIntro,
    targetGroups: businessCms?.target?.items?.length
      ? tContent.targetGroups.map((group, i) => ({
          ...group,
          title: businessCms.target?.items?.[i]?.title || group.title,
          description: businessCms.target?.items?.[i]?.description || group.description,
        }))
      : tContent.targetGroups,
    auditTitle: businessCms?.audit?.title || tContent.auditTitle,
    auditIntro: businessCms?.audit?.description || tContent.auditIntro,
    auditBenefits: businessCms?.audit?.items?.length
      ? tContent.auditBenefits.map((benefit, i) => ({
          ...benefit,
          title: businessCms.audit?.items?.[i]?.title || benefit.title,
          description: businessCms.audit?.items?.[i]?.description || benefit.description,
        }))
      : tContent.auditBenefits,
    auditCta: tContent.auditCta,
    platformTitle: businessCms?.platform?.title || tContent.platformTitle,
    platformIntro: businessCms?.platform?.description || tContent.platformIntro,
    platformBenefits: businessCms?.platform?.items?.length
      ? tContent.platformBenefits.map((benefit, i) => ({
          ...benefit,
          title: businessCms.platform?.items?.[i]?.title || benefit.title,
          description: businessCms.platform?.items?.[i]?.description || benefit.description,
        }))
      : tContent.platformBenefits,
    portalCta: tContent.portalCta,
    portalDemoCta: tContent.portalDemoCta,
    trustTitle: businessCms?.trust?.title || tContent.trustTitle,
    trustIntro: businessCms?.trust?.description || tContent.trustIntro,
    finalHeadline: businessCms?.final?.title || tContent.finalHeadline,
    finalText: businessCms?.final?.description || tContent.finalText,
    finalCta: businessCms?.final?.primaryLabel || tContent.finalCta,
    heroEnabled: businessCms?.hero?.enabled,
    targetEnabled: businessCms?.target?.enabled,
    auditEnabled: businessCms?.audit?.enabled,
    platformEnabled: businessCms?.platform?.enabled,
    trustEnabled: businessCms?.trust?.enabled,
    finalEnabled: businessCms?.final?.enabled,
  };

  return (
    <div className={`flex min-h-screen flex-col overflow-x-hidden bg-[#F7F1E8] ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <Header content={globalCms?.header} />

      <main className="flex-grow">
        {content.heroEnabled !== false && (
          <section className="relative h-[440px] w-full overflow-hidden bg-[#0E1A2B] sm:h-[500px] lg:h-[560px]">
            <div className="absolute inset-0 z-0">
              <CmsImage
                src={content.heroImage}
                fallbackSrc={content.heroFallbackSrc}
                alt={content.heroImageAlt || content.heroTitle}
                fill
                className="object-cover opacity-85"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2B]/82 via-[#0E1A2B]/28 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A2B]/48 via-[#0E1A2B]/12 to-transparent rtl:bg-gradient-to-l" />
            </div>

            <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-12 sm:pb-14 lg:pb-16">
              <div className="max-w-[800px]">
                <h1 className="text-[36px] font-extrabold leading-[1.05] tracking-tight text-white sm:text-[52px] lg:text-[60px]">
                  {content.heroTitle}
                </h1>
                <p className="mt-5 max-w-[700px] text-[16px] font-semibold leading-relaxed text-white/88 sm:text-[18px]">
                  {content.heroIntro}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* TARGET GROUPS */}
        {content.targetEnabled !== false && (
          <section className="relative bg-white pb-[100px] pt-[44px]">
            <div className="max-w-7xl mx-auto px-6">
              <SectionEyebrow className="mb-[43px]">
                {mockup.targetEyebrow}
              </SectionEyebrow>

              <div className="max-w-2xl mb-16">
                <h2 className={BUSINESS_SECTION_TITLE_CLASS}>
                  {content.targetTitle}
                </h2>
                <p className={BUSINESS_SECTION_INTRO_ACCENT_CLASS}>
                  {content.targetIntro}
                </p>
              </div>

              <BusinessShowcase locale={locale} />
            </div>
          </section>
        )}

        {/* AUDIT & SUBSCRIPTION */}
        {content.auditEnabled !== false && (
          <section
            className="relative overflow-hidden pb-[100px] pt-[44px]"
            style={{
              background:
                'radial-gradient(circle at 14% 16%, rgba(184,100,62,0.10) 0%, transparent 28%), linear-gradient(180deg, #eef5fc 0%, #f7fbff 100%)',
            }}
          >
            <div className="mx-auto max-w-7xl px-6">
              <SectionEyebrow className="mb-[43px]">
                {mockup.auditEyebrow}
              </SectionEyebrow>

              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                {/* Copy */}
                <div className="relative z-10">
                  <h2 className={BUSINESS_SECTION_TITLE_CLASS}>
                    {content.auditTitle}
                  </h2>

                  <p className={BUSINESS_SECTION_INTRO_ACCENT_CLASS}>
                    {content.auditIntro}
                  </p>

                  {/* Benefit cards */}
                  <div className="mt-8 grid gap-3">
                    {content.auditBenefits.map((benefit) => (
                      <div
                        key={benefit.id}
                        className="rounded-[22px] border border-[#dce7f1]/80 bg-white/62 p-5 shadow-[0_10px_30px_rgba(8,24,39,0.05)] backdrop-blur-md"
                      >
                        <div>
                          <h3 className={BUSINESS_CARD_TITLE_CLASS}>
                            {benefit.title}
                          </h3>
                          <p className={BUSINESS_CARD_BODY_CLASS}>{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={`mailto:info@pixel-ring.com?subject=Service-Audit%20anfragen`}
                      className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#081827] px-6 text-[15px] font-black text-white shadow-[0_18px_36px_rgba(8,24,39,0.20)] transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      {content.auditCta}
                    </a>
                    <a
                      href={BUSINESS_PRESENTATION_HREF}
                      download
                      className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[#dce7f1] bg-white px-6 text-[15px] font-black text-[#081827] shadow-[0_10px_24px_rgba(8,24,39,0.08)] transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      {content.portalDemoCta}
                    </a>
                  </div>
                </div>

                {/* Visual */}
                <div className="relative z-10 min-h-[560px] lg:min-h-[600px]">
                  {/* Background photo */}
                  <div className="absolute inset-0 overflow-hidden rounded-[34px]">
                    <Image
                      src="/images/leistungen/hero-branding.png"
                      alt={mockup.auditImageAlt}
                      fill
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(8,24,39,0.68) 0%, rgba(8,24,39,0.25) 50%, rgba(8,24,39,0.04) 100%)',
                      }}
                    />
                  </div>

                  {/* Floating overview card */}
                  <div
                    aria-hidden="true"
                    className="absolute left-5 top-6 z-10 w-[210px] rounded-2xl border border-white/20 bg-white/12 p-4 shadow-[0_20px_50px_rgba(8,24,39,0.22)] backdrop-blur-md"
                  >
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/60">{mockup.auditOverviewLabel}</p>
                    <p className="mb-3 text-[28px] font-black leading-none text-white">24 {mockup.auditChecksLabel}</p>
                    <div className="space-y-1.5">
                      {[
                        { city: 'Berlin Mitte', status: mockup.auditStatuses.ok, color: 'bg-[#35b47a]' },
                        { city: 'Hamburg Store', status: mockup.auditStatuses.planned, color: 'bg-[#d99a35]' },
                        { city: 'Köln Süd', status: mockup.auditStatuses.urgent, color: 'bg-[#d65f5f]' },
                      ].map(({ city, status, color }) => (
                        <div key={city} className="flex items-center justify-between rounded-lg bg-white/8 px-3 py-1.5">
                          <span className="text-[12px] text-white/80">{city}</span>
                          <span className={`flex items-center gap-1 text-[11px] font-bold text-white`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
                            {status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scan panel */}
                  <div
                    aria-hidden="true"
                    className="absolute bottom-6 left-5 right-5 z-10 rounded-2xl border border-white/15 bg-white/10 p-5 shadow-[0_20px_50px_rgba(8,24,39,0.20)] backdrop-blur-md"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[14px] font-bold text-white">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#35b47a]" />
                        {mockup.auditCompleteLabel}
                      </div>
                      <span className="text-[22px] font-black text-white">86%</span>
                    </div>
                    <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/20">
                      <div className="h-full w-[86%] rounded-full bg-[#B8643E]" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-[12px] text-white/70">
                      <div><span className="block text-[17px] font-black text-white">18</span>{mockup.auditStats.assets}</div>
                      <div><span className="block text-[17px] font-black text-white">5</span>{mockup.auditStats.print}</div>
                      <div><span className="block text-[17px] font-black text-white">2</span>{mockup.auditStats.risks}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {content.platformEnabled !== false && (
          <section className="relative overflow-hidden bg-white pb-[100px] pt-[44px]">
            <div className="mx-auto max-w-7xl px-6">
              <SectionEyebrow className="mb-[43px]">
                {mockup.platformEyebrow}
              </SectionEyebrow>

              <div className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${isRtl ? 'lg:flex lg:flex-row-reverse' : ''}`}>

                {/* Portal window mockup */}
                <div className="relative min-h-[560px] lg:min-h-[600px]">
                  {/* Main window */}
                  <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-[#dce7f1] bg-white shadow-[0_26px_70px_rgba(8,24,39,0.13)]">
                    {/* Window top bar */}
                    <div className="flex items-center justify-between border-b border-[#eef3fb] bg-[#f8fbff] px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#081827] text-[10px] font-black text-white">PR</span>
                        <span className="text-[13px] font-bold text-[#081827]">PixelRing Portal</span>
                      </div>
                      <span className="text-[12px] font-semibold text-[#526174]">{mockup.portalLiveLabel}</span>
                    </div>

                    {/* Portal content */}
                    <div className="p-5">
                      {/* KPI row */}
                      <div className="mb-4 grid grid-cols-3 gap-3">
                        {mockup.portalKpis.map(({ label, value, sub, color }) => (
                          <div key={label} className="flex flex-col rounded-xl border border-[#eef3fb] bg-[#f8fbff] px-3 py-3">
                            <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#526174]">{label}</span>
                            <span className={`text-[22px] font-black leading-none ${color}`}>{value}</span>
                            <span className="mt-1 text-[10px] text-[#526174]">{sub}</span>
                          </div>
                        ))}
                      </div>

                      {/* Location rows */}
                      <div className="space-y-2">
                        {mockup.portalRows.map(({ pin, city, desc, status, statusColor }) => (
                          <div key={city} className="flex items-center justify-between rounded-xl border border-[#eef3fb] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(8,24,39,0.04)]">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#081827] text-[11px] font-black text-white">{pin}</div>
                              <div>
                                <p className="text-[13px] font-bold text-[#081827]">{city}</p>
                                <p className="text-[11px] text-[#526174]">{desc}</p>
                              </div>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${statusColor}`}>{status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Floating report card */}
                  <div
                    className="absolute -bottom-4 -right-2 z-10 w-[200px] rounded-2xl border border-[#dce7f1] bg-white p-4 shadow-[0_20px_50px_rgba(8,24,39,0.14)] lg:-right-6"
                  >
                    <p className="mb-1 text-[13px] font-black text-[#081827]">{mockup.reportReadyTitle}</p>
                    <p className="text-[11px] leading-snug text-[#526174]">{mockup.reportReadyText}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <BusinessReportDemoButton
                        locale={locale}
                        label={mockup.reportButton}
                        presentationHref={BUSINESS_PRESENTATION_HREF}
                      />
                      <div className="flex -space-x-1.5">
                        {['bg-[#B8643E]', 'bg-[#526174]', 'bg-[#35b47a]'].map((c, i) => (
                          <span key={i} className={`h-5 w-5 rounded-full border-2 border-white ${c}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Copy */}
                <div>
                  <h2 className={BUSINESS_SECTION_TITLE_CLASS}>
                    {content.platformTitle}
                  </h2>

                  <p className={BUSINESS_SECTION_INTRO_ACCENT_CLASS}>
                    {content.platformIntro}
                  </p>

                  {/* Feature list */}
                  <div className="mt-8 space-y-5">
                    {content.platformBenefits.map((benefit) => (
                      <div key={benefit.id} className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B8643E]/12 text-[#B8643E] text-[15px] font-black">
                          ✓
                        </div>
                        <div>
                          <h3 className={BUSINESS_CARD_TITLE_CLASS}>
                            {benefit.title}
                          </h3>
                          <p className={BUSINESS_CARD_BODY_CLASS}>{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  <div className="mt-6 flex items-start gap-3 border-l-2 border-[#35b47a]/35 py-1 pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#35b47a]" />
                    <p className="text-[13px] leading-[1.55] text-[#526174]">
                      <strong className="text-[#081827]">{content.platformNoteLead}</strong>{' '}
                      {content.platformNoteText}
                    </p>
                  </div>

                  {/* CTAs */}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={`/${locale}/portal`}
                      className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#081827] px-6 text-[15px] font-black text-white shadow-[0_18px_36px_rgba(8,24,39,0.20)] transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      {content.portalCta}
                    </a>
                    <a
                      href={BUSINESS_PRESENTATION_HREF}
                      download
                      className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[#dce7f1] bg-white px-6 text-[15px] font-black text-[#081827] shadow-[0_10px_24px_rgba(8,24,39,0.08)] transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      {content.portalDemoCta}
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {content.trustEnabled !== false && (
          <section className="bg-white px-6 py-14 sm:py-18">
            <div className="mx-auto max-w-7xl">
              <div
                className="grid gap-8 overflow-hidden rounded-[28px] border border-[#d3b2a2]/50 px-6 py-7 shadow-[0_18px_50px_rgba(8,24,39,0.08)] sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12"
                style={{
                  background:
                    'radial-gradient(circle at 88% 18%, rgba(184,100,62,0.16) 0%, transparent 30%), linear-gradient(135deg, #F3E7DE 0%, #EEF3F8 100%)',
                }}
              >
                <div className="min-w-0">
                  <SectionEyebrow className="mb-5">{mockup.finalEyebrow}</SectionEyebrow>
                  <h2 className="max-w-3xl text-[28px] font-extrabold leading-[1.12] tracking-[0] text-[#081827] sm:text-[34px] lg:text-[38px]">
                    {content.finalHeadline}
                  </h2>
                  <p className="mt-4 max-w-2xl text-[16px] leading-[1.65] text-[#526174] sm:text-[17px]">
                    {content.finalText}
                  </p>
                  <p className="mt-4 max-w-2xl border-l-2 border-[#B8643E] pl-4 text-[14px] font-semibold leading-6 text-[#526174] rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
                    {content.trustIntro}
                  </p>
                </div>

                {content.finalEnabled !== false && (
                  <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                    <LeistungenRequestButton
                      label={content.finalCta}
                      serviceIntent="wartung-servicevertrag"
                      className="min-h-[52px] px-7 text-[15px] font-black shadow-[0_16px_34px_rgba(184,100,62,0.22)]"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer content={globalCms?.footer} />
    </div>
  );
}
