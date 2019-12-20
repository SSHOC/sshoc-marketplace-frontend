import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { createMockItem, range } from '../../utils'
import RelatedItems from './RelatedItems'

export default {
  title: 'Components|RelatedItems',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
}

export const resources = () => (
  <RelatedItems items={range(3).map(createMockItem)} />
)
