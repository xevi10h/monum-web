import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        'monum-green': {
          dark: '#032000',
          default: '#3F713B',
          light: '#ECF3EC',
          hover: 'rgba(103, 158, 92, 0.7)',
          selected: 'rgba(162, 199, 143, 0.5)',
        },
        'monum-red': {
          default: '#BF1C39',
          hover: '#D73754',
        },
        'monum-yellow': {
          default: '#FFF172',
        },
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
      spin: {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
    },
    animation: {
      spin: 'spin 1s linear infinite',
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
