/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        emerald: {
          600: '#059669',
          700: '#047857',
        },
        rose: {
          600: '#e11d48',
          700: '#be123c',
        },
      },
    },
  },
  plugins: [],
}
