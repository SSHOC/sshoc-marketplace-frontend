import css from '@styled-system/css'
import { createGlobalStyle } from 'styled-components/macro'

export const GlobalStyles = createGlobalStyle(
  css({
    '*, *::after, *::body': {
      boxSizing: 'border-box',
    },
    body: {
      bg: 'background',
      color: 'text',
      margin: 0,
      textRendering: 'optimizeLegibility',
      transition: 'background-color 0.2s ease-out, color 0.2s ease-out',
      variant: 'text.body',
    },
  })
)
