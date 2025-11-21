/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}" // scan all your React components
  ],
  theme: {
    extend: {
      colors: {
        'hsl-primary': '#007AC9',   // Blue
        'hsl-accent': '#FFC72C',    // Yellow/Gold
        'eco-success': '#38A169',   // Green
        'bg-main': '#F9FAFB',       // Light off-white
        'text-dark': '#1F2937',     // Dark gray
      },
    },
  },
  plugins: [],
};
