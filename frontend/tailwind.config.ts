import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2fbf9',
          100: '#d3f4ed',
          200: '#a5e9d9',
          300: '#72d9c2',
          400: '#48c6aa',
          500: '#2ba88e',
          600: '#1f8471',
          700: '#1c685a',
          800: '#184f47',
          900: '#133f39'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        glass: '0 20px 45px -20px rgba(14, 116, 144, 0.3)'
      }
    }
  },
  plugins: []
};

export default config;
