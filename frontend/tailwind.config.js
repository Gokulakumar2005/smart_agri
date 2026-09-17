/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        soil: '#5d4b3c',
        forest: '#1f4c3a',
        leaf: '#6a9a59',
        field: '#d8c8a5',
        accent: '#9a733d',
      },
      boxShadow: {
        soft: '0 10px 24px rgba(31, 76, 58, 0.12)',
      },
    },
  },
  plugins: [],
};
