# План: Навигация по статьям на странице статьи

## Цель

Добавить на каждую полную страницу статьи (`/[locale]/probleme-loesungen/[slug]`) панель навигации по всем опубликованным статьям раздела «Проблемы и решения». Текущая статья визуально выделяется. Навигация усиливает internal linking (SEO), контентный кластер (GEO) и удобство пользователя (UX).

---

## Текущая архитектура (обязательно прочитать)

### Файловая структура

```
signage-service/src/
├── app/[locale]/probleme-loesungen/
│   ├── page.tsx              ← обзорная страница (карточки, модалки)
│   └── [slug]/page.tsx       ← каноническая страница одной статьи
├── components/probleme-loesungen/
│   ├── ProblemArticleBody.tsx ← тело статьи + sidebar CTA + related
│   └── ProblemRequestButton.tsx
└── lib/cms/
    └── articles.ts           ← CMS-запросы, slug-маппинг, типы
```

### Маппинг slugов

В `articles.ts` (строки 53–63) определён маппинг CMS slug → public slug:

```typescript
export const PROBLEM_ARTICLE_SLUG_BY_CMS_SLUG: Record<string, string> = {
  'no-light': 'werbeanlage-leuchtet-nicht',
  'flicking': 'werbeanlage-flackert',
  'uneven-light': 'led-leuchtet-ungleichmaessig',
  'letter-out': 'buchstabe-leuchtet-nicht',
  'rain-fail': 'werbeanlage-schaltet-nach-regen-ab',
  'peeling-film': 'folie-loest-sich',
  'faded-film': 'folie-ist-ausgeblichen',
  'shaky-sign': 'werbeanlage-wackelt',
  'urgent-repair': 'dringende-reparatur-werbeanlage',
};
```

Обратный маппинг (public → CMS) строится автоматически на строке 65.

### Текущая страница статьи (`[slug]/page.tsx`)

- **Server Component** (async).
- Получает `locale` и `slug` из `params`.
- Загружает статью: `getPublishedSymptomArticleByPublicSlug(locale, slug)`.
- Загружает related articles (2–3 штуки) через `RELATED_MAP` + `getPublishedSymptomArticleTitlesByPublicSlugs`.
- Рендерит `<ProblemArticleBody>`, передавая `article`, `locale`, `problemIntent`, `relatedArticles`.

### Текущий компонент `ProblemArticleBody.tsx`

Layout (строка 280):
```
<div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px]">
  <div>               ← основной контент (shortAnswer + body + bullet sections)
  </div>
  <aside>              ← sidebar CTA (sticky, 320px)
  </aside>
</div>
```

Под grid — секция `relatedArticles` (строки 322–337).

### Локализация

Все UI-строки определены в `getArticleBodyLabels(locale)` (строки 12–106). Поддерживаются: `de`, `en`, `ru`, `tr`, `pl`, `ar`.

---

## Что нужно сделать

### Шаг 1: Новая функция в `articles.ts`

Создать функцию загрузки всех опубликованных SYMPTOM-статей для навигации.

**Файл:** `signage-service/src/lib/cms/articles.ts`

```typescript
/**
 * Loads title + publicSlug for ALL published symptom articles.
 * Used by the article-page navigation sidebar.
 */
export async function getAllPublishedSymptomArticleNavItems(
  locale: string
): Promise<Array<{ publicSlug: string; title: string; sortOrder: number }>> {
  const rows = await prisma.cmsArticle.findMany({
    where: {
      locale,
      type: CmsArticleType.SYMPTOM,
      status: 'PUBLISHED',
      deletedAt: null,
    },
    select: { slug: true, title: true, sortOrder: true },
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
  });

  return rows
    .map((r) => {
      const publicSlug = PROBLEM_ARTICLE_SLUG_BY_CMS_SLUG[r.slug];
      if (!publicSlug) return null;
      return { publicSlug, title: r.title, sortOrder: r.sortOrder };
    })
    .filter(Boolean) as Array<{ publicSlug: string; title: string; sortOrder: number }>;
}
```

**Почему отдельная функция, а не reuse:** `getPublishedSymptomArticleTitlesByPublicSlugs` принимает конкретный набор slugов. Навигации нужны ВСЕ статьи. Запрос дешёвый (select slug, title, sortOrder — без контента).

---

### Шаг 2: Загрузка навигации в `[slug]/page.tsx`

**Файл:** `signage-service/src/app/[locale]/probleme-loesungen/[slug]/page.tsx`

1. Импортировать `getAllPublishedSymptomArticleNavItems` из `@/lib/cms/articles`.
2. Добавить вызов в `Promise.all` (строка 83):

```typescript
const [globalCms, article, navItems] = await Promise.all([
  getGlobalPageCmsContent(locale),
  getPublishedSymptomArticleByPublicSlug(locale, slug),
  getAllPublishedSymptomArticleNavItems(locale),
]);
```

3. Передать `navItems` и текущий `slug` в `<ProblemArticleBody>`:

```tsx
<ProblemArticleBody
  locale={locale}
  article={article}
  problemIntent={problemIntent}
  relatedArticles={relatedArticles}
  navItems={navItems}
  currentSlug={slug}
/>
```

---

### Шаг 3: Расширить props `ProblemArticleBody`

**Файл:** `signage-service/src/components/probleme-loesungen/ProblemArticleBody.tsx`

Добавить в `ProblemArticleBodyProps` (строка 5):

```typescript
type ProblemArticleBodyProps = {
  locale: string;
  article: PublicProblemArticle;
  problemIntent: ProblemIntent;
  relatedArticles?: Array<{ publicSlug: string; title: string }>;
  navItems?: Array<{ publicSlug: string; title: string; sortOrder: number }>;
  currentSlug?: string;
};
```

---

### Шаг 4: Добавить label навигации

**Файл:** `signage-service/src/components/probleme-loesungen/ProblemArticleBody.tsx`

В `getArticleBodyLabels(locale)` добавить новый ключ `navTitle` в КАЖДЫЙ языковой блок:

| Locale | Значение |
|--------|----------|
| `de` | `'Alle Probleme & Lösungen'` |
| `en` | `'All problems & solutions'` |
| `ru` | `'Все проблемы и решения'` |
| `tr` | `'Tüm sorunlar ve çözümler'` |
| `pl` | `'Wszystkie problemy i rozwiązania'` |
| `ar` | `'جميع المشكلات والحلول'` |

---

### Шаг 5: Реализовать навигацию в sidebar

**Где рендерить:** В `<aside>` (строка 306), **под** существующим CTA-блоком (после строки 318, перед закрывающим `</aside>`).

**HTML-структура (важно для SEO):**

```tsx
{navItems && navItems.length > 0 && (
  <nav aria-label={labels.navTitle} className="mt-6 border-t border-[#E7DDD3] pt-5">
    <h3 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#B8643E]">
      {labels.navTitle}
    </h3>
    <ul className="mt-3 space-y-1">
      {navItems.map((item) => {
        const isCurrent = item.publicSlug === currentSlug;
        return (
          <li key={item.publicSlug}>
            {isCurrent ? (
              <span className="block rounded-xl bg-[#F7F1E8] px-3 py-2 text-[14px] font-bold text-[#0E1A2B]">
                {item.title}
              </span>
            ) : (
              <a
                href={`/${locale}/probleme-loesungen/${item.publicSlug}`}
                className="block rounded-xl px-3 py-2 text-[14px] text-[#4E5A5A] transition-colors hover:bg-[#F7F1E8] hover:text-[#0E1A2B]"
              >
                {item.title}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  </nav>
)}
```

### SEO-требования к реализации

1. **Обернуть в `<nav>`** с `aria-label` — это семантический HTML, краулер понимает, что это навигация, а не контент.
2. **Заголовок — `<h3>`**, не `<h2>`. H2 зарезервирован для контентных секций статьи.
3. **Текущая статья — `<span>`, не `<a>`**. Ссылка на саму себя — SEO anti-pattern.
4. **Все ссылки — полный путь** `/${locale}/probleme-loesungen/${slug}`. Не относительные.
5. **Не добавлять `nofollow`**. Это internal links — они должны передавать PageRank.

---

### Шаг 6: Мобильная адаптация

На `lg` (≥1024px) навигация находится в sidebar, который sticky.

На мобильных sidebar уходит под контент. **9 пунктов навигации на мобильном — это нормально**, но если хочется компактнее:

**Вариант A (рекомендуется):** Свернуть в `<details>`:

```tsx
<details className="mt-6 border-t border-[#E7DDD3] pt-5 lg:open">
  <summary className="cursor-pointer text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#B8643E] lg:pointer-events-none lg:list-none">
    {labels.navTitle}
  </summary>
  <ul className="mt-3 space-y-1">
    ...
  </ul>
</details>
```

На десктопе: `lg:open` + `lg:pointer-events-none` + `lg:list-none` = всегда раскрыт, summary не кликабельный.
На мобильном: пользователь может раскрыть/свернуть.

**Вариант B:** Показывать навигацию только на десктопе: `className="hidden lg:block ..."`.

---

## Чего НЕ делать

- **Не дублировать** навигацию и `relatedArticles`. Related = 2–3 контекстных ссылки внизу статьи. Nav = полный каталог в sidebar. Оба блока нужны, они дополняют друг друга.
- **Не загружать контент статей** для навигации — только `title` + `publicSlug` + `sortOrder`.
- **Не менять** существующий layout (`lg:grid-cols-[1fr_320px]`). Навигация добавляется ВНУТРИ существующего `<aside>`.
- **Не трогать** `renderMarkdownLite`, `BulletSection` и другие существующие функции.
- **Не удалять** `relatedArticles` секцию (строки 322–337).

---

## Порядок работы

1. Прочитать `articles.ts` → понять маппинг slug.
2. Добавить `getAllPublishedSymptomArticleNavItems` в `articles.ts`.
3. Обновить `[slug]/page.tsx` — загрузка + передача props.
4. Обновить `ProblemArticleBody.tsx` — props + labels + рендер навигации.
5. Проверить `npm run build` — exit code 0.
6. Визуально проверить на `/de/probleme-loesungen/werbeanlage-flackert`:
   - Десктоп: sidebar содержит CTA + навигацию, текущая статья выделена.
   - Мобильный: навигация свёрнута или под контентом.

---

## Файлы для изменения

| Файл | Действие |
|------|----------|
| `signage-service/src/lib/cms/articles.ts` | Добавить `getAllPublishedSymptomArticleNavItems` |
| `signage-service/src/app/[locale]/probleme-loesungen/[slug]/page.tsx` | Загрузить navItems, передать в компонент |
| `signage-service/src/components/probleme-loesungen/ProblemArticleBody.tsx` | Расширить props, добавить labels, рендер nav |

Никакие другие файлы менять не нужно.
