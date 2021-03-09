import cx from 'clsx'
import type { Ref } from 'react'

import styles from '@/modules/layout/GridLayout.module.css'
import type { PropsWithAs } from '@/utils/ts/as'
import { forwardRefWithAs } from '@/utils/ts/as'

type GridLayoutProps = PropsWithAs<unknown, 'main'>

function GridLayout(
  { as: Type = 'main', children, className, ...props }: GridLayoutProps,
  ref: Ref<HTMLElement>,
): JSX.Element {
  const classNames = cx(styles.layout, className)

  return (
    <Type ref={ref} className={classNames} {...props}>
      {children}
    </Type>
  )
}

/**
 * Centered twelve-column layout, plus full-bleed columns.
 *
 * Defaults to content column with max width of `--screen-3xl`.
 * Define a custom max width with `--screen´ custom property.
 * Note that if you just want to limit the max width of the centered
 * content column you can also just define a `max-width` on the
 * `grid-column: 2 / -2`.
 *
 * By default, children use the centered content columns. For
 * full-bleed layout, use `grid-column: 1 / -1;` or
 * tailwind's `col-span-full`.
 *
 * Note: There is a tradeoff between maintaining semantic source order,
 * and being able to use grid-gap and automatic row-spaning in
 * multi-column layouts. Consider a `1fr 70% 30% 1fr` layout, where
 * the left or right column need to bleed to the margin. One approach
 * would be to nest subgrids inside both column containers. However,
 * this would make it much more difficult to sandwich the smaller column
 * into the main column content on smaller viewports. This will be
 * easier once there is better browser support for actual `subgrid`.
 */
const Grid = forwardRefWithAs<unknown, 'main'>(GridLayout)

export default Grid
