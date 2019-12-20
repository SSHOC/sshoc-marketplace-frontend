import { addDecorator } from '@storybook/react'
import React from 'react'
import Header from './Header'
import { BrowserRouter as Router } from 'react-router-dom'

export default {
  title: 'Components|Header',
}

addDecorator(storyFn => <Router>{storyFn()}</Router>)

export const basic = () => <Header />
