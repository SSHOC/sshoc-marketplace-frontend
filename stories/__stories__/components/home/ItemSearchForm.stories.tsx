import type { Meta, StoryObj } from '@storybook/react'

import type { ItemSearchFormProps } from '@/components/home/ItemSearchForm'
import { ItemSearchForm } from '@/components/home/ItemSearchForm'
import { seedDatabase } from '@/data/sshoc/mocks/data'
import { handlers as itemHandlers } from '@/data/sshoc/mocks/handlers/item'
import { ContextProviders } from '~/stories/lib/Providers'

const meta: Meta<ItemSearchFormProps> = {
  title: 'Components/Home/ItemSearchForm',
  component: ItemSearchForm,
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

export const Default: StoryObj<ItemSearchFormProps> = {
  args: {},
  parameters: {
    msw: {
      handlers: [...itemHandlers],
    },
  },
}
