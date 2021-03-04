import { Fragment } from 'react'
import { ItemForm } from '@/components/item/PublicationCreateForm/PublicationCreateForm'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Create publication screen.
 */
export default function PublicationCreateScreen(): JSX.Element {
  return (
    <Fragment>
      <Metadata noindex title="Create publication" />
      <GridLayout>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '4 / span 8' }}
        >
          <Title>Create publication</Title>
          <ItemForm category="publication" initialValues={{}} />
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
