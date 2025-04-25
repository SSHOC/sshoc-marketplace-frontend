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
export function useItemDiffFormFieldsMetadata(diff?: ItemsDiff): void {
  const form = useForm()

  useEffect(() => {
    if (diff == null) {return}
    if (diff.equal) {return}

     
    const setFieldData = form.mutators['setFieldData']!

    requiredScalarField('label', diff, setFieldData)
    requiredScalarField('description', diff, setFieldData)
    optionalScalarField('version', diff, setFieldData)
    /* @ts-expect-error Only on dataset, publication, training-material. */
    optionalDateField('dateCreated', diff, setFieldData)
    /* @ts-expect-error Only on dataset, publication, training-material. */
    optionalDateField('dateLastUpdated', diff, setFieldData)
    arrayField('accessibleAt', diff, setFieldData)
    arrayField('externalIds', diff, setFieldData)
    arrayField('contributors', diff, setFieldData)
    arrayField('properties', diff, setFieldData)
    arrayField('media', diff, setFieldData)
    arrayField('relatedItems', diff, setFieldData)

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
  }, [form, diff])
}

function requiredScalarField(
  name: keyof ItemsDiff['item'],
  diff: ItemsDiff,
  setFieldData: (name: string, data: DiffFieldMetadata) => void,
) {
  if (name in diff.other) {
    setFieldData(name, {
      diff: { status: status.changed, suggested: diff.other[name], current: diff.item[name] },
    })
  }
}

function optionalScalarField(
  name: keyof ItemsDiff['item'],
  diff: ItemsDiff,
  setFieldData: (name: string, data: DiffFieldMetadata) => void,
) {
  if (name in diff.other) {
    if (diff.other[name] !== UNCHANGED) {
      if (name in diff.item) {
        setFieldData(name, {
          diff: { status: status.changed, suggested: diff.other[name], current: diff.item[name] },
        })
      } else {
        setFieldData(name, {
          diff: { status: status.inserted, suggested: diff.other[name], current: diff.item[name] },
        })
      }
    }
  } else if (name in diff.item) {
    setFieldData(name, {
      diff: { status: status.deleted, suggested: diff.other[name], current: diff.item[name] },
    })
  }
}

function optionalDateField(
  name: keyof ItemsDiff['item'],
  diff: ItemsDiff,
  setFieldData: (name: string, data: DiffFieldMetadata) => void,
) {
  if (name in diff.other) {
    if (diff.other[name] !== UNCHANGED_DATE) {
      if (name in diff.item) {
        setFieldData(name, {
          diff: { status: status.changed, suggested: diff.other[name], current: diff.item[name] },
        })
      } else {
        setFieldData(name, {
          diff: { status: status.inserted, suggested: diff.other[name], current: diff.item[name] },
        })
      }
    }
  } else if (name in diff.item) {
    setFieldData(name, {
      diff: { status: status.deleted, suggested: diff.other[name], current: diff.item[name] },
    })
  }
}

function arrayField(
  name: keyof ItemsDiff['item'],
  diff: ItemsDiff,
  setFieldData: (name: string, data: DiffFieldMetadata) => void,
) {
  const other = diff.other[name] as Array<unknown>
  const item = diff.item[name] as Array<unknown>

  other.forEach((value, index) => {
    if (value !== null) {
      const field = `${name}[${index}]`
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
    const field = `${name}[${index}]`
    setFieldData(field, {
      diff: {
        status: status.deleted,
        suggested: diff.other[name]?.[index],
        current: diff.item[name]?.[index],
      },
    })
  })
}
