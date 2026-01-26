/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-carbon-fire',
    'shadow-carbon-fire',
    'shadow-carbon-fire/50',
    'text-carbon-fire',
    'ring-carbon-fire',
    // Add any other variants you use, e.g.:
    'hover:bg-carbon-fire',
    'focus:ring-carbon-fire',
  ],
  theme: {
    extend: {
      colors: {
        'carbon-dark': '#0f0f0f',
        'carbon-fire': '#ff3d00',
        'carbon-stone': '#1e1e1e',
      },
    },
  },
  plugins: [],
}