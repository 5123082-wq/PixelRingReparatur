# 02 Public Website

Purpose: public website structure, user journeys, pages, forms, and multilingual UX.

## Context Beacon

Purpose: public website router for startup orientation. Read this beacon first, then open only the document that matches the task.

Current checkpoint:
- Latest public website status lives in the short `Progress Log` below.
- Older public website history lives in [public_website_progress_log.md](public_website_progress_log.md).
- The heavy IA/spec source is `information_architecture.md`; do not read it fully during ordinary startup.

Use this folder for:
- public website IA (информационная архитектура), navigation, page inventory, and page specs;
- public request-intake UX (пользовательский сценарий подачи заявки);
- multilingual public routes and public-facing CTA (призыв к действию) behavior;
- homepage, services, references, business, legal, and status/public tracking surfaces.

## Read Depth

- Shallow startup: read this `Context Beacon`, the `Planned base documents` list, and the latest 1-2 `Progress Log` checkpoints only.
- IA/navigation/page spec tasks: read the `Context Beacon` and `Read Depth` block in `information_architecture.md`, then the relevant heading range.
- Historical continuation: read [public_website_progress_log.md](public_website_progress_log.md) only when following an older dated checkpoint or checking prior implementation context.
- Avoid during ordinary startup: full `information_architecture.md`, archived references, and old progress entries.

## Planned Base Documents

- `site_map.md`
- `public_page_inventory.md`
- `user_journey_flows.md`
- `request_intake_ux.md`
- `multilingual_routes.md`
- `page_brief_services.md`
- `page_brief_for_business.md`
- `page_brief_references.md`
- `page_plan_references.md`
- `page_brief_about.md`
- `page_plan_service.md`
- `page_plan_leistungen.md`
- `page_plan_solutions.md`

## Progress Log

* **Date:** 2026-07-26
* **Current sprint/block:** `Prüfung → Reparatur → Service` (проверка → ремонт → сервис) hero sequence (последовательность первого экрана).
* **Done:** Replaced the mismatched duplicate `01–02–03` logic with one coherent brand sequence across DE/EN/RU/TR/PL/AR. The upper curve now names `Prüfung`, `Reparatur`, and `Service` (проверку, ремонт и сервис), while the lower three columns explain the corresponding step. The curve spans the same full-width three-column axis as the explanations. The existing reusable `ServiceStamp` (фирменная сервисная печать) from the homepage is placed as a restrained finishing mark; no approximate seal asset was generated from the supplied screenshot.
* **In progress:** Browser screenshot and final design QA (визуальная проверка дизайна).
* **Next action:** Open `http://127.0.0.1:3000/de/ueber-uns` in the integrated browser, then capture DE desktop/mobile and AR RTL mobile (немецкую версию на компьютере и телефоне и арабскую версию справа налево на телефоне).
* **Blockers/risks:** The integrated browser blocked the existing `localhost` tab under its local-URL policy. ESLint (проверка кода), TypeScript (проверка типов), `git diff --check` (проверка формата изменений) and production build (промышленная сборка) pass, but the design QA result remains blocked until a new browser-rendered screenshot exists.
* **Updated documents/code:** About page renderer and localized structure copy (рендер и локализованные структурные тексты страницы «О нас»), existing `ServiceStamp` (фирменная сервисная печать), `design-qa.md` (визуальная проверка дизайна), this public-website log (журнал публичного сайта) and root `PROGRESS.md` (краткий глобальный журнал).

* **Date:** 2026-07-26
* **Current sprint/block:** Unified `Über uns` hero and benefits (единый первый экран и преимущества страницы «О нас»).
* **Done:** Combined the first screen and its three benefits into one white 34 px surface on `#F2F3F5`. The breadcrumb (хлебные крошки) is now an unboxed text row, headline typography and vertical spacing are calmer, the introductory copy and official `Prüfen → Entscheiden → Umsetzen` (проверить → решить → выполнить) process line form one lower grid, and the benefits sit below one hairline divider without former table-like vertical borders. Existing localized copy and the supplied process-line asset remain unchanged.
* **In progress:** Owner visual acceptance of the supplied German screenshot.
* **Next action:** Review `/de/ueber-uns` (немецкую страницу «О нас»), then separately approve any refinement, commit or deployment.
* **Blockers/risks:** No implementation blocker. Targeted ESLint (целевая проверка кода), TypeScript (проверка типов), `git diff --check` (проверка формата изменений), production build (промышленная сборка), DE desktop/mobile (немецкая версия на компьютере и телефоне), AR RTL mobile (арабская версия справа налево на телефоне), console and zero-horizontal-overflow checks pass.
* **Updated documents/code:** About page renderer (рендер страницы «О нас»), `design-qa.md` (визуальная проверка дизайна), this public-website log (журнал публичного сайта) and root `PROGRESS.md` (краткий глобальный журнал).

* **Date:** 2026-07-26
* **Current sprint/block:** Live `Über uns` (страница «О нас») unified service chapters (единые сервисные главы).
* **Done:** Adapted the owner-approved standalone direction to the live localized page. `Was wir betreuen` (что мы обслуживаем), `Reparatur statt Reflex-Austausch` (ремонт вместо автоматической замены), `Für wen` (для кого) and `So läuft eine Anfrage ab` (как проходит заявка) now sit inside one shared white container on a cool gray background. The four chapters use one spacing system and thin dividers; service bullets, dark argument cards, sector mini-cards and numbered process cards were replaced with plain editorial lists and columns. Existing DE/EN/RU/TR/PL/AR content and all four sector links remain unchanged.
* **In progress:** Owner visual acceptance of the German canonical implementation (немецкой канонической реализации).
* **Next action:** Review the local `/de/ueber-uns` (немецкую страницу «О нас»), then separately approve any commit or deployment.
* **Blockers/risks:** No implementation blocker. Targeted ESLint (целевая проверка кода), TypeScript (проверка типов), `git diff --check` (проверка формата изменений), production build (промышленная сборка), DE/RU/AR browser rendering (отрисовка в браузере), Arabic RTL (арабское направление справа налево), console and zero-horizontal-overflow checks pass. The desktop source-vs-live comparison (сравнение эталона и реализации на компьютере) is recorded as passed; no separate mobile visual target was supplied for this prototype.
* **Updated documents/code:** About page renderer (рендер страницы «О нас»), `design-qa.md` (визуальная проверка дизайна), this public-website log (журнал публичного сайта) and root `PROGRESS.md` (краткий глобальный журнал).

* **Date:** 2026-07-26
* **Current sprint/block:** Isolated `Über uns` (страница «О нас») unified-surface prototype (прототип единой поверхности).
* **Done:** Built a standalone Russian HTML prototype at `DesignPrototip/pixelring-about-unified-card.html`. The four disputed sections are grouped inside one light container on a cool gray background, use one shared spacing system and hairline dividers, and no longer contain nested mini-cards. After browser comparison with the selected Apple reference, the first oversized headline pass was reduced, repeated orange accents and decorative argument numbering were removed, and the final 1280 px desktop composition passed design QA (визуальную проверку дизайна).
* **In progress:** Owner visual acceptance of the isolated direction.
* **Next action:** Decide whether to use this prototype as the source for the canonical German `Über uns` (страница «О нас») implementation.
* **Blockers/risks:** The live page was not changed. The integrated browser verified the desktop rendering, console, document structure, font stack and zero horizontal overflow. Responsive CSS rules exist at 960 px and 620 px; a separate mobile visual capture remains an optional acceptance check because the integrated browser did not expose viewport resizing.
* **Updated documents/code:** Standalone HTML prototype, companion design QA (визуальная проверка дизайна), this public-website log and root `PROGRESS.md`.

* **Date:** 2026-07-25
* **Current sprint/block:** `Über uns` section sequence and materials marquee (последовательность блоков и бегущая строка материалов на странице «О нас»).
* **Done:** Reordered the localized page to `Wer wir sind → Was wir betreuen → Reparatur statt Reflex-Austausch → Für wen → So läuft eine Anfrage ab → Materialien & Komponenten` (кто мы → что обслуживаем → ремонт вместо автоматической замены → для кого → как проходит заявка → материалы и компоненты). Replaced the former text-heavy supplier block with one short premium-material statement and a full-width continuous text marquee (полноширинную бегущую строку) containing 3M, ORAFOL, Samsung LED, Tridonic, Mean Well, PLEXIGLAS®, DIBOND® and Avery Dennison. Removed the long supplier/partnership explanation and the stale deleted-section blocks from the About CMS seed (скрипта наполнения CMS страницы «О нас»).
* **In progress:** Owner visual acceptance.
* **Next action:** Review `/ru/ueber-uns` locally and then separately approve commit/deployment.
* **Blockers/risks:** No current blocker. TypeScript, targeted lint, `git diff --check`, production build, RU desktop/mobile, AR RTL (арабская версия справа налево) and zero-horizontal-overflow checks pass.
* **Updated documents/code:** About page renderer, six-locale About content, About CMS seed, this log and root `PROGRESS.md`.

* **Date:** 2026-07-25
* **Current sprint/block:** `Über uns` hero (первый экран страницы «О нас») without photography.
* **Done:** Replaced the AI-like `Diagnose-Terminal` (диагностический терминал) with the owner-selected PixelRing brand composition. The official ring and square now form one continuous `Prüfen → Entscheiden → Umsetzen` (Проверить → Решить → Выполнить) line; the current headline and introduction stay unchanged, while the three short stages are localized for DE/EN/RU/TR/PL/AR. The benefit row was simplified into a numbered editorial strip. Targeted lint, TypeScript, production build, DE desktop/mobile, AR RTL (арабская версия справа налево), zero-overflow, mobile-menu and console checks pass.
* **In progress:** Owner visual review and a later separate wording pass.
* **Next action:** Review `/de/ueber-uns` (немецкую страницу «О нас») locally and specify the desired headline, paragraph or stage-label wording changes.
* **Blockers/risks:** No current blocker. The decorative line is a dedicated transparent WebP asset (графический файл); significant future geometry changes should replace that asset.
* **Updated documents/code:** About page renderer and localized labels, the dedicated PixelRing service-line asset, `page_brief_about.md`, design-system change log, `design-qa.md`, this log and root `PROGRESS.md`.

* **Date:** 2026-07-25
* **Current sprint/block:** About page section removal.
* **Done:** Removed the standalone work video and anonymized service-case testimonials from `/[locale]/ueber-uns` (локализованной страницы «О нас»), including localized fallback fields, About CMS adapter and seed fields, the dedicated video component, and unique local media assets. Other request-intake video/photo wording and unrelated reference/homepage media remain unchanged.
* **In progress:** Owner visual review of the shortened page.
* **Next action:** Confirm `/ru/ueber-uns` and then separately approve commit/deployment.
* **Blockers/risks:** Lint and `git diff --check` pass. The initial build could not fetch Google Fonts in the restricted environment; the later production build passed with external font access.
* **Updated documents/code:** `PROGRESS.md`, this README, About page renderer/content/CMS adapter, and removed About video assets.

* **Date:** 2026-07-21
* **Current sprint/block:** `Referenzen` slogan card (карточка-слоган страницы примеров работ).
* **Done:** Reworked the owner-selected slogan into the approved light split card (светлую разделённую карточку): `Ein Schild darf nicht müde aussehen.` (вывеска не должна выглядеть уставшей) remains the only visible copy on the left, and a dedicated signage photograph appears on the right. The shared image is now a replaceable CMS media field (медиаполе CMS), while localized Alt text (альтернативное описание) remains editable independently for DE/EN/RU/TR/PL/AR. Pale arcs and the text-to-photo gradient (плавный переход от текста к фотографии) are separate layout layers, so a future image replacement does not require recreating the card. The former statistics, explanatory copy and report tiles remain hidden without deleting their stored data.
* **In progress:** Owner visual acceptance of the final desktop/mobile composition.
* **Next action:** Review the local DE page and, if accepted, separately approve commit/deployment.
* **Blockers/risks:** No code or CMS-data blocker. Automated in-app browser capture was blocked by the local-URL browser policy, so final visual acceptance remains with the owner; production build, focused tests and DE/RU/AR runtime markup checks pass.
* **Updated documents/code:** `ReferencesExperience.tsx` (публичный компонент страницы), Referenzen CMS adapter/editor/schema (адаптер, редактор и схема CMS страницы примеров работ), replaceable signage WebP (заменяемое изображение вывески), decorative arcs WebP (декоративный фон с дугами), CMS update utility (утилита обновления CMS), `design-qa.md` (визуальная проверка), this log, `page_plan_references.md` (план страницы), admin rollout log (журнал развития админ-платформы) and root `PROGRESS.md` (краткий глобальный журнал).

* **Date:** 2026-07-21
* **Current sprint/block:** Restaurant Pasternak reference refresh (обновление примера работ ресторана Pasternak).
* **Done:** Replaced the inaccurate facade-mounting case with `Fassadenbeschriftung` (фасадная надпись) for Restaurant Pasternak in the CMS and static fallback across DE/EN/RU/TR/PL/AR. The card now follows an owner-provided `Vorher → Prozess → Ergebnis` (до → процесс → результат) sequence: the original facade, `Schablonenlackierung` (окраска по трафарету), and the finished lettering. All three photos are registered in CMS media storage with local fallbacks. Six CMS revisions and audit-log entries were written atomically; local browser review of the German card and detail view passed.
* **In progress:** None.
* **Next action:** Owner confirms the live visual result, then separately approves commit/deployment.
* **Blockers/risks:** No current blocker. The final owner-provided before image is clean and may be published; the earlier Google-watermarked screenshot remains excluded.
* **Updated documents/code:** `PROGRESS.md` (краткий глобальный журнал), this public-website log (журнал публичного сайта), Referenzen fallback/seed content (резервный контент страницы примеров работ), CMS update utility (утилита обновления CMS), three CMS media records (записи медиа CMS), and three local fallback reference images (локальные резервные изображения примера работ).

* **Date:** 2026-07-19
* **Current sprint/block:** Authoritative Referenzen CMS rendering and control (полное управление страницей примеров работ через CMS).
* **Done:** `/[locale]/referenzen` (страница примеров работ) now uses a strict page-specific CMS contract for all visible copy, photos, Alt text (альтернативные описания), lists, filters, labels, links and section visibility. Hidden, empty, `DRAFT` (черновые), deleted and invalid states no longer revive static content; only a missing row or recoverable database outage uses static fallback (резервный статический контент). OWNER-only preview (предпросмотр владельца) is non-indexable. Current DE/EN/RU/TR/PL/AR data was repaired without deleting media files, and the gallery heading/category/final eyebrows are independently editable instead of hardcoded.
* **In progress:** Authenticated editor UAT (приёмочная проверка редактора после входа) remains for the owner; public Russian interaction and Arabic RTL (арабское направление справа налево) checks already pass.
* **Next action:** Sign in normally and verify a reversible draft/preview/publish (черновик/предпросмотр/публикация) cycle, one section visibility change, one gallery item add/edit/delete and revision restore; deploy only after acceptance.
* **Blockers/risks:** No known code/data blocker. Commit and deployment were not performed; existing Alt wording (формулировки альтернативных описаний) may still receive optional editorial localization even though all published image slots are structurally complete.
* **Updated documents/code:** Referenzen public renderer (публичный рендер страницы), fixed CMS editor, atomic batch API (атомарный пакетный API), audit/repair tests (аудит и тесты восстановления), current CMS records, admin/public documentation and root `PROGRESS.md` (краткий глобальный журнал).

* **Date:** 2026-07-18
* **Current sprint/block:** Cacheable localized homepage with preserved portal indicator (кешируемая локализованная главная с сохранённым индикатором кабинета).
* **Done:** Removed the blocking server-side portal-session lookup (блокирующую серверную проверку сессии кабинета) from the public homepage without removing or hiding the account button. DE/EN/RU/TR/PL/AR homepages are now statically generated and revalidated every five minutes (статически создаются и обновляются раз в пять минут). The shared client header requests only a private boolean session state (закрытый логический признак состояния входа) after hydration (после загрузки страницы): anonymous visitors keep the localized status link, while authenticated visitors see the localized portal link. Automatic locale cookies (автоматические языковые cookie-файлы) are disabled, so an `Accept-Language` request header (заголовок предпочтительного языка) does not split the public-page cache. Production build (промышленная сборка), six-locale prerender manifest (манифест предварительной генерации шести языков), local cache `HIT` (ответ из кеша), Arabic RTL (арабское направление справа налево), no personal data in initial HTML (отсутствие персональных данных в начальной разметке), anonymous/authenticated session responses (ответы без входа и после входа), and focused tests passed.
* **In progress:** None locally; production deployment and Vercel cache verification (проверка кеша Vercel) remain pending.
* **Next action:** Deploy and check `x-vercel-cache: HIT` (ответ из кеша Vercel) twice on each localized homepage, then visually confirm the neutral-to-portal label change (смену нейтральной подписи на ссылку кабинета) for one real authenticated session.
* **Blockers/risks:** The first neutral label may change after hydration (после загрузки страницы) for an authenticated visitor; the action reserves the base-label width to reduce layout shift (сдвиг макета). A production cache result cannot be proven before deployment. The successful build logged transient remote-database TLS resets (кратковременные разрывы защищённых соединений с базой), handled by existing static content fallbacks (резервные статические тексты).
* **Updated documents/code:** Localized homepage/layout/routing (локализованная главная, макет и маршрутизация), shared header actions (действия общей шапки), portal session-state endpoint (служебный адрес состояния сессии), focused tests (точечные тесты), this public-site log (журнал публичного сайта), portal/SEO logs (журналы кабинета и поисковой оптимизации) and root `PROGRESS.md` (краткий глобальный журнал).

* **Date:** 2026-07-12
* **Current sprint/block:** Public-Site Canonical Container Rollout (распространение канонического контейнера публичного сайта)
* **Done:** Promoted `pr-site-container` (единый контейнер сайта) from a homepage-only adjustment to the outer rail for public pages: the header logo/action row (строка шапки с логотипом и кнопками), ordinary page content, footer content, and standalone public entry shells (отдельные публичные экраны входа) now share the same 16/24 px mobile-and-tablet gutters and 1332 px desktop maximum from 1280 px upward. Preserved full-bleed backgrounds/media (фоны и медиа на всю ширину), narrow reading/form widths (узкие ширины текста и форм), and authenticated portal/CRM/CMS shells (авторизованные интерфейсы портала, CRM и CMS). Formalized dedicated horizontal carousel rails (отдельные направляющие горизонтальных каруселей) as the exception, so only the rail—not the document—may scroll sideways.
* **In progress:** Final local lint (проверка кода), type check (проверка типов), build (сборка), and desktop/mobile/RTL (направление справа налево) browser review across representative public routes.
* **Next action:** Owner reviews the matching outer edge of the desktop header logo/action row and first content block at 1280/1512 px, then approves deployment after visual review.
* **Blockers/risks:** No known functional blocker. Horizontal photo/case rails (фотографические карусели и карточки кейсов) require continued section-level visual review because their cards intentionally extend beyond the normal content rail.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`
  - `docs/03_design_system/layout_rules.md`
  - `docs/03_design_system/responsive_accessibility.md`
  - `docs/03_design_system/component_guidelines.md`
  - `docs/03_design_system/change_log.md`

* **Date:** 2026-07-11
* **Current sprint/block:** Homepage Shared Content Container (единый контейнер контента главной страницы)
* **Done:** Added the shared `pr-site-container` (единый контейнер сайта) with the homepage-derived 1332 px desktop maximum from 1280 px upward and responsive 16/24 px gutters; aligned homepage sections, footer, header, and coverage-map title/feature overlays to the shared content grid; gave the three homepage horizontal carousels (горизонтальные карусели) their own smaller synchronized rail that preserves through-scroll; kept the coverage-map background full-bleed and its 1000 px 3D stage unchanged to avoid disturbing SVG route recalculation (пересчёт маршрутов SVG).
* **In progress:** Owner visual review of DE desktop plus RU/AR mobile and RTL (направление справа налево) map rendering.
* **Next action:** Confirm that the map overlays align with the header at wide desktop widths and that the 3D map routes remain attached to their city nodes on mobile before deployment.
* **Blockers/risks:** No current blocker; the open browser verified all three carousel rails at the same 52 px inset on a 1512 px viewport and confirmed no page-level horizontal overflow. Lint (проверка кода) and `git diff --check` (проверка формата изменений) passed; remaining risk is responsive review for RU/AR and RTL (направление справа налево).
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`
  - `signage-service/src/app/globals.css`
  - `signage-service/src/components/layout/Header.tsx`
  - `signage-service/src/components/layout/Footer.tsx`
  - homepage section components under `signage-service/src/components/sections/`

* **Date:** 2026-07-11
* **Current sprint/block:** Homepage Services Navigator (навигационный блок услуг на главной странице)
* **Done:** Replaced the text-heavy six-card homepage services grid with the approved compact image/text split layout (компоновка с изображением и текстом); synchronized it with the six currently rendered `/[locale]/leistungen` (страница услуг) destinations: `Werbeanlagen-Reparatur` (ремонт рекламных конструкций), `Werbeanlagen-Reinigung` (очистка рекламных конструкций), `LED-Modernisierung` (LED-модернизация), `Audit & Diagnose` (аудит и диагностика), `Montage & Demontage` (монтаж и демонтаж), and `Druck & Branding` (печать и брендинг); replaced the unmatched `Wartung & Standort-Service` (обслуживание объектов) entry with `Werbeanlagen-Reinigung` (очистка рекламных конструкций); reused the existing service images through `next/image` (оптимизированный компонент изображений Next.js); shortened the intro copy (вводный текст); and preserved the same structure across DE/EN/RU/TR/PL/AR with Arabic RTL (направление справа налево).
* **In progress:** Owner visual review of the final German desktop and Russian/Arabic mobile rendering.
* **Next action:** Deploy after visual approval.
* **Blockers/risks:** No implementation blocker. The homepage and overview still own separate localized card-copy datasets (наборы локализованных текстов карточек), so a future shared service registry (общий реестр услуг) may be useful if the taxonomy changes again; that broader refactor remains outside this visual pass (визуальная итерация).
* **Updated documents:**
  - `PROGRESS.md`
  - `design-qa.md`
  - `docs/02_public_website/README.md`
  - `signage-service/src/components/sections/HomeServicesSection.tsx`
  - `signage-service/package.json`
  - `signage-service/package-lock.json`

* **Date:** 2026-07-11
* **Current sprint/block:** Future `Beleuchtete Markisen-Volants` Page Foundation (основа будущей страницы световых ламбрекенов маркиз)
* **Done:** Defined the new offer as a separate product-service page (отдельную товарно-сервисную страницу) for retrofitting existing commercial awnings, with a dedicated future route, day/night explanation, comparison with terrace awning lighting (сравнение с подсветкой террасы), compatibility check, modular product configuration, photo intake, technical/legal boundaries, internal links, and implementation map. The [full product brief](../07_content_ai_seo/service_page_beleuchtete_markisenvolants_product_brief.md) (полный продуктовый бриф) and [primary-source evidence matrix](../07_content_ai_seo/service_page_beleuchtete_markisenvolants_evidence_matrix.md) (матрица доказательств по первичным источникам) are stored in `docs/07_content_ai_seo/` (папка контента, поисковой оптимизации и оптимизации для ответов искусственного интеллекта).
* **In progress:** Planning only; no route, navigation item, service card, form type, public content, or imagery has been implemented.
* **Next action:** Validate at least two supplier systems and approve the German canonical naming, URL, CTA (призыв к действию), and confirmed configuration before application work.
* **Blockers/risks:** The current six-service header and homepage grids need a separate design decision before adding a seventh category; public specifications remain blocked until a supplier and system are confirmed.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`
  - `docs/07_content_ai_seo/README.md`
  - `docs/07_content_ai_seo/content_ai_seo_progress_log.md`
  - `docs/07_content_ai_seo/markisenvolants/service_page_beleuchtete_markisenvolants_product_brief.md`
  - `docs/07_content_ai_seo/markisenvolants/service_page_beleuchtete_markisenvolants_evidence_matrix.md`

* **Date:** 2026-07-10
* **Current sprint/block:** Homepage Awning Service Card (карточка услуг по маркизам на главной странице)
* **Done:** Replaced the former dismantling card with `Markisenreinigung & Aufarbeitung` (чистка и восстановление маркиз) across DE/EN/RU/TR/PL/AR, using owner-provided footage of a specialist cleaning a café awning. The card now links directly to `/leistungen/werbeanlagen-reinigung` (страница очистки рекламных конструкций).
* **Performance:** Converted the 19 MB source `.MOV` file to an audio-free 1.1 MB web video and added a 206 KB `poster` (статичный кадр до запуска видео). The existing `IntersectionObserver` (контроль видимости браузером) workflow defers loading until the card approaches the viewport (видимая область экрана), plays only while visible, and pauses it outside the viewport.
* **In progress:** Owner visual review of the crop, title wrapping, and playback on `/ru` (русская главная страница) and `/de` (немецкая главная страница).
* **Next action:** Deploy after visual approval.
* **Blockers/risks:** Browser automation was unavailable in the local environment; targeted ESLint (проверка кода), `git diff --check` (проверка формата изменений), production Next.js build (промышленная сборка Next.js), and an isolated production-server check of the new public media and RU/AR card markup passed.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`
  - `signage-service/src/components/sections/ExcellenceCarousel.tsx`

* **Date:** 2026-07-10
* **Current sprint/block:** Unified Safari-Style Header Navigation (единая навигация шапки в стиле Safari)
* **Done:** Replaced the morphing/floating desktop navigation (анимируемая/плавающая десктопная навигация) with one attached two-level header and integrated services grid (встроенная сетка услуг), applied one readable translucent material to all levels, and standardized every active/current navigation element (каждый активный элемент навигации) to a soft fill with the same neutral gray outline as inactive controls (мягкая заливка с такой же нейтральной серой окантовкой, как у неактивных), while the brand-colored outline appears only on hover/focus (фирменная рамка появляется только при наведении/фокусе).
* **In progress:** Owner review in real Safari on iPhone and lower-power Mac hardware.
* **Next action:** Confirm material density, scroll reveal/hide timing, and GPU smoothness (плавность графического процессора), then deploy after visual approval.
* **Blockers/risks:** Local production checks passed; remaining risk is device-specific Safari compositing (сведение графических слоёв), while `prefers-reduced-transparency` (предпочтение уменьшенной прозрачности) and no-blur fallback (резерв без размытия) remain available.
* **Updated documents:**
  - `PROGRESS.md`
  - `design-qa.md`
  - `docs/02_public_website/README.md`
  - `docs/02_public_website/public_website_progress_log.md`

* **Date:** 2026-07-10
* **Current sprint/block:** Homepage Scroll Performance (производительность прокрутки главной страницы)
* **Done:** Removed expensive `backdrop-filter` (размытие фона) from the scrolled header/notch, replaced large decorative blur filters (фильтры размытия) with visually equivalent radial gradients (радиальные градиенты), stopped map animation outside the viewport (видимая область экрана), and made the work-card video load/play only near or inside the viewport (видимая область экрана).
* **In progress:** Owner visual review on Safari/iPhone and lower-power hardware.
* **Next action:** Compare the updated local homepage with production, then deploy after visual approval.
* **Blockers/risks:** Main-thread timing is clean in the local desktop/mobile scroll tests; remaining device-specific risk is GPU compositing (сведение графических слоёв) behavior in Safari.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`
  - `docs/02_public_website/public_website_progress_log.md`

* **Date:** 2026-06-28
* **Current sprint/block:** References `LED-Buchstaben` (объемные LED-буквы) card photo replacement
* **Done:**
  - Replaced the `led-letters` before/after imagery on `/[locale]/referenzen` (страница примеров работ) with two owner-provided facade photos stored as WebP files under the existing references asset folder.
  - Rewrote the selected card case copy for DE, EN, RU, TR, PL, and AR without naming the visible brand from the photos.
  - Added localized image alt text fields for the card, modal gallery, full gallery, and product category surfaces.
  - Updated the CMS media replacement script for the new WebP assets and fixed CMS image-field normalization so ASCII file paths such as `gleichmaessig` are not converted into display text.
  - Updated the published local CMS `referenzen` (примеры работ) records for all six MVP locales.
* **In progress:** Owner visual review of the selected card on the local `/ru/referenzen` (страница примеров работ) page.
* **Next action:** Check the card in the carousel, hover/focus before-state, case modal, and gallery thumbnail in the browser.
* **Blockers/risks:** The photo itself contains a visible third-party brand; public copy and alt text intentionally describe the object generically.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`

* **Date:** 2026-06-24
* **Current sprint/block:** Google Ads Consent Hardening
* **Done:**
  - Changed Google Ads tracking to a basic consent-mode pattern: the Google tag is rendered only after the visitor chooses `Accept all`.
  - Persisted both acceptance and refusal in a first-party consent cookie with a versioned localStorage fallback and migration from the old localStorage-only key.
  - Added a localized `/[locale]/privacy#cookie-settings` panel for changing the consent choice without adding a cookie control to the footer.
  - Verified mobile `/ru` first-visit, `Only necessary`, reload persistence, privacy-page consent change, consent revocation, lint, TypeScript, and production build.
* **In progress:** Production deployment and Safari/iPhone verification.
* **Next action:** After deployment, test `https://www.pixel-ring.com/ru` in iPhone Safari: accept/refuse, reload, and change consent from `/ru/privacy#cookie-settings`.
* **Blockers/risks:** Safari's own privacy warning may still appear after a user explicitly accepts Google Ads cookies because Google tag loading is then intentional.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`

* **Date:** 2026-06-24
* **Current sprint/block:** Leistungen Final CTA Standardization
* **Done:**
  - Converted the shared `LeistungenFooterCTA` component to the approved compact dark image CTA format from `/de/leistungen/werbeanlagen-reparatur`.
  - Reused the shared component on `/[locale]/leistungen`, `/[locale]/leistungen/werbeanlagen-reparatur`, and all shared `/[locale]/leistungen/[slug]` service detail pages.
  - Kept page-specific final headlines, CTA labels, request intent values, and service imagery for the overview and detail pages.
  - Verified the six DE `leistungen` routes render the new CTA at the expected desktop height without horizontal overflow.
* **In progress:** Owner visual review of the standardized final CTA across the Leistungen section.
* **Next action:** Review `/de/leistungen`, `/de/leistungen/werbeanlagen-reparatur`, `/de/leistungen/lichtwerbung-led-modernisierung`, `/de/leistungen/werbeanlagen-audit-diagnose`, `/de/leistungen/montage-demontage-werbeanlagen`, and `/de/leistungen/druckprodukte-branding-werbematerialien`.
* **Blockers/risks:** Browser console still shows existing Next image LCP warnings on some hero images; no runtime errors were observed for the new CTA component.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`

* **Date:** 2026-06-20
* **Current sprint/block:** Legal CMS Restoration
* **Done:**
  - Restored the approved German `privacy/de` CMS text from revision `a86d4fe0-2eef-40a0-b0d2-0dfdd15d159b`.
  - Restored the approved German `impressum/de` CMS text from revision `e4165d3d-9299-47d8-b399-781b15707f39`.
  - Added new `RESTORE` revisions for both legal pages after the 2026-05-25 baseline seed overwrite.
  - Made `/[locale]/privacy` and `/[locale]/impressum` render dynamically so they read the current German legal CMS source instead of stale build output.
  - Extended legal stale-content validation to reject placeholder seed text and changed the CMS baseline seed to skip legal pages.
* **In progress:** Push/deploy and external verification of public legal pages.
* **Next action:** Verify `/ru/privacy`, `/ru/impressum`, `/de/privacy`, and `/de/impressum` after deployment.
* **Blockers/risks:** Legal text still needs owner/legal review whenever business identity, processors, tracking, messenger usage, uploads, or analytics change.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`

* **Date:** 2026-06-14
* **Current sprint/block:** Home Work Carousel Card Order
* **Done:**
  - Moved the branding/print card one position earlier in the rendered `Sichtbare Qualität` carousel.
  - Preserved the branding card video media, localized text, video label, and service link while placing it before maintenance/audit.
  - Kept the order consistent across DE/EN/RU/TR/PL/AR through render-order logic so CMS/fallback item order cannot separate the card text from its media/link configuration.
* **In progress:** Rendered review of `/de` and `/ru` home carousel order.
* **Next action:** Confirm the visible order: montage, repair, branding/print, maintenance/audit, LED, dismantling.
* **Blockers/risks:** If future CMS editors add new carousel items outside the known service set, they will fall after the canonical service cards unless order logic is expanded.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`

Older checkpoints: [public_website_progress_log.md](public_website_progress_log.md).
