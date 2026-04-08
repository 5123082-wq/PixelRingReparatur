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
  throw new Error(
    'Missing POSTGRES_PRISMA_URL, DATABASE_URL, DIRECT_URL, or POSTGRES_URL_NON_POOLING for CMS support seed.'
  );
}

const now = new Date();

const serviceProcess = [
  'Foto oder kurze Beschreibung prüfen',
  'Symptom einordnen und Sicherheitsrisiken bewerten',
  'Bei Bedarf Diagnose vor Ort planen',
  'Reparatur oder Austausch sauber dokumentieren',
];

const articleMap = [
  {
    slug: 'no-light',
    title: 'Werbeanlage leuchtet nicht',
    shortAnswer:
      'Meist liegt das an Stromversorgung, Kontaktproblemen oder Feuchtigkeit. Wenn die Anlage komplett dunkel bleibt, sollte sie zeitnah geprüft werden.',
    causes: [
      'Stromversorgung unterbrochen',
      'Kontakt- oder Kabelproblem',
      'Feuchtigkeit im Gehäuse',
    ],
    safeChecks: [
      'Prüfen, ob die Anlage an anderer Stelle Strom bekommt',
      'Sichtbar lockere Kabel oder Beschädigungen nur von außen betrachten',
      'Ein Foto der betroffenen Zone aufnehmen',
    ],
    urgentWarnings: [
      'Bei Geruch, Funken oder ausgelöstem Schutzschalter sofort abschalten',
      'Bei Feuchtigkeit keine Eigenversuche am geöffneten System',
    ],
    workScopeFactors: [
      'Zugang zur Anlage',
      'Art der Stromversorgung',
      'Ob nur ein Bereich oder die komplette Anlage betroffen ist',
    ],
    relatedSlugs: ['flicking', 'uneven-light', 'rain-fail'],
  },
  {
    slug: 'flicking',
    title: 'Werbeanlage flackert',
    shortAnswer:
      'Flackern entsteht oft durch ein instabiles Netzteil, einen Wackelkontakt oder Feuchtigkeit. Wenn das Problem nach Regen auftritt, ist eine Prüfung sinnvoll.',
    causes: [
      'Instabile Spannungsversorgung',
      'Wackelkontakt im Anschluss',
      'Feuchtigkeit oder Korrosion',
    ],
    safeChecks: [
      'Beobachten, ob das Flackern dauerhaft oder nur zeitweise auftritt',
      'Nach Regen oder Wind verstärkte Auffälligkeiten notieren',
      'Ein kurzes Video für die Diagnose aufnehmen',
    ],
    urgentWarnings: [
      'Bei Funken, Geruch oder Ausfall sofort abschalten',
      'Keine offenen Bauteile bei Nässe anfassen',
    ],
    workScopeFactors: [
      'Betroffene Fläche',
      'Zustand von Netzteil und Leitungen',
      'Witterungseinfluss',
    ],
    relatedSlugs: ['no-light', 'uneven-light', 'rain-fail'],
  },
  {
    slug: 'uneven-light',
    title: 'Ungleichmäßiges Leuchten der LEDs',
    shortAnswer:
      'Ungleichmäßige Helligkeit zeigt oft ein Problem mit Modulen, Zuleitung oder Alterung. Der Defekt ist häufig lokal begrenzt und gut eingrenzbar.',
    causes: [
      'Einzelne LED-Module gealtert',
      'Teilweise Unterbrechung in der Zuleitung',
      'Verschmutzung oder Feuchtigkeit',
    ],
    safeChecks: [
      'Prüfen, ob nur einzelne Segmente dunkler sind',
      'Ein Foto bei gleicher Umgebungshelligkeit machen',
      'Beschreiben, ob der Effekt konstant oder wechselnd ist',
    ],
    urgentWarnings: [
      'Bei sichtbarer Hitzeentwicklung abschalten',
      'Bei Rauch oder Geruch nicht weiter betreiben',
    ],
    workScopeFactors: [
      'Anzahl der betroffenen Segmente',
      'Zugänglichkeit der Module',
      'Ob nur optische oder auch elektrische Schäden vorliegen',
    ],
    relatedSlugs: ['no-light', 'flicking', 'letter-out'],
  },
  {
    slug: 'letter-out',
    title: 'Ein einzelner Buchstabe leuchtet nicht',
    shortAnswer:
      'Wenn nur ein Buchstabe ausfällt, ist das Problem oft lokal: ein Modul, ein Anschluss oder die Verdrahtung dieses Elements. Das lässt sich meist gezielt eingrenzen.',
    causes: [
      'Lokaler Anschlussfehler',
      'Ausfall eines LED-Moduls',
      'Beschädigung im einzelnen Buchstaben',
    ],
    safeChecks: [
      'Vergleichen, ob nur ein Buchstabe oder mehrere betroffen sind',
      'Von außen auf sichtbare Schäden achten',
      'Ein Übersichtsfoto mit Markierung des betroffenen Buchstabens erstellen',
    ],
    urgentWarnings: [
      'Bei lockeren Teilen oder Wassereintritt die Anlage nicht weiter betreiben',
      'Bei Brandgeruch oder Funken sofort trennen',
    ],
    workScopeFactors: [
      'Bautyp des Buchstabens',
      'Zugang zur betroffenen Stelle',
      'Ob nur der Buchstabe oder auch die Zuleitung betroffen ist',
    ],
    relatedSlugs: ['uneven-light', 'no-light', 'rain-fail'],
  },
  {
    slug: 'rain-fail',
    title: 'Werbeanlage schaltet nach Regen ab',
    shortAnswer:
      'Ein Ausfall nach Regen deutet oft auf Feuchtigkeit, undichte Stellen oder Korrosion hin. Das sollte sicher geprüft werden, bevor weitere Schäden entstehen.',
    causes: [
      'Wasser dringt in Gehäuse oder Anschluss ein',
      'Korrosion an Kontakten',
      'Schutzschaltung reagiert auf Fehlstrom',
    ],
    safeChecks: [
      'Notieren, ob der Ausfall sofort oder verzögert nach Regen kommt',
      'Sichtbare Feuchtigkeitsstellen nur von außen dokumentieren',
      'Prüfen, ob auch andere Außenanlagen betroffen sind',
    ],
    urgentWarnings: [
      'Bei Feuchtigkeit und Strom keine Eigenöffnung',
      'Bei Sicherungsauslösung nicht wiederholt einschalten',
    ],
    workScopeFactors: [
      'Ort des Wassereintritts',
      'Umfang von Korrosion',
      'Zugänglichkeit der abgedichteten Bereiche',
    ],
    relatedSlugs: ['no-light', 'flicking', 'shaky-sign'],
  },
  {
    slug: 'peeling-film',
    title: 'Folie an der Schaufensterfläche hat sich gelöst',
    shortAnswer:
      'Lösende Folie entsteht meist durch Alterung, schlechte Haftung oder Feuchtigkeit. Je früher geprüft wird, desto eher lässt sich der Schaden begrenzen.',
    causes: [
      'Kleber gealtert',
      'Untergrund nicht mehr sauber haftend',
      'Feuchtigkeit oder Temperaturschwankungen',
    ],
    safeChecks: [
      'Randbereiche und Blasen nur von außen prüfen',
      'Nicht an losen Kanten ziehen',
      'Fotos aus kurzer Distanz und Gesamtansicht aufnehmen',
    ],
    urgentWarnings: [
      'Bei großen losen Flächen sofort sichern lassen',
      'Wenn Teile herabhängen, nicht selbst befestigen',
    ],
    workScopeFactors: [
      'Flächengröße',
      'Zustand des Untergrunds',
      'Ob Teilreparatur oder Neuverklebung nötig ist',
    ],
    relatedSlugs: ['faded-film', 'shaky-sign', 'urgent-repair'],
  },
  {
    slug: 'faded-film',
    title: 'Folie ist ausgeblichen',
    shortAnswer:
      'Ausbleichen ist meist ein Material- und UV-Thema. Wenn die Fläche optisch unruhig wirkt, ist eine Erneuerung oft die sinnvollere Lösung.',
    causes: [
      'UV-Belastung über längere Zeit',
      'Material altert durch Witterung',
      'Unterschiedliche Belastung einzelner Flächen',
    ],
    safeChecks: [
      'Vergleichen, ob die Ausbleichung flächig oder nur lokal ist',
      'Fotos bei Tageslicht aufnehmen',
      'Prüfen, ob weitere Schäden wie Risse vorhanden sind',
    ],
    urgentWarnings: [
      'Bei Ablösungen oder Rissen nicht auf Selbstreparatur setzen',
      'Wenn die Fläche sich hebt, zeitnah sichern lassen',
    ],
    workScopeFactors: [
      'Flächengröße',
      'Muster- oder Vollflächenwechsel',
      'Ob Untergrund ebenfalls erneuert werden muss',
    ],
    relatedSlugs: ['peeling-film', 'shaky-sign', 'urgent-repair'],
  },
  {
    slug: 'shaky-sign',
    title: 'Werbeanlage wackelt',
    shortAnswer:
      'Wackeln ist ein Sicherheitszeichen. Ursache sind oft Befestigung, Windlast oder Materialermüdung, und das sollte nicht aufgeschoben werden.',
    causes: [
      'Lockere Befestigung',
      'Korrosion oder Materialermüdung',
      'Erhöhte Windbelastung',
    ],
    safeChecks: [
      'Bewegung nur aus sicherer Entfernung beobachten',
      'Dokumentieren, ob das Wackeln bei Wind stärker wird',
      'Den Bereich darunter freihalten',
    ],
    urgentWarnings: [
      'Bei starkem Spiel oder Knacken sofort absichern',
      'Nicht versuchen, die Anlage unter Spannung oder Höhe selbst zu fixieren',
    ],
    workScopeFactors: [
      'Befestigungsart',
      'Zustand der Trägerkonstruktion',
      'Erforderliche Absicherung vor der Reparatur',
    ],
    relatedSlugs: ['urgent-repair', 'peeling-film', 'rain-fail'],
  },
  {
    slug: 'urgent-repair',
    title: 'Dringende Reparatur erforderlich',
    shortAnswer:
      'Wenn eine Anlage akut auffällig ist, zählt zuerst die Sicherheit. Dringende Ausfälle, Wackeln oder sichtbare Schäden sollten zeitnah eingeordnet werden.',
    causes: [
      'Akuter elektrischer oder mechanischer Defekt',
      'Sicherheitsrelevante Beschädigung',
      'Feuchtigkeit oder Ausfall nach Belastung',
    ],
    safeChecks: [
      'Anlage sichern und nur aus sicherer Entfernung betrachten',
      'Auffälligkeiten mit Foto oder Video dokumentieren',
      'Prüfen, ob sofortiger Betrieb gestoppt werden muss',
    ],
    urgentWarnings: [
      'Bei Funken, Rauch, Wasser oder Lockerung sofort abschalten',
      'Keine improvisierten Reparaturen an kritischen Teilen',
    ],
    workScopeFactors: [
      'Sicherheitsrisiko',
      'Zugänglichkeit und Dringlichkeit',
      'Ob nur Diagnose oder Soforteinsatz nötig ist',
    ],
    relatedSlugs: ['no-light', 'rain-fail', 'shaky-sign'],
  },
];

const titleBySlug = new Map(articleMap.map((article) => [article.slug, article.title]));

function formatList(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

function buildContent(article) {
  const relatedTitles = article.relatedSlugs
    .map((slug) => titleBySlug.get(slug))
    .filter(Boolean);

  return [
    `# ${article.title}`,
    '',
    article.shortAnswer,
    '',
    '## Was das meist bedeutet',
    formatList(article.causes),
    '',
    '## Was Sie sicher prüfen können',
    formatList(article.safeChecks),
    '',
    '## Wann ein schneller Einsatz nötig ist',
    formatList(article.urgentWarnings),
    '',
    '## Wie wir das typischerweise lösen',
    formatList(serviceProcess),
    '',
    '## Wovon der Aufwand abhängt',
    formatList(article.workScopeFactors),
    '',
    '## Ähnliche Themen',
    formatList(relatedTitles.length > 0 ? relatedTitles : article.relatedSlugs),
    '',
    '## Nächster Schritt',
    'Wenn Sie uns ein Foto oder eine kurze Beschreibung senden, können wir die Ursache meist schneller eingrenzen und den passenden nächsten Schritt empfehlen.',
  ].join('\n');
}

function buildSeedArticle(article, sortOrder) {
  return {
    locale: 'de',
    type: 'SYMPTOM',
    status: 'PUBLISHED',
    slug: article.slug,
    title: article.title,
    symptomLabel: article.title,
    shortAnswer: article.shortAnswer,
    content: buildContent(article),
    seoTitle: `${article.title} | PixelRing Reparatur`,
    seoDescription: article.shortAnswer,
    canonicalUrl: `/de/support/${article.slug}`,
    relatedSlugs: article.relatedSlugs,
    causes: article.causes,
    safeChecks: article.safeChecks,
    urgentWarnings: article.urgentWarnings,
    serviceProcess,
    workScopeFactors: article.workScopeFactors,
    ctaLabel: 'Foto senden',
    ctaHref: '/de#contact',
    sortOrder,
    publishedAt: now,
    lastReviewedAt: now,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

const seedArticles = articleMap.map((article, index) => buildSeedArticle(article, index));

const upsertSql = `
  INSERT INTO "cms_articles" (
    "id",
    "locale",
    "type",
    "status",
    "slug",
    "title",
    "symptomLabel",
    "shortAnswer",
    "content",
    "seoTitle",
    "seoDescription",
    "canonicalUrl",
    "relatedSlugs",
    "causes",
    "safeChecks",
    "urgentWarnings",
    "serviceProcess",
    "workScopeFactors",
    "ctaLabel",
    "ctaHref",
    "sortOrder",
    "publishedAt",
    "lastReviewedAt",
    "deletedAt",
    "createdAt",
    "updatedAt"
  ) VALUES (
    $1,
    $2,
    $3::"CmsArticleType",
    $4::"CmsArticleStatus",
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12,
    $13::text[],
    $14::text[],
    $15::text[],
    $16::text[],
    $17::text[],
    $18::text[],
    $19,
    $20,
    $21,
    $22,
    $23,
    $24,
    $25,
    $26
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
    await client.query('begin');

    for (const article of seedArticles) {
      const articleId = crypto.randomUUID();
      const values = [
        articleId,
        article.locale,
        article.type,
        article.status,
        article.slug,
        article.title,
        article.symptomLabel,
        article.shortAnswer,
        article.content,
        article.seoTitle,
        article.seoDescription,
        article.canonicalUrl,
        article.relatedSlugs,
        article.causes,
        article.safeChecks,
        article.urgentWarnings,
        article.serviceProcess,
        article.workScopeFactors,
        article.ctaLabel,
        article.ctaHref,
        article.sortOrder,
        article.publishedAt,
        article.lastReviewedAt,
        article.deletedAt,
        article.createdAt,
        article.updatedAt,
      ];

      await client.query(upsertSql, values);
    }

    await client.query('commit');

    console.log(
      JSON.stringify({
        seed: 'cms-support-articles',
        locale: 'de',
        count: seedArticles.length,
        slugs: seedArticles.map((article) => article.slug),
      })
    );
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
