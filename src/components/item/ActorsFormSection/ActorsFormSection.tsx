import { Dialog } from '@reach/dialog'
import { useState } from 'react'
import { useQueryClient } from 'react-query'

import type { ActorCore } from '@/api/sshoc'
import {
  useCreateActor,
  useGetActors,
  useGetAllActorRoles,
  useGetAllActorSources,
} from '@/api/sshoc'
import { Button } from '@/elements/Button/Button'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CloseIcon } from '@/elements/icons/small/cross.svg'
import { useToast } from '@/elements/Toast/useToast'
import { useDebouncedState } from '@/lib/hooks/useDebouncedState'
import { useAuth } from '@/modules/auth/AuthContext'
import { FormComboBox } from '@/modules/form/components/FormComboBox/FormComboBox'
import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormFieldRemoveButton } from '@/modules/form/components/FormFieldRemoveButton/FormFieldRemoveButton'
import { FormRecord } from '@/modules/form/components/FormRecord/FormRecord'
import { FormRecords } from '@/modules/form/components/FormRecords/FormRecords'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormSelect } from '@/modules/form/components/FormSelect/FormSelect'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { Form } from '@/modules/form/Form'
import { FormFieldArray } from '@/modules/form/FormFieldArray'
import { isEmail, isUrl } from '@/modules/form/validate'

export interface ActorsFormSectionProps {
  initialValues?: any
  prefix?: string
}

/**
 * Form section for contributors.
 */
export function ActorsFormSection(props: ActorsFormSectionProps): JSX.Element {
  const prefix = props.prefix ?? ''

  const [showCreateNewDialog, setShowCreateNewDialog] = useState(false)
  function openCreateNewDialog() {
    setShowCreateNewDialog(true)
  }
  function closeCreateNewDialog() {
    setShowCreateNewDialog(false)
  }

  return (
    <FormSection
      title={'Actors'}
      actions={
        <FormFieldAddButton onPress={openCreateNewDialog}>
          {'Create new actor'}
        </FormFieldAddButton>
      }
    >
      <FormFieldArray name={`${prefix}contributors`}>
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
      <CreateActorDialog
        isOpen={showCreateNewDialog}
        onDismiss={closeCreateNewDialog}
      />
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

interface CreateActorDialogProps {
  isOpen: boolean
  onDismiss: () => void
}

/**
 * Create new actor dialog.
 */
function CreateActorDialog(props: CreateActorDialogProps) {
  return (
    <Dialog
      isOpen={props.isOpen}
      onDismiss={props.onDismiss}
      className="flex flex-col w-full max-w-screen-lg px-32 py-16 mx-auto bg-white rounded shadow-lg"
      style={{ width: '60vw', marginTop: '10vh', marginBottom: '10vh' }}
      aria-label="Create new actor"
    >
      <button
        onClick={props.onDismiss}
        className="self-end"
        aria-label="Close dialog"
      >
        <Icon icon={CloseIcon} className="" />
      </button>
      <section className="flex flex-col space-y-6">
        <h2 className="text-2xl font-medium">Create new actor</h2>
        {/* this form is rendered in a portal, so it's valid html, even though it's a <form> "nested" in another <form>. */}
        <CreateActorForm onDismiss={props.onDismiss} />
      </section>
    </Dialog>
  )
}

type ActorFormValues = ActorCore

interface CreateActorFormProps {
  onDismiss: () => void
}

/**
 * Create actor.
 */
function CreateActorForm(props: CreateActorFormProps) {
  const createActor = useCreateActor()
  const auth = useAuth()
  const queryClient = useQueryClient()
  const toast = useToast()

  function onSubmit(unsanitized: ActorFormValues) {
    if (auth.session?.accessToken === undefined) {
      toast.error('Authentication required.')
      return Promise.reject()
    }

    const values = sanitizeActorFormValues(unsanitized)

    return createActor.mutateAsync(
      [values, { token: auth.session.accessToken }],
      {
        onSuccess() {
          queryClient.invalidateQueries(['getActors'])
          toast.success('Sucessfully created actor.')
        },
        onError() {
          toast.error('Failed to submit actor.')
        },
        onSettled() {
          props.onDismiss()
        },
      },
    )
  }

  function onValidate(values: Partial<ActorFormValues>) {
    const errors: Partial<Record<keyof typeof values, any>> = {}

    if (values.name === undefined) {
      errors.name = 'Name is required.'
    }

    if (values.email !== undefined && !isEmail(values.email)) {
      errors.email = 'Please provide a valid email address.'
    }

    if (values.website !== undefined && !isUrl(values.website)) {
      errors.website = 'Please provide a valid URL.'
    }

    if (values.externalIds !== undefined) {
      values.externalIds.forEach((id, index) => {
        if (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          id != null &&
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          id.serviceIdentifier != null &&
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          id.identifier == null
        ) {
          if (errors.externalIds === undefined) {
            errors.externalIds = []
          }
          errors.externalIds[index] = {
            identifier: 'ID is required.',
          }
        }
      })
    }

    if (values.externalIds !== undefined) {
      values.externalIds.forEach((id, index) => {
        if (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          id != null &&
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          id.identifier != null &&
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          id.serviceIdentifier == null
        ) {
          if (errors.externalIds === undefined) {
            errors.externalIds = []
          }
          errors.externalIds[index] = {
            serviceIdentifier: 'Please select an ID service.',
          }
        }
      })
    }

    return errors
  }

  return (
    <Form onSubmit={onSubmit} validate={onValidate}>
      {({ handleSubmit, pristine, invalid, submitting }) => {
        return (
          <form
            noValidate
            className="flex flex-col space-y-6"
            onSubmit={handleSubmit}
          >
            <FormTextField
              name="name"
              label="Name"
              isRequired
              variant="form"
              style={{ flex: 1 }}
            />
            <FormFieldArray name="externalIds">
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
                              aria-label={'Remove external ID'}
                            />
                          }
                        >
                          <ExternalIdServiceSelect
                            name={`${name}.serviceIdentifier`}
                            label="ID Service"
                          />
                          <FormTextField
                            name={`${name}.identifier`}
                            label="Identifier"
                            variant="form"
                            style={{ flex: 1 }}
                          />
                        </FormRecord>
                      )
                    })}
                    <FormFieldAddButton onPress={() => fields.push(undefined)}>
                      {'Add external ID'}
                    </FormFieldAddButton>
                  </FormRecords>
                )
              }}
            </FormFieldArray>
            <FormTextField
              name="email"
              label="Email"
              variant="form"
              style={{ flex: 1 }}
            />
            <FormTextField
              name="website"
              label="Website"
              variant="form"
              style={{ flex: 1 }}
            />
            <FormFieldArray name="affiliations">
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
                              aria-label={'Remove affiliation'}
                            />
                          }
                        >
                          <ActorComboBox
                            name={`${name}.code`}
                            label="Affiliation"
                            index={index}
                          />
                        </FormRecord>
                      )
                    })}
                    <FormFieldAddButton onPress={() => fields.push(undefined)}>
                      {'Add affiliation'}
                    </FormFieldAddButton>
                  </FormRecords>
                )
              }}
            </FormFieldArray>
            <div className="flex justify-end space-x-12">
              <Button variant="link" onPress={props.onDismiss}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                isDisabled={
                  pristine || invalid || submitting || createActor.isLoading
                }
              >
                Create
              </Button>
            </div>
          </form>
        )
      }}
    </Form>
  )
}

function sanitizeActorFormValues(values: ActorFormValues) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  values.affiliations = values.affiliations?.filter((v) => v != null)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  values.externalIds = values.externalIds?.filter((v) => v != null)

  return values
}

export interface ExternalIdServiceSelectProps {
  name: string
  label: string
}

/**
 * External actor ID.
 */
function ExternalIdServiceSelect(
  props: ExternalIdServiceSelectProps,
): JSX.Element {
  const sources = useGetAllActorSources()

  return (
    <FormSelect
      name={props.name}
      label={props.label}
      items={sources.data ?? []}
      isLoading={sources.isLoading}
      variant="form"
    >
      {(item) => (
        <FormSelect.Item key={item.code}>{item.label}</FormSelect.Item>
      )}
    </FormSelect>
  )
}
