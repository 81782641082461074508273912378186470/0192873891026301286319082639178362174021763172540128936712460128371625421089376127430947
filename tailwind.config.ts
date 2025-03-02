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
        dark: {
          100: '#5E5E5E',
          200: '#545454',
          300: '#494949',
          400: '#3D3D3D',
          500: '#313131',
          600: '#212121',
          700: '#171717',
          800: '#0a0a0a',
        },
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
      fontFamily: {
        geist: ['Geist', 'serif'],
        'geist-thin': ['Geist Thin', 'serif'],
        'geist-light': ['Geist Light', 'serif'],
        'geist-regular': ['Geist', 'serif'],
        'geist-medium': ['Geist Medium', 'serif'],
        'geist-semibold': ['Geist SemiBold', 'serif'],
        'geist-bold': ['Geist Bold', 'serif'],
        'geist-extrabold': ['Geist ExtraBold', 'serif'],
        'geist-black': ['Geist Black', 'serif'],
      },
      animation: {
        'infinite-scroll': 'scrollLeft 20s linear infinite',
        'infinite-scroll-right': 'scrollRight 20s linear infinite',
      },
      keyframes: {
        scrollLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scrollRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
