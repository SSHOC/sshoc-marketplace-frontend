import { useId } from '@react-aria/utils'
import type { HTMLAttributes } from 'react'

import type { DisclosureState } from '@/modules/a11y/useDisclosureState'

export interface DisclosureAria {
  triggerProps: HTMLAttributes<HTMLElement>
  panelProps: HTMLAttributes<HTMLElement>
}

export function useDisclosure(state: DisclosureState): DisclosureAria {
  const id = useId()
  const panelId = useId()

  return {
    triggerProps: {
      id,
      'aria-controls': panelId,
      'aria-expanded': state.isOpen,
    },
    panelProps: {
      id: panelId,
      'aria-labelledby': id,
    },
  }
}
