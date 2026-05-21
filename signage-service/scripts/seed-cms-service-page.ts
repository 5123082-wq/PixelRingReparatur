import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const REVISION_REASON = 'Service page DE draft seed from approved hidden prototype';

function normalizeConnectionString(value: string): string {
  try {
    const url = new URL(value);
    const sslmode = url.searchParams.get('sslmode');

    if (
      sslmode &&
      ['prefer', 'require', 'verify-ca'].includes(sslmode) &&
      !url.searchParams.has('uselibpqcompat')
    ) {
      url.searchParams.set('sslmode', 'verify-full');
    }

    return url.toString();
  } catch {
    return value;
  }
}

function getPrisma() {
  const connectionString = process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('Missing POSTGRES_PRISMA_URL or DATABASE_URL for service CMS seed.');
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: normalizeConnectionString(connectionString) }),
    log: ['error'],
  });
}

function createBlock(type: string, key: string, sortOrder: number, payload: Record<string, unknown>) {
  return {
    type,
    key,
    enabled: true,
    sortOrder,
    ...payload,
  };
}

function canonicalizeJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => canonicalizeJson(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, canonicalizeJson(item)])
    );
  }

  return value;
}

function sameJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(canonicalizeJson(left ?? null)) === JSON.stringify(canonicalizeJson(right ?? null));
}

function buildServicePage() {
  return {
    pageKey: 'service',
    locale: 'de',
    status: 'DRAFT',
    title: 'PixelRing Service',
    seoTitle: 'PixelRing Service | Standort-Abo, Audit & Wartung',
    seoDescription:
      'Interner PixelRing Service-Draft für Standort-Abo, Audit, Wartung, Reports und planbare Betreuung sichtbarer Markenflächen.',
    canonicalUrl: '/de/service',
    blocks: [
      createBlock('hero', 'serviceHero', 10, {
        badge: 'Subscription Model für Standorte',
        title: 'Ihre sichtbare Marke.',
        titleAccent: 'Immer im Check.',
        description:
          'Regelmäßiger Audit, Wartung und Kontrolle Ihrer Werbeanlagen, Leuchtreklamen, Schaufensterfolien und Printmedien - bevor defekte Schilder, alte Poster oder beschädigte Folien Ihren Kunden auffallen.',
        ctaPrimary: 'Abo-Pakete ansehen',
        ctaSecondary: 'Abo grob kalkulieren',
      }),
      createBlock('cardList', 'serviceMetrics', 20, {
        items: [
          { value: '01', label: 'Asset-Register für alle Standorte' },
          { value: '24h', label: 'Priorisierung kritischer Fälle' },
          { value: '1x', label: 'Zentraler Ansprechpartner' },
        ],
      }),
      createBlock('cardList', 'problemCards', 30, {
        title: 'Viele Standorte. Viele sichtbare Risiken. Keine zentrale Kontrolle.',
        description:
          'Im Tagesgeschäft sieht niemand systematisch nach, ob die Leuchtreklame funktioniert, die Folie noch sauber haftet, das Poster aktuell ist oder die Befestigung sicher wirkt. Genau hier setzt das PixelRing Standort-Abo an.',
        items: [
          {
            icon: '01',
            title: 'Defekte bleiben zu lange unbemerkt',
            description:
              'Flackernde LEDs, dunkle Buchstaben oder Ausfälle nach Regen werden oft erst gemeldet, wenn Kunden oder Mitarbeitende sich beschweren.',
          },
          {
            icon: '02',
            title: 'Branding wird uneinheitlich',
            description:
              'Alte Speisekarten, beschädigte Aufkleber, ausgeblichene Folien und falsche Poster schwächen den Markenauftritt am Standort.',
          },
          {
            icon: '03',
            title: 'Reparaturen sind reaktiv und teuer',
            description:
              'Ohne Audit-Log, Fotodokumentation und Wartungsrhythmus wird jeder Fall zum Einzelprojekt mit Zeitverlust und unklaren Zuständigkeiten.',
          },
        ],
      }),
      createBlock('textSection', 'serviceModel', 40, {
        title: 'Audit, Wartung und sichtbare Markenpflege als monatlicher Service.',
        description:
          'PixelRing erstellt eine digitale Übersicht Ihrer Werbeanlagen und Printmedien, prüft die Standorte regelmäßig und koordiniert die nächsten Schritte - von technischer Diagnose bis zum Austausch von Branding-Materialien.',
        cta: 'Audit-Termin starten',
        items: [
          {
            title: 'Regelmäßiger Check',
            description: 'Leuchtreklame, Schilder, Folien, Poster, Menüs und POS-Materialien.',
          },
          {
            title: 'Digitaler Audit-Report',
            description: 'Fotos, Zustand, Risiken, Priorität, empfohlene Maßnahme.',
          },
          {
            title: 'Planbare Kosten',
            description: 'Feste Service-Raten statt ungeplanter Einzelreparaturen.',
          },
          {
            title: 'Ein Ansprechpartner',
            description: 'Koordination für Werbetechnik, Druck, Montage und Reparatur.',
          },
        ],
      }),
      createBlock('cardList', 'packages', 50, {
        title: 'Drei Abo-Stufen. Von Kontrolle bis Full-Service-Betreuung.',
        description:
          'Die Preise sind als Platzhalter gedacht und können je nach Region, Anzahl der Standorte, Anlagentyp, Höhe, Zugang und SLA angepasst werden.',
        items: [
          {
            id: 'check',
            title: 'PixelRing Check',
            description:
              'Für Unternehmen, die erstmals Transparenz über ihre sichtbaren Markenelemente schaffen wollen.',
            price: 'ab 79€',
            priceNote: '/ Standort / Monat',
            items: [
              'Onboarding-Audit mit Fotodokumentation',
              'Monatlicher Remote-Check per Foto-Checkliste',
              'Statusbericht mit Prioritäten',
              'Ticket-Erstellung für Reparatur oder Materialtausch',
              'Empfehlung für nächste sinnvolle Maßnahme',
            ],
            cta: 'Check anfragen',
          },
          {
            id: 'care',
            title: 'PixelRing Care',
            badge: 'Empfohlen',
            recommended: true,
            description:
              'Für Standorte, die dauerhaft sauber, aktuell, sichtbar und markenkonform bleiben sollen.',
            price: 'ab 199€',
            priceNote: '/ Standort / Monat',
            items: [
              'Alles aus PixelRing Check',
              'Quartalsweiser Vor-Ort-Check im Kerngebiet',
              'Prüfung von Licht, Folien, Print und Befestigung',
              'Kleine optische Pflege und Material-Updates nach Aufwandslimit',
              'Vorteilskonditionen auf Werbematerialien',
              'Einheitlicher Ablauf für Filialen und Standortnetze',
            ],
            cta: 'Care anfragen',
          },
          {
            id: 'network',
            title: 'PixelRing Network',
            description:
              'Für Filialnetze, Franchise-Systeme und Facility-Teams mit zentraler Steuerung.',
            price: 'Custom',
            priceNote: '/ Netzwerk',
            items: [
              'Asset-Register für alle Standorte',
              'Kundenportal mit Status, Tickets und Historie',
              'Night-Light-Checks und Safety-Priorisierung',
              'Brand-Consistency-Score pro Standort',
              'Jahresbudget für Reparaturen und Updates',
              'SLA-Add-on für dringende Fälle',
            ],
            cta: 'Network planen',
          },
        ],
      }),
      createBlock('cardList', 'process', 60, {
        title: 'So wird aus Einzelreparaturen ein planbarer Serviceprozess.',
        items: [
          {
            value: 'STEP 01',
            title: 'Standort-Audit',
            description:
              'Alle sichtbaren Elemente werden erfasst: Leuchtreklame, Schilder, Folien, Poster, Menüs, Hinweise, Fassadenelemente.',
          },
          {
            value: 'STEP 02',
            title: 'Asset-Register',
            description:
              'Jeder Standort erhält eine digitale Karte mit Fotos, Zustand, Risiken, Historie und nächsten Maßnahmen.',
          },
          {
            value: 'STEP 03',
            title: 'Monatlicher Check',
            description:
              'PixelRing prüft Auffälligkeiten, priorisiert Tickets und erkennt Defekte, bevor sie zum Standortproblem werden.',
          },
          {
            value: 'STEP 04',
            title: 'Wartung & Update',
            description:
              'Reparatur, Reinigung, Print-Update, LED-Service oder Sicherheitsprüfung werden koordiniert und dokumentiert.',
          },
        ],
      }),
      createBlock('cardList', 'calculator', 70, {
        note: 'Abo-Rechner',
        title: 'Grobe Monatskalkulation',
        description:
          'Dieses Tool erzeugt nur eine Orientierung für den Vertrieb. Die finale Kalkulation hängt von Anlagentyp, Zugänglichkeit, Höhe, Material und SLA ab.',
        defaultLocations: 8,
        footnote:
          'Empfehlung: Reparaturen, Hebebühnen, Sondermaterial, Sturm-/Vandalismusschäden und große Erneuerungen separat kalkulieren.',
        items: [
          { label: 'PixelRing Check - 79€ / Standort', price: 79 },
          { label: 'PixelRing Care - 199€ / Standort', price: 199, default: true },
          { label: 'PixelRing Protect - 349€ / Standort', price: 349 },
        ],
      }),
      createBlock('cardList', 'portalPreview', 80, {
        title: 'Kontrolle statt Bauchgefühl.',
        description:
          'Das Abo wird besonders stark, wenn jeder Standort einen sichtbaren Zustand, eine Historie und konkrete Aufgaben bekommt.',
        items: [
          { title: 'Berlin Mitte', description: 'Leuchtbuchstaben · Folie · 6 Printflächen', value: '82%' },
          { title: 'Potsdam', description: 'Leuchtkasten · Menü · Eingangsschild', value: '94%' },
          { title: 'Spandau', description: 'Außenschild · Fassadenhalterung · Poster', value: '58%' },
          { title: 'Charlottenburg', description: 'Fensterbranding · POS · Neon', value: '76%' },
        ],
      }),
      createBlock('cardList', 'industries', 90, {
        title: 'Besonders sinnvoll für Unternehmen mit wiederkehrenden sichtbaren Flächen.',
        items: [
          { label: 'Gastronomie & Restaurants' },
          { label: 'Einzelhandel & Filialen' },
          { label: 'Beauty, Wellness & Salons' },
          { label: 'Autohäuser & Showrooms' },
          { label: 'Praxen & Apotheken' },
          { label: 'Hotels & Hospitality' },
          { label: 'Büros & Kanzleien' },
          { label: 'Franchise-Systeme' },
        ],
      }),
      createBlock('faqList', 'faq', 100, {
        title: 'Klare Grenzen. Klare Zuständigkeit.',
        items: [
          {
            question: 'Ist das Abo eine Reparatur-Flatrate?',
            answer:
              'Nein. Das Abo deckt Audit, Kontrolle, Dokumentation, Koordination und je nach Paket definierte Wartungs- oder Pflegeleistungen ab. Größere Reparaturen, Sondermaterial und externe Technik werden separat angeboten.',
          },
          {
            question: 'Was passiert beim ersten Audit?',
            answer:
              'PixelRing erfasst alle relevanten Elemente pro Standort: Fotos, Zustand, sichtbare Schäden, technische Risiken, Branding-Probleme und empfohlene Priorität.',
          },
          {
            question: 'Geht das auch für mehrere Standorte?',
            answer:
              'Ja. Genau dafür ist das Network-Paket gedacht: gleiche Checklisten, vergleichbare Reports, zentrale Koordination und klare Prioritäten über alle Standorte.',
          },
          {
            question: 'Welche Fälle sind dringend?',
            answer:
              'Brandgeruch, Funken, offene Kabel, lose Bauteile, wackelnde Schilder, Sturmschäden oder Gefahr für Passanten sollten direkt gemeldet und priorisiert werden.',
          },
        ],
      }),
      createBlock('cta', 'finalCta', 110, {
        badge: 'Starten mit einem Audit',
        title: '30 Tage Standort-Transparenz für Ihre sichtbare Marke.',
        description:
          'Senden Sie Standortliste, Fotos oder eine kurze Beschreibung. PixelRing prüft, welche Abo-Struktur für Ihr Objekt oder Filialnetz sinnvoll ist.',
        primaryLabel: 'E-Mail senden',
        primaryHref: 'mailto:info@pixel-ring.com?subject=Anfrage%20PixelRing%20Standort-Abo',
        secondaryLabel: 'Zur Business-Seite',
        secondaryHref: '/business',
        tertiaryLabel: 'Leistungen ansehen',
        tertiaryHref: '/leistungen',
      }),
    ],
  };
}

function buildRevisionSnapshot(page: {
  pageKey: string;
  locale: string;
  status: string;
  title: string;
  blocks: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  publishedAt: Date | null;
  lastReviewedAt: Date | null;
}) {
  return {
    pageKey: page.pageKey,
    locale: page.locale,
    status: page.status,
    title: page.title,
    blocks: page.blocks,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    canonicalUrl: page.canonicalUrl,
    publishedAt: page.publishedAt?.toISOString() ?? null,
    lastReviewedAt: page.lastReviewedAt?.toISOString() ?? null,
  };
}

async function syncServicePage(prisma: PrismaClient) {
  const desired = buildServicePage();
  const existing = await prisma.cmsPage.findUnique({
    where: {
      pageKey_locale: {
        pageKey: desired.pageKey,
        locale: desired.locale,
      },
    },
  });

  const needsUpdate =
    !existing ||
    existing.deletedAt !== null ||
    existing.status !== desired.status ||
    existing.title !== desired.title ||
    existing.seoTitle !== desired.seoTitle ||
    existing.seoDescription !== desired.seoDescription ||
    existing.canonicalUrl !== desired.canonicalUrl ||
    existing.publishedAt !== null ||
    !sameJson(existing.blocks, desired.blocks);

  if (!needsUpdate) {
    return 'skipped';
  }

  const page = await prisma.cmsPage.upsert({
    where: {
      pageKey_locale: {
        pageKey: desired.pageKey,
        locale: desired.locale,
      },
    },
    create: {
      pageKey: desired.pageKey,
      locale: desired.locale,
      status: desired.status,
      title: desired.title,
      blocks: desired.blocks,
      seoTitle: desired.seoTitle,
      seoDescription: desired.seoDescription,
      canonicalUrl: desired.canonicalUrl,
      publishedAt: null,
      lastReviewedAt: null,
      deletedAt: null,
    },
    update: {
      status: desired.status,
      title: desired.title,
      blocks: desired.blocks,
      seoTitle: desired.seoTitle,
      seoDescription: desired.seoDescription,
      canonicalUrl: desired.canonicalUrl,
      publishedAt: null,
      lastReviewedAt: null,
      deletedAt: null,
    },
  });

  await prisma.cmsPageRevision.create({
    data: {
      pageId: page.id,
      sourceAction: existing ? 'UPDATE' : 'CREATE',
      reason: REVISION_REASON,
      snapshot: buildRevisionSnapshot(page),
    },
  });

  return existing?.deletedAt ? 'restored' : existing ? 'updated' : 'created';
}

async function main() {
  const prisma = getPrisma();

  try {
    const action = await syncServicePage(prisma);
    console.log(`de/service: ${action}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Service CMS seed failed:', error);
  process.exitCode = 1;
});
