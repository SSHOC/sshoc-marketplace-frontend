import React from 'react'
import Header from './Header'
import { BrowserRouter as Router } from 'react-router-dom'

export default {
  title: 'Components|Header',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
}

export const basic = () => <Header />
