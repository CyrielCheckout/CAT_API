/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.blue.600'),
              '&:hover': {
                color: theme('colors.blue.800'),
              },
            },
            p: {
              'margin-top': '0.5em',
              'margin-bottom': '0.5em',
            },
            h1: {
              color: theme('colors.gray.900'),
            },
            h2: {
              color: theme('colors.gray.900'),
            },
            h3: {
              color: theme('colors.gray.900'),
            },
            code: {
              color: theme('colors.pink.600'),
              backgroundColor: theme('colors.gray.100'),
              //padding: '0.2em 0.4em',
              borderRadius: '0.3em',
            },
            pre: {
              backgroundColor: theme('colors.gray.200'),
              color: theme('colors.black'),
              padding: '1em',
              borderRadius: '0.3em',
            },
          },
        },
      })
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

