import css from '@/components/item/ItemThumbnail.module.css'
import type { Item } from '@/data/sshoc/api/item'
import { getMediaThumbnailUrl } from '@/data/sshoc/api/media'

export interface ItemThumbnailProps {
  thumbnail: Exclude<Item['thumbnail'], undefined>
}
export function ItemThumbnail(props: ItemThumbnailProps): JSX.Element {
  const mediaId = props.thumbnail.info.mediaId

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={String(getMediaThumbnailUrl({ mediaId }))}
      alt=""
      className={css['thumbnail']}
      width={80}
      height={80}
    />
  )
}
