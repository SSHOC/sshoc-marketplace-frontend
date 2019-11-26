import { addDecorator, configure } from '@storybook/react'
import React from 'react'
import { GlobalStyles, ThemeProvider } from '../src/styles'

addDecorator(storyFn => (
  <ThemeProvider>
    <GlobalStyles />
    <div style={{ margin: 20 }}>{storyFn()}</div>
  </ThemeProvider>
))

configure(
  [
    require.context('../src/components', true, /\.stories\.js$/),
    require.context('../src/elements', true, /\.stories\.js$/),
    require.context('../src/styles', true, /\.stories\.js$/),
  ],
  module
)
