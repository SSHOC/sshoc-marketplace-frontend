import { useRouter } from 'next/router'
import { Fragment } from 'react'

import { useGetTrainingMaterial } from '@/api/sshoc'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import { Title } from '@/modules/ui/typography/Title'

import { ItemHistory } from '../ItemHistory'

/**
 * Training material history screen.
 */
export default function TrainingMaterialHistoryScreen(): JSX.Element {
  const router = useRouter()

  const id = router.query.id as string | undefined
  const trainingMaterial = useGetTrainingMaterial(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { id: id! },
    {},
    { enabled: id != null },
  )

  return (
    <Fragment>
      <Metadata noindex title="Training material version history" />
      <GridLayout>
        <Header image={'/assets/images/search/clouds@2x.png'}>
          <Breadcrumbs
            links={[
              { pathname: '/', label: 'Home' },
              {
                pathname: '/search',
                query: {
                  categories: ['training-material'],
                  order: 'label',
                },
                label: 'Training Materials',
              },
              {
                pathname: `/training-material/${id}`,
                label: trainingMaterial.data?.label ?? 'Dataset',
              },
              {
                pathname: `/training-material/${id}/history`,
                label: 'History',
              },
            ]}
          />
        </Header>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '4 / span 8' }}
        >
          <Title>Training material version history</Title>
          {trainingMaterial.data === undefined || id == undefined ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ProgressSpinner />
            </div>
          ) : (
            <ItemHistory item={trainingMaterial.data} />
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
