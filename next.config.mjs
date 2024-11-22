/** @type {import('next').NextConfig} */
import nextI18NextConfig from './next-i18next.config.js';

const nextConfig = {
  ...nextI18NextConfig,
  output: 'standalone',
  experimental: {
    appDir: true,
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
