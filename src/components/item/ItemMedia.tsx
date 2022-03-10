import { useButton } from '@react-aria/button'
import { VisuallyHidden } from '@react-aria/visually-hidden'
import type { AriaButtonProps } from '@react-types/button'
import { Fragment, useRef, useState } from 'react'

import css from '@/components/item/ItemMedia.module.css'
import type { Item } from '@/data/sshoc/api/item'
import { getMediaThumbnailUrl, getMediaUrl, isMediaDetailsUrl } from '@/data/sshoc/api/media'
import { useI18n } from '@/lib/core/i18n/useI18n'
import { Icon } from '@/lib/core/ui/Icon/Icon'
import ChevronIcon from '@/lib/core/ui/icons/chevron.svg?symbol-icon'
import DocumentIcon from '@/lib/core/ui/icons/document.svg?symbol-icon'

export interface ItemMediaProps {
  media: Item['media']
}

export function ItemMedia(props: ItemMediaProps): JSX.Element {
  const { media } = props

  const { t } = useI18n<'common'>()
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)

  if (media.length === 0) {
    return <Fragment />
  }

  function onPreviousMedia() {
    setCurrentMediaIndex((index) => {
      return (index - 1 + media.length) % media.length
    })
  }

  function onNextMedia() {
    setCurrentMediaIndex((index) => {
      return (index + 1) % media.length
    })
  }

  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const currentMedia = media[currentMediaIndex]!

  /** Allow circle for more than 1 item. */
  const hasMultipleMedia = media.length > 1
  const hasPrevious = hasMultipleMedia
  const hasNext = hasMultipleMedia

  return (
    <section className={css['container']}>
      <h2>
        <VisuallyHidden>{t(['common', 'item', 'media', 'other'])}</VisuallyHidden>
      </h2>
      <div className={css['carousel-container']}>
        <figure className={css['media-container']}>
          <Media media={currentMedia} />
          <MediaCaption media={currentMedia} />
        </figure>
        {hasMultipleMedia ? (
          <nav aria-label={t(['common', 'item', 'media', 'other'])}>
            <ol role="list" className={css['carousel-controls']}>
              <li data-direction="prev">
                <Button onPress={onPreviousMedia} isDisabled={!hasPrevious}>
                  <Icon icon={ChevronIcon} aria-label={t(['common', 'item', 'previous-media'])} />
                </Button>
              </li>
              <li>
                <ol role="list" className={css['thumbnails']}>
                  {media.map((m, index) => {
                    const hasThumbnail = m.info.hasThumbnail

                    return (
                      <li key={m.info.mediaId}>
                        <Button
                          onPress={() => {
                            setCurrentMediaIndex(index)
                          }}
                          // TODO: should label use caption?
                          aria-label={t(['common', 'item', 'go-to-media'], {
                            values: { media: String(index) },
                          })}
                        >
                          {hasThumbnail ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              loading="lazy"
                              src={String(getMediaThumbnailUrl({ mediaId: m.info.mediaId }))}
                              alt=""
                            />
                          ) : (
                            <Icon icon={DocumentIcon} />
                          )}
                        </Button>
                      </li>
                    )
                  })}
                </ol>
              </li>
              <li data-direction="next">
                <Button onPress={onNextMedia} isDisabled={!hasNext}>
                  <Icon icon={ChevronIcon} aria-label={t(['common', 'item', 'next-media'])} />
                </Button>
              </li>
            </ol>
          </nav>
        ) : null}
      </div>
    </section>
  )
}

interface MediaProps {
  media: Item['media'][number]
}

function Media(props: MediaProps): JSX.Element {
  const { media } = props
  const { info, caption } = media
  const url = isMediaDetailsUrl(info)
    ? info.location.sourceUrl
    : String(getMediaUrl({ mediaId: info.mediaId }))

  const { t } = useI18n<'common'>()

  switch (media.info.category) {
    case 'embed':
      return (
        <iframe
          src={url}
          sandbox=""
          loading="lazy"
          title={caption ?? t(['common', 'item', 'embedded-content'])}
          allow="fullscreen; picture-in-picture"
          referrerPolicy="no-referrer"
        />
      )
    case 'image':
    case 'thumbnail':
      /* eslint-disable-next-line @next/next/no-img-element */
      return <img src={url} alt={caption ?? ''} loading="lazy" />
    case 'object':
      return (
        <a download href={url}>
          <Icon icon={DocumentIcon} />
          {t(['common', 'item', 'download-media'])}
        </a>
      )
    case 'video':
      /* eslint-disable-next-line jsx-a11y/media-has-caption */
      return <video src={url} />
    default:
      return <Fragment />
  }
}

interface MediaCaptionProps {
  media: Item['media'][number]
}

function MediaCaption(props: MediaCaptionProps): JSX.Element {
  const { media } = props
  const caption = media.caption
  const license = media.concept?.label

  if (caption == null && license == null) {
    return <Fragment />
  }

  return (
    <figcaption>
      {caption}
      {license != null ? <span>({license})</span> : null}
    </figcaption>
  )
}

type ButtonProps = AriaButtonProps<'button'>

// TODO: <Button variant="ghost" />
function Button(props: ButtonProps): JSX.Element {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, buttonRef)

  return (
    <button {...buttonProps} ref={buttonRef} className={css['button']}>
      {props.children}
    </button>
  )
}
