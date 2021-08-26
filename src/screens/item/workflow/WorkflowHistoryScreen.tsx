import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { useGetWorkflow } from '@/api/sshoc'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import { Title } from '@/modules/ui/typography/Title'
import { ItemHistory } from '@/screens/item/ItemHistory'

/**
 * Workflow history screen.
 */
export default function WorkflowHistoryScreen(): JSX.Element {
  const router = useRouter()

  const id = router.query.id as string | undefined
  const workflow = useGetWorkflow(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { persistentId: id! },
    {},
    { enabled: id != null },
  )

  return (
    <Fragment>
      <Metadata noindex title="Workflow version history" />
      <GridLayout>
        <Header image={'/assets/images/search/clouds@2x.png'}>
          <Breadcrumbs
            links={[
              { pathname: '/', label: 'Home' },
              {
                pathname: '/search',
                query: {
                  categories: ['workflow'],
                  order: 'label',
                },
                label: 'Workflows',
              },
              {
                pathname: `/workflow/${id}`,
                label: workflow.data?.label ?? 'Workflows',
              },
              {
                pathname: `/workflow/${id}/history`,
                label: 'History',
              },
            ]}
          />
        </Header>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '4 / span 8' }}
        >
          <Title>Workflow version history</Title>
          {workflow.data === undefined || id == undefined ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ProgressSpinner />
            </div>
          ) : (
            <ItemHistory item={workflow.data} />
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
