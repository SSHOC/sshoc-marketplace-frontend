import cx from 'clsx'
import type { PropsWithChildren } from 'react'
import type { FieldError } from 'react-hook-form'
import FormFieldErrorMessage from '@/modules/hook-form/FormFieldErrorMessage'
import FormFieldLabel from '@/modules/hook-form/FormFieldLabel'
import VStack from '@/modules/layout/VStack'

export default function FormField({
  label,
  error,
  className,
  children,
}: PropsWithChildren<{
  label?: string
  error?: FieldError
  className?: string
}>): JSX.Element {
  return (
    <VStack className={cx('space-y-1', className)}>
      {label !== undefined ? (
        <FormFieldLabel label={label}>{children}</FormFieldLabel>
      ) : (
        children
      )}
      <FormFieldErrorMessage message={error?.message} />
    </VStack>
  )
}
