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
        background: '#090d16',
        surface: {
          DEFAULT: '#0f172a',
          hover: '#1e293b',
          muted: '#0b1120',
          border: 'rgba(255, 255, 255, 0.08)'
        },
        gold: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
          glow: 'rgba(245, 158, 11, 0.18)'
        },
        emerald: {
          DEFAULT: '#10b981',
          glow: 'rgba(16, 185, 129, 0.18)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      }
    },
  },
  plugins: [],
}
