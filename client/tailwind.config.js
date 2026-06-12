/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          50: '#f5f3ff',
          100: '#e0e0fe',
          200: '#c7c7fc',
          300: '#a3a3fa',
          400: '#7a75f8',
          500: '#584bf6',
          600: '#412eed',
          700: '#3321d3',
          800: '#2b1bab',
          900: '#150d5e',
          950: '#0b0638',
        },
        mystic: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          800: '#18181b',
          900: '#09090b',
          950: '#020205',
        },
        gem: {
          ruby: '#E0115F',
          pearl: '#EAE6DF',
          coral: '#FF4F00',
          emerald: '#50C878',
          yellow: '#FFD700',
          diamond: '#B9F2FF',
          blue: '#0F52BA',
          hessonite: '#8B4513',
          catseye: '#808000',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(88, 75, 246, 0.15)',
        'glow-md': '0 0 20px rgba(88, 75, 246, 0.25)',
        'glow-lg': '0 0 30px rgba(88, 75, 246, 0.4)',
      }
    },
  },
  plugins: [],
}
