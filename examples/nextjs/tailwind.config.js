/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{jsx,tsx}',
    './node_modules/@ev3/ui/**/*.{jsx,tsx}',
    '../node_modules/@ev3/ui/**/*.{jsx,tsx}',
    './node_modules/.ev3/client/**/*.{js,jsx,tsx}',
    '../node_modules/.ev3/client/**/*.{js,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {},
  plugins: []
}