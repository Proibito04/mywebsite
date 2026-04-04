/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'forest-deep': '#0a1a12',
        'forest-dark': '#0f241a',
        'forest-muted': '#1a3d2e',
        'sage-green': '#86a693',
        'off-white': '#f5f5f5',
      },
      fontFamily: {
        sans: ['Lexend', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
