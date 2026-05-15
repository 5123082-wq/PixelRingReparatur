/**
 * Seed: Enriched EN article for "Sign flickers" (flicking).
 * Upserts only the flicking/en CMS article with deep technical content.
 * Written in natural, field-engineer English — not a word-for-word translation.
 *
 * Run: node scripts/seed-article-flicker-en.mjs
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
  'Flickering usually has nothing to do with the LEDs themselves — it is almost always a power-supply issue. The most common culpr2its are an overloaded or ageing driver, a loose terminal, voltage drop along the cable run, moisture inside the housing, or a failing LED driver. If the problem appeared after rain, wind, a power surge, or has been getting worse over time, it needs proper diagnosis before the backlight fails entirely.';

const causes = [
  'Power supply undersized or running without headroom',
  'Power supply aged — unstable output under load',
  'Fluctuating mains voltage',
  'Voltage drop on a long cable run or undersized wiring',
  'Loose contact at terminals, connectors, or solder joints',
  'Moisture, condensation, or corrosion inside the enclosure',
  'Faulty LED driver, controller, timer, or dimmer',
  'Damaged or degraded individual LED modules',
  'Overloaded supply line',
  'Damaged LED chain or internal wiring fault',
];

const safeChecks = [
  'Does the entire sign flicker or just one letter or section?',
  'Is the flicker constant or intermittent?',
  'Does the light pulse dimly or cut out completely for a moment?',
  'Did the problem start after rain, wind, snow, facade cleaning, or a power event?',
  'Does the flickering get worse in the evening, at night, or during peak building load?',
  'Are other devices on the same circuit running normally?',
  'Is there any smell of overheating, crackling sounds, sparks, moisture traces, or a tripped breaker?',
  'Can you record a short video — one wide shot and one close-up of the affected area?',
];

const urgentWarnings = [
  'If you see sparks, smell burning, hear crackling, notice strong heat, or the sign goes completely dark — disconnect the power immediately.',
  'Do not touch exposed components or connections, especially if there are signs of moisture.',
  'If the sign flickers after rain, shuts down, or trips the breaker — stop using it until it has been inspected.',
  'If the flickering is getting noticeably worse, the backlight may fail entirely or damage LED components.',
];

const serviceProcess = [
  'We ask for a photo of the sign and a short video of the flicker',
  'We clarify whether the entire structure or just one section is affected',
  'We assess whether the cause is likely the power supply, LED modules, controller, contacts, or moisture',
  'We check for signs of power supply overload and unstable output',
  'We evaluate possible voltage drop on long cable runs',
  'We assess the condition of connections, cables, and moisture traces',
  'If needed, we schedule a site visit for hands-on diagnosis',
  'After the repair, we document what was replaced or restored',
];

const workScopeFactors = [
  'Size and wattage of the sign',
  'Number of letters, sections, and LED modules',
  'Type and accessibility of the power supply',
  'Mounting height and access to the structure',
  'Condition of cables, terminals, and connections',
  'Presence of moisture, corrosion, or housing damage',
  'Whether partial disassembly is required',
  'Need for a ladder, lift platform, or special access',
];

const content = `# Flickering sign: causes, diagnosis, and what to do

## Short answer

When a lit sign flickers, blinks, pulses, briefly goes dark, or behaves erratically, the problem is almost never the LEDs themselves — it is how they are being powered.

The most common causes are an unstable or overloaded power supply, a loose connection, voltage drop along the cable run, moisture inside the housing, corroded terminals, a faulty LED driver or controller, or damaged LED modules.

If the flickering started after rain, snow, wind, facade cleaning, a power surge, or several years of continuous operation, do not wait for a complete blackout. Unstable operation can gradually damage LED modules, wiring, drivers, and the sign's internal electrics.

In many cases, the fix is a power supply swap, restoring connections, or re-sealing joints. But before replacing anything, the load, voltage under load, cable length, wiring condition, moisture traces, and LED component health all need checking.

---

## What flickering usually means

Flickering is not one specific fault — it is a symptom of instability in the backlight system. LEDs respond almost instantly to current changes, so even brief voltage dips, ripple, or supply interruptions show up immediately as blinking, pulsing, brightness shifts, or momentary blackouts.

If a sign is completely dark, diagnosis typically starts with the supply, breaker, wiring, and driver. But when a sign flickers, understanding the pattern is key:

- Does the whole sign flicker or just one section?
- Does the light cut out completely or just change brightness?
- Is the issue constant or intermittent?
- Is there a link to rain, wind, time of day, or building electrical load?
- Has the situation changed over time?

These clues narrow the search to the power supply, cable run, connections, moisture, controller, or LED modules.

---

## Diagnosis by flicker pattern

| What you see | What to check first |
|---|---|
| Entire sign flickers at once | Power supply, mains voltage, breaker, timer, main terminal, system overload |
| One letter or section flickers | Local connection, inter-letter cable, individual supply line, LED module, polarity |
| Light cuts out completely for a moment | Power supply going into protection, overload, overheating, loose contact, or unstable mains |
| Flickering gets worse after rain | Moisture, condensation, corrosion, unsealed connections, openings in the housing |
| Flickering only at startup | Inrush current, ageing power supply, unstable driver, line overload |
| Flickering appears in the evening or at night | Voltage sag, shared circuit with other building equipment, building load, timer or relay |
| End of a letter or long section is dimmer | Voltage drop on the line, too many modules in series, cable cross-section too small |
| Flicker visible only on camera | May be a frame-rate artefact, PWM regulation, or driver effect — if invisible to the naked eye, not necessarily a fault |
| Light gets brighter and dimmer in waves | Unstable power supply, loose contact, component degradation, overheating, or voltage drop |

---

## Main causes of flickering

### 1. Undersized power supply

The power supply must match not just the total LED wattage, but also the system voltage, cable lengths, wiring layout, and operating conditions.

For example, if the backlight draws about 100 W and the installed driver is rated at 90 W, the system is running overloaded. In this situation the sign may not just glow dimly — the driver can overheat, sag its output voltage, shut down briefly, or cycle between on and off.

Even when the driver is close to the required wattage, running it at its limit is poor practice. Stable operation needs headroom and correct matching for voltage, current, load type, IP rating, and temperature range.

### 2. Power supply going into protection

Many drivers have built-in protection against overload, short circuits, and overheating. When the system exceeds safe parameters, the driver may temporarily shut off its output and then attempt to restart. This cycling is not normal operation.

### 3. Power supply ageing

Even a properly sized driver loses stability over time. The electrolytic capacitors and other components inside operate under heat, current ripple, and on/off cycles. Their performance degrades with age.

### 4. Voltage drop on a long cable run

In outdoor signs, the power supply may be mounted well away from the letters. Voltage is lost across cables, terminals, and connections. The longer the run, the higher the current, and the thinner the cable, the greater the voltage drop.

### 5. Loose connections

Loose contacts are one of the most common causes of flickering. The connection does not have to be fully broken — an intermittent contact that comes and goes is enough.

### 6. Moisture, condensation, and corrosion

If the flickering started after rain, snow, facade cleaning, or a sudden temperature change, moisture should be investigated. Outdoor signs can suffer not only from direct water ingress but also from condensation forming inside the housing.

### 7. Faulty LED driver, controller, timer, or dimmer

Some signs have additional electronics between the power supply and the LEDs. Flickering can occur when these components are incompatible or failing.

### 8. Damaged or aged LED modules

If only individual letters, segments, or spots flicker rather than the whole sign, the cause may be local LED component damage.

### 9. Mains supply problems

Sometimes the cause of flickering is not inside the sign at all, but in the building's power supply.

---

## What you can safely check yourself

Before contacting a service provider, you can gather information that speeds up the diagnosis. You do not need to open the sign, access the power supply, or touch any wiring.

- Does the whole sign flicker or just one letter?
- Is the flicker constant or intermittent?
- Does the light cut out completely or just change brightness?
- Did the problem appear suddenly or has it been getting worse over time?
- Was there a link to rain, snow, wind, facade cleaning, or a power event?
- Is there any smell of overheating, sparks, crackling, or noticeable heat?
- Are other devices on the same circuit running normally?

A short video is extremely helpful. Two clips are ideal: a wide shot of the whole sign and a close-up of the affected letter or section.

---

## What to avoid

- Opening the sign housing while it is powered
- Touching wet components
- Moving cables while the supply is on
- Swapping the power supply for "a similar one" without calculating the load
- Fitting a higher-wattage driver without checking the circuit and protection
- Joining wires with twist connectors without proper terminals and sealing
- Bypassing safety devices
- Continuing to run the sign if there is a smell of burning, sparks, strong heat, or a tripped breaker

---

## When to act immediately

Disconnect the sign and call a specialist if you see: sparks, a burning or plastic smell, crackling, strong housing heat, water inside the structure, a tripped breaker, complete blackout after flickering, a damaged cable, discoloured terminals or wiring, or flickering after a thunderstorm.

---

## How PixelRing typically diagnoses the problem

Initial assessment often starts remotely. From photos, video, and a description, we can usually narrow down where the fault is most likely hiding.

1. Flicker pattern — does the whole sign flicker in sync or just one section.
2. When the problem started — after rain, wind, frost, a power event, or without any obvious trigger.
3. What exactly the light does — pulses, changes brightness, cuts out briefly.
4. Power supply accessibility — whether the rating plate can be safely read.
5. Connection condition — any signs of moisture, corrosion, or overheating.
6. Overload probability — whether the driver matches the actual load.
7. Voltage drop — whether the cable run is too long.
8. Controller and timer operation.

---

## How the problem is typically resolved

The fix depends on the cause. Possible solutions include: power supply replacement, load splitting, terminal restoration, cable replacement, joint re-sealing, voltage-drop correction, replacing damaged LED modules, driver or controller replacement, and housing repair.

---

## What to send PixelRing for a fast assessment

- A short video of the flickering
- A photo of the full sign
- A close-up of the affected letter or section
- Whether the whole sign or just part of it is affected
- When the problem started
- Whether there was a link to rain, wind, frost, a thunderstorm, or a power event
- A photo of the power supply and its rating label, if safely accessible
- The site address and mounting height

---

## Related issues

- Sign is completely dark
- Only some letters are lit
- Sign shuts down after rain
- LED backlight has become dim
- One letter is noticeably weaker`;

const article = {
  locale: 'en',
  type: 'SYMPTOM',
  status: 'PUBLISHED',
  slug: 'flicking',
  title: 'Sign flickers',
  symptomLabel: 'The light is unstable, flickers, pulses, or cuts out briefly.',
  shortAnswer,
  content,
  seoTitle: 'Flickering sign: causes, diagnosis, and what to do | PixelRing',
  seoDescription: 'Why is your sign flickering? Power supply, contacts, moisture, LED modules — how to identify the cause and when you need urgent repair. PixelRing.',
  canonicalUrl: '/en/probleme-loesungen/werbeanlage-flackert',
  relatedSlugs: ['no-light', 'uneven-light', 'rain-fail'],
  causes,
  safeChecks,
  urgentWarnings,
  serviceProcess,
  workScopeFactors,
  ctaLabel: 'Send a photo',
  ctaHref: '/en#contact',
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
    console.log(JSON.stringify({ seed: 'article-flicker-en', slug: 'flicking', locale: 'en', status: 'OK' }));
  } finally {
    await client.end();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
