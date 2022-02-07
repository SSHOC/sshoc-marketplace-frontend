import { useMessageFormatter } from '@react-aria/i18n'
import { useProgressBar } from '@react-aria/progress'
import type { AriaProgressCircleProps } from '@react-types/progress'
import type { SVGProps } from 'react'

import dictionary from '@/elements/ProgressSpinner/dictionary.json'

export interface ProgressSpinnerProps extends Omit<AriaProgressCircleProps, 'isIndeterminate'> {
  className?: string
}

/**
 * Progress spinner.
 */
export function ProgressSpinner(props: ProgressSpinnerProps): JSX.Element {
  const t = useMessageFormatter(dictionary)
  const { progressBarProps } = useProgressBar({
    ...props,
    'aria-label': props['aria-label'] ?? t('loading'),
    isIndeterminate: true,
  })

  const center = 16
  const strokeWidth = 4
  const r = 16 - strokeWidth
  const c = 2 * r * Math.PI
  const offset = c - (1 / 4) * c

  const styles = {
    spinner: props.className,
  }

  return (
    <svg
      {...(progressBarProps as SVGProps<SVGSVGElement>)}
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      strokeWidth={strokeWidth}
      className={styles.spinner}
    >
      <circle
        role="presentation"
        cx={center}
        cy={center}
        r={r}
        stroke="currentColor"
        opacity={0.25}
      />
      <circle
        role="presentation"
        cx={center}
        cy={center}
        r={r}
        stroke="currentColor"
        strokeDasharray={c}
        strokeDashoffset={offset}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          begin="0s"
          dur="1s"
          from="0 16 16"
          to="360 16 16"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  )
}
