import React from 'react'
import { createMockItem, withMemoryRouter } from '../../utils/test'
import RelatedItem from './RelatedItem'

export default {
  title: 'Components|RelatedItem',
  decorators: [withMemoryRouter],
}

export const resource = () => <RelatedItem item={createMockItem(1)} />
