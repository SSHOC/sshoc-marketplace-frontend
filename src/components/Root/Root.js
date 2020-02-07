import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { configureStore } from '../../store/configureStore'
import { GlobalStyles, ThemeProvider } from '../../styles'
import App from '../App/App'

const store = configureStore({})

const Root = () => (
  <Provider store={store}>
    <ThemeProvider>
      <GlobalStyles />
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </Provider>
)

export default Root
