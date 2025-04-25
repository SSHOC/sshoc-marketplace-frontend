import type { ItemMediaInput } from '@/data/sshoc/api/item'
import { getMediaThumbnailUrl } from '@/data/sshoc/api/media'
import css from '@/lib/core/ui/Thumbnail/Thumbnail.module.css'

export interface ThumbnailProps {
  /** @default 'primary' */
  color?: 'form' | 'primary'
  value?: ItemMediaInput
}

export function Thumbnail(props: ThumbnailProps): JSX.Element | null {
  const { color = 'primary', value } = props

  if (value == null) {
    return null
  }

  return (
    <figure className={css['figure']} data-color={color}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={String(getMediaThumbnailUrl({ mediaId: value.info.mediaId }))} alt="" />
      {value.caption != null ? <figcaption>{value.caption}</figcaption> : null}
    </figure>
  )
}
