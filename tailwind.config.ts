import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        'monum-green': {
          default: '#4b7041',
          '50': '#f5f9f4',
          '100': '#e9f2e6',
          '200': '#d4e3cf',
          '300': '#b1cda8',
          '400': '#85ae7a',
          '500': '#639057',
          '600': '#4b7041',
          '700': '#405d38',
          '800': '#364b30',
          '900': '#2d3e29',
          '950': '#152112',
        },
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
