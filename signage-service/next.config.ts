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
    ],
  },
  async redirects() {
    return [
      {
        source: '/:locale(de|en|ru|tr|pl|ar)/hilfe',
        destination: '/:locale/support',
        permanent: true,
      },
      {
        source: '/hilfe',
        destination: '/support',
        permanent: true,
      },
    ];
  },
};
 
export default withNextIntl(nextConfig);
