/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
    serverComponents: true,
  },
  i18n: {
    locales: ['en', 'tr'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  // Add any other configurations you need
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Accept-RSC',
            value: '*/*',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
