import { Fragment } from 'react'
import { ItemForm } from '@/components/item/TrainingMaterialCreateForm/TrainingMaterialCreateForm'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'

/**
 * Create training material screen.
 */
export default function TrainingMaterialCreateScreen(): JSX.Element {
  return (
    <Fragment>
      <Metadata noindex title="Create training material" />
      <GridLayout>
        <ContentColumn
          className="px-6 py-12 space-y-12"
          style={{ gridColumn: '4 / span 8' }}
        >
          <Title>Create training material</Title>
          <ItemForm category="training-material" initialValues={{}} />
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
