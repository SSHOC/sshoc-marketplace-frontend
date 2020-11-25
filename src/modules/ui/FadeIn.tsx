import { Transition } from '@headlessui/react'
import type { PropsWithChildren } from 'react'

export default function FadeIn({
  show,
  children,
}: PropsWithChildren<{ show: boolean }>): JSX.Element {
  return (
    <Transition
      show={show}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {children}
    </Transition>
  )
}
