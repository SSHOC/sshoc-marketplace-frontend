import { Fragment } from 'react'

import { createInitialRecommendedFields } from '@/api/sshoc/helpers'
import { ItemForm } from '@/components/item/DatasetCreateForm/DatasetCreateForm'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import Metadata from '@/modules/metadata/Metadata'
import { Title } from '@/modules/ui/typography/Title'
import forms from '~/config/forms.json'

/**
 * Create dataset screen.
 */
export default function DatasetCreateScreen(): JSX.Element {
  return (
    <Fragment>
      <Metadata noindex title="Create dataset" />
      <GridLayout>
        <ContentColumn className="px-6 py-12 space-y-12">
          <Title>Create dataset</Title>
          <ItemForm
            category="dataset"
            initialValues={createInitialRecommendedFields(forms.dataset)}
          />
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}
