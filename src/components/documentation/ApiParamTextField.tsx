import { useApiParams } from '@/components/documentation/useApiParams'
import type { TextFieldProps } from '@/lib/core/ui/TextField/TextField'
import { TextField } from '@/lib/core/ui/TextField/TextField'

export interface ApiParamTextFieldProps
  extends Pick<TextFieldProps, 'aria-label' | 'label' | 'placeholder'> {
  param: string
}

export function ApiParamTextField(props: ApiParamTextFieldProps): JSX.Element {
  const { param } = props

  const { params, setParams } = useApiParams()

  const value = (params[param] as string | undefined) ?? ''

  function onChange(value: string) {
    setParams((params) => {
      return { ...params, [param]: value }
    })
  }

  return <TextField {...props} size="sm" value={value} onChange={onChange} />
}
