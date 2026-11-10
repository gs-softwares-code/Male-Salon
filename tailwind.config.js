/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        salon: {
          darkest: '#08080a',
          dark: '#0e0e12',
          card: '#141419',
          cardHover: '#1c1c24',
          border: '#262633',
          borderLight: '#38384a',
          muted: '#8b8b9e',
          light: '#f5f4f0',
          sand: '#e2ded5',
          gold: '#cda851',
          goldLight: '#e4c478',
          goldDark: '#a38234',
          bronze: '#ba803f',
        }
      },
      fontFamily: {
        heading: ['"Bebas Neue"', '"Oswald"', 'sans-serif'],
        subheading: ['"Oswald"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        serif: ['"Cinzel"', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(205, 168, 81, 0.25)',
        'gold-glow-lg': '0 0 45px -8px rgba(205, 168, 81, 0.35)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #e4c478 0%, #cda851 50%, #ba803f 100%)',
        'dark-gradient': 'linear-gradient(180deg, rgba(14, 14, 18, 0.7) 0%, rgba(8, 8, 10, 0.98) 100%)',
      }
    },
  },
  plugins: [],
}
