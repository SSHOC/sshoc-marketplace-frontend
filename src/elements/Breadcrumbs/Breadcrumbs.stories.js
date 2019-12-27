import React from 'react'
import { withMemoryRouter } from '../../utils/test'
import Breadcrumbs from './Breadcrumbs'

export default {
  title: 'Elements|Breadcrumbs',
  decorators: [withMemoryRouter],
}

export const home = () => (
  <Breadcrumbs paths={[{ label: 'Home', value: '/' }]} />
)

export const paths = () => (
  <Breadcrumbs
    paths={[
      { label: 'Home', value: '/' },
      { label: 'Items', value: '/items' },
      { label: 'Details', value: '/items/id1' },
    ]}
  />
)

export const delimiter = () => (
  <Breadcrumbs
    delimiter=">"
    paths={[
      { label: 'Home', value: '/' },
      { label: 'Items', value: '/items' },
      { label: 'Details', value: '/items/id1' },
    ]}
  />
)
