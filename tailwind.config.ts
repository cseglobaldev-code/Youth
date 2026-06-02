import type { Config } from 'tailwindcss';
import { tokens } from './src/config/theme/tokens';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1344px',
      },
    },
    extend: {
      colors: tokens.colors,
      fontFamily: tokens.fontFamily,
      fontSize: tokens.fontSize,
      spacing: tokens.spacing,
      borderRadius: tokens.radius,
      screens: tokens.screens,
      animation: {
        'float-y':     'float-y 3.2s ease-in-out infinite',
        'fade-in-up':  'fade-in-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in-scale': 'fade-in-scale 0.4s cubic-bezier(0.22,1,0.36,1) both',
      },
      keyframes: {
        'float-y': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-scale': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [],
} satisfies Config;
