import { useState } from 'react'

import { useGetActors, useGetAllActorRoles } from '@/api/sshoc'
import { useDebouncedState } from '@/lib/hooks/useDebouncedState'
import { FormComboBox } from '@/modules/form/components/FormComboBox/FormComboBox'
import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormFieldRemoveButton } from '@/modules/form/components/FormFieldRemoveButton/FormFieldRemoveButton'
import { FormRecord } from '@/modules/form/components/FormRecord/FormRecord'
import { FormRecords } from '@/modules/form/components/FormRecords/FormRecords'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormSelect } from '@/modules/form/components/FormSelect/FormSelect'
import { FormFieldArray } from '@/modules/form/FormFieldArray'

export interface ActorsFormSectionProps {
  initialValues?: any
}

/**
 * Form section for contributors.
 */
export function ActorsFormSection(props: ActorsFormSectionProps): JSX.Element {
  return (
    <FormSection title={'Actors'}>
      <FormFieldArray name="contributors">
        {({ fields }) => {
          return (
            <FormRecords>
              {fields.map((name, index) => {
                return (
                  <FormRecord
                    key={name}
                    actions={
                      <FormFieldRemoveButton
                        onPress={() => fields.remove(index)}
                        aria-label={'Remove actor'}
                      />
                    }
                  >
                    <ActorRoleSelect
                      name={`${name}.role.code`}
                      label={'Actor role'}
                    />
                    <ActorComboBox
                      name={`${name}.actor.id`}
                      label={'Name'}
                      index={index}
                      initialValues={props.initialValues}
                    />
                  </FormRecord>
                )
              })}
              <FormFieldAddButton onPress={() => fields.push(undefined)}>
                {'Add actor'}
              </FormFieldAddButton>
            </FormRecords>
          )
        }}
      </FormFieldArray>
    </FormSection>
  )
}

interface ActorRoleSelectProps {
  name: string
  label: string
}

/**
 * Actor role.
 */
function ActorRoleSelect(props: ActorRoleSelectProps): JSX.Element {
  const actorRoles = useGetAllActorRoles()

  return (
    <FormSelect
      name={props.name}
      label={props.label}
      items={actorRoles.data ?? []}
      isLoading={actorRoles.isLoading}
      variant="form"
    >
      {(item) => (
        <FormSelect.Item key={item.code}>{item.label}</FormSelect.Item>
      )}
    </FormSelect>
  )
}

interface ActorComboBoxProps {
  name: string
  label: string
  index: number
  initialValues?: any
}

/**
 * Actor.
 */
function ActorComboBox(props: ActorComboBoxProps): JSX.Element {
  /**
   * Populate the input field with the label of the initially selected item (if any),
   * which triggers a search request. The result set should include the initial item.
   *
   * TODO: should the initial value always be included in the combobox options?
   */
  const initialLabel =
    props.initialValues?.contributors?.[props.index]?.actor.name ?? ''

  const [searchTerm, setSearchTerm] = useState(initialLabel)
  const debouncedsearchTerm = useDebouncedState(searchTerm, 150).trim()
  const actors = useGetActors(
    { q: debouncedsearchTerm },
    {
      // enabled: debouncedsearchTerm.length > 2,
      keepPreviousData: true,
    },
  )

  return (
    <FormComboBox
      name={props.name}
      label={props.label}
      items={actors.data?.actors ?? []}
      isLoading={actors.isLoading}
      onInputChange={setSearchTerm}
      variant="form"
      style={{ flex: 1 }}
    >
      {(item) => <FormComboBox.Item>{item.name}</FormComboBox.Item>}
    </FormComboBox>
  )
}
