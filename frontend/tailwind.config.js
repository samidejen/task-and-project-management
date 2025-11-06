/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx,vue}", // Adjust paths to match your project structure
    "./public/**/*.html",
    // Add other file paths where you use Tailwind classes
  ],
  theme: {
    extend: {
      colors: {
        brand: "#ed7b16", // your logo color
      },
    },
  },
  plugins: [],
};
