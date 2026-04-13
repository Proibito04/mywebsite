/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'forest-deep': 'rgb(var(--forest-deep) / <alpha-value>)',
        'forest-dark': 'rgb(var(--forest-dark) / <alpha-value>)',
        'forest-muted': 'rgb(var(--forest-muted) / <alpha-value>)',
        'sage-green': 'rgb(var(--sage-green) / <alpha-value>)',
        'off-white': 'rgb(var(--off-white) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Lexend', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
