import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '../../store/configureStore'
import { GlobalStyles, ThemeProvider } from '../../styles'
import App from '../App/App'

const store = configureStore()

const Root = () => (
  <Provider store={store}>
    <ThemeProvider>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  </Provider>
)

export default Root
