import type { PropsWithChildren } from 'react'
import VStack from '@/modules/layout/VStack'

export default function FormFieldLabel({
  label,
  children,
}: PropsWithChildren<{ label: string }>): JSX.Element {
  return (
    <VStack as="label" className="space-y-1 flex-1">
      <span className="font-medium">{label}</span>
      {children}
    </VStack>
  )
}
