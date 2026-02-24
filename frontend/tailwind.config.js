/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          emerald: '#10b981',
          violet: '#8b5cf6',
        },
      },
      boxShadow: {
        glow: '0 20px 45px -20px rgba(16, 185, 129, 0.4)',
      },
    },
  },
  plugins: [],
}
