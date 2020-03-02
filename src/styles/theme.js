import { transparentize } from 'polished'
import 'typeface-open-sans'
import 'typeface-ubuntu'

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
  },
  white: '#ffffff',
  blue: {
    // 100: '',
    // 200: '',
    // 300: '',
    // 400: '',
    500: '#0085ca',
    // 600: '',
    // 600: '',
    // 700: '',
    800: '#00558c',
    // 900: '',
  },
  orange: {
    500: '#ff9e1b',
  },
}

const colors = {
  ...baseColors,
  // accent: '',
  background: baseColors.white,
  border: baseColors.grey['500'],
  // highlight: '',
  muted: baseColors.grey['800'],
  primary: baseColors.blue['800'],
  primaryActive: baseColors.blue['500'],
  primaryHover: baseColors.blue['500'],
  secondary: '',
  subtle: baseColors.grey['300'],
  subtler: baseColors.grey['200'],
  subtlest: baseColors.grey['100'],
  text: baseColors.black,
  modes: {
    dark: {},
  },
}

const fontSizes = [10, 12, 13, 14, 18, 20, 22, 30, 38, 46, 62]
fontSizes.tiny = 9

export const theme = {
  breakpoints: ['40em', '54em', '64em'],
  colors,
  fonts: {
    body: '"Open Sans", system-ui, sans-serif',
    heading: 'Ubuntu, system-ui, sans-serif',
  },
  fontSizes,
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
    primary: `linear-gradient(to right, ${baseColors.blue['500']}, ${
      baseColors.blue['800']
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
    toast: 400,
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
  transitions: {
    default: '0.2s ease-out',
  },
  zIndices: {
    select: 100,
    focus: 500,
  },
}
