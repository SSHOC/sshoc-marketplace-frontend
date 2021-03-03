import type { ToggleState } from '@react-stately/toggle'
import { useToggleState } from '@react-stately/toggle'
import type { ToggleProps } from '@react-types/checkbox'

export interface DisclosureState {
  toggle: ToggleState['toggle']
  isOpen: ToggleState['isSelected']
  setOpen: ToggleState['setSelected']
}

export interface DisclosureStateProps
  extends Omit<ToggleProps, 'defaultSelected' | 'isSelected'> {
  defaultOpen?: ToggleProps['defaultSelected']
  isOpen?: ToggleProps['isSelected']
}

export function useDisclosureState(
  props: DisclosureStateProps,
): DisclosureState {
  const state = useToggleState({
    ...props,
    defaultSelected: props.defaultOpen,
    isSelected: props.isOpen,
  })

  return {
    toggle: state.toggle,
    setOpen: state.setSelected,
    isOpen: state.isSelected,
  }
}
