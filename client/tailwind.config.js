/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        amazon: {
          navy: '#131921',
          dark: '#232f3e',
          orange: '#febd69',
          'orange-hover': '#f3a847',
          yellow: '#ffd814',
          'yellow-hover': '#f7ca00',
          light: '#eaeded',
        },
      },
    },
  },
  plugins: [],
};
