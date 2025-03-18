/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      zIndex: {
        dropdown: 1000,
        modal: 2000,
      },
      animation: {
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'fadeIn': 'fadeIn 0.5s ease-in',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'dash': 'dash 1.5s ease-in-out forwards',
        'pulse': 'pulse 8s ease-in-out infinite',
        'moveRight': 'moveRight 1.5s ease-in-out infinite',
      },
      keyframes: {
        shake: {
          '10%, 90%': {
            transform: 'translate3d(-1px, 0, 0)'
          },
          '20%, 80%': {
            transform: 'translate3d(2px, 0, 0)'
          },
          '30%, 50%, 70%': {
            transform: 'translate3d(-4px, 0, 0)'
          },
          '40%, 60%': {
            transform: 'translate3d(4px, 0, 0)'
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1'
          },
          '50%': {
            opacity: '0.5'
          },
        },
        'dash': {
          '0%': {
            strokeDashoffset: '1000'
          },
          '100%': {
            strokeDashoffset: '0'
          },
        },
        'pulse': {
          '0%, 100%': {
            opacity: '0.3'
          },
          '50%': {
            opacity: '0.8'
          },
        },
        'moveRight': {
          '0%': {
            transform: 'translateX(-8px)',
            opacity: '0.3'
          },
          '50%': {
            transform: 'translateX(8px)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateX(-8px)',
            opacity: '0.3'
          },
        },
      },
      transitionDelay: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
        '1200': '1200ms',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
        '1500': '1500ms',
        '2000': '2000ms',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};