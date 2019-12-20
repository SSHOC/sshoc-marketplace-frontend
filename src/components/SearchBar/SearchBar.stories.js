import { action } from '@storybook/addon-actions'
import React from 'react'
import SearchBar from './SearchBar'

export default {
  title: 'Components|SearchBar',
}

const actions = {
  onSearchParamsChange: action('onSearchParamsChange'),
}

export const basic = () => (
  <SearchBar
    onSearchParamsChange={actions.onSearchParamsChange}
    query="Search term"
  />
)
