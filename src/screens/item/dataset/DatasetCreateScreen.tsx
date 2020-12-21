import { Listbox } from '@headlessui/react'
import { DevTool } from '@hookform/devtools'
import { yupResolver as validator } from '@hookform/resolvers/yup'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxOption,
  ComboboxList,
} from '@reach/combobox'
import { Dialog } from '@reach/dialog'
import cx from 'clsx'
import { FormEvent, Fragment, useState } from 'react'
import type {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  ChangeEvent,
} from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { ArrayField, UseFormMethods } from 'react-hook-form'
import { useQueryCache } from 'react-query'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import {
  useCreateActor,
  useCreateDataset,
  useGetActors,
  useGetAllActorRoles,
  useGetPropertyTypes,
  useGetSources,
  useSearchConcepts,
} from '@/api/sshoc'
import type {
  ConceptId,
  SearchConcept,
  DatasetDto,
  GetAllActorRoles,
  PropertyTypeDto,
} from '@/api/sshoc'
import type { ISODateString } from '@/api/sshoc/types'
import { useAuth } from '@/modules/auth/AuthContext'
import FormField from '@/modules/form/FormField'
import FormFieldList from '@/modules/form/FormFieldList'
import ContentColumn from '@/modules/layout/ContentColumn'
import GridLayout from '@/modules/layout/GridLayout'
import HStack from '@/modules/layout/HStack'
import VStack from '@/modules/layout/VStack'
import Metadata from '@/modules/metadata/Metadata'
import CheckMark from '@/modules/ui/CheckMark'
import FadeIn from '@/modules/ui/FadeIn'
import TextField from '@/modules/ui/TextField'
import Triangle from '@/modules/ui/Triangle'
import { Title } from '@/modules/ui/typography/Title'
import { useDebounce } from '@/utils/useDebounce'
import { Svg as CloseIcon } from '@@/assets/icons/close.svg'

/**
 * Create dataset screen.
 */
export default function DatasetCreateScreen(): JSX.Element {
  return (
    <Fragment>
      <Metadata noindex title="Create dataset" />
      <GridLayout>
        <ContentColumn
          className="px-6 py-12"
          style={{ gridColumn: '5 / span 6' }}
        >
          <Title>Create dataset</Title>
          <DatasetForm
            initialValues={{
              accessibleAt: [''],
            }}
          />
        </ContentColumn>
      </GridLayout>
    </Fragment>
  )
}

/**
 * the openapi docs currently marks all fields as optional (even though they are not),
 * so we mark required fields here.
 */
type DatasetFormData = {
  label: string
  description: string
  accessibleAt: Array<{ value: string }>
  version?: string

  dateCreated?: ISODateString
  dateLastUpdated?: ISODateString

  contributors?: Array<{
    role: { code: string }
    actor: { id: number }
  }>

  properties?: Array<{
    type: {
      code: string
      type?: string /** this is just for easier validation of a non-concept property value */
    }
    /** either value or concept required */
    value?: string /** the backend will stringify any value, even though it can be a number as well */
    concept?: {
      code: string
      vocabulary: { code: string }
      // uri: string
    }
  }>

  source?: { id: number }
  sourceItemId?: string
}

/**
 * instead of making the validation schema conform to `DatasetFormData` we
 * should infer `DatasetFormData` from the validation schema
 * with `yup.InferType<typeof validationSchema>`.
 * need to figure out `Date` <=> `ISODateString` first.
 *
 * TODO:
 * - actor.id must be unique
 * - if source is provided, sourceItemId must be provided
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const validationSchema: Yup.ObjectSchema<
  Omit<DatasetFormData, 'dateCreated' | 'dateLastUpdated'> & {
    dateCreated?: Date
    dateLastUpdated?: Date
  }
> = Yup.object()
  .shape({
    label: Yup.string().required(),
    description: Yup.string().required(),
    accessibleAt: Yup.array()
      .of(
        Yup.object()
          .shape({
            value: Yup.string().url().required(),
          })
          .required(),
      )
      .required(),
    version: Yup.string(),
    dateCreated: Yup.date()
      /** `Yup.date` expects a `Date` object, but the `input` element default to an empty string */
      .transform((value, originalValue) =>
        originalValue === '' ? undefined : value,
      )
      .max(new Date()),
    dateLastUpdated: Yup.date()
      /** `Yup.date` expects a `Date` object, but the `input` element default to an empty string */
      .transform((value, originalValue) =>
        originalValue === '' ? undefined : value,
      )
      .max(new Date()),
    contributors: Yup.array().of(
      Yup.object()
        .shape({
          role: Yup.object()
            .shape({ code: Yup.string().required() })
            .required(),
          actor: Yup.object().shape({ id: Yup.number().required() }).required(),
        })
        .required(),
    ),
    properties: Yup.array().of(
      Yup.object()
        .shape({
          type: Yup.object()
            .shape({
              code: Yup.string().required(),
              /**
               * this is actually not required by the server, we just keep it in form state
               * to make validating free form values (i.e. those that are not a concept) easier.
               * see below
               */
              type: Yup.string(),
            })
            .required(),
          /**
           * either value *or* concept are required, depending on the property type.
           *
           * when it is not a concept, but a free-form value, it needs to conform to
           * propertyType.type, which can be "date"|"url"|"string"|"int"|"float"
           */
          value: Yup.mixed().test('concept-value', 'Invalid value', function (
            value,
          ) {
            const propertyTypeType = this.parent.type.type
            switch (propertyTypeType) {
              case 'concept':
                return true
              case 'string':
                return typeof value === 'string'
              case 'int':
              case 'float':
                return typeof value === 'number'
              case 'url':
                try {
                  new URL(value)
                  return true
                } catch {
                  return false
                }
              case 'date':
                return !Number.isNaN(new Date(value).getDate())
              default:
                return true
            }
          }),
          concept: Yup.object().shape({
            code: Yup.string().required(),
            // these are just for completeness, and to sync with DatasetFormData,
            // but will always be correct when `code` is valid
            vocabulary: Yup.object()
              .shape({
                code: Yup.string().required(),
              })
              .required(),
            // uri: Yup.string().required(),
          }),
        })
        .required(),
    ),
    /**
     * note that related items are not part of the POST request body,
     * but must currently be dispatched in separate requests to /item-relations.
     * this gets more complicated when updating entities in PUT, because
     * the client then needs to keep track of which relations exist in the db,
     * and which need be created (or deleted). there would probably also need to
     * be some UI indication when removing a relation (if it is just removing
     * some draft state, or actually triggering a DELETE request)
     */
    // relatedItems: Yup.array().of(
    //   Yup.object()
    //     .shape({
    //       relationType: Yup.object()
    //         .shape({ code: Yup.string().required() })
    //         .required(),
    //       item: Yup.object().shape({ id: Yup.number().required() }).required(),
    //     })
    //     .required(),
    // ),
    source: Yup.object().shape({
      id: Yup.number(),
    }),
    sourceItemId: Yup.string().when('source.id', {
      is: (value) => value !== undefined,
      then: Yup.string().required(),
    }),
  })
  .defined()

/**
 * Form to create/edit a dataset.
 */
function DatasetForm({
  initialValues,
}: {
  initialValues?: Partial<DatasetDto>
}) {
  const { session } = useAuth()
  const [createDataset] = useCreateDataset()
  const { register, handleSubmit, errors, reset, control, formState } = useForm<
    DatasetFormData
  >({
    defaultValues: normalizeInitialValues(initialValues),
    resolver: validator(validationSchema),
  })
  const queryCache = useQueryCache()

  function onSubmit(formData: DatasetFormData) {
    const dataset = normalizeFormData(formData)
    /** return promise to set `formState.isSubmitting' correctly */
    return createDataset([{}, dataset, { token: session?.accessToken }], {
      onSuccess(dataset) {
        reset()
        toast.success('Successfully created dataset.')
        /** invalidate item search results cache */
        queryCache.invalidateQueries('searchItems')
        /** update cached dataset */
        queryCache.setQueryData(['getDataset', dataset.id], dataset)
      },
      onError(error) {
        const message =
          (error instanceof Error && error.message) ||
          'Failed to create dataset.'
        toast.error(message)
      },
      onSettled() {
        window.scrollTo(0, 0)
      },
    })
  }

  /** we only validate on submit, so no need to check formState.isValid */
  const isDisabled = formState.isSubmitting

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <DevTool control={control} />
      <HStack className="space-x-8">
        <FormField label="Label" error={errors.label} className="flex-1">
          <TextField
            type="text"
            name="label"
            placeholder="Label"
            aria-invalid={Boolean(errors.label)}
            ref={register}
          />
        </FormField>
        <FormField label="Version" error={errors.version}>
          <TextField
            className="w-32"
            type="text"
            name="version"
            placeholder="Version"
            aria-invalid={Boolean(errors.version)}
            ref={register}
          />
        </FormField>
      </HStack>
      <FormField label="Description" error={errors.description}>
        <TextField
          as="textarea"
          rows={5}
          name="description"
          placeholder="Description"
          aria-invalid={Boolean(errors.description)}
          ref={register}
        />
      </FormField>
      <FormFieldList
        name="accessibleAt"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        error={errors.accessibleAt}
        label="Accessible at"
        control={control}
        // trigger={trigger}
      >
        {(
          field: ArrayField,
          index: number,
          remove: (index: number) => void,
        ) => (
          <FormField
            error={errors.accessibleAt?.[index]?.value}
            className="flex-1"
          >
            <div className="flex items-center space-x-4">
              <TextField
                className="flex-1"
                type="text"
                name={`accessibleAt[${index}].value`}
                placeholder="Accessible at URL"
                aria-invalid={Boolean(errors.accessibleAt?.[index])}
                ref={register()}
                defaultValue={field.value}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-sm text-primary-750"
              >
                Remove
              </button>
            </div>
          </FormField>
        )}
      </FormFieldList>
      <FormField label="Date created" error={errors.dateCreated}>
        <TextField
          type="date"
          name="dateCreated"
          placeholder="Date created"
          aria-invalid={Boolean(errors.dateCreated)}
          ref={register}
        />
      </FormField>
      <FormField label="Date last updated" error={errors.dateLastUpdated}>
        <TextField
          type="date"
          name="dateLastUpdated"
          placeholder="Date last updated"
          aria-invalid={Boolean(errors.dateLastUpdated)}
          ref={register}
        />
      </FormField>
      <Section label="Actors" button={<CreateNewActorButton />}>
        <FormFieldList name="actor" label="" control={control}>
          {(
            field: ArrayField,
            index: number,
            remove: (index: number) => void,
          ) => (
            <HStack className="w-full space-x-8">
              <FormField
                label="Actor role"
                error={errors.contributors?.[index]?.role?.code}
              >
                <Controller
                  render={({ onChange }) => (
                    <ActorRoleSelect
                      onChange={onChange}
                      aria-invalid={Boolean(
                        errors.contributors?.[index]?.role?.code,
                      )}
                    />
                  )}
                  control={control}
                  name={`contributors[${index}].role.code`}
                  defaultValue={field.role?.code}
                />
              </FormField>
              <FormField
                label="Name"
                error={errors.contributors?.[index]?.actor?.id}
                className="flex-1"
              >
                <Controller
                  render={({ onChange }) => (
                    <ActorCombobox
                      onChange={onChange}
                      aria-invalid={Boolean(
                        errors.contributors?.[index]?.actor?.id,
                      )}
                    />
                  )}
                  control={control}
                  name={`contributors[${index}].actor.id`}
                  defaultValue={field.actor?.id}
                />
              </FormField>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-sm text-primary-750"
              >
                Remove
              </button>
            </HStack>
          )}
        </FormFieldList>
      </Section>
      <Section label="Properties">
        <FormFieldList name="properties" label="" control={control}>
          {(
            field: ArrayField,
            index: number,
            remove: (index: number) => void,
          ) => (
            <PropertyField
              field={field}
              index={index}
              remove={remove}
              control={control}
              errors={errors}
              register={register}
            />
          )}
        </FormFieldList>
      </Section>
      {/* Are media/thumbnail not just properties? */}
      {/* <Section label="Media"></Section> */}
      {/* See comment above */}
      {/* <Section label="Related items"></Section> */}
      <Section label="Source">
        <HStack className="space-x-4">
          <FormField
            label="Source"
            error={errors.source?.id}
            className="flex-1"
          >
            <Controller
              render={({ onChange }) => (
                <SourceCombobox
                  onChange={onChange}
                  aria-invalid={Boolean(errors.source?.id)}
                />
              )}
              control={control}
              name="source.id"
            />
          </FormField>
          <FormField
            label="Item ID in the source"
            error={errors.sourceItemId}
            className="flex-1"
          >
            <TextField
              type="text"
              name="sourceItemId"
              placeholder="Source ID"
              aria-invalid={Boolean(errors.sourceItemId)}
              ref={register}
            />
          </FormField>
        </HStack>
      </Section>
      <SubmitButton isDisabled={isDisabled}>Create</SubmitButton>
    </Form>
  )
}

function PropertyField({
  field,
  index,
  remove,
  register,
  control,
  errors,
}: {
  field: ArrayField
  index: number
  remove: (index: number) => void
  register: UseFormMethods['register']
  control: UseFormMethods['control']
  errors: UseFormMethods['errors']
}) {
  /**
   * we don't store the whole property type object in form state,
   * since we only need to need to submit the id. but here we need
   * the to determine what to render(value or concept).
   * should probably just use `useWatch`.
   */
  const [propertyType, setPropertyType] = useState<PropertyTypeDto>({})

  return (
    <HStack className="w-full space-x-8">
      <FormField
        label="Property type"
        error={errors.properties?.[index]?.type?.code}
        // className="flex-1"
      >
        <Controller
          render={({ onChange }) => (
            <PropertyTypeCombobox
              onChange={onChange}
              aria-invalid={Boolean(errors.properties?.[index]?.type?.code)}
              /** see above */
              onSelect={setPropertyType}
            />
          )}
          control={control}
          name={`properties[${index}].type`}
          defaultValue={field.type}
        />
      </FormField>
      {propertyType.type === undefined ? null : propertyType.type ===
        'concept' ? (
        <FormField
          label="Concept"
          error={errors.properties?.[index]?.concept?.code}
          className="flex-1"
        >
          <Controller
            render={({ onChange }) => (
              <ConceptsCombobox
                propertyTypeId={propertyType.code}
                onChange={onChange}
                aria-invalid={Boolean(
                  errors.properties?.[index]?.concept?.code,
                )}
              />
            )}
            control={control}
            name={`properties[${index}].concept`}
          />
        </FormField>
      ) : (
        <FormField
          label="Value"
          error={errors.properties?.[index]?.value}
          className="flex-1"
        >
          <TextField
            type="text"
            name={`properties[${index}].value`}
            placeholder="Value"
            aria-invalid={Boolean(errors.properties?.[index]?.value)}
            /**
             * inline validation is not possible when also using a global validation
             * schema.
             * figure out how to validate this: we can pass a `context` to `useForm`
             * which will get injected into `yup`'s validation `context`,
             * and can e.g. be used in `yup.when()`, but not sure how to make this
             * polymorphic, i.e. array().of() property values can be any type.
             *
             * we probably need to make the property type.type part of form data,
             * so we can access it as sibling field value in yup validation.
             *
             * note that form+field level validation is totally possible with
             * formik or hooked-form.
             */
            ref={register()}
          />
        </FormField>
      )}
      <button
        type="button"
        onClick={() => remove(index)}
        className="text-sm text-primary-750"
      >
        Remove
      </button>
    </HStack>
  )
}

function ConceptsCombobox(props: {
  propertyTypeId?: string
  onChange: (concept: ConceptId) => void
  'aria-invalid': boolean
}) {
  const MIN_AUTOCOMPLETE_LENGTH = 2
  const MAX_SUGGESTIONS = 10

  const [searchTerm, setSearchTerm] = useState('')
  const autocompleteTerm = useDebounce(searchTerm.trim(), 150)
  const { data: suggestions } = useSearchConcepts(
    {
      q: searchTerm,
      types: [props.propertyTypeId!],
    },
    {
      enabled:
        autocompleteTerm.length >= MIN_AUTOCOMPLETE_LENGTH &&
        props.propertyTypeId !== undefined,
      keepPreviousData: true,
      onError(error) {
        const message =
          (error instanceof Error && error.message) ||
          'Failed to load concepts.'
        toast.error(message)
      },
    },
  )

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value)
  }

  function onSelect(concept: SearchConcept) {
    const { label, code, vocabulary, uri } = concept
    setSearchTerm(label ?? '')
    props.onChange({
      code,
      vocabulary,
      // uri is not actually required, even though the openapi docs say so
      // uri,
    })
  }

  return (
    <Combobox aria-label="Actor" openOnFocus className="relative flex-1">
      <ComboboxInput
        autocomplete
        type="search"
        onChange={onChange}
        value={searchTerm}
        placeholder="Search"
        className="w-full p-3 border border-gray-200 rounded placeholder-gray-350 bg-gray-50"
      />
      {autocompleteTerm.length >= MIN_AUTOCOMPLETE_LENGTH &&
      suggestions?.concepts !== undefined &&
      suggestions.concepts.length > 0 ? (
        <ComboboxPopover
          portal={false}
          className="absolute z-10 w-full py-2 mt-1 bg-white border border-gray-200 rounded shadow-md"
        >
          <ComboboxList className="select-none">
            {suggestions.concepts
              .slice(0, MAX_SUGGESTIONS)
              .map((suggestion) => (
                <ComboboxOption
                  key={suggestion.code}
                  value={suggestion.label ?? ''}
                  className="p-3 truncate hover:bg-gray-50"
                  // this is hacky, but (i) we only get the `value`, i.e. the name
                  // in the `Combobox#onSelect`` callback, and the popover
                  // does not close correctly when using `onSelect`
                  // FIXME: this is not keyboard accessible unfortunately
                  onClick={() => onSelect(suggestion)}
                />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      ) : null}
    </Combobox>
  )
}

function Form({ children, ...props }: ComponentPropsWithoutRef<'form'>) {
  return (
    <VStack as="form" {...props} className="py-8 space-y-6">
      {children}
    </VStack>
  )
}

function SubmitButton({
  isDisabled,
  children,
}: PropsWithChildren<{ isDisabled?: boolean }>) {
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="self-end px-6 py-3 text-white transition-colors duration-150 rounded bg-secondary-600 hover:bg-secondary-500"
    >
      {children}
    </button>
  )
}

/** should be fieldset / legend */
function Section({
  label,
  children,
  button,
}: PropsWithChildren<{ label: string; button?: JSX.Element }>) {
  return (
    <section className="py-6 space-y-6">
      <SectionHeading button={button}>{label}</SectionHeading>
      {children}
    </section>
  )
}

function SectionHeading({
  children,
  button,
}: PropsWithChildren<{ button?: JSX.Element }>) {
  return (
    <HStack className="items-baseline space-x-4">
      <h2 className="text-2xl font-medium">{children}</h2>
      <div className="flex-1 border-b border-gray-200" />
      {button}
    </HStack>
  )
}

function CreateNewActorButton() {
  type ActorFormData = {
    name: string
    email?: string
    website?: string
    affiliations?: Array<{ id: number }>
  }

  const validationSchema = Yup.object()
    .shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      website: Yup.string().url(),
    })
    .defined()

  const [createActor] = useCreateActor()
  const { session } = useAuth()
  const queryCache = useQueryCache()
  const { register, handleSubmit, errors, control, formState } = useForm<
    ActorFormData
  >({
    mode: 'onSubmit',
    resolver: validator(validationSchema),
  })

  const [isOpen, setOpen] = useState(false)
  function open() {
    setOpen(true)
  }
  function close() {
    setOpen(false)
  }

  function onSubmit(formData: ActorFormData) {
    if (session === null || session.accessToken === undefined) return

    const actor = formData
    return createActor([actor, { token: session.accessToken }], {
      onSuccess(actor) {
        toast.success('Successfully created actor.')
        queryCache.invalidateQueries('getActors')
        /** probably not necessay as it's not used anywhere? */
        queryCache.setQueryData(['getActor', actor.id], actor)
      },
      onError(error) {
        const message =
          (error instanceof Error && error.message) || 'Failed to create actor.'
        toast.error(message)
      },
      onSettled() {
        close()
      },
    })
  }

  const isDisabled = formState.isSubmitting

  return (
    <div>
      <button onClick={open} type="button" className="text-sm text-primary-750">
        Create new
      </button>
      <Dialog
        isOpen={isOpen}
        onDismiss={close}
        className="flex flex-col rounded"
        aria-label="Create new actor"
      >
        <button className="self-end" onClick={close} aria-label="Close">
          <CloseIcon width="1em" />
        </button>
        <VStack className="space-y-6">
          <h3 className="text-2xl font-medium">Create new actor</h3>
          {/* this form is rendered in a portal, so it's valid html, even though
          it's a <form> "nested" in another <form>. */}
          <VStack
            as="form"
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              /** avoid triggering onSubmit validation on the parent form */
              e.stopPropagation()
              handleSubmit(onSubmit)(e)
            }}
            className="space-y-6"
          >
            <FormField label="Name" error={errors.name}>
              <TextField
                type="text"
                name="name"
                placeholder="Name"
                ref={register}
                aria-invalid={Boolean(errors.name)}
              />
            </FormField>
            <FormField label="Email" error={errors.email}>
              <TextField
                type="email"
                name="email"
                placeholder="Email"
                ref={register}
                aria-invalid={Boolean(errors.email)}
              />
            </FormField>
            <FormField label="Website" error={errors.website}>
              <TextField
                type="text"
                name="website"
                placeholder="URL"
                ref={register}
                aria-invalid={Boolean(errors.website)}
              />
            </FormField>
            <FormFieldList
              control={control}
              name="affiliations"
              label="Affiliations"
            >
              {(
                field: ArrayField,
                index: number,
                remove: (index: number) => void,
              ) => (
                <HStack className="w-full space-x-8">
                  <FormField
                    label="Name"
                    error={errors.affiliations?.[index]?.id}
                    className="flex-1"
                  >
                    <Controller
                      control={control}
                      name={`affiliations[${index}].id`}
                      render={({ onChange }) => (
                        <ActorCombobox
                          onChange={onChange}
                          aria-invalid={Boolean(
                            errors.affiliations?.[index]?.id,
                          )}
                        />
                      )}
                      defaultValue={field.id}
                    />
                  </FormField>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-sm text-primary-750"
                  >
                    Remove
                  </button>
                </HStack>
              )}
            </FormFieldList>
            <SubmitButton isDisabled={isDisabled}>Create</SubmitButton>
          </VStack>
        </VStack>
      </Dialog>
    </div>
  )
}

function ActorRoleSelect(props: {
  onChange: (code?: string) => void
  'aria-invalid': boolean
}) {
  const { data, status } = useGetAllActorRoles({
    onError(error) {
      const message =
        (error instanceof Error && error.message) ||
        'Failed to load actor roles.'
      toast.error(message)
    },
  })
  const [selected, setSelected] = useState<
    GetAllActorRoles.Response.Success[number]
  >({})

  if (status === 'loading' || data === undefined) {
    return <span>Loading...</span>
  }

  return (
    <Listbox
      value={selected}
      onChange={(role) => {
        setSelected(role)
        props.onChange(role.code)
      }}
    >
      {({ open }) => (
        <div className="relative w-64">
          <Listbox.Button className="inline-flex items-center justify-between w-full p-3 border border-gray-200 divide-x divide-gray-200 rounded hover:text-primary-750 bg-gray-50 focus:bg-gray-50">
            {'label' in selected ? (
              <span className="px-2">{selected.label}</span>
            ) : (
              <span className="px-2 text-gray-500">Choose a role</span>
            )}
            <span className="inline-flex items-center h-full pl-2 justify-content text-secondary-600">
              <Triangle />
            </span>
          </Listbox.Button>
          <FadeIn show={open}>
            <Listbox.Options
              static
              className="absolute min-w-full py-2 mt-1 overflow-hidden whitespace-no-wrap bg-white border border-gray-200 rounded shadow-md select-none"
            >
              {(data ?? []).map((role) => {
                return (
                  <Listbox.Option key={role.code} value={role} as={Fragment}>
                    {({ active, selected }) => (
                      <li
                        className={cx(
                          'px-4 py-3 flex space-x-2 items-center',
                          active === true && 'bg-gray-50',
                          selected === true && 'text-primary-750',
                        )}
                      >
                        <span className="w-6">
                          {selected === true ? <CheckMark /> : null}
                        </span>
                        <span>{role.label}</span>
                      </li>
                    )}
                  </Listbox.Option>
                )
              })}
            </Listbox.Options>
          </FadeIn>
        </div>
      )}
    </Listbox>
  )
}

/**
 * this is a bit hacky, as a combobox allows any text value, but we only allow
 * values from a server-provided list, which makes this behave more like a <select>
 */
function ActorCombobox(props: {
  onChange: (id?: number) => void
  'aria-invalid': boolean
}) {
  const MIN_AUTOCOMPLETE_LENGTH = 2
  const MAX_SUGGESTIONS = 10

  const [searchTerm, setSearchTerm] = useState('')
  const autocompleteTerm = useDebounce(searchTerm.trim(), 150)
  const { data: suggestions } = useGetActors(
    { q: searchTerm },
    {
      enabled: autocompleteTerm.length >= MIN_AUTOCOMPLETE_LENGTH,
      keepPreviousData: true,
      onError(error) {
        const message =
          (error instanceof Error && error.message) || 'Failed to load actors.'
        toast.error(message)
      },
    },
  )
  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value)
  }

  function onSelect({ id, name }: { id?: number; name?: string }) {
    setSearchTerm(name ?? '')
    props.onChange(id)
  }

  return (
    <Combobox aria-label="Actor" openOnFocus className="relative flex-1">
      <ComboboxInput
        autocomplete
        type="search"
        onChange={onChange}
        value={searchTerm}
        placeholder="Search"
        className="w-full p-3 border border-gray-200 rounded placeholder-gray-350 bg-gray-50"
      />
      {autocompleteTerm.length >= MIN_AUTOCOMPLETE_LENGTH &&
      suggestions?.actors !== undefined &&
      suggestions.actors.length > 0 ? (
        <ComboboxPopover
          portal={false}
          className="absolute z-10 w-full py-2 mt-1 bg-white border border-gray-200 rounded shadow-md"
        >
          <ComboboxList className="select-none">
            {suggestions.actors.slice(0, MAX_SUGGESTIONS).map((suggestion) => (
              <ComboboxOption
                key={suggestion.id}
                value={suggestion.name ?? ''}
                className="p-3 truncate hover:bg-gray-50"
                // this is hacky, but (i) we only get the `value`, i.e. the name
                // in the `Combobox#onSelect`` callback, and the popover
                // does not close correctly when using `onSelect`
                // FIXME: this is not keyboard accessible unfortunately
                onClick={() => onSelect(suggestion)}
              />
            ))}
          </ComboboxList>
        </ComboboxPopover>
      ) : null}
    </Combobox>
  )
}

function SourceCombobox(props: {
  onChange: (id?: number) => void
  'aria-invalid': boolean
}) {
  const MIN_AUTOCOMPLETE_LENGTH = 2
  const MAX_SUGGESTIONS = 10

  const [searchTerm, setSearchTerm] = useState('')
  const autocompleteTerm = useDebounce(searchTerm.trim(), 150)
  const { data: suggestions } = useGetSources(
    { q: searchTerm },
    {
      enabled: autocompleteTerm.length >= MIN_AUTOCOMPLETE_LENGTH,
      keepPreviousData: true,
      onError(error) {
        const message =
          (error instanceof Error && error.message) || 'Failed to load sources.'
        toast.error(message)
      },
    },
  )

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value)
  }

  function onSelect({ id, label }: { id?: number; label?: string }) {
    setSearchTerm(label ?? '')
    props.onChange(id)
  }

  return (
    <Combobox aria-label="Actor" openOnFocus className="relative flex-1">
      <ComboboxInput
        autocomplete
        type="search"
        onChange={onChange}
        value={searchTerm}
        placeholder="Search"
        className="w-full p-3 border border-gray-200 rounded placeholder-gray-350 bg-gray-50"
      />
      {autocompleteTerm.length >= MIN_AUTOCOMPLETE_LENGTH &&
      suggestions?.sources !== undefined &&
      suggestions.sources.length > 0 ? (
        <ComboboxPopover
          portal={false}
          className="absolute z-10 w-full py-2 mt-1 bg-white border border-gray-200 rounded shadow-md"
        >
          <ComboboxList className="select-none">
            {suggestions.sources.slice(0, MAX_SUGGESTIONS).map((suggestion) => (
              <ComboboxOption
                key={suggestion.id}
                value={suggestion.label ?? ''}
                className="p-3 truncate hover:bg-gray-50"
                // this is hacky, but (i) we only get the `value`, i.e. the name
                // in the `Combobox#onSelect`` callback, and the popover
                // does not close correctly when using `onSelect`
                onClick={() => onSelect(suggestion)}
              />
            ))}
          </ComboboxList>
        </ComboboxPopover>
      ) : null}
    </Combobox>
  )
}

function PropertyTypeCombobox(props: {
  // onChange: (code?: string) => void
  onChange: (propertyType: PropertyTypeDto) => void
  onSelect: (propertyType: PropertyTypeDto) => void
  'aria-invalid': boolean
}) {
  const MIN_AUTOCOMPLETE_LENGTH = 2
  const MAX_SUGGESTIONS = 10

  const [searchTerm, setSearchTerm] = useState('')
  const autocompleteTerm = useDebounce(searchTerm.trim(), 150)
  const { data: suggestions } = useGetPropertyTypes(
    { q: searchTerm },
    {
      enabled: autocompleteTerm.length >= MIN_AUTOCOMPLETE_LENGTH,
      keepPreviousData: true,
      onError(error) {
        const message =
          (error instanceof Error && error.message) ||
          'Failed to load property types.'
        toast.error(message)
      },
    },
  )

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value)
  }

  function onSelect(propertyType: PropertyTypeDto) {
    const { code, label } = propertyType
    setSearchTerm(label ?? '')
    // props.onChange(code)
    props.onChange(propertyType)
    props.onSelect(propertyType)
  }

  return (
    <Combobox aria-label="Actor" openOnFocus className="relative flex-1">
      <ComboboxInput
        autocomplete
        type="search"
        onChange={onChange}
        value={searchTerm}
        placeholder="Search"
        className="w-full p-3 border border-gray-200 rounded placeholder-gray-350 bg-gray-50"
      />
      {autocompleteTerm.length >= MIN_AUTOCOMPLETE_LENGTH &&
      suggestions?.propertyTypes !== undefined &&
      suggestions.propertyTypes.length > 0 ? (
        <ComboboxPopover
          portal={false}
          className="absolute z-10 w-full py-2 mt-1 bg-white border border-gray-200 rounded shadow-md"
        >
          <ComboboxList className="select-none">
            {suggestions.propertyTypes
              .slice(0, MAX_SUGGESTIONS)
              .map((suggestion) => (
                <ComboboxOption
                  key={suggestion.code}
                  value={suggestion.label ?? ''}
                  className="p-3 truncate hover:bg-gray-50"
                  // this is hacky, but (i) we only get the `value`, i.e. the name
                  // in the `Combobox#onSelect`` callback, and the popover
                  // does not close correctly when using `onSelect`
                  onClick={() => onSelect(suggestion)}
                />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      ) : null}
    </Combobox>
  )
}

/**
 * Map scalars to objects, because `useFieldArray` only handles arrays of objects,
 * not flat arrays.
 */
function normalizeInitialValues(values?: Partial<DatasetDto>) {
  return {
    ...(values ?? {}),
    accessibleAt: values?.accessibleAt?.map((value) => ({ value })),
    source: { ...values?.source },
    properties: values?.properties ?? [],
  }
}
/**
 * Maps objects to scalars, because `useFieldArray` only handles arrays of objects,
 * not flat arrays.
 */
function normalizeFormData(formData: DatasetFormData) {
  return {
    ...(formData ?? {}),
    accessibleAt: formData?.accessibleAt?.map(({ value }) => value),
    source: formData.source?.id !== undefined ? formData.source : undefined,
  }
}
