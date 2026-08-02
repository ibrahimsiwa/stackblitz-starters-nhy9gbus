import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'siwa-beige': '#F5F2EB',
        'siwa-brown': '#3D2E24',
        'siwa-gold': '#C9A227',
        'siwa-spring': '#1E6B65',
        'siwa-ink': '#241913',
        'siwa-soft': '#FCFBFA',
      },
      fontFamily: {
        sans: ['var(--font-cairo)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cairo)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;