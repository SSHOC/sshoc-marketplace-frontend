import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AboutScreen from './AboutScreen'

export default {
  title: 'Screens|About',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
}

export const basic = () => <AboutScreen />
