import type { Metadata } from 'next';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import CmsImage from '@/components/common/CmsImage';
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

type MaintenanceTrack = {
  id: string;
  title: string;
  text: string;
};

type ServiceShowcaseCard = {
  id: string;
  intent: ServiceIntent;
  title: string;
  description: string;
  image: string;
  cta: string;
  details: { label: string; value: string }[];
};

type LeistungenContent = {
  metaTitle: string;
  metaDescription: string;
  heroSlides: HeroSlide[];
  serviceShowcaseTitle: string;
  serviceShowcaseIntro: string;
  serviceShowcaseCards: ServiceShowcaseCard[];
  serviceShowcaseFocus: string;
  repairTitle: string;
  repairIntro: string;
  repairCards: RepairCard[];
  repairFocus: string;
  brandingTitle: string;
  brandingIntro: string;
  brandingCards: SimpleCard[];
  maintenanceTitle: string;
  maintenanceSubline: string;
  maintenanceTracks: MaintenanceTrack[];
  maintenanceBenefits: string[];
  maintenanceDiscount: string;
  maintenanceBoundary: string;
  serviceContractCta: string;
  auditCta: string;
  frameTitle: string;
  trustPoints: string[];
  finalHeadline: string;
  finalText: string;
  repairEnabled?: boolean;
  brandingEnabled?: boolean;
  maintenanceEnabled?: boolean;
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
    metaTitle: 'Leistungen für Reparatur, Wartung & Werbetechnik | PixelRing',
    metaDescription:
      'PixelRing unterstützt Unternehmen bei Reparatur, Diagnose, Montage, Wartung, Lichtwerbung, Branding, Druckprodukten und Servicevertraegen für Werbeanlagen.',
    heroSlides: [
      {
        id: 'repair',
        title: 'Reparatur & Diagnose vom Profi',
        description: 'Ihr Partner für Werbeanlagen in Berlin & Brandenburg. Fachliche Prüfung und Umsetzung durch Spezialisten.',
        image: '/images/leistungen/hero-repair.png',
        cta: 'Service starten',
      },
      {
        id: 'led',
        title: 'Moderne Lichtwerbung & LED-Service',
        description: 'Lichtwerbung, die auffaellt. Wir reparieren LED-Module, Netzteile und Neonröhren fachgerecht.',
        image: '/images/leistungen/hero-led-natural.png',
        cta: 'Service starten',
      },
      {
        id: 'maintenance',
        title: 'Wartung & Sorgenfreier Betrieb',
        description: 'Serviceverträge für Unternehmen mit einem oder mehreren Standorten. Geplante Wartung statt Notfall.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'Service anfragen',
      },
      {
        id: 'branding',
        title: 'Druck, Folierung & Standort-Branding',
        description: 'Von Schaufensterbeschriftung bis Werbematerial: klare Markenwirkung für Ihren Geschäftsstandort.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'Service anfragen',
      },
    ],
    serviceShowcaseTitle: 'Servicebereiche für Werbeanlagen und Standortwerbung',
    serviceShowcaseIntro:
      'PixelRing bündelt Reparatur, Modernisierung, Diagnose, Montage und Werbematerialien in einem geführten Serviceprozess.',
    serviceShowcaseCards: [
      {
        id: 'repair-maintenance',
        intent: 'konstruktion-befestigung',
        title: 'Reparatur & Wartung von Außenwerbung',
        description:
          'Professionelle Instandsetzung von Werbeanlagen, Leuchtwerbung und Außenwerbung. Wir erhalten bestehende Systeme durch gezielte Reparatur, Pflege und visuelle Wiederherstellung.',
        image: '/images/about/service_deep_1.png',
        cta: 'Reparatur anfragen',
        details: [
          { label: 'Konstruktion', value: 'Rahmen, Unterkonstruktionen und Befestigungspunkte' },
          { label: 'Pflege', value: 'Reinigung, Wartung und optische Instandsetzung' },
          { label: 'Ziel', value: 'Bestehende Anlagen sinnvoll erhalten' },
        ],
      },
      {
        id: 'led-modernisierung',
        intent: 'lichtwerbung-led',
        title: 'Modernisierung von Lichtwerbung & LED-Systemen',
        description:
          'Modernisierung und Service für Lichtwerbung, LED-Module, Netzteile, Controller und Neonröhren. Alte Anlagen werden geprüft und technisch sinnvoll aktualisiert.',
        image: '/images/about/service_deep_2.png',
        cta: 'LED-Service anfragen',
        details: [
          { label: 'Technik', value: 'LED-Module, Netzteile, Controller und Neon' },
          { label: 'Prüfung', value: 'Stromversorgung, Verkabelung und typische Ausfallursachen' },
          { label: 'Ergebnis', value: 'Stabilere Beleuchtung und einfachere Wartung' },
        ],
      },
      {
        id: 'audit-diagnose',
        intent: 'diagnose',
        title: 'Inspektion, Audit & Diagnose von Werbeanlagen',
        description:
          'Wir erfassen Zustand, Ursache, Umfang und sichtbare Risiken einer Anlage. Daraus entsteht eine nachvollziehbare Empfehlung für Reparatur, Wartung oder den nächsten Schritt.',
        image: '/images/about/service_deep_3.png',
        cta: 'Diagnose starten',
        details: [
          { label: 'Aufnahme', value: 'Vor-Ort-Prüfung oder strukturierte Ferneinschätzung' },
          { label: 'Check', value: 'Schäden, Montagepunkte, Elektrik und Standortbedingungen' },
          { label: 'Empfehlung', value: 'Klarer Vorschlag für die nächste sinnvolle Maßnahme' },
        ],
      },
      {
        id: 'montage-demontage',
        intent: 'montage-demontage',
        title: 'Montage, Demontage & Versetzung von Werbeanlagen',
        description:
          'Koordination für neue, bestehende oder zu versetzende Werbeanlagen. PixelRing plant die nächsten Schritte und stimmt die benötigten Fachleute ab.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'Montage anfragen',
        details: [
          { label: 'Montage', value: 'Einbau und Befestigung neuer oder bestehender Anlagen' },
          { label: 'Demontage', value: 'Rückbau, Entfernung und Vorbereitung der Fläche' },
          { label: 'Versetzung', value: 'Standortwechsel mit koordinierter Umsetzung' },
        ],
      },
      {
        id: 'druck-branding',
        intent: 'druckprodukte-branding',
        title: 'Druckprodukte, Branding & Werbematerialien',
        description:
          'Laufende Versorgung mit Werbematerialien: von Druckdaten und Gestaltung bis zu Folien, Bannern, Postern, Beschriftungen und Standort-Branding.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'Branding anfragen',
        details: [
          { label: 'Druckdaten', value: 'Aufbereitung, Anpassung und Abstimmung' },
          { label: 'Materialien', value: 'Poster, Banner, Aufkleber und Hinweisschilder' },
          { label: 'Standorte', value: 'Folien, Beschriftungen und Versorgung von Filialen' },
        ],
      },
    ],
    serviceShowcaseFocus:
      'Unser erster Fokus liegt auf der Reparatur und sinnvollen Instandsetzung bestehender Werbeanlagen. Ersatz oder Neubau wird erst empfohlen, wenn Reparatur technisch oder wirtschaftlich nicht sinnvoll ist.',
    repairTitle: 'Reparatur, Diagnose und Montage von Werbeanlagen',
    repairIntro:
      'Von der ersten Sichtprüfung bis zur Reparatur, Demontage oder Neuinstallation: PixelRing prüft den Zustand Ihrer Werbeanlage und koordiniert die passenden nächsten Schritte.',
    repairCards: [
      {
        id: 'diagnose',
        intent: 'diagnose',
        title: 'Diagnose & Vor-Ort-Prüfung',
        summary: 'Zustand, Ursache und Umfang werden strukturiert aufgenommen.',
        details:
          'Wir prüfen sichtbare Schäden, Montagepunkte, elektrische Hinweise und Standortbedingungen. Danach ist klarer, ob eine Ferneinschätzung reicht oder ein Termin vor Ort sinnvoll ist.',
      },
      {
        id: 'lichtwerbung-led',
        intent: 'lichtwerbung-led',
        title: 'Elektrik, Lichtwerbung & LED-Service',
        summary: 'Service für Lichtwerbung, LED-Module, Netzteile, Controller und Neonröhren.',
        details:
          'Bei Leuchtschildern und Lichtanlagen prüfen wir typische Ursachen wie Verkabelung, Stromversorgung, Controller, Transformatoren, LED-Module oder Neonröhren und koordinieren die fachliche Umsetzung.',
      },
      {
        id: 'konstruktion-befestigung',
        intent: 'konstruktion-befestigung',
        title: 'Reparatur von Konstruktion & Befestigung',
        summary: 'Halterungen, Rahmen, Unterkonstruktionen und Befestigungspunkte im Blick.',
        details:
          'Lose, beschädigte oder gealterte Konstruktionsteile werden bewertet. Ziel ist eine sinnvolle Instandsetzung mit klarer Empfehlung, bevor neue Konstruktionen geplant werden.',
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
        summary: 'Koordinierte Umsetzung für neue, bestehende oder zu versetzende Anlagen.',
        details:
          'PixelRing koordiniert Montage, Demontage oder Standortwechsel von Werbeanlagen inklusive Abstimmung der nächsten Schritte und benoetigter Spezialisten.',
      },
      {
        id: 'ersatzloesung',
        intent: 'diagnose',
        title: 'Reparatur prüfen - Ersatzloesung nur wenn sinnvoll',
        summary: 'Ersatz oder Neubau wird erst empfohlen, wenn Reparatur nicht sinnvoll ist.',
        details:
          'Unser erster Fokus liegt auf der Reparatur und sinnvollen Instandsetzung bestehender Werbeanlagen. Sollte eine Reparatur technisch oder wirtschaftlich nicht empfehlenswert sein, koennen wir Ihnen auch eine passende Ersatzloesung oder neue Konstruktion anbieten.',
      },
    ],
    repairFocus:
      'Unser erster Fokus liegt auf der Reparatur und sinnvollen Instandsetzung bestehender Werbeanlagen.',
    brandingTitle: 'Druckprodukte, Branding und Werbematerialien für Geschäftsstandorte',
    brandingIntro:
      'PixelRing unterstützt Unternehmen auch bei der laufenden Versorgung mit Werbematerialien - von Druckdaten und Gestaltung bis zu Folien, Bannern, Postern und Standort-Branding.',
    brandingCards: [
      {
        id: 'design',
        intent: 'druckprodukte-branding',
        title: 'Design & Druckdaten',
        text: 'Aufbereitung, Anpassung und Abstimmung von Druckdaten für Standort- und Werbematerialien.',
      },
      {
        id: 'druckprodukte',
        intent: 'druckprodukte-branding',
        title: 'Druckprodukte & Werbemittel',
        text: 'Poster, Banner, Aufkleber, Hinweisschilder und weitere Materialien für den laufenden Bedarf.',
      },
      {
        id: 'folierung',
        intent: 'folierung-beschriftung',
        title: 'Folierung & Beschriftung',
        text: 'Beschriftungen, Folien und sichtbare Markenelemente für Flächen, Fenster und Standorte.',
      },
      {
        id: 'filialen',
        intent: 'druckprodukte-branding',
        title: 'Versorgung von Filialen & Standorten',
        text: 'Koordinierte Materialversorgung für Unternehmen mit einem oder mehreren Standorten.',
      },
    ],
    maintenanceTitle: 'Wartung & Serviceverträge für sichtbare Standortqualität',
    maintenanceSubline:
      'PixelRing prüft, dokumentiert und betreut Werbeanlagen, Leuchtreklamen und Werbematerialien regelmäßig - damit Defekte, veraltete Materialien oder Sicherheitsrisiken nicht erst durch Kunden auffallen.',
    maintenanceTracks: [
      {
        id: 'check',
        title: 'Standort-Check',
        text: 'Fotos, Zustand der Werbeanlagen, Licht, Folien, Poster, Menüs und sichtbare Schäden werden strukturiert geprüft.',
      },
      {
        id: 'care',
        title: 'Laufende Betreuung',
        text: 'Planbare Prüfungen, Aufgabenliste, Empfehlungen für Reparatur, Pflege und Aktualisierung von Werbematerialien.',
      },
      {
        id: 'network',
        title: 'Für mehrere Standorte',
        text: 'Einheitlicher Überblick über Filialen, Markenbild und Prioritäten: dringend, geplant oder beobachten.',
      },
    ],
    maintenanceBenefits: [
      'Weniger Aufwand im Tagesgeschäft',
      'Geplante Wartung statt nur reaktiver Notfallreparatur',
      'Geeignet für Filialen und mehrere Standorte',
      'Zentrale Koordination für Anlagen und Werbematerialien',
    ],
    maintenanceDiscount:
      'Bis zu 20% Vorteil auf ausgewählte Werbematerialien bei bestehendem Wartungs- oder Servicevertrag.',
    maintenanceBoundary:
      'Der Servicevertrag ersetzt keinen unbegrenzten Reparaturvertrag. Größere Reparaturen, Ersatzteile, Höhenarbeiten und Sonderfälle werden separat geprüft und abgestimmt.',
    serviceContractCta: 'Servicevertrag besprechen',
    auditCta: 'Standort-Audit anfragen',
    frameTitle: 'Klarer Rahmen für Ihre Anfrage',
    trustPoints: [
      'Keine Vermittlungsplattform: Ihre Anfrage geht direkt an PixelRing.',
      'Berlin & Brandenburg als Kerngebiet - weitere Regionen in Deutschland auf Anfrage.',
      'Garantie bis zu 24 Monate, abhaengig von Leistung, Material und Einsatzbedingungen.',
      'Umsetzung durch Fachteam und qualifizierte Partner unter zentraler PixelRing-Koordination.',
    ],
    finalHeadline: 'Nicht sicher, ob Ihre Aufgabe passt?',
    finalText:
      'Senden Sie uns eine kurze Beschreibung oder ein Foto. PixelRing prüft den Umfang und klaert die nächsten sinnvollen Schritte.',
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
        cta: 'Start service',
      },
      {
        id: 'led',
        title: 'Modern Lighting & LED Service',
        description: 'Signage that stands out. We repair LED modules, power supplies and neon tubes professionally.',
        image: '/images/leistungen/hero-led-natural.png',
        cta: 'Start service',
      },
      {
        id: 'maintenance',
        title: 'Maintenance & Worry-Free Operation',
        description: 'Service contracts for companies with one or more locations. Planned maintenance instead of emergency.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'Request service',
      },
      {
        id: 'branding',
        title: 'Print, Vinyl & Location Branding',
        description: 'From storefront lettering to marketing materials: clear brand presence for your business location.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'Request service',
      },
    ],
    serviceShowcaseTitle: 'Service areas for signage and location branding',
    serviceShowcaseIntro:
      'PixelRing combines repair, modernization, diagnostics, installation and advertising materials in one guided service process.',
    serviceShowcaseCards: [
      {
        id: 'repair-maintenance',
        intent: 'konstruktion-befestigung',
        title: 'Outdoor advertising repair & maintenance',
        description:
          'Professional repair of signage, illuminated advertising and outdoor advertising systems. We preserve existing installations through targeted repair, care and visual restoration.',
        image: '/images/about/service_deep_1.png',
        cta: 'Request repair',
        details: [
          { label: 'Structure', value: 'Frames, substructures and fixing points' },
          { label: 'Care', value: 'Cleaning, maintenance and visual restoration' },
          { label: 'Goal', value: 'Keep existing installations in useful service' },
        ],
      },
      {
        id: 'led-modernisierung',
        intent: 'lichtwerbung-led',
        title: 'Illuminated signage modernization & LED systems',
        description:
          'Modernization and service for illuminated signage, LED modules, power supplies, controllers and neon tubes. Older systems are checked and updated where it makes technical sense.',
        image: '/images/about/service_deep_2.png',
        cta: 'Request LED service',
        details: [
          { label: 'Technology', value: 'LED modules, power supplies, controllers and neon' },
          { label: 'Inspection', value: 'Power, wiring and typical failure causes' },
          { label: 'Result', value: 'More stable lighting and easier maintenance' },
        ],
      },
      {
        id: 'audit-diagnose',
        intent: 'diagnose',
        title: 'Inspection, audit & diagnostics for signage',
        description:
          'We record condition, cause, scope and visible risks. The result is a clear recommendation for repair, maintenance or the next sensible step.',
        image: '/images/about/service_deep_3.png',
        cta: 'Start diagnostics',
        details: [
          { label: 'Intake', value: 'On-site inspection or structured remote assessment' },
          { label: 'Check', value: 'Damage, mounting points, electrics and site conditions' },
          { label: 'Recommendation', value: 'A clear proposal for the next useful measure' },
        ],
      },
      {
        id: 'montage-demontage',
        intent: 'montage-demontage',
        title: 'Installation, dismantling & relocation of signage',
        description:
          'Coordination for new, existing or relocated signage. PixelRing plans the next steps and coordinates the required specialists.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'Request installation',
        details: [
          { label: 'Installation', value: 'Mounting and fixing new or existing systems' },
          { label: 'Dismantling', value: 'Removal, takedown and surface preparation' },
          { label: 'Relocation', value: 'Site changes with coordinated execution' },
        ],
      },
      {
        id: 'druck-branding',
        intent: 'druckprodukte-branding',
        title: 'Print products, branding & advertising materials',
        description:
          'Ongoing advertising material support: from artwork and print data to vinyl, banners, posters, lettering and location branding.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'Request branding',
        details: [
          { label: 'Print data', value: 'Preparation, adaptation and coordination' },
          { label: 'Materials', value: 'Posters, banners, stickers and information signs' },
          { label: 'Locations', value: 'Vinyl, lettering and branch material supply' },
        ],
      },
    ],
    serviceShowcaseFocus:
      'Our first focus is repair and sensible restoration of existing signage. Replacement or new construction is recommended only when repair is not technically or economically sensible.',
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
      'PixelRing regularly checks, documents and supports signage, illuminated advertising and advertising materials so defects, outdated materials or safety risks are noticed before customers point them out.',
    maintenanceTracks: [
      {
        id: 'check',
        title: 'Location check',
        text: 'Photos, signage condition, lighting, films, posters, menus and visible damage are reviewed in a structured way.',
      },
      {
        id: 'care',
        title: 'Ongoing care',
        text: 'Planned checks, task lists and recommendations for repair, care and material updates.',
      },
      {
        id: 'network',
        title: 'For multiple locations',
        text: 'One overview across branches, brand appearance and priorities: urgent, planned or observe.',
      },
    ],
    maintenanceBenefits: ['Less day-to-day effort', 'Planned maintenance instead of only reactive emergency repair', 'Suitable for branches and multiple locations', 'Central coordination for signage and materials'],
    maintenanceDiscount: 'Up to 20% benefit on selected advertising materials with an active maintenance or service contract.',
    maintenanceBoundary:
      'A service contract does not replace an unlimited repair contract. Larger repairs, spare parts, height work and special cases are checked and agreed separately.',
    serviceContractCta: 'Discuss service contract',
    auditCta: 'Request location audit',
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
        cta: 'Запустить сервис',
      },
      {
        id: 'led',
        title: 'Современная световая реклама и LED-сервис',
        description: 'Реклама, которую замечают. Профессиональный ремонт LED-модулей, блоков питания и неона.',
        image: '/images/leistungen/hero-led-natural.png',
        cta: 'Запустить сервис',
      },
      {
        id: 'maintenance',
        title: 'Обслуживание и работа без забот',
        description: 'Сервисные договоры для компаний с одним или несколькими филиалами. Плановое обслуживание вместо аварий.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'Запросить сервис',
      },
      {
        id: 'branding',
        title: 'Печать, пленка и брендинг точки',
        description: 'От оформления витрин до рекламных материалов: понятное присутствие бренда в вашем помещении.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'Запросить сервис',
      },
    ],
    serviceShowcaseTitle: 'Сервисные направления для рекламных установок и брендинга локаций',
    serviceShowcaseIntro:
      'PixelRing объединяет ремонт, модернизацию, диагностику, монтаж и рекламные материалы в одном управляемом сервисном процессе.',
    serviceShowcaseCards: [
      {
        id: 'repair-maintenance',
        intent: 'konstruktion-befestigung',
        title: 'Ремонт и обслуживание наружной рекламы',
        description:
          'Профессиональное восстановление вывесок, световой рекламы и наружных рекламных конструкций. Мы сохраняем существующие системы через точечный ремонт, уход и визуальное восстановление.',
        image: '/images/about/service_deep_1.png',
        cta: 'Запросить ремонт',
        details: [
          { label: 'Конструкция', value: 'Рамы, подконструкции и точки крепления' },
          { label: 'Уход', value: 'Очистка, обслуживание и визуальное восстановление' },
          { label: 'Цель', value: 'Разумно сохранить существующие установки' },
        ],
      },
      {
        id: 'led-modernisierung',
        intent: 'lichtwerbung-led',
        title: 'Модернизация световой рекламы и LED-систем',
        description:
          'Модернизация и сервис световых вывесок, LED-модулей, блоков питания, контроллеров и неона. Старые системы проверяются и технически разумно обновляются.',
        image: '/images/about/service_deep_2.png',
        cta: 'Запросить LED-сервис',
        details: [
          { label: 'Техника', value: 'LED-модули, блоки питания, контроллеры и неон' },
          { label: 'Проверка', value: 'Питание, проводка и типовые причины отказа' },
          { label: 'Результат', value: 'Более стабильная подсветка и проще обслуживание' },
        ],
      },
      {
        id: 'audit-diagnose',
        intent: 'diagnose',
        title: 'Инспекция, аудит и диагностика рекламных установок',
        description:
          'Фиксируем состояние, причину, объем задачи и видимые риски. По итогам даем понятную рекомендацию по ремонту, обслуживанию или следующему разумному шагу.',
        image: '/images/about/service_deep_3.png',
        cta: 'Начать диагностику',
        details: [
          { label: 'Формат', value: 'Выездная проверка или структурированная оценка по материалам' },
          { label: 'Проверка', value: 'Повреждения, крепления, электрика и условия локации' },
          { label: 'Рекомендация', value: 'Понятное предложение по следующей мере' },
        ],
      },
      {
        id: 'montage-demontage',
        intent: 'montage-demontage',
        title: 'Монтаж, демонтаж и перенос рекламных конструкций',
        description:
          'Координация работ для новых, существующих или переносимых рекламных конструкций. PixelRing планирует следующие шаги и согласует нужных специалистов.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'Запросить монтаж',
        details: [
          { label: 'Монтаж', value: 'Установка и крепление новых или существующих конструкций' },
          { label: 'Демонтаж', value: 'Снятие, удаление и подготовка поверхности' },
          { label: 'Перенос', value: 'Смена локации с координацией выполнения' },
        ],
      },
      {
        id: 'druck-branding',
        intent: 'druckprodukte-branding',
        title: 'Печатная продукция, брендинг и рекламные материалы',
        description:
          'Текущая поддержка рекламных материалов: от макетов и печатных данных до пленок, баннеров, постеров, надписей и брендинга локаций.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'Запросить брендинг',
        details: [
          { label: 'Печатные данные', value: 'Подготовка, адаптация и согласование' },
          { label: 'Материалы', value: 'Постеры, баннеры, наклейки и информационные таблички' },
          { label: 'Локации', value: 'Пленки, надписи и снабжение филиалов' },
        ],
      },
    ],
    serviceShowcaseFocus:
      'Наш первый фокус - ремонт и разумное восстановление существующих рекламных конструкций. Замена или новая конструкция предлагается только когда ремонт технически или экономически неразумен.',
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
      'PixelRing регулярно проверяет, документирует и сопровождает рекламные конструкции, световую рекламу и рекламные материалы, чтобы дефекты, устаревшие материалы или риски безопасности не замечали первыми ваши клиенты.',
    maintenanceTracks: [
      {
        id: 'check',
        title: 'Проверка объекта',
        text: 'Фото, состояние вывесок, свет, пленки, постеры, меню и видимые повреждения проверяются по структуре.',
      },
      {
        id: 'care',
        title: 'Постоянное сопровождение',
        text: 'Плановые проверки, список задач и рекомендации по ремонту, уходу и обновлению рекламных материалов.',
      },
      {
        id: 'network',
        title: 'Для нескольких объектов',
        text: 'Единый обзор по филиалам, внешнему виду бренда и приоритетам: срочно, планово или наблюдать.',
      },
    ],
    maintenanceBenefits: ['Меньше ежедневной нагрузки', 'Плановое обслуживание вместо только срочного ремонта', 'Подходит для филиалов и нескольких локаций', 'Центральная координация конструкций и материалов'],
    maintenanceDiscount: 'До 20% выгоды на выбранные рекламные материалы при действующем договоре обслуживания или сервиса.',
    maintenanceBoundary:
      'Сервисный договор не заменяет безлимитный договор на ремонт. Крупные ремонты, запчасти, высотные работы и особые случаи проверяются и согласуются отдельно.',
    serviceContractCta: 'Обсудить сервисный договор',
    auditCta: 'Запросить аудит объекта',
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
        cta: 'Servisi başlat',
      },
      {
        id: 'led',
        title: 'Modern Isikli Reklam ve LED Servisi',
        description: 'Dikkat ceken reklamlar. LED modulleri, guc kaynaklari ve neon tuplerini profesyonelce onariyoruz.',
        image: '/images/leistungen/hero-led-natural.png',
        cta: 'Servisi başlat',
      },
      {
        id: 'maintenance',
        title: 'Bakim ve Sorunsuz Operasyon',
        description: 'Bir veya birden fazla lokasyonu olan isletmeler icin servis sozlesmeleri. Acil durum yerine planli bakim.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'Servis talep et',
      },
      {
        id: 'branding',
        title: 'Baski, Folyo & Mekan Markalama',
        description: 'Vitrin yazilarindan reklam malzemelerine kadar isletme noktaniz icin net marka gorunurlugu.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'Servis talep et',
      },
    ],
    serviceShowcaseTitle: 'Reklam sistemleri ve lokasyon markalama servis alanları',
    serviceShowcaseIntro:
      'PixelRing onarım, modernizasyon, teşhis, montaj ve reklam materyallerini tek yönetilen servis sürecinde birleştirir.',
    serviceShowcaseCards: [
      {
        id: 'repair-maintenance',
        intent: 'konstruktion-befestigung',
        title: 'Dış reklam onarımı ve bakımı',
        description:
          'Tabela, ışıklı reklam ve dış reklam sistemlerinin profesyonel onarımı. Mevcut sistemleri hedefli onarım, bakım ve görsel yenileme ile koruruz.',
        image: '/images/about/service_deep_1.png',
        cta: 'Onarım talep et',
        details: [
          { label: 'Konstrüksiyon', value: 'Çerçeveler, alt yapılar ve sabitleme noktaları' },
          { label: 'Bakım', value: 'Temizlik, servis ve görsel yenileme' },
          { label: 'Hedef', value: 'Mevcut sistemleri mantıklı şekilde korumak' },
        ],
      },
      {
        id: 'led-modernisierung',
        intent: 'lichtwerbung-led',
        title: 'Işıklı reklam ve LED sistem modernizasyonu',
        description:
          'Işıklı tabelalar, LED modüller, güç kaynakları, kontrol cihazları ve neon için modernizasyon ve servis. Eski sistemler kontrol edilir ve teknik olarak mantıklıysa güncellenir.',
        image: '/images/about/service_deep_2.png',
        cta: 'LED servisi talep et',
        details: [
          { label: 'Teknik', value: 'LED modüller, güç kaynakları, kontrol cihazları ve neon' },
          { label: 'Kontrol', value: 'Güç, kablolama ve tipik arıza nedenleri' },
          { label: 'Sonuç', value: 'Daha stabil aydınlatma ve daha kolay bakım' },
        ],
      },
      {
        id: 'audit-diagnose',
        intent: 'diagnose',
        title: 'Reklam sistemleri için inspeksiyon, denetim ve teşhis',
        description:
          'Durumu, nedeni, kapsamı ve görünür riskleri kayda alırız. Sonuç; onarım, bakım veya sonraki mantıklı adım için anlaşılır bir öneridir.',
        image: '/images/about/service_deep_3.png',
        cta: 'Teşhisi başlat',
        details: [
          { label: 'Format', value: 'Yerinde kontrol veya yapılandırılmış uzaktan değerlendirme' },
          { label: 'Kontrol', value: 'Hasarlar, bağlantılar, elektrik ve lokasyon koşulları' },
          { label: 'Öneri', value: 'Sonraki mantıklı işlem için net teklif' },
        ],
      },
      {
        id: 'montage-demontage',
        intent: 'montage-demontage',
        title: 'Reklam sistemlerinin montajı, demontajı ve taşınması',
        description:
          'Yeni, mevcut veya taşınacak reklam sistemleri için koordinasyon. PixelRing sonraki adımları planlar ve gerekli uzmanları koordine eder.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'Montaj talep et',
        details: [
          { label: 'Montaj', value: 'Yeni veya mevcut sistemlerin kurulumu ve sabitlenmesi' },
          { label: 'Demontaj', value: 'Söküm, kaldırma ve yüzey hazırlığı' },
          { label: 'Taşıma', value: 'Koordineli uygulamayla lokasyon değişimi' },
        ],
      },
      {
        id: 'druck-branding',
        intent: 'druckprodukte-branding',
        title: 'Baskı ürünleri, markalama ve reklam materyalleri',
        description:
          'Sürekli reklam materyali desteği: tasarım ve baskı dosyalarından folyo, banner, poster, yazılama ve lokasyon markalamasına kadar.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'Markalama talep et',
        details: [
          { label: 'Baskı verisi', value: 'Hazırlama, uyarlama ve koordinasyon' },
          { label: 'Materyaller', value: 'Poster, banner, sticker ve bilgilendirme levhaları' },
          { label: 'Lokasyonlar', value: 'Folyo, yazılama ve şube materyali tedariki' },
        ],
      },
    ],
    serviceShowcaseFocus:
      'İlk odağımız mevcut reklam sistemlerinin onarımı ve mantıklı şekilde yeniden kullanılmasıdır. Değişim veya yeni yapım yalnızca onarım teknik ya da ekonomik olarak mantıklı değilse önerilir.',
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
      'PixelRing reklam sistemlerini, ışıklı reklamları ve reklam materyallerini düzenli olarak kontrol eder, belgeler ve destekler; böylece arızalar, eski materyaller veya güvenlik riskleri önce müşteriler tarafından fark edilmez.',
    maintenanceTracks: [
      {
        id: 'check',
        title: 'Lokasyon kontrolü',
        text: 'Fotoğraflar, tabela durumu, ışık, folyolar, posterler, menüler ve görünür hasarlar yapılandırılmış şekilde incelenir.',
      },
      {
        id: 'care',
        title: 'Sürekli destek',
        text: 'Planlı kontroller, görev listeleri ve onarım, bakım ve materyal güncelleme önerileri.',
      },
      {
        id: 'network',
        title: 'Birden fazla lokasyon için',
        text: 'Şubeler, marka görünümü ve öncelikler için tek genel bakış: acil, planlı veya izlenecek.',
      },
    ],
    maintenanceBenefits: ['Gunluk operasyonda daha az efor', 'Sadece acil onarim yerine planli bakim', 'Subeler ve birden fazla lokasyon icin uygun', 'Sistemler ve materyaller icin merkezi koordinasyon'],
    maintenanceDiscount: 'Mevcut bakim veya servis sozlesmesiyle secili reklam materyallerinde %20ye kadar avantaj.',
    maintenanceBoundary:
      'Servis sözleşmesi sınırsız onarım sözleşmesinin yerine geçmez. Büyük onarımlar, yedek parçalar, yüksekte çalışma ve özel durumlar ayrıca kontrol edilir ve kararlaştırılır.',
    serviceContractCta: 'Servis sözleşmesini görüş',
    auditCta: 'Lokasyon denetimi talep et',
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
        cta: 'Rozpocznij serwis',
      },
      {
        id: 'led',
        title: 'Nowoczesna Reklama Swietlna i Serwis LED',
        description: 'Reklama, ktora rzuca sie w oczy. Profesjonalnie naprawiamy moduly LED, zasilacze i neony.',
        image: '/images/leistungen/hero-led-natural.png',
        cta: 'Rozpocznij serwis',
      },
      {
        id: 'maintenance',
        title: 'Konserwacja i Bezproblemowa Praca',
        description: 'Umowy serwisowe dla firm z jednym lub wieloma oddzialami. Planowana konserwacja zamiast awarii.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'Zapytaj o serwis',
      },
      {
        id: 'branding',
        title: 'Druk, folie i branding lokalu',
        description: 'Od oznakowania witryn po materialy reklamowe: czytelna obecnosc marki w punkcie firmy.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'Zapytaj o serwis',
      },
    ],
    serviceShowcaseTitle: 'Obszary usług dla reklam i brandingu lokalizacji',
    serviceShowcaseIntro:
      'PixelRing łączy naprawę, modernizację, diagnostykę, montaż i materiały reklamowe w jednym prowadzonym procesie serwisowym.',
    serviceShowcaseCards: [
      {
        id: 'repair-maintenance',
        intent: 'konstruktion-befestigung',
        title: 'Naprawa i obsługa reklamy zewnętrznej',
        description:
          'Profesjonalna naprawa szyldów, reklamy świetlnej i zewnętrznych konstrukcji reklamowych. Utrzymujemy istniejące systemy przez celowaną naprawę, pielęgnację i odnowę wizualną.',
        image: '/images/about/service_deep_1.png',
        cta: 'Zapytaj o naprawę',
        details: [
          { label: 'Konstrukcja', value: 'Ramy, podkonstrukcje i punkty mocowania' },
          { label: 'Pielęgnacja', value: 'Czyszczenie, serwis i odnowa wizualna' },
          { label: 'Cel', value: 'Sensowne utrzymanie istniejących instalacji' },
        ],
      },
      {
        id: 'led-modernisierung',
        intent: 'lichtwerbung-led',
        title: 'Modernizacja reklamy świetlnej i systemów LED',
        description:
          'Modernizacja i serwis szyldów świetlnych, modułów LED, zasilaczy, sterowników i neonów. Starsze systemy są sprawdzane i aktualizowane tam, gdzie ma to sens techniczny.',
        image: '/images/about/service_deep_2.png',
        cta: 'Zapytaj o serwis LED',
        details: [
          { label: 'Technika', value: 'Moduły LED, zasilacze, sterowniki i neony' },
          { label: 'Kontrola', value: 'Zasilanie, okablowanie i typowe przyczyny awarii' },
          { label: 'Efekt', value: 'Stabilniejsze oświetlenie i łatwiejsza obsługa' },
        ],
      },
      {
        id: 'audit-diagnose',
        intent: 'diagnose',
        title: 'Inspekcja, audyt i diagnostyka instalacji reklamowych',
        description:
          'Rejestrujemy stan, przyczynę, zakres zadania i widoczne ryzyka. Wynikiem jest czytelna rekomendacja naprawy, konserwacji lub kolejnego sensownego kroku.',
        image: '/images/about/service_deep_3.png',
        cta: 'Rozpocznij diagnostykę',
        details: [
          { label: 'Forma', value: 'Kontrola na miejscu albo uporządkowana ocena zdalna' },
          { label: 'Kontrola', value: 'Uszkodzenia, mocowania, elektryka i warunki lokalizacji' },
          { label: 'Rekomendacja', value: 'Jasna propozycja następnego działania' },
        ],
      },
      {
        id: 'montage-demontage',
        intent: 'montage-demontage',
        title: 'Montaż, demontaż i przeniesienie reklam',
        description:
          'Koordynacja prac dla nowych, istniejących lub przenoszonych instalacji reklamowych. PixelRing planuje kolejne kroki i uzgadnia potrzebnych specjalistów.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'Zapytaj o montaż',
        details: [
          { label: 'Montaż', value: 'Instalacja i mocowanie nowych lub istniejących systemów' },
          { label: 'Demontaż', value: 'Zdjęcie, usunięcie i przygotowanie powierzchni' },
          { label: 'Przeniesienie', value: 'Zmiana lokalizacji ze skoordynowaną realizacją' },
        ],
      },
      {
        id: 'druck-branding',
        intent: 'druckprodukte-branding',
        title: 'Druk, branding i materiały reklamowe',
        description:
          'Bieżące wsparcie materiałów reklamowych: od projektów i danych do druku po folie, banery, plakaty, oznakowanie i branding lokalizacji.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'Zapytaj o branding',
        details: [
          { label: 'Dane do druku', value: 'Przygotowanie, dopasowanie i koordynacja' },
          { label: 'Materiały', value: 'Plakaty, banery, naklejki i tablice informacyjne' },
          { label: 'Lokalizacje', value: 'Folie, oznakowanie i zaopatrzenie oddziałów' },
        ],
      },
    ],
    serviceShowcaseFocus:
      'Naszym pierwszym celem jest naprawa i sensowne przywrócenie istniejących reklam. Wymiana lub nowa konstrukcja jest rekomendowana tylko wtedy, gdy naprawa nie ma sensu technicznie albo ekonomicznie.',
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
      'PixelRing regularnie sprawdza, dokumentuje i obsługuje reklamy, reklamy świetlne oraz materiały reklamowe, aby usterki, stare materiały lub ryzyka bezpieczeństwa nie zostały zauważone najpierw przez klientów.',
    maintenanceTracks: [
      {
        id: 'check',
        title: 'Kontrola lokalizacji',
        text: 'Zdjęcia, stan reklam, światło, folie, plakaty, menu i widoczne uszkodzenia są sprawdzane w uporządkowany sposób.',
      },
      {
        id: 'care',
        title: 'Stała opieka',
        text: 'Planowane kontrole, lista zadań oraz rekomendacje dotyczące naprawy, pielęgnacji i aktualizacji materiałów.',
      },
      {
        id: 'network',
        title: 'Dla wielu lokalizacji',
        text: 'Jeden przegląd oddziałów, wyglądu marki i priorytetów: pilne, planowane albo do obserwacji.',
      },
    ],
    maintenanceBenefits: ['Mniej pracy w codziennym dzialaniu', 'Planowana konserwacja zamiast tylko pilnych napraw', 'Dobre dla oddzialow i wielu lokalizacji', 'Centralna koordynacja instalacji i materialow'],
    maintenanceDiscount: 'Do 20% korzysci na wybrane materialy reklamowe przy aktywnej umowie konserwacyjnej lub serwisowej.',
    maintenanceBoundary:
      'Umowa serwisowa nie zastępuje nielimitowanej umowy naprawczej. Większe naprawy, części zamienne, prace wysokościowe i przypadki specjalne są sprawdzane i uzgadniane osobno.',
    serviceContractCta: 'Omów umowę serwisową',
    auditCta: 'Zapytaj o audyt lokalizacji',
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
        cta: 'ابدأ الخدمة',
      },
      {
        id: 'led',
        title: 'الإعلانات المضيئة الحديثة وخدمة LED',
        description: 'إعلانات تجذب الأنظار. نقوم بإصلاح وحدات LED ومزودات الطاقة وأنابيب النيون باحترافية.',
        image: '/images/leistungen/hero-led-natural.png',
        cta: 'ابدأ الخدمة',
      },
      {
        id: 'maintenance',
        title: 'الصيانة والتشغيل الخالي من المتاعب',
        description: 'عقود خدمة للشركات ذات موقع واحد أو عدة مواقع. صيانة مخططة بدلاً من حالات الطوارئ.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'اطلب الخدمة',
      },
      {
        id: 'branding',
        title: 'طباعة وتغليف وهوية الموقع',
        description: 'من كتابة الواجهات إلى مواد الإعلان: حضور واضح للعلامة داخل موقع عملك.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'اطلب الخدمة',
      },
    ],
    serviceShowcaseTitle: 'مجالات الخدمة للافتات وهوية المواقع',
    serviceShowcaseIntro:
      'تجمع PixelRing الإصلاح والتحديث والتشخيص والتركيب ومواد الإعلان في مسار خدمة واحد واضح.',
    serviceShowcaseCards: [
      {
        id: 'repair-maintenance',
        intent: 'konstruktion-befestigung',
        title: 'إصلاح وصيانة الإعلانات الخارجية',
        description:
          'إصلاح احترافي للافتات والإعلانات المضيئة والهياكل الإعلانية الخارجية. نحافظ على الأنظمة القائمة عبر إصلاح موجه وعناية وترميم بصري.',
        image: '/images/about/service_deep_1.png',
        cta: 'اطلب الإصلاح',
        details: [
          { label: 'الهيكل', value: 'الإطارات والهياكل الفرعية ونقاط التثبيت' },
          { label: 'العناية', value: 'التنظيف والصيانة والترميم البصري' },
          { label: 'الهدف', value: 'الحفاظ المنطقي على المنشآت القائمة' },
        ],
      },
      {
        id: 'led-modernisierung',
        intent: 'lichtwerbung-led',
        title: 'تحديث الإعلانات المضيئة وأنظمة LED',
        description:
          'تحديث وخدمة للافتات المضيئة ووحدات LED ومزودات الطاقة ووحدات التحكم والنيون. يتم فحص الأنظمة القديمة وتحديثها عندما يكون ذلك منطقياً تقنياً.',
        image: '/images/about/service_deep_2.png',
        cta: 'اطلب خدمة LED',
        details: [
          { label: 'التقنية', value: 'وحدات LED ومزودات الطاقة ووحدات التحكم والنيون' },
          { label: 'الفحص', value: 'الطاقة والأسلاك والأسباب الشائعة للأعطال' },
          { label: 'النتيجة', value: 'إضاءة أكثر ثباتاً وصيانة أسهل' },
        ],
      },
      {
        id: 'audit-diagnose',
        intent: 'diagnose',
        title: 'فحص وتدقيق وتشخيص المنشآت الإعلانية',
        description:
          'نسجل الحالة والسبب ونطاق المهمة والمخاطر الظاهرة. والنتيجة توصية واضحة للإصلاح أو الصيانة أو الخطوة المنطقية التالية.',
        image: '/images/about/service_deep_3.png',
        cta: 'ابدأ التشخيص',
        details: [
          { label: 'الشكل', value: 'فحص في الموقع أو تقييم منظم عن بعد' },
          { label: 'الفحص', value: 'الأضرار والتثبيت والكهرباء وظروف الموقع' },
          { label: 'التوصية', value: 'اقتراح واضح للإجراء التالي المناسب' },
        ],
      },
      {
        id: 'montage-demontage',
        intent: 'montage-demontage',
        title: 'تركيب وفك ونقل الهياكل الإعلانية',
        description:
          'تنسيق الأعمال للمنشآت الإعلانية الجديدة أو القائمة أو المنقولة. تخطط PixelRing للخطوات التالية وتنسق المتخصصين المطلوبين.',
        image: '/images/leistungen/hero-maintenance.png',
        cta: 'اطلب التركيب',
        details: [
          { label: 'التركيب', value: 'تركيب وتثبيت الأنظمة الجديدة أو القائمة' },
          { label: 'الفك', value: 'الإزالة والتفكيك وتحضير السطح' },
          { label: 'النقل', value: 'تغيير الموقع مع تنفيذ منسق' },
        ],
      },
      {
        id: 'druck-branding',
        intent: 'druckprodukte-branding',
        title: 'مواد مطبوعة وهوية تجارية ومواد إعلانية',
        description:
          'دعم مستمر لمواد الإعلان: من التصميم وملفات الطباعة إلى الفينيل واللافتات والملصقات والكتابة وهوية الموقع.',
        image: '/images/leistungen/hero-branding.png',
        cta: 'اطلب الهوية التجارية',
        details: [
          { label: 'ملفات الطباعة', value: 'الإعداد والتكييف والتنسيق' },
          { label: 'المواد', value: 'ملصقات ولافتات وملصقات لاصقة ولوحات إرشادية' },
          { label: 'المواقع', value: 'فينيل وكتابات وإمداد مواد للفروع' },
        ],
      },
    ],
    serviceShowcaseFocus:
      'تركيزنا الأول هو إصلاح اللوحات القائمة واستعادتها بشكل منطقي. لا نقترح الاستبدال أو البناء الجديد إلا عندما لا يكون الإصلاح منطقياً تقنياً أو اقتصادياً.',
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
      'تقوم PixelRing بفحص وتوثيق ومتابعة اللوحات والإعلانات المضيئة والمواد الإعلانية بانتظام، حتى لا تكون الأعطال أو المواد القديمة أو مخاطر السلامة أول ما يلاحظه العملاء.',
    maintenanceTracks: [
      {
        id: 'check',
        title: 'فحص الموقع',
        text: 'تتم مراجعة الصور وحالة اللوحات والإضاءة والأفلام والملصقات والقوائم والأضرار الظاهرة بشكل منظم.',
      },
      {
        id: 'care',
        title: 'متابعة مستمرة',
        text: 'فحوصات مخططة، قائمة مهام وتوصيات للإصلاح والعناية وتحديث المواد الإعلانية.',
      },
      {
        id: 'network',
        title: 'لعدة مواقع',
        text: 'نظرة موحدة على الفروع وصورة العلامة والأولويات: عاجل أو مخطط أو للمراقبة.',
      },
    ],
    maintenanceBenefits: ['جهد يومي أقل', 'صيانة مخططة بدلاً من الإصلاح الطارئ فقط', 'مناسب للفروع وعدة مواقع', 'تنسيق مركزي للوحات والمواد'],
    maintenanceDiscount: 'فائدة تصل إلى 20% على مواد إعلانية مختارة عند وجود عقد صيانة أو خدمة قائم.',
    maintenanceBoundary:
      'عقد الخدمة لا يحل محل عقد إصلاح غير محدود. يتم فحص الإصلاحات الكبيرة وقطع الغيار والعمل على ارتفاعات والحالات الخاصة والاتفاق عليها بشكل منفصل.',
    serviceContractCta: 'ناقش عقد الخدمة',
    auditCta: 'اطلب فحص الموقع',
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
    maintenanceTitle: fallback.maintenanceTitle,
    maintenanceSubline: fallback.maintenanceSubline,
    maintenanceTracks: fallback.maintenanceTracks,
    maintenanceBenefits: fallback.maintenanceBenefits,
    maintenanceDiscount: fallback.maintenanceDiscount,
    maintenanceBoundary: fallback.maintenanceBoundary,
    serviceContractCta: fallback.serviceContractCta,
    auditCta: fallback.auditCta,
    frameTitle: cmsContent.trust?.title ?? fallback.frameTitle,
    trustPoints: cmsContent.trust?.items ?? fallback.trustPoints,
    finalHeadline: cmsContent.trust?.finalHeadline ?? fallback.finalHeadline,
    finalText: cmsContent.trust?.finalText ?? fallback.finalText,
    repairEnabled: cmsContent.repair?.enabled,
    brandingEnabled: cmsContent.branding?.enabled,
    maintenanceEnabled: cmsContent.maintenance?.enabled,
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

        {(content.repairEnabled !== false || content.brandingEnabled !== false) && (
          <section id="servicebereiche" className="bg-[#F8FAFC] px-4 py-14 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-4xl">
                <h2 className="text-3xl font-extrabold leading-[1.08] text-[#0E1A2B] sm:text-5xl">
                  {content.serviceShowcaseTitle}
                </h2>
                <p className="mt-5 text-lg leading-8 text-[#4A5568]">{content.serviceShowcaseIntro}</p>
              </div>

              <div className="mt-10 space-y-6 sm:space-y-8">
                {content.serviceShowcaseCards.map((card, index) => (
                  <article
                    key={card.id}
                    className="overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-7 lg:p-8"
                  >
                    <div
                      className={`grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center ${
                        index % 2 !== 0 ? 'lg:[&>div:first-child]:order-2' : ''
                      }`}
                    >
                      <div className="min-w-0">
                        <h3 className="break-words text-2xl font-black leading-[1.1] text-[#0E1A2B] sm:text-3xl">
                          {card.title}
                        </h3>
                        <p className="mt-4 text-[16px] leading-7 text-[#4A5568]">{card.description}</p>

                        <div className="mt-7 space-y-3">
                          {card.details.map((detail) => (
                            <div key={`${card.id}-${detail.label}`} className="grid gap-1 border-b border-[#E8EEF5] pb-3 last:border-0 sm:grid-cols-[140px_minmax(0,1fr)]">
                              <span className="text-[14px] font-extrabold text-[#3E617D]">{detail.label}</span>
                              <span className="min-w-0 break-words text-[14px] font-medium leading-6 text-[#0E1A2B]">
                                {detail.value}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-7">
                          <LeistungenRequestButton
                            label={card.cta}
                            serviceIntent={card.intent}
                            className="min-w-[160px] whitespace-normal px-7 text-center"
                          />
                        </div>
                      </div>

                      <div className="relative aspect-[16/10] min-h-[240px] overflow-hidden rounded-[22px] shadow-lg sm:min-h-[300px]">
                        <CmsImage
                          src={card.image}
                          alt={card.title}
                          fill
                          sizes="(min-width: 1280px) 560px, (min-width: 1024px) 45vw, 100vw"
                          className="object-cover object-center"
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <p className="mt-8 rounded-[18px] border border-[#7BA190]/45 bg-[#EEF6F2] px-5 py-4 text-[16px] font-bold leading-7 text-[#24594D]">
                {content.serviceShowcaseFocus}
              </p>
            </div>
          </section>
        )}

        {content.maintenanceEnabled !== false && (
          <section id="wartung-servicevertraege" className="scroll-mt-28 bg-[#0E1A2B] py-14 text-white sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
                <div>
                  <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.08] sm:text-5xl">
                    {content.maintenanceTitle}
                  </h2>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">{content.maintenanceSubline}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <LeistungenRequestButton
                      label={content.auditCta}
                      serviceIntent="wartung-servicevertrag"
                      className="min-w-[180px] whitespace-normal px-7 text-center"
                    />
                    <LeistungenRequestButton
                      label={content.serviceContractCta}
                      serviceIntent="wartung-servicevertrag"
                      variant="secondary"
                      className="min-w-[180px] whitespace-normal px-7 text-center"
                    />
                  </div>

                  <p className="mt-8 rounded-[20px] border border-[#DAB08A]/35 bg-[#B8643E]/15 px-5 py-4 text-[15px] font-semibold leading-7 text-[#FFE6D6]">
                    {content.maintenanceBoundary}
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    {content.maintenanceTracks.map((track, index) => (
                      <article
                        key={track.id}
                        className="min-w-0 rounded-[22px] border border-white/[0.13] bg-white/[0.075] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7BA190] text-[13px] font-black text-[#0E1A2B]">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <h3 className="mt-5 break-words text-xl font-black leading-[1.1] text-white">{track.title}</h3>
                        <p className="mt-3 text-[15px] leading-7 text-white/[0.76]">{track.text}</p>
                      </article>
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1fr_0.95fr]">
                    <div className="rounded-[22px] border border-white/[0.12] bg-white/[0.06] p-5">
                      <ul className="grid gap-3">
                        {content.maintenanceBenefits.map((benefit) => (
                          <li key={benefit} className="flex min-w-0 gap-3 text-[15px] font-semibold leading-6 text-white/[0.84]">
                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#7BA190]" />
                            <span className="min-w-0 break-words">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="rounded-[22px] border border-[#DAB08A]/45 bg-[#B8643E]/20 px-5 py-5 text-[15px] font-bold leading-7 text-[#FFE6D6]">
                      {content.maintenanceDiscount}
                    </p>
                  </div>
                </div>
              </div>
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
