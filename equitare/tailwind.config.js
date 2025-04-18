/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#60a5fa', // Light blue
          light: '#93c5fd',
          dark: '#3b82f6',
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

