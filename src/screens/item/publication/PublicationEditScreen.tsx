import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { useGetPublication } from '@/api/sshoc'
import { convertToInitialFormValues } from '@/api/sshoc/helpers'
import { ItemForm } from '@/components/item/PublicationEditForm/PublicationEditForm'
import { ProgressSpinner } from '@/elements/ProgressSpinner/ProgressSpinner'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Edit publication screen.
 */
export default function PublicationEditScreen(): JSX.Element {
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
      <Metadata noindex title="Edit publication" />
      <GridLayout style={{ alignContent: 'stretch ' }}>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '5 / span 6' }}
        >
          <Title>Edit publication</Title>
          {publication.data === undefined || id == undefined ? (
            <div className="flex flex-col items-center justify-center">
              <ProgressSpinner />
            </div>
          ) : (
            <ItemForm
              id={id}
              category="publication"
              initialValues={convertToInitialFormValues(publication.data)}
            />
          )}
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
