import type { ItemInput } from '@/data/sshoc/api/item'
import { isNonEmptyString } from '@/lib/utils'

export function removeEmptyItemFields<T extends ItemInput>(values: T): T {
  const item = {} as any

  Object.entries(values).forEach(([key, value]) => {
    switch (key) {
      case 'accessibleAt': {
        if (Array.isArray(value)) {
          item[key] = value.filter((v: unknown) => {
            if (v == null) return false
            return true
          })
        }
        break
      }

      case 'externalIds': {
        if (Array.isArray(value)) {
          item[key] = value.filter((v: unknown) => {
            if (v == null) return false
            return true
          })
        }
        break
      }

      case 'contributors': {
        if (Array.isArray(value)) {
          item[key] = value.filter((v: unknown) => {
            if (v == null) return false
            return true
          })
        }
        break
      }

      case 'properties': {
        if (Array.isArray(value)) {
          item[key] = value.filter((v: any) => {
            if (v == null) return false
            if (v.type?.code == null) return false
            if (v.concept?.uri == null && !isNonEmptyString(v.value)) return false
            return true
          })
        }
        break
      }

      case 'relatedItems': {
        if (Array.isArray(value)) {
          item[key] = value.filter((v: unknown) => {
            if (v == null) return false
            return true
          })
        }
        break
      }

      case 'media': {
        if (Array.isArray(value)) {
          item[key] = value.filter((v: unknown) => {
            if (v == null) return false
            return true
          })
        }
        break
      }

      default: {
        item[key] = value
        break
      }
    }
  })

  return item
}
