const defaultTheme = require('tailwindcss/defaultTheme')

/** convert pixel to rem */
function px(px) {
  return `${px / 16}rem`
}

module.exports = {
  purge: ['src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#ECECEC',
          250: '#E5E5E5',
          300: '#DDDDDD',
          350: '#C6C6C6',
          500: '#898989',
          550: '#767676',
          600: '#575858',
          800: '#373A3C',
        },
        /** dark blue */
        primary: {
          500: '#3978A1',
          700: '#065F98',
          750: '#045C95',
          800: '#02558C',
        },
        /** light blue */
        secondary: {
          500: '#1B9ADD',
          600: '#0085CA',
          700: '#1C7CD5',
          750: '#156599',
        },
        highlight: {
          50: '#F5FBFF',
          75: '#E7F5FF', // input
          100: '#E4F2F8',
          200: '#D0E4EF',
        },
        error: {
          600: '#D93025',
        },
      },
      fontFamily: {
        sans: ['Ubuntu', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xs: px(12),
        sm: px(15),
        lg: px(17),
        xl: px(20),
        '2xl': px(26),
        '3xl': px(32),
      },
      /** max-widths for readability */
      maxWidth: {
        '65ch': '65ch',
        '80ch': '80ch',
      },
      /** see custom properties in global.css */
      screens: {
        '2xs': '320px',
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1600px',
        '3xl': '1920px',
      },
      /** @tailwindcss/typography plugin */
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.primary.800'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
          },
        },
      }),
      width: {
        36: '9rem',
      },
      zIndex: {
        '-10': '-10',
      },
    },
  },
  variants: {
    // boxShadow: ['responsive', 'hover', 'focus', 'focus-visible']
  },
  plugins: [require('@tailwindcss/typography')],
}
