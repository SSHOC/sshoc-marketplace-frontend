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
      transition: theme =>
        [
          `background-color ${theme.transitions.default}`,
          `color ${theme.transitions.default}`,
        ].join(', '),
      variant: 'text.body',
    },
  })
)
