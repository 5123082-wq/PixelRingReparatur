import type { Metadata } from 'next';

import { Link } from '@/i18n/routing';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import CmsImage from '@/components/common/CmsImage';
import SectionEyebrow from '@/components/common/SectionEyebrow';
import LeistungenHero from '@/components/leistungen/LeistungenHero';
import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';
import LeistungenFooterCTA from '@/components/sections/LeistungenFooterCTA';
import { getGlobalPageCmsContent, getLeistungenPageCmsContent } from '@/lib/cms/pages';

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

type Benefit = {
  title: string;
  text: string;
};

type CheckItem = {
  label: string;
  status: string;
  statusType: 'ok' | 'plan' | 'urgent';
};

type SimpleCard = {
  id: string;
  intent: ServiceIntent;
  title: string;
  text: string;
};

type ServiceShowcaseCard = {
  id: string;
  intent: ServiceIntent;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  cta: string;
  href?: string;
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
  
  maintenanceEyebrow: string;
  maintenanceTitle: string;
  maintenanceTitleHighlight: string;
  maintenanceSubline: string;
  maintenanceBenefits: Benefit[];
  maintenancePanelTitle: string;
  maintenancePanelSubtitle: string;
  maintenancePanelTag: string;
  maintenanceScoreTitle: string;
  maintenanceScoreDesc: string;
  maintenanceChecks: CheckItem[];
  maintenanceFootLeft: string;
  maintenanceFootRight: string;
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

const SERVICE_DETAIL_PATH_BY_CARD_ID: Partial<Record<string, string>> = {
  'led-modernisierung': '/leistungen/lichtwerbung-led-modernisierung',
  'audit-diagnose': '/leistungen/werbeanlagen-audit-diagnose',
  'werbeanlagen-reinigung': '/leistungen/werbeanlagen-reinigung',
  'montage-demontage': '/leistungen/montage-demontage-werbeanlagen',
  'druck-branding': '/leistungen/druckprodukte-branding-werbematerialien',
};

const BREADCRUMB_LABELS_BY_LOCALE: Record<Locale, { home: string; services: string }> = {
  de: {
    home: 'Home',
    services: 'Leistungen',
  },
  en: {
    home: 'Home',
    services: 'Services',
  },
  ru: {
    home: 'Главная',
    services: 'Услуги',
  },
  tr: {
    home: 'Ana sayfa',
    services: 'Hizmetler',
  },
  pl: {
    home: 'Strona główna',
    services: 'Usługi',
  },
  ar: {
    home: 'الرئيسية',
    services: 'الخدمات',
  },
};

const CONTENT: Record<Locale, LeistungenContent> = {
  de: {
    metaTitle: 'Leistungen für Reparatur, Wartung & Werbetechnik | PixelRing',
    metaDescription:
      'PixelRing unterstützt Unternehmen bei Reparatur, Diagnose, Montage, Wartung, Lichtwerbung, Branding, Druckprodukten und Servicevertraegen für Werbeanlagen.',
    heroSlides: [
      {
        id: 'repair',
        title: 'Reparatur & Wartung von Außenwerbung',
        description: 'Professionelle Instandsetzung von Werbeanlagen, Leuchtwerbung und Außenwerbung.',
        image: '/images/leistungen/werbeanlagen-reparatur-led-module-pruefung.png',
        imageAlt: 'LED-Module in einem geöffneten Leuchtkasten werden mit einem Multimeter geprüft',
        cta: 'Service starten',
      },
      {
        id: 'led',
        title: 'Moderne Lichtwerbung & LED-Service',
        description: 'Lichtwerbung, die auffaellt. Wir reparieren LED-Module, Netzteile und Neonröhren fachgerecht.',
        image: '/images/leistungen/lichtwerbung-led-modernisierung-lichtkasten-led-module.webp',
        imageAlt: 'Geöffneter Lichtkasten mit installierten LED-Modulen während der LED-Modernisierung einer Lichtwerbung auf einem Gebäudedach',
        cta: 'Service starten',
      },
      {
        id: 'audit',
        title: 'Inspektion, Audit & Diagnose',
        description: 'Zustand, Ursache, Umfang und sichtbare Risiken werden strukturiert erfasst.',
        image: '/images/leistungen/werbeanlagen-audit-diagnose-ladenfassade-vor-ort-pruefung.webp',
        imageAlt: 'Techniker prüft eine Werbeanlage an einer Ladenfassade während Inspektion und Diagnose vor Ort',
        cta: 'Diagnose anfragen',
      },
      {
        id: 'montage',
        title: 'Montage, Demontage & Versetzung',
        description: 'Koordinierte Umsetzung für neue, bestehende oder zu versetzende Werbeanlagen.',
        image: '/images/leistungen/werbeanlagen-montage-demontage-sportzentrum-fassade.webp',
        imageAlt: 'Techniker montieren einen Leuchtkasten an einer Geschaeftsfassade mit Arbeitsplattform',
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
        image: '/images/leistungen/werbeanlagen-reparatur-led-module-pruefung.png',
        imageAlt: 'LED-Module in einem geöffneten Leuchtkasten werden mit einem Multimeter geprüft',
        eyebrow: 'Werbeanlagen-Reparatur',
        cta: 'Mehr zur Reparatur',
        href: '/leistungen/werbeanlagen-reparatur',
        details: [
          { label: 'Konstruktion', value: 'Rahmen, Unterkonstruktionen und Befestigungspunkte' },
          { label: 'Pflege', value: 'Reinigung, Wartung und optische Instandsetzung' },
          { label: 'Ziel', value: 'Bestehende Anlagen sinnvoll erhalten' },
        ],
      },
      {
        id: 'werbeanlagen-reinigung',
        intent: 'reinigung-pflege',
        title: 'Werbeanlagen-Reinigung',
        description:
          'PixelRing koordiniert Reinigung und Pflege von Werbeanlagen, Markisen und Außenwerbung in Berlin & Brandenburg - mit einem verantwortlichen Ansprechpartner für den gesamten Ablauf.',
        image: '/images/leistungen/werbeanlagen-reinigung/werbeanlagen-reinigung-markise-service.webp',
        imageAlt: 'Beispielhafte Darstellung eines PixelRing Teams bei der Reinigung einer blauen Markise an einer Geschäftsfront',
        cta: 'Reinigung ansehen',
        details: [
          { label: 'Region', value: 'Berlin & Brandenburg als Kerngebiet' },
          { label: 'Objekte', value: 'Werbeanlagen, Markisen, Fassadenelemente und Außenwerbung' },
          { label: 'Fokus', value: 'Reinigung, Pflege und optische Auffrischung bestehender Anlagen' },
        ],
      },
      {
        id: 'led-modernisierung',
        intent: 'lichtwerbung-led',
        title: 'Modernisierung von Lichtwerbung & LED-Systemen',
        description:
          'Modernisierung und Service für Lichtwerbung, LED-Module, Netzteile, Controller und Neonröhren. Alte Anlagen werden geprüft und technisch sinnvoll aktualisiert.',
        image: '/images/leistungen/lichtwerbung-led-modernisierung-lichtkasten-led-module.webp',
        imageAlt: 'Geöffneter Lichtkasten mit installierten LED-Modulen während der LED-Modernisierung einer Lichtwerbung auf einem Gebäudedach',
        cta: 'Mehr zum LED-Service',
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
        image: '/images/leistungen/werbeanlagen-audit-diagnose-ladenfassade-vor-ort-pruefung.webp',
        imageAlt: 'Techniker prüft eine Werbeanlage an einer Ladenfassade während Inspektion und Diagnose vor Ort',
        cta: 'Mehr zur Diagnose',
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
        image: '/images/leistungen/werbeanlagen-montage-demontage-sportzentrum-fassade.webp',
        imageAlt: 'Techniker montieren einen Leuchtkasten an einer Geschaeftsfassade mit Arbeitsplattform',
        cta: 'Mehr zur Montage',
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
        cta: 'Mehr zum Branding',
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
          'Wir klären, welche Reinigung, Pflege oder optische Instandsetzung passend ist.',
      },
      {
        id: 'montage-demontage',
        intent: 'montage-demontage',
        title: 'Montage, Demontage & Versetzung',
        summary: 'Koordinierte Umsetzung für neue, bestehende oder zu versetzende Anlagen.',
        details:
          'PixelRing koordiniert Montage, Demontage oder Standortwechsel von Werbeanlagen unter Einbezug benötigter Fachgewerke.',
      },
      {
        id: 'ersatzloesung',
        intent: 'diagnose',
        title: 'Reparatur prüfen - Ersatzlösung nur wenn sinnvoll',
        summary: 'Ersatz oder Neubau wird erst empfohlen, wenn Reparatur nicht sinnvoll ist.',
        details:
          'Unser erster Fokus liegt auf der Reparatur und sinnvollen Instandsetzung bestehender Werbeanlagen. Ist eine Reparatur technisch oder wirtschaftlich nicht angeraten, können wir eine passende Ersatzlösung oder Neukonstruktion anbieten.',
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
    maintenanceEyebrow: 'Neues Service-Abo',
    maintenanceTitle: 'Wissen Sie, was Ihre Kunden ',
    maintenanceTitleHighlight: 'vor Ort wirklich sehen?',
    maintenanceSubline:
      'PixelRing prüft regelmäßig Werbeanlagen, Leuchtreklame, Folien und Printmedien — mit Foto-Report, klaren Prioritäten und planbarer Wartung pro Standort.',
    maintenanceBenefits: [
      {
        title: 'Regelmäßiger Check-up',
        text: 'Monatlicher Blick auf Sichtbarkeit, Schäden, veraltete Materialien und dringende Aufgaben.',
      },
      {
        title: 'Planbare Betreuung',
        text: 'Ein Ansprechpartner, klare Reports und Service statt spontaner Notfall-Reparaturen.',
      },
    ],
    maintenancePanelTitle: 'Standort-Scan',
    maintenancePanelSubtitle: 'Beispielhafter Status nach einem Check-up',
    maintenancePanelTag: 'Live Report',
    maintenanceScoreTitle: 'Brand Health Score',
    maintenanceScoreDesc: 'Alle sichtbaren Elemente werden dokumentiert: Licht, Folien, Print, Befestigung und Markenbild.',
    maintenanceChecks: [
      { label: 'Leuchtreklame außen', status: 'OK', statusType: 'ok' },
      { label: 'Schaufensterfolie', status: 'Planen', statusType: 'plan' },
      { label: 'Aktionsposter', status: 'Dringend', statusType: 'urgent' },
    ],
    maintenanceFootLeft: 'Audit → Report → Service',
    maintenanceFootRight: 'Für einzelne Standorte und Filialnetze.',
    maintenanceBoundary:
      'Der Servicevertrag ersetzt keinen unbegrenzten Reparaturvertrag. Größere Reparaturen, Ersatzteile, Höhenarbeiten und Sonderfälle werden separat geprüft und abgestimmt.',
    serviceContractCta: 'Standort-Abo entdecken',
    auditCta: 'Audit anfragen',
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
        title: 'Outdoor advertising repair & maintenance',
        description: 'Professional repair of signage, illuminated advertising and outdoor advertising systems.',
        image: '/images/leistungen/werbeanlagen-reparatur-led-module-pruefung.png',
        imageAlt: 'LED modules in an open illuminated sign are checked with a multimeter',
        cta: 'Start service',
      },
      {
        id: 'led',
        title: 'Modern Lighting & LED Service',
        description: 'Signage that stands out. We repair LED modules, power supplies and neon tubes professionally.',
        image: '/images/leistungen/lichtwerbung-led-modernisierung-lichtkasten-led-module.webp',
        imageAlt: 'Open lightbox with installed LED modules during illuminated signage modernization',
        cta: 'Start service',
      },
      {
        id: 'audit',
        title: 'Inspection, audit & diagnostics',
        description: 'Condition, cause, scope and visible risks are captured in a structured way.',
        image: '/images/leistungen/werbeanlagen-audit-diagnose-ladenfassade-vor-ort-pruefung.webp',
        imageAlt: 'Technician inspects a storefront sign during on-site signage audit and diagnostics',
        cta: 'Request diagnostics',
      },
      {
        id: 'montage',
        title: 'Installation, dismantling & relocation',
        description: 'Coordinated work for new, existing or relocated signage.',
        image: '/images/leistungen/werbeanlagen-montage-demontage-sportzentrum-fassade.webp',
        imageAlt: 'Technicians install an illuminated sign box on a storefront facade from a work platform',
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
        image: '/images/leistungen/werbeanlagen-reparatur-led-module-pruefung.png',
        imageAlt: 'LED modules in an open illuminated sign are checked with a multimeter',
        eyebrow: 'Sign repair',
        cta: 'Repair details',
        href: '/leistungen/werbeanlagen-reparatur',
        details: [
          { label: 'Structure', value: 'Frames, substructures and fixing points' },
          { label: 'Care', value: 'Cleaning, maintenance and visual restoration' },
          { label: 'Goal', value: 'Keep existing installations in useful service' },
        ],
      },
      {
        id: 'werbeanlagen-reinigung',
        intent: 'reinigung-pflege',
        title: 'Signage Cleaning',
        description:
          'PixelRing coordinates cleaning and care for signage, awnings and outdoor advertising in Berlin & Brandenburg, with one accountable PixelRing contact for the full process.',
        image: '/images/leistungen/werbeanlagen-reinigung/werbeanlagen-reinigung-markise-service.webp',
        imageAlt: 'Illustrative visual of a PixelRing team cleaning a blue awning on a business facade',
        cta: 'Cleaning details',
        details: [
          { label: 'Region', value: 'Berlin & Brandenburg as the core service area' },
          { label: 'Objects', value: 'Signage, awnings, facade elements and outdoor advertising' },
          { label: 'Focus', value: 'Cleaning, care and visual refresh of existing installations' },
        ],
      },
      {
        id: 'led-modernisierung',
        intent: 'lichtwerbung-led',
        title: 'Illuminated signage modernization & LED systems',
        description:
          'Modernization and service for illuminated signage, LED modules, power supplies, controllers and neon tubes. Older systems are checked and updated where it makes technical sense.',
        image: '/images/leistungen/lichtwerbung-led-modernisierung-lichtkasten-led-module.webp',
        imageAlt: 'Geöffneter Lichtkasten mit installierten LED-Modulen während der LED-Modernisierung einer Lichtwerbung auf einem Gebäudedach',
        cta: 'LED service details',
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
        image: '/images/leistungen/werbeanlagen-audit-diagnose-ladenfassade-vor-ort-pruefung.webp',
        imageAlt: 'Technician inspects a storefront sign during on-site signage audit and diagnostics',
        cta: 'Diagnostics details',
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
        image: '/images/leistungen/werbeanlagen-montage-demontage-sportzentrum-fassade.webp',
        imageAlt: 'Technicians install an illuminated sign box on a storefront facade from a work platform',
        cta: 'Installation details',
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
        cta: 'Branding details',
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
      'PixelRing also supports businesses with ongoing advertising materials - from artwork and print data to vinyl, banners, posters and location branding.',
    brandingCards: [
      { id: 'design', intent: 'druckprodukte-branding', title: 'Design & print data', text: 'Preparation, adaptation and coordination of print data for locations and advertising materials.' },
      { id: 'druckprodukte', intent: 'druckprodukte-branding', title: 'Print products & advertising materials', text: 'Posters, banners, stickers, information signs and other materials for ongoing needs.' },
      { id: 'folierung', intent: 'folierung-beschriftung', title: 'Vinyl & lettering', text: 'Lettering, vinyl and visible brand elements for surfaces, windows and locations.' },
      { id: 'filialen', intent: 'druckprodukte-branding', title: 'Branch and location supply', text: 'Coordinated material supply for companies with one or more locations.' },
    ],
    maintenanceEyebrow: 'New Service Subscription',
    maintenanceTitle: 'Do you know what your customers ',
    maintenanceTitleHighlight: 'actually see on site?',
    maintenanceSubline:
      'PixelRing regularly checks signage, illuminated advertising, vinyl, and print media — with photo reports, clear priorities, and planned maintenance per location.',
    maintenanceBenefits: [
      {
        title: 'Regular Check-up',
        text: 'Monthly check of visibility, damage, outdated materials, and urgent tasks.',
      },
      {
        title: 'Planned Support',
        text: 'One contact person, clear reports, and service instead of sudden emergency repairs.',
      },
    ],
    maintenancePanelTitle: 'Location Scan',
    maintenancePanelSubtitle: 'Example status after a check-up',
    maintenancePanelTag: 'Live Report',
    maintenanceScoreTitle: 'Brand Health Score',
    maintenanceScoreDesc: 'All visible elements are documented: lighting, vinyl, print, mountings, and brand image.',
    maintenanceChecks: [
      { label: 'Outdoor illuminated signage', status: 'OK', statusType: 'ok' },
      { label: 'Storefront vinyl', status: 'Plan', statusType: 'plan' },
      { label: 'Promo poster', status: 'Urgent', statusType: 'urgent' },
    ],
    maintenanceFootLeft: 'Audit → Report → Service',
    maintenanceFootRight: 'For single locations and branch networks.',
    maintenanceBoundary:
      'The service contract does not replace an unlimited repair agreement. Major repairs, spare parts, high-altitude work, and special cases are reviewed and agreed upon separately.',
    serviceContractCta: 'Discover Location Subscription',
    auditCta: 'Request Audit',
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
        title: 'Ремонт и обслуживание наружной рекламы',
        description: 'Профессиональное восстановление вывесок, световой рекламы и наружных рекламных конструкций.',
        image: '/images/leistungen/werbeanlagen-reparatur-led-module-pruefung.png',
        imageAlt: 'Проверка LED-модулей в открытом световом коробе мультиметром',
        cta: 'Запустить сервис',
      },
      {
        id: 'led',
        title: 'Современная световая реклама и LED-сервис',
        description: 'Реклама, которую замечают. Профессиональный ремонт LED-модулей, блоков питания и неона.',
        image: '/images/leistungen/lichtwerbung-led-modernisierung-lichtkasten-led-module.webp',
        imageAlt: 'Открытый световой короб с LED-модулями во время модернизации световой рекламы',
        cta: 'Запустить сервис',
      },
      {
        id: 'audit',
        title: 'Инспекция, аудит и диагностика',
        description: 'Фиксируем состояние, причину, объем задачи и видимые риски.',
        image: '/images/leistungen/werbeanlagen-audit-diagnose-ladenfassade-vor-ort-pruefung.webp',
        imageAlt: 'Специалист проверяет вывеску на фасаде магазина во время выездной инспекции и диагностики',
        cta: 'Запросить диагностику',
      },
      {
        id: 'montage',
        title: 'Монтаж, демонтаж и перенос',
        description: 'Координация работ для новых, существующих или переносимых рекламных конструкций.',
        image: '/images/leistungen/werbeanlagen-montage-demontage-sportzentrum-fassade.webp',
        imageAlt: 'Специалисты монтируют световой короб на фасаде магазина с рабочей платформы',
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
          'Профессиональное восстановление вывесок, световой рекламы и наружных рекламных конструкций',
        image: '/images/leistungen/werbeanlagen-reparatur-led-module-pruefung.png',
        imageAlt: 'Проверка LED-модулей в открытом световом коробе мультиметром',
        eyebrow: 'Ремонт вывесок',
        cta: 'Подробнее о ремонте',
        href: '/leistungen/werbeanlagen-reparatur',
        details: [
          { label: 'Что ремонтируем', value: 'Вывески, световые короба, объемные буквы и наружные рекламные конструкции' },
          { label: 'Что проверяем', value: 'Крепления, корпус, подсветку, проводку, пленки и видимые повреждения' },
          { label: 'Цель', value: 'Восстановить работу и внешний вид без лишней замены всей конструкции' },
        ],
      },
      {
        id: 'werbeanlagen-reinigung',
        intent: 'reinigung-pflege',
        title: 'Мойка вывесок',
        description:
          'PixelRing координирует очистку и уход за вывесками, маркизами и наружной рекламой в Берлине и Бранденбурге через один ответственный сервисный процесс.',
        image: '/images/leistungen/werbeanlagen-reinigung/werbeanlagen-reinigung-markise-service.webp',
        imageAlt: 'Иллюстративное изображение команды PixelRing при очистке синей маркизы на фасаде магазина',
        eyebrow: 'Очистка и уход',
        cta: 'Подробнее об очистке',
        details: [
          { label: 'Регион', value: 'Берлин и Бранденбург как основная зона обслуживания' },
          { label: 'Объекты', value: 'Вывески, маркизы, элементы фасада и наружная реклама' },
          { label: 'Фокус', value: 'Очистка, уход и визуальное обновление существующих конструкций' },
        ],
      },
      {
        id: 'led-modernisierung',
        intent: 'lichtwerbung-led',
        title: 'Модернизация световой рекламы и LED-систем',
        description:
          'Модернизация и сервис световых вывесок, LED-модулей, блоков питания, контроллеров и неона. Старые системы проверяются и технически разумно обновляются.',
        image: '/images/leistungen/lichtwerbung-led-modernisierung-lichtkasten-led-module.webp',
        imageAlt: 'Geöffneter Lichtkasten mit installierten LED-Modulen während der LED-Modernisierung einer Lichtwerbung auf einem Gebäudedach',
        eyebrow: 'LED-сервис',
        cta: 'Подробнее о LED-сервисе',
        details: [
          { label: 'Что модернизируем', value: 'LED-модули, блоки питания, контроллеры, неон и световые короба' },
          { label: 'Что проверяем', value: 'Питание, проводку, яркость, влагу и причины неравномерной подсветки' },
          { label: 'Цель', value: 'Сделать подсветку стабильнее, ярче и проще в обслуживании' },
        ],
      },
      {
        id: 'audit-diagnose',
        intent: 'diagnose',
        title: 'Инспекция, аудит и диагностика рекламных установок',
        description:
          'Фиксируем состояние, причину, объем задачи и видимые риски. По итогам даем понятную рекомендацию по ремонту, обслуживанию или следующему разумному шагу.',
        image: '/images/leistungen/werbeanlagen-audit-diagnose-ladenfassade-vor-ort-pruefung.webp',
        imageAlt: 'Специалист проверяет вывеску на фасаде магазина во время выездной инспекции и диагностики',
        eyebrow: 'Диагностика',
        cta: 'Подробнее о диагностике',
        details: [
          { label: 'Что оцениваем', value: 'Состояние вывески, повреждения, крепления, электрику и условия локации' },
          { label: 'Что фиксируем', value: 'Причину проблемы, видимые риски, объем работ и срочность выполнения' },
          { label: 'Цель', value: 'Дать понятную рекомендацию по ремонту, обслуживанию или следующему шагу' },
        ],
      },
      {
        id: 'montage-demontage',
        intent: 'montage-demontage',
        title: 'Монтаж, демонтаж и перенос рекламных конструкций',
        description:
          'Координация работ для новых, существующих или переносимых рекламных конструкций. PixelRing планирует следующие шаги и согласует нужных специалистов.',
        image: '/images/leistungen/werbeanlagen-montage-demontage-sportzentrum-fassade.webp',
        imageAlt: 'Специалисты монтируют световой короб на фасаде магазина с рабочей платформы',
        eyebrow: 'Монтаж',
        cta: 'Подробнее о монтаже',
        details: [
          { label: 'Что выполняем', value: 'Монтаж, демонтаж, перенос и крепление рекламных конструкций' },
          { label: 'Что согласуем', value: 'Локацию, доступ, крепления, поверхность и нужных специалистов' },
          { label: 'Цель', value: 'Провести работы аккуратно, безопасно и с понятной координацией' },
        ],
      },
      {
        id: 'druck-branding',
        intent: 'druckprodukte-branding',
        title: 'Печатная продукция, брендинг и рекламные материалы',
        description:
          'Текущая поддержка рекламных материалов: от макетов и печатных данных до пленок, баннеров, постеров, надписей и брендинга локаций.',
        image: '/images/leistungen/hero-branding.png',
        eyebrow: 'Брендинг',
        cta: 'Подробнее о брендинге',
        details: [
          { label: 'Что готовим', value: 'Макеты, печатные данные, пленки, баннеры, постеры и надписи' },
          { label: 'Что поддерживаем', value: 'Витрины, поверхности, рекламные материалы и оформление локаций' },
          { label: 'Цель', value: 'Сохранить аккуратный и единый вид бренда на месте' },
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
    maintenanceEyebrow: 'Новая подписка на сервис (Service-Abo)',
    maintenanceTitle: 'Знаете ли вы, что ваши клиенты ',
    maintenanceTitleHighlight: 'видят на месте на самом деле?',
    maintenanceSubline:
      'PixelRing регулярно проверяет рекламные конструкции, световую рекламу, пленки и полиграфию — с фотоотчетом, четкими приоритетами и планируемым обслуживанием для каждого филиала.',
    maintenanceBenefits: [
      {
        title: 'Регулярная проверка (Check-up)',
        text: 'Ежемесячный контроль видимости, повреждений, износа материалов и срочных задач.',
      },
      {
        title: 'Плановое сопровождение',
        text: 'Один контакт (персональный менеджер), понятные отчеты и сервис вместо внезапных аварийных ремонтов.',
      },
    ],
    maintenancePanelTitle: 'Сканирование локации',
    maintenancePanelSubtitle: 'Пример статуса после регулярной проверки (Check-up)',
    maintenancePanelTag: 'Отчет онлайн (Live Report)',
    maintenanceScoreTitle: 'Индекс здоровья бренда (Brand Health Score)',
    maintenanceScoreDesc: 'Все видимые элементы документируются: свет, пленки, печать, крепления и соответствие бренду.',
    maintenanceChecks: [
      { label: 'Наружная световая реклама', status: 'В порядке (OK)', statusType: 'ok' },
      { label: 'Пленка на витринах', status: 'Запланировать', statusType: 'plan' },
      { label: 'Промо-постер', status: 'Срочно', statusType: 'urgent' },
    ],
    maintenanceFootLeft: 'Аудит → Отчет → Обслуживание (Audit → Report → Service)',
    maintenanceFootRight: 'Для отдельных точек и торговых сетей.',
    maintenanceBoundary:
      'Сервисный договор не заменяет безлимитный договор на ремонт. Крупный ремонт, запчасти, высотные работы и особые случаи рассматриваются и согласуются отдельно.',
    serviceContractCta: 'Узнать про подписку на локацию (Standort-Abo)',
    auditCta: 'Запросить аудит',
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
    metaTitle: 'Onarım, Bakım ve Reklam Tekniği Hizmetleri | PixelRing',
    metaDescription:
      'PixelRing; onarım, teşhis, montaj, bakım, ışıklı reklam, markalama, baskı ürünleri ve servis sözleşmeleri için işletmelere destek verir.',
    heroSlides: [
      {
        id: 'repair',
        title: 'Dış reklam onarımı ve bakımı',
        description: 'Tabela, ışıklı reklam ve dış reklam sistemlerinin profesyonel onarımı.',
        image: '/images/leistungen/werbeanlagen-reparatur-led-module-pruefung.png',
        imageAlt: 'Açık bir ışıklı tabeladaki LED modülleri multimetre ile kontrol ediliyor',
        cta: 'Servisi başlat',
      },
      {
        id: 'led',
        title: 'Modern Işıklı Reklam ve LED Servisi',
        description: 'Dikkat çeken reklamlar. LED modülleri, güç kaynakları ve neon tüplerini profesyonelce onarıyoruz.',
        image: '/images/leistungen/lichtwerbung-led-modernisierung-lichtkasten-led-module.webp',
        imageAlt: 'Işıklı reklam modernizasyonu sırasında LED modülleri takılmış açık ışıklı tabela',
        cta: 'Servisi başlat',
      },
      {
        id: 'audit',
        title: 'İnspeksiyon, denetim ve teşhis',
        description: 'Durum, neden, kapsam ve görünür riskler yapılandırılmış şekilde kayda alınır.',
        image: '/images/leistungen/werbeanlagen-audit-diagnose-ladenfassade-vor-ort-pruefung.webp',
        imageAlt: 'Bir teknisyen mağaza cephesindeki tabelayı yerinde denetim ve teşhis sırasında kontrol ediyor',
        cta: 'Teşhis iste',
      },
      {
        id: 'montage',
        title: 'Montaj, demontaj ve taşıma',
        description: 'Yeni, mevcut veya taşınacak reklam sistemleri için koordineli uygulama.',
        image: '/images/leistungen/werbeanlagen-montage-demontage-sportzentrum-fassade.webp',
        imageAlt: 'Teknisyenler bir mağaza cephesine çalışma platformundan ışıklı tabela monte ediyor',
        cta: 'Servis talep et',
      },
      {
        id: 'branding',
        title: 'Baskı, Folyo & Mekan Markalama',
        description: 'Vitrin yazılarından reklam malzemelerine kadar işletme noktanız için net marka görünürlüğü.',
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
        image: '/images/leistungen/werbeanlagen-reparatur-led-module-pruefung.png',
        imageAlt: 'Açık bir ışıklı tabeladaki LED modülleri multimetre ile kontrol ediliyor',
        eyebrow: 'Tabela onarımı',
        cta: 'Onarım detayları',
        href: '/leistungen/werbeanlagen-reparatur',
        details: [
          { label: 'Konstrüksiyon', value: 'Çerçeveler, alt yapılar ve sabitleme noktaları' },
          { label: 'Bakım', value: 'Temizlik, servis ve görsel yenileme' },
          { label: 'Hedef', value: 'Mevcut sistemleri mantıklı şekilde korumak' },
        ],
      },
      {
        id: 'werbeanlagen-reinigung',
        intent: 'reinigung-pflege',
        title: 'Tabela Temizliği',
        description:
          'PixelRing, Berlin & Brandenburg bölgesinde tabela, tente ve dış reklam temizliği ile bakımını tek sorumlu servis süreci içinde koordine eder.',
        image: '/images/leistungen/werbeanlagen-reinigung/werbeanlagen-reinigung-markise-service.webp',
        imageAlt: 'Bir iş yeri cephesinde mavi tenteyi temizleyen PixelRing ekibinin örnek görseli',
        cta: 'Temizlik detayları',
        details: [
          { label: 'Bölge', value: 'Ana hizmet alanı Berlin & Brandenburg' },
          { label: 'Objeler', value: 'Tabelalar, tenteler, cephe elemanları ve dış reklam' },
          { label: 'Odak', value: 'Mevcut sistemlerin temizliği, bakımı ve görsel yenilenmesi' },
        ],
      },
      {
        id: 'led-modernisierung',
        intent: 'lichtwerbung-led',
        title: 'Işıklı reklam ve LED sistem modernizasyonu',
        description:
          'Işıklı tabelalar, LED modüller, güç kaynakları, kontrol cihazları ve neon için modernizasyon ve servis. Eski sistemler kontrol edilir ve teknik olarak mantıklıysa güncellenir.',
        image: '/images/leistungen/lichtwerbung-led-modernisierung-lichtkasten-led-module.webp',
        imageAlt: 'Geöffneter Lichtkasten mit installierten LED-Modulen während der LED-Modernisierung einer Lichtwerbung auf einem Gebäudedach',
        cta: 'LED servisi detayları',
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
        image: '/images/leistungen/werbeanlagen-audit-diagnose-ladenfassade-vor-ort-pruefung.webp',
        imageAlt: 'Bir teknisyen mağaza cephesindeki tabelayı yerinde denetim ve teşhis sırasında kontrol ediyor',
        cta: 'Teşhis detayları',
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
        image: '/images/leistungen/werbeanlagen-montage-demontage-sportzentrum-fassade.webp',
        imageAlt: 'Teknisyenler bir mağaza cephesine çalışma platformundan ışıklı tabela monte ediyor',
        cta: 'Montaj detayları',
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
        cta: 'Markalama detayları',
        details: [
          { label: 'Baskı verisi', value: 'Hazırlama, uyarlama ve koordinasyon' },
          { label: 'Materyaller', value: 'Poster, banner, sticker ve bilgilendirme levhaları' },
          { label: 'Lokasyonlar', value: 'Folyo, yazılama ve şube materyali tedariki' },
        ],
      },
    ],
    serviceShowcaseFocus:
      'İlk odağımız mevcut reklam sistemlerinin onarımı ve mantıklı şekilde yeniden kullanılmasıdır. Değişim veya yeni yapım yalnızca onarım teknik ya da ekonomik olarak mantıklı değilse önerilir.',
    repairTitle: 'Reklam sistemleri için onarım, teşhis ve montaj',
    repairIntro:
      'İlk görsel kontrolden onarım, söküm veya yeni kuruluma kadar PixelRing sisteminizin durumunu inceler ve doğru sonraki adımları koordine eder.',
    repairCards: [
      { id: 'diagnose', intent: 'diagnose', title: 'Teşhis ve yerinde kontrol', summary: 'Durum, neden ve kapsam net şekilde kayda alınır.', details: 'Görünür hasarlar, montaj noktaları, elektrik belirtileri ve lokasyon koşulları kontrol edilir; uzaktan değerlendirme mi yoksa yerinde randevu mu gerektiği netleşir.' },
      { id: 'lichtwerbung-led', intent: 'lichtwerbung-led', title: 'Elektrik, ışıklı reklam ve LED servisi', summary: 'Işıklı tabelalar, LED modüller, güç kaynakları, kontrol cihazları ve neon tüpler için servis.', details: 'Işıklı sistemlerde kablolama, güç kaynağı, kontrol cihazları, transformatörler, LED modüller veya neon tüpler gibi tipik nedenler kontrol edilir.' },
      { id: 'konstruktion-befestigung', intent: 'konstruktion-befestigung', title: 'Konstrüksiyon ve sabitleme onarımı', summary: 'Taşıyıcılar, çerçeveler ve bağlantı noktaları değerlendirilir.', details: 'Gevşek, hasarlı veya yıpranmış parçalar yeni konstrüksiyon planlanmadan önce onarım odaklı değerlendirilir.' },
      { id: 'reinigung-pflege', intent: 'reinigung-pflege', title: 'Temizlik, bakım ve görsel yenileme', summary: 'Mevcut sistemlerin görünürlüğünü ve görünümünü iyileştirir.', details: 'Sistemin tekrar profesyonel görünmesi ve gereksiz sonraki hasarların azalması için uygun temizlik veya görsel yenileme belirlenir.' },
      { id: 'montage-demontage', intent: 'montage-demontage', title: 'Montaj, demontaj ve taşıma', summary: 'Yeni, mevcut veya taşınacak sistemler için koordineli uygulama.', details: 'PixelRing montaj, demontaj veya lokasyon değişimini gerekli uzmanlarla birlikte koordine eder.' },
      { id: 'ersatzloesung', intent: 'diagnose', title: 'Önce onarım kontrolü - değişim yalnızca mantıklıysa', summary: 'Değişim veya yeni yapım sadece onarım mantıklı olmadığında önerilir.', details: 'İlk odağımız mevcut reklam sistemlerinin onarımı ve anlamlı şekilde yeniden kullanılmasıdır. Onarım teknik veya ekonomik olarak uygun değilse uygun değişim veya yeni konstrüksiyon sunabiliriz.' },
    ],
    repairFocus: 'İlk odağımız mevcut reklam sistemlerinin onarımı ve anlamlı şekilde yeniden kullanılmasıdır.',
    brandingTitle: 'İş lokasyonları için baskı ürünleri, markalama ve reklam materyalleri',
    brandingIntro:
      'PixelRing; baskı verileri, tasarım, folyo, banner, poster ve lokasyon markalama dahil sürekli reklam materyali ihtiyacında işletmelere destek olur.',
    brandingCards: [
      { id: 'design', intent: 'druckprodukte-branding', title: 'Tasarım ve baskı verileri', text: 'Lokasyon ve reklam materyalleri için baskı dosyalarının hazırlanması ve uyarlanması.' },
      { id: 'druckprodukte', intent: 'druckprodukte-branding', title: 'Baskı ürünleri ve reklam materyalleri', text: 'Poster, banner, sticker, yönlendirme tabelaları ve sürekli ihtiyaç materyalleri.' },
      { id: 'folierung', intent: 'folierung-beschriftung', title: 'Folyo ve yazılama', text: 'Yüzeyler, vitrinler ve lokasyonlar için marka yazıları ve folyo uygulamaları.' },
      { id: 'filialen', intent: 'druckprodukte-branding', title: 'Şube ve lokasyon tedarigi', text: 'Bir veya daha fazla lokasyon için koordineli materyal tedariki.' },
    ],
    maintenanceEyebrow: 'Yeni Hizmet Aboneliği',
    maintenanceTitle: 'Müşterilerinizin yerinde gerçekten ne gördüğünü ',
    maintenanceTitleHighlight: 'biliyor musunuz?',
    maintenanceSubline:
      'PixelRing; şube başına fotoğraflı rapor, net öncelikler ve planlanabilir bakım ile reklam sistemlerini, ışıklı reklamları, folyoları ve basılı materyalleri düzenli olarak kontrol eder.',
    maintenanceBenefits: [
      {
        title: 'Düzenli Check-up',
        text: 'Görünürlük, hasarlar, eskiyen malzemeler ve acil işlere aylık bakış.',
      },
      {
        title: 'Planlanabilir Destek',
        text: 'Tek muhatap, net raporlar ve spontane acil durum onarımları yerine planlı hizmet.',
      },
    ],
    maintenancePanelTitle: 'Lokasyon Taraması',
    maintenancePanelSubtitle: 'Bir check-up sonrası örnek durum',
    maintenancePanelTag: 'Canlı Rapor',
    maintenanceScoreTitle: 'Marka Sağlık Skoru',
    maintenanceScoreDesc: 'Tüm görünür unsurlar belgelenir: Işık, folyolar, baskı, sabitleme ve marka imajı.',
    maintenanceChecks: [
      { label: 'Dış ışıklı reklam', status: 'OK', statusType: 'ok' },
      { label: 'Vitrin folyosu', status: 'Planla', statusType: 'plan' },
      { label: 'Kampanya posteri', status: 'Acil', statusType: 'urgent' },
    ],
    maintenanceFootLeft: 'Denetim → Rapor → Servis',
    maintenanceFootRight: 'Tek tek lokasyonlar ve şube ağları için.',
    maintenanceBoundary:
      'Servis sözleşmesi sınırsız onarım sözleşmesinin yerine geçmez. Büyük onarımlar, yedek parçalar, yüksekte çalışma ve özel durumlar ayrıca kontrol edilir ve kararlaştırılır.',
    serviceContractCta: 'Standort-Abo Keşfet',
    auditCta: 'Denetim Talep Et',
    frameTitle: 'Talebiniz için net çerçeve',
    trustPoints: [
      'Pazar yeri değil: talebiniz doğrudan PixelRing\'e gider.',
      'Ana bölge Berlin & Brandenburg - Almanya içindeki diğer bölgeler talep üzerine.',
      'Hizmet, materyal ve kullanım koşullarına bağlı olarak 24 aya kadar garanti.',
      'PixelRing koordinasyonunda uzman ekip ve nitelikli partnerlerle uygulama.',
    ],
    finalHeadline: 'Görevinizin uygun olup olmadığından emin değil misiniz?',
    finalText: 'Kısa bir açıklama veya fotoğraf gönderin. PixelRing kapsamı kontrol eder ve mantıklı sonraki adımları netleştirir.',
  },
  pl: {
    metaTitle: 'Usługi naprawy, konserwacji i techniki reklamowej | PixelRing',
    metaDescription:
      'PixelRing wspiera firmy w naprawie, diagnostyce, montażu, konserwacji, reklamie świetlnej, brandingu, druku i umowach serwisowych.',
    heroSlides: [
      {
        id: 'repair',
        title: 'Naprawa i obsługa reklamy zewnętrznej',
        description: 'Profesjonalna naprawa szyldów, reklamy świetlnej i zewnętrznych konstrukcji reklamowych.',
        image: '/images/leistungen/werbeanlagen-reparatur-led-module-pruefung.png',
        imageAlt: 'Moduły LED w otwartym kasetonie świetlnym sprawdzane multimetrem',
        cta: 'Rozpocznij serwis',
      },
      {
        id: 'led',
        title: 'Nowoczesna Reklama Świetlna i Serwis LED',
        description: 'Reklama, która rzuca się w oczy. Profesjonalnie naprawiamy moduły LED, zasilacze i neony.',
        image: '/images/leistungen/lichtwerbung-led-modernisierung-lichtkasten-led-module.webp',
        imageAlt: 'Otwarty kaseton świetlny z modułami LED podczas modernizacji reklamy świetlnej',
        cta: 'Rozpocznij serwis',
      },
      {
        id: 'audit',
        title: 'Inspekcja, audyt i diagnostyka',
        description: 'Stan, przyczyna, zakres zadania i widoczne ryzyka są ujmowane w uporządkowany sposób.',
        image: '/images/leistungen/werbeanlagen-audit-diagnose-ladenfassade-vor-ort-pruefung.webp',
        imageAlt: 'Technik sprawdza szyld na fasadzie sklepu podczas audytu i diagnostyki na miejscu',
        cta: 'Zgłoś diagnostykę',
      },
      {
        id: 'montage',
        title: 'Montaż, demontaż i przeniesienie',
        description: 'Koordynacja dla nowych, istniejących lub przenoszonych reklam.',
        image: '/images/leistungen/werbeanlagen-montage-demontage-sportzentrum-fassade.webp',
        imageAlt: 'Technicy montuja kaseton swietlny na fasadzie sklepu z platformy roboczej',
        cta: 'Zapytaj o serwis',
      },
      {
        id: 'branding',
        title: 'Druk, folie i branding lokalu',
        description: 'Od oznakowania witryn po materiały reklamowe: czytelna obecność marki w punkcie firmy.',
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
        image: '/images/leistungen/werbeanlagen-reparatur-led-module-pruefung.png',
        imageAlt: 'Moduły LED w otwartym kasetonie świetlnym sprawdzane multimetrem',
        eyebrow: 'Naprawa szyldów',
        cta: 'Więcej o naprawie',
        href: '/leistungen/werbeanlagen-reparatur',
        details: [
          { label: 'Konstrukcja', value: 'Ramy, podkonstrukcje i punkty mocowania' },
          { label: 'Pielęgnacja', value: 'Czyszczenie, serwis i odnowa wizualna' },
          { label: 'Cel', value: 'Sensowne utrzymanie istniejących instalacji' },
        ],
      },
      {
        id: 'werbeanlagen-reinigung',
        intent: 'reinigung-pflege',
        title: 'Czyszczenie reklam',
        description:
          'PixelRing koordynuje czyszczenie i pielęgnację reklam, markiz i reklamy zewnętrznej w Berlinie i Brandenburgii w jednym odpowiedzialnym procesie serwisowym.',
        image: '/images/leistungen/werbeanlagen-reinigung/werbeanlagen-reinigung-markise-service.webp',
        imageAlt: 'Przykładowa wizualizacja zespołu PixelRing czyszczącego niebieską markizę na fasadzie lokalu',
        cta: 'Szczegóły czyszczenia',
        details: [
          { label: 'Region', value: 'Berlin i Brandenburgia jako główny obszar obsługi' },
          { label: 'Obiekty', value: 'Reklamy, markizy, elementy fasady i reklama zewnętrzna' },
          { label: 'Cel', value: 'Czyszczenie, pielęgnacja i odświeżenie wizualne istniejących instalacji' },
        ],
      },
      {
        id: 'led-modernisierung',
        intent: 'lichtwerbung-led',
        title: 'Modernizacja reklamy świetlnej i systemów LED',
        description:
          'Modernizacja i serwis szyldów świetlnych, modułów LED, zasilaczy, sterowników i neonów. Starsze systemy są sprawdzane i aktualizowane tam, gdzie ma to sens techniczny.',
        image: '/images/leistungen/lichtwerbung-led-modernisierung-lichtkasten-led-module.webp',
        imageAlt: 'Geöffneter Lichtkasten mit installierten LED-Modulen während der LED-Modernisierung einer Lichtwerbung auf einem Gebäudedach',
        cta: 'Szczegóły serwisu LED',
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
        image: '/images/leistungen/werbeanlagen-audit-diagnose-ladenfassade-vor-ort-pruefung.webp',
        imageAlt: 'Technik sprawdza szyld na fasadzie sklepu podczas audytu i diagnostyki na miejscu',
        cta: 'Szczegóły diagnostyki',
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
        image: '/images/leistungen/werbeanlagen-montage-demontage-sportzentrum-fassade.webp',
        imageAlt: 'Technicy montuja kaseton swietlny na fasadzie sklepu z platformy roboczej',
        cta: 'Szczegóły montażu',
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
        cta: 'Szczegóły brandingu',
        details: [
          { label: 'Dane do druku', value: 'Przygotowanie, dopasowanie i koordynacja' },
          { label: 'Materiały', value: 'Plakaty, banery, naklejki i tablice informacyjne' },
          { label: 'Lokalizacje', value: 'Folie, oznakowanie i zaopatrzenie oddziałów' },
        ],
      },
    ],
    serviceShowcaseFocus:
      'Naszym pierwszym celem jest naprawa i sensowne przywrócenie istniejących reklam. Wymiana lub nowa konstrukcja jest rekomendowana tylko wtedy, gdy naprawa nie ma sensu technicznie albo ekonomicznie.',
    repairTitle: 'Naprawa, diagnostyka i montaż reklam',
    repairIntro:
      'Od pierwszej kontroli wizualnej po naprawę, demontaż lub nową instalację: PixelRing ocenia stan reklamy i koordynuje kolejne sensowne kroki.',
    repairCards: [
      { id: 'diagnose', intent: 'diagnose', title: 'Diagnostyka i kontrola na miejscu', summary: 'Stan, przyczyna i zakres są zapisywane w uporządkowany sposób.', details: 'Sprawdzamy widoczne uszkodzenia, punkty montażu, sygnały elektryczne i warunki lokalizacji, aby określić czy wystarczy ocena zdalna czy potrzebna jest wizyta.' },
      { id: 'lichtwerbung-led', intent: 'lichtwerbung-led', title: 'Elektryka, reklama świetlna i serwis LED', summary: 'Serwis kasetonów, modułów LED, zasilaczy, sterowników i rur neonowych.', details: 'W instalacjach świetlnych sprawdzamy typowe przyczyny: okablowanie, zasilanie, sterowniki, transformatory, moduły LED lub rury neonowe.' },
      { id: 'konstruktion-befestigung', intent: 'konstruktion-befestigung', title: 'Naprawa konstrukcji i mocowań', summary: 'Ocena ram, podkonstrukcji i punktów mocowania.', details: 'Luźne, uszkodzone lub zużyte elementy oceniamy z priorytetem naprawy przed planowaniem nowej konstrukcji.' },
      { id: 'reinigung-pflege', intent: 'reinigung-pflege', title: 'Czyszczenie, pielęgnacja i odnowa wizualna', summary: 'Poprawa widoczności i wyglądu istniejących instalacji.', details: 'Dobieramy czyszczenie, pielęgnację lub odnowę wizualną, aby reklama znów wyglądała profesjonalnie.' },
      { id: 'montage-demontage', intent: 'montage-demontage', title: 'Montaż, demontaż i przeniesienie', summary: 'Koordynacja dla nowych, istniejących lub przenoszonych reklam.', details: 'PixelRing koordynuje montaż, demontaż lub zmianę lokalizacji wraz z planem kolejnych kroków i specjalistami.' },
      { id: 'ersatzloesung', intent: 'diagnose', title: 'Najpierw sprawdzenie naprawy - wymiana tylko gdy ma sens', summary: 'Wymiana lub nowa konstrukcja jest rekomendowana tylko gdy naprawa nie jest sensowna.', details: 'Naszym pierwszym celem jest naprawa i sensowne przywrócenie istniejących reklam. Jeśli naprawa nie jest zalecana technicznie lub ekonomicznie, możemy zaproponować wymianę albo nową konstrukcję.' },
    ],
    repairFocus: 'Naszym pierwszym celem jest naprawa i sensowne przywrócenie istniejących reklam.',
    brandingTitle: 'Produkty drukowane, branding i materiały reklamowe dla lokalizacji firm',
    brandingIntro:
      'PixelRing wspiera firmy także w bieżącym zaopatrzeniu w materiały reklamowe - od danych do druku i projektu po folie, banery, plakaty i branding lokalizacji.',
    brandingCards: [
      { id: 'design', intent: 'druckprodukte-branding', title: 'Projekt i dane do druku', text: 'Przygotowanie, dopasowanie i uzgodnienie plików do druku oraz materiałów lokalizacji.' },
      { id: 'druckprodukte', intent: 'druckprodukte-branding', title: 'Druk i materiały reklamowe', text: 'Plakaty, banery, naklejki, tablice informacyjne i inne materiały do bieżących potrzeb.' },
      { id: 'folierung', intent: 'folierung-beschriftung', title: 'Folie i oznakowanie', text: 'Napisy, folie i widoczne elementy marki dla powierzchni, okien i lokalizacji.' },
      { id: 'filialen', intent: 'druckprodukte-branding', title: 'Zaopatrzenie oddziałów i lokalizacji', text: 'Skoordynowane zaopatrzenie firm z jedną lub wieloma lokalizacjami.' },
    ],
    maintenanceEyebrow: 'Nowy abonament serwisowy',
    maintenanceTitle: 'Czy wiesz, co Twoi klienci ',
    maintenanceTitleHighlight: 'naprawdę widzą na miejscu?',
    maintenanceSubline:
      'PixelRing regularnie sprawdza reklamy, neony, folie i materiały drukowane — z raportem fotograficznym, jasnymi priorytetami i planowaną konserwacją dla każdej lokalizacji.',
    maintenanceBenefits: [
      {
        title: 'Regularny Check-up',
        text: 'Miesięczna kontrola widoczności, uszkodzeń, przestarzałych materiałów i pilnych zadań.',
      },
      {
        title: 'Planowane wsparcie',
        text: 'Jeden kontakt, jasne raporty i serwis zamiast nagłych napraw awaryjnych.',
      },
    ],
    maintenancePanelTitle: 'Skanowanie lokalizacji',
    maintenancePanelSubtitle: 'Przykładowy status po check-upie',
    maintenancePanelTag: 'Raport na żywo',
    maintenanceScoreTitle: 'Wskaźnik zdrowia marki',
    maintenanceScoreDesc: 'Wszystkie widoczne elementy są dokumentowane: światło, folie, druk, mocowania i wizerunek marki.',
    maintenanceChecks: [
      { label: 'Reklama świetlna na zewnątrz', status: 'OK', statusType: 'ok' },
      { label: 'Folia na witrynie', status: 'Zaplanuj', statusType: 'plan' },
      { label: 'Plakat promocyjny', status: 'Pilne', statusType: 'urgent' },
    ],
    maintenanceFootLeft: 'Audyt → Raport → Serwis',
    maintenanceFootRight: 'Dla pojedynczych punktów i sieci handlowych.',
    maintenanceBoundary:
      'Umowa serwisowa nie zastępuje nielimitowanej umowy naprawczej. Większe naprawy, części zamienne, prace wysokościowe i przypadki specjalne są sprawdzane i uzgadniane osobno.',
    serviceContractCta: 'Odkryj abonament lokalizacji',
    auditCta: 'Zapytaj o audyt',
    frameTitle: 'Jasne ramy zgłoszenia',
    trustPoints: [
      'To nie marketplace: zgłoszenie trafia bezpośrednio do PixelRing.',
      'Berlin i Brandenburgia jako obszar główny - inne regiony Niemiec na zapytanie.',
      'Gwarancja do 24 miesięcy, zależnie od usługi, materiału i warunków użytkowania.',
      'Realizacja przez zespół specjalistów i kwalifikowanych partnerów pod koordynacją PixelRing.',
    ],
    finalHeadline: 'Nie masz pewności, czy Twoje zadanie pasuje?',
    finalText: 'Wyślij krótki opis lub zdjęcie. PixelRing oceni zakres i wyjaśni kolejne sensowne kroki.',
  },
  ar: {
    metaTitle: 'خدمات الإصلاح والصيانة وتقنيات الإعلان | PixelRing',
    metaDescription:
      'تدعم PixelRing الشركات في الإصلاح والتشخيص والتركيب والصيانة والإعلانات المضيئة والهوية التجارية والمواد المطبوعة وعقود الخدمة.',
    heroSlides: [
      {
        id: 'repair',
        title: 'إصلاح وصيانة الإعلانات الخارجية',
        description: 'إصلاح احترافي للافتات والإعلانات المضيئة والهياكل الإعلانية الخارجية.',
        image: '/images/leistungen/werbeanlagen-reparatur-led-module-pruefung.png',
        imageAlt: 'فحص وحدات LED داخل صندوق إضاءة مفتوح باستخدام مقياس متعدد',
        cta: 'ابدأ الخدمة',
      },
      {
        id: 'led',
        title: 'الإعلانات المضيئة الحديثة وخدمة LED',
        description: 'إعلانات تجذب الأنظار. نقوم بإصلاح وحدات LED ومزودات الطاقة وأنابيب النيون باحترافية.',
        image: '/images/leistungen/lichtwerbung-led-modernisierung-lichtkasten-led-module.webp',
        imageAlt: 'صندوق اضاءة مفتوح مع وحدات LED اثناء تحديث اعلان مضيء',
        cta: 'ابدأ الخدمة',
      },
      {
        id: 'audit',
        title: 'فحص وتدقيق وتشخيص',
        description: 'نسجل الحالة والسبب ونطاق المهمة والمخاطر الظاهرة بشكل منظم.',
        image: '/images/leistungen/werbeanlagen-audit-diagnose-ladenfassade-vor-ort-pruefung.webp',
        imageAlt: 'فني يفحص لافتة على واجهة متجر أثناء التدقيق والتشخيص في الموقع',
        cta: 'طلب التشخيص',
      },
      {
        id: 'montage',
        title: 'التركيب والفك والنقل',
        description: 'تنفيذ منسق للوحات الجديدة أو القائمة أو المنقولة.',
        image: '/images/leistungen/werbeanlagen-montage-demontage-sportzentrum-fassade.webp',
        imageAlt: 'فنيون يركبون صندوق اضاءة على واجهة متجر من منصة عمل',
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
        image: '/images/leistungen/werbeanlagen-reparatur-led-module-pruefung.png',
        imageAlt: 'فحص وحدات LED داخل صندوق إضاءة مفتوح باستخدام مقياس متعدد',
        eyebrow: 'إصلاح اللافتات',
        cta: 'تفاصيل الإصلاح',
        href: '/leistungen/werbeanlagen-reparatur',
        details: [
          { label: 'الهيكل', value: 'الإطارات والهياكل الفرعية ونقاط التثبيت' },
          { label: 'العناية', value: 'التنظيف والصيانة والترميم البصري' },
          { label: 'الهدف', value: 'الحفاظ المنطقي على المنشآت القائمة' },
        ],
      },
      {
        id: 'werbeanlagen-reinigung',
        intent: 'reinigung-pflege',
        title: 'تنظيف اللوحات الإعلانية',
        description:
          'تنسق PixelRing تنظيف ورعاية اللافتات والمظلات والإعلانات الخارجية في برلين وبراندنبورغ ضمن مسار خدمة واحد بمسؤولية واضحة.',
        image: '/images/leistungen/werbeanlagen-reinigung/werbeanlagen-reinigung-markise-service.webp',
        imageAlt: 'تصور توضيحي لفريق PixelRing أثناء تنظيف مظلة زرقاء على واجهة متجر',
        cta: 'تفاصيل التنظيف',
        details: [
          { label: 'المنطقة', value: 'برلين وبراندنبورغ كمنطقة خدمة أساسية' },
          { label: 'العناصر', value: 'لافتات ومظلات وعناصر واجهات وإعلانات خارجية' },
          { label: 'التركيز', value: 'تنظيف ورعاية وتجديد بصري للمنشآت القائمة' },
        ],
      },
      {
        id: 'led-modernisierung',
        intent: 'lichtwerbung-led',
        title: 'تحديث الإعلانات المضيئة وأنظمة LED',
        description:
          'تحديث وخدمة للافتات المضيئة ووحدات LED ومزودات الطاقة ووحدات التحكم والنيون. يتم فحص الأنظمة القديمة وتحديثها عندما يكون ذلك منطقياً تقنياً.',
        image: '/images/leistungen/lichtwerbung-led-modernisierung-lichtkasten-led-module.webp',
        imageAlt: 'Geöffneter Lichtkasten mit installierten LED-Modulen während der LED-Modernisierung einer Lichtwerbung auf einem Gebäudedach',
        cta: 'تفاصيل خدمة LED',
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
        image: '/images/leistungen/werbeanlagen-audit-diagnose-ladenfassade-vor-ort-pruefung.webp',
        imageAlt: 'فني يفحص لافتة على واجهة متجر أثناء التدقيق والتشخيص في الموقع',
        cta: 'تفاصيل التشخيص',
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
        image: '/images/leistungen/werbeanlagen-montage-demontage-sportzentrum-fassade.webp',
        imageAlt: 'فنيون يركبون صندوق اضاءة على واجهة متجر من منصة عمل',
        cta: 'تفاصيل التركيب',
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
        cta: 'تفاصيل الهوية التجارية',
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
    maintenanceEyebrow: 'اشتراك الخدمة الجديد',
    maintenanceTitle: 'هل تعرف ما يراه عملاؤك ',
    maintenanceTitleHighlight: 'على أرض الواقع حقاً؟',
    maintenanceSubline:
      'تقوم PixelRing بفحص اللوحات الإعلانية، والإعلانات المضيئة، والملصقات، والوسائط المطبوعة بانتظام — مع تقرير مصور، وأولويات واضحة، وصيانة مخططة لكل موقع.',
    maintenanceBenefits: [
      {
        title: 'فحص دوري منتظم',
        text: 'متابعة شهرية للوضوح، والأضرار، والمواد القديمة، والمهام العاجلة.',
      },
      {
        title: 'رعاية مخططة ومدروسة',
        text: 'مسؤول تواصل واحد، وتقارير واضحة، وخدمة مستمرة بدلاً من الإصلاحات الطارئة المفاجئة.',
      },
    ],
    maintenancePanelTitle: 'مسح الموقع',
    maintenancePanelSubtitle: 'حالة نموذجية بعد عملية الفحص',
    maintenancePanelTag: 'تقرير مباشر',
    maintenanceScoreTitle: 'مؤشر صحة العلامة',
    maintenanceScoreDesc: 'يتم توثيق جميع العناصر المرئية: الإضاءة، والملصقات، والطباعة، والتثبيت، وصورة العلامة التجارية.',
    maintenanceChecks: [
      { label: 'الإعلانات المضيئة الخارجية', status: 'سليم', statusType: 'ok' },
      { label: 'ملصقات الواجهة', status: 'جدولة', statusType: 'plan' },
      { label: 'ملصق الحملة', status: 'عاجل', statusType: 'urgent' },
    ],
    maintenanceFootLeft: 'التدقيق → التقرير → الخدمة',
    maintenanceFootRight: 'للمواقع الفردية وسلاسل الفروع.',
    maintenanceBoundary:
      'لا يحل عقد الخدمة محل عقد إصلاح غير محدود. يتم فحص الإصلاحات الكبيرة، وقطع الغيار، والعمل على ارتفاعات، والحالات الخاصة والاتفاق عليها بشكل منفصل.',
    serviceContractCta: 'اكتشف اشتراك المواقع',
    auditCta: 'طلب فحص الموقع',
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

function getLocale(locale: string): Locale {
  return (locale in CONTENT ? locale : 'de') as Locale;
}

function getLeistungenBreadcrumbs(locale: Locale) {
  const labels = BREADCRUMB_LABELS_BY_LOCALE[locale];

  return [
    {
      label: labels.home,
      href: '/',
    },
    {
      label: labels.services,
    },
  ];
}

function mergeCmsContent(
  fallback: LeistungenContent,
  cmsContent: Awaited<ReturnType<typeof getLeistungenPageCmsContent>>
): LeistungenContent {
  if (!cmsContent) {
    return fallback;
  }

  return {
    ...fallback,
    heroSlides: fallback.heroSlides,
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
    maintenanceEyebrow: fallback.maintenanceEyebrow,
    maintenanceTitle: cmsContent.maintenance?.title ?? fallback.maintenanceTitle,
    maintenanceTitleHighlight: cmsContent.maintenance?.title ? '' : fallback.maintenanceTitleHighlight,
    maintenanceSubline: cmsContent.maintenance?.description ?? fallback.maintenanceSubline,
    maintenanceBenefits: cmsContent.maintenance?.items?.length
      ? cmsContent.maintenance.items.map((item) => {
          const match = item.match(/^([^:—–\-\|]+)([:—–\-\|])\s*(.*)$/);
          if (match) {
            return {
              title: match[1].trim(),
              text: match[3].trim(),
            };
          }
          return {
            title: item.trim(),
            text: '',
          };
        })
      : fallback.maintenanceBenefits,
    maintenancePanelTitle: fallback.maintenancePanelTitle,
    maintenancePanelSubtitle: fallback.maintenancePanelSubtitle,
    maintenancePanelTag: fallback.maintenancePanelTag,
    maintenanceScoreTitle: fallback.maintenanceScoreTitle,
    maintenanceScoreDesc: fallback.maintenanceScoreDesc,
    maintenanceChecks: fallback.maintenanceChecks,
    maintenanceFootLeft: fallback.maintenanceFootLeft,
    maintenanceFootRight: fallback.maintenanceFootRight,
    maintenanceBoundary: fallback.maintenanceBoundary,
    serviceContractCta: cmsContent.maintenance?.cta ?? fallback.serviceContractCta,
    auditCta: cmsContent.maintenance?.auditCta ?? fallback.auditCta,
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
  const safeLocale = getLocale(locale);
  const globalCms = await getGlobalPageCmsContent(locale);
  const showDraftServiceAbo = process.env.SHOW_DRAFT_SERVICE_ABO === '1';
  const renderServiceShowcaseCta = (card: ServiceShowcaseCard) => {
    const detailHref = card.href ?? SERVICE_DETAIL_PATH_BY_CARD_ID[card.id];

    return detailHref ? (
      <Link
        href={detailHref}
        className="inline-flex min-h-12 min-w-[160px] items-center justify-center rounded-full border border-[#C8D6E3] bg-[#F8FAFC] px-7 py-3 text-center text-[15px] font-bold text-[#0E1A2B] shadow-sm shadow-[#0E1A2B0D] transition-colors hover:border-[#7BA190] hover:bg-[#EEF6F2] hover:text-[#24594D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7BA190]"
      >
        {card.cta}
      </Link>
    ) : (
      <LeistungenRequestButton
        label={card.cta}
        serviceIntent={card.intent}
        className="min-w-[160px] whitespace-normal px-7 text-center"
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#15202A]">
      <Header content={globalCms?.header} />
      <main>
        <LeistungenHero
          slides={content.heroSlides}
          breadcrumbs={getLeistungenBreadcrumbs(safeLocale)}
        />

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
                    {card.eyebrow && (
                      <div className="mb-8 text-center">
                        <SectionEyebrow className="mb-7 justify-center">
                          {card.eyebrow}
                        </SectionEyebrow>
                        <h3 className="mx-auto max-w-4xl break-words text-2xl font-black leading-[1.1] text-[#0E1A2B] sm:text-3xl">
                          {card.title}
                        </h3>
                      </div>
                    )}

                    <div
                      className={`grid min-w-0 gap-6 lg:items-center ${
                        card.eyebrow
                          ? 'lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10'
                          : 'lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'
                      } ${
                        index % 2 !== 0 ? 'lg:[&>div:first-child]:order-2' : ''
                      }`}
                    >
                      <div className="min-w-0">
                        {!card.eyebrow && (
                          <h3 className="break-words text-2xl font-black leading-[1.1] text-[#0E1A2B] sm:text-3xl">
                            {card.title}
                          </h3>
                        )}
                        <p
                          className={`${card.eyebrow ? 'mt-0' : 'mt-5'} text-[16px] leading-7 text-[#4A5568] ${
                            card.eyebrow
                              ? locale === 'ar'
                                ? 'border-r-2 border-[#B8643E] pr-4'
                                : 'border-l-2 border-[#B8643E] pl-4'
                              : ''
                          }`}
                        >
                          {card.description}
                        </p>

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

                        <div className={`mt-7 ${card.eyebrow ? 'flex justify-center' : ''}`}>
                          {renderServiceShowcaseCta(card)}
                        </div>
                      </div>

                      <div className="relative aspect-[16/10] min-h-[240px] overflow-hidden rounded-[22px] shadow-lg sm:min-h-[300px]">
                        <CmsImage
                          src={card.image}
                          alt={card.imageAlt ?? card.title}
                          fill
                          loading={index === 0 ? 'eager' : 'lazy'}
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

        {content.maintenanceEnabled !== false && showDraftServiceAbo && (
          <section id="wartung-servicevertraege" className="scroll-mt-28 bg-[#F8FAFC] py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <style dangerouslySetInnerHTML={{ __html: `
                .pr-abo-mini {
                  --pr-card: rgba(255, 255, 255, 0.075);
                  --pr-card-strong: rgba(255, 255, 255, 0.12);
                  --pr-line: rgba(255, 255, 255, 0.12);
                  --pr-text: #f0f4f8;
                  --pr-muted: rgba(240, 244, 248, 0.72);
                  --pr-soft: rgba(240, 244, 248, 0.52);
                  --pr-green: #6dff9f;
                  --pr-orange: #e8a47a;
                  --pr-red: #d96b45;
                  --pr-radius-xl: 28px;
                  --pr-radius-lg: 22px;
                  --pr-radius-md: 16px;
                  --pr-font: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

                  position: relative;
                  isolation: isolate;
                  width: 100%;
                  margin: 0 auto;
                  padding: 28px;
                  overflow: hidden;
                  border: 1px solid rgba(255, 255, 255, 0.11);
                  border-radius: var(--pr-radius-xl);
                  background:
                    linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
                    radial-gradient(circle at 8% 10%, rgba(184, 100, 62, 0.18), transparent 38%),
                    radial-gradient(circle at 90% 18%, rgba(123, 161, 144, 0.14), transparent 36%),
                    linear-gradient(155deg, #0f1d2e 0%, #0E1A2B 55%, #111f30 100%);
                  box-shadow: 0 8px 48px rgba(14, 26, 43, 0.32), 0 1px 0 rgba(255,255,255,0.07) inset;
                  color: var(--pr-text);
                  font-family: var(--pr-font);
                  text-align: left;
                }

                .pr-abo-mini::before {
                  content: "";
                  position: absolute;
                  inset: 0;
                  z-index: -2;
                  opacity: 0.14;
                  background-image:
                    linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
                  background-size: 38px 38px;
                  mask-image: radial-gradient(circle at 70% 28%, black, transparent 72%);
                  -webkit-mask-image: radial-gradient(circle at 70% 28%, black, transparent 72%);
                }

                .pr-abo-mini::after {
                  content: "";
                  position: absolute;
                  width: 320px;
                  height: 320px;
                  right: -120px;
                  bottom: -160px;
                  z-index: -1;
                  border-radius: 999px;
                  background: radial-gradient(circle, rgba(184, 100, 62, 0.18), transparent 68%);
                  filter: blur(8px);
                }

                .pr-abo-mini__inner {
                  display: grid;
                  grid-template-columns: minmax(0, 1.15fr) minmax(310px, 0.85fr);
                  gap: 26px;
                  align-items: stretch;
                }

                .pr-abo-mini__content {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  min-height: 390px;
                }

                .pr-abo-mini__eyebrow {
                  display: inline-flex;
                  width: fit-content;
                  align-items: center;
                  gap: 9px;
                  margin: 0 0 18px;
                  padding: 9px 12px;
                  border: 1px solid rgba(255, 255, 255, 0.14);
                  border-radius: 999px;
                  background: rgba(255, 255, 255, 0.07);
                  color: rgba(255, 255, 255, 0.82);
                  font-size: 12px;
                  font-weight: 750;
                  letter-spacing: 0.12em;
                  text-transform: uppercase;
                  line-height: 1;
                }

                .pr-abo-mini__pulse {
                  width: 8px;
                  height: 8px;
                  border-radius: 999px;
                  background: var(--pr-green);
                  box-shadow: 0 0 0 5px rgba(109, 255, 159, 0.12), 0 0 22px rgba(109, 255, 159, 0.45);
                  animation: prPulse 2s infinite;
                }

                .pr-abo-mini h2 {
                  max-width: 760px;
                  margin: 0;
                  color: var(--pr-text);
                  font-size: clamp(32px, 4.7vw, 64px);
                  line-height: 0.96;
                  letter-spacing: -0.055em;
                  text-wrap: balance;
                  font-weight: 800;
                }

                .pr-abo-mini h2 span {
                  background: linear-gradient(90deg, #ffffff 0%, #e8c4a8 36%, #c2734a 100%);
                  -webkit-background-clip: text;
                  background-clip: text;
                  color: transparent;
                }

                .pr-abo-mini__lead {
                  max-width: 650px;
                  margin: 20px 0 0;
                  color: var(--pr-muted);
                  font-size: clamp(17px, 2vw, 21px);
                  line-height: 1.48;
                }

                .pr-abo-mini__actions {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 12px;
                  margin-top: 28px;
                }

                .pr-abo-mini__btn {
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 48px;
                  padding: 0 19px;
                  border-radius: 999px;
                  font-size: 14px;
                  font-weight: 800;
                  line-height: 1;
                  text-decoration: none;
                  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
                  cursor: pointer;
                }

                .pr-abo-mini__btn:hover {
                  transform: translateY(-2px);
                }

                .pr-abo-mini__btn--primary {
                  border: 1px solid rgba(255, 255, 255, 0.18);
                  background: linear-gradient(135deg, #ff3152, #ff7043);
                  color: #fff;
                  box-shadow: 0 16px 42px rgba(255, 59, 87, 0.28);
                }

                .pr-abo-mini__btn--ghost {
                  border: 1px solid rgba(255, 255, 255, 0.17);
                  background: rgba(255, 255, 255, 0.06);
                  color: #fff;
                }

                .pr-abo-mini__benefits {
                  display: grid;
                  grid-template-columns: repeat(2, minmax(0, 1fr));
                  gap: 12px;
                  max-width: 650px;
                  margin-top: 28px;
                }

                .pr-abo-mini__benefit {
                  padding: 16px;
                  border: 1px solid rgba(255, 255, 255, 0.12);
                  border-radius: var(--pr-radius-md);
                  background: rgba(255, 255, 255, 0.055);
                }

                .pr-abo-mini__benefit strong {
                  display: block;
                  margin-bottom: 6px;
                  color: #fff;
                  font-size: 15px;
                  letter-spacing: -0.015em;
                  font-weight: 700;
                }

                .pr-abo-mini__benefit p {
                  margin: 0;
                  color: var(--pr-soft);
                  font-size: 13px;
                  line-height: 1.45;
                }

                .pr-abo-mini__boundary {
                  margin-top: 24px;
                  padding: 14px 18px;
                  border: 1px solid rgba(255, 138, 61, 0.25);
                  border-radius: var(--pr-radius-md);
                  background: rgba(255, 138, 61, 0.08);
                  color: rgba(255, 255, 255, 0.88);
                  font-size: 13px;
                  font-weight: 550;
                  line-height: 1.45;
                  max-width: 650px;
                }

                .pr-abo-mini__panel {
                  position: relative;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  min-height: 390px;
                  padding: 20px;
                  border: 1px solid rgba(255, 255, 255, 0.14);
                  border-radius: 26px;
                  background:
                    linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05)),
                    rgba(255, 255, 255, 0.04);
                  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
                  backdrop-filter: blur(14px);
                  -webkit-backdrop-filter: blur(14px);
                }

                .pr-abo-mini__panel-top {
                  display: flex;
                  justify-content: space-between;
                  gap: 14px;
                  align-items: flex-start;
                  margin-bottom: 18px;
                }

                .pr-abo-mini__panel-title {
                  margin: 0;
                  color: #fff;
                  font-size: 18px;
                  font-weight: 850;
                  letter-spacing: -0.02em;
                }

                .pr-abo-mini__panel-subtitle {
                  margin: 4px 0 0;
                  color: var(--pr-soft);
                  font-size: 13px;
                  line-height: 1.35;
                }

                .pr-abo-mini__tag {
                  flex: 0 0 auto;
                  padding: 7px 10px;
                  border-radius: 999px;
                  background: rgba(78, 228, 255, 0.12);
                  color: #baf6ff;
                  font-size: 11px;
                  font-weight: 850;
                  letter-spacing: 0.08em;
                  text-transform: uppercase;
                }

                .pr-abo-mini__score {
                  display: grid;
                  grid-template-columns: 104px minmax(0, 1fr);
                  gap: 15px;
                  align-items: center;
                  padding: 16px;
                  border: 1px solid rgba(255, 255, 255, 0.12);
                  border-radius: 20px;
                  background: rgba(0, 0, 0, 0.22);
                }

                .pr-abo-mini__ring {
                  display: grid;
                  place-items: center;
                  width: 104px;
                  height: 104px;
                  border-radius: 999px;
                  background:
                    radial-gradient(circle at center, #10131d 0 55%, transparent 56%),
                    conic-gradient(var(--pr-green) 0 68%, var(--pr-orange) 68% 86%, var(--pr-red) 86% 100%);
                  box-shadow: 0 0 34px rgba(109, 255, 159, 0.1);
                }

                .pr-abo-mini__ring span {
                  display: block;
                  color: #fff;
                  font-size: 28px;
                  font-weight: 900;
                  letter-spacing: -0.06em;
                }

                .pr-abo-mini__score-copy strong {
                  display: block;
                  color: #fff;
                  font-size: 16px;
                  margin-bottom: 6px;
                }

                .pr-abo-mini__score-copy p {
                  margin: 0;
                  color: var(--pr-soft);
                  font-size: 13px;
                  line-height: 1.45;
                }

                .pr-abo-mini__checks {
                  display: grid;
                  gap: 10px;
                  margin-top: 14px;
                }

                .pr-abo-mini__check {
                  display: flex;
                  justify-content: space-between;
                  gap: 12px;
                  align-items: center;
                  padding: 13px 14px;
                  border: 1px solid rgba(255, 255, 255, 0.11);
                  border-radius: 16px;
                  background: rgba(255, 255, 255, 0.055);
                  color: rgba(255, 255, 255, 0.82);
                  font-size: 13px;
                }

                .pr-abo-mini__status {
                  flex: 0 0 auto;
                  padding: 6px 9px;
                  border-radius: 999px;
                  font-size: 10px;
                  font-weight: 900;
                  letter-spacing: 0.08em;
                  text-transform: uppercase;
                }

                .pr-abo-mini__status--ok {
                  background: rgba(109, 255, 159, 0.13);
                  color: #baffcf;
                }

                .pr-abo-mini__status--plan {
                  background: rgba(255, 138, 61, 0.13);
                  color: #ffd2ad;
                }

                .pr-abo-mini__status--urgent {
                  background: rgba(255, 59, 87, 0.16);
                  color: #ffc1ca;
                }

                .pr-abo-mini__foot {
                  display: flex;
                  justify-content: space-between;
                  gap: 14px;
                  align-items: center;
                  margin-top: 18px;
                  padding-top: 16px;
                  border-top: 1px solid rgba(255, 255, 255, 0.11);
                  color: var(--pr-soft);
                  font-size: 12px;
                  line-height: 1.35;
                }

                .pr-abo-mini__foot strong {
                  color: #fff;
                }

                @keyframes prPulse {
                  0% {
                    box-shadow: 0 0 0 0 rgba(109, 255, 159, 0.5), 0 0 10px rgba(109, 255, 159, 0.5);
                  }
                  70% {
                    box-shadow: 0 0 0 8px rgba(109, 255, 159, 0), 0 0 20px rgba(109, 255, 159, 0.2);
                  }
                  100% {
                    box-shadow: 0 0 0 0 rgba(109, 255, 159, 0), 0 0 10px rgba(109, 255, 159, 0);
                  }
                }

                @media (max-width: 900px) {
                  .pr-abo-mini {
                    padding: 22px;
                  }

                  .pr-abo-mini__inner {
                    grid-template-columns: 1fr;
                  }

                  .pr-abo-mini__content,
                  .pr-abo-mini__panel {
                    min-height: initial;
                  }
                }

                @media (max-width: 620px) {
                  .pr-abo-mini {
                    border-radius: 24px;
                    padding: 18px;
                  }

                  .pr-abo-mini h2 {
                    font-size: clamp(31px, 12vw, 46px);
                  }

                  .pr-abo-mini__benefits,
                  .pr-abo-mini__score {
                    grid-template-columns: 1fr;
                  }

                  .pr-abo-mini__ring {
                    width: 96px;
                    height: 96px;
                  }

                  .pr-abo-mini__actions,
                  .pr-abo-mini__foot,
                  .pr-abo-mini__panel-top {
                    flex-direction: column;
                    align-items: flex-start;
                  }

                  .pr-abo-mini__btn {
                    width: 100%;
                  }
                }

                /* RTL OVERRIDES */
                html[dir="rtl"] .pr-abo-mini {
                  text-align: right;
                  background:
                    linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
                    radial-gradient(circle at 92% 10%, rgba(184, 100, 62, 0.18), transparent 38%),
                    radial-gradient(circle at 8% 18%, rgba(123, 161, 144, 0.14), transparent 36%),
                    linear-gradient(155deg, #0f1d2e 0%, #0E1A2B 55%, #111f30 100%);
                }

                html[dir="rtl"] .pr-abo-mini::before {
                  mask-image: radial-gradient(circle at 30% 28%, black, transparent 72%);
                  -webkit-mask-image: radial-gradient(circle at 30% 28%, black, transparent 72%);
                }

                html[dir="rtl"] .pr-abo-mini::after {
                  left: -120px;
                  right: auto;
                }

                html[dir="rtl"] .pr-abo-mini h2 span {
                  background: linear-gradient(-90deg, #ffffff 0%, #e8c4a8 36%, #c2734a 100%);
                  -webkit-background-clip: text;
                  background-clip: text;
                  color: transparent;
                }
              `}} />

              <div className="pr-abo-mini" aria-labelledby="pr-abo-mini-title">
                <div className="pr-abo-mini__inner">
                  <div className="pr-abo-mini__content">
                    <p className="pr-abo-mini__eyebrow">
                      <span className="pr-abo-mini__pulse"></span> {content.maintenanceEyebrow}
                    </p>

                    <h2 id="pr-abo-mini-title">
                      {content.maintenanceTitle}
                      {content.maintenanceTitleHighlight && (
                        <span>{content.maintenanceTitleHighlight}</span>
                      )}
                    </h2>

                    <p className="pr-abo-mini__lead">
                      {content.maintenanceSubline}
                    </p>

                    <div className="pr-abo-mini__actions" aria-label="Standort-Abo Aktionen">
                      <Link href="/service" className="pr-abo-mini__btn pr-abo-mini__btn--primary">
                        {content.serviceContractCta}
                      </Link>
                      <LeistungenRequestButton
                        label={content.auditCta}
                        serviceIntent="wartung-servicevertrag"
                        variant="dark-ghost"
                        className="pr-abo-mini__btn pr-abo-mini__btn--ghost"
                      />
                    </div>

                    <div className="pr-abo-mini__benefits" aria-label="Vorteile des PixelRing Standort-Abos">
                      {content.maintenanceBenefits.map((benefit, idx) => (
                        <article key={idx} className="pr-abo-mini__benefit">
                          <strong>{benefit.title}</strong>
                          <p>{benefit.text}</p>
                        </article>
                      ))}
                    </div>

                    <p className="pr-abo-mini__boundary">
                      {content.maintenanceBoundary}
                    </p>
                  </div>

                  <aside className="pr-abo-mini__panel" aria-label="Beispiel für Standort-Report">
                    <div>
                      <div className="pr-abo-mini__panel-top">
                        <div>
                          <p className="pr-abo-mini__panel-title">{content.maintenancePanelTitle}</p>
                          <p className="pr-abo-mini__panel-subtitle">{content.maintenancePanelSubtitle}</p>
                        </div>
                        <span className="pr-abo-mini__tag">{content.maintenancePanelTag}</span>
                      </div>

                      <div className="pr-abo-mini__score">
                        <div className="pr-abo-mini__ring" aria-label={`${content.maintenanceScoreTitle} 86`}>
                          <span>86</span>
                        </div>
                        <div className="pr-abo-mini__score-copy">
                          <strong>{content.maintenanceScoreTitle}</strong>
                          <p>{content.maintenanceScoreDesc}</p>
                        </div>
                      </div>

                      <div className="pr-abo-mini__checks">
                        {content.maintenanceChecks.map((check, idx) => (
                          <div key={idx} className="pr-abo-mini__check">
                            <span>{check.label}</span>
                            <span className={`pr-abo-mini__status pr-abo-mini__status--${check.statusType}`}>
                              {check.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pr-abo-mini__foot">
                      <span><strong>{content.maintenanceFootLeft}</strong></span>
                      <span>{content.maintenanceFootRight}</span>
                    </div>
                  </aside>
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
              </div>
            </div>
          </section>
        )}

        {content.trustEnabled !== false && (
          <LeistungenFooterCTA
            locale={locale}
            finalHeadline={content.finalHeadline}
            finalText={content.finalText}
            serviceIntent="leistungen-overview-request"
            imageAlt={content.finalHeadline}
          />
        )}
      </main>
      <Footer content={globalCms?.footer} />
    </div>
  );
}
