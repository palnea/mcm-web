/** @type {import('next').NextConfig} */
import nextI18NextConfig from './next-i18next.config.js';

const nextConfig = {
  ...nextI18NextConfig,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
        locale: false
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
}

export default nextConfig;

// export default {
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'http://localhost:7153/:path*'
//       }
//     ]
//   }
// }
