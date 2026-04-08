import 'server-only';

export const SEO_CONFIG_KEYS = [
  'support_index_title',
  'support_index_description',
  'support_index_canonical_url',
  'support_article_title_template',
  'support_article_description_fallback',
  'support_article_canonical_base_url',
] as const;

export type SeoConfigKey = (typeof SEO_CONFIG_KEYS)[number];

export type SeoConfigRow = {
  key: SeoConfigKey;
  value: string;
};

export type SeoAuditSourceArticle = {
  id: string;
  locale: string;
  slug: string;
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
  shortAnswer: string | null;
  canonicalUrl: string | null;
};

export type SeoAuditItem = {
  id: string;
  locale: string;
  slug: string;
  title: string;
  missing: string[];
  duplicateSlug: boolean;
  canonicalIssue: string | null;
};

export type SeoAuditSummary = {
  totalPublished: number;
  seoReady: number;
  withIssues: number;
};

export type SeoAudit = {
  summary: SeoAuditSummary;
  items: SeoAuditItem[];
};

export const SEO_CONFIG_DEFAULTS: Record<SeoConfigKey, string> = {
  support_index_title: '',
  support_index_description: '',
  support_index_canonical_url: '',
  support_article_title_template: '',
  support_article_description_fallback: '',
  support_article_canonical_base_url: '',
};

const SEO_CONFIG_MAX_LENGTHS: Record<SeoConfigKey, number> = {
  support_index_title: 240,
  support_index_description: 500,
  support_index_canonical_url: 2048,
  support_article_title_template: 240,
  support_article_description_fallback: 500,
  support_article_canonical_base_url: 2048,
};

function trimSeoValue(value: string): string {
  return value.trim();
}

export function isSeoConfigKey(value: string): value is SeoConfigKey {
  return (SEO_CONFIG_KEYS as readonly string[]).includes(value);
}

export function isValidCanonicalUrl(value: string): boolean {
  const normalized = value.trim();

  if (!normalized) {
    return false;
  }

  if (normalized.startsWith('//')) {
    return false;
  }

  if (normalized.startsWith('/')) {
    return true;
  }

  try {
    const url = new URL(normalized);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function normalizeSeoConfigValue(
  key: SeoConfigKey,
  value: unknown
): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = trimSeoValue(value);

  if (normalized.length > SEO_CONFIG_MAX_LENGTHS[key]) {
    return null;
  }

  if (key === 'support_index_canonical_url' || key === 'support_article_canonical_base_url') {
    return normalized === '' || isValidCanonicalUrl(normalized) ? normalized : null;
  }

  return normalized;
}

export function buildSeoConfigMap(
  rows: Array<{ key: string; value: string }>
): Record<SeoConfigKey, string> {
  const config = { ...SEO_CONFIG_DEFAULTS };

  for (const row of rows) {
    if (isSeoConfigKey(row.key)) {
      config[row.key] = row.value;
    }
  }

  return config;
}

function hasText(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function buildSeoAudit(articles: SeoAuditSourceArticle[]): SeoAudit {
  const slugCounts = new Map<string, number>();

  for (const article of articles) {
    slugCounts.set(article.slug, (slugCounts.get(article.slug) ?? 0) + 1);
  }

  const items = articles.map((article) => {
    const missing: string[] = [];

    if (!hasText(article.seoTitle)) {
      missing.push('seoTitle');
    }

    if (!hasText(article.seoDescription)) {
      missing.push('seoDescription');
    }

    if (!hasText(article.shortAnswer)) {
      missing.push('shortAnswer');
    }

    const canonicalValue = typeof article.canonicalUrl === 'string' ? article.canonicalUrl.trim() : '';
    let canonicalIssue: string | null = null;

    if (!canonicalValue) {
      missing.push('canonicalUrl');
      canonicalIssue = 'missing canonicalUrl';
    } else if (!isValidCanonicalUrl(canonicalValue)) {
      missing.push('canonicalUrl');
      canonicalIssue = 'invalid canonicalUrl';
    }

    const duplicateSlug = (slugCounts.get(article.slug) ?? 0) > 1;

    return {
      id: article.id,
      locale: article.locale,
      slug: article.slug,
      title: article.title,
      missing,
      duplicateSlug,
      canonicalIssue,
    };
  });

  const seoReady = items.filter(
    (item) => item.missing.length === 0 && !item.duplicateSlug && item.canonicalIssue === null
  ).length;

  return {
    summary: {
      totalPublished: items.length,
      seoReady,
      withIssues: items.length - seoReady,
    },
    items,
  };
}
