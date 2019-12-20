import { action } from '@storybook/addon-actions'
import React from 'react'
import { StaticRouter as Router } from 'react-router-dom'
import 'styled-components/macro'
import Flex from '../../elements/Flex/Flex'
import { REQUEST_STATUS } from '../../store/constants'
import { createMockItem, range } from '../../utils'
import SearchResults from './SearchResults'

export default {
  title: 'Components|SearchResults',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
}

const actions = {
  onSearchParamsChange: action('onSearchParamsChange'),
}

const Container = ({ children }) => (
  <Flex css={{ height: 'calc(100vh - 40px)', overflowX: 'hidden', padding: 4 }}>
    {children}
  </Flex>
)

export const idle = () => (
  <Container>
    <SearchResults
      css={{ flex: 1 }}
      onSearchParamsChange={actions.onSearchParamsChange}
      request={{ info: {}, status: REQUEST_STATUS.IDLE }}
      searchParams={{}}
    />
  </Container>
)

export const loading = () => (
  <Container>
    <SearchResults
      css={{ flex: 1 }}
      onSearchParamsChange={actions.onSearchParamsChange}
      request={{ info: {}, status: REQUEST_STATUS.PENDING }}
      searchParams={{}}
    />
  </Container>
)

export const error = () => (
  <Container>
    <SearchResults
      css={{ flex: 1 }}
      onSearchParamsChange={actions.onSearchParamsChange}
      request={{ info: {}, status: REQUEST_STATUS.FAILED }}
      searchParams={{}}
    />
  </Container>
)

export const empty = () => (
  <Container>
    <SearchResults
      css={{ flex: 1 }}
      onSearchParamsChange={actions.onSearchParamsChange}
      request={{ info: {}, status: REQUEST_STATUS.SUCCEEDED }}
      results={[]}
      searchParams={{}}
    />
  </Container>
)

export const resources = () => (
  <Container>
    <SearchResults
      css={{ flex: 1 }}
      onSearchParamsChange={actions.onSearchParamsChange}
      request={{
        info: { pages: 2 },
        status: REQUEST_STATUS.SUCCEEDED,
      }}
      results={range(3).map(createMockItem)}
      searchParams={{}}
    />
  </Container>
)
