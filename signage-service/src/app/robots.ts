import type { MetadataRoute } from 'next';

import { buildSiteUrl } from '@/lib/seo';

const VISIBILITY_FIRST_CRAWLERS: string[] = [
  'Googlebot',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'Claude-SearchBot',
  'Claude-User',
  'ClaudeBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
];

const CRAWLER_DISALLOWED_PATHS = ['/api/'];

export default function robots(): MetadataRoute.Robots {
  return {
    // robots.txt documents crawler intent; authentication protects private data.
    rules: [
      {
        userAgent: VISIBILITY_FIRST_CRAWLERS,
        allow: '/',
        disallow: CRAWLER_DISALLOWED_PATHS,
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: CRAWLER_DISALLOWED_PATHS,
      },
    ],
    sitemap: buildSiteUrl('/sitemap.xml'),
  };
}
