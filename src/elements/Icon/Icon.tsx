import type { FC, SVGProps } from 'react'

export interface IconProps {
  className?: string
  /**
   * Title props is handled when svg is imported via `@stefanprobst/next-svg`,
   * because we set `titleProps: true` in `next.config.js`.
   */
  icon: FC<SVGProps<SVGSVGElement> & { title?: string }>
  'aria-label'?: string
  /** @default true */
  'aria-hidden'?: boolean
  height?: string | number
  title?: string
}

/**
 * Wrapper for svg icons.
 *
 * Note: this could be automated with a `svgr` template.
 */
export function Icon(props: IconProps): JSX.Element {
  const label = props['aria-label']
  const isHidden = label !== undefined ? props['aria-hidden'] === true : true
  const Svg = props.icon
  const height = props.height ?? '1em'

  const styles = {
    icon: props.className,
  }

  return (
    <Svg
      height={height}
      className={styles.icon}
      aria-hidden={isHidden || undefined}
      aria-label={label}
      role="img"
      title={props.title}
    />
  )
}
