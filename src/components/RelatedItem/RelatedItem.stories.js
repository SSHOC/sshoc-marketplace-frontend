import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { createMockItem } from '../../utils'
import RelatedItem from './RelatedItem'

export default {
  title: 'Components|RelatedItem',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
}

export const resource = () => <RelatedItem item={createMockItem(1)} />
