/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss';

const svgToDataUri = require('mini-svg-data-uri');

function flattenColors(colors: any): Record<string, string> {
  const flatColors: Record<string, string> = {};
  function recurse(obj: any, prefix: string = '') {
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}-${key}` : key;
      if (typeof value === 'string') {
        flatColors[newKey] = value;
      } else if (value && typeof value === 'object') {
        recurse(value, newKey);
      }
    }
  }
  recurse(colors);
  return flatColors;
}

function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColors(theme('colors'));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ':root': newVars,
  });
}

function addCustomUtilities({ matchUtilities, theme }: any) {
  matchUtilities(
    {
      'bg-grid': (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}">
            <path d="M0 0 H32 M0 8 H32 M0 16 H32 M0 24 H32 M0 32 H32 M0 0 V32 M8 0 V32 M16 0 V32 M24 0 V32 M32 0 V32" />
          </svg>`
        )}")`,
      }),
      'bg-grid-small': (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}">
            <path d="M0 0 H32 M0 8 H32 M0 16 H32 M0 24 H32 M0 32 H32 M0 0 V32 M8 0 V32 M16 0 V32 M24 0 V32 M32 0 V32" />
          </svg>`
        )}")`,
      }),
      'bg-dot': (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none">
            <circle fill="${value}" cx="16" cy="16" r="1.5" />
          </svg>`
        )}")`,
      }),
    },
    { values: flattenColors(theme('backgroundColor')), type: 'color' }
  );
}

export default {
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
          '50': '#686868',
          '100': '#5E5E5E',
          '150': '#595959',
          '200': '#545454',
          '250': '#4E4E4E',
          '300': '#494949',
          '350': '#434343',
          '400': '#3D3D3D',
          '450': '#373737',
          '500': '#313131',
          '550': '#2A2A2A',
          '600': '#232323',
          '650': '#1E1E1E',
          '700': '#181818',
          '750': '#141414',
          '800': '#0F0F0F',
          '850': '#0A0A0A',
          '900': '#050505',
          '950': '#020202',
        },
        light: {
          '50': '#F5F5F5',
          '100': '#ECECEC',
          '150': '#E8E8E8',
          '200': '#E4E4E4',
          '250': '#DEDEDE',
          '300': '#D8D8D8',
          '350': '#D2D2D2',
          '400': '#CCCCCC',
          '450': '#C6C6C6',
          '500': '#BFBFBF',
          '550': '#BABABA',
          '600': '#B5B5B5',
          '650': '#AFAFAF',
          '700': '#A9A9A9',
          '750': '#A2A2A2',
          '800': '#9B9B9B',
          '850': '#8E8E8E',
          '900': '#808080',
          '950': '#737373',
        }
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
        'infinite-scroll': 'scrollLeft 10s linear infinite',
        'infinite-scroll-right': 'scrollRight 10s linear infinite',
        scroll:
          'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
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
        scroll: {
          to: {
            transform: 'translate(calc(-50% - 0.5rem))',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
    },
  },
  plugins: [addVariablesForColors, addCustomUtilities, require('tailwindcss-animate')],
} satisfies Config;
