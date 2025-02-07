/** @type {import('next').NextConfig} */
import nextI18NextConfig from './next-i18next.config.js';

const nextConfig = {
  ...nextI18NextConfig,
  reactStrictMode: false,
  basePath: process.env.BASEPATH,
}

export default nextConfig
