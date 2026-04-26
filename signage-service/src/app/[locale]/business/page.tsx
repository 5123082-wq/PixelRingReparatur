import type { Metadata } from 'next';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';
import { getGlobalPageCmsContent, getBusinessPageCmsContent } from '@/lib/cms/pages';
import Image from 'next/image';
import CmsImage from '@/components/common/CmsImage';

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

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
  heroFallbackSrc?: string;
  targetTitle: string;
  targetIntro: string;
  targetGroups: TargetGroup[];
  auditTitle: string;
  auditIntro: string;
  auditBenefits: Benefit[];
  platformTitle: string;
  platformIntro: string;
  platformBenefits: Benefit[];
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

const CONTENT: Record<Locale, BusinessContent> = {
  de: {
    metaTitle: 'B2B Service & Wartung für Werbeanlagen | PixelRing',
    metaDescription: 'Komplexer Service und Wartung für Geschäftskunden. Restaurants, Einzelhandel und Netzwerke. Alles aus einer Hand mit eigenem Kundenportal.',
    heroTitle: 'Komplexer Service für Ihre Standorte',
    heroIntro: 'Professionelle Betreuung Ihrer Werbeanlagen, Leuchtreklamen und Printmedien. Wir lösen die Probleme an Ihren Verkaufsstellen, bevor sie Ihren Kunden auffallen.',
    heroCta: 'Geschäftskunden-Anfrage',
    heroImage: '/images/business/hero.png',
    targetTitle: 'Für jede Unternehmensgröße',
    targetIntro: 'Egal ob einzelner Standort oder Filialnetzwerk: Wir schließen Ihre Lücken im Rahmen eines umfassenden Servicevertrags.',
    targetGroups: [
      { id: 'restaurants', title: 'Gastronomie & Restaurants', description: 'Reparatur von Neon, Leuchtkästen, Austausch von zerrissenen oder schmutzigen Speisekarten und Postern.' },
      { id: 'salons', title: 'Beauty & Salons', description: 'Pflege und Wartung von Schaufensterbeschriftungen und eleganten Leuchtschildern.' },
      { id: 'dealers', title: 'Autohäuser', description: 'Wartung von großen Pylonen, Fassadenschildern und Signaletik auf dem Gelände.' },
      { id: 'retail', title: 'Filialisten & Retail', description: 'Standardisierte Prozesse und SLAs für ein konsistentes Markenbild an allen Standorten.' }
    ],
    auditTitle: 'Servicevertrag & Regelmäßiges Audit',
    auditIntro: 'Volle Betreuung und Erhalt der Funktionsfähigkeit aller Werbeanlagen. Im Rahmen des Audits überprüfen wir die Vollständigkeit und Qualität der Werbematerialien (Print, Poster, Speisekarten) und ersetzen Beschädigtes direkt.',
    auditBenefits: [
      { id: 'a1', title: 'Regelmäßige Inspektion', description: 'Wir prüfen proaktiv den Zustand der Lichtwerbung und Printmaterialien vor Ort.' },
      { id: 'a2', title: 'Markenkonsistenz', description: 'Zerrissene Poster, veraltete Speisekarten oder schmutzige Aufkleber werden erkannt und erneuert.' },
      { id: 'a3', title: 'Planbare Kosten', description: 'Feste Service-Raten (Abo-Modell) statt unberechenbarer Einzelreparaturen.' }
    ],
    platformTitle: 'Volle Kontrolle in Ihrem Kundenportal',
    platformIntro: 'Wir bieten nicht nur Ausführung, sondern auch Transparenz. Mit einem Klick haben Sie den kompletten Überblick über alle Standorte, Audits und Reparaturstatus.',
    platformBenefits: [
      { id: 'p1', title: 'Echtzeit-Tracking', description: 'Verfolgen Sie jeden Auftrag von der Meldung bis zur Fertigstellung auf allen Etappen.' },
      { id: 'p2', title: 'Umfassender Audit-Report', description: 'Detaillierte Berichte über den Zustand jedes Standortes inkl. Foto-Dokumentation.' },
      { id: 'p3', title: 'Ein zentraler Ansprechpartner', description: 'Koordination aus einer Quelle. Keine Suche nach verschiedenen Dienstleistern.' }
    ],
    trustTitle: 'Verantwortung & Koordination',
    trustIntro: 'Geben Sie die Verantwortung für Ihre sichtbare Marke in die Hände von Spezialisten.',
    finalHeadline: 'Bereit für einen reibungslosen Betriebsablauf?',
    finalText: 'Kontaktieren Sie uns für ein individuelles Service-Audit Ihrer Standorte.',
    finalCta: 'Service-Paket anfragen'
  },
  en: {
    metaTitle: 'B2B Service & Maintenance for Signage | PixelRing',
    metaDescription: 'Complex service and maintenance for business clients. Restaurants, retail, and networks. Everything from a single source with your own customer portal.',
    heroTitle: 'Comprehensive Service for Your Locations',
    heroIntro: 'Professional care for your signage, illuminated advertising, and print media. We solve problems at your points of sale before your customers notice.',
    heroCta: 'Business Inquiry',
    heroImage: '/images/business/hero.png',
    targetTitle: 'For Every Business Size',
    targetIntro: 'Whether a single location or a branch network: We cover your gaps within a comprehensive service contract.',
    targetGroups: [
      { id: 'restaurants', title: 'Gastronomy & Restaurants', description: 'Repairing neon, light boxes, replacing torn or dirty menus and posters.' },
      { id: 'salons', title: 'Beauty & Salons', description: 'Care and maintenance of window lettering and elegant illuminated signs.' },
      { id: 'dealers', title: 'Car Dealerships', description: 'Maintenance of large pylons, facade signs, and site signage.' },
      { id: 'retail', title: 'Chains & Retail', description: 'Standardized processes and SLAs for a consistent brand image across all locations.' }
    ],
    auditTitle: 'Service Contract & Regular Audit',
    auditIntro: 'Full support and maintenance of the functionality of all signage. During the audit, we check the completeness and quality of promotional materials (print, posters, menus) and replace damaged items directly.',
    auditBenefits: [
      { id: 'a1', title: 'Regular Inspection', description: 'We proactively check the condition of illuminated advertising and print materials on site.' },
      { id: 'a2', title: 'Brand Consistency', description: 'Torn posters, outdated menus, or dirty stickers are identified and renewed.' },
      { id: 'a3', title: 'Predictable Costs', description: 'Fixed service rates (subscription model) instead of unpredictable individual repairs.' }
    ],
    platformTitle: 'Full Control in Your Customer Portal',
    platformIntro: 'We offer not only execution but also transparency. With one click, you have a complete overview of all locations, audits, and repair statuses.',
    platformBenefits: [
      { id: 'p1', title: 'Real-time Tracking', description: 'Track every order from report to completion at all stages.' },
      { id: 'p2', title: 'Comprehensive Audit Report', description: 'Detailed reports on the condition of each location including photo documentation.' },
      { id: 'p3', title: 'One Central Contact', description: 'Coordination from a single source. No need to search for different service providers.' }
    ],
    trustTitle: 'Responsibility & Coordination',
    trustIntro: 'Place the responsibility for your visible brand in the hands of specialists.',
    finalHeadline: 'Ready for smooth operations?',
    finalText: 'Contact us for an individual service audit of your locations.',
    finalCta: 'Request Service Package'
  },
  ru: {
    metaTitle: 'B2B Сервис и обслуживание вывесок | PixelRing',
    metaDescription: 'Комплексный сервис и обслуживание для бизнеса. Рестораны, ритейл и сети. Все из одного источника с личным кабинетом.',
    heroTitle: 'Комплексный подход к обслуживанию объектов',
    heroIntro: 'Профессиональное обслуживание вывесок, световой рекламы и печатной продукции. Мы закрываем боли владельцев бизнеса, обеспечивая идеальный вид точек продаж.',
    heroCta: 'Оставить B2B-заявку',
    heroImage: '/images/business/hero.png',
    targetTitle: 'Для бизнеса любого масштаба',
    targetIntro: 'Будь то ресторан, автосалон или сеть магазинов — мы решаем проблемные места комплексно в рамках договора обслуживания.',
    targetGroups: [
      { id: 'restaurants', title: 'Рестораны и Кафе', description: 'Ремонт неона, замена порванных или грязных меню, постеров и внутренней навигации.' },
      { id: 'salons', title: 'Салоны красоты', description: 'Уход за оконной пленкой, интерьерными вывесками и световыми логотипами.' },
      { id: 'dealers', title: 'Автосалоны', description: 'Обслуживание крупных стел, фасадных вывесок и указателей на территории.' },
      { id: 'retail', title: 'Сетевой ритейл', description: 'Единые стандарты SLA для поддержания бренда во всех точках сети.' }
    ],
    auditTitle: 'Договор обслуживания и Регулярный аудит',
    auditIntro: 'Мы предоставляем полное обслуживание в рамках своего рода подписки. В рамках регулярного аудита мы проверяем работоспособность конструкций, наличие и целостность печатной продукции внутри точек продаж. Заменяем старые, грязные или разорванные материалы.',
    auditBenefits: [
      { id: 'a1', title: 'Регулярная инспекция', description: 'Проактивный аудит состояния вывесок и рекламных материалов на объекте.' },
      { id: 'a2', title: 'Контроль бренда', description: 'Своевременная замена испорченных меню, порванных плакатов и выцветших пленок.' },
      { id: 'a3', title: 'Подписочная модель', description: 'Прогнозируемые расходы вместо внезапных трат на срочные ремонты.' }
    ],
    platformTitle: 'Личный кабинет и прозрачность',
    platformIntro: 'Полный доступ к своему личному кабинету на платформе. Вы видите все статусы, заявки и историю ремонтов.',
    platformBenefits: [
      { id: 'p1', title: 'Отслеживание на всех этапах', description: 'Контролируйте статус каждой заявки от создания до приемки работ.' },
      { id: 'p2', title: 'Полный аудит точек', description: 'Предоставляем заказчику отчет о том, что происходит на его точках продаж.' },
      { id: 'p3', title: 'Один общий источник', description: 'Ответственность, гарантии и координация всех подрядчиков на нашей стороне.' }
    ],
    trustTitle: 'Ответственность и Гарантии',
    trustIntro: 'Делегируйте технические и визуальные проблемы специалистам.',
    finalHeadline: 'Готовы к безупречной работе ваших объектов?',
    finalText: 'Свяжитесь с нами для первичного аудита.',
    finalCta: 'Начать сотрудничество'
  },
  tr: {
    metaTitle: 'B2B Servis ve Tabela Bakımı | PixelRing',
    metaDescription: 'İşletmeler için kapsamlı servis. Restoranlar, perakende ve ağlar. Kendi müşteri portalınızla tek elden çözüm.',
    heroTitle: 'Lokasyonlarınız için Kapsamlı Hizmet',
    heroIntro: 'Tabelalarınız ve baskı malzemeleriniz için profesyonel bakım. Sorunları müşterileriniz fark etmeden çözüyoruz.',
    heroCta: 'B2B Talebi Gönder',
    heroImage: '/images/business/hero.png',
    targetTitle: 'Her İşletme Büyüklüğü İçin',
    targetIntro: 'Tek şube veya zincir mağaza fark etmeksizin tüm eksiklerinizi servis sözleşmemizle kapatıyoruz.',
    targetGroups: [
      { id: 'restaurants', title: 'Restoran & Kafe', description: 'Neon tamiri, yırtık menü ve posterlerin yenilenmesi.' },
      { id: 'salons', title: 'Güzellik Salonları', description: 'Vitrin yazıları ve şık ışıklı tabelaların bakımı.' },
      { id: 'dealers', title: 'Oto Galerileri', description: 'Büyük pilonların ve cephe tabelalarının bakımı.' },
      { id: 'retail', title: 'Zincir Mağazalar', description: 'Tüm lokasyonlarda tutarlı bir marka imajı için standart süreçler.' }
    ],
    auditTitle: 'Servis Sözleşmesi & Düzenli Denetim',
    auditIntro: 'Abonelik modeli ile tam bakım hizmeti. Düzenli denetimlerde sadece tabelaları değil, aynı zamanda şubedeki menü, poster gibi baskı ürünlerinin bütünlüğünü de kontrol edip eskimiş olanları yeniliyoruz.',
    auditBenefits: [
      { id: 'a1', title: 'Düzenli İnceleme', description: 'Tabela ve basılı materyallerin durumunu proaktif olarak denetliyoruz.' },
      { id: 'a2', title: 'Marka Tutarlılığı', description: 'Yırtık posterler ve eski menüler anında yenilenir.' },
      { id: 'a3', title: 'Öngörülebilir Maliyet', description: 'Beklenmedik onarım masrafları yerine sabit hizmet paketleri.' }
    ],
    platformTitle: 'Müşteri Portalınızda Tam Kontrol',
    platformIntro: 'Platformdaki kişisel hesabınıza tam erişim ile tüm talepleri ve onarım geçmişinizi takip edebilirsiniz.',
    platformBenefits: [
      { id: 'p1', title: 'Gerçek Zamanlı Takip', description: 'Siparişten teslimata kadar her aşamayı izleyin.' },
      { id: 'p2', title: 'Kapsamlı Denetim Raporu', description: 'Her lokasyonun güncel durumu hakkında fotoğraflı detaylı raporlar.' },
      { id: 'p3', title: 'Tek Sorumlu', description: 'Tüm süreçlerin koordinasyonu ve garantisi bizim sorumluluğumuzda.' }
    ],
    trustTitle: 'Sorumluluk ve Koordinasyon',
    trustIntro: 'Görünür markanızın sorumluluğunu uzmanlara bırakın.',
    finalHeadline: 'Sorunsuz bir operasyona hazır mısınız?',
    finalText: 'Şubeleriniz için bir ön denetim ayarlamak üzere bizimle iletişime geçin.',
    finalCta: 'Servis Talep Et'
  },
  pl: {
    metaTitle: 'B2B Serwis i Konserwacja Szyldów | PixelRing',
    metaDescription: 'Kompleksowy serwis i konserwacja dla biznesu. Restauracje, sieci handlowe. Wszystko z jednego źródła z portalem klienta.',
    heroTitle: 'Kompleksowa Obsługa Twoich Lokalizacji',
    heroIntro: 'Profesjonalna opieka nad szyldami i materiałami drukowanymi. Rozwiązujemy problemy, zanim zauważą je Twoi klienci.',
    heroCta: 'Zapytanie B2B',
    heroImage: '/images/business/hero.png',
    targetTitle: 'Dla Firm Każdej Wielkości',
    targetIntro: 'Niezależnie od tego, czy masz jeden lokal, czy sieć: w ramach umowy serwisowej zajmiemy się wszystkim.',
    targetGroups: [
      { id: 'restaurants', title: 'Restauracje i Gastronomia', description: 'Naprawa neonów, wymiana zniszczonych menu i plakatów.' },
      { id: 'salons', title: 'Salony Urody', description: 'Konserwacja witryn i eleganckich szyldów świetlnych.' },
      { id: 'dealers', title: 'Salony Samochodowe', description: 'Obsługa dużych pylonów i szyldów elewacyjnych.' },
      { id: 'retail', title: 'Sieci Handlowe', description: 'Standardowe procesy i SLA dla spójnego wizerunku we wszystkich lokalizacjach.' }
    ],
    auditTitle: 'Umowa Serwisowa i Regularne Audyty',
    auditIntro: 'Pełna konserwacja w modelu subskrypcyjnym. Regularnie sprawdzamy nie tylko stan szyldów, ale również obecność i jakość materiałów drukowanych wewnątrz lokalu (np. brudne, zniszczone menu) i je wymieniamy.',
    auditBenefits: [
      { id: 'a1', title: 'Regularne Inspekcje', description: 'Proaktywnie audytujemy stan reklam i materiałów POS.' },
      { id: 'a2', title: 'Spójność Marki', description: 'Szybka wymiana zniszczonych plakatów i wyblakłych naklejek.' },
      { id: 'a3', title: 'Przewidywalne Koszty', description: 'Stałe stawki serwisowe zamiast niespodziewanych napraw.' }
    ],
    platformTitle: 'Pełna Kontrola w Portalu Klienta',
    platformIntro: 'Zyskujesz pełny dostęp do osobistego panelu na naszej platformie. Śledź wszystkie zlecenia i historię obsługi Twojego biznesu.',
    platformBenefits: [
      { id: 'p1', title: 'Śledzenie w Czasie Rzeczywistym', description: 'Monitoruj status każdej naprawy na każdym etapie.' },
      { id: 'p2', title: 'Raporty z Audytów', description: 'Dostarczamy szczegółowy przegląd tego, co dzieje się w każdym punkcie.' },
      { id: 'p3', title: 'Jedno Źródło Kontaktu', description: 'Gwarancja i koordynacja wszystkich prac leży po naszej stronie.' }
    ],
    trustTitle: 'Odpowiedzialność i Gwarancje',
    trustIntro: 'Przekaż opiekę nad wizualnym aspektem marki profesjonalistom.',
    finalHeadline: 'Gotowy na bezproblemowe działanie?',
    finalText: 'Skontaktuj się z nami w celu przeprowadzenia audytu.',
    finalCta: 'Zapytaj o Serwis'
  },
  ar: {
    metaTitle: 'خدمات وصيانة الشركات | بكسل رينج',
    metaDescription: 'خدمات شاملة وصيانة للشركات، المطاعم، شبكات التجزئة. كل شيء من مصدر واحد مع بوابة خاصة للعميل.',
    heroTitle: 'خدمة شاملة لمواقعك التجارية',
    heroIntro: 'رعاية احترافية للوحات الإعلانية والمواد المطبوعة. نحن نحل المشاكل في نقاط البيع الخاصة بك قبل أن يلاحظها عملاؤك.',
    heroCta: 'طلب خدمة للشركات',
    heroImage: '/images/business/hero.png',
    targetTitle: 'لجميع أحجام الشركات',
    targetIntro: 'سواء كان موقعاً واحداً أو شبكة فروع: نحن نغطي احتياجاتك من خلال عقد خدمة شامل.',
    targetGroups: [
      { id: 'restaurants', title: 'المطاعم والمقاهي', description: 'إصلاح النيون، وتغيير القوائم والملصقات الممزقة أو المتسخة.' },
      { id: 'salons', title: 'صالونات التجميل', description: 'العناية بواجهات النوافذ واللوحات المضيئة الأنيقة.' },
      { id: 'dealers', title: 'معارض السيارات', description: 'صيانة اللوحات الإعلانية الكبيرة ولوحات الواجهات.' },
      { id: 'retail', title: 'شبكات التجزئة', description: 'عمليات موحدة لضمان صورة متسقة للعلامة التجارية في جميع المواقع.' }
    ],
    auditTitle: 'عقد الصيانة والتدقيق الدوري',
    auditIntro: 'صيانة كاملة بناءً على نموذج اشتراك. نقوم بانتظام بفحص حالة اللوحات، ووجود وجودة المواد المطبوعة داخل المحل، ونقوم بتغيير القوائم أو الملصقات القديمة أو الممزقة.',
    auditBenefits: [
      { id: 'a1', title: 'فحص دوري', description: 'نقوم بالتدقيق الاستباقي لحالة الإعلانات والمواد المطبوعة.' },
      { id: 'a2', title: 'تناسق العلامة التجارية', description: 'الاستبدال الفوري للملصقات الممزقة والقوائم القديمة.' },
      { id: 'a3', title: 'تكاليف يمكن التنبؤ بها', description: 'أسعار خدمات ثابتة بدلاً من الإصلاحات المفاجئة.' }
    ],
    platformTitle: 'تحكم كامل في بوابة العميل الخاصة بك',
    platformIntro: 'نمنحك وصولاً كاملاً إلى لوحتك الخاصة على منصتنا. يمكنك متابعة جميع الطلبات وتاريخ الصيانة لأعمالك.',
    platformBenefits: [
      { id: 'p1', title: 'تتبع مباشر', description: 'تتبع حالة كل إصلاح في جميع مراحله.' },
      { id: 'p2', title: 'تقارير تدقيق مفصلة', description: 'نقدم تفاصيل كاملة عما يحدث في كل موقع مع الصور.' },
      { id: 'p3', title: 'مصدر واحد للتواصل', description: 'جميع الضمانات والتنسيق بين المقاولين تقع على عاتقنا.' }
    ],
    trustTitle: 'المسؤولية والضمانات',
    trustIntro: 'اترك مسؤولية صورتك التجارية للمتخصصين.',
    finalHeadline: 'هل أنت مستعد لعمليات خالية من المشاكل؟',
    finalText: 'اتصل بنا لإجراء تدقيق لمواقعك.',
    finalCta: 'طلب باقة الخدمة'
  }
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
    platformTitle: businessCms?.platform?.title || tContent.platformTitle,
    platformIntro: businessCms?.platform?.description || tContent.platformIntro,
    platformBenefits: businessCms?.platform?.items?.length
      ? tContent.platformBenefits.map((benefit, i) => ({
          ...benefit,
          title: businessCms.platform?.items?.[i]?.title || benefit.title,
          description: businessCms.platform?.items?.[i]?.description || benefit.description,
        }))
      : tContent.platformBenefits,
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
    <div className={`flex min-h-screen flex-col bg-[#F7F1E8] ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <Header content={globalCms?.header} />

      <main className="flex-grow">
        {content.heroEnabled !== false && (
          <section className="relative w-full bg-[#0E1A2B] pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <CmsImage
                src={content.heroImage}
                fallbackSrc={content.heroFallbackSrc}
                alt={content.heroTitle}
                fill
                className="object-cover opacity-40 mix-blend-overlay"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2B] via-[#0E1A2B]/80 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
              <div className="max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                  <div className="h-2 w-2 rounded-full bg-[#B8643E] animate-pulse" />
                  <span className="text-[13px] font-bold uppercase tracking-wider text-white">
                    B2B Services
                  </span>
                </div>
                <h1 className="text-[42px] font-extrabold leading-[1.1] text-white sm:text-[56px] lg:text-[64px] tracking-tight">
                  {content.heroTitle}
                </h1>
                <p className="mt-8 text-[18px] leading-relaxed text-white/80 sm:text-[22px]">
                  {content.heroIntro}
                </p>
                <div className="mt-10 flex gap-4">
                  <LeistungenRequestButton
                    label={content.heroCta}
                    serviceIntent="wartung-servicevertrag"
                    className="!min-h-[56px] !px-8 !text-[16px]"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TARGET GROUPS */}
        {content.targetEnabled !== false && (
          <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
              <div className="max-w-2xl mb-16">
                <h2 className="text-[36px] font-extrabold text-[#0D1B2A] leading-tight mb-4">
                  {content.targetTitle}
                </h2>
                <p className="text-[18px] text-[#4A5568] leading-relaxed">
                  {content.targetIntro}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {content.targetGroups.map((group) => (
                  <div key={group.id} className="bg-[#F8FAFC] rounded-2xl p-8 border border-[#E2E8F0] hover:shadow-lg hover:border-[#B8643E]/30 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#B8643E]/10 flex items-center justify-center mb-6">
                      <svg className="w-6 h-6 text-[#B8643E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-[20px] font-bold text-[#0D1B2A] mb-3">{group.title}</h3>
                    <p className="text-[#4A5568] text-[15px] leading-relaxed">{group.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* AUDIT & SUBSCRIPTION */}
        {content.auditEnabled !== false && (
          <section className="py-24 bg-[#EEF3FB] relative border-y border-[#E2E8F0]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="inline-block px-3 py-1 bg-[#B8643E]/10 text-[#B8643E] rounded-full text-[14px] font-bold mb-6">
                    Subscription Model
                  </div>
                  <h2 className="text-[36px] font-extrabold text-[#0D1B2A] leading-tight mb-6">
                    {content.auditTitle}
                  </h2>
                  <p className="text-[18px] text-[#4A5568] leading-relaxed mb-10">
                    {content.auditIntro}
                  </p>

                  <div className="space-y-8">
                    {content.auditBenefits.map((benefit, i) => (
                      <div key={benefit.id} className="flex gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-white border border-[#D1D9E6] flex items-center justify-center text-[#B8643E] font-bold shadow-sm">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="text-[18px] font-bold text-[#0D1B2A] mb-2">{benefit.title}</h4>
                          <p className="text-[#4A5568] text-[15px] leading-relaxed">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl">
                  {/* Visual representation of an audit/storefront */}
                  <Image
                    src="/images/leistungen/hero-branding.png"
                    alt="Audit & Maintenance"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2B]/80 to-transparent" />
                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-white font-bold tracking-wide">Audit Complete</span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full mb-3 overflow-hidden">
                        <div className="h-full bg-[#B8643E] w-[100%]" />
                      </div>
                      <p className="text-white/80 text-[14px]">All print materials and signage verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {content.platformEnabled !== false && (
          <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                
                <div className="order-2 lg:order-1 relative h-[600px] w-full rounded-3xl overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] shadow-inner flex items-center justify-center">
                   {/* Abstract representation of a dashboard */}
                   <div className="w-[80%] h-[70%] bg-white rounded-xl shadow-lg border border-[#E2E8F0] p-6 flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b pb-4">
                        <div className="w-32 h-6 bg-gray-200 rounded-md" />
                        <div className="w-10 h-10 bg-[#B8643E]/10 rounded-full" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                         <div className="h-24 bg-[#EEF3FB] rounded-lg" />
                         <div className="h-24 bg-[#EEF3FB] rounded-lg" />
                         <div className="h-24 bg-[#EEF3FB] rounded-lg" />
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg border border-gray-100 p-4 mt-4">
                         <div className="w-1/3 h-4 bg-gray-200 rounded mb-4" />
                         <div className="space-y-3">
                           <div className="h-10 bg-white rounded shadow-sm border border-gray-100" />
                           <div className="h-10 bg-white rounded shadow-sm border border-gray-100" />
                           <div className="h-10 bg-white rounded shadow-sm border border-gray-100" />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="order-1 lg:order-2">
                  <h2 className="text-[36px] font-extrabold text-[#0D1B2A] leading-tight mb-6">
                    {content.platformTitle}
                  </h2>
                  <p className="text-[18px] text-[#4A5568] leading-relaxed mb-10">
                    {content.platformIntro}
                  </p>

                  <div className="space-y-8">
                    {content.platformBenefits.map((benefit) => (
                      <div key={benefit.id} className="flex gap-4">
                        <div className="shrink-0 mt-1">
                          <svg className="w-6 h-6 text-[#B8643E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-[18px] font-bold text-[#0D1B2A] mb-2">{benefit.title}</h4>
                          <p className="text-[#4A5568] text-[15px] leading-relaxed">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
          </section>
        )}

        {content.trustEnabled !== false && (
          <section className="relative w-full py-24 sm:py-32 overflow-hidden bg-[#0E1A2B] rounded-t-[40px] sm:rounded-t-[80px] text-center">
             <div className="max-w-4xl mx-auto px-6">
               <h2 className="text-[36px] md:text-[48px] font-extrabold text-white leading-tight mb-6">
                 {content.trustTitle}
               </h2>
               <p className="text-[18px] md:text-[22px] text-white/70 leading-relaxed mb-12">
                 {content.trustIntro}
               </p>
               {content.finalEnabled !== false && (
                 <div className="flex justify-center">
                    <div className="bg-gradient-to-r from-[#B8643E] to-[#9E5332] p-10 rounded-[32px] max-w-2xl border border-white/10 shadow-2xl">
                       <h3 className="text-white text-[24px] font-bold mb-4">{content.finalHeadline}</h3>
                       <p className="text-white/80 mb-8">{content.finalText}</p>
                       <LeistungenRequestButton
                          label={content.finalCta}
                          serviceIntent="wartung-servicevertrag"
                          className="!bg-white !text-[#0D1B2A] hover:!bg-gray-100 !min-h-[56px] !px-8 !text-[16px] mx-auto"
                       />
                    </div>
                 </div>
               )}
             </div>
          </section>
        )}

      </main>

      <Footer content={globalCms?.footer} />
    </div>
  );
}
