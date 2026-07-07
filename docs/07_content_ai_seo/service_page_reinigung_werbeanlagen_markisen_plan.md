# Service Page Plan (план страницы услуги): Werbeanlagen-Reinigung Und Markisenpflege (очистка рекламных конструкций и уход за маркизами)

Status (статус): planning source (плановый источник) for future public page (будущая публичная страница) and SEO/GEO work (поисковая оптимизация и оптимизация для AI-ответов).

Date (дата): 2026-06-28

Owner language (язык для владельца): Russian-facing planning document (плановый документ для русскоязычного владельца). German and English public labels (немецкие и английские публичные формулировки) include Russian explanations inline (сразу получают русское пояснение).

## 1. Purpose (цель)

This document defines the future service page for `Reinigung & Pflege von Werbeanlagen, Markisen und Außenwerbung` (очистка и уход за рекламными конструкциями, маркизами и наружной рекламой).

The page should support:

- a new dedicated route, proposed as `/[locale]/leistungen/werbeanlagen-reinigung-markisenpflege` (страница услуги очистки рекламных конструкций и ухода за маркизами);
- a new module on `/[locale]/leistungen` (главная страница услуг);
- future `SEO` (поисковая оптимизация) and `GEO` (оптимизация для AI-ответов) work around cleaning, maintenance, awnings, and visible storefront quality;
- clear internal routing to `Werbeanlagen-Reparatur` (ремонт рекламных конструкций), `Werbeanlagen-Audit & Diagnose` (аудит и диагностика рекламных конструкций), `Druck & Branding` (печать и брендинг), and `LED-Modernisierung` (LED-модернизация).

This is not an implementation task yet. Do not create code, CMS records, route files, or migrations from this document without a separate owner confirmation.

## 2. Current Understanding (текущее понимание)

Berlin street-level advertising often uses `Markisen` (маркизы) as part of the visible business facade. For cafes, restaurants, bakeries, retail stores, salons, pharmacies, and service businesses, a `Markise` (маркиза) is not only sun protection but also a brand surface, name carrier, weather-exposed textile, and part of the first customer impression.

Therefore PixelRing should not present this as generic cleaning. The stronger service concept is:

> PixelRing keeps visible outdoor business advertising clean, readable, and technically noticed: signs, lightboxes, lettering, branded awnings, storefront surfaces, and nearby mounting areas.

The public offer should remain consistent with the product guardrail: one accountable service company, not a marketplace, contractor directory, or cleaning lead platform.

## 2.1 Owner Decisions From Review (решения владельца после обсуждения)

These decisions override earlier open questions in this document.

1. PixelRing presents the service as one accountable company.
   - Public copy should say that PixelRing performs and coordinates the work as the responsible service company.
   - Public copy must not explain internal execution details such as whether a complex case uses an external specialist, rented access equipment, or a partner.
   - Internal interpretation: PixelRing may self-perform simple/standard cleaning and involve qualified responsible people for complex cases, but the client sees one accountable service provider.

2. The page should target simple search behavior.
   - Users search for `Markisenreinigung Berlin` (очистка маркиз в Берлине), `Markise reinigen lassen` (заказать очистку маркизы), or `Markise reinigen Berlin` (очистить маркизу в Берлине), not for highly qualified wording such as "branded awning cleaning".
   - The page must therefore include broad `Markisenreinigung` (очистка маркиз) language for search capture, while the visible positioning filters the ideal client toward commercial storefronts, gastronomy, retail, and business facades.
   - Private residential awnings are not a target segment, but the page should not over-narrow the keyword language so much that search demand is missed.

3. `Imprägnierung` (пропитка) is not a primary offer.
   - The page can mention that additional care steps may be recommended after assessment.
   - The page should not sell `Imprägnierung` (пропитка) as a headline service, fixed package, or promised add-on.

4. A calculator is desired.
   - The page should include a service-specific calculator similar in spirit to the existing repair calculator, but adapted to cleaning complexity.
   - The calculator should cover different objects: `Markise` (маркиза), exterior sign/letters, lightbox, and interior cleaning of illuminated letters or lightboxes where dismantling may be needed.
   - The calculator should produce a non-binding request summary and effort category, not a guaranteed price.

5. Region strategy:
   - The page should be anchored on `Berlin & Brandenburg` (Берлин и Бранденбург) because this is the core region and headquarters context.
   - Copy may indicate broader Germany-wide service capability carefully, but the SEO landing intent should remain `Berlin & Brandenburg` (Берлин и Бранденбург).

6. Image strategy:
   - Real before/after photos are not available yet.
   - The first implementation should use generated visual assets with realistic, non-stock, commercial storefront scenes.
   - Image prompts must be documented before generation so the assets can be produced consistently and reviewed before code work.

## 3. Research Summary (резюме ресерча)

### Berlin And Legal Context (Берлин и юридический контекст)

Berlin describes `Werbeanlagen` (рекламные конструкции) broadly as fixed outdoor advertising visible from public traffic areas, including signs, lettering, paintings, illuminated advertising, showcases, columns, boards, and advertising surfaces. Source: Berlin.de, `Werbeanlagen` (рекламные конструкции), BauO Bln (строительный регламент Берлина) context.

Implication for PixelRing:

- `Markisen` (маркизы) with a business name, logo, lettering, or street-visible brand function can be treated as part of the broader outdoor advertising surface cluster.
- The public copy should avoid legal overclaiming such as "all awnings are advertising systems" and instead say: "bei beschrifteten oder werblich genutzten Markisen" (для маркиз с надписью или рекламным использованием).

### Direct Werbetechnik Competitors (прямые конкуренты среди рекламно-технических компаний)

Several `Werbetechnik` (рекламно-технические компании) competitors include cleaning inside `Wartung und Reparatur` (обслуживание и ремонт), but usually do not give `Markisenreinigung` (очистка маркиз) a strong standalone service-page position.

- Grafikhane Berlin positions maintenance as visibility and prevention for outdoor advertising, including systems not originally produced by them.
- KKP Werbetechnik Berlin explicitly mentions `Reinigung der Anlage von Innen und Außen` (очистка конструкции внутри и снаружи) inside repair and maintenance.
- Mattern Neon Berlin lists `Wartung+Reinigung+Reparatur` (обслуживание + очистка + ремонт) around light advertising and access planning.
- SMS Werbetechnik frames cleaning as care for light advertising, banner systems, signage, and mounting surfaces, including dirt caused by 365-day weather exposure.
- Turk Lichtwerbung und Kunst offers `Wartung und Reinigung von Werbeanlagen` (обслуживание и очистка рекламных конструкций), including intervals, LED components, sealing, corrosion protection, and single-site to branch-chain logic.

Strategic gap:

- competitors validate the need;
- competitors often bury cleaning under repair/maintenance;
- PixelRing can package cleaning as a visible, customer-friendly entry service that also creates diagnostic and repair follow-up.

### Markisenreinigung Competitors (конкуренты по очистке маркиз)

`Markisenreinigung` (очистка маркиз) is already an established cleaning category in Germany. Competitors sell cleaning, impregnation, repair, fabric replacement, and `Neubespannung` (новая перетяжка ткани).

Observed competitor angles:

- weather, air pollution, bird droppings, algae, mold, dirt, and reduced water repellency;
- `Imprägnierung` (пропитка) as a protective add-on after cleaning;
- "cleaning is cheaper than replacement" as a strong conversion argument;
- `Full-Service` (комплексный сервис) around awnings, windows, and exterior appearance;
- before/after proof photos as a key trust asset.

PixelRing differentiation:

- PixelRing should not compete as a household textile cleaner.
- PixelRing should focus on commercial storefronts, branded awnings, visible outdoor advertising, and the connection between cleaning, signage condition, and business appearance.

### Safety, Water, And Operations (безопасность, вода и операционные границы)

Relevant constraints for future public copy:

- Berliner Wasserbetriebe warns that wastewater from `Fassadenreinigung` (очистка фасадов) must not be discharged into the public sewer system without the required handling/approval when applicable.
- `DGUV Vorschrift 3` (правило DGUV для электрических установок и оборудования) applies to electrical systems and also includes non-electrical work near electrical systems.
- `DGUV Information 208-019` (информация DGUV по безопасной работе с мобильными подъемными платформами) highlights risk assessment, operating instructions, fall/object/electrical hazards, and site-specific planning for `Hubarbeitsbühnen` (подъемные рабочие платформы).

Public implication:

- promise careful planning, material-aware cleaning, access coordination, and visual condition notes;
- do not promise "chemical-free", "safe for every material", "any height", "same-day everywhere", or "legally complete wastewater handling" unless operations confirm it;
- avoid encouraging customers to open lightboxes, clean around electrical parts, climb, or use pressure washers.

## 4. Service Positioning (позиционирование услуги)

Primary German public phrase:

`Reinigung & Pflege von Werbeanlagen, Markisen und Außenwerbung` (очистка и уход за рекламными конструкциями, маркизами и наружной рекламой)

Short German positioning:

`Wir reinigen sichtbare Außenwerbung fachgerecht und prüfen dabei, ob Verschmutzung, Materialalterung oder kleine Schäden die Wirkung Ihres Standorts beeinträchtigen.` (Мы профессионально очищаем видимую наружную рекламу и при этом проверяем, ухудшают ли загрязнения, старение материала или небольшие повреждения восприятие вашей локации.)

Russian owner-level positioning:

PixelRing продает не "уборку", а восстановление ухоженного внешнего вида рекламной поверхности и раннее обнаружение проблем. Клиент получает один понятный вход: отправляет фото вывески, маркизы или фасадной зоны; PixelRing оценивает очистку, доступ, материал и возможные соседние задачи.

## 5. Recommended Offer Scope (рекомендуемый объем предложения)

Include in the offer:

- `Werbeanlagen-Reinigung` (очистка рекламных конструкций): lightboxes, signs, panels, dimensional letters, pylons, shopfront signage.
- `Markisenreinigung` (очистка маркиз): branded awnings, restaurant awnings, shop awnings, awnings with logos, lettering, or visible business colors.
- `Fassadennahe Reinigung` (очистка зоны вокруг фасадной рекламы): dirt marks, runoff lines, mounting zones, visible adjacent surfaces when operationally feasible.
- `Sichtprüfung` (визуальная проверка): visible cracks, loose fixings, water traces, corrosion, film lifting, textile damage, fading, missing parts.
- `Pflegehinweis` (рекомендация по уходу): whether cleaning is enough, whether impregnation, repair, replacement fabric, repainting, re-lettering, sealing, or electrical diagnosis should be considered.

Exclude or mark as case-by-case:

- deep electrical repair during cleaning unless the task becomes `Werbeanlagen-Reparatur` (ремонт рекламных конструкций);
- guaranteed stain removal from old textile, old acrylic, yellowed PVC, faded film, or deeply damaged fabric;
- `Imprägnierung` (пропитка) as a universal promise or headline service before material and fabric condition are assessed;
- high-pressure washing near film edges, textile seams, acrylic, seals, or electrical parts;
- facade wastewater handling promises before the exact site and method are known.

## 6. Target Audiences (целевые аудитории)

Priority 1 (приоритет 1): street-facing local businesses (локальные бизнесы с фасадом на улицу)

- cafes, restaurants, bakeries, kiosks, flower shops, salons, beauty studios, pharmacies, medical practices, retail stores;
- typical trigger: dirty `Markise` (маркиза), stained sign, faded storefront, bad first impression before summer season.

Priority 2 (приоритет 2): multi-location businesses (бизнесы с несколькими локациями)

- chains, franchise locations, small retail groups, property-managed storefronts;
- typical trigger: uneven appearance across several locations, seasonal cleaning, maintenance planning.

Priority 3 (приоритет 3): existing repair and branding customers (существующие клиенты ремонта и брендинга)

- customers who already ask PixelRing about repair, signage, branding, or storefront updates;
- typical trigger: cleaning reveals damage, or repair work should finish with cleaner exterior presentation.

## 7. SEO/GEO Keyword Cluster (кластер поисковых и AI-запросов)

No live keyword-volume tool was used in this planning pass. Scores below are planning priorities, not verified search-volume data.

| Cluster | Keyword | Intent | Priority 1-5 | Page role |
|---|---|---:|---:|---|
| Core service | `Werbeanlagen-Reinigung Berlin` (очистка рекламных конструкций в Берлине) | transactional | 5 | main target |
| Core service | `Außenwerbung reinigen Berlin` (очистить наружную рекламу в Берлине) | commercial | 4 | main target |
| Signage | `Werbeschilder reinigen lassen` (заказать очистку вывесок) | transactional | 4 | section/FAQ |
| Light advertising | `Leuchtreklame reinigen lassen` (заказать очистку световой рекламы) | transactional | 4 | section/FAQ |
| Awnings | `Markisenreinigung Berlin` (очистка маркиз в Берлине) | transactional | 5 | major section |
| Awnings | `Markise mit Werbung reinigen` (очистить рекламную маркизу) | commercial | 5 | differentiating long-tail |
| Awnings | `Markise Restaurant reinigen Berlin` (очистить маркизу ресторана в Берлине) | transactional | 4 | gastro landing angle |
| Care | `Wartung und Reinigung von Werbeanlagen` (обслуживание и очистка рекламных конструкций) | commercial | 5 | future service plan |
| Materials | `Markisenimprägnierung Berlin` (пропитка маркиз в Берлине) | transactional | 3 | optional add-on, case-by-case |
| Problem | `Markise verschmutzt` (маркиза загрязнена) | informational | 3 | future article |
| Problem | `Werbeanlage verschmutzt` (рекламная конструкция загрязнена) | informational | 3 | future article |
| Problem | `Folie nach Reinigung beschädigt` (пленка повреждена после очистки) | informational | 3 | problem article/internal link |

`GEO` (оптимизация для AI-ответов) query opportunities:

- `Wie reinigt man eine Werbeanlage sicher?` (как безопасно очистить рекламную конструкцию?)
- `Kann man eine Leuchtreklame selbst reinigen?` (можно ли самому очистить световую рекламу?)
- `Wie oft sollte eine Markise mit Werbung gereinigt werden?` (как часто нужно чистить маркизу с рекламой?)
- `Was kostet die Reinigung einer Werbeanlage?` (сколько стоит очистка рекламной конструкции?)
- `Wann reicht Reinigung nicht mehr aus und wann braucht man Reparatur?` (когда очистки уже недостаточно и нужен ремонт?)

## 8. Future Page Shape (структура будущей страницы)

Recommended route:

`/[locale]/leistungen/werbeanlagen-reinigung-markisenpflege` (страница очистки рекламных конструкций и ухода за маркизами)

Recommended German `H1` (главный заголовок):

`Werbeanlagen-Reinigung & Markisenpflege in Berlin & Brandenburg` (очистка рекламных конструкций и уход за маркизами в Берлине и Бранденбурге)

Recommended flow:

1. Hero (первый экран): service, region, photo/request entry, visual business appearance.
2. Task cards (карточки задач): dirty sign, stained branded awning, dull lightbox, dirty letters, facade runoff, pre-season storefront refresh.
3. Service scope (объем услуги): signs, lightboxes, branded awnings, storefront lettering, visible mounting areas.
4. Material-aware cleaning (очистка с учетом материала): textile awning, acrylic, aluminum composite, vinyl film, painted metal, LED/lightbox surfaces.
5. `Was Reinigung leisten kann - und was nicht` (что может и чего не может очистка): claim-safe expectation setting.
6. `Sichtprüfung nach der Reinigung` (визуальная проверка после очистки): visible defects, repair handoff, photo notes.
7. Optional `Saison-Service` (сезонное обслуживание): spring/summer awnings, autumn dirt, branch locations.
8. FAQ (частые вопросы): safety, electrical parts, awnings, impregnation, photo assessment, business hours.
9. `NEXT STEP` (следующий шаг): request cleaning or choose repair/audit/branding.
10. Structured data (структурированные данные): `Service` (услуга), `LocalBusiness` (локальный бизнес), `BreadcrumbList` (хлебные крошки), `FAQPage` (FAQ-разметка), `hasOfferCatalog` (каталог подуслуг).

## 9. Module For Leistungen Overview (модуль для главной страницы услуг)

Recommended module title:

`Reinigung & Pflege` (очистка и уход)

Recommended card title:

`Werbeanlagen, Markisen und Außenwerbung reinigen lassen` (заказать очистку рекламных конструкций, маркиз и наружной рекламы)

Recommended short copy:

`Für verschmutzte Schilder, Leuchtkästen, beschriftete Markisen und sichtbare Fassadenbereiche: PixelRing reinigt die Außenwirkung Ihres Standorts und hält sichtbare Schäden fest, bevor daraus ein Reparaturfall wird.` (Для загрязненных вывесок, световых коробов, маркиз с надписью и видимых фасадных зон: PixelRing очищает внешний вид вашей локации и фиксирует видимые повреждения до того, как они станут ремонтом.)

Recommended CTA (призыв к действию):

`Reinigung anfragen` (запросить очистку)

Secondary CTA (вторичный призыв к действию):

`Zustand prüfen lassen` (проверить состояние)

Placement:

- near `Werbeanlagen-Audit & Diagnose` (аудит и диагностика рекламных конструкций), because cleaning creates condition visibility;
- near `Werbeanlagen-Reparatur` (ремонт рекламных конструкций), because dirty surfaces may hide damage;
- before or near `Druck & Branding` (печать и брендинг), because branded awnings and storefront graphics can lead to re-lettering or replacement.

## 10. Internal Linking Strategy (стратегия внутренней перелинковки)

From the new service page:

- link to `Werbeanlagen-Reparatur` (ремонт рекламных конструкций) when cleaning reveals broken parts, water damage, LED issues, cracks, or loose fixings;
- link to `Werbeanlagen-Audit & Diagnose` (аудит и диагностика рекламных конструкций) when the customer has several locations or is unsure whether cleaning, repair, or replacement is needed;
- link to `Druck & Branding` (печать и брендинг) when branded textile, film, lettering, or print surfaces are too faded or damaged;
- link to `LED-Modernisierung` (LED-модернизация) when a lightbox or illuminated sign remains uneven, yellowed, or weak after cleaning.

Future problem-article candidates:

- `markise-verschmutzt` (маркиза загрязнена);
- `werbeanlage-verschmutzt` (рекламная конструкция загрязнена);
- `markise-ausgeblichen-oder-fleckig` (маркиза выцвела или покрылась пятнами);
- `werbeschild-schmutzfilm` (грязная пленка на вывеске);
- `folie-nach-reinigung-beschaedigt` (пленка повреждена после очистки).

## 11. Claim Safety (безопасность публичных обещаний)

Allowed public claims:

- professional, material-aware cleaning;
- photo-based first assessment;
- cleaning of branded awnings and visible outdoor advertising surfaces;
- visual condition notes after cleaning;
- case-by-case recommendation for repair, replacement, re-lettering, or impregnation;
- planning of access, timing, and surface protection.

Avoid until operationally verified:

- "chemical-free" or "environmentally harmless" as absolute claims;
- fixed price tables for all awnings or signs;
- guaranteed removal of mold, algae, bird droppings, old stains, or UV fading;
- "all heights" or "same-day" promises;
- electrical cleaning near active parts without safe shutdown language;
- wastewater/legal handling claims beyond "site-specific planning".

Recommended safety phrase:

`Wir stimmen Methode, Zugang und Material vorab ab. Bei Leuchtwerbung, Markisenstoffen, Folien oder Fassadenflächen prüfen wir zuerst, welche Reinigung sinnvoll und materialschonend möglich ist.` (Мы заранее согласуем метод, доступ и материал. Для световой рекламы, тканей маркиз, пленок или фасадных поверхностей сначала проверяем, какая очистка имеет смысл и возможна без лишнего риска для материала.)

## 12. Development Strategy (стратегия развития)

Stage 1 (этап 1): Positioning and page planning (позиционирование и планирование страницы)

- keep this document as the source of truth;
- use the route `/[locale]/leistungen/werbeanlagen-reinigung-markisenpflege` (страница очистки рекламных конструкций и ухода за маркизами) unless owner later chooses a shorter URL;
- keep German canonical page title focused on `Berlin & Brandenburg` (Берлин и Бранденбург);
- include `Markisenreinigung` (очистка маркиз) visibly for SEO, but keep commercial storefront context clear.

Stage 2 (этап 2): MVP page (минимальная версия страницы)

- add the dedicated service page;
- add the `Leistungen` (страница услуг) overview module;
- include DE copy first, then EN/RU/TR/PL/AR localization;
- include `FAQPage` (FAQ-разметка) and `Service` (услуга) structured data.

Stage 3 (этап 3): Proof and conversion (доказательства и конверсия)

- collect 3-5 before/after photos from real client work;
- add a photo-request checklist;
- add a simple seasonal service block for restaurants and retail.

Stage 4 (этап 4): SEO/GEO expansion (расширение поисковой и AI-видимости)

- create 2-3 problem articles around dirty awnings, dirty signs, and unsafe self-cleaning;
- add internal links from repair, audit, branding, and relevant problem articles;
- monitor Search Console after indexing for `Markisenreinigung Berlin` (очистка маркиз в Берлине), `Werbeanlagen-Reinigung Berlin` (очистка рекламных конструкций в Берлине), and related long-tail queries.

Stage 5 (этап 5): Service productization (упаковка услуги в продукт)

- turn repeat requests into seasonal `Pflegepaket` (пакет ухода) options for cafes, retail, and multi-location businesses;
- keep packages operationally conservative until actual access, equipment, supplier, and wastewater rules are confirmed.

## 13. Offer Design (упаковка предложения)

The page should not sell "cleaning" as a commodity. It should sell a business outcome:

`Ihre Außenwerbung wirkt wieder gepflegt, lesbar und einladend.` (Ваша наружная реклама снова выглядит ухоженной, читаемой и приглашает клиента.)

Recommended offer ladder:

1. `Foto-Check` (оценка по фото)
   - Customer sends photos of the sign, awning, lightbox, letters, storefront, access situation, and visible dirt.
   - PixelRing classifies whether this is simple exterior cleaning, material-sensitive cleaning, dismantling/interior cleaning, repair, or branding renewal.

2. `Reinigung & Sichtprüfung` (очистка и визуальная проверка)
   - Cleaning of the visible advertising surface and a basic visual condition note.
   - Suitable for dirty awnings, signs, lettering, lightboxes, and storefront advertising surfaces.

3. `Reinigung mit Demontagebedarf` (очистка с необходимостью разборки)
   - For lightboxes, illuminated letters, or internal dirt where the surface must be opened or partially dismantled.
   - Public copy should frame this carefully: if cleaning requires opening illuminated advertising, PixelRing checks the task and plans it as technical service, not as simple washing.

4. `Pflege plus Folgeempfehlung` (уход плюс рекомендация дальнейших работ)
   - If cleaning reveals faded fabric, damaged film, corrosion, water ingress, weak LEDs, or loose parts, the next step becomes repair, audit, branding, or modernization.

5. Future `Saison-Service` (сезонное обслуживание)
   - Optional later product for gastronomy and retail before spring/summer season or after winter.
   - Should not be launched as a fixed subscription until operations and pricing are verified.

Not the primary offer:

- private balcony awnings without business or public facade relevance;
- household textile cleaning;
- standalone chemical treatment or `Imprägnierung` (пропитка) without a cleaning/condition context;
- general facade cleaning unrelated to advertising, storefront, or business appearance.

## 14. Detailed Page Structure For Implementation (подробная структура страницы для внедрения)

This is the recommended section order for the future page.

### 14.1 Hero (первый экран)

Purpose (цель): immediately explain the service and make `Markisenreinigung` (очистка маркиз) visible without reducing PixelRing to a cleaning company.

Recommended H1 (главный заголовок):

`Werbeanlagen- & Markisenreinigung in Berlin & Brandenburg` (очистка рекламных конструкций и маркиз в Берлине и Бранденбурге)

Recommended subheadline (подзаголовок):

`PixelRing reinigt Schilder, Leuchtkästen, Profilbuchstaben, beschriftete Markisen und sichtbare Außenwerbung - mit Blick auf Material, Zugang und mögliche Schäden.` (PixelRing очищает вывески, световые короба, объемные буквы, маркизы с надписью и видимую наружную рекламу - с учетом материала, доступа и возможных повреждений.)

Hero CTA (призыв к действию):

- `Reinigung anfragen` (запросить очистку)
- secondary: `Fotos zur Einschätzung senden` (отправить фото для оценки)

Hero proof points:

- `Ein Ansprechpartner` (один ответственный контакт)
- `Berlin & Brandenburg` (Берлин и Бранденбург)
- `Foto-Check vor Ortstermin` (оценка по фото до выезда)
- `Reinigung, Sichtprüfung, nächste Empfehlung` (очистка, визуальная проверка, следующая рекомендация)

### 14.2 Problem Recognition Cards (карточки узнавания проблемы)

Cards should be clickable request starters, not SEO links.

Cards:

1. `Markise verschmutzt oder fleckig` (маркиза загрязнена или в пятнах)
2. `Leuchtkasten wirkt matt oder grau` (световой короб выглядит матовым или серым)
3. `Profilbuchstaben außen verschmutzt` (объемные буквы загрязнены снаружи)
4. `Schmutz sitzt innen in Buchstaben oder Kasten` (грязь внутри букв или короба)
5. `Schild, Paneel oder Pylon braucht Pflege` (вывеска, панель или пилон требуют ухода)
6. `Fassade rund um die Werbung ist verschmutzt` (фасад вокруг рекламы загрязнен)

### 14.3 Calculator (калькулятор)

Place calculator after problem cards or after service scope. It should help users describe the job and should generate a useful request summary.

See `15. Calculator Specification` (спецификация калькулятора) below.

### 14.4 Service Scope (объем услуги)

Explain what PixelRing can assess and clean:

- `Markisen` (маркизы): branded awnings, restaurant awnings, shop awnings, logo or text awnings.
- `Leuchtkästen` (световые короба): front surfaces, frames, visible dirt, interior dirt if access/opening is needed.
- `Profilbuchstaben` (объемные буквы): exterior surfaces and cases where internal cleaning requires dismantling.
- `Schilder, Paneele, Pylone` (вывески, панели, пилоны): visible surfaces and mounting surroundings.
- `Folien und Beschriftungen` (пленки и надписи): careful assessment because wrong cleaning can damage edges or adhesive.
- `Fassadennahe Bereiche` (зоны вокруг фасадной рекламы): only when connected to visible advertising and operationally feasible.

### 14.5 Method And Boundaries (метод и границы)

Purpose (цель): build trust and reduce wrong expectations.

Topics:

- material check before cleaning;
- no aggressive high-pressure promise;
- access and equipment planning;
- electrical/light advertising caution;
- visible condition notes;
- no guaranteed removal of every stain or UV fading;
- `Imprägnierung` (пропитка) only as a later case-by-case topic.

### 14.6 What Happens After Cleaning (что происходит после очистки)

Show the service bridge:

- if the surface is only dirty: customer gets cleaned visible advertising;
- if textile is faded: route to replacement/branding discussion;
- if film edges are damaged: route to `Druck & Branding` (печать и брендинг);
- if LEDs, wiring, or moisture are involved: route to `Werbeanlagen-Reparatur` (ремонт рекламных конструкций);
- if several locations are involved: route to `Werbeanlagen-Audit & Diagnose` (аудит и диагностика рекламных конструкций).

### 14.7 FAQ (частые вопросы)

Required FAQ questions:

1. `Reinigt PixelRing auch Markisen?` (очищает ли PixelRing маркизы?)
2. `Geht es auch um Markisen ohne Werbung?` (можно ли обратиться с маркизой без рекламы?)
3. `Kann eine Leuchtreklame einfach mit Wasser gereinigt werden?` (можно ли просто очистить световую рекламу водой?)
4. `Was ist, wenn Schmutz innen in Buchstaben oder Leuchtkästen sitzt?` (что делать, если грязь внутри букв или световых коробов?)
5. `Bietet PixelRing Imprägnierung an?` (предлагает ли PixelRing пропитку?)
6. `Kann ich vorab Fotos senden?` (можно ли заранее отправить фото?)
7. `Arbeitet PixelRing nur in Berlin?` (работает ли PixelRing только в Берлине?)
8. `Wann reicht Reinigung nicht mehr aus?` (когда очистки уже недостаточно?)

### 14.8 Final CTA (финальный призыв к действию)

Use the existing compact dark image CTA pattern from the Leistungen pages.

Recommended headline:

`Ihre Außenwerbung soll wieder gepflegt wirken?` (Ваша наружная реклама должна снова выглядеть ухоженно?)

Recommended CTA:

`Fotos senden und Reinigung anfragen` (отправить фото и запросить очистку)

## 15. Calculator Specification (спецификация калькулятора)

Purpose (цель): help the customer describe the cleaning task and help PixelRing route the request.

The calculator must be a non-binding estimator. It should not promise a fixed price.

Recommended public label:

`Reinigungsaufwand einschätzen` (оценить сложность очистки)

### 15.1 Inputs (поля)

1. `Was soll gereinigt werden?` (что нужно очистить?)
   - `Markise` (маркиза)
   - `Schild / Paneel / Pylon` (вывеска / панель / пилон)
   - `Leuchtkasten außen` (световой короб снаружи)
   - `Profilbuchstaben außen` (объемные буквы снаружи)
   - `Buchstaben oder Leuchtkasten innen` (буквы или световой короб внутри)
   - `Fassade rund um Werbung` (фасад вокруг рекламы)

2. `Größe oder Umfang` (размер или объем)
   - small: up to 2 m wide or one compact element;
   - medium: 2-5 m wide or several elements;
   - large: more than 5 m wide, several sides, or multiple objects;
   - multi-location: several addresses.

3. `Verschmutzung` (загрязнение)
   - light dust/rain streaks;
   - visible dirt, traffic film, bird droppings;
   - algae/mold-like stains, old deposits, sticky residues;
   - unknown, photos available.

4. `Zugang` (доступ)
   - reachable from ground;
   - ladder or low access likely;
   - lift/platform likely;
   - unclear access, photos needed.

5. `Technischer Aufwand` (техническая сложность)
   - exterior surface only;
   - sensitive film/textile/acrylic;
   - electrical/light advertising nearby;
   - opening/dismantling likely.

6. `Zeitfenster` (временное окно)
   - normal appointment;
   - before opening hours;
   - outside business hours;
   - seasonal deadline.

### 15.2 Output Logic (логика результата)

Output should show:

- effort category: `Einfach` (простая), `Materialsensibel` (требует учета материала), `Mit Zugangstechnik` (с техникой доступа), `Technisch prüfen` (нужна техническая проверка);
- likely next step: send photos, request appointment, or combine with audit/repair;
- short generated request summary that can prefill the request drawer;
- disclaimer: `Die Einschätzung ist unverbindlich und ersetzt kein Angebot nach Foto- oder Vor-Ort-Prüfung.` (Оценка не является обязательным предложением и не заменяет предложение после проверки фото или осмотра на месте.)

### 15.3 Routing Rules (правила маршрутизации)

- If object is `Buchstaben oder Leuchtkasten innen` (буквы или световой короб внутри), suggest technical check because opening/dismantling may be needed.
- If access is lift/platform likely, suggest photo assessment for access planning.
- If contamination is old stains, mold-like deposits, or UV fading, avoid guarantee language and explain that cleaning result depends on material condition.
- If multi-location, suggest `Werbeanlagen-Audit & Diagnose` (аудит и диагностика рекламных конструкций) or seasonal service planning.
- If electrical/light advertising is involved, suggest safe technical handling and do not encourage self-cleaning.

## 16. Image Generation Plan (план генерации изображений)

Real project photos are not available yet. Use generated images for the first implementation, then replace with real before/after assets when available.

General image rules:

- no real third-party brand names;
- no fake customer names that look like real businesses;
- use generic fictional signage or subtle PixelRing/service wording;
- avoid unsafe scenes such as workers standing dangerously on ladders or spraying water into active electrical signs;
- show commercial storefront context, not residential balcony awnings;
- keep Berlin-like street atmosphere without depicting a specific protected building or recognizable real storefront.

### 16.1 Hero Image (шапка страницы)

Purpose (цель): immediately show a commercial awning/signage cleaning service.

Recommended aspect ratio:

- desktop: 16:9 or 3:2;
- mobile crop safe: center subject and keep text-free margins.

Prompt:

```text
Realistic editorial photo of a Berlin street-level cafe storefront with a branded fabric awning and exterior sign being professionally cleaned by a small signage service team. One worker uses a soft brush and low-pressure cleaning method on the awning fabric, another checks a nearby lightbox sign surface. Modern European urban storefront, clean but realistic, cloudy daylight, no readable real brand names, no unsafe ladder posture, no water sprayed into electrical parts, professional service vehicle partially visible, premium but practical look, natural colors, high detail, documentary style, 16:9.
```

Suggested filename:

`werbeanlagen-markisenreinigung-berlin-hero.webp`

Suggested DE alt text:

`PixelRing reinigt eine beschriftete Markise und Außenwerbung an einem Berliner Geschäft.` (PixelRing очищает маркизу с надписью и наружную рекламу на берлинском магазине.)

### 16.2 Footer CTA Image (изображение финального CTA)

Use either the hero image with darker crop or generate a separate close-up.

Prompt:

```text
Close-up realistic photo of a freshly cleaned commercial awning and illuminated shop sign on a Berlin storefront after professional cleaning. The fabric awning looks renewed but not artificial, the sign surface is clean, subtle evening light, no real brand names, no text overlays, premium service-company mood, suitable for a dark CTA background, 16:9.
```

Suggested filename:

`werbeanlagen-markisenreinigung-footer-cta.webp`

### 16.3 Calculator / Task Visuals (визуалы для калькулятора и карточек задач)

Generate 4-6 smaller images or use one composite grid.

Prompts:

1. `Markise verschmutzt` (маркиза загрязнена):

```text
Realistic close-up of a commercial fabric awning above a small cafe storefront, visible rain streaks and street dust, no real brand names, Berlin urban context, documentary photo, no people, 4:3.
```

2. `Leuchtkasten außen` (световой короб снаружи):

```text
Realistic close-up of an exterior lightbox sign on a shop facade with grey dirt film and clean test strip, no real brand, acrylic and metal frame visible, professional signage maintenance context, 4:3.
```

3. `Profilbuchstaben außen` (объемные буквы снаружи):

```text
Realistic exterior channel letters mounted on a storefront facade, visible dust and weather marks on letter faces and sides, no readable real brand, commercial Berlin street setting, 4:3.
```

4. `Buchstaben innen` (буквы внутри):

```text
Realistic technical service photo of an opened illuminated channel letter on a workbench or safely accessed facade, dust visible inside the letter, LED modules and wiring visible but not being touched with water, professional signage maintenance, no real brand, 4:3.
```

5. `Fassadennahe Reinigung` (очистка зоны вокруг фасадной рекламы):

```text
Realistic photo of a storefront facade area around an exterior sign with rain runoff streaks and dirt marks, professional cleaning preparation, no real brand names, European city street context, 4:3.
```

### 16.4 Proof / Before-After Placeholder (блок доказательства до/после)

Until real proof exists, avoid labeling generated images as actual customer results.

Allowed label:

`Beispielhafte Darstellung` (примерная иллюстрация)

Avoid:

- `Vorher/Nachher aus Kundenprojekt` (до/после из клиентского проекта) unless it is real;
- fake testimonials;
- fake addresses or client names.

## 17. Next-Chat Execution Plan (план выполнения для следующего чата)

Use this sequence when starting implementation work.

Stage A (этап A): Confirm final page decisions

- final route: keep `/leistungen/werbeanlagen-reinigung-markisenpflege` (страница очистки рекламных конструкций и ухода за маркизами) or shorten to `/leistungen/werbeanlagen-reinigung` (страница очистки рекламных конструкций);
- final H1 (главный заголовок);
- whether the overview `/leistungen` (страница услуг) module is a new card, a full band, or both;
- whether generated hero images are ready.

Stage B (этап B): Produce public copy

- write DE canonical copy first;
- then localize EN/RU/TR/PL/AR;
- preserve Arabic RTL (направление справа налево для арабского);
- keep all public claims within `Claim Safety` (безопасность публичных обещаний).

Stage C (этап C): Generate/review images

- generate hero image;
- generate footer CTA image;
- generate task/calculator visuals if the first build uses visual cards;
- owner reviews images before they are placed into the application.

Stage D (этап D): Implementation brief

- inspect current `signage-service/src/app/[locale]/leistungen/[slug]/page.tsx` (общий шаблон страниц услуг);
- inspect `signage-service/src/app/[locale]/leistungen/page.tsx` (главная страница услуг);
- decide whether this page should use the shared dynamic service detail route or a dedicated route like the repair page;
- define calculator component scope.

Stage E (этап E): Application implementation

- add the route/page;
- add service content for DE/EN/RU/TR/PL/AR;
- add calculator;
- add overview module/card on `/leistungen` (страница услуг);
- update header/service menus only if approved;
- update sitemap/SEO route lists;
- add structured data.

Stage F (этап F): Verification

- run targeted lint;
- run production build if code changes are broad enough;
- verify all six locale URLs render;
- verify one H1 (один главный заголовок);
- verify no horizontal overflow on mobile, especially DE long words and AR RTL (арабский справа налево);
- verify JSON-LD (структурированные данные);
- verify calculator request summary;
- verify all new internal links return 200.

### 17.1 Implementation Alignment Brief (бриф выравнивания с существующими страницами услуг)

Use this brief before code work so the new cleaning service page fits the current `Leistungen` (страница услуг) system instead of becoming a visually special one-off page.

#### Current service-page architecture

There are three relevant implementation surfaces:

1. `signage-service/src/app/[locale]/leistungen/page.tsx` (главная страница услуг)
   - This is the services overview.
   - It already includes the service intent `reinigung-pflege` (очистка и уход) as part of the broader service taxonomy.
   - The new cleaning page should be added here as a normal service card/module, not as a separate oversized campaign band for the first MVP.

2. `signage-service/src/app/[locale]/leistungen/werbeanlagen-reparatur/page.tsx` (страница ремонта рекламных конструкций)
   - This is the richest current service page and should be treated as the pattern source for high-intent interactive service pages.
   - It uses a dedicated route, `LeistungenRepairHeroSlider`, interactive task/symptom cards, a drawer request flow, problem links, proof/diagnostic blocks, scope sections, FAQ, JSON-LD, and `LeistungenFooterCTA`.
   - Do not copy its repair-specific content, calculator logic, proof strip, or diagnostic prototype blindly.

3. `signage-service/src/app/[locale]/leistungen/[slug]/page.tsx` (общий шаблон соседних страниц услуг)
   - This is the shared template for neighboring service pages.
   - It provides the standard rhythm: hero, optional decision tool, problem links, task cards, checks, process, boundaries, FAQ, related services, and footer CTA.
   - The cleaning page should visually align with this section rhythm and spacing unless there is a clear conversion reason to reuse a richer repair-page component.

#### Recommended implementation approach

Create `/[locale]/leistungen/werbeanlagen-reinigung` (страница очистки рекламных конструкций) as a dedicated service page, but reuse existing service-page design language.

Preferred approach:

- Use `LeistungenRepairHeroSlider` for the hero so the new page visually matches current service-detail pages.
- Reuse the repair page's interactive-card idea for cleaning task recognition, but create a cleaning-specific component or generalized workflow. Do not rename the repair workflow internally if it stays repair-specific.
- Use a drawer request flow based on `LeistungenProblemDrawer` so task cards can open a request form with a prefilled cleaning summary.
- Add a cleaning-specific estimator that outputs effort/routing categories, not prices.
- Use `LeistungenFooterCTA` for the final CTA with a cleaning-specific image once approved.
- Keep section colors and card styles close to current pages: `#F7F1E8`, `#FFFDF9`, `#F8FAFC`, `#0E1A2B`, and the existing accent `#B8643E`.

#### What to reuse

- Header/Footer CMS loading pattern from service pages.
- `LeistungenRepairHeroSlider` for hero consistency.
- `LeistungenProblemDrawer` for request intake drawer.
- `LeistungenFooterCTA` for the final compact dark image CTA.
- JSON-LD patterns from repair and generic service pages: `Service`, `LocalBusiness` / `ProfessionalService`, `BreadcrumbList`, `FAQPage`, and `hasOfferCatalog`.
- Internal-link card styling from repair problem links and `[slug]` pages.

#### What not to reuse blindly

- Do not copy `LeistungenRepairCostEstimator`; it is repair-oriented, price-oriented, and currently only DE/RU.
- Do not use repair defect labels such as `Trafo`, `Kurzschluss`, `LED-Modul-Tausch`, or `Neon-Reparatur` as cleaning task categories.
- Do not reuse the repair proof strip until real cleaning before/after photos exist.
- Do not present generated images as customer proof.
- Do not add a separate large `/leistungen` overview band in the first pass; start with a normal service card/module.
- Do not expose internal execution details such as partner use, equipment rental, or specialist sourcing in public copy.

#### Cleaning-specific interactive scope

The cleaning task cards should be request starters, not SEO links. Suggested cards:

1. `Markise verschmutzt oder fleckig` (маркиза загрязнена или в пятнах)
2. `Leuchtkasten wirkt matt oder grau` (световой короб выглядит матовым или серым)
3. `Profilbuchstaben außen verschmutzt` (объемные буквы загрязнены снаружи)
4. `Schmutz sitzt innen in Buchstaben oder Kasten` (грязь внутри букв или короба)
5. `Schild, Paneel oder Pylon braucht Pflege` (вывеска, панель или пилон требует ухода)
6. `Fassade rund um die Werbung ist verschmutzt` (фасад вокруг рекламы загрязнен)
7. Fallback: `Nicht sicher? Fotos senden` (не уверены? отправьте фото)

Each card should prefill the request drawer with a short cleaning-oriented summary, for example:

`Aufgabe: Reinigung / Pflege. Objekt: beschriftete Markise. Sichtbares Problem: Flecken, Schmutz oder Verfärbung. Fotos vorhanden.` (задача: очистка/уход; объект: маркиза с надписью; видимая проблема: пятна, грязь или изменение цвета; фото есть.)

#### Cleaning estimator scope

Build a new estimator with non-binding categories only.

Inputs:

- object type: awning, sign/panel/pylon, exterior lightbox, exterior channel letters, interior lightbox/letters, facade-adjacent area;
- size/scope: small, medium, large, multi-location;
- dirt level: light dust/rain streaks, visible traffic dirt/bird droppings, algae/mold-like stains/old deposits, unknown with photos;
- access: ground, ladder/low access, lift/platform likely, unclear;
- technical complexity: exterior only, sensitive textile/film/acrylic, electrical/light advertising nearby, opening/dismantling likely;
- timing: normal appointment, before opening, outside business hours, seasonal deadline.

Outputs:

- `Einfach` (простая)
- `Materialsensibel` (требует учета материала)
- `Mit Zugangstechnik` (с техникой доступа)
- `Technisch prüfen` (нужна техническая проверка)

The estimator must not show fixed prices or imply guaranteed stain removal.

#### First implementation order

1. Add the cleaning page content in DE first.
2. Add EN/RU/TR/PL/AR localizations after DE copy is approved.
3. Add generated hero/footer images only after owner review.
4. Add the route to SEO/sitemap route lists.
5. Add the service card/module to `/leistungen`.
6. Add JSON-LD and verify rendered schema.
7. Verify mobile layout and Arabic RTL.

#### Current local preview caveat

During the planning review on 2026-06-28, the already running local dev server on port `3000` returned a `404` with stale `SayLeed` metadata even for `/de` and `/de/leistungen/werbeanlagen-reparatur`. The code files for the PixelRing service pages exist and were reviewed directly, but visual browser verification of the current page state was not reliable in that session. Before final implementation QA, restart or correct the local dev server and verify the actual rendered pages.

### 17.2 Landing-Page Structural Audit (структурный аудит посадочной страницы) - 2026-06-29

This section records the SEO/sales review (SEO-аудит и анализ продаж) after the first implementation pass for `/[locale]/leistungen/werbeanlagen-reinigung` (страница очистки рекламных конструкций) and the comparison with the stronger existing `/[locale]/leistungen/werbeanlagen-reparatur` (страница ремонта рекламных конструкций).

#### 17.2.1 Reviewed Examples (просмотренные примеры)

Reviewed code examples:

- [`signage-service/src/app/[locale]/leistungen/werbeanlagen-reparatur/page.tsx`](../../signage-service/src/app/%5Blocale%5D/leistungen/werbeanlagen-reparatur/page.tsx) - current reference page for `Werbeanlagen-Reparatur` (ремонт рекламных конструкций).
- [`signage-service/src/components/leistungen/LeistungenReparaturWorkflow.tsx`](../../signage-service/src/components/leistungen/LeistungenReparaturWorkflow.tsx) - current `Welcher Fall passt zu Ihrer Werbeanlage?` (какой случай подходит к вашей рекламной конструкции?) interaction pattern.
- [`signage-service/src/app/[locale]/leistungen/werbeanlagen-reinigung/page.tsx`](../../signage-service/src/app/%5Blocale%5D/leistungen/werbeanlagen-reinigung/page.tsx) - first implementation pass for `Werbeanlagen-Reinigung` (очистка рекламных конструкций).
- [`signage-service/src/components/leistungen/LeistungenRepairHeroSlider.tsx`](../../signage-service/src/components/leistungen/LeistungenRepairHeroSlider.tsx) - shared hero component (общий hero-компонент первого экрана) used by both pages.
- [`signage-service/src/components/sections/LeistungenFooterCTA.tsx`](../../signage-service/src/components/sections/LeistungenFooterCTA.tsx) - shared final CTA (финальный призыв к действию) component.

Reviewed local preview URLs:

- `http://localhost:3000/de/leistungen/werbeanlagen-reparatur` (`Werbeanlagen-Reparatur` / ремонт рекламных конструкций) for page rhythm and block order.
- `http://localhost:3000/de/leistungen/werbeanlagen-reinigung` (`Werbeanlagen-Reinigung` / очистка рекламных конструкций) for current first implementation.
- `http://localhost:3000/ru/leistungen/werbeanlagen-reinigung` (`Werbeanlagen-Reinigung` / очистка рекламных конструкций) for localized RU review.

#### 17.2.2 Professional Diagnosis (профессиональный вывод)

The existing `Werbeanlagen-Reparatur` (ремонт рекламных конструкций) page is structurally stronger because it answers the visitor's first operational question immediately after the hero:

`Welcher Fall passt zu Ihrer Werbeanlage?` (какой случай подходит к вашей рекламной конструкции?)

That block works because a repair visitor usually does not know the technical defect. The page lets them recognize a symptom, choose a similar case, and start a request. It is not only SEO content (SEO-контент); it is also a sales intake bridge (мост к заявке).

The first implementation of `Werbeanlagen-Reinigung` (очистка рекламных конструкций) currently has this order:

1. Hero (первый экран)
2. `Welche Aufgaben die Reinigung abdecken kann` (какие задачи может покрывать очистка)
3. `Reinigung ersetzt keine Reparatur` (очистка не заменяет ремонт)
4. `Wenn beim Reinigen mehr sichtbar wird` (если при очистке становится видно больше)
5. FAQ (частые вопросы)
6. Final CTA (финальный призыв к действию)

This order is too documentation-like. It explains the page, then moves into boundaries too early. It does not first help the visitor recognize their own situation.

#### 17.2.3 What The First Block Must Answer (на какой вопрос должен отвечать первый блок)

After the hero, the first block should answer:

`Reinigt PixelRing genau meinen Fall?` (очищает ли PixelRing именно мой случай?)

For search and conversion, the visitor's mental model is usually not "service scope" (объем услуги). It is a visible problem:

- `Markise verschmutzt oder fleckig` (маркиза загрязнена или в пятнах)
- `Markisenreinigung Berlin` (очистка маркиз в Берлине)
- `Leuchtkasten wirkt matt oder grau` (световой короб выглядит матовым или серым)
- `Profilbuchstaben außen verschmutzt` (объемные буквы загрязнены снаружи)
- `Schmutz sitzt innen in Buchstaben oder Kasten` (грязь внутри букв или светового короба)
- `Schild, Paneel oder Pylon braucht Pflege` (вывеска, панель или пилон требует ухода)
- `Fassade rund um die Werbung ist verschmutzt` (фасад вокруг рекламы загрязнен)

Therefore the first post-hero block should be a problem-recognition block (блок узнавания проблемы), not a general scope block (общий блок объема услуги).

Recommended first post-hero H2 (заголовок второго уровня):

`Welcher Reinigungsfall passt zu Ihrem Standort?` (какой случай очистки подходит вашему объекту?)

Recommended purpose:

- confirm that the page covers `Markisenreinigung` (очистка маркиз), `Werbeanlagen-Reinigung` (очистка рекламных конструкций), `Leuchtkasten-Reinigung` (очистка световых коробов), and cleaning around visible storefront advertising;
- show that this is a commercial storefront service (сервис для коммерческих фасадов), not a household cleaning lead page;
- create request starters for the future drawer flow (сценарий заявки через выезжающую форму), similar in spirit to `LeistungenReparaturWorkflow` (workflow ремонта), but cleaning-specific.

#### 17.2.4 Recommended Revised Block Order (рекомендуемый порядок блоков)

Recommended page order:

1. Hero (первый экран)
   - H1 (главный заголовок): `Werbeanlagen- & Markisenreinigung in Berlin & Brandenburg` (очистка рекламных конструкций и маркиз в Берлине и Бранденбурге)
   - Purpose: confirm service, region, and request path immediately.

2. Problem Recognition Cards (карточки узнавания проблемы)
   - H2 (заголовок второго уровня): `Welcher Reinigungsfall passt zu Ihrem Standort?` (какой случай очистки подходит вашему объекту?)
   - Purpose: match the visitor's visible problem and create a request starter.
   - Cards:
     - `Markise verschmutzt oder fleckig` (маркиза загрязнена или в пятнах)
     - `Leuchtkasten wirkt matt oder grau` (световой короб выглядит матовым или серым)
     - `Profilbuchstaben außen verschmutzt` (объемные буквы загрязнены снаружи)
     - `Schmutz sitzt innen in Buchstaben oder Kasten` (грязь внутри букв или светового короба)
     - `Schild, Paneel oder Pylon braucht Pflege` (вывеска, панель или пилон требует ухода)
     - `Fassade rund um die Werbung ist verschmutzt` (фасад вокруг рекламы загрязнен)

3. Service Scope (объем услуги)
   - H2 (заголовок второго уровня): `Was PixelRing reinigen und prüfen kann` (что PixelRing может очистить и проверить)
   - Purpose: list objects and service boundaries after the visitor has recognized their case.

4. Photo Assessment / Request Prep (оценка по фото / подготовка заявки)
   - H2 (заголовок второго уровня): `Fotos reichen oft für die erste Einschätzung` (для первой оценки часто достаточно фото)
   - Purpose: explain what to send: photo, address, approximate size, access, material, timing.
   - This block is currently missing and should be added before limitations.

5. Method And Boundaries (метод и границы)
   - H2 (заголовок второго уровня): `Was Reinigung leisten kann - und was nicht` (что может очистка и чего она не может)
   - Purpose: prevent unsafe claims and wrong expectations.
   - This should not be the first explanatory block.

6. After-Cleaning Routing (маршрутизация после очистки)
   - H2 (заголовок второго уровня): `Wenn Reinigung nicht reicht` (если очистки недостаточно)
   - Purpose: route to `Werbeanlagen-Reparatur` (ремонт рекламных конструкций), `Druckprodukte & Branding` (печать и брендинг), `Lichtwerbung & LED-Modernisierung` (световая реклама и LED-модернизация), and `Montage & Demontage` (монтаж и демонтаж).

7. FAQ (частые вопросы)
   - Purpose: answer SEO/GEO (поисковая оптимизация и оптимизация для AI-ответов) questions about `Markisenreinigung` (очистка маркиз), light advertising cleaning, photos, access, and when repair is needed.

8. Final CTA (финальный призыв к действию)
   - Purpose: repeat the photo-based request path.

#### 17.2.5 Specific Problems In The Current Implementation (конкретные проблемы текущей реализации)

- Current H1 (главный заголовок) `Werbeanlagen-Reinigung für sichtbare Außenwerbung` (очистка рекламных конструкций для видимой наружной рекламы) is broad but misses `Markisenreinigung` (очистка маркиз) and `Berlin & Brandenburg` (Берлин и Бранденбург), both of which are important for intent and SEO.
- Current first block title `Welche Aufgaben die Reinigung abdecken kann` (какие задачи может покрывать очистка) sounds like an internal planning label, not a customer-facing landing-page promise.
- Current first block intro `Die Seite ist als erste Orientierung gedacht...` (страница задумана как первая ориентация...) is too meta; public copy should describe what PixelRing does and what the customer can send.
- `Reinigung ersetzt keine Reparatur` (очистка не заменяет ремонт) appears too early. It is correct and needed, but it should come after service-fit and photo-assessment blocks.
- There is no dedicated `Fotos reichen oft für die erste Einschätzung` (для первой оценки часто достаточно фото) block, even though photo intake is the conversion path and aligns with the existing `Werbeanlagen-Reparatur` (ремонт рекламных конструкций) page.
- The page currently has no cleaning-specific workflow (workflow для очистки) or drawer request starters (карточки, открывающие форму заявки). This can be a later implementation step, but the content structure should already prepare for it.

#### 17.2.6 Recommended Execution Order (рекомендуемый порядок выполнения)

**Status update 2026-06-29:** The DE copy (немецкий текст), cleaning workflow (интерактивный workflow очистки), cautious proof strip (иллюстративный блок визуального подтверждения), and final CTA image correction (исправление изображения финального призыва к действию) are now implemented for `/de/leistungen/werbeanlagen-reinigung` (немецкая страница очистки рекламных конструкций). The remaining active steps are owner visual review, EN/RU/TR/PL/AR localization (локализация на английский, русский, турецкий, польский, арабский), AR RTL QA (проверка арабского направления справа налево), and the later estimator (калькулятор/оценщик).

1. Revise DE copy first (сначала немецкий канонический текст):
   - H1 (главный заголовок)
   - hero subline (подзаголовок первого экрана)
   - first post-hero problem-recognition block (блок узнавания проблемы)
   - photo-assessment block (блок оценки по фото)
   - reordered section titles

2. Then localize EN/RU/TR/PL/AR (английский, русский, турецкий, польский, арабский):
   - Keep Arabic RTL (арабское направление справа налево) QA separate.
   - Preserve `Markisenreinigung` (очистка маркиз) concept in all languages even where the German keyword remains the SEO anchor.

3. Only then implement interactive workflow (интерактивный workflow):
   - Use the repair page's `LeistungenReparaturWorkflow` (workflow ремонта) as behavior inspiration.
   - Create `LeistungenCleaningWorkflow` (workflow очистки) or a generalized workflow component.
   - Use `LeistungenProblemDrawer` (выезжающая форма проблемы) with `initialIssueType="Maintenance"` (тип заявки "обслуживание") until the intake contract is intentionally expanded.

4. Add the estimator (калькулятор/оценщик) after the page's block order is stable:
   - It should output non-binding effort categories (необязательные категории сложности), not prices.

#### 17.2.7 Historical Prompt For The Next Agent (исторический промпт для следующего агента)

This prompt is kept only as history of the 2026-06-29 planning state. Do not reuse it as active implementation guidance because the DE restructure (немецкая реструктуризация), `LeistungenCleaningWorkflow` (интерактивный workflow очистки), and H1 correction (исправление главного заголовка) have since been implemented.

```text
You are working in /Users/macbookaleks/Documents/GitHub/PixelRingReparature.

Follow AGENTS.md. For application code, read signage-service/AGENTS.md and signage-service/package.json before editing. Do not make broad refactors. Work step by step and wait for owner confirmation before each substantial code edit.

Task: continue /[locale]/leistungen/werbeanlagen-reinigung (страница очистки рекламных конструкций) after the 2026-06-29 structural audit.

Read first:
- PROGRESS.md Context Beacon and latest checkpoint only.
- docs/07_content_ai_seo/README.md Context Beacon.
- docs/07_content_ai_seo/service_page_reinigung_werbeanlagen_markisen_plan.md sections 17.1 and 17.2.
- signage-service/src/app/[locale]/leistungen/werbeanlagen-reparatur/page.tsx, especially block order in <main>.
- signage-service/src/components/leistungen/LeistungenReparaturWorkflow.tsx for the "Welcher Fall passt zu Ihrer Werbeanlage?" pattern.
- signage-service/src/app/[locale]/leistungen/werbeanlagen-reinigung/page.tsx current implementation.

Goal for the next step:
Prepare and, after owner confirmation, implement a DE-first restructure of the cleaning page:
1. Change H1 to "Werbeanlagen- & Markisenreinigung in Berlin & Brandenburg" (очистка рекламных конструкций и маркиз в Берлине и Бранденбурге).
2. Shorten hero subline so it clearly says PixelRing cleans signs, lightboxes, channel letters, branded awnings, and visible outdoor advertising with attention to material, access, and possible damage.
3. Replace the current first post-hero block with "Welcher Reinigungsfall passt zu Ihrem Standort?" (какой случай очистки подходит вашему объекту?) and six recognition cards:
   - Markise verschmutzt oder fleckig
   - Leuchtkasten wirkt matt oder grau
   - Profilbuchstaben außen verschmutzt
   - Schmutz sitzt innen in Buchstaben oder Kasten
   - Schild, Paneel oder Pylon braucht Pflege
   - Fassade rund um die Werbung ist verschmutzt
4. Move the general service-scope explanation after the recognition cards under "Was PixelRing reinigen und prüfen kann" (что PixelRing может очистить и проверить).
5. Add a "Fotos reichen oft für die erste Einschätzung" (для первой оценки часто достаточно фото) block before boundaries.
6. Move/retitle boundaries to "Was Reinigung leisten kann - und was nicht" (что может очистка и чего она не может).
7. Keep no pricing, no real-proof claims, no fake before/after, no internal execution details.
8. Keep the existing image asset and final CTA unless owner asks otherwise.

Do not yet implement the full estimator or workflow drawer unless separately confirmed. After DE copy is accepted, localize EN/RU/TR/PL/AR and verify one H1, mobile overflow, AR RTL, JSON-LD, internal links, lint, and TypeScript.
```

## 18. Source Notes (источники)

- [Berlin.de, `Werbeanlagen` (рекламные конструкции)](https://www.berlin.de/ba-marzahn-hellersdorf/politik-und-verwaltung/aemter/stadtentwicklungsamt/bauaufsicht-wohnungsaufsicht-denkmalschutz/artikel.187791.php): broad definition of outdoor advertising visible from public traffic areas and procedural notes for Berlin advertising structures.
- [Grafikhane Werbetechnik, `Wartung und Reparatur` (обслуживание и ремонт)](https://grafikhane.de/produkte-leistungen/wartung-reparatur/): validates maintenance/prevention framing for Berlin outdoor advertising.
- [KKP Werbetechnik, `Reparatur und Wartung` (ремонт и обслуживание)](https://www.kkp-werbetechnik.de/Reparatur-und-Wartung): validates inside/outside cleaning as part of signage maintenance.
- [Mattern Neon, `Neon Reparatur Berlin` (ремонт неона в Берлине)](https://neon-licht-werbung.de/neon-reparatur-berlin-001/): validates access planning and `Wartung+Reinigung+Reparatur` (обслуживание + очистка + ремонт) in Berlin light advertising.
- [SMS Werbetechnik, `Wartung und Reparatur von Werbeanlagen` (обслуживание и ремонт рекламных конструкций)](https://www.sms-werbetechnik.de/dienstleistungen/werbeanlagen/wartung-und-reparatur/): validates cleaning of advertising system and mounting surface.
- [Turk Lichtwerbung und Kunst, `Wartung und Reinigung von Werbeanlagen` (обслуживание и очистка рекламных конструкций)](https://turk-lichtwerbung-kunst.de/werbeanlagen-wartung-reinigung.html): validates interval and branch-location logic.
- [markisenreinigung.com, `Markisenreinigung, Markisen Reparatur und Imprägnierung` (очистка, ремонт и пропитка маркиз)](https://markisenreinigung.com/): validates the German awning cleaning market.
- [Veys Gebäudereinigung, `Markisenreinigung und -imprägnierung` (очистка и пропитка маркиз)](https://www.veys.de/markisenreinigung-storenreinigung-impraegnierung/): validates weather, bird droppings, water repellency, and impregnation arguments.
- [Pemo Berlin, `Markisen als Werbeträger` (маркизы как рекламный носитель)](https://pemo-berlin.de/markisen/werbetraeger): validates branded awnings as business advertising and storefront identity.
- [Berliner Wasserbetriebe, `Einleitung von nicht häuslichem Abwasser` (сброс не бытовых сточных вод)](https://www.bwb.de/de/einleitung-von-nicht-haeuslichem-abwasser.php): safety/legal context for facade-cleaning wastewater.
- [DGUV Vorschrift 3 (правило DGUV для электрических установок и оборудования)](https://publikationen.dguv.de/widgets/pdf/download/article/1052): safety context for electrical systems and non-electrical work near electrical systems.
- [DGUV Information 208-019 (информация DGUV по безопасной работе с мобильными подъемными платформами)](https://www.bghm.de/fileadmin/user_upload/Arbeitsschuetzer/Gesetze_Vorschriften/Informationen/208-019.pdf): safety context for access planning and work at height.

## 19. Progress Log (журнал прогресса)

* **Date:** 2026-07-03
* **Current sprint/block:** `Reinigung & Pflege` (очистка и уход) before/after image implementation.
* **Done:**
  - Generated 12 high-quality, branded before/after image assets for the 6 cleaning cases (`awning` (маркиза), `lightbox` (световой короб), `letters` (объемные буквы), `inside` (внутренность короба), `sign` (вывеска/панель), `facade` (фасад вокруг вывески)) using `generate_image`, integrating the PixelRing logo and brand name into the physical signs and awnings.
  - Copied and renamed the generated images to the `signage-service/public/images/leistungen/werbeanlagen-reinigung/` directory.
  - Modified the component `LeistungenCleaningWorkflow.tsx` (компонент сценария очистки) to map the new before/after images (`CLEANING_VISUALS` (карта визуальных случаев очистки)) and implemented hover/pointer state tracking (`previewedCaseId` (идентификатор предпросматриваемого случая)) to toggle between "before" (до очистки) and "after" (после очистки) states, mirroring the repair workflow.
  - Verified `npm run lint` (линтинг) and `npm run build` (сборка проекта) completed successfully without any compilation errors.
* **In progress:** Visual verification in the local browser.
* **Next action:** User reviews the visual before/after changes.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/service_page_reinigung_werbeanlagen_markisen_plan.md`
  - `signage-service/src/components/leistungen/LeistungenCleaningWorkflow.tsx`

* **Date:** 2026-06-29
* **Current sprint/block:** `Reinigung & Pflege` (очистка и уход) approved two-pass implementation.
* **Done:**
  - Added `Cleaning` / `Reinigung / Pflege` (очистка / уход) as a public contact-form issue type without a database migration.
  - Extended `ContactModal` (контактное модальное окно), `LeistungenRequestButton` (кнопка заявки на странице услуг), and `LeistungenFooterCTA` (финальный призыв к действию) so hero/final CTA (первый и финальный призывы к действию) open the request form with cleaning-specific `initialIssueType="Cleaning"` (тип заявки "очистка") and prefilled cleaning context.
  - Changed `LeistungenCleaningWorkflow` (интерактивный workflow очистки) drawer requests from `Maintenance` (обслуживание) to `Cleaning` (очистка).
  - Strengthened the German hero copy with explicit `Berlin und Brandenburg` (Берлин и Бранденбург) while keeping the shorter H1 (главный заголовок) for visual stability.
  - Renamed the German secondary hero CTA to `Welche Fotos helfen?` (какие фото помогут?) because it scrolls to the photo checklist instead of opening an upload flow.
  - Added `Was hinter Verschmutzung sichtbar werden kann` (что может стать видно за загрязнением), a compact internal-link block to existing `Probleme & Lösungen` (проблемы и решения) pages.
  - Added the German FAQ (частые вопросы) entry for `Imprägnierung` (пропитка) without promising it as a standard service.
  - Localized workflow labels, recognition cases, drawer copy, proof-strip cases, internal-link copy, photo-checklist copy, and the `Cleaning` (очистка) contact-form label across EN/RU/TR/PL/AR (английский, русский, турецкий, польский, арабский).
  - Kept the current cleaning image asset only; no new visuals, generated assets, estimator (калькулятор/оценщик), prices, packages, guaranteed stain removal, all-heights, same-day, or marketplace claims were added.
  - Verified `npm run lint` (линтинг), `npm run build` (production build / производственная сборка), one H1 (один главный заголовок), canonical (каноническая ссылка), JSON-LD (структурированные данные), localized workflow/proof/internal-link/photo blocks, DE form prefill, and AR RTL (арабское направление справа налево) without horizontal overflow.
* **In progress:** Owner visual review of localized `/[locale]/leistungen/werbeanlagen-reinigung` (страница очистки рекламных конструкций).
* **Next action:** Decide whether to start the separate estimator (калькулятор/оценщик) phase after page review.
* **Blockers/risks:** The page still reuses one approved cleaning image across multiple visual contexts; this is intentional per owner decision, but real case-specific photos would improve credibility later.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/service_page_reinigung_werbeanlagen_markisen_plan.md`
  - `signage-service/src/app/[locale]/leistungen/werbeanlagen-reinigung/page.tsx`
  - `signage-service/src/components/common/ContactForm.tsx`
  - `signage-service/src/components/common/ContactModal.tsx`
  - `signage-service/src/components/leistungen/LeistungenCleaningWorkflow.tsx`
  - `signage-service/src/components/leistungen/LeistungenCleaningProofStrip.tsx`
  - `signage-service/src/components/leistungen/LeistungenRepairHeroSlider.tsx`
  - `signage-service/src/components/leistungen/LeistungenRequestButton.tsx`
  - `signage-service/src/components/sections/LeistungenFooterCTA.tsx`
  - `signage-service/messages/de.json`
  - `signage-service/messages/en.json`
  - `signage-service/messages/ru.json`
  - `signage-service/messages/tr.json`
  - `signage-service/messages/pl.json`
  - `signage-service/messages/ar.json`

* **Date:** 2026-06-29
* **Current sprint/block:** `Reinigung & Pflege` (очистка и уход) visual workflow correction after owner review.
* **Done:**
  - Replaced the static first-block recognition cards with `LeistungenCleaningWorkflow` (интерактивный workflow очистки) for the German `/de/leistungen/werbeanlagen-reinigung` (немецкая страница очистки рекламных конструкций) route.
  - Wired `LeistungenCleaningWorkflow` (интерактивный workflow очистки) into `LeistungenProblemDrawer` (выезжающая форма проблемы) with `initialIssueType="Maintenance"` (тип заявки "обслуживание") and cleaning-specific drawer copy.
  - Added `LeistungenCleaningProofStrip` (иллюстративный proof-strip / блок визуального подтверждения) after the workflow, with explicit service-scenario wording and no fake before/after claims.
  - Corrected the German `metaTitle` (SEO title / SEO-заголовок) to `Werbeanlagen- und Markisenreinigung Berlin-Brandenburg | PixelRing` (очистка рекламных конструкций и маркиз в Берлине-Бранденбурге) instead of the previous ampersand variant.
  - Changed the German H1 (главный заголовок) to `Werbeanlagen und Markisen reinigen lassen` (заказать очистку рекламных конструкций и маркиз), while keeping the Berlin-Brandenburg (Берлин-Бранденбург) location anchor in the SEO title (SEO-заголовок), metadata, and hero copy.
  - Updated the final CTA (финальный призыв к действию) to use the cleaning image asset instead of the repair image.
  - Verified `npm run lint` (линтинг), `npm run build` (production build / производственная сборка), rendered metadata, one H1 (один главный заголовок), no horizontal overflow (нет горизонтального переполнения), drawer opening, mobile layout, and desktop/mobile screenshots.
* **In progress:** Owner visual review of the German route after the workflow/proof correction.
* **Next action:** Review `/de/leistungen/werbeanlagen-reinigung` (немецкая страница очистки рекламных конструкций) in the browser; then decide whether to localize the new workflow/proof structure to EN/RU/TR/PL/AR (английский, русский, турецкий, польский, арабский) before adding the estimator (калькулятор/оценщик).
* **Blockers/risks:** Only one approved cleaning image asset exists, so the workflow uses differentiated crops rather than real case-specific photos; do not claim real proof, before/after, guaranteed stain removal, prices, all-heights capability, same-day service, or unverified eco claims.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/service_page_reinigung_werbeanlagen_markisen_plan.md`
  - `signage-service/src/app/[locale]/leistungen/werbeanlagen-reinigung/page.tsx`
  - `signage-service/src/components/leistungen/LeistungenCleaningWorkflow.tsx`
  - `signage-service/src/components/leistungen/LeistungenCleaningProofStrip.tsx`

* **Date:** 2026-06-29
* **Current sprint/block:** `Reinigung & Pflege` (очистка и уход) first implementation pass after owner confirmation.
* **Done:**
  - Implemented the approved DE-first (сначала немецкая версия) restructure for `/[locale]/leistungen/werbeanlagen-reinigung` (страница очистки рекламных конструкций).
  - Updated the German H1 (главный заголовок) to `Werbeanlagen- & Markisenreinigung in Berlin & Brandenburg` (очистка рекламных конструкций и маркиз в Берлине и Бранденбурге).
  - Added the first post-hero (первый блок после hero) problem-recognition section `Welcher Reinigungsfall passt zu Ihrem Standort?` (какой случай очистки подходит вашему объекту?) with six static cards.
  - Moved the general service-scope explanation after the recognition cards under `Was PixelRing reinigen und prüfen kann` (что PixelRing может очистить и проверить).
  - Added `Fotos reichen oft für die erste Einschätzung` (для первой оценки часто достаточно фото) before the boundaries section.
  - Retitled boundaries to `Was Reinigung leisten kann - und was nicht` (что может очистка и чего она не может) and routing to `Wenn Reinigung nicht reicht` (если очистки недостаточно).
  - Expanded the German FAQ (частые вопросы) around `Markisenreinigung` (очистка маркиз), Berlin & Brandenburg (Берлин и Бранденбург), light advertising safety, internal dirt, photo intake, and expectation boundaries.
  - Added `/leistungen/werbeanlagen-reinigung` (страница очистки рекламных конструкций) to the sitemap source list.
  - Verified `npm run lint` (линтинг) and `npm run build` (production build / производственная сборка).
* **In progress:** Owner visual review of the updated German route before EN/RU/TR/PL/AR (английский, русский, турецкий, польский, арабский) localization.
* **Next action:** Review `/de/leistungen/werbeanlagen-reinigung` (немецкая страница очистки рекламных конструкций) on desktop/mobile; then localize the new structure to EN/RU/TR/PL/AR (английский, русский, турецкий, польский, арабский), including AR RTL (арабское направление справа налево) QA.
* **Blockers/risks:** Do not add the workflow drawer (выезжающая форма) or estimator (калькулятор/оценщик) until separately approved; no prices, fake proof, guaranteed stain removal, same-day/all-heights promises, or unverified eco claims.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/service_page_reinigung_werbeanlagen_markisen_plan.md`
  - `signage-service/src/app/[locale]/leistungen/werbeanlagen-reinigung/page.tsx`
  - `signage-service/src/lib/seo.ts`

* **Date:** 2026-06-29
* **Current sprint/block:** `Reinigung & Pflege` (очистка и уход) landing-page structure and SEO/sales audit.
* **Done:**
  - Documented the post-implementation structural audit for `/[locale]/leistungen/werbeanlagen-reinigung` (страница очистки рекламных конструкций).
  - Linked the reviewed examples: `werbeanlagen-reparatur` (ремонт рекламных конструкций), `LeistungenReparaturWorkflow` (workflow ремонта), current cleaning page, shared hero, and final CTA.
  - Defined the professional first-block role: answer `Reinigt PixelRing genau meinen Fall?` (очищает ли PixelRing именно мой случай?) before broad service scope or limitations.
  - Recommended a revised block order: hero, problem-recognition cards, service scope, photo assessment, method/boundaries, after-cleaning routing, FAQ, final CTA.
  - Added a ready prompt for the next implementation agent.
* **In progress:** Owner review of the recommended DE-first restructure before application code changes.
* **Next action:** After confirmation, implement the DE-first rewrite of hero copy and the first post-hero blocks, then localize EN/RU/TR/PL/AR (английский, русский, турецкий, польский, арабский).
* **Blockers/risks:** Do not over-copy repair-specific logic; do not add prices; do not claim real proof without real cleaning photos; generated images must stay illustrative; boundaries should not appear before service-fit and photo-assessment.
* **Updated documents:**
  - `docs/07_content_ai_seo/service_page_reinigung_werbeanlagen_markisen_plan.md`

* **Date:** 2026-06-28
* **Current sprint/block:** `Reinigung & Pflege` (очистка и уход) service strategy.
* **Done:**
  - Researched `Werbeanlagen-Reinigung` (очистка рекламных конструкций), `Markisenreinigung` (очистка маркиз), branded awnings, competitor positioning, and safety/legal constraints.
  - Defined the combined service concept around visible outdoor advertising, branded awnings, material-aware cleaning, and visual condition notes.
  - Proposed future route, page structure, `/leistungen` (страница услуг) overview module, keyword clusters, internal linking, and staged service development.
  - Added owner decisions: one accountable PixelRing service company, broad `Markisenreinigung` (очистка маркиз) SEO capture, no private-awning focus, no headline `Imprägnierung` (пропитка) offer, Berlin & Brandenburg SEO anchor, generated image plan, and calculator requirement.
  - Added detailed page structure, calculator specification, image prompts, and next-chat staged execution plan.
  - Added implementation alignment brief after reviewing the existing `werbeanlagen-reparatur` (ремонт рекламных конструкций) dedicated page, `/leistungen` (страница услуг) overview, and shared `[slug]` service-detail template.
* **In progress:** Implementation brief and owner review before code work.
* **Next action:** Prepare the code-level implementation brief: exact files, component strategy, data model additions, service-card placement, structured data, and verification checklist.
* **Blockers/risks:** Real proof photos are not yet available; cleaning method, equipment ownership/rental, access model, wastewater handling, pricing, and complex-case execution should stay operationally flexible in public copy.
* **Updated documents:**
  - `docs/07_content_ai_seo/service_page_reinigung_werbeanlagen_markisen_plan.md`
