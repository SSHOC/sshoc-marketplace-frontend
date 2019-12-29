import { addDecorator, addParameters, configure } from '@storybook/react'
import React from 'react'
import { GlobalStyles, ThemeProvider } from '../src/styles'

addDecorator(storyFn => (
  <ThemeProvider>
    <GlobalStyles />
    <div style={{ margin: 20 }}>{storyFn()}</div>
  </ThemeProvider>
))

addParameters({
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
})

configure(
  [
    require.context('../src/components', true, /\.stories\.js$/),
    require.context('../src/elements', true, /\.stories\.js$/),
    require.context('../src/styles', true, /\.stories\.js$/),
  ],
  module
)
