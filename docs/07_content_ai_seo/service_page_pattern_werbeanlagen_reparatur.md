# Service Page Pattern: Werbeanlagen-Reparatur

Purpose: preserve the working structure of `/[locale]/leistungen/werbeanlagen-reparatur` (страница услуги ремонта рекламных конструкций) so future agents can reuse the same SEO/GEO (поисковая и AI-оптимизация) logic on neighboring service pages (страницы соседних услуг).

This document describes the pattern, not a new implementation task.

## Source Page

- Route: `/[locale]/leistungen/werbeanlagen-reparatur` (страница услуги ремонта рекламных конструкций)
- Current code reference: `signage-service/src/app/[locale]/leistungen/werbeanlagen-reparatur/page.tsx`
- Primary intent: `Werbeanlagen-Reparatur` (ремонт рекламных конструкций)
- Canonical DE H1 (главный заголовок): `Werbeanlagen-Reparatur in Berlin & Brandenburg` (ремонт рекламных конструкций в Берлине и Бранденбурге)

## Pattern Summary

The page works because it does not behave like a generic catalog page (страница-каталог). It follows one clear path:

1. Hero (первый экран): state the service and region clearly.
2. Symptom workflow (интерактивный выбор симптома): let the user select a real defect and open a request drawer (форма заявки в выезжающей панели).
3. `Passende Problemseiten` (подходящие страницы проблем): link from the service page (страница услуги) to problem pages (страницы проблем).
4. Service scope (объем услуги): explain what kinds of systems and work are covered.
5. Optional calculator (калькулятор): only if the service needs a service-specific interactive estimate.
6. What the service includes (что входит в услугу): concrete work categories and request checklist (чеклист заявки).
7. FAQ (частые вопросы): answer safety, scope, process, guarantee, and trust questions.
8. `NEXT STEP` (следующий шаг): choose between request submission (оставить заявку) and related services (соседние услуги).
9. Structured data (структурированные данные): keep `Service` (услуга), `LocalBusiness` (локальный бизнес), `BreadcrumbList` (хлебные крошки), `FAQPage` (FAQ-разметка), and `hasOfferCatalog` (каталог подуслуг).

## Core Blocks

### Hero

Role: clarify service, geography, and first action.

Keep:
- one H1 (главный заголовок);
- clear service phrase in German first;
- Berlin & Brandenburg (Берлин и Бранденбург) when relevant;
- photo/description intake promise (отправить фото или описание);
- no marketplace framing (не маркетплейс) unless needed later in FAQ (частые вопросы).

Do not turn the hero into a broad services overview (обзор всех услуг).

### Symptom Workflow

Role: conversion and problem recognition.

Current repair page (страница ремонта) uses a symptom workflow (интерактивный выбор симптома) with cards that open a request drawer (форма заявки в выезжающей панели). This is a UX/conversion block, not the main SEO link block (SEO-блок перелинковки).

Important rule: do not add nested links inside the symptom cards if the card already opens a drawer (форма заявки в выезжающей панели). That creates click ambiguity.

### `Passende Problemseiten` (подходящие страницы проблем)

Role: solve the internal-linking gap (пробел внутренней перелинковки) from service pages (страницы услуг) to problem pages (страницы проблем).

Position: directly after the symptom workflow (интерактивный выбор симптома).

Why this position works:
- the user just scanned symptoms;
- Google (поисковая система Google) sees direct contextual links from service intent (намерение заказать услугу) to problem intent (намерение понять симптом);
- the interactive cards remain focused on request submission (заявка), while the link block handles SEO/GEO (поисковая и AI-оптимизация).

Current DE examples:
- `Werbeanlage flackert` (вывеска мерцает) -> `/probleme-loesungen/werbeanlage-flackert`
- `Buchstabe leuchtet nicht` (буква не светится) -> `/probleme-loesungen/buchstabe-leuchtet-nicht`
- `Folie löst sich` (пленка отклеивается) -> `/probleme-loesungen/folie-loest-sich`
- `Werbeanlage schaltet nach Regen ab` (вывеска отключается после дождя) -> `/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab`

Recommended visual format:
- compact cards or link tiles (компактные карточки-ссылки);
- 4 links for the first pass;
- short explanatory text;
- no images unless the target page strongly benefits from visual preview.

### Service Scope

Role: demonstrate coverage and expertise.

For repair page (страница ремонта), this includes:
- Leuchtkästen (световые короба);
- Profilbuchstaben & LED-Module (объемные буквы и LED-модули);
- Fassadenschilder, Paneele & Stelen (фасадные вывески, панели и стелы);
- Folien & Beschriftungen (пленки и надписи);
- Neon & ältere Lichttechnik (неон и старая светотехника);
- Befestigung & Wetterschäden (крепления и погодные повреждения);
- Digital Signage (цифровая реклама).

For neighboring service pages (соседние страницы услуг), replace the list with service-specific entities (сущности услуги). Do not copy repair entities blindly.

### Calculator

The repair page (страница ремонта) currently has a repair-cost calculator (калькулятор стоимости ремонта). This is not part of the universal service page pattern (универсальный шаблон страницы услуги).

Rule for neighboring pages:
- do not copy the repair calculator (калькулятор ремонта);
- if a calculator is needed, design it specifically for that service;
- if no calculator is needed, omit the calculator block and keep the page flow lean.

### What The Service Includes

Role: concrete work scope and request preparation.

The repair page (страница ремонта) has:
- photo and symptom review (оценка фото и симптомов);
- on-site check (проверка на месте);
- electrical and LED components (электрика и LED-компоненты);
- sealing and weather protection (герметизация и защита от погоды);
- film, faces, and surfaces (пленки, фронты и поверхности);
- securing and final check (фиксация и финальная проверка);
- checklist for request inputs (чеклист данных для заявки).

For neighboring pages, keep this role but replace the details.

### FAQ

Role: trust, safety, legal-safe boundaries, and AI answer readiness.

Repair page (страница ремонта) FAQ (частые вопросы) covers:
- which signs PixelRing repairs (какие вывески ремонтирует PixelRing);
- photo assessment (оценка по фото);
- outdoor displays and digital signage (наружные цифровые экраны и цифровая реклама);
- dangerous situations (опасные ситуации);
- direct service company, not marketplace (сервисная компания, не маркетплейс);
- guarantee/gewährleistung (гарантия/законная ответственность);
- no self-opening/no climbing (не вскрывать корпус и не подниматься на высоту).

For neighboring pages, keep the same trust logic but adapt questions to the service.

### `NEXT STEP` (следующий шаг)

Role: final decision block (финальный блок выбора), not just a generic CTA (общий призыв к действию).

The block should give two paths:

1. Request path (путь заявки): user already knows the task and sends photos/details.
2. Related services path (путь к соседним услугам): user realizes the task belongs to a nearby service area.

Current repair page (страница ремонта) related services:
- `LED-Modernisierung` (LED-модернизация);
- `Audit & Diagnose` (аудит и диагностика);
- `Montage & Demontage` (монтаж и демонтаж);
- `Druck & Branding` (печать и брендинг).

For each neighboring service page, choose related services based on adjacency, not the same four by default.

## Structured Data

Minimum schema set:
- `Service` (услуга);
- `LocalBusiness` (локальный бизнес) or `ProfessionalService` (профессиональная услуга);
- `BreadcrumbList` (хлебные крошки);
- `FAQPage` (FAQ-разметка);
- `hasOfferCatalog` (каталог подуслуг) inside `Service` (услуга), when the page has clear subservice categories.

Repair page (страница ремонта) currently uses `hasOfferCatalog` (каталог подуслуг) for:
- Leuchtkasten-Reparatur (ремонт светового короба);
- LED-Modul-Prüfung und Austausch (проверка и замена LED-модулей);
- Profilbuchstaben-Reparatur (ремонт объемных букв);
- Folien- und Beschriftungsreparatur (ремонт пленок и надписей);
- Befestigung und Wetterschutz (крепления и защита от погоды);
- Digital Signage Prüfung (проверка цифровой рекламы).

Neighboring service pages should define their own `hasOfferCatalog` (каталог подуслуг).

## What Not To Copy Blindly

Do not blindly copy:
- the repair-cost calculator (калькулятор стоимости ремонта);
- repair-specific symptom cards (карточки симптомов ремонта);
- repair-specific FAQ (частые вопросы ремонта);
- repair `hasOfferCatalog` (каталог подуслуг ремонта);
- repair problem links (ссылки на страницы проблем ремонта).

Copy the structure, not the exact content.

