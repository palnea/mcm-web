import tailwindLogical from 'tailwindcss-logical';
import coreTailwindPlugin from './src/@core/tailwind/plugin.js';

const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  corePlugins: {
    preflight: false,
  },
  important: '#__next',
  plugins: [tailwindLogical, coreTailwindPlugin],
  theme: {
    extend: {},
  },
};

export default config;
