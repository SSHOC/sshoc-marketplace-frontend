import { transparentize } from 'polished'
import 'typeface-poppins'

const baseColors = {
  black: '#373a3c',
  grey: {
    100: '#fcfcfc',
    200: '#f9f9f9',
    300: '#ececec',
    400: '#d1d1d1',
    500: '#dddddd',
    600: '#a7a7a7',
    // 700: '',
    800: '#777777',
    900: '#606265',
    // 950: '#575858',
  },
  white: '#ffffff',
  blue: {
    // 100: '',
    // 200: '',
    300: '#57afff',
    // 400: '',
    500: '#4d80fa',
    // 600: '',
    600: '#4249f5',
    700: '#3364db',
    800: '#2755c4',
    // 900: '',
  },
}

const colors = {
  ...baseColors,
  // accent: '',
  background: baseColors.white,
  border: baseColors.grey['500'],
  // highlight: '',
  muted: baseColors.grey['800'],
  primary: baseColors.blue['500'],
  primaryActive: baseColors.blue['800'],
  primaryHover: baseColors.blue['700'],
  secondary: '',
  subtle: baseColors.grey['300'],
  subtler: baseColors.grey['200'],
  subtlest: baseColors.grey['100'],
  text: baseColors.black,
  modes: {
    dark: {},
  },
}

export const theme = {
  breakpoints: ['40em', '52em', '64em'],
  colors,
  fonts: {
    body: 'Poppins, system-ui, sans-serif',
    heading: 'inherit',
  },
  fontSizes: [12, 14, 15, 16, 20, 22, 24, 32, 40, 48, 64],
  fontWeights: {
    extraBold: 800,
    extraLight: 200,
    black: 900,
    body: 400,
    bold: 700,
    heading: 500,
    light: 300,
    medium: 500,
    regular: 400,
    semiBold: 600,
    thin: 100,
  },
  gradients: {
    primary: `linear-gradient(to right, ${baseColors.blue['300']}, ${
      baseColors.blue['600']
    })`,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
    large: 2,
    small: 1.125,
  },
  radii: [0, 2, 4, 7, '50%'],
  shadows: {
    small: '0 3px 3px rgba(0, 0, 0, 0.05)',
    medium: '0 3px 6px rgba(0, 0, 0, 0.16)',
    outline: `0 0 0 3px ${transparentize(0.6, colors.primary)}`,
  },
  sizes: {
    container: 1600,
    narrow: 1000,
    row: 80,
    sidebar: 300,
    wide: 1900,
  },
  space: [0, 4, 8, 16, 32, 48, 64, 128, 256, 512],
  text: {
    body: {
      fontFamily: 'body',
      fontSize: 2,
      fontWeight: 'body',
      lineHeight: 'body',
    },
    heading: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
    },
  },
  zIndices: {
    select: 100,
    focus: 500,
  },
}
