import React from 'react'
import { StaticRouter as Router } from 'react-router-dom'
import SearchForm from './SearchForm'

export default {
  title: 'Components|SearchForm',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
}

export const basic = () => <SearchForm />
