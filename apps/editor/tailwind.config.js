const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'), ...createGlobPatternsForDependencies(__dirname)],
  theme: {
    extend: {
      colors: {
        beige: {
          DEFAULT: 'rgb(247 242 232)',
        },
        primary: {
          DEFAULT: 'rgb(90 70 39)',
          dark: 'rgb(66 44 17)',
        },
        muted: {
          DEFAULT: 'rgb(137 124 103)',
        },
      },
    },
  },
  plugins: [],
};
