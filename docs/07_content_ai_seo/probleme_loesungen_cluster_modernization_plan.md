# Probleme & Lösungen Cluster Modernization Plan

Status: active planning document.

Date: 2026-06-13

Primary source: [PixelRing Content Cluster Audit 2026-06-12](source_audits/pixelring_content_cluster_audit_2026-06-12.md).

Scope: `/[locale]/probleme-loesungen` (`Probleme & Lösungen` - проблемы и решения), its current problem articles, related service pages, and future research-backed articles.

This document turns the independent audit into a step-by-step modernization backlog. It does not authorize implementation by itself. Follow the project collaboration rule: read the relevant code or draft, explain the intended change, propose the concrete action, wait for owner confirmation, then edit.

## Operating Rules

- German is canonical-first. Public wording for Germany must use real German spelling, not ASCII transliteration such as `Waehlen` instead of `Wählen` (выбрать).
- PixelRing must remain one accountable service company, not a marketplace, contractor directory, or listing platform.
- Safety-sensitive topics must not become dangerous DIY instructions.
- Problem articles must follow [problem article rules](problem_article_rules.md) and [problem article content model](problem_article_content_model.md).
- New or updated problem articles must include three forms: small card, modal, and full article.
- `selfRepairTips` (советы по самостоятельному ремонту) is mandatory for CMS/database publication.
- Do not create CMS rows, seed scripts, sitemap entries, or public routes until markdown drafts are owner-reviewed.
- Use real or honestly anonymized cases only. Do not invent fake project proof.
- If an audit recommendation duplicates an existing route, strengthen the existing route first instead of creating a duplicate URL.

## Current Baseline

### Existing Hub

- Route: `/[locale]/probleme-loesungen` (`Probleme & Lösungen` - проблемы и решения).
- Current role: symptom hub for customers who know what is visibly wrong but do not know the service category.
- Current DE H1: `Typische Probleme mit Werbeanlagen erkennen und richtig lösen` (распознать типичные проблемы рекламных конструкций и правильно решить).
- Current issue from the audit: the hub is a good symptom directory, but not yet a full pillar page for Berlin/Brandenburg diagnosis and repair.

### Current Problem Article State

Nine current public problem article slots:

| CMS slug | Public URL slug | Current content status | Modernization status |
|---|---|---|---|
| `no-light` | `werbeanlage-leuchtet-nicht` | Strong full article in DE/EN/RU/TR/PL/AR | Strengthen local/CRO/AI blocks |
| `flicking` | `werbeanlage-flackert` | Strong DE/EN/RU, missing TR/PL/AR | Complete locales and fix EN typo |
| `uneven-light` | `led-leuchtet-ungleichmaessig` | Strong full article in DE/EN/RU/TR/PL/AR | Add visual taxonomy and local block |
| `letter-out` | `buchstabe-leuchtet-nicht` | Strong full article in DE/EN/RU/TR/PL/AR | Add Leuchtbuchstaben service links |
| `rain-fail` | `werbeanlage-schaltet-nach-regen-ab` | Strongest current article | Add emergency CTA, cases, images |
| `peeling-film` | `folie-loest-sich` | Strong full article in DE/EN/RU/TR/PL/AR | Add local/commercial and visual proof |
| `faded-film` | `folie-ist-ausgeblichen` | Thin DE/EN/RU, missing TR/PL/AR | Rewrite fully |
| `shaky-sign` | `werbeanlage-wackelt` | Thin DE/EN/RU, missing TR/PL/AR | Rewrite fully |
| `urgent-repair` | `dringende-reparatur-werbeanlage` | Thin DE/EN/RU, missing TR/PL/AR | Rewrite fully as emergency page |

## Workstream P0: Quick QA, CRO, And Technical SEO Foundation

Goal: fix obvious trust and extraction issues before broad content expansion.

Do only after inspecting the rendered page/code and receiving owner confirmation for the specific slice.

| Task | Target | Action | Verification |
|---|---|---|---|
| German QA pass | Hub and articles | Replace stray Russian word `или` (или) and ASCII German transliterations such as `Waehlen` (выбрать), `noetig` (нужно), `oeffnen` (открыть), `klaert` (проясняет) where they are public-facing German copy | Browser text check on `/de/probleme-loesungen` and article pages |
| CTA sharpening | Hub and articles | Test stronger CTA pattern: `Foto senden - erste Einschätzung für Berlin & Brandenburg erhalten` (отправить фото и получить первичную оценку для Берлина и Бранденбурга) | CTAs visible, no layout overflow |
| Local block template | Article pages | Add compact Berlin/Brandenburg service block where it fits naturally | One block per article, no duplicate stuffing |
| Article metadata/schema | Article template | Add or verify `Article` (структурированные данные статьи), `BreadcrumbList` (хлебные крошки), `datePublished` (дата публикации), `dateModified` (дата обновления) when data is available | JSON-LD parses and matches visible content |
| Table rendering check | Article body | Ensure markdown tables render as real HTML tables, not visually merged text | Inspect DOM for `<table>` |
| Author/reviewer/date pattern | Article template/content | Design a visible trust block before adding globally | Owner approval before rollout |

## Workstream P1: Rewrite The Three Weak Current Articles

Goal: bring the weakest pages up to the current problem-article standard before creating many new pages.

### P1.1 `dringende-reparatur-werbeanlage`

Target: `Dringende Reparatur erforderlich` (срочный ремонт требуется).

Plan:

1. Rewrite as an emergency landing article, not a generic note.
2. Add `Sofort handeln` (действовать сразу) block with safe steps.
3. Add `Symptom -> Risiko -> Handlung` (симптом -> риск -> действие) table.
4. Add Berlin/Brandenburg service block.
5. Add explicit emergency CTA: `Dringenden Fall melden` (сообщить о срочном случае).
6. Add safe request checklist: address, mounting height, pedestrian risk, electricity/FI, water, photos/video.
7. Add `selfRepairTips` (советы по самостоятельному ремонту) as safety-bounded guidance, not repair instruction.

Do not:

- promise emergency availability that operations cannot support;
- imply exact response time unless verified;
- teach electrical or height work;
- call the page `Notdienst` (аварийная служба) unless owner confirms that service promise.

### P1.2 `werbeanlage-wackelt`

Target: `Werbeanlage wackelt` (рекламная конструкция шатается).

Plan:

1. Rewrite as safety and repair article.
2. Add risk triage for loose parts, wind, facade damage, corrosion, mounting height, pedestrian area.
3. Add `Nicht selbst befestigen` (не крепить самостоятельно) safety block.
4. Add `Was PixelRing prüft` (что проверяет PixelRing): fixing points, substructure, facade, corrosion, access, dismantling need.
5. Add Berlin/Brandenburg and B2B owner/audiences: shops, property managers, retail chains, centers.
6. Add storm-damage angle without duplicating future `Sturmschaden` (повреждение после шторма) article.

Do not:

- give DIY mounting instructions;
- imply PixelRing can take over building-owner safety responsibility before inspection;
- invent storm cases.

### P1.3 `folie-ist-ausgeblichen`

Target: `Folie ist ausgeblichen` (пленка выцвела).

Plan:

1. Rewrite as visual replacement/refresh article.
2. Explain UV damage, dirt, laminate damage, material aging, print mismatch, backlit film and brand consistency.
3. Add `Ausbleichung vs. Verschmutzung vs. Ablösung` (выцветание против загрязнения против отклеивания) comparison.
4. Add `Teilfläche oder Komplettwechsel?` (частичный участок или полная замена) decision block.
5. Add Berlin/Brandenburg commercial block for storefronts, lightboxes, doors, branch branding.
6. Add cost-factor table without fixed prices.
7. Add internal links to `folie-loest-sich` (пленка отклеилась) and relevant Druck & Branding service context.

Do not:

- overpromise exact color match after partial replacement;
- treat cleaning as a guaranteed solution;
- skip visual examples when real assets become available.

## Workstream P2: Strengthen Current Winners

Goal: improve lead conversion, local SEO, and AI extraction on already strong articles.

| Priority | Page | Primary improvement |
|---|---|---|
| P2.1 | `werbeanlage-schaltet-nach-regen-ab` | Add emergency CTA, expanded FAQ, water ingress table, Berlin/Brandenburg, real or anonymized case |
| P2.2 | `werbeanlage-leuchtet-nicht` | Add local repair framing, cost factors, stronger photo CTA, case/example |
| P2.3 | `werbeanlage-flackert` | Fix EN typo `culpr2its`, add TR/PL/AR, add camera-effect vs real fault, FAQ, local block |
| P2.4 | `buchstabe-leuchtet-nicht` | Add Leuchtbuchstaben repair service links, types of letters, cost factors, case |
| P2.5 | `led-leuchtet-ungleichmaessig` | Add visual taxonomy, `Lichtbild -> Ursache -> Lösung` (световая картина -> причина -> решение), before/after when assets exist |
| P2.6 | `folie-loest-sich` | Add local commercial block, `Nacharbeit vs. Neuverklebung` (доработка против новой оклейки), FAQ and images |

## Workstream P3: Service And Money Pages

Goal: cover commercial local intent without duplicating existing routes.

Audit recommendations must be reconciled with current routes.

| Audit topic | Existing route/status | Plan |
|---|---|---|
| `Werbeanlagen Reparatur in Berlin & Brandenburg` (ремонт рекламных конструкций в Берлине и Бранденбурге) | Existing: `/leistungen/werbeanlagen-reparatur` | Strengthen existing page first; do not create duplicate money page |
| `LED-Umrüstung von Werbeanlagen` (переход рекламных конструкций на LED) | Existing: `/leistungen/lichtwerbung-led-modernisierung` | Continue from [LED service plan](service_page_led_modernisierung_plan.md) and owner review |
| `Montage und Demontage von Werbeanlagen` (монтаж и демонтаж рекламных конструкций) | Existing: `/leistungen/montage-demontage-werbeanlagen` | Apply [neighbor service page handoff](service_page_neighbor_handoff.md) after approval |
| `Audit & Diagnose` (аудит и диагностика) | Existing: `/leistungen/werbeanlagen-audit-diagnose` | Strengthen as diagnostic/service bridge |
| `Druck & Branding` (печать и брендинг) | Existing: `/leistungen/druckprodukte-branding-werbematerialien` | Use for film, print, storefront and branch-material links |
| `Kosten der Werbeanlagen-Reparatur` (стоимость ремонта рекламных конструкций) | Not a dedicated route | Plan as commercial-investigation page only after cost wording is approved |
| `Wartung von Werbeanlagen` (обслуживание рекламных конструкций) | Partial context exists in services | Plan after service-contract claims and scope are approved |

## Workstream P4: New Research-Backed Problem Articles

These are separate from rewriting the current nine problem pages.

### Confirmed Future Tracks

1. `Leuchtstoffröhren in der Werbeanlage ersetzen oder auf LED umrüsten?` (заменить люминесцентные трубки в рекламной установке или перейти на LED)
   - Existing draft: [RU draft](<problem_articles/люминесцентные трубки или led – 07/problem_article_leuchtstoffroehren_werbeanlage_ersetzen_led_umruesten_ru.md>)
   - Status: RU review draft exists; no CMS/database/route/seed work.
   - Next: after owner approval, prepare German canonical draft.

2. `Neonreklame reparieren oder auf LED umrüsten?` (ремонтировать неоновую рекламу или перейти на LED)
   - Existing brief: [future LED modernization articles brief](<problem_articles/входящие новые статьи/led_modernisierung_future_problem_articles.md>)
   - Status: planning brief only.
   - Next: create markdown draft only after owner starts this article track.

### Candidate Third Track From The Audit

The independent audit proposes several high-value emergency/diagnosis topics. One candidate should be selected by the owner before drafting:

| Candidate | Why it may be the third track | Dependency |
|---|---|---|
| `Werbeanlage Sicherung fliegt: Ursachen und sichere nächste Schritte` (выбивает автомат у рекламной конструкции: причины и безопасные следующие шаги) | Strong overlap with rain, FI/RCD and emergency intent | Must avoid duplicating `rain-fail` (отказ после дождя) |
| `FI-Schalter löst bei Leuchtreklame aus` (УЗО/FI срабатывает у световой рекламы) | High safety and AI-search intent | Needs careful Germany electrical-safety wording |
| `Netzteil der Werbeanlage defekt` (неисправен блок питания рекламной конструкции) | High diagnostic/commercial intent | Must not teach power-supply replacement |
| `Feuchtigkeit im Leuchtkasten` (влага в световом коробе) | Strong support article for rain and lightbox repair | Needs source-backed water ingress research |

Do not treat any candidate as approved until the owner selects it.

## Research Request Workflow

When the owner starts a new article:

1. Codex creates a research request for a separate research agent.
2. The owner gives that request to the research agent.
3. The research agent returns a source-backed markdown file.
4. Codex reads the returned markdown, then writes or completes the PixelRing problem article draft.
5. The owner reviews the draft.
6. Only after approval do we consider localization, CMS sync, seed scripts, sitemap, and route verification.

### Research Request Must Ask For

- Official or technically responsible sources, not random SEO blogs.
- Germany/EU safety context where relevant.
- Manufacturer documentation for power supplies, LED modules, controllers, film materials, neon, or fluorescent systems when relevant.
- Practical diagnostic distinctions: what the customer sees, what a professional checks, what must not be done by the customer.
- Safe customer actions only: photos, videos, external observations, normal switch/breaker/timer checks where safe.
- Forbidden guidance: opening housings, wiring, terminals, power supplies, tubes, transformers, height work, temporary fixes.
- Suggested internal links to current service and problem pages.
- Source notes for internal AI use, not public citation clutter.

### Research Request Template

```text
Prepare source-backed research for a PixelRing problem article.

Topic:
[article title]

Market and language:
Germany, canonical German public article, owner-facing notes can be Russian.

Business context:
PixelRing is one accountable service company for signage repair, light advertising, LED modernization, installation/dismantling, branding materials, and related B2B service requests. It is not a marketplace or contractor directory.

Output:
Return a markdown research file with:
1. customer-visible symptoms;
2. likely cause categories, cautiously worded;
3. safe checks without opening, wiring, height work, or dangerous DIY;
4. urgent warning signs;
5. what a qualified specialist would check;
6. repair/modernization paths;
7. what the customer should send for first assessment;
8. internal source notes with official/manufacturer/technical sources;
9. claim boundaries and forbidden wording.

Do not write public copy yet. Do not invent cases. Do not give step-by-step electrical, mounting, tube, transformer, power-supply, or height-work instructions.
```

## 90-Day Sequencing

### Days 1-15: Foundation

- Fix German QA defects.
- Decide CTA pattern.
- Verify HTML table rendering.
- Plan article trust block and schema changes.
- Confirm first weak article to rewrite.

### Days 16-35: Weak Article Rewrites

- Rewrite `urgent-repair` (срочный ремонт).
- Rewrite `shaky-sign` (шатается вывеска).
- Rewrite `faded-film` (выцвела пленка).
- Prepare owner review checklist for each article.

### Days 36-55: Winner Strengthening

- Strengthen `rain-fail` (отказ после дождя).
- Strengthen `no-light` (не светится).
- Strengthen `flicking` (мерцает).
- Strengthen `letter-out` (не светится буква).

### Days 56-75: Service/Money Pages

- Strengthen existing repair service page instead of creating a duplicate.
- Strengthen LED modernization after owner visual review.
- Plan cost/effort page only after claim boundaries are approved.

### Days 76-90: Authority And Measurement

- Add approved mini-cases and real photos.
- Add internal links across symptom, service, reference, and request surfaces.
- Track Search Console and AI-search visibility manually.
- Track conversions by CTA path: WhatsApp, form, phone, service start.

## Open Decisions

- Which article is the third new research-backed track after fluorescent tubes and neon?
- Should emergency wording use `Notdienst` (аварийная служба), or should we keep safer wording such as `dringenden Fall melden` (сообщить о срочном случае)?
- Where should author/reviewer/date appear visually in the current article layout?
- Which real/anonymized cases and photos are available for public use?
- Should the hub H1 be changed to include Berlin/Brandenburg, or should local relevance stay in H2/body/CTA to avoid overloading the headline?

