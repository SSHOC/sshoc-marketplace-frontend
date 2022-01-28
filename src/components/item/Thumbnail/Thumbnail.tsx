import cx from 'clsx'
import type { CSSProperties } from 'react'

import type { MediaDetails } from '@/api/sshoc'
import { getMediaThumbnailUrl } from '@/api/sshoc/client'
import { Icon } from '@/elements/Icon/Icon'
import { Svg as CloseIcon } from '@/elements/icons/small/cross.svg'
import DocumentIcon from '@/elements/icons/small/document.svg'

export interface ThumbnailProps {
  onRemove?: () => void
  media?: MediaDetails
  caption?: string
  variant?: 'form' | 'form-diff'
  isReadOnly?: boolean
  style?: CSSProperties
}

/**
 * Thumbnail.
 */
export function Thumbnail(props: ThumbnailProps): JSX.Element | null {
  if (props.media == null) return null

  const { mediaId, filename, hasThumbnail, location } = props.media
  const caption = props.caption

  return (
    <figure
      className={cx(
        'relative flex flex-col items-center max-w-xs p-2 gap-y-2',
        props.isReadOnly === true && 'pointer-events-none',
      )}
      style={props.style}
    >
      {props.onRemove !== undefined && props.isReadOnly !== true ? (
        <button
          onClick={props.onRemove}
          className="absolute flex flex-col items-center justify-center transition bg-white border rounded cursor-default top-4 right-4 hover:bg-gray-200"
          type="button"
        >
          <span className="sr-only">Delete</span>
          <Icon icon={CloseIcon} className="w-5 h-5 p-1" />
        </button>
      ) : null}
      {hasThumbnail === true && mediaId != null ? (
        <img
          src={getMediaThumbnailUrl({ mediaId })}
          alt=""
          className={cx(
            'object-contain w-full h-48 rounded shadow-md',
            props.variant === 'form-diff' && 'bg-[#EAFBFF]',
          )}
        />
      ) : (
        <div
          className={cx(
            'grid object-contain w-full h-48 rounded shadow-md place-items-center',
            props.variant === 'form-diff' && 'bg-[#EAFBFF]',
          )}
        >
          <img src={DocumentIcon} alt="" className="w-6 h-6" />
        </div>
      )}
      <figcaption className="break-all">
        {caption ?? filename ?? location?.sourceUrl}
      </figcaption>
    </figure>
  )
}
