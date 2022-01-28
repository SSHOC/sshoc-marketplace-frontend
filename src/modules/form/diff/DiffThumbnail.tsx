import { Fragment } from 'react'

import { Thumbnail } from '@/components/item/Thumbnail/Thumbnail'
// import { HelpText } from '@/elements/HelpText/HelpText'
import { useDiffStateContext } from '@/modules/form/diff/DiffStateContext'

import type { FormThumbnailProps } from '../components/FormThumbnail/FormThumbnail'
import { FormThumbnail } from '../components/FormThumbnail/FormThumbnail'

export interface DiffThumbnailProps extends FormThumbnailProps {
  name: string
  approvedValue: { info: any; caption: any } | null
}

export function DiffThumbnail({
  approvedValue,
  ...props
}: DiffThumbnailProps): JSX.Element {
  const { requiresReview, status } = useDiffStateContext()

  if (!requiresReview) {
    return <FormThumbnail {...props} />
  }

  return (
    <Fragment>
      {status !== 'deleted' ? (
        <FormThumbnail
          {...props}
          variant="form-diff"
          /** Require either approve or reject before allowing further edits. */
          isReadOnly
          /** Dont' show helptext *between* fields. */
          // helpText={undefined}
          // onRemove={undefined}
        />
      ) : null}
      {status !== 'inserted' ? (
        <Thumbnail
          // aria-label={
          //   status !== 'deleted' ? props.label + ' (approved)' : undefined
          // }
          // label={status === 'deleted' ? props.label : undefined}
          isReadOnly
          media={approvedValue?.info}
          caption={approvedValue?.caption}
          variant={status === 'deleted' ? 'form-diff' : 'form'}
          style={{
            textDecoration:
              status === 'deleted' ? 'line-through 2px' : undefined,
            ...props.style,
          }}
        />
      ) : null}
      {/* <HelpText>{props.helpText}</HelpText> */}
    </Fragment>
  )
}
