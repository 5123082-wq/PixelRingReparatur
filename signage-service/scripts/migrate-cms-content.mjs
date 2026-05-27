import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { Client } from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(rootDir, ".env.local") });
dotenv.config({ path: path.join(rootDir, ".env") });

const connectionString =
  process.env.POSTGRES_PRISMA_URL ??
  process.env.DATABASE_URL ??
  process.env.DIRECT_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL or similar.");
}

const SUPPORTED_LOCALES = ["de", "en", "ru", "tr", "pl", "ar"];
const now = new Date();

const LEISTUNGEN_CONTENT = {
  de: {
    metaTitle: "Leistungen für Reparatur, Wartung & Werbetechnik | PixelRing",
    metaDescription:
      "PixelRing unterstützt Unternehmen bei Reparatur, Diagnose, Montage, Wartung, Lichtwerbung, Branding, Druckprodukten und Servicevertraegen für Werbeanlagen.",
    heroSlides: [
      {
        id: "repair",
        title: "Reparatur & Diagnose vom Profi",
        description:
          "Ihr Partner für Werbeanlagen in Berlin & Brandenburg. Fachliche Prüfung und Umsetzung durch Spezialisten.",
        image: "/images/leistungen/hero-repair.png",
        cta: "Service starten",
      },
      {
        id: "led",
        title: "Moderne Lichtwerbung & LED-Service",
        description:
          "Lichtwerbung, die auffaellt. Wir reparieren LED-Module, Netzteile und Neonröhren fachgerecht.",
        image: "/images/leistungen/hero-led-natural.png",
        cta: "Service starten",
      },
      {
        id: "maintenance",
        title: "Wartung & Sorgenfreier Betrieb",
        description:
          "Serviceverträge für Unternehmen mit einem oder mehreren Standorten. Geplante Wartung statt Notfall.",
        image: "/images/leistungen/hero-maintenance.png",
        cta: "Service anfragen",
      },
      {
        id: "branding",
        title: "Druck, Folierung & Standort-Branding",
        description:
          "Von Schaufensterbeschriftung bis Werbematerial: klare Markenwirkung für Ihren Geschäftsstandort.",
        image: "/images/leistungen/hero-branding.png",
        cta: "Service anfragen",
      },
    ],
    serviceShowcaseTitle:
      "Servicebereiche für Werbeanlagen und Standortwerbung",
    serviceShowcaseIntro:
      "PixelRing bündelt Reparatur, Modernisierung, Diagnose, Montage und Werbematerialien in einem geführten Serviceprozess.",
    serviceShowcaseCards: [
      {
        id: "repair-maintenance",
        intent: "konstruktion-befestigung",
        title: "Reparatur & Wartung von Außenwerbung",
        description:
          "Professionelle Instandsetzung von Werbeanlagen, Leuchtwerbung und Außenwerbung. Wir erhalten bestehende Systeme durch gezielte Reparatur, Pflege und visuelle Wiederherstellung.",
        image: "/images/about/service_deep_1.png",
        cta: "Reparatur anfragen",
        details: [
          {
            label: "Konstruktion",
            value: "Rahmen, Unterkonstruktionen und Befestigungspunkte",
          },
          {
            label: "Pflege",
            value: "Reinigung, Wartung und optische Instandsetzung",
          },
          { label: "Ziel", value: "Bestehende Anlagen sinnvoll erhalten" },
        ],
      },
      {
        id: "led-modernisierung",
        intent: "lichtwerbung-led",
        title: "Modernisierung von Lichtwerbung & LED-Systemen",
        description:
          "Modernisierung und Service für Lichtwerbung, LED-Module, Netzteile, Controller und Neonröhren. Alte Anlagen werden geprüft und technisch sinnvoll aktualisiert.",
        image: "/images/about/service_deep_2.png",
        cta: "LED-Service anfragen",
        details: [
          {
            label: "Technik",
            value: "LED-Module, Netzteile, Controller und Neon",
          },
          {
            label: "Prüfung",
            value: "Stromversorgung, Verkabelung und typische Ausfallursachen",
          },
          {
            label: "Ergebnis",
            value: "Stabilere Beleuchtung und einfachere Wartung",
          },
        ],
      },
      {
        id: "audit-diagnose",
        intent: "diagnose",
        title: "Inspektion, Audit & Diagnose von Werbeanlagen",
        description:
          "Wir erfassen Zustand, Ursache, Umfang und sichtbare Risiken einer Anlage. Daraus entsteht eine nachvollziehbare Empfehlung für Reparatur, Wartung oder den nächsten Schritt.",
        image: "/images/about/service_deep_3.png",
        cta: "Diagnose starten",
        details: [
          {
            label: "Aufnahme",
            value: "Vor-Ort-Prüfung oder strukturierte Ferneinschätzung",
          },
          {
            label: "Check",
            value: "Schäden, Montagepunkte, Elektrik und Standortbedingungen",
          },
          {
            label: "Empfehlung",
            value: "Klarer Vorschlag für die nächste sinnvolle Maßnahme",
          },
        ],
      },
      {
        id: "montage-demontage",
        intent: "montage-demontage",
        title: "Montage, Demontage & Versetzung von Werbeanlagen",
        description:
          "Koordination für neue, bestehende oder zu versetzende Werbeanlagen. PixelRing plant die nächsten Schritte und stimmt die benötigten Fachleute ab.",
        image: "/images/leistungen/hero-maintenance.png",
        cta: "Montage anfragen",
        details: [
          {
            label: "Montage",
            value: "Einbau und Befestigung neuer oder bestehender Anlagen",
          },
          {
            label: "Demontage",
            value: "Rückbau, Entfernung und Vorbereitung der Fläche",
          },
          {
            label: "Versetzung",
            value: "Standortwechsel mit koordinierter Umsetzung",
          },
        ],
      },
      {
        id: "druck-branding",
        intent: "druckprodukte-branding",
        title: "Druckprodukte, Branding & Werbematerialien",
        description:
          "Laufende Versorgung mit Werbematerialien: von Druckdaten und Gestaltung bis zu Folien, Bannern, Postern, Beschriftungen und Standort-Branding.",
        image: "/images/leistungen/hero-branding.png",
        cta: "Branding anfragen",
        details: [
          {
            label: "Druckdaten",
            value: "Aufbereitung, Anpassung und Abstimmung",
          },
          {
            label: "Materialien",
            value: "Poster, Banner, Aufkleber und Hinweisschilder",
          },
          {
            label: "Standorte",
            value: "Folien, Beschriftungen und Versorgung von Filialen",
          },
        ],
      },
    ],
    serviceShowcaseFocus:
      "Unser erster Fokus liegt auf der Reparatur und sinnvollen Instandsetzung bestehender Werbeanlagen. Ersatz oder Neubau wird erst empfohlen, wenn Reparatur technisch oder wirtschaftlich nicht sinnvoll ist.",
    repairTitle: "Reparatur, Diagnose und Montage von Werbeanlagen",
    repairIntro:
      "Von der ersten Sichtprüfung bis zur Reparatur, Demontage oder Neuinstallation: PixelRing prüft den Zustand Ihrer Werbeanlage und koordiniert die passenden nächsten Schritte.",
    repairCards: [
      {
        id: "diagnose",
        intent: "diagnose",
        title: "Diagnose & Vor-Ort-Prüfung",
        summary: "Zustand, Ursache und Umfang werden strukturiert aufgenommen.",
        details:
          "Wir prüfen sichtbare Schäden, Montagepunkte, elektrische Hinweise und Standortbedingungen. Danach ist klarer, ob eine Ferneinschätzung reicht oder ein Termin vor Ort sinnvoll ist.",
      },
      {
        id: "lichtwerbung-led",
        intent: "lichtwerbung-led",
        title: "Elektrik, Lichtwerbung & LED-Service",
        summary:
          "Service für Lichtwerbung, LED-Module, Netzteile, Controller und Neonröhren.",
        details:
          "Bei Leuchtschildern und Lichtanlagen prüfen wir typische Ursachen wie Verkabelung, Stromversorgung, Controller, Transformatoren, LED-Module oder Neonröhren und koordinieren die fachliche Umsetzung.",
      },
      {
        id: "konstruktion-befestigung",
        intent: "konstruktion-befestigung",
        title: "Reparatur von Konstruktion & Befestigung",
        summary:
          "Halterungen, Rahmen, Unterkonstruktionen und Befestigungspunkte im Blick.",
        details:
          "Lose, beschädigte oder gealterte Konstruktionsteile werden bewertet. Ziel ist eine sinnvolle Instandsetzung mit klarer Empfehlung, bevor neue Konstruktionen geplant werden.",
      },
      {
        id: "reinigung-pflege",
        intent: "reinigung-pflege",
        title: "Reinigung, Pflege & optische Instandsetzung",
        summary:
          "Sichtbarkeit und Erscheinungsbild bestehender Anlagen verbessern.",
        details:
          "Wir klären, welche Reinigung, Pflege oder optische Instandsetzung passend ist.",
      },
      {
        id: "montage-demontage",
        intent: "montage-demontage",
        title: "Montage, Demontage & Versetzung",
        summary:
          "Koordinierte Umsetzung für neue, bestehende oder zu versetzende Anlagen.",
        details:
          "PixelRing koordiniert Montage, Demontage oder Standortwechsel von Werbeanlagen unter Einbezug benötigter Fachgewerke.",
      },
      {
        id: "ersatzloesung",
        intent: "diagnose",
        title: "Reparatur prüfen - Ersatzlösung nur wenn sinnvoll",
        summary:
          "Ersatz oder Neubau wird erst empfohlen, wenn Reparatur nicht sinnvoll ist.",
        details:
          "Unser erster Fokus liegt auf der Reparatur und sinnvollen Instandsetzung bestehender Werbeanlagen. Ist eine Reparatur technisch oder wirtschaftlich nicht angeraten, können wir eine passende Ersatzlösung oder Neukonstruktion anbieten.",
      },
    ],
    repairFocus:
      "Unser erster Fokus liegt auf der Reparatur und sinnvollen Instandsetzung bestehender Werbeanlagen.",
    brandingTitle:
      "Druckprodukte, Branding und Werbematerialien für Geschäftsstandorte",
    brandingIntro:
      "PixelRing unterstützt Unternehmen auch bei der laufenden Versorgung mit Werbematerialien - von Druckdaten und Gestaltung bis zu Folien, Bannern, Postern und Standort-Branding.",
    brandingCards: [
      {
        id: "design",
        intent: "druckprodukte-branding",
        title: "Design & Druckdaten",
        text: "Aufbereitung, Anpassung und Abstimmung von Druckdaten für Standort- und Werbematerialien.",
      },
      {
        id: "druckprodukte",
        intent: "druckprodukte-branding",
        title: "Druckprodukte & Werbemittel",
        text: "Poster, Banner, Aufkleber, Hinweisschilder und weitere Materialien für den laufenden Bedarf.",
      },
      {
        id: "folierung",
        intent: "folierung-beschriftung",
        title: "Folierung & Beschriftung",
        text: "Beschriftungen, Folien und sichtbare Markenelemente für Flächen, Fenster und Standorte.",
      },
      {
        id: "filialen",
        intent: "druckprodukte-branding",
        title: "Versorgung von Filialen & Standorten",
        text: "Koordinierte Materialversorgung für Unternehmen mit einem oder mehreren Standorten.",
      },
    ],
    maintenanceEyebrow: "Neues Service-Abo",
    maintenanceTitle: "Wissen Sie, was Ihre Kunden ",
    maintenanceTitleHighlight: "vor Ort wirklich sehen?",
    maintenanceSubline:
      "PixelRing prüft regelmäßig Werbeanlagen, Leuchtreklame, Folien und Printmedien — mit Foto-Report, klaren Prioritäten und planbarer Wartung pro Standort.",
    maintenanceBenefits: [
      {
        title: "Regelmäßiger Check-up",
        text: "Monatlicher Blick auf Sichtbarkeit, Schäden, veraltete Materialien und dringende Aufgaben.",
      },
      {
        title: "Planbare Betreuung",
        text: "Ein Ansprechpartner, klare Reports und Service statt spontaner Notfall-Reparaturen.",
      },
    ],
    maintenancePanelTitle: "Standort-Scan",
    maintenancePanelSubtitle: "Beispielhafter Status nach einem Check-up",
    maintenancePanelTag: "Live Report",
    maintenanceScoreTitle: "Brand Health Score",
    maintenanceScoreDesc:
      "Alle sichtbaren Elemente werden dokumentiert: Licht, Folien, Print, Befestigung und Markenbild.",
    maintenanceChecks: [
      { label: "Leuchtreklame außen", status: "OK", statusType: "ok" },
      { label: "Schaufensterfolie", status: "Planen", statusType: "plan" },
      { label: "Aktionsposter", status: "Dringend", statusType: "urgent" },
    ],
    maintenanceFootLeft: "Audit → Report → Service",
    maintenanceFootRight: "Für einzelne Standorte und Filialnetze.",
    maintenanceBoundary:
      "Der Servicevertrag ersetzt keinen unbegrenzten Reparaturvertrag. Größere Reparaturen, Ersatzteile, Höhenarbeiten und Sonderfälle werden separat geprüft und abgestimmt.",
    serviceContractCta: "Standort-Abo entdecken",
    auditCta: "Audit anfragen",
    frameTitle: "Klarer Rahmen für Ihre Anfrage",
    trustPoints: [
      "Keine Vermittlungsplattform: Ihre Anfrage geht direkt an PixelRing.",
      "Berlin & Brandenburg als Kerngebiet - weitere Regionen in Deutschland auf Anfrage.",
      "Garantie bis zu 24 Monate, abhaengig von Leistung, Material und Einsatzbedingungen.",
      "Umsetzung durch Fachteam und qualifizierte Partner unter zentraler PixelRing-Koordination.",
    ],
    finalHeadline: "Nicht sicher, ob Ihre Aufgabe passt?",
    finalText:
      "Senden Sie uns eine kurze Beschreibung oder ein Foto. PixelRing prüft den Umfang und klaert die nächsten sinnvollen Schritte.",
  },
  en: {
    metaTitle: "Services for Repair, Maintenance & Signage | PixelRing",
    metaDescription:
      "PixelRing supports businesses with repair, diagnostics, installation, maintenance, illuminated signage, branding, print products, and service contracts.",
    heroSlides: [
      {
        id: "repair",
        title: "Professional Repair & Diagnostics",
        description:
          "Your partner for signage in Berlin & Brandenburg. Specialist review and execution.",
        image: "/images/leistungen/hero-repair.png",
        cta: "Start service",
      },
      {
        id: "led",
        title: "Modern Lighting & LED Service",
        description:
          "Signage that stands out. We repair LED modules, power supplies and neon tubes professionally.",
        image: "/images/leistungen/hero-led-natural.png",
        cta: "Start service",
      },
      {
        id: "maintenance",
        title: "Maintenance & Worry-Free Operation",
        description:
          "Service contracts for companies with one or more locations. Planned maintenance instead of emergency.",
        image: "/images/leistungen/hero-maintenance.png",
        cta: "Request service",
      },
      {
        id: "branding",
        title: "Print, Vinyl & Location Branding",
        description:
          "From storefront lettering to marketing materials: clear brand presence for your business location.",
        image: "/images/leistungen/hero-branding.png",
        cta: "Request service",
      },
    ],
    serviceShowcaseTitle: "Service areas for signage and location branding",
    serviceShowcaseIntro:
      "PixelRing combines repair, modernization, diagnostics, installation and advertising materials in one guided service process.",
    serviceShowcaseCards: [
      {
        id: "repair-maintenance",
        intent: "konstruktion-befestigung",
        title: "Outdoor advertising repair & maintenance",
        description:
          "Professional repair of signage, illuminated advertising and outdoor advertising systems. We preserve existing installations through targeted repair, care and visual restoration.",
        image: "/images/about/service_deep_1.png",
        cta: "Request repair",
        details: [
          {
            label: "Structure",
            value: "Frames, substructures and fixing points",
          },
          {
            label: "Care",
            value: "Cleaning, maintenance and visual restoration",
          },
          {
            label: "Goal",
            value: "Keep existing installations in useful service",
          },
        ],
      },
      {
        id: "led-modernisierung",
        intent: "lichtwerbung-led",
        title: "Illuminated signage modernization & LED systems",
        description:
          "Modernization and service for illuminated signage, LED modules, power supplies, controllers and neon tubes. Older systems are checked and updated where it makes technical sense.",
        image: "/images/about/service_deep_2.png",
        cta: "Request LED service",
        details: [
          {
            label: "Technology",
            value: "LED modules, power supplies, controllers and neon",
          },
          {
            label: "Inspection",
            value: "Power, wiring and typical failure causes",
          },
          {
            label: "Result",
            value: "More stable lighting and easier maintenance",
          },
        ],
      },
      {
        id: "audit-diagnose",
        intent: "diagnose",
        title: "Inspection, audit & diagnostics for signage",
        description:
          "We record condition, cause, scope and visible risks. The result is a clear recommendation for repair, maintenance or the next sensible step.",
        image: "/images/about/service_deep_3.png",
        cta: "Start diagnostics",
        details: [
          {
            label: "Intake",
            value: "On-site inspection or structured remote assessment",
          },
          {
            label: "Check",
            value: "Damage, mounting points, electrics and site conditions",
          },
          {
            label: "Recommendation",
            value: "A clear proposal for the next useful measure",
          },
        ],
      },
      {
        id: "montage-demontage",
        intent: "montage-demontage",
        title: "Installation, dismantling & relocation of signage",
        description:
          "Coordination for new, existing or relocated signage. PixelRing plans the next steps and coordinates the required specialists.",
        image: "/images/leistungen/hero-maintenance.png",
        cta: "Request installation",
        details: [
          {
            label: "Installation",
            value: "Mounting and fixing new or existing systems",
          },
          {
            label: "Dismantling",
            value: "Removal, takedown and surface preparation",
          },
          {
            label: "Relocation",
            value: "Site changes with coordinated execution",
          },
        ],
      },
      {
        id: "druck-branding",
        intent: "druckprodukte-branding",
        title: "Print products, branding & advertising materials",
        description:
          "Ongoing advertising material support: from artwork and print data to vinyl, banners, posters, lettering and location branding.",
        image: "/images/leistungen/hero-branding.png",
        cta: "Request branding",
        details: [
          {
            label: "Print data",
            value: "Preparation, adaptation and coordination",
          },
          {
            label: "Materials",
            value: "Posters, banners, stickers and information signs",
          },
          {
            label: "Locations",
            value: "Vinyl, lettering and branch material supply",
          },
        ],
      },
    ],
    serviceShowcaseFocus:
      "Our first focus is repair and sensible restoration of existing signage. Replacement or new construction is recommended only when repair is not technically or economically sensible.",
    repairTitle: "Repair, diagnostics and installation of signage",
    repairIntro:
      "From the first visual check to repair, dismantling or new installation: PixelRing reviews the condition of your signage and coordinates the next sensible steps.",
    repairCards: [
      {
        id: "diagnose",
        intent: "diagnose",
        title: "Diagnostics & on-site inspection",
        summary: "Condition, cause and scope are recorded clearly.",
        details:
          "We review visible damage, mounting points, electrical clues and site conditions, then decide whether remote assessment is enough or an on-site appointment makes sense.",
      },
      {
        id: "lichtwerbung-led",
        intent: "lichtwerbung-led",
        title: "Electrical, illuminated signage & LED service",
        summary:
          "Service for illuminated signs, LED modules, power supplies, controllers and neon tubes.",
        details:
          "For light signs and lighting systems, we check common causes such as wiring, power supplies, controllers, transformers, LED modules or neon tubes and coordinate specialist execution.",
      },
      {
        id: "konstruktion-befestigung",
        intent: "konstruktion-befestigung",
        title: "Structure & mounting repair",
        summary:
          "Brackets, frames, substructures and fixing points are assessed.",
        details:
          "Loose, damaged or aged structural parts are reviewed with repair as the first goal before a new construction is planned.",
      },
      {
        id: "reinigung-pflege",
        intent: "reinigung-pflege",
        title: "Cleaning, care & visual restoration",
        summary: "Improve visibility and appearance of existing installations.",
        details:
          "We clarify which cleaning, care or visual restoration is appropriate so the installation looks professional again and avoidable follow-up damage is reduced.",
      },
      {
        id: "montage-demontage",
        intent: "montage-demontage",
        title: "Installation, dismantling & relocation",
        summary: "Coordinated work for new, existing or relocated signage.",
        details:
          "PixelRing coordinates installation, dismantling or site relocation, including next-step planning and required specialists.",
      },
      {
        id: "ersatzloesung",
        intent: "diagnose",
        title: "Check repair first - replacement only when sensible",
        summary:
          "Replacement or new construction is recommended only when repair is not sensible.",
        details:
          "Our first focus is repair and sensible restoration of existing signage. If repair is not technically or economically recommended, we can also offer a fitting replacement solution or new construction.",
      },
    ],
    repairFocus:
      "Our first focus is repair and sensible restoration of existing signage.",
    brandingTitle:
      "Print products, branding and advertising materials for business locations",
    brandingIntro:
      "PixelRing also supports businesses with ongoing advertising materials - from artwork and print data to vinyl, banners, posters and location branding.",
    brandingCards: [
      {
        id: "design",
        intent: "druckprodukte-branding",
        title: "Design & print data",
        text: "Preparation, adaptation and coordination of print data for locations and advertising materials.",
      },
      {
        id: "druckprodukte",
        intent: "druckprodukte-branding",
        title: "Print products & advertising materials",
        text: "Posters, banners, stickers, information signs and other materials for ongoing needs.",
      },
      {
        id: "folierung",
        intent: "folierung-beschriftung",
        title: "Vinyl & lettering",
        text: "Lettering, vinyl and visible brand elements for surfaces, windows and locations.",
      },
      {
        id: "filialen",
        intent: "druckprodukte-branding",
        title: "Branch and location supply",
        text: "Coordinated material supply for companies with one or more locations.",
      },
    ],
    maintenanceEyebrow: "New Service Subscription",
    maintenanceTitle: "Do you know what your customers ",
    maintenanceTitleHighlight: "actually see on site?",
    maintenanceSubline:
      "PixelRing regularly checks signage, illuminated advertising, vinyl, and print media — with photo reports, clear priorities, and planned maintenance per location.",
    maintenanceBenefits: [
      {
        title: "Regular Check-up",
        text: "Monthly check of visibility, damage, outdated materials, and urgent tasks.",
      },
      {
        title: "Planned Support",
        text: "One contact person, clear reports, and service instead of sudden emergency repairs.",
      },
    ],
    maintenancePanelTitle: "Location Scan",
    maintenancePanelSubtitle: "Example status after a check-up",
    maintenancePanelTag: "Live Report",
    maintenanceScoreTitle: "Brand Health Score",
    maintenanceScoreDesc:
      "All visible elements are documented: lighting, vinyl, print, mountings, and brand image.",
    maintenanceChecks: [
      { label: "Outdoor illuminated signage", status: "OK", statusType: "ok" },
      { label: "Storefront vinyl", status: "Plan", statusType: "plan" },
      { label: "Promo poster", status: "Urgent", statusType: "urgent" },
    ],
    maintenanceFootLeft: "Audit → Report → Service",
    maintenanceFootRight: "For single locations and branch networks.",
    maintenanceBoundary:
      "The service contract does not replace an unlimited repair agreement. Major repairs, spare parts, high-altitude work, and special cases are reviewed and agreed upon separately.",
    serviceContractCta: "Discover Location Subscription",
    auditCta: "Request Audit",
    frameTitle: "A clear frame for your request",
    trustPoints: [
      "No marketplace: your request goes directly to PixelRing.",
      "Berlin & Brandenburg as core area - other German regions on request.",
      "Warranty up to 24 months, depending on service, material and usage conditions.",
      "Execution by specialist team and qualified partners under central PixelRing coordination.",
    ],
    finalHeadline: "Not sure whether your task fits?",
    finalText:
      "Send a short description or a photo. PixelRing reviews the scope and clarifies the next sensible steps.",
  },
  ru: {
    metaTitle:
      "Услуги по ремонту, обслуживанию и рекламной технике | PixelRing",
    metaDescription:
      "PixelRing помогает компаниям с ремонтом, диагностикой, монтажом, обслуживанием, световой рекламой, брендингом, печатной продукцией и сервисными договорами.",
    heroSlides: [
      {
        id: "repair",
        title: "Профессиональный ремонт и диагностика",
        description:
          "Ваш партнер по рекламным конструкциям в Берлине и Бранденбурге. Проверка и выполнение специалистами.",
        image: "/images/leistungen/hero-repair.png",
        cta: "Запустить сервис",
      },
      {
        id: "led",
        title: "Современная световая реклама и LED-сервис",
        description:
          "Реклама, которую замечают. Профессиональный ремонт LED-модулей, блоков питания и неона.",
        image: "/images/leistungen/hero-led-natural.png",
        cta: "Запустить сервис",
      },
      {
        id: "maintenance",
        title: "Обслуживание и работа без забот",
        description:
          "Сервисные договоры для компаний с одним или несколькими филиалами. Плановое обслуживание вместо аварий.",
        image: "/images/leistungen/hero-maintenance.png",
        cta: "Запросить сервис",
      },
      {
        id: "branding",
        title: "Печать, пленка и брендинг точки",
        description:
          "От оформления витрин до рекламных материалов: понятное присутствие бренда в вашем помещении.",
        image: "/images/leistungen/hero-branding.png",
        cta: "Запросить сервис",
      },
    ],
    serviceShowcaseTitle:
      "Сервисные направления для рекламных установок и брендинга локаций",
    serviceShowcaseIntro:
      "PixelRing объединяет ремонт, модернизацию, диагностику, монтаж и рекламные материалы в одном управляемом сервисном процессе.",
    serviceShowcaseCards: [
      {
        id: "repair-maintenance",
        intent: "konstruktion-befestigung",
        title: "Ремонт и обслуживание наружной рекламы",
        description:
          "Профессиональное восстановление вывесок, световой рекламы и наружных рекламных конструкций. Мы сохраняем существующие системы через точечный ремонт, уход и визуальное восстановление.",
        image: "/images/about/service_deep_1.png",
        cta: "Запросить ремонт",
        details: [
          {
            label: "Конструкция",
            value: "Рамы, подконструкции и точки крепления",
          },
          {
            label: "Уход",
            value: "Очистка, обслуживание и визуальное восстановление",
          },
          { label: "Цель", value: "Разумно сохранить существующие установки" },
        ],
      },
      {
        id: "led-modernisierung",
        intent: "lichtwerbung-led",
        title: "Модернизация световой рекламы и LED-систем",
        description:
          "Модернизация и сервис световых вывесок, LED-модулей, блоков питания, контроллеров и неона. Старые системы проверяются и технически разумно обновляются.",
        image: "/images/about/service_deep_2.png",
        cta: "Запросить LED-сервис",
        details: [
          {
            label: "Техника",
            value: "LED-модули, блоки питания, контроллеры и неон",
          },
          {
            label: "Проверка",
            value: "Питание, проводка и типовые причины отказа",
          },
          {
            label: "Результат",
            value: "Более стабильная подсветка и проще обслуживание",
          },
        ],
      },
      {
        id: "audit-diagnose",
        intent: "diagnose",
        title: "Инспекция, аудит и диагностика рекламных установок",
        description:
          "Фиксируем состояние, причину, объем задачи и видимые риски. По итогам даем понятную рекомендацию по ремонту, обслуживанию или следующему разумному шагу.",
        image: "/images/about/service_deep_3.png",
        cta: "Начать диагностику",
        details: [
          {
            label: "Формат",
            value:
              "Выездная проверка или структурированная оценка по материалам",
          },
          {
            label: "Проверка",
            value: "Повреждения, крепления, электрика и условия локации",
          },
          {
            label: "Рекомендация",
            value: "Понятное предложение по следующей мере",
          },
        ],
      },
      {
        id: "montage-demontage",
        intent: "montage-demontage",
        title: "Монтаж, демонтаж и перенос рекламных конструкций",
        description:
          "Координация работ для новых, существующих или переносимых рекламных конструкций. PixelRing планирует следующие шаги и согласует нужных специалистов.",
        image: "/images/leistungen/hero-maintenance.png",
        cta: "Запросить монтаж",
        details: [
          {
            label: "Монтаж",
            value: "Установка и крепление новых или существующих конструкций",
          },
          {
            label: "Демонтаж",
            value: "Снятие, удаление и подготовка поверхности",
          },
          {
            label: "Перенос",
            value: "Смена локации с координацией выполнения",
          },
        ],
      },
      {
        id: "druck-branding",
        intent: "druckprodukte-branding",
        title: "Печатная продукция, брендинг и рекламные материалы",
        description:
          "Текущая поддержка рекламных материалов: от макетов и печатных данных до пленок, баннеров, постеров, надписей и брендинга локаций.",
        image: "/images/leistungen/hero-branding.png",
        cta: "Запросить брендинг",
        details: [
          {
            label: "Печатные данные",
            value: "Подготовка, адаптация и согласование",
          },
          {
            label: "Материалы",
            value: "Постеры, баннеры, наклейки и информационные таблички",
          },
          { label: "Локации", value: "Пленки, надписи и снабжение филиалов" },
        ],
      },
    ],
    serviceShowcaseFocus:
      "Наш первый фокус - ремонт и разумное восстановление существующих рекламных конструкций. Замена или новая конструкция предлагается только когда ремонт технически или экономически неразумен.",
    repairTitle: "Ремонт, диагностика и монтаж рекламных конструкций",
    repairIntro:
      "От первичного осмотра до ремонта, демонтажа или новой установки: PixelRing проверяет состояние конструкции и координирует следующие шаги.",
    repairCards: [
      {
        id: "diagnose",
        intent: "diagnose",
        title: "Диагностика и выездная проверка",
        summary: "Фиксируем состояние, причину и объем задачи.",
        details:
          "Проверяем видимые повреждения, крепления, электрические признаки и условия локации, чтобы понять, достаточно ли удаленной оценки или нужен выезд.",
      },
      {
        id: "lichtwerbung-led",
        intent: "lichtwerbung-led",
        title: "Электрика, световая реклама и LED-сервис",
        summary:
          "Сервис для световых вывесок, LED-модулей, блоков питания, контроллеров и неоновых трубок.",
        details:
          "Для световых конструкций проверяем проводку, питание, контроллеры, трансформаторы, LED-модули или неоновые трубки и координируем работу специалистов.",
      },
      {
        id: "konstruktion-befestigung",
        intent: "konstruktion-befestigung",
        title: "Ремонт конструкции и креплений",
        summary: "Оцениваем рамы, подконструкции и точки крепления.",
        details:
          "Ослабленные, поврежденные или устаревшие элементы оцениваются с приоритетом ремонта до планирования новой конструкции.",
      },
      {
        id: "reinigung-pflege",
        intent: "reinigung-pflege",
        title: "Очистка, уход и визуальное восстановление",
        summary: "Улучшаем внешний вид существующих конструкций.",
        details:
          "Определяем подходящую очистку, уход или визуальное восстановление, чтобы объект снова выглядел профессионально.",
      },
      {
        id: "montage-demontage",
        intent: "montage-demontage",
        title: "Монтаж, демонтаж и перенос",
        summary:
          "Координация работ для новых, существующих или переносимых конструкций.",
        details:
          "PixelRing координирует монтаж, демонтаж или перенос рекламных конструкций, включая план следующих шагов и привлечение специалистов.",
      },
      {
        id: "ersatzloesung",
        intent: "diagnose",
        title: "Сначала проверка ремонта - замена только при необходимости",
        summary:
          "Замена или новая конструкция предлагается только когда ремонт неразумен.",
        details:
          "Наш первый фокус - ремонт и разумное восстановление существующих конструкций. Если ремонт технически или экономически не рекомендуется, мы можем предложить подходящую замену или новую конструкцию.",
      },
    ],
    repairFocus:
      "Наш первый фокус - ремонт и разумное восстановление существующих рекламных конструкций.",
    brandingTitle:
      "Печатная продукция, брендинг и рекламные материалы для бизнес-локаций",
    brandingIntro:
      "PixelRing помогает компаниям с текущими рекламными материалами - от макетов и печатных данных до пленок, баннеров, постеров и брендинга локаций.",
    brandingCards: [
      {
        id: "design",
        intent: "druckprodukte-branding",
        title: "Дизайн и печатные данные",
        text: "Подготовка, адаптация и согласование файлов для печати и материалов локации.",
      },
      {
        id: "druckprodukte",
        intent: "druckprodukte-branding",
        title: "Печатная продукция и рекламные материалы",
        text: "Постеры, баннеры, наклейки, информационные таблички и другие материалы.",
      },
      {
        id: "folierung",
        intent: "folierung-beschriftung",
        title: "Пленки и надписи",
        text: "Брендированные надписи, пленки и видимые элементы для поверхностей, окон и локаций.",
      },
      {
        id: "filialen",
        intent: "druckprodukte-branding",
        title: "Снабжение филиалов и локаций",
        text: "Координированное обеспечение материалами для одной или нескольких точек.",
      },
    ],
    maintenanceEyebrow: "Новая подписка на сервис (Service-Abo)",
    maintenanceTitle: "Знаете ли вы, что ваши клиенты ",
    maintenanceTitleHighlight: "видят на месте на самом деле?",
    maintenanceSubline:
      "PixelRing регулярно проверяет рекламные конструкции, световую рекламу, пленки и полиграфию — с фотоотчетом, четкими приоритетами и планируемым обслуживанием для каждого филиала.",
    maintenanceBenefits: [
      {
        title: "Регулярная проверка (Check-up)",
        text: "Ежемесячный контроль видимости, повреждений, износа материалов и срочных задач.",
      },
      {
        title: "Плановое сопровождение",
        text: "Один контакт (персональный менеджер), понятные отчеты и сервис вместо внезапных аварийных ремонтов.",
      },
    ],
    maintenancePanelTitle: "Сканирование локации",
    maintenancePanelSubtitle:
      "Пример статуса после регулярной проверки (Check-up)",
    maintenancePanelTag: "Отчет онлайн (Live Report)",
    maintenanceScoreTitle: "Индекс здоровья бренда (Brand Health Score)",
    maintenanceScoreDesc:
      "Все видимые элементы документируются: свет, пленки, печать, крепления и соответствие бренду.",
    maintenanceChecks: [
      {
        label: "Наружная световая реклама",
        status: "В порядке (OK)",
        statusType: "ok",
      },
      {
        label: "Пленка на витринах",
        status: "Запланировать",
        statusType: "plan",
      },
      { label: "Промо-постер", status: "Срочно", statusType: "urgent" },
    ],
    maintenanceFootLeft:
      "Аудит → Отчет → Обслуживание (Audit → Report → Service)",
    maintenanceFootRight: "Для отдельных точек и торговых сетей.",
    maintenanceBoundary:
      "Сервисный договор не заменяет безлимитный договор на ремонт. Крупный ремонт, запчасти, высотные работы и особые случаи рассматриваются и согласуются отдельно.",
    serviceContractCta: "Узнать про подписку на локацию (Standort-Abo)",
    auditCta: "Запросить аудит",
    frameTitle: "Понятные рамки заявки",
    trustPoints: [
      "Не маркетплейс: заявка идет напрямую в PixelRing.",
      "Берлин и Бранденбург как основной регион - другие регионы Германии по запросу.",
      "Гарантия до 24 месяцев в зависимости от услуги, материала и условий использования.",
      "Выполнение командой специалистов и квалифицированными партнерами под координацией PixelRing.",
    ],
    finalHeadline: "Не уверены, подходит ли ваша задача?",
    finalText:
      "Отправьте короткое описание или фото. PixelRing проверит объем и предложит следующие разумные шаги.",
  },
  tr: {
    metaTitle: "Onarım, Bakım ve Reklam Tekniği Hizmetleri | PixelRing",
    metaDescription:
      "PixelRing; onarım, teşhis, montaj, bakım, ışıklı reklam, markalama, baskı ürünleri ve servis sözleşmeleri için işletmelere destek verir.",
    heroSlides: [
      {
        id: "repair",
        title: "Uzman Onarım ve Teşhis",
        description:
          "Berlin ve Brandenburg'daki reklam sistemleri partneriniz. Uzmanlar tarafından inceleme ve uygulama.",
        image: "/images/leistungen/hero-repair.png",
        cta: "Servisi başlat",
      },
      {
        id: "led",
        title: "Modern Işıklı Reklam ve LED Servisi",
        description:
          "Dikkat çeken reklamlar. LED modülleri, güç kaynakları ve neon tüplerini profesyonelce onarıyoruz.",
        image: "/images/leistungen/hero-led-natural.png",
        cta: "Servisi başlat",
      },
      {
        id: "maintenance",
        title: "Bakım ve Sorunsuz Operasyon",
        description:
          "Bir veya birden fazla lokasyonu olan işletmeler için servis sözleşmeleri. Acil durum yerine planlı bakım.",
        image: "/images/leistungen/hero-maintenance.png",
        cta: "Servis talep et",
      },
      {
        id: "branding",
        title: "Baskı, Folyo & Mekan Markalama",
        description:
          "Vitrin yazılarından reklam malzemelerine kadar işletme noktanız için net marka görünürlüğü.",
        image: "/images/leistungen/hero-branding.png",
        cta: "Servis talep et",
      },
    ],
    serviceShowcaseTitle:
      "Reklam sistemleri ve lokasyon markalama servis alanları",
    serviceShowcaseIntro:
      "PixelRing onarım, modernizasyon, teşhis, montaj ve reklam materyallerini tek yönetilen servis sürecinde birleştirir.",
    serviceShowcaseCards: [
      {
        id: "repair-maintenance",
        intent: "konstruktion-befestigung",
        title: "Dış reklam onarımı ve bakımı",
        description:
          "Tabela, ışıklı reklam ve dış reklam sistemlerinin profesyonel onarımı. Mevcut sistemleri hedefli onarım, bakım ve görsel yenileme ile koruruz.",
        image: "/images/about/service_deep_1.png",
        cta: "Onarım talep et",
        details: [
          {
            label: "Konstrüksiyon",
            value: "Çerçeveler, alt yapılar ve sabitleme noktaları",
          },
          { label: "Bakım", value: "Temizlik, servis ve görsel yenileme" },
          {
            label: "Hedef",
            value: "Mevcut sistemleri mantıklı şekilde korumak",
          },
        ],
      },
      {
        id: "led-modernisierung",
        intent: "lichtwerbung-led",
        title: "Işıklı reklam ve LED sistem modernizasyonu",
        description:
          "Işıklı tabelalar, LED modüller, güç kaynakları, kontrol cihazları ve neon için modernizasyon ve servis. Eski sistemler kontrol edilir ve teknik olarak mantıklıysa güncellenir.",
        image: "/images/about/service_deep_2.png",
        cta: "LED servisi talep et",
        details: [
          {
            label: "Teknik",
            value: "LED modüller, güç kaynakları, kontrol cihazları ve neon",
          },
          {
            label: "Kontrol",
            value: "Güç, kablolama ve tipik arıza nedenleri",
          },
          {
            label: "Sonuç",
            value: "Daha stabil aydınlatma ve daha kolay bakım",
          },
        ],
      },
      {
        id: "audit-diagnose",
        intent: "diagnose",
        title: "Reklam sistemleri için inspeksiyon, denetim ve teşhis",
        description:
          "Durumu, nedeni, kapsamı ve görünür riskleri kayda alırız. Sonuç; onarım, bakım veya sonraki mantıklı adım için anlaşılır bir öneridir.",
        image: "/images/about/service_deep_3.png",
        cta: "Teşhisi başlat",
        details: [
          {
            label: "Format",
            value: "Yerinde kontrol veya yapılandırılmış uzaktan değerlendirme",
          },
          {
            label: "Kontrol",
            value: "Hasarlar, bağlantılar, elektrik ve lokasyon koşulları",
          },
          { label: "Öneri", value: "Sonraki mantıklı işlem için net teklif" },
        ],
      },
      {
        id: "montage-demontage",
        intent: "montage-demontage",
        title: "Reklam sistemlerinin montajı, demontajı ve taşınması",
        description:
          "Yeni, mevcut veya taşınacak reklam sistemleri için koordinasyon. PixelRing sonraki adımları planlar ve gerekli uzmanları koordine eder.",
        image: "/images/leistungen/hero-maintenance.png",
        cta: "Montaj talep et",
        details: [
          {
            label: "Montaj",
            value: "Yeni veya mevcut sistemlerin kurulumu ve sabitlenmesi",
          },
          { label: "Demontaj", value: "Söküm, kaldırma ve yüzey hazırlığı" },
          {
            label: "Taşıma",
            value: "Koordineli uygulamayla lokasyon değişimi",
          },
        ],
      },
      {
        id: "druck-branding",
        intent: "druckprodukte-branding",
        title: "Baskı ürünleri, markalama ve reklam materyalleri",
        description:
          "Sürekli reklam materyali desteği: tasarım ve baskı dosyalarından folyo, banner, poster, yazılama ve lokasyon markalamasına kadar.",
        image: "/images/leistungen/hero-branding.png",
        cta: "Markalama talep et",
        details: [
          {
            label: "Baskı verisi",
            value: "Hazırlama, uyarlama ve koordinasyon",
          },
          {
            label: "Materyaller",
            value: "Poster, banner, sticker ve bilgilendirme levhaları",
          },
          {
            label: "Lokasyonlar",
            value: "Folyo, yazılama ve şube materyali tedariki",
          },
        ],
      },
    ],
    serviceShowcaseFocus:
      "İlk odağımız mevcut reklam sistemlerinin onarımı ve mantıklı şekilde yeniden kullanılmasıdır. Değişim veya yeni yapım yalnızca onarım teknik ya da ekonomik olarak mantıklı değilse önerilir.",
    repairTitle: "Reklam sistemleri için onarım, teşhis ve montaj",
    repairIntro:
      "İlk görsel kontrolden onarım, söküm veya yeni kuruluma kadar PixelRing sisteminizin durumunu inceler ve doğru sonraki adımları koordine eder.",
    repairCards: [
      {
        id: "diagnose",
        intent: "diagnose",
        title: "Teşhis ve yerinde kontrol",
        summary: "Durum, neden ve kapsam net şekilde kayda alınır.",
        details:
          "Görünür hasarlar, montaj noktaları, elektrik belirtileri ve lokasyon koşulları kontrol edilir; uzaktan değerlendirme mi yoksa yerinde randevu mu gerektiği netleşir.",
      },
      {
        id: "lichtwerbung-led",
        intent: "lichtwerbung-led",
        title: "Elektrik, ışıklı reklam ve LED servisi",
        summary:
          "Işıklı tabelalar, LED modüller, güç kaynakları, kontrol cihazları ve neon tüpler için servis.",
        details:
          "Işıklı sistemlerde kablolama, güç kaynağı, kontrol cihazları, transformatörler, LED modüller veya neon tüpler gibi tipik nedenler kontrol edilir.",
      },
      {
        id: "konstruktion-befestigung",
        intent: "konstruktion-befestigung",
        title: "Konstrüksiyon ve sabitleme onarımı",
        summary:
          "Taşıyıcılar, çerçeveler ve bağlantı noktaları değerlendirilir.",
        details:
          "Gevşek, hasarlı veya yıpranmış parçalar yeni konstrüksiyon planlanmadan önce onarım odaklı değerlendirilir.",
      },
      {
        id: "reinigung-pflege",
        intent: "reinigung-pflege",
        title: "Temizlik, bakım ve görsel yenileme",
        summary: "Mevcut sistemlerin görünürlüğünü ve görünümünü iyileştirir.",
        details:
          "Sistemin tekrar profesyonel görünmesi ve gereksiz sonraki hasarların azalması için uygun temizlik veya görsel yenileme belirlenir.",
      },
      {
        id: "montage-demontage",
        intent: "montage-demontage",
        title: "Montaj, demontaj ve taşıma",
        summary:
          "Yeni, mevcut veya taşınacak sistemler için koordineli uygulama.",
        details:
          "PixelRing montaj, demontaj veya lokasyon değişimini gerekli uzmanlarla birlikte koordine eder.",
      },
      {
        id: "ersatzloesung",
        intent: "diagnose",
        title: "Önce onarım kontrolü - değişim yalnızca mantıklıysa",
        summary:
          "Değişim veya yeni yapım sadece onarım mantıklı olmadığında önerilir.",
        details:
          "İlk odağımız mevcut reklam sistemlerinin onarımı ve anlamlı şekilde yeniden kullanılmasıdır. Onarım teknik veya ekonomik olarak uygun değilse uygun değişim veya yeni konstrüksiyon sunabiliriz.",
      },
    ],
    repairFocus:
      "İlk odağımız mevcut reklam sistemlerinin onarımı ve anlamlı şekilde yeniden kullanılmasıdır.",
    brandingTitle:
      "İş lokasyonları için baskı ürünleri, markalama ve reklam materyalleri",
    brandingIntro:
      "PixelRing; baskı verileri, tasarım, folyo, banner, poster ve lokasyon markalama dahil sürekli reklam materyali ihtiyacında işletmelere destek olur.",
    brandingCards: [
      {
        id: "design",
        intent: "druckprodukte-branding",
        title: "Tasarım ve baskı verileri",
        text: "Lokasyon ve reklam materyalleri için baskı dosyalarının hazırlanması ve uyarlanması.",
      },
      {
        id: "druckprodukte",
        intent: "druckprodukte-branding",
        title: "Baskı ürünleri ve reklam materyalleri",
        text: "Poster, banner, sticker, yönlendirme tabelaları ve sürekli ihtiyaç materyalleri.",
      },
      {
        id: "folierung",
        intent: "folierung-beschriftung",
        title: "Folyo ve yazılama",
        text: "Yüzeyler, vitrinler ve lokasyonlar için marka yazıları ve folyo uygulamaları.",
      },
      {
        id: "filialen",
        intent: "druckprodukte-branding",
        title: "Şube ve lokasyon tedarigi",
        text: "Bir veya daha fazla lokasyon için koordineli materyal tedariki.",
      },
    ],
    maintenanceEyebrow: "Yeni Hizmet Aboneliği",
    maintenanceTitle: "Müşterilerinizin yerinde gerçekten ne gördüğünü ",
    maintenanceTitleHighlight: "biliyor musunuz?",
    maintenanceSubline:
      "PixelRing; şube başına fotoğraflı rapor, net öncelikler ve planlanabilir bakım ile reklam sistemlerini, ışıklı reklamları, folyoları ve basılı materyalleri düzenli olarak kontrol eder.",
    maintenanceBenefits: [
      {
        title: "Düzenli Check-up",
        text: "Görünürlük, hasarlar, eskiyen malzemeler ve acil işlere aylık bakış.",
      },
      {
        title: "Planlanabilir Destek",
        text: "Tek muhatap, net raporlar ve spontane acil durum onarımları yerine planlı hizmet.",
      },
    ],
    maintenancePanelTitle: "Lokasyon Taraması",
    maintenancePanelSubtitle: "Bir check-up sonrası örnek durum",
    maintenancePanelTag: "Canlı Rapor",
    maintenanceScoreTitle: "Marka Sağlık Skoru",
    maintenanceScoreDesc:
      "Tüm görünür unsurlar belgelenir: Işık, folyolar, baskı, sabitleme ve marka imajı.",
    maintenanceChecks: [
      { label: "Dış ışıklı reklam", status: "OK", statusType: "ok" },
      { label: "Vitrin folyosu", status: "Planla", statusType: "plan" },
      { label: "Kampanya posteri", status: "Acil", statusType: "urgent" },
    ],
    maintenanceFootLeft: "Denetim → Rapor → Servis",
    maintenanceFootRight: "Tek tek lokasyonlar ve şube ağları için.",
    maintenanceBoundary:
      "Servis sözleşmesi sınırsız onarım sözleşmesinin yerine geçmez. Büyük onarımlar, yedek parçalar, yüksekte çalışma ve özel durumlar ayrıca kontrol edilir ve kararlaştırılır.",
    serviceContractCta: "Standort-Abo Keşfet",
    auditCta: "Denetim Talep Et",
    frameTitle: "Talebiniz için net çerçeve",
    trustPoints: [
      "Pazar yeri değil: talebiniz doğrudan PixelRing'e gider.",
      "Ana bölge Berlin & Brandenburg - Almanya içindeki diğer bölgeler talep üzerine.",
      "Hizmet, materyal ve kullanım koşullarına bağlı olarak 24 aya kadar garanti.",
      "PixelRing koordinasyonunda uzman ekip ve nitelikli partnerlerle uygulama.",
    ],
    finalHeadline: "Görevinizin uygun olup olmadığından emin değil misiniz?",
    finalText:
      "Kısa bir açıklama veya fotoğraf gönderin. PixelRing kapsamı kontrol eder ve mantıklı sonraki adımları netleştirir.",
  },
  pl: {
    metaTitle: "Usługi naprawy, konserwacji i techniki reklamowej | PixelRing",
    metaDescription:
      "PixelRing wspiera firmy w naprawie, diagnostyce, montażu, konserwacji, reklamie świetlnej, brandingu, druku i umowach serwisowych.",
    heroSlides: [
      {
        id: "repair",
        title: "Profesjonalna Naprawa i Diagnostyka",
        description:
          "Twój partner w zakresie reklam w Berlinie i Brandenburgii. Ocena i wykonanie przez specjalistów.",
        image: "/images/leistungen/hero-repair.png",
        cta: "Rozpocznij serwis",
      },
      {
        id: "led",
        title: "Nowoczesna Reklama Świetlna i Serwis LED",
        description:
          "Reklama, która rzuca się w oczy. Profesjonalnie naprawiamy moduły LED, zasilacze i neony.",
        image: "/images/leistungen/hero-led-natural.png",
        cta: "Rozpocznij serwis",
      },
      {
        id: "maintenance",
        title: "Konserwacja i Bezproblemowa Praca",
        description:
          "Umowy serwisowe dla firm z jednym lub wieloma oddziałami. Planowana konserwacja zamiast awarii.",
        image: "/images/leistungen/hero-maintenance.png",
        cta: "Zapytaj o serwis",
      },
      {
        id: "branding",
        title: "Druk, folie i branding lokalu",
        description:
          "Od oznakowania witryn po materiały reklamowe: czytelna obecność marki w punkcie firmy.",
        image: "/images/leistungen/hero-branding.png",
        cta: "Zapytaj o serwis",
      },
    ],
    serviceShowcaseTitle: "Obszary usług dla reklam i brandingu lokalizacji",
    serviceShowcaseIntro:
      "PixelRing łączy naprawę, modernizację, diagnostykę, montaż i materiały reklamowe w jednym prowadzonym procesie serwisowym.",
    serviceShowcaseCards: [
      {
        id: "repair-maintenance",
        intent: "konstruktion-befestigung",
        title: "Naprawa i obsługa reklamy zewnętrznej",
        description:
          "Profesjonalna naprawa szyldów, reklamy świetlnej i zewnętrznych konstrukcji reklamowych. Utrzymujemy istniejące systemy przez celowaną naprawę, pielęgnację i odnowę wizualną.",
        image: "/images/about/service_deep_1.png",
        cta: "Zapytaj o naprawę",
        details: [
          {
            label: "Konstrukcja",
            value: "Ramy, podkonstrukcje i punkty mocowania",
          },
          {
            label: "Pielęgnacja",
            value: "Czyszczenie, serwis i odnowa wizualna",
          },
          {
            label: "Cel",
            value: "Sensowne utrzymanie istniejących instalacji",
          },
        ],
      },
      {
        id: "led-modernisierung",
        intent: "lichtwerbung-led",
        title: "Modernizacja reklamy świetlnej i systemów LED",
        description:
          "Modernizacja i serwis szyldów świetlnych, modułów LED, zasilaczy, sterowników i neonów. Starsze systemy są sprawdzane i aktualizowane tam, gdzie ma to sens techniczny.",
        image: "/images/about/service_deep_2.png",
        cta: "Zapytaj o serwis LED",
        details: [
          {
            label: "Technika",
            value: "Moduły LED, zasilacze, sterowniki i neony",
          },
          {
            label: "Kontrola",
            value: "Zasilanie, okablowanie i typowe przyczyny awarii",
          },
          {
            label: "Efekt",
            value: "Stabilniejsze oświetlenie i łatwiejsza obsługa",
          },
        ],
      },
      {
        id: "audit-diagnose",
        intent: "diagnose",
        title: "Inspekcja, audyt i diagnostyka instalacji reklamowych",
        description:
          "Rejestrujemy stan, przyczynę, zakres zadania i widoczne ryzyka. Wynikiem jest czytelna rekomendacja naprawy, konserwacji lub kolejnego sensownego kroku.",
        image: "/images/about/service_deep_3.png",
        cta: "Rozpocznij diagnostykę",
        details: [
          {
            label: "Forma",
            value: "Kontrola na miejscu albo uporządkowana ocena zdalna",
          },
          {
            label: "Kontrola",
            value: "Uszkodzenia, mocowania, elektryka i warunki lokalizacji",
          },
          {
            label: "Rekomendacja",
            value: "Jasna propozycja następnego działania",
          },
        ],
      },
      {
        id: "montage-demontage",
        intent: "montage-demontage",
        title: "Montaż, demontaż i przeniesienie reklam",
        description:
          "Koordynacja prac dla nowych, istniejących lub przenoszonych instalacji reklamowych. PixelRing planuje kolejne kroki i uzgadnia potrzebnych specjalistów.",
        image: "/images/leistungen/hero-maintenance.png",
        cta: "Zapytaj o montaż",
        details: [
          {
            label: "Montaż",
            value: "Instalacja i mocowanie nowych lub istniejących systemów",
          },
          {
            label: "Demontaż",
            value: "Zdjęcie, usunięcie i przygotowanie powierzchni",
          },
          {
            label: "Przeniesienie",
            value: "Zmiana lokalizacji ze skoordynowaną realizacją",
          },
        ],
      },
      {
        id: "druck-branding",
        intent: "druckprodukte-branding",
        title: "Druk, branding i materiały reklamowe",
        description:
          "Bieżące wsparcie materiałów reklamowych: od projektów i danych do druku po folie, banery, plakaty, oznakowanie i branding lokalizacji.",
        image: "/images/leistungen/hero-branding.png",
        cta: "Zapytaj o branding",
        details: [
          {
            label: "Dane do druku",
            value: "Przygotowanie, dopasowanie i koordynacja",
          },
          {
            label: "Materiały",
            value: "Plakaty, banery, naklejki i tablice informacyjne",
          },
          {
            label: "Lokalizacje",
            value: "Folie, oznakowanie i zaopatrzenie oddziałów",
          },
        ],
      },
    ],
    serviceShowcaseFocus:
      "Naszym pierwszym celem jest naprawa i sensowne przywrócenie istniejących reklam. Wymiana lub nowa konstrukcja jest rekomendowana tylko wtedy, gdy naprawa nie ma sensu technicznie albo ekonomicznie.",
    repairTitle: "Naprawa, diagnostyka i montaż reklam",
    repairIntro:
      "Od pierwszej kontroli wizualnej po naprawę, demontaż lub nową instalację: PixelRing ocenia stan reklamy i koordynuje kolejne sensowne kroki.",
    repairCards: [
      {
        id: "diagnose",
        intent: "diagnose",
        title: "Diagnostyka i kontrola na miejscu",
        summary:
          "Stan, przyczyna i zakres są zapisywane w uporządkowany sposób.",
        details:
          "Sprawdzamy widoczne uszkodzenia, punkty montażu, sygnały elektryczne i warunki lokalizacji, aby określić czy wystarczy ocena zdalna czy potrzebna jest wizyta.",
      },
      {
        id: "lichtwerbung-led",
        intent: "lichtwerbung-led",
        title: "Elektryka, reklama świetlna i serwis LED",
        summary:
          "Serwis kasetonów, modułów LED, zasilaczy, sterowników i rur neonowych.",
        details:
          "W instalacjach świetlnych sprawdzamy typowe przyczyny: okablowanie, zasilanie, sterowniki, transformatory, moduły LED lub rury neonowe.",
      },
      {
        id: "konstruktion-befestigung",
        intent: "konstruktion-befestigung",
        title: "Naprawa konstrukcji i mocowań",
        summary: "Ocena ram, podkonstrukcji i punktów mocowania.",
        details:
          "Luźne, uszkodzone lub zużyte elementy oceniamy z priorytetem naprawy przed planowaniem nowej konstrukcji.",
      },
      {
        id: "reinigung-pflege",
        intent: "reinigung-pflege",
        title: "Czyszczenie, pielęgnacja i odnowa wizualna",
        summary: "Poprawa widoczności i wyglądu istniejących instalacji.",
        details:
          "Dobieramy czyszczenie, pielęgnację lub odnowę wizualną, aby reklama znów wyglądała profesjonalnie.",
      },
      {
        id: "montage-demontage",
        intent: "montage-demontage",
        title: "Montaż, demontaż i przeniesienie",
        summary:
          "Koordynacja dla nowych, istniejących lub przenoszonych reklam.",
        details:
          "PixelRing koordynuje montaż, demontaż lub zmianę lokalizacji wraz z planem kolejnych kroków i specjalistami.",
      },
      {
        id: "ersatzloesung",
        intent: "diagnose",
        title: "Najpierw sprawdzenie naprawy - wymiana tylko gdy ma sens",
        summary:
          "Wymiana lub nowa konstrukcja jest rekomendowana tylko gdy naprawa nie jest sensowna.",
        details:
          "Naszym pierwszym celem jest naprawa i sensowne przywrócenie istniejących reklam. Jeśli naprawa nie jest zalecana technicznie lub ekonomicznie, możemy zaproponować wymianę albo nową konstrukcję.",
      },
    ],
    repairFocus:
      "Naszym pierwszym celem jest naprawa i sensowne przywrócenie istniejących reklam.",
    brandingTitle:
      "Produkty drukowane, branding i materiały reklamowe dla lokalizacji firm",
    brandingIntro:
      "PixelRing wspiera firmy także w bieżącym zaopatrzeniu w materiały reklamowe - od danych do druku i projektu po folie, banery, plakaty i branding lokalizacji.",
    brandingCards: [
      {
        id: "design",
        intent: "druckprodukte-branding",
        title: "Projekt i dane do druku",
        text: "Przygotowanie, dopasowanie i uzgodnienie plików do druku oraz materiałów lokalizacji.",
      },
      {
        id: "druckprodukte",
        intent: "druckprodukte-branding",
        title: "Druk i materiały reklamowe",
        text: "Plakaty, banery, naklejki, tablice informacyjne i inne materiały do bieżących potrzeb.",
      },
      {
        id: "folierung",
        intent: "folierung-beschriftung",
        title: "Folie i oznakowanie",
        text: "Napisy, folie i widoczne elementy marki dla powierzchni, okien i lokalizacji.",
      },
      {
        id: "filialen",
        intent: "druckprodukte-branding",
        title: "Zaopatrzenie oddziałów i lokalizacji",
        text: "Skoordynowane zaopatrzenie firm z jedną lub wieloma lokalizacjami.",
      },
    ],
    maintenanceEyebrow: "Nowy abonament serwisowy",
    maintenanceTitle: "Czy wiesz, co Twoi klienci ",
    maintenanceTitleHighlight: "naprawdę widzą na miejscu?",
    maintenanceSubline:
      "PixelRing regularnie sprawdza reklamy, neony, folie i materiały drukowane — z raportem fotograficznym, jasnymi priorytetami i planowaną konserwacją dla każdej lokalizacji.",
    maintenanceBenefits: [
      {
        title: "Regularny Check-up",
        text: "Miesięczna kontrola widoczności, uszkodzeń, przestarzałych materiałów i pilnych zadań.",
      },
      {
        title: "Planowane wsparcie",
        text: "Jeden kontakt, jasne raporty i serwis zamiast nagłych napraw awaryjnych.",
      },
    ],
    maintenancePanelTitle: "Skanowanie lokalizacji",
    maintenancePanelSubtitle: "Przykładowy status po check-upie",
    maintenancePanelTag: "Raport na żywo",
    maintenanceScoreTitle: "Wskaźnik zdrowia marki",
    maintenanceScoreDesc:
      "Wszystkie widoczne elementy są dokumentowane: światło, folie, druk, mocowania i wizerunek marki.",
    maintenanceChecks: [
      { label: "Reklama świetlna na zewnątrz", status: "OK", statusType: "ok" },
      { label: "Folia na witrynie", status: "Zaplanuj", statusType: "plan" },
      { label: "Plakat promocyjny", status: "Pilne", statusType: "urgent" },
    ],
    maintenanceFootLeft: "Audyt → Raport → Serwis",
    maintenanceFootRight: "Dla pojedynczych punktów i sieci handlowych.",
    maintenanceBoundary:
      "Umowa serwisowa nie zastępuje nielimitowanej umowy naprawczej. Większe naprawy, części zamienne, prace wysokościowe i przypadki specjalne są sprawdzane i uzgadniane osobno.",
    serviceContractCta: "Odkryj abonament lokalizacji",
    auditCta: "Zapytaj o audyt",
    frameTitle: "Jasne ramy zgłoszenia",
    trustPoints: [
      "To nie marketplace: zgłoszenie trafia bezpośrednio do PixelRing.",
      "Berlin i Brandenburgia jako obszar główny - inne regiony Niemiec na zapytanie.",
      "Gwarancja do 24 miesięcy, zależnie od usługi, materiału i warunków użytkowania.",
      "Realizacja przez zespół specjalistów i kwalifikowanych partnerów pod koordynacją PixelRing.",
    ],
    finalHeadline: "Nie masz pewności, czy Twoje zadanie pasuje?",
    finalText:
      "Wyślij krótki opis lub zdjęcie. PixelRing oceni zakres i wyjaśni kolejne sensowne kroki.",
  },
  ar: {
    metaTitle: "خدمات الإصلاح والصيانة وتقنيات الإعلان | PixelRing",
    metaDescription:
      "تدعم PixelRing الشركات في الإصلاح والتشخيص والتركيب والصيانة والإعلانات المضيئة والهوية التجارية والمواد المطبوعة وعقود الخدمة.",
    heroSlides: [
      {
        id: "repair",
        title: "الإصلاح والتشخيص من قبل المحترفين",
        description:
          "شريكك في اللوحات الإعلانية في برلين وبراندنبورغ. فحص وتنفيذ من قبل متخصصين.",
        image: "/images/leistungen/hero-repair.png",
        cta: "ابدأ الخدمة",
      },
      {
        id: "led",
        title: "الإعلانات المضيئة الحديثة وخدمة LED",
        description:
          "إعلانات تجذب الأنظار. نقوم بإصلاح وحدات LED ومزودات الطاقة وأنابيب النيون باحترافية.",
        image: "/images/leistungen/hero-led-natural.png",
        cta: "ابدأ الخدمة",
      },
      {
        id: "maintenance",
        title: "الصيانة والتشغيل الخالي من المتاعب",
        description:
          "عقود خدمة للشركات ذات موقع واحد أو عدة مواقع. صيانة مخططة بدلاً من حالات الطوارئ.",
        image: "/images/leistungen/hero-maintenance.png",
        cta: "اطلب الخدمة",
      },
      {
        id: "branding",
        title: "طباعة وتغليف وهوية الموقع",
        description:
          "من كتابة الواجهات إلى مواد الإعلان: حضور واضح للعلامة داخل موقع عملك.",
        image: "/images/leistungen/hero-branding.png",
        cta: "اطلب الخدمة",
      },
    ],
    serviceShowcaseTitle: "مجالات الخدمة للافتات وهوية المواقع",
    serviceShowcaseIntro:
      "تجمع PixelRing الإصلاح والتحديث والتشخيص والتركيب ومواد الإعلان في مسار خدمة واحد واضح.",
    serviceShowcaseCards: [
      {
        id: "repair-maintenance",
        intent: "konstruktion-befestigung",
        title: "إصلاح وصيانة الإعلانات الخارجية",
        description:
          "إصلاح احترافي للافتات والإعلانات المضيئة والهياكل الإعلانية الخارجية. نحافظ على الأنظمة القائمة عبر إصلاح موجه وعناية وترميم بصري.",
        image: "/images/about/service_deep_1.png",
        cta: "اطلب الإصلاح",
        details: [
          { label: "الهيكل", value: "الإطارات والهياكل الفرعية ونقاط التثبيت" },
          { label: "العناية", value: "التنظيف والصيانة والترميم البصري" },
          { label: "الهدف", value: "الحفاظ المنطقي على المنشآت القائمة" },
        ],
      },
      {
        id: "led-modernisierung",
        intent: "lichtwerbung-led",
        title: "تحديث الإعلانات المضيئة وأنظمة LED",
        description:
          "تحديث وخدمة للافتات المضيئة ووحدات LED ومزودات الطاقة ووحدات التحكم والنيون. يتم فحص الأنظمة القديمة وتحديثها عندما يكون ذلك منطقياً تقنياً.",
        image: "/images/about/service_deep_2.png",
        cta: "اطلب خدمة LED",
        details: [
          {
            label: "التقنية",
            value: "وحدات LED ومزودات الطاقة ووحدات التحكم والنيون",
          },
          { label: "الفحص", value: "الطاقة والأسلاك والأسباب الشائعة للأعطال" },
          { label: "النتيجة", value: "إضاءة أكثر ثباتاً وصيانة أسهل" },
        ],
      },
      {
        id: "audit-diagnose",
        intent: "diagnose",
        title: "فحص وتدقيق وتشخيص المنشآت الإعلانية",
        description:
          "نسجل الحالة والسبب ونطاق المهمة والمخاطر الظاهرة. والنتيجة توصية واضحة للإصلاح أو الصيانة أو الخطوة المنطقية التالية.",
        image: "/images/about/service_deep_3.png",
        cta: "ابدأ التشخيص",
        details: [
          { label: "الشكل", value: "فحص في الموقع أو تقييم منظم عن بعد" },
          { label: "الفحص", value: "الأضرار والتثبيت والكهرباء وظروف الموقع" },
          { label: "التوصية", value: "اقتراح واضح للإجراء التالي المناسب" },
        ],
      },
      {
        id: "montage-demontage",
        intent: "montage-demontage",
        title: "تركيب وفك ونقل الهياكل الإعلانية",
        description:
          "تنسيق الأعمال للمنشآت الإعلانية الجديدة أو القائمة أو المنقولة. تخطط PixelRing للخطوات التالية وتنسق المتخصصين المطلوبين.",
        image: "/images/leistungen/hero-maintenance.png",
        cta: "اطلب التركيب",
        details: [
          {
            label: "التركيب",
            value: "تركيب وتثبيت الأنظمة الجديدة أو القائمة",
          },
          { label: "الفك", value: "الإزالة والتفكيك وتحضير السطح" },
          { label: "النقل", value: "تغيير الموقع مع تنفيذ منسق" },
        ],
      },
      {
        id: "druck-branding",
        intent: "druckprodukte-branding",
        title: "مواد مطبوعة وهوية تجارية ومواد إعلانية",
        description:
          "دعم مستمر لمواد الإعلان: من التصميم وملفات الطباعة إلى الفينيل واللافتات والملصقات والكتابة وهوية الموقع.",
        image: "/images/leistungen/hero-branding.png",
        cta: "اطلب الهوية التجارية",
        details: [
          { label: "ملفات الطباعة", value: "الإعداد والتكييف والتنسيق" },
          {
            label: "المواد",
            value: "ملصقات ولافتات وملصقات لاصقة ولوحات إرشادية",
          },
          { label: "المواقع", value: "فينيل وكتابات وإمداد مواد للفروع" },
        ],
      },
    ],
    serviceShowcaseFocus:
      "تركيزنا الأول هو إصلاح اللوحات القائمة واستعادتها بشكل منطقي. لا نقترح الاستبدال أو البناء الجديد إلا عندما لا يكون الإصلاح منطقياً تقنياً أو اقتصادياً.",
    repairTitle: "إصلاح وتشخيص وتركيب اللوحات الإعلانية",
    repairIntro:
      "من الفحص البصري الأول إلى الإصلاح أو الفك أو التركيب الجديد: تفحص PixelRing حالة اللوحة وتنسق الخطوات التالية المناسبة.",
    repairCards: [
      {
        id: "diagnose",
        intent: "diagnose",
        title: "التشخيص والفحص في الموقع",
        summary: "يتم تسجيل الحالة والسبب والنطاق بشكل منظم.",
        details:
          "نفحص الأضرار الظاهرة ونقاط التثبيت والمؤشرات الكهربائية وظروف الموقع لتحديد ما إذا كان التقييم عن بعد كافياً أم أن موعداً في الموقع مناسب.",
      },
      {
        id: "lichtwerbung-led",
        intent: "lichtwerbung-led",
        title: "الكهرباء والإعلانات المضيئة وخدمة LED",
        summary:
          "خدمة للوحات المضيئة ووحدات LED ومزودات الطاقة ووحدات التحكم وأنابيب النيون.",
        details:
          "في أنظمة الإضاءة نفحص الأسباب الشائعة مثل الأسلاك ومزودات الطاقة ووحدات التحكم والمحولات ووحدات LED أو أنابيب النيون وننسق التنفيذ المتخصص.",
      },
      {
        id: "konstruktion-befestigung",
        intent: "konstruktion-befestigung",
        title: "إصلاح الهيكل والتثبيت",
        summary: "تقييم الحوامل والإطارات والهياكل الفرعية ونقاط التثبيت.",
        details:
          "يتم تقييم الأجزاء المرتخية أو المتضررة أو القديمة مع أولوية الإصلاح قبل التخطيط لهياكل جديدة.",
      },
      {
        id: "reinigung-pflege",
        intent: "reinigung-pflege",
        title: "التنظيف والعناية والترميم البصري",
        summary: "تحسين المظهر والوضوح للمنشآت القائمة.",
        details:
          "نوضح أي تنظيف أو عناية أو ترميم بصري مناسب حتى تبدو اللوحة احترافية مرة أخرى.",
      },
      {
        id: "montage-demontage",
        intent: "montage-demontage",
        title: "التركيب والفك والنقل",
        summary: "تنفيذ منسق للوحات الجديدة أو القائمة أو المنقولة.",
        details:
          "تنسق PixelRing التركيب أو الفك أو تغيير الموقع مع تحديد الخطوات التالية والمتخصصين المطلوبين.",
      },
      {
        id: "ersatzloesung",
        intent: "diagnose",
        title: "فحص الإصلاح أولاً - الاستبدال فقط عندما يكون منطقياً",
        summary:
          "لا نقترح الاستبدال أو البناء الجديد إلا عندما لا يكون الإصلاح مناسباً.",
        details:
          "تركيزنا الأول هو إصلاح اللوحات القائمة واستعادتها بشكل منطقي. إذا لم يكن الإصلاح موصى به تقنياً أو اقتصادياً، يمكننا تقديم حل بديل أو هيكل جديد مناسب.",
      },
    ],
    repairFocus:
      "تركيزنا الأول هو إصلاح اللوحات القائمة واستعادتها بشكل منطقي.",
    brandingTitle: "مواد مطبوعة وهوية تجارية ومواد إعلانية لمواقع الأعمال",
    brandingIntro:
      "تدعم PixelRing الشركات أيضاً في الإمداد المستمر بالمواد الإعلانية - من ملفات الطباعة والتصميم إلى الأفلام واللافتات والملصقات وهوية الموقع.",
    brandingCards: [
      {
        id: "design",
        intent: "druckprodukte-branding",
        title: "التصميم وملفات الطباعة",
        text: "إعداد وتكييف وتنسيق ملفات الطباعة لمواد الموقع والإعلان.",
      },
      {
        id: "druckprodukte",
        intent: "druckprodukte-branding",
        title: "منتجات الطباعة والمواد الإعلانية",
        text: "ملصقات ولافتات وملصقات لاصقة ولوحات إرشادية ومواد أخرى للاحتياج المستمر.",
      },
      {
        id: "folierung",
        intent: "folierung-beschriftung",
        title: "الأفلام والكتابة",
        text: "كتابات وأفلام وعناصر علامة تجارية مرئية للأسطح والنوافذ والمواقع.",
      },
      {
        id: "filialen",
        intent: "druckprodukte-branding",
        title: "إمداد الفروع والمواقع",
        text: "إمداد منسق للمواد للشركات ذات موقع واحد أو عدة مواقع.",
      },
    ],
    maintenanceEyebrow: "اشتراك الخدمة الجديد",
    maintenanceTitle: "هل تعرف ما يراه عملاؤك ",
    maintenanceTitleHighlight: "على أرض الواقع حقاً؟",
    maintenanceSubline:
      "تقوم PixelRing بفحص اللوحات الإعلانية، والإعلانات المضيئة، والملصقات، والوسائط المطبوعة بانتظام — مع تقرير مصور، وأولويات واضحة، وصيانة مخططة لكل موقع.",
    maintenanceBenefits: [
      {
        title: "فحص دوري منتظم",
        text: "متابعة شهرية للوضوح، والأضرار، والمواد القديمة، والمهام العاجلة.",
      },
      {
        title: "رعاية مخططة ومدروسة",
        text: "مسؤول تواصل واحد، وتقارير واضحة، وخدمة مستمرة بدلاً من الإصلاحات الطارئة المفاجئة.",
      },
    ],
    maintenancePanelTitle: "مسح الموقع",
    maintenancePanelSubtitle: "حالة نموذجية بعد عملية الفحص",
    maintenancePanelTag: "تقرير مباشر",
    maintenanceScoreTitle: "مؤشر صحة العلامة",
    maintenanceScoreDesc:
      "يتم توثيق جميع العناصر المرئية: الإضاءة، والملصقات، والطباعة، والتثبيت، وصورة العلامة التجارية.",
    maintenanceChecks: [
      { label: "الإعلانات المضيئة الخارجية", status: "سليم", statusType: "ok" },
      { label: "ملصقات الواجهة", status: "جدولة", statusType: "plan" },
      { label: "ملصق الحملة", status: "عاجل", statusType: "urgent" },
    ],
    maintenanceFootLeft: "التدقيق → التقرير → الخدمة",
    maintenanceFootRight: "للمواقع الفردية وسلاسل الفروع.",
    maintenanceBoundary:
      "لا يحل عقد الخدمة محل عقد إصلاح غير محدود. يتم فحص الإصلاحات الكبيرة، وقطع الغيار، والعمل على ارتفاعات، والحالات الخاصة والاتفاق عليها بشكل منفصل.",
    serviceContractCta: "اكتشف اشتراك المواقع",
    auditCta: "طلب فحص الموقع",
    frameTitle: "إطار واضح لطلبك",
    trustPoints: [
      "ليست منصة وساطة: يذهب طلبك مباشرة إلى PixelRing.",
      "برلين وبراندنبورغ كمنطقة أساسية - مناطق أخرى في ألمانيا عند الطلب.",
      "ضمان يصل إلى 24 شهراً حسب الخدمة والمواد وشروط الاستخدام.",
      "تنفيذ بواسطة فريق متخصص وشركاء مؤهلين تحت تنسيق PixelRing المركزي.",
    ],
    finalHeadline: "لست متأكداً إن كانت مهمتك مناسبة؟",
    finalText:
      "أرسل وصفاً قصيراً أو صورة. تفحص PixelRing النطاق وتوضح الخطوات المنطقية التالية.",
  },
};

const BUSINESS_CONTENT = {
  de: {
    metaTitle: "B2B Service & Wartung für Werbeanlagen | PixelRing",
    metaDescription:
      "Komplexer Service und Wartung für Geschäftskunden. Restaurants, Einzelhandel und Netzwerke. Alles aus einer Hand mit eigenem Kundenportal.",
    heroTitle: "Komplexer Service für Ihre Standorte",
    heroIntro:
      "Professionelle Betreuung Ihrer Werbeanlagen, Leuchtreklamen und Printmedien. Wir lösen die Probleme an Ihren Verkaufsstellen, bevor sie Ihren Kunden auffallen.",
    heroCta: "Service anfragen",
    heroImage: "/images/business/hero.png",
    targetTitle: "Für jede Unternehmensgröße",
    targetIntro:
      "Egal ob einzelner Standort oder Filialnetzwerk: Wir schließen Ihre Lücken im Rahmen eines umfassenden Servicevertrags.",
    targetGroups: [
      {
        id: "restaurants",
        title: "Gastronomie & Restaurants",
        description:
          "Reparatur von Neon, Leuchtkästen, Austausch von zerrissenen oder schmutzigen Speisekarten und Postern.",
      },
      {
        id: "salons",
        title: "Beauty & Salons",
        description:
          "Pflege und Wartung von Schaufensterbeschriftungen und eleganten Leuchtschildern.",
      },
      {
        id: "dealers",
        title: "Autohäuser",
        description:
          "Wartung von großen Pylonen, Fassadenschildern und Signaletik auf dem Gelände.",
      },
      {
        id: "retail",
        title: "Filialisten & Retail",
        description:
          "Standardisierte Prozesse und SLAs für ein konsistentes Markenbild an allen Standorten.",
      },
    ],
    auditTitle: "Audit & Betreuung",
    auditIntro:
      "Im Rahmen des Servicevertrags erhalten Sie vollständige Betreuung und Kontrolle über Ihre Verkaufsstandorte.",
    auditBenefits: [
      {
        id: "a1",
        title: "Regelmäßige Inspektion",
        description:
          "Wir prüfen proaktiv den Zustand der Lichtwerbung und Printmaterialien vor Ort.",
      },
      {
        id: "a2",
        title: "Markenkonsistenz",
        description:
          "Zerrissene Poster, veraltete Speisekarten oder schmutzige Aufkleber werden erkannt und erneuert.",
      },
      {
        id: "a3",
        title: "Planbare Kosten",
        description:
          "Feste Service-Raten (Abo-Modell) statt unberechenbarer Einzelreparaturen.",
      },
    ],
    auditCta: "Service-Audit anfragen",
    platformTitle: "Volle Kontrolle in Ihrem Kundenportal",
    platformIntro:
      "Wir bieten nicht nur Ausführung, sondern auch Transparenz. Mit einem Klick haben Sie den kompletten Überblick über alle Standorte, Audits und Reparaturstatus.",
    platformBenefits: [
      {
        id: "p1",
        title: "Echtzeit-Tracking",
        description:
          "Verfolgen Sie jeden Auftrag von der Meldung bis zur Fertigstellung auf allen Etappen.",
      },
      {
        id: "p2",
        title: "Umfassender Audit-Report",
        description:
          "Detaillierte Berichte über den Zustand jedes Standortes inkl. Foto-Dokumentation.",
      },
      {
        id: "p3",
        title: "Ein zentraler Ansprechpartner",
        description:
          "Koordination aus einer Quelle. Keine Suche nach verschiedenen Dienstleistern.",
      },
    ],
    platformNoteLead: "Ideal für Filialnetze:",
    platformNoteText:
      "eine Übersicht statt verstreuter E-Mails, Fotos und Einzelaufträge.",
    portalCta: "Kundenportal ansehen",
    portalDemoCta: "Präsentation herunterladen",
    trustTitle: "Verantwortung & Koordination",
    trustIntro:
      "Geben Sie die Verantwortung für Ihre sichtbare Marke in die Hände von Spezialisten.",
    finalHeadline: "Bereit für einen reibungslosen Betriebsablauf?",
    finalText:
      "Kontaktieren Sie uns für ein individuelles Service-Audit Ihrer Standorte.",
    finalCta: "Service anfragen",
  },
  en: {
    metaTitle: "B2B Service & Maintenance for Signage | PixelRing",
    metaDescription:
      "Complex service and maintenance for business clients. Restaurants, retail, and networks. Everything from a single source with your own customer portal.",
    heroTitle: "Comprehensive Service for Your Locations",
    heroIntro:
      "Professional care for your signage, illuminated advertising, and print media. We solve problems at your points of sale before your customers notice.",
    heroCta: "Request service",
    heroImage: "/images/business/hero.png",
    targetTitle: "For Every Business Size",
    targetIntro:
      "Whether a single location or a branch network: We cover your gaps within a comprehensive service contract.",
    targetGroups: [
      {
        id: "restaurants",
        title: "Gastronomy & Restaurants",
        description:
          "Repairing neon, light boxes, replacing torn or dirty menus and posters.",
      },
      {
        id: "salons",
        title: "Beauty & Salons",
        description:
          "Care and maintenance of window lettering and elegant illuminated signs.",
      },
      {
        id: "dealers",
        title: "Car Dealerships",
        description:
          "Maintenance of large pylons, facade signs, and site signage.",
      },
      {
        id: "retail",
        title: "Chains & Retail",
        description:
          "Standardized processes and SLAs for a consistent brand image across all locations.",
      },
    ],
    auditTitle: "Audit & Maintenance",
    auditIntro:
      "Under the service contract, you receive full support and oversight for your retail locations.",
    auditBenefits: [
      {
        id: "a1",
        title: "Regular Inspection",
        description:
          "We proactively check the condition of illuminated advertising and print materials on site.",
      },
      {
        id: "a2",
        title: "Brand Consistency",
        description:
          "Torn posters, outdated menus, or dirty stickers are identified and renewed.",
      },
      {
        id: "a3",
        title: "Predictable Costs",
        description:
          "Fixed service rates (subscription model) instead of unpredictable individual repairs.",
      },
    ],
    auditCta: "Request service audit",
    platformTitle: "Full Control in Your Customer Portal",
    platformIntro:
      "We offer not only execution but also transparency. With one click, you have a complete overview of all locations, audits, and repair statuses.",
    platformBenefits: [
      {
        id: "p1",
        title: "Real-time Tracking",
        description:
          "Track every order from report to completion at all stages.",
      },
      {
        id: "p2",
        title: "Comprehensive Audit Report",
        description:
          "Detailed reports on the condition of each location including photo documentation.",
      },
      {
        id: "p3",
        title: "One Central Contact",
        description:
          "Coordination from a single source. No need to search for different service providers.",
      },
    ],
    platformNoteLead: "Ideal for branch networks:",
    platformNoteText:
      "one overview instead of scattered emails, photos, and individual requests.",
    portalCta: "View Customer Portal",
    portalDemoCta: "Download presentation",
    trustTitle: "Responsibility & Coordination",
    trustIntro:
      "Place the responsibility for your visible brand in the hands of specialists.",
    finalHeadline: "Ready for smooth operations?",
    finalText: "Contact us for an individual service audit of your locations.",
    finalCta: "Request service",
  },
  ru: {
    metaTitle: "B2B Сервис и обслуживание вывесок | PixelRing",
    metaDescription:
      "Комплексный сервис и обслуживание для бизнеса. Рестораны, ритейл и сети. Все из одного источника с личным кабинетом.",
    heroTitle: "Комплексный подход к обслуживанию объектов",
    heroIntro:
      "Профессиональное обслуживание вывесок, световой рекламы и печатной продукции. Мы закрываем боли владельцев бизнеса, обеспечивая идеальный вид точек продаж.",
    heroCta: "Запросить сервис",
    heroImage: "/images/business/hero.png",
    targetTitle: "Для бизнеса любого масштаба",
    targetIntro:
      "Будь то ресторан, автосалон или сеть магазинов — мы решаем проблемные места комплексно в рамках договора обслуживания.",
    targetGroups: [
      {
        id: "restaurants",
        title: "Рестораны и Кафе",
        description:
          "Ремонт неона, замена порванных или грязных меню, постеров и внутренней навигации.",
      },
      {
        id: "salons",
        title: "Салоны красоты",
        description:
          "Уход за оконной пленкой, интерьерными вывесками и световыми логотипами.",
      },
      {
        id: "dealers",
        title: "Автосалоны",
        description:
          "Обслуживание крупных стел, фасадных вывесок и указателей на территории.",
      },
      {
        id: "retail",
        title: "Сетевой ритейл",
        description:
          "Единые стандарты SLA для поддержания бренда во всех точках сети.",
      },
    ],
    auditTitle: "Аудит и обслуживание",
    auditIntro:
      "В рамках договора обслуживания Вы получаете полное сопровождение и контроль своих торговых точек.",
    auditBenefits: [
      {
        id: "a1",
        title: "Регулярная инспекция",
        description:
          "Проактивный аудит состояния вывесок и рекламных материалов на объекте.",
      },
      {
        id: "a2",
        title: "Контроль бренда",
        description:
          "Своевременная замена испорченных меню, порванных плакатов и выцветших пленок.",
      },
      {
        id: "a3",
        title: "Подписочная модель",
        description:
          "Прогнозируемые расходы вместо внезапных трат на срочные ремонты.",
      },
    ],
    auditCta: "Запросить аудит",
    platformTitle: "Личный кабинет и прозрачность",
    platformIntro:
      "Полный доступ к своему личному кабинету на платформе. Вы видите все статусы, заявки и историю ремонтов.",
    platformBenefits: [
      {
        id: "p1",
        title: "Отслеживание на всех этапах",
        description:
          "Контролируйте статус каждой заявки от создания до приемки работ.",
      },
      {
        id: "p2",
        title: "Полный аудит точек",
        description:
          "Предоставляем заказчику отчет о том, что происходит на его точках продаж.",
      },
      {
        id: "p3",
        title: "Один общий источник",
        description:
          "Ответственность, гарантии и координация всех подрядчиков на нашей стороне.",
      },
    ],
    platformNoteLead: "Особенно удобно для сетей:",
    platformNoteText:
      "единый обзор вместо разрозненных писем, фотографий и отдельных заявок.",
    portalCta: "Личный кабинет",
    portalDemoCta: "Скачать презентацию",
    trustTitle: "Ответственность и Гарантии",
    trustIntro: "Делегируйте технические и визуальные проблемы специалистам.",
    finalHeadline: "Готовы к безупречной работе ваших объектов?",
    finalText: "Свяжитесь с нами для первичного аудита.",
    finalCta: "Запросить сервис",
  },
  tr: {
    metaTitle: "B2B Servis ve Tabela Bakımı | PixelRing",
    metaDescription:
      "İşletmeler için kapsamlı servis. Restoranlar, perakende ve ağlar. Kendi müşteri portalınızla tek elden çözüm.",
    heroTitle: "Lokasyonlarınız için Kapsamlı Hizmet",
    heroIntro:
      "Tabelalarınız ve baskı malzemeleriniz için profesyonel bakım. Sorunları müşterileriniz fark etmeden çözüyoruz.",
    heroCta: "Servis talep et",
    heroImage: "/images/business/hero.png",
    targetTitle: "Her İşletme Büyüklüğü İçin",
    targetIntro:
      "Tek şube veya zincir mağaza fark etmeksizin tüm eksiklerinizi servis sözleşmemizle kapatıyoruz.",
    targetGroups: [
      {
        id: "restaurants",
        title: "Restoran & Kafe",
        description: "Neon tamiri, yırtık menü ve posterlerin yenilenmesi.",
      },
      {
        id: "salons",
        title: "Güzellik Salonları",
        description: "Vitrin yazıları ve şık ışıklı tabelaların bakımı.",
      },
      {
        id: "dealers",
        title: "Oto Galerileri",
        description: "Büyük pilonların ve cephe tabelalarının bakımı.",
      },
      {
        id: "retail",
        title: "Zincir Mağazalar",
        description:
          "Tüm lokasyonlarda tutarlı bir marka imajı için standart süreçler.",
      },
    ],
    auditTitle: "Denetim ve bakım",
    auditIntro:
      "Servis sözleşmesi kapsamında satış noktalarınız için tam destek ve kontrol elde edersiniz.",
    auditBenefits: [
      {
        id: "a1",
        title: "Düzenli İnceleme",
        description:
          "Tabela ve basılı materyallerin durumunu proaktif olarak denetliyoruz.",
      },
      {
        id: "a2",
        title: "Marka Tutarlılığı",
        description: "Yırtık posterler ve eski menüler anında yenilenir.",
      },
      {
        id: "a3",
        title: "Öngörülebilir Maliyet",
        description:
          "Beklenmedik onarım masrafları yerine sabit hizmet paketleri.",
      },
    ],
    auditCta: "Servis denetimi talep et",
    platformTitle: "Müşteri Portalınızda Tam Kontrol",
    platformIntro:
      "Platformdaki kişisel hesabınıza tam erişim ile tüm talepleri ve onarım geçmişinizi takip edebilirsiniz.",
    platformBenefits: [
      {
        id: "p1",
        title: "Gerçek Zamanlı Takip",
        description: "Siparişten teslimata kadar her aşamayı izleyin.",
      },
      {
        id: "p2",
        title: "Kapsamlı Denetim Raporu",
        description:
          "Her lokasyonun güncel durumu hakkında fotoğraflı detaylı raporlar.",
      },
      {
        id: "p3",
        title: "Tek Sorumlu",
        description:
          "Tüm süreçlerin koordinasyonu ve garantisi bizim sorumluluğumuzda.",
      },
    ],
    platformNoteLead: "Şube ağları için ideal:",
    platformNoteText:
      "dağınık e-postalar, fotoğraflar ve tekil talepler yerine tek bir genel bakış.",
    portalCta: "Müşteri Portalı",
    portalDemoCta: "Sunumu indir",
    trustTitle: "Sorumluluk ve Koordinasyon",
    trustIntro: "Görünür markanızın sorumluluğunu uzmanlara bırakın.",
    finalHeadline: "Sorunsuz bir operasyona hazır mısınız?",
    finalText:
      "Şubeleriniz için bir ön denetim ayarlamak üzere bizimle iletişime geçin.",
    finalCta: "Servis talep et",
  },
  pl: {
    metaTitle: "B2B Serwis i Konserwacja Szyldów | PixelRing",
    metaDescription:
      "Kompleksowy serwis i konserwacja dla biznesu. Restauracje, sieci handlowe. Wszystko z jednego źródła z portalem klienta.",
    heroTitle: "Kompleksowa Obsługa Twoich Lokalizacji",
    heroIntro:
      "Profesjonalna opieka nad szyldami i materiałami drukowanymi. Rozwiązujemy problemy, zanim zauważą je Twoi klienci.",
    heroCta: "Zapytaj o serwis",
    heroImage: "/images/business/hero.png",
    targetTitle: "Dla Firm Każdej Wielkości",
    targetIntro:
      "Niezależnie od tego, czy masz jeden lokal, czy sieć: w ramach umowy serwisowej zajmiemy się wszystkim.",
    targetGroups: [
      {
        id: "restaurants",
        title: "Restauracje i Gastronomia",
        description: "Naprawa neonów, wymiana zniszczonych menu i plakatów.",
      },
      {
        id: "salons",
        title: "Salony Urody",
        description: "Konserwacja witryn i eleganckich szyldów świetlnych.",
      },
      {
        id: "dealers",
        title: "Salony Samochodowe",
        description: "Obsługa dużych pylonów i szyldów elewacyjnych.",
      },
      {
        id: "retail",
        title: "Sieci Handlowe",
        description:
          "Standardowe procesy i SLA dla spójnego wizerunku we wszystkich lokalizacjach.",
      },
    ],
    auditTitle: "Audyt i obsługa",
    auditIntro:
      "W ramach umowy serwisowej otrzymujesz pełne wsparcie i kontrolę nad swoimi punktami sprzedaży.",
    auditBenefits: [
      {
        id: "a1",
        title: "Regularne Inspekcje",
        description: "Proaktywnie audytujemy stan reklam i materiałów POS.",
      },
      {
        id: "a2",
        title: "Spójność Marki",
        description:
          "Szybka wymiana zniszczonych plakatów i wyblakłych naklejek.",
      },
      {
        id: "a3",
        title: "Przewidywalne Koszty",
        description: "Stałe stawki serwisowe zamiast niespodziewanych napraw.",
      },
    ],
    auditCta: "Zapytaj o audyt",
    platformTitle: "Pełna Kontrola w Portalu Klienta",
    platformIntro:
      "Zyskujesz pełny dostęp do osobistego panelu na naszej platformie. Śledź wszystkie zlecenia i historię obsługi Twojego biznesu.",
    platformBenefits: [
      {
        id: "p1",
        title: "Śledzenie w Czasie Rzeczywistym",
        description: "Monitoruj status każdej naprawy na każdym etapie.",
      },
      {
        id: "p2",
        title: "Raporty z Audytów",
        description:
          "Dostarczamy szczegółowy przegląd tego, co dzieje się w każdym punkcie.",
      },
      {
        id: "p3",
        title: "Jedno Źródło Kontaktu",
        description:
          "Gwarancja i koordynacja wszystkich prac leży po naszej stronie.",
      },
    ],
    platformNoteLead: "Idealne dla sieci placówek:",
    platformNoteText:
      "jeden widok zamiast rozproszonych e-maili, zdjęć i pojedynczych zgłoszeń.",
    portalCta: "Portal klienta",
    portalDemoCta: "Pobierz prezentację",
    trustTitle: "Odpowiedzialność i Gwarancje",
    trustIntro: "Przekaż opiekę nad wizualnym aspektem marki profesjonalistom.",
    finalHeadline: "Gotowy na bezproblemowe działanie?",
    finalText: "Skontaktuj się z nami w celu przeprowadzenia audytu.",
    finalCta: "Zapytaj o serwis",
  },
  ar: {
    metaTitle: "خدمات وصيانة الشركات | بكسل رينج",
    metaDescription:
      "خدمات شاملة وصيانة للشركات، المطاعم، شبكات التجزئة. كل شيء من مصدر واحد مع بوابة خاصة للعميل.",
    heroTitle: "خدمة شاملة لمواقعك التجارية",
    heroIntro:
      "رعاية احترافية للوحات الإعلانية والمواد المطبوعة. نحن نحل المشاكل في نقاط البيع الخاصة بك قبل أن يلاحظها عملاؤك.",
    heroCta: "اطلب الخدمة",
    heroImage: "/images/business/hero.png",
    targetTitle: "لجميع أحجام الشركات",
    targetIntro:
      "سواء كان موقعاً واحداً أو شبكة فروع: نحن نغطي احتياجاتك من خلال عقد خدمة شامل.",
    targetGroups: [
      {
        id: "restaurants",
        title: "المطاعم والمقاهي",
        description:
          "إصلاح النيون، وتغيير القوائم والملصقات الممزقة أو المتسخة.",
      },
      {
        id: "salons",
        title: "صالونات التجميل",
        description: "العناية بواجهات النوافذ واللوحات المضيئة الأنيقة.",
      },
      {
        id: "dealers",
        title: "معارض السيارات",
        description: "صيانة اللوحات الإعلانية الكبيرة ولوحات الواجهات.",
      },
      {
        id: "retail",
        title: "شبكات التجزئة",
        description:
          "عمليات موحدة لضمان صورة متسقة للعلامة التجارية في جميع المواقع.",
      },
    ],
    auditTitle: "التدقيق والصيانة",
    auditIntro:
      "ضمن عقد الخدمة، تحصل على متابعة كاملة ورقابة على نقاط البيع الخاصة بك.",
    auditBenefits: [
      {
        id: "a1",
        title: "فحص دوري",
        description:
          "نقوم بالتدقيق الاستباقي لحالة الإعلانات والمواد المطبوعة.",
      },
      {
        id: "a2",
        title: "تناسق العلامة التجارية",
        description: "الاستبدال الفوري للملصقات الممزقة والقوائم القديمة.",
      },
      {
        id: "a3",
        title: "تكاليف يمكن التنبؤ بها",
        description: "أسعار خدمات ثابتة بدلاً من الإصلاحات المفاجئة.",
      },
    ],
    auditCta: "طلب تدقيق الخدمة",
    platformTitle: "تحكم كامل في بوابة العميل الخاصة بك",
    platformIntro:
      "نمنحك وصولاً كاملاً إلى لوحتك الخاصة على منصتنا. يمكنك متابعة جميع الطلبات وتاريخ الصيانة لأعمالك.",
    platformBenefits: [
      {
        id: "p1",
        title: "تتبع مباشر",
        description: "تتبع حالة كل إصلاح في جميع مراحله.",
      },
      {
        id: "p2",
        title: "تقارير تدقيق مفصلة",
        description: "نقدم تفاصيل كاملة عما يحدث في كل موقع مع الصور.",
      },
      {
        id: "p3",
        title: "مصدر واحد للتواصل",
        description: "جميع الضمانات والتنسيق بين المقاولين تقع على عاتقنا.",
      },
    ],
    platformNoteLead: "مثالي لشبكات الفروع:",
    platformNoteText:
      "نظرة عامة واحدة بدلاً من رسائل وصور وطلبات منفصلة ومتفرقة.",
    portalCta: "عرض بوابة العميل",
    portalDemoCta: "تنزيل العرض التقديمي",
    trustTitle: "المسؤولية والضمانات",
    trustIntro: "اترك مسؤولية صورتك التجارية للمتخصصين.",
    finalHeadline: "هل أنت مستعد لعمليات خالية من المشاكل؟",
    finalText: "اتصل بنا لإجراء تدقيق لمواقعك.",
    finalCta: "اطلب الخدمة",
  },
};

const PROBLEME_CONTENT = {
  de: {
    metaTitle:
      "Probleme mit Werbeanlagen? Typische Schäden & Lösungen | PixelRing",
    metaDescription:
      "Typische Probleme mit Werbeanlagen, LED-Schildern, Leuchtkästen, Folien und Beschriftungen erkennen и direkt eine PixelRing Anfrage starten.",
    badge: "Probleme & Lösungen",
    heroTitle: "Typische Probleme mit Werbeanlagen erkennen und richtig lösen",
    heroIntro:
      "Nicht sicher, ob es Elektrik, LED, Folie, Befestigung oder Witterungsschaden ist? Beschreiben Sie das sichtbare Problem или senden Sie ein Foto. PixelRing prüft den nächsten sinnvollen Schritt.",
    heroTrust:
      "Eine Anfrage. Klare Einschätzung. Fachliche Umsetzung durch Spezialisten.",
    primaryCta: "Problem schildern",
    secondaryCta: "Foto senden",
    problemTitle: "Welche Situation passt zu Ihrem Problem?",
    problemIntro:
      "Waehlen Sie den sichtbaren Zustand. Die erste Einordnung hilft, die Anfrage schneller und genauer anzugehen.",
    problemCta: "Dazu Anfrage senden",
    problems: [
      {
        id: "no-light",
        intent: "sign-not-lighting",
        title: "Werbeanlage leuchtet nicht",
        symptom: "Die Anlage bleibt dunkel oder startet nur unzuverlässig.",
        solution:
          "PixelRing prüft typische Ursachen wie Stromversorgung, Netzteil, Anschluss, Feuchtigkeit und Steuerung.",
      },
      {
        id: "flicker",
        intent: "flickering-light",
        title: "Werbeanlage flackert",
        symptom:
          "Das Licht wirkt instabil, flackert oder faellt kurzzeitig aus.",
        solution:
          "Wir klaeren, ob LED-Module, Netzteile, Controller, Kontakte oder Feuchtigkeit eine Rolle spielen.",
      },
      {
        id: "uneven-led",
        intent: "uneven-led-light",
        title: "Ungleichmäßiges Leuchten der LEDs",
        symptom:
          "Einzelne Bereiche sind dunkler, fleckig oder deutlich anders hell.",
        solution:
          "Die Anlage wird auf Module, Zuleitung, Alterung und passende Reparatur- oder Austauschschritte geprüft.",
      },
      {
        id: "letter-out",
        intent: "letter-not-lighting",
        title: "Ein einzelner Buchstabe leuchtet nicht",
        symptom:
          "Nur ein Teil der Beschriftung oder ein Buchstabe ist ausgefallen.",
        solution:
          "PixelRing grenzt lokale Ursachen ein: Modul, Anschluss, Verdrahtung oder Elementzustand.",
      },
      {
        id: "rain-fail",
        intent: "rain-failure",
        title: "Werbeanlage schaltet nach Regen ab",
        symptom:
          "Nach Regen oder Feuchtigkeit kommt es zu Ausfall, Flackern oder Abschaltung.",
        solution:
          "Wir behandeln das als Hinweis auf Feuchtigkeit, Abdichtung, Korrosion oder elektrische Schutzabschaltung.",
      },
      {
        id: "peeling-film",
        intent: "peeling-film",
        title: "Folie an der Schaufensterflaeche hat sich gelöst",
        symptom:
          "Beschriftung oder Folie löst sich, wirft Kanten oder haftet nicht mehr sauber.",
        solution:
          "PixelRing prüft Untergrund, Alterung, Haftung und ob Reinigung, Teilersatz oder Neufolierung sinnvoll ist.",
      },
    ],
    impactTitle: "Was sich nach der Behebung verbessern kann",
    impactIntro:
      "Die Werte sind keine Garantie, sondern zeigen typische Effekte, wenn sichtbare Defekte fachlich eingegrenzt und behoben werden.",
    metrics: [
      {
        label: "Sichtbarkeit",
        before: 38,
        after: 86,
      },
      {
        label: "Standortwirkung",
        before: 44,
        after: 82,
      },
      {
        label: "Orientierung für Kunden",
        before: 51,
        after: 79,
      },
      {
        label: "Ausfallrisiko reduziert",
        before: 32,
        after: 74,
      },
    ],
    urgentTitle: "Wann ist eine dringende Reparatur noetig?",
    urgentText:
      "Bei Brandgeruch, Funkenbildung, losen Teilen, offenliegenden Leitungen, Sturmschaeden oder Gefahr für Passanten sollte der Fall direkt gemeldet werden.",
    urgentPoints: [
      "Anlage nur ausschalten, wenn das gefahrlos moeglich ist.",
      "Keine elektrischen Teile oeffnen oder Befestigungen selbst lösen.",
      "Fotos helfen, aber Sicherheit geht vor Dokumentation.",
    ],
    urgentCta: "Dringenden Fall melden",
    faqTitle: "Haeufige Fragen zu Schäden und Reparatur",
    faqs: [
      {
        question: "Muss ich wissen, welche Technik verbaut ist?",
        answer:
          "Nein. Ein sichtbares Problem, Fotos und der Standort reichen für die erste Einordnung oft aus.",
      },
      {
        question:
          "Kann PixelRing sofort sagen, ob repariert oder ersetzt wird?",
        answer:
          "Eine Empfehlung erfolgt nach Prüfung. Der erste Fokus liegt auf sinnvoller Reparatur und Instandsetzung.",
      },
      {
        question: "Soll ich bei elektrischen Problemen selbst prüfen?",
        answer:
          "Nein. Schalten Sie nur ab, wenn es gefahrlos moeglich ist, und melden Sie den Fall direkt.",
      },
    ],
    finalTitle: "Nicht sicher, welches Problem vorliegt?",
    finalText:
      "Senden Sie uns ein Foto oder beschreiben Sie kurz, was sichtbar ist. PixelRing prüft den Fall und klaert die nächsten sinnvollen Schritte.",
  },
  en: {
    metaTitle: "Signage Problems? Common Damage & Solutions | PixelRing",
    metaDescription:
      "Understand common signage, LED, lightbox, film, lettering and storefront branding problems and start a PixelRing request.",
    badge: "Problems & Solutions",
    heroTitle:
      "Recognize common signage problems and choose the right next step",
    heroIntro:
      "Not sure whether it is electrical, LED, film, mounting or weather damage? Describe the visible issue or send a photo. PixelRing checks the next sensible step.",
    heroTrust: "One request. Clear assessment. Specialist execution.",
    primaryCta: "Describe the problem",
    secondaryCta: "Send a photo",
    problemTitle: "Which situation matches your problem?",
    problemIntro:
      "Start with what you can see. The first classification helps us handle your request faster.",
    problemCta: "Send request",
    problems: [
      {
        id: "no-light",
        intent: "sign-not-lighting",
        title: "Sign does not light up",
        symptom: "The installation stays dark or starts unreliably.",
        solution:
          "PixelRing checks typical causes such as power supply, transformer, wiring, moisture and control units.",
      },
      {
        id: "flicker",
        intent: "flickering-light",
        title: "Sign flickers",
        symptom: "The light is unstable, flickers or drops out briefly.",
        solution:
          "We clarify whether LED modules, power supplies, controllers, contacts or moisture may be involved.",
      },
      {
        id: "uneven-led",
        intent: "uneven-led-light",
        title: "Uneven LED brightness",
        symptom: "Some areas are darker, patchy or visibly different.",
        solution:
          "The system is checked for modules, supply lines, ageing and suitable repair or replacement steps.",
      },
      {
        id: "letter-out",
        intent: "letter-not-lighting",
        title: "One letter is not lighting",
        symptom: "Only part of the lettering or one letter has failed.",
        solution:
          "PixelRing narrows down local causes such as module, connection, wiring or element condition.",
      },
      {
        id: "rain-fail",
        intent: "rain-failure",
        title: "Sign fails after rain",
        symptom:
          "After rain or moisture, the installation fails, flickers or switches off.",
        solution:
          "We treat this as a sign of moisture, sealing issues, corrosion or electrical safety shutdown.",
      },
      {
        id: "peeling-film",
        intent: "peeling-film",
        title: "Film peeling from storefront",
        symptom:
          "Lettering or vinyl is coming loose, peeling at the edges or not adhering cleanly.",
        solution:
          "PixelRing checks surface, ageing, adhesion and whether cleaning, partial replacement or re-filming is sensible.",
      },
    ],
    impactTitle: "What can improve after the fix",
    impactIntro:
      "These values are not a guarantee but show typical effects when visible defects are professionally narrowed down and resolved.",
    metrics: [
      {
        label: "Visibility",
        before: 38,
        after: 86,
      },
      {
        label: "Site impact",
        before: 44,
        after: 82,
      },
      {
        label: "Customer orientation",
        before: 51,
        after: 79,
      },
      {
        label: "Outage risk reduced",
        before: 32,
        after: 74,
      },
    ],
    urgentTitle: "When is an urgent repair needed?",
    urgentText:
      "In case of burning smell, sparks, loose parts, exposed cables, storm damage or danger to passers-by, the case should be reported immediately.",
    urgentPoints: [
      "Only switch off the system if it is safe to do so.",
      "Do not open electrical parts or loosen fastenings yourself.",
      "Photos help, but safety comes before documentation.",
    ],
    urgentCta: "Report urgent case",
    faqTitle: "Common questions about damage and repair",
    faqs: [
      {
        question: "Do I need to know which technology is installed?",
        answer:
          "No. A visible issue, photos and the location are often enough for the first assessment.",
      },
      {
        question:
          "Can PixelRing immediately say whether it will be repaired or replaced?",
        answer:
          "A recommendation is made after inspection. The first focus is on sensible repair and restoration.",
      },
      {
        question: "Should I check electrical issues myself?",
        answer:
          "No. Only switch off if safe to do so and report the case directly.",
      },
    ],
    finalTitle: "Not sure which problem you have?",
    finalText:
      "Send us a photo or describe briefly what is visible. PixelRing checks the case and clarifies the next sensible steps.",
  },
  ru: {
    metaTitle:
      "Проблемы с рекламными конструкциями? Типичные повреждения и решения | PixelRing",
    metaDescription:
      "Узнайте о типичных проблемах с вывесками, светодиодами, световыми коробами, пленками и брендингом и отправьте заявку в PixelRing.",
    badge: "Проблемы и решения",
    heroTitle:
      "Распознать типичные проблемы с рекламными конструкциями и выбрать правильный шаг",
    heroIntro:
      "Не уверены, что это — электрика, светодиоды, пленка, крепление или повреждение от погоды? Опишите проблему или отправьте фото. PixelRing проверит следующий разумный шаг.",
    heroTrust: "Одна заявка. Четкая оценка. Выполнение специалистами.",
    primaryCta: "Описать проблему",
    secondaryCta: "Отправить фото",
    problemTitle: "Какая ситуация подходит под вашу проблему?",
    problemIntro:
      "Выберите видимое состояние. Первая классификация помогает быстрее и точнее обработать заявку.",
    problemCta: "Отправить заявку",
    problems: [
      {
        id: "no-light",
        intent: "sign-not-lighting",
        title: "Вывеска не светится",
        symptom: "Конструкция остается темной или включается нестабильно.",
        solution:
          "PixelRing проверяет типичные причины, такие как питание, блок питания, подключение, влага и управление.",
      },
      {
        id: "flicker",
        intent: "flickering-light",
        title: "Вывеска мигает",
        symptom: "Свет кажется нестабильным, мигает или кратковременно гаснет.",
        solution:
          "Мы выясняем, играют ли роль светодиодные модули, блоки питания, контроллеры, контакты или влага.",
      },
      {
        id: "uneven-led",
        intent: "uneven-led-light",
        title: "Неравномерное свечение светодиодов",
        symptom:
          "Отдельные участки темнее, пятнистые или заметно отличаются по яркости.",
        solution:
          "Конструкция проверяется на модули, подводку, старение и подходящие шаги по ремонту или замене.",
      },
      {
        id: "letter-out",
        intent: "letter-not-lighting",
        title: "Отдельная буква не светится",
        symptom: "Вышла из строя только часть надписи или одна буква.",
        solution:
          "PixelRing локализует причины: модуль, подключение, проводка или состояние элемента.",
      },
      {
        id: "rain-fail",
        intent: "rain-failure",
        title: "Вывеска отключается после дождя",
        symptom:
          "После дождя или влажности происходит отказ, мигание или отключение.",
        solution:
          "Мы рассматриваем это как признак влаги, проблем с герметизацией, коррозии или срабатывания защиты.",
      },
      {
        id: "peeling-film",
        intent: "peeling-film",
        title: "Пленка на витрине отклеилась",
        symptom:
          "Надпись или пленка отклеивается, задирается по краям или плохо держится.",
        solution:
          "PixelRing проверяет основу, старение, адгезию и целесообразность очистки, частичной замены или новой оклейки.",
      },
    ],
    impactTitle: "Что может улучшиться после исправления",
    impactIntro:
      "Эти значения не являются гарантией, а показывают типичные эффекты при профессиональном устранении видимых дефектов.",
    metrics: [
      {
        label: "Видимость",
        before: 38,
        after: 86,
      },
      {
        label: "Эффект локации",
        before: 44,
        after: 82,
      },
      {
        label: "Ориентир для клиентов",
        before: 51,
        after: 79,
      },
      {
        label: "Снижение риска отказа",
        before: 32,
        after: 74,
      },
    ],
    urgentTitle: "Когда нужен срочный ремонт?",
    urgentText:
      "При запахе гари, искрах, небезопасных деталях, открытых проводах, штормовых повреждениях или опасности для прохожих следует немедленно сообщить о случае.",
    urgentPoints: [
      "Выключайте систему только если это безопасно.",
      "Не открывайте электрические части и не откручивайте крепления самостоятельно.",
      "Фото помогают, но безопасность важнее документации.",
    ],
    urgentCta: "Сообщить о срочном случае",
    faqTitle: "Частые вопросы о повреждениях и ремонте",
    faqs: [
      {
        question: "Нужно ли мне знать, какая техника установлена?",
        answer:
          "Нет. Видимой проблемы, фото и адреса часто достаточно для первой оценки.",
      },
      {
        question:
          "Может ли PixelRing сразу сказать, будет ли ремонт или замена?",
        answer:
          "Рекомендация дается после проверки. Первый фокус — на разумном ремонте и восстановлении.",
      },
      {
        question: "Должен ли я сам проверять проблемы с электрикой?",
        answer:
          "Нет. Выключайте только если это безопасно и сообщайте о случае напрямую.",
      },
    ],
    finalTitle: "Не уверены, какая именно проблема?",
    finalText:
      "Отправьте нам фото или кратко опишите, что видно. PixelRing проверит случай и предложит следующие разумные шаги.",
  },
  tr: {
    metaTitle: "Tabela Sorunları? Tipik Hasarlar ve Çözümler | PixelRing",
    metaDescription:
      "Tabela, LED, ışıklı kutu, folyo ve vitrin markalama sorunlarını anlayın ve PixelRing talebi başlatın.",
    badge: "Sorunlar ve Çözümler",
    heroTitle: "Tabela sorunlarını tanımlayın ve doğru sonraki adımı seçin",
    heroIntro:
      "Sorun elektrik, LED, folyo, montaj veya hava koşulu hasarı mı emin değil misiniz? Görünen sorunu anlatın veya fotoğraf gönderin. PixelRing mantıklı sonraki adımı inceler.",
    heroTrust: "Tek talep. Net değerlendirme. Uzman uygulama.",
    primaryCta: "Sorunu ilet",
    secondaryCta: "Servisi başlat",
    problemTitle: "Hangi durum sorununuzla eşleşiyor?",
    problemIntro:
      "Gördüğünüz belirtiyle başlayın. İlk sınıflandırma talebin daha hızlı ele alınmasına yardım eder.",
    problemCta: "Sorunu ilet",
    problems: [
      {
        id: "no-light",
        intent: "sign-not-lighting",
        title: "Tabela yanmıyor",
        symptom: "Sistem karanlık kalıyor veya güvenilir şekilde çalışmıyor.",
        solution:
          "PixelRing güç kaynağı, bağlantı, nem, kontrol ve benzeri tipik nedenleri inceler.",
      },
      {
        id: "flicker",
        intent: "flickering-light",
        title: "Tabela titriyor",
        symptom: "Işık kararsız, titriyor veya kısa süreli kesiliyor.",
        solution:
          "LED modulleri, güç kaynakları, kontrol üniteleri, temaslar veya nem olasiligi netlestirilir.",
      },
      {
        id: "uneven-led",
        intent: "uneven-led-light",
        title: "LED ışığı düzensiz",
        symptom: "Bazı alanlar daha koyu, lekeli veya farklı parlaklıkta.",
        solution:
          "Moduller, hatlar, eskime ve uygun onarım ya da değişim adımları kontrol edilir.",
      },
      {
        id: "letter-out",
        intent: "letter-not-lighting",
        title: "Tek harf yanmıyor",
        symptom: "Yazının bir kısmı veya tek bir harf arızalı.",
        solution:
          "PixelRing modul, bağlantı, kablo veya eleman durumunu yerel olarak daraltir.",
      },
      {
        id: "rain-fail",
        intent: "rain-failure",
        title: "Yağmurdan sonra kapanıyor",
        symptom:
          "Yağmur veya nemden sonra arıza, titreme ya da kapanma oluyor.",
        solution:
          "Bu nem, sızdırmazlık, korozyon veya elektrik koruma kapanması belirtisi olabilir.",
      },
      {
        id: "peeling-film",
        intent: "peeling-film",
        title: "Vitrin folyosu kalktı",
        symptom: "Yazi veya folyo kenarlardan kalkiyor ve temiz durmuyor.",
        solution:
          "Zemin, eskime, yapışma ve temizlik, kısmi değişim veya yeni folyo ihtiyacı incelenir.",
      },
      {
        id: "faded-film",
        intent: "faded-film",
        title: "Folyo soldu",
        symptom: "Renkler zayif, düzensiz veya markaya uygun değil.",
        solution:
          "Yenileme, değişim veya yeni markalama katmani daha mantıklı mi netlestirilir.",
      },
      {
        id: "loose-sign",
        intent: "loose-sign",
        title: "Tabela sallaniyor",
        symptom: "Tabela, kutu veya elemanlar gevşek ya da güvensiz görünüyor.",
        solution:
          "Bu bir güvenlik işaretidir. PixelRing montaj, alt konstrüksiyon ve sonraki adımları inceler.",
      },
      {
        id: "urgent",
        intent: "urgent-safety-risk",
        title: "Acil onarım gerekli",
        symptom:
          "Yanık kokusu, kıvılcım, gevşek parca, açık kablo veya yayalar için risk.",
        solution:
          "Tehlike varsa elektriği kapatın, mesafe bırakın ve doğrudan iletişime geçin. Kendi kendinize onarmaya çalışmayın.",
      },
    ],
    impactTitle: "Sorun giderildikten sonra ne iyileşebilir",
    impactIntro:
      "Bu degerler garanti değil, görünen kusurlar değerlendirilip giderildiğinde tipik etkileri gösterir.",
    impactBefore: "Önce",
    impactAfter: "Sonra",
    impactNote: "Örnek gösterimdir, ciro veya performans garantisi değildir.",
    metrics: [
      {
        label: "Görünürlük",
        before: 38,
        after: 86,
      },
      {
        label: "Konum etkisi",
        before: 44,
        after: 82,
      },
      {
        label: "Müşteri yönlendirme",
        before: 51,
        after: 79,
      },
      {
        label: "Arıza riski azalir",
        before: 32,
        after: 74,
      },
    ],
    urgentTitle: "Ne zaman acil onarım gerekir?",
    urgentText:
      "Yanık kokusu, kıvılcım, açık kablo, gevşek parca, fırtına hasarı veya yayalar için risk doğrudan bildirilmelidir.",
    urgentPoints: [
      "Tehlike varsa elektriği kapatın ve mesafe bırakın.",
      "Elektrik parçaları açmayın veya montajı kendiniz gevşetmeyin.",
      "Fotoğraf yardımcı olur, fakat güvenlik önce gelir.",
    ],
    urgentCta: "Acil durum bildir",
    phoneCta: "Teknisyeni ara",
    assessmentTitle: "İlk değerlendirme için ne yardımcı olur?",
    assessmentIntro:
      "Teknik terimi bilmiyorsanız fotograf ve kısa açıklama başlamak için yeterlidir.",
    assessmentPoints: [
      "sorunlu alan fotoğrafları",
      "ne değişti",
      "adres, şehir veya bölge",
      "aciliyet",
      "iletişim yolu",
    ],
    seoTitle: "Tabela hasarlarını doğru sınıflandırma",
    seoParagraphs: [
      "Işıklı tabelalar, LED tabelalar ve ışıklı kutular güç kaynakları, kontrol üniteleri, moduller, transformatörler, nem, korozyon veya eski bağlantılar nedeniyle arızalanabilir.",
      "Kalkan folyo, solan yazi, hasarli harfler veya gevşek parcalar gibi gorunen markalama sorunlari konum algısını etkiler. İlk fotoğraf değerlendirmesi kapsam belirlemeye yardim eder.",
      "PixelRing icin ana bölge Berlin ve Brandenburg'dur. Almanya icindeki diğer bölgeler göreve göre talep edilebilir.",
    ],
    faqTitle: "Hasar ve onarim hakkında sık sorular",
    supportBridge: "Daha fazla detay Support Center içinde kalır.",
    faqs: [
      {
        question: "Kurulu teknolojiyi bilmem gerekiyor mu?",
        answer:
          "Hayir. Görünen sorun, fotograf ve konum ilk degerlendirme için genellikle yeterlidir.",
      },
      {
        question: "Onarim mi değişim mi hemen belli olur mu?",
        answer:
          "Öneri incelemeden sonra verilir. İlk odak mantıklı onarim ve yenilemedir.",
      },
      {
        question: "Elektrik sorununu kendim kontrol etmeli miyim?",
        answer: "Hayir. Sadece güvenliyse kapatın ve durumu doğrudan bildirin.",
      },
    ],
    finalEyebrow: "SONRAKİ ADIM",
    finalTitle: "Sorunun ne olduğundan emin değil misiniz?",
    finalText:
      "Fotoğraf gönderin veya gorunen durumu kisaca anlatın. PixelRing sonraki mantıklı adımları netleştirir.",
  },
  pl: {
    metaTitle:
      "Problemy z reklamą? Typowe uszkodzenia i rozwiązania | PixelRing",
    metaDescription:
      "Typowe problemy szyldów, LED, kasetonów, folii i brandingu witryn oraz szybka ścieżka zgłoszenia do PixelRing.",
    badge: "Problemy i rozwiązania",
    heroTitle:
      "Rozpoznaj typowe problemy z reklamą i wybierz właściwy kolejny krok",
    heroIntro:
      "Nie wiesz, czy chodzi o elektrykę, LED, folię, mocowanie czy skutki pogody? Opisz widoczny problem albo wyślij zdjęcie. PixelRing sprawdzi następny sensowny krok.",
    heroTrust: "Jedno zgłoszenie. Jasna ocena. Wykonanie przez specjalistów.",
    primaryCta: "Przekaż zgłoszenie",
    secondaryCta: "Rozpocznij serwis",
    problemTitle: "Która sytuacja pasuje do Twojego problemu?",
    problemIntro:
      "Zacznij od tego, co widać. Pierwsza klasyfikacja pomaga szybciej obsłużyć zgłoszenie.",
    problemCta: "Przekaż zgłoszenie",
    problems: [
      {
        id: "no-light",
        intent: "sign-not-lighting",
        title: "Reklama nie świeci",
        symptom: "Instalacja pozostaje ciemna albo uruchamia się niestabilnie.",
        solution:
          "PixelRing sprawdza typowe przyczyny: zasilanie, moduł, połączenia, wilgoć i sterowanie.",
      },
      {
        id: "flicker",
        intent: "flickering-light",
        title: "Reklama miga",
        symptom: "Światło jest niestabilne, miga albo chwilowo zanika.",
        solution:
          "Wyjaśniamy, czy rolę grają moduły LED, zasilacze, kontrolery, styki albo wilgoć.",
      },
      {
        id: "uneven-led",
        intent: "uneven-led-light",
        title: "LED świeci nierówno",
        symptom:
          "Część obszarów jest ciemniejsza, plamista lub ma inną jasność.",
        solution:
          "Sprawdzane są moduły, przewody, starzenie i sensowne kroki naprawy lub wymiany.",
      },
      {
        id: "letter-out",
        intent: "letter-not-lighting",
        title: "Pojedyncza litera nie świeci",
        symptom: "Nie działa tylko część napisu albo jedna litera.",
        solution:
          "PixelRing zawęża lokalne przyczyny: moduł, połączenie, okablowanie lub stan elementu.",
      },
      {
        id: "rain-fail",
        intent: "rain-failure",
        title: "Reklama wyłącza się po deszczu",
        symptom:
          "Po deszczu lub wilgoci pojawiają się awarie, miganie lub wyłączenia.",
        solution:
          "Może to wskazywać na wilgoć, uszczelnienie, korozję lub zabezpieczenie elektryczne.",
      },
      {
        id: "peeling-film",
        intent: "peeling-film",
        title: "Folia na witrynie odkleja się",
        symptom:
          "Napis lub folia odchodzi na krawędziach i wygląda nieestetycznie.",
        solution:
          "Sprawdzamy podłoże, starzenie, przyczepność i czy lepsze jest czyszczenie, częściowa wymiana czy nowa folia.",
      },
      {
        id: "faded-film",
        intent: "faded-film",
        title: "Folia wyblakła",
        symptom: "Kolory są słabe, nierówne albo nie pasują już do marki.",
        solution:
          "Ustalamy, czy sens ma odświeżenie, wymiana lub nowa warstwa brandingu.",
      },
      {
        id: "loose-sign",
        intent: "loose-sign",
        title: "Reklama się rusza",
        symptom:
          "Szyld, kaseton albo elementy wyglądają na luźne lub niebezpieczne.",
        solution:
          "To sygnał bezpieczeństwa. PixelRing sprawdza mocowanie, podkonstrukcję i kolejne kroki.",
      },
      {
        id: "urgent",
        intent: "urgent-safety-risk",
        title: "Potrzebna pilna naprawa",
        symptom:
          "Zapach spalenizny, iskry, luźne części, odkryte przewody lub ryzyko dla pieszych.",
        solution:
          "W razie zagrożenia odłącz zasilanie, zachowaj odstęp i skontaktuj się bezpośrednio. Nie naprawiaj samodzielnie.",
      },
    ],
    impactTitle: "Co może się poprawić po usunięciu problemu",
    impactIntro:
      "To nie gwarancja, lecz przykład typowych efektów po fachowej ocenie i usunięciu widocznych usterek.",
    impactBefore: "Przed",
    impactAfter: "Po",
    impactNote: "Przykład ilustracyjny, bez gwarancji sprzedaży lub wyników.",
    metrics: [
      {
        label: "Widoczność",
        before: 38,
        after: 86,
      },
      {
        label: "Wrażenie miejsca",
        before: 44,
        after: 82,
      },
      {
        label: "Orientacja klientów",
        before: 51,
        after: 79,
      },
      {
        label: "Mniejsze ryzyko awarii",
        before: 32,
        after: 74,
      },
    ],
    urgentTitle: "Kiedy naprawa jest pilna?",
    urgentText:
      "Zapach spalenizny, iskry, luźne elementy, odsłonięte przewody, szkody po burzy lub ryzyko dla pieszych należy zgłosić bezpośrednio.",
    urgentPoints: [
      "W razie zagrożenia odłącz zasilanie i zachowaj odstęp.",
      "Nie otwieraj części elektrycznych i nie luzuj mocowań samodzielnie.",
      "Zdjęcia pomagają, ale bezpieczeństwo jest ważniejsze.",
    ],
    urgentCta: "Zgłoś pilną sprawę",
    phoneCta: "Zadzwoń do technika",
    assessmentTitle: "Co pomaga w pierwszej ocenie?",
    assessmentIntro:
      "Jeśli nie znasz terminu technicznego, wystarczy zdjęcie i krótki opis.",
    assessmentPoints: [
      "zdjęcia uszkodzonego miejsca",
      "co się zmieniło",
      "adres, miasto lub region",
      "czy sprawa jest pilna",
      "preferowany kontakt",
    ],
    seoTitle: "Jak rozpoznać typowe uszkodzenia reklam",
    seoParagraphs: [
      "Reklamy świetlne, szyldy LED i kasetony mogą przestać działać z wielu powodów: zasilacze, kontrolery, moduły, transformatory, wilgoć, korozja albo stare połączenia.",
      "Widoczne problemy brandingu, jak odklejona folia, wyblakłe napisy, uszkodzone litery lub luźne części, wpływają na odbiór lokalizacji. Pierwsza ocena ze zdjęcia pomaga określić zakres.",
      "Główny obszar PixelRing to Berlin i Brandenburgia. Inne regiony Niemiec są możliwe po zapytaniu, zależnie od zadania.",
    ],
    faqTitle: "Częste pytania o uszkodzenia i naprawę",
    supportBridge: "Szczegóły pozostają w Support Center.",
    faqs: [
      {
        question: "Czy muszę znać technologię instalacji?",
        answer:
          "Nie. Widoczny problem, zdjęcia i lokalizacja zwykle wystarczają do pierwszej oceny.",
      },
      {
        question: "Czy od razu wiadomo, czy naprawiać czy wymieniać?",
        answer:
          "Rekomendacja jest po sprawdzeniu. Najpierw patrzymy na sensowną naprawę i odtworzenie.",
      },
      {
        question: "Czy samodzielnie sprawdzać elektrykę?",
        answer:
          "Nie. Wyłącz tylko jeśli to bezpieczne i zgłoś przypadek bezpośrednio.",
      },
    ],
    finalEyebrow: "NASTĘPNY KROK",
    finalTitle: "Nie wiesz, jaki to problem?",
    finalText:
      "Wyślij zdjęcie albo krótko opisz, co widać. PixelRing sprawdzi przypadek i wyjaśni kolejne sensowne kroki.",
  },
  ar: {
    metaTitle: "مشكلات اللوحات؟ أضرار شائعة وحلول | PixelRing",
    metaDescription:
      "تعرف على مشكلات اللوحات المضيئة و LED والفويل والكتابات وابدأ طلبا واضحا مع PixelRing.",
    badge: "المشكلات والحلول",
    heroTitle: "تعرّف على مشكلات اللوحات الإعلانية واختر الخطوة الصحيحة",
    heroIntro:
      "لست متأكدا هل المشكلة كهرباء أو LED أو فويل أو تثبيت أو ضرر بسبب الطقس؟ صف المشكلة الظاهرة أو أرسل صورة. PixelRing يراجع الخطوة الأنسب.",
    heroTrust: "طلب واحد. تقييم واضح. تنفيذ بواسطة مختصين.",
    primaryCta: "أرسل المشكلة",
    secondaryCta: "ابدأ الخدمة",
    problemTitle: "أي حالة تشبه مشكلتك؟",
    problemIntro: "ابدأ بما تراه. هذا يساعد على توجيه الطلب بسرعة وبشكل أوضح.",
    problemCta: "أرسل المشكلة",
    problems: [
      {
        id: "no-light",
        intent: "sign-not-lighting",
        title: "اللوحة لا تضيء",
        symptom: "اللوحة تبقى مظلمة أو تعمل بشكل غير مستقر.",
        solution:
          "PixelRing يراجع أسبابا شائعة مثل التغذية، وحدة الطاقة، التوصيل، الرطوبة والتحكم.",
      },
      {
        id: "flicker",
        intent: "flickering-light",
        title: "اللوحة تومض",
        symptom: "الإضاءة غير مستقرة أو تنقطع لفترات قصيرة.",
        solution:
          "نوضح هل السبب قد يكون وحدات LED أو مزودات الطاقة أو المتحكمات أو نقاط التلامس أو الرطوبة.",
      },
      {
        id: "uneven-led",
        intent: "uneven-led-light",
        title: "إضاءة LED غير متساوية",
        symptom: "بعض المناطق أغمق أو مختلفة بوضوح.",
        solution:
          "يتم فحص الوحدات والتغذية والتقادم وخطوات الإصلاح أو الاستبدال المناسبة.",
      },
      {
        id: "letter-out",
        intent: "letter-not-lighting",
        title: "حرف واحد لا يضيء",
        symptom: "جزء من الكتابة أو حرف واحد فقط متوقف.",
        solution:
          "PixelRing يحدد السبب المحلي مثل الوحدة أو التوصيل أو الأسلاك أو حالة العنصر.",
      },
      {
        id: "rain-fail",
        intent: "rain-failure",
        title: "اللوحة تتوقف بعد المطر",
        symptom: "بعد المطر أو الرطوبة تظهر أعطال أو وميض أو توقف.",
        solution: "قد يشير ذلك إلى رطوبة أو عزل أو تآكل أو فصل حماية كهربائية.",
      },
      {
        id: "peeling-film",
        intent: "peeling-film",
        title: "الفويل على الواجهة انفصل",
        symptom: "الفويل أو الكتابة تنفصل من الحواف ولا تبدو نظيفة.",
        solution:
          "نفحص السطح والتقادم والالتصاق وهل الأنسب تنظيف أو استبدال جزئي أو فويل جديد.",
      },
      {
        id: "faded-film",
        intent: "faded-film",
        title: "الفويل باهت",
        symptom: "الألوان ضعيفة أو غير متساوية أو لا تناسب العلامة.",
        solution:
          "نوضح هل التحديث أو الاستبدال أو طبقة براندينغ جديدة هو الخيار الأنسب.",
      },
      {
        id: "loose-sign",
        intent: "loose-sign",
        title: "اللوحة تتحرك",
        symptom: "اللوحة أو الصندوق أو العناصر تبدو غير ثابتة أو غير آمنة.",
        solution:
          "هذه إشارة سلامة. PixelRing يراجع التثبيت والبنية والخطوات التالية.",
      },
      {
        id: "urgent",
        intent: "urgent-safety-risk",
        title: "إصلاح عاجل مطلوب",
        symptom:
          "رائحة احتراق، شرر، أجزاء مفكوكة، أسلاك مكشوفة أو خطر على المارة.",
        solution:
          "عند وجود خطر، افصل التيار وابتعد عن الموقع وتواصل مباشرة. لا تحاول الإصلاح بنفسك.",
      },
    ],
    impactTitle: "ما الذي قد يتحسن بعد حل المشكلة",
    impactIntro:
      "هذه القيم توضيحية وليست ضمانا، وتعرض آثارا شائعة بعد تقييم العطل الظاهر ومعالجته.",
    impactBefore: "قبل",
    impactAfter: "بعد",
    impactNote: "عرض توضيحي وليس ضمانا للمبيعات أو الأداء.",
    metrics: [
      {
        label: "الوضوح البصري",
        before: 38,
        after: 86,
      },
      {
        label: "انطباع الموقع",
        before: 44,
        after: 82,
      },
      {
        label: "توجيه العملاء",
        before: 51,
        after: 79,
      },
      {
        label: "تقليل خطر التعطل",
        before: 32,
        after: 74,
      },
    ],
    urgentTitle: "متى يكون الإصلاح عاجلا؟",
    urgentText:
      "رائحة الاحتراق، الشرر، الأجزاء المفكوكة، الأسلاك المكشوفة، أضرار العاصفة أو خطر المارة يجب الإبلاغ عنها مباشرة.",
    urgentPoints: [
      "عند وجود خطر، افصل التيار وابتعد عن الموقع.",
      "لا تفتح أجزاء كهربائية ولا تفك التثبيت بنفسك.",
      "الصور تساعد، لكن السلامة أولا.",
    ],
    urgentCta: "بلّغ عن حالة عاجلة",
    phoneCta: "الاتصال بالفني",
    assessmentTitle: "ما المعلومات المفيدة للتقييم الأول؟",
    assessmentIntro:
      "إذا كنت لا تعرف المصطلح الفني، تكفي صورة ووصف قصير للبدء.",
    assessmentPoints: [
      "صور للمنطقة المتأثرة",
      "ما الذي تغير",
      "العنوان أو المدينة أو المنطقة",
      "هل الحالة عاجلة",
      "طريقة التواصل المفضلة",
    ],
    seoTitle: "تصنيف الأضرار الشائعة في اللوحات",
    seoParagraphs: [
      "قد تتعطل اللوحات المضيئة و LED وصناديق الإضاءة بسبب مزودات الطاقة، المتحكمات، الوحدات، المحولات، الرطوبة، التآكل أو التوصيلات القديمة.",
      "مشكلات البراندينغ الظاهرة مثل فويل منفصل، ألوان باهتة، حروف متضررة أو أجزاء غير ثابتة تؤثر على صورة الموقع. التقييم الأولي بالصورة يساعد على تحديد النطاق.",
      "المنطقة الأساسية لـ PixelRing هي برلين وبراندنبورغ. يمكن طلب مناطق أخرى في ألمانيا حسب المهمة.",
    ],
    faqTitle: "أسئلة شائعة حول الأضرار والإصلاح",
    supportBridge: "التفاصيل الإضافية تبقى في Support Center.",
    faqs: [
      {
        question: "هل يجب أن أعرف التقنية المستخدمة؟",
        answer: "لا. المشكلة الظاهرة والصور والموقع غالبا تكفي للتقييم الأول.",
      },
      {
        question: "هل يمكن معرفة الإصلاح أو الاستبدال فورا؟",
        answer:
          "التوصية تأتي بعد الفحص. التركيز الأول هو الإصلاح والاستعادة عندما يكون ذلك منطقيا.",
      },
      {
        question: "هل أفحص المشكلة الكهربائية بنفسي؟",
        answer:
          "لا. عند وجود خطر، افصل التيار وابتعد عن الموقع وبلّغ عن الحالة مباشرة.",
      },
    ],
    finalEyebrow: "الخطوة التالية",
    finalTitle: "لست متأكدا ما هي المشكلة؟",
    finalText:
      "أرسل صورة أو صف بإيجاز ما هو ظاهر. PixelRing يراجع الحالة ويوضح الخطوات التالية.",
  },
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
    console.log("🚀 Starting direct CMS migration for all main pages...");
    await client.query("BEGIN");

    for (const locale of SUPPORTED_LOCALES) {
      // 1. LEISTUNGEN
      const l = LEISTUNGEN_CONTENT[locale] || LEISTUNGEN_CONTENT.de;
      const lBlocks = JSON.stringify([
        {
          type: "cardList",
          key: "heroSlides",
          enabled: true,
          sortOrder: 1,
          items: l.heroSlides,
        },
        {
          type: "cardList",
          key: "repair",
          enabled: true,
          sortOrder: 2,
          title: l.repairTitle,
          description: l.repairIntro,
          items: l.repairCards,
          focus: l.repairFocus,
        },
        {
          type: "cardList",
          key: "branding",
          enabled: true,
          sortOrder: 3,
          title: l.brandingTitle,
          description: l.brandingIntro,
          items: l.brandingCards,
        },
        {
          type: "cardList",
          key: "maintenance",
          enabled: true,
          sortOrder: 4,
          title: l.maintenanceTitle,
          description: l.maintenanceSubline,
          items: l.maintenanceBenefits,
          discount: l.maintenanceDiscount,
          cta: l.serviceContractCta,
          auditCta: l.auditCta,
        },
        {
          type: "cardList",
          key: "process",
          enabled: true,
          sortOrder: 5,
          title: l.processTitle,
          items: l.processSteps,
        },
        {
          type: "cardList",
          key: "trust",
          enabled: true,
          sortOrder: 6,
          title: l.frameTitle,
          items: l.trustPoints,
          finalHeadline: l.finalHeadline,
          finalText: l.finalText,
        },
      ]);
      await client.query(upsertSql, [
        crypto.randomUUID(),
        "leistungen",
        locale,
        "PUBLISHED",
        "Leistungen",
        lBlocks,
        l.metaTitle,
        l.metaDescription,
        now,
        now,
      ]);

      // 2. BUSINESS
      const b = BUSINESS_CONTENT[locale] || BUSINESS_CONTENT.de;
      const bBlocks = JSON.stringify([
        {
          type: "hero",
          key: "hero",
          enabled: true,
          sortOrder: 1,
          title: b.heroTitle,
          description: b.heroIntro,
          cta: b.heroCta,
          image: b.heroImage,
        },
        {
          type: "cardList",
          key: "target",
          enabled: true,
          sortOrder: 2,
          title: b.targetTitle,
          description: b.targetIntro,
          items: b.targetGroups,
        },
        {
          type: "cardList",
          key: "audit",
          enabled: true,
          sortOrder: 3,
          title: b.auditTitle,
          description: b.auditIntro,
          items: b.auditBenefits,
        },
        {
          type: "cardList",
          key: "platform",
          enabled: true,
          sortOrder: 4,
          title: b.platformTitle,
          description: b.platformIntro,
          items: b.platformBenefits,
        },
        {
          type: "textSection",
          key: "trust",
          enabled: true,
          sortOrder: 5,
          title: b.trustTitle,
          description: b.trustIntro,
        },
        {
          type: "cta",
          key: "final",
          enabled: true,
          sortOrder: 6,
          title: b.finalHeadline,
          description: b.finalText,
          primaryLabel: b.finalCta,
        },
      ]);
      await client.query(upsertSql, [
        crypto.randomUUID(),
        "business",
        locale,
        "PUBLISHED",
        "Business",
        bBlocks,
        b.metaTitle,
        b.metaDescription,
        now,
        now,
      ]);

      // 3. PROBLEME & LOESUNGEN
      const p = PROBLEME_CONTENT[locale] || PROBLEME_CONTENT.de;
      const pBlocks = JSON.stringify([
        {
          type: "hero",
          key: "hero",
          enabled: true,
          sortOrder: 1,
          title: p.heroTitle,
          description: p.heroIntro,
          cta: p.primaryCta,
          secondaryCta: p.secondaryCta,
          badge: p.badge,
          trust: p.heroTrust,
        },
        {
          type: "cardList",
          key: "problems",
          enabled: true,
          sortOrder: 2,
          title: p.problemTitle,
          description: p.problemIntro,
          items: p.problems,
          cta: p.problemCta,
        },
        {
          type: "cardList",
          key: "impact",
          enabled: true,
          sortOrder: 3,
          title: p.impactTitle,
          description: p.impactIntro,
          items: p.metrics,
        },
        {
          type: "textSection",
          key: "urgent",
          enabled: true,
          sortOrder: 4,
          title: p.urgentTitle,
          description: p.urgentText,
          items: p.urgentPoints,
          cta: p.urgentCta,
        },
        {
          type: "faqList",
          key: "faq",
          enabled: true,
          sortOrder: 5,
          title: p.faqTitle,
          items: p.faqs,
        },
        {
          type: "cta",
          key: "final",
          enabled: true,
          sortOrder: 6,
          title: p.finalTitle,
          description: p.finalText,
          primaryLabel: p.primaryCta,
        },
      ]);
      await client.query(upsertSql, [
        crypto.randomUUID(),
        "probleme-loesungen",
        locale,
        "PUBLISHED",
        "Probleme & Lösungen",
        pBlocks,
        p.metaTitle,
        p.metaDescription,
        now,
        now,
      ]);

      console.log(`✅ ${locale.toUpperCase()} synced.`);
    }

    await client.query("COMMIT");
    console.log("✨ Migration finished successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
