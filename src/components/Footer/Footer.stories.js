import { addDecorator } from '@storybook/react'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Footer from './Footer'

export default {
  title: 'Components|Footer',
}

addDecorator(storyFn => <Router>{storyFn()}</Router>)

export const basic = () => <Footer />
