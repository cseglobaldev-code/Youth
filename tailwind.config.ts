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
    },
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [],
} satisfies Config;
