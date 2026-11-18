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
        brand: {
          blue: '#4285F4',
          'blue-hover': '#3367D6',
          'blue-light': '#E8F0FE',
          red: '#EA4335',
          'red-light': '#FCE8E6',
          yellow: '#FBBC05',
          'yellow-light': '#FEF7E0',
          green: '#34A853',
          'green-light': '#E6F4EA',
        },
        surface: {
          light: '#FFFFFF',
          muted: '#F1F3F4',
          subtle: '#F8FAFD',
          dark: '#161B22',
          'dark-card': '#1E252E',
          'dark-border': '#30363D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(60, 64, 67, 0.15), 0 1px 2px 0 rgba(60, 64, 67, 0.10)',
        'card-hover': '0 4px 8px 3px rgba(60, 64, 67, 0.15), 0 1px 3px 0 rgba(60, 64, 67, 0.10)',
        'modal': '0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.20)',
      },
    },
  },
  plugins: [],
};
