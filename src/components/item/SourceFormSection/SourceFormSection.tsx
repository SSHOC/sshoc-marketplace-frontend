import { useGetSources } from '@/api/sshoc'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormSelect } from '@/modules/form/components/FormSelect/FormSelect'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'

/**
 * Form section for item source.
 */
export function SourceFormSection(): JSX.Element {
  return (
    <FormSection title={'Source'}>
      <div className="flex space-x-4">
        <SourceSelect name="source.id" label={'Source'} />
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
}

/**
 * Source.
 */
function SourceSelect(props: SourceSelectProps): JSX.Element {
  const sources = useGetSources({})

  return (
    <FormSelect
      name={props.name}
      label={props.label}
      items={sources.data?.sources ?? []}
      isLoading={sources.isLoading}
      variant="form"
    >
      {(item) => <FormSelect.Item>{item.label}</FormSelect.Item>}
    </FormSelect>
  )
}
