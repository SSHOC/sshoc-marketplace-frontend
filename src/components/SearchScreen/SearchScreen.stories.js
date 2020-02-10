import { action } from '@storybook/addon-actions'
import React from 'react'
import { REQUEST_STATUS } from '../../store/constants'
import { range } from '../../utils'
import { createMockItem, withMemoryRouter } from '../../utils/test'
import { SearchScreen } from './SearchScreen'

export default {
  title: 'Screens|Search',
  decorators: [withMemoryRouter],
}

const actions = {
  onSearchParamsChange: action('onSearchParamsChange'),
}

const sarchParams = {
  categories: ['tool'],
  page: 2,
  sort: 'label',
}

export const idle = () => (
  <SearchScreen
    collection={{}}
    onSearchParamsChange={actions.onSearchParamsChange}
    request={{ info: {}, status: REQUEST_STATUS.IDLE }}
    searchParams={sarchParams}
  />
)

export const loading = () => (
  <SearchScreen
    collection={{}}
    onSearchParamsChange={actions.onSearchParamsChange}
    request={{ info: {}, status: REQUEST_STATUS.PENDING }}
    searchParams={sarchParams}
  />
)

export const error = () => (
  <SearchScreen
    collection={{}}
    onSearchParamsChange={actions.onSearchParamsChange}
    request={{ info: {}, status: REQUEST_STATUS.FAILED }}
    searchParams={sarchParams}
  />
)

export const empty = () => (
  <SearchScreen
    collection={{}}
    onSearchParamsChange={actions.onSearchParamsChange}
    request={{ info: {}, status: REQUEST_STATUS.SUCCEEDED }}
    searchParams={sarchParams}
  />
)

export const resources = () => (
  <SearchScreen
    collection={{}}
    onSearchParamsChange={actions.onSearchParamsChange}
    request={{ info: {}, status: REQUEST_STATUS.SUCCEEDED }}
    results={range(26).map(createMockItem)}
    searchParams={sarchParams}
  />
)
