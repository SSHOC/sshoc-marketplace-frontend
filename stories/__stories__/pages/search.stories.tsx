import type { Meta, StoryObj } from '@storybook/react'

import type { SearchPage } from '@/pages/search/index.page'
import SearchPageComponent, { getStaticProps } from '@/pages/search/index.page'
import { getProps } from '~/stories/lib/getProps'
import { ContextProviders } from '~/stories/lib/Providers'

const meta: Meta<SearchPage.Props> = {
  title: 'Pages/Search',
  component: SearchPageComponent,
  decorators: [
    function Wrapper(story, { loaded: pageProps }): JSX.Element {
      return <ContextProviders pageProps={pageProps}>{story()}</ContextProviders>
    },
  ],
  loaders: [
    async function _getStaticProps({ globals }): Promise<SearchPage.Props> {
      const response = await getStaticProps({ locale: globals['locale'] })
      return getProps(response)
    },
  ],
  parameters: {
    msw: { handlers: [] },
    router: {
      pathname: '/search',
    },
  },
  // render: (args, { loaded: pageProps }) => <HomePage {...pageProps} {...args} />,
}

export default meta

export const Page: StoryObj<SearchPage.Props> = {
  args: {},
  parameters: {
    msw: { handlers: [] },
    router: {
      pathname: '/search',
    },
  },
}
