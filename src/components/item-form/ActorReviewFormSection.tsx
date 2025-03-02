import { useTranslations } from 'next-intl'

import { CreateActorButton } from '@/components/common/CreateActorButton'
import { FormSection } from '@/components/common/FormSection'
import { FormSectionTitle } from '@/components/common/FormSectionTitle'
import { ReviewActorsFormFieldArray } from '@/components/item-form/ReviewActorsFormFieldArray'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import { SpacedRow } from '@/lib/core/ui/SpacedRow/SpacedRow'

export interface ActorReviewFormSectionProps {
  formFields: ItemFormFields
}

export function ActorReviewFormSection(props: ActorReviewFormSectionProps): JSX.Element {
  const { fields } = props.formFields

  const t = useTranslations('authenticated')

  return (
    <FormSection>
      <SpacedRow>
        <FormSectionTitle>{t('forms.actors-section')}</FormSectionTitle>
        <CreateActorButton variant="button-link" />
      </SpacedRow>
      <ReviewActorsFormFieldArray field={fields.contributors} />
    </FormSection>
  )
}
