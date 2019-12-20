import React from 'react'
import { StaticRouter as Router } from 'react-router-dom'
import { createMockItem } from '../../utils'
import SearchResult from './SearchResult'

export default {
  title: 'Components|SearchResult',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
}

export const basic = () => <SearchResult result={createMockItem(1)} />
