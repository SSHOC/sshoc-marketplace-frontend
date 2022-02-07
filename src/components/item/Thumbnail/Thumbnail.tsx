import cx from 'clsx'

import type { MediaDetails } from '@/api/sshoc'
import { getMediaThumbnailUrl } from '@/api/sshoc/client'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CloseIcon } from '@/elements/icons/small/cross.svg'
import DocumentIcon from '@/elements/icons/small/document.svg'

export interface ThumbnailProps {
  onRemove?: () => void
  media?: MediaDetails
  caption?: string
  variant?: 'form-diff' | 'form'
}

/**
 * Thumbnail.
 */
export function Thumbnail(props: ThumbnailProps): JSX.Element | null {
  if (props.media == null) return null

  const { mediaId, filename, hasThumbnail, location } = props.media
  const caption = props.caption

  if (mediaId == null) {
    return null
  }

  return (
    <figure className={cx('relative flex flex-col items-center max-w-xs p-2 space-y-2')}>
      {props.onRemove !== undefined ? (
        <button
          onClick={props.onRemove}
          className="absolute flex flex-col items-center justify-center transition bg-white border rounded cursor-default top-6 right-4 hover:bg-gray-200"
          type="button"
        >
          <span className="sr-only">Delete</span>
          <Icon icon={CloseIcon} className="w-5 h-5 p-1" />
        </button>
      ) : null}
      <div
        className={cx(
          'w-full',
          props.variant === 'form-diff' && 'bg-[#EAFBFF] border border-[#92BFF5]',
        )}
      >
        {hasThumbnail === true && mediaId != null ? (
          <img
            src={getMediaThumbnailUrl({ mediaId })}
            alt=""
            className="object-contain w-full h-48 rounded shadow-md"
          />
        ) : (
          <div className="grid object-contain w-full h-48 rounded shadow-md place-items-center">
            <img src={DocumentIcon} alt="" className="w-6 h-6" />
          </div>
        )}
      </div>
      <figcaption className="break-all">{caption ?? filename ?? location?.sourceUrl}</figcaption>
    </figure>
  )
}
