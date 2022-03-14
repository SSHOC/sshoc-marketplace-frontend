import type { Meta, StoryObj } from '@storybook/react'

import { ItemSearchBar } from '@/components/common/ItemSearchBar'
import { seedDatabase } from '@/data/sshoc/mocks/data'
import { handlers as itemHandlers } from '@/data/sshoc/mocks/handlers/item'
import { ContextProviders } from '~/stories/lib/Providers'

type ItemSearchBarProps = Record<string, never>

const meta: Meta<ItemSearchBarProps> = {
  title: 'Components/Common/ItemSearchBar',
  component: ItemSearchBar,
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

export const Default: StoryObj<ItemSearchBarProps> = {
  args: {},
  parameters: {
    msw: {
      handlers: [...itemHandlers],
    },
  },
}
