import type { Meta, StoryObj } from '@storybook/react'

import type { HomePage } from '@/pages/index.page'
import HomePageComponent, { getStaticProps } from '@/pages/index.page'
import { getProps } from '~/stories/lib/getProps'
import { ContextProviders } from '~/stories/lib/Providers'

const meta: Meta<HomePage.Props> = {
  title: 'Pages/Home',
  component: HomePageComponent,
  decorators: [
    function Wrapper(story, { loaded: pageProps }): JSX.Element {
      return <ContextProviders pageProps={pageProps}>{story()}</ContextProviders>
    },
  ],
  loaders: [
    async function _getStaticProps({ globals }): Promise<HomePage.Props> {
      const response = await getStaticProps({ locale: globals['locale'] })
      return getProps(response)
    },
  ],
  parameters: {
    msw: { handlers: [] },
    router: {},
  },
  // render: (args, { loaded: pageProps }) => <HomePage {...pageProps} {...args} />,
}

export default meta

export const Page: StoryObj<HomePage.Props> = {
  args: {},
  parameters: {
    msw: { handlers: [] },
    router: {},
  },
}
