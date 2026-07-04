import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#166534',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#166534',
          800: '#14532d',
          900: '#052e16',
          container: '#166534',
        },
        secondary: {
          DEFAULT: '#006d36',
          fixed: '#6dfe9c',
          'fixed-dim': '#4de082',
          container: '#6dfe9c',
        },
        surface: {
          DEFAULT: '#f9f9ff',
          bright: '#f9f9ff',
          dim: '#d0daef',
          container: {
            DEFAULT: '#e6eeff',
            low: '#eff3ff',
            high: '#dee9fd',
            highest: '#d9e3f7',
            lowest: '#ffffff',
          },
        },
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-surface': '#121c2a',
        'on-surface-variant': '#404940',
        'on-background': '#121c2a',
        background: '#f9f9ff',
        outline: '#707a6f',
        'outline-variant': '#bfc9bd',
        tertiary: {
          DEFAULT: '#404230',
          container: '#585946',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'inverse-primary': '#8bd79b',
        'primary-fixed': '#a6f4b5',
        'primary-fixed-dim': '#8bd79b',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        serif: ['Libre Caslon Text', 'serif'],
        display: ['Libre Caslon Text', 'serif'],
        body: ['Manrope', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'headline-md': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
      },
      spacing: {
        'container-max': '1280px',
        gutter: '24px',
        'margin-desktop': '64px',
        'margin-mobile': '16px',
      },
      maxWidth: {
        'container-max': '1280px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'radial-gradient(ellipse at top right, #dcfce7 0%, transparent 60%)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(22, 101, 52, 0.08)',
        'card-hover': '0 12px 48px rgba(22, 101, 52, 0.16)',
        'glow': '0 0 40px rgba(22, 101, 52, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
