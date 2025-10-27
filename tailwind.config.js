/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          pink: '#ff005a',
          purple: '#9c27ff',
        },
        dark: {
          bg: '#0e0e11',
          card: '#1a1a1f',
          input: '#25252d',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #ff005a 0%, #9c27ff 100%)',
        'gradient-match': 'linear-gradient(135deg, #00c853 0%, #00e676 100%)',
      }
    },
  },
  plugins: [],
}
