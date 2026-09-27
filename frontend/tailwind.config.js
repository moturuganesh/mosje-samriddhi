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
          darkgreen: '#14532d',
        },
        primary: {
          DEFAULT: '#0f172a',
          hover: '#1e293b',
          light: '#334155',
        },
        accent: {
          DEFAULT: '#d97706',
          hover: '#b45309',
          light: '#fbbf24',
          surface: '#fffbeb',
        },
        success: {
          DEFAULT: '#059669',
          light: '#d1fae5',
          dark: '#065f46',
        },
        danger: {
          DEFAULT: '#dc2626',
          light: '#fee2e2',
          dark: '#991b1b',
        },
        surface: {
          DEFAULT: '#f8fafc',
          card: '#ffffff',
          dark: '#0f172a',
          darker: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.12)',
        'glow-amber': '0 0 20px rgba(217, 119, 6, 0.3)',
        'glow-emerald': '0 0 20px rgba(5, 150, 105, 0.3)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 12px 36px rgba(0,0,0,0.1)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}
