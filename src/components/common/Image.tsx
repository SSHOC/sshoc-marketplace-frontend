import type { ImageProps as NextImageProps } from 'next/image'
import NextImage from 'next/image'

export type ImageProps = NextImageProps

export function Image(props: ImageProps): JSX.Element {
  if (typeof props.src === 'string' && (props.width == null || props.height == null)) {
    return <img src={props.src} alt={props.alt ?? ''} />
  }

  return (
    <NextImage
      sizes="55rem"
      layout="responsive"
      placeholder={props.blurDataURL != null ? 'blur' : undefined}
      {...props}
    />
  )
}
