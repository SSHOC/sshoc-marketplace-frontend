import type { SeparatorProps as AriaSeparatorProps } from '@react-aria/separator'
import { useSeparator } from '@react-aria/separator'
import cx from 'clsx'

export interface SeparatorProps extends AriaSeparatorProps {
  className?: string
}

/**
 * Separator.
 */
export function Separator(props: SeparatorProps): JSX.Element {
  const ElementType = props.orientation === 'vertical' ? 'div' : 'hr'

  const { separatorProps } = useSeparator({
    ...props,
    elementType: ElementType,
  })

  const styles = {
    horizontal: cx('h-px bg-gray-250 w-full', props.className),
    vertical: cx('w-px bg-gray-250 h-full', props.className),
  }

  if (props.orientation === 'vertical') {
    return (
      <ElementType {...separatorProps} className={styles.vertical}>
        &nbsp;
      </ElementType>
    )
  }

  return <ElementType {...separatorProps} className={styles.horizontal} />
}
