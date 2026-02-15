/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        act: {
          pub: '#2E2018',
          prehistoric: '#6E7F4D',
          ancient: '#C6A26B',
          classical: '#8A7AA6',
          medieval: '#2F3E5E',
          modern: '#243447',
          bitcoin: '#101820'
        }
      }
    }
  },
  plugins: []
};
