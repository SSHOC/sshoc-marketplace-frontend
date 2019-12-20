import React from 'react'
import { createMockItem, range, withMemoryRouter } from '../../utils'
import RelatedItems from './RelatedItems'

export default {
  title: 'Components|RelatedItems',
  decorators: [withMemoryRouter],
}

export const resources = () => (
  <RelatedItems items={range(3).map(createMockItem)} />
)
