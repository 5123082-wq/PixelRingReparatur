# CTA Labels Master
## Главный документ для названий кнопок и CTA

Date: 2026-05-13
Status: active source of truth
Canonical language: DE
Supported MVP languages: DE, EN, RU, TR, PL, AR

---

## 1. Назначение

Этот документ является главным реестром публичных CTA (призывов к действию) и названий кнопок PixelRing.

Если нужно переименовать кнопку на сайте, сначала меняется этот документ, затем запускается отдельный процесс синхронизации:
- fallback-переводы в `signage-service/messages/*.json`;
- hardcoded labels (захардкоженные подписи) в публичных route/components (страницах и компонентах);
- опубликованный CMS content (контент в CMS);
- связанные strategy/copy docs (стратегические и текстовые документы), если меняется смысл CTA.

Цель документа:
- держать одну систему названий для всех языков;
- не возвращаться к хаосу вроде `Anfrage starten`, `Anfrage stellen`, `Anfrage senden` (начать/создать/отправить заявку) в одинаковых местах;
- разделить смысл разных кнопок;
- сохранить German-first (немецкий как канонический язык) подход;
- не звучать как marketplace (маркетплейс исполнителей) или contractor directory (каталог подрядчиков).

---

## 2. Главный принцип CTA

CTA (призыв к действию) должен обещать понятный следующий шаг, а не бюрократическую заявку.

Главная кнопка сайта запускает сервисный процесс PixelRing:

**DE:** `Service starten`
**RU explanation:** запустить сервис / начать взаимодействие с PixelRing

Не использовать главный CTA как:
- `Anfrage stellen` (подать запрос);
- `Anfrage starten` (начать заявку);
- `Anfrage senden` (отправить заявку) вне финальной отправки формы;
- `Foto hochladen` (загрузить фото) как главный CTA;
- `Mit Foto starten` (начать с фото) как главный CTA.

---

## 3. CTA Roles

| Role | Когда использовать | Не использовать для |
|---|---|---|
| Main CTA (главный CTA) | Header, hero, sticky CTA, общий старт intake (приема обращения) | финальная отправка заполненной формы |
| Problem CTA (CTA проблемы) | Страницы проблем, symptom-led flow (сценарий от симптома), карточки неисправностей | B2B/service contract (B2B/сервисный договор) |
| B2B/service CTA (CTA сервиса для бизнеса) | Business page (страница для бизнеса), audit (аудит), service contract (сервисный договор), несколько объектов | быстрый общий старт на главной |
| Form submit (отправка формы) | Последняя кнопка после заполнения формы | header, hero, навигация |
| Status CTA (проверка статуса) | Клиент хочет проверить существующее обращение | старт новой задачи |
| Urgent CTA (срочный CTA) | Срочная ситуация, опасность, аварийный контекст | обычный service request (сервисное обращение) |

---

## 4. Master Table

| Language | Main CTA | Problem CTA | B2B/service CTA | Form submit | Status CTA | Urgent CTA |
|---|---|---|---|---|---|---|
| DE | Service starten | Problem übergeben | Service anfragen | Anfrage senden | Status prüfen | Dringenden Fall melden |
| EN | Start service | Send the issue | Request service | Send request | Check status | Report urgent case |
| RU | Запустить сервис | Передать задачу | Запросить сервис | Отправить заявку | Проверить статус | Сообщить срочно |
| TR | Servisi başlat | Sorunu ilet | Servis talep et | Talebi gönder | Durumu kontrol et | Acil durum bildir |
| PL | Rozpocznij serwis | Przekaż zgłoszenie | Zapytaj o serwis | Wyślij zgłoszenie | Sprawdź status | Zgłoś pilną sprawę |
| AR | ابدأ الخدمة | أرسل المشكلة | اطلب الخدمة | إرسال الطلب | تحقّق من الحالة | بلّغ عن حالة عاجلة |

---

## 5. Supporting Microcopy

### 5.1. Main CTA subline

Используется под главным CTA (главным призывом к действию) или рядом с ним, когда нужно коротко объяснить, как начать.

| Language | Text |
|---|---|
| DE | Starten Sie mit kurzer Beschreibung oder Foto. |
| EN | Start with a short note or photo. |
| RU | Начните с короткого описания или фото. |
| TR | Kısa bir açıklama veya fotoğrafla başlayın. |
| PL | Zacznij od krótkiego opisu albo zdjęcia. |
| AR | ابدأ بوصف قصير أو صورة. |

### 5.2. Problem CTA subline

Используется в problem-led contexts (контекстах от проблемы): страницы проблем, карточки неисправностей, article CTA (CTA статьи).

| Language | Text |
|---|---|
| DE | Übergeben Sie Ihr Problem oder Ihre Aufgabe. |
| EN | Send us your issue or task. |
| RU | Передайте свою проблему или задачу. |
| TR | Sorununuzu veya görevinizi iletin. |
| PL | Przekaż nam problem albo zadanie. |
| AR | أرسل لنا المشكلة أو المهمة. |

### 5.3. Urgent CTA safety line

Используется рядом с `Dringenden Fall melden` (сообщить о срочном случае) и его локализованными версиями.

| Language | Text |
|---|---|
| DE | Bei Gefahr Strom abschalten und Abstand halten. |
| EN | If there is danger, switch off the power and keep distance. |
| RU | При опасности отключите питание и держитесь на расстоянии. |
| TR | Tehlike varsa elektriği kapatın ve mesafe bırakın. |
| PL | W razie zagrożenia odłącz zasilanie i zachowaj odstęp. |
| AR | عند وجود خطر، افصل التيار وابتعد عن الموقع. |

---

## 6. Placement Rules

### 6.1. Header

Header (верхнее меню) должен использовать:

| Language | Header CTA |
|---|---|
| DE | Service starten |
| EN | Start service |
| RU | Запустить сервис |
| TR | Servisi başlat |
| PL | Rozpocznij serwis |
| AR | ابدأ الخدمة |

Header status/action pair:

**DE example:** `Kundenkonto & Status | Service starten`
**RU explanation:** аккаунт/статус клиента + главный старт сервиса

### 6.2. Homepage Hero

Primary button (главная кнопка): use Main CTA.
Secondary button (вторичная кнопка): use Problem CTA only if the page gives a clear problem-led path.

Main subline: use section 5.1.

### 6.3. Forms

Inside an active form, final submit button must use Form submit:

**DE:** `Anfrage senden`
**RU explanation:** отправить уже заполненную заявку

Do not use `Service starten` (запустить сервис) as the final submit label if the user is already inside the form and submitting data.

### 6.4. Problem Pages

Use Problem CTA:

**DE:** `Problem übergeben`
**RU explanation:** передать проблему или задачу PixelRing

Use Main CTA only where the page moves back to the general intake (общий прием обращения).

### 6.5. Business / Service Contract Pages

Use B2B/service CTA:

**DE:** `Service anfragen`
**RU explanation:** запросить сервис, аудит, обслуживание или работу по нескольким объектам

### 6.6. Status

Use Status CTA:

**DE:** `Status prüfen`
**RU explanation:** проверить статус существующего обращения

Status lookup (проверка статуса) must not expose private request data by request number alone.

### 6.7. Urgent Context

Use Urgent CTA and safety line together:

**DE:** `Dringenden Fall melden`
**DE safety:** `Bei Gefahr Strom abschalten und Abstand halten.`

This is not a DIY repair instruction (инструкция по самостоятельному ремонту). It is only a safety reminder before contacting PixelRing.

---

## 7. Naming Notes By Language

### 7.1. DE

German is canonical. Keep wording short and operational.

Preferred:
- `Service starten`
- `Problem übergeben`
- `Service anfragen`
- `Anfrage senden`
- `Status prüfen`
- `Dringenden Fall melden`

Avoid:
- `Anfrage stellen` as generic public CTA;
- `Anfrage starten` as header/hero CTA;
- `Mit Foto starten` as main CTA;
- overly bureaucratic wording.

### 7.2. EN

Use natural English, not literal German translation.

Preferred:
- `Start service`
- `Send the issue`
- `Request service`
- `Send request`
- `Check status`
- `Report urgent case`

### 7.3. RU

Use clear Russian, but preserve service-company meaning.

Preferred:
- `Запустить сервис`
- `Передать задачу`
- `Запросить сервис`
- `Отправить заявку`
- `Проверить статус`
- `Сообщить срочно`

### 7.4. TR

Use natural Turkish action labels.

Preferred:
- `Servisi başlat`
- `Sorunu ilet`
- `Servis talep et`
- `Talebi gönder`
- `Durumu kontrol et`
- `Acil durum bildir`

### 7.5. PL

Use natural Polish service wording.

Preferred:
- `Rozpocznij serwis`
- `Przekaż zgłoszenie`
- `Zapytaj o serwis`
- `Wyślij zgłoszenie`
- `Sprawdź status`
- `Zgłoś pilną sprawę`

### 7.6. AR

Arabic must remain RTL-aware (с учетом направления письма справа налево). Keep labels concise and avoid awkward literal translations.

Preferred:
- `ابدأ الخدمة`
- `أرسل المشكلة`
- `اطلب الخدمة`
- `إرسال الطلب`
- `تحقّق من الحالة`
- `بلّغ عن حالة عاجلة`

---

## 8. Rename Process

When changing a CTA name:

1. Update this document first.
2. Confirm whether the change affects one role or all roles.
3. Update `signage-service/messages/*.json`.
4. Search hardcoded labels in app code:
   - `signage-service/src/app`
   - `signage-service/src/components`
5. Update published CMS pages for affected locales/page keys.
6. Update related strategy/copy docs if the meaning changed.
7. Run validation:
   - JSON parse check for `messages/*.json`;
   - `git diff --check`;
   - `npm run lint` from `signage-service/`;
   - spot-check affected routes in browser or with local HTML checks.

Recommended search terms before a rename:

```txt
Anfrage starten
Anfrage stellen
Anfrage senden
Service starten
Problem übergeben
Service anfragen
Status prüfen
Dringenden Fall melden
Mit Foto starten
Foto hochladen
```

---

## 9. Current Implementation Scope

As of 2026-05-13, this CTA system is applied to:
- fallback translation files in `signage-service/messages/*.json`;
- public app routes for homepage-related CTA usage, services, business, problems/solutions, references, and about page;
- common intake/chat CTA components;
- published CMS content for `global`, `home`, `leistungen`, `business`, `probleme-loesungen`, and `referenzen`;
- supporting strategy/copy docs.

Known boundary:
- older planning docs may still contain historical CTA examples such as `Anfrage starten` (начать заявку) or `Foto hochladen` (загрузить фото). Treat those as historical unless this document confirms them.

---

## 10. Do Not Use

Do not use CTA labels that make PixelRing sound like a marketplace (маркетплейс), contractor directory (каталог подрядчиков), or quote comparison service (сервис сравнения предложений):

- `Meister finden` (найти мастера)
- `Handwerker finden` (найти ремесленника/мастера)
- `Anbieter vergleichen` (сравнить поставщиков)
- `Angebote erhalten` (получить предложения)
- `Spezialisten auswählen` (выбрать специалистов)
- `Auftrag ausschreiben` (выставить заказ на тендер)

---

## 11. Owner-Approved Baseline

This baseline was approved by the project owner on 2026-05-13:

> Main CTA: `Service starten` (запустить сервис)
> Header pattern: `Kundenkonto & Status | Service starten` (аккаунт/статус клиента + запустить сервис)
> Main subline: `Starten Sie mit kurzer Beschreibung oder Foto.` (начните с короткого описания или фото)

Any future rename should preserve the product guardrails:
- one accountable service company;
- one entry point for customer requests;
- AI assists intake, human specialists execute the service;
- German canonical-first;
- multilingual MVP support for DE, EN, RU, TR, PL, AR.

---

## 12. Progress Log

### 2026-05-13 — Master CTA Document Created

- Current sprint/block: Public Website, CTA naming source of truth
- Done: created the active master document for CTA labels across DE, EN, RU, TR, PL, and AR; documented CTA roles, supporting microcopy, placement rules, rename workflow, and forbidden marketplace-style labels.
- In progress: owner visual review of the updated CTA labels on the local site.
- Next action: use this document as the first edit point for any future button renaming, then synchronize messages, code, CMS, and related docs.
- Blockers/risks: older planning documents may still contain historical CTA examples; this document overrides them for active implementation.
- Updated documents: `PROGRESS.md`, `docs/07_content_ai_seo/README.md`, `docs/07_content_ai_seo/copy_system.md`, `docs/07_content_ai_seo/cta_labels_master.md`

### 2026-05-13 — RU Main CTA Updated

- Current sprint/block: Public Website, RU CTA naming refinement
- Done: changed the Russian main CTA from `Начать сервис` to `Запустить сервис` to better match the action sense of `Service starten` / `Start service`.
- In progress: published CMS and app labels are being synchronized with the master CTA document.
- Next action: review the Russian header and homepage visually on `/ru`.
- Blockers/risks: none.
- Updated documents: `docs/07_content_ai_seo/cta_labels_master.md`
