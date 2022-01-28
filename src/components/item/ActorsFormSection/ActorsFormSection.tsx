import { Dialog } from '@reach/dialog'
import get from 'lodash.get'
import { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'

import type { ActorCore, ActorDto } from '@/api/sshoc'
import {
  useCreateActor,
  useGetActor,
  useGetAllActorRoles,
  useGetAllActorSources,
  useSearchActors,
  useUpdateActor,
} from '@/api/sshoc'
import { Button } from '@/elements/Button/Button'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CloseIcon } from '@/elements/icons/small/cross.svg'
import { useToast } from '@/elements/Toast/useToast'
import { useDebouncedState } from '@/lib/hooks/useDebouncedState'
import { useAuth } from '@/modules/auth/AuthContext'
import { FormComboBox } from '@/modules/form/components/FormComboBox/FormComboBox'
import { FormFieldAddButton } from '@/modules/form/components/FormFieldAddButton/FormFieldAddButton'
import { FormFieldEditButton } from '@/modules/form/components/FormFieldEditButton/FormFieldEditButton'
import { FormFieldRemoveButton } from '@/modules/form/components/FormFieldRemoveButton/FormFieldRemoveButton'
import { FormRecord } from '@/modules/form/components/FormRecord/FormRecord'
import { FormRecords } from '@/modules/form/components/FormRecords/FormRecords'
import { FormSection } from '@/modules/form/components/FormSection/FormSection'
import { FormSelect } from '@/modules/form/components/FormSelect/FormSelect'
import { FormTextField } from '@/modules/form/components/FormTextField/FormTextField'
import { DiffField } from '@/modules/form/diff/DiffField'
import { DiffFormComboBox } from '@/modules/form/diff/DiffFormComboBox'
import { DiffFormSelect } from '@/modules/form/diff/DiffFormSelect'
import { Form } from '@/modules/form/Form'
import { FormFieldArray } from '@/modules/form/FormFieldArray'
import { isEmail, isUrl } from '@/modules/form/validate'
import helpText from '@@/config/form-helptext.json'

export interface ActorsFormSectionProps {
  initialValues?: any
  prefix?: string
  diff?: any
}

/**
 * Form section for contributors.
 */
export function ActorsFormSection(props: ActorsFormSectionProps): JSX.Element {
  const prefix = props.prefix ?? ''
  const diff = props.diff ?? {}

  /**
   * This is an ugly hack.
   */
  const [refresh, doRefresh] = useState(0)

  const [showCreateNewDialog, setShowCreateNewDialog] = useState(false)
  function openCreateNewDialog() {
    setShowCreateNewDialog(true)
  }
  function closeCreateNewDialog() {
    setShowCreateNewDialog(false)
  }

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [actorToEdit, setActorToEdit] = useState<{ id: number }>({ id: 0 })
  function openEditDialog() {
    setShowEditDialog(true)
  }
  function closeEditDialog() {
    setShowEditDialog(false)
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
                      <div className="flex items-center space-x-6">
                        <FormFieldEditButton
                          onPress={() => {
                            setActorToEdit(fields.value[index].actor)
                            openEditDialog()
                          }}
                        >
                          Edit actor
                        </FormFieldEditButton>
                        <FormFieldRemoveButton
                          onPress={() => {
                            fields.remove(index)
                            /** YUCK! */
                            if (
                              Array.isArray(props.initialValues?.contributors)
                            ) {
                              props.initialValues.contributors.splice(index, 1)
                            }
                          }}
                          aria-label={'Remove actor'}
                        />
                      </div>
                    }
                  >
                    <DiffField
                      name={name}
                      approvedValue={get(diff.item, name)}
                      suggestedValue={get(diff.other, name)}
                      isArrayField
                    >
                      <ActorRoleSelect
                        name={`${name}.role.code`}
                        label={'Actor role'}
                        approvedKey={get(diff.item, `${name}.role.code`)}
                        approvedItem={get(diff.item, `${name}.role`)}
                      />
                      <ActorComboBox
                        // TODO: try make this a compound key of id+name
                        key={refresh}
                        name={`${name}.actor.id`}
                        label={'Name'}
                        index={index}
                        initialValues={props.initialValues}
                        approvedKey={get(diff.item, `${name}.actor.id`)}
                        approvedItem={get(diff.item, `${name}.actor`)}
                      />
                    </DiffField>
                  </FormRecord>
                )
              })}
              {/* Items might have been deleted so the array will be shorter than in the approved version. */}
              {get(diff.item, `${prefix}contributors`)
                .slice(fields.length)
                .map((field: string, _index: number) => {
                  const index = (fields.length ?? 0) + _index
                  const name = `${prefix}contributors.${index}`

                  return (
                    <FormRecord key={name}>
                      <DiffField
                        name={name}
                        approvedValue={get(diff.item, name)}
                        suggestedValue={get(diff.other, name)}
                        isArrayField
                      >
                        <ActorRoleSelect
                          name={`${name}.role.code`}
                          label={'Actor role'}
                          approvedKey={get(diff.item, `${name}.role.code`)}
                          approvedItem={get(diff.item, `${name}.role`)}
                        />
                        <ActorComboBox
                          // TODO: try make this a compound key of id+name
                          key={refresh}
                          name={`${name}.actor.id`}
                          label={'Name'}
                          index={index}
                          initialValues={props.initialValues}
                          approvedKey={get(diff.item, `${name}.actor.id`)}
                          approvedItem={get(diff.item, `${name}.actor`)}
                        />
                      </DiffField>
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
      <EditActorDialog
        isOpen={showEditDialog && actorToEdit.id !== 0}
        onDismiss={closeEditDialog}
        actorId={actorToEdit}
        onSuccess={(actor) => {
          /**
           * We need to öotentially mutate initial values to update the displayed actor name,
           * because initially, `ActorComboBox` is populated by reading from the form's `initialValues`.
           * Only subsequent actor searches hit the `searchActors` endpoint.
           *
           * This is all really not great. We just just always fetch fresh data to populate the combobox,
           * i.e. use initialValues only as placeholder data for in a useGetActor query hook.
           */
          if (actor.id === actorToEdit.id) {
            const contributors = props.initialValues?.contributors
            if (Array.isArray(contributors)) {
              const _actor = contributors.find(
                (contributor) => contributor.actor.id === actor.id,
              )?.actor
              if (_actor != null) {
                _actor.name = actor.name
              }
              /**
               * Force actor combobox to remount, so the value in the `<input>` is reset.
               * Invalidating `searchActor` query alone will force new request, but would
               * not update the input text value.
               */
              doRefresh((i) => i + 1)
            }
          }
        }}
      />
    </FormSection>
  )
}

interface ActorRoleSelectProps {
  name: string
  label: string
  approvedKey?: string | undefined
  approvedItem?: any | undefined
}

/**
 * Actor role.
 */
function ActorRoleSelect(props: ActorRoleSelectProps): JSX.Element {
  const actorRoles = useGetAllActorRoles()

  return (
    <DiffFormSelect
      name={props.name}
      label={props.label}
      items={actorRoles.data ?? []}
      isLoading={actorRoles.isLoading}
      variant="form"
      approvedKey={props.approvedKey}
      approvedItem={props.approvedItem}
    >
      {(item) => (
        <FormSelect.Item key={item.code}>{item.label}</FormSelect.Item>
      )}
    </DiffFormSelect>
  )
}

interface ActorComboBoxProps {
  name: string
  label: string
  index: number
  initialValues?: any
  approvedKey?: string | undefined
  approvedItem?: any | undefined
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
  const actors = useSearchActors(
    { q: debouncedsearchTerm },
    {
      // enabled: debouncedsearchTerm.length > 2,
      keepPreviousData: true,
    },
  )

  useEffect(() => {
    setSearchTerm(initialLabel)
  }, [initialLabel])

  return (
    <DiffFormComboBox
      name={props.name}
      label={props.label}
      items={actors.data?.actors ?? []}
      isLoading={actors.isLoading}
      onInputChange={setSearchTerm}
      variant="form"
      style={{ flex: 1 }}
      helpText={helpText.actor}
      approvedKey={props.approvedKey}
      approvedItem={props.approvedItem}
    >
      {(item) => (
        <FormComboBox.Item textValue={item.name}>
          <span>{item.name}</span>
          {item.affiliations != null && item.affiliations.length > 0 ? (
            <span className="ml-1.5 text-ui-sm text-gray-550">
              (
              {item.affiliations
                .map((affiliation: any) => affiliation.name)
                .join(', ')}
              )
            </span>
          ) : null}
        </FormComboBox.Item>
      )}
    </DiffFormComboBox>
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
          queryClient.invalidateQueries(['searchActors'])
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
        <CreateActorForm
          onDismiss={props.onDismiss}
          onSubmit={onSubmit}
          isLoading={createActor.isLoading}
          buttonLabel="Create"
        />
      </section>
    </Dialog>
  )
}

type ActorFormValues = ActorCore

interface CreateActorFormProps {
  onDismiss: () => void
  initialValues?: Partial<ActorFormValues>
  onSubmit: (actor: ActorFormValues) => void
  isLoading: boolean
  buttonLabel: string
}

/**
 * Create actor.
 */
export function CreateActorForm(props: CreateActorFormProps): JSX.Element {
  const { initialValues, onSubmit, isLoading, buttonLabel } = props

  function onValidate(values: Partial<ActorFormValues>) {
    const errors: Partial<Record<keyof typeof values, any>> = {}

    if (values.name == null) {
      errors.name = 'Name is required.'
    }

    if (values.email != null && !isEmail(values.email)) {
      errors.email = 'Please provide a valid email address.'
    }

    if (values.website != null && !isUrl(values.website)) {
      errors.website = 'Please provide a valid URL.'
    }

    if (values.externalIds != null) {
      values.externalIds.forEach((id, index) => {
        if (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          id != null &&
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          id.identifierService?.code != null &&
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          id.identifier == null
        ) {
          if (errors.externalIds == null) {
            errors.externalIds = []
          }
          errors.externalIds[index] = {
            identifier: 'ID is required.',
          }
        }
      })
    }

    if (values.externalIds != null) {
      values.externalIds.forEach((id, index) => {
        if (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          id != null &&
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          id.identifier != null &&
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          id.identifierService?.code == null
        ) {
          if (errors.externalIds == null) {
            errors.externalIds = []
          }
          errors.externalIds[index] = {
            identifierService: { code: 'Please select an ID service.' },
          }
        }
      })
    }

    return errors
  }

  return (
    <Form
      onSubmit={onSubmit}
      validate={onValidate}
      initialValues={initialValues}
    >
      {({ handleSubmit, pristine, invalid, submitting }) => {
        return (
          <form
            noValidate
            className="flex flex-col space-y-6"
            onSubmit={(e) => {
              handleSubmit(e)
              e.stopPropagation()
            }}
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
                              onPress={() => {
                                fields.remove(index)
                              }}
                              aria-label={'Remove external ID'}
                            />
                          }
                        >
                          <ExternalIdServiceSelect
                            name={`${name}.identifierService.code`}
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
                              onPress={() => {
                                fields.remove(index)
                              }}
                              aria-label={'Remove affiliation'}
                            />
                          }
                        >
                          <ActorComboBox
                            name={`${name}.id`}
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
                isDisabled={submitting || isLoading}
              >
                {buttonLabel}
              </Button>
            </div>
          </form>
        )
      }}
    </Form>
  )
}

interface EditActorDialogProps {
  isOpen: boolean
  onDismiss: () => void
  actorId: { id: number }
  onSuccess?: (actor: ActorDto) => void
}

function EditActorDialog(props: EditActorDialogProps) {
  const updateActor = useUpdateActor()
  const auth = useAuth()
  const queryClient = useQueryClient()
  const toast = useToast()

  const id = props.actorId.id
  const actor = useGetActor({ id }, { enabled: Boolean(id) })

  function onSubmit(unsanitized: ActorFormValues) {
    if (auth.session?.accessToken === undefined) {
      toast.error('Authentication required.')
      return Promise.reject()
    }

    const values = sanitizeActorFormValues(unsanitized)

    return updateActor.mutateAsync(
      [{ id }, values, { token: auth.session.accessToken }],
      {
        onSuccess(actor) {
          queryClient.invalidateQueries(['getActors'])
          queryClient.invalidateQueries(['searchActors'])
          queryClient.invalidateQueries(['getActor', { id }])
          toast.success('Sucessfully updated actor.')
          props.onSuccess?.(actor)
        },
        onError() {
          toast.error('Failed to update actor.')
        },
        onSettled() {
          props.onDismiss()
        },
      },
    )
  }

  return (
    <Dialog
      isOpen={props.isOpen && actor.data != null}
      onDismiss={props.onDismiss}
      className="flex flex-col w-full max-w-screen-lg px-32 py-16 mx-auto bg-white rounded shadow-lg"
      style={{ width: '60vw', marginTop: '10vh', marginBottom: '10vh' }}
      aria-label="Edit actor"
    >
      <button
        onClick={props.onDismiss}
        className="self-end"
        aria-label="Close dialog"
      >
        <Icon icon={CloseIcon} className="" />
      </button>
      <section className="flex flex-col space-y-6">
        <h2 className="text-2xl font-medium">Edit actor</h2>
        {/* this form is rendered in a portal, so it's valid html, even though it's a <form> "nested" in another <form>. */}
        <CreateActorForm
          initialValues={actor.data as Partial<ActorFormValues>}
          onDismiss={props.onDismiss}
          onSubmit={onSubmit}
          isLoading={actor.isLoading || updateActor.isLoading}
          buttonLabel="Update"
        />
      </section>
    </Dialog>
  )
}

export function sanitizeActorFormValues(
  values: ActorFormValues,
): ActorFormValues {
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
