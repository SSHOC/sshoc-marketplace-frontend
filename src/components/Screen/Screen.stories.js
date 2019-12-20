import { action } from '@storybook/addon-actions'
import React from 'react'
import { withMemoryRouter } from '../../utils'
import Screen from './Screen'

export default {
  title: 'Components|Screen',
  decorators: [withMemoryRouter],
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
