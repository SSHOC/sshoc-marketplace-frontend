import type { CSSProperties, FC, ForwardedRef, ReactNode, SVGProps } from 'react'
import { forwardRef } from 'react'

import css from '@/lib/core/ui/Icon/Icon.module.css'

export interface IconStyleProps {
  '--icon-color'?: CSSProperties['color']
  '--icon-width'?: CSSProperties['width']
  '--icon-height'?: CSSProperties['height']
  '--icon-rotation'?: `${number}deg`
}

export interface IconProps
  extends Pick<
    SVGProps<SVGSVGElement>,
    'aria-label' | 'aria-labelledby' | 'fill' | 'height' | 'stroke' | 'width'
  > {
  icon: FC<SVGProps<SVGSVGElement> & { title?: ReactNode }>
  rotation?: 'half' | 'quarter' | 'three-quarters'
  style?: IconStyleProps
  title?: ReactNode
}

export const Icon = forwardRef(function Icon(
  props: IconProps,
  forwardedRef: ForwardedRef<SVGSVGElement>,
): JSX.Element {
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    icon: Icon,
    fill = 'currentColor',
    rotation,
    style,
    ...iconProps
  } = props

  return (
    <Icon
      ref={forwardedRef}
      {...iconProps}
      aria-hidden={ariaLabel == null && ariaLabelledby == null}
      className={css['icon']}
      data-rotation={rotation}
      fill={fill}
      focusable={false}
      role="img"
      style={style as CSSProperties}
    />
  )
})
