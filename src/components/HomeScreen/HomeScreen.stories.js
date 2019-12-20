import React from 'react'
import { StaticRouter as Router } from 'react-router-dom'
import HomeScreen from './HomeScreen'

export default {
  title: 'Screens|Home',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
}

export const basic = () => <HomeScreen />
