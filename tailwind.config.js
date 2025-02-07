import tailwindLogical from 'tailwindcss-logical';
import coreTailwindPlugin from './src/@core/tailwind/plugin.js';

const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  corePlugins: {
    preflight: true,
  },
  // important: '#__next',
  plugins: [tailwindLogical, coreTailwindPlugin],
  theme: {
    extend: {},
  },
};

export default config;
