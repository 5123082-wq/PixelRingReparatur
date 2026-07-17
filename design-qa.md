# Design QA (визуальная проверка) — боковая заявка калькулятора светового волана

- **Дата:** 2026-07-17
- **Объём:** заменить общее модальное окно после расчёта на существующую правую `LeistungenProblemDrawer` (выдвижную панель услуги), уже используемую на странице ремонта наружной рекламы.
- **Источник визуальной истины:** `/var/folders/sw/wqxr8fzn2z9d0ht64tglhf3m0000gn/T/codex-clipboard-8746cc97-440b-4855-adf4-feb544df5bb2.png` — панель заявки на странице ремонта.
- **Маршрут реализации:** `http://localhost:3000/de/leistungen/beleuchtete-markisenvolants#kostenrechner`.
- **Состояния:** DE `priced` (немецкая версия с рассчитанной ценой), RU `individual-review` (русская версия с индивидуальной проверкой), desktop (компьютер) 1792 × 1395 и mobile (мобильное устройство) 390 × 844.

## Evidence (доказательства)

- Desktop reference (эталон на компьютере): `/var/folders/sw/wqxr8fzn2z9d0ht64tglhf3m0000gn/T/codex-clipboard-8746cc97-440b-4855-adf4-feb544df5bb2.png`.
- Desktop implementation at the same image dimensions (реализация на компьютере с теми же размерами изображения): `signage-service/artifacts/design-qa/illuminated-valance-drawer/de-priced-desktop-1792x1395.png`.
- Mobile implementation (мобильная реализация): `signage-service/artifacts/design-qa/illuminated-valance-drawer/de-priced-mobile-390x844.png` и `signage-service/artifacts/design-qa/illuminated-valance-drawer/ru-review-mobile-390x844.png`.
- Reference and implementation were opened together in one comparison input (эталон и реализация были открыты вместе в одном сравнении). Реализация переиспользует тот же компонент панели, поэтому радиусы, границы, тёплая поверхность, затемнённый фон, верхняя полоса, карточка резюме и форма совпадают с действующим образцом; меняется только содержимое для калькулятора.

## Findings (находки)

- P0: нет.
- P1: нет.
- P2: нет.
- P3: нет. Разница высоты текстовых блоков обусловлена другим заголовком и кратким резюме расчёта, а не изменением каркаса панели.

## Required Fidelity Surfaces (обязательные поверхности точности)

- **Fonts and typography (шрифты и типографика):** сохранены существующий шрифт, веса, верхний служебный лейбл и иерархия заголовков панели ремонта.
- **Spacing and layout rhythm (отступы и ритм):** сохранены максимальная ширина 620 px, внешние поля, радиусы, разделители, вертикальный ритм карточки и формы; на 390 px панель занимает доступную ширину без горизонтального переполнения.
- **Colors and visual tokens (цвета и визуальные токены):** используются без изменений тёмно-синий фон, тёплая белая поверхность, терракотовые акценты и существующие границы/тени.
- **Image and asset fidelity (точность изображений и ассетов):** новые декоративные изображения или заменители не добавлялись; иконка закрытия и кнопка загрузки остаются существующими элементами формы.
- **Copy and content (текст и содержание):** карточка показывает один предварительный итог без НДС либо сообщает об индивидуальной проверке; тип обращения и сообщение предзаполнены, файл можно приложить, структурированный снимок расчёта передаётся отдельно от локализованного текста.

## Interaction And Accessibility Checks (проверки взаимодействия и доступности)

- Кнопка калькулятора открывает одну правую панель; прежние `ContactModal` (контактное модальное окно) и `ChatModal` (модальное окно чата) в этом потоке отсутствуют.
- Закрытие по X, фону и Escape работает; при открытой панели прокрутка страницы блокируется.
- На mobile (мобильном устройстве) 390 × 844: `scrollWidth === clientWidth === 390`, внутренний контейнер формы прокручивается (`866 > 732`), панель остаётся в пределах `x=8…382`.
- DE и RU сохраняют выбранный тип `IlluminatedValance` (волан с подсветкой), локализованное сообщение, загрузку файлов и передачу снимка расчёта.
- Ошибок браузерной консоли, связанных с панелью, не обнаружено.

## Verification (проверка)

- 41 targeted Node tests (41 целевой тест Node): passed (пройдены).
- Targeted ESLint (целевая проверка ESLint): passed (пройдена).
- Production build with TypeScript (промышленная сборка с проверкой TypeScript): passed (пройдена).
- `git diff --check` (проверка формата изменений): passed (пройдена).
- Browser render and responsive checks (браузерный рендер и адаптивная проверка): passed (пройдены) для DE/RU desktop/mobile (немецкой/русской версии на компьютере и мобильном устройстве).

final result: passed

---

# Design QA (визуальная проверка) — интерактивный `Volantwechsel` (замена валана)

- **Дата:** 2026-07-13
- **Объём:** перенести композицию Figma-фрейма `32:3` в новый блок страницы `Beleuchtete Markisen-Volants` (световые ламбрекены маркиз) и встроить справа утверждённую интерактивную смену валана.
- **Источник визуальной истины:** Figma-фрейм `32:3` и утверждённый локальный прототип `/tmp/pixelring-volant-animation/index.html`.
- **Маршрут реализации:** `http://localhost:3000/de/leistungen/beleuchtete-markisenvolants`.
- **Состояния:** desktop (компьютер) 1512 × 900, mobile (мобильное устройство) 390 × 844, промежуточное положение слайдера и финальное свечение.

## Evidence (доказательства)

- Figma source (исходный Figma-кадр): `/tmp/pixelring-volant-figma-32-3.png`.
- Desktop implementation (реализация на компьютере): `/tmp/pixelring-volant-exchange-desktop.png`.
- Mobile implementation (мобильная реализация): `/tmp/pixelring-volant-exchange-mobile.png`.
- Side-by-side comparison (сравнение рядом): `/tmp/pixelring-volant-exchange-comparison.png`.
- In-app browser (встроенный браузер) подтвердил `scrollWidth === clientWidth === 390`, уникальный доступный slider (слайдер), значение `50` после нажатия в середину полосы и отсутствие ошибок console (консоли).

## Findings (находки)

- P0: нет.
- P1: нет.
- P2: нет.
- P3: высота светлой карточки на сайте немного компактнее исходного Figma-фрейма, потому что правый пустой слот теперь занят рабочей анимацией; композиция, типографическая иерархия и безопасный текст сохранены.

## Required Fidelity Surfaces (обязательные поверхности точности)

- **Fonts and typography (шрифты и типографика):** используется существующий Inter; размеры, насыщенности и перенос двухстрочного заголовка соответствуют фрейму `32:3`.
- **Spacing and layout rhythm (отступы и ритм):** desktop (компьютер) сохраняет левую колонку 500 px, светлую карточку, радиусы и тёмно-синий внешний фон; mobile (мобильное устройство) складывает колонки без горизонтального переполнения.
- **Colors and visual tokens (цвета и визуальные токены):** сохранены `#0E1A2B`, `#F4F7FB`, `#B8643E` и тёплая нейтральная поверхность анимации.
- **Image quality and asset fidelity (качество и точность ассетов):** используется утверждённый фронтальный ракурс маркизы и прозрачный PixelRing wordmark (фирменная надпись PixelRing); CSS-рисунок маркизы не создавался.
- **Copy and content (текст и содержание):** использован текст фрейма `32:3`; неподтверждённые сроки, цена, гарантия и универсальная совместимость не добавлены.

## Interaction And Accessibility Checks (проверки взаимодействия и доступности)

- Слайдер работает мышью, пальцем, нажатием по полосе и клавишами стрелок/Home/End.
- До середины старый валан уезжает, новый PixelRing-валан заезжает справа налево.
- Свечение включается только на последних делениях (`value >= 97`) и действует только на буквы; нижней световой полосы нет.
- `prefers-reduced-motion` (настройка уменьшения движения) отключает автоматическое проигрывание, сохраняя ручное управление.
- Кнопка `Noch einmal` (ещё раз) перезапускает демонстрацию.

## Verification (проверка)

- Targeted ESLint (целевая проверка ESLint): passed (пройдена).
- Browser render (браузерный рендер): passed (пройден) на desktop/mobile (компьютере/мобильном устройстве).
- Browser console errors (ошибки консоли браузера): none (нет).
- TypeScript project check (проверка TypeScript проекта): blocked by pre-existing unrelated errors (заблокирована существующими несвязанными ошибками) в `referenzen/page.ts` и `status/page.ts`; новый компонент в этих ошибках не фигурирует.

final result: passed

---

# Design QA (визуальная проверка) — bento-блок ценности `Beleuchtete Markisen-Volants` (световые ламбрекены маркиз)

- **Дата:** 2026-07-12
- **Объём:** переконфигурировать только существующий product-value section (блок ценности продукта) после day/night hero (первого экрана день/ночь) на `/de/leistungen/beleuchtete-markisenvolants` (немецкой странице световых ламбрекенов маркиз) в утверждённую владельцем bento grid (разновесную сетку из пяти карточек).
- **Визуальный источник:** выбранный владельцем bento-референс `rerisehealth.com/why-core100`, переданный в browser comment (комментарии браузера); это референс структуры и ритма, а не источник текста, медицинских обещаний или брендовых материалов.
- **Маршрут реализации:** `http://localhost:3000/de/leistungen/beleuchtete-markisenvolants`
- **Состояние:** desktop (компьютер) 1280 × 720 и mobile (мобильное устройство) 390 × 844 в стандартном состоянии.

## Evidence (доказательства)

- DOM (структура страницы) подтверждает desktop-сетку (сетку компьютера) 5/3/4 и 5/3/4: левая визуальная карточка занимает обе строки; на mobile (мобильном устройстве) пять карточек собраны в одну колонку с `scrollWidth === clientWidth === 390`.
- Ссылка `Zur Machbarkeitsprüfung` (к проверке реализуемости) ведёт к `#machbarkeit` (секции проверки реализуемости) и выравнивает её по верхнему краю viewport (видимой области окна).
- В локальном браузере подтверждены одна H1 (главный заголовок), согласованный `hero-cafe-night.png` (ночной визуал кафе), видимая якорная ссылка bento-сетки, отсутствие error overlay (окна ошибки Next.js) и ошибок console (консоли браузера).
- Browser-rendered screenshot (скриншот из браузерного рендера) недоступен: команда in-app browser (встроенного браузера) `Page.captureScreenshot` дважды завершилась по тайм-ауту для локального маршрута. Без изображения реализации рядом с референсом визуальная точность не считается подтверждённой.

## Findings (находки)

- [P1] Browser-rendered screenshot comparison (сравнение скриншотов из браузерного рендера) заблокировано.
  - **Расположение:** локальная desktop/mobile-проверка (компьютера/мобильного устройства) bento-блока ценности продукта.
  - **Доказательство:** обе попытки захвата завершились по тайм-ауту до возврата изображения реализации.
  - **Влияние:** точное сравнение плотности карточек, кадрирования изображения, типографики, отступов и цветового баланса с выбранным референсом остаётся незавершённым.
  - **Исправление:** выполнить ручной review (визуальную проверку) владельцем на desktop/mobile (компьютере/мобильном устройстве) или повторить захват, когда API скриншота локального браузера станет доступен.

## Required Fidelity Surfaces (обязательные поверхности точности)

- **Fonts and typography (шрифты и типографика):** сохранены существующие иерархия Inter, насыщенности и стили страницы; DOM-измерения показывают, что каждый мобильный заголовок заканчивается внутри границы своей карточки.
- **Spacing and layout rhythm (отступы и ритм сетки):** используются промежутки 12 px, радиусы 28 px и общий public-site container (контейнер публичного сайта). Ширины desktop-карточек (карточек компьютера) составляют 506/299/403 px; mobile-карточки (мобильные карточки) сохраняют 358 px внутри полей 16 px.
- **Colors and visual tokens (цвета и визуальные токены):** существующие тёмно-синий PixelRing, терракотовый и тёплый кремовый заменяют палитру health-product reference (референса продукта здоровья).
- **Image quality and asset fidelity (качество изображения и точность ассетов):** блок использует только согласованный ночной визуал кафе через `next/image`; placeholder (заглушка) и отклонённые `hero-front-*` (фронтальные визуалы) отсутствуют.
- **Copy and content (текст и содержание):** текст карточек сохраняет границы продукта, логику технической проверки и photo-first next step (следующий шаг, начинающийся с фотографии); цена, гарантия, универсальная совместимость и коммерческий результат не обещаются.

## Implementation Checklist (контрольный список реализации)

- [x] Заменить три равные карточки ценности продукта bento-композицией из пяти карточек.
- [x] Сохранить `#machbarkeit` (проверку реализуемости) и блок процесса без изменений.
- [x] Добавить доступную внутристраничную ссылку на существующий feasibility section (раздел проверки реализуемости).
- [x] Проверить маршрут, якорь, адаптивную геометрию, lint (проверку кода), формат, build (сборку) и console output (вывод консоли).
- [ ] Завершить owner visual review (визуальную проверку владельцем) или browser screenshot comparison (сравнение скриншотов браузера).

final result: blocked

---

# Design QA — Homepage Eight-Card Services Navigator

- Date: 2026-07-12
- Scope: extend the approved image-first homepage services navigator from six to eight cards
- Source visual truth: `/var/folders/sw/wqxr8fzn2z9d0ht64tglhf3m0000gn/T/codex-clipboard-16eb8985-9d69-416d-989e-db7bb7c544ba.png`
- Product addition source: `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_implementation_plan.md`, section 6.4
- Implementation route: `http://localhost:3000/de`
- State: DE desktop and mobile default; DE/EN/RU/TR/PL/AR content validation; AR desktop RTL

## Evidence

- DE desktop implementation, 1440 × 1100 px: `/tmp/pixelring-home-services-de-desktop-v2.png`
- DE mobile implementation, 390 × 844 px: `/tmp/pixelring-home-services-de-mobile.png`
- AR desktop RTL implementation, 1440 × 1100 px: `/tmp/pixelring-home-services-ar-desktop.png`
- Full-view comparison evidence: the source screenshot and DE desktop implementation show the same compact horizontal image/text cards, typography hierarchy, warm section surface, border treatment, and arrow affordance. The approved product plan intentionally changes the grid from 3 × 2 to 4 × 2 and moves the separate overview link into the first card.
- Focused-region evidence: an additional crop was not needed because the desktop evidence frames the complete services section at readable card-title scale; the mobile evidence separately verifies compact card construction and wrapping.

## Findings

- P0: none.
- P1: none remaining.
- P2: none remaining.
- P3: the introductory overview card intentionally uses a solid navy surface rather than an image rail so it is distinguishable from the seven standalone service destinations, as required by the approved plan.

## Required Fidelity Surfaces

- Fonts and typography: project Inter typography and hierarchy are preserved. The final wide-screen card title uses 17 px type and normal word wrapping, preventing arbitrary mid-word breaks in German and longer localized names.
- Spacing and layout rhythm: 12 px gaps, equal 176 px card heights, the shared 80 rem site container, and compact horizontal cards are preserved. The wide layout is a balanced 4 × 2 grid; tablet and mobile remain 2 and 1 columns.
- Colors and visual tokens: the warm section background, white service cards, navy text, terracotta accent, warm borders, subtle elevation, and visible focus treatment remain aligned with the source and existing site tokens.
- Image quality and asset fidelity: existing service images and the owner-provided daytime illuminated-valance image render through `next/image` with card-specific object positioning. No placeholder or approximate image asset is used.
- Copy and content: the overview label, new service name, and updated section summary are complete for DE/EN/RU/TR/PL/AR. Turkish and Polish diacritics are preserved; Arabic renders with `dir="rtl"` and localized left-pointing arrows.

## Interaction And Accessibility Checks

- All eight cards are semantic links. Decorative thumbnails use empty alt text so accessible link names are not duplicated.
- `Alle Leistungen ansehen` was activated in the browser and reached `/de/leistungen`.
- `Leuchtvolants für Markisen` was activated in the browser and reached `/de/leistungen/beleuchtete-markisenvolants`.
- All six locale checks returned exactly eight localized links with no detected card clipping.
- DE desktop and mobile plus AR desktop RTL were visually inspected; arrow direction and image/text order follow the document direction.
- Browser console errors: none.
- Targeted ESLint, TypeScript, `git diff --check`, and the Next.js production build passed.

## Comparison History

1. Pass 1 found P1 arbitrary mid-word wrapping in four-column German card titles because the image rail and title size left insufficient text width.
2. The fix reduced the wide-screen image rail from 44% to 40%, tightened only wide-screen content padding, used a 17 px wide-screen card title, and removed arbitrary `break-words` behavior.
3. Pass 2 showed complete German words, a balanced 4 × 2 grid, and no visible clipping. Six-locale DOM checks and AR RTL evidence found no remaining P0/P1/P2 issue.

## Implementation Checklist

- [x] Add the visually distinct overview card linking to `/leistungen`.
- [x] Add the illuminated-valance card linking to its standalone service page.
- [x] Localize the complete section for DE/EN/RU/TR/PL/AR.
- [x] Preserve desktop, tablet, mobile, and Arabic RTL behavior.
- [x] Verify both new links, console output, lint, types, diff format, and production build.

final result: passed

---

## Historical completed QA

# Design QA — PixelRing Safari-Style Header

- Date: 2026-07-10
- Scope: desktop header material, navigation hierarchy, contrast, expanded services state, and current-page state
- Reference viewport: supplied Safari / PixelRing screenshot, normalized to a 1280 px-wide header crop
- Implementation viewport: 1280 × 720 px production rendering

## Evidence

- Source screenshot: `/var/folders/sw/wqxr8fzn2z9d0ht64tglhf3m0000gn/T/codex-clipboard-67755aa3-0f9e-4032-8ba3-9baf5900d8df.png`
- Side-by-side material comparison: `/tmp/pixelring-header-impl/22-final-material-comparison.png`
- Final default state: `/tmp/pixelring-header-impl/24-final-top-clean.png`
- Final expanded services state: `/tmp/pixelring-header-impl/26-expanded-top-clean.png`
- Final current-page state: `/tmp/pixelring-header-impl/36-neutral-active-outline-top.png`

## Comparison findings

- The implementation keeps the reference's cool translucent character and perceptible underlying content while using a denser readable tint for website navigation text.
- The top row, navigation row, and expanded services grid read as one continuous material; no detached floating panel or nested backdrop blur is visible.
- Default controls are more distinct than the earlier version without overpowering the glass material.
- The 1 px open/hover/focus outline does not change element geometry because it is rendered as an inset outline.
- Active primary navigation, service cards, language selection, and status controls remain visually clear through a soft warm fill and the same subtle neutral outline as inactive controls, without competing with the primary `Service starten` CTA.
- Expanded service cards remain readable over photographic and dark page content.

## QA iterations

1. Unified the material and removed width/scale morphing and detached navigation surfaces.
2. Increased material density and verified the expanded services grid over high-contrast imagery.
3. Increased control contrast and introduced 1 px interaction outlines.
4. Separated open/disclosure state from current-page state so opening a control keeps the 1 px outline.
5. Standardized every active/current navigation element to a soft fill plus the same subtle neutral gray outline as inactive controls; the brand-colored outline appears only on hover/focus/open interaction.

## Severity review

- P0: none
- P1: none
- P2: none
- P3: real-device Safari GPU smoothness and the 390 px mobile visual pass remain manual follow-up checks; fallbacks and reduced-transparency behavior are implemented.

Final result: passed
