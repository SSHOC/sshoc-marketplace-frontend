import React from 'react'
import { createMockItem, withMemoryRouter } from '../../utils'
import SearchResult from './SearchResult'

export default {
  title: 'Components|SearchResult',
  decorators: [withMemoryRouter],
}

export const basic = () => <SearchResult result={createMockItem(1)} />
