import { action } from '@storybook/addon-actions'
import { addDecorator } from '@storybook/react'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import SearchFacets from './SearchFacets'
import { ITEM_CATEGORY } from '../../constants'

export default {
  title: 'Components|SearchFacets',
}

addDecorator(storyFn => <Router>{storyFn()}</Router>)

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
