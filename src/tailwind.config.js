/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#4facfe',
        secondary: '#122829',
        highlight: '#00f2fe',
        winner: '#4caf50',
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(3rem, 1fr))',
      },
    },
  },
  plugins: [],
};