/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F1115',
        surface: '#1A1D24',
        surfaceHighlight: '#2A2E39',
        primary: '#4361EE',
        primaryHover: '#3A56D4',
        textMain: '#FFFFFF',
        textMuted: '#9BA1A6',
        border: '#2C313D',
        success: '#10B981',
        danger: '#EF4444'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
