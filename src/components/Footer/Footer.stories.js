import React from 'react'
import { StaticRouter as Router } from 'react-router-dom'
import Footer from './Footer'

export default {
  title: 'Components|Footer',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
}

export const basic = () => <Footer />
