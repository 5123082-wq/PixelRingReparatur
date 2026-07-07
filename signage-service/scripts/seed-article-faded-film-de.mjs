/**
 * Seed: German article for "Folie ist ausgeblichen" (faded-film).
 *
 * Reads the owner-review markdown draft from docs/07_content_ai_seo and publishes
 * only the German public full article section into cms_articles.
 *
 * Run: node scripts/seed-article-faded-film-de.mjs
 * Dry run: node scripts/seed-article-faded-film-de.mjs --dry-run
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, '..');
const repoDir = path.resolve(appDir, '..');
const isDryRun = process.argv.includes('--dry-run');

dotenv.config({ path: path.join(appDir, '.env.local') });
dotenv.config({ path: path.join(appDir, '.env') });

const connectionString =
  process.env.POSTGRES_PRISMA_URL ??
  process.env.DATABASE_URL ??
  process.env.DIRECT_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

if (!isDryRun && !connectionString) {
  throw new Error('Missing DB connection string.');
}

const now = new Date();

const ARTICLE_FOLDER = path.join(
  repoDir,
  'docs',
  '07_content_ai_seo',
  'problem_articles',
  'пленка выцвела – 08'
);

const SHARED = {
  slug: 'faded-film',
  publicSlug: 'folie-ist-ausgeblichen',
  relatedSlugs: ['peeling-film', 'uneven-light', 'urgent-repair'],
  sortOrder: 6,
};

const SELF_REPAIR_TIPS = {
  de: {
    intro:
      'Bei ausgeblichener Werbefolie geht es zuerst darum, den Zustand sauber zu dokumentieren und den Untergrund nicht durch vorschnelle Entfernung zu beschädigen.',
    withoutOpening: [
      'Machen Sie Fotos der gesamten Fläche, ein Nahfoto der ausgeblichenen Stelle und ein Foto aus normalem Kundenabstand.',
      'Fotografieren Sie Leuchtkästen einmal bei Tageslicht und einmal mit eingeschalteter Beleuchtung.',
      'Vergleichen Sie die Fläche mit alten Fotos, CI-Unterlagen, einem Originalfarbwert oder einer weniger belasteten Schattenfläche.',
      'Notieren Sie Alter der Folie, Standortseite, ungefähre Maße, Höhe, Zugang und den Untergrund: Glas, Acrylglas, Polycarbonat, Metall oder Leuchtkastenhaube.',
      'Halten Sie fest, ob die Folie nur blass ist oder ob sie zusätzlich reißt, klebt, sich löst oder Klebereste sichtbar sind.',
    ],
    technicalSpecialist: [
      'Bei gut zugänglichen, ebenen Glasflächen kann eine technische Fachperson nach Abstimmung beurteilen, ob vorbereitende Entfernung der alten Folie sinnvoll ist.',
      'Vor Entfernung oder Neuverklebung sollten Untergrund, Beschichtung, Klebereste, Folientyp, alte Druckdaten, Farbabweichung und Leuchtkastenwirkung geprüft werden.',
      'Bei Acrylglas, Polycarbonat, beschichtetem Glas, isolierten Scheiben, Leuchtkastenhauben, großen Flächen oder Höhe sollte die Demontage fachlich geplant werden.',
    ],
    doNotDo: [
      'Nicht mit starker Hitze, scharfen Klingen, harten Schabern, aggressiven Lösungsmitteln oder Haushaltsklebern arbeiten, wenn der Untergrund nicht eindeutig bekannt ist.',
      'Keine neue Folie einfach über alte, spröde, verschmutzte oder klebende Folie kleben.',
      'Leuchtkästen, Kunststoffhauben, beschichtete Scheiben, große Flächen oder Arbeiten in der Höhe nicht ohne sicheren Zugang und Materialkenntnis demontieren.',
      'Keinen unsichtbaren Farbgleichstand nach Teilersatz und keine exakte Preiszusage nur per Foto voraussetzen.',
    ],
    qualificationNote:
      'Diese Hinweise sind keine Anleitung zur Folienmontage. Arbeiten an großen Glasflächen, Leuchtkästen, Acrylglas, Polycarbonat, empfindlichen Beschichtungen und in der Höhe sollten nur mit passender Erfahrung, geeignetem Material und sicherem Zugang erfolgen.',
  },
};

const LOCALE_CONFIG = {
  de: {
    file: 'problem_article_folie-ist-ausgeblichen_de.md',
    title: 'Folie ist ausgeblichen',
    symptomLabel: 'Folie ist ausgeblichen',
    shortAnswer:
      'Wenn eine Werbefolie deutlich ausgeblichen ist, lässt sich der ursprüngliche Farbton meistens nicht zuverlässig wiederherstellen. Ob ein Teilersatz reicht oder die ganze Fläche erneuert werden sollte, hängt vom Farbunterschied, vom Alter der Folie, vom Untergrund und vom Anspruch an das Erscheinungsbild ab.',
    seoTitle: 'Folie ist ausgeblichen? Werbefolie erneuern lassen | PixelRing',
    seoDescription:
      'Ausgeblichene Schaufensterfolie oder Werbegrafik? PixelRing prüft Teilersatz, Erneuerung und Untergrund. Foto senden und Einschätzung erhalten.',
    causes: [
      'Lange UV-Belastung, besonders auf Süd- oder Südwestseiten',
      'Alterung der Folie durch Witterung, Hitze, Feuchtigkeit und Nutzungsdauer',
      'Druck, Tinte oder fehlender beziehungsweise gealterter Schutzlaminat verlieren Farbstabilität',
      'Folientyp oder Materialqualität passt nicht optimal zu Außenbereich, Untergrund oder Beleuchtung',
      'Ungeeignete Reinigung, harte Werkzeuge, aggressive Chemie oder mechanische Belastung',
    ],
    safeChecks: [
      'Fotos der ganzen Fläche, Nahaufnahmen und Fotos aus normalem Kundenabstand aufnehmen',
      'Bei Leuchtkästen Fotos bei Tageslicht und mit eingeschalteter Beleuchtung machen',
      'Mit alten Fotos, CI-Unterlagen, Originalfolie oder einer geschützten Fläche vergleichen',
      'Alter, Standortseite, Untergrund, Maße, Höhe und Zugang zur Fläche notieren',
      'Prüfen, ob die Folie nur ausgeblichen ist oder sich zusätzlich löst, reißt, klebt oder Klebereste zeigt',
    ],
    urgentWarnings: [
      'Zeitnah prüfen lassen, wenn die Folie zusätzlich reißt, sich ablöst, scharfe Kanten bildet, klebt oder Klebereste sichtbar werden.',
      'Nicht selbst beginnen, wenn die Folie auf einem Leuchtkasten, Acrylglas, Polycarbonat, beschichtetem Glas, einer großen Schaufensterfläche oder an einer schwer zugänglichen Stelle sitzt.',
      'Vor Neueröffnung, Rebranding, Übergabe, Kampagnenstart oder stark kunden sichtbaren Flächen frühzeitig klären, ob Teilersatz oder komplette Erneuerung sinnvoll ist.',
    ],
    serviceProcess: [
      'PixelRing prüft anhand von Fotos, ob es eher um Verschmutzung, Oberflächenalterung, echtes Ausbleichen, Druckalterung oder Materialschaden geht.',
      'Bei Leuchtkästen wird zusätzlich die Lichtwirkung bei Tag und Nacht sowie der Zustand von Haube, Streuscheibe und Beleuchtung bewertet.',
      'Untergrund, Maße, Höhe, Zugang, vorhandene Druckdaten, CI-Farben, Demontageaufwand und Kleberestrisiko werden in die Einschätzung einbezogen.',
      'Danach wird eingeordnet, ob Reinigungstest, Teilersatz, komplette Erneuerung, Neudruck, transluzente Leuchtkastenfolie oder ein anderes Material sinnvoll ist.',
    ],
    workScopeFactors: [
      'Größe der Fläche, Höhe und Zugänglichkeit',
      'Untergrund: Glas, beschichtetes Glas, Acrylglas, Polycarbonat, Metall oder Leuchtkastenhaube',
      'Zustand der alten Folie, Klebereste, Risse, Sprödigkeit und Demontageaufwand',
      'Vorhandene Druckdaten, Logo-Dateien, CI-Farben und gewünschte Materialqualität',
      'Ob Teilersatz optisch ausreicht oder alte und neue Folie direkt nebeneinanderliegen',
      'Ob die Fläche bei Tageslicht, bei Beleuchtung oder in beiden Situationen sauber wirken muss',
    ],
    ctaLabel: 'Foto senden und Erneuerung prüfen lassen',
  },
};

function extractPublicArticle(markdown) {
  const match = markdown.match(/## 3\.[^\n]*\n\n([\s\S]*?)\n\n---\n\n## 4\./);
  if (!match) {
    throw new Error('Could not extract public full article section from markdown.');
  }

  const content = match[1].trim();
  if (!content.startsWith('# ')) {
    throw new Error('Extracted article does not start with H1.');
  }
  if (/^## 4\./m.test(content)) {
    throw new Error('Extracted article contains the internal AI note boundary.');
  }
  if (content.length < 5000) {
    throw new Error(`Extracted article is unexpectedly short: ${content.length} characters.`);
  }

  return content;
}

function readArticle(locale, config) {
  const filePath = path.join(ARTICLE_FOLDER, config.file);
  const markdown = fs.readFileSync(filePath, 'utf8');

  return {
    locale,
    type: 'SYMPTOM',
    status: 'PUBLISHED',
    slug: SHARED.slug,
    title: config.title,
    symptomLabel: config.symptomLabel,
    shortAnswer: config.shortAnswer,
    content: extractPublicArticle(markdown),
    seoTitle: config.seoTitle,
    seoDescription: config.seoDescription,
    canonicalUrl: `/${locale}/probleme-loesungen/${SHARED.publicSlug}`,
    relatedSlugs: SHARED.relatedSlugs,
    causes: config.causes,
    safeChecks: config.safeChecks,
    selfRepairTips: SELF_REPAIR_TIPS[locale] ?? null,
    urgentWarnings: config.urgentWarnings,
    serviceProcess: config.serviceProcess,
    workScopeFactors: config.workScopeFactors,
    ctaLabel: config.ctaLabel,
    ctaHref: `/${locale}#contact`,
    sortOrder: SHARED.sortOrder,
    publishedAt: now,
    lastReviewedAt: now,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

const upsertSql = `
  INSERT INTO "cms_articles" (
    "id","locale","type","status","slug","title","symptomLabel","shortAnswer",
    "content","seoTitle","seoDescription","canonicalUrl","relatedSlugs",
    "causes","safeChecks","selfRepairTips","urgentWarnings","serviceProcess","workScopeFactors",
    "ctaLabel","ctaHref","sortOrder","publishedAt","lastReviewedAt",
    "deletedAt","createdAt","updatedAt"
  ) VALUES (
    $1,$2,$3::"CmsArticleType",$4::"CmsArticleStatus",$5,$6,$7,$8,
    $9,$10,$11,$12,$13::text[],$14::text[],$15::text[],$16::jsonb,$17::text[],
    $18::text[],$19::text[],$20,$21,$22,$23,$24,$25,$26,$27
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
    "selfRepairTips" = EXCLUDED."selfRepairTips",
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
  RETURNING "id", "locale", "slug", "status", "canonicalUrl", char_length("content") AS "contentChars"
`;

async function upsertArticle(client, article) {
  const values = [
    crypto.randomUUID(),
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
    article.selfRepairTips ? JSON.stringify(article.selfRepairTips) : null,
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

  const result = await client.query(upsertSql, values);
  return result.rows[0];
}

function summarizeArticleForDryRun(article) {
  return {
    locale: article.locale,
    slug: article.slug,
    publicSlug: SHARED.publicSlug,
    status: article.status,
    title: article.title,
    canonicalUrl: article.canonicalUrl,
    contentChars: article.content.length,
    sectionCount: article.content.match(/^##\s+/gm)?.length ?? 0,
    causesCount: article.causes.length,
    safeChecksCount: article.safeChecks.length,
    selfRepairTips: {
      withoutOpening: article.selfRepairTips?.withoutOpening?.length ?? 0,
      technicalSpecialist: article.selfRepairTips?.technicalSpecialist?.length ?? 0,
      doNotDo: article.selfRepairTips?.doNotDo?.length ?? 0,
      hasQualificationNote: Boolean(article.selfRepairTips?.qualificationNote),
    },
  };
}

async function main() {
  const articles = Object.entries(LOCALE_CONFIG).map(([locale, config]) =>
    readArticle(locale, config)
  );

  if (isDryRun) {
    console.log(
      JSON.stringify(
        {
          seed: 'article-faded-film-de',
          dryRun: true,
          status: 'OK',
          articles: articles.map(summarizeArticleForDryRun),
        },
        null,
        2
      )
    );
    return;
  }

  const client = new Client({ connectionString });
  await client.connect();

  try {
    const results = [];
    for (const article of articles) {
      results.push(await upsertArticle(client, article));
    }

    console.log(
      JSON.stringify(
        {
          seed: 'article-faded-film-de',
          slug: SHARED.slug,
          publicSlug: SHARED.publicSlug,
          status: 'OK',
          results,
        },
        null,
        2
      )
    );
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
