import { useField } from 'react-final-form'

export interface FormHiddenFieldProps {
  name: string
}

export function FormHiddenField(props: FormHiddenFieldProps): JSX.Element {
  const { input } = useField(props.name)

  return <input {...input} type="hidden" />
}
