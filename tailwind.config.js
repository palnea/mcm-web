import tailwindLogical from 'tailwindcss-logical';
import coreTailwindPlugin from './src/@core/tailwind/plugin.js';

const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html'
  ],
  corePlugins: {
    preflight: true, // Re-enable preflight
  },
  // important: '#__next', // Try removing this to see if it helps
  plugins: [coreTailwindPlugin], // Temporarily remove tailwindLogical
  theme: {
    extend: {},
  },
};

export default config;
