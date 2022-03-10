import type { Meta, StoryObj } from '@storybook/react'

import { SearchResults } from '@/components/search/SearchResults'
import { seedDatabase } from '@/data/sshoc/mocks/data'
import { handlers as itemHandlers } from '@/data/sshoc/mocks/handlers/item'
import { ContextProviders } from '~/stories/lib/Providers'

type SearchResultsProps = Record<string, never>

const meta: Meta<SearchResultsProps> = {
  title: 'Components/Search/SearchResults',
  component: SearchResults,
  decorators: [
    function Wrapper(story): JSX.Element {
      return <ContextProviders pageProps={{}}>{story()}</ContextProviders>
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

export const Default: StoryObj<SearchResultsProps> = {
  args: {},
  parameters: {
    msw: {
      handlers: [...itemHandlers],
    },
  },
}
