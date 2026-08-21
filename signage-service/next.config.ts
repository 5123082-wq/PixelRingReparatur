import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/de',
        permanent: true,
      },
      {
        source: '/leistungen',
        destination: '/de/leistungen',
        permanent: true,
      },
      {
        source: '/ring-master-admin/:path*',
        destination: '/de/ring-manager-crm/:path*',
        permanent: true,
      },
      {
        source: '/:locale(de|en|ru|tr|pl|ar)/ring-master-admin/:path*',
        destination: '/:locale/ring-manager-crm/:path*',
        permanent: true,
      },
    ];
  },
};
 
export default withNextIntl(nextConfig);
