/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EEF2FF',
          100: '#C7D2F0',
          200: '#9FAEDD',
          300: '#7288CA',
          400: '#4A62B7',
          500: '#1B3A6B',
          600: '#142E5A',
          700: '#0E2248',
          800: '#081636',
          900: '#020A1C',
        },
        gold: {
          50:  '#FFFBF0',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D4A017',
          600: '#B78A0E',
          700: '#9A6E08',
          800: '#7D5204',
          900: '#613900',
        },
      },
      fontFamily: {
        display: ['"Nunito"', 'sans-serif'],
        body: ['"Nunito"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
