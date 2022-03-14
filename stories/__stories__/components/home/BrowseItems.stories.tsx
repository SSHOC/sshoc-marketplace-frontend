import type { Meta, StoryObj } from '@storybook/react'

import { BrowseItems } from '@/components/home/BrowseItems'
import { seedDatabase } from '@/data/sshoc/mocks/data'
import { handlers as itemHandlers } from '@/data/sshoc/mocks/handlers/item'
import { ContextProviders } from '~/stories/lib/Providers'

type BrowseItemsProps = Record<string, never>

const meta: Meta<BrowseItemsProps> = {
  title: 'Components/Home/BrowseItems',
  component: BrowseItems,
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

export const Default: StoryObj<BrowseItemsProps> = {
  args: {},
  parameters: {
    msw: {
      handlers: [...itemHandlers],
    },
  },
}
