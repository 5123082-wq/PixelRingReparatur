import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Link } from '@/i18n/routing';
import SectionEyebrow from '@/components/common/SectionEyebrow';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import LeistungenRepairHeroSlider from '@/components/leistungen/LeistungenRepairHeroSlider';
import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';
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
  tasksTitle: string;
  tasksIntro: string;
  tasks: Array<{ title: string; text: string }>;
  checksTitle: string;
  checksIntro: string;
  checks: string[];
  processTitle: string;
  process: Array<{ title: string; text: string }>;
  boundaryTitle: string;
  boundaryText: string;
  boundaries: string[];
  faqTitle: string;
  faqs: Array<{ question: string; answer: string }>;
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
      serviceName: 'Modernisierung von Lichtwerbung & LED-Systemen',
      intent: 'lichtwerbung-led',
      metaTitle: 'Lichtwerbung & LED modernisieren | PixelRing',
      metaDescription:
        'PixelRing prüft und modernisiert Lichtwerbung, LED-Module, Netzteile, Controller, Neonröhren und Leuchtkästen in Berlin & Brandenburg.',
      heroEyebrow: 'Lichtwerbung & LED-Service',
      heroTitle: 'Modernisierung von Lichtwerbung & LED-Systemen',
      heroIntro:
        'PixelRing prüft bestehende Leuchtwerbung technisch und visuell: LED-Module, Netzteile, Controller, Verkabelung, Neon und Leuchtkästen. Ziel ist eine stabile, wartbare und sichtbar bessere Lösung.',
      image: '/images/about/service_deep_2.png',
      imageAlt: 'Modernisierte Lichtwerbung und LED-Systeme an einem Geschäftsstandort',
      primaryCta: 'LED-Service anfragen',
      secondaryCta: 'Alle Leistungen',
      tasksTitle: 'Typische Aufgaben bei Lichtwerbung',
      tasksIntro:
        'Die Seite bündelt Fälle, die über eine einfache Reparatur hinausgehen und eine technische Aktualisierung sinnvoll machen können.',
      tasks: [
        {
          title: 'LED-Module und Netzteile erneuern',
          text: 'Defekte oder gealterte Komponenten werden geprüft und gezielt ersetzt, wenn die bestehende Anlage erhalten werden kann.',
        },
        {
          title: 'Controller, Sensoren und Verkabelung prüfen',
          text: 'Schaltfehler, Feuchtigkeit, lose Kabel oder falsche Steuerung werden strukturiert eingeordnet.',
        },
        {
          title: 'Neon und Leuchtkästen bewerten',
          text: 'Bestehende Systeme werden auf Reparatur, Teilmodernisierung oder sinnvolle Ersatzlösung geprüft.',
        },
        {
          title: 'Lichtbild und Markenwirkung verbessern',
          text: 'Ungleichmäßige Ausleuchtung, dunkle Zonen oder veraltete Technik werden mit Blick auf Sichtbarkeit bewertet.',
        },
      ],
      checksTitle: 'Was PixelRing vor einer Modernisierung prüft',
      checksIntro:
        'Modernisierung beginnt nicht mit Austausch um jeden Preis. Zuerst klären wir Zustand, Fehlerbild und technischen Rahmen.',
      checks: [
        'Stromversorgung, Netzteile, Controller und Verkabelung',
        'LED-Module, Neonröhren, Lichtfarbe und Ausleuchtung',
        'Gehäuse, Dichtungen, Feuchtigkeit und Zugänglichkeit',
        'Ob Reparatur, Teilmodernisierung oder Ersatz wirtschaftlich sinnvoll ist',
      ],
      processTitle: 'Ablauf',
      process: [
        {
          title: 'Foto oder Beschreibung senden',
          text: 'Sie senden Bilder, Standortdaten und kurze Hinweise zum Fehlerbild oder gewünschten Ergebnis.',
        },
        {
          title: 'Technische Ersteinschätzung',
          text: 'PixelRing ordnet ein, welche Komponenten wahrscheinlich betroffen sind und ob ein Vor-Ort-Termin sinnvoll ist.',
        },
        {
          title: 'Umsetzung abstimmen',
          text: 'Nach Prüfung werden Reparatur, Modernisierung oder Ersatzlösung transparent abgestimmt.',
        },
      ],
      boundaryTitle: 'Klarer Rahmen',
      boundaryText:
        'PixelRing bleibt ein zentraler Ansprechpartner und koordiniert die fachliche Umsetzung. Es wird keine Vermittlungsplattform und kein unbegrenzter Technikvertrag versprochen.',
      boundaries: [
        'Berlin & Brandenburg als Kerngebiet; weitere Regionen in Deutschland auf Anfrage.',
        'Elektrische Arbeiten werden fachlich geprüft und passend koordiniert.',
        'Verbindliche Preise und Termine entstehen erst nach Sichtung und Bestätigung.',
      ],
      faqTitle: 'FAQ zur Lichtwerbung',
      faqs: [
        {
          question: 'Kann eine alte Lichtwerbung auf LED umgerüstet werden?',
          answer:
            'Oft ist eine Teilmodernisierung möglich. Entscheidend sind Gehäuse, Stromversorgung, Platz, Feuchtigkeitsschutz und gewünschtes Lichtbild.',
        },
        {
          question: 'Muss die komplette Anlage ersetzt werden?',
          answer:
            'Nicht automatisch. PixelRing prüft zuerst Reparatur und sinnvolle Teilmodernisierung, bevor eine Ersatzlösung empfohlen wird.',
        },
      ],
      finalHeadline: 'Soll Ihre Lichtwerbung wieder zuverlässig wirken?',
      finalText:
        'Senden Sie Fotos oder eine kurze Beschreibung. PixelRing prüft, ob Reparatur, Modernisierung oder eine Ersatzlösung der nächste sinnvolle Schritt ist.',
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
      image: '/images/leistungen/hero-maintenance.png',
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
      serviceName: 'Illuminated signage modernization & LED systems',
      intent: 'lichtwerbung-led',
      metaTitle: 'Illuminated Signage & LED Modernization | PixelRing',
      metaDescription:
        'PixelRing reviews and modernizes illuminated signage, LED modules, power supplies, controllers, neon tubes and lightboxes in Berlin & Brandenburg.',
      heroEyebrow: 'Illuminated signage service',
      heroTitle: 'Illuminated signage modernization & LED systems',
      heroIntro:
        'PixelRing reviews existing illuminated signage technically and visually: LED modules, power supplies, controllers, wiring, neon and lightboxes. The goal is a stable, serviceable and visibly better solution.',
      image: '/images/about/service_deep_2.png',
      imageAlt: 'Modern illuminated signage and LED systems at a business location',
      primaryCta: 'Request LED service',
      secondaryCta: 'All services',
      tasksTitle: 'Typical illuminated signage tasks',
      tasksIntro:
        'This page covers cases where a technical update may make more sense than a simple one-part repair.',
      tasks: [
        { title: 'Replace LED modules and power supplies', text: 'Aged or defective parts are checked and replaced selectively when the existing installation can remain in use.' },
        { title: 'Check controllers, sensors and wiring', text: 'Switching errors, moisture, loose cables and control issues are classified in a structured way.' },
        { title: 'Review neon and lightboxes', text: 'Existing systems are assessed for repair, partial modernization or a sensible replacement.' },
        { title: 'Improve light output and brand impact', text: 'Uneven lighting, dark zones or outdated technology are reviewed with visibility in mind.' },
      ],
      checksTitle: 'What PixelRing checks first',
      checksIntro: 'Modernization does not start with replacement at any cost. We first clarify condition, symptoms and technical limits.',
      checks: ['Power supply, drivers, controllers and wiring', 'LED modules, neon tubes, light color and illumination', 'Housing, seals, moisture and access', 'Whether repair, partial modernization or replacement is economically sensible'],
      processTitle: 'Process',
      process: [
        { title: 'Send photos or a description', text: 'You send images, location details and short notes about the issue or desired result.' },
        { title: 'Technical first assessment', text: 'PixelRing classifies likely affected components and whether an on-site appointment makes sense.' },
        { title: 'Agree implementation', text: 'After review, repair, modernization or replacement is coordinated transparently.' },
      ],
      boundaryTitle: 'Clear frame',
      boundaryText: 'PixelRing remains the central contact and coordinates specialist execution. This is not a marketplace and not an unlimited technology contract.',
      boundaries: ['Berlin & Brandenburg as core area; other German regions on request.', 'Electrical work is reviewed and coordinated in the appropriate specialist frame.', 'Binding prices and dates only follow after review and confirmation.'],
      faqTitle: 'Illuminated signage FAQ',
      faqs: [
        { question: 'Can old illuminated signage be converted to LED?', answer: 'Often a partial modernization is possible. Housing, power, space, moisture protection and desired light output matter.' },
        { question: 'Does the whole installation need replacement?', answer: 'Not automatically. PixelRing checks repair and sensible partial modernization first.' },
      ],
      finalHeadline: 'Should your illuminated signage work reliably again?',
      finalText: 'Send photos or a short description. PixelRing checks whether repair, modernization or replacement is the next sensible step.',
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
      image: '/images/leistungen/hero-maintenance.png',
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
    serviceName: 'Модернизация световой рекламы и LED-систем',
    metaTitle: 'Модернизация световой рекламы и LED | PixelRing',
    metaDescription:
      'PixelRing проверяет и модернизирует световую рекламу, LED-модули, блоки питания, контроллеры, неон и световые короба в Берлине и Бранденбурге.',
    heroEyebrow: 'Световая реклама и LED-сервис',
    heroTitle: 'Модернизация световой рекламы и LED-систем',
    heroIntro:
      'PixelRing проверяет существующую световую рекламу технически и визуально: LED-модули, блоки питания, контроллеры, проводку, неон и световые короба. Цель - стабильное, обслуживаемое и заметно лучшее решение.',
    imageAlt: 'Модернизированная световая реклама и LED-системы на бизнес-локации',
    primaryCta: 'Запросить LED-сервис',
    secondaryCta: 'Все услуги',
    tasksTitle: 'Типовые задачи по световой рекламе',
    tasksIntro:
      'Эта страница покрывает случаи, когда техническое обновление может быть разумнее простой замены одной детали.',
    tasks: [
      { title: 'Заменить LED-модули и блоки питания', text: 'Изношенные или неисправные компоненты проверяются и точечно заменяются, если существующую установку можно сохранить.' },
      { title: 'Проверить контроллеры, датчики и проводку', text: 'Ошибки включения, влага, ослабленные кабели и проблемы управления структурируются по причинам.' },
      { title: 'Оценить неон и световые короба', text: 'Существующие системы проверяются на ремонт, частичную модернизацию или разумную замену.' },
      { title: 'Улучшить свет и восприятие бренда', text: 'Неравномерная подсветка, темные зоны и устаревшая техника оцениваются с точки зрения видимости.' },
    ],
    checksTitle: 'Что PixelRing проверяет сначала',
    checksIntro:
      'Модернизация не начинается с замены любой ценой. Сначала уточняются состояние, симптомы и технические ограничения.',
    checks: ['Питание, блоки питания, контроллеры и проводка', 'LED-модули, неон, цвет света и равномерность подсветки', 'Корпус, уплотнения, влага и доступность', 'Что разумнее: ремонт, частичная модернизация или замена'],
    processTitle: 'Процесс',
    process: [
      { title: 'Отправьте фото или описание', text: 'Вы отправляете изображения, данные локации и короткое описание проблемы или цели.' },
      { title: 'Первичная техническая оценка', text: 'PixelRing определяет вероятно затронутые компоненты и нужен ли выезд.' },
      { title: 'Согласование выполнения', text: 'После проверки прозрачно согласуются ремонт, модернизация или замена.' },
    ],
    boundaryTitle: 'Понятные рамки',
    boundaryText:
      'PixelRing остается центральным контактом и координирует профильное выполнение. Это не маркетплейс и не безлимитный технический договор.',
    boundaries: ['Берлин и Бранденбург - основная зона; другие регионы Германии по запросу.', 'Электротехнические работы проверяются и координируются в подходящих профессиональных рамках.', 'Обязательные цены и сроки появляются только после проверки и подтверждения.'],
    faqTitle: 'FAQ по световой рекламе',
    faqs: [
      { question: 'Можно ли перевести старую световую рекламу на LED?', answer: 'Частичная модернизация часто возможна. Важны корпус, питание, место, защита от влаги и нужный световой результат.' },
      { question: 'Нужно ли менять всю установку?', answer: 'Не автоматически. PixelRing сначала проверяет ремонт и разумную частичную модернизацию.' },
    ],
    finalHeadline: 'Нужно, чтобы световая реклама снова работала надежно?',
    finalText:
      'Отправьте фото или короткое описание. PixelRing проверит, что разумнее: ремонт, модернизация или замена.',
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
    serviceName: 'Işıklı reklam ve LED sistem modernizasyonu',
    metaTitle: 'Işıklı Reklam ve LED Modernizasyonu | PixelRing',
    metaDescription:
      'PixelRing Berlin ve Brandenburg’da ışıklı reklam, LED modüller, güç kaynakları, kontrol cihazları, neon ve ışıklı kutuları kontrol eder ve modernize eder.',
    heroEyebrow: 'Işıklı reklam ve LED servisi',
    heroTitle: 'Işıklı reklam ve LED sistem modernizasyonu',
    heroIntro:
      'PixelRing mevcut ışıklı reklamları teknik ve görsel olarak kontrol eder: LED modüller, güç kaynakları, kontrol cihazları, kablolama, neon ve ışıklı kutular.',
    imageAlt: 'Bir iş lokasyonunda modern ışıklı reklam ve LED sistemleri',
    primaryCta: 'LED servisi iste',
    secondaryCta: 'Tüm hizmetler',
    tasksTitle: 'Tipik ışıklı reklam görevleri',
    tasksIntro: 'Basit parça değişiminin ötesinde teknik güncelleme gerektiren durumlar burada toplanır.',
    tasks: [
      { title: 'LED modülleri ve güç kaynaklarını yenileme', text: 'Mevcut sistem korunabiliyorsa eski veya arızalı parçalar hedefli olarak değiştirilir.' },
      { title: 'Kontrol cihazları ve kablolama kontrolü', text: 'Nem, gevşek kablolar ve kontrol hataları yapılandırılmış şekilde değerlendirilir.' },
      { title: 'Neon ve ışıklı kutu değerlendirmesi', text: 'Sistemler onarım, kısmi modernizasyon veya mantıklı değişim açısından kontrol edilir.' },
      { title: 'Işık etkisini iyileştirme', text: 'Düzensiz aydınlatma ve eski teknoloji görünürlük açısından değerlendirilir.' },
    ],
    checksTitle: 'PixelRing önce neyi kontrol eder',
    checksIntro: 'Modernizasyon her şeyi değiştirmekle başlamaz; önce durum ve teknik çerçeve netleşir.',
    checks: ['Güç kaynağı, kontrol cihazları ve kablolama', 'LED modüller, neon, ışık rengi ve aydınlatma', 'Gövde, contalar, nem ve erişim', 'Onarım, kısmi modernizasyon veya değişimden hangisinin mantıklı olduğu'],
    processTitle: 'Süreç',
    process: [
      { title: 'Fotoğraf veya açıklama gönderin', text: 'Görseller, lokasyon bilgisi ve kısa sorun açıklaması gönderilir.' },
      { title: 'İlk teknik değerlendirme', text: 'PixelRing muhtemel etkilenen parçaları ve yerinde randevu gerekip gerekmediğini değerlendirir.' },
      { title: 'Uygulama koordinasyonu', text: 'Kontrol sonrası onarım, modernizasyon veya değişim şeffaf şekilde koordine edilir.' },
    ],
    boundaryTitle: 'Net çerçeve',
    boundaryText: 'PixelRing merkezi muhatap olarak kalır ve uzman uygulamayı koordine eder. Bu bir pazar yeri değildir.',
    boundaries: ['Ana bölge Berlin ve Brandenburg; Almanya’nın diğer bölgeleri talep üzerine.', 'Elektrik işleri uygun uzman çerçevede değerlendirilir.', 'Bağlayıcı fiyat ve tarihler ancak inceleme ve onaydan sonra oluşur.'],
    faqTitle: 'Işıklı reklam SSS',
    faqs: [
      { question: 'Eski ışıklı reklam LED’e çevrilebilir mi?', answer: 'Çoğu zaman kısmi modernizasyon mümkündür. Gövde, güç, alan, nem koruması ve ışık hedefi belirleyicidir.' },
      { question: 'Tüm sistem değişmeli mi?', answer: 'Otomatik olarak hayır. PixelRing önce onarım ve mantıklı kısmi modernizasyonu kontrol eder.' },
    ],
    finalHeadline: 'Işıklı reklamınız yeniden güvenilir çalışmalı mı?',
    finalText: 'Fotoğraf veya kısa açıklama gönderin. PixelRing onarım, modernizasyon veya değişimin mantıklı olup olmadığını kontrol eder.',
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
    serviceName: 'Modernizacja reklamy świetlnej i systemów LED',
    metaTitle: 'Modernizacja reklamy świetlnej i LED | PixelRing',
    metaDescription:
      'PixelRing sprawdza i modernizuje reklamę świetlną, moduły LED, zasilacze, sterowniki, neon i kasetony w Berlinie i Brandenburgii.',
    heroEyebrow: 'Reklama świetlna i LED',
    heroTitle: 'Modernizacja reklamy świetlnej i systemów LED',
    heroIntro:
      'PixelRing sprawdza istniejącą reklamę świetlną technicznie i wizualnie: moduły LED, zasilacze, sterowniki, okablowanie, neon i kasetony.',
    imageAlt: 'Nowoczesna reklama świetlna i systemy LED przy lokalu firmowym',
    primaryCta: 'Zgłoś serwis LED',
    secondaryCta: 'Wszystkie usługi',
    tasksTitle: 'Typowe zadania przy reklamie świetlnej',
    tasksIntro: 'Ta strona obejmuje przypadki, w których techniczna aktualizacja może mieć większy sens niż prosta wymiana części.',
    tasks: [
      { title: 'Wymiana modułów LED i zasilaczy', text: 'Zużyte lub uszkodzone komponenty są sprawdzane i wymieniane punktowo, jeśli instalacja może pozostać w użyciu.' },
      { title: 'Kontrola sterowników i okablowania', text: 'Błędy przełączania, wilgoć, luźne przewody i problemy sterowania są porządkowane według przyczyn.' },
      { title: 'Ocena neonu i kasetonów', text: 'Systemy są oceniane pod kątem naprawy, częściowej modernizacji lub sensownej wymiany.' },
      { title: 'Poprawa światła i efektu marki', text: 'Nierówne oświetlenie i stara technologia są oceniane z punktu widzenia widoczności.' },
    ],
    checksTitle: 'Co PixelRing sprawdza najpierw',
    checksIntro: 'Modernizacja nie zaczyna się od wymiany za wszelką cenę. Najpierw wyjaśniamy stan i ramy techniczne.',
    checks: ['Zasilanie, zasilacze, sterowniki i okablowanie', 'Moduły LED, neon, kolor i równomierność światła', 'Obudowa, uszczelnienia, wilgoć i dostęp', 'Czy sens ma naprawa, częściowa modernizacja czy wymiana'],
    processTitle: 'Proces',
    process: [
      { title: 'Wyślij zdjęcia lub opis', text: 'Przesyłasz zdjęcia, lokalizację i krótki opis problemu lub celu.' },
      { title: 'Pierwsza ocena techniczna', text: 'PixelRing określa możliwe komponenty i czy potrzebna jest wizyta na miejscu.' },
      { title: 'Uzgodnienie realizacji', text: 'Po sprawdzeniu koordynowana jest naprawa, modernizacja albo wymiana.' },
    ],
    boundaryTitle: 'Jasne ramy',
    boundaryText: 'PixelRing pozostaje centralnym kontaktem i koordynuje specjalistyczną realizację. To nie jest marketplace.',
    boundaries: ['Berlin i Brandenburgia jako główny obszar; inne regiony Niemiec na zapytanie.', 'Prace elektryczne są oceniane i koordynowane w odpowiednich ramach specjalistycznych.', 'Wiążące ceny i terminy powstają dopiero po sprawdzeniu i potwierdzeniu.'],
    faqTitle: 'FAQ reklamy świetlnej',
    faqs: [
      { question: 'Czy starą reklamę świetlną można przerobić na LED?', answer: 'Często możliwa jest częściowa modernizacja. Ważna jest obudowa, zasilanie, miejsce, ochrona przed wilgocią i oczekiwany efekt światła.' },
      { question: 'Czy trzeba wymienić całą instalację?', answer: 'Nie automatycznie. PixelRing najpierw sprawdza naprawę i sensowną częściową modernizację.' },
    ],
    finalHeadline: 'Czy reklama świetlna ma znów działać niezawodnie?',
    finalText: 'Wyślij zdjęcia lub krótki opis. PixelRing sprawdzi, czy kolejnym krokiem jest naprawa, modernizacja czy wymiana.',
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
    serviceName: 'تحديث الإعلانات المضيئة وأنظمة LED',
    metaTitle: 'تحديث الإعلانات المضيئة وLED | PixelRing',
    metaDescription:
      'تراجع PixelRing وتحدث الإعلانات المضيئة ووحدات LED ومزودات الطاقة ووحدات التحكم والنيون والصناديق المضيئة في برلين وبراندنبورغ.',
    heroEyebrow: 'خدمة الإعلانات المضيئة وLED',
    heroTitle: 'تحديث الإعلانات المضيئة وأنظمة LED',
    heroIntro:
      'تراجع PixelRing الإعلانات المضيئة القائمة تقنياً وبصرياً: وحدات LED ومزودات الطاقة ووحدات التحكم والأسلاك والنيون والصناديق المضيئة.',
    imageAlt: 'إعلانات مضيئة وأنظمة LED محدثة في موقع تجاري',
    primaryCta: 'طلب خدمة LED',
    secondaryCta: 'كل الخدمات',
    tasksTitle: 'مهام شائعة للإعلانات المضيئة',
    tasksIntro: 'تغطي هذه الصفحة الحالات التي قد يكون فيها التحديث التقني أنسب من إصلاح جزء واحد.',
    tasks: [
      { title: 'تبديل وحدات LED ومزودات الطاقة', text: 'يتم فحص المكونات القديمة أو المعطلة واستبدالها بشكل محدد إذا أمكن الحفاظ على النظام القائم.' },
      { title: 'فحص وحدات التحكم والأسلاك', text: 'يتم تصنيف أخطاء التشغيل والرطوبة والكابلات المرتخية ومشكلات التحكم بشكل منظم.' },
      { title: 'تقييم النيون والصناديق المضيئة', text: 'تتم مراجعة الأنظمة القائمة للإصلاح أو التحديث الجزئي أو الاستبدال المنطقي.' },
      { title: 'تحسين الضوء وتأثير العلامة', text: 'تتم مراجعة الإضاءة غير المتساوية والمناطق الداكنة والتقنية القديمة من منظور الوضوح.' },
    ],
    checksTitle: 'ما الذي تفحصه PixelRing أولاً',
    checksIntro: 'لا يبدأ التحديث بالاستبدال بأي ثمن. نوضح أولاً الحالة والأعراض والحدود التقنية.',
    checks: ['الطاقة ومزودات الطاقة ووحدات التحكم والأسلاك', 'وحدات LED والنيون ولون الضوء وتوزيعه', 'الهيكل والعوازل والرطوبة والوصول', 'ما إذا كان الإصلاح أو التحديث الجزئي أو الاستبدال منطقياً'],
    processTitle: 'العملية',
    process: [
      { title: 'إرسال صور أو وصف', text: 'ترسل الصور وبيانات الموقع وملاحظات قصيرة عن المشكلة أو النتيجة المطلوبة.' },
      { title: 'تقييم تقني أولي', text: 'تصنف PixelRing المكونات المحتملة وتحدد ما إذا كان الموعد في الموقع مناسباً.' },
      { title: 'تنسيق التنفيذ', text: 'بعد المراجعة يتم تنسيق الإصلاح أو التحديث أو الاستبدال بشفافية.' },
    ],
    boundaryTitle: 'إطار واضح',
    boundaryText: 'تبقى PixelRing جهة الاتصال المركزية وتنسق التنفيذ المتخصص. هذا ليس سوقاً ولا عقد تقنية غير محدود.',
    boundaries: ['برلين وبراندنبورغ هما المنطقة الأساسية؛ مناطق ألمانية أخرى عند الطلب.', 'تتم مراجعة الأعمال الكهربائية وتنسيقها ضمن إطار متخصص مناسب.', 'الأسعار والمواعيد الملزمة تظهر فقط بعد المراجعة والتأكيد.'],
    faqTitle: 'أسئلة حول الإعلانات المضيئة',
    faqs: [
      { question: 'هل يمكن تحويل إعلان مضيء قديم إلى LED؟', answer: 'غالباً يكون التحديث الجزئي ممكناً. يعتمد ذلك على الهيكل والطاقة والمساحة وحماية الرطوبة ونتيجة الضوء المطلوبة.' },
      { question: 'هل يجب استبدال النظام كله؟', answer: 'ليس تلقائياً. تفحص PixelRing أولاً الإصلاح والتحديث الجزئي المنطقي.' },
    ],
    finalHeadline: 'هل يجب أن تعمل إعلاناتك المضيئة بشكل موثوق مرة أخرى؟',
    finalText: 'أرسل صوراً أو وصفاً قصيراً. تتحقق PixelRing مما إذا كان الإصلاح أو التحديث أو الاستبدال هو الخطوة المنطقية التالية.',
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
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Berlin' },
        { '@type': 'AdministrativeArea', name: 'Brandenburg' },
      ],
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
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Berlin' },
        { '@type': 'AdministrativeArea', name: 'Brandenburg' },
      ],
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

        <section className="bg-white px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
            <LeistungenRequestButton
              label={content.primaryCta}
              serviceIntent={content.intent}
              className="min-w-[168px] px-7"
            />
            <Link
              href="/leistungen"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#C8D6E3] bg-[#F8FAFC] px-7 py-3 text-[15px] font-bold text-[#0E1A2B] shadow-sm transition-colors hover:border-[#7BA190] hover:bg-[#EEF6F2] hover:text-[#24594D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7BA190]"
            >
              {content.secondaryCta}
            </Link>
            <p className="min-w-[240px] flex-1 text-[14px] font-semibold leading-6 text-[#526174]">
              {content.boundaries[0]}
            </p>
          </div>
        </section>

        <section className="bg-white px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <SectionEyebrow className="mb-6">{relatedLabels.next}</SectionEyebrow>
              <h2 className="text-[34px] font-black leading-[1.08] tracking-[0] text-[#0E1A2B] sm:text-[48px]">
                {content.tasksTitle}
              </h2>
              <p className="mt-5 text-[17px] leading-8 text-[#4A5568]">{content.tasksIntro}</p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {content.tasks.map((task, index) => (
                <article
                  key={task.title}
                  className="rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-6 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B8643E] text-[14px] font-black text-white">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="mt-5 break-words text-[22px] font-black leading-tight text-[#0E1A2B]">
                    {task.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-7 text-[#536170]">{task.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:items-start">
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

        <section className="bg-[#F7F1E8] px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
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

        <section className="bg-white px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
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

        <section className="bg-[#F8FAFC] px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
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

        <section className="bg-white px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
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

        <LeistungenFooterCTA
          locale={safeLocale}
          finalHeadline={content.finalHeadline}
          finalText={content.finalText}
        />
      </main>
      <Footer content={globalCms?.footer} />
    </div>
  );
}
