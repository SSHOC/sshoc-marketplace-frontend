import { useField } from 'react-final-form'

import { identity } from '@/lib/utils'

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export function useFieldState<T>(name: string) {
  // TODO: Use `useForm().getState()` to avoid registering a field.
  const field = useField<T>(name, { allowNull: true, format: identity, parse: identity })

  return field
}
