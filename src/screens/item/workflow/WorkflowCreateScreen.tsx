import { Fragment } from 'react'
import { ItemForm } from '@/components/item/WorkflowCreateForm/WorkflowCreateForm'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Create workflow screen.
 */
export default function WorkflowCreateScreen(): JSX.Element {
  return (
    <Fragment>
      <Metadata noindex title="Create workflow" />
      <GridLayout>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '5 / span 6' }}
        >
          <Title>Create workflow</Title>
          <ItemForm category="workflow" initialValues={{}} />
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
