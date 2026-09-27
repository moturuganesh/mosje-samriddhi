/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: '#133a75',
          navy: '#0b2046',
          gold: '#d97706',
           saffron: '#f97316',
          green: '#15803d',
          darkgreen: '#14532d'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),require('tailwindcss-animate')],
}
