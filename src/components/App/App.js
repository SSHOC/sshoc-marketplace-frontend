import React from 'react'
import { Route, Switch } from 'react-router-dom'
import About from '../../pages/About/About'
import Browse from '../../pages/Browse/Browse'
import Contact from '../../pages/Contact/Contact'
import Dataset from '../../pages/Dataset/Dataset'
import Home from '../../pages/Home/Home'
import Login from '../../pages/Login/Login'
import NotFound from '../../pages/NotFound/NotFound'
import PrivacyPolicy from '../../pages/PrivacyPolicy/PrivacyPolicy'
import Publication from '../../pages/Publication/Publication'
import Search from '../../pages/Search/Search'
import Tool from '../../pages/Tool/Tool'
import TrainingMaterial from '../../pages/TrainingMaterial/TrainingMaterial'
import Workflow from '../../pages/Workflow/Workflow'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import Page from '../Page/Page'
import useMatomo from '../../utils/matomo'

const App = () => {
  useMatomo()

  return (
    <Page>
      <ErrorBoundary>
        <Switch>
          <Route component={Home} exact path="/" />
          <Route component={About} path="/about" />
          <Route component={Browse} path="/browse" />
          <Route component={Contact} path="/contact" />
          <Route component={Dataset} path="/dataset/:id" />
          <Route component={Login} path="/login" />
          <Route component={PrivacyPolicy} path="/privacy-policy" />
          <Route component={Publication} path="/publication/:id" />
          <Route component={Search} path="/search" />
          <Route component={Tool} path="/tool-or-service/:id" />
          <Route component={TrainingMaterial} path="/training-material/:id" />
          <Route component={Workflow} path="/workflow/:id" />
          <Route component={NotFound} />
        </Switch>
      </ErrorBoundary>
    </Page>
  )
}

export default App
