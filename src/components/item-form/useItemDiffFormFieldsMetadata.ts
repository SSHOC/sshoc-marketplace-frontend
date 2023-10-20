import { useEffect } from 'react'
import { useForm } from 'react-final-form'

import type { Item, ItemsDiff } from '@/data/sshoc/api/item'

export const status = {
  unchanged: 'unchanged',
  changed: 'changed',
  deleted: 'deleted',
  inserted: 'inserted',
} as const

export type Status = keyof typeof status

export interface DiffFieldMetadata<T = unknown> {
  diff: {
    status: Status
    suggested: T | undefined
    current: T | undefined
  }
}

function withPrefix(name: string, prefix: string | undefined) {
  return prefix != null ? [prefix, name].join('.') : name
}

/**
 * Note: On optional scalar fields, the backend always omits `null` values, so we cannot use
 * `null` to differentiate "unchanged" from "deleted" - hence the string constants.
 */
const UNCHANGED = 'unaltered'
const UNCHANGED_DATE = '0001-01-01T00:00:00+0000'

/**
 * @see https://gitlab.gwdg.de/sshoc/sshoc-marketplace-backend/-/issues/127#note_502140
 * @see https://gitlab.gwdg.de/sshoc/sshoc-marketplace-backend/-/issues/152#note_565636
 */
export function useItemDiffFormFieldsMetadata(diff?: ItemsDiff, prefix?: string): void {
  const form = useForm()

  useEffect(() => {
    if (diff == null) return
    if (diff.equal) return

    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const _setFieldData = form.mutators['setFieldData']!
    const setFieldData = (name: string, data: any) => {
      const state = form.getFieldState(name)
      /**
       * Avoid re-attaching diff data to form fields which have already been reviewed.
       * This can e.g. happen when a workfow step review form is opened again.
       */
      if (state?.data != null && 'diff' in state.data) return
      _setFieldData(name, data)
    }

    requiredScalarField('label', diff, setFieldData, withPrefix('label', prefix))
    requiredScalarField('description', diff, setFieldData, withPrefix('description', prefix))
    optionalScalarField('version', diff, setFieldData, withPrefix('version', prefix))
    /* @ts-expect-error Only on dataset, publication, training-material. */
    optionalDateField('dateCreated', diff, setFieldData, withPrefix('dateCreated', prefix))
    /* @ts-expect-error Only on dataset, publication, training-material. */
    optionalDateField('dateLastUpdated', diff, setFieldData, withPrefix('dateLastUpdated', prefix))
    arrayField('accessibleAt', diff, setFieldData, withPrefix('accessibleAt', prefix))
    arrayField('externalIds', diff, setFieldData, withPrefix('externalIds', prefix))
    arrayField('contributors', diff, setFieldData, withPrefix('contributors', prefix))
    arrayField('properties', diff, setFieldData, withPrefix('properties', prefix))
    arrayField('media', diff, setFieldData, withPrefix('media', prefix))
    arrayField('relatedItems', diff, setFieldData, withPrefix('relatedItems', prefix))

    /**
     * The backend does not provide diff data for the `thumbnail` field.
     * Therefore we calculate manually by comparing `diff.item` against `form.initialValues`.
     */
    // optionalScalarField('thumbnail', diff, setFieldData)
    const initialValues = form.getState().initialValues as Item
    const name = 'thumbnail'
    if (initialValues[name] == null && diff.item[name] != null) {
      setFieldData(name, {
        diff: { status: status.deleted, suggested: diff.other[name], current: diff.item[name] },
      })
    } else if (initialValues[name] != null && diff.item[name] == null) {
      setFieldData(name, {
        diff: { status: status.inserted, suggested: diff.other[name], current: diff.item[name] },
      })
    } else if (
      initialValues[name]?.caption !== diff.item[name]?.caption ||
      initialValues[name]?.concept?.uri !== diff.item[name]?.concept?.uri ||
      initialValues[name]?.info.mediaId !== diff.item[name]?.info.mediaId
    ) {
      setFieldData(name, {
        diff: { status: status.changed, suggested: diff.other[name], current: diff.item[name] },
      })
    }
  }, [form, diff, prefix])
}

function requiredScalarField(
  name: keyof ItemsDiff['item'],
  diff: ItemsDiff,
  setFieldData: (name: string, data: DiffFieldMetadata) => void,
  path: string,
) {
  if (name in diff.other) {
    setFieldData(path, {
      diff: { status: status.changed, suggested: diff.other[name], current: diff.item[name] },
    })
  }
}

function optionalScalarField(
  name: keyof ItemsDiff['item'],
  diff: ItemsDiff,
  setFieldData: (name: string, data: DiffFieldMetadata) => void,
  path: string,
) {
  if (name in diff.other) {
    if (diff.other[name] !== UNCHANGED) {
      if (name in diff.item) {
        setFieldData(path, {
          diff: { status: status.changed, suggested: diff.other[name], current: diff.item[name] },
        })
      } else {
        setFieldData(path, {
          diff: { status: status.inserted, suggested: diff.other[name], current: diff.item[name] },
        })
      }
    }
  } else if (name in diff.item) {
    setFieldData(path, {
      diff: { status: status.deleted, suggested: diff.other[name], current: diff.item[name] },
    })
  }
}

function optionalDateField(
  name: keyof ItemsDiff['item'],
  diff: ItemsDiff,
  setFieldData: (name: string, data: DiffFieldMetadata) => void,
  path: string,
) {
  if (name in diff.other) {
    if (diff.other[name] !== UNCHANGED_DATE) {
      if (name in diff.item) {
        setFieldData(path, {
          diff: { status: status.changed, suggested: diff.other[name], current: diff.item[name] },
        })
      } else {
        setFieldData(path, {
          diff: { status: status.inserted, suggested: diff.other[name], current: diff.item[name] },
        })
      }
    }
  } else if (name in diff.item) {
    setFieldData(path, {
      diff: { status: status.deleted, suggested: diff.other[name], current: diff.item[name] },
    })
  }
}

function arrayField(
  name: keyof ItemsDiff['item'],
  diff: ItemsDiff,
  setFieldData: (name: string, data: DiffFieldMetadata) => void,
  path: string,
) {
  const other = (diff.other[name] ?? []) as Array<unknown>
  const item = (diff.item[name] ?? []) as Array<unknown>

  other.forEach((value, index) => {
    if (value !== null) {
      const field = `${path}[${index}]`
      if (index >= item.length) {
        setFieldData(field, {
          diff: {
            status: status.inserted,
            suggested: diff.other[name]?.[index],
            current: diff.item[name]?.[index],
          },
        })
      } else {
        setFieldData(field, {
          diff: {
            status: status.changed,
            suggested: diff.other[name]?.[index],
            current: diff.item[name]?.[index],
          },
        })
      }
    }
  })
  item.slice(other.length).forEach((value, _index) => {
    const index = _index + other.length
    const field = `${path}[${index}]`
    setFieldData(field, {
      diff: {
        status: status.deleted,
        suggested: diff.other[name]?.[index],
        current: diff.item[name]?.[index],
      },
    })
  })
}
