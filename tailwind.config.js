/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e6fffe',
          100: '#b3fffc',
          200: '#80fff9',
          300: '#4dfff7',
          400: '#1afff4',
          500: '#00C2C2',
          600: '#00AEEF',
          700: '#0090c7',
          800: '#00729f',
          900: '#005477',
        },
        dark: {
          50: '#e8eaf0',
          100: '#c5c9d6',
          200: '#9ea4b8',
          300: '#777f9a',
          400: '#596384',
          500: '#3b476e',
          600: '#354066',
          700: '#2d375b',
          800: '#252e51',
          900: '#0a0a1a',
          950: '#060612',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'ring-rotate': 'ring-rotate 1s linear infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out',
        'scale-in': 'scale-in 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { textShadow: '0 0 20px rgba(0,194,194,0.5), 0 0 40px rgba(0,174,239,0.3)' },
          '50%': { textShadow: '0 0 40px rgba(0,194,194,0.8), 0 0 80px rgba(0,174,239,0.5), 0 0 120px rgba(0,194,194,0.3)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(3deg)' },
        },
        'ring-rotate': {
          '0%': { transform: 'rotate(-90deg)' },
          '100%': { transform: 'rotate(270deg)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0,194,194,0.3), 0 0 40px rgba(0,174,239,0.15)',
        'glow-lg': '0 0 30px rgba(0,194,194,0.4), 0 0 60px rgba(0,174,239,0.2)',
        'glow-xl': '0 0 50px rgba(0,194,194,0.5), 0 0 100px rgba(0,174,239,0.3)',
        'glass': '0 8px 32px rgba(0,0,0,0.1)',
        'glass-lg': '0 16px 48px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
