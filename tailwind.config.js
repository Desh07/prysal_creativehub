/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#111827',
        primary: '#000000',
        muted: '#4B5563',
        card: '#F9FAFB',
        border: 'rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: [],
}
