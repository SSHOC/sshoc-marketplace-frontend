// @ts-expect-error Missing module declaration.
const defaultTheme = require('tailwindcss/defaultTheme')

/** convert pixel to rem */
/** @type {(px: number) => string} */
function px(px) {
  return `${px / 16}rem`
}

module.exports = {
  content: ['src/**/*.tsx', 'src/**/*.mdx'],
  theme: {
    extend: {
      backgroundSize: {
        double: '150% 150%',
      },
      colors: {
        inherit: 'inherit',
        gray: {
          50: '#FAFAFA',
          75: '#fcfcfc',
          90: '#f9f9f9',
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
          350: '#57afff',
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
          300: '#aacee2',
        },
        error: {
          500: '#D93025',
          600: '#D93025',
        },
        success: {
          500: '#3aa23a',
          600: '#449d44',
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
        'ui-xs': [px(11), { lineHeight: px(14) }],
        'ui-sm': [px(13), { lineHeight: px(18) }],
        'ui-base': [px(15), { lineHeight: px(22) }],
        'ui-lg': [px(17), { lineHeight: px(26) }],
        'ui-xl': [px(19), { lineHeight: px(26) }],
        'ui-3xl': [px(28), { lineHeight: px(34) }],
      },
      /** max-widths for readability */
      maxWidth: {
        '65ch': '65ch',
        '80ch': '80ch',
        64: px(192),
        '1.5xl': '40rem',
      },
      minWidth: {
        64: px(192),
      },
      width: {
        3.75: px(15),
        36: '9rem',
      },
      height: {
        3.75: px(15),
      },
      /** @tailwindcss/typography plugin */
      typography: (/** @type {(token: string) => string} */ theme) => {
        return {
          DEFAULT: {
            css: {
              maxWidth: '',
              color: theme('colors.gray.800'),
              a: {
                color: theme('colors.primary.800'),
                '&:hover': {
                  color: theme('colors.primary.700'),
                },
              },
              h1: {
                color: theme('colors.gray.800'),
                fontWeight: '500',
              },
              h2: {
                color: theme('colors.gray.800'),
                fontWeight: '500',
              },
              h3: {
                color: theme('colors.gray.800'),
                fontWeight: '500',
              },
              h4: {
                color: theme('colors.gray.800'),
                fontWeight: '500',
              },
              '.grid img': {
                marginTop: 0,
              },
            },
          },
        }
      },
      zIndex: {
        '-10': '-10',
      },
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
  },
  variants: {
    extend: {
      backgroundPosition: ['hover', 'focus'],
    },
  },
  plugins: [
    // @ts-expect-error Missing module declaration.
    require('@tailwindcss/typography')({
      modifiers: [],
    }),
  ],
}
