import React from 'react'
import ContactScreen from './ContactScreen'
import { StaticRouter as Router } from 'react-router-dom'

export default {
  title: 'Screens|Contact',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
}

export const basic = () => <ContactScreen />
