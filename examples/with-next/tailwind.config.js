/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{jsx,tsx}',
    './node_modules/frui/**/*.{jsx,tsx}',
    '../../node_modules/frui/**/*.{jsx,tsx}',
    '../../node_modules/@inceptjs/tailwind/**/*.{jsx,tsx}',
    '../../node_modules/.incept/client/**/*.{js,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {},
  plugins: []
}