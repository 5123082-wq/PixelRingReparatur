import type { MetadataRoute } from 'next';

import { buildSiteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/de/service',
        '/en/service',
        '/ru/service',
        '/tr/service',
        '/pl/service',
        '/ar/service',
      ],
    },
    sitemap: buildSiteUrl('/sitemap.xml'),
  };
}
