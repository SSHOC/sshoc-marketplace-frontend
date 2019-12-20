import { action } from '@storybook/addon-actions'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Screen from './Screen'

export default {
  title: 'Components|Screen',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
}

const actions = {
  onSearchParamsChange: action('onSearchParamsChange'),
}

export const basic = () => (
  <Screen
    breadcrumbs={[
      { label: 'Home', value: '/' },
      { label: 'Route', value: '/route' },
    ]}
    onSearchParamsChange={actions.onSearchParamsChange}
    searchParams={{ query: 'Search term' }}
  />
)
