/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        flame:  '#cc4433',
        ember:  '#c07030',
        roast: {
          bg:     '#171311',
          dark:   '#120f0e',
          text:   '#f2e8dc',
          muted:  '#9c8c7c',
          soft:   '#d8d0c8',
          border: '#3f372f',
        },
      },
      maxWidth: {
        shell:   '1180px',
        hero:    '840px',
        panel:   '820px',
        copy:    '760px',
        narrow:  '720px',
      },
    },
  },
  plugins: [],
}
