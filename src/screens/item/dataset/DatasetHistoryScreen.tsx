import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { useGetDataset } from '@/api/sshoc'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import { Title } from '@/modules/ui/typography/Title'
import { ItemHistory } from '@/screens/item/ItemHistory'

/**
 * Dataset history screen.
 */
export default function DatasetHistoryScreen(): JSX.Element {
  const router = useRouter()

  const id = router.query['id'] as string | undefined

  const dataset = useGetDataset({ persistentId: id! }, {}, { enabled: id != null })

  return (
    <Fragment>
      <Metadata noindex title="Dataset version history" />
      <GridLayout>
        <Header image={'/assets/images/search/clouds@2x.png'}>
          <Breadcrumbs
            links={[
              { pathname: '/', label: 'Home' },
              {
                pathname: '/search',
                query: {
                  categories: ['dataset'],
                  order: 'label',
                },
                label: 'Datasets',
              },
              {
                pathname: `/dataset/${id}`,
                label: dataset.data?.label ?? 'Dataset',
              },
              {
                pathname: `/dataset/${id}/history`,
                label: 'History',
              },
            ]}
          />
        </Header>
        <ContentColumn className="px-6 py-12 space-y-12">
          <Title>Dataset version history</Title>
          {dataset.data == null || id == null ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ProgressSpinner />
            </div>
          ) : (
            <ItemHistory item={dataset.data} />
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
