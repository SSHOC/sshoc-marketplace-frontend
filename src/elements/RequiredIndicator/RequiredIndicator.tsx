import { useMessageFormatter } from '@react-aria/i18n'
import type { NecessityIndicator } from '@react-types/shared'

import { Icon } from '@/elements/Icon/Icon'
import { Svg as AsteriskIcon } from '@/elements/icons/small/asterisk.svg'
import dictionary from '@/elements/RequiredIndicator/dictionary.json'

export interface RequiredIndicatorProps {
  isRequired?: boolean
  /** @default "icon" */
  necessityIndicator?: NecessityIndicator
}

/**
 * Indicates if a form field is required or not.
 */
export function RequiredIndicator(
  props: RequiredIndicatorProps,
): JSX.Element | null {
  const t = useMessageFormatter(dictionary)

  const isRequired = props.isRequired === true
  const necessityIndicator = props.necessityIndicator ?? 'icon'

  if (necessityIndicator === 'label') {
    /**
     * When the field is required, `aria-required` is already set, so the
     * label should not be exposed to screen readers, but for optional
     * fields it should be exposed.
     */
    return (
      <span aria-hidden={isRequired || undefined}>
        ({isRequired ? t('required') : t('optional')})
      </span>
    )
  }

  /** necessityIndicator === 'icon' */
  if (isRequired) {
    return <Icon icon={AsteriskIcon} className="h-2 mt-1" />
  }

  return null
}
