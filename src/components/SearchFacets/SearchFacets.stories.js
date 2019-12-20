import { action } from '@storybook/addon-actions'
import React from 'react'
import { StaticRouter as Router } from 'react-router-dom'
import { ITEM_CATEGORY } from '../../constants'
import SearchFacets from './SearchFacets'

export default {
  title: 'Components|SearchFacets',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
}

const actions = {
  onSearchParamsChange: action('onSearchParamsChange'),
}

export const basic = () => (
  <SearchFacets
    collection={{}}
    request={{}}
    onSearchParamsChange={actions.onSearchParamsChange}
    searchParams={{
      categories: Object.keys(ITEM_CATEGORY).slice(1),
      query: 'Search term',
    }}
  />
)
