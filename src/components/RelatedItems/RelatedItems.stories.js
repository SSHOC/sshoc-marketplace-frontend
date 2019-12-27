import React from 'react'
import { range } from '../../utils'
import { createMockItem, withMemoryRouter } from '../../utils/test'
import RelatedItems from './RelatedItems'

export default {
  title: 'Components|RelatedItems',
  decorators: [withMemoryRouter],
}

export const resources = () => (
  <RelatedItems items={range(3).map(createMockItem)} />
)
