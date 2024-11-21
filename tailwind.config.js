/* @type {import('tailwindcss').Config} */
//slightly different than the premade one- got online.
//this is just some css fonts

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // theme: {
  //   extend: {
  //     fontFamily: {
  //       sans: ['var(--font-geist-sans)'],
  //       mono: ['var(--font-geist-mono)'],
  //     },
  //     colors: {
  //       'primary-orange': '#FF5722',
  //     }
  //   },
  // },
  
  plugins: [],
}