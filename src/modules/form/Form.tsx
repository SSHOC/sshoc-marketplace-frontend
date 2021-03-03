import arrayMutators from 'final-form-arrays'
import focusOnFirstError from 'final-form-focus'
import type { FormProps as FinalFormProps } from 'react-final-form'
import { Form as FinalForm } from 'react-final-form'

const decorators = [focusOnFirstError()]
const mutators = { ...arrayMutators }

export type FormProps<T> = FinalFormProps<T>

export function Form<T>(props: FormProps<T>): JSX.Element {
  return (
    <FinalForm
      {...props}
      /* @ts-expect-error Decorators need generic, but we want to initialize them in module scope. */
      decorators={decorators}
      mutators={mutators}
    />
  )
}
