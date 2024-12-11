/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '640px',

      md: '768px',

      lg: '1024px',

      xl: '1280px',

      '2xl': '1536px',
    },
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // dark: {
        //   100: '#5E5E5E',
        //   200: '#545454',
        //   300: '#494949',
        //   400: '#3D3D3D',
        //   500: '#313131',
        //   600: '#232323',
        //   700: '#181818',
        //   800: '#0F0F0F',
        // },
        light: {
          100: '#ECECEC',
          200: '#E4E4E4',
          300: '#D8D8D8',
          400: '#CCCCCC',
          500: '#BFBFBF',
          600: '#B5B5B5',
          700: '#A9A9A9',
          800: '#9B9B9B',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
