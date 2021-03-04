import { useState } from 'react'
import { useGetSources } from '@/api/sshoc'
import { useDebouncedState } from '@/lib/hooks/useDebouncedState'
import { FormComboBox } from '@/modules/form/components/FormComboBox/FormComboBox'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'

export interface SoureFormSectionProps {
  initialValues?: any
}

/**
 * Form section for item source.
 */
export function SourceFormSection(props: SoureFormSectionProps): JSX.Element {
  return (
    <FormSection title={'Source'}>
      <div className="flex space-x-4">
        <SourceComboBox
          name="source.id"
          label={'Source'}
          initialValues={props.initialValues}
        />
        <FormTextField
          name="sourceItemId"
          label={'Source ID'}
          variant="form"
          style={{ flex: 1 }}
        />
      </div>
    </FormSection>
  )
}

interface SourceSelectProps {
  name: string
  label: string
  initialValues?: any
}

/**
 * Source.
 */
function SourceComboBox(props: SourceSelectProps): JSX.Element {
  const initialLabel = props.initialValues?.source?.id ?? ''
  const [searchTerm, setSearchTerm] = useState(initialLabel)
  const debouncedSearchTerm = useDebouncedState(searchTerm, 150).trim()
  const sources = useGetSources(
    { q: debouncedSearchTerm },
    {
      // enabled: debouncedSearchTerm.length > 2,
      keepPreviousData: true,
    },
  )

  return (
    <FormComboBox
      name={props.name}
      label={props.label}
      items={sources.data?.sources ?? []}
      onInputChange={setSearchTerm}
      isLoading={sources.isLoading}
      variant="form"
    >
      {(item) => <FormComboBox.Item>{item.label}</FormComboBox.Item>}
    </FormComboBox>
  )
}
