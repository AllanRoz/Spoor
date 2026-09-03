/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        journal: {
          50: '#fbf9f4',
          100: '#f5f0e6',
          200: '#ebdccb',
          300: '#ddc3a8',
          400: '#cba382',
          500: '#bd8964',
          600: '#ad7353',
          700: '#905d44',
          800: '#754c3c',
          900: '#604033',
        },
        field: {
          50: '#f2f8f4',
          100: '#e1eee6',
          200: '#c5ddcf',
          300: '#9cc3ad',
          400: '#6da487',
          500: '#4b8868',
          600: '#386d52',
          700: '#2e5743',
          800: '#274637',
          900: '#213b2f',
          950: '#102119',
        },
        spoor: {
          amber: '#d97706',
          clay: '#c2410c',
          earth: '#78350f',
          dark: '#0f1715',
          card: '#16221f',
          cardborder: '#233832'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
