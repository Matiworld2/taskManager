/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./test.html",
    "./*.{vue,js,ts,jsx,tsx}",
    "./parts/*.html",
    "./views/*.handlebars",
    "./views/layouts/*.handlebars",
    "./views/**/*.handlebars",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
