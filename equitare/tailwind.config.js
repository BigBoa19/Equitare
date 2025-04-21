/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Archivo', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#636AE8', // Light blue
          light: '#7e83e6',
          dark: '#3c43c7',
        },
        secondary: {
          DEFAULT: '#e5e7eb', // Light gray
          light: '#f3f4f6',
          dark: '#d1d5db',
        }
      },
    },
  },
  plugins: [],
}

