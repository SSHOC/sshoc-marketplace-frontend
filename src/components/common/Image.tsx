import type { ImageProps as NextImageProps } from 'next/image'
import NextImage from 'next/image'

export type ImageProps = NextImageProps

export function Image(props: ImageProps): JSX.Element {
  const showPlaceholder =
    typeof props.src === 'string'
      ? props.blurDataURL != null
      : (props.src as StaticImageData).blurDataURL != null

  return (
    <NextImage
      sizes="55rem"
      layout="responsive"
      placeholder={showPlaceholder ? 'blur' : undefined}
      {...props}
    />
  )
}
