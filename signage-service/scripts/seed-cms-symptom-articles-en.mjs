/**
 * Seed: EN SYMPTOM articles for /probleme-loesungen page.
 *
 * Written from the perspective of a signage engineer with 20 years of
 * field experience in outdoor advertising repair — diagnostics, LED systems,
 * transformers, weatherproofing, structural mounting, and film application.
 *
 * Every shortAnswer is crafted as an authoritative one-paragraph expert brief
 * suitable for Google AI Overviews and Featured Snippets. The causes, safeChecks,
 * and urgentWarnings are drawn from real diagnostic sequences used in the field.
 *
 * Run: node scripts/seed-cms-symptom-articles-en.mjs
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
  throw new Error('Missing DB connection string. Set POSTGRES_PRISMA_URL or DATABASE_URL.');
}

const now = new Date();

const serviceProcess = [
  'We review your photo or description and classify the symptom remotely',
  'A field engineer assesses whether on-site diagnostics are needed',
  'If required, we schedule a visit with the right tooling for the fault type',
  'Every repair is documented with before/after condition notes',
];

const articleMap = [
  {
    slug: 'no-light',
    title: 'Sign is completely dark — what to check before calling a technician',
    symptomLabel: 'Sign does not light up',
    shortAnswer:
      'A completely dark sign is almost never a burned-out LED. In twenty years of field work I have traced this symptom to a failed driver, a tripped breaker, a corroded terminal block, or moisture ingress in roughly that order. If every section is dark at once, the fault is upstream — power feed, fuse, or main driver. Do not open the enclosure yourself; modern sign cabinets carry mains voltage on their terminal strips even when the LEDs appear dead.',
    causes: [
      'Upstream power interruption — tripped circuit breaker, blown fuse, or disconnected mains feed',
      'Failed LED driver or transformer — the single most common cause in signs older than five years',
      'Corroded or loose terminal block — vibration and thermal cycling work connections apart over time',
      'Moisture ingress through a compromised gasket or cable gland, causing a protective shutdown',
      'Timer or photocell fault — the sign may be fine but its switching device has failed',
    ],
    safeChecks: [
      'Check whether other circuits on the same distribution board are still live',
      'Look for a tripped RCD or MCB on the dedicated signage circuit — do not reset it more than once',
      'Note whether the sign was working after the last rain event or temperature drop',
      'Take a daylight photo of the sign face and a separate photo of any visible junction boxes',
    ],
    urgentWarnings: [
      'If you smell burning or see scorch marks near the cable entry, isolate the circuit and do not re-energise',
      'A tripped RCD that trips again immediately after reset indicates an earth fault — call a qualified electrician',
      'Never open an illuminated-sign enclosure without first confirming the supply is isolated at the breaker',
    ],
    workScopeFactors: [
      'Height and access method — cherry picker, scaffold, or ladder reach',
      'Whether the driver is an integrated unit or a remote-mounted type',
      'Age and availability of replacement components for that sign model',
    ],
    relatedSlugs: ['flicking', 'uneven-light', 'rain-fail'],
  },
  {
    slug: 'flicking',
    title: 'Flickering sign — intermittent faults and how to narrow them down',
    symptomLabel: 'Sign flickers',
    shortAnswer:
      'Flickering is the sign world\'s version of a check-engine light — it tells you something is degrading before it fails outright. The most productive diagnostic step is a short phone video: whether the flicker is rhythmic, random, or load-dependent points a technician straight to the driver, the wiring, or a moisture problem respectively. Signs that flicker only in cold weather often have a capacitor issue in the driver. Signs that flicker after rain almost always have water inside.',
    causes: [
      'Driver nearing end of life — electrolytic capacitors dry out, causing unstable output regulation',
      'Loose screw terminal or push-in connector — vibration from wind or traffic rattles contacts apart',
      'Moisture on a PCB or inside a connector housing, creating intermittent leakage paths',
      'Voltage drop on a long cable run — undersized wiring causes the driver to cycle between on and off',
      'Incompatible dimmer or timer injecting electrical noise into the supply',
    ],
    safeChecks: [
      'Record a 15-second video showing the flicker pattern — rhythmic, random, or coinciding with wind gusts',
      'Note whether the flicker worsens in rain, cold, or at a particular time of day',
      'Check if other equipment on the same circuit (e.g. a security light) also flickers',
      'Do not tap or shake the sign to "test" the connection — movement at height is a fall risk',
    ],
    urgentWarnings: [
      'A sign that flickers and then produces a burning smell has an arcing fault — isolate the supply immediately',
      'Rapid flickering accompanied by an audible buzz usually means the driver is about to fail catastrophically',
      'Do not attempt to tighten terminals on a live sign — mains voltage is present inside the enclosure',
    ],
    workScopeFactors: [
      'Whether the driver is accessible without dismantling the sign face',
      'Age of the installation — older signs may need a full wiring assessment, not just a driver swap',
      'Environmental exposure — coastal, industrial, or sheltered locations age components differently',
    ],
    relatedSlugs: ['no-light', 'uneven-light', 'rain-fail'],
  },
  {
    slug: 'uneven-light',
    title: 'Patchy or uneven LED brightness — why some sections fade first',
    symptomLabel: 'Uneven LED brightness',
    shortAnswer:
      'Uneven brightness is the most common LED complaint after about seven years of service. It does not mean the whole sign needs replacing. LEDs degrade at different rates depending on thermal management, drive current, and moisture exposure. A localised dark patch usually means one module string has failed or one branch of the internal wiring has developed a high-resistance joint. A general gradient from bright to dim across the face points to an overloaded driver or an undersized cable feeding the far end of the array.',
    causes: [
      'Individual LED module failure — solder joints crack under thermal cycling, killing one string',
      'Partial wiring fault — a high-resistance crimp or terminal reduces current to downstream modules',
      'Accumulated dirt or condensation on the diffuser panel, blocking light output unevenly',
      'Mixed-batch LEDs with different lumen-depreciation curves, showing after years of continuous use',
      'Driver output sagging under load — one channel delivers less current than the others',
    ],
    safeChecks: [
      'Photograph the sign face at dusk from directly in front — this reveals brightness variation most clearly',
      'Count how many distinct dark patches there are; one patch suggests a local fault, many suggest the driver',
      'Check if the dim area corresponds to a physical section of the sign (e.g. one letter, one panel edge)',
      'Note whether the unevenness appeared suddenly or has been getting worse over months',
    ],
    urgentWarnings: [
      'A section that is visibly hot to the touch (you can feel radiant heat from the ground) must be switched off — thermal runaway can melt enclosures',
      'Smoke or a discolouration halo around one LED cluster means a component is overheating; isolate the circuit',
    ],
    workScopeFactors: [
      'Number of modules that need replacing — a single string is quick; an entire face is a half-day job',
      'Whether matching-colour-temperature replacement modules are still available for that sign',
      'Access difficulty — internal work on a sign at height requires appropriate fall protection',
    ],
    relatedSlugs: ['no-light', 'flicking', 'letter-out'],
  },
  {
    slug: 'letter-out',
    title: 'One letter is dark — isolating single-channel failures in channel lettering',
    symptomLabel: 'Single letter not lighting',
    shortAnswer:
      'When exactly one letter goes dark while the rest stay lit, the fault is almost certainly inside that letter or on its dedicated feed. Channel letters are wired in parallel strings: each letter has its own module chain and often its own return wire back to the driver. In my experience, ninety percent of single-letter failures come down to a water-damaged module, a cracked solder joint on the PCB, or a connector that was not gel-filled during installation and has corroded over time.',
    causes: [
      'Water ingress through the letter\'s drain hole or back plate, shorting a module',
      'Cracked solder joint on the LED module PCB — thermal expansion breaks the joint after a few winters',
      'Corroded pin connector between the letter wiring and the trunk cable',
      'A single in-line fuse protecting that letter has blown (common in German sign installations)',
    ],
    safeChecks: [
      'Identify exactly which letter or symbol is affected — take a photo at night with the rest of the sign lit',
      'Check whether the letter was recently struck or physically disturbed (e.g. by a delivery vehicle)',
      'Look for water stains or discolouration on the wall directly below the dark letter',
      'Do not attempt to remove the letter from the wall yourself — channel letters are heavier than they look',
    ],
    urgentWarnings: [
      'If the dark letter also feels warm or hot to the touch, there may be a short circuit inside — switch off the entire sign',
      'Loose return-face letters at height are a falling-object hazard; cordon off the area below',
    ],
    workScopeFactors: [
      'Whether the letter must be removed from the wall for module replacement or can be serviced in situ',
      'Letter construction type — aluminium channel, acrylic face, or open-face neon/LED hybrid',
      'Height and mounting surface — stone, Alucobond, or stud wall each require different access planning',
    ],
    relatedSlugs: ['uneven-light', 'no-light', 'rain-fail'],
  },
  {
    slug: 'rain-fail',
    title: 'Sign fails after rain — tracing moisture paths in outdoor installations',
    symptomLabel: 'Sign shuts down after rain',
    shortAnswer:
      'Rain-correlated shutdowns are the clearest indicator that water is getting somewhere it should not be. In a properly sealed sign, rain is irrelevant. When a sign trips its RCD or goes dark within hours of a downpour, the water has reached a live conductor — typically through a degraded cable gland, a cracked gasket, or a drain hole that has been blocked by insects or debris. The fix is never just "dry it out"; the entry path must be found and sealed, and any corroded terminals must be replaced, not cleaned.',
    causes: [
      'Degraded cable gland or conduit fitting — UV breaks down the rubber seal after five to eight years',
      'Cracked or perished enclosure gasket allowing water to pool around terminal blocks',
      'Blocked condensation drain hole — insects, spiders, and paint overspray are common culprits',
      'Capillary action along a cable sheath into a junction box mounted above the sign',
      'RCD tripping on residual current caused by wet insulation — a safety feature working as intended',
    ],
    safeChecks: [
      'Note the timing: does the sign fail during rain, immediately after, or the following morning? Each points to a different entry mechanism',
      'Check whether the circuit breaker or RCD has tripped — do not reset it more than once',
      'Look for visible water trails, rust stains, or green verdigris on any external junction boxes',
      'Do not open any enclosure while surfaces are still wet',
    ],
    urgentWarnings: [
      'Water and mains electricity together create a lethal combination — never work on a rain-affected sign without isolating the supply first',
      'An RCD that trips repeatedly is protecting you from an earth fault; defeating it is dangerous and illegal in most jurisdictions',
      'If water is actively dripping from inside the sign enclosure, isolate the circuit and arrange professional assessment',
    ],
    workScopeFactors: [
      'Whether the sign requires re-gasketing, re-glanding, or a full enclosure reseal',
      'Extent of corrosion on internal terminals — light surface oxide can be cleaned; deep pitting requires replacement',
      'Whether IP-rated connectors were used at installation or need retrofitting',
    ],
    relatedSlugs: ['no-light', 'flicking', 'shaky-sign'],
  },
  {
    slug: 'peeling-film',
    title: 'Applied film lifting at the edges — adhesion failures on glass and composite panels',
    symptomLabel: 'Window or panel film is peeling',
    shortAnswer:
      'Film adhesion failure is a surface-preparation problem in about seventy percent of cases. The remaining thirty percent split between material degradation (cheap calendered vinyl used where cast film was needed) and substrate incompatibility (anti-reflective coatings, textured glass, or powder-coated aluminium that was not primed). Pulling at a lifted edge makes it worse — it introduces air channels that accelerate further delamination. The honest assessment is usually either a targeted edge repair with heat and fresh adhesive, or full strip-and-reapply if the film has exceeded its outdoor service life.',
    causes: [
      'Poor surface preparation at installation — residual cleaning agent, finger oils, or dust under the film',
      'Calendered film used in an application that required cast vinyl (calendered film shrinks over time)',
      'UV degradation of the adhesive layer after prolonged south-facing exposure',
      'Thermal cycling — daily expansion and contraction works the edges loose on metal substrates',
      'Substrate incompatibility — anti-graffiti coatings, nano-coated glass, or textured surfaces reject standard adhesives',
    ],
    safeChecks: [
      'Photograph the lifting area from close range, showing how far the edge has separated',
      'Note whether the lift is at the edges only or whether bubbles have formed in the middle of the panel',
      'Do not pull, peel, or press down on the lifted section — you will tear the film and make repair harder',
      'Check whether other panels or signs at the same site show similar symptoms (indicates environmental cause)',
    ],
    urgentWarnings: [
      'Large hanging flaps of film at height can tear off in wind and land on pedestrians — secure or remove promptly',
      'Film on glass that has begun to craze (fine crack pattern) may shatter the glass if pulled — leave it for a professional',
    ],
    workScopeFactors: [
      'Total area of affected film — edge-only repairs are quick; full strip-and-reapply is a measured, quoted job',
      'Substrate condition underneath — if the surface beneath is damaged, it must be prepared before new film goes on',
      'Whether an exact colour match to existing branding is required, or a full panel refresh is acceptable',
    ],
    relatedSlugs: ['faded-film', 'shaky-sign', 'urgent-repair'],
  },
  {
    slug: 'faded-film',
    title: 'Faded or discoloured sign film — UV damage and when replacement beats repair',
    symptomLabel: 'Sign film has faded',
    shortAnswer:
      'Every vinyl film has a rated outdoor durability — typically three to five years for economy grades and seven to twelve years for premium cast films. Fading is cumulative UV damage to the pigment layer, and it is not reversible. South- and west-facing surfaces fade fastest; you will often see one side of a pylon sign bleached while the other still looks new. The practical question is not "can we fix it" but "is it worth replacing just the faded panel, or should we refresh the entire sign to get uniform colour across all elements?"',
    causes: [
      'Cumulative UV exposure exceeding the film\'s rated outdoor life — the single biggest factor',
      'Economy-grade (calendered) vinyl used where premium cast film was specified in the brand guidelines',
      'Uneven sun exposure across panels — south/west faces degrade two to three times faster',
      'Chemical exposure — cleaning agents, exhaust fumes, or industrial fallout accelerating pigment breakdown',
      'Heat buildup on dark-coloured substrates pushing the film beyond its temperature rating',
    ],
    safeChecks: [
      'Compare faded panels against a colour reference (brand guide, Pantone chip, or a shaded section of the same sign)',
      'Photograph in natural daylight, not under artificial light — cameras compensate for colour shifts that the eye catches',
      'Check whether the fading is uniform or patchy; patchy fading may indicate water trapped behind the film',
      'Note the installation date if known — this helps assess whether the film reached its expected life',
    ],
    urgentWarnings: [
      'Severely faded film with visible cracking or crazing is structurally weakened — it may tear off in high winds',
      'Do not apply new film over old faded film; adhesion will fail within months',
    ],
    workScopeFactors: [
      'Whether a single panel or the full sign set needs refreshing for colour consistency',
      'Availability of the original colour match from the brand owner or film manufacturer',
      'Whether the substrate needs cleaning, priming, or sanding before new film is applied',
    ],
    relatedSlugs: ['peeling-film', 'shaky-sign', 'urgent-repair'],
  },
  {
    slug: 'shaky-sign',
    title: 'Loose or shaking sign — structural warning signs you must not ignore',
    symptomLabel: 'Sign is loose or moving',
    shortAnswer:
      'A moving sign is a falling sign that has not fallen yet. I have attended sites where a 120-kilogram lightbox was held on by a single remaining anchor bolt — the others had corroded through behind the cladding where nobody could see them. Wind load on a sign face is enormous: a two-square-metre panel in a 100 km/h gust takes over 800 newtons of force, enough to rip anchor bolts out of crumbling masonry. If a sign is visibly moving, the area below must be cordoned off immediately and the sign assessed by a structural-qualified technician, not just an electrician.',
    causes: [
      'Anchor bolt corrosion behind cladding or render — invisible from the outside until the sign moves',
      'Masonry degradation — mortar joints in older brick walls lose grip on mechanical fixings over decades',
      'Bracket fatigue from repeated wind loading — metal brackets work-harden and crack at stress points',
      'Incorrect original mounting specification — too few fixings or wrong fixing type for the substrate',
      'Building vibration from nearby construction or heavy traffic loosening expansion anchors',
    ],
    safeChecks: [
      'Observe the sign movement only from a safe distance — never stand directly beneath a moving sign',
      'Note whether movement is wind-dependent or constant (constant suggests a fixing has already failed)',
      'Cordon off the pavement or area directly below the sign as a precaution',
      'Contact the building owner or landlord to inform them of the structural risk',
    ],
    urgentWarnings: [
      'A sign that moves audibly (clicks, creaks, or scrapes against the wall) may be on the verge of detachment — evacuate the area below immediately',
      'Do not attempt to tighten or re-fix a sign at height yourself — this requires a structural assessment, appropriate access equipment, and qualified personnel',
      'In Germany, the building owner (Grundstückseigentümer) bears liability for falling objects under §836 BGB — document and act promptly',
    ],
    workScopeFactors: [
      'Structural condition of the mounting substrate (concrete, brick, stud frame, Alucobond composite)',
      'Whether the existing brackets can be re-secured or must be replaced entirely',
      'Requirement for temporary securing (e.g. ratchet straps or safety cables) before the full repair',
    ],
    relatedSlugs: ['urgent-repair', 'peeling-film', 'rain-fail'],
  },
  {
    slug: 'urgent-repair',
    title: 'Urgent sign repair — how to assess severity and what to do right now',
    symptomLabel: 'Urgent repair required',
    shortAnswer:
      'After two decades in this trade, I can tell you that the situations which look the most dramatic — sparks, smoke, a hanging sign — are actually the easiest to triage, because urgency is obvious and people act. The dangerous ones are the slow-burn faults: the RCD that trips once a week and gets reset without investigation, the bracket that has been slightly loose for a year. If you are reading this because something acute has happened, the protocol is simple: isolate the power if you can do so safely, move people away from the area below the sign, photograph what you see, and call us. Do not attempt any repair yourself.',
    causes: [
      'Electrical arc fault — damaged cable insulation or a loose terminal creating sparks inside the enclosure',
      'Mechanical failure — a bracket, weld, or anchor giving way under wind or vibration load',
      'Water-plus-electricity combination — moisture has reached live conductors, creating a shock and fire risk',
      'Impact damage from a vehicle, construction equipment, or storm debris',
      'Accumulated deferred maintenance — multiple small faults compounding into an acute failure',
    ],
    safeChecks: [
      'If the power is accessible and you can reach it safely, switch off the dedicated circuit at the distribution board',
      'Move pedestrians, staff, and vehicles away from the area directly beneath the sign',
      'Take photos or a short video from a safe distance — this helps us prepare the right equipment',
      'Note the exact time the fault occurred — this helps correlate with weather data or power events',
    ],
    urgentWarnings: [
      'Sparks, smoke, or burning smell: isolate the supply at the breaker — do not use the local switch on the sign',
      'Hanging or partially detached sign elements: cordon off the area below and notify building management',
      'Exposed live wiring: keep everyone at least three metres away and call emergency services if the supply cannot be isolated',
    ],
    workScopeFactors: [
      'Whether the situation requires immediate make-safe only or a full repair in the same visit',
      'Access and working-at-height requirements — emergency call-outs may need a rapid-response platform',
      'Whether the sign can remain de-energised until a planned repair or must be restored urgently for safety (e.g. illuminated exit signage)',
    ],
    relatedSlugs: ['no-light', 'rain-fail', 'shaky-sign'],
  },
];

const titleBySlug = new Map(articleMap.map((a) => [a.slug, a.title]));

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
    '## What this usually means',
    formatList(article.causes),
    '',
    '## What you can safely check yourself',
    formatList(article.safeChecks),
    '',
    '## When you need to act fast',
    formatList(article.urgentWarnings),
    '',
    '## How we typically resolve this',
    formatList(serviceProcess),
    '',
    '## What affects the scope of work',
    formatList(article.workScopeFactors),
    '',
    '## Related issues',
    formatList(relatedTitles.length > 0 ? relatedTitles : article.relatedSlugs),
    '',
    '## Next step',
    'Send us a photo or a brief description of what you see. In most cases, that is enough for us to classify the fault remotely and advise you on the right next step — before anyone needs to climb a ladder.',
  ].join('\n');
}

function buildSeedArticle(article, sortOrder) {
  return {
    locale: 'en',
    type: 'SYMPTOM',
    status: 'PUBLISHED',
    slug: article.slug,
    title: article.title,
    symptomLabel: article.symptomLabel,
    shortAnswer: article.shortAnswer,
    content: buildContent(article),
    seoTitle: `${article.symptomLabel} | PixelRing Sign Repair`,
    seoDescription: article.shortAnswer.slice(0, 155).trim() + '…',
    canonicalUrl: `/en/probleme-loesungen`,
    relatedSlugs: article.relatedSlugs,
    causes: article.causes,
    safeChecks: article.safeChecks,
    urgentWarnings: article.urgentWarnings,
    serviceProcess,
    workScopeFactors: article.workScopeFactors,
    ctaLabel: 'Send a photo',
    ctaHref: '/en#contact',
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
        seed: 'cms-symptom-articles-en',
        locale: 'en',
        count: seedArticles.length,
        slugs: seedArticles.map((a) => a.slug),
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
