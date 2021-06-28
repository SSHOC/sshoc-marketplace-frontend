import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { useGetTool } from '@/api/sshoc'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import { Title } from '@/modules/ui/typography/Title'
import { ItemHistory } from '@/screens/item/ItemHistory'

/**
 * Tool history screen.
 */
export default function ToolHistoryScreen(): JSX.Element {
  const router = useRouter()

  const id = router.query.id as string | undefined
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const tool = useGetTool({ id: id! }, {}, { enabled: id != null })

  return (
    <Fragment>
      <Metadata noindex title="Tool version history" />
      <GridLayout>
        <Header image={'/assets/images/search/clouds@2x.png'}>
          <Breadcrumbs
            links={[
              { pathname: '/', label: 'Home' },
              {
                pathname: '/search',
                query: {
                  categories: ['tool-or-service'],
                  order: 'label',
                },
                label: 'Tools & Services',
              },
              {
                pathname: `/tool-or-service/${id}`,
                label: tool.data?.label ?? 'Tools & Services',
              },
              {
                pathname: `/tool-or-service/${id}/history`,
                label: 'History',
              },
            ]}
          />
        </Header>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '4 / span 8' }}
        >
          <Title>Tool version history</Title>
          {tool.data === undefined || id == undefined ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ProgressSpinner />
            </div>
          ) : (
            <ItemHistory item={tool.data} />
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
