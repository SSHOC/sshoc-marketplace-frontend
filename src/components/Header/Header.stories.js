import React from 'react'
import { StaticRouter as Router } from 'react-router-dom'
import Header from './Header'

export default {
  title: 'Components|Header',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
}

export const basic = () => <Header />
