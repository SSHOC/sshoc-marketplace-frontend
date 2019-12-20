import { action } from '@storybook/addon-actions'
import React from 'react'
import { ITEM_CATEGORY } from '../../constants'
import { withMemoryRouter } from '../../utils'
import SearchFacets from './SearchFacets'

export default {
  title: 'Components|SearchFacets',
  decorators: [withMemoryRouter],
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
