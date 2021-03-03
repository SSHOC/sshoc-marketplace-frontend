import { Fragment } from 'react'
import { ItemForm } from '@/components/item/DatasetCreateForm/DatasetCreateForm'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Create dataset screen.
 */
export default function DatasetCreateScreen(): JSX.Element {
  return (
    <Fragment>
      <Metadata noindex title="Create dataset" />
      <GridLayout>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '5 / span 6' }}
        >
          <Title>Create dataset</Title>
          <ItemForm category="dataset" initialValues={{}} />
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
