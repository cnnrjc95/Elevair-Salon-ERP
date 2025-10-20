import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f7ff',
          100: '#dde6ff',
          200: '#b5c7ff',
          300: '#809cff',
          400: '#4b6dff',
          500: '#2641ff',
          600: '#1529db',
          700: '#0d1d9f',
          800: '#091672',
          900: '#060f4b'
        }
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
export default config;
