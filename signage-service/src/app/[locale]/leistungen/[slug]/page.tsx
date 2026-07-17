import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Link } from '@/i18n/routing';
import SectionEyebrow from '@/components/common/SectionEyebrow';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import LeistungenLedDecisionTool from '@/components/leistungen/LeistungenLedDecisionTool';
import LeistungenRepairHeroSlider from '@/components/leistungen/LeistungenRepairHeroSlider';
import LeistungenFooterCTA from '@/components/sections/LeistungenFooterCTA';
import { getGlobalPageCmsContent } from '@/lib/cms/pages';
import { SITE_CONFIG } from '@/lib/site-config';
import { SITE_BASE_URL, buildLanguageAlternates, buildLocaleUrl, buildSiteUrl } from '@/lib/seo';

export const revalidate = 3600;

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';
type ServiceDetailSlug =
  | 'lichtwerbung-led-modernisierung'
  | 'werbeanlagen-audit-diagnose'
  | 'montage-demontage-werbeanlagen'
  | 'druckprodukte-branding-werbematerialien';

type ServiceDetailLinkCard = {
  title: string;
  text: string;
  href: string;
  tag: string;
};

type ServiceDetailContent = {
  serviceName: string;
  intent: string;
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroIntro: string;
  image: string;
  imageAlt: string;
  primaryCta: string;
  secondaryCta: string;
  secondaryCtaHref?: string;
  tasksTitle: string;
  tasksIntro: string;
  tasks: Array<{ title: string; text: string }>;
  problemLinks?: {
    eyebrow: string;
    title: string;
    intro: string;
    links: ServiceDetailLinkCard[];
  };
  checksTitle: string;
  checksIntro: string;
  checks: string[];
  decisionGuide?: {
    eyebrow: string;
    title: string;
    intro: string;
    options: Array<{ title: string; text: string; tag: string }>;
    noteTitle: string;
    noteText: string;
  };
  requestChecklist?: {
    eyebrow: string;
    title: string;
    intro: string;
    items: string[];
  };
  processTitle: string;
  process: Array<{ title: string; text: string }>;
  boundaryTitle: string;
  boundaryText: string;
  boundaries: string[];
  faqTitle: string;
  faqs: Array<{ question: string; answer: string }>;
  nextStep?: {
    eyebrow: string;
    title: string;
    intro: string;
    requestTitle: string;
    requestText: string;
    requestCta: string;
    servicesTitle: string;
    servicesText: string;
    links: ServiceDetailLinkCard[];
  };
  offerCatalog?: string[];
  omitRegionalAreaServed?: boolean;
  finalHeadline: string;
  finalText: string;
};

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

type JsonLdObject = Record<string, unknown>;

const SITE_LOCALES: Locale[] = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];
const SERVICE_DETAIL_SLUGS: ServiceDetailSlug[] = [
  'lichtwerbung-led-modernisierung',
  'werbeanlagen-audit-diagnose',
  'montage-demontage-werbeanlagen',
  'druckprodukte-branding-werbematerialien',
];

const BREADCRUMB_LABELS_BY_LOCALE: Record<Locale, { home: string; services: string }> = {
  de: { home: 'Home', services: 'Leistungen' },
  en: { home: 'Home', services: 'Services' },
  ru: { home: 'Главная', services: 'Услуги' },
  tr: { home: 'Ana sayfa', services: 'Hizmetler' },
  pl: { home: 'Strona główna', services: 'Usługi' },
  ar: { home: 'الرئيسية', services: 'الخدمات' },
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

const RELATED_LABELS_BY_LOCALE: Record<
  Locale,
  { title: string; overview: string; request: string; next: string }
> = {
  de: {
    title: 'Weitere Leistungsseiten',
    overview: 'Alle Leistungen ansehen',
    request: 'Anfrage starten',
    next: 'Passende nächste Schritte',
  },
  en: {
    title: 'Related service pages',
    overview: 'View all services',
    request: 'Start request',
    next: 'Relevant next steps',
  },
  ru: {
    title: 'Другие страницы услуг',
    overview: 'Все услуги',
    request: 'Начать заявку',
    next: 'Подходящие следующие шаги',
  },
  tr: {
    title: 'İlgili hizmet sayfaları',
    overview: 'Tüm hizmetleri gör',
    request: 'Talebi başlat',
    next: 'Uygun sonraki adımlar',
  },
  pl: {
    title: 'Powiązane strony usług',
    overview: 'Zobacz wszystkie usługi',
    request: 'Rozpocznij zapytanie',
    next: 'Odpowiednie kolejne kroki',
  },
  ar: {
    title: 'صفحات خدمات ذات صلة',
    overview: 'عرض جميع الخدمات',
    request: 'بدء الطلب',
    next: 'الخطوات التالية المناسبة',
  },
};

const SERVICE_DETAIL_CONTENT: Record<Locale, Record<ServiceDetailSlug, ServiceDetailContent>> = {
  de: {
    'lichtwerbung-led-modernisierung': {
      serviceName: 'Modernisierung von Lichtwerbung & Außenwerbung',
      intent: 'lichtwerbung-led',
      metaTitle: 'Lichtwerbung modernisieren & LED-Umrüstung | PixelRing',
      metaDescription:
        'PixelRing prüft und modernisiert bestehende Lichtwerbung: LED-Module, Netzteile, Controller, Neon, Leuchtkästen, Lichtbild und Konstruktion.',
      heroEyebrow: 'Lichtwerbung & LED-Service',
      heroTitle: 'Modernisierung von Lichtwerbung & Außenwerbung',
      heroIntro:
        'Bestehende Leuchtwerbung muss nicht automatisch ersetzt werden. PixelRing prüft LED-Module, Netzteile, Trafos, Controller, Neon, Leuchtkästen, Verkabelung, Lichtbild und Konstruktion - und klärt, ob Reparatur, Teilmodernisierung, LED-Umrüstung oder eine Ersatzlösung der sinnvolle nächste Schritt ist.',
      image: '/images/about/service_deep_2.png',
      imageAlt: 'Modernisierte Lichtwerbung und Außenwerbung an einem Geschäftsstandort',
      primaryCta: 'Fotos senden und Einschätzung erhalten',
      secondaryCta: 'Reparatur statt Austausch prüfen',
      secondaryCtaHref: '/leistungen/werbeanlagen-reparatur',
      tasksTitle: 'Was an bestehender Lichtwerbung modernisiert werden kann',
      tasksIntro:
        'Der Schwerpunkt liegt auf vorhandenen Anlagen: Beleuchtung, Lichtwirkung und Konstruktion werden geprüft, bevor Austausch oder Umbau empfohlen werden.',
      tasks: [
        {
          title: 'Leuchtreklame auf LED umrüsten',
          text: 'Ältere Leuchttechnik kann häufig auf LED-Technik umgerüstet werden, wenn Gehäuse, Platz, Stromversorgung und Feuchtigkeitsschutz passen.',
        },
        {
          title: 'Leuchtkasten LED nachrüsten',
          text: 'Bestehende Leuchtkästen werden auf Ausleuchtung, Modulpositionen, Netzteile, Fronten und Wartbarkeit geprüft.',
        },
        {
          title: 'Neon erhalten oder LED-Alternative prüfen',
          text: 'Bei älterer Neon- oder Röhrentechnik wird zuerst geklärt, ob Erhalt, Reparatur, Teilmodernisierung oder LED-Alternative sinnvoll ist.',
        },
        {
          title: 'Ungleichmäßige Ausleuchtung verbessern',
          text: 'Dunkle Zonen, Hotspots, unterschiedliche Lichtfarben und sichtbare LED-Punkte werden mit Blick auf Markenwirkung und Lesbarkeit bewertet.',
        },
        {
          title: 'LED-Module, Netzteile und Controller prüfen',
          text: 'Module, LED-Bänder, Netzteile, Trafos, Controller, Timer und Dimmer werden als zusammenhängendes System betrachtet.',
        },
        {
          title: 'Bestehende Konstruktion weiter nutzen',
          text: 'Gehäuse, Acrylfronten, Befestigung, Dichtungen und Zugang werden geprüft, damit brauchbare Substanz nicht vorschnell ersetzt wird.',
        },
      ],
      problemLinks: {
        eyebrow: 'Passende Problemseiten',
        title: 'Wenn die Modernisierung aus einem konkreten Fehler entsteht',
        intro:
          'Manchmal beginnt der Bedarf nicht mit einem Umbauwunsch, sondern mit Flackern, Ausfall oder einem schlechten Lichtbild. Diese Problemseiten helfen bei der Einordnung.',
        links: [
          {
            title: 'Werbeanlage flackert',
            text: 'Mögliche Hinweise auf Netzteile, Feuchtigkeit, LED-Module oder Steuerung.',
            href: '/probleme-loesungen/werbeanlage-flackert',
            tag: 'Flackern',
          },
          {
            title: 'LED leuchtet ungleichmäßig',
            text: 'Dunkle Zonen, sichtbare Punkte, falsche Lichtfarbe oder unruhiges Lichtbild.',
            href: '/probleme-loesungen/led-leuchtet-ungleichmaessig',
            tag: 'Lichtbild',
          },
          {
            title: 'Buchstabe leuchtet nicht',
            text: 'Ausfall einzelner Profilbuchstaben, Module, Verbindungen oder Netzteile.',
            href: '/probleme-loesungen/buchstabe-leuchtet-nicht',
            tag: 'Buchstaben',
          },
          {
            title: 'Werbeanlage leuchtet nicht',
            text: 'Kompletter Ausfall der Leuchtwerbung mit möglichem Prüfbedarf an Stromversorgung und Steuerung.',
            href: '/probleme-loesungen/werbeanlage-leuchtet-nicht',
            tag: 'Ausfall',
          },
        ],
      },
      checksTitle: 'Was PixelRing vor einer Modernisierung prüft',
      checksIntro:
        'Modernisierung beginnt nicht mit Austausch um jeden Preis. Zuerst klären wir Zustand, Fehlerbild und technischen Rahmen.',
      checks: [
        'Stromversorgung, Netzteile, Trafos, Sicherungen und Verkabelung',
        'LED-Module, LED-Bänder, Neonröhren, Lichtfarbe und Helligkeit',
        'Controller, Sensoren, Timer, Dimmer und Schaltverhalten',
        'Gehäuse, Dichtungen, Feuchtigkeit, Korrosion und Zugänglichkeit',
        'Lichtbild, Schatten, Hotspots, Lesbarkeit und Markenwirkung',
        'Ob Reparatur, Teilmodernisierung, LED-Umrüstung oder Ersatzlösung sinnvoll ist',
      ],
      decisionGuide: {
        eyebrow: 'Entscheidungshilfe',
        title: 'Reparatur, Teilmodernisierung, LED-Umrüstung oder Ersatzlösung?',
        intro:
          'Die richtige Empfehlung hängt nicht an einem einzelnen Schlagwort. PixelRing trennt zuerst Defekt, Lichtbild, vorhandene Substanz und gewünschte Markenwirkung.',
        options: [
          {
            tag: '01',
            title: 'Reparatur',
            text: 'Passt, wenn ein konkreter Ausfall vorliegt und Gehäuse, Lichtbild und Konstruktion grundsätzlich weiter nutzbar sind.',
          },
          {
            tag: '02',
            title: 'Teilmodernisierung',
            text: 'Sinnvoll, wenn die Anlage erhalten bleiben kann, aber Module, Netzteile, Steuerung, Dichtungen oder Lichtbild aktualisiert werden sollten.',
          },
          {
            tag: '03',
            title: 'LED-Umrüstung',
            text: 'Relevant bei älterer Röhren-, Neon- oder ineffizienter Lichttechnik, wenn Platz, Wärme, Stromversorgung und gewünschte Lichtwirkung passen.',
          },
          {
            tag: '04',
            title: 'Ersatzlösung',
            text: 'Wird geprüft, wenn Gehäuse, Fronten, Korrosion, Befestigung, Zugang oder Markenanforderungen gegen eine weitere Nutzung sprechen.',
          },
        ],
        noteTitle: 'Keine fixe Empfehlung nur nach einem Foto',
        noteText:
          'Fotos und Videos helfen bei der ersten Einordnung. Eine verbindliche Empfehlung entsteht erst nach Prüfung von Zustand, Zugang, elektrischen Komponenten und gewünschtem Ergebnis.',
      },
      requestChecklist: {
        eyebrow: 'Checkliste für die Anfrage',
        title: 'Was bei einer ersten Einschätzung hilft',
        intro:
          'Sie müssen keine technischen Begriffe kennen. Fotos, kurze Videos und einfache Standortinformationen reichen oft für den ersten Schritt.',
        items: [
          'Gesamtfoto der Anlage',
          'Nahaufnahme der betroffenen Stelle',
          'Kurzes Video bei Flackern',
          'Adresse, Stadt oder Standortangabe',
          'Montagehöhe und Zugang zur Anlage',
          'Alter der Anlage, falls bekannt',
          'Zeitpunkt des Problems',
          'Hinweise wie Regen, Geruch, Wärme oder ausgelöste Sicherung',
        ],
      },
      processTitle: 'Ablauf',
      process: [
        {
          title: 'Fotos, Video oder Ziel senden',
          text: 'Sie senden Bilder, Standortangaben und kurze Hinweise zum Fehlerbild oder gewünschten Lichtbild.',
        },
        {
          title: 'Technische Ersteinschätzung',
          text: 'PixelRing ordnet ein, welche Komponenten wahrscheinlich betroffen sind und ob eine Prüfung vor Ort sinnvoll ist.',
        },
        {
          title: 'Reparatur, Umrüstung oder Ersatzlösung abstimmen',
          text: 'Nach Prüfung wird transparent geklärt, was erhalten, modernisiert oder ersetzt werden sollte.',
        },
      ],
      boundaryTitle: 'Klarer Rahmen',
      boundaryText:
        'PixelRing bleibt ein zentraler Ansprechpartner und koordiniert die fachliche Umsetzung. Es wird keine Vermittlungsplattform und kein unbegrenzter Technikvertrag versprochen.',
      boundaries: [
        'Der Leistungsumfang wird nach Zustand, Zugang, Bauteilen und gewünschtem Lichtbild geprüft.',
        'Elektrische Arbeiten werden fachlich geprüft und passend koordiniert.',
        'Verbindliche Preise, Termine und Wirtschaftlichkeitsaussagen entstehen erst nach Sichtung und Bestätigung.',
      ],
      faqTitle: 'FAQ zur Lichtwerbung',
      faqs: [
        {
          question: 'Kann eine alte Lichtwerbung auf LED umgerüstet werden?',
          answer:
            'Oft ist eine Teilmodernisierung möglich. Entscheidend sind Gehäuse, Stromversorgung, Platz, Feuchtigkeitsschutz und gewünschtes Lichtbild.',
        },
        {
          question: 'Lohnt sich die LED-Umrüstung bei einem Leuchtkasten?',
          answer:
            'Das hängt von Zustand, Laufzeit, Stromversorgung, Wartbarkeit und Lichtbild ab. PixelRing prüft zuerst, ob eine Umrüstung technisch und wirtschaftlich sinnvoll sein kann.',
        },
        {
          question: 'Kann ein Leuchtkasten modernisiert werden, ohne ihn komplett zu ersetzen?',
          answer:
            'Nicht automatisch. PixelRing prüft zuerst Reparatur und sinnvolle Teilmodernisierung, bevor eine Ersatzlösung empfohlen wird.',
        },
        {
          question: 'Warum flackert meine LED-Werbeanlage?',
          answer:
            'Flackern kann von Netzteilen, Feuchtigkeit, LED-Modulen, Verkabelung oder Steuerung kommen. Eine sichere Einschätzung entsteht erst nach Fotos, Beschreibung und gegebenenfalls Prüfung vor Ort.',
        },
        {
          question: 'Was tun bei ungleichmäßiger Ausleuchtung?',
          answer:
            'Hilfreich sind Gesamtfoto, Nahaufnahme und ein Hinweis, ob die ungleichmäßige Stelle neu ist. Gehäuse, Modulposition, Lichtfarbe, Frontmaterial und Alter der Technik werden gemeinsam betrachtet.',
        },
        {
          question: 'Ist LED-Werbung wartungsfrei?',
          answer:
            'Nein. LED-Technik kann wartungsärmer und besser wartbar sein, bleibt aber abhängig von Netzteilen, Feuchtigkeitsschutz, Wärme, Steuerung und Einbausituation.',
        },
      ],
      nextStep: {
        eyebrow: 'NEXT STEP',
        title: 'Nächsten Schritt für die bestehende Anlage wählen',
        intro:
          'Wenn es um Licht, Technik und bestehende Konstruktion geht, ist zuerst die richtige Einordnung wichtig: reparieren, teilweise modernisieren, auf LED umrüsten oder ersetzen.',
        requestTitle: 'Modernisierung konkret anfragen',
        requestText:
          'Senden Sie Fotos, ein kurzes Video bei Flackern, Standortangaben, Zugangsinformationen und Ihr Ziel für Lichtbild oder Markenwirkung.',
        requestCta: 'LED-Modernisierung anfragen',
        servicesTitle: 'Wenn eine andere Leistung besser passt',
        servicesText:
          'Nicht jeder Lichtfall ist sofort eine Modernisierung. Diese Leistungsseiten grenzen Reparatur, Diagnose und Montage sauber ab.',
        links: [
          {
            title: 'Werbeanlagen-Reparatur',
            text: 'Wenn ein konkreter Defekt zuerst behoben werden soll.',
            href: '/leistungen/werbeanlagen-reparatur',
            tag: 'Reparatur',
          },
          {
            title: 'Audit & Diagnose',
            text: 'Wenn Zustand, Ursache oder Priorität erst strukturiert geprüft werden müssen.',
            href: '/leistungen/werbeanlagen-audit-diagnose',
            tag: 'Diagnose',
          },
          {
            title: 'Montage & Demontage',
            text: 'Wenn Ausbau, Zugang, Versetzung oder neue Befestigung Teil der Aufgabe ist.',
            href: '/leistungen/montage-demontage-werbeanlagen',
            tag: 'Montage',
          },
        ],
      },
      offerCatalog: [
        'Leuchtkasten LED nachrüsten',
        'LED-Module austauschen',
        'Netzteile, Trafos und Controller prüfen',
        'Neon erhalten oder LED-Alternative prüfen',
        'Lichtbild und Ausleuchtung verbessern',
        'Bestehende Konstruktion für Teilmodernisierung prüfen',
      ],
      omitRegionalAreaServed: true,
      finalHeadline: 'Soll Ihre Lichtwerbung wieder zuverlässig wirken?',
      finalText:
        'Senden Sie Fotos oder eine kurze Beschreibung. PixelRing prüft, ob Reparatur, Teilmodernisierung, LED-Umrüstung oder eine Ersatzlösung der nächste sinnvolle Schritt ist.',
    },
    'werbeanlagen-audit-diagnose': {
      serviceName: 'Inspektion, Audit & Diagnose von Werbeanlagen',
      intent: 'diagnose',
      metaTitle: 'Werbeanlagen-Audit & Diagnose | PixelRing',
      metaDescription:
        'PixelRing prüft Zustand, Schäden, Elektrik, Befestigung, Sichtbarkeit und Risiken von Werbeanlagen in Berlin & Brandenburg.',
      heroEyebrow: 'Audit & Diagnose',
      heroTitle: 'Inspektion, Audit & Diagnose von Werbeanlagen',
      heroIntro:
        'PixelRing erfasst Zustand, Ursache, Umfang und sichtbare Risiken Ihrer Werbeanlage. Daraus entsteht eine klare Empfehlung für Reparatur, Wartung oder den nächsten sinnvollen Schritt.',
      image: '/images/about/service_deep_3.png',
      imageAlt: 'Inspektion einer Werbeanlage mit dokumentierten Prüfpunkten',
      primaryCta: 'Diagnose starten',
      secondaryCta: 'Alle Leistungen',
      tasksTitle: 'Wann ein Audit sinnvoll ist',
      tasksIntro:
        'Ein Audit hilft, sichtbare Mängel, technische Risiken und Prioritäten zu ordnen, bevor Arbeit beauftragt wird.',
      tasks: [
        {
          title: 'Unklares Fehlerbild',
          text: 'Die Anlage flackert, fällt sporadisch aus oder zeigt mehrere Symptome gleichzeitig.',
        },
        {
          title: 'Standort- oder Filialprüfung',
          text: 'Mehrere sichtbare Werbeflächen sollen nach Zustand, Priorität und nächstem Schritt bewertet werden.',
        },
        {
          title: 'Sicherheits- und Befestigungsrisiken',
          text: 'Lose Bauteile, gealterte Unterkonstruktionen oder Schäden nach Wetterereignissen müssen eingeordnet werden.',
        },
        {
          title: 'Entscheidung vor Budgetfreigabe',
          text: 'Vor Reparatur oder Modernisierung soll klar sein, welcher Umfang realistisch und sinnvoll ist.',
        },
      ],
      checksTitle: 'Was geprüft wird',
      checksIntro:
        'Der Check bleibt praxisnah: sichtbare Schäden, technische Hinweise und Standortbedingungen werden strukturiert zusammengeführt.',
      checks: [
        'Gehäuse, Acryl, Folien, Rahmen und sichtbare Schäden',
        'Lichtbild, Elektrik-Hinweise, Feuchtigkeit und Ausfälle',
        'Montagepunkte, Unterkonstruktion und Zugänglichkeit',
        'Priorität: sofort handeln, planen oder beobachten',
      ],
      processTitle: 'Ablauf',
      process: [
        {
          title: 'Anlage beschreiben',
          text: 'Fotos, Standort, Höhe, Zugänglichkeit und beobachtete Symptome werden gesammelt.',
        },
        {
          title: 'Remote- oder Vor-Ort-Prüfung wählen',
          text: 'PixelRing klärt, ob eine Ferneinschätzung reicht oder ob ein Termin vor Ort sinnvoll ist.',
        },
        {
          title: 'Empfehlung erhalten',
          text: 'Sie erhalten den nächsten sinnvollen Schritt: Reparatur, Wartung, Modernisierung oder weitere Prüfung.',
        },
      ],
      boundaryTitle: 'Klarer Rahmen',
      boundaryText:
        'Ein Audit ist eine strukturierte Einschätzung, kein versteckter Verkaufsautomat. Ziel ist eine nachvollziehbare Entscheidung für den nächsten Schritt.',
      boundaries: [
        'Keine Kundendaten werden über eine reine Anfragenummer öffentlich gemacht.',
        'Fotos und Standortinformationen werden als sensible Servicedaten behandelt.',
        'Kosten und Termine bleiben unverbindlich, bis PixelRing den Umfang bestätigt.',
      ],
      faqTitle: 'FAQ zu Audit & Diagnose',
      faqs: [
        {
          question: 'Reicht ein Foto für die Diagnose?',
          answer:
            'Für eine erste Einschätzung oft ja. Bei Elektrik, Höhe, Befestigung oder Sicherheitsfragen kann ein Vor-Ort-Termin nötig sein.',
        },
        {
          question: 'Ist das Audit auch für mehrere Standorte geeignet?',
          answer:
            'Ja. Für mehrere Standorte kann PixelRing Zustände und Prioritäten geordnet erfassen und den nächsten Service-Schritt koordinieren.',
        },
      ],
      finalHeadline: 'Brauchen Sie zuerst Klarheit statt sofortiger Beauftragung?',
      finalText:
        'Senden Sie uns Fotos und eine kurze Beschreibung. PixelRing ordnet Zustand, Risiko und nächsten Schritt strukturiert ein.',
    },
    'montage-demontage-werbeanlagen': {
      serviceName: 'Montage, Demontage & Versetzung von Werbeanlagen',
      intent: 'montage-demontage',
      metaTitle: 'Montage & Demontage von Werbeanlagen | PixelRing',
      metaDescription:
        'PixelRing koordiniert Montage, Demontage, Rückbau und Versetzung von Werbeanlagen in Berlin & Brandenburg.',
      heroEyebrow: 'Montage & Rückbau',
      heroTitle: 'Montage, Demontage & Versetzung von Werbeanlagen',
      heroIntro:
        'PixelRing koordiniert neue, bestehende oder zu versetzende Werbeanlagen: von der Prüfung der Fläche bis zur Abstimmung der passenden Fachleute und nächsten Schritte.',
      image: '/images/leistungen/werbeanlagen-montage-demontage-sportzentrum-fassade.webp',
      imageAlt: 'Montage und Demontage von Werbeanlagen an einem Geschäftsstandort',
      primaryCta: 'Montage anfragen',
      secondaryCta: 'Alle Leistungen',
      tasksTitle: 'Typische Montage- und Demontagefälle',
      tasksIntro:
        'Die Seite deckt koordinierte Arbeiten an bestehenden Geschäftsstandorten ab, ohne PixelRing als Marktplatz oder Fremdfirmenverzeichnis darzustellen.',
      tasks: [
        {
          title: 'Neue Anlage montieren',
          text: 'Schilder, Leuchtkästen oder Beschriftungen werden nach Standortprüfung und Abstimmung montiert.',
        },
        {
          title: 'Bestehende Anlage demontieren',
          text: 'Rückbau, Entfernung und Vorbereitung der Fläche werden geordnet geplant.',
        },
        {
          title: 'Werbeanlage versetzen',
          text: 'Bei Standortwechsel oder Umbau wird geprüft, welche Teile weiter nutzbar sind.',
        },
        {
          title: 'Befestigung und Untergrund klären',
          text: 'Montagepunkte, Höhe, Zugang und Untergrund werden vor der Umsetzung berücksichtigt.',
        },
      ],
      checksTitle: 'Was vor der Umsetzung geklärt wird',
      checksIntro:
        'Montage und Rückbau brauchen einen sauberen Rahmen, besonders bei Höhe, Strom, Fassade und öffentlichem Raum.',
      checks: [
        'Maße, Gewicht, Untergrund und Befestigungspunkte',
        'Zugänglichkeit, Höhe, Arbeitsbereich und Terminfenster',
        'Elektrische Anschlüsse und bestehende Leitungen',
        'Ob Genehmigungen, Hausverwaltung oder weitere Abstimmungen nötig sind',
      ],
      processTitle: 'Ablauf',
      process: [
        {
          title: 'Aufgabe und Standort erfassen',
          text: 'Sie senden Fotos, Maße, Adresse und Ziel: Montage, Demontage oder Versetzung.',
        },
        {
          title: 'Rahmen prüfen',
          text: 'PixelRing bewertet Zugang, technische Punkte und Koordinationsbedarf.',
        },
        {
          title: 'Umsetzung koordinieren',
          text: 'Nach Bestätigung werden Termin, Umfang und beteiligte Spezialisten abgestimmt.',
        },
      ],
      boundaryTitle: 'Klarer Rahmen',
      boundaryText:
        'PixelRing bleibt die zentrale Koordination. Arbeiten an Elektrik, Höhe oder Fassade werden nur im passenden fachlichen Rahmen geplant.',
      boundaries: [
        'Berlin & Brandenburg als Kerngebiet; weitere Regionen in Deutschland auf Anfrage.',
        'Bei Sonderzugang, Höhenarbeiten oder Genehmigungen wird der Aufwand separat geprüft.',
        'Demontage bedeutet nicht automatisch Entsorgung oder Flächenreparatur, sofern nicht abgestimmt.',
      ],
      faqTitle: 'FAQ zu Montage & Demontage',
      faqs: [
        {
          question: 'Kann PixelRing eine vorhandene Anlage an einen neuen Standort versetzen?',
          answer:
            'Ja, wenn Zustand, Maße, Befestigung und neuer Untergrund passen. Vorher wird geprüft, welche Teile wiederverwendbar sind.',
        },
        {
          question: 'Wird auch Rückbau bei Geschäftsaufgabe übernommen?',
          answer:
            'PixelRing kann Rückbau und Demontage koordinieren. Flächenreparaturen oder Sonderentsorgung werden separat geklärt.',
        },
      ],
      finalHeadline: 'Muss eine Anlage montiert, entfernt oder versetzt werden?',
      finalText:
        'Senden Sie Standort, Fotos und eine kurze Aufgabenbeschreibung. PixelRing prüft den Rahmen und koordiniert den nächsten Schritt.',
    },
    'druckprodukte-branding-werbematerialien': {
      serviceName: 'Druckprodukte, Branding & Werbematerialien',
      intent: 'druckprodukte-branding',
      metaTitle: 'Druckprodukte, Branding & Werbematerialien | PixelRing',
      metaDescription:
        'PixelRing unterstützt Druckdaten, Folierung, Beschriftung, Banner, Poster, Aufkleber und Standort-Branding für Unternehmen.',
      heroEyebrow: 'Branding & Werbematerialien',
      heroTitle: 'Druckprodukte, Branding & Werbematerialien',
      heroIntro:
        'PixelRing unterstützt Unternehmen bei sichtbarem Standort-Branding: Druckdaten, Folien, Beschriftungen, Poster, Banner, Hinweisschilder und laufende Materialversorgung.',
      image: '/images/leistungen/hero-branding.png',
      imageAlt: 'Branding, Folierung und Werbematerialien für einen Geschäftsstandort',
      primaryCta: 'Branding anfragen',
      secondaryCta: 'Alle Leistungen',
      tasksTitle: 'Typische Branding-Aufgaben',
      tasksIntro:
        'Diese Seite bündelt Werbematerialien und sichtbare Standortflächen, die im laufenden Geschäft professionell gepflegt werden müssen.',
      tasks: [
        {
          title: 'Druckdaten vorbereiten',
          text: 'Bestehende Daten werden geprüft, angepasst oder für Produktion und Standortnutzung aufbereitet.',
        },
        {
          title: 'Folierung und Beschriftung',
          text: 'Fenster, Flächen, Türen oder Hinweispunkte werden mit sichtbaren Markenelementen geplant.',
        },
        {
          title: 'Poster, Banner und Aufkleber',
          text: 'Wiederkehrende Werbematerialien werden passend zum Standortbedarf koordiniert.',
        },
        {
          title: 'Filialen und Standorte versorgen',
          text: 'Für mehrere Standorte kann PixelRing Materialbedarf und Serviceanfragen zentral bündeln.',
        },
      ],
      checksTitle: 'Was PixelRing abstimmt',
      checksIntro:
        'Bei Branding geht es nicht nur um Druck, sondern um passende Daten, Materialien, Flächen und Umsetzung.',
      checks: [
        'Vorhandene Druckdaten, Formate, Farben und Lesbarkeit',
        'Untergrund, Einsatzort, Haltbarkeit und Pflegebedarf',
        'Materialauswahl für Folien, Banner, Poster und Schilder',
        'Koordination mit Reparatur, Montage oder Standortservice, wenn nötig',
      ],
      processTitle: 'Ablauf',
      process: [
        {
          title: 'Bedarf und Daten senden',
          text: 'Sie senden vorhandene Dateien, Fotos, Maße und den gewünschten Einsatzzweck.',
        },
        {
          title: 'Machbarkeit prüfen',
          text: 'PixelRing klärt Datenqualität, Material, Fläche und sinnvolle Umsetzung.',
        },
        {
          title: 'Produktion und Service abstimmen',
          text: 'Nach Bestätigung werden Material, Termin und gegebenenfalls Montage koordiniert.',
        },
      ],
      boundaryTitle: 'Klarer Rahmen',
      boundaryText:
        'PixelRing kommuniziert Branding als Service rund um Geschäftsstandorte, nicht als unkontrollierten Online-Druckshop.',
      boundaries: [
        'Design, Druckdaten, Folierung und Werbematerialien sind bestätigte Servicebereiche.',
        'Eigene Produktion wird nicht behauptet, solange der konkrete Produktionsumfang nicht bestätigt ist.',
        'Farb-, Material- und Haltbarkeitsaussagen hängen von Einsatzort und Freigabe ab.',
      ],
      faqTitle: 'FAQ zu Branding & Werbematerialien',
      faqs: [
        {
          question: 'Kann PixelRing vorhandene Druckdaten prüfen?',
          answer:
            'Ja. PixelRing kann vorhandene Dateien auf Nutzbarkeit, Format und Abstimmungsbedarf prüfen und die nächsten Schritte koordinieren.',
        },
        {
          question: 'Gehört Folierung zur Leistung?',
          answer:
            'Ja. Folierung, Beschriftung und sichtbare Markenelemente sind Teil des bestätigten Servicebereichs.',
        },
      ],
      finalHeadline: 'Braucht Ihr Standort neue Werbematerialien oder sichtbares Branding?',
      finalText:
        'Senden Sie Dateien, Fotos oder eine kurze Beschreibung. PixelRing prüft Material, Fläche und nächsten sinnvollen Schritt.',
    },
  },
  en: {
    'lichtwerbung-led-modernisierung': {
      serviceName: 'Illuminated signage & outdoor advertising modernization',
      intent: 'lichtwerbung-led',
      metaTitle: 'Illuminated Signage Modernization & LED Conversion | PixelRing',
      metaDescription:
        'PixelRing reviews and modernizes existing illuminated signage: LED modules, power supplies, controllers, neon, lightboxes, light output and structure.',
      heroEyebrow: 'Illuminated signage service',
      heroTitle: 'Illuminated signage & outdoor advertising modernization',
      heroIntro:
        'Existing illuminated signage does not automatically need replacement. PixelRing reviews LED modules, power supplies, transformers, controllers, neon, lightboxes, wiring, light output and structure, then clarifies whether repair, partial modernization, LED conversion or replacement is the sensible next step.',
      image: '/images/about/service_deep_2.png',
      imageAlt: 'Modernized illuminated signage and outdoor advertising at a business location',
      primaryCta: 'Send photos for an assessment',
      secondaryCta: 'Check repair before replacement',
      secondaryCtaHref: '/leistungen/werbeanlagen-reparatur',
      tasksTitle: 'What can be modernized on existing illuminated signage',
      tasksIntro:
        'The focus is on existing assets: lighting, visual output and structure are checked before replacement or conversion is recommended.',
      tasks: [
        { title: 'Convert illuminated signage to LED', text: 'Older lighting can often be converted to LED when housing, space, power supply and moisture protection are suitable.' },
        { title: 'Retrofit LED in lightboxes', text: 'Existing lightboxes are checked for illumination, module placement, power supplies, faces and serviceability.' },
        { title: 'Preserve neon or review an LED alternative', text: 'For older neon or tube systems, PixelRing first checks whether repair, preservation, partial modernization or an LED alternative makes sense.' },
        { title: 'Improve uneven illumination', text: 'Dark zones, hotspots, mixed light colors and visible LED points are assessed with brand impact and readability in mind.' },
        { title: 'Check LED modules, power supplies and controllers', text: 'Modules, LED strips, power supplies, transformers, controllers, timers and dimmers are reviewed as one connected system.' },
        { title: 'Reuse the existing structure', text: 'Housing, acrylic faces, fixings, seals and access are checked so usable substance is not replaced prematurely.' },
      ],
      problemLinks: {
        eyebrow: 'Related problem pages',
        title: 'When modernization starts with a concrete fault',
        intro:
          'Sometimes the need starts with flickering, failure or a poor light pattern rather than a planned upgrade. These pages help classify the issue.',
        links: [
          { title: 'Sign flickers', text: 'Possible clues around power supplies, moisture, LED modules or control systems.', href: '/probleme-loesungen/werbeanlage-flackert', tag: 'Flicker' },
          { title: 'LED lights unevenly', text: 'Dark zones, visible points, wrong light color or uneven illumination.', href: '/probleme-loesungen/led-leuchtet-ungleichmaessig', tag: 'Light output' },
          { title: 'Letter does not light up', text: 'Failure of individual channel letters, modules, connections or power supplies.', href: '/probleme-loesungen/buchstabe-leuchtet-nicht', tag: 'Letters' },
          { title: 'Sign does not light up', text: 'Complete outage with possible checks around power supply and controls.', href: '/probleme-loesungen/werbeanlage-leuchtet-nicht', tag: 'Outage' },
        ],
      },
      checksTitle: 'What PixelRing checks first',
      checksIntro: 'Modernization does not start with replacement at any cost. We first clarify condition, symptoms and technical limits.',
      checks: ['Power supply, drivers, transformers, fuses and wiring', 'LED modules, LED strips, neon tubes, light color and brightness', 'Controllers, sensors, timers, dimmers and switching behavior', 'Housing, seals, moisture, corrosion and access', 'Light pattern, shadows, hotspots, readability and brand impact', 'Whether repair, partial modernization, LED conversion or replacement is sensible'],
      decisionGuide: {
        eyebrow: 'Decision guide',
        title: 'Repair, partial modernization, LED conversion or replacement?',
        intro: 'The right recommendation does not depend on one keyword. PixelRing first separates the defect, light output, existing substance and desired brand impact.',
        options: [
          { tag: '01', title: 'Repair', text: 'Fits when there is a concrete failure and housing, light output and structure can generally remain in use.' },
          { tag: '02', title: 'Partial modernization', text: 'Useful when the installation can stay, but modules, power supplies, controls, seals or light output should be updated.' },
          { tag: '03', title: 'LED conversion', text: 'Relevant for older tube, neon or inefficient lighting when space, heat, power supply and desired light effect are suitable.' },
          { tag: '04', title: 'Replacement solution', text: 'Reviewed when housing, faces, corrosion, fixing, access or brand requirements argue against continued use.' },
        ],
        noteTitle: 'No fixed recommendation from one photo alone',
        noteText: 'Photos and videos help with first classification. A binding recommendation only follows after reviewing condition, access, electrical components and the desired result.',
      },
      requestChecklist: {
        eyebrow: 'Request checklist',
        title: 'What helps with a first assessment',
        intro: 'You do not need technical terms. Photos, short videos and simple location details are often enough for the first step.',
        items: ['Overall photo of the sign', 'Close-up of the affected area', 'Short video when it flickers', 'Address, city or location note', 'Mounting height and access', 'Age of the installation if known', 'When the issue appears', 'Clues such as rain, smell, heat or tripped fuse'],
      },
      processTitle: 'Process',
      process: [
        { title: 'Send photos, video or goal', text: 'You send images, location details and short notes about the issue or desired light output.' },
        { title: 'Technical first assessment', text: 'PixelRing classifies likely affected components and whether an on-site appointment makes sense.' },
        { title: 'Agree repair, conversion or replacement', text: 'After review, PixelRing clarifies what should be preserved, modernized or replaced.' },
      ],
      boundaryTitle: 'Clear frame',
      boundaryText: 'PixelRing remains the central contact and coordinates specialist execution. This is not a marketplace and not an unlimited technology contract.',
      boundaries: ['The scope is reviewed based on condition, access, components and desired light output.', 'Electrical work is reviewed and coordinated in the appropriate specialist frame.', 'Binding prices, dates and economic statements only follow after review and confirmation.'],
      faqTitle: 'Illuminated signage FAQ',
      faqs: [
        { question: 'Can old illuminated signage be converted to LED?', answer: 'Often a partial modernization is possible. Housing, power, space, moisture protection and desired light output matter.' },
        { question: 'Is LED conversion worthwhile for a lightbox?', answer: 'It depends on condition, operating time, power supply, serviceability and light output. PixelRing first checks whether conversion can make technical and economic sense.' },
        { question: 'Can a lightbox be modernized without full replacement?', answer: 'Not automatically. PixelRing checks repair and sensible partial modernization before recommending a replacement.' },
        { question: 'Why does my LED sign flicker?', answer: 'Flickering can come from power supplies, moisture, LED modules, wiring or controls. A reliable assessment requires photos, a description and sometimes an on-site check.' },
        { question: 'What should I do with uneven illumination?', answer: 'An overall photo, close-up and note about whether the uneven area is new are helpful. Housing, module position, light color, face material and technology age are reviewed together.' },
        { question: 'Is LED signage maintenance-free?', answer: 'No. LED technology can be lower-maintenance and easier to service, but still depends on drivers, moisture protection, heat, controls and installation context.' },
      ],
      nextStep: {
        eyebrow: 'NEXT STEP',
        title: 'Choose the next step for the existing installation',
        intro: 'When light, technology and existing structure are involved, the first task is classification: repair, partial modernization, LED conversion or replacement.',
        requestTitle: 'Request modernization',
        requestText: 'Send photos, a short flicker video if relevant, location details, access information and your goal for light output or brand impact.',
        requestCta: 'Request LED modernization',
        servicesTitle: 'When another service fits better',
        servicesText: 'Not every lighting issue is immediately a modernization. These service pages separate repair, diagnostics and installation clearly.',
        links: [
          { title: 'Signage repair', text: 'When a concrete fault should be fixed first.', href: '/leistungen/werbeanlagen-reparatur', tag: 'Repair' },
          { title: 'Audit & diagnostics', text: 'When condition, cause or priority need a structured review first.', href: '/leistungen/werbeanlagen-audit-diagnose', tag: 'Diagnostics' },
          { title: 'Installation & dismantling', text: 'When removal, access, relocation or new fixing is part of the task.', href: '/leistungen/montage-demontage-werbeanlagen', tag: 'Installation' },
        ],
      },
      offerCatalog: ['Lightbox LED retrofit', 'LED module replacement', 'Power supply, transformer and controller check', 'Preserve neon or review LED alternative', 'Improve light pattern and illumination', 'Check existing structure for partial modernization'],
      omitRegionalAreaServed: true,
      finalHeadline: 'Should your illuminated signage work reliably again?',
      finalText: 'Send photos or a short description. PixelRing checks whether repair, partial modernization, LED conversion or replacement is the next sensible step.',
    },
    'werbeanlagen-audit-diagnose': {
      serviceName: 'Inspection, audit & diagnostics for signage',
      intent: 'diagnose',
      metaTitle: 'Signage Audit & Diagnostics | PixelRing',
      metaDescription:
        'PixelRing reviews condition, damage, electrical clues, mounting, visibility and risks for business signage in Berlin & Brandenburg.',
      heroEyebrow: 'Audit & diagnostics',
      heroTitle: 'Inspection, audit & diagnostics for signage',
      heroIntro:
        'PixelRing records condition, cause, scope and visible risks. The result is a clear recommendation for repair, maintenance or the next sensible step.',
      image: '/images/about/service_deep_3.png',
      imageAlt: 'Signage inspection with documented checkpoints',
      primaryCta: 'Start diagnostics',
      secondaryCta: 'All services',
      tasksTitle: 'When an audit makes sense',
      tasksIntro: 'An audit helps structure visible defects, technical risks and priorities before work is commissioned.',
      tasks: [
        { title: 'Unclear symptoms', text: 'The installation flickers, fails irregularly or shows several symptoms at once.' },
        { title: 'Location or branch check', text: 'Several visible advertising surfaces need condition, priority and next-step review.' },
        { title: 'Safety and mounting risks', text: 'Loose parts, aged substructures or storm damage need classification.' },
        { title: 'Decision before budget approval', text: 'The realistic and sensible scope should be clear before repair or modernization starts.' },
      ],
      checksTitle: 'What is checked',
      checksIntro: 'The check stays practical: visible damage, technical signs and site conditions are brought together.',
      checks: ['Housing, acrylic, films, frames and visible damage', 'Light output, electrical clues, moisture and failures', 'Mounting points, substructure and access', 'Priority: act now, plan or monitor'],
      processTitle: 'Process',
      process: [
        { title: 'Describe the asset', text: 'Photos, location, height, access and observed symptoms are collected.' },
        { title: 'Choose remote or on-site review', text: 'PixelRing clarifies whether remote assessment is enough or an on-site appointment makes sense.' },
        { title: 'Receive recommendation', text: 'You receive the next sensible step: repair, maintenance, modernization or further review.' },
      ],
      boundaryTitle: 'Clear frame',
      boundaryText: 'An audit is a structured assessment, not a hidden sales flow. The aim is a traceable next-step decision.',
      boundaries: ['A request number alone never exposes private request data.', 'Photos and location information are treated as sensitive service data.', 'Costs and dates stay non-binding until PixelRing confirms the scope.'],
      faqTitle: 'Audit & diagnostics FAQ',
      faqs: [
        { question: 'Is a photo enough for diagnostics?', answer: 'Often for a first assessment. Electrical, height, mounting or safety topics may require an on-site appointment.' },
        { question: 'Is the audit suitable for several locations?', answer: 'Yes. PixelRing can structure conditions and priorities across multiple locations.' },
      ],
      finalHeadline: 'Do you need clarity before commissioning work?',
      finalText: 'Send photos and a short description. PixelRing structures condition, risk and the next step.',
    },
    'montage-demontage-werbeanlagen': {
      serviceName: 'Installation, dismantling & relocation of signage',
      intent: 'montage-demontage',
      metaTitle: 'Signage Installation & Dismantling | PixelRing',
      metaDescription:
        'PixelRing coordinates installation, dismantling, removal and relocation of signage in Berlin & Brandenburg.',
      heroEyebrow: 'Installation & removal',
      heroTitle: 'Installation, dismantling & relocation of signage',
      heroIntro:
        'PixelRing coordinates new, existing or relocated signage: from surface review to the right specialist coordination and next steps.',
      image: '/images/leistungen/werbeanlagen-montage-demontage-sportzentrum-fassade.webp',
      imageAlt: 'Signage installation and dismantling at a business location',
      primaryCta: 'Request installation',
      secondaryCta: 'All services',
      tasksTitle: 'Typical installation and removal cases',
      tasksIntro: 'This page covers coordinated work at business locations while keeping PixelRing as one accountable service company.',
      tasks: [
        { title: 'Install a new asset', text: 'Signs, lightboxes or lettering are mounted after site review and coordination.' },
        { title: 'Dismantle an existing asset', text: 'Removal, rollback and surface preparation are planned in an orderly way.' },
        { title: 'Relocate signage', text: 'For a site move or renovation, PixelRing checks what can be reused.' },
        { title: 'Clarify mounting and substrate', text: 'Fixing points, height, access and substrate are considered before execution.' },
      ],
      checksTitle: 'What is clarified first',
      checksIntro: 'Installation and removal need a clear frame, especially around height, electricity, facade and public space.',
      checks: ['Dimensions, weight, substrate and mounting points', 'Access, height, working area and appointment window', 'Electrical connections and existing lines', 'Whether permits, property management or further coordination are needed'],
      processTitle: 'Process',
      process: [
        { title: 'Record task and location', text: 'You send photos, dimensions, address and goal: installation, dismantling or relocation.' },
        { title: 'Check the frame', text: 'PixelRing reviews access, technical points and coordination needs.' },
        { title: 'Coordinate execution', text: 'After confirmation, appointment, scope and specialists are coordinated.' },
      ],
      boundaryTitle: 'Clear frame',
      boundaryText: 'PixelRing remains the central coordination point. Electrical, height or facade work is planned only in the right specialist frame.',
      boundaries: ['Berlin & Brandenburg as core area; other German regions on request.', 'Special access, height work or permits are reviewed separately.', 'Dismantling does not automatically include disposal or surface repair unless agreed.'],
      faqTitle: 'Installation & dismantling FAQ',
      faqs: [
        { question: 'Can PixelRing move an existing sign to a new location?', answer: 'Yes, if condition, dimensions, mounting and new substrate fit. Reusable parts are checked first.' },
        { question: 'Can PixelRing handle removal when a shop closes?', answer: 'PixelRing can coordinate removal and dismantling. Surface repair or special disposal is clarified separately.' },
      ],
      finalHeadline: 'Does signage need to be installed, removed or relocated?',
      finalText: 'Send location, photos and a short task description. PixelRing checks the frame and coordinates the next step.',
    },
    'druckprodukte-branding-werbematerialien': {
      serviceName: 'Print products, branding & advertising materials',
      intent: 'druckprodukte-branding',
      metaTitle: 'Print, Branding & Advertising Materials | PixelRing',
      metaDescription:
        'PixelRing supports print data, vinyl, lettering, banners, posters, stickers and location branding for businesses.',
      heroEyebrow: 'Branding & materials',
      heroTitle: 'Print products, branding & advertising materials',
      heroIntro:
        'PixelRing supports visible location branding: print data, vinyl, lettering, posters, banners, information signs and ongoing material supply.',
      image: '/images/leistungen/hero-branding.png',
      imageAlt: 'Branding, vinyl and advertising materials for a business location',
      primaryCta: 'Request branding',
      secondaryCta: 'All services',
      tasksTitle: 'Typical branding tasks',
      tasksIntro: 'This page covers materials and visible surfaces that need professional care during daily business.',
      tasks: [
        { title: 'Prepare print data', text: 'Existing data is checked, adapted or prepared for production and location use.' },
        { title: 'Vinyl and lettering', text: 'Windows, surfaces, doors or information points are planned with visible brand elements.' },
        { title: 'Posters, banners and stickers', text: 'Recurring advertising materials are coordinated for the location need.' },
        { title: 'Supply branches and locations', text: 'For several locations, PixelRing can bundle material needs and service requests.' },
      ],
      checksTitle: 'What PixelRing coordinates',
      checksIntro: 'Branding is not only printing; it requires usable data, materials, surfaces and execution.',
      checks: ['Existing print data, formats, colors and readability', 'Surface, placement, durability and care needs', 'Material selection for films, banners, posters and signs', 'Coordination with repair, installation or location service if needed'],
      processTitle: 'Process',
      process: [
        { title: 'Send need and data', text: 'You send files, photos, dimensions and intended use.' },
        { title: 'Check feasibility', text: 'PixelRing clarifies data quality, material, surface and sensible execution.' },
        { title: 'Coordinate production and service', text: 'After confirmation, material, timing and installation if needed are coordinated.' },
      ],
      boundaryTitle: 'Clear frame',
      boundaryText: 'PixelRing communicates branding as service around business locations, not as an uncontrolled online print shop.',
      boundaries: ['Design, print data, vinyl and advertising materials are confirmed service areas.', 'In-house production is not claimed unless the concrete production scope is confirmed.', 'Color, material and durability statements depend on use case and approval.'],
      faqTitle: 'Branding & materials FAQ',
      faqs: [
        { question: 'Can PixelRing check existing print data?', answer: 'Yes. PixelRing can review files for usability, format and coordination needs.' },
        { question: 'Is vinyl included?', answer: 'Yes. Vinyl, lettering and visible brand elements are part of the confirmed service area.' },
      ],
      finalHeadline: 'Does your location need new materials or visible branding?',
      finalText: 'Send files, photos or a short description. PixelRing checks material, surface and the next sensible step.',
    },
  },
  ru: {} as Record<ServiceDetailSlug, ServiceDetailContent>,
  tr: {} as Record<ServiceDetailSlug, ServiceDetailContent>,
  pl: {} as Record<ServiceDetailSlug, ServiceDetailContent>,
  ar: {} as Record<ServiceDetailSlug, ServiceDetailContent>,
};

SERVICE_DETAIL_CONTENT.ru = {
  'lichtwerbung-led-modernisierung': {
    ...SERVICE_DETAIL_CONTENT.en['lichtwerbung-led-modernisierung'],
    serviceName: 'Модернизация световой и наружной рекламы',
    metaTitle: 'Модернизация световой рекламы и LED-переоборудование | PixelRing',
    metaDescription:
      'PixelRing проверяет и модернизирует существующую световую рекламу: LED-модули, блоки питания, контроллеры, неон, световые короба, свет и конструкцию.',
    heroEyebrow: 'Световая реклама и LED-сервис',
    heroTitle: 'Модернизация световой и наружной рекламы',
    heroIntro:
      'Существующую световую рекламу не всегда нужно полностью менять. PixelRing проверяет LED-модули, блоки питания, трансформаторы, контроллеры, неон, световые короба, проводку, световой образ и конструкцию - и уточняет, что разумнее: ремонт, частичная модернизация, переход на LED или замена.',
    imageAlt: 'Модернизированная световая и наружная реклама на бизнес-локации',
    primaryCta: 'Отправить фото и получить оценку',
    secondaryCta: 'Проверить ремонт вместо замены',
    tasksTitle: 'Что можно модернизировать в существующей световой рекламе',
    tasksIntro:
      'Фокус - на существующих установках: подсветка, световой образ и конструкция проверяются до рекомендации замены или переоборудования.',
    tasks: [
      { title: 'Перевести световую вывеску на LED', text: 'Старую светотехнику часто можно переоборудовать на LED, если подходят корпус, место, питание и защита от влаги.' },
      { title: 'Дооснастить световой короб LED', text: 'Существующий короб проверяется по равномерности света, расположению модулей, блокам питания, фронтам и обслуживаемости.' },
      { title: 'Сохранить неон или проверить LED-альтернативу', text: 'Для старого неона или трубок сначала оцениваются ремонт, сохранение, частичная модернизация или LED-альтернатива.' },
      { title: 'Улучшить неравномерную подсветку', text: 'Темные зоны, пятна, разные оттенки света и видимые LED-точки оцениваются с учетом читаемости и бренда.' },
      { title: 'Проверить LED-модули, питание и контроллеры', text: 'Модули, LED-ленты, блоки питания, трансформаторы, контроллеры, таймеры и диммеры рассматриваются как единая система.' },
      { title: 'Сохранить существующую конструкцию', text: 'Корпус, акрил, крепления, уплотнения и доступ проверяются, чтобы пригодные части не заменялись преждевременно.' },
    ],
    problemLinks: {
      eyebrow: 'Подходящие страницы проблем',
      title: 'Когда модернизация начинается с конкретной неисправности',
      intro:
        'Иногда запрос появляется не как плановый апгрейд, а из-за мерцания, отказа или плохого светового образа. Эти страницы помогают сориентироваться.',
      links: [
        { title: 'Вывеска мерцает', text: 'Возможные признаки проблем с питанием, влагой, LED-модулями или управлением.', href: '/probleme-loesungen/werbeanlage-flackert', tag: 'Мерцание' },
        { title: 'LED светит неравномерно', text: 'Темные зоны, видимые точки, неправильный цвет или неровный свет.', href: '/probleme-loesungen/led-leuchtet-ungleichmaessig', tag: 'Свет' },
        { title: 'Буква не светится', text: 'Отказ отдельных объемных букв, модулей, соединений или блоков питания.', href: '/probleme-loesungen/buchstabe-leuchtet-nicht', tag: 'Буквы' },
        { title: 'Вывеска не светится', text: 'Полный отказ подсветки с возможной проверкой питания и управления.', href: '/probleme-loesungen/werbeanlage-leuchtet-nicht', tag: 'Отказ' },
      ],
    },
    checksTitle: 'Что PixelRing проверяет сначала',
    checksIntro:
      'Модернизация не начинается с замены любой ценой. Сначала уточняются состояние, симптомы и технические ограничения.',
    checks: ['Питание, блоки питания, трансформаторы, автоматы и проводка', 'LED-модули, LED-ленты, неоновые трубки, цвет и яркость света', 'Контроллеры, датчики, таймеры, диммеры и поведение включения', 'Корпус, уплотнения, влага, коррозия и доступность', 'Световой образ, тени, пятна, читаемость и восприятие бренда', 'Что разумнее: ремонт, частичная модернизация, переход на LED или замена'],
    decisionGuide: {
      eyebrow: 'Помощь с выбором',
      title: 'Ремонт, частичная модернизация, переход на LED или замена?',
      intro: 'Правильная рекомендация не зависит от одного красивого термина. PixelRing сначала разделяет неисправность, световой образ, существующую основу и желаемое восприятие бренда.',
      options: [
        { tag: '01', title: 'Ремонт', text: 'Подходит, когда есть конкретный отказ, а корпус, световой образ и конструкция в целом еще могут использоваться.' },
        { tag: '02', title: 'Частичная модернизация', text: 'Имеет смысл, когда установку можно сохранить, но стоит обновить модули, питание, управление, уплотнения или световой образ.' },
        { tag: '03', title: 'Переход на LED', text: 'Актуален для старых трубок, неона или неэффективной светотехники, если подходят место, теплоотвод, питание и желаемый свет.' },
        { tag: '04', title: 'Замена', text: 'Проверяется, если корпус, фронты, коррозия, крепление, доступ или требования бренда говорят против дальнейшего использования.' },
      ],
      noteTitle: 'Нет фиксированной рекомендации только по одному фото',
      noteText: 'Фото и видео помогают для первичной классификации. Обязательная рекомендация возможна только после проверки состояния, доступа, электрических компонентов и желаемого результата.',
    },
    requestChecklist: {
      eyebrow: 'Чеклист заявки',
      title: 'Что помогает для первой оценки',
      intro: 'Технические термины знать не нужно. Обычно достаточно фото, короткого видео и простой информации о локации.',
      items: ['Общее фото установки', 'Крупный план проблемного места', 'Короткое видео при мерцании', 'Адрес, город или описание локации', 'Высота монтажа и доступ', 'Возраст установки, если известен', 'Когда проявляется проблема', 'Признаки: дождь, запах, нагрев или сработавший автомат'],
    },
    processTitle: 'Процесс',
    process: [
      { title: 'Отправьте фото, видео или цель', text: 'Вы отправляете изображения, данные локации и короткое описание проблемы или желаемого света.' },
      { title: 'Первичная техническая оценка', text: 'PixelRing определяет вероятно затронутые компоненты и нужен ли выезд.' },
      { title: 'Согласование ремонта, переоборудования или замены', text: 'После проверки прозрачно уточняется, что сохранить, модернизировать или заменить.' },
    ],
    boundaryTitle: 'Понятные рамки',
    boundaryText:
      'PixelRing остается центральным контактом и координирует профильное выполнение. Это не маркетплейс и не безлимитный технический договор.',
    boundaries: ['Объем услуги проверяется по состоянию, доступу, компонентам и желаемому световому образу.', 'Электротехнические работы проверяются и координируются в подходящих профессиональных рамках.', 'Обязательные цены, сроки и экономические выводы появляются только после проверки и подтверждения.'],
    faqTitle: 'FAQ по световой рекламе',
    faqs: [
      { question: 'Можно ли перевести старую световую рекламу на LED?', answer: 'Частичная модернизация часто возможна. Важны корпус, питание, место, защита от влаги и нужный световой результат.' },
      { question: 'Имеет ли смысл LED-переоборудование светового короба?', answer: 'Это зависит от состояния, времени работы, питания, обслуживаемости и светового образа. PixelRing сначала проверяет, может ли переоборудование быть технически и экономически разумным.' },
      { question: 'Можно ли модернизировать световой короб без полной замены?', answer: 'Не автоматически. PixelRing сначала проверяет ремонт и разумную частичную модернизацию.' },
      { question: 'Почему LED-вывеска мерцает?', answer: 'Причиной могут быть блоки питания, влага, LED-модули, проводка или управление. Надежная оценка возможна после фото, описания и при необходимости проверки на месте.' },
      { question: 'Что делать при неравномерной подсветке?', answer: 'Помогают общее фото, крупный план и информация, новая ли эта проблема. Корпус, положение модулей, цвет света, материал фронта и возраст техники проверяются вместе.' },
      { question: 'LED-реклама не требует обслуживания?', answer: 'Нет. LED-техника может быть менее требовательной и удобнее в обслуживании, но зависит от блоков питания, защиты от влаги, тепла, управления и монтажа.' },
    ],
    nextStep: {
      eyebrow: 'NEXT STEP',
      title: 'Выбрать следующий шаг для существующей установки',
      intro: 'Когда речь о свете, технике и существующей конструкции, сначала важно правильно классифицировать задачу: ремонт, частичная модернизация, переход на LED или замена.',
      requestTitle: 'Запросить модернизацию',
      requestText: 'Отправьте фото, короткое видео при мерцании, данные локации, информацию о доступе и желаемый световой результат.',
      requestCta: 'Запросить LED-модернизацию',
      servicesTitle: 'Если лучше подходит другая услуга',
      servicesText: 'Не каждый световой случай сразу является модернизацией. Эти страницы отделяют ремонт, диагностику и монтаж.',
      links: [
        { title: 'Ремонт рекламных конструкций', text: 'Если сначала нужно устранить конкретную неисправность.', href: '/leistungen/werbeanlagen-reparatur', tag: 'Ремонт' },
        { title: 'Аудит и диагностика', text: 'Если сначала нужно структурно проверить состояние, причину или приоритет.', href: '/leistungen/werbeanlagen-audit-diagnose', tag: 'Диагностика' },
        { title: 'Монтаж и демонтаж', text: 'Если задача включает снятие, доступ, перенос или новое крепление.', href: '/leistungen/montage-demontage-werbeanlagen', tag: 'Монтаж' },
      ],
    },
    offerCatalog: ['Дооснащение светового короба LED', 'Замена LED-модулей', 'Проверка блоков питания, трансформаторов и контроллеров', 'Сохранение неона или проверка LED-альтернативы', 'Улучшение светового образа и равномерности', 'Проверка существующей конструкции для частичной модернизации'],
    finalHeadline: 'Нужно, чтобы световая реклама снова работала надежно?',
    finalText:
      'Отправьте фото или короткое описание. PixelRing проверит, что разумнее: ремонт, частичная модернизация, переход на LED или замена.',
  },
  'werbeanlagen-audit-diagnose': {
    ...SERVICE_DETAIL_CONTENT.en['werbeanlagen-audit-diagnose'],
    serviceName: 'Инспекция, аудит и диагностика рекламных установок',
    metaTitle: 'Аудит и диагностика рекламных установок | PixelRing',
    metaDescription:
      'PixelRing проверяет состояние, повреждения, электрику, крепления, видимость и риски рекламных установок в Берлине и Бранденбурге.',
    heroEyebrow: 'Аудит и диагностика',
    heroTitle: 'Инспекция, аудит и диагностика рекламных установок',
    heroIntro:
      'PixelRing фиксирует состояние, причину, объем и видимые риски рекламной установки. Результат - понятная рекомендация по ремонту, обслуживанию или следующему шагу.',
    imageAlt: 'Инспекция рекламной установки с документированными пунктами проверки',
    primaryCta: 'Начать диагностику',
    secondaryCta: 'Все услуги',
    tasksTitle: 'Когда нужен аудит',
    tasksIntro: 'Аудит помогает структурировать видимые дефекты, технические риски и приоритеты до заказа работ.',
    tasks: [
      { title: 'Непонятная неисправность', text: 'Установка мигает, отключается нерегулярно или показывает несколько симптомов одновременно.' },
      { title: 'Проверка локации или филиала', text: 'Несколько видимых рекламных поверхностей нужно оценить по состоянию, приоритету и следующему шагу.' },
      { title: 'Риски безопасности и креплений', text: 'Ослабленные элементы, старые подконструкции или повреждения после непогоды требуют оценки.' },
      { title: 'Решение перед бюджетом', text: 'Перед ремонтом или модернизацией нужно понять реалистичный и разумный объем.' },
    ],
    checksTitle: 'Что проверяется',
    checksIntro: 'Проверка остается практичной: видимые повреждения, технические признаки и условия локации собираются вместе.',
    checks: ['Корпус, акрил, пленки, рамы и видимые повреждения', 'Свет, электрические признаки, влага и отключения', 'Точки крепления, подконструкция и доступность', 'Приоритет: срочно действовать, планировать или наблюдать'],
    processTitle: 'Процесс',
    process: [
      { title: 'Опишите объект', text: 'Собираются фото, локация, высота, доступность и наблюдаемые симптомы.' },
      { title: 'Выбор удаленной или выездной проверки', text: 'PixelRing уточняет, достаточно ли удаленной оценки или нужен выезд.' },
      { title: 'Получение рекомендации', text: 'Вы получаете следующий разумный шаг: ремонт, обслуживание, модернизация или дополнительная проверка.' },
    ],
    boundaryTitle: 'Понятные рамки',
    boundaryText: 'Аудит - это структурированная оценка, а не скрытая продажа. Цель - понятное решение о следующем шаге.',
    boundaries: ['Один номер заявки сам по себе не раскрывает приватные данные.', 'Фото и информация о локации считаются чувствительными сервисными данными.', 'Стоимость и сроки остаются необязательными до подтверждения объема PixelRing.'],
    faqTitle: 'FAQ по аудиту и диагностике',
    faqs: [
      { question: 'Достаточно ли фото для диагностики?', answer: 'Часто да для первичной оценки. Электрика, высота, крепления или безопасность могут потребовать выезда.' },
      { question: 'Подходит ли аудит для нескольких локаций?', answer: 'Да. PixelRing может структурировать состояние и приоритеты по нескольким локациям.' },
    ],
    finalHeadline: 'Нужна ясность перед заказом работ?',
    finalText: 'Отправьте фото и короткое описание. PixelRing структурирует состояние, риск и следующий шаг.',
  },
  'montage-demontage-werbeanlagen': {
    ...SERVICE_DETAIL_CONTENT.en['montage-demontage-werbeanlagen'],
    serviceName: 'Монтаж, демонтаж и перенос рекламных установок',
    metaTitle: 'Монтаж и демонтаж рекламных установок | PixelRing',
    metaDescription:
      'PixelRing координирует монтаж, демонтаж, снятие и перенос рекламных установок в Берлине и Бранденбурге.',
    heroEyebrow: 'Монтаж и снятие',
    heroTitle: 'Монтаж, демонтаж и перенос рекламных установок',
    heroIntro:
      'PixelRing координирует новые, существующие или переносимые рекламные установки: от проверки поверхности до подбора профильного выполнения и следующих шагов.',
    imageAlt: 'Монтаж и демонтаж рекламных установок на бизнес-локации',
    primaryCta: 'Запросить монтаж',
    secondaryCta: 'Все услуги',
    tasksTitle: 'Типовые случаи монтажа и демонтажа',
    tasksIntro: 'Страница покрывает скоординированные работы на бизнес-локациях, сохраняя PixelRing как одну ответственную сервисную компанию.',
    tasks: [
      { title: 'Смонтировать новую установку', text: 'Вывески, световые короба или надписи монтируются после проверки локации и согласования.' },
      { title: 'Демонтировать существующую установку', text: 'Снятие, возврат состояния и подготовка поверхности планируются по порядку.' },
      { title: 'Перенести вывеску', text: 'При переезде или ремонте PixelRing проверяет, что можно использовать повторно.' },
      { title: 'Уточнить крепление и основание', text: 'Точки крепления, высота, доступ и основание учитываются до выполнения.' },
    ],
    checksTitle: 'Что уточняется сначала',
    checksIntro: 'Монтаж и снятие требуют понятных рамок, особенно при высоте, электрике, фасаде и общественном пространстве.',
    checks: ['Размеры, вес, основание и точки крепления', 'Доступ, высота, рабочая зона и временное окно', 'Электроподключение и существующие линии', 'Нужны ли разрешения, управляющая компания или дополнительные согласования'],
    processTitle: 'Процесс',
    process: [
      { title: 'Зафиксировать задачу и локацию', text: 'Вы отправляете фото, размеры, адрес и цель: монтаж, демонтаж или перенос.' },
      { title: 'Проверить рамки', text: 'PixelRing оценивает доступ, технические точки и необходимость координации.' },
      { title: 'Скоординировать выполнение', text: 'После подтверждения согласуются срок, объем и специалисты.' },
    ],
    boundaryTitle: 'Понятные рамки',
    boundaryText: 'PixelRing остается центральной координацией. Электрика, высотные или фасадные работы планируются только в подходящих профессиональных рамках.',
    boundaries: ['Берлин и Бранденбург - основная зона; другие регионы Германии по запросу.', 'Специальный доступ, высотные работы или разрешения проверяются отдельно.', 'Демонтаж не означает автоматически утилизацию или ремонт поверхности, если это не согласовано.'],
    faqTitle: 'FAQ по монтажу и демонтажу',
    faqs: [
      { question: 'Может ли PixelRing перенести существующую вывеску?', answer: 'Да, если состояние, размеры, крепление и новое основание подходят. Повторно используемые части проверяются заранее.' },
      { question: 'Можно ли снять вывеску при закрытии точки?', answer: 'PixelRing может координировать снятие и демонтаж. Ремонт поверхности или специальная утилизация уточняются отдельно.' },
    ],
    finalHeadline: 'Нужно смонтировать, снять или перенести установку?',
    finalText: 'Отправьте локацию, фото и короткое описание задачи. PixelRing проверит рамки и скоординирует следующий шаг.',
  },
  'druckprodukte-branding-werbematerialien': {
    ...SERVICE_DETAIL_CONTENT.en['druckprodukte-branding-werbematerialien'],
    serviceName: 'Печатная продукция, брендинг и рекламные материалы',
    metaTitle: 'Печать, брендинг и рекламные материалы | PixelRing',
    metaDescription:
      'PixelRing поддерживает печатные данные, пленки, надписи, баннеры, постеры, наклейки и брендинг локаций для компаний.',
    heroEyebrow: 'Брендинг и материалы',
    heroTitle: 'Печатная продукция, брендинг и рекламные материалы',
    heroIntro:
      'PixelRing помогает с видимым брендингом локаций: печатные данные, пленки, надписи, постеры, баннеры, информационные таблички и регулярная поставка материалов.',
    imageAlt: 'Брендинг, пленка и рекламные материалы для бизнес-локации',
    primaryCta: 'Запросить брендинг',
    secondaryCta: 'Все услуги',
    tasksTitle: 'Типовые задачи брендинга',
    tasksIntro: 'Страница покрывает материалы и видимые поверхности, которые требуют профессионального сопровождения в текущей работе.',
    tasks: [
      { title: 'Подготовить печатные данные', text: 'Существующие файлы проверяются, адаптируются или готовятся для производства и использования на локации.' },
      { title: 'Пленка и надписи', text: 'Окна, поверхности, двери и информационные точки планируются с видимыми элементами бренда.' },
      { title: 'Постеры, баннеры и наклейки', text: 'Регулярные рекламные материалы координируются под потребности локации.' },
      { title: 'Обеспечение филиалов и локаций', text: 'Для нескольких локаций PixelRing может объединять потребности в материалах и сервисные заявки.' },
    ],
    checksTitle: 'Что координирует PixelRing',
    checksIntro: 'Брендинг - это не только печать, а пригодные данные, материалы, поверхности и выполнение.',
    checks: ['Существующие файлы, форматы, цвета и читаемость', 'Поверхность, место применения, долговечность и уход', 'Выбор материалов для пленок, баннеров, постеров и табличек', 'Связь с ремонтом, монтажом или сервисом локации при необходимости'],
    processTitle: 'Процесс',
    process: [
      { title: 'Отправьте задачу и данные', text: 'Вы отправляете файлы, фото, размеры и назначение.' },
      { title: 'Проверка реализуемости', text: 'PixelRing уточняет качество данных, материал, поверхность и разумное выполнение.' },
      { title: 'Координация производства и сервиса', text: 'После подтверждения согласуются материал, срок и при необходимости монтаж.' },
    ],
    boundaryTitle: 'Понятные рамки',
    boundaryText: 'PixelRing описывает брендинг как сервис вокруг бизнес-локаций, а не как неконтролируемую онлайн-типографию.',
    boundaries: ['Дизайн, печатные данные, пленка и рекламные материалы являются подтвержденными сервисными направлениями.', 'Собственное производство не заявляется, пока конкретный производственный объем не подтвержден.', 'Цвет, материал и долговечность зависят от применения и согласования.'],
    faqTitle: 'FAQ по брендингу и материалам',
    faqs: [
      { question: 'Может ли PixelRing проверить готовые печатные данные?', answer: 'Да. PixelRing может проверить файлы на пригодность, формат и необходимость согласования.' },
      { question: 'Входит ли оклейка пленкой?', answer: 'Да. Пленка, надписи и видимые элементы бренда входят в подтвержденное сервисное направление.' },
    ],
    finalHeadline: 'Нужны новые материалы или видимый брендинг локации?',
    finalText: 'Отправьте файлы, фото или короткое описание. PixelRing проверит материал, поверхность и следующий разумный шаг.',
  },
};

SERVICE_DETAIL_CONTENT.tr = {
  'lichtwerbung-led-modernisierung': {
    ...SERVICE_DETAIL_CONTENT.en['lichtwerbung-led-modernisierung'],
    serviceName: 'Işıklı reklam ve dış mekan reklamı modernizasyonu',
    metaTitle: 'Işıklı Reklam Modernizasyonu ve LED Dönüşümü | PixelRing',
    metaDescription:
      'PixelRing mevcut ışıklı reklamları kontrol eder ve modernize eder: LED modüller, güç kaynakları, kontrol cihazları, neon, ışıklı kutu, ışık etkisi ve konstrüksiyon.',
    heroEyebrow: 'Işıklı reklam ve LED servisi',
    heroTitle: 'Işıklı reklam ve dış mekan reklamı modernizasyonu',
    heroIntro:
      'Mevcut ışıklı reklam otomatik olarak tamamen değiştirilmek zorunda değildir. PixelRing LED modülleri, güç kaynaklarını, trafoları, kontrol cihazlarını, neon, ışıklı kutu, kablolama, ışık etkisi ve konstrüksiyonu kontrol eder; onarım, kısmi modernizasyon, LED dönüşümü veya değişimden hangisinin mantıklı olduğunu netleştirir.',
    imageAlt: 'Bir iş lokasyonunda modernize edilmiş ışıklı reklam ve dış mekan reklamı',
    primaryCta: 'Fotoğraf gönder ve değerlendirme al',
    secondaryCta: 'Değişimden önce onarımı kontrol et',
    tasksTitle: 'Mevcut ışıklı reklamda neler modernize edilebilir',
    tasksIntro: 'Odak mevcut sistemdedir: aydınlatma, ışık etkisi ve konstrüksiyon, değişim veya dönüşüm önerilmeden önce kontrol edilir.',
    tasks: [
      { title: 'Işıklı reklamı LED’e dönüştürme', text: 'Eski ışık tekniği, gövde, alan, güç kaynağı ve nem koruması uygunsa çoğu zaman LED’e dönüştürülebilir.' },
      { title: 'Işıklı kutuya LED ekleme', text: 'Mevcut ışıklı kutu; aydınlatma, modül konumu, güç kaynakları, ön yüzeyler ve bakım kolaylığı açısından kontrol edilir.' },
      { title: 'Neonu koruma veya LED alternatifini kontrol etme', text: 'Eski neon veya tüp sistemlerinde önce onarım, koruma, kısmi modernizasyon veya LED alternatifi değerlendirilir.' },
      { title: 'Düzensiz aydınlatmayı iyileştirme', text: 'Karanlık bölgeler, parlak noktalar, farklı ışık renkleri ve görünen LED noktaları okunabilirlik ve marka etkisiyle birlikte değerlendirilir.' },
      { title: 'LED modülleri, güç kaynakları ve kontrol cihazlarını kontrol etme', text: 'Modüller, LED şeritler, güç kaynakları, trafolar, kontrol cihazları, zamanlayıcılar ve dimmerler tek sistem olarak ele alınır.' },
      { title: 'Mevcut konstrüksiyonu kullanmaya devam etme', text: 'Gövde, akrilik yüzeyler, bağlantılar, contalar ve erişim kontrol edilir; kullanılabilir parçalar erken değiştirilmez.' },
    ],
    problemLinks: {
      eyebrow: 'İlgili problem sayfaları',
      title: 'Modernizasyon somut bir arızadan başladığında',
      intro: 'Bazen ihtiyaç planlı bir yükseltme değil, titreme, kesinti veya kötü ışık etkisiyle başlar. Bu sayfalar sorunu sınıflandırmaya yardımcı olur.',
      links: [
        { title: 'Tabela titriyor', text: 'Güç kaynakları, nem, LED modülleri veya kontrol sistemiyle ilgili olası işaretler.', href: '/probleme-loesungen/werbeanlage-flackert', tag: 'Titreme' },
        { title: 'LED düzensiz yanıyor', text: 'Karanlık bölgeler, görünen noktalar, yanlış ışık rengi veya düzensiz aydınlatma.', href: '/probleme-loesungen/led-leuchtet-ungleichmaessig', tag: 'Işık' },
        { title: 'Harf yanmıyor', text: 'Tek harf, modül, bağlantı veya güç kaynağı arızaları.', href: '/probleme-loesungen/buchstabe-leuchtet-nicht', tag: 'Harf' },
        { title: 'Tabela yanmıyor', text: 'Güç kaynağı ve kontrolün incelenmesini gerektirebilecek tam aydınlatma kesintisi.', href: '/probleme-loesungen/werbeanlage-leuchtet-nicht', tag: 'Kesinti' },
      ],
    },
    checksTitle: 'PixelRing önce neyi kontrol eder',
    checksIntro: 'Modernizasyon her şeyi değiştirmekle başlamaz; önce durum ve teknik çerçeve netleşir.',
    checks: ['Güç kaynağı, trafolar, sigortalar ve kablolama', 'LED modüller, LED şeritler, neon tüpler, ışık rengi ve parlaklık', 'Kontrol cihazları, sensörler, zamanlayıcılar, dimmerler ve açma-kapama davranışı', 'Gövde, contalar, nem, korozyon ve erişim', 'Işık etkisi, gölgeler, parlak noktalar, okunabilirlik ve marka etkisi', 'Onarım, kısmi modernizasyon, LED dönüşümü veya değişimden hangisinin mantıklı olduğu'],
    decisionGuide: {
      eyebrow: 'Karar rehberi',
      title: 'Onarım, kısmi modernizasyon, LED dönüşümü veya değişim?',
      intro: 'Doğru öneri tek bir kelimeye bağlı değildir. PixelRing önce arızayı, ışık etkisini, mevcut yapıyı ve istenen marka etkisini ayırır.',
      options: [
        { tag: '01', title: 'Onarım', text: 'Somut bir arıza varsa ve gövde, ışık etkisi ve konstrüksiyon genel olarak kullanılmaya devam edebiliyorsa uygundur.' },
        { tag: '02', title: 'Kısmi modernizasyon', text: 'Sistem korunabiliyor ancak modüller, güç kaynakları, kontrol, contalar veya ışık etkisi yenilenmeliyse mantıklıdır.' },
        { tag: '03', title: 'LED dönüşümü', text: 'Eski tüp, neon veya verimsiz ışık tekniğinde; alan, ısı, güç kaynağı ve istenen ışık uygunsa değerlendirilir.' },
        { tag: '04', title: 'Değişim çözümü', text: 'Gövde, ön yüzey, korozyon, bağlantı, erişim veya marka gereklilikleri kullanıma devam etmeye karşıysa kontrol edilir.' },
      ],
      noteTitle: 'Tek fotoğrafla sabit öneri yok',
      noteText: 'Fotoğraf ve videolar ilk sınıflandırmaya yardımcı olur. Bağlayıcı öneri ancak durum, erişim, elektrik bileşenleri ve istenen sonuç incelendikten sonra oluşur.',
    },
    requestChecklist: {
      eyebrow: 'Talep kontrol listesi',
      title: 'İlk değerlendirme için neler yardımcı olur',
      intro: 'Teknik terimleri bilmeniz gerekmez. Fotoğraflar, kısa videolar ve basit lokasyon bilgileri çoğu zaman ilk adım için yeterlidir.',
      items: ['Sistemin genel fotoğrafı', 'Etkilenen noktanın yakın fotoğrafı', 'Titreme varsa kısa video', 'Adres, şehir veya lokasyon notu', 'Montaj yüksekliği ve erişim', 'Biliniyorsa sistemin yaşı', 'Sorunun ne zaman ortaya çıktığı', 'Yağmur, koku, ısı veya atan sigorta gibi ipuçları'],
    },
    processTitle: 'Süreç',
    process: [
      { title: 'Fotoğraf, video veya hedef gönderin', text: 'Görseller, lokasyon bilgisi ve sorun ya da istenen ışık etkisi hakkında kısa notlar gönderilir.' },
      { title: 'İlk teknik değerlendirme', text: 'PixelRing muhtemel etkilenen parçaları ve yerinde randevu gerekip gerekmediğini değerlendirir.' },
      { title: 'Onarım, dönüşüm veya değişimi netleştirme', text: 'Kontrol sonrası neyin korunacağı, modernize edileceği veya değiştirileceği şeffaf şekilde belirlenir.' },
    ],
    boundaryTitle: 'Net çerçeve',
    boundaryText: 'PixelRing merkezi muhatap olarak kalır ve uzman uygulamayı koordine eder. Bu bir pazar yeri değildir.',
    boundaries: ['Hizmet kapsamı durum, erişim, parçalar ve istenen ışık etkisine göre kontrol edilir.', 'Elektrik işleri uygun uzman çerçevede değerlendirilir.', 'Bağlayıcı fiyatlar, tarihler ve ekonomik ifadeler ancak inceleme ve onaydan sonra oluşur.'],
    faqTitle: 'Işıklı reklam SSS',
    faqs: [
      { question: 'Eski ışıklı reklam LED’e çevrilebilir mi?', answer: 'Çoğu zaman kısmi modernizasyon mümkündür. Gövde, güç, alan, nem koruması ve ışık hedefi belirleyicidir.' },
      { question: 'Işıklı kutuda LED dönüşümü mantıklı mı?', answer: 'Bu durum, çalışma süresi, güç kaynağı, bakım kolaylığı ve ışık etkisine bağlıdır. PixelRing önce dönüşümün teknik ve ekonomik olarak mantıklı olup olmadığını kontrol eder.' },
      { question: 'Işıklı kutu tamamen değiştirilmeden modernize edilebilir mi?', answer: 'Otomatik olarak hayır. PixelRing önce onarım ve mantıklı kısmi modernizasyonu kontrol eder.' },
      { question: 'LED tabela neden titrer?', answer: 'Titreme güç kaynakları, nem, LED modülleri, kablolama veya kontrol sisteminden kaynaklanabilir. Güvenilir değerlendirme için fotoğraf, açıklama ve bazen yerinde kontrol gerekir.' },
      { question: 'Düzensiz aydınlatmada ne yapılmalı?', answer: 'Genel fotoğraf, yakın çekim ve bu durumun yeni olup olmadığı bilgisi yardımcı olur. Gövde, modül konumu, ışık rengi, ön yüzey malzemesi ve tekniğin yaşı birlikte kontrol edilir.' },
      { question: 'LED reklam bakım gerektirmez mi?', answer: 'Hayır. LED tekniği daha az bakım gerektirebilir ve daha kolay servis edilebilir; ancak güç kaynaklarına, nem korumasına, ısıya, kontrole ve montaja bağlıdır.' },
    ],
    nextStep: {
      eyebrow: 'NEXT STEP',
      title: 'Mevcut sistem için sonraki adımı seçin',
      intro: 'Işık, teknik ve mevcut konstrüksiyon söz konusuysa önce doğru sınıflandırma gerekir: onarım, kısmi modernizasyon, LED dönüşümü veya değişim.',
      requestTitle: 'Modernizasyon talep et',
      requestText: 'Fotoğraflar, titreme varsa kısa video, lokasyon bilgisi, erişim bilgisi ve istediğiniz ışık etkisini gönderin.',
      requestCta: 'LED modernizasyonu talep et',
      servicesTitle: 'Başka bir hizmet daha uygunsa',
      servicesText: 'Her ışık sorunu doğrudan modernizasyon değildir. Bu sayfalar onarım, teşhis ve montajı ayırır.',
      links: [
        { title: 'Tabela onarımı', text: 'Önce somut bir arıza giderilecekse.', href: '/leistungen/werbeanlagen-reparatur', tag: 'Onarım' },
        { title: 'Audit ve teşhis', text: 'Durum, neden veya öncelik önce yapılandırılmış şekilde incelenecekse.', href: '/leistungen/werbeanlagen-audit-diagnose', tag: 'Teşhis' },
        { title: 'Montaj ve demontaj', text: 'Söküm, erişim, taşıma veya yeni bağlantı işin parçasıysa.', href: '/leistungen/montage-demontage-werbeanlagen', tag: 'Montaj' },
      ],
    },
    offerCatalog: ['Işıklı kutuya LED ekleme', 'LED modül değişimi', 'Güç kaynakları, trafolar ve kontrol cihazları kontrolü', 'Neonu koruma veya LED alternatifini kontrol etme', 'Işık etkisi ve aydınlatmayı iyileştirme', 'Kısmi modernizasyon için mevcut konstrüksiyon kontrolü'],
    finalHeadline: 'Işıklı reklamınız yeniden güvenilir çalışmalı mı?',
    finalText: 'Fotoğraf veya kısa açıklama gönderin. PixelRing onarım, kısmi modernizasyon, LED dönüşümü veya değişimden hangisinin mantıklı olduğunu kontrol eder.',
  },
  'werbeanlagen-audit-diagnose': {
    ...SERVICE_DETAIL_CONTENT.en['werbeanlagen-audit-diagnose'],
    serviceName: 'Reklam sistemleri kontrolü, audit ve teşhis',
    metaTitle: 'Reklam Sistemi Audit ve Teşhis | PixelRing',
    metaDescription:
      'PixelRing Berlin ve Brandenburg’da reklam sistemlerinin durumunu, hasarını, elektriğini, sabitlemesini, görünürlüğünü ve risklerini kontrol eder.',
    heroEyebrow: 'Audit ve teşhis',
    heroTitle: 'Reklam sistemleri kontrolü, audit ve teşhis',
    heroIntro:
      'PixelRing durum, neden, kapsam ve görünür riskleri kayda alır. Sonuç onarım, bakım veya sonraki mantıklı adım için net öneridir.',
    imageAlt: 'Kontrol noktaları belgelenmiş reklam sistemi incelemesi',
    primaryCta: 'Teşhisi başlat',
    secondaryCta: 'Tüm hizmetler',
    tasksTitle: 'Audit ne zaman mantıklıdır',
    tasksIntro: 'Audit, çalışma başlamadan önce görünür kusurları, teknik riskleri ve öncelikleri düzenler.',
    tasks: [
      { title: 'Belirsiz arıza', text: 'Sistem titriyor, düzensiz kapanıyor veya aynı anda birden fazla belirti gösteriyor.' },
      { title: 'Lokasyon veya şube kontrolü', text: 'Birden fazla yüzeyin durum, öncelik ve sonraki adım açısından değerlendirilmesi gerekir.' },
      { title: 'Güvenlik ve sabitleme riskleri', text: 'Gevşek parçalar, eski taşıyıcılar veya hava hasarı sınıflandırılır.' },
      { title: 'Bütçe onayı öncesi karar', text: 'Onarım veya modernizasyon öncesi kapsamın netleşmesi gerekir.' },
    ],
    checksTitle: 'Neler kontrol edilir',
    checksIntro: 'Görünür hasar, teknik belirtiler ve lokasyon koşulları pratik şekilde birleştirilir.',
    checks: ['Gövde, akrilik, folyolar, çerçeveler ve görünür hasar', 'Işık, elektrik belirtileri, nem ve arızalar', 'Montaj noktaları, alt konstrüksiyon ve erişim', 'Öncelik: hemen yapmak, planlamak veya izlemek'],
    processTitle: 'Süreç',
    process: [
      { title: 'Sistemi açıklayın', text: 'Fotoğraflar, lokasyon, yükseklik, erişim ve belirtiler toplanır.' },
      { title: 'Uzaktan veya yerinde kontrol', text: 'PixelRing uzaktan değerlendirmenin yeterli olup olmadığını netleştirir.' },
      { title: 'Öneri alın', text: 'Onarım, bakım, modernizasyon veya ek kontrol için sonraki adım belirlenir.' },
    ],
    boundaryTitle: 'Net çerçeve',
    boundaryText: 'Audit yapılandırılmış bir değerlendirmedir; gizli satış akışı değildir.',
    boundaries: ['Sadece talep numarası özel verileri açığa çıkarmaz.', 'Fotoğraflar ve lokasyon bilgileri hassas servis verisi olarak ele alınır.', 'Maliyet ve tarihler PixelRing kapsamı onaylayana kadar bağlayıcı değildir.'],
    faqTitle: 'Audit ve teşhis SSS',
    faqs: [
      { question: 'Teşhis için fotoğraf yeterli mi?', answer: 'İlk değerlendirme için çoğu zaman evet. Elektrik, yükseklik veya güvenlik konuları yerinde randevu gerektirebilir.' },
      { question: 'Audit birden fazla lokasyon için uygun mu?', answer: 'Evet. PixelRing farklı lokasyonlarda durum ve öncelikleri yapılandırabilir.' },
    ],
    finalHeadline: 'İş emri vermeden önce netlik mi gerekiyor?',
    finalText: 'Fotoğraf ve kısa açıklama gönderin. PixelRing durum, risk ve sonraki adımı yapılandırır.',
  },
  'montage-demontage-werbeanlagen': {
    ...SERVICE_DETAIL_CONTENT.en['montage-demontage-werbeanlagen'],
    serviceName: 'Reklam sistemleri montaj, demontaj ve taşıma',
    metaTitle: 'Reklam Sistemi Montaj ve Demontaj | PixelRing',
    metaDescription:
      'PixelRing Berlin ve Brandenburg’da reklam sistemlerinin montaj, demontaj, söküm ve taşınmasını koordine eder.',
    heroEyebrow: 'Montaj ve söküm',
    heroTitle: 'Reklam sistemleri montaj, demontaj ve taşıma',
    heroIntro:
      'PixelRing yeni, mevcut veya taşınacak reklam sistemlerini koordine eder: yüzey kontrolünden uzman uygulama ve sonraki adımlara kadar.',
    imageAlt: 'Bir iş lokasyonunda reklam sistemi montaj ve demontajı',
    primaryCta: 'Montaj talep et',
    secondaryCta: 'Tüm hizmetler',
    tasksTitle: 'Tipik montaj ve söküm durumları',
    tasksIntro: 'Bu sayfa PixelRing’i tek sorumlu servis şirketi olarak koruyarak lokasyon işlerindeki koordinasyonu kapsar.',
    tasks: [
      { title: 'Yeni sistem montajı', text: 'Tabela, ışıklı kutu veya yazılar lokasyon kontrolünden sonra monte edilir.' },
      { title: 'Mevcut sistemi sökme', text: 'Söküm, geri alma ve yüzey hazırlığı düzenli şekilde planlanır.' },
      { title: 'Reklam sistemini taşıma', text: 'Taşınma veya tadilatta tekrar kullanılabilecek parçalar kontrol edilir.' },
      { title: 'Sabitleme ve zemin netleştirme', text: 'Bağlantı noktaları, yükseklik, erişim ve zemin uygulamadan önce dikkate alınır.' },
    ],
    checksTitle: 'Önce neler netleşir',
    checksIntro: 'Montaj ve söküm özellikle yükseklik, elektrik, cephe ve kamusal alan için net çerçeve ister.',
    checks: ['Ölçüler, ağırlık, zemin ve bağlantı noktaları', 'Erişim, yükseklik, çalışma alanı ve zaman penceresi', 'Elektrik bağlantıları ve mevcut hatlar', 'İzin, bina yönetimi veya ek koordinasyon gerekip gerekmediği'],
    processTitle: 'Süreç',
    process: [
      { title: 'Görev ve lokasyonu kaydedin', text: 'Fotoğraflar, ölçüler, adres ve hedef gönderilir: montaj, söküm veya taşıma.' },
      { title: 'Çerçeveyi kontrol etme', text: 'PixelRing erişim, teknik noktalar ve koordinasyon ihtiyacını değerlendirir.' },
      { title: 'Uygulamayı koordine etme', text: 'Onay sonrası randevu, kapsam ve uzmanlar koordine edilir.' },
    ],
    boundaryTitle: 'Net çerçeve',
    boundaryText: 'PixelRing merkezi koordinasyon noktasıdır. Elektrik, yükseklik veya cephe işleri uygun uzman çerçevede planlanır.',
    boundaries: ['Ana bölge Berlin ve Brandenburg; diğer Almanya bölgeleri talep üzerine.', 'Özel erişim, yüksekte çalışma veya izinler ayrı değerlendirilir.', 'Demontaj, ayrıca anlaşılmadıkça otomatik olarak bertaraf veya yüzey onarımı değildir.'],
    faqTitle: 'Montaj ve demontaj SSS',
    faqs: [
      { question: 'PixelRing mevcut tabelayı yeni yere taşıyabilir mi?', answer: 'Evet, durum, ölçüler, sabitleme ve yeni zemin uygunsa. Kullanılabilir parçalar önce kontrol edilir.' },
      { question: 'Mağaza kapanışında söküm yapılır mı?', answer: 'PixelRing söküm ve demontajı koordine edebilir. Yüzey onarımı veya özel bertaraf ayrıca netleştirilir.' },
    ],
    finalHeadline: 'Bir sistem monte, sökülmüş veya taşınmış mı olmalı?',
    finalText: 'Lokasyon, fotoğraf ve kısa görev açıklaması gönderin. PixelRing çerçeveyi kontrol eder ve sonraki adımı koordine eder.',
  },
  'druckprodukte-branding-werbematerialien': {
    ...SERVICE_DETAIL_CONTENT.en['druckprodukte-branding-werbematerialien'],
    serviceName: 'Baskı ürünleri, branding ve reklam materyalleri',
    metaTitle: 'Baskı, Branding ve Reklam Materyalleri | PixelRing',
    metaDescription:
      'PixelRing işletmeler için baskı verileri, folyo, yazılama, banner, poster, sticker ve lokasyon branding desteği sağlar.',
    heroEyebrow: 'Branding ve materyaller',
    heroTitle: 'Baskı ürünleri, branding ve reklam materyalleri',
    heroIntro:
      'PixelRing görünür lokasyon branding’i için baskı verileri, folyolar, yazılar, posterler, bannerlar, bilgilendirme tabelaları ve sürekli materyal tedariğini destekler.',
    imageAlt: 'Bir iş lokasyonu için branding, folyo ve reklam materyalleri',
    primaryCta: 'Branding talep et',
    secondaryCta: 'Tüm hizmetler',
    tasksTitle: 'Tipik branding görevleri',
    tasksIntro: 'Bu sayfa günlük işte profesyonel bakım isteyen materyalleri ve görünür yüzeyleri kapsar.',
    tasks: [
      { title: 'Baskı verilerini hazırlama', text: 'Mevcut dosyalar üretim ve lokasyon kullanımı için kontrol edilir veya uyarlanır.' },
      { title: 'Folyo ve yazılama', text: 'Vitrin, yüzey, kapı veya bilgi noktaları marka öğeleriyle planlanır.' },
      { title: 'Poster, banner ve sticker', text: 'Tekrarlayan reklam materyalleri lokasyon ihtiyacına göre koordine edilir.' },
      { title: 'Şube ve lokasyon tedariği', text: 'Birden fazla lokasyon için materyal ihtiyacı ve servis talepleri birleştirilebilir.' },
    ],
    checksTitle: 'PixelRing neyi koordine eder',
    checksIntro: 'Branding sadece baskı değildir; veri, materyal, yüzey ve uygulama uyumu gerekir.',
    checks: ['Mevcut baskı verileri, formatlar, renkler ve okunabilirlik', 'Yüzey, kullanım yeri, dayanıklılık ve bakım ihtiyacı', 'Folyo, banner, poster ve tabela için materyal seçimi', 'Gerekirse onarım, montaj veya lokasyon servisiyle koordinasyon'],
    processTitle: 'Süreç',
    process: [
      { title: 'İhtiyaç ve veri gönderin', text: 'Dosyalar, fotoğraflar, ölçüler ve kullanım amacı gönderilir.' },
      { title: 'Uygulanabilirlik kontrolü', text: 'PixelRing veri kalitesi, materyal, yüzey ve mantıklı uygulamayı netleştirir.' },
      { title: 'Üretim ve servisi koordine etme', text: 'Onay sonrası materyal, zamanlama ve gerekiyorsa montaj koordine edilir.' },
    ],
    boundaryTitle: 'Net çerçeve',
    boundaryText: 'PixelRing branding’i kontrolsüz online matbaa değil, iş lokasyonları etrafında servis olarak anlatır.',
    boundaries: ['Tasarım, baskı verileri, folyo ve reklam materyalleri onaylı servis alanlarıdır.', 'Somut üretim kapsamı onaylanmadan kendi üretim iddia edilmez.', 'Renk, materyal ve dayanıklılık ifadeleri kullanım ve onaya bağlıdır.'],
    faqTitle: 'Branding ve materyaller SSS',
    faqs: [
      { question: 'PixelRing mevcut baskı verilerini kontrol edebilir mi?', answer: 'Evet. Dosyalar kullanılabilirlik, format ve koordinasyon ihtiyacı açısından kontrol edilebilir.' },
      { question: 'Folyo uygulaması dahil mi?', answer: 'Evet. Folyo, yazılama ve görünür marka öğeleri onaylı servis alanıdır.' },
    ],
    finalHeadline: 'Lokasyonunuz yeni materyal veya görünür branding mi gerektiriyor?',
    finalText: 'Dosya, fotoğraf veya kısa açıklama gönderin. PixelRing materyal, yüzey ve sonraki mantıklı adımı kontrol eder.',
  },
};

SERVICE_DETAIL_CONTENT.pl = {
  'lichtwerbung-led-modernisierung': {
    ...SERVICE_DETAIL_CONTENT.en['lichtwerbung-led-modernisierung'],
    serviceName: 'Modernizacja reklamy świetlnej i zewnętrznej',
    metaTitle: 'Modernizacja reklamy świetlnej i konwersja LED | PixelRing',
    metaDescription:
      'PixelRing sprawdza i modernizuje istniejącą reklamę świetlną: moduły LED, zasilacze, sterowniki, neon, kasetony, światło i konstrukcję.',
    heroEyebrow: 'Reklama świetlna i LED',
    heroTitle: 'Modernizacja reklamy świetlnej i zewnętrznej',
    heroIntro:
      'Istniejąca reklama świetlna nie zawsze musi być całkowicie wymieniana. PixelRing sprawdza moduły LED, zasilacze, transformatory, sterowniki, neon, kasetony, okablowanie, obraz światła i konstrukcję, a następnie wyjaśnia, czy sens ma naprawa, częściowa modernizacja, konwersja na LED czy wymiana.',
    imageAlt: 'Zmodernizowana reklama świetlna i zewnętrzna przy lokalu firmowym',
    primaryCta: 'Wyślij zdjęcia i otrzymaj ocenę',
    secondaryCta: 'Sprawdź naprawę przed wymianą',
    tasksTitle: 'Co można zmodernizować w istniejącej reklamie świetlnej',
    tasksIntro: 'Nacisk jest na istniejącą instalację: oświetlenie, efekt światła i konstrukcja są sprawdzane przed rekomendacją wymiany lub przebudowy.',
    tasks: [
      { title: 'Przebudowa reklamy świetlnej na LED', text: 'Starszą technikę światła często można przerobić na LED, jeśli pasują obudowa, miejsce, zasilanie i ochrona przed wilgocią.' },
      { title: 'Doposażenie kasetonu w LED', text: 'Istniejący kaseton jest sprawdzany pod kątem rozkładu światła, pozycji modułów, zasilaczy, frontów i obsługi serwisowej.' },
      { title: 'Zachowanie neonu albo sprawdzenie alternatywy LED', text: 'Przy starszym neonie lub rurach najpierw ocenia się naprawę, zachowanie, częściową modernizację albo alternatywę LED.' },
      { title: 'Poprawa nierównego oświetlenia', text: 'Ciemne strefy, punkty światła, różne barwy i widoczne punkty LED są oceniane pod kątem czytelności i efektu marki.' },
      { title: 'Kontrola modułów LED, zasilaczy i sterowników', text: 'Moduły, taśmy LED, zasilacze, transformatory, sterowniki, timery i dimmery są traktowane jako jeden system.' },
      { title: 'Dalsze użycie istniejącej konstrukcji', text: 'Obudowa, akryl, mocowania, uszczelnienia i dostęp są sprawdzane, aby nie wymieniać przedwcześnie użytecznych części.' },
    ],
    problemLinks: {
      eyebrow: 'Powiązane strony problemów',
      title: 'Gdy modernizacja zaczyna się od konkretnej usterki',
      intro: 'Czasem potrzeba nie wynika z planowanej przebudowy, lecz z migania, awarii albo słabego efektu światła. Te strony pomagają uporządkować problem.',
      links: [
        { title: 'Reklama miga', text: 'Możliwe sygnały problemu z zasilaczami, wilgocią, modułami LED lub sterowaniem.', href: '/probleme-loesungen/werbeanlage-flackert', tag: 'Miganie' },
        { title: 'LED świeci nierówno', text: 'Ciemne strefy, widoczne punkty, zła barwa albo niespokojny obraz światła.', href: '/probleme-loesungen/led-leuchtet-ungleichmaessig', tag: 'Światło' },
        { title: 'Litera nie świeci', text: 'Awaria pojedynczych liter, modułów, połączeń albo zasilaczy.', href: '/probleme-loesungen/buchstabe-leuchtet-nicht', tag: 'Litery' },
        { title: 'Reklama nie świeci', text: 'Całkowita awaria oświetlenia z możliwą kontrolą zasilania i sterowania.', href: '/probleme-loesungen/werbeanlage-leuchtet-nicht', tag: 'Awaria' },
      ],
    },
    checksTitle: 'Co PixelRing sprawdza najpierw',
    checksIntro: 'Modernizacja nie zaczyna się od wymiany za wszelką cenę. Najpierw wyjaśniamy stan i ramy techniczne.',
    checks: ['Zasilanie, zasilacze, transformatory, bezpieczniki i okablowanie', 'Moduły LED, taśmy LED, rury neonowe, kolor i jasność światła', 'Sterowniki, czujniki, timery, dimmery i zachowanie przełączania', 'Obudowa, uszczelnienia, wilgoć, korozja i dostęp', 'Obraz światła, cienie, punkty, czytelność i efekt marki', 'Czy sens ma naprawa, częściowa modernizacja, konwersja LED czy wymiana'],
    decisionGuide: {
      eyebrow: 'Pomoc w decyzji',
      title: 'Naprawa, częściowa modernizacja, konwersja LED czy wymiana?',
      intro: 'Właściwa rekomendacja nie zależy od jednego hasła. PixelRing najpierw oddziela usterkę, obraz światła, istniejącą substancję i oczekiwany efekt marki.',
      options: [
        { tag: '01', title: 'Naprawa', text: 'Pasuje, gdy występuje konkretna awaria, a obudowa, światło i konstrukcja zasadniczo mogą pozostać w użyciu.' },
        { tag: '02', title: 'Częściowa modernizacja', text: 'Ma sens, gdy instalacja może zostać, ale moduły, zasilacze, sterowanie, uszczelnienia albo światło wymagają aktualizacji.' },
        { tag: '03', title: 'Konwersja LED', text: 'Istotna przy starszych rurach, neonie albo nieefektywnej technice, jeśli miejsce, ciepło, zasilanie i oczekiwany efekt światła pasują.' },
        { tag: '04', title: 'Rozwiązanie zastępcze', text: 'Jest sprawdzane, gdy obudowa, fronty, korozja, mocowanie, dostęp albo wymagania marki przemawiają przeciw dalszemu użyciu.' },
      ],
      noteTitle: 'Brak stałej rekomendacji tylko z jednego zdjęcia',
      noteText: 'Zdjęcia i filmy pomagają w pierwszej klasyfikacji. Wiążąca rekomendacja powstaje dopiero po sprawdzeniu stanu, dostępu, komponentów elektrycznych i oczekiwanego wyniku.',
    },
    requestChecklist: {
      eyebrow: 'Checklista zapytania',
      title: 'Co pomaga w pierwszej ocenie',
      intro: 'Nie trzeba znać pojęć technicznych. Zdjęcia, krótkie filmy i prosta informacja o lokalizacji często wystarczą na pierwszy krok.',
      items: ['Zdjęcie całej instalacji', 'Zbliżenie problematycznego miejsca', 'Krótki film przy miganiu', 'Adres, miasto albo opis lokalizacji', 'Wysokość montażu i dostęp', 'Wiek instalacji, jeśli znany', 'Kiedy pojawia się problem', 'Wskazówki: deszcz, zapach, ciepło albo wybite zabezpieczenie'],
    },
    processTitle: 'Proces',
    process: [
      { title: 'Wyślij zdjęcia, film albo cel', text: 'Przesyłasz zdjęcia, dane lokalizacji i krótkie wskazówki o problemie albo oczekiwanym efekcie światła.' },
      { title: 'Pierwsza ocena techniczna', text: 'PixelRing określa możliwe komponenty i czy potrzebna jest wizyta na miejscu.' },
      { title: 'Uzgodnienie naprawy, konwersji albo wymiany', text: 'Po sprawdzeniu jasno określamy, co zachować, zmodernizować albo wymienić.' },
    ],
    boundaryTitle: 'Jasne ramy',
    boundaryText: 'PixelRing pozostaje centralnym kontaktem i koordynuje specjalistyczną realizację. To nie jest marketplace.',
    boundaries: ['Zakres usługi jest sprawdzany według stanu, dostępu, komponentów i oczekiwanego efektu światła.', 'Prace elektryczne są oceniane i koordynowane w odpowiednich ramach specjalistycznych.', 'Wiążące ceny, terminy i wnioski ekonomiczne powstają dopiero po sprawdzeniu i potwierdzeniu.'],
    faqTitle: 'FAQ reklamy świetlnej',
    faqs: [
      { question: 'Czy starą reklamę świetlną można przerobić na LED?', answer: 'Często możliwa jest częściowa modernizacja. Ważna jest obudowa, zasilanie, miejsce, ochrona przed wilgocią i oczekiwany efekt światła.' },
      { question: 'Czy konwersja LED w kasetonie ma sens?', answer: 'To zależy od stanu, czasu pracy, zasilania, obsługi serwisowej i efektu światła. PixelRing najpierw sprawdza, czy konwersja może mieć sens techniczny i ekonomiczny.' },
      { question: 'Czy kaseton można zmodernizować bez pełnej wymiany?', answer: 'Nie automatycznie. PixelRing najpierw sprawdza naprawę i sensowną częściową modernizację.' },
      { question: 'Dlaczego reklama LED miga?', answer: 'Miganie może wynikać z zasilaczy, wilgoci, modułów LED, okablowania albo sterowania. Pewna ocena wymaga zdjęć, opisu i czasem kontroli na miejscu.' },
      { question: 'Co zrobić przy nierównym oświetleniu?', answer: 'Pomaga zdjęcie całości, zbliżenie i informacja, czy nierówność jest nowa. Obudowa, pozycja modułów, barwa światła, materiał frontu i wiek techniki są oceniane razem.' },
      { question: 'Czy reklama LED jest bezobsługowa?', answer: 'Nie. Technika LED może wymagać mniej obsługi i być łatwiejsza w serwisie, ale zależy od zasilaczy, ochrony przed wilgocią, ciepła, sterowania i montażu.' },
    ],
    nextStep: {
      eyebrow: 'NEXT STEP',
      title: 'Wybierz następny krok dla istniejącej instalacji',
      intro: 'Gdy chodzi o światło, technikę i istniejącą konstrukcję, najpierw trzeba dobrze sklasyfikować zadanie: naprawa, częściowa modernizacja, konwersja LED albo wymiana.',
      requestTitle: 'Zgłoś modernizację',
      requestText: 'Wyślij zdjęcia, krótki film przy miganiu, dane lokalizacji, informacje o dostępie i oczekiwany efekt światła.',
      requestCta: 'Zgłoś modernizację LED',
      servicesTitle: 'Gdy lepiej pasuje inna usługa',
      servicesText: 'Nie każdy problem ze światłem jest od razu modernizacją. Te strony oddzielają naprawę, diagnostykę i montaż.',
      links: [
        { title: 'Naprawa reklam', text: 'Gdy najpierw trzeba usunąć konkretną usterkę.', href: '/leistungen/werbeanlagen-reparatur', tag: 'Naprawa' },
        { title: 'Audyt i diagnostyka', text: 'Gdy stan, przyczyna albo priorytet wymagają najpierw uporządkowanej kontroli.', href: '/leistungen/werbeanlagen-audit-diagnose', tag: 'Diagnostyka' },
        { title: 'Montaż i demontaż', text: 'Gdy częścią zadania jest demontaż, dostęp, przeniesienie albo nowe mocowanie.', href: '/leistungen/montage-demontage-werbeanlagen', tag: 'Montaż' },
      ],
    },
    offerCatalog: ['Doposażenie kasetonu w LED', 'Wymiana modułów LED', 'Kontrola zasilaczy, transformatorów i sterowników', 'Zachowanie neonu albo sprawdzenie alternatywy LED', 'Poprawa obrazu światła i oświetlenia', 'Kontrola istniejącej konstrukcji dla częściowej modernizacji'],
    finalHeadline: 'Czy reklama świetlna ma znów działać niezawodnie?',
    finalText: 'Wyślij zdjęcia lub krótki opis. PixelRing sprawdzi, czy kolejnym krokiem jest naprawa, częściowa modernizacja, konwersja LED czy wymiana.',
  },
  'werbeanlagen-audit-diagnose': {
    ...SERVICE_DETAIL_CONTENT.en['werbeanlagen-audit-diagnose'],
    serviceName: 'Inspekcja, audyt i diagnostyka reklam',
    metaTitle: 'Audyt i diagnostyka reklam | PixelRing',
    metaDescription:
      'PixelRing sprawdza stan, uszkodzenia, elektrykę, mocowania, widoczność i ryzyka reklam w Berlinie i Brandenburgii.',
    heroEyebrow: 'Audyt i diagnostyka',
    heroTitle: 'Inspekcja, audyt i diagnostyka reklam',
    heroIntro:
      'PixelRing zapisuje stan, przyczynę, zakres i widoczne ryzyka reklamy. Wynikiem jest jasna rekomendacja: naprawa, konserwacja albo kolejny sensowny krok.',
    imageAlt: 'Inspekcja reklamy z udokumentowanymi punktami kontroli',
    primaryCta: 'Rozpocznij diagnostykę',
    secondaryCta: 'Wszystkie usługi',
    tasksTitle: 'Kiedy audyt ma sens',
    tasksIntro: 'Audyt pomaga uporządkować widoczne usterki, ryzyka techniczne i priorytety przed zleceniem pracy.',
    tasks: [
      { title: 'Niejasne objawy', text: 'Instalacja miga, wyłącza się nieregularnie albo pokazuje kilka objawów naraz.' },
      { title: 'Kontrola lokalu lub oddziału', text: 'Kilka widocznych powierzchni wymaga oceny stanu, priorytetu i kolejnego kroku.' },
      { title: 'Ryzyka bezpieczeństwa i mocowań', text: 'Luźne elementy, stare podkonstrukcje lub szkody pogodowe wymagają klasyfikacji.' },
      { title: 'Decyzja przed budżetem', text: 'Przed naprawą lub modernizacją warto znać realny i sensowny zakres.' },
    ],
    checksTitle: 'Co jest sprawdzane',
    checksIntro: 'Kontrola pozostaje praktyczna: widoczne szkody, sygnały techniczne i warunki lokalizacji są zestawiane razem.',
    checks: ['Obudowa, akryl, folie, ramy i widoczne uszkodzenia', 'Światło, sygnały elektryczne, wilgoć i awarie', 'Punkty mocowania, podkonstrukcja i dostęp', 'Priorytet: działać teraz, planować albo obserwować'],
    processTitle: 'Proces',
    process: [
      { title: 'Opisz obiekt', text: 'Zbierane są zdjęcia, lokalizacja, wysokość, dostęp i obserwowane objawy.' },
      { title: 'Wybór oceny zdalnej lub na miejscu', text: 'PixelRing wyjaśnia, czy wystarczy ocena zdalna, czy potrzebna jest wizyta.' },
      { title: 'Otrzymaj rekomendację', text: 'Otrzymujesz kolejny sensowny krok: naprawa, konserwacja, modernizacja albo dalsza kontrola.' },
    ],
    boundaryTitle: 'Jasne ramy',
    boundaryText: 'Audyt to uporządkowana ocena, nie ukryta sprzedaż. Celem jest przejrzysta decyzja o następnym kroku.',
    boundaries: ['Sam numer zapytania nie ujawnia prywatnych danych.', 'Zdjęcia i lokalizacja są traktowane jako wrażliwe dane serwisowe.', 'Koszty i terminy są niewiążące do potwierdzenia zakresu przez PixelRing.'],
    faqTitle: 'FAQ audytu i diagnostyki',
    faqs: [
      { question: 'Czy zdjęcie wystarczy do diagnostyki?', answer: 'Często tak dla pierwszej oceny. Elektryka, wysokość, mocowanie lub bezpieczeństwo mogą wymagać wizyty.' },
      { question: 'Czy audyt nadaje się dla kilku lokalizacji?', answer: 'Tak. PixelRing może uporządkować stan i priorytety w wielu lokalizacjach.' },
    ],
    finalHeadline: 'Potrzebujesz jasności przed zleceniem prac?',
    finalText: 'Wyślij zdjęcia i krótki opis. PixelRing uporządkuje stan, ryzyko i następny krok.',
  },
  'montage-demontage-werbeanlagen': {
    ...SERVICE_DETAIL_CONTENT.en['montage-demontage-werbeanlagen'],
    serviceName: 'Montaż, demontaż i przeniesienie reklam',
    metaTitle: 'Montaż i demontaż reklam | PixelRing',
    metaDescription:
      'PixelRing koordynuje montaż, demontaż, usunięcie i przeniesienie reklam w Berlinie i Brandenburgii.',
    heroEyebrow: 'Montaż i demontaż',
    heroTitle: 'Montaż, demontaż i przeniesienie reklam',
    heroIntro:
      'PixelRing koordynuje nowe, istniejące lub przenoszone reklamy: od kontroli powierzchni po specjalistyczną realizację i kolejne kroki.',
    imageAlt: 'Montaż i demontaż reklamy przy lokalu firmowym',
    primaryCta: 'Zgłoś montaż',
    secondaryCta: 'Wszystkie usługi',
    tasksTitle: 'Typowe przypadki montażu i demontażu',
    tasksIntro: 'Ta strona obejmuje skoordynowane prace przy lokalach firmowych z PixelRing jako jedną odpowiedzialną firmą serwisową.',
    tasks: [
      { title: 'Montaż nowej reklamy', text: 'Szyldy, kasetony lub napisy są montowane po sprawdzeniu lokalizacji i uzgodnieniu.' },
      { title: 'Demontaż istniejącej reklamy', text: 'Usunięcie, wycofanie i przygotowanie powierzchni są planowane w uporządkowany sposób.' },
      { title: 'Przeniesienie reklamy', text: 'Przy zmianie lokalizacji lub remoncie PixelRing sprawdza, co można wykorzystać ponownie.' },
      { title: 'Wyjaśnienie mocowania i podłoża', text: 'Punkty mocowania, wysokość, dostęp i podłoże są uwzględniane przed realizacją.' },
    ],
    checksTitle: 'Co wyjaśniamy najpierw',
    checksIntro: 'Montaż i demontaż wymagają jasnych ram, szczególnie przy wysokości, elektryce, fasadzie i przestrzeni publicznej.',
    checks: ['Wymiary, ciężar, podłoże i punkty mocowania', 'Dostęp, wysokość, obszar pracy i termin', 'Przyłącza elektryczne i istniejące przewody', 'Czy potrzebne są zgody, administracja lub dalsza koordynacja'],
    processTitle: 'Proces',
    process: [
      { title: 'Zapisz zadanie i lokalizację', text: 'Wysyłasz zdjęcia, wymiary, adres i cel: montaż, demontaż albo przeniesienie.' },
      { title: 'Sprawdzenie ram', text: 'PixelRing ocenia dostęp, punkty techniczne i potrzebę koordynacji.' },
      { title: 'Koordynacja realizacji', text: 'Po potwierdzeniu koordynowany jest termin, zakres i specjaliści.' },
    ],
    boundaryTitle: 'Jasne ramy',
    boundaryText: 'PixelRing pozostaje centralną koordynacją. Elektryka, wysokość lub fasada są planowane w odpowiednich ramach specjalistycznych.',
    boundaries: ['Berlin i Brandenburgia jako główny obszar; inne regiony Niemiec na zapytanie.', 'Specjalny dostęp, prace wysokościowe lub zgody są oceniane osobno.', 'Demontaż nie oznacza automatycznie utylizacji ani naprawy powierzchni, jeśli nie uzgodniono inaczej.'],
    faqTitle: 'FAQ montażu i demontażu',
    faqs: [
      { question: 'Czy PixelRing może przenieść istniejący szyld?', answer: 'Tak, jeśli stan, wymiary, mocowanie i nowe podłoże pasują. Części do ponownego użycia są sprawdzane najpierw.' },
      { question: 'Czy możliwy jest demontaż przy zamknięciu lokalu?', answer: 'PixelRing może koordynować demontaż. Naprawa powierzchni lub specjalna utylizacja są wyjaśniane osobno.' },
    ],
    finalHeadline: 'Czy reklama ma być zamontowana, usunięta albo przeniesiona?',
    finalText: 'Wyślij lokalizację, zdjęcia i krótki opis zadania. PixelRing sprawdzi ramy i skoordynuje kolejny krok.',
  },
  'druckprodukte-branding-werbematerialien': {
    ...SERVICE_DETAIL_CONTENT.en['druckprodukte-branding-werbematerialien'],
    serviceName: 'Druk, branding i materiały reklamowe',
    metaTitle: 'Druk, Branding i Materiały Reklamowe | PixelRing',
    metaDescription:
      'PixelRing wspiera dane do druku, folie, oznakowanie, banery, plakaty, naklejki i branding lokalizacji dla firm.',
    heroEyebrow: 'Branding i materiały',
    heroTitle: 'Druk, branding i materiały reklamowe',
    heroIntro:
      'PixelRing wspiera widoczny branding lokalizacji: dane do druku, folie, napisy, plakaty, banery, tablice informacyjne i bieżące materiały.',
    imageAlt: 'Branding, folia i materiały reklamowe dla lokalu firmowego',
    primaryCta: 'Zgłoś branding',
    secondaryCta: 'Wszystkie usługi',
    tasksTitle: 'Typowe zadania brandingowe',
    tasksIntro: 'Ta strona obejmuje materiały i widoczne powierzchnie, które wymagają profesjonalnej obsługi w codziennej pracy.',
    tasks: [
      { title: 'Przygotowanie danych do druku', text: 'Istniejące pliki są sprawdzane, dopasowywane lub przygotowywane do produkcji i użycia w lokalizacji.' },
      { title: 'Folie i oznakowanie', text: 'Witryny, powierzchnie, drzwi lub punkty informacyjne są planowane z elementami marki.' },
      { title: 'Plakaty, banery i naklejki', text: 'Powtarzalne materiały reklamowe są koordynowane zgodnie z potrzebą lokalizacji.' },
      { title: 'Zaopatrzenie oddziałów', text: 'Dla wielu lokalizacji PixelRing może łączyć potrzeby materiałowe i zgłoszenia serwisowe.' },
    ],
    checksTitle: 'Co koordynuje PixelRing',
    checksIntro: 'Branding to nie tylko druk; potrzebne są dane, materiały, powierzchnie i wykonanie.',
    checks: ['Istniejące dane do druku, formaty, kolory i czytelność', 'Powierzchnia, miejsce użycia, trwałość i pielęgnacja', 'Dobór materiałów dla folii, banerów, plakatów i tablic', 'Koordynacja z naprawą, montażem lub serwisem lokalizacji, jeśli potrzebna'],
    processTitle: 'Proces',
    process: [
      { title: 'Wyślij potrzebę i dane', text: 'Wysyłasz pliki, zdjęcia, wymiary i cel użycia.' },
      { title: 'Sprawdzenie wykonalności', text: 'PixelRing wyjaśnia jakość danych, materiał, powierzchnię i sensowną realizację.' },
      { title: 'Koordynacja produkcji i serwisu', text: 'Po potwierdzeniu koordynowany jest materiał, termin i ewentualny montaż.' },
    ],
    boundaryTitle: 'Jasne ramy',
    boundaryText: 'PixelRing komunikuje branding jako usługę wokół lokalizacji firmowych, nie jako niekontrolowaną drukarnię online.',
    boundaries: ['Projekt, dane do druku, folie i materiały reklamowe są potwierdzonymi obszarami usług.', 'Własna produkcja nie jest deklarowana bez potwierdzonego zakresu produkcji.', 'Kolor, materiał i trwałość zależą od użycia i akceptacji.'],
    faqTitle: 'FAQ brandingu i materiałów',
    faqs: [
      { question: 'Czy PixelRing może sprawdzić gotowe dane do druku?', answer: 'Tak. PixelRing może sprawdzić pliki pod kątem użyteczności, formatu i potrzebnej koordynacji.' },
      { question: 'Czy folie są w zakresie?', answer: 'Tak. Folie, oznakowanie i widoczne elementy marki są potwierdzonym obszarem usług.' },
    ],
    finalHeadline: 'Czy lokalizacja potrzebuje nowych materiałów albo widocznego brandingu?',
    finalText: 'Wyślij pliki, zdjęcia lub krótki opis. PixelRing sprawdzi materiał, powierzchnię i kolejny sensowny krok.',
  },
};

SERVICE_DETAIL_CONTENT.ar = {
  'lichtwerbung-led-modernisierung': {
    ...SERVICE_DETAIL_CONTENT.en['lichtwerbung-led-modernisierung'],
    serviceName: 'تحديث الإعلانات المضيئة والخارجية',
    metaTitle: 'تحديث الإعلانات المضيئة وتحويلها إلى LED | PixelRing',
    metaDescription:
      'تراجع PixelRing الإعلانات المضيئة القائمة وتحدث وحدات LED ومزودات الطاقة ووحدات التحكم والنيون والصناديق المضيئة والصورة الضوئية والبنية.',
    heroEyebrow: 'خدمة الإعلانات المضيئة وLED',
    heroTitle: 'تحديث الإعلانات المضيئة والخارجية',
    heroIntro:
      'لا تحتاج الإعلانات المضيئة القائمة دائماً إلى استبدال كامل. تراجع PixelRing وحدات LED ومزودات الطاقة والمحولات ووحدات التحكم والنيون والصناديق المضيئة والأسلاك والصورة الضوئية والبنية، ثم توضح هل الأنسب هو الإصلاح أو التحديث الجزئي أو التحويل إلى LED أو الاستبدال.',
    imageAlt: 'إعلانات مضيئة وخارجية محدثة في موقع تجاري',
    primaryCta: 'إرسال صور والحصول على تقييم',
    secondaryCta: 'فحص الإصلاح قبل الاستبدال',
    tasksTitle: 'ما الذي يمكن تحديثه في الإعلان المضيء القائم',
    tasksIntro: 'التركيز على النظام القائم: تتم مراجعة الإضاءة والصورة الضوئية والبنية قبل التوصية بالاستبدال أو التحويل.',
    tasks: [
      { title: 'تحويل الإعلان المضيء إلى LED', text: 'يمكن غالباً تحويل التقنية القديمة إلى LED إذا كان الهيكل والمساحة والطاقة وحماية الرطوبة مناسبة.' },
      { title: 'إضافة LED إلى الصندوق المضيء', text: 'تتم مراجعة الصندوق القائم من حيث توزيع الضوء ومواضع الوحدات ومزودات الطاقة والواجهات وسهولة الصيانة.' },
      { title: 'الحفاظ على النيون أو فحص بديل LED', text: 'في النيون أو الأنابيب القديمة يتم أولاً تقييم الإصلاح أو الحفاظ أو التحديث الجزئي أو بديل LED.' },
      { title: 'تحسين الإضاءة غير المتساوية', text: 'تتم مراجعة المناطق الداكنة والنقاط الساطعة واختلاف لون الضوء ونقاط LED المرئية من حيث القراءة وتأثير العلامة.' },
      { title: 'فحص وحدات LED والطاقة والتحكم', text: 'تتم مراجعة الوحدات وشرائط LED ومزودات الطاقة والمحولات ووحدات التحكم والمؤقتات والمخفتات كنظام واحد.' },
      { title: 'استخدام البنية القائمة عند الإمكان', text: 'تتم مراجعة الهيكل وواجهات الأكريليك والتثبيت والعوازل والوصول حتى لا يتم استبدال الأجزاء الصالحة مبكراً.' },
    ],
    problemLinks: {
      eyebrow: 'صفحات مشاكل مناسبة',
      title: 'عندما يبدأ التحديث من عطل محدد',
      intro: 'أحياناً لا يبدأ الطلب كتحديث مخطط، بل بسبب وميض أو توقف أو صورة ضوئية سيئة. تساعد هذه الصفحات في تصنيف الحالة.',
      links: [
        { title: 'الإعلان يومض', text: 'مؤشرات محتملة على مزودات الطاقة أو الرطوبة أو وحدات LED أو التحكم.', href: '/probleme-loesungen/werbeanlage-flackert', tag: 'وميض' },
        { title: 'LED يضيء بشكل غير متساو', text: 'مناطق داكنة أو نقاط مرئية أو لون ضوء خاطئ أو توزيع غير منتظم.', href: '/probleme-loesungen/led-leuchtet-ungleichmaessig', tag: 'ضوء' },
        { title: 'حرف لا يضيء', text: 'تعطل حروف أو وحدات أو وصلات أو مزودات طاقة منفردة.', href: '/probleme-loesungen/buchstabe-leuchtet-nicht', tag: 'حروف' },
        { title: 'الإعلان لا يضيء', text: 'توقف كامل للإضاءة مع حاجة محتملة لفحص الطاقة والتحكم.', href: '/probleme-loesungen/werbeanlage-leuchtet-nicht', tag: 'توقف' },
      ],
    },
    checksTitle: 'ما الذي تفحصه PixelRing أولاً',
    checksIntro: 'لا يبدأ التحديث بالاستبدال بأي ثمن. نوضح أولاً الحالة والأعراض والحدود التقنية.',
    checks: ['الطاقة ومزودات الطاقة والمحولات والقواطع والأسلاك', 'وحدات LED وشرائط LED وأنابيب النيون ولون الضوء والسطوع', 'وحدات التحكم والحساسات والمؤقتات والمخفتات وسلوك التشغيل', 'الهيكل والعوازل والرطوبة والتآكل والوصول', 'الصورة الضوئية والظلال والنقاط والقراءة وتأثير العلامة', 'هل الأنسب هو الإصلاح أو التحديث الجزئي أو التحويل إلى LED أو الاستبدال'],
    decisionGuide: {
      eyebrow: 'مساعدة في القرار',
      title: 'إصلاح أم تحديث جزئي أم تحويل إلى LED أم استبدال؟',
      intro: 'لا تعتمد التوصية الصحيحة على كلمة واحدة. تفصل PixelRing أولاً بين العطل والصورة الضوئية والبنية القائمة وتأثير العلامة المطلوب.',
      options: [
        { tag: '01', title: 'إصلاح', text: 'يناسب الحالة عندما يوجد عطل محدد بينما يمكن للهيكل والصورة الضوئية والبنية أن تبقى قيد الاستخدام عموماً.' },
        { tag: '02', title: 'تحديث جزئي', text: 'يكون منطقياً عندما يمكن الحفاظ على النظام، لكن الوحدات أو مزودات الطاقة أو التحكم أو العوازل أو الصورة الضوئية تحتاج إلى تحديث.' },
        { tag: '03', title: 'تحويل إلى LED', text: 'مهم عند الأنابيب أو النيون أو التقنية غير الفعالة إذا كانت المساحة والحرارة والطاقة والنتيجة الضوئية المطلوبة مناسبة.' },
        { tag: '04', title: 'حل بديل', text: 'تتم مراجعته عندما يشير الهيكل أو الواجهات أو التآكل أو التثبيت أو الوصول أو متطلبات العلامة إلى عدم مناسبة الاستخدام المستمر.' },
      ],
      noteTitle: 'لا توجد توصية ثابتة من صورة واحدة فقط',
      noteText: 'تساعد الصور والفيديوهات في التصنيف الأول. تظهر التوصية الملزمة فقط بعد مراجعة الحالة والوصول والمكونات الكهربائية والنتيجة المطلوبة.',
    },
    requestChecklist: {
      eyebrow: 'قائمة معلومات الطلب',
      title: 'ما الذي يساعد في التقييم الأول',
      intro: 'لا تحتاج إلى معرفة مصطلحات تقنية. غالباً تكفي الصور والفيديوهات القصيرة ومعلومات الموقع البسيطة للخطوة الأولى.',
      items: ['صورة عامة للنظام', 'صورة قريبة للمكان المتأثر', 'فيديو قصير عند الوميض', 'العنوان أو المدينة أو وصف الموقع', 'ارتفاع التركيب وإمكانية الوصول', 'عمر النظام إذا كان معروفاً', 'وقت ظهور المشكلة', 'ملاحظات مثل المطر أو الرائحة أو الحرارة أو القاطع المفصول'],
    },
    processTitle: 'العملية',
    process: [
      { title: 'إرسال صور أو فيديو أو هدف', text: 'ترسل الصور ومعلومات الموقع وملاحظات قصيرة عن المشكلة أو الصورة الضوئية المطلوبة.' },
      { title: 'تقييم تقني أولي', text: 'تصنف PixelRing المكونات المحتملة وتحدد ما إذا كان الموعد في الموقع مناسباً.' },
      { title: 'توضيح الإصلاح أو التحويل أو الاستبدال', text: 'بعد المراجعة يتم توضيح ما ينبغي الحفاظ عليه أو تحديثه أو استبداله بشفافية.' },
    ],
    boundaryTitle: 'إطار واضح',
    boundaryText: 'تبقى PixelRing جهة الاتصال المركزية وتنسق التنفيذ المتخصص. هذا ليس سوقاً ولا عقد تقنية غير محدود.',
    boundaries: ['يتم فحص نطاق الخدمة حسب الحالة والوصول والمكونات والصورة الضوئية المطلوبة.', 'تتم مراجعة الأعمال الكهربائية وتنسيقها ضمن إطار متخصص مناسب.', 'الأسعار والمواعيد والتقييمات الاقتصادية الملزمة تظهر فقط بعد المراجعة والتأكيد.'],
    faqTitle: 'أسئلة حول الإعلانات المضيئة',
    faqs: [
      { question: 'هل يمكن تحويل إعلان مضيء قديم إلى LED؟', answer: 'غالباً يكون التحديث الجزئي ممكناً. يعتمد ذلك على الهيكل والطاقة والمساحة وحماية الرطوبة ونتيجة الضوء المطلوبة.' },
      { question: 'هل تحويل الصندوق المضيء إلى LED مفيد؟', answer: 'يعتمد ذلك على الحالة ومدة التشغيل والطاقة وسهولة الصيانة والصورة الضوئية. تفحص PixelRing أولاً هل يمكن أن يكون التحويل منطقياً تقنياً واقتصادياً.' },
      { question: 'هل يمكن تحديث الصندوق المضيء دون استبداله بالكامل؟', answer: 'ليس تلقائياً. تفحص PixelRing أولاً الإصلاح والتحديث الجزئي المنطقي قبل توصية الاستبدال.' },
      { question: 'لماذا يومض إعلان LED؟', answer: 'قد يأتي الوميض من مزودات الطاقة أو الرطوبة أو وحدات LED أو الأسلاك أو التحكم. يحتاج التقييم الموثوق إلى صور ووصف وأحياناً فحص في الموقع.' },
      { question: 'ماذا أفعل عند الإضاءة غير المتساوية؟', answer: 'تفيد صورة عامة وصورة قريبة ومعلومة هل المشكلة جديدة. تتم مراجعة الهيكل وموضع الوحدات ولون الضوء ومادة الواجهة وعمر التقنية معاً.' },
      { question: 'هل إعلان LED لا يحتاج إلى صيانة؟', answer: 'لا. يمكن أن تكون تقنية LED أقل حاجة للصيانة وأسهل في الخدمة، لكنها تبقى مرتبطة بمزودات الطاقة وحماية الرطوبة والحرارة والتحكم وطريقة التركيب.' },
    ],
    nextStep: {
      eyebrow: 'NEXT STEP',
      title: 'اختيار الخطوة التالية للنظام القائم',
      intro: 'عند التعامل مع الضوء والتقنية والبنية القائمة، يجب أولاً تصنيف المهمة: إصلاح أو تحديث جزئي أو تحويل إلى LED أو استبدال.',
      requestTitle: 'طلب التحديث',
      requestText: 'أرسل صوراً وفيديو قصيراً عند الوميض ومعلومات الموقع والوصول والهدف المطلوب للصورة الضوئية أو تأثير العلامة.',
      requestCta: 'طلب تحديث LED',
      servicesTitle: 'إذا كانت خدمة أخرى أنسب',
      servicesText: 'ليس كل عطل ضوئي تحديثاً مباشراً. هذه الصفحات تفصل بين الإصلاح والتشخيص والتركيب.',
      links: [
        { title: 'إصلاح اللوحات الإعلانية', text: 'عندما يجب إصلاح عطل محدد أولاً.', href: '/leistungen/werbeanlagen-reparatur', tag: 'إصلاح' },
        { title: 'التدقيق والتشخيص', text: 'عندما يجب فحص الحالة أو السبب أو الأولوية بشكل منظم أولاً.', href: '/leistungen/werbeanlagen-audit-diagnose', tag: 'تشخيص' },
        { title: 'التركيب والفك', text: 'عندما يكون الفك أو الوصول أو النقل أو التثبيت الجديد جزءاً من المهمة.', href: '/leistungen/montage-demontage-werbeanlagen', tag: 'تركيب' },
      ],
    },
    offerCatalog: ['إضافة LED إلى الصندوق المضيء', 'استبدال وحدات LED', 'فحص مزودات الطاقة والمحولات ووحدات التحكم', 'الحفاظ على النيون أو فحص بديل LED', 'تحسين الصورة الضوئية وتوزيع الإضاءة', 'فحص البنية القائمة للتحديث الجزئي'],
    finalHeadline: 'هل يجب أن تعمل إعلاناتك المضيئة بشكل موثوق مرة أخرى؟',
    finalText: 'أرسل صوراً أو وصفاً قصيراً. تتحقق PixelRing مما إذا كان الإصلاح أو التحديث الجزئي أو التحويل إلى LED أو الاستبدال هو الخطوة المنطقية التالية.',
  },
  'werbeanlagen-audit-diagnose': {
    ...SERVICE_DETAIL_CONTENT.en['werbeanlagen-audit-diagnose'],
    serviceName: 'فحص وتدقيق وتشخيص اللوحات الإعلانية',
    metaTitle: 'تدقيق وتشخيص اللوحات الإعلانية | PixelRing',
    metaDescription:
      'تراجع PixelRing الحالة والأضرار والمؤشرات الكهربائية والتثبيت والوضوح والمخاطر للوحات الإعلانية في برلين وبراندنبورغ.',
    heroEyebrow: 'تدقيق وتشخيص',
    heroTitle: 'فحص وتدقيق وتشخيص اللوحات الإعلانية',
    heroIntro:
      'تسجل PixelRing الحالة والسبب والنطاق والمخاطر المرئية. والنتيجة توصية واضحة للإصلاح أو الصيانة أو الخطوة المنطقية التالية.',
    imageAlt: 'فحص لوحة إعلانية مع نقاط تحقق موثقة',
    primaryCta: 'بدء التشخيص',
    secondaryCta: 'كل الخدمات',
    tasksTitle: 'متى يكون التدقيق مفيداً',
    tasksIntro: 'يساعد التدقيق في ترتيب العيوب المرئية والمخاطر التقنية والأولويات قبل طلب العمل.',
    tasks: [
      { title: 'أعراض غير واضحة', text: 'تومض اللوحة أو تتوقف بشكل غير منتظم أو تظهر عدة أعراض في الوقت نفسه.' },
      { title: 'فحص موقع أو فرع', text: 'تحتاج عدة أسطح إعلانية مرئية إلى تقييم الحالة والأولوية والخطوة التالية.' },
      { title: 'مخاطر السلامة والتثبيت', text: 'تحتاج الأجزاء المرتخية أو الهياكل القديمة أو أضرار الطقس إلى تصنيف.' },
      { title: 'قرار قبل الميزانية', text: 'قبل الإصلاح أو التحديث يجب أن يكون النطاق الواقعي والمنطقي واضحاً.' },
    ],
    checksTitle: 'ما الذي يتم فحصه',
    checksIntro: 'يبقى الفحص عملياً: يتم جمع الأضرار المرئية والمؤشرات التقنية وظروف الموقع.',
    checks: ['الهيكل والأكريليك والأفلام والإطارات والأضرار المرئية', 'الإضاءة والمؤشرات الكهربائية والرطوبة والأعطال', 'نقاط التثبيت والهيكل الفرعي والوصول', 'الأولوية: التصرف الآن أو التخطيط أو المراقبة'],
    processTitle: 'العملية',
    process: [
      { title: 'وصف الأصل الإعلاني', text: 'يتم جمع الصور والموقع والارتفاع والوصول والأعراض الملحوظة.' },
      { title: 'اختيار فحص عن بعد أو في الموقع', text: 'توضح PixelRing ما إذا كان التقييم عن بعد كافياً أو أن الموعد في الموقع مناسب.' },
      { title: 'استلام التوصية', text: 'تحصل على الخطوة المنطقية التالية: إصلاح أو صيانة أو تحديث أو مراجعة إضافية.' },
    ],
    boundaryTitle: 'إطار واضح',
    boundaryText: 'التدقيق تقييم منظم وليس مسار بيع مخفياً. الهدف قرار واضح للخطوة التالية.',
    boundaries: ['رقم الطلب وحده لا يكشف بيانات خاصة.', 'تتم معاملة الصور ومعلومات الموقع كبيانات خدمة حساسة.', 'تبقى التكاليف والمواعيد غير ملزمة حتى تؤكد PixelRing النطاق.'],
    faqTitle: 'أسئلة حول التدقيق والتشخيص',
    faqs: [
      { question: 'هل تكفي صورة للتشخيص؟', answer: 'غالباً تكفي للتقييم الأولي. قد تتطلب الكهرباء أو الارتفاع أو التثبيت أو السلامة موعداً في الموقع.' },
      { question: 'هل يناسب التدقيق عدة مواقع؟', answer: 'نعم. يمكن لـ PixelRing تنظيم الحالة والأولويات عبر عدة مواقع.' },
    ],
    finalHeadline: 'هل تحتاج إلى وضوح قبل طلب العمل؟',
    finalText: 'أرسل صوراً ووصفاً قصيراً. ترتب PixelRing الحالة والمخاطر والخطوة التالية.',
  },
  'montage-demontage-werbeanlagen': {
    ...SERVICE_DETAIL_CONTENT.en['montage-demontage-werbeanlagen'],
    serviceName: 'تركيب وفك ونقل اللوحات الإعلانية',
    metaTitle: 'تركيب وفك اللوحات الإعلانية | PixelRing',
    metaDescription:
      'تنسق PixelRing تركيب وفك وإزالة ونقل اللوحات الإعلانية في برلين وبراندنبورغ.',
    heroEyebrow: 'تركيب وإزالة',
    heroTitle: 'تركيب وفك ونقل اللوحات الإعلانية',
    heroIntro:
      'تنسق PixelRing اللوحات الجديدة أو القائمة أو المنقولة: من فحص السطح إلى تنسيق المتخصصين والخطوات التالية.',
    imageAlt: 'تركيب وفك لوحة إعلانية في موقع تجاري',
    primaryCta: 'طلب تركيب',
    secondaryCta: 'كل الخدمات',
    tasksTitle: 'حالات شائعة للتركيب والفك',
    tasksIntro: 'تغطي هذه الصفحة العمل المنسق في المواقع التجارية مع بقاء PixelRing شركة خدمة واحدة مسؤولة.',
    tasks: [
      { title: 'تركيب أصل جديد', text: 'يتم تركيب اللوحات أو الصناديق المضيئة أو الكتابات بعد فحص الموقع والتنسيق.' },
      { title: 'فك أصل قائم', text: 'يتم تخطيط الإزالة وإرجاع الحالة وتحضير السطح بشكل منظم.' },
      { title: 'نقل لوحة إعلانية', text: 'عند نقل الموقع أو التجديد، تفحص PixelRing ما يمكن استخدامه مرة أخرى.' },
      { title: 'توضيح التثبيت والسطح', text: 'تؤخذ نقاط التثبيت والارتفاع والوصول والسطح في الاعتبار قبل التنفيذ.' },
    ],
    checksTitle: 'ما الذي يتم توضيحه أولاً',
    checksIntro: 'يتطلب التركيب والفك إطاراً واضحاً، خصوصاً حول الارتفاع والكهرباء والواجهة والمساحة العامة.',
    checks: ['الأبعاد والوزن والسطح ونقاط التثبيت', 'الوصول والارتفاع ومنطقة العمل ونافذة الموعد', 'التوصيلات الكهربائية والخطوط القائمة', 'ما إذا كانت التصاريح أو إدارة العقار أو تنسيق إضافي مطلوبة'],
    processTitle: 'العملية',
    process: [
      { title: 'تسجيل المهمة والموقع', text: 'ترسل الصور والأبعاد والعنوان والهدف: تركيب أو فك أو نقل.' },
      { title: 'فحص الإطار', text: 'تراجع PixelRing الوصول والنقاط التقنية واحتياج التنسيق.' },
      { title: 'تنسيق التنفيذ', text: 'بعد التأكيد يتم تنسيق الموعد والنطاق والمتخصصين.' },
    ],
    boundaryTitle: 'إطار واضح',
    boundaryText: 'تبقى PixelRing نقطة التنسيق المركزية. يتم تخطيط الكهرباء أو الارتفاع أو الواجهة فقط ضمن إطار متخصص مناسب.',
    boundaries: ['برلين وبراندنبورغ هما المنطقة الأساسية؛ مناطق ألمانية أخرى عند الطلب.', 'يتم تقييم الوصول الخاص أو أعمال الارتفاع أو التصاريح بشكل منفصل.', 'الفك لا يعني تلقائياً التخلص أو إصلاح السطح ما لم يتم الاتفاق على ذلك.'],
    faqTitle: 'أسئلة حول التركيب والفك',
    faqs: [
      { question: 'هل يمكن لـ PixelRing نقل لوحة قائمة إلى موقع جديد؟', answer: 'نعم، إذا كانت الحالة والأبعاد والتثبيت والسطح الجديد مناسبة. يتم فحص الأجزاء القابلة لإعادة الاستخدام أولاً.' },
      { question: 'هل يمكن الفك عند إغلاق محل؟', answer: 'يمكن لـ PixelRing تنسيق الإزالة والفك. يتم توضيح إصلاح السطح أو التخلص الخاص بشكل منفصل.' },
    ],
    finalHeadline: 'هل يجب تركيب أو إزالة أو نقل لوحة؟',
    finalText: 'أرسل الموقع والصور ووصفاً قصيراً للمهمة. تفحص PixelRing الإطار وتنسق الخطوة التالية.',
  },
  'druckprodukte-branding-werbematerialien': {
    ...SERVICE_DETAIL_CONTENT.en['druckprodukte-branding-werbematerialien'],
    serviceName: 'منتجات الطباعة والهوية والمواد الإعلانية',
    metaTitle: 'الطباعة والهوية والمواد الإعلانية | PixelRing',
    metaDescription:
      'تدعم PixelRing ملفات الطباعة والأفلام والكتابات واللافتات والملصقات والستيكر وهوية المواقع للشركات.',
    heroEyebrow: 'الهوية والمواد',
    heroTitle: 'منتجات الطباعة والهوية والمواد الإعلانية',
    heroIntro:
      'تدعم PixelRing الهوية المرئية للمواقع: ملفات الطباعة والأفلام والكتابات والملصقات واللافتات ولوحات المعلومات وتوريد المواد المستمر.',
    imageAlt: 'هوية بصرية وأفلام ومواد إعلانية لموقع تجاري',
    primaryCta: 'طلب هوية بصرية',
    secondaryCta: 'كل الخدمات',
    tasksTitle: 'مهام شائعة للهوية البصرية',
    tasksIntro: 'تغطي هذه الصفحة المواد والأسطح المرئية التي تحتاج إلى رعاية احترافية أثناء العمل اليومي.',
    tasks: [
      { title: 'تحضير ملفات الطباعة', text: 'يتم فحص الملفات القائمة أو تعديلها أو تحضيرها للإنتاج والاستخدام في الموقع.' },
      { title: 'الأفلام والكتابات', text: 'يتم تخطيط النوافذ والأسطح والأبواب ونقاط المعلومات بعناصر علامة مرئية.' },
      { title: 'الملصقات واللافتات والستيكر', text: 'يتم تنسيق المواد الإعلانية المتكررة حسب حاجة الموقع.' },
      { title: 'توريد الفروع والمواقع', text: 'لعدة مواقع، يمكن لـ PixelRing تجميع احتياجات المواد وطلبات الخدمة.' },
    ],
    checksTitle: 'ما الذي تنسقه PixelRing',
    checksIntro: 'الهوية ليست طباعة فقط؛ بل تحتاج إلى بيانات ومواد وأسطح وتنفيذ مناسب.',
    checks: ['ملفات الطباعة القائمة والتنسيقات والألوان والقراءة', 'السطح ومكان الاستخدام والمتانة واحتياجات العناية', 'اختيار المواد للأفلام واللافتات والملصقات واللوحات', 'التنسيق مع الإصلاح أو التركيب أو خدمة الموقع عند الحاجة'],
    processTitle: 'العملية',
    process: [
      { title: 'إرسال الحاجة والملفات', text: 'ترسل الملفات والصور والأبعاد والغرض من الاستخدام.' },
      { title: 'فحص القابلية للتنفيذ', text: 'توضح PixelRing جودة البيانات والمواد والسطح والتنفيذ المنطقي.' },
      { title: 'تنسيق الإنتاج والخدمة', text: 'بعد التأكيد يتم تنسيق المواد والموعد والتركيب عند الحاجة.' },
    ],
    boundaryTitle: 'إطار واضح',
    boundaryText: 'تقدم PixelRing الهوية كخدمة حول المواقع التجارية، وليس كمطبعة إلكترونية غير منضبطة.',
    boundaries: ['التصميم وملفات الطباعة والأفلام والمواد الإعلانية مجالات خدمة مؤكدة.', 'لا يتم الادعاء بالإنتاج الداخلي ما لم يتم تأكيد نطاق الإنتاج المحدد.', 'تعتمد بيانات اللون والمادة والمتانة على الاستخدام والموافقة.'],
    faqTitle: 'أسئلة حول الهوية والمواد',
    faqs: [
      { question: 'هل يمكن لـ PixelRing فحص ملفات الطباعة القائمة؟', answer: 'نعم. يمكن مراجعة الملفات من حيث القابلية للاستخدام والتنسيق واحتياج التنسيق.' },
      { question: 'هل الأفلام ضمن الخدمة؟', answer: 'نعم. الأفلام والكتابات وعناصر العلامة المرئية جزء من مجال الخدمة المؤكد.' },
    ],
    finalHeadline: 'هل يحتاج موقعك إلى مواد جديدة أو هوية مرئية؟',
    finalText: 'أرسل ملفات أو صوراً أو وصفاً قصيراً. تفحص PixelRing المادة والسطح والخطوة المنطقية التالية.',
  },
};

const ORGANIZATION_SCHEMA_ID = `${SITE_BASE_URL}/#organization`;

function isLocale(locale: string): locale is Locale {
  return SITE_LOCALES.includes(locale as Locale);
}

function isServiceDetailSlug(slug: string): slug is ServiceDetailSlug {
  return SERVICE_DETAIL_SLUGS.includes(slug as ServiceDetailSlug);
}

function getLocale(locale: string): Locale {
  return isLocale(locale) ? locale : 'de';
}

function getContent(locale: string, slug: string): ServiceDetailContent | null {
  const safeLocale = getLocale(locale);

  if (!isServiceDetailSlug(slug)) {
    return null;
  }

  return SERVICE_DETAIL_CONTENT[safeLocale][slug] ?? SERVICE_DETAIL_CONTENT.de[slug];
}

function withoutJsonLdContext(item: JsonLdObject): JsonLdObject {
  const nextItem = { ...item };
  delete nextItem['@context'];

  return nextItem;
}

function buildServiceDetailJsonLd(locale: Locale, slug: ServiceDetailSlug, content: ServiceDetailContent) {
  const path = `/leistungen/${slug}`;
  const canonicalUrl = buildLocaleUrl(locale, path);
  const breadcrumbLabels = BREADCRUMB_LABELS_BY_LOCALE[locale];
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
      name: content.serviceName,
      serviceType: content.serviceName,
      description: content.metaDescription,
      provider,
      mainEntityOfPage: canonicalUrl,
      inLanguage: LANGUAGE_TAG_BY_LOCALE[locale],
      ...(content.omitRegionalAreaServed
        ? {}
        : {
            areaServed: [
              { '@type': 'AdministrativeArea', name: 'Berlin' },
              { '@type': 'AdministrativeArea', name: 'Brandenburg' },
            ],
          }),
      ...(content.offerCatalog
        ? {
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: `${content.serviceName} - Leistungen`,
              itemListElement: content.offerCatalog.map((name, index) => ({
                '@type': 'Offer',
                position: index + 1,
                itemOffered: {
                  '@type': 'Service',
                  name,
                },
              })),
            },
          }
        : {}),
      url: canonicalUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'ProfessionalService'],
      '@id': ORGANIZATION_SCHEMA_ID,
      name: 'PixelRing',
      legalName: SITE_CONFIG.company.legalName,
      url: SITE_BASE_URL,
      logo: buildSiteUrl('/icon.png'),
      image: buildSiteUrl(content.image),
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
      ...(content.omitRegionalAreaServed
        ? {}
        : {
            areaServed: [
              { '@type': 'AdministrativeArea', name: 'Berlin' },
              { '@type': 'AdministrativeArea', name: 'Brandenburg' },
            ],
          }),
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: SITE_CONFIG.company.email,
        availableLanguage: ['de', 'en', 'ru', 'tr', 'pl', 'ar'],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: breadcrumbLabels.home,
          item: buildLocaleUrl(locale),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: breadcrumbLabels.services,
          item: buildLocaleUrl(locale, '/leistungen'),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: content.serviceName,
          item: canonicalUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': jsonLd.map(withoutJsonLdContext),
  };
}

function getRelatedPages(locale: Locale, activeSlug: ServiceDetailSlug) {
  return SERVICE_DETAIL_SLUGS.filter((slug) => slug !== activeSlug).map((slug) => ({
    slug,
    title: SERVICE_DETAIL_CONTENT[locale][slug].serviceName,
    href: `/leistungen/${slug}`,
  }));
}

function getServiceBreadcrumbs(locale: Locale, currentLabel: string) {
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
      label: currentLabel,
    },
  ];
}

export function generateStaticParams() {
  return SITE_LOCALES.flatMap((locale) =>
    SERVICE_DETAIL_SLUGS.map((slug) => ({
      locale,
      slug,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const safeLocale = getLocale(locale);
  const content = getContent(safeLocale, slug);

  if (!content || !isServiceDetailSlug(slug)) {
    return {};
  }

  const path = `/leistungen/${slug}`;
  const canonicalUrl = buildLocaleUrl(safeLocale, path);
  const alternateLocales = (Object.entries(OPEN_GRAPH_LOCALE_BY_LOCALE) as Array<[Locale, string]>)
    .filter(([entryLocale]) => entryLocale !== safeLocale)
    .map(([, openGraphLocale]) => openGraphLocale);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(path),
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
          url: buildSiteUrl(content.image),
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
      images: [buildSiteUrl(content.image)],
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const safeLocale = getLocale(locale);

  if (!isServiceDetailSlug(slug)) {
    notFound();
  }

  const content = getContent(safeLocale, slug);

  if (!content) {
    notFound();
  }

  const globalCms = await getGlobalPageCmsContent(safeLocale);
  const relatedLabels = RELATED_LABELS_BY_LOCALE[safeLocale];
  const relatedPages = getRelatedPages(safeLocale, slug);
  const jsonLd = buildServiceDetailJsonLd(safeLocale, slug, content);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F1E8] text-[#15202A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header content={globalCms?.header} />
      <main>
        <LeistungenRepairHeroSlider
          title={content.heroTitle}
          subline={content.heroIntro}
          slides={[{ src: content.image, alt: content.imageAlt }]}
          breadcrumbs={getServiceBreadcrumbs(safeLocale, content.serviceName)}
        />

        {content.decisionGuide && content.requestChecklist && content.nextStep ? (
          <LeistungenLedDecisionTool
            decisionGuide={content.decisionGuide}
            requestChecklist={content.requestChecklist}
            nextStep={content.nextStep}
            serviceIntent={content.intent}
          />
        ) : null}

        {content.problemLinks ? (
          <section className="border-t border-[#E7DDD3] bg-[#FFFDF9] py-12 sm:py-16">
            <div className="pr-site-container">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
                <div className="text-start">
                  <SectionEyebrow className="mb-3">{content.problemLinks.eyebrow}</SectionEyebrow>
                  <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-[0] text-[#0E1A2B] sm:text-4xl">
                    {content.problemLinks.title}
                  </h2>
                </div>
                <p className="max-w-2xl text-start text-[16px] font-semibold leading-8 text-[#526174]">
                  {content.problemLinks.intro}
                </p>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {content.problemLinks.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex min-h-[158px] flex-col justify-between rounded-[18px] border border-[#E7DDD3] bg-[#F7F1E8] p-5 text-start transition duration-300 hover:-translate-y-0.5 hover:border-[#B8643E]/50 hover:bg-white hover:shadow-lg hover:shadow-[#0E1A2B]/[0.06]"
                  >
                    <div>
                      <div className="mb-4 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#8F4C2F]">
                        {link.tag}
                      </div>
                      <h3 className="break-words text-[18px] font-black leading-snug text-[#0E1A2B] transition-colors group-hover:text-[#8F4C2F]">
                        {link.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-[13.5px] font-semibold leading-6 text-[#526174]">
                      {link.text}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-t border-[#E7DDD3] bg-[#F7F1E8] py-14 sm:py-20">
          <div className="pr-site-container">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:items-end">
              <div className="max-w-4xl text-start">
                <SectionEyebrow className="mb-3">{relatedLabels.next}</SectionEyebrow>
                <h2 className="text-3xl font-extrabold leading-[1.1] text-[#0E1A2B] sm:text-5xl">
                  {content.tasksTitle}
                </h2>
              </div>
              <p className="max-w-2xl text-start text-[16px] font-semibold leading-8 text-[#526174]">
                {content.tasksIntro}
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.tasks.map((task) => (
                <article
                  key={task.title}
                  className="min-h-[174px] rounded-[22px] border border-[#E7DDD3] bg-[#FFFDF9] p-5 text-start shadow-sm"
                >
                  <h3 className="break-words text-[18px] font-black leading-snug text-[#0E1A2B]">
                    {task.title}
                  </h3>
                  <p className="mt-3 text-[14px] font-semibold leading-6 text-[#526174]">{task.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] py-14 sm:py-20">
          <div className="pr-site-container grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:items-start">
            <div>
              <h2 className="text-[32px] font-black leading-[1.1] tracking-[0] text-[#0E1A2B] sm:text-[44px]">
                {content.checksTitle}
              </h2>
              <p className="mt-5 text-[17px] leading-8 text-[#4A5568]">{content.checksIntro}</p>
            </div>
            <div className="grid gap-3">
              {content.checks.map((check) => (
                <div
                  key={check}
                  className="rounded-[18px] border border-[#DCE6EF] bg-white px-5 py-4 text-[15px] font-bold leading-6 text-[#0E1A2B] shadow-sm"
                >
                  {check}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F7F1E8] py-14 sm:py-20">
          <div className="pr-site-container">
            <h2 className="text-[32px] font-black leading-[1.1] tracking-[0] text-[#0E1A2B] sm:text-[44px]">
              {content.processTitle}
            </h2>
            <div className="mt-9 grid gap-5 lg:grid-cols-3">
              {content.process.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-[24px] border border-[#E0D2C4] bg-[#FFFDF9] p-6 shadow-sm"
                >
                  <span className="text-[13px] font-black uppercase text-[#B8643E]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 break-words text-[21px] font-black leading-tight text-[#0E1A2B]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-7 text-[#5C6673]">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div className="pr-site-container grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
            <div className="rounded-[26px] border border-[#D9C7BA] bg-[#F7F1E8] p-7">
              <h2 className="text-[30px] font-black leading-tight text-[#0E1A2B]">
                {content.boundaryTitle}
              </h2>
              <p className="mt-4 text-[16px] leading-8 text-[#4A5568]">{content.boundaryText}</p>
            </div>
            <div className="space-y-3">
              {content.boundaries.map((boundary) => (
                <p
                  key={boundary}
                  className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 text-[15px] font-semibold leading-7 text-[#1F2F3D]"
                >
                  {boundary}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] py-14 sm:py-20">
          <div className="pr-site-container">
            <h2 className="text-[32px] font-black leading-tight text-[#0E1A2B]">
              {content.faqTitle}
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {content.faqs.map((item) => (
                <article key={item.question} className="rounded-[22px] border border-[#E2E8F0] bg-white p-6">
                  <h3 className="break-words text-[19px] font-black leading-tight text-[#0E1A2B]">
                    {item.question}
                  </h3>
                  <p className="mt-3 text-[15px] leading-7 text-[#536170]">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {!content.nextStep ? (
          <section className="bg-white py-14 sm:py-20">
            <div className="pr-site-container">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <SectionEyebrow className="mb-5">{relatedLabels.title}</SectionEyebrow>
                  <h2 className="text-[30px] font-black leading-tight text-[#0E1A2B]">
                    {relatedLabels.title}
                  </h2>
                </div>
                <Link
                  href="/leistungen"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#C8D6E3] bg-[#F8FAFC] px-6 py-3 text-[15px] font-bold text-[#0E1A2B] transition-colors hover:border-[#7BA190] hover:bg-[#EEF6F2]"
                >
                  {relatedLabels.overview}
                </Link>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {relatedPages.map((page) => (
                  <Link
                    key={page.slug}
                    href={page.href}
                    className="rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] p-5 text-[16px] font-black leading-6 text-[#0E1A2B] transition-colors hover:border-[#7BA190] hover:bg-[#EEF6F2]"
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <LeistungenFooterCTA
          locale={safeLocale}
          finalHeadline={content.finalHeadline}
          finalText={content.finalText}
          requestTitle={content.nextStep?.requestTitle}
          requestText={content.nextStep?.requestText ?? content.finalText}
          requestCta={content.nextStep?.requestCta ?? content.primaryCta}
          serviceIntent={content.intent}
          imageSrc={content.image}
          imageAlt={content.imageAlt}
        />
      </main>
      <Footer content={globalCms?.footer} />
    </div>
  );
}
