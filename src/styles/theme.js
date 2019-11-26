import { transparentize } from 'polished'

const baseColors = {
  black: '#373a3c',
  grey: {
    // 100: '',
    // 200: '',
    300: '#e6e6e6',
    400: '#d1d1d1',
    500: '#dddddd',
    // 600: '',
    700: '#a7a7a7',
    800: '#777777',
    900: '#575858',
  },
  white: '#ffffff',
  blue: {
    // 100: '',
    // 200: '',
    300: '#57afff',
    // 400: '',
    500: '#4249f5',
    // 600: '',
    700: '#4d80fa',
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
  // muted: '',
  primary: baseColors.blue['500'],
  secondary: '',
  // subtle: '',
  text: baseColors.black,
  modes: {
    dark: {},
  },
}

export const theme = {
  breakpoints: ['40em', '52em', '64em'],
  colors,
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'inherit',
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72],
  fontWeights: {
    body: 400,
    bold: 700,
    heading: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
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
