import type { PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'
import type {
  ArrayField,
  Control,
  FieldError,
  // UseFormMethods,
} from 'react-hook-form'
import { useFieldArray } from 'react-hook-form'
import FormFieldErrorMessage from '@/modules/form/FormFieldErrorMessage'

type FormFieldListItem = [
  field: Partial<ArrayField>,
  index: number,
  remove: (index: number) => void,
]

const FormFieldListContext = createContext<FormFieldListItem | null>(null)

export function useFormFieldListItem(): FormFieldListItem {
  const item = useContext(FormFieldListContext)

  if (item === null) {
    throw new Error(
      '`useFormFieldListItem` must be nested inside a `FormFieldListContext.Provider`',
    )
  }

  return item
}

export default function FormFieldList({
  name,
  label,
  error,
  control,
  // trigger,
  children,
}: PropsWithChildren<{
  name: string
  label: string
  error?: FieldError
  control: Control
  // trigger: UseFormMethods['trigger']
}>): JSX.Element {
  const { fields, append, remove } = useFieldArray({
    name,
    control,
    keyName: '_id',
  })

  /** trigger array level validation since `react-hook-form` only handles field validation */
  // useEffect(() => {
  //   trigger(name)
  // }, [trigger, name])

  return (
    <fieldset className="flex flex-col space-y-1">
      <legend className="font-medium text-sm">{label}</legend>
      <ul className="flex flex-col space-y-2">
        {fields.map((field, index) => {
          return (
            <li key={field._id} className="flex">
              {typeof children === 'function' ? (
                children(field, index, remove)
              ) : (
                <FormFieldListContext.Provider value={[field, index, remove]}>
                  {children}
                </FormFieldListContext.Provider>
              )}
            </li>
          )
        })}
      </ul>
      <div className="py-1">
        <button
          type="button"
          onClick={() => append({})}
          className="self-start text-primary-750 text-sm"
        >
          + Add next
        </button>
      </div>
      <FormFieldErrorMessage message={error?.message} />
    </fieldset>
  )
}
