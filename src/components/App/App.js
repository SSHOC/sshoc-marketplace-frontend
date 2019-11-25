import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import Layout from '../Layout/Layout'
import About from '../../pages/About/About'
import Contact from '../../pages/Contact/Contact'
import Dataset from '../../pages/Dataset/Dataset'
import Home from '../../pages/Home/Home'
import NotFound from '../../pages/NotFound/NotFound'
import PrivacyPolicy from '../../pages/PrivacyPolicy/PrivacyPolicy'
import Search from '../../pages/Search/Search'
import Tool from '../../pages/Tool/Tool'
import TrainingMaterial from '../../pages/TrainingMaterial/TrainingMaterial'

const App = () => (
  <Router>
    <Layout>
      <ErrorBoundary>
        <Switch>
          <Route component={Home} exact path="/" />
          <Route component={About} path="/about" />
          <Route component={Contact} path="/contact" />
          <Route component={Dataset} path="/datasets/:id" />
          <Route component={PrivacyPolicy} path="/privacy-policy" />
          <Route component={Search} path="/search" />
          <Route component={Tool} path="/tools/:id" />
          <Route component={TrainingMaterial} path="/training-materials/:id" />
          <Route component={NotFound} />
        </Switch>
      </ErrorBoundary>
    </Layout>
  </Router>
)

export default App
