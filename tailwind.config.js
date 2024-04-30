/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'gray-3': '#282828',
        'gray-2': '#29292e',
        'gray-1': '#38383e'
      }
    }
  },
  plugins: []
};
