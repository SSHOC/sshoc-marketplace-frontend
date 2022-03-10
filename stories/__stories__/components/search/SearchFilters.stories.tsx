import type { Meta, StoryObj } from '@storybook/react'

import { SearchFilters } from '@/components/search/SearchFilters'
import { seedDatabase } from '@/data/sshoc/mocks/data'
import { handlers as itemHandlers } from '@/data/sshoc/mocks/handlers/item'
import { ContextProviders } from '~/stories/lib/Providers'

type SearchFiltersProps = Record<string, never>

const meta: Meta<SearchFiltersProps> = {
  title: 'Components/Search/SearchFilters',
  component: SearchFilters,
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

export const Default: StoryObj<SearchFiltersProps> = {
  args: {},
  parameters: {
    msw: {
      handlers: [...itemHandlers],
    },
    router: {
      pathname: '/search',
      query: {
        categories: ['dataset'],
        'f.keyword': ['recommended'],
      },
    },
  },
}
