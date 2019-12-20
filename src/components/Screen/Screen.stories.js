import { action } from '@storybook/addon-actions'
import React from 'react'
import Screen from './Screen'
import { BrowserRouter as Router } from 'react-router-dom'
import { addDecorator } from '@storybook/react'

export default {
  title: 'Components|Screen',
}

addDecorator(storyFn => <Router>{storyFn()}</Router>)

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
