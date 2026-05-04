import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env.local') });
dotenv.config({ path: path.join(rootDir, '.env') });

const connectionString =
  process.env.POSTGRES_PRISMA_URL ??
  process.env.DATABASE_URL ??
  process.env.DIRECT_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  throw new Error('Missing DATABASE_URL or similar.');
}

const SUPPORTED_LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];
const now = new Date();

const LEISTUNGEN_CONTENT = {
  de: {
    metaTitle: 'Leistungen für Reparatur, Wartung & Werbetechnik | PixelRing',
    metaDescription: 'PixelRing unterstützt Unternehmen bei Reparatur, Diagnose, Montage, Wartung, Lichtwerbung, Branding, Druckprodukten und Servicevertraegen für Werbeanlagen.',
    heroSlides: [
      { id: 'repair', title: 'Reparatur & Diagnose vom Profi', description: 'Ihr Partner für Werbeanlagen in Berlin & Brandenburg. Fachliche Prüfung und Umsetzung durch Spezialisten.', image: '/images/leistungen/hero-repair.png', cta: 'Anfrage starten' },
      { id: 'led', title: 'Moderne Lichtwerbung & LED-Service', description: 'Lichtwerbung, die auffaellt. Wir reparieren LED-Module, Netzteile und Neonröhren fachgerecht.', image: '/images/leistungen/hero-led-natural.png', cta: 'Anfrage starten' },
      { id: 'maintenance', title: 'Wartung & Sorgenfreier Betrieb', description: 'Serviceverträge für Unternehmen mit einem oder mehreren Standorten. Geplante Wartung statt Notfall.', image: '/images/leistungen/hero-maintenance.png', cta: 'Servicevertrag anfragen' },
      { id: 'branding', title: 'Druck, Folierung & Standort-Branding', description: 'Von Schaufensterbeschriftung bis Werbematerial: klare Markenwirkung für Ihren Geschäftsstandort.', image: '/images/leistungen/hero-branding.png', cta: 'Branding anfragen' }
    ],
    repairTitle: 'Reparatur, Diagnose und Montage von Werbeanlagen',
    repairIntro: 'Von der ersten Sichtprüfung bis zur Reparatur, Demontage oder Neuinstallation: PixelRing prüft den Zustand Ihrer Werbeanlage und koordiniert die passenden nächsten Schritte.',
    repairCards: [
      { id: 'diagnose', title: 'Diagnose & Vor-Ort-Prüfung', summary: 'Zustand, Ursache und Umfang werden strukturiert aufgenommen.', details: 'Wir prüfen sichtbare Schäden, Montagepunkte, elektrische Hinweise und Standortbedingungen.' },
      { id: 'lichtwerbung-led', title: 'Elektrik, Lichtwerbung & LED-Service', summary: 'Service für Lichtwerbung, LED-Module, Netzteile, Controller und Neonröhren.', details: 'Bei Leuchtschildern und Lichtanlagen prüfen wir typische Ursachen wie Verkabelung, Stromversorgung, Controller, Transformatoren.' },
      { id: 'konstruktion-befestigung', title: 'Reparatur von Konstruktion & Befestigung', summary: 'Halterungen, Rahmen, Unterkonstruktionen und Befestigungspunkte im Blick.', details: 'Lose, beschädigte oder gealterte Konstruktionsteile werden bewertet.' },
      { id: 'reinigung-pflege', title: 'Reinigung, Pflege & optische Instandsetzung', summary: 'Sichtbarkeit und Erscheinungsbild bestehender Anlagen verbessern.', details: 'Wir klaeren, welche Reinigung, Pflege oder optische Instandsetzung passend ist.' },
      { id: 'montage-demontage', title: 'Montage, Demontage & Versetzung', summary: 'Koordinierte Umsetzung für neue, bestehende oder zu versetzende Anlagen.', details: 'PixelRing koordiniert Montage, Demontage oder Standortwechsel von Werbeanlagen.' },
      { id: 'ersatzloesung', title: 'Reparatur prüfen - Ersatzloesung nur wenn sinnvoll', summary: 'Ersatz oder Neubau wird erst empfohlen, wenn Reparatur nicht sinnvoll ist.', details: 'Unser erster Fokus liegt auf der Reparatur und sinnvollen Instandsetzung bestehender Werbeanlagen.' }
    ],
    repairFocus: 'Unser erster Fokus liegt auf der Reparatur und sinnvollen Instandsetzung bestehender Werbeanlagen.',
    brandingTitle: 'Druckprodukte, Branding und Werbematerialien für Geschäftsstandorte',
    brandingIntro: 'PixelRing unterstützt Unternehmen auch bei der laufenden Versorgung mit Werbematerialien - von Druckdaten und Gestaltung bis zu Folien, Bannern, Postern und Standort-Branding.',
    brandingCards: [
      { id: 'design', title: 'Design & Druckdaten', text: 'Aufbereitung, Anpassung und Abstimmung von Druckdaten für Standort- und Werbematerialien.' },
      { id: 'druckprodukte', title: 'Druckprodukte & Werbemittel', text: 'Poster, Banner, Aufkleber, Hinweisschilder und weitere Materialien für den laufenden Bedarf.' },
      { id: 'folierung', title: 'Folierung & Beschriftung', text: 'Beschriftungen, Folien und sichtbare Markenelemente für Flächen, Fenster und Standorte.' },
      { id: 'filialen', title: 'Versorgung von Filialen & Standorten', text: 'Koordinierte Materialversorgung für Unternehmen mit einem oder mehreren Standorten.' }
    ],
    maintenanceTitle: 'Wartung & Serviceverträge',
    maintenanceSubline: 'Mit einem Servicevertrag uebernimmt PixelRing die regelmäßige Prüfung, Wartung und Betreuung Ihrer Werbeanlagen.',
    maintenanceBenefits: ['Weniger Aufwand im Tagesgeschäft', 'Geplante Wartung statt Notfall', 'Geeignet für Filialen', 'Zentrale Koordination'],
    maintenanceDiscount: 'Bis zu 20% Vorteil auf Werbematerialien bei Servicevertrag.',
    serviceContractCta: 'Servicevertrag anfragen',
    auditCta: 'Audit anfragen',
    processTitle: 'So läuft Ihre Anfrage ab',
    processSteps: [
      { id: 'send', title: 'Anfrage senden', text: 'Beschreiben Sie die Aufgabe und laden Sie bei Bedarf ein Foto hoch.' },
      { id: 'scope', title: 'Prüfung des Umfangs', text: 'PixelRing prüft, ob Ferneinschätzung reicht.' },
      { id: 'recommendation', title: 'Empfehlung erhalten', text: 'Reparatur, Wartung, Ersatz oder Neubau.' },
      { id: 'offer', title: 'Angebot & Freigabe', text: 'Bedingungen werden vor Beauftragung abgestimmt.' },
      { id: 'execution', title: 'Koordination & Umsetzung', text: 'Umsetzung durch Fachteam und Partner.' }
    ],
    frameTitle: 'Rahmenbedingungen',
    trustPoints: [
      'Direkt an PixelRing (keine Plattform)',
      'Berlin & Brandenburg Kerngebiet',
      'Garantie bis zu 24 Monate',
      'Zentrale Koordination'
    ],
    finalHeadline: 'Nicht sicher?',
    finalText: 'Senden Sie uns eine Beschreibung. Wir prüfen den Umfang.'
  },
  en: {
    metaTitle: 'Services for Repair, Maintenance & Signage | PixelRing',
    metaDescription: 'PixelRing supports businesses with repair, diagnostics, installation, maintenance, illuminated signage, branding, print products, and service contracts.',
    heroSlides: [
      { id: 'repair', title: 'Professional Repair & Diagnostics', description: 'Your partner for signage in Berlin & Brandenburg. Specialist review and execution.', image: '/images/leistungen/hero-repair.png', cta: 'Start request' },
      { id: 'led', title: 'Modern Lighting & LED Service', description: 'Signage that stands out. We repair LED modules, power supplies and neon tubes professionally.', image: '/images/leistungen/hero-led-natural.png', cta: 'Start request' },
      { id: 'maintenance', title: 'Maintenance & Worry-Free Operation', description: 'Service contracts for companies with one or more locations. Planned maintenance instead of emergency.', image: '/images/leistungen/hero-maintenance.png', cta: 'Request service contract' },
      { id: 'branding', title: 'Print, Vinyl & Location Branding', description: 'From storefront lettering to marketing materials: clear brand presence for your business location.', image: '/images/leistungen/hero-branding.png', cta: 'Request branding' }
    ],
    repairTitle: 'Repair, diagnostics and installation of signage',
    repairIntro: 'From the first visual check to repair, dismantling or new installation: PixelRing reviews the condition of your signage and coordinates the next sensible steps.',
    repairCards: [
      { id: 'diagnose', title: 'Diagnostics & on-site inspection', summary: 'Condition, cause and scope are recorded clearly.', details: 'We review visible damage, mounting points, electrical clues and site conditions.' },
      { id: 'lichtwerbung-led', title: 'Electrical, illuminated signage & LED service', summary: 'Service for illuminated signs, LED modules, power supplies.', details: 'We check common causes such as wiring, power supplies, controllers, transformers.' },
      { id: 'konstruktion-befestigung', title: 'Structure & mounting repair', summary: 'Brackets, frames, substructures and fixing points are assessed.', details: 'Loose, damaged or aged structural parts are reviewed with repair as the first goal.' },
      { id: 'reinigung-pflege', title: 'Cleaning, care & visual restoration', summary: 'Improve visibility and appearance of existing installations.', details: 'We clarify which cleaning, care or visual restoration is appropriate.' },
      { id: 'montage-demontage', title: 'Installation, dismantling & relocation', summary: 'Coordinated work for new, existing or relocated signage.', details: 'PixelRing coordinates installation, dismantling or site relocation.' },
      { id: 'ersatzloesung', title: 'Check repair first - replacement only when sensible', summary: 'Replacement or new construction is recommended only when repair is not sensible.', details: 'Our first focus is repair and sensible restoration of existing signage.' }
    ],
    repairFocus: 'Our first focus is repair and sensible restoration of existing signage.',
    brandingTitle: 'Print products, branding and advertising materials for business locations',
    brandingIntro: 'PixelRing also supports businesses with ongoing advertising materials - from artwork and print data to films, banners, posters and location branding.',
    brandingCards: [
      { id: 'design', title: 'Design & print data', text: 'Preparation, adaptation and coordination of print data for locations and advertising materials.' },
      { id: 'druckprodukte', title: 'Print products & advertising materials', text: 'Posters, banners, stickers, information signs and other materials for ongoing needs.' },
      { id: 'folierung', title: 'Films & lettering', text: 'Lettering, films and visible brand elements for surfaces, windows and locations.' },
      { id: 'filialen', title: 'Branch and location supply', text: 'Coordinated material supply for companies with one or more locations.' }
    ],
    maintenanceTitle: 'Maintenance & service contracts',
    maintenanceSubline: 'With a service contract, PixelRing takes over regular inspection, maintenance and care of your signage.',
    maintenanceBenefits: ['Less day-to-day effort', 'Planned maintenance instead of emergency', 'Suitable for branches', 'Central coordination'],
    maintenanceDiscount: 'Up to 20% benefit on selected advertising materials with a service contract.',
    serviceContractCta: 'Request service contract',
    auditCta: 'Request location audit',
    processTitle: 'How your request works',
    processSteps: [
      { id: 'send', title: 'Send request', text: 'Describe the task and upload photos if helpful.' },
      { id: 'scope', title: 'Scope review', text: 'PixelRing checks whether remote assessment is enough.' },
      { id: 'recommendation', title: 'Receive recommendation', text: 'Repair, maintenance, replacement or new construction.' },
      { id: 'offer', title: 'Offer & approval', text: 'Concrete services and conditions are agreed.' },
      { id: 'execution', title: 'Coordination & execution', text: 'Execution through specialist team and partners.' }
    ],
    frameTitle: 'Framework conditions',
    trustPoints: [
      'No marketplace: direct to PixelRing',
      'Berlin & Brandenburg as core area',
      'Warranty up to 24 months',
      'Central PixelRing coordination'
    ],
    finalHeadline: 'Not sure?',
    finalText: 'Send a short description or a photo. We check the scope.'
  },
  ru: {
    metaTitle: 'Услуги по ремонту, обслуживанию и рекламной технике | PixelRing',
    metaDescription: 'PixelRing помогает компаниям с ремонтом, диагностикой, монтажом, обслуживанием, световой рекламой, брендингом, печатной продукцией и сервисными договорами.',
    heroSlides: [
      { id: 'repair', title: 'Профессиональный ремонт и диагностика', description: 'Ваш партнер по рекламным конструкциям в Берлине и Бранденбурге. Проверка и выполнение специалистами.', image: '/images/leistungen/hero-repair.png', cta: 'Начать заявку' },
      { id: 'led', title: 'Современная световая реклама и LED-сервис', description: 'Реклама, которую замечают. Профессиональный ремонт LED-модулей, блоков питания и неона.', image: '/images/leistungen/hero-led-natural.png', cta: 'Начать заявку' },
      { id: 'maintenance', title: 'Обслуживание и работа без забот', description: 'Сервисные договоры для компаний с одним или несколькими филиалами. Плановое обслуживание вместо аварий.', image: '/images/leistungen/hero-maintenance.png', cta: 'Запросить сервисный договор' },
      { id: 'branding', title: 'Печать, пленка и брендинг точки', description: 'От оформления витрин до рекламных материалов: понятное присутствие бренда в вашем помещении.', image: '/images/leistungen/hero-branding.png', cta: 'Запросить брендинг' }
    ],
    repairTitle: 'Ремонт, диагностика и монтаж рекламных конструкций',
    repairIntro: 'От первичного осмотра до ремонта, демонтажа или новой установки: PixelRing проверяет состояние конструкции и координирует следующие шаги.',
    repairCards: [
      { id: 'diagnose', title: 'Диагностика и выездная проверка', summary: 'Фиксируем состояние, причину и объем задачи.', details: 'Проверяем видимые повреждения, крепления, электрические признаки и условия локации.' },
      { id: 'lichtwerbung-led', title: 'Электрика, световая реклама и LED-сервис', summary: 'Сервис для световых вывесок, LED-модулей, блоков питания.', details: 'Для световых конструкций проверяем проводку, питание, контроллеры, трансформаторы.' },
      { id: 'konstruktion-befestigung', title: 'Ремонт конструкции и креплений', summary: 'Оцениваем рамы, подконструкции и точки крепления.', details: 'Ослабленные, поврежденные или устаревшие элементы оцениваются с приоритетом ремонта.' },
      { id: 'reinigung-pflege', title: 'Очистка, уход и визуальное восстановление', summary: 'Улучшаем внешний вид существующих конструкций.', details: 'Определяем подходящую очистку, уход или визуальное восстановление.' },
      { id: 'montage-demontage', title: 'Монтаж, демонтаж и перенос', summary: 'Координация работ для новых, существующих или переносимых конструкций.', details: 'PixelRing координирует монтаж, демонтаж или перенос рекламных конструкций.' },
      { id: 'ersatzloesung', title: 'Сначала проверка ремонта - замена только при необходимости', summary: 'Замена предлагается только когда ремонт неразумен.', details: 'Наш первый фокус - ремонт и разумное восстановление существующих конструкций.' }
    ],
    repairFocus: 'Наш первый фокус - ремонт и разумное восстановление существующих рекламных конструкций.',
    brandingTitle: 'Печатная продукция, брендинг и рекламные материалы',
    brandingIntro: 'PixelRing помогает компаниям с текущими рекламными материалами - от макетов до пленок и баннеров.',
    brandingCards: [
      { id: 'design', title: 'Дизайн и печатные данные', text: 'Подготовка, адаптация и согласование файлов для печати и материалов локации.' },
      { id: 'druckprodukte', title: 'Печатная продукция и рекламные материалы', text: 'Постеры, баннеры, наклейки, информационные таблички и другие материалы.' },
      { id: 'folierung', title: 'Пленки и надписи', text: 'Брендированные надписи, пленки и видимые элементы для поверхностей, окон и локаций.' },
      { id: 'filialen', title: 'Снабжение филиалов и локаций', text: 'Координированное обеспечение материалами для одной или нескольких точек.' }
    ],
    maintenanceTitle: 'Обслуживание и сервисные договоры',
    maintenanceSubline: 'По сервисному договору PixelRing берет на себя регулярную проверку и сопровождение конструкций.',
    maintenanceBenefits: ['Меньше ежедневной нагрузки', 'Плановое обслуживание вместо срочного ремонта', 'Подходит для филиалов', 'Центральная координация'],
    maintenanceDiscount: 'До 20% выгоды на выбранные материалы при договоре обслуживания.',
    serviceContractCta: 'Запросить сервисный договор',
    auditCta: 'Запросить аудит локации',
    processTitle: 'Как проходит заявка',
    processSteps: [
      { id: 'send', title: 'Отправьте заявку', text: 'Опишите задачу и загрузите фото, если это поможет.' },
      { id: 'scope', title: 'Проверка объема', text: 'PixelRing проверяет, достаточно ли удаленной оценки или нужен выезд.' },
      { id: 'recommendation', title: 'Получите рекомендацию', text: 'Рекомендация может касаться ремонта, обслуживания, замены или новой конструкции.' },
      { id: 'offer', title: 'Предложение и согласование', text: 'Конкретные услуги и условия согласуются до начала работ.' },
      { id: 'execution', title: 'Координация и выполнение', text: 'PixelRing координирует выполнение через команду специалистов.' }
    ],
    frameTitle: 'Рамочные условия',
    trustPoints: [
      'Не маркетплейс: напрямую в PixelRing',
      'Берлин и Бранденбург как основной регион',
      'Гарантия до 24 месяцев',
      'Выполнение командой специалистов под координацией PixelRing'
    ],
    finalHeadline: 'Не уверены?',
    finalText: 'Отправьте короткое описание или фото. Мы проверим объем.'
  }
};

const BUSINESS_CONTENT = {
  de: {
    metaTitle: 'B2B Service & Wartung für Werbeanlagen | PixelRing',
    metaDescription: 'Komplexer Service und Wartung für Geschäftskunden. Restaurants, Retail und Netzwerke. Alles aus einer Hand mit eigenem Kundenportal.',
    heroTitle: 'Komplexer Service für Ihre Standorte',
    heroIntro: 'Professionelle Betreuung Ihrer Werbeanlagen, Leuchtreklamen und Printmedien. Wir lösen die Probleme an Ihren Verkaufsstellen, bevor sie Ihren Kunden auffallen.',
    heroCta: 'Geschäftskunden-Anfrage',
    heroImage: '/images/business/hero.png',
    targetTitle: 'Für jede Unternehmensgroesse',
    targetIntro: 'Egal ob einzelner Standort oder Filialnetzwerk: Wir schliessen Ihre Lücken im Rahmen eines umfassenden Servicevertrags.',
    targetGroups: [
      { id: 'restaurants', title: 'Gastronomie & Restaurants', description: 'Reparatur von Neon, Leuchtkästen, Austausch von zerrissenen oder schmutzigen Speisekarten und Postern.' },
      { id: 'salons', title: 'Beauty & Salons', description: 'Pflege und Wartung von Schaufensterbeschriftungen und eleganten Leuchtschildern.' },
      { id: 'dealers', title: 'Autohäuser', description: 'Wartung von großen Pylonen, Fassadenschildern und Signaletik auf dem Gelände.' },
      { id: 'retail', title: 'Filialisten & Retail', description: 'Standardisierte Prozesse und SLAs für ein konsistentes Markenbild an allen Standorten.' }
    ],
    auditTitle: 'Servicevertrag & Regelmaessiges Audit',
    auditIntro: 'Volle Betreuung und Erhalt der Funktionsfähigkeit aller Werbeanlagen.',
    auditBenefits: [
      { id: 'a1', title: 'Regelmäßige Inspektion', description: 'Wir prüfen proaktiv den Zustand der Lichtwerbung und Printmaterialien vor Ort.' },
      { id: 'a2', title: 'Markenkonsistenz', description: 'Zerrissene Poster, veraltete Speisekarten oder schmutzige Aufkleber werden erkannt und erneuert.' },
      { id: 'a3', title: 'Planbare Kosten', description: 'Feste Service-Raten (Abo-Modell) statt unberechenbarer Einzelreparaturen.' }
    ],
    platformTitle: 'Volle Kontrolle in Ihrem Kundenportal',
    platformIntro: 'Wir bieten nicht nur Ausfuehrung, sondern auch Transparenz. Mit einem Klick haben Sie den kompletten Überblick.',
    platformBenefits: [
      { id: 'p1', title: 'Echtzeit-Tracking', description: 'Verfolgen Sie jeden Auftrag von der Meldung bis zur Fertigstellung.' },
      { id: 'p2', title: 'Umfassender Audit-Report', description: 'Detaillierte Berichte ueber den Zustand jedes Standortes.' },
      { id: 'p3', title: 'Ein zentraler Ansprechpartner', description: 'Koordination aus einer Quelle.' }
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
    auditIntro: 'Full support and maintenance of the functionality of all signage.',
    auditBenefits: [
      { id: 'a1', title: 'Regular Inspection', description: 'We proactively check the condition of illuminated advertising and print materials on site.' },
      { id: 'a2', title: 'Brand Consistency', description: 'Torn posters, outdated menus, or dirty stickers are identified and renewed.' },
      { id: 'a3', title: 'Predictable Costs', description: 'Fixed service rates (subscription model) instead of unpredictable individual repairs.' }
    ],
    platformTitle: 'Full Control in Your Customer Portal',
    platformIntro: 'We offer not only execution but also transparency. With one click, you have a complete overview.',
    platformBenefits: [
      { id: 'p1', title: 'Real-time Tracking', description: 'Track every order from report to completion at all stages.' },
      { id: 'p2', title: 'Comprehensive Audit Report', description: 'Detailed reports on the condition of each location.' },
      { id: 'p3', title: 'One Central Contact', description: 'Coordination from a single source.' }
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
    heroIntro: 'Профессиональное обслуживание вывесок, световой рекламы и печатной продукции. Мы закрываем боли владельцев бизнеса.',
    heroCta: 'Оставить B2B-заявку',
    heroImage: '/images/business/hero.png',
    targetTitle: 'Для бизнеса любого масштаба',
    targetIntro: 'Будь то ресторан, автосалон или сеть магазинов — мы решаем проблемные места комплексно.',
    targetGroups: [
      { id: 'restaurants', title: 'Рестораны и Кафе', description: 'Ремонт неона, замена порванных или грязных меню, постеров.' },
      { id: 'salons', title: 'Салоны красоты', description: 'Уход за оконной пленкой, интерьерными вывесками и световыми логотипами.' },
      { id: 'dealers', title: 'Автосалоны', description: 'Обслуживание крупных стел, фасадных вывесок и указателей.' },
      { id: 'retail', title: 'Сетевой ритейл', description: 'Единые стандарты SLA для поддержания бренда во всех точках сети.' }
    ],
    auditTitle: 'Договор обслуживания и Регулярный аудит',
    auditIntro: 'Мы предоставляем полное обслуживание в рамках своего рода подписки.',
    auditBenefits: [
      { id: 'a1', title: 'Регулярная инспекция', description: 'Проактивный аудит состояния вывесок и рекламных материалов на объекте.' },
      { id: 'a2', title: 'Контроль бренда', description: 'Своевременная замена испорченных меню, порванных плакатов и выцветших пленок.' },
      { id: 'a3', title: 'Подписочная модель', description: 'Прогнозируемые расходы вместо внезапных трат на срочные ремонты.' }
    ],
    platformTitle: 'Личный кабинет и прозрачность',
    platformIntro: 'Полный доступ к своему личному кабинету на платформе. Вы видите все статусы, заявки.',
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
  }
};

const PROBLEME_CONTENT = {
  de: {
    metaTitle: 'Probleme mit Werbeanlagen? Typische Schäden & Lösungen | PixelRing',
    metaDescription: 'Typische Probleme mit Werbeanlagen, LED-Schildern, Leuchtkästen, Folien und Beschriftungen erkennen и direkt eine PixelRing Anfrage starten.',
    badge: 'Probleme & Lösungen',
    heroTitle: 'Typische Probleme mit Werbeanlagen erkennen und richtig lösen',
    heroIntro: 'Nicht sicher, ob es Elektrik, LED, Folie, Befestigung oder Witterungsschaden ist? Beschreiben Sie das sichtbare Problem или senden Sie ein Foto. PixelRing prüft den nächsten sinnvollen Schritt.',
    heroTrust: 'Eine Anfrage. Klare Einschätzung. Fachliche Umsetzung durch Spezialisten.',
    primaryCta: 'Problem schildern',
    secondaryCta: 'Foto senden',
    problemTitle: 'Welche Situation passt zu Ihrem Problem?',
    problemIntro: 'Waehlen Sie den sichtbaren Zustand. Die erste Einordnung hilft, die Anfrage schneller und genauer anzugehen.',
    problemCta: 'Dazu Anfrage senden',
    problems: [
      { id: 'no-light', intent: 'sign-not-lighting', title: 'Werbeanlage leuchtet nicht', symptom: 'Die Anlage bleibt dunkel oder startet nur unzuverlässig.', solution: 'PixelRing prüft typische Ursachen wie Stromversorgung, Netzteil, Anschluss, Feuchtigkeit und Steuerung.' },
      { id: 'flicker', intent: 'flickering-light', title: 'Werbeanlage flackert', symptom: 'Das Licht wirkt instabil, flackert oder faellt kurzzeitig aus.', solution: 'Wir klaeren, ob LED-Module, Netzteile, Controller, Kontakte oder Feuchtigkeit eine Rolle spielen.' },
      { id: 'uneven-led', intent: 'uneven-led-light', title: 'Ungleichmäßiges Leuchten der LEDs', symptom: 'Einzelne Bereiche sind dunkler, fleckig oder deutlich anders hell.', solution: 'Die Anlage wird auf Module, Zuleitung, Alterung und passende Reparatur- oder Austauschschritte geprüft.' },
      { id: 'letter-out', intent: 'letter-not-lighting', title: 'Ein einzelner Buchstabe leuchtet nicht', symptom: 'Nur ein Teil der Beschriftung oder ein Buchstabe ist ausgefallen.', solution: 'PixelRing grenzt lokale Ursachen ein: Modul, Anschluss, Verdrahtung oder Elementzustand.' },
      { id: 'rain-fail', intent: 'rain-failure', title: 'Werbeanlage schaltet nach Regen ab', symptom: 'Nach Regen oder Feuchtigkeit kommt es zu Ausfall, Flackern oder Abschaltung.', solution: 'Wir behandeln das als Hinweis auf Feuchtigkeit, Abdichtung, Korrosion oder elektrische Schutzabschaltung.' },
      { id: 'peeling-film', intent: 'peeling-film', title: 'Folie an der Schaufensterflaeche hat sich gelöst', symptom: 'Beschriftung oder Folie löst sich, wirft Kanten oder haftet nicht mehr sauber.', solution: 'PixelRing prüft Untergrund, Alterung, Haftung und ob Reinigung, Teilersatz oder Neufolierung sinnvoll ist.' }
    ],
    impactTitle: 'Was sich nach der Behebung verbessern kann',
    impactIntro: 'Die Werte sind keine Garantie, sondern zeigen typische Effekte, wenn sichtbare Defekte fachlich eingegrenzt und behoben werden.',
    metrics: [
      { label: 'Sichtbarkeit', before: 38, after: 86 },
      { label: 'Standortwirkung', before: 44, after: 82 },
      { label: 'Orientierung für Kunden', before: 51, after: 79 },
      { label: 'Ausfallrisiko reduziert', before: 32, after: 74 }
    ],
    urgentTitle: 'Wann ist eine dringende Reparatur noetig?',
    urgentText: 'Bei Brandgeruch, Funkenbildung, losen Teilen, offenliegenden Leitungen, Sturmschaeden oder Gefahr für Passanten sollte der Fall direkt gemeldet werden.',
    urgentPoints: [
      'Anlage nur ausschalten, wenn das gefahrlos moeglich ist.',
      'Keine elektrischen Teile oeffnen oder Befestigungen selbst lösen.',
      'Fotos helfen, aber Sicherheit geht vor Dokumentation.'
    ],
    urgentCta: 'Dringenden Fall melden',
    faqTitle: 'Haeufige Fragen zu Schäden und Reparatur',
    faqs: [
      { question: 'Muss ich wissen, welche Technik verbaut ist?', answer: 'Nein. Ein sichtbares Problem, Fotos und der Standort reichen für die erste Einordnung oft aus.' },
      { question: 'Kann PixelRing sofort sagen, ob repariert oder ersetzt wird?', answer: 'Eine Empfehlung erfolgt nach Prüfung. Der erste Fokus liegt auf sinnvoller Reparatur und Instandsetzung.' },
      { question: 'Soll ich bei elektrischen Problemen selbst prüfen?', answer: 'Nein. Schalten Sie nur ab, wenn es gefahrlos moeglich ist, und melden Sie den Fall direkt.' }
    ],
    finalTitle: 'Nicht sicher, welches Problem vorliegt?',
    finalText: 'Senden Sie uns ein Foto oder beschreiben Sie kurz, was sichtbar ist. PixelRing prüft den Fall und klaert die nächsten sinnvollen Schritte.'
  },
  en: {
    metaTitle: 'Signage Problems? Common Damage & Solutions | PixelRing',
    metaDescription: 'Understand common signage, LED, lightbox, film, lettering and storefront branding problems and start a PixelRing request.',
    badge: 'Problems & Solutions',
    heroTitle: 'Recognize common signage problems and choose the right next step',
    heroIntro: 'Not sure whether it is electrical, LED, film, mounting or weather damage? Describe the visible issue or send a photo. PixelRing checks the next sensible step.',
    heroTrust: 'One request. Clear assessment. Specialist execution.',
    primaryCta: 'Describe the problem',
    secondaryCta: 'Send a photo',
    problemTitle: 'Which situation matches your problem?',
    problemIntro: 'Start with what you can see. The first classification helps us handle your request faster.',
    problemCta: 'Send request',
    problems: [
      { id: 'no-light', intent: 'sign-not-lighting', title: 'Sign does not light up', symptom: 'The installation stays dark or starts unreliably.', solution: 'PixelRing checks typical causes such as power supply, transformer, wiring, moisture and control units.' },
      { id: 'flicker', intent: 'flickering-light', title: 'Sign flickers', symptom: 'The light is unstable, flickers or drops out briefly.', solution: 'We clarify whether LED modules, power supplies, controllers, contacts or moisture may be involved.' },
      { id: 'uneven-led', intent: 'uneven-led-light', title: 'Uneven LED brightness', symptom: 'Some areas are darker, patchy or visibly different.', solution: 'The system is checked for modules, supply lines, ageing and suitable repair or replacement steps.' },
      { id: 'letter-out', intent: 'letter-not-lighting', title: 'One letter is not lighting', symptom: 'Only part of the lettering or one letter has failed.', solution: 'PixelRing narrows down local causes such as module, connection, wiring or element condition.' },
      { id: 'rain-fail', intent: 'rain-failure', title: 'Sign fails after rain', symptom: 'After rain or moisture, the installation fails, flickers or switches off.', solution: 'We treat this as a sign of moisture, sealing issues, corrosion or electrical safety shutdown.' },
      { id: 'peeling-film', intent: 'peeling-film', title: 'Film peeling from storefront', symptom: 'Lettering or vinyl is coming loose, peeling at the edges or not adhering cleanly.', solution: 'PixelRing checks surface, ageing, adhesion and whether cleaning, partial replacement or re-filming is sensible.' }
    ],
    impactTitle: 'What can improve after the fix',
    impactIntro: 'These values are not a guarantee but show typical effects when visible defects are professionally narrowed down and resolved.',
    metrics: [
      { label: 'Visibility', before: 38, after: 86 },
      { label: 'Site impact', before: 44, after: 82 },
      { label: 'Customer orientation', before: 51, after: 79 },
      { label: 'Outage risk reduced', before: 32, after: 74 }
    ],
    urgentTitle: 'When is an urgent repair needed?',
    urgentText: 'In case of burning smell, sparks, loose parts, exposed cables, storm damage or danger to passers-by, the case should be reported immediately.',
    urgentPoints: [
      'Only switch off the system if it is safe to do so.',
      'Do not open electrical parts or loosen fastenings yourself.',
      'Photos help, but safety comes before documentation.'
    ],
    urgentCta: 'Report urgent case',
    faqTitle: 'Common questions about damage and repair',
    faqs: [
      { question: 'Do I need to know which technology is installed?', answer: 'No. A visible issue, photos and the location are often enough for the first assessment.' },
      { question: 'Can PixelRing immediately say whether it will be repaired or replaced?', answer: 'A recommendation is made after inspection. The first focus is on sensible repair and restoration.' },
      { question: 'Should I check electrical issues myself?', answer: 'No. Only switch off if safe to do so and report the case directly.' }
    ],
    finalTitle: 'Not sure which problem you have?',
    finalText: 'Send us a photo or describe briefly what is visible. PixelRing checks the case and clarifies the next sensible steps.'
  },
  ru: {
    metaTitle: 'Проблемы с рекламными конструкциями? Типичные повреждения и решения | PixelRing',
    metaDescription: 'Узнайте о типичных проблемах с вывесками, светодиодами, световыми коробами, пленками и брендингом и отправьте заявку в PixelRing.',
    badge: 'Проблемы и решения',
    heroTitle: 'Распознать типичные проблемы с рекламными конструкциями и выбрать правильный шаг',
    heroIntro: 'Не уверены, что это — электрика, светодиоды, пленка, крепление или повреждение от погоды? Опишите проблему или отправьте фото. PixelRing проверит следующий разумный шаг.',
    heroTrust: 'Одна заявка. Четкая оценка. Выполнение специалистами.',
    primaryCta: 'Описать проблему',
    secondaryCta: 'Отправить фото',
    problemTitle: 'Какая ситуация подходит под вашу проблему?',
    problemIntro: 'Выберите видимое состояние. Первая классификация помогает быстрее и точнее обработать заявку.',
    problemCta: 'Отправить заявку',
    problems: [
      { id: 'no-light', intent: 'sign-not-lighting', title: 'Вывеска не светится', symptom: 'Конструкция остается темной или включается нестабильно.', solution: 'PixelRing проверяет типичные причины, такие как питание, блок питания, подключение, влага и управление.' },
      { id: 'flicker', intent: 'flickering-light', title: 'Вывеска мигает', symptom: 'Свет кажется нестабильным, мигает или кратковременно гаснет.', solution: 'Мы выясняем, играют ли роль светодиодные модули, блоки питания, контроллеры, контакты или влага.' },
      { id: 'uneven-led', intent: 'uneven-led-light', title: 'Неравномерное свечение светодиодов', symptom: 'Отдельные участки темнее, пятнистые или заметно отличаются по яркости.', solution: 'Конструкция проверяется на модули, подводку, старение и подходящие шаги по ремонту или замене.' },
      { id: 'letter-out', intent: 'letter-not-lighting', title: 'Отдельная буква не светится', symptom: 'Вышла из строя только часть надписи или одна буква.', solution: 'PixelRing локализует причины: модуль, подключение, проводка или состояние элемента.' },
      { id: 'rain-fail', intent: 'rain-failure', title: 'Вывеска отключается после дождя', symptom: 'После дождя или влажности происходит отказ, мигание или отключение.', solution: 'Мы рассматриваем это как признак влаги, проблем с герметизацией, коррозии или срабатывания защиты.' },
      { id: 'peeling-film', intent: 'peeling-film', title: 'Пленка на витрине отклеилась', symptom: 'Надпись или пленка отклеивается, задирается по краям или плохо держится.', solution: 'PixelRing проверяет основу, старение, адгезию и целесообразность очистки, частичной замены или новой оклейки.' }
    ],
    impactTitle: 'Что может улучшиться после исправления',
    impactIntro: 'Эти значения не являются гарантией, а показывают типичные эффекты при профессиональном устранении видимых дефектов.',
    metrics: [
      { label: 'Видимость', before: 38, after: 86 },
      { label: 'Эффект локации', before: 44, after: 82 },
      { label: 'Ориентир для клиентов', before: 51, after: 79 },
      { label: 'Снижение риска отказа', before: 32, after: 74 }
    ],
    urgentTitle: 'Когда нужен срочный ремонт?',
    urgentText: 'При запахе гари, искрах, небезопасных деталях, открытых проводах, штормовых повреждениях или опасности для прохожих следует немедленно сообщить о случае.',
    urgentPoints: [
      'Выключайте систему только если это безопасно.',
      'Не открывайте электрические части и не откручивайте крепления самостоятельно.',
      'Фото помогают, но безопасность важнее документации.'
    ],
    urgentCta: 'Сообщить о срочном случае',
    faqTitle: 'Частые вопросы о повреждениях и ремонте',
    faqs: [
      { question: 'Нужно ли мне знать, какая техника установлена?', answer: 'Нет. Видимой проблемы, фото и адреса часто достаточно для первой оценки.' },
      { question: 'Может ли PixelRing сразу сказать, будет ли ремонт или замена?', answer: 'Рекомендация дается после проверки. Первый фокус — на разумном ремонте и восстановлении.' },
      { question: 'Должен ли я сам проверять проблемы с электрикой?', answer: 'Нет. Выключайте только если это безопасно и сообщайте о случае напрямую.' }
    ],
    finalTitle: 'Не уверены, какая именно проблема?',
    finalText: 'Отправьте нам фото или кратко опишите, что видно. PixelRing проверит случай и предложит следующие разумные шаги.'
  }
};

const upsertSql = `
  INSERT INTO "cms_pages" (
    "id",
    "pageKey",
    "locale",
    "status",
    "title",
    "blocks",
    "seoTitle",
    "seoDescription",
    "createdAt",
    "updatedAt"
  ) VALUES (
    $1, $2, $3, $4::"CmsArticleStatus", $5, $6, $7, $8, $9, $10
  )
  ON CONFLICT ("pageKey", "locale")
  DO UPDATE SET
    "status" = EXCLUDED."status",
    "title" = EXCLUDED."title",
    "blocks" = EXCLUDED."blocks",
    "seoTitle" = EXCLUDED."seoTitle",
    "seoDescription" = EXCLUDED."seoDescription",
    "updatedAt" = EXCLUDED."updatedAt"
`;

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log('🚀 Starting direct CMS migration for all main pages...');
    await client.query('BEGIN');

    for (const locale of SUPPORTED_LOCALES) {
      // 1. LEISTUNGEN
      const l = LEISTUNGEN_CONTENT[locale] || LEISTUNGEN_CONTENT.de;
      const lBlocks = JSON.stringify([
        { type: 'cardList', key: 'heroSlides', enabled: true, sortOrder: 1, items: l.heroSlides },
        { type: 'cardList', key: 'repair', enabled: true, sortOrder: 2, title: l.repairTitle, description: l.repairIntro, items: l.repairCards, focus: l.repairFocus },
        { type: 'cardList', key: 'branding', enabled: true, sortOrder: 3, title: l.brandingTitle, description: l.brandingIntro, items: l.brandingCards },
        { type: 'cardList', key: 'maintenance', enabled: true, sortOrder: 4, title: l.maintenanceTitle, description: l.maintenanceSubline, items: l.maintenanceBenefits, discount: l.maintenanceDiscount, cta: l.serviceContractCta, auditCta: l.auditCta },
        { type: 'cardList', key: 'process', enabled: true, sortOrder: 5, title: l.processTitle, items: l.processSteps },
        { type: 'cardList', key: 'trust', enabled: true, sortOrder: 6, title: l.frameTitle, items: l.trustPoints, finalHeadline: l.finalHeadline, finalText: l.finalText }
      ]);
      await client.query(upsertSql, [crypto.randomUUID(), 'leistungen', locale, 'PUBLISHED', 'Leistungen', lBlocks, l.metaTitle, l.metaDescription, now, now]);

      // 2. BUSINESS
      const b = BUSINESS_CONTENT[locale] || BUSINESS_CONTENT.de;
      const bBlocks = JSON.stringify([
        { type: 'hero', key: 'hero', enabled: true, sortOrder: 1, title: b.heroTitle, description: b.heroIntro, cta: b.heroCta, image: b.heroImage },
        { type: 'cardList', key: 'target', enabled: true, sortOrder: 2, title: b.targetTitle, description: b.targetIntro, items: b.targetGroups },
        { type: 'cardList', key: 'audit', enabled: true, sortOrder: 3, title: b.auditTitle, description: b.auditIntro, items: b.auditBenefits },
        { type: 'cardList', key: 'platform', enabled: true, sortOrder: 4, title: b.platformTitle, description: b.platformIntro, items: b.platformBenefits },
        { type: 'textSection', key: 'trust', enabled: true, sortOrder: 5, title: b.trustTitle, description: b.trustIntro },
        { type: 'cta', key: 'final', enabled: true, sortOrder: 6, title: b.finalHeadline, description: b.finalText, primaryLabel: b.finalCta }
      ]);
      await client.query(upsertSql, [crypto.randomUUID(), 'business', locale, 'PUBLISHED', 'Business', bBlocks, b.metaTitle, b.metaDescription, now, now]);

      // 3. PROBLEME & LOESUNGEN
      const p = PROBLEME_CONTENT[locale] || PROBLEME_CONTENT.de;
      const pBlocks = JSON.stringify([
        { type: 'hero', key: 'hero', enabled: true, sortOrder: 1, title: p.heroTitle, description: p.heroIntro, cta: p.primaryCta, secondaryCta: p.secondaryCta, badge: p.badge, trust: p.heroTrust },
        { type: 'cardList', key: 'problems', enabled: true, sortOrder: 2, title: p.problemTitle, description: p.problemIntro, items: p.problems, cta: p.problemCta },
        { type: 'cardList', key: 'impact', enabled: true, sortOrder: 3, title: p.impactTitle, description: p.impactIntro, items: p.metrics },
        { type: 'textSection', key: 'urgent', enabled: true, sortOrder: 4, title: p.urgentTitle, description: p.urgentText, items: p.urgentPoints, cta: p.urgentCta },
        { type: 'faqList', key: 'faq', enabled: true, sortOrder: 5, title: p.faqTitle, items: p.faqs },
        { type: 'cta', key: 'final', enabled: true, sortOrder: 6, title: p.finalTitle, description: p.finalText, primaryLabel: p.primaryCta }
      ]);
      await client.query(upsertSql, [crypto.randomUUID(), 'probleme-loesungen', locale, 'PUBLISHED', 'Probleme & Lösungen', pBlocks, p.metaTitle, p.metaDescription, now, now]);

      console.log(`✅ ${locale.toUpperCase()} synced.`);
    }

    await client.query('COMMIT');
    console.log('✨ Migration finished successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
