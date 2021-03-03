import type { ValidationState } from '@react-types/shared'
import type { FieldRenderProps } from 'react-final-form'

export interface FormFieldValidationState {
  validationState?: ValidationState
  validationMessage?: string
}

export function getFormFieldValidationState<T>(
  meta: FieldRenderProps<T>['meta'],
): FormFieldValidationState {
  return {
    validationState:
      meta.touched === true && meta.invalid === true ? 'invalid' : undefined,
    validationMessage: meta.error,
  }
}
