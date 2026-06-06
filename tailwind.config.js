/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: '#F0F5FA',
          100: '#D9E4F1',
          200: '#B3C9E3',
          300: '#8DACD5',
          400: '#6691C7',
          500: '#4076B9',
          600: '#0F3460',
          700: '#0C2A4E',
          800: '#091F3B',
          900: '#061529',
        },
        secondary: {
          50: '#E8F4F8',
          100: '#C5E4EC',
          200: '#A2D4E0',
          300: '#7EC3D4',
          400: '#5BB3C8',
          500: '#1687A7',
          600: '#126C85',
          700: '#0D5164',
          800: '#093642',
          900: '#041B21',
        },
        warning: {
          blue: '#3B82F6',
          yellow: '#F59E0B',
          orange: '#FF9F45',
          red: '#E94560',
        },
        success: {
          500: '#27AE60',
        },
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
