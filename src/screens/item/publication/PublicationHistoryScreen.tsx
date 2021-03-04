import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { ItemHistory } from '../ItemHistory'
import { useGetPublication } from '@/api/sshoc'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import Breadcrumbs from '@/modules/ui/Breadcrumbs'
import Header from '@/modules/ui/Header'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Publication history screen.
 */
export default function PublicationHistoryScreen(): JSX.Element {
  const router = useRouter()

  const id = router.query.id as string | undefined
  const publication = useGetPublication(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { id: id! },
    {},
    { enabled: id != null },
  )

  return (
    <Fragment>
      <Metadata noindex title="Publication version history" />
      <GridLayout>
        <Header image={'/assets/images/search/clouds@2x.png'}>
          <Breadcrumbs
            links={[
              { pathname: '/', label: 'Home' },
              {
                pathname: '/search',
                query: {
                  categories: ['publication'],
                  order: 'label',
                },
                label: 'Publications',
              },
              {
                pathname: `/publication/${id}`,
                label: publication.data?.label ?? 'Dataset',
              },
              {
                pathname: `/publication/${id}/history`,
                label: 'History',
              },
            ]}
          />
        </Header>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '4 / span 8' }}
        >
          <Title>Publication version history</Title>
          {publication.data === undefined || id == undefined ? (
            <div className="flex flex-col items-center justify-center">
              <ProgressSpinner />
            </div>
          ) : (
            <ItemHistory item={publication.data} />
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
