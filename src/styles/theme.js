import { transparentize } from 'polished'
import 'typeface-poppins'

const baseColors = {
  black: '#373a3c',
  grey: {
    // 100: '',
    // 200: '',
    300: '#ececec',
    400: '#d1d1d1',
    500: '#dddddd',
    600: '#a7a7a7',
    // 700: '',
    800: '#777777',
    900: '#575858',
  },
  white: '#ffffff',
  blue: {
    // 100: '',
    // 200: '',
    300: '#57afff',
    // 400: '',
    500: '#4d80fa',
    // 600: '',
    700: '#4249f5',
    // 800: '',
    // 900: '',
  },
}

const colors = {
  ...baseColors,
  // accent: '',
  background: baseColors.white,
  border: baseColors.grey['500'],
  // highlight: '',
  muted: baseColors.grey['600'],
  primary: baseColors.blue['500'],
  secondary: '',
  subtle: baseColors.grey['300'],
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
  fontSizes: [12, 14, 16, 20, 24, 32, 40, 48, 64],
  fontWeights: {
    body: 400,
    bold: 700,
    heading: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
    small: 1.125,
  },
  radii: [0, 2, 4, 7, '50%'],
  shadows: {
    focus: theme => `0 0 0 3px ${transparentize(0.4, theme.colors.primary)}`,
    small: '0 3px 3px rgba(0, 0, 0, 0.05)',
    medium: '0 3px 6px rgba(0, 0, 0, 0.16)',
  },
  sizes: {
    container: 1600,
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  text: {
    body: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
    },
    heading: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
    },
  },
}
