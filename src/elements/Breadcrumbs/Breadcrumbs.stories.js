import { addDecorator } from '@storybook/react'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'

export default {
  title: 'Elements|Breadcrumbs',
}

addDecorator(storyFn => <Router>{storyFn()}</Router>)

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
