import type { Meta, StoryObj } from '@storybook/react'

import { LastUpdatedItems } from '@/components/home/LastUpdatedItems'
import { seedDatabase } from '@/data/sshoc/mocks/data'
import { handlers as itemHandlers } from '@/data/sshoc/mocks/handlers/item'
import { ContextProviders } from '~/stories/lib/Providers'

type LastUpdatedItemsProps = Record<string, never>

const meta: Meta<LastUpdatedItemsProps> = {
  title: 'Components/Home/LastUpdatedItems',
  component: LastUpdatedItems,
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

export const Default: StoryObj<LastUpdatedItemsProps> = {
  args: {},
  parameters: {
    msw: {
      handlers: [...itemHandlers],
    },
  },
}
