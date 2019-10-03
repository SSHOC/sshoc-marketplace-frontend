import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Home from '../screens/Home'
import NotFound from '../screens/NotFound'

import ErrorBoundary from './ErrorBoundary'
import Layout from './Layout'

import { configureStore } from '../store/configureStore'

const store = configureStore()

const App = () => (
  <Provider store={store}>
    <Router>
      <Layout>
        <ErrorBoundary>
          <Switch>
            <Route component={Home} exact path="/" />
            <Route component={NotFound} />
          </Switch>
        </ErrorBoundary>
      </Layout>
    </Router>
  </Provider>
)

export default App
