import type { Metadata } from 'next';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import LeistungenHero from '@/components/leistungen/LeistungenHero';
import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';
import { getGlobalPageCmsContent, getLeistungenPageCmsContent } from '@/lib/cms/pages';
import type { LeistungenHeroSlideCmsContent } from '@/lib/cms/pages';

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

type ServiceIntent =
  | 'diagnose'
  | 'lichtwerbung-led'
  | 'konstruktion-befestigung'
  | 'reinigung-pflege'
  | 'montage-demontage'
  | 'druckprodukte-branding'
  | 'folierung-beschriftung'
  | 'wartung-servicevertrag';

type RepairCard = {
  id: string;
  intent: ServiceIntent;
  title: string;
  summary: string;
  details: string;
};

type SimpleCard = {
  id: string;
  intent: ServiceIntent;
  title: string;
  text: string;
};

type Step = {
  id: string;
  title: string;
  text: string;
};

type LeistungenContent = {
  metaTitle: string;
  metaDescription: string;
  heroSlides: HeroSlide[];
  repairTitle: string;
  repairIntro: string;
  repairCards: RepairCard[];
  repairFocus: string;
  brandingTitle: string;
  brandingIntro: string;
  brandingCards: SimpleCard[];
  maintenanceTitle: string;
  maintenanceSubline: string;
  maintenanceBenefits: string[];
  maintenanceDiscount: string;
  serviceContractCta: string;
  auditCta: string;
  processTitle: string;
  processSteps: Step[];
  intakeNote: string;
  frameTitle: string;
  trustPoints: string[];
  finalHeadline: string;
  finalText: string;
  repairEnabled?: boolean;
  brandingEnabled?: boolean;
  maintenanceEnabled?: boolean;
  processEnabled?: boolean;
  trustEnabled?: boolean;
};

type HeroSlide = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  fallbackSrc?: string;
  cta: string;
};

const CONTENT: Record<Locale, LeistungenContent> = {
  de: {
    metaTitle: 'Leistungen fuer Reparatur, Wartung & Werbetechnik | PixelRing',
    metaDescription:
      'PixelRing unterstuetzt Unternehmen bei Reparatur, Diagnose, Montage, Wartung, Lichtwerbung, Branding, Druckprodukten und Servicevertraegen fuer Werbeanlagen.',
    heroSlides: [
      {
        id: 'repair',
        title: 'Reparatur & Diagnose vom Profi',
        description: 'Ihr Partner fuer Werbeanlagen in Berlin & Brandenburg. Fachliche Pruefung und Umsetzung durch Spezialisten.',
        image: '/images/leistungen/hero-repair.png',
        cta: 'Anfrage starten',
      },
      {
        id: 'led',
        title: 'Moderne Lichtwerbung & LED-Service',
        description: 'Lichtwerbung, die auffaellt. Wir reparieren LED-Module, Netzteile und Neonroehren fachgerecht.',
        image: '/images/leistungen/hero-led-natural.png',
        cta: 'Anfrage starten',
      },
      {
        id: 'maintenance',
        title: 'Wartung & Sorgenfreier Betrieb',
        description: 'Servicevertraege fuer Unternehmen mit einem oder mehreren Standorten. Geplante Wartung statt Notfall.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'Servicevertrag anfragen',
      },
      {
        id: 'branding',
        title: 'Druck, Folierung & Standort-Branding',
        description: 'Von Schaufensterbeschriftung bis Werbematerial: klare Markenwirkung fuer Ihren Geschaeftsstandort.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'Branding anfragen',
      },
    ],
    repairTitle: 'Reparatur, Diagnose und Montage von Werbeanlagen',
    repairIntro:
      'Von der ersten Sichtpruefung bis zur Reparatur, Demontage oder Neuinstallation: PixelRing prueft den Zustand Ihrer Werbeanlage und koordiniert die passenden naechsten Schritte.',
    repairCards: [
      {
        id: 'diagnose',
        intent: 'diagnose',
        title: 'Diagnose & Vor-Ort-Pruefung',
        summary: 'Zustand, Ursache und Umfang werden strukturiert aufgenommen.',
        details:
          'Wir pruefen sichtbare Schaeden, Montagepunkte, elektrische Hinweise und Standortbedingungen. Danach ist klarer, ob eine Ferneinschaetzung reicht oder ein Termin vor Ort sinnvoll ist.',
      },
      {
        id: 'lichtwerbung-led',
        intent: 'lichtwerbung-led',
        title: 'Elektrik, Lichtwerbung & LED-Service',
        summary: 'Service fuer Lichtwerbung, LED-Module, Netzteile, Controller und Neonroehren.',
        details:
          'Bei Leuchtschildern und Lichtanlagen pruefen wir typische Ursachen wie Verkabelung, Stromversorgung, Controller, Transformatoren, LED-Module oder Neonroehren und koordinieren die fachliche Umsetzung.',
      },
      {
        id: 'konstruktion-befestigung',
        intent: 'konstruktion-befestigung',
        title: 'Reparatur von Konstruktion & Befestigung',
        summary: 'Halterungen, Rahmen, Unterkonstruktionen und Befestigungspunkte im Blick.',
        details:
          'Lose, beschaedigte oder gealterte Konstruktionsteile werden bewertet. Ziel ist eine sinnvolle Instandsetzung mit klarer Empfehlung, bevor neue Konstruktionen geplant werden.',
      },
      {
        id: 'reinigung-pflege',
        intent: 'reinigung-pflege',
        title: 'Reinigung, Pflege & optische Instandsetzung',
        summary: 'Sichtbarkeit und Erscheinungsbild bestehender Anlagen verbessern.',
        details:
          'Wir klaeren, welche Reinigung, Pflege oder optische Instandsetzung passend ist, damit die Anlage wieder ordentlich wirkt und vermeidbare Folgeschaeden reduziert werden.',
      },
      {
        id: 'montage-demontage',
        intent: 'montage-demontage',
        title: 'Montage, Demontage & Versetzung',
        summary: 'Koordinierte Umsetzung fuer neue, bestehende oder zu versetzende Anlagen.',
        details:
          'PixelRing koordiniert Montage, Demontage oder Standortwechsel von Werbeanlagen inklusive Abstimmung der naechsten Schritte und benoetigter Spezialisten.',
      },
      {
        id: 'ersatzloesung',
        intent: 'diagnose',
        title: 'Reparatur pruefen - Ersatzloesung nur wenn sinnvoll',
        summary: 'Ersatz oder Neubau wird erst empfohlen, wenn Reparatur nicht sinnvoll ist.',
        details:
          'Unser erster Fokus liegt auf der Reparatur und sinnvollen Instandsetzung bestehender Werbeanlagen. Sollte eine Reparatur technisch oder wirtschaftlich nicht empfehlenswert sein, koennen wir Ihnen auch eine passende Ersatzloesung oder neue Konstruktion anbieten.',
      },
    ],
    repairFocus:
      'Unser erster Fokus liegt auf der Reparatur und sinnvollen Instandsetzung bestehender Werbeanlagen.',
    brandingTitle: 'Druckprodukte, Branding und Werbematerialien fuer Geschaeftsstandorte',
    brandingIntro:
      'PixelRing unterstuetzt Unternehmen auch bei der laufenden Versorgung mit Werbematerialien - von Druckdaten und Gestaltung bis zu Folien, Bannern, Postern und Standort-Branding.',
    brandingCards: [
      {
        id: 'design',
        intent: 'druckprodukte-branding',
        title: 'Design & Druckdaten',
        text: 'Aufbereitung, Anpassung und Abstimmung von Druckdaten fuer Standort- und Werbematerialien.',
      },
      {
        id: 'druckprodukte',
        intent: 'druckprodukte-branding',
        title: 'Druckprodukte & Werbemittel',
        text: 'Poster, Banner, Aufkleber, Hinweisschilder und weitere Materialien fuer den laufenden Bedarf.',
      },
      {
        id: 'folierung',
        intent: 'folierung-beschriftung',
        title: 'Folierung & Beschriftung',
        text: 'Beschriftungen, Folien und sichtbare Markenelemente fuer Flaechen, Fenster und Standorte.',
      },
      {
        id: 'filialen',
        intent: 'druckprodukte-branding',
        title: 'Versorgung von Filialen & Standorten',
        text: 'Koordinierte Materialversorgung fuer Unternehmen mit einem oder mehreren Standorten.',
      },
    ],
    maintenanceTitle: 'Wartung & Servicevertraege: Werbeanlagen betreuen lassen statt selbst kontrollieren',
    maintenanceSubline:
      'Mit einem Servicevertrag uebernimmt PixelRing die regelmaessige Pruefung, Wartung und Betreuung Ihrer Werbeanlagen und Werbematerialien - besonders sinnvoll fuer Unternehmen mit einem oder mehreren Standorten.',
    maintenanceBenefits: [
      'Weniger Aufwand im Tagesgeschaeft',
      'Geplante Wartung statt nur reaktiver Notfallreparatur',
      'Geeignet fuer Filialen und mehrere Standorte',
      'Zentrale Koordination fuer Anlagen und Werbematerialien',
    ],
    maintenanceDiscount:
      'Bis zu 20% Vorteil auf ausgewaehlte Werbematerialien bei bestehendem Wartungs- oder Servicevertrag.',
    serviceContractCta: 'Servicevertrag anfragen',
    auditCta: 'Audit fuer Standort anfragen',
    processTitle: 'So laeuft Ihre Anfrage ab',
    processSteps: [
      { id: 'send', title: 'Anfrage senden', text: 'Beschreiben Sie die Aufgabe und laden Sie Fotos hoch, wenn das hilfreich ist.' },
      { id: 'scope', title: 'Pruefung des Umfangs', text: 'PixelRing prueft, ob eine Ferneinschaetzung reicht oder ein Vor-Ort-Termin sinnvoll ist.' },
      { id: 'recommendation', title: 'Empfehlung erhalten', text: 'Die Empfehlung kann Reparatur, Wartung, Ersatz, Druckprodukt, Montage oder Neubau betreffen.' },
      { id: 'offer', title: 'Angebot & Freigabe', text: 'Konkrete Leistungen und Bedingungen werden vor der Beauftragung abgestimmt.' },
      { id: 'execution', title: 'Koordination & Umsetzung', text: 'PixelRing koordiniert die Umsetzung durch Fachteam und qualifizierte Partner.' },
    ],
    intakeNote: 'Ihre Angaben werden digital strukturiert aufgenommen.',
    frameTitle: 'Klarer Rahmen fuer Ihre Anfrage',
    trustPoints: [
      'Keine Vermittlungsplattform: Ihre Anfrage geht direkt an PixelRing.',
      'Berlin & Brandenburg als Kerngebiet - weitere Regionen in Deutschland auf Anfrage.',
      'Garantie bis zu 24 Monate, abhaengig von Leistung, Material und Einsatzbedingungen.',
      'Umsetzung durch Fachteam und qualifizierte Partner unter zentraler PixelRing-Koordination.',
    ],
    finalHeadline: 'Nicht sicher, ob Ihre Aufgabe passt?',
    finalText:
      'Senden Sie uns eine kurze Beschreibung oder ein Foto. PixelRing prueft den Umfang und klaert die naechsten sinnvollen Schritte.',
  },
  en: {
    metaTitle: 'Services for Repair, Maintenance & Signage | PixelRing',
    metaDescription:
      'PixelRing supports businesses with repair, diagnostics, installation, maintenance, illuminated signage, branding, print products, and service contracts.',
    heroSlides: [
      {
        id: 'repair',
        title: 'Professional Repair & Diagnostics',
        description: 'Your partner for signage in Berlin & Brandenburg. Specialist review and execution.',
        image: '/images/leistungen/hero-repair.png',
        cta: 'Start request',
      },
      {
        id: 'led',
        title: 'Modern Lighting & LED Service',
        description: 'Signage that stands out. We repair LED modules, power supplies and neon tubes professionally.',
        image: '/images/leistungen/hero-led-natural.png',
        cta: 'Start request',
      },
      {
        id: 'maintenance',
        title: 'Maintenance & Worry-Free Operation',
        description: 'Service contracts for companies with one or more locations. Planned maintenance instead of emergency.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'Request service contract',
      },
      {
        id: 'branding',
        title: 'Print, Vinyl & Location Branding',
        description: 'From storefront lettering to marketing materials: clear brand presence for your business location.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'Request branding',
      },
    ],
    repairTitle: 'Repair, diagnostics and installation of signage',
    repairIntro:
      'From the first visual check to repair, dismantling or new installation: PixelRing reviews the condition of your signage and coordinates the next sensible steps.',
    repairCards: [
      { id: 'diagnose', intent: 'diagnose', title: 'Diagnostics & on-site inspection', summary: 'Condition, cause and scope are recorded clearly.', details: 'We review visible damage, mounting points, electrical clues and site conditions, then decide whether remote assessment is enough or an on-site appointment makes sense.' },
      { id: 'lichtwerbung-led', intent: 'lichtwerbung-led', title: 'Electrical, illuminated signage & LED service', summary: 'Service for illuminated signs, LED modules, power supplies, controllers and neon tubes.', details: 'For light signs and lighting systems, we check common causes such as wiring, power supplies, controllers, transformers, LED modules or neon tubes and coordinate specialist execution.' },
      { id: 'konstruktion-befestigung', intent: 'konstruktion-befestigung', title: 'Structure & mounting repair', summary: 'Brackets, frames, substructures and fixing points are assessed.', details: 'Loose, damaged or aged structural parts are reviewed with repair as the first goal before a new construction is planned.' },
      { id: 'reinigung-pflege', intent: 'reinigung-pflege', title: 'Cleaning, care & visual restoration', summary: 'Improve visibility and appearance of existing installations.', details: 'We clarify which cleaning, care or visual restoration is appropriate so the installation looks professional again and avoidable follow-up damage is reduced.' },
      { id: 'montage-demontage', intent: 'montage-demontage', title: 'Installation, dismantling & relocation', summary: 'Coordinated work for new, existing or relocated signage.', details: 'PixelRing coordinates installation, dismantling or site relocation, including next-step planning and required specialists.' },
      { id: 'ersatzloesung', intent: 'diagnose', title: 'Check repair first - replacement only when sensible', summary: 'Replacement or new construction is recommended only when repair is not sensible.', details: 'Our first focus is repair and sensible restoration of existing signage. If repair is not technically or economically recommended, we can also offer a fitting replacement solution or new construction.' },
    ],
    repairFocus: 'Our first focus is repair and sensible restoration of existing signage.',
    brandingTitle: 'Print products, branding and advertising materials for business locations',
    brandingIntro:
      'PixelRing also supports businesses with ongoing advertising materials - from artwork and print data to films, banners, posters and location branding.',
    brandingCards: [
      { id: 'design', intent: 'druckprodukte-branding', title: 'Design & print data', text: 'Preparation, adaptation and coordination of print data for locations and advertising materials.' },
      { id: 'druckprodukte', intent: 'druckprodukte-branding', title: 'Print products & advertising materials', text: 'Posters, banners, stickers, information signs and other materials for ongoing needs.' },
      { id: 'folierung', intent: 'folierung-beschriftung', title: 'Films & lettering', text: 'Lettering, films and visible brand elements for surfaces, windows and locations.' },
      { id: 'filialen', intent: 'druckprodukte-branding', title: 'Branch and location supply', text: 'Coordinated material supply for companies with one or more locations.' },
    ],
    maintenanceTitle: 'Maintenance & service contracts: let signage be cared for instead of checking it yourself',
    maintenanceSubline:
      'With a service contract, PixelRing takes over regular inspection, maintenance and care of your signage and advertising materials - especially useful for companies with one or more locations.',
    maintenanceBenefits: ['Less day-to-day effort', 'Planned maintenance instead of only reactive emergency repair', 'Suitable for branches and multiple locations', 'Central coordination for signage and materials'],
    maintenanceDiscount: 'Up to 20% benefit on selected advertising materials with an active maintenance or service contract.',
    serviceContractCta: 'Request service contract',
    auditCta: 'Request location audit',
    processTitle: 'How your request works',
    processSteps: [
      { id: 'send', title: 'Send request', text: 'Describe the task and upload photos if helpful.' },
      { id: 'scope', title: 'Scope review', text: 'PixelRing checks whether remote assessment is enough or an on-site appointment is sensible.' },
      { id: 'recommendation', title: 'Receive recommendation', text: 'The recommendation may be repair, maintenance, replacement, print product, installation or new construction.' },
      { id: 'offer', title: 'Offer & approval', text: 'Concrete services and conditions are agreed before commissioning.' },
      { id: 'execution', title: 'Coordination & execution', text: 'PixelRing coordinates execution through its specialist team and qualified partners.' },
    ],
    intakeNote: 'Your information is captured in a structured digital way.',
    frameTitle: 'A clear frame for your request',
    trustPoints: [
      'No marketplace: your request goes directly to PixelRing.',
      'Berlin & Brandenburg as core area - other German regions on request.',
      'Warranty up to 24 months, depending on service, material and usage conditions.',
      'Execution by specialist team and qualified partners under central PixelRing coordination.',
    ],
    finalHeadline: 'Not sure whether your task fits?',
    finalText: 'Send a short description or a photo. PixelRing reviews the scope and clarifies the next sensible steps.',
  },
  ru: {
    metaTitle: 'Услуги по ремонту, обслуживанию и рекламной технике | PixelRing',
    metaDescription:
      'PixelRing помогает компаниям с ремонтом, диагностикой, монтажом, обслуживанием, световой рекламой, брендингом, печатной продукцией и сервисными договорами.',
    heroSlides: [
      {
        id: 'repair',
        title: 'Профессиональный ремонт и диагностика',
        description: 'Ваш партнер по рекламным конструкциям в Берлине и Бранденбурге. Проверка и выполнение специалистами.',
        image: '/images/leistungen/hero-repair.png',
        cta: 'Начать заявку',
      },
      {
        id: 'led',
        title: 'Современная световая реклама и LED-сервис',
        description: 'Реклама, которую замечают. Профессиональный ремонт LED-модулей, блоков питания и неона.',
        image: '/images/leistungen/hero-led-natural.png',
        cta: 'Начать заявку',
      },
      {
        id: 'maintenance',
        title: 'Обслуживание и работа без забот',
        description: 'Сервисные договоры для компаний с одним или несколькими филиалами. Плановое обслуживание вместо аварий.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'Запросить сервисный договор',
      },
      {
        id: 'branding',
        title: 'Печать, пленка и брендинг точки',
        description: 'От оформления витрин до рекламных материалов: понятное присутствие бренда в вашем помещении.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'Запросить брендинг',
      },
    ],
    repairTitle: 'Ремонт, диагностика и монтаж рекламных конструкций',
    repairIntro:
      'От первичного осмотра до ремонта, демонтажа или новой установки: PixelRing проверяет состояние конструкции и координирует следующие шаги.',
    repairCards: [
      { id: 'diagnose', intent: 'diagnose', title: 'Диагностика и выездная проверка', summary: 'Фиксируем состояние, причину и объем задачи.', details: 'Проверяем видимые повреждения, крепления, электрические признаки и условия локации, чтобы понять, достаточно ли удаленной оценки или нужен выезд.' },
      { id: 'lichtwerbung-led', intent: 'lichtwerbung-led', title: 'Электрика, световая реклама и LED-сервис', summary: 'Сервис для световых вывесок, LED-модулей, блоков питания, контроллеров и неоновых трубок.', details: 'Для световых конструкций проверяем проводку, питание, контроллеры, трансформаторы, LED-модули или неоновые трубки и координируем работу специалистов.' },
      { id: 'konstruktion-befestigung', intent: 'konstruktion-befestigung', title: 'Ремонт конструкции и креплений', summary: 'Оцениваем рамы, подконструкции и точки крепления.', details: 'Ослабленные, поврежденные или устаревшие элементы оцениваются с приоритетом ремонта до планирования новой конструкции.' },
      { id: 'reinigung-pflege', intent: 'reinigung-pflege', title: 'Очистка, уход и визуальное восстановление', summary: 'Улучшаем внешний вид существующих конструкций.', details: 'Определяем подходящую очистку, уход или визуальное восстановление, чтобы объект снова выглядел профессионально.' },
      { id: 'montage-demontage', intent: 'montage-demontage', title: 'Монтаж, демонтаж и перенос', summary: 'Координация работ для новых, существующих или переносимых конструкций.', details: 'PixelRing координирует монтаж, демонтаж или перенос рекламных конструкций, включая план следующих шагов и привлечение специалистов.' },
      { id: 'ersatzloesung', intent: 'diagnose', title: 'Сначала проверка ремонта - замена только при необходимости', summary: 'Замена или новая конструкция предлагается только когда ремонт неразумен.', details: 'Наш первый фокус - ремонт и разумное восстановление существующих конструкций. Если ремонт технически или экономически не рекомендуется, мы можем предложить подходящую замену или новую конструкцию.' },
    ],
    repairFocus: 'Наш первый фокус - ремонт и разумное восстановление существующих рекламных конструкций.',
    brandingTitle: 'Печатная продукция, брендинг и рекламные материалы для бизнес-локаций',
    brandingIntro:
      'PixelRing помогает компаниям с текущими рекламными материалами - от макетов и печатных данных до пленок, баннеров, постеров и брендинга локаций.',
    brandingCards: [
      { id: 'design', intent: 'druckprodukte-branding', title: 'Дизайн и печатные данные', text: 'Подготовка, адаптация и согласование файлов для печати и материалов локации.' },
      { id: 'druckprodukte', intent: 'druckprodukte-branding', title: 'Печатная продукция и рекламные материалы', text: 'Постеры, баннеры, наклейки, информационные таблички и другие материалы.' },
      { id: 'folierung', intent: 'folierung-beschriftung', title: 'Пленки и надписи', text: 'Брендированные надписи, пленки и видимые элементы для поверхностей, окон и локаций.' },
      { id: 'filialen', intent: 'druckprodukte-branding', title: 'Снабжение филиалов и локаций', text: 'Координированное обеспечение материалами для одной или нескольких точек.' },
    ],
    maintenanceTitle: 'Обслуживание и сервисные договоры: контроль рекламных конструкций без лишней нагрузки',
    maintenanceSubline:
      'По сервисному договору PixelRing берет на себя регулярную проверку, обслуживание и сопровождение рекламных конструкций и материалов.',
    maintenanceBenefits: ['Меньше ежедневной нагрузки', 'Плановое обслуживание вместо только срочного ремонта', 'Подходит для филиалов и нескольких локаций', 'Центральная координация конструкций и материалов'],
    maintenanceDiscount: 'До 20% выгоды на выбранные рекламные материалы при действующем договоре обслуживания или сервиса.',
    serviceContractCta: 'Запросить сервисный договор',
    auditCta: 'Запросить аудит локации',
    processTitle: 'Как проходит заявка',
    processSteps: [
      { id: 'send', title: 'Отправьте заявку', text: 'Опишите задачу и загрузите фото, если это поможет.' },
      { id: 'scope', title: 'Проверка объема', text: 'PixelRing проверяет, достаточно ли удаленной оценки или нужен выезд.' },
      { id: 'recommendation', title: 'Получите рекомендацию', text: 'Рекомендация может касаться ремонта, обслуживания, замены, печати, монтажа или новой конструкции.' },
      { id: 'offer', title: 'Предложение и согласование', text: 'Конкретные услуги и условия согласуются до начала работ.' },
      { id: 'execution', title: 'Координация и выполнение', text: 'PixelRing координирует выполнение через команду специалистов и квалифицированных партнеров.' },
    ],
    intakeNote: 'Ваши данные принимаются в структурированном цифровом виде.',
    frameTitle: 'Понятные рамки заявки',
    trustPoints: [
      'Не маркетплейс: заявка идет напрямую в PixelRing.',
      'Берлин и Бранденбург как основной регион - другие регионы Германии по запросу.',
      'Гарантия до 24 месяцев в зависимости от услуги, материала и условий использования.',
      'Выполнение командой специалистов и квалифицированными партнерами под координацией PixelRing.',
    ],
    finalHeadline: 'Не уверены, подходит ли ваша задача?',
    finalText: 'Отправьте короткое описание или фото. PixelRing проверит объем и предложит следующие разумные шаги.',
  },
  tr: {
    metaTitle: 'Onarim, Bakim ve Reklam Teknigi Hizmetleri | PixelRing',
    metaDescription:
      'PixelRing; onarim, teshis, montaj, bakim, isikli reklam, markalama, baski urunleri ve servis sozlesmeleri icin isletmelere destek verir.',
    heroSlides: [
      {
        id: 'repair',
        title: 'Uzman Onarim ve Teshis',
        description: 'Berlin ve Brandenburgdaki reklam sistemleri partneriniz. Uzmanlar tarafindan inceleme ve uygulama.',
        image: '/images/leistungen/hero-repair.png',
        cta: 'Talep baslat',
      },
      {
        id: 'led',
        title: 'Modern Isikli Reklam ve LED Servisi',
        description: 'Dikkat ceken reklamlar. LED modulleri, guc kaynaklari ve neon tuplerini profesyonelce onariyoruz.',
        image: '/images/leistungen/hero-led-natural.png',
        cta: 'Talep baslat',
      },
      {
        id: 'maintenance',
        title: 'Bakim ve Sorunsuz Operasyon',
        description: 'Bir veya birden fazla lokasyonu olan isletmeler icin servis sozlesmeleri. Acil durum yerine planli bakim.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'Servis sozlesmesi talep et',
      },
      {
        id: 'branding',
        title: 'Baski, Folyo & Mekan Markalama',
        description: 'Vitrin yazilarindan reklam malzemelerine kadar isletme noktaniz icin net marka gorunurlugu.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'Branding talep et',
      },
    ],
    repairTitle: 'Reklam sistemleri icin onarim, teshis ve montaj',
    repairIntro:
      'Ilk gorsel kontrolden onarim, sokum veya yeni kuruluma kadar PixelRing sisteminizin durumunu inceler ve dogru sonraki adimlari koordine eder.',
    repairCards: [
      { id: 'diagnose', intent: 'diagnose', title: 'Teshis ve yerinde kontrol', summary: 'Durum, neden ve kapsam net sekilde kayda alinir.', details: 'Gorunur hasarlar, montaj noktalari, elektrik belirtileri ve lokasyon kosullari kontrol edilir; uzaktan degerlendirme mi yoksa yerinde randevu mu gerektigi netlesir.' },
      { id: 'lichtwerbung-led', intent: 'lichtwerbung-led', title: 'Elektrik, isikli reklam ve LED servisi', summary: 'Isikli tabelalar, LED moduller, guc kaynaklari, kontrol cihazlari ve neon tupler icin servis.', details: 'Isikli sistemlerde kablolama, guc kaynagi, kontrol cihazlari, transformatorler, LED moduller veya neon tupler gibi tipik nedenler kontrol edilir.' },
      { id: 'konstruktion-befestigung', intent: 'konstruktion-befestigung', title: 'Konstruksiyon ve sabitleme onarimi', summary: 'Tasiyicilar, cerceveler ve baglanti noktalari degerlendirilir.', details: 'Gevsek, hasarli veya yipranmis parcalar yeni konstruksiyon planlanmadan once onarim odakli degerlendirilir.' },
      { id: 'reinigung-pflege', intent: 'reinigung-pflege', title: 'Temizlik, bakim ve gorsel yenileme', summary: 'Mevcut sistemlerin gorunurlugunu ve gorunumunu iyilestirir.', details: 'Sistemin tekrar profesyonel gorunmesi ve gereksiz sonraki hasarlarin azalmasi icin uygun temizlik veya gorsel yenileme belirlenir.' },
      { id: 'montage-demontage', intent: 'montage-demontage', title: 'Montaj, demontaj ve tasima', summary: 'Yeni, mevcut veya tasinacak sistemler icin koordineli uygulama.', details: 'PixelRing montaj, demontaj veya lokasyon degisimini gerekli uzmanlarla birlikte koordine eder.' },
      { id: 'ersatzloesung', intent: 'diagnose', title: 'Once onarim kontrolu - degisim yalnizca mantikliysa', summary: 'Degisim veya yeni yapim sadece onarim mantikli olmadiginda onerilir.', details: 'Ilk odagimiz mevcut reklam sistemlerinin onarimi ve anlamli sekilde yeniden kullanilmasidir. Onarim teknik veya ekonomik olarak uygun degilse uygun degisim veya yeni konstruksiyon sunabiliriz.' },
    ],
    repairFocus: 'Ilk odagimiz mevcut reklam sistemlerinin onarimi ve anlamli sekilde yeniden kullanilmasidir.',
    brandingTitle: 'Is lokasyonlari icin baski urunleri, markalama ve reklam materyalleri',
    brandingIntro:
      'PixelRing; baski datalari, tasarim, folyo, banner, poster ve lokasyon markalama dahil surekli reklam materyali ihtiyacinda isletmelere destek olur.',
    brandingCards: [
      { id: 'design', intent: 'druckprodukte-branding', title: 'Tasarim ve baski datalari', text: 'Lokasyon ve reklam materyalleri icin baski dosyalarinin hazirlanmasi ve uyarlanmasi.' },
      { id: 'druckprodukte', intent: 'druckprodukte-branding', title: 'Baski urunleri ve reklam materyalleri', text: 'Poster, banner, sticker, yonlendirme tabelalari ve surekli ihtiyac materyalleri.' },
      { id: 'folierung', intent: 'folierung-beschriftung', title: 'Folyo ve yazilama', text: 'Yuzeyler, vitrinler ve lokasyonlar icin marka yazilari ve folyo uygulamalari.' },
      { id: 'filialen', intent: 'druckprodukte-branding', title: 'Sube ve lokasyon tedarigi', text: 'Bir veya daha fazla lokasyon icin koordineli materyal tedarigi.' },
    ],
    maintenanceTitle: 'Bakim ve servis sozlesmeleri: reklam sistemlerinizi kendiniz kontrol etmek yerine takip ettirin',
    maintenanceSubline:
      'Servis sozlesmesiyle PixelRing reklam sistemleri ve materyallerinin duzenli kontrol, bakim ve destegini ustlenir.',
    maintenanceBenefits: ['Gunluk operasyonda daha az efor', 'Sadece acil onarim yerine planli bakim', 'Subeler ve birden fazla lokasyon icin uygun', 'Sistemler ve materyaller icin merkezi koordinasyon'],
    maintenanceDiscount: 'Mevcut bakim veya servis sozlesmesiyle secili reklam materyallerinde %20ye kadar avantaj.',
    serviceContractCta: 'Servis sozlesmesi talep et',
    auditCta: 'Lokasyon auditi talep et',
    processTitle: 'Talebiniz nasil ilerler',
    processSteps: [
      { id: 'send', title: 'Talep gonder', text: 'Gorevi aciklayin ve faydaliysa fotograf yukleyin.' },
      { id: 'scope', title: 'Kapsam kontrolu', text: 'PixelRing uzaktan degerlendirme yeterli mi yoksa yerinde randevu mu gerekli kontrol eder.' },
      { id: 'recommendation', title: 'Oneri alin', text: 'Oneri onarim, bakim, degisim, baski urunu, montaj veya yeni konstruksiyon olabilir.' },
      { id: 'offer', title: 'Teklif ve onay', text: 'Somut hizmetler ve kosullar uygulama oncesinde netlestirilir.' },
      { id: 'execution', title: 'Koordinasyon ve uygulama', text: 'PixelRing uygulamayi uzman ekibi ve nitelikli partnerleriyle koordine eder.' },
    ],
    intakeNote: 'Bilgileriniz dijital olarak yapilandirilmis sekilde alinir.',
    frameTitle: 'Talebiniz icin net cerceve',
    trustPoints: [
      'Pazar yeri degil: talebiniz dogrudan PixelRinge gider.',
      'Ana bolge Berlin & Brandenburg - Almanya icindeki diger bolgeler talep uzerine.',
      'Hizmet, materyal ve kullanim kosullarina bagli olarak 24 aya kadar garanti.',
      'PixelRing koordinasyonunda uzman ekip ve nitelikli partnerlerle uygulama.',
    ],
    finalHeadline: 'Gorevinizin uygun olup olmadigindan emin degil misiniz?',
    finalText: 'Kisa bir aciklama veya fotograf gonderin. PixelRing kapsami kontrol eder ve mantikli sonraki adimlari netlestirir.',
  },
  pl: {
    metaTitle: 'Uslugi naprawy, konserwacji i techniki reklamowej | PixelRing',
    metaDescription:
      'PixelRing wspiera firmy w naprawie, diagnostyce, montazu, konserwacji, reklamie swietlnej, brandingu, druku i umowach serwisowych.',
    heroSlides: [
      {
        id: 'repair',
        title: 'Profesjonalna Naprawa i Diagnostyka',
        description: 'Twoj partner w zakresie reklam w Berlinie i Brandenburgii. Ocena i wykonanie przez specjalistow.',
        image: '/images/leistungen/hero-repair.png',
        cta: 'Rozpocznij zgloszenie',
      },
      {
        id: 'led',
        title: 'Nowoczesna Reklama Swietlna i Serwis LED',
        description: 'Reklama, ktora rzuca sie w oczy. Profesjonalnie naprawiamy moduly LED, zasilacze i neony.',
        image: '/images/leistungen/hero-led-natural.png',
        cta: 'Rozpocznij zgloszenie',
      },
      {
        id: 'maintenance',
        title: 'Konserwacja i Bezproblemowa Praca',
        description: 'Umowy serwisowe dla firm z jednym lub wieloma oddzialami. Planowana konserwacja zamiast awarii.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'Zapytaj o umowe serwisowa',
      },
      {
        id: 'branding',
        title: 'Druk, folie i branding lokalu',
        description: 'Od oznakowania witryn po materialy reklamowe: czytelna obecnosc marki w punkcie firmy.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'Zapytaj o branding',
      },
    ],
    repairTitle: 'Naprawa, diagnostyka i montaz reklam',
    repairIntro:
      'Od pierwszej kontroli wizualnej po naprawe, demontaz lub nowa instalacje: PixelRing ocenia stan reklamy i koordynuje kolejne kroki.',
    repairCards: [
      { id: 'diagnose', intent: 'diagnose', title: 'Diagnostyka i kontrola na miejscu', summary: 'Stan, przyczyna i zakres sa zapisywane w uporzadkowany sposob.', details: 'Sprawdzamy widoczne uszkodzenia, punkty montazu, sygnaly elektryczne i warunki lokalizacji, aby okreslic czy wystarczy ocena zdalna czy potrzebna jest wizyta.' },
      { id: 'lichtwerbung-led', intent: 'lichtwerbung-led', title: 'Elektryka, reklama swietlna i serwis LED', summary: 'Serwis kasetonow, modulow LED, zasilaczy, sterownikow i rur neonowych.', details: 'W instalacjach swietlnych sprawdzamy typowe przyczyny: okablowanie, zasilanie, sterowniki, transformatory, moduly LED lub rury neonowe.' },
      { id: 'konstruktion-befestigung', intent: 'konstruktion-befestigung', title: 'Naprawa konstrukcji i mocowan', summary: 'Ocena ram, podkonstrukcji i punktow mocowania.', details: 'Luźne, uszkodzone lub zuzyte elementy oceniamy z priorytetem naprawy przed planowaniem nowej konstrukcji.' },
      { id: 'reinigung-pflege', intent: 'reinigung-pflege', title: 'Czyszczenie, pielegnacja i odnowa wizualna', summary: 'Poprawa widocznosci i wygladu istniejacych instalacji.', details: 'Dobieramy czyszczenie, pielegnacje lub odnowe wizualna, aby reklama znow wygladala profesjonalnie.' },
      { id: 'montage-demontage', intent: 'montage-demontage', title: 'Montaz, demontaz i przeniesienie', summary: 'Koordynacja dla nowych, istniejacych lub przenoszonych reklam.', details: 'PixelRing koordynuje montaz, demontaz lub zmiane lokalizacji wraz z planem kolejnych krokow i specjalistami.' },
      { id: 'ersatzloesung', intent: 'diagnose', title: 'Najpierw sprawdzenie naprawy - wymiana tylko gdy ma sens', summary: 'Wymiana lub nowa konstrukcja jest rekomendowana tylko gdy naprawa nie jest sensowna.', details: 'Naszym pierwszym celem jest naprawa i sensowne przywrocenie istniejacych reklam. Jesli naprawa nie jest zalecana technicznie lub ekonomicznie, mozemy zaproponowac wymiane albo nowa konstrukcje.' },
    ],
    repairFocus: 'Naszym pierwszym celem jest naprawa i sensowne przywrocenie istniejacych reklam.',
    brandingTitle: 'Produkty drukowane, branding i materialy reklamowe dla lokalizacji firm',
    brandingIntro:
      'PixelRing wspiera firmy takze w biezacym zaopatrzeniu w materialy reklamowe - od danych do druku i projektu po folie, banery, plakaty i branding lokalizacji.',
    brandingCards: [
      { id: 'design', intent: 'druckprodukte-branding', title: 'Projekt i dane do druku', text: 'Przygotowanie, dopasowanie i uzgodnienie plikow do druku oraz materialow lokalizacji.' },
      { id: 'druckprodukte', intent: 'druckprodukte-branding', title: 'Druk i materialy reklamowe', text: 'Plakaty, banery, naklejki, tablice informacyjne i inne materialy do biezacych potrzeb.' },
      { id: 'folierung', intent: 'folierung-beschriftung', title: 'Folie i oznakowanie', text: 'Napisy, folie i widoczne elementy marki dla powierzchni, okien i lokalizacji.' },
      { id: 'filialen', intent: 'druckprodukte-branding', title: 'Zaopatrzenie oddzialow i lokalizacji', text: 'Skoordynowane zaopatrzenie firm z jedna lub wieloma lokalizacjami.' },
    ],
    maintenanceTitle: 'Konserwacja i umowy serwisowe: opieka nad reklama zamiast samodzielnej kontroli',
    maintenanceSubline:
      'W ramach umowy serwisowej PixelRing przejmuje regularne kontrole, konserwacje i opieke nad reklamami oraz materialami reklamowymi.',
    maintenanceBenefits: ['Mniej pracy w codziennym dzialaniu', 'Planowana konserwacja zamiast tylko pilnych napraw', 'Dobre dla oddzialow i wielu lokalizacji', 'Centralna koordynacja instalacji i materialow'],
    maintenanceDiscount: 'Do 20% korzysci na wybrane materialy reklamowe przy aktywnej umowie konserwacyjnej lub serwisowej.',
    serviceContractCta: 'Zapytaj o umowe serwisowa',
    auditCta: 'Zapytaj o audyt lokalizacji',
    processTitle: 'Jak przebiega zgloszenie',
    processSteps: [
      { id: 'send', title: 'Wyslij zgloszenie', text: 'Opisz zadanie i przeslij zdjecia, jesli to pomocne.' },
      { id: 'scope', title: 'Ocena zakresu', text: 'PixelRing sprawdza, czy wystarczy ocena zdalna, czy potrzebna jest wizyta.' },
      { id: 'recommendation', title: 'Otrzymaj rekomendacje', text: 'Rekomendacja moze dotyczyc naprawy, konserwacji, wymiany, druku, montazu lub nowej konstrukcji.' },
      { id: 'offer', title: 'Oferta i akceptacja', text: 'Konkretne uslugi i warunki sa uzgadniane przed zleceniem.' },
      { id: 'execution', title: 'Koordynacja i realizacja', text: 'PixelRing koordynuje realizacje przez zespol specjalistow i kwalifikowanych partnerow.' },
    ],
    intakeNote: 'Twoje dane sa przyjmowane cyfrowo w uporzadkowanej formie.',
    frameTitle: 'Jasne ramy zgloszenia',
    trustPoints: [
      'To nie marketplace: zgloszenie trafia bezposrednio do PixelRing.',
      'Berlin i Brandenburgia jako obszar glowny - inne regiony Niemiec na zapytanie.',
      'Gwarancja do 24 miesiecy, zaleznie od uslugi, materialu i warunkow uzytkowania.',
      'Realizacja przez zespol specjalistow i kwalifikowanych partnerow pod koordynacja PixelRing.',
    ],
    finalHeadline: 'Nie masz pewnosci, czy Twoje zadanie pasuje?',
    finalText: 'Wyslij krotki opis lub zdjecie. PixelRing oceni zakres i wyjasni kolejne sensowne kroki.',
  },
  ar: {
    metaTitle: 'خدمات الإصلاح والصيانة وتقنيات الإعلان | PixelRing',
    metaDescription:
      'تدعم PixelRing الشركات في الإصلاح والتشخيص والتركيب والصيانة والإعلانات المضيئة والهوية التجارية والمواد المطبوعة وعقود الخدمة.',
    heroSlides: [
      {
        id: 'repair',
        title: 'الإصلاح والتشخيص من قبل المحترفين',
        description: 'شريكك في اللوحات الإعلانية في برلين وبراندنبورغ. فحص وتنفيذ من قبل متخصصين.',
        image: '/images/leistungen/hero-repair.png',
        cta: 'ابدأ الطلب',
      },
      {
        id: 'led',
        title: 'الإعلانات المضيئة الحديثة وخدمة LED',
        description: 'إعلانات تجذب الأنظار. نقوم بإصلاح وحدات LED ومزودات الطاقة وأنابيب النيون باحترافية.',
        image: '/images/leistungen/hero-led-natural.png',
        cta: 'ابدأ الطلب',
      },
      {
        id: 'maintenance',
        title: 'الصيانة والتشغيل الخالي من المتاعب',
        description: 'عقود خدمة للشركات ذات موقع واحد أو عدة مواقع. صيانة مخططة بدلاً من حالات الطوارئ.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'اطلب عقد خدمة',
      },
      {
        id: 'branding',
        title: 'طباعة وتغليف وهوية الموقع',
        description: 'من كتابة الواجهات إلى مواد الإعلان: حضور واضح للعلامة داخل موقع عملك.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'اطلب خدمة الهوية',
      },
    ],
    repairTitle: 'إصلاح وتشخيص وتركيب اللوحات الإعلانية',
    repairIntro:
      'من الفحص البصري الأول إلى الإصلاح أو الفك أو التركيب الجديد: تفحص PixelRing حالة اللوحة وتنسق الخطوات التالية المناسبة.',
    repairCards: [
      { id: 'diagnose', intent: 'diagnose', title: 'التشخيص والفحص في الموقع', summary: 'يتم تسجيل الحالة والسبب والنطاق بشكل منظم.', details: 'نفحص الأضرار الظاهرة ونقاط التثبيت والمؤشرات الكهربائية وظروف الموقع لتحديد ما إذا كان التقييم عن بعد كافياً أم أن موعداً في الموقع مناسب.' },
      { id: 'lichtwerbung-led', intent: 'lichtwerbung-led', title: 'الكهرباء والإعلانات المضيئة وخدمة LED', summary: 'خدمة للوحات المضيئة ووحدات LED ومزودات الطاقة ووحدات التحكم وأنابيب النيون.', details: 'في أنظمة الإضاءة نفحص الأسباب الشائعة مثل الأسلاك ومزودات الطاقة ووحدات التحكم والمحولات ووحدات LED أو أنابيب النيون وننسق التنفيذ المتخصص.' },
      { id: 'konstruktion-befestigung', intent: 'konstruktion-befestigung', title: 'إصلاح الهيكل والتثبيت', summary: 'تقييم الحوامل والإطارات والهياكل الفرعية ونقاط التثبيت.', details: 'يتم تقييم الأجزاء المرتخية أو المتضررة أو القديمة مع أولوية الإصلاح قبل التخطيط لهياكل جديدة.' },
      { id: 'reinigung-pflege', intent: 'reinigung-pflege', title: 'التنظيف والعناية والترميم البصري', summary: 'تحسين المظهر والوضوح للمنشآت القائمة.', details: 'نوضح أي تنظيف أو عناية أو ترميم بصري مناسب حتى تبدو اللوحة احترافية مرة أخرى.' },
      { id: 'montage-demontage', intent: 'montage-demontage', title: 'التركيب والفك والنقل', summary: 'تنفيذ منسق للوحات الجديدة أو القائمة أو المنقولة.', details: 'تنسق PixelRing التركيب أو الفك أو تغيير الموقع مع تحديد الخطوات التالية والمتخصصين المطلوبين.' },
      { id: 'ersatzloesung', intent: 'diagnose', title: 'فحص الإصلاح أولاً - الاستبدال فقط عندما يكون منطقياً', summary: 'لا نقترح الاستبدال أو البناء الجديد إلا عندما لا يكون الإصلاح مناسباً.', details: 'تركيزنا الأول هو إصلاح اللوحات القائمة واستعادتها بشكل منطقي. إذا لم يكن الإصلاح موصى به تقنياً أو اقتصادياً، يمكننا تقديم حل بديل أو هيكل جديد مناسب.' },
    ],
    repairFocus: 'تركيزنا الأول هو إصلاح اللوحات القائمة واستعادتها بشكل منطقي.',
    brandingTitle: 'مواد مطبوعة وهوية تجارية ومواد إعلانية لمواقع الأعمال',
    brandingIntro:
      'تدعم PixelRing الشركات أيضاً في الإمداد المستمر بالمواد الإعلانية - من ملفات الطباعة والتصميم إلى الأفلام واللافتات والملصقات وهوية الموقع.',
    brandingCards: [
      { id: 'design', intent: 'druckprodukte-branding', title: 'التصميم وملفات الطباعة', text: 'إعداد وتكييف وتنسيق ملفات الطباعة لمواد الموقع والإعلان.' },
      { id: 'druckprodukte', intent: 'druckprodukte-branding', title: 'منتجات الطباعة والمواد الإعلانية', text: 'ملصقات ولافتات وملصقات لاصقة ولوحات إرشادية ومواد أخرى للاحتياج المستمر.' },
      { id: 'folierung', intent: 'folierung-beschriftung', title: 'الأفلام والكتابة', text: 'كتابات وأفلام وعناصر علامة تجارية مرئية للأسطح والنوافذ والمواقع.' },
      { id: 'filialen', intent: 'druckprodukte-branding', title: 'إمداد الفروع والمواقع', text: 'إمداد منسق للمواد للشركات ذات موقع واحد أو عدة مواقع.' },
    ],
    maintenanceTitle: 'الصيانة وعقود الخدمة: متابعة اللوحات بدلاً من فحصها بنفسك',
    maintenanceSubline:
      'مع عقد خدمة، تتولى PixelRing الفحص المنتظم والصيانة والرعاية للوحاتك وموادك الإعلانية، وهو مفيد خصوصاً للشركات ذات موقع واحد أو عدة مواقع.',
    maintenanceBenefits: ['جهد يومي أقل', 'صيانة مخططة بدلاً من الإصلاح الطارئ فقط', 'مناسب للفروع وعدة مواقع', 'تنسيق مركزي للوحات والمواد'],
    maintenanceDiscount: 'فائدة تصل إلى 20% على مواد إعلانية مختارة عند وجود عقد صيانة أو خدمة قائم.',
    serviceContractCta: 'اطلب عقد خدمة',
    auditCta: 'اطلب فحص موقع',
    processTitle: 'كيف يسير طلبك',
    processSteps: [
      { id: 'send', title: 'إرسال الطلب', text: 'صف المهمة وارفع الصور إذا كان ذلك مفيداً.' },
      { id: 'scope', title: 'فحص النطاق', text: 'تفحص PixelRing ما إذا كان التقييم عن بعد كافياً أو أن موعداً في الموقع مناسب.' },
      { id: 'recommendation', title: 'استلام التوصية', text: 'قد تكون التوصية إصلاحاً أو صيانة أو استبدالاً أو مادة مطبوعة أو تركيباً أو بناءً جديداً.' },
      { id: 'offer', title: 'العرض والموافقة', text: 'يتم الاتفاق على الخدمات والشروط المحددة قبل التكليف.' },
      { id: 'execution', title: 'التنسيق والتنفيذ', text: 'تنسق PixelRing التنفيذ من خلال فريق متخصص وشركاء مؤهلين.' },
    ],
    intakeNote: 'يتم استقبال بياناتك رقمياً بشكل منظم.',
    frameTitle: 'إطار واضح لطلبك',
    trustPoints: [
      'ليست منصة وساطة: يذهب طلبك مباشرة إلى PixelRing.',
      'برلين وبراندنبورغ كمنطقة أساسية - مناطق أخرى في ألمانيا عند الطلب.',
      'ضمان يصل إلى 24 شهراً حسب الخدمة والمواد وشروط الاستخدام.',
      'تنفيذ بواسطة فريق متخصص وشركاء مؤهلين تحت تنسيق PixelRing المركزي.',
    ],
    finalHeadline: 'لست متأكداً إن كانت مهمتك مناسبة؟',
    finalText: 'أرسل وصفاً قصيراً أو صورة. تفحص PixelRing النطاق وتوضح الخطوات المنطقية التالية.',
  },
};

function getContent(locale: string): LeistungenContent {
  return CONTENT[(locale as Locale) in CONTENT ? (locale as Locale) : 'de'];
}

function applyCmsHeroSlide(
  fallback: HeroSlide,
  cmsSlide: LeistungenHeroSlideCmsContent | undefined
): HeroSlide {
  if (!cmsSlide) {
    return fallback;
  }

  return {
    id: cmsSlide.id ?? fallback.id,
    title: cmsSlide.title ?? fallback.title,
    description: cmsSlide.description ?? fallback.description,
    image: cmsSlide.image ?? fallback.image,
    imageAlt: cmsSlide.imageAlt ?? (cmsSlide.title ?? fallback.title),
    fallbackSrc: cmsSlide.fallbackSrc,
    cta: cmsSlide.cta ?? fallback.cta,
  };
}

function mergeCmsContent(
  fallback: LeistungenContent,
  cmsContent: Awaited<ReturnType<typeof getLeistungenPageCmsContent>>
): LeistungenContent {
  if (!cmsContent) {
    return fallback;
  }

  const heroSlides = cmsContent.heroSlides?.length
    ? fallback.heroSlides.map((slide, index) => {
        const matchingSlide = cmsContent.heroSlides?.find((item) => item.id === slide.id);
        const indexedSlide = cmsContent.heroSlides?.[index];
        const cmsSlide = matchingSlide ?? (indexedSlide?.id ? undefined : indexedSlide);
        return applyCmsHeroSlide(slide, cmsSlide);
      })
    : fallback.heroSlides;

  return {
    ...fallback,
    heroSlides,
    repairTitle: cmsContent.repair?.title ?? fallback.repairTitle,
    repairIntro: cmsContent.repair?.description ?? fallback.repairIntro,
    repairCards: cmsContent.repair?.items?.length
      ? fallback.repairCards.map((card, index) => {
          const cmsItem = cmsContent.repair?.items?.[index];
          if (!cmsItem) return card;
          return {
            ...card,
            title: cmsItem.title ?? card.title,
            summary: cmsItem.summary ?? card.summary,
            details: cmsItem.details ?? card.details,
          };
        })
      : fallback.repairCards,
    repairFocus: cmsContent.repair?.focus ?? fallback.repairFocus,
    brandingTitle: cmsContent.branding?.title ?? fallback.brandingTitle,
    brandingIntro: cmsContent.branding?.description ?? fallback.brandingIntro,
    brandingCards: cmsContent.branding?.items?.length
      ? fallback.brandingCards.map((card, index) => {
          const cmsItem = cmsContent.branding?.items?.[index];
          if (!cmsItem) return card;
          return {
            ...card,
            title: cmsItem.title ?? card.title,
            text: cmsItem.text ?? card.text,
          };
        })
      : fallback.brandingCards,
    maintenanceTitle: cmsContent.maintenance?.title ?? fallback.maintenanceTitle,
    maintenanceSubline: cmsContent.maintenance?.description ?? fallback.maintenanceSubline,
    maintenanceBenefits: cmsContent.maintenance?.items ?? fallback.maintenanceBenefits,
    maintenanceDiscount: cmsContent.maintenance?.discount ?? fallback.maintenanceDiscount,
    serviceContractCta: cmsContent.maintenance?.cta ?? fallback.serviceContractCta,
    auditCta: cmsContent.maintenance?.auditCta ?? fallback.auditCta,
    processTitle: cmsContent.process?.title ?? fallback.processTitle,
    processSteps: cmsContent.process?.items?.length
      ? fallback.processSteps.map((step, index) => {
          const cmsItem = cmsContent.process?.items?.[index];
          if (!cmsItem) return step;
          return {
            ...step,
            title: cmsItem.title ?? step.title,
            text: cmsItem.text ?? step.text,
          };
        })
      : fallback.processSteps,
    frameTitle: cmsContent.trust?.title ?? fallback.frameTitle,
    trustPoints: cmsContent.trust?.items ?? fallback.trustPoints,
    finalHeadline: cmsContent.trust?.finalHeadline ?? fallback.finalHeadline,
    finalText: cmsContent.trust?.finalText ?? fallback.finalText,
    repairEnabled: cmsContent.repair?.enabled,
    brandingEnabled: cmsContent.branding?.enabled,
    maintenanceEnabled: cmsContent.maintenance?.enabled,
    processEnabled: cmsContent.process?.enabled,
    trustEnabled: cmsContent.trust?.enabled,
  };
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
      canonical: `/${locale}/leistungen`,
    },
  };
}

export default async function LeistungenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cmsContent = await getLeistungenPageCmsContent(locale);
  const content = mergeCmsContent(getContent(locale), cmsContent);
  const globalCms = await getGlobalPageCmsContent(locale);
  const requestCtaLabel = content.heroSlides[0]?.cta ?? content.serviceContractCta;

  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#15202A]">
      <Header content={globalCms?.header} />
      <main>
        <LeistungenHero slides={content.heroSlides} />

        {content.repairEnabled !== false && (
          <section id="reparatur-diagnose-montage" className="bg-white py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="max-w-4xl">
                <h2 className="text-3xl font-extrabold leading-[1.1] text-[#0E1A2B] sm:text-5xl">{content.repairTitle}</h2>
                <p className="mt-5 text-lg leading-relaxed text-[#4A5568]">{content.repairIntro}</p>
              </div>
              <div className="mt-10 grid gap-4 lg:grid-cols-2">
                {content.repairCards.map((card) => (
                  <details
                    key={card.id}
                    className="group rounded-[22px] border border-[#D9C7BA] bg-[#FFFDF9] p-5 shadow-sm open:border-[#7BA190]"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
                      <div>
                        <h3 className="text-xl font-extrabold leading-[1.1] text-[#0E1A2B]">{card.title}</h3>
                        <span className="mt-2 block text-[15px] leading-6 text-[#66706B]">{card.summary}</span>
                      </div>
                      <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E6F0EC] text-xl font-black text-[#24594D] transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-5 border-t border-[#E7DDD3] pt-5 text-[15px] leading-7 text-[#4E5A5A]">
                      {card.details}
                    </p>
                    <div className="mt-5">
                      <LeistungenRequestButton
                        label={requestCtaLabel}
                        serviceIntent={card.intent}
                        variant="ghost"
                        className="min-h-10 px-4 py-2 text-[14px]"
                      />
                    </div>
                  </details>
                ))}
              </div>
              <p className="mt-8 rounded-[18px] border border-[#7BA190]/45 bg-[#EEF6F2] px-5 py-4 text-[16px] font-bold leading-7 text-[#24594D]">
                {content.repairFocus}
              </p>
            </div>
          </section>
        )}

        {content.brandingEnabled !== false && (
          <section id="druck-branding" className="bg-[#EEF3FB] py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                <div>
                  <h2 className="text-3xl font-extrabold leading-[1.1] text-[#0E1A2B] sm:text-5xl">{content.brandingTitle}</h2>
                  <p className="mt-5 text-lg leading-8 text-[#5D6662]">{content.brandingIntro}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {content.brandingCards.map((card) => (
                    <article key={card.id} className="rounded-[22px] border border-white bg-white p-6 shadow-sm">
                      <h3 className="text-xl font-extrabold leading-[1.1] text-[#0E1A2B]">{card.title}</h3>
                      <p className="mt-3 min-h-[96px] text-[15px] leading-7 text-[#5D6662]">{card.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {content.maintenanceEnabled !== false && (
          <section id="wartung-servicevertraege" className="bg-[#0E1A2B] py-14 text-white sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold leading-[1.1] sm:text-5xl">{content.maintenanceTitle}</h2>
                <p className="mt-5 text-lg leading-8 text-white/75">{content.maintenanceSubline}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <LeistungenRequestButton label={content.serviceContractCta} serviceIntent="wartung-servicevertrag" />
                  <LeistungenRequestButton label={content.auditCta} serviceIntent="wartung-servicevertrag" variant="secondary" />
                </div>
              </div>
              <div className="rounded-[24px] border border-white/[0.12] bg-white/[0.08] p-6">
                <ul className="space-y-4">
                  {content.maintenanceBenefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3 text-[16px] leading-7 text-white/[0.88]">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7BA190] text-sm font-extrabold text-[#0E1A2B]">
                        ✓
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-[18px] border border-[#DAB08A]/45 bg-[#B8643E]/20 px-4 py-4 text-[15px] font-bold leading-7 text-[#FFE6D6]">
                  {content.maintenanceDiscount}
                </p>
              </div>
            </div>
          </section>
        )}

        {content.processEnabled !== false && (
          <section id="ablauf" className="bg-white py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <h2 className="text-3xl font-extrabold leading-[1.1] text-[#0E1A2B] sm:text-5xl">{content.processTitle}</h2>
              <div className="mt-10 grid gap-4 md:grid-cols-5">
                {content.processSteps.map((step, index) => (
                  <article key={step.id} className="rounded-[20px] border border-[#E1D3C6] bg-[#FFFDF9] p-5">
                    <p className="text-sm font-extrabold text-[#B8643E]">{String(index + 1).padStart(2, '0')}</p>
                    <h3 className="mt-4 text-lg font-extrabold leading-[1.1] text-[#0E1A2B]">{step.title}</h3>
                    <p className="mt-3 text-[14px] leading-6 text-[#5D6662]">{step.text}</p>
                  </article>
                ))}
              </div>
              <p className="mt-7 text-[15px] font-bold text-[#24594D]">{content.intakeNote}</p>
            </div>
          </section>
        )}

        {content.trustEnabled !== false && (
          <section id="rahmenbedingungen" className="bg-[#F7F1E8] py-14 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <h2 className="text-3xl font-extrabold leading-[1.1] text-[#0E1A2B] sm:text-5xl">{content.frameTitle}</h2>
              </div>
              <div className="grid gap-4">
                {content.trustPoints.map((point) => (
                  <p key={point} className="rounded-[18px] border border-[#D9C7BA] bg-white px-5 py-4 text-[16px] font-bold leading-7 text-[#3E4A48]">
                    {point}
                  </p>
                ))}
                <div className="rounded-[24px] bg-[#24594D] p-6 text-white">
                  <h2 className="text-2xl font-extrabold leading-[1.1]">{content.finalHeadline}</h2>
                  <p className="mt-3 text-[16px] leading-7 text-white/[0.82]">{content.finalText}</p>
                  <div className="mt-6">
                    <LeistungenRequestButton
                      label={requestCtaLabel}
                      serviceIntent="diagnose"
                      className="min-w-[180px] px-7"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer content={globalCms?.footer} />
    </div>
  );
}
