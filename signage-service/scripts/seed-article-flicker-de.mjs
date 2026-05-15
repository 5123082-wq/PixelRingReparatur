/**
 * Seed: Enriched DE article for "Werbeanlage flackert" (flicking).
 * Upserts only the flicking/de CMS article with deep technical content
 * translated natively from the RU source material.
 *
 * Run: node scripts/seed-article-flicker-de.mjs
 */

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
  throw new Error('Missing DB connection string.');
}

const now = new Date();

const shortAnswer =
  'Flackern entsteht in den meisten Fällen nicht durch defekte LEDs selbst, sondern durch eine instabile Stromversorgung: ein überlastetes oder gealtertes Netzteil, ein loser Kontakt, Spannungsabfall auf der Leitung, Feuchtigkeit im Gehäuse oder ein defekter LED-Treiber. Wenn das Problem nach Regen, Wind, einem Spannungsstoß aufgetreten ist oder sich mit der Zeit verstärkt, ist eine Diagnose notwendig.';

const causes = [
  'Netzteil ist unterdimensioniert oder arbeitet ohne Leistungsreserve',
  'Netzteil gealtert – instabile Ausgangsspannung unter Last',
  'Schwankendes Eingangsspannungsniveau',
  'Spannungsabfall auf langer Zuleitung oder zu dünnem Kabel',
  'Loser Kontakt an Klemmen, Steckern oder Lötverbindungen',
  'Feuchtigkeit, Kondenswasser oder Korrosion im Gehäuse',
  'Defekter LED-Treiber, Controller, Timer oder Dimmer',
  'Beschädigung oder Alterung einzelner LED-Module',
  'Überlastung der Speiseleitung',
  'Beschädigung der LED-Kette oder der internen Verdrahtung',
];

const safeChecks = [
  'Flackert die gesamte Anlage oder nur ein einzelner Buchstabe bzw. Abschnitt?',
  'Ist das Flackern dauerhaft oder tritt es nur zeitweise auf?',
  'Pulsiert das Licht nur oder fällt es kurzzeitig komplett aus?',
  'Ist das Problem nach Regen, Wind, Schnee, Fassadenreinigung oder einem Spannungsstoß aufgetreten?',
  'Verstärkt sich das Flackern abends, nachts oder bei hoher Gebäudelast?',
  'Laufen andere Geräte auf demselben Stromkreis stabil?',
  'Gibt es Überhitzungsgeruch, Knistern, Funken, Feuchtigkeitsspuren oder hat der Sicherungsautomat ausgelöst?',
  'Können Sie ein kurzes Video aufnehmen – einmal die gesamte Anlage, einmal den betroffenen Bereich aus der Nähe?',
];

const urgentWarnings = [
  'Bei Funkenbildung, Brandgeruch, Knistern, starker Erhitzung oder Totalausfall – Anlage sofort stromlos schalten.',
  'Offene Bauteile oder Anschlüsse nicht berühren, besonders bei Feuchtigkeitsspuren.',
  'Wenn die Anlage nach Regen flackert, ausfällt oder den Automaten auslöst – Betrieb bis zur Diagnose einstellen.',
  'Wenn sich das Flackern schnell verstärkt, kann die Beleuchtung vollständig ausfallen oder LED-Bauteile beschädigt werden.',
];

const serviceProcess = [
  'Wir bitten um ein Foto der Anlage und ein kurzes Video des Flackerns',
  'Wir klären, ob die gesamte Konstruktion oder nur ein Abschnitt betroffen ist',
  'Wir prüfen, ob die Ursache beim Netzteil, den LED-Modulen, dem Controller, den Kontakten oder bei Feuchtigkeit liegen kann',
  'Wir bewerten Anzeichen einer Netzteil-Überlastung und instabilen Betriebs unter Last',
  'Wir prüfen möglichen Spannungsabfall auf langen Leitungen',
  'Wir bewerten den Zustand von Verbindungen, Kabeln und Feuchtigkeitsspuren',
  'Bei Bedarf organisieren wir einen Vor-Ort-Termin zur Diagnose',
  'Nach der Reparatur dokumentieren wir, was ausgetauscht oder wiederhergestellt wurde',
];

const workScopeFactors = [
  'Größe und Leistung der Werbeanlage',
  'Anzahl der Buchstaben, Segmente und LED-Module',
  'Typ und Zugänglichkeit des Netzteils',
  'Montagehöhe und Zugang zur Konstruktion',
  'Zustand der Kabel, Klemmen und Verbindungen',
  'Vorhandensein von Feuchtigkeit, Korrosion oder Gehäuseschäden',
  'Notwendigkeit eines teilweisen Rückbaus',
  'Bedarf an Leiter, Hebebühne oder Sonderzugang',
];

const content = `# Werbeanlage flackert: Ursachen, Diagnose und richtige Maßnahmen

## Kurzantwort

Wenn eine beleuchtete Werbeanlage flackert, blinkt, pulsiert, kurzzeitig ausfällt oder instabil leuchtet, liegt das Problem in den meisten Fällen nicht an den LEDs selbst, sondern an der Stromversorgung.

Die häufigsten Ursachen sind ein instabiles oder überlastetes Netzteil, ein loser Kontakt, Spannungsabfall auf der Leitung, Feuchtigkeit im Gehäuse, Korrosion an Verbindungen, ein defekter LED-Treiber, ein Controller oder beschädigte LED-Module.

Wenn das Flackern nach Regen, Schnee, Wind, Fassadenreinigung, einem Spannungsstoß oder mehreren Jahren Betrieb aufgetreten ist, sollte man einen vollständigen Ausfall nicht abwarten. Instabiler Betrieb kann LED-Module, Verbindungen, Treiber und die interne Elektrik der Konstruktion allmählich beschädigen.

In vielen Fällen wird das Problem durch einen Netzteiltausch, die Wiederherstellung von Kontakten oder die Abdichtung von Verbindungen gelöst. Vor dem Austausch sollten jedoch Last, Spannung unter Last, Leitungslänge, Kabelzustand, Feuchtigkeitsspuren und die Funktion der LED-Komponenten geprüft werden.

---

## Was Flackern bei einer Werbeanlage üblicherweise bedeutet

Flackern ist keine einzelne Störung, sondern ein Symptom einer instabilen Hintergrundbeleuchtung. LEDs reagieren extrem schnell auf Stromschwankungen – selbst kurze Einbrüche, Pulsationen oder Versorgungsunterbrechungen werden sofort als Blinken, Pulsieren, Helligkeitsänderung oder kurzzeitiger Lichtausfall sichtbar.

Wenn eine Anlage gar nicht leuchtet, beginnt die Diagnose gewöhnlich mit Stromversorgung, Sicherungsautomat, Anschluss und Netzteil. Wenn die Anlage jedoch flackert, ist es wichtig, den Charakter der Instabilität zu verstehen:

- Flackert die gesamte Konstruktion oder nur ein Teil?
- Fällt das Licht komplett aus oder ändert sich nur die Helligkeit?
- Tritt das Problem dauerhaft oder nur zeitweise auf?
- Gibt es einen Zusammenhang mit Regen, Wind, Tageszeit oder Gebäudelast?
- Hat sich die Situation im Laufe der Zeit verändert?

Aus diesen Merkmalen lässt sich ableiten, wo die Störung am wahrscheinlichsten zu suchen ist: im Netzteil, in der Zuleitung, an Kontakten, bei Feuchtigkeit, im Controller oder in den LED-Modulen.

---

## Diagnose nach Flackermuster

| Erscheinungsbild | Wahrscheinlichste Prüfbereiche |
|---|---|
| Gesamte Anlage flackert gleichzeitig | Netzteil, Eingangsspannung, Sicherungsautomat, Timer, Hauptkontakt, Systemüberlastung |
| Ein einzelner Buchstabe oder Abschnitt flackert | Lokale Verbindung, Kabel zwischen Buchstaben, einzelne Speiseleitung, LED-Modul, Polarität |
| Licht fällt kurzzeitig komplett aus | Netzteil geht in Schutzabschaltung, Überlastung, Überhitzung, loser Kontakt oder instabile Einspeisung |
| Flackern verstärkt sich nach Regen | Feuchtigkeit, Kondensat, Korrosion, undichte Verbindungen, Öffnungen im Gehäuse |
| Flackern nur beim Einschalten | Anlaufstrom, Netzteilalterung, instabiler Treiber, Leitungsüberlastung |
| Flackern tritt abends oder nachts auf | Spannungsabfall, gemeinsame Leitung mit anderer Gebäudetechnik, Gebäudelast, Timer oder Relais |
| Buchstabenende oder langes Segment leuchtet schwächer | Spannungsabfall auf der Leitung, zu viele Module in Reihe, zu dünner Kabelquerschnitt |
| Flackern nur auf Kamera sichtbar | Möglicherweise Effekt der Aufnahmefrequenz, PWM-Regelung oder Treiber – wenn kein Flackern mit dem Auge erkennbar ist, liegt nicht unbedingt ein Defekt vor |
| Licht wird abwechselnd heller und dunkler | Instabiles Netzteil, loser Kontakt, Bauteilalterung, Überhitzung oder Spannungsabfall |

---

## Hauptursachen für Flackern

### 1. Unterdimensioniertes Netzteil

Das Netzteil muss nicht nur zur Gesamtleistung der LED-Module passen, sondern auch zu Systemspannung, Leitungslängen, Anschlussschema und Betriebsbedingungen.

Wenn die Beleuchtung beispielsweise rund 100 W aufnimmt, aber nur ein 90-W-Netzteil verbaut ist, arbeitet das System überlastet. In dieser Situation kann die Anlage nicht nur schwächer leuchten – das Netzteil kann überhitzen, die Spannung einbrechen, kurzzeitig abschalten oder zyklisch neu starten.

Selbst wenn das Netzteil von der Leistung her „knapp passt", sollte es nicht am Limit betrieben werden. Für stabilen Betrieb braucht es eine Leistungsreserve und korrekte Abstimmung auf Spannung, Strom, Lasttyp, IP-Schutzart und Temperaturbereich.

### 2. Netzteil geht in Schutzabschaltung

Viele Netzteile verfügen über Schutz gegen Überlast, Kurzschluss und Überhitzung. Wenn das System die zulässigen Parameter überschreitet, kann das Netzteil den Ausgang vorübergehend abschalten und dann erneut starten. Dieser Betriebszustand ist kein Normalbetrieb.

### 3. Netzteilalterung

Auch ein korrekt dimensioniertes Netzteil kann mit der Zeit an Stabilität verlieren. Elektronische Bauteile im Inneren unterliegen Erwärmung, Strompulsationen und Ein/Aus-Zyklen. Mit zunehmendem Alter verschlechtern sich ihre Eigenschaften.

### 4. Spannungsabfall auf langer Leitung

Bei Außenanlagen kann das Netzteil weit von den Buchstaben entfernt montiert sein. Auf Kabeln, Klemmen und Verbindungen geht ein Teil der Spannung verloren. Je länger die Leitung, je höher der Strom und je dünner das Kabel, desto stärker der Spannungsabfall.

### 5. Loser Kontakt an Verbindungen

Lose Kontakte gehören zu den häufigsten Flackerursachen. Der Kontakt muss nicht vollständig unterbrochen sein – es reicht, wenn er instabil ist: mal da, mal weg.

### 6. Feuchtigkeit, Kondensat und Korrosion

Wenn das Flackern nach Regen, Schnee, Fassadenreinigung oder einem plötzlichen Temperaturwechsel aufgetreten ist, sollte Feuchtigkeit als Ursache geprüft werden. Außenanlagen können nicht nur durch direktes Eindringen von Wasser betroffen sein, sondern auch durch Kondensatbildung im Gehäuseinneren.

### 7. Defekter LED-Treiber, Controller, Timer oder Dimmer

In manchen Anlagen sitzt zwischen Netzteil und LEDs weitere Elektronik. Flackern kann bei Inkompatibilität oder Defekt dieser Bauteile auftreten.

### 8. Beschädigung oder Alterung von LED-Modulen

Wenn nicht die gesamte Anlage flackert, sondern nur einzelne Buchstaben, Segmente oder Punkte, kann die Ursache eine lokale Beschädigung von LED-Bauteilen sein.

### 9. Probleme der Eingangsspannung

Manchmal liegt die Ursache des Flackerns nicht in der Anlage selbst, sondern in der Gebäudestromversorgung.

---

## Was Sie sicher selbst prüfen können

Vor einer Kontaktaufnahme können Sie Informationen sammeln, die die Diagnose beschleunigen. Die Anlage muss dafür nicht geöffnet, das Netzteil nicht zugänglich gemacht und der elektrische Anschluss nicht berührt werden.

- Flackert die gesamte Anlage oder nur ein einzelner Buchstabe?
- Ist das Flackern dauerhaft oder zeitweise?
- Fällt das Licht komplett aus oder ändert sich nur die Helligkeit?
- Ist das Problem plötzlich aufgetreten oder hat es sich allmählich verstärkt?
- Gab es einen Zusammenhang mit Regen, Schnee, Wind, Fassadenreinigung oder einem Spannungsstoß?
- Gibt es Überhitzungsgeruch, Funken, Knistern oder starke Erwärmung?
- Laufen andere Geräte auf demselben Stromkreis stabil?

Sehr hilfreich ist ein kurzes Video. Am besten zwei Aufnahmen: eine Gesamtansicht der Anlage und eine Nahaufnahme des betroffenen Bereichs.

---

## Was Sie vermeiden sollten

- Gehäuse der Anlage unter Spannung öffnen
- Feuchte Bauteile berühren
- Bei eingeschalteter Versorgung Kabel bewegen
- Netzteil eigenständig „gegen ein ähnliches" tauschen ohne Berechnung
- Stärkeres Netzteil einbauen ohne Prüfung von Schaltung und Schutzeinrichtung
- Kabel mit Lüsterklemmen oder Verdrillung ohne passende Klemmen und Abdichtung verbinden
- Schutzeinrichtungen überbrücken
- Weiterbetrieb bei Brandgeruch, Funken, starker Erwärmung oder Auslösung des Sicherungsautomaten

---

## Wann Sie sofort handeln müssen

Anlage sofort stromlos schalten und Fachpersonal kontaktieren bei: Funkenbildung, Brand- oder Kunststoffgeruch, Knistern, starker Gehäuseerwärmung, Wasserspuren im Inneren der Konstruktion, Auslösung des Sicherungsautomaten, Totalausfall nach Flackern, beschädigtem Kabel, verfärbten Klemmen oder Leitungen, Flackern nach Gewitter.

---

## Wie PixelRing das Problem üblicherweise diagnostiziert

Die Erstbewertung erfolgt häufig aus der Ferne. Anhand von Fotos, Video und Beschreibung lässt sich einschätzen, wo die Ursache am wahrscheinlichsten liegt.

1. Charakter des Flackerns – flackert die gesamte Anlage synchron oder nur ein Abschnitt.
2. Wann ist das Problem aufgetreten – nach Regen, Wind, Frost, Spannungsstoß oder ohne erkennbare Ursache.
3. Was genau passiert mit dem Licht – pulsiert es, ändert sich die Helligkeit, fällt es kurzzeitig aus.
4. Zugänglichkeit des Netzteils – sind die Parameter sicher ablesbar.
5. Zustand des Anschlusses – gibt es Anzeichen von Feuchtigkeit, Korrosion, Überhitzung.
6. Überlastungswahrscheinlichkeit – entspricht das Netzteil der tatsächlichen Last.
7. Spannungsabfall – ist die Speiseleitung zu lang.
8. Funktion von Controllern und Timern.

---

## Wie das Problem üblicherweise gelöst wird

Die Lösung hängt von der Ursache ab. Mögliche Maßnahmen: Netzteiltausch, Lastaufteilung, Klemmenwiederherstellung, Kabelaustausch, Abdichtung von Verbindungen, Behebung von Spannungsabfall, Austausch beschädigter LED-Module, Treiber- oder Controller-Ersatz, Gehäusewiederherstellung.

---

## Was Sie PixelRing für eine schnelle Einschätzung senden können

- Kurzes Video des Flackerns
- Foto der gesamten Anlage
- Nahaufnahme des betroffenen Buchstabens oder Bereichs
- Angabe, ob die gesamte Anlage oder nur ein Teil betroffen ist
- Wann das Problem aufgetreten ist
- Ob ein Zusammenhang mit Regen, Wind, Frost, Gewitter oder Spannungsstoß bestand
- Foto des Netzteils und des Typenschilds, sofern sicher zugänglich
- Objektadresse und Montagehöhe

---

## Ähnliche Situationen

- Werbeanlage leuchtet nicht
- Nur ein Teil der Buchstaben leuchtet
- Werbeanlage fällt nach Regen aus
- LED-Beleuchtung ist schwächer geworden
- Ein Buchstabe leuchtet schwächer`;

const article = {
  locale: 'de',
  type: 'SYMPTOM',
  status: 'PUBLISHED',
  slug: 'flicking',
  title: 'Werbeanlage flackert',
  symptomLabel: 'Das Licht ist instabil, flackert, pulsiert oder fällt kurzzeitig aus.',
  shortAnswer,
  content,
  seoTitle: 'Werbeanlage flackert: Ursachen, Diagnose und Maßnahmen | PixelRing',
  seoDescription: 'Warum flackert Ihre Werbeanlage? Netzteil, Kontakt, Feuchtigkeit, LED-Module – Ursachen erkennen und wissen, wann eine Reparatur dringend ist. PixelRing.',
  canonicalUrl: '/de/probleme-loesungen/werbeanlage-flackert',
  relatedSlugs: ['no-light', 'uneven-light', 'rain-fail'],
  causes,
  safeChecks,
  urgentWarnings,
  serviceProcess,
  workScopeFactors,
  ctaLabel: 'Foto senden',
  ctaHref: '/de#contact',
  sortOrder: 1,
  publishedAt: now,
  lastReviewedAt: now,
  deletedAt: null,
  createdAt: now,
  updatedAt: now,
};

const upsertSql = `
  INSERT INTO "cms_articles" (
    "id","locale","type","status","slug","title","symptomLabel","shortAnswer",
    "content","seoTitle","seoDescription","canonicalUrl","relatedSlugs",
    "causes","safeChecks","urgentWarnings","serviceProcess","workScopeFactors",
    "ctaLabel","ctaHref","sortOrder","publishedAt","lastReviewedAt",
    "deletedAt","createdAt","updatedAt"
  ) VALUES (
    $1,$2,$3::"CmsArticleType",$4::"CmsArticleStatus",$5,$6,$7,$8,
    $9,$10,$11,$12,$13::text[],$14::text[],$15::text[],$16::text[],
    $17::text[],$18::text[],$19,$20,$21,$22,$23,$24,$25,$26
  )
  ON CONFLICT ("locale", "slug")
  DO UPDATE SET
    "type" = EXCLUDED."type",
    "status" = EXCLUDED."status",
    "title" = EXCLUDED."title",
    "symptomLabel" = EXCLUDED."symptomLabel",
    "shortAnswer" = EXCLUDED."shortAnswer",
    "content" = EXCLUDED."content",
    "seoTitle" = EXCLUDED."seoTitle",
    "seoDescription" = EXCLUDED."seoDescription",
    "canonicalUrl" = EXCLUDED."canonicalUrl",
    "relatedSlugs" = EXCLUDED."relatedSlugs",
    "causes" = EXCLUDED."causes",
    "safeChecks" = EXCLUDED."safeChecks",
    "urgentWarnings" = EXCLUDED."urgentWarnings",
    "serviceProcess" = EXCLUDED."serviceProcess",
    "workScopeFactors" = EXCLUDED."workScopeFactors",
    "ctaLabel" = EXCLUDED."ctaLabel",
    "ctaHref" = EXCLUDED."ctaHref",
    "sortOrder" = EXCLUDED."sortOrder",
    "publishedAt" = EXCLUDED."publishedAt",
    "lastReviewedAt" = EXCLUDED."lastReviewedAt",
    "deletedAt" = EXCLUDED."deletedAt",
    "updatedAt" = EXCLUDED."updatedAt"
`;

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const values = [
      crypto.randomUUID(),
      article.locale, article.type, article.status, article.slug,
      article.title, article.symptomLabel, article.shortAnswer,
      article.content, article.seoTitle, article.seoDescription,
      article.canonicalUrl, article.relatedSlugs,
      article.causes, article.safeChecks, article.urgentWarnings,
      article.serviceProcess, article.workScopeFactors,
      article.ctaLabel, article.ctaHref, article.sortOrder,
      article.publishedAt, article.lastReviewedAt, article.deletedAt,
      article.createdAt, article.updatedAt,
    ];

    await client.query(upsertSql, values);
    console.log(JSON.stringify({ seed: 'article-flicker-de', slug: 'flicking', locale: 'de', status: 'OK' }));
  } finally {
    await client.end();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
