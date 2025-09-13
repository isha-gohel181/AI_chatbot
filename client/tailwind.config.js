/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // A more refined color palette
        'dark-primary': '#121212',
        'dark-secondary': '#1E1E1E',
        'dark-tertiary': '#2A2A2A',
        'accent-blue': '#3b82f6',
        'accent-hover': '#2563eb',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-scrollbar'), // Add this line
  ],
}