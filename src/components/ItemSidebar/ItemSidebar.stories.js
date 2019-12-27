import React from 'react'
import { createMockItem, withMemoryRouter } from '../../utils/test'
import ItemSidebar from './ItemSidebar'

export default {
  title: 'Components|ItemSidebar',
  decorators: [withMemoryRouter],
}

export const resource = () => <ItemSidebar resource={createMockItem(1)} />

export const versions = () => (
  <ItemSidebar
    resource={{
      ...createMockItem(1),
      newerVersions: [{ id: 2, label: 'Next version', version: '2.0' }],
      olderVersions: [{ id: 3, label: 'Previous version', version: '0.1' }],
    }}
  />
)
