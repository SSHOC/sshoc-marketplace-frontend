import { Fragment } from 'react'
import { ItemForm } from '@/components/item/ToolCreateForm/ToolCreateForm'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Create tool screen.
 */
export default function ToolCreateScreen(): JSX.Element {
  return (
    <Fragment>
      <Metadata noindex title="Create tool" />
      <GridLayout>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '5 / span 6' }}
        >
          <Title>Create tool</Title>
          <ItemForm category="tool-or-service" initialValues={{}} />
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
