import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { ItemHistory } from '../ItemHistory'
import { useGetDataset } from '@/api/sshoc'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Dataset history screen.
 */
export default function DatasetHistoryScreen(): JSX.Element {
  const router = useRouter()

  const id = router.query.id as string | undefined
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const dataset = useGetDataset({ id: id! }, {}, { enabled: id != null })

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
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '4 / span 8' }}
        >
          <Title>Dataset version history</Title>
          {dataset.data === undefined || id == undefined ? (
            <div className="flex flex-col items-center justify-center">
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