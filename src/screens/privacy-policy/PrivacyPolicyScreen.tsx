import { Fragment } from 'react'

import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Mdx from '@/modules/markdown/Mdx'
import Metadata from '@/modules/metadata/Metadata'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import LastUpdatedAt from '@/modules/ui/LastUpdatedAt'
import { Title } from '@/modules/ui/typography/Title'
import type { PageProps } from '@/pages/privacy-policy/index'
import Content, { metadata } from '@@/content/pages/privacy-policy.mdx'

type ContentMetadata = {
  title: string
}

const meta = metadata as ContentMetadata

/**
 * Privacy policy screen.
 */
export default function ContactScreen({ lastUpdatedAt }: PageProps): JSX.Element {
  return (
    <Fragment>
      <Metadata title={meta.title} />
      <GridLayout>
        <Header image={'/assets/images/privacy-policy/clouds@2x.png'}>
          <Breadcrumbs
            links={[
              { pathname: '/', label: 'Home' },
              {
                pathname: '/privacy-policy',
                label: 'Privacy policy',
              },
            ]}
          />
        </Header>
        <ContentColumn>
          <div className="px-6 pb-12 mx-auto space-y-6 max-w-80ch">
            <Title>{meta.title}</Title>
            <Mdx content={Content} />
            <LastUpdatedAt date={lastUpdatedAt} />
          </div>
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
