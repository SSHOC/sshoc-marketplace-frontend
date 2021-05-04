import { mergeProps } from '@react-aria/utils'
import type { ChangeEvent } from 'react'
import { Fragment, useState } from 'react'

import { Button } from '@/elements/Button/Button'
import { Field } from '@/elements/Field/Field'
import DocumentIcon from '@/elements/icons/small/document.svg'
import type { TextFieldProps } from '@/elements/TextField/TextField'
import { useErrorMessage } from '@/modules/a11y/useErrorMessage'

export interface FileInputProps
  extends Omit<TextFieldProps, 'type' | 'onChange'> {
  accept?: string
  multiple?: boolean
  onChange?: (files: FileList | null) => void
}

/**
 * File input.
 */
export function FileInput(props: FileInputProps): JSX.Element {
  const inputProps = {}
  const labelProps = {}
  const { fieldProps, errorMessageProps } = useErrorMessage(props)
  const [files, setFiles] = useState<FileList | null>(null)
  const [, forceRender] = useState(false)

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.currentTarget.files
    setFiles(files)
    // FileList is being mutated, so we force rerender
    forceRender((v) => !v)
    props.onChange?.(files)
  }

  const BrowseButton = (
    <label>
      {/* @ts-expect-error react-aria types hickup. */}
      <Button elementType="span" variant="gradient">
        Browse
      </Button>
      <input
        type="file"
        onChange={onChange}
        name={props.name}
        accept={props.accept}
        multiple={props.multiple}
        className="sr-only"
        {...mergeProps(inputProps, fieldProps)}
      />
    </label>
  )

  const Previews = (
    <Fragment>
      {files !== null ? (
        <ul className="grid grid-cols-2 gap-4 py-2">
          {Array.from(files).map((file) => {
            const preview = file.type.startsWith('image') ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview thumbnail"
                className="object-contain w-48 h-48 rounded shadow-md"
              />
            ) : file.type.startsWith('video') ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={URL.createObjectURL(file)}
                className="object-contain w-48 h-48 rounded shadow-md"
              />
            ) : (
              <div className="grid object-contain w-full h-48 rounded shadow-md place-items-center">
                <img src={DocumentIcon} alt="" className="w-6 h-6" />
              </div>
            )
            return (
              <li key={file.name} className="flex flex-col space-y-2">
                <figure className="flex flex-col space-y-2">
                  {preview}
                  <figcaption>
                    {file.name} ({toHumanReadableSize(file.size)})
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      ) : null}
    </Fragment>
  )

  return (
    <Field
      label={props.label}
      labelElementType="span"
      labelProps={labelProps}
      isDisabled={props.isDisabled}
      isRequired={props.isRequired}
      necessityIndicator={props.necessityIndicator}
      validationState={props.validationState}
      validationMessage={props.validationMessage}
      errorMessageProps={errorMessageProps}
      style={props.style}
    >
      <Fragment>
        {Previews}
        {BrowseButton}
      </Fragment>
    </Field>
  )
}

function toHumanReadableSize(bytes: number) {
  const kb = Math.round(bytes / 1024)
  return `${kb} kb`
}
