import type { CSSProperties } from 'react'

import type { ThumbnailProps } from '@/components/item/Thumbnail/Thumbnail'
import { Thumbnail } from '@/components/item/Thumbnail/Thumbnail'
import { FormField } from '@/modules/form/FormField'

export interface FormThumbnailProps extends ThumbnailProps {
  name: string
  style?: CSSProperties
}

/**
 * TextField form component.
 */
export function FormThumbnail(props: FormThumbnailProps): JSX.Element {
  return (
    <FormField name={props.name}>
      {({ input }) => {
        if (input.value == null) return null

        return (
          <Thumbnail
            {...props}
            media={input.value.info}
            caption={input.value.caption}
          />
        )
      }}
    </FormField>
  )
}
