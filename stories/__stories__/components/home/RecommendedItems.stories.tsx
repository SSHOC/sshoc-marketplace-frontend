import type { Meta, StoryObj } from '@storybook/react'

import { RecommendedItems } from '@/components/home/RecommendedItems'
import { seedDatabase } from '@/data/sshoc/mocks/data'
import { handlers as itemHandlers } from '@/data/sshoc/mocks/handlers/item'
import { ContextProviders } from '~/stories/lib/Providers'

type RecommendedItemsProps = Record<string, never>

const meta: Meta<RecommendedItemsProps> = {
  title: 'Components/Home/RecommendedItems',
  component: RecommendedItems,
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

export const Default: StoryObj<RecommendedItemsProps> = {
  args: {},
  parameters: {
    msw: {
      handlers: [...itemHandlers],
    },
  },
}
