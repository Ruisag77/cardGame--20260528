/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#0f172a',
          soft: '#1e293b',
        },
        royal: {
          DEFAULT: '#1d4ed8',
          dark: '#1e40af',
          light: '#3b82f6',
        },
        mist: {
          blue: '#E0F2FE',
          peach: '#FFEDD5',
          mint: '#D1FAE5',
        },
        gold: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#b45309',
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(31, 38, 135, 0.08)',
        'glass-lg': '0 20px 60px rgba(31, 38, 135, 0.12)',
        'glass-inner': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
        royal: '0 10px 30px rgba(29, 78, 216, 0.35)',
        'royal-lg': '0 16px 40px rgba(29, 78, 216, 0.45)',
      },
      backdropBlur: {
        xs: '4px',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(29, 78, 216, 0.5)' },
          '100%': { boxShadow: '0 0 0 20px rgba(29, 78, 216, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
