import { useTranslations } from 'next-intl'

import { CreateActorButton } from '@/components/common/CreateActorButton'
import { FormSection } from '@/components/common/FormSection'
import { FormSectionTitle } from '@/components/common/FormSectionTitle'
import { ActorsFormFieldArray } from '@/components/item-form/ActorsFormFieldArray'
import type { ItemFormFields } from '@/components/item-form/useItemFormFields'
import { SpacedRow } from '@/lib/core/ui/SpacedRow/SpacedRow'

export interface ActorFormSectionProps {
  formFields: ItemFormFields
}

export function ActorFormSection(props: ActorFormSectionProps): JSX.Element {
  const { fields } = props.formFields

  const t = useTranslations('authenticated')

  return (
    <FormSection>
      <SpacedRow>
        <FormSectionTitle>{t('forms.actors-section')}</FormSectionTitle>
        <CreateActorButton variant="button-link" />
      </SpacedRow>
      <ActorsFormFieldArray field={fields.contributors} />
    </FormSection>
  )
}
