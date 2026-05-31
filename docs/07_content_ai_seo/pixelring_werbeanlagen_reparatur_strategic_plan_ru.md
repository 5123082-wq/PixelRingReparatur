# PixelRing — стратегический план усиления страницы Werbeanlagen-Reparatur

**Страница:** `https://www.pixel-ring.com/de/leistungen/werbeanlagen-reparatur`
**Язык приоритета:** Deutsch / немецкий
**Рынок:** Германия
**Локальный якорь:** Berlin + Brandenburg
**Масштабирование:** deutschlandweiter Service через отдельную Deutschland-страницу и city pages
**Дата версии:** 2026-05-31
**Статус:** рабочий стратегический план для агента-разработчика

---

## 0. Главный принцип

Текущую страницу `Werbeanlagen-Reparatur` не нужно превращать в общую страницу “по всей Германии”. Она должна остаться сильной локальной посадочной страницей с фокусом на Berlin & Brandenburg.

Масштабирование по Германии нужно строить отдельным слоем:

1. текущая страница = локальная service page для Berlin & Brandenburg;
2. отдельная Deutschland/service-area page = федеральный B2B-сервис для заявок по Германии;
3. city pages = отдельные уникальные страницы для Hamburg, München, Köln, Frankfurt am Main и других городов;
4. problem pages = статьи по симптомам: `Leuchtreklame flackert`, `Leuchtkasten leuchtet nicht`, `Einzelner Buchstabe leuchtet nicht`, `Leuchtreklame nach Regen ausgefallen` и т.д.

Цель текущей страницы: получить больше качественных B2B-заявок на ремонт, диагностику, обслуживание и восстановление рекламных конструкций через понятный немецкий offer, локальное доверие Berlin/Brandenburg, аккуратный CTA и технически безопасный процесс заявки.

---

## 1. Обязательный рабочий протокол для агента

Перед каждым действием агент обязан выдать владельцу короткий план и дождаться согласования.

### 1.1. Формат плана перед каждым действием

Перед изменением агент пишет:

```markdown
## План действия

- Что меняю:
- Зачем это нужно:
- Какие файлы / компоненты / CMS-блоки будут затронуты:
- Риск:
- Как проверить результат:
- Как откатить изменение:
- Нужны ли данные от владельца:
- Ожидаемый результат:
```

После согласования агент выполняет только согласованный объём. Если в процессе обнаруживается новая проблема, агент останавливается и снова согласует новый план.

### 1.2. Что агент не должен делать без согласования

- менять URL-структуру;
- удалять существующие страницы;
- менять canonical/hreflang массово;
- менять robots.txt или sitemap без отдельного плана;
- добавлять `noindex`;
- добавлять fake reviews, fake ratings, fake local offices;
- заявлять `24/7`, `sofort`, `garantiert`, `Festpreis`, `wir reparieren alles`, если это не подтверждено владельцем и юридически не проверено;
- публиковать city pages с одинаковым текстом и заменой только названия города;
- менять юридические страницы без финальных данных от владельца и проверки Anwalt / Datenschutzberater / Steuerberater.

### 1.3. Обязательные статусы задач

Каждую задачу агент ведёт в одном из статусов:

```text
Backlog
Geplant
Wartet auf Freigabe
In Arbeit
Review
Erledigt
Blockiert
```

---

## 2. Текущее стратегическое состояние страницы

### 2.1. Что уже хорошо

- Страница уже имеет понятный фокус на `Werbeanlagen-Reparatur` и `Lichtwerbung-Service`.
- В H1 и hero уже есть Berlin & Brandenburg.
- Есть блоки про типичные дефекты, симптомы, Leuchtkästen, LED, Profilbuchstaben, Folien, Neon, Befestigung и Digital Signage.
- Есть FAQ и CTA.
- Есть логика предварительной оценки по фото, видео и описанию.
- Есть ценовой калькулятор / ориентировочная оценка с осторожной формулировкой.

### 2.2. Что мешает росту

- Berlin-сигнал есть, но не хватает локальных доказательств: NAP, реальные кейсы, Berlin project references, Google Business Profile, районы, B2B-контекст.
- Текущий offer можно сделать сильнее в первые 5 секунд.
- CTA должен быть более конкретным: не просто “Anfrage”, а “Foto senden und Einschätzung erhalten”.
- Не хватает отдельного блока `Reparatur statt Austausch`.
- Не хватает аккуратного блока `Service über Berlin hinaus`, чтобы открыть заявки из Германии без размывания Berlin-фокуса.
- Нужно усилить internal linking на service pages и problem pages.
- Нужно проверить technical SEO: canonical, hreflang, sitemap, robots, schema, indexing, Core Web Vitals.
- Нужно унифицировать бренд: `PixelRing`, а не смесь `Pixel Ring` / `PixelRing`.
- Нужно убрать или проверить юридические риски: Impressum, Datenschutzerklärung, Garantie/Gewährleistung, cookies/tracking, фото/видео-заявки, WhatsApp/Telegram.

---

## 3. Целевая SEO/GEO-архитектура

### 3.1. Роль текущей страницы

**URL:** `/de/leistungen/werbeanlagen-reparatur`
**Роль:** главная service landing page для ремонта рекламных конструкций в Berlin & Brandenburg.

**Primary focus:**

```text
Werbeanlagen-Reparatur Berlin
Werbeanlagen-Reparatur Berlin & Brandenburg
```

**Secondary focus:**

```text
Leuchtreklame Reparatur Berlin
Lichtwerbung Reparatur Berlin
Schilder Reparatur Berlin
LED Schild Reparatur Berlin
Leuchtkasten Reparatur Berlin
Fassadenwerbung Reparatur
Reklameschild Reparatur
Werbeanlagen Wartung Berlin
```

### 3.2. Роль будущей Deutschland-страницы

**Рекомендуемый URL:**

```text
/de/leistungen/werbeanlagen-service-deutschland
```

или, если фокус на обслуживании:

```text
/de/leistungen/lichtwerbung-wartung-deutschland
```

**Роль:** страница для B2B-клиентов, филиальных сетей, Hausverwaltungen, объектов с несколькими локациями и заявок за пределами Berlin/Brandenburg.

**Primary focus:**

```text
Werbeanlagen Service Deutschland
Lichtwerbung Wartung Deutschland
Werbeanlagen Wartung Deutschland
Lichtwerbung Reparatur Deutschland
```

### 3.3. Роль city pages

City pages нужны не сразу все, а поэтапно. Стартовый приоритет:

1. Hamburg;
2. München;
3. Köln;
4. Frankfurt am Main;
5. Stuttgart;
6. Leipzig;
7. Nürnberg;
8. Düsseldorf;
9. Dortmund;
10. Essen;
11. Bremen;
12. Hannover;
13. Dresden.

Пример URL-структуры:

```text
/de/standorte/hamburg/werbeanlagen-reparatur
/de/standorte/muenchen/werbeanlagen-reparatur
/de/standorte/koeln/werbeanlagen-reparatur
/de/standorte/frankfurt-am-main/werbeanlagen-reparatur
```

Важное правило: city pages не должны быть копиями с заменой города. Каждая страница должна иметь уникальное интро, service availability wording, FAQ, CTA, внутренние ссылки и честное объяснение, как PixelRing обрабатывает заявки в этом городе.

---

## 4. Пошаговый план усиления текущей страницы

---

# Phase 0 — Baseline, доступы и безопасная подготовка

## Цель

Зафиксировать текущее состояние страницы, не ломая существующий SEO и не внося изменения вслепую.

## Действие 0.1 — Зафиксировать текущую страницу

- Aufgabe: Снять baseline текущей страницы.
- Bereich: SEO / Tech / QA
- Priorität: Hoch
- Warum wichtig: Без baseline невозможно понять, что изменилось после оптимизации и не сломана ли индексация.
- Konkreter nächster Schritt: Агент делает снимок текущего состояния: URL, title, meta description, H1/H2/H3, canonical, hreflang, schema, status code, robots, sitemap presence, screenshots desktop/mobile.
- Ergebnis: Baseline-файл или раздел в задаче с текущим состоянием.
- Status: Done

### Acceptance criteria

- Зафиксирован текущий HTML title.
- Зафиксирована текущая meta description.
- Зафиксирован текущий H1.
- Зафиксирован canonical.
- Зафиксированы hreflang-теги, если есть.
- Зафиксирован status code.
- Зафиксированы существующие schema scripts, если есть.
- Сделаны screenshots desktop/mobile.

## Действие 0.2 — Проверить структуру проекта

- Aufgabe: Найти, где в проекте управляются content blocks, metadata, schema и routes.
- Bereich: Tech
- Priorität: Hoch
- Warum wichtig: Нужно понимать, меняется ли контент через CMS, seed-файлы, static files или компоненты.
- Konkreter nächster Schritt: Агент показывает владельцу карту файлов/компонентов, которые относятся к странице.
- Ergebnis: Понятно, где менять title, meta, page content, translations, schema, routes.
- Status: Done

### Acceptance criteria

- Найден источник немецкого контента.
- Найдены источники EN/RU версий.
- Найден источник metadata.
- Найден источник schema или место, куда schema добавляется.
- Найдена логика sitemap/hreflang/canonical.

---

# Phase 1 — Legal / trust foundation before aggressive SEO

## Цель

Убрать критичные риски, которые снижают доверие и могут быть опасны для немецкого коммерческого сайта.

Это предварительный чек-лист, не юридическое заключение. Финальную проверку должны сделать Anwalt / Datenschutzberater / Steuerberater.

## Действие 1.1 — Унифицировать бренд

- Aufgabe: Везде использовать `PixelRing`.
- Bereich: SEO / Content / Trust
- Priorität: Hoch
- Warum wichtig: Смешение `Pixel Ring` и `PixelRing` размывает brand entity и выглядит менее профессионально.
- Konkreter nächster Schritt: Найти все вхождения `Pixel Ring` на странице, в metadata, footer, schema и заменить на `PixelRing`, если это соответствует утверждённому бренду.
- Ergebnis: Единое написание бренда.
- Status: Done

### Acceptance criteria

- На странице используется `PixelRing`.
- В title используется `PixelRing`.
- В schema используется `PixelRing`.
- В footer и CTA нет смешения бренда.

## Действие 1.2 — Проверить Impressum

- Aufgabe: Убрать placeholder-данные из Impressum.
- Bereich: Legal
- Priorität: Hoch
- Warum wichtig: Для коммерческого сайта в Германии обычно требуется корректная Anbieterkennzeichnung nach § 5 DDG.
- Konkreter nächster Schritt: Агент запрашивает у владельца реальные данные: юридическое имя/компания, адрес, e-mail, телефон, регистрационные данные, USt-ID, Verantwortlicher Inhalt, если применимо.
- Ergebnis: Impressum без placeholder.
- Status: Backlog

### Acceptance criteria

- Нет `[Name des Inhabers]`, `[Strasse und Hausnummer]`, `[Telefonnummer]` и других placeholder.
- Данные совпадают с NAP на сайте и, если есть, Google Business Profile.
- Юрист/налоговый консультант проверил спорные поля.

## Действие 1.3 — Проверить Datenschutzerklärung

- Aufgabe: Обновить privacy policy под фактическую обработку данных.
- Bereich: Legal / Data Protection
- Priorität: Hoch
- Warum wichtig: Страница ведёт к заявкам через e-mail, WhatsApp, Telegram, фото, видео и форму. Это персональные данные и потенциально данные об объектах клиента.
- Konkreter nächster Schritt: Агент собирает список фактических каналов: contact form, e-mail, WhatsApp, Telegram, hosting, analytics, cookies, spam protection, file upload/photo upload.
- Ergebnis: Datenschutzerklärung описывает реальный процесс обработки данных.
- Status: Backlog

### Acceptance criteria

- Описана обработка через контактную форму.
- Описана обработка фото/видео.
- Описаны e-mail, WhatsApp, Telegram.
- Описан hosting.
- Описаны analytics/tracking, если используются.
- Cookie consent соответствует фактическим non-essential cookies/tracking.
- Юридически рискованные блоки отправлены на проверку Datenschutzberater / Anwalt.

## Действие 1.4 — Уточнить Garantie / Gewährleistung

- Aufgabe: Убрать неоднозначные обещания гарантии.
- Bereich: Legal / Content
- Priorität: Hoch
- Warum wichtig: В Германии `Garantie` и gesetzliche `Gewährleistung` — разные понятия. Нельзя обещать гарантию без чётких условий.
- Konkreter nächster Schritt: Заменить рискованные формулировки на безопасную немецкую формулировку.
- Ergebnis: Снижен риск юридически неточных обещаний.
- Status: Backlog

### Безопасная немецкая формулировка

```text
Für ausgeführte Arbeiten gelten die gesetzlichen Gewährleistungsrechte. Der konkrete Umfang hängt von Leistung, Material und Vereinbarung ab. Eine zusätzliche Garantie wird nur ausgewiesen, wenn sie ausdrücklich vereinbart ist.
```

---

# Phase 2 — On-page SEO и первый экран немецкой страницы

## Цель

Сделать страницу понятной Google и B2B-клиенту за первые 5 секунд: что ремонтируем, где, для кого и какой следующий шаг.

## Действие 2.1 — Обновить SEO Title

- Aufgabe: Усилить title страницы.
- Bereich: SEO
- Priorität: Hoch
- Warum wichtig: Title должен сразу показывать услугу, город и коммерческий интент.
- Konkreter nächster Schritt: Заменить текущий title на рекомендованный вариант после согласования.
- Ergebnis: Более сильный локальный commercial snippet.
- Status: Done

### Рекомендуемый Title

```text
Werbeanlagen-Reparatur Berlin | Leuchtreklame & Schilder | PixelRing
```

### Альтернативный Title, если нужно сохранить Brandenburg

```text
Werbeanlagen-Reparatur Berlin & Brandenburg | PixelRing
```

### Acceptance criteria

- Title уникален.
- В title есть `Werbeanlagen-Reparatur Berlin`.
- В title есть бренд `PixelRing`.
- Title не перегружен ключами.

## Действие 2.2 — Обновить Meta Description

- Aufgabe: Сделать meta description более кликабельной и конкретной.
- Bereich: SEO / CRO
- Priorität: Hoch
- Warum wichtig: Meta description может повлиять на snippet и ожидание пользователя в SERP.
- Konkreter nächster Schritt: Вставить немецкий текст ниже.
- Ergebnis: Пользователь понимает: можно отправить фото и получить первую оценку.
- Status: Done

### Рекомендуемая Meta Description

```text
Defekte Werbeanlage in Berlin oder Brandenburg? PixelRing prüft Leuchtkästen, LED-Module, Profilbuchstaben, Folien, Befestigung und Digital Signage. Fotos senden und erste Einschätzung erhalten.
```

### Acceptance criteria

- Meta description уникальна.
- Есть Berlin/Brandenburg.
- Есть PixelRing.
- Есть CTA `Fotos senden`.
- Нет обещания точной цены, гарантии или срочного выезда.

## Действие 2.3 — Уточнить H1

- Aufgabe: Сделать H1 коротким и сильным.
- Bereich: SEO / Content
- Priorität: Mittel
- Warum wichtig: H1 должен ясно фиксировать главный интент страницы.
- Konkreter nächster Schritt: Заменить H1 или оставить текущий, если он уже совпадает по смыслу.
- Ergebnis: Ясный основной фокус страницы.
- Status: Done

### Рекомендуемый H1

```text
Werbeanlagen-Reparatur in Berlin & Brandenburg
```

### Acceptance criteria

- На странице один H1.
- H1 содержит `Werbeanlagen-Reparatur`.
- H1 содержит `Berlin & Brandenburg`.
- H1 не пытается одновременно ранжироваться по всей Германии.

## Действие 2.4 — Переписать hero intro

- Aufgabe: Сделать первый экран более прямым, техническим и конверсионным.
- Bereich: CRO / Content / SEO
- Priorität: Hoch
- Warum wichtig: Клиент должен сразу понять, что можно отправить фото и получить техническую оценку.
- Konkreter nächster Schritt: Заменить hero intro на немецкий текст ниже.
- Ergebnis: Более понятный offer above the fold.
- Status: Backlog

### Рекомендуемый hero text

```text
PixelRing prüft defekte Werbeanlagen, Lichtwerbung, Leuchtkästen, LED-Schilder, Profilbuchstaben, Folien und Befestigungen. Senden Sie Fotos, ein kurzes Video und die Objektinformationen – wir klären, welche Reparatur oder Prüfung als nächster Schritt sinnvoll ist.
```

### Acceptance criteria

- В hero есть PixelRing.
- В hero есть основные типы конструкций.
- В hero есть фото/видео как следующий шаг.
- Нет обещания точной цены или точного срока.

## Действие 2.5 — Обновить CTA

- Aufgabe: Сделать CTA конкретным и action-oriented.
- Bereich: CRO / UX
- Priorität: Hoch
- Warum wichtig: Клиенту проще отправить фото, чем “создать заявку”.
- Konkreter nächster Schritt: Заменить primary/secondary CTA.
- Ergebnis: Больше кликов в заявку.
- Status: Backlog

### Primary CTA

```text
Foto senden und Einschätzung erhalten
```

### Secondary CTA

```text
Schaden kurz beschreiben
```

### Safety CTA для опасных ситуаций

```text
Sicherheitsrisiko melden
```

### Trust microcopy под CTA

```text
Keine Marktplatz-Anfrage: PixelRing prüft Ihre Werbeanlage technisch und koordiniert den nächsten sinnvollen Schritt transparent.
```

### Acceptance criteria

- Primary CTA виден above the fold.
- CTA ведёт к форме/каналу заявки.
- CTA не обещает `sofort`, `garantiert`, `Festpreis`.
- На mobile CTA не скрыт и легко нажимается.

---

# Phase 3 — Усиление содержания текущей страницы

## Цель

Добавить блоки, которые повышают доверие, SEO-релевантность и конверсию без превращения страницы в длинный SEO-текст.

## Действие 3.1 — Добавить блок `Reparatur statt Austausch prüfen`

- Aufgabe: Явно показать ключевую выгоду PixelRing: ремонт вместо полной замены.
- Bereich: Marketing / SEO / CRO
- Priorität: Hoch
- Warum wichtig: Это снижает страх бюджета и отличает PixelRing от компаний, которые сразу продают замену.
- Konkreter nächster Schritt: Вставить блок после симптомов или перед калькулятором стоимости.
- Ergebnis: Сильнее позиционирование и выше доверие.
- Status: Backlog

### Готовый немецкий блок

```text
## Reparatur statt Austausch prüfen

Nicht jede defekte Werbeanlage muss vollständig ersetzt werden. Häufig lohnt sich zuerst eine technische Prüfung: Netzteile, LED-Module, Anschlüsse, Feuchtigkeit, Befestigung, Folien oder einzelne Bauteile können je nach Zustand gezielt instand gesetzt werden.

PixelRing prüft auf Basis von Fotos, Videos und Objektinformationen, ob eine Reparatur sinnvoll ist oder ob ein Austausch einzelner Komponenten die bessere Lösung wäre. Der genaue Aufwand hängt vom Zugang, Zustand der Anlage und der Diagnose vor Ort ab.
```

### Acceptance criteria

- Блок не обещает, что ремонт всегда возможен.
- Есть осторожные формулировки `häufig`, `je nach Zustand`, `auf Basis von Fotos`.
- Блок связан внутренними ссылками с будущей страницей `Reparatur statt Austausch`, если она будет создана.

## Действие 3.2 — Добавить B2B-блок

- Aufgabe: Явно показать целевую аудиторию.
- Bereich: Marketing / GEO / CRO
- Priorität: Hoch
- Warum wichtig: Страница должна говорить с владельцами магазинов, ресторанами, отелями, Hausverwaltungen и филиальными сетями.
- Konkreter nächster Schritt: Вставить блок после hero или после первого service overview.
- Ergebnis: B2B-клиент узнаёт себя на странице.
- Status: Backlog

### Готовый немецкий блок

```text
## Für Unternehmen, Filialen und Immobilien in Berlin

PixelRing unterstützt Unternehmen, Hausverwaltungen, Shops, Restaurants, Hotels, Büros und Filialbetriebe bei defekten Werbeanlagen, Lichtwerbung und Fassadenschildern. Besonders wichtig ist dabei eine schnelle erste Einschätzung: Was ist sichtbar beschädigt, besteht ein Sicherheitsrisiko und welche Reparaturwege sind realistisch?

Für die erste Prüfung reichen in der Regel Fotos, ein kurzes Video, die Objektadresse, die Montagehöhe und eine Beschreibung, seit wann der Defekt besteht.
```

### Acceptance criteria

- Блок говорит с B2B-аудиторией.
- Нет слишком общего `individuelle Lösungen` без смысла.
- Есть практический следующий шаг.

## Действие 3.3 — Добавить локальный Berlin/GEO-блок

- Aufgabe: Усилить Berlin & Brandenburg signal.
- Bereich: GEO / SEO / Content
- Priorität: Hoch
- Warum wichtig: Berlin есть в H1, но нужны дополнительные локальные сигналы и service-area explanation.
- Konkreter nächster Schritt: Вставить блок ближе к середине страницы или перед FAQ.
- Ergebnis: Сильнее local SEO и меньше непонимания зоны обслуживания.
- Status: Backlog

### Готовый немецкий блок

```text
## Werbeanlagen-Reparatur für Berlin und Brandenburg

PixelRing bearbeitet Anfragen für defekte Werbeanlagen, Lichtwerbung, Leuchtkästen, LED-Schilder und Fassadenwerbung in Berlin und Brandenburg. Für Objekte in Berlin – zum Beispiel in Mitte, Charlottenburg-Wilmersdorf, Friedrichshain-Kreuzberg, Pankow, Neukölln oder Tempelhof-Schöneberg – prüfen wir zunächst Fotos, Videos, Zugang und mögliche Sicherheitsrisiken.

Je nach Schaden, Verfügbarkeit und Zugang zur Anlage klären wir den nächsten sinnvollen Schritt: technische Einschätzung, Vor-Ort-Prüfung, Reparatur einzelner Komponenten oder Austausch beschädigter Teile.
```

### Acceptance criteria

- Berlin-районы упомянуты естественно, без списка ради SEO.
- Нет заявления о локальном офисе в районе, если его нет.
- Есть `je nach Schaden, Verfügbarkeit und Zugang`.

## Действие 3.4 — Добавить блок `Service über Berlin hinaus`

- Aufgabe: Открыть заявки из других регионов Германии, не размывая Berlin-страницу.
- Bereich: GEO / CRO / Legal
- Priorität: Hoch
- Warum wichtig: PixelRing планирует работать не только в Berlin, но текущая страница должна оставаться локальной.
- Konkreter nächster Schritt: Вставить аккуратный блок ближе к нижней части страницы, перед FAQ или CTA.
- Ergebnis: Пользователь из другого города понимает, что запрос можно отправить, но без ложного обещания немедленного выезда.
- Status: Backlog

### Готовый немецкий блок

```text
## Service über Berlin hinaus

PixelRing hat den Schwerpunkt in Berlin und Brandenburg. Für Unternehmen, Filialbetriebe, Hausverwaltungen und Projekte mit mehreren Standorten prüfen wir auch Anfragen aus anderen Regionen in Deutschland.

Ob eine Reparatur, Wartung oder technische Prüfung außerhalb von Berlin möglich ist, hängt vom Objekt, Zugang, Schadensbild, Terminfenster und Projektumfang ab. Senden Sie uns Fotos, Videos und die Objektadresse – wir prüfen den passenden nächsten Schritt.
```

### Acceptance criteria

- Блок не меняет основной фокус страницы с Berlin на Deutschland.
- Нет обещания nationwide emergency service.
- Блок содержит честные условия: объект, доступ, damage, срок, проектный объём.

## Действие 3.5 — Добавить блок `Was senden?`

- Aufgabe: Объяснить, какие данные нужны для первой оценки.
- Bereich: UX / CRO / Content
- Priorität: Hoch
- Warum wichtig: Чем понятнее список данных, тем выше качество заявок и меньше переписки.
- Konkreter nächster Schritt: Вставить блок перед формой/CTA.
- Ergebnis: Клиент быстрее отправляет полезную заявку.
- Status: Backlog

### Готовый немецкий блок

```text
## Welche Informationen helfen bei der ersten Einschätzung?

Für eine erste Einschätzung benötigen wir keine technischen Fachbegriffe. Hilfreich sind:

- ein Foto der gesamten Werbeanlage;
- ein Detailfoto der beschädigten Stelle;
- ein kurzes Video, wenn Licht flackert oder ausfällt;
- die Objektadresse oder der Stadtteil;
- die ungefähre Montagehöhe;
- eine kurze Beschreibung, seit wann der Defekt besteht;
- Hinweise auf Regen, Feuchtigkeit, Wind, Geruch, Geräusche oder ausgelöste Sicherungen.

Bitte öffnen Sie die Werbeanlage nicht selbst und berühren Sie keine elektrischen Bauteile.
```

### Acceptance criteria

- Список короткий и практичный.
- Есть safety notice.
- Блок расположен рядом с CTA или формой.

## Действие 3.6 — Усилить safety wording

- Aufgabe: Добавить безопасные формулировки для электричества, влаги, запаха гари, искр и высоты.
- Bereich: Legal / Safety / Content
- Priorität: Hoch
- Warum wichtig: Страница не должна учить опасному DIY-ремонту.
- Konkreter nächster Schritt: Проверить все разделы с симптомами и FAQ на опасные советы.
- Ergebnis: Страница полезна, но не провоцирует клиента вскрывать вывеску или работать с проводами.
- Status: Backlog

### Немецкая формулировка безопасности

```text
Wenn Sie Brandgeruch, Funken, Knacken, starke Erwärmung, Feuchtigkeit in der Anlage oder ausgelöste Sicherungen bemerken, sollte die Werbeanlage nicht weiter betrieben werden. Schalten Sie sie nur ab, wenn das gefahrlos möglich ist, und lassen Sie die Ursache fachgerecht prüfen.
```

### Acceptance criteria

- Нет советов вскрывать корпус.
- Нет советов менять Netzteil самостоятельно.
- Нет советов трогать провода, Klemmen, Controller.
- Есть чёткий безопасный следующий шаг.

---

# Phase 4 — Internal linking и контентные кластеры

## Цель

Связать текущую страницу с будущими service pages, problem pages и Deutschland/city pages, чтобы построить topical authority.

## Действие 4.1 — Добавить внутренние ссылки на service pages

- Aufgabe: Добавить контекстные ссылки на связанные услуги.
- Bereich: SEO / UX
- Priorität: Hoch
- Warum wichtig: Google и пользователь должны видеть структуру услуг PixelRing.
- Konkreter nächster Schritt: Агент показывает список существующих URL и предлагает anchors.
- Ergebnis: Страница становится частью service cluster.
- Status: Backlog

### Рекомендуемые anchors

```text
Leuchtreklame Reparatur Berlin
Schilder Reparatur Berlin
Leuchtkasten Reparatur Berlin
LED Schild Reparatur Berlin
Neon Reparatur Berlin
Werbeanlagen Wartung Berlin
Schilder Montage Berlin
Werbetechnik Service Berlin
Fassadenwerbung Reparatur
```

### Acceptance criteria

- Ссылки ведут на существующие страницы или помечены как будущие.
- Нет ссылок на неготовые страницы в production, если они отдают 404.
- Anchor text естественный.
- Не более 1–2 ссылок на один и тот же URL в основном тексте.

## Действие 4.2 — Добавить внутренние ссылки на problem pages

- Aufgabe: Связать страницу с симптомными статьями.
- Bereich: SEO / Content / UX
- Priorität: Hoch
- Warum wichtig: Problem pages ловят long-tail запросы и приводят клиента к service page.
- Konkreter nächster Schritt: Создать список problem pages и связать их с соответствующими симптомами.
- Ergebnis: Формируется кластер `defekte Leuchtreklame / Schild Problem / Reparatur`.
- Status: Backlog

### Рекомендуемые problem pages

```text
Leuchtreklame flackert
Leuchtkasten leuchtet nicht
Einzelner Buchstabe leuchtet nicht
Leuchtreklame nach Regen ausgefallen
LED Beleuchtung ungleichmäßig
Leuchtkasten geht sofort wieder aus
Reklameschild riecht verbrannt
Automat löst bei Leuchtreklame aus
```

### Acceptance criteria

- Problem pages не дают опасных DIY-инструкций.
- Каждая problem page имеет CTA назад на service page.
- На текущей странице ссылки добавлены в соответствующие симптомы, а не отдельным SEO-списком.

## Действие 4.3 — Создать блок `Ähnliche Probleme`

- Aufgabe: Добавить короткий навигационный блок к похожим ситуациям.
- Bereich: SEO / UX
- Priorität: Mittel
- Warum wichtig: Пользователь может перейти к более точной проблеме.
- Konkreter nächster Schritt: Добавить блок после FAQ или перед финальным CTA.
- Ergebnis: Улучшена внутренняя навигация и глубина просмотра.
- Status: Backlog

### Пример блока

```text
## Ähnliche Probleme

- Leuchtreklame flackert
- Leuchtkasten leuchtet nicht
- Einzelner Buchstabe leuchtet nicht
- Werbeanlage nach Regen ausgefallen
- LED-Beleuchtung wirkt ungleichmäßig
```

---

# Phase 5 — Technical SEO

## Цель

Убедиться, что усиленная страница индексируется корректно, не конфликтует с языковыми версиями и имеет правильные technical signals.

## Действие 5.1 — Проверить canonical

- Aufgabe: Убедиться, что немецкая страница имеет self-canonical.
- Bereich: Tech / SEO
- Priorität: Hoch
- Warum wichtig: Страница не должна каноникализироваться на другой язык или общий URL.
- Konkreter nächster Schritt: Проверить `<link rel="canonical">` в HTML.
- Ergebnis: Немецкая страница канонична сама на себя.
- Status: Backlog

### Рекомендуемый canonical

```html
<link rel="canonical" href="https://www.pixel-ring.com/de/leistungen/werbeanlagen-reparatur" />
```

### Acceptance criteria

- Canonical абсолютный.
- Canonical ведёт на текущий DE URL.
- Нет нескольких canonical.
- Canonical не ведёт на EN/RU.

## Действие 5.2 — Проверить hreflang

- Aufgabe: Убедиться, что DE/EN/RU версии правильно связаны.
- Bereich: Tech / International SEO
- Priorität: Hoch
- Warum wichtig: Многоязычные страницы должны помогать Google выбирать правильный язык.
- Konkreter nächster Schritt: Добавить или исправить hreflang после проверки фактических URL.
- Ergebnis: Языковые версии корректно связаны.
- Status: Backlog

### Рекомендуемый hreflang

```html
<link rel="alternate" hreflang="de-DE" href="https://www.pixel-ring.com/de/leistungen/werbeanlagen-reparatur" />
<link rel="alternate" hreflang="en" href="https://www.pixel-ring.com/en/leistungen/werbeanlagen-reparatur" />
<link rel="alternate" hreflang="ru" href="https://www.pixel-ring.com/ru/leistungen/werbeanlagen-reparatur" />
<link rel="alternate" hreflang="x-default" href="https://www.pixel-ring.com/de/leistungen/werbeanlagen-reparatur" />
```

### Acceptance criteria

- Все языковые версии ссылаются друг на друга.
- Каждая языковая версия имеет self-referencing hreflang.
- `x-default` выбран осознанно.
- URL совпадают с production routes.

## Действие 5.3 — Добавить BreadcrumbList schema

- Aufgabe: Разметить хлебные крошки.
- Bereich: Tech / SEO / Structured Data
- Priorität: Mittel
- Warum wichtig: Breadcrumb schema помогает поисковику понять структуру сайта.
- Konkreter nächster Schritt: Добавить JSON-LD на основе видимых breadcrumb.
- Ergebnis: Корректная BreadcrumbList schema.
- Status: Backlog

### Acceptance criteria

- Schema соответствует видимым breadcrumb.
- JSON-LD валиден.
- Нет битых URL.

## Действие 5.4 — Добавить Service schema

- Aufgabe: Разметить услугу `Werbeanlagen-Reparatur`.
- Bereich: Tech / SEO / Structured Data
- Priorität: Mittel
- Warum wichtig: Service schema помогает описать provider, услугу и areaServed.
- Konkreter nächster Schritt: Добавить JSON-LD после проверки NAP и brand data.
- Ergebnis: Страница лучше описывает service entity.
- Status: Backlog

### Важное ограничение

Не добавлять fake rating, fake reviews, fake office, fake local address или несуществующий emergency service.

### Draft schema direction

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Werbeanlagen-Reparatur in Berlin & Brandenburg",
  "serviceType": "Werbeanlagen-Reparatur, Lichtwerbung-Service, Leuchtreklame-Reparatur",
  "provider": {
    "@type": "Organization",
    "name": "PixelRing",
    "url": "https://www.pixel-ring.com"
  },
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "Berlin" },
    { "@type": "AdministrativeArea", "name": "Brandenburg" },
    { "@type": "Country", "name": "Germany" }
  ],
  "url": "https://www.pixel-ring.com/de/leistungen/werbeanlagen-reparatur"
}
```

### Acceptance criteria

- Schema валидна.
- Schema не содержит неподтверждённых данных.
- `areaServed Germany` используется только как service inquiry area, не как обещание мгновенного выезда.

## Действие 5.5 — Добавить FAQPage schema

- Aufgabe: Разметить видимый FAQ.
- Bereich: Tech / SEO / Structured Data
- Priorität: Mittel
- Warum wichtig: FAQ schema помогает структурировать вопросы и ответы, если контент видим пользователю.
- Konkreter nächster Schritt: Разметить только те FAQ, которые реально отображаются на странице.
- Ergebnis: FAQ structured data соответствует visible content.
- Status: Backlog

### Acceptance criteria

- Каждый FAQ в schema виден на странице.
- Ответы в schema не отличаются по смыслу от страницы.
- Нет promotional spam в FAQ schema.

## Действие 5.6 — Проверить sitemap и robots

- Aufgabe: Убедиться, что URL находится в sitemap и не заблокирован.
- Bereich: Tech / SEO
- Priorität: Hoch
- Warum wichtig: Страница должна быть crawlable и indexable.
- Konkreter nächster Schritt: Проверить sitemap.xml, robots.txt, meta robots, HTTP status.
- Ergebnis: Страница доступна для индексации.
- Status: Backlog

### Acceptance criteria

- URL возвращает 200.
- Нет `noindex`.
- URL есть в sitemap, если sitemap используется.
- robots.txt не блокирует путь.
- Нет redirect chain.

---

# Phase 6 — Германия без потери Berlin-фокуса

## Цель

Сделать масштабирование по Германии SEO-логичным и юридически аккуратным.

## Действие 6.1 — Создать Deutschland service page

- Aufgabe: Создать отдельную страницу для заявок по Германии.
- Bereich: SEO / GEO / Content / CRO
- Priorität: Hoch
- Warum wichtig: Текущая Berlin-страница не должна пытаться закрыть весь Germany intent.
- Konkreter nächster Schritt: Агент предлагает структуру страницы, URL, title, meta, H1, H2 и CTA до разработки.
- Ergebnis: Отдельная страница для deutschlandweiter Service.
- Status: Backlog

### Рекомендуемый URL

```text
/de/leistungen/werbeanlagen-service-deutschland
```

### Рекомендуемый Title

```text
Werbeanlagen-Service Deutschland | Wartung & Reparatur | PixelRing
```

### Рекомендуемая Meta Description

```text
PixelRing prüft Serviceanfragen für Werbeanlagen, Lichtwerbung, Leuchtkästen und LED-Schilder in Deutschland. Für Unternehmen, Filialen und Hausverwaltungen: Fotos senden und nächsten Schritt klären.
```

### Рекомендуемый H1

```text
Werbeanlagen-Service für Unternehmen in Deutschland
```

### Рекомендуемый CTA

```text
Projekt oder Standort anfragen
```

### Рекомендуемая структура H2

```text
## Wartung und Reparatur für Werbeanlagen in Deutschland
## Für Filialen, Hausverwaltungen und Unternehmen mit mehreren Standorten
## Welche Anlagen wir prüfen
## Wie die erste Einschätzung funktioniert
## Berlin HQ, deutschlandweite Anfragen je nach Projekt
## Was Sie für die Anfrage senden sollten
## Häufige Fragen zum Servicegebiet
```

### Acceptance criteria

- Страница не конкурирует напрямую с Berlin-страницей.
- Страница объясняет nationwide inquiries без обещания nationwide emergency coverage.
- Есть ссылка с Berlin-страницы на Deutschland-страницу.
- Есть обратная ссылка с Deutschland-страницы на Berlin-страницу.

## Действие 6.2 — Подготовить city-page template

- Aufgabe: Создать шаблон city page, который не является doorway page.
- Bereich: SEO / GEO / Content
- Priorität: Hoch
- Warum wichtig: Городские страницы могут принести трафик, но копии с заменой города вредят качеству сайта.
- Konkreter nächster Schritt: Агент готовит markdown/template для одной city page и согласует с владельцем до разработки.
- Ergebnis: Шаблон для масштабирования по городам.
- Status: Backlog

### Базовая структура city page

```text
Title: Werbeanlagen-Reparatur [Stadt] | Lichtwerbung & Schilder | PixelRing
Meta: Defekte Werbeanlage in [Stadt]? PixelRing prüft Leuchtkästen, LED-Schilder, Profilbuchstaben und Lichtwerbung. Fotos senden und nächsten Schritt klären.
H1: Werbeanlagen-Reparatur in [Stadt]

## Technische Einschätzung für Werbeanlagen in [Stadt]
## Welche Schäden wir prüfen
## Für Shops, Restaurants, Hotels, Büros und Hausverwaltungen in [Stadt]
## Reparatur statt Austausch prüfen
## So funktioniert die Anfrage
## Servicegebiet und Terminprüfung
## Häufige Fragen zu Werbeanlagen-Reparatur in [Stadt]
```

### Правила уникальности city pages

Для каждой city page нужно добавить:

- уникальное intro;
- честное service availability wording;
- локальный B2B-контекст;
- список релевантных услуг;
- FAQ с уникальными формулировками;
- ссылки на основную service page и Deutschland page;
- отсутствие заявления о местном офисе, если его нет;
- отсутствие `Notdienst sofort`, если не подтверждено.

### Acceptance criteria

- Каждая city page имеет уникальный текст.
- Нет массовой замены только названия города.
- Нет fake local office.
- Есть CTA `Fotos senden und Einschätzung erhalten`.

---

# Phase 7 — Мультиязычность: немецкий сначала, потом EN/RU

## Цель

Сначала довести немецкую страницу до сильного состояния, потом аккуратно синхронизировать EN/RU без механического перевода.

## Действие 7.1 — Обновить EN-версию после DE

- Aufgabe: Адаптировать English version после утверждения немецкой версии.
- Bereich: International SEO / Content
- Priorität: Mittel
- Warum wichtig: EN-страница должна звучать естественно и не конфликтовать с немецкой SEO-логикой.
- Konkreter nächster Schritt: После утверждения DE-контента подготовить EN copy и metadata.
- Ergebnis: EN-версия поддерживает международных клиентов в Германии.
- Status: Backlog

### EN Title

```text
Sign Repair Berlin | Illuminated Signage & Lightboxes | PixelRing
```

### EN Meta Description

```text
Broken sign, lightbox or LED lettering in Berlin or Brandenburg? PixelRing reviews photos, access, visible damage and safety risks before the next repair step.
```

### EN CTA

```text
Send photos and request an assessment
```

## Действие 7.2 — Обновить RU-версию после DE

- Aufgabe: Адаптировать русскую версию после утверждения немецкой.
- Bereich: Content / International SEO
- Priorität: Mittel
- Warum wichtig: RU-версия полезна для русскоязычных B2B-клиентов в Германии, но главный SEO-фокус остаётся немецкий.
- Konkreter nächster Schritt: Подготовить RU copy с живым языком, без прямого машинного перевода.
- Ergebnis: Русская версия понятна клиенту и юридически аккуратна.
- Status: Backlog

### RU Title

```text
Ремонт вывесок в Берлине | Световая реклама и LED | PixelRing
```

### RU Meta Description

```text
Не светится вывеска, лайтбокс или LED-буквы? PixelRing оценивает фото, доступ, высоту и видимые повреждения в Берлине и Бранденбурге.
```

### RU CTA

```text
Отправить фото и получить предварительную оценку
```

---

# Phase 8 — UX, форма заявки и privacy microcopy

## Цель

Сделать путь заявки коротким, понятным и юридически аккуратным.

## Действие 8.1 — Проверить форму заявки

- Aufgabe: Убедиться, что форма поддерживает сценарий “фото + описание проблемы”.
- Bereich: UX / CRO / Legal
- Priorität: Hoch
- Warum wichtig: Главная конверсия страницы — отправка фото/видео и описания.
- Konkreter nächster Schritt: Агент проверяет поля формы и предлагает минимальный набор.
- Ergebnis: Форма не перегружена и собирает нужные данные.
- Status: Backlog

### Рекомендуемые поля

```text
Name / Unternehmen
E-Mail oder Telefonnummer
Objektadresse oder Stadtteil
Art der Werbeanlage
Was ist passiert?
Foto / Video upload или Hinweis auf WhatsApp/Telegram
Dringlichkeitszeichen: Brandgeruch, Funken, Wasser, Sicherung ausgelöst, lose Teile
```

### Acceptance criteria

- Форма не требует лишних данных.
- Есть возможность отправить фото/видео или понятный альтернативный канал.
- Есть privacy notice.
- Есть safety notice.

## Действие 8.2 — Добавить privacy microcopy рядом с формой

- Aufgabe: Коротко объяснить обработку данных.
- Bereich: Legal / UX
- Priorität: Hoch
- Warum wichtig: Клиент отправляет фото объекта и контактные данные.
- Konkreter nächster Schritt: Добавить аккуратный немецкий текст рядом с формой.
- Ergebnis: Прозрачность обработки данных.
- Status: Backlog

### Немецкий текст

```text
Mit dem Absenden Ihrer Anfrage übermitteln Sie uns Ihre Kontaktdaten sowie die von Ihnen bereitgestellten Informationen und Fotos zur Prüfung Ihres Anliegens. Weitere Informationen finden Sie in unserer Datenschutzerklärung.
```

### Acceptance criteria

- Текст виден до отправки формы.
- Ссылка на Datenschutzerklärung работает.
- Текст не заменяет полноценную Datenschutzerklärung.

## Действие 8.3 — Добавить emergency/safety selector

- Aufgabe: Помочь пользователю отметить срочные признаки.
- Bereich: UX / Safety / CRO
- Priorität: Mittel
- Warum wichtig: Заявки с риском должны быть распознаны сразу.
- Konkreter nächster Schritt: Добавить чекбоксы или вопрос в форму.
- Ergebnis: PixelRing быстрее видит опасные ситуации.
- Status: Backlog

### Немецкие варианты чекбоксов

```text
Brandgeruch
Funken oder Knacken
Feuchtigkeit oder Wasser in der Anlage
Sicherung löst aus
Lose Teile oder Absturzgefahr
Starke Erwärmung
Keines davon / nicht sicher
```

---

# Phase 9 — QA перед публикацией

## Цель

Перед публикацией убедиться, что SEO, UX, legal wording и technical setup не сломаны.

## Обязательный QA checklist

```markdown
## Content QA

- [ ] На странице один H1.
- [ ] Title и Meta Description согласованы.
- [ ] Brand написан как PixelRing.
- [ ] Нет `garantiert`, `sofort`, `immer`, `jede Anlage`, `Festpreis nur per Foto`.
- [ ] Garantie/Gewährleistung сформулированы безопасно.
- [ ] CTA виден above the fold.
- [ ] Есть блок `Reparatur statt Austausch prüfen`.
- [ ] Есть B2B-блок.
- [ ] Есть Berlin/Brandenburg GEO-блок.
- [ ] Есть `Service über Berlin hinaus`.
- [ ] Есть блок `Welche Informationen helfen bei der ersten Einschätzung?`.
- [ ] Нет опасных DIY-инструкций.

## Technical QA

- [ ] URL отдаёт 200.
- [ ] Нет noindex.
- [ ] Canonical self-referencing.
- [ ] hreflang DE/EN/RU/x-default корректен.
- [ ] Страница есть в sitemap, если sitemap используется.
- [ ] robots.txt не блокирует URL.
- [ ] Schema валидна.
- [ ] В schema нет fake reviews/rating.
- [ ] Mobile layout не ломается.
- [ ] CTA работает на mobile.
- [ ] Форма отправляется корректно.
- [ ] Privacy notice виден рядом с формой.

## SEO QA

- [ ] Primary keyword виден в Title/H1/intro естественно.
- [ ] Secondary keywords распределены без keyword stuffing.
- [ ] Есть внутренние ссылки на service pages.
- [ ] Есть внутренние ссылки на problem pages, если они опубликованы.
- [ ] Нет битых внутренних ссылок.
- [ ] Изображения имеют полезные alt text, если используются.

## Legal QA

- [ ] Impressum без placeholder.
- [ ] Datenschutzerklärung без placeholder.
- [ ] Описаны фото/видео, e-mail, WhatsApp, Telegram, форма.
- [ ] Cookie consent соответствует фактическому tracking.
- [ ] Спорные формулировки отправлены на юридическую проверку.
```

---

# Phase 10 — После публикации

## Цель

Понять, дали ли изменения эффект, и не появились ли проблемы индексации.

## Действие 10.1 — Проверить индексацию

- Aufgabe: Проверить страницу после публикации.
- Bereich: SEO / Tech
- Priorität: Hoch
- Warum wichtig: После изменений могли появиться noindex, canonical conflict или hreflang conflict.
- Konkreter nächster Schritt: Проверить live URL, source HTML, sitemap, GSC URL Inspection, если доступен.
- Ergebnis: Страница доступна Google.
- Status: Backlog

### Acceptance criteria

- Google может получить страницу.
- Canonical выбран правильно.
- Нет unexpected noindex.
- Hreflang не конфликтует.

## Действие 10.2 — Отслеживать показатели

- Aufgabe: Настроить мониторинг страницы.
- Bereich: SEO / Analytics / CRO
- Priorität: Mittel
- Warum wichtig: Без данных невозможно понять, какие изменения сработали.
- Konkreter nächster Schritt: Проверить GSC, GA4, events, form submissions, click-to-WhatsApp/Telegram/e-mail.
- Ergebnis: Есть метрики по видимости и заявкам.
- Status: Backlog

### Что отслеживать

```text
GSC impressions
GSC clicks
Average position по основным queries
CTR
Clicks on CTA
Form submissions
WhatsApp clicks
Telegram clicks
E-mail clicks
Photo/video upload starts
Qualified leads
City/source of request
```

## Действие 10.3 — Через 4–8 недель подготовить iteration plan

- Aufgabe: На основе данных уточнить content и internal links.
- Bereich: SEO / CRO
- Priorität: Mittel
- Warum wichtig: SEO-страница требует итераций после индексации.
- Konkreter nächster Schritt: Сравнить GSC queries до/после и выделить новые opportunities.
- Ergebnis: План второй итерации.
- Status: Backlog

---

# 11. Готовые немецкие сниппеты для внедрения

## 11.1. Title

```text
Werbeanlagen-Reparatur Berlin | Leuchtreklame & Schilder | PixelRing
```

## 11.2. Meta Description

```text
Defekte Werbeanlage in Berlin oder Brandenburg? PixelRing prüft Leuchtkästen, LED-Module, Profilbuchstaben, Folien, Befestigung und Digital Signage. Fotos senden und erste Einschätzung erhalten.
```

## 11.3. H1

```text
Werbeanlagen-Reparatur in Berlin & Brandenburg
```

## 11.4. Hero text

```text
PixelRing prüft defekte Werbeanlagen, Lichtwerbung, Leuchtkästen, LED-Schilder, Profilbuchstaben, Folien und Befestigungen. Senden Sie Fotos, ein kurzes Video und die Objektinformationen – wir klären, welche Reparatur oder Prüfung als nächster Schritt sinnvoll ist.
```

## 11.5. CTA set

```text
Foto senden und Einschätzung erhalten
Schaden kurz beschreiben
Sicherheitsrisiko melden
```

## 11.6. Trust microcopy

```text
Keine Marktplatz-Anfrage: PixelRing prüft Ihre Werbeanlage technisch und koordiniert den nächsten sinnvollen Schritt transparent.
```

## 11.7. Reparatur statt Austausch

```text
## Reparatur statt Austausch prüfen

Nicht jede defekte Werbeanlage muss vollständig ersetzt werden. Häufig lohnt sich zuerst eine technische Prüfung: Netzteile, LED-Module, Anschlüsse, Feuchtigkeit, Befestigung, Folien oder einzelne Bauteile können je nach Zustand gezielt instand gesetzt werden.

PixelRing prüft auf Basis von Fotos, Videos und Objektinformationen, ob eine Reparatur sinnvoll ist oder ob ein Austausch einzelner Komponenten die bessere Lösung wäre. Der genaue Aufwand hängt vom Zugang, Zustand der Anlage und der Diagnose vor Ort ab.
```

## 11.8. Service über Berlin hinaus

```text
## Service über Berlin hinaus

PixelRing hat den Schwerpunkt in Berlin und Brandenburg. Für Unternehmen, Filialbetriebe, Hausverwaltungen und Projekte mit mehreren Standorten prüfen wir auch Anfragen aus anderen Regionen in Deutschland.

Ob eine Reparatur, Wartung oder technische Prüfung außerhalb von Berlin möglich ist, hängt vom Objekt, Zugang, Schadensbild, Terminfenster und Projektumfang ab. Senden Sie uns Fotos, Videos und die Objektadresse – wir prüfen den passenden nächsten Schritt.
```

## 11.9. Safety wording

```text
Wenn Sie Brandgeruch, Funken, Knacken, starke Erwärmung, Feuchtigkeit in der Anlage oder ausgelöste Sicherungen bemerken, sollte die Werbeanlage nicht weiter betrieben werden. Schalten Sie sie nur ab, wenn das gefahrlos möglich ist, und lassen Sie die Ursache fachgerecht prüfen.
```

## 11.10. Gewährleistung wording

```text
Für ausgeführte Arbeiten gelten die gesetzlichen Gewährleistungsrechte. Der konkrete Umfang hängt von Leistung, Material und Vereinbarung ab. Eine zusätzliche Garantie wird nur ausgewiesen, wenn sie ausdrücklich vereinbart ist.
```

## 11.11. Privacy microcopy

```text
Mit dem Absenden Ihrer Anfrage übermitteln Sie uns Ihre Kontaktdaten sowie die von Ihnen bereitgestellten Informationen und Fotos zur Prüfung Ihres Anliegens. Weitere Informationen finden Sie in unserer Datenschutzerklärung.
```

---

# 12. Приоритетный backlog для агента

## Quick Wins — diese Woche

- Aufgabe: Зафиксировать baseline текущей страницы.
- Bereich: SEO / Tech
- Priorität: Hoch
- Warum wichtig: Нужна точка сравнения до изменений.
- Konkreter nächster Schritt: Снять title, meta, H1/H2/H3, canonical, hreflang, schema, status, screenshot desktop/mobile.
- Ergebnis: Baseline готов.
- Status: Done

---

- Aufgabe: Унифицировать бренд `PixelRing`.
- Bereich: SEO / Content
- Priorität: Hoch
- Warum wichtig: Единая brand entity повышает доверие и консистентность.
- Konkreter nächster Schritt: Найти `Pixel Ring` и заменить на `PixelRing` после согласования.
- Ergebnis: Единое написание бренда.
- Status: Done

---

- Aufgabe: Обновить Title, Meta Description и H1.
- Bereich: SEO
- Priorität: Hoch
- Warum wichtig: Это быстрый high-impact on-page fix.
- Konkreter nächster Schritt: Внедрить согласованные немецкие title/meta/H1.
- Ergebnis: Более сильный commercial/local сигнал.
- Status: Done

---

- Aufgabe: Обновить hero text и CTA.
- Bereich: CRO / UX / Content
- Priorität: Hoch
- Warum wichtig: Пользователь должен сразу понять следующий шаг.
- Konkreter nächster Schritt: Добавить `Foto senden und Einschätzung erhalten` и новый hero intro.
- Ergebnis: Сильнее offer above the fold.
- Status: Backlog

---

- Aufgabe: Добавить блок `Reparatur statt Austausch prüfen`.
- Bereich: Marketing / SEO / CRO
- Priorität: Hoch
- Warum wichtig: Это ключевая ценность PixelRing.
- Konkreter nächster Schritt: Вставить готовый немецкий блок после symptoms/service overview.
- Ergebnis: Лучше позиционирование и доверие.
- Status: Backlog

---

- Aufgabe: Добавить блок `Service über Berlin hinaus`.
- Bereich: GEO / CRO / Legal
- Priorität: Hoch
- Warum wichtig: Открывает заявки из Германии без размывания Berlin-страницы.
- Konkreter nächster Schritt: Вставить готовый немецкий блок перед FAQ или финальным CTA.
- Ergebnis: Страница честно объясняет расширение за пределы Berlin.
- Status: Backlog

---

- Aufgabe: Проверить и смягчить Garantie/Gewährleistung.
- Bereich: Legal / Content
- Priorität: Hoch
- Warum wichtig: Рискованные гарантийные обещания могут быть юридически проблемными.
- Konkreter nächster Schritt: Заменить на safe wording.
- Ergebnis: Меньше юридического риска.
- Status: Backlog

---

## Strategic Investments — dieses Quartal

- Aufgabe: Добавить Service / Breadcrumb / FAQ schema.
- Bereich: Tech / SEO
- Priorität: Mittel
- Warum wichtig: Structured data помогает поисковику понять услугу и структуру страницы.
- Konkreter nächster Schritt: Внедрить JSON-LD только на основе видимого контента.
- Ergebnis: Валидная schema без fake data.
- Status: Backlog

---

- Aufgabe: Проверить hreflang/canonical для DE/EN/RU.
- Bereich: Tech / International SEO
- Priorität: Hoch
- Почему важно: Многоязычность должна быть технически корректной.
- Konkreter nächster Schritt: Добавить self-canonical и reciprocal hreflang.
- Ergebnis: DE/EN/RU версии связаны корректно.
- Status: Backlog

---

- Aufgabe: Создать Deutschland service page.
- Bereich: SEO / GEO / Content
- Priorität: Hoch
- Warum wichtig: Нужен отдельный слой для заявок по Германии.
- Konkreter nächster Schritt: Подготовить page brief и согласовать структуру перед разработкой.
- Ergebnis: Страница `Werbeanlagen-Service Deutschland`.
- Status: Backlog

---

- Aufgabe: Подготовить city-page template.
- Bereich: SEO / GEO / Content
- Priorität: Mittel
- Warum wichtig: Масштабирование по городам должно быть качественным, не doorway.
- Konkreter nächster Schritt: Создать шаблон для Hamburg как пилот.
- Ergebnis: Проверенный template для городов.
- Status: Backlog

---

- Aufgabe: Создать problem pages cluster.
- Bereich: SEO / Content / Safety
- Priorität: Hoch
- Warum важно: Long-tail запросы по симптомам могут приводить качественные заявки.
- Konkreter nächster Schritt: Начать с `Leuchtreklame flackert`, `Leuchtkasten leuchtet nicht`, `Einzelner Buchstabe leuchtet nicht`, `Leuchtreklame nach Regen ausgefallen`.
- Ergebnis: Кластер проблем связан с service page.
- Status: Backlog

---

- Aufgabe: Добавить реальные Referenzen / mini-cases.
- Bereich: E-E-A-T / GEO / CRO
- Priorität: Hoch
- Warum wichtig: Реальные кейсы дают доверие и локальный сигнал.
- Konkreter nächster Schritt: Подготовить 3–5 кейсов: объект, проблема, диагностика, решение, фото до/после, без раскрытия лишних данных клиента.
- Ergebnis: Доказательства опыта PixelRing.
- Status: Backlog

---

# 12.1. Priority handoff for next agent

Этот раздел фиксирует управленческий приоритет после первого прохода по baseline (стартовый снимок), brand cleanup (приведение бренда к единому написанию), metadata (SEO-метаданные) и H1 (главный заголовок).

Следующий агент должен продолжать только через рабочий протокол из раздела 1: сначала `План действия` (план действия), затем явное согласование владельца, затем изменение.

## Must do next — делать обязательно

Эти пункты считаются сверхважными и должны быть следующими рабочими задачами.

- `Действие 1.4 — Уточнить Garantie / Gewährleistung` (уточнить гарантию / законную ответственность за качество работ). Причина: юридически чувствительная зона для немецкого коммерческого сайта; формулировки про `Garantie` (добровольная гарантия) и `Gewährleistung` (законные права при недостатках работ) должны быть безопасными.
- `Действие 2.4 — Переписать hero intro` (переписать вводный текст первого экрана) и `Действие 2.5 — Обновить CTA` (обновить призыв к действию). Причина: первый экран должен сразу объяснять `Fotos senden` (отправить фото), `Video senden` (отправить видео) и `erste Einschätzung erhalten` (получить первичную оценку).
- `Действие 3.1 — Добавить блок Reparatur statt Austausch prüfen` (добавить блок “сначала проверить ремонт вместо замены”). Причина: это ключевая ценность PixelRing (бренд PixelRing) и сильное отличие от обычной страницы ремонта.
- `Действие 3.5 — Добавить блок Was senden?` (добавить блок “что отправить?”) и `Действие 8.1 — Проверить форму заявки` (проверить форму заявки). Причина: пользователь должен понимать, какие фото, видео и данные об объекте нужны для первой оценки.
- `Действие 3.6 — Усилить safety wording` (усилить формулировки безопасности). Причина: электричество, влага, запах гари, искры, высота и рыхлые крепления требуют безопасных инструкций без призыва к самостоятельному ремонту.
- `Действие 1.2 — Проверить Impressum` (проверить обязательные сведения о компании) и `Действие 1.3 — Проверить Datenschutzerklärung` (проверить политику конфиденциальности). Причина: перед активным SEO (поисковая оптимизация), GEO (оптимизация для AI-ответов) и рекламой нужно исключить placeholder (заглушки), неполные юридические данные и несоответствие фактической обработке фото, формы, e-mail, WhatsApp (мессенджер WhatsApp), Telegram (мессенджер Telegram) и upload (загрузка файлов).

## Important later — важно, но после первого круга

Эти пункты полезны, но не должны отвлекать от обязательного первого круга.

- `Действие 3.2 — Добавить B2B-блок` (добавить блок для бизнес-клиентов). Делать после hero/CTA (первый экран и призыв к действию), safety wording (формулировки безопасности) и юридически безопасной Gewährleistung (законная ответственность за качество работ).
- `Действие 3.3 — Добавить локальный Berlin/GEO-блок` (добавить локальный Berlin/GEO-блок). Делать после базового first screen (первый экран) и repair value proposition (ценность ремонта).
- `Действие 4.1`, `Действие 4.2`, `Действие 4.3` — internal links (внутренние ссылки) и `Ähnliche Probleme` (похожие проблемы). Делать после финализации основных блоков страницы.
- `Действие 7.1 — Обновить EN-версию после DE` (обновить английскую версию после немецкой) и `Действие 7.2 — Обновить RU-версию после DE` (обновить русскую версию после немецкой). Делать только после утверждения немецкого canonical copy (канонический немецкий текст).
- `Действие 10.1`, `Действие 10.2`, `Действие 10.3` — индексация, monitoring (мониторинг) и iteration plan (план следующей итерации). Делать после публикации.

## Requires discussion — пока не начинать без отдельного решения владельца

Эти пункты не удалены из стратегии, но требуют отдельного обсуждения, данных или бизнес-решения.

- `Действие 3.4 — Добавить блок Service über Berlin hinaus` (добавить блок “сервис за пределами Берлина”). Не начинать, пока владелец не подтвердит, какие регионы Германии реально обслуживаются, есть ли сервисная сеть и какие обещания допустимы.
- `Действие 6.1 — Создать Deutschland service page` (создать страницу сервиса по Германии). Не начинать без отдельного page brief (бриф страницы), региональной стратегии и безопасных claim boundaries (границы публичных обещаний).
- `Действие 6.2 — Подготовить city-page template` (подготовить шаблон городских страниц). Не начинать без анти-doorway стратегии (стратегия против низкокачественных страниц под города), реальных сервисных возможностей и правил качества для каждого города.
- `Problem pages cluster` (кластер страниц по проблемам) из strategic investments (стратегические инвестиции). Не смешивать с текущей landing page (посадочная страница); оформлять отдельным спринтом.
- `Реальные Referenzen / mini-cases` (реальные примеры работ / мини-кейсы). Не начинать без подтверждения, какие фото, объекты, клиенты и данные можно публиковать.
- `Действие 8.3 — emergency/safety selector` (селектор срочности/опасности). Пока можно заменить сильным safety wording (формулировки безопасности); отдельный интерактивный selector (селектор) делать только после обсуждения UX (пользовательский опыт), правовых рисков и формы заявки.

## Already likely implemented — скорее проверять и отмечать, чем разрабатывать заново

- `Действие 5.3 — BreadcrumbList schema` (структурированные данные хлебных крошек), `Действие 5.4 — Service schema` (структурированные данные услуги), `Действие 5.5 — FAQPage schema` (структурированные данные FAQ) уже обнаружены в baseline (стартовый снимок). Следующему агенту нужно проверить соответствие видимому контенту и после проверки отметить статусы, а не внедрять schema (структурированные данные) заново.
- `Действие 5.1 — canonical` (канонический URL), `Действие 5.2 — hreflang` (языковые связи), `Действие 5.6 — sitemap и robots` (карта сайта и правила индексации) уже зафиксированы в baseline (стартовый снимок). Их лучше пройти как verification task (задача проверки), а не как новый implementation task (задача внедрения).

---

# 13. Риски и ограничения

## 13.1. Что нельзя утверждать без подтверждения

- `24/7 Notdienst`;
- `sofort vor Ort`;
- `garantierte Reparatur`;
- `Festpreis nur per Foto`;
- `deutschlandweit sofort verfügbar`;
- `wir reparieren jede Werbeanlage`;
- ratings / reviews без проверяемого источника;
- офисы в городах, где их нет;
- точные сроки выполнения без проверки доступности и объекта.

## 13.2. Безопасные немецкие альтернативы

```text
in der Regel
je nach Verfügbarkeit
nach einer ersten Prüfung
auf Basis von Fotos und Videos
vor Ort prüfen
technische Einschätzung
Reparatur statt Austausch prüfen
abhängig von Zugang und Zustand der Anlage
wir prüfen jede Anfrage individuell
```

## 13.3. Данные, которые нужно получить от владельца

- юридические данные для Impressum;
- фактический NAP: Name, Address, Phone;
- есть ли Google Business Profile;
- какие каналы реально используются: WhatsApp, Telegram, e-mail, form, upload;
- используются ли analytics/tracking/cookies;
- есть ли реальные сроки реакции;
- какие регионы Германии реально можно обслуживать;
- есть ли партнёрская/сервисная сеть за пределами Berlin;
- можно ли публиковать реальные кейсы/фото;
- есть ли отзывы с проверяемым источником.

---

# 14. Итоговая стратегия

Текущую страницу нужно усиливать как локальную Berlin/Brandenburg service page:

```text
Werbeanlagen-Reparatur Berlin | Leuchtreklame & Schilder | PixelRing
```

Главное изменение: сделать первый экран более ясным, добавить конкретный CTA, усилить блоки `Reparatur statt Austausch`, `B2B`, `Berlin & Brandenburg`, `Service über Berlin hinaus`, улучшить internal linking и закрыть technical SEO.

Для масштабирования по Германии нужно не размывать текущую страницу, а создать отдельный SEO-слой:

```text
/de/leistungen/werbeanlagen-service-deutschland
/de/standorte/hamburg/werbeanlagen-reparatur
/de/standorte/muenchen/werbeanlagen-reparatur
/de/standorte/koeln/werbeanlagen-reparatur
/de/standorte/frankfurt-am-main/werbeanlagen-reparatur
```

Агент-разработчик должен работать итерационно: перед каждым изменением показывать план, файлы, риск, проверку и способ отката, затем ждать согласования владельца.
