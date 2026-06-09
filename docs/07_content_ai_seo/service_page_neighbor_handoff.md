# Neighbor Service Page Handoff

Purpose: give the next agent a practical implementation guide for applying the successful `/[locale]/leistungen/werbeanlagen-reparatur` (страница услуги ремонта рекламных конструкций) structure to neighboring service pages (соседние страницы услуг), without copying the repair calculator (калькулятор ремонта).

Use this together with `service_page_pattern_werbeanlagen_reparatur.md` (шаблон страницы услуги ремонта).

## Target Pages

Priority neighboring service pages (соседние страницы услуг):

1. `/[locale]/leistungen/lichtwerbung-led-modernisierung` (LED-модернизация)
2. `/[locale]/leistungen/werbeanlagen-audit-diagnose` (аудит и диагностика рекламных конструкций)
3. `/[locale]/leistungen/montage-demontage-werbeanlagen` (монтаж и демонтаж рекламных конструкций)
4. `/[locale]/leistungen/druckprodukte-branding-werbematerialien` (печать, брендинг и рекламные материалы)

## Required Page Shape

Each neighboring service page (соседняя страница услуги) should follow this shape:

1. Hero (первый экран)
2. Service-specific problem/task cards (карточки задач или проблем конкретной услуги)
3. `Passende Problemseiten` or `Passende Themen` (подходящие страницы проблем или темы)
4. Service scope (объем услуги)
5. Optional service-specific interactive block (опциональный интерактивный блок конкретной услуги)
6. What is included / request checklist (что входит и чеклист заявки)
7. FAQ (частые вопросы)
8. `NEXT STEP` (следующий шаг) decision block
9. Structured data (структурированные данные)

Do not add the repair-cost calculator (калькулятор стоимости ремонта) unless a new calculator is designed specifically for that service.

## Service-Specific Adaptation

### LED-Modernisierung (LED-модернизация)

Primary intent: modernization and repair of lighting systems (модернизация и ремонт подсветки).

Possible task cards:
- uneven brightness (неравномерная яркость);
- old neon conversion (замена старого неона);
- power supply/controller issue (проблема блока питания или контроллера);
- color temperature mismatch (разный цвет свечения);
- high energy use (высокое энергопотребление).

Possible problem links:
- `Werbeanlage flackert` (вывеска мерцает);
- `Buchstabe leuchtet nicht` (буква не светится);
- `Werbeanlage leuchtet ungleichmäßig` (вывеска светится неравномерно), if this page exists or is planned.

Related services for `NEXT STEP` (следующий шаг):
- `Werbeanlagen-Reparatur` (ремонт рекламных конструкций);
- `Audit & Diagnose` (аудит и диагностика);
- `Montage & Demontage` (монтаж и демонтаж).

Potential `hasOfferCatalog` (каталог подуслуг):
- LED-Modul-Austausch (замена LED-модулей);
- Netzteil-Prüfung (проверка блока питания);
- Neon-zu-LED-Umrüstung (переход с неона на LED);
- Helligkeits- und Farbcheck (проверка яркости и цвета);
- Controller-Prüfung (проверка контроллера).

### Audit & Diagnose (аудит и диагностика)

Primary intent: structured inspection before repair, maintenance, or multi-location decisions (структурированная проверка перед ремонтом, обслуживанием или решениями по нескольким локациям).

Possible task cards:
- unknown defect (непонятная неисправность);
- multiple locations (несколько локаций);
- safety risk (риск безопасности);
- maintenance planning (планирование обслуживания);
- pre-repair assessment (оценка перед ремонтом).

Possible problem links:
- `Werbeanlage flackert` (вывеска мерцает);
- `Werbeanlage schaltet nach Regen ab` (вывеска отключается после дождя);
- `Buchstabe leuchtet nicht` (буква не светится);
- selected future inspection topics (будущие темы диагностики), only when real pages exist.

Related services for `NEXT STEP` (следующий шаг):
- `Werbeanlagen-Reparatur` (ремонт рекламных конструкций);
- `LED-Modernisierung` (LED-модернизация);
- `Montage & Demontage` (монтаж и демонтаж);
- `Druck & Branding` (печать и брендинг), if visual brand condition is part of the audit.

Potential `hasOfferCatalog` (каталог подуслуг):
- Sichtprüfung (визуальная проверка);
- Foto- und Symptombewertung (оценка фото и симптомов);
- Standort-Audit (аудит локации);
- Sicherheits- und Befestigungscheck (проверка безопасности и креплений);
- Prioritätenreport (отчет с приоритетами).

### Montage & Demontage (монтаж и демонтаж)

Primary intent: planned installation, removal, relocation, and access coordination (плановый монтаж, демонтаж, перенос и координация доступа).

Possible task cards:
- new mounting (новый монтаж);
- dismantling after relocation/closure (демонтаж после переезда или закрытия);
- relocation of existing signage (перенос существующей вывески);
- loose mounting (ослабленное крепление);
- access/lift planning (планирование доступа или подъемника).

Possible problem links:
- `Buchstabe leuchtet nicht` (буква не светится), only if access/removal is part of repair;
- `Werbeanlage schaltet nach Regen ab` (вывеска отключается после дождя), if sealing/access matters;
- future pages about loose mounting or storm damage (будущие страницы об ослабленном креплении или повреждении после шторма), when created.

Related services for `NEXT STEP` (следующий шаг):
- `Werbeanlagen-Reparatur` (ремонт рекламных конструкций);
- `Audit & Diagnose` (аудит и диагностика);
- `Druck & Branding` (печать и брендинг), if replacement surfaces/materials are part of the work.

Potential `hasOfferCatalog` (каталог подуслуг):
- Montageplanung (планирование монтажа);
- Demontage (демонтаж);
- Standortwechsel (перенос локации);
- Befestigungsprüfung (проверка креплений);
- Zugang und Hebetechnik (доступ и подъемная техника).

### Druck & Branding (печать и брендинг)

Primary intent: visible brand materials, films, print data, and location branding (видимые бренд-материалы, пленки, печатные данные и оформление локаций).

Possible task cards:
- peeling film (отклеивающаяся пленка);
- faded graphics (выцветшая графика);
- new storefront lettering (новая надпись на витрине);
- campaign material update (обновление промо-материалов);
- multi-location material consistency (единые материалы для нескольких локаций).

Possible problem links:
- `Folie löst sich` (пленка отклеивается);
- future pages about faded print or damaged lettering (будущие страницы о выцветшей печати или поврежденных надписях), when created.

Related services for `NEXT STEP` (следующий шаг):
- `Werbeanlagen-Reparatur` (ремонт рекламных конструкций), if the visual defect is part of damaged signage;
- `Audit & Diagnose` (аудит и диагностика), if several assets or locations need review;
- `Montage & Demontage` (монтаж и демонтаж), if installation/removal is required.

Potential `hasOfferCatalog` (каталог подуслуг):
- Folien und Beschriftung (пленки и надписи);
- Druckdatenprüfung (проверка печатных данных);
- Poster und Banner (постеры и баннеры);
- Standort-Branding (брендинг локации);
- Materialversorgung für Filialen (обеспечение материалами филиалов).

## Implementation Checklist

Before editing:
- read `PROGRESS.md` (глобальный журнал прогресса);
- read `signage-service/AGENTS.md` (правила для Next.js-приложения);
- inspect `signage-service/package.json` (команды и зависимости);
- inspect the target service page (целевая страница услуги);
- check current URLs in `src/lib/seo.ts` (sitemap / карта сайта) and `src/app/[locale]/leistungen/[slug]/page.tsx`.

When implementing:
- keep German canonical first (немецкий как основной язык);
- localize DE/EN/RU/TR/PL/AR (немецкий/английский/русский/турецкий/польский/арабский);
- keep Arabic RTL-safe (арабский с поддержкой направления справа налево);
- add `Passende Problemseiten` (подходящие страницы проблем) only to real, `200 OK` URLs;
- add `NEXT STEP` (следующий шаг) with request path (заявка) and related-service path (соседние услуги);
- update `Service` JSON-LD (структурированные данные Service) with service-specific `hasOfferCatalog` (каталог подуслуг);
- do not copy repair calculator (калькулятор ремонта);
- do not create marketplace/directory wording (маркетплейс или каталог подрядчиков).

Verification:
- targeted lint (точечная lint-проверка) for edited files;
- rendered HTML check (проверка отрендеренного HTML);
- verify new internal links return `200 OK` (успешный ответ страницы);
- verify one H1 (один главный заголовок);
- verify meta description length (длина SEO-описания);
- verify JSON-LD parse and `hasOfferCatalog` (каталог подуслуг);
- mobile overflow check (проверка горизонтального переполнения на мобильном), especially DE long words and AR RTL (арабский справа налево).

## Suggested Next Agent Starting Point

If the next agent is asked to strengthen neighboring service pages (соседние страницы услуг), start with:

1. `docs/07_content_ai_seo/service_page_pattern_werbeanlagen_reparatur.md` (эталонный шаблон страницы ремонта)
2. `docs/07_content_ai_seo/service_page_neighbor_handoff.md` (инструкция по соседним страницам услуг)
3. `signage-service/src/app/[locale]/leistungen/werbeanlagen-reparatur/page.tsx` (реализация эталона)
4. `signage-service/src/app/[locale]/leistungen/[slug]/page.tsx` (текущие соседние страницы услуг)

Then choose one target page and apply the pattern surgically.
