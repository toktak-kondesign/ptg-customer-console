import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        thai: [
          'var(--font-chulabhorn)',
          'var(--font-ibm-plex)',
          '"Noto Sans Thai"',
          'sans-serif',
        ],
      },
      colors: {
        primary: {
          50: '#F5F8FF',
          100: '#E7F1FF',
          600: '#155DFF',
          900: '#0D1B4C',
        },
        brand: {
          dark: '#0B1F6A',
          blue: '#0EA5E9',
          green: '#06C755',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

export default config
