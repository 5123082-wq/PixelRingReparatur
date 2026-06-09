# LED-Modernisierung Service Page Plan

Status: active implementation plan.

Date: 2026-06-02

Scope: `/[locale]/leistungen/lichtwerbung-led-modernisierung` (страница услуги LED-модернизации световой рекламы).

Primary source: `pixelring_market_research_led_modernisierung_de.md` (исследование рынка LED-модернизации), current page review, existing service-page pattern from `service_page_pattern_werbeanlagen_reparatur.md`, and current problem article rules.

## Purpose

This document fixes the next implementation plan for strengthening `LED-Modernisierung` (LED-модернизация). The first implementation task is the service page itself. The two future problem articles (статьи "Проблемы и решения") are recorded as backlog and must not be written or seeded until the owner explicitly starts that track.

The page must not become a generic LED sales page. It should present PixelRing as one accountable technical service company that checks existing illuminated signage and decides the sensible next step: `Reparatur` (ремонт), `Teilmodernisierung` (частичная модернизация), `LED-Umrüstung` (переход на LED), or `Ersatzlösung` (замена).

## Current Baseline

Current implementation lives in `signage-service/src/app/[locale]/leistungen/[slug]/page.tsx`.

The existing LED page already has:

- one H1 (один главный заголовок);
- photo hero via the common service-detail template;
- CTA row with request button and services overview link;
- four task cards;
- checks block;
- process block;
- clear-frame block;
- two FAQ items;
- related service links;
- generic final CTA.

Current gaps:

- no `Passende Problemseiten` (подходящие страницы проблем) block;
- no service-specific `NEXT STEP` (следующий шаг) decision block;
- related services do not include `Werbeanlagen-Reparatur` (ремонт рекламных конструкций), because the generic related block only lists sibling dynamic pages;
- `Service` JSON-LD (структурированные данные услуги) has no LED-specific `hasOfferCatalog` (каталог подуслуг);
- FAQ is too thin for customer decision and AI/GEO readiness;
- page does not clearly distinguish modernization of existing lighting from generic repair or new-sign production.

## Positioning

Canonical German positioning:

```text
PixelRing modernisiert bestehende Lichtwerbung technisch nachvollziehbar: LED-Module, Netzteile, Trafos, Controller, Neon, Leuchtkästen, Verkabelung und Lichtbild werden geprüft. Ziel ist nicht der vorschnelle Austausch, sondern der sinnvolle nächste Schritt: Reparatur, Teilmodernisierung oder Ersatzlösung.
```

Russian explanation: PixelRing не продает LED как товар и не обещает автоматическую замену. Страница должна показывать диагностический сервис: сначала проверить старую подсветку, затем решить, что сохранить, что модернизировать, а что заменить.

Recommended H1:

```text
Modernisierung von Lichtwerbung & LED-Systemen in Berlin & Brandenburg
```

Recommended meta title:

```text
Lichtwerbung & LED modernisieren Berlin | PixelRing
```

Recommended hero copy:

```text
Bestehende Leuchtwerbung muss nicht automatisch ersetzt werden. PixelRing prüft LED-Module, Netzteile, Trafos, Controller, Neon, Leuchtkästen, Verkabelung und Lichtbild - und klärt, ob Reparatur, Teilmodernisierung oder eine Ersatzlösung der sinnvolle nächste Schritt ist.
```

Recommended primary CTA:

```text
Fotos senden und LED-Einschätzung erhalten
```

Recommended secondary CTA:

```text
Reparatur statt Austausch prüfen
```

Optional trust line:

```text
Keine Vermittlungsplattform: eine Anfrage, ein zentraler Ansprechpartner, ein nachvollziehbarer Serviceprozess.
```

## Implementation Plan

### 1. Tighten Hero and Metadata

Goal: make the first viewport explain the exact service in 5 seconds.

Actions:

- update DE canonical H1 to include Berlin & Brandenburg;
- make hero text about existing illuminated signage, not generic LED systems;
- change primary CTA to photo/video based technical assessment;
- keep German canonical first, then localize EN/RU/TR/PL/AR carefully;
- keep meta description short enough and avoid hard savings claims.

Do not:

- promise fixed energy savings;
- promise fixed payback;
- imply PixelRing manufactures all components in-house;
- imply immediate same-day repair.

### 2. Replace Generic Task Cards With LED-Modernization Tasks

Use 5 or 6 cards, not 8, to keep the page lean.

Recommended DE cards:

1. `Leuchtreklame auf LED umrüsten` (перевести световую рекламу на LED)
2. `Leuchtkasten LED nachrüsten` (дооснастить световой короб LED)
3. `Neon erhalten oder LED-Alternative prüfen` (сохранить неон или проверить LED-альтернативу)
4. `Ungleichmäßige Ausleuchtung verbessern` (улучшить неравномерную подсветку)
5. `LED-Module, Netzteile und Controller prüfen` (проверить LED-модули, блоки питания и контроллеры)
6. Optional: `Lichtbild und Markenwirkung verbessern` (улучшить световой образ и восприятие бренда)

The cards should remain service-task cards, not full problem articles.

### 3. Add `Passende Problemseiten`

Position: directly after task cards, mirroring the repair-page pattern.

Use only real 200 OK pages.

Recommended first pass:

- `Werbeanlage flackert` (вывеска мерцает) -> `/probleme-loesungen/werbeanlage-flackert`
- `LED leuchtet ungleichmäßig` (LED светит неравномерно) -> `/probleme-loesungen/led-leuchtet-ungleichmaessig`
- `Buchstabe leuchtet nicht` (буква не светится) -> `/probleme-loesungen/buchstabe-leuchtet-nicht`
- `Werbeanlage leuchtet nicht` (вывеска не светится) -> `/probleme-loesungen/werbeanlage-leuchtet-nicht`

Avoid adding too many links. `Werbeanlage schaltet nach Regen ab` (вывеска отключается после дождя) can be linked later if the block needs a fifth item, but the LED page should not become a general repair hub.

### 4. Strengthen Checks and Scope

The current checks are directionally right but should include the concrete modernization checks from research:

- `Stromversorgung, Netzteile, Trafos und Sicherungen` (питание, блоки питания, трансформаторы и автоматы)
- `LED-Module, LED-Bänder, Neonröhren und Lichtfarbe` (LED-модули, LED-ленты, неоновые трубки и цвет света)
- `Controller, Sensoren, Timer, Dimmer und Verkabelung` (контроллеры, датчики, таймеры, диммеры и проводка)
- `Gehäuse, Dichtungen, Feuchtigkeit und Korrosion` (корпус, уплотнения, влага и коррозия)
- `Lichtbild, Helligkeit, Schatten und Hotspots` (световой образ, яркость, тени и пятна)
- `Reparatur, Teilmodernisierung oder Ersatzlösung` (ремонт, частичная модернизация или замена)

Keep the wording practical and avoid technical overload.

### 5. Add Request Checklist

Add a compact checklist before or near the process block.

Recommended DE copy:

```text
Sie müssen keine technischen Begriffe kennen. Hilfreich sind: Gesamtfoto der Anlage, Nahaufnahme der betroffenen Stelle, kurzes Video bei Flackern, Adresse oder Stadt, Montagehöhe, Zugang zur Anlage, Alter der Anlage, Zeitpunkt des Problems und Hinweise wie Regen, Geruch, Wärme oder ausgelöste Sicherung.
```

This improves lead quality and keeps the page useful without becoming a calculator.

### 6. Expand FAQ

Use 5 or 6 FAQ items, not 12.

Recommended DE FAQ:

- `Kann eine alte Leuchtreklame auf LED umgerüstet werden?`
- `Lohnt sich die LED-Umrüstung bei einem Leuchtkasten?`
- `Kann ein Leuchtkasten modernisiert werden, ohne ihn komplett zu ersetzen?`
- `Warum flackert meine LED-Werbeanlage?`
- `Was tun bei ungleichmäßiger Ausleuchtung?`
- `Ist LED-Werbung wartungsfrei?`

Safe answer principles:

- answer with `oft`, `kann`, `hängt ab von`, `nach Prüfung`;
- do not promise exact diagnosis from photos;
- do not teach electrical DIY;
- say LED is `wartungsärmer und besser wartbar` (менее требовательна к обслуживанию и легче обслуживается), not `wartungsfrei` (не требует обслуживания).

### 7. Add Service-Specific `NEXT STEP`

Replace or complement the generic related-services section with a decision block.

Decision paths:

1. Request path:
   - title: `LED-Service konkret anfragen`
   - text: send photos/video, location, symptoms, access details.
   - CTA: `LED-Service anfragen`
2. Related service path:
   - `Werbeanlagen-Reparatur` (ремонт рекламных конструкций)
   - `Audit & Diagnose` (аудит и диагностика)
   - `Montage & Demontage` (монтаж и демонтаж)

The final generic footer CTA can stay if the page rhythm still works, but the service-specific `NEXT STEP` should carry the main decision logic.

### 8. Add LED-Specific `hasOfferCatalog`

Only add schema entries that are visibly represented on the page.

Recommended subservices:

- `Leuchtkasten LED nachrüsten`
- `LED-Module austauschen`
- `Netzteile, Trafos und Controller prüfen`
- `Neon erhalten oder LED-Alternative prüfen`
- `Lichtbild und Ausleuchtung verbessern`

Structured data must remain aligned with visible content.

## Wording Boundaries

Avoid:

- `Bis zu 80% Stromkosten sparen`
- `Amortisiert sich in 2-3 Jahren`
- `wartungsfrei`
- `Sofort vor Ort`
- `Exakter Preis nach Foto`
- `Wir reparieren jede Anlage`
- `Neon immer auf LED umrüsten`
- `Förderung verfügbar`

Prefer:

- `Je nach Anlage, Laufzeit und Zustand kann eine LED-Modernisierung den Stromverbrauch reduzieren.`
- `Auf Wunsch prüfen wir, ob eine Modernisierung wirtschaftlich sinnvoll sein kann.`
- `wartungsärmer und besser wartbar`
- `Je nach Verfügbarkeit, Zugang und Dringlichkeit prüfen wir passende Terminoptionen.`
- `Auf Basis von Fotos und Videos ist eine erste Einschätzung möglich.`
- `Wir prüfen, ob Reparatur, Teilmodernisierung oder Ersatzlösung sinnvoll ist.`

## Verification Checklist

After implementation:

- one H1 per locale;
- no mobile overflow on DE long terms and AR RTL;
- DE, EN, RU, TR, PL, AR localized;
- all `Passende Problemseiten` links return 200;
- related service links return 200;
- meta descriptions stay concise;
- JSON-LD parses and includes only visible subservices;
- `FAQPage` matches visible FAQ;
- targeted lint for edited files;
- browser visual check on desktop and mobile.

## Future Problem Articles Reference

Future `Probleme & Lösungen` (Проблемы и решения) article planning belongs in the problem-article workspace, not inside this service-page plan.

The deferred article brief is stored at:

```text
docs/07_content_ai_seo/problem_articles/входящие новые статьи/led_modernisierung_future_problem_articles.md
```

That brief records two future real-problem tracks:

- `Leuchtstoffröhren in der Werbeanlage ersetzen oder auf LED umrüsten?` (заменить люминесцентные трубки в рекламной установке или перейти на LED)
- `Neonreklame reparieren oder auf LED umrüsten?` (ремонтировать неоновую рекламу или перейти на LED)

Do not write, localize, seed, or publish these articles before owner confirmation. The first implementation task remains the service page itself.

## Sequencing

1. Modernize `/[locale]/leistungen/lichtwerbung-led-modernisierung` first.
2. Verify desktop/mobile and all locale rendering.
3. Only after owner review, start article 1 as a markdown draft.
4. After article 1 approval, decide whether article 2 should be drafted next or whether current LED page/problem-page links already cover enough.
