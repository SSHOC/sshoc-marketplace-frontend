import type { Meta, StoryObj } from '@storybook/react'

import type { ApiEndpointProps } from '@/components/documentation/ApiEndpoint'
import { ApiEndpoint } from '@/components/documentation/ApiEndpoint'
import { ApiParamSelect } from '@/components/documentation/ApiParamSelect'
import { ApiParamTextField } from '@/components/documentation/ApiParamTextField'
import { seedDatabase } from '@/data/sshoc/mocks/data'
import { handlers as itemHandlers } from '@/data/sshoc/mocks/handlers/item'
import { Item } from '@/lib/core/ui/Collection/Item'
import { ContextProviders } from '~/stories/lib/Providers'

const meta: Meta<ApiEndpointProps> = {
  title: 'Components/Documentation/ApiEndpoint',
  component: ApiEndpoint,
  decorators: [
    function Wrapper(Story): JSX.Element {
      return (
        <ContextProviders pageProps={{}}>
          <Story />
        </ContextProviders>
      )
    },
  ],
  loaders: [
    function loader() {
      seedDatabase()
      return Promise.resolve({})
    },
  ],
}

export default meta

export const ItemCategories: StoryObj<ApiEndpointProps> = {
  args: {
    endpoint: {
      key: 'items-categories',
      pathname: '/api/items-categories',
    },
  },
  parameters: {
    msw: {
      handlers: [...itemHandlers],
    },
  },
}

export const ItemSearch: StoryObj<ApiEndpointProps> = {
  args: {
    endpoint: {
      key: 'item-search',
      pathname: '/api/item-search',
    },
    children: [
      <ApiParamTextField key="q" label="Search" param="q" placeholder="Search term" />,
      <ApiParamSelect key="page" label="Page" param="page">
        <Item key={1}>Page 1</Item>
        <Item key={2}>Page 2</Item>
        <Item key={3}>Page 3</Item>
      </ApiParamSelect>,
    ],
  },
  parameters: {
    msw: {
      handlers: [...itemHandlers],
    },
  },
}
